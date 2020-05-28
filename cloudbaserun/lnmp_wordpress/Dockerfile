FROM centos:7
MAINTAINER cloudbaserun
ENV TIME_ZOME Asia/Shanghai

ENV DATA_DIR /var/lib/mysql

RUN yum -y install gcc gcc-c++ make openssl-devel pcre-devel
ADD nginx-1.12.1.tar.gz /tmp

RUN cd /tmp/nginx-1.12.1 && \
        ./configure --prefix=/usr/local/nginx && \
        make -j 2 && \
        make install

RUN rm -rf /tmp/nginx* && yum clean all && \
        echo "${TIME_ZOME}" > /etc/timezone && \
        ln -sf /usr/share/zoneinfo/${TIME_ZOME} /etc/localtime

COPY nginx.conf /usr/local/nginx/conf/

RUN yum install -y gcc gcc-c++ make gd-devel libxml2-devel libcurl-devel libjpeg-devel libpng-devel openssl-devel
ADD php-5.6.31.tar.gz /tmp/
RUN cd /tmp/php-5.6.31 && \
        ./configure --prefix=/usr/local/php \
        --with-config-file-path=/usr/local/php/etc \
        --with-mysql --with-mysqli \
        --with-openssl --with-zlib --with-curl --with-gd \
        --with-jpeg-dir --with-png-dir --with-iconv \
        --enable-fpm --enable-zip --enable-mbstring && \
        make -j 4 && \
        make install

RUN cp /usr/local/php/etc/php-fpm.conf.default /usr/local/php/etc/php-fpm.conf && \
        sed -i 's/127.0.0.1/0.0.0.0/g' /usr/local/php/etc/php-fpm.conf && \
        sed -i "21a daemonize=no" /usr/local/php/etc/php-fpm.conf && \
        echo "${TIME_ZOME}" > /etc/timezone && \
        ln -sf /usr/share/zoneinfo/${TIME_ZOME} /etc/localtime

COPY mysql-5.6.29.tar.gz /usr/src/
RUN yum -y install gcc gcc-c++ make automake cmake
RUN groupadd mysql; useradd -r -M -u 39 -s /sbin/nologin -g mysql mysql
RUN mkdir /usr/local/mysql; mkdir /data/mysql/db -p
RUN yum install gcc gcc-c++ ncurses-devel bison bison-devel -y
RUN tar zxf /usr/src/mysql-5.6.29.tar.gz -C /usr/src/
WORKDIR /usr/src/mysql-5.6.29
RUN cmake . -DCMAKE_INSTALL_PREFIX=/usr/local/mysql -DMYSQL_DATADIR=/data/mysql/db -DSYSCONFDIR=/etc -DMYSQL_TCP_PORT=3306 -DMYSQL_UNIX_ADDR=/var/lib/mysql/mysql.sock -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_MYISAM_STORAGE_ENGINE=1 -DENABLED_LOCAL_INFILE=1 -DWITH_PARTITION_STORAGE_ENGINE=1 -DDEFAULT_CHARSET=utf8 -DEXTRA_CHARSETS=all -DDEFAULT_COLLATION=utf8_general_ci -DWITH-MYSQLD-LDFLAGS=-all-static -DWITH-CLIENT-LD-FLAGS=-all-static -DWITH_DEBUG=0 && gmake && gmake install
RUN chown -R root:mysql /usr/local/mysql/ && chown -R mysql:mysql /data/mysql/db/
RUN chmod 775 /usr/src/mysql-5.6.29/scripts/mysql_install_db.sh
RUN /usr/src/mysql-5.6.29/scripts/mysql_install_db.sh --basedir=/usr/local/mysql --datadir=/data/mysql/db --no-defaults --user=mysql
RUN cp /usr/src/mysql-5.6.29/support-files/my-default.cnf /etc/my.cnf
RUN cp /usr/src/mysql-5.6.29/support-files/mysql.server /etc/init.d/mysqld
RUN chmod -R 775 /etc/init.d/mysqld && /etc/init.d/mysqld start
RUN echo -e '#!/bin/bash\nexport PATH=$PATH:/usr/local/mysql/bin' >/etc/profile.d/mysql.sh
RUN source /etc/profile


RUN mkdir /app
ADD . /app/
ADD index.html /usr/local/nginx/html 
ADD index.php /usr/local/nginx/html 
COPY wordpress-4.7.4-zh_CN.tar.gz /app/
RUN tar -zxvf /app/wordpress-4.7.4-zh_CN.tar.gz -C /usr/local/nginx/html


EXPOSE 80 
EXPOSE 9000
EXPOSE 3306

#CMD ["/usr/sbin/init"]
CMD ["/app/run.sh"]
