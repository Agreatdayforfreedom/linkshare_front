import React from "react";
// import ReactLoading from "react-loading";

function ButtonLoading({ disabled, loading, text, onClick = () => {} }) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			type="submit"
			className="text-indigo-500 font-bold p-3 my-2 last:border last:border-indigo-500 disabled:border-gray-600 disabled:text-gray-600"
		>
			{loading ? (
				<ReactLoading
					data-testid="loading-in-button"
					type="spin"
					height={30}
					width={30}
				/>
			) : (
				text
			)}
		</button>
	);
}
export default ButtonLoading;
