# 页面元素的位置相关

<br>

**更新动态：**

> 2018.9.?: 前端语言专栏-css-页面元素的位置相关(C)

<br>

**主要参考：**

[Element - Web API 接口 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)

文章demo项目url：'./demo/elementPosition'

<br>

## 正文

<br>

**正题：**

首先我们一起了解一些基本知识。

<br>

**浏览器窗口大小（宽度）和网页大小（宽度）**

如果页面内容大小不足以让浏览器滚动条出现，那么 **浏览器窗口大小（宽度） = 网页大小（宽度）** 。

如果页面内容大小足以让浏览器滚动条出现，那么 **浏览器窗口大小（宽度） = 网页大小（宽度） + 浏览器滚动条大小（宽度）** 。

![1.png](./images/elementPosition/1.png)

![2.png](./images/elementPosition/2.png)

如图所示，拖拽浏览器窗口使得width=600，选中html标签，获得其width为583。那么有人就会问了，所以浏览器滚动条大小（宽度）就是600-583=17咯？答案将在介绍完本文所有内容后揭晓！


