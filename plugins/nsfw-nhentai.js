import { fetch } from 'undici';
import cheerio from 'cheerio';

class nHentai {
    hpage = async function (page) {
        try {
            if (!page) {
                throw new Error('¡Se necesita página!');
            }
            let hentaiData = {};
            const response = await fetch(`https://nhentai.net/home?page=${page}`);
            const $ = cheerio.load(await response.text());
            
            $('.container').each((_, list) => {
                const type = $(list).find('h2').text().trim()
                hentaiData[type] = [];
                
                $(list).find('.gallery').each((_, element) => {
                    const cover = $(element).find('img').attr('src') || $(element).find('img').attr('data-src')
                    const title = $(element).find('.caption').text().trim()
                    const url = $(element).find('a.cover').attr('href')
                    
                    hentaiData[type].push({
                        title,
                        cover,
                        url: 'https://nhentai.net' + url
                    })
                })
            })
            return hentaiData;
        } catch (error) {
            console.error(error.message);
            throw new Error('No result found');
        }
    }
    
    search = async function (query, page) {
        try {
            if (!page || !query) {
                throw new Error('¡Se requiere consulta y página!');
            }
            let hentaiData = [];
            const response = await fetch(`https://nhentai.net/search/?q=${query}&page=${page}`)
            const $ = cheerio.load(await response.text())
            
            const galleryElements = $('.gallery');
            for (const element of galleryElements) {
                const title = $(element).find('.caption').text().trim();
                const url = $(element).find('a.cover').attr('href');
                const cover = await this.getThumb('https://nhentai.net' + url);
                hentaiData.push({ 
                    title, 
                    cover, 
                    url: 'https://nhentai.net' + url 
                });
            }
            return hentaiData;
        } catch (error) {
            console.error(error.message);
            throw new Error('No result found');
        }
    }
    
    detail = async function (url) {
        try {
            if (!url) {
                throw new Error('¡Se requiere URL!');
            }
            const response = await fetch(url)
            const $ = cheerio.load(await response.text())
            
            const hmm = $('#cover a').attr('href');
            const resp = await fetch(`https://nhentai.net${hmm}`);
            const $$ = cheerio.load(await resp.text());
            
            const cover = await this.getThumb(url);
            
            const hentaiData = {
                title: {
                    main: $('#info h1').text().trim(),
                    japanese: $('#info h2').text().trim()
                },
                id: $('#info h3').contents().not('span').text().trim(),
                parody: $('#info a[href*="/parody/"] span.name').map((_, tag) => $(tag).text().trim()).get().join(', '),
                tags: $('#info a[href*="/tag/"] span.name').map((_, tag) => $(tag).text().trim()).get().join(', '),
                artists: $('#info a[href*="/artist/"] span.name').map((_, tag) => $(tag).text().trim()).get().join(', '),
                languages: $('#info a[href*="/language/"] span.name').map((_, tag) => $(tag).text().trim()).get().join(', '),
                categories: $('#info a[href*="/category/"] span.name').map((_, tag) => $(tag).text().trim()).get().join(', '),
                pages: $('#info a[href*="pages"] span.name').text().trim(),
                cover,
                uploadDate: $('#info time').text().trim(),
                url: url
            }
            
            return hentaiData;
        } catch (error) {
            console.error(error.message);
            throw new Error('No result found');
        }
    }
    
    getImage = async function (url) {
        try {
            if (!url) {
                throw new Error('¡Se requiere URL!');
            }
            
            const images = [];
            const response = await fetch(url);
            const $ = cheerio.load(await response.text());
            
            const elements = $('.thumb-container').toArray();
            for (const el of elements) {
                const hmm = $(el).find('a.gallerythumb').attr('href');
                if (hmm) {
                    const resp = await fetch(`https://nhentai.net${hmm}`);
                    const $$ = cheerio.load(await resp.text());
                    const image = $$('[id="image-container"] img').attr('src');
                    if (image) {
                        images.push(image);
                    }
                }
            }
            
            return images;
        } catch (error) {
            console.error(error.message);
            throw new Error('No result found');
        }
    }
    
    getThumb = async function (url) {
        try {
            if (!url) {
                throw new Error('¡Se requiere URL!');
            }
            const response = await fetch(url)
            const $ = cheerio.load(await response.text())
            
            const hmm = $('#cover a').attr('href');
            const resp = await fetch(`https://nhentai.net${hmm}`);
            const $$ = cheerio.load(await resp.text());
            
            return $$('#image-container img').attr('src');
        } catch (error) {
            console.error(error.message);
            throw new Error('No result found');
        }
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) throw m.reply(`• *Ejemplo :* ${usedPrefix + command} <consulta>`)
  
// Ejemplos de uso:
const nh = new nHentai();
const resp = await nh.search(text, '1');
console.log(resp);
let info = resp[Math.floor(Math.random() * resp.length)]
let { cover, title, url } = info

	let tekk = `
     BUSQUEDA NHENTAI
     
- Titutlo: ${title}

> Ver ahora: ${url}`


 conn.sendMessage(m.chat, { image: { url: cover }, caption: tekk.trim() }, { quoted: m })
//conn.sendFile(m.chat, cover, null, tekk.trim(), m)	
};

handler.tags = ['nsfw']
handler.help = ['nhentai']
handler.command = /^(nhentai)$/i
handler.premium = false
export default handler