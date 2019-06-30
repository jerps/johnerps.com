import animateText from '@js/animate-text.js';
import FloatImgs from '@js/floating-imgs.js';
import Util from '@js/util.js';
import tippy from '@nm/tippy.js';
import RssTicker from '@em/rss-ticker';

var el = {};

var HACK = false; //??

var t = [
  '\u29A2  all-round programmer  ',
  ' \u00A9 2017-2019 John Erps   ',
  '  LinkedIn ',
  ' GitHub ',
  ' IBM i on Power Systems ',
  '',
  Util.unscramble([51,43,32,49,32,54,48,52,50,50,52,51,50,50])+'  ',
  '    \u22C5 \u22C5 \u22C5  Projects  \u22C5 \u22C5 \u22C5    ',
  Util.unscramble([111,106,110,104,101,46,112,114,64,115,109,103,105,97,46,108,111,99,109])+'  ',
  ' \u29A2  IBM i (AS/400) ',
  ' specialist   ',
  '  '+Util.unscramble([111,106,110,104,106,64,104,111,101,110,112,114,46,115,111,99,109])+' ',
  ' RPG\u22C5Java\u22C5Javascript\u22C5Python\u22C5C\u22C5SQL\u22C5HTML\u22C5CSS  ',
  '',
  ' RpgMap ',
  'A versatile in-memory key/value store for RPG',
  ' Yagols ',
  'Yet another Game of Life simulator'
];

var rgb0 = [0, 0, 0], nrgb0 = [0, 0, 0], drgb0 = [120, 20, 20],
    rgb1 = [120, 20, 20], nrgb1 = [0, 0, 0], drgb1 = [120, 20, 20],
    rgbab = [120, 20, 20, 1],
    fontFamily = 'Armata', nfontFamily = 'Poppins', dfontFamily = 'Poppins',
    fontProps = '',
    letterSpacing = 6.4, letterSpacing2 = 10,
    borderw = 1;

var anim = {};

var resizet = null;

var mouseoveranimtxtcanvasid = '';
var wave = 0;

var dw = 10000, dne = 200,
    d0 = 3000, d1 = 500, d2 = 1000, d3 = 600, d4 = 300, d5 = 1000, d6 = 2000, d7 = 500,
    d9 = 600, d10 = 3000, d11 = 1200, d12 = 2000, d13 = 1000;

var r0a = 0.2, r0b = 0.02, r0c = 0.07, r0d = 0.07, r0e = 0.04, r1 = 0.4, r2 = 0.5, r3 = 0.35;

var ready = false, ak, lmpx, lmpy, lmmt = performance.now(), lmmtd = 50, e;

var gaugenum = 5, oneknob = new Set([1,2,3]);

function updFloatImgs_gt(y) {
  var x;
  if (el.gauge1y0 >= 0) {
    FloatImgs.fgt((x = el.gauge1v0 + (el.gauge1y0 - y) / el.gauge1.getBoundingClientRect().height) < 0 ? 0 : x > 1 ? 1 : x);
  }
  updGauge1Knob();
}

function updFloatImgs_gr(y) {
  var x;
  if (el.gauge2y0 >= 0) {
    FloatImgs.fgr((x = el.gauge2v0 + (el.gauge2y0 - y) / el.gauge2.getBoundingClientRect().height) < 0 ? 0 : x > 1 ? 1 : x);
  }
  updGauge2Knob();
}

function updFloatImgs_gmi(y) {
  var x;
  if (el.gauge3y0 >= 0) {
    FloatImgs.fgmi((x = el.gauge3v0 + (el.gauge3y0 - y) / el.gauge3.getBoundingClientRect().height) < 0 ? 0 : x > 1 ? 1 : x);
  }
  updGauge3Knob();
}

function updFloatImgs_gd0(y) {
  var x;
  if (el.gauge4y0 >= 0) {
    FloatImgs.fgd0((x = el.gauge4v0 + (el.gauge4y0 - y) / el.gauge4.getBoundingClientRect().height) < 0 ? 0 : x > 1 ? 1 : x);
  }
  updGauge4Knob();
}

function updFloatImgs_gd1(y) {
  var x;
  if (el.gauge4y1 >= 0) {
    FloatImgs.fgd1((x = el.gauge4v1 + (el.gauge4y1 - y) / el.gauge4.getBoundingClientRect().height) < 0 ? 0 : x > 1 ? 1 : x);
  }
  updGauge4Knob();
}

function updFloatImgs_gmc0(y) {
  var x;
  if (el.gauge5y0 >= 0) {
    FloatImgs.fgmc0((x = el.gauge5v0 + (el.gauge5y0 - y) / el.gauge5.getBoundingClientRect().height) < 0 ? 0 : x > 1 ? 1 : x);
  }
  updGauge5Knob();
}

function updFloatImgs_gmc1(y) {
  var x;
  if (el.gauge5y1 >= 0) {
    FloatImgs.fgmc1((x = el.gauge5v1 + (el.gauge5y1 - y) / el.gauge5.getBoundingClientRect().height) < 0 ? 0 : x > 1 ? 1 : x);
  }
  updGauge5Knob();
}

function updGauge1Knob() {
  el.gauge1knob0.style.top = '' + (el.gauge1.getBoundingClientRect().height * (1 - FloatImgs.gt)).toFixed(3) + 'px';
  el.gauge1txt.textContent = 'Interval : ' + FloatImgs.t.toFixed(1) + ' sec' + (FloatImgs.t === 1 ? '' : 's');
}

