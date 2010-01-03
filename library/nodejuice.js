exports.wsgi = {
    host  : null, // Leave 'null' to listen on all hosts.
    port  : 8080, // port :-/
    root  : 'index.htm', // used for static content as the default.
    retry : { max: 4, wait: 120 }, // number of retries to load a file.
    url   : [ // interface between browser URL Request and Files.

        // [ /^\/app$/, '/app.js' ], // run an application.
        // [/^\/.*/, '/static/'], // serve content from /static/ dir.
        [/^\/.*/, '/'] // server static content from root app dir.

    ]
};

exports.seeker = {
    host   : null, // Leave 'null' to listen on all hosts.
    port   : 8002, // port :-/
    wait   : 2000, // delay in milliseconds before a new connection.
                   // setting this too low will make crazziness.
    ignore : [ /git$/, /svn$/, /cvs$/, /swp$/, /~$/ ] // path/file to ignore.
};

exports.proxy = {
    host  : null, // Leave 'null' to listen on all hosts.
    port  : 8010, // access your server from this port.
    fetch : {     // point to your web server.
        host : 'localhost',
        port : 8080
    }
};
