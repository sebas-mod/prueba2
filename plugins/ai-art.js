import { AIFreeboxImage } from '../lib/aifreebox.js'

const handler = async (m, { text, args }) => {
  if (!text) return m.reply('🎨 Escribe una idea para generar arte.')
  const imageUrl = await AIFreeboxImage(text, '16:9', 'ai-art-generator')
  await conn.sendFile(m.chat, imageUrl, 'aiimage.jpg', `🎨 Imagen generada con AIFreeBox:\n${text}`, m)
}
handler.command = /^art$/i
handler.tags = ["ai"]
handler.help = ["art"]

export default handler