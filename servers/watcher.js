var sys   = require('sys')
,   http  = require('http');

/*
http.createServer(function (req, res) {
    res.sendHeader(200, {"Content-Type": "text/plain"});
    res.sendBody("Hello World\n");
    res.finish();
}).listen(8000);
*/

var callbacks   = [];
var connections = 0;
var server      = http.createServer(function (req, res) {
    callbacks.push(function(wait){
        res.sendHeader( 200, {"Content-Type": "text/html"} );
        res.sendBody(content);
        res.finish();
    });

    sys.puts('\nCallback Length: ' + callbacks.length);
    sys.puts('\nTimes: ' + times++);
    // res.finish();

/*
    setTimeout(function(){
        res.sendHeader( 200, {"Content-Type": "text/plain"} );
        res.sendBody('hello to all that are kjel akjsel.\n');
        res.finish();
    }, 2000);
*/
});
server.listen(8002);


/*
process.watchFile( file, function(curr, prev) {
    if ( curr.size == prev.size ) return;

    while (callbacks.length > 0) {
        sys.puts('\nlength: ' + callbacks.length);
        callbacks.shift()(content + ' length: ' + callbacks.length);
    }
} );
sys.puts("Server running at http://127.0.0.1:8000/");

*/
