type Props = {
  eyebrow: string;
  title: string;
};

export default function SectionTitle({
  eyebrow,
  title,
}: Props) {
  return (
    <div className="text-center">

      <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#d4b06a]">
        {eyebrow}
      </p>

      <h2
        className="mt-4 text-5xl text-white md:text-7xl"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        {title}
      </h2>

    </div>
  );
}
