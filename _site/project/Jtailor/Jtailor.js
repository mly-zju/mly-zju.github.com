;;
!function($) {
  $.fn.extend({
    "avatar_init": function(options) {
      var opts = $.extend({}, $.fn.avatar_init.defaults, options);

      // var src_url = opts.src_url;
      var post_url = opts.post_url;
      var post_name = opts.post_name;
      var size_level = opts.size_level;
      var component_width;
      var component_height;
      var component_font_size;
      var success=opts.success;
      var fail=opts.fail;

      if (size_level == 'big') {
        component_width = '150px';
        component_height = '180px';
        component_font_size = '16px';
      } else if (size_level == 'small') {
        component_width = '70px';
        component_height = '90px';
        component_font_size = '12px';
      } else {
        component_width = '100px';
        component_height = '130px';
        component_font_size = '15px';
      }

      var my_css = ' <style> \
            .jtailor-layer{display:none;position:fixed;z-index:100;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);font-family:"微软雅黑";}\
            .jtailor-layer .lywrap{overflow:hidden;width:600px;height:510px;padding:15px 0;margin:auto;position:absolute;left:0;right:0;top:0;bottom:0;background-color:#fafafa; text-align:center;box-shadow:10px 10px 10px;border-radius:5px;}\
            .jtailor-layer .lywrap h5{padding:0;margin-top:0;}\
            .jtailor-layer.z-show{display:block;}\
            .jtailor-layer .resizer{overflow: hidden;position:relative;}\
            .jtailor-layer .inner{width:400px;height:400px;margin-left:20px;position:relative;font-size: 0;overflow: hidden;background-color:#C2C2C2;}\
            .jtailor-layer .resizer.have-img .inner {display: block;}\
            .jtailor-layer  img{position:relative;display:none;}\
            .jtailor-layer .have-img img{display:block;}\
            .jtailor-layer .frames{position: absolute;top: 0;left: 0;cursor: move;outline: rgba(0, 0, 0, 0.7) solid 10000px;display:none;}\
            .jtailor-layer .have-img .frames{display:block}\
            .jtailor-layer .info_pic_file { margin:200px auto 0;}\
            .jtailor-layer .info_pic_submit { display:none; }\
            .jtailor-layer .microImage{ position:absolute;left:460px;top:0;width:100px;text-align:center;}\
            .jtailor-layer .pre-view-big { position:absolute;left:435px; top:30px; height:150px; width:150px; background-color:#C2C2C2;}\
            .jtailor-layer .pre-view-middle { position:absolute;left:460px; top:205px; height:100px; width:100px; background-color:#C2C2C2;}\
            .jtailor-layer .pre-view-small { position:absolute;left:475px; top:330px; height:70px; width:70px; background-color:#C2C2C2;}\
            .jtailor-layer .have-img .info_pic_file {display:none;}\
            .jtailor-layer .u-minus, .jtailor-layer .u-plus { padding:1px 6px;margin:10px; background-color:#7F7F7F; color:white; border:none;font-size:16px;}\
            .jtailor-layer .u-submit, .u-cancel {  float:right; border:none; color:white;font-family:"微软雅黑"; }\
            .jtailor-layer .u-submit { padding:3px 10px;margin-right:8px; background-color: #EE7600; }\
            .jtailor-layer .u-cancel { padding:3px 10px;margin-right: 20px;  background-color:#949494;}\
            .jtailor_avatar_wrapper{float:left;position:relative;}\
        	  .jtailor_avatar{width:' + component_width + ';height:' + component_width + ';display:inline-block;background-color:#C2C2C2;text-align:center}\
        	  .jtailor_avatar_upload{position:absolute;width:100%;font-size:' + component_font_size + ';font-family:"微软雅黑";padding:2px 0;bottom:0;left:0;background-color:rgb(61,147,215);color:white;border:none;outline:none;}\
            </style>';

      var my_html = '<div class="jtailor-layer">\
              <div class="lywrap">\
                <h5>裁剪头像</h5>\
                <div class="resizer">\
                  <div class="inner">\
                    <img src="">\
                    <div class="frames"></div>\
                    <form class="info_pic_form" action="' + post_url + '">\
                    <input type="file" accept="image/*" class="info_pic_file" name="' + post_name + '/>\
                    <input type="submit" class="info_pic_submit" />\
                    </form>\
                  </div>\
                  <h5 class="microImage">缩略图</h5>\
                  <canvas class="pre-view-big" width="150" height="150"></canvas>\
                  <canvas class="pre-view-middle" width="100" height="100"></canvas>\
                  <canvas class="pre-view-small" width="70" height="70"></canvas>\
                  <button class="u-minus">&ndash;</button>\
                  <button class="u-plus">&#43;</button>\
                </div>\
                <button class="u-cancel">取消</button>\
                <button class="u-submit">确定</button>\
              </div>\
          </div>';


      $('head').append(my_css);
      var t = $(this);
      t.css({
        'width': component_width,
        'height': component_height
      });
      t.after(my_html);
      var my_demo=$('.jtailor_avatar');
      $('.jtailor_avatar_upload').click(function() {
        $('.jtailor-layer').addClass('z-show');
      });
      var avatar = $('.jtailor-layer .info_pic_file');
      /*****************************************************************/
      var resizer = $('.jtailor-layer .resizer');
      $.imageResizer = function() {
        if (Uint8Array && HTMLCanvasElement && atob && Blob) {

        } else {
          return false;
        }

        resizer.image = resizer.find('img')[0];
        resizer.frames = resizer.find('.frames');
        resizer.canvas_big = resizer.find('.pre-view-big')[0];
        resizer.canvas_middle = resizer.find('.pre-view-middle')[0];
        resizer.canvas_small = resizer.find('.pre-view-small')[0];

        resizer.frames.offset = {
          top: 0,
          left: 0
        };

        $('.jtailor-layer .u-minus').click(function() {
          var tmp = resizer.frames.width();
          tmp = tmp - 20;
          if (tmp < 100)
            tmp = 100;
          resizer.setFrameSize(tmp);
          var tmpSize = resizer.frames.offset.size;
          var x = resizer.frames.offset.left - resizer.image.offsetLeft;
          var y = resizer.frames.offset.top - resizer.image.offsetTop;
          console.log(resizer.frames.offset.top);
          console.log(resizer.image.offsetTop);
          resizer.drawPreview(x, y, tmpSize);
        });

        $('.jtailor-layer .u-plus').click(function() {
          var tmp = resizer.frames.width();
          var max = resizer.getDefaultSize();
          tmp = tmp + 20;
          //   console.log(resizer.image.offsetLeft);
          //   console.log(resizer.frames.offset.left);
          if (tmp > max) {
            tmp = max;
          }
          if (tmp + resizer.frames.offset.left > resizer.image.offsetLeft + resizer.image.offsetWidth) {
            tmp = resizer.image.offsetLeft + resizer.image.offsetWidth - resizer.frames.offset.left;
          }
          if (tmp + resizer.frames.offset.top > resizer.image.offsetTop + resizer.image.offsetHeight) {
            tmp = resizer.image.offsetTop + resizer.image.offsetHeight - resizer.frames.offset.top;
          }
          resizer.setFrameSize(tmp);
          var tmpSize = resizer.frames.offset.size;
          var x = resizer.frames.offset.left - resizer.image.offsetLeft;
          var y = resizer.frames.offset.top - resizer.image.offsetTop;
          resizer.drawPreview(x, y, tmpSize);
        });

        $('.jtailor-layer .u-submit').click(function() {
          resizer.clipImage();
          var ctx_big = resizer.canvas_big.getContext('2d');
          var ctx_middle = resizer.canvas_middle.getContext('2d');
          var ctx_small = resizer.canvas_small.getContext('2d');
          ctx_big.clearRect(0, 0, 150, 150);
          ctx_middle.clearRect(0, 0, 100, 100);
          ctx_small.clearRect(0, 0, 70, 70);
          $('.u-cancel').click();
          var url = post_url;
          if (!url || !resizedImage) return;
          var fd = new FormData();
          fd.append(post_name, resizedImage);
          if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
          } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
          }
          xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 ) {
              if( xmlhttp.status == 200){
                success(xmlhttp.responseText);
              }else{
                fail(xmlhttp.status);
              }
            }
          }
          xmlhttp.open("POST", url);
          xmlhttp.send(fd);
        });

        $('.jtailor-layer .u-cancel').click(function() {
          resizer.removeClass('have-img');
          $('.jtailor-layer').removeClass('z-show');
          $('input:file').val(''); //记得清空input
          var ctx_big = resizer.canvas_big.getContext('2d');
          var ctx_middle = resizer.canvas_middle.getContext('2d');
          var ctx_small = resizer.canvas_small.getContext('2d');
          ctx_big.clearRect(0, 0, 150, 150);
          ctx_middle.clearRect(0, 0, 100, 100);
          ctx_small.clearRect(0, 0, 70, 70);
        });

        resizer.drawPreview = function(x, y, w) {
          var scale = this.image.naturalWidth / this.image.offsetWidth;
          var ctx_big = this.canvas_big.getContext('2d');
          var ctx_middle = this.canvas_middle.getContext('2d');
          var ctx_small = this.canvas_small.getContext('2d');
          x = x * scale;
          y = y * scale;
          w = w * scale;
          ctx_big.drawImage(this.image, x, y, w, w, 0, 0, 150, 150);
          ctx_middle.drawImage(this.image, x, y, w, w, 0, 0, 100, 100);
          ctx_small.drawImage(this.image, x, y, w, w, 0, 0, 70, 70);
        }

        resizer.clipImage = function() {
          var nh = this.image.naturalHeight,
            nw = this.image.naturalWidth;
          var scale = nw / this.image.offsetWidth;
          var ctx;
          var size;
          if (size_level == 'big') {
            ctx = this.canvas_big.getContext('2d');
            size = 150;
          } else if (size_level == 'middle') {
            ctx = this.canvas_middle.getContext('2d');
            size = 100;
          } else {
            ctx = this.canvas_small.getContext('2d');
            size = 70;
          }
          var x = (this.frames.offset.left-this.image.offsetLeft) * scale,
            y = (this.frames.offset.top-this.image.offsetTop) * scale,
            w = this.frames.offset.size * scale;


          // if (this.image.offsetWidth > this.image.offsetHeight) {
          //   y = 0;
          // } else {
          //   x = 0;
          // }
          ctx.drawImage(this.image, x, y, w, w, 0, 0, size, size);
          type = "image/jpeg";
          var src;
          if (size_level == 'big') {
            src = this.canvas_big.toDataURL(type);
          } else if (size_level == 'middle') {
            src = this.canvas_middle.toDataURL(type);
          } else {
            src = this.canvas_small.toDataURL(type);
          }
          if (my_demo.length>0) {
            $(my_demo).attr('src', src);
          }
          src = src.split(',')[1];
          if (!src) return this.doneCallback(null);
          src = window.atob(src);

          var ia = new Uint8Array(src.length);
          for (var i = 0; i < src.length; i++) {
            ia[i] = src.charCodeAt(i);
          }
          ;
          var blob = new Blob([ia], {
            type: "image/jpeg"
          });
          this.doneCallback(blob);
        };

        resizer.resize = function(file, done) {
          if (file.size > 5242880) {
            alert('图片大小超出限制！');
            return
          }
          this.reset();
          this.doneCallback = done;
          this.setFrameSize(0);
          var reader = new FileReader();
          //var tmpSize = 0;
          reader.onload = function(e) {
            var tmpSize = 0;
            var reloadInfo = 0;
            resizer.image.src = e.target.result;
            //reader = null;
            resizer.addClass('have-img');
            $('.jtailor-layer').addClass('z-show');
            //var tmpSize=resizer.getDefaultSize();
            if (resizer.image.naturalWidth > resizer.image.naturalHeight) {
              resizer.image.style.height = "";
              resizer.image.style.width = "400px";
              tmpSize = resizer.image.offsetHeight;
              reloadInfo = resizer.image.naturalHeight;
              //   console.log(tmpSize);
              resizer.image.style.top = 200 - tmpSize / 2 + "px";
              resizer.image.style.left = 0;
              resizer.frames.offset.top=200-tmpSize/2;
              resizer.frames.offset.left=0;
              resizer.frames.css({
                'top': 200 - tmpSize / 2 + 'px',
                'left': 0
              });
            } else {
              resizer.image.style.width = "";
              resizer.image.style.height = "400px";
              tmpSize = resizer.image.offsetWidth;
              reloadInfo = resizer.image.naturalWidth;
              resizer.image.style.left = 200 - tmpSize / 2 + "px";
              resizer.image.style.top = 0;
              resizer.frames.offset.left=200-tmpSize/2;
              resizer.frames.offset.top=0;
              resizer.frames.css({
                'left': 200 - tmpSize / 2 + 'px',
                'top': 0
              });
            }
            resizer.setFrameSize(tmpSize);
            resizer.drawPreview(0, 0, tmpSize);
            if (tmpSize == 400 && reloadInfo != 400) {
              //   console.log('reload');
              reader.readAsDataURL(file);
            }
          };
          reader.readAsDataURL(file);
        };

        resizer.reset = function() {
          this.image.src = '';
          this.removeClass('have-img');
        };

        resizer.setFrameSize = function(size) {
          this.frames.offset.size = size;
          return this.frames.css({
            width: size + 'px',
            height: size + 'px'
          });
        };

        resizer.getDefaultSize = function() {
          var width = resizer.image.offsetWidth;
          var height = resizer.image.offsetHeight;
          return width > height ? height : width;
        };

        resizer.moveFrames = function(offset) {
          var x = offset.x,
            y = offset.y,
            top = this.frames.offset.top,
            left = this.frames.offset.left,
            size = this.frames.offset.size,
            picWidth = this.image.offsetWidth,
            picHeight = this.image.offsetHeight,
            picTop = this.image.offsetTop,
            picLeft = this.image.offsetLeft;

          if (x + size + left > picLeft + picWidth) {
            x = picLeft + picWidth - size;
          } else if (x + left < picLeft) {
            x = picLeft;
          } else {
            x = x + left;
          }
          ;

          if (y + size + top > picTop + picHeight) {
            y = picTop + picHeight - size;
          } else if (top + y < picTop) {
            y = picTop;
          } else {
            y = y + top;
          }
          ;
          this.frames.css({
            top: y + 'px',
            left: x + 'px'
          });

          this.frames.offset.top = y;
          this.frames.offset.left = x;
        };

        (function() {
          var lastPoint = null;
          function getOffset(event) {
            event = event.originalEvent;
            var x, y;
            if (event.touches) {
              var touch = event.touches[0];
              x = touch.clientX;
              y = touch.clientY;
            } else {
              x = event.clientX;
              y = event.clientY;
            }
            if (!lastPoint) {
              lastPoint = {
                x: x,
                y: y
              };
            }
            ;
            var offset = {
              x: x - lastPoint.x,
              y: y - lastPoint.y
            }
            lastPoint = {
              x: x,
              y: y
            };
            return offset;
          }
          ;
          resizer.frames.on('touchstart mousedown', function(event) {
            getOffset(event);
          });
          resizer.frames.on('touchmove mousemove', function(event) {
            if (!lastPoint) return;
            var offset = getOffset(event);
            resizer.moveFrames(offset);
            var tmpSize = resizer.frames.offset.size;
            var x = resizer.frames.offset.left - resizer.image.offsetLeft;
            var y = resizer.frames.offset.top - resizer.image.offsetTop;
            resizer.drawPreview(x, y, tmpSize);
          });
          resizer.frames.on('touchend mouseup', function(event) {
            lastPoint = null;
          });
        })();
        return resizer;
      };

      var resizer = $.imageResizer();
      var resizedImage;
      var canvasTest = true;
      try {
        document.createElement('canvas').getContext('2d');
        avatar.change(function(event) {
          var file = this.files[0];
          resizer.resize(file, function(file) {
            resizedImage = file;
          });
        });
      } catch (e) {
        avatar.change(function() {
          $("#info_pic_submit").click();
        });
      }
      //console.log('hello', resizedImage);
      //return resizer;
      return resizedImage;
    }
  });

  $.fn.avatar_init.defaults = {
    post_url: '',
    post_name: '',
    size_level: 'middle',
    success: function(data){},
    fail: function(data){}
  }
}(window.jQuery);
