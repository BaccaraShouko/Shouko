const Command = require("../../structure/Command");
const { getQueue } = require("../../utils/playerManager");

module.exports = class Remove extends Command {
    constructor() {
        super({
            name: "remove",
            category: "Musique",
            aliases: [],
            description: "Supprime une musique dans la file d'attente.",
            usage: "{{prefix}}remove <Numéro de la musique>",
            cooldown: 0
        });
    }

    run(client, message, args) {
        if(!message.member.voice.channel) return message.channel.send("⚠ Vous devez être connecté à un salon vocal.");

        const player = client.manager.players.get(message.guild.id);
        if (!player || !player.playing) return message.channel.send("❌ e ne suis pas connecté à un salon vocal ou je ne diffuse pas de musique.");
        if (player.manager.voiceStates.get(message.guild.id).channel_id !== message.member.voice.channelID) return message.channel.send("❌ Vous n'êtes pas dans le même channel que le bot.");

        const data = client.radio.get(message.guild.id);
        if (data.status) return message.channel.send("⚠ La radio est en cours de diffusion. Music actions est désactivé");

        let queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);
        if (queue.length === 0) return message.channel.send("❌ La file d'attente est vide !");

        const choice = args.join(' ');

        if (!choice || isNaN(choice)) return message.channel.send("⚠ Indiquez le numéro de la musique dans la file d'attente !");
        if (choice === "0" || choice === "-0" || choice === "+0" || choice === "+0.0" || choice === "-0.0") return message.channel.send("❌ Vous ne pouvez pas supprimer la musique actuelle.");
        if (choice < 0 || choice > queue.length - 1) return message.channel.send("❌ Aucune musique trouvée.");

        try {
            queue.splice((choice - 1), 1);
            message.channel.send("La musique a été suprimée.");
        } catch (exception) {
            console.error(exception);
            return message.channel.send("❌ Une erreur est survenue !");
        }
    }
};