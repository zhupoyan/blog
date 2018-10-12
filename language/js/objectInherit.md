# 对象的继承及对象相关内容探究

<br>

**更新动态：**

> 2018.10.12: 前端语言专栏-js-对象的继承及对象相关内容探究(C)

<br>

**主要参考：**

《JavaScript设计模式》张容铭 著

<br>

## 正文

> **背景：**

> 面向对象编程这个内容，相信大家对它既陌生又不陌生，说陌生是因为大多数小白在刚开始做前端的时候可能并不会过多的接触它，能把那三大语言掌握透，能用一两个框架用的6就觉得可以了，说不陌生是因为在开发过程中或是学习前端知识过程中，难免都要接触到对象相关的内容，有差不多1年工作经验以上的同学肯定都发现了，越是底层的东西，对对象这个内容掌握程度要求就越高。

> 本人也一样，一开始接触面向对象编程接触的少，而且比较害怕它，经常会刻意避开这个话题，然而其实这个内容恰恰是前端知识里面一个非常非常非常重要的点，有关它的面试题层出不穷，特别是大公司，所以如果一天不拿下它，那可以说离大公司的门槛越来越远，离前沿前端技术也越来越远，因为缺少了这部分的知识，没有足够的能力去理解前沿的技术原理。

> 对象中的继承，这个可以说是对象里面的重中之重了，恰好最近又在研读张容铭老师的书，为什么说是“又”呢，其实已经不是第一次翻这本书了，主要是前几次翻开看了几页，完全看不懂，跟天书一般。不过随着阅历的丰富，秉持着“看一遍看不懂就看第二遍，第二遍还看不懂就看第三遍，还看不懂就隔一阵子再继续看”的打不死的小强的精神，现在翻读发现几乎没有压力了，正好可以跟大家分享心得！

> 本文较适合有了解过对象相关内容的一点皮毛的同学阅读

<br>

**正题：**

先来看看新定义的一个对象里面有哪些内容：

    var a = {} // undefined

    a
    // {}:
    //   __proto__:
    //     constructor: ƒ Object()
    //     hasOwnProperty: ƒ hasOwnProperty()
    //     isPrototypeOf: ƒ isPrototypeOf()
    //     propertyIsEnumerable: ƒ propertyIsEnumerable()
    //     toLocaleString: ƒ toLocaleString()
    //     toString: ƒ toString()
    //     valueOf: ƒ valueOf()
    //     __defineGetter__: ƒ __defineGetter__()
    //     __defineSetter__: ƒ __defineSetter__()
    //     __lookupGetter__: ƒ __lookupGetter__()
    //     __lookupSetter__: ƒ __lookupSetter__()
    //     get __proto__: ƒ __proto__()
    //     set __proto__: ƒ __proto__()

    a.prototype // undefined
    
    a.__proto__ === Object.prototype // true

    a.__proto__.__proto__ === null // true

这个叫a的空对象，原型prototype未定义，除了原型链__proto__以外没有任何属性，原型链里面的内容为原生对象Object的原型，且Object里面不再有原型链__proto__，相关结论大家可以自己在浏览器控制台测试，下文不再重复。

再来看看一个新定义的空函数里面有哪些内容：

    var a = function () {} // undefined

    a // ƒ () {}

    a.prototype
    // {constructor: ƒ}:
    //   constructor: ƒ ()
    //   __proto__: Object

    a.prototype.constructor === a // true

    a.__proto__ // ƒ () { [native code] }

    a.__proto__ === Function.prototype // true
    
    a.__proto__ === Function.__proto__ // true

    Function.__proto__.__proto__ === Object.prototype // true

这个叫a的空函数，它的原型内除了原型链外还有一个叫constructor的属性，且值即a本身，a的原型链即原生Function对象的原型，也是原生Function对象的原型链，所以后两者是全等关系，这个比较神奇。由于Function本质也是对象，故它的原型链同样追溯到原生Object对象的原型。

接下来就进入真正的主题————**继承**

继承的方法有好几种，我就按照参考资料上的顺序依次分析各种继承方式

<br>

### 类式继承

贴上参考资料上的代码：

    // 类式继承
    // 声明父类
    function SuperClass() {
        this.superValue = true;
    }
    // 为父类添加共有方法
    SuperClass.prototype.getSuperValue = function () {
        return this.superValue;
    };
    // 声明子类
    function SubClass () {
        this.subValue = false;
    }

    // 继承父类
    SubClass.prototype = new SuperClass();
    // 为子类添加共有方法
    SubClass.prototype.getSubValue = function () {
        return this.subValue;
    };

