import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Effects from "./components/Effects";
import Preloader from "./components/Preloader";

export default function HomeLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Preloader />
      <Effects />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
