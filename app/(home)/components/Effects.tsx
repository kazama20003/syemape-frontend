"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

/**
 * Restores the global interactions of the original landing with GSAP +
 * ScrollTrigger + Lenis: smooth scroll, button char hover animation,
 * parallax backgrounds, scroll-in reveals and the showreel Flip lightbox.
 * All motion is skipped under prefers-reduced-motion, and no content is
 * hidden without JS (initial hidden states are set from JS only).
 */
export default function Effects() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {
      // --- Lenis smooth scroll integrated with ScrollTrigger ---
      let lenis: Lenis | null = null;
      if (!reduced) {
        lenis = new Lenis({ lerp: 0.165, wheelMultiplier: 1.25 });
        lenis.on("scroll", ScrollTrigger.update);
        const raf = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        cleanups.push(() => {
          gsap.ticker.remove(raf);
          lenis?.destroy();
        });
      }

      // --- Button char split (SplitText, like the original) ---
      document
        .querySelectorAll<HTMLElement>("[data-button-animate]")
        .forEach((button) => {
          if (button.dataset.buttonAnimated) return;
          button.dataset.buttonAnimated = "true";
          const text = button.querySelector<HTMLElement>(
            '[data-button-animate-text="true"]'
          );
          if (text && !reduced) {
            SplitText.create(text, {
              type: "chars",
              smartWrap: true,
              charsClass: "button_main_char",
              mask: "chars",
            });
            button
              .querySelectorAll<HTMLElement>(".button_main_char")
              .forEach((char, i) => {
                char.setAttribute("data-char", char.textContent ?? "");
                char.style.transitionDelay = `${i * 0.01}s`;
              });
          }
        });

      if (!reduced) {
        // --- Parallax (scrub 2, data-parallax-start/end) ---
        document
          .querySelectorAll<HTMLElement>('[data-parallax="trigger"]')
          .forEach((el) => {
            const start = parseFloat(el.dataset.parallaxStart ?? "0");
            const end = parseFloat(el.dataset.parallaxEnd ?? "20");
            const scrub = parseFloat(el.dataset.parallaxScrub ?? "2");
            gsap.fromTo(
              el,
              { yPercent: start },
              {
                yPercent: end,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "clamp(top bottom)",
                  end: "clamp(bottom top)",
                  scrub,
                },
              }
            );
          });

        // --- Stagger-up reveals ---
        document
          .querySelectorAll<HTMLElement>('[data-animate="stagger-up"]')
          .forEach((section) => {
            const items = section.querySelectorAll(
              '[data-animate="stagger-up-item"]'
            );
            if (!items.length) return;
            gsap.from(items, {
              yPercent: 50,
              autoAlpha: 0,
              duration: 0.6,
              stagger: 0.2,
              ease: "power2.out",
              scrollTrigger: { trigger: section, start: "top 75%", once: true },
            });
          });

        // --- Scale-in reveals ---
        document
          .querySelectorAll<HTMLElement>('[data-animate="scale-in"]')
          .forEach((el) => {
            gsap.from(el, {
              scale: 1.1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 40%", once: true },
            });
          });

        // --- Conditions accordion clip-path reveal ---
        const accImgs = gsap.utils.toArray<HTMLElement>(
          ".condition_accordion_img_wrap"
        );
        const accDescs = gsap.utils.toArray<HTMLElement>(
          ".condition_accordion_description"
        );
        gsap.set([...accImgs, ...accDescs], {
          clipPath: "inset(0% 0% 100% 0%)",
          autoAlpha: 0,
        });
        document
          .querySelectorAll<HTMLElement>(".condition_accordion_wrapper")
          .forEach((wrapper) => {
            const img = wrapper.querySelector(".condition_accordion_img_wrap");
            const desc = wrapper.querySelector(
              ".condition_accordion_description"
            );
            gsap
              .timeline({
                scrollTrigger: { trigger: wrapper, start: "top 85%", once: true },
              })
              .to(
                img,
                {
                  clipPath: "inset(0% 0% 0% 0%)",
                  autoAlpha: 1,
                  duration: 0.8,
                  ease: "power2.inOut",
                },
                0
              )
              .to(
                desc,
                {
                  clipPath: "inset(0% 0% 0% 0%)",
                  autoAlpha: 1,
                  duration: 0.8,
                  ease: "power2.inOut",
                },
                0
              );
          });
      }
    });

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  // --- Showreel lightbox (GSAP Flip, like the original) ---
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : 1;
    let currentId = "";
    let animating = false;
    let player: HTMLElement | null = null;
    let savedCss = "";

    const setStatus = (id: string, status: string) =>
      document
        .querySelectorAll(
          `[data-mini-showreel-lightbox="${id}"], [data-mini-showreel-player="${id}"]`
        )
        .forEach((el) => el.setAttribute("data-mini-showreel-status", status));

    const fitRect = (bounds: DOMRect, ratio: number) => {
      let width = bounds.width;
      let height = width / ratio;
      if (height > bounds.height) {
        height = bounds.height;
        width = height * ratio;
      }
      return {
        left: bounds.left + (bounds.width - width) / 2,
        top: bounds.top + (bounds.height - height) / 2,
        width,
        height,
      };
    };

    const getCard = (id: string) =>
      document.querySelector<HTMLElement>(`[data-mini-showreel-open="${id}"]`);

    const open = (id: string) => {
      if (!id || currentId || animating) return;
      const lightbox = document.querySelector<HTMLElement>(
        `[data-mini-showreel-lightbox="${id}"]`
      );
      player = document.querySelector<HTMLElement>(
        `[data-mini-showreel-player="${id}"]`
      );
      const target =
        lightbox?.querySelector<HTMLElement>("[data-mini-showreel-target]");
      const card = getCard(id);
      if (!lightbox || !player || !target || !card) return;
      currentId = id;
      animating = true;
      savedCss = player.style.cssText;
      lightbox.style.zIndex = "999";
      setStatus(id, "active");
      const from = card.getBoundingClientRect();
      const to = fitRect(target.getBoundingClientRect(), 16 / 9);
      gsap.set(card, { autoAlpha: 0 });
      player.querySelector("video")?.play().catch(() => undefined);
      gsap.fromTo(
        player,
        {
          position: "fixed",
          left: from.left,
          top: from.top,
          width: from.width,
          height: from.height,
          margin: 0,
          zIndex: 999,
          opacity: 1,
          visibility: "visible",
        },
        {
          left: to.left,
          top: to.top,
          width: to.width,
          height: to.height,
          duration,
          ease: "expo.inOut",
          onComplete: () => (animating = false),
        }
      );
    };

    const close = () => {
      if (!currentId || animating || !player) return;
      animating = true;
      const id = currentId;
      const card = getCard(id);
      player.querySelector("video")?.pause();
      setStatus(id, "not-active");
      const finish = () => {
        if (player) player.style.cssText = savedCss;
        if (card) gsap.set(card, { autoAlpha: 1 });
        const lightbox = document.querySelector<HTMLElement>(
          `[data-mini-showreel-lightbox="${id}"]`
        );
        if (lightbox) lightbox.style.zIndex = "";
        currentId = "";
        player = null;
        animating = false;
      };
      const from = card?.getBoundingClientRect();
      if (!from) {
        finish();
        return;
      }
      gsap.to(player, {
        left: from.left,
        top: from.top,
        width: from.width,
        height: from.height,
        duration,
        ease: "expo.inOut",
        onComplete: finish,
      });
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const opener = target.closest<HTMLElement>("[data-mini-showreel-open]");
      if (opener) {
        e.preventDefault();
        open(opener.getAttribute("data-mini-showreel-open") ?? "");
        return;
      }
      if (target.closest("[data-mini-showreel-close]")) {
        e.preventDefault();
        close();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("click", onClick);
    addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      removeEventListener("keydown", onKey);
    };
  }, []);

  // --- Nav logo color follows the theme of the section behind it ---
  useEffect(() => {
    const themes = ["u-theme-light", "u-theme-dark", "u-theme-brand"];
    const logo = document.querySelector<HTMLElement>(".nav_logo_wrap");
    if (!logo) return;
    const update = () => {
      const rect = logo.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      let found: string | null = null;
      document
        .querySelectorAll<HTMLElement>(
          ".u-theme-light, .u-theme-dark, .u-theme-brand"
        )
        .forEach((section) => {
          if (
            section.closest(".nav_component_wrap") ||
            section.closest(".loader")
          )
            return;
          const r = section.getBoundingClientRect();
          if (
            r.top <= mid &&
            r.bottom >= mid &&
            r.left <= rect.right &&
            r.right >= rect.left
          ) {
            themes.forEach((t) => section.classList.contains(t) && (found = t));
          }
        });
      if (found) {
        themes.forEach((t) => logo.classList.remove(t));
        logo.classList.add(found);
      }
    };
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        update();
        queued = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
