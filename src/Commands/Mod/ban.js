const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
    data: {
        name: 'ban',
        description: 'Ban a user.',
        options: [
            {
                name: 'user',
                description: 'Specify user to ban.',
                type: 'User',
                required: true,
            },
        ],
    },
        async execute(message, args) {
            try {
                if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                    throw new Error('You do not have permission to use this command.');
                }

                const member = message.mentions.members.first();
                if (!member) {
                    throw new Error('Specify the user you would like to ban.');
                }
                if (member.id === message.guild.me.id) {
                    throw new Error('You cannot ban me!');
                }
                if (member.id === message.author.id) {
                    throw new Error('You cannot ban yourself!');
                }

                const banConfirmation = new EmbedBuilder()
                    .setColor('Orange')
                    .setTitle('Ban Confirmation')
                    .setDescription(`Are you sure you want to ban ${member.user.tag} for ${args.slice(1).join(' ') || 'No reason provided.'}?`);

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm_ban')
                            .setLabel('Confirm')
                            .setEmoji('✅')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('cancel_ban')
                            .setLabel('Cancel')
                            .setEmoji('❌')
                            .setStyle(ButtonStyle.Danger),
                    );

                const confirmationMessage = await message.reply({ embeds: [banConfirmation], components: [row], ephemeral: true });

                const filter = i => i.customId === 'confirm_ban' || i.customId === 'cancel_ban';
                const collector = confirmationMessage.createMessageComponentCollector({ filter, time: 30000 });

                collector.on('collect', async i => {
                    if (i.customId === 'confirm_ban') {
                        try {
                            await member.ban({ reason: args.slice(1).join(' ') || 'No reason provided.' });

                            const logsChannelId = '1194063541142040637';
                            const logsChannel = message.guild.channels.cache.get(logsChannelId);

                            if (logsChannel) {
                                const banEmbed = new EmbedBuilder()
                                    .setColor('Red')
                                    .setTitle('User Banned')
                                    .addFields(
                                        { name: 'Banned User', value: `<@${member.id}>`, inline: true },
                                        { name: 'By:', value: `<@${message.author.id}>`, inline: true },
                                        { name: 'For:', value: `${args.slice(1).join(' ') || 'No reason provided.'}` },
                                    )
                                    .setTimestamp();

                                logsChannel.send({ embeds: [banEmbed] }).catch(console.error);
                            }
                            message.reply({ content: `${member.user.tag} has been banned successfully.`, ephemeral: true });
                        } catch (error) {
                            console.error(error);
                            message.reply('There was an error processing the ban.');
                        }
                    } else if (i.customId === 'cancel_ban') {
                        confirmationMessage.edit('Ban canceled.', { components: [] });
                    }
                });
            } catch (error) {
                console.error(error);
                message.reply(`An error occurred: ${error.message}`);
            }
        },
    }