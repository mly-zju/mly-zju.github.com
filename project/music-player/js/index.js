window.onload = function() {
  var music = new Music();
  var visual = new Visual();
  var model = new Model();
  var timer;
  var draggable = false;
  var Const = {};

  init();
  bindEvent();

  function init() {
    //preload img
    var img = new Image();
    img.src = "./img/play.svg";
    model.initAudio();
    model.loadMusic();
    music.init(model.getMusicTitle());
    visual.init();

    //init visual area
    setInterval(function() {
      visual.update(model.getFreq());
    }, 5000);
    // function updateVisual() {
    //   visual.update(model.getFreq());
    //   requestAnimationFrame(updateVisual);
    // };
    // requestAnimationFrame(updateVisual);

    Const.leftNum = music.dom.wrapper.offsetLeft;
    Const.barLength = music.dom.wrapper.offsetWidth;
  }

  function bindEvent() {
    model.data.music.addEventListener('canplay', function() {
      model.playMusic();
      clearInterval(timer);
      timer = setInterval(function() {
        var time = model.getTime();
        music.update(time.currentTime, time.totalTime);
        music.endtoBegin();
      }, 1000);
    });
    model.data.music.addEventListener('ended', function() {
      music.dom.next.click();
    });
    music.dom.wrapper.addEventListener('click', function(e) {
      var t = e.target;
      if (t.id == "music-all" || t.id == "music-played" || t.id == "music-ctrl") {
        var innerLeft = e.clientX - Const.leftNum;
        var ratio = innerLeft / Const.barLength;
        var time = model.getTime();
        music.cache.currentTime = time.totalTime * ratio;
        model.setTime(music.cache.currentTime);
        music.update(music.cache.currentTime, time.totalTime);
        music.endtoBegin();
      }
    });
    music.dom.wrapper.addEventListener('touchstart', function(e) {
      var t = e.target;
      if (t.id == "music-ctrl") {
        draggable = true;
        clearInterval(timer);
      }
    });
    music.dom.wrapper.addEventListener('touchmove', function(e) {
      if (draggable) {
        if (e.targetTouches.length == 1) {
          var touch = e.targetTouches[0];
          var innerLeft = touch.clientX - Const.leftNum;
          var ratio = innerLeft / Const.barLength;
          var time = model.getTime();
          music.cache.currentTime = time.totalTime * ratio;
          //model.setTime(currentTime);
          music.update(music.cache.currentTime, time.totalTime);
        }
      }
    });
    music.dom.wrapper.addEventListener('touchend', function(e) {
      var t = e.target;
      if (t.id == "music-ctrl") {
        draggable = false;
        model.setTime(music.cache.currentTime);
        clearInterval();
        timer = setInterval(function() {
          var time = model.getTime();
          music.update(time.currentTime, time.totalTime);
          music.endtoBegin();
        }, 1000);
      }
    });
    music.dom.next.addEventListener('click', function() {
      model.addCursor();
      model.loadMusic();
      music.init(model.getMusicTitle());
      music.endtoBegin();
    });
    music.dom.prev.addEventListener('click', function() {
      model.reduceCursor();
      model.loadMusic();
      music.init(model.getMusicTitle());
      music.endtoBegin();
    });
    music.dom.beginEnd.addEventListener('click', function() {
      if (model.getIfPaused()) {
        model.playMusic();
        music.endtoBegin();
        clearInterval(timer);
        timer = setInterval(function() {
          var time = model.getTime();
          music.update(time.currentTime, time.totalTime);
          music.endtoBegin();
        }, 1000);
      } else {
        model.pauseMusic();
        music.begintoEnd();
        clearInterval(timer);
      }
    });
  }
}
