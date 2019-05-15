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


const IMGPATH = 'images/float/', IMGEXT = '.jpg', IMGCOUNT = 38;


var FloatImgs = {};


(function() {


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

  let iv = setInterval(() => {
    if (stop()) {
      clearInterval(iv);
      return;
    }
    if (Util.rnd() < 0.2) {
      floatImg();
    }
  }, 1000);

  async function floatImg() {
    let zi = Math.trunc(Util.rnd() * 9) + 1, imgn, img;
    if (zset.has(zi)) {
      return;
    }
    zset.add(zi);
    function exit() {
      if (ssc === sscounter) {
        zset.delete(zi);
        iset.delete(imgn);
      }
      return null;
    }
    do {} while (iset.has(imgn = Math.trunc(Util.rnd() * IMGCOUNT) + 1) || ilist.indexOf(imgn) >= 0);
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
    let w = img.width / pxs, h = img.height / pxs, br = document.body.getBoundingClientRect();
    let x = 0.2 + 0.4 * Util.rnd(), l;
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
    switch (Math.trunc(4 * Util.rnd())) {
      case 0:
        x0 = 0 - l / 2 + (0.3 + 0.4 * Util.rnd()) * (br.width + l);
        y0 = 0 - l / 2;
        switch ((x = Util.rnd()) < 0.4 ? 1 : x < 0.7 ? 0 : 2) {
          case 0:
            x1 = br.width + l / 2;
            y1 = 0 - l / 2 + (0.4 + 0.2 * Util.rnd()) * (br.height + l);

            break;
          case 1:
            x1 = 0 - l / 2 + (0.3 + 0.4 * Util.rnd()) * (br.width + l);
            y1 = br.height + l / 2;
            break;
          case 2:
            x1 = 0 - l / 2;
            y1 = 0 - l / 2 + (0.4 + 0.2 * Util.rnd()) * (br.height + l);
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
            break;
          case 1:
            x1 = 0 - l / 2;
            y1 = 0 - l / 2 + (0.3 + 0.4 * Util.rnd()) * (br.height + l);
            break;
          case 2:
            x1 = 0 - l / 2 + (0.4 + 0.2 * Util.rnd()) * (br.width + l);
            y1 = 0 - l / 2;
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
            break;
          case 1:
            x1 = 0 - l / 2 + (0.3 + 0.4 * Util.rnd()) * (br.width + l);
            y1 = 0 - l / 2;
            break;
          case 2:
            x1 = br.width + l / 2;
            y1 = 0 - l / 2 + (0.4 + 0.2 * Util.rnd()) * (br.height + l);
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
            break;
          case 1:
            x1 = br.width + l / 2;
            y1 = 0 - l / 2 + (0.3 + 0.4 * Util.rnd()) * (br.height + l);
            break;
          case 2:
            x1 = 0 - l / 2 + (0.4 + 0.2 * Util.rnd()) * (br.width + l);
            y1 = br.height + l / 2;
            break;
        }
        break;
    }
    xcp = br.width / 3 + Util.rnd() * br.width / 3;
    ycp = br.height / 3 + Util.rnd() * br.height / 3;
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
    let td = 30000 + 50000 * Util.rnd(), ts = performance.now();
    img.style.width = ''+w+'px';
    img.style.height = ''+h+'px';
    img.style.borderRadius = '50%';
    img.style.zIndex = ''+(0-zi);
    img.style.opacity = ''+(0.5-0.3*(zi-1)/8);
    img.style.position = 'absolute';
    img.style.visibility = 'hidden';
    document.body.appendChild(img);
    let visible = false;
    let sf0 = sinfun(), sf1 = sinfun(), sf2 = sinfun(), sf3 = sinfun(), sf4 = sinfun(), sf5 = sinfun();
    let af = function() {
      let t = (performance.now() - ts) / td;
      if (stop() || t > 1) {
        visible = false;
        img.style.visibility = 'hidden';
        img.remove();
        return exit();
      }
      if (!visible) {
        visible = true;
        img.style.visibility = 'visible';
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

  let n = Math.trunc(Util.rnd() * 9), f = sinfun0();
  while (--n > 0) {f = sinfun0(f);}
  return f;

  function sinfun0(fun) {
    let a, b, f = Util.rnd() * 9 + 9;
    do {a = Util.rnd() * 0.65 * f; b = 0.35 + Util.rnd() * 0.65 * f;} while (Math.abs(a-b) < 0.1);
    if (a > b) {
      [a,b] = [b,a];
    }
    let av = Math.sin(Math.PI * a / f), bv = Math.sin(Math.PI * b / f);
    let max, maxt, min, mint;
    if (a < f / 2) {
      if (b < f / 2) {
        min = av;
        mint = a;
        max = bv;
        maxt = b;
      } else {
        if (av < bv) {
          min = av;
          mint = a;
        } else {
          min = bv;
          mint = b;
        }
        max = 1;
        maxt = f / 2;
      }
    } else {
      min = bv;
      mint = b;
      max = av;
      maxt = a;
    }
    let q = Util.rnd() < 0.5;
    if (q) {
      [min,max] = [1-max,1-min];
      [mint,maxt] = [maxt,mint];
      if (max - bv > bv - min) {
        max = max - bv;
      } else {
        max = bv - min;
        maxt = mint;
      }
    } else {
      if (max - av > av - min) {
        max = max - av;
      } else {
        max = av - min;
        maxt = mint;
      }
    }
    let l1 = b - a, l2 = q ? maxt - a : b - maxt, l3 = l1 + l2;
    return function(t) {
      t = fun ? fun(t) : t;
      let x = t * l3;
      if (x > l1) {
        x = l1 - x + l1;
      }
      x = q ? 1 - Math.sin(Math.PI * (b - x) / f) : Math.sin(Math.PI * (a + x) / f);
      return (q ? x < bv ? bv - x : x - bv : x < av ? av - x : x - av) / max;
    };
  }

}


})();
