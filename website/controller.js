(function(){

var website   = exports || {}
,   templates = '/templates/';

website.journey = function( request, response ) {
    var where = templates + (request.uri.path.substr(1) || 'index') + '.htm';

    response.utility.noble( response.appdir + where,
    function( type, html, encoding ) {
        response.impress( templates + 'body.htm', { content : html } )
    }, function() { error404( request, response, where ) } );
};

return website;

})();
