# Txing 编程在线学习管理后台
## 项目简介
本项目旨在为编程爱好者和开发者提供一个高效、便捷的在线学习平台，该平台为集在线做题、编程竞赛、即时通讯、文章创作、视频教程、技术论坛为一体的综合平台，一站式地满足用户的各种编程学习需求，而无需在多个平台间来回切换学习。

系统分为客户端以及后台管理端两部分，两部分均采用前后端分离的架构。在前端中，主要使用 Vue3、TypeScript、CSS 等主流技术进行开发，在后端中，主要使用 SpringBoot、Mybatis-Plus 以及 Redis、Rabbitmq 等中间件以及 ElasticSearch 搜索引擎等技术进行开发。此外，代码沙箱基于 Docker、Shell 等技术进行实现。

该仓库是本项目的管理后台前端部分，基于 [GitHub - yangzongzhuan/RuoYi-Vue3 开源管理系统](https://github.com/yangzongzhuan/RuoYi-Vue3) 进行二次开发。

## 代码仓库
| 名称 | 仓库地址 |
| :---: | :---: |
| 客户端前端 | [GitHub - lemon-puls/txing-oj](https://github.com/lemon-puls/txing-oj) |
| 客户端后端（包含代码沙箱） | [GitHub - lemon-puls/txing-oj-backend](https://github.com/lemon-puls/txing-oj-backend?tab=readme-ov-file) |
| 管理后台前端 （✔） | [GitHub - lemon-puls/txing-admin-vue3](https://github.com/lemon-puls/txing-admin-vue3) |
| 管理后台后端 | [GitHub - lemon-puls/txing-admin-backend](https://github.com/lemon-puls/txing-admin-backend) |
| 代码沙箱（单独） | [GitHub - lemon-puls/tx-code-sandbox](https://github.com/lemon-puls/tx-code-sandbox) |


## 效果展示
在管理后台中，可对客户端各个模块进行管理，这里由于篇幅问题，仅以周赛和文章模块进行展示说明，可查看每场周赛的详细内容以及手动生成周赛，可对用户发表的文章进行阅览、审核、导出、分页查询等管理工作中常用的操作。

![](https://cdn.nlark.com/yuque/0/2025/png/29312866/1736061895732-e1dc42e0-beae-4f7d-ae66-d47129050c4a.png)

![](https://cdn.nlark.com/yuque/0/2025/png/29312866/1736061778325-6bc313ce-448c-4330-9d43-dd694327495e.png)

此外，在“系统管理”菜单下，可对系统用户、角色、菜单、岗位、部门等进行管理，提供完备的系统管理功能。

![](https://cdn.nlark.com/yuque/0/2025/png/29312866/1736061778244-96e77e0a-3489-4ada-8cb1-7c30bf713910.png)

## 系统设计
### 后台用户与权限管理设计
在后台管理平台中，可对系统用户、角色、菜单、部门、岗位等进行管理，超级管理员可以创建菜单，在创建菜单时指定菜单的组件路径、访问路由、权限字符等信息，会为菜单自动生成路由信息，当用户打开该菜单时，就会显示其组件路径对应组件的内容，在很大程度上提高菜单管理的效率。此外，在创建角色时，可以为角色选定可以访问的菜单，系统会把该角色与其可访问的菜单的关联关系保存至数据库中的角色菜单关联表中，这样属于该角色的用户在登录系统时，会从数据库中查出该用户可访问的菜单，进而只为其显示可访问的菜单。

此外，在后端也会精细地为每个接口配置上权限标识符，在用户请求接口时会检查该用户是否拥有该接口（菜单）的访问权限，如果没有，就会进行拦截，有效率避免一些非法用户绕过前端直接访问其无权限访问的菜单，提供系统的安全性。

### 平台管理设计
在后台管理系统中提供对客户端各个模块的管理，包括文章、用户、论坛、课程、竞赛、题目、聊天等多个模块，在功能的提供上，包括了分页查询记录、根据关键字或者其他主要字段进行查询记录、导出记录、添加记录、删除记录、修改记录、阅览、审批记录等常规管理操作。

对于文章模块、课程模块、论坛模块，提供了对用户作品的审核的功能，可以阅览用户的作品，然后录入审核结果以及备注信息，只有通过审核的作品，才能够在客户端被其他用户在检索页检索出来，否则只能作者本人自己查看，严格的审核机制，保证本编程学习平台的内容质量。

对于竞赛模块，除了可以查看周赛记录以及用户的PK记录外，还可以生成下场周赛信息。不过对于周赛信息的生成，在后端中使用定时器自动生成的方式，无特殊情况无需人工干预。

对于聊天模块，可以对群聊或者私聊房间进行封禁与启用，封禁的聊天房间内无法发送消息。

对于用户管理，可对用户进行封禁与启用，封禁后用户无法登录系统。

## 项目运行
### 本地运行
#### 填写配置
把项目根目录下的 .env.<环境 tag>.sample 重命名或复制为 .env.<环境 tag>，然后填写其中的配置，这里一共有三套配置，根据运行环境选用对应的配置。其中腾讯云云点播 VOD 需要先到腾讯云开通，费用方面一般按用量付费即可，只是学习使用的话，花不了多少钱。具体操作步骤可以查看腾讯云的相关文档。

#### 安装依赖
```bash
npm install
```

#### 运行
```bash
npm run dev
```

### 项目部署
前端项目部署的方式有很多，本人使用 nginx 进行部署，在这里给出部署的步骤。

#### 填写配置和安装依赖
和 【本地运行】 一样，这里不赘述。

#### 项目打包
运行该命令进行打包，打包完会在项目根目录下生成 dist 文件夹。

```bash
npm run build:prod
```

#### 上传至 nginx
提前在服务器上安装好 nginx，并且在 nginx 的 html 目录下创建 admin 目录，将 dist 文件夹下的所有内容上传至 admin 目录下。

#### 添加 nginx 配置
在 nginx 的配置文件 nginx.conf 的 http 节点下添加以下配置，注意这里给出的是最基本的配置，需要更多配置可以查看相关文档进行配置。

```bash
server {
    listen       88;
    listen  [::]:88;
    server_name  localhost;

     # 请求后端接口，转发到真实的后端地址
     location /prod-api/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            # 注意修改为实际的后端地址
            proxy_pass http://localhost:8080/;
      }

    location / {
        # 注意替换为自己实际的地址
        root   /usr/share/nginx/html/admin/;
        index  index.html index.htm;
    }
}
```

#### 重启 nginx
重启 nginx 使配置生效。

#### 访问测试
可以尝试访问 88 端口确认是否正常响应，要正常使用注意要把后端也部署了。

默认超管账号

用户名：admin

密   码：admin123



#### 
