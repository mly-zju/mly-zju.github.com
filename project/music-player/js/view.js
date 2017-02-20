//音乐播放器部分
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
  this.dom.beginEnd.style.backgroundImage = "url(./img/play.svg)";
}

Music.prototype.endtoBegin = function() {
  this.dom.beginEnd.style.backgroundImage = "url(./img/pause.svg)";
}

//可视化图形部分
var Visual = function() {
  this.chart = echarts.init(document.getElementById('canvas'));
  this.option = {
    title: {},
    tooltip: {
      show: false
    },
    backgroundColor: 'rgba(255,255,255,0.5)',
    grid: {
      left: '1%',
      right: '1%',
      top: '1%',
      bottom: '1%'
    },
    visualMap: {
      type: 'continuous',
      min: 0,
      max: 255,
      show: false
    },
    legend: {},
    xAxis: {
      data: [],
      axisLine: {
        show: false
      }
    },
    yAxis: {
      max: 255,
      data: [],
      axisLine: {
        show: false
      }
    },
    series: [{
      name: '销量',
      type: 'bar',
      data: []
    }]
  }
}

Visual.prototype.init = function() {
  this.chart.setOption(this.option);
}

Visual.prototype.update = function(data) {
  this.option.series[0].data = data;
  this.chart.setOption(this.option);
  console.log(data);
  document.getElementById('music-title').innerText = data[0] + data[1] + data[2] + data[3] + data[4];
}
