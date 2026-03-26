/**
 * ╔══════════════════════════════════════════════════════╗
 * ║          Portfolio Protection Script                 ║
 * ║          © Hossam Mohamed – All Rights Reserved      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * الحمايات المضمّنة:
 *  1. منع كليك يمين
 *  2. منع اختصارات لوحة المفاتيح (F12 / Ctrl+Shift+I/J/C/U / Ctrl+S / Ctrl+A)
 *  3. كشف DevTools عبر فارق الحجم + timing trick
 *  4. كشف التلاعب بالـ DOM (MutationObserver) – لو اسم "Hossam Mohamed" اتغيّر
 *  5. Anti-debugger loop
 *  6. Console poisoning – تشويش أي شخص يفتح الـ Console
 *  7. شاشة تحذير بدل إيقاف الصفحة فجأة
 */

(function () {
    "use strict";

    /* ─────────────────────────────────────────
       0.  النص المحمي الذي يجب أن يبقى كما هو
    ───────────────────────────────────────── */
    const PROTECTED_NAME = "Hossam Mohamed";

    /* ─────────────────────────────────────────
       HELPER – عرض شاشة التحذير وتجميد الصفحة
    ───────────────────────────────────────── */
    function showWarningAndFreeze(reason) {
        // أوقف أي تحديث للـ DOM
        document.documentElement.style.overflow = "hidden";

        const overlay = document.createElement("div");
        overlay.id = "__prot_overlay__";
        overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: #0a0a0f;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: monospace;
      color: #e11d48;
      text-align: center;
      padding: 2rem;
      pointer-events: all;
      user-select: none;
    `;
        overlay.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <h1 style="font-size:1.8rem;margin:1.2rem 0 .5rem;letter-spacing:.05em;">Access Denied</h1>
      <p style="color:#94a3b8;font-size:.95rem;max-width:420px;line-height:1.7;">
        This page is protected.<br>
        <span style="color:#e11d48;">${reason}</span>
      </p>
      <p style="margin-top:2rem;color:#475569;font-size:.8rem;">© ${new Date().getFullYear()} ${PROTECTED_NAME}</p>
    `;
        document.body.appendChild(overlay);

        // امنع أي تفاعل مع باقي الصفحة
        document.addEventListener("keydown", (e) => e.preventDefault(), true);
        document.addEventListener("mousedown", (e) => e.preventDefault(), true);
    }

    /* ─────────────────────────────────────────
       1.  منع كليك يمين
    ───────────────────────────────────────── */
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        return false;
    });

    /* ─────────────────────────────────────────
       2.  منع اختصارات لوحة المفاتيح
    ───────────────────────────────────────── */
    document.addEventListener("keydown", function (e) {
        const key = e.key ? e.key.toLowerCase() : "";
        const ctrl = e.ctrlKey || e.metaKey;
        const shift = e.shiftKey;

        // F12
        if (e.keyCode === 123) { e.preventDefault(); return false; }

        // Ctrl/Cmd combos
        if (ctrl) {
            // Ctrl+U  (View Source)
            if (key === "u") {
                e.preventDefault();
                window.open("https://www.linkedin.com/in/hossam-mohamed-abd/", "_blank");
                return false;
            }
            // Ctrl+S  (Save Page)
            if (key === "s") { e.preventDefault(); return false; }
            // Ctrl+A  (Select All)
            if (key === "a") { e.preventDefault(); return false; }
            // Ctrl+C  (Copy) – نمنع النسخ
            if (key === "c") { e.preventDefault(); return false; }
            // Ctrl+Shift+I  (Inspector)
            if (shift && key === "i") { e.preventDefault(); return false; }
            // Ctrl+Shift+J  (Console)
            if (shift && key === "j") { e.preventDefault(); return false; }
            // Ctrl+Shift+C  (Element picker)
            if (shift && key === "c") { e.preventDefault(); return false; }
            // Ctrl+P  (Print)
            if (key === "p") { e.preventDefault(); return false; }
        }
    });

    /* ─────────────────────────────────────────
       3.  كشف DevTools عبر فارق الحجم
           + debugger timing trick
    ───────────────────────────────────────── */
    const DEVTOOLS_WIDTH_THRESHOLD = 160;
    const DEVTOOLS_HEIGHT_THRESHOLD = 160;
    let devToolsOpen = false;

    function checkDevToolsBySize() {
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        if (widthDiff > DEVTOOLS_WIDTH_THRESHOLD || heightDiff > DEVTOOLS_HEIGHT_THRESHOLD) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                showWarningAndFreeze("Developer Tools detected. Access to source code is not permitted.");
            }
        } else {
            devToolsOpen = false;
        }
    }

    // Timing trick: debugger statement يبطئ التنفيذ لما DevTools مفتوح
    function checkDevToolsByTiming() {
        const start = performance.now();
        // eslint-disable-next-line no-debugger
        debugger; // linter knows – this is intentional protection
        const elapsed = performance.now() - start;
        if (elapsed > 100) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                showWarningAndFreeze("Developer Tools detected. Access to source code is not permitted.");
            }
        }
    }

    setInterval(checkDevToolsBySize, 800);
    setInterval(checkDevToolsByTiming, 1500);

    /* ─────────────────────────────────────────
       4.  Anti-tamper – MutationObserver
           لو حد غيّر اسم "Hossam Mohamed"
           في أي عنصر بالـ DOM
    ───────────────────────────────────────── */
    const observer = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            // فحص إضافة عناصر جديدة
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        checkNodeText(node);
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        node.querySelectorAll("*").forEach(function (el) {
                            if (el.childNodes) {
                                el.childNodes.forEach(function (child) {
                                    if (child.nodeType === Node.TEXT_NODE) checkNodeText(child);
                                });
                            }
                        });
                    }
                });
            }

            // فحص تغيير محتوى النصوص
            if (mutation.type === "characterData") {
                checkNodeText(mutation.target);
            }

            // فحص تغيير الـ attributes
            if (mutation.type === "attributes") {
                const el = mutation.target;
                // لو حد عدّل title أو alt أو placeholder
                ["title", "alt", "placeholder", "content", "value"].forEach(function (attr) {
                    const val = el.getAttribute(attr);
                    if (val && looksLikeTampered(val)) {
                        showWarningAndFreeze("DOM tampering detected. Unauthorized modification of protected content.");
                    }
                });
            }
        }
    });

    function checkNodeText(textNode) {
        const text = textNode.textContent || "";
        if (looksLikeTampered(text)) {
            showWarningAndFreeze("DOM tampering detected. Unauthorized modification of protected content.");
        }
    }

    /**
     * يكشف لو نص يحتوي على "Hossam Mohamed" لكن بعد التحريف:
     *   – الاسم مش موجود خالص رغم إن العنصر كان يحتويه
     *   – أو فيه HTML injection في مكانه
     * الفكرة: نسجّل fingerprint لكل عنصر يحتوي على الاسم عند أول تحميل
     * ثم نقارنه
     */
    function looksLikeTampered(text) {
        // لو فيه script أو on-event أو data: في نص عادي
        const dangerPatterns = [
            /<script/i,
            /on\w+\s*=/i,
            /javascript:/i,
            /data:text\/html/i,
            /vbscript:/i,
        ];
        return dangerPatterns.some((rx) => rx.test(text));
    }

    // سجّل fingerprints للعناصر التي تحتوي على الاسم المحمي
    const nameFingerprints = new Map();

    function buildFingerprints() {
        document.querySelectorAll("*").forEach(function (el) {
            if (el.childNodes) {
                el.childNodes.forEach(function (child) {
                    if (child.nodeType === Node.TEXT_NODE) {
                        const txt = child.textContent.trim();
                        if (txt.includes(PROTECTED_NAME)) {
                            nameFingerprints.set(child, txt);
                        }
                    }
                });
            }
        });
    }

    function verifyFingerprints() {
        nameFingerprints.forEach(function (original, node) {
            // لو العنصر اتحذف أو اتغيّر
            if (!document.contains(node) || node.textContent.trim() !== original) {
                showWarningAndFreeze("DOM tampering detected. Content integrity check failed.");
            }
        });
    }

    // ابدأ بعد اكتمال الصفحة
    window.addEventListener("load", function () {
        buildFingerprints();

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ["title", "alt", "placeholder", "content", "value", "href", "src"],
        });

        setInterval(verifyFingerprints, 1000);
    });

    /* ─────────────────────────────────────────
       5.  Console Poisoning
           لو حد فتح الـ Console هيشوف رسالة تحذير
           بدل ما يقدر يشتغل
    ───────────────────────────────────────── */
    const _warn = console.warn.bind(console);

    // طغيان الـ console بعمليات لا تنتهي لو حد حاول يشيل الحماية
    const consolePoisonMsg = `
%c⛔ STOP!
%cThis browser feature is intended for developers.
If someone told you to paste something here, they are trying to scam you.
This site is protected by © ${PROTECTED_NAME}.
  `;
    console.log(consolePoisonMsg,
        "color:#e11d48;font-size:2rem;font-weight:bold;",
        "color:#94a3b8;font-size:1rem;"
    );

    // Override console methods لإرباك أي شخص يحاول استخدام الـ console
    ["log", "info", "warn", "error", "dir", "table"].forEach(function (method) {
        const original = console[method].bind(console);
        console[method] = function (...args) {
            original(
                `%c[Protected] %c`,
                "color:#e11d48;font-weight:bold;",
                "",
                ...args
            );
        };
    });

    /* ─────────────────────────────────────────
       6.  منع الـ Print
    ───────────────────────────────────────── */
    window.addEventListener("beforeprint", function (e) {
        e.preventDefault();
        showWarningAndFreeze("Printing is disabled for this protected page.");
    });

    /* ─────────────────────────────────────────
       7.  منع تحديد النص والـ Drag
    ───────────────────────────────────────── */
    document.addEventListener("selectstart", function (e) {
        e.preventDefault();
        return false;
    });

    document.addEventListener("dragstart", function (e) {
        e.preventDefault();
        return false;
    });

    /* ─────────────────────────────────────────
       8.  إخفاء الكود من الـ toString
           (يصعّب الـ reverse engineering)
    ───────────────────────────────────────── */
    (function antiReflection() {
        const _toString = Function.prototype.toString;
        Function.prototype.toString = function () {
            // لو حد حاول يطبع source code لأي function من الموقع
            return "function() { [native code] }";
        };
        // نحمي الـ toString نفسها
        Function.prototype.toString.toString = function () {
            return "function() { [native code] }";
        };
    })();

})();