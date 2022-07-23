import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../context/hooks/useAuth";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useComment } from "../context/CommentProvider";
import { PostContext } from "../context/PostProvider";
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
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getComments = async () => {
			try {
				setLoading(true);

				const { data } = await axios(
					`${import.meta.env.VITE_URL_BACK}/comment/${post._id}`
				);
				setComments(data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		getComments();
	}, []);
	console.log(comments);

	if (loading || comments.length === 0) return <div>Loading...</div>;
	return (
		<div className="flex justify-between items-center border border-neutral-600 my-2 p-2 bg-neutral-800 hover:bg-neutral-700">
			<div className="flex items-center">
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

			<p
				className="font-bold text-sm text-slate-400
				mx-2"
			>
				Respuestas: {comments.length}
			</p>

			<div className="w-2/12">
				<div className="flex items-center">
					<img
						src={comments.at(-1).emitter.avatar}
						className="w-7 h-7 rounded-full"
						alt="avatar last response"
					/>
					<p className="pl-1 text-xs ">· {comments.at(-1).emitter.username}</p>
				</div>
				<p className="text-sm text-slate-300 whitespace-nowrap text-ellipsis overflow-hidden">
					{comments.at(-1).comment}
				</p>
			</div>
		</div>
	);
};

export default Home;
