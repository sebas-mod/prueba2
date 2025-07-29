let handler = async (m) => {
  let r = ['Sí ✨', 'No ❌', 'Tal vez... 🤔']
  m.reply(`🎯 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤:\n${r[Math.floor(Math.random() * r.length)]}`)
}
handler.command = ['tirar', 'suerte']
handler.tags = ['fun']
handler.help = ['tirar']
export default handler