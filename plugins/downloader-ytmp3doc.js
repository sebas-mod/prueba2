import axios from 'axios';
import FormData from 'form-data';
import yts from 'yt-search';

let handler = async (m, { conn, args, text }) => {
const settings = global.db.data.settings[conn.user.jid] || {}
  if (!args[0]) throw m.reply(`✧ Ejemplo: ${usedPrefix}${command} https://youtube.com/watch?v=gR3nlpwRTRA`);
  
await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
  
let results = await yts(text);
let tes = results.videos[0]

const mp3Result = await youtubeScraper.youtubeMp3(args[0]);
if (mp3Result.success) {
  console.log("Title:", mp3Result.data.title);
  console.log("Download URL:", mp3Result.data.downloadUrl);

await conn.sendMessage(m.chat, { document: { url: mp3Result.data.downloadUrl }, caption: settings.wm, mimetype: 'video/mp4', fileName: `${tes.title}` + `.mp4`}, {quoted: m })

/*await conn.sendMessage(m.chat, {
      audio: { url: mp3Result.data.downloadUrl },
      mimetype: "audio/mp4",
      fileName: tes.title,
      mentions: [m.sender]
    }, { quoted: m });*/
await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
} else {
  console.error("Error:", mp3Result.error);
  await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key }})
}
}
handler.help = ['ytmp3doc *<link>*'];
handler.tags = ['downloader'];
handler.command = ["ytmp3doc","ytadoc","ytaudiodoc"];

export default handler


class Success {
  constructor(data) {
    this.success = true;
    this.data = data;
  }
}

class ErrorResponse {
  constructor(error) {
    this.success = false;
    this.error = error;
  }
}

const youtubeScraper = {
  youtubeMp3: async (url) => {
    try {
      if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
        return new ErrorResponse({
          message: "¡URL de YouTube no válida!"
        });
      }

      const ds = new FormData();
      ds.append("url", url);
      
      const { data } = await axios.post(
        "https://www.youtubemp3.ltd/convert",
        ds,
        {
          headers: {
            ...ds.getHeaders(),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 45000
        }
      );
      
      if (!data || !data.link) {
        return new ErrorResponse({
          message: "No se pudo obtener el enlace de descarga"
        });
      }
      
      return new Success({
        title: data.filename || "Título desconocido",
        downloadUrl: data.link,
        type: "mp3"
      });
      
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return new ErrorResponse({
          message: "Tiempo de espera de la solicitud agotado, inténtelo de nuevo más tarde"
        });
      }
      
      return new ErrorResponse({
        message: error.response?.data?.message || error.message || "Gagal convert YouTube ke MP3"
      });
    }
  },

  ytdl: async (url, quality = "720") => {
    try {
      if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
        return new ErrorResponse({
          message: "¡URL de YouTube no válida!"
        });
      }

      const validQuality = {
        "480": 480,
        "1080": 1080,
        "720": 720,
        "360": 360,
        "audio": "mp3",
      };
      
      if (!Object.keys(validQuality).includes(quality)) {
        return new ErrorResponse({
          message: "¡Calidad no válida!",
          availableQuality: Object.keys(validQuality)
        });
      }
      
      const qualitys = validQuality[quality];
      
      const { data: firstRequest } = await axios.get(
        `https://p.oceansaver.in/ajax/download.php?button=1&start=1&end=1&format=${qualitys}&iframe_source=https://allinonetools.com/&url=${encodeURIComponent(url)}`,
        { 
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );
      
      if (!firstRequest || !firstRequest.progress_url) {
        return new ErrorResponse({
          message: "No se pudo iniciar el proceso de descarga"
        });
      }
      
      const { progress_url } = firstRequest;
      let metadata = {
        image: firstRequest.info?.image || "",
        title: firstRequest.info?.title || "Título desconocido",
        downloadUrl: "",
        quality: quality,
        type: quality === "audio" ? "mp3" : "mp4"
      };
      
      let datas;
      let attempts = 0;
      const maxAttempts = 40;
      
      console.log("Procesando descarga, por favor espere...");
      
      do {
        if (attempts >= maxAttempts) {
          return new ErrorResponse({
            message: "Timeout: El proceso de descarga tarda demasiado, inténtalo de nuevo."
          });
        }
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        try {
          const { data } = await axios.get(progress_url, { 
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          datas = data;
          
          if (datas.progress && datas.progress < 100) {
            console.log(`Progeso: ${datas.progress}%`);
          }
          
        } catch (pollError) {
          console.log(`El intento de sondeo ${attempts + 1} falló, se está reintentando...`);
        }
        
        attempts++;
      } while (!datas?.download_url);
      
      if (!datas.download_url) {
        return new ErrorResponse({
          message: "No se pudo obtener la URL de descarga"
        });
      }
      
      metadata.downloadUrl = datas.download_url;
      console.log("¡Ya está listo para descargar!");
      
      return new Success(metadata);
      
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return new ErrorResponse({
          message: "Tiempo de espera de la solicitud agotado, inténtelo de nuevo más tarde"
        });
      }
      
      return new ErrorResponse({
        message: error.response?.data?.message || error.message || "No se pudo descargar el vídeo"
      });
    }
  },

  // Utility function untuk validasi URL YouTube
  isValidYouTubeUrl: (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  },

  // Utility function untuk extract video ID
  extractVideoId: (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
};