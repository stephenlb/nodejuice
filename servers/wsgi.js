var http     = require("http")
,   posix    = require("posix")
,   sys      = require("sys")
,   appdir   = process.ARGV[2]
,   njdir    = process.ARGV[3]
,   config   = require(appdir + "/configure/wsgi").wsgi
,   mime     = require(njdir  + "/library/mime").mime
,   utility  = require(njdir  + "/library/utility")
,   wsgi     = exports
,   requests = {};

/*
    the plan:
    ----------
    load config
    start server with fun(req, res){
        check request if matches 
            check if is a dir or a js file.
            if js file require or use already cached required
            if dir, then it's a bunch of static files.
        if not match, send 404
    }
*/

http.createServer(function ( req, res ) {

    var static = /\/$/
    ,   action = (config.url.filter(function(url) {
        return url[0].test(req.uri.path) ? url[1] : 0
    })[0] || [])[1];
    
    // Leave if we don't know what to do.
    if (!action) return error404( req, res );

    // Is this a static directory?
    if (static.test(action)) {
        sys.puts('STATIC: ' + action);
        sys.puts(sys.inspect(action));
        // do static
    }
    else {
        // do script
    }

}).listen( config.port, config.host );
sys.puts("Server WSGI("+process.pid+"): " + JSON.stringify(config));

function error404( req, res ) {
    var response = "Non-configured pathname: " + JSON.stringify(req.uri);
    log( 404, req.uri );
    res.sendHeader( 404, [
        ["Content-Type", "text/plain"],
        ["Content-Length", response.length]
    ] );
    res.sendBody(response);
    res.finish();
}

function log( code, obj ) {
    sys.puts( code + ": " + JSON.stringify(obj) );
}

/*

wsgi.get = function ( path, handler ) {
    get[path] = handler;
};

var server = http.createServer(function (req, res) {
  if (req.method === "GET" || req.method === "HEAD") {
    var handler = get[req.uri.path] || notFound;

    res.simpleText = function (code, body) {
      res.sendHeader(code, [ ["Content-Type", "text/plain"]
                           , ["Content-Length", body.length]
                           ]);
      res.sendBody(body);
      res.finish();
    };

    res.simpleJSON = function (code, obj) {
      var body = JSON.stringify(obj);
      res.sendHeader(code, [ ["Content-Type", "text/json"]
                           , ["Content-Length", body.length]
                           ]);
      res.sendBody(body);
      res.finish();
    };

    handler(req, res);
  }
});

server.listen( port, host );

wsgi.close = function () { server.close(); };

function extname (path) {
  var index = path.lastIndexOf(".");
  return index < 0 ? "" : path.substring(index);
}

wsgi.staticHandler = function (filename) {
  var body, headers;
  var content_type = wsgi.mime.lookupExtension(extname(filename));
  var encoding = (content_type.slice(0,4) === "text" ? "utf8" : "binary");

  function loadResponseData(callback) {
    if (body && headers && !DEBUG) {
      callback();
      return;
    }

    sys.puts("loading " + filename + "...");
    var promise = process.cat(filename, encoding);

    promise.addCallback(function (data) {
      body = data;
      headers = [ [ "Content-Type"   , content_type ]
                , [ "Content-Length" , body.length ]
                ];
      if (!DEBUG)
        headers.push(["Cache-Control", "public"]);
       
      sys.puts("static file " + filename + " loaded");
      callback();
    });

    promise.addErrback(function () {
      sys.puts("Error loading " + filename);
    });
  }

  return function (req, res) {
    loadResponseData(function () {
      res.sendHeader(200, headers);
      res.sendBody(body, encoding);
      res.finish();
    });
  }
};

*/