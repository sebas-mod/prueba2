import fetch from 'node-fetch'

let handler = async (m, { conn, args, text, command, usedPrefix }) => {
  if (!text) return m.reply(`✳️ *Ejemplo de uso:* ${usedPrefix + command} https://www.tube8.com/porn-video/12345678/`)

  if (!/https?:\/\/(www\.)?tube8\.com\/.+/i.test(text))
    return m.reply('🚫 *El enlace proporcionado no es válido.*')

  try {
    const res = await fetch(`https://api.nekorinn.my.id/downloader/tube8?url=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.status) throw '❌ *No se pudo obtener el video.*'

    const { title, author, views, datePublished, downloadUrl } = json.result
    const video = downloadUrl.find(v => v.quality === '720') || downloadUrl[0]

    await conn.sendMessage(m.chat, {
      video: { url: video.videoUrl },
      caption: `
🎬 *${title}*
👤 Autor: ${author}
👁️ Vistas: ${views}
📅 Publicado: ${datePublished}
💾 Calidad: ${video.quality}p
`.trim()
    }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply('⚠️ *Hubo un error al descargar el video.*')
  }
}

handler.help = ['tube8']
handler.tags = ['downloader','nsfw']
handler.command = /^tube8$/i
handler.porn = true

export default handler