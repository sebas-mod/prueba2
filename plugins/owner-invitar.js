let handler = async (m, { conn, args, text, usedPrefix, command }) => {
let who 
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text
else who = m.chat
let name = await conn.getName(m.sender)	
let user = global.db.data.users[who]
if (!global.db.data.settings[conn.user.jid].restrict) return conn.reply(m.chat, `✧ Este comando fue desactivado por mi owner`, fkontak, m) 
if (!text) throw m.reply(`✧ Ingresa el numero para invitar, ejemplo:\n*${usedPrefix + command}* 59355555555`)
if (text.includes('+')) throw  m.reply(`✧ Ingresa el numero para invitar, ejemplo:\n*${usedPrefix + command}* 59355555555`)
let group = m.chat
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
await conn.reply(text+'@s.whatsapp.net', `✧ Te invitaron a unirte a este grupo, aquí está el link:\n\n${link}`, m, {mentions: [m.sender]})
m.reply(`✧ Se envió la invitación a *@${who.split`@`[0]}* con exito`) 
}
handler.help = ['oadd', '+'].map(v => v + ' *<número>*')
handler.tags = ['group']
handler.command = /^(oadd|lagregar|oinvitar|oinvite|oañadir|\+)$/i
handler.group = true
handler.admin = false
handler.owner = true
handler.botAdmin = true
handler.fail = null
export default handler