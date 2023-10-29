(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [190],
  {
    44363: function (e, n, t) {
      e.exports = t(9828).IU("collapse");
    },
    733: function (e, n, t) {
      e.exports = t(9828).IU("expand");
    },
    73681: function (e, n, t) {
      "use strict";
      t.d(n, {
        U: function () {
          return J;
        },
      });
      var r,
        a,
        o,
        i,
        c,
        l = t(4730),
        s = t(92777),
        u = t(82262),
        d = t(10748),
        p = t(45959),
        f = t(63553),
        h = t(37247),
        g = t(43269),
        v = t(53229),
        m = t(42551),
        _ = t(773),
        y = t(22188),
        x = t(80955),
        b = t(67294),
        w = t(34278),
        P = t(733),
        Z = t.n(P),
        E = t(543),
        S = t(45566),
        I = t(95590),
        j = t(94184),
        A = t.n(j),
        $ = t(78764),
        k = t.n($),
        N = [
          "children",
          "className",
          "defaultExpanded",
          "expanded",
          "toggleStrategy",
          "onToggle",
          "title",
          "renderTitle",
          "$$udAccordion",
          "id",
          "titleId",
        ],
        R = ["children"];
      function O(e) {
        var n = (function () {
          if ("undefined" === typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" === typeof Proxy) return !0;
          try {
            return (
              Boolean.prototype.valueOf.call(
                Reflect.construct(Boolean, [], function () {})
              ),
              !0
            );
          } catch (e) {
            return !1;
          }
        })();
        return function () {
          var t,
            r = (0, h.Z)(e);
          if (n) {
            var a = (0, h.Z)(this).constructor;
            t = Reflect.construct(r, arguments, a);
          } else t = r.apply(this, arguments);
          return (0, f.Z)(this, t);
        };
      }
      var z,
        C,
        B,
        F,
        T,
        D = {
          medium: "ud-heading-md",
          large: "ud-heading-lg",
          xlarge: "ud-heading-xl",
        },
        U =
          (0, x.f3)("$$udAccordion")(
            (r =
              (0, x.Pi)(
                ((c = (function (e) {
                  (0, p.Z)(t, e);
                  var n = O(t);
                  function t(e) {
                    var r, a, c, l;
                    ((0, s.Z)(this, t),
                    ((r = n.call(this, e)).id = void 0),
                    (r.titleId = void 0),
                    (0, g.Z)((0, d.Z)(r), "_expanded", o, (0, d.Z)(r)),
                    (0, g.Z)((0, d.Z)(r), "handleChange", i, (0, d.Z)(r)),
                    (r.handleKeyDown = function (e) {
                      if (e.keyCode === w.R.UP || e.keyCode === w.R.DOWN) {
                        var n,
                          t =
                            null === (n = r.props.$$udAccordion) || void 0 === n
                              ? void 0
                              : n.ref.current;
                        if (t) {
                          var a;
                          e.preventDefault();
                          var o = Array.from(
                              t.querySelectorAll(".js-panel-toggler")
                            ),
                            i = o.findIndex(function (n) {
                              return n === e.currentTarget;
                            }),
                            c =
                              o[
                                (i +
                                  (e.keyCode === w.R.UP ? -1 : 1) +
                                  o.length) %
                                  o.length
                              ];
                          null === c ||
                            void 0 === c ||
                            null === (a = c.focus) ||
                            void 0 === a ||
                            a.call(c);
                        }
                      }
                    }),
                    (r.id =
                      null !== (a = e.id) && void 0 !== a
                        ? a
                        : (0, m.Ki)("accordion-panel")),
                    (r.titleId =
                      null !== (c = e.titleId) && void 0 !== c
                        ? c
                        : (0, m.Ki)("accordion-panel-title")),
                    r.props.defaultExpanded) &&
                      ((r._expanded = !0),
                      null === (l = r.props.$$udAccordion) ||
                        void 0 === l ||
                        l.setSelectedPanelId(r.id));
                    return r;
                  }
                  return (
                    (0, u.Z)(t, [
                      {
                        key: "componentDidUpdate",
                        value: function (e) {
                          this.props.expanded !== e.expanded &&
                            this.props.expanded !== this._expanded &&
                            this.handleChange({
                              target: {
                                id: this.id,
                                dataset: {
                                  checked: this.props.expanded ? "checked" : "",
                                },
                              },
                            });
                        },
                      },
                      {
                        key: "expanded",
                        get: function () {
                          var e, n;
                          return void 0 !== this.props.expanded
                            ? this.props.expanded
                            : "any" ===
                              (null === (e = this.props.$$udAccordion) ||
                              void 0 === e
                                ? void 0
                                : e.props.toggleBehavior)
                            ? this._expanded
                            : this.id ===
                              (null === (n = this.props.$$udAccordion) ||
                              void 0 === n
                                ? void 0
                                : n.selectedPanelId);
                        },
                      },
                      {
                        key: "render",
                        value: function () {
                          var e = this.props,
                            n = e.children,
                            t = e.className,
                            r =
                              (e.defaultExpanded, e.expanded, e.toggleStrategy),
                            a = (e.onToggle, e.title),
                            o = e.renderTitle,
                            i = e.$$udAccordion,
                            c = (e.id, e.titleId, (0, l.Z)(e, N)),
                            s = null === i || void 0 === i ? void 0 : i.props,
                            u = s.toggleBehavior,
                            d = s.showExpandIcon,
                            p = s.size,
                            f = D[p],
                            h = "any" === u ? E.J : _.h.Radio,
                            g = b.createElement(
                              S.zx,
                              {
                                "aria-disabled":
                                  "always-one" === u && this.expanded,
                                "aria-expanded": this.expanded,
                                className: A()(
                                  "js-panel-toggler",
                                  k()["panel-toggler"]
                                ),
                                id: this.titleId,
                                onKeyDown: this.handleKeyDown,
                                typography: f,
                                udStyle: "link",
                              },
                              b.createElement(
                                "span",
                                { className: "ud-accordion-panel-title" },
                                a
                              )
                            );
                          return b.createElement(
                            "div",
                            Object.assign({}, c, {
                              className: A()(k().panel, t),
                            }),
                            b.createElement(h, {
                              id: this.id,
                              checked: this.expanded,
                              onChange: this.handleChange,
                            }),
                            b.createElement(
                              S.zx,
                              {
                                componentClass: "div",
                                className: A()(
                                  "ud-accordion-panel-toggler",
                                  k()["panel-toggler"],
                                  k()["outer-panel-toggler"]
                                ),
                                cssToggleId: this.id,
                                typography: f,
                                udStyle: "link",
                              },
                              null === o || void 0 === o
                                ? void 0
                                : o({
                                    className: "ud-accordion-panel-heading",
                                    children: g,
                                  }),
                              d &&
                                b.createElement(Z(), {
                                  className: k()["expand-icon"],
                                  label: !1,
                                  color: "neutral",
                                  size: "xlarge" === p ? "medium" : "small",
                                })
                            ),
                            ("show-hide" === r || this.expanded) &&
                              b.createElement(
                                "div",
                                {
                                  className: k()["content-wrapper"],
                                  "aria-labelledby": this.titleId,
                                  "aria-hidden": !this.expanded,
                                  role: "group",
                                },
                                b.createElement(
                                  "div",
                                  {
                                    className: A()(
                                      "ud-accordion-panel-content",
                                      k().content
                                    ),
                                  },
                                  n
                                )
                              )
                          );
                        },
                      },
                    ]),
                    t
                  );
                })(b.Component)),
                (c.defaultProps = {
                  renderTitle: function (e) {
                    var n = e.children,
                      t = (0, l.Z)(e, R);
                    return b.createElement("h3", t, n);
                  },
                  className: "",
                  defaultExpanded: void 0,
                  expanded: void 0,
                  toggleStrategy: "show-hide",
                  onToggle: I.Z,
                }),
                (c.$$udType = "Accordion.Panel"),
                (a = c),
                (o = (0, v.Z)(a.prototype, "_expanded", [y.LO], {
                  configurable: !0,
                  enumerable: !0,
                  writable: !0,
                  initializer: function () {
                    return !1;
                  },
                })),
                (i = (0, v.Z)(a.prototype, "handleChange", [y.aD], {
                  configurable: !0,
                  enumerable: !0,
                  writable: !0,
                  initializer: function () {
                    var e = this;
                    return function (n) {
                      var t, r, a;
                      e._expanded = !!n.target.dataset.checked;
                      var o = e._expanded ? e.id : null;
                      null === (t = e.props.$$udAccordion) ||
                        void 0 === t ||
                        t.setSelectedPanelId(o),
                        null === (r = (a = e.props).onToggle) ||
                          void 0 === r ||
                          r.call(a, e._expanded, n);
                    };
                  },
                })),
                (r = a))
              ) || r)
          ) || r,
        K = ["toggleBehavior", "showExpandIcon", "size"];
      function L(e) {
        var n = (function () {
          if ("undefined" === typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" === typeof Proxy) return !0;
          try {
            return (
              Boolean.prototype.valueOf.call(
                Reflect.construct(Boolean, [], function () {})
              ),
              !0
            );
          } catch (e) {
            return !1;
          }
        })();
        return function () {
          var t,
            r = (0, h.Z)(e);
          if (n) {
            var a = (0, h.Z)(this).constructor;
            t = Reflect.construct(r, arguments, a);
          } else t = r.apply(this, arguments);
          return (0, f.Z)(this, t);
        };
      }
      var J =
        (0, x.Pi)(
          ((T = (function (e) {
            (0, p.Z)(t, e);
            var n = L(t);
            function t(e) {
              var r, a;
              return (
                (0, s.Z)(this, t),
                ((r = n.call(this, e)).name = void 0),
                (r.ref = b.createRef()),
                (0, g.Z)((0, d.Z)(r), "selectedPanelId", B, (0, d.Z)(r)),
                (0, g.Z)((0, d.Z)(r), "setSelectedPanelId", F, (0, d.Z)(r)),
                (r.name =
                  null !== (a = e.name) && void 0 !== a
                    ? a
                    : (0, m.Ki)("accordion")),
                r
              );
            }
            return (
              (0, u.Z)(t, [
                {
                  key: "render",
                  value: function () {
                    var e = this.props,
                      n = e.toggleBehavior,
                      t = (e.showExpandIcon, e.size, (0, l.Z)(e, K)),
                      r = b.createElement(
                        x.zt,
                        { $$udAccordion: this },
                        b.createElement(
                          "div",
                          Object.assign({ ref: this.ref }, t)
                        )
                      );
                    return "any" === n
                      ? r
                      : b.createElement(
                          _.h,
                          { allowToggle: "max-one" === n, name: this.name },
                          r
                        );
                  },
                },
              ]),
              t
            );
          })(b.Component)),
          (T.defaultProps = {
            toggleBehavior: "any",
            showExpandIcon: !0,
            size: "large",
          }),
          (T.Panel = void 0),
          (C = T),
          (B = (0, v.Z)(C.prototype, "selectedPanelId", [y.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (F = (0, v.Z)(C.prototype, "setSelectedPanelId", [y.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (n) {
                e.selectedPanelId = n;
              };
            },
          })),
          (z = C))
        ) || z;
      J.Panel = U;
    },
    78764: function (e) {
      e.exports = {
        panel: "accordion-panel_panel__LU2rW",
        "panel-toggler": "accordion-panel_panel-toggler__trBnl",
        "outer-panel-toggler": "accordion-panel_outer-panel-toggler__R8Bfr",
        "expand-icon": "accordion-panel_expand-icon__ixBsD",
        "content-wrapper": "accordion-panel_content-wrapper__F3dsd",
        "static-panel": "accordion-panel_static-panel__LWT_C",
        content: "accordion-panel_content__c4f_M",
      };
    },
    62195: function (e, n, t) {
      var r = t(69078),
        a = r.slice,
        o = r.pluck,
        i = r.each,
        c = r.create,
        l = r.isList,
        s = r.isFunction,
        u = r.isObject;
      e.exports = { createStore: p };
      var d = {
        version: "2.0.4",
        enabled: !1,
        storage: null,
        addStorage: function (e) {
          this.enabled ||
            (this._testStorage(e) &&
              ((this._storage.resolved = e),
              (this.enabled = !0),
              (this.storage = e.name)));
        },
        addPlugin: function (e) {
          var n = this;
          if (l(e))
            i(e, function (e) {
              n.addPlugin(e);
            });
          else if (
            !o(this._seenPlugins, function (n) {
              return e === n;
            })
          ) {
            if ((this._seenPlugins.push(e), !s(e)))
              throw new Error(
                "Plugins must be function values that return objects"
              );
            var t = e.call(this);
            if (!u(t))
              throw new Error(
                "Plugins must return an object of function properties"
              );
            i(t, function (t, r) {
              if (!s(t))
                throw new Error(
                  "Bad plugin property: " +
                    r +
                    " from plugin " +
                    e.name +
                    ". Plugins should only return functions."
                );
              n._assignPluginFnProp(t, r);
            });
          }
        },
        get: function (e, n) {
          var t = this._storage().read(this._namespacePrefix + e);
          return this._deserialize(t, n);
        },
        set: function (e, n) {
          return void 0 === n
            ? this.remove(e)
            : (this._storage().write(
                this._namespacePrefix + e,
                this._serialize(n)
              ),
              n);
        },
        remove: function (e) {
          this._storage().remove(this._namespacePrefix + e);
        },
        each: function (e) {
          var n = this;
          this._storage().each(function (t, r) {
            e(n._deserialize(t), r.replace(n._namespaceRegexp, ""));
          });
        },
        clearAll: function () {
          this._storage().clearAll();
        },
        hasNamespace: function (e) {
          return this._namespacePrefix == "__storejs_" + e + "_";
        },
        namespace: function (e) {
          if (!this._legalNamespace.test(e))
            throw new Error(
              "store.js namespaces can only have alhpanumerics + underscores and dashes"
            );
          var n = "__storejs_" + e + "_";
          return c(this, {
            _namespacePrefix: n,
            _namespaceRegexp: n ? new RegExp("^" + n) : null,
          });
        },
        createStore: function (e, n) {
          return p(e, n);
        },
      };
      function p(e, n) {
        var t = {
            _seenPlugins: [],
            _namespacePrefix: "",
            _namespaceRegexp: null,
            _legalNamespace: /^[a-zA-Z0-9_\-]+$/,
            _storage: function () {
              if (!this.enabled)
                throw new Error(
                  "store.js: No supported storage has been added! Add one (e.g store.addStorage(require('store/storages/cookieStorage')) or use a build with more built-in storages (e.g https://github.com/marcuswestin/store.js/tree/master/dist/store.legacy.min.js)"
                );
              return this._storage.resolved;
            },
            _testStorage: function (e) {
              try {
                var n = "__storejs__test__";
                e.write(n, n);
                var t = e.read(n) === n;
                return e.remove(n), t;
              } catch (r) {
                return !1;
              }
            },
            _assignPluginFnProp: function (e, n) {
              var t = this[n];
              this[n] = function () {
                var n = a(arguments, 0),
                  r = this;
                function o() {
                  if (t)
                    return (
                      i(arguments, function (e, t) {
                        n[t] = e;
                      }),
                      t.apply(r, n)
                    );
                }
                var c = [o].concat(n);
                return e.apply(r, c);
              };
            },
            _serialize: function (e) {
              return JSON.stringify(e);
            },
            _deserialize: function (e, n) {
              if (!e) return n;
              var t = "";
              try {
                t = JSON.parse(e);
              } catch (r) {
                t = e;
              }
              return void 0 !== t ? t : n;
            },
          },
          r = c(t, d);
        return (
          i(e, function (e) {
            r.addStorage(e);
          }),
          i(n, function (e) {
            r.addPlugin(e);
          }),
          r
        );
      }
    },
    69078: function (e, n, t) {
      var r = Object.assign
          ? Object.assign
          : function (e, n, t, r) {
              for (var a = 1; a < arguments.length; a++)
                l(Object(arguments[a]), function (n, t) {
                  e[t] = n;
                });
              return e;
            },
        a = (function () {
          if (Object.create)
            return function (e, n, t, a) {
              var o = c(arguments, 1);
              return r.apply(this, [Object.create(e)].concat(o));
            };
          {
            function e() {}
            return function (n, t, a, o) {
              var i = c(arguments, 1);
              return (e.prototype = n), r.apply(this, [new e()].concat(i));
            };
          }
        })(),
        o = String.prototype.trim
          ? function (e) {
              return String.prototype.trim.call(e);
            }
          : function (e) {
              return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
            },
        i = "undefined" !== typeof window ? window : t.g;
      function c(e, n) {
        return Array.prototype.slice.call(e, n || 0);
      }
      function l(e, n) {
        s(e, function (e, t) {
          return n(e, t), !1;
        });
      }
      function s(e, n) {
        if (u(e)) {
          for (var t = 0; t < e.length; t++) if (n(e[t], t)) return e[t];
        } else
          for (var r in e) if (e.hasOwnProperty(r) && n(e[r], r)) return e[r];
      }
      function u(e) {
        return (
          null != e && "function" != typeof e && "number" == typeof e.length
        );
      }
      e.exports = {
        assign: r,
        create: a,
        trim: o,
        bind: function (e, n) {
          return function () {
            return n.apply(e, Array.prototype.slice.call(arguments, 0));
          };
        },
        slice: c,
        each: l,
        map: function (e, n) {
          var t = u(e) ? [] : {};
          return (
            s(e, function (e, r) {
              return (t[r] = n(e, r)), !1;
            }),
            t
          );
        },
        pluck: s,
        isList: u,
        isFunction: function (e) {
          return e && "[object Function]" === {}.toString.call(e);
        },
        isObject: function (e) {
          return e && "[object Object]" === {}.toString.call(e);
        },
        Global: i,
      };
    },
    39627: function (e, n, t) {
      var r = t(69078).Global;
      function a() {
        return r.localStorage;
      }
      function o(e) {
        return a().getItem(e);
      }
      e.exports = {
        name: "localStorage",
        read: o,
        write: function (e, n) {
          return a().setItem(e, n);
        },
        each: function (e) {
          for (var n = a().length - 1; n >= 0; n--) {
            var t = a().key(n);
            e(o(t), t);
          }
        },
        remove: function (e) {
          return a().removeItem(e);
        },
        clearAll: function () {
          return a().clear();
        },
      };
    },
    8728: function (e) {
      e.exports = {
        name: "memoryStorage",
        read: function (e) {
          return n[e];
        },
        write: function (e, t) {
          n[e] = t;
        },
        each: function (e) {
          for (var t in n) n.hasOwnProperty(t) && e(n[t], t);
        },
        remove: function (e) {
          delete n[e];
        },
        clearAll: function (e) {
          n = {};
        },
      };
      var n = {};
    },
  },
]);
//# sourceMappingURL=190-f8e4908184babe6d.js.map
