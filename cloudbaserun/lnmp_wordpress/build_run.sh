sudo docker build -t nginx_mysql:1.12.1 .
sudo docker run -p 80:80 -d nginx_mysql:1.12.1

