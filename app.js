const { Telegraf } = require('telegraf')
const omdbClient = require('./Omdb/OmdbClient')
var globals = require('./Global/Globals')
var commandsArgs = require('./commandArgs')

const { Composer } = require('micro-bot')

const translate = require('google-translate-api')
const translation = require('translation-google')
const langs = require('google-translate-api/languages')



//var bot = new Telegraf(globals.BOT_TOKEN)
const bot = new Composer

// Middlewares
bot.use(commandsArgs())

bot.start((ctx) => ctx.reply(`Welcome ${ctx.from.first_name} ${ctx.from.last_name} to my uselessbot :)`))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.command('/find', async (ctx) => {

    let args = ctx.state.command.args.trim();

    if (!args){
        ctx.reply("Por favor ingrese el nombre o el id (IMDB) de la pelicula")
        return;
    }

    if (args.length > 4 && args.startsWith("tt")){

        const movie = await omdbClient.getMovieById(args);

        if (movie.Response == 'True'){

            replyMovieDescription(ctx, movie);

        } else {
            ctx.reply(`Movie ${args} was not found`);
        }
    } else {

        const movie = await omdbClient.getMovieByTitle(args);

        if (movie.Response == 'True') {

            replyMovieDescription(ctx, movie);

        } else {
            ctx.reply(`No se pudo encontrar la pelicula: "${args}"`)
        }

    }

});

const replyMovieDescription = async (ctx, movie) => {
    let caption = `🎬 Title: ${movie.Title}\n\n📅 Year: ${movie.Year}\n\n🔴 Rated: ${movie.Rated}\n\n📆 Release Date: ${movie.Released}\n\n⌛ Duration: ${movie.Runtime}\n\n⚪ Genre: ${movie.Genre}\n\n🎥 Production: ${movie.Production}\n\nSipnosis: ${movie.Plot}\n\n⭐ Imdb Rating: ${movie.imdbRating}\n\n🏆 Awards: ${movie.Awards}`;

    let translated = await translation(caption, { from: 'en', to: ctx.from.language_code });

    ctx.replyWithPhoto({ url: movie.Poster }, { caption: translated.text })
}

bot.hears('-p', (ctx) => {

    ctx.reply(`Bienvenido ${ctx.from.first_name} ${ctx.from.last_name}`);
});

module.exports = bot