import { 
  makeWASocket, 
  DisconnectReason, 
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from 'whaileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

import { processMessage } from './index.js';
import config from './config.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Diretório para sessão de autenticação
const AUTH_DIR = join(dirname(__dirname), 'auth_info');

// Logger silencioso para produção
const logger = pino({ level: 'silent' });

/**
 * Inicia o bot WhatsApp
 */
export async function startBot() {
  // Garante que o diretório de auth existe
  if (!existsSync(AUTH_DIR)) {
    mkdirSync(AUTH_DIR, { recursive: true });
  }
  
  // Carrega estado de autenticação
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  
  // Obtém última versão do Baileys
  const { version } = await fetchLatestBaileysVersion();
  
  console.log(`📱 Conectando ao WhatsApp...`);
  console.log(`🤖 Bot: ${config.nomebot}`);
  console.log(`📌 Prefixo: ${config.prefixo}`);
  console.log(`📦 Baileys version: ${version.join('.')}\n`);
  
  // Cria socket do WhatsApp
  const sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false, // Usamos qrcode-terminal customizado
    browser: [config.nomebot, 'Chrome', '120.0.0'],
    syncFullHistory: false,
    markOnlineOnConnect: true
  });
  
  // Handler de eventos de conexão
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    // Exibe QR Code
    if (qr) {
      console.log('📸 Escaneie o QR Code abaixo:\n');
      qrcode.generate(qr, { small: true });
      console.log('\n💡 Abra o WhatsApp > Dispositivos Conectados > Conectar Dispositivo\n');
    }
    
    // Conexão estabelecida
    if (connection === 'open') {
      console.log('✅ Conectado com sucesso!');
      console.log(`🤖 ${config.nomebot} está online!\n`);
      console.log('━'.repeat(40));
      console.log('📋 Comandos disponíveis com prefixo:', config.prefixo);
      console.log('━'.repeat(40) + '\n');
    }
    
    // Conexão fechada
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      
      console.log('\n⚠️  Conexão fechada. Motivo:', getDisconnectReason(reason));
      
      if (shouldReconnect) {
        console.log('🔄 Reconectando em 5 segundos...\n');
        setTimeout(() => startBot(), 5000);
      } else {
        console.log('❌ Deslogado do WhatsApp. Exclua a pasta auth_info e escaneie o QR novamente.');
      }
    }
  });
  
  // Salva credenciais quando atualizadas
  sock.ev.on('creds.update', saveCreds);
  
  // Handler de novas mensagens
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    
    for (const msg of messages) {
      // Ignora mensagens de status e próprias
      if (msg.key.remoteJid === 'status@broadcast') continue;
      if (msg.key.fromMe) continue;
      
      // Processa a mensagem
      try {
        await processMessage(sock, msg);
      } catch (error) {
        console.error('❌ Erro ao processar mensagem:', error.message);
      }
    }
  });
  
  // TODO: Handler para anti-delete (se necessário)
  // sock.ev.on('messages.update', async (updates) => { ... });
  
  // TODO: Handler para fila de mensagens (se necessário)
  // Implementar rate limiting e queue para mensagens
  
  return sock;
}

/**
 * Retorna descrição do motivo da desconexão
 * @param {number} reason - Código do motivo
 * @returns {string} Descrição
 */
function getDisconnectReason(reason) {
  const reasons = {
    [DisconnectReason.connectionClosed]: 'Conexão fechada',
    [DisconnectReason.connectionLost]: 'Conexão perdida',
    [DisconnectReason.connectionReplaced]: 'Conexão substituída',
    [DisconnectReason.timedOut]: 'Tempo esgotado',
    [DisconnectReason.loggedOut]: 'Deslogado',
    [DisconnectReason.badSession]: 'Sessão inválida',
    [DisconnectReason.restartRequired]: 'Reinício necessário',
    [DisconnectReason.multideviceMismatch]: 'Incompatibilidade multi-device'
  };
  
  return reasons[reason] || `Desconhecido (${reason})`;
}

export default { startBot };
