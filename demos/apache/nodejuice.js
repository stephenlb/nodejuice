/* 
    This is config for apache.
    It assumse you are running your server on port 80.

    Put this file in your application directory and run:

        ./nodejuice /path/to/application

    Next you need to point your browser to the sidekick server.
    This is located on port 8010 by default.

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
    wait   : 1200, // delay in milliseconds before a new connection.
                   // setting this too low will make crazziness.

    ignore : [     // path/file to ignore.
        /git$/,
        /svn$/,
        /cvs$/,
        /swp$/,
        /~$/
    ] 
};

