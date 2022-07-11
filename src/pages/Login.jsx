import { useState } from "react";
import ButtonLoading from "../components/ButtonLoading";
import Input from "../components/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [user, setUser] = useState({});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const submitForm = async (e) => {
		e.preventDefault();
		const { data } = await axios.post("http://localhost:4000/auth/login", user);
		localStorage.setItem("token", data.token);
		navigate("/");
	};

	return (
		<div>
			<form
				onSubmit={submitForm}
				className="w-48 mt-20 m-auto border rounded-lg p-5"
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
					label="Password"
					name="password"
					type="password"
					required={true}
					placeholder="Password"
					onChange={handleChange}
				/>
				<ButtonLoading disabled={false} loading={false} text="Login" />
			</form>
		</div>
	);
};

export default Login;
