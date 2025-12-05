#!/usr/bin/env node

import { writeFileSync, existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configPath = join(dirname(__dirname), 'config.json');

const defaultConfig = {
  prefixo: '!',
  nomebot: 'FinGuard Bot',
  ownerNumber: '',
  grupoLog: '',
  autoRead: true,
  antiFake: false,
  comandosPorMinuto: 15,
  tempoLimiteResposta: 30000,
  moeda: 'BRL',
  simboloMoeda: 'R$',
  fusoHorario: 'America/Sao_Paulo'
};

/**
 * Exibe a configuração atual
 */
function showConfig() {
  if (!existsSync(configPath)) {
    console.log('❌ Arquivo de configuração não encontrado!');
    console.log('   Execute: npm run config:install');
    return;
  }
  
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    console.log('\n📋 Configuração Atual:\n');
    console.log(JSON.stringify(config, null, 2));
    console.log('\n📁 Caminho:', configPath);
  } catch (error) {
    console.error('❌ Erro ao ler configuração:', error.message);
  }
}

/**
 * Instala/cria o arquivo de configuração
 */
function installConfig() {
  if (existsSync(configPath)) {
    console.log('⚠️  Arquivo de configuração já existe!');
    console.log('   Caminho:', configPath);
    
    // Mostra config atual
    showConfig();
    return;
  }
  
  try {
    writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    console.log('\n✅ Configuração criada com sucesso!');
    console.log('📁 Caminho:', configPath);
    console.log('\n📋 Configuração padrão:\n');
    console.log(JSON.stringify(defaultConfig, null, 2));
    console.log('\n💡 Edite o arquivo para personalizar seu bot.');
  } catch (error) {
    console.error('❌ Erro ao criar configuração:', error.message);
    process.exit(1);
  }
}

// Processa argumentos
const args = process.argv.slice(2);

if (args.includes('--install') || args.includes('-i')) {
  installConfig();
} else {
  console.log('\n💰 FinGuard Bot - Configuração\n');
  console.log('Uso:');
  console.log('  npm run config          - Mostra configuração atual');
  console.log('  npm run config:install  - Cria arquivo de configuração');
  console.log('');
  showConfig();
}
