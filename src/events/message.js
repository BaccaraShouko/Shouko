"use strict";

module.exports = async function (client, message) {
    if (!message.guild || message.author.bot) { return; }
    if (!message.channel.permissionsFor(client.user.id).has("SEND_MESSAGES")) return;
    if (!message.content.startsWith(client.config.bot.prefix)) return;

    if (client.uptime < 5000) return message.channel.send(`⚠ ${client.user.username} est en cours de démarrage, veuillez patienter.`);

    const arg = message.content.trim().slice(client.config.bot.prefix.length).split(/ +/g);
    const command = client.commands.get(arg[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(arg[0]));
    const args = arg.slice(1);

    if (!command) return;

    const check = client.cooldown.get(message.author.id, command.name);

    if (check.status) {
        await command.run(client, message, args);
        console.log(`[Commands] ${command.name} | Auteur: ${message.author.tag} | Server: ${message.guild === null ? 'DM' : message.guild.name} | Hour: ${new Date()}`);

        if (command.cooldown > 0) client.cooldown.add(message.author.id, command.name, command.cooldown);
    } else {
        message.channel.send(`Vous devez attendre \`${Math.round(check.message / 1000)}\` avant de pouvoir réutiliser la commande.`);
    }
};