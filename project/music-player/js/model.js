var Model = function() {
  this.data = {};
  this.data.music = document.getElementById("music");
  this.data.audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
  this.data.music.src = "http://mly-zju.github.io/project/music-player/music/" + this.data.itemCursor + ".mp3";
  this.data.music.crossOrigin = 'anonymous';
  // this.data.music.src = "./music/" + this.data.itemCursor + ".mp3";

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

Model.prototype.initAudio = function() {
  this.data.source = this.data.audioContext.createMediaElementSource(this.data.music);
  this.data.analyser = this.data.audioContext.createAnalyser();
  this.data.source.connect(this.data.analyser);
  this.data.analyser.connect(this.data.audioContext.destination);
  this.data.output = new Uint8Array(this.data.analyser.frequencyBinCount);
}

Model.prototype.getFreq = function() {
  this.data.analyser.getByteFrequencyData(this.data.output);
  var data = [];
  for (var i = 0; i < 1000;) {
    data.push(this.data.output[i]);
    i = i + 100;
  }
  return data;
}
