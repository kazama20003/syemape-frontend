import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Effects from "./components/Effects";

export default function HomeLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Loader />
      <Effects />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
