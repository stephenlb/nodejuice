var rad = exports.rad = function( req, res ) {
    var therad = function( rxurl, text ) {
        if (therad.ran) return;

        if (rxurl.test(req.uri.full)) {
            if (typeof text === 'string') {
                therad.ran = true;
                return res.attack( text, 200 ) || true;
            }
            else if (typeof text === 'object') {
                therad.ran = true;
                return res.impress( text.file, text ) || true;
            }
        }

        return false;
    };

    therad.request  = req;
    therad.response = res;

    return therad;
};
