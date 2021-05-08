FROM frolvlad/alpine-oraclejdk8:slim
VOLUME /data
ADD app.jar app.jar
#RUN bash -c 'touch /app.jar'
ENTRYPOINT ["java","-Djava.securtiy.egd=file:/dev/./urandom","-jar","app.jar"]
EXPOSE 8280