## WebRTC 入门知识

### WebRTC 是什么
> WebRTC(Web Real-Time Communication) 是一项实时通讯技术。可以用在视频聊天、音频聊天活P2P文件分享等Web API。
> 它允许网络应用或站点在不借助中间媒介的情况下，建立浏览器之间点对点（Peer-to-Peer）的连接，实现视频流或音频流或者其他任意数据点传输。

**实时通信和即时通信的区别：**

IM即时通信：就是通过文字和语音消息发送、文件传输等方式通信，考虑的是 **可靠性；**

RTC即时通信：音视频通话、电话会议，考虑的是 **低延时。**

### WebRTC 应用场景

1. **点对点通讯**：WebRTC支持浏览器之间进行音视频通话，例如语音通话、视频通话等；
2. **电话会议**：WebRTC可以支持多人音视频会议，例如腾讯会议、钉钉会议
3. **屏幕共享**：WebRTC还可以实时共享屏幕
4. **直播**：WebRTC还可以用于构建实时直播，用户可以通过浏览器观看直播内容


### WebRTC组成部分

#### 浏览器API
#### 音视频引擎
#### 网络IO

### WebRTC 通信过程
**WebRTC 实现一对一通信需要哪些基本条件呢？**
> - **WebRTC终端（两个）**：本地和远端，负责音视频采集、编解码、NAT穿越以及音视频数据传输等；
> - **Signal信令服务器**：自行实现的信令服务，负责信令处理，如：加入房间、离开房间、媒体协商消息的传输等；
> - **STUN/TURN服务器**：负责获取WebRTC终端在公网的IP地址，以及NAT穿越失败后的数据中转服务。


**通信过程如下：**

1. 本地（WebRTC终端）启动后，检测设备可用性，如果可用后开始进行音视频采集工作；
2. 本地就绪后，发送“加入房间”信令到Signal服务器；
3. Signal服务器创建房间，等待加入；
4. 对端（WebRTC终端）同样操作，加入房间并通知另一端；
5. 双端创建媒体连接对象 **RTCPeerConnection**，进行媒体协商；
6. 双端进行连通性测试，最终建立连接；_这一步在建立连接进行P2P穿越时很可能失败。当P2P穿越失败时，为了保障音视频数据仍可以互通，则需要通过TURN服务器进行音视频数据中转。_
7. 将采集到的音视频数据通过 **RTCPeerConnection **对象进行编码，最终通过P2P传送给对端/本地，在进行解码、展示。