简要说明一下这个过程。首先声明一个父类，给父类的原型对象添加一个方法，声明一个子类，**给子类的原型对象赋予一个父类的示例对象**，最后给子类的原型对象添加一个方法。

我们来看一下子类的情况：

    SubClass.prototype
    // SuperClass {superValue: true, getSubValue: ƒ}
    //   getSubValue: ƒ ()
    //   superValue: true
    //   __proto__:
    //     getSuperValue: ƒ ()
    //     constructor: ƒ SuperClass()

很显然，这种方式的优点是达到了预期的继承的效果，子类的示例能够通过原型链访问到父类的原型对象的属性与方法，同样也能访问到父类构造函数中的属性与方法。

这种方式的缺点是，由于它的核心是给子类的原型对象赋予一个父类的示例对象，属于**引用传递**，那么就会出现下面这种情况：

    function SuperClass() {
        this.superValue = true;
        // 给父类对象构造函数里面添加一个引用类型的参数，例如一个对象
        this.superObj = {test: 1}
    }
    
    // 声明两个子类的实例
    var a = new SubClass()
    var b = new SubClass()

    a.superObj.test = 2
    b.superObj.test // 2

显然，发现如果在任意一个子类的实例里修改从父类构造函数继承而来的引用类型的参数，那么其它子类实例的对应值也会随之更改。

那么是否有更优的方法继承呢？

### 构造函数继承

贴上参考资料上的代码：

    // 构造函数式继承
    // 声明父类
    function SuperClass(id) {
        // 引用类型共有属性
        this.books = ['JavaScript', 'html', 'css'];
        // 值类型共有属性
        this.id = id;
    }
    // 父类声明原型方法
    SuperClass.prototype.showBooks = function () {
        console.log(this.books);
    }
    // 声明子类
    function SubClass(id) {
        // 继承父类
        SuperClass.call(this, id);
    }

    // 测试
    var a = new SubClass()
    var b = new SubClass()

    a.books.push('2333')
    a.books // ["JavaScript", "html", "css", "2333"]
    b.books // ["JavaScript", "html", "css"]

    a.showBooks() // Uncaught TypeError: a.showBooks is not a function

这种方式实际上是在子类的构造函数里面，运用了call函数以子类的名义调用了一次父类的构造函数，达到继承父类构造函数内定义的属性与方法的效果。

这种方式的优点是，解决了类式继承出现的问题，子类的实例不再共用同一个引用类型属性，独立开来。但却又出现了一个新的问题，就是无法继承父类原型对象定义的方法。

那么是否有方法能综合前面两个方式的优点，做到完美呢？

### 组合继承

贴上参考资料上的代码：

    // 组合式继承
    // 声明父类
    function SuperClass(name) {
        // 值类型共有属性
        this.name = name;
        // 引用类型共有属性
        this.books = ["html", "css", "JavaScript"];
    }
    // 父类原型共有方法
    SuperClass.prototype.getName = function () {
        console.log(this.name);
    };
    // 声明子类
    function SubClass(name, time) {
        // 构造函数式继承父类name属性
        SuperClass.call(this, name);
        // 子类中新增共有属性
        this.time = time;
    }
    // 类式继承 子类原型继承父类
    SubClass.prototype = new SuperClass();
    // 子类原型方法
    SubClass.prototype.getTime = function () {
        console.log(this.time);
    };

可能有同学已经看出来了，这个方式无非就是将类式继承和构造函数继承的核心部分都跑一遍，取其所长，我们来测试一下是不是如我们所愿：

    // 测试代码
    // 声明两个子类示例
    var a = new SubClass('aaa')
    var b = new SubClass('bbb')

    a.getName() // aaa

    a.books.push('2333')
    a.books // ["JavaScript", "html", "css", "2333"]
    b.books // ["JavaScript", "html", "css"]

嗯！确实达到了应有的效果，既继承了父类的属性与方法，父类共有属性在各个子类实例中又是独立的！

那么这个方式是否是完美的呢？非也！再稍微考虑一下就容易发现，父类的构造函数执行了两遍。第一遍是在子类构造函数内，通过call函数调用；第二遍是在给子类原型对象赋予父类实例时，调用了一遍。

还有更优的方法吗？

有！但在介绍之前先了解另外两种继承方式。

### 原型式继承

贴上参考资料上的代码：

    // 原型式继承
    function inheritObject(o) {
        // 声明一个过渡函数对象
        function F() {}
        // 过渡对象的原型继承父对象
        F.prototype = o;
        // 返回过渡对象的一个实例，该实例的原型继承了父对象
        return new F();
    }

