var http    = require("http")
,   process = require("posix")
,   sys     = require("sys")
,   mime    = require("/opt/nodejuice/library/mime").mime
,   utility = require("/opt/nodejuice/library/utility")
,   wsgi    = exports
,   get     = {};


function notFound( req, res ) {
    var notfound = req.uri.path;
    res.sendHeader( 404, [
        ["Content-Type", "text/plain"],
        ["Content-Length", notfound.length]
    ] );
    res.sendBody(notfound);
    res.finish();
}

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

