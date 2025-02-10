## mac M1下 安装运行 nginx

### 下载、安装、启动/停止/重启Nginx

#### 安装Homebrew

#### 安装Nginx

``` bash
  brew install nginx
```

- **默认安装目录**：/opt/homebrew/Cellar/Nginx/
- **配置文件目录**：/opt/homebrew/etc/nginx/

#### 启动Nginx
``` bash
  nginx
```

#### 停止Nginx
``` bash
  nginx -s stop
```

#### 重启Nginx
``` bash
  nginx -s reload
```
#### 检查Nginx配置是否正确
``` bash
  nginx -t
```

### 配置Nginx

#### 反向代理
```bash
http {
  # .............    
  upstream product_server {  
    127.0.0.1:8081;  
  }
  upstream admin_server { 
    127.0.0.1:8082;
  }    
  upstream test_server {
    127.0.0.1:8083;
  }
  server {  
    #默认指向product的server  
    location / {
      proxy_pass http://product_server;
    }  
    location /product/{
      proxy_pass http://product_server;
    }  
    location /admin/ {
      proxy_pass http://admin_server;
    }  
    location /test/ {
      proxy_pass http://test_server;
    }
  }
}
```

#### 重定向
``` bash
location / { 
  return 404; #直接返回状态码
}
location / {
  return 404 "pages not found"; #返回状态码 + 一段文本
}
location / { 
  return 302 /blog ; #返回状态码 + 重定向地址
}
location / { 
  return https://www.mingongge.com ; #返回重定向地址
}

server { 
  listen 80;
  server_name www.mingongge.com;
  return 301 http://mingongge.com$request_uri;
}
  
server {
  listen 80; 
  server_name www.mingongge.com; 
  location /cn-url {
    return 301 http://mingongge.com.cn;
  }
}

server{  
  listen 80;  
  server_name mingongge.com; # 要在本地hosts文件进行配置  
  root html;  
  location /search {
    rewrite ^/(.*) https://www.mingongge.com redirect;
  }
  location /images {
    rewrite /images/(.*) /pics/$1;
  }
  location /pics {
    rewrite /pics/(.*) /photos/$1; 
  }
  location /photos {}
}
```

#### 负载均衡配置
``` bash
upstream server_pools {
  #weigth参数表示权值，权值越高被分配到的几率越大
  server 192.168.1.11:8880   weight=5;  
  server 192.168.1.12:9990   weight=1;  
  server 192.168.1.13:8989   weight=6; 
}
server {    
  listen 80;   
  server_name mingongge.com;  
  location / {      
    proxy_pass http://server_pools; 
  }
}
```

#### 设置缓冲区容量上限
```bash 
#设置后，不管多少HTTP请求都不会使服务器系统的缓冲区溢出了
client_body_buffer_size 1k;
client_header_buffer_size 1k;
client_max_body_size 1k;
large_client_header_buffers 2 1k;

limit_conn_zone $binary_remote_addr zone=addr:5m;limit_conn addr 1;
```

#### gzip 压缩
```bash
gzip_types  #压缩的文件类型 text/plain text/css  application/json  application/x-javascript  text/xml application/xml  application/xml+rss  text/javascript
gzip on; #采用gzip压缩的形式发送数据
gzip_disable "msie6" #为指定的客户端禁用gzip功能
gzip_static; #压缩前查找是否有预先gzip处理过的资源
gzip_proxied any; #允许或者禁止压缩基于请求和响应的响应流
gzip_min_length  1000; #设置对数据启用压缩的最少字节数
gzip_comp_level 6; #设置数据的压缩等级
```

#### 缓存
```bash
open_file_cache #指定缓存最大数目以及缓存的时间
open_file_cache_valid #在open_file_cache中指定检测正确信息的间隔时间
open_file_cache_min_uses   #定义了open_file_cache中指令参数不活动时间期间里最小的文件数
open_file_cache_errors     #指定了当搜索一个文件时是否缓存错误信息
#指定缓存文件的类型
location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$ {   
  expires 3650d; #指定缓存时间
}
location ~ .*\.(js|css)?$ {
  expires 3d;
}
```

#### SSL 证书配及跳转HTTPS配置
```bash
server {
  listen 192.168.1.250:443 ssl;
  server_tokens off;
  server_name mingonggex.com www.mingonggex.com;
  root /var/www/mingonggex.com/public_html;
  ssl_certificate /etc/nginx/sites-enabled/certs/mingongge.crt;
  ssl_certificate_key /etc/nginx/sites-enabled/certs/mingongge.key;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
}
```

#### Permanent Redirect for HTTP to HTTPS
```bash
server {
  listen 80;
  server_name mingongge.com;
  https://$server_name$request_uri;
}
```

#### 限流功能
```bash
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;
server {
  location /login/ {
    limit_req zone=mylimit;
    proxy_pass http://my_upstream;
  }
}
```

#### 其他配置
```bash 
proxy_connect_timeout 90;  #nginx跟后端服务器连接超时时间(代理连接超时)
proxy_send_timeout 90;     #后端服务器数据回传时间(代理发送超时)
proxy_read_timeout 90;     #连接成功后,后端服务器响应时间(代理接收超时)
proxy_buffer_size 4k;      #代理服务器（nginx）保存用户头信息的缓冲区大小
proxy_buffers 4 32k;      #proxy_buffers缓冲区
proxy_busy_buffers_size 64k;     #高负荷下缓冲大小（proxy_buffers*2）
proxy_temp_file_write_size 64k;  #设定缓存文件夹大小
proxy_set_header Host $host; 
proxy_set_header X-Forwarder-For $remote_addr;  #获取客户端真实IP
```