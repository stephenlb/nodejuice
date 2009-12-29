(function(){

var sys = require('sys')
,   dir = process.ARGV[2]
,   app = exports || {};


app.journey = function( request, response ) {
    response.attack( 200, "text/plain", 'updateds automatcially21342423!' );
};

return app;

})();
