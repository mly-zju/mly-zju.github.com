---
layout: article
title: 总结html中水平居中的方案
category: html/css
---
算一算搞前端开发也有一段时间了，也是踩过了不少的坑<!--more-->，然而由于自己懒还是怎么样子，每次都是遇到问题解决问题，解决过后就忘记，一直没有做过系统的总结。这是一个不好的习惯，所以改变这个习惯，从今天开始！因此这篇文章，首先总结一下开发过程中遇到的需要水平居中的方案。

水平居中是比较常用的，但是实际应用中经常会有些让我混淆的东西。后来想了想，造成这些混淆，主要是因为元素有块级元素和行内元素。因此，只要区分清楚这两种情况下的水平居中方案，基本就可以对水平居中有个很清晰的认识了。

### 一：块级元素的水平居中

对于块级元素(block)，可以使用margin:0 auto来实现在父元素下面的水平居中。但是需要注意，该方法对于行内元素(inline或者inline-block)是无效的。下面看一个例子。

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>test</title>
<style>
    .out{
        height:100px;
        width:200px;
        background-color:red;
    }
    .in{
        height:70px;
        width:100px;
        background-color:black;
        margin:0 auto;
    }
    .out2{
        height:100px;
        width:200px;
        background-color:red;
    }
    .in2{
        height:70px;
        width:100px;
        background-color:black;
        margin:0 auto;
    }
</style>
</head>
<body>
    <div class='out'>
        <div class='in'></div>
    </div>
    <br/>
    <div class='out2'>
        <input class='in2'/>
    </div>
</body>
</html>
{% endhighlight %}

效果如下图：

![img]({{ site.baseurl }}/img/201602/1.png)

其中input由于是inline-block的，因此margin auto不起作用，无法水平居中。对其他inline-block或者inline的元素比如button,img,a,span也是不起作用的。

### 二：行内元素的水平居中

对于行内元素水平居中，可以通过给父级元素加上text-align:center的属性即可。这个属性不但可以居中内部的文本，还可以居中内部的行内元素。但是该属性对于块级元素是不起作用的。来看下面的一个例子:

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>test</title>
<style>
    .out{
        height:100px;
        width:200px;
        background-color:red;
        text-align:center;
    }
    .in{
        height:70px;
        width:100px;
        background-color:black;
    }
    .out2{
        height:100px;
        width:200px;
        background-color:red;
        text-align:center;
    }
    .in2{
        height:70px;
        width:100px;
        background-color:black;
    }
</style>
</head>
<body>
    <div class='out'>
        <div class='in'></div>
    </div>
    <br/>
    <div class='out2'>
        <input class='in2'/>
    </div>
</body>
</html>
{% endhighlight %}

效果如下图:

![img]({{ site.baseurl }}/img/201602/2.png)

可以看出这次结果反过来了，block元素不会居中，而inline元素则可以居中。事实上text-align经常用于文本居中，对于inline元素也适用。

### 三：通用的水平居中方案

刚才的两种方案分别适用与块级元素和行内元素。那么有没有其他方案可以通用呢？也是有的。第一种是position设置为relative或者absolute(设置为absolute时候要确保父元素也是定位的)，可以使用left+margin相配合的方法，即left:50%加上margin-left:-width/2这种方案。代码如下：

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>test</title>
<style>
    .out{
        height:100px;
        width:200px;
        background-color:red;
    }
    .in{
        height:70px;
        width:100px;
        background-color:black;
        position:relative;
        left:50%;
        margin-left:-50px;
    }
    .out2{
        height:100px;
        width:200px;
        background-color:red;
    }
    .in2{
        height:70px;
        width:100px;
        background-color:black;
        position:relative;
        left:50%;
        margin-left:-50px;
    }
</style>
</head>
<body>
    <div class='out'>
        <div class='in'></div>
    </div>
    <br/>
    <div class='out2'>
        <input class='in2'/>
    </div>
</body>
</html>
{% endhighlight %}

效果如下图:

![img]({{ site.baseurl }}/img/201602/3.png)

可以看出这种方法对于block和inline-block都是有效的。

第二种方法是将子元素position设定为absolute（此时父元素需要也是定位的），然后设置left:0,right:0，然后设置margin auto即可。代码如下：

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>test</title>
<style>
    .out{
        height:100px;
        width:200px;
        background-color:red;
        position:relative;
    }
    .in{
        height:70px;
        width:100px;
        background-color:black;
        position:absolute;
        left:0;
        right:0;
        margin:auto;
    }
    .out2{
        height:100px;
        width:200px;
        background-color:red;
        position:absolute;
    }
    .in2{
        height:70px;
        width:100px;
        background-color:black;
        position:absolute;
        left:0;
        right:0;
        margin:auto;
    }
</style>
</head>
<body>
    <div class='out'>
        <div class='in'></div>
    </div>
    <br/>
    <div class='out2'>
        <input class='in2'/>
    </div>
</body>
</html>
{% endhighlight %}

此时效果也是一样的。这个方法比较简单和灵活，应该记住。值得一提的是，这种方法还可以用于实现垂直居中，关于这个以后我还会写文章记录的。

### 四：文本居中

这个比较简单就不说了，无非是给父元素加上text-align:center.

需要指出的是，以上讨论水平居中都是在父元素宽度确定的情况下，以上方法基本都不需要知道父元素的宽度。但是对于父元素宽度不确定的情况(包裹子元素),不做讨论(只需要设置padding左右相等即可达到“居中”的效果)。

当然，最后不得不提的是还有一个非常强大和万能的方法，就是使用css3中的flex布局！关于flex布局方法，可以看看阮一峰老师的这篇文章，介绍的很详细：[Flex布局教程](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool)
