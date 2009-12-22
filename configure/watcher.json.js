{
    'restart' : {
        'on' : [ '.php', '.conf' ],
        'in' : [ 'lib', 'public', 'config' ],
        'by' : '/etc/init.d/apache2 stop && /etc/init.d/apache2 start'
    },
    'watch'   : '/home/trop/trop',
    'host'    : null,
    'port'    : 8002
}
