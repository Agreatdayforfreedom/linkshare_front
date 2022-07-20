import React, { useState } from "react";
import ButtonLoading from "../components/ButtonLoading";
import axios from "axios";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

const NewPost = () => {
	const [post, setPost] = useState({});
	const navigate = useNavigate();

	//TODO: convert to util
	const token = localStorage.getItem("token");
	if (!token) return;

	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	};

	const handleChange = (e) => {
		setPost({ ...post, [e.target.name]: e.target.value });
	};

	const submitForm = async (e) => {
		e.preventDefault();
		const { data } = await axios.post(
			`${import.meta.env.VITE_URL_BACK}/post/new`,
			post,
			config
		);
		console.log(data);
		navigate("/");
	};
	return (
		<div>
			<form
				onSubmit={submitForm}
				className="w-56 mt-20 m-auto border rounded-lg p-5"
			>
				<Input
					label="Title"
					name="title"
					type="text"
					required={true}
					placeholder="Title"
					onChange={handleChange}
				/>
				<Input
					label="content"
					name="content"
					type="text"
					required={true}
					placeholder="Content"
					onChange={handleChange}
				/>
				<ButtonLoading disabled={false} loading={false} text="Create Post" />
			</form>
		</div>
	);
};

export default NewPost;
