/*

(c) 2017-2019 John Erps

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*

  canvasEffects.animateText({
    cName: "canvas-effects-example",   // canvas element id (nothing happens if not found)
    effect: 1,                         // Effect (1, 2, ... 0=random, -1=no effect)
    text: "example",                   // the text
    duration: 3000,                    // duration in ms
    rgb0: [r, g, b],                   // 3 ints; rgb value for letters and digits: red, green, blue; defaults to [0, 0, 0]
    rgb1: [r, g, b],                   // 3 ints; rgb value for all other chars: red, green, blue; defaults to [0, 0, 0]
    rgbab: [r, g, b, a],               // 4 ints; rgba value for border: red, green, blue, alpha; defaults to [0, 0, 0, 1]
    border: [t, r, b, l],              // 4 ints; border width in px: top, right, bottom, left; defaults to [0, 0, 0, 0]
    rgb1chars: "",                     // string with chars (letters/digits) for which rgb1 explicitly applies
    fontFamily: "Times New Roman",     // font family
    fontProps: "italic bold",          // font properties
    fontSize: 1,                       // font size in px = size of 1rem in px * fontSize; defaults to 1
    letterSpacing: 5,                  // letter spacing in % of font size in px; defaults to 0
    yf: 0                              // if 0 then text is in the middle (sort of), < 0 move to top, > 0 move to bottom; defaults to 0
  });

*/

