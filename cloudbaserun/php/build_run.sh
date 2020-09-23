sudo docker build -t php-fpm:1.0.0 .
sudo docker run -p 80:80 -d php-fpm:1.0.0

