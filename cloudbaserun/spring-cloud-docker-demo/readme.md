## SpringCloud + Docker 自动构建微服务容器 Demo


- 使用spring cloud 搭建demo,包含一个注册中心、一个配置中心、一个服务提供者、一个服务调用者
- 使用com.spotify:docker-maven-plugin 插件，package 时自动构建DockerImage,并推送到指定的Docker仓库
- 使用docker-compose 编排容器，一键启动所有容器；使用wait-for脚本，支持按顺序启动容器（启动完成后启动下一个容器），解决容器启动依赖问题

### 模块介绍 

- eureka-server 微服务注册中心
- config-server 微服务配置中心
- hello-service hello服务提供者 （启动依赖配置中心）
- hello-client hello服务调用者 
- docker  存放docker-compose.yml配置文件

### 容器启动顺序

1. eureka-server 
2. config-server 和 hello-service （互不影响）
3. hello-client
