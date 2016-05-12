var dustObj=function(){
	this.x=[];
	this.y=[];
	this.amp=[];
	this.img=[];
}
dustObj.prototype.num=21;
dustObj.prototype.init=function(){
	var i=0;
	var j=0;
	for(i=0;i<this.num;i++){
		this.x[i]=Math.random()*can1.width;
		this.y[i]=Math.random()*can1.height;
		this.amp[i]=Math.random()*30+10;
		this.img[i]=new Image();
		j=i%7;
		this.img[i].src='./src/dust'+j+'.png';
	}
}
dustObj.prototype.draw=function(){
	var i=0;
	var offset=0;
	var angle=ane.angle;
	for(i=0;i<this.num;i++){
		offset=this.amp[i]*Math.sin(angle);
		ctx1.drawImage(this.img[i],this.x[i]+offset,this.y[i]);
	}
}
