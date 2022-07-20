import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../context/hooks/useAuth";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
const Home = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);

	const { auth, loading: loadingAuth } = useAuth();

	useEffect(() => {
		const getPosts = async () => {
			setLoading(true);
			const { data } = await axios(`${import.meta.env.VITE_URL_BACK}/post`);
			setPosts(data);

			setLoading(false);
		};
		console.log(auth);
		getPosts();
	}, []);

	if (loading || loadingAuth) return <Spinner />;
	return (
		<>
			<main className="m-5 bg-neutral-900 p-8 rounded-lg">
				{posts.map((post) => (
					<Post post={post} />
				))}
			</main>
		</>
	);
};

const Post = ({ post }) => {
	return (
		<div className="flex items-center border border-neutral-600 my-2 p-2 bg-neutral-800 hover:bg-neutral-700">
			{post.owner.avatar ? (
				<img
					src={post.owner.avatar}
					alt="avatar"
					className="w-9 h-9 rounded-full"
				/>
			) : (
				<div className="fa-solid fa-user p-3 rounded-full border-black"></div>
			)}
			<div>
				<Link
					to={`/post/${post._id}`}
					className="font-bold text-lg mx-2 hover:underline"
				>
					{post.title}
				</Link>
				<p className="mx-2 text-sm text-slate-400">
					{post.owner.username} ·{" "}
					{new Date(post.createdAt).toLocaleDateString()}
				</p>
			</div>
			<p className="mx-2">{post.content}</p>
		</div>
	);
};

export default Home;
