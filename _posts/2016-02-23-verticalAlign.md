---
layout: article
title: 总结html中垂直居中的方案
category: html/css
---
上一篇讲了水平居中方案，这一篇再来总结一下垂直居中的方法。<!--more-->

垂直居中，主要分为希望文本垂直居中，以及希望html元素垂直居中(不管是块状还是行内).

### 一：文本的垂直居中

####  1.单行文本垂直居中

这个应该不用说了吧！再熟悉不过了，也就是在父元素中通过设置line-height和height一样即可实现！

####  2.多行文本垂直居中

这个主要是使用table-cell这个方法中的vertical-align:middle来设置。下面来看一个例子。

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
        display:table;
    }
    .in{
        background-color:black;
        color:white;
        display:table-cell;
        vertical-align:middle;
    }
</style>
</head>
<body>
    <div class='out'>
        <div class='in'>我是多行文本，我要垂直居中啊啊啊啊啊！</div>
    </div>
</body>
</html>
{% endhighlight %}

效果如下图：

![img]({{ site.baseurl }}/img/201602/v1.png)

注意到此时在display为table的父元素中，display为table-cell的子元素是充满父元素的，设置width和height没有用。

此外这个属性的不兼容ie6，因此在ie6中，可以考虑将文本放在某个div中，然后使用下面将提到的方法将div居中即可(该div本身没有设置height，可以自适应文本)。

### 二：dom元素的垂直居中

对于dom元素的居中(不论块状还是行内元素)，都可以使用上一篇提到的水平居中的通用方法，大同小异，第一种，position设定absolute,设置top:50%加上margin-top:-width/2。第二种，position设置absolute，top:0,bottom:0,margin:auto即可。

当然最后还是不要忘记万能的flex布局！上一篇当中也提到了。
