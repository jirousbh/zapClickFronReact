import React from "react";

interface SelectProps {
  options: Array<any>;
  onChange: (e: any) => void;
  disabled?: boolean;
  name?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  onChange,
  disabled = false,
  name = "",
}) => {
  return (
    <select
      style={{
        width: "100%",
        height: 40,
        background: "#FFF",
        borderRadius: 5,
        paddingLeft: 10,
      }}
      onChange={onChange}
      disabled={disabled}
      name={name}
    >
      {options.map((option: any) => (
        <option
          key={`@@key-${option.value}`}
          value={option.value}
          selected={option.selected}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
