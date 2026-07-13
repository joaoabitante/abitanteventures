/*! Redirect curto → WhatsApp com mensagem de indicação.
 * URL: /i.html?n=Nome&p=c|e|a  (t=telefone opcional do indicador)
 */
(function () {
  "use strict";

  var WA = "5511994105856";
  var PROJECTS =
    "A Hora da Elisão Fiscal · Contbit · Abitante Ventures · Autista Empreende";

  var PRODUCT_MAP = {
    c: "Contbit",
    contbit: "Contbit",
    e: "A Hora da Elisão Fiscal",
    elisao: "A Hora da Elisão Fiscal",
    ef: "A Hora da Elisão Fiscal",
    a: "Abitante Ventures",
    abitante: "Abitante Ventures",
    ja: "Abitante Ventures",
    ae: "Autista Empreende"
  };

  function clean(s) {
    return String(s || "")
      .replace(/[<>"'`\\]/g, "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60);
  }

  function digits(s) {
    return String(s || "").replace(/\D/g, "").slice(0, 15);
  }

  function productFromHost() {
    var h = (location.hostname || "").toLowerCase();
    if (h.indexOf("contbit") !== -1) return "Contbit";
    if (h.indexOf("elisao") !== -1 || h.indexOf("elisaofiscal") !== -1)
      return "A Hora da Elisão Fiscal";
    if (h.indexOf("abitante") !== -1) return "Abitante Ventures";
    return "";
  }

  function resolveProduct(code) {
    if (!code) return productFromHost();
    var key = String(code).toLowerCase();
    if (PRODUCT_MAP[key]) return PRODUCT_MAP[key];
    return clean(code);
  }

  function buildMessage(name, product, phone) {
    var n = clean(name) || "um parceiro";
    var prod = resolveProduct(product);
    var msg =
      "Boa tarde, vim da indicação de " +
      n +
      (prod ? " referente a " + prod : "") +
      " — projetos: " +
      PROJECTS +
      ".";
    var ph = digits(phone);
    if (ph.length >= 10) msg += "\nWhatsApp de quem indicou: " + ph;
    return msg;
  }

  function waUrl(name, product, phone) {
    return (
      "https://wa.me/" +
      WA +
      "?text=" +
      encodeURIComponent(buildMessage(name, product, phone))
    );
  }

  try {
    var q = new URLSearchParams(location.search);
    var name = q.get("n") || q.get("nome") || q.get("ref") || "";
    var product = q.get("p") || q.get("produto") || "";
    var phone = q.get("t") || q.get("tel") || "";
    var href = waUrl(name, product, phone);

    var a = document.getElementById("go");
    if (a) {
      a.setAttribute("href", href);
      a.setAttribute("rel", "noopener noreferrer");
    }
    var prev = document.getElementById("preview");
    if (prev) prev.textContent = buildMessage(name, product, phone);

    // redireciona na hora
    location.replace(href);
  } catch (e) {
    var err = document.getElementById("err");
    if (err) err.hidden = false;
  }
})();
