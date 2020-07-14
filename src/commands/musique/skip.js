const Command = require("../../structure/Command");
const { getQueue } = require("../../utils/playerManager");

module.exports = class Skip extends Command {
    constructor() {
        super({
            name: "skip",
            category: "Musique",
            aliases: [],
            description: "Passer à la musique suivante.",
            usage: "{{prefix}}skip",
            cooldown: 5
        });
    }

    run(client, message, _args) {
        if(!message.member.voice.channel) return message.channel.send("⚠ Vous devez être connecter à un channel !");

        const player = client.manager.players.get(message.guild.id);
        if (!player || !player.playing) return message.channel.send("❌ Je ne suis pas connecté à un salon vocal !");
        if (player.manager.voiceStates.get(message.guild.id).channel_id !== message.member.voice.channelID) return message.channel.send("❌ Vous n'êtes pas dans le même channel que le bot.");

        const data = client.radio.get(message.guild.id);
        if (data.status) return message.channel.send("⚠ La radio est allumée. La file d'attente est désactivé.");

        if (player.paused) player.pause(false);

        const queue = getQueue(client.config.LAVALINK.QUEUES, message.guild.id);
        if (queue.length <= 1) return message.channel.send("❌ Je ne peux pas passer la musique. Il n'y a que 1 musique en file d'attente.");

        message.channel.send("⏩ Changement ...").then(() => {
            try {
                player.stop();
            } catch (exception) {
                console.error(exception);
                return message.channel.send("❌ Une erreur est survenue !");
            }
        });
    }
};