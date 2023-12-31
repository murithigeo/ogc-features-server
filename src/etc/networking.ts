/**
 * Retrieves the IP address and port number for the server.
 * 
 * @returns {server0}An object containing the server IP address and port number.
 * If the computer is connected to a LAN, then the server0 is the internal IP address of the machine. If airgapped, then address is localhost
 * @returns {PORT}: Can be defined in env. Otherwise is configurable manually. 80 is used because is default port for HTTP
 */
import * as os from "os";


export default async function generateIPAddress() {
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
