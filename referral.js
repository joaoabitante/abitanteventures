/*! Contbit Referral v4 — link CURTO do site que abre o WhatsApp.
 * Compartilha: https://seudominio/i.html?n=Nome&p=c
 * (em vez do wa.me gigante com texto codificado)
 *
 * HTML: <div data-referral data-product="Contbit" data-wa="5511994105856">
 */
(function (global) {
  "use strict";

  var DEFAULT_WA = "5511994105856";
  var PROJECTS =
    "A Hora da Elisão Fiscal · Contbit · Abitante Ventures · Autista Empreende";
  var uid = 0;

  var PRODUCT_CODE = {
    Contbit: "c",
    contbit: "c",
    "A Hora da Elisão Fiscal": "e",
    elisao: "e",
    "Abitante Ventures": "a",
    abitante: "a",
    "Autista Empreende": "ae"
  };

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

  function productCode(product) {
    if (!product) return "";
    if (PRODUCT_CODE[product]) return PRODUCT_CODE[product];
    var k = String(product).toLowerCase();
    if (k.indexOf("contbit") !== -1) return "c";
    if (k.indexOf("elis") !== -1) return "e";
    if (k.indexOf("abitante") !== -1) return "a";
    if (k.indexOf("autista") !== -1) return "ae";
    return "";
  }

  function buildReferralMessage(name, product, indicatorPhone) {
    var n = sanitizeName(name) || "um parceiro";
    var prod = sanitizeName(product) || "";
    var msg =
      "Boa tarde, vim da indicação de " +
      n +
      (prod ? " referente a " + prod : "") +
      " — projetos: " +
      PROJECTS +
      ".";
    var ph = sanitizePhone(indicatorPhone);
    if (ph && ph.length >= 10) {
      msg += "\nWhatsApp de quem indicou: " + ph;
    }
    return msg;
  }

  /** Link longo do WhatsApp (só uso interno / botão Abrir) */
  function buildWhatsAppLink(name, product, waNumber, indicatorPhone) {
    var wa = sanitizePhone(waNumber) || DEFAULT_WA;
    var text = buildReferralMessage(name, product, indicatorPhone);
    return "https://wa.me/" + wa + "?text=" + encodeURIComponent(text);
  }

  /**
   * Link CURTO para compartilhar.
   * Ex.: https://contbit.tax/i.html?n=Maria+Silva&p=c
   */
  function buildShortLink(name, product, indicatorPhone) {
    var n = sanitizeName(name);
    var base = location.origin + location.pathname.replace(/[^/]*$/, "");
    // garante barra final da pasta
    if (base.slice(-1) !== "/") base += "/";
    var u = new URL(base + "i.html");
    u.searchParams.set("n", n);
    var code = productCode(product);
    if (code) u.searchParams.set("p", code);
    var ph = sanitizePhone(indicatorPhone);
    if (ph && ph.length >= 10) u.searchParams.set("t", ph);
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

  function show(el, on) {
    if (!el) return;
    if (on) {
      el.hidden = false;
      el.removeAttribute("hidden");
      el.style.display = "";
    } else {
      el.hidden = true;
      el.setAttribute("hidden", "");
    }
  }

  function ensureStructure(host) {
    var form = host.querySelector("[data-ref-form]");
    var result = host.querySelector("[data-ref-result]");
    if (form && result) return { form: form, result: result };

    uid += 1;
    var id = "refw" + uid;
    var commission = host.getAttribute("data-commission") || "Comissão: 20% por venda.";
    host.classList.add("ref-widget");
    host.setAttribute("data-theme", host.getAttribute("data-theme") || "default");

    host.innerHTML =
      '<p class="ref-lead"><strong class="ref-comm">' +
      escapeHtml(commission) +
      "</strong> Gere um link curto: quem clicar abre o WhatsApp com a sua indicação.</p>" +
      '<div class="ref-form" data-ref-form>' +
      '<div class="ref-field"><label for="' +
      id +
      '-name">Seu nome</label>' +
      '<input id="' +
      id +
      '-name" data-ref-name type="text" maxlength="60" autocomplete="name" placeholder="Ex.: Maria Silva" /></div>' +
      '<div class="ref-field"><label for="' +
      id +
      '-phone">Seu WhatsApp <span class="ref-opt">(opcional)</span></label>' +
      '<input id="' +
      id +
      '-phone" data-ref-phone type="tel" maxlength="20" inputmode="tel" placeholder="Ex.: 11 99410-5856" /></div>' +
      '<div class="ref-actions"><button type="button" class="ref-btn ref-btn-primary" data-ref-generate>Gerar link curto</button></div>' +
      '<p class="ref-error" data-ref-error hidden></p></div>' +
      '<div class="ref-result" data-ref-result hidden>' +
      "<label>Link curto de indicação</label>" +
      '<div class="ref-link-row"><input data-ref-link type="text" readonly />' +
      '<button type="button" class="ref-btn ref-btn-primary" data-act="copy">Copiar</button></div>' +
      '<div class="ref-actions ref-actions-2">' +
      '<a class="ref-btn ref-btn-wa" data-act="open" href="#" target="_blank" rel="noopener noreferrer">Testar (WhatsApp)</a>' +
      '<a class="ref-btn ref-btn-wa" data-act="share" href="#" target="_blank" rel="noopener noreferrer">Enviar para alguém</a>' +
      '<button type="button" class="ref-btn ref-btn-ghost" data-act="again">Gerar outro</button></div>' +
      '<p class="ref-hint">Quem receber o link curto é levado ao WhatsApp com: “Boa tarde, vim da indicação de <em>Seu Nome</em>…”</p>' +
      '<p class="ref-preview" data-ref-preview hidden></p></div>';

    return {
      form: host.querySelector("[data-ref-form]"),
      result: host.querySelector("[data-ref-result]")
    };
  }

  function bindWidget(host) {
    if (!host || host.getAttribute("data-ref-bound") === "1") return;
    host.setAttribute("data-ref-bound", "1");

    try {
      host.classList.add("ref-widget");
      host.setAttribute("data-theme", host.getAttribute("data-theme") || "default");

      var parts = ensureStructure(host);
      var form = parts.form;
      var result = parts.result;
      if (!form || !result) return;

      var product =
        host.getAttribute("data-product") ||
        host.getAttribute("data-site") ||
        "";
      var wa = host.getAttribute("data-wa") || DEFAULT_WA;

      var nameInput =
        form.querySelector("[data-ref-name]") ||
        form.querySelector('input[type="text"]');
      var phoneInput =
        form.querySelector("[data-ref-phone]") ||
        form.querySelector('input[type="tel"]');
      var genBtn = form.querySelector("[data-ref-generate]");
      var errEl = form.querySelector("[data-ref-error]");
      var linkInput =
        result.querySelector("[data-ref-link]") ||
        result.querySelector('input[type="text"]');
      var preview = result.querySelector("[data-ref-preview]");

      // labels do HTML estático antigo
      var label = result.querySelector("label");
      if (label && /link de indicação/i.test(label.textContent || "")) {
        label.textContent = "Link curto de indicação";
      }
      if (genBtn && /whatsapp|meu link/i.test(genBtn.textContent || "")) {
        genBtn.textContent = "Gerar link curto";
      }

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

        var msg = buildReferralMessage(name, product, phone);
        var shortUrl = buildShortLink(name, product, phone);
        var waUrl = buildWhatsAppLink(name, product, wa, phone);

        if (linkInput) {
          linkInput.value = shortUrl;
          try {
            linkInput.focus();
            linkInput.select();
          } catch (e) { /* ignore */ }
        }

        // Testar = abre WhatsApp já com a mensagem (para o indicador conferir)
        var openA = result.querySelector('[data-act="open"]');
        if (openA) {
          openA.setAttribute("href", waUrl);
          if (/abrir/i.test(openA.textContent || "")) {
            openA.textContent = "Testar (WhatsApp)";
          }
        }

        // Enviar = compartilha o LINK CURTO (não o wa.me enorme)
        var shareA = result.querySelector('[data-act="share"]');
        if (shareA) {
          shareA.setAttribute(
            "href",
            "https://wa.me/?text=" +
              encodeURIComponent(
                "Oi! Fale com o João por este link (indicação minha):\n" + shortUrl
              )
          );
        }

        var waA = result.querySelector('[data-act="wa"]');
        if (waA) waA.setAttribute("href", shortUrl);

        if (preview) {
          preview.innerHTML =
            "<strong>Link curto:</strong> " +
            escapeHtml(shortUrl) +
            "<br><br><strong>Mensagem no WhatsApp:</strong> “" +
            escapeHtml(msg) +
            "”";
          show(preview, true);
        }

        show(form, false);
        show(result, true);
        host.classList.add("ref-done");
      }

      if (genBtn) {
        genBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          generate();
        });
      }

      function onEnter(e) {
        if (e.key === "Enter") {
          e.preventDefault();
          generate();
        }
      }
      if (nameInput) nameInput.addEventListener("keydown", onEnter);
      if (phoneInput) phoneInput.addEventListener("keydown", onEnter);

      if (form.tagName === "FORM") {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
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
              window.prompt("Copie o link curto:", v);
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
    } catch (err) {
      try {
        host.setAttribute(
          "data-ref-error",
          String(err && err.message ? err.message : err)
        );
      } catch (e2) { /* ignore */ }
    }
  }

  function init() {
    try {
      var hosts = document.querySelectorAll("[data-referral]");
      for (var i = 0; i < hosts.length; i++) bindWidget(hosts[i]);

      if (typeof MutationObserver !== "undefined") {
        var scheduled = false;
        var mo = new MutationObserver(function () {
          if (scheduled) return;
          scheduled = true;
          setTimeout(function () {
            scheduled = false;
            var list = document.querySelectorAll(
              "[data-referral]:not([data-ref-bound='1'])"
            );
            for (var j = 0; j < list.length; j++) bindWidget(list[j]);
          }, 50);
        });
        mo.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
      }
    } catch (e) {
      if (typeof console !== "undefined" && console.error) {
        console.error("[ContbitReferral]", e);
      }
    }
  }

  global.ContbitReferral = {
    buildReferralMessage: buildReferralMessage,
    buildWhatsAppLink: buildWhatsAppLink,
    buildShortLink: buildShortLink,
    init: init
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  global.addEventListener("load", function () {
    var pending = document.querySelectorAll(
      "[data-referral]:not([data-ref-bound='1'])"
    );
    if (pending.length) init();
  });
})(typeof window !== "undefined" ? window : this);
