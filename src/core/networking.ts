import * as os from "os";

export async function getIPAddress() {
    var ifaces = os.networkInterfaces();
    var ips: any = 0;
    for (var dev in ifaces) {
        ifaces[dev].forEach(function (details) {
            if (details.family == 'IPv4' && details.internal == false) {
                ips = details.address;
            }
        });
    }
    const serverIP = ips === 0 ? 'localhost' : ips;
    const PORT = process.env.PORT || 80;
    return { serverIP, PORT };
}
