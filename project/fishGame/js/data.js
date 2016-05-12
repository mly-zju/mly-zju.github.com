var dataObj=function(){
	this.total;
	this.hp;
	this.cont1="";
	this.cont2="";
}
dataObj.prototype.init=function(){
	this.total=0;
	this.hp=5;
	this.cont1="";
	this.cont2="";
	this.cont1="score: "+this.total;
	this.cont2="HP: "+this.hp;
	ctx1.save();
	ctx1.textAlign="center";
	ctx1.font="30px Verdana";
	ctx1.fillStyle='white';
	ctx1.shadowColor='white';
	ctx1.shadowBlur=5;
	ctx1.fillText(this.cont1,can1.width*0.5,can1.height-40);
	ctx1.fillText(this.cont2,can1.width*0.5,can1.height-70);
	ctx1.restore();
}
dataObj.prototype.draw=function(){
	this.cont1="score: "+this.total;
	this.cont2="HP: "+this.hp;
	ctx1.save();
	ctx1.textAlign="center";
	ctx1.font="30px Verdana";
	ctx1.fillStyle='white';
	ctx1.shadowColor='white';
	ctx1.shadowBlur=5;
	ctx1.fillText(this.cont1,can1.width*0.5,can1.height-40);
	ctx1.fillText(this.cont2,can1.width*0.5,can1.height-70);
	ctx1.restore();
}
dataObj.prototype.scoreUp=function(){
	this.total=this.total+1;
}
dataObj.prototype.setHp=function(hp){
	this.hp=hp;
}
dataObj.prototype.getHp=function(){
	return this.hp;
}
