import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile, readFileSync } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'
//import knights from 'knights-canvas'

/**
 * @type {import('@adiwajshing/baileys')}
 */
const { proto } = (await import('@adiwajshing/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

/**
 * Handle messages upsert
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate 
 */
let estilo = (text, style = 1) => {
  var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
  var yStr = Object.freeze({
    1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
  });
  var replacer = [];
  xStr.map((v, i) => replacer.push({
    original: v,
    convert: yStr[style].split('')[i]
  }));
  var str = text.toLowerCase().split('');
  var output = [];
  str.map(v => {
    const find = replacer.find(x => x.original == v);
    find ? output.push(find.convert) : output.push(v);
  });
  return output.join('');
};

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate)
        return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return
    if (global.db.data == null)
        await global.loadDatabase()
    try {
        m = smsg(this, m) || m
        if (!m)
            return
        m.exp = 0
        m.limit = false
        try {
            // TODO: use loop to insert data instead of this
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object')
                global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.exp))
                    user.exp = 0
                if (!isNumber(user.limit))
                    user.limit = 10
                if (!isNumber(user.afk))
                    user.afk = -1
                if (!('afkReason' in user))
                    user.afkReason = ''
                if (!('banned' in user))
                    user.banned = false
                if (!('banReason' in user))
                    user.banReason = ''
                if (!('role' in user))
                    user.role = 'Free user'
                if (!('autolevelup' in user))
                    user.autolevelup = false
               if (!isNumber(user.bank))
                    user.bank = 0
            } else
                global.db.data.users[m.sender] = {
                    exp: 0,
                    limit: 10,
                    lastclaim: 0,
                    registered: false,
                    name: m.name,
                    age: -1,
                    regTime: -1,
                    afk: -1,
                    afkReason: '',
                    banned: false,
                    banReason: '',
                    warn: 0,
                    level: 0,
                    role: 'Free user',
                    autolevelup: false,
                    bank: 0
                }
            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object')
                global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!('isBanned' in chat))
                    chat.isBanned = false
                if (!('welcome' in chat))
                    chat.welcome = false
                if (!('autodl' in chat))
                    chat.autodl = false
                if (!('detect' in chat))
                    chat.detect = false
                if (!('sWelcome' in chat))
                    chat.sWelcome = ''
                if (!('sBye' in chat))
                    chat.sBye = ''
                if (!('sPromote' in chat))
                    chat.sPromote = ''
                if (!('sDemote' in chat))
                    chat.sDemote = ''
                if (!('delete' in chat))
                    chat.delete = true
                if (!('antiLink' in chat))
                    chat.antiLink = false
                if (!('viewonce' in chat))
                    chat.viewonce = false
                if (!('antiToxic' in chat))
                    chat.antiToxic = false
                if (!('simi' in chat))
                    chat.simi = false
                if (!('autogpt' in chat))
                    chat.chatgpt = false
                if (!('autoSticker' in chat))
                    chat.autoSticker = false
                if (!('premium' in chat))
                    chat.premium = false
                if (!('premiumTime' in chat))
                    chat.premiumTime = false
                if (!('nsfw' in chat))
                    chat.nsfw = false
                if (!('menu' in chat))
                    chat.menu = false
                if (!isNumber(chat.expired))
                    chat.expired = 0
            } else
                global.db.data.chats[m.chat] = {
                    isBanned: false,
                    welcome: false,
                    autodl: false,
                    detect: false,
                    sWelcome: '',
                    sBye: '',
                    sPromote: '',
                    sDemote: '',
                    delete: true,
                    antiLink: false,
                    viewonce: false,
                    simi: false,
                    autogpt: false,
                    expired: 0,
                    autoSticker: false,
                    premium: false,
                    premiumTime: false,
                    nsfw: false,
                    menu: true,
                }
            let settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('autoread' in settings)) settings.autoread = true
                if (!('restrict' in settings)) settings.restrict = false
                if (!('anticall' in settings)) settings.anticall = true
                if (!('restartDB' in settings)) settings.restartDB = 0
                if (!('botIcon' in settings)) settings.botIcon = 'https://files.catbox.moe/gi65bh.png'
                if (!('menuMedia' in settings)) settings.menuMedia = 'https://files.catbox.moe/w4pmmz.jpg'
                if (!('botName' in settings)) settings.botName = 'Waguri Ai'
                if (!('moneda_rpg' in settings)) settings.moneda_rpg = 'Eris'
                if (!('wm' in settings)) settings.wm = 'Waguri x KenisawaDev'
                if (!('owner_numero' in settings)) settings.owner_numero = ['5493865642938', '0']
                if (!('owner_nombre' in settings)) settings.owner_nombre = 'KenisawaDev'
                if (!('link_owner' in settings)) settings.link_owner = 'https://wa.me/5493865642938'
                if (!('canal_owner' in settings)) settings.canal_owner = 'https://whatsapp.com/channel/0029VarbyoN2ZjCkcPW7q33F'
                if (!('id_canal_owner' in settings)) settings.id_canal_owner = '120363348355703366'
            } else global.db.data.settings[this.user.jid] = {
                self: false,
                autoread: true,
                anticall: true,
                restartDB: 0,
                restrict: false,
                botIcon: 'https://files.catbox.moe/gi65bh.png',
                menuMedia: 'https://files.catbox.moe/w4pmmz.jpg',
                botName: 'Waguri Ai',
                moneda_rpg: 'Eris',
                wm: 'Waguri x KenisawaDev',
                owner_numero: ['5493865642938', '0'],
                owner_nombre: 'KenisawaDev',
                link_owner: 'https://wa.me/5493865642938',
                canal_owner: 'https://whatsapp.com/channel/0029VarbyoN2ZjCkcPW7q33F',
                id_canal_owner: '120363348355703366'
            }
        } catch (e) {
            console.error(e)
        }
        if (opts['nyimak'])
            return
        if (!m.fromMe && opts['self'])
            return
        if (opts['pconly'] && m.chat.endsWith('g.us'))
            return
        if (opts['gconly'] && !m.chat.endsWith('g.us'))
            return
        if (opts['owneronly'] && !m.chat.startsWith(`${global.nomorown}`))
            return
        if (opts['swonly'] && m.chat !== 'status@broadcast')
            return
        if (typeof m.text !== 'string')
            m.text = ''
