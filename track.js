(function (global) {

function Track(context) {
  context || (context = document);

  var isDocument = context == document,
      track = this,
      contextPos = { x: 0, y: 0 };

  function addEvent(type, fn) {
    // context is scoped in Track object
    context.addEventListener(type, fn, false);
    return addEvent;
  }

  function updateContextXY() {
    var ctx = context;
    if (isDocument) ctx = context.body;

    var left = 0, top = 0;
    if (ctx.offsetParent) {
      do {
        left += ctx.offsetLeft;
        top  += ctx.offsetTop;
      } while (ctx = ctx.offsetParent);
    }

    contextPos = {
      x : left,
      y : top
    };
  };

  function getXY(event) {
    event = event.pageX ? event : event.touches.length ? event.touches[0] : { pageX: 0, pageY: 0 };
    return {
      x: event.pageX - document.body.scrollLeft - contextPos.x,
      y: event.pageY - document.body.scrollTop - contextPos.y,
    }
  }
  
  function down(event) {
    track.down = true;

    // reset the momentum until they release
    track.momentumX = track.momentumY = 0;

    updateContextXY();

    var coords = getXY(event);
    track.x = track.downX = coords.x;
    track.y = track.downY = coords.y;
    track.startTime = +new Date;
  }

  function up(event) {
    track.down = false;
    track.duration = +new Date - track.startTime;

    track.upX = track.x;
    track.upY = track.y;

    // work out the momentum
    var left = track.weight * (track.downX - track.x),
        adjustX = Math.round(left / (track.duration * 10)),
        top =  track.weight * (track.downY - track.y),
        adjustY = Math.round(top / (track.duration * 10));

    track.momentumX = adjustX;
    track.momentumY = adjustY;
  }

  function move(event) {
    var coords = getXY(event);
    track.x = coords.x;
    track.y = coords.y;
  }

  updateContextXY();

  // hook up event listeners
  addEvent(track.events.down, down)(track.events.up, up)(track.events.move, move)('keydown', function (event) {
    track.key[event.which] = true;
  })('keyup', function () {
    track.key[event.which] = false;
  });
}

var touch = 'createTouch' in document;

Track.prototype = {
  key: {}, // note that key tracking isn't perfect yet - probably won't be :(
  x: 0,
  y: 0,
  startTime: 0,
  duration: 0,
  downX: 0,
  downY: 0,
  upX: 0,
  upY: 0,
  momentumX: 0,
  momentumY: 0,
  down: false,
  touch: touch,
  events: {
    up: touch ? 'touchend' : 'mouseup',
    down: touch ? 'touchstart' : 'mousedown',
    move: touch ? 'touchmove' : 'mousemove',
  },
  weight: 120, // this is arbitrary, but simple to change
  toString: function () {
    return JSON.stringify(this);
  }
}

global.Track = Track;

})(this);
