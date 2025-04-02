# 使用 Nginx 运行打包后的应用
FROM nginx:1.24.0

# 设置工作目录
WORKDIR /app

# 设置时区为上海
ENV TZ=Asia/Shanghai

# 将打包后的文件复制到 Nginx 的默认静态资源目录
COPY dist /usr/share/nginx/html

# 覆盖默认的 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 设置文件权限
RUN chown -R nginx:nginx /usr/share/nginx/html

# 验证 Nginx 配置
RUN nginx -t

# 暴露端口（文档用途）
EXPOSE 80
