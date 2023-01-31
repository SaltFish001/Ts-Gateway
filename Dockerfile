# 分步骤打包
# 设置打包镜像
FROM node:18.12.0-alpine3.16 as builder
# 创建目录
RUN mkdir /tmp/project
# 复制文件
COPY . /tmp/project
WORKDIR /tmp/project/

# 安装环境
RUN npm install
# 打包
RUN npm run build 

RUN rm -rf node_modules && npm i --production 

# 设置运行源镜像
FROM node:18.12.0-alpine3.16 as runner

# 创建目录
RUN mkdir /project 

# 指定目录
WORKDIR /project/

# 复制文件
COPY --from=builder /tmp/project/ /project/

# 给wait-for文件操作权限
RUN chmod +x wait-for
# 暴露端口
EXPOSE 80
# 启动命令
# 增加对sourceMap的支持,更好的查看错误堆栈
CMD ["npm", "run", "start:production"]