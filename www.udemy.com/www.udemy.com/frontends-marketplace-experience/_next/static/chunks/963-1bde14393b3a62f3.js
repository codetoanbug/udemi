(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [963],
  {
    78e3: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.AmpStateContext = void 0);
      var a = (0, n(92648).Z)(n(67294)).default.createContext({});
      t.AmpStateContext = a;
    },
    9470: function (e, t) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.isInAmpMode = function () {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {},
            t = e.ampFirst,
            n = void 0 !== t && t,
            a = e.hybrid,
            r = void 0 !== a && a,
            o = e.hasQuery,
            c = void 0 !== o && o;
          return n || (r && c);
        });
    },
    72717: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.defaultHead = p),
        (t.default = void 0);
      var a = n(6495).Z,
        r = n(92648).Z,
        o = (0, n(91598).Z)(n(67294)),
        c = r(n(11585)),
        i = n(78e3),
        l = n(15850),
        m = n(9470);
      n(99475);
      function p() {
        var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
          t = [o.default.createElement("meta", { charSet: "utf-8" })];
        return (
          e ||
            t.push(
              o.default.createElement("meta", {
                name: "viewport",
                content: "width=device-width",
              })
            ),
          t
        );
      }
      function d(e, t) {
        return "string" === typeof t || "number" === typeof t
          ? e
          : t.type === o.default.Fragment
          ? e.concat(
              o.default.Children.toArray(t.props.children).reduce(function (
                e,
                t
              ) {
                return "string" === typeof t || "number" === typeof t
                  ? e
                  : e.concat(t);
              },
              [])
            )
          : e.concat(t);
      }
      var u = ["name", "httpEquiv", "charSet", "itemProp"];
      function s(e, t) {
        var n = t.inAmpMode;
        return e
          .reduce(d, [])
          .reverse()
          .concat(p(n).reverse())
          .filter(
            (function () {
              var e = new Set(),
                t = new Set(),
                n = new Set(),
                a = {};
              return function (r) {
                var o = !0,
                  c = !1;
                if (
                  r.key &&
                  "number" !== typeof r.key &&
                  r.key.indexOf("$") > 0
                ) {
                  c = !0;
                  var i = r.key.slice(r.key.indexOf("$") + 1);
                  e.has(i) ? (o = !1) : e.add(i);
                }
                switch (r.type) {
                  case "title":
                  case "base":
                    t.has(r.type) ? (o = !1) : t.add(r.type);
                    break;
                  case "meta":
                    for (var l = 0, m = u.length; l < m; l++) {
                      var p = u[l];
                      if (r.props.hasOwnProperty(p))
                        if ("charSet" === p) n.has(p) ? (o = !1) : n.add(p);
                        else {
                          var d = r.props[p],
                            s = a[p] || new Set();
                          ("name" === p && c) || !s.has(d)
                            ? (s.add(d), (a[p] = s))
                            : (o = !1);
                        }
                    }
                }
                return o;
              };
            })()
          )
          .reverse()
          .map(function (e, t) {
            var r = e.key || t;
            if (
              !n &&
              "link" === e.type &&
              e.props.href &&
              [
                "https://fonts.googleapis.com/css",
                "https://use.typekit.net/",
              ].some(function (t) {
                return e.props.href.startsWith(t);
              })
            ) {
              var c = a({}, e.props || {});
              return (
                (c["data-href"] = c.href),
                (c.href = void 0),
                (c["data-optimized-fonts"] = !0),
                o.default.cloneElement(e, c)
              );
            }
            return o.default.cloneElement(e, { key: r });
          });
      }
      var f = function (e) {
        var t = e.children,
          n = o.useContext(i.AmpStateContext),
          a = o.useContext(l.HeadManagerContext);
        return o.default.createElement(
          c.default,
          {
            reduceComponentsToState: s,
            headManager: a,
            inAmpMode: m.isInAmpMode(n),
          },
          t
        );
      };
      (t.default = f),
        ("function" === typeof t.default ||
          ("object" === typeof t.default && null !== t.default)) &&
          "undefined" === typeof t.default.__esModule &&
          (Object.defineProperty(t.default, "__esModule", { value: !0 }),
          Object.assign(t.default, t),
          (e.exports = t.default));
    },
    11585: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.default = function (e) {
          var t = e.headManager,
            n = e.reduceComponentsToState;
          function i() {
            if (t && t.mountedInstances) {
              var r = a.Children.toArray(
                Array.from(t.mountedInstances).filter(Boolean)
              );
              t.updateHead(n(r, e));
            }
          }
          if (r) {
            var l;
            null == t || null == (l = t.mountedInstances) || l.add(e.children),
              i();
          }
          return (
            o(function () {
              var n;
              return (
                null == t ||
                  null == (n = t.mountedInstances) ||
                  n.add(e.children),
                function () {
                  var n;
                  null == t ||
                    null == (n = t.mountedInstances) ||
                    n.delete(e.children);
                }
              );
            }),
            o(function () {
              return (
                t && (t._pendingUpdate = i),
                function () {
                  t && (t._pendingUpdate = i);
                }
              );
            }),
            c(function () {
              return (
                t &&
                  t._pendingUpdate &&
                  (t._pendingUpdate(), (t._pendingUpdate = null)),
                function () {
                  t &&
                    t._pendingUpdate &&
                    (t._pendingUpdate(), (t._pendingUpdate = null));
                }
              );
            }),
            null
          );
        });
      var a = (0, n(91598).Z)(n(67294));
      var r = !1,
        o = r ? function () {} : a.useLayoutEffect,
        c = r ? function () {} : a.useEffect;
    },
    8777: function (e, t, n) {
      "use strict";
      n.d(t, {
        p: function () {
          return i;
        },
      });
      var a = n(67294),
        r = n(79594),
        o = n(36186),
        c = "https://s.udemycdn.com/meta/default-meta-image-v2.png",
        i = function (e) {
          var t,
            n,
            i,
            l,
            m = e.title,
            p = e.description,
            d = e.ogDescription,
            u = e.ogTitle,
            s = e.ogImage,
            f = void 0 === s ? c : s,
            g = e.ogType,
            h = e.canonicalUrl,
            y = e.ogLocale,
            v = void 0 === y ? "en_US" : y,
            E = e.robots,
            k = e.assetPath,
            _ = e.headWrapper,
            b = e.errorPage,
            x = void 0 !== b && b,
            w = (function (e) {
              return {
                brandTitle: "Udemy",
                domain: "www.udemy.com",
                defaultMetaImage: c,
                appleTouchIcon: "".concat(
                  e,
                  "/staticx/udemy/images/v7/apple-touch-icon.png"
                ),
                brandFavIcon: "".concat(
                  e,
                  "/staticx/udemy/images/v8/favicon-32x32.png"
                ),
                brandFavIcon16x16: "".concat(
                  e,
                  "/staticx/udemy/images/v8/favicon-16x16.png"
                ),
                applicationTitleColor: "#a435f0",
                applicationTitleImage: "".concat(
                  e,
                  "/staticx/udemy/images/v7/mstile-144x144.png"
                ),
                applicationConfig: "".concat(
                  e,
                  "/staticx/udemy/images/v7/browserconfig.xml"
                ),
                manifest: "".concat(
                  e,
                  "/staticx/udemy/images/v7/site-manifest.json"
                ),
                appleItunesApp:
                  "app-id=562413829, affiliate-data=ct=Safari_SmartBanner&amp;pt=1240482",
                googlePlayApp: "app-id=com.udemy.android.ufb",
                fbAppId: "313137469260",
              };
            })(k),
            C = (0, r.QT)(),
            I = C.gettext,
            A = C.interpolate,
            T = C.locale,
            S = (0, o.gL)().site_stats,
            U = null !== _ && void 0 !== _ ? _ : a.Fragment,
            P = A(
              I(
                "Udemy is an online learning and teaching marketplace with over %(courseCount)s courses and %(studentCount)s students. Learn programming, marketing, data science and more."
              ),
              {
                courseCount: (0, r.uf)(S.default.num_courses, T),
                studentCount: S.default.num_students_million,
              },
              !0
            ),
            M = function (e) {
              return x ? null : e;
            };
          return (
            (m =
              null !== (t = m) && void 0 !== t
                ? t
                : I(
                    "Online Courses - Learn Anything, On Your Schedule | Udemy"
                  )),
            (p = null !== (n = p) && void 0 !== n ? n : P),
            (d = null !== (i = d) && void 0 !== i ? i : P),
            (u =
              null !== (l = u) && void 0 !== l
                ? l
                : I(
                    "Online Courses - Learn Anything, On Your Schedule | Udemy"
                  )),
            a.createElement(
              U,
              null,
              a.createElement("title", null, m),
              a.createElement("meta", {
                name: "description",
                content: p,
                key: "description",
              }),
              a.createElement("meta", {
                name: "title",
                content: m,
                key: "title",
              }),
              a.createElement("meta", { name: "medium", content: "mult" }),
              a.createElement("meta", {
                name: "viewport",
                content:
                  "width=device-width, initial-scale=1.0, minimum-scale=1.0",
                key: "viewport",
              }),
              E &&
                a.createElement("meta", {
                  name: "robots",
                  content: "string" === typeof E ? E : E.join(", "),
                }),
              a.createElement("meta", {
                name: "apple-itunes-app",
                content: w.appleItunesApp,
              }),
              a.createElement("meta", {
                name: "google-play-app",
                content: w.googlePlayApp,
              }),
              a.createElement("meta", {
                property: "fb:app_id",
                content: w.fbAppId,
              }),
              a.createElement("meta", {
                httpEquiv: "X-UA-Compatible",
                content: "IE=Edge",
              }),
              a.createElement("meta", {
                httpEquiv: "Content-Type",
                content: "text/html; charset=UTF-8",
              }),
              a.createElement("meta", {
                property: "og:title",
                content: u,
                key: "og:title",
              }),
              M(
                a.createElement("meta", {
                  property: "og:url",
                  content: h,
                  key: "og:url",
                })
              ),
              a.createElement("meta", {
                property: "og:description",
                content: d,
                key: "og:description",
              }),
              a.createElement("meta", {
                property: "og:image",
                content: f,
                key: "og:image",
              }),
              a.createElement("meta", { property: "og:type", content: g }),
              a.createElement("meta", {
                property: "og:site_name",
                content: w.brandTitle,
              }),
              a.createElement("meta", { property: "og:locale", content: v }),
              a.createElement("meta", {
                name: "twitter:card",
                content: "summary_large_image",
              }),
              a.createElement("meta", {
                name: "twitter:domain",
                content: w.domain,
              }),
              a.createElement("meta", { name: "twitter:title", content: u }),
              M(a.createElement("meta", { name: "twitter:url", content: h })),
              a.createElement("meta", {
                name: "twitter:description",
                content: d,
              }),
              a.createElement("meta", { name: "twitter:image", content: f }),
              a.createElement("meta", {
                name: "twitter:site",
                content: "@udemy",
              }),
              a.createElement("meta", { itemProp: "name", content: u }),
              M(a.createElement("meta", { itemProp: "url", content: h })),
              a.createElement("meta", { itemProp: "description", content: d }),
              a.createElement("meta", { itemProp: "image", content: f }),
              a.createElement("link", {
                rel: "preconnect",
                href: "https://s.udemycdn.com/",
              }),
              a.createElement("link", {
                rel: "preconnect",
                href: "https://s.udemycdn.com/",
                crossOrigin: "",
              }),
              a.createElement("link", {
                rel: "preconnect",
                href: "https://img-c.udemycdn.com/",
              }),
              a.createElement("link", {
                rel: "preconnect",
                href: "https://img-b.udemycdn.com/",
              }),
              a.createElement("link", {
                rel: "dns-prefetch",
                href: "https://s.udemycdn.com/",
              }),
              a.createElement("link", {
                rel: "dns-prefetch",
                href: "https://img-c.udemycdn.com/",
              }),
              a.createElement("link", {
                rel: "dns-prefetch",
                href: "https://img-b.udemycdn.com/",
              }),
              a.createElement("link", {
                rel: "apple-touch-icon",
                sizes: "180x180",
                href: w.appleTouchIcon,
              }),
              a.createElement("link", {
                rel: "icon",
                type: "image/png",
                sizes: "32x32",
                href: w.brandFavIcon,
              }),
              a.createElement("link", {
                rel: "icon",
                type: "image/png",
                sizes: "16x16",
                href: w.brandFavIcon16x16,
              }),
              a.createElement("link", { rel: "manifest", href: w.manifest }),
              a.createElement("meta", {
                name: "application-name",
                content: w.brandTitle,
              }),
              a.createElement("meta", {
                name: "msapplication-TileColor",
                content: w.applicationTitleColor,
              }),
              a.createElement("meta", {
                name: "msapplication-TileImage",
                content: w.applicationTitleImage,
              }),
              a.createElement("meta", {
                name: "msapplication-config",
                content: w.applicationConfig,
              }),
              a.createElement("meta", {
                name: "theme-color",
                content: "#ffffff",
              }),
              a.createElement("base", { href: "/" }),
              M(a.createElement("link", { rel: "canonical", href: h }))
            )
          );
        };
    },
    9008: function (e, t, n) {
      e.exports = n(72717);
    },
  },
]);
//# sourceMappingURL=963-1bde14393b3a62f3.js.map
