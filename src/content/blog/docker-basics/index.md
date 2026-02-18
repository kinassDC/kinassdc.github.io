---
title: "Docker 入门：容器化你的第一个应用"
pubDate: 2025-02-28
description: "Docker 已经成为现代应用部署的标准。本文从零开始，带你了解 Docker 的核心概念和实际应用。"
category: "技术"
tags: ["Docker", "容器化", "DevOps", "部署"]
---

## 什么是 Docker？

Docker 是一个开源的容器化平台，它可以将应用及其依赖打包到一个轻量级、可移植的容器中。

### 为什么使用 Docker？

- **环境一致性**：开发、测试、生产环境完全一致
- **快速部署**：秒级启动应用
- **资源隔离**：应用之间互不干扰
- **易于扩展**：可以快速创建和销毁容器

## 核心概念

### 镜像 (Image)

镜像是一个只读的模板，包含了运行应用所需的一切：

```
操作系统基础
    ↓
运行时环境 (Node.js, Python 等)
    ↓
应用代码
    ↓
依赖包
```

### 容器 (Container)

容器是镜像的运行实例，可以启动、停止、删除。

```
镜像 → 容器
类 → 实例
```

### Dockerfile

Dockerfile 是构建镜像的脚本：

```dockerfile
# 基础镜像
FROM node:18-alpine

# 工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]
```

## 常用命令

### 镜像操作

```bash
# 拉取镜像
docker pull nginx:latest

# 查看本地镜像
docker images

# 构建镜像
docker build -t myapp:1.0 .

# 删除镜像
docker rmi nginx:latest
```

### 容器操作

```bash
# 运行容器
docker run -d -p 8080:80 --name my-nginx nginx

# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 停止容器
docker stop my-nginx

# 启动容器
docker start my-nginx

# 删除容器
docker rm my-nginx

# 查看容器日志
docker logs my-nginx

# 进入容器
docker exec -it my-nginx sh
```

## 实战示例

### 1. 容器化一个 Node.js 应用

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

构建和运行：

```bash
# 构建镜像
docker build -t my-node-app .

# 运行容器
docker run -d -p 3000:3000 --name node-app my-node-app
```

### 2. 使用 Docker Compose 管理多容器应用

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 应用服务
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
    depends_on:
      - postgres
      - redis

  # PostgreSQL 数据库
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Redis 缓存
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
```

使用 Docker Compose：

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 停止所有服务
docker-compose down
```

### 3. 多阶段构建优化镜像大小

```dockerfile
# 构建阶段
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 运行阶段
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

## 最佳实践

### 1. 使用 .dockerignore

```dockerignore
# .dockerignore
node_modules
npm-debug.log
.env
.git
*.md
```

### 2. 最小化镜像层数

```dockerfile
# ❌ 不好 - 多层
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git

# ✅ 好 - 合并
RUN apt-get update && \
    apt-get install -y curl git && \
    rm -rf /var/lib/apt/lists/*
```

### 3. 使用 Alpine 镜像

Alpine Linux 是一个只有 5MB 的 Linux 发行版：

```dockerfile
# 使用 alpine 版本减小镜像体积
FROM node:18-alpine  # ~120MB
# 而不是
FROM node:18         # ~900MB
```

### 4. 非 root 用户运行

```dockerfile
# 创建非 root 用户
FROM node:18-alpine

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

WORKDIR /app

...
```

## 常见问题

### 1. 容器无法访问宿主机服务

```bash
# 使用 host.docker.internal 代替 localhost
docker run -e DB_HOST=host.docker.internal myapp
```

### 2. 容器内时区问题

```dockerfile
# 设置时区
ENV TZ=Asia/Shanghai
RUN apk add --no-cache tzdata
```

### 3. 日志文件过大

```bash
# 限制容器日志大小
docker run --log-opt max-size=10m --log-opt max-file=3 myapp
```

## 总结

Docker 已经成为现代应用部署的标准工具。掌握 Docker 的核心概念和常用操作，将让你的开发和部署工作更加高效。

下一步可以学习：
- Docker 网络配置
- Docker 数据卷管理
- Docker Swarm 集群
- Kubernetes 容器编排
