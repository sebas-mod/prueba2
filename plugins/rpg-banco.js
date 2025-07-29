let handler = async (m, {conn, usedPrefix}) => {
   let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
   const settings = global.db.data.settings[conn.user.jid] || {}
   if (who == conn.user.jid) return m.react('✖️')
   if (!(who in global.db.data.users)) return m.reply(`*El usuario no se encuentra en mi base de datos*`)
   let user = global.db.data.users[who]
   await m.reply(`${who == m.sender ? `Tienes *${user.bank} ${settings.moneda_rpg}* en el Banco` : `El usuario @${who.split('@')[0]} tiene *${user.bank} ${settings.moneda_rpg}* en el Banco`}`, null, { mentions: [who] })
}

handler.help = ['bank']
handler.tags = ['rpg']
handler.command = ['bank', 'banco'] 
handler.register = true 
export default handler