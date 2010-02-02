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

exports.sidekick = {
    host  : null, // Leave 'null' to listen on all hosts.
    port  : 8010, // access your server from this port.
    fetch : {     // point to your web server.
        host : 'localhost',
        port : 80
    }
};

exports.seeker = {
    host    : null,
    port    : 8002,
    delay   : 10,
    wait    : 1800,
    touch   : false, // allow file touch to push updates.
    ignore  : [
        /git$/,
        /svn$/,
        /cvs$/,
        /swp$/,
        /~$/
    ]
};
