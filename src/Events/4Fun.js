const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // Check if the message starts with the correct command prefix
    if (message.content.toLowerCase().startsWith(config.prefix)) {
      // Split the message content into command and arguments
      const args = message.content.slice(config.prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();

      if (command === 'coinflip') {
        // Coinflip command
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

        const coinflipEmbed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('Coinflip ')
          .setDescription(`The coin landed on: \n 👉 **${result}**`);

        message.channel.send({ embeds: [coinflipEmbed] });

      } else if (command === '8ball') {
        // 8ball command
        const responses = [
          'Yeehaw! Yes!',
          'Nuh! No!',
          'Maybe...',
          'Ask the stars, I\'m just a magic 8-ball.',
          'If you believe hard enough.',
          'Without a doubt!',
          'Certianly!',
          'Can\'t now, my crystal ball is on vacation',
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];

        const eightBallEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Magic 8-Ball 🎱')
        .setThumbnail('https://w0.peakpx.com/wallpaper/615/51/HD-wallpaper-magic-ball-ball-magic-girl-anime.jpg') // Replace 'INSERT_IMAGE_URL' with the actual URL of the magic ball image
        .addFields(
          { name: 'Question', value: args.join(' ') },
          { name: 'Answer', value: response }
        );

        message.channel.send({ embeds: [eightBallEmbed] });
      }
    }
  },
};
