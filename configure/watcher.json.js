{
    'watch'   : '/opt/nodejuice/templates',
    'host'    : null,
    'port'    : 8002,
    'restart' : {
        'on' : [ '.php', '.conf' ],
        'in' : [ 'lib', 'public', 'config' ],
        'by' : '/etc/init.d/apache2 stop && /etc/init.d/apache2 start'
    }
}
