const Command = require("../../structure/Command");

module.exports = class Duel extends Command {
    constructor()
        {
            super({
                name: "duel",
                category: "Jeux",
                aliases: ["d"],
                description: "Joue un duel entre deux membre",
                usage: "{{prefix}}duel",
                cooldown: 10000
            });
        }

    async run(client, message)
        {
            const membre = message.mentions.users.first();
            if (!membre) return message.channel.send("Vous devez mentionner votre adversaire.");

            const authorWin = [
                `**${membre}** est mort dans d'atroces souffrance ! **${message.author}** à gagné le duel !`,
                `**${message.author}** s'avance vers l'adversaire, et lui murmure à l'oreille... CHEEEEEH T'ES NUL !`,
                `**${message.author}** s’avance lentement vers ${membre}, l'attrape et le noie dans la cuvette des WC !`,
                `**${message.author}** arrive à neutraliser son ennemi avec la technique du poutchou poutchou !`,
                `**${membre}** aurait pu avoir une meilleure vie, mais ${message.author} en a décidé autrement.`

            ];
            const membreWin = [
                `**${message.author}** est mort dans d'atroces souffrance ! **${membre}** a gagné le duel !`,
                `**${message.author}** se prépare, et lance un duel épic contre **${membre}**, mais Harendelle arrive pour le gooome et ${message.author} perd son combat !`,
                `**${message.author}** veut attaquer son adversaire mais un fossile se dresse devant lui et bloque le passage, **${membre}** gagne donc le duel.`,
                `**${message.author}** rate sa cible en glissant sur une savonette. **${membre} gagne le duel face à une savonette !**`
            ];

            const authorRandom = Math.floor(Math.random() * authorWin.length);
            const membreRandom = Math.floor(Math.random() * membreWin.length);

            let random = Math.random() >= 0.5;

            if (message.author === membre) {
                message.channel.send("Tu ne peux pas d'auto duel, espèce de banane !")
            } else {
                if (random === true) {
                    message.channel.send({
                        embed: {
                            color: "#41e02c",
                            title: `Duel lancé par ${message.author.username}`,
                            description: `⚔️ ${authorWin[authorRandom]}`,
                        }
                    });
                } else {
                    message.channel.send({
                        embed: {
                            color: "#e02c2f",
                            title: `Duel lancé par ${message.author.username}`,
                            description: `🩸 ${membreWin[membreRandom]}`,
                        }
                    });
                }
            }
        }
};