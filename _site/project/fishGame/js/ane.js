var aneObj=function(){
	this.x=[];
	this.len=[];
	this.isOccupy=[];
	this.angle=0;
	this.amp=[];
}
aneObj.prototype.num=50;
aneObj.prototype.init=function(){
	var i;
	for(i=0;i<this.num;i++){
		this.x[i]=Math.random()*20+i*20;
		this.len[i]=Math.random()*30+150;
		this.isOccupy[i]=false;
		this.amp[i]=Math.random()*45+20;
	}
}
aneObj.prototype.draw=function(){
	ctx2.save();
	var i;
	if(this.angle<=2*Math.PI)
		this.angle=this.angle+delta*0.0012;
	else
		this.angle=0;
	var l=Math.sin(this.angle);
	for(i=0;i<this.num;i++){
		ctx2.beginPath();
		ctx2.moveTo(this.x[i],can2.height);
		ctx2.quadraticCurveTo(this.x[i],can2.height-this.len[i]+20,
			this.x[i]+l*this.amp[i],can2.height-this.len[i]);
		ctx2.lineWidth=16;
		ctx2.strokeStyle='#3b154e';
		ctx2.lineCap='round';
		ctx2.globalAlpha=0.6;
		ctx2.stroke();
	}
	ctx2.restore();
}