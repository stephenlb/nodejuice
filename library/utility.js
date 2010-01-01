var posix    = require("posix")
,   sys      = require("sys")
,   appdir   = process.ARGV[2]
,   njdir    = process.ARGV[3]
,   devmode  = !process.ARGV[4]
,   config   = require(appdir + "/configure/wsgi").wsgi
,   seeker   = require(appdir + "/configure/seeker").seeker
,   seekin   = '$1<script src="http://'
,   seekout  = ':' + seeker.port + '"></script>'
,   mime     = require(njdir  + "/library/mime").mime
,   rxclever = /"([^"]+)":/g
,   rxmagic  = /{{([\w\-]+)}}/g
,   rxsneaky = /^\s*((?:<\!?doctype[^>]*>\s*)?(?:<html[^>]*>)?)?/i;


config.retry = config.retry || { max: 3, wait: 100 };

var amuse = exports.amuse = function( text, req ) {
    return text.replace(
        rxsneaky, seekin + req.headers.host.split(':')[0] + seekout
    );
};

var supplant = exports.supplant = function( text, args ) {
    return text.replace( rxmagic, function( _, key ) {
        return args[key] || ''
    } );
};

var impress = exports.impress = function( file, args, success, fail ) {
    noble( file, function( type, data, encoding ) {
        success( type, supplant( data, args ), encoding )
    }, fail || function(){} )
};

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
        return "\033[0;35;1m " + key + "\033[0m : "
    } ));
};

var noble = exports.noble = function( file, success, fail, retries ) {
    var type     = mime.get(file)
    ,   encoding = (type.slice( 0, 4 ) === "text" ? "utf8" : "binary")
    ,   noblefile  = posix.cat( file, encoding );

    noblefile.addCallback(function(data) {
        if (typeof data !== 'string') return retry();
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

var earliest = exports.earliest = function() { return+new Date };

exports.vigilant = function( text, unique ) {
    return 'window["' + unique + '"] = "' + text + '";'
};
