import React from "react";

function Input({
	label,
	name,
	defaultValue,
	value,
	type,
	required,
	placeholder,
	onChange,
	tag,
}) {
	if (tag === "textarea") {
		return (
			<>
				<textarea
					className="border w-full bg-transparent text-white"
					placeholder={placeholder}
					defaultValue={defaultValue}
					value={value}
					onChange={onChange}
				></textarea>
			</>
		);
	} else {
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
}

export default Input;
