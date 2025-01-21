// InputField.js
import React from "react";

const InputField = ({ label, name, value, onChange, type = "text", required = false }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-2">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded"
        required={required}
      />
    </div>
  );
};

export default InputField;
