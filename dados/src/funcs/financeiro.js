import db from '../database.js';
import { formatarBRL, parsearValor, construirLinhaEntrada, renderizarCartoes, dividirArgs } from '../helpers.js';

/**
 * Lista os limites de todos os cartões
 * @returns {string} Mensagem formatada
 */
export async function listarLimites() {
  const cartoes = db.listarCartoes();
  
  if (cartoes.length === 0) {
    return `
📭 *Nenhum cartão cadastrado*

Use o comando *!cartao-add* para adicionar seu primeiro cartão!

_Exemplo: !cartao-add Nubank 5000_
    `.trim();
  }
  
  const header = `
💳 *LIMITES DOS CARTÕES*
━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
  
  const cartoesFormatados = renderizarCartoes(cartoes);
  
  return `${header}\n\n${cartoesFormatados}`;
}

/**
 * Adiciona um novo cartão
 * @param {string} args - Argumentos: nome e limite
 * @returns {string} Mensagem de resultado
 */
export async function addCartao(args) {
  const partes = dividirArgs(args);
  
  if (partes.length < 1) {
    return `
❌ *Uso incorreto*

📝 *Formato:* !cartao-add <nome> <limite>

📌 *Exemplos:*
• !cartao-add Nubank 5000
• !cartao-add "Cartão Inter" 3000
    `.trim();
  }
  
  const nome = partes[0];
  const limiteStr = partes[1] || '0';
  const limite = parsearValor(limiteStr);
  
  if (limite === null) {
    return '❌ Valor de limite inválido! Use números, ex: 5000 ou 5000,00';
  }
  
  const resultado = db.addCartao(nome, limite);
  
  if (resultado.sucesso) {
    return `
${resultado.mensagem}

💳 *${nome}*
📊 Limite: ${formatarBRL(limite)}
    `.trim();
  }
  
  return resultado.mensagem;
}

/**
 * Define o limite de um cartão existente
 * @param {string} args - Argumentos: nome e novo limite
 * @returns {string} Mensagem de resultado
 */
export async function setLimite(args) {
  const partes = dividirArgs(args);
  
  if (partes.length < 2) {
    return `
❌ *Uso incorreto*

📝 *Formato:* !cartao-limite <nome> <valor>

📌 *Exemplo:*
• !cartao-limite Nubank 8000
    `.trim();
  }
  
  const nome = partes[0];
  const limite = parsearValor(partes[1]);
  
  if (limite === null) {
    return '❌ Valor de limite inválido! Use números, ex: 5000 ou 5000,00';
  }
  
  const resultado = db.setLimiteCartao(nome, limite);
  return resultado.mensagem;
}

/**
 * Registra um gasto
 * @param {string} args - Argumentos: valor, descrição e cartão opcional
 * @returns {string} Mensagem de resultado
 */
export async function registrarGasto(args) {
  const partes = dividirArgs(args);
  
  if (partes.length < 2) {
    return `
❌ *Uso incorreto*

📝 *Formato:* !gasto <valor> <descrição> [cartão]

📌 *Exemplos:*
• !gasto 50,00 Almoço
• !gasto 150 Supermercado Nubank
• !gasto 89,90 "Netflix mensal" Inter
    `.trim();
  }
  
  const valor = parsearValor(partes[0]);
  
  if (valor === null || valor <= 0) {
    return '❌ Valor inválido! Use números positivos, ex: 50 ou 50,00';
  }
  
  // Verifica se o último argumento é um cartão existente
  const cartoes = db.listarCartoes();
  const ultimoArg = partes[partes.length - 1].toLowerCase();
  const cartaoExistente = cartoes.find(c => c.nome.toLowerCase() === ultimoArg);
  
  let descricao, cartao;
  
  if (cartaoExistente && partes.length >= 3) {
    // Último argumento é um cartão
    descricao = partes.slice(1, -1).join(' ');
    cartao = cartaoExistente.nome;
  } else {
    // Sem cartão especificado
    descricao = partes.slice(1).join(' ');
    cartao = null;
  }
  
  const resultado = db.registrarEntrada('gasto', valor, descricao, cartao);
  
  const cartaoInfo = cartao ? `\n💳 Cartão: *${cartao}*` : '';
  
  return `
🔴 *GASTO REGISTRADO*
━━━━━━━━━━━━━━━━━━━━━━

💸 Valor: *${formatarBRL(valor)}*
📝 Descrição: ${descricao}${cartaoInfo}

📊 *Resumo do mês:*
• Gastos: ${formatarBRL(resultado.totais.gastos)}
• Receitas: ${formatarBRL(resultado.totais.receitas)}
• Saldo: ${formatarBRL(resultado.totais.saldo)}
  `.trim();
}

/**
 * Registra uma receita
 * @param {string} args - Argumentos: valor e descrição
 * @returns {string} Mensagem de resultado
 */
export async function registrarReceita(args) {
  const partes = dividirArgs(args);
  
  if (partes.length < 2) {
    return `
❌ *Uso incorreto*

📝 *Formato:* !receita <valor> <descrição>

📌 *Exemplos:*
• !receita 3000 Salário
• !receita 500,00 Freelance
• !receita 1200 "Venda de produto"
    `.trim();
  }
  
  const valor = parsearValor(partes[0]);
  
  if (valor === null || valor <= 0) {
    return '❌ Valor inválido! Use números positivos, ex: 3000 ou 3000,00';
  }
  
  const descricao = partes.slice(1).join(' ');
  
  const resultado = db.registrarEntrada('receita', valor, descricao);
  
  return `
🟢 *RECEITA REGISTRADA*
━━━━━━━━━━━━━━━━━━━━━━

💰 Valor: *${formatarBRL(valor)}*
📝 Descrição: ${descricao}

📊 *Resumo do mês:*
• Receitas: ${formatarBRL(resultado.totais.receitas)}
• Gastos: ${formatarBRL(resultado.totais.gastos)}
• Saldo: ${formatarBRL(resultado.totais.saldo)}
  `.trim();
}

/**
 * Mostra o extrato do mês atual
 * @returns {string} Extrato formatado
 */
export async function extrato() {
  const dados = db.obterExtrato();
  
  let texto = `
📊 *EXTRATO - ${dados.mes}*
━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
  
  // Últimos gastos
  texto += '\n\n🔴 *Últimos Gastos:*\n';
  if (dados.gastos.length === 0) {
    texto += '_Nenhum gasto registrado_';
  } else {
    const ultimosGastos = dados.gastos.slice(-5).reverse();
    for (const gasto of ultimosGastos) {
      texto += construirLinhaEntrada(gasto, 'gasto') + '\n';
    }
  }
  
  // Últimas receitas
  texto += '\n🟢 *Últimas Receitas:*\n';
  if (dados.receitas.length === 0) {
    texto += '_Nenhuma receita registrada_';
  } else {
    const ultimasReceitas = dados.receitas.slice(-5).reverse();
    for (const receita of ultimasReceitas) {
      texto += construirLinhaEntrada(receita, 'receita') + '\n';
    }
  }
  
  // Resumo
  const saldoEmoji = dados.saldo >= 0 ? '🟢' : '🔴';
  texto += `
━━━━━━━━━━━━━━━━━━━━━━
📈 *RESUMO*

💰 Receitas: ${formatarBRL(dados.totalReceitas)}
💸 Gastos: ${formatarBRL(dados.totalGastos)}
${saldoEmoji} Saldo: *${formatarBRL(dados.saldo)}*
  `;
  
  return texto.trim();
}

