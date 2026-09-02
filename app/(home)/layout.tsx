import Nav from "./components/Nav";
import Footer from "./components/Footer";

export default function HomeLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
