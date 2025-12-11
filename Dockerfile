FROM ubuntu:latest
RUN apt-get update && apt-get install -y apache2
COPY . /var/www/html/
EXPOSE 80
CMD ["apachectl", "-D", "FOREGROUND"]