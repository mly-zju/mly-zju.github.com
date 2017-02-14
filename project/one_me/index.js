window.onload = function() {
	//define view
	var music = document.getElementById("music");
	var musicTitle = document.getElementById("music-title");
	var musicBar = document.getElementById("music-bar");
	var musicAll = document.getElementById("music-all");
	var musicPlayed = document.getElementById("music-played");
	var musicCtrl = document.getElementById("music-ctrl");
	var musicTimeNow = document.getElementById("music-time-now");
	var musicTimeTotal = document.getElementById("music-time-total");
	var picture = document.getElementById("today-img");
	var poem = document.getElementById("today-poem");
	var date = document.getElementById("date");

	function musicBarMove(current, total) {
		var percent = current / total * 100;
		musicPlayed.style.width = percent + "%";
		musicCtrl.style.left = percent + "%";
		musicTimeNow.innerText = showTime(current);
		musicTimeTotal.innerText = showTime(total);
	}

	function showTime(time) {
		var minute;
		var second;
		minute = parseInt(time / 60);
		second = parseInt(time % 60);
		if (minute < 10) {
			minute = '0' + minute;
		}
		if (second < 10) {
			second = '0' + second;
		}
		return minute + ':' + second;
	}
	//define model
	var barOffset = musicBar.offsetLeft;
	var barLength = musicBar.offsetWidth;
	var currentTime;
	var totalTime;
	var draggable = false;
	var timer;
	var cursor = itemList.length - 1;
	var maxLength = cursor + 1;
	var musicPrefix = "http://mly-zju.github.io/project/one_me/music/";
	var picPrefix = "http://mly-zju.github.io/project/one_me/photo/"

	//define controller
	music.src = musicPrefix + cursor + '.mp3';
	musicTitle.innerText = itemList[cursor].title;
	picture.src = picPrefix + cursor + '.jpg';
	poem.innerText = itemList[cursor].poem;
	date.innerText = '——' + itemList[cursor].date;

	function init() {
		music.play();
		currentTime = music.currentTime;
		totalTime = music.duration;
		clearInterval(timer);
		timer = setInterval(function() {
			currentTime = music.currentTime;
			musicBarMove(currentTime, totalTime);
		}, 1000);
	}
	music.addEventListener('canplay', init);
	musicBar.addEventListener('click', function(e) {
		var t = e.target;
		if (t.id == "music-all" || t.id == "music-played" || t.id == "music-ctrl") {
			var innerLeft = e.clientX - barOffset;
			var ratio = innerLeft / barLength;
			currentTime = totalTime * ratio;
			musicBarMove(currentTime, totalTime);
			music.currentTime = currentTime;
		}
	});
	musicBar.addEventListener('touchstart', function(e) {
		var t = e.target;
		if (t.id == "music-ctrl") {
			draggable = true;
			clearInterval(timer);
		}
	});
	musicBar.addEventListener('touchend', function(e) {
		var t = e.target;
		if (t.id == "music-ctrl") {
			draggable = false;
			music.currentTime = currentTime;
			timer = setInterval(function() {
				currentTime = music.currentTime;
				musicBarMove(currentTime, totalTime);
			}, 1000);
		}
	});
	musicBar.addEventListener('touchmove', function(e) {
		if (draggable) {
			if (e.targetTouches.length == 1) {
				var touch = e.targetTouches[0];
				var innerLeft = touch.clientX - barOffset;
				var ratio = innerLeft / barLength;
				currentTime = totalTime * ratio;
				musicBarMove(currentTime, totalTime);
			}
		}
	});

	var beginEnd = document.getElementById('music-button');
	beginEnd.onclick = function() {
		if (music.paused) {
			music.play();
			this.style.backgroundImage = "url(./pause.png)"
			clearInterval(timer);
			timer = setInterval(function() {
				currentTime = music.currentTime;
				totalTime = music.duration;
				musicBarMove(currentTime, totalTime);
			}, 1000);
		} else {
			music.pause();
			this.style.backgroundImage = "url(./play.png)"
			clearInterval(timer);
		}
	}
	var next = document.getElementById('music-button-next');
	var prev = document.getElementById('music-button-prev');
	next.onclick = function() {
		cursor++;
		if (cursor >= maxLength) {
			cursor = 0;
		}
		music.src = musicPrefix + cursor + '.mp3';
		musicTitle.innerText = itemList[cursor].title;
		picture.src = picPrefix + cursor + '.jpg';
		poem.innerText = itemList[cursor].poem;
		date.innerText = '——' + itemList[cursor].date;
		beginEnd.style.backgroundImage = "url(./pause.png)";
	}
	prev.onclick = function() {
		cursor--;
		if (cursor < 0) {
			cursor = maxLength - 1;
		}
		music.src = musicPrefix + cursor + '.mp3';
		musicTitle.innerText = itemList[cursor].title;
		picture.src = picPrefix + cursor + '.jpg';
		poem.innerText = itemList[cursor].poem;
		date.innerText = '——' + itemList[cursor].date;
		beginEnd.style.backgroundImage = "url(./pause.png)";
	}
}
