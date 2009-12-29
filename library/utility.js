var posix    = require("posix")
,   sys      = require("sys")
,   appdir   = process.ARGV[2]
,   njdir    = process.ARGV[3]
,   devmode  = !process.ARGV[4]
,   config   = require(appdir + "/configure/wsgi").wsgi
,   mime     = require(njdir  + "/library/mime").mime
,   rxclever = /("[^"]+"):/g;

config.retry = config.retry || { max: 3, wait: 100 };

// Non Blocking Recursive Directory
var recurse = exports.recurse = function( start, ignore, callback ) {
    posix.readdir(start).addCallback(function(files) {
        files.forEach(function(file) {
            // Ignored Files/Directories
            if (ignore.filter(function(item) {
                return item.test(file)
            }).length) return;

            recurse( start + '/' + file, ignore, callback );
            callback(start + '/' + file);
        });
    });
};

var inform = exports.inform = function(obj ) {
    sys.puts(JSON.stringify(obj).replace( rxclever, function( _, key ) {
        return "\033[0;35;1m" + key + "\033[0m:"
    } ));
};

var noble = exports.noble = function( file, success, fail, retries ) {
    var type     = mime.get(file)
    ,   encoding = (type.slice( 0, 4 ) === "text" ? "utf8" : "binary")
    ,   noblefile  = posix.cat( file, encoding );

    noblefile.addCallback(function(data) {
        if (!data) return retry();
        success && success( type, data, encoding );
    });

    noblefile.addErrback(function() { retry() });

    function retry() {
        retries = retries || 0;

        inform({ retry : retries, file: file });

        if ( retries < config.retry.max ) setTimeout( function() {
            noble( file, success, fail, retries + 1 )
        }, config.retry.wait );
        else return fail && fail() || function() {
            inform({ fail: 'true', file: file });
        };
    }
};
