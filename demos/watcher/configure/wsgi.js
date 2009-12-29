// WSGI Server
exports.wsgi = {
    host : null,
    port : 8080,
    root : 'index.htm',
    url  : [
        [/^\/static\//, '/static/'],
        [/^\/app.*/   , '/app.js']
    ]
};
