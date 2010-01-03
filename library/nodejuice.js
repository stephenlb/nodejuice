exports.wsgi = {
    host  : null, // Leave 'null' to listen on all hosts.
    port  : 8080,
    root  : 'index.htm', // used for static content as the default.
    retry : { max: 4, wait: 120 }, // number of retries to load a file.
    url   : [ // interface between browser URL Request and Files on your Disk.

        // [ /^\/app$/, '/app.js' ], // run an application file on the server.
        // [/^\/.*/, '/static/'] // server static content from /static/ dir.
        [/^\/.*/, '/'] // server static content from root app dir.

    ]
};

exports.seeker = {
    host   : null, // Leave 'null' to listen on all hosts.
    port   : 8002,
    ignore : [ /git$/, /svn$/, /cvs$/, /swp$/ ] // path/file to ignore.
};

exports.proxy = {
    host  : null, // Leave 'null' to listen on all hosts.
    port  : 8010, // access your server from this port.
    fetch : {     // point to your web server.
        host : 'localhost',
        port : 8080
    }
};
