import React from "react";

function Input({
	label,
	name,
	defaultValue,
	type,
	required,
	placeholder,
	onChange,
}) {
	return (
		<label htmlFor={name} className="flex flex-col my-3">
			<span>{label}</span>
			<input
				required={required}
				type={type}
				name={name}
				className="input"
				defaultValue={defaultValue}
				placeholder={placeholder}
				onChange={onChange}
			/>
		</label>
	);
}

export default Input;
