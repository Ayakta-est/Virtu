import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}) => {
  const baseStyles = "px-4 py-2 text-sm font-medium transition duration-200 ease-in-out rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-[#0F2C33] text-white hover:bg-[#21616A]",
    secondary: "bg-[#2E9CA0] text-white hover:bg-[#21616A]",
    ghost: "bg-transparent text-[#0F2C33] hover:bg-[#E6D1B4] hover:text-[#0F2C33]",
  };

  return (
    <button
      {...props}
      className={clsx(baseStyles, variants[variant], fullWidth && "w-full", className)}
    >
      {children}
    </button>
  );
};

export default Button;
