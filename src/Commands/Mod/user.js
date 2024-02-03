const { EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
    data: {
        name: 'user',
        description: 'Display user information.',
    },
    async execute(message) {
        if (message.author.bot) return;

        if (message.content.toLowerCase().startsWith(config.prefix)) {
            const args = message.content.slice(config.prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();


            if (command === 'user') {
                const targetUser = message.mentions.users.first() || message.client.users.cache.get(args[0]);
                const user = targetUser || message.author;

                const accountCreatedTimestamp = `<t:${Math.floor(user.createdAt.getTime() / 1000)}:R>`;
                const joinedServerTimestamp = `<t:${Math.floor(message.guild.members.cache.get(user.id).joinedAt.getTime() / 1000)}:R>`;

                const userInfoEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(`User: \`${user.username}\` :information_source:`)
                    .addFields(
                        { name: 'User ID:', value: `\`${user.id}\`` },
                        { name: 'Account Created:', value: accountCreatedTimestamp, inline: true },
                        { name: 'Joined Server:', value: joinedServerTimestamp, inline: true },
                    )
                    .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                    .setTimestamp();

                message.channel.send({ embeds: [userInfoEmbed] });
            }
        }
    },
};
