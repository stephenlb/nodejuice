exports.wsgi = {
    host : null,
    port : 80,
    root : 'index.htm',
    url  : [
        [/^\/rad*$/, '/rad.js'],
        [/^\/[a-z]+$/, '/controller.js'],
        [/^\/$/, '/controller.js'],
        [/^\/.*?/, '/static/']
    ]
};

exports.seeker = {
    host    : null,
    port    : 8002,
    wait    : 200,
    ignore  : [
        /git$/,
        /svn$/,
        /cvs$/,
        /swp$/,
        /~$/
    ]
};
