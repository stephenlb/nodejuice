// WSGI Server
exports.wsgi = {
    host  : null,
    port  : 8080,
    root  : 'index.htm',
    retry : {
        wait : 100,
        max  : 5
    },
    url   : [
        [/^\/watch.*/ , '/myapp.js'],
        [/^\/static\//, '/static/'],
        [/^\/.*?\/?/  , '/static/']
    ]
};
