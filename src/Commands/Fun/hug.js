const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const gifUrls = [
    'https://media.giphy.com/media/svXXBgduBsJ1u/giphy.gif',
    'https://media.giphy.com/media/IRUb7GTCaPU8E/giphy.gif',
    'https://media.giphy.com/media/wnsgren9NtITS/giphy.gif',
    'https://media.giphy.com/media/JLovyTOWK4cuc/giphy.gif'



];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hug')
		.setDescription('Hug your habibi/habibti')
        
        .addUserOption(option =>
            option
              .setName('user')
              .setDescription("Your habibi/habibti")
              .setRequired(true)),
              
	async execute(interaction) {

        const randomGifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];

        const user = interaction.options.getUser('user');

        if(user == interaction.user){
            const hugEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle( `💬 ${interaction.user.username} is feeling lonely today and hugging himself somehow.`)
        .setImage(randomGifUrl);

        await interaction.reply({ embeds: [hugEmbed] });
        }else{
            const hugEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle( `💬 ${interaction.user.username} is hugging ${user.username}.`)
        .setImage(randomGifUrl);

        await interaction.reply({ embeds: [hugEmbed] });
        }
    
        
        
	},
};