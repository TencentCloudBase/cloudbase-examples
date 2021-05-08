FROM java:8
ADD target/*.jar /app.jar
# 暴露端口
EXPOSE 8215
ENTRYPOINT ["java","-jar","/app.jar"]
