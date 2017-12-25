import net from 'net';

const request = JSON.stringify({
    id: 0,
    jsonrpc: '2.0',
    method: 'miner_getstat1'
}) + '\n';

const parseCardHashrates = (cardHashrates) => cardHashrates.split(';').map((hashrate) => (hashrate / 1000).toFixed(3));

export const getStats = (host, port, timeout = 5000) => new Promise((resolve, reject) => {
    const socket = new net.Socket()
        .on('connect', () => {
            socket.write(request);
            socket.setTimeout(timeout);
        })
        .on('timeout', () => {
            reject(`Claymore didnt answer within ${timeout}ms.`);
            socket.destroy();
        })
        .on('data', (data) => {
            [
                claymoreVersion,
                runningMinutes,
                totalHashrateSharesRejected,
                cardHashrates,
                ,,
                cardTemperaturesFunSpeeds
            ] = JSON.parse(data.toString().trim());
            const [totalHashrate, successful, rejected] = totalHashrateSharesRejected.split(';');
            const parsedCardHashrates = parseCardHashrates(cardHashrates);

            resolve({
                claymoreVersion,
                runningMinutes: Number(runningMinutes),
                totalHashrate,
                shares: {
                    successful,
                    rejected
                },
                hashRates: parsedCardHashrates
            });
        })
        .on('error', (e) => {
            reject(e.message)
        });

    socket.connect(port, host);
});