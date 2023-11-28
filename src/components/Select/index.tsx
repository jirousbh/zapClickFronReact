import React from "react";

// import { Container } from './styles';

interface SelectProps {
  select: any | null;
  options: Array<any>;
  onChange: (e: any) => void;
}

const Select: React.FC<SelectProps> = ({ select, options, onChange }) => {
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
      {!!select?.value && (
        <option defaultValue={select?.value}>{select?.label}</option>
      )}
      {options.map((option: any) => (
        <option key={`@@key-${option.value}`} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
