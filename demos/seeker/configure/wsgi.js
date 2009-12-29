exports.wsgi = {
    host : null,
    port : 8080,
    root : 'index.htm',
    url  : [
        [/^\/myapp.*/, '/myapp.js'],
        [/^\/.*?\/?/ , '/static/']
    ]
};
