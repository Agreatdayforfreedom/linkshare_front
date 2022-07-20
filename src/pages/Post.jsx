import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ButtonLoading from "../components/ButtonLoading";
import useAuth from "../context/hooks/useAuth";
import Spinner from "../components/Spinner";
import { CommentContext, useComment } from "../context/CommentProvider";
import Input from "../components/Input";

const Post = () => {
	const params = useParams();

	const navigate = useNavigate();
	const [post, setPost] = useState({});
	const [loading, setLoading] = useState(false);
	const [updateMode, setUpdateMode] = useState(false);
	const [postUpdateChange, setPostUpdateChange] = useState({});

	const { auth, loading: loadingAuth } = useAuth();

	useEffect(() => {
		const getPost = async () => {
			setLoading(true);
			const { data } = await axios(
				`${import.meta.env.VITE_URL_BACK}/post/${params.id}`
			);
			setPost(data);
		};
		getPost();
		setLoading(false);
	}, []);

	const changeMode = () => {
		if (!updateMode) {
			setUpdateMode(true);
		} else {
			setUpdateMode(false);
		}
	};

	const handleChange = (e) => {
		setPostUpdateChange({
			...postUpdateChange,
			[e.target.name]: e.target.value,
		});
	};

	const updatePost = async () => {
		console.log(post);
		try {
			const token = localStorage.getItem("token");
			if (!token) return;

			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await axios.put(
				`${import.meta.env.VITE_URL_BACK}/post/update/${post._id}`,
				postUpdateChange,
				config
			);
			setPost(data);
		} catch (error) {
			console.log(error);
		}
	};

	//todo: change fn name
	const end = async () => {
		await updatePost();
		changeMode();
	};

	const deletePost = async () => {
		const token = localStorage.getItem("token");
		if (!token) return;

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};
		await axios.delete(
			`${import.meta.env.VITE_URL_BACK}/post/delete/${post._id}`,
			config
		);
		navigate("/");
	};

	if (loading || post._id === undefined || loadingAuth) return <Spinner />;
	return (
		<main className="md:flex w-11/12 m-auto mt-3 rounded-lg bg-neutral-900">
			<section className="p-4 ml-5 mx-auto md:w-3/4">
				<div className="bg-neutral-800 rounded-lg">
					<div className="border-b border-b-gray-600 mx-2">
						{updateMode ? (
							<div className="w-full">
								<Input
									name="title"
									defaultValue={post.title}
									autoFocus
									className="p-4 mt-1 text-4xl bg-transparent text-white outline-offset-1"
									onChange={handleChange}
								/>
							</div>
						) : (
							<h1 className="text-4xl p-4">{post.title}</h1>
						)}
						<div className="flex items-center justify-end pb-1">
							{auth._id === post.owner._id && (
								<>
									<i
										onClick={() => changeMode()}
										className="fa fa-pen text-orange-600 px-1 hover:text-orange-700 cursor-pointer transition-all"
									></i>
									<i
										onClick={() => deletePost()}
										className="fa fa-trash-can text-red-700 px-1 hover:text-red-800 cursor-pointer transition-all "
									></i>
								</>
							)}
							{post.createdAt === post.updatedAt ? (
								<p className="text-slate-400 text-end text-sm px-2">
									Asked: {new Date(post.createdAt).toLocaleString()}
								</p>
							) : (
								<p className="text-slate-400 text-end text-sm px-2">
									Updated: {new Date(post.updatedAt).toLocaleString()}
								</p>
							)}
						</div>
					</div>
					<div>
						{updateMode ? (
							<div className="text-end mx-3 mt-4">
								<Input
									tag="textarea"
									name="content"
									className="h-64"
									defaultValue={post.content}
									onChange={handleChange}
								/>
								<ButtonLoading
									disabled={false}
									loading={false}
									text="Cancel"
									onClick={() => changeMode()}
								/>
								<ButtonLoading
									disabled={false}
									loading={false}
									text="Save Changes"
									onClick={() => end()}
								/>
							</div>
						) : (
							<p className="p-5 text-slate-300">{post.content}</p>
						)}
					</div>
				</div>
				<ShowComments _id={post._id} />
			</section>
			<aside className="hidden md:w-1/4">
				<p>Some here</p>
			</aside>
		</main>
	);
};

