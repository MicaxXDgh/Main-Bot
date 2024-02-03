const { EmbedBuilder } = require('discord.js');

function getJumpLink(message) {
  return `[Jump to Message](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`;
}

module.exports = {
  name: 'messageDelete',
  async execute(deletedMessage) {
    const logChannelId = 'YOUR_LOG_CHANNEL_ID'; // Replace with the actual log channel ID

    if (!deletedMessage.guild) return;

    const logChannel = deletedMessage.guild.channels.cache.get(logChannelId);
    if (!logChannel) {
      console.error(`Log channel with ID ${logChannelId} not found.`);
      return;
    }

    const timestampFormatted = `<t:${Math.floor(deletedMessage.createdTimestamp / 1000)}:R>`;
    const jumpLink = getJumpLink(deletedMessage);

    const deleteLogEmbed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Message Deleted 🗑')
      .addFields(
        { name: 'Author', value: `<@${deletedMessage.author.id}> | \`${deletedMessage.author.id}\``, inline: true },
        { name: 'Message', value: `\`${deletedMessage.content || 'Not available.*'}\`` },
        { name: 'Channel', value: `<#${deletedMessage.channel.id}>`, inline: true },
        { name: 'Deleted By', value: `<@${deletedMessage.author.id}>`, inline: true },
        { name: 'Deleted At', value: timestampFormatted, inline: true },
        { name: 'Jump Link', value: jumpLink }
      )
      .setTimestamp();

    logChannel.send({ embeds: [deleteLogEmbed] });
  },

  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    const logChannelId = '1193989749103415439'; // Replace with the actual log channel ID

    if (!newMessage.guild) return;

    const logChannel = newMessage.guild.channels.cache.get(logChannelId);
    if (!logChannel) {
      console.error(`Log channel with ID ${logChannelId} not found.`);
      return;
    }

    const timestampFormatted = `<t:${Math.floor(newMessage.editedTimestamp / 1000)}:R>`;
    const jumpLink = getJumpLink(newMessage);

    const editLogEmbed = new EmbedBuilder()
      .setColor('#ff9900')
      .setTitle('Message Edited ✏️')
      .addFields(
        { name: 'Author', value: `<@${newMessage.author.id}> | \`${newMessage.author.id}\``},
        { name: 'Channel', value: `<#${newMessage.channel.id}>`},
        { name: 'Original Content', value: `\`${oldMessage.content || 'Not available.*'}\``, inline: true  },
        { name: 'Edited Content', value: `\`${newMessage.content || 'Not available.*'}\``, inline: true  },
        { name: 'Edited At', value: timestampFormatted },
        { name: 'Jump to Message', value: jumpLink }
      )
      .setTimestamp();

    logChannel.send({ embeds: [editLogEmbed] });
  }
};
