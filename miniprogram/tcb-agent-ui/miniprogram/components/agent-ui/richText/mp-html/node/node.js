/* eslint-disable */
'use strict';
function t(e) {
  '@babel/helpers - typeof';
  return (t =
    'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
      ? function (t) {
          return typeof t;
        }
      : function (t) {
          return t &&
            'function' == typeof Symbol &&
            t.constructor === Symbol &&
            t !== Symbol.prototype
            ? 'symbol'
            : typeof t;
        })(e);
}
function e(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e &&
      (o = o.filter(function (e) {
        return Object.getOwnPropertyDescriptor(t, e).enumerable;
      })),
      r.push.apply(r, o);
  }
  return r;
}
function r(t) {
  for (var r = 1; r < arguments.length; r++) {
    var i = null != arguments[r] ? arguments[r] : {};
    r % 2
      ? e(Object(i), !0).forEach(function (e) {
          o(t, e, i[e]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i))
      : e(Object(i)).forEach(function (e) {
          Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e));
        });
  }
  return t;
}
function o(t, e, r) {
  return (
    (e = i(e)) in t
      ? Object.defineProperty(t, e, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (t[e] = r),
    t
  );
}
function i(e) {
  var r = s(e, 'string');
  return 'symbol' == t(r) ? r : r + '';
}
function s(e, r) {
  if ('object' != t(e) || !e) return e;
  var o = e[Symbol.toPrimitive];
  if (void 0 !== o) {
    var i = o.call(e, r || 'default');
    if ('object' != t(i)) return i;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return ('string' === r ? String : Number)(e);
}
Component({
  data: { ctrl: {}, isiOS: wx.getSystemInfoSync().system.includes('iOS') },
  properties: { childs: Array, opts: Array },
  options: { addGlobalClass: !0 },
  attached: function () {
    this.triggerEvent('add', this, { bubbles: !0, composed: !0 });
  },
  methods: {
    noop: function () {},
    getNode: function (t) {
      try {
        for (
          var e = t.split('_'), r = this.data.childs[e[0]], o = 1;
          o < e.length;
          o++
        )
          r = r.children[e[o]];
        return r;
      } catch (t) {
        return { text: '', attrs: {}, children: [] };
      }
    },
    play: function (t) {
      var e = t.target.dataset.i,
        o = this.getNode(e);
      if (
        (this.root.triggerEvent('play', {
          source: o.name,
          attrs: r(r({}, o.attrs), {}, { src: o.src[this.data.ctrl[e] || 0] }),
        }),
        this.root.data.pauseVideo)
      ) {
        for (var i = !1, s = t.target.id, n = this.root._videos.length; n--; )
          this.root._videos[n].id === s
            ? (i = !0)
            : this.root._videos[n].pause();
        if (!i) {
          var a = wx.createVideoContext(s, this);
          (a.id = s),
            this.root.playbackRate && a.playbackRate(this.root.playbackRate),
            this.root._videos.push(a);
        }
      }
    },
    imgTap: function (t) {
      var e = this.getNode(t.target.dataset.i);
      if (
        !e.attrs.ignore &&
        (this.root.triggerEvent('imgtap', e.attrs), this.root.data.previewImg)
      ) {
        var r = this.root.imgList[e.i];
        wx.previewImage({
          showmenu: this.root.data.showImgMenu,
          current: r,
          urls: this.root.imgList,
        });
      }
    },
    imgLoad: function (t) {
      var e,
        r = t.target.dataset.i,
        i = this.getNode(r);
      i.w
        ? ((this.data.opts[1] && !this.data.ctrl[r]) ||
            -1 === this.data.ctrl[r]) &&
          (e = 1)
        : (e = t.detail.width),
        e && this.setData(o({}, 'ctrl.' + r, e)),
        this.checkReady();
    },
    checkReady: function () {
      var t = this;
      this.root.data.lazyLoad ||
        ((this.root.imgList._unloadimgs -= 1),
        this.root.imgList._unloadimgs ||
          setTimeout(function () {
            t.root
              .getRect()
              .then(function (e) {
                t.root.triggerEvent('ready', e);
              })
              .catch(function () {
                t.root.triggerEvent('ready', {});
              });
          }, 350));
    },
    mediaError: function (t) {
      var e = t.target.dataset.i,
        r = this.getNode(e);
      if ('video' === r.name || 'audio' === r.name) {
        var i = (this.data.ctrl[e] || 0) + 1;
        if ((i > r.src.length && (i = 0), i < r.src.length))
          return this.setData(o({}, 'ctrl.' + e, i));
      } else
        'img' === r.name &&
          (this.data.opts[2] && this.setData(o({}, 'ctrl.' + e, -1)),
          this.checkReady());
      this.root &&
        this.root.triggerEvent('error', {
          source: r.name,
          attrs: r.attrs,
          errMsg: t.detail.errMsg,
        });
    },
  },
});