/**
 * Fecha o mês atual
 * @returns {string} Mensagem de confirmação
 */
export async function fecharMes() {
  const extratoAntes = db.obterExtrato();
  const resultado = db.fecharMes();
  
  return `
🔒 *MÊS FECHADO*
━━━━━━━━━━━━━━━━━━━━━━

${resultado.mensagem}

📊 *Resumo do mês fechado:*
• Receitas: ${formatarBRL(extratoAntes.totalReceitas)}
• Gastos: ${formatarBRL(extratoAntes.totalGastos)}
• Saldo final: ${formatarBRL(extratoAntes.saldo)}

📌 _Gastos dos cartões foram resetados para o novo mês._
  `.trim();
}

/**
 * Placeholder para recibo/comprovante
 * @returns {string} Mensagem de funcionalidade em desenvolvimento
 */
export async function recibo() {
  // TODO: Implementar processamento de imagens de recibos
  // - Receber imagem
  // - Processar com OCR (opcional)
  // - Extrair valor e descrição
  // - Registrar automaticamente
  
  return `
📸 *RECIBO* (Em desenvolvimento)
━━━━━━━━━━━━━━━━━━━━━━

Esta funcionalidade está em desenvolvimento!

🔜 *Em breve você poderá:*
• Enviar foto do recibo
• Extração automática de valores
• Registro rápido de gastos

📌 _Por enquanto, use !gasto para registrar manualmente._
  `.trim();
}

export default {
  listarLimites,
  addCartao,
  setLimite,
  registrarGasto,
  registrarReceita,
  extrato,
  fecharMes,
  recibo
};