// Detectar si el bot está usando lid o no
const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net'
const settings = global.db.data.settings[conn.user.jid] || {}
// Detectar si el mensaje proviene de un owner
const isROwner = (settings.owner_numero || []).map(n => n + detectwhat).includes(m.sender)
const isOwner = isROwner || m.fromMe
const isPrems = isROwner || global.db.data.users[m.sender].premiumTime > 0

        if (!isOwner && opts['self']) return;
        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        if (m.isBaileys)
            return
        m.exp += Math.ceil(Math.random() * 10)
        
        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]
// Obtener datos del grupo
const groupMetadata = m.isGroup
  ? await conn.groupMetadata(m.chat).catch(_ => null)
  : {}

const participants = m.isGroup ? groupMetadata.participants || [] : []

// Este es tu ID real
const senderJid = m.sender // Ej: '5493865642938@s.whatsapp.net'
const senderLid = (participants.find(p => p.jid === senderJid) || {}).lid

// Este es el ID del bot
const botJid = conn.user?.jid // Ej: '5493865208712@s.whatsapp.net'
const botLid = (participants.find(p => p.jid === botJid) || {}).lid

// Usuario en el grupo
const user = participants.find(p => p.jid === senderJid || p.lid === senderLid) || {}
const bot = participants.find(p => p.jid === botJid || p.lid === botLid) || {}

const isRAdmin = user.admin === 'superadmin'
const isAdmin = isRAdmin || user.admin === 'admin'

const isBotAdmin = bot.admin === 'admin' || bot.admin === 'superadmin'

