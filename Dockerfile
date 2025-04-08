# 使用 Node.js 构建阶段，版本为 18.20.1
FROM node:18.20.1 as build-stage

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 安装项目依赖
RUN pnpm install

# 复制项目的源代码
COPY . .

# 构建前端项目
RUN pnpm run build:prod

# 使用 Nginx 运行打包后的应用
FROM nginx:1.23.4 as production-stage

# 设置时区为上海
ENV TZ=Asia/Shanghai

# 将打包后的文件复制到 Nginx 的默认静态资源目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 覆盖默认的 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
