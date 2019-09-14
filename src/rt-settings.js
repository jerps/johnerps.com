/*

rss-ticker settings

(c) 2019 John Erps

This software is licensed under the MIT license (see LICENSE)

*/

let acl = new Map(); // attribute change listeners
let rts = new Set(); // RtSettings instances

export default class RtSettings {

  static areSettingsOpenFor(ticker) {
    return acl.has(ticker);
  }

  static removeAll() {
    for (const s of rts) {
      s.remove();
    }
  }

  constructor(ticker) {
    rts.add(this);
    this._ticker = ticker;
    this._inputs = new Map();
    this._removed = false;
    this._tbl = null;
    let ti = 0;
    const self = this;
    function attrChanged(a1, a2, e) {
      if (e.type && e.type === 'checkbox') {
        ticker[a2] = e.checked;
      } else {
        ticker[a2] = e.value;
      }
      let x = acl.get(ticker);
      if (x) {
        x = x.get(a1);
        if (x) {
          for (const h of x) {
            h();
          }
        }
      }
    }
    function initValue(a, e) {
      if (e.type && e.type === 'checkbox') {
        e.checked = !!ticker[a];
      } else {
        e.value = String(ticker[a]);
      }
    }
    function initInput(a1, a2, r, c, t) {
      let e0, e1, e = t === 'checkbox' ? document.querySelector('.rts-checkbox').cloneNode(true) : document.createElement(t ? 'input' : 'textarea');
      ti++;
      if (r) {
        e.style.gridRowStart = '' + r;
      }
      if (c) {
        e.style.gridColumnStart = '' + c;
      }
      e.tabIndex = '' + ti;
      if (t === 'checkbox') {
        e.style.display = 'block';
        e0 = e;
        e = e0.querySelector('input');
        e.tabIndex = '-1';
        e1 = e0.querySelector('div');
        e1.addEventListener('click', ev => {
          ev.preventDefault();
          e.checked = !e.checked;
          e0.style.outlineColor = 'white';
          setTimeout(() => {
            e0.style.outlineColor = '';
          }, 500);
          if (a1) {
            attrChanged(a1, a2, e);
          } else if (a2) {
            a2(e);
          }
        }, false);
        e0.addEventListener('keypress', ev => {
          if (ev.keyCode === 32) {
            ev.preventDefault();
            e.checked = !e.checked;
            e0.style.outlineColor = 'white';
            setTimeout(() => {
              e0.style.outlineColor = '';
            }, 500);
            if (a1) {
              attrChanged(a1, a2, e);
            } else if (a2) {
              a2(e);
            }
          }
        }, false);
      } else {
        e.classList.add('rts-input');
        if (a1 === 'url' || a1 === 'proxy-url') {
          e.classList.add('rts-input-url');
          e.addEventListener('keypress', ev => {
            if (ev.keyCode === 13) {
              ev.preventDefault();
              attrChanged(a1, a2, e);
              bplay.click();
            }
          }, false);
          e.addEventListener('focus', () => {
            if (bplay) {
              bplay.style.borderWidth = '4px';
            }
          }, false);
          e.addEventListener('blur', () => {
            if (bplay) {
              bplay.style.borderWidth = '';
            }
          }, false);
        }
        if (t) {
          e.type = t;
        }
      }
      if (a1) {
        e.classList.add('rts-attr-' + a1);
        if (t !== 'checkbox') {
          e.addEventListener('change', ev => {
            ev.preventDefault();
            attrChanged(a1, a2, e);
            e.style.outlineColor = 'white';
            setTimeout(() => {
              e.style.outlineColor = '';
            }, 500);
          });
        }
        initValue(a2, e);
        let h = () => initValue(a2, e);
        self._inputs.set(a1, [a2, e, h]);
        let x1 = acl.get(ticker);
        if (!x1) {
          x1 = new Map();
          acl.set(ticker, x1);
        }
        let x2 = x1.get(a1);
        if (!x2) {
          x2 = [];
          x1.set(a1, x2);
        }
        x2.push(h);
      } else if (t !== 'checkbox' && a2) {
        e.addEventListener('change', ev => {
          ev.preventDefault();
          a2(e);
          e.style.outlineColor = 'white';
          setTimeout(() => {
            e.style.outlineColor = '';
          }, 500);
        });
      }
      return t === 'checkbox' ? e0 : e;
    }
    function initLabel(a, r, c) {
      let e = document.createElement('label');
      if (a === 'url' || a === 'proxy-url') {
        e.style.width = '4.5em';
        e.style.margin = 'auto';
      } else {
        e.classList.add('rts-label');
      }
      if (r) {
        e.style.gridRowStart = '' + r;
      }
      if (c) {
        e.style.gridColumnStart = '' + c;
      }
      e.style.textAlign = 'right';
      e.tabIndex = '-1';
      e.innerHTML = a;
      return e;
    }
    function initButton(t, h) {
      let e = document.createElement('button');
      e.classList.add('rts-button');
      ti++;
      e.tabIndex = '' + ti;
      e.innerHTML = t;
      e.addEventListener('click', ev => {
        ev.preventDefault();
        e.style.outlineColor = 'white';
        setTimeout(() => {
          e.style.outlineColor = '';
        }, 500);
        e.classList.add('rts-button-clickeffect');
        setTimeout(() => {
          e.classList.remove('rts-button-clickeffect');
        }, 500);
        h();
      });
      return e;
    }
    let e, e0, e1, fe, iurl, ipurl, lurl, urlswitch, bplay, bstop, bimport, bexport, bcancel;
    this._e = document.querySelector('.rts-settings-container').cloneNode(true);
    this._e.style.display = 'flex';
    document.body.appendChild(this._e);
    e0 = this._e.querySelector('.rts-settings-input');
    urlswitch = initInput(null, (e) => {
      if (e.checked) {
        lurl.innerHTML = 'proxy-url';
        iurl.style.display = 'none';
        ipurl.style.display = 'inline';
        ipurl.focus();
        ipurl.style.outlineColor = 'white';
        setTimeout(() => {
          ipurl.style.outlineColor = '';
        }, 500);
      } else {
        lurl.innerHTML = 'url';
        iurl.style.display = 'inline';
        ipurl.style.display = 'none';
        iurl.focus();
        iurl.style.outlineColor = 'white';
        setTimeout(() => {
          iurl.style.outlineColor = '';
        }, 500);
      }
    }, null, null, 'checkbox');
    urlswitch.classList.add('rts-urlswitch');
    urlswitch.style.transform = 'scale(0.8)';
    iurl = initInput('url', 'url', 1, 2);
    fe = iurl; // focus element
    e0.appendChild(iurl);
    ipurl = initInput('proxy-url', 'proxyUrl', 1, 2);
    ipurl.style.display = 'none';
    e0.appendChild(ipurl);
    lurl = initLabel('url');
    e1 = document.createElement('div');
    e1.classList.add('rts-label');
    e1.style.display = 'flex';
    e1.style.gridRowStart = '1';
    e1.style.gridColumnStart = '1';
    e1.appendChild(urlswitch);
    e1.appendChild(lurl);
    e0.appendChild(e1);
    e = initLabel('speed', 2, 1);
    e0.appendChild(e);
    e = initInput('speed', 'speed', 2, 2, 'number');
    e.style.width ='3em';
    e.min = 1;
    e.max = 10;
    e0.appendChild(e);
    e = initLabel('cont-run', 1, 3);
    e0.appendChild(e);
    e = initInput('cont-run', 'contRun', 1, 4, 'checkbox');
    e0.appendChild(e);
    e0 = this._e.querySelector('.rts-settings-busy');
    bplay = initButton('<i class="fas fa-play"></i>', () => {
      ticker.startTicker();
    });
    e0.appendChild(bplay);
    bstop = initButton('<i class="fas fa-stop"></i>', () => {
      ticker.stopTicker();
    });
    e0.appendChild(bstop);
    this._tbl = b => {
      this.updBusyInd(b);
    };
    this._ticker.addBusyListener(this._tbl);
    this.updBusyInd();
    e0 = this._e.querySelector('.rts-settings-buttons');
    bimport = initButton('<i class="fas fa-file-import"></i>', () => {
    });
    e0.appendChild(bimport);
    bexport = initButton('<i class="fas fa-file-export"></i>', () => {
    });
    e0.appendChild(bexport);
    bcancel = initButton('<i class="fas fa-times"></i>', () => {
      self.remove();
    });
    e0.appendChild(bcancel);
    this._e.addEventListener('keyup', ev => {
      if (ev.keyCode === 27) {
        ev.preventDefault();
        bcancel.click();
      }
    }, false);
    let r1 = ticker.getBoundingClientRect(), r2 = this._e.getBoundingClientRect();
    let w = r2.width, h = r2.height;
    if (r1.bottom - r1.height / 2 > document.body.clientHeight / 2) {
      let b = document.body.clientHeight - r1.bottom + r1.height + 10;
      if (document.body.clientHeight - b < h) {
        b -= h - document.body.clientHeight + b;
      }
      if (b < 0) {
        b = 0;
      }
      this._e.style.bottom = '' + b + 'px';
    } else {
      let t = r1.bottom + 10;
      if (t + h > document.body.clientHeight) {
        t -= t + h - document.body.clientHeight;
      }
      if (t < 0) {
        t = 0;
      }
      this._e.style.top = '' + t + 'px';
    }
    this._e.style.left = '' + (r1.left + 10) + 'px';
    this._e.style.width = '' + w + 'px';
    this._e.style.height = '' + h + 'px';
    this._e.style.opacity = 0;
    setTimeout(() => {
      if (!self._removed) {
        self._e.style.opacity = 0.95;
        fe.focus();
      }
    }, 300);
  }

