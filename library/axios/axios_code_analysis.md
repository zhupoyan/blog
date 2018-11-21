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

> 摘要：

> XDomainRequest是在IE8和IE9上的HTTP access control (CORS) 的实现，在IE10中被 包含CORS的XMLHttpRequest 取代了，如果你的开发目标是IE10或IE的后续版本，或想要支待其他的浏览器，你需要使用标准的HTTP access control。

> 该接口可以发送GET和POST请求

**withCredentials [https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials)**

> XMLHttpRequest.withCredentials  属性是一个Boolean类型，它指示了是否该使用类似cookies,authorization headers(头部授权)或者TLS客户端证书这一类资格证书来创建一个跨站点访问控制（cross-site Access-Control）请求。在同一个站点下使用withCredentials属性是无效的。

> 此外，这个指示也会被用做响应中cookies 被忽视的标示。默认值是false。

> 如果在发送来自其他域的XMLHttpRequest请求之前，未设置withCredentials 为true，那么就不能为它自己的域设置cookie值。而通过设置withCredentials 为true获得的第三方cookies，将会依旧享受同源策略，因此不能被通过document.cookie或者从头部相应请求的脚本等访问。

结合注释的内容可以分析出，这段代码主要是为了解决IE 8/9中跨域请求的问题，提供兼容性支持。

isURLSameOrigin方法，从字面理解应该是判断参数是否符合同源的条件，翻看代码后也验证了这一点。

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

这里比较简单，判断配置对象参数中的auth字段是否存在并且不为false，若满足则给请求headers添加Authorization字段，值为auth.username和auth.password的base64编码值，btoa方法的引用，取自于window.btoa，若不存在则取自/helpers/btoa，里面是包含了一些兼容性的写法的封装后的btoa方法。

稍微注意一下如果config.auth字段存在，那么请求headers的Authorization字段值是会被重写的，所以如果在这之前有给这个字段赋值的就要小心了。

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

这里是初始化一个ajax请求，并赋予配置对象中的timeout参数。buildURL方法的作用是接收配置对象的url、params、paramsSerializer三个参数，用paramsSerializer方法对params进行序列化，再将结果与url拼接并返回。

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

这里是定义监控状态变化的事件方法。开头的部分主要是处理ajax请求错误的情况，和另一种特殊的情况，接着是将返回的response对象准备好，settle方法主要是处理resolve和reject，将需要返回给对应回调方法的参数准备好，最后将ajax请求对象清空。

往下的两个方法分别定义ajax请求的onerror和ontimeout事件方法，里面均是执行reject回调方法并传递定制的error对象，最后将ajax请求对象清空。

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

这里是给请求headers添加csrf/xsrf头的（csrf/xsrf是啥，这部分的内容可大可小，但是很重要！给个参考的中文名叫，“跨源访问”，其余请自行百度！），且只在标准浏览器环境下执行。字段名从config.xsrfHeaderName获取，默认值为X-XSRF-TOKEN，对应值从cookies中的特定字段的value中获取，这个特定字段取自config.xsrfCookieName，默认值为XSRF-TOKEN。

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

这里是遍历请求headers参数对象，将各个设定值逐个set进XHR对象实例里面，对content-type这个字段又做了一次处理，有印象的童鞋已经发现一开始已经处理过一次了，这里处理的原因和方式跟开头是一致的。

往下基本就是，config里面存在的其余字段，往XHR对象实例对应赋值，方法的话对应地给事件绑定上。

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

这里是处理config中的cancelToken参数。若此字段存在，表示要取消发起请求，执行XHR对象的abort方法，调用reject回调传递cancel参数，将XHR对象实例设为空值。

最后XHR执行send方法发起请求。

### /cancel

取消ajax请求模块的主体，浏览一下各个文件容易判断出是CancelToken.js，我们从这开始分析。

#### CancelToken.js


