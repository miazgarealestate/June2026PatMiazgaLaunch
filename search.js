/* Pat Miazga site search — self-contained widget, no dependencies.
   Loads /search-index.json, injects its own styles + markup, and provides
   an instant filtered search over guides, communities, and town pages. */
(function () {
  "use strict";

  var STYLE = "\
  .pm-search-trigger{background:none;border:none;cursor:pointer;color:inherit;font-size:17px;\
    padding:6px 10px;margin-left:8px;line-height:1;display:inline-flex;align-items:center;opacity:.9}\
  .pm-search-trigger:hover{opacity:1}\
  .pm-search-overlay{position:fixed;inset:0;background:rgba(26,26,24,.55);z-index:9999;\
    display:none;align-items:flex-start;justify-content:center;padding:10vh 16px 0}\
  .pm-search-overlay.pm-open{display:flex}\
  .pm-search-box{background:#fff;width:100%;max-width:560px;border-radius:10px;overflow:hidden;\
    box-shadow:0 20px 60px rgba(0,0,0,.35);font-family:Inter,system-ui,sans-serif}\
  .pm-search-input-row{display:flex;align-items:center;border-bottom:1px solid #e2ddd6;padding:14px 16px}\
  .pm-search-input-row input{border:none;outline:none;font-size:16px;flex:1;font-family:inherit;color:#1a1a18}\
  .pm-search-close{background:none;border:none;cursor:pointer;font-size:20px;color:#7a7468;padding:0 4px}\
  .pm-search-results{max-height:60vh;overflow-y:auto}\
  .pm-search-empty{padding:24px 16px;color:#7a7468;font-size:14px;text-align:center}\
  .pm-search-result{display:block;padding:12px 16px;text-decoration:none;border-bottom:1px solid #f0ede8}\
  .pm-search-result:hover,.pm-search-result.pm-active{background:#f7f4ef}\
  .pm-search-tag{display:inline-block;font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;\
    color:#8b6f47;margin-bottom:3px}\
  .pm-search-rtitle{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.05rem;color:#1a1a18;font-weight:600;line-height:1.25}\
  .pm-search-rdesc{font-size:12.5px;color:#7a7468;margin-top:2px;line-height:1.4}\
  .pm-search-hint{padding:10px 16px;font-size:11px;color:#a39c8f;border-top:1px solid #f0ede8}\
  @media(max-width:480px){.pm-search-overlay{padding:0}.pm-search-box{max-width:100%;height:100%;border-radius:0}\
    .pm-search-results{max-height:calc(100vh - 60px)}}\
  ";

  function injectStyle() {
    var s = document.createElement("style");
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function score(item, q) {
    q = q.toLowerCase();
    var title = (item.title || "").toLowerCase();
    var desc = (item.desc || "").toLowerCase();
    var cat = (item.category || "").toLowerCase();
    var sc = 0;
    if (title.indexOf(q) === 0) sc += 100;
    else if (title.indexOf(q) > -1) sc += 60;
    if (cat.indexOf(q) > -1) sc += 20;
    if (desc.indexOf(q) > -1) sc += 25;
    // word overlap bonus
    var words = q.split(/\s+/).filter(Boolean);
    words.forEach(function (w) {
      if (w.length < 2) return;
      if (title.indexOf(w) > -1) sc += 8;
      if (desc.indexOf(w) > -1) sc += 3;
    });
    return sc;
  }

  function buildOverlay(data) {
    var overlay = document.createElement("div");
    overlay.className = "pm-search-overlay";
    overlay.innerHTML =
      '<div class="pm-search-box">' +
      '  <div class="pm-search-input-row">' +
      '    <input type="text" placeholder="Search guides, communities, towns\u2026" aria-label="Site search" autocomplete="off">' +
      '    <button class="pm-search-close" aria-label="Close search">\u2715</button>' +
      "  </div>" +
      '  <div class="pm-search-results"></div>' +
      '  <div class="pm-search-hint">Try a community name, "SVT", "manufactured home", or a town like Oliver</div>' +
      "</div>";
    document.body.appendChild(overlay);

    var input = overlay.querySelector("input");
    var resultsEl = overlay.querySelector(".pm-search-results");
    var closeBtn = overlay.querySelector(".pm-search-close");

    function render(items) {
      if (!items.length) {
        resultsEl.innerHTML = '<div class="pm-search-empty">No matches yet \u2014 try a different word.</div>';
        return;
      }
      resultsEl.innerHTML = items
        .slice(0, 12)
        .map(function (it) {
          return (
            '<a class="pm-search-result" href="' + it.url + '">' +
            '<span class="pm-search-tag">' + it.category + "</span>" +
            '<div class="pm-search-rtitle">' + it.title + "</div>" +
            '<div class="pm-search-rdesc">' + it.desc + "</div>" +
            "</a>"
          );
        })
        .join("");
    }

    function runSearch() {
      var q = input.value.trim();
      if (!q) {
        render(data.slice(0, 8));
        return;
      }
      var ranked = data
        .map(function (it) { return { it: it, s: score(it, q) }; })
        .filter(function (r) { return r.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .map(function (r) { return r.it; });
      render(ranked);
    }

    input.addEventListener("input", runSearch);

    function open() {
      overlay.classList.add("pm-open");
      render(data.slice(0, 8));
      setTimeout(function () { input.focus(); }, 30);
    }
    function close() {
      overlay.classList.remove("pm-open");
      input.value = "";
    }

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        overlay.classList.contains("pm-open") ? close() : open();
      }
    });

    return { open: open, close: close };
  }

  function init() {
    injectStyle();
    var triggers = document.querySelectorAll(".pm-search-trigger");
    if (!triggers.length) return;

    fetch("/search-index.json")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var ctl = buildOverlay(data);
        triggers.forEach(function (btn) {
          btn.addEventListener("click", ctl.open);
        });
      })
      .catch(function () {
        /* fail silently if index isn't reachable */
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
