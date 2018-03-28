---
layout: article
title: 从头实现一个koa框架
category: [javascript, 后端开发]
---

koajs是最流行的nodejs后端框架之一，有很多网站都使用koa进行开发，同时社区也涌现出了一大批基于koa封装的企业级框架。然而，在这些亮眼的成绩背后，作为核心引擎的koa代码库本身，却非常的精简，不得不让人惊叹于其巧妙的设计。

在平时的工作开发中，笔者是koa的重度用户，因此对其背后的原理自然也是非常感兴趣，因此在闲暇之余进行了研究。不过本篇文章，并不是源码分析，而是从相反的角度，向大家展示如何从头开发实现一个koa框架，在这个过程中，koa中最重要的几个概念和原理都会得到展现。相信大家在看完本文之后，会对koa有一个更深入的理解，同时在阅读本文之后再去阅读koa源码，思路也将非常的顺畅。

首先放出笔者实现的这个koa框架代码库地址：[simpleKoa](https://github.com/mly-zju/simpleKoa)

需要说明的是，本文实现的koa是koa 2版本，也就是基于async/await的，因此需要node版本在7.6以上。如果读者的node版本较低，建议升级，或者安装babel-cli，利用其中的babel-node来运行例子。

## 四条主线

笔者认为，理解koa，主要需要搞懂四条主线，其实也是实现koa的四个步骤，分别是

1. 封装node http Server
2. 构造resquest, response, context对象
3. 中间件机制
4. 错误处理

下面就一一进行分析。

## 主线一：封装node http Server: 从hello world说起

首先，不考虑框架，如果使用原生http模块来实现一个返回hello world的后端app，代码如下：

```javascript
let http = require('http');

let server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world');
});

server.listen(3000, () => {
    console.log('listenning on 3000');
});
```

实现koa的第一步，就是对这个原生的过程进行封装，为此，我们首先创建application.js实现一个Application对象：

```javascript
// application.js
let http = require('http');

class Application {

    /**
     * 构造函数
     */
    constructor() {
        this.callbackFunc;
    }

    /**
     * 开启http server并传入callback
     */
    listen(...args) {
        let server = http.createServer(this.callback());
        server.listen(...args);
    }

    /**
     * 挂载回调函数
     * @param {Function} fn 回调处理函数
     */
    use(fn) {
        this.callbackFunc = fn;
    }

    /**
     * 获取http server所需的callback函数
     * @return {Function} fn
     */
    callback() {
        return (req, res) => {
            this.callbackFunc(req, res);
        };
    }

}

module.exports = Application;
```

然后创建example.js:

```javascript
let simpleKoa = require('./application');
let app = new simpleKoa();

app.use((req, res) => {
    res.writeHead(200);
    res.end('hello world');
});

app.listen(3000, () => {
    console.log('listening on 3000');
});
```

可以看到，我们已经初步完成了对于http server的封装，主要实现了`app.use`注册回调函数，`app.listen`语法糖开启server并传入回调函数了，典型的koa风格。

但是美中不足的是，我们传入的回调函数，参数依然使用的是`req`和`res`，也就是node原生的request和response对象，这些原生对象和api提供的方法不够便捷，不符合一个框架需要提供的易用性。因此，我们需要进入第二条主线了。

## 主线二：构造request, response, context对象

如果阅读koa文档，会发现koa有三个重要的对象，分别是request, response, context。其中request是对node原生的`request`的封装，response是对node原生`response`对象的封装，`context`对象则是回调函数上下文对象，挂载了koa request和response对象。下面我们一一来说明。

首先要明确的是，对于koa的request和response对象，只是提供了对node原生request和response对象的一些方法的封装，明确了这一点，我们的思路是，使用js的getter和setter属性，基于node的对象req/res对象封装koa的request/response对象。

规划一下我们要封装哪些易用的方法。这里在文章中为了易懂，姑且只实现以下方法：

对于simpleKoa request对象，实现`query`读取方法，能够读取到url中的参数，返回一个对象。

对于simpleKoa response对象，实现`status`读写方法，分别是读取和设置http response的状态码，以及`body`方法，用于构造返回信息。

而simpleKoa context对象，则挂载了request和response对象，并对一些常用方法进行了代理。

首先创建request.js:

```javascript
// request.js
let url = require('url');

module.exports = {

    get query() {
        return url.parse(this.req.url, true).query;
    }

};
```

很简单，就是导出了一个对象，其中包含了一个query的读取方法，通过`url.parse`方法解析url中的参数，并以对象的形式返回。需要注意的是，代码中的`this.req`代表的是node的原生request对象，`this.req.url`就是node原生request中获取url的方法。稍后我们修改application.js的时候，会为koa的request对象挂载这个req。

然后创建response.js:

```javascript
// response.js
module.exports = {

    get body() {
        return this._body;
    },

    /**
     * 设置返回给客户端的body内容
     *
     * @param {mixed} data body内容
     */
    set body(data) {
        this._body = data;
    },

    get status() {
        return this.res.statusCode;
    },

    /**
     * 设置返回给客户端的stausCode
     *
     * @param {number} statusCode 状态码
     */
    set status(statusCode) {
        if (typeof statusCode !== 'number') {
            throw new Error('statusCode must be a number!');
        }
        this.res.statusCode = statusCode;
    }

};
```

也很简单。`status`读写方法分别设置或读取`this.res.statusCode`。同样的，这个`this.res`是挂载的node原生response对象。而`body`读写方法分别设置、读取一个名为`this._body`的属性。这里设置body的时候并没有直接调用`this.res.end`来返回信息，这是考虑到koa当中我们可能会多次调用response的body方法覆盖性设置数据。真正的返回消息操作会在application.js中存在。

然后我们创建context.js文件，构造context对象的原型：

```javascript
// context.js
module.exports = {

    get query() {
        return this.request.query;
    },

    get body() {
        return this.response.body;
    },

    set body(data) {
        this.response.body = data;
    },

    get status() {
        return this.response.status;
    },

    set status(statusCode) {
        this.response.status = statusCode;
    }

};
```

可以看到主要是做一些常用方法的代理，通过`context.query`直接代理了`context.request.query`，`context.body`和`context.status`代理了`context.response.body`与`context.response.status`。而`context.request`，`context.response`则会在application.js中挂载。

由于context对象定义比较简单并且规范，当实现更多代理方法时候，这样一个一个通过声明的方式显然有点笨，js中，设置setter/getter，可以通过对象的`__defineSetter__`和`__defineSetter__`来实现。为此，我们精简了上面的context.js实现方法，精简版本如下：

```javascript
let proto = {};

// 为proto名为property的属性设置setter
function delegateSet(property, name) {
    proto.__defineSetter__(name, function (val) {
        this[property][name] = val;
    });
}

// 为proto名为property的属性设置getter
function delegateGet(property, name) {
    proto.__defineGetter__(name, function () {
        return this[property][name];
    });
}

// 定义request中要代理的setter和getter
let requestSet = [];
let requestGet = ['query'];

// 定义response中要代理的setter和getter
let responseSet = ['body', 'status'];
let responseGet = responseSet;

requestSet.forEach(ele => {
    delegateSet('request', ele);
});

requestGet.forEach(ele => {
    delegateGet('request', ele);
});

responseSet.forEach(ele => {
    delegateSet('response', ele);
});

responseGet.forEach(ele => {
    delegateGet('response', ele);
});

module.exports = proto;
```

这样，当我们希望代理更多request和response方法的时候，可以直接向requestGet/requestSet/responseGet/responseSet数组中添加method的名称即可（前提是在request和response中实现了）。

最后让我们来修改application.js，基于刚才的3个对象原型来创建request, response, context对象：

```javascript
// application.js
let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');

class Application {

    /**
     * 构造函数
     */
    constructor() {
        this.callbackFunc;
        this.context = context;
        this.request = request;
        this.response = response;
    }

    /**
     * 开启http server并传入callback
     */
    listen(...args) {
        let server = http.createServer(this.callback());
        server.listen(...args);
    }

    /**
     * 挂载回调函数
     * @param {Function} fn 回调处理函数
     */
    use(fn) {
        this.callbackFunc = fn;
    }

    /**
     * 获取http server所需的callback函数
     * @return {Function} fn
     */
    callback() {
        return (req, res) => {
            let ctx = this.createContext(req, res);
            let respond = () => this.responseBody(ctx);
            this.callbackFunc(ctx).then(respond);
        };
    }

    /**
     * 构造ctx
     * @param {Object} req node req实例
     * @param {Object} res node res实例
     * @return {Object} ctx实例
     */
    createContext(req, res) {
        // 针对每个请求，都要创建ctx对象
        let ctx = Object.create(this.context);
        ctx.request = Object.create(this.request);
        ctx.response = Object.create(this.response);
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }

    /**
     * 对客户端消息进行回复
     * @param {Object} ctx ctx实例
     */
    responseBody(ctx) {
        let content = ctx.body;
        if (typeof content === 'string') {
            ctx.res.end(content);
        }
        else if (typeof content === 'object') {
            ctx.res.end(JSON.stringify(content));
        }
    }

}
```

可以看到，最主要的是增加了createContext方法，基于我们之前创建的`context` 为原型，使用`Object.create(this.context)`方法创建了`ctx`，并同样通过`Object.create(this.request)`和`Object.create(this.response)`创建了request/response对象并挂在到了`ctx`对象上面。此外，还将原生node的req/res对象挂载到了`ctx.request.req/ctx.req`和`ctx.response.res/ctx.res`对象上。

回过头去看我们之前的`context/request/response.js`文件，就能知道当时使用的`this.res`或者`this.response`之类的是从哪里来的了，原来是在这个createContext方法中挂载到了对应的实例上。一张图来说明其中的关系：

构建了运行时上下文`ctx`之后，我们的`app.use`回调函数参数就都基于`ctx`了。

下面一张图描述了ctx对象的结构和继承关系：
![context]({{site.baseurl}}/img/201803/context.png)

最后回忆我们的`ctx.body`方法，并没有直接返回消息体，而是将消息存储在了一个变量属性中。为了每次回调函数处理结束之后返回消息，我们创建了`responseBody`方法，主要作用就是通过`ctx.body`读取存储的消息，然后调用`ctx.res.end`返回消息并关闭连接。从方法中知道，我们的body消息体可以是字符串，也可以是对象（会序列化为字符串返回）。注意这个方法的调用是在回调函数结束之后调用的，而我们的回调函数是一个async函数，其执行结束后会返回一个Promise对象，因此我们只需要在其后通过`.then`方法调用我们的responseBody即可，这就是`this.callbackFunc(ctx).then(respond)`的意义。

然后我们来测试一下目前为止的框架。修改example.js如下：

```javascript
let simpleKoa = require('./application');
let app = new simpleKoa();

app.use(async ctx => {
    ctx.body = 'hello ' + ctx.query.name;
});

app.listen(3000, () => {
    console.log('listening on 3000');
});
```

可以看到这个时候我们通过`app.use`传入的已经不再是原生的`function (req, res)`回调函数，而是koa2中的async函数，接收ctx作为参数。为了测试，在浏览器访问`localhost:3000?name=tom`，可以看到返回了'hello tom'，符合预期。

这里再插入分析一个知识概念。从刚才的实现中，我们知道了`this.context`是我们的中间件中上下文`ctx`对象的原型。因此在实际开发中，我们可以将一些常用的方法挂载到`this.context`上面，这样，在中间件`ctx`中，我们也可以方便的使用这些方法了，这个概念就叫做ctx的扩展，一个例子是阿里的egg.js框架已经把这个扩展机制作为一部分，融入到了框架开发中。

下面就展示一个例子，我们写一个`echoData`的方法作为扩展，传入errno, data, errmsg，能够给客户端返回结构化的消息结果：

```javascript
let SimpleKoa = require('./application');
let app = new SimpleKoa();

// 对ctx进行扩展
app.context.echoData = function (errno = 0, data = null, errmsg = '') {
    this.res.setHeader('Content-Type', 'application/json;charset=utf-8');
    this.body = {
        errno: errno,
        data: data,
        errmsg: errmsg
    };
};

app.use(async ctx => {
    let data = {
        name: 'tom',
        age: 16,
        sex: 'male'
    }
    // 这里使用扩展，方便的返回utf-8格式编码，带有errno和errmsg的消息体
    ctx.echoData(0, data, 'success');
});

app.listen(3000, () => {
    console.log('listenning on 3000');
});
```

## 主线三：中间件机制

到目前为止，我们成功封装了http server，并构造了context, request, response对象。但最重要的一条主线却还没有实现，那就是koa的中间件机制。

关于koa的中间件洋葱执行模型，koa 1中使用的是generator + co.js执行的方式，koa 2中则使用了async/await。关于koa 1中的中间件原理，我曾写过一篇文章进行解释，请移步：[深入探析koa之中间件流程控制篇](https://github.com/mly-zju/blog/issues/5)

这里我们实现的是基于koa 2的，因此再描述一下原理。为了便于理解，假设我们有3个async函数:

```javascript
async function m1(next) {
    console.log('m1');
    await next();
}

async function m2(next) {
    console.log('m2');
    await next();
}

async function m3() {
    console.log('m3');
}
```

我们希望能够构造出一个函数，实现的效果是让三个函数依次执行。首先考虑想让m2执行完毕后，`await next()`去执行m3函数，那么显然，需要构造一个next函数，作用是调用m3，然后作为参数传给m2

```javascript
let next1 = async function () {
    await m3();
}

m2(next1);

// 输出：m2,m3
```

进一步，考虑从m1开始执行，那么，m1的next参数需要是一个执行m2的函数，并且给m2传入的参数是m3,下面来模拟：

```javascript
let next1 = async function () {
    await m3();
}

let next2 = async function () {
    await m2(next1);
}

m1(next2);

// 输出：m1,m2,m3
```

那么对于n个async函数，希望他们按顺序依次执行呢？可以看到，产生nextn的过程能够抽象为一个函数：

```javascript
function createNext(middleware, oldNext) {
    return async function () {
        await middleware(oldNext);
    }
}

let next1 = createNext(m3, null);
let next2 = createNext(m2, next1);
let next3 = createNext(m1, next2);

next3();

// 输出m1, m2, m3
```

进一步精简：

```javascript
let middlewares = [m1, m2, m3];
let len = middlewares.length;

// 最后一个中间件的next设置为一个立即resolve的promise函数
let next = async function () {
    return Promise.resolve();
}
for (let i = len - 1; i >= 0; i--) {
    next = createNext(middlewares[i], next);
}

next();

// 输出m1, m2, m3
```

至此，我们也有了koa中间件机制实现的思路，新的application.js如下：

```javascript
/**
 * @file simpleKoa application对象
 */
let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('.//response');

class Application {

    /**
     * 构造函数
     */
    constructor() {
        this.middlewares = [];
        this.context = context;
        this.request = request;
        this.response = response;
    }

    // ...省略中间 

    /**
     * 中间件挂载
     * @param {Function} middleware 中间件函数
     */
    use(middleware) {
        this.middlewares.push(middleware);
    }

    /**
     * 中间件合并方法，将中间件数组合并为一个中间件
     * @return {Function}
     */
    compose() {
        // 将middlewares合并为一个函数，该函数接收一个ctx对象
        return async ctx => {

            function createNext(middleware, oldNext) {
                return async () => {
                    await middleware(ctx, oldNext);
                }
            }

            let len = this.middlewares.length;
            let next = async () => {
                return Promise.resolve();
            };
            for (let i = len - 1; i >= 0; i--) {
                let currentMiddleware = this.middlewares[i];
                next = createNext(currentMiddleware, next);
            }

            await next();
        };
    }

    /**
     * 获取http server所需的callback函数
     * @return {Function} fn
     */
    callback() {
        return (req, res) => {
            let ctx = this.createContext(req, res);
            let respond = () => this.responseBody(ctx);
            let fn = this.compose();
            return fn(ctx).then(respond);
        };
    }

    // ...省略后面 

}

module.exports = Application;


```

可以看到，首先对`app.use`进行改造了，每次调用`app.use`，就向`this.middlewares`中push一个回调函数。然后增加了一个compose()方法，利用我们前文分析的原理，对middlewares数组中的函数进行组装，返回一个最终的函数。最后，在callback()方法中，调用compose()得到最终回调函数，并执行。

改写example.js验证一下中间件机制：

```javascript
let simpleKoa = require('./application');
let app = new simpleKoa();

let responseData = {};

app.use(async (ctx, next) => {
    responseData.name = 'tom';
    await next();
    ctx.body = responseData;
});

app.use(async (ctx, next) => {
    responseData.age = 16;
    await next();
});

app.use(async ctx => {
    responseData.sex = 'male';
});

app.listen(3000, () => {
    console.log('listening on 3000');
});

// 返回{ name: "tom", age: 16, sex: "male"}
```

例子中一共三个中间件，分别对responseData增加了name, age, sex属性，最后返回该数据。

至此，一个koa框架基本已经浮出水面了，不过我们还需要进行最后一个主线的分析：错误处理。

### 主线四：错误处理

一个健壮的框架，必须保证在发生错误的时候，能够捕获错误并有降级方案返回给客户端。但显然现在我们的框架还做不到这一点，假设我们修改一下例子，我们的中间件中，有一个发生错误抛出了异常：

```javascript
let simpleKoa = require('./application');
let app = new simpleKoa();

let responseData = {};
app.use(async (ctx, next) => {
    responseData.name = 'tom';
    await next();
    ctx.body = responseData;
});

app.use(async (ctx, next) => {
    responseData.age = 16;
    await next();
});

app.use(async ctx => {
    responseData.sex = 'male';
    // 这里发生了错误，抛出了异常
    throw new Error('oooops');
});

app.listen(3000, () => {
    console.log('listening on 3000');
});
```

这个时候访问浏览器，是得不到任何响应的，这是因为异常并没有被我们的框架捕获并进行降级处理。回顾我们application.js中的中间件执行代码：

```javascript
// application.js
// ...
    callback() {
        return (req, res) => {
            let ctx = this.createContext(req, res);
            let respond = () => this.responseBody(ctx);
            let fn = this.compose();
            return fn(ctx).then(respond);
        };
    }
// ...
```

其中我们知道，fn是一个async函数，执行后返回一个promise，回想promise的错误处理是怎样的？没错，我们只需要定义一个onerror函数，里面进行错误发生时候的降级处理，然后在promise的catch方法中引用这个函数即可。

于此同时，回顾koa框架，我们知道在错误发生的时候，app对象可以通过`app.on('error', callback)`订阅错误事件，这有助于我们几种处理错误，比如打印日志之类的操作。为此，我们也要对Application对象进行改造，让其继承nodejs中的events对象，然后在onerror方法中emit错误事件。改造后的application.js如下：

```javascript
/**
 * @file simpleKoa application对象
 */

let EventEmitter = require('events');
let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');

class Application extends EventEmitter {

    /**
     * 构造函数
     */
    constructor() {
        super();
        this.middlewares = [];
        this.context = context;
        this.request = request;
        this.response = response;
    }

    // ...

    /**
     * 获取http server所需的callback函数
     * @return {Function} fn
     */
    callback() {
        return (req, res) => {
            let ctx = this.createContext(req, res);
            let respond = () => this.responseBody(ctx);
            let onerror = (err) => this.onerror(err, ctx);
            let fn = this.compose();
            // 在这里catch异常，调用onerror方法处理异常
            return fn(ctx).then(respond).catch(onerror);
        };
    }

    // ... 

    /**
     * 错误处理
     * @param {Object} err Error对象
     * @param {Object} ctx ctx实例
     */
    onerror(err, ctx) {
        if (err.code === 'ENOENT') {
            ctx.status = 404;
        }
        else {
            ctx.status = 500;
        }
        let msg = err.message || 'Internal error';
        ctx.res.end(msg);
        // 触发error事件
        this.emit('error', err);
    }

}

module.exports = Application;
```

可以看到，onerror方法的对异常的处理主要是获取异常状态码，当err.code为'ENOENT'的时候，返回的消息头设置为404，否则默认设置为500，然后消息体设置为err.message，如果异常中message属性为空，则默认消息体设置为'Internal error'。此后调用`ctx.res.end`返回消息，这样就能保证即使异常情况下，客户端也能收到返回值。最后通过`this.emit`出发error事件。

然后我们写一个example来验证错误处理：

```javascript
let simpleKoa = require('./application');
let app = new simpleKoa();

app.use(async ctx => {
    throw new Error('ooops');
});

app.on('error', (err) => {
    console.log(err.stack);
});

app.listen(3000, () => {
    console.log('listening on 3000');
});
```

浏览器访问'localhost:3000'的时候，得到返回'ooops'，同时http状态码为500 。同时app.on('error')订阅到了异常事件，在回调函数中打印出了错误栈信息。

关于错误处理，这里多说一点。虽然koa中内置了错误处理机制，但是实际业务开发中，我们往往希望能够自定义错误处理方式，这个时候，比较好的办法是在最开头增加一个错误捕获中间件，然后根据错误进行定制化的处理，比如：

```javascript
// 错误处理中间件
app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        // 在这里进行定制化的错误处理
    }
});
// ...其他中间件
```

至此，我们就完整实现了一个轻量版的koa框架。

## 结语

完整的simpleKoa代码库地址为：[simpleKoa](https://github.com/mly-zju/simpleKoa)，里面还附带了一些example。

理解了这个轻量版koa的实现原理，读者还可以去看看koa的源码，会发现机制和我们实现的框架是非常类似的，无非是多了一些细节，比如说，完整koa的context/request/response方法上面挂载了更多好用的method，或者很多方法中容错处理更好等等。具体在本文中就不展开讲了，留给感兴趣的读者去探索吧~。
