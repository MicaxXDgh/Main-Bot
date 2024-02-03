const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Support Command - Ticket Panel'),

    async execute(client, interaction) {
        const panel = new EmbedBuilder()
            .setTitle('Solipse | Tickets')
            .setThumbnail(client.user.displayAvatarURL())
            .setColor('Blue')
            .setDescription('Click on the button below to open a ticket.')

        const components = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket-open')
                    .setLabel('Open a Ticket')
                    .setStyle(ButtonStyle.Success)
            )

        interaction.channel.send({embeds: [panel], components: [components]});
    }
};