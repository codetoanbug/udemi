/*! For license information please see vendors~course-manage-practice-udlite-app~course-manage-v2-udlite-app~course-preview-udlite-app~lect~cdb3bda7.a20af781b5147c3d26b8.js.LICENSE.txt */
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [
    "vendors~course-manage-practice-udlite-app~course-manage-v2-udlite-app~course-preview-udlite-app~lect~cdb3bda7",
  ],
  {
    "./node_modules/base64-js/index.js": function (e, t, r) {
      "use strict";
      t.byteLength = l;
      t.toByteArray = h;
      t.fromByteArray = p;
      var n = [];
      var i = [];
      var o = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var s =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (var u = 0, a = s.length; u < a; ++u) {
        n[u] = s[u];
        i[s.charCodeAt(u)] = u;
      }
      i["-".charCodeAt(0)] = 62;
      i["_".charCodeAt(0)] = 63;
      function f(e) {
        var t = e.length;
        if (t % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        return e[t - 2] === "=" ? 2 : e[t - 1] === "=" ? 1 : 0;
      }
      function l(e) {
        return (e.length * 3) / 4 - f(e);
      }
      function h(e) {
        var t, r, n, s, u;
        var a = e.length;
        s = f(e);
        u = new o((a * 3) / 4 - s);
        r = s > 0 ? a - 4 : a;
        var l = 0;
        for (t = 0; t < r; t += 4) {
          n =
            (i[e.charCodeAt(t)] << 18) |
            (i[e.charCodeAt(t + 1)] << 12) |
            (i[e.charCodeAt(t + 2)] << 6) |
            i[e.charCodeAt(t + 3)];
          u[l++] = (n >> 16) & 255;
          u[l++] = (n >> 8) & 255;
          u[l++] = n & 255;
        }
        if (s === 2) {
          n = (i[e.charCodeAt(t)] << 2) | (i[e.charCodeAt(t + 1)] >> 4);
          u[l++] = n & 255;
        } else if (s === 1) {
          n =
            (i[e.charCodeAt(t)] << 10) |
            (i[e.charCodeAt(t + 1)] << 4) |
            (i[e.charCodeAt(t + 2)] >> 2);
          u[l++] = (n >> 8) & 255;
          u[l++] = n & 255;
        }
        return u;
      }
      function c(e) {
        return (
          n[(e >> 18) & 63] + n[(e >> 12) & 63] + n[(e >> 6) & 63] + n[e & 63]
        );
      }
      function d(e, t, r) {
        var n;
        var i = [];
        for (var o = t; o < r; o += 3) {
          n = (e[o] << 16) + (e[o + 1] << 8) + e[o + 2];
          i.push(c(n));
        }
        return i.join("");
      }
      function p(e) {
        var t;
        var r = e.length;
        var i = r % 3;
        var o = "";
        var s = [];
        var u = 16383;
        for (var a = 0, f = r - i; a < f; a += u) {
          s.push(d(e, a, a + u > f ? f : a + u));
        }
        if (i === 1) {
          t = e[r - 1];
          o += n[t >> 2];
          o += n[(t << 4) & 63];
          o += "==";
        } else if (i === 2) {
          t = (e[r - 2] << 8) + e[r - 1];
          o += n[t >> 10];
          o += n[(t >> 4) & 63];
          o += n[(t << 2) & 63];
          o += "=";
        }
        s.push(o);
        return s.join("");
      }
    },
    "./node_modules/buffer/index.js": function (e, t, r) {
      "use strict";
      (function (e) {
        var n = r("./node_modules/base64-js/index.js");
        var i = r("./node_modules/ieee754/index.js");
        var o = r("./node_modules/isarray/index.js");
        t.Buffer = f;
        t.SlowBuffer = m;
        t.INSPECT_MAX_BYTES = 50;
        f.TYPED_ARRAY_SUPPORT =
          e.TYPED_ARRAY_SUPPORT !== undefined ? e.TYPED_ARRAY_SUPPORT : s();
        t.kMaxLength = u();
        function s() {
          try {
            var e = new Uint8Array(1);
            e.__proto__ = {
              __proto__: Uint8Array.prototype,
              foo: function () {
                return 42;
              },
            };
            return (
              e.foo() === 42 &&
              typeof e.subarray === "function" &&
              e.subarray(1, 1).byteLength === 0
            );
          } catch (e) {
            return false;
          }
        }
        function u() {
          return f.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
        }
        function a(e, t) {
          if (u() < t) {
            throw new RangeError("Invalid typed array length");
          }
          if (f.TYPED_ARRAY_SUPPORT) {
            e = new Uint8Array(t);
            e.__proto__ = f.prototype;
          } else {
            if (e === null) {
              e = new f(t);
            }
            e.length = t;
          }
          return e;
        }
        function f(e, t, r) {
          if (!f.TYPED_ARRAY_SUPPORT && !(this instanceof f)) {
            return new f(e, t, r);
          }
          if (typeof e === "number") {
            if (typeof t === "string") {
              throw new Error(
                "If encoding is specified then the first argument must be a string"
              );
            }
            return d(this, e);
          }
          return l(this, e, t, r);
        }
        f.poolSize = 8192;
        f._augment = function (e) {
          e.__proto__ = f.prototype;
          return e;
        };
        function l(e, t, r, n) {
          if (typeof t === "number") {
            throw new TypeError('"value" argument must not be a number');
          }
          if (typeof ArrayBuffer !== "undefined" && t instanceof ArrayBuffer) {
            return g(e, t, r, n);
          }
          if (typeof t === "string") {
            return p(e, t, r);
          }
          return y(e, t);
        }
        f.from = function (e, t, r) {
          return l(null, e, t, r);
        };
        if (f.TYPED_ARRAY_SUPPORT) {
          f.prototype.__proto__ = Uint8Array.prototype;
          f.__proto__ = Uint8Array;
          if (
            typeof Symbol !== "undefined" &&
            Symbol.species &&
            f[Symbol.species] === f
          ) {
            Object.defineProperty(f, Symbol.species, {
              value: null,
              configurable: true,
            });
          }
        }
        function h(e) {
          if (typeof e !== "number") {
            throw new TypeError('"size" argument must be a number');
          } else if (e < 0) {
            throw new RangeError('"size" argument must not be negative');
          }
        }
        function c(e, t, r, n) {
          h(t);
          if (t <= 0) {
            return a(e, t);
          }
          if (r !== undefined) {
            return typeof n === "string" ? a(e, t).fill(r, n) : a(e, t).fill(r);
          }
          return a(e, t);
        }
        f.alloc = function (e, t, r) {
          return c(null, e, t, r);
        };
        function d(e, t) {
          h(t);
          e = a(e, t < 0 ? 0 : _(t) | 0);
          if (!f.TYPED_ARRAY_SUPPORT) {
            for (var r = 0; r < t; ++r) {
              e[r] = 0;
            }
          }
          return e;
        }
        f.allocUnsafe = function (e) {
          return d(null, e);
        };
        f.allocUnsafeSlow = function (e) {
          return d(null, e);
        };
        function p(e, t, r) {
          if (typeof r !== "string" || r === "") {
            r = "utf8";
          }
          if (!f.isEncoding(r)) {
            throw new TypeError('"encoding" must be a valid string encoding');
          }
          var n = b(t, r) | 0;
          e = a(e, n);
          var i = e.write(t, r);
          if (i !== n) {
            e = e.slice(0, i);
          }
          return e;
        }
        function v(e, t) {
          var r = t.length < 0 ? 0 : _(t.length) | 0;
          e = a(e, r);
          for (var n = 0; n < r; n += 1) {
            e[n] = t[n] & 255;
          }
          return e;
        }
        function g(e, t, r, n) {
          t.byteLength;
          if (r < 0 || t.byteLength < r) {
            throw new RangeError("'offset' is out of bounds");
          }
          if (t.byteLength < r + (n || 0)) {
            throw new RangeError("'length' is out of bounds");
          }
          if (r === undefined && n === undefined) {
            t = new Uint8Array(t);
          } else if (n === undefined) {
            t = new Uint8Array(t, r);
          } else {
            t = new Uint8Array(t, r, n);
          }
          if (f.TYPED_ARRAY_SUPPORT) {
            e = t;
            e.__proto__ = f.prototype;
          } else {
            e = v(e, t);
          }
          return e;
        }
        function y(e, t) {
          if (f.isBuffer(t)) {
            var r = _(t.length) | 0;
            e = a(e, r);
            if (e.length === 0) {
              return e;
            }
            t.copy(e, 0, 0, r);
            return e;
          }
          if (t) {
            if (
              (typeof ArrayBuffer !== "undefined" &&
                t.buffer instanceof ArrayBuffer) ||
              "length" in t
            ) {
              if (typeof t.length !== "number" || te(t.length)) {
                return a(e, 0);
              }
              return v(e, t);
            }
            if (t.type === "Buffer" && o(t.data)) {
              return v(e, t.data);
            }
          }
          throw new TypeError(
            "First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object."
          );
        }
        function _(e) {
          if (e >= u()) {
            throw new RangeError(
              "Attempt to allocate Buffer larger than maximum " +
                "size: 0x" +
                u().toString(16) +
                " bytes"
            );
          }
          return e | 0;
        }
        function m(e) {
          if (+e != e) {
            e = 0;
          }
          return f.alloc(+e);
        }
        f.isBuffer = function e(t) {
          return !!(t != null && t._isBuffer);
        };
        f.compare = function e(t, r) {
          if (!f.isBuffer(t) || !f.isBuffer(r)) {
            throw new TypeError("Arguments must be Buffers");
          }
          if (t === r) return 0;
          var n = t.length;
          var i = r.length;
          for (var o = 0, s = Math.min(n, i); o < s; ++o) {
            if (t[o] !== r[o]) {
              n = t[o];
              i = r[o];
              break;
            }
          }
          if (n < i) return -1;
          if (i < n) return 1;
          return 0;
        };
        f.isEncoding = function e(t) {
          switch (String(t).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "latin1":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return true;
            default:
              return false;
          }
        };
        f.concat = function e(t, r) {
          if (!o(t)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          }
          if (t.length === 0) {
            return f.alloc(0);
          }
          var n;
          if (r === undefined) {
            r = 0;
            for (n = 0; n < t.length; ++n) {
              r += t[n].length;
            }
          }
          var i = f.allocUnsafe(r);
          var s = 0;
          for (n = 0; n < t.length; ++n) {
            var u = t[n];
            if (!f.isBuffer(u)) {
              throw new TypeError(
                '"list" argument must be an Array of Buffers'
              );
            }
            u.copy(i, s);
            s += u.length;
          }
          return i;
        };
        function b(e, t) {
          if (f.isBuffer(e)) {
            return e.length;
          }
          if (
            typeof ArrayBuffer !== "undefined" &&
            typeof ArrayBuffer.isView === "function" &&
            (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)
          ) {
            return e.byteLength;
          }
          if (typeof e !== "string") {
            e = "" + e;
          }
          var r = e.length;
          if (r === 0) return 0;
          var n = false;
          for (;;) {
            switch (t) {
              case "ascii":
              case "latin1":
              case "binary":
                return r;
              case "utf8":
              case "utf-8":
              case undefined:
                return X(e).length;
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return r * 2;
              case "hex":
                return r >>> 1;
              case "base64":
                return Q(e).length;
              default:
                if (n) return X(e).length;
                t = ("" + t).toLowerCase();
                n = true;
            }
          }
        }
        f.byteLength = b;
        function w(e, t, r) {
          var n = false;
          if (t === undefined || t < 0) {
            t = 0;
          }
          if (t > this.length) {
            return "";
          }
          if (r === undefined || r > this.length) {
            r = this.length;
          }
          if (r <= 0) {
            return "";
          }
          r >>>= 0;
          t >>>= 0;
          if (r <= t) {
            return "";
          }
          if (!e) e = "utf8";
          while (true) {
            switch (e) {
              case "hex":
                return D(this, t, r);
              case "utf8":
              case "utf-8":
                return B(this, t, r);
              case "ascii":
                return I(this, t, r);
              case "latin1":
              case "binary":
                return k(this, t, r);
              case "base64":
                return P(this, t, r);
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return Y(this, t, r);
              default:
                if (n) throw new TypeError("Unknown encoding: " + e);
                e = (e + "").toLowerCase();
                n = true;
            }
          }
        }
        f.prototype._isBuffer = true;
        function E(e, t, r) {
          var n = e[t];
          e[t] = e[r];
          e[r] = n;
        }
        f.prototype.swap16 = function e() {
          var t = this.length;
          if (t % 2 !== 0) {
            throw new RangeError("Buffer size must be a multiple of 16-bits");
          }
          for (var r = 0; r < t; r += 2) {
            E(this, r, r + 1);
          }
          return this;
        };
        f.prototype.swap32 = function e() {
          var t = this.length;
          if (t % 4 !== 0) {
            throw new RangeError("Buffer size must be a multiple of 32-bits");
          }
          for (var r = 0; r < t; r += 4) {
            E(this, r, r + 3);
            E(this, r + 1, r + 2);
          }
          return this;
        };
        f.prototype.swap64 = function e() {
          var t = this.length;
          if (t % 8 !== 0) {
            throw new RangeError("Buffer size must be a multiple of 64-bits");
          }
          for (var r = 0; r < t; r += 8) {
            E(this, r, r + 7);
            E(this, r + 1, r + 6);
            E(this, r + 2, r + 5);
            E(this, r + 3, r + 4);
          }
          return this;
        };
        f.prototype.toString = function e() {
          var t = this.length | 0;
          if (t === 0) return "";
          if (arguments.length === 0) return B(this, 0, t);
          return w.apply(this, arguments);
        };
        f.prototype.equals = function e(t) {
          if (!f.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
          if (this === t) return true;
          return f.compare(this, t) === 0;
        };
        f.prototype.inspect = function e() {
          var r = "";
          var n = t.INSPECT_MAX_BYTES;
          if (this.length > 0) {
            r = this.toString("hex", 0, n).match(/.{2}/g).join(" ");
            if (this.length > n) r += " ... ";
          }
          return "<Buffer " + r + ">";
        };
        f.prototype.compare = function e(t, r, n, i, o) {
          if (!f.isBuffer(t)) {
            throw new TypeError("Argument must be a Buffer");
          }
          if (r === undefined) {
            r = 0;
          }
          if (n === undefined) {
            n = t ? t.length : 0;
          }
          if (i === undefined) {
            i = 0;
          }
          if (o === undefined) {
            o = this.length;
          }
          if (r < 0 || n > t.length || i < 0 || o > this.length) {
            throw new RangeError("out of range index");
          }
          if (i >= o && r >= n) {
            return 0;
          }
          if (i >= o) {
            return -1;
          }
          if (r >= n) {
            return 1;
          }
          r >>>= 0;
          n >>>= 0;
          i >>>= 0;
          o >>>= 0;
          if (this === t) return 0;
          var s = o - i;
          var u = n - r;
          var a = Math.min(s, u);
          var l = this.slice(i, o);
          var h = t.slice(r, n);
          for (var c = 0; c < a; ++c) {
            if (l[c] !== h[c]) {
              s = l[c];
              u = h[c];
              break;
            }
          }
          if (s < u) return -1;
          if (u < s) return 1;
          return 0;
        };
        function A(e, t, r, n, i) {
          if (e.length === 0) return -1;
          if (typeof r === "string") {
            n = r;
            r = 0;
          } else if (r > 2147483647) {
            r = 2147483647;
          } else if (r < -2147483648) {
            r = -2147483648;
          }
          r = +r;
          if (isNaN(r)) {
            r = i ? 0 : e.length - 1;
          }
          if (r < 0) r = e.length + r;
          if (r >= e.length) {
            if (i) return -1;
            else r = e.length - 1;
          } else if (r < 0) {
            if (i) r = 0;
            else return -1;
          }
          if (typeof t === "string") {
            t = f.from(t, n);
          }
          if (f.isBuffer(t)) {
            if (t.length === 0) {
              return -1;
            }
            return O(e, t, r, n, i);
          } else if (typeof t === "number") {
            t = t & 255;
            if (
              f.TYPED_ARRAY_SUPPORT &&
              typeof Uint8Array.prototype.indexOf === "function"
            ) {
              if (i) {
                return Uint8Array.prototype.indexOf.call(e, t, r);
              } else {
                return Uint8Array.prototype.lastIndexOf.call(e, t, r);
              }
            }
            return O(e, [t], r, n, i);
          }
          throw new TypeError("val must be string, number or Buffer");
        }
        function O(e, t, r, n, i) {
          var o = 1;
          var s = e.length;
          var u = t.length;
          if (n !== undefined) {
            n = String(n).toLowerCase();
            if (
              n === "ucs2" ||
              n === "ucs-2" ||
              n === "utf16le" ||
              n === "utf-16le"
            ) {
              if (e.length < 2 || t.length < 2) {
                return -1;
              }
              o = 2;
              s /= 2;
              u /= 2;
              r /= 2;
            }
          }
          function a(e, t) {
            if (o === 1) {
              return e[t];
            } else {
              return e.readUInt16BE(t * o);
            }
          }
          var f;
          if (i) {
            var l = -1;
            for (f = r; f < s; f++) {
              if (a(e, f) === a(t, l === -1 ? 0 : f - l)) {
                if (l === -1) l = f;
                if (f - l + 1 === u) return l * o;
              } else {
                if (l !== -1) f -= f - l;
                l = -1;
              }
            }
          } else {
            if (r + u > s) r = s - u;
            for (f = r; f >= 0; f--) {
              var h = true;
              for (var c = 0; c < u; c++) {
                if (a(e, f + c) !== a(t, c)) {
                  h = false;
                  break;
                }
              }
              if (h) return f;
            }
          }
          return -1;
        }
        f.prototype.includes = function e(t, r, n) {
          return this.indexOf(t, r, n) !== -1;
        };
        f.prototype.indexOf = function e(t, r, n) {
          return A(this, t, r, n, true);
        };
        f.prototype.lastIndexOf = function e(t, r, n) {
          return A(this, t, r, n, false);
        };
        function S(e, t, r, n) {
          r = Number(r) || 0;
          var i = e.length - r;
          if (!n) {
            n = i;
          } else {
            n = Number(n);
            if (n > i) {
              n = i;
            }
          }
          var o = t.length;
          if (o % 2 !== 0) throw new TypeError("Invalid hex string");
          if (n > o / 2) {
            n = o / 2;
          }
          for (var s = 0; s < n; ++s) {
            var u = parseInt(t.substr(s * 2, 2), 16);
            if (isNaN(u)) return s;
            e[r + s] = u;
          }
          return s;
        }
        function R(e, t, r, n) {
          return ee(X(t, e.length - r), e, r, n);
        }
        function j(e, t, r, n) {
          return ee(Z(t), e, r, n);
        }
        function T(e, t, r, n) {
          return j(e, t, r, n);
        }
        function M(e, t, r, n) {
          return ee(Q(t), e, r, n);
        }
        function x(e, t, r, n) {
          return ee(K(t, e.length - r), e, r, n);
        }
        f.prototype.write = function e(t, r, n, i) {
          if (r === undefined) {
            i = "utf8";
            n = this.length;
            r = 0;
          } else if (n === undefined && typeof r === "string") {
            i = r;
            n = this.length;
            r = 0;
          } else if (isFinite(r)) {
            r = r | 0;
            if (isFinite(n)) {
              n = n | 0;
              if (i === undefined) i = "utf8";
            } else {
              i = n;
              n = undefined;
            }
          } else {
            throw new Error(
              "Buffer.write(string, encoding, offset[, length]) is no longer supported"
            );
          }
          var o = this.length - r;
          if (n === undefined || n > o) n = o;
          if ((t.length > 0 && (n < 0 || r < 0)) || r > this.length) {
            throw new RangeError("Attempt to write outside buffer bounds");
          }
          if (!i) i = "utf8";
          var s = false;
          for (;;) {
            switch (i) {
              case "hex":
                return S(this, t, r, n);
              case "utf8":
              case "utf-8":
                return R(this, t, r, n);
              case "ascii":
                return j(this, t, r, n);
              case "latin1":
              case "binary":
                return T(this, t, r, n);
              case "base64":
                return M(this, t, r, n);
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return x(this, t, r, n);
              default:
                if (s) throw new TypeError("Unknown encoding: " + i);
                i = ("" + i).toLowerCase();
                s = true;
            }
          }
        };
        f.prototype.toJSON = function e() {
          return {
            type: "Buffer",
            data: Array.prototype.slice.call(this._arr || this, 0),
          };
        };
        function P(e, t, r) {
          if (t === 0 && r === e.length) {
            return n.fromByteArray(e);
          } else {
            return n.fromByteArray(e.slice(t, r));
          }
        }
        function B(e, t, r) {
          r = Math.min(e.length, r);
          var n = [];
          var i = t;
          while (i < r) {
            var o = e[i];
            var s = null;
            var u = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
            if (i + u <= r) {
              var a, f, l, h;
              switch (u) {
                case 1:
                  if (o < 128) {
                    s = o;
                  }
                  break;
                case 2:
                  a = e[i + 1];
                  if ((a & 192) === 128) {
                    h = ((o & 31) << 6) | (a & 63);
                    if (h > 127) {
                      s = h;
                    }
                  }
                  break;
                case 3:
                  a = e[i + 1];
                  f = e[i + 2];
                  if ((a & 192) === 128 && (f & 192) === 128) {
                    h = ((o & 15) << 12) | ((a & 63) << 6) | (f & 63);
                    if (h > 2047 && (h < 55296 || h > 57343)) {
                      s = h;
                    }
                  }
                  break;
                case 4:
                  a = e[i + 1];
                  f = e[i + 2];
                  l = e[i + 3];
                  if (
                    (a & 192) === 128 &&
                    (f & 192) === 128 &&
                    (l & 192) === 128
                  ) {
                    h =
                      ((o & 15) << 18) |
                      ((a & 63) << 12) |
                      ((f & 63) << 6) |
                      (l & 63);
                    if (h > 65535 && h < 1114112) {
                      s = h;
                    }
                  }
              }
            }
            if (s === null) {
              s = 65533;
              u = 1;
            } else if (s > 65535) {
              s -= 65536;
              n.push(((s >>> 10) & 1023) | 55296);
              s = 56320 | (s & 1023);
            }
            n.push(s);
            i += u;
          }
          return U(n);
        }
        var C = 4096;
        function U(e) {
          var t = e.length;
          if (t <= C) {
            return String.fromCharCode.apply(String, e);
          }
          var r = "";
          var n = 0;
          while (n < t) {
            r += String.fromCharCode.apply(String, e.slice(n, (n += C)));
          }
          return r;
        }
        function I(e, t, r) {
          var n = "";
          r = Math.min(e.length, r);
          for (var i = t; i < r; ++i) {
            n += String.fromCharCode(e[i] & 127);
          }
          return n;
        }
        function k(e, t, r) {
          var n = "";
          r = Math.min(e.length, r);
          for (var i = t; i < r; ++i) {
            n += String.fromCharCode(e[i]);
          }
          return n;
        }
        function D(e, t, r) {
          var n = e.length;
          if (!t || t < 0) t = 0;
          if (!r || r < 0 || r > n) r = n;
          var i = "";
          for (var o = t; o < r; ++o) {
            i += $(e[o]);
          }
          return i;
        }
        function Y(e, t, r) {
          var n = e.slice(t, r);
          var i = "";
          for (var o = 0; o < n.length; o += 2) {
            i += String.fromCharCode(n[o] + n[o + 1] * 256);
          }
          return i;
        }
        f.prototype.slice = function e(t, r) {
          var n = this.length;
          t = ~~t;
          r = r === undefined ? n : ~~r;
          if (t < 0) {
            t += n;
            if (t < 0) t = 0;
          } else if (t > n) {
            t = n;
          }
          if (r < 0) {
            r += n;
            if (r < 0) r = 0;
          } else if (r > n) {
            r = n;
          }
          if (r < t) r = t;
          var i;
          if (f.TYPED_ARRAY_SUPPORT) {
            i = this.subarray(t, r);
            i.__proto__ = f.prototype;
          } else {
            var o = r - t;
            i = new f(o, undefined);
            for (var s = 0; s < o; ++s) {
              i[s] = this[s + t];
            }
          }
          return i;
        };
        function L(e, t, r) {
          if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
          if (e + t > r)
            throw new RangeError("Trying to access beyond buffer length");
        }
        f.prototype.readUIntLE = function e(t, r, n) {
          t = t | 0;
          r = r | 0;
          if (!n) L(t, r, this.length);
          var i = this[t];
          var o = 1;
          var s = 0;
          while (++s < r && (o *= 256)) {
            i += this[t + s] * o;
          }
          return i;
        };
        f.prototype.readUIntBE = function e(t, r, n) {
          t = t | 0;
          r = r | 0;
          if (!n) {
            L(t, r, this.length);
          }
          var i = this[t + --r];
          var o = 1;
          while (r > 0 && (o *= 256)) {
            i += this[t + --r] * o;
          }
          return i;
        };
        f.prototype.readUInt8 = function e(t, r) {
          if (!r) L(t, 1, this.length);
          return this[t];
        };
        f.prototype.readUInt16LE = function e(t, r) {
          if (!r) L(t, 2, this.length);
          return this[t] | (this[t + 1] << 8);
        };
        f.prototype.readUInt16BE = function e(t, r) {
          if (!r) L(t, 2, this.length);
          return (this[t] << 8) | this[t + 1];
        };
        f.prototype.readUInt32LE = function e(t, r) {
          if (!r) L(t, 4, this.length);
          return (
            (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
            this[t + 3] * 16777216
          );
        };
        f.prototype.readUInt32BE = function e(t, r) {
          if (!r) L(t, 4, this.length);
          return (
            this[t] * 16777216 +
            ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
          );
        };
        f.prototype.readIntLE = function e(t, r, n) {
          t = t | 0;
          r = r | 0;
          if (!n) L(t, r, this.length);
          var i = this[t];
          var o = 1;
          var s = 0;
          while (++s < r && (o *= 256)) {
            i += this[t + s] * o;
          }
          o *= 128;
          if (i >= o) i -= Math.pow(2, 8 * r);
          return i;
        };
        f.prototype.readIntBE = function e(t, r, n) {
          t = t | 0;
          r = r | 0;
          if (!n) L(t, r, this.length);
          var i = r;
          var o = 1;
          var s = this[t + --i];
          while (i > 0 && (o *= 256)) {
            s += this[t + --i] * o;
          }
          o *= 128;
          if (s >= o) s -= Math.pow(2, 8 * r);
          return s;
        };
        f.prototype.readInt8 = function e(t, r) {
          if (!r) L(t, 1, this.length);
          if (!(this[t] & 128)) return this[t];
          return (255 - this[t] + 1) * -1;
        };
        f.prototype.readInt16LE = function e(t, r) {
          if (!r) L(t, 2, this.length);
          var n = this[t] | (this[t + 1] << 8);
          return n & 32768 ? n | 4294901760 : n;
        };
        f.prototype.readInt16BE = function e(t, r) {
          if (!r) L(t, 2, this.length);
          var n = this[t + 1] | (this[t] << 8);
          return n & 32768 ? n | 4294901760 : n;
        };
        f.prototype.readInt32LE = function e(t, r) {
          if (!r) L(t, 4, this.length);
          return (
            this[t] |
            (this[t + 1] << 8) |
            (this[t + 2] << 16) |
            (this[t + 3] << 24)
          );
        };
        f.prototype.readInt32BE = function e(t, r) {
          if (!r) L(t, 4, this.length);
          return (
            (this[t] << 24) |
            (this[t + 1] << 16) |
            (this[t + 2] << 8) |
            this[t + 3]
          );
        };
        f.prototype.readFloatLE = function e(t, r) {
          if (!r) L(t, 4, this.length);
          return i.read(this, t, true, 23, 4);
        };
        f.prototype.readFloatBE = function e(t, r) {
          if (!r) L(t, 4, this.length);
          return i.read(this, t, false, 23, 4);
        };
        f.prototype.readDoubleLE = function e(t, r) {
          if (!r) L(t, 8, this.length);
          return i.read(this, t, true, 52, 8);
        };
        f.prototype.readDoubleBE = function e(t, r) {
          if (!r) L(t, 8, this.length);
          return i.read(this, t, false, 52, 8);
        };
        function N(e, t, r, n, i, o) {
          if (!f.isBuffer(e))
            throw new TypeError('"buffer" argument must be a Buffer instance');
          if (t > i || t < o)
            throw new RangeError('"value" argument is out of bounds');
          if (r + n > e.length) throw new RangeError("Index out of range");
        }
        f.prototype.writeUIntLE = function e(t, r, n, i) {
          t = +t;
          r = r | 0;
          n = n | 0;
          if (!i) {
            var o = Math.pow(2, 8 * n) - 1;
            N(this, t, r, n, o, 0);
          }
          var s = 1;
          var u = 0;
          this[r] = t & 255;
          while (++u < n && (s *= 256)) {
            this[r + u] = (t / s) & 255;
          }
          return r + n;
        };
        f.prototype.writeUIntBE = function e(t, r, n, i) {
          t = +t;
          r = r | 0;
          n = n | 0;
          if (!i) {
            var o = Math.pow(2, 8 * n) - 1;
            N(this, t, r, n, o, 0);
          }
          var s = n - 1;
          var u = 1;
          this[r + s] = t & 255;
          while (--s >= 0 && (u *= 256)) {
            this[r + s] = (t / u) & 255;
          }
          return r + n;
        };
        f.prototype.writeUInt8 = function e(t, r, n) {
          t = +t;
          r = r | 0;
          if (!n) N(this, t, r, 1, 255, 0);
          if (!f.TYPED_ARRAY_SUPPORT) t = Math.floor(t);
          this[r] = t & 255;
          return r + 1;
        };
        function z(e, t, r, n) {
          if (t < 0) t = 65535 + t + 1;
          for (var i = 0, o = Math.min(e.length - r, 2); i < o; ++i) {
            e[r + i] =
              (t & (255 << (8 * (n ? i : 1 - i)))) >>> ((n ? i : 1 - i) * 8);
          }
        }
        f.prototype.writeUInt16LE = function e(t, r, n) {
          t = +t;
          r = r | 0;
          if (!n) N(this, t, r, 2, 65535, 0);
          if (f.TYPED_ARRAY_SUPPORT) {
            this[r] = t & 255;
            this[r + 1] = t >>> 8;
          } else {
            z(this, t, r, true);
          }
          return r + 2;
        };
        f.prototype.writeUInt16BE = function e(t, r, n) {
          t = +t;
          r = r | 0;
          if (!n) N(this, t, r, 2, 65535, 0);
          if (f.TYPED_ARRAY_SUPPORT) {
            this[r] = t >>> 8;
            this[r + 1] = t & 255;
          } else {
            z(this, t, r, false);
          }
          return r + 2;
        };
        function F(e, t, r, n) {
          if (t < 0) t = 4294967295 + t + 1;
          for (var i = 0, o = Math.min(e.length - r, 4); i < o; ++i) {
            e[r + i] = (t >>> ((n ? i : 3 - i) * 8)) & 255;
          }
        }
        f.prototype.writeUInt32LE = function e(t, r, n) {
          t = +t;
          r = r | 0;
          if (!n) N(this, t, r, 4, 4294967295, 0);
          if (f.TYPED_ARRAY_SUPPORT) {
            this[r + 3] = t >>> 24;
            this[r + 2] = t >>> 16;
            this[r + 1] = t >>> 8;
            this[r] = t & 255;
          } else {
            F(this, t, r, true);
          }
          return r + 4;
        };
        f.prototype.writeUInt32BE = function e(t, r, n) {
          t = +t;
          r = r | 0;
          if (!n) N(this, t, r, 4, 4294967295, 0);
          if (f.TYPED_ARRAY_SUPPORT) {
            this[r] = t >>> 24;
            this[r + 1] = t >>> 16;
            this[r + 2] = t >>> 8;
            this[r + 3] = t & 255;
          } else {
            F(this, t, r, false);
          }
          return r + 4;
        };
        f.prototype.writeIntLE = function e(t, r, n, i) {
          t = +t;
          r = r | 0;
          if (!i) {
            var o = Math.pow(2, 8 * n - 1);
            N(this, t, r, n, o - 1, -o);
          }
          var s = 0;
          var u = 1;
          var a = 0;
          this[r] = t & 255;
          while (++s < n && (u *= 256)) {
            if (t < 0 && a === 0 && this[r + s - 1] !== 0) {
              a = 1;
            }
            this[r + s] = (((t / u) >> 0) - a) & 255;
          }
          return r + n;
        };
        f.prototype.writeIntBE = function e(t, r, n, i) {
          t = +t;
          r = r | 0;
          if (!i) {
            var o = Math.pow(2, 8 * n - 1);
            N(this, t, r, n, o - 1, -o);
          }
          var s = n - 1;
          var u = 1;
          var a = 0;
          this[r + s] = t & 255;
          while (--s >= 0 && (u *= 256)) {
            if (t < 0 && a === 0 && this[r + s + 1] !== 0) {
              a = 1;
            }
            this[r + s] = (((t / u) >> 0) - a) & 255;
          }
          return r + n;
        };
        f.prototype.writeInt8 = function e(t, r, n) {
          t = +t;
          r = r | 0;
          if (!n) N(this, t, r, 1, 127, -128);
          if (!f.TYPED_ARRAY_SUPPORT) t = Math.floor(t);
          if (t < 0) t = 255 + t + 1;
          this[r] = t & 255;
          return r + 1;
        };
        f.prototype.writeInt16LE = function e(t, r, n) {
          t = +t;
          r = r | 0;
          if (!n) N(this, t, r, 2, 32767, -32768);
          if (f.TYPED_ARRAY_SUPPORT) {
            this[r] = t & 255;
            this[r + 1] = t >>> 8;
          } else {
            z(this, t, r, true);
          }
          return r + 2;
        };
        f.prototype.writeInt16BE = function e(t, r, n) {
          t = +t;
          r = r | 0;
          if (!n) N(this, t, r, 2, 32767, -32768);
          if (f.TYPED_ARRAY_SUPPORT) {
            this[r] = t >>> 8;
            this[r + 1] = t & 255;
          } else {
            z(this, t, r, false);
          }
          return r + 2;
        };
        f.prototype.writeInt32LE = function e(t, r, n) {
          t = +t;
          r = r | 0;
          if (!n) N(this, t, r, 4, 2147483647, -2147483648);
          if (f.TYPED_ARRAY_SUPPORT) {
            this[r] = t & 255;
            this[r + 1] = t >>> 8;
            this[r + 2] = t >>> 16;
            this[r + 3] = t >>> 24;
          } else {
            F(this, t, r, true);
          }
          return r + 4;
        };
        f.prototype.writeInt32BE = function e(t, r, n) {
          t = +t;
          r = r | 0;
          if (!n) N(this, t, r, 4, 2147483647, -2147483648);
          if (t < 0) t = 4294967295 + t + 1;
          if (f.TYPED_ARRAY_SUPPORT) {
            this[r] = t >>> 24;
            this[r + 1] = t >>> 16;
            this[r + 2] = t >>> 8;
            this[r + 3] = t & 255;
          } else {
            F(this, t, r, false);
          }
          return r + 4;
        };
        function J(e, t, r, n, i, o) {
          if (r + n > e.length) throw new RangeError("Index out of range");
          if (r < 0) throw new RangeError("Index out of range");
        }
        function G(e, t, r, n, o) {
          if (!o) {
            J(e, t, r, 4, 34028234663852886e22, -34028234663852886e22);
          }
          i.write(e, t, r, n, 23, 4);
          return r + 4;
        }
        f.prototype.writeFloatLE = function e(t, r, n) {
          return G(this, t, r, true, n);
        };
        f.prototype.writeFloatBE = function e(t, r, n) {
          return G(this, t, r, false, n);
        };
        function q(e, t, r, n, o) {
          if (!o) {
            J(e, t, r, 8, 17976931348623157e292, -17976931348623157e292);
          }
          i.write(e, t, r, n, 52, 8);
          return r + 8;
        }
        f.prototype.writeDoubleLE = function e(t, r, n) {
          return q(this, t, r, true, n);
        };
        f.prototype.writeDoubleBE = function e(t, r, n) {
          return q(this, t, r, false, n);
        };
        f.prototype.copy = function e(t, r, n, i) {
          if (!n) n = 0;
          if (!i && i !== 0) i = this.length;
          if (r >= t.length) r = t.length;
          if (!r) r = 0;
          if (i > 0 && i < n) i = n;
          if (i === n) return 0;
          if (t.length === 0 || this.length === 0) return 0;
          if (r < 0) {
            throw new RangeError("targetStart out of bounds");
          }
          if (n < 0 || n >= this.length)
            throw new RangeError("sourceStart out of bounds");
          if (i < 0) throw new RangeError("sourceEnd out of bounds");
          if (i > this.length) i = this.length;
          if (t.length - r < i - n) {
            i = t.length - r + n;
          }
          var o = i - n;
          var s;
          if (this === t && n < r && r < i) {
            for (s = o - 1; s >= 0; --s) {
              t[s + r] = this[s + n];
            }
          } else if (o < 1e3 || !f.TYPED_ARRAY_SUPPORT) {
            for (s = 0; s < o; ++s) {
              t[s + r] = this[s + n];
            }
          } else {
            Uint8Array.prototype.set.call(t, this.subarray(n, n + o), r);
          }
          return o;
        };
        f.prototype.fill = function e(t, r, n, i) {
          if (typeof t === "string") {
            if (typeof r === "string") {
              i = r;
              r = 0;
              n = this.length;
            } else if (typeof n === "string") {
              i = n;
              n = this.length;
            }
            if (t.length === 1) {
              var o = t.charCodeAt(0);
              if (o < 256) {
                t = o;
              }
            }
            if (i !== undefined && typeof i !== "string") {
              throw new TypeError("encoding must be a string");
            }
            if (typeof i === "string" && !f.isEncoding(i)) {
              throw new TypeError("Unknown encoding: " + i);
            }
          } else if (typeof t === "number") {
            t = t & 255;
          }
          if (r < 0 || this.length < r || this.length < n) {
            throw new RangeError("Out of range index");
          }
          if (n <= r) {
            return this;
          }
          r = r >>> 0;
          n = n === undefined ? this.length : n >>> 0;
          if (!t) t = 0;
          var s;
          if (typeof t === "number") {
            for (s = r; s < n; ++s) {
              this[s] = t;
            }
          } else {
            var u = f.isBuffer(t) ? t : X(new f(t, i).toString());
            var a = u.length;
            for (s = 0; s < n - r; ++s) {
              this[s + r] = u[s % a];
            }
          }
          return this;
        };
        var V = /[^+\/0-9A-Za-z-_]/g;
        function W(e) {
          e = H(e).replace(V, "");
          if (e.length < 2) return "";
          while (e.length % 4 !== 0) {
            e = e + "=";
          }
          return e;
        }
        function H(e) {
          if (e.trim) return e.trim();
          return e.replace(/^\s+|\s+$/g, "");
        }
        function $(e) {
          if (e < 16) return "0" + e.toString(16);
          return e.toString(16);
        }
        function X(e, t) {
          t = t || Infinity;
          var r;
          var n = e.length;
          var i = null;
          var o = [];
          for (var s = 0; s < n; ++s) {
            r = e.charCodeAt(s);
            if (r > 55295 && r < 57344) {
              if (!i) {
                if (r > 56319) {
                  if ((t -= 3) > -1) o.push(239, 191, 189);
                  continue;
                } else if (s + 1 === n) {
                  if ((t -= 3) > -1) o.push(239, 191, 189);
                  continue;
                }
                i = r;
                continue;
              }
              if (r < 56320) {
                if ((t -= 3) > -1) o.push(239, 191, 189);
                i = r;
                continue;
              }
              r = (((i - 55296) << 10) | (r - 56320)) + 65536;
            } else if (i) {
              if ((t -= 3) > -1) o.push(239, 191, 189);
            }
            i = null;
            if (r < 128) {
              if ((t -= 1) < 0) break;
              o.push(r);
            } else if (r < 2048) {
              if ((t -= 2) < 0) break;
              o.push((r >> 6) | 192, (r & 63) | 128);
            } else if (r < 65536) {
              if ((t -= 3) < 0) break;
              o.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (r & 63) | 128);
            } else if (r < 1114112) {
              if ((t -= 4) < 0) break;
              o.push(
                (r >> 18) | 240,
                ((r >> 12) & 63) | 128,
                ((r >> 6) & 63) | 128,
                (r & 63) | 128
              );
            } else {
              throw new Error("Invalid code point");
            }
          }
          return o;
        }
        function Z(e) {
          var t = [];
          for (var r = 0; r < e.length; ++r) {
            t.push(e.charCodeAt(r) & 255);
          }
          return t;
        }
        function K(e, t) {
          var r, n, i;
          var o = [];
          for (var s = 0; s < e.length; ++s) {
            if ((t -= 2) < 0) break;
            r = e.charCodeAt(s);
            n = r >> 8;
            i = r % 256;
            o.push(i);
            o.push(n);
          }
          return o;
        }
        function Q(e) {
          return n.toByteArray(W(e));
        }
        function ee(e, t, r, n) {
          for (var i = 0; i < n; ++i) {
            if (i + r >= t.length || i >= e.length) break;
            t[i + r] = e[i];
          }
          return i;
        }
        function te(e) {
          return e !== e;
        }
      }.call(this, r("./node_modules/webpack/buildin/global.js")));
    },
    "./node_modules/get-node-dimensions/lib/get-clone-dimensions.js": function (
      e,
      t,
      r
    ) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
      t["default"] = s;
      function n(e) {
        return e && e.__esModule ? e : { default: e };
      }
      var i = r("./node_modules/get-node-dimensions/lib/get-margin.js");
      var o = n(i);
      function s(e, t) {
        var r = e.parentNode;
        var n = document.createElement("div");
        var i = e.cloneNode(true);
        var s = getComputedStyle(e);
        var u = undefined,
          a = undefined,
          f = undefined,
          l = undefined;
        n.style.height = 0;
        n.style.overflow = "hidden";
        i.setAttribute("id", "");
        i.setAttribute("name", "");
        if (t.display || s.getPropertyValue("display") === "none") {
          i.style.display = t.display || "block";
        }
        if (t.width || !parseInt(s.getPropertyValue("width"))) {
          i.style.width = t.width || "auto";
        }
        if (t.height || !parseInt(s.getPropertyValue("height"))) {
          i.style.height = t.height || "auto";
        }
        n.appendChild(i);
        r.appendChild(n);
        u = i.getBoundingClientRect();
        a = i.offsetWidth;
        f = i.offsetHeight;
        r.removeChild(n);
        return {
          rect: {
            width: a,
            height: f,
            top: u.top,
            right: u.right,
            bottom: u.bottom,
            left: u.left,
          },
          margin: (0, o["default"])(s),
        };
      }
      e.exports = t["default"];
    },
    "./node_modules/get-node-dimensions/lib/get-margin.js": function (e, t, r) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
      t["default"] = i;
      var n = function e(t) {
        return parseInt(t) || 0;
      };
      function i(e) {
        return {
          top: n(e.marginTop),
          right: n(e.marginRight),
          bottom: n(e.marginBottom),
          left: n(e.marginLeft),
        };
      }
      e.exports = t["default"];
    },
    "./node_modules/get-node-dimensions/lib/get-node-dimensions.js": function (
      e,
      t,
      r
    ) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
      t["default"] = a;
      function n(e) {
        return e && e.__esModule ? e : { default: e };
      }
      var i = r(
        "./node_modules/get-node-dimensions/lib/get-clone-dimensions.js"
      );
      var o = n(i);
      var s = r("./node_modules/get-node-dimensions/lib/get-margin.js");
      var u = n(s);
      function a(e) {
        var t =
          arguments.length <= 1 || arguments[1] === undefined
            ? {}
            : arguments[1];
        var r = e.getBoundingClientRect();
        var n = undefined,
          i = undefined,
          s = undefined;
        if (!r.width || !r.height || t.clone) {
          var a = (0, o["default"])(e, t);
          r = a.rect;
          s = a.margin;
        } else if (t.margin) {
          s = (0, u["default"])(getComputedStyle(e));
        }
        if (t.margin) {
          n = s.left + r.width + s.right;
          i = s.top + r.height + s.bottom;
        } else {
          n = r.width;
          i = r.height;
        }
        return {
          width: n,
          height: i,
          top: r.top,
          right: r.right,
          bottom: r.bottom,
          left: r.left,
        };
      }
      e.exports = t["default"];
    },
    "./node_modules/global/document.js": function (e, t, r) {
      (function (t) {
        var n =
          typeof t !== "undefined"
            ? t
            : typeof window !== "undefined"
            ? window
            : {};
        var i = r(57);
        var o;
        if (typeof document !== "undefined") {
          o = document;
        } else {
          o = n["__GLOBAL_DOCUMENT_CACHE@4"];
          if (!o) {
            o = n["__GLOBAL_DOCUMENT_CACHE@4"] = i;
          }
        }
        e.exports = o;
      }.call(this, r("./node_modules/webpack/buildin/global.js")));
    },
    "./node_modules/global/window.js": function (e, t, r) {
      (function (t) {
        var r;
        if (typeof window !== "undefined") {
          r = window;
        } else if (typeof t !== "undefined") {
          r = t;
        } else if (typeof self !== "undefined") {
          r = self;
        } else {
          r = {};
        }
        e.exports = r;
      }.call(this, r("./node_modules/webpack/buildin/global.js")));
    },
    "./node_modules/ieee754/index.js": function (e, t) {
      t.read = function (e, t, r, n, i) {
        var o, s;
        var u = i * 8 - n - 1;
        var a = (1 << u) - 1;
        var f = a >> 1;
        var l = -7;
        var h = r ? i - 1 : 0;
        var c = r ? -1 : 1;
        var d = e[t + h];
        h += c;
        o = d & ((1 << -l) - 1);
        d >>= -l;
        l += u;
        for (; l > 0; o = o * 256 + e[t + h], h += c, l -= 8) {}
        s = o & ((1 << -l) - 1);
        o >>= -l;
        l += n;
        for (; l > 0; s = s * 256 + e[t + h], h += c, l -= 8) {}
        if (o === 0) {
          o = 1 - f;
        } else if (o === a) {
          return s ? NaN : (d ? -1 : 1) * Infinity;
        } else {
          s = s + Math.pow(2, n);
          o = o - f;
        }
        return (d ? -1 : 1) * s * Math.pow(2, o - n);
      };
      t.write = function (e, t, r, n, i, o) {
        var s, u, a;
        var f = o * 8 - i - 1;
        var l = (1 << f) - 1;
        var h = l >> 1;
        var c = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var d = n ? 0 : o - 1;
        var p = n ? 1 : -1;
        var v = t < 0 || (t === 0 && 1 / t < 0) ? 1 : 0;
        t = Math.abs(t);
        if (isNaN(t) || t === Infinity) {
          u = isNaN(t) ? 1 : 0;
          s = l;
        } else {
          s = Math.floor(Math.log(t) / Math.LN2);
          if (t * (a = Math.pow(2, -s)) < 1) {
            s--;
            a *= 2;
          }
          if (s + h >= 1) {
            t += c / a;
          } else {
            t += c * Math.pow(2, 1 - h);
          }
          if (t * a >= 2) {
            s++;
            a /= 2;
          }
          if (s + h >= l) {
            u = 0;
            s = l;
          } else if (s + h >= 1) {
            u = (t * a - 1) * Math.pow(2, i);
            s = s + h;
          } else {
            u = t * Math.pow(2, h - 1) * Math.pow(2, i);
            s = 0;
          }
        }
        for (; i >= 8; e[r + d] = u & 255, d += p, u /= 256, i -= 8) {}
        s = (s << i) | u;
        f += i;
        for (; f > 0; e[r + d] = s & 255, d += p, s /= 256, f -= 8) {}
        e[r + d - p] |= v * 128;
      };
    },
    "./node_modules/isarray/index.js": function (e, t) {
      var r = {}.toString;
      e.exports =
        Array.isArray ||
        function (e) {
          return r.call(e) == "[object Array]";
        };
    },
    "./node_modules/react-measure/lib/Measure.js": function (e, t, r) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
      var n =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) {
              if (Object.prototype.hasOwnProperty.call(r, n)) {
                e[n] = r[n];
              }
            }
          }
          return e;
        };
      var i = (function () {
        function e(e, t) {
          for (var r = 0; r < t.length; r++) {
            var n = t[r];
            n.enumerable = n.enumerable || false;
            n.configurable = true;
            if ("value" in n) n.writable = true;
            Object.defineProperty(e, n.key, n);
          }
        }
        return function (t, r, n) {
          if (r) e(t.prototype, r);
          if (n) e(t, n);
          return t;
        };
      })();
      var o = r("./node_modules/react/index.js");
      var s = v(o);
      var u = r("./node_modules/prop-types/index.js");
      var a = v(u);
      var f = r("./node_modules/react-dom/index.js");
      var l = v(f);
      var h = r(
        "./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js"
      );
      var c = v(h);
      var d = r(
        "./node_modules/get-node-dimensions/lib/get-node-dimensions.js"
      );
      var p = v(d);
      function v(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function g(e, t) {
        if (!(e instanceof t)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function y(e, t) {
        if (!e) {
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          );
        }
        return t && (typeof t === "object" || typeof t === "function") ? t : e;
      }
      function _(e, t) {
        if (typeof t !== "function" && t !== null) {
          throw new TypeError(
            "Super expression must either be null or a function, not " +
              typeof t
          );
        }
        e.prototype = Object.create(t && t.prototype, {
          constructor: {
            value: e,
            enumerable: false,
            writable: true,
            configurable: true,
          },
        });
        if (t)
          Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t);
      }
      var m = (function (e) {
        _(t, e);
        function t(e) {
          g(this, t);
          var r = y(
            this,
            (t.__proto__ || Object.getPrototypeOf(t)).call(this, e)
          );
          r.measure = function () {
            var e =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : r.props.includeMargin;
            var t =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : r.props.useClone;
            if (!r.props.shouldMeasure) return;
            if (!r._node.parentNode) {
              r._setDOMNode();
            }
            var n = r.getDimensions(r._node, e, t);
            var i = typeof r.props.children === "function";
            r._propsToMeasure.some(function (e) {
              if (n[e] !== r._lastDimensions[e]) {
                r.props.onMeasure(n);
                if (i && typeof r !== "undefined") {
                  r.setState({ dimensions: n });
                }
                r._lastDimensions = n;
                return true;
              }
            });
          };
          r.state = {
            dimensions: {
              width: 0,
              height: 0,
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          };
          r._node = null;
          r._propsToMeasure = r._getPropsToMeasure(e);
          r._lastDimensions = {};
          return r;
        }
        i(t, [
          {
            key: "componentDidMount",
            value: function e() {
              var t = this;
              this._setDOMNode();
              this.measure();
              this.resizeObserver = new c.default(function () {
                return t.measure();
              });
              this.resizeObserver.observe(this._node);
            },
          },
          {
            key: "componentWillReceiveProps",
            value: function e(t) {
              var r = t.config,
                n = t.whitelist,
                i = t.blacklist;
              if (this.props.whitelist !== n || this.props.blacklist !== i) {
                this._propsToMeasure = this._getPropsToMeasure({
                  whitelist: n,
                  blacklist: i,
                });
              }
            },
          },
          {
            key: "componentWillUnmount",
            value: function e() {
              this.resizeObserver.disconnect(this._node);
              this._node = null;
            },
          },
          {
            key: "_setDOMNode",
            value: function e() {
              this._node = l.default.findDOMNode(this);
            },
          },
          {
            key: "getDimensions",
            value: function e() {
              var t =
                arguments.length > 0 && arguments[0] !== undefined
                  ? arguments[0]
                  : this._node;
              var r =
                arguments.length > 1 && arguments[1] !== undefined
                  ? arguments[1]
                  : this.props.includeMargin;
              var i =
                arguments.length > 2 && arguments[2] !== undefined
                  ? arguments[2]
                  : this.props.useClone;
              var o =
                arguments.length > 3 && arguments[3] !== undefined
                  ? arguments[3]
                  : this.props.cloneOptions;
              return (0, p.default)(t, n({ margin: r, clone: i }, o));
            },
          },
          {
            key: "_getPropsToMeasure",
            value: function e(t) {
              var r = t.whitelist,
                n = t.blacklist;
              return r.filter(function (e) {
                return n.indexOf(e) < 0;
              });
            },
          },
          {
            key: "render",
            value: function e() {
              var t = this.props.children;
              return o.Children.only(
                typeof t === "function" ? t(this.state.dimensions) : t
              );
            },
          },
        ]);
        return t;
      })(o.Component);
      m.propTypes = {
        whitelist: a.default.array,
        blacklist: a.default.array,
        includeMargin: a.default.bool,
        useClone: a.default.bool,
        cloneOptions: a.default.object,
        shouldMeasure: a.default.bool,
        onMeasure: a.default.func,
      };
      m.defaultProps = {
        whitelist: ["width", "height", "top", "right", "bottom", "left"],
        blacklist: [],
        includeMargin: true,
        useClone: false,
        cloneOptions: {},
        shouldMeasure: true,
        onMeasure: function e() {
          return null;
        },
      };
      t.default = m;
      e.exports = t["default"];
    },
    "./node_modules/react-measure/lib/react-measure.js": function (e, t, r) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
      t.default = undefined;
      var n = r("./node_modules/react-measure/lib/Measure.js");
      var i = o(n);
      function o(e) {
        return e && e.__esModule ? e : { default: e };
      }
      t.default = i.default;
      e.exports = t["default"];
    },
    "./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js":
      function (e, t, r) {
        "use strict";
        r.r(t);
        (function (e) {
          var r = (function () {
            if (typeof Map !== "undefined") {
              return Map;
            }
            function e(e, t) {
              var r = -1;
              e.some(function (e, n) {
                if (e[0] === t) {
                  r = n;
                  return true;
                }
                return false;
              });
              return r;
            }
            return (function () {
              function t() {
                this.__entries__ = [];
              }
              var r = { size: { configurable: true } };
              r.size.get = function () {
                return this.__entries__.length;
              };
              t.prototype.get = function (t) {
                var r = e(this.__entries__, t);
                var n = this.__entries__[r];
                return n && n[1];
              };
              t.prototype.set = function (t, r) {
                var n = e(this.__entries__, t);
                if (~n) {
                  this.__entries__[n][1] = r;
                } else {
                  this.__entries__.push([t, r]);
                }
              };
              t.prototype.delete = function (t) {
                var r = this.__entries__;
                var n = e(r, t);
                if (~n) {
                  r.splice(n, 1);
                }
              };
              t.prototype.has = function (t) {
                return !!~e(this.__entries__, t);
              };
              t.prototype.clear = function () {
                this.__entries__.splice(0);
              };
              t.prototype.forEach = function (e, t) {
                var r = this;
                if (t === void 0) t = null;
                for (var n = 0, i = r.__entries__; n < i.length; n += 1) {
                  var o = i[n];
                  e.call(t, o[1], o[0]);
                }
              };
              Object.defineProperties(t.prototype, r);
              return t;
            })();
          })();
          var n =
            typeof window !== "undefined" &&
            typeof document !== "undefined" &&
            window.document === document;
          var i = (function () {
            if (typeof e !== "undefined" && e.Math === Math) {
              return e;
            }
            if (typeof self !== "undefined" && self.Math === Math) {
              return self;
            }
            if (typeof window !== "undefined" && window.Math === Math) {
              return window;
            }
            return Function("return this")();
          })();
          var o = (function () {
            if (typeof requestAnimationFrame === "function") {
              return requestAnimationFrame.bind(i);
            }
            return function (e) {
              return setTimeout(function () {
                return e(Date.now());
              }, 1e3 / 60);
            };
          })();
          var s = 2;
          var u = function (e, t) {
            var r = false,
              n = false,
              i = 0;
            function u() {
              if (r) {
                r = false;
                e();
              }
              if (n) {
                f();
              }
            }
            function a() {
              o(u);
            }
            function f() {
              var e = Date.now();
              if (r) {
                if (e - i < s) {
                  return;
                }
                n = true;
              } else {
                r = true;
                n = false;
                setTimeout(a, t);
              }
              i = e;
            }
            return f;
          };
          var a = 20;
          var f = [
            "top",
            "right",
            "bottom",
            "left",
            "width",
            "height",
            "size",
            "weight",
          ];
          var l = typeof MutationObserver !== "undefined";
          var h = function () {
            this.connected_ = false;
            this.mutationEventsAdded_ = false;
            this.mutationsObserver_ = null;
            this.observers_ = [];
            this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
            this.refresh = u(this.refresh.bind(this), a);
          };
          h.prototype.addObserver = function (e) {
            if (!~this.observers_.indexOf(e)) {
              this.observers_.push(e);
            }
            if (!this.connected_) {
              this.connect_();
            }
          };
          h.prototype.removeObserver = function (e) {
            var t = this.observers_;
            var r = t.indexOf(e);
            if (~r) {
              t.splice(r, 1);
            }
            if (!t.length && this.connected_) {
              this.disconnect_();
            }
          };
          h.prototype.refresh = function () {
            var e = this.updateObservers_();
            if (e) {
              this.refresh();
            }
          };
          h.prototype.updateObservers_ = function () {
            var e = this.observers_.filter(function (e) {
              return e.gatherActive(), e.hasActive();
            });
            e.forEach(function (e) {
              return e.broadcastActive();
            });
            return e.length > 0;
          };
          h.prototype.connect_ = function () {
            if (!n || this.connected_) {
              return;
            }
            document.addEventListener("transitionend", this.onTransitionEnd_);
            window.addEventListener("resize", this.refresh);
            if (l) {
              this.mutationsObserver_ = new MutationObserver(this.refresh);
              this.mutationsObserver_.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true,
              });
            } else {
              document.addEventListener("DOMSubtreeModified", this.refresh);
              this.mutationEventsAdded_ = true;
            }
            this.connected_ = true;
          };
          h.prototype.disconnect_ = function () {
            if (!n || !this.connected_) {
              return;
            }
            document.removeEventListener(
              "transitionend",
              this.onTransitionEnd_
            );
            window.removeEventListener("resize", this.refresh);
            if (this.mutationsObserver_) {
              this.mutationsObserver_.disconnect();
            }
            if (this.mutationEventsAdded_) {
              document.removeEventListener("DOMSubtreeModified", this.refresh);
            }
            this.mutationsObserver_ = null;
            this.mutationEventsAdded_ = false;
            this.connected_ = false;
          };
          h.prototype.onTransitionEnd_ = function (e) {
            var t = e.propertyName;
            if (t === void 0) t = "";
            var r = f.some(function (e) {
              return !!~t.indexOf(e);
            });
            if (r) {
              this.refresh();
            }
          };
          h.getInstance = function () {
            if (!this.instance_) {
              this.instance_ = new h();
            }
            return this.instance_;
          };
          h.instance_ = null;
          var c = function (e, t) {
            for (var r = 0, n = Object.keys(t); r < n.length; r += 1) {
              var i = n[r];
              Object.defineProperty(e, i, {
                value: t[i],
                enumerable: false,
                writable: false,
                configurable: true,
              });
            }
            return e;
          };
          var d = function (e) {
            var t = e && e.ownerDocument && e.ownerDocument.defaultView;
            return t || i;
          };
          var p = O(0, 0, 0, 0);
          function v(e) {
            return parseFloat(e) || 0;
          }
          function g(e) {
            var t = [],
              r = arguments.length - 1;
            while (r-- > 0) t[r] = arguments[r + 1];
            return t.reduce(function (t, r) {
              var n = e["border-" + r + "-width"];
              return t + v(n);
            }, 0);
          }
          function y(e) {
            var t = ["top", "right", "bottom", "left"];
            var r = {};
            for (var n = 0, i = t; n < i.length; n += 1) {
              var o = i[n];
              var s = e["padding-" + o];
              r[o] = v(s);
            }
            return r;
          }
          function _(e) {
            var t = e.getBBox();
            return O(0, 0, t.width, t.height);
          }
          function m(e) {
            var t = e.clientWidth;
            var r = e.clientHeight;
            if (!t && !r) {
              return p;
            }
            var n = d(e).getComputedStyle(e);
            var i = y(n);
            var o = i.left + i.right;
            var s = i.top + i.bottom;
            var u = v(n.width),
              a = v(n.height);
            if (n.boxSizing === "border-box") {
              if (Math.round(u + o) !== t) {
                u -= g(n, "left", "right") + o;
              }
              if (Math.round(a + s) !== r) {
                a -= g(n, "top", "bottom") + s;
              }
            }
            if (!w(e)) {
              var f = Math.round(u + o) - t;
              var l = Math.round(a + s) - r;
              if (Math.abs(f) !== 1) {
                u -= f;
              }
              if (Math.abs(l) !== 1) {
                a -= l;
              }
            }
            return O(i.left, i.top, u, a);
          }
          var b = (function () {
            if (typeof SVGGraphicsElement !== "undefined") {
              return function (e) {
                return e instanceof d(e).SVGGraphicsElement;
              };
            }
            return function (e) {
              return (
                e instanceof d(e).SVGElement && typeof e.getBBox === "function"
              );
            };
          })();
          function w(e) {
            return e === d(e).document.documentElement;
          }
          function E(e) {
            if (!n) {
              return p;
            }
            if (b(e)) {
              return _(e);
            }
            return m(e);
          }
          function A(e) {
            var t = e.x;
            var r = e.y;
            var n = e.width;
            var i = e.height;
            var o =
              typeof DOMRectReadOnly !== "undefined" ? DOMRectReadOnly : Object;
            var s = Object.create(o.prototype);
            c(s, {
              x: t,
              y: r,
              width: n,
              height: i,
              top: r,
              right: t + n,
              bottom: i + r,
              left: t,
            });
            return s;
          }
          function O(e, t, r, n) {
            return { x: e, y: t, width: r, height: n };
          }
          var S = function (e) {
            this.broadcastWidth = 0;
            this.broadcastHeight = 0;
            this.contentRect_ = O(0, 0, 0, 0);
            this.target = e;
          };
          S.prototype.isActive = function () {
            var e = E(this.target);
            this.contentRect_ = e;
            return (
              e.width !== this.broadcastWidth ||
              e.height !== this.broadcastHeight
            );
          };
          S.prototype.broadcastRect = function () {
            var e = this.contentRect_;
            this.broadcastWidth = e.width;
            this.broadcastHeight = e.height;
            return e;
          };
          var R = function (e, t) {
            var r = A(t);
            c(this, { target: e, contentRect: r });
          };
          var j = function (e, t, n) {
            this.activeObservations_ = [];
            this.observations_ = new r();
            if (typeof e !== "function") {
              throw new TypeError(
                "The callback provided as parameter 1 is not a function."
              );
            }
            this.callback_ = e;
            this.controller_ = t;
            this.callbackCtx_ = n;
          };
          j.prototype.observe = function (e) {
            if (!arguments.length) {
              throw new TypeError("1 argument required, but only 0 present.");
            }
            if (
              typeof Element === "undefined" ||
              !(Element instanceof Object)
            ) {
              return;
            }
            if (!(e instanceof d(e).Element)) {
              throw new TypeError('parameter 1 is not of type "Element".');
            }
            var t = this.observations_;
            if (t.has(e)) {
              return;
            }
            t.set(e, new S(e));
            this.controller_.addObserver(this);
            this.controller_.refresh();
          };
          j.prototype.unobserve = function (e) {
            if (!arguments.length) {
              throw new TypeError("1 argument required, but only 0 present.");
            }
            if (
              typeof Element === "undefined" ||
              !(Element instanceof Object)
            ) {
              return;
            }
            if (!(e instanceof d(e).Element)) {
              throw new TypeError('parameter 1 is not of type "Element".');
            }
            var t = this.observations_;
            if (!t.has(e)) {
              return;
            }
            t.delete(e);
            if (!t.size) {
              this.controller_.removeObserver(this);
            }
          };
          j.prototype.disconnect = function () {
            this.clearActive();
            this.observations_.clear();
            this.controller_.removeObserver(this);
          };
          j.prototype.gatherActive = function () {
            var e = this;
            this.clearActive();
            this.observations_.forEach(function (t) {
              if (t.isActive()) {
                e.activeObservations_.push(t);
              }
            });
          };
          j.prototype.broadcastActive = function () {
            if (!this.hasActive()) {
              return;
            }
            var e = this.callbackCtx_;
            var t = this.activeObservations_.map(function (e) {
              return new R(e.target, e.broadcastRect());
            });
            this.callback_.call(e, t, e);
            this.clearActive();
          };
          j.prototype.clearActive = function () {
            this.activeObservations_.splice(0);
          };
          j.prototype.hasActive = function () {
            return this.activeObservations_.length > 0;
          };
          var T = typeof WeakMap !== "undefined" ? new WeakMap() : new r();
          var M = function (e) {
            if (!(this instanceof M)) {
              throw new TypeError("Cannot call a class as a function.");
            }
            if (!arguments.length) {
              throw new TypeError("1 argument required, but only 0 present.");
            }
            var t = h.getInstance();
            var r = new j(e, t, this);
            T.set(this, r);
          };
          ["observe", "unobserve", "disconnect"].forEach(function (e) {
            M.prototype[e] = function () {
              return (t = T.get(this))[e].apply(t, arguments);
              var t;
            };
          });
          var x = (function () {
            if (typeof i.ResizeObserver !== "undefined") {
              return i.ResizeObserver;
            }
            return M;
          })();
          t["default"] = x;
        }.call(this, r("./node_modules/webpack/buildin/global.js")));
      },
    "./node_modules/store/dist/store.legacy.js": function (e, t, r) {
      var n = r("./node_modules/store/src/store-engine.js");
      var i = r("./node_modules/store/storages/all.js");
      var o = [r("./node_modules/store/plugins/json2.js")];
      e.exports = n.createStore(i, o);
    },
    "./node_modules/store/plugins/json2.js": function (e, t, r) {
      e.exports = n;
      function n() {
        r("./node_modules/store/plugins/lib/json2.js");
        return {};
      }
    },
    "./node_modules/store/plugins/lib/json2.js": function (module, exports) {
      if (typeof JSON !== "object") {
        JSON = {};
      }
      (function () {
        "use strict";
        var rx_one = /^[\],:{}\s]*$/;
        var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        var rx_three =
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
        var rx_escapable =
          /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        var rx_dangerous =
          /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        function f(e) {
          return e < 10 ? "0" + e : e;
        }
        function this_value() {
          return this.valueOf();
        }
        if (typeof Date.prototype.toJSON !== "function") {
          Date.prototype.toJSON = function () {
            return isFinite(this.valueOf())
              ? this.getUTCFullYear() +
                  "-" +
                  f(this.getUTCMonth() + 1) +
                  "-" +
                  f(this.getUTCDate()) +
                  "T" +
                  f(this.getUTCHours()) +
                  ":" +
                  f(this.getUTCMinutes()) +
                  ":" +
                  f(this.getUTCSeconds()) +
                  "Z"
              : null;
          };
          Boolean.prototype.toJSON = this_value;
          Number.prototype.toJSON = this_value;
          String.prototype.toJSON = this_value;
        }
        var gap;
        var indent;
        var meta;
        var rep;
        function quote(e) {
          rx_escapable.lastIndex = 0;
          return rx_escapable.test(e)
            ? '"' +
                e.replace(rx_escapable, function (e) {
                  var t = meta[e];
                  return typeof t === "string"
                    ? t
                    : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4);
                }) +
                '"'
            : '"' + e + '"';
        }
        function str(e, t) {
          var r;
          var n;
          var i;
          var o;
          var s = gap;
          var u;
          var a = t[e];
          if (a && typeof a === "object" && typeof a.toJSON === "function") {
            a = a.toJSON(e);
          }
          if (typeof rep === "function") {
            a = rep.call(t, e, a);
          }
          switch (typeof a) {
            case "string":
              return quote(a);
            case "number":
              return isFinite(a) ? String(a) : "null";
            case "boolean":
            case "null":
              return String(a);
            case "object":
              if (!a) {
                return "null";
              }
              gap += indent;
              u = [];
              if (Object.prototype.toString.apply(a) === "[object Array]") {
                o = a.length;
                for (r = 0; r < o; r += 1) {
                  u[r] = str(r, a) || "null";
                }
                i =
                  u.length === 0
                    ? "[]"
                    : gap
                    ? "[\n" + gap + u.join(",\n" + gap) + "\n" + s + "]"
                    : "[" + u.join(",") + "]";
                gap = s;
                return i;
              }
              if (rep && typeof rep === "object") {
                o = rep.length;
                for (r = 0; r < o; r += 1) {
                  if (typeof rep[r] === "string") {
                    n = rep[r];
                    i = str(n, a);
                    if (i) {
                      u.push(quote(n) + (gap ? ": " : ":") + i);
                    }
                  }
                }
              } else {
                for (n in a) {
                  if (Object.prototype.hasOwnProperty.call(a, n)) {
                    i = str(n, a);
                    if (i) {
                      u.push(quote(n) + (gap ? ": " : ":") + i);
                    }
                  }
                }
              }
              i =
                u.length === 0
                  ? "{}"
                  : gap
                  ? "{\n" + gap + u.join(",\n" + gap) + "\n" + s + "}"
                  : "{" + u.join(",") + "}";
              gap = s;
              return i;
          }
        }
        if (typeof JSON.stringify !== "function") {
          meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\",
          };
          JSON.stringify = function (e, t, r) {
            var n;
            gap = "";
            indent = "";
            if (typeof r === "number") {
              for (n = 0; n < r; n += 1) {
                indent += " ";
              }
            } else if (typeof r === "string") {
              indent = r;
            }
            rep = t;
            if (
              t &&
              typeof t !== "function" &&
              (typeof t !== "object" || typeof t.length !== "number")
            ) {
              throw new Error("JSON.stringify");
            }
            return str("", { "": e });
          };
        }
        if (typeof JSON.parse !== "function") {
          JSON.parse = function (text, reviver) {
            var j;
            function walk(e, t) {
              var r;
              var n;
              var i = e[t];
              if (i && typeof i === "object") {
                for (r in i) {
                  if (Object.prototype.hasOwnProperty.call(i, r)) {
                    n = walk(i, r);
                    if (n !== undefined) {
                      i[r] = n;
                    } else {
                      delete i[r];
                    }
                  }
                }
              }
              return reviver.call(e, t, i);
            }
            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
              text = text.replace(rx_dangerous, function (e) {
                return (
                  "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                );
              });
            }
            if (
              rx_one.test(
                text
                  .replace(rx_two, "@")
                  .replace(rx_three, "]")
                  .replace(rx_four, "")
              )
            ) {
              j = eval("(" + text + ")");
              return typeof reviver === "function" ? walk({ "": j }, "") : j;
            }
            throw new SyntaxError("JSON.parse");
          };
        }
      })();
    },
    "./node_modules/store/storages/all.js": function (e, t, r) {
      e.exports = {
        localStorage: r("./node_modules/store/storages/localStorage.js"),
        "oldFF-globalStorage": r(
          "./node_modules/store/storages/oldFF-globalStorage.js"
        ),
        "oldIE-userDataStorage": r(
          "./node_modules/store/storages/oldIE-userDataStorage.js"
        ),
        cookieStorage: r("./node_modules/store/storages/cookieStorage.js"),
        sessionStorage: r("./node_modules/store/storages/sessionStorage.js"),
        memoryStorage: r("./node_modules/store/storages/memoryStorage.js"),
      };
    },
    "./node_modules/store/storages/cookieStorage.js": function (e, t, r) {
      var n = r("./node_modules/store/src/util.js");
      var i = n.Global;
      var o = n.trim;
      e.exports = {
        name: "cookieStorage",
        read: u,
        write: f,
        each: a,
        remove: l,
        clearAll: h,
      };
      var s = i.document;
      function u(e) {
        if (!e || !c(e)) {
          return null;
        }
        var t =
          "(?:^|.*;\\s*)" +
          escape(e).replace(/[\-\.\+\*]/g, "\\$&") +
          "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*";
        return unescape(s.cookie.replace(new RegExp(t), "$1"));
      }
      function a(e) {
        var t = s.cookie.split(/; ?/g);
        for (var r = t.length - 1; r >= 0; r--) {
          if (!o(t[r])) {
            continue;
          }
          var n = t[r].split("=");
          var i = unescape(n[0]);
          var u = unescape(n[1]);
          e(u, i);
        }
      }
      function f(e, t) {
        if (!e) {
          return;
        }
        s.cookie =
          escape(e) +
          "=" +
          escape(t) +
          "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
      }
      function l(e) {
        if (!e || !c(e)) {
          return;
        }
        s.cookie =
          escape(e) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      }
      function h() {
        a(function (e, t) {
          l(t);
        });
      }
      function c(e) {
        return new RegExp(
          "(?:^|;\\s*)" + escape(e).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\="
        ).test(s.cookie);
      }
    },
    "./node_modules/store/storages/oldFF-globalStorage.js": function (e, t, r) {
      var n = r("./node_modules/store/src/util.js");
      var i = n.Global;
      e.exports = {
        name: "oldFF-globalStorage",
        read: s,
        write: u,
        each: a,
        remove: f,
        clearAll: l,
      };
      var o = i.globalStorage;
      function s(e) {
        return o[e];
      }
      function u(e, t) {
        o[e] = t;
      }
      function a(e) {
        for (var t = o.length - 1; t >= 0; t--) {
          var r = o.key(t);
          e(o[r], r);
        }
      }
      function f(e) {
        return o.removeItem(e);
      }
      function l() {
        a(function (e, t) {
          delete o[e];
        });
      }
    },
    "./node_modules/store/storages/oldIE-userDataStorage.js": function (
      e,
      t,
      r
    ) {
      var n = r("./node_modules/store/src/util.js");
      var i = n.Global;
      e.exports = {
        name: "oldIE-userDataStorage",
        write: f,
        read: l,
        each: h,
        remove: c,
        clearAll: d,
      };
      var o = "storejs";
      var s = i.document;
      var u = g();
      var a = (i.navigator ? i.navigator.userAgent : "").match(
        / (MSIE 8|MSIE 9|MSIE 10)\./
      );
      function f(e, t) {
        if (a) {
          return;
        }
        var r = v(e);
        u(function (e) {
          e.setAttribute(r, t);
          e.save(o);
        });
      }
      function l(e) {
        if (a) {
          return;
        }
        var t = v(e);
        var r = null;
        u(function (e) {
          r = e.getAttribute(t);
        });
        return r;
      }
      function h(e) {
        u(function (t) {
          var r = t.XMLDocument.documentElement.attributes;
          for (var n = r.length - 1; n >= 0; n--) {
            var i = r[n];
            e(t.getAttribute(i.name), i.name);
          }
        });
      }
      function c(e) {
        var t = v(e);
        u(function (e) {
          e.removeAttribute(t);
          e.save(o);
        });
      }
      function d() {
        u(function (e) {
          var t = e.XMLDocument.documentElement.attributes;
          e.load(o);
          for (var r = t.length - 1; r >= 0; r--) {
            e.removeAttribute(t[r].name);
          }
          e.save(o);
        });
      }
      var p = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
      function v(e) {
        return e.replace(/^\d/, "___$&").replace(p, "___");
      }
      function g() {
        if (!s || !s.documentElement || !s.documentElement.addBehavior) {
          return null;
        }
        var e = "script",
          t,
          r,
          n;
        try {
          r = new ActiveXObject("htmlfile");
          r.open();
          r.write(
            "<" +
              e +
              ">document.w=window</" +
              e +
              '><iframe src="/favicon.ico"></iframe>'
          );
          r.close();
          t = r.w.frames[0].document;
          n = t.createElement("div");
        } catch (e) {
          n = s.createElement("div");
          t = s.body;
        }
        return function (e) {
          var r = [].slice.call(arguments, 0);
          r.unshift(n);
          t.appendChild(n);
          n.addBehavior("#default#userData");
          n.load(o);
          e.apply(this, r);
          t.removeChild(n);
          return;
        };
      }
    },
    "./node_modules/store/storages/sessionStorage.js": function (e, t, r) {
      var n = r("./node_modules/store/src/util.js");
      var i = n.Global;
      e.exports = {
        name: "sessionStorage",
        read: s,
        write: u,
        each: a,
        remove: f,
        clearAll: l,
      };
      function o() {
        return i.sessionStorage;
      }
      function s(e) {
        return o().getItem(e);
      }
      function u(e, t) {
        return o().setItem(e, t);
      }
      function a(e) {
        for (var t = o().length - 1; t >= 0; t--) {
          var r = o().key(t);
          e(s(r), r);
        }
      }
      function f(e) {
        return o().removeItem(e);
      }
      function l() {
        return o().clear();
      }
    },
  },
]);
//# sourceMappingURL=vendors~course-manage-practice-udlite-app~course-manage-v2-udlite-app~course-preview-udlite-app~lect~cdb3bda7.a20af781b5147c3d26b8.js.map
