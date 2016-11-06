var circleObj=function(){
	this.x=[];
	this.y=[];
	this.r=[];
	this.alive=[];
}
circleObj.prototype.num=10;
circleObj.prototype.init=function(){
	var i=0;
	for(i=0;i<this.num;i++){
		this.x[i]=0;
		this.y[i]=0;
		this.r[i]=0;
		this.alive[i]=false;
	}
}
circleObj.prototype.draw=function(){
	var i=0;
	var alpha=1;
	var style="";
	for(i=0;i<this.num;i++){
		ctx1.save();
		if(this.alive[i]){
			ctx1.lineWidth=3;
			ctx1.shadowColor='white';
			ctx1.shadowBlur=20;
			this.r[i]+=delta*0.04;
			alpha=1-2*this.r[i]/100;
			if(alpha<0){
				alpha=0;
				this.alive[i]=false;
			}
			ctx1.beginPath();
			ctx1.arc(this.x[i],this.y[i],this.r[i],0,2*Math.PI);
			ctx1.strokeStyle='rgba(255,255,255,'+alpha+')';
			ctx1.stroke();
		}
		ctx1.restore();
	}
}
circleObj.prototype.born=function(x,y){
	var i=0;
	for(i=0;i<this.num;i++){
		if(!this.alive[i]){
			this.alive[i]=true;
			this.r[i]=20;
			this.x[i]=x;
			this.y[i]=y;
			return;
		}
	}
}
