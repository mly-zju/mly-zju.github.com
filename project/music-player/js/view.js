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
  this.state = 'bar';
  this.optionBar = {
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
    animationDurationUpdate: 150,
    series: [{
      name: '',
      type: 'bar',
      data: []
    }]
  }
  this.scatterData = [];
  for (var i = 0; i < 40; i++) {
    this.scatterData[i] = [];
    this.scatterData[i].push(Math.ceil(Math.random() * 101));
    this.scatterData[i].push(Math.ceil(Math.random() * 101));
    this.scatterData[i].push(Math.ceil(Math.random() * 255));
  }
  ;
  this.optionScatter = {
    title: {
    },
    legend: {
    },
    tooltip: {
      show: false
    },
    backgroundColor: 'rgba(255,255,255,0.5)',
    grid: {
      left: '5%',
      right: '5%',
      top: '5%',
      bottom: '5%'
    },
    xAxis: {
      data: [],
      max: 100,
      axisLine: {
        show: false,
      }
    },
    yAxis: {
      data: [],
      max: 100,
      axisLine: {
        show: false,
      }
    },
    visualMap: {
      type: 'continuous',
      min: 0,
      max: 255,
      show: false
    },
    series: [{
      name: '',
      data: [],
      type: 'scatter',
      symbolSize: function(data) {
        return data[2] / 5;
      },
      itemStyle: {
        normal: {
          shadowBlur: 10,
          shadowColor: 'rgba(120, 36, 50, 0.5)',
          shadowOffsetY: 5,
          color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
            offset: 0,
            color: 'rgb(251, 118, 123)'
          }, {
            offset: 1,
            color: 'rgb(204, 46, 72)'
          }])
        }
      }
    }],
    animationDurationUpdate: 150,
  };
  this.optionLiquid = {
    animationDuration: 150,
    animationDurationUpdate: 150,
    backgroundColor: 'rgba(255,255,255,0.5)',
    series: [{
      type: 'liquidFill',
      data: [],
      radius: '100%',
      backgroundStyle: {
        color: 'rgba(255,255,255,0)'
      },
      label: {
        normal: {
          formatter: function() {
            return '';
          }
        }
      },
      outline: {
        show: false
      },
      shape: 'rect',
    }]
  };
}

Visual.prototype.init = function() {
  // this.chart.setOption(this.optionBar);
  this.dom = {};
  this.dom.changeButton = document.getElementsByClassName('change-anim')[0];
}

Visual.prototype.update = function(data) {
  if (this.state == 'bar') {
    this.optionBar.series[0].data = data;
    this.chart.setOption(this.optionBar);
  } else if (this.state == 'scatter') {
    for (var i = 0; i < data.length; i++) {
      this.scatterData[i][2] = data[i];
    }
    this.optionScatter.series[0].data = this.scatterData;
    this.chart.setOption(this.optionScatter);
  } else {
    var inter = 0;
    var mydata = [];
    var tmp = 0;
    for (var i = 0; i < 25; i++) {
      tmp = tmp + data[i];
      inter++;
      if (inter == 5) {
        inter = 0;
        tmp = tmp / (200 * 5);
        mydata.push(tmp);
        tmp = 0;
      }
    }
    this.optionLiquid.series[0].data = mydata;
    this.chart.setOption(this.optionLiquid);
  }
}

Visual.prototype.changeType = function() {
  if (this.state == 'bar') {
    this.state = 'scatter';
    this.chart.clear();
  } else if (this.state == 'scatter') {
    this.state = 'liquidFill';
    this.chart.clear();
  } else {
    this.state = 'bar';
    this.chart.clear();
  }
}
