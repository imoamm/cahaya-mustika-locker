/* Cahaya Mustika Internesia — Locker: interaksi & animasi */
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* tema */
  $("#theme")?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (_) {}
  });

  /* loader */
  const cover = $(".cover");
  const hideCover = () => cover && cover.classList.add("gone");
  if (document.readyState === "complete") setTimeout(hideCover, 350);
  else addEventListener("load", () => setTimeout(hideCover, 450));
  setTimeout(hideCover, 2000);

  /* header & progress */
  const hdr = $("#hdr");
  const onScroll = () => {
    hdr?.classList.toggle("stuck", scrollY > 12);
    steps();
  };
  addEventListener("scroll", onScroll, { passive: true });

  /* menu mobile */
  const burger = $("#burger"), mnav = $("#mnav");
  burger?.addEventListener("click", () => {
    const o = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", o);
    mnav.classList.toggle("open", o);
  });
  mnav?.addEventListener("click", e => { if (e.target.closest("a")) { burger.setAttribute("aria-expanded", false); mnav.classList.remove("open"); } });

  /* reveal on scroll + count-up */
  const countUp = el => {
    const to = +el.dataset.count, dur = 1400, t0 = performance.now();
    if (reduce) { el.textContent = to; return; }
    const tick = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    $$("[data-count]", e.target).forEach(countUp);
    if (e.target.matches("[data-count]")) countUp(e.target);
    if (e.target.classList.contains("art")) e.target.classList.add("play");
    io.unobserve(e.target);
  }), { threshold: .15, rootMargin: "0px 0px -6% 0px" });
  $$(".rv,.step").forEach(el => io.observe(el));
  $$(".stats").forEach(el => io.observe(el));

  /* animasi pintu SVG saat terlihat (sekilas) */
  $$(".srow .art, .tpanel .art, .m-art .art").forEach(a => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => a.classList.add("play"), 500); setTimeout(() => a.classList.remove("play"), 2400); } }, { threshold: .6 });
    o.observe(a);
  });

  /* locker wall (hero) */
  const wall = $("#wall");
  if (wall) {
    const doors = $$(".door", wall);
    const toggle = d => { d.classList.toggle("open"); d.setAttribute("aria-pressed", d.classList.contains("open")); };
    doors.forEach(d => d.addEventListener("click", () => toggle(d)));
    const wave = () => doors.forEach((d, i) => setTimeout(() => d.classList.add("open"), i * 110));
    const close = () => doors.forEach((d, i) => setTimeout(() => d.classList.remove("open"), (doors.length - i) * 70));
    let auto;
    const cycle = () => { close(); setTimeout(wave, 1400); };
    setTimeout(wave, 1400);
    if (!reduce) auto = setInterval(cycle, 9000);
    wall.addEventListener("pointerdown", () => clearInterval(auto), { once: true });
    /* parallax miring mengikuti kursor */
    const wrap = wall.parentElement;
    if (!reduce && matchMedia("(hover:hover)").matches) {
      wrap.addEventListener("pointermove", e => {
        const r = wrap.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        wall.style.animation = "none";
        wall.style.transform = `rotateY(${x * 14 - 4}deg) rotateX(${-y * 10 + 2}deg)`;
      });
      wrap.addEventListener("pointerleave", () => { wall.style.transform = ""; wall.style.animation = ""; });
    }
  }

  /* tilt kartu */
  if (!reduce && matchMedia("(hover:hover)").matches) {
    $$(".pcard,.feat,.stat").forEach(c => {
      c.addEventListener("pointermove", e => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-6px)`;
      });
      c.addEventListener("pointerleave", () => { c.style.transform = ""; });
    });
  }

  /* carousel */
  $$("[data-car]").forEach(b => b.addEventListener("click", () => {
    const sec = b.closest("section");
    const car = $("#car", sec) || $(".acar", sec);
    if (!car) return;
    const step = (car.firstElementChild?.getBoundingClientRect().width || 320) + 20;
    car.scrollBy({ left: (+b.dataset.car) * step, behavior: "smooth" });
  }));

  /* filter produk */
  const fbar = $(".filters");
  if (fbar) {
    const pill = $(".pill", fbar), btns = $$("button", fbar), cards = $$(".pcard");
    const place = b => { pill.style.left = b.offsetLeft + "px"; pill.style.width = b.offsetWidth + "px"; };
    btns.forEach(b => b.addEventListener("click", () => {
      btns.forEach(x => x.classList.toggle("on", x === b)); place(b);
      const f = b.dataset.f;
      cards.forEach(c => {
        const show = f === "all" || c.dataset.brand === f;
        if (show) { c.hidden = false; requestAnimationFrame(() => c.classList.remove("off")); }
        else { c.classList.add("off"); setTimeout(() => { if (c.classList.contains("off")) c.hidden = true; }, 350); }
      });
    }));
    const init = () => place($("button.on", fbar));
    init(); addEventListener("resize", init); document.fonts?.ready.then(init);
    const q = new URLSearchParams(location.search).get("brand");
    if (q) $(`button[data-f="${q}"]`, fbar)?.click();
  }

  /* tab solusi */
  $$("[data-tabs]").forEach(box => {
    const bs = $$(".tabs button", box), ps = $$(".tpanel", box);
    bs.forEach((b, i) => b.addEventListener("click", () => {
      bs.forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
      ps.forEach((p, j) => p.classList.toggle("on", i === j));
      const a = $(".art", ps[i]); if (a) { a.classList.remove("play"); setTimeout(() => a.classList.add("play"), 350); setTimeout(() => a.classList.remove("play"), 2200); }
    }));
  });

  /* detail produk (modal) */
  const dlg = $("#pm");
  if (dlg) {
    const set = (id, v) => { $(id, dlg).textContent = v; };
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-detail]");
      if (b) {
        const c = b.closest(".pcard");
        set("#pm-name", c.dataset.name); set("#pm-tag", c.dataset.tag); set("#pm-desc", c.dataset.desc);
        $("#pm-list", dlg).innerHTML = c.dataset.feat.split("|").map(t => `<li>${t}</li>`).join("");
        $("#pm-art", dlg).innerHTML = $(".art", c).innerHTML;
        $("#pm-badge", dlg).className = "badge " + (c.dataset.brand === "Zeco" ? "z" : "v");
        $("#pm-badge", dlg).textContent = c.dataset.brand === "Zeco" ? "Zeco" : "Vivorti";
        $("#pm-wa", dlg).href = c.dataset.wa;
        dlg.showModal();
        setTimeout(() => $("#pm-art", dlg).classList.add("play"), 500);
        return;
      }
      if (e.target.closest(".m-x") || e.target === dlg) { dlg.close(); $("#pm-art", dlg).classList.remove("play"); }
    });
  }

  /* garis proses */
  const stepsEl = $(".steps");
  function steps() {
    if (!stepsEl) return;
    const r = stepsEl.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * .65 - r.top) / r.height));
    stepsEl.style.setProperty("--p", p.toFixed(3));
  }

  /* form kontak -> WhatsApp */
  $("#cform")?.addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const t = `Halo Cahaya Mustika Internesia, saya ingin konsultasi locker.%0A` +
      `Nama: ${encodeURIComponent(f.get("nama"))}%0AInstansi: ${encodeURIComponent(f.get("instansi") || "-")}%0A` +
      `Brand: ${encodeURIComponent(f.get("brand"))}%0AJumlah pintu: ${encodeURIComponent(f.get("jumlah") || "-")}%0A` +
      `Kebutuhan: ${encodeURIComponent(f.get("pesan") || "-")}`;
    open("https://wa.me/628113301819?text=" + t, "_blank", "noopener");
  });

  onScroll();
})();
