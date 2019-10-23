"use strict";
var precacheConfig = [
    ["index.html", "2499ab3b62f75a12abcc6d0f2d05685e"],
    ["register.js", "b4960f220294907f400744e78ec9a4f2"],
    ["register.simple.js", "0b3807b844d4d9d2c6cfd27493a776ad"],
    ["static/appicon_144.png", "93541709a9a758b61e5b309e9d0449a2"],
    ["static/appicon_48.png", "7a62497fc2e0de8995ccd63a72ea348f"],
    ["static/appicon_96.png", "06e2abb45f96747891aabe67b5df57ce"],
    ["static/code.png", "c52a67be8cfdde3d9fffe5cede307433"],
    [
      "static/css/app.5026fca1477180cb0d00f1894bbe2b67.css",
      "f20bab4b70c100132b711d177f22d1cd"
    ],
    ["static/favicon.png", "2878da9f5a61e63ad834f79c77bdcaf9"],
    ["static/img/chess.3af45aa.png", "3af45aa0ed8a2db5218256dfd919b00d"],
    ["static/img/pwa-reliable.b821467.png", "b8214676408fdcfe922afef51ef51414"],
    ["static/js/0.a838394752f5bf87dda7.js", "242d99d0214a2dacd3bde3daeacfa982"],
    ["static/js/1.41cd8aa94a75722098a7.js", "2cbcda39e45e220dcf022c71ace285c2"],
    [
      "static/js/app.374f4da3e738752fe0d6.js",
      "d30d009449399e7c243ef60c19c94a36"
    ],
    [
      "static/js/manifest.248921041b9f167dd52d.js",
      "4d6020672dbdec9e0256fce6c63c5f0f"
    ],
    [
      "static/js/vendor.abad2743141de59ac4b8.js",
      "395664d1422559cc26c0b6e9f1cc14ef"
    ],
    ["static/unsubscribe.png", "0aa3df3172ac390ad93eee4d10203346"],
    ["sw.js", "013104c08525fd61fde007911ad198d9"]
  ],
  cacheName =
    "vue-pwa-v3-vue-pwa-" + (self.registration ? self.registration.scope : ""),
  assetHostPattern = /\/\/(tangyangzhe\.github\.io)/,
  ignoreUrlParametersMatching = [/^utm_/],
  addDirectoryIndex = function(e, t) {
    var n = new URL(e);
    return "/" === n.pathname.slice(-1) && (n.pathname += t), n.toString();
  },
  cleanResponse = function(e) {
    return e.redirected
      ? ("body" in e ? Promise.resolve(e.body) : e.blob()).then(function(t) {
          return new Response(t, {
            headers: e.headers,
            status: e.status,
            statusText: e.statusText
          });
        })
      : Promise.resolve(e);
  },
  createCacheKey = function(e, t, n, a) {
    var r = new URL(e);
    return (
      (a && r.pathname.match(a)) ||
        (r.search +=
          (r.search ? "&" : "") +
          encodeURIComponent(t) +
          "=" +
          encodeURIComponent(n)),
      r.toString()
    );
  },
  isPathWhitelisted = function(e, t) {
    if (0 === e.length) return !0;
    var n = new URL(t).pathname;
    return e.some(function(e) {
      return n.match(e);
    });
  },
  stripIgnoredUrlParameters = function(e, t) {
    var n = new URL(e);
    return (
      (n.hash = ""),
      (n.search = n.search
        .slice(1)
        .split("&")
        .map(function(e) {
          return e.split("=");
        })
        .filter(function(e) {
          return t.every(function(t) {
            return !t.test(e[0]);
          });
        })
        .map(function(e) {
          return e.join("=");
        })
        .join("&")),
      n.toString()
    );
  },
  hashParamName = "_sw-precache",
  urlsToCacheKeys = new Map(
    precacheConfig.map(function(e) {
      var t = e[0],
        n = e[1],
        a = new URL(t, self.location),
        r = createCacheKey(a, hashParamName, n, !1);
      return [a.toString(), r];
    })
  );
function setOfCachedUrls(e) {
  return e
    .keys()
    .then(function(e) {
      return e.map(function(e) {
        return e.url;
      });
    })
    .then(function(e) {
      return new Set(e);
    });
}
self.addEventListener("install", function(e) {
  e.waitUntil(
    caches
      .open(cacheName)
      .then(function(e) {
        return setOfCachedUrls(e).then(function(t) {
          return Promise.all(
            Array.from(urlsToCacheKeys.values()).map(function(n) {
              if (!t.has(n)) {
                var a = new Request(n, { credentials: "same-origin" });
                return fetch(a).then(function(t) {
                  if (!t.ok)
                    throw new Error(
                      "Request for " +
                        n +
                        " returned a response with status " +
                        t.status
                    );
                  return cleanResponse(t).then(function(t) {
                    return e.put(n, t);
                  });
                });
              }
            })
          );
        });
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
}),
  self.addEventListener("activate", function(e) {
    var t = new Set(urlsToCacheKeys.values());
    e.waitUntil(
      caches
        .open(cacheName)
        .then(function(e) {
          return e.keys().then(function(n) {
            return Promise.all(
              n.map(function(n) {
                if (!t.has(n.url)) return e.delete(n);
              })
            );
          });
        })
        .then(function() {
          return self.clients.claim();
        })
    );
  }),
  self.addEventListener("push", function(e) {
    if (self.Notification && "granted" === self.Notification.permission) {
      var t = {};
      e.data && (((t = e.data.json()).data = {}), (t.data.url = t.url)),
        console.log(t),
        e.waitUntil(self.registration.showNotification(t.title, t));
    }
  }),
  self.addEventListener("notificationclick", function(e) {
    e.notification.close();
    var t = e.notification.data.url;
    t &&
      e.waitUntil(
        clients.matchAll({ type: "window" }).then(function(e) {
          for (var n = 0; n < e.length; n++) {
            var a = e[n];
            if ("/" == a.url && "focus" in a) return a.focus();
          }
          if (clients.openWindow) return clients.openWindow(t);
        })
      );
  }),
  self.addEventListener("fetch", function(e) {
    if (assetHostPattern.test(e.request.url)) {
      var t,
        n = stripIgnoredUrlParameters(
          e.request.url,
          ignoreUrlParametersMatching
        );
      (t = urlsToCacheKeys.has(n)) ||
        ((n = addDirectoryIndex(n, "index.html")),
        (t = urlsToCacheKeys.has(n)));
      0,
        t &&
          e.respondWith(
            caches
              .open(cacheName)
              .then(function(e) {
                return e.match(urlsToCacheKeys.get(n)).then(function(e) {
                  if (e) return e;
                  throw Error(
                    "The cached response that was expected is missing."
                  );
                });
              })
              .catch(function(t) {
                return (
                  console.warn(
                    'Couldn\'t serve response for "%s" from cache: %O',
                    e.request.url,
                    t
                  ),
                  fetch(e.request)
                );
              })
          );
    }
  });