// 📢 Detecta si es una cuenta Business o Canal
m.isWABusiness = ['smba', 'smbi'].includes(global.conn.authState?.creds?.platform)
m.isChannel = m.chat.includes('@newsletter') || m.sender.includes('@newsletter')
	
        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    // if (typeof e === 'string') continue
                    console.error(e)
                    for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        let data = (await conn.onWhatsApp(jid))[0] || {}
                        if (data.exists)
                            m.reply(`*Plugin:* ${name}\n*Emisor:* ${m.sender}\n*Chat:* ${m.chat}\n*Comando:* ${m.text}\n\n\`\`\`${format(e)}\`\`\``.trim(), data.jid)
                    }
                }
            }

            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    // global.dfail('restrict', m, this)
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail // When failed
                let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                        plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? // String?
                            plugin.command === command :
                            false

                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    if (name != 'owner-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'tool-delete.js' && chat?.isBanned)
                        return // Except this
                    if (name != 'owner-unbanuser.js' && user?.banned)
                        return
                }
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.disable && !(isROwner || isOwner)) { // Bot number
                    fail('disable', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { // Moderator
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { // Premium
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { // Group Only
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { // User Admin
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { // Private Chat Only
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { // Butuh daftar?
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
                if (xp > 200)
                    m.reply('-_-') // Hehehe
                else
                    m.exp += xp
                if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
                    this.reply(m.chat, `Sus eris se acabaron, usa *${usedPrefix}claimeris* para su recopensa diaria\n\no\nHabla con mi creador para obtener premium *${usedPrefix}owner*`, m)
                    continue // Limit habis
                }
                if (plugin.level > _user.level) {
                    this.reply(m.chat, `✧ Necesitas estar en el nivel ${plugin.level} para usar este comando.\n*✧ Su nivel actualmente:* ${_user.level} 📊`, m)
                    continue // If the level has not been reached
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems)
                        m.limit = m.limit || plugin.limit || false
                } catch (e) {
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
    let text = format(e)
    for (let key of Object.values(global.APIKeys || {}))
        text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')

    if (e.name) {
        const settings = global.db.data.settings[conn.user.jid] || {}
        let developers = (settings.developer_numero || settings.owner_numero || [])
        for (let jid of developers) {
            let id = jid + (jid.includes('@') ? '' : (m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net'))
            let data = (await conn.onWhatsApp(id).catch(() => [{}]))[0] || {}
            if (data.exists) {
                await m.reply(
                    `*✧ Plugin:* ${m.plugin}\n*✧ Emisor:* ${m.sender}\n*✧ Chat:* ${m.chat}\n*✧ Comando:* ${usedPrefix}${command} ${args.join(' ')}\n✧ *Error Logs:*\n\n\`\`\`${e}\`\`\``.trim(),
                    data.jid
                )
            }
        }
    }
    //m.reply(text)
}
                } finally {
                    // m.reply(util.format(_user))
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.limit)
                        m.reply(+m.limit + ` ${global.db.data.settings[conn.user.jid].moneda || 'eris'} usado ✧ `)
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        //console.log(global.db.data.users[m.sender])
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.limit -= m.limit * 1
            }
            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }
        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
        if (opts['autoread'])
            await conn.readMessages([m.key])
    }
}
/**
 * Handle groups participants update
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */
export async function participantsUpdate( { id, participants, action }) {
    if (opts['self'])
        return
    if (this.isInit)
        return
    let chat = global.db.data.chats[id] || {}
    let text = ''
    switch (action) {
        case 'add':
                     case 'remove': 
                   if (chat.welcome) {
                let groupMetadata = await this.groupMetadata(id) || (this.chats[id] || {}).metadata
                for (let user of participants) {
                    let pp = 'https://telegra.ph/file/3067b920347facbb69bb1.jpg'
                    try {
                        pp = await this.profilePictureUrl(user, 'image')
                    } catch (e) {
                    } finally {
                        text = (action === 'add' ? (chat.sWelcome || this.welcome || await Connection.conn.welcome || 'Bienvenido, @user!').replace('@subject', await this.getName(id)).replace('@desc', groupMetadata.desc?.toString() || 'unknow') :
                            (chat.sBye || this.bye || await Connection.conn.bye || 'Bye bye, @user!')).replace('@user', `${this.getName(user)}`)
                            let skyin = {
text: text,
contextInfo: {
externalAdReply: {
title: global.db.data.settings[conn.user.jid].wm,
body: "Group Notifications",
thumbnailUrl: pp,
sourceUrl: "https://whatsapp.com/channel/0029VarbyoN2ZjCkcPW7q33F",
mediaType: 1,
renderLargerThumbnail: true
}}}
                        this.sendMessage(id, skyin, { mentions: [user] })
                        }
                 } 
             } 
            break
            case 'promote':
                text = (chat.sPromote || this.spromote || await Connection.conn.spromote || '@user ```Ahora es Admin```')
                case 'demote':
                    if (!text)
                        text = (chat.sDemote || this.sdemote || await Connection.conn.sdemote || '@user ```Ya no es Admin```')
                    text = text.replace('@user', '@' + participants[0].split('@')[0])
                    if (chat.detect)
                        this.sendMessage(id, {
                        text, mentions: this.parseMention(text)
                        })
                    break
        }
}
/**
* Handle groups update
* @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate
*/
export async function groupsUpdate(groupsUpdate) {
    if (opts['self'])
        return
     for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id],
        text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || await Connection.conn.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || await Connection.conn.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || await Connection.conn.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || await Connection.conn.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
        if (!text) continue
        await this.sendMessage(id, { text, mentions: this.parseMention(text) })
    }
}

export async function deleteUpdate(message) {
    try {
        const { fromMe, id, participant } = message
        if (fromMe)
            return
        let msg = this.serializeM(this.loadMessage(id))
        if (!msg)
            return
        let chat = global.db.data.chats[msg.chat] || {}
        if (chat.delete)
            return
        this.reply(msg.chat, `
_@${participant.split`@`[0]} eliminó un mensaje._
*✧ Para desactivar esta función escribe:*
*.on delete*
          
*✧ Para eliminar los mensajes del bot escribe:*
*.delete*`, msg)
        this.copyNForward(msg.chat, msg).catch(e => console.log(e, msg))
    } catch (e) {
        console.error(e)
    }
}

global.dfail = (type, m, conn) => {
    let msg = {
        rowner: "> _*✧ Perdon, Este comando es solo para mi Owner.*_",
        owner: "> _*✧ Perdon, Solo mi creador puede usar este comando.*_",
        mods: "> _*✧ Perdon, Este comando solo es para mods*_",
        premium: "> _*✧ No eres un usuario Premium, Habla con mi owner*_",
        group: "> _*✧ Perdon, Este comando solo es para grupos*_",
        private: "> _*✧ Ve a mi chat privado y usa este comando*_",
        admin: "> _*✧ Quien eres?, tu no eres admin*_",
        botAdmin: "> _*✧ Es necesario que sea admin primero para usar esta función*_",
        unreg: "> _*‼️USUARIO NO REGISTRADO‼️*_\n\n`Para registrarse:`\n\n> usa el comando .reg nombre.edad",
        restrict: "> _*✧ Comando desactivado por mi Owner`*_" 
    }[type]
    
    let setn = global.db.data.settings[conn.user.jid] || {}
    let botnombrexd = setn.botName
    let deco_msg = "`१✿ᩧ┅═❏✧͚"+ setn.botName +"❏═┅✿ᩧ̼१`\n\n"+`${msg}\n\n`+"`︶ִֶָ⏝︶ִֶָ⏝˖ ࣪ ୨✧୧ ࣪ ˖⏝ִֶָ︶⏝ִֶָ︶`"
    if (msg) return conn.reply(m.chat, deco_msg, m)
}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})
