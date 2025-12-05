#!/usr/bin/env node

import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configPath = join(dirname(__dirname), 'config.json');

console.log('\n💰 FinGuard Bot - Iniciando...\n');

// Verifica se config existe
if (!existsSync(configPath)) {
  console.log('⚠️  Arquivo de configuração não encontrado!');
  console.log('   Execute: npm run config:install');
  console.log('');
  process.exit(1);
}

// Importa e inicia o bot
try {
  const { startBot } = await import('../connect.js');
  await startBot();
} catch (error) {
  console.error('❌ Erro ao iniciar o bot:', error.message);
  console.error(error.stack);
  process.exit(1);
}
