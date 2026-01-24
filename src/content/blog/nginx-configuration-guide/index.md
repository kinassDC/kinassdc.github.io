---
title: "Nginx 配置完全指南：从目录结构到实战配置"
pubDate: 2026-01-24
description: "深入解析 Nginx 配置文件的目录结构，了解每个配置文件的作用，掌握 Nginx 的核心配置技巧。"
category: "技术"
tags: ["Nginx", "服务器", "Web服务器", "反向代理"]
---

## 前言

Nginx 作为目前最流行的 Web 服务器和反向代理服务器之一，以其高性能、低内存占用和丰富的功能特性而闻名。对于初学者来说，理解 Nginx 的配置结构是掌握它的第一步。

本文将带你全面了解 Nginx 配置目录的结构，以及每个配置文件的具体用途。

## Nginx 配置目录结构

通常情况下，Nginx 的配置文件位于 `/etc/nginx/` 或 `/usr/local/nginx/conf/` 目录下。当你进入这个目录时，会看到如下的文件结构：

```bash
conf.d/
fastcgi.conf
fastcgi_params
koi-utf
koi-win
mime.types
modules-available/
modules-enabled/
nginx.conf
proxy_params
scgi_params
sites-available/
sites-enabled/
snippets/
uwsgi_params
win-utf
```

## 核心配置文件详解

### 1. nginx.conf - 主配置文件

这是 Nginx 的**核心配置文件**，包含了全局配置、事件处理和 HTTP 基本设置。所有的配置从这里开始加载。

一个典型的 `nginx.conf` 结构如下：

```nginx
# 全局配置
user www-data;
worker_processes auto;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log;

# 事件模块
events {
    worker_connections 1024;
    use epoll;
}

# HTTP 模块
http {
    include /etc/nginx/mime.types;
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;

    # 全局设置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
}
```

**主要配置项说明：**

| 配置项 | 说明 |
|--------|------|
| `user` | 运行 Nginx 的用户 |
| `worker_processes` | 工作进程数，通常设置为 `auto` 或 CPU 核心数 |
| `worker_connections` | 每个工作进程的最大连接数 |
| `sendfile` | 开启高效文件传输 |
| `keepalive_timeout` | 长连接超时时间 |

### 2. mime.types - MIME 类型映射

定义了文件扩展名与 MIME 类型的映射关系。当 Nginx 返回静态文件时，会根据文件扩展名设置正确的 `Content-Type` 响应头。

```nginx
types {
    text/html                             html htm shtml;
    text/css                              css;
    text/xml                              xml;
    image/gif                             gif;
    image/jpeg                            jpeg jpg;
    image/png                             png;
    application/javascript                js;
    application/json                      json;
    # ... 更多类型
}
```

## 站点配置目录

### sites-available / sites-enabled

这是 Nginx 配置中最常用的目录结构，源自 Debian/Ubuntu 系列的 Nginx 打包方式：

- **sites-available/**：存放所有可用的站点配置文件
- **sites-enabled/**：存放已启用的站点配置（通常是软链接）

#### 创建一个新站点

1. 在 `sites-available` 中创建配置文件：

```bash
sudo nano /etc/nginx/sites-available/mywebsite
```

2. 添加站点配置：

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/mywebsite;
    index index.html index.htm index.php;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    }

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

3. 创建软链接启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/mywebsite /etc/nginx/sites-enabled/
```

4. 测试并重载配置：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## CGI 相关配置

### fastcgi.conf / fastcgi_params

用于配置 FastCGI 参数，主要用于处理 PHP 等 FastCGI 应用。

- **fastcgi_params**：基本的 FastCGI 参数
- **fastcgi.conf**：更完整的 FastCGI 配置（包含 SCRIPT_FILENAME）

**重要区别：** `fastcgi.conf` 包含了 `SCRIPT_FILENAME` 参数，而 `fastcgi_params` 没有。现代 PHP 配置建议使用 `fastcgi.conf`。

### scgi_params / uwsgi_params

- **scgi_params**：SCGI 协议参数配置
- **uwsgi_params**：uWSGI 协议参数配置（常用于 Python 应用）

这些配置文件定义了传递给后端应用服务器的环境变量和参数。

## 反向代理配置

### proxy_params

反向代理的通用参数配置文件。当你使用 Nginx 作为反向代理时，通常会包含这个文件：

```nginx
proxy_set_header Host $http_host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

#### 反向代理示例

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        include proxy_params;
        proxy_pass http://localhost:3000;
    }
}
```

## 模块管理

### modules-available / modules-enabled

用于管理动态加载的 Nginx 模块：

- **modules-available/**：可用的模块配置文件
- **modules-enabled/**：已启用的模块（软链接）

```bash
# 查看已加载的模块
nginx -V

# 启用模块
ln -s /etc/nginx/modules-available/mod-http-geoip.conf /etc/nginx/modules-enabled/
```

## 辅助目录

### conf.d/

用于存放额外的配置片段。在 `nginx.conf` 中通常有如下配置：

```nginx
include /etc/nginx/conf.d/*.conf;
```

所有以 `.conf` 结尾的文件都会被自动加载。适合存放通用的配置片段，如 SSL 配置、重定向规则等。

### snippets/

存放可重用的配置片段，避免重复编写相同代码。

#### 常用 snippet

**SSL 配置：**

```nginx
# snippets/ssl-params.conf
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
ssl_session_timeout 10m;
ssl_session_cache shared:SSL:10m;
```

**安全头部：**

```nginx
# snippets/security-headers.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

使用方式：

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include snippets/ssl-params.conf;
    include snippets/security-headers.conf;

    # ... 其他配置
}
```

## 字符编码映射文件

### koi-utf / koi-win / win-utf

这些文件定义了不同字符编码之间的映射关系：

- **koi-utf**：KOI8-R 到 UTF-8 的映射
- **koi-win**：KOI8-R 到 Windows-1251 的映射
- **win-utf**：Windows-1251 到 UTF-8 的映射

主要用于处理西里尔字母编码，对于中文场景使用较少。

## 实战配置示例

### HTTPS 强制跳转

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include snippets/ssl-params.conf;

    # ... 其他配置
}
```

### 负载均衡配置

```nginx
upstream backend {
    server backend1.example.com weight=3;
    server backend2.example.com;
    server backend3.example.com backup;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://backend;
        include proxy_params;
    }
}
```

### 静态文件服务

```nginx
server {
    listen 80;
    server_name static.example.com;

    root /var/www/static;

    # 开启 sendfile
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
}
```

## 常用管理命令

```bash
# 检查配置文件语法
sudo nginx -t

# 重载配置（不中断服务）
sudo systemctl reload nginx

# 重启服务
sudo systemctl restart nginx

# 启动/停止/状态
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl status nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log
```

## 总结

Nginx 的配置结构清晰合理，通过合理的目录组织，让配置管理变得井井有条。理解这些配置文件的作用，能帮助你更好地管理和维护 Nginx 服务器。

**关键要点回顾：**

| 文件/目录 | 用途 |
|-----------|------|
| `nginx.conf` | 主配置文件 |
| `sites-available/` | 可用站点配置 |
| `sites-enabled/` | 已启用站点（软链接） |
| `conf.d/` | 额外配置片段 |
| `snippets/` | 可重用配置片段 |
| `mime.types` | MIME 类型映射 |
| `fastcgi.conf` | FastCGI 参数 |
| `proxy_params` | 反向代理参数 |

掌握 Nginx 配置，是每个后端工程师和运维人员的必备技能。希望这篇文章能帮助你更好地理解和使用 Nginx！

---

> **参考资料**
> - [Nginx 官方文档](http://nginx.org/en/docs/)
> - [Nginx 配置示例](https://www.nginx.com/resources/wiki/start/)