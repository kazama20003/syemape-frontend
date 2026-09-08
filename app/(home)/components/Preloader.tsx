"use client";

import { useEffect, useState } from "react";

const HIDE_AFTER_MS = 2600;
const FADE_MS = 600;

export default function Preloader() {
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), HIDE_AFTER_MS);
    const hideTimer = setTimeout(() => setHidden(true), HIDE_AFTER_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[999] grid place-items-center bg-white"
      style={{ opacity: fading ? 0 : 1, transition: `opacity ${FADE_MS}ms ease` }}
    >
      <style>{`
        .mape-preloader { width: 88vw; max-width: 560px; height: auto; max-height: 80vh; overflow: visible; transform-origin: 50% 50%; }

        .anim-crescent-body { transform-origin: 500px 330px; animation: crescentMotion 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        @keyframes crescentMotion {
          0% { opacity: 0; transform: scale(0.85) rotate(-25deg); }
          14% { opacity: 1; transform: scale(1) rotate(0deg); }
          54% { opacity: 1; transform: scale(1.02) rotate(2deg); }
          68% { opacity: 0.95; transform: scale(1.06) rotate(38deg) translate(20px, -15px); }
          86% { opacity: 0.45; transform: scale(1.22) rotate(115deg) translate(140px, -120px); }
          94%, 100% { opacity: 0; transform: scale(1.35) rotate(160deg) translate(260px, -200px); }
        }

        .anim-crescent-stroke { stroke-dasharray: 1500; stroke-dashoffset: 1500; animation: crescentStrokeDraw 4.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        @keyframes crescentStrokeDraw {
          0% { stroke-dashoffset: 1500; opacity: 0; }
          12% { opacity: 1; }
          48% { stroke-dashoffset: 0; opacity: 1; }
          68% { stroke-dashoffset: -200; opacity: 0.8; }
          85%, 100% { stroke-dashoffset: -1500; opacity: 0; }
        }

        .anim-wing-1 { transform-origin: 660px 334px; animation: wingOneCycle 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        .anim-wing-2 { transform-origin: 660px 334px; animation: wingTwoCycle 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        .anim-wing-3 { transform-origin: 660px 334px; animation: wingThreeCycle 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        @keyframes wingOneCycle {
          0% { opacity: 0; transform: translateX(-40px) scale(0.7); }
          14% { opacity: 1; transform: translateX(0) scale(1); }
          35% { transform: translateX(4px) scale(1.02); }
          54% { opacity: 1; transform: translateX(0) scale(1); }
          68% { opacity: 0.9; transform: rotate(24deg) translate(30px, -20px) scale(1.05); }
          86% { opacity: 0.35; transform: rotate(85deg) translate(180px, -90px) scale(1.15); }
          94%, 100% { opacity: 0; transform: rotate(130deg) translate(310px, -150px) scale(1.3); }
        }
        @keyframes wingTwoCycle {
          0% { opacity: 0; transform: translateX(-35px) scale(0.75); }
          16% { opacity: 1; transform: translateX(0) scale(1); }
          38% { transform: translateX(5px) scale(1.03); }
          54% { opacity: 1; transform: translateX(0) scale(1); }
          68% { opacity: 0.85; transform: rotate(32deg) translate(40px, 0px) scale(1.06); }
          86% { opacity: 0.3; transform: rotate(95deg) translate(210px, -40px) scale(1.2); }
          94%, 100% { opacity: 0; transform: rotate(140deg) translate(340px, -70px) scale(1.35); }
        }
        @keyframes wingThreeCycle {
          0% { opacity: 0; transform: translateX(-30px) scale(0.8); }
          18% { opacity: 1; transform: translateX(0) scale(1); }
          40% { transform: translateX(6px) scale(1.03); }
          54% { opacity: 1; transform: translateX(0) scale(1); }
          68% { opacity: 0.8; transform: rotate(40deg) translate(45px, 20px) scale(1.07); }
          86% { opacity: 0.25; transform: rotate(110deg) translate(230px, 20px) scale(1.22); }
          94%, 100% { opacity: 0; transform: rotate(155deg) translate(360px, 30px) scale(1.4); }
        }

        .anim-highway-group { transform-origin: 360px 480px; animation: highwayMotion 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        @keyframes highwayMotion {
          0% { opacity: 0; transform: translateX(-60px) scale(0.9); }
          16% { opacity: 1; transform: translateX(0) scale(1); }
          54% { opacity: 1; transform: scale(1.01); }
          68% { opacity: 0.95; transform: rotate(-18deg) translate(-25px, 15px); }
          86% { opacity: 0.4; transform: rotate(-55deg) translate(-170px, 110px) scale(1.15); }
          94%, 100% { opacity: 0; transform: rotate(-85deg) translate(-290px, 200px) scale(1.3); }
        }

        .highway-dash-run { stroke-dasharray: 42 38; stroke-dashoffset: 0; animation: highwayDashes 0.55s linear infinite; }
        @keyframes highwayDashes { 0% { stroke-dashoffset: 80; } 100% { stroke-dashoffset: 0; } }

        .anim-text-arc-group { transform-origin: 500px 330px; animation: textArcCycle 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        @keyframes textArcCycle {
          0% { opacity: 0; transform: scale(0.8) rotate(-15deg); }
          14% { opacity: 1; transform: scale(1) rotate(0deg); }
          38% { transform: scale(1.015) rotate(0deg); }
          54% { opacity: 1; transform: scale(1) rotate(0deg); }
          68% { opacity: 0.95; transform: rotate(-28deg) translate(-25px, -15px) scale(1.04); }
          86% { opacity: 0.35; transform: rotate(-80deg) translate(-160px, -90px) scale(1.2); }
          94%, 100% { opacity: 0; transform: rotate(-125deg) translate(-280px, -160px) scale(1.38); }
        }

        .anim-mape-wordmark { transform-origin: 500px 700px; animation: mapeWordmarkCycle 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        @keyframes mapeWordmarkCycle {
          0% { opacity: 0; transform: translateY(35px) scale(0.9); }
          16% { opacity: 1; transform: translateY(0) scale(1); }
          54% { opacity: 1; transform: scale(1.01); }
          68% { opacity: 0.92; transform: rotate(20deg) translate(30px, 20px) scale(1.06); }
          86% { opacity: 0.3; transform: rotate(60deg) translate(180px, 120px) scale(1.22); }
          94%, 100% { opacity: 0; transform: rotate(95deg) translate(300px, 210px) scale(1.4); }
        }

        .anim-orbit-sweeper { transform-origin: 500px 330px; animation: orbitSpin 4.8s linear infinite; }
        @keyframes orbitSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .anim-burst-arrow-1 { transform-origin: 500px 330px; animation: burstOne 4.8s cubic-bezier(0.2, 0.8, 0.4, 1.2) infinite; }
        .anim-burst-arrow-2 { transform-origin: 500px 330px; animation: burstTwo 4.8s cubic-bezier(0.2, 0.8, 0.4, 1.2) infinite; }
        .anim-burst-arrow-3 { transform-origin: 500px 330px; animation: burstThree 4.8s cubic-bezier(0.2, 0.8, 0.4, 1.2) infinite; }
        @keyframes burstOne {
          0%, 55% { opacity: 0; transform: scale(0.6) rotate(0deg) translate(0, 0); }
          68% { opacity: 1; transform: scale(1.1) rotate(45deg) translate(50px, -40px); }
          88% { opacity: 0.4; transform: scale(1.4) rotate(110deg) translate(160px, -110px); }
          95%, 100% { opacity: 0; transform: scale(1.7) rotate(160deg) translate(260px, -180px); }
        }
        @keyframes burstTwo {
          0%, 55% { opacity: 0; transform: scale(0.6) rotate(0deg) translate(0, 0); }
          68% { opacity: 1; transform: scale(1.1) rotate(-35deg) translate(-40px, -50px); }
          88% { opacity: 0.4; transform: scale(1.4) rotate(-90deg) translate(-140px, -130px); }
          95%, 100% { opacity: 0; transform: scale(1.7) rotate(-140deg) translate(-240px, -200px); }
        }
        @keyframes burstThree {
          0%, 55% { opacity: 0; transform: scale(0.6) rotate(0deg) translate(0, 0); }
          68% { opacity: 1; transform: scale(1.1) rotate(70deg) translate(60px, 30px); }
          88% { opacity: 0.4; transform: scale(1.4) rotate(130deg) translate(170px, 90px); }
          95%, 100% { opacity: 0; transform: scale(1.7) rotate(180deg) translate(270px, 150px); }
        }

        .anim-loader-dots { animation: dotsFade 4.8s ease-in-out infinite; }
        @keyframes dotsFade { 0%, 15% { opacity: 0; } 22%, 58% { opacity: 1; } 72%, 100% { opacity: 0; } }

        @media (prefers-reduced-motion: reduce) {
          .mape-preloader * { animation: none !important; stroke-dashoffset: 0 !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <svg
        className="mape-preloader"
        viewBox="0 0 920 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="MAPE Supervisión & Emergencias"
      >
        <defs>
          <linearGradient id="orbitGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC72C" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF2A36" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0055A5" stopOpacity="1" />
          </linearGradient>

          <filter id="softGlowRed" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Arco del texto: sigue la curva exterior del aro */}
          <path id="textHaloArc" d="M 234 411 A 278 278 0 1 1 766 411" fill="none" />
        </defs>

        {/* Anillos orbitales sutiles de fondo */}
        <g className="anim-orbit-sweeper" opacity="0.25">
          <circle cx="500" cy="330" r="345" stroke="url(#orbitGlowGrad)" strokeWidth="2" strokeDasharray="10 35" fill="none" />
          <path d="M 500 -15 A 345 345 0 0 1 845 330" fill="none" stroke="url(#orbitGlowGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="85 320" />
        </g>

        {/* Flechas de dispersión (solo en la fase final) */}
        <g filter="url(#softGlowRed)">
          <g className="anim-burst-arrow-1">
            <path d="M 700 150 L 750 125 L 725 175 L 732 152 Z" fill="#E30613" />
          </g>
          <g className="anim-burst-arrow-2">
            <path d="M 300 150 L 250 125 L 275 175 L 268 152 Z" fill="#0055A5" />
          </g>
          <g className="anim-burst-arrow-3">
            <path d="M 745 330 L 800 335 L 755 365 L 765 342 Z" fill="#F5A623" />
          </g>
        </g>

        {/* 1. ARO ROJO: círculo grueso abierto abajo-izquierda (por donde sale la carretera) */}
        <g className="anim-crescent-body">
          <path
            d="M 294 449 A 238 238 0 1 1 438 560"
            fill="none"
            stroke="#E30613"
            strokeWidth="48"
            strokeLinecap="butt"
          />
          <path
            className="anim-crescent-stroke"
            d="M 294 449 A 238 238 0 1 1 438 560"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        {/* 2. TRES ALAS ROJAS convergiendo al punto de fuga (658, 334) */}
        <g>
          <path
            className="anim-wing-1"
            d="M 658 334 C 570 235, 465 178, 355 170 C 385 218, 480 275, 658 334 Z"
            fill="#E30613"
          />
          <path
            className="anim-wing-2"
            d="M 658 334 C 545 278, 430 252, 328 252 C 362 297, 490 322, 658 334 Z"
            fill="#E30613"
          />
          <path
            className="anim-wing-3"
            d="M 658 334 C 530 332, 418 340, 322 356 C 362 394, 505 372, 658 334 Z"
            fill="#E30613"
          />
        </g>

        {/* 3. CARRETERA NEGRA con línea discontinua, del extremo izquierdo al punto de fuga */}
        <g className="anim-highway-group">
          <path
            d="M 70 522 C 250 465, 435 425, 656 336 C 548 420, 458 492, 446 588 C 420 505, 262 508, 70 522 Z"
            fill="#0D0D10"
          />
          <path
            className="highway-dash-run"
            d="M 195 502 C 320 468, 450 430, 618 362"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </g>

        {/* 4. TEXTO EN ARCO: SUPERVISIÓN (azul) & (rojo) EMERGENCIAS (amarillo) */}
        <g className="anim-text-arc-group">
          <text fontFamily="'Montserrat', 'Arial Black', -apple-system, sans-serif" fontWeight="900" fontSize="40" letterSpacing="6px">
            <textPath href="#textHaloArc" startOffset="50%" textAnchor="middle">
              <tspan fill="#0055A5">SUPERVISIÓN </tspan>
              <tspan fill="#E30613" fontSize="44">&amp; </tspan>
              <tspan fill="#F5A623">EMERGENCIAS</tspan>
            </textPath>
          </text>
        </g>

        {/* 5. MAPE centrado abajo */}
        <g className="anim-mape-wordmark">
          <text
            x="500"
            y="722"
            textAnchor="middle"
            fontFamily="'Arial Black', 'Impact', -apple-system, sans-serif"
            fontWeight="900"
            fontSize="108"
            letterSpacing="8px"
            fill="#0D0D10"
          >
            MAPE
          </text>
        </g>

        {/* 6. Puntos de carga */}
        <g className="anim-loader-dots" transform="translate(460, 775)">
          <circle cx="0" cy="0" r="4" fill="#0055A5">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.1s" repeatCount="indefinite" begin="0s" />
            <animate attributeName="r" values="3.5;5;3.5" dur="1.1s" repeatCount="indefinite" begin="0s" />
          </circle>
          <circle cx="25" cy="0" r="4" fill="#E30613">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.1s" repeatCount="indefinite" begin="0.22s" />
            <animate attributeName="r" values="3.5;5;3.5" dur="1.1s" repeatCount="indefinite" begin="0.22s" />
          </circle>
          <circle cx="50" cy="0" r="4" fill="#F5A623">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.1s" repeatCount="indefinite" begin="0.44s" />
            <animate attributeName="r" values="3.5;5;3.5" dur="1.1s" repeatCount="indefinite" begin="0.44s" />
          </circle>
        </g>
      </svg>
    </div>
  );
}
