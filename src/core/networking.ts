import * as os from "os";

export async function getIPAddress() {
    var ifaces = os.networkInterfaces();
    var ips: any = 0;
    Object.keys(ifaces).forEach((dev) => {
        if (!dev.toLowerCase().includes('wsl')) { // Filter out WSL interfaces
            ifaces[dev].forEach((details) => {
                if (details.family === 'IPv4' && !details.internal) {
                    ips = details.address;
                }
            });
        }
    });
    const server0 = ips === 0 ? 'localhost' : ips;
//    const server1 = 'localhost';
    const PORT = process.env.PORT || 80;
    return { server0, PORT };
}
