"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [791],
  {
    78816: function (t, e, n) {
      n.d(e, {
        cE: function () {
          return f;
        },
        Qy: function () {
          return s;
        },
        $P: function () {
          return l;
        },
        ry: function () {
          return o;
        },
        Uk: function () {
          return d;
        },
        xd: function () {
          return c;
        },
        ZC: function () {
          return u;
        },
        NM: function () {
          return g;
        },
        pR: function () {
          return a;
        },
      });
      var r,
        i = n(59499);
      n(66541);
      var o = { TEAM: "Team", ENTERPRISE: "Enterprise" },
        a = {
          OWNER: "owner",
          ADMIN: "admin",
          GROUP_ADMIN: "group_admin",
          STUDENT: "student",
        },
        s = "https://www.benesse.co.jp/udemy/biz/",
        c = "https://udemy.wjtb.co.kr/insight/index",
        u = "/udemy-business/",
        p = "".concat(u, "sign-up/"),
        d =
          ("".concat(p, "?ref=ufb_trial_extension_request"),
          Object.freeze({
            COURSE: "course",
            LEARNING_PATH: "learning_path",
            LAB: "lab",
            ASSESSMENT: "adaptive_assessment_assessment",
          })),
        g =
          (Object.freeze(
            ((r = {}),
            (0, i.Z)(r, d.COURSE, "courses"),
            (0, i.Z)(r, d.LEARNING_PATH, "paths"),
            (0, i.Z)(r, d.LAB, "labs"),
            (0, i.Z)(r, d.ASSESSMENT, "assessments"),
            r)
          ),
          "user"),
        l = "organization_group",
        f = "all_users";
      Object.freeze({ UNSPECIFIED: 0, ENTERPRISE: 1, PRO: 2 });
    },
    54963: function (t, e, n) {
      n.d(e, {
        A: function () {
          return s;
        },
        Z: function () {
          return a;
        },
      });
      var r = n(59499),
        i = n(95880);
      function o(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(t);
          e &&
            (r = r.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            n.push.apply(n, r);
        }
        return n;
      }
      function a(t, e) {
        if (UD[t] && !UD[t].isLoading) return UD[t];
        var n = (function (t) {
          for (var e = 1; e < arguments.length; e++) {
            var n = null != arguments[e] ? arguments[e] : {};
            e % 2
              ? o(Object(n), !0).forEach(function (e) {
                  (0, r.Z)(t, e, n[e]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
              : o(Object(n)).forEach(function (e) {
                  Object.defineProperty(
                    t,
                    e,
                    Object.getOwnPropertyDescriptor(n, e)
                  );
                });
          }
          return t;
        })({}, UD[t]);
        return (
          Object.defineProperty(n, "isLoading", {
            get: function () {
              return UD.isGlobalMeContextLoading;
            },
          }),
          s(t, e, n),
          n
        );
      }
      function s(t, e, n) {
        UD[e].forEach(function (e) {
          Object.defineProperty(n, e, {
            get: function () {
              if (i.Z.isServer)
                throw new Error(
                  "UD."
                    .concat(t, ".")
                    .concat(e, " should not be accessed by Node.js")
                );
              if (n.isLoading)
                throw new Error(
                  "UD.".concat(t, ".").concat(e, " has not loaded yet- ") +
                    "you need to check !UD.".concat(t, ".isLoading first")
                );
              return UD[t][e];
            },
          });
        });
      }
    },
    95880: function (t, e, n) {
      var r = n(88309);
      e.Z = r.N;
    },
    23791: function (t, e, n) {
      n.d(e, {
        AU: function () {
          return v;
        },
        QU: function () {
          return R;
        },
        i8: function () {
          return O;
        },
        nc: function () {
          return E;
        },
        t0: function () {
          return k;
        },
      });
      var r = n(59499),
        i = n(61646),
        o = n(9669),
        a = n.n(o),
        s = n(64867),
        c = n.n(s),
        u = n(36808),
        p = n.n(u),
        d = n(43283),
        g = n(95590),
        l = n(95880),
        f = n(79976);
      function _(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(t);
          e &&
            (r = r.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            n.push.apply(n, r);
        }
        return n;
      }
      function h(t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? _(Object(n), !0).forEach(function (e) {
                (0, r.Z)(t, e, n[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
            : _(Object(n)).forEach(function (e) {
                Object.defineProperty(
                  t,
                  e,
                  Object.getOwnPropertyDescriptor(n, e)
                );
              });
        }
        return t;
      }
      var m,
        b,
        z = (0, d.c)(),
        y = l.Z.isClient
          ? z.url.to_root
          : "/server-side-rendering-does-not-allow-api-calls/",
        v = gettext("Unexpected error occurred"),
        O = "api-2.0",
        U = "".concat(y).concat(O, "/"),
        w = "".concat(y),
        j = "".concat(y, "organization-analytics/"),
        S = "".concat(y, "tapen/").concat(O, "/"),
        D = "x-udemy-additional-context",
        E = "X-Udemy-Additional-Context-Requested",
        P = h(
          { "X-Requested-With": "XMLHttpRequest" },
          (function () {
            try {
              var t = p().get(E),
                e = t && JSON.parse(t);
              return e && !e.requires_api_call
                ? {
                    "X-Udemy-Additional-Context-Requested": JSON.stringify(
                      e.value
                    ),
                  }
                : {};
            } catch (n) {
              return i.c.captureException(n), {};
            }
          })()
        ),
        L = A({ baseURL: U });
      (L.get =
        ((b = L.get),
        void (m = {}),
        function (t) {
          var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          if (((e.headers = h(h({}, e.headers), k())), !e.useCache))
            return b(t, e);
          var n = JSON.stringify(Object.assign({ url: t }, e)),
            r = new Date().getTime(),
            i = 1e3 * e.expires || 36e5;
          if (m[n]) {
            if (!(m[n].expires <= r)) return m[n].request;
            delete m[n];
          }
          var o = b(t, e);
          return (
            (m[n] = { request: o, expires: r + i }),
            o.catch(function (t) {
              throw (delete m[n], t);
            })
          );
        })),
        (L.get = N(L.get)),
        (L.post = N(L.post)),
        (L.put = N(L.put)),
        (L.patch = N(L.patch)),
        (e.ZP = L);
      var C = A({ baseURL: S });
      (C.get = N(C.get)),
        (C.post = N(C.post)),
        (C.put = N(C.put)),
        (C.patch = N(C.patch));
      A({
        baseURL: w,
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFToken",
      }),
        A({ baseURL: j });
      function R(t) {
        return (0, d.u)(t.data), t;
      }
      function A(t) {
        var e = a().create(
          h({ headers: P, timeout: 6e4, paramsSerializer: F }, t)
        );
        return (
          e.interceptors.response.use(
            function (t) {
              return (function (t) {
                return (
                  t.headers &&
                    t.headers[D] &&
                    ((0, d.u)(t.headers[D]), p().remove(E)),
                  t
                );
              })(t);
            },
            function (t) {
              var e = t.response && t.response.headers;
              return e &&
                "user-auth" === e["x-udemy-failed-permission"] &&
                !f.ZP.isLoading &&
                f.ZP.id
                ? (l.Z.global.location.reload(), new Promise(g.Z))
                : Promise.reject(t);
            }
          ),
          e
        );
      }
      function k() {
        var t = p().getJSON() || {};
        if (Object.prototype.hasOwnProperty.call(t, "ud_client_cache_off"))
          return {};
        var e = {};
        return (
          Object.entries(t)
            .filter(function (t) {
              return t[0].startsWith("ud_cache_");
            })
            .forEach(function (t) {
              var n = t[0]
                  .split("ud_cache_")[1]
                  .split("_")
                  .map(function (t) {
                    return t.slice(0, 1).toUpperCase() + t.slice(1);
                  })
                  .join("-"),
                r = "X-Udemy-Cache-".concat(n);
              e[r] = String(t[1]);
            }),
          e
        );
      }
      function N(t) {
        return function (e) {
          if ("PROD" !== z.env) {
            var n =
                'Deprecated API call without trailing slash detected: "'.concat(
                  e,
                  '". Fix this by adding trailing slash'
                ),
              r = new URL(e, "https://example.com");
            if (!r.pathname.endsWith("/")) throw Error(n);
            if (r.pathname.includes("//"))
              throw Error(
                "Double slashes detected in: ".concat(
                  e,
                  ". Might be a hint that the url is wrong"
                )
              );
          }
          for (
            var i = arguments.length, o = new Array(i > 1 ? i - 1 : 0), a = 1;
            a < i;
            a++
          )
            o[a - 1] = arguments[a];
          return t.apply(void 0, [e].concat(o));
        };
      }
      function F(t, e) {
        e = h({ arrayBrackets: !0 }, e);
        var n = [];
        return (
          c().forEach(t, function (t, r) {
            null !== t &&
              "undefined" !== typeof t &&
              (c().isArray(t)
                ? e.arrayBrackets && (r = "".concat(r, "[]"))
                : (t = [t]),
              c().forEach(t, function (t) {
                c().isDate(t)
                  ? (t = t.toISOString())
                  : c().isObject(t) && (t = JSON.stringify(t)),
                  n.push("".concat(B(r), "=").concat(B(t)));
              }));
          }),
          n.join("&")
        );
      }
      function B(t) {
        return encodeURIComponent(t)
          .replace(/%40/gi, "@")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",")
          .replace(/%20/g, "+")
          .replace(/%5B/gi, "[")
          .replace(/%5D/gi, "]");
      }
    },
    66541: function (t, e, n) {
      var r = n(80129),
        i = n.n(r),
        o = (n(22188), n(43283)),
        a = n(41477),
        s = n(79976);
      e.Z = {
        toImages: function (t) {
          return (0, o.c)().url.to_images + t;
        },
        toJs: function (t) {
          var e = (0, o.c)();
          return "".concat(e.url.to_js + t, "?v=").concat(e.version);
        },
        toStorageStaticAsset: function (t) {
          return (0, o.c)().third_party.storage_static_asset_base_url + t;
        },
        toSupportContact: function (t, e) {
          return this.to("support", "requests/new", {
            ticket_form_id: t,
            type: e,
          });
        },
        toSupportHome: function () {
          return this.to("support");
        },
        toSupportSystemCheck: function () {
          return this.to("support", "system-check");
        },
        toSupportLink: function (t) {
          var e =
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            n =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : "articles",
            r = (0, o.c)(),
            i = {
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
              history_log: { id: 360053657313 },
              system_requirements: { id: 229231047 },
              student_taxes: { id: 229233627 },
              manage_subscription: { id: 1500002916481 },
              marketplace_maintenance_program: { id: 4403234024855 },
              adding_co_instructors: { id: 229604308 },
            },
            a = Object.assign({}, i, {
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
              labs_aws_support_article: { id: 360056038774 },
              labs_azure_support_article: { id: 4586061730199 },
              labs_data_science_support_article: { id: 360058699133 },
              labs_web_development_support_article: { id: 4410623949463 },
              adding_more_licenses: { id: 115005396128 },
              learning_culture_webinar_link: { id: 115013724427 },
              team_plan_receipts: { id: 360015876213 },
              approving_course: { id: 115006844788 },
              importing_course: { id: 115005228607 },
              creating_course: { id: 115005523008 },
              adding_removing_courses: { id: 360000325728 },
              review_group_membership: { id: 360052222154 },
              editing_custom_topics: { id: 115005228687 },
            }),
            c = {
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
            },
            u =
              e &&
              r.brand.has_organization &&
              r.brand.organization.is_enterprise_china &&
              r.features.organization.is_ub_china_support_redirection_enabled;
          if (u) return "/support/";
          var p = e
              ? "https://business-support.udemy.com/hc/"
              : "https://support.udemy.com/hc/",
            d = s.ZP.isLoading ? "" : s.ZP.locale,
            g = (d || "").replace("_", "-").toLowerCase();
          if (
            ((g = c[g.substring(0, 2)] ? c[g.substring(0, 2)] : "en-us"),
            "default" === t)
          )
            return "".concat(p).concat(g);
          var l = e ? a[t] : i[t],
            f = (l && l.id) || "";
          return "".concat(p).concat(g, "/").concat(n, "/").concat(f);
        },
        toMyCourses: function () {
          return this.to("home/my-courses");
        },
        toCourseDashboard: function (t) {
          return this.to("course-dashboard-redirect", null, { course_id: t });
        },
        toCourseTaking: function (t, e, n) {
          return this.to(t, e ? "learn/".concat(e) : "learn", n);
        },
        toLearningPath: function (t) {
          return this.to("learning-paths", t);
        },
        toAuth: function (t) {
          var e = t.showLogin,
            n = t.showInstructorSignup,
            r = t.locale,
            i = t.nextUrl,
            o = t.nextPath,
            s = t.returnUrl,
            c = t.source,
            u = t.popupTrackingIdentifier,
            p = t.responseType,
            d = (0, a.s)(),
            g = "signup-popup";
          n ? (g = "instructor-signup") : e && (g = "login-popup");
          var l = {
            locale: r || d.locale || "en_US",
            response_type: p || "json",
            return_link: s,
            source: c,
            ref: u,
          };
          return (
            (l.next = i || (o ? this.to(o) : window.location.href)),
            this.to("join", g, l)
          );
        },
        makeAbsolute: function (t) {
          var e = (0, o.c)();
          return (
            "/" === t.charAt(0) && (t = t.slice(1)),
            "".concat(e.url.to_app).concat(t)
          );
        },
        to: function (t, e, n) {
          "/" === (t = t ? String(t) : "").charAt(t.length - 1) &&
            (t = t.slice(0, t.length - 1));
          var r = t
              ? e
                ? "".concat(t, "/").concat(e, "/")
                : "".concat(t, "/")
              : "",
            o = this.makeAbsolute(r);
          return n && 0 != Object.keys(n).length
            ? "".concat(o, "?").concat(i().stringify(n))
            : o;
        },
        toInstructorCommunity: function () {
          return "https://community.udemy.com";
        },
        toHardLink: function (t) {
          return (
            {
              promo_video_content:
                "/udemy-teach-hub/promo_video/?use-localization-prefix=1",
              cpe_course_evaluation:
                "https://docs.google.com/forms/d/e/1FAIpQLSdFxtjbOd5QArS1pov8_eSwLuYXEDVdw9uHwC6lFv_MnCKUsQ/viewform",
              nasba_registry: "https://www.nasbaregistry.org/",
            }[t] || ""
          );
        },
        toLocalizedNewcomerChallenge: function () {
          var t = {
              en: "hj92N5OWrGpFJYRvXvwmzfP6KE3qHemTLUCVXMtX%3DYQpglLjHJlYQGiFORUzdOOlMzb27WIGzbHl5zdRaLH3Rk7ISwzfO&_ei_=EswUN1Css7mEpCoPhKN_87U",
              de: "mdX2FKSoulLSr8evczetSr2vRwGAgsD39za3VXMtX%3DYQpglLjHJlYQGgzbbgy3wzcgIstYUTzbTcM2NrkLN2FjwIAvOza&_ei_=ErjwYIhJT8jgodxmScI9JVI",
              es: "zbatoTMuYC9wLdweazfoza9iJFOlkNCn8XrzcJVXMtX%3DYQpglLjHJlYQGmIkEMHKJEqigSUeFBOqLpyADu6Ozavyzbzczab&_ei_=EoOwLlzi9SpP4xMqAKJxu8Q",
              ja: "rvrwaihyPCy58oPzfBCn7fzfMbOro0lBtPIGVXMtX%3DYQpglLjHJlYQGtWEBNDCybNtcazeRCWzetuj1zbMLzaqsgU5zbyk&_ei_=Ep4pCt8Os2gyESfH-v7082I",
              pt: "jCTzae8bqAzauUeYkjzd8156yzbX8CEGGc8qXJVXMtX%3DYQpglLjHJlYQGjD2KjokNAzbGnB8YnqkW3Ta5DCl33zf5uYys&_ei_=EoKnW9bD376YcRJCeLsL9Lc",
              fr: "zbXRBSW8BbjiMlHzbnjOoesbeRNjESUOtcSkVXMtX%3DYQpglLjHJlYQGzbczdKvmODbSzbcrncOgmzgzdsPOJTNMzcidmrzd5&_ei_=EmEfebZg5ZrBwlSba3OhohY.",
              it: "orXASzc4R9PuhfBDzcEzey4ulLh5FyKBzea2ofVXMtX%3DYQpglLjHJlYQGjJH5E3T8LtEe8hzcyzbGbRozdiiE9zgc6R4u5f&_ei_=Elxd4mXlKUMUm7Isetz96gA",
              pl: "uzg6mY7pFzezdqjRaKLnGczftR75NSKzazeC2nfCVXMtX%3DYQpglLjHJlYQGlszazbvPC2qdwGNNHl07KuXzfE9O3HiDzfCnLG&_ei_=EolWs-9nC4mhA9p3Fir37Rg",
              tr: "kuaDzeIBzbUH30Hzeq893Rf5uO1Ys4s2lBbUfVXMtX%3DYQpglLjHJlYQGgbmo43gh8qXE8pzepjzcK012zaHKhupzfHzdrA3&_ei_=EnfxfaJKFB7M_9wdA63da-E",
            },
            e = (0, a.s)().locale.substr(0, 2);
          return t[e]
            ? "https://email.udemy.com/pub/sf/ResponseForm?_ri_=X0Gzc2X%3DYQpglLjHJlYQG" +
                t[e]
            : null;
        },
        toUFBDataReports: function () {
          return this.to("organization-manage/reports");
        },
        toTapenUFBDataReports: function (t) {
          return this.to(
            "tapen/organization/".concat(t, "/data-export-reports")
          );
        },
        toUFBPathInsights: function () {
          return this.to("organization-manage/path-insights");
        },
        toCourseInsights: function (t) {
          return this.to("organization-manage/insights/course/".concat(t));
        },
        toUFBSettingsAPI: function () {
          return this.to("organization-manage/settings/api-integration");
        },
        toUFBSettingsAppearance: function () {
          return this.to("organization-manage/settings/appearance");
        },
        toUFBSettingsBilling: function () {
          return this.to("organization-manage/settings/billing");
        },
        toUFBSettingsCustomErrors: function () {
          return this.to("organization-manage/settings/custom-error-message");
        },
        toUFBSettingsEmails: function () {
          return this.to("organization-manage/settings/approved-email-domains");
        },
        toUFBSettingsIntegrations: function () {
          return this.to("organization-manage/settings/integration");
        },
        toUFBSettingsLMSIntegrations: function () {
          return this.to("organization-manage/settings/lms-integration");
        },
        toUFBSettingsSCIM: function () {
          return this.to("organization-manage/settings/provisioning-scim");
        },
        toUFBSettingsSSO: function () {
          return this.to("organization-manage/settings/single-sign-on");
        },
        toUFBUserActivity: function () {
          return this.to("organization-manage/insights/user-activity");
        },
        toTapenUFBUserActivity: function (t) {
          return this.to(
            "tapen/organization/".concat(t, "/insights/user-activity")
          );
        },
        toUFBUserAdoptionFunnel: function () {
          return this.to("organization-manage/adoption");
        },
        toUFBUserDetail: function (t) {
          return this.to("organization-manage/users/detail/".concat(t, "/"));
        },
        toUFBManageUsers: function () {
          return this.to("organization-manage/users");
        },
        toUFBManageGroups: function () {
          return this.to("organization-manage/users/manage-groups");
        },
        toFreeCourseFAQLink: function (t) {
          switch (t) {
            case "zh":
              return "http://teach.udemy.com/free-changes-to-courses-zh-faq/";
            case "ru":
              return "http://teach.udemy.com/free-changes-to-courses-ru-faq/";
            default:
              return "/udemy-teach-hub/new_standard_free_courses/";
          }
        },
        toRefundRequestForm: function (t) {
          return this.to("request-refund/".concat(t));
        },
        toPurchaseHistoryDashboard: function () {
          return this.to("dashboard/purchase-history");
        },
        toCreditHistoryDashboard: function () {
          return this.to("dashboard/credit-history");
        },
      };
    },
    79976: function (t, e, n) {
      n.d(e, {
        $9: function () {
          return a;
        },
        Ik: function () {
          return s;
        },
      });
      var r = n(54963),
        i = n(78816),
        o = (0, r.Z)("me", "meProperties");
      function a() {
        UD.me &&
          !UD.me.isLoading &&
          UD.me.organization &&
          Object.assign(UD.me.organization, {
            isOwner: UD.me.organization.role === i.pR.OWNER,
            isAdmin: UD.me.organization.role === i.pR.ADMIN,
            isGroupAdmin: UD.me.organization.role === i.pR.GROUP_ADMIN,
            isStudent: UD.me.organization.role === i.pR.STUDENT,
            hasPermission: function (t) {
              return (
                !!UD.me.organization.permissions &&
                o.organization.permissions
                  .map(function (t) {
                    return t.permission;
                  })
                  .includes(t)
              );
            },
          });
      }
      function s() {
        (0, r.A)("me", "meProperties", o);
      }
      a(), (e.ZP = o);
    },
  },
]);
//# sourceMappingURL=791-a3e5c5b4fb444194.js.map
