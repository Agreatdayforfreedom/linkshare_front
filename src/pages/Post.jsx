import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ButtonLoading from "../components/ButtonLoading";
import { CommentContext, useComment } from "../context/CommentProvider";

const Post = () => {
	const params = useParams();

	const [post, setPost] = useState({});
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const getPost = async () => {
			setLoading(true);
			const { data } = await axios(`http://localhost:4000/post/${params.id}`);
			setPost(data);
		};
		getPost();
		setLoading(false);
	}, []);

	const deletePost = async () => {};

	if (loading) return <div>Loading...</div>;
	return (
		<div className="flex">
			<div className="p-10 border">
				<p>hll</p>
			</div>
			<div className="p-4 ml-5">
				<div className="border-b">
					<h1 className="text-4xl p-4">{post.title}</h1>
					<div className="flex items-center justify-end pb-1">
						<i className="fa fa-pen text-orange-600 px-1 hover:text-orange-700 cursor-pointer transition-all"></i>
						<i
							onClick={() => deletePost()}
							className="fa fa-trash-can text-red-700 px-1 hover:text-red-800 cursor-pointer transition-all "
						></i>
						<p className="text-slate-400 text-end text-sm px-2">
							Asked: {new Date(post.createdAt).toLocaleString()}
						</p>
					</div>
				</div>
				<div>
					<p className="p-5 text-slate-700">{post.content}</p>
				</div>
				<ShowComments _id={post._id} />
			</div>
			<div>Some here</div>
		</div>
	);
};

const ShowComments = ({ _id }) => {
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);
	// const [render, setRender] = useState(false);
	// useEffect(() => {
	// 	setRender(true);
	// }, [comments]);

	useEffect(() => {
		const getComments = async () => {
			setLoading(true);
			const { data } = await axios(`http://localhost:4000/comment`, {
				post: _id,
			});
			setComments(data);
			console.log(data);
		};
		getComments();
		setLoading(false);
	}, [comments.length]);

	if (loading) return <div>Loading...</div>;
	return (
		<CommentContext.Provider value={{ comments, setComments }}>
			<div className="mt-7">
				<h2>Comments</h2>
				{comments.map((comment) => (
					<Comment comment={comment} />
				))}
				<Answer />
			</div>
		</CommentContext.Provider>
	);
};

const Comment = ({ comment }) => {
	return (
		<div className="border-b flex justify-between first-of-type:border-y">
			<p className="px-2 py-3">{comment.comment}</p>
			<div className="flex items-end">
				<p className="text-slate-500 pr-1">{comment.emitter.username} -</p>
				<p className="text-slate-500 text-sm">
					{new Date(comment.createdAt).toLocaleString()}
				</p>
			</div>
		</div>
	);
};

const formatDate = ({ date }) => {
	return new Date(date);
};

const Answer = () => {
	const [comment, setComment] = useState("");

	const { comments, setComments } = useComment();
	const token = localStorage.getItem("token");
	if (!token) return;

	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	};

	const submitForm = async (e) => {
		e.preventDefault();
		const { data } = await axios.post(
			"http://localhost:4000/comment/new",
			{ comment },
			config
		);
		setComments([...comments, data]);
		setComment("");
	};

	return (
		<div className="mt-10">
			<form onSubmit={submitForm}>
				<textarea
					className="border w-full p-2"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				></textarea>
				{/* TODO: convert to component */}
				<ButtonLoading disabled={false} loading={false} text="Answer" />
			</form>
		</div>
	);
};

export default Post;
