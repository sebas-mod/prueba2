import fetch from 'node-fetch';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) return m.reply(`✳️ *Ingresa el enlace de Pinterest!*\n📌 Ejemplo: ${usedPrefix + command} https://pin.it/IEwqbsfdI`);

  try {
    let res = await fetch(`https://api.nekorinn.my.id/downloader/pinterest?url=${encodeURIComponent(text)}`);
    let json = await res.json();

    if (!json.status || !json.result) throw '❌ No se pudo descargar. Verifica el enlace.';

    let { title, duration, medias } = json.result;
    let video = medias.find(m => m.extension === 'mp4');

    if (video && video.url) {
      await conn.sendMessage(m.chat, {
        video: { url: video.url },
        caption: `🎬 *${title}*\n⏱ *Duración:* ${duration || 'Desconocida'}\n📥 *Calidad:* ${video.quality} (${video.formattedSize})`,
      }, { quoted: m });
    } else {
      let img = medias.find(m => m.extension === 'jpg');
      if (!img) throw '❌ No se encontró video ni imagen válida.';

      await conn.sendMessage(m.chat, {
        image: { url: img.url },
        caption: `🖼 *Imagen extraída de Pinterest*\n📥 *Tamaño:* ${img.formattedSize}`,
      }, { quoted: m });
    }
  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al intentar descargar el contenido.');
  }
};

handler.help = ['pinterestdl <url>'];
handler.tags = ['downloader'];
handler.command = ["pinterestdl","pindl"];

export default handler;