function updGauge2Knob() {
  el.gauge2knob0.style.top = '' + (el.gauge2.getBoundingClientRect().height * (1 - FloatImgs.gr)).toFixed(3) + 'px';
  el.gauge2txt.textContent = 'Probability : ' + FloatImgs.r.toFixed(3);
}

function updGauge3Knob() {
  el.gauge3knob0.style.top = '' + (el.gauge3.getBoundingClientRect().height * (1 - FloatImgs.gmi)).toFixed(3) + 'px';
  el.gauge3txt.textContent = 'Max ' + FloatImgs.mi.toFixed(0) + ' image' + (FloatImgs.mi === 1 ? '' : 's');
}

function updGauge4Knob() {
  el.gauge4knob0.style.top = '' + (el.gauge4.getBoundingClientRect().height * (1 - FloatImgs.gd0)).toFixed(3) + 'px';
  el.gauge4knob1.style.top = '' + (el.gauge4.getBoundingClientRect().height * (1 - FloatImgs.gd1)).toFixed(3) + 'px';
  let t = 'Duration : ' + FloatImgs.d0.toFixed(0);
  if (FloatImgs.d0 !== FloatImgs.d1) {
    t += ' - ' + FloatImgs.d1.toFixed(0);
  }
  el.gauge4txt.textContent = t + ' sec' + (FloatImgs.d0 !== FloatImgs.d1 || FloatImgs.d0 !== 1 ? 's' : '');
}

function updGauge5Knob() {
  el.gauge5knob0.style.top = '' + (el.gauge5.getBoundingClientRect().height * (1 - FloatImgs.gmc0)).toFixed(3) + 'px';
  el.gauge5knob1.style.top = '' + (el.gauge5.getBoundingClientRect().height * (1 - FloatImgs.gmc1)).toFixed(3) + 'px';
  t = 'Motion complexity : ' + FloatImgs.mc0.toFixed(2);
  if (FloatImgs.mc0 !== FloatImgs.mc1) {
    t += ' - ' + FloatImgs.mc1.toFixed(2);
  }
  el.gauge5txt.textContent = t;
}

function updGaugeKnobs() {
  updGauge1Knob();
  updGauge2Knob();
  updGauge3Knob();
  updGauge4Knob();
  updGauge5Knob();
}

function gaugeSelect(n) {
  el['gauge'+n].classList.remove('gaugeselx');
  el['gauge'+n+'in'].classList.remove('gaugeinselx');
  el['gauge'+n+'knob0'].classList.remove('gaugeknobselx');
  el['gauge'+n+'knobin0'].classList.remove('gaugeknobinselx');
  if (!oneknob.has(n)) {
    el['gauge'+n+'knob1'].classList.remove('gaugeknobselx');
    el['gauge'+n+'knobin1'].classList.remove('gaugeknobinselx');
  }
  el['gauge'+n].classList.add('gaugesel');
  el['gauge'+n+'in'].classList.add('gaugeinsel');
  el['gauge'+n+'knob0'].classList.add('gaugeknobsel');
  el['gauge'+n+'knobin0'].classList.add('gaugeknobinsel');
  el['gauge'+n+'txt'].classList.add('gaugetxtsel');
  if (!oneknob.has(n)) {
    el['gauge'+n+'knob1'].classList.add('gaugeknobsel');
    el['gauge'+n+'knobin1'].classList.add('gaugeknobinsel');
  }
}

function gaugeUnselect(n) {
  el['gauge'+n+'l'] = false;
  el['gauge'+n].classList.remove('gaugesel');
  el['gauge'+n+'in'].classList.remove('gaugeinsel');
  el['gauge'+n+'knob0'].classList.remove('gaugeknobsel');
  el['gauge'+n+'knobin0'].classList.remove('gaugeknobinsel');
  el['gauge'+n+'txt'].classList.remove('gaugetxtsel');
  if (!oneknob.has(n)) {
    el['gauge'+n+'knob1'].classList.remove('gaugeknobsel');
    el['gauge'+n+'knobin1'].classList.remove('gaugeknobinsel');
  }
  el['gauge'+n].classList.add('gaugeselx');
  el['gauge'+n+'in'].classList.add('gaugeinselx');
  el['gauge'+n+'knob0'].classList.add('gaugeknobselx');
  el['gauge'+n+'knobin0'].classList.add('gaugeknobinselx');
  if (!oneknob.has(n)) {
    el['gauge'+n+'knob1'].classList.add('gaugeknobselx');
    el['gauge'+n+'knobin1'].classList.add('gaugeknobinselx');
  }
}

