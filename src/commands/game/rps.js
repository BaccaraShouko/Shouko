const Command = require("../../structure/Command");

module.exports = class Rps extends Command {
    constructor()
        {
            super({
                name: "Pierre feuille ciseau",
                category: "Jeux",
                aliases: ["pfc", "rps"],
                description: "Joue pierre feuille ciseau",
                usage: "{{prefix}}pfc mentionMembre",
                cooldown: 0
            });
        }

    async run(client, message, args)
        {
            {
                const membre = message.mentions.users.first();
                if (!membre) return message.channel.send("Vous devez mentionner votre adversaire.");

                const replies = ["pierre", "feuille", "ciseau"];

                const result = Math.floor(Math.random() * replies.length);

                let reply = args[1];
                if (!reply) {
                    return message.channel.send(
                        `Pour jouer, utiliser l'une des réponses suivante: \`${replies.join(", ")}\``)
                }
                if (!replies.includes(reply)) {
                    return message.channel.send(`Seul les réponses suivante sont accepté: \`${replies.join(", ")}\``)
                }

                if (replies[result] === reply) {
                    return message.channel.send("Egalité !");
                } else if (reply === "pierre") {
                    if (replies[result] === "feuille") {
                        return message.channel.send(`${membre} a gagné ! Cheeeh`)
                    } else return message.channel.send(`${message.author} a gagné`)
                } else if (reply === "ciseau") {
                    if (replies[result] === "pierre") {
                        return message.channel.send(`${membre} a gagné ! Cheeeh`)
                    } else return message.channel.send(`${message.author} a gagné`)
                } else if (reply === "feuille") {
                    if (replies[result] === 'ciseau') {
                        return message.channel.send(`${membre} a gagné ! Cheeeh`)
                    } else return message.channel.send(`${message.author} a gagné`)
                }
            }
        }
};