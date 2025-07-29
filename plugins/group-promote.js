import { areJidsSameUser } from '@adiwajshing/baileys'

var handler = async (m, { conn, text, participants, command }) => {
  if (!text && !m.quoted && !m.mentionedJid?.length) {
    return conn.reply(m.chat, `🪐 *Debes responder, mencionar o escribir un número para promover a administrador.*`, m)
  }

  let user

  if (m.mentionedJid?.length) {
    user = m.mentionedJid[0] // puede ser jid o lid directo
  } else if (m.quoted?.sender) {
    user = m.quoted.sender // jid o lid directo
  } else if (text) {
    // Puede venir en cualquiera de los dos formatos
    if (text.endsWith('@lid') || text.endsWith('@s.whatsapp.net')) {
      user = text.trim()
    } else {
      // si es solo número, normalizar a jid
      let number = text.replace(/[^0-9]/g, '')
      if (number.length < 8 || number.length > 13) {
        return conn.reply(m.chat, `🪐 *Número incorrecto*`, m)
      }
      user = number + '@s.whatsapp.net'
    }
  }

  if (!user) return conn.reply(m.chat, `🪐 *No se logró identificar al usuario.*`, m)

  // Buscamos target en participantes, buscando coincidencia por jid o lid exacta o con areJidsSameUser
  const targetData = participants.find(p =>
    areJidsSameUser(p.id, user) || p.id === user
  )
  if (!targetData) {
    return conn.reply(m.chat, `🪐 *El usuario no está en el grupo.*`, m)
  }

  if (targetData?.admin) {
    return conn.reply(m.chat, `🪐 *El usuario ya es administrador.*`, m)
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
    return conn.reply(m.chat, `✅ *Usuario promovido a administrador exitosamente.*`, m)
  } catch (e) {
    return conn.reply(m.chat, `❌ ${e.message}`, m)
  }
}

handler.help = ['promote']
handler.tags = ['grupo']
handler.command = ['promote', 'darpija', 'promover']

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler