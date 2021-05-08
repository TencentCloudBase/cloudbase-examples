# 使用官方 Golang 镜像作为构建环境
FROM golang:1.15-buster as builder

WORKDIR /app

# 安装依赖
COPY go.* ./
RUN go mod download

# 将代码文件写入镜像
COPY . ./

# 构建二进制文件
RUN go build -mod=readonly -v -o server

# 使用裁剪后的官方 Debian 镜像作为基础镜像
# https://hub.docker.com/_/debian
# https://docs.docker.com/develop/develop-images/multistage-build/#use-multi-stage-builds
FROM debian:buster-slim
RUN set -x && apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# 将构建好的二进制文件拷贝进镜像
COPY --from=builder /app/server /app/server

# 启动 Web 服务
CMD ["/app/server"]