"use strict";

const { MessageCollector } = require("discord.js");
const { URLSearchParams } = require("url");
const fetch = require("node-fetch");

module.exports.getSongs = (manager, search) => {
    const params = new URLSearchParams();
    params.append("identifier", search);

    const node = manager.idealNodes[0];

    return fetch(`http://${node.host}:${node.port}/loadtracks?${params.toString()}`, { headers: { Authorization: node.password } })
        .then((res) => res.json())
        .then((data) => data.tracks)
        .catch((err) => {
            console.error(err);
            return null;
        });
};

module.exports.getRadio = (client, guildID, status) => {
    const getRadio = client.radio;
    if (getRadio.has(guildID)) return;

    getRadio.set(guildID, { status: status });
};

module.exports.getQueue = (queues, guildID) => {
    if (!queues[guildID]) queues[guildID] = [];
    return queues[guildID];
};

module.exports.play = (client, msg) => {
    try {
        const queue = this.getQueue(client.config.LAVALINK.QUEUES, msg.guild.id);
        if (queue.length < 1) return client.manager.leave(msg.guild.id);

        const player = client.manager.players.get(msg.guild.id);
        if (!player) return msg.channel.send("❌ Je ne suis pas connecté à un salon vocal !");

        const cur = queue[0];
        msg.channel.send(`🎵 Vous écoutez :\n\`${cur.info.title} - ${cur.info.author}\``);
        player.play(cur.t);
        player.volume(50);
        player.once("error", (error) => {
            if (error.type === "TrackExceptionEvent") {
                player.play(error.track).catch(() => {
                    return msg.channel.send("❌ Cette musique n'est pas disponible");
                });
            } else {
                console.error(error);
                return msg.channel.send("❌ Cette musique n'est pas disponible");
            }
        });
        player.once("end", (data) => {
            if ((data.reason === "REPLACED") || (data.reason === "STOPPED" && queue.length === 0)) return;
            if (!cur.loop) queue.shift();
            this.play(client, msg);
        });
    } catch (e) {
        console.log(e);
        msg.channel.send("❌ Une erreur est survenue !");
    }
};

module.exports.pushQueue = async(client, data, msg) => {
    let queue = this.getQueue(client.config.LAVALINK.QUEUES, msg.guild.id);

    try {
        if (data.track) {
            queue.push({
                t: data.track,
                author: msg.author.tag,
                loop: false,
                info: {
                    identifier: data.info.identifier,
                    title: data.info.title,
                    duration: data.info.length,
                    author: data.info.author,
                    url: data.info.uri,
                    stream: data.info.isStream,
                    seekable: data.info.isSeekable
                }
            });
        }
    } catch (exception) {
        console.error(exception);
        return msg.channel.send("❌ Une erreur est survenue !");
    }
};

module.exports.addLinkQueue = async(client, msg, track) => {
    try {
        let queue = this.getQueue(client.config.LAVALINK.QUEUES, msg.guild.id);

        const currentQueue = queue.length;
        if (currentQueue >= 50) return msg.channel.send("⚠️ Limitation Youtube : 50 musiques max dans la file d'attente !");

        const songs = await this.getSongs(client.manager, track);
        if (!songs) return msg.channel.send("⚠ Aucune musique trouvée ");

        if (songs.length > 25) {
            for (let i = 0; i < 25; i++) {
                await this.pushQueue(client, songs[i], msg);
            }
        } else if (songs > 1) {
            for (const song of songs) {
                await this.pushQueue(client, song, msg);
            }
        } else await this.pushQueue(client, songs[0], msg);

        if (queue.length > songs.length) return msg.channel.send(`☑ ${songs.length > 20 ? "__YouTube Limitation:__ 25" : songs.length} musiques ajoutées!`);
        else msg.channel.send(`☑ ${songs.length > 20 ? "__YouTube Limitation:__ 25" : songs.length} musiques ajoutées à la file d'attente`);

        if (currentQueue < 1) return this.play(client, msg);
    } catch (exception) {
        console.error(exception);
        return msg.channel.send("❌ Une erreur est survenue !");
    }
};

