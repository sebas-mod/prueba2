let handler = async (m, { conn, args, usedPrefix, command }) => {
  const id = args[0]
  if (!id) return m.reply('❌ ID del grupo no proporcionado.')

  try {
    const metadata = await conn.groupMetadata(id)
    const admins = metadata.participants.filter(p => p.admin)
    const info = `
╭━━⊰ 🏷️ *Información del Grupo* ⊱━━╮
┃ 🏠 *Nombre:* ${metadata.subject}
┃ 🔗 *ID:* ${id}
┃ 👤 *Miembros:* ${metadata.participants.length}
┃ 👮‍♂️ *Admins:* ${admins.length}
┃ 🕒 *Creado:* ${new Date(metadata.creation * 1000).toLocaleString()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim()

    await conn.sendMessage(m.chat, {
      text: info,
      footer: '¿Quieres que el bot salga de este grupo?',
      buttons: [
        {
          buttonId: `${usedPrefix}salirgrupo ${id}`,
          buttonText: { displayText: '🚪 Salir del grupo' },
          type: 1
        }
      ],
      headerType: 1
    }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply('❌ No se pudo obtener la información del grupo.')
  }
}

handler.command = /^grupoinfo$/i
handler.tags = ['owner']
handler.help = ['grupoinfo <idgrupo>']
handler.rowner = true

export default handler