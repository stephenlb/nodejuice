var website   = exports
,   templates = '/templates/';

website.journey = function( request, response ) {
    var where = response.appdir +
                templates +
                (request.url.substr(1) || 'index') + '.htm';

    response.utility.noble( where,
    function( type, html, encoding ) {
        response.impress( templates + 'body.htm', { content : html } )
    }, function() { response['404']( request, response, where ) } );
};
