const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageDelete',
  async execute(deletedMessage) {
    const logChannelId = '1193989749103415439'; // Replace with the actual log channel ID

    if (!deletedMessage.guild) return;

    const logChannel = deletedMessage.guild.channels.cache.get(logChannelId);
    if (!logChannel) {
      console.error(`Log channel with ID ${logChannelId} not found.`);
      return;
    }

    const timestampFormatted = `<t:${Math.floor(deletedMessage.createdTimestamp / 1000)}:R>`;

    const deleteLogEmbed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Message Deleted 🗑')
      .addFields(
        { name: 'Author', value: `<@${deletedMessage.author.id}> | \`${deletedMessage.author.id}\``},
        { name: 'Message', value: `\`${deletedMessage.content || 'Not available.*'}\`` },
        { name: 'Channel', value: `<#${deletedMessage.channel.id}>`, inline: true },
        { name: 'Deleted By', value: `<@${deletedMessage.author.id}>`, inline: true },
        { name: 'Deleted At', value: timestampFormatted, inline: true },      )
      .setTimestamp();

    logChannel.send({ embeds: [deleteLogEmbed] });
  }
};
