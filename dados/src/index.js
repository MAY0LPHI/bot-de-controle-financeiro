import config from './config.json' with { type: 'json' };
import { getCommand, hasCommand } from './funcs/exports.js';
import { gerarMenu, gerarAjudaRapida } from './menus/index.js';
import { extrairArgs } from './helpers.js';

/**
 * Processa uma mensagem recebida
 * @param {Object} sock - Socket do WhatsApp
 * @param {Object} msg - Mensagem recebida
 */
export async function processMessage(sock, msg) {
  // Extrai informações da mensagem
  const jid = msg.key.remoteJid;
  const isGroup = jid.endsWith('@g.us');
  const sender = isGroup ? msg.key.participant : jid;
  
  // Obtém o texto da mensagem
  const text = getMessageText(msg);
  if (!text) return;
  
  // Verifica se é um comando (começa com prefixo)
  const prefixo = config.prefixo || '!';
  if (!text.startsWith(prefixo)) return;
  
  // Extrai comando e argumentos
  const fullCommand = text.slice(prefixo.length).trim();
  const [comando, ...argsParts] = fullCommand.split(/\s+/);
  const args = argsParts.join(' ');
  
  const comandoLower = comando.toLowerCase();
  
  console.log(`📨 Comando: ${prefixo}${comandoLower} | De: ${sender.split('@')[0]}`);
  
  // Marca como lido se configurado
  if (config.autoRead) {
    await sock.readMessages([msg.key]);
  }
  
  try {
    let resposta;
    
    // Comandos de menu/ajuda
    if (['menu', 'ajuda', 'help', 'comandos'].includes(comandoLower)) {
      const nomeUsuario = await getContactName(sock, sender);
      resposta = gerarMenu(nomeUsuario);
    }
    // Ajuda rápida
    else if (['dica', 'dicas', 'inicio', 'start'].includes(comandoLower)) {
      resposta = gerarAjudaRapida();
    }
    // Outros comandos
    else if (hasCommand(comandoLower)) {
      const handler = getCommand(comandoLower);
      resposta = await handler(args);
    }
    // Comando não encontrado
    else {
      resposta = `❓ Comando *${prefixo}${comandoLower}* não encontrado.\n\nDigite *${prefixo}menu* para ver os comandos disponíveis.`;
    }
    
    // Envia resposta
    if (resposta) {
      await sendReply(sock, jid, resposta, msg);
    }
    
  } catch (error) {
    console.error(`❌ Erro no comando ${comandoLower}:`, error.message);
    await sendReply(sock, jid, '❌ Ocorreu um erro ao processar o comando. Tente novamente.', msg);
  }
}

/**
 * Obtém o texto da mensagem
 * @param {Object} msg - Mensagem
 * @returns {string|null} Texto da mensagem ou null
 */
function getMessageText(msg) {
  const messageContent = msg.message;
  if (!messageContent) return null;
  
  // Diferentes tipos de mensagem
  if (messageContent.conversation) {
    return messageContent.conversation;
  }
  if (messageContent.extendedTextMessage?.text) {
    return messageContent.extendedTextMessage.text;
  }
  if (messageContent.imageMessage?.caption) {
    return messageContent.imageMessage.caption;
  }
  if (messageContent.videoMessage?.caption) {
    return messageContent.videoMessage.caption;
  }
  if (messageContent.documentMessage?.caption) {
    return messageContent.documentMessage.caption;
  }
  
  // TODO: Processar outros tipos de mídia para recibos
  // if (messageContent.imageMessage) {
  //   return handleImageReceipt(msg);
  // }
  
  return null;
}

/**
 * Obtém o nome do contato
 * @param {Object} sock - Socket
 * @param {string} jid - JID do contato
 * @returns {string} Nome do contato
 */
async function getContactName(sock, jid) {
  try {
    const [result] = await sock.onWhatsApp(jid);
    if (result?.name) return result.name;
  } catch {
    // Ignora erro
  }
  
  // Fallback: usa o número
  return jid.split('@')[0];
}

/**
 * Envia uma resposta
 * @param {Object} sock - Socket
 * @param {string} jid - JID do destinatário
 * @param {string} text - Texto da mensagem
 * @param {Object} [quotedMsg] - Mensagem citada (opcional)
 */
async function sendReply(sock, jid, text, quotedMsg = null) {
  const message = { text };
  
  if (quotedMsg) {
    message.quoted = quotedMsg;
  }
  
  await sock.sendMessage(jid, message);
}

/**
 * Envia uma imagem
 * @param {Object} sock - Socket
 * @param {string} jid - JID do destinatário
 * @param {Buffer|string} image - Imagem (buffer ou URL)
 * @param {string} [caption] - Legenda
 */
export async function sendImage(sock, jid, image, caption = '') {
  await sock.sendMessage(jid, {
    image: typeof image === 'string' ? { url: image } : image,
    caption
  });
}

/**
 * Envia um documento
 * @param {Object} sock - Socket
 * @param {string} jid - JID do destinatário
 * @param {Buffer|string} document - Documento (buffer ou URL)
 * @param {string} fileName - Nome do arquivo
 * @param {string} [mimetype] - Tipo MIME
 */
export async function sendDocument(sock, jid, document, fileName, mimetype = 'application/pdf') {
  await sock.sendMessage(jid, {
    document: typeof document === 'string' ? { url: document } : document,
    fileName,
    mimetype
  });
}

// TODO: Implementar processamento de recibos de mídia
// async function handleImageReceipt(msg) {
//   // Baixar imagem
//   // Processar com OCR
//   // Extrair valor e descrição
//   // Retornar como comando de gasto
// }

export default {
  processMessage,
  sendReply,
  sendImage,
  sendDocument
};
