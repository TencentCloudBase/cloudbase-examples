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

RUN source /etc/profile


RUN mkdir /app
ADD . /app/
ADD index.html /usr/local/nginx/html 
ADD index.php /usr/local/nginx/html 


EXPOSE 80 
EXPOSE 9000

#CMD ["/usr/sbin/init"]
CMD ["/app/run.sh"]
