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
      className="fixed inset-0 z-[999] grid place-items-center bg-[#f7f5f1]"
      style={{ opacity: fading ? 0 : 1, transition: `opacity ${FADE_MS}ms ease` }}
    >
      <style>{`
        .mape-preloader { width: 90vw; max-width: 640px; height: auto; max-height: 80vh; overflow: visible; transform-origin: 50% 50%; }

        .anim-crescent-body { transform-origin: 470px 290px; animation: crescentMotion 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        @keyframes crescentMotion {
          0% { opacity: 0; transform: scale(0.85) rotate(-25deg); }
          14% { opacity: 1; transform: scale(1) rotate(0deg); }
          54% { opacity: 1; transform: scale(1.02) rotate(3deg); }
          68% { opacity: 0.95; transform: scale(1.06) rotate(38deg) translate(20px, -15px); }
          86% { opacity: 0.45; transform: scale(1.22) rotate(115deg) translate(140px, -120px); }
          94%, 100% { opacity: 0; transform: scale(1.35) rotate(160deg) translate(260px, -200px); }
        }

        .anim-crescent-stroke { stroke-dasharray: 1700; stroke-dashoffset: 1700; animation: crescentStrokeDraw 4.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        @keyframes crescentStrokeDraw {
          0% { stroke-dashoffset: 1700; opacity: 0; }
          12% { opacity: 1; }
          48% { stroke-dashoffset: 0; opacity: 1; }
          68% { stroke-dashoffset: -200; opacity: 0.8; }
          85%, 100% { stroke-dashoffset: -1700; opacity: 0; }
        }

        .anim-wing-1 { transform-origin: 520px 200px; animation: wingOneCycle 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        .anim-wing-2 { transform-origin: 520px 260px; animation: wingTwoCycle 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        .anim-wing-3 { transform-origin: 520px 320px; animation: wingThreeCycle 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        @keyframes wingOneCycle {
          0% { opacity: 0; transform: translateX(-40px) scaleX(0.7); }
          14% { opacity: 1; transform: translateX(0) scaleX(1); }
          35% { transform: translateX(4px) scaleX(1.02); }
          54% { opacity: 1; transform: translateX(0) scaleX(1); }
          68% { opacity: 0.9; transform: rotate(24deg) translate(30px, -20px) scale(1.05); }
          86% { opacity: 0.35; transform: rotate(85deg) translate(180px, -90px) scale(1.15); }
          94%, 100% { opacity: 0; transform: rotate(130deg) translate(310px, -150px) scale(1.3); }
        }
        @keyframes wingTwoCycle {
          0% { opacity: 0; transform: translateX(-35px) scaleX(0.75); }
          16% { opacity: 1; transform: translateX(0) scaleX(1); }
          38% { transform: translateX(5px) scaleX(1.03); }
          54% { opacity: 1; transform: translateX(0) scaleX(1); }
          68% { opacity: 0.85; transform: rotate(32deg) translate(40px, 0px) scale(1.06); }
          86% { opacity: 0.3; transform: rotate(95deg) translate(210px, -40px) scale(1.2); }
          94%, 100% { opacity: 0; transform: rotate(140deg) translate(340px, -70px) scale(1.35); }
        }
        @keyframes wingThreeCycle {
          0% { opacity: 0; transform: translateX(-30px) scaleX(0.8); }
          18% { opacity: 1; transform: translateX(0) scaleX(1); }
          40% { transform: translateX(6px) scaleX(1.03); }
          54% { opacity: 1; transform: translateX(0) scaleX(1); }
          68% { opacity: 0.8; transform: rotate(40deg) translate(45px, 20px) scale(1.07); }
          86% { opacity: 0.25; transform: rotate(110deg) translate(230px, 20px) scale(1.22); }
          94%, 100% { opacity: 0; transform: rotate(155deg) translate(360px, 30px) scale(1.4); }
        }

        .anim-highway-group { transform-origin: 360px 450px; animation: highwayMotion 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        @keyframes highwayMotion {
          0% { opacity: 0; transform: translateX(-60px) scale(0.9); }
          16% { opacity: 1; transform: translateX(0) scale(1); }
          54% { opacity: 1; transform: scale(1.01); }
          68% { opacity: 0.95; transform: rotate(-18deg) translate(-25px, 15px); }
          86% { opacity: 0.4; transform: rotate(-55deg) translate(-170px, 110px) scale(1.15); }
          94%, 100% { opacity: 0; transform: rotate(-85deg) translate(-290px, 200px) scale(1.3); }
        }

        .highway-dash-run { stroke-dasharray: 45 42; stroke-dashoffset: 0; animation: highwayDashes 0.55s linear infinite; }
        @keyframes highwayDashes { 0% { stroke-dashoffset: 87; } 100% { stroke-dashoffset: 0; } }

        .anim-text-arc-group { transform-origin: 470px 290px; animation: textArcCycle 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        @keyframes textArcCycle {
          0% { opacity: 0; transform: scale(0.8) rotate(-15deg); }
          14% { opacity: 1; transform: scale(1) rotate(0deg); }
          38% { transform: scale(1.015) rotate(0deg); }
          54% { opacity: 1; transform: scale(1) rotate(0deg); }
          68% { opacity: 0.95; transform: rotate(-28deg) translate(-25px, -15px) scale(1.04); }
          86% { opacity: 0.35; transform: rotate(-80deg) translate(-160px, -90px) scale(1.2); }
          94%, 100% { opacity: 0; transform: rotate(-125deg) translate(-280px, -160px) scale(1.38); }
        }

        .anim-mape-wordmark { transform-origin: 590px 650px; animation: mapeWordmarkCycle 4.8s cubic-bezier(0.35, 0, 0.25, 1) infinite; }
        @keyframes mapeWordmarkCycle {
          0% { opacity: 0; transform: translateY(35px) scale(0.9); }
          16% { opacity: 1; transform: translateY(0) scale(1); }
          54% { opacity: 1; transform: scale(1.01); }
          68% { opacity: 0.92; transform: rotate(20deg) translate(30px, 20px) scale(1.06); }
          86% { opacity: 0.3; transform: rotate(60deg) translate(180px, 120px) scale(1.22); }
          94%, 100% { opacity: 0; transform: rotate(95deg) translate(300px, 210px) scale(1.4); }
        }

        .anim-orbit-sweeper { transform-origin: 470px 290px; animation: orbitSpin 4.8s linear infinite; }
        @keyframes orbitSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .anim-burst-arrow-1 { transform-origin: 470px 290px; animation: burstOne 4.8s cubic-bezier(0.2, 0.8, 0.4, 1.2) infinite; }
        .anim-burst-arrow-2 { transform-origin: 470px 290px; animation: burstTwo 4.8s cubic-bezier(0.2, 0.8, 0.4, 1.2) infinite; }
        .anim-burst-arrow-3 { transform-origin: 470px 290px; animation: burstThree 4.8s cubic-bezier(0.2, 0.8, 0.4, 1.2) infinite; }
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
        viewBox="0 0 920 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="MAPE Supervisión & Emergencias"
      >
        <defs>
          <linearGradient id="redBrandGrad" x1="260" y1="80" x2="740" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF1E28" />
            <stop offset="55%" stopColor="#E30613" />
            <stop offset="100%" stopColor="#BA000B" />
          </linearGradient>

          <linearGradient id="roadGrad" x1="120" y1="460" x2="710" y2="340" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E1E22" />
            <stop offset="60%" stopColor="#0E0E10" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          <linearGradient id="orbitGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC72C" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF2A36" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0055A5" stopOpacity="1" />
          </linearGradient>

          <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#000000" floodOpacity="0.28" />
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.25" />
          </filter>

          <filter id="softGlowRed" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <path id="textHaloArc" d="M 245 220 A 248 248 0 0 1 705 220" fill="none" />
        </defs>

        <g className="anim-orbit-sweeper" opacity="0.4">
          <circle cx="475" cy="295" r="268" stroke="url(#orbitGlowGrad)" strokeWidth="2" strokeDasharray="10 35" fill="none" />
          <circle cx="475" cy="295" r="290" stroke="rgba(227, 6, 19, 0.25)" strokeWidth="1.5" strokeDasharray="8 30" fill="none" />
          <path d="M 475 27 A 268 268 0 0 1 743 295" fill="none" stroke="url(#orbitGlowGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="85 320" />
        </g>

        <g filter="url(#softGlowRed)">
          <g className="anim-burst-arrow-1">
            <path d="M 685 160 L 735 135 L 710 185 L 717 162 Z" fill="#E30613" />
          </g>
          <g className="anim-burst-arrow-2">
            <path d="M 275 160 L 225 135 L 250 185 L 243 162 Z" fill="#0055A5" />
          </g>
          <g className="anim-burst-arrow-3">
            <path d="M 720 290 L 775 295 L 730 325 L 740 302 Z" fill="#F5A623" />
          </g>
        </g>

        <g className="anim-crescent-body" filter="url(#badgeShadow)">
          <path
            d="M 475 78 C 608 78, 732 182, 732 330 C 732 452, 634 560, 476 560 C 398 560, 352 538, 486 525 C 602 514, 680 422, 680 324 C 680 202, 574 130, 475 130 C 400 130, 340 166, 316 210 L 316 166 C 352 112, 410 78, 475 78 Z"
            fill="url(#redBrandGrad)"
          />
          <path
            className="anim-crescent-stroke"
            d="M 475 78 C 608 78, 732 182, 732 330 C 732 452, 634 560, 476 560 C 398 560, 352 538, 486 525 C 602 514, 680 422, 680 324 C 680 202, 574 130, 475 130 C 400 130, 340 166, 316 210 L 316 166 C 352 112, 410 78, 475 78 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </g>

        <g filter="url(#badgeShadow)">
          <path className="anim-wing-1" d="M 410 176 C 490 176, 598 212, 680 288 C 598 265, 498 242, 410 242 Z" fill="url(#redBrandGrad)" />
          <path className="anim-wing-2" d="M 408 264 C 494 264, 610 300, 688 352 C 604 334, 498 316, 408 316 Z" fill="url(#redBrandGrad)" />
          <path className="anim-wing-3" d="M 406 340 C 500 340, 612 368, 694 406 C 612 395, 504 382, 406 382 Z" fill="url(#redBrandGrad)" />
        </g>

        <g className="anim-highway-group" filter="url(#badgeShadow)">
          <path
            d="M 126 442 C 245 408, 400 376, 712 350 C 560 416, 420 505, 408 614 C 382 505, 290 468, 126 442 Z"
            fill="url(#roadGrad)"
          />
          <path
            className="highway-dash-run"
            d="M 160 440 C 260 422, 385 398, 495 378 C 560 367, 625 358, 695 353"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <path d="M 190 436 C 300 412, 455 384, 665 358" fill="none" stroke="#FFC72C" strokeWidth="1.8" strokeDasharray="7 28" opacity="0.75" />
        </g>

        <g className="anim-text-arc-group">
          <text fontFamily="'Montserrat', 'Arial Black', -apple-system, sans-serif" fontWeight="900" fontSize="28" letterSpacing="4px">
            <textPath href="#textHaloArc" startOffset="50%" textAnchor="middle">
              <tspan fill="#0055A5">SUPERVISIÓN </tspan>
              <tspan fill="#E30613" fontSize="30">&amp; </tspan>
              <tspan fill="#F5A623">EMERGENCIAS</tspan>
            </textPath>
          </text>
        </g>

        <g className="anim-mape-wordmark">
          <text
            x="590"
            y="675"
            textAnchor="middle"
            fontFamily="'Arial Black', 'Impact', -apple-system, sans-serif"
            fontWeight="900"
            fontSize="82"
            letterSpacing="5px"
            fill="#0D0D10"
          >
            MAPE
          </text>
        </g>

        <g className="anim-loader-dots" transform="translate(535, 702)">
          <circle cx="15" cy="0" r="4" fill="#0055A5">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.1s" repeatCount="indefinite" begin="0s" />
            <animate attributeName="r" values="3.5;5;3.5" dur="1.1s" repeatCount="indefinite" begin="0s" />
          </circle>
          <circle cx="40" cy="0" r="4" fill="#E30613">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.1s" repeatCount="indefinite" begin="0.22s" />
            <animate attributeName="r" values="3.5;5;3.5" dur="1.1s" repeatCount="indefinite" begin="0.22s" />
          </circle>
          <circle cx="65" cy="0" r="4" fill="#F5A623">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.1s" repeatCount="indefinite" begin="0.44s" />
            <animate attributeName="r" values="3.5;5;3.5" dur="1.1s" repeatCount="indefinite" begin="0.44s" />
          </circle>
        </g>
      </svg>
    </div>
  );
}
