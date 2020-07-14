const Command = require("../../structure/Command");
const { getQueue } = require("../../utils/playerManager");

module.exports = class Leave extends Command {
    constructor() {
        super({
            name: "leave",
            category: "Musique",
            aliases: ["logout", "exit"],
            description: "Deconnecte le bot du channel",
            usage: "{{prefix}}join",
            cooldown: 2
        });
    }

    run(client, message, _args) {
        if(!message.member.voice.channel) return message.channel.send("⚠ Vous devez être connecté à un channel vocal !");
        if(!message.member.voice.channel.joinable || !message.member.voice.channel.speakable) return message.channel.send("⚠ Je n'ai pas les permissions nécessaire");

        const player = client.manager.players.get(message.guild.id);
        if(!player) return message.channel.send("⚠ Je ne suis pas connecté à un channel vocal !");

        let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);
        if (queue.length > 0) queue.splice(0, queue.length);

        try {
            client.manager.leave(message.guild.id);
            return message.channel.send("✅ J'ai bien quitté le channel.");
        } catch (exception) {
            console.error(exception);
            return message.channel.send("❌ Une erreur est survenue !");
        }
    }
};