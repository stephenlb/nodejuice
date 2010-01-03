var posix    = require("posix")
,   http     = require('http')
,   sys      = require("sys")
,   appdir   = process.ARGV[2]
,   njdir    = process.ARGV[3]
,   njconfig = process.ARGV[4]
,   devmode  = process.ARGV[5]
,   mime     = require(njdir  + "/library/mime").mime
,   rxclever = /"([^"]+)"(:)?/g
,   rxdigi   = /\d+/g
,   rxdelma  = /\s*([},])\s*/g
,   rxmagic  = /{{([\w\-]+)}}/g
,   rxsneaky = /^\s*((?:<!?doc[^>]*>\s*)?(?:<htm[^>]*>\s*)?(?:<hea[^>]*>)?)?/i;

var ignite = exports.ignite = function() {
    return process.mixin( true,
        require(njdir  + "/library/nodejuice"),
        require(njconfig)
    );
};

var config  = ignite()
,   seekin  = '$1<script src="http://'
,   seekout = ':' + config.seeker.port + '"></script>';

var amuse = exports.amuse = function( text, req ) {
    return text.replace( rxsneaky, seekin +
        req.headers.host.split(':')[0] +
    seekout );
};

var bolt = exports.bolt = function( file, success, fail ) {
    noble( file, function( type, data, encoding ) {
        try {
            var lightning = eval('(function(){var exports={};' + data +
                ';return exports})()');
            return lightning ? success(lightning) : fail && fail();
        }
        catch(e) { fail && fail(e) }
    }, function() { fail && fail() } );
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

var inform = exports.inform = function(obj) {
    if (!devmode) return sys.puts(JSON.stringify(obj));

    sys.puts(JSON.stringify(obj).replace( rxdigi, function( num ) {
        return "\033[0;36;1m" + num + "\033[0m";
    } ).replace( rxclever, function( _, key, del ) {
        return (del ? ' \033[0;35;1m' : '\033[0;32;1m"') + key +
            (del ? '\033[0m: ' : '"\033[0m ');
    } ).replace( rxdelma, function( _, del ) {
        return " " + del + " ";
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

        if ( retries < config.wsgi.retry.max ) setTimeout( function() {
            noble( file, success, fail, retries + 1 )
        }, config.wsgi.retry.wait );
        else return fail && fail() || function() {
            inform({ fail: 'true', file: file });
        };
    }
};

var fetch = exports.fetch = function(
    port,     // 80
    host,     // "www.google.com"
    type,     // "GET"
    path,     // "/"
    headers,  // { asdf : asdf }
    ready,    // function (response) {}
    good,     // function ( chunk, response, encoding ) {}
    bad,      // function ( chunk, response, encoding ) {}
    finished  // function ( data, response, encoding ) {}
) {
    headers      = headers || {};
    headers.host = host;

    var data    = ''
    ,   request = http.createClient( port, host )
        .request( type, path, headers );

    request.finish(function(response) {
        var type = response.headers['content-type']
        ,   encoding = (type.slice( 0, 4 ) === "text" ? "utf8" : "binary");

        inform({
            proxied  : config.proxy.fetch.host + ':' + config.proxy.fetch.port,
            code     : response.statusCode,
            type     : type,
            encoding : encoding,
            uri      : path
        });

        ready && ready(response);

        response.setBodyEncoding(encoding);
        response.addListener( "body", function(chunk) {
            data += chunk;

            if (response.statusCode == 200)
                good && good( chunk, response, encoding );
            else bad && bad( chunk, response, encoding );
        } );

        response.addListener( "complete", function() {
            finished && finished( data, response, encoding );
        } );
    });

    /*
    request.finish(function (response) {
      sys.puts("STATUS: " + response.statusCode);
      sys.puts("HEADERS: " + JSON.stringify(response.headers));
      response.setBodyEncoding("utf8");
      response.addListener("body", function (chunk) {
        sys.puts("BODY: " + chunk);
      });
    });
    */
};

var earliest = exports.earliest = function() { return+new Date };

exports.vigilant = function( text, unique ) {
    return 'window["' + unique + '"] = "' + text + '";'
};

