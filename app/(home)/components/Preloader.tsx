"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Archivo_Black, Poppins } from "next/font/google";

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"], display: "block" });
const poppinsBlack = Poppins({ weight: "900", subsets: ["latin"], display: "block" });

// El preloader conserva la animación original, pero ya no retiene la página
// más tiempo del necesario: sale cuando el hero tiene su primer fotograma.
const MIN_LOADING_SECONDS = 2.7;
const MAX_LOADING_SECONDS = 3.2;

// SVG del logo MAPE (vectores importados del diseño claude.ai/design)
const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="200 350 1090 900" style="width:min(70vw,58vh);height:auto;font-family:'Archivo Black','Arial Black',sans-serif;transform-box:fill-box;transform-origin:center;animation:plSettle 3.1s cubic-bezier(.22,1,.36,1) 0s both">
<g style="clip-path:inset(0 100% 0 0);animation:plRoad 1.1s cubic-bezier(.22,1,.36,1) .35s both"><path fill="#000000" fill-rule="evenodd" transform="matrix(1.665 0 0 1.665 239.32 456.939)" d="M0 285.035C159.031 216.695 327.34 182.059 500.75 176.676C412.734 212.02 303.352 288.227 240.719 370.289C247.531 320.91 234.734 288.145 202.133 271.969C220.469 263.906 239.117 256.09 257.988 248.602L244.063 243.23C223.41 250.27 203.246 257.578 183.645 265.121C143.309 254.367 82.164 261.008 0 285.035ZM256.184 239.148C266.074 235.855 276.07 232.633 286.176 229.477L297.07 233.68C287.754 237.098 278.473 240.598 269.238 244.184L256.184 239.148ZM298.789 225.59C309.188 222.426 319.691 219.336 330.281 216.328L338.074 219.332C328.281 222.598 318.516 225.969 308.785 229.445L298.789 225.59ZM341.07 213.301C389.012 200.02 438.816 188.387 489.805 178.945C442.949 187.977 395.289 200.691 348.129 216.02L341.07 213.301"></path></g>
<g style="clip-path:circle(0% at 60% 45%);animation:plDisc 1.2s cubic-bezier(.22,1,.36,1) 0s both"><path fill="#ed0404" transform="matrix(1.665 0 0 1.665 239.32 456.939)" d="M369.121 0C315.086 0 266.152 21.914 230.73 57.332C195.309 92.758 173.395 141.688 173.395 195.719C173.395 202.277 173.719 208.762 174.352 215.16C274.391 188.223 383.863 174.438 493.828 172.16C411.43 160.367 313.98 155.375 229.25 166.902C230.793 159.387 232.926 152.086 235.598 145.047C321.898 133.012 410.164 144.727 491.332 163.699C418.867 132.594 330.383 110.352 252.324 113.582C257.063 106.855 262.363 100.566 268.16 94.766C269.316 93.613 270.484 92.484 271.676 91.375C353.234 96.586 416.801 113.609 489.688 154.52C433.012 101.762 371.816 77.949 308.672 66.336C327.031 57.742 347.512 52.941 369.121 52.941C450.469 52.941 511.566 116.102 511.184 192.563C510.688 291.465 408.09 370.594 297.012 333.246C404.246 398.785 563.758 337.078 565.207 192.066C566.254 86.848 484.363 0 369.121 0"></path></g>
<g style="clip-path:inset(0 0 100% 0);animation:plMape .9s cubic-bezier(.22,1,.36,1) 1.75s both"><g style="transform-box:fill-box;transform-origin:center;animation:plRise .9s cubic-bezier(.22,1,.36,1) 1.75s both"><text fill="#000000" font-family="Archivo Black" font-size="127.43" transform="matrix(0.968 0 0 0.968 650.404 1187.816)">M</text></g></g>
<g style="clip-path:inset(0 0 100% 0);animation:plMape .9s cubic-bezier(.22,1,.36,1) 1.83s both"><g style="transform-box:fill-box;transform-origin:center;animation:plRise .9s cubic-bezier(.22,1,.36,1) 1.83s both"><text fill="#000000" font-family="Archivo Black" font-size="127.43" transform="matrix(0.968 0 0 0.968 766.836 1187.816)">A</text></g></g>
<g style="clip-path:inset(0 0 100% 0);animation:plMape .9s cubic-bezier(.22,1,.36,1) 1.91s both"><g style="transform-box:fill-box;transform-origin:center;animation:plRise .9s cubic-bezier(.22,1,.36,1) 1.91s both"><text fill="#000000" font-family="Archivo Black" font-size="127.43" transform="matrix(0.968 0 0 0.968 862.794 1187.816)">P</text></g></g>
<g style="clip-path:inset(0 0 100% 0);animation:plMape .9s cubic-bezier(.22,1,.36,1) 1.99s both"><g style="transform-box:fill-box;transform-origin:center;animation:plRise .9s cubic-bezier(.22,1,.36,1) 1.99s both"><text fill="#000000" font-family="Archivo Black" font-size="127.43" transform="matrix(0.968 0 0 0.968 951.845 1187.816)">E</text></g></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 0.65s both"><text fill="#004aad" font-family="Archivo Black" font-size="52" transform="matrix(0.043 -0.967 0.967 0.043 519.721 793.381)">S</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 0.70s both"><text fill="#004aad" font-family="Archivo Black" font-size="52" transform="matrix(0.18 -0.951 0.951 0.18 522.309 746.901)">U</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 0.75s both"><text fill="#004aad" font-family="Archivo Black" font-size="52" transform="matrix(0.313 -0.916 0.916 0.313 532.896 695.871)">P</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 0.80s both"><text fill="#004aad" font-family="Archivo Black" font-size="52" transform="matrix(0.434 -0.865 0.865 0.434 548.649 651.953)">E</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 0.85s both"><text fill="#004aad" font-family="Archivo Black" font-size="52" transform="matrix(0.549 -0.797 0.797 0.549 570.072 610.563)">R</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 0.90s both"><text fill="#004aad" font-family="Archivo Black" font-size="52" transform="matrix(0.657 -0.711 0.711 0.657 598.668 570.333)">V</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 0.95s both"><text fill="#004aad" font-family="Archivo Black" font-size="52" transform="matrix(0.735 -0.63 0.63 0.735 633.289 534.602)">I</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.00s both"><text fill="#004aad" font-family="Archivo Black" font-size="52" transform="matrix(0.8 -0.545 0.545 0.8 656.35 514.983)">S</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.05s both"><text fill="#004aad" font-family="Archivo Black" font-size="52" transform="matrix(0.856 -0.452 0.452 0.856 695.796 489.43)">I</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.10s both"><text fill="#004aad" font-family="Archivo Black" font-size="52" transform="matrix(0.904 -0.347 0.347 0.904 722.46 475.313)">Ó</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.15s both"><text fill="#004aad" font-family="Archivo Black" font-size="52" transform="matrix(0.945 -0.207 0.207 0.945 771.288 457.399)">N</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.25s both"><text fill="#ebb000" font-family="Archivo Black" font-size="46.66" transform="matrix(0.934 0.254 -0.254 0.934 930.244 443.423)">E</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.30s both"><text fill="#ebb000" font-family="Archivo Black" font-size="46.66" transform="matrix(0.886 0.389 -0.389 0.886 974.124 455.974)">M</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.35s both"><text fill="#ebb000" font-family="Archivo Black" font-size="46.66" transform="matrix(0.819 0.516 -0.516 0.819 1024.504 479.55)">E</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.40s both"><text fill="#ebb000" font-family="Archivo Black" font-size="46.66" transform="matrix(0.741 0.623 -0.623 0.741 1062.79 504.622)">R</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.45s both"><text fill="#ebb000" font-family="Archivo Black" font-size="46.66" transform="matrix(0.643 0.723 -0.723 0.643 1099.116 536.303)">G</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.50s both"><text fill="#ebb000" font-family="Archivo Black" font-size="46.66" transform="matrix(0.535 0.807 -0.807 0.535 1131.981 574.93)">E</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.55s both"><text fill="#ebb000" font-family="Archivo Black" font-size="46.66" transform="matrix(0.416 0.874 -0.874 0.416 1156.625 613.444)">N</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.60s both"><text fill="#ebb000" font-family="Archivo Black" font-size="46.66" transform="matrix(0.286 0.925 -0.925 0.286 1177.476 659.629)">C</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.65s both"><text fill="#ebb000" font-family="Archivo Black" font-size="46.66" transform="matrix(0.176 0.952 -0.952 0.176 1190.577 706.392)">I</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.70s both"><text fill="#ebb000" font-family="Archivo Black" font-size="46.66" transform="matrix(0.065 0.966 -0.966 0.065 1195.968 736.959)">A</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.75s both"><text fill="#ebb000" font-family="Archivo Black" font-size="46.66" transform="matrix(-0.068 0.966 -0.966 -0.068 1198.198 785.195)">S</text></g>
<g style="transform-box:fill-box;transform-origin:center;animation:plLetter .7s cubic-bezier(.22,1,.36,1) 1.20s both"><text fill="#ff1616" font-family="Poppins" font-weight="900" font-size="50" transform="matrix(0.967 0.045 -0.045 0.967 845.904 440.859)">&amp;</text></g>
</svg>`;

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // La animación arranca solo cuando las fuentes reales ya están disponibles,
  // para que las letras nunca se vean con la fuente fallback.
  useEffect(() => {
    let cancelled = false;
    const fontLoads =
      "fonts" in document
        ? Promise.all([
            document.fonts.load(`400 52px ${archivoBlack.style.fontFamily}`),
            document.fonts.load(`900 50px ${poppinsBlack.style.fontFamily}`),
          ]).catch(() => undefined)
        : Promise.resolve();
    const waitFonts = Promise.race([
      fontLoads,
      new Promise((resolve) => setTimeout(resolve, 350)),
    ]);
    waitFonts.finally(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;
    let videoReady = false;
    let minimumReached = false;
    let exited = false;

    const exit = () => {
      if (exited) return;
      exited = true;
      if (statusRef.current) statusRef.current.textContent = "Listo";
      gsap.to(rootRef.current, {
        yPercent: -100,
        duration: 0.85,
        ease: "power4.inOut",
        onComplete: () => setHidden(true),
      });
    };

    const tryExit = () => {
      if (minimumReached && videoReady) exit();
    };

    const heroVideo = document.querySelector<HTMLVideoElement>("[data-preloader-hero-video]");
    const onVideoReady = () => {
      videoReady = true;
      tryExit();
    };
    videoReady = (heroVideo?.readyState ?? 0) >= HTMLMediaElement.HAVE_CURRENT_DATA;
    heroVideo?.addEventListener("loadeddata", onVideoReady, { once: true });
    heroVideo?.addEventListener("canplay", onVideoReady, { once: true });

    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      gsap.timeline()
        .set(rootRef.current, { autoAlpha: 1, yPercent: 0 })
        .set(progressRef.current, { scaleX: 0 })
        .to(counter, {
          value: 100,
          duration: MIN_LOADING_SECONDS,
          ease: "power3.out",
          onUpdate: () => {
            const value = Math.round(counter.value);
            if (percentageRef.current) percentageRef.current.textContent = String(value).padStart(3, "0");
          },
        }, 0)
        .to(progressRef.current, {
          scaleX: 1,
          duration: MIN_LOADING_SECONDS,
          ease: "power2.inOut",
        }, 0)
        .call(() => {
          minimumReached = true;
          tryExit();
        });
    }, rootRef);

    const fallbackTimer = setTimeout(exit, MAX_LOADING_SECONDS * 1000);
    return () => {
      ctx.revert();
      clearTimeout(fallbackTimer);
      heroVideo?.removeEventListener("loadeddata", onVideoReady);
      heroVideo?.removeEventListener("canplay", onVideoReady);
    };
  }, [ready]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pl-root fixed inset-0 z-[999] flex items-center justify-center bg-white text-[#111] will-change-transform ${archivoBlack.className}`}
    >
      <style>{`
        .pl-root svg text { font-family: ${archivoBlack.style.fontFamily} !important; }
        .pl-root svg text[font-family="Poppins"] { font-family: ${poppinsBlack.style.fontFamily} !important; }
        @keyframes plDisc{from{clip-path:circle(0% at 60% 45%)}to{clip-path:circle(75% at 60% 45%)}}
        @keyframes plRoad{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 -5% 0 0)}}
        @keyframes plLetter{from{opacity:0;transform:scale(.4) translateY(6px)}to{opacity:1;transform:none}}
        @keyframes plMape{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(-10% 0 -10% 0)}}
        @keyframes plRise{from{transform:translateY(110px)}to{transform:none}}
        @keyframes plSettle{0%,78%{transform:scale(1)}100%{transform:scale(.94)}}
      `}</style>

      {ready && <div dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />}

      <div
        className="absolute flex items-baseline gap-2"
        style={{
          left: "clamp(24px,5vw,72px)",
          bottom: "clamp(24px,5vw,72px)",
          fontSize: "clamp(40px,7vw,96px)",
          lineHeight: 1,
          letterSpacing: "-.03em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span ref={percentageRef}>000</span>
        <span style={{ fontSize: ".35em", color: "#ed0404" }}>%</span>
      </div>

      <div
        className="absolute uppercase"
        style={{
          right: "clamp(24px,5vw,72px)",
          bottom: "clamp(30px,5.5vw,84px)",
          fontSize: 12,
          letterSpacing: ".2em",
          color: "#777",
        }}
      >
        <span ref={statusRef}>Cargando</span>
      </div>

      {ready && (
        <div
          ref={progressRef}
          className="absolute inset-x-0 bottom-0 h-[3px] bg-[#ed0404] origin-left"
        />
      )}
    </div>
  );
}
