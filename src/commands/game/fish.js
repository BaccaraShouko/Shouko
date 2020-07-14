const Command = require("../../structure/Command");

module.exports = class Fish extends Command {
    constructor()
        {
            super({
                name: "fish",
                category: "Jeux",
                aliases: ["fh"],
                description: "Permet de pêcher",
                usage: "{{prefix}}fish",
                cooldown: 30000
            });
        }

    async run(client, message, args)
        {
            const logsChannel = message.guild.channels.cache.find(ch => ch.name === "logs-bot");

            const ObjetNul = ["Une Chaussure", "Une Roue de vélo", "Un Tapis de danse", "Un Arrosoir cassé", "Une Lunette", "Un Colier", "Un Téléphone", "Un Stylo", "Une pierre", "Un ballon", "Une lettre"];
            const poissonsNormaux = ["Une Carpe", "Un Chinchard", "Une Vandoise", "Un Bar Commun", "Un Saumon masou", "Un Ayu", "Une Bouvière", "Un Crapet", "Un Carassin", "Une Grenouille", "Une Clione"];
            const poissonsTresRare = ["Un Grand Requin Blanc", "Un Requin Marteau", "Un Requin Scie", "Un Requin Baleine", "Un Macropinna", "Un Napoléon", "Un Poisson Rouge", "Un Poisson Ruban", "Un Ranchu", "Une Truite Dorée", "Un Thon", "Un Marlin Bleu", "Un Coelacanthe", "Un Cyprin Doré", "Un Dai Yu", "Une Dorado", "Un Esturgeon", "Un Arowana"];
            const poissonsRare = ["Un Cardeau", "Un Carpe Koï", "Un Combattant", "Un Coryphène", "Un Crabe Chinois", "Un Bichir", "Un Brochet", "Un Calmar", "Un Carangue Grosse Tête", "Un Anchois", "Une Lune de Mer"];

            const resultPoidsNormaux = Math.floor((Math.random() * 39) + 1);
            const resultPoidsRare = Math.floor((Math.random() * 79) + 40);
            const resultPoidsTresRare = Math.floor((Math.random() * 149) + 20);

            let pourcentage = Math.random();

            if (pourcentage < 0.80) { // 20%

                const resultPoissonsNormaux = poissonsNormaux[Math.floor(Math.random() * poissonsNormaux.length)];
                logsChannel.send(`Tu as pêché: **${resultPoissonsNormaux}** de **${resultPoidsNormaux} Kg**`)

            } else if (pourcentage < 0.90) { // 10%

                const resultPoissonsRare = poissonsRare[Math.floor(Math.random() * poissonsRare.length)];
                logsChannel.send(`Super ! Tu as pêché **${resultPoissonsRare}** de **${resultPoidsRare} Kg**`)

            } else if (pourcentage < 0.94) { // 6%

                const resultObjetNull = ObjetNul[Math.floor(Math.random() * ObjetNul.length)];
                logsChannel.send(`Pas de chance ! Tu as pêché **${resultObjetNull}**.`)

            } else if (pourcentage < 0.96) { // 4%

                const resultPoissonsTresRare = poissonsTresRare[Math.floor(Math.random() * poissonsTresRare.length)];
                logsChannel.send(`Félicitation ! Tu as pêché **${resultPoissonsTresRare}** de **${resultPoidsTresRare} Kg**`)

            } else {
                logsChannel.send(`Oh non ! Tu as cassé ta ligne !`)

            }
        }
};