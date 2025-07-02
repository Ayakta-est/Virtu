import React from "react";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
}

const Input: React.FC<InputProps> = ({ icon, label, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm mb-1 text-[#0F2C33]">{label}</label>}
      <div className="flex items-center border border-[#E6D1B4] rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#2E9CA0] transition">
        {icon && <div className="mr-2 text-[#2E9CA0]">{icon}</div>}
        <input
          className={`flex-1 text-sm text-[#0F2C33] placeholder-gray-400 focus:outline-none bg-transparent ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
