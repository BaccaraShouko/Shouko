const Command = require("../../structure/Command");
const { getQueue } = require("../../utils/playerManager");
const { convertTime } = require("../../utils/functions");

module.exports = class Nowplaying extends Command {
    constructor() {
        super({
            name: "nowplaying",
            category: "Musique",
            aliases: ["np"],
            description: "Montre les informations de la musique en cour.",
            usage: "{{prefix}}nowplaying",
            cooldown: 5
        });
    }

    run(client, message, _args) {
        if(!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return message.channel.send("⚠ Je n'ai pas la permission EMBED_LINKS !");

        const player = client.manager.players.get(message.guild.id);
        if (!player || !player.playing) return message.channel.send("❌ Je ne suis pas connecté à un channel vocal ou aucune musique n'est en cours de lecture.");

        if (client.radio.get(message.guild.id).status) return message.channel.send("⚠ La radio est en cours de lecture. La file d'attente est désactivée.");

        let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);
        if (queue.length === 0) return message.channel.send("❌ La file d'attente est vide");

        try {
            return message.channel.send({
                embed: {
                    title: "🎶 Musique en cours...",
                    description: `[${queue[0].info.title}](${queue[0].info.url})`,
                    color: 0x3597a2,
                    thumbnail: {
                        url: client.user.displayAvatarURL()
                    },
                    fields: [
                        {
                            name: "\\⌛ Temps",
                            value: convertTime(client.config.LAVALINK.QUEUES[message.guild.id][0].info.duration / 1000),
                            inline: true
                        },
                        {
                            name: "Créateur",
                            value: queue[0].info.author,
                            inline: true
                        },
                        {
                            name: "Identifiant",
                            value: queue[0].info.identifier,
                            inline: true
                        }
                    ]
                }
            });
        } catch (exception) {
            console.error(exception);
            return message.channel.send("❌ Une erreur est survenue !");
        }
    }
};