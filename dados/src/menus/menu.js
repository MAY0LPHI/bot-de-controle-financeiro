import config from '../config.json' with { type: 'json' };

/**
 * Gera o menu principal do bot FinGuard
 * @param {string} [nomeUsuario] - Nome do usuário (opcional)
 * @returns {string} Menu formatado
 */
export function gerarMenu(nomeUsuario = 'Usuário') {
  const prefixo = config.prefixo || '!';
  const nomeBot = config.nomebot || 'FinGuard Bot';
  
  const menu = `
╔═══════════════════════════════╗
║    💰 *${nomeBot}* 💰    
╠═══════════════════════════════╣
║  Olá, *${nomeUsuario}*! 👋
║  Seu assistente financeiro pessoal
╠═══════════════════════════════╣
║  📊 *COMANDOS FINANCEIROS*
╠═══════════════════════════════╣
║
║  💳 *Cartões*
║  ├ ${prefixo}cartao-add <nome> <limite>
║  │  _Adiciona um novo cartão_
║  │
║  └ ${prefixo}cartao-limite <nome> <valor>
║     _Define limite de um cartão_
║
║  📝 *Lançamentos*
║  ├ ${prefixo}gasto <valor> <descrição> [cartão]
║  │  _Registra um gasto_
║  │
║  └ ${prefixo}receita <valor> <descrição>
║     _Registra uma receita_
║
║  📈 *Relatórios*
║  ├ ${prefixo}extrato
║  │  _Mostra extrato do mês_
║  │
║  └ ${prefixo}limites
║     _Mostra limites dos cartões_
║
║  ⚙️ *Gestão*
║  ├ ${prefixo}fechar-mes
║  │  _Fecha o mês atual_
║  │
║  └ ${prefixo}recibo
║     _Envia comprovante (em breve)_
║
╠═══════════════════════════════╣
║  📌 *UTILITÁRIOS*
╠═══════════════════════════════╣
║
║  ├ ${prefixo}ajuda ou ${prefixo}menu
║  │  _Exibe este menu_
║  │
║  └ ${prefixo}ping
║     _Verifica se o bot está online_
║
╠═══════════════════════════════╣
║  💡 *DICAS*
║  • Use vírgula ou ponto decimal
║  • Valores sem símbolo (ex: 150,00)
║  • Cartão é opcional nos gastos
╚═══════════════════════════════╝

🏦 _Organize suas finanças com inteligência!_
  `.trim();
  
  return menu;
}

/**
 * Gera uma mensagem de ajuda rápida
 * @returns {string} Ajuda formatada
 */
export function gerarAjudaRapida() {
  const prefixo = config.prefixo || '!';
  
  return `
💡 *Ajuda Rápida - FinGuard Bot*

📌 *Comandos mais usados:*

💸 ${prefixo}gasto 50,00 Almoço
   _Registra gasto de R$ 50,00_

💰 ${prefixo}receita 3000 Salário
   _Registra receita de R$ 3.000_

📊 ${prefixo}extrato
   _Ver resumo do mês_

💳 ${prefixo}limites
   _Ver status dos cartões_

❓ ${prefixo}menu
   _Menu completo_
  `.trim();
}

export default {
  gerarMenu,
  gerarAjudaRapida
};
