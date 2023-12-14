import React from "react";

// import { Container } from './styles';

interface SelectProps {
  options: Array<any>;
  onChange: (e: any) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  onChange,
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
