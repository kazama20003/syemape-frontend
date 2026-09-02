"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

function LogoSvg() {
  return (
    <span className="logo-text">mape.</span>
  );
}

export default function Loader() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (
      !wrap ||
      window.innerWidth <= 991 ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDone(true);
      return;
    }
    if (!CustomEase.get("loader")) {
      CustomEase.create("loader", "0.65, 0.01, 0.05, 0.99");
    }
    const tl = gsap
      .timeline({ defaults: { ease: "loader", duration: 1 } })
      .set(wrap, { display: "block" })
      .to(wrap.querySelector(".loader__bg-bar"), { scaleX: 1 })
      .to(
        wrap.querySelector(".loader__logo-item.is--top"),
        { clipPath: "inset(0% 0% 0% 0%)" },
        "<"
      )
      .to(wrap.querySelector(".loader__container"), { autoAlpha: 0, duration: 0.5 })
      .add("hideContent", "<")
      .to(wrap.querySelector(".loader__bg"), { yPercent: -101, duration: 1 }, "hideContent")
      .call(() => setDone(true));
    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={wrapRef} className="loader u-theme-light" aria-hidden="true">
      <div className="loader__bg">
        <div className="loader__bg-bar" />
        <div className="loader__bg_wrap">
          <div className="loader__bg_svg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3622 5110" fill="none">
              <path d="M2823.17 3126.72C2924.6 3029.34 3054.85 2949.36 3198.16 2936.32C3467.51 2911.85 3678.18 3005.75 3608.58 3309.17C3529.78 3652.47 2965.36 4138.97 2706.34 4394.95C2313.58 4783.08 1846.49 5336.03 1244.41 5012.48C956.926 4857.97 248.584 4371.35 94.4617 4099.84C-218.631 3548.51 604.681 3263.22 895.152 3672.34C959.039 3762.26 989.49 3875.78 1061.08 3966.08C1277.23 4238.7 1346.71 4010.54 1327.69 3774.18C1319.11 3667.74 1255.72 3486.66 1190.47 3402.07C1077.86 3255.76 916.282 3254.77 759.55 3186.83C234.415 2959.17 -120.564 2468.07 38.1572 1877.87C183.828 1336.1 625.811 1766.46 785.527 2042.93C924.361 2283.26 950.463 2609.29 1134.42 2812.11C1357.89 3058.41 1550.17 2958.67 1526.56 2631.4C1504.68 2328.97 1237.58 1996.73 1101.35 1727.33C902.237 1333.36 699.889 761.163 889.932 331.92C1088.3 -115.953 1776.76 -82.9151 2066.86 265.721C2565.02 864.251 2037.4 1518.67 1927.4 2126.39C1885.51 2358.03 1953.25 2575.63 2191.27 2352.81C2476.77 2085.53 2677.63 1175.75 3112.03 1124.21C3361.36 1094.65 3443.39 1288.53 3463.28 1503.27C3529.53 2218.68 2862.45 2398.52 2495.79 2855.83C2356.95 3029.1 2124.9 3449.4 2202.83 3669.48C2252.92 3811.07 2386.91 3690.47 2445.33 3625.14C2582.17 3471.88 2672.03 3271.66 2822.93 3126.84L2823.17 3126.72Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
      <div className="loader__container">
        <div className="loader__logo-wrap">
          <div className="loader__logo-item is--base">
            <LogoSvg />
          </div>
          <div className="loader__logo-item is--top">
            <LogoSvg />
          </div>
        </div>
      </div>
    </div>
  );
}
