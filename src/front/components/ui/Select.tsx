import React from "react";

interface SelectProps {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm mb-1 text-[#0F2C33]">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-[#E6D1B4] rounded-md text-sm text-[#0F2C33] bg-white focus:outline-none focus:ring-2 focus:ring-[#2E9CA0] transition"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
