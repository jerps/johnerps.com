/*

Animate Text

(c) 2017-2019 John Erps

This software is licensed under the MIT license (see LICENSE)

*/

/*

  animateText({
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
    yp: 0                              // relative to fontsize in px. if 0 then text is in the middle (sort of), < 0 move to top, > 0 move to bottom; defaults to 0
  });

*/

import Util from 'src/util.js';

var effects = [

  // E1: Chars pop-up, one by one, in random order (random)
  // E2: Chars come frome above or below, one by one, in random order (random)
  // E3: Chars come frome left or right, one by one, in random order (random)
  // E4: All chars fade in
  // E5: All chars fade out
  // E6: Characters are randomly chosen to be shown, every 10% of the time

  // E0 (impl template; simply shows all chars; can be selected with effect -1)
  [function() { // prepare
    // ...
  },
  function(t) { // animateFrame
    // t = 0..1; only once called with t === 1
    this.beforeAnimateFrame(true); // ... clear canvas if true ...
    if (this.chimgs.length > 0) {
      var i;
      for (i = 0; i < this.chimgs.length; i++) {
        this.drawChImg(i);
      }
    }
    this.afterAnimateFrame(true);  // ... draw border if true ...
  },
  false/*effect is elegible for random selection if true*/],

  // E1 (Chars pop-up, one by one, in random order)
  [function() {
    this.x = 1 / this.chimgs.length;
    this.r = Util.randomIntArray(this.chimgs.length-1);
    this.pi = -1;
    this.c = new Set();
  },
  function(t) {
    this.beforeAnimateFrame(true);
    if (this.chimgs.length > 0) {
      var i, j, x;
      i = t === 1 ? this.chimgs.length - 1 : Math.trunc(t / this.x);
      if (i !== this.pi) {
        if (this.pi !== -1) {
          this.c.add(this.r[this.pi]);
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
  },
  true],

  // E2 (Chars come frome above or below, one by one, in random order)
  [function() {
    this.x = 1 / this.chimgs.length;
    this.r = Util.randomIntArray(this.chimgs.length-1);
    this.r2 = this.r.reduce(function(a,v){a.push(Util.rnd()); return a;},[]);
    this.pi = -1;
    this.c = new Set();
  },
  function(t) {
    this.beforeAnimateFrame(true);
    if (this.chimgs.length > 0) {
      var i, j, x, p = 0, d;
      i = t === 1 ? this.chimgs.length - 1 : Math.trunc(t / this.x);
      if (i !== this.pi) {
        if (this.pi !== -1) {
          this.c.add(this.r[this.pi]);
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
  },
  true],

  // E3 (Chars come frome left or right, one by one, in random order)
  [function() {
    this.x = 1 / this.chimgs.length;
    this.r = Util.randomIntArray(this.chimgs.length-1);
    this.r2 = this.r.reduce(function(a,v){a.push(Util.rnd()); return a;},[]);
    this.pi = -1;
    this.c = new Set();
  },
  function(t) {
    this.beforeAnimateFrame(true);
    if (this.chimgs.length > 0) {
      var i, j, x, p, d;
      i = t === 1 ? this.chimgs.length - 1 : Math.trunc(t / this.x);
      if (i !== this.pi) {
        if (this.pi !== -1) {
          this.c.add(this.r[this.pi]);
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
  },
  true],

  // E4 (All chars fade in)
  [function() {
  },
  function(t) {
    this.beforeAnimateFrame(true);
    if (this.chimgs.length > 0) {
      var i;
      for (i = 0; i < this.chimgs.length; i++) {
        this.drawChImg(i, t);
      }
    }
    this.afterAnimateFrame(true);
  },
  false],

  // E5 (All chars fade out)
  [function() {
  },
  function(t) {
    this.beforeAnimateFrame(true);
    if (this.chimgs.length > 0) {
      var i;
      for (i = 0; i < this.chimgs.length; i++) {
        this.drawChImg(i, 1-t);
      }
    }
    this.afterAnimateFrame(true);
  },
  false],

  // E6 (Characters are randomly chosen to be shown, every 200 ms)
  [function() {
    this.x = 1 / this.chimgs.length;
    this.r = null;
  },
  function(t) {
    this.beforeAnimateFrame(true);
    if (this.chimgs.length > 0) {
      var i;
      if (!this.r || performance.now() - this.t > 200) {
        this.t = performance.now();
        this.r = Util.randomIntArray(this.chimgs.length-1).reduce(function(a,v){if (Util.rnd() < 0.5) {a.push(v);}; return a;},[]);
      }
      for (i = 0; i < this.r.length; i++) {
        this.drawChImg(this.r[i]);
      }
    }
    this.afterAnimateFrame(true);
  },
  false]

];

export default function animateText(settings) {

  if (!settings.cName) {
    return;
  }

  var a = busy.get(settings.cName);
  if (a) {
    a.busy = false;
    busy.delete(settings.cName);
  }

  var c = document.getElementById(settings.cName);

  if (!c) {
    return;
  }

  settings.effect = settings.effect || 0;

  var oc = document.createElement('canvas'), cc = c.getContext('2d'), occ = oc.getContext('2d');
  var fs = Math.trunc(Util.getEmPixels(document.getElementById('container')) * (settings.fontSize && settings.fontSize > 0 ? settings.fontSize : 1));
  var ls = settings.letterSpacing && settings.letterSpacing >= 0 ? Math.trunc(fs * settings.letterSpacing / 100) : 0;
  var chimgs = [], s, i, p, w, h, t, c0, c1, e, af;

  var pxs = Util.pixScale(cc);

  s = settings.text || '';

  h = fs * 2;

  if (s) {

    scalec(pxs, oc, occ, h, h);
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

  w = Math.round(w);

  scalec(pxs, c, cc, w, h);

  cc.clearRect(0, 0, w, h);

  do {
    e = effects[settings.effect===-1?0:settings.effect?settings.effect:Math.trunc((effects.length-1)*Util.rnd())+1];
  } while (!settings.effect && !e[2]);

  a = new Animation({
              ctx: cc,
              pxs: pxs,
              chimgs: chimgs,
              fs: fs,
              cwidth: w,
              cheight: h,
              rgbab: settings.rgbab && settings.rgbab.length === 4 ? settings.rgbab : [0, 0, 0, 1],
              border: settings.border && settings.border.length === 4 ? settings.border : [0, 0, 0, 0],
              yp: settings.yp ? settings.yp : 0
          });

  a.prepare = e[0];
  a.animateFrame = e[1];

  busy.set(settings.cName, a);

  a.prepare();

  t = performance.now();
  af = function() {
    var d;
    if (a.busy) {
      d = performance.now() - t;
      if (d >= settings.duration) {
        a.animateFrame(1);
        busy.delete(settings.cName);
      } else {
        a.animateFrame(d / settings.duration);
        requestAnimationFrame(af);
      }
    }
  };
  requestAnimationFrame(af);
};

var busy = new Map();

class Animation {
  constructor(props) {/*
                canvas context   ctx     -> {...},
                char images      chimgs  -> [ [image, charwidth, posx], ... },
                font size        fs      -> int,
                canvas width     cwidth  -> int,
                canvas height    cheight -> int,
                border rgba      rgbab   -> [ int (red), int (green), int (blue),  0..1 (alpha) ]
                border sizes     border  -> [ int (top), int (right), int (bottom), int (left) ],
                y factor         yp      -> int
                */
    this.busy = true;
    this.ctx = props.ctx;
    this.pxs = props.pxs;
    this.chimgs = props.chimgs;
    this.fs = props.fs;
    this.cwidth = props.cwidth;
    this.cheight = props.cheight;
    this.rgbab = props.rgbab;
    this.border = props.border;
    this.yp2 = Math.round((props.cheight - props.fs) / 2);
    this.yp2 += this.yp2 * props.yp;
  }
  beforeAnimateFrame(f) {
    if (f) {
      this.ctx.clearRect(0, 0, this.cwidth, this.cheight);
    }
  }
  afterAnimateFrame(f) {
    if (f) {
      this.drawBorder();
    }
  }
  drawChImg(i, a, px, py) {
    var img = this.chimgs[i][0], w = this.chimgs[i][1];
    this.ctx.globalAlpha = a === 0 ? 0 : a ? a : 1;
    this.ctx.drawImage(img, 0, 0, Math.round((w+1)*this.pxs)+1, Math.round(img.height)+1, Math.round(px ? px : this.chimgs[i][2]), Math.round(py ? py+this.yp2 : this.yp2), Math.round(w+1)+1, Math.round(img.height/this.pxs)+1);
  }
  drawBorder() {
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
            c.moveTo(0+b[i]/2, 0+b[i]/2);
            c.lineTo(this.cwidth-b[i]/2, 0+b[i]/2);
            break;
          case 1:
            c.moveTo(this.cwidth-b[i]/2, 0+b[i]/2);
            c.lineTo(this.cwidth-b[i]/2, this.cheight-b[i]/2);
            break;
          case 2:
            c.moveTo(0+b[i]/2, this.cheight-b[i]/2);
            c.lineTo(this.cwidth-b[i]/2, this.cheight-b[i]/2);
            break;
          case 3:
            c.moveTo(0+b[i]/2, 0+b[i]/2);
            c.lineTo(0+b[i]/2, this.cheight-b[i]/2);
            break;
        };
        c.stroke();
      }
    }
  };
}

function scalec(pxs, c, cc, w, h) {
  c.width = Math.round(w * pxs);
  c.height = Math.round(h * pxs);
  c.style.width = w + 'px';
  c.style.height = h + 'px';
  cc.scale(pxs, pxs);
}

