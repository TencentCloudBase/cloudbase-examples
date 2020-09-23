#!/bin/bash
/etc/init.d/mysqld start

echo "hello world" && /usr/local/nginx/sbin/nginx  && /usr/local/php/sbin/php-fpm -c /usr/local/php/etc/php-fpm.conf
