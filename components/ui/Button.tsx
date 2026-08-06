type Props = {
  children: React.ReactNode;
};

export default function Button({ children }: Props) {
  return (
    <button
      className="
      rounded-full
      bg-[#d4b06a]
      px-8
      py-4
      font-semibold
      text-[#183328]
      transition
      duration-300
      hover:scale-105
      hover:shadow-xl
      "
    >
      {children}
    </button>
  );
}