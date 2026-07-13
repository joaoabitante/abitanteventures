/*! Contbit Referral v3 — gera link direto para o WhatsApp com nome do indicador.
 * O link NÃO volta ao site: abre wa.me/5511994105856 com a mensagem pronta.
 *
 * Mensagem:
 *   Boa tarde, vim da indicação de {NOME} referente a {PRODUTO}
 *   e aos seus projetos da A Hora da Elisão Fiscal · Contbit · Abitante Ventures · Autista Empreende.
 *
 * HTML: <div data-referral data-site="Contbit" data-product="Contbit" data-wa="5511994105856">
 */
(function (global) {
  "use strict";

  var DEFAULT_WA = "5511994105856";
  var PROJECTS =
    "A Hora da Elisão Fiscal · Contbit · Abitante Ventures · Autista Empreende";
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

  /** Texto que chega no WhatsApp do João */
  function buildReferralMessage(name, product, indicatorPhone) {
    var n = sanitizeName(name) || "um parceiro";
    var prod = sanitizeName(product) || "";
    var msg =
      "Boa tarde, vim da indicação de " +
      n +
      (prod
        ? " referente a " + prod + " e aos seus projetos da " + PROJECTS
        : " referente aos seus projetos da " + PROJECTS) +
      ".";
    var ph = sanitizePhone(indicatorPhone);
    if (ph && ph.length >= 10) {
      msg += "\n\nWhatsApp de quem indicou: " + ph;
    }
    return msg;
  }

  /** Link que a pessoa compartilha — abre o WhatsApp do João com o texto */
  function buildWhatsAppLink(name, product, waNumber, indicatorPhone) {
    var wa = sanitizePhone(waNumber) || DEFAULT_WA;
    var text = buildReferralMessage(name, product, indicatorPhone);
    return "https://wa.me/" + wa + "?text=" + encodeURIComponent(text);
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
    var theme = host.getAttribute("data-theme") || "default";
    host.classList.add("ref-widget");
    host.setAttribute("data-theme", theme);

    host.innerHTML =
      '<p class="ref-lead"><strong class="ref-comm">' +
      escapeHtml(commission) +
      "</strong> Gere o link: quem clicar abre o WhatsApp já com o seu nome na indicação.</p>" +
      '<div class="ref-form" data-ref-form>' +
      '<div class="ref-field">' +
      '<label for="' +
      id +
      '-name">Seu nome (aparece na mensagem do WhatsApp)</label>' +
      '<input id="' +
      id +
      '-name" data-ref-name type="text" maxlength="60" autocomplete="name" placeholder="Ex.: Maria Silva" />' +
      "</div>" +
      '<div class="ref-field">' +
      '<label for="' +
      id +
      '-phone">Seu WhatsApp <span class="ref-opt">(opcional — para pagar a comissão)</span></label>' +
      '<input id="' +
      id +
      '-phone" data-ref-phone type="tel" maxlength="20" inputmode="tel" autocomplete="tel" placeholder="Ex.: 11 99410-5856" />' +
      "</div>" +
      '<div class="ref-actions">' +
      '<button type="button" class="ref-btn ref-btn-primary" data-ref-generate>Gerar link do WhatsApp</button>' +
      "</div>" +
      '<p class="ref-error" data-ref-error hidden></p>' +
      "</div>" +
      '<div class="ref-result" data-ref-result hidden>' +
      "<label>Seu link de indicação (abre o WhatsApp)</label>" +
      '<div class="ref-link-row">' +
      '<input data-ref-link type="text" readonly />' +
      '<button type="button" class="ref-btn ref-btn-primary" data-act="copy">Copiar</button>' +
      "</div>" +
      '<div class="ref-actions ref-actions-2">' +
      '<a class="ref-btn ref-btn-wa" data-act="open" href="#" target="_blank" rel="noopener noreferrer">Abrir no WhatsApp</a>' +
      '<a class="ref-btn ref-btn-wa" data-act="share" href="#" target="_blank" rel="noopener noreferrer">Enviar para alguém</a>' +
      '<button type="button" class="ref-btn ref-btn-ghost" data-act="again">Gerar outro</button>' +
      "</div>" +
      '<p class="ref-hint">Quem clicar no link fala com João no WhatsApp com a mensagem: “Boa tarde, vim da indicação de <em>Seu Nome</em>…”</p>' +
      '<p class="ref-preview" data-ref-preview hidden></p>' +
      "</div>";

    return {
      form: host.querySelector("[data-ref-form]"),
      result: host.querySelector("[data-ref-result]")
    };
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

      // Garante botões de ação se o HTML estático for antigo
      if (!result.querySelector('[data-act="open"]')) {
        var actions = result.querySelector(".ref-actions") || result;
        var openA = document.createElement("a");
        openA.className = "ref-btn ref-btn-wa";
        openA.setAttribute("data-act", "open");
        openA.setAttribute("target", "_blank");
        openA.setAttribute("rel", "noopener noreferrer");
        openA.href = "#";
        openA.textContent = "Abrir no WhatsApp";
        actions.appendChild(openA);
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
          setError("Digite seu nome para gerar o link do WhatsApp.");
          if (nameInput) nameInput.focus();
          return;
        }

        var msg = buildReferralMessage(name, product, phone);
        var url = buildWhatsAppLink(name, product, wa, phone);

        if (linkInput) {
          linkInput.value = url;
          try {
            linkInput.focus();
            linkInput.select();
          } catch (e) { /* ignore */ }
        }

        var openA = result.querySelector('[data-act="open"]');
        if (openA) openA.setAttribute("href", url);

        // "Enviar para alguém" = compartilhar o mesmo link wa.me (a pessoa repassa)
        var shareA = result.querySelector('[data-act="share"]');
        if (shareA) {
          shareA.setAttribute(
            "href",
            "https://wa.me/?text=" +
              encodeURIComponent(
                "Olá! Use este link para falar com o João (indicação minha — comissão 20%):\n\n" +
                  url
              )
          );
        }

        // botão antigo data-act=wa
        var waA = result.querySelector('[data-act="wa"]');
        if (waA) waA.setAttribute("href", url);

        if (preview) {
          preview.textContent = "Prévia da mensagem: “" + msg + "”";
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
        // Atualiza texto do botão se HTML antigo
        if (/gerar meu link/i.test(genBtn.textContent || "")) {
          genBtn.textContent = "Gerar link do WhatsApp";
        }
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
              window.prompt("Copie o link do WhatsApp:", v);
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
