const http = require('http');

const fs = require('fs');
const {parse} = require('querystring');
const TPLSmartDevice = require('tplink-lightbulb');
const {Client} = require('tplink-smarthome-api');

const client = new Client();
const light = new TPLSmartDevice('192.168.0.11');
const light2 = new TPLSmartDevice('192.168.0.76');
http.createServer(function (req, res) {
    // const q = url.parse(req.url, true);
    // const filename = "." + q.pathname;
    if (req.url === '/light_off') {
        turn_off(light);
        console.log('Turned light off ');
        res.writeHead(200);
        res.end('<h1> Light has been set to off</h1>');
    } else if (req.url === '/low') {
        turn_on_temp_l(light);
        console.log('light is on a low setting');
        res.writeHead(200);
        res.end('<h1> light is on a low setting</h1>');
    } else if (req.url === '/high') {
        turn_on_temp_h(light);
        console.log('light is at full brightness');
        res.writeHead(200);
        res.end('<h1> light is at full brightness</h1>');
    }if (req.url === '/light_off2') {
        turn_off(light2);
        console.log('Turned light off ');
        res.writeHead(200);
        res.end('<h1> Light has been set to off</h1>');
    } else if (req.url === '/low2') {
        turn_on_temp_l(light2);
        console.log('light is on a low setting');
        res.writeHead(200);
        res.end('<h1> light is on a low setting</h1>');
    } else if (req.url === '/high2') {
        turn_on_temp_h(light2);
        console.log('light is at full brightness');
        res.writeHead(200);
        res.end('<h1> light is at full brightness</h1>');
    }  else if (req.url === '/plug_off') {
        client.getDevice({host: '192.168.0.13'}).then((device) => {
            // device.getSysInfo().then(console.log);
            // device.getRealtime().then(console.log);
            device.setPowerState(false);
        });
        console.log('plug is off');
        res.writeHead(200);
        res.end('<h1> plug has turned off</h1>');
    } else if (req.url === '/plug_on') {
        client.getDevice({host: '192.168.0.13'}).then((device) => {
            // device.getSysInfo().then(console.log);
            // device.getRealtime().then(console.log);
            device.setPowerState(true);
        });
        console.log('plug is on');
        res.writeHead(200);
        res.end('<h1> plug has turned on</h1>');

    } else if (req.url === '/plug_off2') {
        client.getDevice({host: '192.168.0.43'}).then((device) => {
            // device.getSysInfo().then(console.log);
            // device.getRealtime().then(console.log);
            device.setPowerState(false);
        });
        console.log('plug is off');
        res.writeHead(200);
        res.end('<h1> plug has turned off</h1>');
    } else if (req.url === '/plug_on2') {
        client.getDevice({host: '192.168.0.43'}).then((device) => {
            // device.getSysInfo().then(console.log);
            // device.getRealtime().then(console.log);
            device.setPowerState(true);
        });
        console.log('plug is on');
        res.writeHead(200);
        res.end('<h1> plug has turned on</h1>');

    } else {
        fs.readFile('./Colour_html/' + req.url, function (err, data) {

            if (!err) {
                if (req.method === 'POST') {
                    collectRequestData(req, result => {
                        res.end(`Parsed data belonging to ${result.fname}`);

                    });
                }
                const dotoffset = req.url.lastIndexOf('.');
                const mimetype = dotoffset === -1
                    ? 'text/plain'
                    : {
                        '.html': 'text/html',
                        '.ico': 'image/x-icon',
                        '.jpg': 'image/jpeg',
                        '.png': 'image/png',
                        '.gif': 'image/gif',
                        '.css': 'text/css',
                        '.js': 'text/javascript'
                    }[req.url.substr(dotoffset)];
                res.setHeader('Content-type', mimetype);
                res.end(data);
                console.log(req.url, mimetype);

            } else {
                console.log('file not found: ' + req.url);
                res.writeHead(404, "Not Found");
                res.end();
            }


            return res.end();
        });
    }
}).listen(7999);

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        let string = '';
        request.on('data', chunk => {
            body += chunk.toString();
            console.log(body);
            let uri_dec = decodeURIComponent(body);
            console.log(uri_dec);
            string = uri_dec.replace("colour=", '');
            console.log(string);
            if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(string)) {
                convertAndSet(string)
            }

        });
        request.on('end', function () {
            callback(parse(body));
        });
    } else {
        callback(null);
    }
}

function turn_on_hsl(x, device) {
    device.power(true, 2500, {
        'mode': 'normal',
        'brightness': x[2],
        'hue': x[0],
        'saturation': x[1],
        'color_temp': 0
    })
        .then(status => {
        })
        .catch(e => console.error(e));
}

function turn_on_temp_l(device) {
    device.power(true, 2500, {
        'mode': 'normal',
        'brightness': 5,
        'color_temp': 2700
    }).then(status => {
    })
        .catch(e => console.error(e));
}

function turn_on_temp_h(device) {
    device.power(true, 2500, {
        'mode': 'normal',
        'brightness': 100,
        'color_temp': 2700
    }).then(status => {
    })
        .catch(e => console.error(e));
}

function turn_off(device) {
    device.power(false, 2500, {});
    device.details()
        .then(details => {
            // console.log(details);
        })
        .catch(e => console.error(e));
}

function convertAndSet(color) {
    // var color=  document.getElementById("myColor").value;
    // console.log(color);
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    // console.log(result);
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    console.log("R:" + r + " G:" + g + " B:" + b);
    if (r === 0 && g === 0 && b === 0) {
        turn_off();
    } else {
        const x = rgbToHsl(r, g, b);
        // document.getElementById("myText").value = x;
        turn_on_hsl(x);
    }
}

//
// function hexToRgb(hex) {
//     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//     return result ? {
//         r: parseInt(result[1], 16),
//         g: parseInt(result[2], 16),
//         b: parseInt(result[3], 16)
//     } : null;
// }

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    h = Math.round(360 * h);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    // h=360/h;

    return [h, s, l];
}