const ShowComments = ({ _id }) => {
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getComments = async () => {
			try {
				setLoading(true);

				const { data } = await axios(
					`${import.meta.env.VITE_URL_BACK}/comment/${_id}`
				);
				setComments(data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		getComments();
	}, [comments.length]);

	if (loading) return <Spinner />;
	return (
		<CommentContext.Provider value={{ comments, setComments }}>
			<div className="mt-7">
				<h2>Comments</h2>
				{comments.map((comment) => (
					<Comment comment={comment} />
				))}
				<Answer _id={_id} />
			</div>
		</CommentContext.Provider>
	);
};

const Comment = ({ comment }) => {
	const [updateMode, setUpdateMode] = useState(false);
	const [commentUpdateChange, setCommentUpdateChange] = useState(false);
	const { auth, loading } = useAuth();
	const { comments, setComments } = useComment();

	const changeMode = () => {
		if (!updateMode) {
			console.log("update mode");
			setUpdateMode(true);
		} else {
			console.log("leave");
			setUpdateMode(false);
		}
	};

	const handleChange = (e) => {
		setCommentUpdateChange({
			...commentUpdateChange,
			[e.target.name]: e.target.value,
		});
	};

	const updateComment = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			if (!token) return;

			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await axios.put(
				`${import.meta.env.VITE_URL_BACK}/comment/update/${comment._id}`,
				commentUpdateChange,
				config
			);
			setComments([...comments, data]);
		} catch (error) {
			console.log(error);
		}
	};

	const deleteComment = async (e) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;

			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await axios.delete(
				`${import.meta.env.VITE_URL_BACK}/comment/delete/${comment._id}`,
				config
			);
			setComments(comments.filter((c) => c._id !== comment._id));
		} catch (error) {
			console.log(error);
		}
	};
	if (loading) return <Spinner />;
	return (
		<div className="border-b flex flex-col justify-between first-of-type:border-y w-full">
			{auth._id === comment.emitter._id ? (
				<div className="text-end">
					<i
						onClick={() => changeMode()}
						className="fa fa-pen text-orange-600 mx-1 hover:text-orange-700 cursor-pointer transition-all"
					></i>
					<i
						onClick={() => deleteComment()}
						className="fa fa-trash-can text-red-700 mx-1 hover:text-red-800 cursor-pointer transition-all "
					></i>
				</div>
			) : (
				<>
					<i className="fa-solid fa-share-from-square text-slate-600 p-1 text-end" />
				</>
			)}
			<div className="flex items-start">
				<img
					src={comment.emitter.avatar}
					alt="avatar"
					className="w-9 rounded-full"
				/>
				{updateMode ? (
					<div className="mx-2 w-full">
						<form onSubmit={updateComment} className="w-full mr-5">
							<Input
								tag="textarea"
								name="comment"
								onChange={handleChange}
								defaultValue={comment.comment}
							/>
							<div className="flex justify-end">
								<ButtonLoading
									disabled={false}
									loading={false}
									text="Cancel"
									onClick={() => changeMode()}
								/>
								<ButtonLoading
									disabled={false}
									loading={false}
									text="Save Changes"
									onClick={() => updateComment()}
								/>
							</div>
						</form>
					</div>
				) : (
					<p className="px-3 break-all">{comment.comment}</p>
				)}
			</div>
			<div className="flex justify-end items-center text-sm">
				<p className="text-slate-500 pr-1">{comment.emitter.username} -</p>
				<p className="text-slate-500 text-sm">
					{new Date(comment.createdAt).toLocaleString()}
				</p>
			</div>
		</div>
	);
};

const Answer = ({ _id }) => {
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
			`${import.meta.env.VITE_URL_BACK}/comment/new`,
			{ comment, post: _id },
			config
		);
		setComments([...comments, data]);
		setComment("");
	};

	return (
		<div className="mt-10 text-end">
			<form onSubmit={submitForm}>
				<Input
					tag="textarea"
					name="comment"
					className="h-8"
					placeholder="Write your answer..."
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
				<ButtonLoading disabled={false} loading={false} text="Answer" />
			</form>
		</div>
	);
};

export default Post;
