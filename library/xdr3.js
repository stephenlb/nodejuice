/* ============================================================================
Copyright (c) 2009 Stephen Blum
http://www.google.com/profiles/blum.stephen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


=============================================================================

Using Closure Compiler and Compression
--------------------------------------
java -jar ./compiler.jar --js=my-file.js > my-file.min.js
gzip -c9 my-file.min.js > my-file.min.js.gz

Compiling this library without any code written in the closure will print:

    (function(){})();

Only the functions used are included in your distribution. Let's compare 
between jQuery and nodejsfast client library.

jQuery 1.2.6 is 55kb.
nodejsfast starts at 17 bytes and will grow automatically per function use.

Download Closure Compiler
-------------------------
http://code.google.com/closure/compiler/

Donwload Node JS Server
-----------------------
http://nodejs.org/#download


=============================================================================

Node JS Fast Client
-------------------

This client is meant to be used to create very small and fast JavaScript
browser code with an interface to a non-blocking web server. Interfacing
with a non-blocking web server such as NodeJS is not required.

WTF? WHY?
---------
Lazzy, Fast, Small. Does not pollute global namespace, not even with one var.

============================================================================ */

(function() {

/**
 * NOW
 * ===
 * var timestamp = now();
 */
var now = function() {
    return+new Date

/**
 * WINFO
 * =====
 * var window_info = winfot();
 * log(window_info.height);
 */
},  winfo = function() {
    return { height    : window.innerHeight ||
                         document.documentElement.clientHeight ||
                         document.body.clientHeight,
             scrollTop : document.documentElement.scrollTop ||
                         document.body.scrollTop
           }

/**
 * OFFSET
 * =======
 * offset( search('div')[0], 'Width' );
 * offset( search('div')[0], 'Height' );
 * offset( search('div')[0], 'Top' );
 * offset( search('div')[0], 'Left' );
 */
},  offset = function( node, what ) {
    var pos  = 0
    ,   what = what || 'Top';

    while (node) {
        pos += node['offset'+what];
        node = node.offsetParent;
    }

    return pos

/**
 * SEARCH
 * ======
 * var elements = search('a div span');
 */
},  search = function(elements) {
    var list = [];
    each( elements.split(/\s+/), function(el) {
        each( document.getElementsByTagName(el), function(node) {
            list.push(node);
        } );
    } );
    return list

/**
 * EACH
 * ====
 * each( [1,2,3], function(item) { console.log(item) } )
 */
},  each = function( list, fun ) {
    for ( var i = 0, len = list.length; i < len; i++ ) fun(list[i])
    
/**
 * MAP
 * ===
 * var list = map( [1,2,3], function(item) { return item + 1 } )
 */
},  map = function( list, fun ) {
    var fin = [];
    each( list, function(l) { fin.push(fun(l)) } );
    return fin

/**
 * GREP
 * ====
 * var list = grep( [1,2,3], function(item) { return item % 2 } )
 */
},  grep = function( list, fun ) {
    var fin = [];
    each( list, function(l) { fun(l) && fin.push(l) } );
    return fin

/**
 * BIND
 * ====
 * bind( 'keydown', search('a')[0], function(element) {
 *     console.log( element, '1st anchor' )
 * } );
 */
},  bind = function( type, el, fun ) {
    if ( el.addEventListener ) el.addEventListener( type, fun, false );
    else if ( el.attachEvent ) el.attachEvent( 'on' + type, fun );
    else  el[ 'on' + type ] = fun;

/**
 * BODY
 * ====
 * body().appendChild(elm);
 */
},  body = function() {
    return document.getElementsByTagName('body')[0]

/**
 * STRINGIFY
 * =========
 * var json_string = stringify({obj:'dat'});
 */
},  stringify = function(data) {
    return JSON && JSON.stringify(data) ||
        '({'+ map( data, function( k, v ) {
            return '"' + k.replace( json_r, '\\$1' ) +
               '":' + ( typeof v === 'string' ?
               '"' + v.replace( json_r, '\\$1' ) + '"' : v
               )
    } ).join(',') + '})'

/**
 * PARSE
 * =====
 * var obj = parse("{obj:'dat'}");
 */
},  parse = function(string) {
    return JSON && JSON.parse(string) || eval('('+string+')')

/**
 * XDR Cross Domain Request
 * ========================
 *  xdr({
 *     url  : 'url',  // required
 *     type : 'text', // [script, json, text]
 *     data : {
 *         key : value,
 *         key : value
 *     },
 *     success : function(response) {
 *         // your code here
 *     },
 *     fail : function() {
 *         // your code here
 *     }
 * });
 */
},  xdr = function( setup ) {
    var script = _.create('script')
    ,   unique = 'xdr3:' + now()
    ,   json_r = /([\\"])/g
    ,   done   = function() {
            script.onload = script.onreadystatechange = script.onerror = null;
            remove( body(), script );
        };

    script.onload = script.onreadystatechange = function(e) {
        // nothing untill it's loaded.
        var state = this.readystate;
        if ( !(!state ||
                state == "loaded" ||
                state == "complete")) return;

        var wkey     = escape(unescape(unique))
        ,   response = unescape( window[wkey] || '' )
        ,   success  = setup.success;

        // setup type supplied
        switch(setup.type) {
            case 'json' :
                response = parse(response);
                break;
            case 'script' :
                response = eval(response);
        }

        // invoke user defined function
        success && success.call( script, response );

        // destroy
        window[wkey] = '';
        done();
    };

    bind( 'error', script, function() {
        // invoke user defined function
        setup.fail && setup.fail.call( script, unescape(script.src) );

        // destroy
        done();
    } );

    // prepare json
    script.src = setup.url + '?json=' + escape(stringify(setup.data));

    setTimeout( function() { body().appendChild(script) } , 1 )

/**
 * AJAX
 * ====
 *  ajax({
 *     url  : 'url',  // required
 *     type : 'text', // [script, json, text]
 *     data : {
 *         key : value,
 *         key : value
 *     },
 *     success : function(response) {
 *         // your code here
 *     },
 *     fail : function() {
 *         // your code here
 *     }
 * });
 */
},  ajax = function( setup ) {
    var xhr = window.ActiveXObject ?
              new ActiveXObject("Microsoft.XMLHTTP") :
              new XMLHttpRequest()
    ,   rsc = function() {
            if (  // complete?
                xhr &&
                xhr.readyState == 4 &&
                !done
            ) {
                done = 1;

                if (ival) {
                    clearInterval(ival);
                    ival = null;
                }

                // Invoke Success Or Failure
                if (
                    (xhr.status >= 200 && xhr.status < 300) ||
                    xhr.status == 304 || xhr.status == 1223
                ) setup.success && setup.success(xhr.responseText);
                else setup.error && setup.error(xhr.responseText);

                // Done with XHR
                xhr = null;
            }
        }
    ,   done = 0
    ,   ival = setInterval( rsc, 14 ); // polling method

    xhr.open( setup.type || 'get', setup.url );
    xhr.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
    );

    // Send
    xhr.send('?json=' + escape(stringify(setup.data)));
};

 
/* ~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`
============================ Your Code Starts Here ============================
~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~`~` */

/* The following line is a marker for automatic population */
/* INPUT-HERE */

})()