  updBusyInd(b) {
    if (!this._removed) {
      let e = this._e.querySelector('.rts-settings-busy').querySelector('.rts-busy-ind');
      e.classList.remove('rts-busy-ind-busy');
      e.classList.remove('rts-busy-ind-stopped');
      if (b === undefined && this._ticker.busy || b) {
        e.classList.add('rts-busy-ind-busy');
      } else {
        e.classList.add('rts-busy-ind-stopped');
      }
    }
  }

  remove() {
    if (!this._removed) {
      this._removed = true;
      this._ticker.removeBusyListener(this._tbl);
      rts.delete(this);
      let m = acl.get(this._ticker);
      if (m) {
        for (const [k, v] of this._inputs) {
          let a = m.get(v[0]);
          if (a) {
            let i = a.indexOf(v[2]);
            if (i >= 0) {
              a.splice(i, 1);
            }
            if (a.length === 0) {
              m.delete(v[0]);
            }
          }
        }
        if (m.size === 0) {
          acl.delete(this._ticker);
        }
      }
      setTimeout(() => {
        this._e.style.opacity = 0;
        setTimeout(() => {
          this._e.style.display = 'none';
          this._e.remove();
        }, 1000);
      }, 300);
    }
  }

  get isRemoved() {
    return this._removed;
  }

}
