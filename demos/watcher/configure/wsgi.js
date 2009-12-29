// WSGI Server
exports.wsgi = {
    host    : null,
    port    : 8080,
    default : 'index.htm',
    url     : [
        [/^\/static.*/, 'static/'],
        [/^\/app.*/   , 'app.js']
    ]
};
