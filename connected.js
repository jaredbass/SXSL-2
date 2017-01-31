'use strict';
//no const in Safari 
//

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PI2 = 2 * Math.PI;
function map(s, a1, a2, b1, b2) {
  return b1 + (s - a1) * (b2 - b1) / (a2 - a1);
}

var Connect = function () {
  function Connect() {
    _classCallCheck(this, Connect);

    ctx.lineWidth = 0.1;

    this.connectArea = {
      maxConnectionLength: 100,
      connectAreaRadius: 80,
      x: 0,
      y: 0,
      destX: 0,
      destY: 0
    };

    this.bounds = {
      top: 2,
      left: 2,
      right: 0,
      bottom: 0
    };

    this.dots = [];

    this.resize();
    this.connectArea.x = this.centerX;
    this.connectArea.y = this.centerY;
  }

  _createClass(Connect, [{
    key: 'resize',
    value: function resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.centerX = this.width / 2 | 0;
      this.centerY = this.height / 2 | 0;

      canvas.width = this.width;
      canvas.height = this.height;
      canvas.backgroundColor = "white";

      this.connectArea.destX = this.centerX;
      this.connectArea.destY = this.centerY;

      this.bounds.right = this.width - 2;
      this.bounds.bottom = this.height - 2;

      this.colorCounter = 0;
      this.dotCount = this.width * this.height / 4550 | 0;

      if (this.dotCount > this.dots.length) {
        for (var i = this.dotCount - this.dots.length; i > 0; i--) {
          this.dots.push(new Dot(this.width, this.height, (this.colorCounter += 2) < 360 ? this.colorCounter : this.colorCounter = 0));
        }
      } else if (this.dotCount < this.dots.length) {

        this.dots.splice(0, this.dotCount - this.dots.length);

        for (var _i = 0; _i < this.dotCount; _i++) {
          if (this.dots[_i].y < this.bounds.top || this.dots[_i].y > this.bounds.bottom || this.dots[_i].x < this.bounds.left || this.dots[_i].x > this.bounds.right) {
            this.dots[_i].x = Math.random() * this.width | 0;
            this.dots[_i].y = Math.random() * this.height | 0;
          }
        }
      }
    }
  }, {
    key: 'onMove',
    value: function onMove(evt) {
      this.connectArea.destX = evt.clientX || evt.touches && evt.touches[0].pageX;
      this.connectArea.destY = evt.clientY || evt.touches && evt.touches[0].pageY;
    }
  }, {
    key: 'onLeave',
    value: function onLeave(evt) {
      this.connectArea.destX = this.centerX;
      this.connectArea.destY = this.centerY;
    }
  }, {
    key: 'connectDots',
    value: function connectDots() {
      for (var i = 0; i < this.dotCount; i++) {
        for (var j = i + 1; j < this.dotCount; j++) {

          var dot1 = this.dots[i];
          var dot2 = this.dots[j];

          var xDiff = Math.abs(dot1.x - dot2.x);
          var yDiff = Math.abs(dot1.y - dot2.y);
          var xDiffArea = Math.abs(dot1.x - this.connectArea.x);
          var yDiffArea = Math.abs(dot1.y - this.connectArea.y);

          if (xDiff < this.connectArea.maxConnectionLength && yDiff < this.connectArea.maxConnectionLength && xDiffArea < this.connectArea.connectAreaRadius && yDiffArea < this.connectArea.connectAreaRadius) {

            var gradient = ctx.createLinearGradient(dot1.x, dot1.y, dot2.x, dot1.y);
            gradient.addColorStop(0, dot1.color);
            gradient.addColorStop(1, dot2.color);

            ctx.beginPath();
            ctx.moveTo(dot1.x, dot1.y);
            ctx.lineTo(dot2.x, dot2.y);
            ctx.strokeStyle = gradient;
            ctx.stroke();
          }
        }
      }
    }
  }, {
    key: 'update',
    value: function update() {

      // ctx.globalCompositeOperation = 'hard-light'
      ctx.fillStyle = 'rgba(150,20,112,.3)';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, this.width, this.height);

      var distX = this.connectArea.destX - this.connectArea.x;
      if (distX > 5 || distX < 5) this.connectArea.x += distX / 10 | 0;
      var distY = this.connectArea.destY - this.connectArea.y;
      if (distX > 5 || distX < 5) this.connectArea.y += distY / 10 | 0;

      for (var i = 0; i < this.dotCount; i++) {
        this.dots[i].update(this.bounds);
      }this.connectDots();

      for (var _i2 = 0; _i2 < this.dotCount; _i2++) {
        this.dots[_i2].draw();
      }
    }
  }]);

  return Connect;
}();

var Dot = function () {
  function Dot(width, height, color) {
    _classCallCheck(this, Dot);

    this.x = Math.random() * width | 0;
    this.y = Math.random() * height | 0;
    this.vx = (Math.random() - 0.7) / 4;
    this.vy = (Math.random() - 0.7) / 4;
    this.radius = Math.random() * 2 + 0.3;
    this.color = 'rgba(238,238,240,' + Math.random() + ')';
  }

  _createClass(Dot, [{
    key: 'draw',
    value: function draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, PI2);
      ctx.fill();
    }
  }, {
    key: 'update',
    value: function update(bounds) {
      if (this.y < bounds.top || this.y > bounds.bottom) this.vy = -this.vy;else if (this.x < bounds.left || this.x > bounds.right) this.vx = -this.vx;
      this.x += this.vx;
      this.y += this.vy;
    }
  }]);

  return Dot;
}();

var canvas = document.getElementById('connect');
var ctx = canvas.getContext('2d');

var connect = new Connect();

// can not use this => operator in safari 
//consider using jquery for operation 

$('#connect').on("mousemove", function (evt) {
  connect.onMove(evt);
});
$('#connect').on("mouseleave", function (evt) {
  connect.onLeave(evt);
});
$('#connect').on("touchstart", function (evt) {
  connect.onMove(evt);
});
$('#connect').on("touchmove", function (evt) {
  connect.on(evt);
});

// $("#connect").onmousemove( function(event){
//   console.log("yoo");
// });

// canvas.onmousemove = (evt) => connect.onMove(evt)
// canvas.onmouseleave = (evt) => connect.onLeave(evt)
// canvas.ontouchstart = (evt) => connect.onMove(evt)
// canvas.ontouchmove = (evt) => connect.onLeave(evt)

window.onresize = function () {
  return connect.resize();
};(function update() {
  requestAnimationFrame(update);
  connect.update();
})();