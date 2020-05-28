#!/bin/bash
/etc/init.d/mysqld start

echo "hello world" && /usr/local/mysql/bin/mysql -uroot -e "create user 'tcb'@'localhost' identified by 'tcb'" && \
     /usr/local/mysql/bin/mysql -uroot -e "create database wordpress" && /usr/local/mysql/bin/mysql -uroot -e "grant all privileges on wordpress.* to 'tcb'@'localhost' identified by 'tcb'" && /usr/local/nginx/sbin/nginx  && /usr/local/php/sbin/php-fpm -c /usr/local/php/etc/php-fpm.conf
