const Command = require("../../structure/Command");
const { getRadio, addRadio } = require("../../utils/playerManager");
const { getFluxRadio } = require("../../utils/functions");

module.exports = class Radio extends Command {
    constructor() {
        super({
            name: "radio",
            category: "Musique",
            aliases: ["rplay"],
            description: "Ecouter la radio",
            usage: "{{prefix}}radio <radioName>",
            cooldown: 5
        });
    }

    run(client, message, args) {
        if(!message.member.voice.channel) return message.channel.send("⚠ Vous devez être connecté à un salon vocal!");
        if(!message.member.voice.channel.joinable || !message.member.voice.channel.speakable) return message.channel.send("⚠ Je n'ai pas la permission de rejoindre ou de parler dans le salon !");

        const embed = {
            color: 0x3597a2,
            author: {
                name: "Shouko radios",
                icon_url: client.user.displayAvatarURL()
            },
            fields: [{
                name: '<:France:714522839595614218> | **__Radio Française__**',
                value: '`nrj`, `virginradio`, `skyrock`, `rtl`, `bfm`, `funradio`, `rfm`, `franceinter`, `francemusique`, `rtl2`, `europe1`, `radiocontact`, `contactfm`, `mouv`'
            }, {
                name: '<:England:714522799527428107> | **__English stations__**',
                value: '`bbc`, `classicfm`'
            }],
            thumbnail: {
                url: client.user.displayAvatarURL()
            }
        };

        let track = args.join(' ').toLowerCase();
        if (!track) return message.channel.send({ embed });

        const flux = getFluxRadio(track);
        if (flux === null || flux === undefined) return message.channel.send({ embed });

        if (!client.radio.has(message.guild.id)) getRadio(client, message.guild.id, true);
        const data = client.radio.get(message.guild.id);

        if (client.manager.players.get(message.guild.id)) {
            if (data.status) {
                client.manager.players.get(message.guild.id).stop();
                data.status = true;
            }
        }

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
                    return message.channel.send("⚠ Je n'ai pas la permission !");

                player.switchChannel(message.member.voice.channelID, { selfdeaf: true });
            }

            message.channel.send(`📻 La radio actuelle est : \`${track}\`!`);
            track = flux;
            addRadio(client, message, track);

        } catch (exception) {
            console.error(exception);
            return message.channel.send("❌ Une erreur est survenue ");
        }
    }
};