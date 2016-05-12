var momObj=function(){
	this.x;
	this.y;
	this.angle;
	this.speed;
	this.potralTimer;
	this.potralAngle;
	this.eye=[];
	this.eyeTimer;
	this.eyeIndex;
	this.eyeInterval;
	this.body=new Image();
	this.tail=[];
	this.tailTimer;
	this.tailIndex;
}
momObj.prototype.init=function(){
	this.x=0;
	this.y=0;
	this.potralTimer=0;
	this.potralAngle=0;
	this.eyeTimer=0;
	this.eyeIndex=0;
	this.eyeInterval=0;
	this.tailTimer=0;
	this.tailIndex=0;
	this.angle=0;
	this.speed=Math.random()*0.12+0.08;
	this.body.src='./src/bigSwimBlue3.png';
	var i=0;
	var griddle=Math.floor(Math.random()*4);
	if(griddle==0){
		this.x=0;
		this.y=Math.random()*can2.height;
	}
	else if(griddle==1){
		this.x=can2.width;
		this.y=Math.random()*can2.height;
	}
	else if(griddle==2){
		this.x=Math.random()*can2.width;
		this.y=0;
	}
	else{
		this.x=Math.random()*can2.width;
		this.y=can2.height;
	}
	for(i=0;i<8;i++){
		this.tail[i]=new Image();
		this.tail[i].src='./src/bigTail'+i+'.png';
	}
	this.eye[0]=new Image();
	this.eye[1]=new Image();
	this.eye[0].src='./src/bigEye0.png';
	this.eye[1].src='./src/bigEye1.png';
	this.eyeInterval=Math.random()*2000+1000;
}
momObj.prototype.draw=function(){
	var deltaX=baby.x-this.x;
	var deltaY=baby.y-this.y;
	/*如果小鱼距离大鱼一定范围内，大鱼开启追踪模式*/
	if(Math.pow(deltaX,2)+Math.pow(deltaY,2)<25000){
		// this.x=lerpDistance(baby.x,this.x,this.speed)
		// this.y=lerpDistance(baby.y,this.y,this.speed)
		var tmp=Math.atan2(deltaY,deltaX)+Math.PI;
		this.angle=lerpAngle(tmp,this.angle,0.9);
		this.x-=Math.cos(this.angle)*delta*this.speed;
		this.y-=Math.sin(this.angle)*delta*this.speed;
	}
	/*若小鱼逃远，大鱼开启随机巡逻模式*/
	else{
		this.speed=Math.random()*0.12+0.08;
		if(this.potralTimer==0){
			this.potralAngle=this.angle+Math.random()*Math.PI-Math.PI*0.5;
			if(this.potralAngle>Math.PI)
				this.potralAngle-=2*Math.PI;
			else if(this.angle<-Math.PI)
				this.potralAngle+=2*Math.PI;
		}
		this.potralTimer+=delta;
		if(this.potralTimer<4000){
			this.angle=lerpAngle(this.potralAngle,this.angle,0.2);
			this.x-=Math.cos(this.angle)*delta*0.1;
			this.y-=Math.sin(this.angle)*delta*0.1;
			if(this.x<0||this.x>can2.width||this.y<0||this.y>can2.height){
				if(this.x<0)
					this.x=0;
				else if(this.x>can2.width)
					this.x=can2.width;
				if(this.y<0)
					this.y=0;
				else if(this.y>can2.height)
					this.y=can2.height;
				this.potralAngle=this.angle-Math.PI+Math.random()*1;
				if(this.potralAngle>Math.PI)
					this.potralAngle-=2*Math.PI;
				else if(this.angle<-Math.PI)
					this.potralAngle+=2*Math.PI;
			}
		}
		else{
			this.potralTimer=0;
		}
	}
	this.tailTimer+=delta;
	this.eyeTimer+=delta;
	if(this.tailTimer>50){
		this.tailTimer=0;
		this.tailIndex=(this.tailIndex+1)%8;
	}
	if(this.eyeIndex==0){
		if(this.eyeTimer>this.eyeInterval){
			this.eyeTimer=0;
			this.eyeIndex=1;
			this.eyeInterval=Math.random()*2000+1000;
		}
	}
	else{
		if(this.eyeTimer>100){
			this.eyeTimer=0;
			this.eyeIndex=0;
		}
	}
	ctx1.save();
	ctx1.translate(this.x,this.y);
	ctx1.rotate(this.angle);
	ctx1.drawImage(this.tail[this.tailIndex],this.tail[this.tailIndex].width*0.4,-this.tail[this.tailIndex].height*0.5);
	ctx1.drawImage(this.body,-this.body.width*0.5,-this.body.height*0.5);
	ctx1.drawImage(this.eye[this.eyeIndex],-this.eye[this.eyeIndex].width*0.5,-this.eye[this.eyeIndex].height*0.5);
	ctx1.restore();
}
