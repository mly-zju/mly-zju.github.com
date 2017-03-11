---
layout: article
title: Web前端实现瀑布流效果页面
category: [javascript,作品demo]
---
一个实现了图片瀑布流效果的Web页面。<!--more-->

页面的主要结构很简单，每一个img都包含在一个div中，宽度设置为相同大小，每个div都是使用了absolute绝对定位，同时对于最外层的div进行relative定位。最后，在图片载入过程中，使用javascript按照一定规律对图片的位置进行分配，主要分配图片的top以及left。

页面地址请移步这里：[瀑布流](http://7xovdy.com1.z0.glb.clouddn.com/mine_waterfall/index_random.html)
