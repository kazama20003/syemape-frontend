export default function Footer() {
  return (
    <>
<footer id="locations" className="footer_wrap u-section u-theme-dark u-container pb-6 pt-16">
<div className="grid gap-12 md:grid-cols-[1fr_auto]">
<div>
<p className="text-[9.5px]">Subscribe to our newsletter:</p>
<form className="mt-3 flex gap-2" action="#">
<input type="email" placeholder="john.doe@email.com" className="h-7 w-[160px] rounded-[2px] border border-white/40 bg-transparent px-2 text-[9px] placeholder:text-white/50 focus:border-white focus:outline-none"/>
<button type="submit" className="h-7 rounded-[2px] bg-[#e6e6e6] px-3 text-[9px] text-dark transition-colors hover:bg-white">Subscribe</button>
</form>
<div className="mt-16 grid gap-8 md:grid-cols-[auto_1fr] md:gap-16">
<div>
<p className="text-[9.5px]">Follow us:</p>
<div className="mt-3 flex gap-3 text-white">
<a href="#" aria-label="Facebook" className="hover:text-white/70">
<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8z">
</path>
</svg>
</a>
<a href="#" aria-label="Instagram" className="hover:text-white/70">
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
<rect x="3" y="3" width="18" height="18" rx="5">
</rect>
<circle cx="12" cy="12" r="4">
</circle>
<circle cx="17.5" cy="6.5" r="1" fill="currentColor">
</circle>
</svg>
</a>
<a href="#" aria-label="LinkedIn" className="hover:text-white/70">
<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
<path d="M4 9h4v11H4zM6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v1.6c.7-1 2-1.9 3.8-1.9 3.5 0 4.2 2.3 4.2 5.3V20h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20h-4z">
</path>
</svg>
</a>
</div>
</div>
<div>
<p className="text-[9.5px]">Treatments available at our New Jersey clinics:</p>
<div className="mt-3 flex flex-wrap gap-3">
<a href="#" className="block w-[140px] rounded-[2px] border border-white/60 px-3 py-3 transition-colors hover:bg-white/10">
<p className="text-[9px] font-medium">Howell Township, NJ</p>
<p className="mt-2 text-[7.5px] leading-[1.5] text-white/80">5170 US-9, Howell Township, NJ 07731</p>
</a>
<a href="#" className="block w-[140px] rounded-[2px] border border-white/60 px-3 py-3 transition-colors hover:bg-white/10">
<p className="text-[9px] font-medium">South Plainfield, NJ</p>
<p className="mt-2 text-[7.5px] leading-[1.5] text-white/80">908 Oak Tree Ave, Suite M, South Plainfield, NJ 07080</p>
</a>
</div>
</div>
</div>
</div>
<div className="grid grid-cols-2 gap-x-16 text-[9.5px] md:pr-16">
<div>
<p className="text-[8px] uppercase tracking-[0.1em] text-white/50">Sitemap</p>
<ul className="mt-3 space-y-[9px]">
<li>
<a href="#" className="hover:text-white/70">Home</a>
</li>
<li>
<a href="#" className="hover:text-white/70">Treatments</a>
</li>
<li>
<a href="#" className="hover:text-white/70">Conditions</a>
</li>
<li>
<a href="#" className="hover:text-white/70">The Reyou Experience</a>
</li>
<li>
<a href="#" className="hover:text-white/70">About Us</a>
</li>
<li>
<a href="#" className="hover:text-white/70">Locations</a>
</li>
<li>
<a href="#" className="hover:text-white/70">For Providers</a>
</li>
<li>
<a href="#" className="hover:text-white/70">Insights &amp; Resources</a>
</li>
<li>
<a href="#" className="hover:text-white/70">Contact</a>
</li>
</ul>
</div>
<div>
<p className="text-[8px] uppercase tracking-[0.1em] text-white/50">Legal</p>
<ul className="mt-3 space-y-[9px]">
<li>
<a href="#" className="hover:text-white/70">Terms of Use</a>
</li>
<li>
<a href="#" className="hover:text-white/70">Privacy Policy</a>
</li>
</ul>
</div>
</div>
</div>
<div className="mt-16 flex flex-wrap items-end justify-between gap-6">
<div className="w-[clamp(16rem,34vw,30rem)]">
<span className="logo-text">mape.</span>
</div>
<div className="flex items-center gap-6 pb-2 text-white/70">
<span className="text-[22px] font-light tracking-tight">
<span className="font-medium">Care</span>Credit</span>
<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Verified" className="h-8 w-auto" loading="lazy"/>
<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="LegitScript certified" className="h-10 w-auto" loading="lazy"/>
</div>
</div>
<p className="mt-6 text-[7.5px] text-white/40">© <span data-dynamic-year="">2026</span> Reyou. All rights reserved.</p>
</footer>


    </>
  );
}
