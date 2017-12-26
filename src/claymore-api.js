import net from 'net';

const request = JSON.stringify({
    id: 0,
    jsonrpc: '2.0',
    method: 'miner_getstat1'
}) + '\n';

const parseHashrate = (hashrate) => hashrate === 'off' ? 0 : Number(hashrate) / 1000;

const parseCardHashrates = (hashrates) => hashrates.split(';').map(parseHashrate);

const parseStats = (stats) => {
    const [totalHashrate, successfulShares, rejectedShares] = stats.split(';');
    return {
        hashrate: parseHashrate(totalHashrate),
        shares: {
            successful: Number(successfulShares),
            rejected: Number(rejectedShares)
        }
    }
};

const parseCardTemperaturesFunSpeeds = (temperatureFanSpeeds) => {
    const parsed = temperatureFanSpeeds.split(';');
    let grouped = [];
    while (parsed.length !== 0) {
        const temperature = parsed[0];
        const fanSpeed = parsed[1];
        parsed.splice(0, 2);
        grouped = [...grouped, {temperature, fanSpeed}];
    }
    return grouped;
};

const parseCoin = (stats, hashrates) => Object.assign(
    {},
    parseStats(stats),
    {cardHashrates: parseCardHashrates(hashrates)}
);

export const toStatsJson = (result, positions = {
    version: 0,
    uptime: 1,
    ethashStats: 2,
    ethashHr: 3,
    dcoinStats: 4,
    dcoinhHr: 5,
    temperatureFanSpeeds: 6
}) => {
    return {
        claymoreVersion: result[positions.version],
        uptime: positions.uptime ? Number(result[positions.uptime]) : undefined,
        ethash: positions.ethashStats && positions.ethashHr ?
            parseCoin(result[positions.ethashStats], result[positions.ethashHr]) : undefined,
        dcoin: positions.dcoinStats && positions.dcoinhHr ?
            parseCoin(result[positions.dcoinStats], result[positions.dcoinhHr]) : undefined,
        sensors: positions.temperatureFanSpeeds ?
            parseCardTemperaturesFunSpeeds(result[positions.temperatureFanSpeeds]) : undefined
    };
};

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
            const result = JSON.parse(data.toString().trim()).result;
            resolve(result);
        })
        .on('error', (e) => {
            reject(e.message)
        });

    socket.connect(port, host);
});

export const getStatsJson = (host, port, timeout = 5000) => getStats(host, port, timeout).then(toStatsJson);