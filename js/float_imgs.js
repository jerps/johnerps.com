/*

Floating Images

(c) 2019 John Erps

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


var FloatImgs = {};


(function() {

const IMGPATH = 'images/float/', IMGEXT = '.jpg', IMGCOUNT = 38, ZISLOTS = 20;

let sscounter = 0;

let stopped = true;
let rszlset = false;

let icache = new Map();
let ilist = [];
let zset = new Set();
let iset = new Set();


FloatImgs.start = function() {
  if (!rszlset) {
    rszlset = true;
    window.addEventListener('resize', resized);
  }
  startfloat();
};

FloatImgs.stop = function() {
  if (rszlset) {
    rszlset = false;
    window.removeEventListener('resize', resized);
  }
  stopfloat();
};

FloatImgs.t = FloatImgs.gt = FloatImgs.g10 = FloatImgs.g11 = 0;
FloatImgs.r = FloatImgs.gr = FloatImgs.g20 = FloatImgs.g21 = 0;
FloatImgs.mi = FloatImgs.gmi = FloatImgs.g30 = FloatImgs.g31 = 0;
FloatImgs.d0 = FloatImgs.gd0 = FloatImgs.g40 = 0;
FloatImgs.d1 = FloatImgs.gd1 = FloatImgs.g41 = 0;
FloatImgs.mc0 = FloatImgs.gmc0 = FloatImgs.g50 = 0;
FloatImgs.mc1 = FloatImgs.gmc1 = FloatImgs.g51 = 0;

FloatImgs.fgt = function(g) {
  FloatImgs.gt = FloatImgs.g10 = FloatImgs.g11 = g;
  FloatImgs.t = 0.1 + Math.trunc(99.8 * g * 10) / 10;
};

FloatImgs.fgr = function(g) {
  FloatImgs.gr = FloatImgs.g20 = FloatImgs.g21 = g;
  FloatImgs.r = Math.trunc(0.999 * g * 1000) / 1000;
};

FloatImgs.fgmi = function(g) {
  FloatImgs.gmi = FloatImgs.g30 = FloatImgs.g31 = g;
  FloatImgs.mi = 1 + Math.trunc((ZISLOTS - 1) * g);
};

FloatImgs.fgd0 = function(g) {
  FloatImgs.gd0 = FloatImgs.g40 = g;
  FloatImgs.d0 = 1 + Math.trunc(98 * g);
  if (FloatImgs.gd0 > FloatImgs.gd1) {
    FloatImgs.fgd1(g);
  }
};

FloatImgs.fgd1 = function(g) {
  FloatImgs.gd1 = FloatImgs.g41 = g;
  FloatImgs.d1 = 1 + Math.trunc(98 * g);
  if (FloatImgs.gd1 < FloatImgs.gd0) {
    FloatImgs.fgd0(g);
  }
};

FloatImgs.fgmc0 = function(g) {
  FloatImgs.gmc0 = FloatImgs.g50 = g;
  FloatImgs.mc0 = 0.01 + Math.trunc(0.98 * g * 100) / 100;
  if (FloatImgs.gmc0 > FloatImgs.gmc1) {
    FloatImgs.fgmc1(g);
  }
};

FloatImgs.fgmc1 = function(g) {
  FloatImgs.gmc1 = FloatImgs.g51 = g;
  FloatImgs.mc1 = 0.01 + Math.trunc(0.98 * g * 100) / 100;
  if (FloatImgs.gmc1 < FloatImgs.gmc0) {
    FloatImgs.fgmc0(g);
  }
};

FloatImgs.fgt(0.3);
FloatImgs.fgr(0.1);
FloatImgs.fgmi(0.5);
FloatImgs.fgd0(0.1);
FloatImgs.fgd1(0.3);
FloatImgs.fgmc0(0);
FloatImgs.fgmc1(0.5);

FloatImgs.dft = {
  gt:     FloatImgs.gt,
  gr:     FloatImgs.gr,
  gmi:    FloatImgs.gmi,
  gd0:    FloatImgs.gd0,
  gd1:    FloatImgs.gd1,
  gmc0:   FloatImgs.gmc0,
  gmc1:   FloatImgs.gmc1,
};

function startfloat() {
  if (stopped) {
    stopped = false;
    incsscounter();
    floatImgs(sscounter);
  }
}

function stopfloat() {
  if (!stopped) {
    stopped = true;
    incsscounter();
  }
}

function incsscounter() {
  if (sscounter >= Number.MAX_SAFE_INTEGER) {
    sscounter = 0;
  }
  sscounter++;
  zset = new Set();
  iset = new Set();
}

function resized() {
  if (!stopped) {
    stopfloat();
    setTimeout(() => {
      if (rszlset) {
        startfloat();
      }
    }, 3000);
  }
}

function floatImgs(ssc) {

  function stop() {
    return ssc !== sscounter;
  }

  if (stop()) {
    return;
  }

  let lt = performance.now(), x, zappc = 0;

  FloatImgs.zapp = function() {
    if (zappc >= Number.MAX_SAFE_INTEGER) {
      zappc = 0;
    }
    zappc++;
  };

  let iv = setInterval(() => {
    if (stop()) {
      clearInterval(iv);
      FloatImgs.zapp = null;
      return;
    }
    if ((x = performance.now()) - lt > FloatImgs.t * 1000 && Util.rnd() < FloatImgs.r) {
      lt = x;
      floatImg();
    }
  }, 100);

  async function floatImg() {
    if (iset.size >= FloatImgs.mi) {
      return;
    }
    let zc = zappc, zi = Math.trunc(Util.rnd() * ZISLOTS) + 1, imgn = null, img;
    if (zset.has(zi)) {
      if (zset.size >= ZISLOTS) {
        return;
      }
      let i = zi;
      do {
        i = i < ZISLOTS ? i+1 : 1;
        if (i === zi) {
          return;
        }
      } while (zset.has(i));
      zi = i;
    }
    zset.add(zi);
    function exit() {
      if (ssc === sscounter) {
        zset.delete(zi);
        if (imgn) {
          iset.delete(imgn);
        }
      }
      return null;
    }
    let x = Util.randomIntArray(IMGCOUNT-1), i = 0;
    while (i < x.length && iset.has(imgn = x[i] + 1) || ilist.indexOf(imgn) >= 0) {i++;}
    if (i >= x.length) {
      exit();
    }
    iset.add(imgn);
    ilist.push(imgn);
    if (ilist.length > IMGCOUNT / 2) {
      ilist.shift();
    }
    if (icache.has(imgn)) {
      img = icache.get(imgn);
    } else {
      img = await loadImg(IMGPATH + '0'.repeat(2-Math.trunc(Math.log10(imgn))) + imgn + IMGEXT);
      if (!img) {
        return exit();
      }
      icache.set(imgn, img);
    }
    if (stop()) {
      return exit();
    }
    let pxs = Util.pixScale(document.createElement('canvas').getContext('2d'));
    let l, w = img.width / pxs, h = img.height / pxs, br = document.body.getBoundingClientRect();
    x = 0.2 + 0.4 * Util.rnd();
    if (w > h) {
      x = (x = br.width * x) > w ? w : x;
      h = x * h / w;
      w = l = x;
    } else {
      x = (x = br.height * x) > h ? h : x;
      w = x * w / h;
      h = l = x;
    }
    let x0, y0, x1, y1, xcp, ycp;
    xcp = br.width / 3 + Util.rnd() * br.width / 3;
    ycp = br.height / 3 + Util.rnd() * br.height / 3;
    switch (Math.trunc(4 * Util.rnd())) {
      case 0:
        x0 = 0 - l / 2 + (0.3 + 0.4 * Util.rnd()) * (br.width + l);
        y0 = 0 - l / 2;
        switch ((x = Util.rnd()) < 0.4 ? 1 : x < 0.7 ? 0 : 2) {
          case 0:
            x1 = br.width + l / 2;
            y1 = 0 - l / 2 + (0.4 + 0.2 * Util.rnd()) * (br.height + l);
            xcp -= br.width / 3;
            ycp += br.width / 3;
            break;
          case 1:
            x1 = 0 - l / 2 + (0.3 + 0.4 * Util.rnd()) * (br.width + l);
            y1 = br.height + l / 2;
            break;
          case 2:
            x1 = 0 - l / 2;
            y1 = 0 - l / 2 + (0.4 + 0.2 * Util.rnd()) * (br.height + l);
            xcp += br.width / 3;
            ycp += br.width / 3;
            break;
        }
        break;
      case 1:
        x0 = br.width + l / 2;
        y0 = 0 - l / 2 + (0.3 + 0.4 * Util.rnd()) * (br.height + l);
        switch ((x = Util.rnd()) < 0.4 ? 1 : x < 0.7 ? 0 : 2) {
          case 0:
            x1 = 0 - l / 2 + (0.4 + 0.2 * Util.rnd()) * (br.width + l);
            y1 = br.height + l / 2;
            xcp -= br.width / 3;
            ycp -= br.width / 3;
            break;
          case 1:
            x1 = 0 - l / 2;
            y1 = 0 - l / 2 + (0.3 + 0.4 * Util.rnd()) * (br.height + l);
            break;
          case 2:
            x1 = 0 - l / 2 + (0.4 + 0.2 * Util.rnd()) * (br.width + l);
            y1 = 0 - l / 2;
            xcp -= br.width / 3;
            ycp += br.width / 3;
            break;
        }
        break;
      case 2:
        x0 = 0 - l / 2 + (0.3 + 0.4 * Util.rnd()) * (br.width + l);
        y0 = br.height + l / 2;
        switch ((x = Util.rnd()) < 0.4 ? 1 : x < 0.7 ? 0 : 2) {
          case 0:
            x1 = 0 - l / 2;
            y1 = 0 - l / 2 + (0.4 + 0.2 * Util.rnd()) * (br.height + l);
            xcp += br.width / 3;
            ycp -= br.width / 3;
            break;
          case 1:
            x1 = 0 - l / 2 + (0.3 + 0.4 * Util.rnd()) * (br.width + l);
            y1 = 0 - l / 2;
            break;
          case 2:
            x1 = br.width + l / 2;
            y1 = 0 - l / 2 + (0.4 + 0.2 * Util.rnd()) * (br.height + l);
            xcp -= br.width / 3;
            ycp -= br.width / 3;
            break;
        }
        break;
      case 3:
        x0 = 0 - l / 2;
        y0 = 0 - l / 2 + (0.3 + 0.4 * Util.rnd()) * (br.height + l);
        switch ((x = Util.rnd()) < 0.4 ? 1 : x < 0.7 ? 0 : 2) {
          case 0:
            x1 = 0 - l / 2 + (0.4 + 0.2 * Util.rnd()) * (br.width + l);
            y1 = 0 - l / 2;
            xcp += br.width / 3;
            ycp += br.width / 3;
            break;
          case 1:
            x1 = br.width + l / 2;
            y1 = 0 - l / 2 + (0.3 + 0.4 * Util.rnd()) * (br.height + l);
            break;
          case 2:
            x1 = 0 - l / 2 + (0.4 + 0.2 * Util.rnd()) * (br.width + l);
            y1 = br.height + l / 2;
            xcp += br.width / 3;
            ycp -= br.width / 3;
            break;
        }
        break;
    }
    let rt = Math.trunc(Util.rnd() * 4), rd1 = 0, rd2 = 360, rr = 0, rrd = 0, rcc = Util.rnd() < 0.5;
    if (rt === 1 || rt === 2) {
      rd1 = rd1 + Math.trunc(Util.rnd() * 90);
      rd2 = rd2 - Math.trunc(Util.rnd() * 90);
    }
    if (rt === 2 || rt === 3) {
      rr = Math.trunc(Util.rnd() * (Util.rnd() < 0.6 ? 5 : 20)) + 1;
    }
    if (rt === 3) {
      rrd = -90 + Math.trunc(Util.rnd() * 180);
    }
    let rf = 1 / (rr + 1);
    let td = FloatImgs.d0 * 1000 + Math.trunc((FloatImgs.d1 - FloatImgs.d0 + 1) * Util.rnd()) * 1000, ts = performance.now();
    img.style.width = ''+w+'px';
    img.style.height = ''+h+'px';
    img.style.borderRadius = '50%';
    img.style.zIndex = ''+(0-zi);
    img.style.opacity = ''+(0.5-0.35*(zi-1)/(ZISLOTS-1));
    img.style.position = 'absolute';
    img.style.visibility = 'hidden';
    document.body.appendChild(img);
    let visible = false;
    let zappt = 0;
    let sf0 = sinfun(), sf1 = sinfun(), sf2 = sinfun(), sf3 = sinfun(), sf4 = sinfun(), sf5 = sinfun();
    let af = function() {
      let t = (performance.now() - ts) / td;
      if (stop() || t > 1 || zappt > 0 && performance.now() - zappt > 2500) {
        visible = false;
        img.style.visibility = 'hidden';
        img.remove();
        return exit();
      }
      if (!visible) {
        visible = true;
        img.style.visibility = 'visible';
      }
      if (zappt === 0 && zc !== zappc) {
        zappt = performance.now();
        img.style.transition = 'opacity 2s ease-out';
        img.style.opacity = '0';
      }
      t = sf0(t);
      let t1 = sf1(t), t2 = sf2(t);
      img.style.left = ''+Math.round(Math.pow(1 - t1, 2) * x0 + 2 * (1 - t1) * t1 * xcp + Math.pow(t1, 2) * x1 - w / 2)+'px';
      img.style.top = ''+Math.round(Math.pow(1 - t2, 2) * y0 + 2 * (1 - t2) * t2 * ycp + Math.pow(t2, 2) * y1 - h / 2)+'px';
      if (rt > 0) {
        let r = 0;
        if (rt === 3) {
          r = 360 * sf3((t % rf) / rf);
          if (rcc) {
            r = 360 - r;
          }
          r += rrd;
          if (r < 0) {
            r += 360;
          }
          if (r > 360) {
            r -= 360;
          }
        } else {
          let n = Math.trunc(t / rf);
          if (rcc && n % 2 === 0 || !rcc && n % 2 !== 0) {
            r = rd1 - (rd1 + 360 - rd2) * sf4((t % rf) / rf);
            if (r < 0) {
              r += 360;
            }
          } else {
            r = rd2 + (rd1 + 360 - rd2) * sf5((t % rf) / rf);
            if (r >= 360) {
              r -= 360;
            }
          }
        }
        img.style.transform = 'rotate('+r+'deg)';
      } else {
        img.style.transform = 'rotate(0deg)';
      }
      requestAnimationFrame(af);
    };
    requestAnimationFrame(af);
  }

}

function loadImg(url) {
  return new Promise((res, rej) => {
    let i = new Image();
    i.src = url;
    i.onload = () => res(i);
    i.onerror = () => res(null);
  });
}

function sinfun() {
  let a = [], x = 0, y = 0, r = 0, dx, dy, dr = 0.05 + (1 - (FloatImgs.mc0 + (FloatImgs.mc1 - FloatImgs.mc0 + 0.01) * Util.rnd())) * 0.6, i = 0;
  while (y < 1) {
    dx = 1 + Util.rnd() * 10;
    if (y > 1 - dr) {
      dy = 1 - y;
    } else if (y < dr || Util.rnd() > y - r / 4) {
      dy = Util.rnd() * (1 - y);
    } else {
      dy = 0 - Util.rnd() * y;
    }
    a.push([x, dx, y, dy]);
    x += dx;
    y += dy;
    r += dr;
  }
  return function(t) {
    while (i > 0 && t < a[i][0] / x) {i--;}
    while (i < a.length - 1 && t > (a[i][0] + a[i][1]) / x) {i++;}
    return (a[i][3] < 0 ?
        a[i][2] + a[i][3] * (1 - (Math.sin(Math.PI * (0.5 + (t - a[i][0] / x) / (a[i][1] / x))) + 1) / 2)
      : a[i][2] + a[i][3] * (Math.sin(Math.PI * (-0.5 + (t - a[i][0] / x) / (a[i][1] / x))) + 1) / 2) / y;
  };
}


})();
