/*! Contbit Referral — link de indicação + WhatsApp com nome do indicador.
 * Uso: <div data-referral data-site="Contbit" data-wa="5511994105856"></div>
 *      <script src="referral.js" defer></script>
 * URL: ?ref=Nome+Da+Pessoa  → grava no localStorage e entra no texto do WhatsApp.
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "contbit_referral_v1";
  var TTL_MS = 90 * 24 * 60 * 60 * 1000;
  var IND_RE = /Indicado por\s*:/i;

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
      if (!o.name) return null;
      return o;
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
      var name = sanitizeName(decodeURIComponent(ref));
      if (!name) return readStore();
      var phone = sanitizePhone(p.get("rphone") || p.get("tel") || "");
      return writeStore(name, phone);
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
      var decoded = "";
      try { decoded = decodeURIComponent(text); } catch (e) { decoded = text; }
      if (IND_RE.test(decoded)) return href;
      u.searchParams.set("text", appendReferrerToText(decoded));
      return u.toString();
    } catch (e) {
      return href;
    }
  }

  function patchWaLinks(root) {
    var scope = root || document;
    var links = scope.querySelectorAll('a[href*="wa.me"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (a.dataset.refPatched === "1") continue;
      var next = withReferrerInWaUrl(a.getAttribute("href"));
      if (next && next !== a.getAttribute("href")) {
        a.setAttribute("href", next);
        a.dataset.refPatched = "1";
      }
    }
  }

  function buildShareUrl(name, phone) {
    var n = sanitizeName(name);
    var u = new URL(location.origin + location.pathname);
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
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
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

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function mountWidget(host) {
    if (!host || host.dataset.refMounted === "1") return;
    host.dataset.refMounted = "1";

    var site = host.getAttribute("data-site") || host.getAttribute("data-site-name") || document.title || "este site";
    var wa = sanitizePhone(host.getAttribute("data-wa") || "5511994105856") || "5511994105856";
    var commission = host.getAttribute("data-commission") || "";
    var theme = host.getAttribute("data-theme") || "default";

    host.classList.add("ref-widget");
    host.setAttribute("data-theme", theme);

    var title = el("h2", "ref-title", "Indique e ganhe comissão");
    var lead = el(
      "p",
      "ref-lead",
      "Crie seu link de indicação. Quando alguém entrar por ele e falar no WhatsApp, " +
        "o nome de quem indicou aparece na mensagem — assim a comissão é rastreável."
    );
    if (commission) {
      lead.innerHTML +=
        ' <strong class="ref-comm">' + commission.replace(/[<>&]/g, "") + "</strong>";
    }

    var form = el("form", "ref-form");
    form.setAttribute("novalidate", "");

    var row1 = el("div", "ref-field");
    row1.innerHTML =
      '<label for="ref-name">Seu nome (aparece no WhatsApp)</label>' +
      '<input id="ref-name" name="name" type="text" maxlength="60" required autocomplete="name" placeholder="Ex.: Maria Silva" />';

    var row2 = el("div", "ref-field");
    row2.innerHTML =
      '<label for="ref-phone">Seu WhatsApp <span class="ref-opt">(opcional — para contato da comissão)</span></label>' +
      '<input id="ref-phone" name="phone" type="tel" maxlength="20" inputmode="tel" autocomplete="tel" placeholder="Ex.: 11 99410-5856" />';

    var actions = el("div", "ref-actions");
    var btnGen = el("button", "ref-btn ref-btn-primary", "Gerar meu link");
    btnGen.type = "submit";
    actions.appendChild(btnGen);

    form.appendChild(row1);
    form.appendChild(row2);
    form.appendChild(actions);

    var result = el("div", "ref-result");
    result.hidden = true;
    result.innerHTML =
      '<label for="ref-link">Seu link de indicação</label>' +
      '<div class="ref-link-row">' +
      '<input id="ref-link" type="text" readonly />' +
      '<button type="button" class="ref-btn ref-btn-primary" data-act="copy">Copiar</button>' +
      "</div>" +
      '<div class="ref-actions ref-actions-2">' +
      '<a class="ref-btn ref-btn-wa" data-act="wa" target="_blank" rel="noopener noreferrer">Compartilhar no WhatsApp</a>' +
      '<button type="button" class="ref-btn ref-btn-ghost" data-act="again">Gerar outro</button>' +
      "</div>" +
      '<p class="ref-hint">Quem abrir o link e clicar em WhatsApp enviará algo como: “Indicado por: <em>Seu Nome</em>”.</p>';

    var banner = el("div", "ref-banner");
    banner.hidden = true;

    host.appendChild(title);
    host.appendChild(lead);
    host.appendChild(banner);
    host.appendChild(form);
    host.appendChild(result);

    function showBanner(ref) {
      if (!ref) {
        banner.hidden = true;
        return;
      }
      banner.hidden = false;
      banner.innerHTML =
        '<span class="ref-banner-dot" aria-hidden="true"></span>' +
        "Você chegou por indicação de <strong>" +
        ref.name.replace(/[<>&]/g, "") +
        "</strong>. Obrigado!";
    }

    var active = captureFromURL();
    showBanner(active);
    patchWaLinks(document);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = sanitizeName(form.querySelector("#ref-name").value);
      var phone = form.querySelector("#ref-phone").value;
      if (!name) {
        form.querySelector("#ref-name").focus();
        return;
      }
      var url = buildShareUrl(name, phone);
      var linkInput = result.querySelector("#ref-link");
      linkInput.value = url;
      result.hidden = false;
      form.hidden = true;

      var waShare =
        "https://wa.me/?text=" +
        encodeURIComponent(
          "Olá! Indico o " +
            site +
            " — use meu link para conhecer e, se fechar, eu recebo comissão:\n\n" +
            url
        );
      result.querySelector('[data-act="wa"]').setAttribute("href", waShare);

      try {
        linkInput.focus();
        linkInput.select();
      } catch (err) { /* ignore */ }
    });

    result.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-act]");
      if (!btn) return;
      var act = btn.getAttribute("data-act");
      if (act === "copy") {
        var v = result.querySelector("#ref-link").value;
        copyText(v).then(
          function () {
            btn.textContent = "Copiado!";
            setTimeout(function () {
              btn.textContent = "Copiar";
            }, 1800);
          },
          function () {
            prompt("Copie o link:", v);
          }
        );
      } else if (act === "again") {
        result.hidden = true;
        form.hidden = false;
        form.querySelector("#ref-name").focus();
      }
    });
  }

  function init() {
    captureFromURL();
    patchWaLinks(document);

    document.addEventListener(
      "click",
      function (e) {
        var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
        if (!a) return;
        var next = withReferrerInWaUrl(a.getAttribute("href"));
        if (next) a.setAttribute("href", next);
      },
      true
    );

    var hosts = document.querySelectorAll("[data-referral]");
    for (var i = 0; i < hosts.length; i++) mountWidget(hosts[i]);

    // Links WA injetados depois (SPA / render dinâmico)
    if (typeof MutationObserver !== "undefined") {
      var mo = new MutationObserver(function () {
        patchWaLinks(document);
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  var api = {
    getReferrer: getReferrer,
    getReferrerLabel: getReferrerLabel,
    appendReferrerToText: appendReferrerToText,
    withReferrerInWaUrl: withReferrerInWaUrl,
    patchWaLinks: patchWaLinks,
    buildShareUrl: buildShareUrl,
    captureFromURL: captureFromURL,
    init: init
  };

  global.ContbitReferral = api;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : this);
