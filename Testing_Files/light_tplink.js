// import * as TPLSmartDevice from '/node_modules/tplink-lightbulb';

const TPLSmartDevice = require('tplink-lightbulb');


const light = new TPLSmartDevice('192.168.0.10');
    function turn_on_red() {
    light.power(true, 2500, {
        'mode': 'normal',
        'brightness': 100,
        'hue': 0,
        'saturation': 100,
        'color_temp': 0
    })
        .catch(e => console.error(e));
}
function turn_on_blue() {
    light.power(true, 2500, {
        'mode': 'normal',
        'brightness': 100,
        'hue': 210,
        'saturation': 100,
        'color_temp': 0
    })
        .then(status => {

            console.log(status);

        })
        .catch(e => console.error(e));
}
function turn_on_green() {
    light.power(true, 2500, {
        'mode': 'normal',
        'brightness': 100,
        'hue': 120,
        'saturation': 100,
        'color_temp': 0
    })
        .then(status => {

            console.log(status);

        })
        .catch(e => console.error(e));
}
function turn_on_hsl(x,y,z) {
    light.power(true, 2500, {
        'mode': 'normal',
        'brightness':z,
        'hue': x,
        'saturation': y,
        'color_temp': 0
    })
        .then(status => {

            console.log(status);

        })
        .catch(e => console.error(e));
}

function turn_off() {
     light.power(false, 2500, {
    });
    light.details()
        .then(details => {
            console.log(details);
        })
        .catch(e => console.error(e));
}

function myFunction() {
    // var color=  document.getElementById("myColor").value;
    const r = parseInt(color.substr(1, 2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
    const g = parseInt(color.substr(3,2), 16);
    const b = parseInt(color.substr(5,2), 16);
    const x = rgbToHsl(r,g,b);
    // document.getElementById("myText").value = x;
    turn_on_hsl(x);
}


function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max === min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    h = Math.round(360*h);
    s=Math.round(s*100);
    l=Math.round(l*100);
    // h=360/h;

    return [h, s, l];
}