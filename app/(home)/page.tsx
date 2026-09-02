import Hero from "./components/Hero";
import Insurance from "./components/Insurance";
import Treatments from "./components/Treatments";
import Conditions from "./components/Conditions";
import Experience from "./components/Experience";
import WhyUs from "./components/WhyUs";
import Testimonials from "./components/Testimonials";
import Process from "./components/Process";
import Cta from "./components/Cta";
import Guidance from "./components/Guidance";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <Insurance />
      <Treatments />
      <Conditions />
      <Experience />
      <WhyUs />
      <Testimonials />
      <Process />
      <Cta />
      <Guidance />
    </main>
  );
}