function gaugeInit(n) {

  el['gauge'+n+'l'] = false;
  el['gauge'+n+'c'] = 0;
  el['gauge'+n+'y0'] = -1;
  el['gauge'+n+'y1'] = -1;
  el['gauge'+n+'v0'] = -1;
  el['gauge'+n+'v1'] = -1;

  el['gauge'+n] = document.querySelector('#gauge'+n);
  el['gauge'+n+'in'] = document.querySelector('#gauge'+n+'in');
  el['gauge'+n+'knob0'] = document.querySelector('#gauge'+n+'knob0');
  el['gauge'+n+'knobin0'] = document.querySelector('#gauge'+n+'knobin0');
  el['gauge'+n+'txt'] = document.querySelector('#gauge'+n+'txt');
  if (!oneknob.has(n)) {
    el['gauge'+n+'knob1'] = document.querySelector('#gauge'+n+'knob1');
    el['gauge'+n+'knobin1'] = document.querySelector('#gauge'+n+'knobin1');
  }

  el['gauge'+n+'knob0'].addEventListener('mouseenter', function(e) {
    e.preventDefault();
    el['gauge'+n+'c']++;
    if (el['gauge'+n+'c'] === 1 && !el['gauge'+n+'l']) {
      gaugeSelect(n);
    }
    el['gauge'+n+'l'] = false;
  }, false);

  if (!oneknob.has(n)) {
    el['gauge'+n+'knob1'].addEventListener('mouseenter', function(e) {
      e.preventDefault();
      el['gauge'+n+'c']++;
      if (el['gauge'+n+'c'] === 1 && !el['gauge'+n+'l']) {
        gaugeSelect(n);
      }
      el['gauge'+n+'l'] = false;
    }, false);
  }

  el['gauge'+n].addEventListener('mouseenter', function(e) {
    e.preventDefault();
    el['gauge'+n+'c']++;
    if (el['gauge'+n+'c'] === 1 && !el['gauge'+n+'l']) {
      gaugeSelect(n);
    }
    el['gauge'+n+'l'] = false;
  }, false);

  el['gauge'+n+'knob0'].addEventListener('mouseleave', function(e) {
    e.preventDefault();
    el['gauge'+n+'c']--;
    if (el['gauge'+n+'y0'] === -1) {
      el['gauge'+n+'knob0'].classList.remove('gaugeknobsel2');
      el['gauge'+n+'knobin0'].classList.remove('gaugeknobinsel2');
      if (el['gauge'+n+'c'] === 0) {
        gaugeUnselect(n);
      }
    } else if (el['gauge'+n+'c'] === 0) {
      el['gauge'+n+'l'] = true;
    }
  }, false);

  if (!oneknob.has(n)) {
    el['gauge'+n+'knob1'].addEventListener('mouseleave', function(e) {
      e.preventDefault();
      el['gauge'+n+'c']--;
      if (el['gauge'+n+'y1'] === -1) {
        el['gauge'+n+'knob1'].classList.remove('gaugeknobsel2');
        el['gauge'+n+'knobin1'].classList.remove('gaugeknobinsel2');
        if (el['gauge'+n+'c'] === 0) {
          gaugeUnselect(n);
        }
      } else if (el['gauge'+n+'c'] === 0) {
        el['gauge'+n+'l'] = true;
      }
    }, false);
  }

  el['gauge'+n].addEventListener('mouseleave', function(e) {
    e.preventDefault();
    el['gauge'+n+'c']--;
    if (el['gauge'+n+'y0'] === -1 && (oneknob.has(n) || el['gauge'+n+'y1'] === -1)) {
      el['gauge'+n+'knob0'].classList.remove('gaugeknobsel2');
      el['gauge'+n+'knobin0'].classList.remove('gaugeknobinsel2');
      if (!oneknob.has(n)) {
        el['gauge'+n+'knob1'].classList.remove('gaugeknobsel2');
        el['gauge'+n+'knobin1'].classList.remove('gaugeknobinsel2');
      }
      if (el['gauge'+n+'c'] === 0) {
        gaugeUnselect(n);
      }
    } else if (el['gauge'+n+'c'] === 0) {
      el['gauge'+n+'l'] = true;
    }
  }, false);

  el['gauge'+n+'knob0'].addEventListener('mousedown', function(e) {
    e.preventDefault();
    el['gauge'+n+'knob0'].classList.add('gaugeknobsel2')
    el['gauge'+n+'knobin0'].classList.add('gaugeknobinsel2');
    el['gauge'+n+'y0'] = e.pageY;
    el['gauge'+n+'v0'] = FloatImgs['g'+n+'0'];
    el['gauge'+n+'y1'] = -1;
    el['gauge'+n+'v1'] = -1;
  }, false);

  if (!oneknob.has(n)) {
    el['gauge'+n+'knob1'].addEventListener('mousedown', function(e) {
      e.preventDefault();
      el['gauge'+n+'knob1'].classList.add('gaugeknobsel2')
      el['gauge'+n+'knobin1'].classList.add('gaugeknobinsel2');
      el['gauge'+n+'y1'] = e.pageY;
      el['gauge'+n+'v1'] = FloatImgs['g'+n+'1'];
      el['gauge'+n+'y0'] = -1;
      el['gauge'+n+'v0'] = -1;
    }, false);
  }

}

let gaugeknobTTimer = null;
FloatImgs.tCallback = function() {
  if (gaugeknobTTimer) {
    clearTimeout(gaugeknobTTimer);
  } else {
    el.gauge1knobin0.classList.add('gaugeknobinblink');
  }
  gaugeknobTTimer = setTimeout(function() {
    gaugeknobTTimer = null;
    el.gauge1knobin0.classList.remove('gaugeknobinblink');
  }, 200);
}

let gaugeknobRTimer = null;
FloatImgs.rCallback = function() {
  if (gaugeknobRTimer) {
    clearTimeout(gaugeknobRTimer);
  } else {
    el.gauge2knobin0.classList.add('gaugeknobinblink');
  }
  gaugeknobRTimer = setTimeout(function() {
    gaugeknobRTimer = null;
    el.gauge2knobin0.classList.remove('gaugeknobinblink');
  }, 200);
}

