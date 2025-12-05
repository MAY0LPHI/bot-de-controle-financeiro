import config from './config.json' with { type: 'json' };

/**
 * Formata um valor para BRL (Real Brasileiro)
 * @param {number} valor - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export function formatarBRL(valor) {
  const simbolo = config.simboloMoeda || 'R$';
  return `${simbolo} ${valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/**
 * Parseia um valor monetário de string para número
 * @param {string} valorStr - Valor em string (ex: "100,50" ou "100.50")
 * @returns {number|null} Valor parseado ou null se inválido
 */
export function parsearValor(valorStr) {
  if (!valorStr || typeof valorStr !== 'string') return null;
  
  // Remove espaços e símbolo de moeda
  let limpo = valorStr.trim()
    .replace(/R\$/gi, '')
    .replace(/\s/g, '')
    .trim();
  
  // Trata vírgula como separador decimal
  limpo = limpo.replace(',', '.');
  
  const valor = parseFloat(limpo);
  
  if (isNaN(valor) || valor < 0) return null;
  
  return valor;
}

/**
 * Constrói uma entrada formatada para exibição
 * @param {Object} entrada - Objeto da entrada
 * @param {string} tipo - 'gasto' ou 'receita'
 * @returns {string} Entrada formatada
 */
export function construirLinhaEntrada(entrada, tipo) {
  const emoji = tipo === 'gasto' ? '🔴' : '🟢';
  const data = new Date(entrada.data);
  const dataFormatada = `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}`;
  const cartaoInfo = entrada.cartao ? ` (💳 ${entrada.cartao})` : '';
  
  return `${emoji} ${dataFormatada} - ${entrada.descricao}${cartaoInfo}: ${formatarBRL(entrada.valor)}`;
}

/**
 * Renderiza linhas de cartões para exibição
 * @param {Array} cartoes - Lista de cartões
 * @returns {string} Texto formatado
 */
export function renderizarCartoes(cartoes) {
  if (!cartoes || cartoes.length === 0) {
    return '📭 Nenhum cartão cadastrado.';
  }
  
  let texto = '';
  
  for (const cartao of cartoes) {
    const percentual = cartao.limite > 0 
      ? ((cartao.gastoAtual / cartao.limite) * 100).toFixed(1)
      : 0;
    
    const barra = gerarBarraProgresso(percentual);
    const status = percentual >= 90 ? '🔴' : percentual >= 70 ? '🟡' : '🟢';
    
    texto += `\n💳 *${cartao.nome}*\n`;
    texto += `   ${barra} ${percentual}%\n`;
    texto += `   ${status} ${formatarBRL(cartao.gastoAtual)} / ${formatarBRL(cartao.limite)}\n`;
  }
  
  return texto.trim();
}

/**
 * Gera uma barra de progresso visual
 * @param {number} percentual - Percentual de preenchimento
 * @returns {string} Barra de progresso
 */
export function gerarBarraProgresso(percentual) {
  const total = 10;
  const preenchido = Math.min(Math.round((percentual / 100) * total), total);
  const vazio = total - preenchido;
  
  return '▓'.repeat(preenchido) + '░'.repeat(vazio);
}

/**
 * Formata data para exibição
 * @param {Date|string} data - Data a ser formatada
 * @returns {string} Data formatada
 */
export function formatarData(data) {
  const d = typeof data === 'string' ? new Date(data) : data;
  
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Extrai argumentos de uma mensagem de comando
 * @param {string} texto - Texto completo da mensagem
 * @param {string} comando - Comando usado
 * @returns {string} Argumentos extraídos
 */
export function extrairArgs(texto, comando) {
  const prefixo = config.prefixo || '!';
  const inicio = texto.toLowerCase().indexOf(comando.toLowerCase()) + comando.length;
  return texto.slice(inicio).trim();
}

/**
 * Divide argumentos respeitando aspas
 * @param {string} args - String de argumentos
 * @returns {Array} Array de argumentos
 */
export function dividirArgs(args) {
  const resultado = [];
  let atual = '';
  let dentroAspas = false;
  
  for (const char of args) {
    if (char === '"' || char === "'") {
      dentroAspas = !dentroAspas;
    } else if (char === ' ' && !dentroAspas) {
      if (atual.trim()) {
        resultado.push(atual.trim());
      }
      atual = '';
    } else {
      atual += char;
    }
  }
  
  if (atual.trim()) {
    resultado.push(atual.trim());
  }
  
  return resultado;
}

export default {
  formatarBRL,
  parsearValor,
  construirLinhaEntrada,
  renderizarCartoes,
  gerarBarraProgresso,
  formatarData,
  extrairArgs,
  dividirArgs
};
