const Command = require("../../structure/Command");
const { getQueue } = require("../../utils/playerManager");

module.exports = class Clear extends Command {
    constructor() {
        super({
            name: "clear",
            category: "Musique",
            aliases: ["purge"],
            description: "Supprime la file d'attente des musiques",
            usage: "{{prefix}}clear",
            cooldown: 5
        });
    }

    run(client, message, _args) {
        if(!message.member.voice.channel) return message.channel.send("⚠ Vous devez être connecté à un salon vocal !");

        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.channel.send("❌ Je ne suis pas connecté à un salon vocal !");

        if (client.radio.get(message.guild.id).status) return message.channel.send("⚠ La radio est allumé. La file d'attente est désactivée.");

        let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);

        try {
            if (queue.length === 0) return message.channel.send("⚠ La file d'attente est vide.");
            else if (queue.length !== 1) queue.splice(1, queue.length);

            message.channel.send("✅ La file d'attente à été clear.");
        } catch (exception) {
            console.error(exception);
            return message.channel.send("❌ Une erreur est survenue.");
        }
    }
};