const Command = require("../../structure/Command");
const { getQueue } = require("../../utils/playerManager");

module.exports = class Queue extends Command {
    constructor() {
        super({
            name: "queue",
            category: "Musique",
            aliases: [],
            description: "Affiche la file d'attente",
            usage: "{{prefix}}queue",
            cooldown: 5
        });
    }

    async run(client, message, _args) {
        if (!client.manager.players.get(message.guild.id)) return message.channel.send("❌ Je ne suis pas connecté à un channel vocal.");

        if (client.radio.get(message.guild.id).status) return message.channel.send("⚠ La radio est en cours de lecture. file d'attente désactivée.");

        let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);
        if (queue.length === 0) return message.channel.send("❌ La file d'attente est vide.");

        if(!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return message.channel.send("⚠ Je n'ai pas la permission EMBED_LINKS.");

        if(queue.length > 10) {
            if (!message.channel.permissionsFor(client.user.id).has("ADD_REACTIONS") || !message.channel.permissionsFor(client.user.id).has("MANAGE_MESSAGES"))
                return message.channel.send("⚠ Je n'ai pas la permission ADD_REACTIONS ou MANAGE_MESSAGE.");

            let pages = Math.round(queue.length / 10 + 0.49);
            let page = 1;
            let p0 = 0;
            let p1 = 10;

            message.channel.send({
                embed: {
                    title: "File d'attente",
                    color: client.config.opts.color,
                    description: queue.map((song, i) => `**[${(i + 1)}]** => Titre [${song.info.title}](${song.info.url})\nAjouté par \`${song.author}\``).slice(0, 10).join('\n\n'),
                    footer: {
                        text: `Page ${page} sur ${pages}`
                    }
                }
            }).then(msg => {
                msg.react("⬅").then(() => {
                    msg.react("➡");

                    const backwardsFilter = (reaction, user) => reaction.emoji.name === "⬅" && user.id === message.author.id;
                    const forwardsFilter = (reaction, user) => reaction.emoji.name === "➡" && user.id === message.author.id;

                    const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
                    const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 });

                    backwards.on("collect", async (reaction) => {
                        if(page === 1) return await reaction.users.remove(message.author.id);
                        await reaction.users.remove(message.author.id);

                        page--;
                        p0 = p0 - 10;
                        p1 = p1 - 10;

                        msg.edit({
                            embed: {
                                title: "File d'attente",
                                color: client.config.opts.color,
                                description: queue.map((song, i) => `**[${(i + 1)}]** => Titre [${song.info.title}](${song.info.url})\nAjouté par \`${song.author}\``).slice(p0, p1).join("\n\n"),
                                footer: {
                                    text: `Page ${page} sur ${pages}`
                                }
                            }
                        });
                    });

                    forwards.on("collect", async (reaction) => {
                        if(page === pages) return await reaction.users.remove(message.author.id);;
                        await reaction.users.remove(message.author.id);

                        page++;
                        p0 = p0 + 10;
                        p1 = p1 + 10;

                        msg.edit({
                            embed: {
                                title: "Queue",
                                color: client.config.opts.color,
                                description: queue.map((song, i) => `**[${(i + 1)}]** => Titre [${song.info.title}](${song.info.url})\nAjouté par \`${song.author}\``).slice(p0, p1).join("\n\n"),
                                footer: {
                                    text: `Page ${page} sur ${pages}`
                                }
                            }
                        });
                    });
                });
            });
        } else {
            message.channel.send({
                embed: {
                    title: "File d'attente",
                    color: client.config.opts.color,
                    description: queue.map((song, i) => `**[${(i + 1)}]** => Titre [${song.info.title}](${song.info.url})\nAjouté par \`${song.author}\``).slice(0, 10).join("\n\n"),
                }
            });
        }
    }
};