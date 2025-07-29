let handler = async (m, { conn, usedPrefix, command }) => {
  let chats = Object.entries(conn.chats)
    .filter(([id, data]) => id.endsWith('@g.us') && data?.metadata?.subject)
  let total = chats.length

  if (total === 0) return m.reply('❌ El bot no está en ningún grupo actualmente.')

  const sections = [{
    title: `📂 Grupos activos (${total})`,
    rows: chats.map(([jid, data], index) => ({
      title: `${index + 1}. ${data.metadata.subject}`,
      description: `👥 Miembros: ${data.metadata.participants.length}`,
      rowId: `${usedPrefix}grupoinfo ${jid}`
    }))
  }]

  await conn.sendMessage(m.chat, {
    text: `🤖 *Waguri Ai* está actualmente en *${total}* grupo(s).`,
    footer: 'Selecciona uno para ver detalles o sacarlo del grupo.',
    buttonText: '📋 Ver grupos',
    sections
  }, { quoted: m })
}

handler.command = /^grupos|listagrupos$/i
handler.tags = ['owner']
handler.help = ['grupos']
handler.rowner = true

export default handler