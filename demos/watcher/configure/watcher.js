exports.watcher = {
    'ignore'  : [ 'git$', 'svn$', 'cvs$', 'swp$' ],
    'host'    : null,
    'port'    : 8002,
    'restart' : {
        'on' : [ '.js$' ],
        'in' : [ 'configure' ]
    }
    /* Apache Restart Example
    'restart' : {
        'on' : [ '.pl', '.conf', '.pm' ],
        'in' : [ 'lib', 'public', 'config' ],
        'by' : '/etc/init.d/apache2 stop && /etc/init.d/apache2 start'
    }
    */
};
