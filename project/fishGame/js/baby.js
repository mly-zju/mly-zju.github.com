var babyObj=function(){
	this.x;
	this.y;
	this.angle;
	this.eye=[];
	this.eyeTimer;
	this.eyeIndex;
	this.eyeInterval;
	this.body=[];
	this.bodyTimer;
	this.bodyIndex;
	this.tail=[];
	this.tailTimer;
	this.tailIndex;
}
babyObj.prototype.init=function(){
	var i=0;
	this.x=can1.width*0.5;
	this.y=can1.height*0.5;
	mx=this.x;
	my=this.y;
	this.angle=0;
	this.eyeTimer=0;
	this.eyeIndex=0;
	this.eyeInterval=0;
	this.bodyTimer=0;
	this.bodyIndex=5;
	this.tailTimer=0;
	this.tailIndex=0;
	for(i=0;i<8;i++){
		this.tail[i]=new Image();
		this.tail[i].src='./src/babyTail'+i+'.png';
	}
	for(i=0;i<6;i++){
		this.body[i]=new Image();
		this.body[i].src='./src/babyHp'+i+'.png';
	}
	this.eye[0]=new Image();
	this.eye[1]=new Image();
	this.eye[0].src='./src/babyEye0.png';
	this.eye[1].src='./src/babyEye1.png';
	this.eyeInterval=Math.random()*2000+1000;
}
babyObj.prototype.draw=function(){
	this.x=lerpDistance(mx,this.x,0.035);
	this.y=lerpDistance(my,this.y,0.035);
	var deltaX=mx-this.x;
	var deltaY=my-this.y;
	var tmp=Math.atan2(deltaY,deltaX)+Math.PI;
	this.angle=lerpAngle(tmp,this.angle,0.9);
	this.tailTimer+=delta;
	this.eyeTimer+=delta;
	this.bodyTimer+=delta;
	if(this.tailTimer>50){
		this.tailTimer=0;
		this.tailIndex=(this.tailIndex+1)%8;
	}
	if(this.bodyTimer>2000){
		this.bodyTimer=0;
		this.bodyIndex=this.bodyIndex-1;
		if(this.bodyIndex<0)
			this.bodyIndex=0;
		data.setHp(this.bodyIndex);
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
	ctx1.drawImage(this.body[this.bodyIndex],-this.body[this.bodyIndex].width*0.5,-this.body[this.bodyIndex].height*0.5);
	ctx1.drawImage(this.eye[this.eyeIndex],-this.eye[this.eyeIndex].width*0.5,-this.eye[this.eyeIndex].height*0.5);
	ctx1.restore();
}
babyObj.prototype.hpUp=function(){
	this.bodyIndex=this.bodyIndex+1;
	this.bodyTimer=0;
	if(this.bodyIndex>5)
		this.bodyIndex=5;
	return this.bodyIndex;
}
