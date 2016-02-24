$(document).ready(function(){
	var header=$("#header");
	var nav=$("#nav");
	var title_line=$("#header span");
	var sub_title=$("#header p");
	var body=$("body");
	var flag=0;
	var d=new Date();
	var day=d.getDay();
	var wrapper=$(".wrapper");
	var len=wrapper.length;
	var pre=0;
	var foot=$(".foot");
	var height=$(document).height();
	var hamburger_wrapper=$('.hamburger_wrapper');
	var nav_dropdown=$('#nav ul');
	var content_word=$('.word p');
	var content_para=$('.paragraph p');
	var innerWidth=window.innerWidth;
	
	if(innerWidth>560){
		foot.css({"top":height+"px"});
		body.css({"background":"url(img/bg"+day+".jpg) fixed no-repeat","background-size":"cover"});
		title_line.eq(0).animate(
		{
			height:"2px",
			width:"190px",
			opacity:"1"
		},1200);
		title_line.eq(1).animate(
		{
			height:"2px",
			width:"190px",
			opacity:"1"
		},1200);
		sub_title.animate({
			opacity:"1"
		},3000);
	}else{
		title_line.eq(0).animate(
		{
			height:"0.4vh",
			width:"50vw",
			opacity:"1"
		},1200);
		title_line.eq(1).animate(
		{
			height:"0.4vh",
			width:"50vw",
			opacity:"1"
		},1200);
		sub_title.animate({
			opacity:"1"
		},3000);
		hamburger_wrapper.click(function(){
			if(nav_dropdown.css('display')=='block'){
				nav.css('opacity','1');
				nav_dropdown.css('display','none');
				setTimeout(function(){nav.css('opacity','0.9')},500);
				if($(document).scrollTop()<header.innerHeight()){
					$(this).parent().css({"background-color":"transparent"});
				}
			}else{
				nav_dropdown.css('display','block');
				$(this).parent().css({"background-color":"rgb(10,36,65)","opacity":"0.9"});
			}
		});
		content_word.each(function(index){
			var t=$(this);
			if(t.text().length>15){
				t.text(t.text().substring(0,15)+'...');
			}
		});
		content_para.each(function(index){
			var t=$(this);
			if(t.text().length>35){
				t.text(t.text().substring(0,35)+'...');
			}
		});
	}

	for(var i=len-1;i>=0;i--)
	{
		t=wrapper.eq(i);
		if(pre==0)
		{
			if(t.hasClass("pic_type"))
			{
				t.removeClass("content_pic1");
				t.addClass("content_pic2");
				pre=1;
			}
			else if(t.hasClass("word_type"))
			{
				t.removeClass("content_word1");
				t.addClass("content_word2");
				pre=1;
			}
		}
		else if(pre==1)
		{
			if(t.hasClass("pic_type"))
			{
				t.removeClass("content_pic2");
				t.addClass("content_pic1");
				pre=0;
			}
			else if(t.hasClass("word_type"))
			{
				t.removeClass("content_word2");
				t.addClass("content_word1");
				pre=0;
			}
		}
	}
	
	$(window).scroll(function(){
		var top=$(document).scrollTop();
		if(innerWidth<560){
			if(nav_dropdown.css('display')!='none'){
				nav_dropdown.css('display','none');
				if(top<header.innnerHeight()){
					nav.css({"background-color":"transparent"});
				}
			}
		}
		if(top>=header.innerHeight())
		{
			if(flag==0)
			{
				flag=1;
				nav.find("#name").animate({
				opacity:"1",
				},200);
				//nav.css({"background-color":"rgb(49,55,69)"});
				nav.css({"background-color":"rgb(10,36,65)","opacity":"0.9"});

			}
		}
		else
		{
			if(flag==1)
			{
				flag=0;
				nav.find("#name").animate({
				opacity:"0"
				},200);
			 	nav.css({"background-color":"transparent"});
			}
		}
	});

});