exports.wsgi = {
    host : null,
    port : 80,
    root : 'index.htm',
    url  : [
        [/^\/[a-z]+$/, '/controller.js'],
        [/^\/$/, '/controller.js'],
        [/^\/.*?/, '/static/']
    ]
};

exports.seeker = {
    host    : null,
    port    : 8002,
    ignore  : [
        /git$/,
        /svn$/,
        /cvs$/,
        /swp$/
    ]
};
