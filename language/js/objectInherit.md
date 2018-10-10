# 对象的继承及对象相关内容探究

<br>

**更新动态：**

> 2018.xx.xx: 前端语言专栏-js-对象的继承及对象相关内容探究(C)

<br>

**主要参考：**

《JavaScript设计模式》张容铭 著

<br>

## 正文

> **背景：**

> 面向对象编程这个内容，相信大家对它既陌生又不陌生，说陌生是因为大多数小白在刚开始做前端的时候可能并不会过多的接触它，能把那三大语言掌握透，能用一两个框架用的6就觉得可以了，说不陌生是因为在开发过程中或是学习前端知识过程中，难免都要接触到对象相关的内容，有差不多1年工作经验以上的同学肯定都发现了，越是底层的东西，对对象这个内容掌握程度要求就越高。

> 本人也一样，一开始接触面向对象编程接触的少，而且比较害怕它，经常会刻意避开这个话题，然而其实这个内容恰恰是前端知识里面一个非常非常非常重要的点，有关它的面试题层出不穷，特别是大公司，所以如果一天不拿下它，那可以说离大公司的门槛越来越远，离前沿前端技术也越来越远，因为缺少了这部分的知识，没有足够的能力去理解前沿的技术原理。

> 对象中的继承，这个可以说是对象里面的重中之重了，恰好最近又在研读张容铭老师的书，为什么说是“又”呢，其实已经不是第一次翻这本书了，主要是前几次翻开看了几页，完全看不懂，跟天书一般。不过随着阅历的丰富，秉持着“看一遍看不懂就看第二遍，第二遍还看不懂就看第三遍，还看不懂就隔一阵子再继续看”的打不死的小强的精神，现在翻读发现几乎没有压力了，正好可以跟大家分享心得！

<br>

**正题：**

先来看看新定义的一个对象里面有哪些内容：

  var a = {} // undefined
  a // {}
  /**
   * __proto__:
   *   constructor: ƒ Object()
   *   hasOwnProperty: ƒ hasOwnProperty()
   *   isPrototypeOf: ƒ isPrototypeOf()
   *   propertyIsEnumerable: ƒ propertyIsEnumerable()
   *   toLocaleString: ƒ toLocaleString()
   *   toString: ƒ toString()
   *   valueOf: ƒ valueOf()
   *   __defineGetter__: ƒ __defineGetter__()
   *   __defineSetter__: ƒ __defineSetter__()
   *   __lookupGetter__: ƒ __lookupGetter__()
   *   __lookupSetter__: ƒ __lookupSetter__()
   *   get __proto__: ƒ __proto__()
   *   set __proto__: ƒ __proto__()
   **/
