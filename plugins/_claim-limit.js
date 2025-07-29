const rewards = {
  limit: 7500,
}

const cooldown = 86400000

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let settings = global.db.data.settings[conn.user.jid] || {}
  let moneda = settings.moneda_rpg || 'Eris'

  if (user.role === 'Free user' && user.limit >= 7500) {
    conn.reply(m.chat, `✧ Los usuarios normales obtendrán 7500 ${moneda}`, m)
    return
  }

  if (new Date - user.lastclaim < cooldown) {
    const timeLeft = ((user.lastclaim + cooldown) - new Date()).toTimeString()
    throw m.reply(`✧ Ya reclamaste tus ${moneda} diarios, regresa *${timeLeft}*`)
  }

  let text = ''
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue
    user[reward] += rewards[reward]
    text += `*+${rewards[reward]}* ${moneda}\n`
  }

  conn.reply(m.chat, text.trim(), m)
  user.lastclaim = new Date * 1
}

handler.help = ['reclamar']
handler.tags = ['main']
handler.command = /^(reclamar)$/i
handler.cooldown = cooldown
handler.disable = false
handler.register = true

export default handler