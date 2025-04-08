# 使用 Node.js 构建阶段，版本为 18.20.1
FROM node:18.20.1 as build-stage

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 先复制依赖文件，利用缓存
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 复制项目源代码
COPY . .

# 构建前端项目
RUN pnpm run build:prod && ls -alh dist

# 使用 Nginx 运行打包后的应用
FROM nginx:1.24.0 as production-stage

# 设置时区为上海
ENV TZ=Asia/Shanghai

# 复制构建结果到 nginx 静态目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 覆盖默认的 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
