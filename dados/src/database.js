import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { FINANCE_DB_PATH, DATA_DIR, BACKUP_DIR } from './paths.js';

/**
 * Estrutura inicial do banco de dados financeiro
 */
const initialDB = {
  cartoes: {},
  meses: {}
};

/**
 * Garante que os diretórios necessários existem
 */
function ensureDirectories() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

/**
 * Carrega o banco de dados financeiro
 * @returns {Object} Dados do banco
 */
export function loadDB() {
  ensureDirectories();
  
  if (!existsSync(FINANCE_DB_PATH)) {
    saveDB(initialDB);
    return { ...initialDB };
  }
  
  try {
    const data = readFileSync(FINANCE_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { ...initialDB };
  }
}

/**
 * Salva o banco de dados financeiro
 * @param {Object} data - Dados a serem salvos
 */
export function saveDB(data) {
  ensureDirectories();
  writeFileSync(FINANCE_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Normaliza o mês para o formato MM/AAAA
 * @param {Date} [date] - Data opcional (padrão: data atual)
 * @returns {string} Mês normalizado
 */
export function normalizarMes(date = new Date()) {
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  return `${mes}/${ano}`;
}

/**
 * Obtém ou cria dados de um mês específico
 * @param {string} mesKey - Chave do mês (MM/AAAA)
 * @returns {Object} Dados do mês
 */
export function obterMes(mesKey) {
  const db = loadDB();
  
  if (!db.meses[mesKey]) {
    db.meses[mesKey] = {
      gastos: [],
      receitas: [],
      totalGastos: 0,
      totalReceitas: 0
    };
    saveDB(db);
  }
  
  return db.meses[mesKey];
}

/**
 * Adiciona um novo cartão
 * @param {string} nome - Nome do cartão
 * @param {number} limite - Limite do cartão
 * @returns {Object} Resultado da operação
 */
export function addCartao(nome, limite = 0) {
  const db = loadDB();
  const nomeNormalizado = nome.toLowerCase().trim();
  
  if (db.cartoes[nomeNormalizado]) {
    return { sucesso: false, mensagem: '❌ Cartão já existe!' };
  }
  
  db.cartoes[nomeNormalizado] = {
    nome: nome.trim(),
    limite: limite,
    gastoAtual: 0,
    criadoEm: new Date().toISOString()
  };
  
  saveDB(db);
  return { 
    sucesso: true, 
    mensagem: `✅ Cartão *${nome}* adicionado com sucesso!`,
    cartao: db.cartoes[nomeNormalizado]
  };
}

/**
 * Define o limite de um cartão
 * @param {string} nome - Nome do cartão
 * @param {number} limite - Novo limite
 * @returns {Object} Resultado da operação
 */
export function setLimiteCartao(nome, limite) {
  const db = loadDB();
  const nomeNormalizado = nome.toLowerCase().trim();
  
  if (!db.cartoes[nomeNormalizado]) {
    return { sucesso: false, mensagem: '❌ Cartão não encontrado!' };
  }
  
  db.cartoes[nomeNormalizado].limite = limite;
  saveDB(db);
  
  return { 
    sucesso: true, 
    mensagem: `✅ Limite do cartão *${db.cartoes[nomeNormalizado].nome}* atualizado para R$ ${limite.toFixed(2).replace('.', ',')}!`
  };
}

/**
 * Lista todos os cartões
 * @returns {Array} Lista de cartões
 */
export function listarCartoes() {
  const db = loadDB();
  return Object.values(db.cartoes);
}

/**
 * Registra uma entrada (gasto ou receita)
 * @param {string} tipo - 'gasto' ou 'receita'
 * @param {number} valor - Valor da entrada
 * @param {string} descricao - Descrição da entrada
 * @param {string} [cartao] - Nome do cartão (opcional, apenas para gastos)
 * @returns {Object} Resultado da operação
 */
export function registrarEntrada(tipo, valor, descricao, cartao = null) {
  const db = loadDB();
  const mesKey = normalizarMes();
  
  if (!db.meses[mesKey]) {
    db.meses[mesKey] = {
      gastos: [],
      receitas: [],
      totalGastos: 0,
      totalReceitas: 0
    };
  }
  
  const entrada = {
    id: Date.now(),
    valor,
    descricao,
    data: new Date().toISOString(),
    cartao: cartao ? cartao.toLowerCase().trim() : null
  };
  
  if (tipo === 'gasto') {
    db.meses[mesKey].gastos.push(entrada);
    db.meses[mesKey].totalGastos += valor;
    
    // Atualiza gasto do cartão se especificado
    if (cartao) {
      const cartaoKey = cartao.toLowerCase().trim();
      if (db.cartoes[cartaoKey]) {
        db.cartoes[cartaoKey].gastoAtual += valor;
      }
    }
  } else {
    db.meses[mesKey].receitas.push(entrada);
    db.meses[mesKey].totalReceitas += valor;
  }
  
  saveDB(db);
  
  return {
    sucesso: true,
    entrada,
    totais: {
      gastos: db.meses[mesKey].totalGastos,
      receitas: db.meses[mesKey].totalReceitas,
      saldo: db.meses[mesKey].totalReceitas - db.meses[mesKey].totalGastos
    }
  };
}

/**
 * Obtém o extrato do mês atual ou especificado
 * @param {string} [mesKey] - Chave do mês (opcional)
 * @returns {Object} Extrato do mês
 */
export function obterExtrato(mesKey = null) {
  const db = loadDB();
  const mes = mesKey || normalizarMes();
  
  if (!db.meses[mes]) {
    return {
      mes,
      gastos: [],
      receitas: [],
      totalGastos: 0,
      totalReceitas: 0,
      saldo: 0
    };
  }
  
  const dados = db.meses[mes];
  return {
    mes,
    gastos: dados.gastos,
    receitas: dados.receitas,
    totalGastos: dados.totalGastos,
    totalReceitas: dados.totalReceitas,
    saldo: dados.totalReceitas - dados.totalGastos
  };
}

/**
 * Fecha o mês atual (cria backup e reseta gastos dos cartões)
 * @returns {Object} Resultado da operação
 */
export function fecharMes() {
  const db = loadDB();
  const mesAtual = normalizarMes();
  
  // TODO: Implementar backup completo para arquivo
  // const backupPath = join(BACKUP_DIR, `backup_${mesAtual.replace('/', '-')}.json`);
  
  // Reseta gastos dos cartões
  for (const cartaoKey in db.cartoes) {
    db.cartoes[cartaoKey].gastoAtual = 0;
  }
  
  saveDB(db);
  
  return {
    sucesso: true,
    mensagem: `✅ Mês *${mesAtual}* fechado com sucesso!\n💳 Gastos dos cartões resetados.`,
    mesAnterior: mesAtual
  };
}

/**
 * Obtém estatísticas gerais
 * @returns {Object} Estatísticas
 */
export function obterEstatisticas() {
  const db = loadDB();
  const mesAtual = normalizarMes();
  const dadosMes = db.meses[mesAtual] || { gastos: [], receitas: [], totalGastos: 0, totalReceitas: 0 };
  
  return {
    cartoes: Object.values(db.cartoes),
    mesAtual: {
      totalGastos: dadosMes.totalGastos,
      totalReceitas: dadosMes.totalReceitas,
      saldo: dadosMes.totalReceitas - dadosMes.totalGastos,
      numeroGastos: dadosMes.gastos.length,
      numeroReceitas: dadosMes.receitas.length
    }
  };
}

export default {
  loadDB,
  saveDB,
  normalizarMes,
  obterMes,
  addCartao,
  setLimiteCartao,
  listarCartoes,
  registrarEntrada,
  obterExtrato,
  fecharMes,
  obterEstatisticas
};
