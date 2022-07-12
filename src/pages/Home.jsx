import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../context/hooks/useAuth";
import { Link } from "react-router-dom";
const Home = () => {
	const [posts, setPosts] = useState([]);

	const { auth, loading } = useAuth();

	useEffect(() => {
		const getPosts = async () => {
			const { data } = await axios("http://localhost:4000/post");
			setPosts(data);
		};
		console.log(auth);
		getPosts();
	}, []);

	if (loading) return <div>Loading...</div>;
	return (
		<div>
			<main className="m-5">
				<div className="flex justify-end">
					<Link to="/new-post">New post</Link>
				</div>
				<h1 className="font-bold text-xl">Some posts</h1>
				{auth && <p>Hello, {auth.username}!</p>}
				{posts.map((post) => (
					<Post post={post} />
				))}
			</main>
		</div>
	);
};

const Post = ({ post }) => {
	return (
		<div className="flex items-center border my-2 p-2 bg-slate-200">
			<Link
				to={`/post/${post._id}`}
				className="font-bold text-lg mx-2 hover:underline"
			>
				{post.title}
			</Link>
			<p className="mx-2">{post.content}</p>
		</div>
	);
};

export default Home;
