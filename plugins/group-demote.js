import { areJidsSameUser } from '@adiwajshing/baileys'

let handler = async (m, { conn }) => {
  const user = m.mentionedJid?.[0]

  if (!user)
    return m.reply(`
🌷 *Quitar Administrador* 🌷

✦ *Uso correcto:*
○ .demote @usuario

✧ Este comando remueve el rol de administrador del usuario mencionado.
`.trim())

  const groupMetadata = await conn.groupMetadata(m.chat)
  const participants = groupMetadata.participants

  const target = participants.find(p =>
    areJidsSameUser(p.id || p.jid || p.lid, user)
  )

  if (!target)
    return m.reply('✧ No se pudo encontrar al usuario en el grupo.')

  if (areJidsSameUser(user, conn.user.id))
    return m.reply('✧ No puedo quitarme el admin yo misma 💔')

  await conn.groupParticipantsUpdate(m.chat, [target.id || target.jid || target.lid], 'demote')

  const mention = `@${user.split('@')[0]}`

  await conn.sendMessage(m.chat, {
    text: `❀ El usuario ${mention} ha sido *removido* como administrador.`,
    mentions: [user],
    contextInfo: {
      externalAdReply: {
        title: '🌸 Administración de Grupos',
        body: '✧ El usuario ya no es administrador.',
        thumbnailUrl: 'https://files.catbox.moe/vxvobj.jpg',
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: 'https://whatsapp.com/channel/0029VarbyoN2ZjCkcPW7q33F'
      }
    }
  }, { quoted: m })
}

handler.help = ['demote @usuario']
handler.tags = ['group']
handler.command = /^demote$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler