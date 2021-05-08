FROM maven:3.3.3

ADD pom.xml /tmp/build/
RUN cd /tmp/build

ADD src /tmp/build/src
        #构建应用
RUN cd /tmp/build && mvn compile -X && mvn package \
        #拷贝编译结果到指定目录
        && mv target/*.jar /app.jar \
        #清理编译痕迹
        && cd / && rm -rf /tmp/build

EXPOSE 8270
ENTRYPOINT ["java","-jar","/app.jar"]