function collisionTest(){
	for(var i=0;i<fruit.num;i++){
		if(fruit.alive[i]){
			if(calLength2(baby.x,baby.y,fruit.x[i],fruit.y[i])<800&&fruit.eatable[i]){
				fruit.dead(i);
				circle.born(baby.x,baby.y);
				data.scoreUp();
				data.setHp(baby.hpUp())
			}
		}
	}
	for(var i=0;i<momCount;i++){
		if(calLength2(baby.x,baby.y,mom[i].x,mom[i].y)<1000){
			data.setHp(0);
		}
	}
}