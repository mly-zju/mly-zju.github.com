//音乐视图部分
var Music = function() {
	this.cache = {};
	this.dom = {};
	this.dom.title = document.getElementById("music-title");
	this.dom.wrapper = document.getElementById("music-bar");
	this.dom.musicAll = document.getElementById("music-all");
	this.dom.musicPlayed = document.getElementById("music-played");
	this.dom.musicCtrl = document.getElementById("music-ctrl");
	this.dom.musicTimeNow = document.getElementById("music-time-now");
	this.dom.musicTimeTotal = document.getElementById("music-time-total");
	this.dom.beginEnd = document.getElementById('music-button');
	this.dom.next = document.getElementById('music-button-next');
	this.dom.prev = document.getElementById('music-button-prev');
}

Music.prototype.init = function(title) {
	this.dom.title.innerText = title;
	this.dom.musicTimeNow.innerText = '00:00';
	this.dom.musicTimeTotal.innerText = '00:00';
}

Music.prototype.update = function(currentTime, totalTime) {
	this.dom.musicTimeNow.innerText = util.timeFormat(currentTime);
	this.dom.musicTimeTotal.innerText = util.timeFormat(totalTime);
	var percent = currentTime / totalTime * 100;
	this.dom.musicPlayed.style.width = percent + "%";
	this.dom.musicCtrl.style.left = percent - 1 + "%";
}

Music.prototype.begintoEnd = function() {
	this.dom.beginEnd.style.backgroundImage = "url(./play.svg)";
}

Music.prototype.endtoBegin = function() {
	this.dom.beginEnd.style.backgroundImage = "url(./pause.svg)";
}

//图文视图部分
var Art = function() {
	this.cache = {};
	this.dom = {};
	this.dom.img = document.getElementById("today-img");
	this.dom.poem = document.getElementById("today-poem");
	this.dom.date = document.getElementById("date");
}

Art.prototype.init = function(src, text, date) {
	this.dom.img.src = src;
	this.dom.poem.innerText = text;
	this.dom.date.innerText = "—— " + date;
}
