const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'ping',
        description: 'Returns the bot ping.',
    },
    async execute(message, args) {

        const pingMessage = await message.reply('Pinging...');


        const botLatency = pingMessage.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(message.client.ws.ping);
        const uptime = formatUptime(process.uptime());

        const pingEmbed = new EmbedBuilder()
            .setTitle('Pong! 🏓')
            .setColor('Random')
            .addFields(
                { name: 'API Latency', value: `\`${apiLatency}ms\``, inline: true },
                { name: 'Bot Latency', value: `\`${botLatency}ms\``, inline: true },
                { name: 'Uptime', value: `\`${uptime}\``, inline: false },
            )
            .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setThumbnail(message.client.user.displayAvatarURL())
            .setAuthor({ name: message.client.user.tag, iconURL: message.client.user.displayAvatarURL() })
            .setTimestamp();

        await pingMessage.edit({ content: null, embeds: [pingEmbed] });
    },
};

function formatUptime(uptime) {
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime % 86400 / 3600);
    const minutes = Math.floor(uptime % 3600 / 60);
    const seconds = Math.floor(uptime % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
