var can1;
var can2;
var ctx1;
var ctx2;
var gameTime;
var lastTime;
var delta;
var now;
var bgPic;
var ane;
var fruit;
var mom=[];
var momNum;
var momCount;
var mx;
var my;
var baby;
var circle;
var data;
var dust;
var timeout;
var restart;

document.body.onload=function(){
	init();
	teach();
	//gameloop();
}

function init(){
	can1=document.getElementById('canvas1');
	ctx1=can1.getContext('2d');
	can2=document.getElementById('canvas2');
	ctx2=can2.getContext('2d');
	delta=0;
	lastTime=Date.now();
	gameTime=0;
	bgPic=new Image();
	bgPic.src='./src/background.jpg';
	ane=new aneObj();
	ane.init();
	fruit=new fruitObj();
	fruit.init();
	momNum=20;
	momCount=0;
	for(i=0;i<momNum;i++){
		mom[i]=new momObj();
	}
	mx=0;
	my=0;
	can1.onmousemove=function(e){
		if(e.offsetX || e.layerX){
			mx=e.offsetX==undefined?e.layerX:e.offsetX;
			my=e.offsetY==undefined?e.layerY:e.offsetY;
		}
	};
	baby=new babyObj();
	baby.init();
	circle=new circleObj();
	circle.init();
	data=new dataObj();
	data.init();
	dust=new dustObj();
	dust.init();
	restart=document.getElementById('restart');
	restart.onclick=function(){
		restart.style.display="none";
		cancelAnimFrame(timeout);
		init();
		gameloop();
	}
}

function teach(){
	now=Date.now();
	delta=now-lastTime;
	if(delta>2000)
		delta=0;
	// if(gameTime==0)
	// 	mom[0].init();
	gameTime+=delta;
	lastTime=now;
	ctx2.drawImage(bgPic,0,0,can2.width,can2.height);
	ane.draw();
	fruit.draw();
	ctx1.clearRect(0,0,can1.width,can1.height);
	//mom[0].draw();
	baby.draw();
	dust.draw();
	ctx1.save();
	ctx1.textAlign="center";
	ctx1.font="20px Verdana";
	ctx1.fillStyle='white';
	ctx1.shadowColor='white';
	ctx1.shadowBlur=5;
	ctx1.fillText("移动鼠标控制小鱼躲避大鱼的攻击，同时食用海葵的果实补充HP。",
		can1.width*0.5,can1.height*0.5-20);
	ctx1.fillText("随着时间流逝，大鱼数量会逐渐增加，一旦被大鱼抓住，则游戏结束。",can1.width*0.5,can1.height*0.5);
	ctx1.fillText("同时，小鱼的HP也会随时间减少，HP越少，小鱼身体颜色越浅。一旦HP变为0，游戏同样结束。",can1.width*0.5,can1.height*0.5+20);
	ctx1.restore();

	window.cancelAnimFrame(timeout);
	timeout=window.requestAnimFrame(teach);
}

function gameloop(){
	now=Date.now();
	delta=now-lastTime;
	if(delta>2000)
		delta=0;
	gameTime+=delta;
	if(gameTime>momCount*20000){
		mom[momCount].init();
		momCount++;
	}
	lastTime=now;
	ctx2.drawImage(bgPic,0,0,can2.width,can2.height);
	ane.draw();
	fruit.draw();
	ctx1.clearRect(0,0,can2.width,can2.height);
	for(var i=0;i<momCount;i++){
		mom[i].draw();
	}
	collisionTest();
	baby.draw();
	dust.draw();
	circle.draw();
	data.draw();
	if(data.getHp()==0){
		gameover();
		cancelAnimFrame(timeout);
		return 0;
	}

	cancelAnimFrame(timeout);
	timeout=window.requestAnimFrame(gameloop);
}

function gameover(){
	ctx1.save();
	ctx1.textAlign="center";
	ctx1.font="40px Verdana";
	ctx1.fillStyle='#EE9A00';
	ctx1.shadowColor='white';
	ctx1.shadowBlur=10;
	ctx1.fillText("Game Over",can1.width*0.5,can1.height*0.5);
	ctx1.restore();
	restart.innerHTML="重新开始";
	restart.style.display="block";
}
