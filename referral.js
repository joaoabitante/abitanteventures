/*! Contbit Referral v2 — gera link de indicação e injeta nome no WhatsApp.
 * HTML: <div data-referral data-site="..." data-wa="..." data-theme="...">
 *         ... formulário com data-ref-form / data-ref-result ...
 *       </div>
 *       <script src="referral.js" defer></script>
 * URL: ?ref=Nome → grava 90 dias e entra no texto do WhatsApp.
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "contbit_referral_v1";
  var TTL_MS = 90 * 24 * 60 * 60 * 1000;
  var IND_RE = /Indicado por\s*:/i;
  var uid = 0;

  function sanitizeName(raw) {
    return String(raw || "")
      .replace(/[<>"'`\\]/g, "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60);
  }

  function sanitizePhone(raw) {
    return String(raw || "").replace(/\D/g, "").slice(0, 15);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function readStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || !o.name || !o.ts) return null;
      if (Date.now() - o.ts > TTL_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      o.name = sanitizeName(o.name);
      return o.name ? o : null;
    } catch (e) {
      return null;
    }
  }

  function writeStore(name, phone) {
    var n = sanitizeName(name);
    if (!n) return null;
    var o = { name: n, phone: sanitizePhone(phone) || "", ts: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
    } catch (e) { /* private mode */ }
    return o;
  }

  function captureFromURL() {
    try {
      var p = new URLSearchParams(location.search);
      var ref = p.get("ref") || p.get("indicado") || p.get("indicacao");
      if (!ref) return readStore();
      var name = sanitizeName(decodeURIComponent(String(ref)));
      if (!name) return readStore();
      return writeStore(name, p.get("rphone") || p.get("tel") || "");
    } catch (e) {
      return readStore();
    }
  }

  function getReferrer() {
    return readStore();
  }

  function getReferrerLabel() {
    var o = getReferrer();
    if (!o) return "";
    if (o.phone && o.phone.length >= 10) return o.name + " (" + o.phone + ")";
    return o.name;
  }

  function appendReferrerToText(text) {
    var label = getReferrerLabel();
    if (!label) return text || "";
    var base = String(text || "").replace(/\s+$/, "");
    if (IND_RE.test(base)) return base;
    return base + (base ? "\n\n" : "") + "Indicado por: " + label;
  }

  function withReferrerInWaUrl(href) {
    try {
      if (!href || href.indexOf("wa.me") === -1) return href;
      var label = getReferrerLabel();
      if (!label) return href;
      var u = new URL(href, location.href);
      var text = u.searchParams.get("text") || "";
      var decoded = text;
      try {
        decoded = decodeURIComponent(text);
      } catch (e) { /* keep */ }
      if (IND_RE.test(decoded)) return href;
      u.searchParams.set("text", appendReferrerToText(decoded));
      return u.toString();
    } catch (e) {
      return href;
    }
  }

  function patchWaLinks(root) {
    try {
      var scope = root || document;
      var links = scope.querySelectorAll('a[href*="wa.me"]');
      for (var i = 0; i < links.length; i++) {
        var a = links[i];
        var next = withReferrerInWaUrl(a.getAttribute("href"));
        if (next && next !== a.getAttribute("href")) a.setAttribute("href", next);
      }
    } catch (e) { /* ignore */ }
  }

  function buildShareUrl(name, phone) {
    var n = sanitizeName(name);
    var base = location.origin + location.pathname;
    // remove index.html do caminho para link limpo
    base = base.replace(/\/index\.html?$/i, "/");
    var u;
    try {
      u = new URL(base);
    } catch (e) {
      u = new URL(location.href);
      u.hash = "";
      u.search = "";
    }
    u.search = "";
    u.hash = "";
    u.searchParams.set("ref", n);
    var ph = sanitizePhone(phone);
    if (ph) u.searchParams.set("rphone", ph);
    return u.toString();
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;left:-9999px;top:0";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error("copy failed"));
      } catch (e) {
        reject(e);
      }
    });
  }

  function ensureStructure(host) {
    // Se o HTML já trouxe o formulário, usa; senão monta.
    var form = host.querySelector("[data-ref-form]");
    var result = host.querySelector("[data-ref-result]");
    if (form && result) return { form: form, result: result, built: false };

    uid += 1;
    var id = "refw" + uid;
    var commission = host.getAttribute("data-commission") || "";
    var theme = host.getAttribute("data-theme") || "default";
    host.classList.add("ref-widget");
    host.setAttribute("data-theme", theme);

    host.innerHTML =
      (commission
        ? '<p class="ref-lead"><strong class="ref-comm">' + escapeHtml(commission) + "</strong></p>"
        : "") +
      '<div class="ref-banner" data-ref-banner hidden></div>' +
      '<div class="ref-form" data-ref-form>' +
      '<div class="ref-field">' +
      '<label for="' +
      id +
      '-name">Seu nome (aparece no WhatsApp)</label>' +
      '<input id="' +
      id +
      '-name" data-ref-name type="text" maxlength="60" autocomplete="name" placeholder="Ex.: Maria Silva" />' +
      "</div>" +
      '<div class="ref-field">' +
      '<label for="' +
      id +
      '-phone">Seu WhatsApp <span class="ref-opt">(opcional)</span></label>' +
      '<input id="' +
      id +
      '-phone" data-ref-phone type="tel" maxlength="20" inputmode="tel" autocomplete="tel" placeholder="Ex.: 11 99410-5856" />' +
      "</div>" +
      '<div class="ref-actions">' +
      '<button type="button" class="ref-btn ref-btn-primary" data-ref-generate>Gerar meu link</button>' +
      "</div>" +
      '<p class="ref-error" data-ref-error hidden></p>' +
      "</div>" +
      '<div class="ref-result" data-ref-result hidden>' +
      "<label>Seu link de indicação</label>" +
      '<div class="ref-link-row">' +
      '<input data-ref-link type="text" readonly />' +
      '<button type="button" class="ref-btn ref-btn-primary" data-act="copy">Copiar</button>' +
      "</div>" +
      '<div class="ref-actions ref-actions-2">' +
      '<a class="ref-btn ref-btn-wa" data-act="wa" href="#" target="_blank" rel="noopener noreferrer">Compartilhar no WhatsApp</a>' +
      '<button type="button" class="ref-btn ref-btn-ghost" data-act="again">Gerar outro</button>' +
      "</div>" +
      '<p class="ref-hint">Quem abrir o link e clicar em WhatsApp enviará: “Indicado por: <em>Seu Nome</em>”.</p>' +
      "</div>";

    return {
      form: host.querySelector("[data-ref-form]"),
      result: host.querySelector("[data-ref-result]"),
      built: true
    };
  }

  function show(el, on) {
    if (!el) return;
    if (on) {
      el.hidden = false;
      el.style.display = "";
      el.removeAttribute("hidden");
    } else {
      el.hidden = true;
      el.setAttribute("hidden", "");
    }
  }

  function bindWidget(host) {
    if (!host || host.getAttribute("data-ref-bound") === "1") return;
    host.setAttribute("data-ref-bound", "1");

    try {
      var theme = host.getAttribute("data-theme") || "default";
      host.classList.add("ref-widget");
      host.setAttribute("data-theme", theme);

      var parts = ensureStructure(host);
      var form = parts.form;
      var result = parts.result;
      if (!form || !result) return;

      var site =
        host.getAttribute("data-site") ||
        host.getAttribute("data-site-name") ||
        "este site";
      var nameInput = form.querySelector("[data-ref-name]") || form.querySelector('input[type="text"]');
      var phoneInput = form.querySelector("[data-ref-phone]") || form.querySelector('input[type="tel"]');
      var genBtn = form.querySelector("[data-ref-generate]");
      var errEl = form.querySelector("[data-ref-error]");
      var linkInput = result.querySelector("[data-ref-link]") || result.querySelector('input[type="text"]');
      var banner = host.querySelector("[data-ref-banner]");

      function setError(msg) {
        if (!errEl) return;
        if (msg) {
          errEl.textContent = msg;
          show(errEl, true);
        } else {
          errEl.textContent = "";
          show(errEl, false);
        }
      }

      function generate() {
        setError("");
        var name = sanitizeName(nameInput ? nameInput.value : "");
        var phone = phoneInput ? phoneInput.value : "";
        if (!name) {
          setError("Digite seu nome para gerar o link.");
          if (nameInput) nameInput.focus();
          return;
        }
        var url = buildShareUrl(name, phone);
        if (linkInput) {
          linkInput.value = url;
          try {
            linkInput.focus();
            linkInput.select();
          } catch (e) { /* ignore */ }
        }
        var waA = result.querySelector('[data-act="wa"]');
        if (waA) {
          waA.setAttribute(
            "href",
            "https://wa.me/?text=" +
              encodeURIComponent(
                "Olá! Indico o " +
                  site +
                  " — use meu link (comissão 20% por venda):\n\n" +
                  url
              )
          );
        }
        show(form, false);
        show(result, true);
        // feedback visual
        host.classList.add("ref-done");
      }

      if (genBtn) {
        genBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          generate();
        });
      }

      // Enter no campo nome também gera (sem submit de form)
      if (nameInput) {
        nameInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            generate();
          }
        });
      }
      if (phoneInput) {
        phoneInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            generate();
          }
        });
      }

      // Se ainda for <form>, bloqueia submit nativo (CSP form-action 'none')
      if (form.tagName === "FORM") {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          e.stopPropagation();
          generate();
        });
      }

      result.addEventListener("click", function (e) {
        var btn = e.target.closest ? e.target.closest("[data-act]") : null;
        if (!btn) return;
        var act = btn.getAttribute("data-act");
        if (act === "copy") {
          e.preventDefault();
          var v = linkInput ? linkInput.value : "";
          if (!v) return;
          copyText(v).then(
            function () {
              var prev = btn.textContent;
              btn.textContent = "Copiado!";
              setTimeout(function () {
                btn.textContent = prev || "Copiar";
              }, 1800);
            },
            function () {
              window.prompt("Copie o link:", v);
            }
          );
        } else if (act === "again") {
          e.preventDefault();
          show(result, false);
          show(form, true);
          host.classList.remove("ref-done");
          if (nameInput) nameInput.focus();
        }
      });

      // banner de visitante indicado
      var active = captureFromURL();
      if (banner && active) {
        banner.innerHTML =
          '<span class="ref-banner-dot" aria-hidden="true"></span>' +
          "Você chegou por indicação de <strong>" +
          escapeHtml(active.name) +
          "</strong>. Obrigado!";
        show(banner, true);
      }

      patchWaLinks(document);
    } catch (err) {
      try {
        host.setAttribute("data-ref-error", String(err && err.message ? err.message : err));
      } catch (e2) { /* ignore */ }
    }
  }

  function init() {
    try {
      captureFromURL();
      patchWaLinks(document);

      document.addEventListener(
        "click",
        function (e) {
          var t = e.target;
          var a = t && t.closest ? t.closest('a[href*="wa.me"]') : null;
          if (!a) return;
          var next = withReferrerInWaUrl(a.getAttribute("href"));
          if (next) a.setAttribute("href", next);
        },
        true
      );

      var hosts = document.querySelectorAll("[data-referral]");
      for (var i = 0; i < hosts.length; i++) bindWidget(hosts[i]);

      // re-tenta se o DOM for injetado depois (SPA)
      if (typeof MutationObserver !== "undefined") {
        var scheduled = false;
        var mo = new MutationObserver(function () {
          if (scheduled) return;
          scheduled = true;
          setTimeout(function () {
            scheduled = false;
            var list = document.querySelectorAll("[data-referral]:not([data-ref-bound='1'])");
            for (var j = 0; j < list.length; j++) bindWidget(list[j]);
            patchWaLinks(document);
          }, 50);
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });
      }
    } catch (e) {
      if (typeof console !== "undefined" && console.error) {
        console.error("[ContbitReferral]", e);
      }
    }
  }

  global.ContbitReferral = {
    getReferrer: getReferrer,
    getReferrerLabel: getReferrerLabel,
    appendReferrerToText: appendReferrerToText,
    withReferrerInWaUrl: withReferrerInWaUrl,
    patchWaLinks: patchWaLinks,
    buildShareUrl: buildShareUrl,
    captureFromURL: captureFromURL,
    init: init
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  // fallback se defer/ordem de scripts atrasar o DOM
  global.addEventListener("load", function () {
    var pending = document.querySelectorAll("[data-referral]:not([data-ref-bound='1'])");
    if (pending.length) init();
  });
})(typeof window !== "undefined" ? window : this);
