import axios from 'axios'
import * as cheerio from 'cheerio'
import { writeFileSync } from 'fs'
import path from 'path'

let handler = async (m, { args, text, conn }) => {
  if (!text) return m.reply(`🚫 Introduzca una palabra clave!\n\nEjemplo:\n.ascii naruto`)

  try {
    const res = await axios.get('https://emojicombos.com/anime-text-art', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })

    const $ = cheerio.load(res.data)
    const results = []

    $('.combo-ctn').each((_, el) => {
      const tags = $(el).find('.keywords a').map((i, tag) => $(tag).text().toLowerCase()).get()
      const match = tags.some(tag => tag.includes(text.toLowerCase()))
      if (match) {
        const art = $(el).find('.emojis').text().trim()
        if (art.length > 10) results.push(art)
      }
    })

    if (results.length === 0)
      return m.reply(`❌ No existe arte ASCII adecuado para: *${text}*`)

    const limited = results.slice(0, 10)
    const content = `🎭 Resultados de arte ASCII para: ${text}\n\n` +
      limited.join('\n\n' + '-'.repeat(40) + '\n\n')

    const filePath = path.resolve('./tmp', `ascii-${Date.now()}.txt`)
    writeFileSync(filePath, content)

    await conn.sendMessage(m.chat, {
      document: { url: filePath },
      fileName: `ascii-${text}.txt`,
      mimetype: 'text/plain',
      caption: `📂 Encontré *${limited.length}* Arte ASCII para: *${text}*`
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('❌ Se produjo un error al recuperar los datos.')
  }
}

handler.help = ['ascii *<nombre>*']
handler.tags = ['ai']
handler.command = /^ascii$/i

export default handler