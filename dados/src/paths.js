import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Diretórios base
export const SRC_DIR = __dirname;
export const ROOT_DIR = dirname(__dirname);
export const DATA_DIR = join(ROOT_DIR, 'data');

// Arquivos de banco de dados
export const FINANCE_DB_PATH = join(DATA_DIR, 'financeiro.json');

// Diretórios de mídia
export const TEMP_DIR = join(ROOT_DIR, 'temp');
export const BACKUP_DIR = join(DATA_DIR, 'backups');

// Exportação padrão com todos os paths
export default {
  SRC_DIR,
  ROOT_DIR,
  DATA_DIR,
  FINANCE_DB_PATH,
  TEMP_DIR,
  BACKUP_DIR
};
