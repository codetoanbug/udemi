(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [708],
  {
    29811: function (e, t, r) {
      "use strict";
      r.d(t, {
        F: function () {
          return i;
        },
        k: function () {
          return d;
        },
      });
      var n,
        i,
        o = r(67294),
        a = r(79594),
        s = r(22986),
        c = r(70936),
        u = r.n(c),
        l = r(85893);
      !(function (e) {
        (e[(e.STARTING_AT_AFTER_TRIAL_PERIOD = 0)] =
          "STARTING_AT_AFTER_TRIAL_PERIOD"),
          (e[(e.STARTING_AT_AFTER_TRIAL_PERIOD_DAYS = 1)] =
            "STARTING_AT_AFTER_TRIAL_PERIOD_DAYS"),
          (e[(e.STARTING_AT_PER_MONTH = 2)] = "STARTING_AT_PER_MONTH"),
          (e[(e.PRICE_WITH_TRIAL = 3)] = "PRICE_WITH_TRIAL"),
          (e[(e.PRICE_WITH_TRIAL_PERIOD_DAYS = 4)] =
            "PRICE_WITH_TRIAL_PERIOD_DAYS"),
          (e[(e.PRICE_PER_MONTH = 5)] = "PRICE_PER_MONTH"),
          (e[(e.STARTING_AT_PER_MONTH_EMPHASIZED = 6)] =
            "STARTING_AT_PER_MONTH_EMPHASIZED");
      })(n || (n = {})),
        (function (e) {
          (e[(e.SINGLE = 0)] = "SINGLE"),
            (e[(e.MULTILINE_MARGIN = 1)] = "MULTILINE_MARGIN"),
            (e[(e.MULTILINE_NO_MARGIN = 2)] = "MULTILINE_NO_MARGIN");
        })(i || (i = {}));
      var p = function (e) {
          var t = e.style;
          return t === i.MULTILINE_NO_MARGIN || t === i.MULTILINE_MARGIN
            ? (0, l.jsx)(l.Fragment, { children: gettext("Cancel anytime") })
            : (0, l.jsx)(l.Fragment, {});
        },
        d = function (e) {
          var t,
            r = e.trialPeriodDays,
            c = e.listPriceText,
            d = e.showTrialDays,
            f = e.showStartingAtPrice,
            h = e.emphasizeListPriceText,
            y = e.style,
            m = void 0 === y ? i.SINGLE : y,
            b = (0, a.QT)().gettext,
            v =
              null !== (t = (0, o.useContext)(s.m).showCancelAnytime) &&
              void 0 !== t &&
              t;
          function g(e) {
            switch (e) {
              case n.STARTING_AT_AFTER_TRIAL_PERIOD:
                var t = b(
                  "Starting at %(listPriceText)s per month after trial"
                );
                return interpolate(
                  t,
                  { listPriceText: c, trialPeriodDays: r },
                  !0
                );
              case n.STARTING_AT_AFTER_TRIAL_PERIOD_DAYS:
                return interpolate(
                  b(
                    "Starting at %(listPriceText)s per month after %(trialPeriodDays)s-day trial"
                  ),
                  { listPriceText: c, trialPeriodDays: r },
                  !0
                );
              case n.STARTING_AT_PER_MONTH:
                return interpolate(
                  b("Starting at %(listPriceText)s per month"),
                  { listPriceText: c },
                  !0
                );
              case n.STARTING_AT_PER_MONTH_EMPHASIZED:
                return (0, l.jsx)(a.nj, {
                  html: interpolate(
                    b(
                      'Starting at <span class="emphasis">%(listPriceText)s</span> per month'
                    ),
                    { listPriceText: c },
                    !0
                  ),
                  interpolate: {
                    emphasis: (0, l.jsx)("span", { className: "ud-text-bold" }),
                  },
                });
              case n.PRICE_WITH_TRIAL_PERIOD_DAYS:
                return interpolate(
                  b(
                    "%(listPriceText)s per month after %(trialPeriodDays)s-day trial"
                  ),
                  { listPriceText: c, trialPeriodDays: r },
                  !0
                );
              case n.PRICE_WITH_TRIAL:
                var i = b("%(listPriceText)s per month after trial");
                return interpolate(
                  i,
                  { listPriceText: c, trialPeriodDays: r },
                  !0
                );
              case n.PRICE_PER_MONTH:
                var o = b("%(listPriceText)s per month");
                return interpolate(o, { listPriceText: c }, !0);
              default:
                return "";
            }
          }
          var _,
            O = m === i.MULTILINE_MARGIN || m === i.MULTILINE_NO_MARGIN,
            w = "",
            k = null !== r && void 0 !== r ? r : 0;
          if (
            (f && k > 0 && d && (_ = n.STARTING_AT_AFTER_TRIAL_PERIOD_DAYS),
            f && k > 0 && !d && (_ = n.STARTING_AT_AFTER_TRIAL_PERIOD),
            f &&
              k <= 0 &&
              (_ = h
                ? n.STARTING_AT_PER_MONTH_EMPHASIZED
                : n.STARTING_AT_PER_MONTH),
            !f && k > 0 && d && (_ = n.PRICE_WITH_TRIAL_PERIOD_DAYS),
            !f && k > 0 && !d && (_ = n.PRICE_WITH_TRIAL),
            !f && k <= 0 && (_ = n.PRICE_PER_MONTH),
            (w = v
              ? (function (e) {
                  switch (e) {
                    case n.STARTING_AT_AFTER_TRIAL_PERIOD_DAYS:
                      return interpolate(
                        b(
                          "Starting at %(listPriceText)s per month after %(trialPeriodDays)s-day trial. Cancel anytime."
                        ),
                        { listPriceText: c, trialPeriodDays: r },
                        !0
                      );
                    case n.STARTING_AT_AFTER_TRIAL_PERIOD:
                      return interpolate(
                        b(
                          "Starting at %(listPriceText)s per month after trial. Cancel anytime."
                        ),
                        { listPriceText: c, trialPeriodDays: r },
                        !0
                      );
                    case n.STARTING_AT_PER_MONTH:
                      return interpolate(
                        b(
                          "Starting at %(listPriceText)s per month. Cancel anytime."
                        ),
                        { listPriceText: c },
                        !0
                      );
                    case n.PRICE_WITH_TRIAL_PERIOD_DAYS:
                      return interpolate(
                        b(
                          "%(listPriceText)s per month after %(trialPeriodDays)s-day trial. Cancel anytime."
                        ),
                        { listPriceText: c, trialPeriodDays: r },
                        !0
                      );
                    case n.PRICE_WITH_TRIAL:
                      return interpolate(
                        b(
                          "%(listPriceText)s per month after trial. Cancel anytime."
                        ),
                        { listPriceText: c, trialPeriodDays: r },
                        !0
                      );
                    case n.PRICE_PER_MONTH:
                      return interpolate(
                        b("%(listPriceText)s per month. Cancel anytime."),
                        { listPriceText: c },
                        !0
                      );
                    default:
                      return "";
                  }
                })(_)
              : g(_)),
            (O =
              O && "string" === typeof w && w.length > 42 && w.length < 64) &&
              (w = g(_)),
            v)
          ) {
            var x = "plan-period-one-line";
            m === i.MULTILINE_MARGIN && O && (x = "plan-period-multiline"),
              m === i.MULTILINE_NO_MARGIN &&
                O &&
                (x = "plan-period-multiline-no-margin");
            var P = O ? "cancel-anytime-multiline" : "cancel-anytime-one-line";
            return (0, l.jsxs)("div", {
              children: [
                (0, l.jsx)("div", { className: u()[x], children: w }),
                (0, l.jsx)("div", {
                  className: u()[P],
                  children: O && (0, l.jsx)(p, { style: m }),
                }),
              ],
            });
          }
          return (0, l.jsx)(l.Fragment, { children: w });
        };
    },
    84558: function (e, t, r) {
      "use strict";
      r.d(t, {
        U: function () {
          return B;
        },
      });
      var n = r(59499),
        i = r(4730),
        o = r(94184),
        a = r.n(o),
        s = (r(67294), r(23554)),
        c = r(78270),
        u = r(46067),
        l = r(79594),
        p = r(45566),
        d = r(74404),
        f = r(33724),
        h = r(83548),
        y = r(87824),
        m = r(82262),
        b = r(92777),
        v = r(45959),
        g = r(63553),
        _ = r(37247),
        O = r(24076),
        w = r(67608);
      function k(e) {
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
            n = (0, _.Z)(e);
          if (t) {
            var i = (0, _.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, g.Z)(this, r);
        };
      }
      O.rp, O.rp, O.rp;
      function x(e) {
        var t = parseInt(e, 10);
        return isNaN(t) ? (0, w.Mq)(e) : t;
      }
      var P = (function (e) {
          (0, v.Z)(r, e);
          var t = k(r);
          function r(e) {
            var n,
              i =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : null,
              o = arguments.length > 2 ? arguments[2] : void 0,
              a = arguments.length > 3 ? arguments[3] : void 0,
              s =
                arguments.length > 4 && void 0 !== arguments[4]
                  ? arguments[4]
                  : null,
              c =
                arguments.length > 5 && void 0 !== arguments[5]
                  ? arguments[5]
                  : null,
              u =
                arguments.length > 6 && void 0 !== arguments[6]
                  ? arguments[6]
                  : null,
              l =
                arguments.length > 7 && void 0 !== arguments[7]
                  ? arguments[7]
                  : null;
            return (
              (0, b.Z)(this, r),
              ((n = t.call(
                this,
                "SubscriptionOfferImpressionEvent"
              )).planPriceId = void 0),
              (n.courseId = void 0),
              (n.uiRegion = void 0),
              (n.courseTrackingId = void 0),
              (n.hasTrial = void 0),
              (n.trialDays = void 0),
              (n.badges = void 0),
              (n.planPriceIds = void 0),
              (n.planPriceId = x(e).toString()),
              (n.courseId = i),
              (n.uiRegion = o),
              (n.courseTrackingId = a),
              (n.hasTrial = s),
              (n.trialDays = c),
              (n.badges = u),
              (n.planPriceIds =
                null === l || void 0 === l
                  ? void 0
                  : l.map(function (e) {
                      return x(e);
                    })),
              n
            );
          }
          return (0, m.Z)(r);
        })(O.rp),
        j = (function (e) {
          (0, v.Z)(r, e);
          var t = k(r);
          function r(e, n, i, o) {
            var a,
              s =
                arguments.length > 4 && void 0 !== arguments[4]
                  ? arguments[4]
                  : null,
              c = arguments.length > 5 ? arguments[5] : void 0,
              u =
                arguments.length > 6 && void 0 !== arguments[6]
                  ? arguments[6]
                  : null;
            (0, b.Z)(this, r),
              ((a = t.call(this, "SubscriptionCTAClickEvent")).planPriceId =
                void 0),
              (a.planType = void 0),
              (a.ctaType = void 0),
              (a.uiRegion = void 0),
              (a.courseId = void 0),
              (a.courseTrackingId = void 0),
              (a.planPriceIds = void 0);
            try {
              a.planPriceId = (0, w.Mq)(e).toString();
            } catch (l) {
              a.planPriceId = e.toString();
            }
            return (
              (a.planType = n),
              (a.ctaType = i),
              (a.uiRegion = o),
              (a.courseId = s),
              (a.courseTrackingId = c),
              (a.planPriceIds =
                null === u || void 0 === u
                  ? void 0
                  : u.map(function (e) {
                      return x(e);
                    })),
              a
            );
          }
          return (0, m.Z)(r);
        })(O.rp),
        Z = (O.rp, O.rp, O.rp, O.rp, O.rp, r(29811)),
        R = r(87998),
        T = r.n(R),
        E = r(85893),
        I = [
          "plan",
          "planPriceIds",
          "courseId",
          "uiRegion",
          "courseTrackingId",
          "onCTAClick",
          "includeTrialDaysOnCta",
          "offerCtaStyle",
          "planPeriodStyle",
        ],
        C = ["plan", "isLoading", "isSubscriber", "offerCtaStyle"];
      function S(e, t) {
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
      function D(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? S(Object(r), !0).forEach(function (t) {
                (0, n.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : S(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var A = function (e) {
          var t = e.children,
            r = e.subtitle,
            n = e.showSubtitle,
            i = void 0 === n || n,
            o = e.className,
            c = e.subtitleClassName,
            u = e.trackImpression,
            l = (0, E.jsxs)("div", {
              className: a()(T().container, o),
              children: [
                t,
                i &&
                  (0, E.jsx)("div", {
                    className: a()(T().subtitle, c),
                    children: r,
                  }),
              ],
            });
          return u
            ? (0, E.jsx)(s.H, { onlyOnce: !0, trackFunc: u, children: l })
            : l;
        },
        L = function (e) {
          var t,
            r = e.plan,
            n = e.planPriceIds,
            o = e.courseId,
            a = e.uiRegion,
            s = e.courseTrackingId,
            u = e.onCTAClick,
            d = e.includeTrialDaysOnCta,
            f = void 0 === d || d,
            m = e.offerCtaStyle,
            b = e.planPeriodStyle,
            v = (0, i.Z)(e, I),
            g = (0, l.QT)(),
            _ = g.gettext,
            O = g.ninterpolate,
            w = _("Start subscription");
          (null === r || void 0 === r ? void 0 : r.trialPeriodDays) &&
            r.trialPeriodDays > 0 &&
            (w = f
              ? O(
                  "Try it free for %(trialPeriodDays)s day",
                  "Try it free for %(trialPeriodDays)s days",
                  r.trialPeriodDays,
                  { trialPeriodDays: r.trialPeriodDays }
                )
              : _("Try Personal Plan for free"));
          var k =
              r.intervalDisplay === h.RW.Year || "year" === r.intervalDisplay,
            x = (0, E.jsx)(Z.k, {
              listPriceText:
                null !== (t = r.monthlyPrice) && void 0 !== t
                  ? t
                  : r.listPriceText,
              trialPeriodDays: r.trialPeriodDays,
              showStartingAtPrice: k,
              style: b,
            });
          return (0, E.jsx)(
            A,
            D(
              D(
                {
                  subtitle: x,
                  trackImpression: function () {
                    r &&
                      c.j.publishEvent(
                        new P(
                          r.id,
                          o,
                          a,
                          s,
                          !!r.trialPeriodDays,
                          r.trialPeriodDays,
                          null,
                          n
                        )
                      );
                  },
                },
                v
              ),
              {},
              {
                children: (0, E.jsx)(p.zx, {
                  id: "subscriptionTrialOfferButton",
                  componentClass: "a",
                  href: ""
                    .concat("/subscription-checkout/express/", "?")
                    .concat(
                      new URLSearchParams({
                        "subscription-id": r.id,
                      }).toString()
                    ),
                  onClick: function () {
                    null === u || void 0 === u || u(),
                      r &&
                        ((0, y.NH)(r.productType),
                        c.j.publishEvent(
                          new j(
                            r.id,
                            r.productType,
                            r.trialPeriodDays ? "trial" : "paid",
                            a,
                            o,
                            s,
                            n
                          )
                        ));
                  },
                  udStyle: m,
                  className: T()["cta-button"],
                  children: (0, E.jsx)("div", {
                    className: T().text,
                    children: w,
                  }),
                }),
              }
            )
          );
        },
        N = function (e) {
          var t = (0, l.QT)().gettext;
          return (0, E.jsx)(
            A,
            D(
              D({ subtitle: t("You're currently subscribed.") }, e),
              {},
              {
                children: (0, E.jsx)(p.zx, {
                  href: "/",
                  componentClass: "a",
                  onClick: function () {
                    c.j.publishEvent(
                      new u.Rd({ componentName: "GoToPersonalPlanHomeButton" })
                    );
                  },
                  "data-purpose": "subscriber-cta",
                  className: T()["cta-button"],
                  children: t("Explore Personal Plan"),
                }),
              }
            )
          );
        },
        U = function (e) {
          var t = e.className;
          return (0, E.jsxs)(d.O, {
            className: a()(T().container, t),
            "data-testid": "skeleton",
            children: [
              (0, E.jsx)(f.g, { className: T()["skeleton-button"] }),
              (0, E.jsx)(f.g, { className: T()["skeleton-text"] }),
            ],
          });
        },
        M = function (e) {
          var t = (0, l.QT)().gettext;
          return (0, E.jsx)(
            A,
            D(
              D({ subtitle: t("Not available in your country yet") }, e),
              {},
              {
                children: (0, E.jsx)(p.zx, {
                  disabled: !0,
                  udStyle: "brand",
                  children: t("Start subscription"),
                }),
              }
            )
          );
        },
        B = function (e) {
          var t = e.plan,
            r = e.isLoading,
            n = e.isSubscriber,
            o = e.offerCtaStyle,
            a = void 0 === o ? "brand" : o,
            s = (0, i.Z)(e, C);
          return r
            ? (0, E.jsx)(U, D({}, s))
            : n
            ? (0, E.jsx)(N, D({}, s))
            : t
            ? (0, E.jsx)(L, D({ plan: t, offerCtaStyle: a }, s))
            : (0, E.jsx)(M, D({ offerCtaStyle: a }, s));
        };
    },
    22986: function (e, t, r) {
      "use strict";
      r.d(t, {
        I: function () {
          return a;
        },
        m: function () {
          return o;
        },
      });
      var n = r(67294),
        i = r(85893),
        o = (0, n.createContext)({ showCancelAnytime: !1 }),
        a = function (e) {
          var t = e.context,
            r = e.children;
          return (0, i.jsx)(o.Provider, { value: t, children: r });
        };
    },
    75397: function (e, t, r) {
      "use strict";
      r.d(t, {
        p: function () {
          return l;
        },
        P: function () {
          return p;
        },
      });
      var n = r(67294),
        i = r(38619),
        o = r(83548),
        a = r(45160),
        s =
          (r(67608),
          r(31378),
          function (e) {
            if (null !== e && void 0 !== e)
              return (null === e || void 0 === e
                ? void 0
                : e.dateInterval.type) === o.RW.Day
                ? null === e || void 0 === e
                  ? void 0
                  : e.dateInterval.count
                : 0;
          }),
        c = function (e, t) {
          if (t) {
            var r = t.renewalInterval.type === o.RW.Year ? t : void 0;
            return {
              trialPeriodDays: s(t.trial),
              id: t.id,
              intervalDisplay: t.renewalInterval.type,
              listPriceText: (0, a.xG)(t.listPrice.amount),
              productType: e,
              monthlyPrice: (
                null === r || void 0 === r ? void 0 : r.monthlyPrice
              )
                ? (0, a.xG)(
                    null === r || void 0 === r ? void 0 : r.monthlyPrice.amount
                  )
                : void 0,
            };
          }
        },
        u = r(85893),
        l = (0, n.createContext)(void 0),
        p = function (e) {
          var t = (function () {
            var e,
              t,
              r = (0, n.useState)(!1),
              a = r[0],
              s = r[1],
              u = (0, n.useState)(!0),
              l = u[0],
              p = u[1];
            (0, n.useEffect)(function () {
              (0, i.Z)().then(function (e) {
                var t = e.data.header.user;
                "consumer_subscription_active" in t &&
                  s(t.consumer_subscription_active),
                  p(!1);
              });
            }, []);
            var d = (0, o.Dj)(void 0, { refetchOnWindowFocus: !1 }),
              f = d.isLoading,
              h = d.data,
              y =
                null === h || void 0 === h
                  ? void 0
                  : h.subscriptionPlansByProductType,
              m =
                null === y || void 0 === y
                  ? void 0
                  : y.find(function (e) {
                      return e.productType == o.jX.Consumersubscription;
                    }),
              b =
                null !==
                  (e = null === m || void 0 === m ? void 0 : m.priceOptions) &&
                void 0 !== e
                  ? e
                  : [],
              v = b.find(function (e) {
                return e.renewalInterval.type == o.RW.Year;
              }),
              g = b.find(function (e) {
                return e.renewalInterval.type == o.RW.Month;
              }),
              _ = b
                .map(function (e) {
                  var t;
                  return c(
                    null !==
                      (t =
                        null === m || void 0 === m ? void 0 : m.productType) &&
                      void 0 !== t
                      ? t
                      : o.jX.Consumersubscription,
                    e
                  );
                })
                .filter(function (e) {
                  return !!e;
                }),
              O = f || l;
            return (
              !l && a && (O = !1),
              {
                isLoading: O,
                subscriptionPlan: c(
                  null !==
                    (t = null === m || void 0 === m ? void 0 : m.productType) &&
                    void 0 !== t
                    ? t
                    : o.jX.Consumersubscription,
                  null !== v && void 0 !== v ? v : g
                ),
                subscriptionPlans: _,
                subscriptionPlanIds: b.map(function (e) {
                  return e.id;
                }),
                isAnnualPlanEnabled: !!v,
                isPersonalPlanSubscriber: a,
                contentCollectionIds: a ? ["1004", "1010"] : [],
              }
            );
          })();
          return (0, u.jsx)(l.Provider, { value: t, children: e.children });
        };
    },
    28334: function (e, t, r) {
      "use strict";
      r.d(t, {
        h: function () {
          return H;
        },
        v: function () {
          return W;
        },
      });
      var n,
        i,
        o,
        a,
        s,
        c,
        u,
        l,
        p,
        d,
        f,
        h,
        y,
        m,
        b,
        v,
        g,
        _,
        O,
        w,
        k,
        x,
        P,
        j,
        Z = r(67848),
        R = r(59499),
        T = r(30965),
        E = r(32542),
        I = r(76282),
        C = r(48351),
        S = function (e) {
          var t = new C.ServiceRequestContext();
          if (e) {
            var r = (function (e) {
              var t = e.headers,
                r = new I.RequestOriginInformation();
              return t && r.setAcceptLanguage(t["Accept-Language"]), r;
            })(e);
            t.setRequestOriginInfo(r);
          }
          return t;
        },
        D = r(48764).lW,
        A = (0, T.gt)({
          getUrl: function () {
            var e = new URL((0, E.B)("GRAPHQL_URL"), "https://www.udemy.com");
            return "".concat(window.location.origin).concat(e.pathname);
          },
          getHeaders: function (e) {
            var t = S({ headers: e }),
              r = D.from(t.serializeBinary()).toString("base64");
            return (0, R.Z)({}, "x-udemy-request-context", r);
          },
        });
      !(function (e) {
        (e.ClosedCaption = "CLOSED_CAPTION"), (e.Subtitle = "SUBTITLE");
      })(n || (n = {})),
        (function (e) {
          (e.Cplusplus = "CPLUSPLUS"),
            (e.CsvProcessingWithPython = "CSV_PROCESSING_WITH_PYTHON"),
            (e.CSharp = "C_SHARP"),
            (e.CSharp_11 = "C_SHARP_11"),
            (e.Html = "HTML"),
            (e.JavascriptEs6 = "JAVASCRIPT_ES6"),
            (e.Java_9 = "JAVA_9"),
            (e.Java_11 = "JAVA_11"),
            (e.Java_17 = "JAVA_17"),
            (e.Php_5 = "PHP_5"),
            (e.Php_7 = "PHP_7"),
            (e.Python_3_5 = "PYTHON_3_5"),
            (e.Python_3_8 = "PYTHON_3_8"),
            (e.Python_3_10 = "PYTHON_3_10"),
            (e.React_16 = "REACT_16"),
            (e.React_18 = "REACT_18"),
            (e.Ruby = "RUBY"),
            (e.R_3_6 = "R_3_6"),
            (e.Scipy_1_4NumpyPandasSympyAndScikitLearn_0_23 =
              "SCIPY_1_4_NUMPY_PANDAS_SYMPY_AND_SCIKIT_LEARN_0_23"),
            (e.Sql = "SQL"),
            (e.Sqlite_3 = "SQLITE_3"),
            (e.Swift_3 = "SWIFT_3"),
            (e.Swift_5 = "SWIFT_5");
        })(i || (i = {})),
        (function (e) {
          e.Cpe = "CPE";
        })(o || (o = {})),
        (function (e) {
          (e.Rating = "RATING"),
            (e.Relevance = "RELEVANCE"),
            (e.Reviews = "REVIEWS"),
            (e.Time = "TIME");
        })(a || (a = {})),
        (function (e) {
          (e.Aud = "AUD"),
            (e.Brl = "BRL"),
            (e.Cad = "CAD"),
            (e.Dkk = "DKK"),
            (e.Eur = "EUR"),
            (e.Gbp = "GBP"),
            (e.Idr = "IDR"),
            (e.Ils = "ILS"),
            (e.Inr = "INR"),
            (e.Jpy = "JPY"),
            (e.Krw = "KRW"),
            (e.Mxn = "MXN"),
            (e.Nok = "NOK"),
            (e.Pln = "PLN"),
            (e.Rub = "RUB"),
            (e.Sgd = "SGD"),
            (e.Thb = "THB"),
            (e.Try = "TRY"),
            (e.Twd = "TWD"),
            (e.Usd = "USD"),
            (e.Vnd = "VND"),
            (e.Zar = "ZAR");
        })(s || (s = {})),
        (function (e) {
          (e.Day = "DAY"),
            (e.Month = "MONTH"),
            (e.Week = "WEEK"),
            (e.Year = "YEAR");
        })(c || (c = {})),
        (function (e) {
          (e.AllInstructors = "ALL_INSTRUCTORS"),
            (e.Exclude = "EXCLUDE"),
            (e.InternalOnly = "INTERNAL_ONLY"),
            (e.IpOnly = "IP_ONLY"),
            (e.NoLongerAPriority = "NO_LONGER_A_PRIORITY");
        })(u || (u = {})),
        (function (e) {
          (e.AllLevels = "ALL_LEVELS"),
            (e.AnyLevel = "ANY_LEVEL"),
            (e.Beginner = "BEGINNER"),
            (e.Expert = "EXPERT"),
            (e.Intermediate = "INTERMEDIATE");
        })(l || (l = {})),
        (function (e) {
          (e.High = "HIGH"), (e.Low = "LOW"), (e.Medium = "MEDIUM");
        })(p || (p = {})),
        (function (e) {
          (e.FirstMover = "FIRST_MOVER"),
            (e.Specialized = "SPECIALIZED"),
            (e.Trending = "TRENDING");
        })(d || (d = {})),
        (function (e) {
          (e.AllLevels = "ALL_LEVELS"),
            (e.Beginner = "BEGINNER"),
            (e.Expert = "EXPERT"),
            (e.Intermediate = "INTERMEDIATE");
        })(f || (f = {})),
        (function (e) {
          (e.Af = "AF"),
            (e.Ak = "AK"),
            (e.Am = "AM"),
            (e.Ar = "AR"),
            (e.As = "AS"),
            (e.Az = "AZ"),
            (e.Be = "BE"),
            (e.Bg = "BG"),
            (e.Bm = "BM"),
            (e.Bn = "BN"),
            (e.Bo = "BO"),
            (e.Br = "BR"),
            (e.Bs = "BS"),
            (e.Ca = "CA"),
            (e.Ce = "CE"),
            (e.Cs = "CS"),
            (e.Cu = "CU"),
            (e.Cy = "CY"),
            (e.Da = "DA"),
            (e.De = "DE"),
            (e.Dz = "DZ"),
            (e.Ee = "EE"),
            (e.El = "EL"),
            (e.En = "EN"),
            (e.Eo = "EO"),
            (e.Es = "ES"),
            (e.Et = "ET"),
            (e.Eu = "EU"),
            (e.Fa = "FA"),
            (e.Ff = "FF"),
            (e.Fi = "FI"),
            (e.Fo = "FO"),
            (e.Fr = "FR"),
            (e.Fy = "FY"),
            (e.Ga = "GA"),
            (e.Gd = "GD"),
            (e.Gl = "GL"),
            (e.Gu = "GU"),
            (e.Gv = "GV"),
            (e.Ha = "HA"),
            (e.He = "HE"),
            (e.Hi = "HI"),
            (e.Hr = "HR"),
            (e.Hu = "HU"),
            (e.Hy = "HY"),
            (e.Ia = "IA"),
            (e.Id = "ID"),
            (e.Ig = "IG"),
            (e.Ii = "II"),
            (e.Is = "IS"),
            (e.It = "IT"),
            (e.Ja = "JA"),
            (e.Jv = "JV"),
            (e.Ka = "KA"),
            (e.Ki = "KI"),
            (e.Kk = "KK"),
            (e.Kl = "KL"),
            (e.Km = "KM"),
            (e.Kn = "KN"),
            (e.Ko = "KO"),
            (e.Ks = "KS"),
            (e.Ku = "KU"),
            (e.Kw = "KW"),
            (e.Ky = "KY"),
            (e.Lb = "LB"),
            (e.Lg = "LG"),
            (e.Ln = "LN"),
            (e.Lo = "LO"),
            (e.Lt = "LT"),
            (e.Lu = "LU"),
            (e.Lv = "LV"),
            (e.Mg = "MG"),
            (e.Mi = "MI"),
            (e.Mk = "MK"),
            (e.Ml = "ML"),
            (e.Mn = "MN"),
            (e.Mr = "MR"),
            (e.Ms = "MS"),
            (e.Mt = "MT"),
            (e.My = "MY"),
            (e.Nb = "NB"),
            (e.Nd = "ND"),
            (e.Ne = "NE"),
            (e.Nl = "NL"),
            (e.Nn = "NN"),
            (e.No = "NO"),
            (e.Om = "OM"),
            (e.Or = "OR"),
            (e.Os = "OS"),
            (e.Pa = "PA"),
            (e.Pl = "PL"),
            (e.Ps = "PS"),
            (e.Pt = "PT"),
            (e.PtBr = "PT_BR"),
            (e.PtPt = "PT_PT"),
            (e.Qu = "QU"),
            (e.Rm = "RM"),
            (e.Rn = "RN"),
            (e.Ro = "RO"),
            (e.Ru = "RU"),
            (e.Rw = "RW"),
            (e.Sd = "SD"),
            (e.Se = "SE"),
            (e.Sg = "SG"),
            (e.Si = "SI"),
            (e.Sk = "SK"),
            (e.Sl = "SL"),
            (e.Sn = "SN"),
            (e.So = "SO"),
            (e.Sq = "SQ"),
            (e.Sr = "SR"),
            (e.Su = "SU"),
            (e.Sv = "SV"),
            (e.Sw = "SW"),
            (e.Ta = "TA"),
            (e.Te = "TE"),
            (e.Tg = "TG"),
            (e.Th = "TH"),
            (e.Ti = "TI"),
            (e.Tk = "TK"),
            (e.To = "TO"),
            (e.Tr = "TR"),
            (e.Tt = "TT"),
            (e.Ug = "UG"),
            (e.Uk = "UK"),
            (e.Ur = "UR"),
            (e.Uz = "UZ"),
            (e.Vi = "VI"),
            (e.Vo = "VO"),
            (e.Wo = "WO"),
            (e.Xh = "XH"),
            (e.Yi = "YI"),
            (e.Yo = "YO"),
            (e.Zh = "ZH"),
            (e.ZhCn = "ZH_CN"),
            (e.ZhTw = "ZH_TW"),
            (e.Zu = "ZU");
        })(h || (h = {})),
        (function (e) {
          (e.CompanyWideTransformationInitiate =
            "COMPANY_WIDE_TRANSFORMATION_INITIATE"),
            (e.ComplianceTraining = "COMPLIANCE_TRAINING"),
            (e.LearnNewSkillsTogetherWithOthers =
              "LEARN_NEW_SKILLS_TOGETHER_WITH_OTHERS"),
            (e.OnboardingANewTeam = "ONBOARDING_A_NEW_TEAM"),
            (e.Other = "OTHER"),
            (e.StudyForACertificate = "STUDY_FOR_A_CERTIFICATE");
        })(y || (y = {})),
        (function (e) {
          (e.Completed = "COMPLETED"),
            (e.Enrolled = "ENROLLED"),
            (e.Started = "STARTED");
        })(m || (m = {})),
        (function (e) {
          (e.Assessment = "ASSESSMENT"),
            (e.Course = "COURSE"),
            (e.Lab = "LAB"),
            (e.LearningPath = "LEARNING_PATH");
        })(b || (b = {})),
        (function (e) {
          (e.Apple = "APPLE"),
            (e.Google = "GOOGLE"),
            (e.Other = "OTHER"),
            (e.Outlook = "OUTLOOK");
        })(v || (v = {})),
        (function (e) {
          (e.Email = "EMAIL"), (e.Push = "PUSH");
        })(g || (g = {})),
        (function (e) {
          (e.Active = "ACTIVE"), (e.Inactive = "INACTIVE");
        })(_ || (_ = {})),
        (function (e) {
          (e.Basic = "BASIC"), (e.Pro = "PRO");
        })(O || (O = {})),
        (function (e) {
          (e.ActiveCurrentPeriodAchieved = "ACTIVE_CURRENT_PERIOD_ACHIEVED"),
            (e.ActiveCurrentPeriodUnachieved =
              "ACTIVE_CURRENT_PERIOD_UNACHIEVED"),
            (e.Dropped = "DROPPED"),
            (e.ZeroHistory = "ZERO_HISTORY");
        })(w || (w = {})),
        (function (e) {
          (e.Consumersubscription = "CONSUMERSUBSCRIPTION"),
            (e.Enterprise = "ENTERPRISE"),
            (e.Team = "TEAM"),
            (e.Udemypro = "UDEMYPRO");
        })(k || (k = {})),
        (function (e) {
          (e.Active = "ACTIVE"),
            (e.Canceled = "CANCELED"),
            (e.Expired = "EXPIRED"),
            (e.Future = "FUTURE"),
            (e.Trial = "TRIAL");
        })(x || (x = {})),
        (function (e) {
          (e.Popular = "POPULAR"), (e.Trending = "TRENDING");
        })(P || (P = {})),
        (function (e) {
          (e.ExtraLong = "EXTRA_LONG"),
            (e.ExtraShort = "EXTRA_SHORT"),
            (e.Long = "LONG"),
            (e.Medium = "MEDIUM"),
            (e.Short = "SHORT");
        })(j || (j = {}));
      var L =
          "\n    query FeatureVariantAssignments($featureCodes: [String!]!, $realtimeAttributes: [FeatureRequestAttributeInput!]) {\n  featureVariantAssignmentsByCodeAndAttributes(\n    featureCodes: $featureCodes\n    realtimeAttributes: $realtimeAttributes\n  ) {\n    featureCode\n    configuration\n    isInExperiment\n  }\n}\n    ",
        N = function (e, t) {
          return (0, Z.a)(["FeatureVariantAssignments", e], A(L, e), t);
        };
      (N.getKey = function (e) {
        return ["FeatureVariantAssignments", e];
      }),
        (N.fetcher = function (e, t) {
          return A(L, e, t);
        });
      var U =
          "\n    query GetCategory($id: ID!) {\n  courseCategory(id: $id) {\n    id\n    name\n    url\n    subcategories {\n      id\n      name\n      url\n    }\n  }\n}\n    ",
        M = function (e, t) {
          return (0, Z.a)(["GetCategory", e], A(U, e), t);
        };
      (M.getKey = function (e) {
        return ["GetCategory", e];
      }),
        (M.fetcher = function (e, t) {
          return A(U, e, t);
        });
      var B =
          "\n    query GetTopic($id: ID!) {\n  topic(id: $id) {\n    id\n    name\n    url\n  }\n}\n    ",
        F = function (e, t) {
          return (0, Z.a)(["GetTopic", e], A(B, e), t);
        };
      function z(e, t) {
        var r =
          ("undefined" !== typeof Symbol && e[Symbol.iterator]) ||
          e["@@iterator"];
        if (!r) {
          if (
            Array.isArray(e) ||
            (r = (function (e, t) {
              if (!e) return;
              if ("string" === typeof e) return V(e, t);
              var r = Object.prototype.toString.call(e).slice(8, -1);
              "Object" === r && e.constructor && (r = e.constructor.name);
              if ("Map" === r || "Set" === r) return Array.from(e);
              if (
                "Arguments" === r ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
              )
                return V(e, t);
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
          a = !0,
          s = !1;
        return {
          s: function () {
            r = r.call(e);
          },
          n: function () {
            var e = r.next();
            return (a = e.done), e;
          },
          e: function (e) {
            (s = !0), (o = e);
          },
          f: function () {
            try {
              a || null == r.return || r.return();
            } finally {
              if (s) throw o;
            }
          },
        };
      }
      function V(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n;
      }
      (F.getKey = function (e) {
        return ["GetTopic", e];
      }),
        (F.fetcher = function (e, t) {
          return A(B, e, t);
        });
      var H = {
          SHOW_CANCEL_ANYTIME_MESSAGING_FOR_PP:
            "show_cancel_anytime_messaging_for_pp",
          PERSISTENT_SEARCH_BAR: "persistent_search_bar",
          UPDATE_PERSONAL_PLAN_TOPIC_PAGE: "update_personal_plan_topic_page",
          UPDATE_UDEMY_BUSINESS_TOPIC_PAGE: "update_udemy_business_topic_page",
          CAREER_VERTICALS: "career_verticals",
          MARKETPLACE_SUBSCRIPTION_OFFER: "marketplace_subscription_offer",
        },
        W = function () {
          for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
            t[r] = arguments[r];
          var n = N(
              {
                featureCodes: t,
                realtimeAttributes: [
                  { key: "custom_attribute", value: "custom_value" },
                ],
              },
              { refetchOnWindowFocus: !1 }
            ),
            i = n.isLoading,
            o = n.data;
          if (o) {
            var a,
              s = {},
              c = z(o.featureVariantAssignmentsByCodeAndAttributes);
            try {
              for (c.s(); !(a = c.n()).done; ) {
                var u = a.value,
                  l = u.featureCode,
                  p = u.configuration;
                s[l] = p;
              }
            } catch (d) {
              c.e(d);
            } finally {
              c.f();
            }
            return { isLoading: i, configs: s };
          }
          return { isLoading: i };
        };
    },
    66089: function (e, t, r) {
      "use strict";
      r.d(t, {
        Z: function () {
          return k;
        },
      });
      var n,
        i,
        o,
        a = r(50029),
        s = r(59499),
        c = r(12831),
        u = r(92777),
        l = r(82262),
        p = r(71218),
        d = r(87794),
        f = r.n(d),
        h = r(22188),
        y = r(56163),
        m = r(43277),
        b = r(4811),
        v = r(5338);
      function g(e, t) {
        var r =
          ("undefined" !== typeof Symbol && e[Symbol.iterator]) ||
          e["@@iterator"];
        if (!r) {
          if (
            Array.isArray(e) ||
            (r = (function (e, t) {
              if (!e) return;
              if ("string" === typeof e) return _(e, t);
              var r = Object.prototype.toString.call(e).slice(8, -1);
              "Object" === r && e.constructor && (r = e.constructor.name);
              if ("Map" === r || "Set" === r) return Array.from(e);
              if (
                "Arguments" === r ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
              )
                return _(e, t);
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
          a = !0,
          s = !1;
        return {
          s: function () {
            r = r.call(e);
          },
          n: function () {
            var e = r.next();
            return (a = e.done), e;
          },
          e: function (e) {
            (s = !0), (o = e);
          },
          f: function () {
            try {
              a || null == r.return || r.return();
            } finally {
              if (s) throw o;
            }
          },
        };
      }
      function _(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n;
      }
      function O(e, t) {
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
      function w(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? O(Object(r), !0).forEach(function (t) {
                (0, s.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : O(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var k =
        ((n = (0, h.aD)("Receive units")),
        (i = (function () {
          function e() {
            var t =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
              r = t.units,
              n = void 0 === r ? [] : r,
              i = t.pageType,
              a = t.pageObjectId,
              s = void 0 === a ? null : a,
              l = t.pageObject,
              p =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {};
            (0, u.Z)(this, e),
              (this.backendSource = y.YV.backendSourceOptions.DISCOVERY),
              (this.pageSize = 3),
              (this.itemCount = 12),
              (this.hasMore = !0),
              (0, c.Z)(this, "fetchUnits", o, this),
              (0, h.dw)(
                this,
                { units: n, loading: !1, error: null, firstLoad: !n.length },
                { units: h.LO.shallow }
              ),
              (this.pageType = i),
              (this.pageObjectId = s),
              (this.pageObject = l),
              (this.from = n.length),
              (this.discoveryAPI = new m.Z({}, p));
          }
          return (
            (0, l.Z)(e, [
              {
                key: "getRequestOptions",
                value: function () {
                  var e =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                    t = {
                      from: this.from,
                      pageSize: this.pageSize,
                      itemCount: this.itemCount,
                    };
                  return w(
                    w(
                      w(
                        w(
                          {},
                          this.pageObjectId && {
                            pageObjectId: this.pageObjectId,
                          }
                        ),
                        this.pageObject
                      ),
                      t
                    ),
                    e
                  );
                },
              },
              {
                key: "processPreloadedUnits",
                value: function () {
                  var e = this.getRequestOptions({ from: 0 });
                  this.units = b.Z.processUnits(e, this.units, this.pageType);
                },
              },
              {
                key: "receiveUnits",
                value: function (e) {
                  var t,
                    r = g(e);
                  try {
                    for (r.s(); !(t = r.n()).done; ) {
                      var n = t.value;
                      n.items && (0, v.q)(n.items);
                    }
                  } catch (a) {
                    r.e(a);
                  } finally {
                    r.f();
                  }
                  this.loading = !1;
                  var i = this.units.concat(e),
                    o = this.getRequestOptions();
                  this.units = b.Z.processUnits(o, i, this.pageType);
                },
              },
              {
                key: "receiveError",
                value: function (e) {
                  (this.loading = !1), (this.error = e);
                },
              },
              {
                key: "removeFirstLoad",
                value: function () {
                  this.firstLoad = !1;
                },
              },
            ]),
            e
          );
        })()),
        (o = (0, p.Z)(i.prototype, "fetchUnits", [h.aD], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            var e = this;
            return (function () {
              var t = (0, a.Z)(
                f().mark(function t(r) {
                  var n, i, o;
                  return f().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            if (
                              ((t.prev = 0),
                              !e.loading && e.hasMore && !e.error)
                            ) {
                              t.next = 3;
                              break;
                            }
                            return t.abrupt("return");
                          case 3:
                            return (
                              (e.loading = !0),
                              (n = e.getRequestOptions(r)),
                              (t.next = 7),
                              e.discoveryAPI.loadUnits(e.pageType, n)
                            );
                          case 7:
                            return (
                              (i = t.sent),
                              (o = i.results),
                              e.receiveUnits(o),
                              (e.from = i.last_index + 1),
                              (e.hasMore = i.has_more),
                              t.abrupt("return", o)
                            );
                          case 15:
                            (t.prev = 15),
                              (t.t0 = t.catch(0)),
                              e.receiveError(t.t0);
                          case 18:
                            return (
                              (t.prev = 18), e.removeFirstLoad(), t.finish(18)
                            );
                          case 21:
                          case "end":
                            return t.stop();
                        }
                    },
                    t,
                    null,
                    [[0, 15, 18, 21]]
                  );
                })
              );
              return function (e) {
                return t.apply(this, arguments);
              };
            })();
          },
        })),
        (0, p.Z)(
          i.prototype,
          "processPreloadedUnits",
          [h.aD],
          Object.getOwnPropertyDescriptor(i.prototype, "processPreloadedUnits"),
          i.prototype
        ),
        (0, p.Z)(
          i.prototype,
          "receiveUnits",
          [n],
          Object.getOwnPropertyDescriptor(i.prototype, "receiveUnits"),
          i.prototype
        ),
        (0, p.Z)(
          i.prototype,
          "receiveError",
          [h.aD],
          Object.getOwnPropertyDescriptor(i.prototype, "receiveError"),
          i.prototype
        ),
        (0, p.Z)(
          i.prototype,
          "removeFirstLoad",
          [h.aD],
          Object.getOwnPropertyDescriptor(i.prototype, "removeFirstLoad"),
          i.prototype
        ),
        i);
    },
    98460: function (e, t, r) {
      "use strict";
      r.d(t, {
        Z: function () {
          return Id;
        },
      });
      var n = r(90116),
        i = r(59499),
        o = r(92777),
        a = r(82262),
        s = r(45959),
        c = r(63553),
        u = r(37247),
        l = r(74256),
        p = r(79594),
        d = r(89530),
        f = r(36186),
        h = r(94184),
        y = r.n(h),
        m = r(80955),
        b = r(67294),
        v = r(12029),
        g = r(5962),
        _ = r(61646),
        O = r(38614),
        w = r(85893),
        k = function (e) {
          return (0, w.jsx)(O.S, {
            captureException: _.c.captureException,
            children: e.children,
          });
        },
        x = r(71361),
        P = r(45566),
        j = r(11884),
        Z = r(78270),
        R = r(23554),
        T = r(97441),
        E = r.n(T),
        I = r(24076);
      function C(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var S = (function (e) {
          (0, s.Z)(r, e);
          var t = C(r);
          function r(e) {
            var n,
              i = e.assessmentId,
              a = void 0 === i ? void 0 : i,
              s = e.sourcePageType,
              c = void 0 === s ? void 0 : s,
              u = e.sourcePageId,
              l = void 0 === u ? void 0 : u,
              p = e.status,
              d = void 0 === p ? void 0 : p,
              f = e.componentName,
              h = e.uiRegion,
              y = void 0 === h ? void 0 : h;
            return (
              (0, o.Z)(this, r),
              ((n = t.call(this, "AssessmentClickEvent")).componentName = f),
              (n.assessmentId = a),
              (n.sourcePageType = c),
              (n.sourcePageId = l),
              (n.status = d),
              (n.uiRegion = y),
              n
            );
          }
          return (0, a.Z)(r);
        })(I.rp),
        D = (function (e) {
          (0, s.Z)(r, e);
          var t = C(r);
          function r(e) {
            var n,
              i = e.assessmentId,
              a = void 0 === i ? void 0 : i,
              s = e.sourcePageType,
              c = void 0 === s ? void 0 : s,
              u = e.sourcePageId,
              l = void 0 === u ? void 0 : u,
              p = e.status,
              d = void 0 === p ? void 0 : p,
              f = e.uiRegion,
              h = void 0 === f ? void 0 : f;
            return (
              (0, o.Z)(this, r),
              ((n = t.call(this, "AssessmentPresentedEvent")).assessmentId = a),
              (n.sourcePageType = c),
              (n.sourcePageId = l),
              (n.status = d),
              (n.uiRegion = h),
              n
            );
          }
          return (0, a.Z)(r);
        })(I.rp),
        A = (I.rp, I.rp, I.rp, r(76905)),
        L = function (e) {
          var t = e.className,
            r = void 0 === t ? "" : t,
            n = (0, p.QT)().gettext;
          return (0, w.jsx)(A.C, {
            className: y()("ud-badge-in-progress", r),
            children: n("In Progress"),
          });
        },
        N = function (e) {
          var t = e.className,
            r = void 0 === t ? "" : t,
            n = (0, p.QT)().gettext;
          return (0, w.jsx)(A.C, {
            className: y()("ud-badge-completed", r),
            children: n("Completed"),
          });
        },
        U = function (e) {
          var t = e.className,
            r = void 0 === t ? "" : t,
            n = (0, p.QT)().gettext;
          return (0, w.jsx)(A.C, {
            className: y()("ud-badge-expired", r),
            children: n("Expired"),
          });
        };
      var M,
        B,
        F = r(59192),
        z = function (e) {
          switch (e.badgeType) {
            case F._J:
              return (0, w.jsx)(U, {});
            case F.J6:
              return (0, w.jsx)(N, {});
            case F.K_:
              return (0, w.jsx)(L, {});
          }
          return null;
        },
        V = r(80785),
        H = r(58173),
        W = r.n(H),
        G = function () {
          var e = (0, p.QT)().gettext;
          return (0, w.jsxs)(w.Fragment, {
            children: [
              (0, w.jsx)(V.u, {
                canToggleOnHover: !0,
                placement: "bottom-start",
                udStyle: "white",
                detachFromTarget: !0,
                trigger: (0, w.jsx)("button", {
                  className: W()["beta-badge"],
                  children: (0, w.jsx)(A.C, { children: e("Beta") }),
                }),
                children: e(
                  "This assessment is new. Your data will help us to continue making improvements."
                ),
              }),
              (0, w.jsx)("span", {
                className: "ud-sr-only",
                children: e(
                  "This assessment is new. Your data will help us to continue making improvements."
                ),
              }),
            ],
          });
        },
        K = r(83241),
        q = r.n(K),
        Y = function (e) {
          var t = e.text,
            r = e.size,
            n = e.onClick,
            o = e.href,
            a = e.id,
            s = e.ariaLabelledBy;
          return (0, w.jsx)(P.zx, {
            componentClass: o ? "a" : "button",
            size: "small" === r ? "xsmall" : "small",
            className: y()(
              "button",
              (0, i.Z)({}, q()["small-btn"], "small" === r)
            ),
            udStyle: "link-underline",
            onClick: n,
            href: o,
            id: a,
            "aria-labelledby": s,
            children: t,
          });
        },
        Q = r(65830),
        J = r.n(Q),
        X = r(25601),
        $ = r.n(X),
        ee = function (e) {
          var t = e.isCompleted,
            r = void 0 !== t && t;
          return (0, w.jsx)(J(), {
            label: !1,
            className: y()(
              [$()["assessment-icon"]],
              (0, i.Z)({}, $().completed, r)
            ),
          });
        },
        te = r(48887),
        re = r.n(te);
      function ne(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var ie,
        oe,
        ae,
        se,
        ce,
        ue =
          (0, m.Pi)(
            ((B = (function (e) {
              (0, s.Z)(r, e);
              var t = ne(r);
              function r() {
                var e;
                (0, o.Z)(this, r);
                for (
                  var n = arguments.length, i = new Array(n), a = 0;
                  a < n;
                  a++
                )
                  i[a] = arguments[a];
                return (
                  ((e = t.call.apply(t, [this].concat(i))).onClick =
                    function () {
                      var t = e.props,
                        r = t.id,
                        n = t.uiRegion,
                        i = t.sourcePageId,
                        o = t.sourcePageType;
                      Z.j.publishEvent(
                        new S({
                          componentName: "takeAssessment",
                          assessmentId: String(r),
                          status: "none",
                          uiRegion: n,
                          sourcePageType: o,
                          sourcePageId: i,
                        })
                      );
                    }),
                  (e.trackImpression = function () {
                    var t = e.props,
                      r = t.id,
                      n = t.uiRegion,
                      i = t.sourcePageId,
                      o = t.sourcePageType;
                    Z.j.publishEvent(
                      new D({
                        assessmentId: String(r),
                        status: "none",
                        uiRegion: n,
                        sourcePageId: i,
                        sourcePageType: o,
                      })
                    );
                  }),
                  e
                );
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "render",
                    value: function () {
                      var e = this.props,
                        t = e.title,
                        r = e.equivalentNumberOfQuestions,
                        n = e.assessmentLinkDestination,
                        o = e.isBeta,
                        a = "";
                      var s = "".concat(this.props.id, "-header"),
                        c = (0, w.jsxs)("div", {
                          className: y()(
                            this.props.className,
                            re()["take-assessment-card-container"],
                            (0, i.Z)(
                              {},
                              re()["take-assessment-card-container-pp"],
                              this.props.isPersonalPlan
                            )
                          ),
                          "data-purpose": "take-assessment-card",
                          children: [
                            (0, w.jsx)(ee, {}),
                            (0, w.jsxs)("div", {
                              className: re()["take-assessment-info"],
                              children: [
                                (0, w.jsxs)("h3", {
                                  className: y()(
                                    "ud-heading-md",
                                    re()["take-assessment-card-info-title"]
                                  ),
                                  children: [
                                    (0, w.jsx)("span", {
                                      id: s,
                                      className: "ud-sr-only",
                                      children: t,
                                    }),
                                    (0, w.jsx)("a", {
                                      tabIndex: -1,
                                      "aria-hidden": !0,
                                      href: n,
                                      onClick: this.onClick,
                                      "data-purpose": "title-link",
                                      children: t,
                                    }),
                                  ],
                                }),
                                (0, w.jsxs)("div", {
                                  children: [
                                    (0, w.jsxs)("div", {
                                      className:
                                        re()["ud-assessment-badge-container"],
                                      children: [
                                        this.props.isPersonalPlan &&
                                          (0, w.jsx)(z, { badgeType: a }),
                                        o && (0, w.jsx)(G, {}),
                                      ],
                                    }),
                                    (0, w.jsx)("div", {
                                      className:
                                        re()[
                                          "take-assessment-card-info-container"
                                        ],
                                      children: (0, w.jsxs)("div", {
                                        className: y()(
                                          "ud-text-xs",
                                          re()[
                                            "take-assessment-card-info-line"
                                          ],
                                          re()["info-number-of-questions"]
                                        ),
                                        children: [
                                          (0, w.jsx)(E(), {
                                            label: !1,
                                            className: re()["info-icon"],
                                          }),
                                          (0, w.jsx)("span", {
                                            className: re()["info-content"],
                                            children: ninterpolate(
                                              "~%(count)s question",
                                              "~%(count)s questions",
                                              r,
                                              { count: r },
                                              !0
                                            ),
                                          }),
                                        ],
                                      }),
                                    }),
                                    (0, w.jsx)(Y, {
                                      text: gettext("Take assessment"),
                                      onClick: this.onClick,
                                      href: n,
                                      "data-purpose": "assessment-cta",
                                      id: this.props.id,
                                      ariaLabelledBy: [this.props.id, s].join(
                                        " "
                                      ),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        });
                      return (0, w.jsx)(R.H, {
                        trackFunc: this.trackImpression,
                        children: (0, w.jsx)("div", {
                          style: { position: "relative" },
                          children: c,
                        }),
                      });
                    },
                  },
                ]),
                r
              );
            })(b.Component)),
            (B.defaultProps = {
              isBeta: !1,
              isPersonalPlan: !1,
              className: "",
              uiRegion: null,
              sourcePageType: null,
              sourcePageId: null,
            }),
            (M = B))
          ) || M,
        le = (0, p.GV)(ue),
        pe = r(76281),
        de = r.n(pe),
        fe = function (e) {
          var t = e.unit,
            r = e.title,
            n = e.subtitle,
            o = e.isStandaloneUnit,
            a = void 0 !== o && o,
            s = e.uiRegion,
            c = e.sourcePageType,
            u = e.sourcePageId,
            l = (0, x.ag)("mobile-max"),
            d = (0, x.ag)("(any-pointer: fine)"),
            f = (0, x.ag)("(any-pointer: coarse"),
            h = (0, p.QT)();
          if (!t.items.length) return (0, w.jsx)("div", {});
          var m = t.items,
            b = (0, w.jsx)(P.zx, {
              "data-purpose": "browse-all-assessments-btn",
              udStyle: "link-underline",
              componentClass: "a",
              href: "/skills-assessment/",
              className: y()(
                de()["browse-button"],
                (0, i.Z)({}, de()["is-standalone-unit"], a)
              ),
              children: h.gettext("Browse all assessments"),
            });
          return (0, w.jsxs)("section", {
            "data-purpose": "assessment-unit-container",
            className: y()(
              "component-margin",
              de()["assessment-unit-container"]
            ),
            children: [
              (0, w.jsx)("h2", {
                className: a ? "ud-heading-serif-xl" : "ud-heading-lg",
                "data-purpose": "assessment-unit-title",
                children: r,
              }),
              (n || !a) &&
                (0, w.jsxs)("div", {
                  className: de()["subtitle-button-wrapper"],
                  children: [
                    n &&
                      (0, w.jsx)("p", {
                        className: de()["unit-subtitle"],
                        "data-purpose": "assessment-unit-subtitle",
                        children: n,
                      }),
                    b,
                  ],
                }),
              (0, w.jsx)(j.l, {
                "data-purpose": "carousel",
                fullViewport: !!l,
                showPager: !!d,
                allowScroll: !!f,
                className: de()["assessment-carousel"],
                children:
                  null === m || void 0 === m
                    ? void 0
                    : m.map(function (e) {
                        return (0,
                        w.jsx)(le, { id: e.id, title: e.title, minCompletionTime: 25, maxCompletionTime: 35, equivalentNumberOfQuestions: 30, assessmentLinkDestination: "/skills-assessment/".concat(e.slug), isBeta: e.isBeta, isPersonalPlan: !0, className: de()["assessment-unit-card"], uiRegion: s, sourcePageType: c, sourcePageId: u }, e.id);
                      }),
              }),
              b,
            ],
          });
        },
        he = r(4730),
        ye = r(2975),
        me = r.n(ye),
        be = r(41293),
        ve = r(43615),
        ge = r(79034),
        _e = r(14546),
        Oe = r(32658),
        we = r(5338),
        ke = r(93797),
        xe = r(34971),
        Pe = r(87790),
        je = r(56793),
        Ze = r(12831),
        Re = r(71218),
        Te = r(22188),
        Ee = r(56163),
        Ie = r(39865),
        Ce = r(79976),
        Se = "WISHLIST_DEFAULT_STATE",
        De = "WISHLIST_LOADING_STATE",
        Ae = "WISHLIST_FINISHED_STATE";
      var Le =
          ((ie = (function () {
            function e(t, r) {
              var n = this;
              (0, o.Z)(this, e),
                (this._getIsWishlisted = function (e) {
                  return Ie.W8.lists.wishlist.items.some(function (t) {
                    return t.buyable.id === e;
                  });
                }),
                (0, Ze.Z)(this, "_setIsWishlisted", oe, this),
                (0, Ze.Z)(this, "_clearIsWishlisted", ae, this),
                (0, Ze.Z)(this, "_setWishlistProcessState", se, this),
                (this._buildNextUrl = function () {
                  return (
                    n.searchParams.set("xref", "wish"),
                    n.searchParams.set("courseId", n.course.id),
                    ""
                      .concat(n.window.location.href.split("?")[0], "?")
                      .concat(n.searchParams.toString())
                  );
                }),
                (this._authUrl = function () {
                  var e = n._buildNextUrl(),
                    t = n.window.location.href;
                  return Ce.ZP.id
                    ? e
                    : f.qJ.toAuth({
                        showLogin: !1,
                        nextUrl: e,
                        returnUrl: t,
                        source: "course_landing_page",
                        responseType: "html",
                      });
                }),
                (this.logWishlistClickEvent = function () {
                  Z.j.publishEvent(
                    new Ee.Vz({
                      id: n.course.id,
                      trackingId:
                        n.course.frontendTrackingId || n.course.tracking_id,
                    })
                  ),
                    window.appboy &&
                      "function" ===
                        typeof window.appboy.isPushPermissionGranted &&
                      window.appboy.isPushPermissionGranted() &&
                      window.appboy.logCustomEvent("Wishlist", {
                        course_id: n.course.id,
                      });
                }),
                (this._addToWishlist = function () {
                  return (
                    n._setIsWishlisted(),
                    n._setWishlistProcessState(De),
                    n.logWishlistClickEvent(),
                    Ie.W8.addToList("wishlist", { buyable: n.buyables })
                      .then(
                        (0, Te.aD)(function () {
                          return (
                            n._setWishlistProcessState(Ae), Promise.resolve()
                          );
                        })
                      )
                      .catch(
                        (0, Te.aD)(function (e) {
                          throw (
                            (n._clearIsWishlisted(),
                            n._setWishlistProcessState(Se),
                            e)
                          );
                        })
                      )
                  );
                }),
                (this._removeFromWishlist = function () {
                  return (
                    n._clearIsWishlisted(),
                    n._setWishlistProcessState(De),
                    Ie.W8.removeFromList("wishlist", { buyable: n.buyables })
                      .then(
                        (0, Te.aD)(function () {
                          return (
                            n._setWishlistProcessState(Ae), Promise.resolve()
                          );
                        })
                      )
                      .catch(
                        (0, Te.aD)(function (e) {
                          throw (
                            (n._setIsWishlisted(),
                            n._setWishlistProcessState(Se),
                            e)
                          );
                        })
                      )
                  );
                }),
                (this._getHasWishlistIntent = function () {
                  return "wish" === n.searchParams.get("xref");
                }),
                (0, Ze.Z)(this, "toggleWishlist", ce, this),
                (this.removeWishlistIntent = function () {
                  n._getHasWishlistIntent() &&
                    (n.searchParams.delete("xref"),
                    n.searchParams.delete("courseId"),
                    n.window.history.replaceState(
                      {},
                      "",
                      ""
                        .concat(n.window.location.pathname, "?")
                        .concat(n.searchParams.toString())
                    ));
                }),
                (0, Te.dw)(this, {
                  wishlistProcessState: Se,
                  isWishlisted: this._getIsWishlisted(t.id),
                }),
                (this.window = r),
                (this.course = t),
                (this.searchParams = new URLSearchParams(
                  this.window.location.search
                )),
                (this.buyables = {
                  buyable_context: {},
                  buyable_object_type: "course",
                  id: this.course.id,
                });
            }
            return (
              (0, a.Z)(e, [
                {
                  key: "apiRequestIsLoading",
                  get: function () {
                    return this.wishlistProcessState === De;
                  },
                },
              ]),
              e
            );
          })()),
          (oe = (0, Re.Z)(ie.prototype, "_setIsWishlisted", [Te.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                (e.isWishlisted = !0), (e.course.is_wishlisted = !0);
              };
            },
          })),
          (ae = (0, Re.Z)(ie.prototype, "_clearIsWishlisted", [Te.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                (e.isWishlisted = !1), (e.course.is_wishlisted = !1);
              };
            },
          })),
          (se = (0, Re.Z)(ie.prototype, "_setWishlistProcessState", [Te.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                e.wishlistProcessState = t;
              };
            },
          })),
          (ce = (0, Re.Z)(ie.prototype, "toggleWishlist", [Te.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                var t = e._authUrl();
                if (Ce.ZP.id) {
                  if (!e.apiRequestIsLoading) {
                    var r = e.isWishlisted
                      ? e._removeFromWishlist
                      : e._addToWishlist;
                    return e._setWishlistProcessState(Se), r();
                  }
                } else e.window.location.href = t;
              };
            },
          })),
          (0, Re.Z)(
            ie.prototype,
            "apiRequestIsLoading",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(
              ie.prototype,
              "apiRequestIsLoading"
            ),
            ie.prototype
          ),
          ie),
        Ne = r(10748),
        Ue = r(20804),
        Me = r(23290),
        Be = r(53668),
        Fe = r.n(Be),
        ze = r(97331);
      function Ve(e, t) {
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
      function He(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Ve(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Ve(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var We = {
          fill: "transparent",
          padding: "1px",
          stroke: "currentColor",
          strokeWidth: "2",
        },
        Ge = function (e) {
          return (0, w.jsx)(Fe(), He(He({}, e), {}, { style: We }));
        };
      Ge.$$udType = "Icon";
      var Ke = Ge,
        qe = [
          "isWishlisted",
          "isLoading",
          "round",
          "size",
          "wishlistCta",
          "wishlistedCta",
          "labelPosition",
          "square",
        ];
      function Ye(e, t) {
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
      function Qe(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Ye(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Ye(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Xe = (function (e) {
        (0, s.Z)(r, e);
        var t = Je(r);
        function r() {
          return (0, o.Z)(this, r), t.apply(this, arguments);
        }
        return (
          (0, a.Z)(r, [
            {
              key: "wishlistCta",
              get: function () {
                return this.props.wishlistCta || gettext("Add to wishlist");
              },
            },
            {
              key: "wishlistedCta",
              get: function () {
                return this.props.wishlistedCta || gettext("Wishlisted");
              },
            },
            {
              key: "render",
              value: function () {
                var e = this.props,
                  t = e.isWishlisted,
                  r = e.isLoading,
                  n = e.round,
                  i = e.size,
                  o = (e.wishlistCta, e.wishlistedCta, e.labelPosition),
                  a = e.square,
                  s = (0, he.Z)(e, qe),
                  c = Qe(
                    Qe({ udStyle: "secondary", size: i }, s),
                    {},
                    {
                      disabled: !!s.disabled,
                      "aria-pressed": t,
                      "aria-label": this.wishlistCta,
                    }
                  ),
                  u = t ? Fe() : Ke,
                  l = t ? this.wishlistedCta : this.wishlistCta,
                  p = r ? (0, w.jsx)(ze.a, { color: "inherit" }) : null;
                return a || n
                  ? (0, w.jsx)(
                      Me.h,
                      Qe(
                        Qe({}, c),
                        {},
                        {
                          round: n,
                          children:
                            p || (0, w.jsx)(u, { color: "inherit", label: !1 }),
                        }
                      )
                    )
                  : (0, w.jsx)(
                      P.zx,
                      Qe(
                        Qe({}, c),
                        {},
                        {
                          children:
                            p ||
                            (0, w.jsxs)(w.Fragment, {
                              children: [
                                "left" == o &&
                                  (0, w.jsx)("span", { children: l }),
                                (0, w.jsx)(u, {
                                  color: "inherit",
                                  size:
                                    "right" == o ? this.props.size : "small",
                                  label: !1,
                                }),
                                "right" == o &&
                                  (0, w.jsx)("span", { children: l }),
                              ],
                            }),
                        }
                      )
                    );
              },
            },
          ]),
          r
        );
      })(b.Component);
      Xe.defaultProps = {
        round: !1,
        size: "medium",
        wishlistCta: null,
        wishlistedCta: null,
        labelPosition: "left",
        square: !1,
      };
      var $e,
        et,
        tt,
        rt,
        nt,
        it = r(38619),
        ot = r(43283),
        at = [
          "wishlistStore",
          "round",
          "isMobile",
          "isCourseInUserSubscription",
          "uiRegion",
        ];
      function st(e, t) {
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
      function ct(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? st(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : st(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function ut(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var lt,
        pt,
        dt,
        ft =
          (0, m.Pi)(
            ((nt = (function (e) {
              (0, s.Z)(r, e);
              var t = ut(r);
              function r() {
                var e;
                (0, o.Z)(this, r);
                for (
                  var n = arguments.length, i = new Array(n), a = 0;
                  a < n;
                  a++
                )
                  i[a] = arguments[a];
                return (
                  (e = t.call.apply(t, [this].concat(i))),
                  (0, Ze.Z)(e, "isLoadingCommonAppContext", tt, (0, Ne.Z)(e)),
                  (0, Ze.Z)(e, "isPersonalPlanSubscriber", rt, (0, Ne.Z)(e)),
                  e
                );
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "componentDidMount",
                    value: function () {
                      var e = this;
                      (0, it.Z)().then(function (t) {
                        (0, Te.z)(function () {
                          (e.isLoadingCommonAppContext = !1),
                            (e.isPersonalPlanSubscriber =
                              t.data.header.user.consumer_subscription_active);
                        });
                      });
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this.props,
                        t = e.wishlistStore,
                        r = e.round,
                        n = e.isMobile,
                        i = e.isCourseInUserSubscription,
                        o = e.uiRegion,
                        a = (0, he.Z)(e, at);
                      return this.isLoadingCommonAppContext
                        ? null
                        : this.isPersonalPlanSubscriber && i
                        ? (0, w.jsx)(Ue.N, {
                            course: {
                              id: t.course.id,
                              is_in_user_subscription: !0,
                            },
                            uiRegion: o,
                            size: "medium",
                            labelPosition: "left",
                          })
                        : !(0, ot.c)().features.wishlist || Ce.ZP.isLoading
                        ? null
                        : (0, w.jsx)("div", {
                            children: (0, w.jsx)(
                              Xe,
                              ct(
                                {
                                  "data-purpose": "toggle-wishlist",
                                  isWishlisted: t.isWishlisted,
                                  isLoading: t.apiRequestIsLoading,
                                  onClick: t.toggleWishlist,
                                  round: r,
                                  wishlistCta: n
                                    ? gettext("Add to Wishlist")
                                    : gettext("Wishlist"),
                                  style: { width: "100%" },
                                },
                                a
                              )
                            ),
                          });
                    },
                  },
                ]),
                r
              );
            })(b.Component)),
            (nt.defaultProps = {
              round: !1,
              isMobile: !0,
              isCourseInUserSubscription: !1,
              uiRegion: Pe.n.WISHLIST,
            }),
            (et = nt),
            (tt = (0, Re.Z)(
              et.prototype,
              "isLoadingCommonAppContext",
              [Te.LO],
              {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  return !0;
                },
              }
            )),
            (rt = (0, Re.Z)(et.prototype, "isPersonalPlanSubscriber", [Te.LO], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return !1;
              },
            })),
            ($e = et))
          ) || $e,
        ht = r(82078),
        yt = r(41477),
        mt = r(48043),
        bt = r(61171),
        vt = r.n(bt),
        gt = ["course"];
      function _t(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      function Ot(e, t) {
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
      function wt(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Ot(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Ot(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var kt = function (e) {
          return (0, w.jsx)(
            P.zx,
            wt(wt({}, e), {}, { udStyle: "secondary", children: e.children })
          );
        },
        xt = function (e) {
          var t = e.course,
            r = (0, he.Z)(e, gt);
          return (0, w.jsx)(
            be.E,
            wt(
              wt(
                {
                  src: t.image_50x50,
                  srcSet: ""
                    .concat(t.image_50x50, " 1x, ")
                    .concat(t.image_100x100, " 2x"),
                  alt: "",
                  width: 64,
                  height: 64,
                },
                r
              ),
              {},
              { className: vt()["course-image"] }
            )
          );
        },
        Pt = function (e) {
          var t = e.numStudents;
          return (0, w.jsxs)("span", {
            className: y()("ud-text-sm", vt()["num-students"]),
            children: [
              (0, w.jsx)(me(), { label: !1, size: "xsmall" }),
              (0, w.jsx)("span", { children: (0, mt.uf)(t) }),
            ],
          });
        },
        jt = function (e) {
          var t = e.lastUpdatedDate,
            r = new Date(t),
            n = (0, yt.s)(),
            i = n && n.locale ? n.locale.replace("_", "-") : "en-US",
            o = r.toLocaleDateString(i, { month: "numeric", year: "numeric" });
          return (0, w.jsxs)("span", {
            children: [gettext("Updated"), " ", o],
          });
        },
        Zt =
          (0, m.f3)(function (e) {
            var t = e.trackingContext;
            return { trackingContext: void 0 === t ? {} : t };
          })(
            (lt = (function (e) {
              (0, s.Z)(r, e);
              var t = _t(r);
              function r() {
                var e;
                (0, o.Z)(this, r);
                for (
                  var n = arguments.length, i = new Array(n), a = 0;
                  a < n;
                  a++
                )
                  i[a] = arguments[a];
                return (
                  ((e = t.call.apply(t, [this].concat(i))).trackClick =
                    function () {
                      (0, ht.g)({
                        courseId: e.props.course.id,
                        courseTrackingId: e.props.course.frontendTrackingId,
                        componentName: "courseComparisonItem",
                      });
                    }),
                  (e.trackImpression = function () {
                    we.R.trackDiscoveryImpression(
                      { item: e.props.course },
                      {
                        backendSource: e.props.trackingContext.backendSource,
                        index: e.props.trackingContext.index,
                      }
                    );
                  }),
                  e
                );
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "render",
                    value: function () {
                      var e = this.props.course,
                        t =
                          e.badges && e.badges.length
                            ? (0, ke.Vg)(e.badges[0].badge_family)
                            : null;
                      return (0, w.jsx)(R.H, {
                        trackFunc: this.trackImpression,
                        children: (0, w.jsx)("div", {
                          children: (0, w.jsx)(xe.m, {
                            item: e,
                            children: (0, w.jsxs)("div", {
                              "data-purpose": "course-container",
                              className: vt()["course-container"],
                              children: [
                                (0, w.jsxs)("div", {
                                  className: vt()["main-content"],
                                  children: [
                                    (0, w.jsx)("a", {
                                      className: y()(
                                        "ud-heading-md",
                                        vt()["course-title"]
                                      ),
                                      href: e.url,
                                      onClick: this.trackClick,
                                      onContextMenu: this.trackClick,
                                      children: e.title,
                                    }),
                                    (0, w.jsxs)("div", {
                                      className: vt()["course-info"],
                                      children: [
                                        (0, w.jsxs)("div", {
                                          className: vt()["course-badges"],
                                          children: [
                                            e.is_in_premium &&
                                              !e.is_in_user_subscription &&
                                              (0, w.jsx)(je.F, {}),
                                            t && (0, w.jsx)(t, {}),
                                          ],
                                        }),
                                        (0, w.jsxs)("div", {
                                          className: y()(
                                            "ud-text-sm",
                                            vt()["meta-items"]
                                          ),
                                          children: [
                                            e.content_info &&
                                              (0, w.jsx)("span", {
                                                className: vt()["content-info"],
                                                children: e.content_info,
                                              }),
                                            e.last_update_date &&
                                              (0, w.jsx)(jt, {
                                                lastUpdatedDate:
                                                  e.last_update_date,
                                              }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, w.jsxs)("div", {
                                  className: vt()["comparison-content"],
                                  children: [
                                    (0, w.jsx)(Oe.Z, {
                                      showNumber: !0,
                                      rating: e.rating,
                                      numeric: !0,
                                    }),
                                    (0, w.jsx)(Pt, {
                                      numStudents: e.num_subscribers,
                                    }),
                                    (0, w.jsx)(ve.Z, {
                                      courses: [e],
                                      className: y()(
                                        vt()["price-text-container"],
                                        (0, i.Z)(
                                          {},
                                          vt()["hide-in-subscription"],
                                          e.is_in_user_subscription
                                        )
                                      ),
                                      listPriceClassName: y()(
                                        "ud-text-xs",
                                        vt()["list-price"]
                                      ),
                                      discountPriceClassName: y()(
                                        "ud-heading-sm",
                                        vt()["discount-price"]
                                      ),
                                      trackingEventContext: {
                                        buyableId: e.id,
                                        buyableType: "course",
                                        priceType: ge.Z.individual_buyable,
                                        buyableTrackingId:
                                          e.frontendTrackingId || e.tracking_id,
                                      },
                                    }),
                                  ],
                                }),
                                (0, w.jsx)("div", {
                                  className: vt()["image-wrapper"],
                                  children: (0, w.jsx)(xt, { course: e }),
                                }),
                                (0, w.jsx)("a", {
                                  href: e.url,
                                  "aria-hidden": "true",
                                  tabIndex: "-1",
                                  onClick: this.trackClick,
                                  onContextMenu: this.trackClick,
                                  className: vt()["whole-card-link"],
                                }),
                                (0, w.jsx)("div", {
                                  "data-purpose": "wishlist-container",
                                  className: y()(
                                    vt()["wishlist-content"],
                                    (0, i.Z)(
                                      {},
                                      vt()["hide-in-subscription"],
                                      e.is_in_user_subscription
                                    )
                                  ),
                                  children: (0, w.jsx)(ft, {
                                    wishlistStore: new Le(e, window),
                                    round: !0,
                                    uiRegion: Pe.n.COURSE_COMPARISON,
                                  }),
                                }),
                              ],
                            }),
                          }),
                        }),
                      });
                    },
                  },
                ]),
                r
              );
            })(b.Component))
          ) || lt,
        Rt =
          (0, m.Pi)(
            ((dt = (function (e) {
              (0, s.Z)(r, e);
              var t = _t(r);
              function r() {
                return (0, o.Z)(this, r), t.apply(this, arguments);
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "render",
                    value: function () {
                      var e = this.props.unit.items;
                      if (!e.length)
                        return (0, w.jsx)("div", {
                          className: "discovery-unit-empty-render",
                        });
                      var t = e.length - 6,
                        r = e.map(function (e, t) {
                          return (0,
                          w.jsx)(l.G, { trackingContext: { index: t }, children: (0, w.jsx)(Zt, { course: e }) }, e.id);
                        });
                      return (0, w.jsxs)(w.Fragment, {
                        children: [
                          this.props.showTitle &&
                            (0, w.jsx)("h2", {
                              className: "ud-heading-xl",
                              "data-purpose": "title",
                              children:
                                this.props.unit.title ||
                                gettext("Students also bought"),
                            }),
                          t > 0
                            ? (0, w.jsx)(_e.g, {
                                collapsedHeight: 610,
                                fullWidthButton: !0,
                                buttonComponent: kt,
                                hideIcons: !0,
                                className: vt()["show-more"],
                                "data-purpose": "show-more-container",
                                children: (0, w.jsx)("div", {
                                  "data-purpose": "show-more-content-container",
                                  className: vt()["content-container"],
                                  children: r,
                                }),
                              })
                            : (0, w.jsx)("div", {
                                "data-purpose": "short-list-content-container",
                                className: vt()["content-container"],
                                children: r,
                              }),
                        ],
                      });
                    },
                  },
                ]),
                r
              );
            })(b.Component)),
            (dt.defaultProps = { unit: {}, showTitle: !0 }),
            (pt = dt))
          ) || pt,
        Tt = r(61590),
        Et = r(89510),
        It = r(83988),
        Ct = r.n(It),
        St = r(13527),
        Dt = r(73804),
        At = r(19227),
        Lt = function (e) {
          var t = e.labId,
            r = e.courseId,
            n = e.uiRegion,
            i = e.trackingId,
            o = e.sourcePageId,
            a = e.sourcePageType;
          Z.j.publishEvent(
            new At.gH.DISCOVERY_CARD_CLICK({
              labId: t,
              courseId: r,
              uiRegion: n,
              trackingId: i,
              sourcePageId: o,
              sourcePageType: a,
            })
          );
        };
      function Nt(e, t) {
        var r, n;
        if (!e.isCompleted) return "";
        var i =
            null !== (r = null === t || void 0 === t ? void 0 : t.request) &&
            void 0 !== r
              ? r
              : (0, yt.s)(),
          o = i ? i.locale.replace("_", "-") : "en-US";
        return new Date(
          null === (n = e.enrollment) || void 0 === n
            ? void 0
            : n.lastAttemptedTime
        ).toLocaleDateString(o, {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
      var Ut = r(83434),
        Mt = r(26424),
        Bt = r.n(Mt),
        Ft = function () {
          var e = (0, p.QT)().gettext;
          return (0, w.jsx)(A.C, {
            className: Bt()["beta-badge"],
            children: e("Beta"),
          });
        },
        zt = r(66148),
        Vt = r.n(zt),
        Ht = function (e) {
          var t = e.hasRunningInstance,
            r = e.size,
            n = e.labId,
            o = e.isMobile,
            a = (0, p.QT)().gettext,
            s = a(t ? "Continue practicing" : "Start practicing"),
            c = a("View details"),
            u = o ? c : s;
          return (0, w.jsx)(P.zx, {
            size: "small" === r ? "xsmall" : "small",
            className: y()(
              Vt().button,
              (0, i.Z)({}, Vt()["small-btn"], "small" === r)
            ),
            udStyle: "link-underline",
            id: "lab-cta-".concat(n),
            "aria-labelledby": "lab-cta-".concat(n, " lab-heading-").concat(n),
            children: u,
          });
        },
        Wt = r(44394),
        Gt = r.n(Wt),
        Kt = r(17070),
        qt = r.n(Kt),
        Yt = function (e) {
          var t = e.isCompleted,
            r = void 0 !== t && t;
          return (0, w.jsx)(Gt(), {
            label: !1,
            className: y()(qt()["lab-icon"], (0, i.Z)({}, qt().completed, r)),
          });
        },
        Qt = r(50029),
        Jt = r(74450),
        Xt = r(87794),
        $t = r.n(Xt),
        er = r(28538),
        tr = r(45153);
      function rr(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var nr,
        ir,
        or,
        ar = (function (e) {
          (0, s.Z)(r, e);
          var t = rr(r);
          function r() {
            return (0, o.Z)(this, r), t.apply(this, arguments);
          }
          return (
            (0, a.Z)(r, [
              {
                key: "apiDataMap",
                get: function () {
                  return { id: "id", title: "title", url: "url" };
                },
              },
            ]),
            r
          );
        })(tr.h),
        sr = r(65982),
        cr = r(23791),
        ur = "/labs/",
        lr = function (e) {
          return "".concat(ur).concat(e, "/");
        },
        pr = function (e) {
          return "".concat(lr(e), "submit-for-review/");
        },
        dr = function (e) {
          return "".concat(lr(e), "tasks/");
        },
        fr = function (e) {
          return "".concat(lr(e), "validate-lab-data/");
        };
      "".concat(ur, "time-until-run-limit-reset/"),
        "".concat(ur, "retrieve-active-lab/"),
        [
          "id",
          "title",
          "vertical",
          "provider",
          "lab_type",
          "my_latest_instance",
          "setup_start_lecture_id",
          "post_setup_lecture_id",
          "is_launch_disabled",
        ].join(","),
        [
          "id",
          "uuid",
          "status",
          "start_time",
          "session_start_time",
          "uuid",
          "total_spend",
          "allowed_spend",
          "aws_access_key_id",
          "aws_secret_access_key",
          "aws_session_token",
          "workspace_sso_url",
          "workspace_login_url",
          "workspace_username",
          "workspace_password",
          "workspace_resource",
          "lab",
          "expiration_time",
        ].join(","),
        [
          "id",
          "title",
          "vertical",
          "provider",
          "status",
          "lab_type",
          "my_latest_instance",
          "course",
          "template",
          "spec_name",
          "has_sso",
          "instructor_has_lab",
        ].join(","),
        [
          "id",
          "vertical",
          "provider",
          "title",
          "description",
          "template",
          "course",
          "initial_source_code",
          "lab_type",
        ].join(",");
      function hr(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var yr,
        mr,
        br,
        vr,
        gr,
        _r,
        Or,
        wr =
          ((nr = (function (e) {
            (0, s.Z)(r, e);
            var t = hr(r);
            function r() {
              var e;
              (0, o.Z)(this, r);
              for (
                var n = arguments.length, i = new Array(n), a = 0;
                a < n;
                a++
              )
                i[a] = arguments[a];
              return (
                (e = t.call.apply(t, [this].concat(i))),
                (0, Ze.Z)(e, "id", ir, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "title", or, (0, Ne.Z)(e)),
                e
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    return { id: "id", title: "title" };
                  },
                },
              ]),
              r
            );
          })(tr.h)),
          (ir = (0, Re.Z)(nr.prototype, "id", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (or = (0, Re.Z)(nr.prototype, "title", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          nr);
      function kr(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var xr,
        Pr,
        jr,
        Zr,
        Rr =
          ((yr = Te.LO.ref),
          (mr = (function (e) {
            (0, s.Z)(r, e);
            var t = kr(r);
            function r(e, n) {
              var i;
              return (
                (0, o.Z)(this, r),
                (i = t.call(this, e)),
                (0, Ze.Z)(i, "lab", br, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "courseHasLabId", vr, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "curriculumItemId", gr, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "curriculumItemType", _r, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "linkType", Or, (0, Ne.Z)(i)),
                (i.lab = n),
                i
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    return {
                      id: "id",
                      courseHasLabId: "course_has_lab_id",
                      curriculumItemId: "curriculum_item_id",
                      curriculumItemType: "curriculum_item_type",
                      linkType: "link_type",
                    };
                  },
                },
              ]),
              r
            );
          })(tr.h)),
          (br = (0, Re.Z)(mr.prototype, "lab", [yr], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (vr = (0, Re.Z)(mr.prototype, "courseHasLabId", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (gr = (0, Re.Z)(mr.prototype, "curriculumItemId", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (_r = (0, Re.Z)(mr.prototype, "curriculumItemType", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Or = (0, Re.Z)(mr.prototype, "linkType", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          mr),
        Tr = r(17674),
        Er = r(9669),
        Ir = r.n(Er);
      function Cr(e, t) {
        var r =
          ("undefined" !== typeof Symbol && e[Symbol.iterator]) ||
          e["@@iterator"];
        if (!r) {
          if (
            Array.isArray(e) ||
            (r = (function (e, t) {
              if (!e) return;
              if ("string" === typeof e) return Sr(e, t);
              var r = Object.prototype.toString.call(e).slice(8, -1);
              "Object" === r && e.constructor && (r = e.constructor.name);
              if ("Map" === r || "Set" === r) return Array.from(e);
              if (
                "Arguments" === r ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
              )
                return Sr(e, t);
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
          a = !0,
          s = !1;
        return {
          s: function () {
            r = r.call(e);
          },
          n: function () {
            var e = r.next();
            return (a = e.done), e;
          },
          e: function (e) {
            (s = !0), (o = e);
          },
          f: function () {
            try {
              a || null == r.return || r.return();
            } finally {
              if (s) throw o;
            }
          },
        };
      }
      function Sr(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n;
      }
      function Dr(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Ar,
        Lr,
        Nr =
          ((xr = (function (e) {
            (0, s.Z)(r, e);
            var t = Dr(r);
            function r(e) {
              var n;
              return (
                (0, o.Z)(this, r),
                (n = t.call(this, e)),
                (0, Ze.Z)(n, "isSaving", Pr, (0, Ne.Z)(n)),
                (0, Ze.Z)(n, "formData", jr, (0, Ne.Z)(n)),
                (0, Ze.Z)(n, "apiError", Zr, (0, Ne.Z)(n)),
                (n.debouncedAutoSave = null),
                (n._autoSave = function () {
                  Object.keys(n.changedData).length > 0 &&
                    (n._setSaving(!0),
                    n.debouncedAutoSave && n.debouncedAutoSave.cancel(),
                    (n.debouncedAutoSave = (0, sr.D)(
                      n._partialUpdate,
                      n.autoSaveInterval
                    )),
                    n.debouncedAutoSave());
                }),
                (0, Te.U5)(function () {
                  return n.changedData;
                }, n._autoSave),
                n
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "editableFieldsMap",
                  get: function () {
                    throw new Error("Undefined editable fields map");
                  },
                },
                {
                  key: "resourceUrl",
                  get: function () {
                    throw new Error("Undefined url to save");
                  },
                },
                {
                  key: "autoSaveInterval",
                  get: function () {
                    return 1e3;
                  },
                },
                {
                  key: "changedData",
                  get: function () {
                    var e,
                      t = {},
                      r = Cr(this.editableFieldsMap);
                    try {
                      for (r.s(); !(e = r.n()).done; ) {
                        var n = (0, Tr.Z)(e.value, 2),
                          i = n[0],
                          o = n[1];
                        this[i] !== this.formData[i] &&
                          (t[o] = this.formData[i]);
                      }
                    } catch (a) {
                      r.e(a);
                    } finally {
                      r.f();
                    }
                    return t;
                  },
                },
                {
                  key: "setDataFromAPI",
                  value: function (e) {
                    (0, Jt.Z)(
                      (0, u.Z)(r.prototype),
                      "setDataFromAPI",
                      this
                    ).call(this, e);
                    var t,
                      n = {},
                      i = Cr(this.editableFieldsMap.keys());
                    try {
                      for (i.s(); !(t = i.n()).done; ) {
                        var o = t.value;
                        n[o] = this[o];
                      }
                    } catch (a) {
                      i.e(a);
                    } finally {
                      i.f();
                    }
                    this.formData = n;
                  },
                },
                {
                  key: "_partialUpdate",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e() {
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    this._cancelTokenSource &&
                                      this._cancelTokenSource.cancel(),
                                    (this._cancelTokenSource =
                                      Er.CancelToken.source()),
                                    this._setSaving(!0),
                                    (e.prev = 3),
                                    (e.next = 6),
                                    this._executeUpdate()
                                  );
                                case 6:
                                  this._setAPIError(!1),
                                    this._finishSaving(),
                                    (e.next = 17);
                                  break;
                                case 10:
                                  if (
                                    ((e.prev = 10),
                                    (e.t0 = e.catch(3)),
                                    !(0, Er.isCancel)(e.t0))
                                  ) {
                                    e.next = 14;
                                    break;
                                  }
                                  return e.abrupt("return");
                                case 14:
                                  e.t0.response && this._setAPIError(e.t0),
                                    _.c.captureException(e.t0),
                                    this._finishSaving();
                                case 17:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[3, 10]]
                        );
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "_executeUpdate",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e() {
                        var t;
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (e.next = 2),
                                    cr.ZP.patch(
                                      this.resourceUrl,
                                      this.changedData
                                    )
                                  );
                                case 2:
                                  (t = e.sent), this.setDataFromAPI(t.data);
                                case 4:
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
                  key: "delete",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e() {
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (e.prev = 0),
                                    this._setSaving(!0),
                                    (e.next = 4),
                                    cr.ZP.delete(this.resourceUrl)
                                  );
                                case 4:
                                  e.next = 9;
                                  break;
                                case 6:
                                  throw (
                                    ((e.prev = 6), (e.t0 = e.catch(0)), e.t0)
                                  );
                                case 9:
                                  return (
                                    (e.prev = 9),
                                    this._setSaving(!1),
                                    e.finish(9)
                                  );
                                case 12:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[0, 6, 9, 12]]
                        );
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "_changeEditableField",
                  value: function (e, t) {
                    this.editableFieldsMap.has(e) && (this.formData[e] = t);
                  },
                },
                {
                  key: "_setSaving",
                  value: function (e) {
                    this.isSaving = e;
                  },
                },
                {
                  key: "_setAPIError",
                  value: function (e) {
                    this.apiError = e;
                  },
                },
                {
                  key: "_finishSaving",
                  value: function () {
                    (this._cancelTokenSource = null), this._setSaving(!1);
                  },
                },
              ]),
              r
            );
          })(tr.h)),
          (Pr = (0, Re.Z)(xr.prototype, "isSaving", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (jr = (0, Re.Z)(xr.prototype, "formData", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return {};
            },
          })),
          (Zr = (0, Re.Z)(xr.prototype, "apiError", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (0, Re.Z)(
            xr.prototype,
            "changedData",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(xr.prototype, "changedData"),
            xr.prototype
          ),
          (0, Re.Z)(
            xr.prototype,
            "setDataFromAPI",
            [Te.aD],
            Object.getOwnPropertyDescriptor(xr.prototype, "setDataFromAPI"),
            xr.prototype
          ),
          (0, Re.Z)(
            xr.prototype,
            "_changeEditableField",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              xr.prototype,
              "_changeEditableField"
            ),
            xr.prototype
          ),
          (0, Re.Z)(
            xr.prototype,
            "_setSaving",
            [Te.aD],
            Object.getOwnPropertyDescriptor(xr.prototype, "_setSaving"),
            xr.prototype
          ),
          (0, Re.Z)(
            xr.prototype,
            "_setAPIError",
            [Te.aD],
            Object.getOwnPropertyDescriptor(xr.prototype, "_setAPIError"),
            xr.prototype
          ),
          xr);
      function Ur(e, t) {
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
      function Mr(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Br,
        Fr,
        zr,
        Vr,
        Hr,
        Wr,
        Gr,
        Kr =
          ((Ar = (function (e) {
            (0, s.Z)(r, e);
            var t = Mr(r);
            function r() {
              var e;
              (0, o.Z)(this, r);
              for (
                var n = arguments.length, i = new Array(n), a = 0;
                a < n;
                a++
              )
                i[a] = arguments[a];
              return (
                (e = t.call.apply(t, [this].concat(i))),
                (0, Ze.Z)(e, "validationErrors", Lr, (0, Ne.Z)(e)),
                (e.setFormField = function (t, r) {
                  return (
                    e._resetValidationState(t), e._changeEditableField(t, r)
                  );
                }),
                (e.forceSave = (0, Qt.Z)(
                  $t().mark(function t() {
                    return $t().wrap(function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            if (!e.hasUnsavedChanges) {
                              t.next = 3;
                              break;
                            }
                            return (t.next = 3), e._partialUpdate();
                          case 3:
                          case "end":
                            return t.stop();
                        }
                    }, t);
                  })
                )),
                e
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "autoSaveInterval",
                  get: function () {
                    return Ut.bp;
                  },
                },
                {
                  key: "hasUnsavedChanges",
                  get: function () {
                    return Object.keys(this.changedData).length > 0;
                  },
                },
                {
                  key: "_setAPIError",
                  value: function (e) {
                    var t, n;
                    (0, Jt.Z)((0, u.Z)(r.prototype), "_setAPIError", this).call(
                      this,
                      e
                    ),
                      (this.validationErrors = (
                        null === (t = this.apiError) ||
                        void 0 === t ||
                        null === (n = t.response) ||
                        void 0 === n
                          ? void 0
                          : n.data
                      )
                        ? (function (e) {
                            for (var t = 1; t < arguments.length; t++) {
                              var r = null != arguments[t] ? arguments[t] : {};
                              t % 2
                                ? Ur(Object(r), !0).forEach(function (t) {
                                    (0, i.Z)(e, t, r[t]);
                                  })
                                : Object.getOwnPropertyDescriptors
                                ? Object.defineProperties(
                                    e,
                                    Object.getOwnPropertyDescriptors(r)
                                  )
                                : Ur(Object(r)).forEach(function (t) {
                                    Object.defineProperty(
                                      e,
                                      t,
                                      Object.getOwnPropertyDescriptor(r, t)
                                    );
                                  });
                            }
                            return e;
                          })({}, this.apiError.response.data)
                        : {});
                  },
                },
                {
                  key: "_resetValidationState",
                  value: function (e) {
                    var t = this.editableFieldsMap.get(e);
                    t &&
                      this.validationErrors[t] &&
                      delete this.validationErrors[t];
                  },
                },
              ]),
              r
            );
          })(Nr)),
          (Lr = (0, Re.Z)(Ar.prototype, "validationErrors", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return {};
            },
          })),
          (0, Re.Z)(
            Ar.prototype,
            "hasUnsavedChanges",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Ar.prototype, "hasUnsavedChanges"),
            Ar.prototype
          ),
          (0, Re.Z)(
            Ar.prototype,
            "_setAPIError",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Ar.prototype, "_setAPIError"),
            Ar.prototype
          ),
          (0, Re.Z)(
            Ar.prototype,
            "_resetValidationState",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              Ar.prototype,
              "_resetValidationState"
            ),
            Ar.prototype
          ),
          Ar),
        qr = {
          EDIT_DRAFT: "labs:edit",
          EDIT_PUBLISHED: "labs:edit_published",
          EDIT_VERTICAL_TEMPLATE: "labs:edit_vertical_template",
          MANAGE_INSTRUCTORS: "labs:manage_instructors",
          REVENUE_REPORT: "labs:view_lab_revenue_report",
          REPORTED_ISSUES: "labs:view_reported_issues",
        };
      function Yr(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Qr,
        Jr,
        Xr,
        $r,
        en,
        tn,
        rn,
        nn =
          ((Br = (function (e) {
            (0, s.Z)(r, e);
            var t = Yr(r);
            function r() {
              var e;
              (0, o.Z)(this, r);
              for (
                var n = arguments.length, i = new Array(n), a = 0;
                a < n;
                a++
              )
                i[a] = arguments[a];
              return (
                (e = t.call.apply(t, [this].concat(i))),
                (0, Ze.Z)(e, "id", Fr, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "isOwner", zr, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "isVisible", Vr, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "permissions", Hr, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "revenueSharePercentage", Wr, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "instructor", Gr, (0, Ne.Z)(e)),
                e
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    return {
                      id: "id",
                      isOwner: "is_owner",
                      isVisible: "is_visible",
                      permissions: {
                        source: "permissions",
                        map: function (e) {
                          return e.map(function (e) {
                            return e.permission;
                          });
                        },
                        defaultValue: [],
                      },
                      revenueSharePercentage: "revenue_share_percentage",
                      instructor: "instructor",
                    };
                  },
                },
                {
                  key: "hasPermission",
                  value: function (e) {
                    var t;
                    return null === (t = this.permissions) || void 0 === t
                      ? void 0
                      : t.includes(e);
                  },
                },
                {
                  key: "addPermission",
                  value: function (e) {
                    return this.permissions.push(e);
                  },
                },
                {
                  key: "removePermission",
                  value: function (e) {
                    this.permissions = this.permissions.filter(function (t) {
                      return t !== e;
                    });
                  },
                },
                {
                  key: "setRevenuePercentage",
                  value: function (e) {
                    this.revenueSharePercentage = e;
                  },
                },
                {
                  key: "setVisible",
                  value: function (e) {
                    this.isVisible = e;
                  },
                },
                {
                  key: "permissionsToSave",
                  get: function () {
                    var e = this;
                    return Object.values(qr).map(function (t) {
                      return {
                        permission_code: t,
                        enabled: e.hasPermission(t),
                      };
                    });
                  },
                },
              ]),
              r
            );
          })(tr.h)),
          (Fr = (0, Re.Z)(Br.prototype, "id", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (zr = (0, Re.Z)(Br.prototype, "isOwner", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Vr = (0, Re.Z)(Br.prototype, "isVisible", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Hr = (0, Re.Z)(Br.prototype, "permissions", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Wr = (0, Re.Z)(Br.prototype, "revenueSharePercentage", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Gr = (0, Re.Z)(Br.prototype, "instructor", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (0, Re.Z)(
            Br.prototype,
            "addPermission",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Br.prototype, "addPermission"),
            Br.prototype
          ),
          (0, Re.Z)(
            Br.prototype,
            "removePermission",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Br.prototype, "removePermission"),
            Br.prototype
          ),
          (0, Re.Z)(
            Br.prototype,
            "setRevenuePercentage",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              Br.prototype,
              "setRevenuePercentage"
            ),
            Br.prototype
          ),
          (0, Re.Z)(
            Br.prototype,
            "setVisible",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Br.prototype, "setVisible"),
            Br.prototype
          ),
          (0, Re.Z)(
            Br.prototype,
            "permissionsToSave",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Br.prototype, "permissionsToSave"),
            Br.prototype
          ),
          Br),
        on = r(42551),
        an = Object.freeze({
          success: "success",
          warning: "warning",
          error: "error",
        });
      function sn(e) {
        var t = e.text,
          r = /(ude\.my|udemy\.(com|cn))/,
          n = t.match(/([\w-]{1,63}\.[a-zA-Z-]{2,63})/g);
        return null === n ||
          n.every(function (e) {
            return null !== e.match(r);
          })
          ? an.success
          : an.error;
      }
      var cn,
        un,
        ln,
        pn,
        dn,
        fn,
        hn,
        yn,
        mn,
        bn,
        vn,
        gn,
        _n,
        On =
          ((Qr = (function () {
            function e() {
              (0, o.Z)(this, e),
                (0, Ze.Z)(this, "answerList", Jr, this),
                (0, Ze.Z)(this, "maxCharCount", Xr, this),
                (0, Ze.Z)(this, "pushEmptyAnswer", $r, this),
                (0, Ze.Z)(this, "ensureMinAnswerCount", en, this),
                (0, Ze.Z)(this, "setMaxCharCount", tn, this),
                (0, Ze.Z)(this, "getNextAnswerOrCreate", rn, this);
            }
            return (
              (0, a.Z)(e, [
                {
                  key: "deleteAnswer",
                  value: function (e) {
                    this.answerList = this.answerList.filter(function (t) {
                      return t.key !== e;
                    });
                  },
                },
                {
                  key: "updateAnswer",
                  value: function (e, t) {
                    var r = this.answerList.find(function (t) {
                      return t.key === e;
                    });
                    (r.value = t), this.validateAnswer(r);
                  },
                },
                {
                  key: "validateAnswer",
                  value: function (e) {
                    var t,
                      r = { text: e.value },
                      n =
                        ((t = r),
                        [sn].every(function (e) {
                          return e(t) === an.success;
                        })
                          ? an.success
                          : an.error);
                    "error" === n
                      ? ((e.validationState = n),
                        (e.validationError = gettext(
                          "External links are not allowed here."
                        )))
                      : this.maxCharCount > 0 &&
                        e.value.length > this.maxCharCount
                      ? ((e.validationState = "error"),
                        (e.validationError = interpolate(
                          gettext(
                            "Learning objectives can't be longer than %s characters"
                          ),
                          [this.maxCharCount]
                        )))
                      : ((e.validationState = null),
                        (e.validationError = null));
                  },
                },
                {
                  key: "initializeAllAnswers",
                  value: function (e) {
                    var t = this,
                      r = [];
                    e.forEach(function (e) {
                      var n = {
                        key: (0, on.Ki)("answer-list"),
                        value: e,
                        validationState: null,
                      };
                      t.validateAnswer(n), r.push(n);
                    }),
                      (this.answerList = r);
                  },
                },
                {
                  key: "updateAllAnswers",
                  value: function (e) {
                    var t = this;
                    e.forEach(function (e) {
                      t.validateAnswer(e);
                    }),
                      (this.answerList = e);
                  },
                },
                {
                  key: "hasValidationErrors",
                  get: function () {
                    return (
                      !!this.answerList &&
                      this.answerList.filter(function (e) {
                        return "error" === e.validationState;
                      }).length > 0
                    );
                  },
                },
                {
                  key: "nonEmptyAnswerCount",
                  get: function () {
                    return this.answerList.filter(function (e) {
                      return "error" !== e.validationState && "" !== e.value;
                    }).length;
                  },
                },
                {
                  key: "answerCount",
                  get: function () {
                    return this.answerList.filter(function (e) {
                      return "error" !== e.validationState;
                    }).length;
                  },
                },
              ]),
              e
            );
          })()),
          (Jr = (0, Re.Z)(Qr.prototype, "answerList", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (Xr = (0, Re.Z)(Qr.prototype, "maxCharCount", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return 0;
            },
          })),
          ($r = (0, Re.Z)(Qr.prototype, "pushEmptyAnswer", [Te.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                var t = e.answerList[e.answerList.length - 1];
                if (t && "" === t.value.trim()) return !1;
                var r = (0, on.Ki)("answer-list");
                return (
                  e.answerList.push({
                    key: r,
                    value: "",
                    validationState: null,
                    validationError: null,
                  }),
                  r
                );
              };
            },
          })),
          (en = (0, Re.Z)(Qr.prototype, "ensureMinAnswerCount", [Te.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                for (; e.answerList.length < t; ) {
                  var r = (0, on.Ki)("answer-list");
                  e.answerList.push({
                    key: r,
                    value: "",
                    validationState: null,
                    validationError: null,
                  });
                }
              };
            },
          })),
          (tn = (0, Re.Z)(Qr.prototype, "setMaxCharCount", [Te.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                e.maxCharCount = t;
              };
            },
          })),
          (rn = (0, Re.Z)(Qr.prototype, "getNextAnswerOrCreate", [Te.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                var r = e.answerList.findIndex(function (e) {
                  return e.key === t;
                });
                return r < e.answerList.length - 1
                  ? e.answerList[r + 1].key
                  : e.pushEmptyAnswer();
              };
            },
          })),
          (0, Re.Z)(
            Qr.prototype,
            "deleteAnswer",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Qr.prototype, "deleteAnswer"),
            Qr.prototype
          ),
          (0, Re.Z)(
            Qr.prototype,
            "updateAnswer",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Qr.prototype, "updateAnswer"),
            Qr.prototype
          ),
          (0, Re.Z)(
            Qr.prototype,
            "initializeAllAnswers",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              Qr.prototype,
              "initializeAllAnswers"
            ),
            Qr.prototype
          ),
          (0, Re.Z)(
            Qr.prototype,
            "updateAllAnswers",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Qr.prototype, "updateAllAnswers"),
            Qr.prototype
          ),
          (0, Re.Z)(
            Qr.prototype,
            "hasValidationErrors",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(
              Qr.prototype,
              "hasValidationErrors"
            ),
            Qr.prototype
          ),
          (0, Re.Z)(
            Qr.prototype,
            "nonEmptyAnswerCount",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(
              Qr.prototype,
              "nonEmptyAnswerCount"
            ),
            Qr.prototype
          ),
          (0, Re.Z)(
            Qr.prototype,
            "answerCount",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Qr.prototype, "answerCount"),
            Qr.prototype
          ),
          Qr),
        wn =
          ((cn = Te.LO.ref),
          (un = (function () {
            function e(t) {
              for (var r in ((0, o.Z)(this, e),
              (0, Ze.Z)(this, "lab", ln, this),
              (0, Ze.Z)(this, "whatYouWillDo", pn, this),
              (0, Ze.Z)(this, "whatYouWillLearn", dn, this),
              (0, Ze.Z)(this, "requirements", fn, this),
              (0, Ze.Z)(this, "isDirty", hn, this),
              (0, Ze.Z)(this, "errors", yn, this),
              t))
                this._setGoals(r, t[r]);
            }
            return (
              (0, a.Z)(e, [
                {
                  key: "isValid",
                  get: function () {
                    return (
                      !this.requirements.hasValidationErrors &&
                      !this.whatYouWillDo.hasValidationErrors &&
                      !this.whatYouWillLearn.hasValidationErrors
                    );
                  },
                },
                {
                  key: "_setGoals",
                  value: function (e, t) {
                    var r =
                      (null === t || void 0 === t ? void 0 : t.items) || [];
                    this[e].initializeAllAnswers(r),
                      this._initializeEmptyAnswers(e, r);
                  },
                },
                {
                  key: "setDirty",
                  value: function () {
                    var e =
                      !(arguments.length > 0 && void 0 !== arguments[0]) ||
                      arguments[0];
                    this.isDirty = e;
                  },
                },
                {
                  key: "prepareFormData",
                  value: function () {
                    return {
                      requirements: this._generateGoalJson(this.requirements),
                      what_you_will_learn: this._generateGoalJson(
                        this.whatYouWillLearn
                      ),
                      what_you_will_do: this._generateGoalJson(
                        this.whatYouWillDo
                      ),
                    };
                  },
                },
                {
                  key: "_generateGoalJson",
                  value: function (e) {
                    var t = [];
                    return (
                      e.answerList.forEach(function (e) {
                        return String(e.value).trim()
                          ? t.push(String(e.value).trim())
                          : null;
                      }),
                      { items: t }
                    );
                  },
                },
                {
                  key: "_initializeEmptyAnswers",
                  value: function (e, t) {
                    t.length < 2 && this[e].pushEmptyAnswer();
                  },
                },
              ]),
              e
            );
          })()),
          (ln = (0, Re.Z)(un.prototype, "lab", [cn], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (pn = (0, Re.Z)(un.prototype, "whatYouWillDo", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return new On();
            },
          })),
          (dn = (0, Re.Z)(un.prototype, "whatYouWillLearn", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return new On();
            },
          })),
          (fn = (0, Re.Z)(un.prototype, "requirements", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return new On();
            },
          })),
          (hn = (0, Re.Z)(un.prototype, "isDirty", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (yn = (0, Re.Z)(un.prototype, "errors", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return {};
            },
          })),
          (0, Re.Z)(
            un.prototype,
            "isValid",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(un.prototype, "isValid"),
            un.prototype
          ),
          (0, Re.Z)(
            un.prototype,
            "setDirty",
            [Te.aD],
            Object.getOwnPropertyDescriptor(un.prototype, "setDirty"),
            un.prototype
          ),
          un);
      function kn(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var xn,
        Pn,
        jn,
        Zn,
        Rn,
        Tn =
          ((mn = Te.LO.ref),
          (bn = (function (e) {
            (0, s.Z)(r, e);
            var t = kn(r);
            function r(e, n) {
              var i;
              return (
                (0, o.Z)(this, r),
                (i = t.call(this, e)),
                (0, Ze.Z)(i, "lab", vn, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "lastAttemptedMode", gn, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "isCompleted", _n, (0, Ne.Z)(i)),
                (i.lab = n),
                i
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    return {
                      id: "id",
                      isCompleted: "is_completed",
                      firstCompletedTime: "first_completed_time",
                      firstCompletedMode: "first_completed_mode",
                      lastAttemptedMode: "last_attempted_mode",
                      lastAttemptedTime: "last_attempted_time",
                      created: "created",
                      modified: "modified",
                    };
                  },
                },
                {
                  key: "setIsCompleted",
                  value: function (e) {
                    this.isCompleted = e;
                  },
                },
              ]),
              r
            );
          })(tr.h)),
          (vn = (0, Re.Z)(bn.prototype, "lab", [mn], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (gn = (0, Re.Z)(bn.prototype, "lastAttemptedMode", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (_n = (0, Re.Z)(bn.prototype, "isCompleted", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (0, Re.Z)(
            bn.prototype,
            "setIsCompleted",
            [Te.aD],
            Object.getOwnPropertyDescriptor(bn.prototype, "setIsCompleted"),
            bn.prototype
          ),
          bn);
      function En(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var In,
        Cn,
        Sn,
        Dn,
        An,
        Ln,
        Nn,
        Un,
        Mn =
          ((xn = Te.LO.ref),
          (Pn = (function (e) {
            (0, s.Z)(r, e);
            var t = En(r);
            function r(e, n) {
              var i;
              return (
                (0, o.Z)(this, r),
                (i = t.call(this, e)),
                (0, Ze.Z)(i, "lab", jn, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "status", Zn, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "startTime", Rn, (0, Ne.Z)(i)),
                (i.lab = n),
                i
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    return {
                      id: "id",
                      uuid: "uuid",
                      awsAccessKeyId: "aws_access_key_id",
                      awsSecretAccessKey: "aws_secret_access_key",
                      awsSessionToken: "aws_session_token",
                      startTime: "start_time",
                      totalSpend: "total_spend",
                      allowedSpend: "allowed_spend",
                      sessionStartTime: "session_start_time",
                      workspaceSsoUrl: "workspace_sso_url",
                      workspaceLoginUrl: "workspace_login_url",
                      workspaceUsername: "workspace_username",
                      workspacePassword: "workspace_password",
                      workspaceResource: "workspace_resource",
                      status: "status",
                      expirationTime: "expiration_time",
                    };
                  },
                },
                {
                  key: "expiryTime",
                  get: function () {
                    if (!this.startTime) return null;
                    var e = new Date(this.startTime);
                    return (
                      e.setMinutes(e.getMinutes() + Ut.jV[this.lab.labType]), e
                    );
                  },
                },
                {
                  key: "timeLeftInSeconds",
                  get: function () {
                    if (this.expiryTime) {
                      var e = new Date(),
                        t = (this.expiryTime.getTime() - e.getTime()) / 1e3;
                      return t > 0 ? t : 0;
                    }
                    return 0;
                  },
                },
                {
                  key: "maskAsTerminating",
                  value: function () {
                    this.status = Ut.cA.killing;
                  },
                },
              ]),
              r
            );
          })(tr.h)),
          (jn = (0, Re.Z)(Pn.prototype, "lab", [xn], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Zn = (0, Re.Z)(Pn.prototype, "status", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Rn = (0, Re.Z)(Pn.prototype, "startTime", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (0, Re.Z)(
            Pn.prototype,
            "expiryTime",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Pn.prototype, "expiryTime"),
            Pn.prototype
          ),
          (0, Re.Z)(
            Pn.prototype,
            "timeLeftInSeconds",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Pn.prototype, "timeLeftInSeconds"),
            Pn.prototype
          ),
          (0, Re.Z)(
            Pn.prototype,
            "maskAsTerminating",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Pn.prototype, "maskAsTerminating"),
            Pn.prototype
          ),
          Pn);
      function Bn(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Fn,
        zn,
        Vn,
        Hn =
          ((Un = (function (e) {
            (0, s.Z)(r, e);
            var t = Bn(r);
            function r() {
              var e;
              (0, o.Z)(this, r);
              for (
                var n = arguments.length, i = new Array(n), a = 0;
                a < n;
                a++
              )
                i[a] = arguments[a];
              return (
                (e = t.call.apply(t, [this].concat(i))),
                (0, Ze.Z)(e, "id", Cn, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "title", Sn, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "status", Dn, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "delayedAssetMessage", An, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "processingErrors", Ln, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "fileName", Nn, (0, Ne.Z)(e)),
                e
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    return {
                      id: "id",
                      type: "asset_type",
                      fileName: "filename",
                      externalUrl: "external_url",
                      timeEstimation: "time_estimation",
                      mediaLicenseToken: "media_license_token",
                      courseIsDrmed: "course_is_drmed",
                      downloadUrls: "download_urls",
                      title: "title",
                      status: "status",
                      delayedAssetMessage: "delayed_asset_message",
                      processingErrors: "processing_errors",
                      isExternal: "is_external",
                    };
                  },
                },
                {
                  key: "isCourseDrmed",
                  get: function () {
                    return !!this.courseIsDrmed;
                  },
                },
                {
                  key: "isEncrypted",
                  get: function () {
                    return !!this.mediaLicenseToken;
                  },
                },
                {
                  key: "downloadUrl",
                  get: function () {
                    var e = this.downloadUrls && this.downloadUrls[this.type];
                    if (e && e.length > 0) return e[0].file;
                  },
                },
              ]),
              r
            );
          })(tr.h)),
          (Un.requestFields = [
            "status",
            "delayed_asset_message",
            "processing_errors",
          ]),
          (Un.extraParams = {}),
          (In = Un),
          (Cn = (0, Re.Z)(In.prototype, "id", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Sn = (0, Re.Z)(In.prototype, "title", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "";
            },
          })),
          (Dn = (0, Re.Z)(In.prototype, "status", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (An = (0, Re.Z)(In.prototype, "delayedAssetMessage", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "";
            },
          })),
          (Ln = (0, Re.Z)(In.prototype, "processingErrors", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (Nn = (0, Re.Z)(In.prototype, "fileName", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "";
            },
          })),
          In);
      function Wn(e, t) {
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
      function Gn(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Wn(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Wn(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function Kn(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var qn,
        Yn,
        Qn,
        Jn =
          ((Vn = (function (e) {
            (0, s.Z)(r, e);
            var t = Kn(r);
            function r() {
              var e;
              (0, o.Z)(this, r);
              for (
                var n = arguments.length, i = new Array(n), a = 0;
                a < n;
                a++
              )
                i[a] = arguments[a];
              return (
                (e = t.call.apply(t, [this].concat(i))),
                (0, Ze.Z)(e, "body", zn, (0, Ne.Z)(e)),
                e
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    return Gn(
                      Gn(
                        {},
                        (0, Jt.Z)((0, u.Z)(r.prototype), "apiDataMap", this)
                      ),
                      {},
                      {
                        body: {
                          source: "body",
                          map: function (e) {
                            var t = document.createElement("div");
                            return (
                              (t.innerHTML = e),
                              Array.from(t.querySelectorAll("a")).forEach(
                                function (e) {
                                  e.setAttribute("target", "_blank");
                                }
                              ),
                              Array.from(t.querySelectorAll("img")).forEach(
                                function (e) {
                                  e.setAttribute("align", "middle");
                                }
                              ),
                              t.innerHTML
                            );
                          },
                        },
                      }
                    );
                  },
                },
              ]),
              r
            );
          })(Hn)),
          (Vn.requestFields = Hn.requestFields.concat(["body"])),
          (Fn = Vn),
          (zn = (0, Re.Z)(Fn.prototype, "body", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          Fn),
        Xn = Object.freeze({
          ARTICLE: "Article",
          AUDIO: "Audio",
          EBOOK: "E-Book",
          EXTERNAL_LINK: "ExternalLink",
          FILE: "File",
          IFRAME: "IFrame",
          IMPORT_CONTENT: "ImportContent",
          PRESENTATION: "Presentation",
          SOURCE_CODE: "SourceCode",
          UPCOMING: "Upcoming",
          VIDEO: "Video",
          VIDEO_MASHUP: "VideoMashup",
        });
      Object.freeze({ SUCCESS: 1, UNPROCESSED: 0, FAILED: -1, DELAYED: -2 });
      function $n(e, t) {
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
      function ei(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? $n(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : $n(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function ti(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var ri,
        ni,
        ii,
        oi =
          ((Qn = (function (e) {
            (0, s.Z)(r, e);
            var t = ti(r);
            function r() {
              var e;
              (0, o.Z)(this, r);
              for (
                var n = arguments.length, i = new Array(n), a = 0;
                a < n;
                a++
              )
                i[a] = arguments[a];
              return (
                (e = t.call.apply(t, [this].concat(i))),
                (0, Ze.Z)(e, "description", Yn, (0, Ne.Z)(e)),
                e
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    return ei(
                      ei(
                        {},
                        (0, Jt.Z)((0, u.Z)(r.prototype), "apiDataMap", this)
                      ),
                      {},
                      { description: "description" }
                    );
                  },
                },
              ]),
              r
            );
          })(Hn)),
          (Qn.requestFields = Hn.requestFields.concat([
            "description",
            "download_urls",
          ])),
          (qn = Qn),
          (Yn = (0, Re.Z)(qn.prototype, "description", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "";
            },
          })),
          qn);
      function ai(e, t) {
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
      function si(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? ai(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : ai(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function ci(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var ui,
        li,
        pi,
        di =
          ((ii = (function (e) {
            (0, s.Z)(r, e);
            var t = ci(r);
            function r() {
              var e;
              (0, o.Z)(this, r);
              for (
                var n = arguments.length, i = new Array(n), a = 0;
                a < n;
                a++
              )
                i[a] = arguments[a];
              return (
                (e = t.call.apply(t, [this].concat(i))),
                (0, Ze.Z)(e, "objectUrl", ni, (0, Ne.Z)(e)),
                e
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    return si(
                      si(
                        {},
                        (0, Jt.Z)((0, u.Z)(r.prototype), "apiDataMap", this)
                      ),
                      {},
                      {
                        objectUrl: {
                          source: ["asset_type", "url_set"],
                          map: function (e, t) {
                            if (t[e] && t[e].length) return t[e][0].file;
                          },
                        },
                      }
                    );
                  },
                },
              ]),
              r
            );
          })(oi)),
          (ii.requestFields = oi.requestFields.concat(["url_set"])),
          (ri = ii),
          (ni = (0, Re.Z)(ri.prototype, "objectUrl", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "";
            },
          })),
          ri);
      function fi(e, t) {
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
      function hi(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? fi(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : fi(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function yi(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var mi =
        ((pi = (function (e) {
          (0, s.Z)(r, e);
          var t = yi(r);
          function r() {
            var e;
            (0, o.Z)(this, r);
            for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++)
              i[a] = arguments[a];
            return (
              (e = t.call.apply(t, [this].concat(i))),
              (0, Ze.Z)(e, "sourceUrl", li, (0, Ne.Z)(e)),
              e
            );
          }
          return (
            (0, a.Z)(r, [
              {
                key: "apiDataMap",
                get: function () {
                  return hi(
                    hi(
                      {},
                      (0, Jt.Z)((0, u.Z)(r.prototype), "apiDataMap", this)
                    ),
                    {},
                    { sourceUrl: "source_url" }
                  );
                },
              },
            ]),
            r
          );
        })(Hn)),
        (pi.requestFields = Hn.requestFields.concat(["source_url"])),
        (ui = pi),
        (li = (0, Re.Z)(ui.prototype, "sourceUrl", [Te.LO], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            return "";
          },
        })),
        ui);
      function bi(e, t) {
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
      function vi(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? bi(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : bi(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function gi(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var _i,
        Oi,
        wi,
        ki = (function (e) {
          (0, s.Z)(r, e);
          var t = gi(r);
          function r() {
            return (0, o.Z)(this, r), t.apply(this, arguments);
          }
          return (
            (0, a.Z)(r, [
              {
                key: "apiDataMap",
                get: function () {
                  return vi(
                    vi(
                      {},
                      (0, Jt.Z)((0, u.Z)(r.prototype), "apiDataMap", this)
                    ),
                    {},
                    { externalUrl: "external_url" }
                  );
                },
              },
              {
                key: "downloadUrl",
                get: function () {
                  return this.externalUrl;
                },
              },
            ]),
            r
          );
        })(oi);
      function xi(e, t) {
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
      function Pi(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? xi(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : xi(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function ji(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      ki.requestFields = oi.requestFields.concat(["external_url"]);
      var Zi,
        Ri,
        Ti,
        Ei,
        Ii,
        Ci,
        Si,
        Di,
        Ai =
          ((wi = (function (e) {
            (0, s.Z)(r, e);
            var t = ji(r);
            function r() {
              var e;
              (0, o.Z)(this, r);
              for (
                var n = arguments.length, i = new Array(n), a = 0;
                a < n;
                a++
              )
                i[a] = arguments[a];
              return (
                (e = t.call.apply(t, [this].concat(i))),
                (0, Ze.Z)(e, "slideUrls", Oi, (0, Ne.Z)(e)),
                e
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    return Pi(
                      Pi(
                        {},
                        (0, Jt.Z)((0, u.Z)(r.prototype), "apiDataMap", this)
                      ),
                      {},
                      { slideUrls: "slide_urls" }
                    );
                  },
                },
              ]),
              r
            );
          })(Hn)),
          (wi.requestFields = Hn.requestFields.concat(["slide_urls"])),
          (_i = wi),
          (Oi = (0, Re.Z)(_i.prototype, "slideUrls", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          _i);
      function Li(e, t) {
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
      function Ni(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Li(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Li(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function Ui(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Mi =
        ((Zi = Te.LO.ref),
        (Ri = Te.LO.ref),
        (Ti = Te.LO.ref),
        (Di = (function (e) {
          (0, s.Z)(r, e);
          var t = Ui(r);
          function r(e) {
            var n;
            return (
              (0, o.Z)(this, r),
              (n = t.call(this, e)),
              (0, Ze.Z)(n, "mediaLicenseToken", Ii, (0, Ne.Z)(n)),
              (0, Ze.Z)(n, "mediaSources", Ci, (0, Ne.Z)(n)),
              (0, Ze.Z)(n, "thumbnailSprite", Si, (0, Ne.Z)(n)),
              (n.playerId = (0, on.Ki)("playerId__".concat(n.id))),
              n
            );
          }
          return (
            (0, a.Z)(r, [
              {
                key: "apiDataMap",
                get: function () {
                  return Ni(
                    Ni(
                      {},
                      (0, Jt.Z)((0, u.Z)(r.prototype), "apiDataMap", this)
                    ),
                    {},
                    {
                      thumbnailUrl: "thumbnail_url",
                      thumbnailSprite: "thumbnail_sprite",
                      mediaLicenseToken: "media_license_token",
                      mediaSources: "media_sources",
                      captions: { source: "captions", defaultValue: [] },
                      created: "created",
                    }
                  );
                },
              },
              {
                key: "videoPlayerProps",
                get: function () {
                  return {
                    playerId: this.playerId,
                    assetId: this.id,
                    mediaLicenseToken: this.mediaLicenseToken,
                    mediaSources: (this.mediaSources || []).slice(),
                    duration: this.timeEstimation,
                    captions: (this.captions || []).slice(),
                    thumbnailSprite: this.thumbnailSprite,
                  };
                },
              },
            ]),
            r
          );
        })(Hn)),
        (Di.requestFields = Hn.requestFields.concat([
          "time_estimation",
          "media_license_token",
          "media_sources",
          "thumbnail_url",
          "captions",
          "thumbnail_sprite",
          "created",
        ])),
        (Di.extraParams = Object.assign({}, Hn.extraParams, {
          "fields[caption]": "@default,is_translation",
        })),
        (Ei = Di),
        (Ii = (0, Re.Z)(Ei.prototype, "mediaLicenseToken", [Zi], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: null,
        })),
        (Ci = (0, Re.Z)(Ei.prototype, "mediaSources", [Ri], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: null,
        })),
        (Si = (0, Re.Z)(Ei.prototype, "thumbnailSprite", [Ti], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: null,
        })),
        Ei);
      function Bi(e, t) {
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
      function Fi(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Bi(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Bi(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function zi(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Vi,
        Hi = (function (e) {
          (0, s.Z)(r, e);
          var t = zi(r);
          function r() {
            return (0, o.Z)(this, r), t.apply(this, arguments);
          }
          return (
            (0, a.Z)(r, [
              {
                key: "apiDataMap",
                get: function () {
                  return Fi(
                    Fi(
                      {},
                      (0, Jt.Z)((0, u.Z)(r.prototype), "apiDataMap", this)
                    ),
                    {},
                    { slides: "slides", length: "length" }
                  );
                },
              },
            ]),
            r
          );
        })(Mi);
      Hi.requestFields = Mi.requestFields
        .concat(["slides", "length"])
        .filter(function (e) {
          return "thumbnail_sprite" !== e;
        });
      var Wi,
        Gi,
        Ki,
        qi,
        Yi,
        Qi =
          ((Vi = {}),
          (0, i.Z)(Vi, Xn.ARTICLE, Jn),
          (0, i.Z)(Vi, Xn.AUDIO, Mi),
          (0, i.Z)(Vi, Xn.EBOOK, di),
          (0, i.Z)(Vi, Xn.EXTERNAL_LINK, oi),
          (0, i.Z)(Vi, Xn.FILE, oi),
          (0, i.Z)(Vi, Xn.IFRAME, mi),
          (0, i.Z)(Vi, Xn.IMPORT_CONTENT, ki),
          (0, i.Z)(Vi, Xn.PRESENTATION, Ai),
          (0, i.Z)(Vi, Xn.VIDEO, Mi),
          (0, i.Z)(Vi, Xn.VIDEO_MASHUP, Hi),
          Vi);
      function Ji(e, t) {
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
      function Xi(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Ji(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Ji(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function $i(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var eo,
        to,
        ro,
        no =
          ((Wi = (function (e) {
            (0, s.Z)(r, e);
            var t = $i(r);
            function r() {
              var e;
              (0, o.Z)(this, r);
              for (
                var n = arguments.length, i = new Array(n), a = 0;
                a < n;
                a++
              )
                i[a] = arguments[a];
              return (
                (e = t.call.apply(t, [this].concat(i))),
                (0, Ze.Z)(e, "id", Gi, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "type", Ki, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "asset", qi, (0, Ne.Z)(e)),
                (0, Ze.Z)(e, "isLoading", Yi, (0, Ne.Z)(e)),
                (e.getResourceDownloadUrl = (0, Qt.Z)(
                  $t().mark(function t() {
                    var r, n, i, o, a;
                    return $t().wrap(
                      function (t) {
                        for (;;)
                          switch ((t.prev = t.next)) {
                            case 0:
                              if (e.resourceAssetUrl) {
                                t.next = 2;
                                break;
                              }
                              return t.abrupt("return", !1);
                            case 2:
                              return (
                                e._setIsLoading(!0),
                                (t.prev = 3),
                                (t.next = 6),
                                cr.ZP.get(e.resourceAssetUrl, {
                                  params: { "fields[asset]": "download_urls" },
                                })
                              );
                            case 6:
                              if (
                                ((n = t.sent),
                                (i =
                                  null === n ||
                                  void 0 === n ||
                                  null === (r = n.data) ||
                                  void 0 === r
                                    ? void 0
                                    : r.download_urls),
                                (o = i[e.asset.type]),
                                !(a = (
                                  null === o || void 0 === o ? void 0 : o.length
                                )
                                  ? o[0].file
                                  : null))
                              ) {
                                t.next = 12;
                                break;
                              }
                              return t.abrupt("return", a);
                            case 12:
                              throw new Error(
                                "Could not fetch download URL for resource "
                                  .concat(e.asset.id, " (")
                                  .concat(e.asset.type, ")")
                              );
                            case 15:
                              (t.prev = 15),
                                (t.t0 = t.catch(3)),
                                _.c.captureException(t.t0),
                                er.n.addAlertBannerToast(
                                  Xi(
                                    Xi({}, Ut.ez),
                                    {},
                                    {
                                      title: gettext(
                                        "Unable to download selected item."
                                      ),
                                    }
                                  ),
                                  Ut.Qy
                                );
                            case 19:
                              return (
                                (t.prev = 19), e._setIsLoading(!1), t.finish(19)
                              );
                            case 22:
                            case "end":
                              return t.stop();
                          }
                      },
                      t,
                      null,
                      [[3, 15, 19, 22]]
                    );
                  })
                )),
                e
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "assetUrl",
                  get: function () {
                    throw new Error("Undefined assetUrl");
                  },
                },
                {
                  key: "resourceAssetUrl",
                  get: function () {
                    var e = this.assetUrl;
                    if (
                      e &&
                      [Xn.FILE, Xn.EXTERNAL_LINK].includes(
                        null === this || void 0 === this
                          ? void 0
                          : this.asset.type
                      )
                    )
                      return "".concat(e).concat(this.asset.id, "/");
                  },
                },
                {
                  key: "displayTitle",
                  get: function () {
                    throw new Error("Undefined display title");
                  },
                },
                {
                  key: "_setIsLoading",
                  value: function (e) {
                    this.isLoading = e;
                  },
                },
              ]),
              r
            );
          })(Kr)),
          (Gi = (0, Re.Z)(Wi.prototype, "id", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Ki = (0, Re.Z)(Wi.prototype, "type", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (qi = (0, Re.Z)(Wi.prototype, "asset", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Yi = (0, Re.Z)(Wi.prototype, "isLoading", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (0, Re.Z)(
            Wi.prototype,
            "resourceAssetUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Wi.prototype, "resourceAssetUrl"),
            Wi.prototype
          ),
          (0, Re.Z)(
            Wi.prototype,
            "_setIsLoading",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Wi.prototype, "_setIsLoading"),
            Wi.prototype
          ),
          Wi);
      function io(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var oo,
        ao,
        so,
        co,
        uo,
        lo,
        po,
        fo,
        ho,
        yo =
          ((eo = Te.LO.ref),
          (to = (function (e) {
            (0, s.Z)(r, e);
            var t = io(r);
            function r(e, n) {
              var i;
              return (
                (0, o.Z)(this, r),
                (i = t.call(this, e)),
                (0, Ze.Z)(i, "lab", ro, (0, Ne.Z)(i)),
                (i.lab = n),
                i
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "editableFieldsMap",
                  get: function () {
                    return new Map([["title", "title"]]);
                  },
                },
                {
                  key: "assetUrl",
                  get: function () {
                    return null === this || void 0 === this
                      ? void 0
                      : this.lab.assetsUrl;
                  },
                },
                {
                  key: "resourceUrl",
                  get: function () {
                    return ""
                      .concat(lr(this.lab.id), "resources/")
                      .concat(this.id, "/");
                  },
                },
                {
                  key: "displayTitle",
                  get: function () {
                    var e;
                    return null === (e = this.asset) || void 0 === e
                      ? void 0
                      : e.title;
                  },
                },
                {
                  key: "apiDataMap",
                  get: function () {
                    return {
                      id: "id",
                      type: "type",
                      title: {
                        source: "asset",
                        map: function (e) {
                          return e.title;
                        },
                      },
                      asset: {
                        source: "asset",
                        map: function (e) {
                          if (e) return new (Qi[e.asset_type] || Hn)(e);
                        },
                      },
                    };
                  },
                },
              ]),
              r
            );
          })(no)),
          (ro = (0, Re.Z)(to.prototype, "lab", [eo], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (0, Re.Z)(
            to.prototype,
            "displayTitle",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(to.prototype, "displayTitle"),
            to.prototype
          ),
          to),
        mo = "code-editor";
      function bo(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var vo,
        go,
        _o,
        Oo,
        wo,
        ko,
        xo,
        Po,
        jo,
        Zo,
        Ro =
          ((oo = (function (e) {
            (0, s.Z)(r, e);
            var t = bo(r);
            function r(e, n, i) {
              var a;
              return (
                (0, o.Z)(this, r),
                (a = t.call(this, e)),
                (0, Ze.Z)(a, "id", ao, (0, Ne.Z)(a)),
                (0, Ze.Z)(a, "testTitle", so, (0, Ne.Z)(a)),
                (0, Ze.Z)(a, "successMessage", co, (0, Ne.Z)(a)),
                (0, Ze.Z)(a, "errorMessage", uo, (0, Ne.Z)(a)),
                (0, Ze.Z)(a, "asset", lo, (0, Ne.Z)(a)),
                (0, Ze.Z)(a, "labTask", po, (0, Ne.Z)(a)),
                (0, Ze.Z)(a, "isForOpenChallenge", fo, (0, Ne.Z)(a)),
                (0, Ze.Z)(a, "uiMode", ho, (0, Ne.Z)(a)),
                (a.labTask = n),
                (a.uiMode = null !== i && void 0 !== i ? i : mo),
                a
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    return {
                      id: "id",
                      testTitle: "test_title",
                      successMessage: "success_message",
                      errorMessage: "error_message",
                      isForOpenChallenge: {
                        source: "is_for_open_challenge",
                        defaultValue: !1,
                      },
                      asset: {
                        source: "asset",
                        map: function (e) {
                          if (e) return new Hn(e);
                        },
                      },
                    };
                  },
                },
                {
                  key: "editableFieldsMap",
                  get: function () {
                    return new Map([
                      ["testTitle", "test_title"],
                      ["successMessage", "success_message"],
                      ["errorMessage", "error_message"],
                      ["isForOpenChallenge", "is_for_open_challenge"],
                    ]);
                  },
                },
                {
                  key: "resourceUrl",
                  get: function () {
                    return ""
                      .concat(dr(this.labTask.lab.id))
                      .concat(this.labTask.id, "/automated-review-test/")
                      .concat(this.id, "/");
                  },
                },
                {
                  key: "assetUrl",
                  get: function () {
                    return this.labTask.lab.assetsUrl;
                  },
                },
                {
                  key: "resourceAssetUrl",
                  get: function () {
                    var e = this.assetUrl;
                    if (this.asset && e && this.asset.type === Xn.SOURCE_CODE)
                      return "".concat(e).concat(this.asset.id, "/");
                  },
                },
                {
                  key: "setUIMode",
                  value: function (e) {
                    this.uiMode = e;
                  },
                },
                {
                  key: "removeAsset",
                  value: function () {
                    this.asset = void 0;
                  },
                },
              ]),
              r
            );
          })(no)),
          (ao = (0, Re.Z)(oo.prototype, "id", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (so = (0, Re.Z)(oo.prototype, "testTitle", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (co = (0, Re.Z)(oo.prototype, "successMessage", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (uo = (0, Re.Z)(oo.prototype, "errorMessage", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (lo = (0, Re.Z)(oo.prototype, "asset", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (po = (0, Re.Z)(oo.prototype, "labTask", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (fo = (0, Re.Z)(oo.prototype, "isForOpenChallenge", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (ho = (0, Re.Z)(oo.prototype, "uiMode", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (0, Re.Z)(
            oo.prototype,
            "resourceAssetUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(oo.prototype, "resourceAssetUrl"),
            oo.prototype
          ),
          (0, Re.Z)(
            oo.prototype,
            "setUIMode",
            [Te.aD],
            Object.getOwnPropertyDescriptor(oo.prototype, "setUIMode"),
            oo.prototype
          ),
          (0, Re.Z)(
            oo.prototype,
            "removeAsset",
            [Te.aD],
            Object.getOwnPropertyDescriptor(oo.prototype, "removeAsset"),
            oo.prototype
          ),
          oo),
        To = "build",
        Eo =
          ((vo = (function () {
            function e(t) {
              (0, o.Z)(this, e),
                (0, Ze.Z)(this, "id", go, this),
                (0, Ze.Z)(this, "completionMode", _o, this),
                (0, Ze.Z)(this, "results", Oo, this),
                (0, Ze.Z)(this, "buildErrorMessage", wo, this),
                (0, Ze.Z)(this, "isBuildError", ko, this),
                (0, Ze.Z)(this, "numberOfAttempts", xo, this),
                (this.id = t.id),
                (this.completionMode = t.completion_mode),
                t.automated_review_test_result &&
                  this.setResults(t.automated_review_test_result);
            }
            return (
              (0, a.Z)(e, [
                {
                  key: "setResults",
                  value: function (e) {
                    if (
                      (this.setIsBuildError(!1),
                      (this.numberOfAttempts += 1),
                      null === e || void 0 === e
                        ? void 0
                        : e.some(function (e) {
                            return !e.is_correct && e.type === To;
                          }))
                    )
                      return this.setErrorStateBuild(e[0].test_message);
                    this.results = e.filter(function (e) {
                      return e.type !== To;
                    });
                  },
                },
                {
                  key: "setErrorStateBuild",
                  value: function (e) {
                    this.setIsBuildError(!0), (this.buildErrorMessage = e);
                  },
                },
                {
                  key: "setIsBuildError",
                  value: function (e) {
                    this.isBuildError = e;
                  },
                },
              ]),
              e
            );
          })()),
          (go = (0, Re.Z)(vo.prototype, "id", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (_o = (0, Re.Z)(vo.prototype, "completionMode", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Oo = (0, Re.Z)(vo.prototype, "results", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (wo = (0, Re.Z)(vo.prototype, "buildErrorMessage", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (ko = (0, Re.Z)(vo.prototype, "isBuildError", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (xo = (0, Re.Z)(vo.prototype, "numberOfAttempts", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return 0;
            },
          })),
          (0, Re.Z)(
            vo.prototype,
            "setResults",
            [Te.aD],
            Object.getOwnPropertyDescriptor(vo.prototype, "setResults"),
            vo.prototype
          ),
          (0, Re.Z)(
            vo.prototype,
            "setErrorStateBuild",
            [Te.aD],
            Object.getOwnPropertyDescriptor(vo.prototype, "setErrorStateBuild"),
            vo.prototype
          ),
          vo);
      function Io(e, t) {
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
      function Co(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Io(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Io(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function So(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Do,
        Ao,
        Lo,
        No,
        Uo,
        Mo,
        Bo,
        Fo,
        zo,
        Vo,
        Ho,
        Wo,
        Go,
        Ko,
        qo,
        Yo,
        Qo,
        Jo,
        Xo =
          ((Po = Te.LO.ref),
          (jo = (function (e) {
            (0, s.Z)(r, e);
            var t = So(r);
            function r(e, n) {
              var i;
              return (
                (0, o.Z)(this, r),
                (i = t.call(this, e)),
                (0, Ze.Z)(i, "task", Zo, (0, Ne.Z)(i)),
                (i.task = n),
                i
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "editableFieldsMap",
                  get: function () {
                    return new Map([
                      ["title", "title"],
                      ["body", "body"],
                      ["url", "url"],
                    ]);
                  },
                },
                {
                  key: "assetUrl",
                  get: function () {
                    var e;
                    return null === this ||
                      void 0 === this ||
                      null === (e = this.task) ||
                      void 0 === e
                      ? void 0
                      : e.lab.assetsUrl;
                  },
                },
                {
                  key: "resourceUrl",
                  get: function () {
                    return ""
                      .concat(this.task.taskResourcesUrl)
                      .concat(this.id, "/");
                  },
                },
                {
                  key: "displayTitle",
                  get: function () {
                    var e;
                    return this.type === Ut.Pu
                      ? this.task.title
                      : (null === (e = this.asset) || void 0 === e
                          ? void 0
                          : e.title) || this.task.title;
                  },
                },
                {
                  key: "apiDataMap",
                  get: function () {
                    return {
                      id: "id",
                      type: "type",
                      title: {
                        source: "asset",
                        map: function (e) {
                          return e.title;
                        },
                      },
                      body: {
                        source: "asset",
                        map: function (e) {
                          return e.body;
                        },
                      },
                      url: {
                        source: "asset",
                        map: function (e) {
                          return e.external_url;
                        },
                      },
                      asset: {
                        source: "asset",
                        map: function (e) {
                          if (e) return new (Qi[e.asset_type] || Hn)(e);
                        },
                      },
                    };
                  },
                },
                {
                  key: "getResourceExternalUrl",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e() {
                        var t, r, n;
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  if (this.resourceAssetUrl) {
                                    e.next = 2;
                                    break;
                                  }
                                  return e.abrupt("return", !1);
                                case 2:
                                  return (
                                    this._setIsLoading(!0),
                                    (e.prev = 3),
                                    (e.next = 6),
                                    cr.ZP.get(this.resourceAssetUrl, {
                                      params: {
                                        "fields[asset]": "external_url",
                                      },
                                    })
                                  );
                                case 6:
                                  if (
                                    ((r = e.sent),
                                    !(n =
                                      null === r ||
                                      void 0 === r ||
                                      null === (t = r.data) ||
                                      void 0 === t
                                        ? void 0
                                        : t.external_url))
                                  ) {
                                    e.next = 10;
                                    break;
                                  }
                                  return e.abrupt("return", n);
                                case 10:
                                  throw new Error(
                                    "Could not fetch external URL for resource "
                                      .concat(this.asset.id, " (")
                                      .concat(this.asset.type, ")")
                                  );
                                case 13:
                                  (e.prev = 13),
                                    (e.t0 = e.catch(3)),
                                    _.c.captureException(e.t0),
                                    er.n.addAlertBannerToast(
                                      Co(
                                        Co({}, Ut.ez),
                                        {},
                                        {
                                          title: gettext(
                                            "Unable to redirect to the selected resource."
                                          ),
                                        }
                                      ),
                                      Ut.Qy
                                    );
                                case 17:
                                  return (
                                    (e.prev = 17),
                                    this._setIsLoading(!1),
                                    e.finish(17)
                                  );
                                case 20:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[3, 13, 17, 20]]
                        );
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
              ]),
              r
            );
          })(no)),
          (Zo = (0, Re.Z)(jo.prototype, "task", [Po], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (0, Re.Z)(
            jo.prototype,
            "displayTitle",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(jo.prototype, "displayTitle"),
            jo.prototype
          ),
          jo);
      function $o(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var ea,
        ta,
        ra,
        na,
        ia,
        oa,
        aa,
        sa,
        ca,
        ua,
        la,
        pa,
        da,
        fa,
        ha,
        ya,
        ma,
        ba,
        va,
        ga,
        _a,
        Oa,
        wa,
        ka,
        xa,
        Pa,
        ja,
        Za,
        Ra,
        Ta,
        Ea,
        Ia,
        Ca,
        Sa,
        Da,
        Aa,
        La,
        Na,
        Ua,
        Ma,
        Ba,
        Fa =
          ((Do = Te.LO.ref),
          (Ao = (function (e) {
            (0, s.Z)(r, e);
            var t = $o(r);
            function r(e, n) {
              var i;
              return (
                (0, o.Z)(this, r),
                (i = t.call(this, e)),
                (0, Ze.Z)(i, "id", Lo, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "lab", No, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "title", Uo, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "challenge", Mo, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "status", Bo, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "resources", Fo, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "hasAutomatedReviewTests", zo, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "automatedReviewTests", Vo, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "automatedReviewTestRun", Ho, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "viewMode", Wo, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "isLoading", Go, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "isPanelExpanded", Ko, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "shouldShowTaskReviewMessage", qo, (0, Ne.Z)(i)),
                (i.completionData = Te.LO.map()),
                (0, Ze.Z)(i, "setPanelExpanded", Yo, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "deleteResourceById", Qo, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "deleteAutomatedReviewTestById", Jo, (0, Ne.Z)(i)),
                (i.lab = n),
                i
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    var e = this;
                    return {
                      id: "id",
                      title: "title",
                      challenge: "challenge",
                      status: "status",
                      resources: {
                        source: "resources",
                        map: function (t) {
                          return t.map(function (t) {
                            return new Xo(t, e);
                          });
                        },
                      },
                      hasAutomatedReviewTests: "has_automated_review_tests",
                      automatedReviewTests: {
                        source: "automated_review_tests",
                        map: function (t) {
                          return t.map(function (t) {
                            return new Ro(t, e);
                          });
                        },
                      },
                      automatedReviewTestRun: {
                        source: "automated_review_test_run",
                        map: function (e) {
                          return new Eo(e);
                        },
                      },
                    };
                  },
                },
                {
                  key: "editableFieldsMap",
                  get: function () {
                    return new Map([
                      ["title", "title"],
                      ["challenge", "challenge"],
                    ]);
                  },
                },
                {
                  key: "resourceUrl",
                  get: function () {
                    return "".concat(dr(this.lab.id)).concat(this.id, "/");
                  },
                },
                {
                  key: "taskResourcesUrl",
                  get: function () {
                    return "".concat(this.resourceUrl, "resources/");
                  },
                },
                {
                  key: "taskAutomatedReviewTestUrl",
                  get: function () {
                    return "".concat(
                      this.resourceUrl,
                      "automated-review-test/"
                    );
                  },
                },
                {
                  key: "isCompleted",
                  get: function () {
                    return (
                      !!this.lab.currentMode &&
                      this.completionData.has(this.lab.currentMode)
                    );
                  },
                },
                {
                  key: "howTo",
                  get: function () {
                    return this.resources.filter(function (e) {
                      return e.type === Ut.Pu;
                    });
                  },
                },
                {
                  key: "howToWithSolutionCode",
                  get: function () {
                    return this.howTo.length
                      ? [
                          {
                            article: this.howTo[0],
                            solutionCode: this.solutionCode.length
                              ? this.solutionCode[0]
                              : void 0,
                          },
                        ]
                      : [];
                  },
                },
                {
                  key: "isHowToNotEmpty",
                  get: function () {
                    return (
                      this.howTo.length > 0 && "" !== this.howTo[0].asset.body
                    );
                  },
                },
                {
                  key: "documentation",
                  get: function () {
                    return this.resources.filter(function (e) {
                      return e.type === Ut.n5;
                    });
                  },
                },
                {
                  key: "assets",
                  get: function () {
                    return this.resources.filter(function (e) {
                      return e.type === Ut.Je;
                    });
                  },
                },
                {
                  key: "azureResources",
                  get: function () {
                    return this.resources.filter(function (e) {
                      return e.type === Ut.RY;
                    });
                  },
                },
                {
                  key: "solutionCode",
                  get: function () {
                    return this.resources.filter(function (e) {
                      return e.type === Ut.IR;
                    });
                  },
                },
                {
                  key: "hasResources",
                  get: function () {
                    return this.resources.length > 0;
                  },
                },
                {
                  key: "hasAssets",
                  get: function () {
                    return (
                      this.assets.length > 0 || this.documentation.length > 0
                    );
                  },
                },
                {
                  key: "isSavingInProgress",
                  get: function () {
                    return (
                      this.isSaving ||
                      this.resources.some(function (e) {
                        return e.isSaving;
                      })
                    );
                  },
                },
                {
                  key: "isSavingError",
                  get: function () {
                    return (
                      this.apiError ||
                      this.resources.some(function (e) {
                        return e.apiError;
                      })
                    );
                  },
                },
                {
                  key: "addCompletionData",
                  value: function (e, t) {
                    this.completionData.set(e, t);
                  },
                },
                {
                  key: "removeCompletionData",
                  value: function () {
                    this.completionData.delete(this.lab.currentMode);
                  },
                },
                {
                  key: "setIsLoading",
                  value: function (e) {
                    this.isLoading = e;
                  },
                },
                {
                  key: "addResourceFromData",
                  value: function (e) {
                    this.resources.push(new Xo(e, this));
                  },
                },
                {
                  key: "markAsComplete",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e() {
                        var t, r, n, i;
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (t = this.lab),
                                    (r = t.tasksCompletionUrl),
                                    (n = t.currentMode),
                                    this.setIsLoading(!0),
                                    (e.prev = 2),
                                    (e.next = 5),
                                    cr.ZP.post(r, {
                                      lab_task_id: this.id,
                                      completion_mode: n,
                                    })
                                  );
                                case 5:
                                  (i = e.sent),
                                    this.addCompletionData(n, i.data.id),
                                    (e.next = 13);
                                  break;
                                case 9:
                                  throw (
                                    ((e.prev = 9),
                                    (e.t0 = e.catch(2)),
                                    _.c.captureException(e.t0),
                                    e.t0)
                                  );
                                case 13:
                                  return (
                                    (e.prev = 13),
                                    this.setIsLoading(!1),
                                    e.finish(13)
                                  );
                                case 16:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[2, 9, 13, 16]]
                        );
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "resetCompletion",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e() {
                        var t, r, n, i;
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (t = this.lab),
                                    (r = t.tasksCompletionUrl),
                                    (n = t.currentMode),
                                    (i = this.completionData.get(n)),
                                    this.setIsLoading(!0),
                                    (e.prev = 3),
                                    (e.next = 6),
                                    cr.ZP.delete("".concat(r).concat(i, "/"))
                                  );
                                case 6:
                                  this.removeCompletionData(), (e.next = 13);
                                  break;
                                case 9:
                                  throw (
                                    ((e.prev = 9),
                                    (e.t0 = e.catch(3)),
                                    _.c.captureException(e.t0),
                                    e.t0)
                                  );
                                case 13:
                                  return (
                                    (e.prev = 13),
                                    this.setIsLoading(!1),
                                    e.finish(13)
                                  );
                                case 16:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[3, 9, 13, 16]]
                        );
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "createAsset",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e(t, r) {
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (e.next = 2),
                                    this._createResource({ type: r, asset: t })
                                  );
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
                    return function (t, r) {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "createSolutionCode",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e(t) {
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (e.next = 2),
                                    this._createResource({
                                      type: Ut.IR,
                                      asset: t,
                                    })
                                  );
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
                    return function (t) {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "createDocumentationLink",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e() {
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (e.next = 2),
                                    this._createResource({ type: Ut.n5 })
                                  );
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
                  key: "_createResource",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e(t) {
                        var r;
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    this._setSaving(!0),
                                    (e.prev = 1),
                                    (e.next = 4),
                                    cr.ZP.post(this.taskResourcesUrl, t)
                                  );
                                case 4:
                                  (r = e.sent),
                                    this.addResourceFromData(r.data),
                                    (e.next = 12);
                                  break;
                                case 8:
                                  throw (
                                    ((e.prev = 8),
                                    (e.t0 = e.catch(1)),
                                    _.c.captureException(e.t0),
                                    e.t0)
                                  );
                                case 12:
                                  return (
                                    (e.prev = 12),
                                    this._setSaving(!1),
                                    e.finish(12)
                                  );
                                case 15:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[1, 8, 12, 15]]
                        );
                      })
                    );
                    return function (t) {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "createAutomatedReviewTestResource",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e(t, r) {
                        var n, i;
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    this._setSaving(!0),
                                    (n = this.automatedReviewTests.length),
                                    (e.prev = 2),
                                    (t.position = n + 1),
                                    (e.next = 6),
                                    cr.ZP.post(
                                      this.taskAutomatedReviewTestUrl,
                                      t
                                    )
                                  );
                                case 6:
                                  (i = e.sent),
                                    this.addAutomatedReviewTestFromData(
                                      i.data,
                                      r
                                    ),
                                    (e.next = 14);
                                  break;
                                case 10:
                                  throw (
                                    ((e.prev = 10),
                                    (e.t0 = e.catch(2)),
                                    _.c.captureException(e.t0),
                                    e.t0)
                                  );
                                case 14:
                                  return (
                                    (e.prev = 14),
                                    this._setSaving(!1),
                                    e.finish(14)
                                  );
                                case 17:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[2, 10, 14, 17]]
                        );
                      })
                    );
                    return function (t, r) {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "updateAutomatedReviewTestResource",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e(t, r, n) {
                        var i, o;
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    this._setSaving(!0),
                                    (i = ""
                                      .concat(this.taskAutomatedReviewTestUrl)
                                      .concat(t, "/update-asset/")),
                                    (e.prev = 2),
                                    (e.next = 5),
                                    cr.ZP.patch(i, {
                                      assetId: r,
                                      automatedTestId: t,
                                    })
                                  );
                                case 5:
                                  (o = e.sent),
                                    this.updateAutomatedReviewTest(o.data, n),
                                    (e.next = 13);
                                  break;
                                case 9:
                                  throw (
                                    ((e.prev = 9),
                                    (e.t0 = e.catch(2)),
                                    _.c.captureException(e.t0),
                                    e.t0)
                                  );
                                case 13:
                                  return (
                                    (e.prev = 13),
                                    this._setSaving(!1),
                                    e.finish(13)
                                  );
                                case 16:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[2, 9, 13, 16]]
                        );
                      })
                    );
                    return function (t, r, n) {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "updateAutomatedReviewTest",
                  value: function (e, t) {
                    var r = new Ro(e, this);
                    r.setUIMode(t);
                    var n = this.automatedReviewTests.findIndex(function (e) {
                      return e.id === r.id;
                    });
                    this.automatedReviewTests.splice(n, 1, r);
                  },
                },
                {
                  key: "addAutomatedReviewTestFromData",
                  value: function (e, t) {
                    this.automatedReviewTests.push(new Ro(e, this, t));
                  },
                },
                {
                  key: "setShouldShowTaskReviewMessage",
                  value: function (e) {
                    this.shouldShowTaskReviewMessage = e;
                  },
                },
              ]),
              r
            );
          })(Kr)),
          (Lo = (0, Re.Z)(Ao.prototype, "id", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (No = (0, Re.Z)(Ao.prototype, "lab", [Do], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Uo = (0, Re.Z)(Ao.prototype, "title", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Mo = (0, Re.Z)(Ao.prototype, "challenge", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "";
            },
          })),
          (Bo = (0, Re.Z)(Ao.prototype, "status", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Fo = (0, Re.Z)(Ao.prototype, "resources", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (zo = (0, Re.Z)(Ao.prototype, "hasAutomatedReviewTests", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (Vo = (0, Re.Z)(Ao.prototype, "automatedReviewTests", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (Ho = (0, Re.Z)(Ao.prototype, "automatedReviewTestRun", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Wo = (0, Re.Z)(Ao.prototype, "viewMode", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Go = (0, Re.Z)(Ao.prototype, "isLoading", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (Ko = (0, Re.Z)(Ao.prototype, "isPanelExpanded", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (qo = (0, Re.Z)(
            Ao.prototype,
            "shouldShowTaskReviewMessage",
            [Te.LO],
            {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return !1;
              },
            }
          )),
          (0, Re.Z)(
            Ao.prototype,
            "isCompleted",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Ao.prototype, "isCompleted"),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "howTo",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Ao.prototype, "howTo"),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "howToWithSolutionCode",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(
              Ao.prototype,
              "howToWithSolutionCode"
            ),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "isHowToNotEmpty",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Ao.prototype, "isHowToNotEmpty"),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "documentation",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Ao.prototype, "documentation"),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "assets",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Ao.prototype, "assets"),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "azureResources",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Ao.prototype, "azureResources"),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "solutionCode",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Ao.prototype, "solutionCode"),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "hasResources",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Ao.prototype, "hasResources"),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "hasAssets",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Ao.prototype, "hasAssets"),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "isSavingInProgress",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Ao.prototype, "isSavingInProgress"),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "isSavingError",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(Ao.prototype, "isSavingError"),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "addCompletionData",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Ao.prototype, "addCompletionData"),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "removeCompletionData",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              Ao.prototype,
              "removeCompletionData"
            ),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "setIsLoading",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Ao.prototype, "setIsLoading"),
            Ao.prototype
          ),
          (Yo = (0, Re.Z)(Ao.prototype, "setPanelExpanded", [Te.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                e.isPanelExpanded = t;
              };
            },
          })),
          (0, Re.Z)(
            Ao.prototype,
            "addResourceFromData",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              Ao.prototype,
              "addResourceFromData"
            ),
            Ao.prototype
          ),
          (Qo = (0, Re.Z)(Ao.prototype, "deleteResourceById", [Te.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                var r = e.resources.findIndex(function (e) {
                  return e.id === t;
                });
                r > -1 && e.resources.splice(r, 1);
              };
            },
          })),
          (Jo = (0, Re.Z)(
            Ao.prototype,
            "deleteAutomatedReviewTestById",
            [Te.aD],
            {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                var e = this;
                return function (t) {
                  var r = e.automatedReviewTests.findIndex(function (e) {
                    return e.id === t;
                  });
                  r > -1 && e.automatedReviewTests.splice(r, 1);
                };
              },
            }
          )),
          (0, Re.Z)(
            Ao.prototype,
            "updateAutomatedReviewTest",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              Ao.prototype,
              "updateAutomatedReviewTest"
            ),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "addAutomatedReviewTestFromData",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              Ao.prototype,
              "addAutomatedReviewTestFromData"
            ),
            Ao.prototype
          ),
          (0, Re.Z)(
            Ao.prototype,
            "setShouldShowTaskReviewMessage",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              Ao.prototype,
              "setShouldShowTaskReviewMessage"
            ),
            Ao.prototype
          ),
          Ao);
      function za(e, t) {
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
      function Va(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? za(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : za(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function Ha(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Wa = function (e) {
          return [Ut.dk.gcp.key, Ut.dk.security.key].includes(e);
        },
        Ga =
          ((ea = Te.LO.ref),
          (ta = (function (e) {
            (0, s.Z)(r, e);
            var t = Ha(r);
            function r(e) {
              var n,
                i,
                a =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {};
              return (
                (0, o.Z)(this, r),
                (i = t.call(this, e)),
                (0, Ze.Z)(i, "id", ra, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "title", na, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "labId", ia, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "tasks", oa, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "activeTaskNumber", aa, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "isLoading", sa, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "labOverview", ca, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "challengeOverview", ua, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "projectOverview", la, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "minEstimatedTime", pa, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "maxEstimatedTime", da, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "provider", fa, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "vertical", ha, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "template", ya, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "status", ma, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "initialCode", ba, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "labType", va, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "myLatestInstance", ga, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "owner", _a, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "enrollment", Oa, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "assignment", wa, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "labGoals", ka, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "isEditMode", xa, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "workspaceEnabledLectures", Pa, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "reviewError", ja, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "isLaunchDisabled", Za, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "labTakingUrl", Ra, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "instructorHasLab", Ta, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "visibleInstructors", Ea, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "topics", Ia, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "titleAutoslug", Ca, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "spec", Sa, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "specName", Da, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "numberOfClicksReviewButton", Aa, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "whatYouWillDo", La, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "whatYouWillLearn", Na, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "requirements", Ua, (0, Ne.Z)(i)),
                (0, Ze.Z)(i, "course", Ma, (0, Ne.Z)(i)),
                (i._autoSave = function () {
                  i.hasUnsavedChanges &&
                    (i._setSaving(!0),
                    i.debouncedAutoSave && i.debouncedAutoSave.cancel(),
                    (i.debouncedAutoSave = (0, sr.D)(
                      i._partialUpdate,
                      i.autoSaveInterval
                    )),
                    i.debouncedAutoSave());
                }),
                (i.validateLabData = (0, Qt.Z)(
                  $t().mark(function e() {
                    var t, r;
                    return $t().wrap(
                      function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              return (
                                i._setReviewError(null),
                                (e.prev = 1),
                                (e.next = 4),
                                cr.ZP.post(fr(i.id), {})
                              );
                            case 4:
                              e.next = 11;
                              break;
                            case 6:
                              throw (
                                ((e.prev = 6),
                                (e.t0 = e.catch(1)),
                                (r =
                                  null === e.t0 ||
                                  void 0 === e.t0 ||
                                  null === (t = e.t0.response) ||
                                  void 0 === t
                                    ? void 0
                                    : t.data) && i._setReviewError(r),
                                new Error("Validation failed"))
                              );
                            case 11:
                            case "end":
                              return e.stop();
                          }
                      },
                      e,
                      null,
                      [[1, 6]]
                    );
                  })
                )),
                (i.submitForReview = (0, Qt.Z)(
                  $t().mark(function e() {
                    var t;
                    return $t().wrap(
                      function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              return (
                                i._setSaving(!0),
                                (e.prev = 1),
                                (e.next = 4),
                                cr.ZP.post(pr(i.id), {})
                              );
                            case 4:
                              i.setStatus(Ut.cb.in_review), (e.next = 12);
                              break;
                            case 7:
                              throw (
                                ((e.prev = 7),
                                (e.t0 = e.catch(1)),
                                (null === e.t0 ||
                                void 0 === e.t0 ||
                                null === (t = e.t0.response) ||
                                void 0 === t
                                  ? void 0
                                  : t.data) &&
                                  er.n.addAlertBannerToast(
                                    Va(
                                      Va({}, Ut.ez),
                                      {},
                                      { title: gettext("Validation failed") }
                                    ),
                                    Ut.Qy
                                  ),
                                new Error("Validation failed"))
                              );
                            case 12:
                              return (
                                (e.prev = 12), i._setSaving(!1), e.finish(12)
                              );
                            case 15:
                            case "end":
                              return e.stop();
                          }
                      },
                      e,
                      null,
                      [[1, 7, 12, 15]]
                    );
                  })
                )),
                (0, Ze.Z)(i, "deleteTaskAt", Ba, (0, Ne.Z)(i)),
                (i.deleteInitialSourceCode = (0, Qt.Z)(
                  $t().mark(function e() {
                    var t;
                    return $t().wrap(function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              (e.next = 2),
                              null === (t = i.initialCode) || void 0 === t
                                ? void 0
                                : t.delete()
                            );
                          case 2:
                            i._setInitialCodeFromData(null);
                          case 3:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                  })
                )),
                (0, Te.U5)(
                  function () {
                    return i.areTasksCompleted;
                  },
                  function () {
                    var e;
                    i.enrollment &&
                      (null === (e = i.enrollment) ||
                        void 0 === e ||
                        e.setIsCompleted(i.areTasksCompleted));
                  }
                ),
                (0, Te.U5)(
                  function () {
                    var e;
                    return null === (e = i.labGoals) || void 0 === e
                      ? void 0
                      : e.isDirty;
                  },
                  function () {
                    var e;
                    (null === (e = i.labGoals) || void 0 === e
                      ? void 0
                      : e.isDirty) && i._onLabGoalsChange();
                  }
                ),
                (i.me = null !== (n = a.me) && void 0 !== n ? n : Ce.ZP),
                i
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "apiDataMap",
                  get: function () {
                    var e = this;
                    return {
                      id: "id",
                      title: "title",
                      description: "description",
                      projectOverview: "project_overview",
                      labOverview: "lab_overview",
                      challengeOverview: "challenge_overview",
                      minEstimatedTime: "min_estimated_time",
                      maxEstimatedTime: "max_estimated_time",
                      whatYouWillDo: "what_you_will_do",
                      whatYouWillLearn: "what_you_will_learn",
                      requirements: "requirements",
                      setupStartLectureId: "setup_start_lecture_id",
                      postSetupLectureId: "post_setup_lecture_id",
                      labTakingUrl: "url",
                      vertical: "vertical",
                      provider: "provider",
                      labType: "lab_type",
                      status: "status",
                      template: "template",
                      spec: "spec",
                      specName: "spec_name",
                      hasSso: "has_sso",
                      isLaunchDisabled: "is_launch_disabled",
                      titleAutoslug: "title_autoslug",
                      course: {
                        source: "course",
                        map: function (e) {
                          if (e) return new wr(e);
                        },
                        defaultValue: null,
                      },
                      myLatestInstance: {
                        source: "my_latest_instance",
                        map: function (t) {
                          t && e.setLabInstanceFromData(t);
                        },
                        defaultValue: null,
                      },
                      instructorHasLab: {
                        source: "instructor_has_lab",
                        map: function (t) {
                          t && e.setInstructorHasLabFromData(t);
                        },
                        defaultValue: null,
                      },
                      visibleInstructors: {
                        source: "visible_instructors",
                        map: function (t) {
                          t && e.setVisibleInstructors(t);
                        },
                        defaultValue: [],
                      },
                      tasks: {
                        source: "tasks",
                        map: function (t) {
                          e.addTasksFromData(t);
                        },
                        defaultValue: [],
                      },
                      enrollment: {
                        source: "enrollment",
                        map: function (t) {
                          if (t) return new Tn(t, e);
                        },
                      },
                      assignment: { source: "assignment", defaultValue: null },
                      owner: {
                        source: "owner",
                        map: function (e) {
                          return new ar(e);
                        },
                        defaultValue: null,
                      },
                      labGoals: {
                        source: [
                          "what_you_will_do",
                          "what_you_will_learn",
                          "requirements",
                        ],
                        map: function (t, r, n) {
                          if (!e.labGoals)
                            return new wn({
                              whatYouWillDo: t,
                              whatYouWillLearn: r,
                              requirements: n,
                            });
                        },
                        defaultValue: null,
                      },
                      initialCode: {
                        source: "initial_source_code",
                        map: function (t) {
                          if (t) return e._setInitialCodeFromData(t);
                        },
                        defaultValue: null,
                      },
                      topics: { source: "topics", defaultValue: [] },
                    };
                  },
                },
                {
                  key: "editableFieldsMap",
                  get: function () {
                    return new Map([
                      ["title", "title"],
                      ["description", "description"],
                      ["projectOverview", "project_overview"],
                      ["challengeOverview", "challenge_overview"],
                      ["labOverview", "lab_overview"],
                      ["minEstimatedTime", "min_estimated_time"],
                      ["maxEstimatedTime", "max_estimated_time"],
                      ["vertical", "vertical"],
                      ["template", "template"],
                      ["course", "course"],
                      ["labType", "lab_type"],
                    ]);
                  },
                },
                {
                  key: "resourceUrl",
                  get: function () {
                    return lr(this.id);
                  },
                },
                {
                  key: "resourcesUrl",
                  get: function () {
                    return "".concat(this.resourceUrl, "resources/");
                  },
                },
                {
                  key: "isInReview",
                  get: function () {
                    return this.status === Ut.cb.in_review;
                  },
                },
                {
                  key: "isDraft",
                  get: function () {
                    return this.status === Ut.cb.draft;
                  },
                },
                {
                  key: "isPublished",
                  get: function () {
                    return this.status === Ut.cb.published;
                  },
                },
                {
                  key: "isBeta",
                  get: function () {
                    return Wa(this.vertical);
                  },
                },
                {
                  key: "currentMode",
                  get: function () {
                    var e;
                    return (
                      (null === (e = this.enrollment) || void 0 === e
                        ? void 0
                        : e.lastAttemptedMode) || null
                    );
                  },
                },
                {
                  key: "url",
                  get: function () {
                    return this.isEditMode
                      ? "".concat(Ut.UJ).concat(this.id, "/manage/")
                      : this.labTakingUrl
                      ? this.labTakingUrl
                      : "".concat(Ut.UJ).concat(this.id, "/");
                  },
                },
                {
                  key: "assetsUrl",
                  get: function () {
                    return "".concat(this.resourceUrl, "assets/");
                  },
                },
                {
                  key: "firstTaskUrl",
                  get: function () {
                    return "".concat(this.url, "tasks/1/");
                  },
                },
                {
                  key: "overviewUrl",
                  get: function () {
                    return "".concat(this.url, "overview/");
                  },
                },
                {
                  key: "projectOverviewUrl",
                  get: function () {
                    return "".concat(this.url, "project-overview/");
                  },
                },
                {
                  key: "tasksCompletionUrl",
                  get: function () {
                    return "".concat(lr(this.id), "completed-tasks/");
                  },
                },
                {
                  key: "publishUrl",
                  get: function () {
                    return "".concat(this.url, "publish/");
                  },
                },
                {
                  key: "labCompletionUrl",
                  get: function () {
                    return ""
                      .concat(this.enrollPageUrl)
                      .concat(this.enrollment.id, "/");
                  },
                },
                {
                  key: "instructorSettingsUrl",
                  get: function () {
                    return "".concat(this.url, "settings/");
                  },
                },
                {
                  key: "verticalLabel",
                  get: function () {
                    var e;
                    return (this.vertical !== Ut.dk.web.key &&
                      this.vertical !== Ut.dk.devops.key) ||
                      !this.specName
                      ? null === (e = Ut.dk[this.vertical]) || void 0 === e
                        ? void 0
                        : e.label
                      : this.specName;
                  },
                },
                {
                  key: "activeTask",
                  get: function () {
                    return this.activeTaskNumber
                      ? this.tasks[this.activeTaskNumber - 1]
                      : null;
                  },
                },
                {
                  key: "firstIncompleteTaskNumber",
                  get: function () {
                    return (
                      this.tasks
                        .map(function (e) {
                          return e.isCompleted;
                        })
                        .indexOf(!1) + 1
                    );
                  },
                },
                {
                  key: "previousTasks",
                  get: function () {
                    return this.activeTaskNumber && this.activeTaskNumber > 1
                      ? this.tasks.slice(0, this.activeTaskNumber - 1).reverse()
                      : [];
                  },
                },
                {
                  key: "isPreviousResourcesPanelVisible",
                  get: function () {
                    return (
                      this.prevTaskPageUrl &&
                      this.previousTasks.some(function (e) {
                        return e.hasResources;
                      })
                    );
                  },
                },
                {
                  key: "tasksPageUrl",
                  get: function () {
                    return "".concat(this.url, "tasks/");
                  },
                },
                {
                  key: "resourcesPageUrl",
                  get: function () {
                    return "".concat(this.url, "resources/");
                  },
                },
                {
                  key: "nextTaskPageUrl",
                  get: function () {
                    return this.activeTaskNumber &&
                      this.activeTaskNumber < this.tasks.length
                      ? ""
                          .concat(this.tasksPageUrl)
                          .concat(this.activeTaskNumber + 1, "/")
                      : null;
                  },
                },
                {
                  key: "prevTaskPageUrl",
                  get: function () {
                    return this.activeTaskNumber && this.activeTaskNumber > 1
                      ? ""
                          .concat(this.tasksPageUrl)
                          .concat(this.activeTaskNumber - 1, "/")
                      : null;
                  },
                },
                {
                  key: "lastActiveTaskPageUrl",
                  get: function () {
                    return this.activeTaskNumber
                      ? ""
                          .concat(this.tasksPageUrl)
                          .concat(this.activeTaskNumber, "/")
                      : this.firstIncompleteTaskNumber
                      ? ""
                          .concat(this.tasksPageUrl)
                          .concat(this.firstIncompleteTaskNumber, "/")
                      : this.firstTaskUrl;
                  },
                },
                {
                  key: "enrollPageUrl",
                  get: function () {
                    return "".concat(lr(this.id), "enroll/");
                  },
                },
                {
                  key: "continueLabPageUrl",
                  get: function () {
                    return this.currentMode === Ut.bZ.STRUCTURED
                      ? this.lastActiveTaskPageUrl
                      : this.currentMode === Ut.bZ.FOLLOW_ALONG
                      ? this.tasksPageUrl
                      : this.projectOverviewUrl;
                  },
                },
                {
                  key: "completedTasksNumber",
                  get: function () {
                    return this.tasks.filter(function (e) {
                      return e.isCompleted;
                    }).length;
                  },
                },
                {
                  key: "shouldRedirectFromTasks",
                  get: function () {
                    return null !== this.activeTaskNumber && !this.activeTask;
                  },
                },
                {
                  key: "activeTaskReviewMessage",
                  get: function () {
                    if (!this.activeTaskNumber) return null;
                    if (1 === this.activeTaskNumber) return Ut.dD.first;
                    if (2 === this.activeTaskNumber) return Ut.dD.second;
                    if (this.activeTaskNumber === this.tasks.length)
                      return Ut.dD.last;
                    var e = (this.activeTaskNumber - 1 - 2) % Ut.dD.pool.length;
                    return Ut.dD.pool[e];
                  },
                },
                {
                  key: "newActiveTaskReviewMessage",
                  get: function () {
                    return this.activeTaskNumber
                      ? 1 === this.activeTaskNumber
                        ? Ut.Nw.first
                        : 2 === this.activeTaskNumber
                        ? Ut.Nw.second
                        : this.activeTaskNumber === this.tasks.length - 1
                        ? Ut.Nw.penultimate
                        : this.activeTaskNumber === this.tasks.length
                        ? Ut.Nw.last
                        : Ut.Nw.pool[
                            Math.floor(Math.random() * Ut.Nw.pool.length)
                          ]
                      : null;
                  },
                },
                {
                  key: "isCompleted",
                  get: function () {
                    var e;
                    return !!(null === (e = this.enrollment) || void 0 === e
                      ? void 0
                      : e.isCompleted);
                  },
                },
                {
                  key: "areTasksCompleted",
                  get: function () {
                    return this.tasks.length === this.completedTasksNumber;
                  },
                },
                {
                  key: "hasRunningInstance",
                  get: function () {
                    var e;
                    return (
                      (null === (e = this.myLatestInstance) || void 0 === e
                        ? void 0
                        : e.status) === Ut.cA.running
                    );
                  },
                },
                {
                  key: "isSavingInProgress",
                  get: function () {
                    return (
                      this.isSaving ||
                      this.tasks.some(function (e) {
                        return e.isSavingInProgress;
                      })
                    );
                  },
                },
                {
                  key: "isSavingError",
                  get: function () {
                    return (
                      this.apiError ||
                      this.tasks.some(function (e) {
                        return e.isSavingError;
                      })
                    );
                  },
                },
                {
                  key: "hasUnsavedChanges",
                  get: function () {
                    var e;
                    return (
                      Object.keys(this.changedData).length > 0 ||
                      (null === (e = this.labGoals) || void 0 === e
                        ? void 0
                        : e.isDirty)
                    );
                  },
                },
                {
                  key: "formErrors",
                  get: function () {
                    var e,
                      t,
                      r,
                      n,
                      i,
                      o,
                      a = {};
                    return (
                      ((null === (e = this.validationErrors) || void 0 === e
                        ? void 0
                        : e.min_estimated_time) ||
                        (null === (t = this.reviewError) || void 0 === t
                          ? void 0
                          : t.min_estimated_time)) &&
                        (a.min_estimated_time = gettext(
                          "Please enter a number between 45 and 180"
                        )),
                      ((null === (r = this.validationErrors) || void 0 === r
                        ? void 0
                        : r.max_estimated_time) ||
                        (null === (n = this.reviewError) || void 0 === n
                          ? void 0
                          : n.max_estimated_time)) &&
                        (a.max_estimated_time = gettext(
                          "Please enter a number between 45 and 180"
                        )),
                      ((null === (i = this.validationErrors) || void 0 === i
                        ? void 0
                        : i.min_max_estimated_time) ||
                        (null === (o = this.reviewError) || void 0 === o
                          ? void 0
                          : o.min_max_estimated_time)) &&
                        (a.max_estimated_time = gettext(
                          "Max estimated time should be greater than min estimated time"
                        )),
                      a
                    );
                  },
                },
                {
                  key: "hasAutomatedReviewTests",
                  get: function () {
                    var e;
                    return (
                      (null === (e = this.tasks) || void 0 === e
                        ? void 0
                        : e.length) > 0 &&
                      this.tasks.some(function (e) {
                        return e.hasAutomatedReviewTests;
                      })
                    );
                  },
                },
                {
                  key: "addTasksFromData",
                  value: function (e) {
                    var t,
                      r = this,
                      i = e.map(function (e) {
                        return new Fa(e, r);
                      });
                    (t = this.tasks).push.apply(t, (0, n.Z)(i));
                  },
                },
                {
                  key: "setActiveTaskNumber",
                  value: function (e) {
                    this.activeTaskNumber = e;
                  },
                },
                {
                  key: "setIsLoading",
                  value: function (e) {
                    this.isLoading = e;
                  },
                },
                {
                  key: "setStatus",
                  value: function (e) {
                    this.status = e;
                  },
                },
                {
                  key: "setEnrollmentFromData",
                  value: function (e) {
                    this.enrollment
                      ? this.enrollment.setDataFromAPI(e)
                      : (this.enrollment = new Tn(e, this));
                  },
                },
                {
                  key: "setLabInstanceFromData",
                  value: function (e) {
                    this.myLatestInstance
                      ? this.myLatestInstance.setDataFromAPI(e)
                      : (this.myLatestInstance = new Mn(e, this));
                  },
                },
                {
                  key: "setInstructorHasLabFromData",
                  value: function (e) {
                    this.instructorHasLab
                      ? this.instructorHasLab.setDataFromAPI(e)
                      : (this.instructorHasLab = new nn(e));
                  },
                },
                {
                  key: "setVisibleInstructors",
                  value: function (e) {
                    var t,
                      r = e.map(function (e) {
                        return new ar(e);
                      });
                    (t = this.visibleInstructors).push.apply(t, (0, n.Z)(r));
                  },
                },
                {
                  key: "isStudent",
                  get: function () {
                    return this.me.organization.isStudent;
                  },
                },
                {
                  key: "isAssigned",
                  get: function () {
                    return null !== this.assignment;
                  },
                },
                {
                  key: "assignmentDueDate",
                  get: function () {
                    var e;
                    return null === (e = this.assignment) || void 0 === e
                      ? void 0
                      : e.due_date;
                  },
                },
                {
                  key: "setVerticalAndTemplateFields",
                  value: function (e, t) {
                    (this.formData.vertical = e), (this.formData.template = t);
                  },
                },
                {
                  key: "setEditMode",
                  value: function () {
                    this.isEditMode = !0;
                  },
                },
                {
                  key: "setWorkspaceEnabledLectures",
                  value: function (e) {
                    var t,
                      r = this,
                      i = e
                        .map(function (e) {
                          return new Rr(e, r);
                        })
                        .map(function (e) {
                          return e.curriculumItemId;
                        });
                    (t = this.workspaceEnabledLectures).push.apply(
                      t,
                      (0, n.Z)(i)
                    );
                  },
                },
                {
                  key: "_onLabGoalsChange",
                  value: function () {
                    this.reviewError &&
                      (delete this.reviewError.what_you_will_learn,
                      delete this.reviewError.what_you_will_do,
                      delete this.validationErrors.what_you_will_learn,
                      delete this.validationErrors.what_you_will_do),
                      this._autoSave();
                  },
                },
                {
                  key: "_executeUpdate",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e() {
                        var t, r, n, i;
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (n = this.changedData),
                                    (null === (t = this.labGoals) ||
                                    void 0 === t
                                      ? void 0
                                      : t.isDirty) &&
                                      (n = Va(
                                        Va({}, this.changedData),
                                        this.labGoals.prepareFormData()
                                      )),
                                    (e.next = 4),
                                    cr.ZP.patch(this.resourceUrl, n)
                                  );
                                case 4:
                                  (i = e.sent),
                                    this.setDataFromAPI(i.data),
                                    null === (r = this.labGoals) ||
                                      void 0 === r ||
                                      r.setDirty(!1);
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
                  key: "createTask",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e() {
                        var t;
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    this._setSaving(!0),
                                    (e.prev = 1),
                                    (e.next = 4),
                                    cr.ZP.post(dr(this.id), {})
                                  );
                                case 4:
                                  (t = e.sent),
                                    this.insertTaskFromData(t.data),
                                    (e.next = 12);
                                  break;
                                case 8:
                                  throw (
                                    ((e.prev = 8),
                                    (e.t0 = e.catch(1)),
                                    _.c.captureException(e.t0),
                                    e.t0)
                                  );
                                case 12:
                                  return (
                                    (e.prev = 12),
                                    this._setSaving(!1),
                                    e.finish(12)
                                  );
                                case 15:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[1, 8, 12, 15]]
                        );
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "insertTaskFromData",
                  value: function (e) {
                    this.tasks.push(new Fa(e, this));
                  },
                },
                {
                  key: "_setReviewError",
                  value: function (e) {
                    this.reviewError = e;
                  },
                },
                {
                  key: "setFormField",
                  value: function (e, t) {
                    return (
                      this.reviewError &&
                        this.editableFieldsMap.has(e) &&
                        delete this.reviewError[this.editableFieldsMap.get(e)],
                      (0, Jt.Z)(
                        (0, u.Z)(r.prototype),
                        "setFormField",
                        this
                      ).call(this, e, t)
                    );
                  },
                },
                {
                  key: "_setInitialCodeFromData",
                  value: function (e) {
                    this.initialCode = e ? new yo(e, this) : null;
                  },
                },
                {
                  key: "createInitialCodeResource",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e(t) {
                        var r;
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    this._setSaving(!0),
                                    (e.prev = 1),
                                    (e.next = 4),
                                    cr.ZP.post(this.resourcesUrl, {
                                      type: Ut.I,
                                      asset: t,
                                    })
                                  );
                                case 4:
                                  (r = e.sent),
                                    this._setInitialCodeFromData(r.data),
                                    (e.next = 12);
                                  break;
                                case 8:
                                  throw (
                                    ((e.prev = 8),
                                    (e.t0 = e.catch(1)),
                                    _.c.captureException(e.t0),
                                    e.t0)
                                  );
                                case 12:
                                  return (
                                    (e.prev = 12),
                                    this._setSaving(!1),
                                    e.finish(12)
                                  );
                                case 15:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[1, 8, 12, 15]]
                        );
                      })
                    );
                    return function (t) {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "reorderTask",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e(t, r) {
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    this._setSaving(!0),
                                    (e.prev = 1),
                                    (e.next = 4),
                                    cr.ZP.post(
                                      ""
                                        .concat(dr(this.id))
                                        .concat(this.tasks[t].id, "/reorder/"),
                                      { position: r }
                                    )
                                  );
                                case 4:
                                  this._reorderTasks(t, r), (e.next = 10);
                                  break;
                                case 7:
                                  (e.prev = 7),
                                    (e.t0 = e.catch(1)),
                                    _.c.captureException(e.t0);
                                case 10:
                                  return (
                                    (e.prev = 10),
                                    this._setSaving(!1),
                                    e.finish(10)
                                  );
                                case 13:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[1, 7, 10, 13]]
                        );
                      })
                    );
                    return function (t, r) {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "_reorderTasks",
                  value: function (e, t) {
                    this.tasks.splice(t, 0, this.tasks.splice(e, 1)[0]);
                  },
                },
                {
                  key: "setNumberOfClicksReviewButton",
                  value: function () {
                    this.numberOfClicksReviewButton += 1;
                  },
                },
                {
                  key: "resetLabResults",
                  value: function () {
                    var e,
                      t = this;
                    null === (e = this.tasks) ||
                      void 0 === e ||
                      e.forEach(function (e) {
                        e.automatedReviewTestRun &&
                          (e.automatedReviewTestRun.setResults([]),
                          (e.automatedReviewTestRun.numberOfAttempts = 0)),
                          e.setShouldShowTaskReviewMessage(!1),
                          (t.numberOfClicksReviewButton = 0),
                          e.setPanelExpanded(!1),
                          e.removeCompletionData(),
                          t.setActiveTaskNumber(1);
                      });
                  },
                },
              ]),
              r
            );
          })(Kr)),
          (ra = (0, Re.Z)(ta.prototype, "id", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (na = (0, Re.Z)(ta.prototype, "title", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (ia = (0, Re.Z)(ta.prototype, "labId", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (oa = (0, Re.Z)(ta.prototype, "tasks", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (aa = (0, Re.Z)(ta.prototype, "activeTaskNumber", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (sa = (0, Re.Z)(ta.prototype, "isLoading", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (ca = (0, Re.Z)(ta.prototype, "labOverview", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (ua = (0, Re.Z)(ta.prototype, "challengeOverview", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (la = (0, Re.Z)(ta.prototype, "projectOverview", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (pa = (0, Re.Z)(ta.prototype, "minEstimatedTime", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return 0;
            },
          })),
          (da = (0, Re.Z)(ta.prototype, "maxEstimatedTime", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return 0;
            },
          })),
          (fa = (0, Re.Z)(ta.prototype, "provider", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (ha = (0, Re.Z)(ta.prototype, "vertical", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (ya = (0, Re.Z)(ta.prototype, "template", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (ma = (0, Re.Z)(ta.prototype, "status", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (ba = (0, Re.Z)(ta.prototype, "initialCode", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (va = (0, Re.Z)(ta.prototype, "labType", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (ga = (0, Re.Z)(ta.prototype, "myLatestInstance", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (_a = (0, Re.Z)(ta.prototype, "owner", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Oa = (0, Re.Z)(ta.prototype, "enrollment", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (wa = (0, Re.Z)(ta.prototype, "assignment", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (ka = (0, Re.Z)(ta.prototype, "labGoals", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (xa = (0, Re.Z)(ta.prototype, "isEditMode", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (Pa = (0, Re.Z)(ta.prototype, "workspaceEnabledLectures", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (ja = (0, Re.Z)(ta.prototype, "reviewError", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Za = (0, Re.Z)(ta.prototype, "isLaunchDisabled", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (Ra = (0, Re.Z)(ta.prototype, "labTakingUrl", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Ta = (0, Re.Z)(ta.prototype, "instructorHasLab", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Ea = (0, Re.Z)(ta.prototype, "visibleInstructors", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (Ia = (0, Re.Z)(ta.prototype, "topics", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (Ca = (0, Re.Z)(ta.prototype, "titleAutoslug", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Sa = (0, Re.Z)(ta.prototype, "spec", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Da = (0, Re.Z)(ta.prototype, "specName", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Aa = (0, Re.Z)(ta.prototype, "numberOfClicksReviewButton", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return 0;
            },
          })),
          (La = (0, Re.Z)(ta.prototype, "whatYouWillDo", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Na = (0, Re.Z)(ta.prototype, "whatYouWillLearn", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Ua = (0, Re.Z)(ta.prototype, "requirements", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Ma = (0, Re.Z)(ta.prototype, "course", [ea], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (0, Re.Z)(
            ta.prototype,
            "isInReview",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "isInReview"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "isDraft",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "isDraft"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "isPublished",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "isPublished"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "isBeta",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "isBeta"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "currentMode",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "currentMode"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "url",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "url"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "assetsUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "assetsUrl"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "firstTaskUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "firstTaskUrl"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "overviewUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "overviewUrl"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "projectOverviewUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "projectOverviewUrl"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "tasksCompletionUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "tasksCompletionUrl"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "publishUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "publishUrl"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "labCompletionUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "labCompletionUrl"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "instructorSettingsUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "instructorSettingsUrl"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "verticalLabel",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "verticalLabel"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "activeTask",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "activeTask"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "firstIncompleteTaskNumber",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "firstIncompleteTaskNumber"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "previousTasks",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "previousTasks"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "isPreviousResourcesPanelVisible",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "isPreviousResourcesPanelVisible"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "tasksPageUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "tasksPageUrl"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "resourcesPageUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "resourcesPageUrl"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "nextTaskPageUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "nextTaskPageUrl"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "prevTaskPageUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "prevTaskPageUrl"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "lastActiveTaskPageUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "lastActiveTaskPageUrl"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "enrollPageUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "enrollPageUrl"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "continueLabPageUrl",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "continueLabPageUrl"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "completedTasksNumber",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "completedTasksNumber"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "shouldRedirectFromTasks",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "shouldRedirectFromTasks"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "activeTaskReviewMessage",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "activeTaskReviewMessage"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "newActiveTaskReviewMessage",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "newActiveTaskReviewMessage"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "isCompleted",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "isCompleted"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "areTasksCompleted",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "areTasksCompleted"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "hasRunningInstance",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "hasRunningInstance"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "isSavingInProgress",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "isSavingInProgress"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "isSavingError",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "isSavingError"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "hasUnsavedChanges",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "hasUnsavedChanges"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "formErrors",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "formErrors"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "hasAutomatedReviewTests",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "hasAutomatedReviewTests"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "addTasksFromData",
            [Te.aD],
            Object.getOwnPropertyDescriptor(ta.prototype, "addTasksFromData"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "setActiveTaskNumber",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "setActiveTaskNumber"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "setIsLoading",
            [Te.aD],
            Object.getOwnPropertyDescriptor(ta.prototype, "setIsLoading"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "setStatus",
            [Te.aD],
            Object.getOwnPropertyDescriptor(ta.prototype, "setStatus"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "setEnrollmentFromData",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "setEnrollmentFromData"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "setLabInstanceFromData",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "setLabInstanceFromData"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "setInstructorHasLabFromData",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "setInstructorHasLabFromData"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "setVisibleInstructors",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "setVisibleInstructors"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "isAssigned",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "isAssigned"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "assignmentDueDate",
            [Te.Fl],
            Object.getOwnPropertyDescriptor(ta.prototype, "assignmentDueDate"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "setVerticalAndTemplateFields",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "setVerticalAndTemplateFields"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "insertTaskFromData",
            [Te.aD],
            Object.getOwnPropertyDescriptor(ta.prototype, "insertTaskFromData"),
            ta.prototype
          ),
          (Ba = (0, Re.Z)(ta.prototype, "deleteTaskAt", [Te.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                e.tasks.splice(t, 1);
              };
            },
          })),
          (0, Re.Z)(
            ta.prototype,
            "_setReviewError",
            [Te.aD],
            Object.getOwnPropertyDescriptor(ta.prototype, "_setReviewError"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "setFormField",
            [Te.aD],
            Object.getOwnPropertyDescriptor(ta.prototype, "setFormField"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "_setInitialCodeFromData",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "_setInitialCodeFromData"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "_reorderTasks",
            [Te.aD],
            Object.getOwnPropertyDescriptor(ta.prototype, "_reorderTasks"),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "setNumberOfClicksReviewButton",
            [Te.aD],
            Object.getOwnPropertyDescriptor(
              ta.prototype,
              "setNumberOfClicksReviewButton"
            ),
            ta.prototype
          ),
          (0, Re.Z)(
            ta.prototype,
            "resetLabResults",
            [Te.aD],
            Object.getOwnPropertyDescriptor(ta.prototype, "resetLabResults"),
            ta.prototype
          ),
          ta);
      r(72402);
      function Ka(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var qa = new Set();
      var Ya = (function (e) {
          (0, s.Z)(r, e);
          var t = Ka(r);
          function r(e) {
            var n,
              i = e.id,
              a = e.type,
              s = e.trackingId,
              c = e.searchTrackingId;
            return (
              (0, o.Z)(this, r),
              ((n = t.call(this, "SearchImpressionEvent")).id = void 0),
              (n.type = void 0),
              (n.trackingId = void 0),
              (n.searchTrackingId = void 0),
              (n.id = i),
              (n.type = a),
              (n.trackingId = s),
              (n.searchTrackingId = c),
              n
            );
          }
          return (0, a.Z)(r);
        })(I.rp),
        Qa = r(80799),
        Ja = r.n(Qa);
      function Xa(e, t) {
        var r =
          ("undefined" !== typeof Symbol && e[Symbol.iterator]) ||
          e["@@iterator"];
        if (!r) {
          if (
            Array.isArray(e) ||
            (r = (function (e, t) {
              if (!e) return;
              if ("string" === typeof e) return $a(e, t);
              var r = Object.prototype.toString.call(e).slice(8, -1);
              "Object" === r && e.constructor && (r = e.constructor.name);
              if ("Map" === r || "Set" === r) return Array.from(e);
              if (
                "Arguments" === r ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
              )
                return $a(e, t);
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
          a = !0,
          s = !1;
        return {
          s: function () {
            r = r.call(e);
          },
          n: function () {
            var e = r.next();
            return (a = e.done), e;
          },
          e: function (e) {
            (s = !0), (o = e);
          },
          f: function () {
            try {
              a || null == r.return || r.return();
            } finally {
              if (s) throw o;
            }
          },
        };
      }
      function $a(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n;
      }
      var es = function (e) {
          return (0, w.jsx)(R.H, {
            trackFunc: function () {
              var t,
                r = e.lab.id,
                n =
                  null === (t = e.lab.metadata) || void 0 === t
                    ? void 0
                    : t.trackingId,
                i = e.searchResultSetTrackingId;
              n &&
                i &&
                (function (e, t) {
                  var r = e.tracking_id;
                  qa.has(r) ||
                    (qa.add(r),
                    Z.j.publishEvent(
                      new Ya({
                        id: e.id,
                        type: "lab",
                        trackingId: e.tracking_id,
                        searchTrackingId: t,
                      })
                    ));
                })({ id: parseInt(r, 10), tracking_id: n }, i);
            },
            visibilityThreshold: 0.5,
            children: (0, w.jsx)("div", {
              children: (0, w.jsx)(ts, {
                lab: e.lab,
                handleClick: function () {
                  var t;
                  Lt({
                    courseId: e.sourceCourseId,
                    labId: parseInt(e.lab.id, 10),
                    trackingId:
                      null === (t = e.lab.metadata) || void 0 === t
                        ? void 0
                        : t.trackingId,
                    uiRegion: e.uiRegion,
                    sourcePageId: e.sourcePageId,
                    sourcePageType: e.sourcePageType,
                  });
                },
                fromPage: e.fromPage,
                popoverTrigger: e.popoverTrigger,
                className: e.className,
                hideEstimatedTime: e.hideEstimatedTime,
              }),
            }),
          });
        },
        ts = function (e) {
          var t,
            r = (0, p.QT)(),
            n = r.gettext,
            i = r.interpolate,
            o = (0, f.gL)().request,
            a = e.lab,
            s = a.id,
            c = a.title,
            u = a.minEstimatedTime,
            l = a.maxEstimatedTime,
            d = a.visibleInstructors,
            h = a.vertical,
            m = a.verticalLabel,
            b = a.isBeta,
            v = void 0 !== b && b,
            g = a.isCompleted,
            _ = a.hasRunningInstance,
            O = void 0 !== _ && _,
            k = a.topics,
            P = a.titleAutoslug,
            j = u,
            Z = l;
          e.fromPage === Ut.nF && ((j = u / 60), (Z = l / 60));
          var R = (function () {
              if (k && k.length > 0) {
                var e,
                  t = Xa(k);
                try {
                  for (t.s(); !(e = t.n()).done; ) {
                    var r = e.value.id,
                      n = Ut.LY[r];
                    if (n) return n;
                  }
                } catch (i) {
                  t.e(i);
                } finally {
                  t.f();
                }
              }
              return "";
            })(),
            T = Ut.dk[null !== h && void 0 !== h ? h : R],
            E = (function (e) {
              var t;
              return null ===
                (t = Object.values(Ut.dk).find(function (t) {
                  return t.key === e;
                })) || void 0 === t
                ? void 0
                : t.iconComponent;
            })(null !== h && void 0 !== h ? h : R),
            I = P ? "/labs/".concat(P, "/overview/") : "/labs/".concat(s, "/"),
            C = (0, x.ag)("mobile-max"),
            S = v || Wa(R),
            D =
              S &&
              (null === (t = e.className) || void 0 === t
                ? void 0
                : t.includes("lab-card-short"));
          return (0, w.jsxs)("a", {
            href: I,
            onClick: e.handleClick,
            "data-purpose": "lab-card-link",
            className: Ja()["lab-card-container"],
            children: [
              (0, w.jsx)(Yt, {}),
              (0, w.jsxs)("div", {
                className: y()(e.className, Ja()["lab-info"]),
                children: [
                  (0, w.jsx)("h3", {
                    id: "lab-heading-".concat(s),
                    "data-purpose": "lab-title-url",
                    className: y()(
                      "ud-heading-md",
                      D ? Ja()["title-one-liner"] : Ja().title
                    ),
                    children: c,
                  }),
                  (0, w.jsxs)("div", {
                    children: [
                      S && (0, w.jsx)("div", { children: (0, w.jsx)(Ft, {}) }),
                      (0, w.jsxs)("div", {
                        className: y()(
                          "ud-text-xs",
                          Ja()["info-completion-time"]
                        ),
                        children: [
                          T &&
                            (0, w.jsxs)(w.Fragment, {
                              children: [
                                (0, w.jsx)(E, {
                                  label: !1,
                                  className: Ja()["info-icon"],
                                  glyph: T.glyph,
                                }),
                                (0, w.jsx)("span", {
                                  className: Ja()["info-content"],
                                  "data-purpose": "vertical",
                                  children:
                                    null !== m && void 0 !== m ? m : T.label,
                                }),
                              ],
                            }),
                          !e.hideEstimatedTime &&
                            (0, w.jsxs)(w.Fragment, {
                              children: [
                                (0, w.jsx)(Ct(), {
                                  label: !1,
                                  className: Ja()["info-icon"],
                                }),
                                (0, w.jsxs)("span", {
                                  className: Ja()["info-content"],
                                  "data-purpose": "estimated-time",
                                  children: [
                                    (0, w.jsx)(St.n, {
                                      numSeconds: 60 * j,
                                      precision: St.n.PRECISION.MINUTES,
                                      presentationStyle: St.n.STYLE.HUMAN,
                                    }),
                                    "-",
                                    (0, w.jsx)(St.n, {
                                      numSeconds: 60 * Z,
                                      precision: St.n.PRECISION.MINUTES,
                                      presentationStyle: St.n.STYLE.HUMAN,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                        ],
                      }),
                      (0, w.jsx)("div", {
                        className: y()("ud-text-xs", Ja()["lab-owner"]),
                        "data-purpose": "lab-owner",
                        children: i(
                          n("By %(title)s"),
                          {
                            title:
                              null === d || void 0 === d
                                ? void 0
                                : d
                                    .map(function (e) {
                                      return e.title;
                                    })
                                    .join(", "),
                          },
                          !0
                        ),
                      }),
                      g
                        ? (0, w.jsx)("p", {
                            className: Ja()["completion-date"],
                            "data-purpose": "completion-date",
                            children: i(
                              n("Completed %(completionDate)s"),
                              { completionDate: Nt(e.lab, { request: o }) },
                              !0
                            ),
                          })
                        : (0, w.jsx)(Ht, {
                            hasRunningInstance: null !== O && void 0 !== O && O,
                            size: "small",
                            labId: s,
                            isMobile: !!C,
                          }),
                      e.popoverTrigger &&
                        (0, w.jsx)("div", {
                          className: Ja()["popover-button"],
                          children: e.popoverTrigger,
                        }),
                    ],
                  }),
                ],
              }),
            ],
          });
        },
        rs = r(36526),
        ns = r(62259),
        is = r.n(ns),
        os = r(54742),
        as = r(40836),
        ss = r(85772),
        cs = r(94288),
        us = r.n(cs),
        ls = ["className"];
      function ps(e, t) {
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
      function ds(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var fs = function (e) {
          var t = e.details;
          return (0, w.jsx)(os.W, {
            size: "small",
            padding: "tight",
            children: t.map(function (e, t) {
              return (0,
              w.jsx)(os.W.Item, { icon: (0, w.jsx)(is(), { label: !1, color: "neutral" }), "data-purpose": "quick-view-box-lab-details", children: e }, t);
            }),
          });
        },
        hs = (function (e) {
          (0, s.Z)(r, e);
          var t = ds(r);
          function r() {
            var e;
            (0, o.Z)(this, r);
            for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++)
              i[a] = arguments[a];
            return (
              ((e = t.call.apply(t, [this].concat(i))).popoverRef =
                b.createRef()),
              (e.triggerButtonId = (0, on.Ki)("trigger-button")),
              (e.onCloseButtonClick = function () {
                var t, r, n;
                null === (t = e.popoverRef.current) ||
                  void 0 === t ||
                  null === (r = t.ref.current) ||
                  void 0 === r ||
                  r.onClose(),
                  null === (n = document.getElementById(e.triggerButtonId)) ||
                    void 0 === n ||
                    n.focus();
              }),
              (e.onTriggerButtonClick = function (t) {
                var r, n;
                null === (r = e.popoverRef.current) ||
                  void 0 === r ||
                  null === (n = r.ref.current) ||
                  void 0 === n ||
                  n.onFocusOpen(t.currentTarget),
                  t.preventDefault();
              }),
              (e.getTabOrder = function (t) {
                var r = t.findTriggerNode,
                  n = t.findFirstFocusableInContent,
                  i = t.findLastFocusableInContent,
                  o = document.getElementById(e.triggerButtonId);
                return [
                  [r, n],
                  [
                    function () {
                      return document.activeElement === o ? o : null;
                    },
                    n,
                  ],
                  [
                    i,
                    function () {
                      var t,
                        n,
                        i = r();
                      if (
                        (null === (t = e.popoverRef.current) ||
                        void 0 === t ||
                        null === (n = t.ref.current) ||
                        void 0 === n
                          ? void 0
                          : n.isOpen) &&
                        i
                      ) {
                        var o = (0, rs.W)(i),
                          a = o[o.length - 1],
                          s = (0, rs.W)(document.documentElement),
                          c = s.findIndex(function (e) {
                            return e === a;
                          });
                        return -1 === c
                          ? null
                          : c === s.length - 1
                          ? s[0]
                          : s[c + 1];
                      }
                    },
                  ],
                ];
              }),
              (e.trackQuickViewBoxOpenEvent = function () {
                var t;
                e.props.preventQuickViewBoxOpenEvent ||
                  Z.j.publishEvent(
                    new Ee.Pf({
                      id: parseInt(e.props.lab.id, 10),
                      trackingId:
                        null === (t = e.props.lab.metadata) || void 0 === t
                          ? void 0
                          : t.trackingId,
                      type: "lab",
                    })
                  );
              }),
              (e.trackCTAClick = function () {
                var t;
                Lt({
                  courseId: e.props.sourceCourseId,
                  labId: parseInt(e.props.lab.id, 10),
                  trackingId:
                    null === (t = e.props.lab.metadata) || void 0 === t
                      ? void 0
                      : t.trackingId,
                  uiRegion: Pe.n.QUICK_PREVIEW,
                  sourcePageId: e.props.sourcePageId,
                  sourcePageType: e.props.sourcePageType,
                });
              }),
              e
            );
          }
          return (
            (0, a.Z)(r, [
              {
                key: "renderContent",
                value: function (e) {
                  var t = e.className,
                    r = (0, he.Z)(e, ls);
                  return (0, as.Ej)(
                    (function (e) {
                      for (var t = 1; t < arguments.length; t++) {
                        var r = null != arguments[t] ? arguments[t] : {};
                        t % 2
                          ? ps(Object(r), !0).forEach(function (t) {
                              (0, i.Z)(e, t, r[t]);
                            })
                          : Object.getOwnPropertyDescriptors
                          ? Object.defineProperties(
                              e,
                              Object.getOwnPropertyDescriptors(r)
                            )
                          : ps(Object(r)).forEach(function (t) {
                              Object.defineProperty(
                                e,
                                t,
                                Object.getOwnPropertyDescriptor(r, t)
                              );
                            });
                      }
                      return e;
                    })({ className: y()(t, us()["popover-wrapper"]) }, r)
                  );
                },
              },
              {
                key: "getLabCard",
                value: function (e) {
                  var t = this.props.gettext,
                    r = b.Children.only(this.props.labCard);
                  return b.cloneElement(r, {
                    popoverTrigger: (0, w.jsx)(P.zx, {
                      className: y()(
                        "ud-link-underline",
                        us()["popover-interaction-btn"]
                      ),
                      typography: "ud-heading-xs",
                      "data-purpose": "open-lab-details-popover",
                      udStyle: "link-underline",
                      size: "xsmall",
                      id: e,
                      onClick: this.onTriggerButtonClick,
                      children: (0, w.jsx)("span", {
                        children: t("Show lab details"),
                      }),
                    }),
                  });
                },
              },
              {
                key: "render",
                value: function () {
                  var e = this.props.gettext;
                  if (!this.props.showQuickViewBox) return this.props.labCard;
                  var t = this.props.lab,
                    r = t.activities,
                    n = t.id,
                    i = t.titleAutoslug,
                    o = t.whatYouWillDo,
                    a =
                      null !== r && void 0 !== r
                        ? r
                        : null === o || void 0 === o
                        ? void 0
                        : o.items,
                    s = i
                      ? "/labs/".concat(i, "/overview/")
                      : "/labs/".concat(n, "/"),
                    c = (0, w.jsxs)("div", {
                      "data-purpose": "lab-details-content",
                      children: [
                        (null === a || void 0 === a ? void 0 : a.length)
                          ? (0, w.jsxs)(w.Fragment, {
                              children: [
                                (0, w.jsx)("h2", {
                                  className: y()(
                                    "ud-heading-lg",
                                    us()["content-header"]
                                  ),
                                  children: e("What you\u2019ll do:"),
                                }),
                                (0, w.jsx)("div", {
                                  className: y()("ud-text-sm", us().details),
                                  children: (0, w.jsx)(fs, { details: a }),
                                }),
                              ],
                            })
                          : (0, w.jsxs)(w.Fragment, {
                              children: [
                                (0, w.jsx)("h2", {
                                  className: y()(
                                    "ud-heading-lg",
                                    us()["content-header"]
                                  ),
                                  children: e(
                                    "See more details on the lab page"
                                  ),
                                }),
                                (0, w.jsx)("div", {
                                  className: y()("ud-text-sm", us().details),
                                  "data-purpose": "learn-more",
                                  children: e(
                                    "Click on the lab card to learn more."
                                  ),
                                }),
                              ],
                            }),
                        (0, w.jsx)("div", {
                          className: us().cta,
                          children: (0, w.jsx)("div", {
                            className: us()["practice-this-lab"],
                            children: (0, w.jsx)(P.zx, {
                              componentClass: "a",
                              className: us()["cta-button"],
                              "data-purpose": "go-to-lab-button",
                              udStyle: "brand",
                              href: s,
                              onClick: this.trackCTAClick,
                              children: e("Practice this lab"),
                            }),
                          }),
                        }),
                        (0, w.jsx)(P.zx, {
                          className: y()(
                            "ud-link-underline",
                            us()["popover-interaction-btn"]
                          ),
                          "data-purpose": "close-lab-details-popover",
                          typography: "ud-heading-xs",
                          udStyle: "ghost",
                          size: "xsmall",
                          onClick: this.onCloseButtonClick,
                          children: (0, w.jsx)("span", {
                            children: e("Close dialog"),
                          }),
                        }),
                      ],
                    }),
                    u = (0, w.jsx)("div", {
                      "data-purpose": "lab-details-popover-trigger",
                      children: this.getLabCard(this.triggerButtonId),
                    });
                  return (0, w.jsx)(ss.J, {
                    placement: "top",
                    trigger: u,
                    canToggleOnHover: !0,
                    canOnlyToggleOnHover: !0,
                    detachFromTarget: !0,
                    toggleStrategy: "add-remove",
                    onFirstOpen: this.trackQuickViewBoxOpenEvent,
                    renderContent: this.renderContent,
                    ref: this.popoverRef,
                    getTabOrder: this.getTabOrder,
                    children: c,
                  });
                },
              },
            ]),
            r
          );
        })(b.Component);
      hs.defaultProps = {
        showQuickViewBox: !0,
        preventQuickViewBoxOpenEvent: !1,
      };
      var ys,
        ms = (0, p.GV)(hs),
        bs = r(57141),
        vs = r.n(bs),
        gs = function (e) {
          var t = e.title,
            r = e.subtitle,
            n = e.uiRegion,
            o = e.labs,
            a = e.hideEstimatedTime,
            s = e.isStandaloneUnit,
            c = void 0 !== s && s,
            u = e.sourcePageId,
            l = e.sourcePageType,
            d = (0, p.QT)().gettext,
            f = (0, x.ag)("mobile-max"),
            h = (0, x.ag)("(any-pointer: coarse)"),
            m = (0, x.ag)("(any-pointer: fine)"),
            b = (0, x.ag)("(any-hover: hover)"),
            v = n === At.k$.LABS_UNIT_LIHP,
            g = (0, w.jsx)(P.zx, {
              "data-purpose": "browse-all-labs-btn",
              udStyle: "link-underline",
              componentClass: "a",
              href: "/labs/listing/",
              className: y()(
                vs()["browse-button"],
                (0, i.Z)({}, vs()["is-standalone-unit"], c)
              ),
              children: d("Browse all labs"),
            });
          return (0, w.jsxs)("section", {
            className: y()("component-margin", vs()["lab-unit-container"]),
            children: [
              (0, w.jsx)("h2", {
                className: y()(
                  c
                    ? "ud-heading-serif-xl"
                    : v
                    ? "ud-heading-xl"
                    : "ud-heading-lg",
                  vs()["lab-unit-container"]
                ),
                "data-purpose": "lab-unit-title",
                children: t,
              }),
              (r || !c) &&
                (0, w.jsxs)("div", {
                  className: vs()["subtitle-button-wrapper"],
                  children: [
                    r &&
                      (0, w.jsx)("p", {
                        className: vs()["unit-subtitle"],
                        "data-purpose": "lab-unit-subtitle",
                        children: r,
                      }),
                    g,
                  ],
                }),
              (0, w.jsx)(j.l, {
                "data-purpose": "carousel",
                fullViewport: !!f,
                showPager: !!m,
                allowScroll: !!h,
                className: vs()["lab-carousel"],
                children:
                  null === o || void 0 === o
                    ? void 0
                    : o.map(function (e) {
                        return (0, w.jsx)(
                          R.H,
                          {
                            trackFunc: function () {
                              return (
                                (t = e.id),
                                void Z.j.publishEvent(
                                  new Dt.Iv({
                                    labId: t,
                                    uiRegion: n,
                                    sourcePageId: u,
                                    sourcePageType: l,
                                  })
                                )
                              );
                              var t;
                            },
                            children: (0, w.jsx)("div", {
                              children: (0, w.jsx)(
                                ms,
                                {
                                  lab: e,
                                  showQuickViewBox: !!b,
                                  preventQuickViewBoxOpenEvent: [
                                    At.k$.LABS_UNIT_LIHP,
                                    At.k$.LABS_UNIT_TOPIC,
                                  ].includes(n),
                                  sourcePageId: u,
                                  sourcePageType: l,
                                  labCard: (0, w.jsx)(es, {
                                    lab: e,
                                    uiRegion: n,
                                    className: "lab-card-short",
                                    hideEstimatedTime: a,
                                    sourcePageId: u,
                                    sourcePageType: l,
                                  }),
                                },
                                "lab-list-item-".concat(e.id)
                              ),
                            }),
                          },
                          e.id
                        );
                      }),
              }),
              g,
            ],
          });
        },
        _s = function (e) {
          var t = e.unit,
            r = e.title,
            n = e.subtitle,
            i = e.uiRegion,
            o = e.isStandaloneUnit,
            a = void 0 !== o && o,
            s = e.sourcePageId,
            c = e.sourcePageType,
            u = e.className,
            l = (0, f.gL)().me;
          if (!t.items.length) return (0, w.jsx)("div", {});
          var p = t.items.map(function (e) {
            return new Ga(e, { me: l });
          });
          return (0, w.jsx)(R.H, {
            trackFunc: function () {
              we.R.trackUnitView(t, t.item_type);
            },
            children: (0, w.jsx)("div", {
              "data-purpose": "lab-unit",
              className: u,
              children: (0, w.jsx)(gs, {
                labs: p,
                title: r,
                subtitle: n,
                uiRegion: i,
                hideEstimatedTime: !0,
                isStandaloneUnit: a,
                sourcePageId: s,
                sourcePageType: c,
              }),
            }),
          });
        },
        Os = function (e) {
          var t = e.cardProps;
          return (0, w.jsx)("div", {
            style: {
              backgroundImage: "url(".concat(
                t.lectureImage ? t.lectureImage : t.courseImage
              ),
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              display: "block",
            },
          });
        },
        ws = r(93630),
        ks = r.n(ws),
        xs = r(76185),
        Ps = r.n(xs),
        js = r(97154),
        Zs = r(97941),
        Rs = r(57514),
        Ts = r(45697),
        Es = r.n(Ts),
        Is = r(31169),
        Cs = r.n(Is),
        Ss = ["users", "alt", "maxDisplayItems"],
        Ds = ["users", "alt", "maxDisplayItems", "srcKey", "count"];
      function As(e, t) {
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
      function Ls(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? As(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : As(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function Ns(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      (ys = { id: Es().number, display_name: Es().string.isRequired }),
        (0, i.Z)(ys, Rs.k, Es().string),
        (0, i.Z)(ys, "initials", Es().string);
      var Us = (function (e) {
        (0, s.Z)(r, e);
        var t = Ns(r);
        function r() {
          var e;
          (0, o.Z)(this, r);
          for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++)
            i[a] = arguments[a];
          return (
            ((e = t.call.apply(t, [this].concat(i))).filterMaxUsersDisplay =
              function (t, r) {
                return r < e.props.maxDisplayItems;
              }),
            e
          );
        }
        return (
          (0, a.Z)(r, [
            {
              key: "users",
              get: function () {
                var e = this.props,
                  t = e.users,
                  r = e.alt,
                  n = (e.maxDisplayItems, (0, he.Z)(e, Ss));
                return t.filter(this.filterMaxUsersDisplay).map(function (e) {
                  return (0,
                  w.jsx)("div", { className: Cs()["avatar-wrapper"], "data-purpose": "avatar-wrapper", children: (0, w.jsx)(Rs.q, Ls({ className: Cs()["avatar-element"], user: e, alt: r }, n)) }, e.id);
                });
              },
            },
            {
              key: "count",
              get: function () {
                return this.props.count > 0
                  ? this.props.count
                  : this.props.users.length;
              },
            },
            {
              key: "allOtherUsersAvatar",
              get: function () {
                var e = this.props,
                  t = (e.users, e.alt),
                  r = e.maxDisplayItems,
                  n = (e.srcKey, e.count, (0, he.Z)(e, Ds));
                return (
                  this.count > r &&
                  (0, w.jsx)("div", {
                    className: Cs()["avatar-wrapper"],
                    "data-purpose": "avatar-wrapper-total",
                    children: (0, w.jsx)(
                      Rs.q,
                      Ls(
                        {
                          className: Cs()["avatar-element"],
                          user: {
                            id: 0,
                            image_75x75: "anonymous",
                            display_name: "",
                            initials: "+".concat(this.count - r),
                          },
                          alt: t,
                        },
                        n
                      )
                    ),
                  })
                );
              },
            },
            {
              key: "render",
              value: function () {
                return (0, w.jsxs)("div", {
                  className: Cs()["avatars-group"],
                  children: [this.users, this.allOtherUsersAvatar],
                });
              },
            },
          ]),
          r
        );
      })(b.Component);
      Us.defaultProps = {
        alt: "DISPLAY_NAME",
        srcKey: void 0,
        count: void 0,
        maxDisplayItems: 4,
      };
      var Ms = r(61406),
        Bs = r.n(Ms);
      function Fs(e, t) {
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
      function zs(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Fs(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Fs(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var Vs = function (e) {
          var t = e.lectureTitle,
            r = e.courseTitle,
            n = e.buttonProps,
            o = e.visibleInstructors,
            a = e.currentIndex,
            s = void 0 === a ? 0 : a,
            c = e.numOfLectures,
            u = e.ariaLive,
            l = e.isCompact,
            d = void 0 !== l && l,
            f = e.uiRegion,
            h = e.learnUrl,
            m = (0, p.QT)(),
            b = m.gettext,
            v = m.interpolate,
            g = m.ngettext,
            _ = h && {
              componentClass: "a",
              target: "_blank",
              rel: "noopener noreferrer",
              href: h,
            };
          return (0, w.jsxs)("div", {
            className: Bs().container,
            children: [
              (0, w.jsxs)(
                P.zx,
                zs(
                  zs(
                    { udStyle: "link", className: Bs()["lecture-detail"] },
                    null !== n && void 0 !== n ? n : _
                  ),
                  {},
                  {
                    children: [
                      (0, w.jsxs)("h4", {
                        className: y()(
                          "ud-heading-md",
                          (0, i.Z)({}, Bs()["lecture-title-compact"], d)
                        ),
                        "aria-live": u,
                        "data-purpose": "lecture-title",
                        children: [
                          "off" !== u &&
                            c &&
                            (0, w.jsx)("span", {
                              className: "ud-sr-only",
                              children: v(
                                b(
                                  "slide %(currentLectureIndex)s of %(numOfLectures)s"
                                ),
                                {
                                  currentLectureIndex: s + 1,
                                  numOfLectures: c,
                                },
                                !0
                              ),
                            }),
                          t,
                        ],
                      }),
                      !d &&
                        (0, w.jsx)("div", {
                          className: "ud-text-sm",
                          "data-purpose": "course-title",
                          children: r,
                        }),
                    ],
                  }
                )
              ),
              !d &&
                (function () {
                  if (o && 0 !== o.length)
                    return (0, w.jsxs)(Zs.qg, {
                      className: Bs()["instructor-container"],
                      "data-purpose": "instructors-unit",
                      children: [
                        (0, w.jsx)(Us, {
                          size: "small",
                          users: o,
                          srcKey: "image_100x100",
                          alt: "NONE",
                          maxDisplayItems: 2,
                        }),
                        (0, w.jsxs)("div", {
                          className: Bs()["instructor-name"],
                          children: [
                            (0, w.jsx)("span", {
                              className: "ud-sr-only",
                              children: g(
                                "Instructor:",
                                "Instructors:",
                                o.length
                              ),
                            }),
                            o.map(function (e, t) {
                              return (0, w.jsxs)(
                                "a",
                                {
                                  href: e.url,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  className: y()("ud-text-xs"),
                                  onClick: function () {
                                    return (function (e) {
                                      if (e.id) {
                                        var t = {
                                          instructorId: e.id,
                                          uiRegion: f,
                                        };
                                        Z.j.publishEvent(new Ee.Vg(t));
                                      }
                                    })(e);
                                  },
                                  "data-purpose": "instructor-link",
                                  children: [
                                    e.display_name,
                                    t !== o.length - 1 && ", ",
                                  ],
                                },
                                e.id
                              );
                            }),
                          ],
                        }),
                      ],
                    });
                })(),
            ],
          });
        },
        Hs = r(35088),
        Ws = r.n(Hs);
      function Gs(e, t) {
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
      function Ks(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Gs(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Gs(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var qs,
        Ys,
        Qs,
        Js,
        Xs = function (e) {
          var t = e.children,
            r = e.currentIndex,
            n = (0, b.useState)(r),
            i = n[0],
            o = n[1],
            a = (0, b.useState)(!1),
            s = a[0],
            c = a[1];
          (0, b.useEffect)(
            function () {
              r !== i &&
                (c(!0),
                setTimeout(function () {
                  o(r), c(!1);
                }, Number(js.T["animation-duration-fast"].replace("ms", ""))));
            },
            [i, r]
          );
          var u = b.Children.toArray(t)[r],
            l = b.Children.toArray(t)[i],
            p = b.Children.count(t);
          return (0, w.jsxs)("div", {
            className: Ws()["lecture-slide-container"],
            children: [
              (0, w.jsx)("div", {
                "data-purpose": "current",
                className: y()(
                  Ws()["lecture-item"],
                  Ws()["current-lecture"],
                  s ? Ws()["fade-in"] : ""
                ),
                children: (0, w.jsx)(
                  Vs,
                  Ks(Ks({}, u.props.detailProps), {}, { ariaLive: "off" })
                ),
              }),
              (0, w.jsx)("div", {
                "data-purpose": "prev",
                className: y()(Ws()["lecture-item"], s ? Ws()["fade-out"] : ""),
                children: (0, w.jsx)(
                  Vs,
                  Ks(
                    Ks({}, l.props.detailProps),
                    {},
                    { ariaLive: "assertive", currentIndex: r, numOfLectures: p }
                  )
                ),
              }),
            ],
          });
        },
        $s = r(67025),
        ec = r(71131),
        tc = r.n(ec),
        rc = r(75013),
        nc = r.n(rc),
        ic = function (e) {
          var t = e.completed,
            r = void 0 !== t && t,
            n = e.inProgress,
            i = void 0 !== n && n,
            o = e.duration,
            a = void 0 === o ? 600 : o,
            s = e.remainingTime,
            c = void 0 === s ? 600 : s,
            u = e.className,
            l = void 0 === u ? void 0 : u,
            d = (0, p.QT)().gettext;
          return (0, w.jsx)("div", {
            className: y()(nc()["stack-card-container"], l),
            children: (0, w.jsx)("span", {
              className: y()(nc()["stack-card-content"], "ud-heading-xs"),
              children: r
                ? (0, w.jsxs)(w.Fragment, {
                    children: [
                      (0, w.jsx)(is(), {
                        className: nc().icon,
                        size: "small",
                        label: d("Tick Icon"),
                      }),
                      (0, w.jsx)("span", {
                        className: nc()["stack-card-content-text"],
                        children: d("Watched"),
                      }),
                    ],
                  })
                : (0, w.jsxs)(w.Fragment, {
                    children: [
                      (0, w.jsx)(tc(), {
                        className: nc().icon,
                        size: "xsmall",
                        label: d("Lecture Length"),
                      }),
                      i
                        ? (0, w.jsx)(p.nj, {
                            className: nc()["stack-card-content-text"],
                            html: d(
                              '<span class="duration">%(duration)</span> left'
                            ),
                            interpolate: {
                              duration: (0, w.jsx)(St.n, {
                                numSeconds: Number(c),
                                presentationStyle: St.n.STYLE.HUMAN_COMPACT,
                              }),
                            },
                          })
                        : (0, w.jsx)(St.n, {
                            className: nc()["stack-card-content-text"],
                            numSeconds: Number(a),
                            presentationStyle: "timestamp",
                          }),
                    ],
                  }),
            }),
          });
        },
        oc = r(64590),
        ac = r.n(oc),
        sc = function (e) {
          var t = e.cardNumber,
            r = void 0 === t ? 0 : t,
            n = e.cardCount,
            i = void 0 === n ? 0 : n,
            o = (0, p.QT)(),
            a = o.gettext,
            s = o.interpolate;
          return (
            (r += 1),
            (0, w.jsx)("div", {
              className: ac()["stack-order-box"],
              children: (0, w.jsx)("div", {
                className: y()(ac()["stack-order-text"], "ud-heading-xs"),
                children: s(
                  a("%(cardNumber)s of %(cardCount)s"),
                  { cardNumber: r, cardCount: i },
                  !0
                ),
              }),
            })
          );
        },
        cc = r(22409),
        uc = r.n(cc),
        lc = function (e) {
          var t = e.cardNumber,
            r = e.cardCount,
            n = e.inProgress,
            i = e.completed,
            o = e.duration,
            a = e.remainingTime,
            s = e.percentComplete,
            c = (0, p.QT)().gettext,
            u = null !== i && void 0 !== i ? i : n;
          return (0, w.jsxs)("div", {
            className: uc()["card-info-container"],
            children: [
              (0, w.jsx)(sc, { cardNumber: t, cardCount: r }),
              (0, w.jsx)(ic, {
                inProgress: n,
                completed: i,
                duration: o,
                remainingTime: a,
              }),
              u &&
                (0, w.jsx)($s.Y, {
                  value: s,
                  min: 0,
                  max: 100,
                  label: c("%(percent)s% complete"),
                  className: uc()["card-progress-meter"],
                }),
            ],
          });
        },
        pc = r(5055),
        dc = r.n(pc),
        fc = function (e, t) {
          return e.currentIndex == t
            ? dc().first
            : e.nextIndex && e.nextIndex == t
            ? dc().second
            : e.thirdIndex && e.thirdIndex == t
            ? dc().third
            : e.currentIndex > t
            ? dc()["previous-card"]
            : dc().inactive;
        },
        hc = function (e) {
          var t = e.onCardChange,
            r = e.className,
            i = void 0 === r ? "" : r,
            o = e.cardClassName,
            a = void 0 === o ? "" : o,
            s = e.autoRotate,
            c = void 0 !== s && s,
            u = e.rotationInterval,
            l = void 0 === u ? 2e3 : u,
            d = e.children,
            f = (0, b.useState)({
              currentIndex: 0,
              nextIndex: 1,
              thirdIndex: 2,
            }),
            h = f[0],
            m = f[1],
            v = (0, b.useState)(new Set()),
            g = v[0],
            _ = v[1],
            O = (0, p.QT)(),
            k = O.gettext,
            x = O.interpolate,
            P = b.Children.count(d),
            j = (0, b.useCallback)(
              function () {
                m(function (e) {
                  return {
                    currentIndex: e.currentIndex + 1,
                    nextIndex: e.nextIndex + 1 >= P ? -1 : e.nextIndex + 1,
                    thirdIndex:
                      !e.thirdIndex || e.thirdIndex + 1 >= P
                        ? -1
                        : e.thirdIndex + 1,
                  };
                });
              },
              [P]
            ),
            T = (0, b.useCallback)(function () {
              m(function (e) {
                return {
                  currentIndex: e.currentIndex - 1,
                  nextIndex:
                    e.nextIndex && e.nextIndex > 0
                      ? e.nextIndex - 1
                      : e.currentIndex,
                  thirdIndex:
                    e.thirdIndex && e.thirdIndex > 0
                      ? e.thirdIndex - 1
                      : e.nextIndex,
                };
              });
            }, []);
          (0, b.useEffect)(
            function () {
              null === t || void 0 === t || t(h);
              var e = setInterval(function () {
                c && j();
              }, l);
              return function () {
                return clearInterval(e);
              };
            },
            [j, h, c, t, l]
          );
          return (0, w.jsxs)("div", {
            className: i,
            children: [
              (0, w.jsxs)("div", {
                className: dc().container,
                children: [
                  (0, w.jsx)(Me.h, {
                    onClick: T,
                    udStyle: "white-solid",
                    round: !0,
                    size: "medium",
                    className:
                      0 != h.currentIndex
                        ? dc()["prev-button"]
                        : dc()["prev-button-hidden"],
                    children: (0, w.jsx)(Ps(), {
                      label: k("Previous"),
                      size: "medium",
                    }),
                  }),
                  (0, w.jsx)(Me.h, {
                    onClick: j,
                    udStyle: "white-solid",
                    round: !0,
                    size: "medium",
                    className:
                      h.currentIndex != P - 1
                        ? dc()["next-button"]
                        : dc()["next-button-hidden"],
                    children: (0, w.jsx)(ks(), {
                      label: k("Next"),
                      size: "medium",
                    }),
                  }),
                  (0, w.jsx)("ul", {
                    role: "presentation",
                    className: y()(
                      dc()["card-carousel"],
                      dc()["carousel-default"],
                      "ud-unstyled-list"
                    ),
                    children: b.Children.map(d, function (e, t) {
                      var r,
                        i = e,
                        o = i.props.detailProps,
                        s = o.lectureCardId,
                        c = o.inProgress,
                        u = o.completed,
                        l = o.duration,
                        p = o.remainingTime,
                        d = void 0 === p ? 0 : p,
                        f = o.learnUrl,
                        m = o.lectureTitle,
                        b = u ? 100 : 100 - (d / l) * 100,
                        v =
                          ((r = i.props.detailProps),
                          {
                            backendSource: Ee.zK.DISCOVERY,
                            id: r.lectureCardId,
                            position: r.lecturePosition,
                            serveTrackingId: r.lectureServeTrackingId,
                            trackingId: r.lectureTrackingId,
                            uiRegion: r.uiRegion,
                          }),
                        O = (0, w.jsx)("a", {
                          href: f,
                          className: y()(
                            dc()["card-link"],
                            h.currentIndex !== t ? dc()["inactive-card"] : ""
                          ),
                          tabIndex: h.currentIndex === t ? 0 : -1,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          "aria-label": x(
                            k(
                              "Play Lecture %(lectureNumber)s: %(lectureTitle)s"
                            ),
                            { lectureNumber: t + 1, lectureTitle: m },
                            !0
                          ),
                          onClick: function () {
                            return (function (e) {
                              Z.j.publishEvent(new Ee.bU(e));
                            })(v);
                          },
                          children: e,
                        });
                      return (0, w.jsxs)(
                        "li",
                        {
                          className: y()(a, dc().card, fc(h, t)),
                          "aria-hidden": h.currentIndex !== t,
                          children: [
                            h.currentIndex != t || g.has(t)
                              ? O
                              : (0, w.jsx)(
                                  R.H,
                                  {
                                    trackFunc: function () {
                                      return (function (e, t) {
                                        _(function (e) {
                                          return new Set(
                                            [].concat((0, n.Z)(e), [t])
                                          );
                                        }),
                                          Z.j.publishEvent(new Ee.kI(e));
                                      })(v, t);
                                    },
                                    children: O,
                                  },
                                  "card-".concat(s)
                                ),
                            h.currentIndex == t &&
                              (0, w.jsx)(lc, {
                                cardNumber: t,
                                cardCount: P,
                                inProgress: c,
                                completed: u,
                                duration: l,
                                remainingTime: d,
                                percentComplete: b,
                              }),
                          ],
                        },
                        "card-".concat(s)
                      );
                    }),
                  }),
                ],
              }),
              (0, w.jsx)(Xs, { currentIndex: h.currentIndex, children: d }),
            ],
          });
        },
        yc = r(39991),
        mc = r.n(yc),
        bc = function (e) {
          var t = e.title,
            r = (0, p.QT)(),
            n = r.gettext,
            i = r.interpolate;
          return (0, w.jsx)("h2", {
            className: y()(
              "ud-heading-serif-xl",
              mc()["representative-topic-name"]
            ),
            children: i(n("Top lectures in %(title)s"), { title: t }, !0),
          });
        },
        vc = r(74425),
        gc = r.n(vc),
        _c = function (e) {
          var t = e.className,
            r = e.representativeTopicName,
            i = e.unit,
            o = (0, p.QT)(),
            a = o.gettext,
            s = o.interpolate;
          if (!i.items.length) return null;
          var c = [i.items].concat((0, n.Z)(i.secondary_items)),
            u = i.available_filters.units,
            l = function (e) {
              return (
                (0, we.q)(e),
                e.slice(0, 5).map(function (e, t) {
                  var r,
                    n,
                    i = e.course,
                    o = {
                      courseImage: i.image_304x171,
                      lectureImage:
                        null !== (r = e.image_320_H) && void 0 !== r ? r : "",
                      learnUrl: e.learn_url,
                    },
                    a = {
                      learnUrl: e.learn_url,
                      lectureCardId: e.id,
                      lectureTitle: e.title,
                      courseTitle: i.title,
                      visibleInstructors: i.visible_instructors,
                      lecturePosition: t,
                      lectureServeTrackingId: e.tracking_id,
                      lectureTrackingId:
                        null !== (n = e.frontendTrackingId) && void 0 !== n
                          ? n
                          : "",
                      inProgress: !1,
                      completed: !1,
                      duration: e.content_length,
                      currentIndex: 1,
                      numOfLectures: 5,
                      uiRegion: Pe.n.LECTURE_STACK,
                    };
                  return (0, w.jsx)(Os, { cardProps: o, detailProps: a }, e.id);
                })
              );
            };
          return (0, w.jsxs)("div", {
            className: y()(gc().wrapper, t),
            "data-purpose": "lecture-recommendation-unit",
            children: [
              (0, w.jsx)(bc, { title: r }),
              (0, w.jsx)("div", {
                className: y()(gc()["children-container"]),
                children: c.map(function (e, t) {
                  return (0,
                  w.jsxs)(b.Fragment, { children: [(0, w.jsx)("h3", { "aria-hidden": !0, className: y()(gc().title, "ud-heading-xl"), children: u[t].title }), (0, w.jsxs)("section", { "aria-label": s(a("%(topic)s top lectures carousel"), { topic: u[t].title }, !0), children: [(0, w.jsx)("h3", { className: y()(gc().title, "ud-heading-xl", "ud-sr-only"), children: u[t].title }), (0, w.jsx)(hc, { className: gc()["recos-child"], "data-purpose": "lecture-stack", children: l(e) })] }, t)] }, t);
                }),
              }),
            ],
          });
        },
        Oc = r(46067),
        wc = r(32160),
        kc = r(14556);
      function xc(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Pc =
          (0, m.f3)(function (e) {
            var t = e.trackingContext;
            return { trackingContext: void 0 === t ? {} : t };
          })(
            (qs =
              (0, m.Pi)(
                ((Ys = (function (e) {
                  (0, s.Z)(r, e);
                  var t = xc(r);
                  function r() {
                    var e;
                    (0, o.Z)(this, r);
                    for (
                      var n = arguments.length, i = new Array(n), a = 0;
                      a < n;
                      a++
                    )
                      i[a] = arguments[a];
                    return (
                      ((e = t.call.apply(t, [this].concat(i))).handleAction =
                        function () {
                          var t = e.props.lecture;
                          Z.j.publishEvent(
                            new Oc.Rd({
                              componentName: "recommendedLectureCard",
                              trackingId: t.frontendTrackingId,
                              relatedObjectType:
                                Oc.Rd.relatedObjectTypes.lecture,
                              relatedObjectId: t.id,
                            })
                          );
                        }),
                      (e.trackImpression = function () {
                        we.R.trackDiscoveryImpression(
                          { item: e.props.lecture },
                          {
                            backendSource:
                              e.props.trackingContext.backendSource,
                            index: e.props.index,
                          }
                        );
                      }),
                      e
                    );
                  }
                  return (
                    (0, a.Z)(r, [
                      {
                        key: "render",
                        value: function () {
                          var e = this.props,
                            t = e.lecture,
                            r = e.index,
                            n = e.isConsumerSubsSubscriber;
                          return t
                            ? (0, w.jsx)(R.H, {
                                trackFunc: this.trackImpression,
                                children: (0, w.jsx)("div", {
                                  children: (0, w.jsx)(kc.c, {
                                    data: t,
                                    showTopicTitle: !0,
                                    onAction: this.handleAction,
                                    index: r,
                                    trackingData: t,
                                    isConsumerSubsSubscriber: n,
                                  }),
                                }),
                              })
                            : null;
                        },
                      },
                    ]),
                    r
                  );
                })(b.Component)),
                (Ys.defaultProps = { isConsumerSubsSubscriber: !1 }),
                (qs = Ys))
              ) || qs)
          ) || qs,
        jc =
          (0, m.Pi)(
            ((Js = (function (e) {
              (0, s.Z)(r, e);
              var t = xc(r);
              function r() {
                var e;
                (0, o.Z)(this, r);
                for (
                  var n = arguments.length, i = new Array(n), a = 0;
                  a < n;
                  a++
                )
                  i[a] = arguments[a];
                return (
                  ((e = t.call.apply(
                    t,
                    [this].concat(i)
                  )).trackLectureImpression = function () {
                    e.props.unit.title &&
                      e.props.unit.item_type &&
                      we.R.trackUnitView(e.props.unit, e.props.unit.item_type);
                  }),
                  e
                );
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "renderLectures",
                    value: function () {
                      var e = this,
                        t = this.props.unit;
                      return (
                        (0, we.q)(t.items),
                        t.items.map(function (r, n) {
                          return (0,
                          w.jsx)(Pc, { unit: t, lecture: r, index: n, isConsumerSubsSubscriber: e.props.isConsumerSubsSubscriber }, r.id);
                        })
                      );
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      if (!this.props.unit.items) return null;
                      var e = this.props,
                        t = e.className,
                        r = e.showPager,
                        n = e.fullWidth;
                      return (0, w.jsx)(R.H, {
                        trackFunc: this.trackLectureImpression,
                        children: (0, w.jsxs)("div", {
                          className: t,
                          children: [
                            this.props.showTitle &&
                              (0, w.jsx)(wc.p, { unit: this.props.unit }),
                            (0, w.jsx)(j.l, {
                              showPager: r,
                              fullViewport: n,
                              children: this.renderLectures(),
                            }),
                          ],
                        }),
                      });
                    },
                  },
                ]),
                r
              );
            })(b.Component)),
            (Js.defaultProps = {
              showTitle: !1,
              showPager: !1,
              fullWidth: !1,
              className: void 0,
              isConsumerSubsSubscriber: !1,
            }),
            (Qs = Js))
          ) || Qs,
        Zc = r(82987),
        Rc = r.n(Zc),
        Tc = ["unit"];
      function Ec(e, t) {
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
      function Ic(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Ec(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Ec(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var Cc,
        Sc,
        Dc,
        Ac,
        Lc,
        Nc = function (e) {
          var t = e.unit,
            r = (0, he.Z)(e, Tc),
            n = (0, p.QT)().gettext,
            i = Ic(
              Ic({}, t),
              {},
              {
                available_filters: Ic(
                  Ic({}, t.available_filters),
                  {},
                  {
                    units: t.available_filters.course_labels.map(function (e) {
                      return Ic(
                        Ic({}, e),
                        {},
                        {
                          topic_url: e.url,
                          url: ""
                            .concat(t.url, "&f_label_id=")
                            .concat(e.value, "&page_size=6"),
                        }
                      );
                    }),
                  }
                ),
              }
            );
          return (0, w.jsx)(
            v.f,
            Ic(
              Ic({}, r),
              {},
              {
                unit: i,
                renderUnitCta: function (e) {
                  return (0, w.jsx)(P.zx, {
                    href: e.topic_url,
                    className: Rc()["button-style"],
                    componentClass: "a",
                    children: n("Explore more courses"),
                  });
                },
              }
            )
          );
        },
        Uc = r(95590),
        Mc = r(13768),
        Bc =
          ((Cc = (function () {
            function e(t) {
              (0, o.Z)(this, e),
                (0, Ze.Z)(this, "_url", Sc, this),
                (0, Ze.Z)(this, "content", Dc, this),
                (0, Ze.Z)(this, "isLoading", Ac, this),
                (0, Ze.Z)(this, "hasErrorContent", Lc, this),
                this.setUrl(t);
            }
            return (
              (0, a.Z)(e, [
                {
                  key: "setUrl",
                  value: function (e) {
                    var t =
                      arguments.length > 1 &&
                      void 0 !== arguments[1] &&
                      arguments[1];
                    (e !== this._url || t) &&
                      ((this.content = ""), (this._url = e));
                  },
                },
                {
                  key: "setContent",
                  value: function (e) {
                    var t =
                      arguments.length > 1 &&
                      void 0 !== arguments[1] &&
                      arguments[1];
                    (this.content = e), (this.hasErrorContent = t);
                  },
                },
                {
                  key: "fetchContent",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e() {
                        var t,
                          r,
                          n,
                          i,
                          o,
                          a = this,
                          s = arguments;
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  if (
                                    ((t =
                                      s.length > 0 && void 0 !== s[0]
                                        ? s[0]
                                        : null),
                                    !this.content)
                                  ) {
                                    e.next = 3;
                                    break;
                                  }
                                  return e.abrupt("return", Promise.resolve());
                                case 3:
                                  return (
                                    (this.isLoading = !0),
                                    (this.hasErrorContent = !1),
                                    (this.content = ""),
                                    (r = [
                                      Ir().get(this._url, {
                                        headers: {
                                          Accept: "text/html",
                                          "X-Requested-With": "XMLHttpRequest",
                                        },
                                        params: { display_type: "popup" },
                                      }),
                                    ]),
                                    t && r.push(t(this._url).catch(Uc.Z)),
                                    (e.prev = 8),
                                    (e.next = 11),
                                    Promise.all(r)
                                  );
                                case 11:
                                  (n = e.sent),
                                    (i = (0, Tr.Z)(n, 1)),
                                    (o = i[0]),
                                    (0, Te.z)(function () {
                                      (a.content = o.data), (a.isLoading = !1);
                                    }),
                                    (e.next = 20);
                                  break;
                                case 17:
                                  (e.prev = 17),
                                    (e.t0 = e.catch(8)),
                                    (0, Te.z)(function () {
                                      e.t0.response && e.t0.response.data
                                        ? (a.content = e.t0.response.data)
                                        : (a.content = e.t0.message),
                                        (a.hasErrorContent = !0),
                                        (a.isLoading = !1);
                                    });
                                case 20:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[8, 17]]
                        );
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "submitForm",
                  value: function (e) {
                    var t = (0, Mc.N)(e),
                      r = [];
                    return (
                      Object.entries(t).forEach(function (e) {
                        var t = (0, Tr.Z)(e, 2),
                          n = t[0],
                          i = t[1];
                        Array.isArray(i)
                          ? i.forEach(function (e) {
                              r.push(
                                ""
                                  .concat(encodeURIComponent(n), "=")
                                  .concat(encodeURIComponent(e))
                              );
                            })
                          : r.push(
                              ""
                                .concat(encodeURIComponent(n), "=")
                                .concat(encodeURIComponent(i))
                            );
                      }),
                      Ir().request({
                        baseURL: (0, ot.c)().url.to_root,
                        method: e.getAttribute("method") || "get",
                        url: e.getAttribute("action"),
                        data: r.join("&"),
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                          "X-Requested-With": "XMLHttpRequest",
                        },
                      })
                    );
                  },
                },
              ]),
              e
            );
          })()),
          (Sc = (0, Re.Z)(Cc.prototype, "_url", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "";
            },
          })),
          (Dc = (0, Re.Z)(Cc.prototype, "content", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "";
            },
          })),
          (Ac = (0, Re.Z)(Cc.prototype, "isLoading", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (Lc = (0, Re.Z)(Cc.prototype, "hasErrorContent", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (0, Re.Z)(
            Cc.prototype,
            "setUrl",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Cc.prototype, "setUrl"),
            Cc.prototype
          ),
          (0, Re.Z)(
            Cc.prototype,
            "setContent",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Cc.prototype, "setContent"),
            Cc.prototype
          ),
          (0, Re.Z)(
            Cc.prototype,
            "fetchContent",
            [Te.aD],
            Object.getOwnPropertyDescriptor(Cc.prototype, "fetchContent"),
            Cc.prototype
          ),
          Cc),
        Fc = r(15515),
        zc = r(57811),
        Vc = r(95880),
        Hc = r(73492),
        Wc = r(34289),
        Gc = r(36925);
      var Kc,
        qc = {
          "form#experiment_form": {
            moduleId: "tapen/experiment-form-admin",
            moduleArgs: {},
          },
          'form[id$="unit_form"]': {
            moduleId: "tapen/discovery-unit-form-admin",
            moduleArgs: {},
          },
          "div#discoveryunitconfiguration_set-group": {
            moduleId: "tapen/discovery-context-admin",
            moduleArgs: {},
          },
          "div#content-main": {
            moduleId: "tapen/jsoneditor-admin",
            moduleArgs: {},
          },
        };
      function Yc(e) {
        var t = "_".concat(e.replace(/[-/]/g, "_"), "_app");
        return (
          Hc.Z.start(t),
          new Promise(function (r, n) {
            var i, o, a, s;
            (i = "ud-app"),
              (o = e),
              (a = function (e) {
                Hc.Z.end(t), r(e);
              }),
              (s = n),
              Gc.Z.once("".concat(i, ":").concat(o, ":success"), a),
              Gc.Z.once("".concat(i, ":").concat(o, ":failure"), s),
              Gc.Z.emit(i, o);
          })
        );
      }
      function Qc(e, t) {
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
      function Jc(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Xc,
        $c,
        eu =
          (0, m.Pi)(
            (Kc = (function (e) {
              (0, s.Z)(r, e);
              var t = Jc(r);
              function r(e, n) {
                var i;
                return (
                  (0, o.Z)(this, r),
                  ((i = t.call(this, e, n)).unloadOldContent = function (e) {
                    var t = i.props.ajaxContentStore.content;
                    return (
                      (i.contentChanged = t !== e.newValue),
                      t && i.contentChanged && i.unmountContents(),
                      e
                    );
                  }),
                  (i.modalBodyRef = b.createRef()),
                  (i.contentChanged = !1),
                  i
                );
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "componentDidMount",
                    value: function () {
                      this.bootstrapContents(),
                        (this.disposers = [
                          (0, Te.Su)(
                            this.props.ajaxContentStore,
                            "content",
                            this.unloadOldContent
                          ),
                        ]);
                    },
                  },
                  {
                    key: "componentDidUpdate",
                    value: function () {
                      this.contentChanged &&
                        (this.bootstrapContents(), (this.contentChanged = !1));
                    },
                  },
                  {
                    key: "componentWillUnmount",
                    value: function () {
                      this.disposers &&
                        this.disposers.forEach(function (e) {
                          return e();
                        }),
                        this.unmountContents();
                    },
                  },
                  {
                    key: "bootstrapContents",
                    value: function () {
                      (this.udAppUnloader = (function () {
                        var e =
                            arguments.length > 0 && void 0 !== arguments[0]
                              ? arguments[0]
                              : document,
                          t =
                            arguments.length > 1 && void 0 !== arguments[1]
                              ? arguments[1]
                              : Uc.Z,
                          r = {};
                        Array.from(
                          e.querySelectorAll(".ud-app-loader")
                        ).forEach(function (e) {
                          var t = Number(e.dataset.modulePriority || 0);
                          (r[t] = r[t] || []), r[t].push(e);
                        }),
                          Object.entries(qc).forEach(function (t) {
                            var n = (0, Tr.Z)(t, 2),
                              i = n[0],
                              o = n[1];
                            Array.from(e.querySelectorAll(i)).forEach(function (
                              e
                            ) {
                              var t = Number(o.modulePriority || 0);
                              (e.dataset.moduleId = o.moduleId),
                                (e.dataset.moduleArgs = JSON.stringify(
                                  o.moduleArgs
                                )),
                                (r[t] = r[t] || []),
                                r[t].push(e);
                            });
                          });
                        var n = [];
                        function i(e) {
                          var t = e.dataset.moduleId,
                            r = e.dataset.moduleArgs,
                            n = r ? JSON.parse(r) : {};
                          return e.classList.contains("ud-app-loading") ||
                            e.classList.contains("ud-app-loaded")
                            ? Promise.resolve([])
                            : (e.classList.add("ud-app-loading"),
                              Yc(t)
                                .then(function (t) {
                                  t.default(e, n),
                                    e.classList.remove("ud-app-loading"),
                                    e.classList.add("ud-app-loaded");
                                })
                                .catch(function (e) {
                                  _.c.captureException(e);
                                }));
                        }
                        return (
                          Object.keys(r)
                            .sort(function (e, t) {
                              return Number(e) < Number(t) ? 1 : -1;
                            })
                            .forEach(function (e) {
                              n.push(r[e]);
                            }),
                          n
                            .reduce(function (e, t) {
                              return e.then(function () {
                                return Promise.all(t.map(i));
                              });
                            }, Promise.resolve())
                            .then(t),
                          function () {
                            Object.values(n).forEach(function (e) {
                              e.forEach(function (e) {
                                e.dispatchEvent(new Event(Wc.z));
                              });
                            });
                          }
                        );
                      })(this.modalBodyRef.current)),
                        this.props.onBootstrapContents(
                          this.modalBodyRef.current
                        );
                    },
                  },
                  {
                    key: "unmountContents",
                    value: function () {
                      this.udAppUnloader &&
                        (this.udAppUnloader(), (this.udAppUnloader = null));
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      return (0, w.jsx)(
                        "div",
                        (function (e) {
                          for (var t = 1; t < arguments.length; t++) {
                            var r = null != arguments[t] ? arguments[t] : {};
                            t % 2
                              ? Qc(Object(r), !0).forEach(function (t) {
                                  (0, i.Z)(e, t, r[t]);
                                })
                              : Object.getOwnPropertyDescriptors
                              ? Object.defineProperties(
                                  e,
                                  Object.getOwnPropertyDescriptors(r)
                                )
                              : Qc(Object(r)).forEach(function (t) {
                                  Object.defineProperty(
                                    e,
                                    t,
                                    Object.getOwnPropertyDescriptor(r, t)
                                  );
                                });
                          }
                          return e;
                        })(
                          { ref: this.modalBodyRef },
                          (0, zc.S)({
                            descriptionOfCaller: "ajax-modal-body:content",
                            html: this.props.ajaxContentStore.content,
                            domPurifyConfig: { ADD_ATTR: ["target"] },
                          })
                        )
                      );
                    },
                  },
                ]),
                r
              );
            })(b.Component))
          ) || Kc,
        tu = r(4861),
        ru = r.n(tu),
        nu = ["skipCache", "url", "labelledById", "className"];
      function iu(e, t) {
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
      function ou(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? iu(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : iu(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function au(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var su,
        cu =
          (0, m.Pi)(
            (($c = (function (e) {
              (0, s.Z)(r, e);
              var t = au(r);
              function r(e) {
                var n;
                return (
                  (0, o.Z)(this, r),
                  ((n = t.call(this, e)).fetchContent = function (e, t) {
                    t &&
                      (n.store.setUrl(e, n.props.skipCache),
                      n.store.fetchContent(n.props.preloader));
                  }),
                  (n.onBootstrapContents = function (e) {
                    (n.contentNode = e),
                      n.applyInterceptor(),
                      n.contentNode.removeEventListener(
                        "close-ajax-modal",
                        n.props.onClose
                      ),
                      n.contentNode.addEventListener(
                        "close-ajax-modal",
                        n.props.onClose
                      );
                  }),
                  (n.applyInterceptor = function () {
                    if (n.props.shouldInterceptContent) {
                      n.contentNode.removeEventListener(
                        "intercept-ajax-content",
                        n.applyInterceptor
                      ),
                        n.contentNode.addEventListener(
                          "intercept-ajax-content",
                          n.applyInterceptor
                        );
                      var e = n.contentNode.querySelectorAll(
                        "a:not([data-disable-loader])"
                      );
                      Array.from(e).forEach(function (e) {
                        e.removeEventListener("click", n.onClickLink),
                          e.addEventListener("click", n.onClickLink);
                      });
                      var t = n.contentNode.querySelectorAll(
                        "form:not([data-disable-loader])"
                      );
                      Array.from(t).forEach(function (e) {
                        e.removeEventListener("submit", n.onSubmitForm),
                          e.addEventListener("submit", n.onSubmitForm);
                      }),
                        n.handleRunCommandElements(n.contentNode);
                    }
                  }),
                  (n.onClickLink = function (e) {
                    var t = e.target,
                      r = document.createElement("a");
                    if (
                      ((r.href = t.href),
                      "_blank" === t.target || !t.href || !r.host)
                    )
                      return !0;
                    e.preventDefault(), n.fetchContent(t.href, n.props.isOpen);
                  }),
                  (n.onSubmitForm = (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e(t) {
                        var r, i, o;
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    t.preventDefault(),
                                    (e.prev = 1),
                                    (e.next = 4),
                                    n.store.submitForm(t.target)
                                  );
                                case 4:
                                  (r = e.sent),
                                    (i = r.data) && i.returnUrl
                                      ? (Vc.Z.global.location.href =
                                          i.returnUrl)
                                      : i &&
                                        "string" === typeof i &&
                                        (n.store.setContent(
                                          n.contentNode.innerHTML
                                        ),
                                        ((o =
                                          document.createElement(
                                            "div"
                                          )).innerHTML = i),
                                        n.handleRunCommandElements(o) ||
                                          n.store.setContent(i)),
                                    (e.next = 12);
                                  break;
                                case 9:
                                  (e.prev = 9),
                                    (e.t0 = e.catch(1)),
                                    n.store.setContent(
                                      gettext("An unknown error occurred"),
                                      !0
                                    );
                                case 12:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          null,
                          [[1, 9]]
                        );
                      })
                    );
                    return function (t) {
                      return e.apply(this, arguments);
                    };
                  })()),
                  (n.renderTitle = function () {
                    return [n.props.labelledById, null];
                  }),
                  (n.store = new Bc(n.props.url)),
                  n
                );
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "componentDidMount",
                    value: function () {
                      this.fetchContent(this.props.url, this.props.isOpen);
                    },
                  },
                  {
                    key: "componentDidUpdate",
                    value: function (e) {
                      e.isOpen !== this.props.isOpen &&
                        this.fetchContent(this.props.url, this.props.isOpen);
                    },
                  },
                  {
                    key: "componentWillUnmount",
                    value: function () {
                      this.contentNode &&
                        (this.contentNode.removeEventListener(
                          "intercept-ajax-content",
                          this.applyInterceptor
                        ),
                        this.contentNode.removeEventListener(
                          "close-ajax-modal",
                          this.props.onClose
                        ),
                        (this.contentNode = null));
                    },
                  },
                  {
                    key: "handleRunCommandElements",
                    value: function (e) {
                      var t = this,
                        r = Array.from(e.querySelectorAll(".run-command"));
                      return (
                        r.forEach(function (e) {
                          e.classList.contains("close-popup") &&
                            t.props.onClose(),
                            e.classList.contains("redirect") &&
                              (Vc.Z.global.location.href = e.dataset.url),
                            e.classList.contains("refresh-page") &&
                              Vc.Z.global.location.reload();
                        }),
                        r.length > 0
                      );
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this.props,
                        t = (e.skipCache, e.url, e.labelledById),
                        r = e.className,
                        n = (0, he.Z)(e, nu),
                        o = !this.store.isLoading && !!this.store.content,
                        a = null;
                      return (
                        o && this.store.hasErrorContent
                          ? (a = (0, w.jsx)(
                              "div",
                              ou(
                                { id: t, className: "ud-modal-title" },
                                (0, zc.S)({
                                  descriptionOfCaller:
                                    "ajax-modal:error-content",
                                  html: this.store.content,
                                })
                              )
                            ))
                          : o &&
                            (a = (0, w.jsx)(eu, {
                              ajaxContentStore: this.store,
                              onBootstrapContents: this.onBootstrapContents,
                            })),
                        (0, w.jsx)(
                          Fc.u,
                          ou(
                            ou({}, n),
                            {},
                            {
                              className: y()(
                                r,
                                (0, i.Z)(
                                  {},
                                  ru()["ajax-error"],
                                  this.store.hasErrorContent
                                )
                              ),
                              fullPage: !!o && n.fullPage,
                              loading: !o,
                              title: "",
                              renderTitle: this.renderTitle,
                              children: a,
                            }
                          )
                        )
                      );
                    },
                  },
                ]),
                r
              );
            })(b.Component)),
            ($c.defaultProps = {
              requireExplicitAction: !1,
              onClose: Uc.Z,
              onOpen: Uc.Z,
              fullPage: !1,
              loading: !1,
              className: void 0,
              getContainer: function () {
                return document.body;
              },
              preloader: null,
              shouldInterceptContent: !1,
              skipCache: !1,
            }),
            (Xc = $c))
          ) || Xc,
        uu = r(23525),
        lu = r.n(uu);
      function pu(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var du,
        fu,
        hu,
        yu,
        mu,
        bu =
          (0, m.Pi)(
            (su = (function (e) {
              (0, s.Z)(n, e);
              var t = pu(n);
              function n() {
                return (0, o.Z)(this, n), t.apply(this, arguments);
              }
              return (
                (0, a.Z)(n, [
                  {
                    key: "preloadScreen",
                    value: function () {
                      return Promise.all([r.e(315), r.e(154), r.e(697)]).then(
                        r.bind(r, 96154)
                      );
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this.props.occupationVisibilityStore;
                      return (0, w.jsx)(m.zt, {
                        isAjaxModal: !0,
                        children: (0, w.jsx)(cu, {
                          labelledById: "occupation-modal",
                          url: e.modalURL,
                          isOpen: e.isModalOpen,
                          onClose: e.closeModal,
                          fullPage: !0,
                          requireExplicitAction: !0,
                          preloader: this.preloadScreen,
                          className: lu()["occupation-modal"],
                        }),
                      });
                    },
                  },
                ]),
                n
              );
            })(b.Component))
          ) || su,
        vu = r(70933),
        gu = r(18682),
        _u =
          ((du = (function () {
            function e() {
              (0, o.Z)(this, e),
                (0, Ze.Z)(this, "isModalOpen", fu, this),
                (this.modalURL = "".concat(gu.vi, "?isAjaxModal")),
                (0, Ze.Z)(this, "closeModal", hu, this);
            }
            return (
              (0, a.Z)(e, [
                {
                  key: "openModal",
                  value: function () {
                    this.isModalOpen = !0;
                  },
                },
              ]),
              e
            );
          })()),
          (fu = (0, Re.Z)(du.prototype, "isModalOpen", [Te.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (0, Re.Z)(
            du.prototype,
            "openModal",
            [Te.aD],
            Object.getOwnPropertyDescriptor(du.prototype, "openModal"),
            du.prototype
          ),
          (hu = (0, Re.Z)(du.prototype, "closeModal", [Te.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                e.isModalOpen = !1;
              };
            },
          })),
          du),
        Ou = r(60553),
        wu = r.n(Ou);
      function ku(e, t) {
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
      function xu(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? ku(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : ku(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function Pu(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var ju =
          (0, m.Pi)(
            ((mu = (function (e) {
              (0, s.Z)(r, e);
              var t = Pu(r);
              function r(e) {
                var n;
                return (
                  (0, o.Z)(this, r),
                  ((n = t.call(this, e)).handleClick = function () {
                    n.handleEventTracking(),
                      n.occupationVisibilityStore.openModal();
                  }),
                  (n.occupationVisibilityStore = new _u()),
                  n
                );
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "handleEventTracking",
                    value: function () {
                      Z.j.publishEvent(
                        new vu.pj({
                          progression: 0,
                          selection: "edit",
                          selectionType: "edit",
                        })
                      );
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this.props,
                        t = e.unit,
                        r = e.className,
                        n = e.showSubTitle,
                        o = e.showNewBadge,
                        a = e.gettext,
                        s = xu(
                          xu({}, t),
                          {},
                          {
                            actionLink: {
                              text: a("Edit profession"),
                              buttonProps: {
                                onClick: this.handleClick,
                                componentClass: "button",
                                className: "ud-link-underline",
                              },
                            },
                          }
                        );
                      return (0, w.jsxs)("div", {
                        className: r,
                        children: [
                          (0, w.jsx)(wc.p, {
                            unit: s,
                            className: y()(
                              wu()["title-wrapper"],
                              (0, i.Z)({}, wu()["bottom-margin"], !n)
                            ),
                          }),
                          n &&
                            (0, w.jsxs)("div", {
                              className: wu()["secondary-text"],
                              "data-purpose": "sub-title",
                              children: [
                                o && (0, w.jsx)(ke.gl, {}),
                                (0, w.jsx)("span", {
                                  className: "ud-text-xs",
                                  children: a("Inspired by your selections"),
                                }),
                              ],
                            }),
                          (0, w.jsx)(bu, {
                            occupationVisibilityStore:
                              this.occupationVisibilityStore,
                          }),
                          (0, w.jsx)(
                            Tt.$H,
                            xu(xu({}, this.props), {}, { showTitle: !1 })
                          ),
                        ],
                      });
                    },
                  },
                ]),
                r
              );
            })(b.Component)),
            (mu.defaultProps = {
              className: void 0,
              showSubTitle: !1,
              showNewBadge: !1,
            }),
            (yu = mu))
          ) || yu,
        Zu = (0, p.GV)(ju),
        Ru = r(28017),
        Tu = r(23019),
        Eu = r.n(Tu);
      function Iu(e, t) {
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
      function Cu(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Iu(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Iu(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function Su(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Du = (function (e) {
        (0, s.Z)(r, e);
        var t = Su(r);
        function r() {
          var e;
          (0, o.Z)(this, r);
          for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++)
            i[a] = arguments[a];
          return (
            ((e = t.call.apply(t, [this].concat(i))).trackDiscoveryImpression =
              function () {
                var t = {
                    backendSource: Ee.YV.backendSourceOptions.DISCOVERY,
                    index: e.props.index,
                  },
                  r = Cu({}, e.props.instructor);
                we.R.trackDiscoveryImpression({ item: r }, t);
              }),
            (e.trackClickEvent = function () {
              Z.j.publishEvent(
                new Oc.Rd({
                  componentName: e.props.componentName,
                  relatedObjectType: Oc.Rd.relatedObjectTypes.user,
                  relatedObjectId: e.props.instructor.id,
                  trackingId: e.props.instructor.tracking_id,
                })
              );
            }),
            e
          );
        }
        return (
          (0, a.Z)(r, [
            {
              key: "render",
              value: function () {
                var e,
                  t,
                  r = this.props,
                  n = r.instructor,
                  o = r.withContainer,
                  a = r.vertical,
                  s = r.gettext,
                  c = r.ninterpolate,
                  u =
                    null !== (e = this.props.titleTag) && void 0 !== e
                      ? e
                      : "div";
                return (0, w.jsx)(R.H, {
                  trackFunc: this.trackDiscoveryImpression,
                  children: (0, w.jsxs)(Zs.qg, {
                    className: y()(
                      this.props.className,
                      ((t = {}),
                      (0, i.Z)(t, Eu()["card-container"], o),
                      (0, i.Z)(t, Eu()["card-vertical"], a),
                      t)
                    ),
                    children: [
                      (0, w.jsx)(Zs.qg.ImageWrapper, {
                        children: (0, w.jsx)(Rs.q, { user: n, alt: "NONE" }),
                      }),
                      (0, w.jsxs)("div", {
                        className: y()("ud-text-xs", Eu().details),
                        children: [
                          (0, w.jsx)(u, {
                            children: (0, w.jsx)(Zs.qg.Title, {
                              href: n.url,
                              className: y()(
                                "ud-text-md ud-text-bold",
                                Eu().title
                              ),
                              onClick: this.trackClickEvent,
                              children: n.title,
                            }),
                          }),
                          (0, w.jsx)("div", {
                            className: y()(
                              "ud-text-sm",
                              Eu()["label-container"]
                            ),
                            children: n.course_labels.join(", "),
                          }),
                          (0, w.jsxs)("div", {
                            className: Eu()["rating-wrapper"],
                            children: [
                              (0, w.jsx)(Oe.Z, {
                                rating: n.avg_rating,
                                numeric: !0,
                              }),
                              (0, w.jsx)("span", {
                                className: Eu()["rating-title"],
                                children: s("Instructor rating"),
                              }),
                            ],
                          }),
                          (0, w.jsx)("div", {
                            children: (0, w.jsx)(p.nj, {
                              html: c(
                                '<span class="bold">%(count)s</span> student',
                                '<span class="bold">%(count)s</span> students',
                                n.total_num_students,
                                { count: n.total_num_students.toLocaleString() }
                              ),
                              interpolate: {
                                bold: (0, w.jsx)("span", {
                                  className: "ud-text-bold",
                                }),
                              },
                            }),
                          }),
                          (0, w.jsx)("div", {
                            children: (0, w.jsx)(p.nj, {
                              html: c(
                                '<span class="bold">%(count)s</span> course',
                                '<span class="bold">%(count)s</span> courses',
                                n.num_visible_taught_courses,
                                {
                                  count:
                                    n.num_visible_taught_courses.toLocaleString(),
                                }
                              ),
                              interpolate: {
                                bold: (0, w.jsx)("span", {
                                  className: "ud-text-bold",
                                }),
                              },
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                });
              },
            },
          ]),
          r
        );
      })(b.Component);
      Du.defaultProps = {
        className: "",
        withContainer: !1,
        vertical: !1,
        index: -1,
        titleTag: "div",
      };
      var Au,
        Lu,
        Nu = (0, p.GV)(Du),
        Uu = r(1480),
        Mu = r.n(Uu),
        Bu = ["className"],
        Fu = ["className"];
      function zu(e, t) {
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
      function Vu(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? zu(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : zu(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function Hu(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Wu,
        Gu,
        Ku,
        qu,
        Yu,
        Qu =
          (0, m.Pi)(
            ((Lu = (function (e) {
              (0, s.Z)(r, e);
              var t = Hu(r);
              function r() {
                return (0, o.Z)(this, r), t.apply(this, arguments);
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "componentDidMount",
                    value: function () {
                      this.props.onLoad();
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this.props,
                        t = e.titleId,
                        r = e.className,
                        n = e.unit,
                        i = e.carouselProps,
                        o = e.cardProps,
                        a = e.showTitle,
                        s = e.alternateHeadline,
                        c = e.componentName,
                        u = n.items,
                        l = null !== i && void 0 !== i ? i : {},
                        p = l.className,
                        d = (0, he.Z)(l, Bu),
                        f = null !== o && void 0 !== o ? o : {},
                        h = f.className,
                        m = (0, he.Z)(f, Fu);
                      return (0, w.jsx)("div", {
                        className: r,
                        children: (0, w.jsxs)("section", {
                          "aria-labelledby": t,
                          children: [
                            a &&
                              (0, w.jsx)("h2", {
                                id: t,
                                className: y()(
                                  "ud-heading-xl",
                                  Mu()["unit-title"]
                                ),
                                "data-purpose": "title",
                                children: n.title,
                              }),
                            !a &&
                              s &&
                              (0, w.jsx)(
                                Ru.Z,
                                Vu({ titleTag: "h2", titleId: t }, s)
                              ),
                            (0, w.jsx)(
                              j.l,
                              Vu(
                                Vu(
                                  {
                                    showPager: !0,
                                    className: y()(
                                      null !== p && void 0 !== p ? p : "",
                                      Mu()["instructor-grid-columns"]
                                    ),
                                  },
                                  d
                                ),
                                {},
                                {
                                  children: u.map(function (e, t) {
                                    return (0,
                                    w.jsx)(xe.m, { item: { id: "instructor|".concat(e.id) }, children: (0, w.jsx)(Nu, Vu({ instructor: e, className: y()(null !== h && void 0 !== h ? h : "", Mu()["instructor-card-container"]), withContainer: !0, index: t, componentName: c }, m)) }, t);
                                  }),
                                }
                              )
                            ),
                          ],
                        }),
                      });
                    },
                  },
                ]),
                r
              );
            })(b.Component)),
            (Lu.defaultProps = {
              titleId: "popularInstructorsHeading",
              className: void 0,
              onLoad: Uc.Z,
              cardProps: void 0,
              carouselProps: void 0,
              showTitle: !0,
              alternateHeadline: void 0,
            }),
            (Au = Lu))
          ) || Au;
      function Ju(e, t) {
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
      function Xu(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Ju(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Ju(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function $u(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var el =
          (0, m.Pi)(
            ((Yu = (function (e) {
              (0, s.Z)(r, e);
              var t = $u(r);
              function r() {
                var e;
                (0, o.Z)(this, r);
                for (
                  var n = arguments.length, i = new Array(n), a = 0;
                  a < n;
                  a++
                )
                  i[a] = arguments[a];
                return (
                  (e = t.call.apply(t, [this].concat(i))),
                  (0, Ze.Z)(e, "isExpanded", Ku, (0, Ne.Z)(e)),
                  (0, Ze.Z)(e, "toggleExpansion", qu, (0, Ne.Z)(e)),
                  e
                );
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "componentDidMount",
                    value: function () {
                      this.props.onLoad();
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this.props,
                        t = e.className,
                        r = e.unit,
                        n = e.showTitle,
                        i = e.alternateHeadline,
                        o = e.componentName,
                        a = e.titleId,
                        s = e.gettext,
                        c = r.items,
                        u = this.isExpanded ? c : c.slice(0, 3);
                      return (0, w.jsx)("div", {
                        className: t,
                        children: (0, w.jsxs)("section", {
                          "aria-labelledby": a,
                          children: [
                            n &&
                              (0, w.jsx)("h2", {
                                id: a,
                                className: y()(
                                  "ud-heading-lg",
                                  Mu()["unit-title"]
                                ),
                                "data-purpose": "title",
                                children: r.title,
                              }),
                            !n &&
                              i &&
                              (0, w.jsx)(
                                Ru.Z,
                                Xu({ titleTag: "h2", titleId: a }, i)
                              ),
                            u.map(function (e, t) {
                              return (0,
                              w.jsx)(xe.m, { item: { id: "instructor|".concat(e.id) }, children: (0, w.jsx)(Nu, { instructor: e, className: Mu()["instructor-card-container"], componentName: o }) }, t);
                            }),
                            (0, w.jsx)(P.zx, {
                              size: "medium",
                              udStyle: "secondary",
                              onClick: this.toggleExpansion,
                              className: Mu()["button-sizing"],
                              children: this.isExpanded
                                ? s("See less")
                                : s("See more"),
                            }),
                          ],
                        }),
                      });
                    },
                  },
                ]),
                r
              );
            })(b.Component)),
            (Yu.defaultProps = {
              titleId: "popularInstructorsHeading",
              className: void 0,
              onLoad: Uc.Z,
              showTitle: !0,
              alternateHeadline: void 0,
            }),
            (Gu = Yu),
            (Ku = (0, Re.Z)(Gu.prototype, "isExpanded", [Te.LO], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return !1;
              },
            })),
            (qu = (0, Re.Z)(Gu.prototype, "toggleExpansion", [Te.aD], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                var e = this;
                return function () {
                  e.isExpanded = !e.isExpanded;
                };
              },
            })),
            (Wu = Gu))
          ) || Wu,
        tl = (0, p.GV)(el);
      function rl(e, t) {
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
      function nl(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? rl(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : rl(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var il,
        ol,
        al = function (e) {
          var t = (0, x.ag)("mobile-max");
          return null === t || t
            ? (0, w.jsx)(tl, nl({}, e))
            : (0, w.jsx)(Qu, nl({}, e));
        },
        sl = r(39290),
        cl = r(18963),
        ul = r.n(cl);
      function ll(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var pl =
          (0, x.lK)({ isMobileMax: "mobile-max" })(
            ((ol = (function (e) {
              (0, s.Z)(r, e);
              var t = ll(r);
              function r() {
                var e;
                (0, o.Z)(this, r);
                for (
                  var n = arguments.length, i = new Array(n), a = 0;
                  a < n;
                  a++
                )
                  i[a] = arguments[a];
                return (
                  ((e = t.call.apply(t, [this].concat(i))).handleClick =
                    function (t, r) {
                      e.props.trackTopicClick && e.props.trackTopicClick(t, r);
                    }),
                  e
                );
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "componentDidMount",
                    value: function () {
                      this.props.onLoad();
                    },
                  },
                  {
                    key: "renderMobileTag",
                    value: function (e) {
                      var t = this;
                      return (0, w.jsx)(
                        xe.m,
                        {
                          item: { id: "cl|".concat(e.id) },
                          children: (0, w.jsx)(sl.K.Pill, {
                            componentClass: "a",
                            href: e.url,
                            size: "medium",
                            onClick: function () {
                              return t.handleClick(e.id, e.title);
                            },
                            children: e.title,
                          }),
                        },
                        e.id
                      );
                    },
                  },
                  {
                    key: "renderMobileLinkTags",
                    value: function () {
                      var e = this,
                        t = this.props.unit,
                        r = [],
                        n = [];
                      return (
                        t.items.forEach(function (t, i) {
                          i % 2 === 0
                            ? r.push(e.renderMobileTag(t))
                            : n.push(e.renderMobileTag(t));
                        }),
                        (0, w.jsxs)("div", {
                          className: y()(
                            "ud-full-width-container",
                            ul()["mobile-tags-container"]
                          ),
                          children: [
                            (0, w.jsx)(sl.K, {
                              className: ul()["mobile-tags-row"],
                              "data-purpose": "mobile-tags-row",
                              children: r,
                            }),
                            (0, w.jsx)(sl.K, {
                              className: ul()["mobile-tags-row"],
                              "data-purpose": "mobile-tags-row",
                              children: n,
                            }),
                          ],
                        })
                      );
                    },
                  },
                  {
                    key: "renderDesktopLinkTags",
                    value: function () {
                      var e = this,
                        t = this.props.unit,
                        r = y()(
                          ul().carousel,
                          (0, i.Z)({}, ul()["single-row"], t.items.length < 10)
                        );
                      return (0, w.jsx)(j.l, {
                        className: y()("popular-topics-unit-carousel", r),
                        showPager: !0,
                        children: t.items.map(function (t) {
                          return (0, w.jsx)(
                            xe.m,
                            {
                              item: { id: "cl|".concat(t.id) },
                              children: (0, w.jsx)("a", {
                                href: t.url,
                                className: y()(
                                  "ud-heading-md",
                                  ul()["topic-tag"]
                                ),
                                onClick: function () {
                                  return e.handleClick(t.id, t.title);
                                },
                                children: t.title,
                              }),
                            },
                            t.id
                          );
                        }),
                      });
                    },
                  },
                  {
                    key: "renderTopics",
                    value: function () {
                      var e = this.props,
                        t = e.unit,
                        r = e.className,
                        n = e.showTitle,
                        i = e.titleTypography,
                        o = e.isMobileMax;
                      return (0, w.jsxs)("div", {
                        className: r,
                        children: [
                          n && (0, w.jsx)(wc.p, { unit: t, typography: i }),
                          o
                            ? this.renderMobileLinkTags()
                            : this.renderDesktopLinkTags(),
                        ],
                      });
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      return (0, w.jsx)(w.Fragment, {
                        children: this.props.trackImpression
                          ? (0, w.jsx)(R.H, {
                              trackFunc: this.props.trackImpression,
                              children: this.renderTopics(),
                            })
                          : this.renderTopics(),
                      });
                    },
                  },
                ]),
                r
              );
            })(b.Component)),
            (ol.defaultProps = {
              className: void 0,
              showTitle: !0,
              titleTypography: "",
              onLoad: Uc.Z,
              trackImpression: void 0,
              trackTopicClick: void 0,
              isMobileMax: null,
            }),
            (il = ol))
          ) || il,
        dl = r(30519),
        fl = r.n(dl);
      function hl(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var yl = (function (e) {
        (0, s.Z)(r, e);
        var t = hl(r);
        function r() {
          return (0, o.Z)(this, r), t.apply(this, arguments);
        }
        return (
          (0, a.Z)(r, [
            {
              key: "componentDidMount",
              value: function () {
                this.props.onLoad();
              },
            },
            {
              key: "render",
              value: function () {
                var e = this.props,
                  t = e.className,
                  r = e.unit,
                  n = e.compact,
                  i = e.gettext,
                  o = e.interpolate,
                  a = r.items.slice(0, 2);
                return (0, w.jsxs)("h2", {
                  className: y()(t, "ud-heading-".concat(n ? "sm" : "md")),
                  children: [
                    o(
                      i("%(topicTitle)s relates to "),
                      { topicTitle: r.source_objects[0].title },
                      !0
                    ),
                    a.map(function (e) {
                      return (0,
                      w.jsx)("a", { href: e.url, className: fl()["item-link"], children: e.title }, e.id);
                    }),
                  ],
                });
              },
            },
          ]),
          r
        );
      })(b.Component);
      yl.defaultProps = { className: void 0, onLoad: Uc.Z, compact: !1 };
      var ml = (0, p.GV)(yl),
        bl = r(21042),
        vl = r.n(bl),
        gl = r(53045),
        _l = r.n(gl),
        Ol = function (e) {
          var t = e.avgRating,
            r = e.numCourses,
            i = e.numQuizzes,
            o = e.numInstructors,
            a = void 0 === o ? void 0 : o,
            s = e.type,
            c = void 0 === s ? "default" : s,
            u = (0, p.D2)().formatNumber,
            l = [
              { stat: "".concat(u(r.value), "+"), description: r.description },
              { stat: "".concat(u(i.value), "+"), description: i.description },
            ].concat(
              (0, n.Z)(
                a
                  ? [
                      {
                        stat: "".concat(u(a.value), "+"),
                        description: a.description,
                      },
                    ]
                  : []
              ),
              [
                {
                  stat: (0, w.jsxs)("div", {
                    className: _l().rating,
                    children: [
                      u(t.value.toFixed(1)),
                      (0, w.jsx)("span", {
                        className: _l()["rating-icon"],
                        children: (0, w.jsx)(vl(), {
                          color: "inherit",
                          label: !1,
                          size: "large" === c ? "medium" : "small",
                        }),
                      }),
                    ],
                  }),
                  description: t.description,
                },
              ]
            ),
            d = "stat-".concat(c),
            f = "ud-heading-".concat(
              "large" === c ? "xl" : "small" === c ? "md" : "lg"
            );
          return (0, w.jsx)("ul", {
            className: _l()["stats-".concat(l.length)],
            children: l.map(function (e, t) {
              return (0,
              w.jsxs)("li", { "data-purpose": "stat", children: [(0, w.jsx)("div", { className: f, children: e.stat }), (0, w.jsx)("div", { className: _l()[d], children: e.description })] }, t);
            }),
          });
        },
        wl = r(89619),
        kl = r.n(wl),
        xl = r(31325),
        Pl = [
          "stats",
          "url",
          "pluralName",
          "titleHeadingLevel",
          "showSubtitle",
          "headingText",
        ];
      function jl(e, t) {
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
      function Zl(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? jl(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : jl(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var Rl = function (e) {
          var t = e.stats,
            r = e.url,
            n = e.pluralName,
            i = e.titleHeadingLevel,
            o = void 0 === i ? "h3" : i,
            a = e.showSubtitle,
            s = e.headingText,
            c = (0, he.Z)(e, Pl),
            u = (0, p.QT)(),
            l = u.gettext,
            d = u.interpolate,
            f = (0, xl.A)(
              Zl(Zl({}, c), {}, { occupationName: c.defaultLocaleName })
            ),
            h = f.trackOccupationCardImpressionEvent,
            m = f.trackOccupationCardClickEvent;
          return (0, w.jsx)(R.H, {
            trackFunc: h,
            children: (0, w.jsxs)("div", {
              className: kl()["occupation-card"],
              children: [
                (0, w.jsxs)("div", {
                  className: kl()["occupation-title-container"],
                  children: [
                    (0, w.jsx)("div", {
                      className: y()(
                        "ud-heading-xs",
                        kl()["personal-plan-text"]
                      ),
                      "data-purpose": "heading-text",
                      children: null !== s && void 0 !== s ? s : l("Great for"),
                    }),
                    (0, w.jsx)(o, {
                      children: (0, w.jsx)("a", {
                        className: y()(
                          "ud-heading-lg",
                          kl()["occupation-title"]
                        ),
                        "data-purpose": "occupation-title",
                        href: r,
                        onClick: m,
                        children: n,
                      }),
                    }),
                    a &&
                      (0, w.jsx)("p", {
                        className: kl().subtitle,
                        "data-purpose": "subtitle",
                        children: d(
                          l(
                            "A curated collection of courses and hands-on practice exercises to help you advance as %(article)s %(name)s."
                          ),
                          {
                            name: c.name.toLocaleLowerCase(),
                            article: c.name.match("^[aieouAIEOU].*")
                              ? "an"
                              : "a",
                          },
                          !0
                        ),
                      }),
                  ],
                }),
                (0, w.jsx)(Ol, {
                  avgRating: {
                    value: t.avg_rating,
                    description: l("Avg. rating of courses"),
                  },
                  numCourses: {
                    value: t.num_courses,
                    description: l("Relevant courses"),
                  },
                  numQuizzes: {
                    value: t.num_exercises,
                    description: l("Hands-on exercises"),
                  },
                }),
              ],
            }),
          });
        },
        Tl = r(84558),
        El = r(29811),
        Il = r(90702),
        Cl = r.n(Il);
      function Sl(e, t) {
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
      var Dl,
        Al,
        Ll = function (e) {
          var t,
            r = e.unit,
            n = e.className,
            o = e.cardProps,
            a = e.titleId,
            s = void 0 === a ? "relatedOccupationsUnit" : a,
            c = e.plan,
            u = e.planPriceIds,
            l = e.ctaButtonStyle,
            d = void 0 === l ? "brand" : l,
            f = e.showHeader,
            h = void 0 === f || f,
            m = (0, x.ag)("mobile-max"),
            b = (0, p.QT)().gettext;
          if (0 === r.items.length) return null;
          var v = r.items.map(function (e, t) {
            var r;
            return (0, w.jsx)(
              Rl,
              (function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var r = null != arguments[t] ? arguments[t] : {};
                  t % 2
                    ? Sl(Object(r), !0).forEach(function (t) {
                        (0, i.Z)(e, t, r[t]);
                      })
                    : Object.getOwnPropertyDescriptors
                    ? Object.defineProperties(
                        e,
                        Object.getOwnPropertyDescriptors(r)
                      )
                    : Sl(Object(r)).forEach(function (t) {
                        Object.defineProperty(
                          e,
                          t,
                          Object.getOwnPropertyDescriptor(r, t)
                        );
                      });
                }
                return e;
              })(
                {
                  index: t,
                  occupationId: e.id,
                  name: e.default_name,
                  pluralName: e.plural_name,
                  url: e.url,
                  uiRegion:
                    null !==
                      (r = null === o || void 0 === o ? void 0 : o.uiRegion) &&
                    void 0 !== r
                      ? r
                      : "",
                  titleHeadingLevel:
                    null === o || void 0 === o ? void 0 : o.titleHeadingLevel,
                  stats: e.courses_stats,
                  showSubtitle: 0 === t,
                  defaultLocaleName: e.default_locale_name,
                },
                o
              ),
              e.id
            );
          });
          return (0, w.jsxs)("section", {
            "aria-labelledby": s,
            className: n,
            "data-purpose": "related-occupations",
            children: [
              h &&
                (0, w.jsx)(Ru.Z, {
                  titleId: s,
                  titleTag: "h2",
                  title: b("Thrive in your career"),
                  secondaryText: b(
                    "Access a collection of top-rated courses curated for in-demand roles with a Personal Plan subscription."
                  ),
                }),
              v[0],
              c &&
                (0, w.jsx)("div", {
                  className: y()(
                    "component-margin",
                    Cl()["subscription-cta-banner"]
                  ),
                  "data-purpose": "subscription-cta-banner",
                  children: (0, w.jsx)(Tl.U, {
                    className: Cl()["subscription-cta"],
                    isSubscriber: !1,
                    includeTrialDaysOnCta: !1,
                    plan: c,
                    uiRegion:
                      null !==
                        (t =
                          null === o || void 0 === o ? void 0 : o.uiRegion) &&
                      void 0 !== t
                        ? t
                        : "",
                    planPriceIds: null !== u && void 0 !== u ? u : void 0,
                    offerCtaStyle: d,
                    planPeriodStyle: m ? El.F.MULTILINE_NO_MARGIN : El.F.SINGLE,
                  }),
                }),
            ],
          });
        },
        Nl = r(224),
        Ul = r(44020),
        Ml = r(14431),
        Bl = r.n(Ml);
      function Fl(e, t) {
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
      function zl(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Fl(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Fl(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function Vl(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Hl =
          (0, x.lK)({
            isMobileMax: "mobile-max",
            hasCoarsePointer: "(any-pointer: coarse)",
            hasFinePointer: "(any-pointer: fine)",
          })(
            ((Al = (function (e) {
              (0, s.Z)(r, e);
              var t = Vl(r);
              function r() {
                var e;
                (0, o.Z)(this, r);
                for (
                  var n = arguments.length, i = new Array(n), a = 0;
                  a < n;
                  a++
                )
                  i[a] = arguments[a];
                return (
                  ((e = t.call.apply(t, [this].concat(i))).backendSource =
                    Ee.YV.backendSourceOptions.DISCOVERY),
                  e
                );
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "componentDidMount",
                    value: function () {
                      (0, we.q)(this.props.unit.items);
                    },
                  },
                  {
                    key: "outerTitle",
                    get: function () {
                      return (
                        this.props.outerTitle ||
                        pgettext(
                          "E.g. a predefined series of courses",
                          "Learning series"
                        )
                      );
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this,
                        t = this.props,
                        r = t.unit,
                        n = t.className,
                        i = t.showSubtitle,
                        o = t.isMobileMax,
                        a = t.hasCoarsePointer,
                        s = t.hasFinePointer,
                        c =
                          r.source_objects.length > 0
                            ? r.source_objects[0].id
                            : "",
                        u = {
                          "data-purpose": "explore-button",
                          componentClass: "a",
                          udStyle: "primary",
                          size: "large",
                          href: "/courses/learning-series/".concat(c, "/"),
                          className: Bl()["explore-button"],
                        },
                        p = gettext("Explore series"),
                        d = zl({}, r);
                      return (
                        o ||
                          (d.actionLink = { text: p, buttonProps: zl({}, u) }),
                        (0, w.jsxs)("div", {
                          className: n,
                          children: [
                            (0, w.jsx)("h2", {
                              className: "ud-heading-xl",
                              children: this.outerTitle,
                            }),
                            i &&
                              (0, w.jsx)("div", {
                                className: y()(
                                  "ud-text-md",
                                  Bl()["secondary-header"]
                                ),
                                children: gettext(
                                  "A topic-based collection of courses, based on the patterns of other learners"
                                ),
                              }),
                            (0, w.jsxs)("div", {
                              className: Bl().wrapper,
                              children: [
                                (0, w.jsx)(wc.p, { unit: d }),
                                (0, w.jsx)("div", {
                                  className: y()(
                                    "ud-heading-md",
                                    Bl()["courses-count"]
                                  ),
                                  children: ninterpolate(
                                    "%s course",
                                    "%s courses",
                                    r.items.length
                                  ),
                                }),
                                r.description &&
                                  (0, w.jsx)("p", {
                                    className: Bl().description,
                                    children: r.description,
                                  }),
                                (0, w.jsx)(j.l, {
                                  allowScroll: a,
                                  showPager: s,
                                  className: Bl().grid,
                                  children: r.items.map(function (t, r) {
                                    return (0,
                                    w.jsx)(l.G, { trackingContext: { trackImpressionFunc: we.R.trackDiscoveryImpression, index: r, backendSource: e.backendSource }, children: (0, w.jsxs)(w.Fragment, { children: [(0, w.jsxs)("div", { className: Bl()["order-line"], children: [(0, w.jsx)("span", { className: y()("ud-heading-xs", Bl().order), children: r + 1 }), (0, w.jsx)("div", { className: Bl()["connector-bar"] })] }), (0, w.jsx)(Ul.V, { course: t, courseCard: (0, w.jsx)(Nl.Z, { className: Bl()["course-card"], course: t, renderInstructorContent: Uc.Z, renderPriceText: Uc.Z, showBadges: !1, showDetails: !1 }), showPrice: !0 })] }) }, t.id);
                                  }),
                                }),
                                o &&
                                  (0, w.jsx)(
                                    P.zx,
                                    zl(zl({}, u), {}, { children: p })
                                  ),
                              ],
                            }),
                          ],
                        })
                      );
                    },
                  },
                ]),
                r
              );
            })(b.Component)),
            (Al.defaultProps = {
              className: null,
              outerTitle: null,
              showSubtitle: !0,
              isMobileMax: null,
              hasCoarsePointer: null,
              hasFinePointer: null,
            }),
            (Dl = Al))
          ) || Dl,
        Wl = (0, p.GV)(Hl),
        Gl = r(45919),
        Kl = r(96502),
        ql = r.n(Kl),
        Yl = function (e) {
          var t = e.className,
            r = (0, x.ag)("mobile-max"),
            n = (0, p.QT)().gettext;
          return (0, w.jsx)("div", {
            className: y()(
              "ud-heading-sm ".concat(t),
              ql()["start-learning-label"],
              t ? "" : ql()["label-position"]
            ),
            children: r
              ? n("Start learning")
              : (0, w.jsx)(P.zx, {
                  size: "small",
                  udStyle: "secondary",
                  children: n("Start learning"),
                }),
          });
        };
      Yl.defaultProps = { className: "" };
      var Ql = Yl,
        Jl = r(51307),
        Xl = r(97351),
        $l = r(74637),
        ep = r.n($l),
        tp = function (e) {
          var t = e.course,
            r = (0, p.QT)().gettext,
            n = (0, f.gL)().request,
            i = new Date(t.last_update_date),
            o = n ? n.locale.replace("_", "-") : "en-US",
            a = i.toLocaleDateString(o, { month: "long", year: "numeric" });
          return (0, w.jsxs)("div", {
            className: y()("ud-text-xs", ep()["course-published-time"]),
            "data-purpose": "course-published-time",
            children: [
              r("Updated"),
              " ",
              (0, w.jsx)("strong", { children: a }),
            ],
          });
        },
        rp = /[&<>"']/g,
        np = RegExp(rp.source),
        ip = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };
      function op(e) {
        return ip[e];
      }
      var ap = function (e) {
        var t = e.instructors,
          r = (0, p.QT)(),
          n = r.gettext,
          i = r.interpolate,
          o = r.ninterpolate;
        if (0 === t.length) return null;
        var a,
          s = t[0],
          c = t.length - 1,
          u = (a = s.title) && np.test(a) ? a.replace(rp, op) : a;
        return 1 === t.length
          ? i(n("By %(title)s"), { title: u }, !0)
          : o(
              "By %(title)s and %(othersCount)s other",
              "By %(title)s and %(othersCount)s others",
              c,
              { title: u, othersCount: c }
            );
      };
      ap.propTypes = { instructors: Es().array.isRequired };
      var sp,
        cp,
        up,
        lp = ap,
        pp = r(83502),
        dp = r.n(pp),
        fp = (0, a.Z)(function e(t) {
          (0, o.Z)(this, e), (this.title = t.title), (this.courses = t.items);
        });
      function hp(e, t) {
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
      function yp(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? hp(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : hp(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function mp(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var bp = function (e) {
        var t = e.contentInfo,
          r = e.numPublishedLectures,
          n = e.level,
          i = (0, p.QT)().ninterpolate;
        return (0, w.jsxs)("div", {
          "data-purpose": "course-meta-info",
          className: y()("ud-text-xs", dp()["course-meta-info"]),
          children: [
            t && (0, w.jsx)("span", { children: t }),
            r &&
              (0, w.jsx)("span", {
                children: i("%s lecture", "%s lectures", r),
              }),
            n && (0, w.jsx)("span", { children: n }),
          ],
        });
      };
      bp.defaultProps = {
        contentInfo: void 0,
        numPublishedLectures: void 0,
        level: void 0,
      };
      var vp =
        (0, m.f3)(function (e) {
          return {
            showPersonalPlanBadge: e.showPersonalPlanBadge,
            showCodingExercisesBadge: e.showCodingExercisesBadge,
          };
        })(
          (sp = (function (e) {
            (0, s.Z)(r, e);
            var t = mp(r);
            function r() {
              var e;
              (0, o.Z)(this, r);
              for (
                var n = arguments.length, i = new Array(n), a = 0;
                a < n;
                a++
              )
                i[a] = arguments[a];
              return (
                ((e = t.call.apply(t, [this].concat(i))).backendSource =
                  Ee.YV.backendSourceOptions.DISCOVERY),
                (e.renderCourseImage = function (e, t) {
                  return (0, w.jsx)(e, yp({}, t));
                }),
                (e.renderPriceText = function (t) {
                  var r = e.props.udData.Config;
                  return t.is_in_user_subscription
                    ? (0, w.jsx)(Ql, { className: "price-text-container" })
                    : r.brand.has_organization
                    ? void 0
                    : (0, w.jsx)(ve.Z, {
                        courses: [t],
                        className: "price-text-container",
                        listPriceClassName: "list-price ud-text-sm",
                        discountPriceClassName: "discount-price ud-heading-md",
                        trackingEventContext: {
                          buyableId: t.id,
                          priceType: ge.Z.individual_buyable,
                          buyableType: "course",
                          buyableTrackingId:
                            t.frontendTrackingId || t.tracking_id,
                        },
                      });
                }),
                (e.trackImpression = function () {
                  var t = {
                    index: e.props.index,
                    backendSource: e.backendSource,
                  };
                  we.R.trackDiscoveryImpression({ item: e.props.course }, t);
                }),
                e
              );
            }
            return (
              (0, a.Z)(r, [
                {
                  key: "renderInstructorContent",
                  value: function (e) {
                    return (0, w.jsx)(tp, { course: e });
                  },
                },
                {
                  key: "trackClick",
                  value: function (e) {
                    var t = parseInt(
                        e.currentTarget.getAttribute("data-course-id"),
                        10
                      ),
                      r = e.currentTarget.getAttribute(
                        "data-course-tracking-id"
                      );
                    (0, ht.g)({
                      courseId: t,
                      courseTrackingId: r,
                      componentName: "singleCourseUnit",
                    });
                  },
                },
                {
                  key: "render",
                  value: function () {
                    var e = this.props,
                      t = e.course,
                      r = e.showPersonalPlanBadge,
                      n = e.showCodingExercisesBadge,
                      o = e.ninterpolate,
                      a = e.locale,
                      s = (0, p.uf)(t.num_reviews, a),
                      c =
                        t.badges &&
                        t.badges.length &&
                        !t.is_in_user_subscription
                          ? (0, ke.Vg)(t.badges[0].badge_family)
                          : null,
                      u =
                        n &&
                        t.is_coding_exercises_badge_eligible &&
                        (0, ke.Vg)(F.QH),
                      l = y()(
                        dp().container,
                        dp()["course-wrapper"],
                        (0, i.Z)(
                          {},
                          dp()["course-wrapper__multi"],
                          this.store && this.store.courses.length > 1
                        )
                      );
                    return (0, w.jsxs)("a", {
                      href: t.is_in_user_subscription ? t.learn_url : t.url,
                      className: y()("ud-custom-focus-visible", l),
                      "data-purpose": "container",
                      "data-course-id": t.id,
                      "data-course-tracking-id":
                        t.frontendTrackingId || t.tracking_id,
                      onClick: this.trackClick,
                      onContextMenu: this.trackClick,
                      children: [
                        (0, w.jsxs)("div", {
                          className: dp()["image-wrapper"],
                          children: [
                            (0, w.jsx)(be.E, {
                              src: t.image_480x270,
                              srcSet: ""
                                .concat(t.image_480x270, " 1x, ")
                                .concat(t.image_750x422, " 2x"),
                              alt: "",
                              width: 480,
                              height: 270,
                              className: dp()["course-image"],
                            }),
                            t.is_in_personal_plan_collection &&
                              r &&
                              (0, w.jsx)(Jl.J, {}),
                            t.is_in_premium &&
                              !t.is_in_user_subscription &&
                              (0, w.jsx)(je.F, { onCardDetails: !1 }),
                          ],
                        }),
                        (0, w.jsx)(R.H, {
                          trackFunc: this.trackImpression,
                          children: (0, w.jsxs)("div", {
                            className: dp()["main-content"],
                            children: [
                              (0, w.jsx)("div", {
                                className: y()(
                                  "ud-heading-lg ud-focus-visible-target",
                                  dp()["course-title"]
                                ),
                                children: t.title,
                              }),
                              t.headline &&
                                (0, w.jsx)(
                                  "p",
                                  yp(
                                    {
                                      className: y()(
                                        "ud-text-sm",
                                        dp()["course-headline"]
                                      ),
                                    },
                                    (0, Xl.S)({
                                      descriptionOfCaller:
                                        "single-course-unit:headline",
                                      html: t.headline,
                                    })
                                  )
                                ),
                              (0, w.jsx)("div", {
                                className: dp()["info-row"],
                                children: (0, w.jsx)("div", {
                                  className: y()(
                                    "ud-text-xs",
                                    dp()["instructor-titles"]
                                  ),
                                  "data-purpose": "instructor-titles",
                                  children: (0, w.jsx)(lp, {
                                    instructors: t.visible_instructors,
                                  }),
                                }),
                              }),
                              (0, w.jsxs)("div", {
                                className: dp()["info-row"],
                                children: [
                                  t.visible_instructors &&
                                    t.visible_instructors.length > 0 &&
                                    this.renderInstructorContent(t),
                                  (0, w.jsx)(bp, {
                                    contentInfo: t.content_info,
                                    numPublishedLectures:
                                      t.num_published_lectures,
                                    level: t.instructional_level_simple,
                                  }),
                                ],
                              }),
                              (0, w.jsxs)("div", {
                                className: dp()["info-row"],
                                children: [
                                  (0, w.jsxs)("div", {
                                    className: dp()["star-rating-wrapper"],
                                    children: [
                                      (0, w.jsx)(Oe.Z, {
                                        showNumber: !0,
                                        rating: t.rating,
                                      }),
                                      (0, w.jsx)("span", {
                                        className: "ud-sr-only",
                                        children: o(
                                          "%(count)s review",
                                          "%(count)s reviews",
                                          t.num_reviews,
                                          { count: s }
                                        ),
                                      }),
                                      (0, w.jsx)("span", {
                                        "aria-hidden": "true",
                                        className: y()(
                                          "ud-text-xs",
                                          dp()["reviews-text"]
                                        ),
                                        children: "(".concat(s, ")"),
                                      }),
                                    ],
                                  }),
                                  c && (0, w.jsx)(c, {}),
                                  u && (0, w.jsx)(u, {}),
                                ],
                              }),
                              this.renderPriceText(t),
                            ],
                          }),
                        }),
                      ],
                    });
                  },
                },
              ]),
              r
            );
          })(b.Component))
        ) || sp;
      vp.defaultProps = {
        course: void 0,
        index: void 0,
        showPersonalPlanBadge: !1,
        showCodingExercisesBadge: !1,
      };
      var gp,
        _p,
        Op,
        wp = (0, f.n0)((0, p.GV)(vp)),
        kp =
          (0, x.lK)({
            hasCoarsePointer: "(any-pointer: coarse)",
            hasFinePointer: "(any-pointer: fine)",
            hasPrimaryCoarsePointer: "(pointer: coarse)",
          })(
            ((up = (function (e) {
              (0, s.Z)(r, e);
              var t = mp(r);
              function r(e) {
                var n;
                return (
                  (0, o.Z)(this, r),
                  ((n = t.call(this, e)).store = new fp(n.props.unit)),
                  n
                );
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "render",
                    value: function () {
                      var e = this.props,
                        t = e.alternateHeadline,
                        r = e.className,
                        n = e.showTitle,
                        i = e.titleTypography,
                        o = e.hasCoarsePointer,
                        a = e.hasFinePointer,
                        s = e.hasPrimaryCoarsePointer,
                        c = s ? j.l : Gl.J;
                      return (0, w.jsxs)("div", {
                        className: r,
                        children: [
                          n &&
                            (0, w.jsx)("h2", {
                              className: y()(i, dp().title),
                              "data-purpose": "single-course-unit-title",
                              children: this.store.title,
                            }),
                          !n &&
                            t &&
                            this.store.courses.length &&
                            (0, w.jsx)(Ru.Z, {
                              titleTag: "h2",
                              title: t.title,
                              secondaryText: t.secondaryText,
                            }),
                          (0, w.jsx)(c, {
                            allowScroll: o,
                            showPager: a,
                            prioritizeTouch: s,
                            className: dp()["carousel-courses"],
                            pagerButtonClassName:
                              "single-course-unit__pager-button",
                            children: this.store.courses.map(function (e, t) {
                              return (0,
                              w.jsx)(xe.m, { item: e, children: (0, w.jsx)(wp, { course: e, index: t }) }, e.id);
                            }),
                          }),
                        ],
                      });
                    },
                  },
                ]),
                r
              );
            })(b.Component)),
            (up.defaultProps = {
              alternateHeadline: void 0,
              className: "",
              showTitle: !0,
              titleTypography: "ud-heading-xl",
              hasCoarsePointer: null,
              hasFinePointer: null,
              hasPrimaryCoarsePointer: null,
            }),
            (cp = up))
          ) || cp,
        xp = r(10249),
        Pp = r(23890),
        jp = r(98423),
        Zp = r(92699),
        Rp = r.n(Zp),
        Tp = r(43277),
        Ep =
          ((gp = (function () {
            function e(t, r) {
              var n =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : {};
              (0, o.Z)(this, e),
                (this.backendSource = Ee.YV.backendSourceOptions.DISCOVERY),
                (this.pageType = t),
                (0, Te.dw)(this, { unit: r, loading: !1, error: null }),
                (0, we.q)(this.unit.items),
                (this.discoveryAPI = new Tp.Z({}, n));
            }
            return (
              (0, a.Z)(e, [
                {
                  key: "fetchUnit",
                  value: (function () {
                    var e = (0, Qt.Z)(
                      $t().mark(function e(t) {
                        var r, n;
                        return $t().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  if (!this.loading) {
                                    e.next = 2;
                                    break;
                                  }
                                  return e.abrupt("return");
                                case 2:
                                  return (
                                    (this.loading = !0),
                                    (e.prev = 3),
                                    (e.next = 6),
                                    this.discoveryAPI.loadItemsForUnit(
                                      this.unit,
                                      this.pageType,
                                      t
                                    )
                                  );
                                case 6:
                                  (r = e.sent),
                                    (n = r.unit),
                                    this.receiveUnit(n),
                                    (e.next = 14);
                                  break;
                                case 11:
                                  (e.prev = 11),
                                    (e.t0 = e.catch(3)),
                                    this.receiveError(e.t0);
                                case 14:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[3, 11]]
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
                    (this.loading = !1),
                      (this.unit.items = this.unit.items.concat(e.items)),
                      (0, we.q)(this.unit.items);
                  },
                },
                {
                  key: "receiveError",
                  value: function (e) {
                    (this.loading = !1), (this.error = e);
                  },
                },
              ]),
              e
            );
          })()),
          (0, Re.Z)(
            gp.prototype,
            "fetchUnit",
            [Te.aD],
            Object.getOwnPropertyDescriptor(gp.prototype, "fetchUnit"),
            gp.prototype
          ),
          (0, Re.Z)(
            gp.prototype,
            "receiveUnit",
            [Te.aD],
            Object.getOwnPropertyDescriptor(gp.prototype, "receiveUnit"),
            gp.prototype
          ),
          (0, Re.Z)(
            gp.prototype,
            "receiveError",
            [Te.aD],
            Object.getOwnPropertyDescriptor(gp.prototype, "receiveError"),
            gp.prototype
          ),
          gp),
        Ip = r(7441),
        Cp = r.n(Ip),
        Sp = ["trackImpressionFunc"];
      function Dp(e, t) {
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
      function Ap(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Dp(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Dp(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function Lp(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Np,
        Up,
        Mp =
          (0, m.f3)(function (e) {
            var t = e.trackingContext;
            return { trackingContext: void 0 === t ? {} : t };
          })(
            (_p =
              (0, xe.z)("course")(
                ((Op = (function (e) {
                  (0, s.Z)(r, e);
                  var t = Lp(r);
                  function r() {
                    var e;
                    (0, o.Z)(this, r);
                    for (
                      var n = arguments.length, i = new Array(n), a = 0;
                      a < n;
                      a++
                    )
                      i[a] = arguments[a];
                    return (
                      ((e = t.call.apply(t, [this].concat(i))).trackImpression =
                        function () {
                          var t = e.props.trackingContext,
                            r = t.trackImpressionFunc,
                            n = (0, he.Z)(t, Sp);
                          r({ item: e.props.course }, n);
                        }),
                      (e.trackClick = function () {
                        var t = e.props.trackingClickCallbackFunc;
                        (0, ht.g)({
                          courseId: e.props.course.id,
                          courseTrackingId:
                            e.props.course.frontendTrackingId ||
                            e.props.course.tracking_id,
                          componentName: "courseCard",
                        }),
                          t && t();
                      }),
                      e
                    );
                  }
                  return (
                    (0, a.Z)(r, [
                      {
                        key: "render",
                        value: function () {
                          var e = this.props,
                            t = e.course,
                            r = e.className,
                            n = e.titleTag,
                            i = t.badges && t.badges.length > 0 && t.badges[0],
                            o = i && (0, ke.Vg)(i.badge_family);
                          return (0, w.jsx)(R.H, {
                            trackFunc: this.trackImpression,
                            children: (0, w.jsxs)("div", {
                              className: y()(r, Cp().card),
                              children: [
                                (0, w.jsx)(n, {
                                  children: (0, w.jsx)("a", {
                                    className: y()(
                                      "ud-heading-lg",
                                      Cp()["course-title"]
                                    ),
                                    "data-purpose": "course-title",
                                    href: t.url,
                                    onClick: this.trackClick,
                                    children: t.title,
                                  }),
                                }),
                                t.visible_instructors.length &&
                                  (0, w.jsx)(
                                    "div",
                                    Ap(
                                      {
                                        className: y()(
                                          "ud-text-sm",
                                          Cp()["instructor-list"]
                                        ),
                                      },
                                      (0, zc.S)({
                                        descriptionOfCaller:
                                          "course-card:visible-instructors",
                                        html: t.visible_instructors
                                          .map(function (e) {
                                            return e.display_name;
                                          })
                                          .join(", "),
                                      })
                                    )
                                  ),
                                (0, w.jsx)("div", {
                                  className: y()(
                                    "ud-text-sm",
                                    Cp()["num-students"]
                                  ),
                                  children: ninterpolate(
                                    "%(numSubscriber)s student",
                                    "%(numSubscriber)s students",
                                    t.num_subscribers,
                                    {
                                      numSubscriber: (0, mt.uf)(
                                        t.num_subscribers
                                      ),
                                    }
                                  ),
                                }),
                                (0, w.jsxs)("div", {
                                  className: Cp().row,
                                  children: [
                                    (0, w.jsx)(Oe.Z, {
                                      showNumber: !0,
                                      rating: t.rating,
                                    }),
                                    (0, w.jsx)("span", {
                                      "aria-label": ninterpolate(
                                        "%(count)s review",
                                        "%(count)s reviews",
                                        t.num_reviews,
                                        { count: t.num_reviews }
                                      ),
                                      className: y()(
                                        "ud-text-xs",
                                        Cp()["reviews-text"]
                                      ),
                                      children: "(".concat(
                                        (0, mt.uf)(t.num_reviews),
                                        ")"
                                      ),
                                    }),
                                  ],
                                }),
                                o && (0, w.jsx)(o, {}),
                              ],
                            }),
                          });
                        },
                      },
                    ]),
                    r
                  );
                })(b.Component)),
                (Op.defaultProps = {
                  className: void 0,
                  trackingClickCallbackFunc: void 0,
                  titleTag: "div",
                }),
                (_p = Op))
              ) || _p)
          ) || _p;
      function Bp(e, t) {
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
      function Fp(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Bp(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Bp(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function zp(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Vp,
        Hp,
        Wp =
          (0, m.f3)(
            "discoveryUnitsStore",
            "funnelLogContextStore"
          )(
            (Np =
              (0, m.Pi)(
                ((Up = (function (e) {
                  (0, s.Z)(r, e);
                  var t = zp(r);
                  function r(e) {
                    var n;
                    (0, o.Z)(this, r),
                      ((n = t.call(this, e)).fetch = function () {
                        return n.store.fetchUnit({ pageSize: 6 });
                      });
                    var i = n.props,
                      a = i.discoveryUnitsStore,
                      s = i.unit,
                      c = a.pageType;
                    return (
                      (n.store = new Ep(c, s, n.props.udData)),
                      n.props.funnelLogContextStore.updateContext({
                        context2: "featured",
                        subcontext: n.props.unit.title,
                        subcontext2: n.props.unit.id,
                      }),
                      n
                    );
                  }
                  return (
                    (0, a.Z)(r, [
                      {
                        key: "componentDidMount",
                        value: function () {
                          this.store.unit.items.length || this.fetch();
                        },
                      },
                      {
                        key: "render",
                        value: function () {
                          var e = this;
                          return !this.store.unit.items.length &&
                            this.store.loading
                            ? (0, w.jsx)(jp.u, {
                                rowCount: 3,
                                size: "small",
                                cardCountPerRow: 2,
                                style: { width: "100%", height: "150px" },
                              })
                            : (0, w.jsx)("div", {
                                className: y()(
                                  this.props.className,
                                  Rp().container
                                ),
                                children: this.store.unit.items.map(function (
                                  t,
                                  r
                                ) {
                                  return (0, w.jsx)(
                                    l.G,
                                    {
                                      trackingContext: {
                                        trackImpressionFunc:
                                          we.R.trackDiscoveryImpression,
                                        index: r,
                                        backendSource: e.store.backendSource,
                                      },
                                      children: (0, w.jsx)(
                                        Mp,
                                        Fp({ course: t }, e.props.cardProps),
                                        t.id
                                      ),
                                    },
                                    t.id
                                  );
                                }),
                              });
                        },
                      },
                    ]),
                    r
                  );
                })(b.Component)),
                (Up.defaultProps = { className: void 0, cardProps: void 0 }),
                (Np = Up))
              ) || Np)
          ) || Np,
        Gp = (0, f.n0)(Wp),
        Kp = r(65641),
        qp = r.n(Kp),
        Yp = function (e) {
          var t = e.sourceObjectId,
            r = (0, f.gL)().Config,
            n = (0, f.j5)();
          function i(e) {
            return n.toStorageStaticAsset(
              "consumer-subscription/window-shopping/".concat(e),
              { Config: r }
            );
          }
          var o = i("mobile/".concat(t, ".png")),
            a = i("desktop/".concat(t, ".jpg")),
            s = i("desktop/".concat(t, "-2x.jpg"));
          return (0, w.jsxs)("div", {
            className: qp()["image-container"],
            children: [
              (0, w.jsx)(be.E, {
                className: y()(qp()["banner-image"], qp()["on-mobile"]),
                "data-purpose": "mobile-banner",
                width: "unset",
                height: "unset",
                src: o,
                alt: "",
              }),
              (0, w.jsx)(be.E, {
                className: y()(qp()["banner-image"], qp()["on-desktop"]),
                "data-purpose": "desktop-banner",
                width: "unset",
                height: "unset",
                src: a,
                srcSet: "".concat(a, " 1x, ").concat(s, " 2x"),
                alt: "",
              }),
            ],
          });
        },
        Qp = r(19886),
        Jp = r.n(Qp);
      function Xp(e, t) {
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
      function $p(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Xp(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : Xp(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var ed,
        td,
        rd =
          ((Vp = (0, a.Z)(function e(t) {
            (0, o.Z)(this, e),
              (0, Ze.Z)(this, "setUnits", Hp, this),
              (this.subUnits = (0, Te.LO)([])),
              (this.items = t.items),
              t &&
                t.available_filters &&
                t.available_filters.units &&
                this.setUnits(t.available_filters.units);
          })),
          (Hp = (0, Re.Z)(Vp.prototype, "setUnits", [Te.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                t.forEach(function (t, r) {
                  0 === r
                    ? e.subUnits.push($p($p({}, t), {}, { items: e.items }))
                    : e.subUnits.push($p($p({}, t), {}, { items: [] }));
                });
              };
            },
          })),
          Vp);
      function nd(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var id,
        od,
        ad =
          (0, x.lK)({ isMobileMax: "mobile-max" })(
            (ed =
              (0, m.Pi)(
                ((td = (function (e) {
                  (0, s.Z)(r, e);
                  var t = nd(r);
                  function r(e) {
                    var n;
                    return (
                      (0, o.Z)(this, r),
                      ((n = t.call(this, e)).store = new rd(n.props.unit)),
                      n
                    );
                  }
                  return (
                    (0, a.Z)(r, [
                      {
                        key: "renderContentWithCTA",
                        value: function (e) {
                          var t = this.props,
                            r = t.renderCta,
                            n = t.showNumAdditionalCourses,
                            i = t.cardProps,
                            o = t.gettext,
                            a = t.interpolate;
                          return (0, w.jsxs)("div", {
                            className: Jp()["content-with-cta"],
                            children: [
                              (0, w.jsx)(Gp, {
                                unit: e,
                                className: Jp()["card-container"],
                                cardProps: i,
                              }),
                              n &&
                                (0, w.jsx)("div", {
                                  className: y()(
                                    "ud-heading-sm",
                                    Jp()["num-courses-text"]
                                  ),
                                  "data-purpose": "num-courses-text",
                                  children: a(
                                    o(
                                      "+%(courseCount)s other top %(topic)s courses"
                                    ),
                                    { courseCount: 0, topic: e.title },
                                    !0
                                  ),
                                }),
                              r &&
                                (0, w.jsxs)("div", {
                                  className: Jp()["cta-wrapper"],
                                  "data-purpose": "cta-wrapper",
                                  children: [
                                    (0, w.jsx)("div", {
                                      className: "ud-heading-lg",
                                      children: o(
                                        "Start exploring the collection today."
                                      ),
                                    }),
                                    r,
                                  ],
                                }),
                            ],
                          });
                        },
                      },
                      {
                        key: "render",
                        value: function () {
                          var e = this,
                            t = this.store.subUnits,
                            r = this.props,
                            n = r.showBannerImage,
                            i = r.ariaLabelledBy,
                            o = r.isMobileMax;
                          return (0, w.jsx)("section", {
                            "aria-labelledby": i,
                            children: (0, w.jsx)(Pp.m, {
                              prioritizeTouch: !!o,
                              children: t.map(function (t) {
                                return (0,
                                w.jsx)(Pp.m.Tab, { title: t.title, children: n ? (0, w.jsxs)("div", { className: Jp().container, children: [(0, w.jsx)(Yp, { "data-purpose": "image-banner", sourceObjectId: t.source_object_id }), e.renderContentWithCTA(t)] }) : (0, w.jsx)(w.Fragment, { children: e.renderContentWithCTA(t) }) }, t.title);
                              }),
                            }),
                          });
                        },
                      },
                    ]),
                    r
                  );
                })(b.Component)),
                (td.defaultProps = {
                  ariaLabelledBy: "exploreCollectionHeading",
                  renderCta: void 0,
                  showBannerImage: !0,
                  showNumAdditionalCourses: !1,
                  cardProps: void 0,
                  isMobileMax: null,
                }),
                (ed = td))
              ) || ed)
          ) || ed,
        sd = (0, p.GV)(ad),
        cd = r(52466);
      function ud(e, t) {
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
      function ld(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? ud(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : ud(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function pd(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var dd =
          (0, m.f3)(function (e) {
            return { shouldSendPerfMetric: e.shouldSendPerfMetric };
          })(
            ((od = (function (e) {
              (0, s.Z)(r, e);
              var t = pd(r);
              function r() {
                var e;
                (0, o.Z)(this, r);
                for (
                  var n = arguments.length, i = new Array(n), a = 0;
                  a < n;
                  a++
                )
                  i[a] = arguments[a];
                return (
                  ((e = t.call.apply(t, [this].concat(i))).onLoad =
                    function () {
                      e.props.shouldSendPerfMetric &&
                        Hc.Z.mark("udlite.first-unit-loaded");
                    }),
                  e
                );
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "render",
                    value: function () {
                      var e,
                        t = {},
                        r = {};
                      switch (this.props.unit.type) {
                        case "assessments":
                        case "algorithm_based_assessments_with_filter":
                        case "algorithm_based_assessments_without_filter":
                          (e = fe),
                            (r =
                              this.props.unitPropsByType.AssessmentUnit || {});
                          break;
                        case "bestseller_labels":
                          (t = { subcontext: "affinity" }),
                            "included_topics" === this.props.unit.view_type
                              ? ((e = Et.Q), (r = {}))
                              : ((e = pl),
                                (r =
                                  this.props.unitPropsByType
                                    .PopularTopicsUnit || {}));
                          break;
                        case "featured_course":
                        case "top_pick":
                          (t = {
                            context2: "featured",
                            subcontext: this.props.unit.title,
                            subcontext2: this.props.unit.id,
                          }),
                            (e = kp),
                            (r =
                              this.props.unitPropsByType.SingleCourseUnit ||
                              {});
                          break;
                        case "related_categories_and_subcategories":
                          (e = ml),
                            (r =
                              this.props.unitPropsByType
                                .RelatedCategoriesUnit || {});
                          break;
                        case "top_instructor":
                          (t = {
                            context2: "featured",
                            subcontext: this.props.unit.title,
                            subcontext2: this.props.unit.id,
                          }),
                            (e = al),
                            (r = ld(
                              { componentName: "popular_instructors_unit" },
                              this.props.unitPropsByType.PopularInstructorsUnit
                            ));
                          break;
                        case "discovery_value_props":
                          (e = xp.Z),
                            (r = this.props.unitPropsByType.ValueProps || {});
                          break;
                        case "featured_topics_unit":
                          e = function () {
                            return null;
                          };
                          break;
                        case "next_topics":
                          (e = Nc),
                            (r =
                              this.props.unitPropsByType.NextTopicsUnit || {});
                          break;
                        case "algorithm_based_lectures":
                        case "cluster_lectures":
                          (e = jc),
                            (r = this.props.unitPropsByType.LectureUnit || {});
                          break;
                        case "algorithm_based_occupation":
                          (e = Ll),
                            (r =
                              this.props.unitPropsByType
                                .RelatedOccupationsUnit || {});
                          break;
                        case "algorithm_based_labs":
                        case "algorithm_based_labs_with_filter":
                        case "algorithm_based_labs_without_filter":
                          (e = _s),
                            (r = this.props.unitPropsByType.LabUnit || {});
                          break;
                        default:
                          switch (this.props.unit.view_type) {
                            case "sequence":
                              (e = Wl),
                                (t = { context2: "sequence" }),
                                (r =
                                  this.props.unitPropsByType.SequenceUnit ||
                                  {});
                              break;
                            case "course_comparison":
                              (e = Rt),
                                (t = { context2: "course_comparison" }),
                                (r =
                                  this.props.unitPropsByType.CourseComparison ||
                                  {});
                              break;
                            case "horizontal_tabbed":
                              (e = v.f),
                                (r =
                                  this.props.unitPropsByType.SkillsHubUnit ||
                                  {});
                              break;
                            case "lectures_by_topic":
                              (e = _c),
                                (r =
                                  this.props.unitPropsByType
                                    .LectureStackRecommendationUnit || {});
                              break;
                            case "popular_topics":
                              (t = { subcontext: "affinity" }),
                                (e = pl),
                                (r =
                                  this.props.unitPropsByType
                                    .PopularTopicsUnit || {});
                              break;
                            case "occupation":
                              (e = Zu),
                                (r =
                                  this.props.unitPropsByType.OccupationUnit ||
                                  {});
                              break;
                            case "window_shopping":
                              (e = sd),
                                (r =
                                  this.props.unitPropsByType
                                    .WindowShoppingUnit || {});
                              break;
                            case "single_course":
                              (e = kp),
                                (r =
                                  this.props.unitPropsByType.SingleCourseUnit ||
                                  {});
                              break;
                            default:
                              (t = {
                                context2: "featured",
                                subcontext: this.props.unit.title,
                                subcontext2: this.props.unit.id,
                              }),
                                (e = Tt.$H),
                                (r =
                                  this.props.unitPropsByType.CourseUnit || {});
                          }
                      }
                      return (
                        "ufb_onboarding" === this.props.unit.view_type &&
                          (this.props.unit.actionLink = {
                            text: this.props.gettext("Edit selection"),
                            buttonProps: {
                              href: "/organization/onboarding?p=1",
                            },
                          }),
                        (0, w.jsx)(k, {
                          children: (0, w.jsx)(
                            g.Xg,
                            ld(
                              ld({ pageType: this.props.pageType }, t),
                              {},
                              {
                                children: (0, w.jsx)(
                                  e,
                                  ld(
                                    ld(ld({}, this.props), r),
                                    {},
                                    { onLoad: this.onLoad }
                                  )
                                ),
                              }
                            )
                          ),
                        })
                      );
                    },
                  },
                ]),
                r
              );
            })(b.Component)),
            (od.defaultProps = {
              shouldSendPerfMetric: !1,
              unitPropsByType: {},
            }),
            (id = od))
          ) || id,
        fd = (0, p.GV)(dd),
        hd = r(454);
      function yd(e, t) {
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
      function md(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? yd(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : yd(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function bd(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var vd = (function (e) {
        (0, s.Z)(r, e);
        var t = bd(r);
        function r() {
          var e;
          (0, o.Z)(this, r);
          for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++)
            i[a] = arguments[a];
          return (
            ((e = t.call.apply(t, [this].concat(i))).handleFirstChildChange =
              function (t, r) {
                window.setTimeout(function () {
                  t.isIntersecting && (r(), e.props.onFirstChildEnter(t));
                }, 0);
              }),
            (e.handleLastChildChange = function (t, r) {
              window.setTimeout(function () {
                t.isIntersecting && (r(), e.props.onLastChildEnter(t));
              }, 0);
            }),
            e
          );
        }
        return (
          (0, a.Z)(r, [
            {
              key: "render",
              value: function () {
                var e = this,
                  t = this.props,
                  r = t.children,
                  n = t.rootId;
                return b.Children.toArray(r)
                  .filter(function (e) {
                    return !!e;
                  })
                  .map(function (t, r, i) {
                    var o = 0 === r,
                      a = r === i.length - 1;
                    return a || (o && e.props.onFirstChildEnter)
                      ? (0, b.createElement)(
                          hd.ZP,
                          md(
                            md({}, t.props),
                            {},
                            {
                              onChange: a
                                ? e.handleLastChildChange
                                : e.handleFirstChildChange,
                              root: n && "#".concat(n),
                              key: t.key,
                            }
                          ),
                          t
                        )
                      : t;
                  });
              },
            },
          ]),
          r
        );
      })(b.Component);
      vd.defaultProps = { onFirstChildEnter: void 0, rootId: void 0 };
      var gd,
        _d,
        Od = r(26142),
        wd = r(66089),
        kd = r(59862),
        xd = r(50552),
        Pd = r.n(xd);
      function jd(e, t) {
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
      function Zd(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? jd(Object(r), !0).forEach(function (t) {
                (0, i.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : jd(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      function Rd(e) {
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
            n = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, c.Z)(this, r);
        };
      }
      var Td =
          (0, m.Pi)(
            ((_d = (function (e) {
              (0, s.Z)(r, e);
              var t = Rd(r);
              function r(e) {
                var n;
                (0, o.Z)(this, r),
                  ((n = t.call(this, e)).renderUnit = function (e, t) {
                    var r = n.props,
                      i = r.pageType,
                      o = r.unitPropsByType;
                    if ("related_categories_and_subcategories" === e.type)
                      return (0, w.jsx)(fd, {
                        unit: e,
                        unitPropsByType: o,
                        pageType: i,
                        "data-item-index": 0,
                        className: Pd()["related-categories"],
                      });
                    if (
                      i === cd.w8 &&
                      "recently_viewed_and_wishlisted" === e.type
                    )
                      return (0, w.jsx)(fd, {
                        unit: e,
                        pageType: i,
                        "data-item-index": 0,
                        showTitle: !0,
                        className: "component-margin",
                      });
                    if (i === cd.sV && "labels" === e.type)
                      return (0, w.jsx)(fd, {
                        unit: e,
                        pageType: i,
                        "data-item-index": -1,
                        showTitle: !0,
                        className: y()(
                          "component-margin",
                          Pd()["topic-labels"]
                        ),
                      });
                    if ("bestseller_labels" === e.type)
                      return (0, w.jsx)(fd, {
                        unit: e,
                        unitPropsByType: o,
                        pageType: n.props.pageType,
                        className: "component-margin",
                      });
                    var a =
                      ([cd.B9, cd.zk, cd.l5].includes(n.props.pageType) &&
                        0 === t) ||
                      !n.props.showTitle;
                    return [cd.UA, cd.Ge, cd.yW].includes(i) &&
                      "bestseller" === e.type
                      ? (0, w.jsx)(
                          fd,
                          Zd(
                            Zd({}, n.props),
                            {},
                            {
                              unit: e,
                              pageType: i,
                              showTitle: !1,
                              className: "component-margin",
                              deviceType: n.props.deviceType,
                              "data-item-index": 0,
                            }
                          )
                        )
                      : (0, w.jsx)(
                          fd,
                          Zd(
                            Zd({}, n.props),
                            {},
                            {
                              alternateHeadline: n.props.alternateHeadline,
                              unit: e,
                              pageType: i,
                              showTitle: !a,
                              className: "component-margin",
                              deviceType: n.props.deviceType,
                              "data-item-index":
                                e.type && n.props.itemIndicesByType[e.type],
                            }
                          )
                        );
                  }),
                  (n.handleLastChildEnter = function () {
                    if (!n.props.disableInfiniteScroll) {
                      var e = Zd(
                        { pageSize: 6, itemCount: n.props.itemCount },
                        n.props.fetchOptions
                      );
                      n.store.fetchUnits(e);
                    }
                  }),
                  (n.refreshPage = function () {
                    window.location.reload(!0);
                  });
                var i = e.pageType,
                  a = e.pageObjectId,
                  s = e.pageObject,
                  c = e.units;
                return (
                  (n.store =
                    e.store ||
                    new wd.Z(
                      { pageType: i, units: c, pageObjectId: a, pageObject: s },
                      n.props.udData
                    )),
                  n
                );
              }
              return (
                (0, a.Z)(r, [
                  {
                    key: "componentDidMount",
                    value: function () {
                      if (this.props.units.length)
                        this.store.processPreloadedUnits();
                      else {
                        var e = Zd(
                          { pageSize: 6, itemCount: this.props.itemCount },
                          this.props.fetchOptions
                        );
                        this.store.fetchUnits(e);
                      }
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this.props,
                        t = e.gettext,
                        r = e.pgettext,
                        i = e.skeletonComponent,
                        o = e.filter,
                        a = e.children;
                      return this.store.error
                        ? (0, w.jsxs)(w.Fragment, {
                            children: [
                              (0, w.jsx)(d.Y, {
                                title: t(
                                  "There was a problem loading course recommendations"
                                ),
                                body: t(
                                  "Please reload the page to resolve this issue"
                                ),
                                ctaText: r(
                                  "e.g. Refresh a webpage",
                                  "Reload Page"
                                ),
                                onAction: this.refreshPage,
                                udStyle: "warning",
                              }),
                              (0, w.jsx)(i, { className: "component-margin" }),
                            ],
                          })
                        : this.store.firstLoad
                        ? (0, w.jsx)(i, { className: "component-margin" })
                        : this.store.units.length
                        ? (0, w.jsx)(m.zt, {
                            discoveryUnitsStore: this.store,
                            children: (0, w.jsx)(l.G, {
                              trackingContext: {
                                trackImpressionFunc:
                                  we.R.trackDiscoveryImpression,
                                backendSource: this.store.backendSource,
                              },
                              children: (0, w.jsx)(vd, {
                                onLastChildEnter: this.handleLastChildEnter,
                                children: (0, Od.e)(
                                  [].concat(
                                    (0, n.Z)(
                                      this.store.units
                                        .filter(o)
                                        .map(this.renderUnit)
                                    ),
                                    (0, n.Z)(b.Children.toArray(a))
                                  )
                                )
                                  .filter(Boolean)
                                  .map(function (e, t) {
                                    return (0,
                                    w.jsx)(Ed, { shouldSendPerfMetric: 0 === t, children: e }, t);
                                  }),
                              }),
                            }),
                          })
                        : null;
                    },
                  },
                ]),
                r
              );
            })(b.Component)),
            (_d.defaultProps = {
              alternateHeadline: void 0,
              disableInfiniteScroll: !1,
              itemCount: 12,
              units: [],
              pageObjectId: void 0,
              pageObject: {},
              filter: function () {
                return !0;
              },
              showTitle: !0,
              store: void 0,
              skeletonComponent: kd.Z,
              fetchOptions: {},
              itemIndicesByType: {},
            }),
            (gd = _d))
          ) || gd,
        Ed = (function (e) {
          (0, s.Z)(r, e);
          var t = Rd(r);
          function r() {
            return (0, o.Z)(this, r), t.apply(this, arguments);
          }
          return (
            (0, a.Z)(r, [
              {
                key: "render",
                value: function () {
                  return (0, w.jsx)(m.zt, {
                    shouldSendPerfMetric: this.props.shouldSendPerfMetric,
                    children: this.props.children,
                  });
                },
              },
            ]),
            r
          );
        })(b.Component),
        Id = (0, p.GV)((0, f.n0)(Td));
    },
    59862: function (e, t, r) {
      "use strict";
      var n = r(74404),
        i = r(94184),
        o = r.n(i),
        a = (r(67294), r(61159)),
        s = r.n(a),
        c = r(85893),
        u = function (e) {
          var t = e.className,
            r = [1, 2].map(function (e) {
              return (0,
              c.jsxs)("div", { className: s()["skeleton-unit"], children: [(0, c.jsx)("div", { className: s().title }), (0, c.jsxs)("div", { className: s()["skeleton-card"], children: [(0, c.jsx)("div", { className: s()["course-image"] }), (0, c.jsxs)("div", { className: s()["info-container"], children: [(0, c.jsx)("div", { className: s()["course-info"] }), (0, c.jsx)("div", { className: s()["course-info"] }), (0, c.jsx)("div", { className: s()["course-info"] }), (0, c.jsx)("div", { className: s()["course-info"] })] })] }), (0, c.jsxs)("div", { className: s()["skeleton-card"], children: [(0, c.jsx)("div", { className: s()["course-image"] }), (0, c.jsxs)("div", { className: s()["info-container"], children: [(0, c.jsx)("div", { className: s()["course-info"] }), (0, c.jsx)("div", { className: s()["course-info"] }), (0, c.jsx)("div", { className: s()["course-info"] }), (0, c.jsx)("div", { className: s()["course-info"] })] })] }), (0, c.jsxs)("div", { className: s()["skeleton-card"], children: [(0, c.jsx)("div", { className: s()["course-image"] }), (0, c.jsxs)("div", { className: s()["info-container"], children: [(0, c.jsx)("div", { className: s()["course-info"] }), (0, c.jsx)("div", { className: s()["course-info"] }), (0, c.jsx)("div", { className: s()["course-info"] }), (0, c.jsx)("div", { className: s()["course-info"] })] })] }), (0, c.jsxs)("div", { className: s()["skeleton-card"], children: [(0, c.jsx)("div", { className: s()["course-image"] }), (0, c.jsxs)("div", { className: s()["info-container"], children: [(0, c.jsx)("div", { className: s()["course-info"] }), (0, c.jsx)("div", { className: s()["course-info"] }), (0, c.jsx)("div", { className: s()["course-info"] }), (0, c.jsx)("div", { className: s()["course-info"] })] })] })] }, e);
            });
          return (0, c.jsx)(n.O, {
            children: (0, c.jsx)("div", {
              "data-purpose": "discovery-units-loading-skeleton",
              className: o()(t, s()["skeleton-units-container"]),
              children: r,
            }),
          });
        };
      (u.defaultProps = { className: void 0 }), (t.Z = u);
    },
    28017: function (e, t, r) {
      "use strict";
      var n = r(94184),
        i = r.n(n),
        o = r(67294),
        a = r(85668),
        s = r.n(a),
        c = r(85893),
        u = function (e) {
          var t = e.className,
            r = e.title,
            n = e.titleTag,
            a = e.secondaryText,
            u = e.titleClass,
            l = e.titleStyle,
            p = e.secondaryTextClass,
            d = e.secondaryTextStyle,
            f = e.layoutVariant,
            h = e.titleId,
            y = "ud-heading-xl",
            m = s()[l];
          switch (f) {
            case "compact":
              (y = "ud-heading-lg"),
                (m = s()["title-compact"]),
                (p = "ud-text-sm");
              break;
            case "default":
              y = "ud-heading-xl";
              break;
            case "large":
              y = "ud-heading-xxl";
          }
          (u = u || y), (h = "" !== h ? h : r);
          var b = o.createElement(
            n,
            { id: h, className: u, "data-purpose": "alternate-headline-title" },
            r
          );
          return (0, c.jsxs)("div", {
            className: i()(s()["title-container"], t),
            children: [
              (0, c.jsx)("div", { className: m, children: b }),
              a && (0, c.jsx)("p", { className: i()(p, s()[d]), children: a }),
            ],
          });
        };
      (u.defaultProps = {
        titleTag: "div",
        secondaryText: void 0,
        className: void 0,
        titleClass: void 0,
        titleStyle: "title",
        secondaryTextClass: "ud-text-md",
        secondaryTextStyle: "secondary-text",
        layoutVariant: "default",
        titleId: "",
      }),
        (t.Z = u);
    },
    27245: function (e, t, r) {
      "use strict";
      r.d(t, {
        s: function () {
          return s;
        },
      });
      var n = r(67294),
        i = r(54641),
        o = r.n(i),
        a = r(85893),
        s = function (e) {
          var t,
            r = e.children,
            i = e.threshold,
            s = void 0 === i ? 10 : i,
            c = e.enabled,
            u = void 0 === c || c,
            l = (0, n.useState)("left"),
            p = l[0],
            d = l[1],
            f = n.cloneElement(r, {
              onScroll: function (e) {
                var t = e.target,
                  r = t.scrollLeft,
                  n = t.scrollWidth,
                  i = t.offsetWidth;
                r <= s
                  ? d("left")
                  : r >= n - i - s
                  ? d("right")
                  : p && d(void 0);
              },
            });
          return (
            u &&
              (t = (0, a.jsxs)(a.Fragment, {
                children: [
                  "right" !== p &&
                    (0, a.jsx)("div", {
                      className: o()["gradient-right"],
                      "data-purpose": "gradient-right",
                    }),
                  "left" !== p &&
                    (0, a.jsx)("div", {
                      className: o()["gradient-left"],
                      "data-purpose": "gradient-left",
                    }),
                ],
              })),
            (0, a.jsxs)("div", {
              className: o()["gradient-container"],
              children: [f, t],
            })
          );
        };
    },
    89510: function (e, t, r) {
      "use strict";
      r.d(t, {
        P: function () {
          return m;
        },
        Q: function () {
          return y;
        },
      });
      var n = r(71361),
        i = r(79594),
        o = r(39290),
        a = r(14546),
        s = r(74404),
        c = r(33724),
        u = r(94184),
        l = r.n(u),
        p = (r(67294), r(27245)),
        d = r(19961),
        f = r.n(d),
        h = r(85893),
        y = function (e) {
          var t,
            r = e.unit,
            s = (0, n.ag)("mobile-max"),
            c = (0, i.QT)().gettext;
          return (0, h.jsxs)(h.Fragment, {
            children: [
              (0, h.jsx)("div", {
                className: l()("ud-text-bold", f()["topics-title"]),
                children: c("Sample topics:"),
              }),
              ((t = (0, h.jsx)("div", {
                className: f().topics,
                "data-purpose": "topics",
                children: (0, h.jsx)(o.K, {
                  className: f()["topics-row"],
                  children: r.items.map(function (e, t) {
                    return (0,
                    h.jsx)(o.K.Pill, { componentClass: "a", href: e.url, size: "small", children: e.title }, t);
                  }),
                }),
              })),
              s
                ? (0, h.jsx)(p.s, { children: t })
                : (0, h.jsx)(a.g, {
                    collapsedHeight: 40,
                    className: f()["show-more-right"],
                    children: t,
                  })),
            ],
          });
        },
        m = function () {
          return (0, h.jsxs)(h.Fragment, {
            children: [
              (0, h.jsx)(s.O, {
                className: f()["topics-title-skeleton"],
                children: (0, h.jsx)(c.g, {
                  className: f()["topics-title-skeleton-block"],
                }),
              }),
              (0, h.jsx)(s.O, {
                children: (0, h.jsx)(c.g, {
                  className: f()["topics-row-skeleton-block"],
                }),
              }),
            ],
          });
        };
    },
    10249: function (e, t, r) {
      "use strict";
      var n,
        i,
        o,
        a = r(92777),
        s = r(82262),
        c = r(45959),
        u = r(63553),
        l = r(37247),
        p = r(71218),
        d = r(71361),
        f = r(79594),
        h = r(62325),
        y = r.n(h),
        m = r(21042),
        b = r.n(m),
        v = r(82722),
        g = r.n(v),
        _ = r(7421),
        O = r(36186),
        w = r(94184),
        k = r.n(w),
        x = r(22188),
        P = r(80955),
        j = r(67294),
        Z = r(50771),
        R = r(31310),
        T = r.n(R),
        E = r(85893);
      function I(e) {
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
            n = (0, l.Z)(e);
          if (t) {
            var i = (0, l.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, u.Z)(this, r);
        };
      }
      var C =
        (0, d.lK)({ isMobileMax: "mobile-max" })(
          (n =
            (0, P.Pi)(
              ((o = (function (e) {
                (0, c.Z)(r, e);
                var t = I(r);
                function r() {
                  return (0, a.Z)(this, r), t.apply(this, arguments);
                }
                return (
                  (0, s.Z)(r, [
                    {
                      key: "isFirstVisitWithinSevenDays",
                      get: function () {
                        var e = this.props.udData,
                          t = e.me,
                          r = e.visiting;
                        if (r.isLoading || t.isLoading) return !1;
                        var n = new Date(r.first_visit_time).getTime(),
                          i = new Date(t.created || new Date()).getTime(),
                          o = n < i ? n : i;
                        return new Date() - o < 6048e5;
                      },
                    },
                    {
                      key: "render",
                      value: function () {
                        var e = this.props,
                          t = e.gettext,
                          r = e.interpolate,
                          n = e.udData,
                          i = e.isMobileMax,
                          o = n.Config,
                          a = n.site_stats,
                          s = null === i || i;
                        if (!this.isFirstVisitWithinSevenDays)
                          return (0, E.jsx)("div", {
                            className: "discovery-unit-empty-render",
                          });
                        var c = k()(
                          this.props.className,
                          "ud-full-width-container browse-value-props"
                        );
                        return (0, E.jsxs)("div", {
                          className: k()(c, T().wrapper),
                          "data-purpose": "value-props",
                          children: [
                            (0, E.jsx)("h2", {
                              className: k()("ud-heading-serif-xl", T().title),
                              children: t("Why learn on Udemy?"),
                            }),
                            (0, E.jsx)("div", {
                              className: "ud-container",
                              children: (0, E.jsxs)(_.h, {
                                size: "small",
                                children: [
                                  (0, E.jsx)(_.h.Prop, {
                                    icon: s ? null : g(),
                                    headline: r(
                                      t(
                                        "Learn in-demand skills with over %(numCoursesSiteStat)s video courses"
                                      ),
                                      {
                                        numCoursesSiteStat: "".concat(
                                          (0, Z.A)("num_courses_rounded", {
                                            Config: o,
                                            site_stats: a,
                                          })
                                        ),
                                      },
                                      !0
                                    ),
                                  }),
                                  (0, E.jsx)(_.h.Prop, {
                                    icon: s ? null : b(),
                                    headline: t(
                                      "Choose courses taught by real-world experts"
                                    ),
                                  }),
                                  (0, E.jsx)(_.h.Prop, {
                                    icon: s ? null : y(),
                                    headline: t(
                                      "Learn at your own pace, with lifetime access on mobile and desktop"
                                    ),
                                  }),
                                ],
                              }),
                            }),
                          ],
                        });
                      },
                    },
                  ]),
                  r
                );
              })(j.Component)),
              (o.defaultProps = { className: void 0, isMobileMax: null }),
              (i = o),
              (0, p.Z)(
                i.prototype,
                "isFirstVisitWithinSevenDays",
                [x.Fl],
                Object.getOwnPropertyDescriptor(
                  i.prototype,
                  "isFirstVisitWithinSevenDays"
                ),
                i.prototype
              ),
              (n = i))
            ) || n)
        ) || n;
      t.Z = (0, f.GV)((0, O.n0)(C));
    },
    19227: function (e, t, r) {
      "use strict";
      r.d(t, {
        k$: function () {
          return p;
        },
        gH: function () {
          return d;
        },
      });
      var n = r(73804),
        i = r(82262),
        o = r(92777),
        a = r(45959),
        s = r(63553),
        c = r(37247);
      function u(e) {
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
          return (0, s.Z)(this, r);
        };
      }
      var l = (function (e) {
          (0, a.Z)(r, e);
          var t = u(r);
          function r(e) {
            var n;
            return (
              (0, o.Z)(this, r),
              ((n = t.call(this, "LabsDiscoverEvent")).componentVisited =
                e.componentVisited),
              n
            );
          }
          return (0, i.Z)(r);
        })(r(24076).rp),
        p = Object.freeze({
          MY_LEARNING_SHOW_LABS: "my_learning_show_labs",
          MY_LEARNING_LABS_TAB: "my_learning_labs_tab",
          MY_LEARNING_LABS_PAGE: "my_learning_labs_page",
          LABS_LANDING_PAGE: "labs_landing_page",
          LABS_IN_COURSE_PROMPT: "labs_in_course_prompt",
          LABS_IN_SEARCH: "labs_in_search",
          LABS_UNIT_LIHP: "labs_unit_lihp",
          LABS_UNIT_TOPIC: "labs_unit_topic",
          LAB_OVERVIEW_PAGE: "lab_overview_page",
        }),
        d = Object.freeze({ DISCOVER: l, DISCOVERY_CARD_CLICK: n.kG });
    },
    31325: function (e, t, r) {
      "use strict";
      r.d(t, {
        A: function () {
          return o;
        },
      });
      var n = r(78270),
        i = r(56163),
        o = function (e) {
          var t = e.occupationId,
            r = e.occupationName,
            o = e.index,
            a = e.uiRegion;
          return {
            trackOccupationCardImpressionEvent: function () {
              var e = {
                occupationId: t,
                occupationName: r,
                index: o,
                uiRegion: a,
              };
              n.j.publishEvent(new i.T(e));
            },
            trackOccupationCardClickEvent: function () {
              var e = {
                occupationId: t,
                occupationName: r,
                index: o,
                uiRegion: a,
              };
              n.j.publishEvent(new i.Ou(e));
            },
          };
        };
    },
    69646: function (e, t, r) {
      "use strict";
      r.d(t, {
        B: function () {
          return C;
        },
      });
      var n,
        i,
        o,
        a,
        s,
        c = r(59499),
        u = r(12831),
        l = r(92777),
        p = r(82262),
        d = r(10748),
        f = r(45959),
        h = r(63553),
        y = r(37247),
        m = r(71218),
        b = r(78270),
        v = r(46067),
        g = r(79594),
        _ = r(45566),
        O = r(73681),
        w = r(94184),
        k = r.n(w),
        x = r(22188),
        P = r(80955),
        j = r(67294),
        Z = r(22559),
        R = r.n(Z),
        T = r(85893);
      function E(e) {
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
            n = (0, y.Z)(e);
          if (t) {
            var i = (0, y.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, h.Z)(this, r);
        };
      }
      var I =
          (0, P.Pi)(
            ((s = (function (e) {
              (0, f.Z)(r, e);
              var t = E(r);
              function r() {
                var e;
                (0, l.Z)(this, r);
                for (
                  var n = arguments.length, i = new Array(n), s = 0;
                  s < n;
                  s++
                )
                  i[s] = arguments[s];
                return (
                  (e = t.call.apply(t, [this].concat(i))),
                  (0, u.Z)(e, "hideExtraRows", o, (0, d.Z)(e)),
                  (0, u.Z)(e, "onToggle", a, (0, d.Z)(e)),
                  e
                );
              }
              return (
                (0, p.Z)(r, [
                  {
                    key: "displayShowMoreButton",
                    get: function () {
                      return (
                        "all" !== this.props.numRowsToShow &&
                        this.props.questionsAndAnswers.length >
                          this.props.numRowsToShow &&
                        this.hideExtraRows
                      );
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this,
                        t = this.props,
                        r = t.compact,
                        n = t.questionsAndAnswers,
                        i = t.numRowsToShow,
                        o = t.defaultExpanded,
                        a = t.gettext;
                      return (0, T.jsxs)("div", {
                        className: R()["question-and-answer-container"],
                        children: [
                          (0, T.jsx)("div", {
                            className: k()(
                              r ? "ud-heading-lg" : "ud-heading-xl",
                              R().header
                            ),
                            "data-purpose": "faq-heading",
                            children: a("Frequently asked questions"),
                          }),
                          (0, T.jsx)(O.U, {
                            size: r ? "medium" : void 0,
                            name: "faq-accordion",
                            children: n.map(function (t, r) {
                              var n;
                              return (0,
                              T.jsxs)(O.U.Panel, { id: "faq-panel--".concat(r), titleId: "faq-panel-title--".concat(r), defaultExpanded: o && 0 === r, title: t.question, className: k()((0, c.Z)({}, R().hidden, "all" !== i && e.hideExtraRows && r >= i)), children: [(0, T.jsx)("div", { className: k()("ud-text-sm", R().answer), children: t.answer }), t.link_url && (0, T.jsx)("div", { className: k()("ud-heading-md", R().link), children: (0, T.jsx)("a", { href: t.link_url, target: "_blank", rel: "noopener noreferrer", children: null !== (n = t.link_text) && void 0 !== n ? n : a("Learn more") }) })] }, r);
                            }),
                          }),
                          "all" !== i &&
                            n.length > i &&
                            (0, T.jsx)(_.zx, {
                              size: "medium",
                              udStyle: "secondary",
                              className: R()["show-more"],
                              onClick: this.onToggle,
                              "data-purpose": "toggle-button",
                              children: this.displayShowMoreButton
                                ? a("Show more")
                                : a("Show less"),
                            }),
                        ],
                      });
                    },
                  },
                ]),
                r
              );
            })(j.Component)),
            (s.defaultProps = {
              compact: !1,
              defaultExpanded: !1,
              numRowsToShow: 3,
            }),
            (i = s),
            (o = (0, m.Z)(i.prototype, "hideExtraRows", [x.LO], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return !0;
              },
            })),
            (a = (0, m.Z)(i.prototype, "onToggle", [x.aD], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                var e = this;
                return function () {
                  (e.hideExtraRows = !e.hideExtraRows),
                    b.j.publishEvent(
                      new v.Rd({
                        componentName: "topicQuestionsAndAnswersShowMore",
                      })
                    );
                };
              },
            })),
            (0, m.Z)(
              i.prototype,
              "displayShowMoreButton",
              [x.Fl],
              Object.getOwnPropertyDescriptor(
                i.prototype,
                "displayShowMoreButton"
              ),
              i.prototype
            ),
            (n = i))
          ) || n,
        C = (0, g.GV)(I);
    },
    73804: function (e, t, r) {
      "use strict";
      r.d(t, {
        Iv: function () {
          return p;
        },
        kG: function () {
          return l;
        },
      });
      var n = r(82262),
        i = r(92777),
        o = r(45959),
        a = r(63553),
        s = r(37247),
        c = r(24076);
      function u(e) {
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
            n = (0, s.Z)(e);
          if (t) {
            var i = (0, s.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, a.Z)(this, r);
        };
      }
      var l = (function (e) {
          (0, o.Z)(r, e);
          var t = u(r);
          function r(e) {
            var n,
              o = e.labId,
              a = e.courseId,
              s = void 0 === a ? void 0 : a,
              c = e.uiRegion,
              u = e.trackingId,
              l = void 0 === u ? void 0 : u,
              p = e.sourcePageId,
              d = void 0 === p ? void 0 : p,
              f = e.sourcePageType,
              h = void 0 === f ? void 0 : f;
            return (
              (0, i.Z)(this, r),
              ((n = t.call(this, "LabDiscoveryCardClickEvent")).labId = void 0),
              (n.courseId = void 0),
              (n.uiRegion = void 0),
              (n.trackingId = void 0),
              (n.sourcePageId = void 0),
              (n.sourcePageType = void 0),
              (n.labId = o),
              (n.courseId = s),
              (n.uiRegion = c),
              (n.trackingId = l),
              (n.sourcePageId = d),
              (n.sourcePageType = h),
              n
            );
          }
          return (0, n.Z)(r);
        })(c.rp),
        p = (function (e) {
          (0, o.Z)(r, e);
          var t = u(r);
          function r(e) {
            var n,
              o = e.labId,
              a = e.courseId,
              s = e.uiRegion,
              c = e.sourcePageId,
              u = e.sourcePageType;
            return (
              (0, i.Z)(this, r),
              ((n = t.call(this, "LabDiscoveryCardImpressionEvent")).labId =
                void 0),
              (n.courseId = void 0),
              (n.uiRegion = void 0),
              (n.sourcePageId = void 0),
              (n.sourcePageType = void 0),
              (n.labId = o),
              (n.courseId = a),
              (n.uiRegion = s),
              (n.sourcePageId = c),
              (n.sourcePageType = u),
              n
            );
          }
          return (0, n.Z)(r);
        })(c.rp);
    },
    4811: function (e, t, r) {
      "use strict";
      r.d(t, {
        Z: function () {
          return p;
        },
      });
      var n = r(59499),
        i = r(92777),
        o = r(82262),
        a = r(52466),
        s = r(5338);
      function c(e, t) {
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
      function u(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? c(Object(r), !0).forEach(function (t) {
                (0, n.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : c(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var l = [
          function (e, t, r) {
            return [a.sV, a.AA, a.yN, a.ki].includes(r)
              ? (function (e, t, r) {
                  var n =
                      arguments.length > 3 && void 0 !== arguments[3]
                        ? arguments[3]
                        : [],
                    i = [],
                    o = {
                      items: [],
                      type: t,
                      item_type: r,
                      source_objects: [],
                    };
                  return (
                    e.forEach(function (e) {
                      n.includes(e.type)
                        ? ((o.items = o.items.concat(e.items)),
                          (o.source_objects = e.source_objects))
                        : i.push(e);
                    }),
                    o.items.length > 0 && i.push(o),
                    i
                  );
                })(
                  t,
                  "related_categories_and_subcategories",
                  "category_or_subcategory",
                  [
                    "related_categories",
                    "related_subcategories",
                    "related_categories_and_subcategories",
                  ]
                )
              : t;
          },
          function (e, t, r) {
            if (![a.B9, a.zk, a.w8, a.BZ, a.mu].includes(r)) return t;
            var n = [];
            if (0 !== e.from) return t;
            var i = { type: "discovery_value_props", item_type: "value_props" },
              o = r === a.w8 ? 1 : 0;
            return (
              t.forEach(function (e, t) {
                n.push(e), t === o && n.push(i);
              }),
              n
            );
          },
          function (e, t, r) {
            if (r !== a.w8) return t;
            var n = [],
              i = { type: "featured_topics_unit", item_type: "course_label" };
            return (
              t.forEach(function (t, r) {
                0 === e.from && 1 === r && n.push(i), n.push(t);
              }),
              n
            );
          },
          function (e, t, r) {
            return t
              ? t.map(function (e) {
                  return e.items && (0, s.q)(e.items), e;
                })
              : [];
          },
        ],
        p = (function () {
          function e() {
            (0, i.Z)(this, e);
          }
          return (
            (0, o.Z)(e, null, [
              {
                key: "processResponse",
                value: function (e, t, r) {
                  var n = this.processUnits(e, t.results, r);
                  return u(u({}, t), {}, { results: n });
                },
              },
              {
                key: "processUnits",
                value: function (e, t, r) {
                  var n = t;
                  return (
                    l.forEach(function (t) {
                      n = t(e, n, r);
                    }),
                    n
                  );
                },
              },
            ]),
            e
          );
        })();
    },
    38619: function (e, t, r) {
      "use strict";
      r.d(t, {
        Z: function () {
          return u;
        },
      });
      var n = r(36808),
        i = r.n(n),
        o = r(22188),
        a = r(48809),
        s = r(79976);
      function c() {
        return (0, a.$A)({ header: !0, footer: !0 });
      }
      function u(e) {
        return UD.performance.isPageCached && !i().get("ud_cache_user")
          ? new Promise(function (t, r) {
              var n = !1,
                i = c().then(function (t) {
                  return !n && e && e(t), t;
                });
              (0, o.gx)(
                function () {
                  return !s.ZP.isLoading;
                },
                function () {
                  s.ZP.id
                    ? ((n = !0),
                      u.reset(),
                      c()
                        .then(function (r) {
                          null === e || void 0 === e || e(r), t(r);
                        })
                        .catch(r))
                    : i.then(t).catch(r);
                }
              );
            })
          : c().then(function (t) {
              return null === e || void 0 === e || e(t), t;
            });
      }
      u.reset = function () {
        a.$A.reset();
      };
    },
    83548: function (e, t, r) {
      "use strict";
      r.d(t, {
        RW: function () {
          return g;
        },
        jX: function () {
          return k;
        },
        LG: function () {
          return G;
        },
        Dj: function () {
          return Q;
        },
      });
      var n = r(67848),
        i = r(48228),
        o = r(59499),
        a = r(50029),
        s = r(87794),
        c = r.n(s),
        u = r(36808),
        l = r.n(u),
        p = r(32542);
      function d(e, t) {
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
      function f(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? d(Object(r), !0).forEach(function (t) {
                (0, o.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : d(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var h,
        y,
        m,
        b,
        v,
        g,
        _,
        O,
        w,
        k,
        x,
        P,
        j,
        Z = function () {
          var e = l().get() || {};
          if (e.ud_locale)
            return { "Accept-Language": e.ud_locale.split("_").join("-") };
        },
        R = function (e, t, r) {
          return (0, a.Z)(
            c().mark(function n() {
              var i, o, a, s, u, l, d;
              return c().wrap(function (n) {
                for (;;)
                  switch ((n.prev = n.next)) {
                    case 0:
                      return (
                        r &&
                          "_signal" in r &&
                          ((i = r._signal), delete r._signal),
                        (o = new URL((0, p.B)("GRAPHQL_URL"))),
                        !1,
                        (a = ""
                          .concat(window.location.origin)
                          .concat(o.pathname)),
                        (n.next = 6),
                        fetch(a, {
                          method: "POST",
                          headers: f(
                            f({ "Content-Type": "application/json" }, Z()),
                            null !== r && void 0 !== r ? r : {}
                          ),
                          body: JSON.stringify({ query: e, variables: t }),
                          signal: i,
                        })
                      );
                    case 6:
                      return (s = n.sent), (n.next = 9), s.json();
                    case 9:
                      if (!(u = n.sent).errors) {
                        n.next = 13;
                        break;
                      }
                      throw (
                        ((l = u.errors[0] || "Error.."),
                        (d = l.message),
                        new Error(d))
                      );
                    case 13:
                      return n.abrupt("return", u.data);
                    case 14:
                    case "end":
                      return n.stop();
                  }
              }, n);
            })
          );
        };
      !(function (e) {
        (e.ClosedCaption = "CLOSED_CAPTION"), (e.Subtitle = "SUBTITLE");
      })(h || (h = {})),
        (function (e) {
          (e.Cplusplus = "CPLUSPLUS"),
            (e.CsvProcessingWithPython = "CSV_PROCESSING_WITH_PYTHON"),
            (e.CSharp = "C_SHARP"),
            (e.CSharp_11 = "C_SHARP_11"),
            (e.Html = "HTML"),
            (e.JavascriptEs6 = "JAVASCRIPT_ES6"),
            (e.Java_9 = "JAVA_9"),
            (e.Java_11 = "JAVA_11"),
            (e.Java_17 = "JAVA_17"),
            (e.Php_5 = "PHP_5"),
            (e.Php_7 = "PHP_7"),
            (e.Python_3_5 = "PYTHON_3_5"),
            (e.Python_3_8 = "PYTHON_3_8"),
            (e.Python_3_10 = "PYTHON_3_10"),
            (e.React_16 = "REACT_16"),
            (e.Ruby = "RUBY"),
            (e.R_3_6 = "R_3_6"),
            (e.Scipy_1_4NumpyPandasSympyAndScikitLearn_0_23 =
              "SCIPY_1_4_NUMPY_PANDAS_SYMPY_AND_SCIKIT_LEARN_0_23"),
            (e.Sql = "SQL"),
            (e.Sqlite_3 = "SQLITE_3"),
            (e.Swift_3 = "SWIFT_3"),
            (e.Swift_5 = "SWIFT_5");
        })(y || (y = {})),
        (function (e) {
          e.Cpe = "CPE";
        })(m || (m = {})),
        (function (e) {
          (e.Rating = "RATING"),
            (e.Relevance = "RELEVANCE"),
            (e.Reviews = "REVIEWS"),
            (e.Time = "TIME");
        })(b || (b = {})),
        (function (e) {
          (e.Aud = "AUD"),
            (e.Brl = "BRL"),
            (e.Cad = "CAD"),
            (e.Dkk = "DKK"),
            (e.Eur = "EUR"),
            (e.Gbp = "GBP"),
            (e.Idr = "IDR"),
            (e.Ils = "ILS"),
            (e.Inr = "INR"),
            (e.Jpy = "JPY"),
            (e.Krw = "KRW"),
            (e.Mxn = "MXN"),
            (e.Nok = "NOK"),
            (e.Pln = "PLN"),
            (e.Rub = "RUB"),
            (e.Sgd = "SGD"),
            (e.Thb = "THB"),
            (e.Try = "TRY"),
            (e.Twd = "TWD"),
            (e.Usd = "USD"),
            (e.Vnd = "VND"),
            (e.Zar = "ZAR");
        })(v || (v = {})),
        (function (e) {
          (e.Day = "DAY"),
            (e.Month = "MONTH"),
            (e.Week = "WEEK"),
            (e.Year = "YEAR");
        })(g || (g = {})),
        (function (e) {
          (e.AllLevels = "ALL_LEVELS"),
            (e.Beginner = "BEGINNER"),
            (e.Expert = "EXPERT"),
            (e.Intermediate = "INTERMEDIATE");
        })(_ || (_ = {})),
        (function (e) {
          (e.Af = "AF"),
            (e.Ak = "AK"),
            (e.Am = "AM"),
            (e.Ar = "AR"),
            (e.As = "AS"),
            (e.Az = "AZ"),
            (e.Be = "BE"),
            (e.Bg = "BG"),
            (e.Bm = "BM"),
            (e.Bn = "BN"),
            (e.Bo = "BO"),
            (e.Br = "BR"),
            (e.Bs = "BS"),
            (e.Ca = "CA"),
            (e.Ce = "CE"),
            (e.Cs = "CS"),
            (e.Cu = "CU"),
            (e.Cy = "CY"),
            (e.Da = "DA"),
            (e.De = "DE"),
            (e.Dz = "DZ"),
            (e.Ee = "EE"),
            (e.El = "EL"),
            (e.En = "EN"),
            (e.Eo = "EO"),
            (e.Es = "ES"),
            (e.Et = "ET"),
            (e.Eu = "EU"),
            (e.Fa = "FA"),
            (e.Ff = "FF"),
            (e.Fi = "FI"),
            (e.Fo = "FO"),
            (e.Fr = "FR"),
            (e.Fy = "FY"),
            (e.Ga = "GA"),
            (e.Gd = "GD"),
            (e.Gl = "GL"),
            (e.Gu = "GU"),
            (e.Gv = "GV"),
            (e.Ha = "HA"),
            (e.He = "HE"),
            (e.Hi = "HI"),
            (e.Hr = "HR"),
            (e.Hu = "HU"),
            (e.Hy = "HY"),
            (e.Ia = "IA"),
            (e.Id = "ID"),
            (e.Ig = "IG"),
            (e.Ii = "II"),
            (e.Is = "IS"),
            (e.It = "IT"),
            (e.Ja = "JA"),
            (e.Jv = "JV"),
            (e.Ka = "KA"),
            (e.Ki = "KI"),
            (e.Kk = "KK"),
            (e.Kl = "KL"),
            (e.Km = "KM"),
            (e.Kn = "KN"),
            (e.Ko = "KO"),
            (e.Ks = "KS"),
            (e.Ku = "KU"),
            (e.Kw = "KW"),
            (e.Ky = "KY"),
            (e.Lb = "LB"),
            (e.Lg = "LG"),
            (e.Ln = "LN"),
            (e.Lo = "LO"),
            (e.Lt = "LT"),
            (e.Lu = "LU"),
            (e.Lv = "LV"),
            (e.Mg = "MG"),
            (e.Mi = "MI"),
            (e.Mk = "MK"),
            (e.Ml = "ML"),
            (e.Mn = "MN"),
            (e.Mr = "MR"),
            (e.Ms = "MS"),
            (e.Mt = "MT"),
            (e.My = "MY"),
            (e.Nb = "NB"),
            (e.Nd = "ND"),
            (e.Ne = "NE"),
            (e.Nl = "NL"),
            (e.Nn = "NN"),
            (e.No = "NO"),
            (e.Om = "OM"),
            (e.Or = "OR"),
            (e.Os = "OS"),
            (e.Pa = "PA"),
            (e.Pl = "PL"),
            (e.Ps = "PS"),
            (e.Pt = "PT"),
            (e.PtBr = "PT_BR"),
            (e.PtPt = "PT_PT"),
            (e.Qu = "QU"),
            (e.Rm = "RM"),
            (e.Rn = "RN"),
            (e.Ro = "RO"),
            (e.Ru = "RU"),
            (e.Rw = "RW"),
            (e.Sd = "SD"),
            (e.Se = "SE"),
            (e.Sg = "SG"),
            (e.Si = "SI"),
            (e.Sk = "SK"),
            (e.Sl = "SL"),
            (e.Sn = "SN"),
            (e.So = "SO"),
            (e.Sq = "SQ"),
            (e.Sr = "SR"),
            (e.Su = "SU"),
            (e.Sv = "SV"),
            (e.Sw = "SW"),
            (e.Ta = "TA"),
            (e.Te = "TE"),
            (e.Tg = "TG"),
            (e.Th = "TH"),
            (e.Ti = "TI"),
            (e.Tk = "TK"),
            (e.To = "TO"),
            (e.Tr = "TR"),
            (e.Tt = "TT"),
            (e.Ug = "UG"),
            (e.Uk = "UK"),
            (e.Ur = "UR"),
            (e.Uz = "UZ"),
            (e.Vi = "VI"),
            (e.Vo = "VO"),
            (e.Wo = "WO"),
            (e.Xh = "XH"),
            (e.Yi = "YI"),
            (e.Yo = "YO"),
            (e.Zh = "ZH"),
            (e.ZhCn = "ZH_CN"),
            (e.ZhTw = "ZH_TW"),
            (e.Zu = "ZU");
        })(O || (O = {})),
        (function (e) {
          (e.ActiveCurrentPeriodAchieved = "ACTIVE_CURRENT_PERIOD_ACHIEVED"),
            (e.ActiveCurrentPeriodUnachieved =
              "ACTIVE_CURRENT_PERIOD_UNACHIEVED"),
            (e.Dropped = "DROPPED"),
            (e.ZeroHistory = "ZERO_HISTORY");
        })(w || (w = {})),
        (function (e) {
          (e.Consumersubscription = "CONSUMERSUBSCRIPTION"),
            (e.Enterprise = "ENTERPRISE"),
            (e.Team = "TEAM"),
            (e.Udemypro = "UDEMYPRO");
        })(k || (k = {})),
        (function (e) {
          (e.Active = "ACTIVE"),
            (e.Canceled = "CANCELED"),
            (e.Expired = "EXPIRED"),
            (e.Future = "FUTURE"),
            (e.Trial = "TRIAL");
        })(x || (x = {})),
        (function (e) {
          (e.Popular = "POPULAR"), (e.Trending = "TRENDING");
        })(P || (P = {})),
        (function (e) {
          (e.ExtraLong = "EXTRA_LONG"),
            (e.ExtraShort = "EXTRA_SHORT"),
            (e.Long = "LONG"),
            (e.Medium = "MEDIUM"),
            (e.Short = "SHORT");
        })(j || (j = {}));
      var T =
          "\n    query GetTemplatesByLanguage($languageInput: CodingExerciseLanguageOption!) {\n  codingExerciseTemplatesByLanguage(language: $languageInput) {\n    language\n    supportedVersions\n    name\n    description\n    solutionFiles {\n      fileName\n      content\n    }\n    testFiles {\n      fileName\n      content\n    }\n    setupFiles {\n      fileName\n      content\n    }\n  }\n}\n    ",
        E = function (e, t) {
          return (0, n.a)(["GetTemplatesByLanguage", e], R(T, e), t);
        };
      (E.getKey = function (e) {
        return ["GetTemplatesByLanguage", e];
      }),
        (E.fetcher = function (e, t) {
          return R(T, e, t);
        });
      var I =
          "\n    query GetTemplatesByLanguageVersion($languageInput: CodingExerciseLanguageOption!) {\n  codingExerciseTemplatesByLanguageVersion(language: $languageInput) {\n    language\n    supportedVersions\n    name\n    description\n    solutionFiles {\n      fileName\n      content\n    }\n    testFiles {\n      fileName\n      content\n    }\n    setupFiles {\n      fileName\n      content\n    }\n  }\n}\n    ",
        C = function (e, t) {
          return (0, n.a)(["GetTemplatesByLanguageVersion", e], R(I, e), t);
        };
      (C.getKey = function (e) {
        return ["GetTemplatesByLanguageVersion", e];
      }),
        (C.fetcher = function (e, t) {
          return R(I, e, t);
        });
      var S =
          "\n    query GetTemplatesByLanguageVersionName($languageInput: CodingExerciseLanguageOption!, $nameInput: String!) {\n  codingExerciseTemplateByLanguageVersionName(\n    language: $languageInput\n    name: $nameInput\n  ) {\n    language\n    supportedVersions\n    name\n    description\n    solutionFiles {\n      fileName\n      content\n    }\n    testFiles {\n      fileName\n      content\n    }\n    setupFiles {\n      fileName\n      content\n    }\n  }\n}\n    ",
        D = function (e, t) {
          return (0, n.a)(["GetTemplatesByLanguageVersionName", e], R(S, e), t);
        };
      (D.getKey = function (e) {
        return ["GetTemplatesByLanguageVersionName", e];
      }),
        (D.fetcher = function (e, t) {
          return R(S, e, t);
        });
      var A =
          "\n    query FetchPublicQuizzesOfACourse($id: ID!) {\n  course(id: $id) {\n    id\n    curriculum {\n      sections {\n        items {\n          ... on CodingExercise {\n            __typename\n            id\n            title\n          }\n          ... on Quiz {\n            __typename\n            id\n            title\n          }\n          ... on PracticeTest {\n            __typename\n            id\n            title\n          }\n        }\n      }\n    }\n  }\n}\n    ",
        L = function (e, t) {
          return (0, n.a)(["FetchPublicQuizzesOfACourse", e], R(A, e), t);
        };
      (L.getKey = function (e) {
        return ["FetchPublicQuizzesOfACourse", e];
      }),
        (L.fetcher = function (e, t) {
          return R(A, e, t);
        });
      var N =
          "\n    query subjectAreas {\n  badgeCertificationSubjectAreas {\n    id\n    name\n  }\n}\n    ",
        U = function (e, t) {
          return (0, n.a)(
            void 0 === e ? ["subjectAreas"] : ["subjectAreas", e],
            R(N, e),
            t
          );
        };
      (U.getKey = function (e) {
        return void 0 === e ? ["subjectAreas"] : ["subjectAreas", e];
      }),
        (U.fetcher = function (e, t) {
          return R(N, e, t);
        });
      var M =
          "\n    query badgeClassIssuerFilters {\n  badgeClassIssuers {\n    id\n    name\n  }\n}\n    ",
        B = function (e, t) {
          return (0, n.a)(
            void 0 === e
              ? ["badgeClassIssuerFilters"]
              : ["badgeClassIssuerFilters", e],
            R(M, e),
            t
          );
        };
      (B.getKey = function (e) {
        return void 0 === e
          ? ["badgeClassIssuerFilters"]
          : ["badgeClassIssuerFilters", e];
      }),
        (B.fetcher = function (e, t) {
          return R(M, e, t);
        });
      var F =
          "\n    query badgeClassWithTopic($id: ID!) {\n  badgeClass(id: $id) {\n    id\n    name\n    image {\n      id\n    }\n    description\n    type\n    tags\n    issuer {\n      name\n    }\n    criteria {\n      id\n    }\n    topic {\n      id\n    }\n  }\n}\n    ",
        z = function (e, t) {
          return (0, n.a)(["badgeClassWithTopic", e], R(F, e), t);
        };
      (z.getKey = function (e) {
        return ["badgeClassWithTopic", e];
      }),
        (z.fetcher = function (e, t) {
          return R(F, e, t);
        });
      var V =
          "\n    query searchBadgeClasses($query: String!, $issuerIds: [ID!], $certificationAreaIds: [ID!], $page: Int! = 0, $size: Int!) {\n  searchBadgeClasses(\n    query: $query\n    issuerId: $issuerIds\n    certificationAreaIds: $certificationAreaIds\n    page: $page\n    size: $size\n  ) {\n    items {\n      id\n      name\n      image {\n        id\n      }\n      issuer {\n        id\n        name\n      }\n    }\n    page\n    pageCount\n  }\n}\n    ",
        H = function (e, t) {
          return (0, n.a)(["searchBadgeClasses", e], R(V, e), t);
        };
      (H.getKey = function (e) {
        return ["searchBadgeClasses", e];
      }),
        (H.fetcher = function (e, t) {
          return R(V, e, t);
        });
      var W =
          "\n    query badgeClassesByTopic($topicId: ID!) {\n  badgeClassesByTopic(topicId: $topicId) {\n    id\n    name\n    image {\n      id\n    }\n    issuer {\n      name\n    }\n  }\n}\n    ",
        G = function (e, t) {
          return (0, n.a)(["badgeClassesByTopic", e], R(W, e), t);
        };
      (G.getKey = function (e) {
        return ["badgeClassesByTopic", e];
      }),
        (G.fetcher = function (e, t) {
          return R(W, e, t);
        });
      var K =
          "\n    query LabSearchResponse($query: String!, $filters: [SearchAggregationInputOption!]) {\n  searchLabs(query: $query, filters: $filters) {\n    count\n    trackingId\n    labs {\n      id\n      title\n      description\n      learningOutcomes\n      activities\n      prerequisites\n      minEstimatedTime\n      maxEstimatedTime\n      instructors {\n        name\n      }\n      topics {\n        id\n      }\n      instructors {\n        name\n      }\n      metadata {\n        trackingId\n      }\n    }\n  }\n}\n    ",
        q = function (e, t) {
          return (0, n.a)(["LabSearchResponse", e], R(K, e), t);
        };
      (q.getKey = function (e) {
        return ["LabSearchResponse", e];
      }),
        (q.fetcher = function (e, t) {
          return R(K, e, t);
        });
      var Y =
          "\n    query SubscriptionPlansByProductType($productType: SubscriptionPlanProductType, $licenseCount: Int) {\n  subscriptionPlansByProductType(productType: $productType) {\n    id\n    productType\n    urlLearnMore\n    urlExpressCheckout\n    priceOptions(licenseCount: $licenseCount) {\n      ... on MonthlySubscriptionPlanPricingOption {\n        id\n        listPrice {\n          amount\n          currency\n        }\n        renewalInterval {\n          type\n          count\n        }\n        trial {\n          dateInterval {\n            type\n            count\n          }\n        }\n        licenseContext {\n          unitPrice {\n            amount\n            currency\n          }\n          licenseCount\n          defaultLicenseCount\n          minimumLicenseCount\n          maximumLicenseCount\n        }\n      }\n      ... on AnnualSubscriptionPlanPricingOption {\n        id\n        listPrice {\n          amount\n          currency\n        }\n        annualSavings {\n          amount\n          currency\n        }\n        monthlyPrice {\n          amount\n          currency\n        }\n        renewalInterval {\n          type\n          count\n        }\n        trial {\n          dateInterval {\n            type\n            count\n          }\n        }\n        licenseContext {\n          unitPrice {\n            amount\n            currency\n          }\n          licenseCount\n          defaultLicenseCount\n          minimumLicenseCount\n          maximumLicenseCount\n        }\n      }\n    }\n  }\n}\n    ",
        Q = function (e, t) {
          return (0, n.a)(
            void 0 === e
              ? ["SubscriptionPlansByProductType"]
              : ["SubscriptionPlansByProductType", e],
            R(Y, e),
            t
          );
        };
      (Q.getKey = function (e) {
        return void 0 === e
          ? ["SubscriptionPlansByProductType"]
          : ["SubscriptionPlansByProductType", e];
      }),
        (Q.fetcher = function (e, t) {
          return R(Y, e, t);
        });
      var J =
          "\n    query SubscriptionPlans {\n  subscriptionPlans {\n    id\n    listPrice {\n      amount\n      currency\n    }\n    renewalInterval {\n      type\n      count\n    }\n    trial {\n      dateInterval {\n        type\n        count\n      }\n    }\n    productType\n  }\n}\n    ",
        X = function (e, t) {
          return (0, n.a)(
            void 0 === e ? ["SubscriptionPlans"] : ["SubscriptionPlans", e],
            R(J, e),
            t
          );
        };
      (X.getKey = function (e) {
        return void 0 === e ? ["SubscriptionPlans"] : ["SubscriptionPlans", e];
      }),
        (X.fetcher = function (e, t) {
          return R(J, e, t);
        });
      var $ =
          "\n    query FetchCurrentSubscriptionEnrollment {\n  currentSubscriptionEnrollment {\n    id\n    subscriber {\n      __typename\n      ... on Organization {\n        id\n      }\n      ... on User {\n        id\n      }\n    }\n    checkoutReference\n    trialInterval {\n      type\n      count\n    }\n    renewalInterval {\n      type\n      count\n    }\n    startDate\n    endDate\n    cancelDate\n    status\n    licenseCount\n  }\n}\n    ",
        ee = function (e, t) {
          return (0, n.a)(
            void 0 === e
              ? ["FetchCurrentSubscriptionEnrollment"]
              : ["FetchCurrentSubscriptionEnrollment", e],
            R($, e),
            t
          );
        };
      (ee.getKey = function (e) {
        return void 0 === e
          ? ["FetchCurrentSubscriptionEnrollment"]
          : ["FetchCurrentSubscriptionEnrollment", e];
      }),
        (ee.fetcher = function (e, t) {
          return R($, e, t);
        });
      var te =
          "\n    mutation CancelSubscriptionEnrollment($id: ID!) {\n  subscriptionEnrollmentCancel(id: $id) {\n    id\n    status\n    cancelDate\n    endDate\n  }\n}\n    ",
        re = function (e) {
          return (0, i.D)(
            ["CancelSubscriptionEnrollment"],
            function (e) {
              return R(te, e)();
            },
            e
          );
        };
      (re.getKey = function () {
        return ["CancelSubscriptionEnrollment"];
      }),
        (re.fetcher = function (e, t) {
          return R(te, e, t);
        });
      var ne =
          "\n    mutation ReactivateSubscriptionEnrollment($id: ID!) {\n  subscriptionEnrollmentReactivate(id: $id) {\n    id\n    status\n    cancelDate\n    endDate\n  }\n}\n    ",
        ie = function (e) {
          return (0, i.D)(
            ["ReactivateSubscriptionEnrollment"],
            function (e) {
              return R(ne, e)();
            },
            e
          );
        };
      (ie.getKey = function () {
        return ["ReactivateSubscriptionEnrollment"];
      }),
        (ie.fetcher = function (e, t) {
          return R(ne, e, t);
        });
      var oe =
          "\n    query FeatureVariantAssignments($featureCodes: [String!]!, $realtimeAttributes: [FeatureRequestAttributeInput!]) {\n  featureVariantAssignmentsByCodeAndAttributes(\n    featureCodes: $featureCodes\n    realtimeAttributes: $realtimeAttributes\n  ) {\n    featureCode\n    configuration\n    isInExperiment\n    experimentIds\n  }\n}\n    ",
        ae = function (e, t) {
          return (0, n.a)(["FeatureVariantAssignments", e], R(oe, e), t);
        };
      (ae.getKey = function (e) {
        return ["FeatureVariantAssignments", e];
      }),
        (ae.fetcher = function (e, t) {
          return R(oe, e, t);
        });
    },
    83434: function (e, t, r) {
      "use strict";
      r.d(t, {
        ez: function () {
          return Le;
        },
        bp: function () {
          return Ke;
        },
        UJ: function () {
          return De;
        },
        cA: function () {
          return Ze;
        },
        bZ: function () {
          return Se;
        },
        cb: function () {
          return Re;
        },
        jV: function () {
          return Ue;
        },
        dk: function () {
          return ke;
        },
        Nw: function () {
          return Ge;
        },
        Qy: function () {
          return Ae;
        },
        Je: function () {
          return Fe;
        },
        RY: function () {
          return ze;
        },
        n5: function () {
          return Be;
        },
        Pu: function () {
          return Me;
        },
        I: function () {
          return Ve;
        },
        IR: function () {
          return He;
        },
        nF: function () {
          return we;
        },
        dD: function () {
          return We;
        },
        LY: function () {
          return xe;
        },
      });
      var n = r(59499),
        i = r(67273),
        o = r.n(i),
        a = r(35169),
        s = r.n(a),
        c = r(97137),
        u = r.n(c),
        l = r(49219),
        p = r.n(l),
        d = r(89749),
        f = r.n(d),
        h = (r(43283), r(66541), r(82262)),
        y = r(92777),
        m = r(45959),
        b = r(63553),
        v = r(37247),
        g = r(24076);
      function _(e) {
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
            n = (0, v.Z)(e);
          if (t) {
            var i = (0, v.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, b.Z)(this, r);
        };
      }
      var O = (function (e) {
        (0, m.Z)(r, e);
        var t = _(r);
        function r(e) {
          var n;
          return (
            (0, y.Z)(this, r),
            ((n = t.call(this, "LabActionEvent")).labId = e.labId),
            (n.labVertical = e.labVertical),
            (n.labInstanceUuid = e.labInstanceUuid),
            (n.labTaskId = e.labTaskId),
            (n.labTaskResourceId = e.labTaskResourceId),
            (n.labCompletionMode = e.labCompletionMode),
            (n.inSessionTimeBetweenViewAndCtaClick =
              e.inSessionTimeBetweenViewAndCtaClick),
            (n.action = e.action),
            (n.uiRegion = e.uiRegion),
            (n.hasAutomatedLabReview = e.hasAutomatedLabReview),
            (n.labTaskNumber = e.labTaskNumber),
            n
          );
        }
        return (0, h.Z)(r);
      })(g.rp);
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
            n = (0, v.Z)(e);
          if (t) {
            var i = (0, v.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, b.Z)(this, r);
        };
      }
      var k = (function (e) {
        (0, m.Z)(r, e);
        var t = w(r);
        function r(e) {
          var n,
            i = e.labId,
            o = e.page,
            a = e.index,
            s = e.uiRegion;
          return (
            (0, y.Z)(this, r),
            ((n = t.call(this, "LabCardClickEvent")).labId = void 0),
            (n.page = void 0),
            (n.index = void 0),
            (n.uiRegion = void 0),
            (n.labId = i),
            (n.page = o),
            (n.index = a),
            (n.uiRegion = s),
            n
          );
        }
        return (0, h.Z)(r);
      })(g.rp);
      function x(e) {
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
            n = (0, v.Z)(e);
          if (t) {
            var i = (0, v.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, b.Z)(this, r);
        };
      }
      var P = (function (e) {
        (0, m.Z)(r, e);
        var t = x(r);
        function r(e) {
          var n;
          return (
            (0, y.Z)(this, r),
            ((n = t.call(this, "LabHeartbeatEvent")).labInstanceUuid =
              e.labInstanceUuid),
            (n.startTime = e.startTime),
            (n.durationMs = e.durationMs),
            (n.hasFocus = e.hasFocus),
            (n.hasKeyboardMouse = e.hasKeyboardMouse),
            (n.labCompletionMode = e.labCompletionMode),
            n
          );
        }
        return (0, h.Z)(r);
      })(g.rp);
      function j(e) {
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
            n = (0, v.Z)(e);
          if (t) {
            var i = (0, v.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, b.Z)(this, r);
        };
      }
      var Z = (function (e) {
        (0, m.Z)(r, e);
        var t = j(r);
        function r(e) {
          var n,
            i = e.courseId,
            o = e.action;
          return (
            (0, y.Z)(this, r),
            ((n = t.call(this, "LabInCoursePromptActionEvent")).courseId =
              void 0),
            (n.action = void 0),
            (n.courseId = i),
            (n.action = o),
            n
          );
        }
        return (0, h.Z)(r);
      })(g.rp);
      function R(e) {
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
            n = (0, v.Z)(e);
          if (t) {
            var i = (0, v.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, b.Z)(this, r);
        };
      }
      var T = (function (e) {
        (0, m.Z)(r, e);
        var t = R(r);
        function r(e) {
          var n;
          return (
            (0, y.Z)(this, r),
            ((n = t.call(this, "LabOverviewVisitEvent")).labId = e.labId),
            (n.isUnstartedVisit = e.isUnstartedVisit),
            n
          );
        }
        return (0, h.Z)(r);
      })(g.rp);
      function E(e) {
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
            n = (0, v.Z)(e);
          if (t) {
            var i = (0, v.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, b.Z)(this, r);
        };
      }
      var I = (function (e) {
        (0, m.Z)(r, e);
        var t = E(r);
        function r(e) {
          var n;
          return (
            (0, y.Z)(this, r),
            ((n = t.call(this, "LabsHeaderClickEvent")).sourceComponent =
              void 0),
            (n.sourceComponent = e),
            n
          );
        }
        return (0, h.Z)(r);
      })(g.rp);
      function C(e) {
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
            n = (0, v.Z)(e);
          if (t) {
            var i = (0, v.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, b.Z)(this, r);
        };
      }
      var S = (function (e) {
        (0, m.Z)(r, e);
        var t = C(r);
        function r(e) {
          var n,
            i = e.labId,
            o = e.labInstanceUuid,
            a = e.labVertical,
            s = e.labCompletionMode;
          return (
            (0, y.Z)(this, r),
            ((n = t.call(this, "LabsResumeBannerContinueClickEvent")).labId =
              void 0),
            (n.labInstanceUuid = void 0),
            (n.labVertical = void 0),
            (n.labCompletionMode = void 0),
            (n.labId = i),
            (n.labInstanceUuid = o),
            (n.labVertical = a),
            (n.labCompletionMode = s),
            n
          );
        }
        return (0, h.Z)(r);
      })(g.rp);
      function D(e) {
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
            n = (0, v.Z)(e);
          if (t) {
            var i = (0, v.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, b.Z)(this, r);
        };
      }
      var A = (function (e) {
        (0, m.Z)(r, e);
        var t = D(r);
        function r(e) {
          var n,
            i = e.labId,
            o = e.labInstanceUuid,
            a = e.labVertical,
            s = e.labCompletionMode;
          return (
            (0, y.Z)(this, r),
            ((n = t.call(this, "LabsResumeBannerDismissClickEvent")).labId =
              void 0),
            (n.labInstanceUuid = void 0),
            (n.labVertical = void 0),
            (n.labCompletionMode = void 0),
            (n.labId = i),
            (n.labInstanceUuid = o),
            (n.labVertical = a),
            (n.labCompletionMode = s),
            n
          );
        }
        return (0, h.Z)(r);
      })(g.rp);
      function L(e) {
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
            n = (0, v.Z)(e);
          if (t) {
            var i = (0, v.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, b.Z)(this, r);
        };
      }
      var N = (function (e) {
        (0, m.Z)(r, e);
        var t = L(r);
        function r(e) {
          var n,
            i = e.labId,
            o = e.labInstanceUuid,
            a = e.labVertical,
            s = e.labCompletionMode;
          return (
            (0, y.Z)(this, r),
            ((n = t.call(this, "LabsResumeBannerEndLabClickEvent")).labId =
              void 0),
            (n.labInstanceUuid = void 0),
            (n.labVertical = void 0),
            (n.labCompletionMode = void 0),
            (n.labId = i),
            (n.labInstanceUuid = o),
            (n.labVertical = a),
            (n.labCompletionMode = s),
            n
          );
        }
        return (0, h.Z)(r);
      })(g.rp);
      function U(e) {
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
            n = (0, v.Z)(e);
          if (t) {
            var i = (0, v.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, b.Z)(this, r);
        };
      }
      var M = (function (e) {
        (0, m.Z)(r, e);
        var t = U(r);
        function r(e) {
          var n,
            i = e.labId,
            o = e.labInstanceUuid,
            a = e.labVertical,
            s = e.labCompletionMode,
            c = e.secondsLeftOnWorkspace;
          return (
            (0, y.Z)(this, r),
            ((n = t.call(
              this,
              "LabsResumeBannerOpenWorkspaceClickEvent"
            )).labId = void 0),
            (n.labInstanceUuid = void 0),
            (n.labVertical = void 0),
            (n.labCompletionMode = void 0),
            (n.secondsLeftOnWorkspace = void 0),
            (n.labId = i),
            (n.labInstanceUuid = o),
            (n.labVertical = a),
            (n.labCompletionMode = s),
            (n.secondsLeftOnWorkspace = c),
            n
          );
        }
        return (0, h.Z)(r);
      })(g.rp);
      function B(e) {
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
            n = (0, v.Z)(e);
          if (t) {
            var i = (0, v.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, b.Z)(this, r);
        };
      }
      var F = (function (e) {
        (0, m.Z)(r, e);
        var t = B(r);
        function r(e) {
          var n,
            i = e.labId,
            o = e.labInstanceUuid,
            a = e.labVertical,
            s = e.labCompletionMode;
          return (
            (0, y.Z)(this, r),
            ((n = t.call(this, "LabsResumeBannerViewEvent")).labId = void 0),
            (n.labInstanceUuid = void 0),
            (n.labVertical = void 0),
            (n.labCompletionMode = void 0),
            (n.labId = i),
            (n.labInstanceUuid = o),
            (n.labVertical = a),
            (n.labCompletionMode = s),
            n
          );
        }
        return (0, h.Z)(r);
      })(g.rp);
      function z(e) {
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
            n = (0, v.Z)(e);
          if (t) {
            var i = (0, v.Z)(this).constructor;
            r = Reflect.construct(n, arguments, i);
          } else r = n.apply(this, arguments);
          return (0, b.Z)(this, r);
        };
      }
      var V,
        H,
        W,
        G,
        K,
        q,
        Y = (function (e) {
          (0, m.Z)(r, e);
          var t = z(r);
          function r(e) {
            var n,
              i = e.sourceComponent,
              o = e.searchTerm,
              a = e.searchCategory,
              s = e.numResults,
              c = e.ordering,
              u = e.isPopularTopicPillSelected,
              l = e.features;
            return (
              (0, y.Z)(this, r),
              ((n = t.call(this, "LabsSearchEvent")).sourceComponent = void 0),
              (n.searchTerm = void 0),
              (n.searchCategory = void 0),
              (n.numResults = void 0),
              (n.ordering = void 0),
              (n.isPopularTopicPillSelected = void 0),
              (n.features = void 0),
              (n.sourceComponent = i),
              (n.searchTerm = o),
              (n.searchCategory = a),
              (n.numResults = s),
              (n.ordering = c),
              (n.isPopularTopicPillSelected = u),
              (n.features = l),
              n
            );
          }
          return (0, h.Z)(r);
        })(g.rp),
        Q = "read-source-code",
        J = "".concat(Q, ":error"),
        X = "write-source-code",
        $ = "".concat(X, ":success"),
        ee = "".concat(X, ":error"),
        te = "delete-file",
        re = "delete-folder",
        ne = "rename",
        ie = "".concat(te, ":error"),
        oe = "".concat(re, ":error"),
        ae = "".concat(te, ":success"),
        se = "".concat(re, ":success"),
        ce = "".concat(ne, ":error"),
        ue = "".concat(ne, ":success"),
        le = "create-folder",
        pe = "create-file",
        de = "".concat(le, ":error"),
        fe = "".concat(pe, ":error"),
        he = "".concat(pe, ":success"),
        ye = "".concat(le, ":success"),
        me = "upload-file",
        be = "".concat(me, ":success"),
        ve = "".concat(me, ":error"),
        ge = "export-source-code",
        _e = "".concat(ge, ":success"),
        Oe = "".concat(ge, ":error"),
        we = "search",
        ke =
          (Object.freeze({
            SOCKET_CONNECT: "connect",
            SOCKET_CONNECT_ERROR: "connect_error",
            SOCKET_ERROR: "error",
            SOCKET_DISCONNECT: "disconnect",
            SOCKET_RECONNECT: "reconnect",
            SOCKET_RECONNECT_ATTEMPT: "reconnect_attempt",
            SOCKET_UNAUTHORIZED: " unauthorized",
            READ_DIR: "read-source-dir",
            READ_SOURCE_CODE: Q,
            READ_SOURCE_CODE_ERROR: J,
            RENAME: ne,
            RENAME_ERROR: ce,
            RENAME_SUCCESS: ue,
            DELETE_FILE: te,
            DELETE_FOLDER: re,
            DELETE_FILE_ERROR: ie,
            DELETE_FILE_SUCCESS: ae,
            DELETE_FOLDER_ERROR: oe,
            DELETE_FOLDER_SUCCESS: se,
            CREATE_FILE: pe,
            CREATE_FOLDER: le,
            CREATE_FILE_ERROR: fe,
            CREATE_FOLDER_ERROR: de,
            CREATE_FILE_SUCCESS: he,
            CREATE_FOLDER_SUCCESS: ye,
            WRITE_SOURCE_CODE: X,
            WRITE_SOURCE_CODE_ERROR: ee,
            WRITE_SOURCE_CODE_SUCCESS: $,
            UPLOAD_FILE: me,
            UPLOAD_FILE_SUCCESS: be,
            UPLOAD_FILE_ERROR: ve,
            TERMINAL_INPUT: "terminal:input",
            TERMINAL_OUTPUT: "terminal:output",
            TERMINAL_SET_OPTIONS: "terminal:set-options",
            TERMINAL_RESIZE: "terminal:resize",
            TERMINAL_ERROR: "terminal:error",
            TERMINAL_GEOMETRY: "terminal:geometry",
            SSH_ERROR: "ssherror",
            LAB_READY: "lab-ready",
            LOG_TAIL: "log-tail",
            LOG_TAIL_LOG_INFO: "log-tail:log-info",
            LOG_TAIL_IS_PAUSED: "log-tail:is-paused",
            SUPPORTED_FEATURES: "supported-features",
            EXPORT_SOURCE_CODE: ge,
            EXPORT_SOURCE_CODE_SUCCESS: _e,
            EXPORT_SOURCE_CODE_ERROR: Oe,
          }),
          Object.freeze({ vocareum: "vocareum", udemy: "udemy" }),
          Object.freeze({
            aws: {
              key: "aws",
              get label() {
                return gettext("AWS");
              },
              glyph: "cloud",
              iconComponent: s(),
            },
            azure: {
              key: "azure",
              get label() {
                return gettext("Azure");
              },
              glyph: "cloud",
              iconComponent: s(),
            },
            gcp: {
              key: "gcp",
              get label() {
                return gettext("Google Cloud Provider");
              },
              glyph: "cloud",
              iconComponent: s(),
            },
            web: {
              key: "web",
              get label() {
                return gettext("Web");
              },
              glyph: "code",
              iconComponent: u(),
            },
            data_science: {
              key: "data_science",
              get label() {
                return gettext("Data Science");
              },
              glyph: "bar-chart",
              iconComponent: o(),
            },
            devops: {
              key: "devops",
              get label() {
                return gettext("DevOps");
              },
              glyph: "server",
              iconComponent: f(),
            },
            security: {
              key: "security",
              get label() {
                return gettext("Security");
              },
              glyph: "security",
              iconComponent: p(),
            },
          })),
        xe = Object.freeze({
          4452: "aws",
          6716: "azure",
          8322: "web",
          5336: "data_science",
          5404: "devops",
          5988: "gcp",
        }),
        Pe =
          (Object.freeze({
            aws: {
              id: 4452,
              get title() {
                return gettext("Amazon AWS");
              },
              is_vertical_topic: !0,
            },
            azure: {
              id: 6716,
              get title() {
                return gettext("Microsoft Azure");
              },
              is_vertical_topic: !0,
            },
            gcp: {
              id: 5988,
              get title() {
                return gettext("Google Cloud Platform");
              },
              is_vertical_topic: !0,
            },
            web: {
              id: 8322,
              get title() {
                return gettext("Software Development");
              },
              is_vertical_topic: !0,
            },
            data_science: {
              id: 5336,
              get title() {
                return gettext("Data Science");
              },
              is_vertical_topic: !0,
            },
            devops: {
              id: 5404,
              get title() {
                return gettext("DevOps");
              },
              is_vertical_topic: !0,
            },
          }),
          Object.freeze({
            gcp: {
              key: "gcp",
              get label() {
                return gettext("Google Cloud Platform");
              },
            },
            compute_engine: {
              key: "compute_engine",
              get label() {
                return gettext("Compute Engine");
              },
            },
            azure: {
              key: "azure",
              get label() {
                return gettext("Azure");
              },
            },
            virtual_machine: {
              key: "virtual-machine",
              get label() {
                return gettext("Virtual machine");
              },
            },
            storage: {
              key: "table-storage",
              get label() {
                return gettext("Table storage");
              },
            },
            aws: {
              key: "aws",
              get label() {
                return gettext("AWS");
              },
            },
            ec2: {
              key: "ec2",
              get label() {
                return gettext("EC2");
              },
            },
            load_balancer: {
              key: "load-balancer",
              get label() {
                return gettext("Load Balancer");
              },
            },
            vpc: {
              key: "vpc",
              get label() {
                return gettext("VPC");
              },
            },
            s3: {
              key: "s3",
              get label() {
                return gettext("S3");
              },
            },
            lambda: {
              key: "lambda",
              get label() {
                return gettext("Lambda");
              },
            },
            athena: {
              key: "athena",
              get label() {
                return gettext("Athena");
              },
            },
            cloud_formation: {
              key: "cloud-formation",
              get label() {
                return gettext("CloudFormation");
              },
            },
            glue: {
              key: "glue",
              get label() {
                return gettext("Glue");
              },
            },
            java: {
              key: "java",
              get label() {
                return gettext("Java");
              },
            },
            spring: {
              key: "spring",
              get label() {
                return gettext("Spring");
              },
            },
            html: {
              key: "html",
              get label() {
                return gettext("HTML");
              },
            },
            css: {
              key: "css",
              get label() {
                return gettext("CSS");
              },
            },
            react: {
              key: "react",
              get label() {
                return gettext("React");
              },
            },
            python: {
              key: "python",
              get label() {
                return gettext("Python");
              },
              has_alr: !0,
            },
            flask: {
              key: "flask",
              get label() {
                return gettext("Flask");
              },
            },
            mongodb: {
              key: "mongodb",
              get label() {
                return gettext("MongoDB");
              },
            },
            redux: {
              key: "redux",
              get label() {
                return gettext("Redux");
              },
            },
            mysql: {
              key: "mysql",
              get label() {
                return gettext("MySQL");
              },
              has_alr: !0,
            },
            typescript: {
              key: "typescript",
              get label() {
                return gettext("Typescript");
              },
            },
            express: {
              key: "express",
              get label() {
                return gettext("Express");
              },
            },
            data_science: {
              key: "data_science",
              get label() {
                return gettext("Data science");
              },
              has_alr: !0,
            },
            devops: {
              key: "devops",
              get label() {
                return gettext("DevOps");
              },
              has_alr: !0,
            },
            git: {
              key: "git",
              get label() {
                return gettext("Git");
              },
            },
            jenkins: {
              key: "jenkins",
              get label() {
                return gettext("Jenkins");
              },
            },
            ansible: {
              key: "ansible",
              get label() {
                return gettext("Ansible");
              },
            },
            docker: {
              key: "docker",
              get label() {
                return gettext("Docker");
              },
            },
            kubernetes: {
              key: "kubernetes",
              get label() {
                return gettext("Kubernetes");
              },
              has_alr: !0,
            },
            security: {
              key: "security",
              get label() {
                return gettext("Security");
              },
            },
            linux: {
              key: "linux",
              get label() {
                return gettext("Linux");
              },
            },
          })),
        je = Object.freeze({
          all: Object.freeze({
            key: "all",
            get label() {
              return gettext("All");
            },
            verticals: [
              ke.aws.key,
              ke.azure.key,
              ke.gcp.key,
              ke.data_science.key,
              ke.devops.key,
              ke.security.key,
              ke.web.key,
            ],
          }),
          cloud: Object.freeze({
            key: "cloud",
            get label() {
              return gettext("Cloud computing");
            },
            verticals: [ke.aws.key, ke.azure.key, ke.gcp.key],
          }),
          dev: Object.freeze({
            key: "dev",
            get label() {
              return gettext("Development");
            },
            verticals: [ke.web.key, ke.devops.key],
          }),
          data_science: Object.freeze({
            key: "data_science",
            get label() {
              return gettext("Data science");
            },
            verticals: [ke.data_science.key],
          }),
          security: Object.freeze({
            key: "security",
            get label() {
              return gettext("IT Operations");
            },
            verticals: [ke.security.key],
          }),
        }),
        Ze =
          (Object.freeze({
            all: je.all,
            dev: je.dev,
            data_science: je.data_science,
          }),
          Object.freeze(
            ((V = {}),
            (0, n.Z)(
              V,
              je.all.key,
              Object.keys(Pe).map(function (e) {
                return Pe[e];
              })
            ),
            (0, n.Z)(V, je.cloud.key, [
              Pe.gcp,
              Pe.compute_engine,
              Pe.azure,
              Pe.storage,
              Pe.virtual_machine,
              Pe.aws,
              Pe.athena,
              Pe.cloud_formation,
              Pe.glue,
              Pe.ec2,
              Pe.lambda,
              Pe.load_balancer,
              Pe.s3,
              Pe.vpc,
            ]),
            (0, n.Z)(V, ke.gcp.key, [Pe.gcp, Pe.compute_engine]),
            (0, n.Z)(V, ke.security.key, [Pe.security, Pe.linux]),
            (0, n.Z)(V, je.dev.key, [
              Pe.css,
              Pe.express,
              Pe.flask,
              Pe.html,
              Pe.java,
              Pe.mongodb,
              Pe.mysql,
              Pe.python,
              Pe.react,
              Pe.redux,
              Pe.spring,
              Pe.typescript,
              Pe.devops,
              Pe.git,
              Pe.ansible,
              Pe.jenkins,
              Pe.docker,
              Pe.kubernetes,
            ]),
            (0, n.Z)(V, je.data_science.key, [Pe.data_science]),
            V)
          ),
          Object.freeze(
            ((H = {}),
            (0, n.Z)(H, ke.aws.key, { MX: 140, UB: 390 }),
            (0, n.Z)(H, ke.azure.key, { MX: 140, UB: 390 }),
            (0, n.Z)(H, ke.gcp.key, { MX: 140, UB: 390 }),
            (0, n.Z)(H, ke.web.key, { MX: 8, UB: 414 }),
            (0, n.Z)(H, ke.devops.key, { MX: 362, UB: 406 }),
            (0, n.Z)(H, ke.data_science.key, { MX: 558, UB: 504 }),
            (0, n.Z)(H, ke.security.key, { MX: 134, UB: 442 }),
            H)
          ),
          {
            starting: "starting",
            running: "running",
            queued: "queued",
            stopping: "stopping",
            stopped: "stopped",
            killing: "killing",
            killed: "killed",
            admin_killing: "admin_killing",
            admin_killed: "admin_killed",
            deactivated: "deactivated",
            error: "error",
          }),
        Re = {
          pending_create: "creating",
          draft: "draft",
          in_review: "in_review",
          pending_publish: "publishing",
          published: "published",
          unpublished: "unpublished",
          deleted: "deleted",
        },
        Te = "base",
        Ee = "test-creator",
        Ie = "edit",
        Ce = ["admin", "admin-eng"].concat(["full"]).concat([Ie]),
        Se =
          (Ce.concat([Ee]),
          Ce.concat([Te]),
          {
            FOLLOW_ALONG: "follow_along",
            STRUCTURED: "structured",
            OPEN: "open",
          }),
        De =
          (ke.aws.key,
          ke.azure.key,
          ke.gcp.key,
          ke.web.key,
          ke.devops.key,
          ke.data_science.key,
          ke.security.key,
          Re.pending_create,
          Re.pending_publish,
          Re.draft,
          Re.published,
          Re.draft,
          Re.in_review,
          Re.published,
          (W = {}),
          (0, n.Z)(W, Re.draft, {
            get label() {
              return gettext("DRAFT");
            },
          }),
          (0, n.Z)(W, Re.in_review, {
            get label() {
              return gettext("IN REVIEW");
            },
          }),
          (0, n.Z)(W, Re.published, {
            get label() {
              return gettext("PUBLISHED");
            },
          }),
          Ze.starting,
          Ze.queued,
          Ze.stopping,
          Ze.killing,
          Ze.killed,
          Ze.killing,
          Ze.admin_killing,
          Ze.admin_killed,
          Ze.deactivated,
          "/labs/"),
        Ae =
          (Object.freeze({
            HEARTBEAT: P,
            LAB_CARD_CLICK: k,
            CLICK: O,
            OVERVIEW_PAGE_VISIT: T,
            SEARCH: Y,
            HEADER_CLICK: I,
            LAB_IN_COURSE_PROMPT_ACTION: Z,
            RESUME_BANNER_CONTINUE_CLICK: S,
            RESUME_BANNER_DISMISS_CLICK: A,
            RESUME_BANNER_END_LAB_CLICK: N,
            RESUME_BANNER_VIEW: F,
            RESUME_BANNER_OPEN_WORKSPACE_CLICK: M,
          }),
          Object.freeze({
            MODULAR_LAB_CARD_CLICK: "modular_lab_card_click",
            MODULAR_LAB_START_LAB_CLICK: "modular_lab_start_lab_click",
            MODULAR_LAB_SEE_YOUR_TASKS_CLICK:
              "modular_lab_see_your_tasks_click",
            MODULAR_LAB_SEE_PROJECT_RESOURCES_CLICK:
              "modular_lab_see_project_resources_click",
            MODULAR_LAB_NAV_INBOX_CLICK: "modular_lab_nav_inbox_click",
            MODULAR_LAB_NAV_TASKS_CLICK: "modular_lab_nav_tasks_click",
            MODULAR_LAB_WORKSPACE_LAUNCH: "modular_lab_workspace_launch",
            MODULAR_LAB_START_TASK_REVIEW: "modular_lab_start_task_review",
            MODULAR_LAB_COMPLETE_TASK_CLICK: "modular_lab_complete_task_click",
            MODULAR_LAB_COMPLETE_LAB_CLICK: "modular_lab_complete_lab_click",
            MODULAR_LAB_RESOURCES_FOLDER_CLICK:
              "modular_lab_resources_folder_click",
            MODULAR_LAB_RESOURCE_CLICK: "modular_lab_resource_click",
            MODULAR_LAB_RESOURCE_DOWNLOAD: "modular_lab_resource_download",
            MODULAR_LAB_RESTART_TASK_CLICK: "modular_lab_restart_task_click",
            MODULAR_LAB_RESTART_LAB_CLICK: "modular_lab_restart_lab_click",
            MODULAR_LAB_SHOW_API_KEYS_CLICK: "modular_lab_show_api_keys_click",
            MODULAR_LAB_CLOSE_API_KEYS_CLICK:
              "modular_lab_close_api_keys_click",
            MODULAR_LAB_CONTINUE_LAB_CLICK: "modular_lab_continue_lab_click",
            MODULAR_LAB_RETAKE_LAB_CLICK: "modular_lab_retake_lab_click",
            MODULAR_LAB_REPORT_TASK_ISSUE_CLICK:
              "modular_lab_report_task_issue_click",
            WORKSPACE_LOGIN_ACCORDION_EXPAND:
              "workspace_login_accordion_expand",
            WORKSPACE_LOGIN_ACCORDION_COLLAPSE:
              "workspace_login_accordion_collapse",
            WORKSPACE_LOGIN_ADVANCED_ACCORDION_EXPAND:
              "workspace_login_advanced_accordion_expand",
            WORKSPACE_LOGIN_ADVANCED_ACCORDION_COLLAPSE:
              "workspace_login_advanced_accordion_collapse",
            WORKSPACE_LOGIN_OPEN_WORKSPACE_CLICK:
              "workspace_login_open_workspace_click",
            WORKSPACE_COPY_USERNAME_CLICK: "workspace_copy_username_click",
            WORKSPACE_COPY_PASSWORD_CLICK: "workspace_copy_password_click",
            WORKSPACE_COPY_RESOURCE_GROUP_CLICK:
              "workspace_copy_resource_group_click",
            WORKSPACE_LOGIN_MODAL_CLOSE: "workspace_login_modal_close",
            LAB_TAB_VISIT: "lab_tab_visit",
            SKIP_LABS_SETUP_CONFIRM: "skip_labs_setup_confirm",
            SKIP_LABS_SETUP_DISMISS: "skip_labs_setup_dismiss",
            SW_LAB_FILE_CREATE: "sw_lab_file_create",
            SW_LAB_FOLDER_CREATE: "sw_lab_folder_create",
            SW_LAB_FILE_UPLOAD: "sw_lab_file_upload",
            SW_LAB_EXPORT_SOURCE_CODE: "sw_lab_export_source_code",
            SW_LAB_AUTOSAVE_TRIGGER: "sw_lab_autosave_trigger",
            SW_LAB_PANEL_PREVIEW_REFRESH_CLICK:
              "sw_lab_panel_preview_refresh_click",
            SW_LAB_PANEL_PREVIEW_NEW_WINDOW_CLICK:
              "sw_lab_panel_preview_new_window_click",
            SW_LAB_PANEL_PREVIEW_EXPAND_CLICK:
              "sw_lab_panel_preview_expand_click",
            LAUNCH: "launch",
            CONNECT: "connect",
            PAUSE: "pause",
            RESUME: "resume",
            END: "end",
            END_CONFIRM: "end_confirm",
            END_CANCEL: "end_cancel",
            EDIT: "edit",
            PUBLISH: "publish",
            UNPUBLISH: "unpublish",
            DELETE: "delete",
            LOGS_MODAL_OPEN: "logs_modal_open",
            LOGS_MODAL_CLOSE: "logs_modal_close",
          }),
          Object.freeze({
            INBOX: "inbox",
            HEADER: "lab_header",
            REVIEW: "review_toaster",
          }),
          Object.freeze({
            MODULAR_LAB_TAKING: "modular_lab_taking",
            MODULAR_LAB_WORKSPACE_LAUNCHER: "modular_lab_workspace_launcher",
          }),
          Object.freeze({ INSTRUCTOR: "Instructor", STUDENT: "Student" }),
          Object.freeze({
            js: "jsx",
            jsx: "jsx",
            css: "css",
            py: "python",
            sql: "sql",
            sh: "sh",
            ejs: "html",
            html: "html",
            java: "java",
            json: "json",
            ts: "typescript",
            tsx: "typescript",
            xml: "xml",
            yaml: "yaml",
            yml: "yaml",
            r: "r",
            R: "r",
            ipynb: "json",
          }),
          { autoDismiss: !0, autoDismissTimeout: 5e3 }),
        Le = Object.freeze({
          udStyle: "error",
          get ctaText() {
            return gettext("Close");
          },
          dismissButtonProps: !1,
        }),
        Ne =
          (Object.freeze({
            udStyle: "success",
            showCta: !1,
            dismissButtonProps: !1,
          }),
          Object.freeze({
            workspace: {
              key: "workspace",
              get label() {
                return gettext("Workspace");
              },
            },
            modular: {
              key: "modular",
              get label() {
                return gettext("Modular Lab");
              },
            },
            dev_workspace: {
              key: "dev_workspace",
              get label() {
                return gettext("Instructor Development Workspace");
              },
            },
          })),
        Ue =
          ((G = {}),
          (0, n.Z)(G, Ne.workspace.key, 30),
          (0, n.Z)(G, Ne.modular.key, 180),
          (0, n.Z)(G, Ne.dev_workspace.key, 30),
          G),
        Me =
          ((K = {}),
          (0, n.Z)(K, Ne.workspace.key, 60 * Ue[Ne.workspace.key] * 1e3),
          (0, n.Z)(K, Ne.modular.key, 60 * Ue[Ne.modular.key] * 1e3),
          (0, n.Z)(
            K,
            Ne.dev_workspace.key,
            60 * Ue[Ne.dev_workspace.key] * 1e3
          ),
          Object.freeze({
            get START_LAB_FEEDBACK() {
              return gettext(
                "There was a problem starting your lab. Please refresh your browser and try again."
              );
            },
            get STOP_LAB_FEEDBACK() {
              return gettext(
                "There was a problem stopping your lab. Please refresh your browser and try again."
              );
            },
            get SYNC_LAB_FEEDBACK() {
              return gettext(
                "There was a problem syncing labs for this course. Please refresh your browser."
              );
            },
            get TERMINATE_LAB_FEEDBACK() {
              return gettext(
                "There was a problem terminating your lab. Please refresh your browser and try again."
              );
            },
            get MODULAR_LABS_TIME_LIMIT_MESSAGE() {
              return interpolate(
                gettext(
                  "In order to conserve resources, your Workspace will be active for a maximum time of %(labTimeLimitHrs)s hours. We will let you know once you have %(warningTimeMin)s minutes left of work. If you manually end your Workspace or automatically reach the time limit, your work will no longer be available."
                ),
                {
                  labTimeLimitHrs: Ue[Ne.modular.key] / 60,
                  warningTimeMin: 30,
                },
                !0
              );
            },
          }),
          "how_to"),
        Be = "documentation",
        Fe = "asset",
        ze = "azure_resource",
        Ve = "initial_source_code",
        He = "solution_source_code",
        We =
          ((q = {}),
          (0, n.Z)(q, Me, {
            get label() {
              return gettext("How-to");
            },
          }),
          (0, n.Z)(q, Be, {
            get label() {
              return gettext("Documentation");
            },
          }),
          (0, n.Z)(q, Fe, {
            get label() {
              return gettext("Assets");
            },
          }),
          (0, n.Z)(q, ze, {
            get label() {
              return gettext("Azure resources");
            },
          }),
          (0, n.Z)(q, Ve, {
            get label() {
              return gettext("Initial source code");
            },
          }),
          (0, n.Z)(q, He, {
            get label() {
              return gettext("Peer solution");
            },
          }),
          Object.freeze({
            get first() {
              return gettext(
                "Thanks for making an effort on this first task! You can see my solution steps below to check your work under \u201cHow-to\u201d. Once you've checked your work, I\u2019ll share the next task. Glad to have you on this project!"
              );
            },
            get second() {
              return gettext(
                "Nice work tackling this task! As before, I\u2019ve provided my solution below for you to check your work on this one. I\u2019ll keep assigning you tasks and offering solutions this way going forward so that you can work at your own pace using the same process."
              );
            },
            get last() {
              return gettext(
                "Congratulations on solving this complex problem! Make sure you check to see if your final task matches my intended outcome. Great work again! Looking forward to sharing your efforts with the broader team."
              );
            },
            get pool() {
              return [
                gettext(
                  "Another task down! You are making great progress. Keep at it! Don\u2019t forget to compare your work to the solution below."
                ),
                gettext(
                  "Ready to check your work? Take a look at my solution and carry on! Looking forward to seeing how you do with the next one."
                ),
                gettext(
                  "Nice work tackling this task! I\u2019ve provided my solution below for you to ensure you completed the steps correctly. Keep working at your own pace on these tasks! Looking forward to seeing what you can accomplish."
                ),
                gettext(
                  "Great effort on completing this task. This project isn\u2019t easy! You\u2019re doing great work. Hope my solution can help you check your work on this one."
                ),
                gettext(
                  "Loving the progress you\u2019ve made here! Make sure you check your work against my solution. Let\u2019s keep working together on these tasks to make this project a success!"
                ),
                gettext(
                  "Looks like our collaborative process is working. Carry on with reviewing your work and I\u2019ll check in after your next task!"
                ),
                gettext(
                  "It\u2019s great to see the progress on this project. Let\u2019s stick to our system and check your work against my solution before moving on to the next task."
                ),
                gettext(
                  "How did you feel about this one? Hope you were able to find a solution. Take a look at my steps to review. Really excited to see this project moving forward!"
                ),
                gettext(
                  "Think you got this one? Check out my solution to see if you\u2019re on the right track. Regardless, you\u2019re doing a great job making an effort on this project. Keep going!"
                ),
                gettext(
                  "Thanks for your work progressing through these tasks. Review my steps to ensure you\u2019ve got it before moving on. Glad to see you\u2019re making progress!"
                ),
              ];
            },
          })),
        Ge = Object.freeze({
          get first() {
            return gettext(
              "Thanks for making an effort on this first task! You can check your work using the reference materials provided. Once you've checked your work, I'll share the next task. Glad to have you on this project!"
            );
          },
          get second() {
            return gettext(
              "Nice work tackling this task! Please use the reference materials to check your work. I'll keep assigning you tasks this way, so that you can work at your own pace using the same process."
            );
          },
          get penultimate() {
            return gettext(
              "You've come a long way on this project! Great to see you nearing the end. Looking forward to seeing the finished product."
            );
          },
          get last() {
            return gettext(
              "Congratulations on solving this complex problem! Make sure you check to see if your final task matches my intended outcome. Great work again! Looking forward to sharing your efforts with the broader team."
            );
          },
          get pool() {
            return [
              gettext(
                "Another task down! You are making great progress. Keep at it! Don't forget to compare your work to the reference material provided."
              ),
              gettext(
                "Ready to check your work? Take a look at the reference materials and carry on! Looking forward to seeing how you do with the next one."
              ),
              gettext(
                "Nice work tackling this task! I've provided reference materials to ensure you completed the steps correctly. Keep working at your own pace on these tasks! Looking forward to seeing what you can accomplish."
              ),
              gettext(
                "Great effort on completing this task. This project isn't easy! You're doing great work. Hope the reference material can help you check your work on this one."
              ),
              gettext(
                "Loving the progress you've made here! Make sure you check your work. Let's keep working together on these tasks to make this project a success!"
              ),
              gettext(
                "Looks like our collaborative process is working. Carry on with reviewing your work and I'll check in after your next task!"
              ),
              gettext(
                "It's great to see the progress on this project. Let's stick to our system and check your work against the reference material before moving on to the next task."
              ),
              gettext(
                "How did you feel about this one? Hope you were able to find a solution. Take a look at the reference material to review. Really excited to see this project moving forward!"
              ),
              gettext(
                "Think you got this one? Check out the reference materials to see if you're on the right track. Regardless, you're doing a great job making an effort on this project. Keep going!"
              ),
              gettext(
                "Thanks for your work progressing through these tasks. Review your work to ensure you've got it before moving on. Glad to see you're making progress!"
              ),
            ];
          },
        }),
        Ke = 500;
      Ne.workspace.key,
        Ne.dev_workspace.key,
        Object.freeze({ ALR_FILTER: "alr_filter" }),
        Object.freeze({ LAUNCHER: "lab_launcher" });
    },
    31378: function (e, t, r) {
      "use strict";
      r.d(t, {
        qH: function () {
          return s;
        },
      });
      var n = r(59499);
      r(36186);
      function i(e, t) {
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
      function o(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? i(Object(r), !0).forEach(function (t) {
                (0, n.Z)(e, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
            : i(Object(r)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(r, t)
                );
              });
        }
        return e;
      }
      var a = {
          en_US: {
            courses: 10500,
            avgRating: 4.4,
            instructors: 3e3,
            practiceExercises: 4e3,
            practiceTestCourses: 136,
          },
          es_ES: {
            courses: 1500,
            avgRating: 4.5,
            instructors: 740,
            practiceExercises: 400,
            practiceTestCourses: 10,
          },
          pt_BR: {
            courses: 1300,
            avgRating: 4.6,
            instructors: 650,
            practiceExercises: 180,
            practiceTestCourses: 9,
          },
          de_DE: {
            courses: 800,
            avgRating: 4.5,
            instructors: 360,
            practiceExercises: 130,
            practiceTestCourses: 5,
          },
        },
        s = function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : "en_US",
            t = o({}, a.en_US);
          return (
            e in a &&
              ((t = o({}, a[e])),
              "en_US" !== e && (t.englishCourses = a.en_US.courses)),
            t
          );
        };
    },
    14556: function (e, t, r) {
      "use strict";
      r.d(t, {
        c: function () {
          return y;
        },
      });
      var n = r(17674),
        i = r(77276),
        o = r.n(i),
        a = r(13527),
        s = r(94184),
        c = r.n(s),
        u = r(80955),
        l = (r(67294), r(79594)),
        p = r(23554),
        d = r(27910),
        f = r.n(d),
        h = r(85893);
      var y = (0, u.f3)("trackingContext")(
        (0, u.Pi)(function (e) {
          var t = e.data,
            r = e.showTopicTitle,
            i = void 0 !== r && r,
            s = e.index,
            u = void 0 === s ? -1 : s,
            d = e.trackingContext,
            y = e.trackingData,
            m = e.onAction,
            b = e.isConsumerSubsSubscriber,
            v = t.url,
            g = b ? t.learn_url : t.enroll_url;
          return (
            (v && !b) ||
              !g ||
              (v = (function (e) {
                var t = e.split("?"),
                  r = (0, n.Z)(t, 2),
                  i = r[0],
                  o = r[1],
                  a = new URLSearchParams(o);
                return (
                  a.set("isDefaultPlaying", ""),
                  "".concat(i, "?").concat(a.toString())
                );
              })(g)),
            (0, h.jsx)(p.H, {
              trackFunc: function () {
                if (d && y) {
                  var e = d.backendSource;
                  (0, d.trackImpressionFunc)(
                    { item: y },
                    { index: u, backendSource: e }
                  );
                }
              },
              children: (0, h.jsxs)("a", {
                href: v,
                onClick: m,
                "data-purpose": "card-url",
                className: f().wrapper,
                children: [
                  (0, h.jsx)(o(), {
                    label: !1,
                    size: "xlarge",
                    className: f()["play-icon"],
                  }),
                  (0, h.jsx)("div", {
                    className: c()("ud-heading-sm", f().title),
                    "data-purpose": "card-title",
                    children: t.title,
                  }),
                  (0, h.jsxs)("div", {
                    className: c()("ud-text-xs", f()["bottom-info-container"]),
                    children: [
                      i &&
                        (0, h.jsx)("div", {
                          "data-purpose": "topic",
                          className: f().topic,
                          children: t.primary_topic_title,
                        }),
                      (0, h.jsx)(l.nj, {
                        dataPurpose: "video-duration",
                        html: gettext(
                          '<span class="duration">%(duration)s</span> video'
                        ),
                        interpolate: {
                          duration: (0, h.jsx)(a.n, {
                            numSeconds: t.content_length,
                            precision: a.n.PRECISION.MINUTES,
                          }),
                        },
                      }),
                    ],
                  }),
                ],
              }),
            })
          );
        })
      );
    },
    72402: function () {
      var e, t, r;
      "undefined" !== typeof Event &&
        ((e = Event.prototype),
        (t = document),
        (r = window),
        e.composedPath ||
          (e.composedPath = function () {
            if (this.path) return this.path;
            var e = this.target;
            for (this.path = []; null !== e.parentNode; )
              this.path.push(e), (e = e.parentNode);
            return this.path.push(t, r), this.path;
          }));
    },
    45153: function (e, t, r) {
      "use strict";
      r.d(t, {
        h: function () {
          return l;
        },
      });
      var n,
        i = r(90116),
        o = r(17674),
        a = r(92777),
        s = r(82262),
        c = r(71218),
        u = r(22188),
        l =
          ((n = (function () {
            function e(t) {
              (0, a.Z)(this, e), this.setDataFromAPI(t), (this._apiData = t);
            }
            return (
              (0, s.Z)(e, [
                {
                  key: "apiDataMap",
                  get: function () {
                    return {};
                  },
                },
                {
                  key: "setDataFromAPI",
                  value: function (e) {
                    var t = this;
                    Object.entries(this.apiDataMap).forEach(function (r) {
                      var n = (0, o.Z)(r, 2),
                        a = n[0],
                        s = n[1];
                      if ("string" === typeof s)
                        void 0 !== e[s] && (t[a] = e[s]);
                      else {
                        var c =
                            "string" === typeof s.source
                              ? [s.source]
                              : s.source,
                          u =
                            s.map ||
                            function (e) {
                              return e;
                            };
                        if (
                          c.every(function (t) {
                            return void 0 !== e[t];
                          })
                        ) {
                          var l = c.map(function (t) {
                              return e[t];
                            }),
                            p = u.apply(void 0, (0, i.Z)(l));
                          void 0 !== p && (t[a] = p);
                        } else
                          void 0 !== s.defaultValue &&
                            void 0 === t[a] &&
                            (t[a] = s.defaultValue);
                      }
                    });
                  },
                },
              ]),
              e
            );
          })()),
          (0, c.Z)(
            n.prototype,
            "setDataFromAPI",
            [u.aD],
            Object.getOwnPropertyDescriptor(n.prototype, "setDataFromAPI"),
            n.prototype
          ),
          n);
    },
    50771: function (e, t, r) {
      "use strict";
      r.d(t, {
        A: function () {
          return a;
        },
        H: function () {
          return o;
        },
      });
      var n = r(43283),
        i = r(48043);
      function o(e) {
        var t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          r = t.site_stats || UD.site_stats,
          n = r.organizations[e];
        return "number" === typeof n ? (0, i.uf)(n) : n;
      }
      function a(e) {
        var t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          r = t.Config || (0, n.c)(),
          o = t.site_stats || UD.site_stats,
          a = o.default[e];
        return (
          r.brand.has_organization &&
            e in o.organizations &&
            (a = o.organizations[e]),
          "number" === typeof a ? (0, i.uf)(a) : a
        );
      }
    },
    73492: function (e, t, r) {
      "use strict";
      var n = r(95880);
      (0, r(2828).I2)(), (t.Z = n.Z.global.UD.performance);
    },
    70936: function (e) {
      e.exports = {
        "plan-period-one-line": "plan-period_plan-period-one-line__Q4dG_",
        "plan-period-multiline-no-margin":
          "plan-period_plan-period-multiline-no-margin__XaeEX",
        "plan-period-multiline": "plan-period_plan-period-multiline__Ts7JV",
        "cancel-anytime-one-line": "plan-period_cancel-anytime-one-line__oLPZX",
        "cancel-anytime-multiline":
          "plan-period_cancel-anytime-multiline__juQ7y",
      };
    },
    87998: function (e) {
      e.exports = {
        container: "subscription-cta_container__xDJbn",
        "cta-button": "subscription-cta_cta-button___cz3e",
        "skeleton-button": "subscription-cta_skeleton-button__JJ692",
        "skeleton-text": "subscription-cta_skeleton-text__Y5Hk8",
        subtitle: "subscription-cta_subtitle__klqOm",
        text: "subscription-cta_text__pXRn_",
      };
    },
    4861: function (e) {
      e.exports = { "ajax-error": "ajax-modal_ajax-error__v4zqi" };
    },
    22409: function (e) {
      e.exports = {
        "card-progress-meter": "card-info-container_card-progress-meter__78RAO",
        "card-info-container": "card-info-container_card-info-container__l2JFY",
      };
    },
    75013: function (e) {
      e.exports = {
        "stack-card-container":
          "stack-card-duration_stack-card-container__bJiSo",
        "stack-card-content": "stack-card-duration_stack-card-content__KxYhd",
        icon: "stack-card-duration_icon__RKWu_",
        "stack-card-content-text":
          "stack-card-duration_stack-card-content-text___xFxf",
      };
    },
    64590: function (e) {
      e.exports = {
        "stack-order-box": "stack-order-status_stack-order-box__Mx5YJ",
        "stack-order-text": "stack-order-status_stack-order-text__eCyvO",
      };
    },
    5055: function (e) {
      e.exports = {
        container: "stacked-carousel_container__1B2Az",
        "card-carousel": "stacked-carousel_card-carousel__J1aV5",
        "card-link": "stacked-carousel_card-link__diCB7",
        "inactive-card": "stacked-carousel_inactive-card__gUa1r",
        card: "stacked-carousel_card__toIap",
        first: "stacked-carousel_first__5ybXk",
        second: "stacked-carousel_second__jfCxe",
        third: "stacked-carousel_third__DZiQk",
        "previous-card": "stacked-carousel_previous-card__jm3hI",
        inactive: "stacked-carousel_inactive__5N8p_",
        "next-button": "stacked-carousel_next-button__7oSLe",
        "next-button-hidden": "stacked-carousel_next-button-hidden__9YirP",
        "prev-button": "stacked-carousel_prev-button__QcZLV",
        "prev-button-hidden": "stacked-carousel_prev-button-hidden__al4sX",
      };
    },
    53045: function (e) {
      e.exports = {
        rating: "collection-stats_rating__CgcPr",
        "rating-icon": "collection-stats_rating-icon__9hURV",
        stats: "collection-stats_stats__PieL1",
        "stats-3": "collection-stats_stats-3__lRcFo",
        "stats-4": "collection-stats_stats-4__yHYDB",
        "stat-large": "collection-stats_stat-large__XygHB",
        "stat-default": "collection-stats_stat-default___Si2d",
        "stat-small": "collection-stats_stat-small__jP00N",
        "skeleton-stat-default":
          "collection-stats_skeleton-stat-default__Crm1q",
      };
    },
    96502: function (e) {
      e.exports = {
        "start-learning-label":
          "start-learning-label_start-learning-label__RuX9T",
        "label-position": "start-learning-label_label-position__tbZkN",
      };
    },
    50552: function (e) {
      e.exports = {
        "learning-section": "discovery-units-container_learning-section__zmvAu",
        "related-categories":
          "discovery-units-container_related-categories__37NHw",
        "topic-labels": "discovery-units-container_topic-labels__Lao3B",
      };
    },
    61159: function (e) {
      e.exports = {
        "skeleton-units-container":
          "discovery-units-loading-skeleton_skeleton-units-container__5n6uN",
        "skeleton-unit":
          "discovery-units-loading-skeleton_skeleton-unit__sa0L8",
        title: "discovery-units-loading-skeleton_title__jjlgC",
        "info-container":
          "discovery-units-loading-skeleton_info-container__cT_jw",
        "skeleton-card":
          "discovery-units-loading-skeleton_skeleton-card__3qoSA",
        "course-image": "discovery-units-loading-skeleton_course-image__RGgRO",
        "course-info": "discovery-units-loading-skeleton_course-info___VrDV",
      };
    },
    85668: function (e) {
      e.exports = {
        "title-container": "alternate-headline_title-container__DFZ7A",
        title: "alternate-headline_title__oYDJ8",
        "title-no-margin": "alternate-headline_title-no-margin__I5moK",
        "title-compact": "alternate-headline_title-compact__7PkJc",
        "secondary-text": "alternate-headline_secondary-text__myqFy",
        "secondary-text-subdued":
          "alternate-headline_secondary-text-subdued__L__CS",
        "secondary-text-small-margin":
          "alternate-headline_secondary-text-small-margin__6vuyI",
        "topic-page-title": "alternate-headline_topic-page-title__Lasjn",
        "topic-page-secondary-text":
          "alternate-headline_topic-page-secondary-text__s2x6_",
      };
    },
    76281: function (e) {
      e.exports = {
        "assessment-unit-container":
          "assessment-unit_assessment-unit-container__JNbxF",
        "subtitle-button-wrapper":
          "assessment-unit_subtitle-button-wrapper__jfQqB",
        "unit-subtitle": "assessment-unit_unit-subtitle___PElo",
        "browse-button": "assessment-unit_browse-button__abeuM",
        "is-standalone-unit": "assessment-unit_is-standalone-unit__RmiK_",
        "assessment-carousel": "assessment-unit_assessment-carousel__cducM",
        "assessment-unit-card": "assessment-unit_assessment-unit-card__NKwix",
      };
    },
    61171: function (e) {
      e.exports = {
        "content-container": "course-comparison_content-container__y52R4",
        "show-more": "course-comparison_show-more__2bQ_Z",
        "course-container": "course-comparison_course-container__vPd8K",
        "hide-in-subscription": "course-comparison_hide-in-subscription__AF8RY",
        "main-content": "course-comparison_main-content__kdEzn",
        "course-title": "course-comparison_course-title__IM2DS",
        "course-info": "course-comparison_course-info__CnK2m",
        "meta-items": "course-comparison_meta-items__Vakdv",
        "content-info": "course-comparison_content-info__7_55n",
        "comparison-content": "course-comparison_comparison-content__gUOUH",
        "num-students": "course-comparison_num-students__MKpAM",
        "price-text-container": "course-comparison_price-text-container__1yBlL",
        "discount-price": "course-comparison_discount-price__dgbkg",
        "list-price": "course-comparison_list-price__NGpuz",
        "wishlist-content": "course-comparison_wishlist-content__ATHEz",
        "image-wrapper": "course-comparison_image-wrapper__APzX_",
        "course-image": "course-comparison_course-image__qRhXT",
        "whole-card-link": "course-comparison_whole-card-link__CjSYx",
        "course-badges": "course-comparison_course-badges__qmtGq",
      };
    },
    54641: function (e) {
      e.exports = {
        "gradient-container": "gradient-scroll_gradient-container__85wvK",
        "gradient-left": "gradient-scroll_gradient-left__hDuMq",
        "gradient-right": "gradient-scroll_gradient-right__8MNqu",
        "demo-container": "gradient-scroll_demo-container__1aKYU",
        "demo-container-item": "gradient-scroll_demo-container-item__bvLYe",
      };
    },
    19961: function (e) {
      e.exports = {
        topics: "included-topics-unit_topics__0dCFJ",
        "topics-row": "included-topics-unit_topics-row__VIE9y",
        "topics-title": "included-topics-unit_topics-title__p83k8",
        "topics-title-skeleton":
          "included-topics-unit_topics-title-skeleton__MjPEz",
        "topics-title-skeleton-block":
          "included-topics-unit_topics-title-skeleton-block__PkY0J",
        "topics-row-skeleton-block":
          "included-topics-unit_topics-row-skeleton-block__M3dJU",
        "show-more-right": "included-topics-unit_show-more-right__quFX2",
      };
    },
    39991: function (e) {
      e.exports = {
        "representative-topic-name":
          "lecture-stack-recommendation-unit-header_representative-topic-name__ViLY4",
      };
    },
    74425: function (e) {
      e.exports = {
        wrapper: "lecture-stack-recommendation-unit_wrapper__my708",
        "children-container":
          "lecture-stack-recommendation-unit_children-container__zr9O3",
        "recos-child": "lecture-stack-recommendation-unit_recos-child__WiP3N",
        "topic-area": "lecture-stack-recommendation-unit_topic-area__Kt6s9",
      };
    },
    82987: function (e) {
      e.exports = { "button-style": "next-topics-unit_button-style__ivyl1" };
    },
    60553: function (e) {
      e.exports = {
        "title-wrapper": "occupation-unit_title-wrapper__aIP_9",
        "bottom-margin": "occupation-unit_bottom-margin__yEIF_",
        "secondary-text": "occupation-unit_secondary-text__8_zfe",
      };
    },
    1480: function (e) {
      e.exports = {
        "unit-title": "popular-instructors-unit_unit-title__euVZZ",
        "instructor-card-container":
          "popular-instructors-unit_instructor-card-container__RXoDE",
        "button-sizing": "popular-instructors-unit_button-sizing__RERAo",
        "instructor-grid-columns":
          "popular-instructors-unit_instructor-grid-columns__PekXH",
      };
    },
    18963: function (e) {
      e.exports = {
        carousel: "popular-topics-unit_carousel__5_gwt",
        "single-row": "popular-topics-unit_single-row__TgOSE",
        "topic-tag": "popular-topics-unit_topic-tag__25Akd",
        "mobile-tags-container":
          "popular-topics-unit_mobile-tags-container__BbSml",
        "mobile-tags-row": "popular-topics-unit_mobile-tags-row__F5LPD",
      };
    },
    30519: function (e) {
      e.exports = { "item-link": "related-categories-unit_item-link__5wQF4" };
    },
    90702: function (e) {
      e.exports = {
        "subscription-cta-container-right":
          "related-occupations-unit_subscription-cta-container-right__DaBk0",
        "subscription-cta-container-bottom":
          "related-occupations-unit_subscription-cta-container-bottom__3__C0",
        "subscription-text":
          "related-occupations-unit_subscription-text__yLlbz",
        "subscription-cta-banner":
          "related-occupations-unit_subscription-cta-banner__GhSHm",
        "subscription-cta": "related-occupations-unit_subscription-cta__cQuYx",
        "skeleton-cta-button":
          "related-occupations-unit_skeleton-cta-button__GhD3T",
        "skeleton-subscription-text":
          "related-occupations-unit_skeleton-subscription-text__NZIuv",
      };
    },
    14431: function (e) {
      e.exports = {
        "secondary-header": "sequence-unit_secondary-header__hcY90",
        wrapper: "sequence-unit_wrapper__Q3eyS",
        "unit-title": "sequence-unit_unit-title__2nsct",
        "explore-button": "sequence-unit_explore-button__zx_N1",
        "courses-count": "sequence-unit_courses-count__XpPEt",
        description: "sequence-unit_description__eahJ8",
        grid: "sequence-unit_grid__5j768",
        "course-card": "sequence-unit_course-card__apL_l",
        "order-line": "sequence-unit_order-line__7_WFv",
        order: "sequence-unit_order__JUbn7",
        "connector-bar": "sequence-unit_connector-bar__gdAHT",
      };
    },
    74637: function (e) {
      e.exports = {
        "course-published-time":
          "instructor-content_course-published-time__6Ul_W",
      };
    },
    83502: function (e) {
      e.exports = {
        title: "single-course-unit_title__TZQJE",
        container: "single-course-unit_container__9GCbV",
        "course-image": "single-course-unit_course-image__LSnzM",
        "main-content": "single-course-unit_main-content__cavpt",
        "image-wrapper": "single-course-unit_image-wrapper__P_JtY",
        "opacity-overlay-light":
          "single-course-unit_opacity-overlay-light__KeAwu",
        "info-row": "single-course-unit_info-row__1Dipk",
        "course-title": "single-course-unit_course-title__CxnY6",
        "course-headline": "single-course-unit_course-headline__jEJV9",
        "course-meta-info": "single-course-unit_course-meta-info__IAgfj",
        "star-rating-wrapper": "single-course-unit_star-rating-wrapper__wWUXZ",
        "reviews-text": "single-course-unit_reviews-text__Y11MM",
        "carousel-courses": "single-course-unit_carousel-courses__Rh5Dr",
        "course-wrapper": "single-course-unit_course-wrapper__em7SH",
        "course-wrapper__multi":
          "single-course-unit_course-wrapper__multi__ThDjG",
        "instructor-titles": "single-course-unit_instructor-titles__U9_re",
      };
    },
    31310: function (e) {
      e.exports = {
        wrapper: "value-props_wrapper__wv0qv",
        title: "value-props_title__VNgdV",
      };
    },
    92699: function (e) {
      e.exports = { container: "card-container_container__tis8U" };
    },
    65641: function (e) {
      e.exports = {
        "image-container": "image-banner_image-container__5QYjd",
        "banner-image": "image-banner_banner-image__onUAJ",
        "on-desktop": "image-banner_on-desktop__1TJ0B",
        "on-mobile": "image-banner_on-mobile__6y64y",
      };
    },
    7441: function (e) {
      e.exports = {
        "course-title": "window-shopping-card_course-title__IXrJb",
        "instructor-list": "window-shopping-card_instructor-list__DOANn",
        "num-students": "window-shopping-card_num-students__p5Lqj",
        "reviews-text": "window-shopping-card_reviews-text__ziyHE",
        row: "window-shopping-card_row__9sYxM",
        card: "window-shopping-card_card__G_26Y",
      };
    },
    19886: function (e) {
      e.exports = {
        container: "window-shopping-unit_container__Z18Tp",
        "card-container": "window-shopping-unit_card-container__IF8D_",
        "cta-wrapper": "window-shopping-unit_cta-wrapper___y_D9",
        "content-with-cta": "window-shopping-unit_content-with-cta__zUlgk",
        "num-courses-text": "window-shopping-unit_num-courses-text__KKsN8",
      };
    },
    23019: function (e) {
      e.exports = {
        "card-container": "instructor-card_card-container__pAW6g",
        "card-vertical": "instructor-card_card-vertical__ePHuw",
        details: "instructor-card_details__Vfsd6",
        "label-container": "instructor-card_label-container__lyxNS",
        "rating-title": "instructor-card_rating-title__wyNnx",
        "rating-wrapper": "instructor-card_rating-wrapper__L5sYc",
        title: "instructor-card_title__KEU_x",
      };
    },
    80799: function (e) {
      e.exports = {
        "lab-card-container": "lab-card_lab-card-container__7y3Wv",
        "lab-icon-container": "lab-card_lab-icon-container__xxCLy",
        "lab-info": "lab-card_lab-info__wakX8",
        title: "lab-card_title__rK_G3",
        "title-one-liner": "lab-card_title-one-liner__q2j_W",
        "lab-owner": "lab-card_lab-owner__OZPl7",
        "info-completion-time": "lab-card_info-completion-time__kAWk9",
        "info-number-of-questions": "lab-card_info-number-of-questions__gCwYe",
        "info-icon": "lab-card_info-icon__naYCP",
        "info-content": "lab-card_info-content__Z4SiJ",
        "completion-date": "lab-card_completion-date__zAEbg",
        "popover-button": "lab-card_popover-button__L0uwb",
      };
    },
    94288: function (e) {
      e.exports = {
        "popover-wrapper": "lab-details-quick-view-box_popover-wrapper__fl6Bf",
        "content-header": "lab-details-quick-view-box_content-header___Hjx6",
        details: "lab-details-quick-view-box_details___kO4_",
        cta: "lab-details-quick-view-box_cta__xX6W0",
        "practice-this-lab":
          "lab-details-quick-view-box_practice-this-lab__MREEF",
        "cta-container": "lab-details-quick-view-box_cta-container__hchTj",
        "cta-button": "lab-details-quick-view-box_cta-button__EPgNp",
        "popover-interaction-btn":
          "lab-details-quick-view-box_popover-interaction-btn___1ddw",
      };
    },
    57141: function (e) {
      e.exports = {
        "lab-unit-container": "labs-carousel_lab-unit-container__6EeDP",
        "subtitle-button-wrapper":
          "labs-carousel_subtitle-button-wrapper__o5WLh",
        "unit-subtitle": "labs-carousel_unit-subtitle__6UK49",
        "browse-button": "labs-carousel_browse-button__xL_6q",
        "is-standalone-unit": "labs-carousel_is-standalone-unit__2wr_6",
        "lab-carousel": "labs-carousel_lab-carousel__SuxR6",
      };
    },
    35088: function (e) {
      e.exports = {
        "lecture-slide-container":
          "lecture-details-slide_lecture-slide-container__JSaTo",
        "lecture-item": "lecture-details-slide_lecture-item__1GdRh",
        "current-lecture": "lecture-details-slide_current-lecture__dcMoW",
        "fade-in": "lecture-details-slide_fade-in__GEgOe",
        "fade-out": "lecture-details-slide_fade-out__uSYGc",
      };
    },
    61406: function (e) {
      e.exports = {
        container: "lecture-details_container__75uVV",
        "lecture-detail": "lecture-details_lecture-detail__0NL3c",
        "lecture-title-compact": "lecture-details_lecture-title-compact__HaIHc",
        "instructor-container": "lecture-details_instructor-container__o5bL_",
        "instructor-name": "lecture-details_instructor-name__7GFOe",
      };
    },
    89619: function (e) {
      e.exports = {
        "simple-occupation-card":
          "occupation-card_simple-occupation-card___OidL",
        "occupation-title-container":
          "occupation-card_occupation-title-container__3Vll6",
        "personal-plan-text": "occupation-card_personal-plan-text__SddoQ",
        "occupation-title": "occupation-card_occupation-title__jY35Z",
        "simple-courses-text": "occupation-card_simple-courses-text__r7280",
        "occupation-card": "occupation-card_occupation-card__MT2Vi",
        subtitle: "occupation-card_subtitle__JR445",
        "skeleton-container": "occupation-card_skeleton-container__uZ_ru",
        "skeleton-occupation-card":
          "occupation-card_skeleton-occupation-card__guFDK",
        "skeleton-title-container":
          "occupation-card_skeleton-title-container__5OWN6",
        "skeleton-card-heading": "occupation-card_skeleton-card-heading__jpier",
        "skeleton-occupation-title":
          "occupation-card_skeleton-occupation-title__0Fkgl",
        "skeleton-paragraph-line":
          "occupation-card_skeleton-paragraph-line__6P6Zf",
        "skeleton-stats-section":
          "occupation-card_skeleton-stats-section__b_N5Z",
        "skeleton-stat": "occupation-card_skeleton-stat__a4KEQ",
      };
    },
    22559: function (e) {
      e.exports = {
        header: "questions-and-answers_header__WBRTH",
        "question-and-answer-container":
          "questions-and-answers_question-and-answer-container__4Vxcw",
        answer: "questions-and-answers_answer__Ioqpq",
        link: "questions-and-answers_link__Z4Dfr",
        hidden: "questions-and-answers_hidden__KW7IB",
        "show-more": "questions-and-answers_show-more__iF14E",
      };
    },
    26424: function (e) {
      e.exports = { "beta-badge": "lab-beta-badge_beta-badge__Tt_1v" };
    },
    66148: function (e) {
      e.exports = {
        button: "lab-cta-practice_button__Vl0OO",
        "small-btn": "lab-cta-practice_small-btn__NuBbt",
      };
    },
    17070: function (e) {
      e.exports = {
        "lab-icon": "lab-icon_lab-icon__nx19N",
        completed: "lab-icon_completed__K2_hk",
      };
    },
    58173: function (e) {
      e.exports = { "beta-badge": "assessment-beta-badge_beta-badge__4pYjh" };
    },
    83241: function (e) {
      e.exports = {
        button: "assessment-cta_button__kxGuk",
        "small-btn": "assessment-cta_small-btn__Pobo7",
      };
    },
    25601: function (e) {
      e.exports = {
        "assessment-icon": "assessment-icon_assessment-icon__8PeHp",
        completed: "assessment-icon_completed__CaK_Y",
      };
    },
    48887: function (e) {
      e.exports = {
        "take-assessment-card-container":
          "take-assessment-card_take-assessment-card-container__5w9M9",
        "take-assessment-card-container-pp":
          "take-assessment-card_take-assessment-card-container-pp__TPMUr",
        "take-assessment-info":
          "take-assessment-card_take-assessment-info__2N4Qa",
        "take-assessment-card-info-title":
          "take-assessment-card_take-assessment-card-info-title__bDtKd",
        "take-assessment-card-info-container":
          "take-assessment-card_take-assessment-card-info-container__q3Lij",
        "take-assessment-card-info-line":
          "take-assessment-card_take-assessment-card-info-line__193yV",
        "info-number-of-questions":
          "take-assessment-card_info-number-of-questions__sLz5T",
        "info-icon": "take-assessment-card_info-icon__XxOv5",
        "info-content": "take-assessment-card_info-content__hQBdf",
        "info-container": "take-assessment-card_info-container__N0q6Q",
        "info-link": "take-assessment-card_info-link__GIXCC",
        "more-menu-button": "take-assessment-card_more-menu-button__TQbNr",
        "ud-assessment-badge-container":
          "take-assessment-card_ud-assessment-badge-container__ADQEi",
      };
    },
    23525: function (e) {
      e.exports = {
        "occupation-modal": "occupation-modal_occupation-modal__CeHc6",
      };
    },
    31169: function (e) {
      e.exports = {
        "avatars-group": "avatar-group_avatars-group__cnkDt",
        "avatar-wrapper": "avatar-group_avatar-wrapper__TBYYp",
        "avatar-element": "avatar-group_avatar-element__GxKk8",
      };
    },
    27910: function (e) {
      e.exports = {
        wrapper: "video-card_wrapper__7qYZc",
        "play-icon": "video-card_play-icon__MG4L7",
        title: "video-card_title__nWhxY",
        topic: "video-card_topic__AQi86",
        "bottom-info-container": "video-card_bottom-info-container__AcUnF",
      };
    },
  },
]);
//# sourceMappingURL=708-9cbfd99a11e54b80.js.map