window.onload = function() {

  tip('#download-rpgmap', 'Download RpgMap from Github');
  tip('#github-rpgmap', 'Go to RpgMap Repository on GitHub');
  tip('#download-yagols', 'Download Yagols from Github');
  tip('#github-yagols', 'Go to Yagols Repository on GitHub');

  reganim('email1', {
    text: t[11],
    border: [borderw, 0, 0, 0],
    fontSize: 1.1,
    yp: 0,
    rgb0: rgb0, rgb1: rgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: fontFamily, fontProps: fontProps, letterSpacing: letterSpacing
  });
  reganim('pgml', {
    text: t[12],
    border: [borderw, 0, 0, 0],
    fontSize: 1,
    yp: 0,
    rgb0: rgb0, rgb1: rgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: 'Open Sans Condensed, Bold', fontProps: fontProps, letterSpacing: letterSpacing
  });
  reganim('pgmr', {
    text: t[0],
    border: [0, 0, 0, 0],
    fontSize: 1.1,
    yp: -0.1,
    rgb0: rgb0, rgb1: rgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: fontFamily, fontProps: 'italic', letterSpacing: letterSpacing
  });
  reganim('email2', {
    text: t[8],
    border: [0, 0, 0, 0],
    fontSize: 0.95,
    yp: -0.4,
    rgb0: rgb0, rgb1: rgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: fontFamily, fontProps: fontProps, letterSpacing: letterSpacing
  });
  reganim('telno', {
    text: t[6],
    border: [0, 0, borderw, 0],
    fontSize: 1,
    yp: 0,
    rgb0: rgb0, rgb1: rgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: fontFamily, fontProps: fontProps, letterSpacing: letterSpacing
  });
  reganim('specla', {
    text: t[9],
    border: [0, 0, borderw, 0],
    fontSize: 1,
    yp: 0,
    rgb0: rgb0, rgb1: rgb1, rgbab: rgbab,
    rgb1chars: 'i',
    fontFamily: fontFamily, fontProps: 'italic', letterSpacing: letterSpacing
  });
  reganim('speclb', {
    text: t[10],
    border: [0, 0, borderw, 0],
    fontSize: 1,
    yp: 0,
    rgb0: rgb0, rgb1: rgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: fontFamily, fontProps: 'italic', letterSpacing: letterSpacing
  });
  reganim('prt', {
    text: t[7],
    border: [0, 0, 0, 0],
    fontSize: 1.6,
    yp: 0,
    rgb0: rgb0, rgb1: rgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: 'Poppins', fontProps: 'bold', letterSpacing: letterSpacing2
  });
  reganim('nrpgmap', {
    text: t[14],
    border: [0, 0, 0, 0],
    fontSize: 1.25,
    yp: -0.65,
    rgb0: nrgb0, rgb1: nrgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: nfontFamily, fontProps: fontProps, letterSpacing: letterSpacing2
  });
  reganim('drpgmap', {
    text: t[15],
    border: [0, 0, 0, 0],
    fontSize: 1.1,
    yp: 0,
    rgb0: drgb0, rgb1: drgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: dfontFamily, fontProps: fontProps, letterSpacing: letterSpacing2
  });
  reganim('dyagols', {
    text: t[17],
    border: [0, 0, 0, 0],
    fontSize: 1.1,
    yp: 0,
    rgb0: drgb0, rgb1: drgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: dfontFamily, fontProps: fontProps, letterSpacing: letterSpacing2
  });
  reganim('nyagols', {
    text: t[16],
    border: [0, 0, 0, 0],
    fontSize: 1.25,
    yp: -0.65,
    rgb0: nrgb0, rgb1: nrgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: nfontFamily, fontProps: fontProps, letterSpacing: letterSpacing2
  });
  reganim('linkedin', {
    text: t[2],
    border: [0, 0, borderw, 0],
    fontSize: 1,
    yp: 0,
    rgb0: rgb0, rgb1: rgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: fontFamily, fontProps: fontProps, letterSpacing: letterSpacing
  });
  reganim('github', {
    text: t[3],
    border: [0, 0, borderw, 0],
    fontSize: 1,
    yp: 0,
    rgb0: rgb0, rgb1: rgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: fontFamily, fontProps: fontProps, letterSpacing: letterSpacing
  });
  reganim('ibmi', {
    text: t[4],
    border: [0, 0, borderw, 0],
    fontSize: 1,
    yp: 0,
    rgb0: rgb0, rgb1: rgb1, rgbab: rgbab,
    rgb1chars: 'i',
    fontFamily: fontFamily, fontProps: fontProps, letterSpacing: letterSpacing
  });
  reganim('cpyr', {
    text: t[1],
    border: [0, 0, borderw, 0],
    fontSize: 0.7,
    yp: -0.3,
    rgb0: rgb0, rgb1: rgb1, rgbab: rgbab,
    rgb1chars: '',
    fontFamily: fontFamily, fontProps: fontProps, letterSpacing: letterSpacing
  });

  ak = Object.keys(anim);

  document.querySelectorAll('canvas.animatedText').forEach(function(e) {
    e.addEventListener('mouseover', function(e) {
      if (!ready) {
        return;
      }
      if (e.target.id === mouseoveranimtxtcanvasid) {
        return;
      }
      mouseoveranimtxtcanvasid = e.target.id;
      animate(e.target.id, 5/*fade out*/, d3);
      setTimeout(function() {
        animate(e.target.id, 6/*random chars*/, d4);
      }, d3);
      setTimeout(function() {
        animate(e.target.id, -1/*no effect*/, dne);
      }, d3+d4);
    }, false);
    e.addEventListener('mouseleave', function(e) {
      if (e.target.id === mouseoveranimtxtcanvasid) {
        mouseoveranimtxtcanvasid = '';
      }
    }, false);
  });

  window.addEventListener('resize', function() {
    if (!ready) {
      return;
    }
    animateAll(6/*random chars*/, d5);
    if (resizet) {
      clearTimeout(resizet);
      resizet = null;
    };
    resizet = setTimeout(function() {
      resizet = null;
      animateAll(4/*fade in*/, d6);
    }, d5);
  }, false);

  window.addEventListener('mousemove', function(e) {
    var x = performance.now();
    if (!ready || x - lmmt < d13) {
      return;
    }
    lmmt = x;
    if (lmpx && lmpy) {
      lmmtd = ((lmmtd = d13*(Math.abs(lmpx-e.pageX)/screen.width+Math.abs(lmpy-e.pageY)/screen.height)/2) < 50 ? 50 : lmmtd) * 2;
      animateAll(5/*fade out*/, d13);
      setTimeout(function() {
        animateAll(-1/*no effect*/, dne);
      }, lmmtd);
    }
    lmpx = e.pageX;
    lmpy = e.pageY;
  }, false);

  el.gaugecont = document.querySelector('#gaugecont');
  el.gaugebtntxt = document.querySelector('#gaugebtntxt');
  el.zapp = document.querySelector('#zapp');
  el.gaugestore = document.querySelector('#gaugestore');
  el.gaugeload = document.querySelector('#gaugeload');
  el.gaugeldft = document.querySelector('#gaugeldft');

  el.gaugecont.addEventListener('mousemove', function(e) {
    e.preventDefault();
    if (el.gauge1y0 >= 0) {
      updFloatImgs_gt(e.pageY);
    }
    if (el.gauge2y0 >= 0) {
      updFloatImgs_gr(e.pageY);
    }
    if (el.gauge3y0 >= 0) {
      updFloatImgs_gmi(e.pageY);
    }
    if (el.gauge4y0 >= 0) {
      updFloatImgs_gd0(e.pageY);
    }
    if (el.gauge4y1 >= 0) {
      updFloatImgs_gd1(e.pageY);
    }
    if (el.gauge5y0 >= 0) {
      updFloatImgs_gmc0(e.pageY);
    }
    if (el.gauge5y1 >= 0) {
      updFloatImgs_gmc1(e.pageY);
    }
  }, false);

  el.gaugecont.addEventListener('mouseup', function(e) {
    e.preventDefault();
    el.zapp.classList.remove('gaugebtnsel2');
    el.gaugestore.classList.remove('gaugebtnsel2');
    el.gaugeload.classList.remove('gaugebtnsel2');
    el.gaugeldft.classList.remove('gaugebtnsel2');
    if (el.gauge1y0 >= 0) {
      updFloatImgs_gt(e.pageY);
      el.gauge1y0 = el.gauge1y1 = el.gauge1v0 = el.gauge1v = -1;
      el.gauge1knob0.classList.remove('gaugeknobsel2');
      el.gauge1knobin0.classList.remove('gaugeknobinsel2');
    }
    if (el.gauge1l) {
      el.gauge1l = false;
      gaugeUnselect(1);
    }
    if (el.gauge2y0 >= 0) {
      updFloatImgs_gr(e.pageY);
      el.gauge2y0 = el.gauge2y1 = el.gauge2v0 = el.gauge2v = -1
      el.gauge2knob0.classList.remove('gaugeknobsel2');
      el.gauge2knobin0.classList.remove('gaugeknobinsel2');
    }
    if (el.gauge2l) {
      el.gauge2l = false;
      gaugeUnselect(2);
    }
    if (el.gauge3y0 >= 0) {
      updFloatImgs_gmi(e.pageY);
      el.gauge3y0 = el.gauge3y1 = el.gauge3v0 = el.gauge3v1 = -1;
      el.gauge3knob0.classList.remove('gaugeknobsel2')
      el.gauge3knobin0.classList.remove('gaugeknobinsel2');
    }
    if (el.gauge3l) {
      el.gauge3l = false;
      gaugeUnselect(3);
    }
    if (el.gauge4y0 >= 0) {
      updFloatImgs_gd0(e.pageY);
      el.gauge4y0 = el.gauge4v0 = -1;
      el.gauge4knob0.classList.remove('gaugeknobsel2');
      el.gauge4knobin0.classList.remove('gaugeknobinsel2');
    }
    if (el.gauge4y1 >= 0) {
      updFloatImgs_gd1(e.pageY);
      el.gauge4y1 = el.gauge4v1 = -1;
      el.gauge4knob1.classList.remove('gaugeknobsel2');
      el.gauge4knobin1.classList.remove('gaugeknobinsel2');
    }
    if (el.gauge4l) {
      el.gauge4l = false;
      gaugeUnselect(4);
    }
    if (el.gauge5y0 >= 0) {
      updFloatImgs_gmc0(e.pageY);
      el.gauge5y0 = el.gauge5v0 = -1;
      el.gauge5knob0.classList.remove('gaugeknobsel2');
      el.gauge5knobin0.classList.remove('gaugeknobinsel2');
    }
    if (el.gauge5y1 >= 0) {
      updFloatImgs_gmc1(e.pageY);
      el.gauge5y1 = el.gauge5v1 = -1;
      el.gauge5knob1.classList.remove('gaugeknobsel2');
      el.gauge5knobin1.classList.remove('gaugeknobinsel2');
    }
    if (el.gauge5l) {
      el.gauge5l = false;
      gaugeUnselect(5);
    }
 }, false);

  el.gaugecont.addEventListener('mouseenter', function(e) {
    e.preventDefault();
    el.gaugecont.classList.add('gaugecontx');
    el.zapp.classList.add('gaugebtnselx');
    el.gaugestore.classList.add('gaugebtnselx');
    el.gaugeload.classList.add('gaugebtnselx');
    el.gaugeldft.classList.add('gaugebtnselx');
    el.gauge1.classList.add('gaugeselx');
    el.gauge1in.classList.add('gaugeinselx');
    el.gauge1knob0.classList.add('gaugeknobselx');
    el.gauge1knobin0.classList.add('gaugeknobinselx');
    el.gauge2.classList.add('gaugeselx');
    el.gauge2in.classList.add('gaugeinselx');
    el.gauge2knob0.classList.add('gaugeknobselx');
    el.gauge2knobin0.classList.add('gaugeknobinselx');
    el.gauge3.classList.add('gaugeselx');
    el.gauge3in.classList.add('gaugeinselx');
    el.gauge3knob0.classList.add('gaugeknobselx');
    el.gauge3knobin0.classList.add('gaugeknobinselx');
    el.gauge4.classList.add('gaugeselx');
    el.gauge4in.classList.add('gaugeinselx');
    el.gauge4knob0.classList.add('gaugeknobselx');
    el.gauge4knobin0.classList.add('gaugeknobinselx');
    el.gauge4knob1.classList.add('gaugeknobselx');
    el.gauge4knobin1.classList.add('gaugeknobinselx');
    el.gauge5.classList.add('gaugeselx');
    el.gauge5in.classList.add('gaugeinselx');
    el.gauge5knob0.classList.add('gaugeknobselx');
    el.gauge5knobin0.classList.add('gaugeknobinselx');
    el.gauge5knob1.classList.add('gaugeknobselx');
    el.gauge5knobin1.classList.add('gaugeknobinselx');
  }, false);

  el.gaugecont.addEventListener('mouseleave', function(e) {
    e.preventDefault();
    el.gauge1y0 = el.gauge1y1 = el.gauge1v0 = el.gauge1v1 = -1;
    el.gauge2y0 = el.gauge2y1 = el.gauge2v0 = el.gauge2v1 = -1;
    el.gauge3y0 = el.gauge3y1 = el.gauge3v0 = el.gauge3v1 = -1;
    el.gauge4y0 = el.gauge4y1 = el.gauge4v0 = el.gauge4v1 = -1;
    el.gauge5y0 = el.gauge5y1 = el.gauge5v0 = el.gauge5v1 = -1;
    el.zapp.classList.remove('gaugebtnsel2');
    el.gaugestore.classList.remove('gaugebtnsel2');
    el.gaugeload.classList.remove('gaugebtnsel2');
    el.gaugeldft.classList.remove('gaugebtnsel2');
    el.gauge1knob0.classList.remove('gaugeknobsel2');
    el.gauge1knobin0.classList.remove('gaugeknobinsel2');
    el.gauge2knob0.classList.remove('gaugeknobsel2');
    el.gauge2knobin0.classList.remove('gaugeknobinsel2');
    el.gauge3knob0.classList.remove('gaugeknobsel2');
    el.gauge3knobin0.classList.remove('gaugeknobinsel2');
    el.gauge4knob0.classList.remove('gaugeknobsel2');
    el.gauge4knobin0.classList.remove('gaugeknobinsel2');
    el.gauge4knob1.classList.remove('gaugeknobsel2');
    el.gauge4knobin1.classList.remove('gaugeknobinsel2');
    el.gauge5knob0.classList.remove('gaugeknobsel2');
    el.gauge5knobin0.classList.remove('gaugeknobinsel2');
    el.gauge5knob1.classList.remove('gaugeknobsel2');
    el.gauge5knobin1.classList.remove('gaugeknobinsel2');
    el.zapp.classList.remove('gaugebtnsel');
    el.gaugestore.classList.remove('gaugebtnsel');
    el.gaugeload.classList.remove('gaugebtnsel');
    el.gaugeldft.classList.remove('gaugebtnsel');
    gaugeUnselect(1);
    gaugeUnselect(2);
    gaugeUnselect(3);
    gaugeUnselect(4);
    gaugeUnselect(5);
    el.gaugecont.classList.remove('gaugecontx');
    el.zapp.classList.remove('gaugebtnselx');
    el.gaugestore.classList.remove('gaugebtnselx');
    el.gaugeload.classList.remove('gaugebtnselx');
    el.gaugeldft.classList.remove('gaugebtnselx');
    el.gauge1.classList.remove('gaugeselx');
    el.gauge1in.classList.remove('gaugeinselx');
    el.gauge1knob0.classList.remove('gaugeknobselx');
    el.gauge1knobin0.classList.remove('gaugeknobinselx');
    el.gauge2.classList.remove('gaugeselx');
    el.gauge2in.classList.remove('gaugeinselx');
    el.gauge2knob0.classList.remove('gaugeknobselx');
    el.gauge2knobin0.classList.remove('gaugeknobinselx');
    el.gauge3.classList.remove('gaugeselx');
    el.gauge3in.classList.remove('gaugeinselx');
    el.gauge3knob0.classList.remove('gaugeknobselx');
    el.gauge3knobin0.classList.remove('gaugeknobinselx');
    el.gauge4.classList.remove('gaugeselx');
    el.gauge4in.classList.remove('gaugeinselx');
    el.gauge4knob0.classList.remove('gaugeknobselx');
    el.gauge4knobin0.classList.remove('gaugeknobinselx');
    el.gauge4knob1.classList.remove('gaugeknobselx');
    el.gauge4knobin1.classList.remove('gaugeknobinselx');
    el.gauge5.classList.remove('gaugeselx');
    el.gauge5in.classList.remove('gaugeinselx');
    el.gauge5knob0.classList.remove('gaugeknobselx');
    el.gauge5knobin0.classList.remove('gaugeknobinselx');
    el.gauge5knob1.classList.remove('gaugeknobselx');
    el.gauge5knobin1.classList.remove('gaugeknobinselx');
  }, false);

  el.zapp.addEventListener('mouseenter', function(e) {
    e.preventDefault();
    el.zapp.classList.remove('gaugebtnselx');
    el.zapp.classList.add('gaugebtnsel');
    el.gaugebtntxt.textContent = 'Zapp floating images';
    el.gaugebtntxt.classList.add('gaugetxtsel');
  }, false);
  el.gaugestore.addEventListener('mouseenter', function(e) {
    e.preventDefault();
    el.gaugestore.classList.remove('gaugebtnselx');
    el.gaugestore.classList.add('gaugebtnsel');
    el.gaugebtntxt.textContent = 'Store settings with cookie';
    el.gaugebtntxt.classList.add('gaugetxtsel');
  }, false);
  el.gaugeload.addEventListener('mouseenter', function(e) {
    e.preventDefault();
    el.gaugeload.classList.remove('gaugebtnselx');
    el.gaugeload.classList.add('gaugebtnsel');
    el.gaugebtntxt.textContent = 'Load settings from cookie';
    el.gaugebtntxt.classList.add('gaugetxtsel');
  }, false);
  el.gaugeldft.addEventListener('mouseenter', function(e) {
    e.preventDefault();
    el.gaugeldft.classList.remove('gaugebtnselx');
    el.gaugeldft.classList.add('gaugebtnsel');
    el.gaugebtntxt.textContent = 'Load default settings';
    el.gaugebtntxt.classList.add('gaugetxtsel');
  }, false);

  el.zapp.addEventListener('mouseleave', function(e) {
    e.preventDefault();
    el.zapp.classList.remove('gaugebtnsel2');
    el.zapp.classList.remove('gaugebtnsel');
    el.zapp.classList.add('gaugebtnselx');
    el.gaugebtntxt.classList.remove('gaugetxtsel');
  }, false);
  el.gaugestore.addEventListener('mouseleave', function(e) {
    e.preventDefault();
    el.gaugestore.classList.remove('gaugebtnsel2');
    el.gaugestore.classList.remove('gaugebtnsel');
    el.gaugestore.classList.add('gaugebtnselx');
    el.gaugebtntxt.classList.remove('gaugetxtsel');
  }, false);
  el.gaugeload.addEventListener('mouseleave', function(e) {
    e.preventDefault();
    el.gaugeload.classList.remove('gaugebtnsel2');
    el.gaugeload.classList.remove('gaugebtnsel');
    el.gaugeload.classList.add('gaugebtnselx');
    el.gaugebtntxt.classList.remove('gaugetxtsel');
  }, false);
  el.gaugeldft.addEventListener('mouseleave', function(e) {
    e.preventDefault();
    el.gaugeldft.classList.remove('gaugebtnsel2');
    el.gaugeldft.classList.remove('gaugebtnsel');
    el.gaugeldft.classList.add('gaugebtnselx');
    el.gaugebtntxt.classList.remove('gaugetxtsel');
  }, false);

  el.zapp.addEventListener('mousedown', function(e) {
    e.preventDefault();
    el.zapp.classList.add('gaugebtnsel2');
    if (FloatImgs.zapp) {
      FloatImgs.zapp();
    }
  }, false);
  el.gaugestore.addEventListener('mousedown', function(e) {
    e.preventDefault();
    el.gaugestore.classList.add('gaugebtnsel2');
    createCookieFloatImgs();
  }, false);
  el.gaugeload.addEventListener('mousedown', function(e) {
    e.preventDefault();
    el.gaugeload.classList.add('gaugebtnsel2');
    readCookieFloatImgs();
    updGaugeKnobs();
  }, false);
  el.gaugeldft.addEventListener('mousedown', function(e) {
    e.preventDefault();
    el.gaugeldft.classList.add('gaugebtnsel2');
    FloatImgs.fgt(FloatImgs.dft.gt);
    FloatImgs.fgr(FloatImgs.dft.gr);
    FloatImgs.fgmi(FloatImgs.dft.gmi);
    FloatImgs.fgd0(FloatImgs.dft.gd0);
    FloatImgs.fgd1(FloatImgs.dft.gd1);
    FloatImgs.fgmc0(FloatImgs.dft.gmc0);
    FloatImgs.fgmc1(FloatImgs.dft.gmc1);
    updGaugeKnobs();
  }, false);

  gaugeInit(1);
  gaugeInit(2);
  gaugeInit(3);
  gaugeInit(4);
  gaugeInit(5);

  updGaugeKnobs();

  window.addEventListener('resize', function() {
    updGaugeKnobs();
  });

  document.querySelectorAll('canvas.animatedText').forEach(function(e) {
    e.style.display = 'block';
  });
  document.querySelectorAll('a, img').forEach(function(e) {
    e.setAttribute('tabindex', '-1');
  });

  HACK = true;
  animateAll(0/*random effect*/, d0/3);

  setTimeout(function() {
    HACK = false;
    animateAll(0/*random effect*/, d0/3*2);
  }, d0/3);

  dowave(d0*1.5);

  setInterval(function() {
    var i, p;
    if (!ready) {
      return;
    }
    if (Util.rnd() < r0c) {
      i = Math.trunc(Util.rnd() * ak.length);
      animate(ak[i], 6/*random chars*/, d9);
      setTimeout(function() {
        animate(ak[i], -1/*no effect*/, dne);
      }, d9);
    } else if (Util.rnd() < r0d) {
      i = Math.trunc(Util.rnd() * ak.length);
      p = { rgbab: [255, 255, 255, 1] };
      if (Util.rnd() < r3) {
        p.rgb0 = [255,0,0];
      };
      animate(ak[i], 5/*fade out*/, d10, p);
      setTimeout(function() {
        animate(ak[i], -1/*no effect*/, dne);
      }, d10);
    } else if (Util.rnd() < r0e) {
      i = Math.trunc(Util.rnd() * ak.length);
      p = { rgbab: [255, 255, 255, 1] };
      if (Util.rnd() < r3) {
        p.rgb0 = [255,0,0];
      };
      animate(ak[i], 5/*fade out*/, d11, p);
      setTimeout(function() {
        animate(ak[i], 0/*random effect*/, d12);
      }, d11);
    } else if (Util.rnd() < r0a) {
      i = Math.trunc(Util.rnd() * ak.length);
      animate(ak[i], 4/*fade in*/, d7);
    } else if (Util.rnd() < r0b) {
      dowave(0);
    }
  }, 1500);

  e = document.getElementById('rss');
  e.url = 'http://rss.cnn.com/rss/edition.rss'
  e.proxyUrl = 'https://johnerps.com/php/getfile.php?url=%%_URL_%%';
  e.fetchOpts = { cache: 'no-cache' };
  e.fontFamily = 'Noto Sans';
  e.transparency = 0.1;
  e.startTicker();
  window.RSS = e;
  setTimeout(function() {
    ready = true;
    FloatImgs.start();
  }, dw);

};

