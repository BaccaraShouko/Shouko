class Command {
    constructor(
        client,
        {
            name = null,
            description = "Aucune description détectée.",
            category = "Utilisateur",
            usage = "Aucune utilisation détectée.",
            enable = true,
            guildOnly = false,
            aliases = [],
        }
    )
        {
            this.client = client;
            this.conf = {enable, guildOnly, aliases};
            this.help = {name, description, category, usage};
        }
}

module.exports = Command;