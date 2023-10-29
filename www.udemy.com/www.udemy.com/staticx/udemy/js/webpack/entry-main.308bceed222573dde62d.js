/*! For license information please see entry-main.308bceed222573dde62d.js.LICENSE.txt */
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["entry-main"],
  {
    "./node_modules/@udemy/braze/dist/esm/index.js": function (e, t, n) {
      "use strict";
      var r = n("./node_modules/@udemy/graphql/dist/esm/index.js");
      var s = n("./node_modules/@udemy/sentry/dist/esm/index.js");
      var o = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-config-data.js"
      );
      var i = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-request-data.js"
      );
      var a = n("./node_modules/@udemy/shared-utils/dist/esm/env/ud-me.js");
      var c = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/ud-user-agnostic-tracking-params.js"
      );
      var d = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
      );
      var u = n("./node_modules/@udemy/ud-api/dist/esm/index.js");
      let l;
      const p = new Promise((e) => {
        l = e;
      });
      async function m() {
        return new Promise((e) => {
          if (typeof window !== "undefined") {
            n.e(2)
              .then(
                n.t.bind(null, "./node_modules/@braze/web-sdk/appboy.min.js", 7)
              )
              .then((t) => {
                e(t);
              });
          }
        });
      }
      async function g() {
        return m().then(async (e) => {
          window.appboy = e;
          const t = Object(o["a"])();
          const n = Object(i["a"])();
          const r =
            t.env === "PROD"
              ? "5cefca91-d218-4b04-8bdd-c8876ec1908d"
              : "4aa844ae-1f20-4f99-aeb9-3307f28c861d";
          const p = e.initialize(r, {
            baseUrl: "sdk.iad-03.braze.com",
            safariWebsitePushId:
              t.env === "PROD" ? "web.com.udemy.prod" : "web.com.udemy",
            allowUserSuppliedJavascript: true,
            contentSecurityNonce: window.nonceValue,
            enableSdkAuthentication: true,
            devicePropertyAllowlist: [
              "browser",
              "browserVersion",
              "os",
              "resolution",
              "timeZone",
              "userAgent",
            ],
          });
          if (p === undefined || p === false) {
            u["d"].increment("braze.web_sdk.initialized", { outcome: "fail" });
            Object(s["a"])(new Error("Braze SDK failed to initialize"));
            return false;
          } else {
            u["d"].increment("braze.web_sdk.initialized", {
              outcome: "success",
            });
            l(e);
          }
          e.openSession();
          const m = Object(a["a"])();
          if (m !== null && m !== void 0 && m.is_authenticated) {
            const t = await v();
            e.changeUser(m.id, t);
            e.subscribeToSdkAuthenticationFailures(async (t) => {
              u["d"].increment("braze.web_sdk.authentication_failed", {
                code: t.errorCode,
              });
              if (t.userId === m.id.toString()) {
                const t = await v();
                if (t) {
                  e.setSdkAuthenticationSignature(t);
                } else {
                  Object(s["a"])(
                    new Error("Braze authentication error: no token provided")
                  );
                }
              }
            });
          } else {
            const r = e.getUser();
            r === null || r === void 0
              ? void 0
              : r.setCountry(t.marketplace_country.id);
            r === null || r === void 0 ? void 0 : r.setLanguage(n.language);
          }
          if (
            Object(c["a"])().page_key === "discovery_subcategory" &&
            e.isPushSupported() &&
            !e.isPushBlocked() &&
            e.isPushPermissionGranted()
          ) {
            f(e);
          }
          if (
            d["a"].global.location.href.match(/http(s)?:\/\/.*\/course\/.*/gm)
          ) {
            h(e);
          }
          return e;
        });
      }
      function f(e) {
        var t;
        const n = document.querySelector(".ud-component--category--category");
        const r = JSON.parse(
          (t =
            n === null || n === void 0
              ? void 0
              : n.getAttribute("data-component-props")) !== null && t !== void 0
            ? t
            : "{}"
        );
        if (r.pageObject) {
          const t = r.pageObject.id;
          e.logCustomEvent("Viewed subcategory page", { subcategory_id: t });
        }
      }
      async function h(e) {
        const t = document.body.getAttribute("data-clp-course-id");
        if (t) {
          let n = {};
          try {
            const e = await r["b"].fetcher({
              featureCodes: ["web_push_optin_display"],
            })();
            const t = e.featureVariantAssignmentsByCodeAndAttributes;
            t.forEach((e) => {
              if (e.featureCode === "web_push_optin_display") {
                n = e.configuration;
              }
            });
          } catch (e) {}
          e.logCustomEvent("Viewed CLP", {
            course_id: t,
            experiment: n.showModal,
          });
          e.subscribeToInAppMessage((t) => {
            let n = true;
            if (t instanceof e.InAppMessage) {
              const r = t.extras["msg-id"];
              if (r === "push-primer") {
                if (!e.isPushSupported() || e.isPushBlocked()) {
                  n = false;
                }
              }
            }
            if (n) {
              e.display.showInAppMessage(t);
            }
          });
        }
      }
      async function v() {
        try {
          const e = await u["c"].get("/braze/auth/");
          return e.data.jwt;
        } catch (e) {
          Object(s["a"])(e);
        }
      }
      async function y(e) {
        return new Promise((t) => {
          p.then((n) => {
            e(n);
            t(n);
          });
        });
      }
      n.d(t, "a", function () {
        return g;
      });
      n.d(t, "b", function () {
        return y;
      });
    },
    "./node_modules/@udemy/browse-course/dist/esm/browse-course-card/browse-course-card.module.css":
      function (e, t, n) {
        e.exports = {
          image: "browse-course-card-module--image--2J_eC",
          link: "browse-course-card-module--link--2grwg",
          "enrolled-play-overlay-mobile":
            "browse-course-card-module--enrolled-play-overlay-mobile--1ZryW",
          "course-card": "browse-course-card-module--course-card--XwAVD",
          "play-overlay-mobile":
            "browse-course-card-module--play-overlay-mobile--vN9ku",
          "opacity-overlay-light":
            "browse-course-card-module--opacity-overlay-light--1WFf9",
          "opacity-overlay-dark":
            "browse-course-card-module--opacity-overlay-dark--1NvAN",
        };
      },
    "./node_modules/@udemy/browse-course/dist/esm/course-badges/course-badges.module.css":
      function (e, t, n) {
        e.exports = {
          bestseller: "course-badges-module--bestseller--2k308",
          "highest-rated": "course-badges-module--highest-rated--3abOa",
          "hot-and-new": "course-badges-module--hot-and-new--29c-j",
          new: "course-badges-module--new--1RH3j",
          free: "course-badges-module--free--1PepP",
          "updated-recently": "course-badges-module--updated-recently--2EM4S",
          "coding-exercises": "course-badges-module--coding-exercises--3-NXv",
        };
      },
    "./node_modules/@udemy/browse-course/dist/esm/course-price-store/error-component.module.css":
      function (e, t, n) {
        e.exports = {
          "error-text": "error-component-module--error-text--2plou",
          "error-container": "error-component-module--error-container--MpypJ",
        };
      },
    "./node_modules/@udemy/browse-course/dist/esm/course-progress-card/compact-course-progress-card.module.css":
      function (e, t, n) {
        e.exports = {
          "course-image":
            "compact-course-progress-card-module--course-image--2xYaI",
          "course-info":
            "compact-course-progress-card-module--course-info--1lFCA",
          "course-title":
            "compact-course-progress-card-module--course-title--1J04e",
          "course-title-condensed":
            "compact-course-progress-card-module--course-title-condensed--hfPNv",
          "start-learning":
            "compact-course-progress-card-module--start-learning--2AY0c",
        };
      },
    "./node_modules/@udemy/browse-course/dist/esm/index.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      var r = n("./node_modules/prop-types/index.js");
      var s = n.n(r);
      var o = n("./node_modules/react/index.js");
      var i = n.n(o);
      var a = n("./node_modules/classnames/index.js");
      var c = n.n(a);
      var d = n("./node_modules/mobx-react/dist/mobx-react.module.js");
      var u = n(
        "./node_modules/@udemy/browse-event-tracking/dist/esm/index.js"
      );
      var l = n(
        "./node_modules/@udemy/event-tracking/dist/esm/lib/common-tracking.js"
      );
      var p = n(
        "./node_modules/@udemy/event-tracking/dist/esm/lib/track-impression.react-component.js"
      );
      var m = n(
        "./node_modules/@udemy/funnel-tracking/dist/esm/funnel-log.react-component.js"
      );
      var g = n(
        "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/image.js"
      );
      var f = n(
        "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-image.react-component.js"
      );
      var h = n(
        "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-title.react-component.js"
      );
      var v = n(
        "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-badges.react-component.js"
      );
      var y = n(
        "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/badges.js"
      );
      var b = n(
        "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-details.react-component.js"
      );
      var _ = n(
        "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/details.js"
      );
      var j = n(
        "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-instructors.react-component.js"
      );
      var w = n(
        "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/instructors.js"
      );
      var x = n(
        "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-ratings.react-component.js"
      );
      var k = n(
        "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/ratings.js"
      );
      var O = n(
        "./node_modules/@udemy/react-structure-components/dist/esm/play-overlay/play-overlay.react-component.js"
      );
      const E = "bestseller";
      const C = "free";
      const S = "top_rated";
      const T = "hot_and_new";
      const I = "new";
      const P = "updated_recently";
      const D = "coding_exercises";
      var A = n("./node_modules/@udemy/i18n/dist/esm/index.js");
      var N = n(
        "./node_modules/@udemy/react-messaging-components/dist/esm/badge/badge.react-component.js"
      );
      var R = n(
        "./node_modules/@udemy/browse-course/dist/esm/course-badges/course-badges.module.css"
      );
      var L = n.n(R);
      const z = (e) => {
        let { className: t } = e;
        const { gettext: n } = Object(A["j"])();
        return i.a.createElement(
          N["a"],
          { className: c()(L.a.bestseller, t) },
          n("Bestseller")
        );
      };
      const U = (e) => {
        let { className: t } = e;
        const { gettext: n } = Object(A["j"])();
        return i.a.createElement(
          N["a"],
          { className: c()(L.a["highest-rated"], t) },
          n("Highest rated")
        );
      };
      const F = (e) => {
        let { className: t } = e;
        const { gettext: n } = Object(A["j"])();
        return i.a.createElement(
          N["a"],
          { className: c()(L.a["hot-and-new"], t) },
          n("Hot & new")
        );
      };
      const M = (e) => {
        let { className: t } = e;
        const { gettext: n } = Object(A["j"])();
        return i.a.createElement(
          N["a"],
          { className: c()(L.a.new, t) },
          n("New")
        );
      };
      const $ = (e) => {
        let { className: t } = e;
        const { gettext: n } = Object(A["j"])();
        return i.a.createElement(
          N["a"],
          { className: c()(L.a.free, t) },
          n("Free tutorial")
        );
      };
      const B = (e) => {
        let { className: t } = e;
        const { gettext: n } = Object(A["j"])();
        return i.a.createElement(
          N["a"],
          { className: c()(L.a["updated-recently"], t) },
          n("Updated Recently")
        );
      };
      const q = (e) => {
        let { className: t } = e;
        const { gettext: n } = Object(A["j"])();
        return i.a.createElement(
          N["a"],
          { className: c()(L.a["coding-exercises"], t) },
          n("Coding Exercises")
        );
      };
      const W = (e) => {
        const t = G(e);
        return t ? K(t) : null;
      };
      const G = (e) =>
        H(e) && e.badges ? e.badges[0].badge_family : undefined;
      const H = (e) => !!(e.badges && e.badges.length > 0 && e.badges[0]);
      const V = (e) => (e.length > 0 ? K(e[0]) : null);
      function K(e) {
        switch (e) {
          case E:
            return z;
          case C:
            return $;
          case T:
            return F;
          case S:
            return U;
          case I:
            return M;
          case P:
            return B;
          case D:
            return q;
          default:
            return undefined;
        }
      }
      var Y = n(
        "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/price.js"
      );
      var J = n("./node_modules/@udemy/store-provider/dist/esm/use-stores.js");
      var X = n(
        "./node_modules/@babel/runtime/helpers/initializerDefineProperty.js"
      );
      var Z = n.n(X);
      var Q = n(
        "./node_modules/@babel/runtime/helpers/applyDecoratedDescriptor.js"
      );
      var ee = n.n(Q);
      var te = n(
        "./node_modules/@babel/runtime/helpers/initializerWarningHelper.js"
      );
      var ne = n("./node_modules/mobx/lib/mobx.module.js");
      var re = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
      );
      var se = n("./node_modules/@udemy/ud-api/dist/esm/index.js");
      var oe, ie, ae, ce, de;
      const ue = 10;
      const le = "pricing/";
      const pe =
        "price,discount_price,list_price,price_detail,price_serve_tracking_id";
      let me = (function (e) {
        e["PRICE_STATUS_LOADING"] = "loading";
        e["PRICE_STATUS_LOADED"] = "loaded";
        e["PRICE_STATUS_ERROR"] = "error";
        return e;
      })({});
      let ge =
        ((oe =
          ((de = class e {
            constructor() {
              Z()(this, "priceMap", ie, this);
              Z()(this, "modelMap", ae, this);
              this.isLoading = false;
              this._courseIdsToFetch = [];
              this._timeouts = [];
              this.registerCourse = (e, t) => {
                this.modelMap.set(+e.id, e);
                const n = this.priceMap.get(e.id);
                if (n && n.status !== me.PRICE_STATUS_ERROR) {
                  return;
                }
                this.setCoursePrice(e.id, t);
                if (this._courseIdsToFetch.length === 0) {
                  this._courseIdsToFetch.push(e.id);
                  this._loadCourses();
                } else {
                  this._courseIdsToFetch.push(e.id);
                }
              };
              this.reloadCourses = () => {
                this.priceMap.forEach((e, t) => {
                  e.status = me.PRICE_STATUS_ERROR;
                  const n = this.modelMap.get(t);
                  if (n) {
                    this.registerCourse(n);
                  }
                });
              };
              this._loadCourses = () => {
                if (re["a"].isClient) {
                  this.isLoading = true;
                  const e = setTimeout(this.requestInBatches, 250);
                  this._timeouts.push(e);
                }
              };
              this.requestInBatches = () => {
                const e = this._courseIdsToFetch.sort();
                while (e.length !== 0) {
                  const t = e.splice(0, ue);
                  se["c"]
                    .get(le, {
                      params: {
                        course_ids: t.join(","),
                        "fields[pricing_result]": pe,
                      },
                    })
                    .then(this.updatePriceMap)
                    .catch(this.updateErrorState(t));
                }
                this.isLoading = false;
              };
              Z()(this, "updatePriceMap", ce, this);
              this.updateErrorState = (e) =>
                Object(ne["e"])(() => {
                  e.forEach((e) => {
                    const t = this.priceMap.get(e);
                    const n = {
                      ...(t !== null && t !== void 0 ? t : {}),
                      status: me.PRICE_STATUS_ERROR,
                    };
                    this.priceMap.set(e, n);
                  });
                });
            }
            setCoursePrice(e, t) {
              this.priceMap.set(e, {
                ...(t !== null && t !== void 0 ? t : {}),
                status: me.PRICE_STATUS_LOADING,
              });
            }
            reset() {
              this.priceMap.clear();
              this.isLoading = false;
              this._courseIdsToFetch = [];
              this._timeouts.forEach((e) => {
                clearTimeout(e);
              });
            }
          }),
          (de.STORE_ID = "CoursePriceStore"),
          de)),
        (ie = ee()(oe.prototype, "priceMap", [ne["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return ne["t"].map({}, { name: "priceMap", deep: false });
          },
        })),
        (ae = ee()(oe.prototype, "modelMap", [ne["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return ne["t"].map({}, { name: "modelMap", deep: false });
          },
        })),
        (ce = ee()(oe.prototype, "updatePriceMap", [ne["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return (e) => {
              Object.entries(e.data.courses).forEach((e) => {
                var t;
                let [n, r] = e;
                const s = {
                  discount: { price: r.price },
                  discount_price: r.discount_price,
                  price:
                    (t = r.list_price) === null || t === void 0
                      ? void 0
                      : t.price_string,
                  price_detail: r.price_detail,
                  price_serve_tracking_id: r.price_serve_tracking_id,
                  status: me.PRICE_STATUS_LOADED,
                };
                const o = parseInt(n, 10);
                this.priceMap.set(o, s);
                const i = this.modelMap.get(Number(n));
                if (i && i._course) {
                  Object.assign(i._course, s);
                }
              });
            };
          },
        })),
        ee()(
          oe.prototype,
          "setCoursePrice",
          [ne["e"]],
          Object.getOwnPropertyDescriptor(oe.prototype, "setCoursePrice"),
          oe.prototype
        ),
        ee()(
          oe.prototype,
          "reset",
          [ne["e"]],
          Object.getOwnPropertyDescriptor(oe.prototype, "reset"),
          oe.prototype
        ),
        oe);
      const fe = Object(d["f"])((e) => {
        let { course: t } = e;
        const {
          gettext: n,
          interpolate: r,
          ninterpolate: s,
        } = Object(A["j"])();
        const { formatNumber: o } = Object(A["h"])();
        const [a] = Object(J["a"])([ge]);
        let c = [];
        if (t.discount || t.price_detail) {
          c = l(t);
        } else {
          const e = a.priceMap.get(t.id);
          if (e && e.status === me.PRICE_STATUS_LOADED) {
            c = l(e);
          }
        }
        function d(e) {
          return s("%(count)s review", "%(count)s reviews", e, { count: e });
        }
        function u(e, t) {
          const s = n("Rating: %(rating)s out of %(total)s");
          return r(
            s,
            {
              rating: o(Number(e), {
                maximumFractionDigits: 1,
                minimumFractionDigits: 1,
              }),
              total: t,
            },
            true
          );
        }
        function l(e) {
          const t = Object(Y["a"])(e);
          const r = [];
          if (t.discountPrice && t.discountPriceString) {
            if (t.discountPrice === 0) {
              r.push(
                i.a.createElement(
                  "span",
                  { key: "current", "data-testid": "seo-current-price" },
                  n("Free")
                )
              );
            } else {
              r.push(
                i.a.createElement(
                  "span",
                  { key: "current", "data-testid": "seo-current-price" },
                  `${n("Current price")}: ${t.discountPriceString}`
                )
              );
            }
            if (
              t.listPrice &&
              t.listPriceString &&
              t.listPrice > t.discountPrice
            ) {
              r.push(
                i.a.createElement(
                  "span",
                  { key: "original", "data-testid": "seo-original-price" },
                  `${n("Original price")}: ${t.listPriceString}`
                )
              );
            }
          }
          return r;
        }
        return i.a.createElement(
          "div",
          { className: "ud-sr-only", "aria-hidden": true },
          i.a.createElement(
            "span",
            { "data-testid": "seo-headline" },
            t.headline
          ),
          i.a.createElement(
            "span",
            { "data-testid": "seo-rating" },
            u(t.rating, 5)
          ),
          i.a.createElement(
            "span",
            { "data-testid": "seo-num-reviews" },
            d(t.num_reviews)
          ),
          !!t.content_info &&
            i.a.createElement(
              "span",
              { "data-testid": "seo-content-info" },
              t.content_info
            ),
          !!t.num_published_lectures &&
            i.a.createElement(
              "span",
              { "data-testid": "seo-num-lectures" },
              Object(_["b"])(t.num_published_lectures, { ninterpolate: s })
            ),
          !!t.instructional_level_simple &&
            i.a.createElement(
              "span",
              { "data-testid": "seo-instructional-level" },
              t.instructional_level_simple
            ),
          c
        );
      });
      var he = n("./node_modules/@udemy/shopping/dist/esm/index.js");
      const ve = (e) => {
        let { course: t, priceTextProps: n } = e;
        return {
          ...Object(Y["b"])({ course: t, priceTextProps: n }),
          trackingEventContext: {
            buyableId: t.id,
            priceType: he["a"].individual_buyable,
            buyableType: "course",
            buyableTrackingId: t.frontendTrackingId || t.tracking_id,
          },
          ...n,
        };
      };
      var ye = n(
        "./node_modules/@udemy/browse-course/dist/esm/personal-plan-badge/personal-plan-badge.module.css"
      );
      var be = n.n(ye);
      function _e() {
        const { gettext: e } = Object(A["j"])();
        return i.a.createElement(
          N["a"],
          { "data-purpose": "personal-plan-badge", className: be.a.badge },
          e("Personal Plan")
        );
      }
      var je = n(
        "./node_modules/@udemy/react-merchandising-components/dist/esm/price-text/static/static-price-text.react-component.js"
      );
      var we = n("./node_modules/@udemy/ud-data/dist/esm/index.js");
      const xe = (e) => {
        var t, n;
        const r =
          (t = (n = e.displayName) !== null && n !== void 0 ? n : e.name) !==
            null && t !== void 0
            ? t
            : "Component";
        const s = Object.assign(
          Object(d["e"])((e) => {
            let { funnelLogContextStore: t } = e;
            return { funnelLogContextStore: t };
          })((t) => {
            let { funnelLogContextStore: n, ...r } = t;
            const { Config: s, me: a } = Object(we["h"])();
            const [c] = Object(o["useState"])(
              Object(ne["t"])({ isLoading: false })
            );
            c.isLoading = a.isLoading;
            const d = async () => {
              var e;
              (e = r.onView) === null || e === void 0 ? void 0 : e.call(r);
              await Object(ne["D"])(() => !c.isLoading);
              Object(he["i"])({
                ...r,
                funnelLogContextStore: n,
                currency: s.price_country.currency,
              });
            };
            return i.a.createElement(e, Object.assign({}, r, { onView: d }));
          }),
          { displayName: `WithPriceTextTracking(${r})` }
        );
        return s;
      };
      const ke = xe(je["a"]);
      var Oe = n(
        "./node_modules/@udemy/browse-course/dist/esm/browse-course-card/browse-course-card.module.css"
      );
      var Ee = n.n(Oe);
      var Ce = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/tracker.js"
      );
      const Se = (e, t, n, r) => {
        var s, o, i, a, c, d;
        const l =
          (s =
            (o = e.badges) === null || o === void 0
              ? void 0
              : o.map((e) => e.badge_family)) !== null && s !== void 0
            ? s
            : null;
        const p =
          (i =
            (a = e.frontendTrackingId) !== null && a !== void 0
              ? a
              : e.tracking_id) !== null && i !== void 0
            ? i
            : "";
        Ce["a"].publishEvent(
          new u["c"]({
            id: e.id,
            type: "course",
            trackingId: p,
            serveTrackingId:
              (c =
                (d = e.tracking_id) === null || d === void 0
                  ? void 0
                  : d.toString()) !== null && c !== void 0
                ? c
                : "",
            backendSource: n,
            position: t,
            badgeFamilies: l,
            uiRegion: r,
          })
        );
      };
      var Te = n(
        "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/with-course-card-ub-guard.js"
      );
      var Ie = n(
        "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card.react-component.js"
      );
      const Pe = Object(Te["a"])(Ie["a"]);
      const De = Object(o["createContext"])({ cardComponent: Pe });
      const Ae = (e, t) => i.a.createElement(e, t);
      class Ne extends i.a.Component {
        constructor() {
          super(...arguments);
          this.trackImpression = () => {
            const {
              trackImpressionFunc: e,
              relatedSourceId: t,
              relatedSourceType: n,
              ...r
            } = this.props.trackingContext;
            e({ item: this.props.course }, r, {
              relatedSourceId: t,
              relatedSourceType: n,
            });
          };
          this.trackClick = (e) => {
            const { trackingClickCallbackFunc: t, course: n } = this.props;
            const { index: r, uiRegion: s } = this.props.trackingContext;
            Object(l["a"])({
              courseId: n.id,
              courseTrackingId: n.frontendTrackingId || n.tracking_id,
              componentName: "courseCard",
            });
            Se(n, r, u["a"].DISCOVERY, s);
            if (t) {
              t(e);
            }
          };
        }
        render() {
          const {
            children: e,
            course: t,
            showBadges: n,
            titleClass: r,
            numReviewsText: s,
            priceProps: o,
            url: a,
            renderCourseImage: d,
            renderInstructorContent: u,
            renderPriceText: l,
            renderCourseTitle: m,
            renderRatings: E,
            renderDetails: C,
            renderCourseBadges: S,
            trackingContext: T,
            trackingClickCallbackFunc: I,
            isUserEnrolled: P,
            showPersonalPlanBadge: A,
            showCodingExercisesBadge: N,
            ...R
          } = this.props;
          const L = () => {
            const e = Object(g["a"])({ course: t });
            const n = { ...e, className: c()(e.className, Ee.a.image) };
            if (P) {
              return i.a.createElement(
                i.a.Fragment,
                null,
                d === null || d === void 0 ? void 0 : d(f["a"], n),
                i.a.createElement("div", {
                  className: Ee.a["opacity-overlay-dark"],
                }),
                i.a.createElement(O["a"], {
                  className: Ee.a["enrolled-play-overlay-mobile"],
                })
              );
            }
            if (t.is_in_personal_plan_collection && A) {
              return i.a.createElement(
                i.a.Fragment,
                null,
                d === null || d === void 0 ? void 0 : d(f["a"], n),
                i.a.createElement(_e, null)
              );
            }
            return d === null || d === void 0 ? void 0 : d(f["a"], n);
          };
          const z = () => {
            const e = t.is_in_user_subscription ? t.learn_url : t.url;
            const n = i.a.createElement(
              i.a.Fragment,
              null,
              t.title,
              i.a.createElement(fe, { course: t })
            );
            return m === null || m === void 0
              ? void 0
              : m(h["a"], {
                  className: r,
                  children: e
                    ? i.a.createElement("a", { href: e }, n)
                    : i.a.createElement("span", null, n),
                });
          };
          const U = () => {
            if (N && t.is_coding_exercises_badge_eligible) {
              const e = K(D);
              return i.a.createElement(
                v["a"],
                null,
                e && i.a.createElement(e, null)
              );
            }
            return S === null || S === void 0
              ? void 0
              : S(v["a"], Object(y["a"])({ course: t, badges: V }));
          };
          const F = !(t.is_in_user_subscription || P);
          const M = this.context.cardComponent;
          const $ = i.a.createElement(
            M,
            Object.assign({}, R, {
              badges: F && n && U(),
              details:
                C === null || C === void 0
                  ? void 0
                  : C(b["a"], Object(_["a"])({ course: t })),
              headline: t.headline,
              image: L(),
              instructors:
                u === null || u === void 0
                  ? void 0
                  : u(j["a"], Object(w["a"])({ course: t })),
              onClick: this.trackClick,
              onContextMenu: this.trackClick,
              ratings:
                E === null || E === void 0
                  ? void 0
                  : E(x["a"], Object(k["a"])({ course: t, numReviewsText: s })),
              price:
                F &&
                (l === null || l === void 0
                  ? void 0
                  : l(ke, ve({ course: t, priceTextProps: o }))),
              title: z(),
            }),
            e
          );
          if (!(T !== null && T !== void 0 && T.trackImpressionFunc)) {
            return $;
          }
          return i.a.createElement(
            p["a"],
            { trackFunc: this.trackImpression },
            $
          );
        }
      }
      Ne.propTypes = {
        course: s.a.object.isRequired,
        size: s.a.oneOf(["small", "medium", "large"]),
        width: s.a.oneOf(["fixed", "flexible"]),
        className: s.a.string,
        titleClass: s.a.string,
        numReviewsText: s.a.string,
        priceProps: s.a.object,
        showBadges: s.a.bool,
        showDetails: s.a.bool,
        url: s.a.string,
        renderCourseImage: s.a.func,
        renderInstructorContent: s.a.func,
        renderPriceText: s.a.func,
        renderCourseTitle: s.a.func,
        renderRatings: s.a.func,
        renderDetails: s.a.func,
        renderCourseBadges: s.a.func,
        onClick: s.a.func,
        isUserEnrolled: s.a.bool,
        trackingContext: s.a.shape({
          backendSource: s.a.string,
          index: s.a.number,
          trackImpressionFunc: s.a.func,
          relatedSourceId: s.a.string,
          relatedSourceType: s.a.string,
          uiRegion: s.a.string,
        }).isRequired,
        trackingClickCallbackFunc: s.a.func,
        showPersonalPlanBadge: s.a.bool,
        showCodingExercisesBadge: s.a.bool,
      };
      Ne.defaultProps = {
        size: "medium",
        width: "flexible",
        className: undefined,
        titleClass: undefined,
        numReviewsText: undefined,
        priceProps: undefined,
        showBadges: true,
        showDetails: true,
        renderCourseImage: Ae,
        renderInstructorContent: Ae,
        renderPriceText: Ae,
        renderCourseTitle: Ae,
        renderRatings: Ae,
        renderDetails: Ae,
        renderCourseBadges: Ae,
        url: undefined,
        onClick: undefined,
        isUserEnrolled: undefined,
        trackingClickCallbackFunc: undefined,
        showPersonalPlanBadge: false,
        showCodingExercisesBadge: false,
      };
      Ne.contextType = De;
      const Re = Object.assign(
        Object(m["b"])("course")(
          Object(d["e"])((e) => {
            let {
              showPersonalPlanBadge: t,
              trackingContext: n = {},
              showCodingExercisesBadge: r,
            } = e;
            return {
              showPersonalPlanBadge: t,
              trackingContext: n,
              showCodingExercisesBadge: r,
            };
          })(Ne)
        ),
        { defaultCardComponent: Pe, displayName: "BrowseCourseCard" }
      );
      var Le = n("./node_modules/@udemy/icons/dist/error.ud-icon");
      var ze = n.n(Le);
      var Ue = n(
        "./node_modules/@udemy/react-reveal-components/dist/esm/loader/loader.react-component.js"
      );
      var Fe = n(
        "./node_modules/@udemy/browse-course/dist/esm/course-price-store/error-component.module.css"
      );
      var Me = n.n(Fe);
      var $e = n(
        "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js"
      );
      var Be = n.n($e);
      var qe = n(
        "./node_modules/@udemy/shared-utils/dist/esm/react/get-display-name.js"
      );
      var We = n(
        "./node_modules/@udemy/store-provider/dist/esm/with-stores.js"
      );
      function Ge(e, t) {
        return function n(r) {
          class s extends i.a.Component {
            constructor(e) {
              super(e);
              this.coursePriceStore = void 0;
              this.coursePriceStore = e.stores[0];
              e.courses.forEach((e) => this.registerCourse(e));
            }
            registerCourse(e) {
              if (e.price) {
                this.coursePriceStore.registerCourse(e, {
                  price: e.price,
                  price_detail: e.price_detail,
                  discount: e.discount,
                  discount_price: e.discount_price,
                });
              } else {
                this.coursePriceStore.registerCourse(e);
              }
            }
            getPriceAmountsFromCoursePrice(e) {
              var t;
              const n =
                e !== null && e !== void 0 && e.price_detail
                  ? e.price_detail.amount
                  : 0;
              const r =
                e !== null &&
                e !== void 0 &&
                (t = e.discount) !== null &&
                t !== void 0 &&
                t.price
                  ? e.discount.price.amount
                  : 0;
              return { courseListPrice: n, courseDiscountPrice: r };
            }
            getPriceStringsFromCoursePrice(e) {
              var t;
              const n =
                e !== null && e !== void 0 && e.price_detail
                  ? e.price_detail.price_string
                  : undefined;
              const r =
                e !== null &&
                e !== void 0 &&
                (t = e.discount) !== null &&
                t !== void 0 &&
                t.price
                  ? e.discount.price.price_string
                  : undefined;
              return { courseListPriceString: n, courseDiscountPriceString: r };
            }
            render() {
              const { courses: n, loaderProps: s, ...o } = this.props;
              const a = n.some((e) => {
                var t;
                return (
                  ((t = this.coursePriceStore.priceMap.get(e.id)) === null ||
                  t === void 0
                    ? void 0
                    : t.status) === me.PRICE_STATUS_ERROR
                );
              });
              if (a) {
                return i.a.createElement(t, {
                  className: this.props.className,
                });
              }
              const c = n.some((e) => {
                var t;
                return (
                  ((t = this.coursePriceStore.priceMap.get(e.id)) === null ||
                  t === void 0
                    ? void 0
                    : t.status) === me.PRICE_STATUS_LOADING
                );
              });
              if (c) {
                return i.a.createElement(
                  e,
                  Object.assign({}, s, { className: this.props.className })
                );
              }
              let d = 0;
              let u = 0;
              n.forEach((e) => {
                const t = this.coursePriceStore.priceMap.get(e.id);
                const { courseListPrice: n, courseDiscountPrice: r } =
                  this.getPriceAmountsFromCoursePrice(t);
                d += n !== null && n !== void 0 ? n : 0;
                if (r) {
                  u += r;
                } else {
                  u += n !== null && n !== void 0 ? n : 0;
                }
              });
              const l = { listPrice: d, discountPrice: u };
              if (n.length === 1) {
                const e = this.coursePriceStore.priceMap.get(n[0].id);
                const {
                  courseListPriceString: t,
                  courseDiscountPriceString: r,
                } = this.getPriceStringsFromCoursePrice(e);
                l.listPriceString = t;
                l.discountPriceString = r || t;
                const s = e;
                l.trackingEventContext =
                  s !== null && s !== void 0 && s.price_serve_tracking_id
                    ? {
                        priceServeTrackingId:
                          s === null || s === void 0
                            ? void 0
                            : s.price_serve_tracking_id,
                      }
                    : undefined;
              }
              return i.a.createElement(r, Object.assign({ courses: n }, l, o));
            }
          }
          s.defaultProps = { courses: [], className: "", loaderProps: {} };
          s.displayName = `WithCourse${Object(qe["a"])(r)}`;
          const o = Object(We["a"])([ge], Object(d["f"])(s));
          return Be()(o, r);
        };
      }
      const He = (e) => {
        let { className: t } = e;
        const { gettext: n } = Object(A["j"])();
        return i.a.createElement(
          "div",
          { className: c()([Me.a["error-container"], t]) },
          i.a.createElement(ze.a, { label: false, color: "negative" }),
          i.a.createElement(
            "span",
            { className: c()([Me.a["error-text"], "ud-heading-xs"]) },
            n("Error loading price")
          )
        );
      };
      const Ve = (e) => {
        let { className: t } = e;
        return i.a.createElement(
          "div",
          { className: c()([t]) },
          i.a.createElement(Ue["a"], null)
        );
      };
      const Ke = Ge(Ve, He);
      const Ye = Ke(ke);
      class Je extends o["Component"] {
        constructor() {
          super(...arguments);
          this.renderWithAsyncCourseStaticPrice = (e, t) => {
            const {
              listPrice: n,
              discountPrice: r,
              listPriceString: s,
              discountPriceString: o,
              ...a
            } = t;
            return i.a.createElement(
              Ye,
              Object.assign({ courses: [this.props.course] }, a)
            );
          };
        }
        render() {
          return i.a.createElement(
            Re,
            Object.assign(
              { renderPriceText: this.renderWithAsyncCourseStaticPrice },
              this.props
            )
          );
        }
      }
      Je.propTypes = { course: s.a.object.isRequired };
      var Xe = n(
        "./node_modules/@udemy/react-core-components/dist/esm/image/image.react-component.js"
      );
      var Ze = n(
        "./node_modules/@udemy/react-messaging-components/dist/esm/meter/meter.react-component.js"
      );
      var Qe = n(
        "./node_modules/@udemy/react-structure-components/dist/esm/item-card/item-card.react-component.js"
      );
      var et = n(
        "./node_modules/@udemy/browse-course/dist/esm/course-progress-card/compact-course-progress-card.module.css"
      );
      var tt = n.n(et);
      const nt = (e) => {
        let { className: t, course: n } = e;
        const { gettext: r } = Object(A["j"])();
        return i.a.createElement(
          Qe["a"],
          { className: t },
          i.a.createElement(
            Qe["a"].ImageWrapper,
            null,
            i.a.createElement(Xe["a"], {
              src: n.image_240x135,
              className: tt.a["course-image"],
              alt: "",
              width: 240,
              height: 135,
            })
          ),
          i.a.createElement(
            "div",
            { className: tt.a["course-info"] },
            i.a.createElement(
              Qe["a"].Title,
              {
                className: c()("ud-heading-sm", tt.a["course-title"], {
                  [tt.a["course-title-condensed"]]: n.completion_ratio === 0,
                }),
                "data-purpose": "course-title",
                href: `/course-dashboard-redirect/?course_id=${n.id}`,
              },
              n.title
            ),
            !!n.completion_ratio &&
              n.completion_ratio > 0 &&
              i.a.createElement(Ze["a"], {
                value: n.completion_ratio,
                min: 0,
                max: 100,
                label: r("%(percent)s% complete"),
              }),
            n.completion_ratio === 0 &&
              i.a.createElement(
                "span",
                { className: c()("ud-heading-sm", tt.a["start-learning"]) },
                r("Start learning")
              )
          )
        );
      };
      var rt = n(
        "./node_modules/@udemy/react-reveal-components/dist/esm/course-card-skeleton/course-card-skeleton-group.react-component.js"
      );
      const st = {
        compact: { cardWidth: "25.6rem", imageSize: "6.4rem", lineCount: 1 },
        small: { cardWidth: "25.6rem", imageSize: "9rem", lineCount: 3 },
        large: { cardWidth: "40rem", imageSize: "12rem", lineCount: 4 },
      };
      const ot = (e) => {
        let { size: t = "small", ...n } = e;
        const { cardWidth: r, imageSize: s, lineCount: o } = st[t];
        return i.a.createElement(
          rt["a"],
          Object.assign(
            {
              size: "small",
              style: { width: r, maxWidth: r, minWidth: r },
              imageStyle: { width: s, height: s },
              lineCount: o,
            },
            n
          )
        );
      };
      function it() {
        let e =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {};
        return {
          id: 950390,
          image_240x135: "/course/240x135/950390_270f_3.jpg",
          title: "Machine Learning",
          remaining_time: 600,
          completion_ratio: 0,
          url: "/course/machinelearning/",
          ...e,
        };
      }
      var at = n(
        "./node_modules/@udemy/react-merchandising-components/dist/esm/price-text/dynamic/dynamic-price-text.react-component.js"
      );
      const ct = xe(at["a"]);
      const dt = Ke(ct);
      n.d(t, "c", function () {
        return Je;
      });
      n.d(t, "d", function () {
        return Re;
      });
      n.d(t, "e", function () {
        return De;
      });
      n.d(t, "g", function () {
        return C;
      });
      n.d(t, "h", function () {
        return T;
      });
      n.d(t, "i", function () {
        return I;
      });
      n.d(t, "j", function () {
        return P;
      });
      n.d(t, "f", function () {
        return D;
      });
      n.d(t, "o", function () {
        return M;
      });
      n.d(t, "r", function () {
        return K;
      });
      n.d(t, "q", function () {
        return V;
      });
      n.d(t, "l", function () {
        return fe;
      });
      n.d(t, "m", function () {
        return ge;
      });
      n.d(t, "s", function () {
        return Ke;
      });
      n.d(t, "k", function () {
        return nt;
      });
      n.d(t, "n", function () {
        return ot;
      });
      n.d(t, "p", function () {
        return _e;
      });
      n.d(t, "a", function () {
        return dt;
      });
      n.d(t, "b", function () {
        return Ye;
      });
    },
    "./node_modules/@udemy/browse-course/dist/esm/personal-plan-badge/personal-plan-badge.module.css":
      function (e, t, n) {
        e.exports = { badge: "personal-plan-badge-module--badge--2m9DD" };
      },
    "./node_modules/@udemy/browse-event-tracking/dist/esm/index.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      var r = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/event-common.js"
      );
      var s = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-request-data.js"
      );
      let o = (function (e) {
        e["DISCOVERY"] = "discovery";
        e["TAUGHT_COURSES"] = "taught_courses";
        e["USER_PROFILE_COURSES"] = "user_profile_courses";
        e["USER_WISHLISTED_COURSES"] = "user_wishlisted_courses";
        e["USER_COLLECTIONS"] = "user_collections";
        e["RELATED_LECTURES"] = "related_lectures";
        e["SHOPPING_CARTS"] = "shopping_carts";
        e["DISCOVERY_ALL_COURSES"] = "discovery_all_courses";
        e["SEARCH_RECOMMENDATIONS"] = "search_recommendations";
        return e;
      })({});
      class i extends r["a"] {
        constructor(e) {
          var t;
          let {
            id: n,
            type: r,
            trackingId: s,
            serveTrackingId: o,
            backendSource: i,
            position: a,
            badgeFamilies: c,
            relatedSourceId: d,
            relatedSourceType: u,
            uiRegion: l = null,
          } = e;
          super("DiscoveryItemImpressionEvent");
          this.id = void 0;
          this.type = void 0;
          this.trackingId = void 0;
          this.serveTrackingId = void 0;
          this.backendSource = void 0;
          this.position = void 0;
          this.badges = void 0;
          this.relatedSourceId = void 0;
          this.relatedSourceType = void 0;
          this.uiRegion = void 0;
          this.id = n;
          this.type = r;
          this.trackingId = s;
          this.serveTrackingId = o;
          this.backendSource = i;
          this.position = a;
          this.badges =
            (t =
              c === null || c === void 0
                ? void 0
                : c.map((e) => ({ family: e }))) !== null && t !== void 0
              ? t
              : null;
          this.relatedSourceId = d;
          this.relatedSourceType = u;
          this.uiRegion = l;
        }
      }
      i.backendSourceOptions = {
        DISCOVERY: o.DISCOVERY,
        TAUGHT_COURSES: o.TAUGHT_COURSES,
        USER_PROFILE_COURSES: o.USER_PROFILE_COURSES,
        USER_WISHLISTED_COURSES: o.USER_WISHLISTED_COURSES,
        USER_COLLECTIONS: o.USER_COLLECTIONS,
        RELATED_LECTURES: o.RELATED_LECTURES,
        SHOPPING_CARTS: o.SHOPPING_CARTS,
        DISCOVERY_ALL_COURSES: o.DISCOVERY_ALL_COURSES,
        SEARCH_RECOMMENDATIONS: o.SEARCH_RECOMMENDATIONS,
      };
      class a extends r["a"] {
        constructor(e) {
          var t;
          let {
            id: n,
            type: r,
            trackingId: s,
            serveTrackingId: o,
            backendSource: i,
            position: a = 0,
            badgeFamilies: c,
            uiRegion: d = null,
          } = e;
          super("DiscoveryItemClickEvent");
          this.id = void 0;
          this.type = void 0;
          this.trackingId = void 0;
          this.serveTrackingId = void 0;
          this.backendSource = void 0;
          this.position = void 0;
          this.badges = void 0;
          this.uiRegion = void 0;
          this.id = n;
          this.type = r;
          this.trackingId = s;
          this.serveTrackingId = o;
          this.backendSource = i;
          this.position = a;
          this.badges =
            (t =
              c === null || c === void 0
                ? void 0
                : c.map((e) => ({ family: e }))) !== null && t !== void 0
              ? t
              : null;
          this.uiRegion = d;
        }
      }
      class c extends r["a"] {
        constructor(e) {
          let { trackingId: t, unitTitle: n, renderType: r } = e;
          super("DiscoveryUnitViewEvent");
          this.trackingId = void 0;
          this.title = void 0;
          this.renderType = void 0;
          this.trackingId = t;
          this.title = n;
          this.renderType = r;
        }
      }
      class d extends r["a"] {
        constructor(e) {
          let {
            locale: t = Object(s["a"])().locale,
            placement: n,
            url: r = null,
          } = e;
          super("UFBNoticeImpressionEvent");
          this.locale = void 0;
          this.placement = void 0;
          this.url = void 0;
          this.locale = t;
          this.placement = n;
          this.url = r;
        }
        get eventLocale() {
          return this.locale;
        }
        get eventPlacement() {
          return this.placement;
        }
      }
      let u = (function (e) {
        e["TEAM_ACCESS"] = "team_access";
        e["COURSES_AND_CERTS"] = "courses_and_certs";
        e["COMPANIES_TRUST"] = "companies_trust";
        e["COURSES_AND_PATHS"] = "courses_and_paths";
        return e;
      })({});
      class l extends r["a"] {
        constructor(e) {
          let {
            locale: t = Object(s["a"])().locale,
            placement: n,
            variant: r = null,
            url: o = null,
          } = e;
          super("UFBNoticeClickEvent");
          this.locale = void 0;
          this.placement = void 0;
          this.variant = void 0;
          this.url = void 0;
          this.locale = t;
          this.placement = n;
          this.variant = r;
          this.url = o;
        }
        get eventLocale() {
          return this.locale;
        }
        get eventPlacement() {
          return this.placement;
        }
        get eventVariant() {
          return this.variant;
        }
      }
      class p extends r["a"] {
        constructor(e) {
          let { buyable: t } = e;
          super("BuyNowEvent");
          this.buyable = void 0;
          this.buyable = t;
        }
      }
      class m extends r["a"] {
        constructor(e) {
          let { buyable: t } = e;
          super("EnrollNowEvent");
          this.buyable = void 0;
          this.buyable = t;
        }
      }
      class g extends r["a"] {
        constructor(e) {
          let { id: t, type: n, trackingId: r } = e;
          super("QuickViewBoxOpenEvent");
          this.id = void 0;
          this.type = void 0;
          this.trackingId = void 0;
          this.id = t;
          this.trackingId = r;
          this.type = n;
        }
      }
      class f extends r["a"] {
        constructor(e) {
          let { id: t, trackingId: n } = e;
          super("WishlistEvent");
          this.id = void 0;
          this.trackingId = void 0;
          this.id = t;
          this.trackingId = n;
        }
      }
      class h extends r["a"] {
        constructor(e) {
          let { resultTrackingId: t, autoCompleteItem: n } = e;
          super("AutoCompleteItemClickEvent");
          this.resultTrackingId = void 0;
          this.autoCompleteItem = void 0;
          this.resultTrackingId = t;
          this.autoCompleteItem = n;
        }
      }
      class v extends r["a"] {
        constructor(e) {
          let { resultTrackingId: t, query: n } = e;
          super("AutoCompleteResultImpressionEvent");
          this.resultTrackingId = void 0;
          this.query = void 0;
          this.resultTrackingId = t;
          this.query = n;
        }
      }
      class y extends r["a"] {
        constructor(e) {
          let { resultTrackingId: t } = e;
          super("AutoCompleteResultBounceEvent");
          this.resultTrackingId = void 0;
          this.resultTrackingId = t;
        }
      }
      class b extends r["a"] {
        constructor(e) {
          let {
            query: t,
            resultCount: n,
            toCollectionType: r,
            fromCollectionType: s,
          } = e;
          super("CollectionTypeSwitchEvent");
          this.query = void 0;
          this.resultCount = void 0;
          this.fromCollectionType = void 0;
          this.toCollectionType = void 0;
          this.query = t;
          this.resultCount = n;
          this.fromCollectionType = s;
          this.toCollectionType = r;
        }
      }
      class _ extends r["a"] {
        constructor(e, t) {
          super("SearchInferenceLanguageChangeEvent");
          this.language = e;
          this.trackingId = t;
        }
      }
      class j extends r["a"] {
        constructor(e) {
          let { query: t, aggregation: n, option: r, isCheckedOnClick: s } = e;
          super("DirectoryFilterChangeEvent");
          this.query = void 0;
          this.aggregation = void 0;
          this.option = void 0;
          this.isCheckedOnClick = void 0;
          this.query = t;
          this.aggregation = n;
          this.option = r;
          this.isCheckedOnClick = s;
        }
      }
      class w extends r["a"] {
        constructor(e) {
          let { occupationId: t, occupationName: n, index: r, uiRegion: s } = e;
          super("OccupationCardImpressionEvent");
          this.occupationId = void 0;
          this.occupationName = void 0;
          this.index = void 0;
          this.uiRegion = void 0;
          this.occupationId = t;
          this.occupationName = n;
          this.index = r;
          this.uiRegion = s;
        }
      }
      class x extends r["a"] {
        constructor(e) {
          let { occupationId: t, occupationName: n, index: r, uiRegion: s } = e;
          super("OccupationCardClickEvent");
          this.occupationId = void 0;
          this.occupationName = void 0;
          this.index = void 0;
          this.uiRegion = void 0;
          this.occupationId = t;
          this.occupationName = n;
          this.index = r;
          this.uiRegion = s;
        }
      }
      var k = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/tracker.js"
      );
      var O = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/helpers.js"
      );
      const E = new Set();
      function C(e, t) {
        var n, r, s, o, a;
        let { item: c } = e;
        let { backendSource: d, index: u, uiRegion: l } = t;
        let { relatedSourceId: p = null, relatedSourceType: m = null } =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : {};
        const g =
          (n = c.frontendTrackingId) !== null && n !== void 0
            ? n
            : c.tracking_id;
        if (g && E.has(g)) {
          return;
        }
        const f = c.visibleBadgeFamilies
          ? c.visibleBadgeFamilies
          : (r =
              (s = c.badges) === null || s === void 0
                ? void 0
                : s.map((e) => e.badge_family)) !== null && r !== void 0
          ? r
          : null;
        k["a"].publishEvent(
          new i({
            id: c.id,
            type: c._class
              ? c._class
              : (o = c.type) !== null && o !== void 0
              ? o
              : "",
            trackingId: g !== null && g !== void 0 ? g : "",
            serveTrackingId:
              (a = c.tracking_id) !== null && a !== void 0 ? a : "",
            backendSource: d,
            position: (u !== null && u !== void 0 ? u : 0) + 1,
            badgeFamilies: f,
            relatedSourceId: p,
            relatedSourceType: m,
            uiRegion: l,
          })
        );
        g && E.add(g);
      }
      function S(e, t) {
        var n, r, s, o, i, c;
        let { item: d } = e;
        const u =
          (n = d.frontendTrackingId) !== null && n !== void 0
            ? n
            : d.tracking_id;
        const l = d.visibleBadgeFamilies
          ? d.visibleBadgeFamilies
          : (r =
              (s = d.badges) === null || s === void 0
                ? void 0
                : s.map((e) => e.badge_family)) !== null && r !== void 0
          ? r
          : null;
        k["a"].publishEvent(
          new a({
            id: d.id,
            type: d._class
              ? d._class
              : (o = d.type) !== null && o !== void 0
              ? o
              : "",
            trackingId: u !== null && u !== void 0 ? u : "",
            serveTrackingId:
              (i = d.tracking_id) !== null && i !== void 0 ? i : "",
            backendSource: t.backendSource,
            position: ((c = t.index) !== null && c !== void 0 ? c : 0) + 1,
            badgeFamilies: l,
            uiRegion: t.uiRegion,
          })
        );
      }
      function T(e, t) {
        if (E.has(e.tracking_id)) {
          return;
        }
        k["a"].publishEvent(
          new c({
            trackingId: e.tracking_id,
            unitTitle: e.title,
            renderType: t,
          })
        );
        E.add(e.tracking_id);
      }
      const I = {
        alreadyTrackedUUIDs: E,
        trackDiscoveryImpression: C,
        trackDiscoveryItemClickEvent: S,
        trackUnitView: T,
      };
      function P(e) {
        e.filter((e) => !e.frontendTrackingId).forEach((e) => {
          e.frontendTrackingId = Object(O["b"])();
        });
      }
      n.d(t, "a", function () {
        return o;
      });
      n.d(t, "d", function () {
        return i;
      });
      n.d(t, "c", function () {
        return a;
      });
      n.d(t, "g", function () {
        return d;
      });
      n.d(t, "f", function () {
        return l;
      });
      n.d(t, "b", function () {
        return p;
      });
      n.d(t, "e", function () {
        return m;
      });
      n.d(t, "h", function () {
        return f;
      });
      n.d(t, "j", function () {
        return I;
      });
      n.d(t, "i", function () {
        return P;
      });
    },
    "./node_modules/@udemy/design-system-utils/dist/esm/a11y/a11y.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "d", function () {
          return i;
        });
        n.d(t, "c", function () {
          return a;
        });
        n.d(t, "e", function () {
          return c;
        });
        n.d(t, "f", function () {
          return d;
        });
        n.d(t, "b", function () {
          return u;
        });
        n.d(t, "a", function () {
          return p;
        });
        n.d(t, "g", function () {
          return m;
        });
        var r = n("./node_modules/core-js-pure/stable/instance/includes.js");
        var s = n.n(r);
        const o = function () {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) {
            t[n] = arguments[n];
          }
          return (e) => (n) => {
            var r;
            if (
              s()((r = ["keydown", "keypress"])).call(r, n.type) &&
              s()(t).call(t, n.key)
            ) {
              e(n);
            }
          };
        };
        const i = o("Enter", " ");
        const a = o("Enter");
        const c = o("Escape");
        const d = o("ArrowUp", "ArrowRight");
        const u = o("ArrowDown", "ArrowLeft");
        const l = () => {
          let e = 0;
          let t = "";
          const n = function () {
            let n =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : "";
            e++;
            return `${t}${n}--${e}`;
          };
          const r = function () {
            let n =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : null;
            t = n ? `u${n}-` : "";
            e = 0;
          };
          return { getUniqueId: n, setUniqueIdNamespace: r };
        };
        const { getUniqueId: p, setUniqueIdNamespace: m } = l();
      },
    "./node_modules/@udemy/design-system-utils/dist/esm/ios/lock-page-scroll.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return i;
        });
        n.d(t, "b", function () {
          return c;
        });
        n.d(t, "c", function () {
          return d;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
        );
        let s = false;
        let o;
        const i = new Set();
        const a = !!(
          typeof window !== "undefined" &&
          window.navigator &&
          window.navigator.platform &&
          /iP(ad|hone|od)/.test(window.navigator.platform)
        );
        function c(e) {
          let t =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : { isIOS: a };
          const n = r["a"].global.document;
          const c = i.has(e);
          if (!c) {
            i.add(e);
          }
          if (!t.isIOS) {
            if (o === undefined) {
              o = n.body.style.overflow;
              n.body.style.overflow = "hidden";
            }
          } else {
            if (e && !c) {
              let t = -1;
              e.ontouchstart = (e) => {
                if (e.targetTouches.length === 1) {
                  t = e.targetTouches[0].clientY;
                }
              };
              e.ontouchmove = (n) => {
                if (n.targetTouches.length === 1) {
                  u(n, e, t);
                }
              };
            }
            if (!s) {
              n.addEventListener("touchmove", l, { passive: false });
              s = true;
            }
          }
        }
        function d(e) {
          let t =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : { isIOS: a };
          const n = r["a"].global.document;
          i.delete(e);
          if (!t.isIOS) {
            if (o !== undefined && i.size === 0) {
              n.body.style.overflow = o;
              o = undefined;
            }
          } else {
            if (e) {
              e.ontouchstart = undefined;
              e.ontouchmove = undefined;
            }
            if (s && i.size === 0) {
              n.removeEventListener("touchmove", l);
              s = false;
            }
          }
        }
        function u(e, t, n) {
          const r = e.targetTouches[0].clientY - n;
          if (t && t.scrollTop === 0 && r > 0) {
            return l(e);
          }
          if (t && t.scrollHeight - t.scrollTop <= t.clientHeight && r < 0) {
            return l(e);
          }
          e.stopPropagation();
          return true;
        }
        function l(e) {
          if (e.touches.length > 1) {
            return true;
          }
          e.preventDefault();
          return false;
        }
      },
    "./node_modules/@udemy/design-system-utils/dist/esm/keyboard/find-focusables.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return r;
        });
        function r(e) {
          const t = "button,input,select,textarea,a[href],[tabindex]";
          let n = Array.from(e.querySelectorAll(t));
          const r = '[disabled],[aria-disabled="true"],[tabindex="-1"]';
          const s = Array.from(e.querySelectorAll(r));
          s.forEach((e) => {
            n = n.filter((t) => !e.contains(t));
          });
          return n;
        }
      },
    "./node_modules/@udemy/design-system-utils/dist/esm/keyboard/force-tab-order.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return s;
        });
        var r = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/keyboard/keys.js"
        );
        function s(e) {
          function t(t) {
            const n = t.which || t.keyCode;
            if (n === r["b"].TAB || t.key === r["a"].TAB) {
              for (const n of e) {
                const e = t.shiftKey ? n[1]() : n[0]();
                if (e && e === t.target) {
                  const e = t.shiftKey ? n[0]() : n[1]();
                  if (e && e.tabIndex !== -1) {
                    t.preventDefault();
                    e.focus();
                    return;
                  }
                }
              }
            }
          }
          function n() {
            document.removeEventListener("keydown", t);
          }
          document.addEventListener("keydown", t);
          return n;
        }
      },
    "./node_modules/@udemy/design-system-utils/dist/esm/keyboard/keys.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return r;
        });
        n.d(t, "a", function () {
          return s;
        });
        const r = {
          TAB: 9,
          RETURN: 13,
          ESCAPE: 27,
          SPACE: 32,
          LEFT: 37,
          UP: 38,
          RIGHT: 39,
          DOWN: 40,
        };
        const s = {
          TAB: "Tab",
          RETURN: "Enter",
          ESCAPE: "Escape",
          SPACE: " ",
          LEFT: "ArrowLeft",
          UP: "ArrowUp",
          RIGHT: "ArrowRight",
          DOWN: "ArrowDown",
        };
      },
    "./node_modules/@udemy/design-system-utils/dist/esm/root-close-wrapper/root-close-wrapper.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return d;
        });
        n.d(t, "c", function () {
          return u;
        });
        n.d(t, "b", function () {
          return l;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/lodashy/noop.js"
        );
        var s = n("./node_modules/react/index.js");
        var o = n.n(s);
        var i = n("./node_modules/react-dom/index.js");
        var a = n.n(i);
        var c = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/keyboard/keys.js"
        );
        const d = { CLICK: "click", KEYBOARD: "keyboard" };
        const u = Object(s["createContext"])({ ignoreRootClose: r["a"] });
        class l extends o.a.Component {
          constructor() {
            super(...arguments);
            this.dom = null;
            this.shouldRootClose = true;
            this.ignoreRootClose = () => {
              this.shouldRootClose = false;
              this.context.ignoreRootClose();
            };
            this.onDocumentClick = (e) => {
              if (this.shouldRootClose) {
                this.props.onRootClose(e, this.dom, "click");
              }
              this.shouldRootClose = true;
            };
            this.onKeyDown = (e) => {
              if (e.keyCode === c["b"].ESCAPE && this.shouldRootClose) {
                this.props.onRootClose(e, this.dom, "keyboard");
              }
            };
          }
          componentDidMount() {
            var e, t;
            this.dom = a.a.findDOMNode(this);
            (e = this.dom) === null || e === void 0
              ? void 0
              : e.addEventListener("click", this.ignoreRootClose);
            (t = this.dom) === null || t === void 0
              ? void 0
              : t.addEventListener("keydown", this.onKeyDown);
            document.addEventListener("click", this.onDocumentClick);
            document.addEventListener("keydown", this.onKeyDown);
          }
          componentWillUnmount() {
            var e, t;
            document.removeEventListener("click", this.onDocumentClick);
            document.removeEventListener("keydown", this.onKeyDown);
            (e = this.dom) === null || e === void 0
              ? void 0
              : e.removeEventListener("click", this.ignoreRootClose);
            (t = this.dom) === null || t === void 0
              ? void 0
              : t.removeEventListener("keydown", this.onKeyDown);
            this.dom = null;
          }
          render() {
            const e = { ignoreRootClose: this.ignoreRootClose };
            return o.a.createElement(
              u.Provider,
              { value: e },
              o.a.Children.only(this.props.children)
            );
          }
        }
        l.contextType = u;
      },
    "./node_modules/@udemy/design-system-utils/dist/esm/viewport/above-the-fold.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return i;
        });
        n.d(t, "b", function () {
          return a;
        });
        var r = n("./node_modules/mobx-react/dist/mobx-react.module.js");
        var s = n("./node_modules/react/index.js");
        var o = n.n(s);
        const i = (e) =>
          o.a.createElement(
            r["c"],
            Object.assign({}, e, { isAboveTheFold: true })
          );
        function a(e) {
          return Object(r["e"])(function () {
            let { isAboveTheFold: e } =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : {};
            return { isAboveTheFold: e };
          })(e);
        }
      },
    "./node_modules/@udemy/event-tracking/dist/esm/lib/common-tracking.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return i;
        });
        var r = n(
          "./node_modules/@udemy/event-tracking/dist/esm/tracker/tracker.js"
        );
        var s = n(
          "./node_modules/@udemy/event-tracking/dist/esm/lib/events.js"
        );
        var o = n(
          "./node_modules/@udemy/event-tracking/dist/esm/lib/ref-id-storage.js"
        );
        function i(e) {
          let { courseId: t, courseTrackingId: n, componentName: i } = e;
          r["a"].publishEvent(
            new s["a"]({
              componentName: i,
              relatedObjectType: s["a"].relatedObjectTypes.course,
              relatedObjectId: t,
              trackingId: n,
            })
          );
          Object(o["b"])(t, n);
        }
      },
    "./node_modules/@udemy/event-tracking/dist/esm/lib/events.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "b", function () {
        return i;
      });
      n.d(t, "c", function () {
        return a;
      });
      n.d(t, "d", function () {
        return d;
      });
      n.d(t, "a", function () {
        return u;
      });
      var r = n(
        "./node_modules/@udemy/shared-utils/dist/esm/onetrust/get-user-consent-categories.js"
      );
      var s = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/event-common.js"
      );
      class o extends s["a"] {
        constructor(e) {
          let { testField1: t, testField2: n } = e;
          super("PublicTestEvent");
          this.testField1 = void 0;
          this.testField2 = void 0;
          this.testField1 = t;
          this.testField2 = n;
        }
      }
      class i extends s["a"] {
        constructor() {
          super("ClientLoadEvent");
          this.appVersion = void 0;
          this.appLanguage = void 0;
          this.url = void 0;
          this.referrer = void 0;
          this.timezoneOffset = void 0;
          this.screen = void 0;
          this.source = void 0;
          this.viewport = void 0;
          this.userConsentCategories = void 0;
        }
        processContext(e) {
          super.processContext(e);
          this.appVersion = e.appVersion;
          this.appLanguage = e.appLanguage;
          this.url = e.url;
          this.referrer = e.referrer;
          this.timezoneOffset = e.timezoneOffset;
          this.screen = e.screen;
          this.source = e.sourceServiceName;
          this.viewport = e.viewport;
          this.userConsentCategories = Object(r["b"])(null);
        }
      }
      class a extends s["a"] {
        constructor(e) {
          super("PageViewEvent");
          this.isRouteChange = e;
          this.url = void 0;
        }
        processContext(e) {
          super.processContext(e);
          this.url = e.url;
        }
      }
      class c extends s["a"] {
        constructor() {
          super("PageResumeEvent");
          this.url = void 0;
        }
        processContext(e) {
          super.processContext(e);
          this.url = e.url;
        }
      }
      class d extends s["a"] {
        constructor(e) {
          super("PageVisibilityChangeEvent");
          this.isVisible = e;
        }
      }
      class u extends s["a"] {
        constructor(e) {
          let {
            componentName: t,
            trackingId: n = undefined,
            relatedObjectType: r = undefined,
            relatedObjectId: s = undefined,
          } = e;
          super("ClickEvent");
          this.componentName = void 0;
          this.trackingId = void 0;
          this.relatedObjectType = void 0;
          this.relatedObjectId = void 0;
          this.componentName = t;
          this.trackingId = n;
          this.relatedObjectType = r;
          this.relatedObjectId = s;
        }
      }
      u.relatedObjectTypes = {
        codingExercise: "coding_exercise",
        course: "course",
        courseCategory: "course_category",
        courseLabel: "course_label",
        coursesubCategory: "course_subcategory",
        lecture: "lecture",
        practiceTest: "practice_test",
        simpleQuiz: "simple_quiz",
        user: "user",
      };
    },
    "./node_modules/@udemy/event-tracking/dist/esm/lib/ref-id-storage.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return i;
        });
        n.d(t, "b", function () {
          return a;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/storage/ud-expiring-local-storage-with-key-ttls.js"
        );
        let s;
        function o() {
          const e = 24 * 3;
          const t = 60;
          const n = 6e4;
          if (!s) {
            s = Object(r["a"])(
              "eventTrackingIDStorage",
              "clpRefIdStorage-1.0",
              e * t * n
            );
          }
          return s;
        }
        function i(e) {
          const t = o();
          return t.get(`${e}`);
        }
        function a(e, t) {
          const n = o();
          n.set(`${e}`, t);
        }
      },
    "./node_modules/@udemy/event-tracking/dist/esm/lib/track-impression.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return l;
        });
        var r = n(
          "./node_modules/@babel/runtime/helpers/applyDecoratedDescriptor.js"
        );
        var s = n.n(r);
        var o = n(
          "./node_modules/@researchgate/react-intersection-observer/lib/es/index.js"
        );
        var i = n("./node_modules/autobind-decorator/lib/esm/index.js");
        var a = n("./node_modules/react/index.js");
        var c = n.n(a);
        var d, u;
        let l =
          ((d =
            ((u = class e extends a["Component"] {
              constructor() {
                super(...arguments);
                this.recordedTimeout = void 0;
              }
              componentWillUnmount() {
                clearTimeout(this.recordedTimeout);
              }
              handleIntersection(e, t) {
                const {
                  trackFunc: n,
                  onlyOnce: r,
                  visibilityThreshold: s,
                  minDuration: o,
                } = this.props;
                if (e.isIntersecting && e.intersectionRatio >= s) {
                  this.recordedTimeout = setTimeout(() => {
                    if (r) {
                      t();
                    }
                    n();
                  }, o);
                } else {
                  clearTimeout(this.recordedTimeout);
                }
              }
              render() {
                var t;
                const { children: n, isDev: r } = this.props;
                if (
                  r === true &&
                  n &&
                  c.a.Children.count(n) === 1 &&
                  ((t = c.a.Children.only(n)) === null || t === void 0
                    ? void 0
                    : t.type
                  ).displayName === e.displayName
                ) {
                  throw Error(
                    "Nesting TrackImpression components without a div in between is not allowed. Details in code"
                  );
                }
                return c.a.createElement(
                  o["a"],
                  {
                    onChange: this.handleIntersection,
                    threshold: this.props.visibilityThreshold,
                    rootMargin: this.props.rootMargin,
                  },
                  n
                );
              }
            }),
            (u.displayName = "TrackImpression"),
            (u.defaultProps = {
              onlyOnce: true,
              visibilityThreshold: 0.99,
              minDuration: 500,
              rootMargin: "0px 0px 0px",
            }),
            u)),
          s()(
            d.prototype,
            "handleIntersection",
            [i["a"]],
            Object.getOwnPropertyDescriptor(d.prototype, "handleIntersection"),
            d.prototype
          ),
          d);
      },
    "./node_modules/@udemy/event-tracking/dist/esm/tracker/constants.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "c", function () {
          return r;
        });
        n.d(t, "d", function () {
          return s;
        });
        n.d(t, "e", function () {
          return o;
        });
        n.d(t, "f", function () {
          return a;
        });
        n.d(t, "b", function () {
          return c;
        });
        n.d(t, "a", function () {
          return d;
        });
        const r = "/api-2.0/ecl";
        const s = "https://www.udemy.com";
        const o = "web_main";
        const i = "https://www.udemy.com/api-2.0/ecl";
        const a = "__udmy_2_v57r";
        let c = (function (e) {
          e["WAITING"] = "WAITING";
          e["FAILURE"] = "FAILURE";
          e["SUCCESS"] = "SUCCESS";
          e["BEACON_SENT"] = "BEACON_SENT";
          return e;
        })({});
        const d = Object.freeze({
          USE_DEFAULT: 0,
          USE_CURRENT: 1,
          USE_PROVIDED: 2,
        });
      },
    "./node_modules/@udemy/event-tracking/dist/esm/tracker/event-common.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return o;
        });
        n.d(t, "a", function () {
          return c;
        });
        var r = n(
          "./node_modules/@udemy/event-tracking/dist/esm/tracker/helpers.js"
        );
        class s {
          constructor(e) {
            this._type = e;
            this.createTime = void 0;
            this.sendTime = void 0;
            this.eventId = void 0;
            this.createTime = Date.now();
            this.sendTime = null;
            this.eventId = Object(r["b"])();
          }
          setSendTime(e) {
            this.sendTime = e;
          }
          getType() {
            return this._type;
          }
        }
        class o {
          constructor(e, t) {
            this.width = e;
            this.height = t;
          }
        }
        class i {
          constructor(e, t) {
            this.trackingId = e;
            this.key = t;
          }
        }
        class a {
          constructor(e, t, n, r, s, o, i, a, c, d) {
            this.appKey = e;
            this.sourceServiceName = t;
            this.organizationId = n;
            this.userId = r;
            this.visitorUuid = s;
            this.sessionId = o;
            this.clientId = i;
            this.page = a;
            this.isMobile = c;
            this.isD2CSubscriber = d;
          }
        }
        class c extends s {
          constructor() {
            super(...arguments);
            this.clientHeader = void 0;
          }
          processContext(e) {
            this.clientHeader = new a(
              e.appKey,
              e.sourceServiceName,
              e.organizationId,
              e.userId,
              e.visitorUuid,
              e.sessionId,
              e.clientId,
              new i(e.pageTrackingId, e.pageKey),
              e.isMobile,
              e.isD2CSubscriber
            );
          }
        }
      },
    "./node_modules/@udemy/event-tracking/dist/esm/tracker/helpers.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "c", function () {
          return s;
        });
        n.d(t, "e", function () {
          return o;
        });
        n.d(t, "f", function () {
          return a;
        });
        n.d(t, "g", function () {
          return d;
        });
        n.d(t, "d", function () {
          return l;
        });
        n.d(t, "b", function () {
          return p;
        });
        n.d(t, "a", function () {
          return g;
        });
        var r = n(
          "./node_modules/@udemy/event-tracking/node_modules/uuid/dist/esm-browser/v4.js"
        );
        function s() {
          return (new Date().getTimezoneOffset() / 60) * -1;
        }
        function o(e, t) {
          let n =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : 0;
          let r =
            arguments.length > 3 && arguments[3] !== undefined
              ? arguments[3]
              : () => true;
          return async function () {
            for (let s = 0; s < t; s++) {
              try {
                return await e(...arguments);
              } catch (e) {
                const o = s + 1 === t;
                const a = !r(e);
                if (o || a) {
                  throw e;
                }
                n && (await i(n));
              }
            }
            return e(...arguments);
          };
        }
        const i = (e) => new Promise((t) => setTimeout(t, e));
        function a(e) {
          let t = false;
          return async function () {
            if (t) {
              return;
            }
            t = true;
            const n = await e(...arguments);
            t = false;
            return n;
          };
        }
        let c = true;
        function d(e) {
          c = e;
        }
        function u() {
          if (c) {
            console.log(...arguments);
          }
        }
        function l() {
          if (c) {
            console.error(...arguments);
          }
        }
        function p() {
          const e = Object(r["a"])("binary");
          return m(e);
        }
        function m(e) {
          const t =
            typeof window === "undefined"
              ? globalThis.Buffer.from(e).toString()
              : btoa(e);
          return t.replace(/\+/g, "-").replace(/\//g, "_").substring(0, 22);
        }
        function g() {
          const e = {};
          e.promise = new Promise((t, n) => {
            e.resolve = t;
            e.reject = n;
          });
          return e;
        }
      },
    "./node_modules/@udemy/event-tracking/dist/esm/tracker/sender.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return p;
        });
        n.d(t, "c", function () {
          return E;
        });
        n.d(t, "d", function () {
          return C;
        });
        n.d(t, "e", function () {
          return S;
        });
        n.d(t, "a", function () {
          return T;
        });
        var r = n("./node_modules/axios/index.js");
        var s = n.n(r);
        var o = n(
          "./node_modules/@udemy/event-tracking/dist/esm/lib/events.js"
        );
        var i = n(
          "./node_modules/@udemy/event-tracking/dist/esm/tracker/constants.js"
        );
        var a = n(
          "./node_modules/@udemy/event-tracking/dist/esm/tracker/helpers.js"
        );
        var c = n(
          "./node_modules/@udemy/event-tracking/dist/esm/tracker/tracker.js"
        );
        const d = {
          clientKeyUrlParam: "client_key",
          clientKey: "js",
          clientVersionUrlParam: "client_version",
          queueFlushPeriod: 3e3,
          queueInitialFlushDelay: 250,
          requestTimeout: 2e4,
          retryGap: 3e3,
          maxTimeoutRetry: 3,
        };
        const u = [];
        const l = [];
        function p(e) {
          l.push(e);
        }
        function m() {
          l.splice(0, l.length);
        }
        function g(e, t, n) {
          l.forEach((r) => {
            r(e, t, n);
          });
        }
        let f;
        let h;
        async function v() {
          if (h) {
            await h();
          }
        }
        let y;
        let b;
        let _;
        const j = [];
        let w = false;
        let x;
        let k = d.clientKey;
        let O = (e) => {
          Object(a["d"])(e);
        };
        function E(e, t, n) {
          let r =
            arguments.length > 3 && arguments[3] !== undefined
              ? arguments[3]
              : true;
          let o = arguments.length > 4 ? arguments[4] : undefined;
          let i = arguments.length > 5 ? arguments[5] : undefined;
          let c = arguments.length > 6 ? arguments[6] : undefined;
          let u = arguments.length > 7 ? arguments[7] : undefined;
          if (u) {
            O = u;
          }
          if (i) {
            k = i;
          }
          y = q(t, n, o);
          if (e) {
            C(e);
          }
          const l = s.a.create({
            timeout: d.requestTimeout,
            headers: { "Content-Type": "text/plain" },
          });
          f = Object(a["e"])(
            (e) => l.post(y, e),
            d.maxTimeoutRetry,
            d.retryGap,
            D(r)
          );
          h = Object(a["f"])(P);
          B(c);
          x = setInterval(() => {
            if (!w) {
              h();
            }
          }, d.queueFlushPeriod);
          setTimeout(h, d.queueInitialFlushDelay);
        }
        function C(e) {
          b = function () {
            e(...arguments);
            g(...arguments);
          };
        }
        function S(e) {
          u.push(e);
        }
        function T(e) {
          let t =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : false;
          let n = false;
          j.push(function () {
            if (!t || !n) {
              e(...arguments);
            }
            n = true;
          });
        }
        function I() {
          const e = [...u];
          u.length = 0;
          z(e);
          return e;
        }
        async function P() {
          _ = I();
          if (!_.length) {
            return;
          }
          let e = null;
          try {
            e = await f(JSON.stringify(_));
          } catch (e) {
            R(e, _);
          }
          if (e && e.status === 200) {
            A(_);
          }
          if (e && e.status === 207) {
            N(_, e);
          }
          _.length = 0;
        }
        function D(e) {
          return function (t) {
            return (
              (!t.request.status ||
                (t.request.status >= 500 && t.request.status <= 599)) &&
              e
            );
          };
        }
        function A(e) {
          e.forEach((e) => {
            b(e.eventData, i["b"].SUCCESS);
          });
        }
        function N(e, t) {
          const n = new Set();
          t.data.failedEvents.forEach((t) => {
            const r = e[t.idx].eventData;
            b(r, i["b"].FAILURE, t.reason);
            t.event = r;
            n.add(r);
          });
          const r = e.filter((e) => !n.has(e.eventData));
          r.forEach((e) => {
            b(e.eventData, i["b"].SUCCESS);
          });
          Object(a["d"])(
            "Following events have failed to be persisted",
            t.data.failedEvents
          );
        }
        function R(e, t) {
          t.forEach((e) => {
            b(e.eventData, i["b"].FAILURE);
          });
          Object(a["d"])("Event tracking send error", e);
        }
        function L(e, t) {
          const n = e ? i["b"].BEACON_SENT : i["b"].FAILURE;
          const r = e ? undefined : "Beacon API failed";
          t.forEach((e) => {
            b(e.eventData, n, r);
          });
        }
        function z(e) {
          const t = Date.now();
          e.forEach((e) => {
            e.eventData.setSendTime(t);
          });
        }
        const U = () => {
          var e;
          const t = [];
          if ((e = _) !== null && e !== void 0 && e.length) {
            t.push(..._);
          }
          t.push(...I());
          if (t.length > 0) {
            const e = navigator.sendBeacon(y, JSON.stringify(t));
            L(e, t);
          }
        };
        function F() {
          j.forEach((e) => {
            try {
              e();
            } catch (e) {
              O(e);
            }
          });
        }
        function M() {
          w = true;
          F();
          U();
        }
        function $() {
          w = false;
        }
        function B(e) {
          if (!navigator.sendBeacon) {
            return;
          }
          window.addEventListener("pagehide", M);
          window.addEventListener("pageshow", (e) => {
            if (e.persisted) {
              $();
            }
          });
          if (!e) {
            document.addEventListener("visibilitychange", () => {
              c["a"].publishEvent(new o["d"](!document.hidden));
              if (document.hidden) {
                U();
              }
            });
          }
        }
        function q(e, t, n) {
          const r = new URLSearchParams();
          r.set(d.clientKeyUrlParam, d.clientKey);
          r.set(d.clientVersionUrlParam, e);
          const s = ((e) => {
            switch (e) {
              case i["a"].USE_DEFAULT:
                return i["d"] + i["c"];
              case i["a"].USE_CURRENT:
                return i["c"];
              case i["a"].USE_PROVIDED:
                return n !== null && n !== void 0 ? n : i["d"] + i["c"];
            }
          })(t);
          return `${s}?${r.toString()}`;
        }
      },
    "./node_modules/@udemy/event-tracking/dist/esm/tracker/session.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return d;
        });
        var r = n(
          "./node_modules/@udemy/event-tracking/node_modules/js-cookie/dist/js.cookie.js"
        );
        var s = n.n(r);
        var o = n(
          "./node_modules/@udemy/event-tracking/dist/esm/tracker/helpers.js"
        );
        const i = 30 * 60 * 1e3;
        const a = "eventing_session_id";
        const c = ".udemy.com";
        class d {
          constructor() {
            let e =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : Object(o["b"])();
            let t =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : d.produceSessionExpirationDate();
            this.sessionId = e;
            this.expirationDate = t;
          }
          isExpired() {
            return Date.now() > this.expirationDate.getTime();
          }
          resetExpiration() {
            this.expirationDate = d.produceSessionExpirationDate();
          }
          toString() {
            return `${this.sessionId}-${this.expirationDate.getTime()}`;
          }
          static produceSessionExpirationDate() {
            return new Date(Date.now() + i);
          }
          static readSessionFromCookie() {
            const e = s.a.get(a);
            if (!e) {
              return null;
            }
            const t = e.split("-");
            if (t.length !== 2) {
              return null;
            }
            const n = t[0];
            const r = parseInt(t[1], 10);
            if (isNaN(r)) {
              return null;
            }
            const o = new Date(r);
            return new d(n, o);
          }
          static writeSessionToCookie(e) {
            let t = window.location.hostname;
            if (t.includes(c)) {
              t = c;
            }
            s.a.set(a, e.toString(), {
              expires: e.expirationDate,
              path: "/",
              domain: t,
              sameSite: "strict",
              secure: !d.disableSecureCookieForTest,
            });
          }
          static getEventTrackingSessionId() {
            let e = d.readSessionFromCookie();
            if (!e || e.isExpired()) {
              e = new d();
            } else {
              e.resetExpiration();
            }
            d.writeSessionToCookie(e);
            return e.sessionId;
          }
        }
        d.disableSecureCookieForTest = false;
      },
    "./node_modules/@udemy/event-tracking/dist/esm/tracker/tracker.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return g;
        });
        var r = n(
          "./node_modules/@udemy/event-tracking/node_modules/js-cookie/dist/js.cookie.js"
        );
        var s = n.n(r);
        var o = n(
          "./node_modules/@udemy/event-tracking/dist/esm/tracker/constants.js"
        );
        var i = n(
          "./node_modules/@udemy/event-tracking/dist/esm/tracker/event-common.js"
        );
        var a = n(
          "./node_modules/@udemy/event-tracking/dist/esm/tracker/helpers.js"
        );
        var c = n(
          "./node_modules/@udemy/event-tracking/dist/esm/tracker/sender.js"
        );
        var d = n(
          "./node_modules/@udemy/event-tracking/dist/esm/tracker/session.js"
        );
        function u() {}
        const l = {
          appKey: o["e"],
          appLanguage: "",
          appVersion: "",
          clientRetries: true,
          domainConfig: o["a"].USE_DEFAULT,
          isD2CSubscriber: false,
          isMobile: false,
          isTrackingEnabled: true,
          organizationId: null,
          pageKey: null,
          pageTrackingId: null,
          printLogs: false,
          userId: null,
          visitorUuid: null,
        };
        class p {
          constructor() {
            this.context = {};
            this.ready = false;
            this.firstPageKey = null;
            this.initDeferred = Object(a["a"])();
            this.publishHook = u;
          }
          initialize(e, t) {
            var n;
            if (t) {
              this.setPublishHook(t);
            }
            this.initializeContext(e);
            Object(c["c"])(
              t,
              this.context.appVersion,
              (n = e.domainConfig) !== null && n !== void 0
                ? n
                : l.domainConfig,
              e.clientRetries,
              e.collectorURLOverride,
              e.clientKey,
              e.disablePageVisibilityTracking,
              e.captureException
            );
            this.initDeferred.resolve();
            this.ready = true;
          }
          setPublishHook(e) {
            this.publishHook = e;
            Object(c["d"])(e);
          }
          initializeContext(e) {
            const t = {
              sessionId: d["a"].getEventTrackingSessionId(),
              clientId: Object(a["b"])(),
              url: window.location.href,
              referrer: document.referrer || null,
              timezoneOffset: Object(a["c"])(),
              screen: new i["b"](window.screen.width, window.screen.height),
              viewport: new i["b"](window.innerWidth, window.innerHeight),
              printLogs: this.context.env === "DEV",
            };
            this.firstPageKey = e.pageKey;
            this.context = {
              ...l,
              ...t,
              ...e,
              pageTrackingId: Object(a["b"])(),
              visitorUuid: e.visitorUuid || s.a.get(o["f"]),
            };
            Object(a["g"])(!!this.context.printLogs);
          }
          refreshContext() {
            if (this.context) {
              this.context.sessionId = d["a"].getEventTrackingSessionId();
              this.context.viewport.width = window.innerWidth;
              this.context.viewport.height = window.innerHeight;
            }
          }
          setPageContext(e, t) {
            if (!this.firstPageKey) {
              this.firstPageKey = e;
            }
            this.context.pageKey = e;
            this.context.pageTrackingId = t;
            this.context.url = window.location.href;
            this.context.pathname = window.location.pathname;
          }
          publishEvent(e) {
            if (this.ready) {
              this._publishEvent(e);
            } else {
              this.initDeferred.promise.then(() => this._publishEvent(e));
            }
          }
          addCloseListener(e) {
            let t =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : false;
            Object(c["a"])(e, t);
          }
          _publishEvent(e) {
            if (!this.context.isTrackingEnabled) {
              return;
            }
            this.publishHook(e, o["b"].WAITING);
            this.refreshContext();
            e.processContext(this.context);
            Object(c["e"])({ eventType: e._type, eventData: e });
          }
        }
        const m = new p();
        const g = m;
      },
    "./node_modules/@udemy/fullstory/dist/esm/index.js": function (e, t, n) {
      "use strict";
      const r = "ZD1RP";
      const s = 0.0125;
      const o = 0.1;
      const i = 0.05;
      const a = 0.05;
      const c = [
        "DiscoveryItemImpressionEvent",
        "PriceImpressionEvent",
        "QuickViewBoxOpenEvent",
      ];
      var d = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/event-common.js"
      );
      var u = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/constants.js"
      );
      class l extends d["a"] {
        constructor(e) {
          let { fullstoryUrl: t } = e;
          super("FullstoryInitializedEvent");
          this.fullstoryUrl = void 0;
          this.fullstoryUrl = t;
        }
      }
      function p(e, t) {
        if (t === u["b"].WAITING) {
          return false;
        }
        return t === u["b"].FAILURE || !c.includes(e.getType());
      }
      var m = n("./node_modules/@fullstory/browser/dist/index.esm.js");
      var g = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/tracker.js"
      );
      var f = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/sender.js"
      );
      function h(e, t) {
        const n = e.slice(0, 8);
        const r = parseInt(n, 16);
        return r % 1e3 < t * 1e3;
      }
      function v(e) {
        if (false) {
        }
      }
      class y {
        async initialize(e) {
          let { udData: t, userData: n, sampleRate: c, onInitialized: d } = e;
          const {
            Config: u,
            request: y,
            visiting: b,
            userAgnosticTrackingParams: _,
          } = t;
          const {
            isUBAdmin: j,
            isUBGroupAdmin: w,
            isConsumerSubsSubscriber: x,
            isProLicenseHolder: k,
            ubRole: O,
            isInstructorPartner: E,
            isAuthenticated: C,
            signupDate: S,
          } = n;
          if (!u.brand.is_external_sources_enabled) {
            v(
              "Skipping Fullstory initialization: config.brand.is_external_sources_enabled is false"
            );
            return false;
          }
          if (c === undefined) {
            if (t.Config.brand.has_organization) {
              if (j || w) {
                c = o;
              } else {
                c = i;
              }
            } else if (x) {
              c = a;
            } else {
              c = s;
            }
          }
          if (!h(b.visitor_uuid, c)) {
            v(
              `Skipping Fullstory initialization: visitor_uuid ${b.visitor_uuid} not sampled`
            );
            return false;
          }
          m["init"]({ orgId: r }, (e) => {
            let { sessionUrl: t } = e;
            if (n.encryptedId) {
              m["identify"](n.encryptedId);
            }
            g["a"].publishEvent(new l({ fullstoryUrl: t }));
            d === null || d === void 0 ? void 0 : d(t);
          });
          Object(f["b"])((e, t, n) => {
            if (m["isInitialized"]() && p(e, t)) {
              m["event"](e.getType(), {
                status_str: t.toString(),
                failureReason_str: n !== null && n !== void 0 ? n : "",
              });
            }
          });
          const T = {
            appName_str: u.app_name,
            language_str: y.language,
            pageKey_str: _.page_key || "no-page-key",
            priceCountry_str: u.price_country.id,
          };
          m["setVars"]("page", T);
          const I = {
            isBot_bool: y.is_bot,
            isConsumerSubsSubscriber_bool: x,
            isUBAdmin_bool: j,
            isUBGroupAdmin_bool: w,
            ubRole_str: O,
            isProLicenseHolder_bool: k,
            isInstructorPartner_bool: E,
            isAuthenticated_bool: C,
            isFirstTimeVisitor_bool: b.is_first_time_visitor,
            isMobile_bool: y.isMobile,
            isPC_bool: y.isPC,
            language_str: y.language,
            signupDate_date: S,
          };
          m["setUserVars"](I);
          return true;
        }
      }
      const b = new y();
      n.d(t, "c", function () {
        return p;
      });
      n.d(t, "b", function () {
        return b;
      });
      n.d(t, "a", function () {
        return m;
      });
    },
    "./node_modules/@udemy/funnel-tracking/dist/esm/funnel-log-context-provider.react-component.js":
      function (e, t, n) {
        "use strict";
        var r = n(
          "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js"
        );
        var s = n.n(r);
        var o = n("./node_modules/mobx-react/dist/mobx-react.module.js");
        var i = n("./node_modules/react/index.js");
        var a = n.n(i);
        var c = n(
          "./node_modules/@udemy/shared-utils/dist/esm/react/get-display-name.js"
        );
        var d = n(
          "./node_modules/@udemy/shared-utils/dist/esm/react/make-hoc.js"
        );
        var u = n(
          "./node_modules/@udemy/store-provider/dist/esm/with-stores.js"
        );
        const l = Object.freeze({
          allCoursesContext: "all-courses",
          featuredContext: "featured",
          featuredPageContext: "feature",
          myCoursesContext: "my-courses",
          learningContext: "learning",
          collectionContext: "collection",
          wishlistContext: "wishlist",
          searchPage: "search",
          becauseYouEnrolled: "enroll-recommendation",
          becauseYouSearched: "search-recommendation",
          becauseYouViewed: "view-recommendation",
          bestsellers: "best-seller",
          studentsAreViewing: "students-are-viewing",
          newAndNoteworthy: "new-and-noteworthy",
          learningPack: "learning-pack",
          yourWishlist: "wishlist",
          frequentlyBought: "frequentitemsrecommendation",
          tagBasedUnit: "tag-du",
          topicPage: "topic",
          topic: "all-courses",
          onboardingContext: "onboarding-success",
          channelContextMap: {
            category: "cat_ch",
            collection: "coll_ch",
            dynamic_tag_collection: "cl",
            keyword: "kw_ch",
            featured: "ft_ch",
            logged_in_homepage: "ft_ch",
            logged_out_homepage: "home_ch",
            personalized_home: "home_ch",
            home: "home_ch",
            subcategory: "scat_ch",
            topic: "cl",
            landingPageCourse: "landing-page",
            landingPageFreeCourse: "clp-free",
          },
        });
        var p = n(
          "./node_modules/@udemy/funnel-tracking/dist/esm/funnel-log-context.mobx-store.js"
        );
        class m {
          constructor() {
            this.isLoading = false;
            this.priceMap = new Map();
          }
        }
        m.STORE_ID = "CoursePriceStore";
        n.d(t, "a", function () {
          return f;
        });
        n.d(t, "c", function () {
          return h;
        });
        n.d(t, "b", function () {
          return v;
        });
        n.d(t, "d", function () {
          return y;
        });
        class g extends a.a.Component {
          constructor() {
            var e;
            super(...arguments);
            this.funnelLogContextStore = new p["a"](
              {
                context:
                  (e = this.props.context) !== null && e !== void 0
                    ? e
                    : this.props.pageType
                    ? l.channelContextMap[this.props.pageType]
                    : undefined,
                context2: this.props.context2,
                subcontext: this.props.subcontext,
                subcontext2: this.props.subcontext2,
              },
              this.props.stores[0]
            );
          }
          render() {
            return a.a.createElement(
              o["c"],
              {
                funnelLogContextStore:
                  this.props.funnelLogContextStore ||
                  this.funnelLogContextStore,
              },
              a.a.Children.only(this.props.children)
            );
          }
        }
        const f = Object(u["a"])([m], g);
        const h = () => (e) => {
          const t = (t) => a.a.createElement(f, null, a.a.createElement(e, t));
          t.displayName = `WithFunnelLogContextProvider(${Object(c["a"])(e)})`;
          return s()(t, e);
        };
        function v() {
          const e = a.a.useContext(o["a"]);
          return e.funnelLogContextStore;
        }
        const y = Object(d["a"])({
          useGetData: () => {
            const e = v();
            return { funnelLogContextStore: e };
          },
          getDisplayName: (e) => `WithFunnelLogContextStore(${e})`,
          getPropTypes: (e) => {
            const { funnelLogContextStore: t, ...n } = e;
            return n;
          },
        });
      },
    "./node_modules/@udemy/funnel-tracking/dist/esm/funnel-log-context.mobx-store.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return y;
        });
        var r = n(
          "./node_modules/@babel/runtime/helpers/initializerDefineProperty.js"
        );
        var s = n.n(r);
        var o = n(
          "./node_modules/@babel/runtime/helpers/applyDecoratedDescriptor.js"
        );
        var i = n.n(o);
        var a = n(
          "./node_modules/@babel/runtime/helpers/initializerWarningHelper.js"
        );
        var c = n.n(a);
        var d = n("./node_modules/mobx/lib/mobx.module.js");
        var u = n(
          "./node_modules/@udemy/shared-utils/dist/esm/lodashy/debounce.js"
        );
        var l = n(
          "./node_modules/@udemy/funnel-tracking/dist/esm/funnel-tracking.js"
        );
        var p, m, g, f, h, v;
        let y =
          ((p = class e {
            constructor(e, t) {
              let {
                context: n,
                context2: r,
                subcontext: o,
                subcontext2: i,
              } = e;
              this.pendingItems = void 0;
              this.loggedItemIds = void 0;
              s()(this, "context", m, this);
              s()(this, "context2", g, this);
              s()(this, "subcontext", f, this);
              s()(this, "subcontext2", h, this);
              this.priceStore = void 0;
              s()(this, "updateContext", v, this);
              this.markAsSeen = (e, t) => {
                const n = { ...e, ...this.contextObj, ...t };
                if (
                  !this.loggedItemIds.has(e.id) &&
                  !this.pendingItems.has(e.id)
                ) {
                  this.pendingItems.set(e.id, n);
                  this.debouncedTrackEvents();
                }
              };
              this.logAction = (e, t, n) => {
                const r = { courses: t, ...this.contextObj, ...n };
                return l["a"].requestToFunnelAPI(e, r, this.priceStore);
              };
              this.trackEvents = () => {
                if (this.pendingItems.size > 0) {
                  if (!this.priceStore.isLoading) {
                    const e = {
                      courses: [...this.pendingItems.values()],
                      ...this.contextObj,
                    };
                    l["a"].requestToFunnelAPI(
                      "mark-as-seen",
                      e,
                      this.priceStore
                    );
                    this.pendingItems.forEach((e) => {
                      this.loggedItemIds.add(e.id);
                    });
                    this.pendingItems.clear();
                  } else {
                    this.debouncedTrackEvents();
                  }
                }
              };
              this.debouncedTrackEvents = Object(u["a"])(this.trackEvents, 1e3);
              this.context = n;
              this.context2 = r;
              this.subcontext = o;
              this.subcontext2 = i;
              this.pendingItems = new Map();
              this.loggedItemIds = new Set();
              this.priceStore = t;
            }
            get contextObj() {
              const {
                context: e,
                context2: t,
                subcontext: n,
                subcontext2: r,
              } = this;
              return { context: e, context2: t, subcontext: n, subcontext2: r };
            }
          }),
          (m = i()(p.prototype, "context", [d["t"]], {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: null,
          })),
          (g = i()(p.prototype, "context2", [d["t"]], {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: null,
          })),
          (f = i()(p.prototype, "subcontext", [d["t"]], {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: null,
          })),
          (h = i()(p.prototype, "subcontext2", [d["t"]], {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: null,
          })),
          (v = i()(p.prototype, "updateContext", [d["e"]], {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: function () {
              return (e) => {
                Object.assign(this, e);
              };
            },
          })),
          p);
      },
    "./node_modules/@udemy/funnel-tracking/dist/esm/funnel-log.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return u;
        });
        n.d(t, "b", function () {
          return l;
        });
        var r = n(
          "./node_modules/@researchgate/react-intersection-observer/lib/es/index.js"
        );
        var s = n(
          "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js"
        );
        var o = n.n(s);
        var i = n("./node_modules/react/index.js");
        var a = n.n(i);
        var c = n(
          "./node_modules/@udemy/shared-utils/dist/esm/react/get-display-name.js"
        );
        var d = n(
          "./node_modules/@udemy/funnel-tracking/dist/esm/funnel-log-context-provider.react-component.js"
        );
        const u = (e) => {
          const t = Object(d["b"])();
          function n(n, r) {
            if (n.isIntersecting && e.item) {
              r();
              t === null || t === void 0 ? void 0 : t.markAsSeen(e.item);
            }
          }
          if (!t) {
            return e.children;
          }
          return a.a.createElement(
            r["a"],
            { threshold: 0.99, onChange: n },
            e.children
          );
        };
        const l = (e) => (t) => {
          const n = (n) =>
            a.a.createElement(u, { item: n[e] }, a.a.createElement(t, n));
          n.displayName = `WithFunnelLog(${Object(c["a"])(t)})`;
          return o()(n, t);
        };
      },
    "./node_modules/@udemy/funnel-tracking/dist/esm/funnel-tracking.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return i;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/data/get-config-data.js"
        );
        var s = n("./node_modules/@udemy/ud-api/dist/esm/index.js");
        const o = "visits/me/funnel-logs/";
        class i {}
        i.createContextKey = (e) =>
          [e.context, e.subcontext, e.context2, e.subcontext2].join("-");
        i.logAction = (e, t, n, r) => {
          const s = { courses: t, ...n };
          return i.requestToFunnelAPI(e, s, r);
        };
        i.markAsSeen = (e, t, n) => {
          const r = { courses: [e], ...t };
          i.requestToFunnelAPI("mark-as-seen", r, n);
        };
        i.requestToFunnelAPI = (e, t, n) => {
          var i, a, c, d;
          const u = [];
          const l = [];
          const p = [];
          t.courses.forEach((e) => {
            var t, r, s, o, i;
            let a;
            if (e.price) {
              a = {
                price: e.price,
                discount: e.discount,
                price_detail: e.price_detail,
              };
            } else {
              var c;
              a = (c = n.priceMap.get(e.id)) !== null && c !== void 0 ? c : {};
            }
            if (
              ((t = a) === null || t === void 0 ? void 0 : t.price) !==
              undefined
            ) {
              var d;
              u.push((d = a) === null || d === void 0 ? void 0 : d.price);
            } else {
              u.push("");
            }
            if (
              ((r = a) === null || r === void 0
                ? void 0
                : (s = r.discount_price) === null || s === void 0
                ? void 0
                : s.amount) !== undefined
            ) {
              var m, g;
              l.push(
                (m = a) === null || m === void 0
                  ? void 0
                  : (g = m.discount_price) === null || g === void 0
                  ? void 0
                  : g.amount.toString()
              );
            } else {
              l.push("");
            }
            if (
              ((o = a) === null || o === void 0
                ? void 0
                : (i = o.discount) === null || i === void 0
                ? void 0
                : i.price) !== undefined
            ) {
              var f, h;
              const e =
                (f = a) === null || f === void 0
                  ? void 0
                  : (h = f.discount) === null || h === void 0
                  ? void 0
                  : h.price;
              p.push(e.price_string);
            } else {
              p.push("");
            }
          });
          return s["c"].post(o, {
            type: e,
            context: (i = t.context) !== null && i !== void 0 ? i : "",
            subcontext: (a = t.subcontext) !== null && a !== void 0 ? a : "",
            context2: (c = t.context2) !== null && c !== void 0 ? c : "",
            subcontext2: (d = t.subcontext2) !== null && d !== void 0 ? d : "",
            currency: Object(r["a"])().price_country.currency_symbol,
            course_ids: t.courses.map((e) => e.id).join(","),
            list_price: u.join("|").replace(/[^0-9|,.]/g, ""),
            discount_price: p
              .map((e, t) => e || l[t])
              .join("|")
              .replace(/[^0-9|,.]/g, ""),
          });
        };
      },
    "./node_modules/@udemy/graphql/dist/esm/index.js": function (e, t, n) {
      "use strict";
      var r = n(
        "./node_modules/@tanstack/react-query/build/lib/useQuery.esm.js"
      );
      var s = n(
        "./node_modules/@udemy/graphql/node_modules/js-cookie/dist/js.cookie.js"
      );
      var o = n.n(s);
      const i = () => {
        var e;
        const t = (e = o.a.get()) !== null && e !== void 0 ? e : {};
        if (t.ud_locale) {
          const e = t.ud_locale.split("_").join("-");
          return { "Accept-Language": e };
        }
      };
      const a = (e, t, n) => async () => {
        let r;
        if (n && "_signal" in n) {
          r = n._signal;
          delete n._signal;
        }
        const s = await fetch("/api/2022-03/graphql/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...i(),
            ...(n !== null && n !== void 0 ? n : {}),
          },
          body: JSON.stringify({ query: e, variables: t }),
          signal: r,
        });
        const o = await s.json();
        if (o.errors) {
          const { message: e } = o.errors[0] || "Error..";
          throw new Error(e);
        }
        return o.data;
      };
      let c = (function (e) {
        e["ClosedCaption"] = "CLOSED_CAPTION";
        e["Subtitle"] = "SUBTITLE";
        return e;
      })({});
      let d = (function (e) {
        e["Cplusplus"] = "CPLUSPLUS";
        e["CsvProcessingWithPython"] = "CSV_PROCESSING_WITH_PYTHON";
        e["CSharp"] = "C_SHARP";
        e["CSharp_11"] = "C_SHARP_11";
        e["Html"] = "HTML";
        e["JavascriptEs6"] = "JAVASCRIPT_ES6";
        e["Java_9"] = "JAVA_9";
        e["Java_11"] = "JAVA_11";
        e["Java_17"] = "JAVA_17";
        e["Php_5"] = "PHP_5";
        e["Php_7"] = "PHP_7";
        e["Python_3_5"] = "PYTHON_3_5";
        e["Python_3_8"] = "PYTHON_3_8";
        e["Python_3_10"] = "PYTHON_3_10";
        e["React_16"] = "REACT_16";
        e["Ruby"] = "RUBY";
        e["R_3_6"] = "R_3_6";
        e["Scipy_1_4NumpyPandasSympyAndScikitLearn_0_23"] =
          "SCIPY_1_4_NUMPY_PANDAS_SYMPY_AND_SCIKIT_LEARN_0_23";
        e["Sql"] = "SQL";
        e["Sqlite_3"] = "SQLITE_3";
        e["Swift_3"] = "SWIFT_3";
        e["Swift_5"] = "SWIFT_5";
        return e;
      })({});
      let u = (function (e) {
        e["Cpe"] = "CPE";
        return e;
      })({});
      let l = (function (e) {
        e["Rating"] = "RATING";
        e["Relevance"] = "RELEVANCE";
        e["Reviews"] = "REVIEWS";
        e["Time"] = "TIME";
        return e;
      })({});
      let p = (function (e) {
        e["Aud"] = "AUD";
        e["Brl"] = "BRL";
        e["Cad"] = "CAD";
        e["Dkk"] = "DKK";
        e["Eur"] = "EUR";
        e["Gbp"] = "GBP";
        e["Idr"] = "IDR";
        e["Ils"] = "ILS";
        e["Inr"] = "INR";
        e["Jpy"] = "JPY";
        e["Krw"] = "KRW";
        e["Mxn"] = "MXN";
        e["Nok"] = "NOK";
        e["Pln"] = "PLN";
        e["Rub"] = "RUB";
        e["Sgd"] = "SGD";
        e["Thb"] = "THB";
        e["Try"] = "TRY";
        e["Twd"] = "TWD";
        e["Usd"] = "USD";
        e["Vnd"] = "VND";
        e["Zar"] = "ZAR";
        return e;
      })({});
      let m = (function (e) {
        e["Day"] = "DAY";
        e["Month"] = "MONTH";
        e["Week"] = "WEEK";
        e["Year"] = "YEAR";
        return e;
      })({});
      let g = (function (e) {
        e["AllLevels"] = "ALL_LEVELS";
        e["Beginner"] = "BEGINNER";
        e["Expert"] = "EXPERT";
        e["Intermediate"] = "INTERMEDIATE";
        return e;
      })({});
      let f = (function (e) {
        e["Af"] = "AF";
        e["Ak"] = "AK";
        e["Am"] = "AM";
        e["Ar"] = "AR";
        e["As"] = "AS";
        e["Az"] = "AZ";
        e["Be"] = "BE";
        e["Bg"] = "BG";
        e["Bm"] = "BM";
        e["Bn"] = "BN";
        e["Bo"] = "BO";
        e["Br"] = "BR";
        e["Bs"] = "BS";
        e["Ca"] = "CA";
        e["Ce"] = "CE";
        e["Cs"] = "CS";
        e["Cu"] = "CU";
        e["Cy"] = "CY";
        e["Da"] = "DA";
        e["De"] = "DE";
        e["Dz"] = "DZ";
        e["Ee"] = "EE";
        e["El"] = "EL";
        e["En"] = "EN";
        e["Eo"] = "EO";
        e["Es"] = "ES";
        e["Et"] = "ET";
        e["Eu"] = "EU";
        e["Fa"] = "FA";
        e["Ff"] = "FF";
        e["Fi"] = "FI";
        e["Fo"] = "FO";
        e["Fr"] = "FR";
        e["Fy"] = "FY";
        e["Ga"] = "GA";
        e["Gd"] = "GD";
        e["Gl"] = "GL";
        e["Gu"] = "GU";
        e["Gv"] = "GV";
        e["Ha"] = "HA";
        e["He"] = "HE";
        e["Hi"] = "HI";
        e["Hr"] = "HR";
        e["Hu"] = "HU";
        e["Hy"] = "HY";
        e["Ia"] = "IA";
        e["Id"] = "ID";
        e["Ig"] = "IG";
        e["Ii"] = "II";
        e["Is"] = "IS";
        e["It"] = "IT";
        e["Ja"] = "JA";
        e["Jv"] = "JV";
        e["Ka"] = "KA";
        e["Ki"] = "KI";
        e["Kk"] = "KK";
        e["Kl"] = "KL";
        e["Km"] = "KM";
        e["Kn"] = "KN";
        e["Ko"] = "KO";
        e["Ks"] = "KS";
        e["Ku"] = "KU";
        e["Kw"] = "KW";
        e["Ky"] = "KY";
        e["Lb"] = "LB";
        e["Lg"] = "LG";
        e["Ln"] = "LN";
        e["Lo"] = "LO";
        e["Lt"] = "LT";
        e["Lu"] = "LU";
        e["Lv"] = "LV";
        e["Mg"] = "MG";
        e["Mi"] = "MI";
        e["Mk"] = "MK";
        e["Ml"] = "ML";
        e["Mn"] = "MN";
        e["Mr"] = "MR";
        e["Ms"] = "MS";
        e["Mt"] = "MT";
        e["My"] = "MY";
        e["Nb"] = "NB";
        e["Nd"] = "ND";
        e["Ne"] = "NE";
        e["Nl"] = "NL";
        e["Nn"] = "NN";
        e["No"] = "NO";
        e["Om"] = "OM";
        e["Or"] = "OR";
        e["Os"] = "OS";
        e["Pa"] = "PA";
        e["Pl"] = "PL";
        e["Ps"] = "PS";
        e["Pt"] = "PT";
        e["PtBr"] = "PT_BR";
        e["PtPt"] = "PT_PT";
        e["Qu"] = "QU";
        e["Rm"] = "RM";
        e["Rn"] = "RN";
        e["Ro"] = "RO";
        e["Ru"] = "RU";
        e["Rw"] = "RW";
        e["Sd"] = "SD";
        e["Se"] = "SE";
        e["Sg"] = "SG";
        e["Si"] = "SI";
        e["Sk"] = "SK";
        e["Sl"] = "SL";
        e["Sn"] = "SN";
        e["So"] = "SO";
        e["Sq"] = "SQ";
        e["Sr"] = "SR";
        e["Su"] = "SU";
        e["Sv"] = "SV";
        e["Sw"] = "SW";
        e["Ta"] = "TA";
        e["Te"] = "TE";
        e["Tg"] = "TG";
        e["Th"] = "TH";
        e["Ti"] = "TI";
        e["Tk"] = "TK";
        e["To"] = "TO";
        e["Tr"] = "TR";
        e["Tt"] = "TT";
        e["Ug"] = "UG";
        e["Uk"] = "UK";
        e["Ur"] = "UR";
        e["Uz"] = "UZ";
        e["Vi"] = "VI";
        e["Vo"] = "VO";
        e["Wo"] = "WO";
        e["Xh"] = "XH";
        e["Yi"] = "YI";
        e["Yo"] = "YO";
        e["Zh"] = "ZH";
        e["ZhCn"] = "ZH_CN";
        e["ZhTw"] = "ZH_TW";
        e["Zu"] = "ZU";
        return e;
      })({});
      let h = (function (e) {
        e["Consumersubscription"] = "CONSUMERSUBSCRIPTION";
        e["Enterprise"] = "ENTERPRISE";
        e["Team"] = "TEAM";
        e["Udemypro"] = "UDEMYPRO";
        return e;
      })({});
      let v = (function (e) {
        e["Active"] = "ACTIVE";
        e["Canceled"] = "CANCELED";
        e["Expired"] = "EXPIRED";
        e["Future"] = "FUTURE";
        e["Trial"] = "TRIAL";
        return e;
      })({});
      let y = (function (e) {
        e["Popular"] = "POPULAR";
        e["Trending"] = "TRENDING";
        return e;
      })({});
      let b = (function (e) {
        e["ExtraLong"] = "EXTRA_LONG";
        e["ExtraShort"] = "EXTRA_SHORT";
        e["Long"] = "LONG";
        e["Medium"] = "MEDIUM";
        e["Short"] = "SHORT";
        return e;
      })({});
      const _ = `\n    query FeatureVariantAssignments($featureCodes: [String!]!, $realtimeAttributes: [FeatureRequestAttributeInput!]) {\n  featureVariantAssignmentsByCodeAndAttributes(\n    featureCodes: $featureCodes\n    realtimeAttributes: $realtimeAttributes\n  ) {\n    featureCode\n    configuration\n    isInExperiment\n    experimentIds\n  }\n}\n    `;
      const j = (e, t) =>
        Object(r["a"])(["FeatureVariantAssignments", e], a(_, e), t);
      j.getKey = (e) => ["FeatureVariantAssignments", e];
      j.fetcher = (e, t) => a(_, e, t);
      var w = n("./node_modules/axios/index.js");
      var x = n.n(w);
      var k = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-config-data.js"
      );
      var O = n("./node_modules/@udemy/ud-api/dist/esm/index.js");
      function E(e, t) {
        return btoa(`${e}:${t}`);
      }
      function C(e) {
        return atob(e);
      }
      function S(e) {
        return parseInt(C(e).split(":")[1], 10);
      }
      async function T(e) {
        let t =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {};
        const n = Object(k["a"])();
        try {
          const r = await x.a.post(n.graphql_federation_endpoint, e, {
            headers: {
              "Content-Type": "application/json",
              ...Object(O["b"])(),
              ...t,
            },
          });
          const s = r.data || {};
          if (s.errors) {
            return Promise.reject({ ...s, statusCode: r.status });
          }
          return s;
        } catch (e) {
          const t = e;
          const n = t.response || {};
          return Promise.reject({ ...n.data, statusCode: n.status });
        }
      }
      n.d(t, "b", function () {
        return j;
      });
      n.d(t, "a", function () {
        return T;
      });
    },
    "./node_modules/@udemy/gtag/dist/esm/index.js": function (e, t, n) {
      "use strict";
      let r = {};
      let s = {};
      function o() {
        s = {};
        r = {};
      }
      function i(e) {
        s[e] = true;
      }
      function a(e) {
        return !!s[e];
      }
      function c(e) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(e);
        r = { ...r, ...e };
      }
      function d() {
        return r;
      }
      var u = n("./node_modules/crypto-js/sha256.js");
      var l = n.n(u);
      var p = n("./node_modules/scriptjs/dist/script.js");
      var m = n.n(p);
      var g = n("./node_modules/uuid/index.js");
      var f = n(
        "./node_modules/@udemy/shared-utils/dist/esm/browser-log-collection/browser-log-collection.js"
      );
      var h = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/ud-visitor-uuid.js"
      );
      var v = n("./node_modules/@udemy/shared-utils/dist/esm/env/ud-me.js");
      var y = n("./node_modules/@udemy/shared-utils/dist/esm/env/constants.js");
      var b = n(
        "./node_modules/@udemy/shared-utils/dist/esm/onetrust/get-user-consent-categories.js"
      );
      var _ = n("./node_modules/@udemy/ud-api/dist/esm/index.js");
      const j = "https://gtm.udemy.com";
      const w = "G-7YMFEFLR6Q";
      const x = new f["a"]("gtag-client");
      const k = function (e, t) {
        let n =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : {};
        window.dataLayer = window.dataLayer || [];
        if (e === "event") {
          const e = t;
          if (n.onlyOnce === true) {
            if (a(e)) {
              return;
            }
          }
          i(e);
          n = { ...n, ...d() };
        }
        (function (e, t, n) {
          window.dataLayer.push(arguments);
        })(e, t, n);
      };
      function O() {
        const e = window.udGtag;
        window.udGtag = { push: (e) => e(k, d(), c) };
        if (Array.isArray(e) && e && e.length > 0) {
          for (let t = 0; t < e.length; t++) {
            window.udGtag.push(e[t]);
          }
        }
      }
      function E(e, t) {
        var n;
        let r =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : m.a;
        let s = arguments.length > 3 ? arguments[3] : undefined;
        const o = s || Object(g["v4"])();
        const i = Object(h["a"])();
        c({
          unique_tracking_id: o,
          event_id: o,
          visitor_uuid: i,
          external_id: i ? `${l()(`${i}`)}` : undefined,
        });
        if (!d().external_id) {
          x.error("external_id undefined at first set");
        }
        const a = `${j}/gtag/js?id=${w}`;
        k("js", new Date(), {});
        k("config", w, { transport_url: j, send_page_view: false });
        c({ send_to: w, transport_url: j });
        if (!d().external_id) {
          x.error("external_id undefined at first overwrite");
        }
        c({ ...e, transport_url: j, first_party_collection: true });
        if (!d().external_id) {
          x.error("external_id undefined at pageConfig save");
        }
        const u = [];
        const p = (n = Object(v["a"])()) !== null && n !== void 0 ? n : {};
        u.push(
          y["a"].user.extract().then((e) => {
            const t = { ...e, visitor_uuid: Object(h["a"])(), user_data: {} };
            if (p !== null && p !== void 0 && p.email) {
              t.user_data = {
                email_address: p.email,
                address: {
                  first_name: p.name,
                  last_name: p.surname,
                  country: p.country,
                },
              };
            }
            c(t);
          })
        );
        const f = parseInt(
          document.body.getAttribute("data-clp-course-id"),
          10
        );
        const E = f > 0;
        if (E) {
          u.push(
            _["c"]
              .get(y["a"].course.url(f), { params: y["a"].course.params })
              .then((e) => {
                const t = y["a"].course.extract(e.data);
                const n = {
                  ...t,
                  items: [
                    {
                      item_id: `${t.course_id}`,
                      item_name: t.course_title,
                      item_category: t.course_category,
                      item_category2: t.course_subcategory,
                      item_category3: t.course_topic,
                    },
                  ],
                };
                return n;
              })
              .then((e) => {
                c({ ...e, CLPCourseId: f });
                if (!d().external_id) {
                  x.error("external_id undefined at CLP ID save");
                }
                k("event", "course-data-ready");
                if (!d().external_id) {
                  x.error("external_id undefined after udGtag push on CLP");
                }
              })
          );
        }
        r(a, () => {
          if (typeof t === "function") {
            t();
          }
        });
        O();
        return Promise.all(u).then(() => {
          const e = b["a"].toGtagEventData();
          if (e.ad_storage !== "true" || e.personalization_storage !== "true") {
            return;
          }
          k("event", "page_view", Object.assign({}, e, { onlyOnce: true }));
        });
      }
      var C = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
      );
      var S = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-config-data.js"
      );
      var T = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-request-data.js"
      );
      function I() {
        C["a"].global.UD.GoogleAnalytics =
          C["a"].global.UD.GoogleAnalytics || {};
        C["a"].global.UD.GoogleAnalytics.trackEvent = P;
        C["a"].global.UD.GoogleAnalytics.trackPageview = D;
        C["a"].global.UD.GoogleAnalytics.setValue = A;
        C["a"].global.UD.GoogleAnalytics.trackPurchase = N;
        C["a"].global.UD.GoogleAnalytics.trackAllPageview = R;
      }
      function P(e, t, n, r, s, o) {
        const i = Object(S["a"])();
        if (!i.brand.has_organization && e && t) {
          if (!window.ga) {
            console.error("expected ga function to be in the window");
            return false;
          }
          const i = [];
          if (s) {
            i.push(s.concat(".send"));
          } else {
            i.push("send");
          }
          i.push("event");
          i.push(e, t);
          if (n) {
            i.push(n);
          }
          if (r) {
            i.push(parseInt(r, 10) || 0);
          }
          o = o || {};
          if (!o.nonInteraction) {
            o.nonInteraction = 0;
          }
          i.push(o);
          window.ga(...i);
        }
      }
      function D(e, t, n, r, s) {
        const o = Object(S["a"])();
        const i = Object(T["a"])();
        if (!o.brand.has_organization && e) {
          if (!window.ga) {
            console.error("expected ga function to be in the window");
          }
          C["a"].global.UD.GoogleAnalytics.createAccount(e, t, r);
          window.ga("set", "location", i.third_party_location);
          if (s) {
            window.ga("set", "contentGroup1", s);
          }
          const o = [];
          if (t) {
            o.push(t.concat(".send"));
          } else {
            o.push("send");
          }
          o.push("pageview");
          if (n) {
            o.push({ hitType: "pageview", page: n });
          }
          window.ga(...o);
        }
      }
      function A(e, t, n) {
        const r = Object(S["a"])();
        if (!r.brand.has_organization && e && t) {
          const r = [];
          if (n) {
            r.push(n.concat(".set"));
          } else {
            r.push("set");
          }
          r.push(e, t);
          window.ga(...r);
        }
      }
      function N(e) {
        const t = Object(S["a"])();
        if (!t.brand.has_organization && e) {
          window.ga("require", "ecommerce");
          window.ga("ecommerce:addTransaction", e);
          window.ga("ecommerce:send");
        }
      }
      function R(e) {
        const t = Object(S["a"])();
        if (t.brand.has_organization) {
          return;
        }
        D(t.third_party.google_analytics_id, null, e, null, null);
        if (t.brand.has_custom_google_analytics) {
          D(t.brand.google_analytics_id, "brand", e);
        }
        const n = C["a"].global.UD.GoogleAnalytics.instructor;
        if (n) {
          D(n.accountId, "instructor", n.page);
        }
      }
      n.d(t, "c", function () {
        return c;
      });
      n.d(t, "b", function () {
        return E;
      });
      n.d(t, "a", function () {
        return I;
      });
      n.d(t, "e", function () {
        return P;
      });
      n.d(t, "f", function () {
        return N;
      });
      n.d(t, "d", function () {
        return R;
      });
    },
    "./node_modules/@udemy/hooks/dist/esm/use-match-media/index.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "a", function () {
        return d;
      });
      n.d(t, "b", function () {
        return u;
      });
      var r = n("./node_modules/react/index.js");
      var s = n.n(r);
      var o = n(
        "./node_modules/@udemy/styles/dist/esm/tokens/generated/index.js"
      );
      const i = "breakpoint-";
      const a = Object.keys(o["a"])
        .filter((e) => e.startsWith(i))
        .map((e) => e.substring(i.length));
      const c = (e) => {
        if (a.includes(e)) {
          const t = e.endsWith("-max") ? "max-width" : "min-width";
          const n = `${i}${e}`;
          const r = o["a"][n];
          return `(${t}: ${r})`;
        }
        return e;
      };
      const d = (e) => {
        const t = c(e);
        const n = Object(r["useMemo"])(() => {
          var e, n;
          return (
            typeof window !== "undefined" &&
            ((e = (n = window).matchMedia) === null || e === void 0
              ? void 0
              : e.call(n, t))
          );
        }, [t]);
        const [s, o] = Object(r["useState"])(null);
        const i = (e) => {
          o(e.matches);
        };
        Object(r["useEffect"])(() => {
          if (n) {
            o(n.matches);
            if (n.addEventListener) {
              n.addEventListener("change", i);
            } else {
              n.addListener(i);
            }
            return () => {
              if (n.removeEventListener) {
                n.removeEventListener("change", i);
              } else {
                n.removeListener(i);
              }
            };
          }
        }, [t, n]);
        return s;
      };
      const u = (e) => (t) => (n) => {
        const r = Object.entries(e).reduce((e, t) => {
          let [n, r] = t;
          return { ...e, [n]: d(r) };
        }, {});
        return s.a.createElement(t, Object.assign({}, n, r));
      };
    },
    "./node_modules/@udemy/i18n/dist/esm/gettext-api.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return o;
      });
      var r = n("./node_modules/node-gettext/lib/gettext.js");
      var s = n.n(r);
      function o(e, t) {
        const n = new s.a();
        const r = "messages";
        const o = { "": {} };
        for (const [t, n] of Object.entries(e)) {
          const e = n;
          if (e.msgctxt) {
            o[t] = n;
          } else {
            const e = o[""];
            const r = typeof n === "string" ? [n] : n;
            e[t] = { comments: {}, msgid: t, msgstr: r };
          }
        }
        const i = { charset: "utf-8", translations: o };
        n.addTranslations(t, r, i);
        n.setLocale(t);
        const a = (e, t, n) => {
          if (n) {
            return e.replace(/%\(\w+\)s/g, function (e) {
              return String(t[e.slice(2, -2)]);
            });
          } else {
            return e.replace(/%s/g, function () {
              return String(t.shift());
            });
          }
        };
        const c = (e, t, r, s) => {
          let o = [r];
          let i = false;
          if (s) {
            o = s;
            i = true;
          }
          return a(n.ngettext(e, t, r), o, i);
        };
        return {
          gettext: n.gettext.bind(n),
          dgettext: n.dgettext.bind(n),
          dngettext: n.dngettext.bind(n),
          dpgettext: n.dpgettext.bind(n),
          ngettext: n.ngettext.bind(n),
          npgettext: n.npgettext.bind(n),
          pgettext: n.pgettext.bind(n),
          interpolate: a,
          ninterpolate: c,
        };
      }
    },
    "./node_modules/@udemy/i18n/dist/esm/i18n-context.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return i;
      });
      n.d(t, "b", function () {
        return a;
      });
      var r = n("./node_modules/react/index.js");
      var s = n.n(r);
      var o = n("./node_modules/@udemy/i18n/dist/esm/gettext-api.js");
      const i = s.a.createContext(null);
      const a = (e) => {
        let { lang: t, locale: n, translations: r, children: a } = e;
        const c = s.a.useMemo(() => {
          const e = Object(o["a"])(r, t);
          e.lang = t;
          e.locale = n;
          return e;
        }, [t, n, r]);
        return s.a.createElement(i.Provider, { value: c }, a);
      };
    },
    "./node_modules/@udemy/i18n/dist/esm/index.js": function (e, t, n) {
      "use strict";
      var r = n(
        "./node_modules/currencyformatter.js/dist/currencyFormatter.js"
      );
      var s = n.n(r);
      const o = "usd";
      const i = "en_US";
      const a = 2;
      function c(e) {
        let t =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {};
        const n = Object.assign(
          {
            currency: o,
            symbol: "$",
            locale: i,
            decimal: ".",
            group: ",",
            pattern: "!#,##0.00",
            scale: a,
          },
          t
        );
        if (!(n.locale in s.a.locales)) {
          n.locale = n.locale.substring(0, 2);
        }
        if (!(n.locale in s.a.locales)) {
          n.locale = "en_US";
        }
        n.pattern = n.pattern.replace(
          ".00",
          `.${new Array(n.scale + 1).join("0")}`
        );
        e = +(+e).toFixed(n.scale);
        return s.a.format(e, n);
      }
      const d = {
        "en-US": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 0, 1, 0],
        "de-DE": [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
        "es-ES": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
        "fr-FR": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
        "id-ID": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
        "it-IT": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
        "ja-JP": [/^(\d+)\/(\d+)\/(\d+)$/, 0, 1, 2, 0],
        "ko-KR": [/^(\d+)\. ?(\d+)\. ?(\d+)\.?$/, 0, 1, 2, 0],
        "nl-NL": [/^(\d+)-(\d+)-(\d+)$/, 2, 1, 0, 0],
        "pl-PL": [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
        "pt-BR": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
        "ro-RO": [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
        "ru-RU": [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
        "th-TH": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 543],
        "tr-TR": [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
        "zh-CN": [/^(\d+)\/(\d+)\/(\d+)$/, 0, 1, 2, 0],
        "zh-TW": [/^(\d+)\/(\d+)\/(\d+)$/, 0, 1, 2, 0],
        ISO: [/^(\d+)-(\d+)-(\d+)$/, 0, 1, 2, 0],
      };
      const u = Object.freeze({ DAY: "day", MONTH: "month" });
      const l = Object.freeze({ DAY: "day", MONTH: "month", YEAR: "year" });
      function p(e, t) {
        const n = d[t];
        if (!n) {
          throw new Error(`Unknown locale ${t} for parsing date string.`);
        }
        const [r, s, o, i, a] = n;
        const c = e.match(r) || [];
        const u = parseInt(c[s + 1], 10) || 0;
        const l = parseInt(c[o + 1], 10) || 0;
        const p = parseInt(c[i + 1], 10) || 0;
        if (c.length !== 4 || l < 1 || l > 12 || p < 1 || p > 31 || u < 100) {
          throw new Error("Invalid date");
        }
        return new Date(u - a, l - 1, p);
      }
      function m(e, t, n) {
        return e.toLocaleDateString(t, n);
      }
      function g(e) {
        return `${e.getFullYear()}-${(e.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${e.getDate().toString().padStart(2, "0")}`;
      }
      function f(e, t) {
        let n =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : u.DAY;
        e = new Date(e);
        t = new Date(t);
        e.setHours(0, 0, 0, 0);
        t.setHours(0, 0, 0, 0);
        if (n === u.MONTH) {
          e.setDate(1);
          t.setDate(1);
        }
        if (e > t) {
          return 1;
        } else if (e < t) {
          return -1;
        }
        return 0;
      }
      function h(e, t) {
        const n = new Date(e);
        const r = n.getDay();
        const s = t - r;
        n.setDate(n.getDate() + s);
        return n;
      }
      function v(e, t, n) {
        const r = new Date(e);
        if (n === l.DAY) {
          r.setDate(r.getDate() + t);
        } else if (n === l.MONTH) {
          r.setMonth(r.getMonth() + t);
        } else if (n === l.YEAR) {
          r.setFullYear(r.getFullYear() + t);
        }
        return r;
      }
      function y(e, t) {
        let n =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : {};
        const r = t.split("_");
        const s = r.length > 0 ? r[0] : "en";
        return Number(e).toLocaleString(s, n);
      }
      function b(e) {
        let t =
          arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        const n = Math.pow(10, t);
        return Math.round(e * n) / n;
      }
      function _(e) {
        let t =
          arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        let n = arguments.length > 2 ? arguments[2] : undefined;
        let r =
          arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : {};
        return y(b(Number(e), t).toFixed(t), n, r);
      }
      var j = n("./node_modules/react/index.js");
      var w = n.n(j);
      var x = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-config-data.js"
      );
      function k() {
        const e = w.a.useCallback(function (e) {
          var t, n;
          let r =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {};
          const s = Object(x["a"])();
          const o =
            (t =
              (n = s.price_country) === null || n === void 0
                ? void 0
                : n.currency_formatter) !== null && t !== void 0
              ? t
              : {};
          return c(e, { ...o, ...r });
        }, []);
        return { formatCurrency: e };
      }
      var O = n("./node_modules/@udemy/i18n/dist/esm/use-i18n.js");
      function E() {
        const e = Object(O["a"])();
        const t = w.a.useCallback(
          (t, n) => {
            if (!n) {
              n = e.locale.replace("_", "-") || "en-US";
            }
            return p(t, n);
          },
          [e.locale]
        );
        const n = w.a.useCallback(
          (t, n) => {
            const r = e.locale.replace("_", "-") || "en-US";
            return m(t, r, n);
          },
          [e.locale]
        );
        const r = w.a.useCallback((e) => g(e), []);
        const s = w.a.useCallback(function (e, t) {
          let n =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : u.DAY;
          return f(e, t, n);
        }, []);
        const o = w.a.useCallback((e, t) => h(e, t), []);
        const i = w.a.useCallback((e, t, n) => v(e, t, n), []);
        return {
          parseDateString: t,
          toLocaleDateString: n,
          toLocalDateStamp: r,
          compare: s,
          setDay: o,
          increment: i,
        };
      }
      function C() {
        const e = Object(O["a"])();
        const t = w.a.useCallback(
          function (t) {
            let n =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {};
            return y(t, e.locale, n);
          },
          [e.locale]
        );
        return { formatNumber: t };
      }
      function S() {
        const e = Object(O["a"])();
        const t = w.a.useCallback(
          function (t) {
            let n =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : 0;
            let r =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : {};
            return _(t, n, e.locale, r);
          },
          [e.locale]
        );
        return { formatRoundNumber: t };
      }
      var T = n("./node_modules/@udemy/i18n/dist/esm/i18n-context.js");
      var I = n(
        "./node_modules/@udemy/shared-utils/dist/esm/react/make-hoc.js"
      );
      var P = n("./node_modules/@udemy/i18n/dist/esm/gettext-api.js");
      function D(e) {
        const {
          dgettext: t,
          dngettext: n,
          dpgettext: r,
          gettext: s,
          interpolate: o,
          lang: i,
          locale: a,
          ngettext: c,
          npgettext: d,
          ninterpolate: u,
          pgettext: l,
          ...p
        } = e;
        return p;
      }
      function A() {
        let e =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {};
        const t = Object(P["a"])(e, "en");
        const n = "en";
        const r = "en_US";
        return { ...t, lang: n, locale: r };
      }
      const N = Object(I["a"])({
        useGetData: () => {
          const e = Object(O["a"])();
          return { ...e };
        },
        getDisplayName: (e) => `WithI18n(${e})`,
        getPropTypes: (e) => D(e),
      });
      var R = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
      );
      let L = null;
      const z = 3;
      function U(e) {
        var t;
        if (!L) {
          var n;
          let e;
          if (
            R["a"].isServer &&
            (n = R["a"].global) !== null &&
            n !== void 0 &&
            n.JSDOM
          ) {
            e = new R["a"].global.JSDOM().window.document;
          } else {
            e = document;
          }
          L = e.implementation.createHTMLDocument("title");
        }
        const r =
          (t = L) === null || t === void 0 ? void 0 : t.createElement("span");
        r.innerHTML = e;
        return r;
      }
      function F(e, t) {
        let n =
          arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        if (e.nodeType === z) {
          return w.a.createElement(w.a.Fragment, { key: n }, e.textContent);
        }
        let r = Array.from(e.childNodes).map((e, r) => F(e, t, n + r));
        if (r.length === 0) {
          r = null;
        }
        const s = t[e.className];
        if (s) {
          if (typeof s === "string") {
            return w.a.createElement(w.a.Fragment, { key: n }, s);
          }
          return w.a.cloneElement(s, { key: n }, r);
        }
        return w.a.createElement(e.tagName.toLowerCase(), { key: n }, r);
      }
      const M = (e) => {
        let { html: t = "", interpolate: n, dataPurpose: r, ...s } = e;
        const o = U(t);
        const i = F(o, n);
        return w.a.createElement(
          "span",
          Object.assign({}, s, { "data-purpose": r }),
          i.props.children
        );
      };
      n.d(t, "e", function () {
        return p;
      });
      n.d(t, "g", function () {
        return g;
      });
      n.d(t, "c", function () {
        return y;
      });
      n.d(t, "f", function () {
        return b;
      });
      n.d(t, "h", function () {
        return C;
      });
      n.d(t, "i", function () {
        return S;
      });
      n.d(t, "a", function () {
        return T["b"];
      });
      n.d(t, "k", function () {
        return N;
      });
      n.d(t, "j", function () {
        return O["a"];
      });
      n.d(t, "d", function () {
        return D;
      });
      n.d(t, "b", function () {
        return M;
      });
    },
    "./node_modules/@udemy/i18n/dist/esm/use-i18n.js": function (e, t, n) {
      "use strict";
      (function (e) {
        n.d(t, "a", function () {
          return c;
        });
        var r = n("./node_modules/react/index.js");
        var s = n.n(r);
        var o = n("./node_modules/@udemy/i18n/dist/esm/i18n-context.js");
        const i =
          "Unable to access i18n API. Make sure you either 1) wrap your app in the @udemy/i18n provider or 2) make the i18n API available in the global scope";
        const a =
          'Unable to resolve I18n context; falling back to global scope. This warning is shown because the environment variable UD_FRONTENDS_LOG_WARNINGS is set to "true".';
        function c() {
          const e = s.a.useContext(o["a"]);
          if (e) {
            return e;
          }
          const t = d();
          if (t) {
            if (false) {
            }
            return t;
          }
          throw new Error(i);
        }
        function d() {
          var t, n;
          const r = typeof window === "undefined" ? e : window;
          if (
            typeof r.gettext !== "function" ||
            typeof ((t = r.UD) === null || t === void 0
              ? void 0
              : t.request) === "undefined"
          ) {
            return null;
          }
          const s =
            (n = r.UD.request.locale) !== null && n !== void 0 ? n : "en_US";
          const o = {
            gettext: r.gettext,
            dgettext: r.dgettext,
            dngettext: r.dngettext,
            dpgettext: r.dpgettext,
            ngettext: r.ngettext,
            npgettext: r.npgettext,
            pgettext: r.pgettext,
            interpolate: r.interpolate,
            ninterpolate: r.ninterpolate,
            locale: s,
            lang: s.split("_")[0],
          };
          return o;
        }
      }.call(this, n("./node_modules/webpack/buildin/global.js")));
    },
    "./node_modules/@udemy/icons/dist/add-circle-solid.ud-icon": function (
      e,
      t,
      n
    ) {
      e.exports = n(
        "./node_modules/@udemy/react-core-components/dist/esm/index.js"
      )["createIcon"]("add-circle-solid");
    },
    "./node_modules/@udemy/icons/dist/close.ud-icon": function (e, t, n) {
      e.exports = n(
        "./node_modules/@udemy/react-core-components/dist/esm/index.js"
      )["createIcon"]("close");
    },
    "./node_modules/@udemy/icons/dist/collapse-minus.ud-icon": function (
      e,
      t,
      n
    ) {
      e.exports = n(
        "./node_modules/@udemy/react-core-components/dist/esm/index.js"
      )["createIcon"]("collapse-minus");
    },
    "./node_modules/@udemy/icons/dist/error.ud-icon": function (e, t, n) {
      e.exports = n(
        "./node_modules/@udemy/react-core-components/dist/esm/index.js"
      )["createIcon"]("error");
    },
    "./node_modules/@udemy/icons/dist/expand-plus.ud-icon": function (e, t, n) {
      e.exports = n(
        "./node_modules/@udemy/react-core-components/dist/esm/index.js"
      )["createIcon"]("expand-plus");
    },
    "./node_modules/@udemy/icons/dist/info.ud-icon": function (e, t, n) {
      e.exports = n(
        "./node_modules/@udemy/react-core-components/dist/esm/index.js"
      )["createIcon"]("info");
    },
    "./node_modules/@udemy/icons/dist/loading-spinner.ud-icon": function (
      e,
      t,
      n
    ) {
      e.exports = n(
        "./node_modules/@udemy/react-core-components/dist/esm/index.js"
      )["createIcon"]("loading-spinner");
    },
    "./node_modules/@udemy/icons/dist/play-overlay.ud-icon": function (
      e,
      t,
      n
    ) {
      e.exports = n(
        "./node_modules/@udemy/react-core-components/dist/esm/index.js"
      )["createIcon"]("play-overlay");
    },
    "./node_modules/@udemy/icons/dist/rating-star.ud-icon": function (e, t, n) {
      e.exports = n(
        "./node_modules/@udemy/react-core-components/dist/esm/index.js"
      )["createIcon"]("rating-star");
    },
    "./node_modules/@udemy/icons/dist/success.ud-icon": function (e, t, n) {
      e.exports = n(
        "./node_modules/@udemy/react-core-components/dist/esm/index.js"
      )["createIcon"]("success");
    },
    "./node_modules/@udemy/icons/dist/tick.ud-icon": function (e, t, n) {
      e.exports = n(
        "./node_modules/@udemy/react-core-components/dist/esm/index.js"
      )["createIcon"]("tick");
    },
    "./node_modules/@udemy/icons/dist/warning.ud-icon": function (e, t, n) {
      e.exports = n(
        "./node_modules/@udemy/react-core-components/dist/esm/index.js"
      )["createIcon"]("warning");
    },
    "./node_modules/@udemy/icons/dist/wishlisted.ud-icon": function (e, t, n) {
      e.exports = n(
        "./node_modules/@udemy/react-core-components/dist/esm/index.js"
      )["createIcon"]("wishlisted");
    },
    "./node_modules/@udemy/onetrust/dist/esm/index.js": function (e, t, n) {
      "use strict";
      var r = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
      );
      var s = n("./node_modules/@udemy/ud-data/dist/esm/index.js");
      class o {}
      o.STRICTLY_NECESSARY = "C0001";
      o.PERFORMANCE = "C0002";
      o.FUNCTIONAL = "C0003";
      o.ADVERTISING = "C0004";
      o.SOCIAL_MEDIA = "C0005";
      class i {
        static allows(e) {
          const t = r["a"].global.OnetrustActiveGroups;
          if (!t || typeof e == "undefined") {
            return false;
          }
          return t.includes(e);
        }
        static allowsPerformanceCookies() {
          return this.allows(o.PERFORMANCE);
        }
        static allowsFunctionalCookies() {
          return this.allows(o.FUNCTIONAL);
        }
        static allowsAdvertisingCookies() {
          return this.allows(o.ADVERTISING);
        }
        static allowsSocialMediaCookies() {
          return this.allows(o.SOCIAL_MEDIA);
        }
        static isMx() {
          return !Object(s["d"])().Config.brand.has_organization;
        }
        static allowsGoogleAnalytics() {
          return this.isMx() && this.allows(o.PERFORMANCE);
        }
        static toGtagEventData() {
          return {
            ad_storage: this.allowsAdvertisingCookies() ? "true" : "false",
            analytics_storage: this.allowsPerformanceCookies()
              ? "true"
              : "false",
            functionality_storage: this.allowsFunctionalCookies()
              ? "true"
              : "false",
            personalization_storage: this.allowsSocialMediaCookies()
              ? "true"
              : "false",
            security_storage: "true",
          };
        }
      }
      function a(e) {
        const t = e || r["a"].global.OnetrustActiveGroups;
        if (t) {
          return t
            .split(",")
            .filter((e) => e)
            .sort()
            .join(",");
        }
        return "";
      }
      var c = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/tracker.js"
      );
      var d = n("./node_modules/@udemy/event-tracking/dist/esm/lib/events.js");
      var u = n(
        "./node_modules/@udemy/onetrust/node_modules/js-cookie/dist/js.cookie.js"
      );
      var l = n.n(u);
      var p = n("./node_modules/@udemy/shared-utils/dist/esm/lodashy/noop.js");
      var m = n("./node_modules/@udemy/ud-api/dist/esm/index.js");
      var g = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/event-common.js"
      );
      class f extends g["a"] {
        constructor() {
          let { userConsentCategories: e } =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {};
          super("ConsentChangeEvent");
          this.userConsentCategories = void 0;
          this.userConsentCategories = a(e);
        }
      }
      function h(e) {
        const t = e.detail.join(",");
        if (t) {
          c["a"].publishEvent(new f({ userConsentCategories: t }));
        }
      }
      function v() {
        const e = Object(s["d"])().me;
        if (!e.is_authenticated) {
          return;
        }
        m["c"]
          .post("/privacy/user-cookie-preferences/")
          .then(p["a"])
          .catch((e) => {
            throw e;
          });
      }
      function y(e) {
        var t;
        const n = e.detail;
        const r =
          (t = window.OneTrust) === null || t === void 0
            ? void 0
            : t
                .GetDomainData()
                .Groups.filter((e) => !n.includes(e.CustomGroupId));
        if (!r || r.length === 0) {
          return;
        }
        const s = window.location.hostname.split(".").reverse();
        let o = "";
        let i = [];
        s.forEach((e) => {
          o = `.${e}${o}`;
          i.push(o);
        });
        if (i.length > 1) {
          i = i.slice(1);
        }
        r.forEach((e) => {
          e.Cookies.forEach((e) => {
            i.forEach((t) => {
              l.a.remove(e.Name, { path: "", domain: t });
            });
          });
        });
      }
      const b = [h, v, y];
      const _ = {
        BANNER_OK: "onetrust.banner.ok",
        CENTER_CONFIRM: "onetrust.preferencecenter.confirm",
        CENTER_ACCEPT_ALL: "onetrust.preferencecenter.acceptall",
        FOOTER_LINK: "onetrust.footer.settings",
      };
      function j(e) {
        let t = false;
        const n = e.target;
        const r = n.getAttribute("data-purpose");
        const s = n.getAttribute("class") || "";
        const o = n.id;
        if (o === "onetrust-accept-btn-handler") {
          t = _.BANNER_OK;
        } else if (s.includes("save-preference-btn-handler")) {
          t = _.CENTER_CONFIRM;
        } else if (o === "accept-recommended-btn-handler") {
          t = _.CENTER_ACCEPT_ALL;
        } else if (r === "footer.links.cookie_preferences") {
          t = _.FOOTER_LINK;
        } else {
          return false;
        }
        c["a"].publishEvent(new d["a"]({ componentName: t }));
        return true;
      }
      function w() {
        const e = window.__onConsentChanged || [];
        window.__onConsentChanged = {
          push: (e) => {
            for (const t in b) {
              try {
                b[t](e);
              } catch (e) {}
            }
          },
        };
        if (e && e.length > 0) {
          for (const t in e) {
            const n = e[t];
            window.__onConsentChanged.push(n);
          }
        }
      }
      function x() {
        if (typeof window === undefined || window.isOneTrustActive === false) {
          return;
        }
        window.addEventListener("click", j, { passive: true, capture: true });
        w();
      }
      function k() {
        var e;
        for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++) {
          n[r] = arguments[r];
        }
        (e = window.dataLayer) === null || e === void 0
          ? void 0
          : e.push(arguments);
      }
      const O = (() => {
        let e = false;
        return function () {
          if (e === true) {
            return false;
          }
          if (typeof window.dataLayer == "undefined") {
            window.dataLayer = window.dataLayer || [];
          }
          const t = window.OneTrust;
          const n = "granted";
          const r = "denied";
          window.optOutConsent = {
            ad_storage: n,
            analytics_storage: n,
            functionality_storage: n,
            personalization_storage: n,
            security_storage: n,
          };
          window.optInConsent = {
            ad_storage: r,
            analytics_storage: r,
            functionality_storage: r,
            personalization_storage: r,
            security_storage: n,
          };
          k("consent", "default", window.optInConsent);
          t.OnConsentChanged((e) => {
            window.__onConsentChanged = window.__onConsentChanged || [];
            window.__onConsentChanged.push(e);
          });
          const s = window.OneTrustReadyHandlers;
          window.OneTrustReadyHandlers = {
            push: (e) => {
              e(window.OneTrust);
            },
          };
          for (let e = 0; e < s.length; e++) {
            s[e](window.OneTrust);
          }
          const o = { ConsentModel: { Name: "uninitialized" } };
          const i = window.OneTrust.GetDomainData() || o;
          const a = i.ConsentModel || o.ConsentModel;
          const c = a.Name || o.ConsentModel.Name;
          switch (c) {
            case "opt-out":
              k("consent", "default", window.optOutConsent);
              break;
            case "opt-in":
            default:
              k("consent", "default", window.optInConsent);
              break;
          }
          e = true;
        };
      })();
      function E() {
        window.isOneTrustActive = true;
        window.OneTrustReadyHandlers = window.OneTrustReadyHandlers || [];
        if (!window.OneTrust) {
          window.OptanonWrapper = function () {
            O();
          };
        } else {
          O();
        }
        x();
      }
      var C = n("./node_modules/react/index.js");
      var S = n.n(C);
      var T = n(
        "./node_modules/@udemy/react-core-components/dist/esm/button/button.react-component.js"
      );
      let I = null;
      function P() {
        I = null;
      }
      function D() {
        let e =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : { cache: true };
        let t = I;
        if (!t || !e.cache) {
          t = new URLSearchParams(window.location.search).get("display_type");
          if (e.cache) {
            I = t;
          }
        }
        return t === "mobile_app";
      }
      function A(e) {
        var t;
        window.OneTrustReadyHandlers = window.OneTrustReadyHandlers || [];
        (t = window.OneTrustReadyHandlers) === null || t === void 0
          ? void 0
          : t.push(e);
      }
      const N = (e) => {
        const [t, n] = Object(C["useState"])(false);
        const [r, o] = Object(C["useState"])(false);
        const i = Object(C["useRef"])();
        Object(C["useEffect"])(() => {
          A((e) => {
            i.current = e;
            const t = Object(s["d"])().Config;
            const r = e.getGeolocationData();
            o(r.country === "US" && !t.brand.has_organization);
            n(!D());
          });
        }, [r]);
        if (!t) {
          return null;
        }
        return S.a.createElement(
          "li",
          { "data-testid": "cookie-settings" },
          S.a.createElement(
            T["a"],
            {
              className: "link white-link",
              typography: "ud-text-sm",
              udStyle: "link",
              "data-purpose": e.data_purpose,
              onClick: () => {
                var e;
                return (e = i.current) === null || e === void 0
                  ? void 0
                  : e.ToggleInfoDisplay();
              },
            },
            r ? e.text_us_mx : e.text
          )
        );
      };
      class R {
        static allowCookies() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) {
            t[n] = arguments[n];
          }
          window.OnetrustActiveGroups = t.join(",");
        }
        static rejectAllCookies() {
          this.allowCookies(o.STRICTLY_NECESSARY);
        }
        static allowAllCookies() {
          this.allowCookies(
            o.STRICTLY_NECESSARY,
            o.FUNCTIONAL,
            o.PERFORMANCE,
            o.SOCIAL_MEDIA,
            o.ADVERTISING
          );
        }
      }
      n.d(t, "a", function () {
        return i;
      });
      n.d(t, "b", function () {
        return N;
      });
      n.d(t, "c", function () {
        return x;
      });
      const L = "25ab360c-347c-4a85-8b93-1e0326234b75";
      const z = "f78ec762-240c-4262-a0b0-4a1c57b0c5f8";
    },
    "./node_modules/@udemy/performance-rum-client/dist/esm/index.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      const r = "UD-";
      const s = () =>
        window.performance &&
        window.performance.now &&
        window.performance.now();
      const o = () => {
        const e = window.performance;
        if (!s() || s() > 864e5) {
          return false;
        }
        return !!(e && typeof e.getEntriesByType === "function" && e.mark);
      };
      const i = (e) => {
        if (e.transferSize > 0) {
          return false;
        }
        if (e.decodedBodySize > 0) {
          return true;
        }
        return e.duration < 30;
      };
      const a = (e) => {
        if (
          e.encodedBodySize > 0 &&
          e.transferSize > 0 &&
          e.transferSize < e.encodedBodySize
        ) {
          return true;
        }
        return null;
      };
      const c = function (e) {
        return parseFloat((e / 1024).toFixed(2)) || 0;
      };
      function d(e) {
        let t =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : null;
        if (t) {
          return `${r}${e}-${t}`;
        }
        return `${r}${e}`;
      }
      function u(e) {
        if (o()) {
          window.performance.mark(d(e));
          return true;
        }
        return false;
      }
      function l(e) {
        if (o()) {
          window.performance.mark(d(e, "start"));
          return true;
        }
        return false;
      }
      function p(e) {
        if (o()) {
          const t = d(e, "end");
          const n = d(e, "start");
          window.performance.mark(t);
          if (window.performance.getEntriesByName(n).length > 0) {
            const r = d(e);
            window.performance.measure(r, n, t);
          }
          return true;
        }
        return false;
      }
      const m = { end: p, mark: u, start: l };
      var g = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/event-common.js"
      );
      var f = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/tracker.js"
      );
      class h extends g["a"] {
        constructor(e) {
          let { performanceSummary: t } = e;
          super("PerformanceSummaryEvent");
          this.lcp = void 0;
          this.page = void 0;
          this.source = void 0;
          Object.assign(this, t);
          const n = f["a"].firstPageKey || "";
          this.page = { entryKey: n };
        }
        processContext(e) {
          super.processContext(e);
          this.source = e.sourceServiceName;
          const t = f["a"].firstPageKey;
          if (this.clientHeader && t) {
            this.clientHeader.page.key = t;
          }
        }
      }
      const v = (e) => {
        f["a"].addCloseListener(() => {
          const t = e.getSummary();
          f["a"].publishEvent(new h({ performanceSummary: t }));
        }, true);
      };
      const y = (e, t) => {
        try {
          if (PerformanceObserver.supportedEntryTypes.includes(e)) {
            if (e === "first-input" && !("PerformanceEventTiming" in self)) {
              return false;
            }
            const n = new PerformanceObserver((e) => {
              t(e.getEntries());
            });
            n.observe({ type: e, buffered: true });
            return n;
          }
        } catch (e) {
          console.warn("po:", e.message);
        }
        return false;
      };
      function b() {
        return { metrics: { cls: 0, tbt: 0 } };
      }
      function _(e) {
        let t =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : 6e4;
        return e < t ? e : t;
      }
      function j(e, t) {
        let n;
        let r;
        let s = false;
        const o = y("first-input", (s) => {
          const i = s.pop();
          if (i) {
            const t = i.processingStart - i.startTime;
            e("fid", _(t, 5e3));
            e("fidStart", i.startTime);
          }
          o.disconnect();
          e("lcp", t.lcp);
          e("cls", t.cls);
          e("tbt", t.tbt);
          n = setTimeout(() => {
            e("tbt5S", t.tbt);
          }, 5e3);
          r = setTimeout(() => {
            e("tbt10S", t.tbt);
          }, 1e4);
        });
        return () => {
          if (!s) {
            e("tbtFinal", t.tbt);
            clearTimeout(n);
            clearTimeout(r);
            o && o.disconnect();
            s = true;
          }
        };
      }
      function w(e, t, n) {
        let r = false;
        let s = false;
        const o = () => {
          if (!r && s) {
            s.disconnect();
            r = true;
          }
        };
        s = y("paint", (r) => {
          r.forEach((r) => {
            if (r.name === "first-paint") {
              const t = _(r.startTime);
              e("fp", t);
            } else if (r.name === "first-contentful-paint") {
              const s = _(r.startTime);
              t.fcp = s;
              e("fcp", t.fcp);
              n();
              o();
            }
          });
        });
        return o;
      }
      const x = (e, t) => {
        let n = false;
        const r = y("largest-contentful-paint", (n) => {
          const r = n.pop();
          if (r) {
            t.lcp = _(r.startTime);
            e("lcpFinal", t.lcp);
          }
        });
        const s = () => {
          if (!n) {
            if (t.lcp) {
              e("lcp", t.lcp);
            }
            r && r.disconnect();
            n = true;
          }
        };
        ["keydown", "click"].forEach((e) => {
          window.addEventListener(e, s, { once: true, capture: true });
        });
        return s;
      };
      const k = (e, t) => {
        let n = false;
        e("clsFinal", 0);
        const r = y("layout-shift", (n) => {
          const r = n.pop();
          if (r && !r.hadRecentInput && r.value) {
            t.cls += r.value;
            e("clsFinal", t.cls);
          }
        });
        return () => {
          if (!n) {
            r && r.disconnect();
            n = true;
          }
        };
      };
      function O(e, t, n) {
        e.forEach((e) => {
          const r = e.name;
          if (typeof r !== "string") {
            return;
          }
          if (!n[r]) {
            n[r] = true;
            t(e.entryType, {
              name: r,
              startTime: e.startTime,
              duration: typeof e.duration !== "undefined" ? e.duration : null,
            });
          }
        });
      }
      function E(e) {
        let t = false;
        const n = {};
        const r = y("mark", (t) => {
          O(t, e, n);
        });
        const s = y("measure", (t) => {
          O(t, e, n);
        });
        return () => {
          if (!t) {
            r && r.disconnect();
            s && s.disconnect();
            t = true;
          }
        };
      }
      const C = { count: 0, duration: 0, transferSize: 0 };
      function S(e) {
        let t = false;
        const n = { all: { ...C } };
        e("all", n.all);
        const r = y("resource", (t) => {
          t.forEach((t) => {
            const r = t.initiatorType;
            if (!n[r]) {
              n[r] = { ...C };
            }
            n[r].count++;
            n.all.count++;
            n[r].duration += t.duration;
            n.all.duration += t.duration;
            if (t.transferSize) {
              const e = c(t.transferSize);
              n[r].transferSize += e;
              n.all.transferSize += e;
            }
            e(r, n[r]);
            e("all", n.all);
          });
        });
        return () => {
          if (!t) {
            r && r.disconnect();
            t = true;
          }
        };
      }
      const T = (e, t) => {
        let n = false;
        const r = y("longtask", (n) => {
          n.forEach((n) => {
            if (n.name !== "self" || n.startTime < t.fcp) {
              return;
            }
            const r = n.duration - 50;
            if (r > 0) {
              t.tbt += r;
              e("tbtFinal", t.tbt);
            }
          });
        });
        return () => {
          if (!n) {
            r && r.disconnect();
            n = true;
          }
        };
      };
      const I = (e, t, n) => {
        const { metrics: r } = b();
        let o = [];
        E(e);
        o.push(S(t));
        o.push(
          w(n, r, () => {
            o.push(T(n, r));
            r.fcpStart = s();
          })
        );
        o.push(x(n, r));
        o.push(k(n, r));
        o.push(j(n, r));
        return () => {
          if (o) {
            o.forEach((e) => {
              e && e();
            });
            o = false;
            const t = window.UD;
            const n = t && t.performance && t.performance._trackedResources;
            if (n) {
              n.forEach((t) => {
                const n = window.performance
                  .getEntriesByType("resource")
                  .find((e) => e.name.match(t));
                if (n) {
                  const { duration: r, startTime: s } = n;
                  e("measure", {
                    name: t,
                    startTime: s,
                    duration: typeof r !== "undefined" ? r : null,
                  });
                }
              });
            }
            return true;
          }
          return false;
        };
      };
      function P() {
        return window.navigator.deviceMemory;
      }
      function D() {
        return !isNaN(window.navigator.hardwareConcurrency)
          ? Number(window.navigator.hardwareConcurrency)
          : null;
      }
      const A = (e) => parseFloat(e.toFixed(2));
      const N = (e) => {
        if (typeof e !== "number") {
          return null;
        }
        return A(e / Math.pow(1024, 2));
      };
      const R = () => {
        if (D() && D() <= 4) {
          return true;
        }
        if (P() && P() <= 4) {
          return true;
        }
        return false;
      };
      const L = (e, t) => {
        switch (e) {
          case "slow-2g":
            return true;
          case "2g":
            return true;
          case "3g":
            return true;
          default:
            return R() || t;
        }
      };
      function z(e) {
        let t = null;
        let n = null;
        const r = window.navigator && window.navigator.connection;
        if (r && typeof r === "object") {
          t = r.effectiveType;
          n = !!r.saveData;
          e("downlink", r.downlink);
          e("ect", r.effectiveType);
          e("rtt", r.rtt);
          e("saveData", !!r.saveData);
        }
        const s =
          "serviceWorker" in window.navigator
            ? window.navigator.serviceWorker.controller
              ? "controlled"
              : "supported"
            : "unsupported";
        e("deviceMemory", P());
        e("hardwareConcurrency", D());
        e("serviceWorkerStatus", s);
        e("isLowEndDevice", R());
        e("isLowEndExperience", L(t, n));
        if (
          window.navigator.storage &&
          typeof window.navigator.storage.estimate === "function"
        ) {
          window.navigator.storage.estimate().then((t) => {
            e("storageQuota", N(t.quota));
            e("storageUsage", N(t.usage));
          });
        }
        e("url", window.location.href);
      }
      const U = () => {
        if (!o()) {
          return {};
        }
        const e = window.performance;
        const t = e.timing;
        const n = e.getEntriesByType("navigation")[0];
        if (!n) {
          return {};
        }
        const r = {
          decodedBodySize: c(n.decodedBodySize),
          dnsLookupTime: n.domainLookupEnd - n.domainLookupStart,
          domInteractive: n.domInteractive,
          encodedBodySize: c(n.encodedBodySize),
          fetchTime: n.responseEnd - n.fetchStart,
          headerSize: c(n.transferSize - n.encodedBodySize),
          isCacheHit: i(n),
          navigationType: n.type,
          redirectCount: n.redirectCount,
          redirectDuration: n.redirectEnd - n.redirectStart,
          requestDuration: n.responseEnd - n.requestStart,
          responseDuration: n.responseEnd - n.responseStart,
          tcpConnectTime: n.connectEnd - n.connectStart,
          tcpSecureConnectTime: n.connectEnd - n.secureConnectionStart,
          ttfb: n.responseStart - n.requestStart,
          transferSize: c(n.transferSize),
          workerTime: n.workerStart > 0 ? n.responseEnd - n.workerStart : 0,
        };
        if (t.domComplete > 0) {
          r.domCompleteDuration = t.domComplete - t.domLoading;
        }
        if (n.loadEventStart > 0) {
          r.loadEventStart = n.loadEventStart;
        }
        return r;
      };
      function F(e, t, n) {
        let r = false;
        return function () {
          if (!r) {
            r = true;
            setTimeout(() => {
              r = false;
            }, t);
            for (
              var s = arguments.length, o = new Array(s), i = 0;
              i < s;
              i++
            ) {
              o[i] = arguments[i];
            }
            return e.apply(n, ...o);
          }
          return false;
        };
      }
      const M = { idleTimeout: 1e4 };
      class $ {
        constructor() {
          let { idleTimeout: e } =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {};
          this.trackingTimeout = void 0;
          this.idleTimeout = void 0;
          this.startTrackingThrottled = void 0;
          this.currentTime = void 0;
          this.timeElapsed = void 0;
          this.document = void 0;
          this.stopTracking = () => {
            if (this.currentTime === false) {
              return false;
            }
            this.timeElapsed += s() - this.currentTime;
            this.currentTime = false;
            return true;
          };
          this.startTracking = () => {
            if (!this.currentTime) {
              this.currentTime = s();
            }
            clearTimeout(this.trackingTimeout);
            this.trackingTimeout = setTimeout(
              this.stopTracking,
              this.idleTimeout
            );
            return true;
          };
          this.handleVisibilityChange = () => {
            const e = this.document.hidden;
            if (e) {
              return this.stopTracking();
            }
            return this.startTracking();
          };
          this.idleTimeout = e || M.idleTimeout;
          this.startTrackingThrottled = F(this.startTracking, 250, this);
        }
        getTotalTimeOnPage() {
          return s();
        }
        getActiveTimeOnPage() {
          return this.timeElapsed;
        }
        _initialize(e, t) {
          this.timeElapsed = 0;
          this.currentTime = t.hidden ? false : 0;
          this.document = t;
          t.addEventListener("visibilitychange", this.handleVisibilityChange);
          e.addEventListener("blur", this.stopTracking);
          e.addEventListener("focus", this.startTracking);
          t.addEventListener("mousemove", this.startTrackingThrottled);
          t.addEventListener("keyup", this.startTrackingThrottled);
          t.addEventListener("touchstart", this.startTrackingThrottled);
          t.addEventListener("scroll", this.startTrackingThrottled);
        }
        initialize() {
          this._initialize(window, document);
        }
      }
      class B {
        constructor() {
          let {
            forcePerformanceObserverInitialization: e = false,
            isPageCached: t = null,
            isFirstTimeVisitor: n = null,
            osName: r = null,
            deviceType: s = null,
          } = arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {};
          this.finalizeMetrics = null;
          this.isDisconnected = false;
          this.disconnectObservers = () => {};
          this.collectedPerformanceData = void 0;
          this.timeOnPage = void 0;
          this.observationTimeout = null;
          this.logEvent = (e) => {
            var t, n;
            (t = window.udPerformance) === null || t === void 0
              ? void 0
              : (n = t._logs) === null || n === void 0
              ? void 0
              : n.push(e);
          };
          this.safeDisconnectObservers = () => {
            this.disconnectObservers();
            window.clearTimeout(this.observationTimeout);
            window.document.removeEventListener(
              "visibilitychange",
              this.safeDisconnectObservers
            );
            this.isDisconnected = true;
          };
          window.udPerformance = window.udPerformance || {};
          window.udPerformance._logs = [];
          this.collectedPerformanceData = {
            marks: [],
            measures: [],
            resources: {},
          };
          this.collectedPerformanceData.isFirstTimeVisitor = n;
          this.collectedPerformanceData.osName = r;
          this.collectedPerformanceData.deviceType = s;
          this.collectedPerformanceData.isPageCached = t;
          z((e, t) => {
            Object.assign(this.collectedPerformanceData, { [e]: t });
          });
          this.timeOnPage = new $();
          this.timeOnPage.initialize();
          const o = document.visibilityState === "visible";
          if (o || e === true) {
            this.disconnectObservers = this.initializeObservers();
            this.observationTimeout = setTimeout(
              this.safeDisconnectObservers,
              3e4
            );
            window.document.addEventListener(
              "visibilitychange",
              this.safeDisconnectObservers
            );
          }
        }
        initializeObservers() {
          return I(
            (e, t) => {
              let { name: n, startTime: r, duration: s } = t;
              if (e === "mark") {
                this.collectedPerformanceData.marks.push({
                  name: n,
                  startTime: r,
                });
                this.logEvent(`${e}:${n}:${r}`);
              }
              if (e === "measure") {
                this.collectedPerformanceData.measures.push({
                  name: n,
                  startTime: r,
                  duration: s,
                });
                this.logEvent(`${e}:${n}:${r}:${s}`);
              }
            },
            (e, t) => {
              let { count: n, duration: r, transferSize: s } = t;
              Object.assign(this.collectedPerformanceData.resources, {
                [e]: { count: n, duration: r, transferSize: s },
              });
              this.logEvent(`${e}:${n}:${r}:${s}`);
            },
            (e, t) => {
              Object.assign(this.collectedPerformanceData, { [e]: t });
              this.logEvent(`${e}:${t}`);
            }
          );
        }
        getSummary() {
          if (this.observationTimeout) {
            clearTimeout(this.observationTimeout);
            this.observationTimeout = null;
          }
          this.safeDisconnectObservers();
          this.timeOnPage.stopTracking();
          const e = {
            ...this.collectedPerformanceData,
            ...U(),
            timeOnSite: this.timeOnPage.getActiveTimeOnPage(),
            timeOnSiteAbsolute: this.timeOnPage.getTotalTimeOnPage(),
          };
          const t = Object.keys(e.resources).map((t) => ({
            name: t,
            ...e.resources[t],
          }));
          e.resources = t;
          return e;
        }
      }
      function q() {
        let e =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {};
        if (typeof window !== "undefined") {
          window.UD = window.UD || {};
          window.UD.performance = {
            trackResourceTiming: () => false,
            mark: u,
            start: l,
            end: p,
            isPageCached: false,
            ...e,
          };
        }
      }
      n.d(t, "a", function () {
        return V;
      });
      n.d(t, "b", function () {
        return q;
      });
      n.d(t, "c", function () {
        return m;
      });
      let W = false;
      function G() {
        const e = { mark: u, start: l, end: p };
        const t = window.udPerformance;
        window.udPerformance = { push: (t) => t(e) };
        if (t && t.length > 0) {
          for (let e = 0; e < t.length; e++) {
            var n, r;
            ((n = window.udPerformance) === null || n === void 0
              ? void 0
              : (r = n).push.bind(r))(t[e]);
          }
        }
      }
      function H(e) {
        if (document.readyState === "complete") {
          setTimeout(e, 0);
        } else {
          window.addEventListener("pageshow", e);
        }
      }
      function V(e) {
        let {
          isFirstTimeVisitor: t = null,
          isPageCached: n = null,
          osName: r = null,
          deviceType: s = null,
        } = e;
        if (typeof window !== undefined && !W) {
          H(() => {
            const e = new B({
              isFirstTimeVisitor: t,
              isPageCached: n,
              osName: r,
              deviceType: s,
            });
            G();
            v(e);
          });
          W = true;
          return true;
        }
        return false;
      }
    },
    "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/badges.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return o;
        });
        var r = n("./node_modules/react/index.js");
        var s = n.n(r);
        const o = (e) => {
          let { course: t, badges: n, children: r } = e;
          const o = t.badges ? t.badges.map((e) => e.badge_family) : [];
          const i = n === null || n === void 0 ? void 0 : n(o);
          const a = s.a.createElement(
            s.a.Fragment,
            null,
            i && s.a.createElement(i, null),
            r
          );
          return { children: a };
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/details.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return i;
        });
        n.d(t, "a", function () {
          return u;
        });
        var r = n("./node_modules/@udemy/i18n/dist/esm/index.js");
        var s = n("./node_modules/react/index.js");
        var o = n.n(s);
        function i(e, t) {
          let { ninterpolate: n } = t;
          return n("%s lecture", "%s lectures", e);
        }
        const a = (e) => {
          let { numLectures: t } = e;
          const { ninterpolate: n } = Object(r["j"])();
          return o.a.createElement(
            o.a.Fragment,
            null,
            i(t, { ninterpolate: n })
          );
        };
        const c = {
          contentInfo: (e) =>
            e.content_info
              ? o.a.createElement(o.a.Fragment, null, e.content_info)
              : null,
          publishedLectures: (e) =>
            e.num_published_lectures > 0
              ? o.a.createElement(a, { numLectures: e.num_published_lectures })
              : null,
          instructorLevel: (e) =>
            e.instructional_level_simple
              ? o.a.createElement(
                  o.a.Fragment,
                  null,
                  e.instructional_level_simple
                )
              : null,
        };
        const d = (e) => [
          c.contentInfo(e),
          c.publishedLectures(e),
          c.instructorLevel(e),
        ];
        const u = (e) => {
          let { course: t } = e;
          return { metadata: d(t) };
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/image.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return r;
        });
        const r = (e) => {
          let { course: t } = e;
          return {
            srcSmallSquare: t.image_50x50,
            srcSmallSquare2x: t.image_100x100,
            srcDefault: t.image_240x135,
            srcDefault2x: t.image_480x270,
          };
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/instructors.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return r;
        });
        const r = (e) => {
          var t;
          let { course: n } = e;
          return {
            displayNames: ((t = n.visible_instructors) !== null && t !== void 0
              ? t
              : []
            ).map((e) => {
              let { display_name: t } = e;
              return t;
            }),
          };
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/price.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return s;
        });
        n.d(t, "b", function () {
          return o;
        });
        var r = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card.react-component.js"
        );
        function s(e) {
          let { discount: t, price_detail: n } = e;
          const r = n ? parseFloat(n.amount) : 0;
          const s = n ? n.price_string : undefined;
          const o = t ? parseFloat(t.price.amount) : r;
          const i = t ? t.price.price_string : s;
          return {
            discountPrice: o,
            discountPriceString: i,
            listPrice: r,
            listPriceString: s,
          };
        }
        const o = (e) => {
          let {
            course: { price_detail: t, discount: n },
            priceTextProps: o,
          } = e;
          return { ...r["b"], ...s({ discount: n, price_detail: t }), ...o };
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/ratings.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return r;
        });
        const r = (e) => {
          let { course: t, numReviewsText: n } = e;
          return {
            rating: t.rating,
            reviewsCount: t.num_reviews,
            reviewsCountText: n,
          };
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/api-course-card/with-course-card-ub-guard.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return i;
        });
        var r = n("./node_modules/@udemy/ud-data/dist/esm/index.js");
        var s = n("./node_modules/react/index.js");
        var o = n.n(s);
        const i = (e) => {
          var t, n;
          const i =
            (t = (n = e.displayName) !== null && n !== void 0 ? n : e.name) !==
              null && t !== void 0
              ? t
              : "Component";
          return Object.assign(
            Object(s["forwardRef"])((t, n) => {
              let {
                children: s,
                badges: i,
                badgesProps: a,
                price: c,
                priceProps: d,
                ...u
              } = t;
              const { Config: l } = Object(r["h"])();
              const p = !!l.brand.has_organization;
              const m = {
                ...u,
                ...(p
                  ? {}
                  : { badges: i, badgesProps: a, priceProps: d, price: c }),
              };
              return o.a.createElement(e, Object.assign({ ref: n }, m), s);
            }),
            { displayName: `withCourseCardUBGuard(${i})` }
          );
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-badges.module.css":
      function (e, t, n) {
        e.exports = {
          "course-badges": "course-card-badges-module--course-badges--1RKli",
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-badges.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return a;
        });
        var r = n("./node_modules/react/index.js");
        var s = n.n(r);
        var o = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-badges.module.css"
        );
        var i = n.n(o);
        const a = (e) => {
          let { children: t } = e;
          return t
            ? s.a.createElement("div", { className: i.a["course-badges"] }, t)
            : null;
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-details.module.css":
      function (e, t, n) {
        e.exports = {
          "course-meta-info":
            "course-card-details-module--course-meta-info--2Yl_2",
          row: "course-card-details-module--row--3sv2A",
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-details.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return d;
        });
        var r = n("./node_modules/classnames/index.js");
        var s = n.n(r);
        var o = n("./node_modules/react/index.js");
        var i = n.n(o);
        var a = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-details.module.css"
        );
        var c = n.n(a);
        const d = (e) => {
          let { metadata: t = [], children: n } = e;
          const r = t
            .filter((e) => !!e)
            .map((e, t) =>
              i.a.createElement("span", { key: t, className: c.a.row }, e)
            );
          return i.a.createElement(
            "div",
            { className: c.a.row },
            r.length > 0 &&
              i.a.createElement(
                "div",
                {
                  "data-purpose": "course-meta-info",
                  className: s()(
                    c.a.row,
                    c.a["course-meta-info"],
                    "ud-text-xs"
                  ),
                },
                r
              ),
            n
          );
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-image.module.css":
      function (e, t, n) {
        e.exports = { image: "course-card-image-module--image--3V2QD" };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-image.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return l;
        });
        n.d(t, "a", function () {
          return p;
        });
        var r = n(
          "./node_modules/@udemy/react-core-components/dist/esm/image/image.react-component.js"
        );
        var s = n("./node_modules/classnames/index.js");
        var o = n.n(s);
        var i = n("./node_modules/react/index.js");
        var a = n.n(i);
        var c = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-image.module.css"
        );
        var d = n.n(c);
        const u = {
          small: { width: 64, height: 64 },
          medium: { width: 240, height: 135 },
          large: { width: 260, height: 145 },
        };
        const l = Object(i["createContext"])({
          className: undefined,
          size: undefined,
        });
        const p = (e) => {
          var t;
          let {
            size: n,
            className: s = "",
            srcSmallSquare: c,
            srcSmallSquare2x: p,
            srcDefault: m,
            srcDefault2x: g,
            ...f
          } = e;
          const { size: h, className: v } = Object(i["useContext"])(l);
          const y =
            (t = n !== null && n !== void 0 ? n : h) !== null && t !== void 0
              ? t
              : "medium";
          const b = y === "small" ? c : m;
          const _ = y === "small" ? p : g;
          const j = u[y];
          return a.a.createElement(
            r["a"],
            Object.assign(
              {
                src: b,
                alt: "",
                srcSet: `${b} 1x, ${_} 2x`,
                className: o()(d.a.image, v, s),
              },
              j,
              f
            )
          );
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-instructors.module.css":
      function (e, t, n) {
        e.exports = {
          "instructor-list":
            "course-card-instructors-module--instructor-list--37tO6",
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-instructors.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return d;
        });
        n.d(t, "a", function () {
          return u;
        });
        var r = n("./node_modules/@udemy/i18n/dist/esm/index.js");
        var s = n(
          "./node_modules/@udemy/shared-utils/dist/esm/escape/safely-set-inner-html.js"
        );
        var o = n("./node_modules/react/index.js");
        var i = n.n(o);
        var a = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-instructors.module.css"
        );
        var c = n.n(a);
        const d = Object(o["createContext"])({ size: undefined });
        const u = (e) => {
          var t, n;
          let { displayNames: a, ...u } = e;
          const { ngettext: l } = Object(r["j"])();
          const p = Object(o["useContext"])(d);
          const m =
            (t = (n = u.size) !== null && n !== void 0 ? n : p.size) !== null &&
            t !== void 0
              ? t
              : "xsmall";
          return !a.length
            ? null
            : i.a.createElement(
                "div",
                { className: m === "small" ? "ud-text-sm" : "ud-text-xs" },
                i.a.createElement(
                  "span",
                  { className: "ud-sr-only" },
                  l("Instructor:", "Instructors:", a.length)
                ),
                i.a.createElement(
                  "div",
                  Object.assign(
                    { className: c.a["instructor-list"] },
                    Object(s["a"])({
                      descriptionOfCaller: "course-card:visible-instructors",
                      html: a.join(", "),
                    })
                  )
                )
              );
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-price.module.css":
      function (e, t, n) {
        e.exports = {
          container: "course-card-price-module--container--3GGlz",
          "price-text-amount":
            "course-card-price-module--price-text-amount--27uZh",
          "price-text-amount-current":
            "course-card-price-module--price-text-amount-current--1h8Ag",
          "price-text-amount-former":
            "course-card-price-module--price-text-amount-former--2RMsj",
          "layout-vertical": "course-card-price-module--layout-vertical--16Pjq",
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-price.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return u;
        });
        n.d(t, "a", function () {
          return l;
        });
        var r = n("./node_modules/@udemy/i18n/dist/esm/index.js");
        var s = n("./node_modules/classnames/index.js");
        var o = n.n(s);
        var i = n("./node_modules/react/index.js");
        var a = n.n(i);
        var c = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-price.module.css"
        );
        var d = n.n(c);
        const u = Object(i["createContext"])({ layoutDirection: undefined });
        const l = (e) => {
          let {
            priceText: t,
            children: n,
            formerPriceText: s,
            layoutDirection: c,
          } = e;
          const { gettext: l } = Object(r["j"])();
          const { layoutDirection: p } = Object(i["useContext"])(u);
          const m = (c !== null && c !== void 0 ? c : p) === "vertical";
          return a.a.createElement(
            "div",
            { className: o()(d.a.container, { [d.a["layout-vertical"]]: m }) },
            t &&
              a.a.createElement(
                "div",
                {
                  className: o()(
                    "ud-heading-md",
                    d.a["price-text-amount"],
                    d.a["price-text-amount-current"]
                  ),
                },
                a.a.createElement(
                  "span",
                  { className: "ud-sr-only" },
                  l("Current Price")
                ),
                a.a.createElement("strong", null, t)
              ),
            s &&
              a.a.createElement(
                "div",
                {
                  className: o()(
                    "ud-text-sm",
                    d.a["price-text-amount"],
                    d.a["price-text-amount-former"]
                  ),
                },
                a.a.createElement(
                  "span",
                  { className: "ud-sr-only" },
                  l("Original Price")
                ),
                a.a.createElement("s", null, s)
              ),
            n
          );
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-ratings.module.css":
      function (e, t, n) {
        e.exports = {
          row: "course-card-ratings-module--row--1EHHW",
          "reviews-text": "course-card-ratings-module--reviews-text--1z047",
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-ratings.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return p;
        });
        var r = n("./node_modules/@udemy/i18n/dist/esm/index.js");
        var s = n(
          "./node_modules/@udemy/react-merchandising-components/dist/esm/star-rating/star-rating.react-component.js"
        );
        var o = n("./node_modules/classnames/index.js");
        var i = n.n(o);
        var a = n("./node_modules/react/index.js");
        var c = n.n(a);
        var d = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-ratings.module.css"
        );
        var u = n.n(d);
        function l(e, t) {
          let { ninterpolate: n } = t;
          return n("%(count)s review", "%(count)s reviews", e, { count: e });
        }
        const p = (e) => {
          let {
            reviewsCountText: t,
            reviewsCount: n,
            rating: o,
            children: a,
          } = e;
          const { ninterpolate: d } = Object(r["j"])();
          const { formatNumber: p } = Object(r["h"])();
          if (!o && !a) {
            return null;
          }
          const m = t || p(n);
          return c.a.createElement(
            "div",
            { className: u.a.row },
            !!o &&
              c.a.createElement(
                c.a.Fragment,
                null,
                c.a.createElement(s["a"], { showNumber: true, rating: o }),
                c.a.createElement(
                  "span",
                  {
                    "aria-label": l(n, { ninterpolate: d }),
                    className: i()("ud-text-xs", u.a["reviews-text"]),
                  },
                  `(${m})`
                )
              ),
            a
          );
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-title.module.css":
      function (e, t, n) {
        e.exports = {
          title: "course-card-title-module--title--2C6ac",
          "course-title": "course-card-title-module--course-title--3k0w_",
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-title.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return d;
        });
        n.d(t, "a", function () {
          return u;
        });
        var r = n("./node_modules/classnames/index.js");
        var s = n.n(r);
        var o = n("./node_modules/react/index.js");
        var i = n.n(o);
        var a = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-title.module.css"
        );
        var c = n.n(a);
        const d = Object(o["createContext"])({ size: undefined });
        const u = (e) => {
          var t, n;
          let { className: r, url: a, title: u, children: l, ...p } = e;
          const { size: m } = Object(o["useContext"])(d);
          const g =
            (t = (n = p.size) !== null && n !== void 0 ? n : m) !== null &&
            t !== void 0
              ? t
              : "medium";
          let f;
          if (l) {
            f = l;
          } else if (u) {
            f = a
              ? i.a.createElement("a", { href: a }, u)
              : i.a.createElement("span", null, u);
          }
          return i.a.createElement(
            "div",
            { className: c.a.title },
            i.a.createElement(
              "h3",
              {
                "data-purpose": "course-title-url",
                className: s()(
                  r,
                  g === "small" ? "ud-heading-sm" : "ud-heading-md",
                  c.a["course-title"]
                ),
              },
              f
            )
          );
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card.module.css":
      function (e, t, n) {
        e.exports = {
          container: "course-card-module--container--2MTsr",
          "main-content": "course-card-module--main-content--3Uvsz",
          fixed: "course-card-module--fixed--1xYdB",
          "image-container": "course-card-module--image-container--20x0M",
          "badges-container": "course-card-module--badges-container--2ENVp",
          small: "course-card-module--small--1FtxK",
          large: "course-card-module--large--1Utxc",
          medium: "course-card-module--medium--3qi9R",
          "course-headline": "course-card-module--course-headline--15Esr",
          "price-text-container":
            "course-card-module--price-text-container--2oBPb",
          "price-text-base-price-text-component":
            "course-card-module--price-text-base-price-text-component--sHBbm",
          "price-text-base-price-text-component-discount-price":
            "course-card-module--price-text-base-price-text-component-discount-price--2VEcP",
          "price-text-base-price-text-component-list-price":
            "course-card-module--price-text-base-price-text-component-list-price--1OaBj",
          "has-price-text": "course-card-module--has-price-text--3EF7y",
          "course-image": "course-card-module--course-image--2Pg51",
          "large-grid": "course-card-module--large-grid--2B_Zo",
          "large-grid-9-columns":
            "course-card-module--large-grid-9-columns--Z7BGQ",
          "large-grid-12-columns":
            "course-card-module--large-grid-12-columns--1DWTw",
        };
      },
    "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return b;
        });
        n.d(t, "a", function () {
          return w;
        });
        var r = n(
          "./node_modules/@udemy/hooks/dist/esm/use-match-media/index.js"
        );
        var s = n(
          "./node_modules/@udemy/shared-utils/dist/esm/escape/safely-set-inner-html.js"
        );
        var o = n(
          "./node_modules/@udemy/styles/dist/esm/tokens/generated/index.js"
        );
        var i = n("./node_modules/classnames/index.js");
        var a = n.n(i);
        var c = n("./node_modules/react/index.js");
        var d = n.n(c);
        var u = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-badges.react-component.js"
        );
        var l = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-details.react-component.js"
        );
        var p = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-image.react-component.js"
        );
        var m = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-instructors.react-component.js"
        );
        var g = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-price.react-component.js"
        );
        var f = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-ratings.react-component.js"
        );
        var h = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card-title.react-component.js"
        );
        var v = n(
          "./node_modules/@udemy/react-card-components/dist/esm/course-card/course-card.module.css"
        );
        var y = n.n(v);
        const b = {
          className: y.a["price-text-base-price-text-component"],
          listPriceClassName:
            y.a["price-text-base-price-text-component-list-price"],
          discountPriceClassName:
            y.a["price-text-base-price-text-component-discount-price"],
        };
        const _ = (e) => {
          switch (e) {
            case "large-grid-12-columns":
            case "large-grid-9-columns":
              return a()(y.a["large-grid"], y.a[e]);
          }
          return y.a[e];
        };
        const j = (e) => {
          switch (e) {
            case "large-grid-12-columns":
            case "large-grid-9-columns":
              return "large";
          }
          return e;
        };
        const w = Object.assign(
          d.a.forwardRef((e, t) => {
            let {
              badges: n,
              badgesProps: i,
              children: c,
              details: v,
              detailsProps: b,
              headline: w,
              image: x,
              imageProps: k,
              instructors: O,
              instructorsProps: E,
              price: C,
              priceProps: S,
              ratings: T,
              ratingsProps: I,
              title: P,
              titleProps: D,
              showDetails: A = true,
              size: N = "medium",
              width: R = "flexible",
              ...L
            } = e;
            const z = o["a"]["layout-12-column-page-12-columns-min"];
            const U = Object(r["a"])("sm-min");
            const F = Object(r["a"])(`(min-width: ${z})`);
            const M =
              (N === "large" && U) ||
              ((N === "large-grid-12-columns" ||
                N === "large-grid-9-columns") &&
                F);
            const $ = M ? "vertical" : "horizontal";
            const B = C || (S && d.a.createElement(g["a"], S));
            const q = !!B;
            return d.a.createElement(
              "div",
              Object.assign({}, L, {
                "data-purpose": "container",
                className: a()(L.className, y.a.container, _(N), {
                  [y.a.fixed]: R === "fixed",
                }),
                ref: t,
              }),
              d.a.createElement(
                "div",
                { className: y.a["image-container"] },
                d.a.createElement(
                  p["b"].Provider,
                  { value: { size: j(N), className: y.a["course-image"] } },
                  x || (k && d.a.createElement(p["a"], k))
                )
              ),
              d.a.createElement(
                "div",
                {
                  className: a()(y.a["main-content"], {
                    [y.a["has-price-text"]]: q,
                  }),
                },
                d.a.createElement(
                  "div",
                  { className: y.a["title-container"] },
                  d.a.createElement(
                    h["b"].Provider,
                    { value: { size: N === "small" ? "small" : "medium" } },
                    P || (D && d.a.createElement(h["a"], D))
                  )
                ),
                A &&
                  N === "large" &&
                  w &&
                  d.a.createElement(
                    "p",
                    Object.assign(
                      { className: a()("ud-text-sm", y.a["course-headline"]) },
                      Object(s["a"])({
                        descriptionOfCaller: "course-card:course-headline",
                        html: w,
                      })
                    )
                  ),
                O || (E && d.a.createElement(m["a"], E)),
                T || (I && d.a.createElement(f["a"], I)),
                A && (v || (b && d.a.createElement(l["a"], b))),
                d.a.createElement(
                  "div",
                  { className: y.a["price-text-container"] },
                  d.a.createElement(
                    g["b"].Provider,
                    { value: { layoutDirection: $ } },
                    B
                  )
                ),
                d.a.createElement(
                  "div",
                  { className: y.a["badges-container"] },
                  n || (i && d.a.createElement(u["a"], i))
                ),
                c
              )
            );
          }),
          {
            Badges: u["a"],
            Details: l["a"],
            Image: p["a"],
            Instructors: m["a"],
            Price: g["a"],
            Ratings: f["a"],
            Title: h["a"],
          }
        );
      },
    "./node_modules/@udemy/react-checked-state-components/dist/esm/checked-state/checked-state-checkbox.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return i;
        });
        var r = n("./node_modules/react/index.js");
        var s = n.n(r);
        var o = n(
          "./node_modules/@udemy/react-checked-state-components/dist/esm/checked-state/checked-state.react-component.js"
        );
        const i = (e) => {
          let {
            closeOnEscape: t = false,
            checked: n = null,
            defaultChecked: i = false,
            checkedStateComponent: a = o["a"],
            ...c
          } = e;
          const [d, u] = Object(r["useState"])(i);
          const l = (e) => {
            var t;
            e.target.dataset.checked = e.target.dataset.checked
              ? ""
              : "checked";
            u(!!e.target.dataset.checked);
            (t = c.onChange) === null || t === void 0 ? void 0 : t.call(c, e);
          };
          const p = (e) => {
            if (e.dataset.checked) {
              var t;
              e.dataset.checked = "";
              u(false);
              (t = c.onChange) === null || t === void 0
                ? void 0
                : t.call(c, { target: e }, "KEYBOARD");
            }
          };
          const m = n !== null ? n : d;
          return s.a.createElement(
            a,
            Object.assign({}, c, {
              "data-type": "checkbox",
              "data-checked": m ? "checked" : "",
              onChange: l,
              onEscape: t ? p : undefined,
            })
          );
        };
      },
    "./node_modules/@udemy/react-checked-state-components/dist/esm/checked-state/checked-state.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return i;
        });
        n.d(t, "b", function () {
          return a;
        });
        var r = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/keyboard/keys.js"
        );
        var s = n("./node_modules/react/index.js");
        var o = n.n(s);
        class i extends o.a.Component {
          constructor() {
            super(...arguments);
            this.ref = o.a.createRef();
            this.onKeyDown = (e) => {
              const t = e.which || e.keyCode;
              if (t === r["b"].ESCAPE && this.ref.current) {
                var n, s;
                (n = (s = this.props).onEscape) === null || n === void 0
                  ? void 0
                  : n.call(s, this.ref.current);
              }
            };
          }
          componentDidMount() {
            var e;
            document.addEventListener("keydown", this.onKeyDown);
            (e = this.ref.current) === null || e === void 0
              ? void 0
              : e.addEventListener("csstoggle", this.props.onChange);
          }
          componentWillUnmount() {
            var e;
            document.removeEventListener("keydown", this.onKeyDown);
            (e = this.ref.current) === null || e === void 0
              ? void 0
              : e.removeEventListener("csstoggle", this.props.onChange);
          }
          render() {
            const { onChange: e, onEscape: t, ...n } = this.props;
            return o.a.createElement(
              "span",
              Object.assign({}, n, {
                ref: this.ref,
                style: { display: "none" },
              })
            );
          }
        }
        function a(e) {
          return e.target.dataset.checked === "checked";
        }
      },
    "./node_modules/@udemy/react-core-components/dist/esm/avatar/avatar.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-core-components/dist/esm/avatar/avatar.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return p;
        });
        n.d(t, "a", function () {
          return m;
        });
        var r = n("./node_modules/core-js-pure/stable/instance/includes.js");
        var s = n.n(r);
        var o = n("./node_modules/@udemy/styles/dist/esm/tokens/index.js");
        var i = n("./node_modules/classnames/index.js");
        var a = n.n(i);
        var c = n("./node_modules/react/index.js");
        var d = n.n(c);
        var u = n(
          "./node_modules/@udemy/react-core-components/dist/esm/image/image.react-component.js"
        );
        const l = {
          small: [
            32,
            `${Object(o["c"])(32)}rem`,
            "ud-heading-sm",
            "ud-heading-sm",
          ],
          medium: [
            48,
            `${Object(o["c"])(48)}rem`,
            "ud-heading-md",
            "ud-heading-md",
          ],
          large: [
            64,
            `${Object(o["c"])(64)}rem`,
            "ud-heading-xl",
            "ud-heading-xl",
          ],
        };
        const p = "image_75x75";
        const m = (e) => {
          var t, n;
          let {
            size: r = "large",
            lazy: o,
            alt: i,
            srcKey: c = p,
            className: m,
            ...g
          } = e;
          const [f, h, v, y] = l[r];
          const b = { width: h, height: h };
          if ("icon" in g) {
            return d.a.createElement(
              "div",
              { style: b, className: a()(m, "ud-avatar", y) },
              d.a.cloneElement(g.icon, { size: r })
            );
          }
          const { user: _, ...j } = g;
          const w = (t = _[c]) !== null && t !== void 0 ? t : "";
          const x =
            i === "DISPLAY_NAME"
              ? (n = _.display_name) !== null && n !== void 0
                ? n
                : ""
              : "";
          if (
            s()(w).call(w, "anonymous") &&
            _ !== null &&
            _ !== void 0 &&
            _.initials
          ) {
            return d.a.createElement(
              "div",
              Object.assign({}, j, {
                "aria-label": x || undefined,
                "aria-hidden": x ? undefined : true,
                style: b,
                className: a()(m, "ud-avatar", v),
                "data-purpose": "display-initials",
              }),
              _.initials
            );
          }
          let k;
          if (o !== undefined) {
            k = o ? "lazy" : "eager";
          }
          return d.a.createElement(
            u["a"],
            Object.assign({}, j, {
              src: w,
              alt: x,
              className: a()(m, "ud-avatar", "ud-avatar-image"),
              width: f,
              height: f,
              style: b,
              loading: k,
            })
          );
        };
      },
    "./node_modules/@udemy/react-core-components/dist/esm/base-icon/base-icon.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return d;
        });
        n.d(t, "a", function () {
          return m;
        });
        var r = n("./node_modules/core-js-pure/stable/instance/includes.js");
        var s = n.n(r);
        var o = n("./node_modules/classnames/index.js");
        var i = n.n(o);
        var a = n("./node_modules/react/index.js");
        var c = n.n(a);
        const d = (e) => {
          var t;
          const n = ["Icon", "BaseIcon"];
          return s()(n).call(
            n,
            e === null || e === void 0
              ? void 0
              : (t = e.type) === null || t === void 0
              ? void 0
              : t.displayName
          );
        };
        const u = "BaseIcon";
        const l = "BaseIcon";
        const p = (e) => {
          let {
            color: t = "neutral",
            size: n = "small",
            label: r,
            glyph: s,
            className: o,
            ...a
          } = e;
          const d = t === "inherit" ? null : `ud-icon-color-${t}`;
          return c.a.createElement(
            "svg",
            Object.assign(
              {
                "aria-hidden": r === false ? true : undefined,
                "aria-label": r === false ? undefined : r,
                role: r === false ? undefined : "img",
                focusable: "false",
              },
              a,
              { className: i()("ud-icon", `ud-icon-${n}`, d, o) }
            ),
            c.a.createElement("use", { xlinkHref: `#icon-${s}` })
          );
        };
        const m = Object.assign(p, { displayName: u, $$udType: l });
      },
    "./node_modules/@udemy/react-core-components/dist/esm/base-icon/icon.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-core-components/dist/esm/block-list/block-list.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-core-components/dist/esm/block-list/block-list.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return d;
        });
        n.d(t, "b", function () {
          return l;
        });
        var r = n("./node_modules/classnames/index.js");
        var s = n.n(r);
        var o = n("./node_modules/react/index.js");
        var i = n.n(o);
        var a = n(
          "./node_modules/@udemy/react-core-components/dist/esm/button/button.react-component.js"
        );
        const c = Object(o["createContext"])({
          iconAlignment: "",
          padding: "",
          size: "",
        });
        const d = (e) => {
          let {
            size: t,
            padding: n = "normal",
            iconAlignment: r = "left",
            children: o,
            renderListItem: a = (e) =>
              e ? i.a.createElement("li", null, e) : null,
            ...d
          } = e;
          const u = i.a.Children.map(o, a);
          if (!u || u.length === 0) {
            return null;
          }
          return i.a.createElement(
            c.Provider,
            { value: { iconAlignment: r, padding: n, size: t } },
            i.a.createElement(
              "ul",
              Object.assign({}, d, {
                className: s()("ud-unstyled-list ud-block-list", d.className),
              }),
              u
            )
          );
        };
        const u = (e, t) =>
          i.a.cloneElement(e, {
            className: s()(e.props.className, "ud-block-list-item-icon"),
            size: t === "large" ? "small" : "xsmall",
          });
        const l = Object.assign(
          i.a.forwardRef((e, t) => {
            let {
              icon: n,
              color: r,
              componentClass: d,
              children: l,
              loading: p = false,
              ...m
            } = e;
            const g = Object(o["useContext"])(c);
            const { iconAlignment: f, padding: h, size: v } = g;
            const y = n && f === "left" ? u(n, v) : null;
            const b = n && f === "right" ? u(n, v) : null;
            const _ = i.a.createElement(
              "div",
              {
                className: s()("ud-block-list-item-content", {
                  "ud-block-list-item-content-loading": p,
                }),
              },
              p ? " " : l
            );
            const j =
              r !== null && r !== void 0 ? r : m.href ? "link" : "neutral";
            const w = v === "large" ? "ud-text-md" : "ud-text-sm";
            const x = p
              ? "div"
              : m.href
              ? "a"
              : d !== null && d !== void 0
              ? d
              : "div";
            const k = s()(
              m.className,
              "ud-block-list-item",
              `ud-block-list-item-${v}`,
              h !== "normal" ? `ud-block-list-item-${h}` : "",
              `ud-block-list-item-${j}`
            );
            if (x === "div") {
              return i.a.createElement(
                "div",
                Object.assign({ ref: t }, m, { className: s()(k, w) }),
                y,
                _,
                b
              );
            }
            if (x === "a" || x === "button") {
              const e = { componentClass: x, typography: w, udStyle: "ghost" };
              return i.a.createElement(
                a["a"],
                Object.assign({ ref: t }, m, { className: k }, e),
                y,
                _,
                b
              );
            }
            const O = x;
            return i.a.createElement(
              O,
              Object.assign({ ref: t }, m, { className: k }),
              y,
              _,
              b
            );
          }),
          { displayName: "BlockListItem" }
        );
        d.Item = l;
      },
    "./node_modules/@udemy/react-core-components/dist/esm/button/button.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-core-components/dist/esm/button/button.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "c", function () {
          return l;
        });
        n.d(t, "b", function () {
          return p;
        });
        n.d(t, "a", function () {
          return m;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/lodashy/noop.js"
        );
        var s = n("./node_modules/classnames/index.js");
        var o = n.n(s);
        var i = n("./node_modules/react/index.js");
        var a = n.n(i);
        var c = n("./node_modules/react-dom/index.js");
        var d = n.n(c);
        var u = n(
          "./node_modules/@udemy/react-core-components/dist/esm/base-icon/base-icon.react-component.js"
        );
        const l = [
          "primary",
          "secondary",
          "ghost",
          "white-solid",
          "white-outline",
          "brand",
          "link",
          "link-underline",
        ];
        const p = ["xsmall", "small", "medium", "large"];
        class m extends a.a.Component {
          constructor() {
            super(...arguments);
            this.handleCssToggleClick = (e) => {
              var t;
              const n = document.getElementById(
                (t = this.props.cssToggleId) !== null && t !== void 0 ? t : ""
              );
              n === null || n === void 0
                ? void 0
                : n.dispatchEvent(new Event("csstoggle"));
              if (this.props.onClick) {
                this.props.onClick(e);
              }
            };
          }
          componentDidMount() {
            if (this.props.cssToggleId) {
              const e = d.a.findDOMNode(this);
              const t = window.handleCSSToggleButtonClick;
              if (e && t) {
                e.removeEventListener("click", t);
              }
            }
          }
          render() {
            const {
              componentClass: e,
              cssToggleId: t,
              round: n,
              size: s,
              typography: i,
              udStyle: c,
              ...d
            } = this.props;
            const l = { onTouchStart: r["a"], type: "button" };
            const p = {};
            if (t) {
              p["data-css-toggle-id"] = t;
              p.onClick = this.handleCssToggleClick;
            }
            if (d.disabled) {
              p.onClick = p.href = undefined;
              p.tabIndex = -1;
            }
            if (e !== "button") {
              l["aria-disabled"] = d.disabled;
              p.disabled = undefined;
              p.type = undefined;
            }
            const m = { ...l, ...d, ...p };
            const g = a.a.Children.map(this.props.children, (e) => {
              if (typeof e === "string") {
                return a.a.createElement("span", null, e);
              } else if (Object(u["b"])(e)) {
                const t = e;
                const n = {};
                if (t && t.props.size === undefined) {
                  n.size = s === "large" ? "small" : "xsmall";
                }
                if (this.props["aria-label"]) {
                  n.label = false;
                }
                if (t.props.color === undefined) {
                  n.color = "inherit";
                }
                return a.a.cloneElement(t, n);
              }
              return e;
            });
            const f = e;
            return a.a.createElement(
              f,
              Object.assign({}, m, {
                className: o()(
                  "ud-btn",
                  `ud-btn-${s}`,
                  `ud-btn-${c}`,
                  n ? "ud-btn-round" : null,
                  n && s === "xsmall" ? "ud-btn-round-xsmall" : null,
                  i !== null && i !== void 0
                    ? i
                    : s === "large"
                    ? "ud-heading-md"
                    : "ud-heading-sm",
                  m.disabled || m["aria-disabled"] ? "ud-btn-disabled" : null,
                  m.className
                ),
              }),
              g
            );
          }
        }
        m.defaultProps = {
          componentClass: "button",
          cssToggleId: null,
          onClick: null,
          round: false,
          size: "large",
          udStyle: "primary",
          typography: null,
        };
      },
    "./node_modules/@udemy/react-core-components/dist/esm/icon-button/icon-button.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-core-components/dist/esm/icon-button/icon-button.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return c;
        });
        var r = n("./node_modules/classnames/index.js");
        var s = n.n(r);
        var o = n("./node_modules/react/index.js");
        var i = n.n(o);
        var a = n(
          "./node_modules/@udemy/react-core-components/dist/esm/button/button.react-component.js"
        );
        const c = Object.assign(
          Object(o["forwardRef"])((e, t) => {
            let { overlaychildren: n, size: r = "large", ...o } = e;
            const c = i.a.Children.only(o.children);
            const d = {};
            if (c && c.props.size === undefined) {
              const e = {
                xsmall: "xsmall",
                small: "small",
                medium: "small",
                large: "medium",
              };
              d.size = e[r];
            }
            return i.a.createElement(
              a["a"],
              Object.assign({}, o, {
                ref: t,
                size: r,
                className: s()(
                  "ud-btn-icon",
                  `ud-btn-icon-${r}`,
                  o.round ? "ud-btn-icon-round" : null,
                  o.className
                ),
              }),
              i.a.cloneElement(c, d),
              n
            );
          }),
          { displayName: "IconButton" }
        );
      },
    "./node_modules/@udemy/react-core-components/dist/esm/image/image.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return c;
        });
        var r = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/viewport/above-the-fold.js"
        );
        var s = n("./node_modules/react/index.js");
        var o = n.n(s);
        var i, a;
        let c =
          Object(r["b"])(
            (i =
              ((a = class e extends o.a.Component {
                constructor() {
                  super(...arguments);
                  this.loadingAttribute = () => {
                    if (this.props.loading) {
                      return this.props.loading;
                    }
                    if (this.props.lazy !== undefined) {
                      return this.props.lazy ? "lazy" : "eager";
                    }
                    return this.props.isAboveTheFold ? "eager" : "lazy";
                  };
                }
                render() {
                  const {
                    isAboveTheFold: e,
                    lazy: t,
                    loading: n,
                    ...r
                  } = this.props;
                  const s = {
                    ...r,
                    loading: this.loadingAttribute(),
                    height:
                      this.props.height === "unset"
                        ? undefined
                        : this.props.height,
                    width:
                      this.props.width === "unset"
                        ? undefined
                        : this.props.width,
                  };
                  return o.a.createElement("img", s);
                }
              }),
              (a.defaultProps = { isAboveTheFold: false }),
              a))
          ) || i;
      },
    "./node_modules/@udemy/react-core-components/dist/esm/index.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.r(t);
      var r = n(
        "./node_modules/@udemy/react-core-components/dist/esm/avatar/avatar.react-component.js"
      );
      var s = n(
        "./node_modules/@udemy/react-core-components/dist/esm/base-icon/base-icon.react-component.js"
      );
      var o = n(
        "./node_modules/@udemy/react-core-components/dist/esm/block-list/block-list.react-component.js"
      );
      var i = n(
        "./node_modules/@udemy/react-core-components/dist/esm/button/button.react-component.js"
      );
      var a = n("./node_modules/react/index.js");
      var c = n.n(a);
      function d(e) {
        const t = (t) => {
          let { ...n } = t;
          return c.a.createElement(s["a"], Object.assign({}, n, { glyph: e }));
        };
        t.displayName = "Icon";
        t.$$udType = "Icon";
        return t;
      }
      var u = n(
        "./node_modules/@udemy/react-core-components/dist/esm/icon-button/icon-button.react-component.js"
      );
      var l = n(
        "./node_modules/@udemy/react-core-components/dist/esm/image/image.react-component.js"
      );
      var p = n(
        "./node_modules/@udemy/react-core-components/dist/esm/picture/picture.react-component.js"
      );
      var m = n(
        "./node_modules/@udemy/react-core-components/dist/esm/router-link/router-link.react-component.js"
      );
      n.d(t, "Avatar", function () {
        return r["a"];
      });
      n.d(t, "DEFAULT_SRC_KEY", function () {
        return r["b"];
      });
      n.d(t, "BaseIcon", function () {
        return s["a"];
      });
      n.d(t, "isIcon", function () {
        return s["b"];
      });
      n.d(t, "BlockList", function () {
        return o["a"];
      });
      n.d(t, "BlockListItem", function () {
        return o["b"];
      });
      n.d(t, "Button", function () {
        return i["a"];
      });
      n.d(t, "ButtonSize", function () {
        return i["b"];
      });
      n.d(t, "ButtonStyle", function () {
        return i["c"];
      });
      n.d(t, "createIcon", function () {
        return d;
      });
      n.d(t, "IconButton", function () {
        return u["a"];
      });
      n.d(t, "Image", function () {
        return l["a"];
      });
      n.d(t, "Link", function () {
        return m["a"];
      });
      n.d(t, "Picture", function () {
        return p["a"];
      });
    },
    "./node_modules/@udemy/react-core-components/dist/esm/picture/picture.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return i;
        });
        var r = n("./node_modules/react/index.js");
        var s = n.n(r);
        var o = n(
          "./node_modules/@udemy/react-core-components/dist/esm/image/image.react-component.js"
        );
        const i = (e) => {
          const { sources: t, className: n, imgClassName: r, ...i } = e;
          return s.a.createElement(
            "picture",
            { className: n },
            e.sources.map((e, t) => {
              let { ...n } = e;
              return s.a.createElement("source", Object.assign({ key: t }, n));
            }),
            s.a.createElement(o["a"], Object.assign({ className: r }, i))
          );
        };
      },
    "./node_modules/@udemy/react-core-components/dist/esm/router-link/router-link.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return c;
        });
        var r = n("./node_modules/history/esm/history.js");
        var s = n("./node_modules/react/index.js");
        var o = n.n(s);
        var i = n("./node_modules/react-router/esm/react-router.js");
        var a = n("./node_modules/react-router-dom/esm/react-router-dom.js");
        const c = (e) => {
          let { disableRouter: t = false, ...n } = e;
          return o.a.createElement(i["g"].Consumer, null, (e) => {
            if (e && !t) {
              return o.a.createElement(a["a"], n);
            }
            const { component: s, innerRef: i, replace: c, to: d, ...u } = n;
            const l = typeof d === "string" ? d : Object(r["e"])(d);
            return o.a.createElement(
              "a",
              Object.assign({}, u, { href: l, ref: i })
            );
          });
        };
      },
    "./node_modules/@udemy/react-dialog-components/dist/esm/focus-trapping-dialog/focus-trapping-dialog.react-component.js":
      function (e, t, n) {
        "use strict";
        var r = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/ios/lock-page-scroll.js"
        );
        var s = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/keyboard/force-tab-order.js"
        );
        var o = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/keyboard/find-focusables.js"
        );
        var i = n(
          "./node_modules/@udemy/shared-utils/dist/esm/lodashy/noop.js"
        );
        var a = n("./node_modules/classnames/index.js");
        var c = n.n(a);
        var d = n("./node_modules/mobx-react/dist/mobx-react.module.js");
        var u = n("./node_modules/react/index.js");
        var l = n.n(u);
        const p = new Set(["script", "svg"]);
        function m(e, t) {
          e.setAttribute("aria-modal", t.toString());
          const n = [];
          let r = e;
          while (r.parentNode && r !== document.body) {
            n.unshift(r.parentNode);
            r = r.parentNode;
          }
          for (let i = 0; i < n.length; i++) {
            r = n[i];
            const a = n[i + 1];
            for (let n = 0; n < r.children.length; n++) {
              const i = r.children[n];
              if (i !== a && i !== e && !p.has(i.tagName.toLowerCase())) {
                if (t) {
                  if (!i.hasAttribute("data-was-aria-hidden")) {
                    var s;
                    i.setAttribute(
                      "data-was-aria-hidden",
                      (s = i.getAttribute("aria-hidden")) !== null &&
                        s !== void 0
                        ? s
                        : "false"
                    );
                  }
                  i.setAttribute("aria-hidden", "true");
                } else {
                  var o;
                  i.setAttribute(
                    "aria-hidden",
                    (o = i.getAttribute("data-was-aria-hidden")) !== null &&
                      o !== void 0
                      ? o
                      : "false"
                  );
                  i.removeAttribute("data-was-aria-hidden");
                }
              }
            }
          }
        }
        n.d(t, "a", function () {
          return v;
        });
        var g, f, h;
        let v =
          ((g = Object(d["e"])((e) => {
            let { focusTrappingDialogProps: t } = e;
            return { focusTrappingDialogProps: t };
          })),
          g(
            (f =
              ((h = class e extends l.a.Component {
                constructor(e) {
                  var t;
                  super(e);
                  t = this;
                  this.ref = void 0;
                  this.scrollableContainer = void 0;
                  this.disposeForceTabOrder = void 0;
                  this.triggerNode = void 0;
                  this.findDialogFocusable = () => {
                    var e;
                    return (e = this.ref) === null || e === void 0
                      ? void 0
                      : e.current;
                  };
                  this.findFirstFocusable = () =>
                    this.findElement("findFirstFocusable", 0);
                  this.findLastFocusable = () =>
                    this.findElement("findLastFocusable", -1);
                  this.findNodeToFocusOn = () =>
                    this.findElement("findNodeToFocusOn", -1);
                  this.onToggle = function (e) {
                    var n;
                    let s =
                      arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : null;
                    if (e) {
                      var o, i, a, c;
                      t.scrollableContainer =
                        s !== null && s !== void 0
                          ? s
                          : (o = t.ref) === null || o === void 0
                          ? void 0
                          : o.current;
                      if (t.scrollableContainer) {
                        Object(r["b"])(t.scrollableContainer);
                      }
                      const e =
                        (i = t.props.focusTrappingDialogProps) === null ||
                        i === void 0
                          ? void 0
                          : i.findTriggerNode;
                      t.triggerNode = e ? e() : document.activeElement;
                      (a = t.ref) === null || a === void 0
                        ? void 0
                        : (c = a.current) === null || c === void 0
                        ? void 0
                        : c.focus();
                      setTimeout(() => {
                        var e;
                        if ((e = t.ref) !== null && e !== void 0 && e.current) {
                          const e = t.ref.current.querySelector(
                            "[data-dialog-auto-focus]"
                          );
                          e === null || e === void 0 ? void 0 : e.focus();
                        }
                      }, 0);
                    } else {
                      var d;
                      if (t.scrollableContainer) {
                        Object(r["c"])(t.scrollableContainer);
                      }
                      (d = t.triggerNode) === null || d === void 0
                        ? void 0
                        : d.focus();
                    }
                    m(
                      (n = t.ref) === null || n === void 0 ? void 0 : n.current,
                      e
                    );
                  };
                  this.ref = l.a.createRef();
                  this.scrollableContainer = null;
                  this.disposeForceTabOrder = i["a"];
                  this.triggerNode = null;
                }
                componentDidMount() {
                  this.disposeForceTabOrder = Object(s["a"])([
                    [this.findDialogFocusable, this.findNodeToFocusOn],
                    [this.findLastFocusable, this.findDialogFocusable],
                    [this.findLastFocusable, this.findFirstFocusable],
                  ]);
                }
                componentWillUnmount() {
                  var e;
                  if (this.scrollableContainer) {
                    Object(r["c"])(this.scrollableContainer);
                  }
                  this.scrollableContainer = null;
                  (e = this.disposeForceTabOrder) === null || e === void 0
                    ? void 0
                    : e.call(this);
                  this.triggerNode = null;
                }
                defaultFindFocusableAtIndex(e, t) {
                  const n = Object(o["a"])(e);
                  if (t < 0) {
                    t = n.length + t;
                  }
                  return n[t] || null;
                }
                findElement(e, t) {
                  var n;
                  const r = this.props[e];
                  if (r && typeof r === "function") {
                    var s;
                    return r(
                      (s = this.ref) === null || s === void 0
                        ? void 0
                        : s.current
                    );
                  }
                  return this.defaultFindFocusableAtIndex(
                    (n = this.ref) === null || n === void 0
                      ? void 0
                      : n.current,
                    t
                  );
                }
                render() {
                  const {
                    children: e,
                    findFirstFocusable: t,
                    findLastFocusable: n,
                    findNodeToFocusOn: r,
                    focusTrappingDialogProps: s,
                    labelledById: o,
                    ...i
                  } = this.props;
                  return l.a.createElement(
                    "div",
                    Object.assign({}, i, {
                      ref: this.ref,
                      role: "dialog",
                      tabIndex: -1,
                      "aria-labelledby": o,
                    }),
                    e
                  );
                }
              }),
              (h.defaultProps = {
                findFirstFocusable: undefined,
                findLastFocusable: undefined,
                findNodeToFocusOn: undefined,
                focusTrappingDialogProps: {},
              }),
              (h.Title = void 0),
              h))
          ) || f);
        const y = (e) => {
          let { children: t, className: n, show: r, ...s } = e;
          return l.a.createElement(
            "h2",
            Object.assign({}, s, {
              className: c()(n, "ud-heading-lg", { "ud-sr-only": !r }),
            }),
            t
          );
        };
        v.Title = y;
      },
    "./node_modules/@udemy/react-dialog-components/dist/esm/full-page-overlay/full-page-overlay.module.css":
      function (e, t, n) {
        e.exports = {
          "full-page-overlay":
            "full-page-overlay-module--full-page-overlay--ST91F",
          unclickable: "full-page-overlay-module--unclickable--1YAko",
        };
      },
    "./node_modules/@udemy/react-dialog-components/dist/esm/full-page-overlay/full-page-overlay.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return l;
        });
        n.d(t, "b", function () {
          return p;
        });
        var r = n(
          "./node_modules/@udemy/react-core-components/dist/esm/button/button.react-component.js"
        );
        var s = n(
          "./node_modules/@udemy/styles/dist/esm/tokens/generated/index.js"
        );
        var o = n("./node_modules/classnames/index.js");
        var i = n.n(o);
        var a = n("./node_modules/react/index.js");
        var c = n.n(a);
        var d = n(
          "./node_modules/@udemy/react-dialog-components/dist/esm/full-page-overlay/full-page-overlay.module.css"
        );
        var u = n.n(d);
        const l = Number(
          s["a"]["animation-duration-extrafast"].replace("ms", "")
        );
        const p = (e) => {
          let { className: t, zIndex: n, ...s } = e;
          const o = !s.cssToggleId && !s.onClick;
          return c.a.createElement(
            r["a"],
            Object.assign({}, s, {
              componentClass: "div",
              role: "presentation",
              className: i()(
                u.a["full-page-overlay"],
                { [u.a.unclickable]: o },
                t
              ),
              style: n !== null ? { zIndex: n } : {},
              udStyle: "link",
            })
          );
        };
      },
    "./node_modules/@udemy/react-dialog-components/dist/esm/modal/modal.module.css":
      function (e, t, n) {
        e.exports = {
          "dialog-container": "modal-module--dialog-container--3A19A",
          overlay: "modal-module--overlay--2YgBf",
          dialog: "modal-module--dialog--2ZCCG",
          "scroll-wrapper": "modal-module--scroll-wrapper--3jsuw",
          "title-spacer": "modal-module--title-spacer--5T7aG",
          "close-button": "modal-module--close-button--b86KD",
          "full-size": "modal-module--full-size--2pyHm",
          "default-size": "modal-module--default-size--2jBvD",
          "dialog-loading": "modal-module--dialog-loading--3Sp3m",
          loader: "modal-module--loader--2iNpc",
          "desktop-centered": "modal-module--desktop-centered--1Uhb1",
        };
      },
    "./node_modules/@udemy/react-dialog-components/dist/esm/modal/modal.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return F;
        });
        var r = n(
          "./node_modules/@babel/runtime/helpers/initializerDefineProperty.js"
        );
        var s = n.n(r);
        var o = n(
          "./node_modules/@babel/runtime/helpers/applyDecoratedDescriptor.js"
        );
        var i = n.n(o);
        var a = n(
          "./node_modules/@babel/runtime/helpers/initializerWarningHelper.js"
        );
        var c = n.n(a);
        var d = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/a11y/a11y.js"
        );
        var u = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/root-close-wrapper/root-close-wrapper.react-component.js"
        );
        var l = n("./node_modules/@udemy/i18n/dist/esm/index.js");
        var p = n("./node_modules/@udemy/icons/dist/close.ud-icon");
        var m = n.n(p);
        var g = n(
          "./node_modules/@udemy/react-checked-state-components/dist/esm/checked-state/checked-state.react-component.js"
        );
        var f = n(
          "./node_modules/@udemy/react-checked-state-components/dist/esm/checked-state/checked-state-checkbox.react-component.js"
        );
        var h = n(
          "./node_modules/@udemy/react-core-components/dist/esm/icon-button/icon-button.react-component.js"
        );
        var v = n(
          "./node_modules/@udemy/react-popup-components/dist/esm/basic-popper/basic-popper.react-component.js"
        );
        var y = n(
          "./node_modules/@udemy/react-reveal-components/dist/esm/loader/loader.react-component.js"
        );
        var b = n(
          "./node_modules/@udemy/shared-utils/dist/esm/lodashy/noop.js"
        );
        var _ = n("./node_modules/classnames/index.js");
        var j = n.n(_);
        var w = n("./node_modules/mobx/lib/mobx.module.js");
        var x = n("./node_modules/mobx-react/dist/mobx-react.module.js");
        var k = n("./node_modules/react/index.js");
        var O = n.n(k);
        var E = n("./node_modules/react-dom/index.js");
        var C = n.n(E);
        var S = n(
          "./node_modules/@udemy/react-dialog-components/dist/esm/focus-trapping-dialog/focus-trapping-dialog.react-component.js"
        );
        var T = n(
          "./node_modules/@udemy/react-dialog-components/dist/esm/full-page-overlay/full-page-overlay.react-component.js"
        );
        var I = n(
          "./node_modules/@udemy/react-dialog-components/dist/esm/modal/modal.module.css"
        );
        var P = n.n(I);
        var D, A, N, R, L;
        const z = () => document.body;
        let U =
          Object(x["f"])(
            (D =
              ((A =
                ((L = class e extends O.a.Component {
                  constructor() {
                    super(...arguments);
                    this.containerRef = O.a.createRef();
                    this.dialogRef = O.a.createRef();
                    this.id = Object(d["a"])("modal");
                    this.labelledById = Object(d["a"])("modal-title");
                    s()(this, "onChangeIsOpen", N, this);
                    s()(this, "shouldRenderClosedModal", R, this);
                    this.onChange = (e) => {
                      if (this.props.onOpen && this.props.onClose) {
                        this.toggle(
                          Object(g["b"])(e),
                          this.props.onOpen,
                          this.props.onClose
                        );
                      }
                    };
                    this.renderTitle = (e) => {
                      let { title: t } = e;
                      const n = O.a.createElement(
                        "div",
                        {
                          className: j()({
                            [P.a["title-spacer"]]:
                              !this.props.requireExplicitAction,
                          }),
                        },
                        O.a.createElement(
                          S["a"].Title,
                          {
                            id: this.labelledById,
                            className: "ud-modal-title",
                            show: true,
                          },
                          t
                        )
                      );
                      return [this.labelledById, n];
                    };
                  }
                  componentDidMount() {
                    if (this.props.isOpen) {
                      this.toggle(true, b["a"], b["a"]);
                    }
                  }
                  componentDidUpdate(e) {
                    if (
                      this.props.isOpen !== e.isOpen &&
                      this.props.isOpen !== this.onChangeIsOpen
                    ) {
                      if (this.props.onOpen) {
                        this.toggle(
                          this.props.isOpen,
                          this.props.onOpen,
                          b["a"]
                        );
                      }
                    }
                  }
                  toggle(e, t, n) {
                    var r;
                    this.onChangeIsOpen = e;
                    this.shouldRenderClosedModal = !this.props.fullPage;
                    if (
                      (r = this.dialogRef) !== null &&
                      r !== void 0 &&
                      r.current
                    ) {
                      this.dialogRef.current.onToggle(
                        e,
                        this.containerRef.current
                      );
                    }
                    this.onChangeIsOpen ? t() : n();
                    if (!this.onChangeIsOpen) {
                      setTimeout(
                        Object(w["e"])(() => {
                          this.shouldRenderClosedModal = false;
                        }),
                        T["a"]
                      );
                    }
                  }
                  render() {
                    var e, t;
                    const {
                      className: n,
                      children: r,
                      fullPage: s,
                      isOpen: o,
                      loading: i,
                      requireExplicitAction: a,
                    } = this.props;
                    if (
                      typeof document === "undefined" ||
                      (!o && !this.shouldRenderClosedModal)
                    ) {
                      return null;
                    }
                    const [c, d] = (
                      (e = this.props.renderTitle) !== null && e !== void 0
                        ? e
                        : this.renderTitle
                    )(this.props);
                    const u = O.a.createElement(
                      M,
                      { containerRef: this.containerRef },
                      O.a.createElement(f["a"], {
                        id: this.id,
                        className: "ud-full-page-overlay-checkbox",
                        closeOnEscape: true,
                        checked: this.onChangeIsOpen,
                        onChange: this.onChange,
                      }),
                      O.a.createElement(
                        "div",
                        {
                          className: j()(
                            "ud-full-page-overlay-container",
                            P.a["scroll-wrapper"],
                            { [P.a["desktop-centered"]]: !s }
                          ),
                        },
                        !s &&
                          O.a.createElement(T["b"], {
                            cssToggleId: a ? undefined : this.id,
                            className: P.a.overlay,
                          }),
                        O.a.createElement(
                          S["a"],
                          {
                            ref: this.dialogRef,
                            labelledById: c,
                            className: j()(
                              n,
                              "ud-modal",
                              P.a.dialog,
                              s ? P.a["full-size"] : P.a["default-size"],
                              { [P.a["dialog-loading"]]: i }
                            ),
                          },
                          i &&
                            O.a.createElement(y["b"], {
                              color: "inherit",
                              className: P.a.loader,
                            }),
                          !i && d,
                          !i && r,
                          !a &&
                            O.a.createElement(
                              h["a"],
                              {
                                cssToggleId: this.id,
                                udStyle: "ghost",
                                size: "medium",
                                className: j()(
                                  "ud-modal-close",
                                  P.a["close-button"]
                                ),
                                "data-purpose": "close-popup",
                              },
                              O.a.createElement(m.a, {
                                color: "neutral",
                                label: this.props.gettext("close modal"),
                              })
                            )
                        )
                      )
                    );
                    const l =
                      (t = this.props.getContainer) !== null && t !== void 0
                        ? t
                        : z;
                    return C.a.createPortal(u, l());
                  }
                }),
                (L.displayName = "Modal"),
                (L.defaultProps = {
                  requireExplicitAction: false,
                  onClose: b["a"],
                  onOpen: b["a"],
                  fullPage: false,
                  loading: false,
                  className: undefined,
                  getContainer: z,
                  renderTitle: undefined,
                }),
                L)),
              (N = i()(A.prototype, "onChangeIsOpen", [w["t"]], {
                configurable: true,
                enumerable: true,
                writable: true,
                initializer: function () {
                  return false;
                },
              })),
              (R = i()(A.prototype, "shouldRenderClosedModal", [w["t"]], {
                configurable: true,
                enumerable: true,
                writable: true,
                initializer: function () {
                  return false;
                },
              })),
              i()(
                A.prototype,
                "toggle",
                [w["e"]],
                Object.getOwnPropertyDescriptor(A.prototype, "toggle"),
                A.prototype
              ),
              A))
          ) || D;
        const F = Object(l["k"])(U);
        const M = (e) => {
          let { containerRef: t, children: n } = e;
          const { onMount: r, onUnmount: s } = Object(k["useContext"])(v["c"]);
          const { ignoreRootClose: o } = Object(k["useContext"])(u["c"]);
          Object(k["useEffect"])(() => {
            r();
            return () => {
              s();
            };
          }, [r, s]);
          return O.a.createElement(
            O.a.Fragment,
            null,
            O.a.createElement(
              "div",
              { ref: t, onClick: o, className: P.a["dialog-container"] },
              n
            )
          );
        };
      },
    "./node_modules/@udemy/react-form-components/dist/esm/checkbox/checkbox.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return l;
        });
        var r = n("./node_modules/@udemy/icons/dist/collapse-minus.ud-icon");
        var s = n.n(r);
        var o = n("./node_modules/@udemy/icons/dist/tick.ud-icon");
        var i = n.n(o);
        var a = n("./node_modules/react/index.js");
        var c = n.n(a);
        var d = n(
          "./node_modules/@udemy/react-form-components/dist/esm/toggle-input/toggle-input.react-component.js"
        );
        const u = {
          CHECKED: true,
          UNCHECKED: false,
          INDETERMINATE: "indeterminate",
        };
        const l = (e) => {
          let { size: t = "small", checked: n, ...r } = e;
          const o = { small: "xsmall", large: "small" };
          let a = c.a.createElement(i.a, {
            className: "ud-fake-toggle-input ud-fake-toggle-checkbox",
            color: "inherit",
            size: o[t],
            label: false,
          });
          if (n === "indeterminate") {
            a = c.a.createElement(s.a, {
              className:
                "ud-fake-toggle-input ud-fake-toggle-indeterminate-checkbox",
              color: "inherit",
              size: o[t],
              label: false,
            });
            n = false;
          }
          return c.a.createElement(
            d["a"],
            Object.assign({}, r, {
              checked: n,
              size: t,
              fakeInput: a,
              inputType: "checkbox",
            })
          );
        };
        l.STATE = u;
      },
    "./node_modules/@udemy/react-form-components/dist/esm/form-group-variants/compact-form-group.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-form-components/dist/esm/form-group/check-form-group.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return r;
        });
        function r(e, t, n, r) {
          const { $$udFormGroup: s, id: o } = t;
          if (r && !s) {
            console.error(
              `${e} must be in a FormGroup; the FormGroup \`label\` is required for A11Y`
            );
          } else if (o && s && o !== s.id) {
            console.error(
              `${e} id "${o}" will be overridden by FormGroup; use \`formControlId\` on FormGroup to avoid this`
            );
          } else if (n && s && n !== s.props.usage) {
            console.error(
              `You wrapped ${e} in the wrong FormGroup; the correct usage is <${n} />`
            );
          }
        }
      },
    "./node_modules/@udemy/react-form-components/dist/esm/form-group/form-group.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-form-components/dist/esm/form-group/form-group.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "d", function () {
          return O;
        });
        n.d(t, "b", function () {
          return E;
        });
        n.d(t, "a", function () {
          return C;
        });
        n.d(t, "c", function () {
          return S;
        });
        var r = n(
          "./node_modules/@babel/runtime/helpers/initializerDefineProperty.js"
        );
        var s = n.n(r);
        var o = n(
          "./node_modules/@babel/runtime/helpers/applyDecoratedDescriptor.js"
        );
        var i = n.n(o);
        var a = n(
          "./node_modules/@babel/runtime/helpers/initializerWarningHelper.js"
        );
        var c = n.n(a);
        var d = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/a11y/a11y.js"
        );
        var u = n("./node_modules/@udemy/icons/dist/error.ud-icon");
        var l = n.n(u);
        var p = n("./node_modules/classnames/index.js");
        var m = n.n(p);
        var g = n("./node_modules/mobx/lib/mobx.module.js");
        var f = n("./node_modules/mobx-react/dist/mobx-react.module.js");
        var h = n("./node_modules/react/index.js");
        var v = n.n(h);
        var y, b, _, j, w, x, k;
        const O = {
          labelProps: {},
          note: null,
          noteProps: {},
          validationState: "neutral",
          formControlId: null,
          className: null,
        };
        let E =
          Object(f["f"])(
            (y =
              ((b = class e extends v.a.Component {
                constructor() {
                  super(...arguments);
                  this.renderContentFormLabel = (e, t) => {
                    const {
                      tag: n,
                      typography: r,
                      className: s,
                    } = e.labelProps;
                    const o = m()(
                      s,
                      "ud-form-label",
                      r !== null && r !== void 0 ? r : "ud-heading-sm"
                    );
                    const i = v.a.createElement(
                      v.a.Fragment,
                      null,
                      e.label,
                      S(e.validationState),
                      n &&
                        v.a.createElement(
                          "span",
                          { className: "ud-text-xs ud-form-label-tag" },
                          n
                        )
                    );
                    if (e.udStyle === "fieldset") {
                      const { tag: t, typography: n, ...r } = e.labelProps;
                      return v.a.createElement(
                        "legend",
                        Object.assign({}, r, { className: o }),
                        i
                      );
                    }
                    const { tag: a, typography: c, ...d } = e.labelProps;
                    return v.a.createElement(
                      "label",
                      Object.assign({}, d, { htmlFor: t, className: o }),
                      i
                    );
                  };
                  this.renderContent = (e, t) => {
                    var n;
                    let { formControlId: r, noteId: s } = t;
                    const o = this.renderContentFormLabel(e, r);
                    return v.a.createElement(
                      v.a.Fragment,
                      null,
                      o,
                      e.children,
                      e.note &&
                        v.a.createElement(
                          "div",
                          Object.assign({}, e.noteProps, {
                            id: s,
                            role:
                              e.validationState === "error"
                                ? "alert"
                                : undefined,
                            className: m()(
                              e === null || e === void 0
                                ? void 0
                                : (n = e.noteProps) === null || n === void 0
                                ? void 0
                                : n.className,
                              "ud-form-note ud-text-xs"
                            ),
                          }),
                          e.note
                        )
                    );
                  };
                }
                render() {
                  return v.a.createElement(
                    C,
                    Object.assign({}, this.props, {
                      renderContent: this.renderContent,
                      usage: `FormGroup udStyle="${this.props.udStyle}"`,
                    })
                  );
                }
              }),
              (b.defaultProps = { ...O, udStyle: "default" }),
              b))
          ) || y;
        let C =
          ((_ = g["t"].ref),
          Object(f["f"])(
            (j =
              ((w =
                ((k = class e extends v.a.Component {
                  constructor(e) {
                    super(e);
                    this.defaultId = void 0;
                    this.defaultNoteId = void 0;
                    s()(this, "propOverrides", x, this);
                    this.defaultId = Object(d["a"])("form-group");
                    this.defaultNoteId = Object(d["a"])("form-group-note");
                  }
                  get id() {
                    var e;
                    const t =
                      (e = this.props) === null || e === void 0
                        ? void 0
                        : e.formControlId;
                    return t || this.defaultId;
                  }
                  get inputAriaProps() {
                    const e = this.synthesizedProps;
                    const t = e.validationState === "error";
                    return {
                      "aria-errormessage": t && e.note ? this.noteId : null,
                      "aria-describedby": !t && e.note ? this.noteId : null,
                      "aria-invalid": t,
                    };
                  }
                  get noteId() {
                    var e, t;
                    return (e =
                      (t = this.props.noteProps) === null || t === void 0
                        ? void 0
                        : t.id) !== null && e !== void 0
                      ? e
                      : this.defaultNoteId;
                  }
                  get synthesizedProps() {
                    return { ...this.props, ...this.propOverrides };
                  }
                  setPropOverrides(e) {
                    this.propOverrides = e;
                  }
                  render() {
                    const e = this.synthesizedProps;
                    const {
                      children: t,
                      className: n,
                      formControlId: r,
                      formControlClassName: s,
                      label: o,
                      labelProps: i,
                      note: a,
                      noteProps: c,
                      renderContent: d,
                      udStyle: u,
                      usage: l,
                      validationState: p,
                      ...g
                    } = e;
                    const h = m()(n, "ud-form-group", {
                      "ud-form-group-error": p === "error",
                    });
                    const y = d(e, {
                      formControlId: this.id,
                      noteId: this.noteId,
                    });
                    const b =
                      u === "fieldset"
                        ? v.a.createElement(
                            "fieldset",
                            Object.assign({}, g, { className: h }),
                            y
                          )
                        : v.a.createElement(
                            "div",
                            Object.assign({}, g, { className: h }),
                            y
                          );
                    return v.a.createElement(
                      f["c"],
                      { $$udFormGroup: this },
                      b
                    );
                  }
                }),
                (k.defaultProps = { ...O }),
                k)),
              (x = i()(w.prototype, "propOverrides", [_], {
                configurable: true,
                enumerable: true,
                writable: true,
                initializer: function () {
                  return {};
                },
              })),
              i()(
                w.prototype,
                "setPropOverrides",
                [g["e"]],
                Object.getOwnPropertyDescriptor(
                  w.prototype,
                  "setPropOverrides"
                ),
                w.prototype
              ),
              w))
          ) || j);
        function S(e, t) {
          return (
            e === "error" &&
            v.a.createElement(
              l.a,
              Object.assign({}, t, {
                className: "ud-form-group-validation-icon",
                color: "negative",
                label: false,
              })
            )
          );
        }
      },
    "./node_modules/@udemy/react-form-components/dist/esm/select/select.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-form-components/dist/esm/text-input/text-input-container.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-form-components/dist/esm/text-input/text-input-form.module.css":
      function (e, t, n) {
        e.exports = {
          "clear-button": "text-input-form-module--clear-button--18z7v",
          "form-with-clear-button":
            "text-input-form-module--form-with-clear-button--1vK2q",
          "text-input-form": "text-input-form-module--text-input-form--9uxfY",
        };
      },
    "./node_modules/@udemy/react-form-components/dist/esm/text-input/text-input-form.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return v;
        });
        var r = n("./node_modules/@udemy/i18n/dist/esm/index.js");
        var s = n("./node_modules/@udemy/icons/dist/close.ud-icon");
        var o = n.n(s);
        var i = n(
          "./node_modules/@udemy/react-core-components/dist/esm/base-icon/base-icon.react-component.js"
        );
        var a = n(
          "./node_modules/@udemy/react-core-components/dist/esm/icon-button/icon-button.react-component.js"
        );
        var c = n(
          "./node_modules/@udemy/react-core-components/dist/esm/button/button.react-component.js"
        );
        var d = n(
          "./node_modules/@udemy/shared-utils/dist/esm/lodashy/noop.js"
        );
        var u = n("./node_modules/classnames/index.js");
        var l = n.n(u);
        var p = n("./node_modules/react/index.js");
        var m = n.n(p);
        var g = n(
          "./node_modules/@udemy/react-form-components/dist/esm/text-input/text-input-form.module.css"
        );
        var f = n.n(g);
        var h = n(
          "./node_modules/@udemy/react-form-components/dist/esm/text-input/text-input.react-component.js"
        );
        const v = (e) => {
          let {
            dataPurposes: t = {},
            onClearInput: n = d["a"],
            onSubmit: s = d["a"],
            showClearInputButton: u = false,
            size: p = "large",
            submitButtonProps: g = {},
            children: v,
            ...y
          } = e;
          const { gettext: b } = Object(r["j"])();
          const { submitButtonContent: _ = b("Submit"), ...j } = y;
          const w = Object(i["b"])(_) ? a["a"] : c["a"];
          const x = (e) => {
            e.preventDefault();
            s(e);
          };
          return m.a.createElement(
            "form",
            {
              "data-purpose": t.form,
              onSubmit: x,
              className: l()(f.a["text-input-form"], {
                [f.a["form-with-clear-button"]]: u,
              }),
            },
            v !== null && v !== void 0
              ? v
              : m.a.createElement(
                  h["b"],
                  Object.assign({ "data-purpose": t.input, size: p }, j)
                ),
            u &&
              m.a.createElement(
                a["a"],
                {
                  onClick: n,
                  udStyle: "ghost",
                  size: p,
                  className: f.a["clear-button"],
                },
                m.a.createElement(o.a, {
                  color: "neutral",
                  label: b("Clear input"),
                })
              ),
            m.a.createElement(
              w,
              Object.assign(
                {
                  type: "submit",
                  size: p,
                  "data-purpose": t.submit,
                  disabled: y.disabled,
                },
                g
              ),
              _
            )
          );
        };
      },
    "./node_modules/@udemy/react-form-components/dist/esm/text-input/text-input.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-form-components/dist/esm/text-input/text-input.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return d;
        });
        n.d(t, "b", function () {
          return u;
        });
        var r = n("./node_modules/classnames/index.js");
        var s = n.n(r);
        var o = n("./node_modules/mobx-react/dist/mobx-react.module.js");
        var i = n("./node_modules/react/index.js");
        var a = n.n(i);
        var c = n(
          "./node_modules/@udemy/react-form-components/dist/esm/form-group/check-form-group.js"
        );
        const d = ["small", "medium", "large"];
        const u = Object(o["f"])(
          a.a.forwardRef((e, t) => {
            let {
              size: n = "large",
              type: r = "text",
              perfMetricName: d,
              className: u,
              ...l
            } = e;
            const { $$udFormGroup: p } = Object(i["useContext"])(o["a"]);
            const m = p === null || p === void 0 ? void 0 : p.inputAriaProps;
            Object(c["a"])("TextInput", { $$udFormGroup: p, ...l }, null, true);
            return a.a.createElement(
              "input",
              Object.assign({}, m, l, {
                ref: t,
                id: p ? p.id : l.id,
                type: r,
                className: s()(
                  "ud-text-input",
                  `ud-text-input-${n}`,
                  n === "large" ? "ud-text-md" : "ud-text-sm",
                  p.props.formControlClassName,
                  u
                ),
              })
            );
          })
        );
        u.displayName = "TextInput";
      },
    "./node_modules/@udemy/react-form-components/dist/esm/toggle-input/toggle-input-block.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-form-components/dist/esm/toggle-input/toggle-input.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-form-components/dist/esm/toggle-input/toggle-input.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return u;
        });
        var r = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/a11y/a11y.js"
        );
        var s = n("./node_modules/classnames/index.js");
        var o = n.n(s);
        var i = n("./node_modules/mobx-react/dist/mobx-react.module.js");
        var a = n("./node_modules/react/index.js");
        var c = n.n(a);
        var d = n(
          "./node_modules/@udemy/react-form-components/dist/esm/form-group/check-form-group.js"
        );
        const u = Object.assign(
          Object(i["f"])((e) => {
            var t;
            let { size: n = "small", ...s } = e;
            const {
              children: i,
              className: u,
              fakeInput: l,
              inputType: p,
              ...m
            } = s;
            const [g] = Object(a["useState"])(() => Object(r["a"])(p));
            const f = (t = m.id) !== null && t !== void 0 ? t : g;
            Object(d["a"])(
              "ToggleInput",
              s,
              'FormGroup udStyle="fieldset"',
              false
            );
            return c.a.createElement(
              "label",
              {
                className: o()(u, "ud-toggle-input-container", {
                  "ud-toggle-input-disabled": m.disabled,
                  "ud-text-sm": n === "small",
                  "ud-text-md": n === "large",
                }),
                htmlFor: f,
              },
              c.a.createElement(
                "input",
                Object.assign({}, m, {
                  className: "ud-sr-only ud-real-toggle-input",
                  id: f,
                  type: p,
                })
              ),
              l,
              i
            );
          }),
          { displayName: "ToggleInput" }
        );
      },
    "./node_modules/@udemy/react-merchandising-components/dist/esm/currency/dynamic-currency.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return i;
        });
        var r = n("./node_modules/react/index.js");
        var s = n.n(r);
        var o = n(
          "./node_modules/@udemy/react-merchandising-components/dist/esm/currency/formatted-currency.react-component.js"
        );
        const i = (e) => {
          let { value: t } = e;
          return typeof t === "string"
            ? s.a.createElement("span", null, t)
            : s.a.createElement(o["a"], { value: t });
        };
      },
    "./node_modules/@udemy/react-merchandising-components/dist/esm/currency/formatted-currency.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return i;
        });
        var r = n("./node_modules/@udemy/ud-data/dist/esm/index.js");
        var s = n("./node_modules/react/index.js");
        var o = n.n(s);
        const i = (e) => {
          let { value: t, ...n } = e;
          const { formatCurrency: s } = Object(r["f"])();
          return o.a.createElement("span", null, s(t, n));
        };
      },
    "./node_modules/@udemy/react-merchandising-components/dist/esm/price-text/base-price-text.module.css":
      function (e, t, n) {
        e.exports = {
          container: "base-price-text-module--container--2P5fs",
          "price-part": "base-price-text-module--price-part--3AFBv",
          "original-price": "base-price-text-module--original-price--3kPJa",
        };
      },
    "./node_modules/@udemy/react-merchandising-components/dist/esm/price-text/base-price-text.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return l;
        });
        var r = n(
          "./node_modules/@udemy/event-tracking/dist/esm/lib/track-impression.react-component.js"
        );
        var s = n("./node_modules/@udemy/i18n/dist/esm/index.js");
        var o = n("./node_modules/classnames/index.js");
        var i = n.n(o);
        var a = n("./node_modules/react/index.js");
        var c = n.n(a);
        var d = n(
          "./node_modules/@udemy/react-merchandising-components/dist/esm/price-text/base-price-text.module.css"
        );
        var u = n.n(d);
        const l = (e) => {
          let {
            className: t = "",
            currencyComponent: n,
            discountPrice: o,
            discountPriceClassName: a = "",
            discountPriceString: d,
            listPrice: l,
            listPriceClassName: p = "",
            listPriceString: m,
            percentDiscount: g,
            percentDiscountClassName: f = "",
            showListPriceOnly: h,
            showPercentDiscount: v,
            showTotalLabel: y,
            isSubtotalLabel: b,
            totalLabelClassName: _,
            onView: j,
          } = e;
          const { gettext: w, interpolate: x } = Object(s["j"])();
          const k = function (e) {
            for (
              var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1;
              r < t;
              r++
            ) {
              n[r - 1] = arguments[r];
            }
            const s = i()(...n).split(" ");
            const o = s.some(
              (e) => e.startsWith("ud-heading-") || e.startsWith("ud-text-")
            );
            return i()(s, o ? "" : e);
          };
          const O = () => {
            j === null || j === void 0 ? void 0 : j();
          };
          const E = "ud-heading-md";
          const C = "ud-text-sm";
          const S = "ud-text-sm";
          const T = k("", u.a.container, t);
          const I = k(E, u.a["price-part"], a);
          const P = k(C, u.a["price-part"], u.a["original-price"], p);
          const D = k(S, u.a["price-part"], f);
          return c.a.createElement(
            r["a"],
            { trackFunc: O },
            c.a.createElement(
              "div",
              { className: T, "data-purpose": "price-text-container" },
              y &&
                c.a.createElement(
                  "div",
                  { className: _, "data-purpose": "course-price-total-label" },
                  b ? w("Subtotal:") : w("Total:")
                ),
              (h || o === 0 || o) &&
                c.a.createElement(
                  "div",
                  { className: I, "data-purpose": "course-price-text" },
                  c.a.createElement(
                    "span",
                    { className: "ud-sr-only" },
                    w("Current price")
                  ),
                  c.a.createElement(
                    "span",
                    null,
                    h && c.a.createElement(n, { value: m || l }),
                    !h && o !== 0 && c.a.createElement(n, { value: d || o }),
                    !h && o === 0 && w("Free")
                  )
                ),
              !h &&
                l > o &&
                c.a.createElement(
                  "div",
                  { className: P, "data-purpose": "original-price-container" },
                  c.a.createElement(
                    "div",
                    { "data-purpose": "course-old-price-text" },
                    c.a.createElement(
                      "span",
                      { className: "ud-sr-only" },
                      w("Original Price")
                    ),
                    c.a.createElement(
                      "span",
                      null,
                      c.a.createElement(
                        "s",
                        null,
                        c.a.createElement(n, { value: m || l })
                      )
                    )
                  )
                ),
              !h &&
                v &&
                g &&
                (g !== null && g !== void 0 ? g : 0) &&
                c.a.createElement(
                  "div",
                  { className: D, "data-purpose": "discount-percentage" },
                  c.a.createElement(
                    "span",
                    { className: "ud-sr-only" },
                    w("Discount")
                  ),
                  c.a.createElement(
                    "span",
                    null,
                    x(
                      w("%(percentDiscount)s% off"),
                      { percentDiscount: g },
                      true
                    )
                  )
                )
            )
          );
        };
      },
    "./node_modules/@udemy/react-merchandising-components/dist/esm/price-text/dynamic/dynamic-price-text.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return a;
        });
        var r = n("./node_modules/react/index.js");
        var s = n.n(r);
        var o = n(
          "./node_modules/@udemy/react-merchandising-components/dist/esm/currency/dynamic-currency.react-component.js"
        );
        var i = n(
          "./node_modules/@udemy/react-merchandising-components/dist/esm/price-text/base-price-text.react-component.js"
        );
        const a = (e) =>
          s.a.createElement(
            i["a"],
            Object.assign({}, e, { currencyComponent: o["a"] })
          );
      },
    "./node_modules/@udemy/react-merchandising-components/dist/esm/price-text/static/static-price-text.react-component.js":
      function (e, t, n) {
        "use strict";
        var r = n("./node_modules/react/index.js");
        var s = n.n(r);
        const o = (e) => {
          let { value: t } = e;
          return s.a.createElement("span", null, t);
        };
        var i = n(
          "./node_modules/@udemy/react-merchandising-components/dist/esm/price-text/base-price-text.react-component.js"
        );
        n.d(t, "a", function () {
          return a;
        });
        const a = (e) =>
          s.a.createElement(
            i["a"],
            Object.assign({}, e, { currencyComponent: o })
          );
      },
    "./node_modules/@udemy/react-merchandising-components/dist/esm/star-rating/star-rating.module.css":
      function (e, t, n) {
        e.exports = {
          "star-wrapper": "star-rating-module--star-wrapper--VHfnS",
          large: "star-rating-module--large--22lCK",
          numeric: "star-rating-module--numeric--3RxtE",
          "rating-number": "star-rating-module--rating-number--2xeHu",
          medium: "star-rating-module--medium--3kDsb",
          small: "star-rating-module--small--2Fy7E",
          "star-filled": "star-rating-module--star-filled--3CnHc",
          "dark-background": "star-rating-module--dark-background--3p2UF",
          "star-bordered": "star-rating-module--star-bordered--3WG_2",
        };
      },
    "./node_modules/@udemy/react-merchandising-components/dist/esm/star-rating/star-rating.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return m;
        });
        n.d(t, "a", function () {
          return g;
        });
        var r = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/a11y/a11y.js"
        );
        var s = n("./node_modules/@udemy/i18n/dist/esm/index.js");
        var o = n("./node_modules/classnames/index.js");
        var i = n.n(o);
        var a = n("./node_modules/react/index.js");
        var c = n.n(a);
        var d = n("./node_modules/@udemy/icons/dist/rating-star.ud-icon");
        var u = n.n(d);
        var l = n(
          "./node_modules/@udemy/react-merchandising-components/dist/esm/star-rating/star-rating.module.css"
        );
        var p = n.n(l);
        const m = ["small", "medium", "large"];
        const g = (e) => {
          let {
            ariaLabel: t,
            numeric: n = false,
            localizedRating: o,
            rating: d = 0,
            showNumber: u = false,
            size: l = "medium",
            hasDarkBackground: m = false,
          } = e;
          const { formatNumber: g } = Object(s["h"])();
          const { gettext: f, interpolate: h } = Object(s["j"])();
          const v = 14;
          const y = 12;
          const [b] = Object(a["useState"])(Object(r["a"])("star-rating-mask"));
          const _ = n ? 1 : 5;
          let j;
          const w = (e) => {
            if (o !== undefined) {
              return o;
            }
            return g(Number(e), {
              maximumFractionDigits: 1,
              minimumFractionDigits: 1,
            });
          };
          const x = function (e) {
            let n =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : 5;
            if (t !== undefined) {
              return t;
            }
            const r = f("Rating: %(rating)s out of %(total)s");
            return h(r, { rating: w(e), total: n }, true);
          };
          if (n) {
            j = 100;
          } else {
            j = Number((Math.round(d * 2) / 2).toFixed(1)) * 20;
          }
          const k = i()(p.a["star-wrapper"], p.a[l], {
            [p.a.numeric]: n,
            [p.a["dark-background"]]: m,
          });
          const O = [];
          const E = [];
          for (let e = 0; e < _; e++) {
            O.push(
              c.a.createElement("use", {
                key: e,
                xlinkHref: "#icon-rating-star",
                width: v,
                height: v,
                x: e * v,
              })
            );
            E.push(
              c.a.createElement("use", {
                key: e,
                xlinkHref: "#icon-rating-star",
                width: y,
                height: y,
                x: e * v + 1,
                y: "1",
              })
            );
          }
          const C = {
            small: "ud-heading-xs",
            medium: "ud-heading-sm",
            large: "ud-heading-md",
          };
          return c.a.createElement(
            "span",
            { className: k },
            c.a.createElement("span", { className: "ud-sr-only" }, x(d)),
            (u || n) &&
              c.a.createElement(
                "span",
                {
                  className: i()(C[l], p.a["rating-number"]),
                  "aria-hidden": "true",
                  "data-purpose": "rating-number",
                },
                w(d)
              ),
            c.a.createElement(
              "svg",
              {
                "aria-hidden": "true",
                width: "100%",
                height: "100%",
                viewBox: `0 0 ${v * _} ${v}`,
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
              },
              c.a.createElement(
                "mask",
                { id: b, "data-purpose": "star-rating-mask" },
                c.a.createElement("rect", {
                  x: "0",
                  y: "0",
                  width: `${j}%`,
                  height: "100%",
                  fill: "white",
                })
              ),
              c.a.createElement(
                "g",
                {
                  className: p.a["star-filled"],
                  mask: `url(#${b})`,
                  "data-purpose": "star-filled",
                },
                O
              ),
              c.a.createElement(
                "g",
                {
                  fill: "transparent",
                  className: p.a["star-bordered"],
                  strokeWidth: "2",
                  "data-purpose": "star-bordered",
                },
                E
              )
            )
          );
        };
      },
    "./node_modules/@udemy/react-messaging-components/dist/esm/alert-banner/alert-banner.module.css":
      function (e, t, n) {
        e.exports = {
          body: "alert-banner-module--body--10wFa",
          "alert-banner": "alert-banner-module--alert-banner--3V28L",
          "alert-banner-information":
            "alert-banner-module--alert-banner-information--mrXyw",
          "alert-banner-success":
            "alert-banner-module--alert-banner-success--30DzS",
          "alert-banner-error":
            "alert-banner-module--alert-banner-error--3py1T",
          "alert-banner-warning":
            "alert-banner-module--alert-banner-warning--CaHdr",
          "text-frame": "alert-banner-module--text-frame--2Ww0g",
          "text-frame-with-icon":
            "alert-banner-module--text-frame-with-icon--bUiz7",
          "cta-container": "alert-banner-module--cta-container--dsp_p",
          button: "alert-banner-module--button--1YVkk",
        };
      },
    "./node_modules/@udemy/react-messaging-components/dist/esm/alert-banner/alert-banner.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return b;
        });
        n.d(t, "b", function () {
          return _;
        });
        var r = n("./node_modules/@udemy/i18n/dist/esm/index.js");
        var s = n("./node_modules/@udemy/icons/dist/error.ud-icon");
        var o = n.n(s);
        var i = n("./node_modules/@udemy/icons/dist/info.ud-icon");
        var a = n.n(i);
        var c = n("./node_modules/@udemy/icons/dist/success.ud-icon");
        var d = n.n(c);
        var u = n("./node_modules/@udemy/icons/dist/warning.ud-icon");
        var l = n.n(u);
        var p = n(
          "./node_modules/@udemy/react-core-components/dist/esm/button/button.react-component.js"
        );
        var m = n("./node_modules/classnames/index.js");
        var g = n.n(m);
        var f = n("./node_modules/react/index.js");
        var h = n.n(f);
        var v = n(
          "./node_modules/@udemy/react-messaging-components/dist/esm/alert-banner/alert-banner.module.css"
        );
        var y = n.n(v);
        const b = (e) => {
          const [t, n] = Object(f["useState"])(false);
          function r() {
            var t;
            n(true);
            (t = e.onAction) === null || t === void 0 ? void 0 : t.call(e);
          }
          function s() {
            var t;
            n(true);
            (t = e.onDismiss) === null || t === void 0 ? void 0 : t.call(e);
          }
          if (t) {
            return null;
          }
          return h.a.createElement(
            _,
            Object.assign({}, e, { onAction: r, onDismiss: s })
          );
        };
        const _ = (e) => {
          let {
            actionButtonProps: t = {},
            body: n,
            className: s,
            dismissButtonProps: o = {},
            icon: i,
            onAction: a,
            onDismiss: c,
            showCta: d = true,
            showIcon: u = true,
            title: l,
            udStyle: m = "information",
            ...f
          } = e;
          const { gettext: v } = Object(r["j"])();
          const {
            ctaText: b = v("Take action"),
            dismissButtonText: _ = v("Dismiss"),
            ...w
          } = f;
          const x = {
            information: v("information alert"),
            success: v("success alert"),
            error: v("error alert"),
            warning: v("warning alert"),
          };
          const k = u ? y.a["text-frame-with-icon"] : "";
          return h.a.createElement(
            "div",
            Object.assign({}, w, {
              className: g()(y.a["alert-banner"], y.a[`alert-banner-${m}`], s),
            }),
            u && (i || j(m)),
            h.a.createElement(
              "div",
              { style: { flex: 1 } },
              h.a.createElement(
                "div",
                { className: g()(y.a["text-frame"], k) },
                h.a.createElement("span", { className: "ud-sr-only" }, x[m]),
                l && h.a.createElement("h2", { className: "ud-heading-md" }, l),
                n &&
                  h.a.createElement(
                    "div",
                    { className: g()("ud-text-sm", y.a.body) },
                    n
                  )
              ),
              d &&
                h.a.createElement(
                  "div",
                  { className: y.a["cta-container"] },
                  t &&
                    h.a.createElement(
                      p["a"],
                      Object.assign(
                        {
                          "data-purpose": "action",
                          onClick: a,
                          size: "medium",
                          className: y.a.button,
                        },
                        t
                      ),
                      b
                    ),
                  o &&
                    h.a.createElement(
                      p["a"],
                      Object.assign(
                        {
                          "data-purpose": "dismiss",
                          onClick: c,
                          size: "medium",
                          udStyle: "ghost",
                          className: g()("ud-link-neutral", y.a.button),
                        },
                        o
                      ),
                      _
                    )
                )
            )
          );
        };
        function j(e) {
          switch (e) {
            case "success":
              return h.a.createElement(d.a, { label: false, size: "large" });
            case "warning":
              return h.a.createElement(l.a, { label: false, size: "large" });
            case "error":
              return h.a.createElement(o.a, { label: false, size: "large" });
            case "information":
              return h.a.createElement(a.a, { label: false, size: "large" });
          }
        }
      },
    "./node_modules/@udemy/react-messaging-components/dist/esm/badge/badge.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-messaging-components/dist/esm/badge/badge.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return a;
        });
        var r = n("./node_modules/classnames/index.js");
        var s = n.n(r);
        var o = n("./node_modules/react/index.js");
        var i = n.n(o);
        const a = (e) => {
          let { children: t = null, className: n, ...r } = e;
          return i.a.createElement(
            "div",
            Object.assign({}, r, {
              className: s()("ud-badge", "ud-heading-xs", n),
            }),
            t
          );
        };
      },
    "./node_modules/@udemy/react-messaging-components/dist/esm/meter/meter.module.css":
      function (e, t, n) {
        e.exports = {
          "meter-wrapper": "meter-module--meter-wrapper--2DAsV",
          meter: "meter-module--meter--1Kt_E",
        };
      },
    "./node_modules/@udemy/react-messaging-components/dist/esm/meter/meter.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return u;
        });
        var r = n("./node_modules/@udemy/i18n/dist/esm/index.js");
        var s = n("./node_modules/classnames/index.js");
        var o = n.n(s);
        var i = n("./node_modules/react/index.js");
        var a = n.n(i);
        var c = n(
          "./node_modules/@udemy/react-messaging-components/dist/esm/meter/meter.module.css"
        );
        var d = n.n(c);
        const u = (e) => {
          let { value: t, min: n, max: s, label: i, className: c, ...u } = e;
          const { interpolate: l } = Object(r["j"])();
          const p = Math.round(((t - n) / (s - n)) * 100);
          return a.a.createElement(
            "div",
            Object.assign({}, u, {
              className: o()(c, "ud-meter-wrapper", d.a["meter-wrapper"]),
            }),
            a.a.createElement("div", {
              className: o()("ud-meter", d.a.meter),
              style: { transform: `scaleX(${p / 100})` },
              "aria-label": l(
                i,
                { value: t, min: n, max: s, percent: p },
                true
              ),
              "data-purpose": "meter",
            })
          );
        };
      },
    "./node_modules/@udemy/react-messaging-components/dist/esm/toaster/toast.module.css":
      function (e, t, n) {
        e.exports = {
          container: "toast-module--container--1aiyo",
          visible: "toast-module--visible--10YAY",
        };
      },
    "./node_modules/@udemy/react-messaging-components/dist/esm/toaster/toaster.mobx-store.js":
      function (e, t, n) {
        "use strict";
        var r = n(
          "./node_modules/@babel/runtime/helpers/initializerDefineProperty.js"
        );
        var s = n.n(r);
        var o = n(
          "./node_modules/@babel/runtime/helpers/initializerWarningHelper.js"
        );
        var i = n(
          "./node_modules/@babel/runtime/helpers/applyDecoratedDescriptor.js"
        );
        var a = n.n(i);
        var c = n("./node_modules/mobx/lib/mobx.module.js");
        var d = n("./node_modules/react/index.js");
        var u = n.n(d);
        var l = n(
          "./node_modules/@udemy/react-messaging-components/dist/esm/alert-banner/alert-banner.react-component.js"
        );
        var p = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/a11y/a11y.js"
        );
        var m, g, f, h;
        let v =
          ((m = class e {
            constructor() {
              s()(this, "isVisible", g, this);
              this.id = void 0;
              s()(this, "showToast", f, this);
              s()(this, "dismissToast", h, this);
              this.id = Object(p["a"])("toast");
            }
          }),
          (g = a()(m.prototype, "isVisible", [c["t"]], {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: function () {
              return false;
            },
          })),
          (f = a()(m.prototype, "showToast", [c["e"]], {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: function () {
              return () => {
                this.isVisible = true;
              };
            },
          })),
          (h = a()(m.prototype, "dismissToast", [c["e"]], {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: function () {
              return () => {
                this.isVisible = false;
              };
            },
          })),
          m);
        var y = n(
          "./node_modules/@udemy/shared-utils/dist/esm/lodashy/noop.js"
        );
        var b = n("./node_modules/classnames/index.js");
        var _ = n.n(b);
        var j = n("./node_modules/mobx-react/dist/mobx-react.module.js");
        var w = n(
          "./node_modules/@udemy/react-messaging-components/dist/esm/toaster/toast.module.css"
        );
        var x = n.n(w);
        var k, O;
        const E = 6e3;
        let C =
          Object(j["f"])(
            (k =
              ((O = class e extends d["Component"] {
                constructor() {
                  super(...arguments);
                  this.handleTransitionEnd = () => {
                    if (!this.props.toastStore.isVisible) {
                      this.props.toasterStore.removeToast(
                        this.props.toastStore.id
                      );
                    }
                  };
                }
                componentDidMount() {
                  setTimeout(() => {
                    var e, t;
                    this.props.toastStore.showToast();
                    (e = (t = this.props).onFirstVisible) === null ||
                    e === void 0
                      ? void 0
                      : e.call(t);
                  }, 100);
                  if (this.props.autoDismiss) {
                    setTimeout(
                      this.props.toastStore.dismissToast,
                      this.props.autoDismissTimeout
                    );
                  }
                  if (this.props.impressionUseCase) {
                    var e, t;
                    (e = (t = this.props).onToastImpression) === null ||
                    e === void 0
                      ? void 0
                      : e.call(t, this.props.impressionUseCase);
                  }
                }
                render() {
                  return u.a.createElement(
                    "div",
                    {
                      className: _()(x.a.container, {
                        [x.a.visible]: this.props.toastStore.isVisible,
                      }),
                      onTransitionEnd: this.handleTransitionEnd,
                      role: "status",
                    },
                    this.props.children
                  );
                }
              }),
              (O.defaultProps = {
                autoDismiss: false,
                autoDismissTimeout: E,
                impressionUseCase: undefined,
                onFirstVisible: y["a"],
                onToastImpression: undefined,
              }),
              O))
          ) || k;
        n.d(t, "a", function () {
          return P;
        });
        var S, T;
        let I =
          ((S = class e {
            constructor() {
              let e =
                arguments.length > 0 && arguments[0] !== undefined
                  ? arguments[0]
                  : { toastComponent: C };
              this._seenToastKeys = new Set();
              this.toasts = c["t"].map({}, { deep: false });
              this.toastComponent = void 0;
              this.dismissToast = (e) => {
                const t = this.toasts.get(e);
                if (t) {
                  t.store.dismissToast();
                }
              };
              s()(this, "removeToast", T, this);
              this.toastComponent = e.toastComponent;
            }
            addToast(e) {
              let t =
                arguments.length > 1 && arguments[1] !== undefined
                  ? arguments[1]
                  : {};
              if (t.toastKey) {
                if (this._seenToastKeys.has(t.toastKey)) {
                  return;
                }
                this._seenToastKeys.add(t.toastKey);
              }
              const n = new v();
              const r = u.a.createElement(
                this.toastComponent,
                Object.assign(
                  { toasterStore: this, toastStore: n, key: n.id },
                  t
                ),
                e
              );
              this.toasts.set(n.id, { store: n, toastComponent: r });
              return n.id;
            }
            addAlertBannerToast(e) {
              let t =
                arguments.length > 1 && arguments[1] !== undefined
                  ? arguments[1]
                  : {};
              let n = null;
              const r = () => {
                var t;
                this.dismissToast(n);
                (t = e.onAction) === null || t === void 0 ? void 0 : t.call(e);
              };
              const s = () => {
                var t;
                this.dismissToast(n);
                (t = e.onDismiss) === null || t === void 0 ? void 0 : t.call(e);
              };
              const o = u.a.createElement(
                l["b"],
                Object.assign({}, e, { onAction: r, onDismiss: s })
              );
              n = this.addToast(o, t);
              return n;
            }
          }),
          a()(
            S.prototype,
            "addToast",
            [c["e"]],
            Object.getOwnPropertyDescriptor(S.prototype, "addToast"),
            S.prototype
          ),
          (T = a()(S.prototype, "removeToast", [c["e"]], {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: function () {
              return (e) => {
                this.toasts.delete(e);
              };
            },
          })),
          S);
        const P = new I();
      },
    "./node_modules/@udemy/react-navigation-components/dist/esm/breadcrumb/breadcrumb.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-popup-components/dist/esm/basic-popper/basic-popper.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return D;
        });
        n.d(t, "f", function () {
          return N;
        });
        n.d(t, "c", function () {
          return L;
        });
        n.d(t, "e", function () {
          return z;
        });
        n.d(t, "d", function () {
          return U;
        });
        n.d(t, "a", function () {
          return $;
        });
        var r = n(
          "./node_modules/@babel/runtime/helpers/initializerDefineProperty.js"
        );
        var s = n.n(r);
        var o = n(
          "./node_modules/@babel/runtime/helpers/applyDecoratedDescriptor.js"
        );
        var i = n.n(o);
        var a = n(
          "./node_modules/@babel/runtime/helpers/initializerWarningHelper.js"
        );
        var c = n.n(a);
        var d = n("./node_modules/core-js-pure/stable/instance/includes.js");
        var u = n.n(d);
        var l = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/root-close-wrapper/root-close-wrapper.react-component.js"
        );
        var p = n(
          "./node_modules/@udemy/design-system-utils/dist/esm/a11y/a11y.js"
        );
        var m = n(
          "./node_modules/@udemy/hooks/dist/esm/use-match-media/index.js"
        );
        var g = n(
          "./node_modules/@udemy/react-checked-state-components/dist/esm/checked-state/checked-state-checkbox.react-component.js"
        );
        var f = n(
          "./node_modules/@udemy/shared-utils/dist/esm/lodashy/noop.js"
        );
        var h = n("./node_modules/classnames/index.js");
        var v = n.n(h);
        var y = n("./node_modules/mobx/lib/mobx.module.js");
        var b = n("./node_modules/mobx-react/dist/mobx-react.module.js");
        var _ = n("./node_modules/prop-types/index.js");
        var j = n.n(_);
        var w = n("./node_modules/react/index.js");
        var x = n.n(w);
        var k = n(
          "./node_modules/@udemy/react-popup-components/dist/esm/basic-popper/popper.module.css"
        );
        var O = n.n(k);
        var E, C, S, T, I, P;
        const D = {
          "top-start": { bottom: "100%", left: "0" },
          "top-end": { bottom: "100%", right: "0" },
          top: { bottom: "100%", left: "50%", transform: "translateX(-50%)" },
          "right-start": { left: "100%", top: "0" },
          "right-end": { left: "100%", bottom: "0" },
          right: { left: "100%", top: "50%", transform: "translateY(-50%)" },
          "bottom-start": { top: "100%", left: "0" },
          "bottom-end": { top: "100%", right: "0" },
          bottom: { top: "100%", left: "50%", transform: "translateX(-50%)" },
          "left-start": { right: "100%", top: "0" },
          "left-end": { right: "100%", bottom: "0" },
          left: { right: "100%", top: "50%", transform: "translateY(-50%)" },
        };
        let A = null;
        function N(e) {
          return e.split("-")[0];
        }
        function R(e) {
          var t;
          return u()((t = ["top", "bottom"])).call(t, N(e));
        }
        const L = Object(w["createContext"])({
          onMount: f["a"],
          onUnmount: f["a"],
        });
        function z(e) {
          const { children: t, ...n } = e;
          return x.a.createElement(
            "div",
            n,
            x.a.createElement("div", { className: O.a["animation-wrapper"] }, t)
          );
        }
        const U = {
          children: j.a.node.isRequired,
          className: j.a.string,
          placement: j.a.oneOf(Object.keys(D)).isRequired,
          trigger: j.a.element.isRequired,
          getTriggerRect: j.a.func,
          isOpen: j.a.bool,
          canToggleOnHover: j.a.bool,
          a11yRole: j.a.oneOf(["popup", "description", "none"]),
          shouldCloseOtherPoppers: j.a.bool,
          onToggle: j.a.func,
          onFirstOpen: j.a.func,
          onMenuAimUpdate: j.a.func,
          componentClass: j.a.elementType,
          renderContent: j.a.func,
          toggleStrategy: j.a.oneOf(["show-hide", "add-remove"]),
          canOnlyToggleOnHover: j.a.bool,
        };
        const F = Object(b["f"])((e) => {
          let {
            trigger: t,
            triggerId: n,
            isOpen: r,
            contentId: s,
            isPopupRole: o,
            isDescriptionRole: i,
            canToggleOnHover: a,
            onTriggerClick: c,
          } = e;
          const d = { id: n };
          if (o) {
            d["aria-expanded"] = r;
          } else if (i) {
            d["aria-describedby"] = s;
          }
          if (!a) {
            d.onClick = c;
          }
          if (t.props.tabIndex === undefined) {
            d.tabIndex = 0;
          }
          return x.a.cloneElement(x.a.Children.only(t), d);
        });
        const M = Object(b["f"])((e) => {
          let {
            triggerId: t,
            contentId: n,
            isOpen: r,
            isPopupRole: s,
            isDescriptionRole: o,
            onTriggerClick: i,
            onMouseEnter: a,
            onMouseLeave: c,
            onBlurClose: d,
            handleFocus: u,
            children: l,
            ...p
          } = e;
          const f = p.componentClass;
          const h = !!Object(m["a"])("(hover: hover)");
          const y = p.canToggleOnHover && h;
          return x.a.createElement(
            f,
            {
              className: v()(O.a.popper, p.className, { "ud-popper-open": r }),
              onMouseEnter: y ? a : undefined,
              onMouseLeave: y ? c : undefined,
              onFocus: !p.canOnlyToggleOnHover && y ? u : undefined,
              onBlur: y ? d : undefined,
            },
            p.trigger.props.cssToggleId &&
              x.a.createElement(g["a"], {
                id: p.trigger.props.cssToggleId,
                checked: r,
                onChange: p.onToggle,
                className: O.a["popper-checkbox"],
              }),
            x.a.createElement(F, {
              triggerId: t,
              trigger: p.trigger,
              isPopupRole: s,
              isDescriptionRole: o,
              contentId: n,
              isOpen: r,
              canToggleOnHover: y,
              onTriggerClick: i,
            }),
            l
          );
        });
        let $ =
          Object(b["f"])(
            (E =
              ((C =
                ((P = class e extends x.a.Component {
                  constructor(e) {
                    var t;
                    super(e);
                    t = this;
                    this.triggerId = void 0;
                    this.contentId = void 0;
                    this.triggerNode = null;
                    this.contentNode = null;
                    this.focusNode = null;
                    this.hasOpened = false;
                    this.isModalInPopper = false;
                    this.popperModalContext = void 0;
                    s()(this, "contentOffset", S, this);
                    this.isControlledComponent = () =>
                      typeof this.props.isOpen !== "undefined";
                    s()(this, "isOpenShadowValue", T, this);
                    s()(this, "handleToggle", I, this);
                    this.onToggle = () => {
                      this.isOpen ? this.onClose() : this.onOpen();
                    };
                    this.onTriggerClick = function () {
                      t.onToggle();
                      if (typeof t.props.trigger.props.onClick === "function") {
                        t.props.trigger.props.onClick(...arguments);
                      }
                    };
                    this.onOpen = () => {
                      if (!this.isOpen) {
                        if (this.props.shouldCloseOtherPoppers) {
                          if (A) {
                            A.onClose();
                          }
                          A = this;
                        }
                        this.handleToggle(true);
                        !this.hasOpened &&
                          this.props.onFirstOpen &&
                          this.props.onFirstOpen();
                        this.hasOpened = true;
                      }
                    };
                    this.onClose = () => {
                      if (this.isOpen) {
                        if (A === this) {
                          A = null;
                        }
                        this.handleToggle(false);
                      }
                    };
                    this.onRootClose = (e, t, n) => {
                      if (
                        n === l["a"].KEYBOARD &&
                        t !== null &&
                        t !== void 0 &&
                        t.contains(e.target)
                      ) {
                        var r;
                        if (this.isOpen) {
                          e.stopPropagation();
                        }
                        (r = this.triggerNode) === null || r === void 0
                          ? void 0
                          : r.focus();
                      }
                      this.onClose();
                    };
                    this.onFocusOpen = (e) => {
                      var t;
                      this.focusNode =
                        (t = this.focusNode) !== null && t !== void 0 ? t : e;
                      this.onOpen();
                    };
                    this.handleFocus = (e) => {
                      this.onFocusOpen(e.currentTarget);
                    };
                    this.onBlurClose = () => {
                      setTimeout(() => {
                        var e, t;
                        if (
                          this.focusNode &&
                          !this.isModalInPopper &&
                          !(
                            (e = this.focusNode) !== null &&
                            e !== void 0 &&
                            e.contains(document.activeElement)
                          ) &&
                          !(
                            (t = this.contentNode) !== null &&
                            t !== void 0 &&
                            t.contains(document.activeElement)
                          ) &&
                          !this.isInsideDetachedPopperContent(
                            document.activeElement
                          )
                        ) {
                          this.onClose();
                        }
                        this.focusNode = null;
                      }, 0);
                    };
                    this.onMouseEnter = () => {
                      if (!this.isModalInPopper) {
                        this.onOpen();
                        if (this.props.onMenuAimUpdate) {
                          setTimeout(this.props.onMenuAimUpdate, 0);
                        }
                      }
                    };
                    this.onMouseLeave = () => {
                      if (!this.isModalInPopper) {
                        this.onClose();
                      }
                    };
                    this.handleChildModalMount = () => {
                      this.isModalInPopper = true;
                      this.context.onMount();
                    };
                    this.handleChildModalUnmount = () => {
                      if (this.isModalInPopper) {
                        this.onClose();
                      }
                      this.isModalInPopper = false;
                      this.context.onUnmount();
                    };
                    this.triggerId =
                      this.props.trigger.props.id ||
                      Object(p["a"])("popper-trigger");
                    this.contentId = Object(p["a"])("popper-content");
                    this.popperModalContext = {
                      onMount: this.handleChildModalMount,
                      onUnmount: this.handleChildModalUnmount,
                    };
                  }
                  componentDidMount() {
                    this.triggerNode = document.getElementById(this.triggerId);
                    this.contentNode = document.getElementById(this.contentId);
                    this.updateContentOffset();
                  }
                  componentDidUpdate() {
                    this.updateContentOffset();
                  }
                  componentWillUnmount() {
                    if (A === this) {
                      A = null;
                    }
                    this.focusNode = this.triggerNode = this.contentNode = null;
                  }
                  get isOpen() {
                    return this.isControlledComponent()
                      ? this.props.isOpen
                      : this.isOpenShadowValue;
                  }
                  updateContentOffset() {
                    if (
                      !this.isOpen ||
                      !this.triggerNode ||
                      !this.contentNode
                    ) {
                      this.contentOffset = null;
                    } else if (this.props.getTriggerRect) {
                      const e = this.props.getTriggerRect(this.triggerNode);
                      const t = this.contentNode.getBoundingClientRect();
                      if (R(this.props.placement)) {
                        this.contentOffset = e.left - t.left + e.width / 2;
                      } else {
                        this.contentOffset = e.top - t.top + e.height / 2;
                      }
                    }
                  }
                  isInsideDetachedPopperContent(e) {
                    var t;
                    const n = Array.from(
                      document.querySelectorAll("body > .ud-popper-open")
                    );
                    const r = n.find((t) => t.contains(e));
                    const s =
                      r === null || r === void 0
                        ? void 0
                        : r.getAttribute("aria-labelledby");
                    const o = s && document.getElementById(s);
                    return (
                      !!o &&
                      ((t = this.contentNode) === null || t === void 0
                        ? void 0
                        : t.contains(o))
                    );
                  }
                  render() {
                    const {
                      isOpen: e,
                      onToggle: t,
                      placement: n,
                      renderContent: r,
                      ...s
                    } = this.props;
                    const o = this.props.a11yRole === "popup";
                    const i = this.props.a11yRole === "description";
                    const a = {
                      id: this.contentId,
                      "aria-labelledby": o ? this.triggerId : undefined,
                      className: v()(O.a["popper-content"], {
                        "ud-popper-open": this.isOpen,
                      }),
                      style: D[n],
                      children:
                        (this.props.toggleStrategy === "show-hide" ||
                          this.isOpen) &&
                        this.props.children,
                    };
                    return x.a.createElement(
                      L.Provider,
                      { value: this.popperModalContext },
                      x.a.createElement(
                        l["b"],
                        { onRootClose: this.onRootClose },
                        this.props.componentClass &&
                          x.a.createElement(
                            M,
                            Object.assign(
                              {
                                isOpen: this.isOpen,
                                triggerId: this.triggerId,
                                contentId: this.contentId,
                                isPopupRole: o,
                                isDescriptionRole: i,
                                onTriggerClick: this.onTriggerClick,
                                onMouseEnter: this.onMouseEnter,
                                onMouseLeave: this.onMouseLeave,
                                onToggle: this.onToggle,
                                onBlurClose: this.onBlurClose,
                                handleFocus: this.handleFocus,
                              },
                              s
                            ),
                            r === null || r === void 0
                              ? void 0
                              : r(a, n, this.contentOffset)
                          )
                      )
                    );
                  }
                }),
                (P.defaultProps = {
                  getTriggerRect: (e) => e.getBoundingClientRect(),
                  canToggleOnHover: false,
                  a11yRole: "popup",
                  shouldCloseOtherPoppers: true,
                  onFirstOpen: undefined,
                  onMenuAimUpdate: undefined,
                  onToggle: f["a"],
                  componentClass: "div",
                  renderContent: z,
                  toggleStrategy: "show-hide",
                  canOnlyToggleOnHover: false,
                }),
                P)),
              (S = i()(C.prototype, "contentOffset", [y["t"]], {
                configurable: true,
                enumerable: true,
                writable: true,
                initializer: function () {
                  return null;
                },
              })),
              (T = i()(C.prototype, "isOpenShadowValue", [y["t"]], {
                configurable: true,
                enumerable: true,
                writable: true,
                initializer: function () {
                  return false;
                },
              })),
              (I = i()(C.prototype, "handleToggle", [y["e"]], {
                configurable: true,
                enumerable: true,
                writable: true,
                initializer: function () {
                  return (e) => {
                    var t, n;
                    if (!this.isControlledComponent()) {
                      this.isOpenShadowValue = e;
                    }
                    (t = (n = this.props).onToggle) === null || t === void 0
                      ? void 0
                      : t.call(n, e);
                  };
                },
              })),
              i()(
                C.prototype,
                "updateContentOffset",
                [y["e"]],
                Object.getOwnPropertyDescriptor(
                  C.prototype,
                  "updateContentOffset"
                ),
                C.prototype
              ),
              C))
          ) || E;
        $.contextType = L;
      },
    "./node_modules/@udemy/react-popup-components/dist/esm/basic-popper/popper.module.css":
      function (e, t, n) {
        e.exports = {
          popper: "popper-module--popper--2BpLn",
          "popper-content": "popper-module--popper-content--3cLBV",
          "popper-checkbox": "popper-module--popper-checkbox--1ypgk",
          "animation-wrapper": "popper-module--animation-wrapper--2ogNt",
          "pop-in": "popper-module--pop-in--1Pg2a",
        };
      },
    "./node_modules/@udemy/react-reveal-components/dist/esm/block/block.module.css":
      function (e, t, n) {
        e.exports = { block: "block-module--block--RPRKE" };
      },
    "./node_modules/@udemy/react-reveal-components/dist/esm/block/block.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return d;
        });
        var r = n("./node_modules/classnames/index.js");
        var s = n.n(r);
        var o = n("./node_modules/react/index.js");
        var i = n.n(o);
        var a = n(
          "./node_modules/@udemy/react-reveal-components/dist/esm/block/block.module.css"
        );
        var c = n.n(a);
        const d = (e) => {
          let { className: t, ...n } = e;
          return i.a.createElement(
            "span",
            Object.assign({}, n, { className: s()(c.a.block, t) })
          );
        };
      },
    "./node_modules/@udemy/react-reveal-components/dist/esm/course-card-skeleton/course-card-skeleton-group.module.css":
      function (e, t, n) {
        e.exports = {
          skeleton: "course-card-skeleton-group-module--skeleton--1OtGH",
          title: "course-card-skeleton-group-module--title--U63WG",
          row: "course-card-skeleton-group-module--row--RdD7S",
        };
      },
    "./node_modules/@udemy/react-reveal-components/dist/esm/course-card-skeleton/course-card-skeleton-group.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return p;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/lodashy/range.js"
        );
        var s = n("./node_modules/classnames/index.js");
        var o = n.n(s);
        var i = n("./node_modules/react/index.js");
        var a = n.n(i);
        var c = n(
          "./node_modules/@udemy/react-reveal-components/dist/esm/block/block.react-component.js"
        );
        var d = n(
          "./node_modules/@udemy/react-reveal-components/dist/esm/course-card-skeleton/course-card-skeleton-group.module.css"
        );
        var u = n.n(d);
        var l = n(
          "./node_modules/@udemy/react-reveal-components/dist/esm/course-card-skeleton/course-card-skeleton.react-component.js"
        );
        const p = (e) => {
          let {
            className: t,
            cardCountPerRow: n,
            cardWrapper: s = a.a.Fragment,
            rowCount: i = 1,
            withTitle: d = false,
            ...p
          } = e;
          let m = n;
          if (!n) {
            m = p.size === "small" ? 3 : 5;
          }
          return a.a.createElement(
            "div",
            { className: o()(t, u.a.skeleton) },
            d && a.a.createElement(c["a"], { className: u.a.title }),
            Object(r["a"])(i).map((e) =>
              a.a.createElement(
                "div",
                { key: e, className: u.a.row },
                Object(r["a"])(m).map((e) =>
                  a.a.createElement(s, { key: e }, a.a.createElement(l["a"], p))
                )
              )
            )
          );
        };
      },
    "./node_modules/@udemy/react-reveal-components/dist/esm/course-card-skeleton/course-card-skeleton.module.css":
      function (e, t, n) {
        e.exports = {
          "skeleton-fixed":
            "course-card-skeleton-module--skeleton-fixed--2I6aD",
          "skeleton-flexible":
            "course-card-skeleton-module--skeleton-flexible--R_sWV",
          line: "course-card-skeleton-module--line--237S9",
          title: "course-card-skeleton-module--title--2n3F8",
          "skeleton-small":
            "course-card-skeleton-module--skeleton-small--3In52",
          "skeleton-large":
            "course-card-skeleton-module--skeleton-large--Kxy_7",
          image: "course-card-skeleton-module--image--1hG62",
          "skeleton-medium":
            "course-card-skeleton-module--skeleton-medium--QLHv3",
        };
      },
    "./node_modules/@udemy/react-reveal-components/dist/esm/course-card-skeleton/course-card-skeleton.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return p;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/lodashy/range.js"
        );
        var s = n("./node_modules/classnames/index.js");
        var o = n.n(s);
        var i = n("./node_modules/react/index.js");
        var a = n.n(i);
        var c = n(
          "./node_modules/@udemy/react-reveal-components/dist/esm/block/block.react-component.js"
        );
        var d = n(
          "./node_modules/@udemy/react-reveal-components/dist/esm/skeleton/skeleton.react-component.js"
        );
        var u = n(
          "./node_modules/@udemy/react-reveal-components/dist/esm/course-card-skeleton/course-card-skeleton.module.css"
        );
        var l = n.n(u);
        const p = (e) => {
          let {
            className: t,
            imageStyle: n,
            lineCount: s = 3,
            size: i = "medium",
            width: u = "flexible",
            ...p
          } = e;
          return a.a.createElement(
            d["a"],
            Object.assign({}, p, {
              "data-purpose": "course-card-skeleton",
              className: o()({
                className: t,
                [l.a["skeleton-fixed"]]: u === "fixed",
                [l.a["skeleton-flexible"]]: u === "flexible",
                [l.a["skeleton-small"]]: i === "small",
                [l.a["skeleton-medium"]]: i === "medium",
                [l.a["skeleton-large"]]: i === "large",
              }),
            }),
            a.a.createElement(c["a"], { className: l.a.image, style: n }),
            a.a.createElement(
              "div",
              { style: { flex: 1 } },
              a.a.createElement(c["a"], { className: l.a.title }),
              Object(r["a"])(s).map((e) =>
                a.a.createElement(c["a"], { key: e, className: l.a.line })
              )
            )
          );
        };
      },
    "./node_modules/@udemy/react-reveal-components/dist/esm/loader/loader.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-reveal-components/dist/esm/loader/loader.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return u;
        });
        n.d(t, "b", function () {
          return l;
        });
        var r = n("./node_modules/@udemy/i18n/dist/esm/index.js");
        var s = n("./node_modules/@udemy/icons/dist/loading-spinner.ud-icon");
        var o = n.n(s);
        var i = n("./node_modules/classnames/index.js");
        var a = n.n(i);
        var c = n("./node_modules/react/index.js");
        var d = n.n(c);
        const u = d.a.forwardRef((e, t) => {
          let {
            block: n = false,
            overlay: s = false,
            className: i,
            withLCPCandidate: c = false,
            ...u
          } = e;
          const { gettext: l } = Object(r["j"])();
          const { label: p = l("Loading") } = u;
          const m = u;
          if (n || s || c) {
            if (c) {
              m.size = "xxxlarge";
            }
            return d.a.createElement(
              "div",
              {
                className: a()(
                  i,
                  "ud-loader-block",
                  s ? "ud-loader-overlay" : "",
                  c ? "ud-lcp-candidate-white" : ""
                ),
                "data-purpose": "load-spinner-wrapper",
                ref: t,
              },
              d.a.createElement(
                o.a,
                Object.assign({}, m, { label: p, className: "ud-loader" })
              )
            );
          }
          return d.a.createElement(
            o.a,
            Object.assign({}, m, {
              label: p,
              className: a()(i, "ud-loader"),
              ref: t,
            })
          );
        });
        u.displayName = "Loader";
        const l = (e) =>
          d.a.createElement(
            u,
            Object.assign({ block: true, size: "xxlarge" }, e)
          );
      },
    "./node_modules/@udemy/react-reveal-components/dist/esm/skeleton/skeleton.module.css":
      function (e, t, n) {
        e.exports = {
          skeleton: "skeleton-module--skeleton--1uEUy",
          shine: "skeleton-module--shine--3vVXo",
        };
      },
    "./node_modules/@udemy/react-reveal-components/dist/esm/skeleton/skeleton.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return d;
        });
        var r = n("./node_modules/classnames/index.js");
        var s = n.n(r);
        var o = n("./node_modules/react/index.js");
        var i = n.n(o);
        var a = n(
          "./node_modules/@udemy/react-reveal-components/dist/esm/skeleton/skeleton.module.css"
        );
        var c = n.n(a);
        const d = (e) => {
          let { className: t, children: n, ...r } = e;
          return i.a.createElement(
            "div",
            Object.assign({}, r, { className: s()(c.a.skeleton, t) }),
            n,
            i.a.createElement("div", { className: c.a.shine })
          );
        };
      },
    "./node_modules/@udemy/react-structure-components/dist/esm/footer-buttons/footer-buttons.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-structure-components/dist/esm/item-card/item-card.module.css":
      function (e, t, n) {
        e.exports = {
          "item-card": "item-card-module--item-card--1jGS0",
          "image-wrapper": "item-card-module--image-wrapper---jof2",
          "item-card-title": "item-card-module--item-card-title--S729p",
        };
      },
    "./node_modules/@udemy/react-structure-components/dist/esm/item-card/item-card.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return l;
        });
        var r = n("./node_modules/classnames/index.js");
        var s = n.n(r);
        var o = n("./node_modules/react/index.js");
        var i = n.n(o);
        var a = n(
          "./node_modules/@udemy/react-structure-components/dist/esm/item-card/item-card.module.css"
        );
        var c = n.n(a);
        const d = (e) => {
          let { className: t, children: n, ...r } = e;
          return i.a.createElement(
            "div",
            Object.assign({}, r, {
              className: s()(t, "ud-custom-focus-target", c.a["image-wrapper"]),
            }),
            n
          );
        };
        const u = (e) => {
          let { className: t, children: n, ...r } = e;
          return i.a.createElement(
            "a",
            Object.assign({}, r, {
              className: s()(
                t,
                "ud-focus-visible-target",
                c.a["item-card-title"]
              ),
            }),
            n
          );
        };
        const l = Object.assign(
          i.a.forwardRef((e, t) => {
            let { className: n, children: r, ...o } = e;
            return i.a.createElement(
              "div",
              Object.assign({}, o, {
                ref: t,
                className: s()(n, "ud-custom-focus-visible", c.a["item-card"]),
              }),
              r
            );
          }),
          { Title: u, ImageWrapper: d }
        );
      },
    "./node_modules/@udemy/react-structure-components/dist/esm/play-overlay/play-overlay.global.css":
      function (e, t, n) {},
    "./node_modules/@udemy/react-structure-components/dist/esm/play-overlay/play-overlay.react-component.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return d;
        });
        var r = n("./node_modules/@udemy/icons/dist/play-overlay.ud-icon");
        var s = n.n(r);
        var o = n("./node_modules/classnames/index.js");
        var i = n.n(o);
        var a = n("./node_modules/react/index.js");
        var c = n.n(a);
        const d = (e) => {
          let { size: t = "xlarge", className: n } = e;
          return c.a.createElement(
            "span",
            { className: i()("ud-play-overlay", n) },
            c.a.createElement(s.a, {
              label: false,
              className: "ud-focus-visible-target",
              color: "inherit",
              size: t,
            })
          );
        };
      },
    "./node_modules/@udemy/sentry/dist/esm/index.js": function (e, t, n) {
      "use strict";
      function r() {
        if (typeof window === "undefined") {
          return true;
        } else {
          return !!window.URLSearchParams;
        }
      }
      function s() {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) {
          t[n] = arguments[n];
        }
        return function (e) {
          return t.reduce((e, t) => {
            if (!e) {
              return null;
            }
            return t(e);
          }, e);
        };
      }
      const o = function (e) {
        return r() ? e : null;
      };
      const i = function (e) {
        c(e).forEach((e) => {
          if (e.filename && !e.filename.endsWith(".js")) {
            e.filename = "<not-a-js-file-see-@udemy-sentry>";
          }
        });
        return e;
      };
      const a = function (e) {
        var t, n;
        const r = c(e);
        if (
          r.length > 0 &&
          (t = r[r.length - 1]) !== null &&
          t !== void 0 &&
          (n = t.filename) !== null &&
          n !== void 0 &&
          n.includes("videojs")
        ) {
          if (e) {
            e.fingerprint = ["videojs"];
          }
        }
        return e;
      };
      const c = function (e) {
        var t;
        const n =
          ((e === null || e === void 0 ? void 0 : e.exception) &&
            (e === null || e === void 0
              ? void 0
              : (t = e.exception) === null || t === void 0
              ? void 0
              : t.values)) ||
          [];
        if (n.length > 0) {
          const e = n[0];
          return (e.stacktrace && e.stacktrace.frames) || [];
        }
        return [];
      };
      function d(e) {
        return s(o, a, i)(e);
      }
      const u = [
        /^Blocked a frame with origin.*Protocols, domains, and ports must match/,
        "__gCrWeb.autofill.extractForms",
        "ResizeObserver loop limit exceeded",
        /window\.setupAdForm/,
        /_avast_submit/,
        /vid_mate_check/,
        /__show__deepen is not defined/,
        /NS_ERROR_NOT_INITIALIZED/,
        /Loading chunk [^ ]* failed/,
        /Previously handled exception: /,
        /['"]vdata\d+['"]/,
        /\$compile:tpload.*Failed to load template:.*display_type=popup.*HTTP status: (-1|403)/,
        'can\'t redefine non-configurable property "userAgent"',
        "_isMatchingDomain is not defined",
        /^Failed to execute 'postMessage' on 'Window'.*could not be cloned/,
        /Unexpected token else/,
        "top.GLOBALS",
        "originalCreateNotification",
        "canvas.contentDocument",
        "MyApp_RemoveAllHighlights",
        "http://tt.epicplay.com",
        "Can't find variable: ZiteReader",
        "jigsaw is not defined",
        "ComboSearch is not defined",
        "http://loading.retry.widdit.com/",
        "atomicFindClose",
        "fb_xd_fragment",
        "bmi_SafeAddOnload",
        "EBCallBackMessageReceived",
        "conduitPage",
        "Request aborted",
        /^Network Error$/,
        new RegExp(".*timeout of .* exceeded.*"),
        "Cannot read property 'currentTime' of null",
        "Cannot read property 'play' of null",
        "null has no properties",
        "videojs",
      ];
      class l {
        constructor() {
          this.sentryInstance = void 0;
        }
        setSentryInstance(e) {
          this.sentryInstance = e;
        }
        initializeSentry(e, t) {
          if (!t.ignoreErrors) {
            t.ignoreErrors = u;
          }
          try {
            e.init(t);
          } catch (e) {
            console.error(e);
          }
          this.setSentryInstance(e);
        }
        initializeSentryContext(e) {
          const { user_id: t, ...n } = e;
          if (e.user_id) {
            this.sentryInstance.setUser({ id: t });
          }
          this.sentryInstance.setTags({ ...n });
        }
        captureException(e) {
          if (this.sentryInstance) {
            console.error("Sentry.captureException called with:", e);
            this.sentryInstance.captureException(e);
          }
        }
      }
      const p = new l();
      const m = p.captureException.bind(p);
      n.d(t, "b", function () {
        return p;
      });
      n.d(t, "a", function () {
        return m;
      });
    },
    "./node_modules/@udemy/shared-utils/dist/esm/browser-log-collection/browser-log-collection.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return i;
        });
        var r = n("./node_modules/axios/index.js");
        var s = n.n(r);
        var o = n(
          "./node_modules/@udemy/shared-utils/dist/esm/data/get-config-data.js"
        );
        class i {
          constructor(e) {
            this._clientToken = void 0;
            this._url = void 0;
            this._service = void 0;
            this._clientToken = "pub4ecb41fd37fb63f77d38e05f54b0fb29";
            this._url = `https://browser-http-intake.logs.datadoghq.com/v1/input/${this._clientToken}`;
            this._service = e ? `website-django.${e}` : "website-django";
          }
          get _env() {
            return Object(o["a"])().env;
          }
          _sendLog(e, t) {
            let n =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : {};
            if (this._env !== "PROD") {
              return;
            }
            const r = Object.assign(
              {
                level: e,
                message: t,
                ddsource: "browser",
                service: this._service,
                ddtags: `env:${this._env}`,
              },
              n
            );
            s.a.post(this._url, r);
          }
          info() {
            for (
              var e = arguments.length, t = new Array(e), n = 0;
              n < e;
              n++
            ) {
              t[n] = arguments[n];
            }
            this._sendLog("info", ...t);
          }
          debug() {
            for (
              var e = arguments.length, t = new Array(e), n = 0;
              n < e;
              n++
            ) {
              t[n] = arguments[n];
            }
            this._sendLog("debug", ...t);
          }
          warn() {
            for (
              var e = arguments.length, t = new Array(e), n = 0;
              n < e;
              n++
            ) {
              t[n] = arguments[n];
            }
            this._sendLog("warn", ...t);
          }
          error() {
            for (
              var e = arguments.length, t = new Array(e), n = 0;
              n < e;
              n++
            ) {
              t[n] = arguments[n];
            }
            this._sendLog("error", ...t);
          }
        }
      },
    "./node_modules/@udemy/shared-utils/dist/esm/data/get-config-data.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return o;
        });
        n.d(t, "b", function () {
          return a;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
        );
        const s = "update-uddata-provider";
        function o() {
          return r["a"].global.UD.Config;
        }
        const i = (e) => {
          switch (typeof e) {
            case "object":
              return e;
            case "string":
              try {
                return JSON.parse(e.replace(/\\054/g, ",").replace(/'/g, '"'));
              } catch (e) {
                return null;
              }
            default:
              return null;
          }
        };
        function a(e) {
          e = i(e);
          if (!e) {
            return;
          }
          const t = r["a"].global.UD;
          Object.keys(e).forEach((n) => {
            const r = e[n];
            if (t[n]) {
              Object.assign(t[n], r);
            } else {
              t[n] = r;
            }
          });
          if (r["a"].isClient) {
            window.dispatchEvent(new CustomEvent(s, { detail: e }));
          }
        }
      },
    "./node_modules/@udemy/shared-utils/dist/esm/data/get-request-data.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "b", function () {
          return s;
        });
        n.d(t, "a", function () {
          return o;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
        );
        function s() {
          if (r["a"].isClient && location.search) {
            const e = r["a"].global.UD.request;
            const t = location.search.substring(1).split("&");
            for (let n = 0; n < t.length; n++) {
              const [r, s] = t[n].split("=");
              if (r && r.indexOf("_request__") === 0) {
                e[r.replace("_request__", "")] = s || true;
              }
            }
          }
        }
        function o() {
          return r["a"].global.UD.request;
        }
      },
    "./node_modules/@udemy/shared-utils/dist/esm/env/constants.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "a", function () {
        return c;
      });
      var r = n("./node_modules/mobx/lib/mobx.module.js");
      var s = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-config-data.js"
      );
      var o = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-request-data.js"
      );
      var i = n("./node_modules/@udemy/shared-utils/dist/esm/env/ud-me.js");
      const a = (e, t) => t.reduce((e, t) => (e && e[t] ? e[t] : null), e);
      const c = {
        course: {
          extract: (e) => {
            const t = a(e, ["locale", "locale"]);
            return {
              course_id: a(e, ["id"]),
              course_title: a(e, ["title"]),
              course_topic: a(e, ["context_info", "label", "display_name"]),
              course_category: a(e, ["primary_category", "title"]),
              course_subcategory: a(e, ["primary_subcategory", "title"]),
              course_avg_rating: a(e, ["avg_rating_recent"]),
              course_instructor_name: a(e, [
                "visible_instructors",
                0,
                "display_name",
              ]),
              course_language: t ? t.split("_")[0] : null,
              course_locale: t,
              course_length_minutes: a(e, ["estimated_content_length"]),
              course_num_enrollments: a(e, ["num_subscribers"]),
            };
          },
          params: {
            "fields[course]":
              "title,context_info,primary_category,primary_subcategory,avg_rating_recent,visible_instructors,locale,estimated_content_length,num_subscribers",
          },
          url: (e) => `/courses/${e}/`,
        },
        user: {
          extract: async (e) => {
            const t = Object(i["a"])();
            await Object(r["D"])(
              () => !(t !== null && t !== void 0 && t.isLoading)
            );
            if (t !== null && t !== void 0 && t.id) {
              if (e) {
                return {
                  is_first_paid_purchase:
                    a(t, ["number_of_courses_purchased"]) === e,
                };
              }
              return {
                isMember: true,
                user_language: a(t, ["language"]),
                user_locale: a(t, ["locale"]),
                user_location: a(t, ["country"]),
                has_made_paid_purchase: t.has_made_paid_purchase,
              };
            }
            const n = a(Object(o["a"])(), ["locale"]);
            return {
              isMember: false,
              user_language: n ? n.split("_")[0] : null,
              user_locale: n,
              user_location: a(Object(s["a"])(), ["price_country", "id"]),
              has_made_paid_purchase: false,
            };
          },
        },
      };
    },
    "./node_modules/@udemy/shared-utils/dist/esm/env/get-os-name.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "a", function () {
        return s;
      });
      var r = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
      );
      function s() {
        const e = r["a"].global.navigator.userAgent,
          t = r["a"].global.navigator.platform,
          n = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
          s = ["Win32", "Win64", "Windows", "WinCE"],
          o = [
            "iPhone",
            "iPad",
            "iPod",
            "iPhone Simulator",
            "iPad Simulator",
            "iPod Simulator",
          ];
        let i = "other";
        if (n.indexOf(t) !== -1) {
          i = "mac os";
        } else if (o.indexOf(t) !== -1) {
          i = "ios";
        } else if (s.indexOf(t) !== -1) {
          i = "windows";
        } else if (/Android/.test(e)) {
          i = "android";
        } else if (/Linux/.test(t)) {
          i = "linux";
        }
        return i;
      }
    },
    "./node_modules/@udemy/shared-utils/dist/esm/env/is-mobile-app.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return a;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/env/query-params.js"
        );
        var s = n(
          "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
        );
        let o = null;
        function i() {
          o = null;
        }
        function a() {
          let e =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : { cache: true };
          let t = o;
          if (!t || !e.cache) {
            t = Object(r["a"])(s["a"].global.location).display_type;
            if (e.cache) {
              o = t;
            }
          }
          return t === "mobile_app";
        }
      },
    "./node_modules/@udemy/shared-utils/dist/esm/env/query-params.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return o;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/node_modules/qs/lib/index.js"
        );
        var s = n.n(r);
        function o() {
          let e =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : window.location;
          return s.a.parse(e.search, { ignoreQueryPrefix: true });
        }
        function i(e, t) {
          if (typeof e === "boolean") {
            return e;
          }
          const n = {
            0: false,
            1: true,
            false: false,
            true: true,
            on: true,
            off: false,
            enabled: true,
            disabled: false,
          };
          const r = (e || "").toLowerCase();
          if (n[r] === undefined) {
            return t;
          }
          return n[r];
        }
        function a(e, t, n) {
          if (t.indexOf(e) >= 0) {
            return e;
          }
          return n;
        }
        function c(e, t) {
          const n = parseInt(e, 10);
          if (isNaN(n)) {
            return t;
          }
          return n;
        }
        function d(e, t) {
          return e || t;
        }
      },
    "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js":
      function (e, t, n) {
        "use strict";
        (function (e) {
          n.d(t, "a", function () {
            return s;
          });
          const r = typeof window === "undefined";
          const s = { isServer: r, isClient: !r, global: r ? e : window };
        }.call(this, n("./node_modules/webpack/buildin/global.js")));
      },
    "./node_modules/@udemy/shared-utils/dist/esm/env/ud-me.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "a", function () {
        return s;
      });
      var r = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
      );
      const s = () => {
        var e;
        return (e = r["a"].global.UD) === null || e === void 0 ? void 0 : e.me;
      };
    },
    "./node_modules/@udemy/shared-utils/dist/esm/env/ud-performance.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return s;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
        );
        const s = () => {
          var e;
          return (e = r["a"].global.UD) === null || e === void 0
            ? void 0
            : e.performance;
        };
      },
    "./node_modules/@udemy/shared-utils/dist/esm/env/ud-user-agnostic-tracking-params.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return s;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
        );
        const s = () => {
          var e;
          return (e = r["a"].global.UD) === null || e === void 0
            ? void 0
            : e.userAgnosticTrackingParams;
        };
      },
    "./node_modules/@udemy/shared-utils/dist/esm/env/ud-visiting.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "a", function () {
        return s;
      });
      var r = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
      );
      const s = () => {
        var e;
        return (e = r["a"].global.UD) === null || e === void 0
          ? void 0
          : e.visiting;
      };
    },
    "./node_modules/@udemy/shared-utils/dist/esm/env/ud-visitor-uuid.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return c;
        });
        var r = n("./node_modules/js-cookie/src/js.cookie.js");
        var s = n.n(r);
        var o = n(
          "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
        );
        var i = n(
          "./node_modules/@udemy/shared-utils/dist/esm/env/ud-visiting.js"
        );
        const a = "__udmy_2_v57r";
        function c() {
          const e = Object(i["a"])();
          if (e.isLoading) {
            return null;
          }
          return e.visitor_uuid || s.a.get(a) || null;
        }
        function d() {
          const e = Object(i["a"])();
          if (e.isLoading) {
            return;
          }
          o["a"].global.UD.visiting.visitor_uuid = null;
          s.a.remove(a, {
            path: "/",
            domain: o["a"].global.location.hostname.replace("www", ""),
          });
        }
      },
    "./node_modules/@udemy/shared-utils/dist/esm/escape/safely-set-inner-html.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return r;
        });
        function r(e) {
          let {
            descriptionOfCaller: t,
            html: r,
            dataPurpose: s = undefined,
            domPurifyConfig: o = undefined,
          } = e;
          const { DOMPurify: i } = n(
            "./node_modules/@udemy/shared-utils/dist/esm/iso/iso-dompurify.js"
          );
          const a = i.sanitize(r, o);
          s = s || `safely-set-inner-html:${t}`;
          return {
            "data-purpose": s,
            "data-testid": s,
            dangerouslySetInnerHTML: { __html: a },
          };
        }
      },
    "./node_modules/@udemy/shared-utils/dist/esm/i18n/date.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "c", function () {
        return o;
      });
      n.d(t, "f", function () {
        return i;
      });
      n.d(t, "e", function () {
        return a;
      });
      n.d(t, "a", function () {
        return d;
      });
      n.d(t, "d", function () {
        return u;
      });
      n.d(t, "b", function () {
        return p;
      });
      var r = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-request-data.js"
      );
      const s = {
        "en-US": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 0, 1, 0],
        "de-DE": [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
        "es-ES": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
        "fr-FR": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
        "id-ID": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
        "it-IT": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
        "ja-JP": [/^(\d+)\/(\d+)\/(\d+)$/, 0, 1, 2, 0],
        "ko-KR": [/^(\d+)\. ?(\d+)\. ?(\d+)\.?$/, 0, 1, 2, 0],
        "nl-NL": [/^(\d+)-(\d+)-(\d+)$/, 2, 1, 0, 0],
        "pl-PL": [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
        "pt-BR": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 0],
        "ro-RO": [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
        "ru-RU": [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
        "th-TH": [/^(\d+)\/(\d+)\/(\d+)$/, 2, 1, 0, 543],
        "tr-TR": [/^(\d+)\.(\d+)\.(\d+)$/, 2, 1, 0, 0],
        "zh-CN": [/^(\d+)\/(\d+)\/(\d+)$/, 0, 1, 2, 0],
        "zh-TW": [/^(\d+)\/(\d+)\/(\d+)$/, 0, 1, 2, 0],
        ISO: [/^(\d+)-(\d+)-(\d+)$/, 0, 1, 2, 0],
      };
      function o(e, t) {
        if (!t) {
          t = Object(r["a"])().locale.replace("_", "-") || "en-US";
        }
        const n = s[t];
        if (!n) {
          throw new Error(`Unknown locale ${t} for parsing date string.`);
        }
        const [o, i, a, c, d] = n;
        const u = e.match(o) || [];
        const l = parseInt(u[i + 1], 10) || 0;
        const p = parseInt(u[a + 1], 10) || 0;
        const m = parseInt(u[c + 1], 10) || 0;
        if (u.length !== 4 || p < 1 || p > 12 || m < 1 || m > 31 || l < 100) {
          throw new Error("Invalid date");
        }
        return new Date(l - d, p - 1, m);
      }
      function i(e, t) {
        const n = Object(r["a"])().locale.replace("_", "-") || "en-US";
        return e.toLocaleDateString(n, t);
      }
      function a(e) {
        return `${e.getFullYear()}-${(e.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${e.getDate().toString().padStart(2, "0")}`;
      }
      const c = Object.freeze({ DAY: "day", MONTH: "month" });
      function d(e, t) {
        let n =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : c.DAY;
        e = new Date(e);
        t = new Date(t);
        e.setHours(0, 0, 0, 0);
        t.setHours(0, 0, 0, 0);
        if (n === c.MONTH) {
          e.setDate(1);
          t.setDate(1);
        }
        if (e > t) {
          return 1;
        } else if (e < t) {
          return -1;
        }
        return 0;
      }
      d.UNIT = c;
      function u(e, t) {
        const n = new Date(e);
        const r = n.getDay();
        const s = t - r;
        n.setDate(n.getDate() + s);
        return n;
      }
      const l = Object.freeze({ DAY: "day", MONTH: "month", YEAR: "year" });
      function p(e, t, n) {
        const r = new Date(e);
        if (n === l.DAY) {
          r.setDate(r.getDate() + t);
        } else if (n === l.MONTH) {
          r.setMonth(r.getMonth() + t);
        } else if (n === l.YEAR) {
          r.setFullYear(r.getFullYear() + t);
        }
        return r;
      }
      p.UNIT = l;
    },
    "./node_modules/@udemy/shared-utils/dist/esm/index.js": function (e, t, n) {
      "use strict";
      var r = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-config-data.js"
      );
      n.d(t, "k", function () {
        return r["b"];
      });
      var s = n(
        "./node_modules/@udemy/shared-utils/dist/esm/escape/safely-set-inner-html.js"
      );
      var o = n("./node_modules/@udemy/shared-utils/dist/esm/i18n/date.js");
      n.d(t, "a", function () {
        return o["a"];
      });
      n.d(t, "b", function () {
        return o["b"];
      });
      n.d(t, "g", function () {
        return o["c"];
      });
      n.d(t, "h", function () {
        return o["d"];
      });
      n.d(t, "i", function () {
        return o["e"];
      });
      n.d(t, "j", function () {
        return o["f"];
      });
      var i = n("./node_modules/@udemy/shared-utils/dist/esm/lodashy/noop.js");
      n.d(t, "f", function () {
        return i["a"];
      });
      var a = n(
        "./node_modules/@udemy/shared-utils/dist/esm/react/ud-prop-types.js"
      );
      n.d(t, "c", function () {
        return a["b"];
      });
      n.d(t, "d", function () {
        return a["c"];
      });
      n.d(t, "e", function () {
        return a["d"];
      });
    },
    "./node_modules/@udemy/shared-utils/dist/esm/iso/iso-dompurify.js":
      function (e, t, n) {
        "use strict";
        n.r(t);
        var r = n("./node_modules/dompurify/dist/purify.js");
        var s = n.n(r);
        var o = n(
          "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
        );
        const i = o["a"].global.JSDOM;
        n.d(t, "DOMPurify", function () {
          return c;
        });
        const a = typeof i !== "undefined" ? new i("").window : window;
        const c = s()(a);
      },
    "./node_modules/@udemy/shared-utils/dist/esm/lodashy/debounce.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return r;
        });
        function r(e, t) {
          let n = null;
          const r = () => {
            if (n) {
              clearTimeout(n);
              n = null;
            }
          };
          const s = function () {
            for (
              var r = arguments.length, s = new Array(r), o = 0;
              o < r;
              o++
            ) {
              s[o] = arguments[o];
            }
            const i = () => {
              n = null;
              e(...s);
            };
            clearTimeout(n);
            n = setTimeout(i, t);
          };
          s.cancel = r;
          return s;
        }
      },
    "./node_modules/@udemy/shared-utils/dist/esm/lodashy/noop.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "a", function () {
        return r;
      });
      const r = function () {};
    },
    "./node_modules/@udemy/shared-utils/dist/esm/lodashy/range.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "a", function () {
        return r;
      });
      function r(e) {
        return Array(e)
          .fill("_")
          .map((e, t) => t);
      }
    },
    "./node_modules/@udemy/shared-utils/dist/esm/onetrust/get-user-consent-categories.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return o;
        });
        n.d(t, "b", function () {
          return i;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
        );
        class s {}
        s.STRICTLY_NECESSARY = "C0001";
        s.PERFORMANCE = "C0002";
        s.FUNCTIONAL = "C0003";
        s.ADVERTISING = "C0004";
        s.SOCIAL_MEDIA = "C0005";
        class o {
          static allows(e) {
            const t = r["a"].global.OnetrustActiveGroups;
            if (!t || typeof e == "undefined") {
              return false;
            }
            return t.includes(e);
          }
          static allowsAllCookieCategories() {
            return (
              this.allows(s.PERFORMANCE) &&
              this.allows(s.FUNCTIONAL) &&
              this.allows(s.ADVERTISING) &&
              this.allows(s.SOCIAL_MEDIA)
            );
          }
          static requiresCookieOpIn(e) {
            const t = e.GetDomainData().ConsentModel;
            return t.Name === "opt-in";
          }
          static isMx() {
            return !UD.Config.brand.has_organization;
          }
          static isUb() {
            return UD.Config.brand.has_organization;
          }
          static isInCalifornia(e) {
            const t = e.getGeolocationData();
            return t.country === "US" && t.state === "CA";
          }
          static allowsGoogleAnalytics() {
            return this.isMx() && this.allows(s.PERFORMANCE);
          }
          static allowsGoogleTagManager(e) {
            if (typeof e !== "undefined" && e.has(o.DEBUG_FORCE_LOAD_GTM)) {
              return true;
            }
            const t = r["a"].global.OneTrust;
            if (!t) {
              return false;
            }
            if (
              this.isUb() ||
              this.requiresCookieOpIn(t) ||
              this.isInCalifornia(t)
            ) {
              return this.allowsAllCookieCategories();
            }
            return true;
          }
          static toGtagEventData() {
            return {
              ad_storage: this.allows(s.ADVERTISING) ? "true" : "false",
              analytics_storage: this.allows(s.PERFORMANCE) ? "true" : "false",
              functionality_storage: this.allows(s.FUNCTIONAL)
                ? "true"
                : "false",
              personalization_storage: this.allows(s.SOCIAL_MEDIA)
                ? "true"
                : "false",
              security_storage: "true",
            };
          }
        }
        o.DEBUG_FORCE_LOAD_GTM = "debugForceLoadGTM";
        function i(e) {
          const t = e || r["a"].global.OnetrustActiveGroups;
          if (t) {
            return t
              .split(",")
              .filter((e) => e)
              .sort()
              .join(",");
          }
          return "";
        }
      },
    "./node_modules/@udemy/shared-utils/dist/esm/react/get-display-name.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return r;
        });
        const r = (e) => e.displayName || e.name || "Component";
      },
    "./node_modules/@udemy/shared-utils/dist/esm/react/make-hoc.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "a", function () {
        return a;
      });
      var r = n(
        "./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js"
      );
      var s = n.n(r);
      var o = n("./node_modules/react/index.js");
      var i = n.n(o);
      function a(e) {
        let { useGetData: t, getDisplayName: n, getPropTypes: r } = e;
        return (e) => {
          var o, a;
          const c = i.a.forwardRef((n, r) => {
            const s = t(n);
            return i.a.createElement(e, Object.assign({ ref: r }, s, n));
          });
          const d =
            (o = (a = e.displayName) !== null && a !== void 0 ? a : e.name) !==
              null && o !== void 0
              ? o
              : "Component";
          c.displayName = n(d);
          c.defaultProps = e.defaultProps;
          if (e.propTypes) {
            c.propTypes = r(e.propTypes);
          }
          return s()(c, e);
        };
      }
    },
    "./node_modules/@udemy/shared-utils/dist/esm/react/ud-prop-types.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "c", function () {
          return p;
        });
        n.d(t, "d", function () {
          return m;
        });
        n.d(t, "b", function () {
          return g;
        });
        n.d(t, "a", function () {
          return f;
        });
        var r = n("./node_modules/prop-types/index.js");
        var s = n.n(r);
        var o = n("./node_modules/react/index.js");
        var i = n.n(o);
        function a(e, t) {
          return function (n, r, s, o, i, a) {
            if (n[r] === undefined && t) {
              i = i || r;
              return new Error(
                `The ${o} \`${i}\` is marked as required in \`${s}\`, ` +
                  "but its value is `undefined`."
              );
            }
            return e(n, r, s, o, i, a);
          };
        }
        function c(e) {
          const t = a(e, false);
          t.isRequired = a(e, true);
          return t;
        }
        const d = c((e, t, n, r, o, i) =>
          s.a.instanceOf(Element)(e, t, n, r, o, i)
        );
        const u = c((e, t, n, r, o, i) => {
          const a = s.a.element(e, t, n, r, o, i);
          if (a instanceof Error) {
            return a;
          }
          if (typeof e[t].type !== "string") {
            o = o || t;
            return new Error(
              `Invalid ${r} \`${o}\` supplied to \`${n}\`, ` +
                "expected a React element but received a React component."
            );
          }
        });
        const l = c((e, t, n, r, o, i) => {
          const a = s.a.element(e, t, n, r, o, i);
          if (a instanceof Error) {
            return a;
          }
          o = o || t;
          const c = e[t].type;
          if (!c.prototype) {
            return new Error(
              `Invalid ${r} \`${o}\` supplied to \`${n}\`, ` +
                "expected a React class-based component, but received a React element."
            );
          }
          if (!c.prototype.render) {
            return new Error(
              `Invalid ${r} \`${o}\` supplied to \`${n}\`, ` +
                "expected a React class-based component, but received a React functional " +
                "component."
            );
          }
        });
        function p(e) {
          return (t) => {
            function n(n, r, s, o, i) {
              i = i || r;
              if (n[r] === undefined) {
                if (n[e]) {
                  return new Error(
                    `The ${o} \`${i}\` is marked as required in \`${s}\`\n                        if the prop \`${e}\` is provided, but its value is \`undefined\`.`
                  );
                }
                return null;
              }
              for (
                var a = arguments.length,
                  c = new Array(a > 5 ? a - 5 : 0),
                  d = 5;
                d < a;
                d++
              ) {
                c[d - 5] = arguments[d];
              }
              return t(n, r, s, o, i, ...c);
            }
            n.isRequired = n.bind(null);
            return n;
          };
        }
        function m(e) {
          return (t) => {
            function n(n, r, s, o, i) {
              i = i || r;
              if (n[r] === undefined) {
                if (!n[e]) {
                  return new Error(
                    `The ${o} \`${i}\` is marked as required in \`${s}\`\n                        if the prop \`${e}\` is not provided, but its value is \`undefined\`.`
                  );
                }
                return null;
              }
              for (
                var a = arguments.length,
                  c = new Array(a > 5 ? a - 5 : 0),
                  d = 5;
                d < a;
                d++
              ) {
                c[d - 5] = arguments[d];
              }
              return t(n, r, s, o, i, ...c);
            }
            n.isRequired = n.bind(null);
            return n;
          };
        }
        function g(e) {
          return (t) => {
            function n(n, r, s, o, i) {
              i = i || r;
              if (n[r] !== undefined && n[e] !== undefined) {
                return new Error(
                  `The ${o} \`${i}\` is marked in \`${s}\` as mutually exclusive\n                    with the prop \`${e}\`, but both have been provided.`
                );
              }
              for (
                var a = arguments.length,
                  c = new Array(a > 5 ? a - 5 : 0),
                  d = 5;
                d < a;
                d++
              ) {
                c[d - 5] = arguments[d];
              }
              return t(n, r, s, o, i, ...c);
            }
            return n;
          };
        }
        function f() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) {
            t[n] = arguments[n];
          }
          const r = (e, n, r, s) => {
            const o = n[r];
            const a = r === "children" ? i.a.Children.toArray(o) : [o];
            if (e && a.length === 0) {
              return new Error(`${s} requires ${t.join("|")} ${r}`);
            }
            for (const n of a) {
              if (e && !n) {
                return new Error(`${s} requires ${t.join("|")} ${r}`);
              }
              if (n && (!n.type || t.every((e) => n.type.$$udType !== e))) {
                return new Error(`${s} only accepts ${t.join("|")} ${r}`);
              }
            }
          };
          const s = r.bind(null, false);
          s.isRequired = r.bind(null, true);
          return s;
        }
      },
    "./node_modules/@udemy/shared-utils/dist/esm/storage/ud-expiring-local-storage-with-key-ttls.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return o;
        });
        var r = n("./node_modules/mobx/lib/mobx.module.js");
        var s = n(
          "./node_modules/@udemy/shared-utils/dist/esm/storage/ud-expiring-local-storage.js"
        );
        function o(e, t, n) {
          const o = 1e3;
          const i = c();
          const a = Object(s["a"])(e, t, i);
          setTimeout(d, 5e3);
          return {
            set(n, r) {
              if (a.size() < o) {
                const e = c();
                const t = { value: r, valid_until: e.getTime() };
                a.set(n, t);
                a.updateExpiration(e);
              } else {
                throw new Error(`${e}:${t} is full to hold new items`);
              }
            },
            get(e) {
              const t = new Date().getTime();
              const n = a.get(e);
              if (n) {
                if (n.valid_until >= t) {
                  return n.value;
                }
                this.delete(e);
              }
              return null;
            },
            delete(e) {
              a.delete(e);
            },
            clear() {
              a.clear();
            },
          };
          function c() {
            return new Date(Date.now() + n);
          }
          function d() {
            const e = new Date().getTime();
            Object(r["x"])(() => {
              for (const t of a.keys()) {
                if (a.get(t).valid_until < e) {
                  a.delete(t);
                }
              }
            });
          }
        }
      },
    "./node_modules/@udemy/shared-utils/dist/esm/storage/ud-expiring-local-storage.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return l;
        });
        var r = n("./node_modules/mobx/lib/mobx.module.js");
        var s = n(
          "./node_modules/@udemy/shared-utils/node_modules/store/src/store-engine.js"
        );
        var o = n.n(s);
        var i = n(
          "./node_modules/@udemy/shared-utils/node_modules/store/storages/localStorage.js"
        );
        var a = n.n(i);
        var c = n(
          "./node_modules/@udemy/shared-utils/node_modules/store/storages/memoryStorage.js"
        );
        var d = n.n(c);
        const u = o.a.createStore([a.a, d.a], []);
        function l(e, t, n) {
          const s = Object(r["t"])({
            cacheKey: `${e}:${t}`,
            expirations: r["t"].map(),
            expirationsCacheKey: "expiringLocalStorageFactory.expirations",
            storedValues: r["t"].map(),
          });
          s.expirations.observe(() => {
            const e = u.get(s.expirationsCacheKey) || {};
            const t = Object.assign(e, Object(r["A"])(s.expirations));
            u.set(s.expirationsCacheKey, t);
          });
          Object(r["e"])(() => {
            try {
              s.storedValues.merge(u.get(s.cacheKey) || {});
              s.expirations.merge(u.get(s.expirationsCacheKey) || {});
            } catch (e) {}
            const e = new Date();
            s.expirations.forEach((t, n) => {
              if (new Date(t) < e) {
                u.remove(n);
                const e = u.get("expiringLocalStorageFactory.expirations");
                delete e[n];
                u.set(s.expirationsCacheKey, e);
                s.expirations.delete(n);
                s.storedValues.clear();
              }
            });
          })();
          s.storedValues.observe(() => {
            u.set(s.cacheKey, s.storedValues);
            if (!n || s.expirations.get(s.cacheKey)) {
              return;
            }
            s.expirations.set(s.cacheKey, n);
          });
          return {
            set: Object(r["e"])((e, t) => {
              const n = u.get(s.cacheKey) || {};
              s.storedValues.merge(n);
              s.storedValues.set(e, t);
            }),
            get(e) {
              return s.storedValues.get(e);
            },
            delete: Object(r["e"])((e) => {
              s.storedValues.delete(e);
            }),
            keys() {
              return s.storedValues.keys();
            },
            size() {
              return s.storedValues.size;
            },
            clear: Object(r["e"])(() => {
              s.storedValues.clear();
              u.remove(s.cacheKey);
              u.remove(s.expirationsCacheKey);
              o(s.cacheKey);
            }),
            updateExpiration: Object(r["e"])((e) => {
              s.expirations.set(s.cacheKey, e);
            }),
          };
          function o(e) {
            s.expirations.delete(e);
          }
        }
      },
    "./node_modules/@udemy/shared-utils/dist/esm/webview/webview-bridge.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return o;
        });
        var r = n(
          "./node_modules/@udemy/shared-utils/dist/esm/env/get-os-name.js"
        );
        var s = n(
          "./node_modules/@udemy/shared-utils/dist/esm/env/is-mobile-app.js"
        );
        class o {
          constructor(e) {
            this.argWindow = e;
            if (typeof e !== "undefined") {
              this.argWindow = e;
            } else if (typeof window !== "undefined") {
              this.argWindow = window;
            }
          }
          getAndroidClient() {
            var e, t;
            if (
              i() &&
              typeof ((e = this.argWindow) === null || e === void 0
                ? void 0
                : (t = e.AndroidClient) === null || t === void 0
                ? void 0
                : t.postMessage) === "function"
            ) {
              return this.argWindow.AndroidClient.postMessage.bind(
                this.argWindow.AndroidClient
              );
            }
            return null;
          }
          getiOSClient() {
            var e, t;
            if (
              a() &&
              typeof ((e = this.argWindow) === null || e === void 0
                ? void 0
                : (t = e.webkit) === null || t === void 0
                ? void 0
                : t.messageHandlers.iOSClient.postMessage) === "function"
            ) {
              return this.argWindow.webkit.messageHandlers.iOSClient.postMessage.bind(
                this.argWindow.webkit.messageHandlers.iOSClient
              );
            }
            return null;
          }
          sendMessage(e) {
            const t = this.getAndroidClient();
            if (t) {
              var n;
              t(JSON.stringify(e));
              if (
                e.sendLegacyAndroidMessage &&
                (n = this.argWindow) !== null &&
                n !== void 0 &&
                n.AndroidClient
              ) {
                var r;
                e.sendLegacyAndroidMessage(
                  (r = this.argWindow) === null || r === void 0
                    ? void 0
                    : r.AndroidClient
                );
              }
            } else {
              const t = this.getiOSClient();
              if (t) {
                t(JSON.stringify(e));
              }
            }
          }
        }
        function i() {
          return Object(s["a"])() && Object(r["a"])() === "android";
        }
        function a() {
          return Object(s["a"])() && Object(r["a"])() === "ios";
        }
      },
    "./node_modules/@udemy/shopping/dist/esm/external/enhanced-form-elements/checkbox-with-loader.module.css":
      function (e, t, n) {
        e.exports = {
          "loader-state": "checkbox-with-loader-module--loader-state--1x-0x",
          "loader-icon": "checkbox-with-loader-module--loader-icon--3OYh2",
        };
      },
    "./node_modules/@udemy/shopping/dist/esm/index.js": function (e, t, n) {
      "use strict";
      var r = n(
        "./node_modules/@babel/runtime/helpers/applyDecoratedDescriptor.js"
      );
      var s = n.n(r);
      var o = n("./node_modules/mobx/lib/mobx.module.js");
      var i = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/tracker.js"
      );
      const a = {
        INVALID: "invalid",
        EXPIRED: "expired",
        SOLD_OUT: "sold_out",
        UNUSED: "unused",
        APPLIED: "applied",
        APPLIED_HIDDEN: "applied_hidden",
      };
      const c = "discountCode";
      const d = "couponCode";
      const u = { ADD: "add", REMOVE: "remove", MOVE: "move" };
      var l = n(
        "./node_modules/@babel/runtime/helpers/initializerDefineProperty.js"
      );
      var p = n.n(l);
      var m = n(
        "./node_modules/@babel/runtime/helpers/initializerWarningHelper.js"
      );
      const g = {
        errors: (e) => ({
          default: e("An unknown error occurred."),
          discount: {
            invalid: {
              singular: e("<b>%(code)s</b> is invalid, and has been removed."),
              plural: e("<b>%(code)s</b> are invalid, and have been removed."),
            },
            expired: {
              singular: e("<b>%(code)s</b> is expired, and has been removed."),
              plural: e("<b>%(code)s</b> are expired, and have been removed."),
            },
            sold_out: {
              singular: e("<b>%(code)s</b> is sold out, and has been removed."),
              plural: e("<b>%(code)s</b> are sold out, and have been removed."),
            },
          },
          discountCodeInputFormat: e(
            "The coupon code entered is not valid for this course. Perhaps you used the wrong coupon code?"
          ),
          discountDuplicated: e(
            "The coupon code entered has already been used."
          ),
        }),
        patterns: { validDiscountCode: /^([a-zA-Z0-9._-]){4,255}$/ },
        shoppingListNamespaces: ["cartPage", "checkout", "dropdown"],
        shoppingListTypes: ["cart", "express", "saved_for_later", "wishlist"],
        storage: {
          status: {
            notReady: "notReady",
            ready: "ready",
            unAvailable: "unAvailable",
          },
        },
        strings: (e) => ({
          recommendations: {
            alsoLike: e("You might also like"),
            alsoViewed: e("Students Who Viewed This Course Also Viewed"),
            addedToCartTitle: e("Because you added %(title)s"),
            categoryBasedTitle: e("Bestsellers in %(title)s"),
            multipleEnrollmentBasedTitle: e("Based on Your Enrollments"),
            frequentlyBoughtTitle: e(
              "Frequently Bought Together with %(title)s"
            ),
            labelTitle: e("Bestsellers in %(title)s"),
            labelClusterTitle: e("Bestsellers in %(title)s"),
            recentlyViewedTitle: e("Recently viewed"),
            moreFromInstructor: e("More from this Instructor"),
            singleEnrollmentBasedTitle: e("Because you enrolled in %(title)s"),
            wishlistTitle: e("Wishlist"),
          },
          exploreAction: {
            cartSuccess: e("Go to Cart"),
            purchaseSuccess: e("Discover More Courses"),
            singlePurchase: e("Go to course"),
          },
        }),
        timing: { notificationHide: 1e4 },
        urls: {
          cartAPI: "/shopping-carts/me/",
          cartSuccess: "/cart/",
          expressCheckoutAPI: "/shopping-carts/me/express/",
          paymentSuccessErrorRedirect: "/home/my-courses/",
          paymentSuccessPage(e) {
            return `/cart/success/${e}/`;
          },
          purchaseSuccess: "/",
        },
        urlParams: { buyableObjectType: "boType", buyableObjectId: "boId" },
      };
      const f = {
        DISPLAY: "display",
        INPUT: "input",
        OFF: "off",
        PENDING: "pending",
      };
      var h, v, y, b, _, j, w, x, k, O;
      let E =
        ((h = class e {
          constructor(e) {
            this.i18n = e;
            p()(this, "currentMode", v, this);
            p()(this, "inputCode", y, this);
            p()(this, "submittedCode", b, this);
            p()(this, "error", _, this);
            p()(this, "currentCodes", j, this);
            p()(this, "currentDiscounts", w, this);
            p()(this, "hasAlreadyPurchased", x, this);
            p()(this, "enterInputMode", k, this);
            p()(this, "enterLoadingMode", O, this);
          }
          get isValidInputCode() {
            return g.patterns.validDiscountCode.test(this.inputCode);
          }
          _updateBaseCouponInternalState(e) {
            this.submittedCode = this.inputCode;
            const t = g.errors(this.i18n.gettext);
            this.error = t.discountCodeInputFormat;
            this.currentMode = f.INPUT;
            this.inputCode = "";
            if (e) {
              this.error = e.length ? e[0].details : "";
            }
          }
          setCode(e) {
            this.inputCode = e.trim().toUpperCase();
            if (this.error) {
              this.error = "";
            }
            if (this.submittedCode) {
              this.submittedCode = "";
            }
          }
          get allowSubmit() {
            return (
              this.currentMode === f.INPUT &&
              !this.currentCodes.includes(this.inputCode)
            );
          }
        }),
        (v = s()(h.prototype, "currentMode", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return f.OFF;
          },
        })),
        (y = s()(h.prototype, "inputCode", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return "";
          },
        })),
        (b = s()(h.prototype, "submittedCode", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return "";
          },
        })),
        (_ = s()(h.prototype, "error", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return "";
          },
        })),
        (j = s()(h.prototype, "currentCodes", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return [];
          },
        })),
        (w = s()(h.prototype, "currentDiscounts", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return new Map();
          },
        })),
        (x = s()(h.prototype, "hasAlreadyPurchased", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return false;
          },
        })),
        (k = s()(h.prototype, "enterInputMode", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return () => {
              this.currentMode = f.INPUT;
            };
          },
        })),
        (O = s()(h.prototype, "enterLoadingMode", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return () => {
              this.currentMode = f.PENDING;
            };
          },
        })),
        s()(
          h.prototype,
          "isValidInputCode",
          [o["g"]],
          Object.getOwnPropertyDescriptor(h.prototype, "isValidInputCode"),
          h.prototype
        ),
        s()(
          h.prototype,
          "_updateBaseCouponInternalState",
          [o["e"]],
          Object.getOwnPropertyDescriptor(
            h.prototype,
            "_updateBaseCouponInternalState"
          ),
          h.prototype
        ),
        s()(
          h.prototype,
          "setCode",
          [o["e"]],
          Object.getOwnPropertyDescriptor(h.prototype, "setCode"),
          h.prototype
        ),
        s()(
          h.prototype,
          "allowSubmit",
          [o["g"]],
          Object.getOwnPropertyDescriptor(h.prototype, "allowSubmit"),
          h.prototype
        ),
        h);
      var C = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/event-common.js"
      );
      class S extends C["a"] {
        constructor(e, t, n) {
          super("CouponApplyEvent");
          this.buyables = e;
          this.couponCode = t;
          this.applicationMethod = n;
        }
      }
      class T extends C["a"] {
        constructor(e, t) {
          super("CouponRemoveEvent");
          this.buyables = e;
          this.couponCode = t;
        }
      }
      var I;
      let P =
        ((I = class e extends E {
          constructor(e, t) {
            super(t);
            this.shoppingClient = e;
          }
          initialize() {
            this._updateState();
          }
          _updateCurrentCodes() {
            this.currentCodes = this.shoppingClient.discounts.attempts
              .filter((e) => e.status === a.APPLIED)
              .map((e) => e.code);
          }
          _updateCurrentDiscounts() {
            this.shoppingClient.discounts.attempts
              .filter((e) => e.status === a.APPLIED)
              .map((e) => this.currentDiscounts.set(e.code, e.amount));
          }
          updateDiscountState() {
            this._updateCurrentCodes();
            this._updateCurrentDiscounts();
          }
          _updateState() {
            this.updateDiscountState();
            const e = this.shoppingClient.discounts.attempts.filter(
              (e) => e.code === this.inputCode
            );
            this._updateBaseCouponInternalState(e);
          }
          removeCouponCode(e) {
            return () => {
              this.enterLoadingMode();
              this.shoppingClient.removeDiscounts([e]).then(() => {
                this.updateDiscountState();
                this.enterInputMode();
                if (this.currentCodes.includes(this.submittedCode)) {
                  Object(o["x"])(() => {
                    this.submittedCode = "";
                    this.error = "";
                  });
                }
                this._publishCouponRemoveEvent(e);
              });
            };
          }
          applyInputCode() {
            if (!this.isValidInputCode) {
              this._updateBaseCouponInternalState();
              return Promise.resolve();
            }
            this.enterLoadingMode();
            return this.shoppingClient
              .applyDiscounts([this.inputCode])
              .then(() => {
                this._publishCouponApplyEvent(this.inputCode);
                this._updateState();
              });
          }
          _publishCouponApplyEvent(e) {
            i["a"].publishEvent(new S(this._getBuyables(), e, "manual_entry"));
          }
          _publishCouponRemoveEvent(e) {
            i["a"].publishEvent(new T(this._getBuyables(), e));
          }
          _getBuyables() {
            return this.shoppingClient.lists.cart.items.map((e) => ({
              id: e.buyable.id,
              type: e.buyable.buyable_object_type,
              trackingId: e.buyable.frontendTrackingId,
            }));
          }
        }),
        s()(
          I.prototype,
          "_updateCurrentCodes",
          [o["e"]],
          Object.getOwnPropertyDescriptor(I.prototype, "_updateCurrentCodes"),
          I.prototype
        ),
        s()(
          I.prototype,
          "_updateCurrentDiscounts",
          [o["e"]],
          Object.getOwnPropertyDescriptor(
            I.prototype,
            "_updateCurrentDiscounts"
          ),
          I.prototype
        ),
        I);
      var D = n("./node_modules/@udemy/i18n/dist/esm/index.js");
      const A = {
        individual_buyable: "buyable_price",
        individual_shopping_buyable: "buyable_cart_price",
        bundle: "bundle_price",
        subtotal: "subtotal_price",
        total: "total_price",
      };
      class N extends C["a"] {
        constructor(e) {
          let { context: t } = e;
          super("PriceImpressionEvent");
          this.priceServeTrackingId = void 0;
          this.buyableTrackingId = void 0;
          this.context = void 0;
          this.currency = void 0;
          this.listPrice = void 0;
          this.discountPrice = void 0;
          this.displayedPrice = void 0;
          this.priceType = void 0;
          this.buyableType = void 0;
          this.buyableId = void 0;
          this.priceServeTrackingId = t.priceServeTrackingId;
          this.buyableTrackingId = t.buyableTrackingId;
          this.context = t.context;
          this.currency = t.currency;
          this.listPrice = t.listPrice;
          this.discountPrice = t.discountPrice;
          this.displayedPrice = t.displayedPrice;
          this.priceType = t.priceType;
          this.buyableType = t.buyableType;
          this.buyableId = t.buyableId;
        }
      }
      const R = async (e) => {
        let { currency: t, funnelLogContextStore: n, ...r } = e;
        if (r.trackingEventContext) {
          const e = Object(D["f"])(r.listPrice, 0).toFixed(2);
          const s = Object(D["f"])(r.discountPrice, 0).toFixed(2);
          const o =
            (!r.showListPriceOnly && (r.discountPriceString || s || "0")) ||
            r.listPriceString ||
            e;
          const a = {
            priceServeTrackingId: r.trackingEventContext.priceServeTrackingId,
            context: n === null || n === void 0 ? void 0 : n.context,
            listPrice: e,
            discountPrice: s,
            displayedPrice: o,
            buyableType: r.trackingEventContext.buyableType,
            buyableId: r.trackingEventContext.buyableId,
            priceType: r.trackingEventContext.priceType,
            buyableTrackingId: r.trackingEventContext.buyableTrackingId,
            currency: t,
          };
          const c = new N({ context: a });
          i["a"].publishEvent(c);
        }
      };
      var L = n("./node_modules/mobx-react/dist/mobx-react.module.js");
      var z = n("./node_modules/react/index.js");
      var U = n.n(z);
      var F = n(
        "./node_modules/@udemy/hooks/dist/esm/use-match-media/index.js"
      );
      var M = n("./node_modules/@udemy/icons/dist/expand-plus.ud-icon");
      var $ = n.n(M);
      var B = n(
        "./node_modules/@udemy/react-core-components/dist/esm/icon-button/icon-button.react-component.js"
      );
      var q = n(
        "./node_modules/@udemy/react-core-components/dist/esm/button/button.react-component.js"
      );
      var W = n(
        "./node_modules/@udemy/react-messaging-components/dist/esm/toaster/toaster.mobx-store.js"
      );
      var G = n("./node_modules/@udemy/ud-api/dist/esm/index.js");
      let H = (function (e) {
        e["ADD"] = "addToList";
        e["REMOVE"] = "removeFromList";
        e["CREATE"] = "createNewList";
        return e;
      })({});
      const V = 60;
      const K = 1;
      class Y extends C["a"] {
        constructor(e) {
          let { listId: t, uiRegion: n, nonInteraction: r = false } = e;
          super("LearningListCreateEvent");
          this.listId = void 0;
          this.nonInteraction = void 0;
          this.uiRegion = void 0;
          this.listId = t;
          this.nonInteraction = r;
          this.uiRegion = n;
        }
      }
      class J extends C["a"] {
        constructor(e) {
          let { listId: t, uiRegion: n } = e;
          super("LearningListDeleteEvent");
          this.listId = void 0;
          this.uiRegion = void 0;
          this.listId = t;
          this.uiRegion = n;
        }
      }
      class X extends C["a"] {
        constructor(e) {
          let { listId: t, uiRegion: n } = e;
          super("LearningListEditEvent");
          this.listId = void 0;
          this.uiRegion = void 0;
          this.listId = t;
          this.uiRegion = n;
        }
      }
      class Z extends C["a"] {
        constructor(e) {
          let { listId: t, courseId: n, trackingId: r, uiRegion: s } = e;
          super("LearningListItemRemoveEvent");
          this.listId = void 0;
          this.uiRegion = void 0;
          this.courseId = void 0;
          this.trackingId = void 0;
          this.listId = t;
          this.courseId = n;
          this.trackingId = r;
          this.uiRegion = s;
        }
      }
      class Q extends C["a"] {
        constructor(e) {
          let { listId: t, courseId: n, trackingId: r, uiRegion: s } = e;
          super("LearningListItemSaveEvent");
          this.listId = void 0;
          this.uiRegion = void 0;
          this.courseId = void 0;
          this.trackingId = void 0;
          this.listId = t;
          this.courseId = n;
          this.trackingId = r;
          this.uiRegion = s;
        }
      }
      var ee,
        te,
        ne,
        re,
        se,
        oe,
        ie,
        ae,
        ce,
        de,
        ue,
        le,
        pe,
        me,
        ge,
        fe,
        he,
        ve,
        ye;
      let be =
        ((ee = class e {
          constructor(e, t, n) {
            this.course = e;
            this.uiRegion = t;
            this.i18n = void 0;
            p()(this, "isModalOpen", te, this);
            p()(this, "isFetchingData", ne, this);
            p()(this, "hasError", re, this);
            p()(this, "isSubmitting", se, this);
            p()(this, "myList", oe, this);
            p()(this, "newListTitle", ie, this);
            p()(this, "titleTooLong", ae, this);
            p()(this, "isNewListFormVisible", ce, this);
            p()(this, "isCreatingNewList", de, this);
            p()(this, "setNewListTitle", ue, this);
            p()(this, "createList", le, this);
            p()(this, "toggleNewListForm", pe, this);
            p()(this, "openModal", me, this);
            p()(this, "hideModal", ge, this);
            p()(this, "toggleList", fe, this);
            p()(this, "removeFromList", he, this);
            p()(this, "saveToList", ve, this);
            this.handleToaster = (e, t, n) => {
              const r = {
                udStyle: n !== null && n !== void 0 ? n : "success",
                title: e,
                body: t !== null && t !== void 0 ? t : "",
                showCta: false,
              };
              W["a"].addAlertBannerToast(r, {
                autoDismiss: true,
                autoDismissTimeout: 5e3,
              });
            };
            p()(this, "fetchListData", ye, this);
            this.course = e;
            this.uiRegion = t;
            this.i18n = n;
          }
          get selectedList() {
            return this.myList.filter((e) => e.isSelected);
          }
        }),
        (te = s()(ee.prototype, "isModalOpen", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return false;
          },
        })),
        (ne = s()(ee.prototype, "isFetchingData", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return false;
          },
        })),
        (re = s()(ee.prototype, "hasError", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return false;
          },
        })),
        (se = s()(ee.prototype, "isSubmitting", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return new Set();
          },
        })),
        (oe = s()(ee.prototype, "myList", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return [];
          },
        })),
        (ie = s()(ee.prototype, "newListTitle", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return "";
          },
        })),
        (ae = s()(ee.prototype, "titleTooLong", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return false;
          },
        })),
        (ce = s()(ee.prototype, "isNewListFormVisible", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return false;
          },
        })),
        (de = s()(ee.prototype, "isCreatingNewList", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return false;
          },
        })),
        (ue = s()(ee.prototype, "setNewListTitle", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return (e) => {
              const t = e.target.value.trim();
              if (t.length > V) {
                this.titleTooLong = true;
              } else {
                this.newListTitle = t;
                this.titleTooLong = false;
              }
            };
          },
        })),
        (le = s()(ee.prototype, "createList", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return async () => {
              const { gettext: e, interpolate: t } = this.i18n;
              this.isCreatingNewList = true;
              try {
                const e = await G["c"].post(
                  "/users/me/subscribed-courses-collections/",
                  { title: this.newListTitle }
                );
                Object(o["x"])(() => {
                  e.data.isSelected = true;
                  this.myList.push(e.data);
                  if (e.status === 201) {
                    i["a"].publishEvent(
                      new Y({
                        listId: e.data.list_id,
                        uiRegion: this.uiRegion,
                        nonInteraction: false,
                      })
                    );
                    this.saveToList(e.data.id, e.data.title);
                    document.dispatchEvent(
                      new CustomEvent(H.CREATE, {
                        detail: { collectionId: e.data.id },
                      })
                    );
                  }
                });
              } catch (r) {
                var n;
                Object(o["x"])(() => {
                  this.hasError = true;
                });
                const s =
                  (n = r.response) === null || n === void 0 ? void 0 : n.data;
                const i =
                  ((s === null || s === void 0 ? void 0 : s.results) &&
                    s.results[0]) ||
                  (s === null || s === void 0 ? void 0 : s.detail);
                this.handleToaster(
                  t(
                    e("Failed to save to %(listTitle)s"),
                    { listTitle: this.newListTitle },
                    true
                  ),
                  i,
                  "error"
                );
              } finally {
                Object(o["x"])(() => {
                  this.newListTitle = "";
                  this.isNewListFormVisible = false;
                  this.isCreatingNewList = false;
                });
              }
            };
          },
        })),
        (pe = s()(ee.prototype, "toggleNewListForm", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return () => {
              this.isNewListFormVisible = !this.isNewListFormVisible;
            };
          },
        })),
        (me = s()(ee.prototype, "openModal", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return () => {
              this.isModalOpen = true;
            };
          },
        })),
        (ge = s()(ee.prototype, "hideModal", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return () => {
              this.hasError = false;
              this.myList = [];
              this.isModalOpen = false;
            };
          },
        })),
        (fe = s()(ee.prototype, "toggleList", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return async (e) => {
              this.hasError = false;
              this.myList = this.myList.map((t) => {
                if (t.id === e) {
                  t.isSelected = !t.isSelected;
                }
                return t;
              });
            };
          },
        })),
        (he = s()(ee.prototype, "removeFromList", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return async (e, t) => {
              const { gettext: n, interpolate: r } = this.i18n;
              this.isSubmitting.add(e);
              try {
                const t = await G["c"].delete(
                  `/users/me/subscribed-courses-collections/${e}/courses/${this.course.id}/`
                );
                if (t.status === 204) {
                  document.dispatchEvent(
                    new CustomEvent(H.REMOVE, {
                      detail: { course: this.course, listId: e },
                    })
                  );
                  i["a"].publishEvent(
                    new Z({
                      listId: e,
                      courseId: this.course.id,
                      trackingId: this.course.frontendTrackingId
                        ? this.course.frontendTrackingId
                        : "",
                      uiRegion: `${this.uiRegion}`,
                    })
                  );
                  this.handleToaster(n("Removed from list"));
                }
                Object(o["x"])(() => {
                  this.isSubmitting.delete(e);
                });
              } catch (e) {
                var s;
                Object(o["x"])(() => (this.hasError = true));
                const i =
                  (s = e.response) === null || s === void 0 ? void 0 : s.data;
                const a =
                  ((i === null || i === void 0 ? void 0 : i.results) &&
                    i.results[0]) ||
                  (i === null || i === void 0 ? void 0 : i.detail);
                this.handleToaster(
                  r(
                    n("Failed to remove from %(listTitle)s"),
                    { listTitle: t },
                    true
                  ),
                  a,
                  "error"
                );
              } finally {
                Object(o["x"])(() => {
                  this.isSubmitting.delete(e);
                });
              }
            };
          },
        })),
        (ve = s()(ee.prototype, "saveToList", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return async (e, t) => {
              const { gettext: n, interpolate: r } = this.i18n;
              this.isSubmitting.add(e);
              try {
                const t = await G["c"].post(
                  `/users/me/subscribed-courses-collections/${e}/courses/`,
                  { course: this.course.id }
                );
                if (t.status === 201) {
                  document.dispatchEvent(
                    new CustomEvent(H.ADD, {
                      detail: { course: this.course, listId: e },
                    })
                  );
                  i["a"].publishEvent(
                    new Q({
                      listId: e,
                      courseId: this.course.id,
                      trackingId: this.course.frontendTrackingId
                        ? this.course.frontendTrackingId
                        : "",
                      uiRegion: `${this.uiRegion}`,
                    })
                  );
                  this.handleToaster(n("Saved to list"));
                }
                Object(o["x"])(() => {
                  this.isSubmitting.delete(e);
                });
              } catch (e) {
                var s;
                Object(o["x"])(() => (this.hasError = true));
                const i =
                  (s = e.response) === null || s === void 0 ? void 0 : s.data;
                const a =
                  ((i === null || i === void 0 ? void 0 : i.results) &&
                    i.results[0]) ||
                  (i === null || i === void 0 ? void 0 : i.detail);
                this.handleToaster(
                  r(
                    n("Failed to save to %(listTitle)s"),
                    { listTitle: t },
                    true
                  ),
                  a,
                  "error"
                );
              } finally {
                Object(o["x"])(() => {
                  this.isSubmitting.delete(e);
                });
              }
            };
          },
        })),
        s()(
          ee.prototype,
          "selectedList",
          [o["g"]],
          Object.getOwnPropertyDescriptor(ee.prototype, "selectedList"),
          ee.prototype
        ),
        (ye = s()(ee.prototype, "fetchListData", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return async () => {
              const { gettext: e } = this.i18n;
              this.isFetchingData = true;
              const t = G["c"].get("/users/me/subscribed-courses-collections/");
              const n = G["c"].get(
                `/users/me/subscribed-courses/${this.course.id}/collections/`
              );
              try {
                const [e, r] = await Promise.all([t, n]);
                const s = r.data.results;
                const i = e.data.results;
                Object(o["x"])(() => {
                  i.forEach((e) => {
                    e.isSelected = s.some((t) => t.id === e.id);
                  });
                  this.myList = i;
                });
              } catch (t) {
                var r;
                Object(o["x"])(() => (this.hasError = true));
                const n =
                  (r = t.response) === null || r === void 0 ? void 0 : r.data;
                const s =
                  ((n === null || n === void 0 ? void 0 : n.results) &&
                    n.results[0]) ||
                  (n === null || n === void 0 ? void 0 : n.detail);
                this.handleToaster(e("Failed to load lists"), s, "error");
              } finally {
                Object(o["x"])(() => {
                  this.isFetchingData = false;
                });
              }
            };
          },
        })),
        ee);
      var _e = n(
        "./node_modules/@udemy/react-dialog-components/dist/esm/modal/modal.react-component.js"
      );
      var je = n(
        "./node_modules/@udemy/react-form-components/dist/esm/form-group/form-group.react-component.js"
      );
      var we = n(
        "./node_modules/@udemy/react-reveal-components/dist/esm/loader/loader.react-component.js"
      );
      var xe = n(
        "./node_modules/@udemy/shopping/dist/esm/save-to-list/save-to-list-modal.module.css"
      );
      var ke = n.n(xe);
      var Oe = n("./node_modules/@udemy/icons/dist/add-circle-solid.ud-icon");
      var Ee = n.n(Oe);
      var Ce = n(
        "./node_modules/@udemy/react-form-components/dist/esm/text-input/text-input-form.react-component.js"
      );
      var Se = n("./node_modules/classnames/index.js");
      var Te = n.n(Se);
      var Ie = n(
        "./node_modules/@udemy/react-form-components/dist/esm/checkbox/checkbox.react-component.js"
      );
      var Pe = n(
        "./node_modules/@udemy/shopping/dist/esm/external/enhanced-form-elements/checkbox-with-loader.module.css"
      );
      var De = n.n(Pe);
      const Ae = (e) => {
        let { isLoading: t = false, children: n, ...r } = e;
        if (t) {
          return U.a.createElement(
            "div",
            { className: Te()("ud-text-sm", De.a["loader-state"]) },
            U.a.createElement(we["a"], {
              size: "xsmall",
              className: De.a["loader-icon"],
            }),
            n
          );
        }
        return U.a.createElement(Ie["a"], r, n);
      };
      var Ne = n(
        "./node_modules/@udemy/shopping/dist/esm/save-to-list/save-to-list-selection-form.module.css"
      );
      var Re = n.n(Ne);
      var Le;
      let ze =
        Object(L["f"])(
          (Le = class e extends z["Component"] {
            constructor() {
              super(...arguments);
              this.toggleSelect = async (e) => {
                const t = parseInt(e.target.name, 10);
                const n = e.target.title;
                if (e.target.checked) {
                  await this.props.store.saveToList(t, n);
                } else {
                  await this.props.store.removeFromList(t, n);
                }
                if (!this.props.store.hasError) {
                  await this.props.store.toggleList(t);
                }
              };
              this.handleAddListClick = () => {
                this.props.store.createList();
              };
            }
            renderNewListForm() {
              const { gettext: e, interpolate: t } = this.props;
              return U.a.createElement(
                je["b"],
                {
                  label: e("Create new list"),
                  labelProps: { className: "ud-sr-only" },
                  "data-testid": "create-list-title-input",
                  className: Re.a["new-list-form"],
                  note: this.props.store.titleTooLong
                    ? t(
                        e(
                          "List titles cannot exceed %(titleLimit)s characters"
                        ),
                        { titleLimit: V },
                        true
                      )
                    : null,
                  validationState: this.props.store.titleTooLong
                    ? "error"
                    : "neutral",
                },
                U.a.createElement(Ce["a"], {
                  submitButtonProps: {
                    disabled:
                      this.props.store.isCreatingNewList ||
                      this.props.store.newListTitle.length < K,
                  },
                  onChange: this.props.store.setNewListTitle,
                  onSubmit: this.handleAddListClick,
                  maxLength: V,
                  submitButtonContent: e("Create list"),
                })
              );
            }
            render() {
              const { gettext: e } = this.props;
              return U.a.createElement(
                "div",
                { "data-testid": "save-to-list-selection" },
                this.props.store.myList &&
                  U.a.createElement(
                    "div",
                    { className: Re.a["checkbox-group"] },
                    this.props.store.myList.map((e) => {
                      var t;
                      return U.a.createElement(
                        Ae,
                        {
                          "data-testid": `item-checkbox-${e.id}`,
                          checked:
                            (t = e.isSelected) !== null && t !== void 0
                              ? t
                              : false,
                          key: e.id,
                          name: e.id.toString(),
                          onChange: this.toggleSelect,
                          isLoading: this.props.store.isSubmitting.has(e.id),
                          title: e.title,
                        },
                        e.title
                      );
                    })
                  ),
                this.props.store.isNewListFormVisible
                  ? this.renderNewListForm()
                  : U.a.createElement(
                      q["a"],
                      {
                        "data-testid": "create-new-list-button",
                        className: Re.a["new-list-button"],
                        udStyle: "ghost",
                        size: "medium",
                        onClick: this.props.store.toggleNewListForm,
                      },
                      U.a.createElement(Ee.a, { label: false }),
                      e("Create new list")
                    )
              );
            }
          })
        ) || Le;
      const Ue = Object(D["k"])(ze);
      var Fe;
      let Me =
        Object(L["f"])(
          (Fe = class e extends z["Component"] {
            constructor() {
              super(...arguments);
              this.exitHandler = () => {
                this.props.saveToListButtonStore.hideModal();
              };
              this.renderBody = () => {
                if (this.props.saveToListButtonStore.isFetchingData) {
                  return U.a.createElement(we["a"], {
                    size: "large",
                    block: true,
                  });
                }
                return U.a.createElement(
                  je["b"],
                  { udStyle: "fieldset", label: "" },
                  U.a.createElement(Ue, {
                    store: this.props.saveToListButtonStore,
                  })
                );
              };
            }
            render() {
              const { gettext: e } = this.props;
              return U.a.createElement(
                _e["a"],
                {
                  title: e("Save to list"),
                  isOpen: this.props.saveToListButtonStore.isModalOpen,
                  onOpen: this.props.saveToListButtonStore.fetchListData,
                  onClose: this.exitHandler,
                  className: ke.a["save-to-list-modal"],
                },
                this.renderBody()
              );
            }
          })
        ) || Fe;
      const $e = Object(D["k"])(Me);
      const Be = (e) => {
        let {
          round: t = false,
          size: n = "large",
          labelPosition: r = "left",
          label: s,
          onClick: o,
          ...i
        } = e;
        const a = { udStyle: "secondary", size: n, ...i };
        const c = Object(F["a"])("sm-max");
        const { gettext: d } = Object(D["j"])();
        const u = !c ? d("Save") : d("Save to list");
        const l = s !== null && s !== void 0 ? s : u;
        if (t) {
          return U.a.createElement(
            B["a"],
            Object.assign({}, a, { round: true, onClick: o }),
            U.a.createElement($.a, { label: l, color: "inherit" })
          );
        }
        return U.a.createElement(
          q["a"],
          Object.assign(
            { "data-testid": "save-to-list-button", onClick: o },
            a
          ),
          r === "left" && U.a.createElement("span", null, l),
          U.a.createElement($.a, { label: false, color: "inherit", size: n }),
          r === "right" && U.a.createElement("span", null, l)
        );
      };
      const qe = Object(L["f"])((e) => {
        let { course: t, uiRegion: n, renderPopover: r, ...s } = e;
        const { gettext: o, interpolate: i } = Object(D["j"])();
        const [a] = U.a.useState(
          () => new be(t, n, { gettext: o, interpolate: i })
        );
        if (!t.is_in_user_subscription) {
          return null;
        }
        function c() {
          a.openModal();
        }
        let d = U.a.createElement(Be, Object.assign({ onClick: c }, s));
        if (r) {
          d = r(d);
        }
        return U.a.createElement(
          U.a.Fragment,
          null,
          d,
          U.a.createElement($e, { saveToListButtonStore: a })
        );
      });
      function We(e, t) {
        return e.reduce((e, n) => e.concat(t(n)), []);
      }
      function Ge(e) {
        const t = e.toString();
        let n =
          t.length > 0
            ? `${window.location.pathname}?${t}`
            : window.location.pathname;
        if (window.location.hash) {
          n = `${n}${window.location.hash}`;
        }
        window.history.replaceState({}, "", n);
      }
      function He(e) {
        const t = (t) => (e.get(t) ? e.get(t).split(",") : []);
        return {
          get: () => [...new Set(We([d, c], t))],
          remove: () => {
            e.delete(c);
            e.delete(d);
            Ge(e);
          },
          add: function () {
            let t =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : [];
            if (!t.length) {
              return;
            }
            e.set(d, t.join(","));
            Ge(e);
          },
        };
      }
      var Ve = n(
        "./node_modules/@udemy/shared-utils/dist/esm/storage/ud-expiring-local-storage.js"
      );
      var Ke = n(
        "./node_modules/@udemy/shared-utils/dist/esm/webview/webview-bridge.js"
      );
      var Ye = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/is-mobile-app.js"
      );
      var Je;
      const Xe = new o["b"]();
      let Ze =
        ((Je = class e {
          constructor(e) {
            this.type = e;
            this.pop = false;
            this.lastMessage = o["t"].box(null);
            Object(o["u"])(this, "onMessageInternal", (e) => {
              if (this.pop && e.newValue) {
                Object(o["x"])(() => {
                  this.lastMessage.set(e.newValue);
                });
                return;
              }
              this.popLastMessage();
            });
          }
          get messages() {
            var e;
            if (!Xe.get(this.type)) {
              return [];
            }
            return (e = Xe.get(this.type)) !== null && e !== void 0 ? e : [];
          }
          get onMessageInternal() {
            const e = Xe.get(this.type);
            if (!e) {
              return null;
            }
            this.pop = true;
            return e[e.length - 1];
          }
          get onMessage() {
            return this.lastMessage.get();
          }
          sendMessage(e) {
            let t = [];
            if (Xe.has(this.type)) {
              t = Xe.get(this.type);
            }
            t.push(e);
            Xe.set(this.type, t);
          }
          clear() {
            this.lastMessage.set(null);
            Xe.delete(this.type);
          }
          popLastMessage() {
            let e = [];
            if (Xe.has(this.type)) {
              e = Xe.get(this.type);
            }
            e.pop();
            Xe.set(this.type, e);
            this.pop = false;
          }
        }),
        s()(
          Je.prototype,
          "messages",
          [o["g"]],
          Object.getOwnPropertyDescriptor(Je.prototype, "messages"),
          Je.prototype
        ),
        s()(
          Je.prototype,
          "onMessageInternal",
          [o["g"]],
          Object.getOwnPropertyDescriptor(Je.prototype, "onMessageInternal"),
          Je.prototype
        ),
        s()(
          Je.prototype,
          "onMessage",
          [o["g"]],
          Object.getOwnPropertyDescriptor(Je.prototype, "onMessage"),
          Je.prototype
        ),
        s()(
          Je.prototype,
          "sendMessage",
          [o["e"]],
          Object.getOwnPropertyDescriptor(Je.prototype, "sendMessage"),
          Je.prototype
        ),
        s()(
          Je.prototype,
          "clear",
          [o["e"]],
          Object.getOwnPropertyDescriptor(Je.prototype, "clear"),
          Je.prototype
        ),
        s()(
          Je.prototype,
          "popLastMessage",
          [o["e"]],
          Object.getOwnPropertyDescriptor(Je.prototype, "popLastMessage"),
          Je.prototype
        ),
        Je);
      function Qe(e) {
        return new Ze(e);
      }
      class et {
        constructor(e, t) {
          this.buyables = void 0;
          this.purchasePrice = void 0;
          this.buyables = e;
          this.purchasePrice = t;
        }
        toJSON() {
          return JSON.stringify({
            buyables: this.buyables,
            purchasePrice: this.purchasePrice,
          });
        }
      }
      class tt {
        constructor(e, t) {
          this.methodName = "onEnrolled";
          this.payload = void 0;
          this.payload = new et(e, t);
        }
        sendLegacyAndroidMessage(e) {
          if (typeof e.onEnrolledAdditionalData === "function") {
            e.onEnrolledAdditionalData(this.payload.toJSON());
          } else if (typeof e.onEnrolled === "function") {
            e.onEnrolled(JSON.stringify(this.payload.buyables));
          }
        }
      }
      var nt;
      let rt =
        ((nt = class e {
          constructor(e) {
            this.state = void 0;
            this.state = Object(o["t"])({
              attempts: e !== null && e !== void 0 ? e : o["t"].array(),
            });
          }
          get attempts() {
            return this.state.attempts;
          }
          get latest() {
            return this.state.attempts[0];
          }
          get codes() {
            return this.state.attempts.map((e) => e.code);
          }
          get invalidCodes() {
            return this.getCodesByStatus("invalid");
          }
          get expiredCodes() {
            return this.getCodesByStatus("expired");
          }
          get soldOutCodes() {
            return this.getCodesByStatus("sold_out");
          }
          clear() {
            this.state.attempts.clear();
          }
          getCodesByStatus(e) {
            return this.state.attempts
              .filter((t) => t.status == e)
              .map((e) => e.code);
          }
        }),
        s()(
          nt.prototype,
          "attempts",
          [o["g"]],
          Object.getOwnPropertyDescriptor(nt.prototype, "attempts"),
          nt.prototype
        ),
        s()(
          nt.prototype,
          "latest",
          [o["g"]],
          Object.getOwnPropertyDescriptor(nt.prototype, "latest"),
          nt.prototype
        ),
        s()(
          nt.prototype,
          "codes",
          [o["g"]],
          Object.getOwnPropertyDescriptor(nt.prototype, "codes"),
          nt.prototype
        ),
        s()(
          nt.prototype,
          "invalidCodes",
          [o["g"]],
          Object.getOwnPropertyDescriptor(nt.prototype, "invalidCodes"),
          nt.prototype
        ),
        s()(
          nt.prototype,
          "expiredCodes",
          [o["g"]],
          Object.getOwnPropertyDescriptor(nt.prototype, "expiredCodes"),
          nt.prototype
        ),
        s()(
          nt.prototype,
          "soldOutCodes",
          [o["g"]],
          Object.getOwnPropertyDescriptor(nt.prototype, "soldOutCodes"),
          nt.prototype
        ),
        s()(
          nt.prototype,
          "clear",
          [o["e"]],
          Object.getOwnPropertyDescriptor(nt.prototype, "clear"),
          nt.prototype
        ),
        nt);
      var st, ot, it, at, ct;
      let dt =
        ((st = class e {
          constructor(e, t, n) {
            this.state = void 0;
            p()(this, "setItems", ot, this);
            p()(this, "add", it, this);
            p()(this, "remove", at, this);
            p()(this, "clear", ct, this);
            this.state = Object(o["t"])({
              name: e,
              addAttempts: o["t"].array(),
              removeAttempts: o["t"].array(),
              items: t !== null && t !== void 0 ? t : o["t"].array(),
              unseenCount: o["t"].box(n !== null && n !== void 0 ? n : 0),
            });
          }
          finishAttempt(e, t) {
            return Object(o["e"])(() => {
              const n = t.find((t) => t.buyable.id === e.buyable.id);
              if (n) {
                t.remove(n);
              }
            });
          }
          get name() {
            return this.state.name;
          }
          get unseenCount() {
            return this.state.unseenCount.get();
          }
          set unseenCount(e) {
            Object(o["x"])(() => {
              this.state.unseenCount.set(e);
            });
          }
          get items() {
            const e = (e) => {
              const t = {};
              e.forEach((e) => {
                const n = e.buyable.id;
                t[n] = (t[n] || 0) + 1;
              });
              return t;
            };
            const t = e(this.state.items);
            const n = e(this.state.addAttempts);
            const r = e(this.state.removeAttempts);
            const s = new Set();
            const o = [];
            this.state.addAttempts.concat(this.state.items).forEach((e) => {
              const i = e.buyable.id;
              if (!s.has(i)) {
                s.add(i);
                const a = (t[i] || 0) + (n[i] || 0) - (r[i] || 0);
                if (a > 0) {
                  o.push(e);
                }
              }
            });
            return o;
          }
          get isEmpty() {
            return this.items.length === 0;
          }
          findItemByBuyable(e, t) {
            return (
              this.items.find(
                (n) =>
                  n.buyable &&
                  n.buyable.buyable_object_type === e &&
                  n.buyable.id === t
              ) || null
            );
          }
          hasBuyable(e, t) {
            return Boolean(this.findItemByBuyable(e, t));
          }
          hasBuyables(e) {
            return (
              e.length > 0 &&
              e.every((e) => this.hasBuyable(e.buyable_object_type, e.id))
            );
          }
          get hasPendingOperations() {
            return (
              this.state.addAttempts.length > 0 ||
              this.state.removeAttempts.length > 0
            );
          }
          get purchasePriceAmount() {
            return ut(this.items, "purchase_price");
          }
          get listPriceAmount() {
            return ut(this.items, "list_price");
          }
          get discountAmount() {
            const e = this.items
              .filter(
                (e) => e.current_discount && e.current_discount.saving_price
              )
              .map((e) => e.current_discount);
            if (!e.length) {
              return 0;
            }
            return -ut(e, "saving_price");
          }
          get discountPercentage() {
            const e = this.listPriceAmount;
            return e ? Math.round(100 * (1 - this.purchasePriceAmount / e)) : 0;
          }
        }),
        s()(
          st.prototype,
          "name",
          [o["g"]],
          Object.getOwnPropertyDescriptor(st.prototype, "name"),
          st.prototype
        ),
        s()(
          st.prototype,
          "unseenCount",
          [o["g"]],
          Object.getOwnPropertyDescriptor(st.prototype, "unseenCount"),
          st.prototype
        ),
        s()(
          st.prototype,
          "items",
          [o["g"]],
          Object.getOwnPropertyDescriptor(st.prototype, "items"),
          st.prototype
        ),
        (ot = s()(st.prototype, "setItems", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return (e) => {
              this.state.items.clear();
              this.state.items.replace(e);
            };
          },
        })),
        s()(
          st.prototype,
          "isEmpty",
          [o["g"]],
          Object.getOwnPropertyDescriptor(st.prototype, "isEmpty"),
          st.prototype
        ),
        s()(
          st.prototype,
          "hasPendingOperations",
          [o["g"]],
          Object.getOwnPropertyDescriptor(st.prototype, "hasPendingOperations"),
          st.prototype
        ),
        (it = s()(st.prototype, "add", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return (e) => {
              this.state.addAttempts.unshift(e);
              return this.finishAttempt(e, this.state.addAttempts);
            };
          },
        })),
        (at = s()(st.prototype, "remove", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return (e) => {
              this.state.removeAttempts.push(e);
              return this.finishAttempt(e, this.state.removeAttempts);
            };
          },
        })),
        (ct = s()(st.prototype, "clear", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return () => {
              this.state.items.clear();
              this.state.addAttempts.clear();
              this.state.removeAttempts.clear();
            };
          },
        })),
        s()(
          st.prototype,
          "purchasePriceAmount",
          [o["g"]],
          Object.getOwnPropertyDescriptor(st.prototype, "purchasePriceAmount"),
          st.prototype
        ),
        s()(
          st.prototype,
          "listPriceAmount",
          [o["g"]],
          Object.getOwnPropertyDescriptor(st.prototype, "listPriceAmount"),
          st.prototype
        ),
        s()(
          st.prototype,
          "discountAmount",
          [o["g"]],
          Object.getOwnPropertyDescriptor(st.prototype, "discountAmount"),
          st.prototype
        ),
        s()(
          st.prototype,
          "discountPercentage",
          [o["g"]],
          Object.getOwnPropertyDescriptor(st.prototype, "discountPercentage"),
          st.prototype
        ),
        st);
      function ut(e, t) {
        return e.reduce((e, n) => {
          var r;
          return (
            e +
            parseFloat(
              String((r = n[t]) === null || r === void 0 ? void 0 : r.amount)
            )
          );
        }, 0);
      }
      var lt;
      function pt(e) {
        let t =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : "value";
        if (!e) {
          throw new Error(`Attempting to access ${t} before is has been set`);
        }
        return e;
      }
      const mt = "reload";
      let gt =
        ((lt = class e {
          constructor(e) {
            this.storage = e;
            this.NOTICE_REFRESH_EXPIRATION_DATE = new Date(
              Date.now() + 10 * 60 * 1e3
            );
            this.noticesApiLocalStorage = Object(Ve["a"])(
              "notices",
              "api",
              this.NOTICE_REFRESH_EXPIRATION_DATE
            );
            this.webviewBridge = new Ke["a"]();
            this.removeDiscountPromise = null;
            this.userId = void 0;
            this.state = void 0;
            this.couponStore = null;
            this._i18n = void 0;
            this._udLink = void 0;
            this.state = {
              credit: this.storage.credit,
              discounts: new rt(this.storage.discounts),
              lists: {
                cart: new dt("cart", this.storage.lists.cart),
                wishlist: new dt("wishlist", e.lists.wishlist),
                saved_for_later: new dt(
                  "saved_for_later",
                  e.lists.saved_for_later
                ),
                express: new dt("express", e.lists.express),
                checkout: new dt("checkout", o["t"].array()),
              },
            };
            try {
              var t;
              const e = window.sessionStorage.getItem("checkoutItems");
              const n = (t = JSON.parse(e)) !== null && t !== void 0 ? t : [];
              this.state.lists.checkout = new dt("checkout", n);
            } catch (e) {
              this.state.lists.checkout = new dt("checkout", o["t"].array());
            }
          }
          initialize(e) {
            this._i18n = e.i18n;
            this._udLink = e.udLink;
            this.storage.setIsFeatureEnabled(e.isShoppingCartFeatureEnabled);
          }
          get i18n() {
            return pt(this._i18n);
          }
          get udLink() {
            return pt(this._udLink);
          }
          get credit() {
            return this.state.credit;
          }
          get discounts() {
            return this.state.discounts;
          }
          get lists() {
            return this.state.lists;
          }
          get status() {
            return this.storage.status;
          }
          get availableCoupons() {
            return this.storage.availableCoupons;
          }
          get hasPendingOperations() {
            return Object.keys(this.state.lists).some(
              (e) => this.state.lists[e].hasPendingOperations
            );
          }
          setUserId(e) {
            this.userId = e;
            this.storage.setUserId(e);
          }
          addToList(e, t) {
            let n =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : null;
            const r = Object.values(t).map((e) => ({
              buyable: { buyable_object_type: e.buyable_object_type, id: e.id },
            }));
            return this.storage.addItems(e, r, n).then(() => {
              if (["cart", "wishlist"].includes(e)) {
                this.noticesApiLocalStorage = Object(Ve["a"])("notices", "api");
                this.noticesApiLocalStorage.delete(mt);
              }
            });
          }
          cancelCheckout() {
            Qe("notifications").sendMessage("checkoutCancel");
          }
          notify(e) {
            let t =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {};
            const n = {
              message: typeof e === "string" ? e : e.message,
              options: t,
            };
            Qe("notifications").sendMessage(n);
          }
          removeFromList(e, t) {
            const n = () => {
              this.state.lists[e].remove(t);
              if (this.couponStore) {
                this.couponStore.updateDiscountState();
              }
              if (
                ["cart", "wishlist"].includes(e) &&
                this.state.lists[e].isEmpty
              ) {
                this.noticesApiLocalStorage.set(mt, true);
              }
            };
            return this.storage
              .removeItem(e, t)
              .then(() => {
                n();
                return Promise.resolve(true);
              })
              .catch(() => {
                this.state.lists[e].add(t)();
                n();
                return Promise.reject(false);
              });
          }
          moveToList(e, t, n) {
            const r = () => {
              this.state.lists[t].add(n);
              this.state.lists[e].remove(n);
              if (this.couponStore) {
                this.couponStore.updateDiscountState();
              }
            };
            return this.storage
              .addItems(t, [n])
              .then(() => {
                r();
                return Promise.resolve(true);
              })
              .catch(() => {
                r();
                return Promise.reject(false);
              });
          }
          fetch() {
            return this.storage.fetch();
          }
          applyDiscounts(e) {
            if (!e || !e.length) {
              return Promise.resolve(true);
            }
            const t = e.map((e) => e.toUpperCase());
            return this.storage.applyDiscounts(t);
          }
          removeDiscounts(e) {
            if (!e || !e.length) {
              return Promise.resolve(true);
            }
            return this.storage.removeDiscounts(e);
          }
          validateDiscounts() {
            if (this.removeDiscountPromise) {
              return this.removeDiscountPromise;
            }
            const e = {};
            const t = (t, n) => {
              if (n.length > 0) {
                e[t] = n;
              }
            };
            t("invalid", this.state.discounts.invalidCodes);
            t("expired", this.state.discounts.expiredCodes);
            t("sold_out", this.state.discounts.soldOutCodes);
            Object.entries(e).forEach((e) => {
              let [t, n] = e;
              const r = g.errors(this.i18n.gettext);
              const s = t;
              const o = r.discount[s][n.length > 1 ? "plural" : "singular"];
              const i = this.i18n.interpolate(o, { code: n.join(", ") }, true);
              this.notify(i, { reason: t });
            });
            this.removeDiscountPromise = this.removeDiscounts(
              [].concat(...Object.values(e))
            );
            return this.removeDiscountPromise.then((e) => {
              this.removeDiscountPromise = null;
              return e;
            });
          }
          get isCheckoutAvailable() {
            return Boolean(
              this.state.lists.checkout &&
                !this.state.lists.checkout.isEmpty &&
                this.userId
            );
          }
          freezeCheckoutList(e) {
            this.state.lists.checkout.setItems([...this.state.lists[e].items]);
            window.sessionStorage.setItem(
              "checkoutItems",
              JSON.stringify(this.state.lists.checkout.items)
            );
          }
          completeCheckout(e) {
            const t = this.state.lists.checkout.items.map((e) => e.buyable);
            this.resetCheckoutList();
            return this.storage.clearDiscounts().then(() => {
              this.performTerminalAction(e, t);
            });
          }
          setExpressCheckoutListFromItem(e) {
            this.resetCheckoutList();
            const t = [
              {
                buyable: {
                  id: e.buyableObjectId,
                  buyable_object_type: e.buyableObjectType,
                },
              },
            ];
            const n = e.codes;
            return this.storage.createExpressCheckoutSession(t, n).then(() => {
              this.freezeCheckoutList("express");
              return Promise.resolve(true);
            });
          }
          getCheckoutData() {
            return new Promise((e) =>
              e({
                isPaymentRequired:
                  this.isCheckoutAvailable &&
                  this.state.lists.checkout.purchasePriceAmount -
                    this.state.credit.amount >
                    0,
                items: this.createCheckoutAttemptData(
                  this.state.lists.checkout
                ),
              })
            );
          }
          getTotalDue() {
            return Math.max(
              this.lists.checkout.purchasePriceAmount - this.credit.amount,
              0
            );
          }
          resetCheckoutList() {
            this.state.lists.checkout.clear();
            window.sessionStorage.removeItem("checkoutItems");
          }
          performTerminalAction(e, t) {
            if (Object(Ye["a"])()) {
              this.webviewBridge.sendMessage(
                new tt(t, e.purchasePrice.price.toString())
              );
            } else {
              const t = e.redirect_url
                ? e.redirect_url
                : this.udLink.to(
                    g.urls.paymentSuccessPage(e.gatewayTransactionId)
                  );
              window.location.href = t;
            }
          }
          createCheckoutAttemptData(e) {
            const t = e.items.map((e) => {
              let t = undefined;
              if (e.current_discount && e.current_discount.code) {
                t = { code: e.current_discount.code };
              }
              const n = { discountInfo: t, purchasePrice: e.purchase_price };
              let r = e.buyable;
              if (e.buyable.buyable_object_type === "license") {
                n.licenseId = e.buyable.id;
                r = e.buyable.course;
              } else if (e.buyable.buyable_object_type === "gift") {
                n.giftId = e.buyable.id;
                r = e.buyable.course;
              }
              n.buyableType = r.buyable_object_type;
              n.buyableId = r.id;
              return n;
            });
            return { items: t };
          }
        }),
        s()(
          lt.prototype,
          "credit",
          [o["g"]],
          Object.getOwnPropertyDescriptor(lt.prototype, "credit"),
          lt.prototype
        ),
        s()(
          lt.prototype,
          "discounts",
          [o["g"]],
          Object.getOwnPropertyDescriptor(lt.prototype, "discounts"),
          lt.prototype
        ),
        s()(
          lt.prototype,
          "lists",
          [o["g"]],
          Object.getOwnPropertyDescriptor(lt.prototype, "lists"),
          lt.prototype
        ),
        s()(
          lt.prototype,
          "status",
          [o["g"]],
          Object.getOwnPropertyDescriptor(lt.prototype, "status"),
          lt.prototype
        ),
        s()(
          lt.prototype,
          "availableCoupons",
          [o["g"]],
          Object.getOwnPropertyDescriptor(lt.prototype, "availableCoupons"),
          lt.prototype
        ),
        s()(
          lt.prototype,
          "hasPendingOperations",
          [o["g"]],
          Object.getOwnPropertyDescriptor(lt.prototype, "hasPendingOperations"),
          lt.prototype
        ),
        s()(
          lt.prototype,
          "setUserId",
          [o["e"]],
          Object.getOwnPropertyDescriptor(lt.prototype, "setUserId"),
          lt.prototype
        ),
        s()(
          lt.prototype,
          "isCheckoutAvailable",
          [o["g"]],
          Object.getOwnPropertyDescriptor(lt.prototype, "isCheckoutAvailable"),
          lt.prototype
        ),
        s()(
          lt.prototype,
          "getTotalDue",
          [o["e"]],
          Object.getOwnPropertyDescriptor(lt.prototype, "getTotalDue"),
          lt.prototype
        ),
        lt);
      var ft = n(
        "./node_modules/@udemy/event-tracking/dist/esm/tracker/helpers.js"
      );
      var ht = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/ud-performance.js"
      );
      var vt, yt, bt, _t;
      let jt =
        ((vt = class e {
          constructor() {
            let e =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : 3;
            this.retryLimit = e;
            p()(this, "commands", yt, this);
            p()(this, "add", bt, this);
            p()(this, "endCurrent", _t, this);
            Object(o["f"])(() => {
              if (this.currentCommand) {
                this.currentCommand.run();
              }
            });
          }
          get currentCommand() {
            return this.commands.length > 0 ? this.commands[0] : null;
          }
        }),
        (yt = s()(vt.prototype, "commands", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return [];
          },
        })),
        s()(
          vt.prototype,
          "currentCommand",
          [o["g"]],
          Object.getOwnPropertyDescriptor(vt.prototype, "currentCommand"),
          vt.prototype
        ),
        (bt = s()(vt.prototype, "add", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return (e, t) => {
              const n = wt(e, t, this.retryLimit, this.endCurrent);
              this.commands.push(n);
              return n.promise;
            };
          },
        })),
        (_t = s()(vt.prototype, "endCurrent", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return () => {
              this.commands.shift();
            };
          },
        })),
        vt);
      function wt(e, t, n, r) {
        const s = {
          deferred: xt(),
          command: Object(o["e"])(e),
          resolver: t,
          triesLeft: n,
          onComplete: r,
        };
        const i = {
          promise: s.deferred.promise,
          actions: {
            resolve: (e) => {
              s.onComplete();
              s.deferred.resolve(e);
            },
            reject: (e) => {
              s.onComplete();
              s.deferred.reject(e);
            },
            retry: Object(o["e"])((e) => {
              s.triesLeft--;
              if (s.triesLeft > 0) {
                return i.run();
              }
              s.onComplete();
              s.deferred.reject(e);
            }),
          },
          run: Object(o["e"])(() => {
            e().then(i.actions.resolve, (e) => s.resolver(i, e));
          }),
        };
        return i;
      }
      function xt() {
        const e = {};
        e.promise = new Promise((t, n) => {
          e.resolve = t;
          e.reject = n;
        });
        return e;
      }
      var kt, Ot, Et, Ct;
      let St =
        ((kt = class e {
          constructor() {
            var e,
              t = this;
            this.defaultState = {
              etag: null,
              credit: { amount: 0 },
              discounts: o["t"].array(),
              lists: {
                cart: o["t"].array(),
                express: o["t"].array(),
                saved_for_later: o["t"].array(),
                wishlist: o["t"].array(),
              },
              unseenCounts: {
                cart: 0,
                express: 0,
                saved_for_later: 0,
                wishlist: 0,
              },
              userId: null,
              availableCoupons: [],
            };
            this.now = new Date();
            this.expirationDate = new Date(
              this.now.setDate(this.now.getDate() + 30)
            );
            this.storage = Object(Ve["a"])(
              "shoppingCartStorage",
              "storage-1.0",
              this.expirationDate
            );
            this.state = Object(o["t"])({
              ...((e = this.storage.get("state")) !== null && e !== void 0
                ? e
                : this.defaultState),
            });
            this.queue = new jt();
            this.status = o["t"].box(g.storage.status.notReady);
            p()(this, "isShoppingCartFeatureEnabled", Ot, this);
            this.fetch = () => {
              if (
                !this.isShoppingCartFeatureEnabled ||
                (!this.state.userId && !this.state.etag)
              ) {
                Object(o["x"])(() => {
                  this.status.set(g.storage.status.ready);
                });
                return Promise.resolve(true);
              }
              const e = Object(ht["a"])();
              e.start("_cartApi");
              const t = new URLSearchParams(window.location.search);
              return this.makeDeferredRequest({
                method: "get",
                url: g.urls.cartAPI,
                params: Object.fromEntries(t),
              })
                .then(
                  Object(o["e"])(() => {
                    e.end("_cartApi");
                    this.status.set(g.storage.status.ready);
                  })
                )
                .catch(
                  Object(o["e"])(() => {
                    this.status.set(g.storage.status.unAvailable);
                  })
                );
            };
            this.addItems = function (e, n) {
              let r =
                arguments.length > 2 && arguments[2] !== undefined
                  ? arguments[2]
                  : {};
              const s = {
                method: "post",
                url: t.buildSessionUrl(e),
                data: { buyables: n.map((e) => e.buyable), context: r },
              };
              const o = (e) => ({
                id: e.id,
                buyable_object_type: e.buyable_object_type,
              });
              const i = (t, n) => {
                const r = n[e].map((e) => o(e.buyable));
                const s = (e) => {
                  let { id: t, buyable_object_type: n } = e;
                  return !!r.find(
                    (e) => e.id === t && e.buyable_object_type === n
                  );
                };
                t.data.buyables = t.data.buyables.filter((e) => !s(o(e)));
                return t.data.buyables.length === 0;
              };
              return t.makeDeferredRequest(s, i);
            };
            this.removeItem = (e, t) => {
              const n = t.buyable;
              const r = {
                method: "delete",
                params: { boId: n.id, boType: n.buyable_object_type },
                url: this.buildSessionUrl(e),
              };
              const s = (t, n) => {
                var r;
                const s = ((r = n[e]) !== null && r !== void 0 ? r : []).map(
                  (e) => e.buyable
                );
                const o = t.params[g.urlParams.buyableObjectType];
                const i = t.params[g.urlParams.buyableObjectId];
                const a = s.find(
                  (e) => e.buyable_object_type === o && e.id === i
                );
                return !a;
              };
              return this.makeDeferredRequest(r, s);
            };
            this.applyDiscounts = function () {
              let e =
                arguments.length > 0 && arguments[0] !== undefined
                  ? arguments[0]
                  : [];
              const n = (t, n) => {
                const r = n.discount_attempts.map((e) => e.code);
                const s = e.every((e) => r.includes(e));
                return Boolean(s);
              };
              return t.makeDeferredRequest(
                {
                  method: "post",
                  data: { codes: e },
                  url: t.buildSessionUrl("discounts"),
                },
                n
              );
            };
            this.removeDiscounts = (e) =>
              this.makeDeferredRequest({
                method: "delete",
                params: { codes: e.join(",") },
                url: this.buildSessionUrl("discounts"),
              });
            this.clearDiscounts = () =>
              this.makeRequest({
                method: "delete",
                url: this.buildSessionUrl("discounts"),
              });
            this.createExpressCheckoutSession = (e, t) => {
              const n = {
                method: "post",
                data: { buyables: e.map((e) => e.buyable) },
                url: g.urls.expressCheckoutAPI,
              };
              if (t) {
                n.data.codes = t;
              }
              return this.makeRequest(n);
            };
            p()(this, "transformResponse", Et, this);
            this.createShoppingError = (e) => {
              var t, n, r;
              return Promise.reject({
                canBeResolved:
                  ((t = e.response) === null || t === void 0
                    ? void 0
                    : t.status) === 412 ||
                  ((n = e.response) === null || n === void 0
                    ? void 0
                    : n.status) === 409,
                httpResponse: e.response,
                refetchedData:
                  (r = e.response) === null || r === void 0 ? void 0 : r.data,
              });
            };
            this.updateHeaders = (e) => {
              var t;
              e.headers = e.headers || {};
              if (
                ((t = e.method) === null || t === void 0
                  ? void 0
                  : t.toLowerCase()) === "get"
              ) {
                e.headers = { ...e.headers, ...Object(G["b"])() };
                e.params = { ...e.params, sessionState: this.state.etag || "" };
              } else if (this.state.etag) {
                e.headers["If-Match"] = this.state.etag;
              }
            };
            p()(this, "updateStateOnSuccess", Ct, this);
            setInterval(() => {
              this.fetch();
            }, 54e5);
          }
          get credit() {
            return this.state.credit;
          }
          get discounts() {
            return this.state.discounts;
          }
          get lists() {
            return this.state.lists;
          }
          get availableCoupons() {
            return this.state.availableCoupons;
          }
          setUserId(e) {
            this.state.userId = e;
            this.fetch();
          }
          setIsFeatureEnabled(e) {
            this.isShoppingCartFeatureEnabled = e;
          }
          makeDeferredRequest(e, t) {
            const n = (n, r) => {
              if (!r.canBeResolved) {
                n.actions.reject(r);
                return;
              }
              const s =
                t === null || t === void 0 ? void 0 : t(e, r.refetchedData);
              if (s) {
                this.updateStateOnSuccess(r.refetchedData);
                n.actions.resolve(true);
              } else {
                n.actions.retry(r);
              }
            };
            return this.queue.add(() => this.makeRequest(e), n);
          }
          makeRequest(e) {
            this.updateHeaders(e);
            return G["c"]
              .request(e)
              .then(this.transformResponse)
              .catch((e) => {
                this.transformResponse(e.response);
                throw e;
              })
              .then(this.updateStateOnSuccess, this.createShoppingError);
          }
          buildSessionUrl(e) {
            return `${g.urls.cartAPI}${e.replace(/_/g, "-")}/`;
          }
        }),
        (Ot = s()(kt.prototype, "isShoppingCartFeatureEnabled", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return true;
          },
        })),
        s()(
          kt.prototype,
          "credit",
          [o["g"]],
          Object.getOwnPropertyDescriptor(kt.prototype, "credit"),
          kt.prototype
        ),
        s()(
          kt.prototype,
          "discounts",
          [o["g"]],
          Object.getOwnPropertyDescriptor(kt.prototype, "discounts"),
          kt.prototype
        ),
        s()(
          kt.prototype,
          "lists",
          [o["g"]],
          Object.getOwnPropertyDescriptor(kt.prototype, "lists"),
          kt.prototype
        ),
        s()(
          kt.prototype,
          "availableCoupons",
          [o["g"]],
          Object.getOwnPropertyDescriptor(kt.prototype, "availableCoupons"),
          kt.prototype
        ),
        s()(
          kt.prototype,
          "setUserId",
          [o["e"]],
          Object.getOwnPropertyDescriptor(kt.prototype, "setUserId"),
          kt.prototype
        ),
        s()(
          kt.prototype,
          "setIsFeatureEnabled",
          [o["e"]],
          Object.getOwnPropertyDescriptor(kt.prototype, "setIsFeatureEnabled"),
          kt.prototype
        ),
        (Et = s()(kt.prototype, "transformResponse", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return (e) => {
              if (e.headers && e.headers.etag !== this.state.etag) {
                Object(o["x"])(() => {
                  this.state.etag = e.headers.etag;
                });
              }
              return e;
            };
          },
        })),
        (Ct = s()(kt.prototype, "updateStateOnSuccess", [o["e"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return (e) => {
              var t;
              if (!e || !e.data) {
                return Promise.resolve(false);
              }
              this.state.discounts.clear();
              this.state.discounts.replace(e.data.discount_attempts);
              this.state.credit.amount = e.data.user.id
                ? e.data.user.credit.amount
                : 0;
              this.state.availableCoupons =
                ((t = e.data.available_coupon_info) === null || t === void 0
                  ? void 0
                  : t.coupons) || [];
              g.shoppingListTypes.forEach((t) => {
                this.state.lists[t].clear();
                const n = e.data[t];
                if (n) {
                  Tt(n.map((e) => e.buyable));
                }
                this.state.lists[t].replace(e.data[t]);
                this.state.unseenCounts[t] = e.data[`${t}_unseen_count`] || 0;
              });
              this.storage.set("state", Object(o["A"])(this.state));
              return Promise.resolve(true);
            };
          },
        })),
        kt);
      function Tt(e) {
        e.filter((e) => !e.frontendTrackingId).forEach((e) => {
          e.frontendTrackingId = Object(ft["b"])();
        });
      }
      const It = new gt(new St());
      const Pt = [
        { type: "course", buildShoppingItems: (e) => [e] },
        {
          type: "bundle",
          buildShoppingItems: (e) => {
            const t = Object(o["A"])(e.buyable.courses);
            const n = [];
            t.forEach((e) => {
              const t = { ...e };
              t.buyable = e;
              n.push(t);
            });
            return n;
          },
        },
        {
          type: "gift",
          buildShoppingItems: (e) => {
            const t = Object(o["A"])(e);
            t.buyable = t.buyable.course;
            return [t];
          },
        },
        {
          type: "license",
          buildShoppingItems: (e) => {
            const t = Object(o["A"])(e);
            t.buyable = t.buyable.course;
            return [t];
          },
        },
      ];
      var Dt = n("./node_modules/autobind-decorator/lib/esm/index.js");
      var At = n("./node_modules/@udemy/braze/dist/esm/index.js");
      var Nt = n(
        "./node_modules/@udemy/browse-event-tracking/dist/esm/index.js"
      );
      var Rt = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
      );
      var Lt = n("./node_modules/@udemy/ud-data/dist/esm/index.js");
      const zt = "WISHLIST_DEFAULT_STATE";
      const Ut = "WISHLIST_LOADING_STATE";
      const Ft = "WISHLIST_FINISHED_STATE";
      var Mt, $t, Bt;
      let qt =
        ((Mt = class e {
          constructor(e, t) {
            let n =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : "course_landing_page";
            this.wishlistSource = void 0;
            this.course = void 0;
            this.searchParams = void 0;
            this.buyable = void 0;
            this.udMe = void 0;
            p()(this, "wishlistProcessState", $t, this);
            p()(this, "isWishlisted", Bt, this);
            this.course = e;
            this.searchParams = new URLSearchParams(
              Rt["a"].global.location.search
            );
            this.buyable = {
              buyable_object_type: "course",
              id: this.course.id,
            };
            this.udMe = t;
            this.wishlistSource = n;
            this.isWishlisted = this._getIsWishlisted(this.course.id);
          }
          _getIsWishlisted(e) {
            return It.lists.wishlist.items.some((t) => t.buyable.id === e);
          }
          _setIsWishlisted() {
            this.isWishlisted = true;
            this.course.is_wishlisted = true;
          }
          _clearIsWishlisted() {
            this.isWishlisted = false;
            this.course.is_wishlisted = false;
          }
          _setWishlistProcessState(e) {
            this.wishlistProcessState = e;
          }
          _buildNextUrl() {
            this.searchParams.set("xref", "wish");
            this.searchParams.set("courseId", this.course.id.toString());
            const e = `${
              Rt["a"].global.location.href.split("?")[0]
            }?${this.searchParams.toString()}`;
            return e;
          }
          _authUrl() {
            const e = this._buildNextUrl();
            const t = Rt["a"].global.location.href;
            if (this.udMe.is_authenticated && this.udMe.id) {
              return e;
            }
            return Lt["e"].toAuth({
              showLogin: false,
              nextUrl: e,
              returnUrl: t,
              source: this.wishlistSource,
              responseType: "html",
            });
          }
          logWishlistClickEvent() {
            i["a"].publishEvent(
              new Nt["h"]({
                id: this.course.id,
                trackingId:
                  this.course.frontendTrackingId ||
                  this.course.tracking_id ||
                  "",
              })
            );
            Object(At["b"])((e) => {
              if (e.isPushPermissionGranted()) {
                e.logCustomEvent("Wishlist", { course_id: this.course.id });
              }
            });
          }
          _addToWishlist() {
            this._setIsWishlisted();
            this._setWishlistProcessState(Ut);
            this.logWishlistClickEvent();
            return It.addToList("wishlist", [this.buyable])
              .then(
                Object(o["e"])(() => {
                  this._setWishlistProcessState(Ft);
                  return Promise.resolve();
                })
              )
              .catch(
                Object(o["e"])((e) => {
                  this._clearIsWishlisted();
                  this._setWishlistProcessState(zt);
                  throw e;
                })
              );
          }
          _removeFromWishlist() {
            this._clearIsWishlisted();
            this._setWishlistProcessState(Ut);
            return It.removeFromList("wishlist", { buyable: this.buyable })
              .then(
                Object(o["e"])(() => {
                  this._setWishlistProcessState(Ft);
                  return Promise.resolve();
                })
              )
              .catch(
                Object(o["e"])((e) => {
                  this._setIsWishlisted();
                  this._setWishlistProcessState(zt);
                  throw e;
                })
              );
          }
          _getHasWishlistIntent() {
            return this.searchParams.get("xref") === "wish";
          }
          toggleWishlist() {
            const e = this._authUrl();
            if (!this.udMe.is_authenticated || !this.udMe.id) {
              Rt["a"].global.location.href = e;
            } else if (!this.apiRequestIsLoading) {
              const e = this.isWishlisted
                ? this._removeFromWishlist
                : this._addToWishlist;
              this._setWishlistProcessState(zt);
              return e();
            }
          }
          removeWishlistIntent() {
            if (!this._getHasWishlistIntent()) {
              return;
            }
            this.searchParams.delete("xref");
            this.searchParams.delete("courseId");
            Rt["a"].global.history.replaceState(
              {},
              "",
              `${
                Rt["a"].global.location.pathname
              }?${this.searchParams.toString()}`
            );
          }
          get apiRequestIsLoading() {
            return this.wishlistProcessState === Ut;
          }
        }),
        ($t = s()(Mt.prototype, "wishlistProcessState", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: function () {
            return zt;
          },
        })),
        (Bt = s()(Mt.prototype, "isWishlisted", [o["t"]], {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: null,
        })),
        s()(
          Mt.prototype,
          "_getIsWishlisted",
          [Dt["a"]],
          Object.getOwnPropertyDescriptor(Mt.prototype, "_getIsWishlisted"),
          Mt.prototype
        ),
        s()(
          Mt.prototype,
          "_setIsWishlisted",
          [Dt["a"], o["e"]],
          Object.getOwnPropertyDescriptor(Mt.prototype, "_setIsWishlisted"),
          Mt.prototype
        ),
        s()(
          Mt.prototype,
          "_clearIsWishlisted",
          [Dt["a"], o["e"]],
          Object.getOwnPropertyDescriptor(Mt.prototype, "_clearIsWishlisted"),
          Mt.prototype
        ),
        s()(
          Mt.prototype,
          "_setWishlistProcessState",
          [Dt["a"], o["e"]],
          Object.getOwnPropertyDescriptor(
            Mt.prototype,
            "_setWishlistProcessState"
          ),
          Mt.prototype
        ),
        s()(
          Mt.prototype,
          "_buildNextUrl",
          [Dt["a"]],
          Object.getOwnPropertyDescriptor(Mt.prototype, "_buildNextUrl"),
          Mt.prototype
        ),
        s()(
          Mt.prototype,
          "_authUrl",
          [Dt["a"]],
          Object.getOwnPropertyDescriptor(Mt.prototype, "_authUrl"),
          Mt.prototype
        ),
        s()(
          Mt.prototype,
          "logWishlistClickEvent",
          [Dt["a"]],
          Object.getOwnPropertyDescriptor(
            Mt.prototype,
            "logWishlistClickEvent"
          ),
          Mt.prototype
        ),
        s()(
          Mt.prototype,
          "_addToWishlist",
          [Dt["a"]],
          Object.getOwnPropertyDescriptor(Mt.prototype, "_addToWishlist"),
          Mt.prototype
        ),
        s()(
          Mt.prototype,
          "_removeFromWishlist",
          [Dt["a"]],
          Object.getOwnPropertyDescriptor(Mt.prototype, "_removeFromWishlist"),
          Mt.prototype
        ),
        s()(
          Mt.prototype,
          "_getHasWishlistIntent",
          [Dt["a"]],
          Object.getOwnPropertyDescriptor(
            Mt.prototype,
            "_getHasWishlistIntent"
          ),
          Mt.prototype
        ),
        s()(
          Mt.prototype,
          "toggleWishlist",
          [Dt["a"], o["e"]],
          Object.getOwnPropertyDescriptor(Mt.prototype, "toggleWishlist"),
          Mt.prototype
        ),
        s()(
          Mt.prototype,
          "removeWishlistIntent",
          [Dt["a"]],
          Object.getOwnPropertyDescriptor(Mt.prototype, "removeWishlistIntent"),
          Mt.prototype
        ),
        s()(
          Mt.prototype,
          "apiRequestIsLoading",
          [o["g"]],
          Object.getOwnPropertyDescriptor(Mt.prototype, "apiRequestIsLoading"),
          Mt.prototype
        ),
        Mt);
      var Wt = n("./node_modules/@udemy/icons/dist/wishlisted.ud-icon");
      var Gt = n.n(Wt);
      const Ht = {
        fill: "transparent",
        padding: "1px",
        stroke: "currentColor",
        strokeWidth: "2",
      };
      const Vt = (e) =>
        U.a.createElement(
          Gt.a,
          Object.assign({ label: false }, e, { style: Ht })
        );
      Vt.$$udType = "Icon";
      const Kt = (e) => {
        const {
          isWishlisted: t,
          isLoading: n,
          onClick: r,
          round: s = false,
          size: o = "medium",
          wishlistCta: i = undefined,
          wishlistedCta: a = null,
          labelPosition: c = "left",
          square: d = false,
          givenButtonProps: u,
        } = e;
        const { gettext: l } = Object(D["j"])();
        const p = {
          udStyle: "secondary",
          size: o,
          onClick: r,
          ...u,
          disabled: u === null || u === void 0 ? void 0 : u.disabled,
          "aria-pressed": t,
          "aria-label": i,
        };
        const m = t ? Gt.a : Vt;
        const g = n ? U.a.createElement(we["a"], { color: "inherit" }) : null;
        const f = i !== null && i !== void 0 ? i : l("Add to wishlist");
        const h = a !== null && a !== void 0 ? a : l("Wishlisted");
        const v = t ? h : f;
        if (d || s) {
          return U.a.createElement(
            B["a"],
            Object.assign({}, p, { round: s }),
            g !== null && g !== void 0
              ? g
              : U.a.createElement(m, { color: "inherit", label: false })
          );
        }
        return U.a.createElement(
          q["a"],
          p,
          g !== null && g !== void 0
            ? g
            : U.a.createElement(
                U.a.Fragment,
                null,
                c == "left" && U.a.createElement("span", null, v),
                U.a.createElement(m, {
                  color: "inherit",
                  size: c == "right" ? o : "small",
                  label: false,
                }),
                c == "right" && U.a.createElement("span", null, v)
              )
        );
      };
      var Yt;
      let Jt =
        Object(L["f"])(
          (Yt = class e extends U.a.Component {
            render() {
              const {
                wishlistStore: e,
                round: t,
                isMobile: n,
                udData: r,
                gettext: s,
                ...o
              } = this.props;
              const { Config: i, me: a } = r;
              if (!i.features.wishlist || a.isLoading) {
                return null;
              }
              return U.a.createElement(
                "div",
                null,
                U.a.createElement(
                  Kt,
                  Object.assign(
                    {
                      "data-purpose": "toggle-wishlist",
                      isWishlisted: e.isWishlisted,
                      isLoading: e.apiRequestIsLoading,
                      onClick: e.toggleWishlist,
                      round: t,
                      wishlistCta: n ? s("Add to Wishlist") : s("Wishlist"),
                    },
                    o
                  )
                )
              );
            }
          })
        ) || Yt;
      const Xt = Object(D["k"])(Object(Lt["j"])(Jt));
      n.d(t, "i", function () {
        return R;
      });
      n.d(t, "a", function () {
        return A;
      });
      n.d(t, "b", function () {
        return qe;
      });
      n.d(t, "g", function () {
        return g;
      });
      n.d(t, "f", function () {
        return He;
      });
      n.d(t, "c", function () {
        return It;
      });
      n.d(t, "h", function () {
        return Pt;
      });
      n.d(t, "e", function () {
        return qt;
      });
      n.d(t, "d", function () {
        return Xt;
      });
    },
    "./node_modules/@udemy/shopping/dist/esm/save-to-list/save-to-list-modal.module.css":
      function (e, t, n) {
        e.exports = {
          "save-to-list-modal":
            "save-to-list-modal-module--save-to-list-modal--1Tq7o",
          "alert-box": "save-to-list-modal-module--alert-box--2txip",
        };
      },
    "./node_modules/@udemy/shopping/dist/esm/save-to-list/save-to-list-selection-form.module.css":
      function (e, t, n) {
        e.exports = {
          "new-list-button":
            "save-to-list-selection-form-module--new-list-button--1ECM2",
          "new-list-form":
            "save-to-list-selection-form-module--new-list-form--1df8A",
          "checkbox-group":
            "save-to-list-selection-form-module--checkbox-group--3R7ZP",
        };
      },
    "./node_modules/@udemy/store-provider/dist/esm/store-context.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "c", function () {
        return o;
      });
      n.d(t, "a", function () {
        return i;
      });
      n.d(t, "b", function () {
        return c;
      });
      var r = n("./node_modules/react/index.js");
      var s = n.n(r);
      const o = "STORE_ID";
      const i = Object(r["createContext"])({ stores: [] });
      function a(e) {
        const t = e.constructor[o];
        if (!t) {
          throw new Error(
            `"${o}" property needs to be defined on store "${
              e.constructor.name
            }" passed to <StoreProvider />: ${JSON.stringify(e).slice(
              0,
              30
            )}...`
          );
        }
        return t;
      }
      const c = (e) => {
        let { stores: t, children: n } = e;
        const r = {
          stores: t.reduce((e, t) => {
            const n = a(t);
            e[n] = t;
            return e;
          }, {}),
        };
        const o = s.a.useContext(i);
        if (Object.keys(o.stores).length > 0) {
          const e = t.map(a);
          const n = Object.keys(o.stores);
          const s = n.filter((t) => e.indexOf(t) > -1);
          if (s.length > 0) {
            console.warn(
              `The following stores are defined in multiple <StoreProvider />: ${s}`
            );
          }
          r.stores = { ...o.stores, ...r.stores };
        }
        return s.a.createElement(i.Provider, { value: r }, n);
      };
    },
    "./node_modules/@udemy/store-provider/dist/esm/use-stores.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "a", function () {
        return i;
      });
      var r = n("./node_modules/react/index.js");
      var s = n.n(r);
      var o = n(
        "./node_modules/@udemy/store-provider/dist/esm/store-context.js"
      );
      const i = (e) => {
        const { stores: t } = Object(r["useContext"])(o["a"]);
        const n = e.map((e) => {
          const n = e[o["c"]];
          if (!n) {
            throw new Error(
              `class "${e.name}" is missing static "${o["c"]}" property`
            );
          }
          const r = t[n];
          if (!r) {
            if (typeof globalThis["_STORES"] === "object") {
              const e = globalThis["_STORES"][n];
              if (e) {
                return e;
              }
            }
            throw new Error(
              `Store "${n}" has not been registered with the StoreProvider`
            );
          }
          return r;
        });
        return n;
      };
    },
    "./node_modules/@udemy/store-provider/dist/esm/with-stores.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "a", function () {
        return o;
      });
      var r = n(
        "./node_modules/@udemy/shared-utils/dist/esm/react/make-hoc.js"
      );
      var s = n("./node_modules/@udemy/store-provider/dist/esm/use-stores.js");
      function o(e, t) {
        const n = Object(r["a"])({
          useGetData: () => {
            const t = Object(s["a"])(e);
            return { stores: t };
          },
          getDisplayName: (e) => `WithStore(${e})`,
          getPropTypes: (e) => {
            const { stores: t, ...n } = e;
            return n;
          },
        });
        return n(t);
      }
    },
    "./node_modules/@udemy/styles/dist/esm/tokens/generated/index.js":
      function (e, t, n) {
        "use strict";
        n.d(t, "a", function () {
          return r;
        });
        const r = {
          "color-gray-600": "#101112",
          "color-gray-550": "#1c1d1f",
          "color-gray-500": "#2d2f31",
          "color-gray-400": "#3e4143",
          "color-gray-300": "#6a6f73",
          "color-gray-250": "#9da3a7",
          "color-gray-200": "#d1d7dc",
          "color-gray-150": "#e4e8eb",
          "color-gray-100": "#f7f9fa",
          "color-red-500": "#612012",
          "color-red-400": "#b32d0f",
          "color-red-300": "#f4522d",
          "color-red-250": "#ef8e70",
          "color-red-200": "#fcbca0",
          "color-red-150": "#fbd5c4",
          "color-red-100": "#fbece9",
          "color-blue-500": "#180a3d",
          "color-blue-400": "#371783",
          "color-blue-300": "#5624d0",
          "color-blue-250": "#8072e6",
          "color-blue-200": "#c0c4fc",
          "color-blue-150": "#d8e0fb",
          "color-blue-100": "#eeeffc",
          "color-orange-500": "#4d3105",
          "color-orange-400": "#b4690e",
          "color-orange-300": "#f69c08",
          "color-orange-250": "#ebb152",
          "color-orange-200": "#f3ca8c",
          "color-orange-150": "#f7dfba",
          "color-orange-100": "#fcf5e8",
          "color-yellow-500": "#3d3c0a",
          "color-yellow-400": "#98961b",
          "color-yellow-300": "#e9e729",
          "color-yellow-250": "#eeec5d",
          "color-yellow-200": "#eceb98",
          "color-yellow-150": "#f3f2b8",
          "color-yellow-100": "#f9f9d7",
          "color-green-500": "#113731",
          "color-green-400": "#1e6055",
          "color-green-300": "#19a38c",
          "color-green-250": "#6cb1a5",
          "color-green-200": "#acd2cc",
          "color-green-150": "#cfe4e1",
          "color-green-100": "#f2f7f6",
          "color-purple-500": "#350c50",
          "color-purple-400": "#7325a3",
          "color-purple-300": "#a435f0",
          "color-purple-250": "#c377f6",
          "color-purple-200": "#e1b8fc",
          "color-purple-150": "#ebd3fc",
          "color-purple-100": "#f6eefc",
          "color-white": "#fff",
          "color-indigo-500": "#180a3d",
          "color-indigo-400": "#371783",
          "color-indigo-300": "#5624d0",
          "color-indigo-200": "#c0c4fc",
          "color-indigo-100": "#eeeffc",
          "color-icon-neutral": "#2d2f31",
          "color-icon-positive": "#19a38c",
          "color-icon-negative": "#f4522d",
          "color-icon-info": "#5624d0",
          "color-icon-warning": "#f69c08",
          "color-icon-subdued": "#6a6f73",
          "color-icon-star": "#b4690e",
          "color-text-default": "#2d2f31",
          "color-text-subdued": "#6a6f73",
          "color-text-white": "#fff",
          "color-text-link": "#5624d0",
          "color-text-positive": "#1e6055",
          "color-text-positive-dark": "#113731",
          "color-text-negative": "#b32d0f",
          "color-text-negative-dark": "#612012",
          "color-text-warning": "#b4690e",
          "color-text-warning-dark": "#4d3105",
          "color-text-info": "#2d2f31",
          "color-text-star-rating": "#4d3105",
          "color-text-default-inverted": "#fff",
          "color-text-link-inverted": "#c0c4fc",
          "color-text-subdued-inverted": "#d1d7dc",
          "color-icon-subdued-inverted": "#d1d7dc",
          "color-icon-star-inverted": "#f69c08",
          "font-size-4xl": "4.8rem",
          "font-size-xxxl": "4rem",
          "font-size-xxl": "3.2rem",
          "font-size-xl": "2.4rem",
          "font-size-lg": "1.9rem",
          "font-size-md": "1.6rem",
          "font-size-sm": "1.4rem",
          "font-size-xs": "1.2rem",
          "font-stack-mono":
            "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace",
          "font-stack-heading":
            "'Udemy Sans',-apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'",
          "font-stack-heading-serif":
            "SuisseWorks,Georgia,Times,'Times New Roman',serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'",
          "font-stack-text":
            "'Udemy Sans','SF Pro Text',-apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'",
          "font-stack-heading-serif-vi-vn":
            "'Times New Roman',Georgia,Times,serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'",
          "font-stack-heading-vi-vn":
            "Arial,-apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'",
          "font-stack-text-vi-vn":
            "Arial -apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Helvetica,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'",
          "space-xxs": ".4rem",
          "space-xs": ".8rem",
          "space-sm": "1.6rem",
          "space-md": "2.4rem",
          "space-lg": "3.2rem",
          "space-xl": "4.8rem",
          "space-xxl": "6.4rem",
          "space-xxxl": "9.6rem",
          "layout-ud-container-padding": "2.4rem",
          "space-section": "4.8rem",
          "space-section-lg": "6.4rem",
          "animation-duration-extrafast": "100ms",
          "animation-duration-fast": "150ms",
          "animation-duration-moderate": "250ms",
          "animation-duration-slow": "400ms",
          "breakpoint-to-length": "1.6rem",
          "breakpoint-xxl-min": "83.81rem",
          "breakpoint-xl-max": "83.75rem",
          "breakpoint-xl-min": "75.06rem",
          "breakpoint-lg-max": "75rem",
          "breakpoint-lg-min": "61.31rem",
          "breakpoint-md-max": "61.25rem",
          "breakpoint-md-min": "43.81rem",
          "breakpoint-sm-max": "43.75rem",
          "breakpoint-sm-min": "37.56rem",
          "breakpoint-mobile-max": "37.5rem",
          "breakpoint-mobile-min": "23.5rem",
          "breakpoint-mobile-xs-max": "23.44rem",
          "breakpoint-mobile-xs-min": "20rem",
          "breakpoint-mobile-xxs-max": "19.94rem",
          "breakpoint-header-mobile-max": "50rem",
          "breakpoint-header-desktop-min": "50.06rem",
          "layout-12-column-page-gutter": "1.6rem",
          "layout-12-column-page-12-columns-min": "43.81rem",
          "layout-12-column-page-4-columns-max": "43.75rem",
          "layout-12-column-page-4-columns-min": "23.5rem",
          "layout-12-column-page-2-columns-max": "23.44rem",
        };
      },
    "./node_modules/@udemy/styles/dist/esm/tokens/index.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      n.d(t, "c", function () {
        return o;
      });
      n.d(t, "b", function () {
        return c;
      });
      n.d(t, "a", function () {
        return d;
      });
      const r = 16;
      const s = 0.625;
      const o = (e) => e / (s * r);
      const i = (e) => Math.round((e / r) * 100) / 100;
      const a = (e) => {
        const t = typeof e === "string" ? Number(e.replace("em", "")) : e;
        return Math.round(((t * r) / 100) * 100);
      };
      const c = (e) => {
        const t = typeof e === "string" ? Number(e.replace("rem", "")) : e;
        return Math.round(((t * r) / 100) * 100);
      };
      const d = (e) => Math.round((e / r) * 100) / 100;
    },
    "./node_modules/@udemy/ud-api/dist/esm/index.js": function (e, t, n) {
      "use strict";
      var r = n("./node_modules/axios/index.js");
      var s = n.n(r);
      var o = n(
        "./node_modules/@udemy/ud-api/node_modules/js-cookie/dist/js.cookie.js"
      );
      var i = n.n(o);
      var a = n("./node_modules/@udemy/shared-utils/dist/esm/env/ud-me.js");
      var c = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-config-data.js"
      );
      var d = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
      );
      var u = n("./node_modules/@udemy/shared-utils/dist/esm/lodashy/noop.js");
      function l(e) {
        return toString.call(e) === "[object Array]";
      }
      function p(e) {
        return e !== null && typeof e === "object";
      }
      function m(e) {
        return toString.call(e) === "[object Date]";
      }
      function g(e, t) {
        if (e === null || typeof e === "undefined") {
          return;
        }
        if (typeof e !== "object") {
          e = [e];
        }
        if (l(e)) {
          for (let n = 0, r = e.length; n < r; n++) {
            t.call(null, e[n], n, e);
          }
        } else {
          for (const n in e) {
            if (Object.prototype.hasOwnProperty.call(e, n)) {
              t.call(null, e[n], n, e);
            }
          }
        }
      }
      const f = () => Object(a["a"])();
      const h = "api-2.0";
      const v = 2e4;
      const y = 6e4;
      const b = "x-udemy-additional-context";
      const _ = "Accept-Language";
      const j = "X-Udemy-Additional-Context-Requested";
      let w;
      function x() {
        const e = Object(c["a"])();
        return d["a"].isClient
          ? e.url.to_root
          : "/server-side-rendering-does-not-allow-api-calls/";
      }
      function k() {
        return { "X-Requested-With": "XMLHttpRequest", ...M(), ...B() };
      }
      function O(e) {
        return e("Unexpected error occurred");
      }
      function E() {
        const e = x();
        return `${e}`;
      }
      function C() {
        const e = x();
        return `${e}organization-analytics/`;
      }
      function S() {
        const e = x();
        return `${e}tapen/${h}/`;
      }
      const T = A();
      const I = N();
      const P = R();
      const D = L();
      function A() {
        const e = F();
        e.interceptors.request.use((t) => {
          t.baseURL = e.config.getBaseUrl();
          return t;
        });
        e.get = G(e.get);
        e.get = W(e.get);
        e.post = W(e.post);
        e.put = W(e.put);
        e.patch = W(e.patch);
        return e;
      }
      function N() {
        const e = F();
        e.interceptors.request.use((e) => {
          e.baseURL = S();
          return e;
        });
        e.get = W(e.get);
        e.post = W(e.post);
        e.put = W(e.put);
        e.patch = W(e.patch);
        return e;
      }
      function R() {
        const e = F({
          xsrfCookieName: "csrftoken",
          xsrfHeaderName: "X-CSRFToken",
        });
        e.interceptors.request.use((e) => {
          e.baseURL = E();
          return e;
        });
        return e;
      }
      function L() {
        const e = F();
        e.interceptors.request.use((e) => {
          e.baseURL = C();
          return e;
        });
        return e;
      }
      function z(e) {
        Object(c["b"])(e.data);
        return e;
      }
      function U(e) {
        if (e.headers && e.headers[b]) {
          Object(c["b"])(e.headers[b]);
          i.a.remove(j);
        }
        return e;
      }
      function F(e) {
        const t = k();
        const n = s.a.create({
          headers: t,
          timeout: y,
          paramsSerializer: Y,
          ...e,
        });
        n.interceptors.response.use(
          (e) => U(e),
          (e) => {
            const t = e.response && e.response.headers;
            const n = f().id;
            const r = f().isLoading;
            if (
              t &&
              t["x-udemy-failed-permission"] === "user-auth" &&
              !r &&
              n
            ) {
              d["a"].global.location.reload();
              return u["a"];
            }
            return Promise.reject(e);
          }
        );
        n.config = {
          getBaseUrl: () => {
            const e = x();
            return `${e}${h}/`;
          },
        };
        n.configure = (e) => {
          n.config = { ...n.config, ...e };
        };
        return n;
      }
      function M() {
        try {
          const e = i.a.get(j);
          const t = e && JSON.parse(e);
          if (t && !t.requires_api_call) {
            const e = JSON.stringify(t.value);
            return { "X-Udemy-Additional-Context-Requested": e };
          }
        } catch (e) {
          return {};
        }
        return {};
      }
      function $() {
        const e = i.a.get() || {};
        if (Object.prototype.hasOwnProperty.call(e, "ud_client_cache_off")) {
          return {};
        }
        const t = {};
        Object.entries(e)
          .filter((e) => e[0].startsWith("ud_cache_"))
          .forEach((e) => {
            const n = e[0].split("ud_cache_")[1];
            const r = n
              .split("_")
              .map((e) => e.slice(0, 1).toUpperCase() + e.slice(1))
              .join("-");
            const s = `X-Udemy-Cache-${r}`;
            t[s] = String(e[1]);
          });
        return t;
      }
      function B() {
        const e = i.a.get() || {};
        if (e.ud_locale) {
          const t = e.ud_locale.split("_").join("-");
          return { [_]: t };
        }
      }
      function q() {
        w = {};
      }
      function W(e) {
        return function (t) {
          const n = Object(c["a"])();
          if (n.env !== "PROD") {
            const e = `Deprecated API call without trailing slash detected: "${t}". Fix this by adding trailing slash`;
            const n = new URL(t, "https://example.com");
            if (!n.pathname.endsWith("/")) {
              throw Error(e);
            }
            if (n.pathname.includes("//")) {
              throw Error(
                `Double slashes detected in: ${t}. Might be a hint that the url is wrong`
              );
            }
          }
          for (
            var r = arguments.length, s = new Array(r > 1 ? r - 1 : 0), o = 1;
            o < r;
            o++
          ) {
            s[o - 1] = arguments[o];
          }
          return e(t, ...s);
        };
      }
      function G(e) {
        q();
        return function (t) {
          let n =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {};
          n.headers = { ...n.headers, ...$() };
          if (!n.useCache) {
            return e(t, n);
          }
          const r = JSON.stringify(Object.assign({ url: t }, n));
          const s = new Date().getTime();
          const o = n.expires ? n.expires * 1e3 : 1e3 * 60 * 60;
          if (w[r]) {
            if (w[r].expires <= s) {
              delete w[r];
            } else {
              return w[r].request;
            }
          }
          const i = e(t, n);
          w[r] = { request: i, expires: s + o };
          return i.catch((e) => {
            delete w[r];
            throw e;
          });
        };
      }
      const H = (e) => {
        if (e.isParsedError) {
          return e;
        }
        if (e.response) {
          return Object.assign(
            { isParsedError: true, statusCode: e.response.status },
            e.response.data
          );
        }
        return { detail: e.message, JSError: e, isParsedError: true };
      };
      function V(e, t, n, r, s, o, i, a) {
        const c = A();
        if (s() && !a.isCanceled) {
          a.timeoutId = setTimeout(() => {
            c.get(e, { params: t })
              .then((c) => {
                if (o && o(c.data)) {
                  return;
                }
                if (n) {
                  n(c.data);
                }
                V(e, t, n, r, s, o, i, a);
              })
              .catch((e) => {
                if (r) {
                  r(H(e));
                }
              });
          }, i);
        }
        return a.cancel;
      }
      function K(e, t, n, r, s, o, i) {
        const a = {
          isCanceled: false,
          timeoutId: undefined,
          cancel() {
            clearInterval(a.timeoutId);
            a.isCanceled = true;
          },
        };
        return V(e, t, n, r, s, o, i, a);
      }
      function Y(e, t) {
        t = { arrayBrackets: true, ...t };
        const n = [];
        g(e, (e, r) => {
          if (e === null || typeof e === "undefined") {
            return;
          }
          if (l(e)) {
            if (t.arrayBrackets) {
              r = `${r}[]`;
            }
          } else {
            e = [e];
          }
          g(e, (e) => {
            if (m(e)) {
              e = e.toISOString();
            } else if (p(e)) {
              e = JSON.stringify(e);
            }
            n.push(`${J(r)}=${J(e)}`);
          });
        });
        return n.join("&");
      }
      function J(e) {
        return encodeURIComponent(e)
          .replace(/%40/gi, "@")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",")
          .replace(/%20/g, "+")
          .replace(/%5B/gi, "[")
          .replace(/%5D/gi, "]");
      }
      function X(e, t, n, r) {
        const s = [];
        const o = r || A();
        function i(e, t) {
          t = Object.assign({}, { params: t }, n);
          return o.get(e, t).then((e) => {
            s.push(...e.data.results);
            const t = e.data.next;
            if (!t) {
              return s;
            }
            return i(t);
          });
        }
        return i(e, t);
      }
      let Z = {};
      async function Q(e) {
        const t = Y(e, {});
        let n = Z[t];
        if (!n) {
          n = T.get("/contexts/me/", { params: e }).then((e) => {
            delete Z[t];
            return e.data ? e : new Promise(() => null);
          });
          Z[t] = n;
        }
        return n;
      }
      Q.reset = () => {
        Z = {};
      };
      const ee = () => {};
      const te = {
        increment(e, t) {
          let n =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : ee;
          let r =
            arguments.length > 3 && arguments[3] !== undefined
              ? arguments[3]
              : ee;
          T.post("/visits/me/datadog-increment-logs/", {
            key: e,
            tags: JSON.stringify(t),
          })
            .then(n)
            .catch(r);
        },
      };
      var ne = n("./node_modules/axios-mock-adapter/src/index.js");
      var re = n.n(ne);
      let se;
      function oe(e) {
        const t = new re.a(e);
        t.restore = function e() {
          throw new Error(
            "restore() cannot be called on this MockAdapter, as it is shared across test cases"
          );
        };
        return t;
      }
      function ie() {
        if (!se) {
          se = oe(T);
        }
        return se;
      }
      n.d(t, "a", function () {
        return Q;
      });
      n.d(t, "c", function () {
        return T;
      });
      n.d(t, "e", function () {
        return I;
      });
      n.d(t, "b", function () {
        return $;
      });
      n.d(t, "d", function () {
        return te;
      });
    },
    "./node_modules/@udemy/ud-data/dist/esm/index.js": function (e, t, n) {
      "use strict";
      var r = n("./node_modules/deepmerge/dist/cjs.js");
      var s = n.n(r);
      var o = n("./node_modules/react/index.js");
      var i = n.n(o);
      var a = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
      );
      const c =
        "No UD data context was provided. Make sure you wrapped your app in the UDDataProvider";
      const d =
        'Unable to resolve UD data context; falling back to global scope. This warning is shown because the environment variable UD_FRONTENDS_LOG_WARNINGS is set to "true".';
      function u() {
        const e = a["a"].global.UD;
        return e;
      }
      function l() {
        const e = i.a.useContext(f);
        if (e) {
          return e.data;
        }
        const t = u();
        if (t) {
          if (false) {
          }
          return t;
        }
        throw new Error(c);
      }
      const p = "update-uddata-provider";
      function m() {
        const e = i.a.useContext(f);
        if (!e) {
          throw new Error(c);
        }
        return e.setUDData;
      }
      function g() {
        const e = m();
        i.a.useEffect(() => {
          const t = (t) => {
            const n = t.detail;
            e(n);
          };
          window.addEventListener(p, t);
          return () => {
            window.removeEventListener(p, t);
          };
        }, [e]);
        return i.a.createElement("span", {
          "data-testid": "UDDataProviderBridge",
        });
      }
      const f = i.a.createContext(null);
      const h = (e) => {
        let {
          data: t,
          children: n,
          mode: r,
          useBridge: a,
          suppressNestedDataWarning: c,
        } = e;
        const d = i.a.useContext(f);
        let u;
        const l =
          r || (d === null || d === void 0 ? void 0 : d.mode) || "passthru";
        if (!d && !t) {
          throw new Error("No data was provided to root <UDDataProvider />");
        }
        const p = d && l === "merge" ? s()(d.data, t) : t;
        const [m, h] = i.a.useState(p);
        const v = i.a.useCallback(
          (e) => {
            const t = s()({ ...m }, e);
            h(t);
          },
          [m]
        );
        Object(o["useEffect"])(() => {
          if (JSON.stringify(p) !== JSON.stringify(m)) {
            h(p);
          }
        }, [JSON.stringify(p)]);
        if (!d || l === "merge") {
          u = { data: m, setUDData: v, mode: r, suppressNestedDataWarning: c };
        } else {
          if (t && !d.suppressNestedDataWarning) {
            console.warn(
              "Data argument provided to a nested <UDDataProvider /> will be ignored"
            );
          }
          u = d;
        }
        return i.a.createElement(
          f.Provider,
          { value: u },
          a ? i.a.createElement(g, null) : null,
          n
        );
      };
      var v = n(
        "./node_modules/@udemy/shared-utils/dist/esm/react/make-hoc.js"
      );
      const y = Object(v["a"])({
        useGetData: () => {
          const e = l();
          return { udData: e };
        },
        getDisplayName: (e) => `WithUDData(${e})`,
        getPropTypes: (e) => {
          const { udData: t, ...n } = e;
          return n;
        },
      });
      var b = n(
        "./node_modules/currencyformatter.js/dist/currencyFormatter.js"
      );
      var _ = n.n(b);
      const j = "usd";
      const w = "en_US";
      const x = 2;
      function k(e) {
        let t =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {};
        const n = Object.assign(
          {
            currency: j,
            symbol: "$",
            locale: w,
            decimal: ".",
            group: ",",
            pattern: "!#,##0.00",
            scale: x,
          },
          t
        );
        if (!(n.locale in _.a.locales)) {
          n.locale = n.locale.substring(0, 2);
        }
        if (!(n.locale in _.a.locales)) {
          n.locale = "en_US";
        }
        n.pattern = n.pattern.replace(
          ".00",
          `.${new Array(n.scale + 1).join("0")}`
        );
        e = +(+e).toFixed(n.scale);
        return _.a.format(e, n);
      }
      function O() {
        const { Config: e } = l();
        const t = i.a.useCallback(
          function (t) {
            var n, r;
            let s =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {};
            const o =
              (n =
                (r = e.price_country) === null || r === void 0
                  ? void 0
                  : r.currency_formatter) !== null && n !== void 0
                ? n
                : {};
            return k(t, { ...o, ...s });
          },
          [e.price_country.currency_formatter]
        );
        return { formatCurrency: t };
      }
      var E = n("./node_modules/@udemy/i18n/dist/esm/index.js");
      function C(e, t, n) {
        let r = e.site_stats.default[n];
        if (
          e.Config.brand.has_organization &&
          n in e.site_stats.organizations
        ) {
          r = e.site_stats.organizations[n];
        }
        return typeof r === "number" ? Object(E["c"])(r, t) : r;
      }
      function S(e, t, n) {
        const r = e.site_stats.organizations[n];
        return typeof r === "number" ? Object(E["c"])(r, t) : r;
      }
      function T() {
        const e = l();
        const { locale: t } = Object(E["j"])();
        const n = i.a.useCallback((n) => C(e, t, n), [t, e]);
        const r = i.a.useCallback((n) => S(e, t, n), [t, e]);
        return { getNumericSiteStat: n, getOrgNumericSiteStat: r };
      }
      var I = n("./node_modules/@udemy/ud-data/node_modules/qs/lib/index.js");
      var P = n.n(I);
      var D = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-config-data.js"
      );
      var A = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-request-data.js"
      );
      const N = {
        assessment_benchmarking: { id: 0x952935eb017 },
        course_image_quality: { id: 229232347 },
        course_quality_checklist: { id: 229604988 },
        course_taking__course_player__downloading: { id: 229231167 },
        terms_subscriptions: { id: 360037136254 },
        subscription_faq: { id: 360037461154 },
        certificate_of_completion: { id: 229603868 },
        video_audio_issues_troubleshooting: { id: 229231227 },
        downloading_supplemental_resources: { id: 229604708 },
        free_course_experience: { id: 360040701614 },
        free_preview: { id: 229604168 },
        course_removal: { id: 360046264693 },
        course_material_basics: { id: 360001167193 },
        course_title_quality_standards: { id: 229232467 },
        history_log: { id: 360053657313 },
        system_requirements: { id: 229231047 },
        student_taxes: { id: 229233627 },
        manage_subscription: { id: 1500002916481 },
        marketplace_maintenance_program: { id: 4403234024855 },
        adding_co_instructors: { id: 229604308 },
        labs_alr_support_article: { id: 0xd2558907897 },
        labs_web_development_support_article: { id: 8026238181399 },
        adding_captions_to_video: { id: 229605428 },
        ncc_official_rules: { id: 115012790188 },
        how_to_create_coding_exercise: { id: 115002883587 },
        certification_prep: { id: 0xc8f5b0f0e97 },
      };
      const R = Object.assign({}, N, {
        certificate_of_completion: { id: 115005370507 },
        create_user_group: { id: 115005396148 },
        video_audio_issues_troubleshooting: { id: 115005369487 },
        downloading_supplemental_resources: { id: 115005537648 },
        course_insights_enterprise_plan_only: { id: 115010907447 },
        user_activity: { id: 115011062868 },
        user_activity_active_users: { id: 360044845993 },
        ratings_reviews_dashboard: { id: 360056074933 },
        learner_feedback: { id: 360057021414 },
        sso_documentation_azure: { id: 115009490608 },
        sso_documentation_google: { id: 115007944287 },
        sso_documentation_okta: { id: 360035681493 },
        sso_documentation_onelogin: { id: 115007942207 },
        sso_documentation_adfs: { id: 115007945527 },
        sso_documentation_general: { id: 115008213828 },
        skills_insights_dashboard: { id: 4874004165271 },
        when_is_data_updated: { id: 360044845893 },
        lms_integration_documentation: { id: 360060315253 },
        auto_assign_rule_info: { id: 1500001196281 },
        system_requirements: { id: 115005533888 },
        learning_challenges: { id: 1500011171982 },
        group_insights: { id: 1500010830622 },
        my_groups: { id: 1500010862021 },
        pro_insights: { id: 4404566692759 },
        export_reports: { id: 115005251587 },
        inviting_users: { id: 115005395268 },
        course_retirements: { id: 115005650668 },
        scheduler_learning_event: { id: 4498682272279 },
        assessment_benchmarking: { id: 4412308049175 },
        labs_alr_support_article: { id: 0x9f1fe7dbe97 },
        labs_aws_support_article: { id: 360056038774 },
        labs_azure_support_article: { id: 4586061730199 },
        labs_data_science_support_article: { id: 360058699133 },
        labs_web_development_support_article: { id: 4410623949463 },
        labs_devops_support_article: { id: 6806664783639 },
        labs_select_mode_support_article: { id: 1500011210921 },
        adding_more_licenses: { id: 115005396128 },
        learning_culture_webinar_link: { id: 115013724427 },
        team_plan_receipts: { id: 360015876213 },
        approving_course: { id: 115006844788 },
        importing_course: { id: 115005228607 },
        creating_course: { id: 115005523008 },
        adding_removing_courses: { id: 360000325728 },
        review_group_membership: { id: 360052222154 },
        editing_custom_topics: { id: 115005228687 },
        what_is_pro: { id: 9248706921879 },
        how_to_access_courses_with_workspaces: { id: 4407705124375 },
        certification_prep: { id: 0xc8fa210e397 },
      });
      class L {
        constructor(e) {
          this.udData = e;
        }
        get config() {
          var e, t;
          return (e =
            (t = this.udData) === null || t === void 0 ? void 0 : t.Config) !==
            null && e !== void 0
            ? e
            : Object(D["a"])();
        }
        get request() {
          var e, t;
          return (e =
            (t = this.udData) === null || t === void 0 ? void 0 : t.request) !==
            null && e !== void 0
            ? e
            : Object(A["a"])();
        }
        toImages(e) {
          return this.config.url.to_images + e;
        }
        toJs(e) {
          return `${this.config.url.to_js + e}?v=${this.config.version}`;
        }
        toStorageStaticAsset(e) {
          var t;
          let n =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {};
          const r = (t = n.Config) !== null && t !== void 0 ? t : this.config;
          return r.third_party.storage_static_asset_base_url + e;
        }
        toSupportContact(e, t) {
          return this.to("support", "requests/new", {
            ticket_form_id: e,
            type: t,
          });
        }
        toSupportHome() {
          return this.to("support");
        }
        toSupportSystemCheck() {
          return this.to("support", "system-check");
        }
        toSupportLink(e) {
          var t, n;
          let r =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : false;
          let s =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : "articles";
          let o =
            arguments.length > 3 && arguments[3] !== undefined
              ? arguments[3]
              : {};
          const i = (t = o.Config) !== null && t !== void 0 ? t : this.config;
          const a = (n = o.request) !== null && n !== void 0 ? n : this.request;
          const c = {
            en: "en-us",
            de: "de",
            es: "es",
            fr: "fr-fr",
            pt: "pt",
            ja: "ja",
            it: "it",
            pl: "pl",
            tr: "tr",
            ko: "ko",
          };
          const d =
            r &&
            i.brand.has_organization &&
            i.brand.organization.is_enterprise_china &&
            i.features.organization.is_ub_china_support_redirection_enabled;
          if (d) {
            return "/support/";
          }
          const u = r
            ? "https://business-support.udemy.com/hc/"
            : "https://support.udemy.com/hc/";
          const l = a.locale;
          let p = (l || "").replace("_", "-").toLowerCase();
          const m = c[p.substring(0, 2)];
          if (m) {
            p = m;
          } else {
            p = "en-us";
          }
          if (e === "default") {
            return `${u}${p}`;
          }
          const g = r ? R[e] : N[e];
          const f = (g && g.id) || "";
          return `${u}${p}/${s}/${f}`;
        }
        toMyCourses() {
          return this.to("home/my-courses");
        }
        toCourseDashboard(e) {
          return this.to("course-dashboard-redirect", undefined, {
            course_id: e,
          });
        }
        toCourseTaking(e, t, n) {
          return this.to(e, t ? `learn/${t}` : "learn", n);
        }
        toLearningPath(e) {
          return this.to("learning-paths", e);
        }
        toAuth(e) {
          var t;
          let {
            showLogin: n,
            showInstructorSignup: r,
            locale: s,
            nextUrl: o,
            nextPath: i,
            returnUrl: a,
            source: c,
            popupTrackingIdentifier: d,
            responseType: u,
            globalOverrides: l = {},
          } = e;
          const p = (t = l.request) !== null && t !== void 0 ? t : this.request;
          let m = "signup-popup";
          if (r) {
            m = "instructor-signup";
          } else if (n) {
            m = "login-popup";
          }
          const g = {
            locale: s || p.locale || "en_US",
            response_type: u || "json",
            return_link: a,
            source: c,
            ref: d,
          };
          if (typeof window !== "undefined") {
            g.next = o || (i ? this.to(i) : window.location.href);
          }
          return this.to("join", m, g);
        }
        makeAbsolute(e) {
          if (e.charAt(0) === "/") {
            e = e.slice(1);
          }
          return `${this.config.url.to_app}${e}`;
        }
        to(e, t, n) {
          e = e ? String(e) : "";
          if (e.charAt(e.length - 1) === "/") {
            e = e.slice(0, e.length - 1);
          }
          const r = e ? (t ? `${e}/${t}/` : `${e}/`) : "";
          const s = this.makeAbsolute(r);
          return !n || Object.keys(n).length == 0
            ? s
            : `${s}?${P.a.stringify(n)}`;
        }
        toInstructorCommunity() {
          return "https://community.udemy.com";
        }
        toHardLink(e) {
          const t = {
            promo_video_content:
              "/udemy-teach-hub/promo_video/?use-localization-prefix=1",
            cpe_course_evaluation:
              "https://docs.google.com/forms/d/e/1FAIpQLSdFxtjbOd5QArS1pov8_eSwLuYXEDVdw9uHwC6lFv_MnCKUsQ/viewform",
            nasba_registry: "https://www.nasbaregistry.org/",
          };
          return t[e] || "";
        }
        toUFBDataReports() {
          return this.to("organization-manage/reports");
        }
        toTapenUFBDataReports(e) {
          return this.to(`tapen/organization/${e}/data-export-reports`);
        }
        toUFBPathInsights() {
          return this.to("organization-manage/path-insights");
        }
        toCourseInsights(e) {
          return this.to(`organization-manage/insights/course/${e}`);
        }
        toUFBSettingsAPI() {
          return this.to("organization-manage/settings/api-integration");
        }
        toUFBSettingsAppearance() {
          return this.to("organization-manage/settings/appearance");
        }
        toUFBSettingsBilling() {
          return this.to("organization-manage/settings/billing");
        }
        toUFBSettingsSubscription() {
          return this.to("organization-manage/settings/subscription");
        }
        toUFBSettingsCustomErrors() {
          return this.to("organization-manage/settings/custom-error-message");
        }
        toUFBSettingsEmails() {
          return this.to("organization-manage/settings/approved-email-domains");
        }
        toUFBSettingsIntegrations() {
          return this.to("organization-manage/settings/integration");
        }
        toUFBSettingsLMSIntegrations() {
          return this.to("organization-manage/settings/lms-integration");
        }
        toUFBSettingsSCIM() {
          return this.to("organization-manage/settings/provisioning-scim");
        }
        toUFBSettingsSSO() {
          return this.to("organization-manage/settings/single-sign-on");
        }
        toUFBUserActivity() {
          return this.to("organization-manage/insights/user-activity");
        }
        toTapenUFBUserActivity(e) {
          return this.to(`tapen/organization/${e}/insights/user-activity`);
        }
        toUFBUserDetail(e) {
          return this.to(`organization-manage/users/detail/${e}/`);
        }
        toUFBManageUsers() {
          return this.to("organization-manage/users");
        }
        toUFBManageGroups() {
          return this.to("organization-manage/users/manage-groups");
        }
        toFreeCourseFAQLink(e) {
          switch (e) {
            case "zh":
              return "http://teach.udemy.com/free-changes-to-courses-zh-faq/";
            case "ru":
              return "http://teach.udemy.com/free-changes-to-courses-ru-faq/";
            default:
              return "/udemy-teach-hub/new_standard_free_courses/";
          }
        }
        toRefundRequestForm(e) {
          return this.to(`request-refund/${e}`);
        }
        toPurchaseHistoryDashboard() {
          return this.to("dashboard/purchase-history");
        }
        toCreditHistoryDashboard() {
          return this.to("dashboard/credit-history");
        }
      }
      function z(e) {
        return new L(e);
      }
      const U = new L();
      function F() {
        const e = l();
        return new L(e);
      }
      n.d(t, "b", function () {
        return h;
      });
      n.d(t, "a", function () {
        return p;
      });
      n.d(t, "h", function () {
        return l;
      });
      n.d(t, "d", function () {
        return u;
      });
      n.d(t, "j", function () {
        return y;
      });
      n.d(t, "f", function () {
        return O;
      });
      n.d(t, "g", function () {
        return T;
      });
      n.d(t, "c", function () {
        return z;
      });
      n.d(t, "e", function () {
        return U;
      });
      n.d(t, "i", function () {
        return F;
      });
    },
    "./src/udemy/js lazy recursive ^\\.\\/.*\\/udlite\\-app$": function (
      e,
      t,
      n
    ) {
      var r = {
        "./activity-notifications/udlite-app": [
          "./src/udemy/js/activity-notifications/udlite-app.js",
          "common-app-css",
          "activity-notifications-server-side",
          "activity-notifications-udlite-app",
        ],
        "./assessment-not-available/udlite-app": [
          "./src/udemy/js/assessment-not-available/udlite-app.js",
          "assessment-not-available-udlite-app",
        ],
        "./assessments/udlite-app": [
          "./src/udemy/js/assessments/udlite-app.js",
          "common-app-css",
          "assessments-server-side",
          "vendors~assessments-udlite-app",
          "assessments-udlite-app",
        ],
        "./auth/turnstile/udlite-app": [
          "./src/udemy/js/auth/turnstile/udlite-app.tsx",
          "auth-turnstile-udlite-app",
        ],
        "./auth/two-factor/udlite-app": [
          "./src/udemy/js/auth/two-factor/udlite-app.js",
          "auth-two-factor-server-side",
          "auth-two-factor-udlite-app",
        ],
        "./auth/udlite-app": [
          "./src/udemy/js/auth/udlite-app.js",
          "auth-server-side",
          "auth-udlite-app",
        ],
        "./browse/udlite-app": [
          "./src/udemy/js/browse/udlite-app.js",
          "common-app-css",
          "vendors~browse-udlite-app",
          "browse-udlite-app",
        ],
        "./cart/pages/cart-success-modal/udlite-app": [
          "./src/udemy/js/cart/pages/cart-success-modal/udlite-app.js",
          "common-app-css",
          "cart-pages-cart-success-modal-udlite-app",
        ],
        "./cart/pages/cart/udlite-app": [
          "./src/udemy/js/cart/pages/cart/udlite-app.tsx",
          "common-app-css",
          "cart-pages-cart-server-side",
          "vendors~cart-pages-cart-udlite-app~cart-pages-success-udlite-app~course-landing-page-free-udlite-app~1d260478",
          "cart-pages-cart-udlite-app",
        ],
        "./cart/pages/success/udlite-app": [
          "./src/udemy/js/cart/pages/success/udlite-app.js",
          "common-app-css",
          "cart-pages-success-server-side",
          "vendors~cart-pages-cart-udlite-app~cart-pages-success-udlite-app~course-landing-page-free-udlite-app~1d260478",
          "vendors~cart-pages-success-udlite-app",
          "cart-pages-success-udlite-app",
        ],
        "./category/free/udlite-app": [
          "./src/udemy/js/category/free/udlite-app.tsx",
          "common-app-css",
          "category-free-server-side",
          "category-free-udlite-app",
        ],
        "./category/udlite-app": [
          "./src/udemy/js/category/udlite-app.tsx",
          "common-app-css",
          "discovery-common",
          "category-server-side",
          "category-udlite-app",
        ],
        "./checkout/apps/payment-method-management/udlite-app": [
          "./src/udemy/js/checkout/apps/payment-method-management/udlite-app.ts",
          "common-app-css",
          "checkout-apps-payment-method-management-udlite-app",
        ],
        "./checkout/marketplace/udlite-app": [
          "./src/udemy/js/checkout/marketplace/udlite-app.tsx",
          "common-app-css",
          "checkout-marketplace-server-side",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~a7130aa6",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~35ce62be",
          "checkout-marketplace-udlite-app",
        ],
        "./checkout/teamplan/checkout/udlite-app": [
          "./src/udemy/js/checkout/teamplan/checkout/udlite-app.tsx",
          "common-app-css",
          "checkout-teamplan-checkout-server-side",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~a7130aa6",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~35ce62be",
          "checkout-teamplan-checkout-udlite-app",
        ],
        "./checkout/teamplan/resubscribe/udlite-app": [
          "./src/udemy/js/checkout/teamplan/resubscribe/udlite-app.tsx",
          "common-app-css",
          "checkout-teamplan-resubscribe-server-side",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~a7130aa6",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~35ce62be",
          "checkout-teamplan-resubscribe-udlite-app",
        ],
        "./checkout/teamplan/upsell/udlite-app": [
          "./src/udemy/js/checkout/teamplan/upsell/udlite-app.tsx",
          "common-app-css",
          "checkout-teamplan-upsell-server-side",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~a7130aa6",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~35ce62be",
          "checkout-teamplan-upsell-udlite-app",
        ],
        "./collections/udlite-app": [
          "./src/udemy/js/collections/udlite-app.tsx",
          "common-app-css",
          "collections-server-side",
          "vendors~collections-udlite-app",
          "collections-udlite-app",
        ],
        "./common/desktop/udlite-app": [
          "./src/udemy/js/common/desktop/udlite-app.js",
          "common-app-css",
          "common-desktop-server-side",
          "vendors~common-desktop-udlite-app~common-mobile-udlite-app~common-ufb-desktop-udlite-app~common-ufb-~d3dbf287",
          "common-desktop-udlite-app",
        ],
        "./common/mobile/udlite-app": [
          "./src/udemy/js/common/mobile/udlite-app.js",
          "common-app-css",
          "vendors~common-desktop-udlite-app~common-mobile-udlite-app~common-ufb-desktop-udlite-app~common-ufb-~d3dbf287",
          "common-mobile-udlite-app",
        ],
        "./common/ufb-desktop/udlite-app": [
          "./src/udemy/js/common/ufb-desktop/udlite-app.js",
          "common-app-css",
          "common-ufb-desktop-server-side",
          "vendors~common-desktop-udlite-app~common-mobile-udlite-app~common-ufb-desktop-udlite-app~common-ufb-~d3dbf287",
          "common-ufb-desktop-udlite-app",
        ],
        "./common/ufb-mobile/udlite-app": [
          "./src/udemy/js/common/ufb-mobile/udlite-app.js",
          "common-app-css",
          "common-ufb-mobile-server-side",
          "vendors~common-desktop-udlite-app~common-mobile-udlite-app~common-ufb-desktop-udlite-app~common-ufb-~d3dbf287",
          "common-ufb-mobile-udlite-app",
        ],
        "./course-auto-enroll/udlite-app": [
          "./src/udemy/js/course-auto-enroll/udlite-app.ts",
          "course-auto-enroll-udlite-app",
        ],
        "./course-certificate/udlite-app": [
          "./src/udemy/js/course-certificate/udlite-app.ts",
          "common-app-css",
          "course-certificate-server-side",
          "course-certificate-udlite-app",
        ],
        "./course-landing-page-free/udlite-app": [
          "./src/udemy/js/course-landing-page-free/udlite-app.tsx",
          "common-app-css",
          "course-landing-page-free-server-side",
          "vendors~cart-pages-cart-udlite-app~cart-pages-success-udlite-app~course-landing-page-free-udlite-app~1d260478",
          "course-landing-page-free-udlite-app",
        ],
        "./course-landing-page-private/udlite-app": [
          "./src/udemy/js/course-landing-page-private/udlite-app.js",
          "course-landing-page-private-server-side",
          "course-landing-page-private-udlite-app",
        ],
        "./course-landing-page/udlite-app": [
          "./src/udemy/js/course-landing-page/udlite-app.tsx",
          "common-app-css",
          "course-landing-page-server-side",
          "vendors~cart-pages-cart-udlite-app~cart-pages-success-udlite-app~course-landing-page-free-udlite-app~1d260478",
          "course-landing-page-udlite-app",
        ],
        "./course-manage-announcements/udlite-app": [
          "./src/udemy/js/course-manage-announcements/udlite-app.js",
          "common-app-css",
          "course-manage-announcements-server-side",
          "course-manage-announcements-udlite-app",
        ],
        "./course-manage-coding-exercise/udlite-app": [
          "./src/udemy/js/course-manage-coding-exercise/udlite-app.js",
          "common-app-css",
          "course-manage-coding-exercise-server-side",
          "vendors~course-manage-coding-exercise-udlite-app~lab-manage-udlite-app",
          "vendors~course-manage-coding-exercise-udlite-app~course-manage-practice-test-udlite-app",
          "course-manage-coding-exercise-udlite-app",
        ],
        "./course-manage-create/udlite-app": [
          "./src/udemy/js/course-manage-create/udlite-app.js",
          "common-app-css",
          "course-manage-create-udlite-app",
        ],
        "./course-manage-practice-test/udlite-app": [
          "./src/udemy/js/course-manage-practice-test/udlite-app.tsx",
          "common-app-css",
          "course-manage-practice-test-server-side",
          "vendors~course-manage-coding-exercise-udlite-app~course-manage-practice-test-udlite-app",
          "course-manage-practice-test-udlite-app",
        ],
        "./course-manage-practice/udlite-app": [
          "./src/udemy/js/course-manage-practice/udlite-app.js",
          "common-app-css",
          "vendor-videojs",
          "course-manage-practice-server-side",
          "vendors~course-manage-practice-udlite-app~course-manage-v2-udlite-app~course-preview-udlite-app~lect~cdb3bda7",
          "course-manage-practice-udlite-app",
        ],
        "./course-manage-v2/udlite-app": [
          "./src/udemy/js/course-manage-v2/udlite-app.js",
          "common-app-css",
          "vendor-videojs",
          "course-manage-v2-server-side",
          "vendors~course-manage-practice-udlite-app~course-manage-v2-udlite-app~course-preview-udlite-app~lect~cdb3bda7",
          "course-manage-v2-udlite-app",
        ],
        "./course-preview/udlite-app": [
          "./src/udemy/js/course-preview/udlite-app.tsx",
          "common-app-css",
          "vendor-videojs",
          "course-preview-server-side",
          "vendors~course-manage-practice-udlite-app~course-manage-v2-udlite-app~course-preview-udlite-app~lect~cdb3bda7",
          "course-preview-udlite-app",
        ],
        "./course-taking/udlite-app": [
          "./src/udemy/js/course-taking/udlite-app.js",
          "common-app-css",
          "vendor-videojs",
          "vendor-highcharts",
          "course-taking-server-side",
          "course-taking-udlite-app",
        ],
        "./credit-history/udlite-app": [
          "./src/udemy/js/credit-history/udlite-app.tsx",
          "common-app-css",
          "credit-history-udlite-app",
        ],
        "./documentation/udlite-app": [
          "./src/udemy/js/documentation/udlite-app.js",
          "documentation-server-side",
          "vendors~documentation-udlite-app",
          "documentation-udlite-app",
        ],
        "./examples/react-codelab/udlite-app": [
          "./src/udemy/js/examples/react-codelab/udlite-app.js",
          "examples-react-codelab-server-side",
          "examples-react-codelab-udlite-app",
        ],
        "./examples/react-with-typescript/udlite-app": [
          "./src/udemy/js/examples/react-with-typescript/udlite-app.tsx",
          "examples-react-with-typescript-udlite-app",
        ],
        "./examples/udlite-app": [
          "./src/udemy/js/examples/udlite-app.js",
          "examples-server-side",
          "examples-udlite-app",
        ],
        "./experimental-no-adaptive-assessment/udlite-app": [
          "./src/udemy/js/experimental-no-adaptive-assessment/udlite-app.js",
          "common-app-css",
          "vendor-highcharts",
          "experimental-no-adaptive-assessment-server-side",
          "vendors~experimental-no-adaptive-assessment-udlite-app",
          "experimental-no-adaptive-assessment-udlite-app",
        ],
        "./file-upload/udlite-app": [
          "./src/udemy/js/file-upload/udlite-app.js",
          "file-upload-udlite-app",
        ],
        "./forgot-password/udlite-app": [
          "./src/udemy/js/forgot-password/udlite-app.js",
          "forgot-password-udlite-app",
        ],
        "./form-fields/udlite-app": [
          "./src/udemy/js/form-fields/udlite-app.js",
          "form-fields-udlite-app",
        ],
        "./get-mobile-app/udlite-app": [
          "./src/udemy/js/get-mobile-app/udlite-app.js",
          "get-mobile-app-udlite-app",
        ],
        "./gift/udlite-app": [
          "./src/udemy/js/gift/udlite-app.js",
          "common-app-css",
          "gift-udlite-app",
        ],
        "./home/udlite-app": [
          "./src/udemy/js/home/udlite-app.tsx",
          "common-app-css",
          "home-server-side",
          "vendors~home-udlite-app",
          "home-udlite-app",
        ],
        "./instructor-onboarding/udlite-app": [
          "./src/udemy/js/instructor-onboarding/udlite-app.js",
          "common-app-css",
          "instructor-onboarding-udlite-app",
        ],
        "./instructor-verification/udlite-app": [
          "./src/udemy/js/instructor-verification/udlite-app.js",
          "instructor-verification-udlite-app",
        ],
        "./instructor/header/udlite-app": [
          "./src/udemy/js/instructor/header/udlite-app.js",
          "common-app-css",
          "vendors~common-desktop-udlite-app~common-mobile-udlite-app~common-ufb-desktop-udlite-app~common-ufb-~d3dbf287",
          "instructor-header-udlite-app",
        ],
        "./instructor/multiple-coupons-creation/udlite-app": [
          "./src/udemy/js/instructor/multiple-coupons-creation/udlite-app.js",
          "instructor-multiple-coupons-creation-server-side",
          "instructor-multiple-coupons-creation-udlite-app",
        ],
        "./instructor/qrp-reactivate/udlite-app": [
          "./src/udemy/js/instructor/qrp-reactivate/udlite-app.ts",
          "instructor-qrp-reactivate-udlite-app",
        ],
        "./instructor/side-nav/udlite-app": [
          "./src/udemy/js/instructor/side-nav/udlite-app.js",
          "common-app-css",
          "instructor-side-nav-udlite-app",
        ],
        "./instructor/udlite-app": [
          "./src/udemy/js/instructor/udlite-app.js",
          "common-app-css",
          "vendor-highcharts",
          "instructor-server-side",
          "vendors~instructor-udlite-app~lab-manage-udlite-app",
          "instructor-udlite-app",
        ],
        "./intercom/udlite-app": [
          "./src/udemy/js/intercom/udlite-app.js",
          "intercom-udlite-app",
        ],
        "./invite/udlite-app": [
          "./src/udemy/js/invite/udlite-app.tsx",
          "common-app-css",
          "invite-server-side",
          "invite-udlite-app",
        ],
        "./lab-manage/udlite-app": [
          "./src/udemy/js/lab-manage/udlite-app.ts",
          "common-app-css",
          "lab-manage-server-side",
          "vendors~course-manage-coding-exercise-udlite-app~lab-manage-udlite-app",
          "vendors~instructor-udlite-app~lab-manage-udlite-app",
          "lab-manage-udlite-app",
        ],
        "./lab-taking/udlite-app": [
          "./src/udemy/js/lab-taking/udlite-app.js",
          "common-app-css",
          "lab-taking-server-side",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~a7130aa6",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~35ce62be",
          "lab-taking-udlite-app",
        ],
        "./lab-workspace/udlite-app": [
          "./src/udemy/js/lab-workspace/udlite-app.js",
          "common-app-css",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~a7130aa6",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~35ce62be",
          "vendors~lab-workspace-udlite-app",
          "lab-workspace-udlite-app",
        ],
        "./labs-landing/udlite-app": [
          "./src/udemy/js/labs-landing/udlite-app.js",
          "common-app-css",
          "vendors~labs-landing-udlite-app~search-udlite-app",
          "labs-landing-udlite-app",
        ],
        "./labs-loading/udlite-app": [
          "./src/udemy/js/labs-loading/udlite-app.tsx",
          "common-app-css",
          "labs-loading-server-side",
          "labs-loading-udlite-app",
        ],
        "./learning-community-create/udlite-app": [
          "./src/udemy/js/learning-community-create/udlite-app.tsx",
          "common-app-css",
          "learning-community-create-server-side",
          "vendors~learning-community-create-udlite-app",
          "learning-community-create-udlite-app",
        ],
        "./learning-community/udlite-app": [
          "./src/udemy/js/learning-community/udlite-app.tsx",
          "common-app-css",
          "learning-community-server-side",
          "vendors~learning-community-udlite-app",
          "learning-community-udlite-app",
        ],
        "./learning-path/udlite-app": [
          "./src/udemy/js/learning-path/udlite-app.js",
          "common-app-css",
          "learning-path-server-side",
          "vendors~learning-path-udlite-app~organization-admin-landing-experience-udlite-app~organization-insig~8bc55684",
          "vendors~learning-path-udlite-app",
          "learning-path-udlite-app",
        ],
        "./lecture-landing-page/desktop/udlite-app": [
          "./src/udemy/js/lecture-landing-page/desktop/udlite-app.tsx",
          "common-app-css",
          "vendor-videojs",
          "lecture-landing-page-desktop-server-side",
          "vendors~course-manage-practice-udlite-app~course-manage-v2-udlite-app~course-preview-udlite-app~lect~cdb3bda7",
          "lecture-landing-page-desktop-udlite-app",
        ],
        "./lecture-landing-page/mobile/udlite-app": [
          "./src/udemy/js/lecture-landing-page/mobile/udlite-app.tsx",
          "common-app-css",
          "lecture-landing-page-mobile-server-side",
          "lecture-landing-page-mobile-udlite-app",
        ],
        "./lecture-preview/udlite-app": [
          "./src/udemy/js/lecture-preview/udlite-app.tsx",
          "common-app-css",
          "vendor-videojs",
          "lecture-preview-server-side",
          "vendors~course-manage-practice-udlite-app~course-manage-v2-udlite-app~course-preview-udlite-app~lect~cdb3bda7",
          "lecture-preview-udlite-app",
        ],
        "./lihp/udlite-app": [
          "./src/udemy/js/lihp/udlite-app.ts",
          "common-app-css",
          "discovery-common",
          "lihp-server-side",
          "lihp-udlite-app",
        ],
        "./lohp/udlite-app": [
          "./src/udemy/js/lohp/udlite-app.ts",
          "common-app-css",
          "discovery-common",
          "lohp-server-side",
          "lohp-udlite-app",
        ],
        "./messaging/udlite-app": [
          "./src/udemy/js/messaging/udlite-app.js",
          "common-app-css",
          "messaging-server-side",
          "messaging-udlite-app",
        ],
        "./mobile-app-download/udlite-app": [
          "./src/udemy/js/mobile-app-download/udlite-app.js",
          "mobile-app-download-server-side",
          "mobile-app-download-udlite-app",
        ],
        "./mobile-app-variables/udlite-app": [
          "./src/udemy/js/mobile-app-variables/udlite-app.js",
          "mobile-app-variables-server-side",
          "mobile-app-variables-udlite-app",
        ],
        "./my-courses-v3/udlite-app": [
          "./src/udemy/js/my-courses-v3/udlite-app.js",
          "common-app-css",
          "my-courses-v3-server-side",
          "vendors~common-desktop-udlite-app~common-mobile-udlite-app~common-ufb-desktop-udlite-app~common-ufb-~d3dbf287",
          "vendors~my-courses-v3-udlite-app~open-badges-udlite-app~organization-home-udlite-app",
          "my-courses-v3-udlite-app",
        ],
        "./occupation/pages/career-guide-page/udlite-app": [
          "./src/udemy/js/occupation/pages/career-guide-page/udlite-app.ts",
          "common-app-css",
          "occupation-pages-career-guide-page-server-side",
          "occupation-pages-career-guide-page-udlite-app",
        ],
        "./occupation/pages/occupation-explorer/udlite-app": [
          "./src/udemy/js/occupation/pages/occupation-explorer/udlite-app.ts",
          "common-app-css",
          "occupation-pages-occupation-explorer-server-side",
          "occupation-pages-occupation-explorer-udlite-app",
        ],
        "./occupation/pages/occupation-result/udlite-app": [
          "./src/udemy/js/occupation/pages/occupation-result/udlite-app.ts",
          "common-app-css",
          "occupation-pages-occupation-result-server-side",
          "vendors~occupation-pages-occupation-result-udlite-app",
          "occupation-pages-occupation-result-udlite-app",
        ],
        "./open-badges/udlite-app": [
          "./src/udemy/js/open-badges/udlite-app.tsx",
          "common-app-css",
          "open-badges-server-side",
          "vendors~my-courses-v3-udlite-app~open-badges-udlite-app~organization-home-udlite-app",
          "vendors~open-badges-udlite-app",
          "open-badges-udlite-app",
        ],
        "./organization-admin-landing-experience/udlite-app": [
          "./src/udemy/js/organization-admin-landing-experience/udlite-app.ts",
          "common-app-css",
          "vendors~learning-path-udlite-app~organization-admin-landing-experience-udlite-app~organization-insig~8bc55684",
          "organization-admin-landing-experience-udlite-app",
        ],
        "./organization-common/team-plan-payment-redirect/udlite-app": [
          "./src/udemy/js/organization-common/team-plan-payment-redirect/udlite-app.tsx",
          "organization-common-team-plan-payment-redirect-udlite-app",
        ],
        "./organization-common/team-plan-renewal-notice/udlite-app": [
          "./src/udemy/js/organization-common/team-plan-renewal-notice/udlite-app.tsx",
          "organization-common-team-plan-renewal-notice-server-side",
          "organization-common-team-plan-renewal-notice-udlite-app",
        ],
        "./organization-course-not-available/udlite-app": [
          "./src/udemy/js/organization-course-not-available/udlite-app.tsx",
          "common-app-css",
          "organization-course-not-available-server-side",
          "vendors~organization-course-not-available-udlite-app",
          "organization-course-not-available-udlite-app",
        ],
        "./organization-global-login/udlite-app": [
          "./src/udemy/js/organization-global-login/udlite-app.js",
          "organization-global-login-server-side",
          "organization-global-login-udlite-app",
        ],
        "./organization-growth/request-demo-success/udlite-app": [
          "./src/udemy/js/organization-growth/request-demo-success/udlite-app.tsx",
          "common-app-css",
          "organization-growth-request-demo-success-udlite-app",
        ],
        "./organization-growth/request-demo/udlite-app": [
          "./src/udemy/js/organization-growth/request-demo/udlite-app.ts",
          "common-app-css",
          "organization-growth-request-demo-udlite-app",
        ],
        "./organization-growth/team-plan-sign-up/udlite-app": [
          "./src/udemy/js/organization-growth/team-plan-sign-up/udlite-app.ts",
          "common-app-css",
          "organization-growth-team-plan-sign-up-udlite-app",
        ],
        "./organization-home/udlite-app": [
          "./src/udemy/js/organization-home/udlite-app.js",
          "common-app-css",
          "organization-home-server-side",
          "vendors~my-courses-v3-udlite-app~open-badges-udlite-app~organization-home-udlite-app",
          "vendors~organization-home-udlite-app~personal-plan-home-udlite-app",
          "organization-home-udlite-app",
        ],
        "./organization-insights/export-reports/udlite-app": [
          "./src/udemy/js/organization-insights/export-reports/udlite-app.tsx",
          "common-app-css",
          "organization-insights-export-reports-udlite-app",
        ],
        "./organization-insights/udlite-app": [
          "./src/udemy/js/organization-insights/udlite-app.js",
          "common-app-css",
          "vendor-highcharts",
          "vendors~learning-path-udlite-app~organization-admin-landing-experience-udlite-app~organization-insig~8bc55684",
          "vendors~organization-insights-udlite-app~tapen-organization-insights-admin-insights-udlite-app",
          "organization-insights-udlite-app",
        ],
        "./organization-invitation-verification/udlite-app": [
          "./src/udemy/js/organization-invitation-verification/udlite-app.js",
          "organization-invitation-verification-server-side",
          "organization-invitation-verification-udlite-app",
        ],
        "./organization-login/udlite-app": [
          "./src/udemy/js/organization-login/udlite-app.js",
          "organization-login-server-side",
          "organization-login-udlite-app",
        ],
        "./organization-manage-assigned/udlite-app": [
          "./src/udemy/js/organization-manage-assigned/udlite-app.js",
          "common-app-css",
          "vendors~learning-path-udlite-app~organization-admin-landing-experience-udlite-app~organization-insig~8bc55684",
          "organization-manage-assigned-udlite-app",
        ],
        "./organization-manage-courses/udlite-app": [
          "./src/udemy/js/organization-manage-courses/udlite-app.js",
          "common-app-css",
          "vendors~learning-path-udlite-app~organization-admin-landing-experience-udlite-app~organization-insig~8bc55684",
          "organization-manage-courses-udlite-app",
        ],
        "./organization-manage-settings/api-integration/udlite-app": [
          "./src/udemy/js/organization-manage-settings/api-integration/udlite-app.js",
          "common-app-css",
          "organization-manage-settings-api-integration-udlite-app",
        ],
        "./organization-manage-settings/approved-email-domains/udlite-app": [
          "./src/udemy/js/organization-manage-settings/approved-email-domains/udlite-app.js",
          "common-app-css",
          "organization-manage-settings-approved-email-domains-udlite-app",
        ],
        "./organization-manage-settings/custom-error-message/udlite-app": [
          "./src/udemy/js/organization-manage-settings/custom-error-message/udlite-app.js",
          "common-app-css",
          "organization-manage-settings-custom-error-message-server-side",
          "organization-manage-settings-custom-error-message-udlite-app",
        ],
        "./organization-manage-settings/customize-appearance/udlite-app": [
          "./src/udemy/js/organization-manage-settings/customize-appearance/udlite-app.js",
          "common-app-css",
          "organization-manage-settings-customize-appearance-server-side",
          "organization-manage-settings-customize-appearance-udlite-app",
        ],
        "./organization-manage-settings/integrations/udlite-app": [
          "./src/udemy/js/organization-manage-settings/integrations/udlite-app.js",
          "common-app-css",
          "organization-manage-settings-integrations-udlite-app",
        ],
        "./organization-manage-settings/lms-integration/udlite-app": [
          "./src/udemy/js/organization-manage-settings/lms-integration/udlite-app.js",
          "common-app-css",
          "organization-manage-settings-lms-integration-server-side",
          "organization-manage-settings-lms-integration-udlite-app",
        ],
        "./organization-manage-settings/provisioning-scim/udlite-app": [
          "./src/udemy/js/organization-manage-settings/provisioning-scim/udlite-app.js",
          "common-app-css",
          "organization-manage-settings-provisioning-scim-udlite-app",
        ],
        "./organization-manage-settings/single-sign-on-self-serve/udlite-app": [
          "./src/udemy/js/organization-manage-settings/single-sign-on-self-serve/udlite-app.js",
          "common-app-css",
          "organization-manage-settings-single-sign-on-self-serve-udlite-app",
        ],
        "./organization-manage-settings/sso-cert-utility/udlite-app": [
          "./src/udemy/js/organization-manage-settings/sso-cert-utility/udlite-app.js",
          "organization-manage-settings-sso-cert-utility-server-side",
          "organization-manage-settings-sso-cert-utility-udlite-app",
        ],
        "./organization-manage-users/udlite-app": [
          "./src/udemy/js/organization-manage-users/udlite-app.js",
          "common-app-css",
          "vendors~learning-path-udlite-app~organization-admin-landing-experience-udlite-app~organization-insig~8bc55684",
          "organization-manage-users-udlite-app",
        ],
        "./organization-merge/consent/udlite-app": [
          "./src/udemy/js/organization-merge/consent/udlite-app.tsx",
          "common-app-css",
          "organization-merge-consent-udlite-app",
        ],
        "./organization-merge/frozen/udlite-app": [
          "./src/udemy/js/organization-merge/frozen/udlite-app.tsx",
          "organization-merge-frozen-server-side",
          "organization-merge-frozen-udlite-app",
        ],
        "./organization-onboarding-pro/udlite-app": [
          "./src/udemy/js/organization-onboarding-pro/udlite-app.tsx",
          "organization-onboarding-pro-server-side",
          "organization-onboarding-pro-udlite-app",
        ],
        "./organization-onboarding/udlite-app": [
          "./src/udemy/js/organization-onboarding/udlite-app.js",
          "common-app-css",
          "organization-onboarding-udlite-app",
        ],
        "./organization-resources/udlite-app": [
          "./src/udemy/js/organization-resources/udlite-app.js",
          "common-app-css",
          "organization-resources-server-side",
          "organization-resources-udlite-app",
        ],
        "./organization-team-plan-billing/udlite-app": [
          "./src/udemy/js/organization-team-plan-billing/udlite-app.js",
          "common-app-css",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~a7130aa6",
          "vendors~checkout-marketplace-udlite-app~checkout-teamplan-checkout-udlite-app~checkout-teamplan-resu~35ce62be",
          "vendors~organization-team-plan-billing-udlite-app~subscription-checkout-udlite-app~subscription-mana~c281bff0",
          "organization-team-plan-billing-udlite-app",
        ],
        "./partnership/udlite-app": [
          "./src/udemy/js/partnership/udlite-app.js",
          "partnership-server-side",
          "vendors~partnership-udlite-app",
          "partnership-udlite-app",
        ],
        "./personal-plan-home/udlite-app": [
          "./src/udemy/js/personal-plan-home/udlite-app.ts",
          "common-app-css",
          "personal-plan-home-server-side",
          "vendors~organization-home-udlite-app~personal-plan-home-udlite-app",
          "personal-plan-home-udlite-app",
        ],
        "./personalize/udlite-app": [
          "./src/udemy/js/personalize/udlite-app.tsx",
          "common-app-css",
          "personalize-server-side",
          "vendors~personalize-udlite-app",
          "personalize-udlite-app",
        ],
        "./prepaid-code/udlite-app": [
          "./src/udemy/js/prepaid-code/udlite-app.js",
          "prepaid-code-udlite-app",
        ],
        "./purchase-history/udlite-app": [
          "./src/udemy/js/purchase-history/udlite-app.tsx",
          "common-app-css",
          "purchase-history-server-side",
          "purchase-history-udlite-app",
        ],
        "./report-abuse/udlite-app": [
          "./src/udemy/js/report-abuse/udlite-app.js",
          "common-app-css",
          "report-abuse-server-side",
          "report-abuse-udlite-app",
        ],
        "./revenue-report/udlite-app": [
          "./src/udemy/js/revenue-report/udlite-app.js",
          "common-app-css",
          "vendor-highcharts",
          "revenue-report-server-side",
          "revenue-report-udlite-app",
        ],
        "./search/udlite-app": [
          "./src/udemy/js/search/udlite-app.tsx",
          "common-app-css",
          "search-server-side",
          "vendors~labs-landing-udlite-app~search-udlite-app",
          "search-udlite-app",
        ],
        "./sequence-landing-page/udlite-app": [
          "./src/udemy/js/sequence-landing-page/udlite-app.ts",
          "common-app-css",
          "sequence-landing-page-server-side",
          "sequence-landing-page-udlite-app",
        ],
        "./shaka-video-player-tester/udlite-app": [
          "./src/udemy/js/shaka-video-player-tester/udlite-app.tsx",
          "common-app-css",
          "vendor-videojs",
          "shaka-video-player-tester-server-side",
          "vendors~course-manage-practice-udlite-app~course-manage-v2-udlite-app~course-preview-udlite-app~lect~cdb3bda7",
          "shaka-video-player-tester-udlite-app",
        ],
        "./student-refund/udlite-app": [
          "./src/udemy/js/student-refund/udlite-app.js",
          "common-app-css",
          "student-refund-server-side",
          "student-refund-udlite-app",
        ],
        "./subscription-browse/pages/landing-page/udlite-app": [
          "./src/udemy/js/subscription-browse/pages/landing-page/udlite-app.js",
          "common-app-css",
          "subscription-browse-pages-landing-page-server-side",
          "vendors~subscription-browse-pages-landing-page-udlite-app",
          "subscription-browse-pages-landing-page-udlite-app",
        ],
        "./subscription-browse/pages/subscription-logged-in-home/udlite-app": [
          "./src/udemy/js/subscription-browse/pages/subscription-logged-in-home/udlite-app.js",
          "common-app-css",
          "subscription-browse-pages-subscription-logged-in-home-server-side",
          "vendors~common-desktop-udlite-app~common-mobile-udlite-app~common-ufb-desktop-udlite-app~common-ufb-~d3dbf287",
          "subscription-browse-pages-subscription-logged-in-home-udlite-app",
        ],
        "./subscription-checkout/header/udlite-app": [
          "./src/udemy/js/subscription-checkout/header/udlite-app.js",
          "common-app-css",
          "subscription-checkout-header-server-side",
          "subscription-checkout-header-udlite-app",
        ],
        "./subscription-checkout/pages/checkout-success/udlite-app": [
          "./src/udemy/js/subscription-checkout/pages/checkout-success/udlite-app.js",
          "subscription-checkout-pages-checkout-success-server-side",
          "subscription-checkout-pages-checkout-success-udlite-app",
        ],
        "./subscription-checkout/udlite-app": [
          "./src/udemy/js/subscription-checkout/udlite-app.js",
          "common-app-css",
          "subscription-checkout-server-side",
          "vendors~organization-team-plan-billing-udlite-app~subscription-checkout-udlite-app~subscription-mana~c281bff0",
          "subscription-checkout-udlite-app",
        ],
        "./subscription-management/settings/udlite-app": [
          "./src/udemy/js/subscription-management/settings/udlite-app.js",
          "common-app-css",
          "vendors~organization-team-plan-billing-udlite-app~subscription-checkout-udlite-app~subscription-mana~c281bff0",
          "subscription-management-settings-udlite-app",
        ],
        "./support-system-check/udlite-app": [
          "./src/udemy/js/support-system-check/udlite-app.js",
          "common-app-css",
          "vendor-videojs",
          "support-system-check-server-side",
          "vendors~course-manage-practice-udlite-app~course-manage-v2-udlite-app~course-preview-udlite-app~lect~cdb3bda7",
          "support-system-check-udlite-app",
        ],
        "./tapen/autocomplete-admin/udlite-app": [
          "./src/udemy/js/tapen/autocomplete-admin/udlite-app.js",
          "tapen-autocomplete-admin-udlite-app",
        ],
        "./tapen/change-payment-transaction-admin/udlite-app": [
          "./src/udemy/js/tapen/change-payment-transaction-admin/udlite-app.tsx",
          "tapen-change-payment-transaction-admin-server-side",
          "tapen-change-payment-transaction-admin-udlite-app",
        ],
        "./tapen/course-labels-qrp-admin/udlite-app": [
          "./src/udemy/js/tapen/course-labels-qrp-admin/udlite-app.js",
          "tapen-course-labels-qrp-admin-server-side",
          "tapen-course-labels-qrp-admin-udlite-app",
        ],
        "./tapen/discovery-cache-admin/udlite-app": [
          "./src/udemy/js/tapen/discovery-cache-admin/udlite-app.js",
          "tapen-discovery-cache-admin-udlite-app",
        ],
        "./tapen/discovery-context-admin/udlite-app": [
          "./src/udemy/js/tapen/discovery-context-admin/udlite-app.js",
          "tapen-discovery-context-admin-udlite-app",
        ],
        "./tapen/discovery-unit-form-admin/udlite-app": [
          "./src/udemy/js/tapen/discovery-unit-form-admin/udlite-app.js",
          "tapen-discovery-unit-form-admin-udlite-app",
        ],
        "./tapen/es-tooling-admin/udlite-app": [
          "./src/udemy/js/tapen/es-tooling-admin/udlite-app.js",
          "tapen-es-tooling-admin-udlite-app",
        ],
        "./tapen/experiment-form-admin/udlite-app": [
          "./src/udemy/js/tapen/experiment-form-admin/udlite-app.js",
          "tapen-experiment-form-admin-udlite-app",
        ],
        "./tapen/experimentation-platform-admin/abn-experiment-management/udlite-app":
          [
            "./src/udemy/js/tapen/experimentation-platform-admin/abn-experiment-management/udlite-app.tsx",
            "common-app-css",
            "tapen-experimentation-platform-admin-abn-experiment-management-server-side",
            "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~b00a977f",
            "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~e24a23cd",
            "tapen-experimentation-platform-admin-abn-experiment-management-udlite-app",
          ],
        "./tapen/experimentation-platform-admin/business-domain/udlite-app": [
          "./src/udemy/js/tapen/experimentation-platform-admin/business-domain/udlite-app.tsx",
          "common-app-css",
          "tapen-experimentation-platform-admin-business-domain-server-side",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~b00a977f",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~e24a23cd",
          "tapen-experimentation-platform-admin-business-domain-udlite-app",
        ],
        "./tapen/experimentation-platform-admin/configuration-context/udlite-app":
          [
            "./src/udemy/js/tapen/experimentation-platform-admin/configuration-context/udlite-app.tsx",
            "common-app-css",
            "tapen-experimentation-platform-admin-configuration-context-server-side",
            "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~b00a977f",
            "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~e24a23cd",
            "tapen-experimentation-platform-admin-configuration-context-udlite-app",
          ],
        "./tapen/experimentation-platform-admin/configuration-domain/udlite-app":
          [
            "./src/udemy/js/tapen/experimentation-platform-admin/configuration-domain/udlite-app.tsx",
            "common-app-css",
            "tapen-experimentation-platform-admin-configuration-domain-server-side",
            "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~b00a977f",
            "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~e24a23cd",
            "tapen-experimentation-platform-admin-configuration-domain-udlite-app",
          ],
        "./tapen/experimentation-platform-admin/experiment-group/udlite-app": [
          "./src/udemy/js/tapen/experimentation-platform-admin/experiment-group/udlite-app.tsx",
          "common-app-css",
          "tapen-experimentation-platform-admin-experiment-group-server-side",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~b00a977f",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~e24a23cd",
          "tapen-experimentation-platform-admin-experiment-group-udlite-app",
        ],
        "./tapen/experimentation-platform-admin/experiment-management/udlite-app":
          [
            "./src/udemy/js/tapen/experimentation-platform-admin/experiment-management/udlite-app.js",
            "common-app-css",
            "tapen-experimentation-platform-admin-experiment-management-server-side",
            "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~b00a977f",
            "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~e24a23cd",
            "tapen-experimentation-platform-admin-experiment-management-udlite-app",
          ],
        "./tapen/experimentation-platform-admin/feature/udlite-app": [
          "./src/udemy/js/tapen/experimentation-platform-admin/feature/udlite-app.js",
          "common-app-css",
          "tapen-experimentation-platform-admin-feature-server-side",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~b00a977f",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~e24a23cd",
          "tapen-experimentation-platform-admin-feature-udlite-app",
        ],
        "./tapen/experimentation-platform-admin/ledger/udlite-app": [
          "./src/udemy/js/tapen/experimentation-platform-admin/ledger/udlite-app.tsx",
          "common-app-css",
          "tapen-experimentation-platform-admin-ledger-server-side",
          "tapen-experimentation-platform-admin-ledger-udlite-app",
        ],
        "./tapen/experimentation-platform-admin/plan/udlite-app": [
          "./src/udemy/js/tapen/experimentation-platform-admin/plan/udlite-app.tsx",
          "common-app-css",
          "tapen-experimentation-platform-admin-plan-server-side",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~b00a977f",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~e24a23cd",
          "tapen-experimentation-platform-admin-plan-udlite-app",
        ],
        "./tapen/instructor-course-retirement-notification-admin/udlite-app": [
          "./src/udemy/js/tapen/instructor-course-retirement-notification-admin/udlite-app.js",
          "common-app-css",
          "tapen-instructor-course-retirement-notification-admin-udlite-app",
        ],
        "./tapen/jsoneditor-admin/udlite-app": [
          "./src/udemy/js/tapen/jsoneditor-admin/udlite-app.js",
          "tapen-jsoneditor-admin-server-side",
          "vendors~brace~tapen-jsoneditor-admin-udlite-app~tapen-measure-competence-admin-udlite-app",
          "vendors~tapen-jsoneditor-admin-udlite-app",
          "tapen-jsoneditor-admin-udlite-app",
        ],
        "./tapen/labs-create-new-lab-admin/udlite-app": [
          "./src/udemy/js/tapen/labs-create-new-lab-admin/udlite-app.tsx",
          "tapen-labs-create-new-lab-admin-udlite-app",
        ],
        "./tapen/marketing-tools-admin/udlite-app": [
          "./src/udemy/js/tapen/marketing-tools-admin/udlite-app.js",
          "common-app-css",
          "tapen-marketing-tools-admin-server-side",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~b00a977f",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~e24a23cd",
          "tapen-marketing-tools-admin-udlite-app",
        ],
        "./tapen/measure-competence-admin/udlite-app": [
          "./src/udemy/js/tapen/measure-competence-admin/udlite-app.js",
          "common-app-css",
          "tapen-measure-competence-admin-server-side",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~b00a977f",
          "vendors~brace~tapen-jsoneditor-admin-udlite-app~tapen-measure-competence-admin-udlite-app",
          "tapen-measure-competence-admin-udlite-app",
        ],
        "./tapen/organization-auto-assign-pro-license-admin/udlite-app": [
          "./src/udemy/js/tapen/organization-auto-assign-pro-license-admin/udlite-app.tsx",
          "tapen-organization-auto-assign-pro-license-admin-udlite-app",
        ],
        "./tapen/organization-collections-admin/udlite-app": [
          "./src/udemy/js/tapen/organization-collections-admin/udlite-app.tsx",
          "common-app-css",
          "tapen-organization-collections-admin-server-side",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~b00a977f",
          "vendors~tapen-organization-collections-admin-udlite-app",
          "tapen-organization-collections-admin-udlite-app",
        ],
        "./tapen/organization-insights-admin/data-export-reports/udlite-app": [
          "./src/udemy/js/tapen/organization-insights-admin/data-export-reports/udlite-app.js",
          "common-app-css",
          "tapen-organization-insights-admin-data-export-reports-udlite-app",
        ],
        "./tapen/organization-insights-admin/insights/udlite-app": [
          "./src/udemy/js/tapen/organization-insights-admin/insights/udlite-app.js",
          "common-app-css",
          "vendor-highcharts",
          "vendors~learning-path-udlite-app~organization-admin-landing-experience-udlite-app~organization-insig~8bc55684",
          "vendors~organization-insights-udlite-app~tapen-organization-insights-admin-insights-udlite-app",
          "tapen-organization-insights-admin-insights-udlite-app",
        ],
        "./tapen/organization-merge-admin/create-merge-request/udlite-app": [
          "./src/udemy/js/tapen/organization-merge-admin/create-merge-request/udlite-app.tsx",
          "tapen-organization-merge-admin-create-merge-request-server-side",
          "tapen-organization-merge-admin-create-merge-request-udlite-app",
        ],
        "./tapen/organization-merge-admin/merge-request/udlite-app": [
          "./src/udemy/js/tapen/organization-merge-admin/merge-request/udlite-app.tsx",
          "tapen-organization-merge-admin-merge-request-udlite-app",
        ],
        "./tapen/organization-new-owner-widget-admin/udlite-app": [
          "./src/udemy/js/tapen/organization-new-owner-widget-admin/udlite-app.js",
          "common-app-css",
          "tapen-organization-new-owner-widget-admin-udlite-app",
        ],
        "./tapen/organization-overview-admin/admin-overview/udlite-app": [
          "./src/udemy/js/tapen/organization-overview-admin/admin-overview/udlite-app.tsx",
          "common-app-css",
          "vendors~tapen-organization-overview-admin-admin-overview-udlite-app",
          "tapen-organization-overview-admin-admin-overview-udlite-app",
        ],
        "./tapen/organization-owner-widget-admin/udlite-app": [
          "./src/udemy/js/tapen/organization-owner-widget-admin/udlite-app.js",
          "common-app-css",
          "tapen-organization-owner-widget-admin-udlite-app",
        ],
        "./tapen/organization-subscription-admin/udlite-app": [
          "./src/udemy/js/tapen/organization-subscription-admin/udlite-app.tsx",
          "common-app-css",
          "tapen-organization-subscription-admin-udlite-app",
        ],
        "./tapen/organization-support-admin/udlite-app": [
          "./src/udemy/js/tapen/organization-support-admin/udlite-app.js",
          "tapen-organization-support-admin-server-side",
          "tapen-organization-support-admin-udlite-app",
        ],
        "./tapen/payment-method-admin/udlite-app": [
          "./src/udemy/js/tapen/payment-method-admin/udlite-app.js",
          "common-app-css",
          "tapen-payment-method-admin-udlite-app",
        ],
        "./tapen/payment-method-config-admin/udlite-app": [
          "./src/udemy/js/tapen/payment-method-config-admin/udlite-app.js",
          "common-app-css",
          "tapen-payment-method-config-admin-udlite-app",
        ],
        "./tapen/prepaid-code-admin/prepaid-code-management/udlite-app": [
          "./src/udemy/js/tapen/prepaid-code-admin/prepaid-code-management/udlite-app.js",
          "common-app-css",
          "tapen-prepaid-code-admin-prepaid-code-management-udlite-app",
        ],
        "./tapen/prepaid-code-admin/prepaid-code-request-create/udlite-app": [
          "./src/udemy/js/tapen/prepaid-code-admin/prepaid-code-request-create/udlite-app.js",
          "common-app-css",
          "tapen-prepaid-code-admin-prepaid-code-request-create-udlite-app",
        ],
        "./tapen/prepaid-code-admin/prepaid-code-request-management/udlite-app":
          [
            "./src/udemy/js/tapen/prepaid-code-admin/prepaid-code-request-management/udlite-app.js",
            "common-app-css",
            "tapen-prepaid-code-admin-prepaid-code-request-management-udlite-app",
          ],
        "./tapen/pricing-admin/coupon-management/udlite-app": [
          "./src/udemy/js/tapen/pricing-admin/coupon-management/udlite-app.js",
          "common-app-css",
          "tapen-pricing-admin-coupon-management-udlite-app",
        ],
        "./tapen/quality-review-admin/udlite-app": [
          "./src/udemy/js/tapen/quality-review-admin/udlite-app.js",
          "common-app-css",
          "tapen-quality-review-admin-server-side",
          "tapen-quality-review-admin-udlite-app",
        ],
        "./tapen/refund-admin/udlite-app": [
          "./src/udemy/js/tapen/refund-admin/udlite-app.js",
          "tapen-refund-admin-udlite-app",
        ],
        "./tapen/sherlock-admin/udlite-app": [
          "./src/udemy/js/tapen/sherlock-admin/udlite-app.js",
          "common-app-css",
          "tapen-sherlock-admin-udlite-app",
        ],
        "./tapen/structured-data-search-admin/udlite-app": [
          "./src/udemy/js/tapen/structured-data-search-admin/udlite-app.tsx",
          "common-app-css",
          "tapen-structured-data-search-admin-server-side",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~b00a977f",
          "vendors~tapen-structured-data-search-admin-udlite-app",
          "tapen-structured-data-search-admin-udlite-app",
        ],
        "./tapen/subscription-management-admin/udlite-app": [
          "./src/udemy/js/tapen/subscription-management-admin/udlite-app.tsx",
          "tapen-subscription-management-admin-udlite-app",
        ],
        "./tapen/support-admin/udlite-app": [
          "./src/udemy/js/tapen/support-admin/udlite-app.js",
          "tapen-support-admin-udlite-app",
        ],
        "./tapen/task-management-admin/udlite-app": [
          "./src/udemy/js/tapen/task-management-admin/udlite-app.js",
          "common-app-css",
          "vendors~tapen-experimentation-platform-admin-abn-experiment-management-udlite-app~tapen-experimentat~b00a977f",
          "tapen-task-management-admin-udlite-app",
        ],
        "./tapen/user-test-video-admin/udlite-app": [
          "./src/udemy/js/tapen/user-test-video-admin/udlite-app.js",
          "common-app-css",
          "vendor-videojs",
          "tapen-user-test-video-admin-server-side",
          "vendors~course-manage-practice-udlite-app~course-manage-v2-udlite-app~course-preview-udlite-app~lect~cdb3bda7",
          "tapen-user-test-video-admin-udlite-app",
        ],
        "./tapen/video-player-admin/udlite-app": [
          "./src/udemy/js/tapen/video-player-admin/udlite-app.js",
          "common-app-css",
          "vendor-videojs",
          "vendors~course-manage-practice-udlite-app~course-manage-v2-udlite-app~course-preview-udlite-app~lect~cdb3bda7",
          "vendors~tapen-video-player-admin-udlite-app",
          "tapen-video-player-admin-udlite-app",
        ],
        "./teach-page/challenge/udlite-app": [
          "./src/udemy/js/teach-page/challenge/udlite-app.js",
          "common-app-css",
          "teach-page-challenge-udlite-app",
        ],
        "./teach-page/udlite-app": [
          "./src/udemy/js/teach-page/udlite-app.js",
          "common-app-css",
          "teach-page-server-side",
          "teach-page-udlite-app",
        ],
        "./teaching-courses/test-video/udlite-app": [
          "./src/udemy/js/teaching-courses/test-video/udlite-app.js",
          "common-app-css",
          "vendor-videojs",
          "teaching-courses-test-video-server-side",
          "vendors~course-manage-practice-udlite-app~course-manage-v2-udlite-app~course-preview-udlite-app~lect~cdb3bda7",
          "teaching-courses-test-video-udlite-app",
        ],
        "./terms-bar/udlite-app": [
          "./src/udemy/js/terms-bar/udlite-app.js",
          "terms-bar-udlite-app",
        ],
        "./topic/udlite-app": [
          "./src/udemy/js/topic/udlite-app.ts",
          "common-app-css",
          "discovery-common",
          "topic-server-side",
          "topic-udlite-app",
        ],
        "./user-manage/ajax-modal/udlite-app": [
          "./src/udemy/js/user-manage/ajax-modal/udlite-app.js",
          "common-app-css",
          "user-manage-ajax-modal-server-side",
          "user-manage-ajax-modal-udlite-app",
        ],
        "./user-manage/udlite-app": [
          "./src/udemy/js/user-manage/udlite-app.js",
          "common-app-css",
          "user-manage-server-side",
          "vendors~user-manage-udlite-app",
          "user-manage-udlite-app",
        ],
        "./user-profile/instructor/udlite-app": [
          "./src/udemy/js/user-profile/instructor/udlite-app.ts",
          "common-app-css",
          "user-profile-instructor-server-side",
          "user-profile-instructor-udlite-app",
        ],
        "./user-profile/udlite-app": [
          "./src/udemy/js/user-profile/udlite-app.js",
          "common-app-css",
          "user-profile-udlite-app",
        ],
        "./versioned-image-upload-with-preview/udlite-app": [
          "./src/udemy/js/versioned-image-upload-with-preview/udlite-app.js",
          "versioned-image-upload-with-preview-server-side",
          "versioned-image-upload-with-preview-udlite-app",
        ],
      };
      function s(e) {
        var t = r[e];
        if (!t) {
          return Promise.resolve().then(function () {
            var t = new Error("Cannot find module '" + e + "'");
            t.code = "MODULE_NOT_FOUND";
            throw t;
          });
        }
        return Promise.all(t.slice(1).map(n.e)).then(function () {
          var e = t[0];
          return n(e);
        });
      }
      s.keys = function e() {
        return Object.keys(r);
      };
      s.id = "./src/udemy/js lazy recursive ^\\.\\/.*\\/udlite\\-app$";
      e.exports = s;
    },
    "./src/udemy/js/base-components/universal/index.js": function (e, t, n) {
      "use strict";
      var r = n(
        "./src/udemy/js/base-components/universal/scaffolding.global.less"
      );
      var s = n.n(r);
      var o = n(
        "./node_modules/@udemy/react-core-components/dist/esm/base-icon/icon.global.css"
      );
      var i = n.n(o);
      var a = n(
        "./node_modules/@udemy/react-core-components/dist/esm/button/button.global.css"
      );
      var c = n.n(a);
      var d = n(
        "./node_modules/@udemy/react-core-components/dist/esm/icon-button/icon-button.global.css"
      );
      var u = n.n(d);
      var l = n(
        "./node_modules/@udemy/react-core-components/dist/esm/avatar/avatar.global.css"
      );
      var p = n.n(l);
      var m = n(
        "./node_modules/@udemy/react-core-components/dist/esm/block-list/block-list.global.css"
      );
      var g = n.n(m);
      var f = n(
        "./node_modules/@udemy/react-form-components/dist/esm/form-group/form-group.global.css"
      );
      var h = n.n(f);
      var v = n(
        "./node_modules/@udemy/react-form-components/dist/esm/form-group-variants/compact-form-group.global.css"
      );
      var y = n.n(v);
      var b = n(
        "./node_modules/@udemy/react-form-components/dist/esm/select/select.global.css"
      );
      var _ = n.n(b);
      var j = n(
        "./node_modules/@udemy/react-form-components/dist/esm/text-input/text-input.global.css"
      );
      var w = n.n(j);
      var x = n(
        "./node_modules/@udemy/react-form-components/dist/esm/text-input/text-input-container.global.css"
      );
      var k = n.n(x);
      var O = n(
        "./node_modules/@udemy/react-form-components/dist/esm/toggle-input/toggle-input.global.css"
      );
      var E = n.n(O);
      var C = n(
        "./node_modules/@udemy/react-form-components/dist/esm/toggle-input/toggle-input-block.global.css"
      );
      var S = n.n(C);
      var T = n(
        "./node_modules/@udemy/react-messaging-components/dist/esm/badge/badge.global.css"
      );
      var I = n.n(T);
      var P = n(
        "./node_modules/@udemy/react-reveal-components/dist/esm/loader/loader.global.css"
      );
      var D = n.n(P);
      var A = n(
        "./node_modules/@udemy/react-navigation-components/dist/esm/breadcrumb/breadcrumb.global.css"
      );
      var N = n.n(A);
      var R = n(
        "./node_modules/@udemy/react-structure-components/dist/esm/play-overlay/play-overlay.global.css"
      );
      var L = n.n(R);
      var z = n(
        "./node_modules/@udemy/react-structure-components/dist/esm/footer-buttons/footer-buttons.global.css"
      );
      var U = n.n(z);
    },
    "./src/udemy/js/base-components/universal/scaffolding.global.less":
      function (e, t, n) {},
    "./src/udemy/js/braze/ud-braze.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return s;
      });
      n.d(t, "b", function () {
        return o;
      });
      let r = null;
      function s() {
        if (!window.isBrazeEnabled) {
          return Promise.resolve(false);
        }
        if (!r) {
          const e = n
            .e("braze")
            .then(n.bind(null, "./src/udemy/js/braze/bootstrap.js"));
          r = e.then((e) => {
            let { bootstrap: t } = e;
            return t();
          });
        }
        return r;
      }
      async function o(e) {
        const t = await s();
        t && e(t);
      }
    },
    "./src/udemy/js/common/browser/is-modern-browser.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return r;
      });
      function r() {
        return !!window.URLSearchParams;
      }
    },
    "./src/udemy/js/common/load-common-app-context.ts": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return d;
      });
      var r = n("./node_modules/@udemy/ud-api/dist/esm/index.js");
      var s = n("./node_modules/js-cookie/src/js.cookie.js");
      var o = n.n(s);
      var i = n("./node_modules/mobx/lib/mobx.module.js");
      var a = n("./src/udemy/js/utils/ud-me.js");
      function c() {
        return Object(r["a"])({ header: true, footer: true });
      }
      function d(e) {
        if (UD.performance.isPageCached && !o.a.get("ud_cache_user")) {
          return new Promise((t, n) => {
            let r = false;
            const s = c().then((t) => {
              !r && e && e(t);
              return t;
            });
            Object(i["D"])(
              () => !a["a"].isLoading,
              () => {
                if (a["a"].id) {
                  r = true;
                  d.reset();
                  c()
                    .then((n) => {
                      e === null || e === void 0 ? void 0 : e(n);
                      t(n);
                    })
                    .catch(n);
                } else {
                  s.then(t).catch(n);
                }
              }
            );
          });
        }
        return c().then((t) => {
          e === null || e === void 0 ? void 0 : e(t);
          return t;
        });
      }
      d.reset = () => {
        r["a"].reset();
      };
    },
    "./src/udemy/js/entry/main.js": function (e, t, n) {
      "use strict";
      n.r(t);
      var r = n("./node_modules/mobx/lib/mobx.module.js");
      IntersectionObserver.prototype.POLL_INTERVAL = 100;
      Object(r["h"])({ enforceActions: "observed" });
      if (window.location.hash === "#_=_") {
        if (window.history && window.history.replaceState) {
          const e = window.location.href.split("#")[0];
          window.history.replaceState(null, null, e);
        } else {
          const e = {
            top: document.body.scrollTop,
            left: document.body.scrollLeft,
          };
          window.location.hash = "";
          document.body.scrollTop = e.top;
          document.body.scrollLeft = e.left;
        }
      }
      var s = n(
        "./node_modules/babel-plugin-react-css-modules/dist/browser/getClassName.js"
      );
      var o = n("./src/udemy/js/base-components/universal/index.js");
      var i = n(
        "./node_modules/@udemy/design-system-utils/dist/esm/keyboard/keys.js"
      );
      function a() {
        let e =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : window.document;
        function t() {
          e.body.classList.remove("ud-keyboard-navigation-in-use");
          e.body.addEventListener("keydown", n);
          e.body.removeEventListener("mousedown", t);
        }
        function n(r) {
          if (r.keyCode === i["b"].TAB) {
            e.body.classList.add("ud-keyboard-navigation-in-use");
            e.body.removeEventListener("keydown", n);
            e.body.addEventListener("mousedown", t);
          }
        }
        t();
      }
      var c = n("./node_modules/@udemy/onetrust/dist/esm/index.js");
      var d = n(
        "./node_modules/@udemy/performance-rum-client/dist/esm/index.js"
      );
      var u = n("./node_modules/@udemy/shopping/dist/esm/index.js");
      var l = n(
        "./node_modules/@researchgate/react-intersection-observer/lib/es/index.js"
      );
      var p = n("./node_modules/qs/lib/index.js");
      var m = n("./node_modules/uuid/v4.js");
      function g() {
        gettext("We can’t find the page you’re looking for");
        gettext(
          'Visit our <a class="link">support page</a> for further assistance.'
        );
      }
      function f() {
        gettext("%(companyName)s collection");
        gettext('%(title)s <span class="beta">Beta</span>');
        gettext("Announcements");
        gettext("Account security");
        gettext("Account settings");
        gettext("Add to cart");
        gettext("Alerts");
        gettext("All %(category)s");
        gettext("All categories");
        gettext("All Categories");
        gettext("All paths");
        gettext("All programs");
        gettext("API clients");
        gettext("Assessments");
        gettext("Assignments");
        gettext("Bring learning to your company");
        gettext("Browse now");
        gettext("Categories");
        gettext("Certification preparation");
        gettext("Choose a language");
        gettext("Close account");
        gettext("Close search");
        gettext("Communication");
        gettext("Course engagement");
        gettext("Courses");
        gettext("Create a course");
        gettext("Credit balance");
        gettext("Edit profile");
        gettext("Engagement");
        gettext("Expand");
        gettext("Explore active learning ");
        gettext("Explore active learning");
        gettext("Explore badges");
        gettext("Explore by category");
        gettext("Explore by type");
        gettext("Explore courses");
        gettext("Explore Pro");
        gettext("Explore");
        gettext("Featured Questions");
        gettext("Get the app");
        gettext(
          "Get your team access to over %(count)s top Udemy courses, anytime, anywhere."
        );
        gettext("Go back");
        gettext("Go to cart");
        gettext("Go to My Learning");
        gettext("Go to wishlist");
        gettext("Help and Support");
        gettext("Help");
        gettext("Hi, %(name)s");
        gettext("Insights");
        gettext("Instructor Community");
        gettext("Instructor dashboard");
        gettext("Instructor");
        gettext("Invite friends");
        gettext("Keep shopping");
        gettext("Labs");
        gettext("Language");
        gettext("Learn more");
        gettext("Learn");
        gettext("Learner");
        gettext("Learning paths");
        gettext("Log in or sign up");
        gettext("Log in");
        gettext("Log out");
        gettext("Manage");
        gettext("Mark all as read");
        gettext("Marketplace Insights");
        gettext("Menu");
        gettext("Messages");
        gettext("More from Udemy");
        gettext("Most popular");
        gettext("My cart");
        gettext("My courses");
        gettext("My edited paths");
        gettext("My learning");
        gettext("My organization");
        gettext("My profile");
        gettext("My programs");
        gettext("Next");
        gettext("No notifications.");
        gettext("Notification settings");
        gettext("Notifications");
        gettext("Open search");
        gettext("Open side drawer");
        gettext("Overview");
        gettext("Payment methods");
        gettext("Payout & tax settings");
        gettext("Performance");
        gettext("Personal plan");
        gettext("Popular topics");
        gettext("Practice insights");
        gettext("Privacy settings");
        gettext("Pro features");
        gettext("Profile picture");
        gettext("Programs");
        gettext("Public profile");
        gettext("Purchase history");
        gettext("Q&A");
        gettext("Resources");
        gettext("Revenue report");
        gettext("Reviews");
        gettext("Search bar");
        gettext("Search for anything");
        gettext("See all");
        gettext("Set up auto-renewal");
        gettext("Settings");
        gettext("Sign up");
        gettext("Site navigation");
        gettext("Skip to content");
        gettext("Start learning from over %(count)s courses today.");
        gettext("Start learning today.");
        gettext("Student");
        gettext("Students");
        gettext("Subscriptions");
        gettext("Switch to instructor view");
        gettext("Switch to learner view");
        gettext("Switch to student view");
        gettext("Teach on Udemy");
        gettext("Teaching Center");
        gettext("Test Video");
        gettext("This notification is not read");
        gettext("Tools");
        gettext("Total:");
        gettext("Traffic & conversion");
        gettext("Try %(product)s");
        gettext("Try it now");
        gettext("Udemy Business");
        gettext("Udemy credits");
        gettext("Udemy paths");
        gettext("Udemy profile");
        gettext("View all IT Certification Programs");
        gettext("Warning");
        gettext("Welcome back");
        gettext("What would you like to learn today?");
        gettext("Wishlist");
        gettext("Workspaces");
        gettext("You have alerts");
        gettext("You’re not enrolled in any programs yet.");
        gettext("Your %(product)s account expired.");
        gettext("Your cart is empty.");
        gettext("Your free trial ended on <b>%(endDate)s</b>.");
        gettext("Your subscription ended on <b>%(endDate)s</b>.");
        gettext("Your wishlist is empty.");
        ngettext(
          "Shopping cart with %(cartCount)s item",
          "Shopping cart with %(cartCount)s items",
          1
        );
        gettext(
          "You need to subscribe to a paid plan to continue. " +
            "Please contact the %(product)s Customer Success team at " +
            '<a class="link">success@udemy.com</a>.'
        );
        ngettext(
          "You have only %(count)s day left in your subscription.",
          "You have only %(count)s days left in your subscription.",
          1
        );
        ngettext(
          "You have only %(count)s day left in your free trial.",
          "You have only %(count)s days left in your free trial.",
          1
        );
      }
      var h = n("./src/udemy/js/utils/handle-import-error.js");
      var v = n("./src/udemy/js/loaders/dynamic-imports/emitter.js");
      function y() {
        v["a"].addListener("ud-app", (e) => {
          const { onSuccess: t, onError: r } = b("ud-app", e, h["a"]);
          n("./src/udemy/js lazy recursive ^\\.\\/.*\\/udlite\\-app$")(
            `./${e}/udlite-app`
          )
            .then(t)
            .catch(r);
        });
      }
      function b(e, t, n) {
        return {
          onSuccess(n) {
            v["a"].emit(`${e}:${t}:success`, n);
          },
          onError(r) {
            try {
              n(r);
              v["a"].emit(`${e}:${t}:success`);
            } catch (n) {
              v["a"].emit(`${e}:${t}:failure`, n);
            }
          },
        };
      }
      var _ = n("./src/udemy/js/loaders/ud-app-loader.js");
      var j = n("./src/udemy/js/utils/escape/escape-html.js");
      var w = n("./src/udemy/js/utils/escape/safely-set-inner-html.js");
      var x = n("./src/udemy/js/utils/isomorphic-rendering.js");
      var k = n("./src/udemy/js/utils/ud-api-stat.js");
      var O = n("./src/udemy/js/utils/ud-expiring-local-storage.js");
      var E = n("./src/udemy/js/utils/ud-link.js");
      var C = n("./src/udemy/js/utils/ud-render-react-components.js");
      var S = n("./node_modules/@udemy/ud-data/dist/esm/index.js");
      var T = n("./node_modules/js-cookie/src/js.cookie.js");
      var I = n.n(T);
      var P = n("./src/udemy/js/utils/ud-api.js");
      var D = n("./src/udemy/js/utils/ud-me.js");
      var A = n("./src/udemy/js/utils/ud-visiting.js");
      const N = "/api-2.0/";
      function R(e) {
        const t = I.a.get(P["a"]);
        const n = t && JSON.parse(t);
        const r = Boolean(n && n.requires_api_call);
        const s = () =>
          P["f"]
            .get(n.value.replace(N, ""))
            .then(P["k"])
            .then(() => {
              I.a.remove(P["a"]);
            });
        r ? s().then(e) : e();
      }
      async function L() {
        if (UD.isGlobalMeContextLoading) {
          const e = await P["f"].get("/contexts/me/", {
            params: {
              visiting: "True",
              user_specific_tracking: "True",
              me: "True",
              request: "True",
              Config: "True",
              experiment: "True",
            },
          });
          Object(r["x"])(() => {
            var t, n, r, s, o;
            UD.me = e.data.me;
            Object(D["b"])();
            UD.visiting =
              ((t = e.data) === null || t === void 0 ? void 0 : t.visiting) ||
              {};
            UD.userSpecificTrackingParams =
              ((n = e.data) === null || n === void 0
                ? void 0
                : n.user_specific_tracking) || {};
            UD.request =
              ((r = e.data) === null || r === void 0 ? void 0 : r.request) ||
              {};
            UD.request.clientTimestamp = new Date().toISOString();
            UD.Config =
              ((s = e.data) === null || s === void 0 ? void 0 : s.Config) || {};
            UD.experiment =
              ((o = e.data) === null || o === void 0 ? void 0 : o.experiment) ||
              {};
            Object(A["b"])();
            UD.isGlobalMeContextLoading = false;
            window.dispatchEvent(
              new CustomEvent(S["a"], {
                detail: {
                  Config: UD.Config,
                  experiment: UD.experiment,
                  isGlobalMeContextLoading: UD.isGlobalMeContextLoading,
                  me: UD.me,
                  request: UD.request,
                  userSpecificTrackingParams: UD.userSpecificTrackingParams,
                  visiting: UD.visiting,
                },
              })
            );
          });
        }
        z();
      }
      async function z() {
        if (UD.me.id && !UD.me.time_zone) {
          try {
            const e = Intl.DateTimeFormat().resolvedOptions().timeZone;
            e && P["f"].patch("/users/me/", { time_zone: e });
          } catch (e) {}
        }
      }
      var U = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-request-data.js"
      );
      var F = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/ud-visiting.js"
      );
      function M() {
        const e = Object(U["a"])();
        if (e.isMobile) {
          return "mobile";
        } else if (e.isTablet) {
          return "tablet";
        } else if (e.isPC) {
          return "desktop";
        }
        return null;
      }
      function $() {
        const e = M();
        return Object(d["a"])({
          deviceType: e,
          isFirstTimeVisitor: Object(F["a"])().is_first_time_visitor,
          isPageCached: false,
        });
      }
      var B = n("./src/udemy/js/utils/ud-raven.js");
      var q = n("./src/udemy/js/utils/get-config-data.js");
      function W() {
        const e = Object(q["a"])();
        if (!e.brand.is_external_sources_enabled || !e.third_party.raven_dsn) {
          return;
        }
        let t = false;
        let n = false;
        const r = [];
        const s = function (e) {
          if (
            "e" in e ||
            "p" in e ||
            (e.f && e.f.indexOf("capture") > -1) ||
            (e.f && e.f.indexOf("showReportDialog") > -1)
          ) {
            a(r);
          }
          s.data.push(e);
        };
        s.data = [];
        const o = window.onerror;
        window.onerror = function () {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) {
            t[n] = arguments[n];
          }
          s({ e: [].slice.call(t) });
          if (o) {
            o.apply(window, t);
          }
        };
        const i = window.onunhandledrejection;
        window.onunhandledrejection = function (e) {
          s({
            p:
              "reason" in e
                ? e.reason
                : "detail" in e &&
                  typeof e.detail === "object" &&
                  e.detail !== null
                ? e.detail.reason
                : e,
          });
          if (i) {
            i.call(window, e);
          }
        };
        function a(t) {
          if (n) {
            return;
          }
          n = true;
          const r = document.getElementsByTagName("script")[0];
          const s = document.createElement("script");
          s.src = "https://browser.sentry-cdn.com/6.11.0/bundle.min.js";
          s.setAttribute("crossorigin", "anonymous");
          s.addEventListener("load", () => {
            try {
              window.onerror = o;
              window.onunhandledrejection = i;
              const n = window.Sentry;
              const r = n.init;
              n.init = function (t) {
                const n = {
                  dsn: e.third_party.raven_dsn,
                  autoSessionTracking: false,
                };
                for (const e in t) {
                  if (Object.prototype.hasOwnProperty.call(t, e)) {
                    n[e] = t[e];
                  }
                }
                r(n);
              };
              c(t, n);
            } catch (e) {
              console.error(e);
            }
          });
          r.parentNode.insertBefore(s, r);
        }
        function c(e, t) {
          try {
            const n = s.data;
            for (let n = 0; n < e.length; n++) {
              if (typeof e[n] === "function") {
                e[n](t);
              }
            }
            let r = false;
            const o = window.__SENTRY__;
            if (!(typeof o === "undefined") && o.hub && o.hub.getClient()) {
              r = true;
            }
            let i = false;
            for (let e = 0; e < n.length; e++) {
              if (n[e].f) {
                i = true;
                const s = n[e];
                if (r === false && s.f !== "init") {
                  t.init();
                }
                r = true;
                t[s.f](...s.a);
              }
            }
            if (r === false && i === false) {
              t.init();
            }
            const a = window.onerror;
            const c = window.onunhandledrejection;
            for (let e = 0; e < n.length; e++) {
              if ("e" in n[e] && a) {
                a.apply(window, n[e].e);
              } else if ("p" in n[e] && c) {
                c.apply(window, [n[e].p]);
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
        window.Sentry = window.Sentry || {};
        window.Sentry.onLoad = function (e) {
          r.push(e);
          if (!t) {
            return;
          }
          a(r);
        };
        window.Sentry.forceLoad = function () {
          t = true;
          setTimeout(() => {
            a(r);
          });
        };
        [
          "init",
          "addBreadcrumb",
          "captureMessage",
          "captureException",
          "captureEvent",
          "configureScope",
          "withScope",
          "showReportDialog",
        ].forEach((e) => {
          window.Sentry[e] = function () {
            for (
              var t = arguments.length, n = new Array(t), r = 0;
              r < t;
              r++
            ) {
              n[r] = arguments[r];
            }
            s({ f: e, a: n });
          };
        });
        return window.Sentry;
      }
      var G = n("./src/udemy/js/utils/with-global-providers.tsx");
      var H = n("./node_modules/@udemy/gtag/dist/esm/index.js");
      var V = n("./src/udemy/js/braze/ud-braze.js");
      let K = null;
      function Y() {
        if (window.isPendoEnabled) {
          if (!K) {
            const e = n
              .e(3)
              .then(n.bind(null, "./src/udemy/js/pendo/bootstrap.ts"));
            K = e.then((e) => {
              let { bootstrap: t } = e;
              return t();
            });
          }
        }
      }
      var J = n("./src/udemy/js/utils/get-experiment-data.js");
      var X = n("./src/udemy/js/utils/get-request-data.js");
      var Z = n("./src/udemy/js/utils/ud-external-loaders.js");
      var Q = n("./src/udemy/js/utils/ud-performance.ts");
      function ee(e) {
        const t = new URLSearchParams(window.location.search);
        if (t.has("blockThirdPartyJS")) {
          return;
        }
        Z["a"].loadGoogleAnalytics(undefined, { debug: false });
        H["a"]();
        H["d"]();
        if (UD.GoogleAnalytics.queuedPurchase) {
          H["f"](UD.GoogleAnalytics.queuedPurchase);
        }
        const n = 3e3;
        Q["a"].start("load-third-party-js");
        function r() {
          Q["a"].end("load-third-party-js-request-idle-callback");
          e.then(() => {
            const e = Object(X["a"])();
            const n = Object(q["a"])();
            const r =
              t.has("debugForceLoadGTM") ||
              (e.is_bot !== true && !n.brand.has_organization);
            if (r) {
              te(D["a"].qualaroo_survey_ids);
              Z["a"].loadGoogleTagManager();
              Z["a"].loadGtag();
              Q["a"].mark("load-google-tag-manager");
            }
            Z["a"].loadSift();
            Object(V["a"])();
            Y();
            if (n.features.organization.is_fullstory_enabled) {
              const e =
                Object(J["d"])("lab_taking", "fullstory_enabled", false) ||
                Object(J["d"])(
                  "instructor_insights_ub_only_course_engagement",
                  "fullstory_enabled",
                  false
                ) ||
                Object(J["d"])(
                  "is_new_ce_fullstory_enabled",
                  "fullstory_enabled",
                  false
                );
              if (e) {
                Z["a"].loadFullStory(1);
              } else if (ne()) {
                Z["a"].loadFullStory(0.3);
              } else if (re()) {
                Z["a"].loadFullStory(0.001);
              } else {
                Z["a"].loadFullStory();
              }
            }
            Q["a"].end("load-third-party-js");
          });
        }
        setTimeout(() => {
          Q["a"].start("load-third-party-js-request-idle-callback");
          window.requestIdleCallback(r, { timeout: 2e3 });
        }, n);
      }
      function te(e) {
        window._kiq = window._kiq || [];
        let t, n;
        for (t = 0; t < e.length; t++) {
          n = {};
          n[e[t]] = true;
          window._kiq.push(["set", n]);
        }
        window._kiq.push(["identify", A["a"].visitor_uuid || ""]);
      }
      function ne() {
        return Object(q["a"])().app_name === "instructor";
      }
      function re() {
        return Object(q["a"])().app_name === "course:course_taking";
      }
      g();
      f();
      d["c"].start("js_entry_main");
      Object(r["l"])(UD, { isGlobalMeContextLoading: false });
      Object(G["a"])();
      const se = W();
      if (se) {
        se.onLoad((e) => B["a"].initializeSentry(e));
        B["a"].setSentryInstance(se);
      }
      window.setTimeout(() => {
        y();
        const e = () => {
          a();
          ee(L());
          d["c"].end("js_entry_main");
        };
        R(() => {
          Object(_["a"])(document, e);
        });
        Object(c["c"])();
        $();
        u["c"].fetch();
      }, 0);
    },
    "./src/udemy/js/entry/polyfills.js": function (e, t, n) {
      "use strict";
      n.r(t);
      var r = n("./node_modules/core-js/modules/es.error.cause.js");
      var s = n("./node_modules/core-js/modules/es.aggregate-error.js");
      var o = n("./node_modules/core-js/modules/es.aggregate-error.cause.js");
      var i = n("./node_modules/core-js/modules/es.array.at.js");
      var a = n("./node_modules/core-js/modules/es.array.includes.js");
      var c = n("./node_modules/core-js/modules/es.object.has-own.js");
      var d = n("./node_modules/core-js/modules/es.promise.any.js");
      var u = n("./node_modules/core-js/modules/es.reflect.to-string-tag.js");
      var l = n("./node_modules/core-js/modules/es.string.at-alternative.js");
      var p = n("./node_modules/core-js/modules/es.string.replace-all.js");
      var m = n("./node_modules/core-js/modules/es.typed-array.at.js");
      var g = n("./node_modules/core-js/modules/es.typed-array.set.js");
      var f = n("./node_modules/core-js/modules/web.atob.js");
      var h = n("./node_modules/core-js/modules/web.btoa.js");
      var v = n(
        "./node_modules/core-js/modules/web.dom-exception.constructor.js"
      );
      var y = n("./node_modules/core-js/modules/web.dom-exception.stack.js");
      var b = n(
        "./node_modules/core-js/modules/web.dom-exception.to-string-tag.js"
      );
      var _ = n("./node_modules/core-js/modules/web.immediate.js");
      var j = n("./node_modules/core-js/modules/web.structured-clone.js");
      n("./webpack/babel/external-helpers.js");
      var w = n(
        "./node_modules/intersection-observer/intersection-observer.js"
      );
      window.requestIdleCallback =
        window.requestIdleCallback ||
        function (e) {
          const t = Date.now();
          return setTimeout(() => {
            e({
              didTimeout: false,
              timeRemaining() {
                return Math.max(0, 50 - (Date.now() - t));
              },
            });
          }, 1);
        };
    },
    "./src/udemy/js/loaders/constants.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return r;
      });
      const r = "ud-app-loader.unload";
    },
    "./src/udemy/js/loaders/dynamic-imports/emitter.js": function (e, t, n) {
      "use strict";
      t["a"] = {
        addListener(e, t) {
          document.addEventListener(e, (e) => {
            t(e.detail);
          });
        },
        once(e, t) {
          function n(r) {
            document.removeEventListener(e, n);
            t(r.detail);
          }
          document.addEventListener(e, n);
        },
        emit(e, t) {
          document.dispatchEvent(new CustomEvent(e, { detail: t }));
        },
      };
    },
    "./src/udemy/js/loaders/ud-app-loader.js": function (e, t, n) {
      "use strict";
      var r = n("./src/udemy/js/utils/noop.js");
      var s = n("./src/udemy/js/utils/ud-performance.ts");
      var o = n("./src/udemy/js/utils/ud-raven.js");
      var i = n("./src/udemy/js/loaders/constants.js");
      var a = n("./src/udemy/js/loaders/dynamic-imports/emitter.js");
      function c(e, t, n, r) {
        a["a"].once(`${e}:${t}:success`, n);
        a["a"].once(`${e}:${t}:failure`, r);
        a["a"].emit(e, t);
      }
      n.d(t, "a", function () {
        return l;
      });
      const d = p();
      const u = false;
      function l() {
        let e =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : document;
        let t =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : r["a"];
        const n = {};
        Array.from(e.querySelectorAll(".ud-app-loader")).forEach((e) => {
          const t = Number(e.dataset.modulePriority || 0);
          n[t] = n[t] || [];
          n[t].push(e);
        });
        Object.entries(d).forEach((t) => {
          let [r, s] = t;
          Array.from(e.querySelectorAll(r)).forEach((e) => {
            const t = Number(s.modulePriority || 0);
            e.dataset.moduleId = s.moduleId;
            e.dataset.moduleArgs = JSON.stringify(s.moduleArgs);
            n[t] = n[t] || [];
            n[t].push(e);
          });
        });
        const s = [];
        Object.keys(n)
          .sort((e, t) => (Number(e) < Number(t) ? 1 : -1))
          .forEach((e) => {
            s.push(n[e]);
          });
        function a(e) {
          const t = e.dataset.moduleId,
            n = e.dataset.moduleArgs,
            r = n ? JSON.parse(n) : {};
          if (
            e.classList.contains("ud-app-loading") ||
            e.classList.contains("ud-app-loaded")
          ) {
            return Promise.resolve([]);
          }
          e.classList.add("ud-app-loading");
          function s(t) {
            if (!u) {
              t.default(e, r);
            }
            e.classList.remove("ud-app-loading");
            e.classList.add("ud-app-loaded");
          }
          return m(t)
            .then(s)
            .catch((e) => {
              o["a"].captureException(e);
            });
        }
        s.reduce(
          (e, t) => e.then(() => Promise.all(t.map(a))),
          Promise.resolve()
        ).then(t);
        return function e() {
          Object.values(s).forEach((e) => {
            e.forEach((e) => {
              e.dispatchEvent(new Event(i["a"]));
            });
          });
        };
      }
      function p() {
        return {
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
      }
      function m(e) {
        const t = `_${e.replace(/[-/]/g, "_")}_app`;
        s["a"].start(t);
        return new Promise((n, r) => {
          c(
            "ud-app",
            e,
            (e) => {
              s["a"].end(t);
              n(e);
            },
            r
          );
        });
      }
    },
    "./src/udemy/js/organization-common/constants.js": function (e, t, n) {
      "use strict";
      n.d(t, "e", function () {
        return o;
      });
      n.d(t, "l", function () {
        return i;
      });
      n.d(t, "i", function () {
        return a;
      });
      n.d(t, "j", function () {
        return m;
      });
      n.d(t, "h", function () {
        return g;
      });
      n.d(t, "m", function () {
        return f;
      });
      n.d(t, "n", function () {
        return h;
      });
      n.d(t, "b", function () {
        return v;
      });
      n.d(t, "f", function () {
        return y;
      });
      n.d(t, "o", function () {
        return b;
      });
      n.d(t, "g", function () {
        return _;
      });
      n.d(t, "k", function () {
        return j;
      });
      n.d(t, "d", function () {
        return w;
      });
      n.d(t, "a", function () {
        return x;
      });
      n.d(t, "c", function () {
        return k;
      });
      var r = n("./src/udemy/js/utils/ud-link.js");
      var s = n("./src/udemy/js/organization-insights/links.js");
      const o = { TEAM: "Team", ENTERPRISE: "Enterprise" };
      const i = {
        OWNER: "owner",
        ADMIN: "admin",
        GROUP_ADMIN: "group_admin",
        STUDENT: "student",
      };
      const a = {
        home: "/organization/home/",
        invite: "/organization-manage/users/invite/",
        orgManageBillingPayment:
          "/organization-manage/settings/billing/payment/",
      };
      const c = "https://www.benesse.co.jp/udemy/biz/";
      const d = "https://udemy.wjtb.co.kr/insight/index";
      const u = "https://info.udemy.com/KR_ContactUs.html";
      const l = "/udemy-business/";
      const p = `${l}sign-up/`;
      const m = `${p}?ref=ufb_trial_extension_request`;
      const g = "/payment/upsell-teamplan/";
      const f = (e) => {
        const t = {
          [o.TEAM]: "/organization-manage/settings/billing/payment/",
          [o.ENTERPRISE]: r["a"].toSupportLink("adding_more_licenses", true),
        };
        return t[e];
      };
      const h = (e, t) => {
        if (t) {
          return g;
        }
        const n = {
          [o.TEAM]: "/organization-manage/settings/billing/payment/",
          [o.ENTERPRISE]: r["a"].toSupportLink("adding_more_licenses", true),
        };
        return n[e];
      };
      const v = 429;
      const y = Object.freeze({
        COURSE: "course",
        LEARNING_PATH: "learning_path",
        LAB: "lab",
        ASSESSMENT: "adaptive_assessment_assessment",
        BADGE_ASSERTION: "assertion",
      });
      const b = (e) => ({
        [y.COURSE]: s["a"](s["c"](e)),
        [y.LEARNING_PATH]: s["a"](s["f"](e)),
        [y.LAB]: s["a"](s["h"]()),
        [y.ASSESSMENT]: s["a"](s["h"]()),
      });
      const _ = Object.freeze({
        [y.COURSE]: "courses",
        [y.LEARNING_PATH]: "paths",
        [y.LAB]: "labs",
        [y.ASSESSMENT]: "assessments",
        [y.BADGE_ASSERTION]: "assertions",
      });
      const j = "user";
      const w = "organization_group";
      const x = "all_users";
      const k = Object.freeze({ UNSPECIFIED: 0, ENTERPRISE: 1, PRO: 2 });
    },
    "./src/udemy/js/organization-insights/links.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return s;
      });
      n.d(t, "b", function () {
        return o;
      });
      n.d(t, "d", function () {
        return i;
      });
      n.d(t, "j", function () {
        return a;
      });
      n.d(t, "k", function () {
        return c;
      });
      n.d(t, "l", function () {
        return d;
      });
      n.d(t, "m", function () {
        return u;
      });
      n.d(t, "c", function () {
        return l;
      });
      n.d(t, "i", function () {
        return p;
      });
      n.d(t, "e", function () {
        return m;
      });
      n.d(t, "h", function () {
        return g;
      });
      n.d(t, "g", function () {
        return f;
      });
      n.d(t, "f", function () {
        return h;
      });
      var r = n("./src/udemy/js/utils/ud-link.js");
      function s(e) {
        return r["a"].to(`organization-manage/insights${e}`);
      }
      function o(e, t) {
        return r["a"].to(`tapen/organization/${t}/insights${e}`);
      }
      function i() {
        return "/courses/";
      }
      i.regex = "/courses/";
      function a() {
        return "/skill-insights";
      }
      a.regex = "/skill-insights";
      function c() {
        return "/skill-mastery/";
      }
      c.regex = "/skill-mastery/";
      function d() {
        return "/user-activity/";
      }
      d.regex = "/user-activity/";
      function u() {
        return "/user-adoption/";
      }
      u.regex = "/user-adoption/";
      function l(e) {
        return `/course/${e}`;
      }
      l.regex = "/course/:courseId(\\d+)";
      function p() {
        return `/ratings-reviews`;
      }
      p.regex = "/ratings-reviews";
      function m() {
        return "/learner-feedback";
      }
      m.regex = "/learner-feedback";
      function g() {
        return "/pro";
      }
      g.regex = "/pro";
      function f() {
        return "/paths/";
      }
      f.regex = "/paths/";
      function h(e) {
        return `/paths/${e}`;
      }
      h.regex = "/paths/:pathId(\\d+)";
    },
    "./src/udemy/js/ui-feedback/feedback-queue.js": function (e, t, n) {
      "use strict";
      var r = n("./node_modules/mobx/lib/mobx.module.js");
      var s, o, i;
      let a =
        ((s = r["t"].shallow),
        (o = class e {
          constructor() {
            babelHelpers.initializerDefineProperty(this, "feedbacks", i, this);
          }
          pushFeedback(e, t) {
            this.feedbacks.push({ alertBannerProps: e, toastOptions: t });
          }
        }),
        (i = babelHelpers.applyDecoratedDescriptor(
          o.prototype,
          "feedbacks",
          [s],
          {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: function () {
              return [];
            },
          }
        )),
        babelHelpers.applyDecoratedDescriptor(
          o.prototype,
          "pushFeedback",
          [r["e"]],
          Object.getOwnPropertyDescriptor(o.prototype, "pushFeedback"),
          o.prototype
        ),
        o);
      const c = new a();
      t["a"] = c;
    },
    "./src/udemy/js/user-profile/instructor/constants.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return r;
      });
      const r = [
        10039776, 10634862, 11005030, 11767934, 117958594, 11837726, 122644641,
        12861544, 13121610, 13148312, 13363166, 13952972, 14044590, 14088122,
        14397954, 14631574, 14738472, 147437840, 14942868, 15092458, 15592430,
        15601054, 15892342, 16071104, 16122994, 16269656, 16554222, 16649710,
        16695544, 16794470, 16982602, 17562320, 18187, 1859852, 19034182,
        19081802, 19669210, 19784786, 20021860, 2025260, 2042582, 20762308,
        21150568, 21703028, 21994690, 22006946, 2234938, 231052, 23183888,
        23218620, 23246860, 23512426, 23565832, 23566298, 2364054, 23896614,
        23898572, 24645730, 254593, 25858272, 26019240, 26453858, 26602434,
        26623570, 26719736, 26873824, 27129696, 2739412, 27592028, 278531,
        27878376, 28253010, 29604514, 29720180, 31024906, 31081028, 31303958,
        31334738, 31551648, 317821, 31926668, 33027212, 33231436, 33900490,
        34105812, 342181, 35101150, 36549886, 37802628, 37969484, 3860020,
        38711620, 39081598, 39663830, 40434116, 4132674, 42392238, 43214534,
        4355282, 4409760, 44544844, 4466306, 44831418, 4623324, 46688028,
        48567892, 4953084, 5017036, 50683248, 5096410, 52245124, 523368,
        5487312, 55148420, 5581552, 58935, 599932, 5997742, 61196130, 6124030,
        6319698, 633228, 717783, 7207480, 7231684, 7315098, 75004102, 7519182,
        7530678, 761926, 7724468, 7799204, 797726, 801404, 8280056, 83061750,
        86411800, 8735380, 8910694, 8912846, 8996742, 9055848, 9230936, 9242488,
        9685726, 9848236, 4404500, 24525584, 807402, 31369854, 26729312,
        23560956, 28208536, 12566440, 27455350, 12238490, 47834422, 27369636,
        30066438, 729248, 14233182, 6844166, 32814320, 32174884, 28184902,
        7350360, 61268972, 10099014, 4851584, 7082242, 10978442, 22937892,
        62846716, 8843166, 422607, 680673, 8045140, 20394910, 20527752,
        36851686, 18594894, 11626826, 4606812, 22663786, 33594360, 19368416,
        12062238, 22113450, 27865876, 114871766, 9810446, 133884918, 133967150,
        1113082, 5207370, 2593074, 734554, 55474400, 7241776, 3838058, 9244826,
        9413444, 32086722, 56324888, 127635862, 126106626, 31767132, 22826360,
        99103732, 23365736, 22953644, 54000852, 437257, 93844932, 84507324,
        60035391, 23378840, 35233328, 5297180, 8575448, 23449198, 152054530,
        106105378, 16912784, 43210112, 69436942, 7289056, 43703, 22619124,
        71041768, 126045158, 27799080, 23883614, 710121, 6646384, 59453841,
        64322914, 47184748, 37731188, 141699650, 41799616, 18379804, 43108344,
        843892, 154317200, 15309e3, 16569604, 6956218, 41384972, 589907,
        7947666, 7644438, 33575754, 794308, 22974714, 33310766, 766460,
        20744494, 4942712, 49142906, 12250180, 24317920, 16146540, 10459800,
        767883, 71077370, 1693564, 57259712, 22239822, 65159296, 22352894,
      ];
    },
    "./src/udemy/js/utils/constants.js": function (e, t, n) {
      "use strict";
      var r = n("./node_modules/mobx/lib/mobx.module.js");
      var s = n("./src/udemy/js/utils/get-config-data.js");
      var o = n("./src/udemy/js/utils/get-request-data.js");
      var i = n("./src/udemy/js/utils/ud-me.js");
      const a = (e, t) => t.reduce((e, t) => (e && e[t] ? e[t] : null), e);
      const c = {
        course: {
          extract: (e) => {
            const t = a(e, ["locale", "locale"]);
            return {
              course_id: a(e, ["id"]),
              course_title: a(e, ["title"]),
              course_topic: a(e, ["context_info", "label", "display_name"]),
              course_category: a(e, ["primary_category", "title"]),
              course_subcategory: a(e, ["primary_subcategory", "title"]),
              course_avg_rating: a(e, ["avg_rating_recent"]),
              course_instructor_name: a(e, [
                "visible_instructors",
                0,
                "display_name",
              ]),
              course_language: t ? t.split("_")[0] : null,
              course_locale: t,
              course_length_minutes: a(e, ["estimated_content_length"]),
              course_num_enrollments: a(e, ["num_subscribers"]),
            };
          },
          params: {
            "fields[course]":
              "title,context_info,primary_category,primary_subcategory,avg_rating_recent,visible_instructors,locale,estimated_content_length,num_subscribers",
          },
          url: (e) => `/courses/${e}/`,
        },
        user: {
          extract: async (e) => {
            await Object(r["D"])(() => !i["a"].isLoading);
            if (i["a"].id) {
              if (e) {
                return {
                  is_first_paid_purchase:
                    a(i["a"], ["number_of_courses_purchased"]) === e,
                };
              }
              return {
                isMember: true,
                user_language: a(i["a"], ["language"]),
                user_locale: a(i["a"], ["locale"]),
                user_location: a(i["a"], ["country"]),
                has_made_paid_purchase: i["a"].has_made_paid_purchase,
              };
            }
            const t = a(Object(o["a"])(), ["locale"]);
            return {
              isMember: false,
              user_language: t ? t.split("_")[0] : null,
              user_locale: t,
              user_location: a(Object(s["a"])(), ["price_country", "id"]),
              has_made_paid_purchase: false,
            };
          },
        },
      };
      t["a"] = c;
    },
    "./src/udemy/js/utils/create-ud-proxy.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return s;
      });
      var r = n("./src/udemy/js/utils/server-or-client.ts");
      function s(e, t) {
        if (UD[e] && !UD[e].isLoading) {
          return UD[e];
        }
        const n = { ...UD[e] };
        Object.defineProperty(n, "isLoading", {
          get: () => UD.isGlobalMeContextLoading,
        });
        UD[t].forEach((t) => {
          Object.defineProperty(n, t, {
            get: () => {
              if (r["a"].isServer) {
                throw new Error(
                  `UD.${e}.${t} should not be accessed by Node.js`
                );
              }
              if (n.isLoading) {
                throw new Error(
                  `UD.${e}.${t} has not loaded yet- ` +
                    `you need to check !UD.${e}.isLoading first`
                );
              }
              return UD[e][t];
            },
          });
        });
        return n;
      }
    },
    "./src/udemy/js/utils/escape/escape-html.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return a;
      });
      const r = /[&<>"']/g;
      const s = RegExp(r.source);
      const o = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      function i(e) {
        return o[e];
      }
      function a(e) {
        return e && s.test(e) ? e.replace(r, i) : e;
      }
    },
    "./src/udemy/js/utils/escape/safely-set-inner-html.js": function (e, t, n) {
      "use strict";
      var r = n(
        "./node_modules/@udemy/shared-utils/dist/esm/iso/iso-dompurify.js"
      );
      var s = r["DOMPurify"];
      n.d(t, "a", function () {
        return o;
      });
      function o(e) {
        let {
          descriptionOfCaller: t,
          html: n,
          dataPurpose: r = undefined,
          domPurifyConfig: o = undefined,
        } = e;
        const i = s.sanitize(n, o);
        r = r || `safely-set-inner-html:${t}`;
        return { "data-purpose": r, dangerouslySetInnerHTML: { __html: i } };
      }
    },
    "./src/udemy/js/utils/get-config-data.js": function (e, t, n) {
      "use strict";
      var r = n("./node_modules/@udemy/shared-utils/dist/esm/index.js");
      n.d(t, "b", function () {
        return r["k"];
      });
      var s = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-config-data.js"
      );
      t["a"] = s["a"];
    },
    "./src/udemy/js/utils/get-experiment-data.js": function (e, t, n) {
      "use strict";
      n.d(t, "b", function () {
        return s;
      });
      n.d(t, "c", function () {
        return i;
      });
      n.d(t, "d", function () {
        return a;
      });
      n.d(t, "e", function () {
        return d;
      });
      n.d(t, "a", function () {
        return u;
      });
      var r = n("./src/udemy/js/utils/server-or-client.ts");
      function s() {
        return r["a"].global.UD.experiment;
      }
      function o() {
        return r["a"].global.UD.request.extra_experiment_data;
      }
      function i(e, t, n) {
        const r = s();
        if (r === undefined || r[e] === undefined) {
          return n;
        }
        const o = d(e);
        if (!(t in o)) {
          return n;
        }
        return o[t];
      }
      function a(e, t, n) {
        const r = o();
        if (r === undefined || r[e] === undefined) {
          return n;
        }
        const s = r[e];
        if (!(t in s)) {
          return n;
        }
        return s[t];
      }
      function c(e, t) {
        const n = s();
        const r = n[e];
        const o = Object.keys(r).filter(
          (e) => t in r[e].values && r[e].state === "unrecorded"
        );
        return o.map((e) => parseInt(e, 10));
      }
      function d(e) {
        const t = s();
        const n = t[e];
        const r = (e, t) => Object.assign(e, n[t].values);
        return Object.keys(n).reduce(r, {});
      }
      function u() {
        const e = s();
        const t = (e, t) => {
          const n = Object.values(t).map((e) => e.variant);
          return e.concat(n);
        };
        return Object.values(e).reduce(t, []);
      }
    },
    "./src/udemy/js/utils/get-request-data.js": function (e, t, n) {
      "use strict";
      var r = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-request-data.js"
      );
      Object(r["b"])();
      t["a"] = r["a"];
    },
    "./src/udemy/js/utils/handle-import-error.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return o;
      });
      var r = n("./src/udemy/js/ui-feedback/feedback-queue.js");
      var s = n("./src/udemy/js/utils/ud-raven.js");
      function o(e) {
        r["a"].pushFeedback({
          udStyle: "error",
          title: gettext(
            "There was a problem fetching content from our server. " +
              "Please reload this page to fix this problem."
          ),
          body: gettext(
            "This error may be the result of a bad network connection."
          ),
          ctaText: gettext("Reload page"),
          onAction: () => window.location.reload(),
        });
        s["a"].captureException(e);
        e.message = `Previously handled exception: ${e.message}`;
        throw e;
      }
    },
    "./src/udemy/js/utils/isomorphic-rendering.js": function (e, t, n) {
      "use strict";
      n.d(t, "b", function () {
        return m;
      });
      n.d(t, "a", function () {
        return f;
      });
      var r = n(
        "./node_modules/@udemy/design-system-utils/dist/esm/a11y/a11y.js"
      );
      var s = n("./node_modules/autobind-decorator/lib/esm/index.js");
      var o = n("./node_modules/mobx/lib/mobx.module.js");
      var i = n("./node_modules/mobx-react/dist/mobx-react.module.js");
      var a = n("./node_modules/prop-types/index.js");
      var c = n.n(a);
      var d = n("./node_modules/react/index.js");
      var u = n.n(d);
      var l = n("./src/udemy/js/utils/server-or-client.ts");
      function p(e) {
        return l["a"].isServer ? e : e.isRequired;
      }
      function m(e) {
        var t, n, a;
        return (
          (t =
            ((a = class t extends u.a.Component {
              constructor(e, t) {
                e.serverUniqueId && Object(r["g"])(e.serverUniqueId);
                super(e, t);
                babelHelpers.initializerDefineProperty(
                  this,
                  "lifecycle",
                  n,
                  this
                );
              }
              componentDidMount() {
                this.setLifecycle("MOUNTED");
              }
              setLifecycle(e) {
                this.lifecycle = e;
              }
              getIsMounted() {
                return this.lifecycle === "MOUNTED";
              }
              render() {
                const {
                  serverAdditionalContext: t,
                  serverRequestContext: n,
                  serverUniqueId: r,
                  ...s
                } = this.props;
                return u.a.createElement(
                  i["c"],
                  {
                    isIsomorphicallyRendered: true,
                    getIsRootComponentMounted: this.getIsMounted,
                    serverAdditionalContext: t,
                    serverRequestContext: n,
                  },
                  u.a.createElement(e, s)
                );
              }
            }),
            (a.displayName = `Isomorphic${e.displayName || e.name}`),
            (a.propTypes = {
              ...e.propTypes,
              serverAdditionalContext: c.a.object,
              serverRequestContext: c.a.object,
              serverUniqueId: c.a.string,
            }),
            (a.defaultProps = {
              ...e.defaultProps,
              serverAdditionalContext: null,
              serverRequestContext: null,
              serverUniqueId: null,
            }),
            (a.isIsomorphicComponent = true),
            (a.wrappedComponent = e.wrappedComponent || e),
            a)),
          (n = babelHelpers.applyDecoratedDescriptor(
            t.prototype,
            "lifecycle",
            [o["t"]],
            {
              configurable: true,
              enumerable: true,
              writable: true,
              initializer: function () {
                return null;
              },
            }
          )),
          babelHelpers.applyDecoratedDescriptor(
            t.prototype,
            "setLifecycle",
            [o["e"]],
            Object.getOwnPropertyDescriptor(t.prototype, "setLifecycle"),
            t.prototype
          ),
          babelHelpers.applyDecoratedDescriptor(
            t.prototype,
            "getIsMounted",
            [s["a"]],
            Object.getOwnPropertyDescriptor(t.prototype, "getIsMounted"),
            t.prototype
          ),
          t
        );
      }
      function g(e) {
        let t = e.isIsomorphicallyRendered;
        let n = e.getIsRootComponentMounted;
        if (t === undefined) {
          t = false;
          n = null;
        }
        return { isIsomorphicallyRendered: t, getIsRootComponentMounted: n };
      }
      function f(e) {
        return Object(i["e"])(g)(e);
      }
    },
    "./src/udemy/js/utils/noop.js": function (e, t, n) {
      "use strict";
      var r = n("./node_modules/@udemy/shared-utils/dist/esm/index.js");
      n.d(t, "a", function () {
        return r["f"];
      });
    },
    "./src/udemy/js/utils/server-or-client.ts": function (e, t, n) {
      "use strict";
      var r = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/server-or-client.js"
      );
      t["a"] = r["a"];
    },
    "./src/udemy/js/utils/ud-api-stat.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return s;
      });
      var r = n("./src/udemy/js/utils/ud-api.js");
      const s = Object.freeze({
        COURSE_MANAGE: "coursemanage",
        COURSE_TAKING: "coursetaking",
        QUIZ_TAKING: "quiz_taking",
        COURSE_LABEL: "courselabel",
      });
      const o = Object.freeze({
        DASHBOARD: "dashboard",
        NAVIGATION: "navigation",
        COURSE_CONTENT: "course_content",
        TRANSCRIPT: "transcript",
        TRANSCRIPT_EDITOR: "transcript_editor",
        INTERSTITIAL: "interstitial",
        CAPTION_EDITOR: "caption_editor",
        BOOKMARK: "bookmark",
        CURRICULUM: "Curriculum",
        PLAYER_SETTINGS: "player_settings",
      });
      t["b"] = {
        increment(e, t, n, s) {
          r["f"]
            .post("/visits/me/datadog-increment-logs/", {
              key: e,
              tags: JSON.stringify(t),
            })
            .then(n)
            .catch(s);
        },
      };
    },
    "./src/udemy/js/utils/ud-api.js": function (e, t, n) {
      "use strict";
      n.d(t, "g", function () {
        return h;
      });
      n.d(t, "e", function () {
        return y;
      });
      n.d(t, "c", function () {
        return w;
      });
      n.d(t, "b", function () {
        return x;
      });
      n.d(t, "a", function () {
        return E;
      });
      n.d(t, "d", function () {
        return C;
      });
      n.d(t, "o", function () {
        return I;
      });
      n.d(t, "n", function () {
        return P;
      });
      n.d(t, "k", function () {
        return A;
      });
      n.d(t, "i", function () {
        return z;
      });
      n.d(t, "j", function () {
        return B;
      });
      n.d(t, "l", function () {
        return W;
      });
      n.d(t, "m", function () {
        return G;
      });
      n.d(t, "h", function () {
        return V;
      });
      var r = n("./node_modules/axios/index.js");
      var s = n.n(r);
      var o = n("./node_modules/axios/lib/utils.js");
      var i = n.n(o);
      var a = n("./node_modules/js-cookie/src/js.cookie.js");
      var c = n.n(a);
      var d = n("./src/udemy/js/utils/get-config-data.js");
      var u = n("./src/udemy/js/utils/noop.js");
      var l = n("./src/udemy/js/utils/server-or-client.ts");
      var p = n("./src/udemy/js/utils/ud-me.js");
      var m = n("./src/udemy/js/utils/ud-raven.js");
      const g = Object(d["a"])();
      const f = l["a"].isClient
        ? g.url.to_root
        : "/server-side-rendering-does-not-allow-api-calls/";
      const h = gettext("Unexpected error occurred");
      const v = "api-2.0";
      const y = `${f}${v}/`;
      const b = `${f}`;
      const _ = `${f}organization-analytics/`;
      const j = `${f}tapen/${v}/`;
      const w = 2e4;
      const x = 6e4;
      const k = "x-udemy-additional-context";
      const O = "Accept-Language";
      const E = "X-Udemy-Additional-Context-Requested";
      const C = { "X-Requested-With": "XMLHttpRequest", ...L(), ...U() };
      let S;
      const T = R({ baseURL: y });
      T.get = $(T.get);
      T.get = M(T.get);
      T.post = M(T.post);
      T.put = M(T.put);
      T.patch = M(T.patch);
      t["f"] = T;
      const I = R({ baseURL: j });
      I.get = M(I.get);
      I.post = M(I.post);
      I.put = M(I.put);
      I.patch = M(I.patch);
      const P = R({
        baseURL: b,
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFToken",
      });
      const D = R({ baseURL: _ });
      function A(e) {
        Object(d["b"])(e.data);
        return e;
      }
      function N(e) {
        if (e.headers && e.headers[k]) {
          Object(d["b"])(e.headers[k]);
          c.a.remove(E);
        }
        return e;
      }
      function R(e) {
        const t = s.a.create({
          headers: C,
          timeout: x,
          paramsSerializer: G,
          ...e,
        });
        t.interceptors.response.use(
          (e) => N(e),
          (e) => {
            const t = e.response && e.response.headers;
            if (
              t &&
              t["x-udemy-failed-permission"] === "user-auth" &&
              !p["a"].isLoading &&
              p["a"].id
            ) {
              l["a"].global.location.reload();
              return new Promise(u["a"]);
            }
            return Promise.reject(e);
          }
        );
        return t;
      }
      function L() {
        try {
          const e = c.a.get(E);
          const t = e && JSON.parse(e);
          return t && !t.requires_api_call
            ? {
                "X-Udemy-Additional-Context-Requested": JSON.stringify(t.value),
              }
            : {};
        } catch (e) {
          m["a"].captureException(e);
          return {};
        }
      }
      function z() {
        const e = c.a.getJSON() || {};
        if (Object.prototype.hasOwnProperty.call(e, "ud_client_cache_off")) {
          return {};
        }
        const t = {};
        Object.entries(e)
          .filter((e) => e[0].startsWith("ud_cache_"))
          .forEach((e) => {
            const n = e[0].split("ud_cache_")[1];
            const r = n
              .split("_")
              .map((e) => e.slice(0, 1).toUpperCase() + e.slice(1))
              .join("-");
            const s = `X-Udemy-Cache-${r}`;
            t[s] = String(e[1]);
          });
        return t;
      }
      function U() {
        const e = c.a.getJSON() || {};
        if (e.ud_locale) {
          const t = e.ud_locale.split("_").join("-");
          return { [O]: t };
        }
      }
      function F() {
        S = {};
      }
      function M(e) {
        return function (t) {
          if (g.env !== "PROD") {
            const e = `Deprecated API call without trailing slash detected: "${t}". Fix this by adding trailing slash`;
            const n = new URL(t, "https://example.com");
            if (!n.pathname.endsWith("/")) {
              throw Error(e);
            }
            if (n.pathname.includes("//")) {
              throw Error(
                `Double slashes detected in: ${t}. Might be a hint that the url is wrong`
              );
            }
          }
          for (
            var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), s = 1;
            s < n;
            s++
          ) {
            r[s - 1] = arguments[s];
          }
          return e(t, ...r);
        };
      }
      function $(e) {
        F();
        return function (t) {
          let n =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {};
          n.headers = { ...n.headers, ...z() };
          if (!n.useCache) {
            return e(t, n);
          }
          const r = JSON.stringify(Object.assign({ url: t }, n));
          const s = new Date().getTime();
          const o = n.expires * 1e3 || 1e3 * 60 * 60;
          if (S[r]) {
            if (S[r].expires <= s) {
              delete S[r];
            } else {
              return S[r].request;
            }
          }
          const i = e(t, n);
          S[r] = { request: i, expires: s + o };
          return i.catch((e) => {
            delete S[r];
            throw e;
          });
        };
      }
      const B = (e) => {
        if (e.isParsedError) {
          return e;
        }
        if (e.response) {
          return Object.assign(
            { isParsedError: true, statusCode: e.response.status },
            e.response.data
          );
        }
        return { detail: e.message, JSError: e, isParsedError: true };
      };
      function q(e, t, n, r, s, o, i, a) {
        if (s() && !a.isCanceled) {
          a.timeoutId = setTimeout(() => {
            T.get(e, { params: t })
              .then((c) => {
                if (o && o(c.data)) {
                  return;
                }
                if (n) {
                  n(c.data);
                }
                q(e, t, n, r, s, o, i, a);
              })
              .catch((e) => {
                if (r) {
                  r(B(e));
                }
              });
          }, i);
        }
        return a.cancel;
      }
      function W(e, t, n, r, s, o, i) {
        const a = {
          isCanceled: false,
          timeoutId: undefined,
          cancel() {
            clearInterval(a.timeoutId);
            a.isCanceled = true;
          },
        };
        return q(e, t, n, r, s, o, i, a);
      }
      function G(e, t) {
        t = { arrayBrackets: true, ...t };
        const n = [];
        i.a.forEach(e, (e, r) => {
          if (e === null || typeof e === "undefined") {
            return;
          }
          if (i.a.isArray(e)) {
            if (t.arrayBrackets) {
              r = `${r}[]`;
            }
          } else {
            e = [e];
          }
          i.a.forEach(e, (e) => {
            if (i.a.isDate(e)) {
              e = e.toISOString();
            } else if (i.a.isObject(e)) {
              e = JSON.stringify(e);
            }
            n.push(`${H(r)}=${H(e)}`);
          });
        });
        return n.join("&");
      }
      function H(e) {
        return encodeURIComponent(e)
          .replace(/%40/gi, "@")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",")
          .replace(/%20/g, "+")
          .replace(/%5B/gi, "[")
          .replace(/%5D/gi, "]");
      }
      function V(e, t) {
        let n =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : undefined;
        const r = [];
        function s(e, t) {
          t = Object.assign({}, { params: t }, n);
          return T.get(e, t).then((e) => {
            r.push(...e.data.results);
            const t = e.data.next;
            if (!t) {
              return r;
            }
            return s(t);
          });
        }
        return s(e, t);
      }
    },
    "./src/udemy/js/utils/ud-expiring-local-storage.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return l;
      });
      var r = n("./node_modules/mobx/lib/mobx.module.js");
      var s = n("./node_modules/store/src/store-engine.js");
      var o = n.n(s);
      var i = n("./node_modules/store/storages/localStorage.js");
      var a = n.n(i);
      var c = n("./node_modules/store/storages/memoryStorage.js");
      var d = n.n(c);
      const u = o.a.createStore([a.a, d.a], []);
      function l(e, t, n) {
        const s = Object(r["t"])({
          cacheKey: `${e}:${t}`,
          expirations: r["t"].map(),
          expirationsCacheKey: "expiringLocalStorageFactory.expirations",
          storedValues: r["t"].map(),
        });
        s.expirations.observe(() => {
          const e = u.get(s.expirationsCacheKey) || {};
          const t = Object.assign(e, Object(r["A"])(s.expirations));
          u.set(s.expirationsCacheKey, t);
        });
        Object(r["e"])(() => {
          try {
            s.storedValues.merge(u.get(s.cacheKey) || {});
            s.expirations.merge(u.get(s.expirationsCacheKey) || {});
          } catch (e) {}
          const e = new Date();
          s.expirations.forEach((t, n) => {
            if (new Date(t) < e) {
              u.remove(n);
              const e = u.get("expiringLocalStorageFactory.expirations");
              delete e[n];
              u.set(s.expirationsCacheKey, e);
              s.expirations.delete(n);
              s.storedValues.clear();
            }
          });
        })();
        s.storedValues.observe(() => {
          u.set(s.cacheKey, s.storedValues);
          if (!n || s.expirations.get(s.cacheKey)) {
            return;
          }
          s.expirations.set(s.cacheKey, n);
        });
        return {
          set: Object(r["e"])((e, t) => {
            const n = u.get(s.cacheKey) || {};
            s.storedValues.merge(n);
            s.storedValues.set(e, t);
          }),
          get(e) {
            return s.storedValues.get(e);
          },
          delete: Object(r["e"])((e) => {
            s.storedValues.delete(e);
          }),
          keys() {
            return s.storedValues.keys();
          },
          size() {
            return s.storedValues.size;
          },
          clear: Object(r["e"])(() => {
            s.storedValues.clear();
            u.remove(s.cacheKey);
            u.remove(s.expirationsCacheKey);
            o(s.cacheKey);
          }),
          updateExpiration: Object(r["e"])((e) => {
            s.expirations.set(s.cacheKey, e);
          }),
        };
        function o(e) {
          s.expirations.delete(e);
        }
      }
    },
    "./src/udemy/js/utils/ud-external-loaders.js": function (e, t, n) {
      "use strict";
      var r = n("./node_modules/@sentry/browser/esm/index.js");
      var s = n("./node_modules/@sentry/fullstory/dist/index.es.js");
      var o = n("./node_modules/@udemy/fullstory/dist/esm/index.js");
      var i = n("./node_modules/@udemy/gtag/dist/esm/index.js");
      var a = n("./node_modules/@udemy/onetrust/dist/esm/index.js");
      var c = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-config-data.js"
      );
      var d = n(
        "./node_modules/@udemy/shared-utils/dist/esm/data/get-request-data.js"
      );
      var u = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/ud-visiting.js"
      );
      var l = n(
        "./node_modules/@udemy/shared-utils/dist/esm/env/ud-user-agnostic-tracking-params.js"
      );
      var p = n("./node_modules/scriptjs/dist/script.js");
      var m = n.n(p);
      var g = n("./src/udemy/js/common/load-common-app-context.ts");
      var f = n("./src/udemy/js/user-profile/instructor/constants.js");
      var h = n("./src/udemy/js/utils/constants.js");
      var v = n("./src/udemy/js/utils/get-experiment-data.js");
      var y = n("./src/udemy/js/utils/ud-link.js");
      var b = n("./src/udemy/js/utils/ud-me.js");
      var _ = n("./src/udemy/js/utils/ud-raven.js");
      var j = n("./src/udemy/js/utils/ud-visitor-uuid.js");
      const w = {};
      w.loadSignInWithApple = function e(t) {
        const n = Object(c["a"])();
        if (n.brand.is_external_sources_enabled) {
          const e =
            "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
          m()(e, () => {
            if (
              typeof t !== "undefined" &&
              typeof window.AppleID !== "undefined"
            ) {
              t(window.AppleID);
            }
          });
        }
      };
      w.loadFacebookSDK = function e(t) {
        const n = Object(c["a"])();
        if (
          n.brand.is_external_sources_enabled &&
          n.brand.is_third_party_marketing_enabled
        ) {
          const e = "https://connect.facebook.net/en_US/sdk.js";
          m()(e, () => {
            if (typeof t !== "undefined" && typeof window.FB !== "undefined") {
              t(window.FB);
            }
          });
        }
      };
      w.loadPayPalLogin = function e(t) {
        const n = Object(c["a"])();
        if (n.brand.is_external_sources_enabled) {
          const e = "https://www.paypalobjects.com/js/external/api.js";
          m()(e, () => {
            if (
              typeof t !== "undefined" &&
              typeof window.requirejs !== "undefined"
            ) {
              t(window.requirejs);
            }
          });
        }
      };
      w.loadGoogleAnalytics = function e(t, n) {
        const r = Object(c["a"])();
        if (r.env !== "PROD" || !a["a"].allowsGoogleAnalytics()) {
          return;
        }
        n = n || {};
        const s = n.debug;
        let o = "//www.google-analytics.com/analytics";
        if (s) {
          o += "_debug";
        }
        o += ".js";
        m()(o, () => {
          if (typeof t !== "undefined" && typeof window.ga !== "undefined") {
            t(window.ga);
          }
        });
      };
      w.loadGtag = function (e) {
        const t = Object(c["a"])();
        const n = new URLSearchParams(window.location.search).has(
          "forceLoadGtag"
        );
        if (
          n ||
          (t.brand.is_external_sources_enabled &&
            t.brand.is_third_party_marketing_enabled)
        ) {
          Object(i["b"])(e);
        }
      };
      w.loadGoogleAuth = function e(t) {
        const n = Object(c["a"])();
        if (n.brand.is_external_sources_enabled) {
          window.udGoogleAuthLoaderCallback = () => {
            if (
              typeof t !== "undefined" &&
              typeof window.google !== "undefined"
            ) {
              t(window.google);
            }
          };
          window.udGoogleAuthLoaderCallback();
          m()(
            "https://accounts.google.com/gsi/client",
            window.udGoogleAuthLoaderCallback
          );
        }
      };
      w.loadGoogleTagManager = function e() {
        const t = Object(c["a"])();
        if (
          t.brand.is_external_sources_enabled &&
          t.brand.is_third_party_marketing_enabled
        ) {
          ((e, n, r, s, o) => {
            if (!e[s]) {
              e[s] = [];
            }
            e[s].push({ isMember: b["a"].id > 0, env: t.env });
            (async () => {
              e[s].push(await h["a"].user.extract());
            })();
            e[s].push({ "gtm.start": Date.now(), event: "gtm.js" });
            const i = n.getElementsByTagName(r)[0];
            const a = n.createElement(r);
            const c = s != "dataLayer" ? `&l=${s}` : "";
            a.async = true;
            a.src = `//www.googletagmanager.com/gtm.js?id=${o}${c}`;
            i.parentNode.insertBefore(a, i);
          })(
            window,
            document,
            "script",
            "dataLayer",
            t.third_party.google_tag_manager_id
          );
        }
      };
      w.loadSift = function e(t) {
        const n = Object(c["a"])();
        if (n.brand.is_external_sources_enabled && n.third_party.sift_account) {
          const e = (window._sift = window._sift || []);
          e.push(["_setAccount", n.third_party.sift_account]);
          e.push(["_setUserId", b["a"].id]);
          e.push(["_setSessionId", Object(j["a"])()]);
          e.push(["_trackPageview"]);
          m()("https://cdn.sift.com/s.js", () => {
            if (typeof t !== "undefined") {
              t(window._sift);
            }
          });
        }
      };
      w.loadStripeJSV2 = function e(t) {
        const n = Object(c["a"])();
        if (n.brand.is_external_sources_enabled) {
          m()("https://js.stripe.com/v2/", () => {
            if (
              typeof t !== "undefined" &&
              typeof window.Stripe !== "undefined"
            ) {
              t(window.Stripe);
            }
          });
        }
      };
      w.loadStripeJSV3 = function e(t) {
        const n = Object(c["a"])();
        if (n.brand.is_external_sources_enabled) {
          m()("https://js.stripe.com/v3/", () => {
            if (
              typeof t !== "undefined" &&
              typeof window.Stripe !== "undefined"
            ) {
              t(window.Stripe);
            }
          });
        }
      };
      w.loadZendeskChat = function e(t) {
        const n = Object(c["a"])();
        if (n.features.zendesk_chat) {
          document.zendeskHost = "udemysupport.zendesk.com";
          document.zEQueue = [];
          m()("https://assets.zendesk.com/embeddable_framework/main.js", () => {
            if (typeof t !== "undefined") {
              t();
            }
          });
        }
      };
      w.loadZendeskWebWidget = function e(t, n) {
        const r = Object(c["a"])();
        if (r.features.zendesk_chat) {
          document.zendeskHost = "udemysupport.zendesk.com";
          document.zEQueue = [];
          m()(`https://static.zdassets.com/ekr/snippet.js?key=${t}`, () => {
            if (typeof n !== "undefined") {
              n();
            }
          });
        }
      };
      w.loadMarketoForms2 = function e(t) {
        m()("https://app-sjqe.marketo.com/js/forms2/js/forms2.min.js", () => {
          t && t();
        });
      };
      w.loadMarketoMunchkin = function e(t) {
        m()("https://munchkin.marketo.net/munchkin-beta.js", () => {
          t && t();
        });
      };
      w.loadFullStory = async function e(t) {
        var n, i, a, p, m;
        const h = Object(c["a"])();
        if (!h.brand.is_external_sources_enabled) {
          return;
        }
        if (b["a"].isLoading) {
          return;
        }
        const y = {
          Config: h,
          request: Object(d["a"])(),
          visiting: Object(u["a"])(),
          userAgnosticTrackingParams: Object(l["a"])(),
        };
        const j = await Object(g["a"])();
        const { user: w } = j.data.header;
        const x = {
          isConsumerSubsSubscriber: w.consumer_subscription_active,
          isUBAdmin:
            ((n = b["a"].organization) === null || n === void 0
              ? void 0
              : n.isAdmin) ||
            ((i = b["a"].organization) === null || i === void 0
              ? void 0
              : i.isOwner),
          isUBGroupAdmin:
            (a = b["a"].organization) === null || a === void 0
              ? void 0
              : a.isGroupAdmin,
          isProLicenseHolder:
            (p = b["a"].organization) === null || p === void 0
              ? void 0
              : p.is_pro_license_holder,
          ubRole:
            (m = b["a"].organization) === null || m === void 0
              ? void 0
              : m.role,
          isInstructorPartner: f["a"].includes(b["a"].id),
          isAuthenticated: b["a"].is_authenticated,
          signupDate: b["a"].created,
          encryptedId: b["a"].encrypted_id,
        };
        o["b"].initialize({
          udData: y,
          userData: x,
          sampleRate: t,
          onInitialized: () => {
            _["a"].getSentryInstance().setTag("fullstory", "enabled");
            o["a"].setVars("page", {
              experimentVariant_ints: Object(v["a"])(),
            });
          },
        });
        _["a"].initializeSentry(r, { integrations: [new s["a"]("udemycom")] });
      };
      w.loadEmmetScript = function () {
        return new Promise((e) => {
          m()(
            y["a"].toStorageStaticAsset("instructor/coding_exercise/emmet.js"),
            e
          );
        });
      };
      t["a"] = w;
    },
    "./src/udemy/js/utils/ud-link.js": function (e, t, n) {
      "use strict";
      var r = n("./node_modules/@udemy/ud-data/dist/esm/index.js");
      t["a"] = r["e"];
    },
    "./src/udemy/js/utils/ud-me.js": function (e, t, n) {
      "use strict";
      n.d(t, "b", function () {
        return i;
      });
      var r = n("./src/udemy/js/utils/create-ud-proxy.js");
      var s = n("./src/udemy/js/organization-common/constants.js");
      const o = Object(r["a"])("me", "meProperties");
      i();
      t["a"] = o;
      function i() {
        if (UD.me && !UD.me.isLoading && UD.me.organization) {
          Object.assign(UD.me.organization, {
            isOwner: UD.me.organization.role === s["l"].OWNER,
            isAdmin: UD.me.organization.role === s["l"].ADMIN,
            isGroupAdmin: UD.me.organization.role === s["l"].GROUP_ADMIN,
            isStudent: UD.me.organization.role === s["l"].STUDENT,
            hasPermission: (e) => {
              if (!UD.me.organization.permissions) {
                return false;
              }
              return o.organization.permissions
                .map((e) => e.permission)
                .includes(e);
            },
          });
        }
      }
    },
    "./src/udemy/js/utils/ud-performance.ts": function (e, t, n) {
      "use strict";
      var r = n(
        "./node_modules/@udemy/performance-rum-client/dist/esm/index.js"
      );
      Object(r["b"])();
      t["a"] = r["c"];
    },
    "./src/udemy/js/utils/ud-raven.js": function (e, t, n) {
      "use strict";
      var r = n("./node_modules/autobind-decorator/lib/esm/index.js");
      var s = n("./node_modules/mobx/lib/mobx.module.js");
      var o = n("./src/udemy/js/common/browser/is-modern-browser.js");
      var i = n("./src/udemy/js/utils/get-config-data.js");
      var a = n("./src/udemy/js/utils/ud-me.js");
      var c = n("./src/udemy/js/utils/ud-user-agnostic-tracking-params.js");
      var d;
      function u(e) {
        return l(p, g, m)(e);
      }
      function l() {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) {
          t[n] = arguments[n];
        }
        return function (e) {
          return t.reduce((e, t) => {
            if (!e) {
              return null;
            }
            return t(e);
          }, e);
        };
      }
      function p(e) {
        return Object(o["a"])() ? e : null;
      }
      function m(e) {
        f(e).forEach((e) => {
          if (e.filename && !e.filename.endsWith(".js")) {
            e.filename = "<not-a-js-file-see-ud-raven>";
          }
        });
        return e;
      }
      function g(e) {
        const t = f(e);
        if (t.length > 0 && t[t.length - 1].filename.includes("videojs")) {
          e.fingerprint = ["videojs"];
        }
        return e;
      }
      function f(e) {
        const t = (e.exception && e.exception.values) || [];
        if (t.length > 0) {
          const e = t[0];
          return (e.stacktrace && e.stacktrace.frames) || [];
        }
        return [];
      }
      let h =
        ((d = class e {
          constructor() {
            this.sentryInstance = null;
            this.previousSentryOptions = {};
          }
          setSentryInstance(e) {
            this.sentryInstance = e;
          }
          getSentryInstance() {
            return this.sentryInstance;
          }
          initializeSentry() {
            try {
              this._initializeSentry(...arguments);
            } catch (e) {
              console.error(e);
            }
          }
          _initializeSentry(e) {
            let t =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {};
            const n = Object(i["a"])();
            const r = {
              beforeSend: u,
              dsn: n.third_party.raven_dsn,
              environment: n.env,
              whitelistUrls:
                n.env === "PROD" ? [/udemy\.com/, /udemy\.cn/] : [/./],
              sampleRate: n.env === "PROD" ? 0.05 : 1,
              autoSessionTracking: false,
            };
            e.init(Object.assign(this.previousSentryOptions, r, t));
            Object(s["D"])(
              () => !a["a"].isLoading,
              () => {
                if (a["a"].id) {
                  e.setUser({ id: a["a"].id });
                }
              }
            );
            e.setTag("app_name", n.app_name);
            e.setTag("brand", n.brand ? n.brand.identifier : null);
            e.setTag("js_bundle", n.js_bundle);
            e.setTag(
              "page_key",
              c["a"].page_key || `${n.app_name}-without-page-key`
            );
            this.setSentryInstance(e);
          }
          captureException(e) {
            if (this.sentryInstance) {
              console.error("Sentry.captureException called with:", e);
              this.sentryInstance.captureException(e);
            }
          }
        }),
        babelHelpers.applyDecoratedDescriptor(
          d.prototype,
          "captureException",
          [r["a"]],
          Object.getOwnPropertyDescriptor(d.prototype, "captureException"),
          d.prototype
        ),
        d);
      t["a"] = new h();
    },
    "./src/udemy/js/utils/ud-render-react-components.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return u;
      });
      var r = n("./node_modules/react/index.js");
      var s = n.n(r);
      var o = n("./node_modules/react-dom/index.js");
      var i = n.n(o);
      var a = n("./src/udemy/js/loaders/constants.js");
      var c = n("./src/udemy/js/utils/get-config-data.js");
      const d = Object(c["a"])();
      function u(e, t, n) {
        let r =
          arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : {};
        setTimeout(() => {
          l(e, t, n, r);
        }, 0);
      }
      function l(e, t, n) {
        let r =
          arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : {};
        if (!t.match(/^\.ud-component--[\w-]+--[\w-]+$/)) {
          throw new Error(
            "className should follow the pattern " +
              `.ud-component--{app-name}--{component-name}': received '${t}'`
          );
        }
        const o = p(e, t);
        if (!o.length) {
          return;
        }
        o.forEach((e) => {
          const o = e.dataset.componentProps,
            a = o ? JSON.parse(o) : {},
            c = Object.assign({}, a, r);
          if (n.hasGlobalProviders) {
            c.udData = window.UD;
            c.translations = window.django.catalog;
          }
          if (!n.isIsomorphicComponent || e.dataset.forceRender) {
            i.a.render(s.a.createElement(n, c), e);
            return;
          }
          const u = e.firstChild;
          let l = "";
          if (!u) {
            l =
              `No server-rendered HTML found for "${t}". ` +
              "Did you forget to call {% render_isomorphically %} from a Django template?";
          } else if (u.dataset.isomorphicRenderingFailed) {
            l =
              `Isomorphic rendering failed for "${t}". ` +
              "Falling back to ReactDOM.render.";
          }
          if (l) {
            if (d.env !== "PROD") {
              console.error(l);
            }
            i.a.render(s.a.createElement(n, c), e);
          } else if (!e.dataset.skipHydration) {
            c.serverUniqueId = u.dataset.uniqueId;
            e.removeChild(u);
            i.a.hydrate(s.a.createElement(n, c), e);
          }
        });
        e.addEventListener(a["a"], c);
        function c() {
          p(e, t).forEach((e) => {
            i.a.unmountComponentAtNode(e);
          });
          e.removeEventListener(a["a"], c);
        }
      }
      function p(e, t) {
        const n = Array.from(e.querySelectorAll(t));
        if (e.classList.contains(t.replace(/^\./, ""))) {
          n.unshift(e);
        }
        return n;
      }
    },
    "./src/udemy/js/utils/ud-user-agnostic-tracking-params.js": function (
      e,
      t,
      n
    ) {
      "use strict";
      var r = n("./src/udemy/js/utils/server-or-client.ts");
      t["a"] = r["a"].global.UD.userAgnosticTrackingParams;
    },
    "./src/udemy/js/utils/ud-visiting.js": function (e, t, n) {
      "use strict";
      n.d(t, "b", function () {
        return o;
      });
      var r = n("./src/udemy/js/utils/create-ud-proxy.js");
      const s = Object(r["a"])("visiting", "visitingProperties");
      o();
      t["a"] = s;
      function o() {
        if (
          UD.visiting &&
          !UD.visiting.isLoading &&
          UD.visiting.first_visit_time
        ) {
          UD.visiting.first_visit_time = new Date(UD.visiting.first_visit_time);
        }
      }
    },
    "./src/udemy/js/utils/ud-visitor-uuid.js": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return a;
      });
      var r = n("./node_modules/js-cookie/src/js.cookie.js");
      var s = n.n(r);
      var o = n("./src/udemy/js/utils/ud-visiting.js");
      const i = "__udmy_2_v57r";
      function a() {
        if (o["a"].isLoading) {
          return null;
        }
        return o["a"].visitor_uuid || s.a.get(i) || null;
      }
      function c() {
        if (o["a"].isLoading) {
          return;
        }
        UD.visiting.visitor_uuid = null;
        s.a.remove(i, {
          path: "/",
          domain: window.location.hostname.replace("www", ""),
        });
      }
    },
    "./src/udemy/js/utils/with-global-providers.tsx": function (e, t, n) {
      "use strict";
      n.d(t, "c", function () {
        return p;
      });
      n.d(t, "a", function () {
        return m;
      });
      n.d(t, "b", function () {
        return f;
      });
      var r = n("./node_modules/@udemy/browse-course/dist/esm/index.js");
      var s = n("./node_modules/@udemy/i18n/dist/esm/index.js");
      var o = n(
        "./node_modules/@udemy/store-provider/dist/esm/store-context.js"
      );
      var i = n("./node_modules/@udemy/ud-data/dist/esm/index.js");
      var a = n("./node_modules/prop-types/index.js");
      var c = n.n(a);
      var d = n("./node_modules/react/index.js");
      var u = n.n(d);
      var l =
        (undefined && undefined.__rest) ||
        function (e, t) {
          var n = {};
          for (var r in e)
            if (Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0)
              n[r] = e[r];
          if (e != null && typeof Object.getOwnPropertySymbols === "function")
            for (
              var s = 0, r = Object.getOwnPropertySymbols(e);
              s < r.length;
              s++
            ) {
              if (
                t.indexOf(r[s]) < 0 &&
                Object.prototype.propertyIsEnumerable.call(e, r[s])
              )
                n[r[s]] = e[r[s]];
            }
          return n;
        };
      const p = (e) => {
        var t;
        const n = (t) => {
          var n, a;
          var { translations: c, udData: p } = t,
            m = l(t, ["translations", "udData"]);
          const g =
            (n = p.request.locale) !== null && n !== void 0 ? n : "en_US";
          const f =
            (a = p.request.language) !== null && a !== void 0 ? a : "en";
          const [h] = Object(d["useState"])(() => new r["m"]());
          const v = [h];
          return u.a.createElement(
            s["a"],
            { locale: g, lang: f, translations: c },
            u.a.createElement(
              i["b"],
              { data: p, useBridge: true },
              u.a.createElement(o["b"], { stores: v }, u.a.createElement(e, m))
            )
          );
        };
        n.propTypes = Object.assign(Object.assign({}, e.propTypes), {
          udData: c.a.object.isRequired,
          translations: c.a.object.isRequired,
        });
        n.displayName = `${
          (t = e.displayName) !== null && t !== void 0 ? t : e.name
        }WithGlobalProviders`;
        n.isIsomorphicComponent = e.isIsomorphicComponent;
        n.hasGlobalProviders = true;
        return n;
      };
      function m() {
        Object.assign(globalThis, {
          _STORES: { CoursePriceStore: new r["m"]() },
        });
      }
      function g() {
        Object.assign(globalThis, { _STORES: undefined });
      }
      function f(e) {
        const t = globalThis._STORES;
        return t[e];
      }
    },
    "./webpack/babel/external-helpers.js": function (e, t, n) {
      (function (e) {
        (function (e) {
          var t = (e.babelHelpers = {});
          function n(e, t, n, r) {
            return {
              getMetadata: function (s) {
                i(r, "getMetadata"), a(s);
                var o = e[s];
                if (void 0 !== o)
                  if (1 === t) {
                    var c = o.public;
                    if (void 0 !== c) return c[n];
                  } else if (2 === t) {
                    var d = o.private;
                    if (void 0 !== d) return d.get(n);
                  } else if (Object.hasOwnProperty.call(o, "constructor"))
                    return o.constructor;
              },
              setMetadata: function (s, o) {
                i(r, "setMetadata"), a(s);
                var c = e[s];
                if ((void 0 === c && (c = e[s] = {}), 1 === t)) {
                  var d = c.public;
                  void 0 === d && (d = c.public = {}), (d[n] = o);
                } else if (2 === t) {
                  var u = c.priv;
                  void 0 === u && (u = c.private = new Map()), u.set(n, o);
                } else c.constructor = o;
              },
            };
          }
          function r(e, t) {
            var n = e[Symbol.metadata || Symbol.for("Symbol.metadata")],
              r = Object.getOwnPropertySymbols(t);
            if (0 !== r.length) {
              for (var s = 0; s < r.length; s++) {
                var o = r[s],
                  i = t[o],
                  a = n ? n[o] : null,
                  c = i.public,
                  d = a ? a.public : null;
                c && d && Object.setPrototypeOf(c, d);
                var u = i.private;
                if (u) {
                  var l = Array.from(u.values()),
                    p = a ? a.private : null;
                  p && (l = l.concat(p)), (i.private = l);
                }
                a && Object.setPrototypeOf(i, a);
              }
              n && Object.setPrototypeOf(t, n),
                (e[Symbol.metadata || Symbol.for("Symbol.metadata")] = t);
            }
          }
          function s(e, t) {
            return function (n) {
              i(t, "addInitializer"), c(n, "An initializer"), e.push(n);
            };
          }
          function o(e, t, r, o, i, a, c, d, u) {
            var l;
            switch (a) {
              case 1:
                l = "accessor";
                break;
              case 2:
                l = "method";
                break;
              case 3:
                l = "getter";
                break;
              case 4:
                l = "setter";
                break;
              default:
                l = "field";
            }
            var p,
              m,
              g = { kind: l, name: d ? "#" + t : t, isStatic: c, isPrivate: d },
              f = { v: !1 };
            if ((0 !== a && (g.addInitializer = s(i, f)), d)) {
              (p = 2), (m = Symbol(t));
              var h = {};
              0 === a
                ? ((h.get = r.get), (h.set = r.set))
                : 2 === a
                ? (h.get = function () {
                    return r.value;
                  })
                : ((1 !== a && 3 !== a) ||
                    (h.get = function () {
                      return r.get.call(this);
                    }),
                  (1 !== a && 4 !== a) ||
                    (h.set = function (e) {
                      r.set.call(this, e);
                    })),
                (g.access = h);
            } else (p = 1), (m = t);
            try {
              return e(u, Object.assign(g, n(o, p, m, f)));
            } finally {
              f.v = !0;
            }
          }
          function i(e, t) {
            if (e.v)
              throw new Error(
                "attempted to call " + t + " after decoration was finished"
              );
          }
          function a(e) {
            if ("symbol" != typeof e)
              throw new TypeError(
                "Metadata keys must be symbols, received: " + e
              );
          }
          function c(e, t) {
            if ("function" != typeof e)
              throw new TypeError(t + " must be a function");
          }
          function d(e, t) {
            var n = typeof t;
            if (1 === e) {
              if ("object" !== n || null === t)
                throw new TypeError(
                  "accessor decorators must return an object with get, set, or init properties or void 0"
                );
              void 0 !== t.get && c(t.get, "accessor.get"),
                void 0 !== t.set && c(t.set, "accessor.set"),
                void 0 !== t.init && c(t.init, "accessor.init"),
                void 0 !== t.initializer &&
                  c(t.initializer, "accessor.initializer");
            } else if ("function" !== n) {
              var r;
              throw (
                ((r = 0 === e ? "field" : 10 === e ? "class" : "method"),
                new TypeError(
                  r + " decorators must return a function or void 0"
                ))
              );
            }
          }
          function u(e) {
            var t;
            return (
              null == (t = e.init) &&
                (t = e.initializer) &&
                "undefined" != typeof console &&
                console.warn(
                  ".initializer has been renamed to .init as of March 2022"
                ),
              t
            );
          }
          function l(e, t, n, r, s, i, a, c, l) {
            var p,
              m,
              g,
              f,
              h,
              v,
              y = n[0];
            if (
              (a
                ? (p =
                    0 === s || 1 === s
                      ? { get: n[3], set: n[4] }
                      : 3 === s
                      ? { get: n[3] }
                      : 4 === s
                      ? { set: n[3] }
                      : { value: n[3] })
                : 0 !== s && (p = Object.getOwnPropertyDescriptor(t, r)),
              1 === s
                ? (g = { get: p.get, set: p.set })
                : 2 === s
                ? (g = p.value)
                : 3 === s
                ? (g = p.get)
                : 4 === s && (g = p.set),
              "function" == typeof y)
            )
              void 0 !== (f = o(y, r, p, c, l, s, i, a, g)) &&
                (d(s, f),
                0 === s
                  ? (m = f)
                  : 1 === s
                  ? ((m = u(f)),
                    (h = f.get || g.get),
                    (v = f.set || g.set),
                    (g = { get: h, set: v }))
                  : (g = f));
            else
              for (var b = y.length - 1; b >= 0; b--) {
                var _;
                if (void 0 !== (f = o(y[b], r, p, c, l, s, i, a, g)))
                  d(s, f),
                    0 === s
                      ? (_ = f)
                      : 1 === s
                      ? ((_ = u(f)),
                        (h = f.get || g.get),
                        (v = f.set || g.set),
                        (g = { get: h, set: v }))
                      : (g = f),
                    void 0 !== _ &&
                      (void 0 === m
                        ? (m = _)
                        : "function" == typeof m
                        ? (m = [m, _])
                        : m.push(_));
              }
            if (0 === s || 1 === s) {
              if (void 0 === m)
                m = function (e, t) {
                  return t;
                };
              else if ("function" != typeof m) {
                var j = m;
                m = function (e, t) {
                  for (var n = t, r = 0; r < j.length; r++) n = j[r].call(e, n);
                  return n;
                };
              } else {
                var w = m;
                m = function (e, t) {
                  return w.call(e, t);
                };
              }
              e.push(m);
            }
            0 !== s &&
              (1 === s
                ? ((p.get = g.get), (p.set = g.set))
                : 2 === s
                ? (p.value = g)
                : 3 === s
                ? (p.get = g)
                : 4 === s && (p.set = g),
              a
                ? 1 === s
                  ? (e.push(function (e, t) {
                      return g.get.call(e, t);
                    }),
                    e.push(function (e, t) {
                      return g.set.call(e, t);
                    }))
                  : 2 === s
                  ? e.push(g)
                  : e.push(function (e, t) {
                      return g.call(e, t);
                    })
                : Object.defineProperty(t, r, p));
          }
          function p(e, t, n, r, s) {
            for (
              var o, i, a = new Map(), c = new Map(), d = 0;
              d < s.length;
              d++
            ) {
              var u = s[d];
              if (Array.isArray(u)) {
                var p,
                  g,
                  f,
                  h = u[1],
                  v = u[2],
                  y = u.length > 3,
                  b = h >= 5;
                if (
                  (b
                    ? ((p = t), (g = r), 0 !== (h -= 5) && (f = i = i || []))
                    : ((p = t.prototype),
                      (g = n),
                      0 !== h && (f = o = o || [])),
                  0 !== h && !y)
                ) {
                  var _ = b ? c : a,
                    j = _.get(v) || 0;
                  if (!0 === j || (3 === j && 4 !== h) || (4 === j && 3 !== h))
                    throw new Error(
                      "Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " +
                        v
                    );
                  !j && h > 2 ? _.set(v, h) : _.set(v, !0);
                }
                l(e, p, u, v, h, b, y, g, f);
              }
            }
            m(e, o), m(e, i);
          }
          function m(e, t) {
            t &&
              e.push(function (e) {
                for (var n = 0; n < t.length; n++) t[n].call(e);
                return e;
              });
          }
          function g(e, t, r, o) {
            if (o.length > 0) {
              for (
                var i = [], a = t, c = t.name, u = o.length - 1;
                u >= 0;
                u--
              ) {
                var l = { v: !1 };
                try {
                  var p = Object.assign(
                      { kind: "class", name: c, addInitializer: s(i, l) },
                      n(r, 0, c, l)
                    ),
                    m = o[u](a, p);
                } finally {
                  l.v = !0;
                }
                void 0 !== m && (d(10, m), (a = m));
              }
              e.push(a, function () {
                for (var e = 0; e < i.length; e++) i[e].call(a);
              });
            }
          }
          function f(e, t, n) {
            var s = [],
              o = {},
              i = {};
            return (
              p(s, e, i, o, t), r(e.prototype, i), g(s, e, o, n), r(e, o), s
            );
          }
          t.applyDecs = f;
          function h(e) {
            var t,
              n,
              r,
              s = 2;
            for (
              "undefined" != typeof Symbol &&
              ((n = Symbol.asyncIterator), (r = Symbol.iterator));
              s--;

            ) {
              if (n && null != (t = e[n])) return t.call(e);
              if (r && null != (t = e[r])) return new v(t.call(e));
              (n = "@@asyncIterator"), (r = "@@iterator");
            }
            throw new TypeError("Object is not async iterable");
          }
          function v(e) {
            function t(e) {
              if (Object(e) !== e)
                return Promise.reject(new TypeError(e + " is not an object."));
              var t = e.done;
              return Promise.resolve(e.value).then(function (e) {
                return { value: e, done: t };
              });
            }
            return (
              (v = function (e) {
                (this.s = e), (this.n = e.next);
              }),
              (v.prototype = {
                s: null,
                n: null,
                next: function () {
                  return t(this.n.apply(this.s, arguments));
                },
                return: function (e) {
                  var n = this.s.return;
                  return void 0 === n
                    ? Promise.resolve({ value: e, done: !0 })
                    : t(n.apply(this.s, arguments));
                },
                throw: function (e) {
                  var n = this.s.return;
                  return void 0 === n
                    ? Promise.reject(e)
                    : t(n.apply(this.s, arguments));
                },
              }),
              new v(e)
            );
          }
          t.asyncIterator = h;
          var y;
          function b(e, t, n, r) {
            y ||
              (y =
                ("function" == typeof Symbol &&
                  Symbol.for &&
                  Symbol.for("react.element")) ||
                60103);
            var s = e && e.defaultProps,
              o = arguments.length - 3;
            if ((t || 0 === o || (t = { children: void 0 }), 1 === o))
              t.children = r;
            else if (o > 1) {
              for (var i = new Array(o), a = 0; a < o; a++)
                i[a] = arguments[a + 3];
              t.children = i;
            }
            if (t && s) for (var c in s) void 0 === t[c] && (t[c] = s[c]);
            else t || (t = s || {});
            return {
              $$typeof: y,
              type: e,
              key: void 0 === n ? null : "" + n,
              ref: null,
              props: t,
              _owner: null,
            };
          }
          t.jsx = b;
          function _(e, t) {
            var n = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
              var r = Object.getOwnPropertySymbols(e);
              t &&
                (r = r.filter(function (t) {
                  return Object.getOwnPropertyDescriptor(e, t).enumerable;
                })),
                n.push.apply(n, r);
            }
            return n;
          }
          function j(e) {
            for (var n = 1; n < arguments.length; n++) {
              var r = null != arguments[n] ? arguments[n] : {};
              n % 2
                ? _(Object(r), !0).forEach(function (n) {
                    t.defineProperty(e, n, r[n]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(r)
                  )
                : _(Object(r)).forEach(function (t) {
                    Object.defineProperty(
                      e,
                      t,
                      Object.getOwnPropertyDescriptor(r, t)
                    );
                  });
            }
            return e;
          }
          t.objectSpread2 = j;
          function w() {
            "use strict";
            t.regeneratorRuntime = w = function () {
              return e;
            };
            var e = {},
              n = Object.prototype,
              r = n.hasOwnProperty,
              s = "function" == typeof Symbol ? Symbol : {},
              o = s.iterator || "@@iterator",
              i = s.asyncIterator || "@@asyncIterator",
              a = s.toStringTag || "@@toStringTag";
            function c(e, t, n) {
              return (
                Object.defineProperty(e, t, {
                  value: n,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                }),
                e[t]
              );
            }
            try {
              c({}, "");
            } catch (e) {
              c = function (e, t, n) {
                return (e[t] = n);
              };
            }
            function d(e, t, n, r) {
              var s = t && t.prototype instanceof p ? t : p,
                o = Object.create(s.prototype),
                i = new O(r || []);
              return (
                (o._invoke = (function (e, t, n) {
                  var r = "suspendedStart";
                  return function (s, o) {
                    if ("executing" === r)
                      throw new Error("Generator is already running");
                    if ("completed" === r) {
                      if ("throw" === s) throw o;
                      return C();
                    }
                    for (n.method = s, n.arg = o; ; ) {
                      var i = n.delegate;
                      if (i) {
                        var a = j(i, n);
                        if (a) {
                          if (a === l) continue;
                          return a;
                        }
                      }
                      if ("next" === n.method) n.sent = n._sent = n.arg;
                      else if ("throw" === n.method) {
                        if ("suspendedStart" === r)
                          throw ((r = "completed"), n.arg);
                        n.dispatchException(n.arg);
                      } else "return" === n.method && n.abrupt("return", n.arg);
                      r = "executing";
                      var c = u(e, t, n);
                      if ("normal" === c.type) {
                        if (
                          ((r = n.done ? "completed" : "suspendedYield"),
                          c.arg === l)
                        )
                          continue;
                        return { value: c.arg, done: n.done };
                      }
                      "throw" === c.type &&
                        ((r = "completed"),
                        (n.method = "throw"),
                        (n.arg = c.arg));
                    }
                  };
                })(e, n, i)),
                o
              );
            }
            function u(e, t, n) {
              try {
                return { type: "normal", arg: e.call(t, n) };
              } catch (e) {
                return { type: "throw", arg: e };
              }
            }
            e.wrap = d;
            var l = {};
            function p() {}
            function m() {}
            function g() {}
            var f = {};
            c(f, o, function () {
              return this;
            });
            var h = Object.getPrototypeOf,
              v = h && h(h(E([])));
            v && v !== n && r.call(v, o) && (f = v);
            var y = (g.prototype = p.prototype = Object.create(f));
            function b(e) {
              ["next", "throw", "return"].forEach(function (t) {
                c(e, t, function (e) {
                  return this._invoke(t, e);
                });
              });
            }
            function _(e, t) {
              function n(s, o, i, a) {
                var c = u(e[s], e, o);
                if ("throw" !== c.type) {
                  var d = c.arg,
                    l = d.value;
                  return l && "object" == typeof l && r.call(l, "__await")
                    ? t.resolve(l.__await).then(
                        function (e) {
                          n("next", e, i, a);
                        },
                        function (e) {
                          n("throw", e, i, a);
                        }
                      )
                    : t.resolve(l).then(
                        function (e) {
                          (d.value = e), i(d);
                        },
                        function (e) {
                          return n("throw", e, i, a);
                        }
                      );
                }
                a(c.arg);
              }
              var s;
              this._invoke = function (e, r) {
                function o() {
                  return new t(function (t, s) {
                    n(e, r, t, s);
                  });
                }
                return (s = s ? s.then(o, o) : o());
              };
            }
            function j(e, t) {
              var n = e.iterator[t.method];
              if (undefined === n) {
                if (((t.delegate = null), "throw" === t.method)) {
                  if (
                    e.iterator.return &&
                    ((t.method = "return"),
                    (t.arg = undefined),
                    j(e, t),
                    "throw" === t.method)
                  )
                    return l;
                  (t.method = "throw"),
                    (t.arg = new TypeError(
                      "The iterator does not provide a 'throw' method"
                    ));
                }
                return l;
              }
              var r = u(n, e.iterator, t.arg);
              if ("throw" === r.type)
                return (
                  (t.method = "throw"), (t.arg = r.arg), (t.delegate = null), l
                );
              var s = r.arg;
              return s
                ? s.done
                  ? ((t[e.resultName] = s.value),
                    (t.next = e.nextLoc),
                    "return" !== t.method &&
                      ((t.method = "next"), (t.arg = undefined)),
                    (t.delegate = null),
                    l)
                  : s
                : ((t.method = "throw"),
                  (t.arg = new TypeError("iterator result is not an object")),
                  (t.delegate = null),
                  l);
            }
            function x(e) {
              var t = { tryLoc: e[0] };
              1 in e && (t.catchLoc = e[1]),
                2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
                this.tryEntries.push(t);
            }
            function k(e) {
              var t = e.completion || {};
              (t.type = "normal"), delete t.arg, (e.completion = t);
            }
            function O(e) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                e.forEach(x, this),
                this.reset(!0);
            }
            function E(e) {
              if (e) {
                var t = e[o];
                if (t) return t.call(e);
                if ("function" == typeof e.next) return e;
                if (!isNaN(e.length)) {
                  var n = -1,
                    s = function t() {
                      for (; ++n < e.length; )
                        if (r.call(e, n))
                          return (t.value = e[n]), (t.done = !1), t;
                      return (t.value = undefined), (t.done = !0), t;
                    };
                  return (s.next = s);
                }
              }
              return { next: C };
            }
            function C() {
              return { value: undefined, done: !0 };
            }
            return (
              (m.prototype = g),
              c(y, "constructor", g),
              c(g, "constructor", m),
              (m.displayName = c(g, a, "GeneratorFunction")),
              (e.isGeneratorFunction = function (e) {
                var t = "function" == typeof e && e.constructor;
                return (
                  !!t &&
                  (t === m || "GeneratorFunction" === (t.displayName || t.name))
                );
              }),
              (e.mark = function (e) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(e, g)
                    : ((e.__proto__ = g), c(e, a, "GeneratorFunction")),
                  (e.prototype = Object.create(y)),
                  e
                );
              }),
              (e.awrap = function (e) {
                return { __await: e };
              }),
              b(_.prototype),
              c(_.prototype, i, function () {
                return this;
              }),
              (e.AsyncIterator = _),
              (e.async = function (t, n, r, s, o) {
                void 0 === o && (o = Promise);
                var i = new _(d(t, n, r, s), o);
                return e.isGeneratorFunction(n)
                  ? i
                  : i.next().then(function (e) {
                      return e.done ? e.value : i.next();
                    });
              }),
              b(y),
              c(y, a, "Generator"),
              c(y, o, function () {
                return this;
              }),
              c(y, "toString", function () {
                return "[object Generator]";
              }),
              (e.keys = function (e) {
                var t = [];
                for (var n in e) t.push(n);
                return (
                  t.reverse(),
                  function n() {
                    for (; t.length; ) {
                      var r = t.pop();
                      if (r in e) return (n.value = r), (n.done = !1), n;
                    }
                    return (n.done = !0), n;
                  }
                );
              }),
              (e.values = E),
              (O.prototype = {
                constructor: O,
                reset: function (e) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = undefined),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = undefined),
                    this.tryEntries.forEach(k),
                    !e)
                  )
                    for (var t in this)
                      "t" === t.charAt(0) &&
                        r.call(this, t) &&
                        !isNaN(+t.slice(1)) &&
                        (this[t] = undefined);
                },
                stop: function () {
                  this.done = !0;
                  var e = this.tryEntries[0].completion;
                  if ("throw" === e.type) throw e.arg;
                  return this.rval;
                },
                dispatchException: function (e) {
                  if (this.done) throw e;
                  var t = this;
                  function n(n, r) {
                    return (
                      (i.type = "throw"),
                      (i.arg = e),
                      (t.next = n),
                      r && ((t.method = "next"), (t.arg = undefined)),
                      !!r
                    );
                  }
                  for (var s = this.tryEntries.length - 1; s >= 0; --s) {
                    var o = this.tryEntries[s],
                      i = o.completion;
                    if ("root" === o.tryLoc) return n("end");
                    if (o.tryLoc <= this.prev) {
                      var a = r.call(o, "catchLoc"),
                        c = r.call(o, "finallyLoc");
                      if (a && c) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                        if (this.prev < o.finallyLoc) return n(o.finallyLoc);
                      } else if (a) {
                        if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                      } else {
                        if (!c)
                          throw new Error(
                            "try statement without catch or finally"
                          );
                        if (this.prev < o.finallyLoc) return n(o.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (e, t) {
                  for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                    var s = this.tryEntries[n];
                    if (
                      s.tryLoc <= this.prev &&
                      r.call(s, "finallyLoc") &&
                      this.prev < s.finallyLoc
                    ) {
                      var o = s;
                      break;
                    }
                  }
                  o &&
                    ("break" === e || "continue" === e) &&
                    o.tryLoc <= t &&
                    t <= o.finallyLoc &&
                    (o = null);
                  var i = o ? o.completion : {};
                  return (
                    (i.type = e),
                    (i.arg = t),
                    o
                      ? ((this.method = "next"), (this.next = o.finallyLoc), l)
                      : this.complete(i)
                  );
                },
                complete: function (e, t) {
                  if ("throw" === e.type) throw e.arg;
                  return (
                    "break" === e.type || "continue" === e.type
                      ? (this.next = e.arg)
                      : "return" === e.type
                      ? ((this.rval = this.arg = e.arg),
                        (this.method = "return"),
                        (this.next = "end"))
                      : "normal" === e.type && t && (this.next = t),
                    l
                  );
                },
                finish: function (e) {
                  for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                    var n = this.tryEntries[t];
                    if (n.finallyLoc === e)
                      return this.complete(n.completion, n.afterLoc), k(n), l;
                  }
                },
                catch: function (e) {
                  for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                    var n = this.tryEntries[t];
                    if (n.tryLoc === e) {
                      var r = n.completion;
                      if ("throw" === r.type) {
                        var s = r.arg;
                        k(n);
                      }
                      return s;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (e, t, n) {
                  return (
                    (this.delegate = {
                      iterator: E(e),
                      resultName: t,
                      nextLoc: n,
                    }),
                    "next" === this.method && (this.arg = undefined),
                    l
                  );
                },
              }),
              e
            );
          }
          t.regeneratorRuntime = w;
          function x(e) {
            "@babel/helpers - typeof";
            return (
              (t.typeof = x =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (e) {
                      return typeof e;
                    }
                  : function (e) {
                      return e &&
                        "function" == typeof Symbol &&
                        e.constructor === Symbol &&
                        e !== Symbol.prototype
                        ? "symbol"
                        : typeof e;
                    }),
              x(e)
            );
          }
          t.typeof = x;
          function k() {
            t.wrapRegExp = k = function (e, t) {
              return new r(e, void 0, t);
            };
            var e = RegExp.prototype,
              n = new WeakMap();
            function r(e, s, o) {
              var i = new RegExp(e, s);
              return n.set(i, o || n.get(e)), t.setPrototypeOf(i, r.prototype);
            }
            function s(e, t) {
              var r = n.get(t);
              return Object.keys(r).reduce(function (t, n) {
                return (t[n] = e[r[n]]), t;
              }, Object.create(null));
            }
            return (
              t.inherits(r, RegExp),
              (r.prototype.exec = function (t) {
                var n = e.exec.call(this, t);
                return n && (n.groups = s(n, this)), n;
              }),
              (r.prototype[Symbol.replace] = function (t, r) {
                if ("string" == typeof r) {
                  var o = n.get(this);
                  return e[Symbol.replace].call(
                    this,
                    t,
                    r.replace(/\$<([^>]+)>/g, function (e, t) {
                      return "$" + o[t];
                    })
                  );
                }
                if ("function" == typeof r) {
                  var i = this;
                  return e[Symbol.replace].call(this, t, function () {
                    var e = arguments;
                    return (
                      "object" != typeof e[e.length - 1] &&
                        (e = [].slice.call(e)).push(s(e, i)),
                      r.apply(this, e)
                    );
                  });
                }
                return e[Symbol.replace].call(this, t, r);
              }),
              k.apply(this, arguments)
            );
          }
          t.wrapRegExp = k;
          function O(e) {
            this.wrapped = e;
          }
          t.AwaitValue = O;
          function E(e) {
            var n, r;
            function s(e, t) {
              return new Promise(function (s, i) {
                var a = { key: e, arg: t, resolve: s, reject: i, next: null };
                if (r) {
                  r = r.next = a;
                } else {
                  n = r = a;
                  o(e, t);
                }
              });
            }
            function o(n, r) {
              try {
                var s = e[n](r);
                var a = s.value;
                var c = a instanceof t.AwaitValue;
                Promise.resolve(c ? a.wrapped : a).then(
                  function (e) {
                    if (c) {
                      o(n === "return" ? "return" : "next", e);
                      return;
                    }
                    i(s.done ? "return" : "normal", e);
                  },
                  function (e) {
                    o("throw", e);
                  }
                );
              } catch (e) {
                i("throw", e);
              }
            }
            function i(e, t) {
              switch (e) {
                case "return":
                  n.resolve({ value: t, done: true });
                  break;
                case "throw":
                  n.reject(t);
                  break;
                default:
                  n.resolve({ value: t, done: false });
                  break;
              }
              n = n.next;
              if (n) {
                o(n.key, n.arg);
              } else {
                r = null;
              }
            }
            this._invoke = s;
            if (typeof e.return !== "function") {
              this.return = undefined;
            }
          }
          E.prototype[
            (typeof Symbol === "function" && Symbol.asyncIterator) ||
              "@@asyncIterator"
          ] = function () {
            return this;
          };
          E.prototype.next = function (e) {
            return this._invoke("next", e);
          };
          E.prototype.throw = function (e) {
            return this._invoke("throw", e);
          };
          E.prototype.return = function (e) {
            return this._invoke("return", e);
          };
          t.AsyncGenerator = E;
          function C(e) {
            return function () {
              return new t.AsyncGenerator(e.apply(this, arguments));
            };
          }
          t.wrapAsyncGenerator = C;
          function S(e) {
            return new t.AwaitValue(e);
          }
          t.awaitAsyncGenerator = S;
          function T(e, t) {
            var n = {},
              r = false;
            function s(n, s) {
              r = true;
              s = new Promise(function (t) {
                t(e[n](s));
              });
              return { done: false, value: t(s) };
            }
            n[
              (typeof Symbol !== "undefined" && Symbol.iterator) || "@@iterator"
            ] = function () {
              return this;
            };
            n.next = function (e) {
              if (r) {
                r = false;
                return e;
              }
              return s("next", e);
            };
            if (typeof e.throw === "function") {
              n.throw = function (e) {
                if (r) {
                  r = false;
                  throw e;
                }
                return s("throw", e);
              };
            }
            if (typeof e.return === "function") {
              n.return = function (e) {
                if (r) {
                  r = false;
                  return e;
                }
                return s("return", e);
              };
            }
            return n;
          }
          t.asyncGeneratorDelegate = T;
          function I(e, t, n, r, s, o, i) {
            try {
              var a = e[o](i);
              var c = a.value;
            } catch (e) {
              n(e);
              return;
            }
            if (a.done) {
              t(c);
            } else {
              Promise.resolve(c).then(r, s);
            }
          }
          function P(e) {
            return function () {
              var t = this,
                n = arguments;
              return new Promise(function (r, s) {
                var o = e.apply(t, n);
                function i(e) {
                  I(o, r, s, i, a, "next", e);
                }
                function a(e) {
                  I(o, r, s, i, a, "throw", e);
                }
                i(undefined);
              });
            };
          }
          t.asyncToGenerator = P;
          function D(e, t) {
            if (!(e instanceof t)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          t.classCallCheck = D;
          function A(e, t) {
            for (var n = 0; n < t.length; n++) {
              var r = t[n];
              r.enumerable = r.enumerable || false;
              r.configurable = true;
              if ("value" in r) r.writable = true;
              Object.defineProperty(e, r.key, r);
            }
          }
          function N(e, t, n) {
            if (t) A(e.prototype, t);
            if (n) A(e, n);
            Object.defineProperty(e, "prototype", { writable: false });
            return e;
          }
          t.createClass = N;
          function R(e, t) {
            for (var n in t) {
              var r = t[n];
              r.configurable = r.enumerable = true;
              if ("value" in r) r.writable = true;
              Object.defineProperty(e, n, r);
            }
            if (Object.getOwnPropertySymbols) {
              var s = Object.getOwnPropertySymbols(t);
              for (var o = 0; o < s.length; o++) {
                var i = s[o];
                var r = t[i];
                r.configurable = r.enumerable = true;
                if ("value" in r) r.writable = true;
                Object.defineProperty(e, i, r);
              }
            }
            return e;
          }
          t.defineEnumerableProperties = R;
          function L(e, t) {
            var n = Object.getOwnPropertyNames(t);
            for (var r = 0; r < n.length; r++) {
              var s = n[r];
              var o = Object.getOwnPropertyDescriptor(t, s);
              if (o && o.configurable && e[s] === undefined) {
                Object.defineProperty(e, s, o);
              }
            }
            return e;
          }
          t.defaults = L;
          function z(e, t, n) {
            if (t in e) {
              Object.defineProperty(e, t, {
                value: n,
                enumerable: true,
                configurable: true,
                writable: true,
              });
            } else {
              e[t] = n;
            }
            return e;
          }
          t.defineProperty = z;
          function U() {
            t.extends = U =
              Object.assign ||
              function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var n = arguments[t];
                  for (var r in n) {
                    if (Object.prototype.hasOwnProperty.call(n, r)) {
                      e[r] = n[r];
                    }
                  }
                }
                return e;
              };
            return U.apply(this, arguments);
          }
          t.extends = U;
          function F(e) {
            for (var n = 1; n < arguments.length; n++) {
              var r = arguments[n] != null ? Object(arguments[n]) : {};
              var s = Object.keys(r);
              if (typeof Object.getOwnPropertySymbols === "function") {
                s.push.apply(
                  s,
                  Object.getOwnPropertySymbols(r).filter(function (e) {
                    return Object.getOwnPropertyDescriptor(r, e).enumerable;
                  })
                );
              }
              s.forEach(function (n) {
                t.defineProperty(e, n, r[n]);
              });
            }
            return e;
          }
          t.objectSpread = F;
          function M(e, n) {
            if (typeof n !== "function" && n !== null) {
              throw new TypeError(
                "Super expression must either be null or a function"
              );
            }
            e.prototype = Object.create(n && n.prototype, {
              constructor: { value: e, writable: true, configurable: true },
            });
            Object.defineProperty(e, "prototype", { writable: false });
            if (n) t.setPrototypeOf(e, n);
          }
          t.inherits = M;
          function $(e, n) {
            e.prototype = Object.create(n.prototype);
            e.prototype.constructor = e;
            t.setPrototypeOf(e, n);
          }
          t.inheritsLoose = $;
          function B(e) {
            t.getPrototypeOf = B = Object.setPrototypeOf
              ? Object.getPrototypeOf
              : function e(t) {
                  return t.__proto__ || Object.getPrototypeOf(t);
                };
            return B(e);
          }
          t.getPrototypeOf = B;
          function q(e, n) {
            t.setPrototypeOf = q =
              Object.setPrototypeOf ||
              function e(t, n) {
                t.__proto__ = n;
                return t;
              };
            return q(e, n);
          }
          t.setPrototypeOf = q;
          function W() {
            if (typeof Reflect === "undefined" || !Reflect.construct)
              return false;
            if (Reflect.construct.sham) return false;
            if (typeof Proxy === "function") return true;
            try {
              Boolean.prototype.valueOf.call(
                Reflect.construct(Boolean, [], function () {})
              );
              return true;
            } catch (e) {
              return false;
            }
          }
          t.isNativeReflectConstruct = W;
          function G(e, n, r) {
            if (t.isNativeReflectConstruct()) {
              t.construct = G = Reflect.construct;
            } else {
              t.construct = G = function e(n, r, s) {
                var o = [null];
                o.push.apply(o, r);
                var i = Function.bind.apply(n, o);
                var a = new i();
                if (s) t.setPrototypeOf(a, s.prototype);
                return a;
              };
            }
            return G.apply(null, arguments);
          }
          t.construct = G;
          function H(e) {
            return Function.toString.call(e).indexOf("[native code]") !== -1;
          }
          t.isNativeFunction = H;
          function V(e) {
            var n = typeof Map === "function" ? new Map() : undefined;
            t.wrapNativeSuper = V = function e(r) {
              if (r === null || !t.isNativeFunction(r)) return r;
              if (typeof r !== "function") {
                throw new TypeError(
                  "Super expression must either be null or a function"
                );
              }
              if (typeof n !== "undefined") {
                if (n.has(r)) return n.get(r);
                n.set(r, s);
              }
              function s() {
                return t.construct(
                  r,
                  arguments,
                  t.getPrototypeOf(this).constructor
                );
              }
              s.prototype = Object.create(r.prototype, {
                constructor: {
                  value: s,
                  enumerable: false,
                  writable: true,
                  configurable: true,
                },
              });
              return t.setPrototypeOf(s, r);
            };
            return V(e);
          }
          t.wrapNativeSuper = V;
          function K(e, t) {
            if (
              t != null &&
              typeof Symbol !== "undefined" &&
              t[Symbol.hasInstance]
            ) {
              return !!t[Symbol.hasInstance](e);
            } else {
              return e instanceof t;
            }
          }
          t.instanceof = K;
          function Y(e) {
            return e && e.__esModule ? e : { default: e };
          }
          t.interopRequireDefault = Y;
          function J(e) {
            if (typeof WeakMap !== "function") return null;
            var t = new WeakMap();
            var n = new WeakMap();
            return (J = function (e) {
              return e ? n : t;
            })(e);
          }
          function X(e, t) {
            if (!t && e && e.__esModule) {
              return e;
            }
            if (
              e === null ||
              (typeof e !== "object" && typeof e !== "function")
            ) {
              return { default: e };
            }
            var n = J(t);
            if (n && n.has(e)) {
              return n.get(e);
            }
            var r = {};
            var s = Object.defineProperty && Object.getOwnPropertyDescriptor;
            for (var o in e) {
              if (
                o !== "default" &&
                Object.prototype.hasOwnProperty.call(e, o)
              ) {
                var i = s ? Object.getOwnPropertyDescriptor(e, o) : null;
                if (i && (i.get || i.set)) {
                  Object.defineProperty(r, o, i);
                } else {
                  r[o] = e[o];
                }
              }
            }
            r.default = e;
            if (n) {
              n.set(e, r);
            }
            return r;
          }
          t.interopRequireWildcard = X;
          function Z(e, t) {
            if (e !== t) {
              throw new TypeError("Cannot instantiate an arrow function");
            }
          }
          t.newArrowCheck = Z;
          function Q(e) {
            if (e == null) throw new TypeError("Cannot destructure undefined");
          }
          t.objectDestructuringEmpty = Q;
          function ee(e, t) {
            if (e == null) return {};
            var n = {};
            var r = Object.keys(e);
            var s, o;
            for (o = 0; o < r.length; o++) {
              s = r[o];
              if (t.indexOf(s) >= 0) continue;
              n[s] = e[s];
            }
            return n;
          }
          t.objectWithoutPropertiesLoose = ee;
          function te(e, n) {
            if (e == null) return {};
            var r = t.objectWithoutPropertiesLoose(e, n);
            var s, o;
            if (Object.getOwnPropertySymbols) {
              var i = Object.getOwnPropertySymbols(e);
              for (o = 0; o < i.length; o++) {
                s = i[o];
                if (n.indexOf(s) >= 0) continue;
                if (!Object.prototype.propertyIsEnumerable.call(e, s)) continue;
                r[s] = e[s];
              }
            }
            return r;
          }
          t.objectWithoutProperties = te;
          function ne(e) {
            if (e === void 0) {
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called"
              );
            }
            return e;
          }
          t.assertThisInitialized = ne;
          function re(e, n) {
            if (n && (typeof n === "object" || typeof n === "function")) {
              return n;
            } else if (n !== void 0) {
              throw new TypeError(
                "Derived constructors may only return object or undefined"
              );
            }
            return t.assertThisInitialized(e);
          }
          t.possibleConstructorReturn = re;
          function se(e) {
            var n = t.isNativeReflectConstruct();
            return function r() {
              var s = t.getPrototypeOf(e),
                o;
              if (n) {
                var i = t.getPrototypeOf(this).constructor;
                o = Reflect.construct(s, arguments, i);
              } else {
                o = s.apply(this, arguments);
              }
              return t.possibleConstructorReturn(this, o);
            };
          }
          t.createSuper = se;
          function oe(e, n) {
            while (!Object.prototype.hasOwnProperty.call(e, n)) {
              e = t.getPrototypeOf(e);
              if (e === null) break;
            }
            return e;
          }
          t.superPropBase = oe;
          function ie() {
            if (typeof Reflect !== "undefined" && Reflect.get) {
              t.get = ie = Reflect.get;
            } else {
              t.get = ie = function e(n, r, s) {
                var o = t.superPropBase(n, r);
                if (!o) return;
                var i = Object.getOwnPropertyDescriptor(o, r);
                if (i.get) {
                  return i.get.call(arguments.length < 3 ? n : s);
                }
                return i.value;
              };
            }
            return ie.apply(this, arguments);
          }
          t.get = ie;
          function ae(e, n, r, s) {
            if (typeof Reflect !== "undefined" && Reflect.set) {
              ae = Reflect.set;
            } else {
              ae = function e(n, r, s, o) {
                var i = t.superPropBase(n, r);
                var a;
                if (i) {
                  a = Object.getOwnPropertyDescriptor(i, r);
                  if (a.set) {
                    a.set.call(o, s);
                    return true;
                  } else if (!a.writable) {
                    return false;
                  }
                }
                a = Object.getOwnPropertyDescriptor(o, r);
                if (a) {
                  if (!a.writable) {
                    return false;
                  }
                  a.value = s;
                  Object.defineProperty(o, r, a);
                } else {
                  t.defineProperty(o, r, s);
                }
                return true;
              };
            }
            return ae(e, n, r, s);
          }
          function ce(e, t, n, r, s) {
            var o = ae(e, t, n, r || e);
            if (!o && s) {
              throw new Error("failed to set property");
            }
            return n;
          }
          t.set = ce;
          function de(e, t) {
            if (!t) {
              t = e.slice(0);
            }
            return Object.freeze(
              Object.defineProperties(e, { raw: { value: Object.freeze(t) } })
            );
          }
          t.taggedTemplateLiteral = de;
          function ue(e, t) {
            if (!t) {
              t = e.slice(0);
            }
            e.raw = t;
            return e;
          }
          t.taggedTemplateLiteralLoose = ue;
          function le(e) {
            throw new TypeError('"' + e + '" is read-only');
          }
          t.readOnlyError = le;
          function pe(e) {
            throw new TypeError('"' + e + '" is write-only');
          }
          t.writeOnlyError = pe;
          function me(e) {
            throw new Error(
              'Class "' +
                e +
                '" cannot be referenced in computed property keys.'
            );
          }
          t.classNameTDZError = me;
          function ge() {}
          t.temporalUndefined = ge;
          function fe(e) {
            throw new ReferenceError(
              e + " is not defined - temporal dead zone"
            );
          }
          t.tdz = fe;
          function he(e, n) {
            return e === t.temporalUndefined ? t.tdz(n) : e;
          }
          t.temporalRef = he;
          function ve(e, n) {
            return (
              t.arrayWithHoles(e) ||
              t.iterableToArrayLimit(e, n) ||
              t.unsupportedIterableToArray(e, n) ||
              t.nonIterableRest()
            );
          }
          t.slicedToArray = ve;
          function ye(e, n) {
            return (
              t.arrayWithHoles(e) ||
              t.iterableToArrayLimitLoose(e, n) ||
              t.unsupportedIterableToArray(e, n) ||
              t.nonIterableRest()
            );
          }
          t.slicedToArrayLoose = ye;
          function be(e) {
            return (
              t.arrayWithHoles(e) ||
              t.iterableToArray(e) ||
              t.unsupportedIterableToArray(e) ||
              t.nonIterableRest()
            );
          }
          t.toArray = be;
          function _e(e) {
            return (
              t.arrayWithoutHoles(e) ||
              t.iterableToArray(e) ||
              t.unsupportedIterableToArray(e) ||
              t.nonIterableSpread()
            );
          }
          t.toConsumableArray = _e;
          function je(e) {
            if (Array.isArray(e)) return t.arrayLikeToArray(e);
          }
          t.arrayWithoutHoles = je;
          function we(e) {
            if (Array.isArray(e)) return e;
          }
          t.arrayWithHoles = we;
          function xe(e, n, r) {
            if (n && !Array.isArray(n) && typeof n.length === "number") {
              var s = n.length;
              return t.arrayLikeToArray(n, r !== void 0 && r < s ? r : s);
            }
            return e(n, r);
          }
          t.maybeArrayLike = xe;
          function ke(e) {
            if (
              (typeof Symbol !== "undefined" && e[Symbol.iterator] != null) ||
              e["@@iterator"] != null
            )
              return Array.from(e);
          }
          t.iterableToArray = ke;
          function Oe(e, t) {
            var n =
              e == null
                ? null
                : (typeof Symbol !== "undefined" && e[Symbol.iterator]) ||
                  e["@@iterator"];
            if (n == null) return;
            var r = [];
            var s = true;
            var o = false;
            var i, a;
            try {
              for (n = n.call(e); !(s = (i = n.next()).done); s = true) {
                r.push(i.value);
                if (t && r.length === t) break;
              }
            } catch (e) {
              o = true;
              a = e;
            } finally {
              try {
                if (!s && n["return"] != null) n["return"]();
              } finally {
                if (o) throw a;
              }
            }
            return r;
          }
          t.iterableToArrayLimit = Oe;
          function Ee(e, t) {
            var n =
              e &&
              ((typeof Symbol !== "undefined" && e[Symbol.iterator]) ||
                e["@@iterator"]);
            if (n == null) return;
            var r = [];
            for (n = n.call(e), _step; !(_step = n.next()).done; ) {
              r.push(_step.value);
              if (t && r.length === t) break;
            }
            return r;
          }
          t.iterableToArrayLimitLoose = Ee;
          function Ce(e, n) {
            if (!e) return;
            if (typeof e === "string") return t.arrayLikeToArray(e, n);
            var r = Object.prototype.toString.call(e).slice(8, -1);
            if (r === "Object" && e.constructor) r = e.constructor.name;
            if (r === "Map" || r === "Set") return Array.from(e);
            if (
              r === "Arguments" ||
              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
            )
              return t.arrayLikeToArray(e, n);
          }
          t.unsupportedIterableToArray = Ce;
          function Se(e, t) {
            if (t == null || t > e.length) t = e.length;
            for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
            return r;
          }
          t.arrayLikeToArray = Se;
          function Te() {
            throw new TypeError(
              "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
            );
          }
          t.nonIterableSpread = Te;
          function Ie() {
            throw new TypeError(
              "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
            );
          }
          t.nonIterableRest = Ie;
          function Pe(e, n) {
            var r =
              (typeof Symbol !== "undefined" && e[Symbol.iterator]) ||
              e["@@iterator"];
            if (!r) {
              if (
                Array.isArray(e) ||
                (r = t.unsupportedIterableToArray(e)) ||
                (n && e && typeof e.length === "number")
              ) {
                if (r) e = r;
                var s = 0;
                var o = function () {};
                return {
                  s: o,
                  n: function () {
                    if (s >= e.length) return { done: true };
                    return { done: false, value: e[s++] };
                  },
                  e: function (e) {
                    throw e;
                  },
                  f: o,
                };
              }
              throw new TypeError(
                "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
              );
            }
            var i = true,
              a = false,
              c;
            return {
              s: function () {
                r = r.call(e);
              },
              n: function () {
                var e = r.next();
                i = e.done;
                return e;
              },
              e: function (e) {
                a = true;
                c = e;
              },
              f: function () {
                try {
                  if (!i && r.return != null) r.return();
                } finally {
                  if (a) throw c;
                }
              },
            };
          }
          t.createForOfIteratorHelper = Pe;
          function De(e, n) {
            var r =
              (typeof Symbol !== "undefined" && e[Symbol.iterator]) ||
              e["@@iterator"];
            if (r) return (r = r.call(e)).next.bind(r);
            if (
              Array.isArray(e) ||
              (r = t.unsupportedIterableToArray(e)) ||
              (n && e && typeof e.length === "number")
            ) {
              if (r) e = r;
              var s = 0;
              return function () {
                if (s >= e.length) return { done: true };
                return { done: false, value: e[s++] };
              };
            }
            throw new TypeError(
              "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
            );
          }
          t.createForOfIteratorHelperLoose = De;
          function Ae(e) {
            return function () {
              var t = e.apply(this, arguments);
              t.next();
              return t;
            };
          }
          t.skipFirstGeneratorNext = Ae;
          function Ne(e, t) {
            if (typeof e !== "object" || e === null) return e;
            var n = e[Symbol.toPrimitive];
            if (n !== undefined) {
              var r = n.call(e, t || "default");
              if (typeof r !== "object") return r;
              throw new TypeError(
                "@@toPrimitive must return a primitive value."
              );
            }
            return (t === "string" ? String : Number)(e);
          }
          t.toPrimitive = Ne;
          function Re(e) {
            var n = t.toPrimitive(e, "string");
            return typeof n === "symbol" ? n : String(n);
          }
          t.toPropertyKey = Re;
          function Le(e, t) {
            throw new Error(
              "Decorating class property failed. Please ensure that " +
                "proposal-class-properties is enabled and runs after the decorators transform."
            );
          }
          t.initializerWarningHelper = Le;
          function ze(e, t, n, r) {
            if (!n) return;
            Object.defineProperty(e, t, {
              enumerable: n.enumerable,
              configurable: n.configurable,
              writable: n.writable,
              value: n.initializer ? n.initializer.call(r) : void 0,
            });
          }
          t.initializerDefineProperty = ze;
          function Ue(e, t, n, r, s) {
            var o = {};
            Object.keys(r).forEach(function (e) {
              o[e] = r[e];
            });
            o.enumerable = !!o.enumerable;
            o.configurable = !!o.configurable;
            if ("value" in o || o.initializer) {
              o.writable = true;
            }
            o = n
              .slice()
              .reverse()
              .reduce(function (n, r) {
                return r(e, t, n) || n;
              }, o);
            if (s && o.initializer !== void 0) {
              o.value = o.initializer ? o.initializer.call(s) : void 0;
              o.initializer = undefined;
            }
            if (o.initializer === void 0) {
              Object.defineProperty(e, t, o);
              o = null;
            }
            return o;
          }
          t.applyDecoratedDescriptor = Ue;
          var Fe = 0;
          function Me(e) {
            return "__private_" + Fe++ + "_" + e;
          }
          t.classPrivateFieldLooseKey = Me;
          function $e(e, t) {
            if (!Object.prototype.hasOwnProperty.call(e, t)) {
              throw new TypeError(
                "attempted to use private field on non-instance"
              );
            }
            return e;
          }
          t.classPrivateFieldLooseBase = $e;
          function Be(e, n) {
            var r = t.classExtractFieldDescriptor(e, n, "get");
            return t.classApplyDescriptorGet(e, r);
          }
          t.classPrivateFieldGet = Be;
          function qe(e, n, r) {
            var s = t.classExtractFieldDescriptor(e, n, "set");
            t.classApplyDescriptorSet(e, s, r);
            return r;
          }
          t.classPrivateFieldSet = qe;
          function We(e, n) {
            var r = t.classExtractFieldDescriptor(e, n, "set");
            return t.classApplyDescriptorDestructureSet(e, r);
          }
          t.classPrivateFieldDestructureSet = We;
          function Ge(e, t, n) {
            if (!t.has(e)) {
              throw new TypeError(
                "attempted to " + n + " private field on non-instance"
              );
            }
            return t.get(e);
          }
          t.classExtractFieldDescriptor = Ge;
          function He(e, n, r) {
            t.classCheckPrivateStaticAccess(e, n);
            t.classCheckPrivateStaticFieldDescriptor(r, "get");
            return t.classApplyDescriptorGet(e, r);
          }
          t.classStaticPrivateFieldSpecGet = He;
          function Ve(e, n, r, s) {
            t.classCheckPrivateStaticAccess(e, n);
            t.classCheckPrivateStaticFieldDescriptor(r, "set");
            t.classApplyDescriptorSet(e, r, s);
            return s;
          }
          t.classStaticPrivateFieldSpecSet = Ve;
          function Ke(e, n, r) {
            t.classCheckPrivateStaticAccess(e, n);
            return r;
          }
          t.classStaticPrivateMethodGet = Ke;
          function Ye() {
            throw new TypeError(
              "attempted to set read only static private field"
            );
          }
          t.classStaticPrivateMethodSet = Ye;
          function Je(e, t) {
            if (t.get) {
              return t.get.call(e);
            }
            return t.value;
          }
          t.classApplyDescriptorGet = Je;
          function Xe(e, t, n) {
            if (t.set) {
              t.set.call(e, n);
            } else {
              if (!t.writable) {
                throw new TypeError("attempted to set read only private field");
              }
              t.value = n;
            }
          }
          t.classApplyDescriptorSet = Xe;
          function Ze(e, t) {
            if (t.set) {
              if (!("__destrObj" in t)) {
                t.__destrObj = {
                  set value(n) {
                    t.set.call(e, n);
                  },
                };
              }
              return t.__destrObj;
            } else {
              if (!t.writable) {
                throw new TypeError("attempted to set read only private field");
              }
              return t;
            }
          }
          t.classApplyDescriptorDestructureSet = Ze;
          function Qe(e, n, r) {
            t.classCheckPrivateStaticAccess(e, n);
            t.classCheckPrivateStaticFieldDescriptor(r, "set");
            return t.classApplyDescriptorDestructureSet(e, r);
          }
          t.classStaticPrivateFieldDestructureSet = Qe;
          function et(e, t) {
            if (e !== t) {
              throw new TypeError("Private static access of wrong provenance");
            }
          }
          t.classCheckPrivateStaticAccess = et;
          function tt(e, t) {
            if (e === undefined) {
              throw new TypeError(
                "attempted to " +
                  t +
                  " private static field before its declaration"
              );
            }
          }
          t.classCheckPrivateStaticFieldDescriptor = tt;
          function nt(e, t, n, r) {
            var s = rt();
            if (r) {
              for (var o = 0; o < r.length; o++) {
                s = r[o](s);
              }
            }
            var i = t(function e(t) {
              s.initializeInstanceElements(t, a.elements);
            }, n);
            var a = s.decorateClass(it(i.d.map(st)), e);
            s.initializeClassElements(i.F, a.elements);
            return s.runClassFinishers(i.F, a.finishers);
          }
          function rt() {
            rt = function () {
              return e;
            };
            var e = {
              elementsDefinitionOrder: [["method"], ["field"]],
              initializeInstanceElements: function (e, t) {
                ["method", "field"].forEach(function (n) {
                  t.forEach(function (t) {
                    if (t.kind === n && t.placement === "own") {
                      this.defineClassElement(e, t);
                    }
                  }, this);
                }, this);
              },
              initializeClassElements: function (e, t) {
                var n = e.prototype;
                ["method", "field"].forEach(function (r) {
                  t.forEach(function (t) {
                    var s = t.placement;
                    if (t.kind === r && (s === "static" || s === "prototype")) {
                      var o = s === "static" ? e : n;
                      this.defineClassElement(o, t);
                    }
                  }, this);
                }, this);
              },
              defineClassElement: function (e, t) {
                var n = t.descriptor;
                if (t.kind === "field") {
                  var r = t.initializer;
                  n = {
                    enumerable: n.enumerable,
                    writable: n.writable,
                    configurable: n.configurable,
                    value: r === void 0 ? void 0 : r.call(e),
                  };
                }
                Object.defineProperty(e, t.key, n);
              },
              decorateClass: function (e, t) {
                var n = [];
                var r = [];
                var s = { static: [], prototype: [], own: [] };
                e.forEach(function (e) {
                  this.addElementPlacement(e, s);
                }, this);
                e.forEach(function (e) {
                  if (!at(e)) return n.push(e);
                  var t = this.decorateElement(e, s);
                  n.push(t.element);
                  n.push.apply(n, t.extras);
                  r.push.apply(r, t.finishers);
                }, this);
                if (!t) {
                  return { elements: n, finishers: r };
                }
                var o = this.decorateConstructor(n, t);
                r.push.apply(r, o.finishers);
                o.finishers = r;
                return o;
              },
              addElementPlacement: function (e, t, n) {
                var r = t[e.placement];
                if (!n && r.indexOf(e.key) !== -1) {
                  throw new TypeError("Duplicated element (" + e.key + ")");
                }
                r.push(e.key);
              },
              decorateElement: function (e, t) {
                var n = [];
                var r = [];
                for (var s = e.decorators, o = s.length - 1; o >= 0; o--) {
                  var i = t[e.placement];
                  i.splice(i.indexOf(e.key), 1);
                  var a = this.fromElementDescriptor(e);
                  var c = this.toElementFinisherExtras((0, s[o])(a) || a);
                  e = c.element;
                  this.addElementPlacement(e, t);
                  if (c.finisher) {
                    r.push(c.finisher);
                  }
                  var d = c.extras;
                  if (d) {
                    for (var u = 0; u < d.length; u++) {
                      this.addElementPlacement(d[u], t);
                    }
                    n.push.apply(n, d);
                  }
                }
                return { element: e, finishers: r, extras: n };
              },
              decorateConstructor: function (e, t) {
                var n = [];
                for (var r = t.length - 1; r >= 0; r--) {
                  var s = this.fromClassDescriptor(e);
                  var o = this.toClassDescriptor((0, t[r])(s) || s);
                  if (o.finisher !== undefined) {
                    n.push(o.finisher);
                  }
                  if (o.elements !== undefined) {
                    e = o.elements;
                    for (var i = 0; i < e.length - 1; i++) {
                      for (var a = i + 1; a < e.length; a++) {
                        if (
                          e[i].key === e[a].key &&
                          e[i].placement === e[a].placement
                        ) {
                          throw new TypeError(
                            "Duplicated element (" + e[i].key + ")"
                          );
                        }
                      }
                    }
                  }
                }
                return { elements: e, finishers: n };
              },
              fromElementDescriptor: function (e) {
                var t = {
                  kind: e.kind,
                  key: e.key,
                  placement: e.placement,
                  descriptor: e.descriptor,
                };
                var n = { value: "Descriptor", configurable: true };
                Object.defineProperty(t, Symbol.toStringTag, n);
                if (e.kind === "field") t.initializer = e.initializer;
                return t;
              },
              toElementDescriptors: function (e) {
                if (e === undefined) return;
                return t.toArray(e).map(function (e) {
                  var t = this.toElementDescriptor(e);
                  this.disallowProperty(e, "finisher", "An element descriptor");
                  this.disallowProperty(e, "extras", "An element descriptor");
                  return t;
                }, this);
              },
              toElementDescriptor: function (e) {
                var n = String(e.kind);
                if (n !== "method" && n !== "field") {
                  throw new TypeError(
                    'An element descriptor\'s .kind property must be either "method" or' +
                      ' "field", but a decorator created an element descriptor with' +
                      ' .kind "' +
                      n +
                      '"'
                  );
                }
                var r = t.toPropertyKey(e.key);
                var s = String(e.placement);
                if (s !== "static" && s !== "prototype" && s !== "own") {
                  throw new TypeError(
                    'An element descriptor\'s .placement property must be one of "static",' +
                      ' "prototype" or "own", but a decorator created an element descriptor' +
                      ' with .placement "' +
                      s +
                      '"'
                  );
                }
                var o = e.descriptor;
                this.disallowProperty(e, "elements", "An element descriptor");
                var i = {
                  kind: n,
                  key: r,
                  placement: s,
                  descriptor: Object.assign({}, o),
                };
                if (n !== "field") {
                  this.disallowProperty(
                    e,
                    "initializer",
                    "A method descriptor"
                  );
                } else {
                  this.disallowProperty(
                    o,
                    "get",
                    "The property descriptor of a field descriptor"
                  );
                  this.disallowProperty(
                    o,
                    "set",
                    "The property descriptor of a field descriptor"
                  );
                  this.disallowProperty(
                    o,
                    "value",
                    "The property descriptor of a field descriptor"
                  );
                  i.initializer = e.initializer;
                }
                return i;
              },
              toElementFinisherExtras: function (e) {
                var t = this.toElementDescriptor(e);
                var n = dt(e, "finisher");
                var r = this.toElementDescriptors(e.extras);
                return { element: t, finisher: n, extras: r };
              },
              fromClassDescriptor: function (e) {
                var t = {
                  kind: "class",
                  elements: e.map(this.fromElementDescriptor, this),
                };
                var n = { value: "Descriptor", configurable: true };
                Object.defineProperty(t, Symbol.toStringTag, n);
                return t;
              },
              toClassDescriptor: function (e) {
                var t = String(e.kind);
                if (t !== "class") {
                  throw new TypeError(
                    'A class descriptor\'s .kind property must be "class", but a decorator' +
                      ' created a class descriptor with .kind "' +
                      t +
                      '"'
                  );
                }
                this.disallowProperty(e, "key", "A class descriptor");
                this.disallowProperty(e, "placement", "A class descriptor");
                this.disallowProperty(e, "descriptor", "A class descriptor");
                this.disallowProperty(e, "initializer", "A class descriptor");
                this.disallowProperty(e, "extras", "A class descriptor");
                var n = dt(e, "finisher");
                var r = this.toElementDescriptors(e.elements);
                return { elements: r, finisher: n };
              },
              runClassFinishers: function (e, t) {
                for (var n = 0; n < t.length; n++) {
                  var r = (0, t[n])(e);
                  if (r !== undefined) {
                    if (typeof r !== "function") {
                      throw new TypeError(
                        "Finishers must return a constructor."
                      );
                    }
                    e = r;
                  }
                }
                return e;
              },
              disallowProperty: function (e, t, n) {
                if (e[t] !== undefined) {
                  throw new TypeError(n + " can't have a ." + t + " property.");
                }
              },
            };
            return e;
          }
          function st(e) {
            var n = t.toPropertyKey(e.key);
            var r;
            if (e.kind === "method") {
              r = {
                value: e.value,
                writable: true,
                configurable: true,
                enumerable: false,
              };
            } else if (e.kind === "get") {
              r = { get: e.value, configurable: true, enumerable: false };
            } else if (e.kind === "set") {
              r = { set: e.value, configurable: true, enumerable: false };
            } else if (e.kind === "field") {
              r = { configurable: true, writable: true, enumerable: true };
            }
            var s = {
              kind: e.kind === "field" ? "field" : "method",
              key: n,
              placement: e.static
                ? "static"
                : e.kind === "field"
                ? "own"
                : "prototype",
              descriptor: r,
            };
            if (e.decorators) s.decorators = e.decorators;
            if (e.kind === "field") s.initializer = e.value;
            return s;
          }
          function ot(e, t) {
            if (e.descriptor.get !== undefined) {
              t.descriptor.get = e.descriptor.get;
            } else {
              t.descriptor.set = e.descriptor.set;
            }
          }
          function it(e) {
            var t = [];
            var n = function (e) {
              return (
                e.kind === "method" &&
                e.key === s.key &&
                e.placement === s.placement
              );
            };
            for (var r = 0; r < e.length; r++) {
              var s = e[r];
              var o;
              if (s.kind === "method" && (o = t.find(n))) {
                if (ct(s.descriptor) || ct(o.descriptor)) {
                  if (at(s) || at(o)) {
                    throw new ReferenceError(
                      "Duplicated methods (" + s.key + ") can't be decorated."
                    );
                  }
                  o.descriptor = s.descriptor;
                } else {
                  if (at(s)) {
                    if (at(o)) {
                      throw new ReferenceError(
                        "Decorators can't be placed on different accessors with for " +
                          "the same property (" +
                          s.key +
                          ")."
                      );
                    }
                    o.decorators = s.decorators;
                  }
                  ot(s, o);
                }
              } else {
                t.push(s);
              }
            }
            return t;
          }
          function at(e) {
            return e.decorators && e.decorators.length;
          }
          function ct(e) {
            return (
              e !== undefined &&
              !(e.value === undefined && e.writable === undefined)
            );
          }
          function dt(e, t) {
            var n = e[t];
            if (n !== undefined && typeof n !== "function") {
              throw new TypeError("Expected '" + t + "' to be a function");
            }
            return n;
          }
          t.decorate = nt;
          function ut(e, t, n) {
            if (!t.has(e)) {
              throw new TypeError(
                "attempted to get private field on non-instance"
              );
            }
            return n;
          }
          t.classPrivateMethodGet = ut;
          function lt(e, t) {
            if (t.has(e)) {
              throw new TypeError(
                "Cannot initialize the same private elements twice on an object"
              );
            }
          }
          t.checkPrivateRedeclaration = lt;
          function pt(e, n, r) {
            t.checkPrivateRedeclaration(e, n);
            n.set(e, r);
          }
          t.classPrivateFieldInitSpec = pt;
          function mt(e, n) {
            t.checkPrivateRedeclaration(e, n);
            n.add(e);
          }
          t.classPrivateMethodInitSpec = mt;
          function gt() {
            throw new TypeError("attempted to reassign private method");
          }
          t.classPrivateMethodSet = gt;
          function ft(e) {
            return e;
          }
          t.identity = ft;
        })(typeof e === "undefined" ? self : e);
      }.call(this, n("./node_modules/webpack/buildin/global.js")));
    },
    0: function (e, t, n) {
      n("./node_modules/@sentry/webpack-plugin/src/sentry-webpack.module.js");
      n("./src/udemy/js/entry/polyfills.js");
      e.exports = n("./src/udemy/js/entry/main.js");
    },
    1: function (e, t) {},
    2: function (e, t) {},
  },
  [[0, "entry-main-manifest", "entry-main-vendor"]],
]);
//# sourceMappingURL=entry-main.308bceed222573dde62d.js.map
