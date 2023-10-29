(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [982],
  {
    17784: function (e, t) {
      var n;
      !(function () {
        "use strict";
        var r = {}.hasOwnProperty;
        function i() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t];
            if (n) {
              var o = typeof n;
              if ("string" === o || "number" === o) e.push(n);
              else if (Array.isArray(n)) {
                if (n.length) {
                  var a = i.apply(null, n);
                  a && e.push(a);
                }
              } else if ("object" === o) {
                if (
                  n.toString !== Object.prototype.toString &&
                  !n.toString.toString().includes("[native code]")
                ) {
                  e.push(n.toString());
                  continue;
                }
                for (var s in n) r.call(n, s) && n[s] && e.push(s);
              }
            }
          }
          return e.join(" ");
        }
        e.exports
          ? ((i.default = i), (e.exports = i))
          : void 0 ===
              (n = function () {
                return i;
              }.apply(t, [])) || (e.exports = n);
      })();
    },
    67666: function (e, t) {
      var n;
      !(function () {
        "use strict";
        var r = {}.hasOwnProperty;
        function i() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t];
            if (n) {
              var o = typeof n;
              if ("string" === o || "number" === o) e.push(n);
              else if (Array.isArray(n)) {
                if (n.length) {
                  var a = i.apply(null, n);
                  a && e.push(a);
                }
              } else if ("object" === o) {
                if (
                  n.toString !== Object.prototype.toString &&
                  !n.toString.toString().includes("[native code]")
                ) {
                  e.push(n.toString());
                  continue;
                }
                for (var s in n) r.call(n, s) && n[s] && e.push(s);
              }
            }
          }
          return e.join(" ");
        }
        e.exports
          ? ((i.default = i), (e.exports = i))
          : void 0 ===
              (n = function () {
                return i;
              }.apply(t, [])) || (e.exports = n);
      })();
    },
    94294: function (e, t) {
      var n;
      !(function () {
        "use strict";
        var r = {}.hasOwnProperty;
        function i() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t];
            if (n) {
              var o = typeof n;
              if ("string" === o || "number" === o) e.push(n);
              else if (Array.isArray(n)) {
                if (n.length) {
                  var a = i.apply(null, n);
                  a && e.push(a);
                }
              } else if ("object" === o) {
                if (
                  n.toString !== Object.prototype.toString &&
                  !n.toString.toString().includes("[native code]")
                ) {
                  e.push(n.toString());
                  continue;
                }
                for (var s in n) r.call(n, s) && n[s] && e.push(s);
              }
            }
          }
          return e.join(" ");
        }
        e.exports
          ? ((i.default = i), (e.exports = i))
          : void 0 ===
              (n = function () {
                return i;
              }.apply(t, [])) || (e.exports = n);
      })();
    },
    98906: function (e, t, n) {
      e.exports = n(9828).IU("article");
    },
    67273: function (e, t, n) {
      e.exports = n(9828).IU("bar-chart");
    },
    99215: function (e, t, n) {
      e.exports = n(9828).IU("cart");
    },
    35169: function (e, t, n) {
      e.exports = n(9828).IU("cloud");
    },
    97137: function (e, t, n) {
      e.exports = n(9828).IU("code");
    },
    10575: function (e, t, n) {
      e.exports = n(9828).IU("delete");
    },
    71333: function (e, t, n) {
      e.exports = n(9828).IU("empty-course-image");
    },
    44394: function (e, t, n) {
      e.exports = n(9828).IU("labs");
    },
    21617: function (e, t, n) {
      e.exports = n(9828).IU("language");
    },
    10979: function (e, t, n) {
      e.exports = n(9828).IU("menu");
    },
    93630: function (e, t, n) {
      e.exports = n(9828).IU("next");
    },
    1734: function (e, t, n) {
      e.exports = n(9828).IU("notification");
    },
    97022: function (e, t, n) {
      e.exports = n(9828).IU("open-in-new");
    },
    24942: function (e, t, n) {
      e.exports = n(9828).IU("person");
    },
    77276: function (e, t, n) {
      e.exports = n(9828).IU("play");
    },
    76185: function (e, t, n) {
      e.exports = n(9828).IU("previous");
    },
    36759: function (e, t, n) {
      e.exports = n(9828).IU("schedule");
    },
    82300: function (e, t, n) {
      e.exports = n(9828).IU("search");
    },
    49219: function (e, t, n) {
      e.exports = n(9828).IU("security");
    },
    89749: function (e, t, n) {
      e.exports = n(9828).IU("server");
    },
    41022: function (e, t, n) {
      e.exports = n(9828).IU("trending-graph");
    },
    88205: function (e) {
      "use strict";
      var t = String.prototype.replace,
        n = /%20/g,
        r = "RFC1738",
        i = "RFC3986";
      e.exports = {
        default: i,
        formatters: {
          RFC1738: function (e) {
            return t.call(e, n, "+");
          },
          RFC3986: function (e) {
            return String(e);
          },
        },
        RFC1738: r,
        RFC3986: i,
      };
    },
    37059: function (e, t, n) {
      "use strict";
      var r = n(74154),
        i = n(5151),
        o = n(88205);
      e.exports = { formats: o, parse: i, stringify: r };
    },
    5151: function (e, t, n) {
      "use strict";
      var r = n(69978),
        i = Object.prototype.hasOwnProperty,
        o = Array.isArray,
        a = {
          allowDots: !1,
          allowPrototypes: !1,
          allowSparse: !1,
          arrayLimit: 20,
          charset: "utf-8",
          charsetSentinel: !1,
          comma: !1,
          decoder: r.decode,
          delimiter: "&",
          depth: 5,
          ignoreQueryPrefix: !1,
          interpretNumericEntities: !1,
          parameterLimit: 1e3,
          parseArrays: !0,
          plainObjects: !1,
          strictNullHandling: !1,
        },
        s = function (e) {
          return e.replace(/&#(\d+);/g, function (e, t) {
            return String.fromCharCode(parseInt(t, 10));
          });
        },
        c = function (e, t) {
          return e && "string" === typeof e && t.comma && e.indexOf(",") > -1
            ? e.split(",")
            : e;
        },
        l = function (e, t, n, r) {
          if (e) {
            var o = n.allowDots ? e.replace(/\.([^.[]+)/g, "[$1]") : e,
              a = /(\[[^[\]]*])/g,
              s = n.depth > 0 && /(\[[^[\]]*])/.exec(o),
              l = s ? o.slice(0, s.index) : o,
              u = [];
            if (l) {
              if (
                !n.plainObjects &&
                i.call(Object.prototype, l) &&
                !n.allowPrototypes
              )
                return;
              u.push(l);
            }
            for (
              var d = 0;
              n.depth > 0 && null !== (s = a.exec(o)) && d < n.depth;

            ) {
              if (
                ((d += 1),
                !n.plainObjects &&
                  i.call(Object.prototype, s[1].slice(1, -1)) &&
                  !n.allowPrototypes)
              )
                return;
              u.push(s[1]);
            }
            return (
              s && u.push("[" + o.slice(s.index) + "]"),
              (function (e, t, n, r) {
                for (var i = r ? t : c(t, n), o = e.length - 1; o >= 0; --o) {
                  var a,
                    s = e[o];
                  if ("[]" === s && n.parseArrays) a = [].concat(i);
                  else {
                    a = n.plainObjects ? Object.create(null) : {};
                    var l =
                        "[" === s.charAt(0) && "]" === s.charAt(s.length - 1)
                          ? s.slice(1, -1)
                          : s,
                      u = parseInt(l, 10);
                    n.parseArrays || "" !== l
                      ? !isNaN(u) &&
                        s !== l &&
                        String(u) === l &&
                        u >= 0 &&
                        n.parseArrays &&
                        u <= n.arrayLimit
                        ? ((a = [])[u] = i)
                        : "__proto__" !== l && (a[l] = i)
                      : (a = { 0: i });
                  }
                  i = a;
                }
                return i;
              })(u, t, n, r)
            );
          }
        };
      e.exports = function (e, t) {
        var n = (function (e) {
          if (!e) return a;
          if (
            null !== e.decoder &&
            void 0 !== e.decoder &&
            "function" !== typeof e.decoder
          )
            throw new TypeError("Decoder has to be a function.");
          if (
            "undefined" !== typeof e.charset &&
            "utf-8" !== e.charset &&
            "iso-8859-1" !== e.charset
          )
            throw new TypeError(
              "The charset option must be either utf-8, iso-8859-1, or undefined"
            );
          var t = "undefined" === typeof e.charset ? a.charset : e.charset;
          return {
            allowDots:
              "undefined" === typeof e.allowDots ? a.allowDots : !!e.allowDots,
            allowPrototypes:
              "boolean" === typeof e.allowPrototypes
                ? e.allowPrototypes
                : a.allowPrototypes,
            allowSparse:
              "boolean" === typeof e.allowSparse
                ? e.allowSparse
                : a.allowSparse,
            arrayLimit:
              "number" === typeof e.arrayLimit ? e.arrayLimit : a.arrayLimit,
            charset: t,
            charsetSentinel:
              "boolean" === typeof e.charsetSentinel
                ? e.charsetSentinel
                : a.charsetSentinel,
            comma: "boolean" === typeof e.comma ? e.comma : a.comma,
            decoder: "function" === typeof e.decoder ? e.decoder : a.decoder,
            delimiter:
              "string" === typeof e.delimiter || r.isRegExp(e.delimiter)
                ? e.delimiter
                : a.delimiter,
            depth:
              "number" === typeof e.depth || !1 === e.depth
                ? +e.depth
                : a.depth,
            ignoreQueryPrefix: !0 === e.ignoreQueryPrefix,
            interpretNumericEntities:
              "boolean" === typeof e.interpretNumericEntities
                ? e.interpretNumericEntities
                : a.interpretNumericEntities,
            parameterLimit:
              "number" === typeof e.parameterLimit
                ? e.parameterLimit
                : a.parameterLimit,
            parseArrays: !1 !== e.parseArrays,
            plainObjects:
              "boolean" === typeof e.plainObjects
                ? e.plainObjects
                : a.plainObjects,
            strictNullHandling:
              "boolean" === typeof e.strictNullHandling
                ? e.strictNullHandling
                : a.strictNullHandling,
          };
        })(t);
        if ("" === e || null === e || "undefined" === typeof e)
          return n.plainObjects ? Object.create(null) : {};
        for (
          var u =
              "string" === typeof e
                ? (function (e, t) {
                    var n,
                      l = {},
                      u = t.ignoreQueryPrefix ? e.replace(/^\?/, "") : e,
                      d =
                        t.parameterLimit === 1 / 0 ? void 0 : t.parameterLimit,
                      p = u.split(t.delimiter, d),
                      m = -1,
                      f = t.charset;
                    if (t.charsetSentinel)
                      for (n = 0; n < p.length; ++n)
                        0 === p[n].indexOf("utf8=") &&
                          ("utf8=%E2%9C%93" === p[n]
                            ? (f = "utf-8")
                            : "utf8=%26%2310003%3B" === p[n] &&
                              (f = "iso-8859-1"),
                          (m = n),
                          (n = p.length));
                    for (n = 0; n < p.length; ++n)
                      if (n !== m) {
                        var g,
                          h,
                          v = p[n],
                          b = v.indexOf("]="),
                          y = -1 === b ? v.indexOf("=") : b + 1;
                        -1 === y
                          ? ((g = t.decoder(v, a.decoder, f, "key")),
                            (h = t.strictNullHandling ? null : ""))
                          : ((g = t.decoder(
                              v.slice(0, y),
                              a.decoder,
                              f,
                              "key"
                            )),
                            (h = r.maybeMap(c(v.slice(y + 1), t), function (e) {
                              return t.decoder(e, a.decoder, f, "value");
                            }))),
                          h &&
                            t.interpretNumericEntities &&
                            "iso-8859-1" === f &&
                            (h = s(h)),
                          v.indexOf("[]=") > -1 && (h = o(h) ? [h] : h),
                          i.call(l, g)
                            ? (l[g] = r.combine(l[g], h))
                            : (l[g] = h);
                      }
                    return l;
                  })(e, n)
                : e,
            d = n.plainObjects ? Object.create(null) : {},
            p = Object.keys(u),
            m = 0;
          m < p.length;
          ++m
        ) {
          var f = p[m],
            g = l(f, u[f], n, "string" === typeof e);
          d = r.merge(d, g, n);
        }
        return !0 === n.allowSparse ? d : r.compact(d);
      };
    },
    74154: function (e, t, n) {
      "use strict";
      var r = n(37478),
        i = n(69978),
        o = n(88205),
        a = Object.prototype.hasOwnProperty,
        s = {
          brackets: function (e) {
            return e + "[]";
          },
          comma: "comma",
          indices: function (e, t) {
            return e + "[" + t + "]";
          },
          repeat: function (e) {
            return e;
          },
        },
        c = Array.isArray,
        l = Array.prototype.push,
        u = function (e, t) {
          l.apply(e, c(t) ? t : [t]);
        },
        d = Date.prototype.toISOString,
        p = o.default,
        m = {
          addQueryPrefix: !1,
          allowDots: !1,
          charset: "utf-8",
          charsetSentinel: !1,
          delimiter: "&",
          encode: !0,
          encoder: i.encode,
          encodeValuesOnly: !1,
          format: p,
          formatter: o.formatters[p],
          indices: !1,
          serializeDate: function (e) {
            return d.call(e);
          },
          skipNulls: !1,
          strictNullHandling: !1,
        },
        f = {},
        g = function e(t, n, o, a, s, l, d, p, g, h, v, b, y, _, E, w) {
          for (
            var O, S = t, k = w, C = 0, x = !1;
            void 0 !== (k = k.get(f)) && !x;

          ) {
            var N = k.get(t);
            if (((C += 1), "undefined" !== typeof N)) {
              if (N === C) throw new RangeError("Cyclic object value");
              x = !0;
            }
            "undefined" === typeof k.get(f) && (C = 0);
          }
          if (
            ("function" === typeof p
              ? (S = p(n, S))
              : S instanceof Date
              ? (S = v(S))
              : "comma" === o &&
                c(S) &&
                (S = i.maybeMap(S, function (e) {
                  return e instanceof Date ? v(e) : e;
                })),
            null === S)
          ) {
            if (s) return d && !_ ? d(n, m.encoder, E, "key", b) : n;
            S = "";
          }
          if (
            "string" === typeof (O = S) ||
            "number" === typeof O ||
            "boolean" === typeof O ||
            "symbol" === typeof O ||
            "bigint" === typeof O ||
            i.isBuffer(S)
          )
            return d
              ? [
                  y(_ ? n : d(n, m.encoder, E, "key", b)) +
                    "=" +
                    y(d(S, m.encoder, E, "value", b)),
                ]
              : [y(n) + "=" + y(String(S))];
          var P,
            I = [];
          if ("undefined" === typeof S) return I;
          if ("comma" === o && c(S))
            _ && d && (S = i.maybeMap(S, d)),
              (P = [{ value: S.length > 0 ? S.join(",") || null : void 0 }]);
          else if (c(p)) P = p;
          else {
            var T = Object.keys(S);
            P = g ? T.sort(g) : T;
          }
          for (
            var Z = a && c(S) && 1 === S.length ? n + "[]" : n, R = 0;
            R < P.length;
            ++R
          ) {
            var A = P[R],
              L =
                "object" === typeof A && "undefined" !== typeof A.value
                  ? A.value
                  : S[A];
            if (!l || null !== L) {
              var j = c(S)
                ? "function" === typeof o
                  ? o(Z, A)
                  : Z
                : Z + (h ? "." + A : "[" + A + "]");
              w.set(t, C);
              var D = r();
              D.set(f, w),
                u(
                  I,
                  e(
                    L,
                    j,
                    o,
                    a,
                    s,
                    l,
                    "comma" === o && _ && c(S) ? null : d,
                    p,
                    g,
                    h,
                    v,
                    b,
                    y,
                    _,
                    E,
                    D
                  )
                );
            }
          }
          return I;
        };
      e.exports = function (e, t) {
        var n,
          i = e,
          l = (function (e) {
            if (!e) return m;
            if (
              null !== e.encoder &&
              "undefined" !== typeof e.encoder &&
              "function" !== typeof e.encoder
            )
              throw new TypeError("Encoder has to be a function.");
            var t = e.charset || m.charset;
            if (
              "undefined" !== typeof e.charset &&
              "utf-8" !== e.charset &&
              "iso-8859-1" !== e.charset
            )
              throw new TypeError(
                "The charset option must be either utf-8, iso-8859-1, or undefined"
              );
            var n = o.default;
            if ("undefined" !== typeof e.format) {
              if (!a.call(o.formatters, e.format))
                throw new TypeError("Unknown format option provided.");
              n = e.format;
            }
            var r = o.formatters[n],
              i = m.filter;
            return (
              ("function" === typeof e.filter || c(e.filter)) && (i = e.filter),
              {
                addQueryPrefix:
                  "boolean" === typeof e.addQueryPrefix
                    ? e.addQueryPrefix
                    : m.addQueryPrefix,
                allowDots:
                  "undefined" === typeof e.allowDots
                    ? m.allowDots
                    : !!e.allowDots,
                charset: t,
                charsetSentinel:
                  "boolean" === typeof e.charsetSentinel
                    ? e.charsetSentinel
                    : m.charsetSentinel,
                delimiter:
                  "undefined" === typeof e.delimiter
                    ? m.delimiter
                    : e.delimiter,
                encode: "boolean" === typeof e.encode ? e.encode : m.encode,
                encoder:
                  "function" === typeof e.encoder ? e.encoder : m.encoder,
                encodeValuesOnly:
                  "boolean" === typeof e.encodeValuesOnly
                    ? e.encodeValuesOnly
                    : m.encodeValuesOnly,
                filter: i,
                format: n,
                formatter: r,
                serializeDate:
                  "function" === typeof e.serializeDate
                    ? e.serializeDate
                    : m.serializeDate,
                skipNulls:
                  "boolean" === typeof e.skipNulls ? e.skipNulls : m.skipNulls,
                sort: "function" === typeof e.sort ? e.sort : null,
                strictNullHandling:
                  "boolean" === typeof e.strictNullHandling
                    ? e.strictNullHandling
                    : m.strictNullHandling,
              }
            );
          })(t);
        "function" === typeof l.filter
          ? (i = (0, l.filter)("", i))
          : c(l.filter) && (n = l.filter);
        var d,
          p = [];
        if ("object" !== typeof i || null === i) return "";
        d =
          t && t.arrayFormat in s
            ? t.arrayFormat
            : t && "indices" in t
            ? t.indices
              ? "indices"
              : "repeat"
            : "indices";
        var f = s[d];
        if (t && "commaRoundTrip" in t && "boolean" !== typeof t.commaRoundTrip)
          throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
        var h = "comma" === f && t && t.commaRoundTrip;
        n || (n = Object.keys(i)), l.sort && n.sort(l.sort);
        for (var v = r(), b = 0; b < n.length; ++b) {
          var y = n[b];
          (l.skipNulls && null === i[y]) ||
            u(
              p,
              g(
                i[y],
                y,
                f,
                h,
                l.strictNullHandling,
                l.skipNulls,
                l.encode ? l.encoder : null,
                l.filter,
                l.sort,
                l.allowDots,
                l.serializeDate,
                l.format,
                l.formatter,
                l.encodeValuesOnly,
                l.charset,
                v
              )
            );
        }
        var _ = p.join(l.delimiter),
          E = !0 === l.addQueryPrefix ? "?" : "";
        return (
          l.charsetSentinel &&
            ("iso-8859-1" === l.charset
              ? (E += "utf8=%26%2310003%3B&")
              : (E += "utf8=%E2%9C%93&")),
          _.length > 0 ? E + _ : ""
        );
      };
    },
    69978: function (e, t, n) {
      "use strict";
      var r = n(88205),
        i = Object.prototype.hasOwnProperty,
        o = Array.isArray,
        a = (function () {
          for (var e = [], t = 0; t < 256; ++t)
            e.push("%" + ((t < 16 ? "0" : "") + t.toString(16)).toUpperCase());
          return e;
        })(),
        s = function (e, t) {
          for (
            var n = t && t.plainObjects ? Object.create(null) : {}, r = 0;
            r < e.length;
            ++r
          )
            "undefined" !== typeof e[r] && (n[r] = e[r]);
          return n;
        };
      e.exports = {
        arrayToObject: s,
        assign: function (e, t) {
          return Object.keys(t).reduce(function (e, n) {
            return (e[n] = t[n]), e;
          }, e);
        },
        combine: function (e, t) {
          return [].concat(e, t);
        },
        compact: function (e) {
          for (
            var t = [{ obj: { o: e }, prop: "o" }], n = [], r = 0;
            r < t.length;
            ++r
          )
            for (
              var i = t[r], a = i.obj[i.prop], s = Object.keys(a), c = 0;
              c < s.length;
              ++c
            ) {
              var l = s[c],
                u = a[l];
              "object" === typeof u &&
                null !== u &&
                -1 === n.indexOf(u) &&
                (t.push({ obj: a, prop: l }), n.push(u));
            }
          return (
            (function (e) {
              for (; e.length > 1; ) {
                var t = e.pop(),
                  n = t.obj[t.prop];
                if (o(n)) {
                  for (var r = [], i = 0; i < n.length; ++i)
                    "undefined" !== typeof n[i] && r.push(n[i]);
                  t.obj[t.prop] = r;
                }
              }
            })(t),
            e
          );
        },
        decode: function (e, t, n) {
          var r = e.replace(/\+/g, " ");
          if ("iso-8859-1" === n) return r.replace(/%[0-9a-f]{2}/gi, unescape);
          try {
            return decodeURIComponent(r);
          } catch (i) {
            return r;
          }
        },
        encode: function (e, t, n, i, o) {
          if (0 === e.length) return e;
          var s = e;
          if (
            ("symbol" === typeof e
              ? (s = Symbol.prototype.toString.call(e))
              : "string" !== typeof e && (s = String(e)),
            "iso-8859-1" === n)
          )
            return escape(s).replace(/%u[0-9a-f]{4}/gi, function (e) {
              return "%26%23" + parseInt(e.slice(2), 16) + "%3B";
            });
          for (var c = "", l = 0; l < s.length; ++l) {
            var u = s.charCodeAt(l);
            45 === u ||
            46 === u ||
            95 === u ||
            126 === u ||
            (u >= 48 && u <= 57) ||
            (u >= 65 && u <= 90) ||
            (u >= 97 && u <= 122) ||
            (o === r.RFC1738 && (40 === u || 41 === u))
              ? (c += s.charAt(l))
              : u < 128
              ? (c += a[u])
              : u < 2048
              ? (c += a[192 | (u >> 6)] + a[128 | (63 & u)])
              : u < 55296 || u >= 57344
              ? (c +=
                  a[224 | (u >> 12)] +
                  a[128 | ((u >> 6) & 63)] +
                  a[128 | (63 & u)])
              : ((l += 1),
                (u = 65536 + (((1023 & u) << 10) | (1023 & s.charCodeAt(l)))),
                (c +=
                  a[240 | (u >> 18)] +
                  a[128 | ((u >> 12) & 63)] +
                  a[128 | ((u >> 6) & 63)] +
                  a[128 | (63 & u)]));
          }
          return c;
        },
        isBuffer: function (e) {
          return (
            !(!e || "object" !== typeof e) &&
            !!(
              e.constructor &&
              e.constructor.isBuffer &&
              e.constructor.isBuffer(e)
            )
          );
        },
        isRegExp: function (e) {
          return "[object RegExp]" === Object.prototype.toString.call(e);
        },
        maybeMap: function (e, t) {
          if (o(e)) {
            for (var n = [], r = 0; r < e.length; r += 1) n.push(t(e[r]));
            return n;
          }
          return t(e);
        },
        merge: function e(t, n, r) {
          if (!n) return t;
          if ("object" !== typeof n) {
            if (o(t)) t.push(n);
            else {
              if (!t || "object" !== typeof t) return [t, n];
              ((r && (r.plainObjects || r.allowPrototypes)) ||
                !i.call(Object.prototype, n)) &&
                (t[n] = !0);
            }
            return t;
          }
          if (!t || "object" !== typeof t) return [t].concat(n);
          var a = t;
          return (
            o(t) && !o(n) && (a = s(t, r)),
            o(t) && o(n)
              ? (n.forEach(function (n, o) {
                  if (i.call(t, o)) {
                    var a = t[o];
                    a && "object" === typeof a && n && "object" === typeof n
                      ? (t[o] = e(a, n, r))
                      : t.push(n);
                  } else t[o] = n;
                }),
                t)
              : Object.keys(n).reduce(function (t, o) {
                  var a = n[o];
                  return i.call(t, o) ? (t[o] = e(t[o], a, r)) : (t[o] = a), t;
                }, a)
          );
        },
      };
    },
    21702: function (e, t) {
      var n;
      !(function () {
        "use strict";
        var r = {}.hasOwnProperty;
        function i() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t];
            if (n) {
              var o = typeof n;
              if ("string" === o || "number" === o) e.push(n);
              else if (Array.isArray(n)) {
                if (n.length) {
                  var a = i.apply(null, n);
                  a && e.push(a);
                }
              } else if ("object" === o) {
                if (
                  n.toString !== Object.prototype.toString &&
                  !n.toString.toString().includes("[native code]")
                ) {
                  e.push(n.toString());
                  continue;
                }
                for (var s in n) r.call(n, s) && n[s] && e.push(s);
              }
            }
          }
          return e.join(" ");
        }
        e.exports
          ? ((i.default = i), (e.exports = i))
          : void 0 ===
              (n = function () {
                return i;
              }.apply(t, [])) || (e.exports = n);
      })();
    },
    33372: function (e, t) {
      var n;
      !(function () {
        "use strict";
        var r = {}.hasOwnProperty;
        function i() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t];
            if (n) {
              var o = typeof n;
              if ("string" === o || "number" === o) e.push(n);
              else if (Array.isArray(n)) {
                if (n.length) {
                  var a = i.apply(null, n);
                  a && e.push(a);
                }
              } else if ("object" === o) {
                if (
                  n.toString !== Object.prototype.toString &&
                  !n.toString.toString().includes("[native code]")
                ) {
                  e.push(n.toString());
                  continue;
                }
                for (var s in n) r.call(n, s) && n[s] && e.push(s);
              }
            }
          }
          return e.join(" ");
        }
        e.exports
          ? ((i.default = i), (e.exports = i))
          : void 0 ===
              (n = function () {
                return i;
              }.apply(t, [])) || (e.exports = n);
      })();
    },
    92909: function (e, t) {
      var n;
      !(function () {
        "use strict";
        var r = {}.hasOwnProperty;
        function i() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t];
            if (n) {
              var o = typeof n;
              if ("string" === o || "number" === o) e.push(n);
              else if (Array.isArray(n)) {
                if (n.length) {
                  var a = i.apply(null, n);
                  a && e.push(a);
                }
              } else if ("object" === o) {
                if (
                  n.toString !== Object.prototype.toString &&
                  !n.toString.toString().includes("[native code]")
                ) {
                  e.push(n.toString());
                  continue;
                }
                for (var s in n) r.call(n, s) && n[s] && e.push(s);
              }
            }
          }
          return e.join(" ");
        }
        e.exports
          ? ((i.default = i), (e.exports = i))
          : void 0 ===
              (n = function () {
                return i;
              }.apply(t, [])) || (e.exports = n);
      })();
    },
    67847: function (e, t) {
      var n;
      !(function () {
        "use strict";
        var r = {}.hasOwnProperty;
        function i() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t];
            if (n) {
              var o = typeof n;
              if ("string" === o || "number" === o) e.push(n);
              else if (Array.isArray(n)) {
                if (n.length) {
                  var a = i.apply(null, n);
                  a && e.push(a);
                }
              } else if ("object" === o) {
                if (
                  n.toString !== Object.prototype.toString &&
                  !n.toString.toString().includes("[native code]")
                ) {
                  e.push(n.toString());
                  continue;
                }
                for (var s in n) r.call(n, s) && n[s] && e.push(s);
              }
            }
          }
          return e.join(" ");
        }
        e.exports
          ? ((i.default = i), (e.exports = i))
          : void 0 ===
              (n = function () {
                return i;
              }.apply(t, [])) || (e.exports = n);
      })();
    },
    716: function (e, t, n) {
      "use strict";
      n.d(t, {
        C: function () {
          return i;
        },
        j: function () {
          return r;
        },
      });
      var r = {
          cartPage: "/cart/",
          checkoutPage: "/payment/checkout/",
          keepShopping: "/",
          wishlistPage: "/home/my-courses/wishlist/",
        },
        i = {
          errors: function (e) {
            return {
              get failAddToCart() {
                return e("We couldn't add this item.");
              },
              get cartUnavailableShort() {
                return e("Unavailable");
              },
              get cartUnavailable() {
                return e(
                  "Sorry, the shopping cart is temporarily unavailable."
                );
              },
              get stillWorking() {
                return e("Still working on it...");
              },
            };
          },
          timing: { addToCartSlow: 5e3 },
          urls: r,
        };
    },
    43069: function (e, t, n) {
      "use strict";
      n.d(t, {
        d6: function () {
          return k;
        },
      });
      var r = n(59499),
        i = n(17674),
        o = n(17784),
        a = n.n(o),
        s = n(22188),
        c = n(80955),
        l = n(67294),
        u = n(34917),
        d = n(78270),
        p = n(46067),
        m = n(79594),
        f = n(45566),
        g = n(61646),
        h = n(88309),
        v = n(39865),
        b = n(36186),
        y = n(49062),
        _ = n(716);
      function E(e, t) {
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
      function w() {}
      var O = function (e) {
          var t = e.notification,
            n = e.notificationStyle;
          return l.createElement(
            l.Fragment,
            null,
            t && l.createElement("span", { className: n }, t)
          );
        },
        S = function (e) {
          var t = e.buttonContent,
            n = e.isAdding,
            r = e.isReady,
            i = e.loader;
          return l.createElement(l.Fragment, null, !r || (n && i), !n && t);
        },
        k = (0, c.Pi)(function (e) {
          var t = e.addToCartContext,
            n = e.addToCartSuccessModal,
            o = e.allowAddToCartSuccessModal,
            c = void 0 === o || o,
            k = e.buttonClass,
            C = void 0 === k ? f.zx : k,
            x = e.buttonStyleProps,
            N = void 0 === x ? {} : x,
            P = e.buyables,
            I = void 0 === P ? [] : P,
            T = e.cartButtonClassesAdd,
            Z = void 0 === T ? "" : T,
            R = e.cartButtonClassesGoToCart,
            A = void 0 === R ? "" : R,
            L = e.cartButtonTextAdd,
            j = e.cartButtonTextGoToCart,
            D = e.disabled,
            M = void 0 !== D && D,
            z = e.forceGoToCart,
            U = void 0 !== z && z,
            F = e.forceSuccessModalOnMobile,
            B = void 0 !== F && F,
            W = e.loader,
            H = e.notificationStyle,
            Q = void 0 === H ? "" : H,
            V = e.onAddRedirectUrl,
            q = void 0 === V ? _.C.urls.cartPage : V,
            G = e.onRequestFinish,
            X = void 0 === G ? w : G,
            Y = e.onRequestStart,
            K = void 0 === Y ? w : Y,
            J = e.shoppingClient,
            $ = e.showCartSuccessModal,
            ee = void 0 === $ ? w : $,
            te = (0, b.gL)(),
            ne = (0, m.QT)(),
            re = ne.gettext,
            ie = ne.interpolate,
            oe = ne.ngettext,
            ae = l.useState(!1),
            se = (0, i.Z)(ae, 2),
            ce = se[0],
            le = se[1],
            ue = l.useState(null),
            de = (0, i.Z)(ue, 2),
            pe = de[0],
            me = de[1],
            fe = l.useState(""),
            ge = (0, i.Z)(fe, 2),
            he = ge[0],
            ve = ge[1];
          function be() {
            return !M && J.lists.cart.hasBuyables(I);
          }
          function ye() {
            return (
              le(!1),
              me(null),
              (function () {
                var e = new URLSearchParams(h.N.global.location.search),
                  t = (0, v.KK)(e)
                    .get()
                    .filter(function (e) {
                      return !J.discounts.codes.includes(e);
                    });
                return new Promise(function (e) {
                  return J.applyDiscounts(t), e(!0);
                });
              })()
            );
          }
          function _e() {
            return (
              le(!1),
              me(_.C.errors(re).failAddToCart),
              d.j.publishEvent(
                new y.sy({
                  buyables: I.map(function (e) {
                    return {
                      type: e.buyable_object_type,
                      id: e.id,
                      trackingId: e.frontendTrackingId,
                    };
                  }),
                  action: "add",
                  uiRegion: "add_to_cart",
                })
              ),
              X(),
              Promise.reject(new Error("Add to cart failed."))
            );
          }
          var Ee = J.status.get(),
            we = !M && Ee === v.ES.storage.status.ready,
            Oe = !we || Ee === v.ES.storage.status.unAvailable || ce,
            Se = l.createElement(S, {
              isReady: we,
              isAdding: ce,
              buttonContent: be()
                ? j || re("Go to cart")
                : J.status.get() === v.ES.storage.status.unAvailable
                ? _.C.errors(re).cartUnavailableShort
                : L || re("Add to cart"),
              loader: W,
            }),
            ke = (function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = null != arguments[t] ? arguments[t] : {};
                t % 2
                  ? E(Object(n), !0).forEach(function (t) {
                      (0, r.Z)(e, t, n[t]);
                    })
                  : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(
                      e,
                      Object.getOwnPropertyDescriptors(n)
                    )
                  : E(Object(n)).forEach(function (t) {
                      Object.defineProperty(
                        e,
                        t,
                        Object.getOwnPropertyDescriptor(n, t)
                      );
                    });
              }
              return e;
            })(
              {
                "data-testid": "add-to-cart-button",
                className: a()("add-to-cart", be() ? A : Z),
                disabled: Oe,
                onClick: function () {
                  return (
                    (function () {
                      if (be()) {
                        var e = I[0];
                        e &&
                          d.j.publishEvent(
                            new p.Rd({
                              componentName: "goToCart",
                              trackingId:
                                (null === e || void 0 === e
                                  ? void 0
                                  : e.frontendTrackingId) ||
                                (null === e || void 0 === e
                                  ? void 0
                                  : e.tracking_id),
                              relatedObjectId:
                                null === e || void 0 === e ? void 0 : e.id,
                              relatedObjectType: "course",
                            })
                          );
                      } else {
                        var t = !0;
                        I.forEach(function (e) {
                          e.frontendTrackingId || e.tracking_id || (t = !1);
                        }),
                          t &&
                            d.j.publishEvent(
                              new y.HS({
                                buyables: I.map(function (e) {
                                  return {
                                    type: e.buyable_object_type,
                                    id: e.id,
                                    trackingId:
                                      e.frontendTrackingId || e.tracking_id,
                                  };
                                }),
                              })
                            );
                      }
                    })(),
                    (0, u.Y)(function (e) {
                      if (
                        !te.me.is_authenticated &&
                        e.isPushPermissionGranted() &&
                        J.lists.cart.isEmpty
                      ) {
                        var t = I.map(function (e) {
                          return e.id;
                        });
                        e.logCustomEvent("UserCartAbandonment", {
                          courses_in_cart: t,
                        });
                      }
                    }),
                    be()
                      ? void (h.N.global.location.href = _.C.urls.cartPage)
                      : (function () {
                          var e = te.request;
                          return (
                            le(!0),
                            K(),
                            setTimeout(
                              (0, s.aD)(function () {
                                ce && me(_.C.errors(re).stillWorking);
                              }),
                              _.C.timing.addToCartSlow
                            ),
                            J.addToList("cart", I, t)
                              .then(ye, _e)
                              .then(
                                (0, s.aD)(function () {
                                  X(),
                                    e.isMobile
                                      ? B
                                        ? ee()
                                        : (h.N.global.location.href = q)
                                      : c
                                      ? ee()
                                      : (ve(
                                          ie(
                                            oe(
                                              "%(cartCount)s item added to cart.",
                                              "%(cartCount)s items added to cart.",
                                              I.length
                                            ),
                                            { cartCount: I.length },
                                            !0
                                          )
                                        ),
                                        U && (h.N.global.location.href = q));
                                })
                              )
                              .catch(function (e) {
                                (0, g.Tb)(e);
                              })
                          );
                        })()
                  );
                },
                style: { width: "100%" },
              },
              N
            ),
            Ce = l.createElement(C, ke, Se);
          return l.createElement(
            "div",
            { "data-purpose": "add-to-cart" },
            Ce,
            n,
            l.createElement(O, { notification: pe, notificationStyle: Q }),
            l.createElement(
              "div",
              {
                role: "status",
                className: "ud-sr-only",
                "data-purpose": "screen-reader-message",
              },
              he
            )
          );
        });
      k.displayName = "GenericAddToCart";
    },
    49062: function (e, t, n) {
      "use strict";
      n.d(t, {
        HS: function () {
          return d;
        },
        a0: function () {
          return u;
        },
        sy: function () {
          return p;
        },
      });
      var r = n(82262),
        i = n(92777),
        o = n(45959),
        a = n(63553),
        s = n(37247),
        c = n(24076);
      function l(e) {
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
          var n,
            r = (0, s.Z)(e);
          if (t) {
            var i = (0, s.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, a.Z)(this, n);
        };
      }
      var u = { COURSE: "course", SUBSCRIPTION: "subscription" },
        d = (function (e) {
          (0, o.Z)(n, e);
          var t = l(n);
          function n(e) {
            var r;
            (0, i.Z)(this, n);
            var o = e.buyables;
            return (
              ((r = t.call(this, "AddToCartEvent")).buyables = void 0),
              (r.buyables = o),
              r
            );
          }
          return (0, r.Z)(n);
        })(c.rp),
        p = (function (e) {
          (0, o.Z)(n, e);
          var t = l(n);
          function n(e) {
            var r;
            (0, i.Z)(this, n);
            var o = e.buyables,
              a = e.action,
              s = e.uiRegion;
            return (
              ((r = t.call(this, "CartErrorDisplayEvent")).buyables = void 0),
              (r.action = void 0),
              (r.uiRegion = void 0),
              (r.buyables = o),
              (r.action = a),
              (r.uiRegion = s),
              r
            );
          }
          return (0, r.Z)(n);
        })(c.rp);
    },
    72820: function (e, t, n) {
      "use strict";
      n.d(t, {
        c: function () {
          return m;
        },
      });
      var r = n(92777),
        i = n(82262),
        o = n(45959),
        a = n(63553),
        s = n(37247),
        c = n(67294),
        l = n(73935),
        u = n(36526),
        d = n(34278);
      function p(e) {
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
          var n,
            r = (0, s.Z)(e);
          if (t) {
            var i = (0, s.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, a.Z)(this, n);
        };
      }
      var m = (function (e) {
        (0, o.Z)(n, e);
        var t = p(n);
        function n() {
          var e;
          return (
            (0, r.Z)(this, n),
            ((e = t.apply(this, arguments)).element = null),
            (e.detachedContent = null),
            (e.onKeyDown = function (t) {
              var n = t.which || t.keyCode;
              if (n === d.R.UP || n === d.R.DOWN) {
                var r = e.props.getCycle(e.element),
                  i = r.findIndex(function (e) {
                    return e === document.activeElement;
                  }),
                  o = null;
                i >= 0 && n === d.R.DOWN
                  ? (o = (i + 1) % r.length)
                  : i >= 0 &&
                    n === d.R.UP &&
                    (o = (i - 1 + r.length) % r.length),
                  null !== o && r[o] && (t.preventDefault(), r[o].focus());
              }
            }),
            e
          );
        }
        return (
          (0, i.Z)(n, [
            {
              key: "componentDidMount",
              value: function () {
                var e, t;
                ((this.element = l.findDOMNode(this)),
                null === (e = this.element) ||
                  void 0 === e ||
                  e.addEventListener("keydown", this.onKeyDown),
                this.props.detachedContent) &&
                  ((this.detachedContent = this.props.detachedContent.current),
                  null === (t = this.detachedContent) ||
                    void 0 === t ||
                    t.addEventListener("keydown", this.onKeyDown));
              },
            },
            {
              key: "componentWillUnmount",
              value: function () {
                var e, t;
                (null === (e = this.element) ||
                  void 0 === e ||
                  e.removeEventListener("keydown", this.onKeyDown),
                (this.element = null),
                this.props.detachedContent) &&
                  (null === (t = this.detachedContent) ||
                    void 0 === t ||
                    t.removeEventListener("keydown", this.onKeyDown),
                  (this.detachedContent = null));
              },
            },
            {
              key: "render",
              value: function () {
                return c.Children.only(this.props.children);
              },
            },
          ]),
          n
        );
      })(c.Component);
      m.defaultProps = { getCycle: u.W };
    },
    23177: function (e, t, n) {
      "use strict";
      n.d(t, {
        o: function () {
          return se;
        },
      });
      var r,
        i,
        o,
        a,
        s,
        c,
        l,
        u = n(50029),
        d = n(92777),
        p = n(82262),
        m = n(45959),
        f = n(63553),
        g = n(37247),
        h = n(87794),
        v = n.n(h),
        b = n(53229),
        y = n(88572),
        _ = n(67294),
        E = n(59499),
        w = n(67666),
        O = n.n(w),
        S = n(80955),
        k = n(11577),
        C = n.n(k),
        x = n(10575),
        N = n.n(x),
        P = n(55615),
        I = n.n(P),
        T = n(93630),
        Z = n.n(T),
        R = n(76185),
        A = n.n(R),
        L = n(36759),
        j = n.n(L),
        D = n(70049),
        M = n.n(D),
        z = n(54742),
        U = n(45566),
        F = n(25074),
        B = n(43269),
        W = n(22188),
        H = n(76581),
        Q =
          ((r = (function () {
            function e() {
              (0, d.Z)(this, e),
                (0, B.Z)(this, "focusedItemId", i, this),
                (this._state = void 0),
                (this._expiration = void 0),
                (this._expiration = new Date(Date.now() + 18e5)),
                (this._state = (0, H.H)(
                  "eventDebuggerStorage",
                  "storage-1.0",
                  this._expiration
                ));
              var t = new URLSearchParams(window.location.search).get(
                "debug_events"
              );
              if (null !== t) {
                var n = "false" !== t && "0" !== t;
                this._state.set("isEnabled", n);
              }
              this.isEnabled && this._state.updateExpiration(this._expiration);
            }
            return (
              (0, p.Z)(e, [
                {
                  key: "invertPosition",
                  value: function () {
                    this._state.set(
                      "isInvertedPosition",
                      !this.isInvertedPosition
                    );
                  },
                },
                {
                  key: "disable",
                  value: function () {
                    this._state.set("isEnabled", !1);
                  },
                },
                {
                  key: "isEnabled",
                  get: function () {
                    return this._state.get("isEnabled") || !1;
                  },
                },
                {
                  key: "isInvertedPosition",
                  get: function () {
                    return this._state.get("isInvertedPosition") || !1;
                  },
                },
                {
                  key: "setFocusedItemId",
                  value: function (e) {
                    this.focusedItemId = e;
                  },
                },
              ]),
              e
            );
          })()),
          (i = (0, b.Z)(r.prototype, "focusedItemId", [W.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (0, b.Z)(
            r.prototype,
            "invertPosition",
            [y.ZP],
            Object.getOwnPropertyDescriptor(r.prototype, "invertPosition"),
            r.prototype
          ),
          (0, b.Z)(
            r.prototype,
            "disable",
            [y.ZP],
            Object.getOwnPropertyDescriptor(r.prototype, "disable"),
            r.prototype
          ),
          (0, b.Z)(
            r.prototype,
            "isEnabled",
            [W.Fl],
            Object.getOwnPropertyDescriptor(r.prototype, "isEnabled"),
            r.prototype
          ),
          (0, b.Z)(
            r.prototype,
            "isInvertedPosition",
            [W.Fl],
            Object.getOwnPropertyDescriptor(r.prototype, "isInvertedPosition"),
            r.prototype
          ),
          (0, b.Z)(
            r.prototype,
            "setFocusedItemId",
            [y.ZP, W.aD],
            Object.getOwnPropertyDescriptor(r.prototype, "setFocusedItemId"),
            r.prototype
          ),
          r),
        V = n(41564),
        q = n.n(V);
      function G(e) {
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
          var n,
            r = (0, g.Z)(e);
          if (t) {
            var i = (0, g.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, f.Z)(this, n);
        };
      }
      var X,
        Y,
        K,
        J,
        $ =
          ((o = {}),
          (0, E.Z)(o, F.N3.WAITING, {
            label: "Waiting",
            statusIcon: _.createElement(j(), {
              label: "Waiting",
              color: "neutral",
            }),
            textStyle: "subdued",
          }),
          (0, E.Z)(o, F.N3.FAILURE, {
            label: "Failure",
            statusIcon: _.createElement(I(), {
              label: "Failure",
              color: "negative",
            }),
            textStyle: "negative",
          }),
          (0, E.Z)(o, F.N3.SUCCESS, {
            label: "Success",
            statusIcon: _.createElement(M(), {
              label: "Success",
              color: "positive",
            }),
            textStyle: "positive",
          }),
          (0, E.Z)(o, F.N3.BEACON_SENT, {
            label: "Sent with Beacon API",
            statusIcon: _.createElement(M(), {
              label: "Sent with Beacon API",
              color: "neutral",
            }),
            textStyle: "subdued",
          }),
          o),
        ee =
          (0, S.Pi)(
            ((s = (function (e) {
              (0, m.Z)(n, e);
              var t = G(n);
              function n() {
                return (0, d.Z)(this, n), t.apply(this, arguments);
              }
              return (
                (0, p.Z)(n, [
                  {
                    key: "toggleFocus",
                    value: function () {
                      var e = this.props,
                        t = e.eventInfo,
                        n = e.store,
                        r = t.event.eventId;
                      n.focusedItemId === r
                        ? n.setFocusedItemId(null)
                        : n.setFocusedItemId(r);
                    },
                  },
                  {
                    key: "resetFocus",
                    value: function () {
                      var e = this.props,
                        t = e.eventInfo,
                        n = e.store,
                        r = t.event.eventId;
                      n.focusedItemId &&
                        n.focusedItemId !== r &&
                        n.setFocusedItemId(null);
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this.props,
                        t = e.eventInfo,
                        n = e.store,
                        r = t.event,
                        i = t.status,
                        o = t.failureReason,
                        a = $[i],
                        s = a.label,
                        c = a.textStyle,
                        l = a.statusIcon;
                      return _.createElement(
                        z.W.Item,
                        {
                          componentClass: "button",
                          "data-testid": "blocklist-item",
                          className: O()(
                            "blocklist-item",
                            q()["blocklist-item"],
                            r.eventId === n.focusedItemId
                              ? "".concat(q().focused, " focused")
                              : ""
                          ),
                          style: { userSelect: "text" },
                          icon: l,
                          onClick: this.toggleFocus,
                          onMouseEnter: this.resetFocus,
                        },
                        _.createElement(
                          "span",
                          {
                            className: O()(
                              "ud-heading-sm",
                              q().subdued,
                              q()["item-text"]
                            ),
                          },
                          r.getType()
                        ),
                        _.createElement(
                          "div",
                          {
                            className: O()(
                              q().panel,
                              q()["tooltip-panel"],
                              "tooltip-panel"
                            ),
                          },
                          _.createElement(
                            "div",
                            { className: O()("ud-heading-md", c) },
                            "".concat(s, ": ").concat(r.getType())
                          ),
                          o && _.createElement("h4", null, o),
                          i === F.N3.BEACON_SENT &&
                            _.createElement(
                              "pre",
                              {
                                className: O()(
                                  "ud-text-xs",
                                  q()["tooltip-panel-body"]
                                ),
                              },
                              "This event was sent with Beacon API on a tab change. Beacon API doesn't expose server responses. If you want to see the response from Collector, don't switch tabs until this event is sent."
                            ),
                          _.createElement(
                            "pre",
                            {
                              className: O()(
                                "ud-text-xs",
                                q()["tooltip-panel-body"]
                              ),
                            },
                            JSON.stringify(r, null, 4)
                          )
                        )
                      );
                    },
                  },
                ]),
                n
              );
            })(_.Component)),
            (0, b.Z)(
              s.prototype,
              "toggleFocus",
              [y.ZP],
              Object.getOwnPropertyDescriptor(s.prototype, "toggleFocus"),
              s.prototype
            ),
            (0, b.Z)(
              s.prototype,
              "resetFocus",
              [y.ZP],
              Object.getOwnPropertyDescriptor(s.prototype, "resetFocus"),
              s.prototype
            ),
            (a = s))
          ) || a,
        te =
          (0, S.Pi)(
            ((l = (function (e) {
              (0, m.Z)(n, e);
              var t = G(n);
              function n(e) {
                var r;
                return (
                  (0, d.Z)(this, n),
                  ((r = t.call(this, e)).MAX_EVENTS_TO_SHOW = void 0),
                  (r.store = void 0),
                  (r.store = new Q()),
                  (r.MAX_EVENTS_TO_SHOW =
                    !0 === r.props.isMobile
                      ? n.MAX_EVENTS_TO_SHOW_MOBILE
                      : n.MAX_EVENTS_TO_SHOW_DESKTOP),
                  r
                );
              }
              return (
                (0, p.Z)(n, [
                  {
                    key: "render",
                    value: function () {
                      var e = this;
                      if (!this.store.isEnabled) return null;
                      var t = this.props.eventInfoStore;
                      return _.createElement(
                        "div",
                        {
                          "data-testid": "tracker-debugger",
                          className: O()(
                            q().panel,
                            q()["debugger-panel"],
                            this.store.isInvertedPosition
                              ? q()["left-debugger-panel"]
                              : q()["right-debugger-panel"]
                          ),
                        },
                        _.createElement(
                          "div",
                          { className: q()["debugger-panel-header"] },
                          _.createElement(
                            U.zx,
                            {
                              onClick: this.store.invertPosition,
                              udStyle: "secondary",
                              size: "small",
                              className: q().control,
                            },
                            this.store.isInvertedPosition
                              ? _.createElement(Z(), {
                                  color: "inherit",
                                  size: "medium",
                                  label: "Invert position",
                                })
                              : _.createElement(A(), {
                                  color: "inherit",
                                  size: "medium",
                                  label: "Invert position",
                                })
                          ),
                          _.createElement(
                            U.zx,
                            {
                              onClick: t.clearEvents,
                              udStyle: "secondary",
                              size: "small",
                              className: q().control,
                            },
                            _.createElement(N(), {
                              color: "inherit",
                              size: "medium",
                              label: "Clear events",
                            })
                          ),
                          _.createElement(
                            U.zx,
                            {
                              onClick: this.store.disable,
                              udStyle: "secondary",
                              size: "small",
                              className: q().control,
                            },
                            _.createElement(C(), {
                              color: "inherit",
                              size: "medium",
                              label: "Close debugger",
                            })
                          )
                        ),
                        _.createElement(
                          z.W,
                          {
                            className: O()(
                              q()["debugger-panel-body"],
                              "debugger-panel-body"
                            ),
                            size: "small",
                          },
                          t.eventInfos
                            .slice(-this.MAX_EVENTS_TO_SHOW)
                            .map(function (t) {
                              return _.createElement(ee, {
                                key: t.event.eventId,
                                eventInfo: t,
                                store: e.store,
                              });
                            })
                        )
                      );
                    },
                  },
                ]),
                n
              );
            })(_.Component)),
            (l.MAX_EVENTS_TO_SHOW_DESKTOP = 15),
            (l.MAX_EVENTS_TO_SHOW_MOBILE = 5),
            (c = l))
          ) || c,
        ne = n(78270),
        re = (0, p.Z)(function e(t, n, r) {
          (0, d.Z)(this, e),
            (this.event = t),
            (this.status = n),
            (this.failureReason = r);
        }),
        ie =
          ((K = (function () {
            function e() {
              (0, d.Z)(this, e), (0, B.Z)(this, "eventInfosById", Y, this);
            }
            return (
              (0, p.Z)(e, [
                {
                  key: "updateEventStatus",
                  value: function (t, n, r) {
                    if (
                      (this.eventInfosById.set(t.eventId, new re(t, n, r)),
                      this.eventInfosById.size > e.MAX_EVENT_SHOWN)
                    ) {
                      var i = this.eventInfos[0];
                      this.eventInfosById.delete(i.event.eventId);
                    }
                  },
                },
                {
                  key: "clearEvents",
                  value: function () {
                    this.eventInfosById.clear();
                  },
                },
                {
                  key: "eventInfos",
                  get: function () {
                    return Array.from(this.eventInfosById.values());
                  },
                },
              ]),
              e
            );
          })()),
          (K.MAX_EVENT_SHOWN = 100),
          (X = K),
          (Y = (0, b.Z)(X.prototype, "eventInfosById", [W.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return new Map();
            },
          })),
          (0, b.Z)(
            X.prototype,
            "updateEventStatus",
            [y.ZP, W.aD],
            Object.getOwnPropertyDescriptor(X.prototype, "updateEventStatus"),
            X.prototype
          ),
          (0, b.Z)(
            X.prototype,
            "clearEvents",
            [y.ZP, W.aD],
            Object.getOwnPropertyDescriptor(X.prototype, "clearEvents"),
            X.prototype
          ),
          (0, b.Z)(
            X.prototype,
            "eventInfos",
            [W.Fl],
            Object.getOwnPropertyDescriptor(X.prototype, "eventInfos"),
            X.prototype
          ),
          X),
        oe = n(46067);
      function ae(e) {
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
          var n,
            r = (0, g.Z)(e);
          if (t) {
            var i = (0, g.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, f.Z)(this, n);
        };
      }
      var se =
        ((J = (function (e) {
          (0, m.Z)(n, e);
          var t = ae(n);
          function n(e) {
            var r;
            return (
              (0, d.Z)(this, n),
              ((r = t.call(this, e)).eventInfoStore = void 0),
              (r.debugRef = _.createRef()),
              (r.handlePageShowEvent = function (e) {
                e.persisted && ne.Z.publishEvent(new oe.i());
              }),
              (r.eventInfoStore = new ie()),
              r
            );
          }
          return (
            (0, p.Z)(n, [
              {
                key: "componentDidMount",
                value: (function () {
                  var e = (0, u.Z)(
                    v().mark(function e() {
                      return v().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                this.props.trackingContext &&
                                  ne.Z.initialize(
                                    this.props.trackingContext,
                                    this.publishHook
                                  ),
                                  ne.Z.setPublishHook(this.publishHook),
                                  ne.Z.publishEvent(new oe.NT()),
                                  this.initializePageTracking(),
                                  window.addEventListener(
                                    "pageshow",
                                    this.handlePageShowEvent
                                  );
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
                  return function () {
                    return e.apply(this, arguments);
                  };
                })(),
              },
              {
                key: "componentWillUnmount",
                value: function () {
                  window.removeEventListener(
                    "pageshow",
                    this.handlePageShowEvent
                  );
                },
              },
              {
                key: "initializePageTracking",
                value: function () {
                  this.props.spaTrackingActive ||
                    ne.Z.publishEvent(new oe.OX(!1));
                },
              },
              {
                key: "publishHook",
                value: function (e, t, n) {
                  this.eventInfoStore.updateEventStatus(e, t, n);
                },
              },
              {
                key: "render",
                value: function () {
                  return _.createElement(te, {
                    ref: this.debugRef,
                    eventInfoStore: this.eventInfoStore,
                  });
                },
              },
            ]),
            n
          );
        })(_.Component)),
        (0, b.Z)(
          J.prototype,
          "componentDidMount",
          [y.ZP],
          Object.getOwnPropertyDescriptor(J.prototype, "componentDidMount"),
          J.prototype
        ),
        (0, b.Z)(
          J.prototype,
          "componentWillUnmount",
          [y.ZP],
          Object.getOwnPropertyDescriptor(J.prototype, "componentWillUnmount"),
          J.prototype
        ),
        (0, b.Z)(
          J.prototype,
          "publishHook",
          [y.ZP],
          Object.getOwnPropertyDescriptor(J.prototype, "publishHook"),
          J.prototype
        ),
        J);
    },
    91181: function (e, t, n) {
      "use strict";
      n.d(t, {
        $: function () {
          return Ft;
        },
      });
      var r = n(17674),
        i = n(94294),
        o = n.n(i),
        a = n(80955),
        s = n(67294),
        c = n(22474),
        l = n(45566),
        u = n(88309),
        d = n(36186),
        p = n(79594),
        m = n(41293),
        f = n(59499),
        g = n(77276),
        h = n.n(g),
        v = "limitedConsumptionTrial:contentLocked",
        b = "limitedConsumptionTrial:lecturedViewed",
        y = "limitedConsumptionTrial:leftCourseTakingPage",
        _ = [v, b, y],
        E = [y],
        w = "/organization-trial/status/",
        O = "/organization-trial/nudge-owner/",
        S = {
          buy: "/organization-manage/settings/billing/payment/",
          invite: "/organization-manage/users/invite/",
        },
        k = { USED: "used", AVAILABLE: "available" },
        C = { minLectures: 5, maxLectures: 5, maxUsers: 5 },
        x = ["Video", "VideoMashup"],
        N = n(49218);
      function P(e) {
        var t = new Date(Date.now() + 31536e6);
        return (0, N.H)("trialTooltip", e, t);
      }
      var I,
        T,
        Z,
        R,
        A,
        L,
        j,
        D,
        M,
        z,
        U,
        F,
        B = n(4730),
        W = n(56073),
        H = n(24793),
        Q = n.n(H),
        V = ["content", "componentClass", "isOpen"],
        q = (0, a.Pi)(function (e) {
          var t = e.content,
            n = e.componentClass,
            i = void 0 === n ? W.r : n,
            o = e.isOpen,
            a = (0, B.Z)(e, V),
            c = s.useState(P(t.type)),
            u = (0, r.Z)(c, 1)[0],
            d = s.useState(!1),
            m = (0, r.Z)(d, 2),
            f = m[0],
            g = m[1],
            h = (0, p.QT)().gettext;
          s.useEffect(
            function () {
              o && u.get("tooltip_type") !== t.type && g(!0);
            },
            [t.type, o]
          );
          var v = i;
          return s.createElement(
            v,
            Object.assign({}, a, { isOpen: f }),
            s.createElement(
              "div",
              {
                "data-testid": "tooltip-title",
                className: Q()["tooltip-title"],
              },
              t.title
            ),
            s.createElement(
              "div",
              { "data-testid": "tooltip-text", className: Q()["tooltip-text"] },
              t.text
            ),
            s.createElement(
              l.zx,
              {
                udStyle: "secondary",
                onClick: function () {
                  g(!1), u.set("tooltip_type", t.type);
                },
                size: "medium",
                "data-testid": "tooltip-cta",
                className: Q()["tooltip-cta"],
              },
              h("Dismiss")
            )
          );
        }),
        G = n(18715),
        X = n.n(G),
        Y = function (e) {
          var t,
            n = e.availableLectures,
            r = e.currentTooltip,
            i = e.usedLectures,
            a = (0, p.QT)().ninterpolate;
          var c = s.createElement(
              "div",
              { className: X()["available-lectures-indicators"] },
              Object.values(k).map(function (e) {
                return (function (e) {
                  for (
                    var t = [], r = e === k.USED, a = r ? i : n, c = 0;
                    c < a;
                    c++
                  ) {
                    var l = s.createElement(h(), {
                      key: "".concat(e).concat(c),
                      label: !1,
                      size: "large",
                      className: o()(
                        X()["play-icon"],
                        (0, f.Z)({}, X()["play-icon--used-lecture"], r)
                      ),
                      "data-testid": "play-icon",
                    });
                    t.push(l);
                  }
                  return t;
                })(e);
              })
            ),
            l = P("get_started");
          return (
            i &&
              "get_started" !== l.get("tooltip_type") &&
              l.set("tooltip_type", "get_started"),
            r &&
              ["first_available", "first_used"].includes(
                null !== (t = r.position) && void 0 !== t ? t : ""
              ) &&
              (c = s.createElement(q, {
                isOpen: !0,
                placement: "top",
                trigger: c,
                content: r,
              })),
            s.createElement(
              "div",
              {
                className: o()("ud-heading-sm", X()["available-lectures"]),
                "data-testid": "available-lectures",
              },
              a("%s free video available", "%s free videos available", n),
              c
            )
          );
        },
        K = n(15515),
        J = n(85573),
        $ = n.n(J),
        ee = ["size", "ownerName", "onClick"],
        te = function (e) {
          var t = e.size,
            n = void 0 === t ? "medium" : t,
            r = e.ownerName,
            i = e.onClick,
            o = (0, B.Z)(e, ee),
            a = (0, p.QT)(),
            c = a.gettext,
            u = a.interpolate,
            d = {
              props: {
                href: S.buy,
                componentClass: "a",
                className: $()["buy-button"],
                "data-testid": "buy-button",
              },
              buttonContent: s.createElement(
                "span",
                null,
                s.createElement(
                  "span",
                  { className: $()["button-text-large"] },
                  c("Buy Udemy Business")
                ),
                s.createElement(
                  "span",
                  { className: $()["button-text-small"] },
                  c("Buy now")
                )
              ),
            };
          if (r) {
            var m = c("Send feedback to %(owner)s");
            d = {
              props: { "data-testid": "nudge-owner-button" },
              buttonContent: s.createElement(
                "span",
                null,
                s.createElement(
                  "span",
                  { className: $()["button-text-large"] },
                  u(m, { owner: r }, !0)
                ),
                s.createElement(
                  "span",
                  { className: $()["button-text-small"] },
                  c("Send feedback")
                )
              ),
            };
          }
          return s.createElement(
            l.zx,
            Object.assign(
              { onClick: i, size: n, udStyle: "brand" },
              d.props,
              o
            ),
            d.buttonContent
          );
        },
        ne = n(20526),
        re = n.n(ne),
        ie = function (e) {
          var t = e.isOpen,
            n = e.onClose,
            r = (0, p.QT)(),
            i = r.gettext,
            a = r.interpolate,
            c = (0, d.wi)().getOrgNumericSiteStat;
          return s.createElement(
            K.u,
            {
              isOpen: t,
              onClose: n,
              renderTitle: function () {
                return ["locked-lecture-modal-title", null];
              },
              title: "",
              className: "udlite-in-udheavy",
            },
            s.createElement(
              "div",
              { className: re().content },
              s.createElement(
                "div",
                { className: re()["icon-container"] },
                s.createElement(h(), {
                  label: !1,
                  color: "neutral",
                  className: re()["play-icon"],
                }),
                s.createElement("div", { className: re()["number-badge"] }, 0)
              ),
              s.createElement(
                "h2",
                {
                  id: "locked-lecture-modal-title",
                  className: o()("ud-heading-xxl", re().title),
                },
                i("You've watched all your free videos")
              ),
              s.createElement(
                "div",
                { className: re().subtitle },
                a(
                  i(
                    "Browse and explore over %(count)s top rated courses curated from Udemy.com"
                  ),
                  { count: c("num_courses").toLocaleString() },
                  !0
                )
              ),
              s.createElement(te, { size: "large", onClick: n })
            )
          );
        },
        oe = n(95931),
        ae = n(87491),
        se = n(43880),
        ce = n(28538),
        le = n(10154),
        ue = n(82262),
        de = n(92777),
        pe = n(43269),
        me = n(53229),
        fe = n(22188),
        ge = n(48809),
        he =
          ((I = (0, ue.Z)(function e(t, n) {
            (0, de.Z)(this, e),
              (this.ownerName = t),
              (this.gettext = n),
              (this.udApi = ge.uh),
              (0, pe.Z)(this, "message", T, this),
              (0, pe.Z)(this, "isNotificationVisible", Z, this),
              (0, pe.Z)(this, "notificationText", R, this),
              (0, pe.Z)(this, "notificationType", A, this),
              (0, pe.Z)(this, "userRating", L, this),
              (0, pe.Z)(this, "setDefaultMessage", j, this),
              (0, pe.Z)(this, "onMessageChanged", D, this),
              (0, pe.Z)(this, "setUserRating", M, this),
              (0, pe.Z)(this, "sendNudgeOwnerMessage", z, this),
              (0, pe.Z)(this, "showNotification", U, this),
              (0, pe.Z)(this, "hideNotification", F, this),
              this.setDefaultMessage();
          })),
          (T = (0, me.Z)(I.prototype, "message", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "";
            },
          })),
          (Z = (0, me.Z)(I.prototype, "isNotificationVisible", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (R = (0, me.Z)(I.prototype, "notificationText", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "";
            },
          })),
          (A = (0, me.Z)(I.prototype, "notificationType", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (L = (0, me.Z)(I.prototype, "userRating", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return 2;
            },
          })),
          (j = (0, me.Z)(I.prototype, "setDefaultMessage", [fe.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                e.message = "";
              };
            },
          })),
          (D = (0, me.Z)(I.prototype, "onMessageChanged", [fe.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                e.message = t.target.value;
              };
            },
          })),
          (M = (0, me.Z)(I.prototype, "setUserRating", [fe.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                e.userRating = t;
              };
            },
          })),
          (z = (0, me.Z)(I.prototype, "sendNudgeOwnerMessage", [fe.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                var n = { message_body: e.message, user_rating: e.userRating };
                return e.udApi
                  .post(O, n)
                  .then(
                    (0, fe.aD)(function () {
                      return (
                        t(),
                        e.showNotification(
                          e.gettext("Message sent"),
                          "success"
                        ),
                        "success"
                      );
                    })
                  )
                  .catch(function () {
                    return (
                      e.showNotification(
                        e.gettext(
                          "Something went wrong! Please try again later."
                        ),
                        "error"
                      ),
                      "error"
                    );
                  });
              };
            },
          })),
          (U = (0, me.Z)(I.prototype, "showNotification", [fe.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t, n) {
                (e.isNotificationVisible = !0),
                  (e.notificationText = t),
                  (e.notificationType = n);
              };
            },
          })),
          (F = (0, me.Z)(I.prototype, "hideNotification", [fe.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                (e.isNotificationVisible = !1),
                  (e.notificationType = void 0),
                  (e.notificationText = "");
              };
            },
          })),
          I),
        ve = n(87123),
        be = n.n(ve),
        ye = (0, a.Pi)(function (e) {
          var t = e.isOpen,
            n = e.ownerName,
            i = e.onClose,
            a = (0, p.QT)(),
            c = a.gettext,
            u = a.interpolate,
            d = s.useState(new he(n, c)),
            m = (0, r.Z)(d, 1)[0],
            f = function (e) {
              m.setUserRating(Number(e.target.value));
            },
            g = function () {
              m.setDefaultMessage(), i();
            };
          return s.createElement(
            K.u,
            {
              className: "udlite-in-udheavy",
              isOpen: t,
              onClose: g,
              title: c("Send feedback"),
            },
            s.createElement(
              "form",
              {
                onSubmit: function (e) {
                  e.preventDefault(),
                    m.sendNudgeOwnerMessage(g).then(function () {
                      if (m.isNotificationVisible) {
                        var e = {
                          udStyle: m.notificationType,
                          title: m.notificationText,
                          showCta: !1,
                        };
                        ce.n.addAlertBannerToast(e, {
                          autoDismiss: !0,
                          autoDismissTimeout: 5e3,
                          onDismiss: m.hideNotification,
                        });
                      }
                    });
                },
              },
              s.createElement(
                "h3",
                { className: o()("ud-heading-lg", be()["feedback-title"]) },
                c("How was your experience with Udemy Business?")
              ),
              (function () {
                var e = [
                  { value: 4, text: c("Excellent") },
                  { value: 3, text: c("Very good") },
                  { value: 2, text: c("Good") },
                  { value: 1, text: c("Fair") },
                  { value: 0, text: c("Poor") },
                ];
                return s.createElement(
                  "div",
                  {
                    "data-testid": "radio-group",
                    className: be()["radio-group"],
                  },
                  e.map(function (e) {
                    return s.createElement(
                      oe.Y,
                      {
                        name: "rating",
                        key: e.value,
                        onChange: f,
                        value: e.value,
                        defaultChecked: m.userRating === e.value,
                      },
                      e.text
                    );
                  })
                );
              })(),
              s.createElement(
                "h3",
                { className: o()("ud-heading-lg", be()["feedback-title"]) },
                c("Write a message")
              ),
              s.createElement(
                ae.cw,
                {
                  label: u(
                    c("Let %(ownerName)s know how your experience was"),
                    { ownerName: n },
                    !0
                  ),
                },
                s.createElement(se.K, {
                  onChange: m.onMessageChanged,
                  value: m.message,
                  className: be()["message-input"],
                })
              ),
              s.createElement(
                le.a,
                null,
                s.createElement(
                  l.zx,
                  { udStyle: "ghost", onClick: i },
                  c("Close")
                ),
                s.createElement(
                  l.zx,
                  { type: "submit", disabled: !m.message },
                  c("Send")
                )
              )
            )
          );
        });
      function _e() {
        var e = (function () {
          var e = (0, p.QT)(),
            t = e.gettext,
            n = e.interpolate,
            r = e.ninterpolate,
            i = {
              practice: t("Assignments are not available to trial users"),
              lecture: t("This lecture type is not available"),
            },
            o = {
              practice: t(
                "Assignments are a great way to test the application of what you have learned."
              ),
              lecture: t(
                "This is a non-video lecture which is unavailable to trial users."
              ),
            },
            a = {
              "simple-quiz": t("Quizzes are not available to trial users"),
              "coding-exercise": t(
                "Coding exercises are not available to trial users"
              ),
              "practice-test": t(
                "Practice Tests are not available to trial users"
              ),
            },
            s = {
              Article: t("Articles are not available to trial users"),
              Presentation: t("Presentations are not available to trial users"),
            },
            c = {
              Article: t(
                "Some instructors use articles to complement their video content, but these are unavailable to trial users."
              ),
              Presentation: t(
                "Some instructors use presentations to complement their video content, but these are unavailable to trial users."
              ),
            },
            l = {
              "simple-quiz": t(
                "Quizzes are a great way to test your recall of the lessons you have taken."
              ),
              "coding-exercise": t(
                "Coding Exercises are the best way to learn and apply programming lessons."
              ),
              "practice-test": t(
                "Practice tests are a wonderful way to prepare for exams."
              ),
            };
          return {
            get_started: {
              position: "first_available",
              title: function (e) {
                var t = e.numStart;
                return r(
                  "Your trial starts with %s free video",
                  "Your trial starts with %s free videos",
                  t
                );
              },
              text: function (e) {
                return e.isOwner ? t("Unlock more at any time.") : "";
              },
              noClose: !0,
              type: "get_started",
            },
            preview_lecture_viewed: {
              position: function (e) {
                return e.numAvailable ? "first_available" : "first_used";
              },
              title: function () {
                return t("No limits on preview videos");
              },
              text: function () {
                return t(
                  "This is a \u2018preview\u2019 video which isn\u2019t deducted from your allowance of free videos. Watch as many of these as you want. Enjoy!"
                );
              },
              type: "preview_lecture_viewed",
            },
            admin_invitation_v2: {
              position: "licenses_left",
              title: function () {
                return t("Get your team involved");
              },
              text: function (e) {
                var r = e.lectureCount;
                return n(
                  t(
                    "Invite people to participate in this trial. Each member will have access to %(count)s videos."
                  ),
                  { count: r },
                  !0
                );
              },
              type: "admin_invitation_v2",
            },
            limit_reached: {
              position: function (e) {
                return e.isOwner ? "buy_button" : "unlock_button";
              },
              title: function () {
                return t("You need unlimited access!");
              },
              text: function (e) {
                var r = e.numCourses;
                return n(
                  t(
                    "Your team has watched all 30 videos included in this trial. Drive a culture of learning and buy Udemy Business for your team. Get unlimited access to thousands of videos and %s+ courses."
                  ),
                  [r]
                );
              },
              type: "limit_reached",
            },
            non_video_content_locked: {
              position: function (e) {
                return e.isOwner ? "buy_button" : "unlock_button";
              },
              title: function (e) {
                var t = e.item,
                  n = (i.lecture, t.assetType);
                return t.quizType
                  ? a[t.quizType]
                  : n && s[n]
                  ? s[n]
                  : i[t.itemType];
              },
              text: function (e) {
                var n = e.item,
                  r = "",
                  i = n.assetType,
                  a = t("Buy Udemy Business to start taking them today.");
                return (
                  (r = n.quizType
                    ? l[n.quizType]
                    : i && c[i]
                    ? c[i]
                    : o[n.itemType]),
                  "".concat(r, " ").concat(a)
                );
              },
              type: "non_video_content_locked",
            },
          };
        })();
        return function (t) {
          var n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            r = {},
            i = e[t];
          if (!i) throw new Error("Unsupported tooltip type");
          for (var o in i) {
            var a = o,
              s = i[a];
            r[a] = "function" === typeof s ? s(n) : s;
          }
          return r;
        };
      }
      var Ee,
        we,
        Oe,
        Se,
        ke,
        Ce,
        xe,
        Ne,
        Pe,
        Ie,
        Te,
        Ze,
        Re,
        Ae,
        Le,
        je,
        De,
        Me,
        ze = n(50029),
        Ue = n(87794),
        Fe = n.n(Ue),
        Be = n(61646),
        We =
          ((Ee = (function () {
            function e(t, n) {
              (0, de.Z)(this, e),
                (this.getTooltipProps = t),
                (this.getOrgNumericSiteStat = n),
                (this.limits = void 0),
                (0, pe.Z)(this, "availableLectures", we, this),
                (0, pe.Z)(this, "usedLectures", Oe, this),
                (0, pe.Z)(this, "notificationEvent", Se, this),
                (0, pe.Z)(this, "notificationEventDetail", ke, this),
                (0, pe.Z)(this, "ownerName", Ce, this),
                (0, pe.Z)(this, "activeRemainingDays", xe, this),
                (0, pe.Z)(this, "currentTooltip", Ne, this),
                (0, pe.Z)(this, "isLoading", Pe, this),
                (0, pe.Z)(this, "isOwner", Ie, this),
                (0, pe.Z)(this, "isOrgLimitReached", Te, this),
                (0, pe.Z)(this, "isNudgeOwnerModalVisible", Ze, this),
                (0, pe.Z)(this, "isLockedLectureModalVisible", Re, this),
                (0, pe.Z)(this, "handleEvent", Ae, this),
                (0, pe.Z)(this, "showNudgeOwnerModal", Le, this),
                (0, pe.Z)(this, "hideNudgeOwnerModal", je, this),
                (0, pe.Z)(this, "showLockedLecturesModal", De, this),
                (0, pe.Z)(this, "hideLockedLecturesModal", Me, this),
                this.toggleOverlay(),
                (this.limits = C),
                (this.limits.minLectures = 5),
                (this.limits.maxLectures = 5);
            }
            return (
              (0, ue.Z)(e, [
                {
                  key: "getStatus",
                  value: function () {
                    var e = this,
                      t =
                        arguments.length > 0 &&
                        void 0 !== arguments[0] &&
                        arguments[0];
                    return ge.uh
                      .get(w)
                      .then(
                        (0, fe.aD)(function (n) {
                          (e.activeRemainingDays =
                            n.data.active_remaining_days),
                            (e.availableLectures = n.data.available_count),
                            (e.usedLectures = n.data.used_count),
                            (e.ownerName = n.data.owner_name),
                            (e.isOwner = n.data.is_owner),
                            (e.isLoading = !1),
                            (e.isOrgLimitReached =
                              !!n.data.trial_limit_reached),
                            t && e.handleNotificationEvent();
                        })
                      )
                      .catch(function (e) {
                        Be.c.captureException(e);
                      });
                  },
                },
                {
                  key: "toggleOverlay",
                  value: function () {
                    var e =
                      arguments.length > 0 &&
                      void 0 !== arguments[0] &&
                      arguments[0];
                    e || (this.currentTooltip = void 0);
                  },
                },
                {
                  key: "handleNotificationEvent",
                  value: function () {
                    var e = void 0;
                    switch (this.notificationEvent) {
                      case v:
                        !this.isOrgLimitReached &&
                        this.notificationEventDetail &&
                        "lecture" === this.notificationEventDetail.itemType &&
                        x.includes(this.notificationEventDetail.assetType)
                          ? this.showLockedLecturesModal()
                          : (e = this._lockedTooltip());
                        break;
                      case b:
                        e = this._viewedTooltip();
                        break;
                      default:
                        e = void 0;
                    }
                    this.currentTooltip = e;
                  },
                },
                {
                  key: "_lockedTooltip",
                  value: function () {
                    if (this.notificationEventDetail)
                      return this.isOrgLimitReached
                        ? this.getTooltipProps("limit_reached", {
                            isOwner: this.isOwner,
                            numCourses:
                              this.getOrgNumericSiteStat("num_courses"),
                          })
                        : this.getTooltipProps("non_video_content_locked", {
                            item: this.notificationEventDetail,
                            isOwner: this.isOwner,
                          });
                  },
                },
                {
                  key: "_viewedTooltip",
                  value: function () {
                    if ((this.notificationEventDetail || {}).isFree)
                      return this.getTooltipProps("preview_lecture_viewed", {
                        numAvailable: this.availableLectures,
                      });
                  },
                },
              ]),
              e
            );
          })()),
          (we = (0, me.Z)(Ee.prototype, "availableLectures", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return 1;
            },
          })),
          (Oe = (0, me.Z)(Ee.prototype, "usedLectures", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return 0;
            },
          })),
          (Se = (0, me.Z)(Ee.prototype, "notificationEvent", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (ke = (0, me.Z)(Ee.prototype, "notificationEventDetail", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Ce = (0, me.Z)(Ee.prototype, "ownerName", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "";
            },
          })),
          (xe = (0, me.Z)(Ee.prototype, "activeRemainingDays", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return 0;
            },
          })),
          (Ne = (0, me.Z)(Ee.prototype, "currentTooltip", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (Pe = (0, me.Z)(Ee.prototype, "isLoading", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !0;
            },
          })),
          (Ie = (0, me.Z)(Ee.prototype, "isOwner", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (Te = (0, me.Z)(Ee.prototype, "isOrgLimitReached", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (Ze = (0, me.Z)(Ee.prototype, "isNudgeOwnerModalVisible", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (Re = (0, me.Z)(
            Ee.prototype,
            "isLockedLectureModalVisible",
            [fe.LO],
            {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return !1;
              },
            }
          )),
          (0, me.Z)(
            Ee.prototype,
            "toggleOverlay",
            [fe.aD],
            Object.getOwnPropertyDescriptor(Ee.prototype, "toggleOverlay"),
            Ee.prototype
          ),
          (Ae = (0, me.Z)(Ee.prototype, "handleEvent", [fe.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return (function () {
                var t = (0, ze.Z)(
                  Fe().mark(function t(n) {
                    var r, i;
                    return Fe().wrap(function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            if (
                              ((r = n.type),
                              (i = n.detail),
                              -1 === _.indexOf(r))
                            ) {
                              t.next = 8;
                              break;
                            }
                            if (
                              ((e.notificationEvent = r),
                              (e.notificationEventDetail = i),
                              (e.currentTooltip = void 0),
                              E.includes(r))
                            ) {
                              t.next = 8;
                              break;
                            }
                            return (t.next = 8), e.getStatus(!0);
                          case 8:
                          case "end":
                            return t.stop();
                        }
                    }, t);
                  })
                );
                return function (e) {
                  return t.apply(this, arguments);
                };
              })();
            },
          })),
          (Le = (0, me.Z)(Ee.prototype, "showNudgeOwnerModal", [fe.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                e.isNudgeOwnerModalVisible = !0;
              };
            },
          })),
          (je = (0, me.Z)(Ee.prototype, "hideNudgeOwnerModal", [fe.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                e.isNudgeOwnerModalVisible = !1;
              };
            },
          })),
          (De = (0, me.Z)(Ee.prototype, "showLockedLecturesModal", [fe.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                e.isLockedLectureModalVisible = !0;
              };
            },
          })),
          (Me = (0, me.Z)(Ee.prototype, "hideLockedLecturesModal", [fe.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                e.isLockedLectureModalVisible = !1;
              };
            },
          })),
          Ee),
        He = n(7311),
        Qe = n.n(He),
        Ve = (0, a.Pi)(function () {
          var e = (0, d.gL)().Config,
            t = (0, d.wi)(),
            n = (0, p.QT)(),
            i = _e(),
            a = s.useState(new We(i, t.getOrgNumericSiteStat)),
            c = (0, r.Z)(a, 1)[0];
          return (
            s.useEffect(
              function () {
                return (
                  _.forEach(function (e) {
                    document.addEventListener(e, c.handleEvent);
                  }),
                  c.getStatus(),
                  function () {
                    _.forEach(function (e) {
                      document.removeEventListener(e, c.handleEvent);
                    });
                  }
                );
              },
              [c]
            ),
            s.createElement(
              s.Fragment,
              null,
              s.createElement(ie, {
                isOpen: c.isLockedLectureModalVisible,
                onClose: c.hideLockedLecturesModal,
              }),
              !c.isLoading &&
                s.createElement(
                  "div",
                  {
                    "data-testid": "trial-footer",
                    className: Qe()["trial-footer"],
                  },
                  s.createElement(m.E, {
                    alt: e.brand.product_name,
                    src: e.brand.product_logo,
                    className: o()("ufb-logo", Qe().logo),
                    width: Math.round(34 * e.brand.product_logo_aspect_ratio),
                    height: 34,
                  }),
                  s.createElement(Y, {
                    availableLectures: c.availableLectures,
                    currentTooltip: c.currentTooltip,
                    usedLectures: c.usedLectures,
                  }),
                  s.createElement(
                    "div",
                    { className: Qe()["timer-container"] },
                    s.createElement(
                      "div",
                      {
                        "data-testid": "timer-text",
                        className: Qe()["timer-text"],
                      },
                      n.ninterpolate(
                        "%s day left",
                        "%s days left",
                        c.activeRemainingDays
                      )
                    ),
                    c.isOwner
                      ? (function () {
                          var e, t;
                          return c.isOwner &&
                            null !== (e = c.currentTooltip) &&
                            void 0 !== e &&
                            e.position &&
                            ["buy_button", "unlock_button"].includes(
                              null === (t = c.currentTooltip) || void 0 === t
                                ? void 0
                                : t.position
                            )
                            ? s.createElement(q, {
                                isOpen: !0,
                                placement: "top-end",
                                trigger: s.createElement(te, null),
                                content: c.currentTooltip,
                              })
                            : s.createElement(te, null);
                        })()
                      : (function () {
                          var e,
                            t = s.createElement(te, {
                              onClick: c.showNudgeOwnerModal,
                              ownerName: c.ownerName,
                            });
                          return t &&
                            "unlock_button" ===
                              (null === (e = c.currentTooltip) || void 0 === e
                                ? void 0
                                : e.position)
                            ? s.createElement(q, {
                                content: c.currentTooltip,
                                placement: "top-end",
                                isOpen: !0,
                                trigger: t,
                              })
                            : t;
                        })()
                  ),
                  s.createElement(ye, {
                    isOpen: c.isNudgeOwnerModalVisible,
                    ownerName: c.ownerName,
                    onClose: c.hideNudgeOwnerModal,
                  })
                )
            )
          );
        }),
        qe = n(14666),
        Ge = n(28811),
        Xe = n(2937),
        Ye = n(14882);
      function Ke(e) {
        return (0, qe.Z)(e) || (0, Ge.Z)(e) || (0, Xe.Z)(e) || (0, Ye.Z)();
      }
      function Je() {
        var e = (0, d.gL)().Config;
        return function (t) {
          return (function t(n) {
            var r = Ke(n),
              i = r[0],
              o = r.slice(1),
              a =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : e.features;
            return 0 === o.length ? a[i] || !1 : !(!a || !i) && t(o, a[i]);
          })(t.split("."));
        };
      }
      var $e = n(79750),
        et = n(78270),
        tt = n(23554),
        nt = n(45959),
        rt = n(63553),
        it = n(37247),
        ot = n(24076);
      function at(e) {
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
          var n,
            r = (0, it.Z)(e);
          if (t) {
            var i = (0, it.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, rt.Z)(this, n);
        };
      }
      var st = (function (e) {
          (0, nt.Z)(n, e);
          var t = at(n);
          function n(e) {
            var r;
            (0, de.Z)(this, n);
            var i = e.locale,
              o = e.placement;
            return (
              ((r = t.call(this, "UFBNoticeClickEvent")).locale = void 0),
              (r.placement = void 0),
              (r.locale = i),
              (r.placement = o),
              r
            );
          }
          return (
            (0, ue.Z)(n, [
              {
                key: "eventLocale",
                get: function () {
                  return this.locale;
                },
              },
              {
                key: "eventPlacement",
                get: function () {
                  return this.placement;
                },
              },
            ]),
            n
          );
        })(ot.rp),
        ct = (function (e) {
          (0, nt.Z)(n, e);
          var t = at(n);
          function n(e) {
            var r;
            (0, de.Z)(this, n);
            var i = e.locale,
              o = e.placement,
              a = e.url,
              s = void 0 === a ? null : a;
            return (
              ((r = t.call(this, "UFBNoticeImpressionEvent")).locale = void 0),
              (r.placement = void 0),
              (r.url = void 0),
              (r.locale = i),
              (r.placement = o),
              (r.url = s),
              r
            );
          }
          return (
            (0, ue.Z)(n, [
              {
                key: "eventLocale",
                get: function () {
                  return this.locale;
                },
              },
              {
                key: "eventPlacement",
                get: function () {
                  return this.placement;
                },
              },
            ]),
            n
          );
        })(ot.rp);
      function lt(e, t) {
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
      function ut(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? lt(Object(n), !0).forEach(function (t) {
                (0, f.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : lt(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var dt,
        pt,
        mt,
        ft,
        gt,
        ht,
        vt,
        bt,
        yt,
        _t,
        Et,
        wt = function (e) {
          var t = e.href,
            n = e.text,
            r = e.feature_flag,
            i = e.open_in_new_tab,
            o = e.data_purpose,
            a = e.style;
          if ("footer.links.business" === r)
            return s.createElement(Ot, { href: t, text: n, data_purpose: o });
          var c = {};
          return (
            i && (c = { target: "_blank", rel: "noopener noreferrer" }),
            a && (c = ut(ut({}, c), {}, { style: a })),
            o && (c = ut(ut({}, c), {}, { "data-purpose": o })),
            s.createElement(
              "a",
              Object.assign(
                { className: "link white-link ud-text-sm", href: t },
                c
              ),
              n
            )
          );
        },
        Ot = function (e) {
          var t = e.href,
            n = e.text,
            r = e.data_purpose,
            i = (0, p.QT)().locale;
          return s.createElement(
            tt.H,
            {
              trackFunc: function () {
                et.j.publishEvent(
                  new ct({ locale: i, placement: "footer", url: t })
                );
              },
            },
            s.createElement(
              "a",
              {
                href: t,
                className: "link white-link ud-text-sm",
                target: "_blank",
                rel: "noopener",
                "data-purpose": r,
                onClick: function () {
                  et.j.publishEvent(new st({ locale: i, placement: "footer" }));
                },
              },
              n
            )
          );
        },
        St = ["style"],
        kt = (0, a.Pi)(function (e) {
          e.style;
          var t = (0, B.Z)(e, St),
            n = (0, d.gL)(),
            r = n.me,
            i = n.Config;
          return r.isLoading || "DE" !== i.marketplace_country.id
            ? null
            : s.createElement("li", null, s.createElement(wt, t));
        }),
        Ct = function (e) {
          var t = e.linkColumns,
            n = Je();
          return s.createElement(
            s.Fragment,
            null,
            t.map(function (e, t) {
              return s.createElement(
                "ul",
                { className: "ud-unstyled-list link-column", key: t },
                e.map(function (e, t) {
                  return "footer-imprint-contact" === e.data_purpose
                    ? s.createElement(kt, Object.assign({ key: t }, e))
                    : "footer.links.cookie_preferences" === e.data_purpose
                    ? s.createElement($e.OL, Object.assign({ key: t }, e))
                    : (e.feature_flag ? n(e.feature_flag) : !e.is_disabled)
                    ? s.createElement("li", { key: t }, s.createElement(wt, e))
                    : null;
                })
              );
            })
          );
        },
        xt = n(47091),
        Nt =
          null !==
          (dt = "https://www.udemy.com/frontends-marketplace-experience")
            ? dt
            : "",
        Pt =
          ("".concat(Nt).concat(xt.i.udemyLogoUrl),
          "".concat(Nt).concat(xt.i.udemyLogoInvertedUrl),
          "".concat(Nt).concat(xt.i.ubLogoUrl),
          "".concat(Nt).concat(xt.i.ubLogoInvertedUrl),
          "".concat(Nt).concat(xt.i.ugLogoUrl),
          "".concat(Nt).concat(xt.i.ugLogoInvertedUrl),
          "".concat(Nt).concat(xt.i.udemyProLogoUrl),
          "".concat(Nt).concat(xt.i.udemyBenesseLogoUrl),
          "".concat(Nt).concat(xt.i.udemyBenesseLogoInvertedUrl)),
        It = (0, a.Pi)(function (e) {
          var t = e.isJpFooter,
            n = (0, d.gL)().Config,
            r = [
              {
                src: n.brand.product_logo_light,
                alt: n.brand.product_name,
                width: 34 * n.brand.product_logo_aspect_ratio,
                height: 34,
              },
            ];
          return (
            t &&
              !n.brand.has_organization &&
              (r[0] = {
                src: Pt,
                alt: "Udemy-Benesse-Logo",
                width: (1501 / 268) * 43,
                height: 43,
              }),
            s.createElement(
              s.Fragment,
              null,
              r.map(function (e, t) {
                return 0 === t
                  ? s.createElement(
                      l.zx,
                      {
                        key: e.alt,
                        componentClass: "a",
                        udStyle: "link",
                        href: "/",
                      },
                      s.createElement(m.E, Object.assign({}, e, { lazy: !1 }))
                    )
                  : s.createElement(
                      m.E,
                      Object.assign({ key: e.alt }, e, { lazy: !1 })
                    );
              })
            )
          );
        }),
        Tt = n(44722),
        Zt = n.n(Tt),
        Rt = function () {
          var e = (0, p.QT)().gettext;
          return s.createElement(
            "div",
            {
              className: o()("footer-section", Zt().banner),
              "data-testid": "teach-on-udemy-banner",
            },
            s.createElement(
              "div",
              null,
              s.createElement(
                "div",
                { className: "ud-heading-lg" },
                e("Teach the world online")
              ),
              s.createElement(
                "div",
                { className: o()("ud-text-md", Zt().subtitle) },
                e(
                  "Create an online video course, reach students across the globe, and earn money"
                )
              )
            ),
            s.createElement(
              "div",
              { className: Zt()["button-container"] },
              s.createElement(
                l.zx,
                {
                  componentClass: "a",
                  href: "/teaching/?ref=bai-sub-footer",
                  udStyle: "white-outline",
                },
                e("Teach on Udemy")
              )
            )
          );
        },
        At = n(95265),
        Lt = n.n(At),
        jt = (0, a.Pi)(function (e) {
          var t = e.link,
            n = e.placement,
            r = e.isOnsiteRequestDemo,
            i = (0, p.QT)(),
            a = i.gettext,
            c = i.locale,
            l = (0, d.j5)();
          return s.createElement(
            "div",
            {
              className: o()("footer-section", Lt()["notice-row"]),
              "data-testid": "ufb-notice",
            },
            s.createElement(
              "div",
              { className: o()("ud-heading-lg", Lt().notice) },
              s.createElement(p.nj, {
                html: a(
                  'Top companies choose <a class="link">Udemy Business</a> to build in-demand career skills.'
                ),
                interpolate: {
                  link: s.createElement("a", {
                    "data-purpose": "ufb-link",
                    className: "inverted-link",
                    href: t,
                    target: r ? void 0 : "_blank",
                    rel: r ? void 0 : "noopener",
                    onClick: function () {
                      et.j.publishEvent(new st({ locale: c, placement: n }));
                    },
                  }),
                },
              })
            ),
            s.createElement(
              "div",
              { className: Lt()["partner-logos"] },
              s.createElement(m.E, {
                src: l.toStorageStaticAsset(
                  "partner-logos/v4/nasdaq-light.svg"
                ),
                alt: "Nasdaq",
                height: 44,
                width: 115,
              }),
              s.createElement(m.E, {
                src: l.toStorageStaticAsset(
                  "partner-logos/v4/volkswagen-light.svg"
                ),
                alt: "Volkswagen",
                height: 44,
                width: 44,
              }),
              s.createElement(m.E, {
                src: l.toStorageStaticAsset("partner-logos/v4/box-light.svg"),
                alt: "Box",
                height: 44,
                width: 67,
              }),
              s.createElement(m.E, {
                src: l.toStorageStaticAsset(
                  "partner-logos/v4/netapp-light.svg"
                ),
                alt: "NetApp",
                height: 44,
                width: 115,
              }),
              s.createElement(m.E, {
                src: l.toStorageStaticAsset(
                  "partner-logos/v4/eventbrite-light.svg"
                ),
                alt: "Eventbrite",
                height: 44,
                width: 115,
              })
            )
          );
        }),
        Dt =
          ((pt = fe.LO.ref),
          (mt = fe.LO.ref),
          (ft = fe.LO.ref),
          (gt = (function () {
            function e(t, n) {
              (0, de.Z)(this, e),
                (0, pe.Z)(this, "hideFooterUntilContentReady", ht, this),
                (0, pe.Z)(this, "currentLocaleId", vt, this),
                (0, pe.Z)(this, "isJpFooter", bt, this),
                (0, pe.Z)(this, "linkColumns", yt, this),
                (0, pe.Z)(this, "ufbNotice", _t, this),
                (0, pe.Z)(this, "user", Et, this),
                this.updateServerData(t),
                n && this.updateClientData(n);
            }
            return (
              (0, ue.Z)(e, [
                {
                  key: "updateServerData",
                  value: function (e) {
                    var t;
                    (this.currentLocaleId = e.currentLocaleId),
                      (this.linkColumns = e.linkColumns),
                      (this.isJpFooter = e.isJpFooter),
                      (this.ufbNotice = e.ufbNotice),
                      (this.hideFooterUntilContentReady =
                        null !==
                          (t =
                            null === e || void 0 === e
                              ? void 0
                              : e.hideFooterUntilContentReady) &&
                        void 0 !== t &&
                        t);
                  },
                },
                {
                  key: "updateClientData",
                  value: function (e) {
                    this.user = e.user;
                  },
                },
              ]),
              e
            );
          })()),
          (ht = (0, me.Z)(
            gt.prototype,
            "hideFooterUntilContentReady",
            [fe.LO],
            {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return !1;
              },
            }
          )),
          (vt = (0, me.Z)(gt.prototype, "currentLocaleId", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "en_US";
            },
          })),
          (bt = (0, me.Z)(gt.prototype, "isJpFooter", [fe.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (yt = (0, me.Z)(gt.prototype, "linkColumns", [pt], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (_t = (0, me.Z)(gt.prototype, "ufbNotice", [mt], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return {
                link: void 0,
                placement: void 0,
                isOnsiteRequestDemo: !1,
              };
            },
          })),
          (Et = (0, me.Z)(gt.prototype, "user", [ft], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (0, me.Z)(
            gt.prototype,
            "updateServerData",
            [fe.aD],
            Object.getOwnPropertyDescriptor(gt.prototype, "updateServerData"),
            gt.prototype
          ),
          (0, me.Z)(
            gt.prototype,
            "updateClientData",
            [fe.aD],
            Object.getOwnPropertyDescriptor(gt.prototype, "updateClientData"),
            gt.prototype
          ),
          gt),
        Mt = s.createContext(null),
        zt = function (e) {
          var t = e.clientProps,
            n = e.serverProps,
            i = e.limitedConsumptionTrial,
            o = e.children,
            a = s.useState({
              footerStore: new Dt(n, t),
              limitedConsumptionTrial: i,
            }),
            c = (0, r.Z)(a, 1)[0];
          return (
            s.useEffect(
              function () {
                t && c.footerStore.updateClientData(t);
              },
              [t]
            ),
            s.useEffect(
              function () {
                c.footerStore.updateServerData(n);
              },
              [n]
            ),
            s.createElement(Mt.Provider, { value: c }, o)
          );
        },
        Ut = (0, a.Pi)(function (e) {
          var t,
            n = e.useLangPrefixedUrls,
            i = void 0 === n || n,
            a = (function () {
              var e = s.useContext(Mt);
              if (!e)
                throw new Error(
                  "useFooterContext must be used within a FooterProvider."
                );
              return e;
            })(),
            p = a.footerStore,
            m = a.limitedConsumptionTrial,
            f = (0, d.gL)().Config,
            g = Je(),
            h = s.useState(!1),
            v = (0, r.Z)(h, 2),
            b = v[0],
            y = v[1];
          s.useEffect(function () {
            return (
              y(!0),
              function () {
                y(!1);
              }
            );
          }, []);
          var _ =
              b &&
              !f.brand.has_organization &&
              !p.isJpFooter &&
              !u.N.global.location.pathname.startsWith("/teaching/") &&
              !!p.user &&
              !p.user.has_instructor_intent,
            E =
              !f.brand.has_organization &&
              !p.isJpFooter &&
              g("ufb_notices_footer.top_com") &&
              p.ufbNotice.link &&
              p.ufbNotice.placement,
            w =
              f.brand.has_organization &&
              f.brand.organization.is_limited_consumption_trial;
          return s.createElement(
            "footer",
            {
              className: o()("ud-footer", {
                "ud-footer-initially-hidden": !!p.hideFooterUntilContentReady,
                "ud-ufb-trial-footer": w,
              }),
              "data-purpose": "footer",
            },
            _ && s.createElement(Rt, null),
            E &&
              s.createElement(jt, {
                link: p.ufbNotice.link,
                placement:
                  null !== (t = p.ufbNotice.placement) && void 0 !== t
                    ? t
                    : "footer",
                isOnsiteRequestDemo: p.ufbNotice.isOnsiteRequestDemo,
              }),
            s.createElement(
              "div",
              { className: "footer-section footer-section-main" },
              s.createElement(
                "div",
                { className: "links-and-language-selector" },
                s.createElement(
                  "div",
                  { className: "language-selector-container" },
                  s.createElement(c.D8, {
                    uiRegion: "footer",
                    useLangPrefixedUrls: i,
                    trigger: s.createElement(c.i4, {
                      "data-testid": "language-selector-button",
                    }),
                  })
                ),
                s.createElement(Ct, { linkColumns: p.linkColumns })
              ),
              s.createElement(
                "div",
                { className: "logo-and-copyright" },
                s.createElement(
                  "div",
                  {
                    className: "logo-container",
                    "data-testid": "logo-container",
                  },
                  s.createElement(It, { isJpFooter: p.isJpFooter })
                ),
                !p.isJpFooter &&
                  s.createElement(
                    "div",
                    { className: "copyright-container ud-text-xs" },
                    "\xa9 ".concat(new Date().getFullYear(), " Udemy, Inc.")
                  )
              ),
              f.brand.has_organization &&
                f.brand.organization.is_enterprise_china &&
                s.createElement(
                  "div",
                  { className: "sanjieke ud-text-xs" },
                  s.createElement(
                    l.zx,
                    {
                      componentClass: "a",
                      udStyle: "link",
                      className: "white-link",
                      typography: "ud-text-xs",
                      href: "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010102005771",
                      target: "_blank",
                      rel: "noopener noreferrer nofollow",
                    },
                    "\u4eac\u516c\u7f51\u5b89\u5907 11010102005771\u53f7"
                  ),
                  s.createElement(
                    "span",
                    { className: "spacing" },
                    "ICP\u8bc1\uff1a\u4eacB2-20190453"
                  ),
                  s.createElement(
                    l.zx,
                    {
                      componentClass: "a",
                      udStyle: "link",
                      typography: "ud-text-xs",
                      className: "white-link",
                      href: "http://beian.miit.gov.cn/",
                      target: "_blank",
                      rel: "noopener noreferrer nofollow",
                    },
                    "\u4eacICP\u590716034860\u53f7"
                  )
                )
            ),
            b &&
              f.brand.has_organization &&
              s.createElement(
                "div",
                { className: "ud-ufb-fixed-message-container" },
                w && m && s.createElement(Ve, null)
              )
          );
        }),
        Ft = function (e) {
          var t = e.clientProps,
            n = e.serverProps,
            r = e.limitedConsumptionTrial,
            i = void 0 !== r && r,
            o = e.useLangPrefixedUrls,
            a = void 0 === o || o;
          return s.createElement(
            zt,
            { clientProps: t, serverProps: n, limitedConsumptionTrial: i },
            s.createElement(Ut, { useLangPrefixedUrls: a })
          );
        };
    },
    82316: function (e, t, n) {
      "use strict";
      n.d(t, {
        G: function () {
          return p;
        },
        N: function () {
          return m;
        },
      });
      var r = n(17674),
        i = n(67294),
        o = n(76978),
        a = n(97154),
        s = n(42666),
        c = n(84053),
        l = {
          sm: (0, o.x8)(a.T["breakpoint-sm-max"]),
          md: (0, o.x8)(a.T["breakpoint-md-max"]),
          lg: (0, o.x8)(a.T["breakpoint-lg-max"]),
          xl: (0, o.x8)(a.T["breakpoint-xl-max"]),
          xxl: 999999,
        };
      function u(e, t) {
        if (null === e) return null;
        var n = Object.keys(t),
          r = n.find(function (n) {
            var r = parseInt(n);
            if (e <= r) return t[r];
          });
        return void 0 === r ? t[n[n.length - 1]] : t[r];
      }
      var d = function (e) {
        return Object.fromEntries(
          Object.entries(e)
            .map(function (e) {
              var t = (0, r.Z)(e, 2),
                n = t[0];
              return [t[1], n];
            })
            .sort()
        );
      };
      function p() {
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : l,
          t = (0, i.useState)(null),
          n = t[0],
          r = t[1],
          o = d(e),
          a = function () {
            return r(u(window.innerWidth, o));
          };
        return (0, s.O)("resize", a), (0, i.useEffect)(a, []), n;
      }
      var m = (0, c.g)(function () {
        return { breakpoint: p() };
      });
    },
    42666: function (e, t, n) {
      "use strict";
      n.d(t, {
        O: function () {
          return a;
        },
      });
      var r = n(67294),
        i = !(!window.document || !window.document.createElement);
      function o(e, t) {
        if (i)
          return e
            ? "function" === typeof e
              ? e()
              : "current" in e
              ? e.current
              : e
            : t;
      }
      function a(e, t) {
        var n =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
          i = (0, r.useRef)(t);
        (i.current = t),
          (0, r.useEffect)(function () {
            var t = o(n.target, window);
            if (null !== t && void 0 !== t && t.addEventListener) {
              var r = function (e) {
                return i.current(e);
              };
              return (
                t.addEventListener(e, r, {
                  capture: n.capture,
                  once: n.once,
                  passive: n.passive,
                }),
                function () {
                  t.removeEventListener(e, r, { capture: n.capture });
                }
              );
            }
          });
      }
    },
    84053: function (e, t, n) {
      "use strict";
      n.d(t, {
        g: function () {
          return a;
        },
      });
      var r = n(8679),
        i = n.n(r),
        o = n(67294),
        a = function (e) {
          return function (t) {
            var n = function (n) {
              return o.createElement(t, Object.assign({}, e(n), n));
            };
            return (
              (n.displayName = "makeHoC(".concat(
                t.displayName || t.name || "Component",
                ")"
              )),
              i()(n, t)
            );
          };
        };
    },
    22474: function (e, t, n) {
      "use strict";
      n.d(t, {
        qg: function () {
          return x;
        },
        i4: function () {
          return U;
        },
        eJ: function () {
          return P;
        },
        D8: function () {
          return G;
        },
      });
      var r = n(67294),
        i = n(78270),
        o = n(79594),
        a = n(45566),
        s = n(36186),
        c = n(82262),
        l = n(92777),
        u = n(45959),
        d = n(63553),
        p = n(37247),
        m = n(24076);
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
          var n,
            r = (0, p.Z)(e);
          if (t) {
            var i = (0, p.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, d.Z)(this, n);
        };
      }
      var g = "open_selector",
        h = "select_language",
        v = (function (e) {
          (0, u.Z)(n, e);
          var t = f(n);
          function n(e) {
            var r;
            (0, l.Z)(this, n);
            var i = e.action,
              o = e.selectorLocation,
              a = e.selectedLocale,
              s = void 0 === a ? null : a;
            return (
              ((r = t.call(this, "LanguageSelectorActionEvent")).action =
                void 0),
              (r.selectorLocation = void 0),
              (r.selectedLocale = void 0),
              (r.action = i),
              (r.selectorLocation = o),
              (r.selectedLocale = s),
              r
            );
          }
          return (0, c.Z)(n);
        })(m.rp),
        b = n(88309);
      function y(e) {
        var t =
            !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
          n = (0, o.QT)(),
          i = (0, s.gL)(),
          a = i.Config,
          c = r.useCallback(
            function (r) {
              var i,
                o,
                s =
                  null !==
                    (i =
                      null !== e && void 0 !== e
                        ? e
                        : null === (o = b.N.global.location) || void 0 === o
                        ? void 0
                        : o.pathname) && void 0 !== i
                    ? i
                    : "",
                c = s.startsWith("http")
                  ? new URL(s)
                  : new URL("http://example.com".concat(s)),
                l = new URLSearchParams(b.N.global.location.search);
              l.set("persist_locale", ""), l.set("locale", r);
              var u = c.pathname.replaceAll(/\/+/g, "/"),
                d = u.split("/");
              if (
                (a.supported_languages.find(function (e) {
                  return e.lang === d[1];
                }) &&
                  (l.set("previous_locale", n.locale),
                  (u = "/".concat(d.slice(2).join("/")))),
                "en_US" !== r && !a.brand.has_organization && t)
              ) {
                var p,
                  m =
                    null ===
                      (p = a.supported_languages.find(function (e) {
                        return e.locale === r;
                      })) || void 0 === p
                      ? void 0
                      : p.lang;
                u = "/".concat(m).concat(u);
              }
              return { path: u, params: l };
            },
            [a.brand.has_organization, a.supported_languages, e, n.locale, t]
          );
        return c;
      }
      var _ = n(17674);
      function E(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var r in n) e[r] = n[r];
        }
        return e;
      }
      var w = (function e(t, n) {
          function r(e, r, i) {
            if ("undefined" !== typeof document) {
              "number" === typeof (i = E({}, n, i)).expires &&
                (i.expires = new Date(Date.now() + 864e5 * i.expires)),
                i.expires && (i.expires = i.expires.toUTCString()),
                (e = encodeURIComponent(e)
                  .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
                  .replace(/[()]/g, escape));
              var o = "";
              for (var a in i)
                i[a] &&
                  ((o += "; " + a),
                  !0 !== i[a] && (o += "=" + i[a].split(";")[0]));
              return (document.cookie = e + "=" + t.write(r, e) + o);
            }
          }
          return Object.create(
            {
              set: r,
              get: function (e) {
                if (
                  "undefined" !== typeof document &&
                  (!arguments.length || e)
                ) {
                  for (
                    var n = document.cookie ? document.cookie.split("; ") : [],
                      r = {},
                      i = 0;
                    i < n.length;
                    i++
                  ) {
                    var o = n[i].split("="),
                      a = o.slice(1).join("=");
                    try {
                      var s = decodeURIComponent(o[0]);
                      if (((r[s] = t.read(a, s)), e === s)) break;
                    } catch (c) {}
                  }
                  return e ? r[e] : r;
                }
              },
              remove: function (e, t) {
                r(e, "", E({}, t, { expires: -1 }));
              },
              withAttributes: function (t) {
                return e(this.converter, E({}, this.attributes, t));
              },
              withConverter: function (t) {
                return e(E({}, this.converter, t), this.attributes);
              },
            },
            {
              attributes: { value: Object.freeze(n) },
              converter: { value: Object.freeze(t) },
            }
          );
        })(
          {
            read: function (e) {
              return (
                '"' === e[0] && (e = e.slice(1, -1)),
                e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
              );
            },
            write: function (e) {
              return encodeURIComponent(e).replace(
                /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
                decodeURIComponent
              );
            },
          },
          { path: "/" }
        ),
        O = w,
        S = n(48809);
      var k = n(17464),
        C = n.n(k),
        x = r.forwardRef(function (e, t) {
          var n,
            c = e.uiRegion,
            l = e.useLangPrefixedUrls,
            u = void 0 === l || l,
            d = (0, o.QT)().locale,
            p = (0, s.gL)().Config,
            m = y(void 0, u),
            f = (function () {
              var e =
                  !(arguments.length > 0 && void 0 !== arguments[0]) ||
                  arguments[0],
                t = (0, s.gL)(),
                n = y(void 0, e),
                i = r.useState(),
                o = (0, _.Z)(i, 2),
                a = o[0],
                c = o[1];
              return (
                r.useEffect(
                  function () {
                    if (!t.isGlobalMeContextLoading && a) {
                      t.me.is_authenticated &&
                        S.uh
                          .patch("users/me/", { locale: a })
                          .catch(function () {}),
                        O.set("ud_locale", a, { expires: 1 }),
                        O.set("ud_cache_language", a.slice(0, 2), {
                          expires: 1,
                        });
                      var e = n(a),
                        r = e.path,
                        i = e.params;
                      window.location.assign(
                        "".concat(r, "?").concat(i.toString())
                      );
                    }
                  },
                  [t.isGlobalMeContextLoading, t.me.is_authenticated, n, a, e]
                ),
                c
              );
            })(u),
            g = p.supported_languages.find(function (e) {
              return e.locale === d;
            }),
            b =
              null !== (n = null === g || void 0 === g ? void 0 : g.locale) &&
              void 0 !== n
                ? n
                : "en_US";
          return r.createElement(
            "div",
            { ref: t, className: C().root },
            p.supported_languages.map(function (e) {
              return r.createElement(
                a.zx,
                {
                  key: e.locale,
                  className: C().button,
                  "data-active": e.locale === b || void 0,
                  componentClass: "a",
                  href: m(e.locale).path,
                  udStyle: "ghost",
                  size: "medium",
                  typography: "ud-text-md",
                  onClick: function (t) {
                    return (function (e, t) {
                      e.preventDefault(),
                        f(t.locale),
                        i.j.publishEvent(
                          new v({
                            action: h,
                            selectorLocation: c,
                            selectedLocale: t.locale,
                          })
                        );
                    })(t, e);
                  },
                },
                r.createElement("span", { lang: e.lang }, e.name)
              );
            })
          );
        }),
        N = [
          "consumer_subscription_landing_page",
          "discovery_category",
          "discovery_logged_out_home",
          "discovery_subcategory",
          "discovery_topic",
          "sitemap",
          "teaching",
        ],
        P = r.forwardRef(function (e, t) {
          var n = e.currentUrl,
            i = (0, s.gL)(),
            o = i.Config,
            a = i.userAgnosticTrackingParams,
            c = y(n);
          return N.includes(null === a || void 0 === a ? void 0 : a.page_key)
            ? r.createElement(
                "div",
                {
                  ref: t,
                  className: "ud-sr-only",
                  "aria-hidden": !0,
                  "data-testid": "seo-link-container",
                },
                o.supported_languages.map(function (e) {
                  return r.createElement(
                    "a",
                    { key: e.locale, href: c(e.locale).path, tabIndex: -1 },
                    e.name
                  );
                })
              )
            : null;
        }),
        I = n(59499),
        T = n(4730),
        Z = n(33372),
        R = n.n(Z),
        A = n(21617),
        L = n.n(A),
        j = n(23290),
        D = n(82614),
        M = n.n(D),
        z = ["publishEvents", "withLabel", "className", "size", "onClick"],
        U = r.forwardRef(function (e, t) {
          var n = e.publishEvents,
            c = e.withLabel,
            l = void 0 === c || c,
            u = e.className,
            d = e.size,
            p = void 0 === d ? "medium" : d,
            m = e.onClick,
            f = (0, T.Z)(e, z),
            h = (0, o.QT)().locale,
            b = (0, s.gL)().Config.supported_languages.find(function (e) {
              return e.locale === h;
            });
          var y = l ? a.zx : j.h;
          return r.createElement(
            y,
            Object.assign(
              {
                ref: t,
                className: R()((0, I.Z)({}, M().button, l), u),
                udStyle: "secondary",
                size: p,
                typography: "ud-text-md",
                onClick: function (e) {
                  n &&
                    i.j.publishEvent(
                      new v({
                        action: g,
                        selectorLocation: n.uiRegion,
                        selectedLocale: null,
                      })
                    ),
                    null === m || void 0 === m || m(e);
                },
              },
              f
            ),
            r.createElement(
              r.Fragment,
              null,
              r.createElement(L(), {
                label: !1,
                size: "small",
                color: "neutral",
              }),
              l &&
                r.createElement(
                  "span",
                  null,
                  null === b || void 0 === b ? void 0 : b.name
                )
            )
          );
        }),
        F = n(71361),
        B = n(80955),
        W = ["trigger", "renderModal"],
        H = Object.assign(
          (0, B.Pi)(function (e) {
            var t = e.trigger,
              n = e.renderModal,
              i = (0, T.Z)(e, W),
              o = (0, r.useState)(!1),
              a = o[0],
              s = o[1];
            return r.createElement(
              r.Fragment,
              null,
              r.cloneElement(t, {
                onClick: function (e) {
                  var n, r;
                  s(!0),
                    null === (n = (r = t.props).onClick) ||
                      void 0 === n ||
                      n.call(r, e);
                },
              }),
              n({
                isOpen: a,
                onClose: function () {
                  var e;
                  s(!1), null === (e = i.onClose) || void 0 === e || e.call(i);
                },
              })
            );
          }),
          { displayName: "ModalTrigger" }
        ),
        Q = n(15515),
        V = n(52885),
        q = n.n(V);
      var G = function (e) {
        var t = e.uiRegion,
          n = e.trigger,
          a = e.useLangPrefixedUrls,
          s = void 0 === a || a,
          c = (0, o.QT)().gettext,
          l = (0, F.ag)("sm-max");
        return r.createElement(H, {
          trigger: n,
          renderModal: function (e) {
            return r.createElement(
              Q.u,
              Object.assign({}, e, {
                fullPage: Boolean(l),
                className: q().modal,
                title: c("Choose a language"),
                onOpen: function () {
                  return (function (e) {
                    i.j.publishEvent(
                      new v({
                        action: g,
                        selectorLocation: e,
                        selectedLocale: null,
                      })
                    );
                  })(t);
                },
              }),
              r.createElement(x, { uiRegion: t, useLangPrefixedUrls: s })
            );
          },
        });
      };
    },
    54844: function (e, t, n) {
      "use strict";
      n.d(t, {
        u: function () {
          return f;
        },
        Z: function () {
          return m;
        },
      });
      var r = n(4730),
        i = n(67294),
        o = n(79594),
        a = n(21042),
        s = n.n(a),
        c = n(76905),
        l = n(36186),
        u = n(82634),
        d = n.n(u),
        p = ["className", "background"],
        m = function (e) {
          var t = e.className,
            n = void 0 === t ? "" : t,
            a = e.background,
            u = void 0 === a ? "neutral" : a,
            m = (0, r.Z)(e, p),
            f = (0, o.QT)().gettext;
          return (0, l.gL)().Config.brand.has_organization
            ? i.createElement(
                c.C,
                Object.assign(
                  { className: "".concat(n, " ").concat(d()["pro-badge"]) },
                  m
                ),
                i.createElement(s(), {
                  className: "icon",
                  size: "xsmall",
                  label: !1,
                  color: "inherit",
                }),
                "Pro"
              )
            : i.createElement(
                c.C,
                Object.assign(
                  { className: "".concat(n, " ").concat(d()[u]) },
                  m
                ),
                f("Beta")
              );
        };
      m.displayName = "ProBadge";
      var f = 100;
    },
    80344: function (e, t, n) {
      "use strict";
      n.d(t, {
        WV: function () {
          return _;
        },
      });
      var r,
        i = n(59499),
        o = n(36186);
      var a = "https://www.benesse.co.jp/udemy/biz/",
        s = "https://udemy.wjtb.co.kr/insight/index",
        c = "https://info.udemy.com/KR_ContactUs.html",
        l = "/udemy-business/",
        u = "".concat(l, "sign-up/"),
        d =
          ("".concat(u, "?ref=ufb_trial_extension_request"),
          Object.freeze({
            COURSE: "course",
            LEARNING_PATH: "learning_path",
            LAB: "lab",
            ASSESSMENT: "adaptive_assessment_assessment",
          })),
        p =
          (Object.freeze(
            ((r = {}),
            (0, i.Z)(r, d.COURSE, "courses"),
            (0, i.Z)(r, d.LEARNING_PATH, "paths"),
            (0, i.Z)(r, d.LAB, "labs"),
            (0, i.Z)(r, d.ASSESSMENT, "assessments"),
            r)
          ),
          Object.freeze({ UNSPECIFIED: 0, ENTERPRISE: 1, PRO: 2 }),
          {
            utm_source: "Campaign_Source_utm_source__c",
            utm_medium: "Campaign_Medium_utm_medium__c",
            utm_campaign: "CampaignID_utm_campaign__c",
            utm_content: "Campaign_Content_utm_content__c",
            utm_term: "Campaign_Term_utm_term__c",
            utm_method: "Campaign_Method_utm_method__c",
            utm_region: "Campaign_Region_utm_region__c",
          });
      n(63553);
      var m = n(88309),
        f = n(41477),
        g = n(43283),
        h = n(14457);
      function v(e, t) {
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
      function b(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? v(Object(n), !0).forEach(function (t) {
                (0, i.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : v(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      function y() {
        for (
          var e,
            t = Object.keys(p),
            n = new URLSearchParams(
              (null === (e = m.N.global.location) || void 0 === e
                ? void 0
                : e.search) || ""
            ),
            r = {},
            i = 0,
            o = t;
          i < o.length;
          i++
        ) {
          var a = o[i];
          n.has(a) && (r[a] = n.get(a));
        }
        return r;
      }
      function _(e) {
        var t,
          n,
          r =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
          u = arguments.length > 3 ? arguments[3] : void 0,
          d =
            null !== (t = null === u || void 0 === u ? void 0 : u.request) &&
            void 0 !== t
              ? t
              : (0, f.s)(),
          p =
            null !== (n = null === u || void 0 === u ? void 0 : u.Config) &&
            void 0 !== n
              ? n
              : (0, g.c)(),
          v = l;
        if (
          (e && (v += "".concat(e, "/")),
          "ja_JP" === d.locale && (v = a),
          "ko_KR" === d.locale && (v = "request-demo-mx" === e ? c : s),
          "request-demo" === e &&
            "ja_JP" !== d.locale &&
            "ko_KR" !== d.locale &&
            "de_DE" !== d.locale)
        ) {
          var _;
          if ((0, h.os)("sw", "onsite_demo_form", !1) || i)
            return o.qJ.to(
              "organization-growth/request-demo",
              null,
              b(
                b({}, r),
                {},
                {
                  locale: d.locale,
                  next:
                    encodeURIComponent(
                      null === (_ = m.N.global.location) || void 0 === _
                        ? void 0
                        : _.href
                    ) || "",
                },
                y()
              )
            );
          v =
            "IN" === p.price_country.id
              ? "".concat(l, "request-demo-in-mx/")
              : "".concat(l, "request-demo-mx/");
        }
        var E = new URLSearchParams(b(b({}, r), {}, { locale: d.locale }));
        return "".concat(v, "?").concat(E.toString());
      }
    },
    47091: function (e, t, n) {
      "use strict";
      n.d(t, {
        i: function () {
          return r;
        },
      });
      var r = {
        udemyLogoUrl: "/staticx/udemy/images/v7/logo-udemy.svg",
        udemyLogoInvertedUrl:
          "/staticx/udemy/images/v7/logo-udemy-inverted.svg",
        ubLogoUrl: "/staticx/udemy/images/v7/logo-ub.svg",
        ubLogoInvertedUrl: "/staticx/udemy/images/v7/logo-ub-inverted.svg",
        ugLogoUrl: "/staticx/udemy/images/v7/logo-ug.svg",
        ugLogoInvertedUrl: "/staticx/udemy/images/v7/logo-ug-inverted.svg",
        udemyProLogoUrl: "/staticx/udemy/images/v7/logo-upro.svg",
        udemyBenesseLogoUrl: "/staticx/udemy/images/v7/logo-udemy-benesse.svg",
        udemyBenesseLogoInvertedUrl:
          "/staticx/udemy/images/v7/logo-udemy-benesse-inverted.svg",
      };
    },
    49927: function (e, t, n) {
      "use strict";
      n.d(t, {
        u: function () {
          return u;
        },
      });
      var r = n(41293),
        i = n(36186),
        o = n(94184),
        a = n.n(o),
        s = n(67294),
        c = n(81613),
        l = n.n(c),
        u = function () {
          var e = (0, i.gL)().Config;
          return "boolean" === typeof e.brand.organization ||
            e.brand.organization.has_logo
            ? s.createElement(r.E, {
                src: e.brand.logo_url_2x,
                alt: e.brand.title,
                width: "unset",
                height: "unset",
                "data-purpose": "ufb-logo",
                className: l().logo,
              })
            : s.createElement(
                "div",
                { className: a()("ud-heading-md", l()["brand-title"]) },
                e.brand.title
              );
        };
    },
    773: function (e, t, n) {
      "use strict";
      n.d(t, {
        h: function () {
          return c;
        },
      });
      var r = n(4730),
        i = n(67294),
        o = n(38349),
        a = ["checked", "defaultChecked", "checkedStateComponent"],
        s = (0, i.createContext)(null),
        c = function (e) {
          var t = e.allowToggle,
            n = void 0 !== t && t,
            r = e.name,
            o = e.children,
            a = (0, i.useState)(null),
            c = {
              allowToggle: n,
              selectedId: a[0],
              setSelectedId: a[1],
              name: r,
            };
          return i.createElement(s.Provider, { value: c }, o);
        };
      c.Radio = function (e) {
        var t = e.checked,
          n = void 0 === t ? null : t,
          c = e.defaultChecked,
          l = void 0 !== c && c,
          u = e.checkedStateComponent,
          d = void 0 === u ? o.i : u,
          p = (0, r.Z)(e, a),
          m = (0, i.useRef)(!0),
          f = (0, i.useContext)(s);
        (0, i.useEffect)(function () {
          l && (null === f || void 0 === f || f.setSelectedId(p.id));
        }, []);
        var g = m.current && l,
          h = (null === f || void 0 === f ? void 0 : f.selectedId) === p.id,
          v = null !== n ? n : g || h;
        return (
          (m.current = !1),
          i.createElement(
            d,
            Object.assign({}, p, {
              "data-type": "radio",
              "data-name": null === f || void 0 === f ? void 0 : f.name,
              "data-checked": v ? "checked" : "",
              onChange: function (e) {
                var t,
                  n,
                  r = !(
                    null === (t = e.target) ||
                    void 0 === t ||
                    !t.dataset.checked
                  ),
                  i = !(null !== f && void 0 !== f && f.allowToggle) || !r;
                ((e.target.dataset.checked = i ? "checked" : ""),
                null === f ||
                  void 0 === f ||
                  f.setSelectedId(i ? e.target.id : null),
                r !== i) &&
                  (null === (n = p.onChange) || void 0 === n || n.call(p, e));
              },
            })
          )
        );
      };
    },
    57514: function (e, t, n) {
      "use strict";
      n.d(t, {
        k: function () {
          return g;
        },
        q: function () {
          return h;
        },
      });
      var r = n(17674),
        i = n(4730),
        o = n(33778),
        a = n.n(o),
        s = n(76978),
        c = n(94184),
        l = n.n(c),
        u = n(67294),
        d = n(41293),
        p = ["size", "lazy", "alt", "srcKey", "className"],
        m = ["user"],
        f = {
          small: [
            32,
            "".concat((0, s.Q1)(32), "rem"),
            "ud-heading-sm",
            "ud-heading-sm",
          ],
          medium: [
            48,
            "".concat((0, s.Q1)(48), "rem"),
            "ud-heading-md",
            "ud-heading-md",
          ],
          large: [
            64,
            "".concat((0, s.Q1)(64), "rem"),
            "ud-heading-xl",
            "ud-heading-xl",
          ],
        },
        g = "image_75x75",
        h = function (e) {
          var t,
            n,
            o = e.size,
            s = void 0 === o ? "large" : o,
            c = e.lazy,
            h = e.alt,
            v = e.srcKey,
            b = void 0 === v ? g : v,
            y = e.className,
            _ = (0, i.Z)(e, p),
            E = (0, r.Z)(f[s], 4),
            w = E[0],
            O = E[1],
            S = E[2],
            k = E[3],
            C = { width: O, height: O };
          if ("icon" in _)
            return u.createElement(
              "div",
              { style: C, className: l()(y, "ud-avatar", k) },
              u.cloneElement(_.icon, { size: s })
            );
          var x,
            N = _.user,
            P = (0, i.Z)(_, m),
            I = null !== (t = N[b]) && void 0 !== t ? t : "",
            T =
              "DISPLAY_NAME" === h &&
              null !== (n = N.display_name) &&
              void 0 !== n
                ? n
                : "";
          return a()(I).call(I, "anonymous") &&
            null !== N &&
            void 0 !== N &&
            N.initials
            ? u.createElement(
                "div",
                Object.assign({}, P, {
                  "aria-label": T || void 0,
                  "aria-hidden": !T || void 0,
                  style: C,
                  className: l()(y, "ud-avatar", S),
                  "data-purpose": "display-initials",
                }),
                N.initials
              )
            : (void 0 !== c && (x = c ? "lazy" : "eager"),
              u.createElement(
                d.E,
                Object.assign({}, P, {
                  src: I,
                  alt: T,
                  className: l()(y, "ud-avatar", "ud-avatar-image"),
                  width: w,
                  height: w,
                  style: C,
                  loading: x,
                })
              ));
        };
    },
    54742: function (e, t, n) {
      "use strict";
      n.d(t, {
        W: function () {
          return d;
        },
      });
      var r = n(4730),
        i = n(94184),
        o = n.n(i),
        a = n(67294),
        s = n(45566),
        c = ["size", "padding", "iconAlignment", "children", "renderListItem"],
        l = ["icon", "color", "componentClass", "children", "loading"],
        u = (0, a.createContext)({ iconAlignment: "", padding: "", size: "" }),
        d = function (e) {
          var t = e.size,
            n = e.padding,
            i = void 0 === n ? "normal" : n,
            s = e.iconAlignment,
            l = void 0 === s ? "left" : s,
            d = e.children,
            p = e.renderListItem,
            m =
              void 0 === p
                ? function (e) {
                    return e ? a.createElement("li", null, e) : null;
                  }
                : p,
            f = (0, r.Z)(e, c),
            g = a.Children.map(d, m);
          return g && 0 !== g.length
            ? a.createElement(
                u.Provider,
                { value: { iconAlignment: l, padding: i, size: t } },
                a.createElement(
                  "ul",
                  Object.assign({}, f, {
                    className: o()(
                      "ud-unstyled-list ud-block-list",
                      f.className
                    ),
                  }),
                  g
                )
              )
            : null;
        },
        p = function (e, t) {
          return a.cloneElement(e, {
            className: o()(e.props.className, "ud-block-list-item-icon"),
            size: "large" === t ? "small" : "xsmall",
          });
        },
        m = Object.assign(
          a.forwardRef(function (e, t) {
            var n = e.icon,
              i = e.color,
              c = e.componentClass,
              d = e.children,
              m = e.loading,
              f = void 0 !== m && m,
              g = (0, r.Z)(e, l),
              h = (0, a.useContext)(u),
              v = h.iconAlignment,
              b = h.padding,
              y = h.size,
              _ = n && "left" === v ? p(n, y) : null,
              E = n && "right" === v ? p(n, y) : null,
              w = a.createElement(
                "div",
                {
                  className: o()("ud-block-list-item-content", {
                    "ud-block-list-item-content-loading": f,
                  }),
                },
                f ? "\xa0" : d
              ),
              O = null !== i && void 0 !== i ? i : g.href ? "link" : "neutral",
              S = "large" === y ? "ud-text-md" : "ud-text-sm",
              k = f
                ? "div"
                : g.href
                ? "a"
                : null !== c && void 0 !== c
                ? c
                : "div",
              C = o()(
                g.className,
                "ud-block-list-item",
                "ud-block-list-item-".concat(y),
                "normal" !== b ? "ud-block-list-item-".concat(b) : "",
                "ud-block-list-item-".concat(O)
              );
            if ("div" === k)
              return a.createElement(
                "div",
                Object.assign({ ref: t }, g, { className: o()(C, S) }),
                _,
                w,
                E
              );
            if ("a" === k || "button" === k) {
              var x = { componentClass: k, typography: S, udStyle: "ghost" };
              return a.createElement(
                s.zx,
                Object.assign({ ref: t }, g, { className: C }, x),
                _,
                w,
                E
              );
            }
            var N = k;
            return a.createElement(
              N,
              Object.assign({ ref: t }, g, { className: C }),
              _,
              w,
              E
            );
          }),
          { displayName: "BlockListItem" }
        );
      d.Item = m;
    },
    13527: function (e, t, n) {
      "use strict";
      n.d(t, {
        n: function () {
          return m;
        },
      });
      var r,
        i = n(4730),
        o = n(59499),
        a = n(79594),
        s = n(67294),
        c = ["numSeconds", "presentationStyle", "precision"],
        l = 60,
        u = {
          HUMAN: "human",
          HUMAN_COMPACT: "humanCompact",
          TIMESTAMP: "timestamp",
        },
        d = { HOURS: "hours", MINUTES: "minutes", SECONDS: "seconds" },
        p =
          ((r = {}),
          (0, o.Z)(r, u.HUMAN, function (e, t, n) {
            var r = t.numSeconds,
              i = t.precision,
              o = n.gettext,
              a = n.interpolate,
              s = o("%(hours)shr"),
              c = o("%(minutes)smin"),
              l = o("%(hours)shr %(minutes)smin"),
              u = Math.round(e / 60),
              p = Math.floor(u / 60);
            if (!p) return !u && r && (u = 1), a(c, { minutes: u }, !0);
            if (i === d.HOURS)
              return (p = Math.round(u / 30) / 2), a(s, { hours: p }, !0);
            if (!(u %= 60)) return a(s, { hours: p }, !0);
            return a(l, { hours: p, minutes: u }, !0);
          }),
          (0, o.Z)(r, u.HUMAN_COMPACT, function (e, t, n) {
            var r = t.precision,
              i = n.gettext,
              o = n.interpolate,
              a = e % l,
              s = Math.floor(e / l) % 60,
              c = Math.floor(e / 3600),
              u = {
                hms: i("%(hours)sh %(minutes)sm %(seconds)ss"),
                hm: i("%(hours)sh %(minutes)sm"),
                m: i("%(minutes)sm"),
                ms: i("%(minutes)sm %(seconds)ss"),
                s: i("%(seconds)ss"),
              },
              p = [],
              m = { hours: c, minutes: s, seconds: a };
            c && p.push("h");
            (s || c || (!s && r === d.MINUTES)) && p.push("m");
            r === d.SECONDS && p.push("s");
            var f = u[p.join("")];
            return o(f.replace(/ /g, "\xa0"), m, !0);
          }),
          (0, o.Z)(r, u.TIMESTAMP, function (e) {
            var t = e % l,
              n = Math.floor(e / l) % 60,
              r = Math.floor(e / 3600),
              i = function (e) {
                return e < 10 ? "0".concat(e) : "".concat(e);
              };
            if (0 === r) return "".concat(n, ":").concat(i(t));
            return "".concat(r, ":").concat(i(n), ":").concat(i(t));
          }),
          r),
        m = function (e) {
          var t = e.numSeconds,
            n = e.presentationStyle,
            r = void 0 === n ? u.HUMAN : n,
            o = e.precision,
            l = void 0 === o ? d.MINUTES : o,
            m = (0, i.Z)(e, c),
            f = (0, a.QT)(),
            g = f.gettext,
            h = f.interpolate;
          return s.createElement(
            "span",
            m,
            (function (e, t) {
              var n = e.numSeconds,
                r = e.presentationStyle,
                i = void 0 === r ? u.HUMAN : r,
                o = e.precision,
                a = void 0 === o ? d.MINUTES : o,
                s = Math.floor(n);
              return p[i](
                s,
                { numSeconds: n, presentationStyle: i, precision: a },
                t
              );
            })(
              { numSeconds: t, presentationStyle: r, precision: l },
              { gettext: g, interpolate: h }
            )
          );
        };
      (m.displayName = "Duration"), (m.STYLE = u), (m.PRECISION = d);
    },
    7318: function (e, t, n) {
      "use strict";
      n.d(t, {
        i: function () {
          return d;
        },
      });
      var r = n(11577),
        i = n.n(r),
        o = n(23290),
        a = n(94184),
        s = n.n(a),
        c = n(67294),
        l = n(12235),
        u = n.n(l),
        d = function (e) {
          var t = e.className,
            n = e.id,
            r = e.label;
          return c.createElement(
            o.h,
            {
              className: s()(u()["close-btn"], t),
              "data-purpose": "close-btn",
              cssToggleId: n,
              round: !0,
              udStyle: "white-solid",
              "aria-label": r,
            },
            c.createElement(i(), { color: "neutral", label: !1 })
          );
        };
    },
    66514: function (e, t, n) {
      "use strict";
      n.d(t, {
        b: function () {
          return d;
        },
      });
      var r = n(773),
        i = n(94184),
        o = n.n(i),
        a = n(67294),
        s = n(70753),
        c = n(33935),
        l = n.n(c),
        u = n(35679),
        d = function (e) {
          var t = a.useContext(u.A);
          return a.createElement(
            r.h.Radio,
            Object.assign({}, e, {
              className: o()("js-drawer-radio", l()["drawer-radio"]),
              onChange: function (n) {
                var r = e.onChange;
                setTimeout(function () {
                  if (n.target.dataset.checked) {
                    var e = t.current,
                      r =
                        null === e || void 0 === e
                          ? void 0
                          : e.findFirstFocusable();
                    null === r || void 0 === r || r.focus();
                  }
                }, s.M),
                  null === r || void 0 === r || r(n);
              },
            })
          );
        };
    },
    70753: function (e, t, n) {
      "use strict";
      n.d(t, {
        M: function () {
          return i;
        },
        T: function () {
          return o;
        },
      });
      var r = n(36526),
        i = 255;
      function o(e) {
        var t = e.querySelector(
          '.js-drawer-radio[data-checked="checked"] ~ .js-drawer'
        );
        return (0, r.W)(t || e)[0];
      }
    },
    35679: function (e, t, n) {
      "use strict";
      n.d(t, {
        A: function () {
          return w;
        },
        j: function () {
          return O;
        },
      });
      var r = n(59499),
        i = n(4730),
        o = n(42551),
        a = n(86593),
        s = n(79594),
        c = n(38349),
        l = n(773),
        u = n(543),
        d = n(94184),
        p = n.n(d),
        m = n(67294),
        f = n(7318),
        g = n(59957),
        h = n(46546),
        v = n(66514),
        b = n(70753),
        y = n(33935),
        _ = n.n(y),
        E = [
          "className",
          "children",
          "id",
          "mainDrawerId",
          "onToggle",
          "side",
          "subDrawers",
          "title",
        ],
        w = m.createContext(m.createRef()),
        O = m.forwardRef(function (e, t) {
          var n,
            d = e.className,
            y = e.children,
            O = e.id,
            S = e.mainDrawerId,
            k = e.onToggle,
            C = e.side,
            x = e.subDrawers,
            N = e.title,
            P = (0, i.Z)(e, E),
            I = (0, s.QT)().gettext,
            T = "".concat(O, "-radio-group"),
            Z = (0, m.useRef)(null),
            R = (0, m.useRef)(null),
            A = (0, m.useState)((0, o.Ki)("side-drawer-title"))[0];
          return m.createElement(
            w.Provider,
            { value: Z },
            m.createElement(
              l.h,
              { name: T },
              m.createElement(
                "div",
                { className: _()["dialog-container"] },
                m.createElement(u.J, {
                  id: O,
                  className: p()(
                    "ud-full-page-overlay-checkbox",
                    _()["main-drawer-checkbox"]
                  ),
                  closeOnEscape: !0,
                  onChange: function (e) {
                    var t,
                      n = (0, c.C)(e);
                    if (
                      (null === (t = Z.current) ||
                        void 0 === t ||
                        t.onToggle((0, c.C)(e), R.current),
                      !n)
                    ) {
                      var r,
                        i,
                        o =
                          null === (r = R.current) || void 0 === r
                            ? void 0
                            : r.parentNode;
                      Array.from(
                        null !==
                          (i =
                            null === o || void 0 === o
                              ? void 0
                              : o.querySelectorAll(".js-drawer > div")) &&
                          void 0 !== i
                          ? i
                          : []
                      ).forEach(function (e) {
                        a.GA.has(e) && (0, a.p7)(e);
                      });
                    }
                    null === k || void 0 === k || k(n);
                  },
                }),
                m.createElement(h.i, { cssToggleId: O }),
                m.createElement(v.b, { id: S, defaultChecked: !0 }),
                m.createElement(
                  g.U,
                  Object.assign({}, P, {
                    ref: Z,
                    labelledById: A,
                    findFirstFocusable: b.T,
                    className: p()(
                      "js-drawer",
                      _()["side-drawer"],
                      ((n = {}),
                      (0, r.Z)(n, _()["side-left"], "left" === C),
                      (0, r.Z)(n, _()["side-right"], "right" === C),
                      n)
                    ),
                  }),
                  m.createElement(
                    "nav",
                    { className: _()["drawer-container"], ref: t },
                    m.createElement(
                      "div",
                      { ref: R, className: p()(d, _()["drawer-content"]) },
                      m.createElement(g.U.Title, { id: A, show: !1 }, N),
                      y
                    ),
                    x
                  ),
                  m.createElement(f.i, {
                    className: _()["close-btn"],
                    id: O,
                    label: I("Close side drawer"),
                  })
                )
              )
            )
          );
        });
      O.displayName = "SideDrawer";
    },
    95931: function (e, t, n) {
      "use strict";
      n.d(t, {
        Q: function () {
          return l;
        },
        Y: function () {
          return u;
        },
      });
      var r = n(4730),
        i = n(94184),
        o = n.n(i),
        a = n(67294),
        s = n(79298),
        c = ["size"],
        l = function (e) {
          var t = e.size,
            n = e.className;
          return a.createElement("span", {
            className: o()(n, "ud-fake-toggle-input ud-fake-toggle-radio", {
              "ud-fake-toggle-radio-small": "small" === t,
              "ud-fake-toggle-radio-large": "large" === t,
            }),
          });
        },
        u = function (e) {
          var t = e.size,
            n = void 0 === t ? "small" : t,
            i = (0, r.Z)(e, c),
            o = a.createElement(l, { size: n });
          return a.createElement(
            s.s,
            Object.assign({ size: n }, i, { fakeInput: o, inputType: "radio" })
          );
        };
      u.$$udType = "Radio";
    },
    43880: function (e, t, n) {
      "use strict";
      n.d(t, {
        K: function () {
          return f;
        },
      });
      var r = n(59499),
        i = n(4730),
        o = n(94184),
        a = n.n(o),
        s = n(80955),
        c = n(67294),
        l = n(65310),
        u = n(49161),
        d = n.n(u),
        p = ["size", "className"];
      function m(e, t) {
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
      var f = (0, s.Pi)(
        c.forwardRef(function (e, t) {
          var n = e.size,
            o = void 0 === n ? "large" : n,
            u = e.className,
            f = (0, i.Z)(e, p),
            g = c.useContext(s.yX).$$udFormGroup,
            h = null === g || void 0 === g ? void 0 : g.inputAriaProps;
          return (
            (0, l.g)(
              "TextArea",
              (function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var n = null != arguments[t] ? arguments[t] : {};
                  t % 2
                    ? m(Object(n), !0).forEach(function (t) {
                        (0, r.Z)(e, t, n[t]);
                      })
                    : Object.getOwnPropertyDescriptors
                    ? Object.defineProperties(
                        e,
                        Object.getOwnPropertyDescriptors(n)
                      )
                    : m(Object(n)).forEach(function (t) {
                        Object.defineProperty(
                          e,
                          t,
                          Object.getOwnPropertyDescriptor(n, t)
                        );
                      });
                }
                return e;
              })({ $$udFormGroup: g }, f),
              null,
              !0
            ),
            c.createElement(
              "textarea",
              Object.assign({ rows: "2", ref: t }, h, f, {
                id: g ? g.id : f.id,
                className: a()(
                  "ud-text-input",
                  [d()["ud-text-area-".concat(o)]],
                  { "ud-text-md": "large" === o, "ud-text-sm": "small" === o },
                  u
                ),
              })
            )
          );
        })
      );
      f.displayName = "TextArea";
    },
    62032: function (e, t, n) {
      "use strict";
      n.d(t, {
        HT: function () {
          return g;
        },
        JJ: function () {
          return m;
        },
        _T: function () {
          return p;
        },
        bt: function () {
          return h;
        },
        iO: function () {
          return f;
        },
      });
      var r = n(36864),
        i = n(4730),
        o = n(80955),
        a = n(67294),
        s = n(79594),
        c = n(18614),
        l = n(97198),
        u = ["dot"],
        d = ["dot"],
        p = (0, o.Pi)(function (e) {
          var t,
            n = e.dot,
            r = (0, i.Z)(e, u),
            o = (0, l.k)(),
            d = (0, s.QT)().ninterpolate,
            p =
              null !==
                (t = o.notificationBadgeContext.unreadActivityNotifications) &&
              void 0 !== t
                ? t
                : 0;
          return a.createElement(
            c.C,
            Object.assign({}, r, {
              label: d(
                "%(count)s unread notification",
                "%(count)s unread notifications",
                p,
                { count: p }
              ),
              "data-testid": "unread-activity-notifications-badge",
            }),
            n && p > 0 ? null : p
          );
        }),
        m = (0, o.Pi)(function (e) {
          var t,
            n = (0, l.k)(),
            r = (0, s.QT)().ninterpolate,
            i =
              null !== (t = n.notificationBadgeContext.unreadMessages) &&
              void 0 !== t
                ? t
                : 0;
          return a.createElement(
            c.C,
            Object.assign({}, e, {
              label: r(
                "%(count)s unread message",
                "%(count)s unread messages",
                i,
                { count: i }
              ),
              "data-testid": "unread-messages-badge",
            }),
            i
          );
        }),
        f = (0, o.Pi)(function (e) {
          var t = (0, r.Z)({}, e),
            n = (0, l.k)(),
            i = (0, s.QT)().ninterpolate,
            o = n.notificationBadgeContext.unseenCredits;
          return a.createElement(
            c.C,
            Object.assign({}, t, {
              label: i(
                "%(count)s unseen credit",
                "%(count)s unseen credits",
                o,
                { count: o }
              ),
              "data-testid": "unseen-credits-badge",
            }),
            o
          );
        }),
        g = (0, o.Pi)(function (e) {
          var t = (0, r.Z)({}, e),
            n = (0, l.k)(),
            i = (0, s.QT)().ninterpolate,
            o = n.notificationBadgeContext.cartBuyables;
          return a.createElement(
            c.C,
            Object.assign({}, t, {
              "aria-hidden": "true",
              label: i(
                "%(count)s item in the cart",
                "%(count)s items in the cart",
                o,
                { count: o }
              ),
              "data-testid": "cart-badge",
            }),
            o
          );
        }),
        h = (0, o.Pi)(function (e) {
          var t = e.dot,
            n = (0, i.Z)(e, d),
            r = (0, l.k)(),
            o = (0, s.QT)().gettext,
            u = r.notificationBadgeContext.unreadAlerts;
          return a.createElement(
            c.C,
            Object.assign({}, n, {
              label: o("You have alerts"),
              "data-testid": "profile-badge",
            }),
            t && u > 0 ? null : u
          );
        });
    },
    17958: function (e, t, n) {
      "use strict";
      n.d(t, {
        Qm: function () {
          return o;
        },
        UQ: function () {
          return i;
        },
        xo: function () {
          return a;
        },
      });
      var r = n(13133),
        i = {
          CATEGORY: "category",
          SUBCATEGORY: "subcategory",
          TOPIC: "course_label",
        },
        o = function (e) {
          return {
            LABS: {
              id: 0,
              type: r.Mm.LABS,
              title: e("Labs"),
              absolute_url: "/labs/listing/",
            },
            ASSESSMENTS: {
              id: 1,
              type: r.Mm.ASSESSMENTS,
              title: e("Assessments"),
              absolute_url: "/skills-assessment/",
            },
            UDEMY_PRO_PATHS: {
              id: 2,
              type: r.Mm.UDEMY_PRO_PATHS,
              title: e("Udemy paths"),
              absolute_url: "/learning-paths/pro/",
            },
          };
        },
        a = function (e) {
          return {
            CERTIFICATIONS: {
              id: 0,
              type: r.cq.CERTIFICATIONS,
              title: e("Certification preparation"),
              absolute_url: "/open-badges/",
            },
          };
        };
    },
    34364: function (e, t, n) {
      "use strict";
      n.d(t, {
        Cf: function () {
          return r;
        },
        Nc: function () {
          return i;
        },
        Pi: function () {
          return o;
        },
      });
      var r = [184, 192, 577, 240],
        i = (function (e) {
          return (
            (e.DESKTOP_HEADER = "desktop_header"),
            (e.MOBILE_NAV = "mobile_nav"),
            e
          );
        })({}),
        o = {
          individual_buyable: "buyable_price",
          individual_shopping_buyable: "buyable_cart_price",
          bundle: "bundle_price",
          subtotal: "subtotal_price",
          total: "total_price",
        };
    },
    55306: function (e, t, n) {
      "use strict";
      n.d(t, {
        f: function () {
          return s;
        },
        p: function () {
          return a;
        },
      });
      var r = n(4730),
        i = n(67294),
        o = ["children"],
        a = i.createContext(null),
        s = function (e) {
          var t = e.children,
            n = (0, r.Z)(e, o);
          return i.createElement(a.Provider, { value: n }, t);
        };
    },
    13133: function (e, t, n) {
      "use strict";
      n.d(t, {
        F2: function () {
          return u;
        },
        FO: function () {
          return f;
        },
        Mm: function () {
          return d;
        },
        cq: function () {
          return m;
        },
        qf: function () {
          return p;
        },
      });
      var r = n(82262),
        i = n(92777),
        o = n(45959),
        a = n(63553),
        s = n(37247),
        c = n(24076);
      function l(e) {
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
          var n,
            r = (0, s.Z)(e);
          if (t) {
            var i = (0, s.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, a.Z)(this, n);
        };
      }
      var u = (function (e) {
          (0, o.Z)(n, e);
          var t = l(n);
          function n(e) {
            var r;
            (0, i.Z)(this, n);
            var o = e.context;
            return (
              ((r = t.call(this, "CategoryNavItemSelectEvent")).categoryId =
                void 0),
              (r.subcategoryId = void 0),
              (r.topicId = void 0),
              (r.categoryId = o.categoryId),
              (r.subcategoryId = o.subcategoryId),
              (r.topicId = o.topicId),
              r
            );
          }
          return (0, r.Z)(n);
        })(c.rp),
        d = (function (e) {
          return (
            (e.LABS = "labs"),
            (e.ASSESSMENTS = "assessments"),
            (e.UDEMY_PRO_PATHS = "pro_paths"),
            e
          );
        })({}),
        p = (function (e) {
          (0, o.Z)(n, e);
          var t = l(n);
          function n(e) {
            var r;
            return (
              (0, i.Z)(this, n),
              ((r = t.call(this, "LearningTypeNavItemSelectEvent")).itemType =
                void 0),
              (r.itemType = e),
              r
            );
          }
          return (0, r.Z)(n);
        })(c.rp),
        m = (function (e) {
          return (e.CERTIFICATIONS = "certifications"), e;
        })({}),
        f = (function (e) {
          (0, o.Z)(n, e);
          var t = l(n);
          function n(e) {
            var r;
            return (
              (0, i.Z)(this, n),
              ((r = t.call(this, "BadgeNavItemSelectEvent")).itemType = void 0),
              (r.itemType = e),
              r
            );
          }
          return (0, r.Z)(n);
        })(c.rp);
    },
    74245: function (e, t, n) {
      "use strict";
      n.d(t, {
        v: function () {
          return u;
        },
      });
      var r = n(17674),
        i = n(50029),
        o = n(87794),
        a = n.n(o),
        s = n(48809);
      function c(e) {
        return l.apply(this, arguments);
      }
      function l() {
        return (l = (0, i.Z)(
          a().mark(function e(t) {
            var n, r, i, o, c;
            return a().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (i = t.isUFB ? "ufb-main" : "ud-main"),
                      (e.next = 3),
                      s.uh.get(
                        "/structured-data/navigation-lists/?list_ids="
                          .concat(i, "&locale=")
                          .concat(t.locale)
                      )
                    );
                  case 3:
                    return (
                      (o = e.sent),
                      (c =
                        null !==
                          (n =
                            null !== (r = o.data[i]) && void 0 !== r
                              ? r
                              : o.data["ufb-main"]) && void 0 !== n
                          ? n
                          : o.data["ud-main"]),
                      e.abrupt("return", c.items)
                    );
                  case 6:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function u(e) {
        return d.apply(this, arguments);
      }
      function d() {
        return (
          (d = (0, i.Z)(
            a().mark(function e(t) {
              var n,
                i,
                o,
                l,
                u,
                d,
                p = arguments;
              return a().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (n = p.length > 1 && void 0 !== p[1] && p[1]),
                        (i = p.length > 2 ? p[2] : void 0),
                        (e.next = 4),
                        Promise.all([
                          (0, s.$A)({ header: !0 }),
                          c({ locale: t, isUFB: n }),
                        ])
                      );
                    case 4:
                      return (
                        (o = e.sent),
                        (l = (0, r.Z)(o, 2)),
                        (u = l[0]),
                        (d = l[1]),
                        (u.data.header.navigationCategories = d),
                        null === i || void 0 === i || i(u),
                        e.abrupt("return", u)
                      );
                    case 11:
                    case "end":
                      return e.stop();
                  }
              }, e);
            })
          )),
          d.apply(this, arguments)
        );
      }
      u.reset = function () {
        s.$A.reset();
      };
    },
    31209: function (e, t, n) {
      "use strict";
      n.d(t, {
        LI: function () {
          return d;
        },
        UC: function () {
          return u;
        },
        xW: function () {
          return p;
        },
      });
      var r = n(59499),
        i = n(50029),
        o = n(87794),
        a = n.n(o),
        s = n(48809);
      function c(e, t) {
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
      function l(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? c(Object(n), !0).forEach(function (t) {
                (0, r.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : c(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var u = [8, 132, 44, 14, 10, 540, 110, 142, 26, 62],
        d = (function () {
          var e = (0, i.Z)(
            a().mark(function e(t, n) {
              var r,
                i,
                o,
                c,
                l,
                u,
                d,
                p = arguments;
              return a().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (r = p.length > 2 && void 0 !== p[2] ? p[2] : 10),
                        p.length > 3 && void 0 !== p[3] && p[3],
                        (i = "course-subcategories/".concat(t, "/labels/")),
                        (o = { page_size: r, locale: n, navigation_locale: n }),
                        (e.next = 6),
                        s.uh.get(i, { params: o })
                      );
                    case 6:
                      for (
                        c = e.sent,
                          l = c.data,
                          u = {
                            id: t,
                            stats: l.results.map(function (e) {
                              return {
                                id: e.id,
                                title: e.display_name,
                                url: e.url,
                                absolute_url: e.url,
                                type: "topic",
                              };
                            }),
                          },
                          d = 0;
                        d < u.stats.length;
                        d++
                      )
                        u.stats[d].parentId = u.id;
                      return e.abrupt("return", u);
                    case 11:
                    case "end":
                      return e.stop();
                  }
              }, e);
            })
          );
          return function (t, n) {
            return e.apply(this, arguments);
          };
        })(),
        p = (function () {
          var e = (0, i.Z)(
            a().mark(function e(t) {
              var n,
                i,
                o,
                s = arguments;
              return a().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (n = s.length > 1 && void 0 !== s[1] && s[1]),
                        (e.next = 3),
                        Promise.allSettled(
                          u.map(function (e) {
                            return d(e, t, 10, n);
                          })
                        )
                      );
                    case 3:
                      return (
                        (i = e.sent),
                        (o = i
                          .filter(function (e) {
                            return "fulfilled" === e.status;
                          })
                          .reduce(function (e, t) {
                            var n = t.value;
                            return l(l({}, e), {}, (0, r.Z)({}, n.id, n.stats));
                          }, {})),
                        e.abrupt("return", o)
                      );
                    case 6:
                    case "end":
                      return e.stop();
                  }
              }, e);
            })
          );
          return function (t) {
            return e.apply(this, arguments);
          };
        })();
    },
    55830: function (e, t, n) {
      "use strict";
      function r(e, t) {
        return t ? "/organization/home".concat(e) : e;
      }
      n.d(t, {
        W: function () {
          return r;
        },
      });
    },
    48525: function (e, t, n) {
      "use strict";
      n.d(t, {
        N: function () {
          return T;
        },
      });
      var r = n(4730),
        i = n(59499),
        o = n(92777),
        a = n(82262),
        s = n(43269),
        c = n(53229);
      function l(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var r in n) e[r] = n[r];
        }
        return e;
      }
      var u,
        d,
        p,
        m,
        f,
        g,
        h,
        v,
        b,
        y,
        _,
        E,
        w,
        O = (function e(t, n) {
          function r(e, r, i) {
            if ("undefined" !== typeof document) {
              "number" === typeof (i = l({}, n, i)).expires &&
                (i.expires = new Date(Date.now() + 864e5 * i.expires)),
                i.expires && (i.expires = i.expires.toUTCString()),
                (e = encodeURIComponent(e)
                  .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
                  .replace(/[()]/g, escape));
              var o = "";
              for (var a in i)
                i[a] &&
                  ((o += "; " + a),
                  !0 !== i[a] && (o += "=" + i[a].split(";")[0]));
              return (document.cookie = e + "=" + t.write(r, e) + o);
            }
          }
          return Object.create(
            {
              set: r,
              get: function (e) {
                if (
                  "undefined" !== typeof document &&
                  (!arguments.length || e)
                ) {
                  for (
                    var n = document.cookie ? document.cookie.split("; ") : [],
                      r = {},
                      i = 0;
                    i < n.length;
                    i++
                  ) {
                    var o = n[i].split("="),
                      a = o.slice(1).join("=");
                    try {
                      var s = decodeURIComponent(o[0]);
                      if (((r[s] = t.read(a, s)), e === s)) break;
                    } catch (c) {}
                  }
                  return e ? r[e] : r;
                }
              },
              remove: function (e, t) {
                r(e, "", l({}, t, { expires: -1 }));
              },
              withAttributes: function (t) {
                return e(this.converter, l({}, this.attributes, t));
              },
              withConverter: function (t) {
                return e(l({}, this.converter, t), this.attributes);
              },
            },
            {
              attributes: { value: Object.freeze(n) },
              converter: { value: Object.freeze(t) },
            }
          );
        })(
          {
            read: function (e) {
              return (
                '"' === e[0] && (e = e.slice(1, -1)),
                e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
              );
            },
            write: function (e) {
              return encodeURIComponent(e).replace(
                /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
                decodeURIComponent
              );
            },
          },
          { path: "/" }
        ),
        S = O,
        k = n(22188),
        C = n(39865),
        x = n(36186),
        N = ["num_of_unread_activity_notifications"];
      function P(e, t) {
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
      function I(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? P(Object(n), !0).forEach(function (t) {
                (0, i.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : P(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var T =
        ((u = k.LO.ref),
        (d = k.LO.ref),
        (p = k.LO.ref),
        (m = k.LO.ref),
        (f = k.LO.ref),
        (g = k.LO.ref),
        (h = (function () {
          function e(t) {
            var n;
            (0, o.Z)(this, e),
              (this.isInstructorSignupEnabled = void 0),
              (this.mobileAppLink = void 0),
              (this.shoppingClient = void 0),
              (this.tryUFBPlacements = void 0),
              (this.ufbContext = void 0),
              (0, s.Z)(this, "userSpecificContext", v, this),
              (0, s.Z)(this, "formActionParams", b, this),
              (0, s.Z)(this, "isPersonalPlanSubscriber", y, this),
              (0, s.Z)(this, "showCartDropdown", _, this),
              (0, s.Z)(this, "enableCartOnMobileNav", E, this),
              (0, s.Z)(this, "showInstructorDropdown", w, this),
              (this.isFeaturedQuestionsEnabled = void 0),
              (this.isPayoutSettingsEnabled = void 0),
              (this.isRevenueReportEnabled = void 0),
              (this.isDisplayPracticeInsightsNewPageWithFunnelViewEnabled = !1),
              (this.isInstructorSignupEnabled = t.isInstructorSignupEnabled),
              (this.mobileAppLink = t.mobileAppLink),
              (this.shoppingClient =
                null !== (n = t.shoppingClient) && void 0 !== n ? n : C.W8),
              (this.tryUFBPlacements = t.tryUFBPlacements),
              (this.ufbContext = t.ufbContext);
          }
          return (
            (0, a.Z)(e, [
              {
                key: "notificationBadgeContext",
                get: function () {
                  var e,
                    t,
                    n = this.userSpecificContext.user,
                    r = {
                      unreadActivityNotifications: n
                        ? n.num_of_unread_activity_notifications
                        : 0,
                      unreadMessages: n ? n.num_unread_threads : 0,
                      unseenCredits: parseInt(
                        null !== (e = S.get("ud_credit_unseen")) && void 0 !== e
                          ? e
                          : "0",
                        10
                      ),
                      cartBuyables: 0,
                      unreadAlerts: 0,
                    };
                  return (
                    this.shoppingClient
                      ? (r.cartBuyables =
                          this.shoppingClient.lists.cart.items.length)
                      : (r.cartBuyables = n ? n.num_of_buyables_in_cart : 0),
                    Object.assign(
                      r,
                      (null === (t = this.ufbContext) || void 0 === t
                        ? void 0
                        : t.badgeContext) || {}
                    ),
                    Object.values(r).forEach(function (e) {
                      r.unreadAlerts += e;
                    }),
                    r
                  );
                },
              },
              {
                key: "signupParams",
                get: function () {
                  return this.isInstructorSignupEnabled
                    ? {
                        showInstructorSignup: !0,
                        popupTrackingIdentifier: "bai_header",
                        nextPath: this.urls.INSTRUCTOR_ONBOARDING,
                      }
                    : {};
                },
              },
              {
                key: "urls",
                get: function () {
                  var e,
                    t,
                    n = this.userSpecificContext.isInstructor,
                    r =
                      null === (e = this.ufbContext) ||
                      void 0 === e ||
                      null === (t = e.urls) ||
                      void 0 === t
                        ? void 0
                        : t.call(e, n);
                  return I(
                    {
                      BROWSE: "/",
                      SEARCH: "/courses/search/",
                      SEARCH_SUGGESTIONS: "/search-suggestions/",
                      TEACH: n ? "/instructor/" : "/teaching/?ref=teach_header",
                      MY_LEARNING: "/home/my-courses/",
                      MY_PROGRAMS: "/home/my-courses/programs/",
                      MY_COURSES: "/home/my-courses/learning/",
                      PREMIUM_COURSES: "/home/my-courses/premium/",
                      WISHLIST: "/home/my-courses/wishlist/",
                      CART: "/cart/",
                      VIEW_NOTIFICATIONS: n
                        ? "/instructor/user/view-notifications/"
                        : "/user/view-notifications/",
                      EDIT_NOTIFICATIONS: n
                        ? "/instructor/account/notifications/"
                        : "/user/edit-notifications/",
                      MESSAGES: "/message/",
                      INVITE: "/invite/",
                      PAYMENT_METHODS: "/user/edit-payment-methods/",
                      CREDITS: "/dashboard/credit-history/",
                      PURCHASE_HISTORY: "/dashboard/purchase-history/",
                      SUBSCRIPTION_MANAGEMENT: "/user/manage-subscriptions/",
                      SUPPORT: "/support/",
                      ACCOUNT: n
                        ? "/instructor/account/security/"
                        : "/user/edit-account/",
                      EDIT_PROFILE: n
                        ? "/instructor/profile/basic-information/"
                        : "/user/edit-profile/",
                      INSTRUCTOR_ONBOARDING:
                        "/home/teaching/onboarding/teaching-experience/",
                    },
                    null !== r && void 0 !== r ? r : {}
                  );
                },
              },
              {
                key: "instructorURLs",
                get: function () {
                  return I(
                    I({}, this.urls),
                    {},
                    {
                      COMMUNITY: x.qJ.toInstructorCommunity(),
                      TEST_VIDEO: "/home/teaching/test-video/",
                      API_CLIENTS: "/instructor/account/api/",
                      CLOSE_ACCOUNT: "/instructor/account/close/",
                      EDIT_NOTIFICATIONS: "/instructor/account/notifications/",
                      ACCOUNT: "/instructor/account/security/",
                      ANNOUNCEMENTS: "/instructor/communication/announcements/",
                      ASSIGNMENTS: "/instructor/communication/assignments/",
                      FEATURED_QUESTIONS:
                        "/instructor/communication/featured_questions/",
                      MESSAGES: "/instructor/communication/messages/",
                      Q_AND_A: "/instructor/communication/qa/",
                      COURSES: "/instructor/courses/",
                      MARKETPLACE_INSIGHTS: "/instructor/marketplace-insights/",
                      EDIT_PROFILE: "/instructor/profile/basic-information/",
                      EDIT_PHOTO: "/instructor/profile/photo/",
                      EDIT_PRIVACY: "/instructor/profile/privacy/",
                      PAYOUT_SETTINGS: "/instructor/user/edit-instructor-info/",
                      VIEW_NOTIFICATIONS:
                        "/instructor/user/view-notifications/",
                      REVENUE_REPORT: "/revenue-report/",
                      SUPPORT: "/support/?type=instructor",
                      TEACH_HUB: "/udemy-teach-hub/?ref=teach_header",
                    }
                  );
                },
              },
              {
                key: "setUserSpecificContext",
                value: function (e) {
                  if (e.user) {
                    var t = e.user,
                      n = t.num_of_unread_activity_notifications,
                      i = (0, r.Z)(t, N);
                    (0, k.dw)(i, { num_of_unread_activity_notifications: n }),
                      (e.user = i),
                      e.user.consumer_subscription_active &&
                        ((this.isPersonalPlanSubscriber = !0),
                        (this.formActionParams = I(
                          I({}, this.formActionParams),
                          {},
                          { subs_filter_type: "subs_only" }
                        )),
                        (this.showCartDropdown = !1),
                        (this.enableCartOnMobileNav = !0),
                        (this.showInstructorDropdown = !!e.isInstructor));
                  }
                  this.userSpecificContext = e;
                },
              },
              {
                key: "getInstructorPerformancePaths",
                value: function () {
                  throw new Error("Not implemented");
                },
              },
            ]),
            e
          );
        })()),
        (v = (0, c.Z)(h.prototype, "userSpecificContext", [u], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            return {};
          },
        })),
        (b = (0, c.Z)(h.prototype, "formActionParams", [d], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            return { src: "ukw" };
          },
        })),
        (y = (0, c.Z)(h.prototype, "isPersonalPlanSubscriber", [p], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            return !1;
          },
        })),
        (_ = (0, c.Z)(h.prototype, "showCartDropdown", [m], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            return !0;
          },
        })),
        (E = (0, c.Z)(h.prototype, "enableCartOnMobileNav", [f], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            return !1;
          },
        })),
        (w = (0, c.Z)(h.prototype, "showInstructorDropdown", [g], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            return !0;
          },
        })),
        (0, c.Z)(
          h.prototype,
          "notificationBadgeContext",
          [k.Fl],
          Object.getOwnPropertyDescriptor(
            h.prototype,
            "notificationBadgeContext"
          ),
          h.prototype
        ),
        (0, c.Z)(
          h.prototype,
          "urls",
          [k.Fl],
          Object.getOwnPropertyDescriptor(h.prototype, "urls"),
          h.prototype
        ),
        (0, c.Z)(
          h.prototype,
          "instructorURLs",
          [k.Fl],
          Object.getOwnPropertyDescriptor(h.prototype, "instructorURLs"),
          h.prototype
        ),
        (0, c.Z)(
          h.prototype,
          "setUserSpecificContext",
          [k.aD],
          Object.getOwnPropertyDescriptor(
            h.prototype,
            "setUserSpecificContext"
          ),
          h.prototype
        ),
        h);
    },
    97198: function (e, t, n) {
      "use strict";
      n.d(t, {
        k: function () {
          return o;
        },
      });
      var r = n(67294),
        i = n(55306);
      function o() {
        var e = r.useContext(i.p);
        if (null === e || void 0 === e || !e.headerStore)
          throw new Error("headerStore is not set in HeaderContext");
        return e.headerStore;
      }
    },
    50385: function (e, t, n) {
      "use strict";
      n.d(t, {
        D: function () {
          return o;
        },
      });
      var r = n(67294),
        i = n(55306);
      function o() {
        var e = r.useContext(i.p);
        if (null === e || void 0 === e || !e.mobileNavStore)
          throw new Error("mobileNavStore is not set in HeaderContext");
        return e.mobileNavStore;
      }
    },
    6276: function (e, t, n) {
      "use strict";
      n.d(t, {
        o: function () {
          return o;
        },
      });
      var r = n(67294),
        i = n(55306);
      function o() {
        var e = r.useContext(i.p);
        if (!e) throw new Error("HeaderContext is not set");
        return e.ufbContext;
      }
    },
    95362: function (e, t, n) {
      "use strict";
      n.d(t, {
        h4: function () {
          return zo;
        },
      });
      var r,
        i,
        o = n(67294),
        a = n(82316),
        s = n(79594),
        c = n(36186),
        l = n(59499),
        u = n(17674),
        d = n(4730),
        p = n(454),
        m = n(92909),
        f = n.n(m),
        g = n(80955),
        h = n(92777),
        v = n(82262),
        b = n(43269),
        y = n(53229),
        _ = n(22188),
        E = n(54992),
        w =
          ((r = (function () {
            function e(t, n) {
              (0, h.Z)(this, e),
                (this.isValid = void 0),
                (this.activities = []),
                (0, b.Z)(this, "isRead", i, this),
                (this.clickTrackingAction = void 0),
                (this.targetURL = void 0),
                (this.template = void 0);
              var r = (function (e, t) {
                var n = t.gettext,
                  r = t.ngettext,
                  i = t.interpolate,
                  o = t.ninterpolate;
                switch (e.template_id) {
                  case "announcement-comment-activity":
                    return {
                      clickTrackingAction: "activity-comment",
                      template: O(
                        n(
                          '%(user)s commented on announcement: <span class="subject">%(subject)s</span>'
                        ),
                        {
                          subject: e.reason_object.root.text,
                          user: S(e.activities, o),
                        },
                        i
                      ),
                    };
                  case "announcement-made-activity":
                    return {
                      clickTrackingAction: "announcement-made",
                      template: O(
                        n(
                          '%(user)s made an announcement: <span class="subject">%(subject)s</span>'
                        ),
                        {
                          subject: e.reason_object.root.text,
                          user: S(e.activities, o),
                        },
                        i
                      ),
                    };
                  case "captions-autocaptions-generated-activity":
                    return {
                      clickTrackingAction: "captions-autocaptions-generated",
                      template: O(
                        n(
                          'Automatic captions have been created for your course, <span class="subject">%(subject)s</span>'
                        ),
                        { subject: e.reason_object.root.target.title },
                        i
                      ),
                    };
                  case "captions-translations-generated-activity":
                    return {
                      clickTrackingAction: "captions-translations-generated",
                      template: O(
                        n(
                          'Your course <span class="subject">%(subject)s</span> has been translated into %(language)s.'
                        ),
                        {
                          subject: e.reason_object.root.target.title,
                          language:
                            e.reason_object.root.action_object.locale
                              .english_title,
                        },
                        i
                      ),
                    };
                  case "captions-poor-quality-activity":
                    return {
                      clickTrackingAction: "captions-poor-quality",
                      template: O(
                        n(
                          "Captions have been automatically generated for your course, %(course)s, but have been disabled as they may not meet our quality threshold."
                        ),
                        { course: e.reason_object.root.target.title },
                        i
                      ),
                    };
                  case "discussion-post-activity":
                    return {
                      clickTrackingAction: "discussion-post",
                      template: O(
                        r(
                          '%(count)s new question: <span class="subject">%(subject)s</span>',
                          '%(count)s new questions: <span class="subject">%(subject)s</span>',
                          e.activities.length
                        ),
                        {
                          count: e.activities.length,
                          subject: e.reason_object.root.target.title,
                        },
                        i
                      ),
                    };
                  case "discussion-reply-given-activity":
                    return {
                      clickTrackingAction: "discussion-reply",
                      template: O(
                        n(
                          '%(user)s replied to the question: <span class="subject">%(subject)s</span>'
                        ),
                        {
                          subject: e.reason_object.root.target.title,
                          user: S(e.activities, o),
                        },
                        i
                      ),
                    };
                  case "instructor-feedback-comment-activity":
                  case "peer-practice-comment-activity":
                    return {
                      clickTrackingAction: "practice-comment",
                      template: O(
                        n(
                          '%(user)s replied to your feedback in course: <span class="subject">%(subject)s</span>'
                        ),
                        {
                          subject: e.reason_object.root.target.title,
                          user: S(e.activities, o),
                        },
                        i
                      ),
                    };
                  case "own-practice-comment-activity":
                    return {
                      clickTrackingAction: "practice-comment",
                      template: O(
                        n(
                          '%(user)s commented on your assignment in course: <span class="subject">%(subject)s</span>'
                        ),
                        {
                          subject: e.reason_object.root.target.title,
                          user: S(e.activities, o),
                        },
                        i
                      ),
                    };
                  case "practice-feedback-activity":
                    return {
                      clickTrackingAction: "practice-feedback",
                      template: O(
                        n(
                          '%(user)s submitted feedback on your assignment in course: <span class="subject">%(subject)s</span>'
                        ),
                        {
                          subject: e.reason_object.root.target.title,
                          user: S(e.activities, o),
                        },
                        i
                      ),
                    };
                  case "practice-submission-activity":
                    return {
                      clickTrackingAction: "practice-submission",
                      template: O(
                        n(
                          '%(user)s submitted a response to an assignment in course: <span class="subject">%(subject)s</span>'
                        ),
                        {
                          subject: e.reason_object.root.target.title,
                          user: S(e.activities, o),
                        },
                        i
                      ),
                    };
                  case "review-response-given-activity":
                    return {
                      clickTrackingAction: "review-response",
                      template: O(
                        n(
                          '%(user)s responded to your review: <span class="subject">%(subject)s</span>'
                        ),
                        {
                          subject: e.reason_object.root.target.content,
                          user: S(e.activities, o),
                        },
                        i
                      ),
                    };
                  case "user-test-video-asset-failed-activity":
                    return {
                      clickTrackingAction: "user-test-video-failed",
                      template: n(
                        "Oops! Your test video didn\u2019t come through. Let\u2019s fix that."
                      ),
                    };
                  case "user-test-video-comment-activity":
                    return {
                      clickTrackingAction: "user-test-video-commented",
                      template: n(
                        "We have a new comment about your test video."
                      ),
                    };
                  case "user-test-video-negative-review-given-activity":
                    return {
                      clickTrackingAction:
                        "user-test-video-negative-review-given",
                      template: n(
                        "Good job on the test video! Here\u2019s what worked and what can change."
                      ),
                    };
                  case "user-test-video-review-given-activity":
                    return {
                      clickTrackingAction: "user-test-video-review-given",
                      template: n(
                        "Your test video skills are sharp! Come get your praise."
                      ),
                    };
                  case "instructor-course-lecture-deleted-activity":
                    return {
                      clickTrackingAction:
                        "instructor-course-lecture-deleted-given",
                      template: r(
                        "The lecture that you requested to be deleted is now deleted.",
                        "The lectures that you requested to be deleted are now deleted.",
                        e.activities.length
                      ),
                    };
                  case "instructor-course-quiz-deleted-activity":
                    return {
                      clickTrackingAction:
                        "instructor-course-quiz-deleted-given",
                      template: r(
                        "The quiz that you requested to be deleted is now deleted.",
                        "The quizzes that you requested to be deleted are now deleted.",
                        e.activities.length
                      ),
                    };
                  case "instructor-course-assignment-deleted-activity":
                    return {
                      clickTrackingAction:
                        "instructor-course-assignment-deleted-given",
                      template: r(
                        "The assignment that you requested to be deleted is now deleted.",
                        "The assignments that you requested to be deleted are now deleted.",
                        e.activities.length
                      ),
                    };
                  case "instructor-course-assessment-deleted-activity":
                    return {
                      clickTrackingAction:
                        "instructor-course-assessment-deleted-given",
                      template: r(
                        "The assessment that you requested to be deleted is now deleted.",
                        "The assessments that you requested to be deleted are now deleted.",
                        e.activities.length
                      ),
                    };
                  default:
                    return null;
                }
              })(t, n);
              (this.isValid = !!(
                r &&
                t.activities &&
                t.activities.length > 0 &&
                t.target_url
              )),
                Object.assign(this, r || {}, {
                  activities: t.activities || [],
                  targetURL: t.target_url || "",
                }),
                this.setIsRead("True" === t.reason_object.root.is_read);
            }
            return (
              (0, v.Z)(e, [
                {
                  key: "mainActivity",
                  get: function () {
                    return this.activities[0];
                  },
                },
                {
                  key: "setIsRead",
                  value: function (e) {
                    this.isRead = e;
                  },
                },
              ]),
              e
            );
          })()),
          (i = (0, y.Z)(r.prototype, "isRead", [_.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (0, y.Z)(
            r.prototype,
            "setIsRead",
            [_.aD],
            Object.getOwnPropertyDescriptor(r.prototype, "setIsRead"),
            r.prototype
          ),
          r);
      function O(e) {
        var t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = arguments.length > 2 ? arguments[2] : void 0,
          r = {};
        return (
          Object.entries(t).forEach(function (e) {
            var t = (0, u.Z)(e, 2),
              n = t[0],
              i = t[1];
            Object.assign(r, (0, l.Z)({}, n, (0, E.X)(i)));
          }),
          n(e, r, !0)
        );
      }
      function S(e, t) {
        return 1 === e.length
          ? e[0].actor.title
          : e.length > 1
          ? t(
              "%(name)s and %(count)s other",
              "%(name)s and %(count)s others",
              e.length - 1,
              { name: e[0].actor.title, count: e.length - 1 }
            )
          : "";
      }
      var k = n(5317),
        C = n(45566),
        x = n(57514),
        N = 2592e3,
        P = {
          seconds: function (e) {
            return (0, e.gettext)("A few seconds ago");
          },
          minutes: function (e, t) {
            return (0, t.ninterpolate)("%s minute ago", "%s minutes ago", e);
          },
          hours: function (e, t) {
            return (0, t.ninterpolate)("%s hour ago", "%s hours ago", e);
          },
          days: function (e, t) {
            return (0, t.ninterpolate)("%s day ago", "%s days ago", e);
          },
          months: function (e, t) {
            return (0, t.ninterpolate)("%s month ago", "%s months ago", e);
          },
          years: function (e, t) {
            return (0, t.ninterpolate)("%s year ago", "%s years ago", e);
          },
        },
        I = {
          seconds: function (e) {
            return (0, e.gettext)("In a few seconds");
          },
          minutes: function (e, t) {
            return (0, t.ninterpolate)("In %s minute", "In %s minutes", e);
          },
          hours: function (e, t) {
            return (0, t.ninterpolate)("In %s hour", "In %s hours", e);
          },
          days: function (e, t) {
            return (0, t.ninterpolate)("In %s day", "In %s days", e);
          },
          months: function (e, t) {
            return (0, t.ninterpolate)("In %s month", "In %s months", e);
          },
          years: function (e, t) {
            return (0, t.ninterpolate)("In %s year", "In %s years", e);
          },
        },
        T = function (e) {
          var t = e.datetime,
            n = e.source,
            r = void 0 === n ? "server" : n,
            i = (0, s.QT)(),
            a = i.gettext,
            l = i.ninterpolate,
            u = (0, c.gL)().request,
            d = {
              clientTimestamp: u.clientTimestamp,
              serverTimestamp: u.serverTimestamp,
            };
          return o.createElement(
            o.Fragment,
            null,
            (function (e, t, n) {
              var r = e.datetime,
                i = e.source,
                o = n.clientTimestamp
                  ? Date.parse(n.clientTimestamp) -
                    Date.parse(n.serverTimestamp)
                  : 0,
                a = Date.now() - o,
                s = "string" === typeof r ? Date.parse(r) : r.getTime();
              "client" === i && (s -= o);
              var c = s - a,
                l = Math.floor(c / 1e3);
              if (l <= 0) return Z(-l, P, t);
              return Z(l, I, t);
            })({ datetime: t, source: r }, { gettext: a, ninterpolate: l }, d)
          );
        };
      function Z(e, t, n) {
        if (e < 60) return t.seconds(n);
        if (e < 3600) return t.minutes(Math.floor(e / 60), n);
        if (e < 86400) return t.hours(Math.floor(e / 3600), n);
        if (e < N) return t.days(Math.floor(e / 86400), n);
        var r = Math.floor(e / N);
        return r < 12 ? t.months(r, n) : t.years(Math.floor(r / 12), n);
      }
      var R,
        A,
        L,
        j,
        D,
        M,
        z,
        U = n(18614),
        F = n(80785),
        B = n(97941),
        W = n(97351),
        H = n(22935),
        Q = n.n(H),
        V = (0, g.Pi)(function (e) {
          var t = (0, s.QT)().gettext,
            n = e.notification,
            r = e.className || "",
            i = function () {
              var t = e.store,
                n = e.notification,
                r = e.tabName;
              n.isRead || t.markNotificationAsRead(n, r);
            };
          return o.createElement(
            "div",
            {
              "data-purpose": "notification",
              className: Q()["card-container"],
            },
            o.createElement(
              B.qg,
              { className: "".concat(Q().card, " ").concat(r) },
              o.createElement(
                B.qg.ImageWrapper,
                null,
                o.createElement(x.q, {
                  user: n.mainActivity.actor,
                  srcKey: "image_100x100",
                  alt: "NONE",
                })
              ),
              o.createElement(
                "div",
                { className: Q()["notification-info"] },
                o.createElement(
                  B.qg.Title,
                  {
                    className: "ud-heading-md ".concat(
                      Q()["notification-title"]
                    ),
                    "data-purpose": "notification-message",
                    href: n.targetURL,
                    onClick: function () {
                      var t = e.store,
                        n = e.notification,
                        r = e.tabName;
                      (0, k.L9)("notification", "click", n.clickTrackingAction),
                        n.isRead || t.markNotificationAsRead(n, r);
                    },
                  },
                  o.createElement(
                    "span",
                    (0, W.S)({
                      descriptionOfCaller:
                        "activity-notification:notification-template",
                      html: n.template,
                    })
                  )
                ),
                o.createElement(
                  "div",
                  {
                    className: "ud-text-sm ".concat(
                      Q()["notification-timestamp"]
                    ),
                  },
                  o.createElement(T, { datetime: n.mainActivity.timestamp })
                )
              )
            ),
            e.notification.isRead
              ? null
              : o.createElement(
                  "div",
                  { className: Q()["status-dot-container"] },
                  o.createElement(
                    F.u,
                    {
                      a11yRole: "none",
                      detachFromTarget: !0,
                      placement: "bottom",
                      trigger: o.createElement(
                        C.zx,
                        {
                          udStyle: "link",
                          className: Q()["status-dot-button"],
                          "data-purpose": "mark-as-read-status-icon",
                          onClick: i,
                          "aria-label": t("Mark as read"),
                        },
                        o.createElement(U.C, null)
                      ),
                    },
                    t("Mark as read")
                  )
                )
          );
        }),
        q = n(61646),
        G = n(48809),
        X = { instructor: "instructor", student: "student" },
        Y = {
          instructor: function (e) {
            return e("Instructor");
          },
          Instructor: function (e) {
            return Y.instructor(e);
          },
          student: function (e) {
            return e("Student");
          },
          Student: function (e) {
            return Y.student(e);
          },
        };
      function K(e, t) {
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
      function J(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? K(Object(n), !0).forEach(function (t) {
                (0, l.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : K(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var $ = ["instructor", "student"],
        ee =
          ((R = (function () {
            function e(t) {
              (0, h.Z)(this, e),
                (0, b.Z)(this, "activeTabName", A, this),
                (0, b.Z)(this, "instructor", L, this),
                (0, b.Z)(this, "student", j, this),
                (0, b.Z)(this, "user", D, this),
                (0, b.Z)(this, "userType", M, this),
                (this.i18nApi = void 0),
                (0, b.Z)(this, "initializeNotifications", z, this),
                (this.i18nApi = t);
            }
            return (
              (0, v.Z)(e, [
                {
                  key: "setUserSpecificContext",
                  value: function (e) {
                    (this.user = e.user),
                      this.setNavUserType(e.userType),
                      (this.activeTabName = null),
                      (this.instructor = {
                        _invalidActivitiesCount: 0,
                        _invalidUnreadActivitiesCount: 0,
                        hasNextPage: !0,
                        loadingState: "NOT_LOADED",
                        notifications: [],
                        page: 0,
                        totalActivitiesCount: 0,
                        unreadActivitiesCount: 0,
                      }),
                      (this.student = {
                        _invalidActivitiesCount: 0,
                        _invalidUnreadActivitiesCount: 0,
                        hasNextPage: !0,
                        loadingState: "NOT_LOADED",
                        notifications: [],
                        page: 0,
                        totalActivitiesCount: 0,
                        unreadActivitiesCount: 0,
                      });
                  },
                },
                {
                  key: "setNavUserType",
                  value: function (e) {
                    this.userType = e;
                  },
                },
                {
                  key: "editNotificationsURL",
                  get: function () {
                    return "instructor" === this.userType
                      ? "/instructor/account/notifications/"
                      : "/user/edit-notifications/";
                  },
                },
                {
                  key: "viewNotificationsURL",
                  get: function () {
                    return "instructor" === this.userType
                      ? "/instructor/user/view-notifications/"
                      : "/user/view-notifications/";
                  },
                },
                {
                  key: "setActiveTab",
                  value: function (e) {
                    this.activeTabName = e;
                  },
                },
                {
                  key: "loadNextPageOfNotifications",
                  value: function (e) {
                    var t = this,
                      n = this[e];
                    "LOADING" !== n.loadingState &&
                      this._requestNotifications(e, n)
                        .then(function (e) {
                          t._requestNotificationsSuccess(n, e);
                        })
                        .catch(function (e) {
                          t._requestNotificationsError(n, e);
                        });
                  },
                },
                {
                  key: "_requestNotifications",
                  value: function (e, t, n) {
                    return (
                      (t.loadingState = "LOADING"),
                      G.uh.get("/users/me/notifications/", {
                        params: J(
                          {
                            page: t.page + 1,
                            page_size: 12,
                            relation_type: X[e],
                            "fields[actstream_action]":
                              "actor,target,action_object,timestamp,text,is_read",
                            "fields[course_discussion]": "@min,title",
                            "fields[user]": "@min,image_100x100,initials",
                          },
                          n
                        ),
                      })
                    );
                  },
                },
                {
                  key: "_requestNotificationsSuccess",
                  value: function (e, t) {
                    var n = this,
                      r = t.data.results || [],
                      i = t.data.count || 0,
                      o = t.data.unread_count || 0;
                    r
                      .map(function (e) {
                        return new w(e, n.i18nApi);
                      })
                      .forEach(function (t) {
                        t.isValid
                          ? e.notifications.push(t)
                          : ((e._invalidActivitiesCount += t.activities.length),
                            t.isRead ||
                              (e._invalidUnreadActivitiesCount +=
                                t.activities.length));
                      }),
                      (e.page += 1),
                      (e.hasNextPage = !!t.data.next),
                      (e.totalActivitiesCount = Math.max(
                        i - e._invalidActivitiesCount,
                        0
                      )),
                      (e.unreadActivitiesCount = Math.max(
                        o - e._invalidUnreadActivitiesCount,
                        0
                      )),
                      this._updateUnreadCountForAllTabs(),
                      (e.loadingState = "LOADED");
                  },
                },
                {
                  key: "_requestNotificationsError",
                  value: function (e, t) {
                    (e.loadingState = "LOADED"), (0, q.Tb)(t);
                  },
                },
                {
                  key: "markNotificationAsRead",
                  value: function (e, t) {
                    var n,
                      r,
                      i = this,
                      o = e.activities.map(function (e) {
                        return e.id;
                      }),
                      a = Math.min(
                        null === (n = this[t]) || void 0 === n
                          ? void 0
                          : n.unreadActivitiesCount,
                        o.length
                      );
                    if (
                      (e.setIsRead(!0),
                      this._updateUnreadCountForTab(t, -a),
                      o.length > 1)
                    )
                      r = G.uh.patch("/users/me/notifications/", {
                        ids: o,
                        is_read: "True",
                        relation_type: X[t],
                      });
                    else {
                      if (1 !== o.length)
                        throw new Error(
                          "Invalid notification with zero activities"
                        );
                      r = G.uh.patch(
                        "/users/me/notifications/".concat(o[0], "/"),
                        { is_read: "True", relation_type: X[t] }
                      );
                    }
                    r.catch(
                      (0, _.aD)(function (n) {
                        e.setIsRead(!1),
                          i._updateUnreadCountForTab(t, a),
                          (0, q.Tb)(n);
                      })
                    );
                  },
                },
                {
                  key: "markAllNotificationsAsRead",
                  value: function (e) {
                    var t = this,
                      n = this[e],
                      r = n.notifications.filter(function (e) {
                        return !e.isRead;
                      });
                    r.forEach(function (e) {
                      e.setIsRead(!0);
                    });
                    var i = Math.min(
                      n.unreadActivitiesCount,
                      r.reduce(function (e, t) {
                        return e + t.activities.length;
                      }, 0)
                    );
                    this._updateUnreadCountForTab(e, -i),
                      G.uh
                        .patch("/users/me/notifications/", {
                          ids: "all",
                          is_read: "True",
                          relation_type: X[e],
                        })
                        .catch(
                          (0, _.aD)(function (n) {
                            r.forEach(function (e) {
                              e.setIsRead(!1);
                            }),
                              t._updateUnreadCountForTab(e, i),
                              (0, q.Tb)(n);
                          })
                        );
                  },
                },
                {
                  key: "_updateUnreadCountForTab",
                  value: function (e, t) {
                    (this[e].unreadActivitiesCount += t),
                      this._updateUnreadCountForAllTabs();
                  },
                },
                {
                  key: "_updateUnreadCountForAllTabs",
                  value: function () {
                    var e = this;
                    this.user &&
                      (this.user.num_of_unread_activity_notifications = $.map(
                        function (t) {
                          return e[t];
                        }
                      )
                        .filter(function (e) {
                          return !!e;
                        })
                        .reduce(function (e, t) {
                          return (
                            e +
                            (null === t || void 0 === t
                              ? void 0
                              : t.unreadActivitiesCount)
                          );
                        }, 0));
                  },
                },
              ]),
              e
            );
          })()),
          (A = (0, y.Z)(R.prototype, "activeTabName", [_.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (L = (0, y.Z)(R.prototype, "instructor", [_.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (j = (0, y.Z)(R.prototype, "student", [_.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (D = (0, y.Z)(R.prototype, "user", [_.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (M = (0, y.Z)(R.prototype, "userType", [_.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (0, y.Z)(
            R.prototype,
            "setUserSpecificContext",
            [_.aD],
            Object.getOwnPropertyDescriptor(
              R.prototype,
              "setUserSpecificContext"
            ),
            R.prototype
          ),
          (0, y.Z)(
            R.prototype,
            "setNavUserType",
            [_.aD],
            Object.getOwnPropertyDescriptor(R.prototype, "setNavUserType"),
            R.prototype
          ),
          (0, y.Z)(
            R.prototype,
            "setActiveTab",
            [_.aD],
            Object.getOwnPropertyDescriptor(R.prototype, "setActiveTab"),
            R.prototype
          ),
          (z = (0, y.Z)(R.prototype, "initializeNotifications", [_.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                var t = [],
                  n = {},
                  r = {};
                $.forEach(function (i) {
                  var o = e[i];
                  if (o && "NOT_LOADED" === o.loadingState) {
                    var a = e
                      ._requestNotifications(i, o, { with_empty_state: "1" })
                      .then(function (e) {
                        return (n[i] = e), e;
                      })
                      .catch(function (e) {
                        r[i] = e;
                      });
                    t.push(a);
                  }
                }),
                  t.length > 0 &&
                    Promise.all(t)
                      .then(
                        (0, _.aD)(function () {
                          Object.entries(n).forEach(function (t) {
                            var n = (0, u.Z)(t, 2),
                              r = n[0],
                              i = n[1];
                            "NONE" === i.data.empty_state
                              ? (e[r] = null)
                              : e._requestNotificationsSuccess(e[r], i);
                          }),
                            Object.entries(r).forEach(function (t) {
                              var n = (0, u.Z)(t, 2),
                                r = n[0],
                                i = n[1];
                              e._requestNotificationsError(e[r], i);
                            }),
                            e.instructor
                              ? (e.activeTabName = "instructor")
                              : e.student && (e.activeTabName = "student");
                        })
                      )
                      .catch(function (e) {
                        (0, q.Tb)(e);
                      });
              };
            },
          })),
          (0, y.Z)(
            R.prototype,
            "loadNextPageOfNotifications",
            [_.aD],
            Object.getOwnPropertyDescriptor(
              R.prototype,
              "loadNextPageOfNotifications"
            ),
            R.prototype
          ),
          (0, y.Z)(
            R.prototype,
            "_requestNotificationsSuccess",
            [_.aD],
            Object.getOwnPropertyDescriptor(
              R.prototype,
              "_requestNotificationsSuccess"
            ),
            R.prototype
          ),
          (0, y.Z)(
            R.prototype,
            "_requestNotificationsError",
            [_.aD],
            Object.getOwnPropertyDescriptor(
              R.prototype,
              "_requestNotificationsError"
            ),
            R.prototype
          ),
          (0, y.Z)(
            R.prototype,
            "markNotificationAsRead",
            [_.aD],
            Object.getOwnPropertyDescriptor(
              R.prototype,
              "markNotificationAsRead"
            ),
            R.prototype
          ),
          (0, y.Z)(
            R.prototype,
            "markAllNotificationsAsRead",
            [_.aD],
            Object.getOwnPropertyDescriptor(
              R.prototype,
              "markAllNotificationsAsRead"
            ),
            R.prototype
          ),
          R),
        te = n(50029),
        ne = n(87794),
        re = n.n(ne),
        ie = n(97331),
        oe = n(23890),
        ae = n(28414),
        se = n.n(ae),
        ce = { store: null };
      (0, _.GW)(ce, { store: _.LO.ref });
      var le = (0, _.aD)(function (e) {
          ce.store = e;
        }),
        ue = (0, g.Pi)(function (e) {
          var t = e.store,
            n = e.tabName,
            r = (0, s.QT)().gettext,
            i = (0, o.useCallback)(
              function () {
                t.loadNextPageOfNotifications(n);
              },
              [t, n]
            ),
            a = (0, o.useCallback)(
              function () {
                t.markAllNotificationsAsRead(n);
              },
              [t, n]
            ),
            c = (0, o.useCallback)(
              function (e) {
                return "LOADED" !== e.loadingState ||
                  0 === e.unreadActivitiesCount
                  ? null
                  : o.createElement(
                      "div",
                      { className: se().footer },
                      o.createElement(
                        C.zx,
                        {
                          udStyle: "ghost",
                          onClick: a,
                          "data-purpose": "mark-all-as-read",
                        },
                        r("Mark all as read")
                      )
                    );
              },
              [r, a]
            ),
            l = t[n];
          return !n ||
            ("LOADED" ===
              (null === l || void 0 === l ? void 0 : l.loadingState) &&
              0 === l.totalActivitiesCount)
            ? o.createElement(
                "div",
                {
                  "data-testid": "notification-tab-pane-".concat(n),
                  "data-purpose": "notification-tab-pane",
                  className: "ud-text-lg ".concat(se()["no-notifications"]),
                },
                r("No notifications.")
              )
            : o.createElement(
                "div",
                {
                  "data-testid": "notification-tab-pane-".concat(n),
                  "data-purpose": "notification-tab-pane",
                },
                o.createElement(
                  "div",
                  { className: se()["notification-list"] },
                  null === l || void 0 === l
                    ? void 0
                    : l.notifications.map(function (e) {
                        return o.createElement(V, {
                          key: e.mainActivity.id,
                          store: t,
                          notification: e,
                          tabName: n,
                        });
                      })
                ),
                "LOADED" ===
                  (null === l || void 0 === l ? void 0 : l.loadingState) &&
                  l.hasNextPage &&
                  o.createElement(
                    "div",
                    { className: se()["load-more-row"] },
                    o.createElement(
                      C.zx,
                      { "data-purpose": "load-more", onClick: i },
                      r("Load more")
                    )
                  ),
                "LOADING" ===
                  (null === l || void 0 === l ? void 0 : l.loadingState) &&
                  o.createElement(
                    "div",
                    { className: se()["load-more-row"] },
                    o.createElement(ie.a, { size: "large" })
                  ),
                c(l)
              );
        }),
        de = (0, g.Pi)(function (e) {
          var t = e.store,
            n = (0, s.QT)(),
            r = n.gettext,
            i = n.locale;
          (0, o.useEffect)(
            function () {
              function e() {
                return (e = (0, te.Z)(
                  re().mark(function e() {
                    return re().wrap(function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (e.next = 2), t.initializeNotifications();
                          case 2:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                  })
                )).apply(this, arguments);
              }
              !(function () {
                e.apply(this, arguments);
              })();
            },
            [t]
          );
          var a,
            c = function (e) {
              var n = r("Instructor"),
                a = r("Student"),
                c = "instructor" === e ? n : a,
                l = t[e].unreadActivitiesCount;
              return (
                l > 0 && (c = "".concat(c, " (").concat((0, s.uf)(l, i), ")")),
                o.createElement(
                  oe.m.Tab,
                  { id: e, title: c },
                  o.createElement(ue, { store: t, tabName: e })
                )
              );
            },
            l = t.activeTabName,
            u = t.instructor,
            d = t.student;
          return l || (!u && !d)
            ? ((a =
                (u || d) && u && d
                  ? o.createElement(
                      oe.m,
                      {
                        activeTabId: l,
                        onSelect: function (e) {
                          var n;
                          (n = e), t.setActiveTab(n);
                        },
                      },
                      c("instructor"),
                      c("student")
                    )
                  : o.createElement(ue, { store: t, tabName: l })),
              o.createElement(
                "div",
                {
                  className: se().container,
                  "data-testid": "activity-notifications-container",
                },
                a
              ))
            : o.createElement(ie.u, null);
        }),
        pe =
          ((0, g.Pi)(function () {
            var e = ce.store;
            return e && e.user
              ? o.createElement(de, { store: e })
              : o.createElement(ie.u, null);
          }),
          n(71361)),
        me = n(21617),
        fe = n.n(me),
        ge = n(21702),
        he = n.n(ge),
        ve = n(44394),
        be = n.n(ve),
        ye = n(62562),
        _e = n.n(ye),
        Ee = function (e) {
          var t = e.isCompleted,
            n = void 0 !== t && t;
          return o.createElement(be(), {
            label: !1,
            className: he()(_e()["lab-icon"], (0, l.Z)({}, _e().completed, n)),
          });
        },
        we = n(78270),
        Oe = n(45959),
        Se = n(63553),
        ke = n(37247),
        Ce = n(24076);
      function xe(e) {
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
          var n,
            r = (0, ke.Z)(e);
          if (t) {
            var i = (0, ke.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, Se.Z)(this, n);
        };
      }
      var Ne = (function (e) {
        (0, Oe.Z)(n, e);
        var t = xe(n);
        function n(e) {
          var r;
          return (
            (0, h.Z)(this, n),
            ((r = t.call(this, "LabActionEvent")).action = void 0),
            (r.hasAutomatedLabReview = void 0),
            (r.inSessionTimeBetweenViewAndCtaClick = void 0),
            (r.labCompletionMode = void 0),
            (r.labId = void 0),
            (r.labInstanceUuid = void 0),
            (r.labTaskId = void 0),
            (r.labTaskResourceId = void 0),
            (r.labVertical = void 0),
            (r.uiRegion = void 0),
            (r.labId = e.labId),
            (r.labVertical = e.labVertical),
            (r.labInstanceUuid = e.labInstanceUuid),
            (r.labTaskId = e.labTaskId),
            (r.labTaskResourceId = e.labTaskResourceId),
            (r.labCompletionMode = e.labCompletionMode),
            (r.inSessionTimeBetweenViewAndCtaClick =
              e.inSessionTimeBetweenViewAndCtaClick),
            (r.action = e.action),
            (r.uiRegion = e.uiRegion),
            (r.hasAutomatedLabReview = e.hasAutomatedLabReview),
            r
          );
        }
        return (0, v.Z)(n);
      })(Ce.rp);
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
          var n,
            r = (0, ke.Z)(e);
          if (t) {
            var i = (0, ke.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, Se.Z)(this, n);
        };
      }
      var Ie = (function (e) {
        (0, Oe.Z)(n, e);
        var t = Pe(n);
        function n(e) {
          var r;
          (0, h.Z)(this, n);
          var i = e.labId,
            o = e.labInstanceUuid,
            a = e.labVertical,
            s = e.labCompletionMode;
          return (
            ((r = t.call(this, "LabsResumeBannerContinueClickEvent")).labId =
              void 0),
            (r.labInstanceUuid = void 0),
            (r.labVertical = void 0),
            (r.labCompletionMode = void 0),
            (r.labId = i),
            (r.labInstanceUuid = o),
            (r.labVertical = a),
            (r.labCompletionMode = s),
            r
          );
        }
        return (0, v.Z)(n);
      })(Ce.rp);
      function Te(e) {
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
          var n,
            r = (0, ke.Z)(e);
          if (t) {
            var i = (0, ke.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, Se.Z)(this, n);
        };
      }
      var Ze = (function (e) {
        (0, Oe.Z)(n, e);
        var t = Te(n);
        function n(e) {
          var r;
          (0, h.Z)(this, n);
          var i = e.labId,
            o = e.labInstanceUuid,
            a = e.labVertical,
            s = e.labCompletionMode;
          return (
            ((r = t.call(this, "LabsResumeBannerDismissClickEvent")).labId =
              void 0),
            (r.labInstanceUuid = void 0),
            (r.labVertical = void 0),
            (r.labCompletionMode = void 0),
            (r.labId = i),
            (r.labInstanceUuid = o),
            (r.labVertical = a),
            (r.labCompletionMode = s),
            r
          );
        }
        return (0, v.Z)(n);
      })(Ce.rp);
      function Re(e) {
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
          var n,
            r = (0, ke.Z)(e);
          if (t) {
            var i = (0, ke.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, Se.Z)(this, n);
        };
      }
      var Ae = (function (e) {
        (0, Oe.Z)(n, e);
        var t = Re(n);
        function n(e) {
          var r;
          (0, h.Z)(this, n);
          var i = e.labId,
            o = e.labInstanceUuid,
            a = e.labVertical,
            s = e.labCompletionMode;
          return (
            ((r = t.call(this, "LabsResumeBannerEndLabClickEvent")).labId =
              void 0),
            (r.labInstanceUuid = void 0),
            (r.labVertical = void 0),
            (r.labCompletionMode = void 0),
            (r.labId = i),
            (r.labInstanceUuid = o),
            (r.labVertical = a),
            (r.labCompletionMode = s),
            r
          );
        }
        return (0, v.Z)(n);
      })(Ce.rp);
      function Le(e) {
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
          var n,
            r = (0, ke.Z)(e);
          if (t) {
            var i = (0, ke.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, Se.Z)(this, n);
        };
      }
      var je,
        De,
        Me,
        ze,
        Ue,
        Fe = (function (e) {
          (0, Oe.Z)(n, e);
          var t = Le(n);
          function n(e) {
            var r;
            (0, h.Z)(this, n);
            var i = e.labId,
              o = e.labInstanceUuid,
              a = e.labVertical,
              s = e.labCompletionMode;
            return (
              ((r = t.call(this, "LabsResumeBannerViewEvent")).labId = void 0),
              (r.labInstanceUuid = void 0),
              (r.labVertical = void 0),
              (r.labCompletionMode = void 0),
              (r.labId = i),
              (r.labInstanceUuid = o),
              (r.labVertical = a),
              (r.labCompletionMode = s),
              r
            );
          }
          return (0, v.Z)(n);
        })(Ce.rp),
        Be = function (e) {
          var t,
            n = {
              labId: e.lab.id,
              labInstanceUuid: e.uuid,
              labVertical: e.lab.vertical,
              labCompletionMode:
                null === (t = e.lab.enrollment) || void 0 === t
                  ? void 0
                  : t.last_attempted_mode,
            };
          we.j.publishEvent(new Fe(n));
        },
        We = function (e) {
          var t,
            n = {
              labId: e.lab.id,
              labInstanceUuid: e.uuid,
              labVertical: e.lab.vertical,
              labCompletionMode:
                null === (t = e.lab.enrollment) || void 0 === t
                  ? void 0
                  : t.last_attempted_mode,
            };
          we.j.publishEvent(new Ie(n));
        },
        He = function (e) {
          var t,
            n = {
              labId: e.lab.id,
              labInstanceUuid: e.uuid,
              labVertical: e.lab.vertical,
              labCompletionMode:
                null === (t = e.lab.enrollment) || void 0 === t
                  ? void 0
                  : t.last_attempted_mode,
            };
          we.j.publishEvent(new Ze(n));
        },
        Qe = function (e) {
          var t,
            n = {
              labId: e.lab.id,
              labInstanceUuid: e.uuid,
              labVertical: e.lab.vertical,
              labCompletionMode:
                null === (t = e.lab.enrollment) || void 0 === t
                  ? void 0
                  : t.last_attempted_mode,
            };
          we.j.publishEvent(new Ae(n));
        },
        Ve = function (e, t, n, r, i, o, a) {
          var s =
              arguments.length > 7 && void 0 !== arguments[7] && arguments[7],
            c = {
              action: t,
              hasAutomatedLabReview: s,
              inSessionTimeBetweenViewAndCtaClick: i || null,
              labCompletionMode:
                a ||
                (null === e || void 0 === e
                  ? void 0
                  : e.lab.enrollment.last_attempted_mode),
              labId: null === e || void 0 === e ? void 0 : e.id.toString(),
              labInstanceUuid:
                (null === e || void 0 === e ? void 0 : e.uuid) || null,
              labTaskId:
                (null === n || void 0 === n ? void 0 : n.toString()) || null,
              labTaskResourceId:
                (null === r || void 0 === r ? void 0 : r.toString()) || null,
              labVertical: null === e || void 0 === e ? void 0 : e.lab.vertical,
              uiRegion: o || null,
            },
            l = new Ne(c);
          we.j.publishEvent(l);
        },
        qe = n(88572),
        Ge = n(28538),
        Xe = {
          ids: Object.freeze({
            autocaptionHeadsup: "autocaption_headsup",
            adaptiveAssessmentCourseGuideModal:
              "adaptive_assessment_course_guide_modal",
            assessmentCourseGuideModal: "assessment_course_guide_modal",
            organizationEligibleFeatureAlert:
              "organization_eligible_feature_alert",
            instructorCourseStatus: "instructor_course_status_alert",
            captionEditorSurvey: "caption_editor_survey",
            captionEditorSurveyPopup: "caption_editor_survey_popup",
            captionManagePage: "caption_manage_page",
            captionSearchTooltip: "caption_search_tooltip",
            clpConversionHint: "clp_conversion_hint",
            codingExerciseHint: "coding_exercise_hint",
            conversionMigrationHint: "conversion_migration_hint",
            mkinsightsDataChangeAlert: "mkinsights_data_change_alert",
            courseFreePaid: "course_free_paid",
            courseTranslationAutoCoverage: "course_translation_auto_coverage",
            courseTranslationDisabledLanguageCat:
              "course_translation_disabled_language_cat",
            courseTranslationLowConfidence: "course_translation_low_confidence",
            courseTranslationManualCoverage:
              "course_translation_manual_coverage",
            discoverabilityTranscriptTooltip:
              "discoverability_transcript_tooltip",
            engagementBehaviorHint: "engagement_behavior_hint",
            freeCourseLengthUpdate: "show_free_course_length_update",
            hasSeenAndDismissedAssessmentViewResultsCard:
              "has_seen_and_dismissed_assessment_view_results_card",
            hasSeenStudentFeaturedQuestionsPrompt:
              "has_seen_student_featured_questions_prompt",
            hasSeenInstructorFeaturedQuestionsPrompt:
              "has_seen_instructor_featured_questions_prompt",
            hasSeenLabsFeaturePrompt: "has_seen_labs_feature_prompt",
            hasSeenLabsAlmostOutOfResourcesNotification:
              "has_seen_labs_almost_out_of_resources_notification",
            hasSeenLabsSkipSetupNotification:
              "has_seen_labs_skip_setup_notification",
            hasSeenLabsInCoursePrompt: "has_seen_labs_in_course_prompt",
            hasSeenActiveLabBanner: "has_seen_active_lab_banner",
            hasSeenWorkspaceEnabledLecturesPrompt:
              "has_seen_workspace_enabled_lectures_prompt",
            hasSeenAndDismissedALRTooltip: "has_seen_and_dismissed_alr_tooltip",
            instructorApiEula: "instructor_api_eula",
            instructorOnboarding: "instructor_onboarding",
            linksWarningQA: "links_warning_qa",
            mtCaptionSurvey: "mt_caption_survey",
            autoCaptionSurvey: "auto_caption_survey",
            organizationEligibleReminder: "organization_eligible_reminder",
            qrpReactivate: "qrp_reactivate",
            reinforcementTooltipGettingThere:
              "reinforcement_tooltip_getting_there",
            reinforcementTooltipKeepGoing: "reinforcement_tooltip_keep_going",
            reinforcementTooltipNearlyThere:
              "reinforcement_tooltip_nearly_there",
            showAppLinkCourses: "show_app_link_courses",
            showAppLinkMessages: "show_app_link_messages",
            showAppLinkQA: "show_app_link_qa",
            showAppLinkRevenue: "show_app_link_revenue",
            showAppLinkReviews: "show_app_link_reviews",
            showAppLinkToast: "show_app_link_toast",
            showCourseGrpDelay: "show_course_grp_delay",
            showDirectMessageTurnedOff: "direct_message_turned_off",
            surveyPrompt: "survey_prompt",
            taxFaq2017: "tax_faq_2017",
            testing: "testing",
            testVideoSurvey: "test_video_survey",
            translationHowTo: "translation_how_to",
            translationTooLate: "translation_too_late",
            visitorChartUnique: "visitor_chart_unique",
            modalInlineFirstTime: "modal_inline_first_time",
            instructorCategoryMigrate: "instructor_category_migrate",
            autoTranslatedCaptions: "auto_translated_captions",
            onBoardingForProgramsPopover: "onboarding_for_programs_popover",
            seenTeamUpsellTooltip: "seen_upsell_tooltip",
            seenUserManagePage: "seen_user_manage_page",
            courseInsightsListDefinitionsFirstTime:
              "course_insights_list_definitions_first_time",
            courseInsightsDetailDefinitionsFirstTime:
              "course_insights_detail_definitions_first_time",
            courseUpdatesListDefinitionsFirstTime:
              "course_updates_list_definitions_first_time",
            complyFormUnderReview: "comply_form_under_review",
            complyFormApproved: "comply_form_approved",
            codingExerciseBetaCoursesCollapsed:
              "coding_exercise_beta_courses_collapsed",
            engagementUBDataCollectDate: "engagement_ub_data_collect_date",
            isInstructorTourPopoverClosed: "is_instructor_tour_popover_closed",
            engagementDataDiscrepancy: "engagement_data_discrepancy",
            ceCreationNewUIWelcomeModal: "ce_creation_new_ui_welcome_modal",
            ceLearnerNewUIWelcomeModal: "ce_learner_new_ui_welcome_modal",
            ceLearnerHintUnlockedPopoverDismissed:
              "ce_learner_hint_unlocked_popover_dismissed",
            ceLearnerSolutionUnlockedPopoverDismissed:
              "ce_learner_solution_unlocked_popover_dismissed",
            ubInsightsInstructorWelcomeModal:
              "ub_insights_instructor_welcome_modal",
            ceGiveLearnerFeedbackPopup: "ce_give_learner_feedback_popover",
            deviceBreakdownPopover: "device_breakdown_popover",
            courseEngagementAllTimeDataPopover:
              "course_engagement_all_time_data_popover",
          }),
          seen: function (e, t) {
            if (!Object.values(this.ids).includes(e))
              throw new Error("Invalid system message id: ".concat(e));
            return G.uh.post(
              "/users/me/system-messages/".concat(e, "/seen/"),
              t
            );
          },
          hasSeen: function (e, t) {
            return G.uh.get("/users/me/system-messages/".concat(e, "/seen/"), {
              params: t,
            });
          },
        },
        Ye = "/labs/",
        Ke = function (e) {
          return "".concat(Ye).concat(e, "/");
        },
        Je = function (e, t) {
          return ""
            .concat(
              (function (e) {
                return "".concat(Ke(e), "instance/");
              })(e)
            )
            .concat(t, "/");
        },
        $e = "".concat(Ye, "retrieve-running-labs/"),
        et = n(67273),
        tt = n.n(et),
        nt = n(35169),
        rt = n.n(nt),
        it = n(97137),
        ot = n.n(it),
        at = n(49219),
        st = n.n(at),
        ct = n(89749),
        lt = n.n(ct),
        ut =
          (Object.freeze({
            aws: {
              key: "aws",
              label: function (e) {
                return e("AWS");
              },
              glyph: "cloud",
              iconComponent: rt(),
            },
            azure: {
              key: "azure",
              label: function (e) {
                return e("Azure");
              },
              glyph: "cloud",
              iconComponent: rt(),
            },
            gcp: {
              key: "gcp",
              label: function (e) {
                return e("Google Cloud Provider");
              },
              glyph: "cloud",
              iconComponent: rt(),
            },
            web: {
              key: "web",
              label: function (e) {
                return e("Web");
              },
              glyph: "code",
              iconComponent: ot(),
            },
            data_science: {
              key: "data_science",
              label: function (e) {
                return e("Data Science");
              },
              glyph: "bar-chart",
              iconComponent: tt(),
            },
            devops: {
              key: "devops",
              label: function (e) {
                return e("DevOps");
              },
              glyph: "server",
              iconComponent: lt(),
            },
            security: {
              key: "security",
              label: function (e) {
                return e("Security");
              },
              glyph: "security",
              iconComponent: st(),
            },
          }),
          Object.freeze({
            4452: "aws",
            6716: "azure",
            8322: "web",
            5336: "data_science",
            5404: "devops",
            5988: "gcp",
          }),
          "/labs/listing/"),
        dt = "follow_along",
        pt = "structured",
        mt = Object.freeze({ END_CONFIRM: "end_confirm" }),
        ft =
          (Object.freeze({
            workspace: {
              key: "workspace",
              label: function (e) {
                return e("Workspace");
              },
            },
            modular: {
              key: "modular",
              label: function (e) {
                return e("Modular Lab");
              },
            },
            dev_workspace: {
              key: "dev_workspace",
              label: function (e) {
                return e("Instructor Development Workspace");
              },
            },
          }),
          Object.freeze({
            TERMINATE_LAB_FEEDBACK: function (e) {
              return e(
                "There was a problem terminating your lab. Please refresh your browser and try again."
              );
            },
          })),
        gt = "dismiss_modal",
        ht =
          ((je = _.LO.ref),
          (De = (function () {
            function e() {
              (0, h.Z)(this, e),
                (0, b.Z)(this, "isDismissed", Me, this),
                (0, b.Z)(this, "data", ze, this),
                (0, b.Z)(this, "modalType", Ue, this);
            }
            return (
              (0, v.Z)(e, [
                {
                  key: "setData",
                  value: function (e) {
                    this.data = e;
                  },
                },
                {
                  key: "firstRunningLab",
                  get: function () {
                    if (1 === this.data.length)
                      return this.data[0].lab_instance;
                  },
                },
                {
                  key: "url",
                  get: function () {
                    var e, t;
                    if (this.firstRunningLab)
                      return null !== (e = this.firstRunningLab) &&
                        void 0 !== e &&
                        e.lab.url
                        ? this.firstRunningLab.lab.url
                        : ""
                            .concat("/labs/")
                            .concat(
                              null === (t = this.firstRunningLab) ||
                                void 0 === t
                                ? void 0
                                : t.id,
                              "/"
                            );
                  },
                },
                {
                  key: "firstTaskUrl",
                  get: function () {
                    return "".concat(this.url, "tasks/1/");
                  },
                },
                {
                  key: "tasksPageUrl",
                  get: function () {
                    return "".concat(this.url, "tasks/");
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
                  key: "lastActiveTaskPageUrl",
                  get: function () {
                    return this.getActiveTaskNumber()
                      ? ""
                          .concat(this.tasksPageUrl)
                          .concat(this.getActiveTaskNumber(), "/")
                      : this.firstTaskUrl;
                  },
                },
                {
                  key: "continueLabPageUrl",
                  get: function () {
                    var e,
                      t,
                      n =
                        null === (e = this.firstRunningLab) ||
                        void 0 === e ||
                        null === (t = e.lab.enrollment) ||
                        void 0 === t
                          ? void 0
                          : t.last_attempted_mode;
                    return n === pt
                      ? this.lastActiveTaskPageUrl
                      : n === dt
                      ? this.tasksPageUrl
                      : this.projectOverviewUrl;
                  },
                },
                {
                  key: "getActiveTaskNumber",
                  value: function () {
                    var e;
                    return null === (e = this.data) || void 0 === e
                      ? void 0
                      : e[0].active_task_number;
                  },
                },
                {
                  key: "refreshAndRetrieveRunningLabs",
                  value: (function () {
                    var e = (0, te.Z)(
                      re().mark(function e() {
                        var t;
                        return re().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (e.prev = 0), (e.next = 3), G.uh.post($e)
                                  );
                                case 3:
                                  (t = e.sent).data &&
                                    t.data.results.length > 0 &&
                                    this.setData(t.data.results),
                                    (e.next = 10);
                                  break;
                                case 7:
                                  (e.prev = 7),
                                    (e.t0 = e.catch(0)),
                                    q.c.captureException(e.t0);
                                case 10:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          this,
                          [[0, 7]]
                        );
                      })
                    );
                    return function () {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "checkDismissed",
                  value: (function () {
                    var e = (0, te.Z)(
                      re().mark(function e() {
                        var t,
                          n = this;
                        return re().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (t = (this.data || []).map(
                                      (function () {
                                        var e = (0, te.Z)(
                                          re().mark(function e(t) {
                                            return re().wrap(function (e) {
                                              for (;;)
                                                switch ((e.prev = e.next)) {
                                                  case 0:
                                                    if (!t.lab_instance) {
                                                      e.next = 5;
                                                      break;
                                                    }
                                                    return (
                                                      (e.next = 3),
                                                      Xe.hasSeen(
                                                        Xe.ids
                                                          .hasSeenActiveLabBanner,
                                                        {
                                                          obj_type:
                                                            "lab_instance",
                                                          obj_id:
                                                            t.lab_instance.id,
                                                        }
                                                      )
                                                    );
                                                  case 3:
                                                    !1 === e.sent.data &&
                                                      n.setIsDismissed(!1);
                                                  case 5:
                                                  case "end":
                                                    return e.stop();
                                                }
                                            }, e);
                                          })
                                        );
                                        return function (t) {
                                          return e.apply(this, arguments);
                                        };
                                      })()
                                    )),
                                    (e.next = 3),
                                    Promise.allSettled(t)
                                  );
                                case 3:
                                  this.setIsDismissed(this.isDismissed);
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
                  key: "setDismissed",
                  value: (function () {
                    var e = (0, te.Z)(
                      re().mark(function e() {
                        var t;
                        return re().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (t = (this.data || []).map(
                                      (function () {
                                        var e = (0, te.Z)(
                                          re().mark(function e(t) {
                                            return re().wrap(function (e) {
                                              for (;;)
                                                switch ((e.prev = e.next)) {
                                                  case 0:
                                                    if (!t.lab_instance) {
                                                      e.next = 3;
                                                      break;
                                                    }
                                                    return (
                                                      (e.next = 3),
                                                      Xe.seen(
                                                        Xe.ids
                                                          .hasSeenActiveLabBanner,
                                                        {
                                                          obj_type:
                                                            "lab_instance",
                                                          obj_id:
                                                            t.lab_instance.id,
                                                        }
                                                      )
                                                    );
                                                  case 3:
                                                  case "end":
                                                    return e.stop();
                                                }
                                            }, e);
                                          })
                                        );
                                        return function (t) {
                                          return e.apply(this, arguments);
                                        };
                                      })()
                                    )),
                                    (e.next = 3),
                                    Promise.allSettled(t)
                                  );
                                case 3:
                                  this.setIsDismissed(!0);
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
                  key: "setIsDismissed",
                  value: function (e) {
                    this.isDismissed = e;
                  },
                },
                {
                  key: "_showErrorToast",
                  value: function (e) {
                    var t = { udStyle: "error", title: e, showCta: !1 };
                    Ge.n.addAlertBannerToast(t, { autoDismiss: !0 });
                  },
                },
                {
                  key: "showDismissModal",
                  value: function () {
                    this.modalType = gt;
                  },
                },
                {
                  key: "hideModal",
                  value: function () {
                    this.modalType = void 0;
                  },
                },
                {
                  key: "shouldRenderMultipleLabsBanner",
                  get: function () {
                    return this.data.length > 1 && !this.isDismissed;
                  },
                },
                {
                  key: "isDismissModalActive",
                  get: function () {
                    return this.modalType === gt;
                  },
                },
                {
                  key: "terminateLab",
                  value: (function () {
                    var e = (0, te.Z)(
                      re().mark(function e(t) {
                        var n, r;
                        return re().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  if (this.firstRunningLab) {
                                    e.next = 2;
                                    break;
                                  }
                                  return e.abrupt("return");
                                case 2:
                                  return (
                                    (e.prev = 2),
                                    (e.next = 5),
                                    G.uh.delete(
                                      ((i =
                                        null === (n = this.firstRunningLab) ||
                                        void 0 === n
                                          ? void 0
                                          : n.id),
                                      (o =
                                        null === (r = this.firstRunningLab) ||
                                        void 0 === r
                                          ? void 0
                                          : r.uuid),
                                      "".concat(Je(i, o), "terminate/"))
                                    )
                                  );
                                case 5:
                                  e.next = 11;
                                  break;
                                case 7:
                                  (e.prev = 7),
                                    (e.t0 = e.catch(2)),
                                    q.c.captureException(e.t0),
                                    this._showErrorToast(
                                      ft.TERMINATE_LAB_FEEDBACK(t)
                                    );
                                case 11:
                                case "end":
                                  return e.stop();
                              }
                            var i, o;
                          },
                          e,
                          this,
                          [[2, 7]]
                        );
                      })
                    );
                    return function (t) {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
              ]),
              e
            );
          })()),
          (Me = (0, y.Z)(De.prototype, "isDismissed", [_.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !0;
            },
          })),
          (ze = (0, y.Z)(De.prototype, "data", [je], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (Ue = (0, y.Z)(De.prototype, "modalType", [_.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (0, y.Z)(
            De.prototype,
            "setData",
            [qe.ZP, _.aD],
            Object.getOwnPropertyDescriptor(De.prototype, "setData"),
            De.prototype
          ),
          (0, y.Z)(
            De.prototype,
            "firstRunningLab",
            [_.Fl],
            Object.getOwnPropertyDescriptor(De.prototype, "firstRunningLab"),
            De.prototype
          ),
          (0, y.Z)(
            De.prototype,
            "url",
            [_.Fl],
            Object.getOwnPropertyDescriptor(De.prototype, "url"),
            De.prototype
          ),
          (0, y.Z)(
            De.prototype,
            "firstTaskUrl",
            [_.Fl],
            Object.getOwnPropertyDescriptor(De.prototype, "firstTaskUrl"),
            De.prototype
          ),
          (0, y.Z)(
            De.prototype,
            "tasksPageUrl",
            [_.Fl],
            Object.getOwnPropertyDescriptor(De.prototype, "tasksPageUrl"),
            De.prototype
          ),
          (0, y.Z)(
            De.prototype,
            "overviewUrl",
            [_.Fl],
            Object.getOwnPropertyDescriptor(De.prototype, "overviewUrl"),
            De.prototype
          ),
          (0, y.Z)(
            De.prototype,
            "projectOverviewUrl",
            [_.Fl],
            Object.getOwnPropertyDescriptor(De.prototype, "projectOverviewUrl"),
            De.prototype
          ),
          (0, y.Z)(
            De.prototype,
            "lastActiveTaskPageUrl",
            [_.Fl],
            Object.getOwnPropertyDescriptor(
              De.prototype,
              "lastActiveTaskPageUrl"
            ),
            De.prototype
          ),
          (0, y.Z)(
            De.prototype,
            "continueLabPageUrl",
            [_.Fl],
            Object.getOwnPropertyDescriptor(De.prototype, "continueLabPageUrl"),
            De.prototype
          ),
          (0, y.Z)(
            De.prototype,
            "setIsDismissed",
            [_.aD],
            Object.getOwnPropertyDescriptor(De.prototype, "setIsDismissed"),
            De.prototype
          ),
          (0, y.Z)(
            De.prototype,
            "showDismissModal",
            [_.aD],
            Object.getOwnPropertyDescriptor(De.prototype, "showDismissModal"),
            De.prototype
          ),
          (0, y.Z)(
            De.prototype,
            "hideModal",
            [qe.ZP, _.aD],
            Object.getOwnPropertyDescriptor(De.prototype, "hideModal"),
            De.prototype
          ),
          (0, y.Z)(
            De.prototype,
            "shouldRenderMultipleLabsBanner",
            [_.Fl],
            Object.getOwnPropertyDescriptor(
              De.prototype,
              "shouldRenderMultipleLabsBanner"
            ),
            De.prototype
          ),
          (0, y.Z)(
            De.prototype,
            "isDismissModalActive",
            [_.Fl],
            Object.getOwnPropertyDescriptor(
              De.prototype,
              "isDismissModalActive"
            ),
            De.prototype
          ),
          De),
        vt = n(19006),
        bt = n.n(vt),
        yt = function (e) {
          var t = (0, s.QT)().gettext,
            n = e.store,
            r = window.location.pathname === ut ? void 0 : ut;
          function i() {
            return a.apply(this, arguments);
          }
          function a() {
            return (a = (0, te.Z)(
              re().mark(function e() {
                return re().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (e.next = 2), n.setDismissed();
                      case 2:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            )).apply(this, arguments);
          }
          return o.createElement(
            "section",
            {
              "aria-labelledby": "labs-learning-banner",
              "data-testid": "multiple-labs-learning-banner",
            },
            o.createElement(
              "div",
              { className: bt().container },
              o.createElement(Ee, null),
              o.createElement(
                "div",
                { className: bt()["text-container"] },
                o.createElement(
                  "div",
                  { className: "ud-heading-md" },
                  o.createElement(
                    "h2",
                    { id: "multiple-labs-learning-banner" },
                    t("You still have time to pick up where you left off.")
                  )
                ),
                o.createElement(
                  "div",
                  { className: "ud-text-md" },
                  t(
                    "Take a moment to review and keep making progress on the labs you've started."
                  )
                )
              ),
              o.createElement(
                "div",
                { className: bt()["action-buttons"] },
                o.createElement(
                  C.zx,
                  {
                    "data-purpose": "multiple-lab-banner-dismiss",
                    onClick: i,
                    size: "medium",
                    udStyle: "ghost",
                    className: he()("ud-link-neutral", bt().button),
                  },
                  t("Dismiss")
                ),
                o.createElement(
                  C.zx,
                  {
                    "data-purpose": "multiple-lab-banner-continue",
                    onClick: i,
                    udStyle: "primary",
                    size: "medium",
                    componentClass: "a",
                    href: r,
                  },
                  t("Review labs")
                )
              )
            )
          );
        };
      yt.displayName = "MultipleLabsLearningBanner";
      var _t,
        Et,
        wt = (0, g.Pi)(yt),
        Ot = n(15515),
        St = n(10154);
      function kt(e) {
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
          var n,
            r = (0, ke.Z)(e);
          if (t) {
            var i = (0, ke.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, Se.Z)(this, n);
        };
      }
      var Ct =
          (0, g.Pi)(
            ((Et = (function (e) {
              (0, Oe.Z)(n, e);
              var t = kt(n);
              function n() {
                return (0, h.Z)(this, n), t.apply(this, arguments);
              }
              return (
                (0, v.Z)(n, [
                  {
                    key: "onConfirm",
                    value: (function () {
                      var e = (0, te.Z)(
                        re().mark(function e() {
                          return re().wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    return (
                                      this.props.labsLearningBannerStore.hideModal(),
                                      Ve(
                                        this.props.labsLearningBannerStore
                                          .firstRunningLab,
                                        mt.END_CONFIRM
                                      ),
                                      Qe(
                                        this.props.labsLearningBannerStore
                                          .firstRunningLab
                                      ),
                                      (e.next = 5),
                                      this.props.labsLearningBannerStore.terminateLab(
                                        this.props.gettext
                                      )
                                    );
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
                      return function () {
                        return e.apply(this, arguments);
                      };
                    })(),
                  },
                  {
                    key: "render",
                    value: function () {
                      var e = this.props,
                        t = e.isOpen,
                        n = e.labsLearningBannerStore;
                      return o.createElement(
                        Ot.u,
                        {
                          title: this.props.gettext(
                            "Would you like to terminate this lab?"
                          ),
                          isOpen: t,
                          onClose: n.hideModal,
                        },
                        o.createElement(
                          "div",
                          null,
                          this.props.gettext(
                            "Ending the lab will reset the workspace and all data stored in the current session will be deleted."
                          )
                        ),
                        o.createElement(
                          St.a,
                          null,
                          o.createElement(
                            C.zx,
                            {
                              "data-purpose": "cancel-confirm-modal",
                              onClick: n.hideModal,
                              udStyle: "ghost",
                            },
                            this.props.gettext("Cancel")
                          ),
                          o.createElement(
                            C.zx,
                            {
                              "data-purpose": "submit-confirm-modal",
                              onClick: this.onConfirm,
                            },
                            this.props.gettext("End lab")
                          )
                        )
                      );
                    },
                  },
                ]),
                n
              );
            })(o.Component)),
            (0, y.Z)(
              Et.prototype,
              "onConfirm",
              [qe.ZP],
              Object.getOwnPropertyDescriptor(Et.prototype, "onConfirm"),
              Et.prototype
            ),
            (_t = Et))
          ) || _t,
        xt = (0, s.GV)(Ct),
        Nt = function (e) {
          var t,
            n = (0, s.QT)(),
            r = n.gettext,
            i = n.interpolate,
            a = e.store,
            c = "".concat(a.continueLabPageUrl, "?").concat("fromResumeBanner");
          function l() {
            return (l = (0, te.Z)(
              re().mark(function e() {
                return re().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (e.next = 2), a.setDismissed();
                      case 2:
                        a.showDismissModal(), He(a.firstRunningLab);
                      case 4:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            )).apply(this, arguments);
          }
          function u() {
            return (u = (0, te.Z)(
              re().mark(function e() {
                return re().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        We(a.firstRunningLab);
                      case 1:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            )).apply(this, arguments);
          }
          return o.createElement(
            o.Fragment,
            null,
            !a.isDismissed &&
              o.createElement(
                "section",
                {
                  "aria-labelledby": "labs-learning-banner",
                  "data-testid": "labs-learning-banner",
                },
                o.createElement(
                  "div",
                  { className: bt().container },
                  o.createElement(Ee, null),
                  o.createElement(
                    "div",
                    { className: bt()["text-container"] },
                    o.createElement(
                      "div",
                      { className: "ud-heading-md" },
                      o.createElement(
                        "h2",
                        { id: "labs-learning-banner" },
                        r(
                          "There\u2019s still time for you to continue your lab from where you left off."
                        )
                      )
                    ),
                    o.createElement(
                      "div",
                      { className: "ud-text-md" },
                      i(
                        r("%(labTitle)s is still in-progress."),
                        {
                          labTitle:
                            null === (t = a.firstRunningLab) || void 0 === t
                              ? void 0
                              : t.lab.title,
                        },
                        !0
                      )
                    )
                  ),
                  o.createElement(
                    "div",
                    { className: bt()["action-buttons"] },
                    o.createElement(
                      C.zx,
                      {
                        "data-purpose": "lab-banner-dismiss",
                        onClick: function () {
                          return l.apply(this, arguments);
                        },
                        size: "medium",
                        udStyle: "ghost",
                        className: he()("ud-link-neutral", bt().button),
                      },
                      r("Dismiss")
                    ),
                    o.createElement(
                      C.zx,
                      {
                        "data-purpose": "lab-banner-continue",
                        onClick: function () {
                          return u.apply(this, arguments);
                        },
                        udStyle: "primary",
                        size: "medium",
                        componentClass: "a",
                        href: c,
                      },
                      r("Continue lab")
                    )
                  )
                )
              ),
            o.createElement(xt, {
              isOpen: a.isDismissModalActive,
              labsLearningBannerStore: a,
            })
          );
        };
      Nt.displayName = "SingleLabsLearningBanner";
      var Pt = (0, g.Pi)(Nt),
        It = function (e) {
          var t = (0, c.gL)().me,
            n = (0, o.useState)(function () {
              return e.store || new ht();
            })[0];
          return (
            (0, o.useEffect)(
              function () {
                function e() {
                  return (e = (0, te.Z)(
                    re().mark(function e() {
                      return re().wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              return (
                                (e.next = 2), n.refreshAndRetrieveRunningLabs()
                              );
                            case 2:
                              return (e.next = 4), n.checkDismissed();
                            case 4:
                              !n.isDismissed &&
                                n.firstRunningLab &&
                                Be(n.firstRunningLab);
                            case 5:
                            case "end":
                              return e.stop();
                          }
                      }, e);
                    })
                  )).apply(this, arguments);
                }
                t.is_authenticated &&
                  (function () {
                    e.apply(this, arguments);
                  })();
              },
              [t.is_authenticated, n]
            ),
            t.is_authenticated
              ? n.shouldRenderMultipleLabsBanner
                ? o.createElement(wt, { store: n })
                : o.createElement(Pt, { store: n })
              : null
          );
        };
      It.displayName = "LabsLearningBanner";
      var Tt = (0, g.Pi)(It),
        Zt = n(22474),
        Rt = n(23290),
        At = n(36526),
        Lt = n(55147),
        jt = n.n(Lt),
        Dt = ["goToContentSelector", "goToContentAnchorId", "label"],
        Mt = function (e) {
          var t = e.goToContentSelector,
            n = e.goToContentAnchorId,
            r = void 0 === n ? "main-content-anchor" : n,
            i = e.label,
            a = (0, d.Z)(e, Dt),
            s = (0, o.useState)(""),
            c = s[0],
            l = s[1];
          (0, o.useEffect)(function () {
            l(window.location.pathname);
          }, []);
          return o.createElement(
            "div",
            { className: jt()["skip-to-content"] },
            o.createElement(
              C.zx,
              Object.assign(
                {
                  className: jt()["skip-to-content-btn"],
                  onClick: function () {
                    var e = document.getElementById(r);
                    if (e) e.scrollIntoView({ behavior: "smooth" });
                    else {
                      var n = document.querySelector(t);
                      if (null !== n) {
                        var i = (0, At.W)(n)[0];
                        null === i || void 0 === i || i.focus(),
                          null === i ||
                            void 0 === i ||
                            i.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  },
                  componentClass: "a",
                  href: "".concat(c, "#").concat(r),
                },
                a
              ),
              o.createElement("span", {
                "aria-hidden": "true",
                className: jt()["skip-to-content-shadow"],
              }),
              o.createElement("span", { style: { margin: 0 } }, i)
            )
          );
        },
        zt = n(40027),
        Ut = n(7754),
        Ft = n(97154),
        Bt = n(34364),
        Wt = n(55306),
        Ht = n(74245),
        Qt = n(48525),
        Vt = n(83162),
        qt = n(10748),
        Gt = n(95590),
        Xt = ["forwardedRef"],
        Yt = ["onMenuAimUpdate"];
      function Kt(e, t) {
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
      function Jt(e) {
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
          var n,
            r = (0, ke.Z)(e);
          if (t) {
            var i = (0, ke.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, Se.Z)(this, n);
        };
      }
      var $t = o.createContext({
        aimArea1: {},
        aimArea2: {},
        hideAimArea: Gt.Z,
        isAimAreaHidden: !1,
        showAimArea: Gt.Z,
      });
      function en(e) {
        var t = e.getTriggerNode,
          n = e.getMenuNode,
          r = e.onMouseLeave;
        return function (e) {
          var i,
            a,
            s,
            c,
            l,
            u,
            p,
            m,
            f,
            g =
              ((i = _.LO.ref),
              (a = _.LO.ref),
              (s = (function (t) {
                (0, Oe.Z)(r, t);
                var n = Jt(r);
                function r(e) {
                  var t;
                  return (
                    (0, h.Z)(this, r),
                    ((t = n.call(this, e)).localRef = null),
                    (t.localCallbackRef = void 0),
                    (0, b.Z)((0, qt.Z)(t), "aimArea1", c, (0, qt.Z)(t)),
                    (0, b.Z)((0, qt.Z)(t), "aimArea2", l, (0, qt.Z)(t)),
                    (0, b.Z)((0, qt.Z)(t), "isAimAreaHidden", u, (0, qt.Z)(t)),
                    (t.hideAimAreaTimeoutId = null),
                    (0, b.Z)((0, qt.Z)(t), "showAimArea", p, (0, qt.Z)(t)),
                    (0, b.Z)((0, qt.Z)(t), "hideAimArea", m, (0, qt.Z)(t)),
                    (0, b.Z)((0, qt.Z)(t), "onMenuAimUpdate", f, (0, qt.Z)(t)),
                    (t.localCallbackRef = function (e) {
                      (t.localRef = e),
                        "function" === typeof t.props.forwardedRef
                          ? t.props.forwardedRef(e)
                          : t.props.forwardedRef &&
                            (t.props.forwardedRef.current = e);
                    }),
                    t
                  );
                }
                return (
                  (0, v.Z)(r, [
                    {
                      key: "render",
                      value: function () {
                        var t = this.props,
                          n = (t.forwardedRef, (0, d.Z)(t, Xt));
                        return o.createElement(
                          $t.Provider,
                          { value: this },
                          o.createElement(
                            e,
                            Object.assign({}, n, {
                              onMenuAimUpdate: this.onMenuAimUpdate,
                              ref: this.localCallbackRef,
                            })
                          )
                        );
                      },
                    },
                  ]),
                  r
                );
              })(o.Component)),
              (c = (0, y.Z)(s.prototype, "aimArea1", [i], {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  return {};
                },
              })),
              (l = (0, y.Z)(s.prototype, "aimArea2", [a], {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  return {};
                },
              })),
              (u = (0, y.Z)(s.prototype, "isAimAreaHidden", [_.LO], {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  return !1;
                },
              })),
              (p = (0, y.Z)(s.prototype, "showAimArea", [_.aD], {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  var e = this;
                  return function () {
                    null !== e.hideAimAreaTimeoutId &&
                      clearTimeout(e.hideAimAreaTimeoutId),
                      (e.hideAimAreaTimeoutId = null),
                      (e.isAimAreaHidden = !1);
                  };
                },
              })),
              (m = (0, y.Z)(s.prototype, "hideAimArea", [_.aD], {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  var e = this;
                  return function (t, n) {
                    null !== e.hideAimAreaTimeoutId &&
                      clearTimeout(e.hideAimAreaTimeoutId),
                      (e.hideAimAreaTimeoutId = null),
                      n
                        ? (e.hideAimAreaTimeoutId = setTimeout(function () {
                            return e.hideAimArea(t);
                          }, n))
                        : ((e.isAimAreaHidden = !0),
                          e.localRef &&
                            (null === r || void 0 === r || r(e.localRef, t)));
                  };
                },
              })),
              (f = (0, y.Z)(s.prototype, "onMenuAimUpdate", [_.aD], {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: function () {
                  var e = this;
                  return function () {
                    var r = e.localRef ? t(e.localRef) : null,
                      i = e.localRef ? n(e.localRef) : null;
                    if (r && i) {
                      var o = r.getBoundingClientRect(),
                        a = i.getBoundingClientRect();
                      o.top >= a.bottom
                        ? ((e.aimArea1 = {
                            pos: { top: "100%", left: "0" },
                            w: Math.round(o.left - a.left) + 2,
                            h: Math.round(o.bottom - a.bottom),
                            path: "M%(w)s %(h)sV0H0Z",
                            dir: { x: -1, y: -1 },
                          }),
                          (e.aimArea2 = {
                            pos: { top: "100%", right: "0" },
                            w: Math.round(a.right - o.right) + 2,
                            h: Math.round(o.bottom - a.bottom),
                            path: "M0 %(h)sV0H%(w)sZ",
                            dir: { x: 1, y: -1 },
                          }))
                        : o.bottom <= a.top
                        ? ((e.aimArea1 = {
                            pos: { bottom: "100%", left: "0" },
                            w: Math.round(o.left - a.left) + 2,
                            h: Math.round(a.top - o.top),
                            path: "M%(w)s 0V%(h)sH0Z",
                            dir: { x: -1, y: 1 },
                          }),
                          (e.aimArea2 = {
                            pos: { bottom: "100%", right: "0" },
                            w: Math.round(a.right - o.right) + 2,
                            h: Math.round(a.top - o.top),
                            path: "M0 0V%(h)sH%(w)sZ",
                            dir: { x: 1, y: 1 },
                          }))
                        : o.right <= a.left
                        ? ((e.aimArea1 = {
                            pos: { top: "0", right: "100%" },
                            w: Math.round(a.left - o.left),
                            h: Math.round(o.top - a.top) + 2,
                            path: "M0 %(h)sH%(w)sV0Z",
                            dir: { x: 1, y: -1 },
                          }),
                          (e.aimArea2 = {
                            pos: { bottom: "0", right: "100%" },
                            w: Math.round(a.left - o.left),
                            h: Math.round(a.bottom - o.bottom) + 2,
                            path: "M0 0H%(w)sV%(h)sZ",
                            dir: { x: 1, y: 1 },
                          }))
                        : ((e.aimArea1 = {
                            pos: { top: "0", left: "100%" },
                            w: Math.round(o.right - a.right),
                            h: Math.round(o.top - a.top) + 2,
                            path: "M%(w)s %(h)sH0V0Z",
                            dir: { x: -1, y: -1 },
                          }),
                          (e.aimArea2 = {
                            pos: { bottom: "0", left: "100%" },
                            w: Math.round(o.right - a.right),
                            h: Math.round(a.bottom - o.bottom) + 2,
                            path: "M%(w)s 0H0V%(h)sZ",
                            dir: { x: -1, y: 1 },
                          })),
                        e.showAimArea();
                    }
                  };
                },
              })),
              s);
          return Object.assign(
            o.forwardRef(function (e, t) {
              return o.createElement(
                g,
                Object.assign({}, e, { forwardedRef: t })
              );
            }),
            { propTypes: rn(e.propTypes), defaultProps: rn(e.defaultProps) }
          );
        };
      }
      var tn = Object.assign(
          (0, g.Pi)(function () {
            var e = o.useContext($t),
              t = e.aimArea1,
              n = e.aimArea2;
            return o.createElement(
              o.Fragment,
              null,
              o.createElement(nn, { aimArea: t }),
              o.createElement(nn, { aimArea: n })
            );
          }),
          { displayName: "MenuAimArea" }
        ),
        nn = Object.assign(
          (0, g.Pi)(function (e) {
            var t = (0, s.QT)().interpolate,
              n = (0, o.useState)(null),
              r = n[0],
              i = n[1],
              a = (0, o.useContext)($t),
              c = a.hideAimArea,
              u = a.isAimAreaHidden,
              d = a.showAimArea,
              p = e.aimArea,
              m = p.pos,
              f = p.w,
              g = p.h,
              h = p.path;
            if (u || !f || f <= 4 || !g || g <= 4) return null;
            var v = (function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = null != arguments[t] ? arguments[t] : {};
                t % 2
                  ? Kt(Object(n), !0).forEach(function (t) {
                      (0, l.Z)(e, t, n[t]);
                    })
                  : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(
                      e,
                      Object.getOwnPropertyDescriptors(n)
                    )
                  : Kt(Object(n)).forEach(function (t) {
                      Object.defineProperty(
                        e,
                        t,
                        Object.getOwnPropertyDescriptor(n, t)
                      );
                    });
              }
              return e;
            })({ pointerEvents: "none", position: "absolute" }, m);
            return o.createElement(
              "svg",
              {
                "aria-hidden": "true",
                focusable: "false",
                style: v,
                width: f,
                height: g,
              },
              o.createElement("path", {
                style: {
                  pointerEvents: "auto",
                  cursor: "pointer",
                  fill: "transparent",
                },
                d: t(h, e.aimArea, !0),
                onMouseEnter: function (e) {
                  var t = e.clientX,
                    n = e.clientY;
                  i({ x: t, y: n });
                },
                onMouseMove: function (t) {
                  var n = t.clientX,
                    o = t.clientY,
                    a = null !== r && void 0 !== r ? r : { x: n, y: o },
                    s = a.x,
                    l = a.y;
                  if (Math.abs(n - s) > 4 || Math.abs(o - l) > 4) {
                    var u = (function (t, n, r, i) {
                      var o = e.aimArea,
                        a = o.pos,
                        s = o.w,
                        c = o.h,
                        l = o.dir,
                        u = n - i,
                        d = t - r,
                        p = c / s,
                        m = u / d,
                        f = 0 === d || d > 0 === l.x > 0,
                        g = 0 === u || u > 0 === l.y > 0;
                      return (
                        !!((f && !g) || (!f && g)) ||
                        ("100%" === a.top || "100%" === a.bottom
                          ? 2 * Math.abs(m) < Math.abs(p)
                          : 2 * Math.abs(p) < Math.abs(m))
                      );
                    })(n, o, s, l)
                      ? 0
                      : 25;
                    c({ x: n, y: o }, u);
                  }
                  i(a);
                },
                onMouseLeave: d,
              })
            );
          }),
          { displayName: "MenuAimSVG" }
        );
      function rn(e) {
        var t = null !== e && void 0 !== e ? e : {};
        t.onMenuAimUpdate;
        return (0, d.Z)(t, Yt);
      }
      function on() {
        var e = o.useContext(Wt.p);
        if (null === e || void 0 === e || !e.browseNavStore)
          throw new Error("browseNavStore is not set in HeaderContext");
        return e.browseNavStore;
      }
      var an = n(97198),
        sn = n(6276),
        cn = n(73935),
        ln = n(72820),
        un = n(56073),
        dn = n(62018),
        pn = n.n(dn),
        mn = ["getFocusCycle"],
        fn = ["className"],
        gn = ["udStyle", "children"];
      function hn(e, t) {
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
      function vn(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? hn(Object(n), !0).forEach(function (t) {
                (0, l.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : hn(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      function bn(e, t) {
        setTimeout(function () {
          var n = t.x,
            r = t.y,
            i = Array.from(document.querySelectorAll(e)).find(function (e) {
              var t = e.getBoundingClientRect(),
                i = t.top,
                o = t.right,
                a = t.bottom,
                s = t.left;
              return n >= s && n <= o && r >= i && r <= a;
            });
          i && i.dispatchEvent(new Event("mouseover", { bubbles: !0 }));
        }, 0);
      }
      var yn,
        _n,
        En,
        wn,
        On,
        Sn,
        kn,
        Cn,
        xn,
        Nn,
        Pn,
        In,
        Tn,
        Zn = o.forwardRef(function (e, t) {
          var n = e.getFocusCycle,
            r = void 0 === n ? ln.c.defaultProps.getCycle : n,
            i = (0, d.Z)(e, mn),
            a = o.useRef(null);
          o.useImperativeHandle(
            t,
            function () {
              return {
                getTriggerNode: function () {
                  return cn.findDOMNode(a.current);
                },
                onMouseLeave: function (e) {
                  a.current &&
                    (a.current.onMouseLeave(), bn(".js-header-button", e));
                },
                getMenuNode: function () {
                  return a.current
                    ? document.getElementById(a.current.contentId)
                    : null;
                },
              };
            },
            []
          );
          return o.createElement(
            ln.c,
            { getCycle: r },
            o.createElement(
              un.r,
              Object.assign(
                {
                  ref: a,
                  canToggleOnHover: !0,
                  placement: "bottom-end",
                  withArrow: !1,
                  withPadding: !1,
                  renderContent: function (e) {
                    for (
                      var t,
                        n,
                        r,
                        i = e.className,
                        o = (0, d.Z)(e, fn),
                        a = arguments.length,
                        s = new Array(a > 1 ? a - 1 : 0),
                        c = 1;
                      c < a;
                      c++
                    )
                      s[c - 1] = arguments[c];
                    return null ===
                      (n = (r = un.r.defaultProps).renderContent) ||
                      void 0 === n
                      ? void 0
                      : (t = n).call.apply(
                          t,
                          [
                            r,
                            vn({ className: f()(i, pn().dropdown) }, o),
                          ].concat(s)
                        );
                  },
                },
                i
              )
            )
          );
        }),
        Rn = en({
          getTriggerNode: function (e) {
            return e.getTriggerNode();
          },
          getMenuNode: function (e) {
            return e.getMenuNode();
          },
          onMouseLeave: function (e, t) {
            return e.onMouseLeave(t);
          },
        })(Zn),
        An = function (e) {
          var t = e.udStyle,
            n = void 0 === t ? "text" : t,
            r = e.children,
            i = (0, d.Z)(e, gn),
            a = "icon" === n ? Rt.h : C.zx;
          return o.createElement(
            a,
            Object.assign({}, i, {
              udStyle: "ghost",
              className: "js-header-button ".concat(pn()["dropdown-button"]),
            }),
            "text" !== n
              ? r
              : o.createElement(
                  "span",
                  {
                    className: "ud-text-sm ".concat(
                      pn()["dropdown-button-text"]
                    ),
                  },
                  r
                )
          );
        },
        Ln = function (e) {
          var t = e.children;
          return o.createElement(
            "div",
            {
              className: "ud-header-menu ".concat(pn().menu),
              "data-testid": "header-menu",
            },
            t,
            o.createElement(tn, null)
          );
        },
        jn = n(61668),
        Dn = n.n(jn),
        Mn = n(90116),
        zn = n(68132),
        Un = n(34278),
        Fn = n(93630),
        Bn = n.n(Fn),
        Wn = n(54844),
        Hn = n(54742),
        Qn = n(23695),
        Vn = n(76978),
        qn = n(17958),
        Gn = n(55830),
        Xn = n(66781),
        Yn = n.n(Xn),
        Kn = function (e) {
          var t = e.children,
            n = e.props;
          return o.createElement(
            "h2",
            Object.assign({ className: f()("ud-heading-sm", Yn().heading) }, n),
            t
          );
        },
        Jn = [
          "navItem",
          "isSelected",
          "subNavId",
          "isLearningTypeNavItem",
          "onSelect",
          "findFirstSubNavItem",
          "onMenuAimUpdate",
        ],
        $n = (0, v.Z)(function e() {
          (0, h.Z)(this, e),
            (this.findSelectedLevelOneItem = function (e) {
              var t = e.selectedLevelOneItem;
              return t
                ? document.querySelector(
                    '.js-browse-nav-level-one [data-id="'.concat(t.id, '"]')
                  )
                : null;
            }),
            (this.findSelectedLevelTwoItem = function (e) {
              var t = e.selectedLevelTwoItem;
              return t
                ? document.querySelector(
                    '.js-browse-nav-level-two [data-id="'.concat(t.id, '"]')
                  )
                : null;
            }),
            (this.findFirstLevelTwoItem = function () {
              return document.querySelector(
                ".js-browse-nav-level-two [data-id]"
              );
            }),
            (this.findLastLevelTwoItem = function () {
              var e = document.querySelectorAll(
                ".js-browse-nav-level-two [data-id]"
              );
              return e ? e[e.length - 1] : null;
            }),
            (this.findFirstLevelThreeItem = function () {
              return document.querySelector(
                ".js-browse-nav-level-three [data-id]"
              );
            }),
            (this.findLastLevelThreeItem = function () {
              var e = document.querySelectorAll(
                ".js-browse-nav-level-three [data-id]"
              );
              return e ? e[e.length - 1] : null;
            });
        }),
        er = (0, g.Pi)(function (e) {
          var t,
            n,
            r,
            i,
            a,
            l = e.browseNavStore,
            d = e.headerStore,
            p = e.ufbContext,
            m = (0, c.gL)(),
            f = m.Config,
            g = m.me,
            h = (0, s.QT)().gettext,
            v =
              null ===
                (t = (0, pe.ag)(
                  "(min-width: ".concat((0, Vn.bN)(930), "em)")
                )) ||
              void 0 === t ||
              t,
            b = o.useRef(null),
            y = o.useState(),
            _ = (0, u.Z)(y, 2),
            E = _[0],
            w = _[1],
            O = o.useState(new $n()),
            S = (0, u.Z)(O, 1)[0],
            k = g.is_authenticated && !!g.organization,
            C =
              k &&
              (f.features.organization.learning_path.pro_path ||
                (g.is_authenticated &&
                  (null === (n = g.organization) || void 0 === n
                    ? void 0
                    : n.is_pro_license_holder))),
            x =
              null === (r = d.userSpecificContext.user) || void 0 === r
                ? void 0
                : r.consumer_subscription_active,
            N = k && f.brand.is_team,
            P =
              null === (i = d.userSpecificContext.user) || void 0 === i
                ? void 0
                : i.show_updated_pp_and_ub_navigation,
            I =
              null === (a = d.userSpecificContext.user) || void 0 === a
                ? void 0
                : a.show_updated_mx_navigation,
            T = x || (C && P),
            Z = P || I,
            R = function () {
              return S.findSelectedLevelOneItem(l);
            },
            A = function () {
              return S.findSelectedLevelTwoItem(l);
            },
            L = function () {
              return S.findFirstLevelTwoItem();
            },
            j = S.findLastLevelTwoItem,
            D = S.findFirstLevelThreeItem,
            M = S.findLastLevelThreeItem;
          function z(e) {
            var t;
            if (e.key === Un.m.ESCAPE || e.key === Un.m.LEFT)
              if (l.selectedLevelTwoItem)
                e.stopPropagation(),
                  null === (t = A()) || void 0 === t || t.focus(),
                  l.selectLevelTwoItem(l.selectedLevelTwoItem);
              else if (l.selectedLevelOneItem) {
                var n;
                e.stopPropagation(),
                  null === (n = R()) || void 0 === n || n.focus(),
                  l.selectLevelOneItem(l.selectedLevelOneItem);
              }
          }
          function U(e) {
            return o.createElement(nr, {
              navItem: e,
              key: e.id,
              onSelect: l.selectLevelOneItem,
              href: e.absolute_url,
              id: "header-browse-nav-".concat(e.type, "-").concat(e.id),
              isLearningTypeNavItem: !0,
              isSelected: e === l.selectedLevelOneItem,
            });
          }
          return (
            o.useEffect(function () {
              var e = (0, zn.v)([
                [R, L],
                [A, D],
                [M, A],
                [j, R],
              ]);
              w(e);
              var t = b.current;
              return (
                null === t || void 0 === t || t.addEventListener("keyup", z),
                function () {
                  null === E || void 0 === E || E(),
                    null === t ||
                      void 0 === t ||
                      t.removeEventListener("keyup", z);
                }
              );
            }, []),
            o.createElement(
              "div",
              {
                ref: b,
                className: ""
                  .concat(Yn()["list-menu-container"], " ")
                  .concat(Dn()["nav-container"]),
                "data-testid": "browse-nav",
              },
              (function () {
                var e;
                return o.createElement(
                  "div",
                  {
                    className: "js-browse-nav-level-one ".concat(Dn().nav),
                    "data-testid": "browse-nav-list",
                  },
                  Z &&
                    (f.brand.organization &&
                    f.brand.organization.is_enterprise_china
                      ? null
                      : o.createElement(
                          o.Fragment,
                          null,
                          o.createElement(Kn, null, h("Explore badges")),
                          o.createElement(
                            Hn.W,
                            { size: "small", className: Yn().section },
                            U((0, qn.xo)(h).CERTIFICATIONS)
                          )
                        )),
                  T &&
                    (function () {
                      var e, t;
                      return (
                        (t = h(
                          C
                            ? "Explore Pro"
                            : P
                            ? "Explore active learning"
                            : "Explore by type"
                        )),
                        o.createElement(
                          o.Fragment,
                          null,
                          o.createElement(
                            Kn,
                            null,
                            t,
                            C &&
                              o.createElement(Wn.Z, { "aria-hidden": "true" })
                          ),
                          o.createElement(
                            Hn.W,
                            { size: "small", className: Yn().section },
                            ((null === (e = d.userSpecificContext.user) ||
                            void 0 === e
                              ? void 0
                              : e.enableLabsInPersonalPlan) ||
                              C) &&
                              U((0, qn.Qm)(h).LABS),
                            U((0, qn.Qm)(h).ASSESSMENTS),
                            C && U((0, qn.Qm)(h).UDEMY_PRO_PATHS)
                          )
                        )
                      );
                    })(),
                  null === p ||
                    void 0 === p ||
                    null === (e = p.getBrowseNavLevelOneItems) ||
                    void 0 === e
                    ? void 0
                    : e.call(p, S),
                  (function () {
                    var e,
                      t = x || (k && !N) || (N && P) || I,
                      n = x || P || I,
                      r =
                        (null === (e = l.navigationCategories) || void 0 === e
                          ? void 0
                          : e.length) > 0;
                    return o.createElement(
                      o.Fragment,
                      null,
                      t &&
                        o.createElement(
                          Kn,
                          null,
                          h(n ? "Explore by category" : "All categories")
                        ),
                      o.createElement(
                        Hn.W,
                        {
                          size: "small",
                          className: Yn().section,
                          iconAlignment: "right",
                        },
                        r
                          ? l.navigationCategories.map(function (e) {
                              return o.createElement(nr, {
                                key: e.id,
                                navItem: e,
                                onSelect: l.selectLevelOneItem,
                                findFirstSubNavItem: L,
                                isSelected: e === l.selectedLevelOneItem,
                                subNavId: "header-browse-nav-level-two",
                                id: "header-browse-nav-"
                                  .concat(e.type, "-")
                                  .concat(e.id),
                              });
                            })
                          : (0, Qn.w)(13).map(function (e) {
                              return o.createElement(Hn.W.Item, {
                                key: e,
                                loading: !0,
                                className: Yn().item,
                              });
                            })
                      )
                    );
                  })()
                );
              })(),
              (function () {
                var e,
                  t,
                  n,
                  r = null,
                  i = l.selectedLevelOneItem,
                  a =
                    Boolean(i) &&
                    []
                      .concat(
                        (0, Mn.Z)(
                          Object.values((0, qn.xo)(h)).map(function (e) {
                            return e.type;
                          })
                        ),
                        (0, Mn.Z)(
                          Object.values((0, qn.Qm)(h)).map(function (e) {
                            return e.type;
                          })
                        )
                      )
                      .includes(null === i || void 0 === i ? void 0 : i.type);
                return (
                  i &&
                    !a &&
                    ((e = "header-browse-nav-"
                      .concat(i.type, "-")
                      .concat(i.id)),
                    (r =
                      (null === p ||
                      void 0 === p ||
                      null === (t = p.getBrowseNavLevelTwoItems) ||
                      void 0 === t
                        ? void 0
                        : t.call(p, i)) ||
                      o.createElement(
                        Hn.W,
                        {
                          size: "small",
                          className: Yn().section,
                          iconAlignment: "right",
                        },
                        null === (n = i.children) || void 0 === n
                          ? void 0
                          : n.map(function (e) {
                              return o.createElement(nr, {
                                key: e.id,
                                navItem: e,
                                onSelect: l.selectLevelTwoItem,
                                isSelected: e === l.selectedLevelTwoItem,
                                findFirstSubNavItem: D,
                                subNavId: v
                                  ? "header-browse-nav-level-three"
                                  : void 0,
                                id: "header-browse-nav-"
                                  .concat(e.type, "-")
                                  .concat(e.id),
                              });
                            })
                      ))),
                  o.createElement(
                    ln.c,
                    null,
                    o.createElement(
                      "div",
                      {
                        "aria-labelledby": e,
                        id: "header-browse-nav-level-two",
                        className: "js-browse-nav-level-two ".concat(Dn().nav),
                        style: { display: r ? "block" : "none" },
                        "data-testid": "browse-nav-list",
                      },
                      r
                    )
                  )
                );
              })(),
              (function () {
                if (!v) return null;
                var e,
                  t = null,
                  n = null,
                  r = l.selectedLevelTwoItem;
                if (r) {
                  var i = l.getTopics(r);
                  (e = "header-browse-nav-".concat(r.type, "-").concat(r.id)),
                    (t = o.createElement(Kn, null, h("Popular topics"))),
                    (n = o.createElement(
                      Hn.W,
                      {
                        size: "small",
                        className: Yn().section,
                        iconAlignment: "right",
                      },
                      i
                        ? i.map(function (e) {
                            return o.createElement(nr, {
                              onSelect: l.selectLevelThreeItem,
                              key: e.id,
                              navItem: e,
                            });
                          })
                        : (0, Qn.w)(9).map(function (e) {
                            return o.createElement(Hn.W.Item, {
                              key: e,
                              loading: !0,
                              className: Yn().item,
                            });
                          })
                    ));
                }
                return o.createElement(
                  ln.c,
                  null,
                  o.createElement(
                    "div",
                    {
                      "aria-labelledby": e,
                      id: "header-browse-nav-level-three",
                      className: "js-browse-nav-level-three ".concat(Dn().nav),
                      style: { display: n ? "block" : "none" },
                      "data-testid": "browse-nav-list",
                    },
                    t,
                    n
                  )
                );
              })()
            )
          );
        }),
        tr = o.forwardRef(function (e, t) {
          var n = e.navItem,
            r = e.isSelected,
            i = e.subNavId,
            a = e.isLearningTypeNavItem,
            s = e.onSelect,
            l = e.findFirstSubNavItem,
            p = e.onMenuAimUpdate,
            m = void 0 === p ? Gt.Z : p,
            f = (0, d.Z)(e, Jn),
            g = (0, c.gL)().Config,
            h = o.useState(),
            v = (0, u.Z)(h, 2),
            b = v[0],
            y = v[1],
            _ = o.useRef(null),
            E = o.useCallback(
              function () {
                return i ? document.getElementById(i) : null;
              },
              [i]
            );
          function w() {
            var e = null === l || void 0 === l ? void 0 : l();
            e && e.focus();
          }
          o.useImperativeHandle(
            t,
            function () {
              return {
                getTriggerNode: function () {
                  return _.current;
                },
                onMouseLeave: function (e) {
                  return bn(".".concat(Yn().item), e);
                },
                getMenuNode: E,
              };
            },
            [E]
          );
          var O = i || a;
          return o.createElement(
            Hn.W.Item,
            Object.assign(
              {
                ref: _.current ? _ : null,
                href: (0, Gn.W)(n.absolute_url, g.brand.has_organization),
                "data-testid": "browse-nav-item",
              },
              f,
              {
                "data-id": n.id,
                className: Yn().item,
                color: i && r ? "link" : "neutral",
                icon: i ? o.createElement(Bn(), { label: !1 }) : null,
                "aria-expanded": i ? r : void 0,
                onClick: s
                  ? function (e) {
                      "keyboard" === b && i && e.preventDefault(),
                        y("click"),
                        null === s ||
                          void 0 === s ||
                          s(n, { toggle: !1, selectedVia: "click" });
                    }
                  : void 0,
                onKeyDown: i
                  ? function (e) {
                      (e.key !== Un.m.RETURN &&
                        e.key !== Un.m.SPACE &&
                        e.key !== Un.m.RIGHT) ||
                        (e.preventDefault(),
                        y("keyboard"),
                        null === s ||
                          void 0 === s ||
                          s(n, {
                            toggle: e.key !== Un.m.RIGHT,
                            selectedVia: "keyboard",
                          }),
                        l && setTimeout(w, 0));
                    }
                  : void 0,
                onMouseOver: O
                  ? function (e) {
                      if (!r) {
                        y("mouse"),
                          null === s ||
                            void 0 === s ||
                            s(n, { toggle: !1, selectedVia: "mouse" });
                        var t = e.target;
                        t.tagName &&
                          "path" !== t.tagName.toLowerCase() &&
                          setTimeout(m, 0);
                      }
                    }
                  : void 0,
              }
            ),
            n.title,
            r &&
              (function () {
                var e = E();
                return e && cn.createPortal(o.createElement(tn, null), e);
              })()
          );
        }),
        nr = en({
          getTriggerNode: function (e) {
            return e.getTriggerNode();
          },
          getMenuNode: function (e) {
            return e.getMenuNode();
          },
          onMouseLeave: function (e, t) {
            return e.onMouseLeave(t);
          },
        })(tr),
        rr = function (e) {
          var t = e.querySelector(".js-browse-nav-level-one"),
            n = e.querySelector(".js-header-button");
          return t && n ? (0, At.W)(t).concat(n) : [];
        },
        ir = function (e) {
          var t = e.className,
            n = on(),
            r = (0, an.k)(),
            i = (0, sn.o)(),
            a = r.userSpecificContext.user,
            c = (0, s.QT)(),
            l = c.gettext,
            u = c.locale;
          return (
            a || (t += " ".concat(Dn()["placeholder-header-button"])),
            o.createElement(
              Rn,
              {
                trigger: (function () {
                  if (!a)
                    return o.createElement(
                      "div",
                      { className: Dn()["placeholder-header-button"] },
                      l("Categories")
                    );
                  var e =
                      a.consumer_subscription_active ||
                      (null === a || void 0 === a
                        ? void 0
                        : a.show_updated_pp_and_ub_navigation) ||
                      (null === a || void 0 === a
                        ? void 0
                        : a.show_updated_mx_navigation),
                    t = l("Categories");
                  return (
                    null !== i && void 0 !== i && i.browseNavDropdownText
                      ? (t = i.browseNavDropdownText)
                      : e && (t = l("Explore")),
                    o.createElement(An, null, t)
                  );
                })(),
                className: t,
                componentClass: "nav",
                placement: "bottom-start",
                onFirstOpen: n.loadNavigationCategories.bind(null, u, !!i),
                getFocusCycle: rr,
              },
              o.createElement(er, {
                browseNavStore: n,
                headerStore: r,
                ufbContext: i,
              }),
              o.createElement(tn, null)
            )
          );
        },
        or = n(49218),
        ar = n(65982),
        sr = n(13133),
        cr = n(31209);
      function lr(e, t) {
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
      var ur =
          ((yn = _.LO.ref),
          (_n = _.LO.ref),
          (En = _.LO.ref),
          (wn = _.LO.ref),
          (On = (function () {
            function e(t, n, r) {
              var i = this;
              (0, h.Z)(this, e);
              var o = this,
                a =
                  arguments.length > 3 &&
                  void 0 !== arguments[3] &&
                  arguments[3];
              (this.gettext = t),
                (this.locale = n),
                (this.navigation_locale = r),
                (this.isUFB = a),
                (this._localStorage = void 0),
                (this._debouncedLoadTopics = void 0),
                (0, b.Z)(this, "navigationCategories", Sn, this),
                (this._topics = _.LO.map({}, { deep: !1 })),
                (0, b.Z)(this, "selectedLevelOneItem", kn, this),
                (0, b.Z)(this, "selectedLevelTwoItem", Cn, this),
                (0, b.Z)(this, "selectedLevelThreeItem", xn, this),
                (this.commonAppContext = void 0),
                (this.loadNavigationCategories = (function () {
                  var e = (0, te.Z)(
                    re().mark(function e(t) {
                      var n,
                        r,
                        i,
                        a,
                        s,
                        c = arguments;
                      return re().wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              if (
                                ((n = c.length > 1 && void 0 !== c[1] && c[1]),
                                o.commonAppContext)
                              ) {
                                e.next = 5;
                                break;
                              }
                              return (e.next = 4), (0, Ht.v)(t, n);
                            case 4:
                              o.commonAppContext = e.sent;
                            case 5:
                              (r = o.commonAppContext),
                                (i = r.data.header),
                                (a = i.user),
                                (s = i.navigationCategories.map(function (e) {
                                  var t = e.sd_tag,
                                    n = e.sublist.items.map(function (e) {
                                      var t = e.sd_tag;
                                      return a.consumer_subscription_active &&
                                        Bt.Cf.includes(t.id)
                                        ? null
                                        : {
                                            id: t.id,
                                            title: t.title,
                                            absolute_url: t.url,
                                            type: qn.UQ.SUBCATEGORY,
                                          };
                                    });
                                  return {
                                    id: t.id,
                                    title: t.title,
                                    absolute_url: t.url,
                                    type: qn.UQ.CATEGORY,
                                    children: n.filter(Boolean),
                                  };
                                })),
                                (0, _.z)(function () {
                                  o.navigationCategories = s;
                                });
                            case 10:
                            case "end":
                              return e.stop();
                          }
                      }, e);
                    })
                  );
                  return function (t) {
                    return e.apply(this, arguments);
                  };
                })()),
                (0, b.Z)(this, "selectLevelOneItem", Nn, this),
                (0, b.Z)(this, "selectLevelTwoItem", Pn, this),
                (0, b.Z)(this, "selectLevelThreeItem", In, this),
                (this.trackSelect = function () {
                  i._trackSelect({ selectedVia: "click" });
                }),
                (0, b.Z)(this, "_loadTopics", Tn, this);
              var s = new Date(Date.now() + 144e5);
              (this._localStorage = (0, or.H)("header-browse-nav", "items", s)),
                (this._debouncedLoadTopics = (0, ar.D)(this._loadTopics, 150));
            }
            return (
              (0, v.Z)(e, [
                {
                  key: "_trackSelect",
                  value: function (e) {
                    if ("click" === e.selectedVia)
                      if (e.learningItemType)
                        we.j.publishEvent(new sr.qf(e.learningItemType));
                      else if (e.badgeItemType)
                        we.j.publishEvent(new sr.FO(e.badgeItemType));
                      else if (this.selectedLevelOneItem) {
                        var t,
                          n,
                          r = {
                            categoryId: this.selectedLevelOneItem.id,
                            subcategoryId:
                              null === (t = this.selectedLevelTwoItem) ||
                              void 0 === t
                                ? void 0
                                : t.id,
                            topicId:
                              null === (n = this.selectedLevelThreeItem) ||
                              void 0 === n
                                ? void 0
                                : n.id,
                          };
                        we.j.publishEvent(new sr.F2({ context: r }));
                      }
                  },
                },
                {
                  key: "_selectItem",
                  value: function (e, t, n) {
                    var r = this,
                      i = (function (e) {
                        for (var t = 1; t < arguments.length; t++) {
                          var n = null != arguments[t] ? arguments[t] : {};
                          t % 2
                            ? lr(Object(n), !0).forEach(function (t) {
                                (0, l.Z)(e, t, n[t]);
                              })
                            : Object.getOwnPropertyDescriptors
                            ? Object.defineProperties(
                                e,
                                Object.getOwnPropertyDescriptors(n)
                              )
                            : lr(Object(n)).forEach(function (t) {
                                Object.defineProperty(
                                  e,
                                  t,
                                  Object.getOwnPropertyDescriptor(n, t)
                                );
                              });
                        }
                        return e;
                      })({ toggle: !0 }, n);
                    Object.values((0, qn.Qm)(this.gettext))
                      .map(function (e) {
                        return e.type;
                      })
                      .includes(t.type)
                      ? (i.learningItemType = t.type)
                      : Object.values(qn.xo)
                          .map(function (e) {
                            return e(r.gettext).type;
                          })
                          .includes(t.type) && (i.badgeItemType = t.type),
                      t === this[e] && i.toggle
                        ? (this[e] = null)
                        : ((this[e] = t), this._trackSelect(i));
                  },
                },
                {
                  key: "getTopics",
                  value: function (e) {
                    return this._topics.get(e.id);
                  },
                },
              ]),
              e
            );
          })()),
          (Sn = (0, y.Z)(On.prototype, "navigationCategories", [yn], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (kn = (0, y.Z)(On.prototype, "selectedLevelOneItem", [_n], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Cn = (0, y.Z)(On.prototype, "selectedLevelTwoItem", [En], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (xn = (0, y.Z)(On.prototype, "selectedLevelThreeItem", [wn], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return null;
            },
          })),
          (Nn = (0, y.Z)(On.prototype, "selectLevelOneItem", [_.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                var n =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {};
                e._selectItem("selectedLevelOneItem", t, n),
                  (e.selectedLevelTwoItem = null),
                  (e.selectedLevelThreeItem = null);
              };
            },
          })),
          (Pn = (0, y.Z)(On.prototype, "selectLevelTwoItem", [_.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                var n =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {};
                e._selectItem("selectedLevelTwoItem", t, n),
                  (e.selectedLevelThreeItem = null),
                  e.selectedLevelTwoItem === t &&
                    t.type === qn.UQ.SUBCATEGORY &&
                    e._debouncedLoadTopics(t, e.isUFB);
              };
            },
          })),
          (In = (0, y.Z)(On.prototype, "selectLevelThreeItem", [_.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                var n =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {};
                e._selectItem("selectedLevelThreeItem", t, n);
              };
            },
          })),
          (Tn = (0, y.Z)(On.prototype, "_loadTopics", [_.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return (function () {
                var t = (0, te.Z)(
                  re().mark(function t(n) {
                    var r,
                      i,
                      o,
                      a,
                      s,
                      c,
                      l,
                      u,
                      d = arguments;
                    return re().wrap(
                      function (t) {
                        for (;;)
                          switch ((t.prev = t.next)) {
                            case 0:
                              if (
                                ((r = d.length > 1 && void 0 !== d[1] && d[1]),
                                e.commonAppContext)
                              ) {
                                t.next = 5;
                                break;
                              }
                              return (t.next = 4), (0, Ht.v)(e.locale, r);
                            case 4:
                              e.commonAppContext = t.sent;
                            case 5:
                              if (
                                ((i = e.commonAppContext),
                                (o = i.data.header.user),
                                !e.getTopics(n))
                              ) {
                                t.next = 9;
                                break;
                              }
                              return t.abrupt("return", Promise.resolve());
                            case 9:
                              if (
                                ((a = o.consumer_subscription_active
                                  ? "PP:".concat(n.id, ":").concat(e.locale)
                                  : "".concat(n.id, ":").concat(e.locale)),
                                !(s = e._localStorage.get(a)))
                              ) {
                                t.next = 14;
                                break;
                              }
                              return (
                                e._topics.set(n.id, (0, _.ZN)(s)),
                                t.abrupt("return", Promise.resolve())
                              );
                            case 14:
                              return (
                                (c = { page_size: 9, locale: e.locale }),
                                e.navigation_locale &&
                                  (c.navigation_locale = e.navigation_locale),
                                (t.prev = 16),
                                (t.next = 19),
                                (0, cr.LI)(n.id, e.locale, 9, r)
                              );
                            case 19:
                              (l = t.sent),
                                (u = l.stats
                                  .map(function (e) {
                                    return {
                                      id: e.id,
                                      absolute_url: e.url,
                                      title: e.title,
                                      type: qn.UQ.TOPIC,
                                    };
                                  })
                                  .filter(function (e) {
                                    var t;
                                    return (
                                      e.title.toLowerCase() !==
                                      (null === (t = n.title) || void 0 === t
                                        ? void 0
                                        : t.toLowerCase())
                                    );
                                  })),
                                e._localStorage.set(a, u),
                                e._topics.set(n.id, u),
                                (t.next = 28);
                              break;
                            case 25:
                              (t.prev = 25),
                                (t.t0 = t.catch(16)),
                                e._topics.set(n.id, []);
                            case 28:
                            case "end":
                              return t.stop();
                          }
                      },
                      t,
                      null,
                      [[16, 25]]
                    );
                  })
                );
                return function (e) {
                  return t.apply(this, arguments);
                };
              })();
            },
          })),
          On),
        dr = ["authParams"];
      function pr(e, t) {
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
      function mr(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? pr(Object(n), !0).forEach(function (t) {
                (0, l.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : pr(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var fr = function (e) {
          var t = e.authParams,
            n = void 0 === t ? {} : t,
            r = (0, d.Z)(e, dr),
            i = (0, c.j5)();
          return (
            (r.componentClass = "a"),
            (r.href = i.toAuth(mr(mr({}, n), {}, { responseType: "html" }))),
            o.createElement(C.zx, Object.assign({ size: "medium" }, r))
          );
        },
        gr = n(347),
        hr = n.n(gr),
        vr = (0, g.Pi)(function (e) {
          var t = e.className,
            n = (0, an.k)(),
            r = (0, sn.o)(),
            i = (0, s.QT)().gettext;
          return n.userSpecificContext.isInstructor
            ? (function () {
                var e;
                return o.createElement(
                  "div",
                  { className: t, "data-purpose": "instructor-dropdown" },
                  o.createElement(
                    An,
                    {
                      componentClass: "a",
                      href: n.urls.TEACH,
                      "data-testid": "instructor-link",
                    },
                    null !==
                      (e =
                        null === r || void 0 === r
                          ? void 0
                          : r.instructorDropdownText) && void 0 !== e
                      ? e
                      : i("Instructor")
                  )
                );
              })()
            : (function () {
                var e, a, s;
                return o.createElement(
                  Rn,
                  {
                    className: t,
                    a11yRole: "description",
                    trigger: o.createElement(
                      An,
                      {
                        componentClass: "a",
                        href: n.urls.TEACH,
                        "data-purpose": "instructor-dropdown",
                        "data-testid": "teach-on-udemy-link",
                      },
                      null !==
                        (e =
                          null === r || void 0 === r
                            ? void 0
                            : r.prospectiveInstructorDropdownText) &&
                        void 0 !== e
                        ? e
                        : i("Teach on Udemy")
                    ),
                  },
                  o.createElement(
                    Ln,
                    null,
                    o.createElement(
                      "div",
                      { className: hr().panel },
                      o.createElement(
                        "div",
                        {
                          className: "ud-heading-lg ".concat(
                            hr()["gap-bottom"]
                          ),
                        },
                        null !==
                          (a =
                            null === r || void 0 === r
                              ? void 0
                              : r.prospectiveInstructorHeadline) && void 0 !== a
                          ? a
                          : i(
                              "Turn what you know into an opportunity and reach millions around the world."
                            )
                      ),
                      o.createElement(
                        C.zx,
                        {
                          componentClass: "a",
                          href: n.urls.TEACH,
                          className: hr().cta,
                          "data-testid": "learn-more-link",
                        },
                        null !==
                          (s =
                            null === r || void 0 === r
                              ? void 0
                              : r.prospectiveInstructorCTAText) && void 0 !== s
                          ? s
                          : i("Learn more")
                      )
                    )
                  )
                );
              })();
        });
      function br() {
        var e = o.useContext(Wt.p);
        if (null === e || void 0 === e || !e.myLearningStore)
          throw new Error("myLearningStore is not set in HeaderContext");
        return e.myLearningStore;
      }
      var yr,
        _r,
        Er,
        wr,
        Or,
        Sr,
        kr,
        Cr = n(58111),
        xr = n(17590),
        Nr = (0, g.Pi)(function () {
          var e = (0, an.k)(),
            t = br(),
            n = (0, s.QT)(),
            r = n.gettext,
            i = n.interpolate,
            a = (0, c.wi)();
          function l(e) {
            var t = e.text,
              n = e.cta;
            return o.createElement(
              "div",
              { className: hr().panel },
              o.createElement(
                "div",
                { className: "ud-heading-lg ".concat(hr()["gap-bottom"]) },
                t
              ),
              o.createElement(
                C.zx,
                {
                  componentClass: "a",
                  href: n.url,
                  udStyle: "secondary",
                  className: hr().cta,
                },
                n.text
              )
            );
          }
          function u(e) {
            var t = e.text,
              n = e.link;
            return o.createElement(
              "div",
              { className: hr()["section-heading"] },
              o.createElement(
                "div",
                {
                  className: "ud-heading-lg ".concat(
                    hr()["section-heading-title"]
                  ),
                },
                t
              ),
              o.createElement(
                "a",
                {
                  className: "ud-heading-sm ".concat(
                    hr()["section-heading-link"]
                  ),
                  href: n.url,
                },
                n.text
              )
            );
          }
          function d(e) {
            var t = { key: e.id, program: e, className: hr().item };
            return o.createElement(xr.yt, t);
          }
          function p(e) {
            return o.createElement(Cr.YB, {
              key: e.id,
              course: e,
              className: hr().item,
            });
          }
          var m = e.userSpecificContext.user,
            f = t.isLoading,
            g = t.courses,
            h = t.programs;
          if (f)
            return o.createElement(
              "div",
              { className: hr().panel, "data-testid": "my-learning-skeleton" },
              o.createElement(Cr.dS, {
                size: "compact",
                cardCountPerRow: 1,
                rowCount: 2,
              })
            );
          var v = m.sms_subscriptions_active
            ? (function (t, n) {
                var i = e.userSpecificContext.user,
                  a = {
                    url: xr.Zi,
                    text: r("View all IT Certification Programs"),
                  };
                return {
                  programSection: o.createElement(
                    o.Fragment,
                    null,
                    (n.length > 0 || t.length > 0) &&
                      u({
                        text: r("Programs"),
                        link: {
                          text: r("My programs"),
                          url: e.urls.MY_PROGRAMS,
                        },
                      }),
                    0 === n.length &&
                      l({
                        text: r(
                          "You\u2019re not enrolled in any programs yet."
                        ),
                        cta: a,
                      }),
                    n.length > 0 && n.map(d),
                    n.length > 0 &&
                      o.createElement(
                        "a",
                        {
                          href: a.url,
                          className: "ud-heading-sm "
                            .concat(hr().cta, " ")
                            .concat(hr().item),
                          style: { display: "block", textAlign: "center" },
                        },
                        a.text
                      )
                  ),
                  courseSection:
                    t.length > 0 &&
                    o.createElement(
                      o.Fragment,
                      null,
                      u({
                        text: r("Courses"),
                        link: i.consumer_subscription_active
                          ? {
                              text: r("My learning"),
                              url: e.urls.PREMIUM_COURSES,
                            }
                          : { text: r("My courses"), url: e.urls.MY_COURSES },
                      }),
                      t.slice(0, 2).map(p)
                    ),
                };
              })(g, h)
            : (function (t) {
                var n = e.userSpecificContext.user;
                return {
                  courseSection:
                    0 === t.length
                      ? l({
                          text: n.consumer_subscription_active
                            ? r("Start learning today.")
                            : i(
                                r(
                                  "Start learning from over %(count)s courses today."
                                ),
                                { count: a.getNumericSiteStat("num_courses") },
                                !0
                              ),
                          cta: { url: e.urls.BROWSE, text: r("Browse now") },
                        })
                      : o.createElement(
                          o.Fragment,
                          null,
                          n.consumer_subscription_active &&
                            u({
                              text: r("Courses"),
                              link: {
                                text: r("My learning"),
                                url: e.urls.PREMIUM_COURSES,
                              },
                            }),
                          t.map(p)
                        ),
                };
              })(g);
          return o.createElement(
            o.Fragment,
            null,
            null === v || void 0 === v ? void 0 : v.programSection,
            v.courseSection,
            (g.length > 0 || h.length > 0) &&
              o.createElement(
                "div",
                { className: hr().item },
                o.createElement(
                  C.zx,
                  {
                    componentClass: "a",
                    href: m.consumer_subscription_active
                      ? e.urls.PREMIUM_COURSES
                      : e.urls.MY_LEARNING,
                    udStyle: "primary",
                    className: hr().cta,
                  },
                  (function (e) {
                    return { TEXT: e("Go to My learning") };
                  })(r).TEXT
                )
              )
          );
        }),
        Pr = (0, g.Pi)(function (e) {
          var t = e.className,
            n = void 0 === t ? "" : t,
            r = (0, an.k)(),
            i = br(),
            a = (0, s.QT)().gettext;
          return o.createElement(
            Rn,
            {
              trigger: o.createElement(
                An,
                {
                  componentClass: "a",
                  href: r.urls.MY_LEARNING,
                  "data-testid": "my-courses",
                },
                a("My learning")
              ),
              className: n,
              onFirstOpen: i.loadMyLearningContent,
            },
            o.createElement(Ln, null, o.createElement(Nr, null))
          );
        });
      function Ir() {}
      var Tr =
          ((yr = _.LO.ref),
          (_r = _.LO.ref),
          (Er = (function () {
            function e(t) {
              (0, h.Z)(this, e),
                (0, b.Z)(this, "isLoading", wr, this),
                (0, b.Z)(this, "courses", Or, this),
                (0, b.Z)(this, "programs", Sr, this),
                (this.headerStore = void 0),
                (this.programEnrollmentStore = void 0),
                (this.loadPromise = void 0),
                (0, b.Z)(this, "loadMyLearningContent", kr, this),
                (this.headerStore = t),
                (this.programEnrollmentStore = new xr.aC());
            }
            return (
              (0, v.Z)(e, [
                {
                  key: "user",
                  get: function () {
                    return this.headerStore.userSpecificContext.user;
                  },
                },
                {
                  key: "loadPrograms",
                  value: function () {
                    var e = this;
                    return this.user.sms_subscriptions_active
                      ? this.programEnrollmentStore
                          .queryProgramEnrollments(xr.Z0.PROGRAM_ENROLLMENTS)
                          .then(function () {
                            return e.programEnrollmentStore.programCardData.slice(
                              0,
                              2
                            );
                          })
                          .catch(Ir)
                      : Promise.resolve();
                  },
                },
                {
                  key: "loadCourses",
                  value: function () {
                    var e = this.user.consumer_subscription_active
                        ? "/users/me/subscription-course-enrollments/"
                        : "/users/me/subscribed-courses/",
                      t = {
                        page_size: 4,
                        ordering: "-last_accessed",
                        "fields[course]":
                          "image_240x135,title,completion_ratio",
                      };
                    return (
                      this.user.consumer_subscription_active ||
                        (t.is_archived = !1),
                      G.uh.get(e, { params: t }).catch(Ir)
                    );
                  },
                },
              ]),
              e
            );
          })()),
          (wr = (0, y.Z)(Er.prototype, "isLoading", [_.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !0;
            },
          })),
          (Or = (0, y.Z)(Er.prototype, "courses", [yr], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (Sr = (0, y.Z)(Er.prototype, "programs", [_r], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (kr = (0, y.Z)(Er.prototype, "loadMyLearningContent", [_.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                return (
                  e.loadPromise ||
                    (e.loadPromise = (0, _.gx)(function () {
                      return !!e.user;
                    })
                      .then(function () {
                        return Promise.all([e.loadPrograms(), e.loadCourses()]);
                      })
                      .then(
                        (0, _.aD)(function (t) {
                          var n = (0, u.Z)(t, 2),
                            r = n[0],
                            i = n[1];
                          r && (e.programs = r),
                            i && (e.courses = i.data.results || []),
                            (e.isLoading = !1);
                        })
                      )
                      .catch(
                        (0, _.aD)(function () {
                          e.isLoading = !1;
                        })
                      )),
                  e.loadPromise
                );
              };
            },
          })),
          Er),
        Zr = n(1734),
        Rr = n.n(Zr),
        Ar = n(62032);
      function Lr() {
        var e = o.useContext(Wt.p);
        if (null === e || void 0 === e || !e.activityNotificationsStore)
          throw new Error(
            "activitiyNotificationsStore is not set in HeaderContext"
          );
        return e.activityNotificationsStore;
      }
      var jr = n(64368),
        Dr = n.n(jr),
        Mr = n(98423),
        zr = n(26230),
        Ur = n.n(zr),
        Fr = ["className", "notification", "tabName"],
        Br = (0, g.Pi)(function (e) {
          var t = e.className,
            n = void 0 === t ? "" : t,
            r = e.notification,
            i = e.tabName,
            a = (0, d.Z)(e, Fr),
            c = Lr(),
            l = (0, s.QT)().gettext;
          return o.createElement(
            B.qg,
            { className: n, "data-testid": "notification-item" },
            o.createElement(
              B.qg.ImageWrapper,
              null,
              o.createElement(x.q, {
                user: r.mainActivity.actor,
                srcKey: "image_100x100",
                alt: "NONE",
              })
            ),
            o.createElement(
              "div",
              { className: Ur()["notification-info"] },
              o.createElement(
                B.qg.Title,
                Object.assign(
                  {
                    className: "ud-heading-sm ".concat(
                      Ur()["notification-title"]
                    ),
                  },
                  a,
                  {
                    href: r.targetURL,
                    onClick: function () {
                      r.isRead ||
                        null === c ||
                        void 0 === c ||
                        c.markNotificationAsRead(r, i);
                    },
                  }
                ),
                o.createElement(
                  "span",
                  (0, W.S)({
                    descriptionOfCaller:
                      "notification-item:notification-template",
                    html: r.template,
                  })
                )
              ),
              o.createElement(
                "div",
                {
                  className: "ud-text-sm ".concat(
                    Ur()["notification-timestamp"]
                  ),
                },
                o.createElement(T, { datetime: r.mainActivity.timestamp })
              ),
              !r.isRead &&
                o.createElement(U.C, {
                  label: l("This notification is not read"),
                  className: Ur()["unread-dot"],
                  "data-testid": "notification-badge",
                })
            )
          );
        }),
        Wr = function () {
          return o.createElement(
            "div",
            {
              className: "".concat(hr().panel, " ").concat(Dr().panel),
              "data-testid": "notification-items-skeleton",
            },
            o.createElement(Mr.u, {
              size: "small",
              style: {
                width: "32.8rem",
                maxWidth: "32.8rem",
                minWidth: "32.8rem",
              },
              imageStyle: {
                width: "6.4rem",
                height: "6.4rem",
                borderRadius: "50%",
              },
              lineCount: 3,
              cardCountPerRow: 1,
              rowCount: 2,
            })
          );
        },
        Hr = function () {
          var e = (0, s.QT)().gettext;
          return o.createElement(
            "div",
            {
              className: "ud-text-md "
                .concat(hr().panel, " ")
                .concat(hr()["no-items"], " ")
                .concat(Dr().panel),
            },
            e("No notifications.")
          );
        },
        Qr = (0, g.Pi)(function (e) {
          var t = e.tabName,
            n = (0, an.k)(),
            r = Lr(),
            i = (0, s.QT)().gettext,
            a = r[t];
          function c() {
            (null === a || void 0 === a ? void 0 : a.unreadActivitiesCount) >
              0 && r.markAllNotificationsAsRead(t);
          }
          if ("LOADED" !== a.loadingState) return o.createElement(Wr, null);
          if (0 === a.totalActivitiesCount) return o.createElement(Hr, null);
          var l = a.notifications.slice(0, 3);
          return o.createElement(
            o.Fragment,
            null,
            l.map(function (e) {
              return o.createElement(Br, {
                key: e.mainActivity.id,
                notification: e,
                tabName: t,
                className: hr().item,
              });
            }),
            o.createElement(
              "div",
              { className: hr().footer },
              o.createElement(
                "div",
                { className: Dr()["footer-btns"] },
                o.createElement(
                  "div",
                  { className: Dr()["footer-btn-wrapper"] },
                  o.createElement(
                    C.zx,
                    {
                      disabled: 0 === a.unreadActivitiesCount,
                      onClick: c,
                      udStyle: "ghost",
                      className: hr().cta,
                      "data-testid": "mark-all-notifications-as-read",
                    },
                    i("Mark all as read")
                  )
                ),
                o.createElement(
                  "div",
                  { className: Dr()["footer-btn-wrapper"] },
                  o.createElement(
                    C.zx,
                    {
                      componentClass: "a",
                      href: n.urls.VIEW_NOTIFICATIONS,
                      udStyle: "secondary",
                      className: hr().cta,
                      "data-testid": "see-all-notifications",
                    },
                    i("See all")
                  )
                )
              )
            )
          );
        }),
        Vr = (0, g.Pi)(function () {
          var e = (0, an.k)(),
            t = (0, s.QT)().gettext;
          return o.createElement(
            "div",
            {
              className: ""
                .concat(hr()["section-heading"], " ")
                .concat(hr()["gap-bottom"]),
            },
            o.createElement(
              "div",
              {
                className: "ud-heading-lg ".concat(
                  hr()["section-heading-title"]
                ),
              },
              t("Notifications")
            ),
            e.userSpecificContext.user &&
              o.createElement(
                "a",
                {
                  className: "ud-heading-sm ".concat(
                    hr()["section-heading-link"]
                  ),
                  href: e.urls.EDIT_NOTIFICATIONS,
                },
                t("Settings")
              )
          );
        }),
        qr = (0, g.Pi)(function () {
          var e,
            t = Lr(),
            n = (0, s.QT)(),
            r = n.gettext,
            i = n.locale,
            a = t,
            c = Object.keys(Y).filter(function (e) {
              return a[e];
            });
          return (
            (e =
              a.user && 0 === c.length
                ? o.createElement(Hr, null)
                : a.user && 1 === c.length
                ? o.createElement(Qr, { tabName: a.activeTabName })
                : a.user && a.activeTabName
                ? o.createElement(
                    oe.m,
                    { fullWidth: !0, size: "small" },
                    c.map(function (e) {
                      var t = a[e],
                        n = t.loadingState,
                        c = t.unreadActivitiesCount,
                        l = r("Instructor"),
                        u = r("Student"),
                        d = "instructor" === e ? l : u;
                      return (
                        "LOADED" === n &&
                          c > 0 &&
                          (d = "".concat(d, " (").concat((0, s.uf)(c, i), ")")),
                        o.createElement(
                          oe.m.Tab,
                          { key: e, title: d },
                          o.createElement(Qr, { tabName: e })
                        )
                      );
                    })
                  )
                : o.createElement(Wr, null)),
            o.createElement(
              "div",
              { className: Dr()["notification-items"] },
              o.createElement(Vr, null),
              e
            )
          );
        }),
        Gr = (0, g.Pi)(function (e) {
          var t = e.className,
            n = Lr(),
            r = (0, an.k)(),
            i = (0, s.QT)().gettext,
            a = o.createElement(Ar._T, {
              dot: !0,
              className: pn()["dropdown-dot-badge"],
            });
          return o.createElement(
            Rn,
            {
              trigger: o.createElement(
                An,
                {
                  componentClass: "a",
                  href: r.urls.VIEW_NOTIFICATIONS,
                  udStyle: "icon",
                  overlaychildren: a,
                },
                o.createElement(Rr(), {
                  color: "neutral",
                  label: i("Notifications"),
                })
              ),
              className: t,
              onFirstOpen: n.initializeNotifications,
            },
            o.createElement(Ln, null, o.createElement(qr, null))
          );
        }),
        Xr = n(99215),
        Yr = n.n(Xr),
        Kr = n(98173),
        Jr = n(43069),
        $r = n(7536),
        ei = n(88309),
        ti = n(45160),
        ni = n(39865),
        ri = n(82078),
        ii = n(23554),
        oi = n(41293),
        ai = n(65125),
        si = n(95101),
        ci = n.n(si),
        li = ["trackImpressionFunc"];
      function ui(e, t) {
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
      function di(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? ui(Object(n), !0).forEach(function (t) {
                (0, l.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : ui(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var pi = function (e) {
          var t,
            n = e.className,
            r = e.item,
            i = e.trackingContext,
            a = (0, c.gL)().Config,
            s = function () {
              if (r.buyable && "course" === r.buyable.buyable_object_type) {
                var e,
                  t,
                  n,
                  i = r.buyable;
                (0, ri.g)({
                  courseId: i.id,
                  courseTrackingId:
                    null !==
                      (e =
                        null !==
                          (t =
                            null !== (n = i.frontendTrackingId) && void 0 !== n
                              ? n
                              : i.tracking_id) && void 0 !== t
                          ? t
                          : i.trackingId) && void 0 !== e
                      ? e
                      : String(i.id),
                  componentName: "shoppingItem",
                });
              }
            },
            l = {
              discountPrice: r.purchase_price.amount,
              discountPriceString: r.purchase_price.price_string,
              listPrice: r.list_price.amount,
              listPriceString: r.list_price.price_string,
            };
          return o.createElement(
            ii.H,
            {
              trackFunc: function () {
                if (
                  i &&
                  r.buyable &&
                  "course" === r.buyable.buyable_object_type
                ) {
                  var e = i.trackImpressionFunc,
                    t = (0, d.Z)(i, li);
                  e({ item: r.buyable }, t);
                }
              },
            },
            o.createElement(
              B.qg,
              {
                className: n,
                onContextMenu: s,
                "data-testid": "shopping-item",
              },
              o.createElement(
                B.qg.ImageWrapper,
                null,
                o.createElement(oi.E, {
                  src: r.buyable.image_100x100,
                  alt: "",
                  width: 100,
                  height: 100,
                })
              ),
              o.createElement(
                "div",
                { className: ci()["buyable-info"] },
                o.createElement(
                  B.qg.Title,
                  {
                    className: "ud-heading-sm ".concat(ci()["buyable-title"]),
                    href: r.buyable.url,
                    onClick: s,
                  },
                  r.buyable.title
                ),
                o.createElement(
                  "div",
                  {
                    className: "ud-text-xs ".concat(
                      ci()["buyable-instructors"]
                    ),
                  },
                  (null !== (t = r.buyable.visible_instructors) && void 0 !== t
                    ? t
                    : []
                  )
                    .map(function (e) {
                      return e.title;
                    })
                    .join(", ")
                ),
                o.createElement(
                  ai.E,
                  Object.assign(
                    {
                      discountPriceClassName: "ud-heading-sm",
                      listPriceClassName: "ud-text-xs",
                      onView: function () {
                        (0, ni.c1)(
                          di(
                            di({}, l),
                            {},
                            {
                              currency: a.price_country.currency,
                              trackingEventContext: {
                                buyableId: r.buyable.id,
                                priceType: Bt.Pi.individual_shopping_buyable,
                                buyableType: r.buyable.type,
                                priceServeTrackingId: r.price_serve_tracking_id,
                              },
                            }
                          )
                        );
                      },
                    },
                    l
                  )
                )
              )
            )
          );
        },
        mi = n(65550),
        fi = n.n(mi);
      function gi(e, t) {
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
      function hi(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? gi(Object(n), !0).forEach(function (t) {
                (0, l.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : gi(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var vi = (0, g.Pi)(function (e) {
          var t,
            n,
            r = e.shoppingClient,
            i = e.shoppingList,
            a = e.cta,
            u = e.scroll,
            d = e.zeroState,
            p = e.showAddToCart,
            m = e.showTotal,
            g = void 0 === m || m,
            h = (0, s.QT)().gettext,
            v = (0, c.gL)().Config,
            b = {
              discountPrice: Math.max(
                (null !==
                  (t =
                    null === i || void 0 === i
                      ? void 0
                      : i.purchasePriceAmount) && void 0 !== t
                  ? t
                  : 0) - r.credit.amount,
                0
              ),
              listPrice:
                null !==
                  (n =
                    null === i || void 0 === i ? void 0 : i.listPriceAmount) &&
                void 0 !== n
                  ? n
                  : 0,
            },
            y = function () {
              (0, ni.c1)(
                hi(
                  hi({}, b),
                  {},
                  {
                    currency: v.price_country.currency,
                    trackingEventContext: { priceType: Bt.Pi.total },
                  }
                )
              );
            },
            _ = function () {
              return (
                r.credit.amount > 0 &&
                o.createElement(
                  "div",
                  { className: fi().credit },
                  o.createElement("span", null, h("Credit balance")),
                  o.createElement("span", null, (0, ti.xG)(r.credit.amount))
                )
              );
            };
          if (!i)
            return o.createElement(
              "div",
              { className: hr().panel },
              o.createElement(Mr.u, {
                size: "small",
                style: {
                  width: "25.6rem",
                  maxWidth: "25.6rem",
                  minWidth: "25.6rem",
                },
                imageStyle: { width: "6.4rem", height: "6.4rem" },
                lineCount: 3,
                cardCountPerRow: 1,
                rowCount: 2,
                "data-testid": "skeleton",
              })
            );
          if (i.isEmpty)
            return o.createElement(
              o.Fragment,
              null,
              (function () {
                var e = d.cta,
                  t = d.text;
                return o.createElement(
                  "div",
                  { className: hr().panel },
                  o.createElement(
                    "div",
                    {
                      className: "ud-text-md "
                        .concat(hr()["gap-bottom"], " ")
                        .concat(hr()["no-items"]),
                    },
                    t
                  ),
                  o.createElement(
                    "a",
                    {
                      className: "ud-heading-sm",
                      "data-testid": "header-shopping-cta",
                      href: e.url,
                    },
                    e.text
                  )
                );
              })(),
              _()
            );
          var E = [],
            w = 0;
          ni.Qt.forEach(function (e) {
            var t = [];
            null === i ||
              void 0 === i ||
              i.items.forEach(function (n) {
                n.buyable.buyable_object_type === e.type &&
                  t.push.apply(t, (0, Mn.Z)(e.buildShoppingItems(n)));
              }),
              E.push(t),
              (w += t.length);
          });
          var O = w > u.itemCount;
          return o.createElement(
            o.Fragment,
            null,
            o.createElement(
              "div",
              {
                className: f()((0, l.Z)({}, fi().scrollable, O)),
                style: { maxHeight: u.maxHeight },
              },
              E.map(function (e, t) {
                return (function (e, t) {
                  return o.createElement(
                    o.Fragment,
                    { key: t },
                    e.map(function (e, t) {
                      var n = {
                        trackImpressionFunc: Kr.RT.trackDiscoveryImpression,
                        index: t,
                        backendSource:
                          Kr.YV.backendSourceOptions.SHOPPING_CARTS,
                      };
                      return p && e.list_price.amount > 0
                        ? o.createElement(
                            "div",
                            {
                              key: t,
                              className: ""
                                .concat(hr().item, " ")
                                .concat(fi()["item-wrapper"]),
                            },
                            o.createElement(pi, {
                              item: e,
                              trackingContext: n,
                            }),
                            o.createElement(Jr.d6, {
                              allowAddToCartSuccessModal: !1,
                              buttonClass: C.zx,
                              buttonStyleProps: {
                                udStyle: "secondary",
                                size: "medium",
                              },
                              buyables: [e.buyable],
                              cartButtonTextAdd: h("Add to cart"),
                              loader: o.createElement(ie.a, {
                                color: "inherit",
                                size: "medium",
                              }),
                              notificationStyle: "ud-heading-sm",
                              shoppingClient: r,
                            })
                          )
                        : o.createElement(pi, {
                            key: t,
                            item: e,
                            className: hr().item,
                            trackingContext: n,
                          });
                    })
                  );
                })(e, t);
              })
            ),
            (function (e) {
              var t = ei.N.global.location.pathname !== a.url;
              return g || t
                ? o.createElement(
                    "div",
                    {
                      className: f()(
                        hr().footer,
                        (0, l.Z)({}, fi()["sticky-footer"], e)
                      ),
                    },
                    g &&
                      i &&
                      o.createElement(
                        "div",
                        {
                          className: "ud-heading-lg ".concat(fi().total),
                          "data-testid": "header-shopping-total",
                        },
                        o.createElement("div", null, h("Total:"), "\xa0"),
                        o.createElement(
                          $r.k,
                          Object.assign(
                            {
                              discountPriceClassName: "ud-heading-lg",
                              listPriceClassName: "ud-text-md",
                              onView: y,
                            },
                            b
                          )
                        )
                      ),
                    t &&
                      o.createElement(
                        C.zx,
                        {
                          componentClass: "a",
                          "data-testid": "header-shopping-cta",
                          href: a.url,
                          udStyle: "primary",
                          className: hr().cta,
                        },
                        a.text
                      )
                  )
                : null;
            })(O),
            _()
          );
        }),
        bi = (0, g.Pi)(function (e) {
          var t = e.className,
            n = (0, an.k)(),
            r = (0, s.QT)(),
            i = r.gettext,
            a = r.ngettext,
            c = r.interpolate,
            l = o.useState(),
            d = (0, u.Z)(l, 2),
            p = d[0],
            m = d[1],
            f = o.createElement(Ar.HT, {
              className: pn()["dropdown-counter-badge"],
            }),
            g = n.urls,
            h = { text: i("Go to cart"), url: g.CART },
            v = {
              text: i("Your cart is empty."),
              cta: { text: i("Keep shopping"), url: g.BROWSE },
            };
          return o.createElement(
            Rn,
            {
              trigger: o.createElement(
                An,
                {
                  componentClass: "a",
                  href: g.CART,
                  udStyle: "icon",
                  overlaychildren: f,
                  "data-testid": "cart-icon",
                },
                o.createElement(Yr(), {
                  color: "neutral",
                  label: c(
                    a(
                      "Shopping cart with %(cartCount)s item",
                      "Shopping cart with %(cartCount)s items",
                      n.notificationBadgeContext.cartBuyables
                    ),
                    { cartCount: n.notificationBadgeContext.cartBuyables },
                    !0
                  ),
                })
              ),
              className: t,
              onFirstOpen: function () {
                m(n.shoppingClient.lists.cart);
              },
            },
            o.createElement(
              Ln,
              null,
              o.createElement(vi, {
                shoppingClient: n.shoppingClient,
                shoppingList: p,
                cta: h,
                zeroState: v,
                scroll: { itemCount: 3, maxHeight: "48.8rem" },
              })
            )
          );
        }),
        yi = n(53668),
        _i = n.n(yi),
        Ei = {
          fill: "transparent",
          padding: "1px",
          stroke: "currentColor",
          strokeWidth: "2",
        },
        wi = function (e) {
          return o.createElement(
            _i(),
            Object.assign({ label: !1 }, e, { style: Ei })
          );
        };
      wi.$$udType = "Icon";
      var Oi = (0, g.Pi)(function (e) {
          var t = e.className,
            n = (0, an.k)(),
            r = (0, s.QT)().gettext,
            i = o.useState(),
            a = (0, u.Z)(i, 2),
            c = a[0],
            l = a[1],
            d = n.urls,
            p = { text: r("Go to wishlist"), url: d.WISHLIST },
            m = {
              text: r("Your wishlist is empty."),
              cta: { text: r("Explore courses"), url: d.BROWSE },
            };
          return o.createElement(
            Rn,
            {
              trigger: o.createElement(
                An,
                {
                  componentClass: "a",
                  href: d.WISHLIST,
                  udStyle: "icon",
                  "data-purpose": "wishlist-icon",
                },
                o.createElement(wi, { color: "neutral", label: r("Wishlist") })
              ),
              className: t,
              onFirstOpen: function () {
                var e = n.shoppingClient.lists.wishlist;
                (0, Kr.qX)(
                  e.items.map(function (e) {
                    return e.buyable;
                  })
                ),
                  l(e);
              },
            },
            o.createElement(
              Ln,
              null,
              o.createElement(vi, {
                shoppingClient: n.shoppingClient,
                shoppingList: c,
                cta: p,
                zeroState: m,
                scroll: { itemCount: 2, maxHeight: "50.8rem" },
                showAddToCart: !0,
                showTotal: !1,
              })
            )
          );
        }),
        Si = (0, g.Pi)(function (e) {
          var t = e.className,
            n = (0, an.k)(),
            r = (0, c.gL)().Config,
            i = (0, s.QT)(),
            a = i.gettext,
            l = i.interpolate,
            u = i.locale,
            d = (0, c.wi)(),
            p = function () {
              var e;
              n.tryUFBPlacements &&
                we.j.publishEvent(
                  new Kr.Nj({
                    locale: u,
                    placement:
                      null === (e = n.tryUFBPlacements) || void 0 === e
                        ? void 0
                        : e.bar,
                    variant: n.userSpecificContext.ufbHookVariant,
                    url: n.userSpecificContext.productLink.url,
                  })
                );
            },
            m = l(
              a(
                "Get your team access to over %(count)s top Udemy courses, anytime, anywhere."
              ),
              { count: d.getOrgNumericSiteStat("num_courses") },
              !0
            ),
            f = l(
              a("Try %(product)s"),
              { product: n.userSpecificContext.productLink.text },
              !0
            ),
            g = n.userSpecificContext.productLink;
          return r.brand.has_organization
            ? null
            : o.createElement(
                Rn,
                {
                  className: t,
                  a11yRole: "description",
                  trigger: o.createElement(
                    An,
                    {
                      componentClass: "a",
                      "data-purpose": "try-ufb-dropdown-trigger",
                      href: g.url,
                      target: g.isOnsiteRequestDemo ? void 0 : "_blank",
                      rel: g.isOnsiteRequestDemo ? void 0 : "noopener",
                      onClick: p,
                    },
                    a("Udemy Business")
                  ),
                },
                o.createElement(
                  Ln,
                  null,
                  o.createElement(
                    "div",
                    { className: hr().panel },
                    o.createElement(
                      "div",
                      {
                        className: "ud-heading-lg ".concat(hr()["gap-bottom"]),
                        "data-purpose": "hook-text",
                      },
                      m
                    ),
                    o.createElement(
                      C.zx,
                      {
                        componentClass: "a",
                        "data-purpose": "try-ufb-button",
                        href: g.url,
                        className: hr().cta,
                        target: g.isOnsiteRequestDemo ? void 0 : "_blank",
                        rel: g.isOnsiteRequestDemo ? void 0 : "noopener",
                        onClick: p,
                      },
                      f
                    )
                  )
                )
              );
        }),
        ki = n(97022),
        Ci = n.n(ki),
        xi = n(80344),
        Ni = n(76905),
        Pi = n(87941),
        Ii = n.n(Pi),
        Ti = function (e) {
          var t = (0, c.gL)().Config,
            n = (0, s.QT)(),
            r = n.gettext,
            i = n.locale,
            a = o.useMemo(
              function () {
                var e = t.supported_languages.find(function (e) {
                  return e.locale === i;
                });
                return (null === e || void 0 === e ? void 0 : e.name) || null;
              },
              [i, t.supported_languages]
            );
          return o.createElement(
            Hn.W.Item,
            Object.assign(
              {
                componentClass: "button",
                color: "neutral",
                icon: o.createElement(fe(), { label: !1, size: "small" }),
              },
              e
            ),
            o.createElement(
              "div",
              { className: Ii()["item-content"] },
              o.createElement("span", null, r("Language")),
              o.createElement(
                "span",
                { className: Ii()["current-language"] },
                a
              )
            )
          );
        },
        Zi = n(69785),
        Ri = n.n(Zi),
        Ai = (0, g.Pi)(function (e) {
          var t,
            n,
            r = e.className,
            i = e.useLangPrefixedUrls,
            a = void 0 !== i && i,
            l = (0, an.k)(),
            u = (0, s.QT)(),
            d = u.gettext,
            p = u.locale,
            m = (0, c.gL)(),
            f = m.Config,
            g = m.me,
            h = function () {
              var e;
              l.tryUFBPlacements &&
                we.j.publishEvent(
                  new Kr.Nj({
                    locale: p,
                    placement:
                      null === (e = l.tryUFBPlacements) || void 0 === e
                        ? void 0
                        : e.profile,
                  })
                );
            },
            v = l.urls,
            b = l.userSpecificContext,
            y = b.user,
            _ = b.isInstructor,
            E =
              g.is_authenticated &&
              (null === (t = g.organization) || void 0 === t
                ? void 0
                : t.is_pro_license_holder) &&
              f.features.organization.is_ub_pro_onboarding_v2_enabled;
          return o.createElement(
            Rn,
            {
              trigger: o.createElement(
                An,
                {
                  componentClass: "a",
                  href: v.EDIT_PROFILE,
                  udStyle: "image",
                  "aria-label": d("My profile"),
                  "data-purpose": "user-dropdown",
                },
                o.createElement(x.q, {
                  user: y,
                  alt: "NONE",
                  size: "small",
                  "aria-hidden": "true",
                  className: Ri()["dropdown-button-avatar"],
                }),
                o.createElement(Ar.bt, {
                  dot: !0,
                  className: pn()["dropdown-dot-badge"],
                })
              ),
              className: "".concat(r, " ").concat(Yn()["list-menu-container"]),
            },
            o.createElement(
              Ln,
              null,
              o.createElement(
                "a",
                {
                  href: v.EDIT_PROFILE,
                  className: E
                    ? Ri()["pro-user-section"]
                    : Ri()["user-section"],
                },
                o.createElement(x.q, {
                  user: y,
                  alt: "NONE",
                  className: Ri()["user-section-avatar"],
                }),
                o.createElement(
                  "div",
                  { className: Ri()["user-details"] },
                  o.createElement(
                    "div",
                    null,
                    o.createElement(
                      "div",
                      { className: "ud-heading-md" },
                      y.display_name
                    ),
                    o.createElement(
                      "div",
                      { className: "ud-text-xs ".concat(Ri().email) },
                      y.email
                    ),
                    E &&
                      o.createElement("div", null, o.createElement(Wn.Z, null))
                  )
                )
              ),
              o.createElement(
                Hn.W,
                {
                  size: "small",
                  className: Yn().section,
                  iconAlignment: "right",
                },
                o.createElement(
                  Hn.W.Item,
                  { color: "neutral", href: v.MY_LEARNING },
                  d("My learning")
                ),
                f.features.shopping_cart &&
                  o.createElement(
                    Hn.W.Item,
                    {
                      color: "neutral",
                      href: v.CART,
                      icon: o.createElement(Ar.HT, null),
                    },
                    d("My cart")
                  ),
                f.features.wishlist &&
                  o.createElement(
                    Hn.W.Item,
                    { color: "neutral", href: v.WISHLIST },
                    d("Wishlist")
                  ),
                f.brand.is_teaching_enabled &&
                  o.createElement(
                    Hn.W.Item,
                    { color: "neutral", href: v.TEACH },
                    d(_ ? "Instructor dashboard" : "Teach on Udemy")
                  )
              ),
              E &&
                o.createElement(
                  Hn.W,
                  {
                    size: "small",
                    className: Yn().section,
                    iconAlignment: "right",
                  },
                  null === (n = l.ufbContext) || void 0 === n
                    ? void 0
                    : n.proFeaturesPopover
                ),
              o.createElement(
                Hn.W,
                {
                  size: "small",
                  className: Yn().section,
                  iconAlignment: "right",
                },
                f.features.notifications &&
                  o.createElement(
                    Hn.W.Item,
                    {
                      color: "neutral",
                      href: v.VIEW_NOTIFICATIONS,
                      icon: o.createElement(Ar._T, null),
                    },
                    d("Notifications")
                  ),
                f.brand.is_messaging_enabled &&
                  o.createElement(
                    Hn.W.Item,
                    {
                      color: "neutral",
                      href: v.MESSAGES,
                      icon: o.createElement(Ar.JJ, null),
                    },
                    d("Messages")
                  )
              ),
              o.createElement(
                Hn.W,
                {
                  size: "small",
                  className: Yn().section,
                  iconAlignment: "right",
                },
                o.createElement(
                  Hn.W.Item,
                  { color: "neutral", href: v.ACCOUNT },
                  d("Account settings")
                ),
                !f.brand.has_organization &&
                  o.createElement(
                    Hn.W.Item,
                    { color: "neutral", href: v.PAYMENT_METHODS },
                    d("Payment methods")
                  ),
                (function () {
                  var e = l.urls,
                    t = l.userSpecificContext;
                  return t.isSubscriptionAware
                    ? o.createElement(
                        Hn.W.Item,
                        { color: "neutral", href: e.SUBSCRIPTION_MANAGEMENT },
                        o.createElement(
                          "div",
                          { className: Ri()["subscription-menu-item"] },
                          d("Subscriptions"),
                          t.user.consumer_subscription_active &&
                            o.createElement(
                              Ni.C,
                              { className: Ri()["badge-personal-plan"] },
                              d("Personal Plan")
                            )
                        )
                      )
                    : null;
                })(),
                !f.brand.has_organization &&
                  o.createElement(
                    Hn.W.Item,
                    {
                      color: "neutral",
                      href: v.CREDITS,
                      icon: o.createElement(Ar.iO, null),
                    },
                    d("Udemy credits")
                  ),
                !f.brand.has_organization &&
                  o.createElement(
                    Hn.W.Item,
                    { color: "neutral", href: v.PURCHASE_HISTORY },
                    d("Purchase history")
                  )
              ),
              o.createElement(
                Hn.W,
                {
                  size: "small",
                  className: Yn().section,
                  iconAlignment: "right",
                },
                o.createElement(Zt.D8, {
                  uiRegion: Bt.Nc.DESKTOP_HEADER,
                  useLangPrefixedUrls: a,
                  trigger: o.createElement(Ti, { className: Yn().item }),
                })
              ),
              o.createElement(
                Hn.W,
                {
                  size: "small",
                  className: Yn().section,
                  iconAlignment: "right",
                },
                !!(
                  f.brand.is_profile_functions_enabled &&
                  f.brand.is_user_profiles_public &&
                  y.url
                ) &&
                  o.createElement(
                    Hn.W.Item,
                    {
                      color: "neutral",
                      href: y.url,
                      target: "_blank",
                      rel: "nofollow noopener noreferrer",
                    },
                    d("Public profile")
                  ),
                o.createElement(
                  Hn.W.Item,
                  { color: "neutral", href: v.EDIT_PROFILE },
                  d("Edit profile")
                )
              ),
              o.createElement(
                Hn.W,
                {
                  size: "small",
                  className: Yn().section,
                  iconAlignment: "right",
                },
                o.createElement(
                  Hn.W.Item,
                  {
                    color: "neutral",
                    href: v.SUPPORT,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  },
                  d("Help")
                ),
                o.createElement(
                  Hn.W.Item,
                  { color: "neutral", href: y.logout_url },
                  d("Log out")
                )
              ),
              (function () {
                var e,
                  t = l.tryUFBPlacements,
                  n = l.userSpecificContext.productLink;
                return f.brand.has_organization
                  ? null
                  : o.createElement(
                      "a",
                      {
                        className: Ri()["try-ufb-section"],
                        href: (0, xi.WV)("request-demo", {
                          ref:
                            null !==
                              (e =
                                null === t || void 0 === t
                                  ? void 0
                                  : t.profile) && void 0 !== e
                              ? e
                              : "",
                        }),
                        target: n.isOnsiteRequestDemo ? void 0 : "_blank",
                        rel: n.isOnsiteRequestDemo
                          ? void 0
                          : "noopener noreferrer",
                        onClick: h,
                      },
                      o.createElement(
                        "div",
                        null,
                        o.createElement(
                          "div",
                          { className: "ud-heading-md" },
                          "Udemy Business"
                        ),
                        o.createElement(
                          "div",
                          {
                            className: "ud-text-sm ".concat(
                              Ri()["try-ufb-subtitle"]
                            ),
                          },
                          d("Bring learning to your company")
                        )
                      ),
                      o.createElement(Ci(), { size: "medium", label: !1 })
                    );
              })()
            )
          );
        }),
        Li = [
          "searchPhrase",
          "persistentSearch",
          "showAutocompletePopularQueriesOnEmptyState",
          "shoppingClient",
          "useLangPrefixedUrls",
          "_mockStores",
        ];
      function ji(e, t) {
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
      function Di(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? ji(Object(n), !0).forEach(function (t) {
                (0, l.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : ji(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var Mi,
        zi,
        Ui,
        Fi,
        Bi,
        Wi,
        Hi = (0, g.Pi)(function (e) {
          var t,
            r,
            i,
            a,
            m = e.searchPhrase,
            g = e.persistentSearch,
            h = e.showAutocompletePopularQueriesOnEmptyState,
            v = void 0 === h ? "disabled" : h,
            b = e.shoppingClient,
            y = e.useLangPrefixedUrls,
            _ = void 0 !== y && y,
            E = e._mockStores,
            w = (0, d.Z)(e, Li),
            O = !!w.ufbContext,
            S = (0, s.QT)(),
            k = S.locale,
            C = (0, c.gL)(),
            x = o.useState(function () {
              var e;
              return null !==
                (e = null === E || void 0 === E ? void 0 : E.headerStore) &&
                void 0 !== e
                ? e
                : new Qt.N(Di(Di({}, w), {}, { shoppingClient: b }));
            }),
            N = (0, u.Z)(x, 1)[0],
            P = o.useState(function () {
              return new ur(
                S.gettext,
                S.locale,
                C.request.navigation_locale,
                O
              );
            }),
            I = (0, u.Z)(P, 1)[0],
            T = o.useState(function () {
              var e = new zt.lJ({
                url: N.urls.SEARCH_SUGGESTIONS,
                getFormParams: function () {
                  return N.formActionParams;
                },
                isPopularQueriesExperimentEnabled: "enabled" === v,
                gettext: S.gettext,
              });
              return e.setInputValue(null !== m && void 0 !== m ? m : ""), e;
            }),
            Z = (0, u.Z)(T, 1)[0],
            R = o.useState(function () {
              return new Tr(N);
            }),
            A = (0, u.Z)(R, 1)[0],
            L = o.useState(function () {
              var e,
                t =
                  null !==
                    (e =
                      null === E || void 0 === E
                        ? void 0
                        : E.activityNotificationsStore) && void 0 !== e
                    ? e
                    : new ee(S);
              return le(t), t;
            }),
            j = (0, u.Z)(L, 1)[0],
            D = o.useState(null),
            M = (0, u.Z)(D, 2),
            z = M[0],
            U = M[1],
            F = o.useState(!1),
            B = (0, u.Z)(F, 2),
            W = B[0],
            H = B[1],
            Q =
              null !==
                (t = (0, pe.ag)(
                  "(max-width: ".concat(
                    Ft.T["breakpoint-header-mobile-max"],
                    ")"
                  )
                )) &&
              void 0 !== t &&
              t;
          function V() {
            var e, t;
            return O &&
              null !== (e = N.userSpecificContext) &&
              void 0 !== e &&
              null !== (t = e.user) &&
              void 0 !== t &&
              t.enable_in_lecture_search_segments
              ? S.gettext("What would you like to learn today?")
              : S.gettext("Search for anything");
          }
          function q() {
            var e = N.userSpecificContext.user;
            return e
              ? e.id
                ? (function () {
                    var e,
                      t,
                      n = N.userSpecificContext.organizationState,
                      r =
                        null !== n && void 0 !== n && n.should_show_manage_menu
                          ? "group-b"
                          : "";
                    return o.createElement(
                      o.Fragment,
                      null,
                      !N.isPersonalPlanSubscriber &&
                        o.createElement(Si, {
                          className: f()(pn()["gap-button"], pn()["group-a"]),
                        }),
                      null === (e = w.ufbContext) || void 0 === e
                        ? void 0
                        : e.packageAlert,
                      C.Config.brand.is_teaching_enabled &&
                        N.showInstructorDropdown &&
                        o.createElement(vr, {
                          className: f()(pn()["gap-button"], pn()["group-b"]),
                        }),
                      null === (t = w.ufbContext) || void 0 === t
                        ? void 0
                        : t.manageDropdown,
                      o.createElement(Pr, {
                        className: f()(pn()["gap-button"], pn()[r]),
                      }),
                      !N.isPersonalPlanSubscriber &&
                        C.Config.features.wishlist &&
                        o.createElement(Oi, { className: pn()["group-c"] }),
                      C.Config.features.shopping_cart &&
                        N.showCartDropdown &&
                        o.createElement(bi, { className: "" }),
                      C.Config.features.notifications &&
                        o.createElement(Gr, { className: pn()["group-c"] }),
                      o.createElement(Ai, {
                        className: "",
                        useLangPrefixedUrls: _,
                      })
                    );
                  })()
                : o.createElement(
                    o.Fragment,
                    null,
                    o.createElement(Si, {
                      className: f()(pn()["gap-button"], pn()["group-a"]),
                    }),
                    C.Config.brand.is_teaching_enabled &&
                      o.createElement(vr, {
                        className: f()(pn()["gap-button"], pn()["group-b"]),
                      }),
                    C.Config.features.shopping_cart &&
                      N.showCartDropdown &&
                      o.createElement(bi, { className: "" }),
                    o.createElement(
                      "div",
                      { className: pn()["gap-auth-button"] },
                      o.createElement(
                        fr,
                        {
                          udStyle: "secondary",
                          authParams: { showLogin: !0 },
                          "data-purpose": "header-login",
                        },
                        S.gettext("Log in")
                      )
                    ),
                    o.createElement(
                      "div",
                      { className: pn()["gap-auth-button"] },
                      o.createElement(
                        fr,
                        {
                          "data-purpose": "header-signup",
                          authParams: N.signupParams,
                        },
                        S.gettext("Sign up")
                      )
                    ),
                    o.createElement(
                      "div",
                      { className: pn()["gap-auth-button"] },
                      o.createElement(Zt.D8, {
                        uiRegion: Bt.Nc.DESKTOP_HEADER,
                        useLangPrefixedUrls: _,
                        trigger: o.createElement(
                          Rt.h,
                          { udStyle: "secondary", size: "medium" },
                          o.createElement(fe(), {
                            color: "neutral",
                            label: S.gettext("Choose a language"),
                          })
                        ),
                      }),
                      o.createElement(Zt.eJ, null)
                    )
                  )
              : o.createElement("div", { style: { flex: 1 } });
          }
          function G(e) {
            var t, n;
            return o.createElement(
              "div",
              {
                className: f()(
                  "ud-header",
                  "ud-text-sm",
                  pn().header,
                  pn()["flex-middle"],
                  (0, l.Z)({}, pn().floating, e)
                ),
                "data-purpose": "header",
              },
              !e &&
                o.createElement(Mt, {
                  goToContentSelector: ".ud-main-content",
                  label: S.gettext("Skip to content"),
                }),
              o.createElement(
                "a",
                {
                  href: N.urls.BROWSE,
                  className: f()(pn()["flex-middle"], pn().logo),
                },
                o.createElement(Vt.T, {
                  ufbContext: w.ufbContext,
                  width: 91,
                  height: 34,
                })
              ),
              null !==
                (t =
                  null === (n = w.ufbContext) || void 0 === n
                    ? void 0
                    : n.browseButtons) && void 0 !== t
                ? t
                : o.createElement(ir, { className: pn()["gap-button"] }),
              o.createElement(zt.a4, {
                searchFormAutocompleteStore: Z,
                formAction: N.urls.SEARCH,
                formActionParams: N.formActionParams,
                label: V(),
                inputProps: { className: "js-header-search-field", name: "q" },
                reversed: !0,
                textSize: "small",
                className: pn()["search-bar"],
                showResultsWithImage:
                  !C.Config.brand.has_organization &&
                  !N.isPersonalPlanSubscriber,
              }),
              q()
            );
          }
          o.useEffect(function () {
            var e = !!w.ufbContext;
            (0, Ht.v)(k, e, function (e) {
              N.setUserSpecificContext(e.data.header),
                j.setUserSpecificContext({
                  user: N.userSpecificContext.user,
                  userType: null,
                }),
                Z.setSearchFormExperimentFeatures(
                  N.userSpecificContext.searchFormExperimentFeatures
                );
            });
          }, []),
            o.useEffect(
              function () {
                Q &&
                  Promise.resolve()
                    .then(n.bind(n, 15964))
                    .then(function (e) {
                      return U(e.MobileHeader);
                    });
              },
              [Q]
            );
          var X = {
            headerStore: N,
            browseNavStore: I,
            myLearningStore: A,
            activityNotificationsStore: j,
            ufbContext: w.ufbContext,
          };
          return o.createElement(
            Wt.f,
            X,
            N.userSpecificContext.user &&
              o.createElement(Ut.MO, {
                isPersonalPlanSubscriber: N.isPersonalPlanSubscriber,
                isUdemyBusinessSubscriber:
                  Object.keys(
                    null !== (r = w.ufbContext) && void 0 !== r ? r : {}
                  ).length > 0,
              }),
            N.userSpecificContext.user &&
              o.createElement(Ut.NG, { disableHideButtonWhenVisible: !0 }),
            (null === (i = N.userSpecificContext.user) || void 0 === i
              ? void 0
              : i.id) &&
              (!z || !Q) &&
              o.createElement(Tt, null),
            o.createElement(
              "div",
              { className: pn()["mobile-header"] },
              z
                ? o.createElement(
                    z,
                    Di(
                      Di({}, w),
                      {},
                      {
                        ufbContext:
                          null === (a = w.ufbContext) || void 0 === a
                            ? void 0
                            : a.mobileContext,
                        isInsideDesktopHeader: !0,
                        useLangPrefixedUrls: _,
                      }
                    )
                  )
                : o.createElement("div", {
                    "data-testid": "mobile-header-placeholder",
                    className: pn()["mobile-header-placeholder"],
                  })
            ),
            o.createElement(
              p.ZP,
              {
                onChange: function (e) {
                  var t = e.boundingClientRect.top;
                  W && t >= 0 && H(!1);
                },
              },
              o.createElement("span", { className: pn().mark })
            ),
            o.createElement(
              p.ZP,
              {
                onChange: function (e) {
                  var t = e.intersectionRatio;
                  W || 0 !== t || H(!0);
                },
              },
              G(!1)
            ),
            W && g && G(!0)
          );
        }),
        Qi = n(10409),
        Vi = n.n(Qi),
        qi = n(15964);
      var Gi = "learning_paths",
        Xi = "learning_path_folder",
        Yi = "org_custom_categories",
        Ki =
          ((Mi = _.LO.ref),
          (zi = (function () {
            function e(t, n) {
              var r;
              (0, h.Z)(this, e),
                (this.i18n = n),
                (0, b.Z)(this, "children", Ui, this),
                (this.type = void 0),
                (this.id = void 0),
                (this.absolute_url = void 0),
                (this.type = Gi),
                (this.id = 0),
                (this.absolute_url =
                  null !== (r = t.urls.LEARNING_PATHS) && void 0 !== r
                    ? r
                    : ""),
                (this.i18n = n);
            }
            return (
              (0, v.Z)(e, [
                {
                  key: "title",
                  get: function () {
                    return o.createElement(
                      $i,
                      null,
                      this.i18n.gettext("Learning paths")
                    );
                  },
                },
                {
                  key: "loadChildren",
                  value: (function () {
                    var e = (0, te.Z)(
                      re().mark(function e() {
                        var t;
                        return re().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (e.next = 2),
                                    G.uh.get(
                                      "/structured-data/tags/learning_path_folder/",
                                      { params: { page_size: Wn.u } }
                                    )
                                  );
                                case 2:
                                  (t = e.sent),
                                    this._setChildren(t.data.results);
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
                  key: "_setChildren",
                  value: function (e) {
                    this.children = e.map(function (e) {
                      return {
                        type: Xi,
                        id: e.id,
                        absolute_url: e.url,
                        title: e.title,
                      };
                    });
                  },
                },
              ]),
              e
            );
          })()),
          (Ui = (0, y.Z)(zi.prototype, "children", [Mi], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (0, y.Z)(
            zi.prototype,
            "_setChildren",
            [_.aD],
            Object.getOwnPropertyDescriptor(zi.prototype, "_setChildren"),
            zi.prototype
          ),
          zi),
        Ji =
          ((Fi = _.LO.ref),
          (Bi = (function () {
            function e(t, n, r) {
              (0, h.Z)(this, e),
                (this.i18n = n),
                (this.udData = r),
                (0, b.Z)(this, "children", Wi, this),
                (this.type = void 0),
                (this.id = void 0),
                (this.absolute_url = void 0),
                (this.type = Yi),
                (this.id = 0),
                (this.absolute_url = t.urls.BROWSE),
                (this.i18n = n),
                (this.udData = r);
            }
            return (
              (0, v.Z)(e, [
                {
                  key: "title",
                  get: function () {
                    var e = this.udData.Config.features.organization
                      .learning_path.enabled
                      ? this.i18n.gettext("Categories")
                      : this.i18n.interpolate(
                          this.i18n.gettext("%(companyName)s collection"),
                          { companyName: this.udData.Config.brand.title },
                          !0
                        );
                    return o.createElement($i, null, e);
                  },
                },
                {
                  key: "loadChildren",
                  value: function () {
                    var e;
                    this.children =
                      (null === (e = this.udData.browse) || void 0 === e
                        ? void 0
                        : e.org_custom_categories) || [];
                  },
                },
              ]),
              e
            );
          })()),
          (Wi = (0, y.Z)(Bi.prototype, "children", [Fi], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (0, y.Z)(
            Bi.prototype,
            "loadChildren",
            [_.aD],
            Object.getOwnPropertyDescriptor(Bi.prototype, "loadChildren"),
            Bi.prototype
          ),
          Bi),
        $i = function (e) {
          var t = e.children,
            n = (0, c.gL)().Config.brand.organization;
          return o.createElement(
            "div",
            { style: { display: "flex", alignItems: "center" } },
            n.favicon_image > 0 &&
              o.createElement(oi.E, {
                src: n.favicon_url,
                alt: "",
                width: 20,
                height: 20,
                style: { marginRight: Ft.T["space-xs"] },
              }),
            t
          );
        },
        eo = n(49927),
        to = n(50385);
      function no() {
        var e = o.useContext(Wt.p);
        if (null === e || void 0 === e || !e.customCategoriesModel)
          throw new Error("customCategoriesModel is not set in HeaderContext");
        if (null === e || void 0 === e || !e.learningPathsMenuModel)
          throw new Error("learningPathsMenuModel is not set in HeaderContext");
        return {
          customCategoriesModel: e.customCategoriesModel,
          learningPathsMenuModel: e.learningPathsMenuModel,
        };
      }
      var ro = n(20633),
        io = (0, g.Pi)(function () {
          var e = (0, c.gL)().Config,
            t = (0, s.QT)().gettext,
            n = (0, an.k)(),
            r = (0, to.D)(),
            i = no(),
            a = i.customCategoriesModel,
            l = i.learningPathsMenuModel;
          function u() {
            return o.createElement(
              o.Fragment,
              null,
              o.createElement(
                ro.lr,
                null,
                (function () {
                  var e = n.userSpecificContext.user;
                  return null === e || void 0 === e
                    ? void 0
                    : e.show_updated_pp_and_ub_navigation;
                })()
                  ? t("Explore by category")
                  : t("All categories")
              ),
              o.createElement(
                ro.k9,
                null,
                r.navigationCategories
                  ? r.navigationCategories.map(function (e) {
                      return o.createElement(
                        ro.kX,
                        {
                          key: e.id,
                          cssToggleId:
                            "header-toggle-side-nav-subcategories-of-".concat(
                              e.id
                            ),
                          "data-purpose": "category-item",
                        },
                        e.title
                      );
                    })
                  : (0, Qn.w)(13).map(function (e) {
                      return o.createElement(ro.kX, { key: e, loading: !0 });
                    })
              )
            );
          }
          var d = e.features.organization.learning_path.enabled
              ? o.createElement(
                  ro.kX,
                  {
                    cssToggleId: "header-toggle-side-nav-learning-path-folders",
                  },
                  l.title
                )
              : null,
            p =
              a.children.length > 0
                ? o.createElement(
                    ro.kX,
                    { cssToggleId: "header-toggle-side-nav-custom-categories" },
                    a.title
                  )
                : null;
          return d || p
            ? o.createElement(
                o.Fragment,
                null,
                o.createElement(ro.lr, null, t("My organization")),
                o.createElement(ro.k9, null, d, p),
                u()
              )
            : u();
        }),
        oo = (0, g.Pi)(function () {
          var e = (0, an.k)(),
            t = (0, c.gL)().Config,
            n = e.userSpecificContext,
            r = n.isInstructor,
            i = n.user,
            a = n.organizationState,
            l = (0, s.QT)().gettext;
          return i && i.id
            ? o.createElement(
                ro.k9,
                null,
                t.brand.is_teaching_enabled &&
                  r &&
                  o.createElement(
                    ro.kX,
                    { href: e.urls.TEACH, color: "link" },
                    l("Switch to instructor view")
                  ),
                (null === a || void 0 === a
                  ? void 0
                  : a.should_show_manage_menu) &&
                  o.createElement(
                    ro.kX,
                    { cssToggleId: "header-toggle-side-nav-manage" },
                    l("Manage")
                  )
              )
            : null;
        }),
        ao = n(17),
        so = (0, g.Pi)(function () {
          var e = no().customCategoriesModel,
            t = (0, c.gL)();
          return (
            (0, o.useEffect)(function () {
              e.loadChildren();
            }, []),
            0 === e.children.length
              ? null
              : o.createElement(
                  ro.VO,
                  { id: "header-toggle-side-nav-custom-categories" },
                  o.createElement(
                    ro.k9,
                    null,
                    e.children.map(function (e) {
                      return o.createElement(
                        ro.kX,
                        {
                          key: e.id,
                          href: (0, Gn.W)(
                            e.absolute_url,
                            t.Config.brand.has_organization
                          ),
                        },
                        e.title
                      );
                    })
                  )
                )
          );
        }),
        co = (0, g.Pi)(function () {
          var e = (0, an.k)(),
            t = no().learningPathsMenuModel,
            n = (0, s.QT)().gettext;
          return (
            (0, o.useEffect)(function () {
              t.loadChildren();
            }, []),
            o.createElement(
              ro.VO,
              { id: "header-toggle-side-nav-learning-path-folders" },
              o.createElement(
                ro.k9,
                null,
                o.createElement(
                  ro.kX,
                  { href: t.absolute_url },
                  n("All paths")
                ),
                o.createElement(
                  ro.kX,
                  { href: e.urls.MY_LEARNING_PATHS },
                  n("My edited paths")
                )
              ),
              o.createElement(
                ro.k9,
                null,
                t.children.map(function (e) {
                  return o.createElement(
                    ro.kX,
                    { key: e.id, href: e.absolute_url },
                    e.title
                  );
                })
              )
            )
          );
        }),
        lo = function (e) {
          var t = e.parentCategory,
            n = e.subcategories,
            r = (0, s.QT)(),
            i = r.gettext,
            a = r.interpolate,
            l = (0, c.gL)();
          return o.createElement(
            ro.VO,
            { id: "header-toggle-side-nav-subcategories-of-".concat(t.id) },
            o.createElement(
              ro.k9,
              null,
              o.createElement(
                ro.kX,
                {
                  href: (0, Gn.W)(
                    t.absolute_url,
                    l.Config.brand.has_organization
                  ),
                },
                o.createElement(
                  "span",
                  { className: "ud-heading-md" },
                  a(i("All %(category)s"), { category: t.title }, !0)
                )
              ),
              n.map(function (e) {
                return o.createElement(
                  ro.kX,
                  {
                    key: e.id,
                    href: (0, Gn.W)(
                      e.absolute_url,
                      l.Config.brand.has_organization
                    ),
                    "data-purpose": "subcategory-item",
                  },
                  e.title
                );
              })
            )
          );
        },
        uo = n(68303),
        po = n.n(uo),
        mo = {
          "header.manage-ufb.users": "header-toggle-side-nav-manage-users",
          "header.manage-ufb.assigned":
            "header-toggle-side-nav-manage-assigned",
          "header.manage-ufb.insights":
            "header-toggle-side-nav-manage-insights",
          "header.manage-ufb.settings":
            "header-toggle-side-nav-manage-settings",
        },
        fo = (0, g.Pi)(function () {
          var e = (0, an.k)(),
            t = (0, s.QT)().gettext;
          var n = e.userSpecificContext.organizationManageMenu;
          return o.createElement(
            ro.VO,
            {
              id: "header-toggle-side-nav-manage",
              "data-testid": "mobile-l1-manage-nav",
            },
            o.createElement(
              ro.k9,
              null,
              n.map(function (e) {
                var n = mo[e.id];
                return e.children
                  ? o.createElement(
                      ro.kX,
                      { key: e.id, cssToggleId: n },
                      e.title
                    )
                  : o.createElement(
                      ro.kX,
                      { key: e.id, href: e.url },
                      e.is_beta
                        ? o.createElement(s.nj, {
                            html: interpolate(
                              t('%(title)s <span class="beta">Beta</span>'),
                              { title: e.title },
                              !0
                            ),
                            interpolate: {
                              beta: o.createElement(Ni.C, {
                                className: po().beta,
                              }),
                            },
                          })
                        : e.title
                    );
              })
            )
          );
        }),
        go = function (e) {
          var t,
            n = e.l1NavItem,
            r = (0, s.QT)().gettext;
          return o.createElement(
            ro.bv,
            {
              id: mo[n.id],
              "data-testid": "mobile-l2-manage-nav",
              l1NavId: "header-toggle-side-nav-manage",
              l1NavTitle: r("Manage"),
            },
            o.createElement(
              ro.k9,
              null,
              null === (t = n.children) || void 0 === t
                ? void 0
                : t.map(function (e) {
                    return o.createElement(
                      ro.kX,
                      { key: e.key, href: e.href },
                      (function (e) {
                        var t = e.title;
                        return (
                          e.is_pro
                            ? (t = o.createElement(
                                o.Fragment,
                                null,
                                t,
                                " ",
                                o.createElement(Wn.Z, null)
                              ))
                            : e.is_beta &&
                              (t = o.createElement(s.nj, {
                                html: interpolate(
                                  r('%(title)s <span class="beta">Beta</span>'),
                                  { title: t },
                                  !0
                                ),
                                interpolate: {
                                  beta: o.createElement(Ni.C, {
                                    className: po().beta,
                                  }),
                                },
                              })),
                          t
                        );
                      })(e)
                    );
                  })
            )
          );
        },
        ho = (0, g.Pi)(function () {
          var e = (0, an.k)(),
            t = (0, to.D)();
          function n(t) {
            var n = e.userSpecificContext.organizationManageMenu.find(function (
              e
            ) {
              return e.id === t;
            });
            return n && o.createElement(go, { l1NavItem: n });
          }
          var r = e.userSpecificContext,
            i = r.user,
            a = r.organizationState;
          if (!i || null === a || void 0 === a || !a.should_show_manage_menu)
            return null;
          var s = t.isLevelLoaded(1),
            c = t.isLevelLoaded(2);
          return o.createElement(
            "div",
            null,
            c && n("header.manage-ufb.users"),
            c && n("header.manage-ufb.insights"),
            c && n("header.manage-ufb.assigned"),
            c && n("header.manage-ufb.settings"),
            s && o.createElement(fo, null)
          );
        }),
        vo = (0, g.Pi)(function () {
          var e,
            t = (0, to.D)(),
            n = (0, c.gL)().Config,
            r = t.isLevelLoaded(1),
            i = n.features.organization.learning_path.enabled;
          return o.createElement(
            o.Fragment,
            null,
            r &&
              (null === (e = t.navigationCategories) || void 0 === e
                ? void 0
                : e.map(function (e) {
                    var t;
                    return o.createElement(lo, {
                      key: e.id,
                      parentCategory: e,
                      subcategories:
                        null !== (t = e.children) && void 0 !== t ? t : [],
                    });
                  })),
            r && o.createElement(so, null),
            r && i && o.createElement(co, null),
            o.createElement(ho, null),
            r && o.createElement(ao.T, null)
          );
        });
      function bo(e, t) {
        return {
          get browseSection() {
            return o.createElement(io, null);
          },
          get manageAndTeachSection() {
            return o.createElement(oo, null);
          },
          get subNavs() {
            return o.createElement(vo, null);
          },
          get badgeContext() {
            var t = { unseenCredits: 0 };
            return (
              e.Config.features.notifications ||
                (t.unreadActivityNotifications = 0),
              e.Config.brand.is_messaging_enabled || (t.unreadMessages = 0),
              e.Config.features.shopping_cart || (t.cartBuyables = 0),
              t
            );
          },
          get logo() {
            return o.createElement(eo.u, null);
          },
          createStores: function (n) {
            return {
              learningPathsMenuModel: new Ki(n, t),
              customCategoriesModel: new Ji(n, t, e),
            };
          },
          urls: function () {
            var t = e.Config.brand.organization.id;
            return {
              ASSESSMENTS: "/skills-assessment/",
              BROWSE: "/organization/home/",
              LABS: "/labs/listing/",
              LEARNING_PATHS: "/learning-paths/",
              MY_LEARNING_PATHS: "/learning-paths/my/",
              PRO_ONBOARDING: "/organization/onboarding-pro/",
              PRO_PATHS: "/learning-paths/pro/",
              SEARCH: "/organization/search/",
              SEARCH_SUGGESTIONS: "/organizations/".concat(
                t,
                "/search-suggestions/"
              ),
            };
          },
        };
      }
      var yo = function () {
          var e = (0, an.k)(),
            t = (0, c.gL)().Config,
            n = (0, s.QT)().gettext;
          return o.createElement(
            o.Fragment,
            null,
            o.createElement(ir, { className: pn()["gap-button"] }),
            t.features.organization.learning_path.enabled &&
              o.createElement(
                "div",
                { className: pn()["gap-button group-a"] },
                o.createElement(
                  An,
                  { componentClass: "a", href: e.urls.LEARNING_PATHS },
                  n("Learning paths")
                )
              )
          );
        },
        _o = function () {
          var e,
            t,
            n = on();
          return o.createElement(
            Hn.W,
            { size: "small", className: Yn().section, iconAlignment: "right" },
            null === (e = n.selectedLevelOneItem) ||
              void 0 === e ||
              null === (t = e.children) ||
              void 0 === t
              ? void 0
              : t.map(function (e) {
                  return o.createElement(nr, {
                    key: e.id,
                    navItem: e,
                    id: "header-browse-nav-".concat(e.type, "-").concat(e.id),
                  });
                })
          );
        },
        Eo = function () {
          var e,
            t,
            n,
            r = (0, an.k)(),
            i = on(),
            a = (0, s.QT)().gettext;
          return o.createElement(
            o.Fragment,
            null,
            o.createElement(
              Hn.W,
              {
                size: "small",
                className: Yn().section,
                iconAlignment: "right",
              },
              o.createElement(
                Hn.W.Item,
                {
                  "data-id": "all-learning-paths",
                  href:
                    null === (e = i.selectedLevelOneItem) || void 0 === e
                      ? void 0
                      : e.absolute_url,
                  color: "neutral",
                  className: Yn().item,
                },
                a("All paths")
              ),
              o.createElement(
                Hn.W.Item,
                {
                  "data-id": "my-learning-paths",
                  href: r.urls.MY_LEARNING_PATHS,
                  color: "neutral",
                  className: Yn().item,
                },
                a("My edited paths")
              )
            ),
            o.createElement(
              Hn.W,
              {
                size: "small",
                className: Yn().section,
                iconAlignment: "right",
              },
              null === (t = i.selectedLevelOneItem) ||
                void 0 === t ||
                null === (n = t.children) ||
                void 0 === n
                ? void 0
                : n.map(function (e) {
                    return o.createElement(nr, {
                      key: e.id,
                      navItem: e,
                      href: e.absolute_url,
                      id: "header-browse-nav-".concat(e.type, "-").concat(e.id),
                    });
                  })
            )
          );
        },
        wo = (0, g.Pi)(function (e) {
          var t = e.itemFinders,
            n = (0, an.k)(),
            r = on(),
            i = (0, c.gL)(),
            a = i.browse,
            l = i.Config,
            d = (0, s.QT)(),
            p = d.gettext,
            m = d.interpolate,
            f = o.useState(new Ki(n, { gettext: p })),
            g = (0, u.Z)(f, 1)[0],
            h = o.useState(
              new Ji(
                n,
                { gettext: p, interpolate: m },
                { browse: a, Config: l }
              )
            ),
            v = (0, u.Z)(h, 1)[0];
          o.useEffect(
            function () {
              v.loadChildren();
            },
            [v]
          ),
            o.useEffect(function () {
              r.navigationCategories &&
                l.features.organization.learning_path.enabled &&
                g.loadChildren();
            }, []);
          var b = function (e) {
              return o.createElement(nr, {
                navItem: e,
                href: e.absolute_url,
                onSelect: r.selectLevelOneItem,
                findFirstSubNavItem: t.findFirstLevelTwoItem,
                isSelected: e === r.selectedLevelOneItem,
                subNavId: "header-browse-nav-level-two",
                id: "header-browse-nav-".concat(e.type, "-").concat(e.id),
              });
            },
            y = l.features.organization.learning_path.enabled,
            _ = v.children.length > 0;
          return y || _
            ? o.createElement(
                o.Fragment,
                null,
                o.createElement(Kn, null, p("My organization")),
                o.createElement(
                  Hn.W,
                  {
                    size: "small",
                    className: Yn().section,
                    iconAlignment: "right",
                  },
                  y && b(g),
                  _ && b(v)
                )
              )
            : null;
        }),
        Oo = (0, g.Pi)(function () {
          var e = (0, an.k)(),
            t = (0, s.QT)().gettext,
            n = e.userSpecificContext,
            r = n.organizationState,
            i = n.organizationManageMenu;
          return null !== r && void 0 !== r && r.should_show_manage_menu
            ? o.createElement(
                Rn,
                {
                  trigger: o.createElement(
                    An,
                    { "data-intercom-target": "header.manage-ufb" },
                    t("Manage")
                  ),
                  className: ""
                    .concat(Yn()["list-menu-container"], " ")
                    .concat(pn()["gap-button"]),
                },
                o.createElement(
                  Ln,
                  null,
                  o.createElement(
                    Hn.W,
                    { size: "small", className: Yn().section },
                    i.map(function (e, n) {
                      return o.createElement(
                        Hn.W.Item,
                        {
                          key: n,
                          href: e.url,
                          color: "neutral",
                          "data-intercom-target": e.id,
                        },
                        e.is_beta
                          ? o.createElement(s.nj, {
                              html: interpolate(
                                t('%(title)s <span class="beta">Beta</span>'),
                                { title: e.title },
                                !0
                              ),
                              interpolate: {
                                beta: o.createElement(Ni.C, {
                                  className: Yn().beta,
                                }),
                              },
                            })
                          : e.title
                      );
                    })
                  )
                )
              )
            : null;
        }),
        So = n(76654),
        ko = n.n(So),
        Co = n(55016),
        xo = n.n(Co),
        No = (0, g.Pi)(function () {
          var e,
            t,
            n,
            r = (0, an.k)(),
            i = (0, s.QT)(),
            a = i.gettext,
            l = i.ngettext,
            u = i.interpolate,
            d = i.locale,
            p = (0, c.gL)().Config,
            m = r.userSpecificContext.organizationState,
            f = (null === m || void 0 === m ? void 0 : m.package_alert) || {},
            g = {};
          if (f.is_suspended) {
            if (
              ((g = {
                href: "mailto:success@udemy.com",
                target: "_blank",
                rel: "noopener noreferrer",
              }),
              f.is_subscription
                ? (t = a("Your subscription ended on <b>%(endDate)s</b>."))
                : f.is_free_trial &&
                  (t = a("Your free trial ended on <b>%(endDate)s</b>.")),
              t)
            ) {
              var h = p.brand.product_name;
              e = u(a("Your %(product)s account expired."), { product: h }, !0);
              var v = ""
                  .concat(t, " ")
                  .concat(
                    a(
                      'You need to subscribe to a paid plan to continue. Please contact the %(product)s Customer Success team at <a class="link">success@udemy.com</a>.'
                    )
                  ),
                b = d.replace("_", "-") || "en-US",
                y = new Date(f.end_date).toLocaleDateString(b);
              n = o.createElement(s.nj, {
                className: "ud-text-md",
                html: u(v, { endDate: (0, E.X)(y), product: (0, E.X)(h) }, !0),
                interpolate: { link: o.createElement("a", g) },
              });
            }
          } else f.is_almost_suspended && (f.is_subscription ? (t = l("You have only %(count)s day left in your subscription.", "You have only %(count)s days left in your subscription.", f.days_left)) : f.is_free_trial && (t = l("You have only %(count)s day left in your free trial.", "You have only %(count)s days left in your free trial.", f.days_left)), t && ((e = u(t, { count: f.days_left }, !0)), f.is_team_plan && ((g = { href: "/organization-manage/settings/billing/" }), (n = o.createElement(C.zx, Object.assign({}, g, { to: g.href, componentClass: "a", className: hr().cta }), a("Set up auto-renewal"))))));
          return e
            ? o.createElement(
                Rn,
                {
                  a11yRole: "description",
                  className: xo()["package-alert"],
                  trigger: o.createElement(
                    An,
                    Object.assign({}, g, {
                      componentClass: g.href ? "a" : "button",
                      udStyle: "icon",
                      "data-testid": "header-button",
                    }),
                    o.createElement(ko(), {
                      color: "warning",
                      label: a("Warning"),
                    })
                  ),
                },
                o.createElement(
                  Ln,
                  null,
                  o.createElement(
                    "div",
                    {
                      className: "".concat(hr().panel, " ").concat(xo().panel),
                    },
                    o.createElement(
                      "div",
                      {
                        className: "ud-heading-lg ".concat(
                          n ? hr()["gap-bottom"] : ""
                        ),
                      },
                      e
                    ),
                    n
                  )
                )
              )
            : null;
        }),
        Po = n(85772);
      function Io(e) {
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
          var n,
            r = (0, ke.Z)(e);
          if (t) {
            var i = (0, ke.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, Se.Z)(this, n);
        };
      }
      var To = (function (e) {
          (0, Oe.Z)(n, e);
          var t = Io(n);
          function n(e) {
            var r;
            (0, h.Z)(this, n);
            var i = e.uiRegion;
            return (
              ((r = t.call(
                this,
                "OrganizationUserProFeatureLabSelectEvent"
              )).uiRegion = void 0),
              (r.uiRegion = i),
              r
            );
          }
          return (0, v.Z)(n);
        })(Ce.rp),
        Zo = (function (e) {
          (0, Oe.Z)(n, e);
          var t = Io(n);
          function n(e) {
            var r;
            (0, h.Z)(this, n);
            var i = e.uiRegion;
            return (
              ((r = t.call(
                this,
                "OrganizationUserProFeatureAssessmentSelectEvent"
              )).uiRegion = void 0),
              (r.uiRegion = i),
              r
            );
          }
          return (0, v.Z)(n);
        })(Ce.rp),
        Ro = (function (e) {
          (0, Oe.Z)(n, e);
          var t = Io(n);
          function n(e) {
            var r;
            (0, h.Z)(this, n);
            var i = e.uiRegion;
            return (
              ((r = t.call(
                this,
                "OrganizationUserProFeatureUdemyPathSelectEvent"
              )).uiRegion = void 0),
              (r.uiRegion = i),
              r
            );
          }
          return (0, v.Z)(n);
        })(Ce.rp),
        Ao = (function (e) {
          (0, Oe.Z)(n, e);
          var t = Io(n);
          function n(e) {
            var r;
            (0, h.Z)(this, n);
            var i = e.uiRegion;
            return (
              ((r = t.call(
                this,
                "OrganizationUserProFeatureWorkspaceSelectEvent"
              )).uiRegion = void 0),
              (r.uiRegion = i),
              r
            );
          }
          return (0, v.Z)(n);
        })(Ce.rp),
        Lo = n(29845),
        jo = n.n(Lo),
        Do = (0, g.Pi)(function () {
          var e = (0, an.k)(),
            t = (0, c.j5)(),
            n = (0, s.QT)().gettext,
            r = e.urls,
            i = "user_dropdown_menu";
          return o.createElement(
            Po.J,
            {
              placement: "left",
              shouldCloseOtherPoppers: !1,
              canToggleOnHover: !0,
              withArrow: !1,
              withPadding: !1,
              trigger: o.createElement(
                Hn.W.Item,
                {
                  color: "neutral",
                  href: r.PRO_ONBOARDING,
                  icon: o.createElement(Bn(), { label: n("Next") }),
                  "data-testid": "pro-features-item",
                },
                n("Pro features")
              ),
              className: jo()["pro-feature-popover"],
            },
            o.createElement(
              Hn.W,
              {
                size: "small",
                className: jo().section,
                iconAlignment: "right",
              },
              o.createElement(
                Hn.W.Item,
                {
                  color: "neutral",
                  href: r.PRO_PATHS,
                  "data-testid": "udemy-paths-item",
                  onClick: function () {
                    return we.j.publishEvent(new Ro({ uiRegion: i }));
                  },
                },
                n("Udemy paths")
              )
            ),
            o.createElement(
              Hn.W,
              {
                size: "small",
                className: jo().section,
                iconAlignment: "right",
              },
              o.createElement(
                Hn.W.Item,
                {
                  color: "neutral",
                  href: r.ASSESSMENTS,
                  "data-testid": "assessments-item",
                  onClick: function () {
                    return we.j.publishEvent(new Zo({ uiRegion: i }));
                  },
                },
                n("Assessments")
              )
            ),
            o.createElement(
              Hn.W,
              {
                size: "small",
                className: jo().section,
                iconAlignment: "right",
              },
              o.createElement(
                Hn.W.Item,
                {
                  color: "neutral",
                  href: r.LABS,
                  "data-testid": "labs-item",
                  onClick: function () {
                    return we.j.publishEvent(new To({ uiRegion: i }));
                  },
                },
                n("Labs")
              )
            ),
            o.createElement(
              Hn.W,
              {
                size: "small",
                className: jo().section,
                iconAlignment: "right",
              },
              o.createElement(
                Hn.W.Item,
                {
                  color: "neutral",
                  href: t.toSupportLink(
                    "how_to_access_courses_with_workspaces",
                    !0
                  ),
                  target: "_blank",
                  "data-testid": "workspaces-item",
                  onClick: function () {
                    return we.j.publishEvent(new Ao({ uiRegion: i }));
                  },
                },
                n("Workspaces")
              )
            )
          );
        });
      function Mo(e, t) {
        var n,
          r,
          i,
          a = bo(e, t),
          s =
            null === (n = e.Config.features) ||
            void 0 === n ||
            null === (r = n.organization) ||
            void 0 === r ||
            null === (i = r.learning_path) ||
            void 0 === i
              ? void 0
              : i.enabled;
        return {
          mobileContext: a,
          urls: a.urls,
          badgeContext: a.badgeContext,
          logo: a.logo,
          browseNavDropdownText: s ? t.gettext("Explore") : void 0,
          get browseButtons() {
            return o.createElement(yo, null);
          },
          instructorDropdownText: s
            ? t.gettext("Teach")
            : t.gettext("Instructor"),
          prospectiveInstructorDropdownText: s
            ? t.gettext("Teach")
            : t.gettext("Create a course"),
          prospectiveInstructorHeadline: t.gettext(
            "Create or add custom courses to share within your organization."
          ),
          prospectiveInstructorCTAText: t.gettext("Try it now"),
          get packageAlert() {
            return o.createElement(No, null);
          },
          get manageDropdown() {
            return o.createElement(Oo, null);
          },
          get proFeaturesPopover() {
            return o.createElement(Do, null);
          },
          getBrowseNavLevelOneItems: function (e) {
            return o.createElement(wo, { itemFinders: e });
          },
          getBrowseNavLevelTwoItems: function (e) {
            return e.type === Gi
              ? o.createElement(Eo, null)
              : e.type === Yi
              ? o.createElement(_o, null)
              : null;
          },
        };
      }
      var zo = function (e) {
          var t = (0, c.gL)(),
            n = (0, s.QT)(),
            r = (0, a.G)({ mobile: 800, desktop: 9999 }),
            i = o.useMemo(
              function () {
                if (t.Config.brand.has_organization)
                  return "mobile" === r ? bo(t, n) : Mo(t, n);
              },
              [t, n, r]
            );
          return o.createElement(
            o.Fragment,
            null,
            "desktop" !== r &&
              o.createElement(
                "div",
                { className: Vi()["mobile-only"] },
                o.createElement(
                  qi.MobileHeader,
                  Object.assign({ ufbContext: i }, e)
                )
              ),
            "mobile" !== r &&
              o.createElement(
                "div",
                { className: Vi()["desktop-only"] },
                o.createElement(Hi, Object.assign({ ufbContext: i }, e))
              )
          );
        },
        Uo = n(79269),
        Fo = n(37059),
        Bo = n.n(Fo),
        Wo = { WEEK: "week", MONTH: "month", YEAR: "year", ALL_TIME: "all" },
        Ho = (Object.values(Wo), Wo.YEAR);
      function Qo(e, t) {
        var n =
          ("undefined" !== typeof Symbol && e[Symbol.iterator]) ||
          e["@@iterator"];
        if (!n) {
          if (
            Array.isArray(e) ||
            (n = (function (e, t) {
              if (!e) return;
              if ("string" === typeof e) return Vo(e, t);
              var n = Object.prototype.toString.call(e).slice(8, -1);
              "Object" === n && e.constructor && (n = e.constructor.name);
              if ("Map" === n || "Set" === n) return Array.from(e);
              if (
                "Arguments" === n ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
              )
                return Vo(e, t);
            })(e)) ||
            (t && e && "number" === typeof e.length)
          ) {
            n && (e = n);
            var r = 0,
              i = function () {};
            return {
              s: i,
              n: function () {
                return r >= e.length
                  ? { done: !0 }
                  : { done: !1, value: e[r++] };
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
            n = n.call(e);
          },
          n: function () {
            var e = n.next();
            return (a = e.done), e;
          },
          e: function (e) {
            (s = !0), (o = e);
          },
          f: function () {
            try {
              a || null == n.return || n.return();
            } finally {
              if (s) throw o;
            }
          },
        };
      }
      function Vo(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function qo(e) {
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
          var n,
            r = (0, ke.Z)(e);
          if (t) {
            var i = (0, ke.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, Se.Z)(this, n);
        };
      }
      var Go = (function (e) {
          (0, Oe.Z)(n, e);
          var t = qo(n);
          function n(e) {
            var r, i;
            return (
              (0, h.Z)(this, n),
              ((r = t.call(this, e)).isPayoutSettingsEnabled = void 0),
              (r.isRevenueReportEnabled = void 0),
              (r.isDisplayPracticeInsightsNewPageWithFunnelViewEnabled =
                null !==
                  (i =
                    e.instructorContext
                      .isDisplayPracticeInsightsNewPageWithFunnelViewEnabled) &&
                void 0 !== i &&
                i),
              (r.isFeaturedQuestionsEnabled =
                e.instructorContext.isFeaturedQuestionsEnabled),
              (r.isPayoutSettingsEnabled =
                e.instructorContext.isPayoutSettingsEnabled),
              (r.isRevenueReportEnabled =
                e.instructorContext.isRevenueReportEnabled),
              r.setUserSpecificContext({
                isInstructor: e.instructorContext.isInstructor,
                user: e.instructorContext.user,
                organizationState: e.instructorContext.organizationState,
                organizationManageMenu:
                  e.instructorContext.organizationManageMenu,
              }),
              r
            );
          }
          return (
            (0, v.Z)(n, [
              {
                key: "getInstructorPerformancePaths",
                value: function () {
                  var e,
                    t = {},
                    n = Qo(
                      new URLSearchParams(ei.N.global.location.search).entries()
                    );
                  try {
                    for (n.s(); !(e = n.n()).done; ) {
                      var r = (0, u.Z)(e.value, 2),
                        i = r[0],
                        o = r[1];
                      t[i] = o;
                    }
                  } catch (s) {
                    n.e(s);
                  } finally {
                    n.f();
                  }
                  var a = (function () {
                    var e,
                      t =
                        arguments.length > 0 && void 0 !== arguments[0]
                          ? arguments[0]
                          : {},
                      n =
                        t.course_id && !isNaN(t.course_id) ? t.course_id : null,
                      r = {
                        date_filter:
                          null !== (e = t.date_filter) && void 0 !== e
                            ? e
                            : Wo.YEAR,
                        course_id: n,
                      },
                      i = "/overview/revenue/?".concat(Bo().stringify(r)),
                      o = { course_id: n },
                      a = {
                        course_id: n,
                        star: t.star,
                        ordering: t.ordering,
                        unresponded: t.unresponded,
                        commented: t.commented,
                      },
                      s = "/students/?".concat(Bo().stringify(o)),
                      c = "/engagement/?".concat(Bo().stringify(r)),
                      l = "/practice-insights/?".concat(Bo().stringify(r)),
                      u = {
                        date_filter:
                          t.date_filter !== Wo.ALL_TIME && t.date_filter
                            ? t.date_filter
                            : Ho,
                        course_id: n,
                      },
                      d = "/conversion/visitors?".concat(Bo().stringify(u)),
                      p = "/reviews/?".concat(Bo().stringify(a));
                    return {
                      overviewPath: i,
                      reviewsPath: p,
                      studentsPath: s,
                      engagementPath: c,
                      practiceInsightsPath: l,
                      conversionPath: d,
                    };
                  })(t);
                  return { basePath: "/instructor/performance", paths: a };
                },
              },
            ]),
            n
          );
        })(Qt.N),
        Xo = n(10979),
        Yo = n.n(Xo),
        Ko = n(28126),
        Jo = n.n(Ko),
        $o = n(22715),
        ea = n.n($o),
        ta = (0, g.Pi)(function () {
          var e = (0, an.k)().instructorURLs,
            t = (0, c.gL)().Config,
            n = (0, s.QT)().gettext;
          return o.createElement(
            ro.VO,
            { id: "header-toggle-side-nav-instructor-account" },
            o.createElement(
              ro.k9,
              null,
              t.brand.is_profile_functions_enabled &&
                o.createElement(
                  ro.kX,
                  { href: e.ACCOUNT },
                  n("Account security")
                ),
              o.createElement(
                ro.kX,
                { href: e.EDIT_NOTIFICATIONS },
                n("Notification settings")
              ),
              !t.brand.has_organization &&
                o.createElement(
                  ro.kX,
                  { href: e.API_CLIENTS },
                  n("API clients")
                ),
              !t.brand.has_organization &&
                o.createElement(
                  ro.kX,
                  { href: e.CLOSE_ACCOUNT },
                  n("Close account")
                )
            )
          );
        }),
        na = (0, g.Pi)(function () {
          var e = (0, c.gL)().Config,
            t = (0, an.k)(),
            n = t.instructorURLs,
            r = (0, s.QT)().gettext;
          return o.createElement(
            ro.VO,
            { id: "header-toggle-side-nav-instructor-communication" },
            o.createElement(
              ro.k9,
              null,
              e.brand.is_discussions_enabled &&
                o.createElement(ro.kX, { href: n.Q_AND_A }, r("Q&A")),
              t.isFeaturedQuestionsEnabled &&
                o.createElement(
                  ro.kX,
                  { href: n.FEATURED_QUESTIONS },
                  r("Featured Questions")
                ),
              e.brand.is_messaging_enabled &&
                o.createElement(
                  ro.kX,
                  { href: n.MESSAGES },
                  r("Messages"),
                  o.createElement(Ar.JJ, {
                    className: po()["inline-notification-badge"],
                  })
                ),
              o.createElement(ro.kX, { href: n.ASSIGNMENTS }, r("Assignments")),
              o.createElement(
                ro.kX,
                { href: n.ANNOUNCEMENTS },
                r("Announcements")
              )
            )
          );
        }),
        ra = (0, g.Pi)(function () {
          var e = (0, an.k)().instructorURLs,
            t = (0, s.QT)().gettext;
          return o.createElement(
            ro.VO,
            { id: "header-toggle-side-nav-instructor-help" },
            o.createElement(
              ro.k9,
              null,
              o.createElement(
                ro.kX,
                {
                  href: e.TEACH_HUB,
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
                t("Teaching Center")
              ),
              o.createElement(
                ro.kX,
                {
                  href: e.COMMUNITY,
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
                t("Instructor Community")
              ),
              o.createElement(
                ro.kX,
                {
                  href: e.SUPPORT,
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
                t("Help and Support")
              )
            )
          );
        }),
        ia = (0, g.Pi)(function () {
          var e = (0, an.k)(),
            t = (0, c.gL)().Config,
            n = e.getInstructorPerformancePaths(),
            r = n.basePath,
            i = n.paths,
            a = (0, s.QT)().gettext;
          function l(e, t, n) {
            return n
              ? o.createElement(
                  ro.kX,
                  { cssToggleId: n },
                  o.createElement("span", null, e)
                )
              : o.createElement(ro.kX, { href: "".concat(r).concat(t) }, e);
          }
          return o.createElement(
            ro.VO,
            { id: "header-toggle-side-nav-instructor-performance" },
            o.createElement(
              ro.k9,
              null,
              !t.brand.has_organization && l(a("Overview"), i.overviewPath),
              !t.brand.has_organization && l(a("Students"), i.studentsPath),
              t.brand.is_add_reviews_enabled && l(a("Reviews"), i.reviewsPath),
              e.isDisplayPracticeInsightsNewPageWithFunnelViewEnabled
                ? l(
                    a("Engagement"),
                    null,
                    "header-toggle-side-nav-instructor-performance-engagement"
                  )
                : l(a("Course engagement"), i.engagementPath),
              !t.brand.has_organization &&
                l(a("Traffic & conversion"), i.conversionPath)
            )
          );
        }),
        oa = (0, g.Pi)(function () {
          var e = (0, c.gL)().Config,
            t = (0, an.k)(),
            n = t.instructorURLs,
            r = t.userSpecificContext.user,
            i = (0, s.QT)().gettext;
          return o.createElement(
            ro.VO,
            { id: "header-toggle-side-nav-instructor-profile" },
            o.createElement(
              ro.k9,
              null,
              !!(
                e.brand.is_profile_functions_enabled &&
                e.brand.is_user_profiles_public &&
                r.url
              ) &&
                o.createElement(
                  ro.kX,
                  {
                    href: r.url,
                    target: "_blank",
                    rel: "nofollow noopener noreferrer",
                  },
                  i("Public profile")
                ),
              o.createElement(
                ro.kX,
                { href: n.EDIT_PROFILE },
                i("Udemy profile")
              ),
              o.createElement(
                ro.kX,
                { href: n.EDIT_PHOTO },
                i("Profile picture")
              ),
              !(
                !e.brand.is_profile_functions_enabled ||
                !e.brand.is_user_profiles_public
              ) &&
                o.createElement(
                  ro.kX,
                  { href: n.EDIT_PRIVACY },
                  i("Privacy settings")
                )
            )
          );
        }),
        aa = (0, g.Pi)(function () {
          var e = (0, an.k)().instructorURLs,
            t = (0, s.QT)().gettext;
          return o.createElement(
            ro.VO,
            { id: "header-toggle-side-nav-instructor-tools" },
            o.createElement(
              ro.k9,
              null,
              o.createElement(ro.kX, { href: e.TEST_VIDEO }, t("Test Video")),
              o.createElement(
                ro.kX,
                { href: e.MARKETPLACE_INSIGHTS },
                t("Marketplace Insights")
              )
            )
          );
        }),
        sa = (0, g.Pi)(function () {
          var e = (0, c.gL)().Config,
            t = (0, an.k)(),
            n = (0, to.D)(),
            r = (0, s.QT)().gettext;
          return o.createElement(
            ro.zM,
            {
              onToggle: function () {
                n.ensureLevelIsLoaded(1);
              },
              subDrawers: o.createElement(
                o.Fragment,
                null,
                t.isDisplayPracticeInsightsNewPageWithFunnelViewEnabled &&
                  n.isLevelLoaded(2) &&
                  (function () {
                    var e = t.getInstructorPerformancePaths(),
                      n = e.basePath,
                      i = e.paths;
                    return o.createElement(
                      ro.bv,
                      {
                        id: "header-toggle-side-nav-instructor-performance-engagement",
                        l1NavId:
                          "header-toggle-side-nav-instructor-performance",
                        l1NavTitle: r("Engagement"),
                      },
                      o.createElement(
                        ro.k9,
                        null,
                        o.createElement(
                          ro.kX,
                          { href: "".concat(n).concat(i.engagementPath) },
                          r("Course engagement")
                        ),
                        o.createElement(
                          ro.kX,
                          { href: "".concat(n).concat(i.practiceInsightsPath) },
                          r("Practice insights")
                        )
                      )
                    );
                  })(),
                n.isLevelLoaded(1) && o.createElement(ta, null),
                n.isLevelLoaded(1) && o.createElement(ra, null),
                n.isLevelLoaded(1) && o.createElement(aa, null),
                n.isLevelLoaded(1) && o.createElement(ia, null),
                n.isLevelLoaded(1) && o.createElement(na, null),
                o.createElement(ho, null),
                n.isLevelLoaded(1) && o.createElement(oa, null)
              ),
            },
            o.createElement(ro.f5, {
              cssToggleId: "header-toggle-side-nav-instructor-profile",
            }),
            (function () {
              var n = t.instructorURLs,
                i = t.userSpecificContext.organizationState;
              return o.createElement(
                ro.k9,
                null,
                e.brand.is_teaching_enabled &&
                  o.createElement(
                    ro.kX,
                    { href: n.BROWSE, color: "link" },
                    e.brand.has_organization
                      ? r("Switch to learner view")
                      : r("Switch to student view")
                  ),
                (null === i || void 0 === i
                  ? void 0
                  : i.should_show_manage_menu) &&
                  o.createElement(
                    ro.kX,
                    { cssToggleId: "header-toggle-side-nav-manage" },
                    r("Manage")
                  )
              );
            })(),
            (function () {
              var e = t.instructorURLs;
              return o.createElement(
                ro.k9,
                null,
                o.createElement(ro.kX, { href: e.COURSES }, r("Courses")),
                o.createElement(
                  ro.kX,
                  {
                    cssToggleId:
                      "header-toggle-side-nav-instructor-communication",
                  },
                  r("Communication"),
                  o.createElement(Ar.JJ, {
                    className: po()["inline-notification-badge"],
                  })
                ),
                o.createElement(
                  ro.kX,
                  {
                    cssToggleId:
                      "header-toggle-side-nav-instructor-performance",
                  },
                  r("Performance")
                ),
                o.createElement(
                  ro.kX,
                  { cssToggleId: "header-toggle-side-nav-instructor-tools" },
                  r("Tools")
                ),
                o.createElement(
                  ro.kX,
                  { cssToggleId: "header-toggle-side-nav-instructor-help" },
                  r("Resources")
                )
              );
            })(),
            (function () {
              var n,
                i = t.instructorURLs,
                a = t.userSpecificContext.user;
              return o.createElement(
                ro.k9,
                null,
                e.features.notifications &&
                  o.createElement(
                    ro.kX,
                    { href: i.VIEW_NOTIFICATIONS },
                    r("Notifications"),
                    o.createElement(Ar._T, {
                      className: po()["inline-notification-badge"],
                    })
                  ),
                o.createElement(
                  ro.kX,
                  { cssToggleId: "header-toggle-side-nav-instructor-account" },
                  r("Account settings")
                ),
                t.isPayoutSettingsEnabled &&
                  o.createElement(
                    ro.kX,
                    { href: i.PAYOUT_SETTINGS },
                    r("Payout & tax settings")
                  ),
                t.isRevenueReportEnabled &&
                  o.createElement(
                    ro.kX,
                    { href: i.REVENUE_REPORT },
                    r("Revenue report")
                  ),
                o.createElement(
                  ro.kX,
                  {
                    href:
                      null === (n = t.mobileAppLink) || void 0 === n
                        ? void 0
                        : n.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  },
                  r("Get the app")
                ),
                o.createElement(ro.kX, { href: a.logout_url }, r("Log out"))
              );
            })()
          );
        }),
        ca = n(19391),
        la = ["isInsideDesktopHeader"],
        ua = (0, g.Pi)(function (e) {
          var t = e.isInsideDesktopHeader,
            n = void 0 !== t && t,
            r = (0, d.Z)(e, la),
            i = o.useState(function () {
              return new Go(r);
            }),
            a = (0, u.Z)(i, 1)[0],
            c = o.useState(function () {
              var e, t;
              return null === (e = r.ufbContext) ||
                void 0 === e ||
                null === (t = e.createStores) ||
                void 0 === t
                ? void 0
                : t.call(e, a);
            }),
            l = (0, u.Z)(c, 1)[0],
            p = o.useState(function () {
              return new ca.X();
            }),
            m = (0, u.Z)(p, 1)[0],
            f = (0, s.QT)(),
            g = f.gettext,
            h = f.locale;
          return (
            (0, o.useEffect)(function () {
              (0, te.Z)(
                re().mark(function e() {
                  var t, n;
                  return re().wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (t = !!r.ufbContext), (e.next = 3), (0, Ht.v)(h, t)
                          );
                        case 3:
                          (n = e.sent), a.setUserSpecificContext(n.data.header);
                        case 5:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              )();
            }, []),
            r.isLoggedIn
              ? o.createElement(
                  Wt.f,
                  Object.assign(
                    {
                      headerStore: a,
                      mobileNavStore: m,
                      ufbContext: r.ufbContext,
                    },
                    l
                  ),
                  o.createElement(
                    o.Fragment,
                    null,
                    !n && o.createElement(Ut.MO, null),
                    o.createElement(
                      "div",
                      {
                        className: ""
                          .concat(Jo().header, " ")
                          .concat(ea().header),
                      },
                      o.createElement(
                        "div",
                        { className: "".concat(Jo().row) },
                        o.createElement(
                          Rt.h,
                          {
                            udStyle: "ghost",
                            cssToggleId: "header-toggle-side-nav",
                            className: "ud-mobile-header-btn",
                            "data-purpose": "side-menu-opener",
                          },
                          o.createElement(Yo(), {
                            label: g("Open side drawer"),
                          })
                        )
                      )
                    ),
                    o.createElement(sa, null)
                  )
                )
              : null
          );
        }),
        da = n(47413),
        pa = n.n(da),
        ma = (0, g.Pi)(function (e) {
          var t,
            n,
            r = e.className,
            i = (0, an.k)(),
            a = (0, c.gL)().Config,
            l = (0, s.QT)().gettext;
          return (
            a.brand.has_organization
              ? ((t = l("Learner")),
                (n = l(
                  "Switch to the learn view here - get back to the courses you\u2019re taking."
                )))
              : ((t = l("Student")),
                (n = l(
                  "Switch to the student view here - get back to the courses you\u2019re taking."
                ))),
            o.createElement(
              Rn,
              {
                className: r,
                a11yRole: "description",
                trigger: o.createElement(
                  An,
                  {
                    componentClass: "a",
                    href: i.instructorURLs.BROWSE,
                    "data-testid": "instructor-dropdown",
                  },
                  t
                ),
              },
              o.createElement(
                Ln,
                null,
                o.createElement(
                  "div",
                  { className: hr().panel, "data-testid": "switch-view-panel" },
                  n
                )
              )
            )
          );
        }),
        fa = (0, g.Pi)(function (e) {
          var t = e.className,
            n = (0, an.k)(),
            r = (0, s.QT)(),
            i = r.gettext,
            a = r.locale,
            l = (0, c.gL)().Config,
            u = function () {
              var e;
              n.tryUFBPlacements &&
                we.j.publishEvent(
                  new Kr.Nj({
                    locale: a,
                    placement:
                      null === (e = n.tryUFBPlacements) || void 0 === e
                        ? void 0
                        : e.profile,
                  })
                );
            },
            d = n.instructorURLs,
            p = n.userSpecificContext.user;
          return o.createElement(
            Rn,
            {
              trigger: o.createElement(
                An,
                {
                  componentClass: "a",
                  href: d.EDIT_PROFILE,
                  udStyle: "image",
                  "aria-label": i("My profile"),
                  "data-purpose": "user-dropdown",
                },
                o.createElement(x.q, {
                  user: p,
                  alt: "NONE",
                  size: "small",
                  "aria-hidden": "true",
                  className: Ri()["dropdown-button-avatar"],
                }),
                o.createElement(Ar.bt, {
                  dot: !0,
                  className: pn()["dropdown-dot-badge"],
                })
              ),
              className: "".concat(t, " ").concat(Yn()["list-menu-container"]),
            },
            o.createElement(
              Ln,
              null,
              o.createElement(
                "a",
                { href: d.EDIT_PROFILE, className: Ri()["user-section"] },
                o.createElement(x.q, { user: p, alt: "NONE" }),
                o.createElement(
                  "div",
                  { className: Ri()["user-details"] },
                  o.createElement(
                    "div",
                    null,
                    o.createElement(
                      "div",
                      { className: "ud-heading-md" },
                      p.display_name
                    ),
                    o.createElement(
                      "div",
                      { className: "ud-text-xs ".concat(Ri().email) },
                      p.email
                    )
                  )
                )
              ),
              o.createElement(
                Hn.W,
                {
                  size: "small",
                  className: Yn().section,
                  iconAlignment: "right",
                },
                l.brand.is_teaching_enabled &&
                  o.createElement(
                    Hn.W.Item,
                    { color: "neutral", href: d.BROWSE },
                    l.brand.has_organization ? i("Learner") : i("Student")
                  )
              ),
              o.createElement(
                Hn.W,
                {
                  size: "small",
                  className: Yn().section,
                  iconAlignment: "right",
                },
                l.features.notifications &&
                  o.createElement(
                    Hn.W.Item,
                    {
                      color: "neutral",
                      href: d.VIEW_NOTIFICATIONS,
                      icon: o.createElement(Ar._T, null),
                    },
                    i("Notifications")
                  )
              ),
              o.createElement(
                Hn.W,
                {
                  size: "small",
                  className: Yn().section,
                  iconAlignment: "right",
                },
                o.createElement(
                  Hn.W.Item,
                  { color: "neutral", href: d.ACCOUNT },
                  i("Account settings")
                ),
                n.isPayoutSettingsEnabled &&
                  o.createElement(
                    Hn.W.Item,
                    { color: "neutral", href: d.PAYOUT_SETTINGS },
                    i("Payout & tax settings")
                  ),
                n.isRevenueReportEnabled &&
                  o.createElement(
                    Hn.W.Item,
                    { color: "neutral", href: d.REVENUE_REPORT },
                    i("Revenue report")
                  )
              ),
              o.createElement(
                Hn.W,
                {
                  size: "small",
                  className: Yn().section,
                  iconAlignment: "right",
                },
                !!(
                  l.brand.is_profile_functions_enabled &&
                  l.brand.is_user_profiles_public &&
                  p.url
                ) &&
                  o.createElement(
                    Hn.W.Item,
                    {
                      color: "neutral",
                      href: p.url,
                      target: "_blank",
                      rel: "nofollow noopener noreferrer",
                    },
                    i("Public profile")
                  ),
                o.createElement(
                  Hn.W.Item,
                  { color: "neutral", href: d.EDIT_PROFILE },
                  i("Edit profile")
                )
              ),
              o.createElement(
                Hn.W,
                {
                  size: "small",
                  className: Yn().section,
                  iconAlignment: "right",
                },
                o.createElement(
                  Hn.W.Item,
                  {
                    color: "neutral",
                    href: d.SUPPORT,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  },
                  i("Help")
                ),
                o.createElement(
                  Hn.W.Item,
                  { color: "neutral", href: p.logout_url },
                  i("Log out")
                )
              ),
              (function () {
                var e,
                  t = n.tryUFBPlacements,
                  r = n.userSpecificContext.productLink;
                return !l.brand.has_organization && r
                  ? o.createElement(
                      "a",
                      {
                        className: Ri()["try-ufb-section"],
                        href: (0, xi.WV)("request-demo", {
                          ref:
                            null !==
                              (e =
                                null === t || void 0 === t
                                  ? void 0
                                  : t.profile) && void 0 !== e
                              ? e
                              : "",
                        }),
                        target: r.isOnsiteRequestDemo ? void 0 : "_blank",
                        rel: r.isOnsiteRequestDemo ? void 0 : "noopener",
                        onClick: u,
                      },
                      o.createElement(
                        "div",
                        null,
                        o.createElement(
                          "div",
                          { className: "ud-heading-md" },
                          "Udemy Business"
                        ),
                        o.createElement(
                          "div",
                          {
                            className: "ud-text-sm ".concat(
                              Ri()["try-ufb-subtitle"]
                            ),
                          },
                          i("Bring learning to your company")
                        )
                      ),
                      o.createElement(Ci(), { size: "medium", label: !1 })
                    )
                  : null;
              })()
            )
          );
        }),
        ga = ["isLoggedIn"];
      function ha(e, t) {
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
      (0, g.Pi)(function (e) {
        var t = e.isLoggedIn,
          n = (0, d.Z)(e, ga),
          r = (0, c.gL)(),
          i = (0, s.QT)(),
          a = i.locale,
          p = o.useState(function () {
            if (r.Config.brand.has_organization) return Mo(r, i);
          }),
          m = (0, u.Z)(p, 1)[0],
          f = o.useState(function () {
            return new Go(
              (function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var n = null != arguments[t] ? arguments[t] : {};
                  t % 2
                    ? ha(Object(n), !0).forEach(function (t) {
                        (0, l.Z)(e, t, n[t]);
                      })
                    : Object.getOwnPropertyDescriptors
                    ? Object.defineProperties(
                        e,
                        Object.getOwnPropertyDescriptors(n)
                      )
                    : ha(Object(n)).forEach(function (t) {
                        Object.defineProperty(
                          e,
                          t,
                          Object.getOwnPropertyDescriptor(n, t)
                        );
                      });
                }
                return e;
              })({ isLoggedIn: t, ufbContext: m }, n)
            );
          }),
          g = (0, u.Z)(f, 1)[0],
          h = o.useState(function () {
            var e = new ee(i);
            return le(e), e;
          }),
          v = (0, u.Z)(h, 1)[0];
        o.useEffect(function () {
          var e = !!m;
          (0, Ht.v)(a, e, function (e) {
            g.setUserSpecificContext(e.data.header),
              v.setUserSpecificContext({
                user: g.userSpecificContext.user,
                userType: "instructor",
              });
          });
        }, []);
        var b = {
          headerStore: g,
          activityNotificationsStore: v,
          ufbContext: m,
        };
        return o.createElement(
          Wt.f,
          b,
          o.createElement(
            Uo.M,
            { headerStore: g, activityNotificationsStore: v, ufbContext: m },
            o.createElement(
              o.Fragment,
              null,
              o.createElement(Ut.MO, null),
              o.createElement(
                "div",
                {
                  className: ""
                    .concat(pn()["mobile-header"], " ")
                    .concat(pa()["mobile-header"]),
                },
                o.createElement(
                  ua,
                  Object.assign({}, n, {
                    isLoggedIn: t,
                    ufbContext:
                      null === m || void 0 === m ? void 0 : m.mobileContext,
                    isInsideDesktopHeader: !0,
                  })
                )
              ),
              o.createElement(
                "div",
                {
                  className: "ud-text-sm "
                    .concat(pn().header, " ")
                    .concat(pa().header),
                  "data-purpose": "header",
                },
                o.createElement("div", { style: { flex: 1 } }),
                t
                  ? o.createElement(
                      o.Fragment,
                      null,
                      null === m || void 0 === m ? void 0 : m.packageAlert,
                      null === m || void 0 === m ? void 0 : m.manageDropdown,
                      r.Config.brand.is_teaching_enabled &&
                        o.createElement(ma, { className: pn()["gap-button"] }),
                      r.Config.features.notifications &&
                        o.createElement(Gr, { className: "" }),
                      o.createElement(fa, { className: "" })
                    )
                  : null
              )
            )
          )
        );
      });
      var va = n(32608),
        ba = n.n(va);
      (0, g.Pi)(function (e) {
        var t = (0, s.QT)(),
          n = t.gettext,
          r = t.locale,
          i = o.useState(function () {
            return new Qt.N(e);
          }),
          a = (0, u.Z)(i, 1)[0];
        o.useEffect(
          function () {
            (0, Ht.v)(r, !0).then(function (e) {
              a.setUserSpecificContext(e.data.header);
            });
          },
          [a, r]
        );
        var c = a.userSpecificContext.organizationState;
        return o.createElement(
          Uo.M,
          null,
          o.createElement(
            "div",
            { className: ba().header },
            o.createElement(
              "a",
              { href: a.urls.BROWSE },
              o.createElement(eo.u, null)
            ),
            o.createElement("div", { style: { flex: 1 } }),
            c &&
              o.createElement(
                C.zx,
                {
                  size: "medium",
                  udStyle: "primary",
                  componentClass: "a",
                  href: "/?next=".concat(
                    encodeURIComponent(window.location.href)
                  ),
                },
                c.is_forced_sso ? n("Log in") : n("Log in or sign up")
              )
          )
        );
      });
    },
    83162: function (e, t, n) {
      "use strict";
      n.d(t, {
        T: function () {
          return m;
        },
      });
      var r = n(4730),
        i = n(67294),
        o = n(41293),
        a = n(36186),
        s = n(47091),
        c = "https://www.udemy.com/frontends-marketplace-experience",
        l = "".concat(c).concat(s.i.udemyLogoUrl),
        u =
          ("".concat(c).concat(s.i.udemyLogoInvertedUrl),
          "".concat(c).concat(s.i.ubLogoUrl),
          "".concat(c).concat(s.i.ubLogoInvertedUrl),
          "".concat(c).concat(s.i.ugLogoUrl),
          "".concat(c).concat(s.i.ugLogoInvertedUrl),
          "".concat(c).concat(s.i.udemyProLogoUrl),
          "".concat(c).concat(s.i.udemyBenesseLogoUrl),
          "".concat(c).concat(s.i.udemyBenesseLogoInvertedUrl),
          n(10870)),
        d = n.n(u),
        p = ["ufbContext"],
        m = function (e) {
          var t,
            n = e.ufbContext,
            s = (0, r.Z)(e, p),
            c = (0, a.gL)();
          function u() {
            return i.createElement(
              o.E,
              Object.assign({ src: l, alt: "Udemy", width: 75, height: 28 }, s)
            );
          }
          return "www.udemy.com" === window.location.hostname
            ? u()
            : c.isGlobalMeContextLoading
            ? i.createElement("div", { className: d()["logo-placeholder"] })
            : null !== (t = null === n || void 0 === n ? void 0 : n.logo) &&
              void 0 !== t
            ? t
            : u();
        };
    },
    15964: function (e, t, n) {
      "use strict";
      n.r(t),
        n.d(t, {
          MobileHeader: function () {
            return de;
          },
        });
      var r = n(59499),
        i = n(50029),
        o = n(87794),
        a = n.n(o),
        s = n(454),
        c = n(92909),
        l = n.n(c),
        u = n(80955),
        d = n(67294),
        p = n(79594),
        m = n(99215),
        f = n.n(m),
        g = n(11577),
        h = n.n(g),
        v = n(10979),
        b = n.n(v),
        y = n(82300),
        _ = n.n(y),
        E = n(543),
        w = n(38349),
        O = n(23290),
        S = n(59957),
        k = n(40027),
        C = n(7754),
        x = n(36186),
        N = n(62032),
        P = n(55306),
        I = n(74245),
        T = n(48525),
        Z = n(83162),
        R = n(28126),
        A = n.n(R),
        L = n(98173),
        j = n(78270),
        D = n(23554),
        M = n(22474),
        z = n(54844),
        U = n(80344),
        F = n(23695),
        B = n(17590),
        W = n(17958),
        H = n(34364),
        Q = n(13133),
        V = n(31209),
        q = n(97198),
        G = n(50385),
        X = n(6276),
        Y = n(29790),
        K = n.n(Y),
        J = function (e) {
          var t = e.useLangPrefixedUrls,
            n = void 0 !== t && t;
          return d.createElement(
            "div",
            { className: K().container },
            d.createElement(M.qg, {
              uiRegion: H.Nc.MOBILE_NAV,
              useLangPrefixedUrls: n,
            })
          );
        },
        $ = n(20633),
        ee = (0, u.Pi)(function () {
          var e,
            t = (0, G.D)();
          return d.createElement(
            $.VO,
            { id: "header-toggle-side-nav-categories" },
            d.createElement(
              $.k9,
              null,
              null === (e = t.navigationCategories) || void 0 === e
                ? void 0
                : e.map(function (e) {
                    return d.createElement(
                      $.kX,
                      {
                        onClick: function () {
                          return (function (e) {
                            var t = {
                              categoryId: e.id,
                              subcategoryId: null,
                              topicId: null,
                            };
                            j.j.publishEvent(new Q.F2({ context: t }));
                          })(e);
                        },
                        key: "mobile-nav-item-".concat(e.id),
                        cssToggleId:
                          "header-toggle-side-nav-subcategories-of-".concat(
                            e.id
                          ),
                        "data-purpose": "category-item",
                      },
                      e.title
                    );
                  })
            )
          );
        }),
        te = (0, u.Pi)(function () {
          var e,
            t = (0, G.D)();
          return d.createElement(
            "span",
            null,
            null === (e = t.mostPopularSubcategories) || void 0 === e
              ? void 0
              : e.map(function (e) {
                  var t;
                  return d.createElement(
                    $.VO,
                    {
                      key: "l1-subcat-id-".concat(e.id),
                      id: "header-toggle-side-nav-popular-topics-of-".concat(
                        e.id
                      ),
                    },
                    d.createElement(
                      $.k9,
                      null,
                      null === (t = e.popularTopics) || void 0 === t
                        ? void 0
                        : t.map(function (t) {
                            return d.createElement(
                              $.kX,
                              {
                                onClick: function () {
                                  return (function (e, t) {
                                    var n = {
                                      categoryId: e.parentId,
                                      subcategoryId: e.id,
                                      topicId: t.id,
                                    };
                                    j.j.publishEvent(new Q.F2({ context: n }));
                                  })(e, t);
                                },
                                key: "mobile-nav-topic-id-".concat(t.id),
                                "data-purpose": "topic-item",
                                href: t.absolute_url || t.url,
                              },
                              t.title
                            );
                          })
                    )
                  );
                })
          );
        }),
        ne = n(17),
        re = n(55830),
        ie = function (e) {
          var t = e.parentCategory,
            n = e.subcategories,
            r = (0, p.QT)(),
            i = r.gettext,
            o = r.interpolate,
            a = (0, x.gL)();
          return d.createElement(
            $.bv,
            {
              id: "header-toggle-side-nav-subcategories-of-".concat(t.id),
              l1NavId: "header-toggle-side-nav-categories",
              l1NavTitle: i("All Categories"),
            },
            d.createElement(
              $.k9,
              null,
              d.createElement(
                $.kX,
                {
                  href: (0, re.W)(
                    t.absolute_url,
                    a.Config.brand.has_organization
                  ),
                },
                d.createElement(
                  "span",
                  { className: "ud-heading-md" },
                  o(i("All %(category)s"), { category: t.title }, !0)
                )
              ),
              null === n || void 0 === n
                ? void 0
                : n.map(function (e) {
                    return d.createElement(
                      $.kX,
                      {
                        onClick: function () {
                          return (function (e) {
                            var n = {
                              categoryId: t.id,
                              subcategoryId: e.id,
                              topicId: null,
                            };
                            j.j.publishEvent(new Q.F2({ context: n }));
                          })(e);
                        },
                        key: "l2-mobile-subcategory-id-".concat(e.id),
                        href: (0, re.W)(
                          e.absolute_url,
                          a.Config.brand.has_organization
                        ),
                        "data-purpose": "subcategory-item",
                      },
                      e.title
                    );
                  })
            )
          );
        },
        oe = n(68303),
        ae = n.n(oe);
      function se(e, t) {
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
      function ce(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? se(Object(n), !0).forEach(function (t) {
                (0, r.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : se(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var le = (0, u.Pi)(function (e) {
          var t,
            n,
            r,
            i = e.useLangPrefixedUrls,
            o = (0, p.QT)(),
            a = o.gettext,
            s = o.locale,
            c = (0, q.k)(),
            l = (0, G.D)(),
            u = (0, X.o)(),
            m = (0, x.gL)(),
            f = m.me,
            g = (0, d.useRef)(null),
            h = (0, d.useState)(!1),
            v = h[0],
            b = h[1];
          function y() {
            var e = c.userSpecificContext.user;
            return null === e || void 0 === e
              ? void 0
              : e.consumer_subscription_active;
          }
          function _() {
            var e,
              t = m.Config;
            return (
              t.brand.has_organization &&
              (t.features.organization.learning_path.pro_path ||
                (null === f ||
                void 0 === f ||
                null === (e = f.organization) ||
                void 0 === e
                  ? void 0
                  : e.is_pro_license_holder))
            );
          }
          function E() {
            var e = c.userSpecificContext.user;
            return null === e || void 0 === e
              ? void 0
              : e.show_updated_pp_and_ub_navigation;
          }
          function w() {
            var e = c.userSpecificContext.user;
            return null === e || void 0 === e
              ? void 0
              : e.show_updated_mx_navigation;
          }
          function O(e) {
            return d.createElement(
              $.kX,
              {
                "data-purpose": "link-".concat(e.type),
                onClick: function () {
                  return (function (e) {
                    j.j.publishEvent(new Q.qf(e.type));
                  })(e);
                },
                href: e.absolute_url,
              },
              e.title
            );
          }
          var S = "ufb_header_mobile";
          function k() {
            j.j.publishEvent(
              new L.Gc({
                locale: s,
                placement: S,
                url: "/udemy-business/request-demo-mx/",
              })
            );
          }
          function C() {
            j.j.publishEvent(
              new L.Nj({
                locale: s,
                placement: S,
                url: "/udemy-business/request-demo-mx/",
              })
            );
          }
          var P = c.userSpecificContext.user;
          return d.createElement(
            $.zM,
            {
              ref: g,
              onToggle: function () {
                b(!1),
                  l.ensureLevelIsLoaded(1),
                  l.loadMostPopularTopicsForSubcategories(s);
              },
              subDrawers:
                null !==
                  (t = null === u || void 0 === u ? void 0 : u.subNavs) &&
                void 0 !== t
                  ? t
                  : (function () {
                      var e;
                      return d.createElement(
                        d.Fragment,
                        null,
                        d.createElement(
                          "div",
                          null,
                          l.isLevelLoaded(2) &&
                            (null === (e = l.navigationCategories) ||
                            void 0 === e
                              ? void 0
                              : e.map(function (e) {
                                  return d.createElement(ie, {
                                    key: "mobile-subcategory-nav-".concat(e.id),
                                    parentCategory: e,
                                    subcategories: e.children,
                                  });
                                })),
                          l.isLevelLoaded(1) && d.createElement(ee, null)
                        ),
                        l.isLevelLoaded(1) && d.createElement(te, null),
                        l.isLevelLoaded(1) && d.createElement(ne.T, null)
                      );
                    })(),
            },
            v
              ? d.createElement(J, { useLangPrefixedUrls: i })
              : d.createElement(
                  d.Fragment,
                  null,
                  (function () {
                    var e = c.userSpecificContext.user;
                    return !e || e.id
                      ? null
                      : d.createElement(
                          $.k9,
                          null,
                          d.createElement(
                            $.kX,
                            {
                              href: x.qJ.toAuth({
                                showLogin: !0,
                                responseType: "html",
                              }),
                              color: "link",
                            },
                            a("Log in")
                          ),
                          d.createElement(
                            $.kX,
                            {
                              href: x.qJ.toAuth(
                                ce(
                                  ce({}, c.signupParams),
                                  {},
                                  { responseType: "html" }
                                )
                              ),
                              color: "link",
                              "data-purpose": "header-signup-mobile-nav",
                            },
                            a("Sign up")
                          )
                        );
                  })(),
                  d.createElement($.f5, {
                    cssToggleId: "header-toggle-side-nav-student-profile",
                    badge: d.createElement(N.bt, {
                      dot: !0,
                      className: ae()["profile-badge"],
                    }),
                  }),
                  null !==
                    (n =
                      null === u || void 0 === u
                        ? void 0
                        : u.manageAndTeachSection) && void 0 !== n
                    ? n
                    : (function () {
                        var e = c.userSpecificContext,
                          t = e.isInstructor,
                          n = e.user;
                        return n && n.id && t
                          ? d.createElement(
                              $.k9,
                              null,
                              d.createElement(
                                $.kX,
                                { href: c.urls.TEACH, color: "link" },
                                a("Switch to instructor view")
                              )
                            )
                          : null;
                      })(),
                  (function () {
                    var e = c.userSpecificContext.user;
                    return e && e.id
                      ? d.createElement(
                          d.Fragment,
                          null,
                          d.createElement($.lr, null, a("Learn")),
                          d.createElement(
                            $.k9,
                            null,
                            d.createElement(
                              $.kX,
                              { href: c.urls.MY_LEARNING },
                              a("My learning")
                            ),
                            e.sms_subscriptions_active &&
                              d.createElement(
                                $.kX,
                                { href: B.Zi, color: "link" },
                                a("All programs")
                              ),
                            c.enableCartOnMobileNav &&
                              c.notificationBadgeContext.cartBuyables > 0 &&
                              d.createElement(
                                $.kX,
                                { href: c.urls.CART },
                                a("My cart")
                              )
                          )
                        )
                      : null;
                  })(),
                  (E() || w()) &&
                    (function () {
                      var e,
                        t = m.Config.brand;
                      return t.organization &&
                        null !== (e = t.organization) &&
                        void 0 !== e &&
                        e.is_enterprise_china
                        ? null
                        : d.createElement(
                            d.Fragment,
                            null,
                            d.createElement(
                              $.lr,
                              { "data-purpose": "section-badges" },
                              a("Explore badges")
                            ),
                            d.createElement(
                              $.k9,
                              null,
                              d.createElement(
                                $.kX,
                                {
                                  "data-purpose": "certifications-link",
                                  onClick: function () {
                                    return (
                                      (e = (0, W.xo)(a).CERTIFICATIONS),
                                      void j.j.publishEvent(new Q.FO(e.type))
                                    );
                                    var e;
                                  },
                                  href: (0, W.xo)(a).CERTIFICATIONS
                                    .absolute_url,
                                },
                                (0, W.xo)(a).CERTIFICATIONS.title
                              )
                            )
                          );
                    })(),
                  (y() || (_() && E())) &&
                    (function () {
                      var e = c.userSpecificContext.user;
                      return d.createElement(
                        d.Fragment,
                        null,
                        d.createElement(
                          $.lr,
                          { "data-purpose": "section-active-learning" },
                          d.createElement(
                            "div",
                            { className: ae()["learning-types-section"] },
                            y() && E()
                              ? a("Explore active learning ")
                              : _() && E()
                              ? a("Explore Pro")
                              : a("Explore by type"),
                            _() && d.createElement(z.Z, null)
                          )
                        ),
                        d.createElement(
                          $.k9,
                          null,
                          ((null === e || void 0 === e
                            ? void 0
                            : e.enableLabsInPersonalPlan) ||
                            _()) &&
                            O((0, W.Qm)(a).LABS),
                          O((0, W.Qm)(a).ASSESSMENTS),
                          _() && E() && O((0, W.Qm)(a).UDEMY_PRO_PATHS)
                        )
                      );
                    })(),
                  null !==
                    (r =
                      null === u || void 0 === u ? void 0 : u.browseSection) &&
                    void 0 !== r
                    ? r
                    : d.createElement(
                        d.Fragment,
                        null,
                        d.createElement(
                          $.lr,
                          null,
                          y() || w()
                            ? a("Explore by category")
                            : a("Most popular")
                        ),
                        d.createElement(
                          $.k9,
                          null,
                          l.mostPopularSubcategories
                            ? l.mostPopularSubcategories.map(function (e) {
                                return d.createElement(
                                  $.kX,
                                  {
                                    onClick: function () {
                                      return (function (e) {
                                        var t = {
                                          categoryId: e.parentId,
                                          subcategoryId: e.id,
                                          topicId: null,
                                        };
                                        j.j.publishEvent(
                                          new Q.F2({ context: t })
                                        );
                                      })(e);
                                    },
                                    key: "most-popular-subcategory-item-".concat(
                                      e.id
                                    ),
                                    cssToggleId:
                                      "header-toggle-side-nav-popular-topics-of-".concat(
                                        e.id
                                      ),
                                    "data-purpose":
                                      "most-popular-subcategory-item",
                                  },
                                  e.title
                                );
                              })
                            : (0, F.w)(V.UC.length).map(function (e) {
                                return d.createElement($.kX, {
                                  key: "most-popular-id-".concat(e),
                                  loading: !0,
                                });
                              }),
                          l.navigationCategories
                            ? d.createElement(
                                $.kX,
                                {
                                  cssToggleId:
                                    "header-toggle-side-nav-categories",
                                },
                                a("All categories")
                              )
                            : d.createElement($.kX, { loading: !0 })
                        )
                      ),
                  (function () {
                    var e = m.Config,
                      t = c.mobileAppLink,
                      n = c.urls,
                      r = e.brand.has_organization;
                    return d.createElement(
                      d.Fragment,
                      null,
                      d.createElement($.lr, null, a("More from Udemy")),
                      d.createElement(
                        $.k9,
                        null,
                        !r &&
                          d.createElement(
                            $.kX,
                            {
                              href: (0, U.WV)("request-demo", { ref: S }),
                              target: "_blank",
                              rel: "noopener noreferrer",
                              "data-purpose": "try-ufb-link",
                              onClick: C,
                            },
                            d.createElement(
                              D.H,
                              { trackFunc: k },
                              d.createElement("div", null, a("Udemy Business"))
                            )
                          ),
                        d.createElement(
                          $.kX,
                          {
                            href: null === t || void 0 === t ? void 0 : t.url,
                            target: "_blank",
                            rel: "noopener noreferrer",
                          },
                          a("Get the app")
                        ),
                        !r &&
                          d.createElement(
                            $.kX,
                            { href: n.INVITE },
                            a("Invite friends")
                          ),
                        d.createElement(
                          $.kX,
                          {
                            href: n.SUPPORT,
                            target: "_blank",
                            rel: "noopener noreferrer",
                          },
                          a("Help")
                        )
                      )
                    );
                  })(),
                  d.createElement(
                    "div",
                    {
                      className: ae()["nav-item"],
                      "data-testid": "language-selector",
                    },
                    d.createElement(M.i4, {
                      publishEvents: { uiRegion: H.Nc.MOBILE_NAV },
                      onClick: function () {
                        var e;
                        b(!0),
                          null === (e = g.current) ||
                            void 0 === e ||
                            e.scrollTo(0, 0);
                      },
                    }),
                    P && d.createElement(M.eJ, null)
                  )
                )
          );
        }),
        ue = n(19391),
        de = (0, u.Pi)(function (e) {
          var t = e.searchPhrase,
            n = void 0 === t ? "" : t,
            o = e.ufbContext,
            c = e.isInsideDesktopHeader,
            u = void 0 !== c && c,
            m = e.persistentSearch,
            g = void 0 !== m && m,
            v = e.showAutocompletePopularQueriesOnEmptyState,
            y = void 0 === v ? "disabled" : v,
            R = e.shoppingClient,
            L = e.useLangPrefixedUrls,
            j = void 0 !== L && L,
            D = e.mobileAppLink,
            M = !!o,
            z = (0, x.gL)().Config,
            U = (0, p.QT)(),
            F = U.gettext,
            B = U.locale,
            W = (0, d.useState)(function () {
              return new ue.X();
            })[0],
            H = (0, d.useState)(!1),
            Q = H[0],
            V = H[1],
            q = (0, d.useState)(function () {
              return new T.N({
                mobileAppLink: D,
                ufbContext: o,
                shoppingClient: R,
              });
            })[0],
            G = (0, d.useState)(function () {
              return new k.lJ({
                url: q.urls.SEARCH_SUGGESTIONS,
                getFormParams: function () {
                  return q.formActionParams;
                },
                isPopularQueriesExperimentEnabled: "enabled" === y,
                gettext: F,
                inputValue: n,
              });
            })[0],
            X = (0, d.useMemo)(
              function () {
                var e;
                return null === o ||
                  void 0 === o ||
                  null === (e = o.createStores) ||
                  void 0 === e
                  ? void 0
                  : e.call(o, q);
              },
              [q, o]
            ),
            Y = (0, d.useRef)(),
            K = (0, d.useRef)(),
            J = (0, d.useState)(!1),
            $ = J[0],
            ee = J[1];
          function te(e, t) {
            return d.createElement(
              "div",
              {
                className: l()(
                  "ud-header",
                  A().header,
                  A()["with-shadow"],
                  (0, r.Z)({}, A().floating, t)
                ),
                "data-testid": "mobile-header",
              },
              d.createElement(
                "div",
                { className: l()(A().row) },
                d.createElement(
                  O.h,
                  {
                    udStyle: "ghost",
                    cssToggleId: "header-toggle-side-nav",
                    className: "ud-mobile-header-btn",
                    "data-purpose": "side-menu-opener",
                  },
                  d.createElement(b(), {
                    color: "neutral",
                    label: F("Open side drawer"),
                  })
                ),
                e.features.shopping_cart &&
                  q.showCartDropdown &&
                  d.createElement("div", {
                    className: l()(A()["button-spacer"]),
                  }),
                d.createElement(
                  "div",
                  { className: l()(A().row, A().middle) },
                  d.createElement(
                    "a",
                    { href: q.urls.BROWSE },
                    d.createElement(Z.T, {
                      ufbContext: o,
                      width: 75,
                      height: 28,
                      style: { verticalAlign: "middle" },
                    })
                  )
                ),
                d.createElement(
                  O.h,
                  {
                    udStyle: "ghost",
                    cssToggleId: "header-toggle-search-bar",
                    className: "ud-mobile-header-btn",
                  },
                  d.createElement(_(), {
                    id: "mobile-header-open-search-icon",
                    color: "neutral",
                    label: F("Open search"),
                  })
                ),
                e.features.shopping_cart &&
                  q.showCartDropdown &&
                  d.createElement(
                    O.h,
                    {
                      udStyle: "ghost",
                      componentClass: "a",
                      href: q.urls.CART,
                      overlaychildren: d.createElement(N.HT, {
                        className: l()(A()["cart-badge"]),
                      }),
                      className: "ud-mobile-header-btn",
                    },
                    d.createElement(f(), {
                      color: "neutral",
                      label: F("Go to cart"),
                    })
                  )
              )
            );
          }
          return (
            (0, d.useEffect)(function () {
              (0, i.Z)(
                a().mark(function e() {
                  var t;
                  return a().wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.next = 2), (0, I.v)(B, M);
                        case 2:
                          (t = e.sent),
                            q.setUserSpecificContext(t.data.header),
                            G.setSearchFormExperimentFeatures(
                              q.userSpecificContext.searchFormExperimentFeatures
                            ),
                            W.loadNavigationCategories(t.data.header);
                        case 6:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              )();
            }, []),
            d.createElement(
              P.f,
              Object.assign({ headerStore: q, mobileNavStore: W }, X, {
                ufbContext: o,
              }),
              d.createElement(
                d.Fragment,
                null,
                d.createElement(E.J, {
                  id: "header-toggle-search-bar",
                  className: "ud-full-page-overlay-checkbox",
                  onChange: function (e) {
                    var t,
                      r,
                      i = (0, w.C)(e);
                    null === (t = Y.current) || void 0 === t || t.onToggle(i),
                      n && !Q && i && (G.setInputValue(n || ""), V(!0)),
                      i ? G.openMenu() : G.closeMenu(),
                      null === (r = K.current) || void 0 === r || r.focus();
                  },
                  closeOnEscape: !0,
                }),
                !u &&
                  q.userSpecificContext.user &&
                  d.createElement(C.MO, {
                    isPersonalPlanSubscriber: q.isPersonalPlanSubscriber,
                    isUdemyBusinessSubscriber:
                      Object.keys(null !== o && void 0 !== o ? o : {}).length >
                      0,
                  }),
                !u &&
                  q.userSpecificContext.user &&
                  d.createElement(C.NG, { disableHideButtonWhenVisible: !0 }),
                d.createElement(
                  s.ZP,
                  {
                    onChange: function (e) {
                      var t = e.boundingClientRect.top;
                      $ && t >= 0 && ee(!1);
                    },
                  },
                  d.createElement("span", { className: l()(A().mark) })
                ),
                d.createElement(
                  s.ZP,
                  {
                    onChange: function (e) {
                      var t = e.intersectionRatio;
                      $ || 0 !== t || ee(!0);
                    },
                  },
                  te(z, !1)
                ),
                $ && g && te(z, !0),
                d.createElement(
                  S.U,
                  {
                    ref: Y,
                    labelledById: "header-mobile-search-bar-title",
                    findNodeToFocusOn: function () {
                      return document.getElementById(
                        "header-mobile-search-bar"
                      );
                    },
                    className: l()(A()["search-bar"], A()["search-bar-layer"]),
                  },
                  d.createElement(
                    O.h,
                    {
                      udStyle: "ghost",
                      cssToggleId: "header-toggle-search-bar",
                      className: l()(
                        "ud-mobile-header-btn",
                        A()["search-bar-close"]
                      ),
                    },
                    d.createElement(h(), {
                      color: "neutral",
                      label: F("Close search"),
                    })
                  ),
                  d.createElement(
                    "span",
                    { className: "ud-sr-only" },
                    F("Search bar")
                  ),
                  d.createElement(k.a4, {
                    searchFormAutocompleteStore: G,
                    id: "header-mobile-search-bar",
                    formAction: q.urls.SEARCH,
                    formActionParams: q.formActionParams,
                    label: (function () {
                      var e, t;
                      return M &&
                        null !== (e = q.userSpecificContext) &&
                        void 0 !== e &&
                        null !== (t = e.user) &&
                        void 0 !== t &&
                        t.enable_in_lecture_search_segments
                        ? F("What would you like to learn today?")
                        : F("Search for anything");
                    })(),
                    inputProps: {
                      className: "js-header-search-field",
                      name: "q",
                    },
                    reversed: !0,
                    className: l()(A()["search-bar-form"]),
                    showResultsWithImage:
                      !z.brand.has_organization && !q.isPersonalPlanSubscriber,
                  })
                ),
                d.createElement(le, { useLangPrefixedUrls: j })
              )
            )
          );
        });
    },
    17: function (e, t, n) {
      "use strict";
      n.d(t, {
        T: function () {
          return u;
        },
      });
      var r = n(80955),
        i = n(67294),
        o = n(79594),
        a = n(36186),
        s = n(62032),
        c = n(97198),
        l = n(20633),
        u = (0, r.Pi)(function () {
          var e = (0, a.gL)().Config,
            t = (0, o.QT)().gettext,
            n = (0, c.k)(),
            r = n.urls;
          function u(e, t) {
            return 0 ===
              i.Children.toArray(t.props.children).filter(Boolean).length
              ? null
              : i.createElement(
                  i.Fragment,
                  null,
                  i.createElement(l.lr, null, e),
                  t
                );
          }
          var d = n.userSpecificContext.user;
          return d && d.id
            ? i.createElement(
                l.VO,
                { id: "header-toggle-side-nav-student-profile" },
                u(
                  t("Alerts"),
                  i.createElement(
                    l.k9,
                    null,
                    e.features.notifications &&
                      i.createElement(
                        l.kX,
                        {
                          href: r.VIEW_NOTIFICATIONS,
                          icon: i.createElement(s._T, null),
                        },
                        t("Notifications")
                      ),
                    e.brand.is_messaging_enabled &&
                      i.createElement(
                        l.kX,
                        { href: r.MESSAGES, icon: i.createElement(s.JJ, null) },
                        t("Messages")
                      ),
                    !n.isPersonalPlanSubscriber &&
                      e.features.wishlist &&
                      i.createElement(l.kX, { href: r.WISHLIST }, t("Wishlist"))
                  )
                ),
                u(
                  t("Account"),
                  i.createElement(
                    l.k9,
                    null,
                    i.createElement(
                      l.kX,
                      { href: r.ACCOUNT },
                      t("Account settings")
                    ),
                    !e.brand.has_organization &&
                      i.createElement(
                        l.kX,
                        { href: r.PAYMENT_METHODS },
                        t("Payment methods")
                      ),
                    (function () {
                      var e = n.urls;
                      return n.userSpecificContext.isSubscriptionAware
                        ? i.createElement(
                            l.kX,
                            { href: e.SUBSCRIPTION_MANAGEMENT },
                            t("Subscriptions")
                          )
                        : null;
                    })(),
                    !e.brand.has_organization &&
                      i.createElement(
                        l.kX,
                        { href: r.CREDITS, icon: i.createElement(s.iO, null) },
                        t("Udemy credits")
                      ),
                    !e.brand.has_organization &&
                      i.createElement(
                        l.kX,
                        { href: r.PURCHASE_HISTORY },
                        t("Purchase history")
                      )
                  )
                ),
                (function () {
                  var o = n.userSpecificContext.user;
                  return u(
                    t("Profile"),
                    i.createElement(
                      l.k9,
                      null,
                      !!(
                        e.brand.is_profile_functions_enabled &&
                        e.brand.is_user_profiles_public &&
                        o.url
                      ) &&
                        i.createElement(
                          l.kX,
                          {
                            href: o.url,
                            target: "_blank",
                            rel: "nofollow noopener noreferrer",
                          },
                          t("Public profile")
                        ),
                      i.createElement(
                        l.kX,
                        { href: r.EDIT_PROFILE },
                        t("Edit profile")
                      ),
                      i.createElement(
                        l.kX,
                        { href: o.logout_url },
                        t("Log out")
                      )
                    )
                  );
                })()
              )
            : null;
        });
    },
    19391: function (e, t, n) {
      "use strict";
      n.d(t, {
        X: function () {
          return S;
        },
      });
      var r,
        i,
        o,
        a,
        s,
        c,
        l = n(59499),
        u = n(90116),
        d = n(50029),
        p = n(92777),
        m = n(82262),
        f = n(87794),
        g = n.n(f),
        h = n(43269),
        v = n(53229),
        b = n(22188),
        y = n(17958),
        _ = n(34364),
        E = n(31209);
      function w(e, t) {
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
      function O(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? w(Object(n), !0).forEach(function (t) {
                (0, l.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : w(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var S =
        ((r = b.LO.ref),
        (i = b.LO.ref),
        (o = (function () {
          function e() {
            var t = this;
            (0, p.Z)(this, e),
              (0, h.Z)(this, "maxLoadedLevel", a, this),
              (0, h.Z)(this, "navigationCategories", s, this),
              (0, h.Z)(this, "mostPopularSubcategories", c, this),
              (this.loadNavigationCategories = (function () {
                var e = (0, d.Z)(
                  g().mark(function e(n) {
                    var r, i;
                    return g().wrap(function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            (r = n.user),
                              (i = n.navigationCategories.map(function (e) {
                                var t = e.sd_tag,
                                  n = e.sublist.items.map(function (e) {
                                    var n = e.sd_tag;
                                    return r.consumer_subscription_active &&
                                      _.Cf.includes(n.id)
                                      ? null
                                      : {
                                          id: n.id,
                                          parentId: t.id,
                                          title: n.title,
                                          absolute_url: n.url,
                                          type: y.UQ.SUBCATEGORY,
                                        };
                                  });
                                return {
                                  id: t.id,
                                  title: t.title,
                                  absolute_url: t.url,
                                  type: y.UQ.CATEGORY,
                                  children: n.filter(Boolean),
                                };
                              })),
                              (0, b.z)(function () {
                                t.navigationCategories = i;
                              });
                          case 3:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                  })
                );
                return function (t) {
                  return e.apply(this, arguments);
                };
              })()),
              (this.loadMostPopularTopicsForSubcategories = (function () {
                var e = (0, d.Z)(
                  g().mark(function e(n) {
                    var r, i;
                    return g().wrap(function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (e.next = 2), (0, E.xW)(n);
                          case 2:
                            (r = e.sent),
                              (i = t.navigationCategories
                                .reduce(function (e, t) {
                                  var n = t.children;
                                  return [].concat((0, u.Z)(e), (0, u.Z)(n));
                                }, [])
                                .filter(function (e) {
                                  var t = e.id;
                                  return E.UC.includes(t);
                                })
                                .map(function (e) {
                                  return O(
                                    O({}, e),
                                    {},
                                    { popularTopics: r[e.id] }
                                  );
                                })),
                              (0, b.z)(function () {
                                t.mostPopularSubcategories = i;
                              });
                          case 5:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                  })
                );
                return function (t) {
                  return e.apply(this, arguments);
                };
              })());
          }
          return (
            (0, m.Z)(e, [
              {
                key: "isLevelLoaded",
                value: function (e) {
                  return e <= this.maxLoadedLevel;
                },
              },
              {
                key: "ensureLevelIsLoaded",
                value: function (e) {
                  this.maxLoadedLevel = Math.max(this.maxLoadedLevel, e);
                },
              },
            ]),
            e
          );
        })()),
        (a = (0, v.Z)(o.prototype, "maxLoadedLevel", [b.LO], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            return 0;
          },
        })),
        (s = (0, v.Z)(o.prototype, "navigationCategories", [r], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            return null;
          },
        })),
        (c = (0, v.Z)(o.prototype, "mostPopularSubcategories", [i], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            return null;
          },
        })),
        (0, v.Z)(
          o.prototype,
          "ensureLevelIsLoaded",
          [b.aD],
          Object.getOwnPropertyDescriptor(o.prototype, "ensureLevelIsLoaded"),
          o.prototype
        ),
        o);
    },
    20633: function (e, t, n) {
      "use strict";
      n.d(t, {
        zM: function () {
          return A;
        },
        kX: function () {
          return D;
        },
        VO: function () {
          return z;
        },
        bv: function () {
          return U;
        },
        k9: function () {
          return j;
        },
        lr: function () {
          return L;
        },
        f5: function () {
          return F;
        },
      });
      var r = n(4730),
        i = n(80955),
        o = n(67294),
        a = n(79594),
        s = n(93630),
        c = n.n(s),
        l = n(76185),
        u = n.n(l),
        d = n(54742),
        p = n(57514),
        m = n(35679),
        f = n(59499),
        g = n(86593),
        h = n(38349),
        v = n(94184),
        b = n.n(v),
        y = n(66514),
        _ = n(33935),
        E = n.n(_),
        w = ["className", "children", "id", "level", "onSelect", "style"];
      function O(e, t) {
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
      function S(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? O(Object(n), !0).forEach(function (t) {
                (0, f.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : O(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var k = function (e) {
          var t = e.className,
            n = e.children,
            i = e.id,
            a = e.level,
            s = e.onSelect,
            c = e.style,
            l = (0, r.Z)(e, w),
            u = o.createRef();
          return o.createElement(
            o.Fragment,
            null,
            o.createElement(y.b, {
              id: i,
              onChange: function (e) {
                (0, h.C)(e) &&
                  (null === s || void 0 === s || s(), (0, g.gS)(u.current));
              },
            }),
            o.createElement(
              "div-l".concat(a),
              S(
                S({}, l),
                {},
                {
                  class: b()(t, "js-drawer", E()["side-drawer"]),
                  style: S(S({}, c), {}, { zIndex: a }),
                }
              ),
              o.createElement(
                "div",
                { ref: u, className: E()["drawer-content"] },
                n
              )
            )
          );
        },
        C = n(97198),
        x = n(50385),
        N = n(68303),
        P = n.n(N),
        I = ["children"],
        T = ["title", "children"],
        Z = ["id", "l1NavId", "l1NavTitle", "children"],
        R = ["badge"],
        A = o.forwardRef(function (e, t) {
          var n = (0, a.QT)().gettext;
          return o.createElement(
            m.j,
            Object.assign(
              {
                ref: t,
                id: "header-toggle-side-nav",
                mainDrawerId: "header-toggle-side-nav-main",
                title: n("Site navigation"),
                side: "left",
                className: P().nav,
              },
              e
            )
          );
        }),
        L = function (e) {
          var t = e.children,
            n = (0, r.Z)(e, I);
          return o.createElement(
            "h2",
            Object.assign(
              {
                className: "ud-heading-sm ".concat(P()["nav-section-heading"]),
              },
              n
            ),
            t
          );
        },
        j = function (e) {
          return o.createElement(
            d.W,
            Object.assign(
              {
                className: P()["nav-section"],
                size: "large",
                iconAlignment: "right",
              },
              e
            )
          );
        },
        D = function (e) {
          var t = { color: "neutral" },
            n = (0, a.QT)().gettext;
          return (
            "cssToggleId" in e &&
              ((t.componentClass = "button"),
              (t.icon = o.createElement(c(), { label: n("Expand") }))),
            o.createElement(
              d.W.Item,
              Object.assign({}, t, { className: P()["nav-item"] }, e)
            )
          );
        },
        M = function (e) {
          var t = (0, a.QT)().gettext;
          return o.createElement(
            d.W.Item,
            Object.assign(
              {
                componentClass: "button",
                cssToggleId: "header-toggle-side-nav-main",
                color: "neutral",
                icon: o.createElement(u(), { label: t("Go back") }),
                className: ""
                  .concat(P()["nav-item"], " ")
                  .concat(P().highlighted),
              },
              e
            )
          );
        },
        z = function (e) {
          var t,
            n = e.title,
            i = e.children,
            s = (0, r.Z)(e, T),
            c = (0, x.D)(),
            l = (0, a.QT)().gettext;
          return (
            (n = null !== (t = n) && void 0 !== t ? t : l("Menu")),
            o.createElement(
              k,
              Object.assign(
                {
                  level: 1,
                  className: P().nav,
                  onSelect: function () {
                    return c.ensureLevelIsLoaded(2);
                  },
                },
                s
              ),
              o.createElement(
                d.W,
                { size: "large", padding: "loose" },
                o.createElement(M, null, n)
              ),
              i
            )
          );
        },
        U = function (e) {
          var t = e.id,
            n = e.l1NavId,
            i = e.l1NavTitle,
            s = e.children,
            c = (0, r.Z)(e, Z),
            l = (0, a.QT)().gettext;
          return o.createElement(
            k,
            Object.assign({ id: t, level: 2, className: P().nav }, c),
            o.createElement(
              d.W,
              { size: "large", padding: "loose" },
              o.createElement(M, null, l("Menu")),
              o.createElement(
                M,
                {
                  cssToggleId: n,
                  className: ""
                    .concat(P()["nav-item"], " ")
                    .concat(P().underlined),
                },
                i
              )
            ),
            s
          );
        },
        F = (0, i.Pi)(function (e) {
          var t = e.badge,
            n = (0, r.Z)(e, R),
            i = (0, a.QT)(),
            s = i.gettext,
            c = i.interpolate,
            l = (0, C.k)().userSpecificContext.user;
          return l && l.id
            ? o.createElement(
                j,
                { padding: "loose", className: P()["welcome-section"] },
                o.createElement(
                  D,
                  Object.assign({}, n, {
                    className: ""
                      .concat(P()["nav-item"], " ")
                      .concat(P().highlighted),
                  }),
                  o.createElement(
                    "span",
                    { className: P()["welcome-section-content"] },
                    o.createElement(
                      "span",
                      {
                        style: { display: "inline-flex", position: "relative" },
                      },
                      o.createElement(p.q, { user: l, alt: "NONE" }),
                      t
                    ),
                    o.createElement(
                      "span",
                      { style: { flex: 1 } },
                      o.createElement(
                        "span",
                        {
                          className: "ud-heading-md ".concat(
                            P()["profile-name"]
                          ),
                        },
                        c(s("Hi, %(name)s"), { name: l.display_name }, !0)
                      ),
                      o.createElement(
                        "span",
                        {
                          className: "ud-text-sm ".concat(
                            P()["profile-welcome"]
                          ),
                        },
                        s("Welcome back")
                      )
                    )
                  )
                )
              )
            : null;
        });
    },
    18614: function (e, t, n) {
      "use strict";
      n.d(t, {
        C: function () {
          return d;
        },
      });
      var r = n(4730),
        i = n(79594),
        o = n(94184),
        a = n.n(o),
        s = n(67294),
        c = n(96407),
        l = n.n(c),
        u = ["label", "children", "className"],
        d = function (e) {
          var t = e.label,
            n = e.children,
            o = void 0 === n ? null : n,
            c = e.className,
            d = (0, r.Z)(e, u),
            p = (0, i.QT)().gettext,
            m = null === o,
            f = a()(
              c,
              l()["ud-notification-badge"],
              m ? l()["ud-notification-dot"] : l()["ud-notification-counter"]
            ),
            g = o;
          if (!m) {
            var h = "string" === typeof o ? parseInt(o, 10) : o;
            if (!h || h <= 0) return null;
            h && h > 9 && (g = p("9+"));
          }
          return s.createElement(
            "span",
            Object.assign({}, d, { className: f, title: t }),
            g
          );
        };
    },
    36834: function (e, t, n) {
      "use strict";
      n.d(t, {
        x: function () {
          return c;
        },
      });
      var r = n(80955),
        i = n(67294),
        o = n(28538),
        a = n(32623),
        s = n.n(a),
        c = Object.assign(
          (0, r.Pi)(function () {
            if (!o.n.toasts.size) return null;
            var e = [];
            return (
              o.n.toasts.forEach(function (t) {
                return e.push(t.toastComponent);
              }),
              i.createElement("div", { className: s().toaster }, e)
            );
          }),
          { displayName: "Toaster" }
        );
    },
    56073: function (e, t, n) {
      "use strict";
      n.d(t, {
        Y: function () {
          return h;
        },
        r: function () {
          return v;
        },
      });
      var r = n(59499),
        i = n(4730),
        o = n(94184),
        a = n.n(o),
        s = n(33326),
        c = n.n(s),
        l = n(67294),
        u = n(40836),
        d = n(63427),
        p = n.n(d),
        m = ["forwardedRef", "withArrow", "withPadding", "renderContent"];
      function f(e, t) {
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
      function g(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? f(Object(n), !0).forEach(function (t) {
                (0, r.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : f(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      function h(e, t) {
        var n = function (t) {
          var n,
            o = t.forwardedRef,
            s = t.withArrow,
            c = void 0 === s || s,
            d = t.withPadding,
            f = void 0 === d || d,
            g = t.renderContent,
            h =
              void 0 === g
                ? null === (n = e.defaultProps) || void 0 === n
                  ? void 0
                  : n.renderContent
                : g,
            v = (0, i.Z)(t, m);
          return l.createElement(
            e,
            Object.assign({ ref: o }, v, {
              renderContent: function (e, t, n) {
                var i,
                  o = (0, u.rw)(t),
                  s = "popover-".concat(o);
                if (c && null !== n) {
                  s = "".concat(s, "-arrow");
                  var d,
                    m = "".concat(n, "px");
                  switch (o) {
                    case "top":
                      d = { top: "100%", left: m };
                      break;
                    case "bottom":
                      d = { top: 0, left: m };
                      break;
                    case "left":
                      d = { top: m, left: "100%" };
                      break;
                    case "right":
                      d = { top: m, left: 0 };
                  }
                  i = l.createElement("div", {
                    className: a()(p().arrow, p()["arrow-".concat(o)]),
                    style: d,
                  });
                }
                return (
                  (e.children = l.createElement(
                    "div",
                    {
                      className: a()(
                        p().popover,
                        p()[s],
                        (0, r.Z)({}, p()["popover-padding"], f)
                      ),
                    },
                    l.createElement(
                      "div",
                      { className: p().inner },
                      e.children
                    ),
                    i
                  )),
                  null === h || void 0 === h ? void 0 : h(e, t, n)
                );
              },
            })
          );
        };
        return Object.assign(
          l.forwardRef(function (e, t) {
            return l.createElement(
              n,
              Object.assign({}, e, { forwardedRef: t })
            );
          }),
          {
            propTypes: g(
              g({}, t),
              {},
              { withArrow: c().bool, withPadding: c().bool }
            ),
            defaultProps: g(
              g({}, e.defaultProps),
              {},
              { withArrow: !0, withPadding: !0 }
            ),
          }
        );
      }
      var v = h(u.H_, u.dP);
      v.displayName = "BasicPopover";
    },
    85772: function (e, t, n) {
      "use strict";
      n.d(t, {
        J: function () {
          return i;
        },
      });
      var r = n(22147),
        i = (0, n(56073).Y)(r.r, r.r.propTypes);
      i.displayName = "Popover";
    },
    22147: function (e, t, n) {
      "use strict";
      n.d(t, {
        r: function () {
          return H;
        },
      });
      var r,
        i,
        o,
        a,
        s,
        c,
        l,
        u,
        d,
        p = n(4730),
        m = n(17674),
        f = n(59499),
        g = n(92777),
        h = n(82262),
        v = n(10748),
        b = n(45959),
        y = n(63553),
        _ = n(37247),
        E = n(43269),
        w = n(53229),
        O = n(95361),
        S = n(36526),
        k = n(68132),
        C = n(34278),
        x = n(95590),
        N = n(65982),
        P = n(88309),
        I = n(22188),
        T = n(80955),
        Z = n(33326),
        R = n.n(Z),
        A = n(67294),
        L = n(73935),
        j = n(40836),
        D = ["detachFromTarget"];
      function M(e, t) {
        var n =
          ("undefined" !== typeof Symbol && e[Symbol.iterator]) ||
          e["@@iterator"];
        if (!n) {
          if (
            Array.isArray(e) ||
            (n = (function (e, t) {
              if (!e) return;
              if ("string" === typeof e) return z(e, t);
              var n = Object.prototype.toString.call(e).slice(8, -1);
              "Object" === n && e.constructor && (n = e.constructor.name);
              if ("Map" === n || "Set" === n) return Array.from(e);
              if (
                "Arguments" === n ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
              )
                return z(e, t);
            })(e)) ||
            (t && e && "number" === typeof e.length)
          ) {
            n && (e = n);
            var r = 0,
              i = function () {};
            return {
              s: i,
              n: function () {
                return r >= e.length
                  ? { done: !0 }
                  : { done: !1, value: e[r++] };
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
            n = n.call(e);
          },
          n: function () {
            var e = n.next();
            return (a = e.done), e;
          },
          e: function (e) {
            (s = !0), (o = e);
          },
          f: function () {
            try {
              a || null == n.return || n.return();
            } finally {
              if (s) throw o;
            }
          },
        };
      }
      function z(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function U(e, t) {
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
      function F(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? U(Object(n), !0).forEach(function (t) {
                (0, f.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : U(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
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
          var n,
            r = (0, _.Z)(e);
          if (t) {
            var i = (0, _.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, y.Z)(this, n);
        };
      }
      var W = { top: "bottom", left: "right", right: "left", bottom: "top" },
        H =
          ((r = I.LO.ref),
          (i = I.LO.ref),
          (0, T.Pi)(
            ((d = (function (e) {
              (0, b.Z)(n, e);
              var t = B(n);
              function n(e) {
                var r, i;
                return (
                  (0, g.Z)(this, n),
                  (r = t.call(this, e)),
                  (i = (0, v.Z)(r)),
                  (r.ref = void 0),
                  (r.triggerNode = void 0),
                  (r.contentNode = void 0),
                  (r.debouncedUpdatePlacement = void 0),
                  (r.disposeForceTabOrder = x.Z),
                  (r.isScrollListenerSetUp = void 0),
                  (r.POPPER_PLACEMENT = j.AM),
                  (0, E.Z)((0, v.Z)(r), "forcedPlacement", s, (0, v.Z)(r)),
                  (0, E.Z)((0, v.Z)(r), "position", c, (0, v.Z)(r)),
                  (0, E.Z)(
                    (0, v.Z)(r),
                    "detachedFromTargetPosition",
                    l,
                    (0, v.Z)(r)
                  ),
                  (0, E.Z)((0, v.Z)(r), "updatePlacement", u, (0, v.Z)(r)),
                  (r.onToggle = function (e) {
                    var t, n;
                    null === (t = (n = r.props).onToggle) ||
                      void 0 === t ||
                      t.call(n, e),
                      e &&
                        r.contentNode &&
                        ((r.contentNode.style.opacity = (0).toString()),
                        setTimeout(function () {
                          r.updatePlacement(),
                            r.contentNode && (r.contentNode.style.opacity = "");
                        }, 0));
                  }),
                  (r.onEscape = function (e, t) {
                    var n;
                    null === (n = r.ref.current) ||
                      void 0 === n ||
                      n.onRootClose(e, t, O.ym.KEYBOARD);
                  }),
                  (r.renderContent = function (e) {
                    for (
                      var t,
                        n,
                        r,
                        o,
                        a,
                        s,
                        c,
                        l,
                        u =
                          null !== (n = i.position) && void 0 !== n
                            ? n
                            : j.AM[
                                null !== (r = i.forcedPlacement) && void 0 !== r
                                  ? r
                                  : i.props.placement
                              ],
                        d = arguments.length,
                        p = new Array(d > 1 ? d - 1 : 0),
                        m = 1;
                      m < d;
                      m++
                    )
                      p[m - 1] = arguments[m];
                    return i.props.detachFromTarget
                      ? ((u = i.detachedFromTargetPosition),
                        L.createPortal(
                          A.createElement(
                            Q,
                            { onEscape: i.onEscape },
                            null === (c = (l = i.props).renderContent) ||
                              void 0 === c
                              ? void 0
                              : (s = c).call.apply(
                                  s,
                                  [l, F(F({}, e), {}, { style: u })].concat(p)
                                )
                          ),
                          document.body
                        ))
                      : null === (o = (a = i.props).renderContent) ||
                        void 0 === o
                      ? void 0
                      : (t = o).call.apply(
                          t,
                          [a, F(F({}, e), {}, { style: u })].concat(p)
                        );
                  }),
                  (r.ref = A.createRef()),
                  (r.debouncedUpdatePlacement = (0, N.D)(
                    r.updatePlacement,
                    16
                  )),
                  r
                );
              }
              return (
                (0, h.Z)(n, [
                  {
                    key: "componentDidMount",
                    value: function () {
                      var e,
                        t,
                        n = this;
                      if (
                        ((this.triggerNode =
                          null === (e = this.ref.current) || void 0 === e
                            ? void 0
                            : e.triggerNode),
                        (this.contentNode =
                          null === (t = this.ref.current) || void 0 === t
                            ? void 0
                            : t.contentNode),
                        P.N.global.addEventListener(
                          "resize",
                          this.debouncedUpdatePlacement,
                          { passive: !0 }
                        ),
                        this.updatePlacement(),
                        this.props.detachFromTarget)
                      ) {
                        this.props.getTabOrder &&
                          (this.disposeForceTabOrder = (0, k.v)(
                            this.props.getTabOrder({
                              findTriggerNode: function () {
                                var e;
                                if (
                                  null !== (e = n.ref.current) &&
                                  void 0 !== e &&
                                  e.isOpen
                                )
                                  return n.triggerNode;
                              },
                              findFirstFocusableInContent: function () {
                                var e;
                                if (
                                  null !== (e = n.ref.current) &&
                                  void 0 !== e &&
                                  e.isOpen &&
                                  n.contentNode
                                )
                                  return (0, S.W)(n.contentNode)[0];
                              },
                              findLastFocusableInContent: function () {
                                var e;
                                if (
                                  null !== (e = n.ref.current) &&
                                  void 0 !== e &&
                                  e.isOpen &&
                                  n.contentNode
                                ) {
                                  var t = (0, S.W)(n.contentNode);
                                  return t[t.length - 1];
                                }
                              },
                            })
                          ));
                      }
                    },
                  },
                  {
                    key: "componentDidUpdate",
                    value: function (e) {
                      !e.isOpen && this.props.isOpen && this.updatePlacement();
                    },
                  },
                  {
                    key: "componentWillUnmount",
                    value: function () {
                      var e,
                        t,
                        n,
                        r = this;
                      P.N.global.removeEventListener(
                        "resize",
                        this.debouncedUpdatePlacement
                      );
                      var i =
                        null !==
                          (e =
                            null ===
                              (t = (n = this.props).getScrollContainers) ||
                            void 0 === t
                              ? void 0
                              : t.call(n).filter(Boolean)) && void 0 !== e
                          ? e
                          : [];
                      this.isScrollListenerSetUp &&
                        i.forEach(function (e) {
                          e.removeEventListener("scroll", r.updatePlacement);
                        }),
                        this.disposeForceTabOrder(),
                        (this.triggerNode = this.contentNode = null);
                    },
                  },
                  {
                    key: "getPlacementsInPreferredOrder",
                    value: function () {
                      var e = this.props.placement.split("-"),
                        t = (0, m.Z)(e, 2),
                        n = t[0],
                        r = t[1],
                        i = W[n],
                        o = [],
                        a = [],
                        s = [];
                      return (
                        Object.keys(j.AM).forEach(function (e) {
                          var t = e.split("-"),
                            c = (0, m.Z)(t, 2),
                            l = c[0],
                            u = c[1] === r ? "unshift" : "push";
                          l === n ? o[u](e) : l === i ? a[u](e) : s[u](e);
                        }),
                        o.concat(a).concat(s)
                      );
                    },
                  },
                  {
                    key: "getContentFit",
                    value: function (e, t) {
                      var n = e.top,
                        r = e.left,
                        i = r + e.width,
                        o = n + e.height,
                        a = t.top,
                        s = t.right,
                        c = t.bottom,
                        l = t.left;
                      return {
                        fits: n >= a && r >= l && i <= s && o <= c,
                        area:
                          (Math.min(i, s) - Math.max(r, l)) *
                          (Math.min(o, c) - Math.max(n, a)),
                      };
                    },
                  },
                  {
                    key: "getContentRect",
                    value: function (e, t, n) {
                      var r = t.top,
                        i = t.right,
                        o = t.bottom,
                        a = t.left,
                        s = i - a,
                        c = o - r,
                        l = n.right - n.left,
                        u = n.bottom - n.top;
                      switch (e) {
                        case "top-start":
                          return { top: r - u, left: a, width: l, height: u };
                        case "top":
                          return {
                            top: r - u,
                            left: a + s / 2 - l / 2,
                            width: l,
                            height: u,
                          };
                        case "top-end":
                          return {
                            top: r - u,
                            left: i - l,
                            width: l,
                            height: u,
                          };
                        case "right-start":
                          return { top: r, left: i, width: l, height: u };
                        case "right":
                          return {
                            top: r + c / 2 - u / 2,
                            left: i,
                            width: l,
                            height: u,
                          };
                        case "right-end":
                          return { top: o - u, left: i, width: l, height: u };
                        case "bottom-start":
                          return { top: o, left: a, width: l, height: u };
                        case "bottom":
                          return {
                            top: o,
                            left: a + s / 2 - l / 2,
                            width: l,
                            height: u,
                          };
                        case "bottom-end":
                          return { top: o, left: i - l, width: l, height: u };
                        case "left-start":
                          return { top: r, left: a - l, width: l, height: u };
                        case "left":
                          return {
                            top: r + c / 2 - u / 2,
                            left: a - l,
                            width: l,
                            height: u,
                          };
                        case "left-end":
                          return {
                            top: o - u,
                            left: a - l,
                            width: l,
                            height: u,
                          };
                      }
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e,
                        t = this.props,
                        n = (t.detachFromTarget, (0, p.Z)(t, D));
                      return A.createElement(
                        j.H_,
                        Object.assign({}, n, {
                          onToggle: this.onToggle,
                          placement:
                            null !== (e = this.forcedPlacement) && void 0 !== e
                              ? e
                              : n.placement,
                          renderContent: this.renderContent,
                          ref: this.ref,
                        })
                      );
                    },
                  },
                ]),
                n
              );
            })(A.Component)),
            (d.propTypes = F(
              F({}, j.dP),
              {},
              {
                detachFromTarget: R().bool,
                getTabOrder: R().func,
                getScrollContainers: R().func,
              }
            )),
            (d.defaultProps = F(
              F({}, j.H_.defaultProps),
              {},
              {
                detachFromTarget: !1,
                getTabOrder: function (e) {
                  return [
                    [e.findTriggerNode, e.findFirstFocusableInContent],
                    [e.findLastFocusableInContent, e.findTriggerNode],
                  ];
                },
                getScrollContainers: function () {
                  return [];
                },
              }
            )),
            (a = d),
            (s = (0, w.Z)(a.prototype, "forcedPlacement", [I.LO], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              },
            })),
            (c = (0, w.Z)(a.prototype, "position", [r], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return null;
              },
            })),
            (l = (0, w.Z)(a.prototype, "detachedFromTargetPosition", [i], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {},
            })),
            (u = (0, w.Z)(a.prototype, "updatePlacement", [I.aD], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                var e = this;
                return function () {
                  var t, n;
                  if (
                    e.triggerNode &&
                    e.contentNode &&
                    e.ref.current &&
                    e.ref.current.isOpen &&
                    e.props.getTriggerRect
                  ) {
                    var r,
                      i,
                      o,
                      a,
                      s = e.props.getTriggerRect(e.triggerNode),
                      c = e.contentNode.getBoundingClientRect(),
                      l = document.body.getBoundingClientRect(),
                      u = M(e.getPlacementsInPreferredOrder());
                    try {
                      for (u.s(); !(a = u.n()).done; ) {
                        var d,
                          p = a.value,
                          m = e.getContentRect(p, s, c),
                          f = e.getContentFit(m, l),
                          g = f.fits,
                          h = f.area;
                        if (g) {
                          r = { placement: p, rect: m, leftOffset: 0 };
                          break;
                        }
                        if (
                          ("top-start" === p || "bottom-start" === p) &&
                          (!i || h > i.area)
                        ) {
                          i = { placement: p, rect: m, area: h, leftOffset: 0 };
                          var v = m.left + m.width - l.right;
                          v > 0 &&
                            (i.leftOffset = -Math.min(m.left - l.left, v));
                        }
                        o =
                          null !== (d = o) && void 0 !== d
                            ? d
                            : { placement: p, rect: m, leftOffset: 0 };
                      }
                    } catch (O) {
                      u.e(O);
                    } finally {
                      u.f();
                    }
                    var b =
                      null !== (t = null !== (n = r) && void 0 !== n ? n : i) &&
                      void 0 !== t
                        ? t
                        : o;
                    if (b) {
                      var y, _, E;
                      (e.forcedPlacement = b.placement),
                        (e.position = F({}, j.AM[b.placement])),
                        b.leftOffset &&
                          "left" in e.position &&
                          "0" === e.position.left &&
                          (e.position.left = "".concat(b.leftOffset, "px")),
                        (e.detachedFromTargetPosition = {
                          top: "".concat(window.pageYOffset + b.rect.top, "px"),
                          left: "".concat(
                            window.pageXOffset + b.rect.left + b.leftOffset,
                            "px"
                          ),
                        });
                      var w =
                        null !==
                          (y =
                            null === (_ = (E = e.props).getScrollContainers) ||
                            void 0 === _
                              ? void 0
                              : _.call(E).filter(Boolean)) && void 0 !== y
                          ? y
                          : [];
                      e.isScrollListenerSetUp ||
                        (w.forEach(function (t) {
                          t.addEventListener("scroll", e.updatePlacement, {
                            passive: !0,
                          });
                        }),
                        (e.isScrollListenerSetUp = !0));
                    }
                  }
                };
              },
            })),
            (o = a))
          ) || o),
        Q = (function (e) {
          (0, b.Z)(n, e);
          var t = B(n);
          function n() {
            var e;
            return (
              (0, g.Z)(this, n),
              ((e = t.apply(this, arguments)).dom = null),
              (e.onKeyDown = function (t) {
                t.keyCode === C.R.ESCAPE && e.props.onEscape(t, e.dom);
              }),
              e
            );
          }
          return (
            (0, h.Z)(n, [
              {
                key: "componentDidMount",
                value: function () {
                  var e, t;
                  (this.dom = L.findDOMNode(this)),
                    null === (e = this.dom) ||
                      void 0 === e ||
                      e.addEventListener("click", this.context.ignoreRootClose),
                    null === (t = this.dom) ||
                      void 0 === t ||
                      t.addEventListener("keydown", this.onKeyDown);
                },
              },
              {
                key: "componentWillUnmount",
                value: function () {
                  this.dom &&
                    (this.dom.removeEventListener(
                      "click",
                      this.context.ignoreRootClose
                    ),
                    this.dom.removeEventListener("keydown", this.onKeyDown),
                    (this.dom = null));
                },
              },
              {
                key: "render",
                value: function () {
                  return A.Children.only(this.props.children);
                },
              },
            ]),
            n
          );
        })(A.Component);
      Q.contextType = O.Qu;
    },
    80785: function (e, t, n) {
      "use strict";
      n.d(t, {
        u: function () {
          return f;
        },
      });
      var r = n(59499),
        i = n(4730),
        o = n(94184),
        a = n.n(o),
        s = n(67294),
        c = n(40836),
        l = n(22147),
        u = n(27556),
        d = n.n(u),
        p = [
          "a11yRole",
          "forwardedRef",
          "udStyle",
          "canToggleOnHover",
          "placement",
          "trigger",
          "renderContent",
          "getTabOrder",
          "getScrollContainers",
        ],
        m = function (e) {
          var t = e.a11yRole,
            n = void 0 === t ? "description" : t,
            o = e.forwardedRef,
            u = e.udStyle,
            m = void 0 === u ? "black" : u,
            f = (e.canToggleOnHover, e.placement),
            g = void 0 === f ? "top-start" : f,
            h = e.trigger,
            v = e.renderContent,
            b = void 0 === v ? c.Ej : v,
            y = e.getTabOrder,
            _ =
              void 0 === y
                ? function (e) {
                    return [
                      [e.findTriggerNode, e.findFirstFocusableInContent],
                      [e.findLastFocusableInContent, e.findTriggerNode],
                    ];
                  }
                : y,
            E = e.getScrollContainers,
            w =
              void 0 === E
                ? function () {
                    return [];
                  }
                : E,
            O = (0, i.Z)(e, p);
          return s.createElement(
            l.r,
            Object.assign(
              {
                trigger: h,
                ref: o,
                a11yRole: n,
                getScrollContainers: w,
                getTabOrder: _,
                canToggleOnHover: !0,
                placement: g,
                renderContent: function (e, t, n) {
                  var i = a()(
                    "ud-text-sm",
                    d().tooltip,
                    (0, r.Z)({}, d().white, "white" === m)
                  );
                  return (
                    (e.children = s.createElement(
                      "div",
                      { className: i },
                      e.children
                    )),
                    b(e, t, n)
                  );
                },
              },
              O
            )
          );
        },
        f = Object.assign(
          s.forwardRef(function (e, t) {
            return s.createElement(
              m,
              Object.assign({}, e, { forwardedRef: t })
            );
          }),
          { displayName: "Tooltip" }
        );
    },
    11884: function (e, t, n) {
      "use strict";
      n.d(t, {
        l: function () {
          return G;
        },
      });
      var r,
        i,
        o,
        a,
        s,
        c,
        l,
        u = n(59499),
        d = n(4730),
        p = n(50029),
        m = n(92777),
        f = n(82262),
        g = n(10748),
        h = n(45959),
        v = n(63553),
        b = n(37247),
        y = n(87794),
        _ = n.n(y),
        E = n(43269),
        w = n(53229),
        O = n(42551),
        S = n(36526),
        k = n(79594),
        C = n(93630),
        x = n.n(C),
        N = n(76185),
        P = n.n(N),
        I = n(23290),
        T = n(97331),
        Z = n(65982),
        R = n(95590),
        A = n(94184),
        L = n.n(A),
        j = n(22188),
        D = n(80955),
        M = n(67294),
        z = n(42238),
        U = n.n(z),
        F = n(37770),
        B = n.n(F),
        W = [
          "allowScroll",
          "children",
          "id",
          "onLoadMore",
          "onMutation",
          "pagerButtonClassName",
          "pagerButtonSize",
          "className",
          "itemClassName",
          "smallGrid",
          "gridSize",
          "showPager",
          "isInfiniteScroll",
          "gridMode",
          "gridFullWidthItems",
          "pageByFullWidth",
          "ariaLive",
          "ariaLabel",
          "onNextClick",
          "onPreviousClick",
          "fullViewport",
        ];
      function H(e) {
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
          var n,
            r = (0, b.Z)(e);
          if (t) {
            var i = (0, b.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, v.Z)(this, n);
        };
      }
      var Q = function () {
          var e = (0, k.QT)().gettext;
          return M.createElement(x(), {
            size: "large",
            color: "inherit",
            label: e("Next"),
          });
        },
        V = function () {
          var e = (0, k.QT)().gettext;
          return M.createElement(P(), {
            size: "large",
            color: "inherit",
            label: e("Previous"),
          });
        },
        q = function (e) {
          var t = e.ariaLabel,
            n = e.children,
            r = (0, k.QT)().gettext;
          return M.createElement(
            "section",
            { "aria-label": t || r("Carousel"), className: B().container },
            n
          );
        },
        G =
          (0, D.Pi)(
            ((l = (function (e) {
              (0, h.Z)(n, e);
              var t = H(n);
              function n(e) {
                var r, i;
                (0, m.Z)(this, n),
                  ((r = t.call(this, e)).destroy = void 0),
                  (r.lastChild = void 0),
                  (r.scrollPortRef = void 0),
                  (r.scrollBehavior = void 0),
                  (r.shouldFocusOnFirstVisibleItem = void 0),
                  (r.id = void 0),
                  (0, E.Z)((0, g.Z)(r), "scroll", o, (0, g.Z)(r)),
                  (0, E.Z)((0, g.Z)(r), "isLoading", a, (0, g.Z)(r)),
                  (0, E.Z)((0, g.Z)(r), "setIsLoading", s, (0, g.Z)(r)),
                  (r.handleLastChildEnter = (function () {
                    var e = (0, p.Z)(
                      _().mark(function e(t) {
                        var n, i, o, a;
                        return _().wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (t) {
                                  e.next = 2;
                                  break;
                                }
                                return e.abrupt("return");
                              case 2:
                                if (
                                  ((n = r.props),
                                  (i = n.children),
                                  (o = n.onLoadMore),
                                  (a = i[M.Children.count(i) - 1]),
                                  r.lastChild === a)
                                ) {
                                  e.next = 8;
                                  break;
                                }
                                return (
                                  (r.lastChild = a),
                                  (e.next = 8),
                                  null === o || void 0 === o ? void 0 : o()
                                );
                              case 8:
                              case "end":
                                return e.stop();
                            }
                        }, e);
                      })
                    );
                    return function (t) {
                      return e.apply(this, arguments);
                    };
                  })()),
                  (r.handleClick = (function () {
                    var e = (0, p.Z)(
                      _().mark(function e(t) {
                        var n, i, o, a, s, c, l, u, d, p, m;
                        return _().wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (
                                  ((n = r.scrollPortRef.current),
                                  (i = n.clientWidth),
                                  (o = n.scrollWidth),
                                  (a = n.scrollLeft),
                                  (s = r.props.pageByFullWidth ? i : 0.8 * i),
                                  "next" !== t.currentTarget.dataset.pagerType)
                                ) {
                                  e.next = 14;
                                  break;
                                }
                                if (
                                  (null === (c = (l = r.props).onNextClick) ||
                                    void 0 === c ||
                                    c.call(l),
                                  !r.props.onLoadMore)
                                ) {
                                  e.next = 10;
                                  break;
                                }
                                if (!(o - (a + i) < s)) {
                                  e.next = 10;
                                  break;
                                }
                                return (
                                  r.setIsLoading(!0),
                                  (e.next = 10),
                                  r.props.onLoadMore()
                                );
                              case 10:
                                r.setIsLoading(!1),
                                  null === (u = r.scrollPortRef.current) ||
                                    void 0 === u ||
                                    u.scrollBy({
                                      left: s,
                                      behavior: r.scrollBehavior,
                                    }),
                                  (e.next = 16);
                                break;
                              case 14:
                                null === (d = (p = r.props).onPreviousClick) ||
                                  void 0 === d ||
                                  d.call(p),
                                  null === (m = r.scrollPortRef.current) ||
                                    void 0 === m ||
                                    m.scrollBy({
                                      left: -s,
                                      behavior: r.scrollBehavior,
                                    });
                              case 16:
                                r.shouldFocusOnFirstVisibleItem = !0;
                              case 17:
                              case "end":
                                return e.stop();
                            }
                        }, e);
                      })
                    );
                    return function (t) {
                      return e.apply(this, arguments);
                    };
                  })()),
                  (0, E.Z)(
                    (0, g.Z)(r),
                    "handleCarouselMutation",
                    c,
                    (0, g.Z)(r)
                  ),
                  (r.scrollHandler = (0, Z.D)(r.handleCarouselMutation, 100)),
                  (r.scrollPortRef = M.createRef()),
                  (r.id =
                    null !== (i = r.props.id) && void 0 !== i
                      ? i
                      : (0, O.Ki)("scroll-port")),
                  (r.destroy = R.Z),
                  (r.shouldFocusOnFirstVisibleItem = !1);
                var l = new (U())();
                return (
                  (r.scrollBehavior =
                    "Safari" === l.getBrowser().name ? "auto" : "smooth"),
                  r
                );
              }
              return (
                (0, f.Z)(n, [
                  {
                    key: "componentDidMount",
                    value: function () {
                      var e = this;
                      this.props.onLoadMore &&
                        (this.destroy = (0, j.U5)(function () {
                          return e.isLastPage;
                        }, this.handleLastChildEnter)),
                        this.handleCarouselMutation();
                    },
                  },
                  {
                    key: "componentDidUpdate",
                    value: function (e) {
                      e.children !== this.props.children &&
                        this.handleCarouselMutation();
                    },
                  },
                  {
                    key: "componentWillUnmount",
                    value: function () {
                      this.destroy();
                    },
                  },
                  {
                    key: "isFirstPage",
                    get: function () {
                      return 0 === this.scroll.x;
                    },
                  },
                  {
                    key: "isLastPage",
                    get: function () {
                      var e = this.scroll,
                        t = e.x,
                        n = e.clientWidth,
                        r = e.totalWidth;
                      return this.round(t + n) === this.round(r);
                    },
                  },
                  {
                    key: "isPageable",
                    get: function () {
                      return this.props.isInfiniteScroll || this.pageCount > 1;
                    },
                  },
                  {
                    key: "pageCount",
                    get: function () {
                      return this.props.isInfiniteScroll
                        ? null
                        : Math.ceil(
                            this.scroll.totalWidth / this.scroll.clientWidth
                          );
                    },
                  },
                  {
                    key: "visiblePageIndex",
                    get: function () {
                      return this.props.isInfiniteScroll
                        ? null
                        : Math.ceil(this.scroll.x / this.scroll.clientWidth);
                    },
                  },
                  {
                    key: "round",
                    value: function (e) {
                      var t =
                        arguments.length > 1 && void 0 !== arguments[1]
                          ? arguments[1]
                          : 5;
                      return Math.round(e / t) * t;
                    },
                  },
                  {
                    key: "focusOnFirstVisibleItem",
                    value: function () {
                      var e,
                        t,
                        n =
                          null === (e = this.scrollPortRef.current) ||
                          void 0 === e
                            ? void 0
                            : e.getBoundingClientRect().left;
                      if (
                        null !== (t = this.scrollPortRef.current) &&
                        void 0 !== t &&
                        t.childNodes &&
                        n
                      ) {
                        var r,
                          i = Array.from(
                            null === (r = this.scrollPortRef.current) ||
                              void 0 === r
                              ? void 0
                              : r.childNodes
                          ).find(function (e) {
                            return e.getBoundingClientRect().left >= n;
                          }),
                          o = i && (0, S.W)(i)[0];
                        null === o || void 0 === o || o.focus();
                      }
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e,
                        t = this.props,
                        n = t.allowScroll,
                        r = t.children,
                        i =
                          (t.id,
                          t.onLoadMore,
                          t.onMutation,
                          t.pagerButtonClassName),
                        o = t.pagerButtonSize,
                        a = t.className,
                        s = t.itemClassName,
                        c = t.smallGrid,
                        l = t.gridSize,
                        p = t.showPager,
                        m = t.isInfiniteScroll,
                        f = t.gridMode,
                        g = t.gridFullWidthItems,
                        h = (t.pageByFullWidth, t.ariaLive),
                        v = t.ariaLabel,
                        b = (t.onNextClick, t.onPreviousClick, t.fullViewport),
                        y = (0, d.Z)(t, W),
                        _ = this.isLoading
                          ? M.createElement(T.a, { color: "inherit" })
                          : M.createElement(Q, null),
                        E = M.createElement(
                          M.Fragment,
                          null,
                          M.createElement(
                            I.h,
                            {
                              className: L()(
                                "ud-carousel-pager-button",
                                "ud-carousel-pager-button-prev",
                                i,
                                B().button,
                                B()["prev-button"]
                              ),
                              size: o,
                              udStyle: "primary",
                              round: !0,
                              onClick: this.handleClick,
                              "data-pager-type": "prev",
                              disabled: !m && this.isFirstPage,
                            },
                            M.createElement(V, null)
                          ),
                          M.createElement(
                            I.h,
                            {
                              className: L()(
                                "ud-carousel-pager-button",
                                "ud-carousel-pager-button-next",
                                i,
                                B().button,
                                B()["next-button"]
                              ),
                              size: o,
                              udStyle: "primary",
                              round: !0,
                              onClick: this.handleClick,
                              "data-pager-type": "next",
                              disabled: !m && this.isLastPage,
                            },
                            _
                          )
                        );
                      return M.createElement(
                        q,
                        { ariaLabel: v },
                        M.createElement(
                          "div",
                          Object.assign(
                            {
                              ref: this.scrollPortRef,
                              className: L()(
                                a,
                                B()["scroll-port"],
                                ((e = {}),
                                (0, u.Z)(
                                  e,
                                  B()["small-grid"],
                                  c || "small" === l
                                ),
                                (0, u.Z)(e, B()["large-grid"], "large" === l),
                                (0, u.Z)(e, B().grid, f),
                                (0, u.Z)(
                                  e,
                                  B()["grid-full-width-items"],
                                  f && g
                                ),
                                (0, u.Z)(e, B()["scroll-lock"], !n),
                                (0, u.Z)(e, "ud-full-viewport-container", b),
                                (0, u.Z)(e, B()["container-full-viewport"], b),
                                e)
                              ),
                              "data-purpose": "scroll-port",
                            },
                            y,
                            {
                              id: this.id,
                              onScroll: this.scrollHandler,
                              "aria-live": h,
                            }
                          ),
                          M.Children.map(r, function (e, t) {
                            return M.createElement(
                              "div",
                              {
                                "data-index": t,
                                className: L()(s, B()["scroll-item"]),
                                key: t,
                              },
                              e
                            );
                          })
                        ),
                        this.isPageable && p && E
                      );
                    },
                  },
                ]),
                n
              );
            })(M.Component)),
            (l.defaultProps = {
              allowScroll: !1,
              pagerButtonClassName: void 0,
              pagerButtonSize: "large",
              className: void 0,
              itemClassName: void 0,
              id: void 0,
              onLoadMore: void 0,
              onMutation: void 0,
              smallGrid: !1,
              gridSize: "medium",
              showPager: !0,
              isInfiniteScroll: !1,
              gridMode: !0,
              gridFullWidthItems: !1,
              pageByFullWidth: !1,
              ariaLive: "polite",
              ariaLabel: void 0,
              onNextClick: R.Z,
              onPreviousClick: R.Z,
              fullViewport: !1,
            }),
            (i = l),
            (0, w.Z)(
              i.prototype,
              "componentDidMount",
              [j.aD],
              Object.getOwnPropertyDescriptor(i.prototype, "componentDidMount"),
              i.prototype
            ),
            (o = (0, w.Z)(i.prototype, "scroll", [j.LO], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return { x: 0, clientWidth: 0, totalWidth: 0 };
              },
            })),
            (a = (0, w.Z)(i.prototype, "isLoading", [j.LO], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                return !1;
              },
            })),
            (s = (0, w.Z)(i.prototype, "setIsLoading", [j.aD], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                var e = this;
                return function (t) {
                  e.isLoading = t;
                };
              },
            })),
            (0, w.Z)(
              i.prototype,
              "isFirstPage",
              [j.Fl],
              Object.getOwnPropertyDescriptor(i.prototype, "isFirstPage"),
              i.prototype
            ),
            (0, w.Z)(
              i.prototype,
              "isLastPage",
              [j.Fl],
              Object.getOwnPropertyDescriptor(i.prototype, "isLastPage"),
              i.prototype
            ),
            (0, w.Z)(
              i.prototype,
              "isPageable",
              [j.Fl],
              Object.getOwnPropertyDescriptor(i.prototype, "isPageable"),
              i.prototype
            ),
            (0, w.Z)(
              i.prototype,
              "pageCount",
              [j.Fl],
              Object.getOwnPropertyDescriptor(i.prototype, "pageCount"),
              i.prototype
            ),
            (0, w.Z)(
              i.prototype,
              "visiblePageIndex",
              [j.Fl],
              Object.getOwnPropertyDescriptor(i.prototype, "visiblePageIndex"),
              i.prototype
            ),
            (c = (0, w.Z)(i.prototype, "handleCarouselMutation", [j.aD], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: function () {
                var e = this;
                return function () {
                  if (e.scrollPortRef.current) {
                    var t,
                      n,
                      r = e.scrollPortRef.current,
                      i = r.clientWidth,
                      o = r.scrollWidth,
                      a = r.scrollLeft;
                    (e.scroll = { x: a, totalWidth: o, clientWidth: i }),
                      e.shouldFocusOnFirstVisibleItem &&
                        (e.focusOnFirstVisibleItem(),
                        (e.shouldFocusOnFirstVisibleItem = !1)),
                      null === (t = (n = e.props).onMutation) ||
                        void 0 === t ||
                        t.call(n, {
                          isLastPage: e.isLastPage,
                          isPageable: e.isPageable,
                          pageCount: e.pageCount,
                          visiblePageIndex: e.visiblePageIndex,
                        });
                  }
                };
              },
            })),
            (r = i))
          ) || r;
    },
    10154: function (e, t, n) {
      "use strict";
      n.d(t, {
        a: function () {
          return d;
        },
      });
      var r = n(59499),
        i = n(4730),
        o = n(94184),
        a = n.n(o),
        s = n(67294),
        c = ["alignment"];
      function l(e, t) {
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
      function u(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? l(Object(n), !0).forEach(function (t) {
                (0, r.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : l(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var d = function (e) {
        var t = e.alignment,
          n = void 0 === t ? "right" : t,
          r = (0, i.Z)(e, c),
          o = s.createElement(
            "div",
            Object.assign({}, r, {
              className: a()(r.className, "ud-footer-btns"),
              style: u(u({}, r.style), {}, { textAlign: n }),
            })
          );
        return s.createElement(
          s.Fragment,
          null,
          o,
          s.createElement("div", { className: "ud-footer-btns-spacer" })
        );
      };
    },
    23890: function (e, t, n) {
      "use strict";
      n.d(t, {
        O: function () {
          return O;
        },
        m: function () {
          return S;
        },
      });
      var r = n(59499),
        i = n(4730),
        o = n(92777),
        a = n(82262),
        s = n(45959),
        c = n(63553),
        l = n(37247),
        u = n(42551),
        d = n(34278),
        p = n(79594),
        m = n(45566),
        f = n(94184),
        g = n.n(f),
        h = n(80955),
        v = n(67294),
        b = n(11884),
        y = n(30552),
        _ = n.n(y),
        E = [
          "children",
          "fullWidth",
          "toggleStrategy",
          "size",
          "invertedColors",
          "prioritizeTouch",
        ];
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
          var n,
            r = (0, l.Z)(e);
          if (t) {
            var i = (0, l.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, c.Z)(this, n);
        };
      }
      var O = (function (e) {
          (0, s.Z)(n, e);
          var t = w(n);
          function n() {
            return (0, o.Z)(this, n), t.apply(this, arguments);
          }
          return (
            (0, a.Z)(n, [
              {
                key: "render",
                value: function () {
                  return this.props.children;
                },
              },
            ]),
            n
          );
        })(v.Component),
        S = Object.assign(
          (0, h.Pi)(function (e) {
            var t,
              n = e.children,
              o = void 0 === n ? [] : n,
              a = e.fullWidth,
              s = void 0 !== a && a,
              c = e.toggleStrategy,
              l = void 0 === c ? "show-hide" : c,
              f = e.size,
              h = void 0 === f ? "large" : f,
              y = e.invertedColors,
              w = void 0 !== y && y,
              O = e.prioritizeTouch,
              S = void 0 !== O && O,
              k = (0, i.Z)(e, E),
              C = (0, v.useState)(function () {
                return (0, u.Ki)("tabs");
              })[0],
              x = (0, v.useRef)(null),
              N = (0, v.useRef)(null),
              P = (0, v.useState)(!1),
              I = P[0],
              T = P[1],
              Z = (0, v.useState)(!1),
              R = Z[0],
              A = Z[1],
              L = (0, v.useState)(!1),
              j = L[0],
              D = L[1],
              M = (0, p.QT)().gettext;
            (0, v.useEffect)(function () {
              T(!0);
            }, []);
            var z = v.Children.toArray(o).filter(Boolean),
              U = function () {
                return k.defaultTabId
                  ? Math.max(
                      0,
                      z.findIndex(function (e) {
                        return e.props.id === k.defaultTabId;
                      })
                    )
                  : 0;
              },
              F = (0, v.useState)(function () {
                return U();
              }),
              B = F[0],
              W = F[1],
              H = function () {
                if (!k.activeTabId) return B;
                var e = z.findIndex(function (e) {
                  return e.props.id === k.activeTabId;
                });
                return -1 === e ? U() : e;
              },
              Q = function () {
                var e = x.current;
                return I && !!e && j && !R;
              },
              V = function (e) {
                if (e.keyCode === d.R.LEFT || e.keyCode === d.R.RIGHT) {
                  var t,
                    n =
                      null === (t = N.current) || void 0 === t
                        ? void 0
                        : t.querySelectorAll('[role="tab"]');
                  if (n) {
                    var r = n[H() + (e.keyCode === d.R.RIGHT ? 1 : -1)];
                    r && (r.click(), r.focus(), Q() && r.scrollIntoView());
                  }
                }
              },
              q = [],
              G = [];
            if (
              (z.forEach(function (e, t) {
                var n,
                  i = H() === t,
                  o = "".concat(C, "-content-").concat(t),
                  a = "".concat(C, "-tab-").concat(t),
                  s = v.createElement(
                    m.zx,
                    {
                      id: a,
                      "aria-selected": i,
                      onClick: function () {
                        return (function (e) {
                          var t;
                          e !== H() &&
                            (W(e),
                            null === (t = k.onSelect) ||
                              void 0 === t ||
                              t.call(k, z[e].props.id));
                        })(t);
                      },
                      onKeyDown: V,
                      role: "tab",
                      size: "small" === h ? "medium" : "large",
                      className: g()(
                        "ud-nav-button",
                        _()["nav-button"],
                        ((n = { "ud-nav-button-active": i }),
                        (0, r.Z)(n, _().active, i),
                        (0, r.Z)(n, _().xlarge, "xlarge" === h),
                        n)
                      ),
                      tabIndex: i ? 0 : -1,
                      udStyle: "ghost",
                    },
                    e.props.title
                  );
                q.push(
                  v.createElement(
                    "div",
                    {
                      key: "".concat(C, "-title-").concat(t),
                      className: g()(
                        "ud-nav-button-container",
                        _()["nav-button-container"],
                        (0, r.Z)(
                          { "ud-nav-button-container-active": i },
                          _().active,
                          i
                        ),
                        [_()[h]]
                      ),
                    },
                    e.props.renderTabButton ? e.props.renderTabButton(s) : s
                  )
                ),
                  G.push(
                    v.createElement(
                      "div",
                      {
                        key: o,
                        id: o,
                        role: "tabpanel",
                        className: g()(
                          "ud-tab-content",
                          _()["tab-content"],
                          (0, r.Z)({}, _().active, i)
                        ),
                        tabIndex: i ? 0 : -1,
                        "data-purpose": "tab-container",
                        "aria-labelledby": a,
                      },
                      ("show-hide" === l || i) && e.props.children
                    )
                  );
              }),
              !q.length || !G.length)
            )
              return null;
            var X = s
                ? q
                : v.createElement(
                    b.l,
                    {
                      pagerButtonSize: "large" === h ? "large" : "medium",
                      ref: x,
                      allowScroll: S,
                      showPager: !0,
                      pagerButtonClassName: _()["pagination-buttons"],
                      ariaLive: "off",
                      gridSize: "xlarge" === h ? "large" : "medium",
                      onMutation: function (e) {
                        var t = e.isLastPage,
                          n = e.isPageable;
                        A(t), D(n);
                      },
                      ariaLabel: M("Tab Navigation"),
                    },
                    q
                  ),
              Y =
                !s && S && Q()
                  ? v.createElement("div", {
                      "data-purpose": "tab-overflow-gradient",
                      className: _().gradient,
                    })
                  : null;
            return v.createElement(
              "div",
              {
                className: g()(
                  _()["tabs-container"],
                  ((t = {}),
                  (0, r.Z)(t, _()["full-width"], s),
                  (0, r.Z)(t, _().inverted, w),
                  t)
                ),
              },
              v.createElement(
                "div",
                {
                  className: g()(
                    "ud-tabs-nav-buttons",
                    _()["tabs-nav-buttons"]
                  ),
                  role: "tablist",
                  ref: N,
                  "data-purpose": "tab-nav-buttons",
                },
                X,
                Y
              ),
              G
            );
          }),
          { Tab: O, displayName: "Tabs" }
        );
    },
    40027: function (e, t, n) {
      "use strict";
      n.d(t, {
        a4: function () {
          return Te;
        },
        lJ: function () {
          return ft;
        },
      });
      var r = n(17674),
        i = n(4730),
        o = n(10748),
        a = n(92777),
        s = n(82262),
        c = n(45959),
        l = n(63553),
        u = n(37247),
        d = n(43269),
        p = n(53229),
        m = n(88572),
        f = n(94184),
        g = n.n(f),
        h = n(36808),
        v = n.n(h),
        b = n(22188),
        y = n(80955),
        _ = n(67294),
        E = n(73935),
        w = n(42551),
        O = n(34278),
        S = n(95361),
        k = n(11121),
        C = n(71361),
        x = n(79594),
        N = n(82300),
        P = n.n(N),
        I = n(79750),
        T = n(54742),
        Z = n(23290),
        R = n(87491),
        A = n(6625),
        L = n(95590),
        j = n(78270),
        D = n(28108),
        M = n(24076),
        z = n(41477);
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
          var n,
            r = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, l.Z)(this, n);
        };
      }
      var F = (function (e) {
          return (
            (e.DISCOVERY = "discovery"),
            (e.TAUGHT_COURSES = "taught_courses"),
            (e.USER_PROFILE_COURSES = "user_profile_courses"),
            (e.USER_WISHLISTED_COURSES = "user_wishlisted_courses"),
            (e.USER_COLLECTIONS = "user_collections"),
            (e.RELATED_LECTURES = "related_lectures"),
            (e.SHOPPING_CARTS = "shopping_carts"),
            (e.DISCOVERY_ALL_COURSES = "discovery_all_courses"),
            (e.SEARCH_RECOMMENDATIONS = "search_recommendations"),
            e
          );
        })({}),
        B = (function (e) {
          (0, c.Z)(n, e);
          var t = U(n);
          function n(e) {
            var r, i;
            (0, a.Z)(this, n);
            var o = e.id,
              s = e.type,
              c = e.trackingId,
              l = e.serveTrackingId,
              u = e.backendSource,
              d = e.position,
              p = e.badgeFamilies,
              m = e.relatedSourceId,
              f = e.relatedSourceType;
            return (
              ((r = t.call(this, "DiscoveryItemImpressionEvent")).id = void 0),
              (r.type = void 0),
              (r.trackingId = void 0),
              (r.serveTrackingId = void 0),
              (r.backendSource = void 0),
              (r.position = void 0),
              (r.badges = void 0),
              (r.relatedSourceId = void 0),
              (r.relatedSourceType = void 0),
              (r.id = o),
              (r.type = s),
              (r.trackingId = c),
              (r.serveTrackingId = l),
              (r.backendSource = u),
              (r.position = d),
              (r.badges =
                null !==
                  (i =
                    null === p || void 0 === p
                      ? void 0
                      : p.map(function (e) {
                          return { family: e };
                        })) && void 0 !== i
                  ? i
                  : null),
              (r.relatedSourceId = m),
              (r.relatedSourceType = f),
              r
            );
          }
          return (0, s.Z)(n);
        })(M.rp);
      B.backendSourceOptions = {
        DISCOVERY: F.DISCOVERY,
        TAUGHT_COURSES: F.TAUGHT_COURSES,
        USER_PROFILE_COURSES: F.USER_PROFILE_COURSES,
        USER_WISHLISTED_COURSES: F.USER_WISHLISTED_COURSES,
        USER_COLLECTIONS: F.USER_COLLECTIONS,
        RELATED_LECTURES: F.RELATED_LECTURES,
        SHOPPING_CARTS: F.SHOPPING_CARTS,
        DISCOVERY_ALL_COURSES: F.DISCOVERY_ALL_COURSES,
        SEARCH_RECOMMENDATIONS: F.SEARCH_RECOMMENDATIONS,
      };
      M.rp;
      var W = (function (e) {
          (0, c.Z)(n, e);
          var t = U(n);
          function n(e) {
            var r;
            (0, a.Z)(this, n);
            var i = e.trackingId,
              o = e.unitTitle,
              s = e.renderType;
            return (
              ((r = t.call(this, "DiscoveryUnitViewEvent")).trackingId =
                void 0),
              (r.title = void 0),
              (r.renderType = void 0),
              (r.trackingId = i),
              (r.title = o),
              (r.renderType = s),
              r
            );
          }
          return (0, s.Z)(n);
        })(M.rp),
        H =
          (M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          (function (e) {
            (0, c.Z)(n, e);
            var t = U(n);
            function n(e) {
              var r;
              (0, a.Z)(this, n);
              var i = e.resultTrackingId,
                o = e.autoCompleteItem;
              return (
                ((r = t.call(
                  this,
                  "AutoCompleteItemClickEvent"
                )).resultTrackingId = void 0),
                (r.autoCompleteItem = void 0),
                (r.resultTrackingId = i),
                (r.autoCompleteItem = o),
                r
              );
            }
            return (0, s.Z)(n);
          })(M.rp)),
        Q = (function (e) {
          (0, c.Z)(n, e);
          var t = U(n);
          function n(e) {
            var r;
            (0, a.Z)(this, n);
            var i = e.resultTrackingId,
              o = e.query;
            return (
              ((r = t.call(
                this,
                "AutoCompleteResultImpressionEvent"
              )).resultTrackingId = void 0),
              (r.query = void 0),
              (r.resultTrackingId = i),
              (r.query = o),
              r
            );
          }
          return (0, s.Z)(n);
        })(M.rp),
        V = (function (e) {
          (0, c.Z)(n, e);
          var t = U(n);
          function n(e) {
            var r;
            (0, a.Z)(this, n);
            var i = e.resultTrackingId;
            return (
              ((r = t.call(
                this,
                "AutoCompleteResultBounceEvent"
              )).resultTrackingId = void 0),
              (r.resultTrackingId = i),
              r
            );
          }
          return (0, s.Z)(n);
        })(M.rp),
        q = (function (e) {
          (0, c.Z)(n, e);
          var t = U(n);
          function n(e) {
            return (
              (0, a.Z)(this, n),
              t.call(this, "AutoCompleteClearHistoryClickEvent")
            );
          }
          return (0, s.Z)(n);
        })(M.rp),
        G = (function (e) {
          (0, c.Z)(n, e);
          var t = U(n);
          function n(e, r) {
            var i;
            return (
              (0, a.Z)(this, n),
              ((i = t.call(this, "GiftBuyablesStartEvent")).buyables = void 0),
              i
            );
          }
          return (
            (0, s.Z)(n, [
              {
                key: "allBuyables",
                get: function () {
                  return this.buyables;
                },
              },
            ]),
            n
          );
        })(M.rp),
        X = (function (e) {
          (0, c.Z)(n, e);
          var t = U(n);
          function n(e) {
            return (0, a.Z)(this, n), t.call(this, "CourseShareEvent");
          }
          return (0, s.Z)(n);
        })(M.rp),
        Y = (function (e) {
          (0, c.Z)(n, e);
          var t = U(n);
          function n(e, r) {
            return (0, a.Z)(this, n), t.call(this, "CourseShareToChannelEvent");
          }
          return (0, s.Z)(n);
        })(M.rp),
        K =
          (M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          M.rp,
          new Set()),
        J = "no_results";
      function $(e, t, n) {
        var r =
            arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
          i = r.relatedSourceId,
          o = void 0 === i ? null : i,
          a = r.relatedSourceType,
          s = void 0 === a ? null : a,
          c = e.frontendTrackingId || e.tracking_id;
        if (!K.has(c)) {
          var l = e.visibleBadgeFamilies
            ? e.visibleBadgeFamilies
            : (e.badges &&
                e.badges.map(function (e) {
                  return e.badge_family;
                })) ||
              null;
          j.j.publishEvent(
            new B({
              id: e.id,
              type: e._class || e.type,
              trackingId: c,
              serveTrackingId: e.tracking_id,
              backendSource: t,
              position: n + 1,
              badgeFamilies: l,
              relatedSourceId: o,
              relatedSourceType: s,
            })
          ),
            K.add(c);
        }
      }
      var ee = {
        alreadyTrackedUUIDs: K,
        trackDiscoveryImpression: $,
        udLiteTrackDiscoveryImpression: function (e, t) {
          var n = e.item,
            r = t.backendSource,
            i = t.index,
            o =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {},
            a = o.relatedSourceId,
            s = void 0 === a ? null : a,
            c = o.relatedSourceType,
            l = void 0 === c ? null : c;
          $(n, r, i, { relatedSourceId: s, relatedSourceType: l });
        },
        trackUnitView: function (e, t) {
          K.has(e.tracking_id) ||
            (j.j.publishEvent(
              new W({
                trackingId: e.tracking_id,
                unitTitle: e.title,
                renderType: t,
              })
            ),
            K.add(e.tracking_id));
        },
        trackAutoCompleteClearHistoryClick: function (e) {
          var t = e || J,
            n = "".concat("autocomplete-clearhistory-").concat(t);
          if (K.has(n)) return null;
          var r = new q(t);
          return j.j.publishEvent(r), t !== J && K.add(n), r;
        },
        trackAutoCompleteResultClick: function (e, t) {
          var n = "autocomplete-click-".concat(
            null === t || void 0 === t ? void 0 : t.tracking_id
          );
          if (!t || K.has(n)) return null;
          var r = new H({
            resultTrackingId: t.result_tracking_id,
            autoCompleteItem: {
              position: e,
              trackingId: t.tracking_id,
              phrase: t.label,
              type: t.type,
            },
          });
          return (
            j.j.publishEvent(r),
            ("course" !== t.type && "rvc" !== t.type) ||
              (0, D.K)(t.id, t.tracking_id),
            K.add(n),
            r
          );
        },
        trackAutoCompleteResultsBounce: function (e) {
          var t = e || J,
            n = "autocomplete-bounce-".concat(t),
            r = "autocomplete-click-".concat(t);
          if (K.has(n) || K.has(r)) return null;
          var i = new V({ resultTrackingId: t });
          return (
            j.j.publishEvent(i),
            n !== "autocomplete-bounce-".concat(J) && K.add(n),
            i
          );
        },
        trackAutoCompleteResultsImpression: function (e, t) {
          var n = e || J;
          if (K.has(n)) return null;
          var r = new Q({ resultTrackingId: n, query: t });
          return j.j.publishEvent(r), n !== J && K.add(n), r;
        },
        trackGiftBuyablesStartEvent: function (e, t) {
          var n = new G(e, t);
          return j.j.publishEvent(n), n;
        },
        trackCourseShareEvent: function (e) {
          var t = new X(e);
          return j.j.publishEvent(t), t;
        },
        trackCourseShareToChannelEvent: function (e, t) {
          var n = new Y(e, t);
          return j.j.publishEvent(n), n;
        },
      };
      var te = n(98906),
        ne = n.n(te),
        re = n(71333),
        ie = n.n(re),
        oe = n(24942),
        ae = n.n(oe),
        se = n(41022),
        ce = n.n(se),
        le = n(41293),
        ue = n(57514),
        de = n(97351),
        pe = /[\\^$.*+?()[\]{}|]/g,
        me = RegExp(pe.source);
      var fe = n(54992);
      function ge(e) {
        var t;
        return new RegExp(
          "("
            .concat("(\\s|^[!-/:-@[-`{-~]*)")
            .concat(
              (t = (0, fe.X)(e)) && me.test(t) ? t.replace(pe, "\\$&") : t,
              ")"
            ),
          "ig"
        );
      }
      n(77096);
      var he,
        ve,
        be,
        ye,
        _e,
        Ee,
        we = function (e, t) {
          return "course" === e
            ? t("Course")
            : "user" === e
            ? t("Instructor")
            : null;
        },
        Oe = function (e) {
          var t = e.id,
            n = e.title,
            r = e.display_name,
            i = e.type,
            o = e.img_link,
            a = e.initials,
            s = null,
            c = null,
            l = (0, _.useState)(!!o),
            u = l[0],
            d = l[1],
            p = function () {
              return d(!1);
            };
          if ("course" === i && u)
            (s = _.createElement(le.E, {
              alt: "",
              src: o,
              width: 32,
              height: 32,
              onError: p,
            })),
              (c = "ud-search-form-autocomplete-group-course-img");
          else if ("course" === i)
            (s = _.createElement(ie(), { size: "medium", label: !1 })),
              (c = "ud-search-form-autocomplete-group-icon");
          else if ("user" === i) {
            var m = {
              id: t,
              image_75x75: o,
              display_name: r,
              initials: a,
              title: n,
            };
            (s = _.createElement(
              ue.q,
              Object.assign(
                {
                  size: "small",
                  user: m,
                  alt: "NONE",
                  onError: p,
                  "data-testid": "avatar",
                },
                !u && {
                  icon: _.createElement(ae(), {
                    size: "small",
                    color: "inherit",
                    label: !1,
                  }),
                }
              )
            )),
              (c = "ud-search-form-autocomplete-group-img");
          } else
            (s = _.createElement(P(), {
              "data-testid": "search",
              size: "medium",
              label: !1,
            })),
              (c = "ud-search-form-autocomplete-group-icon");
          return _.createElement(
            "div",
            {
              "data-testid": "menu-content-icon",
              "data-type": i,
              className: c,
            },
            s
          );
        },
        Se = (0, y.Pi)(function (e) {
          var t = e.id,
            n = e.store,
            r = e.onMenuContentItemClick,
            i = e.trackMenuItemsImpression;
          (0, _.useEffect)(i, [
            n.suggestions
              .map(function (e) {
                return e.id;
              })
              .join(","),
            i,
          ]);
          var o = (0, x.QT)().gettext;
          return _.createElement(
            _.Fragment,
            null,
            n.suggestions.map(function (e, i) {
              var a = i === n.selectedSuggestionIndex;
              return _.createElement(
                "div",
                {
                  key: "".concat(i, "-").concat(e.link),
                  "data-testid": "result-with-image",
                  className:
                    "ud-search-form-autocomplete-suggestion-block-list-item",
                },
                _.createElement(
                  T.W.Item,
                  {
                    id: "".concat(t, "-").concat(i),
                    "aria-label": e.ariaLabel,
                    "aria-selected": a,
                    role: "option",
                    key: i,
                    href: e.link,
                    color: "neutral",
                    className: g()("ud-search-form-autocomplete-suggestion", {
                      "ud-search-form-autocomplete-suggestion-focus": a,
                    }),
                    onClick: r(i, e),
                  },
                  _.createElement(
                    "div",
                    {
                      "aria-hidden": "true",
                      className: g()("ud-search-form-autocomplete-group", {
                        "ud-search-form-autocomplete-group-search":
                          "search_log" === e.type,
                      }),
                      "data-testid": "group-search",
                    },
                    _.createElement(Oe, e),
                    _.createElement(
                      "div",
                      {
                        className:
                          "ud-search-form-autocomplete-suggestion-content",
                      },
                      _.createElement(
                        "div",
                        {
                          "data-purpose": "label",
                          "data-testid": "label",
                          className: g()(
                            "ud-search-form-autocomplete-suggestion-content",
                            "ud-heading-md"
                          ),
                        },
                        e.label
                      ),
                      "search_log" !== e.type &&
                        _.createElement(
                          "div",
                          {
                            className:
                              "ud-search-form-autocomplete-suggestion-details",
                          },
                          _.createElement(
                            "div",
                            { className: "ud-heading-xs" },
                            we(e.type, o)
                          ),
                          e.instructor_name &&
                            e.instructor_name.length > 0 &&
                            _.createElement(
                              "div",
                              {
                                "aria-hidden": "true",
                                className: g()(
                                  "ud-text-xs",
                                  "ud-search-form-autocomplete-suggestion-instructor-name"
                                ),
                                "data-testid": "instructor-name",
                              },
                              e.instructor_name[0]
                            )
                        )
                    )
                  )
                )
              );
            })
          );
        }),
        ke = (0, y.Pi)(function (e) {
          var t = e.id,
            n = e.store,
            r = e.onMenuContentItemClick,
            i = e.trackMenuItemsImpression,
            o = (0, x.QT)().gettext;
          (0, _.useEffect)(i, [
            n.suggestions
              .map(function (e) {
                return e.id;
              })
              .join(","),
            i,
          ]);
          var a = n.suggestions.filter(function (e) {
              return "search_log" === e.type;
            }),
            s = n.suggestions.filter(function (e) {
              return "course" === e.type;
            }),
            c = n.suggestions.indexOf(s[0]),
            l = function (e) {
              return e === n.selectedSuggestionIndex;
            };
          return _.createElement(
            _.Fragment,
            null,
            a &&
              _.createElement(
                "div",
                { className: "ud-search-form-autocomplete-title" },
                _.createElement(
                  "div",
                  {
                    className: g()(
                      "ud-heading-md",
                      "ud-search-form-autocomplete-title-text"
                    ),
                    "data-purpose": "title",
                  },
                  o("Popular on Udemy")
                )
              ),
            a.map(function (e, n) {
              return _.createElement(
                "div",
                {
                  key: "".concat(n, "-").concat(e.link),
                  className:
                    "ud-search-form-autocomplete-suggestion-block-list-item",
                },
                _.createElement(
                  T.W.Item,
                  {
                    id: "".concat(t, "-").concat(n),
                    "aria-label": e.ariaLabel,
                    "aria-selected": l(n),
                    role: "option",
                    key: n,
                    href: e.link,
                    color: "neutral",
                    className: g()("ud-search-form-autocomplete-suggestion", {
                      "ud-search-form-autocomplete-suggestion-focus": l(n),
                    }),
                    onClick: r(n, e),
                  },
                  _.createElement(
                    "div",
                    {
                      "aria-hidden": "true",
                      className: "ud-search-form-autocomplete-group",
                    },
                    _.createElement(
                      "div",
                      { className: "ud-search-form-autocomplete-group-icon" },
                      _.createElement(ce(), { label: !1 })
                    ),
                    _.createElement(
                      "div",
                      {
                        className:
                          "ud-search-form-autocomplete-suggestion-content",
                      },
                      _.createElement(
                        "div",
                        {
                          "data-purpose": "label",
                          className:
                            "ud-search-form-autocomplete-suggestion-content",
                        },
                        e.label
                      )
                    )
                  )
                )
              );
            }),
            s &&
              _.createElement(
                "div",
                { className: "ud-search-form-autocomplete-title" },
                _.createElement(
                  "div",
                  {
                    className: g()(
                      "ud-heading-md",
                      "ud-search-form-autocomplete-title-text"
                    ),
                    "data-purpose": "title",
                  },
                  o("Popular Courses on Udemy")
                )
              ),
            s.map(function (e, n) {
              var i = n + c;
              return _.createElement(
                "div",
                {
                  key: "".concat(i, "-").concat(e.link),
                  className:
                    "ud-search-form-autocomplete-suggestion-block-list-item",
                },
                _.createElement(
                  T.W.Item,
                  {
                    id: "".concat(t, "-").concat(i),
                    "aria-label": e.ariaLabel,
                    "aria-selected": l(i),
                    role: "option",
                    key: i,
                    href: e.link,
                    color: "neutral",
                    className: g()("ud-search-form-autocomplete-suggestion", {
                      "ud-search-form-autocomplete-suggestion-focus": l(i),
                    }),
                    onClick: r(i, e),
                  },
                  _.createElement(
                    "div",
                    {
                      "aria-hidden": "true",
                      className: "ud-search-form-autocomplete-group",
                    },
                    _.createElement(Oe, e),
                    _.createElement(
                      "div",
                      {
                        className:
                          "ud-search-form-autocomplete-suggestion-content",
                      },
                      _.createElement(
                        "div",
                        {
                          "data-purpose": "label",
                          className:
                            "ud-search-form-autocomplete-suggestion-content",
                        },
                        e.label
                      ),
                      _.createElement(
                        "div",
                        {
                          className:
                            "ud-search-form-autocomplete-suggestion-details",
                        },
                        _.createElement(
                          "div",
                          { className: "ud-heading-xs" },
                          we(e.type, o)
                        ),
                        e.instructor_name &&
                          e.instructor_name.length > 0 &&
                          _.createElement(
                            "div",
                            {
                              "aria-hidden": "true",
                              className: g()(
                                "ud-text-xs",
                                "ud-search-form-autocomplete-suggestion-instructor-name"
                              ),
                            },
                            e.instructor_name[0]
                          )
                      )
                    )
                  )
                )
              );
            })
          );
        }),
        Ce = (0, y.Pi)(function (e) {
          var t = e.id,
            n = e.store,
            r = e.onMenuContentItemClick,
            i = e.trackMenuItemsImpression;
          return (
            (0, _.useEffect)(i, [
              n.suggestions
                .map(function (e) {
                  return e.id;
                })
                .join(","),
              i,
            ]),
            _.createElement(
              _.Fragment,
              null,
              n.suggestions.map(function (e, i) {
                var o = i === n.selectedSuggestionIndex,
                  a = (function (e, t) {
                    var n = t.split(/\s+/g);
                    return (0, fe.X)(e)
                      .split(" ")
                      .map(function (e) {
                        var t, r;
                        for (t = 0; t < n.length; t++) {
                          r = ge(n[t]);
                          var i = e.replace(r, "<strong>$1</strong>");
                          if (e !== i) return i;
                        }
                        return e;
                      })
                      .join(" ");
                  })(e.label, n.inputValue),
                  s = null;
                return (
                  (s =
                    "course" === e.type
                      ? _.createElement(ne(), { label: !1 })
                      : "user" === e.type
                      ? _.createElement(ae(), { label: !1 })
                      : _.createElement(P(), { label: !1 })),
                  _.createElement(
                    T.W.Item,
                    {
                      key: i,
                      id: "".concat(t, "-").concat(i),
                      href: e.link,
                      "aria-selected": o,
                      role: "option",
                      icon: s,
                      color: "neutral",
                      "aria-label": e.ariaLabel,
                      className: g()("ud-search-form-autocomplete-suggestion", {
                        "ud-search-form-autocomplete-suggestion-focus": o,
                      }),
                      onClick: r(i, e),
                    },
                    _.createElement(
                      "div",
                      Object.assign(
                        {
                          "aria-hidden": "true",
                          "data-type": e.type,
                          className:
                            "ud-search-form-autocomplete-suggestion-content",
                        },
                        (0, de.S)({
                          descriptionOfCaller: "search-form-autocomplete:label",
                          html: a,
                          dataPurpose: "label",
                        })
                      )
                    )
                  )
                );
              })
            )
          );
        }),
        xe = [
          "formAction",
          "formActionParams",
          "inputProps",
          "label",
          "searchFormAutocompleteStore",
          "reversed",
          "submitButtonProps",
          "textSize",
          "showResultsWithImage",
          "isHeaderMobile",
          "gettext",
          "dgettext",
          "dngettext",
          "dpgettext",
          "ngettext",
          "npgettext",
          "pgettext",
          "interpolate",
          "ninterpolate",
        ];
      function Ne(e) {
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
          var n,
            r = (0, u.Z)(e);
          if (t) {
            var i = (0, u.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, l.Z)(this, n);
        };
      }
      var Pe =
          (0, y.Pi)(
            ((ve = (function (e) {
              (0, c.Z)(n, e);
              var t = Ne(n);
              function n() {
                return (0, a.Z)(this, n), t.apply(this, arguments);
              }
              return (
                (0, s.Z)(n, [
                  {
                    key: "render",
                    value: function () {
                      var e = this.props,
                        t = e.id,
                        n = e.store,
                        r = e.textSize,
                        i = e.onMenuContentItemClick,
                        o = e.trackMenuItemsImpression,
                        a = e.showResultsWithImage,
                        s = a ? Se : Ce;
                      return _.createElement(
                        T.W,
                        {
                          id: "".concat(t, "-menu-content-items"),
                          "data-testid": "menu-content-items",
                          size: r,
                          className: g()(
                            "js-suggestions",
                            { "ud-search-form-autocomplete-suggestions": !a },
                            {
                              "ud-search-form-autocomplete-suggestions-with-image":
                                a,
                            }
                          ),
                          role: "listbox",
                        },
                        n.shouldLoadPopularQueries
                          ? _.createElement(ke, {
                              id: t,
                              store: n,
                              onMenuContentItemClick: i,
                              trackMenuItemsImpression: o,
                            })
                          : _.createElement(s, {
                              id: t,
                              store: n,
                              onMenuContentItemClick: i,
                              trackMenuItemsImpression: o,
                            })
                      );
                    },
                  },
                ]),
                n
              );
            })(_.Component)),
            (ve.defaultProps = {
              trackMenuItemsImpression: L.Z,
              onMenuContentItemClick: L.Z,
              textSize: "large",
              showResultsWithImage: !1,
            }),
            (he = ve))
          ) || he,
        Ie =
          (0, C.lK)({ isHeaderMobile: "header-mobile-max" })(
            (be =
              (0, y.Pi)(
                ((Ee = (function (e) {
                  (0, c.Z)(n, e);
                  var t = Ne(n);
                  function n() {
                    var e;
                    return (
                      (0, a.Z)(this, n),
                      ((e = t.apply(this, arguments)).defaultId = (0, w.Ki)(
                        "search-form-autocomplete"
                      )),
                      (0, d.Z)((0, o.Z)(e), "isOnTask", _e, (0, o.Z)(e)),
                      e
                    );
                  }
                  return (
                    (0, s.Z)(n, [
                      {
                        key: "id",
                        get: function () {
                          return this.props.id || this.defaultId;
                        },
                      },
                      {
                        key: "startTimeOnTask",
                        value: function () {
                          var e =
                            this.props.searchFormAutocompleteStore.isMenuOpen;
                          e && !this.isOnTask
                            ? ((this.isOnTask = !0),
                              UD.performance.start("timeontask:autocomplete"))
                            : e || (this.isOnTask = !1);
                        },
                      },
                      {
                        key: "endTimeOnTask",
                        value: function () {
                          UD.performance.end("timeontask:autocomplete"),
                            (this.isOnTask = !1);
                        },
                      },
                      {
                        key: "onFocus",
                        value: function (e) {
                          var t, n;
                          this.props.searchFormAutocompleteStore.openMenu(),
                            this.startTimeOnTask(),
                            this.props.searchFormAutocompleteStore.suggest(
                              e.target.value
                            ),
                            null ===
                              (t = (n = this.props.inputProps).onFocus) ||
                              void 0 === t ||
                              t.call(n, e);
                        },
                      },
                      {
                        key: "changeMenuVisibility",
                        value: function () {
                          var e = this.props.searchFormAutocompleteStore;
                          ((!this.props.isHeaderMobile && e.isMenuOpen) ||
                            (this.props.isHeaderMobile &&
                              !e.isMenuOpen &&
                              this.isOnTask)) &&
                            this.closeMenu();
                        },
                      },
                      {
                        key: "closeMenu",
                        value: function () {
                          this.endTimeOnTask();
                          var e = this.props.searchFormAutocompleteStore;
                          e.closeMenu(),
                            e.suggestions.length > 0 &&
                              ee.trackAutoCompleteResultsBounce(e.trackingId);
                        },
                      },
                      {
                        key: "onChange",
                        value: function (e) {
                          var t, n;
                          this.props.searchFormAutocompleteStore.suggest(
                            e.target.value
                          ),
                            this.props.searchFormAutocompleteStore.inputValue ||
                              this.props.searchFormAutocompleteStore.setSuggestions(
                                []
                              ),
                            null ===
                              (t = (n = this.props.inputProps).onChange) ||
                              void 0 === t ||
                              t.call(n, e);
                        },
                      },
                      {
                        key: "onSubmit",
                        value: function () {
                          I.Gk.allowsPerformanceCookies() &&
                            v().set("query_session_identifier_id", (0, k.t1)());
                        },
                      },
                      {
                        key: "onKeyDown",
                        value: function (e) {
                          var t = e.keyCode,
                            n = this.props.searchFormAutocompleteStore;
                          if (t === O.R.RETURN && n.selectedSuggestion)
                            e.preventDefault(),
                              this.clickSelectedSuggestion(
                                n.selectedSuggestionIndex
                              );
                          else if (t !== O.R.ESCAPE || n.inputValue)
                            if (t === O.R.ESCAPE) {
                              var r;
                              e.preventDefault(),
                                !this.props.isHeaderMobile && this.closeMenu(),
                                null ===
                                  (r = document.getElementById(this.id)) ||
                                  void 0 === r ||
                                  r.focus();
                            } else
                              t === O.R.UP || t === O.R.DOWN
                                ? (e.preventDefault(),
                                  t === O.R.UP
                                    ? n.selectPreviousSuggestion()
                                    : n.selectNextSuggestion())
                                : t === O.R.TAB &&
                                  n.suggestions.length > 0 &&
                                  n.isMenuOpen &&
                                  (e.preventDefault(),
                                  e.shiftKey
                                    ? n.selectPreviousSuggestion()
                                    : n.selectNextSuggestion());
                          else {
                            var i;
                            e.preventDefault(),
                              !this.props.isHeaderMobile && this.closeMenu(),
                              null === (i = document.getElementById(this.id)) ||
                                void 0 === i ||
                                i.blur();
                          }
                        },
                      },
                      {
                        key: "clickSelectedSuggestion",
                        value: function (e) {
                          var t,
                            n = E.findDOMNode(this);
                          null === n ||
                            void 0 === n ||
                            null ===
                              (t =
                                n.querySelectorAll(".js-suggestions a")[e]) ||
                            void 0 === t ||
                            t.click();
                        },
                      },
                      {
                        key: "onMenuContentItemClick",
                        value: function (e, t) {
                          var n = this;
                          return function () {
                            n.endTimeOnTask(),
                              ee.trackAutoCompleteResultClick(e, t);
                          };
                        },
                      },
                      {
                        key: "trackMenuItemsImpression",
                        value: function () {
                          this.props.searchFormAutocompleteStore.suggestions
                            .length > 0 &&
                            ee.trackAutoCompleteResultsImpression(
                              this.props.searchFormAutocompleteStore.trackingId,
                              this.props.searchFormAutocompleteStore.query
                            );
                        },
                      },
                      {
                        key: "isExpanded",
                        get: function () {
                          var e = this.props.searchFormAutocompleteStore;
                          return e.isMenuOpen && e.suggestions.length > 0;
                        },
                      },
                      {
                        key: "menuContent",
                        get: function () {
                          var e = this.props,
                            t = e.textSize,
                            n = e.showResultsWithImage,
                            r = e.searchFormAutocompleteStore;
                          return this.isExpanded
                            ? _.createElement(Pe, {
                                id: this.id,
                                store: r,
                                textSize: t,
                                onMenuContentItemClick:
                                  this.onMenuContentItemClick,
                                trackMenuItemsImpression:
                                  this.trackMenuItemsImpression,
                                showResultsWithImage: n,
                              })
                            : null;
                        },
                      },
                      {
                        key: "render",
                        value: function () {
                          var e = this.props,
                            t = e.formAction,
                            n = e.formActionParams,
                            o = e.inputProps,
                            a = e.label,
                            s = void 0 === a ? this.props.gettext("Search") : a,
                            c = e.searchFormAutocompleteStore,
                            l = e.reversed,
                            u = e.submitButtonProps,
                            d = e.textSize,
                            p =
                              (e.showResultsWithImage,
                              e.isHeaderMobile,
                              e.gettext),
                            m =
                              (e.dgettext,
                              e.dngettext,
                              e.dpgettext,
                              e.ngettext,
                              e.npgettext,
                              e.pgettext,
                              e.interpolate,
                              e.ninterpolate,
                              (0, i.Z)(e, xe));
                          return _.createElement(
                            S.zx,
                            { onRootClose: this.changeMenuVisibility },
                            _.createElement(
                              R.cw,
                              Object.assign({}, m, {
                                label: s,
                                labelProps: { className: "ud-sr-only" },
                                formControlId: this.id,
                                className: g()(
                                  "ud-search-form-autocomplete",
                                  m.className
                                ),
                                onKeyDown: this.onKeyDown,
                              }),
                              _.createElement(
                                "form",
                                {
                                  action: t,
                                  className: g()(
                                    "ud-search-form-autocomplete-input-group",
                                    {
                                      "ud-search-form-autocomplete-input-group-reversed":
                                        l,
                                    }
                                  ),
                                  onSubmit: this.onSubmit,
                                },
                                Object.entries(n).map(function (e) {
                                  var t = (0, r.Z)(e, 2),
                                    n = t[0],
                                    i = t[1];
                                  return _.createElement("input", {
                                    key: n,
                                    type: "hidden",
                                    name: n,
                                    value: i,
                                  });
                                }),
                                _.createElement(
                                  A.o,
                                  Object.assign(
                                    {
                                      name: "q",
                                      "data-testid": "search-input",
                                      placeholder: s,
                                    },
                                    o,
                                    {
                                      autoComplete: "off",
                                      size: d,
                                      className: g()(
                                        "ud-search-form-autocomplete-input",
                                        o.className
                                      ),
                                      onChange: this.onChange,
                                      onFocus: this.onFocus,
                                      value: c.searchPhrase,
                                      role: "combobox",
                                      "aria-autocomplete": "both",
                                      "aria-haspopup": "true",
                                      "aria-activedescendant":
                                        c.selectedSuggestionIndex >= 0
                                          ? ""
                                              .concat(this.id, "-")
                                              .concat(c.selectedSuggestionIndex)
                                          : void 0,
                                      "aria-expanded": this.isExpanded,
                                      "aria-controls": "".concat(
                                        this.id,
                                        "-menu-content-items"
                                      ),
                                    }
                                  )
                                ),
                                this.menuContent,
                                _.createElement(
                                  Z.h,
                                  Object.assign({}, u, {
                                    type: "submit",
                                    disabled: !c.searchPhrase,
                                  }),
                                  _.createElement(P(), {
                                    color:
                                      "primary" === u.udStyle
                                        ? "inherit"
                                        : "neutral",
                                    label: p("Submit search"),
                                  })
                                )
                              )
                            )
                          );
                        },
                      },
                    ]),
                    n
                  );
                })(_.Component)),
                (Ee.defaultProps = {
                  id: void 0,
                  label: void 0,
                  inputProps: {},
                  submitButtonProps: { udStyle: "ghost" },
                  formAction: null,
                  formActionParams: {},
                  reversed: !1,
                  textSize: "large",
                  showResultsWithImage: !1,
                  isHeaderMobile: null,
                }),
                (ye = Ee),
                (_e = (0, p.Z)(ye.prototype, "isOnTask", [b.LO], {
                  configurable: !0,
                  enumerable: !0,
                  writable: !0,
                  initializer: function () {
                    return !1;
                  },
                })),
                (0, p.Z)(
                  ye.prototype,
                  "startTimeOnTask",
                  [m.ZP],
                  Object.getOwnPropertyDescriptor(
                    ye.prototype,
                    "startTimeOnTask"
                  ),
                  ye.prototype
                ),
                (0, p.Z)(
                  ye.prototype,
                  "endTimeOnTask",
                  [m.ZP],
                  Object.getOwnPropertyDescriptor(
                    ye.prototype,
                    "endTimeOnTask"
                  ),
                  ye.prototype
                ),
                (0, p.Z)(
                  ye.prototype,
                  "onFocus",
                  [m.ZP],
                  Object.getOwnPropertyDescriptor(ye.prototype, "onFocus"),
                  ye.prototype
                ),
                (0, p.Z)(
                  ye.prototype,
                  "changeMenuVisibility",
                  [m.ZP],
                  Object.getOwnPropertyDescriptor(
                    ye.prototype,
                    "changeMenuVisibility"
                  ),
                  ye.prototype
                ),
                (0, p.Z)(
                  ye.prototype,
                  "closeMenu",
                  [m.ZP],
                  Object.getOwnPropertyDescriptor(ye.prototype, "closeMenu"),
                  ye.prototype
                ),
                (0, p.Z)(
                  ye.prototype,
                  "onChange",
                  [m.ZP],
                  Object.getOwnPropertyDescriptor(ye.prototype, "onChange"),
                  ye.prototype
                ),
                (0, p.Z)(
                  ye.prototype,
                  "onSubmit",
                  [m.ZP],
                  Object.getOwnPropertyDescriptor(ye.prototype, "onSubmit"),
                  ye.prototype
                ),
                (0, p.Z)(
                  ye.prototype,
                  "onKeyDown",
                  [m.ZP],
                  Object.getOwnPropertyDescriptor(ye.prototype, "onKeyDown"),
                  ye.prototype
                ),
                (0, p.Z)(
                  ye.prototype,
                  "onMenuContentItemClick",
                  [m.ZP],
                  Object.getOwnPropertyDescriptor(
                    ye.prototype,
                    "onMenuContentItemClick"
                  ),
                  ye.prototype
                ),
                (0, p.Z)(
                  ye.prototype,
                  "trackMenuItemsImpression",
                  [m.ZP],
                  Object.getOwnPropertyDescriptor(
                    ye.prototype,
                    "trackMenuItemsImpression"
                  ),
                  ye.prototype
                ),
                (be = ye))
              ) || be)
          ) || be,
        Te = (0, x.GV)(Ie),
        Ze = n(59499),
        Re = n(50029),
        Ae = n(87794),
        Le = n.n(Ae),
        je = n(9669),
        De = n.n(je),
        Me = n(48809),
        ze = n(88767);
      function Ue(e, t) {
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
      function Fe(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? Ue(Object(n), !0).forEach(function (t) {
                (0, Ze.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : Ue(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var Be = function () {
          var e = v().get();
          if (e.ud_locale)
            return { "Accept-Language": e.ud_locale.split("_").join("-") };
        },
        We = function (e, t, n) {
          return (0, Re.Z)(
            Le().mark(function r() {
              var i, o, a, s, c;
              return Le().wrap(function (r) {
                for (;;)
                  switch ((r.prev = r.next)) {
                    case 0:
                      return (
                        n &&
                          "_signal" in n &&
                          ((i = n._signal), delete n._signal),
                        "/api/2022-03/graphql/",
                        (r.next = 4),
                        fetch("/api/2022-03/graphql/", {
                          method: "POST",
                          headers: Fe(
                            Fe({ "Content-Type": "application/json" }, Be()),
                            null !== n && void 0 !== n ? n : {}
                          ),
                          body: JSON.stringify({ query: e, variables: t }),
                          signal: i,
                        })
                      );
                    case 4:
                      return (o = r.sent), (r.next = 7), o.json();
                    case 7:
                      if (!(a = r.sent).errors) {
                        r.next = 11;
                        break;
                      }
                      throw (
                        ((s = a.errors[0] || "Error.."),
                        (c = s.message),
                        new Error(c))
                      );
                    case 11:
                      return r.abrupt("return", a.data);
                    case 12:
                    case "end":
                      return r.stop();
                  }
              }, r);
            })
          );
        },
        He =
          "\n    query AutocompleteSuggestions($searchedPhrase: String!) {\n  searchAutocomplete(request: {searchedPhrase: $searchedPhrase}) {\n    item {\n      ... on SearchAutocompleteLogItem {\n        phrase: title\n        __typename\n      }\n      ... on CourseInstructor {\n        id\n        name\n        url\n        images {\n          px50x50\n        }\n        __typename\n      }\n      ... on Course {\n        id\n        title\n        url\n        instructors {\n          name\n        }\n        images {\n          px50x50\n        }\n        __typename\n      }\n    }\n    resultTrackingId\n    trackingId\n  }\n}\n    ",
        Qe = function (e, t) {
          return (0, ze.useQuery)(["AutocompleteSuggestions", e], We(He, e), t);
        };
      (Qe.getKey = function (e) {
        return ["AutocompleteSuggestions", e];
      }),
        (Qe.fetcher = function (e, t) {
          return We(He, e, t);
        });
      var Ve,
        qe,
        Ge,
        Xe,
        Ye,
        Ke,
        Je,
        $e,
        et,
        tt,
        nt,
        rt,
        it,
        ot = n(43283),
        at = function (e) {
          var t = [];
          return (
            e.forEach(function (e) {
              var n;
              if (e) {
                var r = "",
                  i = { id: 0 };
                if (
                  "SearchAutocompleteLogItem" ===
                  (null === (n = e.item) || void 0 === n
                    ? void 0
                    : n.__typename)
                ) {
                  var o;
                  (r = null !== (o = e.item.phrase) && void 0 !== o ? o : ""),
                    (i.id = 0),
                    (i.link = (function (e) {
                      var t = (0, ot.c)().brand.has_organization
                        ? "/organization/search/"
                        : "/courses/search/";
                      return "".concat(t, "?q=").concat(e);
                    })(r)),
                    (i.type = "search_log");
                } else {
                  var a, s, c, l, u;
                  if (
                    "Course" ===
                    (null === (a = e.item) || void 0 === a
                      ? void 0
                      : a.__typename)
                  ) {
                    var d,
                      p,
                      m,
                      f = e.item;
                    (r = null !== (d = f.title) && void 0 !== d ? d : ""),
                      (i.img_link =
                        null !== (p = f.images.px50x50) && void 0 !== p
                          ? p
                          : ""),
                      (i.instructor_name =
                        null === (m = f.instructors) || void 0 === m
                          ? void 0
                          : m.map(function (e) {
                              return e.name;
                            })),
                      (i.type = "course");
                  } else if (
                    "CourseInstructor" ===
                    (null === (s = e.item) || void 0 === s
                      ? void 0
                      : s.__typename)
                  ) {
                    var g,
                      h,
                      v = e.item;
                    (r = null !== (g = e.item.name) && void 0 !== g ? g : ""),
                      (i.display_name = r),
                      (i.img_link =
                        null !== (h = v.images.px50x50) && void 0 !== h
                          ? h
                          : ""),
                      (i.type = "user");
                  }
                  (i.id =
                    null !==
                      (c = Number(
                        null === (l = e.item) || void 0 === l ? void 0 : l.id
                      )) && void 0 !== c
                      ? c
                      : 0),
                    (i.link =
                      null === (u = e.item) || void 0 === u ? void 0 : u.url);
                }
                (i.label = r),
                  (i.result_tracking_id = e.resultTrackingId),
                  (i.tracking_id = e.trackingId),
                  t.push(i);
              }
            }),
            t
          );
        };
      function st(e, t) {
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
      function ct(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? st(Object(n), !0).forEach(function (t) {
                (0, Ze.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : st(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var lt = "NOT_LOADED",
        ut = "LOADING",
        dt = "LOADED",
        pt = function (e, t) {
          return "course" === e
            ? t("Course")
            : "user" === e
            ? t("Instructor")
            : null;
        },
        mt = function (e) {
          console.error(e);
        },
        ft =
          ((Ve = b.LO.ref),
          (qe = (function () {
            function e(t) {
              var n,
                r,
                i,
                o,
                s = this;
              (0, a.Z)(this, e),
                (this._cancelSource = void 0),
                (this._getAPIParams = void 0),
                (this._getFormParams = void 0),
                (this._suggestTimeoutId = void 0),
                (this._url = void 0),
                (this.gettext = void 0),
                (0, d.Z)(this, "inputValue", Ge, this),
                (0, d.Z)(this, "isMenuOpen", Xe, this),
                (0, d.Z)(this, "isPopularQueriesExperimentEnabled", Ye, this),
                (0, d.Z)(this, "loadingState", Ke, this),
                (0, d.Z)(this, "searchFormExperimentFeatures", Je, this),
                (0, d.Z)(this, "selectedSuggestionIndex", $e, this),
                (0, d.Z)(this, "suggestionsCount", et, this),
                (0, d.Z)(this, "suggestions", tt, this),
                (this.cachedSuggestions = {}),
                (this.captureException = void 0),
                (this.maxInputLength = 200),
                (this.minInputLength = 2),
                (this.suggestTimeout = 200),
                (this._loadSuggestions = (0, Re.Z)(
                  Le().mark(function e() {
                    var t;
                    return Le().wrap(
                      function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              return (
                                (s._cancelSource = new AbortController()),
                                (e.prev = 1),
                                (e.next = 4),
                                s.loadSuggestions({
                                  q: s.query,
                                  signal: s._cancelSource.signal,
                                })
                              );
                            case 4:
                              e.next = 11;
                              break;
                            case 6:
                              (e.prev = 6),
                                (e.t0 = e.catch(1)),
                                !(t =
                                  De().isCancel(e.t0) ||
                                  "AbortError" ===
                                    (null === e.t0 || void 0 === e.t0
                                      ? void 0
                                      : e.t0.name)) &&
                                  (null === e.t0 || void 0 === e.t0
                                    ? void 0
                                    : e.t0.message) &&
                                  s.captureException(e.t0),
                                !t && s.setSuggestions([]);
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
                (0, d.Z)(this, "openMenu", nt, this),
                (0, d.Z)(this, "closeMenu", rt, this),
                (0, d.Z)(this, "clearInputValue", it, this),
                (this._url = t.url),
                (this.captureException = t.captureException || mt),
                (this._getAPIParams =
                  null !== (n = t.getAPIParams) && void 0 !== n ? n : null),
                (this._getFormParams =
                  null !== (r = t.getFormParams) && void 0 !== r
                    ? r
                    : function () {
                        return {};
                      }),
                (this.gettext = t.gettext),
                (this.searchFormExperimentFeatures =
                  null !== (i = t.searchFormExperimentFeatures) && void 0 !== i
                    ? i
                    : {}),
                (this.isPopularQueriesExperimentEnabled =
                  null !== (o = t.isPopularQueriesExperimentEnabled) &&
                  void 0 !== o &&
                  o),
                (this.suggestions = []),
                t.inputValue && (this.inputValue = t.inputValue);
            }
            return (
              (0, s.Z)(e, [
                {
                  key: "selectedSuggestion",
                  get: function () {
                    return (
                      this.suggestions[this.selectedSuggestionIndex] || void 0
                    );
                  },
                },
                {
                  key: "query",
                  get: function () {
                    return this.searchPhrase
                      ? this.searchPhrase
                          .trim()
                          .substring(0, this.maxInputLength)
                          .trim()
                      : "";
                  },
                },
                {
                  key: "shouldLoadPopularQueries",
                  get: function () {
                    var e;
                    return (
                      this.isPopularQueriesExperimentEnabled &&
                      0 ===
                        (null !== (e = this.inputValue) && void 0 !== e
                          ? e
                          : ""
                        ).length
                    );
                  },
                },
                {
                  key: "searchPhrase",
                  get: function () {
                    return this.selectedSuggestion
                      ? this.selectedSuggestion.label
                      : this.inputValue;
                  },
                },
                {
                  key: "trackingId",
                  get: function () {
                    return this.suggestions.length > 0
                      ? this.suggestions[0].result_tracking_id
                      : null;
                  },
                },
                {
                  key: "loadSuggestions",
                  value: (function () {
                    var e = (0, Re.Z)(
                      Le().mark(function e(t) {
                        var n;
                        return Le().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  if (
                                    !this.searchFormExperimentFeatures
                                      .getAutocompleteSuggestionsWithGQL
                                  ) {
                                    e.next = 6;
                                    break;
                                  }
                                  return (
                                    (e.next = 3), this.loadSuggestionsWithGQL(t)
                                  );
                                case 3:
                                  (e.t0 = e.sent), (e.next = 9);
                                  break;
                                case 6:
                                  return (
                                    (e.next = 8),
                                    this.loadSuggestionsWithRest(t)
                                  );
                                case 8:
                                  e.t0 = e.sent;
                                case 9:
                                  (n = e.t0), this._processResults(t.q, n);
                                case 11:
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
                  key: "loadSuggestionsWithRest",
                  value: (function () {
                    var e = (0, Re.Z)(
                      Le().mark(function e(t) {
                        var n, r, i, o, a, s, c;
                        return Le().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (i = t.q),
                                    (o = t.signal),
                                    (a = this._getAPIParams
                                      ? this._getAPIParams()
                                      : {}),
                                    (e.next = 4),
                                    Me.uh.get(this._url, {
                                      signal: o,
                                      params: ct({ q: i }, a),
                                    })
                                  );
                                case 4:
                                  return (
                                    (s = e.sent),
                                    (null !==
                                      (c =
                                        null !==
                                          (n =
                                            null === s ||
                                            void 0 === s ||
                                            null === (r = s.data) ||
                                            void 0 === r
                                              ? void 0
                                              : r.results) && void 0 !== n
                                          ? n
                                          : []) && void 0 !== c
                                      ? c
                                      : []
                                    ).forEach(function (e) {
                                      var t, n, r, i, o;
                                      (e.type =
                                        null !==
                                          (t =
                                            null !== (n = e.type) &&
                                            void 0 !== n
                                              ? n
                                              : e._class) && void 0 !== t
                                          ? t
                                          : null),
                                        (e.label =
                                          null !==
                                            (r =
                                              null !== (i = e.label) &&
                                              void 0 !== i
                                                ? i
                                                : e.phrase) && void 0 !== r
                                            ? r
                                            : e.title),
                                        (e.link =
                                          null !== (o = e.link) && void 0 !== o
                                            ? o
                                            : e.url);
                                    }),
                                    e.abrupt("return", c)
                                  );
                                case 8:
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
                  key: "loadSuggestionsWithGQL",
                  value: (function () {
                    var e = (0, Re.Z)(
                      Le().mark(function e(t) {
                        var n, r, i, o;
                        return Le().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  return (
                                    (n = { searchedPhrase: t.q }),
                                    (r = []),
                                    (e.prev = 2),
                                    (e.next = 5),
                                    Qe.fetcher(n, { _signal: t.signal })()
                                  );
                                case 5:
                                  (o = e.sent),
                                    (r =
                                      null !== (i = o.searchAutocomplete) &&
                                      void 0 !== i
                                        ? i
                                        : []),
                                    (e.next = 13);
                                  break;
                                case 9:
                                  if (
                                    ((e.prev = 9),
                                    (e.t0 = e.catch(2)),
                                    "AbortError" === e.t0.name)
                                  ) {
                                    e.next = 13;
                                    break;
                                  }
                                  throw e.t0;
                                case 13:
                                  return e.abrupt("return", at(r));
                                case 14:
                                case "end":
                                  return e.stop();
                              }
                          },
                          e,
                          null,
                          [[2, 9]]
                        );
                      })
                    );
                    return function (t) {
                      return e.apply(this, arguments);
                    };
                  })(),
                },
                {
                  key: "_processResults",
                  value: function (e, t) {
                    var n,
                      i = this;
                    this.suggestionsCount =
                      null !==
                        (n = null === t || void 0 === t ? void 0 : t.length) &&
                      void 0 !== n
                        ? n
                        : 0;
                    var o = new Array();
                    (null !== t && void 0 !== t ? t : []).forEach(function (t) {
                      var n;
                      if (
                        ((t.ariaLabel = (function (e, t) {
                          var n = [];
                          return (
                            "search_log" === e.type
                              ? n.push(t("Search"), ": ", e.label)
                              : "course" === e.type
                              ? (n.push(pt(e.type, t), ": ", e.label),
                                e.instructor_name &&
                                  e.instructor_name.length > 0 &&
                                  n.push(
                                    " - ",
                                    pt("user", t),
                                    ": ",
                                    e.instructor_name
                                  ))
                              : n.push(pt("user", t), ": ", e.display_name),
                            n.join("")
                          );
                        })(t, i.gettext)),
                        t.label && t.link)
                      ) {
                        var a = t.link.split("?"),
                          s = (0, r.Z)(a, 2),
                          c = s[0],
                          l = s[1],
                          u = new URLSearchParams(l),
                          d =
                            null === (n = i._getFormParams) || void 0 === n
                              ? void 0
                              : n.call(i);
                        for (var p in d) u.set(p, d[p]);
                        u.set("src", "sac"),
                          e && u.set("kw", e),
                          (t.link = "".concat(c, "?").concat(u.toString())),
                          o.push(t);
                      }
                    }),
                      this.setSuggestions(o),
                      0 !== e.length &&
                        Object.assign(
                          this.cachedSuggestions,
                          (0, Ze.Z)({}, e, o)
                        );
                  },
                },
                {
                  key: "setSearchFormExperimentFeatures",
                  value: function (e) {
                    this.searchFormExperimentFeatures = e;
                  },
                },
                {
                  key: "setInputValue",
                  value: function (e) {
                    this.inputValue = e;
                  },
                },
                {
                  key: "suggest",
                  value: (function () {
                    var e = (0, Re.Z)(
                      Le().mark(function e(t) {
                        var n;
                        return Le().wrap(
                          function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  this.setInputValue(t),
                                    (this.minInputLength = this
                                      .shouldLoadPopularQueries
                                      ? -1
                                      : 2),
                                    this.query.length >= this.minInputLength &&
                                      this.openMenu(),
                                    (this.selectedSuggestionIndex = -1),
                                    (this.loadingState = ut),
                                    void 0 !== this._suggestTimeoutId &&
                                      clearTimeout(this._suggestTimeoutId),
                                    null === (n = this._cancelSource) ||
                                      void 0 === n ||
                                      n.abort(),
                                    (this._suggestTimeoutId =
                                      this._cancelSource =
                                        void 0),
                                    this.query.length < this.minInputLength
                                      ? this.setSuggestions([])
                                      : this.query in this.cachedSuggestions
                                      ? this.setSuggestions(
                                          this.cachedSuggestions[this.query]
                                        )
                                      : null !== this.suggestTimeout
                                      ? (this._suggestTimeoutId = setTimeout(
                                          this._loadSuggestions,
                                          this.suggestTimeout
                                        ))
                                      : this._loadSuggestions();
                                case 9:
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
                  key: "setSuggestions",
                  value: function (e) {
                    (this.suggestions = e),
                      (this.selectedSuggestionIndex = -1),
                      (this.loadingState = dt);
                  },
                },
                {
                  key: "selectPreviousSuggestion",
                  value: function () {
                    this.suggestions.length > 0 &&
                      (this.openMenu(),
                      this.selectedSuggestionIndex < 0
                        ? (this.selectedSuggestionIndex =
                            this.suggestions.length - 1)
                        : (this.selectedSuggestionIndex -= 1));
                  },
                },
                {
                  key: "selectNextSuggestion",
                  value: function () {
                    this.suggestions.length > 0 &&
                      (this.openMenu(),
                      this.selectedSuggestionIndex >=
                      this.suggestions.length - 1
                        ? (this.selectedSuggestionIndex = -1)
                        : (this.selectedSuggestionIndex += 1));
                  },
                },
                {
                  key: "selectSuggestion",
                  value: function (e, t) {
                    (this.selectedSuggestionIndex = e),
                      null === t || void 0 === t || t(this.selectedSuggestion),
                      (this.selectedSuggestionIndex = -1),
                      (this.isMenuOpen = !1);
                  },
                },
              ]),
              e
            );
          })()),
          (Ge = (0, p.Z)(qe.prototype, "inputValue", [b.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return "";
            },
          })),
          (Xe = (0, p.Z)(qe.prototype, "isMenuOpen", [b.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return !1;
            },
          })),
          (Ye = (0, p.Z)(
            qe.prototype,
            "isPopularQueriesExperimentEnabled",
            [b.LO],
            {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: null,
            }
          )),
          (Ke = (0, p.Z)(qe.prototype, "loadingState", [b.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return lt;
            },
          })),
          (Je = (0, p.Z)(qe.prototype, "searchFormExperimentFeatures", [b.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          ($e = (0, p.Z)(qe.prototype, "selectedSuggestionIndex", [b.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return -1;
            },
          })),
          (et = (0, p.Z)(qe.prototype, "suggestionsCount", [b.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return 0;
            },
          })),
          (tt = (0, p.Z)(qe.prototype, "suggestions", [Ve], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              return [];
            },
          })),
          (0, p.Z)(
            qe.prototype,
            "selectedSuggestion",
            [b.Fl],
            Object.getOwnPropertyDescriptor(qe.prototype, "selectedSuggestion"),
            qe.prototype
          ),
          (0, p.Z)(
            qe.prototype,
            "query",
            [b.Fl],
            Object.getOwnPropertyDescriptor(qe.prototype, "query"),
            qe.prototype
          ),
          (0, p.Z)(
            qe.prototype,
            "shouldLoadPopularQueries",
            [b.Fl],
            Object.getOwnPropertyDescriptor(
              qe.prototype,
              "shouldLoadPopularQueries"
            ),
            qe.prototype
          ),
          (0, p.Z)(
            qe.prototype,
            "searchPhrase",
            [b.Fl],
            Object.getOwnPropertyDescriptor(qe.prototype, "searchPhrase"),
            qe.prototype
          ),
          (0, p.Z)(
            qe.prototype,
            "_processResults",
            [b.aD],
            Object.getOwnPropertyDescriptor(qe.prototype, "_processResults"),
            qe.prototype
          ),
          (0, p.Z)(
            qe.prototype,
            "setSearchFormExperimentFeatures",
            [b.aD],
            Object.getOwnPropertyDescriptor(
              qe.prototype,
              "setSearchFormExperimentFeatures"
            ),
            qe.prototype
          ),
          (0, p.Z)(
            qe.prototype,
            "setInputValue",
            [b.aD],
            Object.getOwnPropertyDescriptor(qe.prototype, "setInputValue"),
            qe.prototype
          ),
          (0, p.Z)(
            qe.prototype,
            "suggest",
            [b.aD],
            Object.getOwnPropertyDescriptor(qe.prototype, "suggest"),
            qe.prototype
          ),
          (0, p.Z)(
            qe.prototype,
            "setSuggestions",
            [b.aD],
            Object.getOwnPropertyDescriptor(qe.prototype, "setSuggestions"),
            qe.prototype
          ),
          (nt = (0, p.Z)(qe.prototype, "openMenu", [b.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                e.isMenuOpen = !0;
              };
            },
          })),
          (rt = (0, p.Z)(qe.prototype, "closeMenu", [b.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                (e.isMenuOpen = !1), (e.selectedSuggestionIndex = -1);
              };
            },
          })),
          (0, p.Z)(
            qe.prototype,
            "selectPreviousSuggestion",
            [b.aD],
            Object.getOwnPropertyDescriptor(
              qe.prototype,
              "selectPreviousSuggestion"
            ),
            qe.prototype
          ),
          (0, p.Z)(
            qe.prototype,
            "selectNextSuggestion",
            [b.aD],
            Object.getOwnPropertyDescriptor(
              qe.prototype,
              "selectNextSuggestion"
            ),
            qe.prototype
          ),
          (0, p.Z)(
            qe.prototype,
            "selectSuggestion",
            [b.aD],
            Object.getOwnPropertyDescriptor(qe.prototype, "selectSuggestion"),
            qe.prototype
          ),
          (it = (0, p.Z)(qe.prototype, "clearInputValue", [b.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                (e.inputValue = ""), e.setSuggestions([]), (e.isMenuOpen = !1);
              };
            },
          })),
          qe);
    },
    14457: function (e, t, n) {
      "use strict";
      n.d(t, {
        os: function () {
          return o;
        },
      });
      var r = n(88309);
      function i() {
        return r.N.global.UD.experiment;
      }
      function o(e, t, n) {
        var r = i();
        if (void 0 === r || void 0 === r[e]) return n;
        var o = (function (e) {
          var t = i()[e],
            n = function (e, n) {
              return Object.assign(e, t[n].values);
            };
          return Object.keys(t).reduce(n, {});
        })(e);
        return t in o ? o[t] : n;
      }
    },
    54992: function (e, t, n) {
      "use strict";
      n.d(t, {
        X: function () {
          return s;
        },
      });
      var r = /[&<>"']/g,
        i = RegExp(r.source),
        o = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };
      function a(e) {
        return o[e];
      }
      function s(e) {
        return e && i.test(e) ? e.replace(r, a) : e;
      }
    },
    45160: function (e, t, n) {
      "use strict";
      n.d(t, {
        xG: function () {
          return s;
        },
      });
      var r = n(33446),
        i = n.n(r),
        o = n(43283),
        a = "en_US";
      function s(e) {
        var t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = (0, o.c)();
        return (
          (t = Object.assign(
            {
              currency: "usd",
              symbol: "$",
              locale: a,
              decimal: ".",
              group: ",",
              pattern: "!#,##0.00",
              scale: 2,
            },
            n.price_country.currency_formatter,
            t
          )).locale in i().locales || (t.locale = t.locale.substring(0, 2)),
          t.locale in i().locales || (t.locale = "en_US"),
          (t.pattern = t.pattern.replace(
            ".00",
            ".".concat(new Array(t.scale + 1).join("0"))
          )),
          (e = +(+e).toFixed(t.scale)),
          i().format(e, t)
        );
      }
    },
    7754: function (e, t, n) {
      "use strict";
      n.d(t, {
        MO: function () {
          return ke;
        },
        NG: function () {
          return Ce;
        },
        YB: function () {
          return ve;
        },
      });
      var r,
        i,
        o,
        a,
        s = n(4730),
        c = n(454),
        l = n(67847),
        u = n.n(l),
        d = n(22188),
        p = n(80955),
        m = n(67294),
        f = n(23554),
        g = n(71361),
        h = n(79594),
        v = n(11577),
        b = n.n(v),
        y = n(23290),
        _ = n(45566),
        E = n(97331),
        w = n(36186),
        O = n(14457),
        S = [
          {
            name: "instructor_bar",
            noticeFeatureFlag: "instructor_bar",
            classes: function (e) {
              return u()(
                "smart-bar",
                e.get("theme") && "smart-bar--".concat(e.get("theme"))
              );
            },
            defaultDaysToHide: 14,
            showOptIn: !1,
          },
          {
            name: "smart_bar",
            noticeFeatureFlag: "smart_bar",
            classes: function (e) {
              var t = (0, O.os)("sw", "smartBarTheme", e.get("theme"));
              return u()("smart-bar", t && "smart-bar--".concat(t));
            },
            defaultDaysToHide: 14,
            showOptIn: !0,
          },
          {
            name: "ufb_smart_bar",
            noticeFeatureFlag: "ufb_smart_bar",
            classes: function (e) {
              var t = (0, O.os)("sw", "smartBarTheme", e.get("theme"));
              return u()("smart-bar", t && "smart-bar--".concat(t));
            },
            defaultDaysToHide: 14,
            showOptIn: !1,
          },
        ],
        k = function (e) {
          var t = (0, O.os)("sw", "smartBarTheme", e.get("theme"));
          return "black" === t || "yellow_purple" === t
            ? "brand"
            : "teal" === t
            ? "white-solid"
            : "primary";
        },
        C = n(92777),
        x = n(82262),
        N = n(10748),
        P = n(45959),
        I = n(63553),
        T = n(37247),
        Z = n(43269),
        R = n(53229),
        A = n(13527),
        L = n(97351),
        j = n(90304),
        D = n.n(j);
      function M(e) {
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
          var n,
            r = (0, T.Z)(e);
          if (t) {
            var i = (0, T.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, I.Z)(this, n);
        };
      }
      var z = function (e) {
        var t = e.smartBarStore,
          n = m.createElement(
            "span",
            {
              onClick: function (e) {
                var n;
                if (
                  "A" ===
                  (null === (n = e.target) || void 0 === n ? void 0 : n.tagName)
                ) {
                  var r = e.target.href;
                  t.sendClickEvent(r, "copy_url");
                }
              },
              role: "presentation",
              "data-testid": "smart-bar-copy",
            },
            m.createElement(
              "span",
              Object.assign(
                {
                  className: u()(
                    "ud-text-bold ud-text-with-links",
                    D()["smart-bar__title"]
                  ),
                },
                (0, L.S)({
                  descriptionOfCaller: "basic:smart-bar-title",
                  html: t.data.get("title"),
                  dataPurpose: "smart-bar-title",
                  domPurifyConfig: { ADD_ATTR: ["target"] },
                })
              )
            ),
            m.createElement(
              "span",
              Object.assign(
                { className: "ud-text-with-links", role: "presentation" },
                (0, L.S)({
                  descriptionOfCaller: "basic:smart-bar-subtitle",
                  html: t.data.get("subtitle"),
                  dataPurpose: "smart-bar-subtitle",
                  domPurifyConfig: { ADD_ATTR: ["target"] },
                })
              )
            )
          ),
          r = t.data.get("action_url");
        if (r) {
          return m.createElement(
            "a",
            {
              onClick: function () {
                t.sendClickEvent();
              },
              "data-testid": "smart-bar-action-url",
              href: r,
            },
            n
          );
        }
        return n;
      };
      z.displayName = "SmartBarHeadline";
      var U =
          (0, p.Pi)(
            ((a = (function (e) {
              (0, P.Z)(n, e);
              var t = M(n);
              function n(e) {
                var r;
                return (
                  (0, C.Z)(this, n),
                  ((r = t.call(this, e)).displayName = "SmartBarTimer"),
                  (r.tickHandler = null),
                  (0, Z.Z)((0, N.Z)(r), "remainingSeconds", o, (0, N.Z)(r)),
                  (r.COUNTDOWN_PERIOD_THRESHOLD = 86400),
                  (r.remainingSeconds =
                    (Date.parse(r.props.endTime) - Date.now()) / 1e3),
                  r
                );
              }
              return (
                (0, x.Z)(n, [
                  {
                    key: "componentDidMount",
                    value: function () {
                      var e = this;
                      0 < this.remainingSeconds &&
                        this.remainingSeconds <=
                          this.COUNTDOWN_PERIOD_THRESHOLD &&
                        (this.tickHandler = setInterval(function () {
                          e.decrementRemainingTime();
                        }, 1e3));
                    },
                  },
                  {
                    key: "componentWillUnmount",
                    value: function () {
                      null !== this.tickHandler &&
                        clearInterval(this.tickHandler);
                    },
                  },
                  {
                    key: "decrementRemainingTime",
                    value: function () {
                      this.remainingSeconds < 1 && this.tickHandler
                        ? clearInterval(this.tickHandler)
                        : (this.remainingSeconds -= 1);
                    },
                  },
                  {
                    key: "render",
                    value: function () {
                      var e,
                        t = Math.floor(this.remainingSeconds / 86400);
                      if (
                        0 < this.remainingSeconds &&
                        this.remainingSeconds <= this.COUNTDOWN_PERIOD_THRESHOLD
                      ) {
                        var n = this.props.shouldShowSeconds
                            ? A.n.PRECISION.SECONDS
                            : A.n.PRECISION.MINUTES,
                          r = m.createElement(A.n, {
                            "data-testid": "timer-countdown",
                            numSeconds: this.remainingSeconds,
                            precision: n,
                            presentationStyle: A.n.STYLE.HUMAN_COMPACT,
                          });
                        e = m.createElement(h.nj, {
                          html: this.props.gettext(
                            'Ends in <span class="time">time</span>.'
                          ),
                          interpolate: { time: r },
                        });
                      } else {
                        if (
                          !(
                            this.COUNTDOWN_PERIOD_THRESHOLD <
                              this.remainingSeconds &&
                            t <= this.props.daysToShowTimer
                          )
                        )
                          return null;
                        e = m.createElement(
                          "span",
                          { "data-testid": "timer-x-days-left" },
                          this.props.ninterpolate(
                            "%(remainingDays)s day left!",
                            "%(remainingDays)s days left!",
                            t,
                            { remainingDays: t }
                          )
                        );
                      }
                      return m.createElement(
                        "span",
                        {
                          className: u()(
                            "ud-heading-sm",
                            D()["smart-bar-timer"]
                          ),
                          "data-testid": "smart-bar-timer",
                        },
                        e
                      );
                    },
                  },
                ]),
                n
              );
            })(m.Component)),
            (a.defaultProps = { shouldShowSeconds: !0, daysToShowTimer: 3 }),
            (i = a),
            (o = (0, R.Z)(i.prototype, "remainingSeconds", [d.LO], {
              configurable: !0,
              enumerable: !0,
              writable: !0,
              initializer: null,
            })),
            (0, R.Z)(
              i.prototype,
              "decrementRemainingTime",
              [d.aD],
              Object.getOwnPropertyDescriptor(
                i.prototype,
                "decrementRemainingTime"
              ),
              i.prototype
            ),
            (r = i))
          ) || r,
        F = (0, h.GV)(U),
        B = function (e) {
          var t = e.className,
            n = e.smartBarStore,
            r = e.membership;
          return m.createElement(
            "div",
            { className: t },
            m.createElement(
              "div",
              {
                className: u()("ud-text-sm", D()["basic-bar-content"]),
                "data-testid": "basic-with-timer",
              },
              m.createElement(z, { smartBarStore: n }),
              n.data.get("enable_timer") &&
                r.get("end_time") &&
                m.createElement(
                  m.Fragment,
                  null,
                  " ",
                  m.createElement(F, {
                    endTime: r.get("end_time"),
                    shouldShowSeconds: n.data.get("enable_seconds_in_timer"),
                    daysToShowTimer: n.data.get("days_to_show_timer"),
                  })
                )
            )
          );
        };
      B.displayName = "BasicBarContent";
      var W = (0, p.Pi)(B),
        H = n(78270),
        Q = n(49218),
        V = n(24076);
      function q(e) {
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
          var n,
            r = (0, T.Z)(e);
          if (t) {
            var i = (0, T.Z)(this).constructor;
            n = Reflect.construct(r, arguments, i);
          } else n = r.apply(this, arguments);
          return (0, I.Z)(this, n);
        };
      }
      var G = (function (e) {
          (0, P.Z)(n, e);
          var t = q(n);
          function n(e) {
            var r;
            (0, C.Z)(this, n);
            var i = e.noticeId,
              o = void 0 === i ? 0 : i,
              a = e.noticeType,
              s = e.personalizedNoticeSetId,
              c = void 0 === s ? null : s,
              l = e.personalizedNoticeSetName,
              u = void 0 === l ? null : l,
              d = e.topMembershipTargetGroupId,
              p = void 0 === d ? null : d;
            return (
              ((r = t.call(this, "SmartbarImpressionEvent")).noticeId = void 0),
              (r.noticeType = void 0),
              (r.personalizedNoticeSetId = void 0),
              (r.personalizedNoticeSetName = void 0),
              (r.topMembershipTargetGroupId = void 0),
              (r.noticeId = o),
              (r.noticeType = a),
              (r.personalizedNoticeSetId = c),
              (r.personalizedNoticeSetName = u),
              (r.topMembershipTargetGroupId = p),
              r
            );
          }
          return (0, x.Z)(n);
        })(V.rp),
        X = (function (e) {
          (0, P.Z)(n, e);
          var t = q(n);
          function n(e) {
            var r;
            (0, C.Z)(this, n);
            var i = e.noticeId,
              o = void 0 === i ? 0 : i,
              a = e.noticeType,
              s = e.url,
              c = e.location,
              l = void 0 === c ? "action_url" : c,
              u = e.personalizedNoticeSetId,
              d = void 0 === u ? null : u,
              p = e.personalizedNoticeSetName,
              m = void 0 === p ? null : p,
              f = e.topMembershipTargetGroupId,
              g = void 0 === f ? null : f;
            return (
              ((r = t.call(this, "SmartbarClickEvent")).noticeId = void 0),
              (r.noticeType = void 0),
              (r.personalizedNoticeSetId = void 0),
              (r.personalizedNoticeSetName = void 0),
              (r.topMembershipTargetGroupId = void 0),
              (r.url = void 0),
              (r.location = void 0),
              (r.noticeId = o),
              (r.noticeType = a),
              (r.personalizedNoticeSetId = d),
              (r.personalizedNoticeSetName = m),
              (r.topMembershipTargetGroupId = g),
              (r.url = s),
              (r.location = l),
              r
            );
          }
          return (0, x.Z)(n);
        })(V.rp),
        Y = (function (e) {
          (0, P.Z)(n, e);
          var t = q(n);
          function n(e) {
            var r;
            (0, C.Z)(this, n);
            var i = e.noticeId,
              o = void 0 === i ? 0 : i,
              a = e.noticeType,
              s = e.personalizedNoticeSetId,
              c = void 0 === s ? null : s,
              l = e.personalizedNoticeSetName,
              u = void 0 === l ? null : l,
              d = e.topMembershipTargetGroupId,
              p = void 0 === d ? null : d;
            return (
              ((r = t.call(this, "SmartbarHideEvent")).noticeId = void 0),
              (r.noticeType = void 0),
              (r.personalizedNoticeSetId = void 0),
              (r.personalizedNoticeSetName = void 0),
              (r.topMembershipTargetGroupId = void 0),
              (r.noticeId = o),
              (r.noticeType = a),
              (r.personalizedNoticeSetId = c),
              (r.personalizedNoticeSetName = u),
              (r.topMembershipTargetGroupId = p),
              r
            );
          }
          return (0, x.Z)(n);
        })(V.rp),
        K = (function (e) {
          (0, P.Z)(n, e);
          var t = q(n);
          function n() {
            var e;
            (0, C.Z)(this, n);
            var r =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : 0;
            return (
              ((e = t.call(this, "DealOptInEvent")).noticeId = void 0),
              (e.noticeId = r),
              e
            );
          }
          return (0, x.Z)(n);
        })(V.rp),
        J = n(59499),
        $ = n(17674),
        ee = n(48809);
      function te(e, t) {
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
      function ne(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? te(Object(n), !0).forEach(function (t) {
                (0, J.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : te(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var re = "reload",
        ie = "personalized_notice_set_name",
        oe = [
          "220401_MXLFC_Intent_Cart-Abandon_V1",
          "220401_MXLFC_Intent_Wishlist_V1",
        ];
      function ae() {
        var e = new Date(Date.now() + 6e5);
        return (0, Q.H)("notices", "api", e);
      }
      function se(e) {
        var t,
          n = e.type,
          r = e.limit,
          i = e.isPersonalPlanSubscriber,
          o = e.isUdemyBusinessSubscriber,
          a = e.params,
          s = void 0 === a ? {} : a,
          c = e.udConfig,
          l = void 0 === c ? {} : c,
          u = e.udRequest,
          d = void 0 === u ? {} : u,
          p = e.udMe,
          m = void 0 === p ? {} : p,
          f =
            null === (t = l.price_country) || void 0 === t
              ? void 0
              : t.currency,
          g = d.locale,
          h = ["assigned_notice_set_name", "validate_assigned_notice_set"],
          v = Object.fromEntries(
            Object.entries(s).filter(function (e) {
              var t = (0, $.Z)(e, 1)[0];
              return h.includes(t);
            })
          ),
          b = ae(),
          y = b.get(ie),
          _ = void 0 === y || oe.includes(y),
          E = (function (e, t) {
            return e
              ? "pp_request_targeting"
              : t
              ? "ub_request_targeting"
              : "cmp_marketplace";
          })(i, o);
        return ee.uh
          .get("notices/me/", {
            headers: { "cache-control": _ && b.get(re) ? "no-cache" : "" },
            params: ne(
              {
                type: n,
                limit: r,
                locale: g,
                currency: f,
                user: m.is_authenticated,
                use_case_group: E,
                search_cache_key: "search" === l.app_name ? 1 : null,
              },
              v
            ),
          })
          .then(function (e) {
            if (204 === e.status) return [];
            var t;
            e.data.results &&
              e.data.results.length > 0 &&
              (b.set(
                ie,
                null === (t = e.data.results[0].data) || void 0 === t
                  ? void 0
                  : t.personalized_notice_set_name
              ),
              _ && b.delete(re));
            return e.data.results || [];
          })
          .catch(function () {
            return [];
          });
      }
      function ce(e) {
        return ee.uh.post("targeting/opt-in/", { notice_id: e, opt_in: !0 });
      }
      function le() {
        var e = ae();
        e.delete(ie), e.set(re, !0);
      }
      function ue(e) {
        return ee.uh.post("notices/me/hide/", { notice_id: e });
      }
      var de,
        pe,
        me,
        fe,
        ge,
        he,
        ve = {
          forceReload: le,
          getNoticesApiLocalStorage: ae,
          getNoticesOfType: se,
          postTargetingOptIn: ce,
          storeHidden: ue,
        },
        be = "not_applied",
        ye = "applying",
        _e = "applied";
      var Ee =
          ((de = (function () {
            function e() {
              var t = this;
              (0, C.Z)(this, e),
                (0, Z.Z)(this, "state", pe, this),
                (this.params = {}),
                (this.isPersonalPlanSubscriber = void 0),
                (this.isUdemyBusinessSubscriber = void 0),
                (this.userAgnosticTrackingParams = void 0),
                (0, Z.Z)(this, "sendClickEvent", me, this),
                (this.sendHideEvent = function () {
                  var e;
                  H.j.publishEvent(
                    new Y({
                      noticeId: t.state.data.get("id"),
                      noticeType: "".concat(
                        null === (e = t.state.noticeType) || void 0 === e
                          ? void 0
                          : e.name
                      ),
                      personalizedNoticeSetId: t.state.data.get(
                        "personalized_notice_set_id"
                      ),
                      personalizedNoticeSetName: t.state.data.get(
                        "personalized_notice_set_name"
                      ),
                      topMembershipTargetGroupId:
                        t.state.data.get("target_group_id"),
                    })
                  );
                }),
                (this.sendDealOptInEvent = function () {
                  H.j.publishEvent(new K(t.state.data.get("id")));
                }),
                (0, Z.Z)(this, "optIn", fe, this),
                (0, Z.Z)(this, "optedIn", ge, this),
                (0, Z.Z)(this, "optedOut", he, this),
                (this.optInNotApplied = function () {
                  return t.state.opt_in_stage === be;
                }),
                (this.optInApplying = function () {
                  return t.state.opt_in_stage === ye;
                }),
                (this.optInJustApplied = function () {
                  return t.state.opt_in_stage === _e;
                }),
                this.reset();
            }
            return (
              (0, x.Z)(e, [
                {
                  key: "reset",
                  value: function () {
                    (this.state = (0, d.LO)({
                      activeStorageKey: "storage",
                      data: d.LO.map(),
                      membership: d.LO.map(),
                      seen: !1,
                      clicked: !1,
                      opt_in_stage: be,
                      storage: null,
                      storageForStickyExpiration: null,
                      noticeType: null,
                      loaded: !1,
                      isInStickyPosition: !1,
                      isStickyPositionHidden: !1,
                      mobileLayout: !1,
                    })),
                      (this.params = {}),
                      (this.isPersonalPlanSubscriber = void 0),
                      (this.isPersonalPlanSubscriber = void 0),
                      (this.userAgnosticTrackingParams = void 0);
                  },
                },
                {
                  key: "data",
                  get: function () {
                    var e;
                    return null === (e = this.state) || void 0 === e
                      ? void 0
                      : e.data;
                  },
                },
                {
                  key: "membership",
                  get: function () {
                    var e;
                    return null === (e = this.state) || void 0 === e
                      ? void 0
                      : e.membership;
                  },
                },
                {
                  key: "hide",
                  value: function () {
                    var e, t;
                    if (
                      this.state.membership.get("opt_in") ||
                      this.state.isStickyPositionHidden ||
                      !this.state.isInStickyPosition
                    )
                      (this.state.activeStorageKey = "storage"),
                        this.isPersonalPlanSubscriber && this.storeHidden();
                    else {
                      var n = new Date(),
                        r = new Date(
                          n.setMinutes(
                            n.getMinutes() +
                              parseInt(
                                this.state.data.get(
                                  "clp_sticky_reset_timer_in_minutes"
                                ),
                                10
                              )
                          )
                        );
                      (this.state.storageForStickyExpiration = (0, Q.H)(
                        "smartBarStorage",
                        "".concat(this.state.data.get("id"), ".sticky"),
                        r
                      )),
                        (this.state.activeStorageKey =
                          "storageForStickyExpiration");
                    }
                    (null !== (e = this.state[this.state.activeStorageKey]) &&
                      void 0 !== e &&
                      e.get("hidden")) ||
                      this.sendHideEvent(),
                      this.state.isInStickyPosition &&
                        (this.state.isStickyPositionHidden = !0),
                      null === (t = this.state[this.state.activeStorageKey]) ||
                        void 0 === t ||
                        t.set("hidden", !0);
                  },
                },
                {
                  key: "isHidden",
                  get: function () {
                    var e;
                    return (
                      !this.state.loaded ||
                      (null === (e = this.state[this.state.activeStorageKey]) ||
                      void 0 === e
                        ? void 0
                        : e.get("hidden"))
                    );
                  },
                },
                {
                  key: "isLoaded",
                  get: function () {
                    return this.state.loaded;
                  },
                },
                {
                  key: "noticeType",
                  get: function () {
                    return this.state.noticeType;
                  },
                },
                {
                  key: "pageKey",
                  get: function () {
                    var e;
                    return null === (e = this.userAgnosticTrackingParams) ||
                      void 0 === e
                      ? void 0
                      : e.page_key;
                  },
                },
                {
                  key: "isSticky",
                  get: function () {
                    return (
                      this.state.data.get("enable_clp_sticky") &&
                      "course_landing_page" === this.pageKey
                    );
                  },
                },
                {
                  key: "isInStickyPosition",
                  get: function () {
                    return (
                      this.isSticky &&
                      !this.isStickyPositionHidden &&
                      this.state.isInStickyPosition
                    );
                  },
                },
                {
                  key: "setIsInStickyPosition",
                  value: function (e) {
                    this.state.isInStickyPosition = e;
                  },
                },
                {
                  key: "isStickyPositionHidden",
                  get: function () {
                    var e;
                    return (
                      !this.state.loaded ||
                      !this.isSticky ||
                      (null === (e = this.state[this.state.activeStorageKey]) ||
                      void 0 === e
                        ? void 0
                        : e.get("hidden")) ||
                      this.state.membership.get("opt_in")
                    );
                  },
                },
                {
                  key: "hideButtonHidden",
                  get: function () {
                    return (
                      !this.membership.get("opt_in") && !this.isInStickyPosition
                    );
                  },
                },
                {
                  key: "shouldRenderHideButton",
                  get: function () {
                    return (
                      this.state.membership.get("opt_in") ||
                      (this.isSticky && !this.state.membership.get("opt_in")) ||
                      !this.isStickyPositionHidden
                    );
                  },
                },
                {
                  key: "storeHidden",
                  value: function () {
                    ue(this.state.data.get("id"));
                  },
                },
                {
                  key: "initialize",
                  value: function (e) {
                    var t = this,
                      n = e.currentType,
                      r = e.isPersonalPlanSubscriber,
                      i = void 0 !== r && r,
                      o = e.isUdemyBusinessSubscriber,
                      a = void 0 !== o && o,
                      s = e.params,
                      c = void 0 === s ? {} : s,
                      l = e.udConfig,
                      u = e.udMe,
                      p = e.udRequest,
                      m = e.userAgnosticTrackingParams;
                    (0, d.z)(function () {
                      (t.state.noticeType = n),
                        (t.isPersonalPlanSubscriber = i),
                        (t.isUdemyBusinessSubscriber = a),
                        (t.params = c),
                        (t.userAgnosticTrackingParams = m),
                        se({
                          type: n.name,
                          limit: 1,
                          isPersonalPlanSubscriber: t.isPersonalPlanSubscriber,
                          isUdemyBusinessSubscriber:
                            t.isUdemyBusinessSubscriber,
                          params: t.params,
                          udConfig: l,
                          udRequest: p,
                          udMe: u,
                        }).then(
                          (0, d.aD)(function (e) {
                            if (e.length) {
                              var r,
                                i = e[0];
                              t.state.membership.merge(i.membership);
                              var o = new Date(),
                                a = t.state.membership.get("end_time");
                              (r = a
                                ? new Date(a)
                                : new Date(
                                    o.setDate(o.getDate() + n.defaultDaysToHide)
                                  )),
                                t.state.data.merge(i.data),
                                t.state.data.merge({
                                  actionUrl: i.data.action_url,
                                }),
                                (t.state.storage = (0, Q.H)(
                                  "smartBarStorage",
                                  "".concat(i.data.id),
                                  r
                                )),
                                (r = new Date(
                                  o.setMinutes(
                                    o.getMinutes() +
                                      parseInt(
                                        i.data
                                          .clp_sticky_reset_timer_in_minutes,
                                        10
                                      )
                                  )
                                )),
                                (t.state.storageForStickyExpiration = (0, Q.H)(
                                  "smartBarStorage",
                                  "".concat(i.data.id, ".sticky"),
                                  null
                                )),
                                (t.state.loaded = !0);
                            }
                          })
                        );
                    });
                  },
                },
                {
                  key: "sendImpressionsEvent",
                  value: function () {
                    var e;
                    H.j.publishEvent(
                      new G({
                        noticeId: this.state.data.get("id"),
                        noticeType: "".concat(
                          null === (e = this.state.noticeType) || void 0 === e
                            ? void 0
                            : e.name
                        ),
                        personalizedNoticeSetId: this.state.data.get(
                          "personalized_notice_set_id"
                        ),
                        personalizedNoticeSetName: this.state.data.get(
                          "personalized_notice_set_name"
                        ),
                        topMembershipTargetGroupId:
                          this.state.data.get("target_group_id"),
                      })
                    );
                  },
                },
              ]),
              e
            );
          })()),
          (pe = (0, R.Z)(de.prototype, "state", [d.LO], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: null,
          })),
          (0, R.Z)(
            de.prototype,
            "hide",
            [d.aD],
            Object.getOwnPropertyDescriptor(de.prototype, "hide"),
            de.prototype
          ),
          (0, R.Z)(
            de.prototype,
            "setIsInStickyPosition",
            [d.aD],
            Object.getOwnPropertyDescriptor(
              de.prototype,
              "setIsInStickyPosition"
            ),
            de.prototype
          ),
          (0, R.Z)(
            de.prototype,
            "initialize",
            [d.aD],
            Object.getOwnPropertyDescriptor(de.prototype, "initialize"),
            de.prototype
          ),
          (me = (0, R.Z)(de.prototype, "sendClickEvent", [d.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function (t) {
                var n,
                  r =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : "action_url";
                e.state.clicked ||
                  (H.j.publishEvent(
                    new X({
                      noticeId: e.state.data.get("id"),
                      noticeType: "".concat(
                        null === (n = e.state.noticeType) || void 0 === n
                          ? void 0
                          : n.name
                      ),
                      url:
                        null !== t && void 0 !== t
                          ? t
                          : e.state.data.get("action_url"),
                      location: r,
                      personalizedNoticeSetId: e.state.data.get(
                        "personalized_notice_set_id"
                      ),
                      personalizedNoticeSetName: e.state.data.get(
                        "personalized_notice_set_name"
                      ),
                      topMembershipTargetGroupId:
                        e.state.data.get("target_group_id"),
                    })
                  ),
                  (e.state.clicked = !0));
              };
            },
          })),
          (fe = (0, R.Z)(de.prototype, "optIn", [d.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                return (
                  (e.state.opt_in_stage = ye),
                  le(),
                  ce(e.state.data.get("id")).catch(function (t) {
                    throw (
                      ((0, d.z)(function () {
                        e.state.opt_in_stage = be;
                      }),
                      t)
                    );
                  })
                );
              };
            },
          })),
          (ge = (0, R.Z)(de.prototype, "optedIn", [d.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                e.state.opt_in_stage = _e;
              };
            },
          })),
          (he = (0, R.Z)(de.prototype, "optedOut", [d.aD], {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            initializer: function () {
              var e = this;
              return function () {
                e.state.opt_in_stage = be;
              };
            },
          })),
          de),
        we = null;
      var Oe = ["disableHideButtonWhenVisible", "store"],
        Se = function (e) {
          var t,
            n,
            r,
            i = (0, m.useState)(),
            o = i[0],
            a = i[1],
            s = (0, w.gL)(),
            l = s.me,
            p = s.Config,
            v = s.request,
            O = s.userAgnosticTrackingParams,
            C = s.isGlobalMeContextLoading,
            x = (0, h.QT)(),
            N = x.gettext,
            P = x.interpolate,
            I = (0, g.ag)("sm-max"),
            T =
              null !== (t = e.disableHideButtonWhenVisible) &&
              void 0 !== t &&
              t;
          (0, m.useEffect)(
            function () {
              if (!C && !o)
                if (e.store) a(e.store);
                else if (!o) {
                  var t,
                    n = (function (e) {
                      var t = e.forceNoticeType,
                        n = void 0 === t ? "" : t,
                        r = e.isPersonalPlanSubscriber,
                        i = e.isUdemyBusinessSubscriber,
                        o = e.params,
                        a = void 0 === o ? {} : o,
                        s = e.skipNoticeBackend,
                        c = void 0 !== s && s,
                        l = e.udConfig,
                        u = e.udMe,
                        p = e.udRequest,
                        m = e.userAgnosticTrackingParams,
                        f =
                          S.find(function (e) {
                            return e.name === n;
                          }) ||
                          S.find(function (e) {
                            return (function (e, t) {
                              var n;
                              return null === (n = t.features.notice) ||
                                void 0 === n
                                ? void 0
                                : n[e.noticeFeatureFlag];
                            })(e, l);
                          });
                      return f
                        ? (we || (we = new Ee()),
                          c ||
                            (0, d.z)(function () {
                              var e;
                              null === (e = we) ||
                                void 0 === e ||
                                e.initialize({
                                  currentType: f,
                                  isPersonalPlanSubscriber: r,
                                  isUdemyBusinessSubscriber: i,
                                  params: a,
                                  udConfig: l,
                                  udMe: u,
                                  udRequest: p,
                                  userAgnosticTrackingParams: m,
                                });
                            }),
                          we)
                        : null;
                    })({
                      params: Object.fromEntries(
                        new URLSearchParams(
                          null === (t = window.location) || void 0 === t
                            ? void 0
                            : t.search
                        ).entries()
                      ),
                      isPersonalPlanSubscriber: e.isPersonalPlanSubscriber,
                      isUdemyBusinessSubscriber: e.isUdemyBusinessSubscriber,
                      skipNoticeBackend: e.skipNoticeBackend,
                      udConfig: p,
                      udRequest: v,
                      udMe: l,
                      userAgnosticTrackingParams: O,
                    });
                  n && a(n);
                }
            },
            [
              C,
              p,
              e.isPersonalPlanSubscriber,
              e.isUdemyBusinessSubscriber,
              o,
              l,
              v,
              O,
              e.store,
              e.skipNoticeBackend,
            ]
          );
          var Z = (0, m.useCallback)(
              function () {
                (null !== o && void 0 !== o && o.optInJustApplied()) ||
                  null === o ||
                  void 0 === o ||
                  o
                    .optIn()
                    .then(function () {
                      (0, d.z)(function () {
                        null === o || void 0 === o || o.optedIn(),
                          null === o || void 0 === o || o.sendDealOptInEvent(),
                          window.location.reload();
                      });
                    })
                    .catch(o.optedOut);
              },
              [o]
            ),
            R = (0, m.useCallback)(
              function () {
                null === o ||
                  void 0 === o ||
                  o.sendClickEvent(
                    null === o || void 0 === o ? void 0 : o.data.get("cta_url"),
                    "cta"
                  );
              },
              [o]
            );
          if (
            !o ||
            o.isHidden ||
            v.termsBarType ||
            (o.isStickyPositionHidden && e.hideWhenStickyPositionHidden)
          )
            return null;
          var A = u()(
              e.forceNotSticky ||
                !(null === o || void 0 === o ? void 0 : o.isSticky) ||
                o.isStickyPositionHidden
                ? null
                : D()["smart-bar--sticky"],
              I ? D()["smart-bar--mobile"] : null,
              null === (n = o.noticeType) || void 0 === n
                ? void 0
                : n
                    .classes(o.data)
                    .split(" ")
                    .map(function (e) {
                      return D()[e];
                    })
                    .join(" ")
            ),
            L = u()(
              D()["smart-bar__close"],
              o.hideButtonHidden ? D()["smart-bar__close_hidden"] : null
            ),
            j = u()(
              D()["smart-bar__content_wrapper"],
              o.shouldRenderHideButton
                ? D()["smart-bar__content_wrapper--with-button"]
                : null,
              I ? D()["smart-bar__content_wrapper--mobile"] : null
            ),
            M = u()(
              D()["smart-bar__content"],
              I ? D()["smart-bar__content--mobile"] : null
            ),
            z = u()(
              D()["smart-bar__cta-button-wrapper"],
              I ? D()["smart-bar__cta-button-wrapper--mobile"] : null
            ),
            U = o.data.get("cta_text"),
            F = null === o || void 0 === o ? void 0 : o.data.get("cta_url"),
            B = o.data.get("cta_applied_text"),
            H = {};
          "new_tab" === o.data.get("cta_target") &&
            (H = { target: "_blank", rel: "noopener noreferrer" });
          var Q = P(N("%(ctaText)s"), { ctaText: U }, !0),
            V = P(N("%(ctaAppliedText)s"), { ctaAppliedText: B }, !0),
            q = m.createElement(W, {
              className: M,
              smartBarStore: o,
              membership: o.membership,
            }),
            G = m.createElement(
              "div",
              { className: z },
              m.createElement(
                _.zx,
                {
                  className: "smart-bar__cta-button",
                  "data-testid": "smart-bar-opt-in-cta",
                  udStyle: k(o.data),
                  size: "medium",
                  onClick: Z,
                },
                o.optInJustApplied()
                  ? V
                  : o.optInApplying()
                  ? m.createElement(E.a, { color: "inherit", overlay: !0 })
                  : Q
              )
            ),
            X = m.createElement(
              "div",
              { className: z },
              m.createElement(
                _.zx,
                Object.assign(
                  {
                    className: "smart-bar__cta-button",
                    "data-testid": "smart-bar-link-cta",
                    udStyle: k(o.data),
                    size: "medium",
                    componentClass: "a",
                    href: F,
                    onClick: R,
                  },
                  H
                ),
                Q
              )
            ),
            Y = null;
          null !== o &&
          void 0 !== o &&
          null !== (r = o.noticeType) &&
          void 0 !== r &&
          r.showOptIn &&
          !o.membership.get("opt_in")
            ? (Y = G)
            : F && (Y = X);
          var K,
            J = m.createElement(
              "div",
              null,
              o.shouldRenderHideButton &&
                m.createElement(
                  y.h,
                  {
                    udStyle: "ghost",
                    className: L,
                    size: "medium",
                    onClick: function () {
                      return o.hide();
                    },
                    "data-testid": "smart-bar-hide",
                  },
                  m.createElement(b(), { label: N("Close") })
                )
            );
          if (
            ((K = I
              ? m.createElement(
                  "div",
                  { className: A, "data-testid": "smart-bar" },
                  m.createElement("div", { className: j }, q, J),
                  Y
                )
              : m.createElement(
                  "div",
                  { className: A, "data-testid": "smart-bar" },
                  m.createElement("div", { className: j }, q, Y),
                  J
                )),
            T)
          ) {
            var $ = {
              onChange: function (e) {
                o.setIsInStickyPosition(!e.isIntersecting);
              },
            };
            K = m.createElement(c.ZP, $, K);
          }
          return e.muteEvents
            ? m.createElement(
                "div",
                { "data-testid": "smart-bar-container" },
                K
              )
            : m.createElement(
                f.H,
                {
                  trackFunc: function () {
                    o.sendImpressionsEvent();
                  },
                },
                m.createElement(
                  "div",
                  { "data-testid": "smart-bar-container" },
                  K
                )
              );
        };
      Se.displayName = "SmartBar";
      var ke = (0, p.Pi)(Se),
        Ce = function (e) {
          var t = e.disableHideButtonWhenVisible,
            n = void 0 !== t && t,
            r = e.store,
            i = void 0 === r ? null : r,
            o = (0, s.Z)(e, Oe);
          return m.createElement(
            "div",
            {
              className: u()("smart-bar-spacer", D()["smart-bar-spacer"]),
              "data-testid": "smart-bar-spacer",
            },
            m.createElement(
              ke,
              Object.assign(
                {
                  forceNotSticky: !0,
                  skipNoticeBackend: !0,
                  muteEvents: !0,
                  hideWhenStickyPositionHidden: !0,
                  disableHideButtonWhenVisible: n,
                  store: i,
                },
                o
              )
            )
          );
        };
      Ce.displayName = "SmartBarSpacer";
    },
    76978: function (e, t, n) {
      "use strict";
      n.d(t, {
        Q1: function () {
          return r;
        },
        bN: function () {
          return i;
        },
        x8: function () {
          return o;
        },
      });
      var r = function (e) {
          return e / 10;
        },
        i = function (e) {
          return Math.round((e / 16) * 100) / 100;
        },
        o = function (e) {
          var t = "string" === typeof e ? Number(e.replace("em", "")) : e;
          return Math.round(((16 * t) / 100) * 100);
        };
    },
    17590: function (e, t, n) {
      "use strict";
      n.d(t, {
        yt: function () {
          return N;
        },
        aC: function () {
          return G;
        },
        Z0: function () {
          return L;
        },
        Zi: function () {
          return P;
        },
      });
      var r = n(59499),
        i = n(4730),
        o = n(94184),
        a = n.n(o),
        s = n(67294),
        c = n(79594),
        l = n(67025),
        u = n(97941),
        d = n(76978),
        p = n(97154),
        m = {
          "Amazon Web Services": { color: "color-orange-300", id: "aws" },
          "Google Cloud": { color: "color-indigo-300", id: "google" },
          "Microsoft Azure": { color: "color-indigo-300", id: "azure" },
          CompTIA: { color: "color-red-300", id: "comptia" },
          Security: { color: "color-green-400", id: "security" },
          Salesforce: { color: "color-red-300", id: "salesforce" },
          "Project Management": {
            color: "color-green-300",
            id: "project-management",
          },
          "Additional Resources": { color: "color-red-400", id: "other" },
          default: { color: "color-green-400", id: "default" },
        };
      function f(e) {
        var t = (function () {
          return (
            m[
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : "default"
            ] || m.default
          );
        })(e).color;
        return {
          borderLeft: "".concat((0, d.Q1)(8), "rem solid ").concat(p.T[t]),
        };
      }
      var g,
        h,
        v,
        b,
        y,
        _,
        E,
        w,
        O,
        S,
        k = n(13779),
        C = n.n(k),
        x = ["program"],
        N = function (e) {
          var t = e.program,
            n = (0, i.Z)(e, x),
            o = (0, c.QT)().gettext;
          return s.createElement(
            u.qg,
            n,
            s.createElement("div", { style: f(t.path) }),
            s.createElement(
              "div",
              { className: C()["program-info"] },
              s.createElement(
                u.qg.Title,
                {
                  className: "ud-heading-sm ".concat(
                    a()(
                      C()["program-title"],
                      (0, r.Z)(
                        {},
                        C()["program-title-condensed"],
                        0 === t.completionRatio
                      )
                    )
                  ),
                  "data-purpose": "program-title",
                  href: t.url,
                },
                t.title
              ),
              t.completionRatio > 0 &&
                s.createElement(l.Y, {
                  value: t.completionRatio,
                  min: 0,
                  max: 100,
                  label: o("%(percent)s% complete"),
                }),
              0 === t.completionRatio &&
                s.createElement(
                  "span",
                  { className: "ud-heading-sm ".concat(C()["start-learning"]) },
                  o("Start learning")
                )
            )
          );
        },
        P = "".concat("/content-collection", "/it-certifications"),
        I = "I",
        T = "L",
        Z = "S",
        R = "E",
        A = "Z",
        L = {
          ALL: "\nquery {\n    me {\n        lastAccessedEnrollment: programEnrollments(first: 1) {\n            edges {\n                node {\n                    id\n                    program {\n                        id\n                        title\n                        level\n                        icon\n                        paths {\n                            edges {\n                                node {\n                                    id\n                                    title\n                                    color\n                                    programs {\n                                        edges {\n                                            node {\n                                                id\n                                                title\n                                                icon\n                                                level\n                                                duration\n                                                questionAnswerCount\n                                            }\n                                        }\n                                    }\n                                    channels {\n                                        edges {\n                                            node {\n                                                id\n                                                title\n                                                paths {\n                                                    edges {\n                                                        node {\n                                                            id\n                                                            title\n                                                            color\n                                                        }\n                                                    }\n                                                }\n                                            }\n                                        }\n                                    }\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n        }\n        programEnrollments {\n            pageInfo {\n                startCursor\n                endCursor\n                hasNextPage\n                hasPreviousPage\n            }\n            edges {\n                cursor\n                node {\n                    id\n                    completionRatio\n                    lastAccessedTime\n                    user\n                    organization\n                    program {\n                        id\n                        title\n                        level\n                        icon\n                        courses {\n                            edges {\n                                cursor\n                                node {\n                                    id\n                                    title\n                                }\n                            }\n                        }\n                        paths {\n                            edges {\n                                node {\n                                    id\n                                    title\n                                    # color ?\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n}\n",
          PROGRAM_ENROLLMENTS:
            "\nquery {\n    me {\n        programEnrollments {\n            pageInfo {\n                startCursor\n                endCursor\n                hasNextPage\n                hasPreviousPage\n            }\n            edges {\n                cursor\n                node {\n                    id\n                    completionRatio\n                    lastAccessedTime\n                    user\n                    organization\n                    program {\n                        id\n                        title\n                        level\n                        icon\n                        courses {\n                            edges {\n                                cursor\n                                node {\n                                    id\n                                    title\n                                }\n                            }\n                        }\n                        paths {\n                            edges {\n                                node {\n                                    id\n                                    title\n                                    # color ?\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n}\n",
        },
        j = n(50029),
        D = n(92777),
        M = n(82262),
        z = n(87794),
        U = n.n(z),
        F = n(43269),
        B = n(53229),
        W = n(22188),
        H = n(30965),
        Q = n(61646);
      function V(e, t) {
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
      function q(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? V(Object(n), !0).forEach(function (t) {
                (0, r.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : V(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      var G =
        ((g = W.LO.ref),
        (h = W.LO.ref),
        (v = W.LO.shallow),
        (b = W.LO.shallow),
        (y = (function () {
          function e() {
            (0, D.Z)(this, e),
              (0, F.Z)(this, "state", _, this),
              (0, F.Z)(this, "programEnrollmentPageInfo", E, this),
              (0, F.Z)(this, "programChannels", w, this),
              (0, F.Z)(this, "programData", O, this),
              (0, F.Z)(this, "pathData", S, this);
          }
          return (
            (0, M.Z)(e, [
              {
                key: "setDataState",
                value: function (e) {
                  this.state = e;
                },
              },
              {
                key: "programCardData",
                get: function () {
                  return this.programData.map(function (e) {
                    return {
                      completionRatio: parseInt(e.completionRatio, 10),
                      icon: e.program.icon,
                      id: e.program.id,
                      isEnrolled: !0,
                      level: e.program.level,
                      path: e.path,
                      title: e.program.title,
                      url: "/program-taking/".concat(e.program.id, "/learn"),
                    };
                  });
                },
              },
              {
                key: "setProgramEnrollmentDataByResponse",
                value: function (e) {
                  var t, n, r, i, o, a, s, c, l, u, d, p;
                  (this.programEnrollmentPageInfo =
                    null === (t = e.data.me) ||
                    void 0 === t ||
                    null === (n = t.programEnrollments) ||
                    void 0 === n
                      ? void 0
                      : n.pageInfo),
                    (this.programData =
                      null === (r = e.data.me) ||
                      void 0 === r ||
                      null === (i = r.programEnrollments) ||
                      void 0 === i
                        ? void 0
                        : i.edges.map(function (e) {
                            var t = e.node,
                              n = t.program.paths.edges[0].node.title;
                            return q(q({}, t), {}, { path: n });
                          })),
                    (this.pathData =
                      null === (o = e.data.me) ||
                      void 0 === o ||
                      null === (a = o.lastAccessedEnrollment) ||
                      void 0 === a ||
                      null === (s = a.edges) ||
                      void 0 === s
                        ? void 0
                        : s.map(function (e) {
                            var t = e.node.program.paths.edges;
                            return {
                              title: t[0].node.title,
                              programs: t[0].node.programs.edges.map(function (
                                e
                              ) {
                                return q(
                                  q({}, e.node),
                                  {},
                                  {
                                    url: "/program-taking/".concat(
                                      e.node.id,
                                      "/learn"
                                    ),
                                  }
                                );
                              }),
                            };
                          }));
                  var m =
                    null === (c = e.data.me) ||
                    void 0 === c ||
                    null === (l = c.lastAccessedEnrollment) ||
                    void 0 === l ||
                    null === (u = l.edges[0]) ||
                    void 0 === u ||
                    null === (d = u.node.program.paths.edges[0]) ||
                    void 0 === d ||
                    null === (p = d.node.channels.edges[0]) ||
                    void 0 === p
                      ? void 0
                      : p.node;
                  (this.programChannels = m
                    ? {
                        title: m.title,
                        paths: m.paths.edges.map(function (e) {
                          return e.node;
                        }),
                      }
                    : null),
                    this.setDataState(this.programData.length ? Z : A);
                },
              },
              {
                key: "queryProgramEnrollments",
                value: (function () {
                  var e = (0, j.Z)(
                    U().mark(function e(t) {
                      var n;
                      return U().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (
                                  (e.prev = 0),
                                  (e.next = 3),
                                  (0, H.Zw)({ query: t })
                                );
                              case 3:
                                return (
                                  (n = e.sent),
                                  this.setProgramEnrollmentDataByResponse(n),
                                  e.abrupt("return", n)
                                );
                              case 8:
                                (e.prev = 8),
                                  (e.t0 = e.catch(0)),
                                  (0, Q.Tb)(e.t0),
                                  this.setDataState(R);
                              case 12:
                              case "end":
                                return e.stop();
                            }
                        },
                        e,
                        this,
                        [[0, 8]]
                      );
                    })
                  );
                  return function (t) {
                    return e.apply(this, arguments);
                  };
                })(),
              },
              {
                key: "fetchProgramEnrollments",
                value: (function () {
                  var e = (0, j.Z)(
                    U().mark(function e(t) {
                      return U().wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (
                                  this.setDataState(T),
                                  (e.next = 3),
                                  this.queryProgramEnrollments(t)
                                );
                              case 3:
                                return e.abrupt("return", e.sent);
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
                  return function (t) {
                    return e.apply(this, arguments);
                  };
                })(),
              },
            ]),
            e
          );
        })()),
        (_ = (0, B.Z)(y.prototype, "state", [W.LO], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            return I;
          },
        })),
        (E = (0, B.Z)(y.prototype, "programEnrollmentPageInfo", [g], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: null,
        })),
        (w = (0, B.Z)(y.prototype, "programChannels", [h], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: null,
        })),
        (O = (0, B.Z)(y.prototype, "programData", [v], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            return [];
          },
        })),
        (S = (0, B.Z)(y.prototype, "pathData", [b], {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          initializer: function () {
            return [];
          },
        })),
        (0, B.Z)(
          y.prototype,
          "setDataState",
          [W.aD],
          Object.getOwnPropertyDescriptor(y.prototype, "setDataState"),
          y.prototype
        ),
        (0, B.Z)(
          y.prototype,
          "programCardData",
          [W.Fl],
          Object.getOwnPropertyDescriptor(y.prototype, "programCardData"),
          y.prototype
        ),
        (0, B.Z)(
          y.prototype,
          "setProgramEnrollmentDataByResponse",
          [W.aD],
          Object.getOwnPropertyDescriptor(
            y.prototype,
            "setProgramEnrollmentDataByResponse"
          ),
          y.prototype
        ),
        y);
    },
    22935: function (e) {
      e.exports = {
        "card-container": "activity-notification_card-container__dj4eQ",
        card: "activity-notification_card__8NYBZ",
        "notification-info": "activity-notification_notification-info__QpZiY",
        "notification-title": "activity-notification_notification-title__oftyW",
        "notification-timestamp":
          "activity-notification_notification-timestamp__yuRQw",
        "status-dot-container":
          "activity-notification_status-dot-container__eLyJU",
        "status-dot-button": "activity-notification_status-dot-button__0K_24",
      };
    },
    28414: function (e) {
      e.exports = {
        container: "activity-notifications_container__pXQN7",
        "no-notifications": "activity-notifications_no-notifications__Dcz1C",
        "notification-list": "activity-notifications_notification-list__QPIev",
        "load-more-row": "activity-notifications_load-more-row__i4UEh",
        footer: "activity-notifications_footer__FdoKO",
      };
    },
    41564: function (e) {
      e.exports = {
        panel: "tracker-debugger_panel__tinuH",
        "debugger-panel": "tracker-debugger_debugger-panel__R7VJN",
        "tooltip-panel": "tracker-debugger_tooltip-panel__IDUZv",
        focused: "tracker-debugger_focused__cT7Oi",
        "item-text": "tracker-debugger_item-text__S_IWv",
        "left-debugger-panel": "tracker-debugger_left-debugger-panel__z_MJQ",
        "right-debugger-panel": "tracker-debugger_right-debugger-panel__ndRM5",
        "debugger-panel-header":
          "tracker-debugger_debugger-panel-header__cMRGk",
        "debugger-panel-body": "tracker-debugger_debugger-panel-body__kLUGN",
        "blocklist-item": "tracker-debugger_blocklist-item__3RK7v",
        "tooltip-panel-body": "tracker-debugger_tooltip-panel-body__DJrw_",
        positive: "tracker-debugger_positive__L4zqP",
        negative: "tracker-debugger_negative__lQgVZ",
        subdued: "tracker-debugger_subdued__r4GwK",
        control: "tracker-debugger_control__tCuNf",
      };
    },
    44722: function (e) {
      e.exports = {
        banner: "teach-on-udemy-banner_banner__hHb5r",
        subtitle: "teach-on-udemy-banner_subtitle__VDy_F",
        "button-container": "teach-on-udemy-banner_button-container__DoHpH",
      };
    },
    95265: function (e) {
      e.exports = {
        "notice-row": "ufb-notice_notice-row__dsM4P",
        notice: "ufb-notice_notice__kHbnv",
        "partner-logos": "ufb-notice_partner-logos__SEnVX",
      };
    },
    18715: function (e) {
      e.exports = {
        "available-lectures": "available-lectures_available-lectures__aXt2A",
        "available-lectures-indicators":
          "available-lectures_available-lectures-indicators__amwkc",
        "play-icon": "available-lectures_play-icon__A8u1L",
        "play-icon--used-lecture":
          "available-lectures_play-icon--used-lecture__Rxg6_",
      };
    },
    7311: function (e) {
      e.exports = {
        logo: "limited-consumption-trial_logo___8s34",
        "trial-footer": "limited-consumption-trial_trial-footer__0hYYq",
        "timer-container": "limited-consumption-trial_timer-container__aKneO",
        "timer-text": "limited-consumption-trial_timer-text__0N6lB",
      };
    },
    20526: function (e) {
      e.exports = {
        content: "locked-lecture-modal_content__8KvGr",
        "icon-container": "locked-lecture-modal_icon-container___FAmG",
        "play-icon": "locked-lecture-modal_play-icon__wZRKa",
        "number-badge": "locked-lecture-modal_number-badge__4pXQM",
        subtitle: "locked-lecture-modal_subtitle__PXCGR",
        title: "locked-lecture-modal_title__7jdSY",
      };
    },
    87123: function (e) {
      e.exports = {
        "feedback-title": "nudge-owner-modal_feedback-title__dBEJt",
        "radio-group": "nudge-owner-modal_radio-group__5PQXL",
        "message-input": "nudge-owner-modal_message-input__WUtKz",
      };
    },
    24793: function (e) {
      e.exports = {
        "tooltip-title": "tooltip-wrapper_tooltip-title__aRWqf",
        "tooltip-text": "tooltip-wrapper_tooltip-text__8Qwj_",
        "tooltip-cta": "tooltip-wrapper_tooltip-cta__8BBQh",
      };
    },
    85573: function (e) {
      e.exports = {
        "buy-button": "unlock-button_buy-button__CuFQW",
        "button-text-small": "unlock-button_button-text-small__gx9CM",
        "button-text-large": "unlock-button_button-text-large__ueuzO",
      };
    },
    62562: function (e) {
      e.exports = {
        "lab-icon": "lab-icon_lab-icon__ZAbnD",
        completed: "lab-icon_completed__l_XFW",
      };
    },
    19006: function (e) {
      e.exports = {
        "text-container": "labs-learning-banner_text-container__SvTjn",
        button: "labs-learning-banner_button__fW57p",
        container: "labs-learning-banner_container__svVKN",
        "action-buttons": "labs-learning-banner_action-buttons__qCyZc",
      };
    },
    17464: function (e) {
      e.exports = {
        root: "language-list_root__Q502d",
        button: "language-list_button__YTJEw",
      };
    },
    82614: function (e) {
      e.exports = { button: "language-selector-button_button__4lXYs" };
    },
    52885: function (e) {
      e.exports = {
        "icon-button": "modal-language-selector_icon-button__Rqn3f",
        modal: "modal-language-selector_modal__LIVIk",
      };
    },
    82634: function (e) {
      e.exports = {
        "pro-badge": "pro-badge_pro-badge__b53kK",
        neutral: "pro-badge_neutral__H0gVS",
        dark: "pro-badge_dark__WhX4K",
      };
    },
    81613: function (e) {
      e.exports = {
        "brand-title": "ufb-logo_brand-title__2j63q",
        logo: "ufb-logo_logo__DsQUc",
      };
    },
    12235: function (e) {
      e.exports = { "close-btn": "dialog-close-button_close-btn__k94xu" };
    },
    33935: function (e) {
      e.exports = {
        "dialog-container": "side-drawer_dialog-container__yDY3w",
        "drawer-container": "side-drawer_drawer-container__8EXA7",
        "side-left": "side-drawer_side-left___S_3k",
        "side-drawer": "side-drawer_side-drawer__MLXPy",
        "close-btn": "side-drawer_close-btn__gl_ew",
        "side-right": "side-drawer_side-right__2IVZ1",
        "main-drawer-checkbox": "side-drawer_main-drawer-checkbox__ooR5x",
        "drawer-content": "side-drawer_drawer-content__MgYmO",
        "drawer-radio": "side-drawer_drawer-radio__rIVLH",
      };
    },
    49161: function (e) {
      e.exports = {
        "ud-text-area-small": "text-area_ud-text-area-small__yZ74t",
        "ud-text-area-large": "text-area_ud-text-area-large__kJKtn",
      };
    },
    61668: function (e) {
      e.exports = {
        "nav-container": "browse-nav_nav-container__PouDM",
        nav: "browse-nav_nav__gDSVe",
        "placeholder-header-button":
          "browse-nav_placeholder-header-button__YqpIs",
      };
    },
    62018: function (e) {
      e.exports = {
        header: "desktop-header_header__f_kaY",
        "mobile-header": "desktop-header_mobile-header__usy_6",
        "mobile-header-placeholder":
          "desktop-header_mobile-header-placeholder__oL1D1",
        "flex-middle": "desktop-header_flex-middle__JjTaI",
        "search-bar": "desktop-header_search-bar__XKKoS",
        logo: "desktop-header_logo__wQjhP",
        "gap-button": "desktop-header_gap-button__Ml9y_",
        "gap-auth-button": "desktop-header_gap-auth-button__9FqQZ",
        "dropdown-button-text": "desktop-header_dropdown-button-text__oLDB9",
        "dropdown-button": "desktop-header_dropdown-button__UHrW7",
        btn: "desktop-header_btn__Yu6px",
        dropdown: "desktop-header_dropdown__YK_gf",
        menu: "desktop-header_menu__5eEmA",
        "dropdown-counter-badge":
          "desktop-header_dropdown-counter-badge__RTwTN",
        "dropdown-dot-badge": "desktop-header_dropdown-dot-badge__V1PGz",
        "group-a": "desktop-header_group-a__ADnRO",
        "group-b": "desktop-header_group-b__Q_NIM",
        "group-c": "desktop-header_group-c__0L_m9",
        mark: "desktop-header_mark__rKVrO",
        floating: "desktop-header_floating__YKR3_",
        "slide-from-top": "desktop-header_slide-from-top__zPF8s",
        visible: "desktop-header_visible__8nOZO",
        hidden: "desktop-header_hidden__YYnxC",
      };
    },
    47413: function (e) {
      e.exports = {
        header: "desktop-instructor-header_header__CT4_n",
        "mobile-header": "desktop-instructor-header_mobile-header__BPyWq",
      };
    },
    87941: function (e) {
      e.exports = {
        "item-content": "language-selector-menu-item_item-content__Mg1Uw",
        "current-language":
          "language-selector-menu-item_current-language__GadeI",
      };
    },
    66781: function (e) {
      e.exports = {
        "list-menu-container": "list-menu_list-menu-container__JqVwA",
        heading: "list-menu_heading__dEy11",
        section: "list-menu_section__loWTi",
        item: "list-menu_item__r7HKN",
        beta: "list-menu_beta__9axBw",
      };
    },
    26230: function (e) {
      e.exports = {
        "notification-info": "notification-item_notification-info__9h32l",
        "notification-title": "notification-item_notification-title__We4nX",
        "notification-timestamp":
          "notification-item_notification-timestamp__xfgE6",
        "unread-dot": "notification-item_unread-dot__78dIk",
      };
    },
    64368: function (e) {
      e.exports = {
        "notification-items": "notification-items_notification-items__WMANP",
        "footer-btns": "notification-items_footer-btns__uv2xc",
        "footer-btn-wrapper": "notification-items_footer-btn-wrapper__0LvlE",
        panel: "notification-items_panel__JTrLf",
      };
    },
    347: function (e) {
      e.exports = {
        panel: "panel-menu_panel__i6dT_",
        "no-items": "panel-menu_no-items__r40vN",
        item: "panel-menu_item__kz2EP",
        "section-heading": "panel-menu_section-heading__GdMiJ",
        "section-heading-title": "panel-menu_section-heading-title__6bA4Y",
        "section-heading-link": "panel-menu_section-heading-link__rhu6Z",
        footer: "panel-menu_footer__wTf2N",
        cta: "panel-menu_cta__KXJfL",
        "gap-bottom": "panel-menu_gap-bottom__xMNlb",
      };
    },
    95101: function (e) {
      e.exports = {
        "buyable-info": "shopping-item_buyable-info__79wGy",
        "buyable-title": "shopping-item_buyable-title__NPdBb",
        "buyable-instructors": "shopping-item_buyable-instructors__dI7az",
      };
    },
    65550: function (e) {
      e.exports = {
        scrollable: "shopping-items_scrollable__A8ixU",
        "item-wrapper": "shopping-items_item-wrapper__abxNA",
        "sticky-footer": "shopping-items_sticky-footer__PrBQ4",
        total: "shopping-items_total__5Uv15",
        credit: "shopping-items_credit__zt9Xr",
      };
    },
    69785: function (e) {
      e.exports = {
        "dropdown-button-avatar":
          "user-profile-dropdown_dropdown-button-avatar__3RvHP",
        "user-section": "user-profile-dropdown_user-section__XByED",
        "pro-user-section": "user-profile-dropdown_pro-user-section__4LOhO",
        email: "user-profile-dropdown_email__xs226",
        "user-details": "user-profile-dropdown_user-details__Dv488",
        "user-section-avatar":
          "user-profile-dropdown_user-section-avatar__e1AX4",
        "try-ufb-section": "user-profile-dropdown_try-ufb-section__bL_mf",
        "try-ufb-subtitle": "user-profile-dropdown_try-ufb-subtitle__44azW",
        "subscription-menu-item":
          "user-profile-dropdown_subscription-menu-item__aWISF",
        "badge-personal-plan":
          "user-profile-dropdown_badge-personal-plan__Rnewu",
      };
    },
    10409: function (e) {
      e.exports = {
        "desktop-only": "header_desktop-only__DXp_G",
        "mobile-only": "header_mobile-only__0ZpXg",
      };
    },
    10870: function (e) {
      e.exports = { "logo-placeholder": "logo_logo-placeholder__T44bb" };
    },
    28126: function (e) {
      e.exports = {
        header: "mobile-header_header__qwcw9",
        "with-shadow": "mobile-header_with-shadow__rXcIM",
        row: "mobile-header_row__xXKvo",
        middle: "mobile-header_middle__j4q2R",
        "button-spacer": "mobile-header_button-spacer__taCgC",
        "search-bar": "mobile-header_search-bar__J7xaT",
        "search-bar-form": "mobile-header_search-bar-form__AD_68",
        "search-bar-close": "mobile-header_search-bar-close__ctltW",
        "full-page-overlay": "mobile-header_full-page-overlay__LnVI2",
        "search-bar-layer": "mobile-header_search-bar-layer__1nVx_",
        "cart-badge": "mobile-header_cart-badge__NYhxL",
        mark: "mobile-header_mark__axa0W",
        floating: "mobile-header_floating__lDnrp",
        "slide-from-top": "mobile-header_slide-from-top__iRO8U",
      };
    },
    22715: function (e) {
      e.exports = { header: "mobile-instructor-header_header__LZg2Q" };
    },
    29790: function (e) {
      e.exports = {
        container: "language-selector-overlay_container__S_A4h",
        "fade-in": "language-selector-overlay_fade-in__3HBMu",
      };
    },
    68303: function (e) {
      e.exports = {
        "nav-item": "mobile-nav_nav-item__WIQ2u",
        nav: "mobile-nav_nav__P2jV_",
        bold: "mobile-nav_bold__yPP1L",
        highlighted: "mobile-nav_highlighted__T9Ix1",
        underlined: "mobile-nav_underlined__0QJ09",
        "nav-section": "mobile-nav_nav-section__NSCG1",
        "welcome-section": "mobile-nav_welcome-section__qoS_B",
        "welcome-section-content": "mobile-nav_welcome-section-content__q7xHA",
        "nav-section-heading": "mobile-nav_nav-section-heading__6nfKz",
        "profile-badge": "mobile-nav_profile-badge__JMOAY",
        "profile-name": "mobile-nav_profile-name__hwnCa",
        "profile-welcome": "mobile-nav_profile-welcome__LP5cU",
        beta: "mobile-nav_beta__kZDva",
        "inline-notification-badge":
          "mobile-nav_inline-notification-badge__rmKB1",
        "learning-types-section": "mobile-nav_learning-types-section__XSibK",
      };
    },
    32608: function (e) {
      e.exports = { header: "logged-out-header_header__LKU4L" };
    },
    55016: function (e) {
      e.exports = {
        panel: "package-alert_panel__Gok0O",
        "package-alert": "package-alert_package-alert__5T068",
      };
    },
    29845: function (e) {
      e.exports = {
        section: "pro-features-popover_section__INOjG",
        "pro-feature-popover":
          "pro-features-popover_pro-feature-popover__LgBkr",
      };
    },
    96407: function (e) {
      e.exports = {
        "ud-notification-badge":
          "notification-badge_ud-notification-badge__camd6",
        "ud-notification-counter":
          "notification-badge_ud-notification-counter__sHdXK",
        "ud-notification-dot": "notification-badge_ud-notification-dot__xWgR8",
      };
    },
    32623: function (e) {
      e.exports = { toaster: "toaster_toaster__v3LY8" };
    },
    55147: function (e) {
      e.exports = {
        "skip-to-content": "skip-to-content-button_skip-to-content__wHvxi",
        "skip-to-content-btn":
          "skip-to-content-button_skip-to-content-btn__Lvk_5",
        "skip-to-content-shadow":
          "skip-to-content-button_skip-to-content-shadow__SS8w8",
        "main-content-anchor":
          "skip-to-content-button_main-content-anchor__xTkXd",
      };
    },
    63427: function (e) {
      e.exports = {
        popover: "popover_popover__6Xax7",
        "popover-padding": "popover_popover-padding__LzV74",
        "popover-bottom": "popover_popover-bottom__Jg388",
        "popover-bottom-arrow": "popover_popover-bottom-arrow__Ij8ku",
        "popover-top": "popover_popover-top__F4U74",
        "popover-top-arrow": "popover_popover-top-arrow__RiXRj",
        "popover-left": "popover_popover-left__OJzV0",
        "popover-left-arrow": "popover_popover-left-arrow__8GXb_",
        "popover-right": "popover_popover-right__qW998",
        "popover-right-arrow": "popover_popover-right-arrow__OXc98",
        inner: "popover_inner__E_Z7t",
        arrow: "popover_arrow__8nSwm",
        "arrow-bottom": "popover_arrow-bottom__OQBku",
        "arrow-top": "popover_arrow-top___Nqc8",
        "arrow-left": "popover_arrow-left__vhX6A",
        "arrow-right": "popover_arrow-right__kKpma",
      };
    },
    27556: function (e) {
      e.exports = {
        tooltip: "tooltip_tooltip__9HxFL",
        white: "tooltip_white__IDRn9",
      };
    },
    37770: function (e) {
      e.exports = {
        container: "carousel_container__WqAI_",
        "container-full-viewport": "carousel_container-full-viewport__iiO2U",
        "scroll-port": "carousel_scroll-port__YiQyP",
        "scroll-lock": "carousel_scroll-lock__uuigO",
        "scroll-item": "carousel_scroll-item__yo6VS",
        grid: "carousel_grid__aYlps",
        "small-grid": "carousel_small-grid__9G6xv",
        "large-grid": "carousel_large-grid__b0AU2",
        "grid-full-width-items": "carousel_grid-full-width-items__ypAWN",
        button: "carousel_button__mtsms",
        "next-button": "carousel_next-button__6VcuP",
        "prev-button": "carousel_prev-button__k4iN5",
      };
    },
    30552: function (e) {
      e.exports = {
        "tabs-container": "tabs_tabs-container__cfdeU",
        inverted: "tabs_inverted___TX4J",
        "tabs-nav-buttons": "tabs_tabs-nav-buttons__kgHOo",
        "nav-button-container": "tabs_nav-button-container__OiANv",
        "full-width": "tabs_full-width__dTDUJ",
        "tab-content": "tabs_tab-content__fl5qD",
        active: "tabs_active__bB7P6",
        "pagination-buttons": "tabs_pagination-buttons__uyCrx",
        gradient: "tabs_gradient__8OynP",
        "nav-button": "tabs_nav-button__kW0p0",
        xlarge: "tabs_xlarge__jTeo1",
      };
    },
    90304: function (e) {
      e.exports = {
        "smart-bar": "smart-bar_smart-bar__v0_ZO",
        "basic-bar-content": "smart-bar_basic-bar-content__3ja9d",
        "smart-bar-timer": "smart-bar_smart-bar-timer__f4J8Z",
        "smart-bar--mobile": "smart-bar_smart-bar--mobile__hUim1",
        "smart-bar__close": "smart-bar_smart-bar__close__6Jld3",
        "smart-bar__close_hidden": "smart-bar_smart-bar__close_hidden__vSpdz",
        "smart-bar__close_wrapper": "smart-bar_smart-bar__close_wrapper__p_V2f",
        "smart-bar__content_wrapper":
          "smart-bar_smart-bar__content_wrapper__A5lm2",
        "smart-bar__content_wrapper--mobile":
          "smart-bar_smart-bar__content_wrapper--mobile__Pp3G7",
        "smart-bar__content--with-button":
          "smart-bar_smart-bar__content--with-button__FRTcA",
        "smart-bar__content--mobile":
          "smart-bar_smart-bar__content--mobile__7Iw7N",
        "smart-bar__content": "smart-bar_smart-bar__content__EKt3o",
        "smart-bar__cta-button": "smart-bar_smart-bar__cta-button__0r_qY",
        "smart-bar__cta-button-wrapper":
          "smart-bar_smart-bar__cta-button-wrapper__LBwzu",
        "smart-bar__cta-button-wrapper--mobile":
          "smart-bar_smart-bar__cta-button-wrapper--mobile__NJoOJ",
        "smart-bar__title": "smart-bar_smart-bar__title__8TqWf",
        "smart-bar--sticky": "smart-bar_smart-bar--sticky__DGnO_",
        "smart-bar-spacer": "smart-bar_smart-bar-spacer__b6irK",
        "smart-bar--yellow": "smart-bar_smart-bar--yellow__xW8kl",
        "smart-bar--yellow_purple": "smart-bar_smart-bar--yellow_purple__2Qi73",
        "smart-bar--orange": "smart-bar_smart-bar--orange__ZOFaD",
        "smart-bar--teal": "smart-bar_smart-bar--teal__6U35J",
        "smart-bar--purple": "smart-bar_smart-bar--purple__NzPrp",
        "smart-bar--black": "smart-bar_smart-bar--black__kxxmm",
      };
    },
    13779: function (e) {
      e.exports = {
        "program-info": "compact-program-progress-card_program-info__xljXz",
        "program-title": "compact-program-progress-card_program-title__uCI8Q",
        "program-title-condensed":
          "compact-program-progress-card_program-title-condensed__in_1s",
        "start-learning": "compact-program-progress-card_start-learning__SEyZa",
      };
    },
    77096: function () {},
    46747: function (e, t, n) {
      "use strict";
      var r = n(86755);
      n.o(r, "useQuery") &&
        n.d(t, {
          useQuery: function () {
            return r.useQuery;
          },
        });
    },
    86755: function () {},
    88767: function (e, t, n) {
      "use strict";
      n.d(t, {
        useQuery: function () {
          return i.useQuery;
        },
      });
      var r = n(46747);
      n.o(r, "useQuery") &&
        n.d(t, {
          useQuery: function () {
            return r.useQuery;
          },
        });
      var i = n(90335);
    },
    90335: function (e, t, n) {
      "use strict";
      n.d(t, {
        useQuery: function () {
          return R;
        },
      });
      var r = n(87462),
        i = "undefined" === typeof window;
      function o() {}
      function a(e) {
        return "number" === typeof e && e >= 0 && e !== 1 / 0;
      }
      function s(e, t) {
        if (e === t) return e;
        var n = Array.isArray(e) && Array.isArray(t);
        if (n || (c(e) && c(t))) {
          for (
            var r = n ? e.length : Object.keys(e).length,
              i = n ? t : Object.keys(t),
              o = i.length,
              a = n ? [] : {},
              l = 0,
              u = 0;
            u < o;
            u++
          ) {
            var d = n ? u : i[u];
            (a[d] = s(e[d], t[d])), a[d] === e[d] && l++;
          }
          return r === o && l === r ? e : a;
        }
        return t;
      }
      function c(e) {
        if (!l(e)) return !1;
        var t = e.constructor;
        if ("undefined" === typeof t) return !0;
        var n = t.prototype;
        return !!l(n) && !!n.hasOwnProperty("isPrototypeOf");
      }
      function l(e) {
        return "[object Object]" === Object.prototype.toString.call(e);
      }
      function u(e) {
        return "string" === typeof e || Array.isArray(e);
      }
      function d(e) {
        Promise.resolve()
          .then(e)
          .catch(function (e) {
            return setTimeout(function () {
              throw e;
            });
          });
      }
      var p = (function () {
          function e() {
            (this.queue = []),
              (this.transactions = 0),
              (this.notifyFn = function (e) {
                e();
              }),
              (this.batchNotifyFn = function (e) {
                e();
              });
          }
          var t = e.prototype;
          return (
            (t.batch = function (e) {
              var t;
              this.transactions++;
              try {
                t = e();
              } finally {
                this.transactions--, this.transactions || this.flush();
              }
              return t;
            }),
            (t.schedule = function (e) {
              var t = this;
              this.transactions
                ? this.queue.push(e)
                : d(function () {
                    t.notifyFn(e);
                  });
            }),
            (t.batchCalls = function (e) {
              var t = this;
              return function () {
                for (
                  var n = arguments.length, r = new Array(n), i = 0;
                  i < n;
                  i++
                )
                  r[i] = arguments[i];
                t.schedule(function () {
                  e.apply(void 0, r);
                });
              };
            }),
            (t.flush = function () {
              var e = this,
                t = this.queue;
              (this.queue = []),
                t.length &&
                  d(function () {
                    e.batchNotifyFn(function () {
                      t.forEach(function (t) {
                        e.notifyFn(t);
                      });
                    });
                  });
            }),
            (t.setNotifyFunction = function (e) {
              this.notifyFn = e;
            }),
            (t.setBatchNotifyFunction = function (e) {
              this.batchNotifyFn = e;
            }),
            e
          );
        })(),
        m = new p(),
        f = n(73935).unstable_batchedUpdates;
      m.setBatchNotifyFunction(f);
      var g = console;
      function h() {
        return g;
      }
      var v = console;
      g = v;
      var b = n(75068),
        y = (function () {
          function e() {
            this.listeners = [];
          }
          var t = e.prototype;
          return (
            (t.subscribe = function (e) {
              var t = this,
                n = e || function () {};
              return (
                this.listeners.push(n),
                this.onSubscribe(),
                function () {
                  (t.listeners = t.listeners.filter(function (e) {
                    return e !== n;
                  })),
                    t.onUnsubscribe();
                }
              );
            }),
            (t.hasListeners = function () {
              return this.listeners.length > 0;
            }),
            (t.onSubscribe = function () {}),
            (t.onUnsubscribe = function () {}),
            e
          );
        })(),
        _ = new ((function (e) {
          function t() {
            var t;
            return (
              ((t = e.call(this) || this).setup = function (e) {
                var t;
                if (
                  !i &&
                  (null == (t = window) ? void 0 : t.addEventListener)
                ) {
                  var n = function () {
                    return e();
                  };
                  return (
                    window.addEventListener("visibilitychange", n, !1),
                    window.addEventListener("focus", n, !1),
                    function () {
                      window.removeEventListener("visibilitychange", n),
                        window.removeEventListener("focus", n);
                    }
                  );
                }
              }),
              t
            );
          }
          (0, b.Z)(t, e);
          var n = t.prototype;
          return (
            (n.onSubscribe = function () {
              this.cleanup || this.setEventListener(this.setup);
            }),
            (n.onUnsubscribe = function () {
              var e;
              this.hasListeners() ||
                (null == (e = this.cleanup) || e.call(this),
                (this.cleanup = void 0));
            }),
            (n.setEventListener = function (e) {
              var t,
                n = this;
              (this.setup = e),
                null == (t = this.cleanup) || t.call(this),
                (this.cleanup = e(function (e) {
                  "boolean" === typeof e ? n.setFocused(e) : n.onFocus();
                }));
            }),
            (n.setFocused = function (e) {
              (this.focused = e), e && this.onFocus();
            }),
            (n.onFocus = function () {
              this.listeners.forEach(function (e) {
                e();
              });
            }),
            (n.isFocused = function () {
              return "boolean" === typeof this.focused
                ? this.focused
                : "undefined" === typeof document ||
                    [void 0, "visible", "prerender"].includes(
                      document.visibilityState
                    );
            }),
            t
          );
        })(y))();
      var E = function (e) {
        (this.revert = null == e ? void 0 : e.revert),
          (this.silent = null == e ? void 0 : e.silent);
      };
      var w = (function (e) {
        function t(t, n) {
          var r;
          return (
            ((r = e.call(this) || this).client = t),
            (r.options = n),
            (r.trackedProps = []),
            (r.previousSelectError = null),
            r.bindMethods(),
            r.setOptions(n),
            r
          );
        }
        (0, b.Z)(t, e);
        var n = t.prototype;
        return (
          (n.bindMethods = function () {
            (this.remove = this.remove.bind(this)),
              (this.refetch = this.refetch.bind(this));
          }),
          (n.onSubscribe = function () {
            1 === this.listeners.length &&
              (this.currentQuery.addObserver(this),
              O(this.currentQuery, this.options) && this.executeFetch(),
              this.updateTimers());
          }),
          (n.onUnsubscribe = function () {
            this.listeners.length || this.destroy();
          }),
          (n.shouldFetchOnReconnect = function () {
            return (
              (e = this.currentQuery),
              !1 !== (t = this.options).enabled &&
                ("always" === t.refetchOnReconnect ||
                  (!1 !== t.refetchOnReconnect && k(e, t)))
            );
            var e, t;
          }),
          (n.shouldFetchOnWindowFocus = function () {
            return (
              (e = this.currentQuery),
              !1 !== (t = this.options).enabled &&
                ("always" === t.refetchOnWindowFocus ||
                  (!1 !== t.refetchOnWindowFocus && k(e, t)))
            );
            var e, t;
          }),
          (n.destroy = function () {
            (this.listeners = []),
              this.clearTimers(),
              this.currentQuery.removeObserver(this);
          }),
          (n.setOptions = function (e, t) {
            var n = this.options,
              r = this.currentQuery;
            if (
              ((this.options = this.client.defaultQueryObserverOptions(e)),
              "undefined" !== typeof this.options.enabled &&
                "boolean" !== typeof this.options.enabled)
            )
              throw new Error("Expected enabled to be a boolean");
            this.options.queryKey || (this.options.queryKey = n.queryKey),
              this.updateQuery();
            var i = this.hasListeners();
            i &&
              S(this.currentQuery, r, this.options, n) &&
              this.executeFetch(),
              this.updateResult(t),
              !i ||
                (this.currentQuery === r &&
                  this.options.enabled === n.enabled &&
                  this.options.staleTime === n.staleTime) ||
                this.updateStaleTimeout();
            var o = this.computeRefetchInterval();
            !i ||
              (this.currentQuery === r &&
                this.options.enabled === n.enabled &&
                o === this.currentRefetchInterval) ||
              this.updateRefetchInterval(o);
          }),
          (n.getOptimisticResult = function (e) {
            var t = this.client.defaultQueryObserverOptions(e),
              n = this.client.getQueryCache().build(this.client, t);
            return this.createResult(n, t);
          }),
          (n.getCurrentResult = function () {
            return this.currentResult;
          }),
          (n.trackResult = function (e, t) {
            var n = this,
              r = {},
              i = function (e) {
                n.trackedProps.includes(e) || n.trackedProps.push(e);
              };
            return (
              Object.keys(e).forEach(function (t) {
                Object.defineProperty(r, t, {
                  configurable: !1,
                  enumerable: !0,
                  get: function () {
                    return i(t), e[t];
                  },
                });
              }),
              (t.useErrorBoundary || t.suspense) && i("error"),
              r
            );
          }),
          (n.getNextResult = function (e) {
            var t = this;
            return new Promise(function (n, r) {
              var i = t.subscribe(function (t) {
                t.isFetching ||
                  (i(),
                  t.isError && (null == e ? void 0 : e.throwOnError)
                    ? r(t.error)
                    : n(t));
              });
            });
          }),
          (n.getCurrentQuery = function () {
            return this.currentQuery;
          }),
          (n.remove = function () {
            this.client.getQueryCache().remove(this.currentQuery);
          }),
          (n.refetch = function (e) {
            return this.fetch(
              (0, r.Z)({}, e, {
                meta: { refetchPage: null == e ? void 0 : e.refetchPage },
              })
            );
          }),
          (n.fetchOptimistic = function (e) {
            var t = this,
              n = this.client.defaultQueryObserverOptions(e),
              r = this.client.getQueryCache().build(this.client, n);
            return r.fetch().then(function () {
              return t.createResult(r, n);
            });
          }),
          (n.fetch = function (e) {
            var t = this;
            return this.executeFetch(e).then(function () {
              return t.updateResult(), t.currentResult;
            });
          }),
          (n.executeFetch = function (e) {
            this.updateQuery();
            var t = this.currentQuery.fetch(this.options, e);
            return (null == e ? void 0 : e.throwOnError) || (t = t.catch(o)), t;
          }),
          (n.updateStaleTimeout = function () {
            var e = this;
            if (
              (this.clearStaleTimeout(),
              !i && !this.currentResult.isStale && a(this.options.staleTime))
            ) {
              var t,
                n,
                r =
                  ((t = this.currentResult.dataUpdatedAt),
                  (n = this.options.staleTime),
                  Math.max(t + (n || 0) - Date.now(), 0)) + 1;
              this.staleTimeoutId = setTimeout(function () {
                e.currentResult.isStale || e.updateResult();
              }, r);
            }
          }),
          (n.computeRefetchInterval = function () {
            var e;
            return "function" === typeof this.options.refetchInterval
              ? this.options.refetchInterval(
                  this.currentResult.data,
                  this.currentQuery
                )
              : null != (e = this.options.refetchInterval) && e;
          }),
          (n.updateRefetchInterval = function (e) {
            var t = this;
            this.clearRefetchInterval(),
              (this.currentRefetchInterval = e),
              !i &&
                !1 !== this.options.enabled &&
                a(this.currentRefetchInterval) &&
                0 !== this.currentRefetchInterval &&
                (this.refetchIntervalId = setInterval(function () {
                  (t.options.refetchIntervalInBackground || _.isFocused()) &&
                    t.executeFetch();
                }, this.currentRefetchInterval));
          }),
          (n.updateTimers = function () {
            this.updateStaleTimeout(),
              this.updateRefetchInterval(this.computeRefetchInterval());
          }),
          (n.clearTimers = function () {
            this.clearStaleTimeout(), this.clearRefetchInterval();
          }),
          (n.clearStaleTimeout = function () {
            clearTimeout(this.staleTimeoutId), (this.staleTimeoutId = void 0);
          }),
          (n.clearRefetchInterval = function () {
            clearInterval(this.refetchIntervalId),
              (this.refetchIntervalId = void 0);
          }),
          (n.createResult = function (e, t) {
            var n,
              r = this.currentQuery,
              i = this.options,
              o = this.currentResult,
              a = this.currentResultState,
              c = this.currentResultOptions,
              l = e !== r,
              u = l ? e.state : this.currentQueryInitialState,
              d = l ? this.currentResult : this.previousQueryResult,
              p = e.state,
              m = p.dataUpdatedAt,
              f = p.error,
              g = p.errorUpdatedAt,
              v = p.isFetching,
              b = p.status,
              y = !1,
              _ = !1;
            if (t.optimisticResults) {
              var E = this.hasListeners(),
                w = !E && O(e, t),
                C = E && S(e, r, t, i);
              (w || C) && ((v = !0), m || (b = "loading"));
            }
            if (
              t.keepPreviousData &&
              !p.dataUpdateCount &&
              (null == d ? void 0 : d.isSuccess) &&
              "error" !== b
            )
              (n = d.data), (m = d.dataUpdatedAt), (b = d.status), (y = !0);
            else if (t.select && "undefined" !== typeof p.data) {
              var x;
              if (
                o &&
                p.data === (null == a ? void 0 : a.data) &&
                t.select ===
                  (null == (x = this.previousSelect) ? void 0 : x.fn) &&
                !this.previousSelectError
              )
                n = this.previousSelect.result;
              else
                try {
                  (n = t.select(p.data)),
                    !1 !== t.structuralSharing &&
                      (n = s(null == o ? void 0 : o.data, n)),
                    (this.previousSelect = { fn: t.select, result: n }),
                    (this.previousSelectError = null);
                } catch (P) {
                  h().error(P),
                    (f = P),
                    (this.previousSelectError = P),
                    (g = Date.now()),
                    (b = "error");
                }
            } else n = p.data;
            if (
              "undefined" !== typeof t.placeholderData &&
              "undefined" === typeof n &&
              ("loading" === b || "idle" === b)
            ) {
              var N;
              if (
                (null == o ? void 0 : o.isPlaceholderData) &&
                t.placeholderData === (null == c ? void 0 : c.placeholderData)
              )
                N = o.data;
              else if (
                ((N =
                  "function" === typeof t.placeholderData
                    ? t.placeholderData()
                    : t.placeholderData),
                t.select && "undefined" !== typeof N)
              )
                try {
                  (N = t.select(N)),
                    !1 !== t.structuralSharing &&
                      (N = s(null == o ? void 0 : o.data, N)),
                    (this.previousSelectError = null);
                } catch (P) {
                  h().error(P),
                    (f = P),
                    (this.previousSelectError = P),
                    (g = Date.now()),
                    (b = "error");
                }
              "undefined" !== typeof N && ((b = "success"), (n = N), (_ = !0));
            }
            return {
              status: b,
              isLoading: "loading" === b,
              isSuccess: "success" === b,
              isError: "error" === b,
              isIdle: "idle" === b,
              data: n,
              dataUpdatedAt: m,
              error: f,
              errorUpdatedAt: g,
              failureCount: p.fetchFailureCount,
              isFetched: p.dataUpdateCount > 0 || p.errorUpdateCount > 0,
              isFetchedAfterMount:
                p.dataUpdateCount > u.dataUpdateCount ||
                p.errorUpdateCount > u.errorUpdateCount,
              isFetching: v,
              isRefetching: v && "loading" !== b,
              isLoadingError: "error" === b && 0 === p.dataUpdatedAt,
              isPlaceholderData: _,
              isPreviousData: y,
              isRefetchError: "error" === b && 0 !== p.dataUpdatedAt,
              isStale: k(e, t),
              refetch: this.refetch,
              remove: this.remove,
            };
          }),
          (n.shouldNotifyListeners = function (e, t) {
            if (!t) return !0;
            var n = this.options,
              r = n.notifyOnChangeProps,
              i = n.notifyOnChangePropsExclusions;
            if (!r && !i) return !0;
            if ("tracked" === r && !this.trackedProps.length) return !0;
            var o = "tracked" === r ? this.trackedProps : r;
            return Object.keys(e).some(function (n) {
              var r = n,
                a = e[r] !== t[r],
                s =
                  null == o
                    ? void 0
                    : o.some(function (e) {
                        return e === n;
                      }),
                c =
                  null == i
                    ? void 0
                    : i.some(function (e) {
                        return e === n;
                      });
              return a && !c && (!o || s);
            });
          }),
          (n.updateResult = function (e) {
            var t = this.currentResult;
            if (
              ((this.currentResult = this.createResult(
                this.currentQuery,
                this.options
              )),
              (this.currentResultState = this.currentQuery.state),
              (this.currentResultOptions = this.options),
              !(function (e, t) {
                if ((e && !t) || (t && !e)) return !1;
                for (var n in e) if (e[n] !== t[n]) return !1;
                return !0;
              })(this.currentResult, t))
            ) {
              var n = { cache: !0 };
              !1 !== (null == e ? void 0 : e.listeners) &&
                this.shouldNotifyListeners(this.currentResult, t) &&
                (n.listeners = !0),
                this.notify((0, r.Z)({}, n, e));
            }
          }),
          (n.updateQuery = function () {
            var e = this.client
              .getQueryCache()
              .build(this.client, this.options);
            if (e !== this.currentQuery) {
              var t = this.currentQuery;
              (this.currentQuery = e),
                (this.currentQueryInitialState = e.state),
                (this.previousQueryResult = this.currentResult),
                this.hasListeners() &&
                  (null == t || t.removeObserver(this), e.addObserver(this));
            }
          }),
          (n.onQueryUpdate = function (e) {
            var t = {};
            "success" === e.type
              ? (t.onSuccess = !0)
              : "error" !== e.type || e.error instanceof E || (t.onError = !0),
              this.updateResult(t),
              this.hasListeners() && this.updateTimers();
          }),
          (n.notify = function (e) {
            var t = this;
            m.batch(function () {
              e.onSuccess
                ? (null == t.options.onSuccess ||
                    t.options.onSuccess(t.currentResult.data),
                  null == t.options.onSettled ||
                    t.options.onSettled(t.currentResult.data, null))
                : e.onError &&
                  (null == t.options.onError ||
                    t.options.onError(t.currentResult.error),
                  null == t.options.onSettled ||
                    t.options.onSettled(void 0, t.currentResult.error)),
                e.listeners &&
                  t.listeners.forEach(function (e) {
                    e(t.currentResult);
                  }),
                e.cache &&
                  t.client
                    .getQueryCache()
                    .notify({
                      query: t.currentQuery,
                      type: "observerResultsUpdated",
                    });
            });
          }),
          t
        );
      })(y);
      function O(e, t) {
        return (
          (function (e, t) {
            return (
              !1 !== t.enabled &&
              !e.state.dataUpdatedAt &&
              !("error" === e.state.status && !1 === t.retryOnMount)
            );
          })(e, t) ||
          (function (e, t) {
            return (
              !1 !== t.enabled &&
              e.state.dataUpdatedAt > 0 &&
              ("always" === t.refetchOnMount ||
                (!1 !== t.refetchOnMount && k(e, t)))
            );
          })(e, t)
        );
      }
      function S(e, t, n, r) {
        return (
          !1 !== n.enabled &&
          (e !== t || !1 === r.enabled) &&
          (!n.suspense || "error" !== e.state.status) &&
          k(e, n)
        );
      }
      function k(e, t) {
        return e.isStaleByTime(t.staleTime);
      }
      var C = n(67294);
      function x() {
        var e = !1;
        return {
          clearReset: function () {
            e = !1;
          },
          reset: function () {
            e = !0;
          },
          isReset: function () {
            return e;
          },
        };
      }
      var N = C.createContext(x()),
        P = C.createContext(void 0),
        I = C.createContext(!1);
      function T(e) {
        return e && "undefined" !== typeof window
          ? (window.ReactQueryClientContext ||
              (window.ReactQueryClientContext = P),
            window.ReactQueryClientContext)
          : P;
      }
      function Z(e, t) {
        var n = C.useRef(!1),
          r = C.useState(0)[1],
          i = (function () {
            var e = C.useContext(T(C.useContext(I)));
            if (!e)
              throw new Error(
                "No QueryClient set, use QueryClientProvider to set one"
              );
            return e;
          })(),
          o = C.useContext(N),
          a = i.defaultQueryObserverOptions(e);
        (a.optimisticResults = !0),
          a.onError && (a.onError = m.batchCalls(a.onError)),
          a.onSuccess && (a.onSuccess = m.batchCalls(a.onSuccess)),
          a.onSettled && (a.onSettled = m.batchCalls(a.onSettled)),
          a.suspense &&
            ("number" !== typeof a.staleTime && (a.staleTime = 1e3),
            0 === a.cacheTime && (a.cacheTime = 1)),
          (a.suspense || a.useErrorBoundary) &&
            (o.isReset() || (a.retryOnMount = !1));
        var s,
          c,
          l,
          u = C.useState(function () {
            return new t(i, a);
          })[0],
          d = u.getOptimisticResult(a);
        if (
          (C.useEffect(
            function () {
              (n.current = !0), o.clearReset();
              var e = u.subscribe(
                m.batchCalls(function () {
                  n.current &&
                    r(function (e) {
                      return e + 1;
                    });
                })
              );
              return (
                u.updateResult(),
                function () {
                  (n.current = !1), e();
                }
              );
            },
            [o, u]
          ),
          C.useEffect(
            function () {
              u.setOptions(a, { listeners: !1 });
            },
            [a, u]
          ),
          a.suspense && d.isLoading)
        )
          throw u
            .fetchOptimistic(a)
            .then(function (e) {
              var t = e.data;
              null == a.onSuccess || a.onSuccess(t),
                null == a.onSettled || a.onSettled(t, null);
            })
            .catch(function (e) {
              o.clearReset(),
                null == a.onError || a.onError(e),
                null == a.onSettled || a.onSettled(void 0, e);
            });
        if (
          d.isError &&
          !o.isReset() &&
          !d.isFetching &&
          ((s = a.suspense),
          (c = a.useErrorBoundary),
          (l = d.error),
          "function" === typeof c ? c(l) : "boolean" === typeof c ? c : s)
        )
          throw d.error;
        return (
          "tracked" === a.notifyOnChangeProps && (d = u.trackResult(d, a)), d
        );
      }
      function R(e, t, n) {
        var i = (function (e, t, n) {
          return u(e)
            ? "function" === typeof t
              ? (0, r.Z)({}, n, { queryKey: e, queryFn: t })
              : (0, r.Z)({}, t, { queryKey: e })
            : e;
        })(e, t, n);
        return Z(i, w);
      }
    },
    42238: function (e, t, n) {
      var r;
      !(function (i, o) {
        "use strict";
        var a = "function",
          s = "undefined",
          c = "object",
          l = "model",
          u = "name",
          d = "type",
          p = "vendor",
          m = "version",
          f = "architecture",
          g = "console",
          h = "mobile",
          v = "tablet",
          b = "smarttv",
          y = "wearable",
          _ = {
            extend: function (e, t) {
              var n = {};
              for (var r in e)
                t[r] && t[r].length % 2 === 0
                  ? (n[r] = t[r].concat(e[r]))
                  : (n[r] = e[r]);
              return n;
            },
            has: function (e, t) {
              return (
                "string" === typeof e &&
                -1 !== t.toLowerCase().indexOf(e.toLowerCase())
              );
            },
            lowerize: function (e) {
              return e.toLowerCase();
            },
            major: function (e) {
              return "string" === typeof e
                ? e.replace(/[^\d\.]/g, "").split(".")[0]
                : o;
            },
            trim: function (e) {
              return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
            },
          },
          E = {
            rgx: function (e, t) {
              for (var n, r, i, s, l, u, d = 0; d < t.length && !l; ) {
                var p = t[d],
                  m = t[d + 1];
                for (n = r = 0; n < p.length && !l; )
                  if ((l = p[n++].exec(e)))
                    for (i = 0; i < m.length; i++)
                      (u = l[++r]),
                        typeof (s = m[i]) === c && s.length > 0
                          ? 2 == s.length
                            ? typeof s[1] == a
                              ? (this[s[0]] = s[1].call(this, u))
                              : (this[s[0]] = s[1])
                            : 3 == s.length
                            ? typeof s[1] !== a || (s[1].exec && s[1].test)
                              ? (this[s[0]] = u ? u.replace(s[1], s[2]) : o)
                              : (this[s[0]] = u ? s[1].call(this, u, s[2]) : o)
                            : 4 == s.length &&
                              (this[s[0]] = u
                                ? s[3].call(this, u.replace(s[1], s[2]))
                                : o)
                          : (this[s] = u || o);
                d += 2;
              }
            },
            str: function (e, t) {
              for (var n in t)
                if (typeof t[n] === c && t[n].length > 0) {
                  for (var r = 0; r < t[n].length; r++)
                    if (_.has(t[n][r], e)) return "?" === n ? o : n;
                } else if (_.has(t[n], e)) return "?" === n ? o : n;
              return e;
            },
          },
          w = {
            browser: {
              oldsafari: {
                version: {
                  "1.0": "/8",
                  1.2: "/1",
                  1.3: "/3",
                  "2.0": "/412",
                  "2.0.2": "/416",
                  "2.0.3": "/417",
                  "2.0.4": "/419",
                  "?": "/",
                },
              },
            },
            device: {
              amazon: { model: { "Fire Phone": ["SD", "KF"] } },
              sprint: {
                model: { "Evo Shift 4G": "7373KT" },
                vendor: { HTC: "APA", Sprint: "Sprint" },
              },
            },
            os: {
              windows: {
                version: {
                  ME: "4.90",
                  "NT 3.11": "NT3.51",
                  "NT 4.0": "NT4.0",
                  2e3: "NT 5.0",
                  XP: ["NT 5.1", "NT 5.2"],
                  Vista: "NT 6.0",
                  7: "NT 6.1",
                  8: "NT 6.2",
                  8.1: "NT 6.3",
                  10: ["NT 6.4", "NT 10.0"],
                  RT: "ARM",
                },
              },
            },
          },
          O = {
            browser: [
              [
                /(opera\smini)\/([\w\.-]+)/i,
                /(opera\s[mobiletab]{3,6}).+version\/([\w\.-]+)/i,
                /(opera).+version\/([\w\.]+)/i,
                /(opera)[\/\s]+([\w\.]+)/i,
              ],
              [u, m],
              [/(opios)[\/\s]+([\w\.]+)/i],
              [[u, "Opera Mini"], m],
              [/\s(opr)\/([\w\.]+)/i],
              [[u, "Opera"], m],
              [
                /(kindle)\/([\w\.]+)/i,
                /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,
                /(avant\s|iemobile|slim)(?:browser)?[\/\s]?([\w\.]*)/i,
                /(bidubrowser|baidubrowser)[\/\s]?([\w\.]+)/i,
                /(?:ms|\()(ie)\s([\w\.]+)/i,
                /(rekonq)\/([\w\.]*)/i,
                /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i,
              ],
              [u, m],
              [/(konqueror)\/([\w\.]+)/i],
              [[u, "Konqueror"], m],
              [/(trident).+rv[:\s]([\w\.]{1,9}).+like\sgecko/i],
              [[u, "IE"], m],
              [/(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i],
              [[u, "Edge"], m],
              [/(yabrowser)\/([\w\.]+)/i],
              [[u, "Yandex"], m],
              [/(Avast)\/([\w\.]+)/i],
              [[u, "Avast Secure Browser"], m],
              [/(AVG)\/([\w\.]+)/i],
              [[u, "AVG Secure Browser"], m],
              [/(puffin)\/([\w\.]+)/i],
              [[u, "Puffin"], m],
              [/(focus)\/([\w\.]+)/i],
              [[u, "Firefox Focus"], m],
              [/(opt)\/([\w\.]+)/i],
              [[u, "Opera Touch"], m],
              [/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i],
              [[u, "UCBrowser"], m],
              [/(comodo_dragon)\/([\w\.]+)/i],
              [[u, /_/g, " "], m],
              [/(windowswechat qbcore)\/([\w\.]+)/i],
              [[u, "WeChat(Win) Desktop"], m],
              [/(micromessenger)\/([\w\.]+)/i],
              [[u, "WeChat"], m],
              [/(brave)\/([\w\.]+)/i],
              [[u, "Brave"], m],
              [/(whale)\/([\w\.]+)/i],
              [[u, "Whale"], m],
              [/(qqbrowserlite)\/([\w\.]+)/i],
              [u, m],
              [/(QQ)\/([\d\.]+)/i],
              [u, m],
              [/m?(qqbrowser)[\/\s]?([\w\.]+)/i],
              [u, m],
              [/(baiduboxapp)[\/\s]?([\w\.]+)/i],
              [u, m],
              [/(2345Explorer)[\/\s]?([\w\.]+)/i],
              [u, m],
              [/(MetaSr)[\/\s]?([\w\.]+)/i],
              [u],
              [/(LBBROWSER)/i],
              [u],
              [/xiaomi\/miuibrowser\/([\w\.]+)/i],
              [m, [u, "MIUI Browser"]],
              [/;fbav\/([\w\.]+);/i],
              [m, [u, "Facebook"]],
              [/FBAN\/FBIOS|FB_IAB\/FB4A/i],
              [[u, "Facebook"]],
              [
                /safari\s(line)\/([\w\.]+)/i,
                /android.+(line)\/([\w\.]+)\/iab/i,
              ],
              [u, m],
              [/headlesschrome(?:\/([\w\.]+)|\s)/i],
              [m, [u, "Chrome Headless"]],
              [/\swv\).+(chrome)\/([\w\.]+)/i],
              [[u, /(.+)/, "$1 WebView"], m],
              [/((?:oculus|samsung)browser)\/([\w\.]+)/i],
              [[u, /(.+(?:g|us))(.+)/, "$1 $2"], m],
              [/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i],
              [m, [u, "Android Browser"]],
              [/(coc_coc_browser)\/([\w\.]+)/i],
              [[u, "Coc Coc"], m],
              [/(sailfishbrowser)\/([\w\.]+)/i],
              [[u, "Sailfish Browser"], m],
              [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],
              [u, m],
              [/(dolfin)\/([\w\.]+)/i],
              [[u, "Dolphin"], m],
              [/(qihu|qhbrowser|qihoobrowser|360browser)/i],
              [[u, "360 Browser"]],
              [/((?:android.+)crmo|crios)\/([\w\.]+)/i],
              [[u, "Chrome"], m],
              [/(coast)\/([\w\.]+)/i],
              [[u, "Opera Coast"], m],
              [/fxios\/([\w\.-]+)/i],
              [m, [u, "Firefox"]],
              [/version\/([\w\.]+)\s.*mobile\/\w+\s(safari)/i],
              [m, [u, "Mobile Safari"]],
              [/version\/([\w\.]+)\s.*(mobile\s?safari|safari)/i],
              [m, u],
              [
                /webkit.+?(gsa)\/([\w\.]+)\s.*(mobile\s?safari|safari)(\/[\w\.]+)/i,
              ],
              [[u, "GSA"], m],
              [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
              [u, [m, E.str, w.browser.oldsafari.version]],
              [/(webkit|khtml)\/([\w\.]+)/i],
              [u, m],
              [/(navigator|netscape)\/([\w\.-]+)/i],
              [[u, "Netscape"], m],
              [
                /(swiftfox)/i,
                /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,
                /(firefox)\/([\w\.]+)\s[\w\s\-]+\/[\w\.]+$/i,
                /(mozilla)\/([\w\.]+)\s.+rv\:.+gecko\/\d+/i,
                /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                /(links)\s\(([\w\.]+)/i,
                /(gobrowser)\/?([\w\.]*)/i,
                /(ice\s?browser)\/v?([\w\._]+)/i,
                /(mosaic)[\/\s]([\w\.]+)/i,
              ],
              [u, m],
            ],
            cpu: [
              [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
              [[f, "amd64"]],
              [/(ia32(?=;))/i],
              [[f, _.lowerize]],
              [/((?:i[346]|x)86)[;\)]/i],
              [[f, "ia32"]],
              [/windows\s(ce|mobile);\sppc;/i],
              [[f, "arm"]],
              [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
              [[f, /ower/, "", _.lowerize]],
              [/(sun4\w)[;\)]/i],
              [[f, "sparc"]],
              [
                /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i,
              ],
              [[f, _.lowerize]],
            ],
            device: [
              [/\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i],
              [l, p, [d, v]],
              [/applecoremedia\/[\w\.]+ \((ipad)/],
              [l, [p, "Apple"], [d, v]],
              [/(apple\s{0,1}tv)/i],
              [
                [l, "Apple TV"],
                [p, "Apple"],
                [d, b],
              ],
              [
                /(archos)\s(gamepad2?)/i,
                /(hp).+(touchpad)/i,
                /(hp).+(tablet)/i,
                /(kindle)\/([\w\.]+)/i,
                /\s(nook)[\w\s]+build\/(\w+)/i,
                /(dell)\s(strea[kpr\s\d]*[\dko])/i,
              ],
              [p, l, [d, v]],
              [/(kf[A-z]+)(\sbuild\/|\)).+silk\//i],
              [l, [p, "Amazon"], [d, v]],
              [/(sd|kf)[0349hijorstuw]+(\sbuild\/|\)).+silk\//i],
              [
                [l, E.str, w.device.amazon.model],
                [p, "Amazon"],
                [d, h],
              ],
              [/android.+aft([\w])(\sbuild\/|\))/i],
              [l, [p, "Amazon"], [d, b]],
              [/\((ip[honed|\s\w*]+);.+(apple)/i],
              [l, p, [d, h]],
              [/\((ip[honed|\s\w*]+);/i],
              [l, [p, "Apple"], [d, h]],
              [
                /(blackberry)[\s-]?(\w+)/i,
                /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,
                /(hp)\s([\w\s]+\w)/i,
                /(asus)-?(\w+)/i,
              ],
              [p, l, [d, h]],
              [/\(bb10;\s(\w+)/i],
              [l, [p, "BlackBerry"], [d, h]],
              [
                /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i,
              ],
              [l, [p, "Asus"], [d, v]],
              [
                /(sony)\s(tablet\s[ps])\sbuild\//i,
                /(sony)?(?:sgp.+)\sbuild\//i,
              ],
              [
                [p, "Sony"],
                [l, "Xperia Tablet"],
                [d, v],
              ],
              [
                /android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i,
              ],
              [l, [p, "Sony"], [d, h]],
              [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i],
              [p, l, [d, g]],
              [/android.+;\s(shield)\sbuild/i],
              [l, [p, "Nvidia"], [d, g]],
              [/(playstation\s[34portablevi]+)/i],
              [l, [p, "Sony"], [d, g]],
              [/(sprint\s(\w+))/i],
              [
                [p, E.str, w.device.sprint.vendor],
                [l, E.str, w.device.sprint.model],
                [d, h],
              ],
              [
                /(htc)[;_\s-]{1,2}([\w\s]+(?=\)|\sbuild)|\w+)/i,
                /(zte)-(\w*)/i,
                /(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i,
              ],
              [p, [l, /_/g, " "], [d, h]],
              [/(nexus\s9)/i],
              [l, [p, "HTC"], [d, v]],
              [
                /d\/huawei([\w\s-]+)[;\)]/i,
                /android.+\s(nexus\s6p|vog-[at]?l\d\d|ane-[at]?l[x\d]\d|eml-a?l\d\da?|lya-[at]?l\d[\dc]|clt-a?l\d\di?)/i,
              ],
              [l, [p, "Huawei"], [d, h]],
              [/android.+(bah2?-a?[lw]\d{2})/i],
              [l, [p, "Huawei"], [d, v]],
              [/(microsoft);\s(lumia[\s\w]+)/i],
              [p, l, [d, h]],
              [/[\s\(;](xbox(?:\sone)?)[\s\);]/i],
              [l, [p, "Microsoft"], [d, g]],
              [/(kin\.[onetw]{3})/i],
              [
                [l, /\./g, " "],
                [p, "Microsoft"],
                [d, h],
              ],
              [
                /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,
                /mot[\s-]?(\w*)/i,
                /(XT\d{3,4}) build\//i,
                /(nexus\s6)/i,
              ],
              [l, [p, "Motorola"], [d, h]],
              [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
              [l, [p, "Motorola"], [d, v]],
              [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],
              [
                [p, _.trim],
                [l, _.trim],
                [d, b],
              ],
              [/hbbtv.+maple;(\d+)/i],
              [
                [l, /^/, "SmartTV"],
                [p, "Samsung"],
                [d, b],
              ],
              [/\(dtv[\);].+(aquos)/i],
              [l, [p, "Sharp"], [d, b]],
              [
                /android.+((sch-i[89]0\d|shw-m380s|SM-P605|SM-P610|SM-P587|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
                /((SM-T\w+))/i,
              ],
              [[p, "Samsung"], l, [d, v]],
              [/smart-tv.+(samsung)/i],
              [p, [d, b], l],
              [
                /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
                /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,
                /sec-((sgh\w+))/i,
              ],
              [[p, "Samsung"], l, [d, h]],
              [/sie-(\w*)/i],
              [l, [p, "Siemens"], [d, h]],
              [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]*)/i],
              [[p, "Nokia"], l, [d, h]],
              [/android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i],
              [l, [p, "Acer"], [d, v]],
              [/android.+([vl]k\-?\d{3})\s+build/i],
              [l, [p, "LG"], [d, v]],
              [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],
              [[p, "LG"], l, [d, v]],
              [/linux;\snetcast.+smarttv/i, /lg\snetcast\.tv-201\d/i],
              [[p, "LG"], l, [d, b]],
              [
                /(nexus\s[45])/i,
                /lg[e;\s\/-]+(\w*)/i,
                /android.+lg(\-?[\d\w]+)\s+build/i,
              ],
              [l, [p, "LG"], [d, h]],
              [/(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i],
              [p, l, [d, v]],
              [/android.+(ideatab[a-z0-9\-\s]+)/i],
              [l, [p, "Lenovo"], [d, v]],
              [/(lenovo)[_\s-]?([\w-]+)/i],
              [p, l, [d, h]],
              [/linux;.+((jolla));/i],
              [p, l, [d, h]],
              [/((pebble))app\/[\d\.]+\s/i],
              [p, l, [d, y]],
              [/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i],
              [p, l, [d, h]],
              [/crkey/i],
              [
                [l, "Chromecast"],
                [p, "Google"],
                [d, b],
              ],
              [/android.+;\s(glass)\s\d/i],
              [l, [p, "Google"], [d, y]],
              [/android.+;\s(pixel c)[\s)]/i],
              [l, [p, "Google"], [d, v]],
              [/android.+;\s(pixel( [2-9]a?)?( xl)?)[\s)]/i],
              [l, [p, "Google"], [d, h]],
              [
                /android.+;\s(\w+)\s+build\/hm\1/i,
                /android.+(hm[\s\-_]?note?[\s_]?(?:\d\w)?)\sbuild/i,
                /android.+(redmi[\s\-_]?(?:note|k)?(?:[\s_]?[\w\s]+))(?:\sbuild|\))/i,
                /android.+(mi[\s\-_]?(?:a\d|one|one[\s_]plus|note lte)?[\s_]?(?:\d?\w?)[\s_]?(?:plus)?)\sbuild/i,
              ],
              [
                [l, /_/g, " "],
                [p, "Xiaomi"],
                [d, h],
              ],
              [/android.+(mi[\s\-_]?(?:pad)(?:[\s_]?[\w\s]+))(?:\sbuild|\))/i],
              [
                [l, /_/g, " "],
                [p, "Xiaomi"],
                [d, v],
              ],
              [/android.+;\s(m[1-5]\snote)\sbuild/i],
              [l, [p, "Meizu"], [d, h]],
              [/(mz)-([\w-]{2,})/i],
              [[p, "Meizu"], l, [d, h]],
              [/android.+a000(1)\s+build/i, /android.+oneplus\s(a\d{4})[\s)]/i],
              [l, [p, "OnePlus"], [d, h]],
              [/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i],
              [l, [p, "RCA"], [d, v]],
              [/android.+[;\/\s](Venue[\d\s]{2,7})\s+build/i],
              [l, [p, "Dell"], [d, v]],
              [/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i],
              [l, [p, "Verizon"], [d, v]],
              [
                /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(\S(?:.*\S)?)\s+build/i,
              ],
              [[p, "Barnes & Noble"], l, [d, v]],
              [/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i],
              [l, [p, "NuVision"], [d, v]],
              [/android.+;\s(k88)\sbuild/i],
              [l, [p, "ZTE"], [d, v]],
              [/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i],
              [l, [p, "Swiss"], [d, h]],
              [/android.+[;\/]\s*(zur\d{3})\s+build/i],
              [l, [p, "Swiss"], [d, v]],
              [/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i],
              [l, [p, "Zeki"], [d, v]],
              [
                /(android).+[;\/]\s+([YR]\d{2})\s+build/i,
                /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i,
              ],
              [[p, "Dragon Touch"], l, [d, v]],
              [/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i],
              [l, [p, "Insignia"], [d, v]],
              [/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i],
              [l, [p, "NextBook"], [d, v]],
              [
                /android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i,
              ],
              [[p, "Voice"], l, [d, h]],
              [/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i],
              [[p, "LvTel"], l, [d, h]],
              [/android.+;\s(PH-1)\s/i],
              [l, [p, "Essential"], [d, h]],
              [/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i],
              [l, [p, "Envizen"], [d, v]],
              [/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i],
              [p, l, [d, v]],
              [/android.+[;\/]\s*(Trio[\s\w\-\.]+)\s+build/i],
              [l, [p, "MachSpeed"], [d, v]],
              [/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i],
              [p, l, [d, v]],
              [/android.+[;\/]\s*TU_(1491)\s+build/i],
              [l, [p, "Rotor"], [d, v]],
              [/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i],
              [p, l, [d, v]],
              [
                /android .+?; ([^;]+?)(?: build|\) applewebkit).+? mobile safari/i,
              ],
              [l, [d, h]],
              [
                /android .+?;\s([^;]+?)(?: build|\) applewebkit).+?(?! mobile) safari/i,
              ],
              [l, [d, v]],
              [/\s(tablet|tab)[;\/]/i, /\s(mobile)(?:[;\/]|\ssafari)/i],
              [[d, _.lowerize], p, l],
              [/[\s\/\(](smart-?tv)[;\)]/i],
              [[d, b]],
              [/(android[\w\.\s\-]{0,9});.+build/i],
              [l, [p, "Generic"]],
              [/(phone)/i],
              [[d, h]],
            ],
            engine: [
              [/windows.+\sedge\/([\w\.]+)/i],
              [m, [u, "EdgeHTML"]],
              [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
              [m, [u, "Blink"]],
              [
                /(presto)\/([\w\.]+)/i,
                /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
                /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,
                /(icab)[\/\s]([23]\.[\d\.]+)/i,
              ],
              [u, m],
              [/rv\:([\w\.]{1,9}).+(gecko)/i],
              [m, u],
            ],
            os: [
              [
                /(xbox);\s+xbox\s([^\);]+)/i,
                /microsoft\s(windows)\s(vista|xp)/i,
              ],
              [u, m],
              [
                /(windows)\snt\s6\.2;\s(arm)/i,
                /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,
                /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i,
              ],
              [u, [m, E.str, w.os.windows.version]],
              [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
              [
                [u, "Windows"],
                [m, E.str, w.os.windows.version],
              ],
              [/\((bb)(10);/i],
              [[u, "BlackBerry"], m],
              [
                /(blackberry)\w*\/?([\w\.]*)/i,
                /(tizen|kaios)[\/\s]([\w\.]+)/i,
                /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i,
              ],
              [u, m],
              [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i],
              [[u, "Symbian"], m],
              [/\((series40);/i],
              [u],
              [/mozilla.+\(mobile;.+gecko.+firefox/i],
              [[u, "Firefox OS"], m],
              [/crkey\/([\d\.]+)/i],
              [m, [u, "Chromecast"]],
              [
                /(nintendo|playstation)\s([wids34portablevu]+)/i,
                /(mint)[\/\s\(]?(\w*)/i,
                /(mageia|vectorlinux)[;\s]/i,
                /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,
                /(hurd|linux)\s?([\w\.]*)/i,
                /(gnu)\s?([\w\.]*)/i,
              ],
              [u, m],
              [/(cros)\s[\w]+\s([\w\.]+\w)/i],
              [[u, "Chromium OS"], m],
              [/(sunos)\s?([\w\.\d]*)/i],
              [[u, "Solaris"], m],
              [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i],
              [u, m],
              [/(haiku)\s(\w+)/i],
              [u, m],
              [
                /cfnetwork\/.+darwin/i,
                /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i,
              ],
              [
                [m, /_/g, "."],
                [u, "iOS"],
              ],
              [/(mac\sos\sx)\s?([\w\s\.]*)/i, /(macintosh|mac(?=_powerpc)\s)/i],
              [
                [u, "Mac OS"],
                [m, /_/g, "."],
              ],
              [
                /((?:open)?solaris)[\/\s-]?([\w\.]*)/i,
                /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,
                /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,
                /(unix)\s?([\w\.]*)/i,
              ],
              [u, m],
            ],
          },
          S = function (e, t) {
            if (
              ("object" === typeof e && ((t = e), (e = o)),
              !(this instanceof S))
            )
              return new S(e, t).getResult();
            var n =
                e ||
                (i && i.navigator && i.navigator.userAgent
                  ? i.navigator.userAgent
                  : ""),
              r = t ? _.extend(O, t) : O;
            return (
              (this.getBrowser = function () {
                var e = { name: o, version: o };
                return (
                  E.rgx.call(e, n, r.browser), (e.major = _.major(e.version)), e
                );
              }),
              (this.getCPU = function () {
                var e = { architecture: o };
                return E.rgx.call(e, n, r.cpu), e;
              }),
              (this.getDevice = function () {
                var e = { vendor: o, model: o, type: o };
                return E.rgx.call(e, n, r.device), e;
              }),
              (this.getEngine = function () {
                var e = { name: o, version: o };
                return E.rgx.call(e, n, r.engine), e;
              }),
              (this.getOS = function () {
                var e = { name: o, version: o };
                return E.rgx.call(e, n, r.os), e;
              }),
              (this.getResult = function () {
                return {
                  ua: this.getUA(),
                  browser: this.getBrowser(),
                  engine: this.getEngine(),
                  os: this.getOS(),
                  device: this.getDevice(),
                  cpu: this.getCPU(),
                };
              }),
              (this.getUA = function () {
                return n;
              }),
              (this.setUA = function (e) {
                return (n = e), this;
              }),
              this
            );
          };
        (S.VERSION = "0.7.24"),
          (S.BROWSER = { NAME: u, MAJOR: "major", VERSION: m }),
          (S.CPU = { ARCHITECTURE: f }),
          (S.DEVICE = {
            MODEL: l,
            VENDOR: p,
            TYPE: d,
            CONSOLE: g,
            MOBILE: h,
            SMARTTV: b,
            TABLET: v,
            WEARABLE: y,
            EMBEDDED: "embedded",
          }),
          (S.ENGINE = { NAME: u, VERSION: m }),
          (S.OS = { NAME: u, VERSION: m }),
          typeof t !== s
            ? (e.exports && (t = e.exports = S), (t.UAParser = S))
            : (r = function () {
                return S;
              }.call(t, n, t, e)) === o || (e.exports = r);
        var k = i && (i.jQuery || i.Zepto);
        if (k && !k.ua) {
          var C = new S();
          (k.ua = C.getResult()),
            (k.ua.get = function () {
              return C.getUA();
            }),
            (k.ua.set = function (e) {
              C.setUA(e);
              var t = C.getResult();
              for (var n in t) k.ua[n] = t[n];
            });
        }
      })("object" === typeof window ? window : this);
    },
    87462: function (e, t, n) {
      "use strict";
      function r() {
        return (
          (r = Object.assign
            ? Object.assign.bind()
            : function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var n = arguments[t];
                  for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
                }
                return e;
              }),
          r.apply(this, arguments)
        );
      }
      n.d(t, {
        Z: function () {
          return r;
        },
      });
    },
    75068: function (e, t, n) {
      "use strict";
      function r(e, t) {
        return (
          (r = Object.setPrototypeOf
            ? Object.setPrototypeOf.bind()
            : function (e, t) {
                return (e.__proto__ = t), e;
              }),
          r(e, t)
        );
      }
      function i(e, t) {
        (e.prototype = Object.create(t.prototype)),
          (e.prototype.constructor = e),
          r(e, t);
      }
      n.d(t, {
        Z: function () {
          return i;
        },
      });
    },
  },
]);
//# sourceMappingURL=982-8626433c160f0af7.js.map
