var rad = exports.rad = function( req, res ) {
    var therad = function( rxurl, text ) {
        if (rxurl.test(req.uri.full)) {
            therad.ran = true;
            return res.attack( text, 200 )
        }
    };

    therad.request  = req;
    therad.response = res;

    return therad;
};
