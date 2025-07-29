import fs from 'fs';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (global.conn.user.jid !== conn.user.jid)
    return m.reply('✦ Comando no disponible para subbots');

  if (!text) return m.reply(`✧ Ingresa el nombre del archivo, ejemplo:\n${usedPrefix + command} documento.pdf`);

  if (!m.quoted) return m.reply('✧ Responde a un documento o texto para guardar.');

  try {
    const filename = text.trim();

    // Si es documento (mimetype válido)
    if (m.quoted.mimetype) {
      const buffer = await m.quoted.download();
      await fs.writeFileSync(filename, buffer);
      return m.reply(`✧ Archivo guardado como *${filename}*.`);
    }

    // Si es texto
    if (m.quoted.text) {
      await fs.writeFileSync(filename, m.quoted.text);
      return m.reply(`✧ Texto guardado como *${filename}*.`);
    }

    return m.reply('✧ Tipo de contenido no compatible.');
  } catch (err) {
    console.error(err);
    return m.reply('✧ Error al guardar el archivo.');
  }
};

handler.command = ['ga'];
handler.tags = ['owner'];
handler.help = ['ga <nombre>'];
handler.rowner = true;

export default handler;