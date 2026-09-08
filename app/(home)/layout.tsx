import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Effects from "./components/Effects";

export default function HomeLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Effects />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