module.exports.addQueue = async(client, msg, track, type) => {
    try {
        let queue = this.getQueue(client.config.LAVALINK.QUEUES, msg.guild.id);

        if (type.name === "ytsearch" || type.name === "scsearch") {
            const songs = await this.getSongs(client.manager,  type.name + ":" + track);
            if (!songs) return msg.channel.send("⚠ Aucune musique trouvée !");

            if (songs.length > 1 && !type.now) {
                let model;
                let embed = {
                    color: 0xff933f,
                    author: {
                        name: "Entrez le nombre correspondant à la musique ( Entre 1 et 5 )",
                        icon_url: type.name === "ytsearch" ? "https://cdn.discordapp.com/attachments/579378656061685772/608736851804553239/icon-youtube-10.png" : "https://cdn.icon-icons.com/icons2/832/PNG/512/soundcloud_icon-icons.com_66677.png"
                    },
                    description: `${songs.slice(0, 5).map((s, i) => `#${(i + 1)} | [\`${s.info.title}\`](${s.info.uri})`).join("\n")}`,
                    footer: {
                        text: "Ecrive \"cancel\" pour annuler"
                    }
                };

                msg.channel.permissionsFor(client.user.id).has("EMBED_LINKS") ? model = msg.channel.send({ embed }) :
                    model = msg.channel.send(`Entrez le nombre correspondant\n\`\`\`${songs.slice(0, 5).map((s, i) => (i + 1) + ' - ' + s.info.title).join('\n')}\n\`\`\`\n\nEcrire " cancel " pour annuler.`);

                model.then(async (m) => {
                    const filter = (m) => m.author.id === msg.author.id;
                    const collector = new MessageCollector(msg.channel, filter, {
                        time: 15000
                    });
                    collector.on("collect", async (msgCollected) => {
                        let choice = msgCollected.content.split(" ")[0];
                        if (choice.toLowerCase() === "cancel") {
                            if(queue.length < 1) await client.manager.leave(msg.guild.id);

                            collector.stop("STOPPED");
                            return msg.channel.send("✅ Annulée !");
                        }

                        let choices = ["1", "2", "3", "4", "5", "cancel"];
                        if (isNaN(choice)) return;
                        if (!choices.includes(choice)) return msg.channel.send("❌ Ce choix est invalide !");

                        let song = songs[(choice - 1)];
                        if (!song) return msg.channel.send("⚠ Aucune musiques trouvée !");

                        collector.stop("PLAY");
                        await m.delete();

                        if (queue.length >= 50) return msg.channel.send("⚠️ Limitation Youtube : 50 musiques max dans la file d'attente !");
                        await this.pushQueue(client, song, msg);

                        if (queue.length > 1) return m.channel.send(`\`${song.info.title}\` - Ajouté par ${msg.author.tag} !`);
                        return this.play(client, m);
                    });
                }).catch(() => {
                    msg.channel.send("❌ Une erreur est survenue ou la musique n'a pas été trouvée !");
                });
            } else {
                const song = songs[0];
                if (!song) return msg.channel.send("⚠ Aucune musique trouvée !");

                if (queue.length >= 50) return msg.channel.send("⚠️ Limitation Youtube : 50 musiques max dans la file d'attente !");
                await this.pushQueue(client, song, msg);

                if (queue.length > 1) return msg.channel.send(`\`${song.info.title}\` - ajouté par ${msg.author.tag} !`);

                return this.play(client, msg);
            }
        }
    } catch (err) {
        console.error(err);
        return msg.channel.send("❌ Une erreur est survenue !");
    }
};

module.exports.addRadio = async(client, msg, track) => {
    try {
        let queue = this.getQueue(client.config.LAVALINK.QUEUES, msg.guild.id);
        if (queue.length > 0) queue.splice(0, queue.length);

        const songs = await this.getSongs(client.manager, track);
        if (!songs) return msg.channel.send("⚠ Aucune musique trouvée !");

        const player = client.manager.players.get(msg.guild.id);
        await player.play(songs[0].track);
        await player.volume(50);
    } catch (err) {
        return msg.channel.send("❌ Une erreur est survenue !");
    }
};

module.exports.addReadyRadio = async(client, guild, track) => {
    try {
        let queue = this.getQueue(client.config.LAVALINK.QUEUES, guild);
        if (queue.length > 0) queue.splice(0, queue.length);

        const songs = await this.getSongs(client.manager, track);
        if (!songs) return;

        if (client.manager.players.get(guild)) {
            await client.manager.players.get(guild).stop();
            this.getRadio(client, guild, true);
        }

        const player = client.manager.players.get(guild);
        await player.play(songs[0].track);
        await player.volume(50);
    } catch (err) {
        return console.error(err);
    }
};

module.exports.shuffle = (queue) => {
    queue.reverse();
    let i = (queue.length - 1);
    while (i) {
        let random = Math.floor(Math.random() * i);
        let y = queue[--i];
        queue[i] = queue[random];
        queue[random] = y;
    }
    return queue;
};

module.exports.boostBass = (client, msg, gain) => {
    const player = client.manager.players.get(msg.guild.id);
    const values = {
        "off": 0,
        "low": 0.3,
        "medium": 0.6,
        "high": 1
    };

    if(!values[gain.toLowerCase()] && values[gain.toLowerCase()] !== 0) return msg.channel.send("Indiquez une fréquence: LOW, MEDIUM, or HIGH.\n\nSelectionner OFF pour désactiver");

    const arr = Array(6).fill().map((_item, i) => ({ band: i, gain: values[gain.toLowerCase()] }));
    player.equalizer(arr);
    msg.channel.send(`Bass boost a été mis sur \`${(values[gain.toLowerCase()] * 100)} / 100\`!`);
};