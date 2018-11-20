# axios源码解析

<br>

**更新动态：**

> 2018.xx.xx: 前端框架专栏-axios-axios源码解析(C)

<br>

**主要参考：**

无

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


