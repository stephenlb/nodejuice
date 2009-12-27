exports.watcher = {
    'watch'   : '/opt/nodejuice',
    'ignore'  : [ '.git$', '.svn$', '.cvs$', '.swp$' ],
    'host'    : null,
    'port'    : 8002,
    'restart' : {
        'on' : [ '.js' ],
        'in' : [ 'library', 'servers', 'configure' ],
        'by' : 'killall node && ./nodejuice'
    }
    /* Apache Restart Example
    'restart' : {
        'on' : [ '.php', '.conf' ],
        'in' : [ 'lib', 'public', 'config' ],
        'by' : '/etc/init.d/apache2 stop && /etc/init.d/apache2 start'
    }
    */
};
