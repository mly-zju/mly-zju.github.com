;
!function($){
  $.fn.extend({
    'jBannerInit':function(options){
      var opts=$.extend({},$.fn.jBannerInit.defaults, options);
      if(opts.interval<1500){
        opts.interval=1500;
      }

      var myCss='<style>\
                .jBanner-wrapper{overflow:hidden;}\
                .jBanner-ctrl{position:absolute;width:100%;height:10px;bottom:15px;text-align:center;z-index:1;}\
                .jBanner-ctrl span{display:inline-block;width:10px;height:10px;border-radius:50%;margin:0 3px 0 3px;background-color:gray;cursor:pointer;}\
                .jBanner-ctrl .jBanner-ctrl-selected{background-color:brown;}\
                .jBanner-content{position:absolute;-webkit-transition:all 0.4s ease-in-out;}\
                .jBanner-fade{opacity:1;}\
                .jBanner-fade-hide{opacity:0;}\
                .jBanner-slide{}\
                .jBanner-slide-hide{-webkit-transform:translate(-'+opts.imgWidth+'px)}\
                .jBanner-box{width:'+Math.ceil(opts.imgWidth/4)+'px;height:'+Math.ceil(opts.imgHeight/4)+'px;}\
                .jBanner-box-hide{-webkit-transform:scale(0,0);}\
                .jBanner-blind,.jBanner-stripe{width:100%;height:'+Math.ceil(opts.imgHeight/4)+'px;}\
                .jBanner-blind-hide{height:0;}\
                .jBanner-stripe-hide-left{-webkit-transform:translate(-'+opts.imgWidth+'px);}\
                .jBanner-stripe-hide-right{-webkit-transform:translate('+opts.imgWidth+'px);}\
                .jBanner-vertical-stripe,.jBanner-vertical-blind{height:100%;width:'+Math.ceil(opts.imgWidth/4)+'px;}\
                .jBanner-vertical-blind-hide{width:0;}\
                .jBanner-vertical-stripe-hide-up{-webkit-transform:translate(0,-'+opts.imgHeight+'px);}\
                .jBanner-vertical-stripe-hide-down{-webkit-transform:translate(0,'+opts.imgHeight+'px);}\
                </style>}'
      $('head').append(myCss);
      var wrapper=$(this);
      var autoIndex=0;
      var picNum=opts.imgURL.length;
      var ctrlBar=$(document.createElement('div'));
      ctrlBar.addClass('jBanner-ctrl');
      for(var i=0;i<picNum;i++){
        ctrlBar.append('<span></span>');
      }
      wrapper.append(ctrlBar);
      var ctrlItems=ctrlBar.find('span');
      ctrlItems.each(function(index,ele){
        ele.index=index;
        if(index==0){
          ele.className='jBanner-ctrl-selected';
        }
      });
      $('.jBanner-content').remove();

      if(opts.mode=='fade'||opts.mode=='slide'){
        var component;
        component=document.createElement('div');
        if(opts.mode=='fade'){
          $(component).addClass('jBanner-content jBanner-fade');
        }else{
          $(component).addClass('jBanner-content jBanner-slide');
        }
        $(component).css({
          'width':'100%',
          'height':'100%',
          'background-image':'url('+opts.imgURL[0]+')',
          'background-size':opts.imgWidth+'px '+opts.imgHeight+'px'
        });
        wrapper.append(component);
        ctrlBar.off('click','span');
        ctrlBar.on('click','span',function(e){
          var target=e.target||e.srcElement;
          autoIndex=target.index;
          ctrlItems.removeClass('jBanner-ctrl-selected');
          $(target).addClass('jBanner-ctrl-selected');
          if(opts.mode=='fade'){
            var cops=$('.jBanner-fade');
            cops.addClass('jBanner-fade-hide');
          }else{
            var cops=$('.jBanner-slide');
            cops.addClass('jBanner-slide-hide');
          }
          setTimeout(function(){
            cops.css('background-image','url(./img/'+target.index+'.jpg)');
          },300);
          if(opts.mode=='fade'){
            setTimeout(function(){
              cops.removeClass('jBanner-fade-hide');
            },500);
          }else{
            setTimeout(function(){
              cops.removeClass('jBanner-slide-hide');
            },500);
          }
        });
      }else if(opts.mode=='box'){
        var component,left,top;
        for(var i=0;i<16;i++){
          left=Math.ceil(opts.imgWidth/4*(i%4));
          top=Math.ceil(opts.imgHeight/4)*Math.floor(i/4);
          component=document.createElement('div');
          $(component).addClass('jBanner-content jBanner-box');
          $(component).css({
            'left':left+'px',
            'top':top+'px',
            'background-image':'url('+opts.imgURL[0]+')',
            'background-size':opts.imgWidth+'px '+opts.imgHeight+'px',
            'background-position':'-'+left+'px '+'-'+top+'px'
          });
          wrapper.append(component);
        }
        ctrlBar.off('click','span');
        ctrlBar.on('click','span',function(e){
          var target=e.target||e.srcElement;
          autoIndex=target.index;
          ctrlItems.removeClass('jBanner-ctrl-selected');
          $(target).addClass('jBanner-ctrl-selected');
          var cops=$('.jBanner-box');
          cops.addClass('jBanner-box-hide');
          setTimeout(function(){
            cops.css('background-image','url(./img/'+target.index+'.jpg)');
          },300);
          setTimeout(function(){
            cops.removeClass('jBanner-box-hide');
          },500);
        });
      }else if(opts.mode=='blind'){
        var component,top;
        for(var i=0;i<4;i++){
          top=Math.ceil(opts.imgHeight/4)*i;
          component=document.createElement('div');
          $(component).addClass('jBanner-content jBanner-blind');
          $(component).css({
            'top':top+'px',
            'background-image':'url('+opts.imgURL[0]+')',
            'background-size':opts.imgWidth+'px '+opts.imgHeight+'px',
            'background-position':'0 '+'-'+top+'px'
          });
          wrapper.append(component);
        }
        ctrlBar.off('click','span');
        ctrlBar.on('click','span',function(e){
          var target=e.target||e.srcElement;
          autoIndex=target.index;
          ctrlItems.removeClass('jBanner-ctrl-selected');
          $(target).addClass('jBanner-ctrl-selected');
          var cops=$('.jBanner-blind');
          cops.addClass('jBanner-blind-hide');
          setTimeout(function(){
            cops.css('background-image','url(./img/'+target.index+'.jpg)');
          },300);
          setTimeout(function(){
            cops.removeClass('jBanner-blind-hide');
          },500);
        });
      }else if(opts.mode=='vertical-blind'){
        var component,left;
        for(var i=0;i<4;i++){
          left=Math.ceil(opts.imgWidth/4)*i;
          component=document.createElement('div');
          $(component).addClass('jBanner-content jBanner-vertical-blind');
          $(component).css({
            'left':left+'px',
            'background-image':'url('+opts.imgURL[0]+')',
            'background-size':opts.imgWidth+'px '+opts.imgHeight+'px',
            'background-position':'-'+left+'px '+'0px'
          });
          wrapper.append(component);
        }
        ctrlBar.off('click','span');
        ctrlBar.on('click','span',function(e){
          var target=e.target||e.srcElement;
          autoIndex=target.index;
          ctrlItems.removeClass('jBanner-ctrl-selected');
          $(target).addClass('jBanner-ctrl-selected');
          var cops=$('.jBanner-vertical-blind');
          cops.addClass('jBanner-vertical-blind-hide');
          setTimeout(function(){
            cops.css('background-image','url(./img/'+target.index+'.jpg)');
          },300);
          setTimeout(function(){
            cops.removeClass('jBanner-vertical-blind-hide');
          },500);
        });
      }else if(opts.mode=='stripe'){
        var component,top;
        for(var i=0;i<4;i++){
          top=Math.ceil(opts.imgHeight/4)*i;
          component=document.createElement('div');
          $(component).addClass('jBanner-content jBanner-stripe');
          $(component).css({
            'top':top+'px',
            'background-image':'url('+opts.imgURL[0]+')',
            'background-size':opts.imgWidth+'px '+opts.imgHeight+'px',
            'background-position':'0 '+'-'+top+'px'
          });
          wrapper.append(component);
        }
        ctrlBar.off('click','span');
        ctrlBar.on('click','span',function(e){
          var target=e.target||e.srcElement;
          autoIndex=target.index;
          ctrlItems.removeClass('jBanner-ctrl-selected');
          $(target).addClass('jBanner-ctrl-selected');
          var cops=$('.jBanner-stripe');
          cops.each(function(index,ele){
            if(index%2==0){
              $(ele).addClass('jBanner-stripe-hide-left');
            }else{
              $(ele).addClass('jBanner-stripe-hide-right');
            }
          });
          setTimeout(function(){
            cops.css('background-image','url(./img/'+target.index+'.jpg)');
          },300);
          setTimeout(function(){
            cops.each(function(index,ele){
              if(index%2==0){
                $(ele).removeClass('jBanner-stripe-hide-left');
              }else{
                $(ele).removeClass('jBanner-stripe-hide-right');
              }
            });
          },500);
        });
      }else if(opts.mode=='vertical-stripe'){
        var component,left;
        for(var i=0;i<4;i++){
          left=Math.ceil(opts.imgWidth/4)*i;
          component=document.createElement('div');
          $(component).addClass('jBanner-content jBanner-vertical-stripe');
          $(component).css({
            'left':left+'px',
            'background-image':'url('+opts.imgURL[0]+')',
            'background-size':opts.imgWidth+'px '+opts.imgHeight+'px',
            'background-position':'-'+left+'px'+' 0px'
          });
          wrapper.append(component);
        }
        ctrlBar.off('click','span');
        ctrlBar.on('click','span',function(e){
          var target=e.target||e.srcElement;
          autoIndex=target.index;
          ctrlItems.removeClass('jBanner-ctrl-selected');
          $(target).addClass('jBanner-ctrl-selected');
          var cops=$('.jBanner-vertical-stripe');
          cops.each(function(index,ele){
            if(index%2==0){
              $(ele).addClass('jBanner-vertical-stripe-hide-up');
            }else{
              $(ele).addClass('jBanner-vertical-stripe-hide-down');
            }
          });
          setTimeout(function(){
            cops.css('background-image','url(./img/'+target.index+'.jpg)');
          },300);
          setTimeout(function(){
            cops.each(function(index,ele){
              if(index%2==0){
                $(ele).removeClass('jBanner-vertical-stripe-hide-up');
              }else{
                $(ele).removeClass('jBanner-vertical-stripe-hide-down');
              }
            });
          },500);
        });
      }
      if(opts.autoPlay){
        var t;
        function autoPlay(){
          autoIndex=(autoIndex+1)%5;
          ctrlItems.eq(autoIndex).click();
          clearTimeout(t);
          t=setTimeout(autoPlay,opts.interval);
        };
        setTimeout(autoPlay,opts.interval);
      }


    }
  });

  $.fn.jBannerInit.defaults={
    imgURL:[],
    imgWidth:800,
    imgHeight:400,
    mode:'fade',
    autoPlay:true,
    interval:3000
  }
}($);
