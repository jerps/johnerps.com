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

  constructor(ticker, dfts) {
    rts.add(this);
    this._ticker = ticker;
    this._inputs = new Map();
    this._removed = false;
    this._tbl = null;
    this._dfts = dfts || {};
    let ti = 0;
    let self = this;
    function attrChanged(a1, a2, e) {
      if (e.type === 'checkbox') {
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
    function initValue(a, e, c) {
      if (e.type === 'checkbox') {
        e.checked = !!ticker[a];
      } else {
        e.value = String(ticker[a]);
      }
      if (c) {
        if (e.value) {
          if (c.value !== e.value) {
            let s = e.value;
            if (s.length === 4) {
              s = s.substring(0, 3);
            } else if (s.length === 8) {
              s = s.substring(0, 6);
            }
            c.value = s;
          }
          c.style.backgroundColor = e.value;
          c.style.opacity = '1';
        } else {
          c.style.backgroundColor = '#777';
          c.style.opacity = '0.4';
        }
      }
    }
    function initInput(a1, a2, r, c, t) {
      let e0, e1, e = t === 'checkbox' ? document.querySelector('.rts-checkbox-sel').cloneNode(true) : t === 'color' ? document.querySelector('.rts-color-sel').cloneNode(true) : document.createElement(t === 'textarea' ? 'textarea' : 'input');
      if (a1 !== 'url' && a1 !== 'proxy-url') {
        if (r) {
          e.style.gridRowStart = '' + r;
        }
        if (c) {
          e.style.gridColumnStart = '' + c;
        }
      }
      if (t === 'color') {
        e0 = e;
        e = e0.querySelector('input[type=text]');
        e1 = e0.querySelector('input[type=color]');
        e0.classList.remove('rts-color-sel');
        e0.style.display = 'flex';
        e1.addEventListener('change', () => {
          e.value = e1.value;
          attrChanged(a1, a2, e);
        }, false);
      }
      ti++;
      e.tabIndex = '' + ti;
      if (t === 'checkbox') {
        e.style.display = 'block';
        e0 = e;
        e0.classList.remove('rts-checkbox-sel');
        e = e0.querySelector('input');
        e1 = e0.querySelector('div');
        e1.addEventListener('click', ev => {
          ev.preventDefault();
          e.checked = !e.checked;
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
            if (a1) {
              attrChanged(a1, a2, e);
            } else if (a2) {
              a2(e);
            }
          }
        }, false);
      } else if (t !== 'color') {
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
        if (t && t !== 'textarea') {
          e.type = t;
        }
      }
      if (a1) {
        e.classList.add('rts-attr-' + a1);
        if (t !== 'checkbox') {
          e.addEventListener('change', ev => {
            ev.preventDefault();
            attrChanged(a1, a2, e);
          });
        }
        initValue(a2, e, t === 'color' ? e1 : null);
        let h = () => initValue(a2, e, t === 'color' ? e1 : null);
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
      return t === 'checkbox' || t === 'color' ? e0 : e;
    }
    function initLabel(a, r, c) {
      let e = document.createElement('label');
      if (a === 'url' || a === 'proxy-url') {
        e.classList.add('rts-label-url');
      } else {
        e.classList.add('rts-label');
        if (r) {
          e.style.gridRowStart = '' + r;
        }
        if (c) {
          e.style.gridColumnStart = '' + c;
        }
      }
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
    let e, e0, fe, iurl, ipurl, lurl, urlswitch, bplay, bstop, bstore, bload, bdefaults, bcancel;
    this._e = document.querySelector('.rts-settings-container-sel').cloneNode(true);
    this._e.classList.remove('rts-settings-container-sel');
    this._e.style.display = 'flex';
    document.body.appendChild(this._e);
    e0 = this._e.querySelector('.rts-settings-input-top');
    lurl = initLabel('url');
    e0.appendChild(lurl);
    iurl = initInput('url', 'url');
    fe = iurl; // focus element
    e0.appendChild(iurl);
    ipurl = initInput('proxy-url', 'proxyUrl');
    ipurl.style.display = 'none';
    e0.appendChild(ipurl);
    urlswitch = initInput(null, (e) => {
      if (e.checked) {
        lurl.innerHTML = 'proxy-url';
        iurl.style.display = 'none';
        ipurl.style.display = 'inline';
        ipurl.focus();
      } else {
        lurl.innerHTML = 'url';
        iurl.style.display = 'inline';
        ipurl.style.display = 'none';
        iurl.focus();
      }
    }, null, null, 'checkbox');
    urlswitch.classList.add('rts-urlswitch');
    urlswitch.style.transform = 'scale(0.65)';
    e0.appendChild(urlswitch);
    e0 = this._e.querySelector('.rts-settings-input-bottom');
    e = initLabel('speed', 1, 1);
    e0.appendChild(e);
    e = initInput('speed', 'speed', 1, 2, 'number');
    e.min = 1;
    e.max = 10;
    e0.appendChild(e);
    e = initLabel('font-size', 2, 1);
    e0.appendChild(e);
    e = initInput('font-size', 'fontSize', 2, 2, 'number');
    e.min = 0.000001;
    e.max = 999999;
    e0.appendChild(e);
    e = initLabel('img-size', 3, 1);
    e0.appendChild(e);
    e = initInput('img-size', 'imgSize', 3, 2, 'number');
    e.min = 0.000001;
    e.max = 999999;
    e0.appendChild(e);
    e = initLabel('item-gap', 4, 1);
    e0.appendChild(e);
    e = initInput('item-gap', 'itemGap', 4, 2, 'number');
    e.min = 0.000001;
    e.max = 999999;
    e0.appendChild(e);
    e = initLabel('transparency', 5, 1);
    e0.appendChild(e);
    e = initInput('transparency', 'transparency', 5, 2, 'number');
    e.min = 0.000001;
    e.max = 999999;
    e0.appendChild(e);
    e = initLabel('refetch-mins', 6, 1);
    e0.appendChild(e);
    e = initInput('refetch-mins', 'refetchMins', 6, 2, 'number');
    e.min = 0;
    e.max = 999999;
    e0.appendChild(e);
    e = initLabel('infobox-link-color', 7, 1);
    e0.appendChild(e);
    e = initInput('infobox-link-color', 'infoboxLinkColor', 7, 2, 'color');
    e0.appendChild(e);
    e = initLabel('infobox-link-bgcolor', 8, 1);
    e0.appendChild(e);
    e = initInput('infobox-link-bgcolor', 'infoboxLinkBgColor', 8, 2, 'color');
    e0.appendChild(e);
    e = initLabel('cont-run', 1, 3);
    e0.appendChild(e);
    e = initInput('cont-run', 'contRun', 1, 4, 'checkbox');
    e0.appendChild(e);
    e = initLabel('keep-url', 2, 3);
    e0.appendChild(e);
    e = initInput('keep-url', 'keepUrl', 2, 4, 'checkbox');
    e0.appendChild(e);
    e = initLabel('no-imgs', 3, 3);
    e0.appendChild(e);
    e = initInput('no-imgs', 'noImgs', 3, 4, 'checkbox');
    e0.appendChild(e);
    e = initLabel('moveright', 4, 3);
    e0.appendChild(e);
    e = initInput('moveright', 'moveright', 4, 4, 'checkbox');
    e0.appendChild(e);
    e = initLabel('hrs-new', 5, 3);
    e0.appendChild(e);
    e = initInput('hrs-new', 'hrsNew', 5, 4, 'number');
    e.min = 0.000001;
    e.max = 999999;
    e0.appendChild(e);
    e = initLabel('hrs-old', 6, 3);
    e0.appendChild(e);
    e = initInput('hrs-old', 'hrsOld', 6, 4, 'number');
    e.min = 0.000001;
    e.max = 999999;
    e0.appendChild(e);
    e = initLabel('color-new', 7, 3);
    e0.appendChild(e);
    e = initInput('color-new', 'colorNew', 7, 4, 'color');
    e0.appendChild(e);
    e = initLabel('color-old', 8, 3);
    e0.appendChild(e);
    e = initInput('color-old', 'colorOld', 8, 4, 'color');
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
    ticker.addBusyListener(this._tbl);
    this.updBusyInd();
    e0 = this._e.querySelector('.rts-settings-buttons');
    bstore = initButton('S', () => {
      let d = '';
      for (const [a1, v] of this._inputs) {
        if (d.length > 0) {
          d += ';';
        }
        d += a1 + '=' + encodeURI(String(v[1].type === 'checkbox' ? v[1].checked : v[1].value ? v[1].value : ''));
      }
      Util.createCookie('SettingsRssTicker', d, 365);
    });
    e0.appendChild(bstore);
    bload = initButton('L', () => {
      let c = Util.readCookie('SettingsRssTicker');
      if (!c) {
        return;
      }
      let a = c.split(';');
      for (let i = 0; i < a.length; i++) {
        let a2 = a[i].split('=');
        let v = this._inputs.get(a2[0]);
        if (v) {
          let d = decodeURI(a2[1]);
          if (v[1].type == 'checkbox') {
            v[1].checked = d === 'true';
          } else {
            v[1].value = d;
          }
          attrChanged(a2[0], v[0], v[1]);
        }
      }
    });
    e0.appendChild(bload);
    bdefaults = initButton('D', () => {
      let ap = ticker.constructor.apNames;
      for (let i = 0; i < ap.length - 1; i += 2) {
        let d = this._dfts[ap[i]];
        if (d !== undefined && d !== null) {
          let v = this._inputs.get(ap[i]);
          if (v) {
            if (v[1].type == 'checkbox') {
              v[1].checked = Boolean(d);
            } else {
              v[1].value = d;
            }
            attrChanged(ap[i], v[0], v[1]);
          }
        }
      }
    });
    e0.appendChild(bdefaults);
    bcancel = initButton('<i class="fas fa-window-close"></i>', () => {
      this.remove();
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
      if (!this._removed) {
        this._e.style.opacity = 0.95;
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
        for (const [a1, v] of this._inputs) {
          let l = m.get(a1);
          if (l) {
            let i = l.indexOf(v[2]);
            if (i >= 0) {
              l.splice(i, 1);
            }
            if (l.length === 0) {
              m.delete(a1);
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
