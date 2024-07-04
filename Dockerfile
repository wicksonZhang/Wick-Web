# 维护者信息
MAINTAINER Wickson <wickson_zhang@163.com>

# 将当前工作目录设置为/app
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到 /app 目录下
COPY package*.json ./

# 运行 npm install 安装依赖
RUN npm config set registry https://registry.npmmirror.com
RUN npm install pnpm -g
RUN pnpm install

# 将源代码复制到 /app 目录下
COPY . .

# 打包构建
RUN pnpm run build:dev

# 将构建后的代码复制到 nginx 镜像中
FROM nginx:1.24.0
COPY --from=0 /app/dist /docker/wick-web

# 暴露 80 端口
EXPOSE 80

# 启动 nginx 服务
CMD ["nginx", "-g", "daemon off;"]
