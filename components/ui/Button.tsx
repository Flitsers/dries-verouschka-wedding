type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        rounded-full
        bg-[#d4b06a]
        px-10
        py-4
        font-semibold
        text-[#183328]
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-2xl
        hover:bg-[#ddb96f]
      "
    >
      {children}
    </button>
  );
}