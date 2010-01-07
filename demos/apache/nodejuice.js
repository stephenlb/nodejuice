/* 
    This is config for apache.
    It assumse you are running your server on port 80 !!!

    Put this very file in your application directory:

        cp ./library/nodejuice.js /my/app-dir/.

    Run from command line:

        ./nodejuice /path/to/application

    Next you need to point your browser to the sidekick server:

        http://localhost:8010/

    Once loaded from that url your browser will update instatnly on file change.
*/
exports.sidekick = {
    host  : null, // Leave 'null' to listen on all hosts.
    port  : 8010, // access your server from this port.
    fetch : {     // point to your web server.
        host : 'localhost',  // this should be apache or other 
        port : 80
    }
};

exports.seeker = {
    host   : null, // Leave 'null' to listen on all hosts.
    port   : 8002, // port :-/
    delay  : 150,  // time in ms before page starts to reload.
                   // setting too low will cause file read errors in Apache
    wait   : 1200, // delay in milliseconds before a new connection.
                   // setting this too low will make crazziness.

    ignore : [     // path/file to ignore.
        /\./
    ] 
};
