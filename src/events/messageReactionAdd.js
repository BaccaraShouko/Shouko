const moment = require("moment");
moment.locale("FR");

module.exports = async function (client, reaction, user) {

    let acceptRules = () => {
        const message = reaction.message;
        const member = message.guild.members.cache.get(user.id);
        const emoji = reaction.emoji.name;

        const roleCheck = message.guild.roles.cache.find(rl => rl.name === "Vérifié")

        const rChannel = message.guild.channels.cache.find(ch => ch.name === "📜-règlement-📜");
        const staffChannel = message.guild.channels.cache.find(ch => ch.name === "staff-only");
        if (!rChannel) return message.channel.send("Je ne trouve pas le channel \`\`📜-règlement-📜`\`\ ").then(m => { m.delete({ timeout: 5000})});
        if (!staffChannel) return message.channel.send("Je ne trouve pas le channel \`\`staff-only`\`\ ").then(m => { m.delete({ timeout: 5000})});

        if (member.user.bot) return;

        if (emoji === "💚" && message.channel.id === rChannel.id) {
            member.roles.add(roleCheck);
            staffChannel.send({embed: {
                    color: "RANDOM",
                    description: "Un nouveau membre a accepté le règlement.",
                    thumbnail: {
                        url: user.displayAvatarURL()
                    },
                    fields : [
                    {
                        name: `>> Pseudo`,
                        value: `${user.username}`
                    },
                    {
                        name: `>> ID`,
                        value: `${user.id}`
                    },
                    {
                        name: `>> Création du compte`,
                        value: moment(user.createdAt).format('LLLL')
                    },
                    {
                        name: `>> Rôle reçu`,
                        value: `${roleCheck.name}`
                    }
                    ]
                }});
        }
    }

    if (reaction.message.partial) {
        let msg = await reaction.message.fetch();
        if (msg.id === '725324615798226985') {
            acceptRules();
            console.log("Cached");
        }
    } else {
        if (reaction.message.id === '725324615798226985')
        console.log("Not partial")
        acceptRules();
    }
};