![](https://cdn.nlark.com/yuque/0/2024/jpeg/12794520/1704622212328-5155e011-e53b-4f16-adc5-60efd0d92b12.jpeg)

### 相关术语解释

#### 信令服务器
信令可以简单理解成消息。在协调通讯过程中，为了建立WebRTC的通信过程，**在通信双方彼此连接、传输媒体数据之前，它们需要通过信令服务器交换一些信息，如加入房间、离开房间及媒体协商**等，而这个过程WebRTC没有实现，需要自己搭建信令服务。
可以使用**Socket.io**来搭建WebRTC信令服务器。**Socket.io**已内置了房间的概念，因此非常适用于信令服务器的创建。

**_信令服务器搭建过程:_**

1. Socket.io分为服务端和客户端两部分。服务端由Node.js加载后侦听某个服务端口；
```javascript
  const app = express()
  const http_server = http.createServer(app)
  http_server.listen(80)
  let io = new IO(http_server, {
    paht: '/',
    // 跨域
    cors: {
      origin: '*'    
    }
  })
  http_server.on('listening')
```

2. 客户端想要与服务端连接，首先需要加载Socket.io的客户端库，然后调用io.connect();
```javascript
socket = io('http://localhost:80', {
  query: {username, room}
}).connect()
```

3. 服务端接收到 **connection **消息，在此消息中注册 接收/发送消息 的事件；
```javascript
io.on('connection', (socket) => {
  const {query} = socket.handshake
  // 获取socket连接参数 username和room
  const {username, room} = query;
  // ...
})
```

4. 客户端同样注册 接收/发送消息 的事件，双方开始通信。
```javascript
socket.on('message', (room, data)=>{
  socket.to(room).emit('message', room, data)
})
socket.on('leave', (room, username)=>{
  socket.leave(room)
  socket.emit('leave', room, socket.id)
})
```

**_Socket.io 需要用到的知识点：_**

- emit 、on：给本次连接发送/接收消息
```javascript
// 发送message消息
const username = 'xxx'
const message = 'hello'
// 发送消息
socket.emit('message', username, message)
// 接收消息
socket.on('message', (username, message) => {
  // do something....
})
```

- to：给某个房间内所有人发送消息（除本连接外）
```javascript
socket.to(room).emit()
```

- broadcast：给所有人发送消息（除本连接外）
```javascript
socket.broadcast.emit()
```

#### RTCPeerConection
RTCPeerConnection 是一个由本地计算机到远端WebRTC连接，该接口提供**创建、保持、监控、关闭连接**的方法的实现，可以简单理解为功能强大的socket连接。

通过 `new RTCPeerConnection`即可创建一个`RTCPeerConnection`对象，此对象主要负责**与各端建立连接（NAT穿越），接收、发送音视频数据，并保障音视频的服务质量，同时端到端之间的媒体协商**，也是基于`RTCPeerConnection`对象来实现的。
甚至它是如何保障端对端之间的连通性，如何保证音视频的服务质量，又是如何确定使用那个编解码器等问题，都已经在RTCPeerConnection对象底层实现好了。
```javascript
const localPc = new RTCPeerConnection(rtcConfig)
// 将音视频流添加到 RTCPeerConnection 对象中
localStream.getTracks().forEach((track) => {
  localPc.addTrack(track, localStream)
})
```
> 在获取音视频流后，需要将流添加到创建的`RTCPeerConnection`对象中，当`RTCPeerConnection`对象获取到音视频流后，就可以开始与对端进行媒体协商了。

#### 媒体协商

- 定义

媒体协商的**作用是找到双方共同支持的媒体能力**，如**双方各自支持的编解码器，音频的参数采样率，采样大小，声道数，视频的参数分辨率，帧率**等。
这些音视频信息都会在**SDP(Session Description Protocal：即使用文本描述各端的能力)**中进行描述。
> **一对一的媒体协商流程大致如下：**
> - 首先自己在SDP中记录自己支持的音频/视频参数和传输协议
> - 然后进行信令交互，交互过程会同时传递SDP信息，另一方接收后与自己的SDP信息比对，并取出他们之间的交集，交集就是他们协商的结果，也就是他们最终使用的音视频参数以及传输协议。


- 媒体协商过程

一对一通信中，发起方发送的SDP成为`Offer（提议）`，接收方发送的SDP称为`Answer（应答）`。
> 每端保持两个描述：
> 1. 描述本身的本地描述`LocalDescription`
> 2. 描述呼叫的远端描述`RemoteDescription`


**当通信双方 RTCPeerConnectioin 对象创建完成后，就可以进行媒体协商了，大致流程如下：**

1. 发起方创建`Offer`类型的SDP，保存为本地描述后再通过信令服务器发送到对端；
2. 接收方接收到`Offer`类型的SDP，将`Offer`保存为远程描述
3. 接收方创建`Answer`类型的SDP，保存为本地描述，再通过信令服务器发送到发起方，此时接收方已知道连接双方的配置；
4. 发起方接收到`Answer`类型的SDP后保存到远程描述，此时发起方也知道连接双方的配置；
5. 整个媒体协商过程处理完毕。

![](https://cdn.nlark.com/yuque/0/2024/jpeg/12794520/1704635817250-4d8cdfe2-f82a-4554-bb61-359be26683f8.jpeg)
更详细的步骤参考MDN中的 [WebRTC connectivity - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Connectivity#%E4%BC%9A%E8%AF%9D%E6%8F%8F%E8%BF%B0)

- 代码实现媒体协商过程

**需要用到的API：**
> - createOffer：用于创建Offer；
> - createAnswer：用于创建Answer；
> - setLocalDescription：用于设置本地SDP信息；
> - setRemoteDescription：用于设置远端的SDP信息。

1. 发起方创建 RTCPeerConnection
```javascript
// 配置
export const rtcConfig = null;
const localPc = new RTCPeerConnection(rtcConfig)
```

2. 发起方/接收方创建Offer，保存为本地描述
```javascript
const offer = await localPc.createOffer()
// 保存为本地描述
await localPc.setLocalDescription(offer)
// 通过信令服务器发送到对端
socket.emit('offer', offer)
```

3. 接收Offer后，创建Answer并发送
```javascript
socket.on('offer',async offer => {
  // 将 Offer 保存为远程描述
  remotePc = new RTCPeerConnection(rtcConfig)
  await remotePc.setRemoteDescription(offer)
  const remoteAnswer = await remotePc.createAnswer()
  await remotePc.setLocalDescription(remoteAnswer)
  socket.emit('answer', remoteAnswer)
})
```

4. 接收Answer存储为远程描述
```javascript
socket.on('answer', async answer => {
  // 将 Answer 保存为远程描述
  await localPc.setRemoteDescription(answer);
})
```
至此，媒体协商结束，接下来WebRTC底层会收集`Candidate`，并进行连通性检测，最终在通话双方之间建立起一条链路。


#### Candidate

- 定义

ICE Candidate(ICE 候选者)：表示 WebRTC 与远端通信时使用的协议、IP地址和端口。在WebRTC进行连接测试时，通信双端会提供众多候选者，然后按照优先级进行连通性测试，测试成功就会简历连接。结构如下：
```json
{
  address: xxx.xxx.xxx.xxx, // 本地IP地址
  port: number, // 端口号
  type: 'host/srflx/relay', // 候选者类型
  priority: number, // 优先级
  protocol: 'udp/tcp', // 传输协议
  usernameFragment: string // 访问服务的用户名
  ....
}
```

- 候选者 Candidate类型，即type分为三种
> 1. host：本机候选者。优先级最高，host类型之间的连通性测试就是内网之间的连通性测试，P2P;
> 2. srflx：内网主机映射的外网地址和端口。如果host无法建立连接，则选择srflx连接，即P2P连接；
> 3. relay：中继候选者。优先级最低。只要上述两种不存在时，才会走中继服务器的模式，因为会增加传输时间，优先级最低。


- 如何收集 Candidate

**host 类型**
host 类型的Candidate 是最容易收集的，就是本地IP地址和端口号

**srflx 和 relay 类型**
**srflx** 类型的Candidate就是内网通过NAT（Net Address Translation，作用是进行内外网地址的转换，位于内网网关上）映射后的外网地址。
例如：访问百度时NAT会将主机内网地址转换成外网地址，发送请求到百度的服务器，服务器返回到公网地址和端口，再通过NAT转到内网主机上。
 
![](https://cdn.nlark.com/yuque/0/2024/jpeg/12794520/1704723492192-705dda00-b545-45b2-8f67-7a8967534b2e.jpeg)

**relay类型**的Candidate获取是通过TURN协议完成，它的**连通率是所有候选者中最高的，优先级也是最低的。**
relay服务器就是通过TURN协议实现的，所以relay服务器和TURN服务器是同一个意思，都是中继服务器。

WebRTC 首先会使用STUN服务器找出自己的NAT环境，然后试图找出**打洞**的方式，最后试图创建点对点连接。当它尝试过不同的穿透方式都失败之后，为保证通信成功率回启动TURN服务器进行中转，此时所有的流量都会通过TURN服务器。这时如果TURN服务器配置不好或者带宽不够，通信质量就会变差。
#### STUN协议
全称 Session Traversal Utilities for NAT(NAT 会话穿越应用程序) ，是一种网络协议，它允许位于NAT后的客户端找出自己的公网地址，也就是**遵守这个协议就可以拿到自己的公网IP。**
**STUN 服务可以直接使用Google提供的免费服务**`**stun.l.google.com:19302**`**,或者自己搭建。**
#### TURN协议
全称 Traversal Using Relays around NAT (使用中继穿透NAT)，STUN的中继扩展。 简单的说，TURN与STUN的共同点都是通过修改应用层中的私网地址达到NAT穿透的效果，不同点是TURN是通过两方通讯的‘中间人’方式实现穿透。
**重点：STUN服务器是用来获取外网地址进行P2P；而TURN服务器是在P2P失败时进行转发。**
#### NAT打洞/P2P穿越
NAT 解决了 IPv4地址不够用的情况，但是因为有了NAT，端与端的网络连接变得复杂，也就需要NAT穿越等技术。
收集完Candidate， WebRTC就按照优先级进行连通性测试。如果双方位于同一个局域网，就会直接建立连接，否则会尝试NAT打洞，即P2P穿越。
#### ICE
全称 Interactive Connectivity Establishment(交互式连通建立方式)，ICE 协议通过一系列技术（如STUN、TURN服务器）帮助通信双方发现和协商可用的公网地址，从而实现NAT穿越，也就是上述说的获取所有候选者类型的过程，即：在本机收集所有的host类型Candidata，通过STUN协议收集srflx类型的Candidate，使用TURN协议收集relay类型的Candidate。

- 代码部分

当Candidate被收集后，会触发`icecandidate`事件，所以需要在代码中监听此事件，以对收集到的Candidate做处理。
```javascript
localPc.onicecandidate = function (event) {
  // 回调时，将自己的candidate发送给对方，对方可以直接addIceCandidate(candidate)添加可以获取流
  if(event.candidate) {
    socket.emit('candidate', event.candidate)
  }
}
```

对端收到发送的Candidate后，再调用`RTCPeerConnection`对象的`addIceCandidate()`方法将接收到的Candidate保存起来，然后按照Candidate优先级进行连通性检测。
```javascript
await remotePc.addIceCandidate(candidate)
```
如果Candidate连通性检测完成，那么端与端就建立了物理连接，这时数据就可以通过这个物理连接源源不断的传输了。

参考：
[WebRTC这么火🔥，前端靓仔，请收下这篇入门教程 - 掘金](https://juejin.cn/post/7266417942182608955#heading-8)
