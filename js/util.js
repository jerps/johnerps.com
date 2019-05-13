
var Util = {};

(function() {


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


})();

