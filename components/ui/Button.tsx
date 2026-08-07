type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const className = `
    rounded-full
    px-10
    py-4
    font-semibold
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-2xl
    ${
      variant === "primary"
        ? "bg-[#d4b06a] text-[#183328] hover:bg-[#ddb96f]"
        : "border border-[#d4b06a] text-[#d4b06a] hover:bg-[#d4b06a] hover:text-[#183328]"
    }
  `;

  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}
