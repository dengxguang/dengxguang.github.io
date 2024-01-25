### 1. electron 简要介绍
![](https://cdn.nlark.com/yuque/0/2022/jpeg/12794520/1659752517394-41d42b7a-462c-4a3b-ae4d-47a7dff835d7.jpeg)

- electron 由 nodejs、Chromium、Native APIs 构成。可以理解成一个得到了nodejs和基于不同平台native APIs加强的chromium浏览器。可以用来开发跨平台的桌面应用
- 它的开发主要涉及两个进程的协作-- Main(主)进程和Renderer(渲染)进程。两个进程的作用：
1. Main进程主要通过nodejs、chromium和native APIs 来实现一些系统以及底层操作，比如创建系统级别的菜单、操作剪贴板、创建app的窗口等。
2. Renderer进程主要通过chromium来实现APP的图形界面部分。一些node模块（比如fs）和一些在Main进程里的能用的东西（比如clipboard）也能在Renderer进程中使用。
3. Main进程和Renderer进程通过‘ipcMain’和‘ipcRenderer’来进行通信。通过事件监听和事件派发来实现两个进程通信，从而实现Main或Renderer进程不能实现的某些功能。
### 2. 优点

- 除了不同平台native APIs 不同外，nodejs 和 chromium都是跨平台的工具，这也是electron生来就能做跨平台的应用开发打下基础。
- 开发图像界面前所未有容易，比起C#\QT\MFC等传统图像界面开发技术，通过前端的图形化界面开发明显更加容易和方便。得益于chromium这种开发模式。
- 成熟的社区、活跃的核心团队，大部分electron相关问题都可以在社区、GitHub、issue、stack overflow中得到答案。
### 3. 缺点

- 应用体积过大。由于内部包装了nodejs和chromium，使得打包体积(使用electron- builder)在Mac上至少45M+，在windows也要35M+。相比早起打包体积100M+已经好了不少，解压之后仍然是100M+。
- 受限于nodejs和native APIs的一些支持度的问题，他依然有所局限，一些功能依然无法实现。比如无法获取在系统文件夹里选中文件，而必须调用web的file或者node的fs接口才可访问系统文件。
- 应用性能依旧是个问题。所以做轻量级应用没问题，重量级应用尤其是CPU密集型应用问题就比较明显。

