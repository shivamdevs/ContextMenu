HTMLElement.prototype.popup = function(data = [], dir = 'f', dark = false){
  return popup.bind(this, data, dir, dark);
}
HTMLElement.prototype.popupContext = function(data = [], dir = 'f', dark = false){
  return popup.bindContext(this, data, dir, dark);
}
HTMLElement.prototype.computed = function(prop){
  return window.getComputedStyle(this, null).getPropertyValue(prop);
}
var popup = function() {};
popup.bind = function(node = null, data = [], dir = 'f', dark = false) {
  if (!node || !(typeof data == 'object') || !(data.length)) { return false; }
  if (node.hasAttribute('popup')) {
    var prepop = document.body.querySelector('popup[data="' + node.getAttribute('popup') + '"]');
    if (prepop) { document.body.removeChild(prepop); }
  } else {
    node.addEventListener('click', function(event) { popup.click(this,event); }, true);
  }
  return popup.construct(node,data,dir,dark);
};
popup.bindContext = function(node = null, data = [], dir = 'f', dark = false) {
  if (!node || !(typeof data == 'object') || !(data.length)) { return false; }
  if (node.hasAttribute('popup')) {
    var prepop = document.body.querySelector('popup[data="' + node.getAttribute('popup') + '"]');
    if (prepop) { document.body.removeChild(prepop); }
  } else {
    node.addEventListener('contextmenu', function(event) { event.preventDefault(); popup.clickContext(this,event); }, true);
    node.addEventListener('click', function(event) { popup.hide(document.querySelector('popup[data="' + node.getAttribute('popup') + '"]')); }, true);
  }
  return popup.construct(node,data,dir,dark);
};
popup.click = function(node,ev) {
  var pop = document.querySelector('popup[data="' + node.getAttribute('popup') + '"]');
  if (pop) {
    if (pop.computed('display') === 'none') {
      var pos = popup.position(node,pop,ev);
      pop.style.top = pos.top;
      pop.style.left = pos.left;
      popup.fadeIn(pop, 100);
    } else {
      popup.hide(pop);
    }
  }
};
popup.clickContext = function(node,ev) {
  var pop = document.querySelector('popup[data="' + node.getAttribute('popup') + '"]');
  if (pop) {
    if (pop.computed('display') === 'none') {
      var pos = popup.position(node,pop,ev);
      pop.style.top = pos.top;
      pop.style.left = pos.left;
      popup.fadeIn(pop, 100);
    }
  }
};
popup.closest = function(a,b) {
  while (a && a !== document.body) {
    if (a && a === b) return a;
    a = a.parentElement;
  }
}
popup.construct = function(node,data,dir,dark) {
  var pp = document.createElement('popup'), direction, ppl = document.createElement('popup-list');
  var popid = popup.hashid();
  switch (dir) {
    case 'top-left'            : direction = 'tl'; break;
    case 'top'                 : direction = 't';  break;
    case 'top-right'           : direction = 'tr'; break;
    case 'right-top'           : direction = 'rt'; break;
    case 'right'               : direction = 'r';  break;
    case 'right-bottom'        : direction = 'rb'; break;
    case 'bottom-right'        : direction = 'br'; break;
    case 'bottom'              : direction = 'b';  break;
    case 'bottom-left'         : direction = 'bl'; break;
    case 'left-bottom'         : direction = 'lb'; break;
    case 'left'                : direction = 'l';  break;
    case 'left-top'            : direction = 'lt'; break;
    case 'left-top-corner'     : direction = 'ltc'; break;
    case 'top-left-corner'     : direction = 'tlc'; break;
    case 'top-right-corner'    : direction = 'trc'; break;
    case 'right-top-corner'    : direction = 'rtc'; break;
    case 'right-bottom-corner' : direction = 'rbc'; break;
    case 'bottom-right-corner' : direction = 'brc'; break;
    case 'bottom-left-corner'  : direction = 'blc'; break;
    case 'left-bottom-corner'  : direction = 'lbc'; break;
    case 'free'                : direction = 'f';  break;
    default                    : direction = dir;  break;
  }
  node.setAttribute('popup', popid);
  pp.setAttribute('data', popid);
  pp.setAttribute('dir', direction);
  if (dark) { pp.classList.add('dark'); }
  pp.style.opacity = '0';
  pp.style.visibility = 'hidden';
  document.body.appendChild(pp);
  pp.appendChild(ppl);
  ppl.addEventListener('scroll', function(event) {
    event.preventDefault();
    event.stopPropagation();
  }, true);
  popup.construct.arraylist(data, ppl,1);
  setTimeout(function () {
    pp.style.height = pp.computed('height');
    pp.setAttribute('height', pp.computed('height').split('px')[0]);
    pp.setAttribute('width', pp.computed('width').split('px')[0]);
    pp.style.display = 'none';
    pp.style.opacity = '';
    pp.style.visibility = '';
  }, 10);
  return pp;
};
popup.construct.arraylist = function(arr,node,zi) {
  arr.forEach((item, i) => {
    if (typeof item === 'object') {
      var text = ((item.text || item.title) || "")
        , data = ((((item.data || item.fun) || item.perform) || item.callback) || null)
        , icon = ((item.icon || item.logo) || "")
        , dsbl = ((item.dsbl || item.disabled) || false)
        , subg = item.subgroup || item.sub || item.extend || item.expand || [];
      if (text) {
        var opt = document.createElement('button')
          , icn = document.createElement('span')
          , cnt = document.createElement('span')
          , mor = document.createElement('span');
        if (dsbl) { opt.disabled = true; }
        if (icon) { icn.innerHTML = icon; }
        cnt.innerHTML = text;
        opt.appendChild(icn);
        opt.appendChild(cnt);
        opt.appendChild(mor);
        opt.addEventListener('click', function(event) {
          setTimeout(data);
          popup.hide(popup.closest(opt,document.querySelector('popup')));
        }, true);
        node.appendChild(opt);
        if (subg && subg.length) {
          mor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.71 15.29l2.59-2.59c.39-.39.39-1.02 0-1.41L11.71 8.7c-.63-.62-1.71-.18-1.71.71v5.17c0 .9 1.08 1.34 1.71.71z"/></svg>';
          var sbg = document.createElement('popup-group');
          var sbgl = document.createElement('popup-list');
          opt.setAttribute('popup-group',true);
          opt.addEventListener('mouseover', function(event) {
            clearTimeout(opt.getAttribute('popup-group'));
            opt.setAttribute('popup-group', setTimeout(function () { popup.construct.subgroup(opt,sbg,true); }, 100));
          }, true);
          opt.addEventListener('mouseout', function(event) {
            clearTimeout(opt.getAttribute('popup-group'));
            opt.setAttribute('popup-group', setTimeout(function () { popup.construct.subgroup(opt,sbg,false); }, 100));
          }, true);
          sbg.addEventListener('mouseover', function(event) {
            clearTimeout(opt.getAttribute('popup-group'));
            popup.construct.subgroup(opt,sbg,true);
          }, true);
          sbg.addEventListener('scroll', function(event) {
            event.preventDefault();
            event.stopPropagation();
          }, true);
          sbg.addEventListener('mouseout', function(event) {
            clearTimeout(opt.getAttribute('popup-group'));
            opt.setAttribute('popup-group', setTimeout(function () { popup.construct.subgroup(opt,sbg,false); }, 100));
          }, true);
          sbg.style.opacity = '0';
          sbg.style.zIndex = zi;
          sbg.style.visibility = 'hidden';
          node.appendChild(sbg);
          sbg.appendChild(sbgl);
          popup.construct.arraylist(subg, sbgl, (zi+1));
          setTimeout(function () {
            sbg.style.height = sbg.computed('height');
            sbg.setAttribute('height', sbg.computed('height').split('px')[0]);
            sbg.setAttribute('width', sbg.computed('width').split('px')[0]);
            sbg.style.display = 'none';
            sbg.style.opacity = '';
            sbg.style.visibility = '';
          }, 10);
        }
      }
    } else {
      node.appendChild(document.createElement('popup-break'));
    }
  });
}
popup.fadeIn = function(el, time) {
  el.style.opacity = 0;
  el.style.display = '';
  var last = +new Date();
  var tick = function() {
    el.style.opacity = +el.style.opacity + (new Date() - last) / time;
    last = +new Date();
    if (+el.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    } else {
      el.style.opacity = '';
    }
  };
  tick();
};
popup.hashid = function() {
  var char = '0123456789abcdef';
  function generate(char, length) {
    var charLen = char.length, result = '';
    for ( let i = 0; i < length; i++ ) { result += char.charAt(Math.floor(Math.random() * charLen)); };
    return result;
  };
  function newid() { return generate(char,8)+'-'+generate(char,4)+'-'+generate(char,4)+'-'+generate(char,4)+'-'+generate(char,12); }
  var invalid = true, id = '';
  while (invalid) {
    id = newid();
    var poparr = document.querySelectorAll('popup');
    if (poparr.length) {
      poparr.forEach((item) => { if (id !== item.getAttribute('data')) { invalid = false; } });
    } else {
      invalid = false;
    }
  }
  return id;
};
popup.hide = function(node) {
  node.style.display = 'none';
  node.style.top = '';
  node.style.right = '';
  node.style.bottom = '';
  node.style.left = '';
  node.querySelector('popup-list').scrollTop = 0;
}
popup.hideall = function() {
  document.body.querySelectorAll('popup').forEach((item) => {
    if (item.style.display === '') {
      popup.hide(item);
    }
  });
}
popup.position = function(node,pop,ev) {
  var pos = {}
    , dir = pop.getAttribute('dir')
    , ns = node.getBoundingClientRect()
    , ps = { height: parseInt(pop.getAttribute('height')), width: parseInt(pop.getAttribute('width')) }
    , ws = { height: window.screen.height, width: window.screen.width }
    , ds = { height: document.documentElement.clientHeight, width: document.documentElement.clientWidth };
  switch (dir) {
    case 'tl':
      pos.top = (ns.top - ps.height - 5) + 'px';
      pos.left = (ns.left + ns.width - ps.width) + 'px';
      break;
    case 't':
      pos.top = (ns.top - ps.height - 5) + 'px';
      pos.left = (ns.left + (ns.width / 2) - (ps.width / 2)) + 'px';
      break;
    case 'tr':
      pos.top = (ns.top - ps.height - 5) + 'px';
      pos.left = (ns.left) + 'px';
      break;
    case 'rt':
      pos.top = (ns.top + ns.height - ps.height) + 'px';
      pos.left = (ns.left + ns.width + 5) + 'px';
      break;
    case 'r':
      pos.top = (ns.top + (ns.height / 2) - (ps.height / 2)) + 'px';
      pos.left = (ns.left + ns.width + 5) + 'px';
      break;
    case 'rb':
      pos.top = (ns.top) + 'px';
      pos.left = (ns.left + ns.width + 5) + 'px';
      break;
    case 'br':
      pos.top = (ns.top + ns.height + 5) + 'px';
      pos.left = (ns.left) + 'px';
      break;
    case 'b':
      pos.top = (ns.top + ns.height + 5) + 'px';
      pos.left = (ns.left + (ns.width / 2) - (ps.width / 2)) + 'px';
      break;
    case 'bl':
      pos.top = (ns.top + ns.height + 5) + 'px';
      pos.left = (ns.left + ns.width - ps.width) + 'px';
      break;
    case 'lb':
      pos.top = (ns.top) + 'px';
      pos.left = (ns.left - ps.width - 5) + 'px';
      break;
    case 'l':
      pos.top = (ns.top + (ns.height / 2) - (ps.height / 2)) + 'px';
      pos.left = (ns.left - ps.width - 5) + 'px';
      break;
    case 'lt':
      pos.top = (ns.top + ns.height - ps.height) + 'px';
      pos.left = (ns.left - ps.width - 5) + 'px';
      break;
    case 'ltc': case 'tlc':
      pos.top = (ns.top - ps.height - 5) + 'px';
      pos.left = (ns.left - ps.width - 5) + 'px';
      break;
    case 'rtc': case 'trc':
      pos.top = (ns.top - ps.height - 5) + 'px';
      pos.left = (ns.left + ns.width + 5) + 'px';
      break;
    case 'brc': case 'rbc':
      pos.top = (ns.top + ns.height + 5) + 'px';
      pos.left = (ns.left + ns.width + 5) + 'px';
      break;
    case 'blc': case 'lbc':
      pos.top = (ns.top + ns.height + 5) + 'px';
      pos.left = (ns.left - ps.width - 5) + 'px';
      break;
    default:
      pos.top = ((ds.height-(ns.top+ns.height)>=ps.height)?(ns.top+ns.height):(ds.height-ps.height)) + 'px';
      pos.left = ((ds.width-(ns.left+ns.width)>=ps.width)?(ns.left+ns.width):(ds.width-ps.width)) + 'px';
  }
  return pos;
};
popup.position.subgroup = function(node,pop) {
  var pos = {}
    , ns = node.getBoundingClientRect()
    , ps = { height: parseInt(pop.getAttribute('height')), width: parseInt(pop.getAttribute('width')) }
    , ws = { height: window.screen.height, width: window.screen.width }
    , ds = { height: document.documentElement.clientHeight, width: document.documentElement.clientWidth }
    , lp = ns.left
    , cp = ns.width
    , rp = ds.width - (lp + cp)
    , mp = ps.width;
    pos.top = ((ds.height-(ns.top+ns.height)>=ps.height)?(ns.top-6):(ds.height-ps.height-4)) + 'px';
    pos.left = ((rp>mp)?(lp+cp-10):(lp-mp+10)) + 'px';
    return pos;
}
document.addEventListener('mousedown', function(event) {
  var c = popup.closest(event.target,document.body.querySelector('popup'))
    , i = popup.closest(event.target,document.querySelector('*[popup]'));
  if (!c && !i) { popup.hideall(); }
}, true);
document.addEventListener('scroll', function(event) {
  var c = popup.closest(event.target,document.body.querySelector('popup'))
    , i = popup.closest(event.target,document.querySelector('*[popup]'));
  if (!c && !i) { popup.hideall(); }
}, true);
window.addEventListener('resize', function(event) {
  popup.hideall();
}, true);
popup.construct.subgroup = function(node,sbg,tp) {
  if (tp) {
    var pos = popup.position.subgroup(node,sbg);
    sbg.style.top = pos.top;
    sbg.style.left = pos.left;
    sbg.style.display = '';
  } else {
    popup.hide(sbg);
  }
};
(function() {
  var a = `@import url("/utilities/apis-font/index.css");@import url("/utilities/web-icons/index.css");popup, popup-group {display: block;max-width: 360px;min-width: 180px;border: 1px solid rgba(0,0,0,.1);box-shadow: 8px 8px 11px 0px rgb(0 0 0 / 20%);box-sizing: border-box;-webkit-tap-highlight-color: transparent;font-family: "Poppins", "Segoe Alt Regular", sans-serif;max-height: calc(100vh - 100px);background: #ffffff;color: #727888;border-radius: 6px;position: fixed;padding: 5px 0;}popup {z-index: 111111;}popup * {box-sizing: border-box;-webkit-tap-highlight-color: transparent;word-wrap: break-word;font-family: "Poppins", "Segoe Alt Regular", sans-serif;}popup popup-list {max-height: 100%;display: block;width: 100%;height: 100%;overflow-y: auto;position: relative;}popup-list::-webkit-scrollbar {width: 12px;}popup-list::-webkit-scrollbar-thumb {background: #dadce0;background-clip: padding-box;border: 4px solid transparent;-webkit-border-radius: 6px;border-radius: 6px;-webkit-box-shadow: none;box-shadow: none;}popup-list::-webkit-scrollbar-track {background: none;border: none;}popup button {display: flex;flex-direction: row;flex-wrap: nowrap;justify-content: space-between;align-items: center;width: 100%;font-size: 13px;padding: 3px;transition: 0.1s;user-select: none;cursor: pointer;text-align: left;background: transparent;border: none;outline: none;height: 32px;min-height: 32px;font-weight: 500;}popup button span {max-height: 100%;display: block;word-wrap: normal;white-space: nowrap;color: #434555;overflow: hidden;text-overflow: ellipsis;transition: 0.1s;}popup button span:nth-child(1) {width: 30px;min-width: 30px;height: 26px;position: relative;display: flex;justify-content: flex-end;align-items: center;}popup button span:nth-child(1) svg {width: 16px;height: 16px;position: absolute;top: 50%;left: 50%;fill: #434555;transform: translate(-50%, -50%);}popup button span:nth-child(1) i {font-size: 16px;position: absolute;top: 50%;left: 50%;color: #434555;transform: translate(-50%, -50%);}popup button span:nth-child(2) {width: calc(100% - 50px);min-width: calc(100% - 50px);}popup button span:nth-child(3) {width: 20px;min-width: 20px;height: 26px;display: flex;justify-content: flex-end;align-items: center;position: relative;}popup button span:nth-child(3) svg {width: 35px;height: 35px;position: absolute;left: -5px;fill: #434555;transition: 0.1s;}popup button:not([disabled]):hover {background: rgb(0 0 0 / 5%);}popup button:not([disabled]):hover span, popup button:not([disabled]):hover span:nth-child(1) i {color: #121212;}popup button:not([disabled]):hover span:nth-child(1) svg, popup button:not([disabled]):hover span:nth-child(3) svg {fill: #121212;}popup button:disabled {cursor: default;color: #727888;}popup button:disabled span {color: #727888;}popup button:disabled span:nth-child(1) {color: #727888;}popup button:disabled span:nth-child(1) svg, popup button:disabled span:nth-child(3) svg {fill: #727888;}popup popup-break {display: block;width: calc(100% - 20px);padding: 0;margin: 2px auto;height: 1px;min-height: 1px;background: rgb(0 0 0 / 20%);}`
    , b = new Blob([a], {type: 'text/css'})
    , c = document.createElement('link');
c.rel = 'stylesheet';
c.href = window.URL.createObjectURL(b);
c.setAttribute('module', 'popup');
document.head.appendChild(c);
})();
