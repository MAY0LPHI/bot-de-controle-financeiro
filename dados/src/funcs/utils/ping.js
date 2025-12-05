/**
 * Comando ping - Verifica se o bot está online
 * @returns {string} Mensagem de pong
 */
export async function ping() {
  const agora = new Date();
  const uptime = process.uptime();
  
  const horas = Math.floor(uptime / 3600);
  const minutos = Math.floor((uptime % 3600) / 60);
  const segundos = Math.floor(uptime % 60);
  
  return `
🏓 *PONG!*

✅ Bot está online e funcionando!

⏱️ *Uptime:* ${horas}h ${minutos}m ${segundos}s
🕐 *Hora atual:* ${agora.toLocaleTimeString('pt-BR')}
📅 *Data:* ${agora.toLocaleDateString('pt-BR')}

💰 _FinGuard Bot - Seu controle financeiro!_
  `.trim();
}

export default { ping };
