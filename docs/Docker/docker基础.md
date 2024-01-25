## docker 基础

### 什么是docker
docker 是一个容器技术，它将应用和依赖的代码和数据打包成一个可执行的单元，然后在容器中运行。

简单一句话理解就是一个应用打包、分发、部署的工具，可以把它理解为一个轻量的虚拟机，但是是以容器的方式运行的。

主要用来解决软件跨环境迁移的问题。

### docker 基本概念（三要素）

#### 镜像 image

**docker镜像**是一个特殊的文件系统，除了提供容器运行所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的配置文件和元数据（如匿名卷、环境变量、用户等）。镜像 **不包含** 任何动态数据，其内容在构建之后也不会被改变。

#### 容器 container

镜像 和 容器 的关系，就像面向对象程序设计中的 类 和 实例 一样，镜像是静态定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。

简单理解就是 容器 是镜像的一个运行时实例。当我们运行一个镜像，就创建了一个容器。

#### 仓库 repository

镜像构建完成后，可以很容易在当前宿主机上运行，但是，如果需要在其他服务器上使用这个镜像，我们需要一个集中存储、分发镜像的服务，**Docker Repository** 就是这样的服务。

> 小结：
获取镜像的方式可以通过 **Dockerfile** 文件创建，也可以通过 **dockerHub** 仓库下载
Docker 中镜像和容器的关系就像 类 与 实例 的关系
镜像可以通过 **Dockerfile** 文件来生成，容器通过镜像来创建

### docker 安装
### 使用镜像
  - 拉取镜像
  在 **Docker Hub**上有大量的高质量的镜像可以使用，可以通过 docker pull 来拉取对应的镜像。拉取镜像的命令：
    ```shell
      docker pull [选项] [docker Registry 地址[:端口号]/]仓库名[:标签]
    ```
  1. Docker镜像仓库地址：地址格式一般是 **<域名/IP>[:端口号]**，如果用户名为空，那么默认为 **docker.io**。
  2. 仓库名：仓库名是两段式名称，即**<用户名>/<软件名>**。对于Docker Hub，如果不给出用户名，则默认 **library**，也即是官方镜像。
   
  例如拉取一个node镜像：
    ``` shell
    docker pull node:18-alpine
    ```
这里我们拉取的镜像的时候只给出了镜像名称（仓库名+标签）也就是 **node:18-alpine**（**node** 是仓库名， **18-alpine** 是标签。**），并没有给出镜像的仓库地址，所以默认为 **docker.io**。

  - 查看镜像
    ```shell
    docker image ls
    ```
  - 删除镜像
    ```shell 
    docker image rm [选项] <镜像1> [<镜像2>...]
    ```
  其中 **<镜像>** 可以是镜像短ID、镜像长ID、镜像名称或者镜像摘要。


如果想批量删除镜像可以使用 **docker image ls -q** 来配合使用 **docker image rm**

比如，我们需要删除所有仓库名为 redis 的镜像：
  ``` shell
  docker image rm $(docker image ls -q redis)
  ```
或者删除所有在 **mongo:3.2** 之前的镜像：

  ``` shell 
  docker image rm $(docker image ls -q -f before=mongo:3.2)
  ```


### 操作容器
#### 查看容器
- 查看正在运行的容器
  ``` shell 
  docker ps
  ```
- 查看所有容器
  ``` shell 
  docker ps -a
  ```

#### 启动容器
  启动容器一般有两种情况：
    - 基于镜像新建一个容器并启动
    - 将已有的终止状态（exited）的容器重新启动
  命令格式：**docker run [选项] <镜像> [命令] [参数]**

  1. 新建并启动
   
  ``` shell 
  docker run -it node
  ```

参数说明：
  - **-i**：交互式操作
  - **-t**：终端
  - **node**：node镜像

  2. 启动终止状态的容器
     1. 首先查看所有的容器
     2. 使用docker start 启动一个停止的容器
   
      ``` shell 
        docker ps -a
        docker start <容器ID>
      ```

      重启容器
        ``` shell 
          docker restart <容器ID>
        ```
#### 后台运行
  大多数情况下，我们希望 docker 是在后台运行的，这里可以通过 **-d** 指定容器的运行模式。

  ``` shell
  docker run -d node:latest
  ```

#### 停止容器
  ``` shell
    docker stop <容器 id>
  ```

#### 进入容器
  当我们使用 **-d** 参数时，容器启动会进入后台，此时想要进入容器可以通过以下指令：
  1. exec (推荐使用)：因为退出容器，容器不会停止。
      ``` shell 
      docker exec -it <容器ID> /bin/bash
      ```
  2. attach（不推荐）：因为退出容器，容器会停止。
      ``` shell 
      docker attach <容器ID>
      ```

#### 删除容器
删除容器可以使用 **docker rm** 命令
``` shell
  docker rm <容器ID>
```

如果想要删除所有终止状态的容器可以使用以下指令

``` shell 
  docker container prune
```

### Dockerfile 文件
Dockerfile是一个由一系列命令和参数构成的脚本，这些命令应用于基础镜像并创建一个新的镜像。常见的Dockerfile命令有：

