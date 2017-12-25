import net from 'net';

const request = JSON.stringify({
    id: 0,
    jsonrpc: '2.0',
    method: 'miner_getstat1'
}) + '\n';

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
            resolve(JSON.parse(data.toString().trim()));
        })
        .on('error', (e) => {
            reject(e.message)
        });

    socket.connect(port, host);
});