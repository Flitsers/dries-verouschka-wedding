export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-8 text-white">

        <div
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          D & V
        </div>

        <div className="hidden gap-8 md:flex">
          <a href="#">Onze dag</a>
          <a href="#">Praktisch</a>
          <a href="#">Hotels</a>
          <a href="#">RSVP</a>
        </div>

      </nav>
    </header>
  );
}