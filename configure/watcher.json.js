{
    'watch'   : '/opt/nodejuice/templates',
    'ignore'  : [ '.git', '.svn', '.cvs' ],
    'host'    : null,
    'port'    : 8002,
    'restart' : {
        'on' : [ '.js' ],
        'in' : [ 'library', 'servers', 'configure' ],
        'by' : 'killall node && ./nodejuice'
    }
    /* Apache Restart
    'restart' : {
        'on' : [ '.php', '.conf' ],
        'in' : [ 'lib', 'public', 'config' ],
        'by' : '/etc/init.d/apache2 stop && /etc/init.d/apache2 start'
    }
    */
}
