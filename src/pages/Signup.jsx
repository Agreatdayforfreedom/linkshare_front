import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonLoading from "../components/ButtonLoading";
import Input from "../components/Input";

const Signup = () => {
	const [user, setUser] = useState({});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};
	const submitForm = async (e) => {
		e.preventDefault();

		const { data } = await axios.post(
			"http://localhost:4000/auth/signup",
			user
		);
		localStorage.setItem("token", data.token);
		navigate("/");
	};
	return (
		<div>
			<form
				onSubmit={submitForm}
				className="w-56 mt-20 m-auto border rounded-lg p-5"
			>
				<Input
					label="Username"
					name="username"
					type="text"
					required={true}
					placeholder="Username"
					onChange={handleChange}
				/>
				<Input
					label="Email"
					name="email"
					type="email"
					required={true}
					placeholder="email"
					onChange={handleChange}
				/>
				<Input
					label="Password"
					name="password"
					type="password"
					required={true}
					placeholder="Password"
					onChange={handleChange}
				/>
				<ButtonLoading disabled={false} loading={false} text="Sign up" />
			</form>
		</div>
	);
};

export default Signup;
