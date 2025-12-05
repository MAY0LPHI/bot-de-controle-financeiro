import { 
  listarLimites, 
  addCartao, 
  setLimite, 
  registrarGasto, 
  registrarReceita, 
  extrato, 
  fecharMes, 
  recibo 
} from './financeiro.js';
import { ping } from './utils/ping.js';

/**
 * Mapeamento de comandos para seus handlers
 * Chave: nome do comando (sem prefixo)
 * Valor: função handler
 */
export const commands = {
  // Comandos de cartão
  'cartao-add': addCartao,
  'cartaoadd': addCartao,
  'addcartao': addCartao,
  
  'cartao-limite': setLimite,
  'cartaolimite': setLimite,
  'setlimite': setLimite,
  
  // Comandos de lançamento
  'gasto': registrarGasto,
  'gastei': registrarGasto,
  'despesa': registrarGasto,
  
  'receita': registrarReceita,
  'recebi': registrarReceita,
  'ganho': registrarReceita,
  'entrada': registrarReceita,
  
  // Comandos de relatório
  'extrato': extrato,
  'resumo': extrato,
  'saldo': extrato,
  
  'limites': listarLimites,
  'cartoes': listarLimites,
  'limite': listarLimites,
  
  // Comandos de gestão
  'fechar-mes': fecharMes,
  'fecharmes': fecharMes,
  'fechamento': fecharMes,
  
  'recibo': recibo,
  'comprovante': recibo,
  
  // Utilitários
  'ping': ping,
  'status': ping
};

/**
 * Obtém o handler de um comando
 * @param {string} comando - Nome do comando
 * @returns {Function|null} Handler do comando ou null
 */
export function getCommand(comando) {
  return commands[comando.toLowerCase()] || null;
}

/**
 * Verifica se um comando existe
 * @param {string} comando - Nome do comando
 * @returns {boolean} True se existe
 */
export function hasCommand(comando) {
  return comando.toLowerCase() in commands;
}

/**
 * Lista todos os comandos disponíveis
 * @returns {string[]} Array de nomes de comandos
 */
export function listCommands() {
  return Object.keys(commands);
}

export default {
  commands,
  getCommand,
  hasCommand,
  listCommands
};
