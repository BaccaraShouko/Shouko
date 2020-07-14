const Command = require("../../structure/Command");

module.exports = class Pause extends Command {
    constructor() {
        super({
            name : "pause",
            category : "Musique",
            aliases : [],
            description : "The command pauses the music",
            usage : "{{prefix}}pause",
            cooldown: 2
        });
    }

    run(client, message, _args) {
        if (!message.member.voice.channel) return message.channel.send("⚠ Vous devez être connecté à un salon vocal.");

        const player = client.manager.players.get(message.guild.id);
        if (!player || !player.playing) return message.channel.send("❌ Je ne suis pas connecté à un channel ou aucune musique n'est joué.");

        if (client.radio.get(message.guild.id).status) return message.channel.send("⚠ La radio est allumé. La file d'attente est désactivé.");

        if (player.pause === true) return message.channel.send("⚠ La musique est déjà en pause !");

        try {
            player.pause(true);
            return message.channel.send("⏸ La musique est en pause !");
        } catch(exception) {
            console.error(exception);
            return message.channel.send("❌ Une erreur est survenue !");
        }
    }
};