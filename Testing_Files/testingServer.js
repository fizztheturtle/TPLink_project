// Load the http module to create an http server.
var http = require('http');

// Create a function to handle every HTTP request
function handler(req, res){

    var form = '';

    if(req.method == "GET"){

        form = '<!doctype html> \
<html lang="en"> \
<head> \
    <meta charset="UTF-8">  \
    <title>Form Calculator Add Example</title> \
</head> \
<body> \
  <form name="myForm" action="" onsubmit="return ajax();"method="post">\
      <input type="text" name="A"> + \
      <input type="text" name="B"> = \
      <span id="result"></span> \
      <br> \
      <input type="submit" value="Submit"> \
  </form> \
  <script> \
    function ajax(){ \
      var a = document.forms["myForm"]["A"].value; \
      var b = document.forms["myForm"]["B"].value; \
      var formdata = "A="+a+"&B="+b; \
      \
      xmlhttp = new XMLHttpRequest(); \
      xmlhttp.onreadystatechange=function(){ \
        if(xmlhttp.readyState==4 && xmlhttp.status==200){ \
          document.getElementById("result").innerHTML=xmlhttp.responseText; \
        }; \
      }; \
      xmlhttp.open("POST","",true); \
      xmlhttp.send(formdata); \
      return false; \
    } \
  </script> \
</body> \
</html>';

        //respond
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(form);

    } else if(req.method == 'POST'){

        //read form data
        req.on('data', function(chunk) {

            //grab form data as string
            var formdata = chunk.toString();

            //grab A and B values
            var a = eval(formdata.split("&")[0]);
            var b = eval(formdata.split("&")[1]);

            var result = calc(a,b);

            //fill in the result and form values
            form = result.toString();

            //respond
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200);
            res.end(form);

        });

    } else {
        res.writeHead(200);
        res.end();
    };

};

//js functions running only in Node.JS
function calc(a,b){
    return  Number(a)+Number(b);;
}

// Create a server that invokes the `handler` function upon receiving a request
http.createServer(handler).listen(8000, function(err){
    if(err){
        console.log('Error starting http server');
    } else {
        console.log("Server running at http://127.0.0.1:8000/ or http://localhost:8000/");
    };
});