FROM：设定基础镜像。所有的Dockerfile都需要从FROM指令开始。格式为 FROM <image>[:<tag>]。
LABEL：为镜像添加元数据。比如版本号，描述等。格式为 LABEL <key>=<value> <key>=<value> ...。
RUN：执行任何被基础镜像支持的命令。格式为 RUN <command>。
CMD：设置容器启动后默认执行的命令和参数。Dockerfile中可以有多个CMD命令，但是只有最后一个会被执行。格式为 CMD ["executable","param1","param2"]（推荐方式）。
ENTRYPOINT：为容器设置默认的可执行程序，一般至多只有一个ENTRYPOINT。格式为 ENTRYPOINT ["executable", "param1", "param2"]（推荐方式）。
EXPOSE：声明容器运行的服务会监听某个端口。格式为 EXPOSE <port> [<port>/<protocol>...]。
ENV：设定环境变量。格式为 ENV <key>=<value> ...。
ADD：将本地的文件、目录或者远程的文件URL添加到镜像中。ADD指令会自动解压压缩文件。格式为 ADD <src>... <dest>。
COPY：将从构建上下文目录中 <src> 的文件/目录复制到新的一层的镜像内的 <dest> 位置。
VOLUME：创建一个可以从本地主机或其他容器挂载的挂载点，一般用来存储数据库、日志等动态数据。格式为 VOLUME ["/data"]。
WORKDIR：设定运行CMD、RUN、ENTRYPOINT、COPY和ADD命令的工作目录。格式为 WORKDIR /path/to/workdir。
USER：设定运行容器时的UID或者用户名。格式为 USER daemon。
ARG：定义一个变量，用户可以在构建命令 docker build 中使用 --build-arg <varname>=<value> 来覆盖。
ONBUILD：当build一个被基于FROM指令指定的镜像时，会执行ONBUILD后面跟的指令。格式为 ONBUILD [INSTRUCTION]。

### 部署一个前端项目

#### 编写 Dockerfile 文件
在一个项目中我们其实不需要手动去创建Dockerfile文件和compose文件，可以执行docker init自动生成，稍做修改就可使用。

#### 打包镜像
#### 启动容器


### 常用命令
``` shell
docker --help # 帮助信息
docker -v # 查看docker版本
docker info # docker 信息

# 构建镜像
# docker build -t IMAGE_NAME:TAG PATH_TO_DOCKERFILE
# 利用当前目录下的Dockefile去构建一个叫 weclome-to-docker的镜像(默认情况下tag为：latest)
docker build -t welcome-to-docker . 
# 多了:xx 构建镜像的同时指定tag(同一个镜像名可有多个tag)
docker build -t welcome-to-docker:20230910 .
# docker save -o my-image.tar my-image:tag
# 将镜像welcome-to-docker打包成welcome-to-docker.tar
docker save -o welcome-to-docker.tar welcome-to-docker

docker load < my-image.tar.gz # 从文件中加载docker镜像

docker images # 查看有哪些镜像
# 删除镜像 weclcome-to-docker tag名为20230910
docker rmi welcome-to-docker:20230910 

# docker run --name my-container my-image # 通过镜像 创建容器
# 指定容器名my_container 
# 端口映射 4000（外部）- 3000（容器内） 
# -d 后台运行
# weclcome-to-docker-镜像名
# lastest- tag号
docker run --name my_container -p 4000:3000 -d weclcome-to-docker:latest

docker ps -a  # 查看有哪些容器
docker exec -it kb-ent-api(container name) /bin/bash # 进入容器内部

docker stop container_name # 优雅关闭容器(推荐使用，使用后在rm删除容器)
docker kill container_name # 强制关闭
dokcer rm container_name   # 强力删除（这个命令 不能直接用于running状态的容器，除了关闭容器，还会删除相关文件系统、网络、卷等）

docker start container_name   # 用于容器已经死了 或退出
docker restart container_name # 容器还活着

docker inspect <container_name_or_id> #查看容器信息，非常详细
# 格式化输出容器信息 这里代码查看ip信息
docker inspect --format='{{.NetworkSettings.IPAddress}}' <container_name_or_id>

# 日志
docker logs kb-ent-api       # 查看容器运行情况（制定容器日志）
docker logs --stderr web-app # 查看日志标准错误
docker logs -f web-app       # 动态查看日志

# 在容器内创建备份文件
docker exec -it my_postgres_container pg_dump -U postgres -W -F t my_database > my_database_backup.tar

# 将备份文件从容器复制到宿主机
docker cp my_postgres_container:/path/to/backup/in/container/my_database_backup.tar /path/to/backup/on/host/


# compose
docker compose up -d # 开启容器组
docker compose down  # 关闭容器组
docker compose ps    # 查看容器组
docker compose logs  # 查看容器组日志
docker compose exec CONTAINER_NAME COMMAND # 容器内部执行命令

```

### compose多容器
#### 认识compose.yaml文件
#### 启动compose
#### 关闭compose