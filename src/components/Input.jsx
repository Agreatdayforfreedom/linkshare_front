import React from "react";

function Input({
	label,
	name,
	defaultValue,
	value,
	type,
	className,
	required,
	placeholder,
	onChange,
	tag,
}) {
	if (tag === "textarea") {
		return (
			<>
				<textarea
					defaultValue={defaultValue}
					className={`px-2 w-full h-6 bg-transparent text-white ${className}`}
					placeholder={placeholder}
					value={value}
					name="comment"
					onChange={onChange}
				></textarea>
				<div className="comment"></div>
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
					autoFocus
					className={`mt-2 
					bg-slate-700
					p-2
					text-white
					border
					focus-visible:outline focus-visible:outline-indigo-700 
					focus-visible:outline-2
					${className}`}
					defaultValue={defaultValue}
					placeholder={placeholder}
					onChange={onChange}
				/>
			</label>
		);
	}
}

export default Input;
