module.exports = {
    logBalanceEdit: async function (client, userId, amount) {
        const channel = client.channels.cache.find(channel => channel.name === 'profit-allocation');
        if (channel) {
            const message = `User ${userId} has just won ${amount} amount!`;
            await channel.send(message);
        } else {
            console.error('Profit allocation channel not found.');
        }
    }
};
