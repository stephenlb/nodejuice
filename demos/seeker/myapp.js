(function(){

var app = exports || {};

app.journey = function( request, response ) {
    response.impress( '/static/index.htm', {
        dynamic : new Date
    } );
};

return app;

})();
