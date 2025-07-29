let handler = async (m, { conn }) => {
  let settings = global.db.data.settings[conn.user.jid] || {}

  let wm = settings.wm || 'Waguri x KenisawaDev'
  let thumbnail = settings.botIcon || 'https://files.catbox.moe/gi65bh.png'
  let sourceUrl = settings.link_owner || 'https://wa.me/5493865642938'
  let nomorown = settings.owner_numero?.[0] || '0000000000'
  let name = settings.owner_nombre || 'KenisawaDev'

  let txt = `
(Español)
**Términos de servicio (TOS) - ${settings.botName || 'Waguri Ai'}**
Al utilizar ${settings.botName || 'Waguri Ai'}, usted acepta los siguientes términos:

1. *ESTÁ ESTRICTAMENTE PROHIBIDO CAMBIAR EL TEMPORIZADOR/MENSAJE TEMPORAL*
El bot bloqueará automáticamente su número, para desbanear informe al propietario (+${nomorown}).

2. *NO ENVÍO DE MEDIOS NSFW*
El bot detectará automáticamente los medios y prohibirá su número, para desbanear informe al propietario (+${nomorown}).

3. *EL SPAM DE NÚMEROS DE BOT ESTÁ PROHIBIDO*
El bot bloqueará permanentemente su número si hay una indicación de spam en su número.

4. *PROPIETARIO DEL CHAT SI ES NECESARIO*
No tiene sentido chatear con el número de bot, porque el número de bot se almacena en el servidor y el propietario no verá su chat.

Al utilizar ${settings.botName || 'Waguri Ai'}, usted acepta todos los términos aplicables.

*Estos términos se actualizaron por última vez el 12 de mayo de 2024.*

Registrarse significa aceptar los términos
`

  let fkon = {
    key: {
      fromMe: false,
      participant: `${m.sender.split`@`[0]}@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: '16500000000@s.whatsapp.net' } : {})
    },
    message: {
      contactMessage: {
        displayName: name,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        verified: true
      }
    }
  }

  conn.relayMessage(m.chat, {
    extendedTextMessage: {
      text: txt,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: wm,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: thumbnail,
          sourceUrl: sourceUrl
        }
      },
      mentions: [m.sender]
    }
  }, { quoted: fkon })
}

handler.help = ['reglas']
handler.tags = ['info']
handler.command = /^(reglas|tos|peraturan)$/i

export default handler