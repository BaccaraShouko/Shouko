const Command = require("../../structure/Command");

module.exports = class Help extends Command {
    constructor() {
        super({
            name: "help",
            category: "bot",
            aliases: ["h"],
            description: "Affiche les commandes",
            usage: "{{prefix}}help <commandName>",
            cooldown: 0
        });
    }

    run(client, message, args) {
        if(!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return message.channel.send("⚠ Je n'ai pas EMBED_LINKS permissions dans ce channel !");
        const query = args.join(" ");

        if (!query) {
            let type = [];
            client.commands.forEach(cmd => {
                if (!type.includes(cmd.category) && (client.config.root.includes(message.author.id) || cmd.category !== "owner")) {
                    type.push(cmd.category);
                }
            });

            return message.channel.send({
                embed: {
                    color: client.config.opts.color,
                    author: {
                        name: `${client.user.username} | Liste des commandes`,
                        icon_url: client.user.displayAvatarURL()
                    },
                    fields: type.map(cmd => {
                        return {
                            name: `• ${cmd[0].toUpperCase()}${cmd.slice(1, 10)} (${client.commands.filter(command => command.category === cmd).size})`,
                            value: client.commands.filter(command => command.category === cmd).map(command => `\`${command.name}\``).join(", "),
                            inline: false
                        };
                    }),
                    timestamp: new Date(),
                    footer: {
                        text: `© ${client.user.username} | Pour plus d'information, utilisez ${client.config.bot.prefix}help <command>`,
                        icon_url: message.author.displayAvatarURL()
                    }
                }
            }).catch((err) => console.log(message.author.id, err));
        } else {
            const data = client.commands.get(query.toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(query.toLowerCase()));
            if (!data) return message.channel.send("❌ Aucune commande trouvé !");

            let aliases = ((data.aliases.length > 0) ? data.aliases.map((a) => `\`${a}\``).join(", ") : "`None`");

            message.channel.send({
                embed: {
                    author: {
                        name: `Commande: ${data.name} | Catégorie: ${data.category[0].toUpperCase()}${data.category.slice(1, 10)}`,
                        icon_url: client.user.avatarURL()
                    },
                    description: `**${data.description}**`,
                    thumbnail: {
                        url: client.user.displayAvatarURL()
                    },
                    color: 0x2f6e93,
                    fields: [{
                        name: '\\⚙ Utlisation',
                        value: `\`${data.usage}\``.replace("{{prefix}}", client.config.bot.prefix)
                    }, {
                        name: '\\✨ Aliases',
                        value: aliases
                    }]
                }
            });
        }
    }
};