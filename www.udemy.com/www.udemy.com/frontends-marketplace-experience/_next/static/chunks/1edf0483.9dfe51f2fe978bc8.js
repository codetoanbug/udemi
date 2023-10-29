(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [451],
  {
    46725: function (e, t, a) {
      var n, i, o;
      (function () {
        "undefined" !== typeof self && self,
          (i = []),
          (n = function () {
            var t,
              n = {};
            function i(e) {
              var t = 0;
              return function () {
                return t < e.length
                  ? { done: !1, value: e[t++] }
                  : { done: !0 };
              };
            }
            function o(e) {
              var t =
                "undefined" != typeof Symbol &&
                Symbol.iterator &&
                e[Symbol.iterator];
              return t ? t.call(e) : { next: i(e) };
            }
            var r =
                "function" == typeof Object.create
                  ? Object.create
                  : function (e) {
                      function t() {}
                      return (t.prototype = e), new t();
                    },
              s =
                "function" == typeof Object.defineProperties
                  ? Object.defineProperty
                  : function (e, t, a) {
                      return (
                        e == Array.prototype ||
                          e == Object.prototype ||
                          (e[t] = a.value),
                        e
                      );
                    };
            function l(e) {
              e = [
                "object" == typeof globalThis && globalThis,
                e,
                "object" == typeof window && window,
                "object" == typeof self && self,
                "object" == typeof a.g && a.g,
              ];
              for (var t = 0; t < e.length; ++t) {
                var n = e[t];
                if (n && n.Math == Math) return n;
              }
              throw Error("Cannot find global object");
            }
            var c,
              u = l(this);
            function b(e, t) {
              if (t)
                e: {
                  var a = u;
                  e = e.split(".");
                  for (var n = 0; n < e.length - 1; n++) {
                    var i = e[n];
                    if (!(i in a)) break e;
                    a = a[i];
                  }
                  (t = t((n = a[(e = e[e.length - 1])]))) != n &&
                    null != t &&
                    s(a, e, { configurable: !0, writable: !0, value: t });
                }
            }
            if ("function" == typeof Object.setPrototypeOf)
              c = Object.setPrototypeOf;
            else {
              var p;
              e: {
                var d = { Og: !0 },
                  h = {};
                try {
                  (h.__proto__ = d), (p = h.Og);
                  break e;
                } catch ($i) {}
                p = !1;
              }
              c = p
                ? function (e, t) {
                    if (((e.__proto__ = t), e.__proto__ !== t))
                      throw new TypeError(e + " is not extensible");
                    return e;
                  }
                : null;
            }
            var f = c;
            function g(e, t) {
              if (
                ((e.prototype = r(t.prototype)),
                (e.prototype.constructor = e),
                f)
              )
                f(e, t);
              else
                for (var a in t)
                  if ("prototype" != a)
                    if (Object.defineProperties) {
                      var n = Object.getOwnPropertyDescriptor(t, a);
                      n && Object.defineProperty(e, a, n);
                    } else e[a] = t[a];
              e.gi = t.prototype;
            }
            b("String.prototype.repeat", function (e) {
              return (
                e ||
                function (e) {
                  if (null == this)
                    throw new TypeError(
                      "The 'this' value for String.prototype.repeat must not be null or undefined"
                    );
                  var t = this + "";
                  if (0 > e || 1342177279 < e)
                    throw new RangeError("Invalid count value");
                  e |= 0;
                  for (var a = ""; e; )
                    1 & e && (a += t), (e >>>= 1) && (t += t);
                  return a;
                }
              );
            }),
              b("Promise", function (e) {
                function t(e) {
                  (this.Ub = 0), (this.Rd = void 0), (this.sb = []);
                  var t = this.Ad();
                  try {
                    e(t.resolve, t.reject);
                  } catch (a) {
                    t.reject(a);
                  }
                }
                function a() {
                  this.Ha = null;
                }
                function n(e) {
                  return e instanceof t
                    ? e
                    : new t(function (t) {
                        t(e);
                      });
                }
                if (e) return e;
                a.prototype.Te = function (e) {
                  if (null == this.Ha) {
                    this.Ha = [];
                    var t = this;
                    this.Ue(function () {
                      t.eh();
                    });
                  }
                  this.Ha.push(e);
                };
                var i = u.setTimeout;
                (a.prototype.Ue = function (e) {
                  i(e, 0);
                }),
                  (a.prototype.eh = function () {
                    for (; this.Ha && this.Ha.length; ) {
                      var e = this.Ha;
                      this.Ha = [];
                      for (var t = 0; t < e.length; ++t) {
                        var a = e[t];
                        e[t] = null;
                        try {
                          a();
                        } catch (n) {
                          this.Sg(n);
                        }
                      }
                    }
                    this.Ha = null;
                  }),
                  (a.prototype.Sg = function (e) {
                    this.Ue(function () {
                      throw e;
                    });
                  }),
                  (t.prototype.Ad = function () {
                    function e(e) {
                      return function (n) {
                        a || ((a = !0), e.call(t, n));
                      };
                    }
                    var t = this,
                      a = !1;
                    return { resolve: e(this.uh), reject: e(this.Qd) };
                  }),
                  (t.prototype.uh = function (e) {
                    if (e === this)
                      this.Qd(
                        new TypeError("A Promise cannot resolve to itself")
                      );
                    else if (e instanceof t) this.Kh(e);
                    else {
                      e: switch (typeof e) {
                        case "object":
                          var a = null != e;
                          break e;
                        case "function":
                          a = !0;
                          break e;
                        default:
                          a = !1;
                      }
                      a ? this.sh(e) : this.ef(e);
                    }
                  }),
                  (t.prototype.sh = function (e) {
                    var t = void 0;
                    try {
                      t = e.then;
                    } catch (a) {
                      return void this.Qd(a);
                    }
                    "function" == typeof t ? this.Lh(t, e) : this.ef(e);
                  }),
                  (t.prototype.Qd = function (e) {
                    this.qf(2, e);
                  }),
                  (t.prototype.ef = function (e) {
                    this.qf(1, e);
                  }),
                  (t.prototype.qf = function (e, t) {
                    if (0 != this.Ub)
                      throw Error(
                        "Cannot settle(" +
                          e +
                          ", " +
                          t +
                          "): Promise already settled in state" +
                          this.Ub
                      );
                    (this.Ub = e), (this.Rd = t), this.fh();
                  }),
                  (t.prototype.fh = function () {
                    if (null != this.sb) {
                      for (var e = 0; e < this.sb.length; ++e) r.Te(this.sb[e]);
                      this.sb = null;
                    }
                  });
                var r = new a();
                return (
                  (t.prototype.Kh = function (e) {
                    var t = this.Ad();
                    e.Cc(t.resolve, t.reject);
                  }),
                  (t.prototype.Lh = function (e, t) {
                    var a = this.Ad();
                    try {
                      e.call(t, a.resolve, a.reject);
                    } catch (n) {
                      a.reject(n);
                    }
                  }),
                  (t.prototype.then = function (e, a) {
                    function n(e, t) {
                      return "function" == typeof e
                        ? function (t) {
                            try {
                              i(e(t));
                            } catch (a) {
                              o(a);
                            }
                          }
                        : t;
                    }
                    var i,
                      o,
                      r = new t(function (e, t) {
                        (i = e), (o = t);
                      });
                    return this.Cc(n(e, i), n(a, o)), r;
                  }),
                  (t.prototype.catch = function (e) {
                    return this.then(void 0, e);
                  }),
                  (t.prototype.Cc = function (e, t) {
                    function a() {
                      switch (n.Ub) {
                        case 1:
                          e(n.Rd);
                          break;
                        case 2:
                          t(n.Rd);
                          break;
                        default:
                          throw Error("Unexpected state: " + n.Ub);
                      }
                    }
                    var n = this;
                    null == this.sb ? r.Te(a) : this.sb.push(a);
                  }),
                  (t.resolve = n),
                  (t.reject = function (e) {
                    return new t(function (t, a) {
                      a(e);
                    });
                  }),
                  (t.race = function (e) {
                    return new t(function (t, a) {
                      for (var i = o(e), r = i.next(); !r.done; r = i.next())
                        n(r.value).Cc(t, a);
                    });
                  }),
                  (t.all = function (e) {
                    var a = o(e),
                      i = a.next();
                    return i.done
                      ? n([])
                      : new t(function (e, t) {
                          function o(t) {
                            return function (a) {
                              (r[t] = a), 0 == --s && e(r);
                            };
                          }
                          var r = [],
                            s = 0;
                          do {
                            r.push(void 0),
                              s++,
                              n(i.value).Cc(o(r.length - 1), t),
                              (i = a.next());
                          } while (!i.done);
                        });
                  }),
                  t
                );
              });
            var m = {
                Vh: function (e) {
                  var t = "=".repeat((4 - (e.length % 4)) % 4);
                  (e = (e + t).replace(/\-/g, "+").replace(/_/g, "/")),
                    (e = atob(e)),
                    (t = new Uint8Array(e.length));
                  for (var a = 0; a < e.length; ++a) t[a] = e.charCodeAt(a);
                  return t;
                },
              },
              v = {
                Ia: function () {
                  function e(e) {
                    var t = (Math.random().toString(16) + "000000000").substr(
                      2,
                      8
                    );
                    return e ? "-" + t.substr(0, 4) + "-" + t.substr(4, 4) : t;
                  }
                  return e() + e(!0) + e(!0) + e();
                },
              };
            function w(e) {
              var t = D;
              (this.Le = "undefined" === typeof window ? self : window),
                (this.C = e),
                (this.F = t);
            }
            function x(e) {
              if ("indexedDB" in e.Le) return e.Le.indexedDB;
            }
            function y(e) {
              try {
                if (null == x(e)) return !1;
                if (
                  (x(e).open("Braze IndexedDB Support Test"),
                  "undefined" !== typeof window)
                ) {
                  var t = window.bi || window.Ya || window.di;
                  if (t && t.wh && t.wh.id)
                    return (
                      e.F.info(
                        "Not using IndexedDB for storage because we are running inside an extension"
                      ),
                      !1
                    );
                }
                return !0;
              } catch (a) {
                return (
                  e.F.info(
                    "Not using IndexedDB for storage due to following error: " +
                      a
                  ),
                  !1
                );
              }
            }
            function k(e, t, a) {
              var n = x(e).open(e.C.P, e.C.VERSION);
              return null == n
                ? ("function" === typeof a && a(), !1)
                : ((n.onupgradeneeded = function (t) {
                    for (var a in (e.F.info(
                      "Upgrading indexedDB " +
                        e.C.P +
                        " to v" +
                        e.C.VERSION +
                        "..."
                    ),
                    (t = t.target.result),
                    e.C.G))
                      e.C.G.hasOwnProperty(a) &&
                        !t.objectStoreNames.contains(e.C.G[a]) &&
                        t.createObjectStore(e.C.G[a]);
                  }),
                  (n.onsuccess = function (n) {
                    var i = n.target.result;
                    (i.onversionchange = function () {
                      i.close(),
                        "function" === typeof a && a(),
                        e.F.error(
                          "Needed to close the database unexpectedly because of an upgrade in another tab"
                        );
                    }),
                      t(i);
                  }),
                  (n.onerror = function (t) {
                    return (
                      e.F.info(
                        "Could not open indexedDB " +
                          e.C.P +
                          " v" +
                          e.C.VERSION +
                          ": " +
                          t.target.errorCode
                      ),
                      "function" === typeof a && a(),
                      !0
                    );
                  }),
                  !0);
            }
            function E(e, t, a, n) {
              y(e)
                ? k(
                    e,
                    function (i) {
                      i.objectStoreNames.contains(t)
                        ? (((i = i
                            .transaction([t], "readonly")
                            .objectStore(t)
                            .openCursor(null, "prev")).onerror = function () {
                            e.F.error(
                              "Could not open cursor for " +
                                t +
                                " on indexedDB " +
                                e.C.P
                            ),
                              "function" === typeof n && n();
                          }),
                          (i.onsuccess = function (e) {
                            null != (e = e.target.result) &&
                            null != e.value &&
                            null != e.key
                              ? a(e.key, e.value)
                              : "function" === typeof n && n();
                          }))
                        : (e.F.error(
                            "Could not retrieve last record from " +
                              t +
                              " on indexedDB " +
                              e.C.P +
                              " - " +
                              t +
                              " is not a valid objectStore"
                          ),
                          "function" === typeof n && n());
                    },
                    n
                  )
                : "function" === typeof n && n();
            }
            function S(e, t, a) {
              y(e) &&
                k(e, function (n) {
                  n.objectStoreNames.contains(t)
                    ? (n
                        .transaction([t], "readwrite")
                        .objectStore(t)
                        .delete(a).onerror = function () {
                        e.F.error(
                          "Could not delete record " +
                            a +
                            " from " +
                            t +
                            " on indexedDB " +
                            e.C.P
                        );
                      })
                    : e.F.error(
                        "Could not delete record " +
                          a +
                          " from " +
                          t +
                          " on indexedDB " +
                          e.C.P +
                          " - " +
                          t +
                          " is not a valid objectStore"
                      );
                });
            }
            function A(e, t, a) {
              y(e) &&
                k(e, function (n) {
                  if (n.objectStoreNames.contains(t)) {
                    var i = n.transaction([t], "readwrite").objectStore(t);
                    n = i.openCursor();
                    var o = [];
                    (n.onerror = function () {
                      0 < o.length
                        ? (e.F.info(
                            "Cursor closed midway through for " +
                              t +
                              " on indexedDB " +
                              e.C.P
                          ),
                          a(o))
                        : e.F.error(
                            "Could not open cursor for " +
                              t +
                              " on indexedDB " +
                              e.C.P
                          );
                    }),
                      (n.onsuccess = function (e) {
                        var t = e.target.result;
                        null != t
                          ? (null != t.value &&
                              null != t.key &&
                              (i.delete(t.key).onsuccess = function () {
                                o.push(t.value);
                              }),
                            t.continue())
                          : 0 < o.length && a(o);
                      });
                  } else e.F.error("Could not retrieve objects from " + t + " on indexedDB " + e.C.P + " - " + t + " is not a valid objectStore");
                });
            }
            (w.prototype.setItem = function (e, t, a, n, i) {
              if (!y(this)) return "function" === typeof i && i(), !1;
              var o = this;
              return k(
                this,
                function (r) {
                  r.objectStoreNames.contains(e)
                    ? (((r = r
                        .transaction([e], "readwrite")
                        .objectStore(e)
                        .put(a, t)).onerror = function () {
                        o.F.error(
                          "Could not store object " +
                            t +
                            " in " +
                            e +
                            " on indexedDB " +
                            o.C.P
                        ),
                          "function" === typeof i && i();
                      }),
                      (r.onsuccess = function () {
                        "function" === typeof n && n();
                      }))
                    : (o.F.error(
                        "Could not store object " +
                          t +
                          " in " +
                          e +
                          " on indexedDB " +
                          o.C.P +
                          " - " +
                          e +
                          " is not a valid objectStore"
                      ),
                      "function" === typeof i && i());
                },
                i
              );
            }),
              (w.prototype.getItem = function (e, t, a) {
                if (!y(this)) return !1;
                var n = this;
                return k(this, function (i) {
                  i.objectStoreNames.contains(e)
                    ? (((i = i
                        .transaction([e], "readonly")
                        .objectStore(e)
                        .get(t)).onerror = function () {
                        n.F.error(
                          "Could not retrieve object " +
                            t +
                            " in " +
                            e +
                            " on indexedDB " +
                            n.C.P
                        );
                      }),
                      (i.onsuccess = function (e) {
                        null != (e = e.target.result) && a(e);
                      }))
                    : n.F.error(
                        "Could not retrieve object " +
                          t +
                          " in " +
                          e +
                          " on indexedDB " +
                          n.C.P +
                          " - " +
                          e +
                          " is not a valid objectStore"
                      );
                });
              }),
              (w.prototype.clearData = function () {
                if (!y(this)) return !1;
                var e,
                  t = [];
                for (e in this.C.G)
                  this.C.G.hasOwnProperty(e) &&
                    this.C.G[e] !== this.C.G.xb &&
                    t.push(this.C.G[e]);
                var a = this;
                return k(this, function (e) {
                  e = e.transaction(t, "readwrite");
                  for (var n = 0; n < t.length; n++)
                    e.objectStore(t[n]).clear().onerror = function () {
                      a.F.error(
                        "Could not clear " +
                          this.source.name +
                          " on indexedDB " +
                          a.C.P
                      );
                    };
                  e.onerror = function () {
                    a.F.error(
                      "Could not clear object stores on indexedDB " + a.C.P
                    );
                  };
                });
              });
            var C = {
                Gd: function (e) {
                  (void 0 === e && void 0 !== C.Ea) || (C.Ea = !!e),
                    C.He || (C.He = !0);
                },
                Jb: function () {
                  (C.He = !1), (C.Ea = void 0), (C.F = void 0);
                },
                Td: function (e) {
                  "function" !== typeof e
                    ? C.info(
                        "Ignoring setLogger call since logger is not a function"
                      )
                    : (C.Gd(), (C.F = e));
                },
                Yd: function () {
                  C.Gd(),
                    C.Ea
                      ? (console.log("Disabling Appboy logging"), (C.Ea = !1))
                      : (console.log("Enabled Appboy logging"), (C.Ea = !0));
                },
                info: function (e) {
                  C.Ea &&
                    ((e = "Appboy: " + e),
                    null != C.F ? C.F(e) : console.log(e));
                },
                warn: function (e) {
                  C.Ea &&
                    ((e = "Appboy SDK Warning: " + e + " (v3.5.0)"),
                    null != C.F ? C.F(e) : console.warn(e));
                },
                error: function (e) {
                  C.Ea &&
                    ((e = "Appboy SDK Error: " + e + " (v3.5.0)"),
                    null != C.F ? C.F(e) : console.error(e));
                },
              },
              N = {
                CustomEvent: "ce",
                eg: "p",
                sg: "pc",
                $h: "ca",
                fg: "i",
                Yc: "ie",
                Jf: "cci",
                Lf: "ccic",
                Hf: "ccc",
                If: "ccd",
                ve: "ss",
                yg: "se",
                dg: "si",
                ke: "sc",
                je: "sbc",
                cg: "sfe",
                Mf: "iec",
                lg: "lr",
                Df: "uae",
                Gf: "ci",
                Ff: "cc",
                jg: "lcaa",
                kg: "lcar",
                Of: "inc",
                Nf: "add",
                Pf: "rem",
                Qf: "set",
                zg: "sgu",
              },
              T = { $f: "feed_displayed", Kf: "content_cards_displayed" },
              _ = {
                ba: {
                  P: "AppboyServiceWorkerAsyncStorage",
                  VERSION: 6,
                  G: {
                    Rf: "data",
                    oe: "pushClicks",
                    gd: "pushSubscribed",
                    Yh: "fallbackDevice",
                    Ef: "cardUpdates",
                    xb: "optOut",
                    me: "pendingData",
                    qe: "sdkAuthenticationSignature",
                  },
                  kb: 1,
                },
              },
              D = C,
              O = {
                Af: "allowCrawlerActivity",
                Rc: "baseUrl",
                ng: "noCookies",
                ee: "devicePropertyAllowlist",
                Vc: "devicePropertyWhitelist",
                Wf: "disablePushTokenMaintenance",
                Yf: "enableLogging",
                Zf: "enableSdkAuthentication",
                mg: "manageServiceWorkerExternally",
                ag: "minimumIntervalBetweenTriggerActionsInSeconds",
                xg: "sessionTimeoutInSeconds",
                Cf: "appVersion",
                wg: "serviceWorkerLocation",
                ug: "safariWebsitePushId",
                cd: "localization",
                be: "contentSecurityNonce",
                fe: "enableHtmlInAppMessages",
                Zd: "allowUserSuppliedJavascript",
                bg: "inAppMessageZIndex",
                pg: "openInAppMessagesInNewTab",
                qg: "openNewsFeedCardsInNewTab",
                tg: "requireExplicitInAppMessageDismissal",
                Xf: "doNotLoadFontAwesome",
                re: "sdkFlavor",
                $c: "language",
                og: "openCardsInNewTab",
              };
            function M(e, t, a, n) {
              return (
                -1 !== (e = L(e)).indexOf(t) ||
                (D.error(
                  a +
                    " Valid values from " +
                    n +
                    ' are "' +
                    e.join('"/"') +
                    '".'
                ),
                !1)
              );
            }
            function I(e) {
              return Array.isArray
                ? Array.isArray(e)
                : "[object Array]" === Object.prototype.toString.call(e);
            }
            function z(e) {
              return "[object Date]" === Object.prototype.toString.call(e);
            }
            function P(e) {
              return "[object Object]" === Object.prototype.toString.call(e);
            }
            function U(e) {
              null == e && (e = []);
              for (
                var t = [], a = arguments.length, n = 0, i = e.length;
                n < i;
                n++
              ) {
                var o = e[n];
                if (-1 === t.indexOf(o)) {
                  var r;
                  for (r = 1; r < a && -1 !== arguments[r].indexOf(o); r++);
                  r === a && t.push(o);
                }
              }
              return t;
            }
            function R(e) {
              var t,
                a = [];
              for (t in e) e.hasOwnProperty(t) && a.push(t);
              return a;
            }
            function L(e) {
              var t,
                a = [];
              for (t in e)
                e.hasOwnProperty(t) && void 0 !== e[t] && a.push(e[t]);
              return a;
            }
            function B(e, t) {
              if (e === t) return 0 !== e || 1 / e === 1 / t;
              if (null == e || null == t) return e === t;
              var a = e.toString();
              if (a !== t.toString()) return !1;
              switch (a) {
                case "[object RegExp]":
                case "[object String]":
                  return "" + e === "" + t;
                case "[object Number]":
                  return +e !== +e
                    ? +t !== +t
                    : 0 === +e
                    ? 1 / +e === 1 / t
                    : +e === +t;
                case "[object Date]":
                case "[object Boolean]":
                  return +e === +t;
              }
              if (!(a = "[object Array]" === a)) {
                if ("object" !== typeof e || "object" !== typeof t) return !1;
                var n = e.constructor,
                  i = t.constructor;
                if (
                  n !== i &&
                  !(
                    "function" === typeof n &&
                    n instanceof n &&
                    "function" === typeof i &&
                    i instanceof i
                  ) &&
                  "constructor" in e &&
                  "constructor" in t
                )
                  return !1;
              }
              i = [];
              for (var o = (n = []).length; o--; )
                if (n[o] === e) return i[o] === t;
              if ((n.push(e), i.push(t), a)) {
                if ((o = e.length) !== t.length) return !1;
                for (; o--; ) if (!B(e[o], t[o])) return !1;
              } else {
                if (((o = (a = R(e)).length), R(t).length !== o)) return !1;
                for (; o--; ) {
                  var r = a[o];
                  if (!t.hasOwnProperty(r) || !B(e[r], t[r])) return !1;
                }
              }
              return n.pop(), i.pop(), !0;
            }
            function F(e, t) {
              return (e /= 1e3), t && (e = Math.floor(e)), e;
            }
            function G(e) {
              var t = parseInt(e);
              return null == e || isNaN(t) ? null : new Date(1e3 * t);
            }
            function j(e) {
              return null != e && z(e)
                ? e.toISOString().replace(/\.[0-9]{3}Z$/, "")
                : e;
            }
            function H(e) {
              return null == e || "" === e ? null : new Date(e);
            }
            function K(e, t, a, n, i) {
              (this.gb = e),
                (this.type = t),
                (this.time = null == a || "" === a ? new Date().valueOf() : a),
                (this.sessionId = n),
                (this.data = i);
            }
            function W(e) {
              return null != e && P(e) && null != e.t && "" !== e.t;
            }
            function X(e) {
              return new K(e.u, e.t, e.ts, e.s, e.d);
            }
            function q(e, t, a) {
              null == e && (e = v.Ia()),
                (a = parseInt(a)),
                (isNaN(a) || 0 === a) && (a = new Date().valueOf()),
                (this.ia = e),
                (this.Ib = a),
                (this.Ob = new Date().valueOf()),
                (this.Cd = t);
            }
            function V(e) {
              for (var t = e.length, a = e.length - 1; 0 <= a; a--) {
                var n = e.charCodeAt(a);
                127 < n && 2047 >= n ? t++ : 2047 < n && 65535 >= n && (t += 2),
                  56320 <= n && 57343 >= n && a--;
              }
              return t;
            }
            function Y(e, t, a, n) {
              return (
                (n = "string" === typeof e || (null === e && n)) ||
                  D.error(
                    "Cannot " + t + " because " + a + ' "' + e + '" is invalid.'
                  ),
                n
              );
            }
            function J(e, t, a) {
              var n =
                null != e && "string" === typeof e && ("" === e || e.match(ee));
              return (
                n ||
                  D.error(
                    "Cannot " + t + " because " + a + ' "' + e + '" is invalid.'
                  ),
                n
              );
            }
            function Z(e, t, a, n, i) {
              if ((null == e && (e = {}), "object" !== typeof e || I(e)))
                return (
                  D.error(
                    t +
                      " requires that " +
                      a +
                      " be an object. Ignoring " +
                      i +
                      "."
                  ),
                  [!1, null]
                );
              if (V((t = JSON.stringify(e))) > ae)
                return (
                  D.error(
                    "Could not " +
                      n +
                      " because " +
                      a +
                      " was greater than the max size of " +
                      ne +
                      "."
                  ),
                  [!1, null]
                );
              try {
                var o = JSON.parse(t);
              } catch (c) {
                return (
                  D.error(
                    "Could not " +
                      n +
                      " because " +
                      a +
                      " did not contain valid JSON."
                  ),
                  [!1, null]
                );
              }
              for (var r in e) {
                if (!J(r, n, "the " + i + " property name")) return [!1, null];
                if (null == (a = e[r])) delete e[r], delete o[r];
                else {
                  z(a) && (o[r] = j(a));
                  var s = n,
                    l = "the " + i + ' property "' + r + '"';
                  if (
                    ((t = P(a) || I(a) ? $(a, o[r]) : Q(a)) ||
                      D.error(
                        "Cannot " +
                          s +
                          " because " +
                          l +
                          ' "' +
                          a +
                          '" is invalid.'
                      ),
                    !t)
                  )
                    return [!1, null];
                }
              }
              return [!0, o];
            }
            function $(e, t) {
              if (I(e) && I(t)) {
                for (var a = 0; a < e.length && a < t.length; a++)
                  if ((z(e[a]) && (t[a] = j(e[a])), !$(e[a], t[a]))) return !1;
              } else {
                if (!P(e)) return Q(e);
                for (var n = (a = o(R(e))).next(); !n.done; n = a.next())
                  if ((z(e[(n = n.value)]) && (t[n] = j(e[n])), !$(e[n], t[n])))
                    return !1;
              }
              return !0;
            }
            function Q(e) {
              var t = typeof e;
              return (
                null == e ||
                "number" === t ||
                "boolean" === t ||
                z(e) ||
                "string" === t
              );
            }
            (K.prototype.Ac = function () {
              var e = {
                name: this.type,
                time: F(this.time),
                data: this.data || {},
                session_id: this.sessionId,
              };
              return null != this.gb && (e.user_id = this.gb), e;
            }),
              (K.prototype.A = function () {
                return {
                  u: this.gb,
                  t: this.type,
                  ts: this.time,
                  s: this.sessionId,
                  d: this.data,
                };
              }),
              (q.prototype.A = function () {
                return { g: this.ia, e: this.Cd, c: this.Ib, l: this.Ob };
              });
            var ee = /^[^\x00-\x1F\x22]+$/,
              te = new RegExp(/^.+@.+\..+$/),
              ae = 51200,
              ne = "50KB",
              ie = {};
            function oe(e, t) {
              (this.f = e), (this.H = t);
            }
            ((t = oe.prototype).o = function (e) {
              null == e &&
                D.error(
                  "getUserId must be supplied with a callback. e.g., appboy.getUser().getUserId(function(userId) {console.log('the user id is ' + userId)})"
                ),
                "function" === typeof e && e(this.f.o());
            }),
              (t.Pg = function (e, t) {
                if (!Y(e, "add alias", "the alias", !1) || 0 >= e.length)
                  return D.error("addAlias requires a non-empty alias"), !1;
                if (!Y(t, "add alias", "the label", !1) || 0 >= t.length)
                  return D.error("addAlias requires a non-empty label"), !1;
                var a = this.H,
                  n = new Pa(),
                  i = wi(a.D),
                  o = N.Df;
                return (
                  n.j.push(
                    new K(a.f.o(), o, new Date().valueOf(), i, { a: e, l: t })
                  ),
                  (n.h = Ae(a.b, n.j)),
                  n.h
                );
              }),
              (t.Eh = function (e) {
                return (
                  !!Y(e, "set first name", "the firstName", !0) &&
                  ki(this.f, "first_name", e)
                );
              }),
              (t.Ih = function (e) {
                return (
                  !!Y(e, "set last name", "the lastName", !0) &&
                  ki(this.f, "last_name", e)
                );
              }),
              (t.Ch = function (e) {
                return null === e ||
                  ("string" === typeof e && null != e.toLowerCase().match(te))
                  ? ki(this.f, "email", e)
                  : (D.error(
                      'Cannot set email address - "' +
                        e +
                        '" did not pass RFC-5322 validation.'
                    ),
                    !1);
              }),
              (t.Fh = function (e) {
                return (
                  "string" === typeof e && (e = e.toLowerCase()),
                  !(
                    null !== e &&
                    !M(
                      se,
                      e,
                      'Gender "' + e + '" is not a valid gender.',
                      "User.Genders"
                    )
                  ) && ki(this.f, "gender", e)
                );
              }),
              (t.Bh = function (e, t, a) {
                return null === e && null === t && null === a
                  ? ki(this.f, "dob", null)
                  : ((e = parseInt(e)),
                    (t = parseInt(t)),
                    (a = parseInt(a)),
                    isNaN(e) ||
                    isNaN(t) ||
                    isNaN(a) ||
                    12 < t ||
                    1 > t ||
                    31 < a ||
                    1 > a
                      ? (D.error(
                          "Cannot set date of birth - parameters should comprise a valid date e.g. setDateOfBirth(1776, 7, 4);"
                        ),
                        !1)
                      : ki(this.f, "dob", e + "-" + t + "-" + a));
              }),
              (t.yh = function (e) {
                return (
                  !!Y(e, "set country", "the country", !0) &&
                  ki(this.f, "country", e)
                );
              }),
              (t.Gh = function (e) {
                return (
                  !!Y(e, "set home city", "the homeCity", !0) &&
                  ki(this.f, "home_city", e)
                );
              }),
              (t.Hh = function (e) {
                return (
                  !!Y(e, "set language", "the language", !0) &&
                  ki(this.f, "language", e)
                );
              }),
              (t.Dh = function (e) {
                return (
                  !!M(
                    le,
                    e,
                    'Email notification setting "' +
                      e +
                      '" is not a valid subscription type.',
                    "User.NotificationSubscriptionTypes"
                  ) && ki(this.f, "email_subscribe", e)
                );
              }),
              (t.Ud = function (e) {
                return (
                  !!M(
                    le,
                    e,
                    'Push notification setting "' +
                      e +
                      '" is not a valid subscription type.',
                    "User.NotificationSubscriptionTypes"
                  ) && ki(this.f, "push_subscribe", e)
                );
              }),
              (t.Jh = function (e) {
                return (
                  !!Y(e, "set phone number", "the phoneNumber", !0) &&
                  (null === e || e.match(re)
                    ? ki(this.f, "phone", e)
                    : (D.error(
                        'Cannot set phone number - "' +
                          e +
                          '" did not pass validation.'
                      ),
                      !1))
                );
              }),
              (t.xh = function (e) {
                return ki(this.f, "image_url", e);
              }),
              (t.Oc = function (e, t, a, n, i) {
                return null == e || null == t
                  ? (D.error(
                      "Cannot set last-known location - latitude and longitude are required."
                    ),
                    !1)
                  : ((e = parseFloat(e)),
                    (t = parseFloat(t)),
                    null != a && (a = parseFloat(a)),
                    null != n && (n = parseFloat(n)),
                    null != i && (i = parseFloat(i)),
                    isNaN(e) ||
                    isNaN(t) ||
                    (null != a && isNaN(a)) ||
                    (null != n && isNaN(n)) ||
                    (null != i && isNaN(i))
                      ? (D.error(
                          "Cannot set last-known location - all supplied parameters must be numeric."
                        ),
                        !1)
                      : 90 < e || -90 > e || 180 < t || -180 > t
                      ? (D.error(
                          "Cannot set last-known location - latitude and longitude are bounded by \xb190 and \xb1180 respectively."
                        ),
                        !1)
                      : (null != a && 0 > a) || (null != i && 0 > i)
                      ? (D.error(
                          "Cannot set last-known location - accuracy and altitudeAccuracy may not be negative."
                        ),
                        !1)
                      : this.H.Oc(this.f.o(), e, t, n, a, i).h);
              }),
              (t.Sd = function (e, t) {
                if (!J(e, "set custom user attribute", "the given key"))
                  return !1;
                var a = typeof t,
                  n = z(t),
                  i = I(t);
                if (
                  "number" !== a &&
                  "boolean" !== a &&
                  !n &&
                  !i &&
                  null !== t &&
                  !J(
                    t,
                    'set custom user attribute "' + e + '"',
                    "the given value"
                  )
                )
                  return !1;
                if ((n && (t = j(t)), i)) {
                  for (a = 0; a < t.length; a++)
                    if (
                      !J(
                        t[a],
                        'set custom user attribute "' + e + '"',
                        "the element in the given array"
                      )
                    )
                      return !1;
                  return Kn(this.H, N.Qf, e, t).h;
                }
                return this.f.Sd(e, t);
              }),
              (t.Qg = function (e, t) {
                return (
                  !(
                    !J(
                      e,
                      "add to custom user attribute array",
                      "the given key"
                    ) ||
                    (null != t &&
                      !J(
                        t,
                        "add to custom user attribute array",
                        "the given value"
                      ))
                  ) && Kn(this.H, N.Nf, e, t).h
                );
              }),
              (t.qh = function (e, t) {
                return (
                  !(
                    !J(
                      e,
                      "remove from custom user attribute array",
                      "the given key"
                    ) ||
                    (null != t &&
                      !J(
                        t,
                        "remove from custom user attribute array",
                        "the given value"
                      ))
                  ) && Kn(this.H, N.Pf, e, t).h
                );
              }),
              (t.kh = function (e, t) {
                if (!J(e, "increment custom user attribute", "the given key"))
                  return !1;
                null == t && (t = 1);
                var a = parseInt(t);
                return isNaN(a) || a !== parseFloat(t)
                  ? (D.error(
                      'Cannot increment custom user attribute because the given incrementValue "' +
                        t +
                        '" is not an integer.'
                    ),
                    !1)
                  : Kn(this.H, N.Of, e, a).h;
              }),
              (t.Pd = function (e, t, a, n, i) {
                this.f.Pd(e, t, a, n, i), qn(this.H);
              }),
              (t.Sb = function (e) {
                this.f.Sb(e);
              }),
              (t.Ah = function (e, t, a) {
                if (!J(e, "set custom location attribute", "the given key"))
                  return !1;
                if (
                  (null !== t || null !== a) &&
                  ((t = parseFloat(t)),
                  (a = parseFloat(a)),
                  isNaN(t) ||
                    90 < t ||
                    -90 > t ||
                    isNaN(a) ||
                    180 < a ||
                    -180 > a)
                )
                  return (
                    D.error(
                      "Received invalid values for latitude and/or longitude. Latitude and longitude are bounded by \xb190 and \xb1180 respectively, or must both be null for removal."
                    ),
                    !1
                  );
                var n = this.H,
                  i = a;
                if (((a = new Pa()), fi(n.J, e)))
                  D.info(
                    'Custom Attribute "' + e + '" is blocklisted, ignoring.'
                  ),
                    (a.h = !1);
                else {
                  var o = wi(n.D);
                  if (null === t && null === i) {
                    var r = N.kg;
                    e = { key: e };
                  } else
                    (r = N.jg), (e = { key: e, latitude: t, longitude: i });
                  a.j.push(new K(n.f.o(), r, new Date().valueOf(), o, e)),
                    (a.h = Ae(n.b, a.j));
                }
                return a.h;
              }),
              (t.Rg = function (e) {
                return !Y(
                  e,
                  "add user to subscription group",
                  "subscription group ID",
                  !1
                ) || 0 >= e.length
                  ? (D.error(
                      "addToSubscriptionGroup requires a non-empty subscription group ID"
                    ),
                    !1)
                  : Vn(this.H, e, ce).h;
              }),
              (t.rh = function (e) {
                return !Y(
                  e,
                  "remove user from subscription group",
                  "subscription group ID",
                  !1
                ) || 0 >= e.length
                  ? (D.error(
                      "removeFromSubscriptionGroup requires a non-empty subscription group ID"
                    ),
                    !1)
                  : Vn(this.H, e, ue).h;
              });
            var re = /^[0-9 .\\(\\)\\+\\-]+$/,
              se = {
                MALE: "m",
                FEMALE: "f",
                OTHER: "o",
                UNKNOWN: "u",
                NOT_APPLICABLE: "n",
                PREFER_NOT_TO_SAY: "p",
              },
              le = {
                OPTED_IN: "opted_in",
                SUBSCRIBED: "subscribed",
                UNSUBSCRIBED: "unsubscribed",
              },
              ce = "subscribed",
              ue = "unsubscribed";
            function be() {}
            function pe(e, t) {
              if (e && t)
                if (((e = e.toLowerCase()), I(t.O))) {
                  for (var a = 0; a < t.O.length; a++)
                    if (-1 !== e.indexOf(t.O[a].toLowerCase())) return t.S;
                } else if (-1 !== e.indexOf(t.O.toLowerCase())) return t.S;
            }
            (ie.User = oe),
              (ie.User.Genders = se),
              (ie.User.NotificationSubscriptionTypes = le),
              (ie.User.prototype.getUserId = oe.prototype.o),
              (ie.User.prototype.setFirstName = oe.prototype.Eh),
              (ie.User.prototype.setLastName = oe.prototype.Ih),
              (ie.User.prototype.setEmail = oe.prototype.Ch),
              (ie.User.prototype.setGender = oe.prototype.Fh),
              (ie.User.prototype.setDateOfBirth = oe.prototype.Bh),
              (ie.User.prototype.setCountry = oe.prototype.yh),
              (ie.User.prototype.setHomeCity = oe.prototype.Gh),
              (ie.User.prototype.setLanguage = oe.prototype.Hh),
              (ie.User.prototype.setEmailNotificationSubscriptionType =
                oe.prototype.Dh),
              (ie.User.prototype.setPushNotificationSubscriptionType =
                oe.prototype.Ud),
              (ie.User.prototype.setPhoneNumber = oe.prototype.Jh),
              (ie.User.prototype.setAvatarImageUrl = oe.prototype.xh),
              (ie.User.prototype.setLastKnownLocation = oe.prototype.Oc),
              (ie.User.prototype.setCustomUserAttribute = oe.prototype.Sd),
              (ie.User.prototype.addToCustomAttributeArray = oe.prototype.Qg),
              (ie.User.prototype.removeFromCustomAttributeArray =
                oe.prototype.qh),
              (ie.User.prototype.incrementCustomUserAttribute =
                oe.prototype.kh),
              (ie.User.prototype.addAlias = oe.prototype.Pg),
              (ie.User.prototype.setCustomLocationAttribute = oe.prototype.Ah),
              (ie.User.prototype.addToSubscriptionGroup = oe.prototype.Rg),
              (ie.User.prototype.removeFromSubscriptionGroup = oe.prototype.rh),
              (be.prototype.Ed = function () {}),
              (be.prototype.Fd = function () {}),
              (be.prototype.qb = function () {});
            var de = {
              ae: "Chrome",
              Wc: "Edge",
              dc: "Internet Explorer",
              le: "Opera",
              hd: "Safari",
              Zh: "Firefox",
            };
            function he() {
              if ((this.userAgentData = navigator.userAgentData)) {
                var e = this.userAgentData.brands;
                if (e && e.length)
                  for (var t = (e = o(e)).next(); !t.done; t = e.next()) {
                    t = t.value;
                    var a = void 0,
                      n = [];
                    for (a in de) de[a] !== de.dc && n.push(de[a]);
                    if (
                      (a = t.brand.match(
                        new RegExp("(" + n.join("|") + ")", "i")
                      )) &&
                      0 < a.length
                    ) {
                      var i = a[0],
                        r = t.version;
                      break;
                    }
                  }
                (this.Ya = i || "Unknown Browser"),
                  (this.version = r || "Unknown Version");
              }
            }
            function fe() {
              this.We = ge();
            }
            function ge() {
              var e = navigator.userAgent || "",
                t =
                  e.match(
                    /(samsungbrowser|tizen|roku|konqueror|icab|crios|opera|ucbrowser|chrome|safari|firefox|camino|msie|trident(?=\/))\/?\s*(\.?\d+(\.\d+)*)/i
                  ) || [];
              if (/trident/i.test(t[1])) {
                var a = /\brv[ :]+(\.?\d+(\.\d+)*)/g.exec(e) || [];
                return [de.dc, a[1] || ""];
              }
              return -1 !== e.indexOf("(Web0S; Linux/SmartTV)")
                ? ["LG Smart TV", null]
                : -1 !== e.indexOf("CrKey")
                ? ["Chromecast", null]
                : -1 !== e.indexOf("BRAVIA") ||
                  -1 !== e.indexOf("SonyCEBrowser") ||
                  -1 !== e.indexOf("SonyDTV")
                ? ["Sony Smart TV", null]
                : -1 !== e.indexOf("PhilipsTV")
                ? ["Philips Smart TV", null]
                : e.match(/\b(Roku)\b/)
                ? ["Roku", null]
                : e.match(/\bAFTM\b/)
                ? ["Amazon Fire Stick", null]
                : t[1] === de.ae &&
                  null !=
                    (a = e.match(
                      /\b(OPR|Edge|EdgA|Edg|UCBrowser)\/(\.?\d+(\.\d+)*)/
                    ))
                ? (((a = a.slice(1))[0] = a[0].replace("OPR", de.le)),
                  (a[0] = a[0].replace("EdgA", de.Wc)),
                  "Edg" === a[0] && (a[0] = de.Wc),
                  [a[0], a[1]])
                : t[1] === de.hd &&
                  null != (a = e.match(/\b(EdgiOS)\/(\.?\d+(\.\d+)*)/))
                ? (((a = a.slice(1))[0] = a[0].replace("EdgiOS", de.Wc)),
                  [a[0], a[1]])
                : ((t = t[2] ? [t[1], t[2]] : [null, null])[0] === de.hd &&
                    null != (a = e.match(/version\/(\.?\d+(\.\d+)*)/i)) &&
                    t.splice(1, 1, a[1]),
                  null != (a = e.match(/\b(UCBrowser)\/(\.?\d+(\.\d+)*)/)) &&
                    t.splice(1, 1, a[2]),
                  t[0] === de.le &&
                  null != (a = e.match(/mini\/(\.?\d+(\.\d+)*)/i))
                    ? ["Opera Mini", a[1] || ""]
                    : (t[0] &&
                        ("msie" === (e = t[0].toLowerCase()) && (t[0] = de.dc),
                        "crios" === e && (t[0] = de.ae),
                        "tizen" === e &&
                          ((t[0] = "Samsung Smart TV"), (t[1] = null)),
                        "samsungbrowser" === e && (t[0] = "Samsung Browser")),
                      t));
            }
            function me() {
              var e = this;
              (this.Md = new (navigator.userAgentData ? he : fe)()),
                (this.userAgent = navigator.userAgent),
                (this.Ya = this.Md.Ed()),
                (this.version = this.Md.Fd()),
                this.qb().then(function (t) {
                  return (e.ga = t);
                }),
                (this.language = (
                  navigator.ji ||
                  navigator.language ||
                  navigator.browserLanguage ||
                  navigator.ii ||
                  ""
                ).toLowerCase()),
                (this.lh = ve(this.userAgent));
            }
            function ve(e) {
              e = e.toLowerCase();
              for (
                var t =
                    "googlebot bingbot slurp duckduckbot baiduspider yandex facebookexternalhit sogou ia_archiver https://github.com/prerender/prerender aolbuild bingpreview msnbot adsbot mediapartners-google teoma".split(
                      " "
                    ),
                  a = 0;
                a < t.length;
                a++
              )
                if (-1 !== e.indexOf(t[a])) return !0;
              return !1;
            }
            g(he, be),
              (he.prototype.Ed = function () {
                return this.Ya;
              }),
              (he.prototype.Fd = function () {
                return this.version;
              }),
              (he.prototype.qb = function (e) {
                var t = this;
                return this.ga
                  ? Promise.resolve(this.ga)
                  : (this.userAgentData.getHighEntropyValues
                      ? this.userAgentData.getHighEntropyValues(["platform"])
                      : Promise.reject()
                    )
                      .then(function (a) {
                        a = a.platform;
                        for (var n = 0; n < e.length; n++) {
                          var i = pe(a, e[n]);
                          if (i) return (t.ga = i), t.ga;
                        }
                        return a;
                      })
                      .catch(function () {
                        return navigator.platform;
                      });
              }),
              g(fe, be),
              (fe.prototype.Ed = function () {
                return this.We[0] || "Unknown Browser";
              }),
              (fe.prototype.Fd = function () {
                return this.We[1] || "Unknown Version";
              }),
              (fe.prototype.qb = function (e) {
                for (var t = 0; t < e.length; t++) {
                  var a = pe(e[t].U, e[t]);
                  if (a)
                    return (
                      "Mac" === a &&
                        1 < navigator.maxTouchPoints &&
                        (a = "iOS"),
                      Promise.resolve(a)
                    );
                }
                return Promise.resolve(navigator.platform);
              }),
              (me.prototype.qb = function () {
                var e = this;
                return this.ga
                  ? Promise.resolve(this.ga)
                  : this.Md.qb(we).then(function (t) {
                      return (e.ga = t);
                    });
              });
            var we = [
                { U: navigator.platform, O: "Win", S: "Windows" },
                { U: navigator.platform, O: "Mac", S: "Mac" },
                { U: navigator.platform, O: "BlackBerry", S: "BlackBerry" },
                { U: navigator.platform, O: "FreeBSD", S: "FreeBSD" },
                { U: navigator.platform, O: "OpenBSD", S: "OpenBSD" },
                { U: navigator.platform, O: "Nintendo", S: "Nintendo" },
                { U: navigator.platform, O: "SunOS", S: "SunOS" },
                { U: navigator.platform, O: "PlayStation", S: "PlayStation" },
                { U: navigator.platform, O: "X11", S: "X11" },
                {
                  U: navigator.userAgent,
                  O: ["iPhone", "iPad", "iPod"],
                  S: "iOS",
                },
                { U: navigator.platform, O: "Pike v", S: "iOS" },
                { U: navigator.userAgent, O: ["Web0S"], S: "WebOS" },
                {
                  U: navigator.platform,
                  O: ["Linux armv7l", "Android"],
                  S: "Android",
                },
                { U: navigator.userAgent, O: ["Android"], S: "Android" },
                { U: navigator.platform, O: "Linux", S: "Linux" },
              ],
              xe = new me();
            function ye(e, t) {
              (this.rc = e), (this.R = t);
            }
            function ke(e, t, a) {
              var n = a;
              null != a && a instanceof q && (n = a.A()), e.rc.store(t, n);
            }
            function Ee(e, t) {
              var a = Se(e, t);
              null != a && ((a.Ob = new Date().valueOf()), ke(e, t, a));
            }
            function Se(e, t) {
              return (
                null == (e = e.rc.Z(t)) || null == e.g
                  ? (e = null)
                  : (((t = new q(e.g, e.e, e.c)).Ob = e.l), (e = t)),
                e
              );
            }
            function Ae(e, t) {
              if (null == t || 0 === t.length) return !1;
              I(t) || (t = [t]);
              var a = e.R.Z(ze.Wb);
              (null != a && I(a)) || (a = []);
              for (var n = 0; n < t.length; n++) a.push(t[n].A());
              return e.R.store(ze.Wb, a);
            }
            function Ce(e) {
              var t = e.R.Z(ze.Wb);
              e.R.remove(ze.Wb), null == t && (t = []), (e = []);
              var a = !1,
                n = null;
              if (I(t))
                for (var i = 0; i < t.length; i++)
                  W(t[i]) ? e.push(X(t[i])) : (n = i);
              else a = !0;
              return (
                (a || null != n) &&
                  ((i = "Stored events could not be deserialized as Events"),
                  a &&
                    (i +=
                      ", was " +
                      Object.prototype.toString.call(t) +
                      " not an array"),
                  null != n &&
                    (i +=
                      ", value at index " + n + " does not look like an event"),
                  (i +=
                    ", serialized values were of type " +
                    typeof t +
                    ": " +
                    JSON.stringify(t)),
                  e.push(
                    new K(null, N.Yc, new Date().valueOf(), null, { e: i })
                  )),
                e
              );
            }
            function Ne(e, t, a) {
              M(
                ze,
                t,
                "StorageManager cannot store object.",
                "StorageManager.KEYS.OBJECTS"
              ) && e.R.store(t, a);
            }
            function Te(e, t) {
              return (
                !!M(
                  ze,
                  t,
                  "StorageManager cannot retrieve object.",
                  "StorageManager.KEYS.OBJECTS"
                ) && e.R.Z(t)
              );
            }
            function _e(e, t) {
              M(
                ze,
                t,
                "StorageManager cannot remove object.",
                "StorageManager.KEYS.OBJECTS"
              ) && e.R.remove(t);
            }
            function De(e, t) {
              var a = e.R.Z(ze.Qa);
              null == a && (a = {});
              var n,
                i = t.user_id || ze.Qc;
              for (n in t)
                "user_id" === n ||
                  (null != a[i] && null != a[i][n]) ||
                  Oe(e, t.user_id, n, t[n]);
            }
            function Oe(e, t, a, n) {
              var i = e.R.Z(ze.Qa);
              null == i && (i = {});
              var o = t || ze.Qc,
                r = i[o];
              if (
                (null == r && ((r = {}), null != t && (r.user_id = t)),
                "custom" === a)
              )
                for (var s in (null == r[a] && (r[a] = {}), n)) r[a][s] = n[s];
              else r[a] = n;
              return (i[o] = r), e.R.store(ze.Qa, i);
            }
            function Me(e) {
              var t = e.R.Z(ze.Qa);
              for (var a in (e.R.remove(ze.Qa), (e = []), t))
                null != t[a] && e.push(t[a]);
              return e;
            }
            ye.prototype.clearData = function () {
              for (var e = R(Ie), t = R(ze), a = 0; a < e.length; a++)
                this.rc.remove(Ie[e[a]]);
              for (e = 0; e < t.length; e++) this.R.remove(ze[t[e]]);
            };
            var Ie = {
                lc: "ab.storage.userId",
                Uc: "ab.storage.deviceId",
                Ta: "ab.storage.sessionId",
              },
              ze = {
                jd: "ab.test",
                Wb: "ab.storage.events",
                Qa: "ab.storage.attributes",
                Qc: "ab.storage.attributes.anonymous_user",
                cc: "ab.storage.device",
                se: "ab.storage.sdk_metadata",
                ue: "ab.storage.session_id_for_cached_metadata",
                kc: "ab.storage.pushToken",
                dd: "ab.storage.newsFeed",
                bd: "ab.storage.lastNewsFeedRefresh",
                vb: "ab.storage.cardImpressions",
                te: "ab.storage.serverConfig",
                kd: "ab.storage.triggers",
                md: "ab.storage.triggers.ts",
                hg: "ab.storage.lastTriggeredTime",
                gg: "ab.storage.lastTriggeredTimesById",
                ig: "ab.storage.lastTriggerEventDataById",
                hc: "ab.storage.messagingSessionStart",
                wb: "ab.storage.cc",
                ac: "ab.storage.ccLastFullSync",
                $b: "ab.storage.ccLastCardUpdated",
                hb: "ab.storage.ccClicks",
                ib: "ab.storage.ccImpressions",
                ua: "ab.storage.ccDismissals",
                fc: "ab.storage.lastDisplayedTriggerTimesById",
                ad: "ab.storage.lastDisplayedTriggerTime",
                zb: "ab.storage.triggerFireInstancesById",
                jb: "ab.storage.signature",
              };
            function Pe(e) {
              (this.$ = e), (this.df = xe.Ya === de.hd ? 3 : 10);
            }
            function Ue(e, t) {
              (this.$ = e), (e = 0);
              for (
                var a = document.location.hostname, n = a.split(".");
                e < n.length - 1 &&
                -1 === document.cookie.indexOf("ab._gd=ab._gd");

              )
                e++,
                  (a = "." + n.slice(-1 - e).join(".")),
                  (document.cookie = "ab._gd=ab._gd;domain=" + a + ";");
              (document.cookie =
                "ab._gd=;expires=" +
                new Date(0).toGMTString() +
                ";domain=" +
                a +
                ";"),
                (this.Me = a),
                (this.Ee = 525949),
                (this.Qe = !!t);
            }
            function Re(e) {
              var t = new Date();
              return t.setTime(t.getTime() + 6e4 * e.Ee), t.getFullYear();
            }
            function Le(e, t) {
              (t = t + "=;expires=" + new Date(0).toGMTString()),
                (document.cookie = t),
                (document.cookie = t + ";path=/"),
                (document.cookie = t + ";path=" + document.location.pathname),
                (e = t + ";domain=" + e.Me),
                (document.cookie = e),
                (document.cookie = e + ";path=/"),
                (document.cookie = e + ";path=" + document.location.pathname);
            }
            function Be() {
              (this.ud = {}), (this.Ke = 5242880), (this.df = 3);
            }
            function Fe(e, t, a) {
              (this.ma = []),
                t && this.ma.push(new Ue(e)),
                a && this.ma.push(new Pe(e)),
                this.ma.push(new Be());
            }
            function Ge() {
              this.Fb = {};
            }
            function je(e, t) {
              if ("function" !== typeof t) return null;
              var a = v.Ia();
              return (e.Fb[a] = t), a;
            }
            function He(e, t) {
              var a,
                n = [];
              for (a in e.Fb) n.push(e.Fb[a](t));
            }
            function Ke() {
              if (null == Je) {
                Je = !1;
                try {
                  var e = Object.defineProperty({}, "passive", {
                    get: function () {
                      Je = !0;
                    },
                  });
                  window.addEventListener("testPassive", null, e),
                    window.removeEventListener("testPassive", null, e);
                } catch (t) {}
              }
              return Je;
            }
            function We(e, t, a) {
              e.addEventListener(t, a, !!Ke() && { passive: !0 });
            }
            function Xe(e, t, a, n) {
              return (
                null != e &&
                ((t = t || !1),
                (a = a || !1),
                null != (e = e.getBoundingClientRect()) &&
                  ((0 <= e.top &&
                    e.top <=
                      (window.innerHeight ||
                        document.documentElement.clientHeight)) ||
                    !t) &&
                  (0 <= e.left || !n) &&
                  ((0 <= e.bottom &&
                    e.bottom <=
                      (window.innerHeight ||
                        document.documentElement.clientHeight)) ||
                    !a) &&
                  (e.right <=
                    (window.innerWidth ||
                      document.documentElement.clientWidth) ||
                    !n))
              );
            }
            function qe(e) {
              if (e.onclick) {
                var t = document.createEvent("MouseEvents");
                t.initEvent("click", !0, !0), e.onclick.apply(e, [t]);
              }
            }
            function Ve(e, t, a) {
              var n = null,
                i = null;
              We(e, "touchstart", function (e) {
                (n = e.touches[0].clientX), (i = e.touches[0].clientY);
              }),
                We(e, "touchmove", function (o) {
                  if (null != n && null != i) {
                    var r = n - o.touches[0].clientX,
                      s = i - o.touches[0].clientY;
                    Math.abs(r) > Math.abs(s) && 25 <= Math.abs(r)
                      ? (((0 < r && t === Qe) || (0 > r && t === et)) && a(o),
                        (i = n = null))
                      : 25 <= Math.abs(s) &&
                        (((0 < s &&
                          t === Ze &&
                          e.scrollTop === e.scrollHeight - e.offsetHeight) ||
                          (0 > s && t === $e && 0 === e.scrollTop)) &&
                          a(o),
                        (i = n = null));
                  }
                });
            }
            function Ye(e, t, a) {
              var n = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
              );
              return (
                n.setAttribute("viewBox", e),
                n.setAttribute("xmlns", "http://www.w3.org/2000/svg"),
                (e = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "path"
                )).setAttribute("d", t),
                null != a && e.setAttribute("fill", a),
                n.appendChild(e),
                n
              );
            }
            (Pe.prototype.Xa = function (e) {
              return e + "." + this.$;
            }),
              (Pe.prototype.store = function (e, t) {
                t = { v: t };
                try {
                  return (
                    localStorage.setItem(this.Xa(e), JSON.stringify(t)), !0
                  );
                } catch (a) {
                  return D.info("Storage failure: " + a.message), !1;
                }
              }),
              (Pe.prototype.Z = function (e) {
                try {
                  var t = JSON.parse(localStorage.getItem(this.Xa(e)));
                  return null == t ? null : t.v;
                } catch (a) {
                  return (
                    D.info("Storage retrieval failure: " + a.message), null
                  );
                }
              }),
              (Pe.prototype.remove = function (e) {
                try {
                  localStorage.removeItem(this.Xa(e));
                } catch (t) {
                  return D.info("Storage removal failure: " + t.message), !1;
                }
              }),
              (Ue.prototype.Xa = function (e) {
                return null != this.$ ? e + "." + this.$ : e;
              }),
              (Ue.prototype.store = function (e, t) {
                for (
                  var a = L(Ie), n = document.cookie.split(";"), i = 0;
                  i < n.length;
                  i++
                ) {
                  for (var o = n[i]; " " === o.charAt(0); ) o = o.substring(1);
                  for (var r = !1, s = 0; s < a.length; s++)
                    if (0 === o.indexOf(a[s])) {
                      r = !0;
                      break;
                    }
                  r &&
                    -1 === (o = o.split("=")[0]).indexOf("." + this.$) &&
                    Le(this, o);
                }
                return (
                  (a = new Date()).setTime(a.getTime() + 6e4 * this.Ee),
                  (a = "expires=" + a.toUTCString()),
                  (n = "domain=" + this.Me),
                  (t = this.Qe ? t : encodeURIComponent(JSON.stringify(t))),
                  4093 <=
                  (e = this.Xa(e) + "=" + t + ";" + a + ";" + n + ";path=/")
                    .length
                    ? (D.info(
                        "Storage failure: string is " +
                          e.length +
                          " chars which is too large to store as a cookie."
                      ),
                      !1)
                    : ((document.cookie = e), !0)
                );
              }),
              (Ue.prototype.Z = function (e) {
                for (
                  var t = [],
                    a = this.Xa(e) + "=",
                    n = document.cookie.split(";"),
                    i = 0;
                  i < n.length;
                  i++
                ) {
                  for (var o = n[i]; " " === o.charAt(0); ) o = o.substring(1);
                  if (0 === o.indexOf(a))
                    try {
                      var r = void 0;
                      (r = this.Qe
                        ? o.substring(a.length, o.length)
                        : JSON.parse(
                            decodeURIComponent(o.substring(a.length, o.length))
                          )),
                        t.push(r);
                    } catch (s) {
                      return (
                        D.info("Storage retrieval failure: " + s.message),
                        this.remove(e),
                        null
                      );
                    }
                }
                return 0 < t.length ? t[t.length - 1] : null;
              }),
              (Ue.prototype.remove = function (e) {
                Le(this, this.Xa(e));
              }),
              (Be.prototype.store = function (e, t) {
                var a = { value: t },
                  n = [];
                t = [t];
                for (var i = 0; t.length; ) {
                  var o = t.pop();
                  if ("boolean" === typeof o) i += 4;
                  else if ("string" === typeof o) i += 2 * o.length;
                  else if ("number" === typeof o) i += 8;
                  else if ("object" === typeof o && -1 === n.indexOf(o))
                    for (var r in (n.push(o), o)) t.push(o[r]);
                }
                return (n = i) > this.Ke
                  ? (D.info(
                      "Storage failure: object is \u2248" +
                        n +
                        " bytes which is greater than the max of " +
                        this.Ke
                    ),
                    !1)
                  : ((this.ud[e] = a), !0);
              }),
              (Be.prototype.Z = function (e) {
                return null == (e = this.ud[e]) ? null : e.value;
              }),
              (Be.prototype.remove = function (e) {
                this.ud[e] = null;
              }),
              (Fe.prototype.store = function (e, t) {
                for (var a = !0, n = 0; n < this.ma.length; n++)
                  a = this.ma[n].store(e, t) && a;
                return a;
              }),
              (Fe.prototype.Z = function (e) {
                for (var t = 0; t < this.ma.length; t++) {
                  var a = this.ma[t].Z(e);
                  if (null != a) return a;
                }
                return null;
              }),
              (Fe.prototype.remove = function (e) {
                for (var t = 0; t < this.ma.length; t++) this.ma[t].remove(e);
              }),
              (Ge.prototype.N = function (e) {
                delete this.Fb[e];
              }),
              (Ge.prototype.K = function () {
                this.Fb = {};
              });
            var Je = null,
              Ze = "up",
              $e = "down",
              Qe = "left",
              et = "right";
            function tt(e, t, a) {
              var n = document.createElement("button");
              return (
                n.setAttribute("aria-label", e),
                n.setAttribute("tabindex", "0"),
                n.setAttribute("role", "button"),
                We(n, "touchstart", function () {}),
                (n.className = "ab-close-button"),
                (e = Ye(
                  "0 0 15 15",
                  "M15 1.5L13.5 0l-6 6-6-6L0 1.5l6 6-6 6L1.5 15l6-6 6 6 1.5-1.5-6-6 6-6z",
                  t
                )),
                n.appendChild(e),
                n.addEventListener("keydown", function (e) {
                  (32 !== e.keyCode && 13 !== e.keyCode) ||
                    (a(), e.stopPropagation());
                }),
                (n.onclick = function (e) {
                  a(), e.stopPropagation();
                }),
                n
              );
            }
            var at = {
              nh: function () {
                return 600 >= screen.width;
              },
              hh: function () {
                if ("orientation" in window)
                  return 90 === Math.abs(window.orientation) ||
                    270 === window.orientation
                    ? at.Sa.Zc
                    : at.Sa.jc;
                if ("screen" in window) {
                  var e = window.screen.orientation || screen.ci || screen.ei;
                  if (
                    (null != e && "object" === typeof e && (e = e.type),
                    "landscape-primary" === e || "landscape-secondary" === e)
                  )
                    return at.Sa.Zc;
                }
                return at.Sa.jc;
              },
              oh: function (e, t, a) {
                a || (null != t && t.metaKey)
                  ? window.open(e)
                  : (window.location = e);
              },
              Sa: { jc: 0, Zc: 1 },
            };
            function nt(e, t, a, n, i, o, r, s, l, c, u, b, p, d, h, f) {
              (this.id = e),
                (this.viewed = t || !1),
                (this.title = a || ""),
                (this.imageUrl = n),
                (this.description = i || ""),
                (this.created = o || null),
                (this.updated = r || null),
                (this.categories = s || []),
                (this.expiresAt = l || null),
                (this.url = c),
                (this.linkText = u),
                (b = parseFloat(b)),
                (this.aspectRatio = isNaN(b) ? null : b),
                (this.extras = p),
                (this.pinned = d || !1),
                (this.dismissible = h || !1),
                (this.dismissed = !1),
                (this.clicked = f || !1),
                (this.test = !1),
                (this.pd = this.X = null);
            }
            function it(e) {
              return null == e.X && (e.X = new Ge()), e.X;
            }
            function ot(e) {
              return null == e.pd && (e.pd = new Ge()), e.pd;
            }
            function rt(e, t) {
              if (null == t || t[pt.wa] !== e.id) return !0;
              if (t[pt.pe]) return !1;
              if (
                null != t[pt.ea] &&
                null != e.updated &&
                t[pt.ea] < F(e.updated.valueOf())
              )
                return !0;
              if (
                (t[pt.za] && !e.viewed && (e.viewed = !0),
                t[pt.ta] && !e.clicked && (e.clicked = t[pt.ta]),
                null != t[pt.Ua] && (e.title = t[pt.Ua]),
                null != t[pt.xa] && (e.imageUrl = t[pt.xa]),
                null != t[pt.Ra] && (e.description = t[pt.Ra]),
                null != t[pt.ea])
              ) {
                var a = G(t[pt.ea]);
                null != a && (e.updated = a);
              }
              return (
                null != t[pt.ca] &&
                  (e.expiresAt = t[pt.ca] === ut ? null : G(t[pt.ca])),
                null != t[pt.URL] && (e.url = t[pt.URL]),
                null != t[pt.ya] && (e.linkText = t[pt.ya]),
                null != t[pt.sa] &&
                  ((a = parseFloat(t[pt.sa])),
                  (e.aspectRatio = isNaN(a) ? null : a)),
                null != t[pt.ka] && (e.extras = t[pt.ka]),
                null != t[pt.la] && (e.pinned = t[pt.la]),
                null != t[pt.va] && (e.dismissible = t[pt.va]),
                null != t[pt.V] && (e.test = t[pt.V]),
                !0
              );
            }
            function st(e) {
              if (e[pt.pe]) return null;
              var t = e[pt.wa],
                a = e[pt.TYPE],
                n = e[pt.za],
                i = e[pt.Ua],
                o = e[pt.xa],
                r = e[pt.Ra],
                s = G(e[pt.ea]),
                l = e[pt.ca] === ut ? null : G(e[pt.ca]),
                c = e[pt.URL],
                u = e[pt.ya],
                b = e[pt.sa],
                p = e[pt.ka],
                d = e[pt.la],
                h = e[pt.va],
                f = e[pt.ta];
              if (((e = e[pt.V] || !1), a === bt.xe || a === bt.ic))
                t = new mt(
                  t,
                  n,
                  i,
                  o,
                  r,
                  null,
                  s,
                  null,
                  l,
                  c,
                  u,
                  b,
                  p,
                  d,
                  h,
                  f
                );
              else if (a === bt.Yb)
                t = new gt(
                  t,
                  n,
                  i,
                  o,
                  r,
                  null,
                  s,
                  null,
                  l,
                  c,
                  u,
                  b,
                  p,
                  d,
                  h,
                  f
                );
              else if (a === bt.Xb)
                t = new ft(t, n, o, null, s, null, l, c, u, b, p, d, h, f);
              else {
                if (a !== bt.Sc)
                  return D.error("Ignoring card with unknown type " + a), null;
                t = new vt(t, n, s, l, p, d);
              }
              return (t.test = e), t;
            }
            function lt(e) {
              var t = e[dt.wa],
                a = e[dt.TYPE],
                n = e[dt.za],
                i = e[dt.Ua],
                o = e[dt.xa],
                r = e[dt.Ra],
                s = H(e[dt.bc]),
                l = H(e[dt.ea]),
                c = e[dt.Zb],
                u = H(e[dt.ca]),
                b = e[dt.URL],
                p = e[dt.ya],
                d = e[dt.sa],
                h = e[dt.ka],
                f = e[dt.la],
                g = e[dt.va],
                m = e[dt.ta];
              if (((e = e[dt.V] || !1), a === bt.ic))
                t = new mt(t, n, i, o, r, s, l, c, u, b, p, d, h, f, g, m);
              else if (a === bt.Yb)
                t = new gt(t, n, i, o, r, s, l, c, u, b, p, d, h, f, g, m);
              else if (a === bt.Xb)
                t = new ft(t, n, o, s, l, c, u, b, p, d, h, f, g, m);
              else {
                if (a !== bt.Sc) return;
                t = new vt(t, n, l, u, h, f);
              }
              return (t.test = e), t;
            }
            function ct(e) {
              null != e &&
                null != (e = e.querySelectorAll(".ab-unread-indicator")[0]) &&
                (e.className += " read");
            }
            (ie.WindowUtils = at),
              (ie.WindowUtils.openUri = at.oh),
              ((t = nt.prototype).Vb = function (e) {
                return je(it(this), e);
              }),
              (t.Wd = function (e) {
                return je(ot(this), e);
              }),
              (t.N = function (e) {
                it(this).N(e), ot(this).N(e);
              }),
              (t.K = function () {
                it(this).K(), ot(this).K();
              }),
              (t.Od = function () {
                this.viewed = !0;
              }),
              (t.fb = function () {
                (this.clicked = this.viewed = !0), He(it(this));
              }),
              (t.Nd = function () {
                return (
                  !(!this.dismissible || this.dismissed) &&
                  ((this.dismissed = !0), He(ot(this)), !0)
                );
              }),
              (t.aa = function (e, t, a) {
                function n(t) {
                  return ct(o), r && (e(i), at.openUri(i.url, t, a)), !1;
                }
                var i = this,
                  o = document.createElement("div");
                (o.className = "ab-card ab-effect-card " + this.Dc),
                  o.setAttribute("data-ab-card-id", this.id),
                  o.setAttribute("role", "article"),
                  o.setAttribute("tabindex", "0");
                var r = this.url && "" !== this.url;
                if (this.pinned) {
                  var s = document.createElement("div");
                  s.className = "ab-pinned-indicator";
                  var l = document.createElement("i");
                  (l.className = "fa fa-star"),
                    s.appendChild(l),
                    o.appendChild(s);
                }
                if (
                  (this.imageUrl &&
                    "" !== this.imageUrl &&
                    (((s = document.createElement("div")).className =
                      "ab-image-area"),
                    (l = document.createElement("img")).setAttribute(
                      "src",
                      this.imageUrl
                    ),
                    this.xc(l),
                    s.appendChild(l),
                    (o.className += " with-image"),
                    r && !this.Gc
                      ? ((l = document.createElement("a")).setAttribute(
                          "href",
                          this.url
                        ),
                        (l.onclick = n),
                        l.appendChild(s),
                        o.appendChild(l))
                      : o.appendChild(s)),
                  ((s = document.createElement("div")).className =
                    "ab-card-body"),
                  this.dismissible)
                ) {
                  this.Je = t;
                  var c = tt("Dismiss Card", void 0, this.bf.bind(this));
                  o.appendChild(c),
                    Ve(s, Qe, function (e) {
                      (o.className += " ab-swiped-left"), c.onclick(e);
                    }),
                    Ve(s, et, function (e) {
                      (o.className += " ab-swiped-right"), c.onclick(e);
                    });
                }
                if ((t = this.title && "" !== this.title)) {
                  if (
                    (((l = document.createElement("h1")).className =
                      "ab-title"),
                    (l.id = v.Ia()),
                    o.setAttribute("aria-labelledby", l.id),
                    r)
                  ) {
                    var u = document.createElement("a");
                    u.setAttribute("href", this.url),
                      (u.onclick = n),
                      u.appendChild(document.createTextNode(this.title)),
                      l.appendChild(u);
                  } else l.appendChild(document.createTextNode(this.title));
                  s.appendChild(l);
                }
                return (
                  ((l = document.createElement("div")).className = t
                    ? "ab-description"
                    : "ab-description ab-no-title"),
                  (l.id = v.Ia()),
                  o.setAttribute("aria-describedby", l.id),
                  l.appendChild(document.createTextNode(this.description)),
                  r &&
                    (((t = document.createElement("div")).className =
                      "ab-url-area"),
                    (u = document.createElement("a")).setAttribute(
                      "href",
                      this.url
                    ),
                    u.appendChild(document.createTextNode(this.linkText)),
                    (u.onclick = n),
                    t.appendChild(u),
                    l.appendChild(t)),
                  s.appendChild(l),
                  o.appendChild(s),
                  ((s = document.createElement("div")).className =
                    "ab-unread-indicator"),
                  this.viewed && (s.className += " read"),
                  o.appendChild(s),
                  (this.Gg = o)
                );
              }),
              (t.xc = function (e) {
                var t = "";
                this.title || this.description || (t = "Feed Image"),
                  e.setAttribute("alt", t);
              }),
              (t.bf = function () {
                if (this.dismissible && !this.dismissed) {
                  this.Je && this.Je(this);
                  var e = this.Gg;
                  e &&
                    ((e.style.height = e.offsetHeight + "px"),
                    (e.className += " ab-hide"),
                    setTimeout(function () {
                      e &&
                        e.parentNode &&
                        ((e.style.height = "0"),
                        (e.style.margin = "0"),
                        setTimeout(function () {
                          e && e.parentNode && e.parentNode.removeChild(e);
                        }, ht));
                    }, Da));
                }
              });
            var ut = -1,
              bt = {
                Yb: "captioned_image",
                xe: "text_announcement",
                ic: "short_news",
                Xb: "banner_image",
                Sc: "control",
              },
              pt = {
                wa: "id",
                za: "v",
                va: "db",
                pe: "r",
                ea: "ca",
                la: "p",
                ca: "ea",
                ka: "e",
                TYPE: "tp",
                xa: "i",
                Ua: "tt",
                Ra: "ds",
                URL: "u",
                ya: "dm",
                sa: "ar",
                ta: "cl",
                V: "t",
              },
              dt = {
                wa: "id",
                za: "v",
                va: "db",
                bc: "cr",
                ea: "ca",
                la: "p",
                Zb: "t",
                ca: "ea",
                ka: "e",
                TYPE: "tp",
                xa: "i",
                Ua: "tt",
                Ra: "ds",
                URL: "u",
                ya: "dm",
                sa: "ar",
                ta: "cl",
                V: "s",
              },
              ht = 400;
            function ft(e, t, a, n, i, o, r, s, l, c, u, b, p, d) {
              nt.call(
                this,
                e,
                t,
                null,
                a,
                null,
                n,
                i,
                o,
                r,
                s,
                l,
                c,
                u,
                b,
                p,
                d
              ),
                (this.Dc = "ab-banner"),
                (this.Gc = !1);
            }
            function gt(e, t, a, n, i, o, r, s, l, c, u, b, p, d, h, f) {
              nt.call(this, e, t, a, n, i, o, r, s, l, c, u, b, p, d, h, f),
                (this.Dc = "ab-captioned-image"),
                (this.Gc = !0);
            }
            function mt(e, t, a, n, i, o, r, s, l, c, u, b, p, d, h, f) {
              nt.call(this, e, t, a, n, i, o, r, s, l, c, u, b, p, d, h, f),
                (this.Dc = "ab-classic-card"),
                (this.Gc = !0);
            }
            function vt(e, t, a, n, i, o) {
              nt.call(
                this,
                e,
                t,
                null,
                null,
                null,
                null,
                a,
                null,
                n,
                null,
                null,
                null,
                i,
                o,
                null
              ),
                (this.Dc = "ab-control-card"),
                (this.Gc = !1);
            }
            function wt(e) {
              return (
                (e = parseInt(e)), !isNaN(e) && 0 === (4278190080 & e) >>> 24
              );
            }
            function xt(e) {
              if (((e = parseInt(e)), isNaN(e))) return "";
              var t = parseFloat(t);
              isNaN(t) && (t = 1);
              var a = 255 & (e >>>= 0),
                n = (65280 & e) >>> 8,
                i = (16711680 & e) >>> 16;
              return xe.Ya !== de.dc || 8 < xe.version
                ? "rgba(" +
                    [i, n, a, (((4278190080 & e) >>> 24) / 255) * t].join() +
                    ")"
                : "rgb(" + [i, n, a].join() + ")";
            }
            function yt(
              e,
              t,
              a,
              n,
              i,
              o,
              r,
              s,
              l,
              c,
              u,
              b,
              p,
              d,
              h,
              f,
              g,
              m,
              v,
              w,
              x,
              y,
              k,
              E,
              S,
              A,
              C,
              N,
              T,
              _,
              D
            ) {
              (this.message = e),
                (this.messageAlignment = t || qt),
                (this.duration = b || 5e3),
                (this.slideFrom = a || Ot),
                (this.extras = n || {}),
                (this.campaignId = i),
                (this.cardId = o),
                (this.triggerId = r),
                (this.clickAction = s || Pt),
                (this.uri = l),
                (this.openTarget = c || Bt),
                (this.dismissType = u || Rt),
                (this.icon = p),
                (this.imageUrl = d),
                (this.imageStyle = h || jt),
                (this.iconColor = f || _t.nd),
                (this.iconBackgroundColor = g || _t.$d),
                (this.backgroundColor = m || _t.nd),
                (this.textColor = v || _t.ce),
                (this.closeButtonColor = w || _t.Sf),
                (this.animateIn = x),
                null == this.animateIn && (this.animateIn = !0),
                (this.animateOut = y),
                null == this.animateOut && (this.animateOut = !0),
                (this.header = k),
                (this.headerAlignment = E || qt),
                (this.headerTextColor = S || _t.ce),
                (this.frameColor = A || _t.vg),
                (this.buttons = C || []),
                (this.cropType = N || Jt),
                (this.orientation = T),
                (this.htmlId = _),
                (this.css = D),
                (this.Fe = this.Wa = this.Ge = !1),
                (this.X = new Ge()),
                (this.nc = new Ge());
            }
            function kt(e) {
              return null != e.htmlId && 4 < e.htmlId.length;
            }
            function Et(e) {
              return kt(e) && null != e.css && 0 < e.css.length;
            }
            function St(e) {
              if (kt(e) && Et(e)) return e.htmlId + "-css";
            }
            function At(e) {
              if (e.is_control) return new ua(e.trigger_id);
              var t = e.type;
              null != t && (t = t.toUpperCase());
              var a = e.message,
                n = e.text_align_message,
                i = e.slide_from,
                o = e.extras,
                r = e.campaign_id,
                s = e.card_id,
                l = e.trigger_id,
                c = e.click_action,
                u = e.uri,
                b = e.open_target,
                p = e.message_close,
                d = e.duration,
                h = e.icon,
                f = e.image_url,
                g = e.image_style,
                m = e.icon_color,
                v = e.icon_bg_color,
                w = e.bg_color,
                x = e.text_color,
                y = e.close_btn_color,
                k = e.header,
                E = e.text_align_header,
                S = e.header_text_color,
                A = e.frame_color,
                C = [],
                N = e.btns;
              null == N && (N = []);
              for (var T = 0; T < N.length; T++) {
                var _ = N[T];
                C.push(
                  new la(
                    _.text,
                    _.bg_color,
                    _.text_color,
                    _.border_color,
                    _.click_action,
                    _.uri,
                    _.id
                  )
                );
              }
              (N = e.crop_type), (T = e.orientation), (_ = e.animate_in);
              var O = e.animate_out,
                M = e.html_id,
                I = e.css;
              if (
                ((null != M && "" !== M && null != I && "" !== I) ||
                  (I = M = void 0),
                t === Qt || t === ea)
              )
                a = new ya(
                  a,
                  n,
                  o,
                  r,
                  s,
                  l,
                  c,
                  u,
                  b,
                  p,
                  d,
                  h,
                  f,
                  g,
                  m,
                  v,
                  w,
                  x,
                  y,
                  _,
                  O,
                  k,
                  E,
                  S,
                  A,
                  C,
                  N,
                  M,
                  I
                );
              else if (t === ta)
                a = new ha(
                  a,
                  n,
                  o,
                  r,
                  s,
                  l,
                  c,
                  u,
                  b,
                  p,
                  d,
                  h,
                  f,
                  g,
                  m,
                  v,
                  w,
                  x,
                  y,
                  _,
                  O,
                  k,
                  E,
                  S,
                  A,
                  C,
                  N,
                  T,
                  M,
                  I
                );
              else if (t === $t)
                a = new ka(
                  a,
                  n,
                  i,
                  o,
                  r,
                  s,
                  l,
                  c,
                  u,
                  b,
                  p,
                  d,
                  h,
                  f,
                  m,
                  v,
                  w,
                  x,
                  y,
                  _,
                  O,
                  M,
                  I
                );
              else {
                if (t !== aa && t !== na)
                  return void D.error(
                    "Ignoring message with unknown type " + t
                  );
                (a = new xa(
                  a,
                  o,
                  r,
                  s,
                  l,
                  p,
                  d,
                  _,
                  O,
                  A,
                  M,
                  I,
                  e.message_fields
                )).Th = e.trusted || !1;
              }
              return (a.nf = t), a;
            }
            function Ct(e, t) {
              if (t && t.parentNode) {
                var a = t.closest(".ab-iam-root");
                null == a && (a = t),
                  e.Ja() &&
                    null != a.parentNode &&
                    ((t = a.parentNode.classList) &&
                      t.contains(sa) &&
                      t.remove(sa),
                    document.body.removeEventListener("touchmove", Tt)),
                  (a.className = a.className.replace(oa, ra));
              }
              return e.animateOut;
            }
            function Nt(e, t, a) {
              if (null != t) {
                e.sc = null;
                var n =
                    -1 === t.className.indexOf("ab-in-app-message")
                      ? t.getElementsByClassName("ab-in-app-message")[0]
                      : t,
                  i = !1;
                n && (i = Ct(e, n));
                var o = document.body;
                if (null != o) var r = o.scrollTop;
                (n = function () {
                  if (t && t.parentNode) {
                    var n = t.closest(".ab-iam-root");
                    null == n && (n = t),
                      n.parentNode && n.parentNode.removeChild(n);
                  }
                  null != St(e) &&
                    (n = document.getElementById(St(e))) &&
                    n.parentNode &&
                    n.parentNode.removeChild(n),
                    null != o && "Safari" === xe.Ya && (o.scrollTop = r),
                    a ? a() : e.Nd();
                }),
                  i ? setTimeout(n, ia) : n(),
                  e.tc && e.tc.focus();
              }
            }
            function Tt(e) {
              (e.targetTouches && 1 < e.targetTouches.length) ||
                (e.target.classList &&
                  e.target.classList.contains("ab-message-text") &&
                  e.target.scrollHeight > e.target.clientHeight) ||
                (document.querySelector("." + sa) && e.preventDefault());
            }
            (ie.Card = nt),
              (ie.Card.fromContentCardsJson = st),
              (ie.Card.prototype.dismissCard = nt.prototype.bf),
              (ie.Card.prototype.subscribeToClickedEvent = nt.prototype.Vb),
              (ie.Card.prototype.subscribeToDismissedEvent = nt.prototype.Wd),
              (ie.Card.prototype.removeSubscription = nt.prototype.N),
              (ie.Card.prototype.removeAllSubscriptions = nt.prototype.K),
              g(ft, nt),
              (ft.prototype.A = function () {
                var e = {};
                return (
                  (e[dt.TYPE] = bt.Xb),
                  (e[dt.wa] = this.id),
                  (e[dt.za] = this.viewed),
                  (e[dt.xa] = this.imageUrl),
                  (e[dt.ea] = this.updated),
                  (e[dt.bc] = this.created),
                  (e[dt.Zb] = this.categories),
                  (e[dt.ca] = this.expiresAt),
                  (e[dt.URL] = this.url),
                  (e[dt.ya] = this.linkText),
                  (e[dt.sa] = this.aspectRatio),
                  (e[dt.ka] = this.extras),
                  (e[dt.la] = this.pinned),
                  (e[dt.va] = this.dismissible),
                  (e[dt.ta] = this.clicked),
                  (e[dt.V] = this.test),
                  e
                );
              }),
              (ie.Banner = ft),
              g(gt, nt),
              (gt.prototype.A = function () {
                var e = {};
                return (
                  (e[dt.TYPE] = bt.Yb),
                  (e[dt.wa] = this.id),
                  (e[dt.za] = this.viewed),
                  (e[dt.Ua] = this.title),
                  (e[dt.xa] = this.imageUrl),
                  (e[dt.Ra] = this.description),
                  (e[dt.ea] = this.updated),
                  (e[dt.bc] = this.created),
                  (e[dt.Zb] = this.categories),
                  (e[dt.ca] = this.expiresAt),
                  (e[dt.URL] = this.url),
                  (e[dt.ya] = this.linkText),
                  (e[dt.sa] = this.aspectRatio),
                  (e[dt.ka] = this.extras),
                  (e[dt.la] = this.pinned),
                  (e[dt.va] = this.dismissible),
                  (e[dt.ta] = this.clicked),
                  (e[dt.V] = this.test),
                  e
                );
              }),
              (ie.CaptionedImage = gt),
              g(mt, nt),
              (mt.prototype.A = function () {
                var e = {};
                return (
                  (e[dt.TYPE] = bt.ic),
                  (e[dt.wa] = this.id),
                  (e[dt.za] = this.viewed),
                  (e[dt.Ua] = this.title),
                  (e[dt.xa] = this.imageUrl),
                  (e[dt.Ra] = this.description),
                  (e[dt.ea] = this.updated),
                  (e[dt.bc] = this.created),
                  (e[dt.Zb] = this.categories),
                  (e[dt.ca] = this.expiresAt),
                  (e[dt.URL] = this.url),
                  (e[dt.ya] = this.linkText),
                  (e[dt.sa] = this.aspectRatio),
                  (e[dt.ka] = this.extras),
                  (e[dt.la] = this.pinned),
                  (e[dt.va] = this.dismissible),
                  (e[dt.ta] = this.clicked),
                  (e[dt.V] = this.test),
                  e
                );
              }),
              (ie.ClassicCard = mt),
              g(vt, nt),
              (vt.prototype.A = function () {
                var e = {};
                return (
                  (e[dt.TYPE] = bt.Sc),
                  (e[dt.wa] = this.id),
                  (e[dt.za] = this.viewed),
                  (e[dt.ea] = this.updated),
                  (e[dt.ca] = this.expiresAt),
                  (e[dt.ka] = this.extras),
                  (e[dt.la] = this.pinned),
                  (e[dt.V] = this.test),
                  e
                );
              }),
              (ie.ControlCard = vt),
              ((t = yt.prototype).Ja = function () {
                return !0;
              }),
              (t.xf = function () {
                return this.Ja();
              }),
              (t.Vb = function (e) {
                return je(this.X, e);
              }),
              (t.Wd = function (e) {
                return je(this.nc, e);
              }),
              (t.N = function (e) {
                this.X.N(e), this.nc.N(e);
              }),
              (t.K = function () {
                this.X.K(), this.nc.K();
              }),
              (t.Od = function () {
                return !this.Ge && (this.Ge = !0);
              }),
              (t.fb = function () {
                return !this.Wa && ((this.Wa = !0), He(this.X), !0);
              }),
              (t.Nd = function () {
                return !this.Fe && ((this.Fe = !0), He(this.nc), !0);
              }),
              (t.Ye = function () {
                Nt(this, this.sc);
              }),
              (t.aa = function (e, t, a, n, i) {
                function o() {
                  -1 !== s.className.indexOf("ab-start-hidden") &&
                    ((s.className = s.className.replace("ab-start-hidden", "")),
                    a(s));
                }
                var r = this,
                  s = document.createElement("div");
                (s.className =
                  "ab-in-app-message ab-start-hidden ab-background"),
                  i && (s.style.zIndex = i + 1),
                  this.Ja() &&
                    ((s.className += " ab-modal-interactions"),
                    s.setAttribute("tabindex", "-1")),
                  Et(this) ||
                    ((s.style.color = xt(this.textColor)),
                    (s.style.backgroundColor = xt(this.backgroundColor)),
                    wt(this.backgroundColor) &&
                      (s.className += " ab-no-shadow")),
                  this.imageStyle === Ht && (s.className += " graphic"),
                  this.orientation === Wt && (s.className += " landscape"),
                  0 === this.buttons.length &&
                    (this.clickAction !== Pt &&
                      (s.className += " ab-clickable"),
                    (s.onclick = function (a) {
                      return (
                        Nt(r, s, function () {
                          e.Jc(r),
                            r.clickAction === zt
                              ? at.openUri(r.uri, a, n || r.openTarget === Ft)
                              : r.clickAction === It && t();
                        }),
                        a.stopPropagation(),
                        !1
                      );
                    }));
                var l = tt(
                  "Close Message",
                  Et(this) ? void 0 : xt(this.closeButtonColor),
                  function () {
                    Nt(r, s);
                  }
                );
                s.appendChild(l),
                  i && (l.style.zIndex = i + 2),
                  ((i = document.createElement("div")).className =
                    "ab-message-text"),
                  (i.className +=
                    " " +
                    (this.messageAlignment || this.Bd).toLowerCase() +
                    "-aligned"),
                  (l = !1);
                var c = document.createElement("div");
                if (((c.className = "ab-image-area"), this.imageUrl)) {
                  if (this.cropType === Yt) {
                    var u = document.createElement("span");
                    (u.className = "ab-center-cropped-img"),
                      (u.style.backgroundImage = "url(" + this.imageUrl + ")"),
                      u.setAttribute("role", "img"),
                      u.setAttribute("aria-label", "Modal Image"),
                      this.xc(u),
                      c.appendChild(u);
                  } else
                    (u = document.createElement("img")).setAttribute(
                      "src",
                      this.imageUrl
                    ),
                      this.xc(u),
                      (l = !0),
                      (u.onload = o),
                      setTimeout(o, 1e3),
                      c.appendChild(u);
                  s.appendChild(c), (i.className += " ab-with-image");
                } else if (this.icon) {
                  (c.className += " ab-icon-area"),
                    ((u = document.createElement("span")).className =
                      "ab-icon"),
                    Et(this) ||
                      ((u.style.backgroundColor = xt(this.iconBackgroundColor)),
                      (u.style.color = xt(this.iconColor)));
                  var b = document.createElement("i");
                  (b.className = "fa"),
                    b.appendChild(document.createTextNode(this.icon)),
                    b.setAttribute("aria-hidden", !0),
                    u.appendChild(b),
                    c.appendChild(u),
                    s.appendChild(c),
                    (i.className += " ab-with-icon");
                }
                return (
                  We(i, "touchstart", function () {}),
                  this.header &&
                    0 < this.header.length &&
                    (((c = document.createElement("h1")).className =
                      "ab-message-header"),
                    (this.qd = v.Ia()),
                    (c.id = this.qd),
                    (c.className +=
                      " " +
                      (this.headerAlignment || qt).toLowerCase() +
                      "-aligned"),
                    Et(this) || (c.style.color = xt(this.headerTextColor)),
                    c.appendChild(document.createTextNode(this.header)),
                    i.appendChild(c)),
                  i.appendChild(this.Xe()),
                  s.appendChild(i),
                  l || o(),
                  (this.sc = s)
                );
              }),
              (t.Xe = function () {
                return document.createTextNode(this.message);
              }),
              (t.xc = function (e) {
                var t = "";
                this.message ||
                  this.header ||
                  !this.Ja() ||
                  (t = "Modal Image"),
                  e.setAttribute("alt", t);
              }),
              (t.Kc = function (e) {
                this.Ja() &&
                  null != e.parentNode &&
                  this.orientation !== Wt &&
                  (null != e.parentNode.classList &&
                    e.parentNode.classList.add(sa),
                  document.body.addEventListener(
                    "touchmove",
                    Tt,
                    !!Ke() && { passive: !1 }
                  )),
                  (e.className += " " + oa);
              }),
              (t.oa = function () {
                var e = "";
                return (
                  this.animateIn && (e += " ab-animate-in"),
                  this.animateOut && (e += " ab-animate-out"),
                  e
                );
              });
            var _t = {
                ce: 4281545523,
                nd: 4294967295,
                $d: 4278219733,
                Tf: 4293914607,
                Uf: 4283782485,
                vg: 3224580915,
                Sf: 4288387995,
              },
              Dt = {
                ge: "hd",
                Bf: "ias",
                rg: "of",
                Vf: "do",
                Ab: "umt",
                yb: "tf",
                ie: "te",
              },
              Ot = "BOTTOM",
              Mt = { TOP: "TOP", BOTTOM: Ot },
              It = "NEWS_FEED",
              zt = "URI",
              Pt = "NONE",
              Ut = { NEWS_FEED: It, URI: zt, NONE: Pt },
              Rt = "AUTO_DISMISS",
              Lt = { AUTO_DISMISS: Rt, MANUAL: "SWIPE" },
              Bt = "NONE",
              Ft = "BLANK",
              Gt = { NONE: Bt, BLANK: Ft },
              jt = "TOP",
              Ht = "GRAPHIC",
              Kt = { TOP: jt, GRAPHIC: Ht },
              Wt = "LANDSCAPE",
              Xt = { PORTRAIT: "PORTRAIT", LANDSCAPE: Wt },
              qt = "CENTER",
              Vt = { START: "START", CENTER: qt, END: "END" },
              Yt = "CENTER_CROP",
              Jt = "FIT_CENTER",
              Zt = { CENTER_CROP: Yt, FIT_CENTER: Jt },
              $t = "SLIDEUP",
              Qt = "MODAL",
              ea = "MODAL_STYLED",
              ta = "FULL",
              aa = "WEB_HTML",
              na = "HTML",
              ia = 500,
              oa = "ab-show",
              ra = "ab-hide",
              sa = "ab-pause-scrolling";
            function la(e, t, a, n, i, o, r) {
              (this.text = e || ""),
                (this.backgroundColor = t || _t.$d),
                (this.textColor = a || _t.nd),
                (this.borderColor = n || this.backgroundColor),
                (this.clickAction = i || Pt),
                (this.uri = o),
                null == r && (r = ca),
                (this.id = r),
                (this.Wa = !1),
                (this.X = new Ge());
            }
            (ie.InAppMessage = yt),
              (ie.InAppMessage.SlideFrom = Mt),
              (ie.InAppMessage.ClickAction = Ut),
              (ie.InAppMessage.DismissType = Lt),
              (ie.InAppMessage.OpenTarget = Gt),
              (ie.InAppMessage.ImageStyle = Kt),
              (ie.InAppMessage.TextAlignment = Vt),
              (ie.InAppMessage.Orientation = Xt),
              (ie.InAppMessage.CropType = Zt),
              (ie.InAppMessage.fromJson = At),
              (ie.InAppMessage.prototype.subscribeToClickedEvent =
                yt.prototype.Vb),
              (ie.InAppMessage.prototype.subscribeToDismissedEvent =
                yt.prototype.Wd),
              (ie.InAppMessage.prototype.removeSubscription = yt.prototype.N),
              (ie.InAppMessage.prototype.removeAllSubscriptions =
                yt.prototype.K),
              (ie.InAppMessage.prototype.closeMessage = yt.prototype.Ye),
              (la.prototype.Vb = function (e) {
                return je(this.X, e);
              }),
              (la.prototype.N = function (e) {
                this.X.N(e);
              }),
              (la.prototype.K = function () {
                this.X.K();
              }),
              (la.prototype.fb = function () {
                return !this.Wa && ((this.Wa = !0), He(this.X), !0);
              });
            var ca = -1;
            function ua(e) {
              this.triggerId = e;
            }
            function ba(e) {
              for (
                var t = e.querySelectorAll(
                    ".ab-close-button, .ab-message-text, .ab-message-button"
                  ),
                  a = 0;
                a < t.length;
                a++
              )
                t[a].tabIndex = 0;
              if (0 < t.length) {
                var n = t[0],
                  i = t[t.length - 1];
                e.addEventListener("keydown", function (t) {
                  var a = document.activeElement;
                  9 === t.keyCode &&
                    (t.shiftKey || (a !== i && a !== e)
                      ? !t.shiftKey ||
                        (a !== n && a !== e) ||
                        (t.preventDefault(), i.focus())
                      : (t.preventDefault(), n.focus()));
                });
              }
            }
            function pa(e, t) {
              t.setAttribute("role", "dialog"),
                t.setAttribute("aria-modal", !0),
                t.setAttribute("aria-label", "Modal Message"),
                e && t.setAttribute("aria-labelledby", e);
            }
            function da(e, t, a, n, i) {
              if (0 < e.buttons.length) {
                var o = document.createElement("div");
                (o.className = "ab-message-buttons"), n.appendChild(o);
                var r = n.getElementsByClassName("ab-message-text")[0];
                null != r && (r.className += " ab-with-buttons"),
                  (r = function (o) {
                    return function (r) {
                      return (
                        Nt(e, n, function () {
                          t.Ic(o, e),
                            o.clickAction === zt
                              ? at.openUri(o.uri, r, i || e.openTarget === Ft)
                              : o.clickAction === It && a();
                        }),
                        r.stopPropagation(),
                        !1
                      );
                    };
                  });
                for (var s = 0; s < e.buttons.length; s++) {
                  var l = e.buttons[s],
                    c = document.createElement("button");
                  (c.className = "ab-message-button"),
                    c.setAttribute("type", "button"),
                    We(c, "touchstart", function () {});
                  var u = l.text;
                  "" === l.text && (u = "\xa0"),
                    c.appendChild(document.createTextNode(u)),
                    Et(e) ||
                      ((c.style.backgroundColor = xt(l.backgroundColor)),
                      (c.style.color = xt(l.textColor)),
                      (c.style.borderColor = xt(l.borderColor))),
                    (c.onclick = r(l)),
                    o.appendChild(c);
                }
              }
            }
            function ha(
              e,
              t,
              a,
              n,
              i,
              o,
              r,
              s,
              l,
              c,
              u,
              b,
              p,
              d,
              h,
              f,
              g,
              m,
              v,
              w,
              x,
              y,
              k,
              E,
              S,
              A,
              C,
              N,
              T,
              _
            ) {
              (C = C || Yt),
                yt.call(
                  this,
                  e,
                  t,
                  null,
                  a,
                  n,
                  i,
                  o,
                  r,
                  s,
                  l,
                  c || "SWIPE",
                  u,
                  b,
                  p,
                  d,
                  h,
                  f,
                  g,
                  m,
                  v,
                  w,
                  x,
                  y,
                  k,
                  E,
                  S,
                  A,
                  C,
                  N || "PORTRAIT",
                  T,
                  _
                );
            }
            (ie.InAppMessageButton = la),
              (ie.InAppMessageButton.prototype.subscribeToClickedEvent =
                la.prototype.Vb),
              (ie.InAppMessageButton.prototype.removeSubscription =
                la.prototype.N),
              (ie.InAppMessageButton.prototype.removeAllSubscriptions =
                la.prototype.K),
              (ie.ControlMessage = ua),
              g(ha, yt),
              (ha.prototype.aa = function (e, t, a, n, i, o) {
                return (
                  (this.tc = document.activeElement),
                  ((t = yt.prototype.aa.call(this, e, a, n, i, o)).className +=
                    " ab-fullscreen ab-centered"),
                  da(this, e, a, t, i),
                  ba(t),
                  pa(this.qd, t),
                  t
                );
              }),
              (ha.prototype.oa = function () {
                return yt.prototype.oa.call(this) + " ab-effect-fullscreen";
              }),
              u.Object.defineProperties(ha.prototype, {
                Bd: {
                  configurable: !0,
                  enumerable: !0,
                  get: function () {
                    return qt;
                  },
                },
              }),
              (ie.FullScreenMessage = ha);
            var fa,
              ga,
              ma = new (function () {
                this.$e =
                  ".ab-pause-scrolling,body.ab-pause-scrolling,html.ab-pause-scrolling{overflow:hidden;touch-action:none}.ab-centering-div,.ab-iam-root.v3{position:fixed;top:0;right:0;bottom:0;left:0;pointer-events:none;z-index:1050;-webkit-tap-highlight-color:transparent}.ab-centering-div:focus,.ab-iam-root.v3:focus{outline:0}.ab-centering-div.ab-effect-fullscreen,.ab-centering-div.ab-effect-html,.ab-centering-div.ab-effect-modal,.ab-iam-root.v3.ab-effect-fullscreen,.ab-iam-root.v3.ab-effect-html,.ab-iam-root.v3.ab-effect-modal{opacity:0}.ab-centering-div.ab-effect-fullscreen.ab-show,.ab-centering-div.ab-effect-html.ab-show,.ab-centering-div.ab-effect-modal.ab-show,.ab-iam-root.v3.ab-effect-fullscreen.ab-show,.ab-iam-root.v3.ab-effect-html.ab-show,.ab-iam-root.v3.ab-effect-modal.ab-show{opacity:1}.ab-centering-div.ab-effect-fullscreen.ab-show.ab-animate-in,.ab-centering-div.ab-effect-html.ab-show.ab-animate-in,.ab-centering-div.ab-effect-modal.ab-show.ab-animate-in,.ab-iam-root.v3.ab-effect-fullscreen.ab-show.ab-animate-in,.ab-iam-root.v3.ab-effect-html.ab-show.ab-animate-in,.ab-iam-root.v3.ab-effect-modal.ab-show.ab-animate-in{-webkit-transition:opacity .5s;-moz-transition:opacity .5s;-o-transition:opacity .5s;transition:opacity .5s}.ab-centering-div.ab-effect-fullscreen.ab-hide,.ab-centering-div.ab-effect-html.ab-hide,.ab-centering-div.ab-effect-modal.ab-hide,.ab-iam-root.v3.ab-effect-fullscreen.ab-hide,.ab-iam-root.v3.ab-effect-html.ab-hide,.ab-iam-root.v3.ab-effect-modal.ab-hide{opacity:0}.ab-centering-div.ab-effect-fullscreen.ab-hide.ab-animate-out,.ab-centering-div.ab-effect-html.ab-hide.ab-animate-out,.ab-centering-div.ab-effect-modal.ab-hide.ab-animate-out,.ab-iam-root.v3.ab-effect-fullscreen.ab-hide.ab-animate-out,.ab-iam-root.v3.ab-effect-html.ab-hide.ab-animate-out,.ab-iam-root.v3.ab-effect-modal.ab-hide.ab-animate-out{-webkit-transition:opacity .5s;-moz-transition:opacity .5s;-o-transition:opacity .5s;transition:opacity .5s}.ab-centering-div.ab-effect-slide .ab-in-app-message,.ab-iam-root.v3.ab-effect-slide .ab-in-app-message{-webkit-transform:translateX(535px);-moz-transform:translateX(535px);-ms-transform:translateX(535px);transform:translateX(535px)}.ab-centering-div.ab-effect-slide.ab-show .ab-in-app-message,.ab-iam-root.v3.ab-effect-slide.ab-show .ab-in-app-message{-webkit-transform:translateX(0);-moz-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0)}.ab-centering-div.ab-effect-slide.ab-show.ab-animate-in .ab-in-app-message,.ab-iam-root.v3.ab-effect-slide.ab-show.ab-animate-in .ab-in-app-message{-webkit-transition:transform .5s ease-in-out;-moz-transition:transform .5s ease-in-out;-o-transition:transform .5s ease-in-out;transition:transform .5s ease-in-out}.ab-centering-div.ab-effect-slide.ab-hide .ab-in-app-message,.ab-iam-root.v3.ab-effect-slide.ab-hide .ab-in-app-message{-webkit-transform:translateX(535px);-moz-transform:translateX(535px);-ms-transform:translateX(535px);transform:translateX(535px)}.ab-centering-div.ab-effect-slide.ab-hide .ab-in-app-message.ab-swiped-left,.ab-iam-root.v3.ab-effect-slide.ab-hide .ab-in-app-message.ab-swiped-left{-webkit-transform:translateX(-535px);-moz-transform:translateX(-535px);-ms-transform:translateX(-535px);transform:translateX(-535px)}.ab-centering-div.ab-effect-slide.ab-hide .ab-in-app-message.ab-swiped-up,.ab-iam-root.v3.ab-effect-slide.ab-hide .ab-in-app-message.ab-swiped-up{-webkit-transform:translateY(-535px);-moz-transform:translateY(-535px);-ms-transform:translateY(-535px);transform:translateY(-535px)}.ab-centering-div.ab-effect-slide.ab-hide .ab-in-app-message.ab-swiped-down,.ab-iam-root.v3.ab-effect-slide.ab-hide .ab-in-app-message.ab-swiped-down{-webkit-transform:translateY(535px);-moz-transform:translateY(535px);-ms-transform:translateY(535px);transform:translateY(535px)}.ab-centering-div.ab-effect-slide.ab-hide.ab-animate-out .ab-in-app-message,.ab-iam-root.v3.ab-effect-slide.ab-hide.ab-animate-out .ab-in-app-message{-webkit-transition:transform .5s ease-in-out;-moz-transition:transform .5s ease-in-out;-o-transition:transform .5s ease-in-out;transition:transform .5s ease-in-out}.ab-centering-div .ab-ios-scroll-wrapper,.ab-iam-root.v3 .ab-ios-scroll-wrapper{position:fixed;top:0;right:0;bottom:0;left:0;overflow:auto;pointer-events:all;touch-action:auto;-webkit-overflow-scrolling:touch}.ab-centering-div .ab-in-app-message,.ab-iam-root.v3 .ab-in-app-message{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:fixed;text-align:center;-webkit-box-shadow:0 0 4px rgba(0,0,0,.3);-moz-box-shadow:0 0 4px rgba(0,0,0,.3);box-shadow:0 0 4px rgba(0,0,0,.3);line-height:normal;letter-spacing:normal;font-family:'Helvetica Neue Light','Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif;z-index:1050;max-width:100%;overflow:hidden;display:inline-block;pointer-events:all;color:#333}.ab-centering-div .ab-in-app-message.ab-no-shadow,.ab-iam-root.v3 .ab-in-app-message.ab-no-shadow{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}.ab-centering-div .ab-in-app-message :focus,.ab-centering-div .ab-in-app-message:focus,.ab-iam-root.v3 .ab-in-app-message :focus,.ab-iam-root.v3 .ab-in-app-message:focus{outline:0}.ab-centering-div .ab-in-app-message.ab-clickable,.ab-iam-root.v3 .ab-in-app-message.ab-clickable{cursor:pointer}.ab-centering-div .ab-in-app-message.ab-background,.ab-iam-root.v3 .ab-in-app-message.ab-background{background-color:#fff}.ab-centering-div .ab-in-app-message .ab-close-button,.ab-iam-root.v3 .ab-in-app-message .ab-close-button{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;background-color:transparent;background-size:15px;border:none;width:15px;min-width:15px;height:15px;cursor:pointer;display:block;font-size:15px;line-height:0;padding-top:15px;padding-right:15px;padding-left:15px;padding-bottom:15px;position:absolute;right:0;top:0;z-index:1060}.ab-centering-div .ab-in-app-message .ab-close-button svg,.ab-iam-root.v3 .ab-in-app-message .ab-close-button svg{-webkit-transition:.2s ease;-moz-transition:.2s ease;-o-transition:.2s ease;transition:.2s ease;fill:#9b9b9b}.ab-centering-div .ab-in-app-message .ab-close-button svg.ab-chevron,.ab-iam-root.v3 .ab-in-app-message .ab-close-button svg.ab-chevron{display:none}.ab-centering-div .ab-in-app-message .ab-close-button:active,.ab-iam-root.v3 .ab-in-app-message .ab-close-button:active{background-color:transparent}.ab-centering-div .ab-in-app-message .ab-close-button:focus,.ab-iam-root.v3 .ab-in-app-message .ab-close-button:focus{background-color:transparent}.ab-centering-div .ab-in-app-message .ab-close-button:hover,.ab-iam-root.v3 .ab-in-app-message .ab-close-button:hover{background-color:transparent}.ab-centering-div .ab-in-app-message .ab-close-button:hover svg,.ab-iam-root.v3 .ab-in-app-message .ab-close-button:hover svg{fill-opacity:.8}.ab-centering-div .ab-in-app-message .ab-message-text,.ab-iam-root.v3 .ab-in-app-message .ab-message-text{float:none;line-height:1.5;margin:20px 25px;max-width:100%;overflow:hidden;overflow-y:auto;vertical-align:text-bottom;word-wrap:break-word;white-space:pre-wrap;font-family:'Helvetica Neue Light','Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif}.ab-centering-div .ab-in-app-message .ab-message-text.start-aligned,.ab-iam-root.v3 .ab-in-app-message .ab-message-text.start-aligned{text-align:left;text-align:start}.ab-centering-div .ab-in-app-message .ab-message-text.end-aligned,.ab-iam-root.v3 .ab-in-app-message .ab-message-text.end-aligned{text-align:right;text-align:end}.ab-centering-div .ab-in-app-message .ab-message-text.center-aligned,.ab-iam-root.v3 .ab-in-app-message .ab-message-text.center-aligned{text-align:center}.ab-centering-div .ab-in-app-message .ab-message-text::-webkit-scrollbar,.ab-iam-root.v3 .ab-in-app-message .ab-message-text::-webkit-scrollbar{-webkit-appearance:none;width:14px}.ab-centering-div .ab-in-app-message .ab-message-text::-webkit-scrollbar-thumb,.ab-iam-root.v3 .ab-in-app-message .ab-message-text::-webkit-scrollbar-thumb{-webkit-appearance:none;border:4px solid transparent;background-clip:padding-box;-webkit-border-radius:7px;-moz-border-radius:7px;border-radius:7px;background-color:rgba(0,0,0,.2)}.ab-centering-div .ab-in-app-message .ab-message-text::-webkit-scrollbar-button,.ab-iam-root.v3 .ab-in-app-message .ab-message-text::-webkit-scrollbar-button{width:0;height:0;display:none}.ab-centering-div .ab-in-app-message .ab-message-text::-webkit-scrollbar-corner,.ab-iam-root.v3 .ab-in-app-message .ab-message-text::-webkit-scrollbar-corner{background-color:transparent}.ab-centering-div .ab-in-app-message .ab-message-header,.ab-iam-root.v3 .ab-in-app-message .ab-message-header{float:none;letter-spacing:0;margin:0;font-weight:700;font-family:'Helvetica Neue Light','Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif;display:block;font-size:20px;margin-bottom:10px;line-height:1.3}.ab-centering-div .ab-in-app-message .ab-message-header.start-aligned,.ab-iam-root.v3 .ab-in-app-message .ab-message-header.start-aligned{text-align:left;text-align:start}.ab-centering-div .ab-in-app-message .ab-message-header.end-aligned,.ab-iam-root.v3 .ab-in-app-message .ab-message-header.end-aligned{text-align:right;text-align:end}.ab-centering-div .ab-in-app-message .ab-message-header.center-aligned,.ab-iam-root.v3 .ab-in-app-message .ab-message-header.center-aligned{text-align:center}.ab-centering-div .ab-in-app-message.ab-fullscreen,.ab-centering-div .ab-in-app-message.ab-modal,.ab-centering-div .ab-in-app-message.ab-slideup,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen,.ab-iam-root.v3 .ab-in-app-message.ab-modal,.ab-iam-root.v3 .ab-in-app-message.ab-slideup{-webkit-border-radius:8px;-moz-border-radius:8px;border-radius:8px}.ab-centering-div .ab-in-app-message.ab-slideup,.ab-iam-root.v3 .ab-in-app-message.ab-slideup{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;cursor:pointer;overflow:hidden;word-wrap:break-word;text-overflow:ellipsis;font-size:14px;font-weight:700;margin:20px;margin-top:calc(constant(safe-area-inset-top,0) + 20px);margin-right:calc(constant(safe-area-inset-right,0) + 20px);margin-bottom:calc(constant(safe-area-inset-bottom,0) + 20px);margin-left:calc(constant(safe-area-inset-left,0) + 20px);margin-top:calc(env(safe-area-inset-top,0) + 20px);margin-right:calc(env(safe-area-inset-right,0) + 20px);margin-bottom:calc(env(safe-area-inset-bottom,0) + 20px);margin-left:calc(env(safe-area-inset-left,0) + 20px);max-height:150px;padding:10px;right:0;background-color:#efefef}.ab-centering-div .ab-in-app-message.ab-slideup.simulate-phone,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.simulate-phone{max-height:66px;margin:10px;margin-top:calc(constant(safe-area-inset-top,0) + 10px);margin-right:calc(constant(safe-area-inset-right,0) + 10px);margin-bottom:calc(constant(safe-area-inset-bottom,0) + 10px);margin-left:calc(constant(safe-area-inset-left,0) + 10px);margin-top:calc(env(safe-area-inset-top,0) + 10px);margin-right:calc(env(safe-area-inset-right,0) + 10px);margin-bottom:calc(env(safe-area-inset-bottom,0) + 10px);margin-left:calc(env(safe-area-inset-left,0) + 10px);max-width:90%;max-width:calc(100% - 40px);min-width:90%;min-width:calc(100% - 40px)}.ab-centering-div .ab-in-app-message.ab-slideup.simulate-phone .ab-close-button,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.simulate-phone .ab-close-button{display:none}.ab-centering-div .ab-in-app-message.ab-slideup.simulate-phone .ab-close-button svg:not(.ab-chevron),.ab-iam-root.v3 .ab-in-app-message.ab-slideup.simulate-phone .ab-close-button svg:not(.ab-chevron){display:none}.ab-centering-div .ab-in-app-message.ab-slideup.simulate-phone.ab-clickable .ab-close-button,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.simulate-phone.ab-clickable .ab-close-button{display:block;height:20px;padding:0 20px 0 18px;pointer-events:none;top:50%;-webkit-transform:translateY(-50%);-moz-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);width:12px}.ab-centering-div .ab-in-app-message.ab-slideup.simulate-phone.ab-clickable .ab-close-button svg.ab-chevron,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.simulate-phone.ab-clickable .ab-close-button svg.ab-chevron{display:inline}.ab-centering-div .ab-in-app-message.ab-slideup.simulate-phone.ab-clickable .ab-message-text,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.simulate-phone.ab-clickable .ab-message-text{border-right-width:40px}.ab-centering-div .ab-in-app-message.ab-slideup.simulate-phone .ab-message-text,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.simulate-phone .ab-message-text{max-width:100%;border-right-width:10px}.ab-centering-div .ab-in-app-message.ab-slideup.simulate-phone .ab-message-text span,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.simulate-phone .ab-message-text span{max-height:66px}.ab-centering-div .ab-in-app-message.ab-slideup.simulate-phone .ab-message-text.ab-with-icon,.ab-centering-div .ab-in-app-message.ab-slideup.simulate-phone .ab-message-text.ab-with-image,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.simulate-phone .ab-message-text.ab-with-icon,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.simulate-phone .ab-message-text.ab-with-image{max-width:80%;max-width:calc(100% - 50px - 5px - 10px - 25px)}.ab-centering-div .ab-in-app-message.ab-slideup.simulate-phone .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.simulate-phone .ab-image-area{width:50px;height:50px}.ab-centering-div .ab-in-app-message.ab-slideup.simulate-phone .ab-image-area img,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.simulate-phone .ab-image-area img{max-width:100%;max-height:100%;width:auto;height:auto}.ab-centering-div .ab-in-app-message.ab-slideup.ab-clickable:active .ab-message-text,.ab-centering-div .ab-in-app-message.ab-slideup.ab-clickable:focus .ab-message-text,.ab-centering-div .ab-in-app-message.ab-slideup.ab-clickable:hover .ab-message-text,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.ab-clickable:active .ab-message-text,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.ab-clickable:focus .ab-message-text,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.ab-clickable:hover .ab-message-text{opacity:.8}.ab-centering-div .ab-in-app-message.ab-slideup.ab-clickable:active .ab-close-button svg.ab-chevron,.ab-centering-div .ab-in-app-message.ab-slideup.ab-clickable:focus .ab-close-button svg.ab-chevron,.ab-centering-div .ab-in-app-message.ab-slideup.ab-clickable:hover .ab-close-button svg.ab-chevron,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.ab-clickable:active .ab-close-button svg.ab-chevron,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.ab-clickable:focus .ab-close-button svg.ab-chevron,.ab-iam-root.v3 .ab-in-app-message.ab-slideup.ab-clickable:hover .ab-close-button svg.ab-chevron{fill-opacity:.8}.ab-centering-div .ab-in-app-message.ab-slideup .ab-message-text,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-message-text{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:table-cell;border-color:transparent;border-style:solid;border-width:5px 25px 5px 10px;max-width:430px;vertical-align:middle;margin:0}.ab-centering-div .ab-in-app-message.ab-slideup .ab-message-text span,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-message-text span{display:block;max-height:150px;overflow:auto}.ab-centering-div .ab-in-app-message.ab-slideup .ab-message-text.ab-with-icon,.ab-centering-div .ab-in-app-message.ab-slideup .ab-message-text.ab-with-image,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-message-text.ab-with-icon,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-message-text.ab-with-image{max-width:365px;border-top:0;border-bottom:0}.ab-centering-div .ab-in-app-message.ab-slideup .ab-close-button,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-close-button{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;background-color:transparent;background-size:15px;border:none;width:15px;min-width:15px;height:15px;cursor:pointer;display:block;font-size:15px;line-height:0;padding-top:15px;padding-right:15px;padding-left:15px;padding-bottom:15px;position:absolute;right:0;top:0;z-index:1060}.ab-centering-div .ab-in-app-message.ab-slideup .ab-close-button svg,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-close-button svg{-webkit-transition:.2s ease;-moz-transition:.2s ease;-o-transition:.2s ease;transition:.2s ease;fill:#9b9b9b}.ab-centering-div .ab-in-app-message.ab-slideup .ab-close-button svg.ab-chevron,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-close-button svg.ab-chevron{display:none}.ab-centering-div .ab-in-app-message.ab-slideup .ab-close-button:active,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-close-button:active{background-color:transparent}.ab-centering-div .ab-in-app-message.ab-slideup .ab-close-button:focus,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-close-button:focus{background-color:transparent}.ab-centering-div .ab-in-app-message.ab-slideup .ab-close-button:hover,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-close-button:hover{background-color:transparent}.ab-centering-div .ab-in-app-message.ab-slideup .ab-close-button:hover svg,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-close-button:hover svg{fill-opacity:.8}.ab-centering-div .ab-in-app-message.ab-slideup .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-image-area{float:none;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:table-cell;border-color:transparent;border-style:solid;border-width:5px 0 5px 5px;vertical-align:top;width:60px;margin:0}.ab-centering-div .ab-in-app-message.ab-slideup .ab-image-area.ab-icon-area,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-image-area.ab-icon-area{width:auto}.ab-centering-div .ab-in-app-message.ab-slideup .ab-image-area img,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-image-area img{float:none;width:100%}.ab-centering-div .ab-in-app-message.ab-fullscreen,.ab-centering-div .ab-in-app-message.ab-modal,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen,.ab-iam-root.v3 .ab-in-app-message.ab-modal{font-size:14px}.ab-centering-div .ab-in-app-message.ab-fullscreen .ab-image-area,.ab-centering-div .ab-in-app-message.ab-modal .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-modal .ab-image-area{float:none;position:relative;display:block;overflow:hidden}.ab-centering-div .ab-in-app-message.ab-fullscreen .ab-image-area .ab-center-cropped-img,.ab-centering-div .ab-in-app-message.ab-modal .ab-image-area .ab-center-cropped-img,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen .ab-image-area .ab-center-cropped-img,.ab-iam-root.v3 .ab-in-app-message.ab-modal .ab-image-area .ab-center-cropped-img{background-size:cover;background-repeat:no-repeat;background-position:50% 50%;position:absolute;top:0;right:0;bottom:0;left:0}.ab-centering-div .ab-in-app-message.ab-fullscreen .ab-icon,.ab-centering-div .ab-in-app-message.ab-modal .ab-icon,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen .ab-icon,.ab-iam-root.v3 .ab-in-app-message.ab-modal .ab-icon{margin-top:20px}.ab-centering-div .ab-in-app-message.ab-fullscreen.graphic,.ab-centering-div .ab-in-app-message.ab-modal.graphic,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.graphic,.ab-iam-root.v3 .ab-in-app-message.ab-modal.graphic{padding:0}.ab-centering-div .ab-in-app-message.ab-fullscreen.graphic .ab-message-text,.ab-centering-div .ab-in-app-message.ab-modal.graphic .ab-message-text,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.graphic .ab-message-text,.ab-iam-root.v3 .ab-in-app-message.ab-modal.graphic .ab-message-text{display:none}.ab-centering-div .ab-in-app-message.ab-fullscreen.graphic .ab-message-buttons,.ab-centering-div .ab-in-app-message.ab-modal.graphic .ab-message-buttons,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.graphic .ab-message-buttons,.ab-iam-root.v3 .ab-in-app-message.ab-modal.graphic .ab-message-buttons{bottom:0;left:0}.ab-centering-div .ab-in-app-message.ab-fullscreen.graphic .ab-image-area,.ab-centering-div .ab-in-app-message.ab-modal.graphic .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.graphic .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-modal.graphic .ab-image-area{float:none;height:auto;margin:0}.ab-centering-div .ab-in-app-message.ab-fullscreen.graphic .ab-image-area img,.ab-centering-div .ab-in-app-message.ab-modal.graphic .ab-image-area img,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.graphic .ab-image-area img,.ab-iam-root.v3 .ab-in-app-message.ab-modal.graphic .ab-image-area img{display:block;top:0;-webkit-transform:none;-moz-transform:none;-ms-transform:none;transform:none}.ab-centering-div .ab-in-app-message.ab-modal,.ab-iam-root.v3 .ab-in-app-message.ab-modal{padding-top:20px;width:450px;max-width:450px;max-height:720px}.ab-centering-div .ab-in-app-message.ab-modal.simulate-phone,.ab-iam-root.v3 .ab-in-app-message.ab-modal.simulate-phone{max-width:91%;max-width:calc(100% - 30px)}.ab-centering-div .ab-in-app-message.ab-modal.simulate-phone.graphic .ab-image-area img,.ab-iam-root.v3 .ab-in-app-message.ab-modal.simulate-phone.graphic .ab-image-area img{max-width:91vw;max-width:calc(100vw - 30px)}.ab-centering-div .ab-in-app-message.ab-modal .ab-message-text,.ab-iam-root.v3 .ab-in-app-message.ab-modal .ab-message-text{max-height:660px}.ab-centering-div .ab-in-app-message.ab-modal .ab-message-text.ab-with-image,.ab-iam-root.v3 .ab-in-app-message.ab-modal .ab-message-text.ab-with-image{max-height:524.82758621px}.ab-centering-div .ab-in-app-message.ab-modal .ab-message-text.ab-with-icon,.ab-iam-root.v3 .ab-in-app-message.ab-modal .ab-message-text.ab-with-icon{max-height:610px}.ab-centering-div .ab-in-app-message.ab-modal .ab-message-text.ab-with-buttons,.ab-iam-root.v3 .ab-in-app-message.ab-modal .ab-message-text.ab-with-buttons{margin-bottom:93px;max-height:587px}.ab-centering-div .ab-in-app-message.ab-modal .ab-message-text.ab-with-buttons.ab-with-image,.ab-iam-root.v3 .ab-in-app-message.ab-modal .ab-message-text.ab-with-buttons.ab-with-image{max-height:451.82758621px}.ab-centering-div .ab-in-app-message.ab-modal .ab-message-text.ab-with-buttons.ab-with-icon,.ab-iam-root.v3 .ab-in-app-message.ab-modal .ab-message-text.ab-with-buttons.ab-with-icon{max-height:537px}.ab-centering-div .ab-in-app-message.ab-modal .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-modal .ab-image-area{margin-top:-20px;max-height:155.17241379px}.ab-centering-div .ab-in-app-message.ab-modal .ab-image-area img,.ab-iam-root.v3 .ab-in-app-message.ab-modal .ab-image-area img{max-width:100%;max-height:155.17241379px}.ab-centering-div .ab-in-app-message.ab-modal .ab-image-area.ab-icon-area,.ab-iam-root.v3 .ab-in-app-message.ab-modal .ab-image-area.ab-icon-area{height:auto}.ab-centering-div .ab-in-app-message.ab-modal.graphic,.ab-iam-root.v3 .ab-in-app-message.ab-modal.graphic{width:auto;overflow:hidden}.ab-centering-div .ab-in-app-message.ab-modal.graphic .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-modal.graphic .ab-image-area{display:inline}.ab-centering-div .ab-in-app-message.ab-modal.graphic .ab-image-area img,.ab-iam-root.v3 .ab-in-app-message.ab-modal.graphic .ab-image-area img{max-height:720px;max-width:450px}.ab-centering-div .ab-in-app-message.ab-fullscreen,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen{width:450px;max-height:720px}.ab-centering-div .ab-in-app-message.ab-fullscreen.landscape,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape{width:720px;max-height:450px}.ab-centering-div .ab-in-app-message.ab-fullscreen.landscape .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape .ab-image-area{height:225px}.ab-centering-div .ab-in-app-message.ab-fullscreen.landscape.graphic .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape.graphic .ab-image-area{height:450px}.ab-centering-div .ab-in-app-message.ab-fullscreen.landscape .ab-message-text,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape .ab-message-text{max-height:112px}.ab-centering-div .ab-in-app-message.ab-fullscreen .ab-message-text,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen .ab-message-text{max-height:247px}.ab-centering-div .ab-in-app-message.ab-fullscreen .ab-message-text.ab-with-buttons,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen .ab-message-text.ab-with-buttons{margin-bottom:93px}.ab-centering-div .ab-in-app-message.ab-fullscreen .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen .ab-image-area{height:360px}.ab-centering-div .ab-in-app-message.ab-fullscreen.graphic .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.graphic .ab-image-area{height:720px}.ab-centering-div .ab-in-app-message.ab-fullscreen.simulate-phone,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.simulate-phone{-webkit-transition:top none;-moz-transition:top none;-o-transition:top none;transition:top none;top:0;right:0;bottom:0;left:0;height:100%;width:100%;max-height:none;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;-webkit-transform:none;-moz-transform:none;-ms-transform:none;transform:none;height:auto!important}.ab-centering-div .ab-in-app-message.ab-fullscreen.simulate-phone.landscape .ab-close-button,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.simulate-phone.landscape .ab-close-button{margin-right:calc(constant(safe-area-inset-bottom,0) + constant(safe-area-inset-top,0));margin-right:calc(env(safe-area-inset-bottom,0) + env(safe-area-inset-top,0));margin-left:calc(constant(safe-area-inset-bottom,0) + constant(safe-area-inset-top,0));margin-left:calc(env(safe-area-inset-bottom,0) + env(safe-area-inset-top,0))}.ab-centering-div .ab-in-app-message.ab-fullscreen.simulate-phone .ab-image-area,.ab-centering-div .ab-in-app-message.ab-fullscreen.simulate-phone.landscape .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.simulate-phone .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.simulate-phone.landscape .ab-image-area{height:50%}.ab-centering-div .ab-in-app-message.ab-fullscreen.simulate-phone .ab-message-text,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.simulate-phone .ab-message-text{max-height:48%;max-height:calc(50% - 20px - 20px)}.ab-centering-div .ab-in-app-message.ab-fullscreen.simulate-phone .ab-message-text.ab-with-buttons,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.simulate-phone .ab-message-text.ab-with-buttons{margin-bottom:20px;max-height:30%;max-height:calc(50% - 93px - 20px)}.ab-centering-div .ab-in-app-message.ab-fullscreen.simulate-phone.landscape .ab-message-text.ab-with-buttons,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.simulate-phone.landscape .ab-message-text.ab-with-buttons{max-height:20%;max-height:calc(50% - 93px - 20px)}.ab-centering-div .ab-in-app-message.ab-fullscreen.simulate-phone:not(.graphic),.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.simulate-phone:not(.graphic){padding-bottom:0;padding-bottom:constant(safe-area-inset-bottom,0);padding-bottom:env(safe-area-inset-bottom,0)}.ab-centering-div .ab-in-app-message.ab-fullscreen.simulate-phone:not(.graphic) .ab-message-buttons,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.simulate-phone:not(.graphic) .ab-message-buttons{padding-top:0;position:relative}.ab-centering-div .ab-in-app-message.ab-fullscreen.simulate-phone.graphic,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.simulate-phone.graphic{display:block}.ab-centering-div .ab-in-app-message.ab-fullscreen.simulate-phone.graphic .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.simulate-phone.graphic .ab-image-area{height:100%}.ab-centering-div .ab-in-app-message.ab-fullscreen.simulate-phone.graphic .ab-message-button,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.simulate-phone.graphic .ab-message-button{margin-bottom:0;margin-bottom:constant(safe-area-inset-bottom,0);margin-bottom:env(safe-area-inset-bottom,0)}.ab-centering-div .ab-in-app-message.ab-html-message,.ab-iam-root.v3 .ab-in-app-message.ab-html-message{background-color:transparent;border:none;height:100%;overflow:auto;position:relative;touch-action:auto;width:100%}.ab-centering-div .ab-in-app-message .ab-message-buttons,.ab-iam-root.v3 .ab-in-app-message .ab-message-buttons{position:absolute;bottom:0;width:100%;padding:17px 25px 30px 25px;z-index:inherit;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.ab-centering-div .ab-in-app-message .ab-message-button,.ab-iam-root.v3 .ab-in-app-message .ab-message-button{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;cursor:pointer;display:inline-block;font-size:14px;font-weight:700;font-family:'Helvetica Neue Light','Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif;height:44px;line-height:normal;letter-spacing:normal;margin:0;max-width:100%;min-width:80px;padding:0 12px;position:relative;text-transform:none;width:48%;width:calc(50% - 5px);border:1px solid #1b78cf;-webkit-transition:.2s ease;-moz-transition:.2s ease;-o-transition:.2s ease;transition:.2s ease;overflow:hidden;word-wrap:break-word;text-overflow:ellipsis;word-wrap:normal;white-space:nowrap}.ab-centering-div .ab-in-app-message .ab-message-button:first-of-type,.ab-iam-root.v3 .ab-in-app-message .ab-message-button:first-of-type{float:left;background-color:#fff;color:#1b78cf}.ab-centering-div .ab-in-app-message .ab-message-button:last-of-type,.ab-iam-root.v3 .ab-in-app-message .ab-message-button:last-of-type{float:right;background-color:#1b78cf;color:#fff}.ab-centering-div .ab-in-app-message .ab-message-button:first-of-type:last-of-type,.ab-iam-root.v3 .ab-in-app-message .ab-message-button:first-of-type:last-of-type{float:none;width:auto}.ab-centering-div .ab-in-app-message .ab-message-button:after,.ab-iam-root.v3 .ab-in-app-message .ab-message-button:after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-color:transparent}.ab-centering-div .ab-in-app-message .ab-message-button:after,.ab-iam-root.v3 .ab-in-app-message .ab-message-button:after{-webkit-transition:.2s ease;-moz-transition:.2s ease;-o-transition:.2s ease;transition:.2s ease}.ab-centering-div .ab-in-app-message .ab-message-button:hover,.ab-iam-root.v3 .ab-in-app-message .ab-message-button:hover{opacity:.8}.ab-centering-div .ab-in-app-message .ab-message-button:active:after,.ab-iam-root.v3 .ab-in-app-message .ab-message-button:active:after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.08)}.ab-centering-div .ab-in-app-message .ab-message-button:focus:after,.ab-iam-root.v3 .ab-in-app-message .ab-message-button:focus:after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.15)}.ab-centering-div .ab-in-app-message .ab-message-button a,.ab-iam-root.v3 .ab-in-app-message .ab-message-button a{color:inherit;text-decoration:inherit}.ab-centering-div .ab-in-app-message img,.ab-iam-root.v3 .ab-in-app-message img{float:none;display:inline-block}.ab-centering-div .ab-in-app-message .ab-icon,.ab-iam-root.v3 .ab-in-app-message .ab-icon{float:none;display:inline-block;padding:10px;-webkit-border-radius:8px;-moz-border-radius:8px;border-radius:8px}.ab-centering-div .ab-in-app-message .ab-icon .fa,.ab-iam-root.v3 .ab-in-app-message .ab-icon .fa{float:none;font-size:30px;width:30px}.ab-centering-div .ab-start-hidden,.ab-iam-root.v3 .ab-start-hidden{visibility:hidden}.ab-centering-div .ab-centered,.ab-centering-div.ab-centering-div .ab-modal,.ab-iam-root.v3 .ab-centered,.ab-iam-root.v3.ab-centering-div .ab-modal{margin:auto;position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.ab-email-capture,.ab-iam-root.v3{-webkit-border-radius:0;-moz-border-radius:0;border-radius:0}.ab-email-capture .ab-page-blocker,.ab-iam-root.v3 .ab-page-blocker{position:fixed;top:0;left:0;width:100%;height:100%;z-index:1040;pointer-events:all;background-color:rgba(51,51,51,.75)}.ab-email-capture .ab-in-app-message.ab-modal .ab-email-capture-input{margin-bottom:30px}.ab-email-capture .ab-in-app-message.ab-modal .ab-message-buttons~.ab-message-text{max-height:541px;margin-bottom:160px}.ab-email-capture .ab-in-app-message.ab-modal .ab-message-buttons~.ab-message-text.with-explanatory-link{max-height:513px;margin-bottom:188px}.ab-email-capture .ab-in-app-message.ab-modal .ab-image-area~.ab-message-text{max-height:385.82758621px}.ab-email-capture .ab-in-app-message.ab-modal .ab-image-area~.ab-message-text.with-explanatory-link{max-height:357.82758621px}.ab-email-capture .ab-in-app-message.ab-modal .ab-email-validation-error{margin-top:62px}.ab-email-capture .ab-in-app-message.ab-modal .ab-explanatory-link{display:block}.ab-email-capture .ab-in-app-message.ab-modal .ab-background,.ab-email-capture .ab-in-app-message.ab-modal .ab-mask{position:absolute;top:0;right:0;bottom:0;left:0;z-index:-1}.ab-email-capture .ab-in-app-message.ab-modal .ab-close-button{line-height:normal}.ab-email-capture .ab-in-app-message.ab-modal .ab-html-close-button{right:3px;top:-1px;font-size:34px;padding-top:0}@media (max-width:600px){.ab-iam-root.v3 .ab-in-app-message.ab-slideup{max-height:66px;margin:10px;margin-top:calc(constant(safe-area-inset-top,0) + 10px);margin-right:calc(constant(safe-area-inset-right,0) + 10px);margin-bottom:calc(constant(safe-area-inset-bottom,0) + 10px);margin-left:calc(constant(safe-area-inset-left,0) + 10px);margin-top:calc(env(safe-area-inset-top,0) + 10px);margin-right:calc(env(safe-area-inset-right,0) + 10px);margin-bottom:calc(env(safe-area-inset-bottom,0) + 10px);margin-left:calc(env(safe-area-inset-left,0) + 10px);max-width:90%;max-width:calc(100% - 40px);min-width:90%;min-width:calc(100% - 40px)}.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-close-button{display:none}.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-close-button svg:not(.ab-chevron){display:none}.ab-iam-root.v3 .ab-in-app-message.ab-slideup.ab-clickable .ab-close-button{display:block;height:20px;padding:0 20px 0 18px;pointer-events:none;top:50%;-webkit-transform:translateY(-50%);-moz-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);width:12px}.ab-iam-root.v3 .ab-in-app-message.ab-slideup.ab-clickable .ab-close-button svg.ab-chevron{display:inline}.ab-iam-root.v3 .ab-in-app-message.ab-slideup.ab-clickable .ab-message-text{border-right-width:40px}.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-message-text{max-width:100%;border-right-width:10px}.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-message-text span{max-height:66px}.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-message-text.ab-with-icon,.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-message-text.ab-with-image{max-width:80%;max-width:calc(100% - 50px - 5px - 10px - 25px)}.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-image-area{width:50px;height:50px}.ab-iam-root.v3 .ab-in-app-message.ab-slideup .ab-image-area img{max-width:100%;max-height:100%;width:auto;height:auto}.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen,.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape{-webkit-transition:top none;-moz-transition:top none;-o-transition:top none;transition:top none;top:0;right:0;bottom:0;left:0;height:100%;width:100%;max-height:none;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;-webkit-transform:none;-moz-transform:none;-ms-transform:none;transform:none;height:auto!important}.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape .ab-close-button,.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape.landscape .ab-close-button{margin-right:calc(constant(safe-area-inset-bottom,0) + constant(safe-area-inset-top,0));margin-right:calc(env(safe-area-inset-bottom,0) + env(safe-area-inset-top,0));margin-left:calc(constant(safe-area-inset-bottom,0) + constant(safe-area-inset-top,0));margin-left:calc(env(safe-area-inset-bottom,0) + env(safe-area-inset-top,0))}.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen .ab-image-area,.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape .ab-image-area,.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape.landscape .ab-image-area{height:50%}.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen .ab-message-text,.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape .ab-message-text{max-height:48%;max-height:calc(50% - 20px - 20px)}.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen .ab-message-text.ab-with-buttons,.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape .ab-message-text.ab-with-buttons{margin-bottom:20px;max-height:30%;max-height:calc(50% - 93px - 20px)}.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape .ab-message-text.ab-with-buttons,.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape.landscape .ab-message-text.ab-with-buttons{max-height:20%;max-height:calc(50% - 93px - 20px)}.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape:not(.graphic),.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen:not(.graphic){padding-bottom:0;padding-bottom:constant(safe-area-inset-bottom,0);padding-bottom:env(safe-area-inset-bottom,0)}.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape:not(.graphic) .ab-message-buttons,.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen:not(.graphic) .ab-message-buttons{padding-top:0;position:relative}.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.graphic,.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape.graphic{display:block}.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.graphic .ab-image-area,.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape.graphic .ab-image-area{height:100%}.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.graphic .ab-message-button,.ab-iam-root.v3 .ab-in-app-message:not(.force-desktop).ab-fullscreen.landscape.graphic .ab-message-button{margin-bottom:0;margin-bottom:constant(safe-area-inset-bottom,0);margin-bottom:env(safe-area-inset-bottom,0)}}@media (max-width:480px){.ab-email-capture .ab-in-app-message.ab-modal:not(.force-desktop),.ab-iam-root.v3 .ab-in-app-message.ab-modal:not(.force-desktop){max-width:91%;max-width:calc(100% - 30px)}.ab-email-capture .ab-in-app-message.ab-modal:not(.force-desktop).graphic .ab-image-area img,.ab-iam-root.v3 .ab-in-app-message.ab-modal:not(.force-desktop).graphic .ab-image-area img{max-width:91vw;max-width:calc(100vw - 30px)}}@media (max-height:750px){.ab-email-capture .ab-in-app-message.ab-modal:not(.force-desktop),.ab-iam-root.v3 .ab-in-app-message.ab-modal:not(.force-desktop){max-height:91%;max-height:calc(100% - 30px)}.ab-email-capture .ab-in-app-message.ab-modal:not(.force-desktop).graphic .ab-image-area img,.ab-iam-root.v3 .ab-in-app-message.ab-modal:not(.force-desktop).graphic .ab-image-area img{max-height:91vh;max-height:calc(100vh - 30px)}.ab-email-capture .ab-in-app-message.ab-modal:not(.force-desktop) .ab-message-text,.ab-iam-root.v3 .ab-in-app-message.ab-modal:not(.force-desktop) .ab-message-text{max-height:65vh;max-height:calc(100vh - 30px - 60px)}.ab-email-capture .ab-in-app-message.ab-modal:not(.force-desktop) .ab-message-text.ab-with-image,.ab-iam-root.v3 .ab-in-app-message.ab-modal:not(.force-desktop) .ab-message-text.ab-with-image{max-height:45vh;max-height:calc(100vh - 30px - 155.17241379310346px - 40px)}.ab-email-capture .ab-in-app-message.ab-modal:not(.force-desktop) .ab-message-text.ab-with-icon,.ab-iam-root.v3 .ab-in-app-message.ab-modal:not(.force-desktop) .ab-message-text.ab-with-icon{max-height:45vh;max-height:calc(100vh - 30px - 70px - 40px)}.ab-email-capture .ab-in-app-message.ab-modal:not(.force-desktop) .ab-message-text.ab-with-buttons,.ab-iam-root.v3 .ab-in-app-message.ab-modal:not(.force-desktop) .ab-message-text.ab-with-buttons{max-height:50vh;max-height:calc(100vh - 30px - 93px - 40px)}.ab-email-capture .ab-in-app-message.ab-modal:not(.force-desktop) .ab-message-text.ab-with-buttons.ab-with-image,.ab-iam-root.v3 .ab-in-app-message.ab-modal:not(.force-desktop) .ab-message-text.ab-with-buttons.ab-with-image{max-height:30vh;max-height:calc(100vh - 30px - 155.17241379310346px - 93px - 20px)}.ab-email-capture .ab-in-app-message.ab-modal:not(.force-desktop) .ab-message-text.ab-with-buttons.ab-with-icon,.ab-iam-root.v3 .ab-in-app-message.ab-modal:not(.force-desktop) .ab-message-text.ab-with-buttons.ab-with-icon{max-height:30vh;max-height:calc(100vh - 30px - 70px - 93px - 20px)}}@media (min-width:601px){.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen .ab-image-area img{max-height:100%;max-width:100%}}@media (max-height:750px) and (min-width:601px){.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen:not(.landscape):not(.force-desktop){-webkit-transition:top none;-moz-transition:top none;-o-transition:top none;transition:top none;top:0;right:0;bottom:0;left:0;height:100%;width:100%;max-height:none;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;-webkit-transform:none;-moz-transform:none;-ms-transform:none;transform:none;height:auto!important;width:450px}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen:not(.landscape):not(.force-desktop).landscape .ab-close-button{margin-right:calc(constant(safe-area-inset-bottom,0) + constant(safe-area-inset-top,0));margin-right:calc(env(safe-area-inset-bottom,0) + env(safe-area-inset-top,0));margin-left:calc(constant(safe-area-inset-bottom,0) + constant(safe-area-inset-top,0));margin-left:calc(env(safe-area-inset-bottom,0) + env(safe-area-inset-top,0))}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen:not(.landscape):not(.force-desktop) .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen:not(.landscape):not(.force-desktop).landscape .ab-image-area{height:50%}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen:not(.landscape):not(.force-desktop) .ab-message-text{max-height:48%;max-height:calc(50% - 20px - 20px)}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen:not(.landscape):not(.force-desktop) .ab-message-text.ab-with-buttons{margin-bottom:20px;max-height:30%;max-height:calc(50% - 93px - 20px)}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen:not(.landscape):not(.force-desktop).landscape .ab-message-text.ab-with-buttons{max-height:20%;max-height:calc(50% - 93px - 20px)}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen:not(.landscape):not(.force-desktop):not(.graphic){padding-bottom:0;padding-bottom:constant(safe-area-inset-bottom,0);padding-bottom:env(safe-area-inset-bottom,0)}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen:not(.landscape):not(.force-desktop):not(.graphic) .ab-message-buttons{padding-top:0;position:relative}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen:not(.landscape):not(.force-desktop).graphic{display:block}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen:not(.landscape):not(.force-desktop).graphic .ab-image-area{height:100%}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen:not(.landscape):not(.force-desktop).graphic .ab-message-button{margin-bottom:0;margin-bottom:constant(safe-area-inset-bottom,0);margin-bottom:env(safe-area-inset-bottom,0)}}@media (max-height:480px){.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop){-webkit-transition:top none;-moz-transition:top none;-o-transition:top none;transition:top none;top:0;right:0;bottom:0;left:0;height:100%;width:100%;max-height:none;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;-webkit-transform:none;-moz-transform:none;-ms-transform:none;transform:none;height:auto!important}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop).landscape .ab-close-button{margin-right:calc(constant(safe-area-inset-bottom,0) + constant(safe-area-inset-top,0));margin-right:calc(env(safe-area-inset-bottom,0) + env(safe-area-inset-top,0));margin-left:calc(constant(safe-area-inset-bottom,0) + constant(safe-area-inset-top,0));margin-left:calc(env(safe-area-inset-bottom,0) + env(safe-area-inset-top,0))}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop) .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop).landscape .ab-image-area{height:50%}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop) .ab-message-text{max-height:48%;max-height:calc(50% - 20px - 20px)}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop) .ab-message-text.ab-with-buttons{margin-bottom:20px;max-height:30%;max-height:calc(50% - 93px - 20px)}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop).landscape .ab-message-text.ab-with-buttons{max-height:20%;max-height:calc(50% - 93px - 20px)}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop):not(.graphic){padding-bottom:0;padding-bottom:constant(safe-area-inset-bottom,0);padding-bottom:env(safe-area-inset-bottom,0)}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop):not(.graphic) .ab-message-buttons{padding-top:0;position:relative}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop).graphic{display:block}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop).graphic .ab-image-area{height:100%}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop).graphic .ab-message-button{margin-bottom:0;margin-bottom:constant(safe-area-inset-bottom,0);margin-bottom:env(safe-area-inset-bottom,0)}}@media (max-width:750px){.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop){-webkit-transition:top none;-moz-transition:top none;-o-transition:top none;transition:top none;top:0;right:0;bottom:0;left:0;height:100%;width:100%;max-height:none;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;-webkit-transform:none;-moz-transform:none;-ms-transform:none;transform:none;height:auto!important}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop).landscape .ab-close-button{margin-right:calc(constant(safe-area-inset-bottom,0) + constant(safe-area-inset-top,0));margin-right:calc(env(safe-area-inset-bottom,0) + env(safe-area-inset-top,0));margin-left:calc(constant(safe-area-inset-bottom,0) + constant(safe-area-inset-top,0));margin-left:calc(env(safe-area-inset-bottom,0) + env(safe-area-inset-top,0))}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop) .ab-image-area,.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop).landscape .ab-image-area{height:50%}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop) .ab-message-text{max-height:48%;max-height:calc(50% - 20px - 20px)}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop) .ab-message-text.ab-with-buttons{margin-bottom:20px;max-height:30%;max-height:calc(50% - 93px - 20px)}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop).landscape .ab-message-text.ab-with-buttons{max-height:20%;max-height:calc(50% - 93px - 20px)}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop):not(.graphic){padding-bottom:0;padding-bottom:constant(safe-area-inset-bottom,0);padding-bottom:env(safe-area-inset-bottom,0)}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop):not(.graphic) .ab-message-buttons{padding-top:0;position:relative}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop).graphic{display:block}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop).graphic .ab-image-area{height:100%}.ab-iam-root.v3 .ab-in-app-message.ab-fullscreen.landscape:not(.force-desktop).graphic .ab-message-button{margin-bottom:0;margin-bottom:constant(safe-area-inset-bottom,0);margin-bottom:env(safe-area-inset-bottom,0)}}body>.ab-feed{position:fixed;top:0;right:0;bottom:0;width:421px;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0}body>.ab-feed .ab-feed-body{position:absolute;top:0;left:0;right:0;border:none;border-left:1px solid #d0d0d0;padding-top:70px;min-height:100%}body>.ab-feed .ab-initial-spinner{float:none}body>.ab-feed .ab-no-cards-message{position:absolute;width:100%;margin-left:-20px;top:40%}.ab-feed{-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-box-shadow:0 1px 7px 1px rgba(66,82,113,.15);-moz-box-shadow:0 1px 7px 1px rgba(66,82,113,.15);box-shadow:0 1px 7px 1px rgba(66,82,113,.15);width:402px;background-color:#eee;font-family:'Helvetica Neue Light','Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif;font-size:13px;line-height:130%;letter-spacing:normal;overflow-y:auto;overflow-x:visible;z-index:1050;-webkit-overflow-scrolling:touch}.ab-feed :focus,.ab-feed:focus{outline:0}.ab-feed .ab-feed-body{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;border:1px solid #d0d0d0;border-top:none;padding:20px 20px 0 20px}.ab-feed.ab-effect-slide{-webkit-transform:translateX(450px);-moz-transform:translateX(450px);-ms-transform:translateX(450px);transform:translateX(450px);-webkit-transition:transform .5s ease-in-out;-moz-transition:transform .5s ease-in-out;-o-transition:transform .5s ease-in-out;transition:transform .5s ease-in-out}.ab-feed.ab-effect-slide.ab-show{-webkit-transform:translateX(0);-moz-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0)}.ab-feed.ab-effect-slide.ab-hide{-webkit-transform:translateX(450px);-moz-transform:translateX(450px);-ms-transform:translateX(450px);transform:translateX(450px)}.ab-feed .ab-card{position:relative;-webkit-box-shadow:0 2px 3px 0 rgba(178,178,178,.5);-moz-box-shadow:0 2px 3px 0 rgba(178,178,178,.5);box-shadow:0 2px 3px 0 rgba(178,178,178,.5);-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;width:100%;border:1px solid #d0d0d0;margin-bottom:20px;overflow:hidden;background-color:#fff;-webkit-transition:height .4s ease-in-out,margin .4s ease-in-out;-moz-transition:height .4s ease-in-out,margin .4s ease-in-out;-o-transition:height .4s ease-in-out,margin .4s ease-in-out;transition:height .4s ease-in-out,margin .4s ease-in-out}.ab-feed .ab-card .ab-pinned-indicator{position:absolute;right:0;top:0;margin-right:-1px;width:0;height:0;border-style:solid;border-width:0 24px 24px 0;border-color:transparent #1676d0 transparent transparent}.ab-feed .ab-card .ab-pinned-indicator .fa-star{position:absolute;right:-21px;top:2px;font-size:9px;color:#fff}.ab-feed .ab-card.ab-effect-card.ab-hide{-webkit-transition:all .5s ease-in-out;-moz-transition:all .5s ease-in-out;-o-transition:all .5s ease-in-out;transition:all .5s ease-in-out}.ab-feed .ab-card.ab-effect-card.ab-hide.ab-swiped-left{-webkit-transform:translateX(-450px);-moz-transform:translateX(-450px);-ms-transform:translateX(-450px);transform:translateX(-450px)}.ab-feed .ab-card.ab-effect-card.ab-hide.ab-swiped-right{-webkit-transform:translateX(450px);-moz-transform:translateX(450px);-ms-transform:translateX(450px);transform:translateX(450px)}.ab-feed .ab-card.ab-effect-card.ab-hide:not(.ab-swiped-left):not(.ab-swiped-right){opacity:0}.ab-feed .ab-card .ab-close-button{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;background-color:transparent;background-size:15px;border:none;width:15px;min-width:15px;height:15px;cursor:pointer;display:block;font-size:15px;line-height:0;padding-top:15px;padding-right:15px;padding-left:15px;padding-bottom:15px;position:absolute;right:0;top:0;z-index:1060;opacity:0;-webkit-transition:.5s;-moz-transition:.5s;-o-transition:.5s;transition:.5s}.ab-feed .ab-card .ab-close-button svg{-webkit-transition:.2s ease;-moz-transition:.2s ease;-o-transition:.2s ease;transition:.2s ease;fill:#9b9b9b}.ab-feed .ab-card .ab-close-button svg.ab-chevron{display:none}.ab-feed .ab-card .ab-close-button:active{background-color:transparent}.ab-feed .ab-card .ab-close-button:focus{background-color:transparent}.ab-feed .ab-card .ab-close-button:hover{background-color:transparent}.ab-feed .ab-card .ab-close-button:hover svg{fill-opacity:.8}.ab-feed .ab-card .ab-close-button:hover{opacity:1}.ab-feed .ab-card .ab-close-button:focus{opacity:1}.ab-feed .ab-card a{float:none;color:inherit;text-decoration:none}.ab-feed .ab-card a:hover{text-decoration:underline}.ab-feed .ab-card .ab-image-area{float:none;display:inline-block;vertical-align:top;line-height:0;overflow:hidden;width:100%;-webkit-box-sizing:initial;-moz-box-sizing:initial;box-sizing:initial}.ab-feed .ab-card .ab-image-area img{float:none;height:auto;width:100%}.ab-feed .ab-card.ab-banner .ab-card-body{display:none}.ab-feed .ab-card .ab-card-body{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:inline-block;width:100%;position:relative}.ab-feed .ab-card .ab-unread-indicator{position:absolute;bottom:0;margin-right:-1px;width:100%;height:5px;background-color:#1676d0}.ab-feed .ab-card .ab-unread-indicator.read{background-color:transparent}.ab-feed .ab-card .ab-title{float:none;letter-spacing:0;margin:0;font-weight:700;font-family:'Helvetica Neue Light','Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif;display:block;overflow:hidden;word-wrap:break-word;text-overflow:ellipsis;font-size:18px;line-height:130%;padding:20px 25px 0 25px}.ab-feed .ab-card .ab-description{float:none;color:#545454;padding:15px 25px 20px 25px;word-wrap:break-word;white-space:pre-wrap}.ab-feed .ab-card .ab-description.ab-no-title{padding-top:20px}.ab-feed .ab-card .ab-url-area{float:none;color:#1676d0;margin-top:12px;font-family:'Helvetica Neue Light','Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif}.ab-feed .ab-card.ab-classic-card .ab-card-body{min-height:40px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px}.ab-feed .ab-card.ab-classic-card.with-image .ab-card-body{min-height:100px;padding-left:72px}.ab-feed .ab-card.ab-classic-card.with-image .ab-image-area{width:60px;height:60px;padding:20px 0 25px 25px;position:absolute}.ab-feed .ab-card.ab-classic-card.with-image .ab-image-area img{-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;max-width:100%;max-height:100%;width:auto;height:auto}.ab-feed .ab-card.ab-classic-card.with-image .ab-title{background-color:transparent;font-size:16px}.ab-feed .ab-card.ab-classic-card.with-image .ab-description{padding-top:10px}.ab-feed .ab-card.ab-control-card{height:0;width:0;margin:0;border:0}.ab-feed .ab-feed-buttons-wrapper{float:none;position:relative;background-color:#282828;height:50px;-webkit-box-shadow:0 2px 3px 0 rgba(178,178,178,.5);-moz-box-shadow:0 2px 3px 0 rgba(178,178,178,.5);box-shadow:0 2px 3px 0 rgba(178,178,178,.5);z-index:1}.ab-feed .ab-feed-buttons-wrapper .ab-close-button,.ab-feed .ab-feed-buttons-wrapper .ab-refresh-button{float:none;cursor:pointer;color:#fff;font-size:18px;padding:16px;-webkit-transition:.2s;-moz-transition:.2s;-o-transition:.2s;transition:.2s}.ab-feed .ab-feed-buttons-wrapper .ab-close-button:hover,.ab-feed .ab-feed-buttons-wrapper .ab-refresh-button:hover{font-size:22px}.ab-feed .ab-feed-buttons-wrapper .ab-close-button{float:right}.ab-feed .ab-feed-buttons-wrapper .ab-close-button:hover{padding-top:12px;padding-right:14px}.ab-feed .ab-feed-buttons-wrapper .ab-refresh-button{padding-left:17px}.ab-feed .ab-feed-buttons-wrapper .ab-refresh-button:hover{padding-top:13px;padding-left:14px}.ab-feed .ab-no-cards-message{text-align:center;margin-bottom:20px}@media (max-width:600px){body>.ab-feed{width:100%}}";
              })();
            function va(e) {
              null == e && (e = "");
              var t = e.split("?").slice(1).join("?");
              if (((e = {}), null != t)) {
                t = t.split("&");
                for (var a = 0; a < t.length; a++) {
                  var n = t[a].split("=");
                  "" !== n[0] && (e[n[0]] = n[1]);
                }
              }
              return e;
            }
            function wa(e) {
              return !(
                !e ||
                ((e = e.toString().toLowerCase()),
                0 !== e.lastIndexOf("javascript:", 0) &&
                  0 !== e.lastIndexOf("data:", 0))
              );
            }
            function xa(e, t, a, n, i, o, r, s, l, c, u, b, p) {
              null != e &&
                0 < e.length &&
                0 <
                  e.indexOf(
                    '"ab-in-app-message ab-html-message ab-email-capture"'
                  ) &&
                0 <
                  e.indexOf(
                    '"ab-in-app-message ab-show ab-modal ab-effect-modal"'
                  ) &&
                (l = s = !0),
                yt.call(
                  this,
                  e,
                  null,
                  null,
                  t,
                  a,
                  n,
                  i,
                  null,
                  null,
                  null,
                  o || "SWIPE",
                  r,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  s,
                  l,
                  null,
                  null,
                  null,
                  c,
                  void 0,
                  void 0,
                  void 0,
                  u,
                  b
                ),
                (this.messageFields = p);
            }
            function ya(
              e,
              t,
              a,
              n,
              i,
              o,
              r,
              s,
              l,
              c,
              u,
              b,
              p,
              d,
              h,
              f,
              g,
              m,
              v,
              w,
              x,
              y,
              k,
              E,
              S,
              A,
              C,
              N,
              T
            ) {
              (C = C || Jt),
                yt.call(
                  this,
                  e,
                  t,
                  null,
                  a,
                  n,
                  i,
                  o,
                  r,
                  s,
                  l,
                  c || "SWIPE",
                  u,
                  b,
                  p,
                  d,
                  h,
                  f,
                  g,
                  m,
                  v,
                  w,
                  x,
                  y,
                  k,
                  E,
                  S,
                  A,
                  C,
                  void 0,
                  N,
                  T
                );
            }
            function ka(
              e,
              t,
              a,
              n,
              i,
              o,
              r,
              s,
              l,
              c,
              u,
              b,
              p,
              d,
              h,
              f,
              g,
              m,
              v,
              w,
              x,
              y,
              k
            ) {
              (m = m || _t.Uf),
                (g = g || _t.Tf),
                yt.call(
                  this,
                  e,
                  t || "START",
                  a,
                  n,
                  i,
                  o,
                  r,
                  s,
                  l,
                  c,
                  u,
                  b,
                  p,
                  d,
                  null,
                  h,
                  f,
                  g,
                  m,
                  v,
                  w,
                  x,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  y,
                  k
                );
            }
            function Ea(e, t) {
              if (
                ((fa = {
                  en: {
                    NO_CARDS_MESSAGE:
                      "We have no updates for you at this time.<br/>Please check again later.",
                    FEED_TIMEOUT_MESSAGE:
                      "Sorry, this refresh timed out.<br/>Please try again later.",
                  },
                  ar: {
                    NO_CARDS_MESSAGE:
                      "\u0644\u064a\u0633 \u0644\u062f\u064a\u0646\u0627 \u0623\u064a \u062a\u062d\u062f\u064a\u062b. \u064a\u0631\u062c\u0649 \u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u0627\u064b",
                    FEED_TIMEOUT_MESSAGE:
                      "\u064a\u0631\u062c\u0649 \u062a\u0643\u0631\u0627\u0631 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629 \u0644\u0627\u062d\u0642\u0627",
                  },
                  cs: {
                    NO_CARDS_MESSAGE:
                      "V tuto chv\xedli pro v\xe1s nem\xe1me \u017e\xe1dn\xe9 aktualizace.<br/>Zkontrolujte pros\xedm znovu pozd\u011bji.",
                    FEED_TIMEOUT_MESSAGE:
                      "Pros\xedm zkuste to znovu pozd\u011bji.",
                  },
                  da: {
                    NO_CARDS_MESSAGE:
                      "Vi har ingen updates.<br/>Pr\xf8v venligst senere.",
                    FEED_TIMEOUT_MESSAGE: "Pr\xf8v venligst senere.",
                  },
                  de: {
                    NO_CARDS_MESSAGE:
                      "Derzeit sind keine Updates verf\xfcgbar.<br/>Bitte sp\xe4ter noch einmal versuchen.",
                    FEED_TIMEOUT_MESSAGE:
                      "Bitte sp\xe4ter noch einmal versuchen.",
                  },
                  es: {
                    NO_CARDS_MESSAGE:
                      "No tenemos actualizaciones.<br/>Por favor compru\xe9belo m\xe1s tarde.",
                    FEED_TIMEOUT_MESSAGE:
                      "Por favor int\xe9ntelo m\xe1s tarde.",
                  },
                  "es-mx": {
                    NO_CARDS_MESSAGE:
                      "No tenemos ninguna actualizaci\xf3n.<br/>Vuelva a verificar m\xe1s tarde.",
                    FEED_TIMEOUT_MESSAGE:
                      "Por favor, vuelva a intentarlo m\xe1s tarde.",
                  },
                  et: {
                    NO_CARDS_MESSAGE:
                      "Uuendusi pole praegu saadaval.<br/>Proovige hiljem uuesti.",
                    FEED_TIMEOUT_MESSAGE: "Palun proovige hiljem uuesti.",
                  },
                  fi: {
                    NO_CARDS_MESSAGE:
                      "P\xe4ivityksi\xe4 ei ole saatavilla.<br/>Tarkista my\xf6hemmin uudelleen.",
                    FEED_TIMEOUT_MESSAGE: "Yrit\xe4 my\xf6hemmin uudelleen.",
                  },
                  fr: {
                    NO_CARDS_MESSAGE:
                      "Aucune mise \xe0 jour disponible.<br/>Veuillez v\xe9rifier ult\xe9rieurement.",
                    FEED_TIMEOUT_MESSAGE:
                      "Veuillez r\xe9essayer ult\xe9rieurement.",
                  },
                  he: {
                    NO_CARDS_MESSAGE:
                      ".\u05d0\u05d9\u05df \u05dc\u05e0\u05d5 \u05e2\u05d3\u05db\u05d5\u05e0\u05d9\u05dd. \u05d1\u05d1\u05e7\u05e9\u05d4 \u05d1\u05d3\u05d5\u05e7 \u05e9\u05d5\u05d1 \u05d1\u05e7\u05e8\u05d5\u05d1",
                    FEED_TIMEOUT_MESSAGE:
                      ".\u05d1\u05d1\u05e7\u05e9\u05d4 \u05e0\u05e1\u05d4 \u05e9\u05d5\u05d1 \u05d1\u05e7\u05e8\u05d5\u05d1",
                  },
                  hi: {
                    NO_CARDS_MESSAGE:
                      "\u0939\u092e\u093e\u0930\u0947 \u092a\u093e\u0938 \u0915\u094b\u0908 \u0905\u092a\u0921\u0947\u091f \u0928\u0939\u0940\u0902 \u0939\u0948\u0902\u0964 \u0915\u0943\u092a\u092f\u093e \u092c\u093e\u0926 \u092e\u0947\u0902 \u092b\u093f\u0930 \u0938\u0947 \u091c\u093e\u0901\u091a \u0915\u0930\u0947\u0902.\u0964",
                    FEED_TIMEOUT_MESSAGE:
                      "\u0915\u0943\u092a\u092f\u093e \u092c\u093e\u0926 \u092e\u0947\u0902 \u0926\u094b\u092c\u093e\u0930\u093e \u092a\u094d\u0930\u092f\u093e\u0938 \u0915\u0930\u0947\u0902\u0964.",
                  },
                  id: {
                    NO_CARDS_MESSAGE:
                      "Kami tidak memiliki pembaruan. Coba lagi nanti.",
                    FEED_TIMEOUT_MESSAGE: "Coba lagi nanti.",
                  },
                  it: {
                    NO_CARDS_MESSAGE:
                      "Non ci sono aggiornamenti.<br/>Ricontrollare pi\xf9 tardi.",
                    FEED_TIMEOUT_MESSAGE: "Riprovare pi\xf9 tardi.",
                  },
                  ja: {
                    NO_CARDS_MESSAGE:
                      "\u30a2\u30c3\u30d7\u30c7\u30fc\u30c8\u306f\u3042\u308a\u307e\u305b\u3093\u3002<br/>\u5f8c\u3067\u3082\u3046\u4e00\u5ea6\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
                    FEED_TIMEOUT_MESSAGE:
                      "\u5f8c\u3067\u3082\u3046\u4e00\u5ea6\u8a66\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
                  },
                  ko: {
                    NO_CARDS_MESSAGE:
                      "\uc5c5\ub370\uc774\ud2b8\uac00 \uc5c6\uc2b5\ub2c8\ub2e4. \ub2e4\uc74c\uc5d0 \ub2e4\uc2dc \ud655\uc778\ud574 \uc8fc\uc2ed\uc2dc\uc624.",
                    FEED_TIMEOUT_MESSAGE:
                      "\ub098\uc911\uc5d0 \ub2e4\uc2dc \uc2dc\ub3c4\ud574 \uc8fc\uc2ed\uc2dc\uc624.",
                  },
                  ms: {
                    NO_CARDS_MESSAGE:
                      "Tiada kemas kini. Sila periksa kemudian.",
                    FEED_TIMEOUT_MESSAGE: "Sila cuba kemudian.",
                  },
                  nl: {
                    NO_CARDS_MESSAGE:
                      "Er zijn geen updates.<br/>Probeer het later opnieuw.",
                    FEED_TIMEOUT_MESSAGE: "Probeer het later opnieuw.",
                  },
                  no: {
                    NO_CARDS_MESSAGE:
                      "Vi har ingen oppdateringer.<br/>Vennligst sjekk igjen senere.",
                    FEED_TIMEOUT_MESSAGE: "Vennligst pr\xf8v igjen senere.",
                  },
                  pl: {
                    NO_CARDS_MESSAGE:
                      "Brak aktualizacji.<br/>Prosz\u0119 sprawdzi\u0107 ponownie p\xf3\u017aniej.",
                    FEED_TIMEOUT_MESSAGE:
                      "Prosz\u0119 spr\xf3bowa\u0107 ponownie p\xf3\u017aniej.",
                  },
                  pt: {
                    NO_CARDS_MESSAGE:
                      "N\xe3o temos atualiza\xe7\xf5es.<br/>Por favor, verifique mais tarde.",
                    FEED_TIMEOUT_MESSAGE: "Por favor, tente mais tarde.",
                  },
                  "pt-br": {
                    NO_CARDS_MESSAGE:
                      "N\xe3o temos nenhuma atualiza\xe7\xe3o.<br/>Verifique novamente mais tarde.",
                    FEED_TIMEOUT_MESSAGE: "Tente novamente mais tarde.",
                  },
                  ru: {
                    NO_CARDS_MESSAGE:
                      "\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u044f \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b.<br/>\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0441\u043d\u043e\u0432\u0430 \u043f\u043e\u0437\u0436\u0435.",
                    FEED_TIMEOUT_MESSAGE:
                      "\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0435 \u043f\u043e\u043f\u044b\u0442\u043a\u0443 \u043f\u043e\u0437\u0436\u0435.",
                  },
                  sv: {
                    NO_CARDS_MESSAGE:
                      "Det finns inga uppdateringar.<br/>F\xf6rs\xf6k igen senare.",
                    FEED_TIMEOUT_MESSAGE: "F\xf6rs\xf6k igen senare.",
                  },
                  th: {
                    NO_CARDS_MESSAGE:
                      "\u0e40\u0e23\u0e32\u0e44\u0e21\u0e48\u0e21\u0e35\u0e01\u0e32\u0e23\u0e2d\u0e31\u0e1e\u0e40\u0e14\u0e15 \u0e01\u0e23\u0e38\u0e13\u0e32\u0e15\u0e23\u0e27\u0e08\u0e2a\u0e2d\u0e1a\u0e20\u0e32\u0e22\u0e2b\u0e25\u0e31\u0e07.",
                    FEED_TIMEOUT_MESSAGE:
                      "\u0e01\u0e23\u0e38\u0e13\u0e32\u0e25\u0e2d\u0e07\u0e43\u0e2b\u0e21\u0e48\u0e20\u0e32\u0e22\u0e2b\u0e25\u0e31\u0e07.",
                  },
                  uk: {
                    NO_CARDS_MESSAGE:
                      "\u041e\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044f \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0456.<br/>\u043b\u0430\u0441\u043a\u0430, \u043f\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u0437\u043d\u043e\u0432\u0443 \u043f\u0456\u0437\u043d\u0456\u0448\u0435.",
                    FEED_TIMEOUT_MESSAGE:
                      "\u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u0441\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437 \u043f\u0456\u0437\u043d\u0456\u0448\u0435.",
                  },
                  vi: {
                    NO_CARDS_MESSAGE:
                      "Ch\xfang t\xf4i kh\xf4ng c\xf3 c\u1eadp nh\u1eadt n\xe0o.<br/>Vui l\xf2ng ki\u1ec3m tra l\u1ea1i sau.",
                    FEED_TIMEOUT_MESSAGE: "Vui l\xf2ng th\u1eed l\u1ea1i sau.",
                  },
                  "zh-hk": {
                    NO_CARDS_MESSAGE:
                      "\u66ab\u6642\u6c92\u6709\u66f4\u65b0.<br/>\u8acb\u7a0d\u5019\u518d\u8a66.",
                    FEED_TIMEOUT_MESSAGE: "\u8acb\u7a0d\u5019\u518d\u8a66.",
                  },
                  "zh-hans": {
                    NO_CARDS_MESSAGE:
                      "\u6682\u65f6\u6ca1\u6709\u66f4\u65b0.<br/>\u8bf7\u7a0d\u540e\u518d\u8bd5.",
                    FEED_TIMEOUT_MESSAGE: "\u8bf7\u7a0d\u5019\u518d\u8bd5.",
                  },
                  "zh-hant": {
                    NO_CARDS_MESSAGE:
                      "\u66ab\u6642\u6c92\u6709\u66f4\u65b0.<br/>\u8acb\u7a0d\u5019\u518d\u8a66.",
                    FEED_TIMEOUT_MESSAGE: "\u8acb\u7a0d\u5019\u518d\u8a66.",
                  },
                  "zh-tw": {
                    NO_CARDS_MESSAGE:
                      "\u66ab\u6642\u6c92\u6709\u66f4\u65b0.<br/>\u8acb\u7a0d\u5019\u518d\u8a66.",
                    FEED_TIMEOUT_MESSAGE: "\u8acb\u7a0d\u5019\u518d\u8a66.",
                  },
                  zh: {
                    NO_CARDS_MESSAGE:
                      "\u6682\u65f6\u6ca1\u6709\u66f4\u65b0.<br/>\u8bf7\u7a0d\u540e\u518d\u8bd5.",
                    FEED_TIMEOUT_MESSAGE: "\u8bf7\u7a0d\u5019\u518d\u8bd5.",
                  },
                }),
                null != e && (e = e.toLowerCase()),
                null != e && null == fa[e])
              ) {
                var a = e.indexOf("-");
                0 < a && (e = e.substring(0, a));
              }
              null == fa[e] &&
                ((e =
                  "Braze does not yet have a localization for language " +
                  e +
                  ", defaulting to English. Please contact us if you are willing and able to help us translate our SDK into this language."),
                t ? D.error(e) : D.info(e),
                (e = "en")),
                (ga = e);
            }
            function Sa(e, t) {
              (this.cards = e), (this.lastUpdated = t);
            }
            function Aa(e, t) {
              t &&
                ((t.className = t.className.replace("ab-show", "ab-hide")),
                setTimeout(function () {
                  t && t.parentNode && t.parentNode.removeChild(t);
                }, Da));
              var a = t.getAttribute(Oa);
              null != a && e.N(a);
            }
            function Ca(e, t, a) {
              var n = document.createElement("div");
              if (
                ((n.className = "ab-feed-body"),
                n.setAttribute("aria-label", "Feed"),
                n.setAttribute("role", "feed"),
                null == e.lastUpdated)
              ) {
                (a = document.createElement("div")).className =
                  "ab-no-cards-message";
                var i = document.createElement("i");
                (i.className =
                  "fa fa-spinner fa-spin fa-4x ab-initial-spinner"),
                  a.appendChild(i),
                  n.appendChild(a);
              } else {
                i = !1;
                for (
                  var o = function (a) {
                      e.La(t, a);
                    },
                    r = function (e) {
                      t.Hc(e);
                    },
                    s = 0;
                  s < e.cards.length;
                  s++
                ) {
                  var l = e.cards[s] instanceof vt;
                  !l || e instanceof za
                    ? (n.appendChild(e.cards[s].aa(o, r, a)), (i = i || !l))
                    : D.error(
                        "Received a control card for a legacy news feed. Control cards are only supported with content cards."
                      );
                }
                i ||
                  (((a = document.createElement("div")).className =
                    "ab-no-cards-message"),
                  (a.innerHTML = fa[ga].NO_CARDS_MESSAGE),
                  a.setAttribute("role", "article"),
                  n.appendChild(a));
              }
              return n;
            }
            function Na(e, t, a) {
              if (null != a) {
                var n = [];
                (a = a.querySelectorAll(".ab-card")), e.od || (e.od = {});
                for (var i = 0; i < a.length; i++) {
                  var o = a[i].getAttribute("data-ab-card-id");
                  if (!e.od[o]) {
                    var r = a[i];
                    r =
                      null != r &&
                      !!r.getAttribute("data-ab-had-top-impression");
                    var s = a[i],
                      l = r,
                      c = (s =
                        null != s &&
                        !!s.getAttribute("data-ab-had-bottom-impression")),
                      u = Xe(a[i], !0, !1, !1),
                      b = Xe(a[i], !1, !0, !1);
                    if (!r && u) {
                      r = !0;
                      var p = a[i];
                      null != p &&
                        p.setAttribute("data-ab-had-top-impression", !0);
                    }
                    if (
                      (!s &&
                        b &&
                        ((s = !0),
                        null != (p = a[i]) &&
                          p.setAttribute("data-ab-had-bottom-impression", !0)),
                      r && s && (u || b || ct(a[i]), !l || !c))
                    )
                      for (r = 0; r < e.cards.length; r++)
                        if (e.cards[i].id === o) {
                          (e.od[e.cards[i].id] = !0), n.push(e.cards[i]);
                          break;
                        }
                  }
                }
                0 < n.length && e.Ma(t, n);
              }
            }
            function Ta(e, t, a) {
              a.setAttribute("aria-busy", "true");
              var n = a.querySelectorAll(".ab-refresh-button")[0];
              null != n && (n.className += " fa-spin");
              var i = new Date().valueOf().toString();
              a.setAttribute(Ma, i),
                setTimeout(function () {
                  if (a.getAttribute(Ma) === i) {
                    for (
                      var e = a.querySelectorAll(".fa-spin"), t = 0;
                      t < e.length;
                      t++
                    )
                      e[t].className = e[t].className.replace(/fa-spin/g, "");
                    null !=
                      (e = a.querySelectorAll(".ab-initial-spinner")[0]) &&
                      (((t = document.createElement("span")).innerHTML =
                        fa[ga].FEED_TIMEOUT_MESSAGE),
                      e.parentNode.appendChild(t),
                      e.parentNode.removeChild(e)),
                      "true" === a.getAttribute("aria-busy") &&
                        a.setAttribute("aria-busy", "false");
                  }
                }, Ia),
                e.Se(t);
            }
            function _a(e, t, a, n, i, o) {
              if (I(t)) {
                for (var r = [], s = 0; s < t.length; s++)
                  t[s] instanceof nt && r.push(t[s]);
                (e.cards = r),
                  (e.lastUpdated = a),
                  null != n &&
                    (n.setAttribute("aria-busy", "false"),
                    null == e.lastUpdated
                      ? Aa(i, n)
                      : null != (t = n.querySelectorAll(".ab-feed-body")[0]) &&
                        ((o = Ca(e, i, o)),
                        t.parentNode.replaceChild(o, t),
                        Na(e, i, o.parentNode)));
              }
            }
            g(xa, yt),
              (xa.prototype.xf = function () {
                return !1;
              }),
              (xa.prototype.fb = function (e) {
                if (this.nf === aa) {
                  if (this.Wa) return !1;
                  this.Wa = !0;
                }
                return He(this.X, e), !0;
              }),
              (xa.prototype.aa = function (e, t, a, n, i, o) {
                function r(e, t, a) {
                  return (a = e.match(
                    new RegExp(
                      "([\\w]+)\\s*=\\s*document.createElement\\(['\"]" +
                        a +
                        "['\"]\\)"
                    )
                  ))
                    ? e.slice(0, a.index + a[0].length) +
                        ";" +
                        a[1] +
                        '.setAttribute("nonce", "' +
                        t +
                        '");' +
                        e.slice(a.index + a[0].length)
                    : null;
                }
                function s(t) {
                  var a = t.getAttribute("href"),
                    n = t.onclick;
                  return function (o) {
                    if (null == n || "function" !== typeof n || !1 !== n()) {
                      var r = va(a).abButtonId;
                      if (
                        ((null != r && "" !== r) || (r = t.getAttribute("id")),
                        null != a && "" !== a && 0 !== a.indexOf("#"))
                      ) {
                        var s =
                            "blank" ===
                            (t.getAttribute("target") || "")
                              .toLowerCase()
                              .replace("_", ""),
                          u = i || l.openTarget === Ft || s;
                        (s = function () {
                          e.Pb(l, r, a), at.openUri(a, o, u);
                        }),
                          u ? s() : Nt(l, c, s);
                      } else e.Pb(l, r, a);
                      return o.stopPropagation(), !1;
                    }
                  };
                }
                var l = this;
                this.tc = document.activeElement;
                var c = document.createElement("iframe");
                return (
                  c.setAttribute("title", "Modal Message"),
                  o && (c.style.zIndex = o + 1),
                  (c.onload = function () {
                    function a(e) {
                      return function () {
                        var a = arguments;
                        Nt(l, c, function () {
                          t.display[e].apply(
                            t.display,
                            Array.prototype.slice.call(a)
                          );
                        });
                      };
                    }
                    function i(e) {
                      return function () {
                        var a = t.getUser();
                        a[e].apply(a, Array.prototype.slice.call(arguments));
                      };
                    }
                    function o(e) {
                      return function () {
                        t[e].apply(t, Array.prototype.slice.call(arguments));
                      };
                    }
                    var u = null,
                      b = e.ih();
                    if (null != b) {
                      (u = document.createElement("html")).innerHTML =
                        l.message;
                      for (
                        var p = u.getElementsByTagName("style"), d = 0;
                        d < p.length;
                        d++
                      )
                        p[d].setAttribute("nonce", b);
                      for (
                        p = u.getElementsByTagName("script"), d = 0;
                        d < p.length;
                        d++
                      ) {
                        p[d].setAttribute("nonce", b),
                          (p[d].innerHTML = p[d].innerHTML.replace(
                            /<style>/g,
                            "<style nonce='" + b + "'>"
                          ));
                        var h = r(p[d].innerHTML, b, "script");
                        h && (p[d].innerHTML = h),
                          (h = r(p[d].innerHTML, b, "style")) &&
                            (p[d].innerHTML = h);
                      }
                    }
                    for (
                      c.contentWindow.focus(),
                        c.contentWindow.document.write(
                          u ? u.innerHTML : l.message
                        ),
                        null !=
                          (u =
                            c.contentWindow.document.getElementsByTagName(
                              "head"
                            )[0]) &&
                          (((p = document.createElement("style")).innerHTML =
                            ma.$e),
                          null != b && p.setAttribute("nonce", b),
                          u.appendChild(p),
                          Et(l) &&
                            (((p = document.createElement("style")).innerHTML =
                              l.css),
                            (p.id = St(l)),
                            null != b && p.setAttribute("nonce", b),
                            u.appendChild(p)),
                          (b =
                            c.contentWindow.document.createElement(
                              "base"
                            )).setAttribute("target", "_parent"),
                          u.appendChild(b)),
                        0 <
                          (b =
                            c.contentWindow.document.getElementsByTagName(
                              "title"
                            )).length &&
                          c.setAttribute("title", b[0].textContent),
                        b = {
                          closeMessage: function () {
                            Nt(l, c);
                          },
                          logClick: function () {
                            var e = [l];
                            0 < arguments.length && e.push(arguments[0]),
                              t.logInAppMessageHtmlClick.apply(t, e);
                          },
                          display: {},
                          web: {},
                        },
                        u = [
                          "requestImmediateDataFlush",
                          "logCustomEvent",
                          "logPurchase",
                          "unregisterAppboyPushMessages",
                        ],
                        p = 0;
                      p < u.length;
                      p++
                    )
                      b[u[p]] = o(u[p]);
                    u =
                      "setFirstName setLastName setEmail setGender setDateOfBirth setCountry setHomeCity setEmailNotificationSubscriptionType setLanguage addAlias setPushNotificationSubscriptionType setPhoneNumber setCustomUserAttribute addToCustomAttributeArray removeFromCustomAttributeArray incrementCustomUserAttribute setCustomLocationAttribute addToSubscriptionGroup removeFromSubscriptionGroup".split(
                        " "
                      );
                    var f = {};
                    for (p = 0; p < u.length; p++) f[u[p]] = i(u[p]);
                    for (
                      b.getUser = function () {
                        return f;
                      },
                        u = ["showFeed"],
                        p = 0;
                      p < u.length;
                      p++
                    )
                      b.display[u[p]] = a(u[p]);
                    for (
                      u = ["registerAppboyPushMessages", "trackLocation"],
                        p = 0;
                      p < u.length;
                      p++
                    )
                      b.web[u[p]] = o(u[p]);
                    if (
                      ((c.contentWindow.appboyBridge = b),
                      (c.contentWindow.brazeBridge = b),
                      l.nf !== na)
                    ) {
                      for (
                        u = c.contentWindow.document.getElementsByTagName("a"),
                          p = 0;
                        p < u.length;
                        p++
                      )
                        u[p].onclick = s(u[p]);
                      for (
                        u =
                          c.contentWindow.document.getElementsByTagName(
                            "button"
                          ),
                          p = 0;
                        p < u.length;
                        p++
                      )
                        u[p].onclick = s(u[p]);
                    }
                    null != (u = c.contentWindow.document.body) &&
                      (kt(l) && (u.id = l.htmlId),
                      ((p = document.createElement("hidden")).onclick =
                        b.closeMessage),
                      (p.className = "ab-programmatic-close-button"),
                      u.appendChild(p)),
                      c.contentWindow.dispatchEvent(
                        new CustomEvent("ab.BridgeReady")
                      ),
                      -1 !== c.className.indexOf("ab-start-hidden") &&
                        ((c.className = c.className.replace(
                          "ab-start-hidden",
                          ""
                        )),
                        n(c)),
                      document.activeElement !== c && c.focus();
                  }),
                  (c.className =
                    "ab-in-app-message ab-start-hidden ab-html-message ab-modal-interactions"),
                  "iOS" === xe.ga
                    ? (((a = document.createElement("div")).className =
                        "ab-ios-scroll-wrapper"),
                      a.appendChild(c),
                      (this.sc = a))
                    : (this.sc = c)
                );
              }),
              (xa.prototype.oa = function () {
                return yt.prototype.oa.call(this) + " ab-effect-html";
              }),
              (ie.HtmlMessage = xa),
              g(ya, yt),
              (ya.prototype.aa = function (e, t, a, n, i, o) {
                return (
                  (this.tc = document.activeElement),
                  ((t = yt.prototype.aa.call(this, e, a, n, i, o)).className +=
                    " ab-modal ab-centered"),
                  da(this, e, a, t, i),
                  ba(t),
                  pa(this.qd, t),
                  t
                );
              }),
              (ya.prototype.oa = function () {
                return yt.prototype.oa.call(this) + " ab-effect-modal";
              }),
              u.Object.defineProperties(ya.prototype, {
                Bd: {
                  configurable: !0,
                  enumerable: !0,
                  get: function () {
                    return qt;
                  },
                },
              }),
              (ie.ModalMessage = ya),
              g(ka, yt),
              ((t = ka.prototype).Ja = function () {
                return !1;
              }),
              (t.aa = function (e, t, a, n, i, o) {
                var r = yt.prototype.aa.call(this, e, a, n, i, o);
                r.className += " ab-slideup";
                var s = r.getElementsByClassName("ab-close-button")[0];
                if (
                  (null != s &&
                    ((e = Ye(
                      "0 0 11.38 19.44",
                      "M11.38 9.72l-9.33 9.72L0 17.3l7.27-7.58L0 2.14 2.05 0l9.33 9.72z",
                      Et(this) ? void 0 : xt(this.closeButtonColor)
                    )).setAttribute("class", "ab-chevron"),
                    s.appendChild(e)),
                  Ve(r, Qe, function (e) {
                    (r.className += " ab-swiped-left"), s.onclick(e);
                  }),
                  Ve(r, et, function (e) {
                    (r.className += " ab-swiped-right"), s.onclick(e);
                  }),
                  "TOP" === this.slideFrom)
                ) {
                  e = Ze;
                  var l = " ab-swiped-up";
                } else (e = $e), (l = " ab-swiped-down");
                return (
                  Ve(r, e, function (e) {
                    (r.className += l), s.onclick(e);
                  }),
                  r
                );
              }),
              (t.Xe = function () {
                var e = document.createElement("span");
                return e.appendChild(document.createTextNode(this.message)), e;
              }),
              (t.Kc = function (e) {
                var t = e.getElementsByClassName("ab-in-app-message")[0];
                Xe(t, !0, !0) ||
                  ("TOP" === this.slideFrom
                    ? (t.style.top = "0px")
                    : (t.style.bottom = "0px")),
                  yt.prototype.Kc.call(this, e);
              }),
              (t.oa = function () {
                return yt.prototype.oa.call(this) + " ab-effect-slide";
              }),
              u.Object.defineProperties(ka.prototype, {
                Bd: {
                  configurable: !0,
                  enumerable: !0,
                  get: function () {
                    return "START";
                  },
                },
              }),
              (ie.SlideUpMessage = ka),
              ((t = Sa.prototype).ff = function () {
                for (var e = 0, t = 0; t < this.cards.length; t++)
                  this.cards[t].viewed || this.cards[t] instanceof vt || e++;
                return e;
              }),
              (t.Ma = function (e, t) {
                e.Ma(t);
              }),
              (t.La = function (e, t) {
                e.La(t);
              }),
              (t.Se = function (e) {
                e.Nc();
              }),
              (t.aa = function (e, t) {
                function a(t) {
                  Ta(i, e, o), t.stopPropagation();
                }
                function n(t) {
                  Aa(e, o), t.stopPropagation();
                }
                var i = this,
                  o = document.createElement("div");
                (o.className = "ab-feed ab-hide ab-effect-slide"),
                  o.setAttribute("role", "dialog"),
                  o.setAttribute("tabindex", "-1");
                var r = document.createElement("div");
                (r.className = "ab-feed-buttons-wrapper"),
                  r.setAttribute("role", "group"),
                  o.appendChild(r);
                var s = document.createElement("i");
                (s.className = "fa fa-times ab-close-button"),
                  s.setAttribute("aria-label", "Close Feed"),
                  s.setAttribute("tabindex", "0"),
                  s.setAttribute("role", "button"),
                  s.addEventListener("keydown", function (e) {
                    (32 !== e.keyCode && 13 !== e.keyCode) || n(e);
                  }),
                  (s.onclick = n);
                var l = document.createElement("i");
                return (
                  (l.className = "fa fa-refresh ab-refresh-button"),
                  null == this.lastUpdated && (l.className += " fa-spin"),
                  l.setAttribute("aria-label", "Refresh Feed"),
                  l.setAttribute("tabindex", "0"),
                  l.setAttribute("role", "button"),
                  l.addEventListener("keydown", function (e) {
                    (32 !== e.keyCode && 13 !== e.keyCode) || a(e);
                  }),
                  (l.onclick = a),
                  r.appendChild(l),
                  r.appendChild(s),
                  o.appendChild(Ca(this, e, t)),
                  (o.onscroll = function () {
                    Na(i, e, o);
                  }),
                  o
                );
              });
            var Da = 500,
              Oa = "data-update-subscription-id",
              Ma = "data-last-requested-refresh",
              Ia = 1e4;
            function za(e, t) {
              Sa.call(this, e, t);
            }
            function Pa() {
              (this.h = !1), (this.j = []);
            }
            function Ua(e) {
              this.bb = e;
            }
            function Ra(e, t, a, n) {
              (this.lf = e),
                (this.Mc = t),
                (this.nb = a),
                (this.I = n),
                this.Mc === Ja &&
                  this.nb !== Ga &&
                  this.nb !== Ha &&
                  this.nb !== qa &&
                  this.nb !== Va &&
                  (this.I = G(this.I));
            }
            (ie.Feed = Sa),
              (ie.Feed.prototype.getUnreadCardCount = Sa.prototype.ff),
              g(za, Sa),
              (za.prototype.jh = function () {
                return Sa.prototype.ff.call(this);
              }),
              (za.prototype.Ma = function (e, t) {
                e.Ma(t, !0);
              }),
              (za.prototype.La = function (e, t) {
                e.La(t, !0);
              }),
              (za.prototype.Se = function (e) {
                e.Na();
              }),
              (ie.ContentCards = za),
              (ie.ContentCards.prototype.getUnviewedCardCount =
                za.prototype.jh),
              (Ua.prototype.fa = function (e) {
                return null == this.bb || this.bb === e[0];
              }),
              (Ua.prototype.A = function () {
                return this.bb;
              }),
              (Ra.prototype.fa = function (e) {
                var t = null;
                switch ((null != e && (t = e[this.lf]), this.nb)) {
                  case La:
                    return null != t && t.valueOf() === this.I.valueOf();
                  case Ba:
                    return null == t || t.valueOf() !== this.I.valueOf();
                  case Fa:
                    return typeof t === typeof this.I && t > this.I;
                  case Ga:
                    return this.Mc === Ja
                      ? null != t &&
                          z(t) &&
                          (new Date().valueOf() - t.valueOf()) / 1e3 <= this.I
                      : typeof t === typeof this.I && t >= this.I;
                  case ja:
                    return typeof t === typeof this.I && t < this.I;
                  case Ha:
                    return this.Mc === Ja
                      ? null != t &&
                          z(t) &&
                          (new Date().valueOf() - t.valueOf()) / 1e3 >= this.I
                      : typeof t === typeof this.I && t <= this.I;
                  case Ka:
                    return (
                      null != t &&
                      "string" === typeof t &&
                      typeof t === typeof this.I &&
                      null != t.match(this.I)
                    );
                  case Wa:
                    return null != t;
                  case Xa:
                    return null == t;
                  case qa:
                    return (
                      null != t &&
                      z(t) &&
                      (t.valueOf() - new Date().valueOf()) / 1e3 < this.I
                    );
                  case Va:
                    return (
                      null != t &&
                      z(t) &&
                      (t.valueOf() - new Date().valueOf()) / 1e3 > this.I
                    );
                  case Ya:
                    return (
                      null == t ||
                      typeof t !== typeof this.I ||
                      "string" !== typeof t ||
                      null == t.match(this.I)
                    );
                }
                return !1;
              }),
              (Ra.prototype.A = function () {
                var e = this.I;
                return (
                  z(this.I) && (e = F(e.valueOf())),
                  { k: this.lf, t: this.Mc, c: this.nb, v: e }
                );
              });
            var La = 1,
              Ba = 2,
              Fa = 3,
              Ga = 4,
              ja = 5,
              Ha = 6,
              Ka = 10,
              Wa = 11,
              Xa = 12,
              qa = 15,
              Va = 16,
              Ya = 17,
              Ja = "date";
            function Za(e) {
              this.filters = e;
            }
            function $a(e) {
              if (null == e || !I(e)) return null;
              for (var t = [], a = 0; a < e.length; a++) {
                for (var n = [], i = e[a], o = 0; o < i.length; o++) {
                  var r = i[o];
                  n.push(
                    new Ra(
                      r.property_key,
                      r.property_type,
                      r.comparator,
                      r.property_value
                    )
                  );
                }
                t.push(n);
              }
              return new Za(t);
            }
            function Qa(e) {
              for (var t = [], a = 0; a < e.length; a++) {
                for (var n = [], i = e[a], o = 0; o < i.length; o++) {
                  var r = i[o];
                  n.push(new Ra(r.k, r.t, r.c, r.v));
                }
                t.push(n);
              }
              return new Za(t);
            }
            function en(e, t) {
              (this.bb = e), (this.eb = t);
            }
            function tn(e, t) {
              (this.Za = e), (this.Gb = t);
            }
            function an(e) {
              this.cb = e;
            }
            function nn(e, t) {
              (this.cb = e), (this.eb = t);
            }
            function on(e) {
              this.Za = e;
            }
            (Za.prototype.fa = function (e) {
              for (var t = !0, a = 0; a < this.filters.length; a++) {
                for (var n = this.filters[a], i = !1, o = 0; o < n.length; o++)
                  if (n[o].fa(e)) {
                    i = !0;
                    break;
                  }
                if (!i) {
                  t = !1;
                  break;
                }
              }
              return t;
            }),
              (Za.prototype.A = function () {
                for (var e = [], t = 0; t < this.filters.length; t++) {
                  for (
                    var a = this.filters[t], n = [], i = 0;
                    i < a.length;
                    i++
                  )
                    n.push(a[i].A());
                  e.push(n);
                }
                return e;
              }),
              (en.prototype.fa = function (e) {
                if (null == this.bb || null == this.eb) return !1;
                var t = e[1];
                return e[0] === this.bb && this.eb.fa(t);
              }),
              (en.prototype.A = function () {
                return { e: this.bb, pf: this.eb.A() };
              }),
              (tn.prototype.fa = function (e) {
                if (null == this.Za) return !1;
                var t = cn(e[0], this.Za);
                if (!t) return !1;
                var a = null == this.Gb || 0 === this.Gb.length;
                if (null != this.Gb)
                  for (var n = 0; n < this.Gb.length; n++)
                    if (this.Gb[n] === e[1]) {
                      a = !0;
                      break;
                    }
                return t && a;
              }),
              (tn.prototype.A = function () {
                return this.Za;
              }),
              (an.prototype.fa = function (e) {
                return null == this.cb || e[0] === this.cb;
              }),
              (an.prototype.A = function () {
                return this.cb;
              }),
              (nn.prototype.fa = function (e) {
                if (null == this.cb || null == this.eb) return !1;
                var t = e[1];
                return e[0] === this.cb && this.eb.fa(t);
              }),
              (nn.prototype.A = function () {
                return { id: this.cb, pf: this.eb.A() };
              }),
              (on.prototype.fa = function (e) {
                return null == this.Za || cn(e[0], this.Za);
              }),
              (on.prototype.A = function () {
                return this.Za;
              });
            var rn = {
              OPEN: "open",
              fd: "purchase",
              ne: "push_click",
              Tc: "custom_event",
              ec: "iam_click",
              V: "test",
            };
            function sn(e, t) {
              (this.type = e), (this.data = t);
            }
            function ln(e, t, a) {
              return xn[e.type] === t && (null == e.data || e.data.fa(a));
            }
            function cn(e, t) {
              var a = null;
              try {
                a = window.atob(e);
              } catch (n) {
                return (
                  D.info(
                    "Failed to unencode analytics id " + e + ": " + n.message
                  ),
                  !1
                );
              }
              return t === a.split("_")[0];
            }
            function un(e) {
              var t = e.type;
              switch (t) {
                case pn:
                  var a = null;
                  break;
                case dn:
                  a = new an((e = e.data) ? e.product_id : null);
                  break;
                case hn:
                  a = new nn(
                    (e = e.data) ? e.product_id : null,
                    e ? $a(e.property_filters) : null
                  );
                  break;
                case fn:
                  a = new on((e = e.data) ? e.campaign_id : null);
                  break;
                case gn:
                  a = new Ua((e = e.data) ? e.event_name : null);
                  break;
                case mn:
                  a = new en(
                    (e = e.data) ? e.event_name : null,
                    e ? $a(e.property_filters) : null
                  );
                  break;
                case vn:
                  a = new tn((e = e.data) ? e.id : null, e ? e.buttons : null);
                  break;
                case wn:
                  a = null;
              }
              return new sn(t, a);
            }
            function bn(e) {
              switch (e.t) {
                case pn:
                  var t = null;
                  break;
                case dn:
                  t = new an(e.d);
                  break;
                case hn:
                  t = new nn((t = e.d || {}).id, Qa(t.pf || []));
                  break;
                case fn:
                  t = new on(e.d);
                  break;
                case gn:
                  t = new Ua(e.d);
                  break;
                case mn:
                  t = new en((t = e.d || {}).e, Qa(t.pf || []));
                  break;
                case vn:
                  t = new tn(e.d);
                  break;
                case wn:
                  t = null;
              }
              return new sn(e.t, t);
            }
            sn.prototype.A = function () {
              return { t: this.type, d: this.data ? this.data.A() : null };
            };
            var pn = "open",
              dn = "purchase",
              hn = "purchase_property",
              fn = "push_click",
              gn = "custom_event",
              mn = "custom_event_property",
              vn = "iam_click",
              wn = "test",
              xn = {};
            function yn(e, t, a, n, i, o, r, s, l, c, u, b) {
              (this.id = e),
                (this.ob = t || []),
                void 0 === a && (a = null),
                (this.startTime = a),
                void 0 === n && (n = null),
                (this.endTime = n),
                (this.priority = i || 0),
                (this.type = o),
                (this.ab = s || 0),
                null == c && (c = 1e3 * (this.ab + 30)),
                (this.Oa = c),
                (this.data = r),
                null == l && (l = Sn),
                (this.Rb = l),
                (this.kf = u),
                (this.Ca = b || null);
            }
            function kn(e, t) {
              var a = new Date().valueOf() - t;
              return (
                (t = null == t || isNaN(a) || null == e.Oa || a < e.Oa) ||
                  D.info(
                    "Trigger action " +
                      e.type +
                      " is no longer eligible for display - fired " +
                      a +
                      "ms ago and has a timeout of " +
                      e.Oa +
                      "ms"
                  ),
                !t
              );
            }
            function En(e) {
              for (var t = [], a = 0; a < e.c.length; a++) t.push(bn(e.c[a]));
              return new yn(
                e.i,
                t,
                H(e.s),
                H(e.e),
                e.p,
                e.t,
                e.da,
                e.d,
                e.r,
                e.tm,
                e.ss,
                e.ld
              );
            }
            (xn[pn] = rn.OPEN),
              (xn[dn] = rn.fd),
              (xn[hn] = rn.fd),
              (xn[fn] = rn.ne),
              (xn[gn] = rn.Tc),
              (xn[mn] = rn.Tc),
              (xn[vn] = rn.ec),
              (xn[wn] = rn.V),
              (yn.prototype.A = function () {
                for (var e = [], t = 0; t < this.ob.length; t++)
                  e.push(this.ob[t].A());
                return {
                  i: this.id,
                  c: e,
                  s: this.startTime,
                  e: this.endTime,
                  p: this.priority,
                  t: this.type,
                  da: this.data,
                  d: this.ab,
                  r: this.Rb,
                  tm: this.Oa,
                  ss: this.kf,
                  ld: this.Ca,
                };
              });
            var Sn = -1,
              An = { Xc: "inapp", we: "templated_iam" };
            function Cn(e, t) {
              return (
                (e = Math.ceil(e)),
                (t = Math.floor(t)),
                Math.floor(Math.random() * (t - e + 1)) + e
              );
            }
            function Nn(e) {
              var t,
                a = !1;
              try {
                if (
                  ((window.XMLHttpRequest &&
                    (t = new XMLHttpRequest()) &&
                    "undefined" !== typeof t.withCredentials) ||
                    ("undefined" !== typeof XDomainRequest
                      ? ((t = new XDomainRequest()), (a = t.async = !0))
                      : D.error(
                          "This browser does not have any supported ajax options!"
                        )),
                  null != t)
                ) {
                  var n = function () {
                    "function" === typeof e.error && e.error(t.status),
                      "function" === typeof e.zc && e.zc(!1);
                  };
                  (t.onload = function () {
                    if (a) var i = !0;
                    else {
                      if (4 !== t.readyState) return;
                      i =
                        (200 <= t.status && 300 > t.status) || 304 === t.status;
                    }
                    if (i) {
                      if ("function" === typeof e.h) {
                        try {
                          var o = JSON.parse(t.responseText);
                        } catch (r) {
                          e.h({
                            error:
                              "" === t.responseText
                                ? "empty_response"
                                : "invalid_json_response",
                            response: t.responseText,
                          });
                        }
                        o && e.h(o);
                      }
                      "function" === typeof e.zc && e.zc(!0);
                    } else n();
                  }),
                    (t.onerror = function () {
                      n();
                    }),
                    (t.ontimeout = function () {
                      n();
                    });
                  var i = JSON.stringify(e.data);
                  if (a) (t.onprogress = function () {}), t.open("post", e.url);
                  else {
                    t.open("POST", e.url, !0),
                      t.setRequestHeader("Content-type", "application/json"),
                      t.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    for (var o = e.headers || [], r = 0; r < o.length; r++)
                      t.setRequestHeader(o[r][0], o[r][1]);
                  }
                  t.send(i);
                }
              } catch (s) {
                D.error("Network request error: " + s.message);
              }
            }
            function Tn(e, t, a, n, i, o, r, s, l, c, u, b) {
              var p = this;
              (this.$ = e),
                (this.Kg = t),
                (this.Oe = a),
                (this.Fg = n),
                (this.Bb = i),
                (this.lb = 0),
                (this.pc = c.R.df),
                (this.Ie = null),
                (this.D = o),
                (this.mc = r),
                (this.f = s),
                (this.J = l),
                (this.b = c),
                (this.W = b),
                (this.Dg = u),
                (this.sd = new Ge()),
                (this.Eb = ["npm"]),
                (this.Ag = 50),
                (this.Va = 0),
                Si(this.W, function () {
                  p.Va = 0;
                }),
                (this.Cg = 1e3),
                (this.Bg = 6e4);
            }
            function _n(e, t) {
              var a = $n(e.mc),
                n = a.Ac();
              return (
                B(Te(e.b, ze.cc), n) || (t.device = n),
                (t.api_key = e.$),
                (t.time = F(new Date().valueOf(), !0)),
                (t.sdk_version = e.Kg),
                e.Oe && (t.sdk_flavor = e.Oe),
                (t.app_version = e.Fg),
                (t.device_id = a.id),
                (a = Te(e.b, ze.se) || []),
                (n = Te(e.b, ze.ue) || ""),
                0 < e.Eb.length &&
                  (!B(a, e.Eb) || n !== e.D.Kb()) &&
                  (t.sdk_metadata = e.Eb),
                t
              );
            }
            function Dn(e, t, a, n) {
              var i = a.auth_error,
                r = a.error;
              if (!i && !r) return !0;
              if (i) {
                for (
                  e.Va += 1,
                    a = { errorCode: i.error_code },
                    r = (n = o(n)).next();
                  !r.done;
                  r = n.next()
                )
                  I((r = r.value)) &&
                    "X-Braze-Auth-Signature" === r[0] &&
                    (a.signature = r[1]);
                return (
                  t.respond_with && t.respond_with.user_id
                    ? (a.userId = t.respond_with.user_id)
                    : t.user_id && (a.userId = t.user_id),
                  (n = i.reason)
                    ? ((a.reason = n), (i = "due to " + n))
                    : (i = "with error code " + i.error_code + "."),
                  e.W.Db ||
                    (i +=
                      ' Please use the "enableSdkAuthentication" initialization option to enable authentication.'),
                  D.error("SDK Authentication failed " + i),
                  In(e, t),
                  He(e.W.ze, a),
                  !1
                );
              }
              if (r) {
                switch ((i = r)) {
                  case "empty_response":
                    return (
                      Ae(e.b, [
                        new K(e.f.o(), N.Yc, new Date().valueOf(), e.D.Kb, {
                          e: "Received successful response with empty body.",
                        }),
                      ]),
                      D.info("Received successful response with empty body."),
                      !1
                    );
                  case "invalid_json_response":
                    return (
                      Ae(e.b, [
                        new K(e.f.o(), N.Yc, new Date().valueOf(), e.D.Kb, {
                          e:
                            "Received successful response with invalid JSON: " +
                            a.response,
                        }),
                      ]),
                      D.info("Received successful response with invalid JSON"),
                      !1
                    );
                  case "invalid_api_key":
                    i =
                      'The API key "' +
                      t.api_key +
                      '" is invalid for the baseUrl ' +
                      e.Bb;
                    break;
                  case "blacklisted":
                    i =
                      "Sorry, we are not currently accepting your requests. If you think this is in error, please contact us.";
                    break;
                  case "no_device_identifier":
                    i =
                      "No device identifier. Please contact support@braze.com";
                }
                D.error("Backend error: " + i);
              }
              return !1;
            }
            function On(e, t, a, n, i, r, s, l) {
              null == n && (n = !0), n && Gn(e);
              var c = Ce(e.b),
                u = Me(e.b),
                b = vi(e.D);
              if (0 < c.length)
                for (
                  var p = e.f.o(), d = o(c), h = d.next();
                  !h.done;
                  h = d.next()
                ) {
                  var f = (null == (h = h.value).gb && null == p) || h.gb === p;
                  h.type === N.ve && f && (b = !0);
                }
              if (!l && !b && e.Va >= e.Ag)
                D.info(
                  "Declining to flush data due to 50 consecutive authentication failures"
                );
              else if (
                ((l = a || b), !n || 0 !== c.length || 0 !== u.length || t || l)
              ) {
                var g = !1,
                  m = function (t, a) {
                    var o = !1;
                    Nn({
                      url: e.Bb + "/data/",
                      data: t,
                      headers: a,
                      h: function (n) {
                        if (
                          (null != t.respond_with &&
                            t.respond_with.triggers &&
                            (e.lb = Math.max(e.lb - 1, 0)),
                          Dn(e, t, n, a))
                        ) {
                          e.Va = 0;
                          var r = e.J;
                          if (null != n && null != n.config) {
                            var s = n.config;
                            if (s.time > pi(r).Nb) {
                              var l = !1;
                              null !=
                                (s = new ui(
                                  s.time,
                                  s.events_blacklist,
                                  s.attributes_blacklist,
                                  s.purchases_blacklist,
                                  s.messaging_session_timeout,
                                  s.vapid_public_key,
                                  s.content_cards
                                )).ra &&
                                pi(r).ra !== s.ra &&
                                (l = !0);
                              var c = !1;
                              null != s.Hb.enabled &&
                                (pi(r).Hb.enabled || !1) !== s.Hb.enabled &&
                                (c = !0),
                                (r.uc = s),
                                Ne(r.b, ze.te, s.A()),
                                l && He(r.xd),
                                c && He(r.Ae);
                            }
                          }
                          (null != t.respond_with &&
                            t.respond_with.user_id != e.f.o()) ||
                            (null != t.device && Ne(e.b, ze.cc, t.device),
                            null != t.sdk_metadata &&
                              (Ne(e.b, ze.se, t.sdk_metadata),
                              Ne(e.b, ze.ue, e.D.Kb())),
                            e.Dg(n),
                            "function" === typeof i && i());
                        } else n.auth_error && (o = !0);
                      },
                      error: function () {
                        null != t.respond_with &&
                          t.respond_with.triggers &&
                          (e.lb = Math.max(e.lb - 1, 0)),
                          In(e, t),
                          "function" === typeof r && r();
                      },
                      zc: function (t) {
                        "function" === typeof s && s(t),
                          n &&
                            !g &&
                            (t && !o
                              ? Fn(e)
                              : ((null == (t = e.Ie) || t < 1e3 * e.pc) &&
                                  (t = 1e3 * e.pc),
                                Fn(e, Math.min(3e5, Cn(1e3 * e.pc, 3 * t)))),
                            (g = !0));
                      },
                    });
                  },
                  v = function (e) {
                    return null != e ? e : "";
                  },
                  w = {};
                for (
                  a = v(e.f.o()),
                    (t || l) && ((w[a] = Un(e, t, l)), l && e.lb++),
                    t = function (t, a) {
                      var n = v(a.user_id);
                      w[n] || (w[n] = Un(e, !1, !1, n)),
                        w[n][t] || (w[n][t] = []),
                        w[n][t].push(a);
                    },
                    l = (c = o(c)).next();
                  !l.done;
                  l = c.next()
                )
                  t("events", l.value.Ac());
                for (c = (u = o(u)).next(); !c.done; c = u.next())
                  t("attributes", c.value);
                for (var x in ((u = !1), (c = {}), w))
                  e.W.Db && x !== a
                    ? In(e, w[x])
                    : ((c.ub = _n(e, w[x])),
                      (c.Pc = Rn(e, c.ub)),
                      Mn(
                        c.ub,
                        (function (e) {
                          return function () {
                            return m(e.ub, e.Pc);
                          };
                        })(c)
                      ),
                      (u = !0)),
                    (c = { ub: c.ub, Pc: c.Pc });
                n && !u
                  ? Fn(e)
                  : b &&
                    (D.info("Invoking new session subscriptions"), He(e.sd));
              } else Fn(e), "function" === typeof s && s(!0);
            }
            function Mn(e, t) {
              var a = e.device;
              a && a.os_version instanceof Promise
                ? a.os_version.then(function (a) {
                    (e.device.os_version = a), t();
                  })
                : t();
            }
            function In(e, t) {
              if (t.events) {
                for (
                  var a = [], n = o(t.events), i = n.next();
                  !i.done;
                  i = n.next()
                )
                  ((i = new K(
                    (i = i.value).user_id,
                    i.name,
                    i.time,
                    i.session_id,
                    i.data
                  )).time *= 1e3),
                    a.push(i);
                Ae(e.b, a);
              }
              if (t.attributes)
                for (a = (t = o(t.attributes)).next(); !a.done; a = t.next())
                  De(e.b, a.value);
            }
            function zn(e, t) {
              var a = "HTTP error ";
              null != e && (a += e + " "), D.error(a + t);
            }
            function Pn(e, t, a, n, i) {
              var o = Un(e, !1, !1);
              ((o = _n(e, o)).template = {
                trigger_id: t.Pa,
                trigger_event_type: a,
              }),
                null != n && (o.template.data = n.Ac());
              var r = Rn(e, o);
              Mn(o, function () {
                Nn({
                  url: e.Bb + "/template/",
                  data: o,
                  headers: r,
                  h: function (a) {
                    Dn(e, o, a, r)
                      ? ((e.Va = 0),
                        null == a || null == a.templated_message
                          ? e.M(t.Pa, Dt.yb)
                          : (a = a.templated_message).type !== An.Xc ||
                            null == (a = At(a.data))
                          ? e.M(t.Pa, Dt.Ab)
                          : "function" === typeof t.zf
                          ? t.zf(a)
                          : e.M(t.Pa, Dt.yb))
                      : (e.M(t.Pa, Dt.yb),
                        "function" === typeof t.yf && t.yf());
                  },
                  error: function (o) {
                    var r = "getting user personalization for message " + t.Pa;
                    if (new Date().valueOf() - t.Ec > t.Oa) e.M(t.Pa, Dt.yb);
                    else {
                      var s = Math.min(t.Oa, e.Bg),
                        l = e.Cg;
                      null == i && (i = l);
                      var c = Math.min(s, Cn(l, 3 * i));
                      (r += ". Retrying in " + c + "ms"),
                        setTimeout(function () {
                          Pn(e, t, a, n, c);
                        }, c);
                    }
                    zn(o, r);
                  },
                });
              });
            }
            function Un(e, t, a, n) {
              var i = {};
              return (
                t && (i.feed = !0),
                a && (i.triggers = !0),
                (t = null != n ? n : e.f.o()) && (i.user_id = t),
                (i.config = { config_time: pi(e.J).Nb }),
                { respond_with: i }
              );
            }
            function Rn(e, t) {
              var a = [["X-Braze-Api-Key", e.$]],
                n = !1;
              return (
                null != t.respond_with &&
                  t.respond_with.triggers &&
                  (a.push(["X-Braze-TriggersRequest", "true"]), (n = !0)),
                null != t.respond_with &&
                  t.respond_with.feed &&
                  (a.push(["X-Braze-FeedRequest", "true"]), (n = !0)),
                n && a.push(["X-Braze-DataRequest", "true"]),
                e.W.Db &&
                  null != (e = Te(e.W.b, ze.jb)) &&
                  a.push(["X-Braze-Auth-Signature", e]),
                a
              );
            }
            function Ln(e) {
              if (
                null == e.campaignId &&
                null == e.cardId &&
                null == e.triggerId
              )
                return (
                  D.info(
                    "The in-app message has no analytics id. Not logging event to Braze servers."
                  ),
                  null
                );
              var t = {};
              return (
                null != e.cardId && (t.card_ids = [e.cardId]),
                null != e.campaignId && (t.campaign_ids = [e.campaignId]),
                null != e.triggerId && (t.trigger_ids = [e.triggerId]),
                t
              );
            }
            function Bn(e) {
              for (var t = null, a = 0; a < e.length; a++)
                null != e[a].id &&
                  "" !== e[a].id &&
                  (((t = t || {}).ids = t.ids || []), t.ids.push(e[a].id));
              return t;
            }
            function Fn(e, t) {
              e.Ce ||
                (null == t && (t = 1e3 * e.pc),
                Gn(e),
                (e.qc = setTimeout(function () {
                  if (document.hidden) {
                    var t = function () {
                      document.hidden ||
                        (document.removeEventListener(
                          "visibilitychange",
                          t,
                          !1
                        ),
                        On(e));
                    };
                    document.addEventListener("visibilitychange", t, !1);
                  } else On(e);
                }, t)),
                (e.Ie = t));
            }
            function Gn(e) {
              null != e.qc && (clearTimeout(e.qc), (e.qc = null));
            }
            function jn(e, t) {
              je(e.sd, t);
            }
            function Hn(e, t, a) {
              wi(e.D),
                D.info("Requesting explicit trigger refresh."),
                On(e, null, !0, null, t, a);
            }
            function Kn(e, t, a, n) {
              var i = new Pa(),
                o = wi(e.D);
              return fi(e.J, a)
                ? (D.info(
                    'Custom Attribute "' + a + '" is blocklisted, ignoring.'
                  ),
                  i)
                : (i.j.push(
                    new K(e.f.o(), t, new Date().valueOf(), o, {
                      key: a,
                      value: n,
                    })
                  ),
                  (i.h = Ae(e.b, i.j)),
                  i);
            }
            function Wn(e, t) {
              var a = new Pa(),
                n = wi(e.D);
              return (
                a.j.push(
                  new K(e.f.o(), N.fg, new Date().valueOf(), n, { n: t })
                ),
                (a.h = Ae(e.b, a.j)),
                a
              );
            }
            function Xn(e, t, a) {
              var n = wi(e.D);
              return new K(e.f.o(), N.sg, t, n, { cid: a });
            }
            function qn(e) {
              var t = _.ba;
              new w(t).setItem(t.G.Rf, 1, {
                baseUrl: e.Bb,
                data: { api_key: e.$, device_id: $n(e.mc).id },
                userId: e.f.o(),
                sdkAuthEnabled: e.W.Db,
              });
            }
            function Vn(e, t, a) {
              var n = new Pa(),
                i = wi(e.D);
              return (
                (t = { group_id: t, status: a }),
                n.j.push(new K(e.f.o(), N.zg, new Date().valueOf(), i, t)),
                (n.h = Ae(e.b, n.j)),
                n
              );
            }
            ((t = Tn.prototype).Na = function (e, t, a, n, i) {
              var o = this,
                r = _n(this, {});
              (r.last_full_sync_at = e),
                (r.last_card_updated_at = t),
                null != (e = this.f.o()) && (r.user_id = e);
              var s = [
                ["X-Braze-Api-Key", this.$],
                ["X-Braze-DataRequest", "true"],
                ["X-Braze-ContentCardsRequest", "true"],
              ];
              this.W.Db &&
                null != (e = Te(this.W.b, ze.jb)) &&
                s.push(["X-Braze-Auth-Signature", e]),
                Mn(r, function () {
                  Nn({
                    url: o.Bb + "/content_cards/sync",
                    data: r,
                    headers: s,
                    h: function (e) {
                      Dn(o, r, e, s)
                        ? ((o.Va = 0), a(e), "function" === typeof n && n())
                        : "function" === typeof i && i();
                    },
                    error: function (e) {
                      zn(e, "retrieving content cards"),
                        "function" === typeof i && i();
                    },
                  });
                });
            }),
              (t.Hd = function () {
                (this.Ce = !1), Fn(this);
              }),
              (t.Jb = function () {
                this.sd.K(),
                  this.W.td.K(),
                  Gn(this),
                  (this.Ce = !0),
                  On(this, null, null, !1),
                  (this.qc = null);
              }),
              (t.Lc = function (e) {
                var t = this,
                  a = this.D.Kb();
                if (
                  ((a = a !== wi(this.D)) &&
                    (Ee(this.b, Ie.Uc), Ee(this.b, Ie.lc)),
                  On(this, null, !1, null, null, null),
                  qn(this),
                  a && null != e && (e.Mb() || e.Ka()))
                ) {
                  var n = function () {
                    e.Hg
                      ? D.info(
                          "Push token maintenance is disabled, not refreshing token for backend."
                        )
                      : e.subscribe();
                  };
                  E(
                    new w((a = _.ba)),
                    a.G.gd,
                    function (e, t) {
                      t && n();
                    },
                    function () {
                      var e = Te(t.b, ze.kc);
                      (null == e || e) && n();
                    }
                  );
                }
              }),
              (t.$a = function (e, t, a, n) {
                var i = this.f.o();
                if (i !== e) {
                  var o = this.D,
                    r = Se(o.b, Ie.Ta);
                  if (
                    (null != r &&
                      (o.b.rc.remove(Ie.Ta),
                      null == (r = mi(o, new Date().valueOf(), r)) ||
                        Ae(o.b, [r])),
                    null != i && On(this, null, !1, null, null, null),
                    (r = null == (o = this.f).o()),
                    ke(o.b, Ie.lc, new q(e)),
                    r)
                  ) {
                    if (null != (r = (o = o.b).R.Z(ze.Qa))) {
                      var s = ze.Qc,
                        l = r[s];
                      null != l &&
                        ((r[s] = void 0),
                        o.R.store(ze.Qa, r),
                        (l.user_id = e),
                        De(o, l));
                    }
                    if (
                      ((r = null),
                      null != (s = Se(o, Ie.Ta)) && (r = s.ia),
                      null != (s = Ce(o)))
                    )
                      for (l = 0; l < s.length; l++) {
                        var c = s[l];
                        null == c.gb && c.sessionId == r && (c.gb = e),
                          null == c || Ae(o, [c]);
                      }
                  }
                  for (
                    n
                      ? this.W.Tb(n)
                      : (_e((n = this.W).b, ze.jb),
                        S(new w((o = _.ba)), o.G.qe, n.ye)),
                      n = 0;
                    n < t.length;
                    n++
                  )
                    t[n].$a(null == i);
                  null != i && _e(this.b, ze.vb),
                    _e(this.b, ze.cc),
                    this.Lc(a),
                    D.info('Changed user to "' + e + '".');
                } else
                  (t = "Doing nothing."),
                    n &&
                      Te(this.W.b, ze.jb) !== n &&
                      (this.W.Tb(n),
                      (t = "Updated SDK authentication signature")),
                    D.info("Current user is already " + e + ". " + t);
              }),
              (t.rb = function () {
                return new oe(this.f, this);
              }),
              (t.tb = function (e) {
                Gn(this),
                  wi(this.D),
                  On(this, null, null, null, null, null, e, !0);
              }),
              (t.Nc = function () {
                wi(this.D), On(this, !0);
              }),
              (t.Jd = function (e, t) {
                var a = new Pa(),
                  n = wi(this.D);
                return -1 !== pi(this.J).cf.indexOf(e)
                  ? (D.info(
                      'Custom Event "' + e + '" is blocklisted, ignoring.'
                    ),
                    a)
                  : (a.j.push(
                      new K(
                        this.f.o(),
                        N.CustomEvent,
                        new Date().valueOf(),
                        n,
                        { n: e, p: t }
                      )
                    ),
                    (a.h = Ae(this.b, a.j)),
                    a);
              }),
              (t.Kd = function (e, t, a, n, i) {
                var o = new Pa(),
                  r = wi(this.D);
                return -1 !== pi(this.J).mf.indexOf(e)
                  ? (D.info('Purchase "' + e + '" is blocklisted, ignoring.'),
                    o)
                  : (o.j.push(
                      new K(this.f.o(), N.eg, new Date().valueOf(), r, {
                        pid: e,
                        c: a,
                        p: t,
                        q: n,
                        pr: i,
                      })
                    ),
                    (o.h = Ae(this.b, o.j)),
                    o);
              }),
              (t.Oc = function (e, t, a, n, i, o) {
                var r = new Pa(),
                  s = wi(this.D);
                return (
                  (t = { latitude: t, longitude: a }),
                  null != n && (t.altitude = n),
                  null != i && (t.ll_accuracy = i),
                  null != o && (t.alt_accuracy = o),
                  r.j.push(new K(e, N.lg, new Date().valueOf(), s, t)),
                  (r.h = Ae(this.b, r.j)),
                  r
                );
              }),
              (t.Qb = function (e) {
                var t = new Pa(),
                  a = wi(this.D);
                if (e instanceof ua)
                  t.j.push(
                    new K(this.f.o(), N.Mf, new Date().valueOf(), a, {
                      trigger_ids: [e.triggerId],
                    })
                  );
                else {
                  if (!e.Od())
                    return (
                      D.info(
                        "This in-app message has already received an impression. Ignoring analytics event."
                      ),
                      t
                    );
                  if (null == (e = Ln(e))) return t;
                  t.j.push(new K(this.f.o(), N.dg, new Date().valueOf(), a, e));
                }
                return (t.h = Ae(this.b, t.j)), t;
              }),
              (t.Jc = function (e) {
                var t = new Pa(),
                  a = wi(this.D);
                return e.fb()
                  ? (null == (e = Ln(e)) ||
                      (t.j.push(
                        new K(this.f.o(), N.ke, new Date().valueOf(), a, e)
                      ),
                      (t.h = Ae(this.b, t.j))),
                    t)
                  : (D.info(
                      "This in-app message has already received a click. Ignoring analytics event."
                    ),
                    t);
              }),
              (t.Ic = function (e, t) {
                var a = new Pa(),
                  n = wi(this.D);
                return e.fb()
                  ? null == (t = Ln(t))
                    ? a
                    : e.id === ca
                    ? (D.info(
                        "This in-app message button does not have a tracking id. Not logging event to Braze servers."
                      ),
                      a)
                    : (null != e.id && (t.bid = e.id),
                      a.j.push(
                        new K(this.f.o(), N.je, new Date().valueOf(), n, t)
                      ),
                      (a.h = Ae(this.b, a.j)),
                      a)
                  : (D.info(
                      "This in-app message button has already received a click. Ignoring analytics event."
                    ),
                    a);
              }),
              (t.Pb = function (e, t, a) {
                var n = new Pa(),
                  i = wi(this.D);
                return e.fb(a)
                  ? (null == (e = Ln(e)) ||
                      ((a = N.ke),
                      null != t && ((e.bid = t), (a = N.je)),
                      n.j.push(
                        new K(this.f.o(), a, new Date().valueOf(), i, e)
                      ),
                      (n.h = Ae(this.b, n.j))),
                    n)
                  : (D.info(
                      "This in-app message has already received a click. Ignoring analytics event."
                    ),
                    n);
              }),
              (t.M = function (e, t) {
                var a = new Pa(),
                  n = wi(this.D);
                return (
                  (e = { trigger_ids: [e], error_code: t }),
                  a.j.push(new K(this.f.o(), N.cg, new Date().valueOf(), n, e)),
                  (a.h = Ae(this.b, a.j)),
                  a
                );
              }),
              (t.Ma = function (e, t) {
                for (
                  var a = new Pa(),
                    n = wi(this.D),
                    i = [],
                    o = [],
                    r = t ? Te(this.b, ze.ib) || {} : Te(this.b, ze.vb) || {},
                    s = 0;
                  s < e.length;
                  s++
                )
                  e[s].Od(),
                    e[s] instanceof vt ? o.push(e[s]) : i.push(e[s]),
                    (r[e[s].id] = !0);
                return (
                  (e = Bn(i)),
                  (o = Bn(o)),
                  (null == e && null == o) ||
                    (Ne(this.b, t ? ze.ib : ze.vb, r),
                    null != e &&
                      a.j.push(
                        new K(
                          this.f.o(),
                          t ? N.Jf : N.Gf,
                          new Date().valueOf(),
                          n,
                          e
                        )
                      ),
                    null != o &&
                      t &&
                      a.j.push(
                        new K(this.f.o(), N.Lf, new Date().valueOf(), n, o)
                      ),
                    (a.h = Ae(this.b, a.j))),
                  a
                );
              }),
              (t.La = function (e, t) {
                var a = new Pa(),
                  n = wi(this.D);
                if ((e.fb(), null == e.url || "" === e.url))
                  return (
                    D.info(
                      "Card " +
                        e.id +
                        " has no url. Not logging click to Braze servers."
                    ),
                    a
                  );
                if (t) {
                  var i = Te(this.b, ze.hb) || {};
                  (i[e.id] = !0), Ne(this.b, ze.hb, i);
                }
                return (
                  null == (e = Bn([e])) ||
                    (a.j.push(
                      new K(
                        this.f.o(),
                        t ? N.Hf : N.Ff,
                        new Date().valueOf(),
                        n,
                        e
                      )
                    ),
                    (a.h = Ae(this.b, a.j))),
                  a
                );
              }),
              (t.Hc = function (e) {
                var t = new Pa(),
                  a = wi(this.D);
                if (!e.Nd())
                  return (
                    D.info(
                      "Card " +
                        e.id +
                        " refused this dismissal. Ignoring analytics event."
                    ),
                    t
                  );
                var n = Te(this.b, ze.ua) || {};
                return (
                  (n[e.id] = !0),
                  Ne(this.b, ze.ua, n),
                  null == (e = Bn([e])) ||
                    (t.j.push(
                      new K(this.f.o(), N.If, new Date().valueOf(), a, e)
                    ),
                    (t.h = Ae(this.b, t.j))),
                  t
                );
              }),
              (t.zd = function (e) {
                for (var t = (e = o(e)).next(); !t.done; t = e.next())
                  (t = t.value), -1 === this.Eb.indexOf(t) && this.Eb.push(t);
              });
            var Yn = {
              BROWSER: "browser",
              BROWSER_VERSION: "browserVersion",
              OS: "os",
              RESOLUTION: "resolution",
              LANGUAGE: "language",
              TIME_ZONE: "timeZone",
              USER_AGENT: "userAgent",
            };
            function Jn(e) {
              this.id = e;
            }
            function Zn(e, t) {
              (this.b = e), null == t && (t = L(Yn)), (this.De = t);
            }
            function $n(e) {
              var t = Se(e.b, Ie.Uc);
              null == t && ((t = new q(v.Ia())), ke(e.b, Ie.Uc, t)),
                (t = new Jn(t.ia));
              for (var a = 0; a < e.De.length; a++) {
                var n = e.De[a];
                switch (n) {
                  case "browser":
                    t[n] = xe.Ya;
                    break;
                  case "browserVersion":
                    t[n] = xe.version;
                    break;
                  case "os":
                    var i = xe.ga
                      ? xe.ga || null
                      : (i = Te(e.b, ze.cc)) && i.os_version
                      ? i.os_version
                      : xe.qb();
                    t[n] = i;
                    break;
                  case "resolution":
                    t[n] = screen.width + "x" + screen.height;
                    break;
                  case "language":
                    t[n] = xe.language;
                    break;
                  case "timeZone":
                    e: {
                      if (
                        ((i = new Date()),
                        "undefined" !== typeof Intl &&
                          "function" === typeof Intl.DateTimeFormat)
                      )
                        try {
                          if (
                            "function" ===
                            typeof Intl.DateTimeFormat().resolvedOptions
                          ) {
                            var o =
                              Intl.DateTimeFormat().resolvedOptions().timeZone;
                            if (null != o && "" !== o) {
                              var r = o;
                              break e;
                            }
                          }
                        } catch (c) {
                          D.info(
                            "Intl.DateTimeFormat threw an error, probably https://bugs.chromium.org/p/chromium/issues/detail?id=811403, falling back to GTM offset: " +
                              c.message
                          );
                        }
                      (r = i.getTimezoneOffset()), (i = parseInt(r / 60));
                      var s = parseInt(r % 60),
                        l = "GMT";
                      0 !== r &&
                        (l =
                          l +
                          (0 > r ? "+" : "-") +
                          ("00" + Math.abs(i)).slice(-2) +
                          ":" +
                          ("00" + Math.abs(s)).slice(-2)),
                        (r = l);
                    }
                    t[n] = r;
                    break;
                  case "userAgent":
                    t[n] = xe.userAgent;
                }
              }
              return t;
            }
            function Qn(e) {
              (this.Fa = e),
                (this.wc = null),
                (this.Re = "geolocation" in navigator);
            }
            function ei(e) {
              e.Re
                ? null != e.wc &&
                  (navigator.geolocation.clearWatch(e.wc),
                  (e.wc = null),
                  D.info("Stopped watching Geolocation"))
                : D.info(e.ed);
            }
            function ti(e, t, a, n, i) {
              (this.endpoint = e || null),
                (this.Ze = t || null),
                (this.publicKey = a || null),
                (this.Wh = n || null),
                (this.ra = i || null);
            }
            function ai(e, t, a, n, i, o, r, s, l, c) {
              (this.Fa = e),
                (this.$ = t),
                (this.mc = a),
                (this.Jg = n),
                (this.Pe = i || "/service-worker.js"),
                (this.Ne = o),
                (this.J = r),
                (this.rd = s || !1),
                (this.Hg = l || !1),
                (this.b = c),
                (this.vc =
                  "serviceWorker" in navigator &&
                  "undefined" !== typeof ServiceWorkerRegistration &&
                  "showNotification" in ServiceWorkerRegistration.prototype &&
                  "PushManager" in window),
                (this.vd =
                  "safari" in window && "pushNotification" in window.safari);
            }
            function ni(e, t, a, n, i, o) {
              t.unsubscribe()
                .then(function (t) {
                  t
                    ? li(e, a, n, i, o)
                    : (D.error("Failed to unsubscribe device from push."),
                      "function" === typeof o && o(!1));
                })
                .catch(function (e) {
                  D.error("Push unsubscription error: " + e),
                    "function" === typeof o && o(!1);
                });
            }
            function ii(e, t, a, n) {
              var i = (function (e) {
                  if ("string" === typeof e) return e;
                  if (
                    0 !==
                    e.endpoint.indexOf(
                      "https://android.googleapis.com/gcm/send"
                    )
                  )
                    return e.endpoint;
                  var t = e.endpoint;
                  return (
                    e.subscriptionId &&
                      -1 === e.endpoint.indexOf(e.subscriptionId) &&
                      (t = e.endpoint + "/" + e.subscriptionId),
                    t
                  );
                })(t),
                o = null,
                r = null;
              if (null != t.getKey)
                try {
                  (o = btoa(
                    String.fromCharCode.apply(
                      null,
                      new Uint8Array(t.getKey("p256dh"))
                    )
                  )),
                    (r = btoa(
                      String.fromCharCode.apply(
                        null,
                        new Uint8Array(t.getKey("auth"))
                      )
                    ));
                } catch (s) {
                  if ("invalid arguments" !== s.message) throw s;
                }
              (t = (function (e) {
                var t;
                return e.options &&
                  (t = e.options.applicationServerKey) &&
                  t.byteLength &&
                  0 < t.byteLength
                  ? btoa(String.fromCharCode.apply(null, new Uint8Array(t)))
                      .replace(/\+/g, "-")
                      .replace(/\//g, "_")
                  : null;
              })(t)),
                e.Fa.Pd(i, n, o, r, t),
                i && "function" === typeof a && a(i, o, r);
            }
            function oi(e, t, a) {
              e.Fa.Sb(!1), D.info(t), "function" === typeof a && a(!1);
            }
            function ri(e, t, a, n, i) {
              if ("default" === a.permission)
                try {
                  window.safari.pushNotification.requestPermission(
                    e.Jg,
                    t,
                    { api_key: e.$, device_id: $n(e.mc).id },
                    function (a) {
                      "granted" === a.permission && e.Fa.Ud("opted_in"),
                        ri(e, t, a, n, i);
                    }
                  );
                } catch (o) {
                  oi(e, "Could not request permission for push: " + o, i);
                }
              else
                "denied" === a.permission
                  ? oi(
                      e,
                      "The user has blocked notifications from this site, or Safari push is not configured in the Braze dashboard.",
                      i
                    )
                  : "granted" === a.permission &&
                    (D.info("Device successfully subscribed to push."),
                    ii(e, a.deviceToken, n, new Date()));
            }
            function si(e, t, a) {
              function n(n) {
                switch (n) {
                  case "granted":
                    "function" === typeof e && e();
                    break;
                  case "default":
                    "function" === typeof t && t();
                    break;
                  case "denied":
                    "function" === typeof a && a();
                    break;
                  default:
                    D.error("Received unexpected permission result " + n);
                }
              }
              var i = !1,
                o = window.Notification.requestPermission(function (e) {
                  i && n(e);
                });
              o
                ? o.then(function (e) {
                    n(e);
                  })
                : (i = !0);
            }
            function li(e, t, a, n, i) {
              var o = { userVisibleOnly: !0 };
              null != a && (o.applicationServerKey = a),
                t.pushManager
                  .subscribe(o)
                  .then(function (t) {
                    D.info("Device successfully subscribed to push."),
                      ii(e, t, n, new Date());
                  })
                  .catch(function (t) {
                    e.Ka()
                      ? (D.info(
                          "Permission for push notifications was denied."
                        ),
                        "function" === typeof i && i(!1))
                      : D.error("Push subscription failed: " + t);
                  });
            }
            function ci(e) {
              return e.rd
                ? navigator.serviceWorker.getRegistration()
                : navigator.serviceWorker.register(e.Pe).then(function () {
                    return navigator.serviceWorker.ready.then(function (e) {
                      return (
                        e &&
                          "function" === typeof e.update &&
                          e.update().catch(function (e) {
                            D.info("ServiceWorker update failed: " + e);
                          }),
                        e
                      );
                    });
                  });
            }
            function ui(e, t, a, n, i, o, r) {
              (this.Nb = e || 0),
                (this.cf = t || []),
                (this.Ve = a || []),
                (this.mf = n || []),
                (this.Ld = i),
                (null != i && "" !== i) || (this.Ld = null),
                (this.ra = o || null),
                (this.Hb = r || {});
            }
            function bi(e) {
              (this.b = e),
                (this.xd = new Ge()),
                (this.Ae = new Ge()),
                (this.uc = null);
            }
            function pi(e) {
              if (null == e.uc) {
                var t = Te(e.b, ze.te);
                if (null != t) {
                  var a = t.l;
                  "3.5.0" !== t.s && (a = 0),
                    (t = new ui(a, t.e, t.a, t.p, t.m, t.v, t.c));
                } else t = new ui();
                e.uc = t;
              }
              return e.uc;
            }
            function di(e, t) {
              (t = je(e.xd, t)), e.Be && e.xd.N(e.Be), (e.Be = t);
            }
            function hi(e, t) {
              je(e.Ae, t);
            }
            function fi(e, t) {
              return -1 !== pi(e).Ve.indexOf(t);
            }
            function gi(e, t, a, n) {
              (this.b = e),
                (this.f = t),
                (this.J = a),
                (this.Cb = 1e3),
                (n = parseFloat(n)),
                isNaN(n) && (n = 1800),
                n < this.Cb / 1e3 &&
                  (D.info(
                    "Specified session timeout of " +
                      n +
                      "s is too small, using the minimum session timeout of " +
                      this.Cb / 1e3 +
                      "s instead."
                  ),
                  (n = this.Cb / 1e3)),
                (this.Lg = n);
            }
            function mi(e, t, a) {
              return new K(e.f.o(), N.yg, t, a.ia, { d: F(t - a.Ib) });
            }
            function vi(e) {
              var t = new Date().valueOf(),
                a = pi(e.J).Ld,
                n = Te(e.b, ze.hc);
              return (
                (null == n || null != a) &&
                ((a = null == n || t - n > 1e3 * a) && Ne(e.b, ze.hc, t), a)
              );
            }
            function wi(e) {
              var t = new Date().valueOf(),
                a = t + 1e3 * e.Lg,
                n = Se(e.b, Ie.Ta);
              if (null == n || (!(t - n.Ib < e.Cb) && n.Cd < t)) {
                var i = "Generating session start event with time " + t;
                if (null != n) {
                  var o = n.Ob;
                  o - n.Ib < e.Cb && (o = n.Ib + e.ai),
                    null == (n = mi(e, o, n)) || Ae(e.b, [n]),
                    (i += " (old session ended " + o + ")");
                }
                return (
                  (i += ". Will expire " + a.valueOf()),
                  D.info(i),
                  (a = new q(v.Ia(), a)),
                  null == (i = new K(e.f.o(), N.ve, t, a.ia)) || Ae(e.b, [i]),
                  ke(e.b, Ie.Ta, a),
                  null == Te(e.b, ze.hc) && Ne(e.b, ze.hc, t),
                  a.ia
                );
              }
              return (n.Ob = t), (n.Cd = a), ke(e.b, Ie.Ta, n), n.ia;
            }
            function xi(e, t) {
              var a = !1;
              try {
                if (localStorage && localStorage.getItem)
                  try {
                    localStorage.setItem(ze.jd, !0),
                      localStorage.getItem(ze.jd) &&
                        (localStorage.removeItem(ze.jd), (a = !0));
                  } catch (n) {
                    if (
                      ("QuotaExceededError" !== n.name &&
                        "NS_ERROR_DOM_QUOTA_REACHED" !== n.name) ||
                      !(0 < localStorage.length)
                    )
                      throw n;
                    a = !0;
                  }
              } catch (n) {
                D.info("Local Storage not supported!");
              }
              return new ye(
                (t = new Fe(
                  e,
                  (navigator.cookieEnabled ||
                    ("cookie" in document &&
                      (0 < document.cookie.length ||
                        -1 <
                          (document.cookie = "test").indexOf.call(
                            document.cookie,
                            "test"
                          )))) &&
                    !t,
                  a
                )),
                a ? new Pe(e) : new Be()
              );
            }
            function yi(e, t) {
              (this.J = e), (this.b = t);
            }
            function ki(e, t, a) {
              return Oe(e.b, e.o(), t, a);
            }
            function Ei(e, t, a) {
              (this.b = e),
                (this.Db = t || !1),
                (this.ze = a),
                (this.td = new Ge()),
                (this.ye = 1);
            }
            function Si(e, t) {
              je(e.td, t);
            }
            function Ai() {}
            function Ci(e, t, a, n, i) {
              (this.ha = e),
                (this.H = t),
                (this.b = a),
                (this.J = n),
                (this.Eg = i),
                (this.Aa = this.Da = 0),
                this.Ga();
            }
            function Ni(e, t) {
              if (Di(e)) {
                e.Ga();
                var a = e.B.slice();
                e.H.rb().o(function (n) {
                  for (var i = 0; i < t.length; i++)
                    if (
                      n === t[i].userId ||
                      (null == n && null == t[i].userId)
                    ) {
                      for (
                        var o = t[i].card, r = null, s = 0;
                        s < e.B.length;
                        s++
                      )
                        if (o.id === e.B[s].id) {
                          r = e.B[s];
                          break;
                        }
                      if (null == r) null != (o = st(o)) && a.push(o);
                      else if (!rt(r, o))
                        for (r = 0; r < a.length; r++)
                          if (o.id === a[r].id) {
                            a.splice(r, 1);
                            break;
                          }
                    }
                  (e.B = _i(e, Ti(e, a, !1))), e.yc(), He(e.ha, e.pb(!0));
                });
              }
            }
            function Ti(e, t, a) {
              for (
                var n = Te(e.b, ze.hb) || {},
                  i = Te(e.b, ze.ib) || {},
                  o = Te(e.b, ze.ua) || {},
                  r = {},
                  s = {},
                  l = {},
                  c = 0;
                c < t.length;
                c++
              )
                n[t[c].id] && ((t[c].clicked = !0), (r[t[c].id] = !0)),
                  i[t[c].id] && ((t[c].viewed = !0), (s[t[c].id] = !0)),
                  o[t[c].id] && ((t[c].dismissed = !0), (l[t[c].id] = !0));
              return (
                a && (Ne(e.b, ze.hb, r), Ne(e.b, ze.ib, s), Ne(e.b, ze.ua, l)),
                t
              );
            }
            function _i(e, t) {
              for (
                var a = [],
                  n = new Date(),
                  i = Te(e.b, ze.ua) || {},
                  o = !1,
                  r = 0;
                r < t.length;
                r++
              ) {
                var s = t[r].url;
                !e.Eg && s && wa(s)
                  ? D.error(
                      'Card with url "' +
                        s +
                        '" will not be displayed because Javascript URLs are disabled. Use the "allowUserSuppliedJavascript" option for appboy.initialize to enable this card.'
                    )
                  : (null == t[r].expiresAt || t[r].expiresAt >= n) &&
                    !t[r].dismissed
                  ? a.push(t[r])
                  : (o = i[t[r].id] = !0);
              }
              return o && Ne(e.b, ze.ua, i), a;
            }
            function Di(e) {
              return (
                !!pi(e.J).Hb.enabled ||
                (0 !== pi(e.J).Nb &&
                  (He(e.ha, new za([], new Date().valueOf())), _e(e.b, ze.wb)),
                !1)
              );
            }
            function Oi(e, t) {
              (this.ha = e), (this.b = t), this.Ga();
            }
            function Mi(e, t, a, n, i) {
              (this.Pa = e),
                (this.zf = t),
                (this.yf = a),
                (this.Ec = n),
                (this.Oa = i);
            }
            function Ii(e, t, a, n, i) {
              return null == e || null == e.trigger_id
                ? null
                : new Mi(e.trigger_id, t, a, n, i);
            }
            function zi(e, t, a, n) {
              (this.Ig = e),
                (this.ha = t),
                (this.b = a),
                (this.H = n),
                (this.oc = []),
                (this.na = []),
                (this.Ba = null),
                (this.L = {}),
                (this.Y = {}),
                Ui(this),
                Ri(this);
            }
            function Pi(e) {
              (e.Ba = Te(e.b, ze.ad) || e.Ba),
                (e.L = Te(e.b, ze.zb) || e.L),
                (e.Y = Te(e.b, ze.fc) || e.Y);
              for (var t = 0; t < e.T.length; t++) {
                var a = e.T[t];
                null != e.Y[a.id] && (a.Ca = e.Y[a.id]);
              }
            }
            function Ui(e) {
              e.wd = Te(e.b, ze.md) || 0;
              for (
                var t = Te(e.b, ze.kd) || [], a = [], n = 0;
                n < t.length;
                n++
              )
                a.push(En(t[n]));
              (e.T = a), Pi(e);
            }
            function Ri(e) {
              function t(t, a, n, i, o) {
                return function () {
                  Li(e, t, a, n, i, o);
                };
              }
              for (var a = {}, n = 0; n < e.T.length; n++)
                a[e.T[n].id] = e.T[n];
              n = !1;
              for (var i = 0; i < e.T.length; i++) {
                var o = e.T[i];
                if (null != e.L[o.id]) {
                  for (var r = e.L[o.id], s = [], l = 0; l < r.length; l++) {
                    var c = r[l],
                      u = Math.max(c.Ec + 1e3 * o.ab - new Date().valueOf(), 0);
                    if (0 < u) {
                      s.push(c);
                      var b = void 0,
                        p = void 0;
                      null != c.wf && (b = c.wf),
                        null != c.yd && W(c.yd) && (p = X(c.yd));
                      var d = [];
                      if (I(c.Dd))
                        for (var h = 0; h < c.Dd.length; h++) {
                          var f = a[c.Dd[h]];
                          null != f && d.push(f);
                        }
                      e.na.push(setTimeout(t(o, c.Ec, b, p, d), u));
                    }
                  }
                  e.L[o.id].length > s.length &&
                    ((e.L[o.id] = s),
                    (n = !0),
                    0 === e.L[o.id].length && delete e.L[o.id]);
                }
              }
              n && Ne(e.b, ze.zb, e.L);
            }
            function Li(e, t, a, n, i, o) {
              function r() {
                Pi(e);
                var t = o.pop();
                if (null != t)
                  if ((Fi(e, t, a, n, i, o), kn(t, a))) {
                    var s =
                      "Server aborted in-app message display, but the timeout on fallback trigger " +
                      t.id +
                      "has already elapsed.";
                    0 < o.length && (s += " Continuing to fall back."),
                      D.info(s),
                      e.H.M(t.id, Dt.ie),
                      r();
                  } else
                    D.info(
                      "Server aborted in-app message display. Falling back to lower priority " +
                        t.type +
                        " trigger action " +
                        t.id
                    ),
                      0 < (s = 1e3 * t.ab - (new Date().valueOf() - a))
                        ? e.na.push(
                            setTimeout(function () {
                              Li(e, t, a, n, i, o);
                            }, s)
                          )
                        : Li(e, t, a, n, i, o);
              }
              function s(i) {
                Pi(e);
                var o = new Date().valueOf();
                kn(t, a)
                  ? t.type === An.we
                    ? e.H.M(t.id, Dt.yb)
                    : e.H.M(t.id, Dt.ie)
                  : !1 === navigator.onLine && t.type === An.Xc && i.imageUrl
                  ? (D.info(
                      "Not showing " +
                        t.type +
                        " trigger action " +
                        t.id +
                        " due to offline state."
                    ),
                    e.H.M(t.id, Dt.Vf))
                  : (null == t.Ca || (t.Rb !== Sn && o - t.Ca >= 1e3 * t.Rb)) &&
                    Bi(e, t, o, n)
                  ? (He(e.ha, [i]),
                    Pi(e),
                    (t.Ca = o),
                    (e.Ba = o),
                    Ne(e.b, ze.ad, o),
                    (e.Y[t.id] = o),
                    Ne(e.b, ze.fc, e.Y))
                  : D.info(
                      "Not displaying trigger " +
                        t.id +
                        " because display time fell outside of the acceptable time window."
                    );
              }
              switch (t.type) {
                case An.Xc:
                  var l = At(t.data);
                  if (null == l) {
                    D.error(
                      "Could not parse trigger data for trigger " +
                        t.id +
                        ", ignoring."
                    ),
                      e.H.M(t.id, Dt.Ab);
                    break;
                  }
                  s(l);
                  break;
                case An.we:
                  if (null == (l = Ii(t.data, s, r, a, t.Oa))) {
                    D.error(
                      "Could not parse trigger data for trigger " +
                        t.id +
                        ", ignoring."
                    ),
                      e.H.M(t.id, Dt.Ab);
                    break;
                  }
                  Pn(e.H, l, n, i);
                  break;
                default:
                  D.error(
                    "Trigger " +
                      t.id +
                      " was of unexpected type " +
                      t.type +
                      ", ignoring."
                  ),
                    e.H.M(t.id, Dt.Ab);
              }
            }
            function Bi(e, t, a, n) {
              return (
                null == e.Ba ||
                (n === rn.V
                  ? (D.info(
                      "Ignoring minimum interval between trigger because it is a test type."
                    ),
                    !0)
                  : (null == (t = t.kf) && (t = e.Ig), a - e.Ba >= 1e3 * t))
              );
            }
            function Fi(e, t, a, n, i, o) {
              Pi(e), (e.L[t.id] = e.L[t.id] || []);
              var r,
                s = {};
              for (
                s.Ec = a,
                  s.wf = n,
                  null != i && (r = i.A()),
                  s.yd = r,
                  a = [],
                  n = 0;
                n < o.length;
                n++
              )
                a.push(o[n].id);
              (s.Dd = a), e.L[t.id].push(s), Ne(e.b, ze.zb, e.L);
            }
            (ie.DeviceProperties = Yn),
              (Jn.prototype.Ac = function () {
                var e = {};
                return (
                  null != this.browser && (e.browser = this.browser),
                  null != this.browserVersion &&
                    (e.browser_version = this.browserVersion),
                  null != this.os && (e.os_version = this.os),
                  null != this.resolution && (e.resolution = this.resolution),
                  null != this.language && (e.locale = this.language),
                  null != this.timeZone && (e.time_zone = this.timeZone),
                  null != this.userAgent && (e.user_agent = this.userAgent),
                  e
                );
              }),
              (Qn.prototype.Ng = function (e) {
                var t = this;
                if (document.hidden) {
                  ei(this);
                  var a = function () {
                    document.hidden ||
                      (document.removeEventListener("visibilitychange", a, !1),
                      t.watchPosition());
                  };
                  document.addEventListener("visibilitychange", a, !1);
                }
                this.Fa.Oc(
                  e.coords.latitude,
                  e.coords.longitude,
                  e.coords.accuracy,
                  e.coords.altitude,
                  e.coords.altitudeAccuracy
                );
              }),
              (Qn.prototype.Mg = function (e) {
                e.code === e.PERMISSION_DENIED
                  ? D.info(e.message)
                  : D.error(
                      "Could not detect user location: " +
                        e.code +
                        " - " +
                        e.message
                    );
              }),
              (Qn.prototype.watchPosition = function () {
                this.Re
                  ? (ei(this),
                    (this.wc = navigator.geolocation.watchPosition(
                      this.Ng.bind(this),
                      this.Mg.bind(this)
                    )),
                    D.info("Requested Geolocation"))
                  : D.info(this.ed);
              }),
              (ti.prototype.A = function () {
                return {
                  e: this.endpoint,
                  c: this.Ze,
                  p: this.publicKey,
                  u: this.Wh,
                  v: this.ra,
                };
              }),
              ((t = ai.prototype).qa = function () {
                return this.vc || this.vd;
              }),
              (t.Ka = function () {
                var e =
                    this.qa() &&
                    "Notification" in window &&
                    null != window.Notification &&
                    null != window.Notification.permission &&
                    "denied" === window.Notification.permission,
                  t =
                    this.qa() &&
                    (!("Notification" in window) ||
                      null == window.Notification);
                return e || t;
              }),
              (t.Mb = function () {
                return (
                  this.qa() &&
                  "Notification" in window &&
                  null != window.Notification &&
                  null != window.Notification.permission &&
                  "granted" === window.Notification.permission
                );
              }),
              (t.Id = function (e, t, a) {
                var n = this;
                (a = this.Ne || a),
                  this.qa()
                    ? this.vc
                      ? ci(this)
                          .then(function (a) {
                            n.Ka() || null == a
                              ? t()
                              : a.pushManager
                                  .getSubscription()
                                  .then(function (a) {
                                    a ? e() : t();
                                  })
                                  .catch(function () {
                                    t();
                                  });
                          })
                          .catch(function () {
                            t();
                          })
                      : null == a || "" === a
                      ? D.error(
                          "You must supply the safariWebsitePushId argument in order to use isPushGranted on Safari"
                        )
                      : "granted" ===
                        window.safari.pushNotification.permission(a).permission
                      ? e()
                      : t()
                    : t();
              }),
              (t.subscribe = function (e, t, a) {
                var n = this;
                if (((e = this.Ne || e), this.qa()))
                  if (this.vc) {
                    if (!this.rd && null != window.location) {
                      var i = this.Pe;
                      if (
                        (-1 === i.indexOf(window.location.host) &&
                          (i = window.location.host + i),
                        -1 === i.indexOf(window.location.protocol) &&
                          (i = window.location.protocol + "//" + i),
                        0 !==
                          window.location.href.indexOf(
                            i.substr(0, i.lastIndexOf("/") + 1)
                          ))
                      )
                        return void D.error(
                          "Cannot subscribe to push from a path higher than the service worker location (tried to subscribe from " +
                            window.location.pathname +
                            " but service worker is at " +
                            i +
                            ")"
                        );
                    }
                    if (this.Ka())
                      oi(
                        this,
                        "Notifications from this site are blocked. This may be a temporary embargo or a permanent denial.",
                        a
                      );
                    else if (this.J && !pi(this.J).ra && 0 === pi(this.J).Nb)
                      D.info(
                        "Waiting for VAPID key from server config before subscribing to push."
                      ),
                        di(this.J, function () {
                          n.subscribe(e, t, a);
                        });
                    else {
                      var o = this.Mb();
                      si(
                        function () {
                          o || n.Fa.Ud("opted_in"),
                            ci(n)
                              .then(function (e) {
                                null == e
                                  ? (D.error(
                                      "No service worker registration. Set the `manageServiceWorkerExternally` initialization option to false or ensure that your service worker is registered before calling registerAppboyPushMessages."
                                    ),
                                    "function" === typeof a && a())
                                  : e.pushManager
                                      .getSubscription()
                                      .then(function (i) {
                                        var o = null;
                                        if (
                                          (n.J &&
                                            null != pi(n.J).ra &&
                                            (o = m.Vh(pi(n.J).ra)),
                                          i)
                                        ) {
                                          var r = null,
                                            s = null,
                                            l = Te(n.b, ze.kc);
                                          if (l && !I(l)) {
                                            try {
                                              var c = new ti(
                                                l.e,
                                                H(l.c),
                                                l.p,
                                                l.u,
                                                l.v
                                              ).Ze;
                                            } catch (u) {
                                              c = null;
                                            }
                                            null == c ||
                                              isNaN(c.getTime()) ||
                                              0 === c.getTime() ||
                                              ((r = c),
                                              (s = new Date(r)).setMonth(
                                                r.getMonth() + 6
                                              ));
                                          }
                                          null != o &&
                                          i.options &&
                                          i.options.applicationServerKey &&
                                          i.options.applicationServerKey
                                            .byteLength &&
                                          0 <
                                            i.options.applicationServerKey
                                              .byteLength &&
                                          !B(
                                            o,
                                            new Uint8Array(
                                              i.options.applicationServerKey
                                            )
                                          )
                                            ? (12 <
                                              i.options.applicationServerKey
                                                .byteLength
                                                ? D.info(
                                                    "Device was already subscribed to push using a different VAPID provider, creating new subscription."
                                                  )
                                                : D.info(
                                                    "Attempting to upgrade a gcm_sender_id-based push registration to VAPID - depending on the browser this may or may not result in the same gcm_sender_id-based subscription."
                                                  ),
                                              ni(n, i, e, o, t, a))
                                            : i.expirationTime &&
                                              new Date(i.expirationTime) <=
                                                new Date().valueOf()
                                            ? (D.info(
                                                "Push subscription is expired, creating new subscription."
                                              ),
                                              ni(n, i, e, o, t, a))
                                            : l && I(l)
                                            ? ni(n, i, e, o, t, a)
                                            : null == s
                                            ? (D.info(
                                                "No push subscription creation date found, creating new subscription."
                                              ),
                                              ni(n, i, e, o, t, a))
                                            : s <= new Date().valueOf()
                                            ? (D.info(
                                                "Push subscription older than 6 months, creating new subscription."
                                              ),
                                              ni(n, i, e, o, t, a))
                                            : (D.info(
                                                "Device already subscribed to push, sending existing subscription to backend."
                                              ),
                                              ii(n, i, t, r));
                                        } else li(n, e, o, t, a);
                                      })
                                      .catch(function (e) {
                                        D.error(
                                          "Error checking current push subscriptions: " +
                                            e
                                        );
                                      });
                              })
                              .catch(function (e) {
                                D.error(
                                  "ServiceWorker registration failed: " + e
                                );
                              });
                        },
                        function () {
                          var e =
                            "Permission for push notifications was ignored.";
                          n.Ka() &&
                            (e +=
                              " The browser has automatically blocked further permission requests for a period (probably 1 week)."),
                            D.info(e),
                            "function" === typeof a && a(!0);
                        },
                        function () {
                          D.info(
                            "Permission for push notifications was denied."
                          ),
                            "function" === typeof a && a(!1);
                        }
                      );
                    }
                  } else
                    this.vd &&
                      (null == e || "" === e
                        ? D.error(
                            "You must supply the safariWebsitePushId argument in order to use registerAppboyPushMessages on Safari"
                          )
                        : ((i = window.safari.pushNotification.permission(e)),
                          ri(this, e, i, t, a)));
                else D.info(this.ed);
              }),
              (t.unsubscribe = function (e, t) {
                var a = this;
                this.qa()
                  ? this.vc
                    ? navigator.serviceWorker
                        .getRegistration()
                        .then(function (n) {
                          n &&
                            n.pushManager
                              .getSubscription()
                              .then(function (i) {
                                i &&
                                  (a.Fa.Sb(!0),
                                  i
                                    .unsubscribe()
                                    .then(function (i) {
                                      i
                                        ? (D.info(
                                            "Device successfully unsubscribed from push."
                                          ),
                                          "function" === typeof e && e())
                                        : (D.error(
                                            "Failed to unsubscribe device from push."
                                          ),
                                          "function" === typeof t && t()),
                                        a.rd ||
                                          (n.unregister(),
                                          D.info(
                                            "Service worker successfully unregistered."
                                          ));
                                    })
                                    .catch(function (e) {
                                      D.error(
                                        "Push unsubscription error: " + e
                                      ),
                                        "function" === typeof t && t();
                                    }));
                              })
                              .catch(function (e) {
                                D.error("Error unsubscribing from push: " + e),
                                  "function" === typeof t && t();
                              });
                        })
                    : this.vd &&
                      (this.Fa.Sb(!0),
                      D.info("Device unsubscribed from push."),
                      "function" === typeof e && e())
                  : D.info(this.ed);
              }),
              (ui.prototype.A = function () {
                return {
                  s: "3.5.0",
                  l: this.Nb,
                  e: this.cf,
                  a: this.Ve,
                  p: this.mf,
                  m: this.Ld,
                  v: this.ra,
                  c: this.Hb,
                };
              }),
              (gi.prototype.Kb = function () {
                var e = Se(this.b, Ie.Ta);
                return null == e ? null : e.ia;
              }),
              (yi.prototype.o = function () {
                var e = Se(this.b, Ie.lc);
                if (null == e) return null;
                var t = e.ia,
                  a = V(t);
                if (997 < a) {
                  for (; 997 < a; ) a = V((t = t.slice(0, t.length - 1)));
                  (e.ia = t), ke(this.b, Ie.lc, e);
                }
                return t;
              }),
              (yi.prototype.Sd = function (e, t) {
                if (fi(this.J, e))
                  return (
                    D.info(
                      'Custom Attribute "' + e + '" is blocklisted, ignoring.'
                    ),
                    !1
                  );
                var a = {};
                return (a[e] = t), ki(this, "custom", a);
              }),
              (yi.prototype.Pd = function (e, t, a, n, i) {
                ki(this, "push_token", e),
                  ki(this, "custom_push_public_key", a),
                  ki(this, "custom_push_user_auth", n),
                  ki(this, "custom_push_vapid_public_key", i);
                var o = _.ba,
                  r = new w(o);
                Ne(this.b, ze.kc, new ti(e, t, a, n, i).A()),
                  r.setItem(o.G.gd, o.kb, !0);
              }),
              (yi.prototype.Sb = function (e) {
                if (
                  (ki(this, "push_token", null),
                  ki(this, "custom_push_public_key", null),
                  ki(this, "custom_push_user_auth", null),
                  ki(this, "custom_push_vapid_public_key", null),
                  e)
                ) {
                  var t = new w((e = _.ba));
                  Ne(this.b, ze.kc, !1), t.setItem(e.G.gd, e.kb, !1);
                }
              }),
              (Ei.prototype.Tb = function (e) {
                var t = Te(this.b, ze.jb);
                Ne(this.b, ze.jb, e);
                var a = _.ba;
                new w(a).setItem(a.G.qe, this.ye, e), t !== e && He(this.td);
              }),
              (Ei.prototype.Xd = function (e) {
                return je(this.ze, e);
              }),
              (Ai.prototype.Lb = function () {}),
              (Ai.prototype.$a = function () {}),
              (Ai.prototype.clearData = function () {}),
              g(Ci, Ai),
              ((t = Ci.prototype).Ga = function () {
                for (
                  var e = Te(this.b, ze.wb) || [], t = [], a = 0;
                  a < e.length;
                  a++
                ) {
                  var n = lt(e[a]);
                  null != n && t.push(n);
                }
                (this.B = _i(this, Ti(this, t, !1))),
                  (this.Da = Te(this.b, ze.ac) || this.Da),
                  (this.Aa = Te(this.b, ze.$b) || this.Aa);
              }),
              (t.Lb = function (e) {
                if (Di(this) && null != e && e.cards) {
                  var t = e.full_sync;
                  t || this.Ga();
                  var a = e.cards,
                    n = e.last_full_sync_at;
                  if (((e = e.last_card_updated_at), t))
                    for (
                      var i = [], r = o(this.B), s = r.next();
                      !s.done;
                      s = r.next()
                    )
                      (s = s.value).test && i.push(s);
                  else i = this.B.slice();
                  for (r = 0; r < a.length; r++) {
                    s = a[r];
                    for (var l = null, c = 0; c < this.B.length; c++)
                      if (s.id === this.B[c].id) {
                        l = this.B[c];
                        break;
                      }
                    if (t)
                      (s = st(s)),
                        null != l && l.viewed && (s.viewed = !0),
                        null != s && i.push(s);
                    else if (null == l) null != (s = st(s)) && i.push(s);
                    else if (!rt(l, s))
                      for (l = 0; l < i.length; l++)
                        if (s.id === i[l].id) {
                          i.splice(l, 1);
                          break;
                        }
                  }
                  (this.B = _i(this, Ti(this, i, t))),
                    this.yc(),
                    (this.Da = n || 0),
                    Ne(this.b, ze.ac, this.Da),
                    (this.Aa = e || 0),
                    Ne(this.b, ze.$b, this.Aa),
                    He(this.ha, this.pb(!0));
                }
              }),
              (t.yc = function () {
                for (var e = [], t = 0; t < this.B.length; t++)
                  e.push(this.B[t].A());
                Ne(this.b, ze.wb, e);
              }),
              (t.Na = function (e, t) {
                if (Di(this))
                  return this.H.Na(this.Da, this.Aa, this.Lb.bind(this), e, t);
              }),
              (t.pb = function (e) {
                e || this.Ga(),
                  (e = _i(this, this.B)).sort(function (e, t) {
                    return e.pinned && !t.pinned
                      ? -1
                      : t.pinned && !e.pinned
                      ? 1
                      : e.updated > t.updated
                      ? -1
                      : t.updated > e.updated
                      ? 1
                      : 0;
                  });
                var t = Math.max(this.Aa || 0, this.Da || 0);
                return 0 === t && (t = void 0), new za(e, G(t));
              }),
              (t.$a = function (e) {
                e ||
                  ((this.B = []),
                  He(this.ha, new za(this.B.slice(), null)),
                  _e(this.b, ze.wb),
                  _e(this.b, ze.hb),
                  _e(this.b, ze.ib),
                  _e(this.b, ze.ua)),
                  (this.Aa = this.Da = 0),
                  _e(this.b, ze.ac),
                  _e(this.b, ze.$b);
              }),
              (t.clearData = function (e) {
                (this.Aa = this.Da = 0),
                  (this.B = []),
                  He(this.ha, new za(this.B.slice(), null)),
                  e &&
                    (_e(this.b, ze.wb),
                    _e(this.b, ze.hb),
                    _e(this.b, ze.ib),
                    _e(this.b, ze.ua),
                    _e(this.b, ze.ac),
                    _e(this.b, ze.$b));
              }),
              g(Oi, Ai),
              ((t = Oi.prototype).Ga = function () {
                for (
                  var e = Te(this.b, ze.dd) || [], t = [], a = 0;
                  a < e.length;
                  a++
                ) {
                  var n = lt(e[a]);
                  null != n && t.push(n);
                }
                (this.B = t), (this.mb = H(Te(this.b, ze.bd)));
              }),
              (t.yc = function () {
                for (var e = [], t = 0; t < this.B.length; t++)
                  e.push(this.B[t].A());
                Ne(this.b, ze.dd, e);
              }),
              (t.Lb = function (e) {
                if (null != e && e.feed) {
                  this.Ga(), (e = e.feed);
                  for (
                    var t, a = [], n = Te(this.b, ze.vb) || {}, i = {}, o = 0;
                    o < e.length;
                    o++
                  ) {
                    var r = (t = e[o]).id,
                      s = t.type,
                      l = t.viewed,
                      c = t.title,
                      u = t.image,
                      b = t.description,
                      p = G(t.created),
                      d = G(t.updated),
                      h = t.categories,
                      f = G(t.expires_at),
                      g = t.url,
                      m = t.domain,
                      v = t.aspect_ratio;
                    (t = t.extras),
                      null !=
                        (r =
                          s === bt.xe || s === bt.ic
                            ? new mt(
                                r,
                                l,
                                c,
                                u,
                                b,
                                p,
                                d,
                                h,
                                f,
                                g,
                                m,
                                v,
                                t,
                                !1,
                                !1
                              )
                            : s === bt.Yb
                            ? new gt(
                                r,
                                l,
                                c,
                                u,
                                b,
                                p,
                                d,
                                h,
                                f,
                                g,
                                m,
                                v,
                                t,
                                !1,
                                !1
                              )
                            : s === bt.Xb
                            ? new ft(r, l, u, p, d, h, f, g, m, v, t, !1, !1)
                            : null) &&
                        (n[r.id] && ((r.viewed = !0), (i[r.id] = !0)),
                        a.push(r));
                  }
                  Ne(this.b, ze.vb, i),
                    (this.B = a),
                    this.yc(),
                    (this.mb = new Date()),
                    Ne(this.b, ze.bd, this.mb),
                    He(this.ha, new Sa(this.B.slice(), this.mb));
                }
              }),
              (t.Fc = function () {
                this.Ga();
                for (var e = [], t = new Date(), a = 0; a < this.B.length; a++)
                  (null == this.B[a].expiresAt || this.B[a].expiresAt >= t) &&
                    e.push(this.B[a]);
                return new Sa(e, this.mb);
              }),
              (t.clearData = function (e) {
                null == e && (e = !1),
                  (this.B = []),
                  (this.mb = null),
                  e && (_e(this.b, ze.dd), _e(this.b, ze.bd)),
                  He(this.ha, new Sa(this.B.slice(), this.mb));
              }),
              g(zi, Ai),
              (zi.prototype.Lb = function (e) {
                var t = !1;
                if (null != e && e.triggers) {
                  Pi(this);
                  var a = {},
                    n = {};
                  this.T = [];
                  for (var i = 0; i < e.triggers.length; i++) {
                    for (
                      var o = e.triggers[i], r = o.id, s = [], l = 0;
                      l < o.trigger_condition.length;
                      l++
                    )
                      s.push(un(o.trigger_condition[l]));
                    l = G(o.start_time);
                    var c = G(o.end_time),
                      u = o.priority,
                      b = o.type,
                      p = o.delay,
                      d = o.re_eligibility,
                      h = o.timeout,
                      f = o.data;
                    for (
                      o = o.min_seconds_since_last_trigger,
                        r = M(
                          An,
                          b,
                          "Could not construct Trigger from server data",
                          "Trigger.Types"
                        )
                          ? new yn(r, s, l, c, u, b, f, p, d, h, o)
                          : null,
                        null != this.Y[r.id] &&
                          ((r.Ca = this.Y[r.id]), (a[r.id] = this.Y[r.id])),
                        null != this.L[r.id] && (n[r.id] = this.L[r.id]),
                        s = 0;
                      s < r.ob.length;
                      s++
                    )
                      if (ln(r.ob[s], rn.V, null)) {
                        t = !0;
                        break;
                      }
                    null != r && this.T.push(r);
                  }
                  for (
                    B(this.Y, a) || ((this.Y = a), Ne(this.b, ze.fc, this.Y)),
                      B(this.L, n) || ((this.L = n), Ne(this.b, ze.zb, this.L)),
                      e = [],
                      a = 0;
                    a < this.T.length;
                    a++
                  )
                    e.push(this.T[a].A());
                  for (
                    this.wd = new Date().valueOf(),
                      Ne(this.b, ze.kd, e),
                      Ne(this.b, ze.md, this.wd),
                      t &&
                        (D.info(
                          "Trigger with test condition found, firing test."
                        ),
                        this.pa(rn.V)),
                      this.pa(rn.OPEN),
                      t = this.oc,
                      this.oc = [],
                      e = 0;
                    e < t.length;
                    e++
                  )
                    this.pa.apply(this, t[e]);
                }
              }),
              (zi.prototype.pa = function (e, t, a) {
                var n = this;
                if (M(rn, e, "Cannot fire trigger action.", "TriggerEvents"))
                  if (0 < this.H.lb)
                    D.info(
                      "Trigger sync is currently in progress, awaiting sync completion before firing trigger event."
                    ),
                      this.oc.push(arguments);
                  else {
                    (Te(this.b, ze.md) || 0) > this.wd ? Ui(this) : Pi(this);
                    for (
                      var i = new Date().valueOf(),
                        o = i - this.Ba,
                        r = !0,
                        s = !0,
                        l = [],
                        c = 0;
                      c < this.T.length;
                      c++
                    ) {
                      var u = this.T[c],
                        b = i + 1e3 * u.ab;
                      if (
                        (null == u.Ca ||
                          (u.Rb !== Sn && b - u.Ca >= 1e3 * u.Rb)) &&
                        (null == u.startTime || u.startTime <= i) &&
                        (null == u.endTime || u.endTime >= i)
                      ) {
                        for (var p = !1, d = 0; d < u.ob.length; d++)
                          if (ln(u.ob[d], e, t)) {
                            p = !0;
                            break;
                          }
                        p &&
                          ((r = !1),
                          Bi(this, u, b, e) && ((s = !1), l.push(u)));
                      }
                    }
                    if (r)
                      D.info(
                        "Trigger event " +
                          e +
                          " did not match any trigger conditions."
                      );
                    else if (s)
                      D.info(
                        "Ignoring " +
                          e +
                          " trigger event because a trigger was displayed " +
                          o / 1e3 +
                          "s ago."
                      );
                    else {
                      l.sort(function (e, t) {
                        return e.priority - t.priority;
                      });
                      var h = l.pop();
                      null != h &&
                        (D.info(
                          "Firing " +
                            h.type +
                            " trigger action " +
                            h.id +
                            " from trigger event " +
                            e +
                            "."
                        ),
                        Fi(this, h, i, e, a, l),
                        0 === h.ab
                          ? Li(this, h, i, e, a, l)
                          : this.na.push(
                              setTimeout(function () {
                                Li(n, h, i, e, a, l);
                              }, 1e3 * h.ab)
                            ));
                    }
                  }
              }),
              (zi.prototype.$a = function (e) {
                if (((this.T = []), _e(this.b, ze.kd), !e)) {
                  for (
                    this.oc = [],
                      this.Ba = null,
                      this.Y = {},
                      this.L = {},
                      e = 0;
                    e < this.na.length;
                    e++
                  )
                    clearTimeout(this.na[e]);
                  (this.na = []),
                    _e(this.b, ze.ad),
                    _e(this.b, ze.fc),
                    _e(this.b, ze.zb),
                    _e(this.b, ze.hg),
                    _e(this.b, ze.gg),
                    _e(this.b, ze.ig);
                }
              }),
              (zi.prototype.clearData = function () {
                (this.T = []), (this.Ba = null), (this.Y = {}), (this.L = {});
                for (var e = 0; e < this.na.length; e++)
                  clearTimeout(this.na[e]);
                this.na = [];
              });
            var Gi = {
              GOOGLE_TAG_MANAGER: "gg",
              MPARTICLE: "mp",
              SEGMENT: "sg",
              TEALIUM: "tl",
              MANUAL: "manu",
              NPM: "npm",
              CDN: "wcd",
            };
            (ie.BrazeSdkMetadata = Gi),
              "undefined" === typeof console &&
                (window.console = { log: function () {} });
            var ji,
              Hi = window.Element.prototype;
            if (
              ("function" !== typeof Hi.matches &&
                (Hi.matches =
                  Hi.msMatchesSelector ||
                  Hi.mozMatchesSelector ||
                  Hi.webkitMatchesSelector ||
                  function (e) {
                    e = (this.document || this.ownerDocument).querySelectorAll(
                      e
                    );
                    for (var t = 0; e[t] && e[t] !== this; ) ++t;
                    return !!e[t];
                  }),
              Element.prototype.closest ||
                (Element.prototype.closest = function (e) {
                  var t = this;
                  if (!document.documentElement.contains(t)) return null;
                  do {
                    if (t.matches(e)) return t;
                    t = t.parentElement || t.parentNode;
                  } while (null !== t && 1 === t.nodeType);
                  return null;
                }),
              "function" !== typeof window.CustomEvent)
            ) {
              var Ki = function (e, t) {
                t = t || { bubbles: !1, cancelable: !1, detail: null };
                var a = document.createEvent("CustomEvent");
                return (
                  a.initCustomEvent(e, t.bubbles, t.cancelable, t.detail), a
                );
              };
              (Ki.prototype = window.Event.prototype),
                (window.CustomEvent = Ki);
            }
            e.exports
              ? (ji = e.exports)
              : (window.appboy || (window.appboy = {}), (ji = window.appboy));
            var Wi,
              Xi = ji,
              qi = new (function (e) {
                function t(e, t, a) {
                  (e = "The '" + e + "' " + t + " is deprecated."),
                    a && (e += " Please use '" + a + "' instead."),
                    D.warn(e);
                }
                function a() {
                  D.Jb(),
                    P &&
                      (He(N),
                      N.K(),
                      h.clearData(!1),
                      (h = null),
                      m.clearData(!1),
                      (m = null),
                      d.K(),
                      (d = null),
                      x.K(),
                      (x = null),
                      f.K(),
                      (f = null),
                      b.K(),
                      (b = null),
                      c.Jb(),
                      (y = c = null),
                      ei(k),
                      (u = i = s = k = null),
                      (z = []),
                      (l = null)),
                    (U = P = !1);
                }
                function n() {
                  if (U) return !1;
                  if (!P)
                    throw Error(
                      "Appboy must be initialized before calling methods."
                    );
                  return !0;
                }
                null == e &&
                  (e = {
                    Ug: function (e, t, a) {
                      return new Ei(e, t, a);
                    },
                    Wg: function (e, t) {
                      return new Zn(e, t);
                    },
                    $g: function (e, t, a, n, i, o, r, s, l, c) {
                      null == i && (i = {});
                      var u = new yi(l, r),
                        b = new gi(r, u, l, i[O.xg]);
                      return new Tn(e, a, n, i[O.Cf], t, b, s, u, l, r, o, c);
                    },
                    Bc: function () {
                      return new Ge();
                    },
                    Xg: function (e, t) {
                      return new Oi(e, t);
                    },
                    Vg: function (e, t, a, n) {
                      return new Ci(e, t, a, n);
                    },
                    ah: function (e, t, a, n) {
                      return new zi(e, t, a, n);
                    },
                    Zg: function (e, t, a, n, i, o, r) {
                      return (
                        null == i && (i = {}),
                        new ai(
                          e,
                          t,
                          a,
                          n + "/safari/" + t,
                          i[O.wg],
                          i[O.ug],
                          o,
                          i[O.mg],
                          i[O.Wf],
                          r
                        )
                      );
                    },
                    Yg: function (e) {
                      return new Qn(e);
                    },
                  });
                var i,
                  r,
                  s,
                  l,
                  c,
                  u,
                  b,
                  p,
                  d,
                  h,
                  f,
                  g,
                  m,
                  x,
                  y,
                  k,
                  C = new Ge(),
                  N = new Ge(),
                  z = [],
                  P = !1,
                  U = !1;
                return {
                  Oh: function (e) {
                    return je(C, e);
                  },
                  Nh: function (e) {
                    return je(N, e);
                  },
                  Hd: function (a, n) {
                    if (P)
                      return (
                        D.info(
                          "Braze has already been initialized with an API key."
                        ),
                        !0
                      );
                    if (
                      (D.Gd(null != n && n[O.Yf]),
                      null == a || "" === a || "string" !== typeof a)
                    )
                      return (
                        D.error(
                          "Braze requires a valid API key to be initialized."
                        ),
                        !1
                      );
                    if (((i = a), (s = n || {}), xe.lh && !s[O.Af]))
                      return (
                        D.info(
                          "Ignoring activity from crawler bot " +
                            navigator.userAgent
                        ),
                        (U = !0),
                        !1
                      );
                    r = n = xi(a, s[O.ng] || !1);
                    var v = new Ue(null, !0);
                    if (v.Z("ab.optOut"))
                      return (
                        D.info("Ignoring all activity due to previous opt out"),
                        v.store(
                          "ab.optOut",
                          "This-cookie-will-expire-in-" + Re(v)
                        ),
                        (U = !0),
                        !1
                      );
                    for (var w = (v = o(R(s))).next(); !w.done; w = v.next())
                      (w = w.value),
                        -1 === L(O).indexOf(w) &&
                          D.warn(
                            "Ignoring unknown initialization option '" +
                              w +
                              "'."
                          );
                    (v = ["mparticle", "wordpress", "tealium"]),
                      null != s[O.re] &&
                        ((w = s[O.re]),
                        -1 !== v.indexOf(w)
                          ? (l = w)
                          : D.error("Invalid sdk flavor passed: " + w));
                    var E = [];
                    if (
                      ((d = e.Bc()),
                      z.push(d),
                      (h = e.Xg(d, n)),
                      E.push(h),
                      (x = e.Bc()),
                      z.push(x),
                      null == (v = s[O.Rc]) ||
                        "" === v ||
                        "string" !== typeof v)
                    )
                      return (
                        D.error(
                          "Braze requires a valid SDK Endpoint to be initialized. Please set the 'baseUrl' initialization option to the value of your SDK Endpoint."
                        ),
                        !1
                      );
                    if (
                      (0 !==
                        (v = v.replace(
                          /(\.[a-z]+)[^\.]*$/i,
                          "$1/api/v3"
                        )).indexOf("http") && (v = "https://" + v),
                      (w = s[O.ee] || s[O.Vc]),
                      s[O.Vc] && t(O.Vc, "initialization option", O.ee),
                      null != w)
                    )
                      if (I(w)) {
                        for (var S = [], A = 0; A < w.length; A++)
                          M(
                            Yn,
                            w[A],
                            "devicePropertyAllowlist contained an invalid value.",
                            "DeviceProperties"
                          ) && S.push(w[A]);
                        w = S;
                      } else
                        D.error(
                          "devicePropertyAllowlist must be an array. Defaulting to all properties."
                        ),
                          (w = null);
                    return (
                      (p = e.Wg(n, w)),
                      (w = new bi(n)),
                      (b = e.Bc()),
                      (u = e.Ug(n, s[O.Zf], b)),
                      z.push(b),
                      (c = e.$g(
                        i,
                        v,
                        "3.5.0",
                        l,
                        s,
                        function (e) {
                          if (P) for (var t = 0; t < E.length; t++) E[t].Lb(e);
                        },
                        n,
                        p,
                        w,
                        u
                      )),
                      null == (S = s[O.ag]) && (S = 30),
                      (m = e.ah(S, x, n, c)),
                      E.push(m),
                      (S = !0 === s[O.Zd] || !0 === s[O.fe]),
                      null != s.enableHtmlInAppMessages &&
                        t(
                          "enableHtmlInAppMessages",
                          "initialization option",
                          "allowUserSuppliedJavascript"
                        ),
                      (f = e.Bc()),
                      z.push(f),
                      (g = e.Vg(f, c, n, w, S)),
                      E.push(g),
                      hi(w, function () {
                        g.Na();
                      }),
                      jn(c, function () {
                        g.Na();
                      }),
                      c.Hd(),
                      (y = e.Zg(c.rb(), i, p, v, s, w, n)),
                      (k = e.Yg(c.rb())),
                      (n = "Initialized "),
                      s &&
                        s[O.Rc] &&
                        (n += 'for the Braze backend at "' + s[O.Rc] + '" '),
                      D.info(n + 'with API key "' + a + '".'),
                      (a = xe.language),
                      (n = !1),
                      s &&
                        (s[O.$c] &&
                          (t(O.$c, "initialization option", O.cd),
                          (a = s[O.$c]),
                          (n = !0)),
                        s[O.cd] && ((a = s[O.cd]), (n = !0))),
                      Ea(a, n),
                      He(C, s),
                      (P = !0)
                    );
                  },
                  Jb: function () {
                    D.info("Destroying appboy instance"), (r = null), a();
                  },
                  gh: function (e) {
                    n() &&
                      (null == e &&
                        D.error(
                          "getDeviceId must be supplied with a callback. e.g., appboy.getDeviceId(function(deviceId) {console.log('the device id is ' + deviceId)})"
                        ),
                      "function" === typeof e && e($n(p).id));
                  },
                  Yd: function () {
                    D.Yd();
                  },
                  Td: function (e) {
                    D.Td(e);
                  },
                  Lc: function () {
                    if (n()) {
                      c.Lc(y);
                      var e = _.ba,
                        t = new w(e);
                      E(t, e.G.oe, function (a, n) {
                        function i() {
                          m.pa(rn.ne, [r], s);
                        }
                        var o = n.lastClick,
                          r = n.trackingString;
                        D.info(
                          "Firing push click trigger from " +
                            r +
                            " push click at " +
                            o
                        );
                        var s = Xn(c, o, r);
                        Hn(c, i, i), S(t, e.G.oe, a);
                      }),
                        A(t, e.G.Ef, function (e) {
                          Ni(g, e);
                        }),
                        A(t, e.G.me, function (e) {
                          for (
                            var t = c, a = (e = o(e)).next();
                            !a.done;
                            a = e.next()
                          )
                            if ((a = a.value).api_key !== t.$) {
                              var n = _.ba;
                              new w(n).setItem(n.G.me, v.Ia(), a);
                            } else In(t, a);
                        });
                    }
                  },
                  $a: function (e, t) {
                    if (n())
                      if (null == e || 0 === e.length || e !== e)
                        D.error("changeUser requires a non-empty userId.");
                      else if (997 < V(e))
                        D.error(
                          'Rejected user id "' +
                            e +
                            '" because it is longer than 997 bytes.'
                        );
                      else {
                        if (
                          null != t &&
                          !Y(t, "set signature for new user", "signature", !1)
                        )
                          return !1;
                        c.$a(e.toString(), [h, g, m], y, t);
                      }
                  },
                  rb: function () {
                    if (n()) return c.rb();
                  },
                  ih: function () {
                    if (n()) return s[O.be];
                  },
                  tb: function (e) {
                    n() && c.tb(e);
                  },
                  Nc: function () {
                    n() && c.Nc();
                  },
                  uf: function (e) {
                    if (n()) return je(d, e);
                  },
                  Fc: function () {
                    if (n()) return h.Fc();
                  },
                  Na: function (e, t) {
                    if (n()) return g.Na(e, t);
                  },
                  tf: function (e) {
                    if (n()) return je(f, e);
                  },
                  pb: function () {
                    if (n()) return g.pb(!1);
                  },
                  Ph: function (e) {
                    if (n())
                      return (
                        t(
                          "subscribeToNewInAppMessages",
                          "method",
                          "subscribeToInAppMessage"
                        ),
                        je(x, e)
                      );
                  },
                  vf: function (e) {
                    if (n())
                      return "function" !== typeof e
                        ? null
                        : je(x, function (t) {
                            return e(t[0]), t.slice(1);
                          });
                  },
                  Qb: function (e) {
                    if (n())
                      return e instanceof yt || e instanceof ua
                        ? c.Qb(e).h
                        : (D.error(
                            "inAppMessage must be an InAppMessage object"
                          ),
                          !1);
                  },
                  Jc: function (e) {
                    if (n()) {
                      if (!(e instanceof yt))
                        return (
                          D.error(
                            "inAppMessage must be an InAppMessage object"
                          ),
                          !1
                        );
                      var t = c.Jc(e);
                      if (t.h)
                        for (var a = 0; a < t.j.length; a++)
                          m.pa(rn.ec, [e.triggerId], t.j[a]);
                      return t.h;
                    }
                  },
                  Ic: function (e, t) {
                    if (n()) {
                      if (!(e instanceof la))
                        return (
                          D.error(
                            "button must be an InAppMessageButton object"
                          ),
                          !1
                        );
                      if (!(t instanceof yt))
                        return (
                          D.error(
                            "inAppMessage must be an InAppMessage object"
                          ),
                          !1
                        );
                      var a = c.Ic(e, t);
                      if (a.h)
                        for (var i = 0; i < a.j.length; i++)
                          m.pa(rn.ec, [t.triggerId, e.id], a.j[i]);
                      return a.h;
                    }
                  },
                  Pb: function (e, t, a) {
                    if (n()) {
                      if (!(e instanceof xa))
                        return (
                          D.error(
                            "inAppMessage argument to logInAppMessageHtmlClick must be an HtmlMessage object."
                          ),
                          !1
                        );
                      if ((a = c.Pb(e, t, a)).h)
                        for (var i = 0; i < a.j.length; i++)
                          m.pa(rn.ec, [e.triggerId, t], a.j[i]);
                      return a.h;
                    }
                  },
                  M: function (e, t) {
                    if (n())
                      return e instanceof yt || e instanceof ua
                        ? !!M(
                            Dt,
                            t,
                            t +
                              " is not a valid in-app message display failure",
                            "InAppMessage.DisplayFailures"
                          ) && c.M(e.triggerId, t).h
                        : (D.error(
                            "inAppMessage must be an InAppMessage object"
                          ),
                          !1);
                  },
                  Ma: function (e, t) {
                    if (n()) {
                      if (!I(e)) return D.error("cards must be an array"), !1;
                      for (var a = 0; a < e.length; a++)
                        if (!(e[a] instanceof nt))
                          return (
                            D.error("Each card in cards must be a Card object"),
                            !1
                          );
                      return c.Ma(e, t).h;
                    }
                  },
                  La: function (e, t) {
                    if (n())
                      return e instanceof nt
                        ? c.La(e, t).h
                        : (D.error("card must be a Card object"), !1);
                  },
                  Hc: function (e) {
                    if (n())
                      return e instanceof nt
                        ? c.Hc(e).h
                        : (D.error("card must be a Card object"), !1);
                  },
                  jf: function () {
                    if (n()) return Wn(c, T.$f).h;
                  },
                  hf: function () {
                    if (n()) return Wn(c, T.Kf).h;
                  },
                  N: function (e) {
                    if (n()) {
                      for (var t = o(z), a = t.next(); !a.done; a = t.next())
                        a.value.N(e);
                      C.N(e), N.N(e);
                    }
                  },
                  K: function () {
                    if (n())
                      for (var e = o(z), t = e.next(); !t.done; t = e.next())
                        t.value.K();
                  },
                  Jd: function (e, t) {
                    if (n()) {
                      if (null == e || 0 >= e.length)
                        return (
                          D.error(
                            'logCustomEvent requires a non-empty eventName, got "' +
                              e +
                              '". Ignoring event.'
                          ),
                          !1
                        );
                      if (!J(e, "log custom event", "the event name"))
                        return !1;
                      var a = o(
                          Z(
                            t,
                            "logCustomEvent",
                            "eventProperties",
                            'log custom event "' + e + '"',
                            "event"
                          )
                        ),
                        i = a.next().value;
                      if (((a = a.next().value), !i)) return !1;
                      if ((i = c.Jd(e, a)).h)
                        for (
                          D.info('Logged custom event "' + e + '".'), a = 0;
                          a < i.j.length;
                          a++
                        )
                          m.pa(rn.Tc, [e, t], i.j[a]);
                      return i.h;
                    }
                  },
                  Kd: function (e, t, a, i, r) {
                    if (n()) {
                      if (
                        (null == a && (a = "USD"),
                        null == i && (i = 1),
                        null == e || 0 >= e.length)
                      )
                        return (
                          D.error(
                            'logPurchase requires a non-empty productId, got "' +
                              e +
                              '", ignoring.'
                          ),
                          !1
                        );
                      if (!J(e, "log purchase", "the purchase name")) return !1;
                      var s = parseFloat(t);
                      if (isNaN(s))
                        return (
                          D.error(
                            "logPurchase requires a numeric price, got " +
                              t +
                              ", ignoring."
                          ),
                          !1
                        );
                      if (((s = s.toFixed(2)), (t = parseInt(i)), isNaN(t)))
                        return (
                          D.error(
                            "logPurchase requires an integer quantity, got " +
                              i +
                              ", ignoring."
                          ),
                          !1
                        );
                      if (1 > t || 100 < t)
                        return (
                          D.error(
                            "logPurchase requires a quantity >1 and <100, got " +
                              t +
                              ", ignoring."
                          ),
                          !1
                        );
                      if (
                        ((a = a.toUpperCase()),
                        -1 ===
                          "AED AFN ALL AMD ANG AOA ARS AUD AWG AZN BAM BBD BDT BGN BHD BIF BMD BND BOB BRL BSD BTC BTN BWP BYR BZD CAD CDF CHF CLF CLP CNY COP CRC CUC CUP CVE CZK DJF DKK DOP DZD EEK EGP ERN ETB EUR FJD FKP GBP GEL GGP GHS GIP GMD GNF GTQ GYD HKD HNL HRK HTG HUF IDR ILS IMP INR IQD IRR ISK JEP JMD JOD JPY KES KGS KHR KMF KPW KRW KWD KYD KZT LAK LBP LKR LRD LSL LTL LVL LYD MAD MDL MGA MKD MMK MNT MOP MRO MTL MUR MVR MWK MXN MYR MZN NAD NGN NIO NOK NPR NZD OMR PAB PEN PGK PHP PKR PLN PYG QAR RON RSD RUB RWF SAR SBD SCR SDG SEK SGD SHP SLL SOS SRD STD SVC SYP SZL THB TJS TMT TND TOP TRY TTD TWD TZS UAH UGX USD UYU UZS VEF VND VUV WST XAF XAG XAU XCD XDR XOF XPD XPF XPT YER ZAR ZMK ZMW ZWL"
                            .split(" ")
                            .indexOf(a))
                      )
                        return (
                          D.error(
                            "logPurchase requires a valid currencyCode, got " +
                              a +
                              ", ignoring."
                          ),
                          !1
                        );
                      var l = o(
                        Z(
                          r,
                          "logPurchase",
                          "purchaseProperties",
                          'log purchase "' + e + '"',
                          "purchase"
                        )
                      );
                      if (((i = l.next().value), (l = l.next().value), !i))
                        return !1;
                      if ((i = c.Kd(e, s, a, t, l)).h)
                        for (
                          D.info(
                            "Logged " +
                              t +
                              " purchase" +
                              (1 < t ? "s" : "") +
                              ' of "' +
                              e +
                              '" for ' +
                              a +
                              " " +
                              s +
                              "."
                          ),
                            a = 0;
                          a < i.j.length;
                          a++
                        )
                          m.pa(rn.fd, [e, r], i.j[a]);
                      return i.h;
                    }
                  },
                  qa: function () {
                    if (n()) return y.qa();
                  },
                  Ka: function () {
                    if (n()) return y.Ka();
                  },
                  Id: function (e, a, i) {
                    n() &&
                      (t("isPushGranted", "method", "isPushPermissionGranted"),
                      y.Id(e, a, i));
                  },
                  Mb: function () {
                    if (n()) return y.Mb();
                  },
                  ph: function (e, t, a) {
                    if (n())
                      return y.subscribe(
                        a,
                        function (t, a, n) {
                          c.tb(), "function" === typeof e && e(t, a, n);
                        },
                        t
                      );
                  },
                  Uh: function (e, t) {
                    if (n()) return y.unsubscribe(e, t);
                  },
                  Tb: function (e) {
                    if (n())
                      return (
                        !(
                          "" === e || !Y(e, "set signature", "signature", !1)
                        ) && (u.Tb(e), !0)
                      );
                  },
                  Xd: function (e) {
                    if (n()) return u.Xd(e);
                  },
                  Sh: function () {
                    n() && (t("trackLocation", "method"), k.watchPosition());
                  },
                  zd: function (e) {
                    if (n()) {
                      if (!I(e))
                        return (
                          D.error(
                            "Cannot set SDK metadata because metadata is not an array."
                          ),
                          !1
                        );
                      for (var t = o(e), a = t.next(); !a.done; a = t.next())
                        if (
                          !M(
                            Gi,
                            a.value,
                            "sdkMetadata contained an invalid value.",
                            "BrazeSdkMetadata"
                          )
                        )
                          return !1;
                      return c.zd(e), !0;
                    }
                  },
                  Mh: function () {
                    t("stopWebTracking", "method", "disableSDK"),
                      null != c && c.tb();
                    var e = new Ue(null, !0);
                    e.store("ab.optOut", "This-cookie-will-expire-in-" + Re(e)),
                      new w((e = _.ba)).setItem(e.G.xb, e.kb, !0),
                      a(),
                      (U = !0);
                  },
                  bh: function () {
                    null != c && c.tb();
                    var e = new Ue(null, !0);
                    e.store("ab.optOut", "This-cookie-will-expire-in-" + Re(e)),
                      new w((e = _.ba)).setItem(e.G.xb, e.kb, !0),
                      a(),
                      (U = !0);
                  },
                  vh: function () {
                    t("resumeWebTracking", "method", "enableSDK"),
                      new Ue(null, !0).remove("ab.optOut");
                    var e = _.ba;
                    S(new w(e), e.G.xb, e.kb), a();
                  },
                  dh: function () {
                    new Ue(null, !0).remove("ab.optOut");
                    var e = _.ba;
                    S(new w(e), e.G.xb, e.kb), a();
                  },
                  mh: function () {
                    return !!new Ue(null, !0).Z("ab.optOut");
                  },
                  Xh: function () {
                    if (null == r)
                      throw Error(
                        "Appboy must be initialized before calling methods."
                      );
                    r.clearData();
                    for (var e = R(_), t = 0; t < e.length; t++)
                      new w(_[e[t]]).clearData();
                    P && (h.clearData(!0), m.clearData(!0));
                  },
                };
              })(),
              Vi = {};
            for (Wi in ie) Vi[Wi] = ie[Wi];
            for (var Yi in ((Vi.initialize = qi.Hd),
            (Vi.destroy = qi.Jb),
            (Vi.getDeviceId = qi.gh),
            (Vi.toggleAppboyLogging = qi.Yd),
            (Vi.setLogger = qi.Td),
            (Vi.openSession = qi.Lc),
            (Vi.changeUser = qi.$a),
            (Vi.getUser = qi.rb),
            (Vi.requestImmediateDataFlush = qi.tb),
            (Vi.requestFeedRefresh = qi.Nc),
            (Vi.getCachedFeed = qi.Fc),
            (Vi.subscribeToFeedUpdates = qi.uf),
            (Vi.requestContentCardsRefresh = qi.Na),
            (Vi.getCachedContentCards = qi.pb),
            (Vi.subscribeToContentCardsUpdates = qi.tf),
            (Vi.logCardImpressions = qi.Ma),
            (Vi.logCardClick = qi.La),
            (Vi.logCardDismissal = qi.Hc),
            (Vi.logFeedDisplayed = qi.jf),
            (Vi.logContentCardsDisplayed = qi.hf),
            (Vi.logInAppMessageImpression = qi.Qb),
            (Vi.logInAppMessageClick = qi.Jc),
            (Vi.logInAppMessageButtonClick = qi.Ic),
            (Vi.logInAppMessageHtmlClick = qi.Pb),
            (Vi.subscribeToNewInAppMessages = qi.Ph),
            (Vi.subscribeToInAppMessage = qi.vf),
            (Vi.removeSubscription = qi.N),
            (Vi.removeAllSubscriptions = qi.K),
            (Vi.logCustomEvent = qi.Jd),
            (Vi.logPurchase = qi.Kd),
            (Vi.isPushSupported = qi.qa),
            (Vi.isPushBlocked = qi.Ka),
            (Vi.isPushGranted = qi.Id),
            (Vi.isPushPermissionGranted = qi.Mb),
            (Vi.registerAppboyPushMessages = qi.ph),
            (Vi.unregisterAppboyPushMessages = qi.Uh),
            (Vi.setSdkAuthenticationSignature = qi.Tb),
            (Vi.subscribeToSdkAuthenticationFailures = qi.Xd),
            (Vi.trackLocation = qi.Sh),
            (Vi.addSdkMetadata = qi.zd),
            (Vi.stopWebTracking = qi.Mh),
            (Vi.disableSDK = qi.bh),
            (Vi.resumeWebTracking = qi.vh),
            (Vi.enableSDK = qi.dh),
            (Vi.wipeData = qi.Xh),
            (Vi.isDisabled = qi.mh),
            Vi))
              "object" === typeof n ? (n[Yi] = Vi[Yi]) : (Xi[Yi] = Vi[Yi]);
            var Ji = "object" === typeof n ? n : Xi,
              Zi = new (function (e, t) {
                var a = !1,
                  n = !1,
                  i = !1,
                  o = !1,
                  r = null,
                  s = null,
                  l = null,
                  c = null;
                return (
                  e.Oh(function (t) {
                    function s(e) {
                      if (
                        27 === e.keyCode &&
                        !i &&
                        0 <
                          document.querySelectorAll(".ab-modal-interactions")
                            .length
                      ) {
                        e = document.getElementsByClassName("ab-html-message");
                        for (var t = !1, a = 0; a < e.length; a++) {
                          var n = e[
                            a
                          ].contentWindow.document.getElementsByClassName(
                            "ab-programmatic-close-button"
                          )[0];
                          null != n && (qe(n), (t = !0));
                        }
                        t ||
                          (null !=
                            (e = document.querySelectorAll(
                              ".ab-modal-interactions > .ab-close-button"
                            )[0]) &&
                            qe(e));
                      }
                    }
                    if (
                      ((a = t[O.pg] || !1),
                      (n = t[O.og] || t[O.qg] || !1),
                      (i = t[O.tg] || !1),
                      (o = t[O.fe] || !1),
                      !0 === t[O.Zd] && (o = !0),
                      (r = null),
                      (l = t[O.be] || null),
                      (c = t[O.bg] || null),
                      t[O.Xf] ||
                        null !==
                          document.querySelector(
                            'link[rel=stylesheet][href="https://use.fontawesome.com/7f85a56ba4.css"]'
                          ) ||
                        ((t = document.createElement("link")).setAttribute(
                          "rel",
                          "stylesheet"
                        ),
                        t.setAttribute(
                          "href",
                          "https://use.fontawesome.com/7f85a56ba4.css"
                        ),
                        document
                          .getElementsByTagName("head")[0]
                          .appendChild(t)),
                      (t = "ab-css-definitions-" + "3.5.0".replace(/\./g, "-")),
                      null == document.getElementById(t))
                    ) {
                      var u = document.createElement("style");
                      (u.innerHTML = ma.$e),
                        (u.id = t),
                        null != l && u.setAttribute("nonce", l),
                        document.getElementsByTagName("head")[0].appendChild(u);
                    }
                    i ||
                      (document.addEventListener("keydown", s, !1),
                      e.Nh(function () {
                        document.removeEventListener("keydown", s);
                      }));
                  }),
                  {
                    Tg: function () {
                      return (
                        null == r &&
                          (r = e.vf(function (t) {
                            e.display.sf(t);
                          })),
                        r
                      );
                    },
                    sf: function (n, r, s) {
                      if (null == n) return !1;
                      if (n instanceof ua)
                        return (
                          D.info(
                            "User received control for a multivariate test, logging to Braze servers."
                          ),
                          e.Qb(n),
                          !0
                        );
                      if (!(n instanceof yt)) return !1;
                      var u = n instanceof xa;
                      if (u && !n.Th && !o)
                        return (
                          D.error(
                            'HTML in-app messages are disabled. Use the "allowUserSuppliedJavascript" option for appboy.initialize to enable these messages.'
                          ),
                          e.M(n, Dt.ge),
                          !1
                        );
                      if (
                        (null == r && (r = document.body),
                        n.Ja() &&
                          0 <
                            r.querySelectorAll(".ab-modal-interactions").length)
                      )
                        return (
                          D.info(
                            "Cannot show in-app message '" +
                              n.message +
                              "' because another message is being shown."
                          ),
                          e.M(n, Dt.Bf),
                          !1
                        );
                      if (at.nh()) {
                        var b = at.hh();
                        if (
                          (b === at.Sa.jc && n.orientation === Wt) ||
                          (b === at.Sa.Zc && "PORTRAIT" === n.orientation)
                        )
                          return (
                            D.info(
                              "Not showing " +
                                ("PORTRAIT" === n.orientation
                                  ? "portrait"
                                  : "landscape") +
                                " in-app message '" +
                                n.message +
                                "' because the screen is currently " +
                                (b === at.Sa.jc ? "portrait" : "landscape")
                            ),
                            e.M(n, Dt.rg),
                            !1
                          );
                      }
                      if (!o) {
                        if (((b = !1), n.buttons && 0 < n.buttons.length))
                          for (var p = n.buttons, d = 0; d < p.length; d++)
                            p[d].clickAction === zt && (b = wa(p[d].uri));
                        else n.clickAction === zt && (b = wa(n.uri));
                        if (b)
                          return (
                            D.error(
                              'Javascript click actions are disabled. Use the "allowUserSuppliedJavascript" option for appboy.initialize to enable these actions.'
                            ),
                            e.M(n, Dt.ge),
                            !1
                          );
                      }
                      var h = document.createElement("div");
                      (h.className = "ab-iam-root v3"),
                        (h.className += n.oa()),
                        h.setAttribute("role", "complementary"),
                        kt(n) && (h.id = n.htmlId),
                        c && (h.style.zIndex = c + 1),
                        r.appendChild(h),
                        Et(n) &&
                          (((r = document.createElement("style")).innerHTML =
                            n.css),
                          (r.id = St(n)),
                          null != l && r.setAttribute("nonce", l),
                          document
                            .getElementsByTagName("head")[0]
                            .appendChild(r));
                      var f = n instanceof ka;
                      return (
                        (r = n.aa(
                          e,
                          t,
                          function () {
                            e.display.Vd();
                          },
                          function (t) {
                            if (n.Ja() && n.xf()) {
                              var a = document.createElement("div");
                              if (
                                ((a.className = "ab-page-blocker"),
                                Et(n) ||
                                  (a.style.backgroundColor = xt(n.frameColor)),
                                c && (a.style.zIndex = c),
                                h.appendChild(a),
                                !i)
                              ) {
                                var o = new Date().valueOf();
                                a.onclick = function (e) {
                                  200 < new Date().valueOf() - o &&
                                    (Nt(n, t), e.stopPropagation());
                                };
                              }
                              h.appendChild(t), t.focus(), n.Kc(h);
                            } else if (f) {
                              var r = document.querySelectorAll(".ab-slideup");
                              a = null;
                              for (var l = r.length - 1; 0 <= l; l--)
                                if (r[l] !== t) {
                                  a = r[l];
                                  break;
                                }
                              "TOP" === n.slideFrom
                                ? ((r = 0),
                                  null != a &&
                                    (r = a.offsetTop + a.offsetHeight),
                                  (t.style.top = Math.max(r, 0) + "px"))
                                : ((r = 0),
                                  null != a &&
                                    (r =
                                      (window.innerHeight ||
                                        document.documentElement.clientHeight) -
                                      a.offsetTop),
                                  (t.style.bottom = Math.max(r, 0) + "px"));
                            } else
                              u &&
                                !i &&
                                t.contentWindow.addEventListener(
                                  "keydown",
                                  function (e) {
                                    27 === e.keyCode && n.Ye();
                                  }
                                );
                            e.Qb(n),
                              n.dismissType === Rt &&
                                setTimeout(function () {
                                  h.contains(t) && Nt(n, t);
                                }, n.duration),
                              "function" === typeof s && s();
                          },
                          a,
                          c
                        )),
                        (u || f) && (h.appendChild(r), n.Kc(h)),
                        !0
                      );
                    },
                    Vd: function (t, a, i) {
                      function o(t) {
                        for (
                          var a = t.querySelectorAll(".ab-feed"),
                            n = null,
                            i = 0;
                          i < a.length;
                          i++
                        )
                          a[i].parentNode === t && (n = a[i]);
                        null != n
                          ? (Aa(e, n), n.parentNode.replaceChild(b, n))
                          : t.appendChild(b),
                          setTimeout(function () {
                            b.className = b.className.replace(
                              "ab-hide",
                              "ab-show"
                            );
                          }, 0),
                          s && b.focus(),
                          e.jf(),
                          Na(c, e, b);
                      }
                      function r(e, t) {
                        if (null == t) return e;
                        for (var a = [], n = 0; n < t.length; n++)
                          a.push(t[n].toLowerCase());
                        for (t = [], n = 0; n < e.length; n++) {
                          for (
                            var i = [], o = 0;
                            o < e[n].categories.length;
                            o++
                          )
                            i.push(e[n].categories[o].toLowerCase());
                          0 < U(i, a).length && t.push(e[n]);
                        }
                        return t;
                      }
                      var s = !1;
                      null == t && ((t = document.body), (s = !0));
                      var l = !1,
                        c = null;
                      null == a
                        ? (_a(
                            (c = e.Fc()),
                            r(c.cards, i),
                            c.lastUpdated,
                            null,
                            e,
                            n
                          ),
                          (l = !0))
                        : (c = new Sa(r(a, i), new Date()));
                      var u,
                        b = c.aa(e, n);
                      if (l) {
                        (null == c.lastUpdated ||
                          6e4 <
                            new Date().valueOf() - c.lastUpdated.valueOf()) &&
                          (D.info(
                            "Cached feed was older than max TTL of 60000 ms, requesting an update from the server."
                          ),
                          Ta(c, e, b));
                        var p = new Date().valueOf();
                        (a = e.uf(function (t) {
                          var a = b.querySelectorAll(".ab-refresh-button")[0];
                          if (null != a) {
                            var o = 500,
                              s = parseInt(b.getAttribute(Ma));
                            (o = isNaN(s)
                              ? o - (new Date().valueOf() - p)
                              : o - (new Date().valueOf() - s)),
                              setTimeout(function () {
                                a.className = a.className.replace(
                                  /fa-spin/g,
                                  ""
                                );
                              }, Math.max(o, 0));
                          }
                          _a(c, r(t.cards, i), t.lastUpdated, b, e, n);
                        })),
                          b.setAttribute(Oa, a);
                      }
                      null != t
                        ? o(t)
                        : (window.onload =
                            ((u = window.onload),
                            function () {
                              "function" === typeof u && u(), o(document.body);
                            }));
                    },
                    af: function () {
                      for (
                        var t = document.querySelectorAll(".ab-feed"), a = 0;
                        a < t.length;
                        a++
                      )
                        Aa(e, t[a]);
                    },
                    Rh: function (t, a, n) {
                      0 < document.querySelectorAll(".ab-feed").length
                        ? e.display.af()
                        : e.display.Vd(t, a, n);
                    },
                    rf: function (t, a) {
                      function i(t) {
                        for (
                          var a = t.querySelectorAll(".ab-feed"),
                            n = null,
                            i = 0;
                          i < a.length;
                          i++
                        )
                          a[i].parentNode === t && (n = a[i]);
                        null != n
                          ? (Aa(e, n), n.parentNode.replaceChild(l, n))
                          : t.appendChild(l),
                          setTimeout(function () {
                            l.className = l.className.replace(
                              "ab-hide",
                              "ab-show"
                            );
                          }, 0),
                          o && l.focus(),
                          e.hf(),
                          Na(r, e, l);
                      }
                      var o = !1;
                      null == t && ((t = document.body), (o = !0));
                      var r = null;
                      (r = e.pb()),
                        "function" === typeof a &&
                          _a(r, a(r.cards.slice()), r.lastUpdated, null, e, n);
                      var l = r.aa(e, n);
                      (null == r.lastUpdated ||
                        6e4 < new Date().valueOf() - r.lastUpdated.valueOf()) &&
                        (null == s ||
                          6e4 < new Date().valueOf() - s.valueOf()) &&
                        (D.info(
                          "Cached content cards were older than max TTL of 60000 ms, requesting a sync from the server."
                        ),
                        Ta(r, e, l),
                        (s = new Date().valueOf()));
                      var c,
                        u = new Date().valueOf(),
                        b = e.tf(function (t) {
                          var i = l.querySelectorAll(".ab-refresh-button")[0];
                          if (null != i) {
                            var o = 500,
                              s = parseInt(l.getAttribute(Ma));
                            (o = isNaN(s)
                              ? o - (new Date().valueOf() - u)
                              : o - (new Date().valueOf() - s)),
                              setTimeout(function () {
                                i.className = i.className.replace(
                                  /fa-spin/g,
                                  ""
                                );
                              }, Math.max(o, 0));
                          }
                          (o = t.cards),
                            "function" === typeof a && (o = a(o.slice())),
                            _a(r, o, t.lastUpdated, l, e, n);
                        });
                      l.setAttribute(Oa, b),
                        null != t
                          ? i(t)
                          : (window.onload =
                              ((c = window.onload),
                              function () {
                                "function" === typeof c && c(),
                                  i(document.body);
                              }));
                    },
                    gf: function (t) {
                      for (
                        var a = document.querySelectorAll(".ab-feed"), n = 0;
                        n < a.length;
                        n++
                      )
                        (null == t || (null != t && a[n].parentNode === t)) &&
                          Aa(e, a[n]);
                    },
                    Qh: function (t, a) {
                      0 < document.querySelectorAll(".ab-feed").length
                        ? e.display.gf()
                        : e.display.rf(t, a);
                    },
                  }
                );
              })(qi, Ji);
            return (
              (Ji.display = {}),
              (Ji.display.automaticallyShowNewInAppMessages = Zi.Tg),
              (Ji.display.showInAppMessage = Zi.sf),
              (Ji.display.showFeed = Zi.Vd),
              (Ji.display.destroyFeed = Zi.af),
              (Ji.display.toggleFeed = Zi.Rh),
              (Ji.display.showContentCards = Zi.rf),
              (Ji.display.hideContentCards = Zi.gf),
              (Ji.display.toggleContentCards = Zi.Qh),
              (qi.display = Zi),
              n
            );
          }),
          void 0 === (o = "function" === typeof n ? n.apply(t, i) : n) ||
            (e.exports = o);
      }.call(window));
    },
  },
]);
//# sourceMappingURL=1edf0483.9dfe51f2fe978bc8.js.map
