"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    setHover(false);
  };

  return (
    <>
<div className="nav_component_wrap">
<div className={`nav_component_overlay${open ? " is-active" : ""}`} onClick={closeMenu}>
</div>
<header className="nav_wrap">
<div className="nav_contain">
<div className="nav_layout">
<a href="#top" aria-label="Home Page" className="nav_logo_wrap u-theme-dark">
<Image src="/mape-logo.svg" alt="MAPE Supervisión & Emergencias" width={1090} height={960} unoptimized fetchPriority="high" className="block h-24 w-auto" />
</a>
<div className="nav_links_wrap">
<nav className="nav_menu_wrap is-link-pill">
<a href="/login" className="nav_menu_top">
<div className="nav_menu_icon_wrap">
<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
<path d="M12 5v14M5 12h14">
</path>
</svg>
</div>
<div className="nav_menu_label_wrap">
<div className="nav_menu_label" data-label="Acceder">Acceder</div>
</div>
</a>
</nav>
<nav className="nav_menu_wrap is-link-pill">
<a href="/nosotros" className="nav_menu_top">
<div className="nav_menu_icon_wrap">
<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
<path d="M12 5v14M5 12h14">
</path>
</svg>
</div>
<div className="nav_menu_label_wrap">
<div className="nav_menu_label" data-label="Nosotros">Nosotros</div>
</div>
</a>
</nav>
<nav className="nav_menu_wrap is-link-pill">
<a href="/servicios" className="nav_menu_top">
<div className="nav_menu_icon_wrap">
<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
<path d="M12 5v14M5 12h14">
</path>
</svg>
</div>
<div className="nav_menu_label_wrap">
<div className="nav_menu_label" data-label="Servicios">Servicios</div>
</div>
</a>
</nav>
<nav className="nav_menu_wrap is-link-pill">
<a href="/contacto" className="nav_menu_top">
<div className="nav_menu_icon_wrap">
<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
<path d="M12 5v14M5 12h14">
</path>
</svg>
</div>
<div className="nav_menu_label_wrap">
<div className="nav_menu_label" data-label="Contacto">Contacto</div>
</div>
</a>
</nav>
</div>
<nav
  aria-label="Main"
  className={`nav_menu_wrap${open ? " is-open" : hover ? " is-hover" : ""}`}
  onMouseEnter={() => matchMedia("(hover: hover)").matches && setHover(true)}
  onMouseLeave={() => setHover(false)}
  onClick={(e) => {
    const target = e.target as HTMLElement;
    if (target.closest(".menu_links_link, .clickable_link") && open) closeMenu();
  }}
>
<a
  href="#"
  aria-label={open ? "Close menu" : "Open menu"}
  aria-expanded={open}
  className="nav_menu_top"
  onClick={(e) => {
    e.preventDefault();
    setOpen((v) => !v);
  }}
>
<div className="nav_menu_icon_wrap">
<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
<path d="M12 5v14M5 12h14">
</path>
</svg>
</div>
<div className="nav_menu_label_wrap">
<div className="nav_menu_label">Menu</div>
<div className="nav_menu_label is-click">Click to Expand</div>
<div className="nav_menu_label is-close">Close</div>
</div>
</a>
<div role="list" className="nav_menu_links_wrap">
<div role="presentation" className="menu_links_wrap">
<div role="listitem" data-menu="main" className="menu_links_item_wrap">
<a href="/servicios" className="menu_links_link">
<div className="menu_links_text">Treatments</div>
</a>
</div>
<div role="listitem" className="menu_links_item_wrap">
<a href="/servicios" className="menu_links_link">
<div className="menu_links_text u-text-small-caps">Spravato® Therapy</div>
</a>
</div>
<div role="listitem" className="menu_links_item_wrap">
<a href="/servicios" className="menu_links_link">
<div className="menu_links_text u-text-small-caps">Ketamine Therapy</div>
</a>
</div>
<div role="listitem" className="menu_links_item_wrap">
<a href="/servicios" className="menu_links_link">
<div className="menu_links_text u-text-small-caps">Reyou-To-You</div>
</a>
</div>
</div>
<div role="presentation" className="menu_links_wrap is-conditions">
<div role="listitem" data-menu="main" className="menu_links_item_wrap">
<a href="#conditions" className="menu_links_link">
<div className="menu_links_text">Conditions</div>
</a>
</div>
<div role="listitem" className="menu_links_item_wrap">
<a href="#conditions" className="menu_links_link">
<div className="menu_links_text u-text-small-caps">Depression</div>
</a>
</div>
<div role="listitem" className="menu_links_item_wrap">
<a href="#conditions" className="menu_links_link">
<div className="menu_links_text u-text-small-caps">Anxiety</div>
</a>
</div>
<div role="listitem" className="menu_links_item_wrap">
<a href="#conditions" className="menu_links_link">
<div className="menu_links_text u-text-small-caps">PTSD &amp; Trauma</div>
</a>
</div>
<div role="listitem" className="menu_links_item_wrap">
<a href="#conditions" className="menu_links_link">
<div className="menu_links_text u-text-small-caps">OCD</div>
</a>
</div>
<div role="listitem" className="menu_links_item_wrap">
<a href="#conditions" className="menu_links_link">
<div className="menu_links_text u-text-small-caps">Postpartum Depression</div>
</a>
</div>
<div role="listitem" className="menu_links_item_wrap">
<a href="#conditions" className="menu_links_link">
<div className="menu_links_text u-text-small-caps">Suicidal Thoughts</div>
</a>
</div>
<div role="listitem" className="menu_links_item_wrap">
<a href="#conditions" className="menu_links_link">
<div className="menu_links_text u-text-small-caps">Addiction</div>
</a>
</div>
</div>
<div role="presentation" className="menu_links_wrap">
<div role="listitem" data-menu="main" className="menu_links_item_wrap">
<a href="#experience" className="menu_links_link">
<div className="menu_links_text">The Reyou Experience</div>
</a>
</div>
</div>
<div role="presentation" className="menu_links_wrap">
<div role="listitem" data-menu="main" className="menu_links_item_wrap">
<a href="/nosotros" className="menu_links_link">
<div className="menu_links_text">About Us</div>
</a>
</div>
</div>
<div role="presentation" className="menu_links_wrap">
<div role="listitem" data-menu="main" className="menu_links_item_wrap">
<a href="#locations" className="menu_links_link">
<div className="menu_links_text">Locations</div>
</a>
</div>
<div role="listitem" className="menu_links_item_wrap">
<a href="#locations" className="menu_links_link">
<div className="menu_links_text u-text-small-caps">Howell Township</div>
</a>
</div>
<div role="listitem" className="menu_links_item_wrap">
<a href="#locations" className="menu_links_link">
<div className="menu_links_text u-text-small-caps">South Plainfield</div>
</a>
</div>
</div>
<div role="presentation" className="menu_links_wrap">
<div role="listitem" data-menu="main" className="menu_links_item_wrap">
<a href="#providers" className="menu_links_link">
<div className="menu_links_text">For Providers</div>
</a>
</div>
</div>
<div role="presentation" className="menu_links_wrap">
<div role="listitem" data-menu="main" className="menu_links_item_wrap">
<a href="/contacto" className="menu_links_link">
<div className="menu_links_text">Contact</div>
</a>
</div>
</div>
</div>
<div className="nav_menu_action_wrap">
<a href="tel:+17325551234" className="button_main clickable_link" data-button-animate="">
<span className="button_main_text">Call Now</span>
<span className="button_main_icon" data-button-animate-icon="">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="u-svg is-call">
<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z">
</path>
</svg>
</span>
</a>
</div>
<div className="nav_menu_bottom_wrap">
<div className="nav_menu_bottom_links">
<a href="#insights">Insights &amp; Resources</a>
<a href="#terms" className="text-center">Terms of Use</a>
<a href="#privacy" className="text-center">Privacy Policy</a>
<div className="flex flex-col items-end leading-[1.7]">
<a href="#">Facebook</a>
<a href="#">Instagram</a>
<a href="#">LinkedIn</a>
</div>
</div>
<div className="nav_menu_bottom_card">
<div className="flex flex-col justify-end text-[0.6875rem] leading-[1.35]">
<p>Don’t just add days to your life.</p>
<p>Add life to your days.</p>
</div>
<div className="flex flex-col items-end justify-between">
<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAwIDEwMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIHNsaWNlIj4KPGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iNDkuOTk5OTk5OTk5OTk5OTklIiB5MT0iMC4wJSIgeDI9IjUwLjAwMDAwMDAwMDAwMDAxJSIgeTI9IjEwMC4wJSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYzljM2I4Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNmI2YTYzIi8+PC9saW5lYXJHcmFkaWVudD4KPGZpbHRlciBpZD0ibiI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjgiIG51bU9jdGF2ZXM9IjIiIHNlZWQ9IjMiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIC4wNiAwIi8+PC9maWx0ZXI+PC9kZWZzPgo8cmVjdCB3aWR0aD0iMTYwMCIgaGVpZ2h0PSIxMDAwIiBmaWxsPSJ1cmwoI2cpIi8+PHJlY3QgeD0iMTE1MCIgeT0iMTUwIiB3aWR0aD0iMzgwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzJmNWQ0ZCIgb3BhY2l0eT0iLjU1Ii8+PGNpcmNsZSBjeD0iMzYwIiBjeT0iNTIwIiByPSI5MCIgZmlsbD0iI2Y0ZWZlNiIgb3BhY2l0eT0iLjgiLz48ZyBmaWxsPSIjZThlNmUzIj48Y2lyY2xlIGN4PSI4MDAiIGN5PSIzODAiIHI9Ijc1LjYiLz48cmVjdCB4PSI3MDcuNiIgeT0iNDU1LjYiIHdpZHRoPSIxODQuOCIgaGVpZ2h0PSIzNzguMCIgcng9IjQyLjAiLz48L2c+CjxyZWN0IHdpZHRoPSIxNjAwIiBoZWlnaHQ9IjEwMDAiIGZpbHRlcj0idXJsKCNuKSIvPgo8dGV4dCB4PSI4MDAuMCIgeT0iOTg2IiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjE5IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LC41NSkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPmNsaW5pYyBpbnRlcnZpZXcgdmlkZW8gdGh1bWJuYWlsIOKAlCByZXBsYWNlIHdpdGggcGhvdG88L3RleHQ+Cjwvc3ZnPg==" alt="" className="h-[5.375rem] w-[12.5rem] rounded-md object-cover"/>
<a href="/contacto" className="link_arrow clickable_link !text-[0.65rem]">Book a consultation<span className="button_main_icon !h-5 !w-5">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
<path d="M5 12h14M13 6l6 6-6 6">
</path>
</svg>
</span>
</a>
</div>
</div>
</div>
</nav>
</div>
</div>
</header>
</div>
    </>
  );
}
