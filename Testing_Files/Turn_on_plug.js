const { Client } = require('tplink-smarthome-api');

const client = new Client();
const plug = client.getDevice({host: '192.168.0.12'}).then((device)=>{
    device.getSysInfo().then(console.log);
    // device.getRealtime().then(console.log);
    device.setPowerState(false);
});
// plug.getPlug({host: '192.168.0.12'}).then((device)=>{
//     device.getSysInfo().then(console.log);
//     device.setPowerState(false);
//     device.getRealtime().then(console.log)
// });

// Look for devices, log to console, and turn them on
// client.startDiscovery().on('device-new', (device) => {
//     device.getSysInfo().then(console.log);
//     device.setPowerState(true);
// });));