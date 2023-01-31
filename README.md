# Ts-Gateway 基础网关

本网关基于 [TypeScript](https://www.typescriptlang.org/zh/) + [fast-gateway](https://www.npmjs.com/package/fast-gateway)

## 使用

根据环境区分使用方式

### 本地开发

```shell
npm run dev
```

### 生产环境

生产环境请使用 Docker 镜像

### 证书

- 本仓库默认使用 Http2，开启 SNI 服务。

- 证书均使用 Apache 证书格式

- 证书命名, 不可变更：

  - server.crt
  - server.key
  - ca.crt

- 默认证书放置于 keys 目录下，生产环境建议通过 Volumes 映射。需包含

  - ca.crt
  - server.crt
  - server.key

- 如需对指定域名使用指定证书（SNI），在 keys 目录下新建域名名称的文件夹，并放入指定证书即可

  `例如:` 对`wvp.test.com`使用指定证书的`keys`目录结构：

  ```shell
  |-- keys/
    |-- ca.crt
    |-- server.crt
    |-- server.key
    |-- wvp.test.com/
      |-- ca.crt
      |-- server.crt
      |-- server.key
  ```

### 服务注册

复制`routes.example.json`到根目录，并改名`routes.json`，根据样例修改对应参数即可

如有`JSON`无法满足的高级需求，参考[https://fgw.21no.de/](https://fgw.21no.de/)对`config/index.ts`下对应属性修改
