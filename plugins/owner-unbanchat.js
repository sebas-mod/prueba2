let handler = async (m) => {
    global.db.data.chats[m.chat].isBanned = false
    m.reply('✧ Listo!')
}
handler.help = ['unbanchat']
handler.tags = ['owner']
handler.command = /^(unbanchat|ubnc)$/i
handler.owner = false
handler.admin = true
handler.group = true


export default handler