import yts from 'yt-search';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@adiwajshing/baileys';

const handler = async (m, { conn, args, usedPrefix, command }) => {
const settings = global.db.data.settings[conn.user.jid] || {}
  if (!args[0]) return conn.reply(m.chat, `✧ Ejemplo: ${usedPrefix}${command} Joji - Ew`, m);

  await m.react('🔎');
  try {
    let query = args.join(" ");
    let searchResults = await searchVideos(query);
    let spotifyResults = await searchSpotify(query);
    let AppleMusicResult = await (await fetch(`https://api.siputzx.my.id/api/s/applemusic?query=${query}&region=es`)).json();
//    const { title, artist, image, link, } = AppleMusicResult.data.result[0];

    if (!searchResults.length && !spotifyResults.length) throw new Error('*✖️ No se encontraron resultados.*');

    let video = searchResults[0];

    let thumbnail;
    try {
      thumbnail = await (await fetch(video.miniatura)).buffer();
    } catch (e) {
      console.warn('*✖️ No se pudo obtener la miniatura, usando imagen por defecto.*');
      thumbnail = await (await fetch('https://telegra.ph/file/36f2a1bd2aaf902e4d1ff.jpg')).buffer();
    }


const caption = `
      *💮 PLAY AUDIO 💮*
 
  ✧ : \`titulo;\` ${video.titulo || 'no encontrado'}
  ✧ : \`artista;\` ${video.canal || 'no encontrado'}
  ✧ : \`duracion;\` ${video.duracion || 'no encontrado'}
 
> ${settings.wm}
> Pedido de @${m.sender.split('@')[0]}
> url: ${video.url}`;
    let ytSections = searchResults.slice(1, 11).map((v, index) => ({
      title: `${index + 1}┃ ${v.titulo}`,
      rows: [
        {
          title: `🎶 Descargar MP3`,
          description: `Duración: ${v.duracion || 'No disponible'}`,
          id: `${usedPrefix}play3 ${v.url}`
        },
        {
          title: `📦 Descargar MP3 Documento`,
          description: `Duración: ${v.duracion || 'No disponible'}`,
          id: `${usedPrefix}ytmp3doc ${v.url}`
        },
        {
          title: `🎥 Descargar MP4`,
          description: `Duración: ${v.duracion || 'No disponible'}`,
          id: `${usedPrefix}ytmp4 ${v.url}`
        },
        {
          title: `📦 Descargar MP4 Documento`,
          description: `Duración: ${v.duracion || 'No disponible'}`,
          id: `${usedPrefix}ytmp4doc ${v.url}`
        }
      ]
    }));

    let spotifySections = spotifyResults.slice(0, 10).map((s, index) => ({
      title: `${index + 1}┃ ${s.titulo}`,
      rows: [
        {
          title: `🎶 Descargar Audio`,
          description: `Duración: ${s.duracion || 'No disponible'}`,
          id: `${usedPrefix}spotify ${s.url}`
        }
      ]
    }));
    
    let applemusicSections = AppleMusicResult.data.result.slice(0, 5).map((a, index) => ({
      title: `${index + 1}┃ ${a.title}`,
      rows: [
        {
          title: `🎶 Descargar Audio`,
          description: `Artista: ${a.artist || 'No disponible'}`,
          id: `${usedPrefix}applemusic ${a.link}`
        }
      ]
    }));

    await conn.sendMessage(m.chat, {
      image: thumbnail,
      caption: caption,
      footer: settings.wm,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true
      },
      buttons: [
        {
          buttonId: `${usedPrefix}ytmp3v2 ${video.url}`,
          buttonText: { displayText: '🎧 Descargar 𝖠𝗎𝖽𝗂𝗈' },
          type: 1,
        },
        {
          buttonId: `${usedPrefix}ytmp4v2 ${video.url}`,
          buttonText: { displayText: '🎬 Descargar 𝖵𝗂𝖽𝖾𝗈' },
          type: 1,
        },
        {
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: '𝖱𝖾𝗌𝗎𝗅𝗍𝖺𝖽𝗈𝗌 De 𝖸𝗈𝗎𝖳𝗎𝖻𝖾',
              sections: ytSections,
            }),
          },
        },
/*        {
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: '𝖱𝖾𝗌𝗎𝗅𝗍𝖺𝖽𝗈𝗌 De Apple Music',
              sections: applemusicSections,
            }),
          },
        },*/
        {
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: '𝖱𝖾𝗌𝗎𝗅𝗍𝖺𝖽𝗈𝗌 De 𝖲𝗉𝗈𝗍𝗂𝖿𝗒',
              sections: spotifySections,
            }),
          },
        },
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('✖️');
    conn.reply(m.chat, '*`Error al buscar el video.`*', m);
  }
};

handler.help = ['play *<texto>*'];
handler.tags = ['downloader'];
handler.command = ['play'];
export default handler;

async function searchVideos(query) {
  try {
    const res = await yts(query);
    return res.videos.slice(0, 10).map(video => ({
      titulo: video.title,
      url: video.url,
      miniatura: video.thumbnail,
      canal: video.author.name,
      publicado: video.timestamp || 'No disponible',
      vistas: video.views || 'No disponible',
      duracion: video.duration?.timestamp || 'No disponible'
    }));
  } catch (error) {
    console.error('Error en yt-search:', error.message);
    return [];
  }
}

async function searchSpotify(query) {
  try {
    const res = await fetch(`https://delirius-apiofc.vercel.app/search/spotify?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.data.slice(0, 10).map(track => ({
      titulo: track.title,
      url: track.url,
      duracion: track.duration || 'No disponible'
    }));
  } catch (error) {
    console.error('Error en Spotify API:', error.message);
    return [];
  }
}

function convertTimeToSpanish(timeText) {
  return timeText
    .replace(/year/, 'año').replace(/years/, 'años')
    .replace(/month/, 'mes').replace(/months/, 'meses')
    .replace(/day/, 'día').replace(/days/, 'días')
    .replace(/hour/, 'hora').replace(/hours/, 'horas')
    .replace(/minute/, 'minuto').replace(/minutes/, 'minutos');
}