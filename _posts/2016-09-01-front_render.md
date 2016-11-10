---
layout: article
title: 前端渲染那些事儿
category: [javascript,前端工程化]
---
Ajax的流行让前端异步渲染得到广泛的应用。而笔者在学习前端的过程中，对异步渲染的应用也有一个从模糊到清晰的过程<!--more-->，下面就讲一下自己应用中的感悟。

###	第一阶段：原始阶段

这个时候对于异步渲染的应用还停留在字符串拼接上面。也就是说，通过ajax拿到数据后，使用js将数据同html标签通过字符串的形式组合起来，然后插入对应的展示位置。一个简单的例子如下：

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>test</title>
</head>
<body>
	<div id="wrapper">
	</div>

	<script>
		var mockData={
			title: '你好!',
			content:'这是测试异步渲染的例子'
		};
		var wrapper=document.getElementById('wrapper');
		wrapper.innerHTML='<h2>'+mockData.title+'</h2>'+'<div>'+mockData.content+'</div>';
	</script>
</body>
</html>
{% endhighlight %}

展示的结果：

![img]({{ site.baseurl }}/img/201609/result.jpg)

这种方式对于一些简单的结构呈现还好，但是对于复杂的结构，拼接字符串的过程就会非常的繁琐，不但不直观，而且还很容易出错，并且导致后期代码难以维护。

所以说，这一阶段对于异步渲染的使用很显然还处于原始阶段，为了更优雅更方便的实现，需要进化到进阶阶段。

###	第二阶段：模板字符串的使用

当es6出来的时候，我看到了许多的新特性。其中一个比较让我眼前一亮的特性就是模板字符串的引入。使用模板字符串很简单，同普通字符串相比，只是将引号改成了\`符号。

模板字符串最简单的情况下，和普通字符串没有区别。但是它有一个非常实用的功能，就是字符串插值的特性，也就是说，我们可以在模板字符串中挖一些“坑位”，然后将外部变量赋值给这些坑位，这样就可以实现数据的填充。

利用这个功能，我们可以对上面例子中的异步渲染做一个更优雅的实现，如下图：

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>test</title>
</head>
<body>
	<div id="wrapper">
	</div>

	<script>
		var mockData={
			title: '你好!',
			content:'这是测试异步渲染的例子'
		};
		function render(data, dom){
			template=`<h2>${data.title}</h2>
			<div>${data.content}</div>
			`;
			dom.innerHTML=template;
		}
		var wrapper=document.getElementById('wrapper');
		render(mockData,wrapper);
	</script>
</body>
</html>
{% endhighlight %}

可以看到，上述代码中，我们封装了一个简单的render函数。函数中，template是一个模板字符串，其中有两个坑位：data.title和data.content，当调用的时候，我们只要传入我们从ajax拿到的数据，就可以方便的异步渲染了，最终实现的效果是一模一样的，但是明显更加优雅，少了很多难看的拼装。

然而，虽然模板字符串能够一定程度方便异步渲染，但是对于更加复杂的情况还是无能为力。比如说，我们得到的数据是一个数组，需要每一项都渲染一个&lt;li&gt;，这个时候由于数组是不定项的，或者由于项目数太多，模板字符串写起来也比较麻烦。为此，我们需要更好的前端渲染方法。

###	第三阶段：前端模板引擎

提起模板引擎，可能更多人熟悉的是后端模板引擎。然而，为了解决上述问题，我们可以看出，针对前端开发一套模板引擎来满足异步渲染的需求也是非常必要的。

事实上，已经存在许多成熟的前端模板引擎了，比如非常受欢迎的mustache.js，它的功能非常强大，除了数据坑位，还提供一些控制命令，比如if/else，循环等等。下面就使用该模板引擎来实现上面的异步渲染的例子：

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>test</title>
</head>
<body>
	<div id="wrapper">
	</div>

	//引入模板引擎库
	<script src="//cdn.bootcss.com/mustache.js/2.2.1/mustache.min.js"></script>
	<script>
		//假设该数据是通过ajax从后端拿到的数据
		var mockData={
			my_title: '你好!',
			my_content:'这是测试异步渲染的例子'
		};
		var template='<h2>\{\{title\}\}</h2>\
		<div>\{\{content\}\}</div>';
		var wrapper=document.getElementById('wrapper');
		wrapper.innerHTML=Mustache.render(template,{
			title: mockData.title,
			content: mockData.content
		});
	</script>
</body>
</html>
{% endhighlight %}

当然，除了mustache.js，还有我们淘宝前端非常熟知的xtemplate啦~它的功能也非常强大，在开发中，使用好它，可以帮助我们优雅并且高效的实现前端异步渲染！

此外，关于异步渲染使用模板，还存在前后端同构的问题，很多模板既可以运行在服务端，也可以使用在浏览器端，这样首先在服务端渲染一份，然后浏览器端刷新的时候又可以调用浏览器端的模板，这样解决了首屏渲染速度慢的问题的同时，前后端只需要同样的代码，显得更加的简洁。
