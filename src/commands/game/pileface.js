const Command = require("../../structure/Command");

module.exports = class Pileface extends Command {
    constructor()
        {
            super({
                name: "Pileface",
                category: "Jeux",
                aliases: ["pf", "pifa"],
                description: "Joue à pile ou face",
                usage: "{{prefix}}pf mentionMembre pile ou face",
                cooldown: 10000
            });
        }

    async run(client, message, args)
        {
            {

                const membre = message.mentions.users.first();
                if (!membre) return message.channel.send("Vous devez mentionner votre adversaire.");

                const pilechoice = ["pile", "face"]

                if (!pilechoice.includes(args[1])) {
                    return message.channel.send("Indiquer pile ou face après avoir mentionner un membre.")
                }

                if (pilechoice[Math.floor(Math.random() * pilechoice.length)] === args[1]) {
                    message.channel.send(`${message.author} a gagné !`)
                } else {
                    message.channel.send(`${membre} a gagné !`)
                }
            }
        }
};