(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [469],
  {
    65424: function (e, t, r) {
      "use strict";
      r.r(t),
        r.d(t, {
          __N_SSG: function () {
            return mi;
          },
          default: function () {
            return vi;
          },
        });
      var n = r(59499),
        i = r(9008),
        o = r.n(i),
        s = r(67294),
        a = r(8777),
        c = r(85893),
        u = function (e) {
          var t = e.schemaMarkup;
          return (0, c.jsx)("script", {
            type: "application/ld+json",
            dangerouslySetInnerHTML: { __html: JSON.stringify(t) },
          });
        },
        l = r(22986),
        p = r(75397),
        d = r(65132),
        f = r(28334),
        h = r(24757),
        g = r(30784),
        m = r(4730),
        v = r(92777),
        y = r(82262),
        b = r(45959),
        _ = r(63553),
        x = r(37247),
        O = r(71218),
        j = r(28538),
        P = r(36834),
        w = r(22188),
        k = r(45295),
        C = r(24076),
        Z = r(78270);
      function S(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var T,
        E,
        N = (function (e) {
          (0, b.Z)(r, e);
          var t = S(r);
          function r(e) {
            var n,
              i = e.useCase;
            return (
              (0, v.Z)(this, r),
              ((n = t.call(this, "ToastImpressionEvent")).useCase = void 0),
              (n.useCase = i),
              n
            );
          }
          return (0, y.Z)(r);
        })(C.rp),
        R = function (e) {
          Z.j.publishEvent(new N({ useCase: e }));
        },
        D = ["impressionUseCase"];
      function I(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function A(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var L =
          ((E = (function (e) {
            (0, b.Z)(r, e);
            var t = A(r);
            function r() {
              return (0, v.Z)(this, r), t.apply(this, arguments);
            }
            return (
              (0, y.Z)(r, [
                {
                  key: "componentDidMount",
                  value: function () {
                    var e = this;
                    this.props.uiMessages.forEach(function (e) {
                      var t = e.impressionUseCase,
                        r = (0, m.Z)(e, D);
                      j.n.addAlertBannerToast(r, {
                        autoDismiss: !0,
                        impressionUseCase: t,
                        onToastImpression: R,
                      });
                    }),
                      (this.digestQueueDisposer = (0, w.EH)(function () {
                        for (; k.Z.feedbacks.length > 0; ) e.feedToaster();
                      }));
                  },
                },
                {
                  key: "componentWillUnmount",
                  value: function () {
                    this.digestQueueDisposer && this.digestQueueDisposer();
                  },
                },
                {
                  key: "feedToaster",
                  value: function () {
                    var e = k.Z.feedbacks.shift(),
                      t = e.alertBannerProps,
                      r = e.toastOptions;
                    j.n.addAlertBannerToast(
                      t,
                      (function (e) {
                        for (var t = 1; t < arguments.length; t++) {
                          var r = null != arguments[t] ? arguments[t] : {};
                          t % 2
                            ? I(Object(r), !0).forEach(function (t) {
                                (0, n.Z)(e, t, r[t]);
                              })
                            : Object.getOwnPropertyDescriptors
                            ? Object.defineProperties(
                                e,
                                Object.getOwnPropertyDescriptors(r)
                              )
                            : I(Object(r)).forEach(function (t) {
                                Object.defineProperty(
                                  e,
                                  t,
                                  Object.getOwnPropertyDescriptor(r, t)
                                );
                              });
                        }
                        return e;
                      })({ onToastImpression: R }, r)
                    );
                  },
                },
                {
                  key: "render",
                  value: function () {
                    return (0, c.jsx)(P.x, {});
                  },
                },
              ]),
              r
            );
          })(s.Component)),
          (E.defaultProps = { uiMessages: [] }),
          (T = E),
          (0, O.Z)(
            T.prototype,
            "feedToaster",
            [w.aD],
            Object.getOwnPropertyDescriptor(T.prototype, "feedToaster"),
            T.prototype
          ),
          T),
        M = "all",
        z = "free",
        U = "all",
        B = "free",
        V = r(71361),
        G = r(79594),
        F = r(5279),
        q = r(98460),
        H = r(28017),
        W = r(11577),
        K = r.n(W),
        Q = r(62259),
        J = r.n(Q),
        X = r(54742),
        Y = r(45566),
        $ = r(94184),
        ee = r.n($),
        te = r(51926),
        re = r.n(te),
        ne = (0, y.Z)(function e(t, r) {
          (0, v.Z)(this, e),
            (this.searchParams = new URLSearchParams(
              "q=".concat(t.title, "&p=1&price=price-free")
            )),
            (this.unit = [
              {
                title: r("Free courses"),
                content: [
                  { is_active: !0, text: r("Online video content") },
                  { is_active: !1, text: r("Certificate of completion") },
                  { is_active: !1, text: r("Instructor Q&A") },
                  { is_active: !1, text: r("Instructor direct message") },
                ],
              },
              {
                title: r("Paid courses"),
                content: [
                  { is_active: !0, text: r("Online video content") },
                  { is_active: !0, text: r("Certificate of completion") },
                  { is_active: !0, text: r("Instructor Q&A") },
                  { is_active: !0, text: r("Instructor direct message") },
                ],
              },
            ]);
        }),
        ie = r(89530),
        oe = function (e) {
          var t = (0, G.QT)().gettext;
          return (0, c.jsx)(F.l, {
            children: (0, c.jsx)("div", {
              className: ee()(e.className, {
                "ud-full-width-container": e.fullWidth,
              }),
              children: (0, c.jsx)(ie.Y, {
                showCta: !1,
                title: t(
                  "Not sure? All courses have a 30-day money-back guarantee"
                ),
              }),
            }),
          });
        };
      oe.defaultProps = { className: "", fullWidth: !1 };
      var se = s.memo(oe),
        ae = function (e) {
          var t = e.topicData,
            r = e.className,
            i = (0, G.QT)(),
            o = i.gettext,
            s = i.interpolate;
          if (!t || !t.name) return null;
          var a = new ne(t, o).unit.map(function (e, t) {
            return (0, c.jsxs)(
              "div",
              {
                className: re().list,
                "data-purpose": "comparison-module-list",
                children: [
                  (0, c.jsx)("h4", {
                    className: ee()("ud-heading-lg", re()["module-title"]),
                    children: e.title,
                  }),
                  (0, c.jsx)(X.W, {
                    size: "large",
                    padding: "tight",
                    children: e.content.map(function (e, t) {
                      return (0,
                      c.jsx)(X.W.Item, { icon: e.is_active ? (0, c.jsx)(J(), { label: !1, color: "positive" }) : (0, c.jsx)(K(), { label: !1, color: "negative" }), className: ee()((0, n.Z)({}, re()["is-active"], e.is_active)), children: e.text }, t);
                    }),
                  }),
                ],
              },
              t
            );
          });
          return (0, c.jsx)(F.l, {
            children: (0, c.jsxs)("div", {
              className: ee()("ud-container", r, re().wrapper),
              children: [
                (0, c.jsxs)("div", {
                  className: re().header,
                  children: [
                    (0, c.jsx)("h2", {
                      className: ee()("ud-heading-lg", re()["unit-title"]),
                      children: o("Try free courses or enroll in paid courses"),
                    }),
                    (0, c.jsx)(se, {
                      fullWidth: !1,
                      className: re()["refund-notice"],
                    }),
                    (0, c.jsx)(Y.zx, {
                      componentClass: "a",
                      className: re()["view-more-button"],
                      href: t.topic_channel_url,
                      udStyle: "secondary",
                      children: s(
                        o("View paid %(topicTitle)s courses"),
                        { topicTitle: t.name },
                        !0
                      ),
                    }),
                  ],
                }),
                (0, c.jsx)("div", {
                  className: re()["comparison-lists"],
                  children: a,
                }),
              ],
            }),
          });
        };
      ae.defaultProps = { topicData: void 0, className: "" };
      var ce = ae,
        ue = r(69646),
        le = r(52466),
        pe = r(80955),
        de = r(74256),
        fe = r(5962),
        he = r(29147),
        ge = r(44020),
        me = r(11884),
        ve = r(74404),
        ye = r(33724);
      var be = r(74277),
        _e = r.n(be),
        xe = ["className", "imageStyle", "lineCount", "size", "width"];
      function Oe(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function je(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Oe(Object(r), !0).forEach(function (t) {
                (0, n.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Oe(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function Pe(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var we = (function (e) {
        (0, b.Z)(r, e);
        var t = Pe(r);
        function r() {
          return (0, v.Z)(this, r), t.apply(this, arguments);
        }
        return (
          (0, y.Z)(r, [
            {
              key: "render",
              value: function () {
                var e,
                  t,
                  r,
                  i = this.props,
                  o = i.className,
                  s = i.imageStyle,
                  a = i.lineCount,
                  u = i.size,
                  l = i.width,
                  p = (0, m.Z)(i, xe);
                return (0, c.jsxs)(
                  ve.O,
                  je(
                    je({}, p),
                    {},
                    ((t = {
                      className: o,
                      "data-purpose": "course-card-skeleton",
                    }),
                    (0, n.Z)(
                      t,
                      "className",
                      ee()(
                        ((e = {}),
                        (0, n.Z)(e, _e()["skeleton-fixed"], "fixed" === l),
                        (0, n.Z)(
                          e,
                          _e()["skeleton-flexible"],
                          "flexible" === l
                        ),
                        (0, n.Z)(e, _e()["skeleton-small"], "small" === u),
                        (0, n.Z)(e, _e()["skeleton-medium"], "medium" === u),
                        (0, n.Z)(e, _e()["skeleton-large"], "large" === u),
                        e)
                      )
                    ),
                    (0, n.Z)(t, "children", [
                      (0, c.jsx)(ye.g, { style: s, className: _e().image }),
                      (0, c.jsxs)("div", {
                        style: { flex: 1 },
                        children: [
                          (0, c.jsx)(ye.g, { className: _e().title }),
                          ((r = a),
                          Array(r)
                            .fill("_")
                            .map(function (e, t) {
                              return t;
                            })).map(function (e) {
                            return (0,
                            c.jsx)(ye.g, { className: _e().line }, e);
                          }),
                        ],
                      }),
                    ]),
                    t)
                  )
                );
              },
            },
          ]),
          r
        );
      })(s.Component);
      we.defaultProps = {
        className: null,
        imageStyle: null,
        lineCount: 3,
        size: "medium",
        width: "flexible",
      };
      var ke,
        Ce,
        Ze,
        Se,
        Te,
        Ee,
        Ne,
        Re,
        De,
        Ie = r(12568),
        Ae = r(5338),
        Le = r(50029),
        Me = r(12831),
        ze = r(87794),
        Ue = r.n(ze),
        Be = r(56163),
        Ve = r(43277);
      function Ge(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function Fe(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Ge(Object(r), !0).forEach(function (t) {
                (0, n.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Ge(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var qe,
        He =
          ((ke = w.LO.ref),
          (Ce = w.LO.ref),
          (Ze = w.LO.ref),
          (Se = (function () {
            function e(t) {
              var r = t.pageType,
                n = t.pageObjectId,
                i = t.globalOverrides;
              (0, v.Z)(this, e),
                (this.pageIndex = void 0),
                (this.pageType = void 0),
                (this.pageObjectId = void 0),
                (this.backendSource =
                  Be.YV.backendSourceOptions.DISCOVERY_ALL_COURSES),
                (0, Me.Z)(this, "unit", Te, this),
                (0, Me.Z)(this, "items", Ee, this),
                (0, Me.Z)(this, "loading", Ne, this),
                (0, Me.Z)(this, "error", Re, this),
                (0, Me.Z)(this, "hasMore", De, this),
                (this.discoveryAPI = void 0),
                (this.pageIndex = 1),
                (this.pageType = r),
                (this.pageObjectId = Number(n)),
                (this.discoveryAPI = new Ve.Z(
                  {},
                  null !== i && void 0 !== i ? i : {}
                ));
            }
            return (
              (0, y.Z)(e, [
                {
                  key: "prefetchKey",
                  get: function () {
                    return "topic" === this.pageType
                      ? this.pageType
                      : "".concat(this.pageType, "_all_courses");
                  },
                },
                {
                  key: "fetchUnit",
                  value: (function () {
                    var e = (0, Le.Z)(
                      Ue().mark(function e(t) {
                        var r;
                        return Ue().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  if (
                                    ((t.prefetchKey = this.prefetchKey),
                                    (t.p = this.pageIndex),
                                    this.hasMore && !this.loading)
                                  ) {
                                    e.next = 4;
                                    break;
                                  }
                                  return e.abrupt("return");
                                case 4:
                                  return (
                                    (e.prev = 4),
                                    (this.loading = !0),
                                    (e.next = 8),
                                    this.discoveryAPI.loadCourses(
                                      this.pageType,
                                      Fe({ pageObjectId: this.pageObjectId }, t)
                                    )
                                  );
                                case 8:
                                  return (
                                    (r = e.sent),
                                    this.receiveUnit(r),
                                    e.abrupt("return", r)
                                  );
                                case 13:
                                  (e.prev = 13),
                                    (e.t0 = e.catch(4)),
                                    this.receiveUnitError(e.t0);
                                case 16:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[4, 13]]
                        );
                      })
                    );
                    return function (t) {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "receiveUnit",
                  value: function (e) {
                    (this.hasMore = !!e.remaining_item_count),
                      0 < e.remaining_item_count && (this.pageIndex += 1),
                      (this.loading = !1),
                      (0, Ae.q)(e.items),
                      (this.items = this.items.concat(e.items));
                  },
                },
                {
                  key: "receiveUnitError",
                  value: function (e) {
                    (this.loading = !1), (this.error = e);
                  },
                },
              ]),
              e
            );
          })()),
          (Te = (0, O.Z)(Se.prototype, "unit", [ke], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Ee = (0, O.Z)(Se.prototype, "items", [Ce], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (Ne = (0, O.Z)(Se.prototype, "loading", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (Re = (0, O.Z)(Se.prototype, "error", [Ze], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (De = (0, O.Z)(Se.prototype, "hasMore", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !0;
            },
          })),
          (0, O.Z)(
            Se.prototype,
            "fetchUnit",
            [w.aD],
            Object.getOwnPropertyDescriptor(Se.prototype, "fetchUnit"),
            Se.prototype
          ),
          (0, O.Z)(
            Se.prototype,
            "receiveUnit",
            [w.aD],
            Object.getOwnPropertyDescriptor(Se.prototype, "receiveUnit"),
            Se.prototype
          ),
          (0, O.Z)(
            Se.prototype,
            "receiveUnitError",
            [w.aD],
            Object.getOwnPropertyDescriptor(Se.prototype, "receiveUnitError"),
            Se.prototype
          ),
          Se),
        We = r(12624),
        Ke = r.n(We);
      function Qe(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function Je(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var Xe =
          (0, pe.Pi)(
            (qe = (function (e) {
              (0, b.Z)(r, e);
              var t = Je(r);
              function r(e) {
                var i;
                (0, v.Z)(this, r),
                  ((i = t.call(this, e)).store = void 0),
                  (i.fetchData = function () {
                    return i.store.fetchUnit(
                      (function (e) {
                        for (var t = 1; t < arguments.length; t++) {
                          var r = null != arguments[t] ? arguments[t] : {};
                          t % 2
                            ? Qe(Object(r), !0).forEach(function (t) {
                                (0, n.Z)(e, t, r[t]);
                              })
                            : Object.getOwnPropertyDescriptors
                            ? Object.defineProperties(
                                e,
                                Object.getOwnPropertyDescriptors(r)
                              )
                            : Qe(Object(r)).forEach(function (t) {
                                Object.defineProperty(
                                  e,
                                  t,
                                  Object.getOwnPropertyDescriptor(r, t)
                                );
                              });
                        }
                        return e;
                      })({}, i.props.presetFilters)
                    );
                  });
                var o = i.props,
                  s = o.pageObjectId,
                  a = o.pageType;
                return (i.store = new He({ pageType: a, pageObjectId: s })), i;
              }
              return (
                (0, y.Z)(r, [
                  {
                    key: "componentDidMount",
                    value: function () {
                      this.fetchData();
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this,
                        t = this.props.isMobile;
                      if (!this.store.items.length && this.store.loading)
                        return (0, c.jsx)(he.Z, {
                          className: this.props.className,
                          layout: "singlerow",
                        });
                      var r = this.store.items.map(function (t, r) {
                        return (0,
                        c.jsx)(de.G, { trackingContext: { trackImpressionFunc: Ae.R.trackDiscoveryImpression, index: r, backendSource: e.store.backendSource }, children: (0, c.jsx)(ge.V, { course: t, courseCard: (0, c.jsx)(Ie.Z, { course: t }) }) }, t.id);
                      });
                      return (
                        this.store.hasMore &&
                          t &&
                          r.push(
                            (0, c.jsx)(we, { size: "medium" }, r.length + 1)
                          ),
                        (0, c.jsx)(fe.Xg, {
                          pageType: this.props.pageType,
                          children: (0, c.jsxs)("div", {
                            className: this.props.className,
                            children: [
                              (0, c.jsx)("h2", {
                                className: ee()("ud-heading-xl", Ke().heading),
                                "data-purpose": "heading",
                                children: gettext("Free learning on Udemy"),
                              }),
                              (0, c.jsx)(me.l, {
                                fullViewport: t,
                                showPager: !t,
                                allowScroll: t,
                                onLoadMore: this.fetchData,
                                pagerButtonClassName: Ke()["pager-button"],
                                className: Ke().grid,
                                children: r,
                              }),
                            ],
                          }),
                        })
                      );
                    },
                  },
                ]),
                r
              );
            })(s.Component))
          ) || qe,
        Ye = r(14556),
        $e = r(76173),
        et = r.n($e);
      function tt(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function rt(e, t) {
        var r =
          ("undefined" !== typeof Symbol && e[Symbol.iterator]) ||
          e["@@iterator"];
        if (!r) {
          if (
            Array.isArray(e) ||
            (r = (function (e, t) {
              if (!e) return;
              if ("string" === typeof e) return nt(e, t);
              var r = Object.prototype.toString.call(e).slice(8, -1);
              "Object" === r && e.constructor && (r = e.constructor.name);
              if ("Map" === r || "Set" === r) return Array.from(e);
              if (
                "Arguments" === r ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
              )
                return nt(e, t);
            })(e)) ||
            (t && e && "number" === typeof e.length)
          ) {
            r && (e = r);
            var n = 0,
              i = function () {};
            return {
              s: i,
              n: function () {
                return n >= e.length
                  ? { done: !0 }
                  : { done: !1, value: e[n++] };
              },
              e: function (e) {
                throw e;
              },
              f: i,
            };
          }
          throw new TypeError(
            "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        }
        var o,
          s = !0,
          a = !1;
        return {
          s: function () {
            r = r.call(e);
          },
          n: function () {
            var e = r.next();
            return (s = e.done), e;
          },
          e: function (e) {
            (a = !0), (o = e);
          },
          f: function () {
            try {
              s || null == r.return || r.return();
            } finally {
              if (a) throw o;
            }
          },
        };
      }
      function nt(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n;
      }
      function it(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var ot = Be.YV.backendSourceOptions.RELATED_LECTURES;
      function st(e) {
        var t = e.presetValue,
          r = e.topicTitle,
          n = e.url,
          i = (0, G.QT)(),
          o = i.gettext,
          s = i.interpolate;
        return (0, c.jsx)(Y.zx, {
          componentClass: "a",
          href: n,
          udStyle: "ghost",
          children: s(
            o("View %(topicType)s %(topicTitle)s courses"),
            { topicType: t, topicTitle: r },
            !0
          ),
        });
      }
      var at = (function (e) {
        (0, b.Z)(r, e);
        var t = it(r);
        function r() {
          return (0, v.Z)(this, r), t.apply(this, arguments);
        }
        return (
          (0, y.Z)(r, [
            {
              key: "getPagesAndUrl",
              value: function () {
                var e,
                  t = this.props,
                  r = t.relatedPages,
                  n = t.presetValue,
                  i = [],
                  o = null,
                  s = rt(r);
                try {
                  for (s.s(); !(e = s.n()).done; ) {
                    var a = e.value;
                    if ("course_label" === a.type) {
                      var c = a.kwargs.preset_filter_val === z && n !== z,
                        u = a.kwargs.preset_filter_val === M && n !== M;
                      (c || u) && (o = a.url);
                    } else "course_label" !== a.type && i.push(a);
                  }
                } catch (l) {
                  s.e(l);
                } finally {
                  s.f();
                }
                return { pages: i, url: o };
              },
            },
            {
              key: "getHeader",
              value: function () {
                var e = this.props.alternateHeadline;
                return e
                  ? (0, c.jsx)(
                      H.Z,
                      (function (e) {
                        for (var t = 1; t < arguments.length; t++) {
                          var r = null != arguments[t] ? arguments[t] : {};
                          t % 2
                            ? tt(Object(r), !0).forEach(function (t) {
                                (0, n.Z)(e, t, r[t]);
                              })
                            : Object.getOwnPropertyDescriptors
                            ? Object.defineProperties(
                                e,
                                Object.getOwnPropertyDescriptors(r)
                              )
                            : tt(Object(r)).forEach(function (t) {
                                Object.defineProperty(
                                  e,
                                  t,
                                  Object.getOwnPropertyDescriptor(r, t)
                                );
                              });
                        }
                        return e;
                      })({ titleTag: "h2" }, e)
                    )
                  : (0, c.jsx)("h2", {
                      className: et()["unit-title"],
                      children: this.props.gettext("Related pages"),
                    });
              },
            },
            {
              key: "render",
              value: function () {
                var e = this.props.isMobile,
                  t = this.getPagesAndUrl(),
                  r = t.pages,
                  n = t.url;
                if (!r.length) return null;
                var i = this.props.presetValue === z ? "all" : "free";
                return (0, c.jsx)(de.G, {
                  trackingContext: {
                    trackImpressionFunc: Ae.R.trackDiscoveryImpression,
                    backendSource: ot,
                  },
                  children: (0, c.jsxs)("div", {
                    className: this.props.className,
                    "data-purpose": "related-pages",
                    children: [
                      this.getHeader(),
                      (0, c.jsx)(me.l, {
                        fullViewport: e,
                        showPager: !e,
                        allowScroll: !!e,
                        children: r.map(function (e, t) {
                          var r = e.tracking_id
                              ? "".concat(e.tracking_id)
                              : "useless-".concat(e.lecture_id, "-").concat(t),
                            n = {
                              id: e.lecture_id,
                              type: e.type,
                              tracking_id: r,
                            };
                          return (0,
                          c.jsx)(Ye.c, { data: e, trackingData: n, index: t }, t);
                        }),
                      }),
                      this.props.showViewAllLink &&
                        n &&
                        (0, c.jsx)(st, {
                          presetValue: i,
                          topicTitle: this.props.topic.name,
                          url: n,
                        }),
                    ],
                  }),
                });
              },
            },
          ]),
          r
        );
      })(s.Component);
      at.defaultProps = {
        showViewAllLink: !0,
        experiment: { variant: "control" },
        isMobile: !1,
      };
      var ct,
        ut,
        lt = (0, G.GV)(at),
        pt = r(2975),
        dt = r.n(pt),
        ft = r(97351),
        ht = r(14582),
        gt = r.n(ht);
      function mt(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function vt(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? mt(Object(r), !0).forEach(function (t) {
                (0, n.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : mt(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function yt(e) {
        var t = e.enrollmentStat,
          r = e.className,
          n = (0, G.QT)(),
          i = n.gettext,
          o = n.interpolate;
        return (0, c.jsxs)("p", {
          className: ee()(r, gt().container),
          "data-purpose": "topic-enrollment-stats",
          children: [
            (0, c.jsx)(dt(), { label: !1, size: "small" }),
            (0, c.jsx)(
              "span",
              vt(
                { className: ee()("ud-text-sm", gt().text) },
                (0, ft.S)({
                  descriptionOfCaller:
                    "topic-enrollment-stats:num-students-learning",
                  dataPurpose: "Number of learners",
                  html: o(
                    i("%(numStudents)s learners"),
                    { numStudents: t },
                    !0
                  ),
                })
              )
            ),
          ],
        });
      }
      function bt(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function _t(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? bt(Object(r), !0).forEach(function (t) {
                (0, n.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : bt(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function xt(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var Ot =
          (0, V.lK)({ isMobile: "mobile-max" })(
            ((ut = (function (e) {
              (0, b.Z)(r, e);
              var t = xt(r);
              function r() {
                return (0, v.Z)(this, r), t.apply(this, arguments);
              }
              return (
                (0, y.Z)(r, [
                  {
                    key: "presetFilters",
                    get: function () {
                      return this.props.presetValue === z
                        ? (0, n.Z)({}, le.N5, "price-free")
                        : {};
                    },
                  },
                  {
                    key: "topic",
                    get: function () {
                      return _t(
                        _t({}, this.props.topic),
                        {},
                        { topic_channel_url: this.props.topic.url }
                      );
                    },
                  },
                  {
                    key: "filterDiscoveryUnit",
                    value: function (e) {
                      return ![
                        "discovery_value_props",
                        "algorithm_based_occupation",
                      ].includes(e.type);
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = !!this.props.isMobile,
                        t = e ? "mobile" : "desktop",
                        r = {
                          CourseUnit: {
                            fullWidth: e,
                            showTitle: !0,
                            showPager: !e,
                            layout: e ? "multirow" : "singlerow",
                            allowScroll: e,
                          },
                        },
                        n = this.props,
                        i = n.gettext,
                        o = n.interpolate;
                      return (0, c.jsxs)("div", {
                        className: "ud-container ud-page-wrapper",
                        children: [
                          (0, c.jsx)(H.Z, {
                            title: this.props.topicTitle,
                            className: "component-margin",
                            titleTag: "h1",
                            titleClass: "ud-heading-serif-xxl",
                            titleStyle: "topic-page-title",
                          }),
                          (0, c.jsxs)(q.Z, {
                            alternateHeadline: {
                              title: o(
                                i("Get more with paid %(topic)s courses"),
                                { topic: this.props.topic.name },
                                !0
                              ),
                              secondaryText: i(
                                "Enroll in our in-depth courses from top-rated instructors"
                              ),
                            },
                            showTitle: !1,
                            pageType: le.AA,
                            pageObjectId: this.props.topic.id,
                            deviceType: t,
                            filter: this.filterDiscoveryUnit,
                            unitPropsByType: r,
                            children: [
                              this.props.enrollmentStat &&
                                (0, c.jsx)(yt, {
                                  enrollmentStat: this.props.enrollmentStat,
                                  "data-item-index": 0,
                                  className: "component-margin",
                                }),
                              (0, c.jsx)(Xe, {
                                isMobile: e,
                                pageType: le.AA,
                                pageObjectId: parseInt(this.props.topic.id, 10),
                                presetFilters: this.presetFilters,
                                "data-item-index": 0,
                                className: "component-margin",
                              }),
                              (0, c.jsx)("div", {
                                className: "component-margin",
                                "data-item-index": 0,
                                children: (0, c.jsx)(lt, {
                                  alternateHeadline: {
                                    title: o(
                                      i("Free %(topicName)s lessons"),
                                      { topicName: this.props.topic.name },
                                      !0
                                    ),
                                    secondaryText: i(
                                      "Bite-sized learning in minutes"
                                    ),
                                  },
                                  presetValue: this.props.presetValue,
                                  relatedPages: this.props.relatedPages,
                                  topic: this.props.topic,
                                  showViewAllLink: !1,
                                  isMobile: e,
                                }),
                              }),
                              (0, c.jsx)(ce, {
                                className: "component-margin",
                                "data-item-index": 1,
                                topicData: this.topic,
                              }),
                            ],
                          }),
                          (0, c.jsx)(F.l, {
                            children:
                              this.props.questionsAndAnswers.length > 0 &&
                              (0, c.jsx)("div", {
                                className: "component-margin",
                                children: (0, c.jsx)(ue.B, {
                                  questionsAndAnswers:
                                    this.props.questionsAndAnswers,
                                  defaultExpanded: !0,
                                }),
                              }),
                          }),
                        ],
                      });
                    },
                  },
                ]),
                r
              );
            })(s.Component)),
            (ut.defaultProps = {
              presetValue: z,
              relatedPages: [],
              questionsAndAnswers: [],
              isMobile: !1,
            }),
            (ct = ut))
          ) || ct,
        jt = (0, G.GV)(Ot),
        Pt = r(10748),
        wt = r(11163),
        kt = r(35694),
        Ct = r(36186),
        Zt = r(32818),
        St = r(90116),
        Tt = r(83998),
        Et = r.n(Tt),
        Nt = function (e) {
          var t = e.className,
            r = void 0 === t ? "" : t;
          return (0, c.jsx)("div", {
            className: ee()(Et()["skeleton-title"], r),
            "data-purpose": "discovery-units-skeleton-title",
          });
        },
        Rt = function (e) {
          var t = e.courseCount,
            r = Et()["course-info"];
          return (0, c.jsx)(ve.O, {
            children: (0, c.jsxs)("div", {
              className: Et()["skeleton-unit skeleton-spacing"],
              "data-purpose": "discovery-units-skeleton-course-carousel",
              children: [
                (0, c.jsx)(Nt, {}),
                (0, c.jsx)("div", {
                  className: Et().carousel,
                  children: (0, St.Z)(Array(t).keys()).map(function (e) {
                    return (0,
                    c.jsxs)("div", { className: Et()["course-container"], children: [(0, c.jsx)("div", { className: Et()["course-image-lg"] }), (0, c.jsxs)("div", { className: Et()["info-container"], children: [(0, c.jsx)("div", { className: r }), (0, c.jsx)("div", { className: r }), (0, c.jsx)("div", { className: r }), (0, c.jsx)("div", { className: r })] })] }, e);
                  }),
                }),
              ],
            }),
          });
        },
        Dt = function (e) {
          var t = e.courseCount,
            r = Et()["course-info"];
          return (0, c.jsxs)("div", {
            className: ee()(Et()["skeleton-unit"], Et()["skeleton-spacing"]),
            "data-purpose": "discovery-units-skeleton-course-list",
            children: [
              (0, c.jsx)("div", { className: Et().title }),
              (0, St.Z)(Array(t).keys()).map(function (e) {
                return (0,
                c.jsxs)("div", { className: Et()["skeleton-card"], children: [(0, c.jsx)("div", { className: Et()["course-image"] }), (0, c.jsxs)("div", { className: Et()["info-container"], children: [(0, c.jsx)("div", { className: r }), (0, c.jsx)("div", { className: r }), (0, c.jsx)("div", { className: r }), (0, c.jsx)("div", { className: r })] })] }, e);
              }),
            ],
          });
        },
        It = r(10249),
        At = r(19227),
        Lt = r(80344),
        Mt = r(41293),
        zt = r(15899),
        Ut = r(50771),
        Bt = r(29029),
        Vt = r.n(Bt),
        Gt = [
          "className",
          "refParam",
          "linkParams",
          "isOnsiteRequestDemo",
          "gettext",
          "interpolate",
          "udData",
        ];
      function Ft(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function qt(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Ft(Object(r), !0).forEach(function (t) {
                (0, n.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Ft(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function Ht(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var Wt = { className: Vt().logos, imageHeight: 44 },
        Kt = (function (e) {
          (0, b.Z)(r, e);
          var t = Ht(r);
          function r() {
            var e;
            (0, v.Z)(this, r);
            for (var n = arguments.length, i = new Array(n), o = 0; o < n; o++)
              i[o] = arguments[o];
            return (
              ((e = t.call.apply(t, [this].concat(i))).handleClick =
                function () {
                  var t = e.props,
                    r = t.refParam,
                    n = t.udData;
                  Z.j.publishEvent(
                    new Be.Nj({ locale: n.request.locale, placement: r })
                  );
                }),
              e
            );
          }
          return (
            (0, y.Z)(
              r,
              [
                {
                  key: "render",
                  value: function () {
                    var e = this.props,
                      t = e.className,
                      n = e.refParam,
                      i = e.linkParams,
                      o = e.isOnsiteRequestDemo,
                      s = e.gettext,
                      a = e.interpolate,
                      u = e.udData,
                      l = (0, m.Z)(e, Gt),
                      p = u.Config,
                      d = u.request;
                    return (0, c.jsx)(F.l, {
                      children: (0, c.jsx)("div", {
                        "data-purpose": "top-companies-wrapper",
                        children: (0, c.jsx)(
                          zt.M,
                          qt(
                            qt(
                              {
                                background: "light",
                                title: s("Top companies trust Udemy"),
                                titleClassName: "ud-heading-serif-lg",
                                subtitle: a(
                                  s(
                                    "Get your team access to Udemy's top %(num_courses)s+ courses"
                                  ),
                                  { num_courses: (0, Ut.H)("num_courses") },
                                  !0
                                ),
                                submitButtonText: s("Try Udemy Business"),
                                submitButtonProps: {
                                  udStyle: "secondary",
                                  size: "medium",
                                  componentClass: "a",
                                  href: (0, Lt.WV)(
                                    "request-demo",
                                    qt(qt({}, i), {}, { ref: n }),
                                    o,
                                    { Config: p, request: d }
                                  ),
                                  onClick: this.handleClick,
                                  target: o ? null : "_blank",
                                  rel: o ? null : "noopener",
                                },
                              },
                              l
                            ),
                            {},
                            {
                              className: ee()(Vt()["background-container"], t),
                              children: r.renderLogos(Wt, { Config: p }),
                            }
                          )
                        ),
                      }),
                    });
                  },
                },
              ],
              [
                {
                  key: "renderLogos",
                  value: function () {
                    var e =
                        arguments.length > 0 && void 0 !== arguments[0]
                          ? arguments[0]
                          : Wt,
                      t =
                        arguments.length > 1 && void 0 !== arguments[1]
                          ? arguments[1]
                          : {};
                    return (0, c.jsxs)("div", {
                      className: e.className,
                      children: [
                        (0, c.jsx)(Mt.E, {
                          src: Ct.qJ.toStorageStaticAsset(
                            "partner-logos/v4/nasdaq-dark.svg",
                            t
                          ),
                          alt: "Nasdaq",
                          height: e.imageHeight,
                          width: 115,
                        }),
                        (0, c.jsx)(Mt.E, {
                          src: Ct.qJ.toStorageStaticAsset(
                            "partner-logos/v4/volkswagen-dark.svg",
                            t
                          ),
                          alt: "Volkswagen",
                          height: e.imageHeight,
                          width: 44,
                        }),
                        (0, c.jsx)(Mt.E, {
                          src: Ct.qJ.toStorageStaticAsset(
                            "partner-logos/v4/box-dark.svg",
                            t
                          ),
                          alt: "Box",
                          height: e.imageHeight,
                          width: 67,
                        }),
                        (0, c.jsx)(Mt.E, {
                          src: Ct.qJ.toStorageStaticAsset(
                            "partner-logos/v4/netapp-dark.svg",
                            t
                          ),
                          alt: "NetApp",
                          height: e.imageHeight,
                          width: 115,
                        }),
                        (0, c.jsx)(Mt.E, {
                          src: Ct.qJ.toStorageStaticAsset(
                            "partner-logos/v4/eventbrite-dark.svg",
                            t
                          ),
                          alt: "Eventbrite",
                          height: e.imageHeight,
                          width: 115,
                        }),
                      ],
                    });
                  },
                },
              ]
            ),
            r
          );
        })(s.Component);
      Kt.defaultProps = {
        linkParams: {},
        pageType: "page_not_specified",
        className: void 0,
        isOnsiteRequestDemo: !1,
      };
      var Qt = (0, G.GV)((0, Ct.n0)(Kt)),
        Jt = Object.assign({}, Qt, { renderLogos: Kt.renderLogos }),
        Xt = r(62025),
        Yt = r.n(Xt),
        $t = function (e) {
          var t = e.courseReview,
            r = e.topicTitle,
            n = (0, G.QT)(),
            i = n.gettext,
            o = n.interpolate,
            s = (0, Ct.gL)(),
            a = (0, Ct.j5)(),
            u = o(
              i("From a Udemy %(topicTitle)s student"),
              { topicTitle: r },
              !0
            );
          return (0, c.jsxs)("div", {
            className: Yt()["student-quote"],
            children: [
              (0, c.jsx)(Mt.E, {
                src: a.toStorageStaticAsset(
                  "browse_components/student-quote-unit/quote.svg",
                  s
                ),
                alt: "",
                width: 40,
                height: 36,
                className: Yt().quote,
              }),
              (0, c.jsxs)("div", {
                className: Yt().content,
                children: [
                  (0, c.jsx)("h2", {
                    className: ee()("ud-heading-lg", Yt().title),
                    children: u,
                  }),
                  (0, c.jsx)("div", {
                    "data-purpose": "course-review",
                    className: ee()("ud-text-md", Yt().text),
                    children: t.text,
                  }),
                  (0, c.jsx)("a", {
                    className: "ud-text-sm ud-link-underline",
                    href: t.course.url,
                    title: t.course.title,
                    children: t.course.title,
                  }),
                ],
              }),
            ],
          });
        },
        er = function (e) {
          var t = e.topicTitle,
            r = e.courseReview;
          return r
            ? (0, c.jsx)("div", {
                "data-purpose": "student-quote-unit-wrapper",
                children: (0, c.jsx)($t, { courseReview: r, topicTitle: t }),
              })
            : null;
        },
        tr = r(87790),
        rr = r(38940),
        nr = r.n(rr);
      function ir(e) {
        var t = (0, wt.useRouter)(),
          r = (0, G.QT)().gettext;
        return (0, c.jsxs)(Y.zx, {
          udStyle: "link",
          onClick: function () {
            e.window.history.length > 1
              ? t.back()
              : e.window.location.assign(document.referrer);
          },
          className: e.className,
          "data-purpose": "career-track-back-link",
          children: [
            (0, c.jsx)(nr(), { label: !1 }),
            r("Back to Career Guide"),
          ],
        });
      }
      ir.defaultProps = { className: "" };
      var or,
        sr,
        ar,
        cr,
        ur,
        lr,
        pr,
        dr,
        fr,
        hr,
        gr,
        mr,
        vr,
        yr,
        br = r(18682),
        _r = r(48809),
        xr = r(70933),
        Or = r(77312),
        jr =
          ((or = (function () {
            function e() {
              var t = this;
              (0, v.Z)(this, e),
                (0, Me.Z)(this, "selectedSkill", sr, this),
                (0, Me.Z)(
                  this,
                  "userExploredWebDeveloperCareerTrack",
                  ar,
                  this
                ),
                (0, Me.Z)(
                  this,
                  "userExploredDataScientistCareerTrack",
                  cr,
                  this
                ),
                (0, Me.Z)(
                  this,
                  "webDeveloperCareerTrackSettingLoaded",
                  ur,
                  this
                ),
                (0, Me.Z)(
                  this,
                  "dataScientistCareerTrackSettingLoaded",
                  lr,
                  this
                ),
                (this.endPoint = "/users/me/settings/"),
                (this.determineSettingValue = function (e, t) {
                  var r = e.data.results.find(function (e) {
                    return e.setting === t.settingCode;
                  });
                  if (r) {
                    var n = t.valueMap.true;
                    return r.value === n;
                  }
                  return null;
                }),
                (0, Me.Z)(
                  this,
                  "setUserExploredWebDeveloperCareerTrack",
                  pr,
                  this
                ),
                (0, Me.Z)(
                  this,
                  "setUserExploredDataScientistCareerTrack",
                  dr,
                  this
                ),
                (0, Me.Z)(
                  this,
                  "_userExploredWebDeveloperCareerTrackContinuationHelper",
                  fr,
                  this
                ),
                (0, Me.Z)(
                  this,
                  "_userExploredDataScientistCareerTrackContinuationHelper",
                  hr,
                  this
                ),
                (this.readyToShowUnitByTitle = function (e) {
                  return e === br.e4
                    ? t.webDeveloperCareerTrackSettingLoaded
                    : e === br.e6 && t.dataScientistCareerTrackSettingLoaded;
                }),
                (this.shouldShowBySettingForUnitWithTitle = function (e) {
                  return e === br.e4
                    ? !1 !== t.userExploredWebDeveloperCareerTrack
                    : e === br.e6 &&
                        !1 !== t.userExploredDataScientistCareerTrack;
                }),
                this.getUserExploredWebDeveloperCareerTrack(),
                this.getUserExploredDataScientistCareerTrack();
            }
            return (
              (0, y.Z)(e, [
                {
                  key: "selectSkill",
                  value: function (e) {
                    this.selectedSkill = e;
                  },
                },
                {
                  key: "getUserExploredWebDeveloperCareerTrack",
                  value: (function () {
                    var e = (0, Le.Z)(
                      Ue().mark(function e() {
                        var t = this;
                        return Ue().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  _r.uh
                                    .get(this.endPoint)
                                    .then(function (e) {
                                      return t.determineSettingValue(
                                        e,
                                        Or.L6.exploredCareerTracks
                                      );
                                    })
                                    .then(
                                      this
                                        ._userExploredWebDeveloperCareerTrackContinuationHelper
                                    );
                                case 1:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this
                        );
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "getUserExploredDataScientistCareerTrack",
                  value: (function () {
                    var e = (0, Le.Z)(
                      Ue().mark(function e() {
                        var t = this;
                        return Ue().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  _r.uh
                                    .get(this.endPoint)
                                    .then(function (e) {
                                      return t.determineSettingValue(
                                        e,
                                        Or.L6.exploredDataScientistCareerTracks
                                      );
                                    })
                                    .then(
                                      this
                                        ._userExploredDataScientistCareerTrackContinuationHelper
                                    );
                                case 1:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this
                        );
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
              ]),
              e
            );
          })()),
          (sr = (0, O.Z)(or.prototype, "selectedSkill", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "";
            },
          })),
          (0, O.Z)(
            or.prototype,
            "selectSkill",
            [w.aD],
            Object.getOwnPropertyDescriptor(or.prototype, "selectSkill"),
            or.prototype
          ),
          (ar = (0, O.Z)(
            or.prototype,
            "userExploredWebDeveloperCareerTrack",
            [w.LO],
            {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              },
            }
          )),
          (cr = (0, O.Z)(
            or.prototype,
            "userExploredDataScientistCareerTrack",
            [w.LO],
            {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              },
            }
          )),
          (ur = (0, O.Z)(
            or.prototype,
            "webDeveloperCareerTrackSettingLoaded",
            [w.LO],
            {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return !1;
              },
            }
          )),
          (lr = (0, O.Z)(
            or.prototype,
            "dataScientistCareerTrackSettingLoaded",
            [w.LO],
            {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return !1;
              },
            }
          )),
          (pr = (0, O.Z)(
            or.prototype,
            "setUserExploredWebDeveloperCareerTrack",
            [w.aD],
            {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                var e = this;
                return function (t) {
                  e.userExploredWebDeveloperCareerTrack != t &&
                    (Or.ZP.set(Or.L6.exploredCareerTracks, t),
                    (e.userExploredWebDeveloperCareerTrack = t),
                    Z.j.publishEvent(
                      new xr.Bj({ displayTitle: br.e4, nonInteraction: !1 })
                    ));
                };
              },
            }
          )),
          (dr = (0, O.Z)(
            or.prototype,
            "setUserExploredDataScientistCareerTrack",
            [w.aD],
            {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                var e = this;
                return function (t) {
                  e.userExploredDataScientistCareerTrack != t &&
                    (Or.ZP.set(Or.L6.exploredDataScientistCareerTracks, t),
                    (e.userExploredDataScientistCareerTrack = t),
                    Z.j.publishEvent(
                      new xr.Bj({ displayTitle: br.e6, nonInteraction: !1 })
                    ));
                };
              },
            }
          )),
          (fr = (0, O.Z)(
            or.prototype,
            "_userExploredWebDeveloperCareerTrackContinuationHelper",
            [w.aD],
            {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                var e = this;
                return function (t) {
                  (e.userExploredWebDeveloperCareerTrack = t),
                    (e.webDeveloperCareerTrackSettingLoaded = !0);
                };
              },
            }
          )),
          (hr = (0, O.Z)(
            or.prototype,
            "_userExploredDataScientistCareerTrackContinuationHelper",
            [w.aD],
            {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                var e = this;
                return function (t) {
                  (e.userExploredDataScientistCareerTrack = t),
                    (e.dataScientistCareerTrackSettingLoaded = !0);
                };
              },
            }
          )),
          or),
        Pr = r(17674),
        wr = r(11121),
        kr = r(23554),
        Cr = r(43823),
        Zr = r(97331),
        Sr = r(57987),
        Tr = r(2295),
        Er = r(64670),
        Nr = r(37266),
        Rr = r.n(Nr),
        Dr = (0, pe.Pi)(function (e) {
          var t = e.title,
            r = e.learningMapStore,
            n = (0, G.QT)().gettext,
            i = function (e, r, n) {
              r
                ? Z.j.publishEvent(new xr.ci({ displayTitle: t }))
                : Z.j.publishEvent(
                    new xr.Bj({ displayTitle: t, nonInteraction: !1 })
                  ),
                n(!r);
            },
            o = function () {
              return (0, c.jsx)(Zr.a, {});
            };
          return (0, c.jsx)(Cr.P, {
            placeholder: o(),
            children: (0, c.jsx)("div", {
              className: Rr()["context-menu"],
              children: (function () {
                var e = function (e) {
                  return e
                    ? (function () {
                        var e,
                          o,
                          s = !1;
                        if (t === br.e4)
                          (s =
                            null !==
                              (o = r.userExploredWebDeveloperCareerTrack) &&
                            void 0 !== o &&
                            o),
                            (e = r.setUserExploredWebDeveloperCareerTrack);
                        else if (t === br.e6) {
                          var a;
                          (s =
                            null !==
                              (a = r.userExploredDataScientistCareerTrack) &&
                            void 0 !== a &&
                            a),
                            (e = r.setUserExploredDataScientistCareerTrack);
                        }
                        return (0, c.jsx)(Er.ZP, {
                          context: Sr.w.MX_MY_LEARNING_UNIT,
                          udStyle: "white-solid",
                          children: (0, c.jsx)(Er.ZP.Menu, {
                            children: (0, c.jsx)(Tr.Z, {
                              icon: null,
                              title: n(
                                s
                                  ? "Remove from My Learning"
                                  : "Add career guide to My Learning"
                              ),
                              onClick: function () {
                                return i(0, s, e);
                              },
                            }),
                          }),
                        });
                      })()
                    : o();
                };
                return t === br.e4
                  ? e(r.webDeveloperCareerTrackSettingLoaded)
                  : t === br.e6
                  ? e(r.dataScientistCareerTrackSettingLoaded)
                  : null;
              })(),
            }),
          });
        }),
        Ir = r(7567),
        Ar = r.n(Ir),
        Lr = r(76905),
        Mr = r(85772),
        zr = r(72266),
        Ur = r.n(zr),
        Br = r(47927),
        Vr = new Date(Date.now() + 31536e6),
        Gr =
          ((gr = (function () {
            function e() {
              (0, v.Z)(this, e),
                (this.storage = void 0),
                (0, Me.Z)(this, "popOverOpen", mr, this),
                (0, Me.Z)(this, "onTogglePopOver", vr, this),
                (this.storage = (0, Br.Z)(
                  "career-track",
                  "newBadgePopOver",
                  Vr
                ));
            }
            return (
              (0, y.Z)(e, [
                {
                  key: "setPopOverState",
                  value: function () {
                    this.popOverOpen = !this.storage.get("dismissed");
                  },
                },
              ]),
              e
            );
          })()),
          (0, O.Z)(
            gr.prototype,
            "setPopOverState",
            [w.aD],
            Object.getOwnPropertyDescriptor(gr.prototype, "setPopOverState"),
            gr.prototype
          ),
          (mr = (0, O.Z)(gr.prototype, "popOverOpen", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (vr = (0, O.Z)(gr.prototype, "onTogglePopOver", [w.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                (e.popOverOpen = !1), e.storage.set("dismissed", !0);
              };
            },
          })),
          gr);
      function Fr(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var qr =
          (0, pe.Pi)(
            (yr = (function (e) {
              (0, b.Z)(r, e);
              var t = Fr(r);
              function r(e) {
                var n;
                return (
                  (0, v.Z)(this, r),
                  ((n = t.call(this, e)).careerTrackUnitPopoverStore = void 0),
                  (n.careerTrackUnitPopoverStore = new Gr()),
                  n
                );
              }
              return (
                (0, y.Z)(r, [
                  {
                    key: "componentDidMount",
                    value: function () {
                      this.careerTrackUnitPopoverStore.setPopOverState();
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this.props.gettext;
                      return (0, c.jsx)(Mr.J, {
                        isOpen: this.careerTrackUnitPopoverStore.popOverOpen,
                        placement: "right-start",
                        trigger: this.props.trigger,
                        onToggle:
                          this.careerTrackUnitPopoverStore.onTogglePopOver,
                        children: (0, c.jsxs)("div", {
                          className: Ur()["career-track-popover-content"],
                          children: [
                            (0, c.jsx)(Lr.C, {
                              className: Ur()["badge-new"],
                              "data-purpose": "new-badge",
                              children: e("New"),
                            }),
                            (0, c.jsx)("div", {
                              "data-purpose": "title",
                              className: "ud-heading-sm",
                              children: e("Data scientist career guide"),
                            }),
                            (0, c.jsx)("div", {
                              "data-purpose": "text",
                              className: "ud-text-sm",
                              children: e(
                                "No need to scroll or search \u2014 we\u2019ve mapped out all the concepts you need to learn to become or advance as a data scientist."
                              ),
                            }),
                            (0, c.jsx)(Y.zx, {
                              componentClass: "a",
                              "data-purpose": "dive-in-button",
                              href: this.props.url,
                              udStyle: "ghost",
                              size: "xsmall",
                              className: "ud-link-underline",
                              children: e("Explore Skills"),
                            }),
                          ],
                        }),
                      });
                    },
                  },
                ]),
                r
              );
            })(s.Component))
          ) || yr,
        Hr = (0, G.GV)(qr),
        Wr = function (e) {
          var t = e.careerTrackData,
            r = e.uiRegion,
            n = e.sourcePageType,
            i = e.sourcePageId,
            o = e.learningMapStore,
            a = void 0 === o ? new jr() : o,
            u = e.showPopOver,
            l = (0, G.QT)(),
            p = l.gettext,
            d = l.interpolate,
            f = (0, V.ag)("sm-min"),
            h = s.useState("123"),
            g = (0, Pr.Z)(h, 2),
            m = g[0],
            v = g[1];
          s.useEffect(function () {
            v((0, wr.t1)());
          }, []);
          var y = "".concat(t.url, "?trackingId=").concat(m),
            b = function () {
              Z.j.publishEvent(
                new xr.p6({
                  displayTitle: t.title,
                  uiRegion: r,
                  trackingId: m,
                  sourcePageType: n,
                  sourcePageId: i,
                })
              );
            },
            _ = {
              src: Ct.qJ.toStorageStaticAsset(
                "consumer-subscription/career-guide/".concat(t.imgKey, ".jpg")
              ),
              src2x: Ct.qJ.toStorageStaticAsset(
                "consumer-subscription/career-guide/".concat(
                  t.imgKey,
                  "-2x.jpg"
                )
              ),
            },
            x = function () {
              return (0, c.jsx)("div", {
                className: Ar()["context-menu-wrapper"],
                children: (0, c.jsx)(Dr, {
                  title: t.title,
                  learningMapStore: a,
                }),
              });
            },
            O = function (e) {
              return (0, c.jsx)(Y.zx, {
                "aria-hidden": !0,
                componentClass: "a",
                href: y,
                onClick: b,
                className: Ar()["wrapper-button"],
                tabIndex: -1,
                udStyle: "ghost",
                children: e,
              });
            };
          return (0, c.jsx)(kr.H, {
            trackFunc: function () {
              Z.j.publishEvent(
                new xr.El({
                  displayTitle: t.title,
                  uiRegion: r,
                  sourcePageType: n,
                  sourcePageId: i,
                })
              );
            },
            children: (0, c.jsxs)("div", {
              "data-purpose": "career-track-card",
              className: Ar().container,
              children: [
                O(
                  (0, c.jsx)(Mt.E, {
                    alt: "",
                    width: 144,
                    height: 144,
                    src: _.src,
                    srcSet: "".concat(_.src, " 1x, ").concat(_.src2x, " 2x"),
                  })
                ),
                (0, c.jsxs)("div", {
                  "data-purpose": "career-track-card-content",
                  className: Ar().content,
                  children: [
                    (0, c.jsxs)("div", {
                      className: Ar()["header-container"],
                      children: [
                        O(
                          (0, c.jsx)("div", {
                            className: "ud-heading-serif-xl",
                            children: d(
                              p("For %(occupationTitle)s"),
                              { occupationTitle: t.title },
                              !0
                            ),
                          })
                        ),
                        u && f ? (0, c.jsx)(Hr, { trigger: x(), url: y }) : x(),
                      ],
                    }),
                    O(
                      (0, c.jsx)("div", {
                        className: "ud-text-sm",
                        children: t.description,
                      })
                    ),
                    (0, c.jsx)(Y.zx, {
                      componentClass: "a",
                      "data-purpose": "see-more-button",
                      href: y,
                      udStyle: "ghost",
                      size: "xsmall",
                      className: "ud-link-underline",
                      onClick: b,
                      children: p("Explore Skills"),
                    }),
                  ],
                }),
              ],
            }),
          });
        },
        Kr = r(25032),
        Qr = r.n(Kr),
        Jr = (0, pe.Pi)(function (e) {
          var t = e.careerTrackUnit,
            r = e.uiRegion,
            n = e.sourcePageType,
            i = e.sourcePageId,
            o = e.learningMapStore,
            s = void 0 === o ? new jr() : o,
            a = e.className,
            u = e.showBySetting,
            l = void 0 !== u && u;
          return t.length
            ? (0, c.jsx)("div", {
                className: ee()(a, Qr()["career-track-wrapper"]),
                children: t.map(function (e) {
                  return l && !s.shouldShowBySettingForUnitWithTitle(e.title)
                    ? null
                    : (0, c.jsx)(
                        Wr,
                        {
                          careerTrackData: e,
                          uiRegion: r,
                          sourcePageType: n,
                          sourcePageId: i,
                          showPopOver: e.title === br.e6,
                          learningMapStore: s,
                        },
                        e.title
                      );
                }),
              })
            : null;
        });
      function Xr(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var Yr = (function (e) {
        (0, b.Z)(r, e);
        var t = Xr(r);
        function r(e) {
          var n;
          return (
            (0, v.Z)(this, r),
            ((n = t.call(this, hn.CLICK_CERTIFICATE_DETAIL_LINK)).badge =
              void 0),
            (n.badge = e),
            n
          );
        }
        return (0, y.Z)(r);
      })(C.rp);
      function $r(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var en = (function (e) {
        (0, b.Z)(r, e);
        var t = $r(r);
        function r(e, n) {
          var i;
          return (
            (0, v.Z)(this, r),
            ((i = t.call(this, e)).badge = void 0),
            (i.badge = n),
            i
          );
        }
        return (0, y.Z)(r);
      })(C.rp);
      function tn(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var rn,
        nn,
        on,
        sn,
        an,
        cn,
        un,
        ln,
        pn,
        dn,
        fn = (function (e) {
          (0, b.Z)(r, e);
          var t = tn(r);
          function r(e) {
            var n,
              i = e.searchQuery,
              o = e.filteredByIssuers,
              s = e.filteredBySubjectAreas;
            return (
              (0, v.Z)(this, r),
              ((n = t.call(this, hn.SEARCH_CERTIFICATE)).searchQuery = void 0),
              (n.filteredByIssuers = void 0),
              (n.filteredBySubjectAreas = void 0),
              (n.searchQuery = i),
              (n.filteredByIssuers = o),
              (n.filteredBySubjectAreas = s),
              n
            );
          }
          return (0, y.Z)(r);
        })(C.rp),
        hn = {
          SEARCH_CERTIFICATE: "CertificationSearchEvent",
          SELECT_CERTIFICATE_ON_LISTING_PAGE:
            "CertificationListingPageSelectEvent",
          SELECT_CERTIFICATE_ON_TOPIC_PAGE:
            "CertificationTopicWidgetSelectEvent",
          CLICK_CERTIFICATE_DETAIL_LINK: "CertificationDetailLinkClickEvent",
        },
        gn = {
          CERTIFICATE_SEARCH_EVENT: fn,
          CERTIFICATE_SELECT_EVENT: en,
          CLICK_CERTIFICATE_DETAIL_LINK: Yr,
        },
        mn = r(6047),
        vn = r.n(mn),
        yn = function (e) {
          var t = e.certification,
            r = (0, G.QT)(),
            n = r.gettext,
            i = r.interpolate;
          return (0, c.jsx)("div", {
            className: vn()["carousel-card-container"],
            children: (0, c.jsxs)("a", {
              href: "".concat("/open-badges", "/").concat(t.id),
              "data-purpose": "certification-card-link",
              className: vn()["carousel-card-link"],
              onClick: function () {
                return (function (e) {
                  var t = { name: e };
                  Z.j.publishEvent(
                    new gn.CERTIFICATE_SELECT_EVENT(
                      hn.SELECT_CERTIFICATE_ON_TOPIC_PAGE,
                      t
                    )
                  );
                })(t.name);
              },
              children: [
                (0, c.jsx)(Mt.E, {
                  className: vn()["carousel-certificate-image"],
                  alt: t.name,
                  src: t.image.id,
                }),
                (0, c.jsxs)("div", {
                  className: ee()(vn()["carousel-info"]),
                  children: [
                    (0, c.jsx)("h4", {
                      className: ee()("ud-heading-lg"),
                      "data-purpose": "certification-title",
                      children: t.name,
                    }),
                    (0, c.jsx)("span", {
                      className: ee()(
                        "ud-text-xs",
                        vn()["carousel-issuer-name"]
                      ),
                      "data-purpose": "card-issuer-name",
                      children: i(
                        n("Issued by %(issuer)s"),
                        { issuer: t.issuer.name },
                        !0
                      ),
                    }),
                  ],
                }),
              ],
            }),
          });
        },
        bn = function (e) {
          var t = e.title,
            r = e.certifications,
            n = e.className,
            i = (0, V.ag)("mobile-max"),
            o = (0, V.ag)("(any-pointer: coarse)"),
            s = (0, V.ag)("(any-pointer: fine)");
          return (0, c.jsxs)("section", {
            className: ee()(n, vn()["certification-unit-container"]),
            children: [
              (0, c.jsx)("h2", {
                className: ee()(
                  "ud-heading-lg",
                  vn()["certification-unit-container"]
                ),
                "data-purpose": "certification-unit-title",
                children: t,
              }),
              (0, c.jsx)(me.l, {
                "data-purpose": "carousel",
                fullViewport: !!i,
                showPager: !!s,
                allowScroll: !!o,
                className: vn()["certification-carousel"],
                children:
                  null === r || void 0 === r
                    ? void 0
                    : r.map(function (e) {
                        return (0, c.jsx)(yn, { certification: e }, e.id);
                      }),
              }),
            ],
          });
        },
        _n = r(83548);
      function xn(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var On,
        jn,
        Pn,
        wn,
        kn =
          ((rn = (function (e) {
            (0, b.Z)(r, e);
            var t = xn(r);
            function r() {
              var e;
              (0, v.Z)(this, r);
              for (
                var n = arguments.length, i = new Array(n), o = 0;
                o < n;
                o++
              )
                i[o] = arguments[o];
              return (
                (e = t.call.apply(t, [this].concat(i))),
                (0, Me.Z)(e, "id", nn, (0, Pt.Z)(e)),
                (0, Me.Z)(e, "name", on, (0, Pt.Z)(e)),
                (0, Me.Z)(e, "issuer", sn, (0, Pt.Z)(e)),
                (0, Me.Z)(e, "criteria", an, (0, Pt.Z)(e)),
                (0, Me.Z)(e, "description", cn, (0, Pt.Z)(e)),
                (0, Me.Z)(e, "image", un, (0, Pt.Z)(e)),
                (0, Me.Z)(e, "type", ln, (0, Pt.Z)(e)),
                (0, Me.Z)(e, "tags", pn, (0, Pt.Z)(e)),
                (0, Me.Z)(e, "topic", dn, (0, Pt.Z)(e)),
                e
              );
            }
            return (
              (0, y.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    return {
                      id: "id",
                      name: "name",
                      issuer: {
                        source: "issuer",
                        map: function (e) {
                          return { name: e.name };
                        },
                      },
                      criteria: {
                        source: "criteria",
                        map: function (e) {
                          return { id: e.id };
                        },
                      },
                      description: "description",
                      image: {
                        source: "image",
                        map: function (e) {
                          return { id: e.id };
                        },
                      },
                      type: "type",
                      tags: "tags",
                      topic: {
                        source: "topic",
                        map: function (e) {
                          return { id: e.id };
                        },
                      },
                    };
                  },
                },
              ]),
              r
            );
          })(r(45153).h)),
          (nn = (0, O.Z)(rn.prototype, "id", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (on = (0, O.Z)(rn.prototype, "name", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (sn = (0, O.Z)(rn.prototype, "issuer", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (an = (0, O.Z)(rn.prototype, "criteria", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (cn = (0, O.Z)(rn.prototype, "description", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (un = (0, O.Z)(rn.prototype, "image", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (ln = (0, O.Z)(rn.prototype, "type", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (pn = (0, O.Z)(rn.prototype, "tags", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (dn = (0, O.Z)(rn.prototype, "topic", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          rn),
        Cn =
          ((On = (function () {
            function e() {
              (0, v.Z)(this, e),
                (0, Me.Z)(this, "certificationsList", jn, this);
            }
            return (
              (0, y.Z)(e, [
                {
                  key: "getCertificationsByTopic",
                  value: (function () {
                    var e = (0, Le.Z)(
                      Ue().mark(function e(t) {
                        var r, n;
                        return Ue().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (e.next = 2),
                                    _n.LG.fetcher({ topicId: t })()
                                  );
                                case 2:
                                  (r = e.sent),
                                    (n = r.badgeClassesByTopic),
                                    this.setCertificationListFromResponse(n);
                                case 5:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this
                        );
                      })
                    );
                    return function (t) {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "setCertificationListFromResponse",
                  value: function (e) {
                    this.certificationsList = e.map(function (e) {
                      return new kn(e);
                    });
                  },
                },
              ]),
              e
            );
          })()),
          (jn = (0, O.Z)(On.prototype, "certificationsList", [w.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (0, O.Z)(
            On.prototype,
            "getCertificationsByTopic",
            [w.aD],
            Object.getOwnPropertyDescriptor(
              On.prototype,
              "getCertificationsByTopic"
            ),
            On.prototype
          ),
          (0, O.Z)(
            On.prototype,
            "setCertificationListFromResponse",
            [w.aD],
            Object.getOwnPropertyDescriptor(
              On.prototype,
              "setCertificationListFromResponse"
            ),
            On.prototype
          ),
          On);
      function Zn(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var Sn,
        Tn,
        En,
        Nn,
        Rn,
        Dn,
        In,
        An =
          (0, pe.Pi)(
            ((wn = (function (e) {
              (0, b.Z)(r, e);
              var t = Zn(r);
              function r() {
                return (0, v.Z)(this, r), t.apply(this, arguments);
              }
              return (
                (0, y.Z)(r, [
                  {
                    key: "componentDidMount",
                    value: (function () {
                      var e = (0, Le.Z)(
                        Ue().mark(function e() {
                          var t, r, n;
                          return Ue().wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    return (
                                      (t = this.props),
                                      (r = t.topicId),
                                      (n = t.certificationUnitStore),
                                      (e.next = 3),
                                      n.getCertificationsByTopic(r)
                                    );
                                  case 3:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            this
                          );
                        })
                      );
                      return function () {
                        return e.apply(this, arguments);
                      };
                    })(),
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this.props,
                        t = e.interpolate,
                        r = e.gettext,
                        n =
                          this.props.certificationUnitStore.certificationsList;
                      if (!n || 0 == n.length) return null;
                      var i = n[0].issuer.name;
                      return (0, c.jsx)("div", {
                        "data-purpose": "certification-unit",
                        className: this.props.className,
                        children: (0, c.jsx)(bn, {
                          certifications: n,
                          title: t(
                            r("Choose your certification from %(issuer)s"),
                            { issuer: i },
                            !0
                          ),
                        }),
                      });
                    },
                  },
                ]),
                r
              );
            })(s.Component)),
            (wn.defaultProps = {
              className: "",
              certificationUnitStore: new Cn(),
            }),
            (Pn = wn))
          ) || Pn,
        Ln = (0, G.GV)(An);
      function Mn(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var zn =
          ((Sn = w.LO.ref),
          (Tn = w.LO.ref),
          (0, pe.Pi)(
            ((In = (function (e) {
              (0, b.Z)(n, e);
              var t = Mn(n);
              function n() {
                var e;
                (0, v.Z)(this, n);
                for (
                  var r = arguments.length, i = new Array(r), o = 0;
                  o < r;
                  o++
                )
                  i[o] = arguments[o];
                return (
                  (e = t.call.apply(t, [this].concat(i))),
                  (0, Me.Z)(e, "resourceContextMenu", Rn, (0, Pt.Z)(e)),
                  (0, Me.Z)(e, "isLoading", Dn, (0, Pt.Z)(e)),
                  e
                );
              }
              return (
                (0, y.Z)(n, [
                  {
                    key: "componentDidMount",
                    value: (function () {
                      var e = (0, Le.Z)(
                        Ue().mark(function e() {
                          var t,
                            n = this;
                          return Ue().wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    if (
                                      !this.props.udData.Config.brand
                                        .has_organization
                                    ) {
                                      e.next = 6;
                                      break;
                                    }
                                    return (
                                      (e.next = 4),
                                      Promise.all([
                                        r.e(315),
                                        r.e(494),
                                        r.e(731),
                                      ]).then(r.bind(r, 1823))
                                    );
                                  case 4:
                                    (t = e.sent),
                                      (0, w.z)(function () {
                                        n.resourceContextMenu = t.default();
                                      });
                                  case 6:
                                    (0, w.z)(function () {
                                      n.isLoading = !1;
                                    });
                                  case 7:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            this
                          );
                        })
                      );
                      return function () {
                        return e.apply(this, arguments);
                      };
                    })(),
                  },
                  {
                    key: "render",
                    value: function () {
                      if (
                        this.props.udData.Config.brand.has_organization &&
                        this.isLoading
                      )
                        return null;
                      var e = this.props,
                        t = e.children,
                        r = e.resourceContextMenuProps;
                      return (0, c.jsx)(pe.zt, {
                        resourceContextMenu: this.resourceContextMenu,
                        resourceContextMenuProps: r,
                        children: t,
                      });
                    },
                  },
                ]),
                n
              );
            })(s.Component)),
            (In.defaultProps = { resourceContextMenuProps: {} }),
            (Nn = In),
            (Rn = (0, O.Z)(Nn.prototype, "resourceContextMenu", [Sn], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {},
            })),
            (Dn = (0, O.Z)(Nn.prototype, "isLoading", [Tn], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return !0;
              },
            })),
            (En = Nn))
          ) || En),
        Un = (0, Ct.n0)(zn),
        Bn = r(95880),
        Vn = r(30898),
        Gn = r.n(Vn);
      function Fn(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var qn = (function (e) {
          (0, b.Z)(r, e);
          var t = Fn(r);
          function r() {
            return (0, v.Z)(this, r), t.apply(this, arguments);
          }
          return (
            (0, y.Z)(r, [
              {
                key: "render",
                value: function () {
                  var e = this.props,
                    t = e.className,
                    r = e.topic,
                    n = e.primaryDescription,
                    i = e.questionsAndAnswers,
                    o = e.relatedPagesHeadline,
                    s = e.relatedPages,
                    a = e.presetValue,
                    u = e.isMobile,
                    l = e.gettext,
                    p = e.interpolate;
                  return (0, c.jsxs)("div", {
                    className: ee()(t, Gn().container),
                    children: [
                      (0, c.jsxs)("div", {
                        children: [
                          (0, c.jsx)("h2", {
                            className: ee()(
                              u ? "ud-heading-xl" : "ud-heading-xxl",
                              Gn().title
                            ),
                            "data-purpose": "title",
                            children: p(
                              l("Learn more about %(topicName)s"),
                              { topicName: r.name },
                              !0
                            ),
                          }),
                          this.props.primaryDescription &&
                            (0, c.jsx)("p", {
                              className: ee()(
                                u ? "ud-text-sm" : "ud-text-md",
                                Gn()["primary-description"]
                              ),
                              "data-purpose": "primary-description",
                              children: n,
                            }),
                          2 === this.props.relatedPages.length &&
                            (0, c.jsx)("div", {
                              className: Gn()["free-topic-page-link"],
                              children: (0, c.jsx)(st, {
                                presetValue: B,
                                topicTitle: this.props.topic.name,
                                url: this.props.relatedPages[1].url,
                              }),
                            }),
                        ],
                      }),
                      i.length > 0 &&
                        (0, c.jsx)(ue.B, {
                          questionsAndAnswers: i,
                          compact: u,
                          defaultExpanded: !0,
                        }),
                      this.props.relatedPages.length > 2 &&
                        (0, c.jsx)(lt, {
                          alternateHeadline: o,
                          isMobile: u,
                          presetValue: a,
                          relatedPages: s,
                          topic: r,
                        }),
                    ],
                  });
                },
              },
            ]),
            r
          );
        })(s.Component),
        Hn = (0, G.GV)(qn);
      function Wn(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var Kn,
        Qn,
        Jn,
        Xn,
        Yn,
        $n,
        ei = (function (e) {
          (0, b.Z)(r, e);
          var t = Wn(r);
          function r(e) {
            var n,
              i = e.topicId;
            return (
              (0, v.Z)(this, r),
              ((n = t.call(this, "TopicPageViewEvent")).topicId = void 0),
              (n.topicId = i),
              n
            );
          }
          return (0, y.Z)(r);
        })(C.rp),
        ti = r(65069),
        ri = r.n(ti);
      function ni(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function ii(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? ni(Object(r), !0).forEach(function (t) {
                (0, n.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : ni(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function oi(e) {
        var t = (function () {
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
          var r,
            n = (0, x.Z)(e);
          if (t) {
            var i = (0, x.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, _.Z)(this, r);
        };
      }
      var si =
          (0, V.lK)({ isMobile: "mobile-max" })(
            (Kn =
              (0, pe.Pi)(
                (($n = (function (e) {
                  (0, b.Z)(r, e);
                  var t = oi(r);
                  function r() {
                    var e;
                    (0, v.Z)(this, r);
                    for (
                      var n = arguments.length, i = new Array(n), o = 0;
                      o < n;
                      o++
                    )
                      i[o] = arguments[o];
                    return (
                      ((e = t.call.apply(
                        t,
                        [this].concat(i)
                      )).resourceContextMenuProps = {
                        context: Sr.w.ALL_COURSES,
                      }),
                      (e.ref = s.createRef()),
                      (0, Me.Z)(e, "resourceContextMenu", Jn, (0, Pt.Z)(e)),
                      (0, Me.Z)(e, "showCareerTrackBackLink", Xn, (0, Pt.Z)(e)),
                      (e.handlePageChange = function () {
                        var t;
                        null === (t = e.ref.current) ||
                          void 0 === t ||
                          t.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }),
                      (e.generatePageViewEvent = function () {
                        Z.j.publishEvent(
                          new ei({ topicId: parseInt(e.props.topic.id, 10) })
                        );
                      }),
                      (0, Me.Z)(e, "showCareerGuideLink", Yn, (0, Pt.Z)(e)),
                      (e.getDiscoveryUnitFilter = function () {
                        var t = e.props,
                          r = t.presetValue,
                          n = t.showUpdatedPPTopicPage,
                          i = t.showRelatedOccupations;
                        return r === z
                          ? function (e) {
                              return [
                                "related_categories_and_subcategories",
                                "bestseller_labels",
                              ].includes(e.type);
                            }
                          : i
                          ? n
                            ? function () {
                                return !0;
                              }
                            : function (e) {
                                var t;
                                return !["assessment", "lab"].includes(
                                  null !==
                                    (t =
                                      null === e || void 0 === e
                                        ? void 0
                                        : e.item_type) && void 0 !== t
                                    ? t
                                    : ""
                                );
                              }
                          : n
                          ? function (e) {
                              return "algorithm_based_occupation" !== e.type;
                            }
                          : function (e) {
                              var t;
                              return (
                                !["assessment", "lab"].includes(
                                  null !==
                                    (t =
                                      null === e || void 0 === e
                                        ? void 0
                                        : e.item_type) && void 0 !== t
                                    ? t
                                    : ""
                                ) && "algorithm_based_occupation" !== e.type
                              );
                            };
                      }),
                      e
                    );
                  }
                  return (
                    (0, y.Z)(r, [
                      {
                        key: "componentDidMount",
                        value: (function () {
                          var e = (0, Le.Z)(
                            Ue().mark(function e() {
                              return Ue().wrap(
                                function (e) {
                                  for (;;)
                                    switch ((e.prev = e.next)) {
                                      case 0:
                                        this.showCareerGuideLink(),
                                          this.generatePageViewEvent();
                                      case 2:
                                      case "end":
                                        return e.stop();
                                    }
                                },
                                e,
                                this
                              );
                            })
                          );
                          return function () {
                            return e.apply(this, arguments);
                          };
                        })(),
                      },
                      {
                        key: "window",
                        get: function () {
                          return Bn.Z.global;
                        },
                      },
                      {
                        key: "isLoading",
                        get: function () {
                          return (
                            this.props.isSubsLoading ||
                            this.props.udData.isGlobalMeContextLoading
                          );
                        },
                      },
                      {
                        key: "searchParams",
                        get: function () {
                          return new URLSearchParams(
                            this.window.location.search
                          );
                        },
                      },
                      {
                        key: "presetFilters",
                        get: function () {
                          if (this.props.presetValue === z)
                            return (0, n.Z)({}, le.N5, ["price-free"]);
                        },
                      },
                      {
                        key: "primaryHeading",
                        get: function () {
                          var e,
                            t,
                            r = this.props,
                            n = r.topic,
                            i = r.topicTitle,
                            o = r.presetValue,
                            s = r.isConsumerSubsSubscriber,
                            a = r.udData,
                            c =
                              s ||
                              (null === (e = a.Config) ||
                              void 0 === e ||
                              null === (t = e.brand) ||
                              void 0 === t
                                ? void 0
                                : t.has_organization);
                          return o === M && c ? n.name : i;
                        },
                      },
                      {
                        key: "secondaryHeading",
                        get: function () {
                          var e = this.props,
                            t = e.gettext;
                          return t(
                            e.presetValue === z
                              ? "All %(topicTitle)s tutorials"
                              : "All %(topicTitle)s courses"
                          );
                        },
                      },
                      {
                        key: "renderDiscoveryListPromoComponents",
                        value: function () {
                          return [
                            (0, c.jsx)(
                              fe.Xg,
                              {
                                "data-item-index": 9,
                                context: le.Gj.topicPage,
                                subcontext: le.Gj.learningPack,
                                "data-purpose": "bundle-unit",
                                children: (0, c.jsx)(kt.K, {
                                  pageType: "topic-bundle",
                                  pageObjectId: this.props.topic.id,
                                  titleTypography: this.props.isMobile
                                    ? "ud-heading-lg"
                                    : "ud-heading-xl",
                                }),
                              },
                              "bundle-unit"
                            ),
                            !this.props.isConsumerSubsSubscriber &&
                              (0, c.jsx)(
                                "div",
                                {
                                  "data-item-index": 3,
                                  "data-purpose": "top-companies-notice",
                                  children: (0, c.jsx)(Jt, {
                                    refParam: "right-rail",
                                  }),
                                },
                                "top-companies-notice"
                              ),
                            (0, c.jsx)(
                              er,
                              {
                                "data-item-index": 6,
                                topicTitle: this.props.topic.name,
                                courseReview:
                                  this.props.highlightedCourseReview,
                                "data-purpose": "student-quote-unit",
                              },
                              "student-quote-unit"
                            ),
                          ];
                        },
                      },
                      {
                        key: "render",
                        value: function () {
                          var e = this.props.udData.Config,
                            t = !!this.props.isMobile,
                            r = t ? "small" : "large",
                            i = {
                              fullWidth: t,
                              showPager: !t,
                              layout: t ? "multirow" : "singlerow",
                            },
                            o = this.props,
                            s = o.careerTrackUnitData,
                            a = o.enrollmentStat,
                            u = o.isAnnualPlanEnabled,
                            l = o.isConsumerSubsSubscriber,
                            p = o.plan,
                            d = o.planPriceIds,
                            f = o.presetValue,
                            h = o.primaryDescription,
                            g = o.questionsAndAnswers,
                            m = o.relatedPages,
                            v = o.secondaryDescription,
                            y = o.showCodingExercisesBadge,
                            b = o.showPersonalPlanBadge,
                            _ = o.subsCollectionIds,
                            x = o.topic,
                            O = o.gettext,
                            j = o.interpolate,
                            P = {
                              RelatedCategoriesUnit: {
                                className: a
                                  ? ri()["related-categories-margin-sm"]
                                  : ri()["related-categories-margin-lg"],
                                compact: t,
                              },
                              RelatedOccupationsUnit: {
                                className: ee()(
                                  "component-margin",
                                  (0, n.Z)({}, ri()["primary-unit"], t)
                                ),
                                plan: p,
                                isAnnualPlanEnabled: u,
                                planPriceIds: d,
                                cardProps: { uiRegion: "topic" },
                              },
                              SkillsHubUnit: {
                                className: ee()(
                                  "component-margin",
                                  (0, n.Z)({}, ri()["primary-unit"], t)
                                ),
                                compact: t,
                              },
                              PopularTopicsUnit: {
                                titleTypography: t
                                  ? "ud-heading-lg"
                                  : "ud-heading-xl",
                              },
                              CourseUnit: {
                                fullWidth: t,
                                showPager: !t,
                                layout: t ? "multirow" : "singlerow",
                                titleTypography: t ? "ud-heading-lg" : void 0,
                                showSubtitle: !0,
                                carouselProps: { allowScroll: t },
                              },
                              OccupationUnit: i,
                              AssessmentUnit: {
                                title: O(
                                  "Evaluate your skills with assessments"
                                ),
                                subtitle: O(
                                  "Identify your proficiency level and get content recommendations based on your results."
                                ),
                                uiRegion: tr.n.ASSESSMENT_UNIT_TOPIC,
                                sourcePageType: "topic",
                                sourcePageId: parseInt(x.id, 10),
                              },
                              LabUnit: {
                                className: "component-margin",
                                title: O("Get hands-on practice with labs"),
                                subtitle: O(
                                  "Sharpen your technical skills with access to risk-free environments and real-world projects."
                                ),
                                sourcePageType: "topic",
                                sourcePageId: this.props.topic.id,
                                uiRegion: At.k$.LABS_UNIT_TOPIC,
                              },
                            },
                            w = {
                              title: j(
                                O("Free %(topicName)s lessons"),
                                { topicName: x.name },
                                !0
                              ),
                              secondaryText: O(
                                "Bite-sized learning in minutes"
                              ),
                              className: ri()["section-container"],
                              layoutVariant: t ? "compact" : "default",
                            },
                            k = e.brand.has_organization,
                            C = !1,
                            Z = h || m.length > 1 || g.length > 0,
                            S = le.sV;
                          return (
                            l && (S = le.ki),
                            k &&
                              ((S = le.yN),
                              (C = e.brand.organization.is_enterprise_china)),
                            (0, c.jsx)("main", {
                              children: (0, c.jsxs)("div", {
                                className: "ud-container ud-page-wrapper",
                                children: [
                                  this.showCareerTrackBackLink &&
                                    (0, c.jsx)(ir, {
                                      className: ri()["career-track-link"],
                                      window: this.window,
                                    }),
                                  this.isLoading
                                    ? (0, c.jsx)(Nt, {
                                        className: ri()["title-skeleton"],
                                        "data-item-index": 0,
                                      })
                                    : (0, c.jsx)(H.Z, {
                                        title: this.primaryHeading,
                                        className: "component-margin",
                                        titleTag: "h1",
                                        titleClass: t
                                          ? "ud-heading-serif-xl"
                                          : "ud-heading-serif-xxl",
                                        titleStyle: t
                                          ? "title-compact"
                                          : "title",
                                        layoutVariant: t ? "default" : "large",
                                      }),
                                  this.isLoading
                                    ? (0, c.jsxs)(c.Fragment, {
                                        children: [
                                          (0, c.jsx)(Nt, {
                                            "data-item-index": 0,
                                          }),
                                          (0, c.jsx)(Rt, {
                                            courseCount: t ? 3 : 6,
                                          }),
                                          (0, c.jsx)(Dt, { courseCount: 4 }),
                                          (0, c.jsx)(Dt, { courseCount: 4 }),
                                        ],
                                      })
                                    : (0, c.jsx)(pe.zt, {
                                        isConsumerSubsSubscriber: l,
                                        showPersonalPlanBadge: b,
                                        showCodingExercisesBadge: y,
                                        children: (0, c.jsx)(Un, {
                                          resourceContextMenuProps:
                                            this.resourceContextMenuProps,
                                          children: (0, c.jsxs)(q.Z, {
                                            isMobile: t,
                                            pageType: S,
                                            pageObjectId: parseInt(x.id, 10),
                                            unitPropsByType: P,
                                            filter:
                                              this.getDiscoveryUnitFilter(),
                                            children: [
                                              a &&
                                                (0, c.jsx)(yt, {
                                                  "data-item-index": 0,
                                                  className: "component-margin",
                                                  enrollmentStat: a,
                                                }),
                                              (l || (k && !C)) &&
                                                (0, c.jsx)(Ln, {
                                                  "data-item-index": 0,
                                                  className: "component-margin",
                                                  topicId: x.id,
                                                }),
                                              (0, c.jsx)(It.Z, {
                                                className: "component-margin",
                                              }),
                                              s.length > 0 &&
                                                !this.showCareerTrackBackLink &&
                                                l &&
                                                (0, c.jsx)(Jr, {
                                                  "data-item-index": 0,
                                                  className: "component-margin",
                                                  careerTrackUnit: s,
                                                  uiRegion: tr.n.CAREER_TRACKS,
                                                  sourcePageType: "topic",
                                                  sourcePageId: parseInt(
                                                    x.id,
                                                    10
                                                  ),
                                                }),
                                              (0, c.jsxs)("div", {
                                                className: "component-margin",
                                                "data-item-index": -3,
                                                ref: this.ref,
                                                children: [
                                                  (0, c.jsx)(H.Z, {
                                                    "data-purpose":
                                                      "all-topic-courses",
                                                    title: j(
                                                      this.secondaryHeading,
                                                      { topicTitle: x.name },
                                                      !0
                                                    ),
                                                    titleTag: "h2",
                                                    secondaryText: k ? null : v,
                                                    layoutVariant: t
                                                      ? "compact"
                                                      : "default",
                                                    className:
                                                      ri()["secondary-heading"],
                                                  }),
                                                  !l &&
                                                    (0, c.jsx)(se, {
                                                      className:
                                                        ri()["refund-notice"],
                                                    }),
                                                  (0, c.jsx)(Zt.Z, {
                                                    pageType: S,
                                                    pageSize: 16,
                                                    pageObjectId: parseInt(
                                                      x.id,
                                                      10
                                                    ),
                                                    presetFilters:
                                                      this.presetFilters,
                                                    courseCardSize: r,
                                                    onPageChange:
                                                      this.handlePageChange,
                                                    subsCollectionIds: _,
                                                    query: x.name,
                                                    children:
                                                      !k &&
                                                      this.renderDiscoveryListPromoComponents(),
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        }),
                                      }),
                                  Z &&
                                    (0, c.jsx)(F.l, {
                                      children: (0, c.jsx)("div", {
                                        className:
                                          ri()["learn-more-section-container"],
                                        children: (0, c.jsx)(Hn, {
                                          className: ri()["learn-more-section"],
                                          topic: x,
                                          primaryDescription: h,
                                          questionsAndAnswers: g,
                                          relatedPagesHeadline: ii({}, w),
                                          relatedPages: m,
                                          presetValue: f,
                                          isMobile: t,
                                        }),
                                      }),
                                    }),
                                ],
                              }),
                            })
                          );
                        },
                      },
                    ]),
                    r
                  );
                })(s.Component)),
                ($n.defaultProps = {
                  presetValue: M,
                  relatedPages: [],
                  questionsAndAnswers: [],
                  showPersonalPlanBadge: !1,
                  careerTrackUnitData: [],
                  isAnnualPlanEnabled: !1,
                  planPriceIds: null,
                  showCodingExercisesBadge: !1,
                  showUpdatedPPTopicPage: !1,
                  isMobile: !1,
                }),
                (Qn = $n),
                (Jn = (0, O.Z)(Qn.prototype, "resourceContextMenu", [w.LO], {
                  configurable: !0,
                  enumerable: !0,
                  writable: !0,
                  initializer: function () {},
                })),
                (Xn = (0, O.Z)(
                  Qn.prototype,
                  "showCareerTrackBackLink",
                  [w.LO],
                  {
                    configurable: !0,
                    enumerable: !0,
                    writable: !0,
                    initializer: function () {
                      return !1;
                    },
                  }
                )),
                (0, O.Z)(
                  Qn.prototype,
                  "isLoading",
                  [w.Fl],
                  Object.getOwnPropertyDescriptor(Qn.prototype, "isLoading"),
                  Qn.prototype
                ),
                (0, O.Z)(
                  Qn.prototype,
                  "searchParams",
                  [w.Fl],
                  Object.getOwnPropertyDescriptor(Qn.prototype, "searchParams"),
                  Qn.prototype
                ),
                (Yn = (0, O.Z)(Qn.prototype, "showCareerGuideLink", [w.aD], {
                  configurable: !0,
                  enumerable: !0,
                  writable: !0,
                  initializer: function () {
                    var e = this;
                    return function () {
                      var t;
                      e.showCareerTrackBackLink =
                        e.window.location &&
                        (null === (t = e.searchParams.get("src")) ||
                        void 0 === t
                          ? void 0
                          : t.includes(br.z2));
                    };
                  },
                })),
                (Kn = Qn))
              ) || Kn)
          ) || Kn,
        ai = (0, G.GV)((0, Ct.n0)((0, wt.withRouter)(si)));
      function ci(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function ui(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? ci(Object(r), !0).forEach(function (t) {
                (0, n.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : ci(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var li = function (e) {
        var t,
          r,
          n = (0, s.useContext)(p.p),
          i = (null === n || void 0 === n ? void 0 : n.contentCollectionIds)
            ? n.contentCollectionIds.join("|")
            : void 0,
          o = ui(
            ui({}, e),
            {},
            {
              presetValue: e.presetValue || U,
              relatedPages:
                null !== (t = e.relatedPages) && void 0 !== t ? t : [],
              plan: null === n || void 0 === n ? void 0 : n.subscriptionPlan,
              planPriceIds:
                null === n || void 0 === n ? void 0 : n.subscriptionPlanIds,
              isConsumerSubsSubscriber:
                null === n || void 0 === n
                  ? void 0
                  : n.isPersonalPlanSubscriber,
              isSubsLoading:
                null ===
                  (r = null === n || void 0 === n ? void 0 : n.isLoading) ||
                void 0 === r ||
                r,
              subsCollectionIds: i,
            }
          );
        return (0, c.jsx)(c.Fragment, {
          children:
            "free" === e.presetValue
              ? (0, c.jsx)(jt, ui({}, o))
              : (0, c.jsx)(ai, ui({}, o)),
        });
      };
      function pi(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function di(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? pi(Object(r), !0).forEach(function (t) {
                (0, n.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : pi(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var fi = [
        f.h.SHOW_CANCEL_ANYTIME_MESSAGING_FOR_PP,
        f.h.UPDATE_PERSONAL_PLAN_TOPIC_PAGE,
        f.h.CAREER_VERTICALS,
        f.h.MARKETPLACE_SUBSCRIPTION_OFFER,
      ];
      function hi(e) {
        var t,
          r,
          n,
          i,
          s,
          h,
          m,
          v = (0, d.i)(["p"], g.g8).url,
          y = f.v.apply(void 0, fi),
          b = y.isLoading,
          _ = y.configs,
          x = {
            isExperimentConfigsLoading: b,
            showUpdatedPPTopicPage:
              "on" ===
                (null === _ ||
                void 0 === _ ||
                null === (t = _.update_personal_plan_topic_page) ||
                void 0 === t
                  ? void 0
                  : t.showUpdatedPPTopicPage) ||
              (null === !1 && !1),
            showPersonalPlanBadge:
              null !==
                (r =
                  null === _ ||
                  void 0 === _ ||
                  null === (n = _.marketplace_subscription_offer) ||
                  void 0 === n
                    ? void 0
                    : n.show_personal_plan_badge) &&
              void 0 !== r &&
              r,
            showRelatedOccupations:
              null !==
                (i =
                  null === _ ||
                  void 0 === _ ||
                  null === (s = _.career_verticals) ||
                  void 0 === s
                    ? void 0
                    : s.enableDiscoveryOnTopics) &&
              void 0 !== i &&
              i,
            showCodingExercisesBadge: !1,
          },
          O = e.schema_markup,
          j = e.metaProps,
          P =
            j.seoRobotRules && j.seoRobotRules.length > 0
              ? j.seoRobotRules
              : void 0;
        return (0, c.jsxs)(c.Fragment, {
          children: [
            (0, c.jsx)(a.p, {
              title: j.seoTitle,
              ogTitle: j.seoTitle,
              description: j.seoDescription,
              ogDescription: j.seoDescription,
              ogType: "video_lecture",
              ogLocale: {
                de: "de_DE",
                en: "en_US",
                es: "es_ES",
                fr: "fr_FR",
                id: "id_ID",
                it: "it_IT",
                ja: "ja_JP",
                ko: "ko_KR",
                nl: "nl_NL",
                pl: "pl_PL",
                pt: "pt_BR",
                ro: "ro_RO",
                ru: "ru_RU",
                ta: "ta_IN",
                th: "th_TH",
                tr: "tr_TR",
                vi: "vi_VN",
                xa: "xa_PL",
                xb: "xb_LW",
                xc: "xc_LT",
                "zh-cn": "zh_CN",
                "zh-tw": "zh_TW",
              }[e.locale],
              canonicalUrl: v,
              assetPath:
                "https://www.udemy.com/frontends-marketplace-experience",
              headWrapper: o(),
              robots: P,
            }),
            O && (0, c.jsx)(u, { schemaMarkup: O }),
            (0, c.jsx)(L, {}),
            (0, c.jsx)(l.I, {
              context: {
                showCancelAnytime:
                  null !==
                    (h =
                      null === _ ||
                      void 0 === _ ||
                      null === (m = _.show_cancel_anytime_messaging_for_pp) ||
                      void 0 === m
                        ? void 0
                        : m.showCancelAnytime) &&
                  void 0 !== h &&
                  h,
              },
              children: (0, c.jsx)(p.P, {
                children: (0, c.jsx)(li, di({}, di(di({}, e), x))),
              }),
            }),
          ],
        });
      }
      function gi(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      hi.getLayout = h.K;
      var mi = !0;
      function vi(e) {
        return (0, c.jsx)(
          hi,
          (function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? gi(Object(r), !0).forEach(function (t) {
                    (0, n.Z)(e, t, r[t]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(r)
                  )
                : gi(Object(r)).forEach(function (t) {
                    Object.defineProperty(
                      e,
                      t,
                      Object.getOwnPropertyDescriptor(r, t)
                    );
                  });
            }
            return e;
          })({}, e)
        );
      }
      vi.getLayout = hi.getLayout;
    },
    21436: function (e, t, r) {
      "use strict";
      r.d(t, {
        EG: function () {
          return s;
        },
        gP: function () {
          return i;
        },
        k2: function () {
          return a;
        },
        lJ: function () {
          return o;
        },
      });
      var n = r(66541),
        i = {
          get LINK() {
            return n.Z.toSupportLink("course_retirements", !0);
          },
        },
        o = Object.freeze({
          ASSIGN: "assign",
          ADD_TO_PATH: "add_to_path",
          ADD_TO_CUSTOM_CATEGORY: "add_to_custom_category",
        }),
        s = Object.freeze({
          CLICKED_ALTERNATIVES_LINK: "clicked_alternatives_link",
          SUBMITTED_MODAL: "submitted_modal",
        }),
        a = "show_alternatives";
    },
    57987: function (e, t, r) {
      "use strict";
      r.d(t, {
        w: function () {
          return n;
        },
      });
      var n = {
        SEARCH: "ufb_search",
        ALL_COURSES: "ufb_all_courses",
        CLP: "ufb_clp",
        UFB_COURSE_TAKING: "ufb_ct",
        COURSE_TAKING: "ct",
        COURSE_QUICK_VIEW_BOX: "ufb_cqvb",
        MANAGE_COURSES: "ufb_manage_courses",
        MY_LEARNING_UNIT: "ufb_my_learning_unit",
        COURSE_INSIGHTS: "ufb_course_insights",
        PATH_INSIGHTS: "ufb_path_insights",
        SKILL_DETAILS: "ufb_skill_details",
        LOGGED_IN_HOMEPAGE: "org_logged_in_homepage",
        ANALYTICS_ASSIGNED_LEARNING_PAGE: "AssignedLearning",
        LEARNING_PATH_LIST_PAGE: "LearningPathsListPage",
        LEARNING_PATH: "LearningPath",
        LEARNING_PATH_INSIGHTS: "pathInsights",
        AUTO_ASSIGN_RULES_PAGE: "AssignmentRules",
        MY_COURSES: "my_courses",
        MX_MY_LEARNING_UNIT: "mx_my_learning_unit",
        LAB_LIST_PAGE: "lab_list_page",
        LAB_OVERVIEW_PAGE: "lab_overview_page",
        LAB_ASSIGNED_LEARNING_PAGE: "lab_assigned_learning_page",
        LAB_USER_DETAIL_PAGE: "lab_user_detail_page",
        ASSESSMENT_LIST_PAGE: "assessment_list_page",
        ASSESSMENT_OVERVIEW_PAGE: "assessment_overview_page",
        ASSESSMENT_USER_DETAILS_PAGE: "assessment_user_details_page",
        COURSE_USER_DETAILS_PAGE: "course_user_details_page",
        LEARNING_PATH_USER_DETAILS_PAGE: "learning_path_user_details_page",
        COURSE_UPDATES: "course_updates",
        OPEN_BADGE_DETAIL_PAGE: "open_badge_detail_page",
      };
    },
    69531: function (e, t, r) {
      "use strict";
      r.d(t, {
        pX: function () {
          return v;
        },
        wy: function () {
          return y;
        },
        VA: function () {
          return b;
        },
        gZ: function () {
          return m;
        },
      });
      var n = r(67294),
        i = r(43283),
        o = r(79976),
        s = r(59499),
        a = r(78270),
        c = r(82262),
        u = r(92777),
        l = r(45959),
        p = r(63553),
        d = r(37247);
      function f(e) {
        var t = (function () {
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
          var r,
            n = (0, d.Z)(e);
          if (t) {
            var i = (0, d.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, p.Z)(this, r);
        };
      }
      var h = (function (e) {
        (0, l.Z)(r, e);
        var t = f(r);
        function r(e) {
          var n,
            i = e.actionDescription,
            o = e.resourceId,
            s = e.resourceType;
          return (
            (0, u.Z)(this, r),
            ((n = t.call(
              this,
              "OrganizationResourceMenuItemClickEvent"
            )).actionDescription = i),
            (n.resourceId = o),
            (n.resourceType = s),
            n
          );
        }
        return (0, c.Z)(r);
      })(r(24076).rp);
      function g(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function m(e, t, r, n) {
        var o;
        (null !== (o = null === n || void 0 === n ? void 0 : n.Config) &&
        void 0 !== o
          ? o
          : (0, i.c)()
        ).brand.has_organization &&
          a.j.publishEvent(
            new h(
              (function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var r = null != arguments[t] ? arguments[t] : {};
                  t % 2
                    ? g(Object(r), !0).forEach(function (t) {
                        (0, s.Z)(e, t, r[t]);
                      })
                    : Object.getOwnPropertyDescriptors
                    ? Object.defineProperties(
                        e,
                        Object.getOwnPropertyDescriptors(r)
                      )
                    : g(Object(r)).forEach(function (t) {
                        Object.defineProperty(
                          e,
                          t,
                          Object.getOwnPropertyDescriptor(r, t)
                        );
                      });
                }
                return e;
              })({ actionDescription: t }, r)
            )
          );
      }
      function v(e) {
        var t = [];
        return (
          n.Children.forEach(e, function (e) {
            e &&
              e.type.shouldRender &&
              e.type.shouldRender(e.props) &&
              t.push(e);
          }),
          t
        );
      }
      function y() {
        var e,
          t,
          r =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = null !== (e = r.Config) && void 0 !== e ? e : (0, i.c)(),
          s = null !== (t = r.me) && void 0 !== t ? t : o.ZP;
        return !s.isLoading && s.id && n.brand.has_organization;
      }
      function b(e) {
        var t,
          r =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n =
            void 0 === e.is_course_available_in_org &&
            void 0 === e.isCourseAvailableInOrg,
          o = null !== (t = r.Config) && void 0 !== t ? t : (0, i.c)();
        return (
          !o.brand.is_team &&
          !n &&
          !(e.is_course_available_in_org || e.isCourseAvailableInOrg)
        );
      }
    },
    2295: function (e, t, r) {
      "use strict";
      r.d(t, {
        Z: function () {
          return R;
        },
      });
      var n = r(59499),
        i = r(92777),
        o = r(82262),
        s = r(45959),
        a = r(63553),
        c = r(37247),
        u = r(45566),
        l = r(73115),
        p = r(80955),
        d = r(67294),
        f = r(4730),
        h = r(79594),
        g = r(85772),
        m = r(94184),
        v = r.n(m),
        y = r(21436),
        b = r(4609),
        _ = r.n(b),
        x = r(85893),
        O = ["className"];
      function j(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function P(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? j(Object(r), !0).forEach(function (t) {
                (0, n.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : j(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function w(e) {
        var t = (function () {
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
          var r,
            n = (0, c.Z)(e);
          if (t) {
            var i = (0, c.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, a.Z)(this, r);
        };
      }
      var k,
        C,
        Z = (function (e) {
          (0, s.Z)(r, e);
          var t = w(r);
          function r() {
            return (0, i.Z)(this, r), t.apply(this, arguments);
          }
          return (
            (0, o.Z)(r, [
              {
                key: "renderContent",
                value: function (e) {
                  for (
                    var t,
                      r = e.className,
                      n = (0, f.Z)(e, O),
                      i = arguments.length,
                      o = new Array(i > 1 ? i - 1 : 0),
                      s = 1;
                    s < i;
                    s++
                  )
                    o[s - 1] = arguments[s];
                  return (t = g.J.defaultProps).renderContent.apply(
                    t,
                    [P({ className: v()(r, _().tooltip) }, n)].concat(o)
                  );
                },
              },
              {
                key: "render",
                value: function () {
                  var e = this.props,
                    t = e.trigger,
                    r = e.gettext;
                  return (0, x.jsx)(g.J, {
                    placement: "bottom",
                    trigger: t,
                    canToggleOnHover: !0,
                    withPadding: !1,
                    detachFromTarget: !0,
                    renderContent: this.renderContent,
                    children: (0, x.jsx)(h.nj, {
                      html: r(
                        'This action is disabled because this course is retired. <a class="link">Learn more</a>'
                      ),
                      interpolate: {
                        link: (0, x.jsx)("a", {
                          target: "_blank",
                          rel: "noopener noreferrer",
                          href: y.gP.LINK,
                        }),
                      },
                      className: _().content,
                    }),
                  });
                },
              },
            ]),
            r
          );
        })(d.Component),
        S = (0, h.GV)(Z);
      function T(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function E(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? T(Object(r), !0).forEach(function (t) {
                (0, n.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : T(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function N(e) {
        var t = (function () {
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
          var r,
            n = (0, c.Z)(e);
          if (t) {
            var i = (0, c.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, a.Z)(this, r);
        };
      }
      var R =
        (0, p.f3)(
          "resourceContextMenuProps",
          "resourceContextMenuItemProps"
        )(
          ((C = (function (e) {
            (0, s.Z)(r, e);
            var t = N(r);
            function r() {
              return (0, i.Z)(this, r), t.apply(this, arguments);
            }
            return (
              (0, o.Z)(r, [
                {
                  key: "render",
                  value: function () {
                    var e = this.props,
                      t = e.href,
                      r = e.icon,
                      n = e.onClick,
                      i = e.title,
                      o = e.resourceContextMenuItemProps,
                      s = this.props.resourceContextMenuProps,
                      a = s.size,
                      c = s.udStyle,
                      p = o.disabled,
                      f = o.showCourseRetiredPopover,
                      h = E(
                        E(
                          E(
                            {
                              componentClass: t ? "a" : "button",
                              href: t,
                              onClick: n,
                            },
                            a && { size: a }
                          ),
                          c && { udStyle: c }
                        ),
                        p && { disabled: p }
                      ),
                      g =
                        "button" === o.udStyle
                          ? (0, x.jsxs)(
                              u.zx,
                              E(E({}, h), {}, { children: [i, r] })
                            )
                          : (0, x.jsx)(
                              l.L.MenuItem,
                              E(
                                E(
                                  {
                                    color: "neutral",
                                    icon:
                                      r &&
                                      d.cloneElement(r, { color: "neutral" }),
                                  },
                                  h
                                ),
                                {},
                                { children: i }
                              )
                            );
                    return p && f ? (0, x.jsx)(S, { trigger: g }) : g;
                  },
                },
              ]),
              r
            );
          })(d.Component)),
          (C.defaultProps = { href: null, onClick: null, icon: null }),
          (k = C))
        ) || k;
      R.shouldRender = function () {
        return !0;
      };
    },
    64670: function (e, t, r) {
      "use strict";
      r.d(t, {
        ZP: function () {
          return A;
        },
      });
      var n,
        i = r(92777),
        o = r(82262),
        s = r(45959),
        a = r(63553),
        c = r(37247),
        u = r(79594),
        l = r(733),
        p = r.n(l),
        d = r(1411),
        f = r.n(d),
        h = r(45566),
        g = r(23290),
        m = r(80955),
        v = r(67294),
        y = r(57987),
        b = r(69531),
        _ = r(59499),
        x = r(73115),
        O = r(85893);
      function j(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      function P(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? j(Object(r), !0).forEach(function (t) {
                (0, _.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : j(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function w(e) {
        var t = (function () {
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
          var r,
            n = (0, c.Z)(e);
          if (t) {
            var i = (0, c.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, a.Z)(this, r);
        };
      }
      var k,
        C,
        Z = (function (e) {
          (0, s.Z)(r, e);
          var t = w(r);
          function r(e) {
            var n;
            (0, i.Z)(this, r), (n = t.call(this, e));
            var o = e.item,
              s = e.resourceContextMenuItemProps,
              a = o.type && o.type.shouldDisable;
            return (
              (n.resourceContextMenuItemProps = P(
                P({}, s),
                {},
                {
                  disabled: !!a && a(o.props),
                  showCourseRetiredPopover: !!a && a(o.props),
                }
              )),
              n
            );
          }
          return (
            (0, o.Z)(r, [
              {
                key: "render",
                value: function () {
                  return (0, O.jsx)(m.zt, {
                    resourceContextMenuItemProps:
                      this.resourceContextMenuItemProps,
                    children: this.props.item,
                  });
                },
              },
            ]),
            r
          );
        })(v.Component),
        S =
          (0, m.f3)(
            "resourceContext",
            "resourceContextMenuProps"
          )(
            (n =
              (0, m.Pi)(
                (n = (function (e) {
                  (0, s.Z)(r, e);
                  var t = w(r);
                  function r(e) {
                    var n;
                    return (
                      (0, i.Z)(this, r),
                      ((n = t.call(this, e)).resourceContextMenuItemProps = {
                        udStyle:
                          e.menuItems.length > 1 || e.hasMenuForOneItem
                            ? "list-item"
                            : "button",
                      }),
                      n
                    );
                  }
                  return (
                    (0, o.Z)(r, [
                      {
                        key: "render",
                        value: function () {
                          var e = this,
                            t = this.props,
                            r = t.menuItems,
                            n = t.trigger;
                          if (
                            "button" ===
                            this.resourceContextMenuItemProps.udStyle
                          )
                            return (0, O.jsx)(Z, {
                              item: r[0],
                              resourceContextMenuItemProps:
                                this.resourceContextMenuItemProps,
                            });
                          var i = v.cloneElement(n, {
                            size: this.props.resourceContextMenuProps.size,
                            udStyle:
                              this.props.resourceContextMenuProps.udStyle,
                            onClick: this.onClickTrigger,
                          });
                          return (0, O.jsx)(x.L, {
                            detachFromTarget: !0,
                            placement:
                              this.props.resourceContextMenuProps.placement,
                            menuMaxHeight: "none",
                            menuWidth: "large",
                            trigger: i,
                            shouldCloseOtherPoppers: !1,
                            children: (0, O.jsx)(x.L.Menu, {
                              "data-purpose": "context-menu-options",
                              children: r.map(function (t, r) {
                                return (0,
                                O.jsx)(Z, { item: t, resourceContextMenuItemProps: e.resourceContextMenuItemProps }, r);
                              }),
                            }),
                          });
                        },
                      },
                    ]),
                    r
                  );
                })(v.Component))
              ) || n)
          ) || n,
        T = r(74022),
        E = r.n(T);
      function N(e) {
        var t = (function () {
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
          var r,
            n = (0, c.Z)(e);
          if (t) {
            var i = (0, c.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, a.Z)(this, r);
        };
      }
      var R = (0, m.Pi)(function (e) {
        var t = e.children,
          r = (0, u.QT)().gettext;
        return (0,
        O.jsx)(S, { trackingLabel: r("Share"), trigger: (0, O.jsxs)(h.zx, { children: [r("Share"), (0, O.jsx)(p(), { label: !1 })] }), menuItems: (0, b.pX)(t), hasMenuForOneItem: !1 });
      });
      R.shouldRender = function (e) {
        return !!(0, b.pX)(e.children).length;
      };
      var D = (0, m.f3)("resourceContextMenuProps")(
        (0, m.Pi)(function (e) {
          var t = e.resourceContextMenuProps,
            r = e.children,
            n = (0, u.QT)().gettext;
          return (0,
          O.jsx)(S, { trackingLabel: "dottedMenu", trigger: (0, O.jsx)(g.h, { children: (0, O.jsx)(f(), { color: "ghost" === t.udStyle ? "neutral" : "inherit", label: n("Actions") }) }), menuItems: (0, b.pX)(r), hasMenuForOneItem: !0 });
        })
      );
      D.shouldRender = function (e) {
        return !!(0, b.pX)(e.children).length;
      };
      var I = function () {
        return (0, O.jsx)("div", { className: E().divider, tabIndex: "-1" });
      };
      I.shouldRender = function () {
        return !0;
      };
      var A =
        (0, m.Pi)(
          ((C = (function (e) {
            (0, s.Z)(r, e);
            var t = N(r);
            function r(e) {
              var n;
              (0, i.Z)(this, r), (n = t.call(this, e));
              var o = e.placement,
                s = e.size,
                a = e.udStyle;
              return (
                (n.resourceContextMenuProps = {
                  placement: o,
                  size: s,
                  udStyle: a,
                }),
                n
              );
            }
            return (
              (0, o.Z)(r, [
                {
                  key: "render",
                  value: function () {
                    var e = this.props,
                      t = e.children,
                      r = e.context,
                      n = (0, b.pX)(t);
                    return n.length
                      ? (0, O.jsx)(m.zt, {
                          resourceContext: r,
                          resourceContextMenuProps:
                            this.resourceContextMenuProps,
                          children: (0, O.jsx)("div", {
                            className: E()["resource-context-menu-options"],
                            "data-purpose": "options-dropdown",
                            children: n,
                          }),
                        })
                      : null;
                  },
                },
              ]),
              r
            );
          })(v.Component)),
          (C.defaultProps = {
            placement: "bottom-end",
            size: "small",
            udStyle: "ghost",
          }),
          (k = C))
        ) || k;
      (A.Actions = R), (A.Menu = D), (A.Divider = I), (A.CONTEXT = y.w);
    },
    77312: function (e, t, r) {
      "use strict";
      r.d(t, {
        L6: function () {
          return j;
        },
      });
      var n,
        i,
        o,
        s,
        a,
        c,
        u = r(12831),
        l = r(92777),
        p = r(82262),
        d = r(71218),
        f = r(59499),
        h = r(22188),
        g = r(23791),
        m = r(79976);
      function v(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n);
        }
        return r;
      }
      var y = ((n = {}), (0, f.Z)(n, !0, "on"), (0, f.Z)(n, !1, null), n),
        b = ((i = {}), (0, f.Z)(i, !0, "1"), (0, f.Z)(i, !1, ""), i),
        _ = ((o = {}), (0, f.Z)(o, !0, "on"), (0, f.Z)(o, !1, "off"), o),
        x = ["on", "1"],
        O = ["off", "", null],
        j = Object.freeze({
          captionEditorPauseWhenTyping: Object.freeze({
            settingCode: "caption-editor-pause-when-typing",
            valueMap: y,
            defaultValue: !0,
          }),
          transcriptEditorPauseWhenTyping: Object.freeze({
            settingCode: "transcript-editor-pause-when-typing",
            valueMap: y,
            defaultValue: !0,
          }),
          interstitialAutoplay: Object.freeze({
            settingCode: "interstitialAutoNext",
            valueMap: y,
            defaultValue: !0,
          }),
          sendAssetReady: Object.freeze({
            settingCode: "send-asset-ready",
            valueMap: y,
            defaultValue: !1,
            get title() {
              return gettext("Lecture ready emails");
            },
          }),
          dailyDiscussionsDigest: Object.freeze({
            settingCode: "daily-discussions-digest",
            valueMap: y,
            defaultValue: !1,
            get title() {
              return gettext("Daily Q&A digest");
            },
          }),
          newCourseAnnouncement: Object.freeze({
            settingCode: "new-course-announcement",
            valueMap: y,
            defaultValue: !1,
            get title() {
              return gettext("New announcement emails");
            },
          }),
          newCoursePromotion: Object.freeze({
            settingCode: "new-course-promotion",
            valueMap: y,
            defaultValue: !1,
            get title() {
              return gettext("Promotional emails");
            },
          }),
          disableAllEmails: Object.freeze({
            settingCode: "disableAllEmails",
            valueMap: y,
            defaultValue: !1,
          }),
          reviewPromptDisabled: Object.freeze({
            settingCode: "review-prompt-disabled",
            valueMap: b,
            defaultValue: !1,
          }),
          iaQAOnePaneMode: Object.freeze({
            settingCode: "ia-qa-one-pane-mode",
            valueMap: y,
            defaultValue: !1,
          }),
          directMessagingEnabled: Object.freeze({
            settingCode: "direct_messaging_enabled",
            valueMap: y,
            defaultValue: !0,
          }),
          skippedOccupationFlow: Object.freeze({
            settingCode: "skipped-occupation-flow",
            valueMap: b,
            defaultValue: !1,
          }),
          mfaEnabled: Object.freeze({
            settingCode: "mfa-enabled",
            valueMap: _,
            defaultValue: !0,
          }),
          exploredCareerTracks: Object.freeze({
            settingCode: "exploredCareerTracks",
            valueMap: _,
            defaultValue: !1,
          }),
          exploredDataScientistCareerTracks: Object.freeze({
            settingCode: "exploredDataScientistCareerTracks",
            valueMap: _,
            defaultValue: !1,
          }),
        }),
        P =
          (Object.freeze(
            Object.values(j).reduce(function (e, t) {
              return (e[t.settingCode] = t), e;
            }, {})
          ),
          (s = h.LO.ref),
          (a = (function () {
            function e() {
              (0, l.Z)(this, e), (0, u.Z)(this, "settings", c, this);
            }
            return (
              (0, p.Z)(e, [
                {
                  key: "initialize",
                  value: function (e) {
                    this.settings = (function (e) {
                      for (var t = 1; t < arguments.length; t++) {
                        var r = null != arguments[t] ? arguments[t] : {};
                        t % 2
                          ? v(Object(r), !0).forEach(function (t) {
                              (0, f.Z)(e, t, r[t]);
                            })
                          : Object.getOwnPropertyDescriptors
                          ? Object.defineProperties(
                              e,
                              Object.getOwnPropertyDescriptors(r)
                            )
                          : v(Object(r)).forEach(function (t) {
                              Object.defineProperty(
                                e,
                                t,
                                Object.getOwnPropertyDescriptor(r, t)
                              );
                            });
                      }
                      return e;
                    })({}, e);
                  },
                },
                {
                  key: "get",
                  value: function (e) {
                    var t =
                        arguments.length > 1 && void 0 !== arguments[1]
                          ? arguments[1]
                          : void 0,
                      r = this.settings[e.settingCode];
                    if (!1 === e.isBoolean) return r;
                    if (void 0 !== r) {
                      if (x.includes(r)) return !0;
                      if (O.includes(r)) return !1;
                    }
                    return void 0 !== t ? t : e.defaultValue;
                  },
                },
                {
                  key: "set",
                  value: function (e, t) {
                    var r = this,
                      n =
                        arguments.length > 2 && void 0 !== arguments[2]
                          ? arguments[2]
                          : null,
                      i = "/users/me/settings/";
                    return (
                      n && (i = "/users/me/course/".concat(n, "/settings/")),
                      !1 !== e.isBoolean && (t = e.valueMap[t]),
                      g.ZP.post(i, { setting: e.settingCode, value: t }).then(
                        function () {
                          r.settings[e.settingCode] = t;
                        }
                      )
                    );
                  },
                },
              ]),
              e
            );
          })()),
          (c = (0, d.Z)(a.prototype, "settings", [s], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return {};
            },
          })),
          (0, d.Z)(
            a.prototype,
            "initialize",
            [h.aD],
            Object.getOwnPropertyDescriptor(a.prototype, "initialize"),
            a.prototype
          ),
          a),
        w = new P();
      (0, h.gx)(
        function () {
          return !m.ZP.isLoading;
        },
        function () {
          w.initialize(m.ZP.settings);
        }
      ),
        (t.ZP = w);
    },
    28855: function (e, t, r) {
      (window.__NEXT_P = window.__NEXT_P || []).push([
        "/topic/[[...topic]]",
        function () {
          return r(65424);
        },
      ]);
    },
    12624: function (e) {
      e.exports = {
        heading: "discovery-list-unit_heading__tSFmb",
        grid: "discovery-list-unit_grid__lTc5d",
        "pager-button": "discovery-list-unit_pager-button__xZJFd",
      };
    },
    30898: function (e) {
      e.exports = {
        container: "learn-more-section_container__XsuCP",
        title: "learn-more-section_title__yfwUU",
        "primary-description": "learn-more-section_primary-description__lZVYx",
        "free-topic-page-link":
          "learn-more-section_free-topic-page-link__VQ3zt",
      };
    },
    76173: function (e) {
      e.exports = {
        "topic-page-url": "related-pages_topic-page-url__ZNuuz",
        "unit-title": "related-pages_unit-title__IjZcs",
        "unit-subtitle": "related-pages_unit-subtitle__3O83x",
        "carousel-large-courses": "related-pages_carousel-large-courses__AdgkX",
      };
    },
    14582: function (e) {
      e.exports = {
        container: "topic-enrollment-stats_container__7EVxe",
        text: "topic-enrollment-stats_text__nTsdl",
      };
    },
    65069: function (e) {
      e.exports = {
        "related-categories-margin-sm":
          "topic_related-categories-margin-sm__y1ULv",
        "related-categories-margin-lg":
          "topic_related-categories-margin-lg__YSWjv",
        "primary-unit": "topic_primary-unit__gawGS",
        "secondary-heading": "topic_secondary-heading__z_Qnb",
        "secondary-description": "topic_secondary-description__Q31iu",
        "section-container": "topic_section-container__eCYFk",
        "refund-notice": "topic_refund-notice__QUP9E",
        title: "topic_title__OscWK",
        "title-skeleton": "topic_title-skeleton__egKO2",
        "learn-more-section-container":
          "topic_learn-more-section-container___mmzz",
        "learn-more-section": "topic_learn-more-section__J0Vtr",
        "career-track-link": "topic_career-track-link__yyyXY",
      };
    },
    74277: function (e) {
      e.exports = {
        "skeleton-fixed": "course-card-skeleton_skeleton-fixed__Gl3X1",
        "skeleton-flexible": "course-card-skeleton_skeleton-flexible__ifYyb",
        line: "course-card-skeleton_line__ncUqU",
        title: "course-card-skeleton_title__D1G2K",
        "skeleton-small": "course-card-skeleton_skeleton-small__Dv8aQ",
        "skeleton-large": "course-card-skeleton_skeleton-large__RKnu4",
        image: "course-card-skeleton_image__MiN6E",
        "skeleton-medium": "course-card-skeleton_skeleton-medium___XRed",
      };
    },
    83998: function (e) {
      e.exports = {
        "skeleton-title": "discovery-units-skeletons_skeleton-title__PGmSv",
        "skeleton-unit": "discovery-units-skeletons_skeleton-unit__ML6gX",
        title: "discovery-units-skeletons_title__apN9y",
        carousel: "discovery-units-skeletons_carousel__wsEH0",
        "course-container": "discovery-units-skeletons_course-container__oa1AJ",
        "course-image-lg": "discovery-units-skeletons_course-image-lg__v72ES",
        "info-container": "discovery-units-skeletons_info-container__q19UR",
        "skeleton-card": "discovery-units-skeletons_skeleton-card__dRW5O",
        "course-info": "discovery-units-skeletons_course-info__zgFHx",
        "skeleton-spacing": "discovery-units-skeletons_skeleton-spacing__WrMRq",
      };
    },
    51926: function (e) {
      e.exports = {
        wrapper: "comparison-module_wrapper__xBIwE",
        header: "comparison-module_header__VC3q8",
        "view-more-button": "comparison-module_view-more-button__6rJVi",
        "module-title": "comparison-module_module-title__PmLX9",
        "list-items": "comparison-module_list-items__zineb",
        "is-active": "comparison-module_is-active__56KID",
        list: "comparison-module_list__JgHjD",
        "refund-notice": "comparison-module_refund-notice__oIOGS",
        "comparison-lists": "comparison-module_comparison-lists__e34eJ",
        "unit-title": "comparison-module_unit-title__9VdZz",
      };
    },
    29029: function (e) {
      e.exports = {
        "background-container":
          "top-companies-notice_background-container__0X_qH",
        logos: "top-companies-notice_logos__nyrKK",
      };
    },
    62025: function (e) {
      e.exports = {
        "student-quote": "student-quote_student-quote__RIv__",
        text: "student-quote_text__MGGEK",
        title: "student-quote_title__wQJSu",
        content: "student-quote_content__EFAYf",
        quote: "student-quote_quote__jzjDv",
      };
    },
    37266: function (e) {
      e.exports = {
        "context-menu": "career-track-context-menu_context-menu__QwyUd",
      };
    },
    7567: function (e) {
      e.exports = {
        container: "career-track-card_container__5y1ud",
        "header-container": "career-track-card_header-container__Je2TZ",
        content: "career-track-card_content__p_oMR",
        "wrapper-button": "career-track-card_wrapper-button__Vv1GR",
        "career-track-wrapper": "career-track-card_career-track-wrapper__5wI3k",
        "context-menu-wrapper": "career-track-card_context-menu-wrapper__IejNc",
      };
    },
    72266: function (e) {
      e.exports = {
        "career-track-popover-content":
          "career-track-unit-popover_career-track-popover-content__2LlkA",
        "badge-new": "career-track-unit-popover_badge-new___f3Pd",
      };
    },
    25032: function (e) {
      e.exports = {
        "career-track-wrapper": "career-track-unit_career-track-wrapper__mgtze",
      };
    },
    6047: function (e) {
      e.exports = {
        "certification-unit-container":
          "certification-carousel_certification-unit-container__omick",
        "certification-carousel":
          "certification-carousel_certification-carousel__ukucs",
        "carousel-card-container":
          "certification-carousel_carousel-card-container__1YaH3",
        "carousel-card-link":
          "certification-carousel_carousel-card-link__klh0J",
        "carousel-info": "certification-carousel_carousel-info__aKVLA",
        "carousel-certificate-image":
          "certification-carousel_carousel-certificate-image__NpPEN",
        "carousel-issuer-name":
          "certification-carousel_carousel-issuer-name__W0JmU",
      };
    },
    74022: function (e) {
      e.exports = {
        "resource-context-menu-options":
          "resource-context-menu_resource-context-menu-options__6V0yj",
        divider: "resource-context-menu_divider__UwVqw",
      };
    },
    4609: function (e) {
      e.exports = {
        tooltip: "retired-course-popover-wrapper_tooltip__td2RO",
        content: "retired-course-popover-wrapper_content__qqLbc",
      };
    },
  },
  function (e) {
    e.O(
      0,
      [
        29, 982, 129, 963, 190, 110, 342, 750, 987, 791, 530, 758, 734, 708,
        818, 774, 888, 179,
      ],
      function () {
        return (t = 28855), e((e.s = t));
        var t;
      }
    );
    var t = e.O();
    _N_E = t;
  },
]);
//# sourceMappingURL=[[...topic]]-0b806df4cdef2e3f.js.map
