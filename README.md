# Usage

## Track the entire document

```var track = new Track();
document.addEventListener(track.up, function () {
  alert('You held down for ' + track.duration + 'ms');
}, false);
```

# API

* `new Track(<context>)` - defaults to the `document` returns a new track object which contains live information about the position of cursor

## Mouse & Touch based information

Note that all x/y coordinates are relative to the context passed in to the `Track` object. If you want the x/y relative to the screen, set the context to the document.

* `track.touch` - boolean to indicate touch event support
* `track.x`, `track.x` - last knowning x/y corrdinates - these are updated on any move event on the context, and are available at all times
* `track.downX`, `track.downY` - the x/y corrdinates on the down event
* `track.upX`, `track.upY` - the x/y corrdinates on the up event
* `track.startTime` - the time in milliseconds when the last down event occurred
* `track.duration` - the duration in milliseconds between the down and up event
* `track.down` - boolean to indicate whether the cursor (or finger) is down

## Event names

There are three connivence strings that allow you to easily bind to the right event type depending on whether `track.touch` is true or not. For example `track.events.up` is `mouseup` if `track.touch` is `false`, and `touchend` if `track.touch` is `true`.

* `track.events.up`
* `track.events.down`
* `track.events.move`

## Momentum

* `track.weight` - an arbitrary value that affects the momentum of a move event. The lower the number, the heavier the move event and therefore the lower the momentum. Higher numbers like 1500 give a sense of the move event having momentum ([as seen in the demo](http://remy.github.com/track/))
* `track.momentumX`, `track.momentumY` - values that must be subtracted from the `track.x`/y to get the final x/y position after momentum.

For example:

    var track = new Track();
    document.addEventListener(track.events.up, function () {
      animate({
        start: [track.downX, track.downY],
        end: [track.x - track.momentumX, track.y - track.momentumY]
      });
    }, false);

## Keyboard

Any key pressed will hold a true value whilst down with the keycode (via `event.which`):

For example:

    if (track.key[27]) {
      // user is holding the escape key
    }

## Serialisation

Nothing special, just outputs to JSON:

* `track.toString()` or `track+''` - to get the JSON respresentation of the object

# License

MIT-License: [http://rem.mit-license.org](http://rem.mit-license.org)
