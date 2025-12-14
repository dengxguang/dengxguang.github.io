#### 1. 查看git代理配置

``` bash
  git config --global http.proxy
  git config --global https.proxy
```

这将显示设置的HTTP和HTTPS代理。如果没有设置代理，命令将不会返回任何输出。

#### 2.设置和取消代理
``` bash
// 设置
git config --global https.proxy http://127.0.0.1:1080
git config --global https.proxy https://127.0.0.1:1080

// 取消
git config --global --unset http.proxy
git config --global --unset https.proxy

```

#### 3. 查看所有全局配置

``` bash
git config --global --list
```


#### 4. Q & A

##### Q1. github 开了代理仍然无法推送/拉取代码

> 1. 检查代理的对端口
> 2. 设置git代理为对外端口，例如端口为9090
>   ``` bash
    git config --global https.proxy https://127.0.0.1:9090
  ```