有同学可能已经发现了，这种方式跟类式继承非常像，区别在于类式继承中的子类变成了这里的过渡函数对象，并且变得非常干净。那么这种方式是不是也存在跟类式继承一样的问题呢：

    // 测试代码
    var book = {
        name: "js book",
        alikeBook: ["css book", "html book"]
    };

    var aBook = inheritObject(book);
    aBook.name = "a book";
    aBook.alikeBook.push("a book");

    var bBook = inheritObject(book);
    bBook.name = "b book";
    bBook.alikeBook.push("b book");

    aBook.name // a book
    aBook.alikeBook // ["css book", "html book", "a book", "b book"]

    bBook.name // b book
    bBook.alikeBook // ["css book", "html book", "a book", "b book"]

    book.name // js book
    book.alikeBook // ["css book", "html book", "a book", "b book"]

果不其然，存在跟类式继承一样的问题，共用的引用类型属性无法独立。

### 寄生式继承

贴上参考资料上的代码：

    // 寄生式继承
    // 声明基对象
    var book = {
        name: "js book",
        alikeBook: ["css book", "html book"]
    };
    function createBook(obj) {
        // 通过原型继承方式创建新对象
        var o = new inheritObject(obj);
        // 拓展新对象
        o.getName = function () {
            console.log(name);
        };
        // 返回拓展后的新对象
        return o;
    }

寄生式继承其实就是对原型式继承的二次封装，在继承了父类的属性与方法的基础上，自己还能添加新的属性与方法，有点构造函数继承的意思。

这两种继承方式其实是在为最后一种继承方式做准备

### 寄生组合式继承

如果说组合继承是类式继承和构造函数继承的结合版，那么寄生组合式继承可以说是寄生式继承和构造函数继承的结合版，甚至是结合后的升级版！是现在比较完美的对象继承方式。

贴上参考资料上的代码：

    /**
     * 寄生式继承 继承原型
     * 传递参数 subClass 子类
     * 传递参数 superClass 父类
     **/
    function inheritPrototype(subClass, superClass) {
        // 复制一份父类的原型副本保存在变量中
        var p = inheritObject(superClass.prototype);
        // 修正因为重写子类原型导致子类的constructor属性被修改
        p.constructor = subClass;
        // 设置子类的原型
        subClass.prototype = p;
    }

参考资料上对这种继承方式的说明其实已经非常详细，但是可能很多小白会看不大懂，我的理解是：

构造函数继承主要针对于对父类构造函数中的属性与方法的继承，单独来讲已经没有什么问题，上面的函数主要针对寄生式继承做一个改造。

再简单点讲，现在就是在解决父类原型对象上的属性与方法的继承问题，采用的方式是通过原型式继承的方法，新建一个父类原型对象的副本，将其赋予子类，这样首先就保证了每次实例化一个子类时继承的属性与方法都是全新且独立的一份资源，然后再调用子类的构造函数继承父类的构造函数里的属性与方法。但是在新建完副本将其赋予子类前，不能直接赋值，因为新建副本的时候缺少了子类的构造函数constructor这个属性，所以需要手动给它定义上去，再进行赋予的操作。

现在就简单写一些测试代码来看看见证奇迹的时刻！

    // 定义父类
    function SuperClass(name) {
        this.name = name;
        this.books = ["a", "b"];
    }
    // 定义父类原型方法
    SuperClass.prototype.getName = function () {
        console.log(this.name);
    };
    // 定义子类
    function SubClass(name, time) {
        SuperClass.call(this, name);
        this.time = time;
    }
    // 寄生式继承父类原型
    inheritPrototype(SubClass, SuperClass);
    // 子类新增原型方法
    SubClass.prototype.getTime = function () {
        console.log(this.time);
    };

    // 新建两个子类实例
    var c = new SubClass("ccc", 2017);
    var d = new SubClass("ddd", 2018);

    // 测试从父类构造函数继承来的属性
    c.name // ccc

    // 测试从父类原型对象继承来的方法
    c.getName() // ccc

    // 测试实例对象之间的共用属性books是否已独立
    c.books.push('c')
    c.books // ["a", "b", "c"]
    d.books // ["a", "b"]

现在看来需要的效果都已经齐全了！

**结尾**

建议初学者多练练手，将本文的代码多在console里面打一打，本人也是一开始的时候非常的迷糊，知道原型是什么，原型链是什么，但是就是不知道每次语句的执行结果的由来，随着一次次的探究也终究是搞明白了！

希望大家通过阅读本文能有所收获！
