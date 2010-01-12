
/* DON'T MODIFY THIS FILE!!!
COPY THIS FILE TO YOUR APPLICATION DIRECTORY FIRST!!! */

exports.wsgi = {
    host  : null, // Leave 'null' to listen on all hosts.
    port  : 8080, // port :-/
    root  : 'index.htm', // used for static content as the default.
    retry : { max: 4, wait: 120 }, // number of retries to load a file.
    url   : [ // interface between browser URL Request and Files.

        // [ /^\/app$/, '/app.js' ], // run an application.
        // [/^\/.*?/, '/static/'], // serve content from /static/ dir.
        [/^\/.*?/, '/'] // server static content from root app dir.

    ]
};

exports.seeker = {
    host   : null, // Leave 'null' to listen on all hosts.
    port   : 8002, // port :-/
    delay  : 150,  // time in ms before page starts to reload.
                   // setting too low will cause file read errors in Apache
    wait   : 1200, // time in milliseconds before a new connection.
                   // setting too low will make crazziness.
    ignore : [     // path or file name to ignore.
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
        port : 8080
    }
};
