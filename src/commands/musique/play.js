const Command = require("../../structure/Command");
const { addQueue, addLinkQueue, getRadio } = require("../../utils/playerManager");

module.exports = class Play extends Command {
    constructor() {
        super({
            name: "play",
            category: "Musique",
            aliases: [],
            description: "Joue une musique Youtube",
            usage: "{{prefix}}play <Music Title | URL>",
            cooldown: 10000
        });
    }

    run(client, message, args) {
        if(!message.member.voice.channel) return message.channel.send("⚠ Vous devez vous connecter à un channel vocal !");
        if(!message.member.voice.channel.joinable || !message.member.voice.channel.speakable) return message.channel.send("⚠ Je n'ai pas les permission de rejoindre et/ou de parler dans ce channel.!");

        if (!client.radio.has(message.guild.id)) getRadio(client, message.guild.id, false);

        const data = client.radio.get(message.guild.id);

        if (client.manager.players.get(message.guild.id)) {
            if (data.status) {
                client.manager.players.get(message.guild.id).stop();
                data.status = false;
            }
        }

        const track = args.join(' ');
        if (!track) return message.channel.send("⚠ Vous devez indiquer le titre d'une musique!");

        const type = {
            name: track.match(/(?:https?:\/\/)?(?:(?:m|www)\.)?youtu(?:be(?:-nocookie)?(?:\.googleapis)?\.(?:fr|com)\S*)?(?:[&?](?:v|list)=|\/(?:v|e(?:mbed)?|u\/1)\/|\.be\/)([\w-]+)/) ? "ytlink" : "ytsearch",
            now: false
        };

        const player = client.manager.players.get(message.guild.id);

        try {
            if (!player) {
                client.manager.join({
                    guild: message.guild.id,
                    channel: message.member.voice.channelID,
                    node: client.manager.idealNodes[0].id
                }, { selfdeaf: true });
            } else if (player.manager.voiceStates.get(message.guild.id).channel_id !== message.member.voice.channelID) {
                if (!message.member.voice.channel.permissionsFor(client.user.id).has("CONNECT") || !message.member.voice.channel.permissionsFor(client.user.id).has("SPEAK"))
                    return message.channel.send("⚠ Je n'ai pas les permission de rejoindre et/ou de parler dans ce channel.");

                player.switchChannel(message.member.voice.channelID, { selfdeaf: true });
            }

            type.name === "ytlink" ? addLinkQueue(client, message, track) : addQueue(client, message, track, type);
        } catch (exception) {
            console.error(exception);
            return message.channel.send("❌ Une erreur est survenue !");
        }
    }
};