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

exports.sidekick = {
    host  : null, // Leave 'null' to listen on all hosts.
    port  : 8010, // access your server from this port.
    fetch : {     // point to your web server.
        host : 'localhost',
        port : 80
    }
};
