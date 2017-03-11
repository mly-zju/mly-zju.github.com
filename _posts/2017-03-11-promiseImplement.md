---
layout: article
title: 彻底理解Promise对象(1)——用es5语法实现一个自己的Promise
category: [javascript]
description: 201703/promise.jpeg
---

众所周知javascript语言的一大特色就是异步，这既是它的优点，同时在某些情况下也带来了一些的问题。最大的问题之一，就是异步操作过多的时候，代码内会充斥着众多回调函数，乃至形成回调金字塔。为了解决回调函数带来的问题，Promise作为一种更优雅的异步解决方案被提出，最初只是一种实现接口规范，而到了es6，则是在语言层面就原生支持了Promise对象。<!--more-->

最初接触Promise的时候，我觉得它是比较抽象并且令人困惑的，相信很多人也有同样的感觉。但是在后来的熟悉过程中，我慢慢体会到了它的优雅，并开始思考Promise对象实现的原理，最终用es5语法实现了一个具备基本功能的自己的Promise对象。在这篇文章中，会把自己实现的过程和思路循序渐进的记录一下，相信大家看完之后，也能够彻底理解Promise对象运行的原理，并在以后的开发中，能更熟练的使用它。

> github源码地址: [https://github.com/mly-zju/Js-practice](https://github.com/mly-zju/Js-practice)

### 1. 回到过去: resolve, reject和then

首先来看一个Promise的使用实例:

```javascript
var fn=function(resolve, reject){
  console.log('begin to execute!');
  var number=Math.random();
  if(number<=0.5){
    resolve('less than 0.5');
  }else{
    reject('greater than 0.5');
  }
}

var p=new Promise(fn);
p.then(function(data){
  console.log('resolve: ', data);
}, function(data){
  console.log('reject: ', data);
})
```

这个例子当中，在fn当中产生一个0~1的随机数，如果小于等于0.5， 则调用resolve函数，大于0.5，则调用reject函数。函数定义好之后，用Promise包裹这个函数，返回一个Promise对象，然后调用对象的then方法，分别定义resolve和reject函数。这里resolve和reject比较简单，就是把传来的参数加一个前缀然后打印输出。

这里我们需要注意，当运行 p=new Promise(fn)这条语句的时候，fn函数就已经在执行了，然而，p.then这个方法是在后面才定义了resolve和reject，那么为何fn函数能够知道resolve和reject函数是什么呢？

换句话说，resolve和reject函数是如何回到过去，出现在先执行的fn函数当中的呢？这是Promise当中最重要的一个概念之一。

其实想要实现这个“黑科技”，方法也非常简单,主要运用的就是setTimeout这个方法，来延迟fn当中resolve和reject的执行。利用这个思路，我们可以初步写出一个自己的初级版Promise,这里我们命名为MyPromise:

```javascript
function MyPromise(fn) {
  this.value;
  this.resolveFunc = function() {};
  this.rejectFunc = function() {};
  fn(this.resolve.bind(this), this.reject.bind(this));
}

MyPromise.prototype.resolve = function(val) {
  var self = this;
  self.value=val;
  setTimeout(function() {
    self.resolveFunc(self.value);
  }, 0);
}

MyPromise.prototype.reject = function(val) {
  var self=this;
  self.value=val;
  setTimeout(function() {
    self.rejectFunc(self.value);
  }, 0);
}

MyPromise.prototype.then = function(resolveFunc, rejectFunc) {
  this.resolveFunc = resolveFunc;
  this.rejectFunc = rejectFunc;
}

var fn=function(resolve, reject){
  console.log('begin to execute!');
  var number=Math.random();
  if(number<=0.5){
    resolve('less than 0.5');
  }else{
    reject('greater than 0.5');
  }
}

var p = new MyPromise(fn);
p.then(function(data) {
  console.log('resolve: ', data);
}, function(data) {
  console.log('reject: ', data);
});
```

可以看出, MyPromise接收fn函数，并将自己的this.resolve和this.reject方法作为fn的resolve和reject参数传给fn并执行。而我们观察MyPromise的resolve方法，便可以发现，其主要操作，就是使用setTimeout，延迟0秒执行resolveFunc。

而再来观察then方法，可以看到，这里比较简单，就是接受两个函数，并分别赋给自身的this.resolveFunc和this.rejectFunc。

这里逻辑就很清楚了，虽然fn函数首先执行，但是由于在调用resolve和reject的时候，使用了setTimeout。虽然是延迟0秒执行，但是我们知道js是单线程+消息队列，必须等主线程代码执行完毕才能开始执行消息队列当中的代码。因此，会首先执行then这个方法，给resolveFunc和rejectFunc赋值。then执行完毕后，再执行setTimeout里面的方法，这个时候，resolveFunc和rejectFunc已经被赋值了，所以就可以顺利执行。这就是“回到过去”的奥秘所在。

### 2. 加入状态: pending, resolved, rejected

上一节，初步实现了看起来似乎能够运行的MyPromise，但是问题很多。我们看一下下面代码：

```javascript
var fn=function(resolve, reject){
  resolve('hello');
  reject('hello again');
}

var p1=new Promise(fn);
p1.then(function(data){
  console.log('resolve: ',data)
}, function(data){
  console.log('reject: ',data)
});
//'resolve: hello'

var p2=new MyPromise(fn);
p2.then(function(data){
  console.log('resolve: ',data)
}, function(data){
  console.log('reject: ',data)
});
//'resolve: hello '
//'reject: hello again'
```

p1是原生Promise，p2是我们自己写的，可以看出，当调用resolve之后再调用reject，p1只会执行resolve，我们的则是两个都执行。事实上在Promise规范当中，规定Promise只能从初始pending状态变到resolved或者rejected状态，是单向变化的，也就是说执行了resolve就不会再执行reject，反之亦然。

为此，我们需要在MyPromise中加入状态，并在必要的地方进行判断，防止重复执行：

```javascript
function MyPromise(fn) {
  this.value;
  this.status = 'pending';
  this.resolveFunc = function() {};
  this.rejectFunc = function() {};
  fn(this.resolve.bind(this), this.reject.bind(this));
}

MyPromise.prototype.resolve = function(val) {
  var self = this;
  if (this.status == 'pending') {
    this.status = 'resolved';
    this.value=val;
    setTimeout(function() {
      self.resolveFunc(self.value);
    }, 0);
  }
}

MyPromise.prototype.reject = function(val) {
  var self = this;
  if (this.status == 'pending') {
    this.status = 'rejected';
    this.value=val;
    setTimeout(function() {
      self.rejectFunc(self.value);
    }, 0);
  }
}

MyPromise.prototype.then = function(resolveFunc, rejectFunc) {
  this.resolveFunc = resolveFunc;
  this.rejectFunc = rejectFunc;
}
```

这样，再次运行上面的实例，就不会出现resolve和reject都执行的情况了。


### 3.  链式调用

在Promise的使用中，我们一定注意到，是可以链式调用的:

```javascript
var fn=function(resolve, reject){
  resolve('hello');
}

var p1=new Promise(fn);
p1.then(function(data){
  console.log(data);
  return 'hello again';
}).then(function(data){
  console.log(data);
});
//'hello'
//'hello again'
```

很显然，要实现链式调用，then方法的返回值也必须是一个Promise对象，这样才能再次在后面调用then。因此我们修改MyPromise的then方法:

```javascript
MyPromise.prototype.then = function(resolveFunc, rejectFunc) {
  var self = this;
  return new MyPromise(function(resolve_next, reject_next) {
    function resolveFuncWrap() {
      var result = resolveFunc(self.value);
      resolve_next(result);
    }
    function rejectFuncWrap() {
      var result = rejectFunc(self.value);
      resolve_next(result);
    }

    self.resolveFunc = resolveFuncWrap;
    self.rejectFunc = rejectFuncWrap;
  })
}
```

这里可以看出，then返回了一个MyPromise对象。在这个MyPromise当中，包裹了一个函数，这个函数会立即执行，主要做的事情，就是对resolveFunc和rejectFunc进行封装，然后再赋值给前一个MyPromise的resolveFunc和rejectFunc。这里难点是看懂封装的目的。

这里以上面一个例子来说明。在上面的链式调用例子中，出现了两个Promise，第一个是我们通过new Promise显式定义的，我们叫它Promise 1,而第二个Promise，是Promise 1的then方法返回的一个新的，我们叫它Promise 2 。在Promise 1的resolve方法执行之后，resolve的返回值，会传递给Promise 2的resolve作为参数，这也是为什么上面第二个then中打印出了第一个then返回的字符串。

而我们封装的目的，就是为了让Promise 1的resolve或者reject在执行后，将其返回值传递给Promise 2的resolve。在我们自己的实现中，Promise 2的resolve我们命名为resolve_next，在Promise 1的resolveFunc执行之后，我们拿到返回值result，然后调用resolve_next(result)，传递参数给Promise 2的resolve。这里值得注意的是，无论Promise 1执行的是resolveFunc还是rejectFunc，其之后调用的，都是Promise 2的resolve，至于Promise 2的reject用来干嘛，在下面的章节里面我们会详细描述。

至此，我们的MyPromise看起来就可以使用链式调用了。

然而我们再回去观察Promise规范，会发现链式调用的情况也分两种。一种情况下，前一个Promise的resolve或者reject的返回值是普通的对象，这种情况下我们目前的MyPromise可以正确处理。但还有一种情况，就是前一个Promise的resolve或者reject执行后，返回的值本身又是一个Promise对象，举个例子：

```javascript
var fn=function(resolve, reject){
  resolve('hello');
}

var p1=new Promise(fn);
p1.then(function(data){
  console.log(data);
  return 'hello again';
}).then(function(data){
  console.log(data);
  return new Promise(function(resolve){
    var innerData='hello third time!';
    resolve(innerData);
  })
}).then(function(data){
  console.log(data);
});
//'hello'
//'hello again'
//'hello third time!'
```

在这个例子当中出现了两次链式调用，第一个then返回的是一个'hello again'字符串，在第二个then的resolve中会打印处理。然后我们注意第二个then当中，返回的是一个Promise对象，调用了resolve。那么问题来了，这个resolve哪里来呢？答案就是在第三个then当中定义！这个例子中第三个then定义的resolve也比较简单，就是直接打印传给resolve的参数。

因此，这里我们的MyPromise也需要修改，针对前一个resolve或者reject的返回值做判断，看是不是Promise对象，如果是，就做不同的处理，修改的代码如下：

```javascript
MyPromise.prototype.then = function(resolveFunc, rejectFunc) {
  var self = this;
  return new MyPromise(function(resolve_next, reject_next) {
    function resolveFuncWrap() {
      var result = resolveFunc(self.value);
      if (result && typeof result.then === 'function') {
        //如果result是MyPromise对象，则通过then将resolve_next和reject_next传给它
        result.then(resolve_next, reject_next);
      } else {
        //如果result是其他对象，则作为参数传给resolve_next
        resolve_next(result);
      }
    }
    function rejectFuncWrap() {
      var result = rejectFunc(self.value);
      if (result && typeof result.then === 'function') {
        //如果result是MyPromise对象，则通过then将resolve_next和reject_next传给它
        result.then(resolve_next, reject_next);
      } else {
        //如果result是其他对象，则作为参数传给resolve_next
        resolve_next(result);
      }
    }
    self.resolveFunc = resolveFuncWrap;
    self.rejectFunc = rejectFuncWrap;
  })
}
```

可以看到在代码中，对于resolveFunc或者rejectFunc的返回值,我们会判断是否含有.then方法，如果含有，就认为是一个MyPromise对象，从而调用该MyPromise的then方法，将resolve_next和reject_next传给它。否则，正常对象，result就作为参数传给resolve_next。

这样修改之后，我们的MyPromise就可以在链式调用中正确的处理普通对象和MyPromise对象了。

如此，在这篇文章中，我们就首先实现了Promise的常用基本功能，主要是then的调用，状态的控制，以及链式调用。而在后面的文章中，还会进一步讲解如何实现Promise的错误捕获处理等等(比如Promise当中的.catch方法原理)，从而让我们的MyPromise真正健壮和可用！
