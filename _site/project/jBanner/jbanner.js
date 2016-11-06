;
!function($) {
  $.fn.extend({
    'jBannerInit': function(options) {
      var opts = $.extend({}, $.fn.jBannerInit.defaults, options);
      if (opts.interval < 1500) {
        opts.interval = 1500;
      }

      var myCss = '<style>\
                .jBanner-wrapper{overflow:hidden;}\
                .jBanner-ctrl{position:absolute;width:100%;height:10px;bottom:15px;text-align:center;z-index:1;}\
                .jBanner-ctrl span{display:inline-block;width:10px;height:10px;border-radius:50%;margin:0 3px 0 3px;background-color:gray;cursor:pointer;}\
                .jBanner-ctrl .jBanner-ctrl-selected{background-color:brown;}\
                .jBanner-preload{position:absolute;width:' + opts.imgWidth + 'px;height:' + opts.imgHeight + 'px;left:' + opts.imgWidth + 'px;}\
                .jBanner-content,.jBanner-content-whole{position:absolute;transition:all 0.3s ease-in-out;-webkit-transition:all 0.3s ease-in-out;}\
                .jBanner-fade{opacity:1;left:0;}\
                .jBanner-fade-hide{opacity:0;left:0;}\
                .jBanner-slide{left:0;}\
                .jBanner-slide-hide{left:-100%;}\
                .jBanner-slide ~ .jBanner-slide-hide{left:100%;}\
                .jBanner-vertical-slide{left:0;top:0;}\
                .jBanner-vertical-slide-hide{left:0;top:-100%;}\
                .jBanner-vertical-slide ~ .jBanner-vertical-slide-hide{left:0;top:100%;}\
                .jBanner-box{width:' + Math.ceil(opts.imgWidth / 4) + 'px;height:' + Math.ceil(opts.imgHeight / 4) + 'px;}\
                .jBanner-box-hide{transform:scale(0,0);-webkit-transform:scale(0,0);}\
                .jBanner-blind,.jBanner-stripe{width:100%;height:' + Math.ceil(opts.imgHeight / 4) + 'px;}\
                .jBanner-blind-hide{height:0;}\
                .jBanner-stripe-hide-left{transform:translate(-' + opts.imgWidth + 'px);-webkit-transform:translate(-' + opts.imgWidth + 'px);}\
                .jBanner-stripe-hide-right{transform:translate(' + opts.imgWidth + 'px);-webkit-transform:translate(' + opts.imgWidth + 'px);}\
                .jBanner-vertical-stripe,.jBanner-vertical-blind{height:100%;width:' + Math.ceil(opts.imgWidth / 4) + 'px;}\
                .jBanner-vertical-blind-hide{width:0;}\
                .jBanner-vertical-stripe-hide-up{transform:translate(0,-' + opts.imgHeight + 'px);-webkit-transform:translate(0,-' + opts.imgHeight + 'px);}\
                .jBanner-vertical-stripe-hide-down{transform:translate(0,' + opts.imgHeight + 'px);-webkit-transform:translate(0,' + opts.imgHeight + 'px);}\
                </style>}'

      var wrapper = $(this);
      var picNum = opts.imgURL.length;
      if (!this.already) {
        this.already = true;
        $('head').append(myCss);
      } else {
        $('.jBanner-ctrl').remove();
        $('.jBanner-content').remove();
        $('.jBanner-preload').remove();
      }

      for (var i = 0; i < picNum; i++) {
        var tmp = document.createElement('div');
        $(tmp).addClass('jBanner-preload');
        $(tmp).css({
          'background-image': 'url(' + opts.imgURL[i] + ')',
          'background-size': opts.imgWidth + 'px ' + opts.imgHeight + 'px'
        });
        wrapper.append(tmp);
      }
      var ctrlBar = $(document.createElement('div'));
      ctrlBar.addClass('jBanner-ctrl');
      for (var i = 0; i < picNum; i++) {
        ctrlBar.append('<span></span>');
      }
      wrapper.append(ctrlBar);
      var ctrlItems = ctrlBar.find('span');
      ctrlItems.each(function(index, ele) {
        ele.index = index;
        if (index == 0) {
          ele.className = 'jBanner-ctrl-selected';
        }
      });
      var autoIndex = 0;
      var autoTimer;
      clearTimeout(autoTimer);

      function autoPlay() {
        autoIndex = (autoIndex + 1) % 5;
        ctrlItems.eq(autoIndex).click();
        clearTimeout(autoTimer);
        autoTimer = setTimeout(autoPlay, opts.interval);
      }
      ;

      if (opts.mode == 'fade' || opts.mode == 'slide' || opts.mode == 'vertical-slide') {
        var components = $('.jBanner-preload');
        components.addClass('jBanner-content-whole jBanner-' + opts.mode + '-hide');
        components.eq(0).removeClass('jBanner-' + opts.mode + '-hide').addClass('jBanner-' + opts.mode);
        ctrlBar.off('click', 'span');
        ctrlBar.on('click', 'span', function(e) {
          var target = e.target || e.srcElement;
          autoIndex = target.index;
          clearTimeout(autoTimer);
          if (opts.autoPlay) {
            autoTimer = setTimeout(autoPlay, opts.interval);
          }
          ctrlItems.removeClass('jBanner-ctrl-selected');
          $(target).addClass('jBanner-ctrl-selected');
          components.removeClass('jBanner-' + opts.mode).addClass('jBanner-' + opts.mode + '-hide');
          components.eq(target.index).removeClass('jBanner-' + opts.mode + '-hide').addClass('jBanner-' + opts.mode);
        });
      } else if (opts.mode == 'box') {
        var component,
          left,
          top;
        for (var i = 0; i < 16; i++) {
          left = Math.ceil(opts.imgWidth / 4 * (i % 4));
          top = Math.ceil(opts.imgHeight / 4) * Math.floor(i / 4);
          component = document.createElement('div');
          $(component).addClass('jBanner-content jBanner-box');
          $(component).css({
            'left': left + 'px',
            'top': top + 'px',
            'background-image': 'url(' + opts.imgURL[0] + ')',
            'background-size': opts.imgWidth + 'px ' + opts.imgHeight + 'px',
            'background-position': '-' + left + 'px ' + '-' + top + 'px'
          });
          wrapper.append(component);
        }
        ctrlBar.off('click', 'span');
        ctrlBar.on('click', 'span', function(e) {
          var target = e.target || e.srcElement;
          autoIndex = target.index;
          clearTimeout(autoTimer);
          if (opts.autoPlay) {
            autoTimer = setTimeout(autoPlay, opts.interval);
          }
          ctrlItems.removeClass('jBanner-ctrl-selected');
          $(target).addClass('jBanner-ctrl-selected');
          var cops = $('.jBanner-box');
          cops.addClass('jBanner-box-hide');
          setTimeout(function() {
            cops.css('background-image', 'url(./img/' + target.index + '.jpg)');
          }, 280);
          setTimeout(function() {
            cops.removeClass('jBanner-box-hide');
          }, 300);
        });
      } else if (opts.mode == 'blind') {
        var component,
          top;
        for (var i = 0; i < 4; i++) {
          top = Math.ceil(opts.imgHeight / 4) * i;
          component = document.createElement('div');
          $(component).addClass('jBanner-content jBanner-blind');
          $(component).css({
            'top': top + 'px',
            'background-image': 'url(' + opts.imgURL[0] + ')',
            'background-size': opts.imgWidth + 'px ' + opts.imgHeight + 'px',
            'background-position': '0 ' + '-' + top + 'px'
          });
          wrapper.append(component);
        }
        ctrlBar.off('click', 'span');
        ctrlBar.on('click', 'span', function(e) {
          var target = e.target || e.srcElement;
          autoIndex = target.index;
          clearTimeout(autoTimer);
          if (opts.autoPlay) {
            autoTimer = setTimeout(autoPlay, opts.interval);
          }
          ctrlItems.removeClass('jBanner-ctrl-selected');
          $(target).addClass('jBanner-ctrl-selected');
          var cops = $('.jBanner-blind');
          cops.addClass('jBanner-blind-hide');
          setTimeout(function() {
            cops.css('background-image', 'url(./img/' + target.index + '.jpg)');
          }, 280);
          setTimeout(function() {
            cops.removeClass('jBanner-blind-hide');
          }, 300);
        });
      } else if (opts.mode == 'vertical-blind') {
        var component,
          left;
        for (var i = 0; i < 4; i++) {
          left = Math.ceil(opts.imgWidth / 4) * i;
          component = document.createElement('div');
          $(component).addClass('jBanner-content jBanner-vertical-blind');
          $(component).css({
            'left': left + 'px',
            'background-image': 'url(' + opts.imgURL[0] + ')',
            'background-size': opts.imgWidth + 'px ' + opts.imgHeight + 'px',
            'background-position': '-' + left + 'px ' + '0px'
          });
          wrapper.append(component);
        }
        ctrlBar.off('click', 'span');
        ctrlBar.on('click', 'span', function(e) {
          var target = e.target || e.srcElement;
          autoIndex = target.index;
          clearTimeout(autoTimer);
          if (opts.autoPlay) {
            autoTimer = setTimeout(autoPlay, opts.interval);
          }
          ctrlItems.removeClass('jBanner-ctrl-selected');
          $(target).addClass('jBanner-ctrl-selected');
          var cops = $('.jBanner-vertical-blind');
          cops.addClass('jBanner-vertical-blind-hide');
          setTimeout(function() {
            cops.css('background-image', 'url(./img/' + target.index + '.jpg)');
          }, 280);
          setTimeout(function() {
            cops.removeClass('jBanner-vertical-blind-hide');
          }, 300);
        });
      } else if (opts.mode == 'stripe') {
        var component,
          top;
        for (var i = 0; i < 4; i++) {
          top = Math.ceil(opts.imgHeight / 4) * i;
          component = document.createElement('div');
          $(component).addClass('jBanner-content jBanner-stripe');
          $(component).css({
            'top': top + 'px',
            'background-image': 'url(' + opts.imgURL[0] + ')',
            'background-size': opts.imgWidth + 'px ' + opts.imgHeight + 'px',
            'background-position': '0 ' + '-' + top + 'px'
          });
          wrapper.append(component);
        }
        ctrlBar.off('click', 'span');
        ctrlBar.on('click', 'span', function(e) {
          var target = e.target || e.srcElement;
          autoIndex = target.index;
          clearTimeout(autoTimer);
          if (opts.autoPlay) {
            autoTimer = setTimeout(autoPlay, opts.interval);
          }
          ctrlItems.removeClass('jBanner-ctrl-selected');
          $(target).addClass('jBanner-ctrl-selected');
          var cops = $('.jBanner-stripe');
          cops.each(function(index, ele) {
            if (index % 2 == 0) {
              $(ele).addClass('jBanner-stripe-hide-left');
            } else {
              $(ele).addClass('jBanner-stripe-hide-right');
            }
          });
          setTimeout(function() {
            cops.css('background-image', 'url(./img/' + target.index + '.jpg)');
          }, 280);
          setTimeout(function() {
            cops.each(function(index, ele) {
              if (index % 2 == 0) {
                $(ele).removeClass('jBanner-stripe-hide-left');
              } else {
                $(ele).removeClass('jBanner-stripe-hide-right');
              }
            });
          }, 300);
        });
      } else if (opts.mode == 'vertical-stripe') {
        var component,
          left;
        for (var i = 0; i < 4; i++) {
          left = Math.ceil(opts.imgWidth / 4) * i;
          component = document.createElement('div');
          $(component).addClass('jBanner-content jBanner-vertical-stripe');
          $(component).css({
            'left': left + 'px',
            'background-image': 'url(' + opts.imgURL[0] + ')',
            'background-size': opts.imgWidth + 'px ' + opts.imgHeight + 'px',
            'background-position': '-' + left + 'px' + ' 0px'
          });
          wrapper.append(component);
        }
        ctrlBar.off('click', 'span');
        ctrlBar.on('click', 'span', function(e) {
          var target = e.target || e.srcElement;
          autoIndex = target.index;
          clearTimeout(autoTimer);
          if (opts.autoPlay) {
            autoTimer = setTimeout(autoPlay, opts.interval);
          }
          ctrlItems.removeClass('jBanner-ctrl-selected');
          $(target).addClass('jBanner-ctrl-selected');
          var cops = $('.jBanner-vertical-stripe');
          cops.each(function(index, ele) {
            if (index % 2 == 0) {
              $(ele).addClass('jBanner-vertical-stripe-hide-up');
            } else {
              $(ele).addClass('jBanner-vertical-stripe-hide-down');
            }
          });
          setTimeout(function() {
            cops.css('background-image', 'url(./img/' + target.index + '.jpg)');
          }, 280);
          setTimeout(function() {
            cops.each(function(index, ele) {
              if (index % 2 == 0) {
                $(ele).removeClass('jBanner-vertical-stripe-hide-up');
              } else {
                $(ele).removeClass('jBanner-vertical-stripe-hide-down');
              }
            });
          }, 300);
        });
      }
      if (opts.autoPlay) {
        setTimeout(autoPlay, opts.interval);
      }
    }
  });

  $.fn.jBannerInit.defaults = {
    imgURL: [],
    imgWidth: 800,
    imgHeight: 400,
    mode: 'fade',
    autoPlay: true,
    interval: 3000
  }
}($);
