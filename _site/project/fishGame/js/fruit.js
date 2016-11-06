var fruitObj=function(){
	this.x=[];
	this.y=[];
	this.l=[];
	this.alive=[];
	this.eatable=[];
	this.orange=new Image();
	this.blue=new Image();
	this.bornSpeed=[];
	this.upSpeed=[];
	this.aneId=[];
}
fruitObj.prototype.num=10;
fruitObj.prototype.init=function(){
	var i=0;
	var l=0;
	for (i=0;i<this.num;i++){
		this.alive[i]=true;
		this.eatable[i]=false;
		do{
			this.aneId[i]=Math.floor(Math.random()*ane.num);
		}while(ane.isOccupy[this.aneId[i]]);
		ane.isOccupy[this.aneId[i]]=true;
		this.l[i]=0;
		this.bornSpeed[i]=Math.random()*0.005+0.001;
		this.upSpeed[i]=Math.random()*0.03+0.01;
		l=Math.sin(ane.angle)*ane.amp[this.aneId[i]];
		this.x[i]=ane.x[this.aneId[i]]+l;
		this.y[i]=can2.height-ane.len[this.aneId[i]];
	}
	this.orange.src='./src/fruit.png';
	this.blue.src='./src/blue.png';
}

fruitObj.prototype.draw=function(){
	var i=0;
	var l=0;
	/*绘制果实图形*/
	for(i=0;i<this.num;i++){
		if(this.alive[i]){
			ctx2.drawImage(this.orange,this.x[i]-this.l[i]/2,this.y[i],this.l[i],this.l[i]);
		}
	}
	/*管理果实的状态，包括大小、高度、摆动位置、是否有效等*/
	for(i=0;i<this.num;i++){
		if(this.alive[i]){
			/*当还在海葵上，需要跟踪海葵的摆动*/
			if(this.l[i]<12){
				this.l[i]=this.l[i]+delta*this.bornSpeed[i];
				if(this.l[i]>12)
					this.l[i]=12;
				l=Math.sin(ane.angle)*ane.amp[this.aneId[i]];
				this.x[i]=ane.x[this.aneId[i]]+l;
			}
			/*当脱离了海葵，则不需要跟踪海葵的摆动*/
			else{
				this.eatable[i]=true;
				this.y[i]=this.y[i]-delta*this.upSpeed[i];
				if(this.y[i]<0)
					this.alive[i]=false;
			}
		}
		else{
			this.alive[i]=true;
			ane.isOccupy[this.aneId[i]]=false;
			do{
				this.aneId[i]=Math.floor(Math.random()*ane.num);
			}while(ane.isOccupy[this.aneId[i]]);
			l=Math.sin(ane.angle)*ane.amp[this.aneId[i]];
			this.x[i]=ane.x[this.aneId[i]]+l;
			this.y[i]=can2.height-ane.len[this.aneId[i]];
			this.l[i]=0;
			this.upSpeed[i]=Math.random()*0.04+0.01;
			this.bornSpeed[i]=Math.random()*0.005+0.001;
		}
	}
}
fruitObj.prototype.dead=function(i){
	this.alive[i]=false;
	this.eatable[i]=false;
}
