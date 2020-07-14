const Command = require("../../structure/Command");

module.exports = class Join extends Command {
    constructor() {
        super({
            name: "join",
            category: "Musique",
            aliases: [],
            description: "Ajoute le bot dans un salon vocal.",
            usage: "{{prefix}}join",
            cooldown: 0
        });
    }

    run(client, message, _args) {
        if(!message.member.voice.channel) return message.channel.send("⚠ Vous devez être connecté à un salon vocal !");
        if(!message.member.voice.channel.joinable || !message.member.voice.channel.speakable) return message.channel.send("⚠ Je n'ai pas les permissions nécessaire !");

        const player = client.manager.players.get(message.guild.id);
        if(player) return message.channel.send("⚠ Le bot est déjà dans un salon vocal !");

        try {
            client.manager.join({
                guild: message.guild.id,
                channel: message.member.voice.channelID,
                node: client.manager.idealNodes[0].id
            }, { selfdeaf: true });
        } catch (exception) {
            console.error(exception);
            return message.channel.send("❌ Une erreur est survenue !");
        }
    }
};