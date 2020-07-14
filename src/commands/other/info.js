const Command = require("../../structure/Command");
const Discord = require("discord.js");
const { convertTime } = require("../../utils/functions");
const os = require("os");
const moment = require("moment");
                require('moment-duration-format');


module.exports = class Info extends Command {
    constructor() {
        super({
            name: "info",
            category: "bot",
            aliases: ["debug", "bot"],
            description: "Donne les informations du bot",
            usage: "{{prefix}}info",
            cooldown: 5000
        });
    }

    run(client, message, _args) {
        if(!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return message.channel.send("⚠ Je n'ai pas la permission d'envoyer des Embeds!");

        message.channel.send({
            embed: {
                author: {
                    icon_url: client.user.displayAvatarURL(),
                    name: "Information du Bot"
                },
                color: 0x8186dc,
                fields: [{
                    name: "\\⚙️ **__Config__**",
                    value: `\`\`\`asciidoc\n= PROCESSEUR =\nCPU        :: ${(os.loadavg()[0]*os.cpus().length / 100).toFixed(2)}%\nMémoire     :: ${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100}MB\nProcesseur  :: (${os.arch()}) ${os.cpus()[0].model}\n            \n= INFORMATIONS =    \nNodejs     :: v${process.versions.node}\nDiscord.js :: v${Discord.version}\nUptime     :: ${moment.duration(client.uptime).format("D [day], H [hour], m [min]")}\`\`\``
                }, {
                    name: "\\🎵 Channel Vocaux",
                    value: `Connecté à **${client.manager.players.size}** salon(s)`,
                    inline: true
                }, {
                    name: "\\🙍️ Membres / Serveurs ",
                    value: `**${client.users.cache.size}** membres / **${client.guilds.cache.size}** serveurs`,
                    inline: true
                }],
                thumbnail: {
                    url: client.user.displayAvatarURL()
                }
            }
        });
    }
};