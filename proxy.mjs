import net from "node:net";

// Transparent TCP proxy so the browser can reach the Windows-hosted API via
// localhost. Forwards 127.0.0.1:5033 -> <winIP>:5033 without touching the
// Origin header, so the API's CORS rule (allow http://localhost:5173) still matches.
const LISTEN_HOST = "127.0.0.1";
const LISTEN_PORT = 5033;
const TARGET_HOST = process.env.WIN_IP ?? "172.24.176.1";
const TARGET_PORT = 5033;

const server = net.createServer((client) => {
    const upstream = net.connect(TARGET_PORT, TARGET_HOST, () => {
        client.pipe(upstream);
        upstream.pipe(client);
    });
    const kill = () => {
        client.destroy();
        upstream.destroy();
    };
    client.on("error", kill);
    upstream.on("error", kill);
});

server.listen(LISTEN_PORT, LISTEN_HOST, () => {
    console.log(`proxy ${LISTEN_HOST}:${LISTEN_PORT} -> ${TARGET_HOST}:${TARGET_PORT}`);
});
