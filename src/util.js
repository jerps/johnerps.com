/*

Utilities

(c) 2019 John Erps

This software is licensed under the MIT license (see LICENSE)

*/

let Util = {};
export default Util;

Util.unscramble = function(x) {
  var s = '', i;
  for (i = 0; i < x.length; i+=2) {
    if (i < x.length - 1) {
      s += String.fromCharCode(x[i+1]);
    }
    s += String.fromCharCode(x[i]);
  }
  return s;
};

Util.randomIntArray = function(m) {
  var r = [], n = 0, i, j, x;
  while (n <= m) {
    r.splice(Math.trunc(Util.rnd()*(r.length+1)), 0, n);
    i = 0;
    while (i < r.length) {
      if (Util.rnd() < 0.5) {
        j = i === 0 ? r.length - 1 : i - 1;
        x = r[j];
        r[j] = r[i];
        r[i] = x;
      }
      i++;
    }
    n++;
  }
  return r;
};

/*! getEmPixels  | Author: Tyson Matanich (http://matanich.com), 2013 | License: MIT */
/* modified by j erps */
Util.getEmPixels = function(e) {

    // Form the style on the fly to result in smaller minified file
    var important = '!important;';
    var style = 'position:absolute' + important + 'visibility:hidden' + important + 'width:1em' + important + 'font-size:1em' + important + 'padding:0' + important;

    // Create and style a test element
    var testElement = document.createElement('i');
    testElement.style.cssText = style;
    e.appendChild(testElement);

    // Get the client width of the test element
    var value = testElement.clientWidth;

    // Remove the test element
    e.removeChild(testElement);

    // Return the em value in pixels
    return value;
};

Util.pixScale = function(cctx) {
  return (window.devicePixelRatio || 1) / (cctx.webkitBackingStorePixelRatio||cctx.mozBackingStorePixelRatio||cctx.msBackingStorePixelRatio||cctx.oBackingStorePixelRatio||cctx.backingStorePixelRatio||1);
};

Util.rnd = mulberry32(performance.now() % (Math.pow(2, 32) - 1));

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316
function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
