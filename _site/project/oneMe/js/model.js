var Model = function() {
	this.data = {};
	this.data.music = document.getElementById("music");
	this.data.itemList = itemList;
	this.data.itemCursor = itemList.length - 1;
	this.data.itemLength = itemList.length;
}

Model.prototype.getCursor = function() {
	return this.data.itemCursor;
}

Model.prototype.addCursor = function() {
	this.data.itemCursor++;
	if (this.data.itemCursor >= this.data.itemLength) {
		this.data.itemCursor = 0;
	}
}

Model.prototype.reduceCursor = function() {
	this.data.itemCursor--;
	if (this.data.itemCursor < 0) {
		this.data.itemCursor = this.data.itemLength - 1;
	}
}

Model.prototype.loadMusic = function() {
	this.data.music.src = "http://mly-zju.github.io/project/oneMe/music/" + this.data.itemCursor + ".mp3";
}

Model.prototype.getTime = function() {
	var current = this.data.music.currentTime;
	var total = this.data.music.duration;
	if (isNaN(current)) {
		current = 0;
	}
	if (isNaN(total)) {
		total = 0;
	}
	return {
		currentTime: current,
		totalTime: total
	}
}

Model.prototype.setTime = function(current) {
	this.data.music.currentTime = parseInt(current);
}

Model.prototype.getArt = function() {
	var cursor = this.data.itemCursor;
	return {
		src: 'http://mly-zju.github.io/project/oneMe/photo/' + cursor + '.jpg',
		text: this.data.itemList[cursor].poem,
		date: this.data.itemList[cursor].date
	}
}

Model.prototype.getMusicTitle = function() {
	return this.data.itemList[this.data.itemCursor].title;
}

Model.prototype.getIfPaused = function() {
	return this.data.music.paused;
}

Model.prototype.playMusic = function() {
	this.data.music.play();
}

Model.prototype.pauseMusic = function() {
	this.data.music.pause();
}
