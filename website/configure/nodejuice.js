exports.wsgi = {
    host : null,
    port : 80,
    root : 'index.htm',
    url  : [ [/^\/.*?\/?/, '/static/'] ]
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