function dowave(d) {
  var i, j, c;
  for (i = 0; i < wave; i++) {
    c = null;
    for (j = 0; j < ak.length; j++) {
      if (anim[ak[j]][1] === i) {
        c = ak[j];
        break;
      }
    }
    if (c) {
      (function(c) {
        setTimeout(function() {
          animate(c, 5/*fade out*/, d1);
        }, d+d1/2*i);
        setTimeout(function() {
          animate(c, 4/*fade in*/, d2);
        }, d+d1/2*i+d1);
      })(c);
    }
  }
}

function animateAll(effect, duration) {
  Object.keys(anim).forEach(function(c){animate(c,effect,duration)});
}

function reganim(c, p) {
  anim[c] = [p, wave++];
}

function animate(c, e, d, px) {
  var p = copyap(anim[c][0]);
  p.cName = c;
  p.effect = e;
  p.duration = d;
  if (HACK) {
    p.text = ' '.repeat(p.text.length);
  }
  if (px) {
    Object.assign(p, px);
  }
  animateText(p);
}

function copyap(p) {
  return Object.assign({}, p);
}

function tip(sel, text) {
  tippy(sel, {content: '<span style="color: white; font-size: 0.8rem;">'+text+'</span>'});
}

function createCookieFloatImgs() {
  Util.createCookie(
      'FloatImgs',
      't='     + FloatImgs.gt     + ';' +
      'r='     + FloatImgs.gr     + ';' +
      'mi='    + FloatImgs.gmi    + ';' +
      'd0='    + FloatImgs.gd0    + ';' +
      'd1='    + FloatImgs.gd1    + ';' +
      'mc0='   + FloatImgs.gmc0   + ';' +
      'mc1='   + FloatImgs.gmc1,
      365);
}

function readCookieFloatImgs() {
  var c = Util.readCookie('FloatImgs');
  if (!c) {
    return;
  }
  var a = c.split(';');
  for (var i = 0; i < a.length; i++) {
    var a2 = a[i].split('=');
    switch (a2[0]) {
      case 't':
        FloatImgs.fgt(parseFloat(a2[1]));
        break;
      case 'r':
        FloatImgs.fgr(parseFloat(a2[1]));
        break
      case 'mi':
        FloatImgs.fgmi(parseFloat(a2[1]));
        break;
      case 'd0':
        FloatImgs.fgd0(parseFloat(a2[1]));
        break;
      case 'd1':
        FloatImgs.fgd1(parseFloat(a2[1]));
        break;
      case 'mc0':
        FloatImgs.fgmc0(parseFloat(a2[1]));
        break;
      case 'mc1':
        FloatImgs.fgmc1(parseFloat(a2[1]));
        break;
    }
  }
}
