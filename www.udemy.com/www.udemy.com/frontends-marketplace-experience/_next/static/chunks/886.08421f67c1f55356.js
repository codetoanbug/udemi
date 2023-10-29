"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [886],
  {
    24273: function (e, t, i) {
      i.d(t, {
        z: function () {
          return r;
        },
      });
      var n = (0, i(54963).Z)("visiting", "visitingProperties");
      function r() {
        UD.visiting &&
          !UD.visiting.isLoading &&
          UD.visiting.first_visit_time &&
          (UD.visiting.first_visit_time = new Date(
            UD.visiting.first_visit_time
          ));
      }
      r(), (t.Z = n);
    },
    24886: function (e, t, i) {
      i.r(t),
        i.d(t, {
          default: function () {
            return p;
          },
          loadGlobalMeContext: function () {
            return d;
          },
        });
      var n = i(50029),
        r = i(87794),
        a = i.n(r),
        s = i(36808),
        u = i.n(s),
        o = i(22188),
        c = i(48809),
        v = i(23791),
        f = i(79976),
        l = i(24273);
      function p(e) {
        var t = u().get(v.nc),
          i = t && JSON.parse(t);
        Boolean(i && i.requires_api_call)
          ? v.ZP.get(i.value.replace("/api-2.0/", ""))
              .then(v.QU)
              .then(function () {
                u().remove(v.nc);
              })
              .then(e)
          : e();
      }
      function d() {
        return g.apply(this, arguments);
      }
      function g() {
        return (g = (0, n.Z)(
          a().mark(function e() {
            var t;
            return a().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    if (!UD.isGlobalMeContextLoading) {
                      e.next = 5;
                      break;
                    }
                    return (
                      (e.next = 3),
                      (0, c.$A)({
                        visiting: !0,
                        user_specific_tracking: !0,
                        me: !0,
                        request: !0,
                        Config: !0,
                        experiment: !0,
                      })
                    );
                  case 3:
                    (t = e.sent),
                      (0, o.z)(function () {
                        var e, i, n, r, a;
                        (UD.me = t.data.me),
                          (0, f.Ik)(),
                          (0, f.$9)(),
                          (UD.visiting =
                            (null === (e = t.data) || void 0 === e
                              ? void 0
                              : e.visiting) || {}),
                          (UD.userSpecificTrackingParams =
                            (null === (i = t.data) || void 0 === i
                              ? void 0
                              : i.user_specific_tracking) || {}),
                          (UD.request =
                            (null === (n = t.data) || void 0 === n
                              ? void 0
                              : n.request) || {}),
                          (UD.request.clientTimestamp =
                            new Date().toISOString()),
                          (UD.Config =
                            (null === (r = t.data) || void 0 === r
                              ? void 0
                              : r.Config) || {}),
                          (UD.experiment =
                            (null === (a = t.data) || void 0 === a
                              ? void 0
                              : a.experiment) || {}),
                          (0, l.z)(),
                          (UD.isGlobalMeContextLoading = !1);
                      });
                  case 5:
                    return m(), e.abrupt("return", t && t.data);
                  case 7:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function m() {
        return D.apply(this, arguments);
      }
      function D() {
        return (D = (0, n.Z)(
          a().mark(function e() {
            var t;
            return a().wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (!UD.me.id || UD.me.time_zone) {
                        e.next = 11;
                        break;
                      }
                      return (
                        (e.prev = 1),
                        (e.next = 4),
                        i.e(853).then(i.bind(i, 96019))
                      );
                    case 4:
                      (t = e.sent), (0, t.default)(), (e.next = 11);
                      break;
                    case 9:
                      (e.prev = 9), (e.t0 = e.catch(1));
                    case 11:
                    case "end":
                      return e.stop();
                  }
              },
              e,
              null,
              [[1, 9]]
            );
          })
        )).apply(this, arguments);
      }
    },
  },
]);
//# sourceMappingURL=886.08421f67c1f55356.js.map
