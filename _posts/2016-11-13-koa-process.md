---
layout: article
title: 深入探析koa之中间件流程控制篇
category: [javascript,后端开发]
description: 201611/koa.jpg
---
koa被认为是第二代web后端开发框架，相比于前代express而言，其最大的特色无疑就是解决了回调金字塔的问题，让异步的写法更加的简洁。<!--more-->在使用koa的过程中，其实一直比较好奇koa内部的实现机理。最近终于有空，比较深入的研究了一下koa一些原理，在这里会写一系列文章来记录一下我的学习心得和理解。

在我看来，koa最核心的函数是大名鼎鼎的co，koa正是基于这个函数实现了异步回调同步化，以及中间件流程控制。当然在这篇文章中我并不会去分析co源码，我打算在整个系列文章中，一步一步讲解如何实现koa中间件的流程控制原理，koa的异步回调同步写法实现原理，最后在理解这些的基础上，实现一个简单的类似co的函数。

本篇首先只谈一谈koa的中间件流程控制原理。

### 1. koa中间件执行流程

关于koa中间件如何执行，官网上有一个非常经典的例子，有兴趣的可以去看看，不过这里，我想把它修改的更简单一点：

```javascript
var koa = require('koa');
var app = koa();

app.use(function*(next) {
  console.log('begin middleware 1');
  yield next;
  console.log('end middleware 1');
});

app.use(function*(next) {
  console.log('begin middleware 2');
  yield next;
  console.log('end middleware 2');
});

app.use(function*() {
  console.log('middleware 3');
});

app.listen(3000);
```

运行这个例子，然后使用curl工具，运行：

```
curl http://localhost:3000
```

可以看到，运行之后，会输出：

```javascript
begin middleware 1
begin middleware 2
middleware 3
end middleware 2
end middleware 1
```

这个例子非常形象的代表了koa的中间件执行机制，可以用下图的洋葱模型来形容：

![img]({{ site.baseurl }}/img/201611/koa_middleware.jpg)

通过这种执行流程，开发者可以非常方便的开发一些中间件，并且非常容易的整合到实际业务流程中。那么，这样的流程又是如何实现和控制的呢？

### 2. koa中的generator和compose

简单来说，洋葱模型的执行流程是通过es6中的generator来实现的。不熟悉generator的同学可以去看看其特性，其中一个就是generator函数可以像打断点一样从函数某个地方跳出，之后还可以再回来继续执行。下面一个例子可以说明这种特性：

```javascript
var gen=function*(){
  console.log('begin!');
  //yield语句，在这里跳出，将控制权交给anotherfunc函数。
  yield anotherfunc;
  //下次回来时候从这里开始执行
  console.log('end!');
}

var anotherfunc(){
  console.log('this is another function!');
}

var g=gen();
var another=g.next();  //'begin!'
//another是一个对象，其中value成员就是返回的anotherfunc函数
another.value();  //'this is another function!'
g.next();  //'end!';
```

从这个简单例子中，可以看出洋葱模型最基本的一个雏形，即yield前后的语句最先和最后执行，yield中间的代码在中心执行。

现在设想一下，如果yield后面跟的函数本身就又是一个generator，会怎么样呢？其实就是从上面例子里面做一个引申：

```javascript
var gen1=function*(){
  console.log('begin!');
  yield g2;
  console.log('end!');
}

var gen2=function*(){
  console.log('begin 2');
  yield anotherfunc;
  console.log('end 2');
}

var anotherfunc(){
  console.log('this is another function!');
}

var g=gen();
var g2=gen2();

var another1=g.next();  //'begin!';
var another2=another1.value.next(); //'begin 2';
another2.value(); //'this is another function!';
another1.value.next(); //'end 2';
g.next(); //'end!';
```

可以看出，基本上是用上面的例子，再加一个嵌套而已，原理是一样的。

而在koa中，每个中间件generator都有一个next参数。在我们这个例子中，g2就可以看成是g函数的next参数。事实上，koa也确实是这样做的，当使用app.use()挂载了所有中间件之后，koa有一个koa-compose模块，用于将所有generator中间件串联起来，基本上就是将后一个generator赋给前一个generator的next参数。koa-compose的源码非常简单短小，下面是我自己实现的一个：

```javascript
function compose(middlewares) {
  return function(next) {
    var i = middlewares.length;
    var next = function*() {}();
    while (i--) {
      next = middlewares[i].call(this, next);
    }
    return next;
  }
}
```

使用我们自己写的compose对上面一个例子改造，是的其更接近koa的形式：

```javascript
function compose(middlewares) {
  return function(next) {
    var i = middlewares.length;
    var next = function*() {}();
    while (i--) {
      next = middlewares[i].call(this, next);
    }
    return next;
  }
}

var gen1=function*(next){
  console.log('begin!');
  yield next;
  console.log('end!');
}

var gen2=function*(next){
  console.log('begin 2');
  yield next;
  console.log('end 2');
}

var gen3=function*(next){
  console.log('this is another function!');
}

var bundle=compose([gen1,gen2,gen3]);
var g=bundle();

var another1=g.next();  //'begin!';
var another2=another1.value.next(); //'begin 2';
another2.value.next(); //'this is another function!';
another1.value.next(); //'end 2';
g.next(); //'end!';
```

怎么样？是不是有一点koa中间件写法的感觉了呢？但是目前，我们还是一步一步手动的在执行我们这个洋葱模型，能否写一个函数，自动的来执行我们这个模型呢？

### 3. 让洋葱模型自动跑起来：一个run函数的编写

上面例子中，最后的代码我们可以看出一个规律，基本就是外层的generator调用next方法把控制权交给内层，内层再继续调用next把方法交给更里面的一层。整个流程可以用一个函数嵌套的写法写出来。话不多说，直接上代码：

```javascript
function run(gen) {
  var g;
  if (typeof gen.next === 'function') {
    g = gen;
  } else {
    g = gen();
  }
  function next() {
    var tmp = g.next();
    //如果tmp.done为true，那么证明generator执行结束，返回。
    if (tmp.done) {
      return;
    } else if (typeof g.next === 'function') {
      run(tmp.value);
      next();
    }
  }
  next();
}

function compose(middlewares) {
  return function(next) {
    var i = middlewares.length;
    var next = function*() {}();
    while (i--) {
      next = middlewares[i].call(this, next);
    }
    return next;
  }
}

var gen1 = function*(next) {
  console.log('begin!');
  yield next;
  console.log('end!');
}

var gen2 = function*(next) {
  console.log('begin 2');
  yield next;
  console.log('end 2');
}

var gen3 = function*(next) {
  console.log('this is another function!');
}

var bundle = compose([gen1, gen2, gen3]);

run(bundle);
```

run函数接受一个generator，其内部执行其实就是我们上一个例子的精简，使用递归的方法执行。运行这个例子，可以看到结果和我们上一个例子相同。

到此为止，我们就基本讲清楚了koa中的中间件洋葱模型是如何自动执行的。事实上，koa中使用的co函数，一部分功能就是实现我们这里编写的run函数的功能。

值得注意的是，这篇文章只注重分析中间件执行流程的实现，暂时并没有考虑异步回调同步化原理。下一篇文章中，我将带大家继续探析koa中异步回调同步化写法的机理。

这篇文章的代码可以在github上面找到：[https://github.com/mly-zju/async-js-demo](https://github.com/mly-zju/async-js-demo)，其中process_control.js文件就是本篇的事例源码。

另外欢迎多多关注我的[个人博客](http://mly-zju.github.io/)哦^_^ 会不定期更新我的技术文章~
