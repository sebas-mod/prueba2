import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text, args }) => {
const settings = global.db.data.settings[conn.user.jid] || {}
  // Check if it's a group chat
  if (m.isGroup && !global.db.data.chats[m.chat].nsfw) {
    throw m.reply(`🚫 El nsfw no está activo \n\n*✧ Escribe:* \n*${usedPrefix}on* nsfw para activar estos comandos`);
  }

  // Check user age
  let user = global.db.data.users[m.sender].age;
  if (user < 17) throw m.reply(`*Tienes que tener al menos 18 años para usar esto!*`);

  if (!args[0]) throw `✧ Seleciona una opción:\nblowjob\nneko\ntrap\nwaifu`;

  let res = await fetch(`https://api.waifu.pics/nsfw/${text}`);
  if (!res.ok) throw await res.text();

  let json = await res.json();
  if (!json.url) throw m.reply('Error!');

  conn.sendFile(m.chat, json.url, '', settings.wm, m);
};

handler.command = /^(nsfw)$/i

handler.register = true
handler.premium = true
handler.limit = false

export default handler
