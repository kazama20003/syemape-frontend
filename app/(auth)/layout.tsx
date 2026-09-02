export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-dark px-4 text-light">
      {children}
    </div>
  );
}
