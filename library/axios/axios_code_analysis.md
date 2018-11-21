# axios源码解析

<br>

**更新动态：**

> 2018.xx.xx: 前端框架专栏-axios-axios源码解析(C)

<br>

**主要参考：**

* [https://developer.mozilla.org/zh-CN/#](https://developer.mozilla.org/zh-CN/#)

* [https://github.com/axios/axios](https://github.com/axios/axios)

<br>

## 正文

> **背景：**

> 相信很多童鞋都听过一个说法，就是通过看一些优秀的框架的源码，能让自身的能力提升很快，本人也亲身试毒，因为项目需要，看过iview的源码，后来以补漏的心态看过jquery的源码，虽然都没看完，但是基本已经掌握了核心部分的代码以及核心思想，尽管过程中经历了无数次的百度，但是确实结果是好的，受益匪浅。

> 本期选择对ajax封装的一个库 axios 进行解析，一方面是现在web开发离不开ajax，大家都比较熟悉，另一方面axios已经是许多web项目在ajax方面的不二选择，为什么axios这么受欢迎，自然它的源码就很具阅读的诱惑力，话不多说一起看看。

<br>

**正题：**

本文解析的axios版本为0.18.0

我们来看看axios的包的根目录下有些什么：

![1.png](./images/axios_code_analysis/1.png)

根据文件名也很容易理解对应的含义：

* dist: 项目打包后的目录
* lib: 项目开发目录
* CHANGELOG.md: 更新日志
* index.d.ts: 入口ts文件
* index.js: 入口js文件
* LICENSE: 版权信息
* package.json: npm的package文件
* README.md: 使用文档
* UPGRADE_GUIDE: 升级指南

我们主要关注 /lib index.d.ts index.js 这三部分

从大局上看一下，每个目录翻一翻，发现ts文件就只有根目录的index.d.ts这一个，打开index.d.ts瞧瞧，直观的发现，一堆接口(interface)的定义摆着，有了解的童鞋马上就反应过来，其实这个文件就是用来做类型检查的，通过这种方式来达到类型检查作用，这样的方法其实已经比较常见了，许多的包都在自己的项目里加入了这样的ts文件。

看一下index.js，只有一行引入模块的代码，引入的是/lib/axios.js，这时候是不是感觉正题就要开始了呢？没错！

打开axios.js看看，其实代码量也很少，主要做了几件属于入口文件该做的事情，倒不如说这个文件才是真正的入口文件也不为过，注释什么的也应有尽有，较容易阅读，整理一下它做了这么几件事：

1. 定义创建Axios实例的方法createInstance
2. 调用createInstance新建一个名为axios的Axios实例
3. 给上述实例赋予一个名为Axios的Axios类引用类型变量
4. 给上述实例赋予一个名为create的用于创建Axios实例的工厂函数
5. 给上述实例赋予一个名为Cancel的变量，引用自./cancel/Cancel模块
6. 给上述实例赋予一个名为CancelToken的变量，引用自./cancel/CancelToken模块
7. 给上述实例赋予一个名为isCancel的变量，引用自./cancel/isCancel模块
8. 给上述实例赋予一个名为all的方法，等同于执行Promise.all()
9. 给上述实例赋予一个名为spread的变量，引用自./helpers/spread模块
10. 将上述实例赋值给module.exports和module.exports.default

可以发现唯一需要花点时间看代码的地方是createInstance方法，其他项都是一行带过，一看createInstance方法里面也基本都是引用自其他模块的内容，这下好了到底该从哪里看起呢？不着急，我们还是先从大局看，观察一下/lib下的各个目录和文件：

/adapters: 适配器模块
/cancel: 取消ajax请求模块
/core: 核心模块
/helpers: 一堆协助开发的方法库
defaults.js: 默认配置
utils.js: 一堆协助开发的方法+1

协助开发的方法不作为我们的切入点，等解析过程中用到的时候再说。

相信小伙伴们应该都听过这样的话，“三长一短选最短”，没错就是英语阅读题的“真理”，那我们采用类似的方案先从文件数最少的目录开始看，即/adapters。这里剧透一下，该目录下有一个http.js和一个xhr.js文件，http.js适配的是nodejs，xhr.js适配的是我们web前端开发，即XMLHttpRequest对象，所以这里暂且只分析xhr.js。

### /adapters

#### xhr.js

（再剧透一下，貌似一不小心从一个代码量最多的文件开始读了。。）

一看发现其实就是一个方法，参数是一个配置类的对象，返回值是一个Promise对象，接着根据代码很快判断出config参数应该就是使用axios发送ajax请求的config参数

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

isFormData方法引用自utils模块，翻看代码得知这是用来判断参数是否是FormData对象实例的，如果config.data符合，则删除config.headers里面的Content-Type字段，根据注释理解这么做是为了让浏览器负责去设置这个字段的值，我们不需要去人为地给它赋值。由此可以推理出，可能部分浏览器会去判断人为传递的参数中的这个字段如果有值，则不会再给它赋值，这样的话可能会产生无法预料的错误。

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

接着定义了一些变量，一个名为request的XMLHttpRequest对象实例，缓存ajax请求中监控状态改变的方法名的变量loadEvent，那xDomain是啥？不懂，那就往下看。

下面的if判断意思是，若node环境不为test，全局变量window存在，且含有XDomainRequest字段，XHR对象中没有withCredentials字段，isURLSameOrigin调用结果是否为false。同时满足以上条件时，做往下的一系列操作。那么这里就出现了几个比较陌生的东西，逐个针对地去搜索相关信息了解一下。

**XDomainRequest [https://developer.mozilla.org/zh-CN/docs/Web/API/XDomainRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XDomainRequest)**


