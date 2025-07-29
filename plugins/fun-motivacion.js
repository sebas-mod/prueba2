import axios from 'axios'
import yts from 'yt-search'
import FormData from 'form-data'

let handler = async (m, { conn }) => {
  const frases = [
    "🌟 Cree en ti mismo y todo será posible.",
    "🔥 Nunca te rindas, lo mejor está por venir.",
    "💪 El dolor es temporal, el orgullo es para siempre.",
    "🚀 Cada paso que das te acerca a tu meta.",
    "🌈 Hoy es un buen día para empezar de nuevo.",
    "🧠 La mente es poderosa, aliméntala de pensamientos positivos.",
    "💫 Sé el cambio que quieres ver en el mundo.",
    "🎯 Enfócate en lo que puedes controlar.",
    "🏁 No importa cuán lento vayas, lo importante es no detenerse.",
    "🧱 Construye tus sueños o alguien te contratará para construir los suyos.",
    "🔑 La clave del éxito es empezar antes de estar listo.",
    "🔥 No tengas miedo de empezar desde cero.",
    "📘 Aprende algo nuevo cada día.",
    "📍 Lo importante no es llegar rápido, es no rendirse.",
    "🧩 Un error no te define, tu esfuerzo sí.",
    "🧨 El miedo no evita la muerte, evita la vida.",
    "🛤️ Si el plan no funciona, cambia el plan, no la meta.",
    "🎬 Que tu esfuerzo hable más que tus excusas.",
    "📊 No compares tu capítulo 1 con el capítulo 20 de alguien más.",
    "💥 El éxito no es magia, es trabajo."
  ]

  const consultas = [
    'phonk para motivación',
    'motivacion extrema',
    'musica para glow up',
    'Wake Up edit',
    'glow up music',
    'gym music motivation',
    'gym workout motivation'
  ]

  const frase = frases[Math.floor(Math.random() * frases.length)]
  const query = consultas[Math.floor(Math.random() * consultas.length)]

  await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key }})

  let search = await yts(query)
  let video = search.videos[Math.floor(Math.random() * search.videos.length)]

  if (!video) return m.reply('❌ No se encontró música.')

  const ytMp3 = async (url) => {
    const ds = new FormData()
    ds.append("url", url)

    const { data } = await axios.post(
      "https://www.youtubemp3.ltd/convert",
      ds,
      {
        headers: {
          ...ds.getHeaders(),
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 30000
      }
    )

    if (!data?.link) return null

    return {
      title: data.filename,
      downloadUrl: data.link,
      type: "mp3"
    }
  }

  let result = await ytMp3(video.url)
  if (!result) return m.reply('❌ No se pudo convertir el audio.')

  let texto = `╭─🎧 *WAGURI AI – MOTIVACIÓN* ─╮
│ 🧠 *Frase:* ${frase}
│ 🎼 *Título:* ${video.title}
│ 📎 *URL:* ${video.url}
╰───────────────╯`

m.reply(texto);
  await conn.sendMessage(m.chat, {
    audio: { url: result.downloadUrl },
    mimetype: 'audio/mp4',
    fileName: video.title,
    caption: texto,
    ptt: true,
    mentions: [m.sender]
  }, { quoted: m })

  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
}

handler.help = ['motivacion']
handler.tags = ['ai','fun']
handler.command = /^motivacion$/i

export default handler