var CanvasEffects = new function() {

var effects = [

  // E1: Chars pop-up, one by one, in random order (random)
  // E2: Chars come frome above or below, one by one, in random order (random)
  // E3: Chars come frome left or right, one by one, in random order (random)
  // E4: All chars fade in
  // E5: All chars fade out
  // E6: Characters are randomly chosen to be shown, every 10% of the time

  // E0 (impl template; simply shows all chars; can be selected with effect -1)
  function(props/* Properties are assigned as instance variables
        {   canvas context  "ctx"     -> {...},
            char images     "chimgs"  -> [ [image, charwidth, posx], ... },
            font size       "fs"      -> int,
            canvas width    "cwidth"  -> int,
            canvas height   "cheight" -> int,
            border rgba     "rgbab"   -> [ int (red), int (green), int (blue),  0..1 (alpha) ]
            border sizes    "border"  -> [ int (top), int (right), int (bottom), int (left) ],
            y factor        "yf"      -> -1..1
        }*/) {
    eInit(this, props);
    this.random = false; // eligible for random selection if true
    this.prepare = function() {
      // ...
    },
    this.animateFrame = function(t) {
      // t = 0..1; only once called with t === 1
      this.beforeAnimateFrame(true); // ... clear canvas if true ...
      if (this.chimgs.length > 0) {
        var i;
        for (i = 0; i < this.chimgs.length; i++) {
          this.drawChImg(i);
        }
      }
      this.afterAnimateFrame(true);  // ... draw border if true ...
    };
  },

  // E1 (Chars pop-up, one by one, in random order)
  function(props) {
    eInit(this, props);
    this.random = true;
    this.prepare = function() {
      this.x = 1 / this.chimgs.length;
      this.r = randomIntArray(this.chimgs.length-1);
      this.pi = -1;
      this.c = new Map();
    };
    this.animateFrame = function(t) {
      this.beforeAnimateFrame(true);
      if (this.chimgs.length > 0) {
        var i, j, x;
        i = t === 1 ? this.chimgs.length - 1 : Math.trunc(t / this.x);
        if (i !== this.pi) {
          if (this.pi !== -1) {
            this.c.set(this.r[this.pi], true);
          }
          this.pi = i;
        }
        for (j = 0; j < this.chimgs.length; j++) {
          if (t === 1 || this.c.has(j)) {
            this.drawChImg(j);
          }
        }
        if (t !== 1) {
          x = (t - this.x * i) / this.x;
          this.drawChImg(this.r[i], x);
        }
      }
      this.afterAnimateFrame(true);
    };
  },

  // E2 (Chars come frome above or below, one by one, in random order)
  function(props) {
    eInit(this, props);
    this.random = true;
    this.prepare = function() {
      this.x = 1 / this.chimgs.length;
      this.r = randomIntArray(this.chimgs.length-1);
      this.r2 = this.r.reduce(function(a,v){a.push(Math.random()); return a;},[]);
      this.pi = -1;
      this.c = new Map();
    };
    this.animateFrame = function(t) {
      this.beforeAnimateFrame(true);
      if (this.chimgs.length > 0) {
        var i, j, x, p = this.yfp, d;
        i = t === 1 ? this.chimgs.length - 1 : Math.trunc(t / this.x);
        if (i !== this.pi) {
          if (this.pi !== -1) {
            this.c.set(this.r[this.pi], true);
          }
          this.pi = i;
        }
        for (j = 0; j < this.chimgs.length; j++) {
          if (t === 1 || this.c.has(j)) {
            this.drawChImg(j);
          }
        }
        if (t !== 1) {
          x = (t - this.x * i) / this.x;
          d = this.r2[i] < 0.5 ? 1 : -1;
          p += this.cheight * d - this.cheight * d * x;
          this.drawChImg(this.r[i], x, 0, p);
        }
      }
      this.afterAnimateFrame(true);
    };
  },

  // E3 (Chars come frome left or right, one by one, in random order)
  function(props) {
    eInit(this, props);
    this.random = true;
    this.prepare = function() {
      this.x = 1 / this.chimgs.length;
      this.r = randomIntArray(this.chimgs.length-1);
      this.r2 = this.r.reduce(function(a,v){a.push(Math.random()); return a;},[]);
      this.pi = -1;
      this.c = new Map();
    };
    this.animateFrame = function(t) {
      this.beforeAnimateFrame(true);
      if (this.chimgs.length > 0) {
        var i, j, x, p, d;
        i = t === 1 ? this.chimgs.length - 1 : Math.trunc(t / this.x);
        if (i !== this.pi) {
          if (this.pi !== -1) {
            this.c.set(this.r[this.pi], true);
          }
          this.pi = i;
        }
        for (j = 0; j < this.chimgs.length; j++) {
          if (t === 1 || this.c.has(j)) {
            this.drawChImg(j);
          }
        }
        if (t !== 1) {
          x = (t - this.x * i) / this.x;
          d = this.r2[i] < 0.5 ? 1 : -1;
          p = this.chimgs[this.r[i]][2] + this.cwidth * d - this.cwidth * d * x;
          this.drawChImg(this.r[i], x, p, 0);
        }
      }
      this.afterAnimateFrame(true);
    };
  },

  // E4 (All chars fade in)
  function(props) {
    eInit(this, props);
    this.random = false;
    this.prepare = function() {
    };
    this.animateFrame = function(t) {
      this.beforeAnimateFrame(true);
      if (this.chimgs.length > 0) {
        var i;
        for (i = 0; i < this.chimgs.length; i++) {
          this.drawChImg(i, t);
        }
      }
      this.afterAnimateFrame(true);
    };
  },

  // E5 (All chars fade out)
  function(props) {
    eInit(this, props);
    this.random = false;
    this.prepare = function() {
    };
    this.animateFrame = function(t) {
      this.beforeAnimateFrame(true);
      if (this.chimgs.length > 0) {
        var i;
        for (i = 0; i < this.chimgs.length; i++) {
          this.drawChImg(i, 1-t);
        }
      }
      this.afterAnimateFrame(true);
    };
  },

  // E6 (Characters are randomly chosen to be shown, every 200 ms)
  function(props) {
    eInit(this, props);
    this.random = false;
    this.prepare = function() {
      this.x = 1 / this.chimgs.length;
      this.r = null;
    };
    this.animateFrame = function(t) {
      this.beforeAnimateFrame(true);
      if (this.chimgs.length > 0) {
        var i;
        if (!this.r || performance.now() - this.t > 200) {
          this.t = performance.now();
          this.r = randomIntArray(this.chimgs.length-1).reduce(function(a,v){if (Math.random() < 0.5) {a.push(v);}; return a;},[]);
        }
        for (i = 0; i < this.r.length; i++) {
          this.drawChImg(this.r[i]);
        }
      }
      this.afterAnimateFrame(true);
    };
  }

];

var busy = new Map();

var eInit = function(e, props) {
  e.busy = true;
  e.ctx = props['ctx'];
  e.chimgs = props['chimgs'];
  e.fs = props['fs'];
  e.cwidth = props['cwidth'];
  e.cheight = props['cheight'];
  e.rgbab = props['rgbab'];
  e.border = props['border'];
  e.yf = props['yf'];
  e.yfp = Math.trunc((e.cheight - e.fs) / 4);
  e.yfp += e.yf * e.yfp;
  e.beforeAnimateFrame = function(f) {
    if (f) {
      this.ctx.clearRect(0, 0, this.cwidth, this.cheight);
    }
  };
  e.afterAnimateFrame = function(f) {
    if (f) {
      this.drawBorder();
    }
  };
  e.drawChImg = function(i, a, px, py) {
    var img = this.chimgs[i][0], w = this.chimgs[i][1];
    this.ctx.globalAlpha = a === 0 ? 0 : a ? a : 1;
    this.ctx.drawImage(img, 0, 0, Math.round(w+1)+1, Math.round(img.height)+1, Math.round(px ? px : this.chimgs[i][2]), Math.round(py ? py : this.yfp), Math.round(w+1)+1, Math.round(img.height)+1);
  };
  e.drawBorder = function() {
    var i, c = this.ctx, b = this.border, bc = this.rgbab;
    c.globalAlpha = 1;
    c.setLineDash([]);
    for (i = 0; i < 4; i++) {
      if (b[i] > 0) {
        c.lineWidth = b[i];
        c.strokeStyle = 'rgba(' + bc[0] + ', ' + bc[1] + ', ' + bc[2] + ', ' + bc[3] + ')';
        c.beginPath();
        switch (i) {
          case 0:
            c.moveTo(0, 0);
            c.lineTo(this.cwidth, 0);
            break;
          case 1:
            c.moveTo(this.cwidth, 0);
            c.lineTo(this.cwidth, this.cheight);
            break;
          case 2:
            c.moveTo(0, this.cheight);
            c.lineTo(this.cwidth, this.cheight);
            break;
          case 3:
            c.moveTo(0, 0);
            c.lineTo(0, this.cheight);
            break;
        };
        c.stroke();
      }
    }
  };
};

this.animateText = function(settings) {

  if (!settings.cName) {
    return;
  }

  var e = busy.get(settings.cName);
  if (e) {
    e.busy = false;
    busy.delete(settings.cName);
  }

  var c = document.getElementById(settings.cName);

  if (!c) {
    return;
  }

  settings.effect = settings.effect || 0;

  var oc = document.createElement('canvas'), cc = c.getContext('2d'), occ = oc.getContext('2d');
  var fs = Math.trunc(getEmPixels(document.getElementById('container')) * (settings.fontSize && settings.fontSize > 0 ? settings.fontSize : 1));
  var ls = settings.letterSpacing && settings.letterSpacing >= 0 ? Math.trunc(fs * settings.letterSpacing / 100) : 0;
  var chimgs = [], s, i, p, w, h, t, rf, c0, c1;

  s = settings.text || '';

  h = fs * 2;

  if (s) {

    scalec(oc, occ, h, h);
    cc.lineWidth = 1;
    cc.setLineDash([]);
    occ.textBaseline = 'top';
    occ.lineWidth = 1;
    occ.setLineDash([]);
    occ.font = (settings.fontProps.trim().length > 0 ? settings.fontProps.trim() + ' ' : '') + fs + 'px ' + settings.fontFamily.trim();

    c0 = settings.rgb0 && settings.rgb0.length === 3 ? settings.rgb0 : [0, 0, 0];
    c1 = settings.rgb1 && settings.rgb1.length === 3 ? settings.rgb1 : [0, 0, 0];

    p = 0;
    for (i = 0; i < s.length; i++) {
      occ.clearRect(0, 0, h, h);
      var ch = s.substring(i, i+1);
      if (ch.match(/^[0-9a-zA-Z]+$/) && (settings.rgb1chars||'').indexOf(ch) === -1) {
        occ.fillStyle = 'rgba(' + c0[0] + ', ' + c0[1] + ', ' + c0[2] + ', 1)';
      } else {
        occ.fillStyle = 'rgba(' + c1[0] + ', ' + c1[1] + ', ' + c1[2] + ', 1)';
      }
      occ.fillText(ch, 0, 2);
      chimgs.push([new Image(), w = Math.ceil(occ.measureText(ch).width), p]);
      chimgs[chimgs.length-1][0].src = oc.toDataURL('image/png');
      p += w + ls;
    }

    w = p - ls - 1;

  } else {

    w = h;

  }

  scalec(c, cc, w, h);

  cc.clearRect(0, 0, w, h);

  do {
    e = new effects[settings.effect===-1?0:settings.effect?settings.effect:Math.trunc((effects.length-1)*Math.random())+1](
      {
        ctx: cc,
        chimgs: chimgs,
        fs: fs,
        cwidth: w,
        cheight: h,
        rgbab: settings.rgbab && settings.rgbab.length === 4 ? settings.rgbab : [0, 0, 0, 1],
        border: settings.border && settings.border.length === 4 ? settings.border : [0, 0, 0, 0],
        yf: settings.yf ? settings.yf : 0
      });
  } while (!settings.effect && !e.random);

  busy.set(settings.cName, e);

  e.prepare();

  t = performance.now();
  rf = function() {
    var d;
    if (e.busy) {
      d = performance.now() - t;
      if (d >= settings.duration) {
        e.animateFrame(1);
        busy.delete(settings.cName);
      } else {
        e.animateFrame(d / settings.duration);
        requestAnimationFrame(rf);
      }
    }
  };
  requestAnimationFrame(rf);
};

var randomIntArray = function(m) {
  var r = [], n = 0, i, j, x;
  while (n <= m) {
    r.splice(Math.trunc(Math.random()*(r.length+1)), 0, n);
    i = 0;
    while (i < r.length) {
      if (Math.random() < 0.5) {
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
var getEmPixels = function(e) {

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

function scalec(c, cc, w, h) {
  var dpr = window.devicePixelRatio || 1;
  var bspr = cc.webkitBackingStorePixelRatio||cc.mozBackingStorePixelRatio||cc.msBackingStorePixelRatio||cc.oBackingStorePixelRatio||cc.backingStorePixelRatio||1;
  var dprbspr = dpr / bspr;
  if (dpr === bspr) {
    c.width = w;
    c.height = h;
    c.style.width = '';
    c.style.height = '';
  } else {
    c.width = Math.round(w * dprbspr);
    c.height = Math.round(h * dprbspr);
    c.style.width = w + 'px';
    c.style.height = h + 'px';
  }
  cc.scale(dprbspr, dprbspr);
}

};

