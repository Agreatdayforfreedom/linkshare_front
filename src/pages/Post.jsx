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

	useEffect(() => {
		const getPost = async () => {
			setLoading(true);
			const { data } = await axios(`http://localhost:4000/post/${params.id}`);
			setPost(data);
		};
		getPost();
		setLoading(false);
	}, []);

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
				`http://localhost:4000/post/update/${post._id}`,
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
		await axios.delete(`http://localhost:4000/post/delete/${post._id}`, config);
		navigate("/");
	};

	if (loading || post._id === undefined) return <Spinner />;
	return (
		<div className="flex justify-between">
			<div className="p-4 ml-5 w-full">
				<div className="border-b">
					{updateMode ? (
						<div className="w-full">
							<input
								className="border p-1 px-4 my-2 text-4xl"
								name="title"
								defaultValue={post.title}
								autoFocus
								onChange={handleChange}
							/>
						</div>
					) : (
						<h1 className="text-4xl p-4">{post.title}</h1>
					)}
					<div className="flex items-center justify-end pb-1">
						<i
							onClick={() => changeMode()}
							className="fa fa-pen text-orange-600 px-1 hover:text-orange-700 cursor-pointer transition-all"
						></i>
						<i
							onClick={() => deletePost()}
							className="fa fa-trash-can text-red-700 px-1 hover:text-red-800 cursor-pointer transition-all "
						></i>

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
						<div className="text-end">
							<textarea
								className="p-5 text-slate-600 w-full border-l"
								name="content"
								defaultValue={post.content}
								onChange={handleChange}
							></textarea>
							<ButtonLoading
								disabled={false}
								loading={false}
								text="Save Changes"
								onClick={() => end()}
							/>
							<ButtonLoading
								disabled={false}
								loading={false}
								text="Cancel"
								onClick={() => changeMode()}
							/>
						</div>
					) : (
						<p className="p-5 text-slate-600">{post.content}</p>
					)}
				</div>
				<ShowComments _id={post._id} />
			</div>
			<div className="w-1/4">Some here</div>
		</div>
	);
};

const ShowComments = ({ _id }) => {
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getComments = async () => {
			try {
				setLoading(true);

				const { data } = await axios(`http://localhost:4000/comment/${_id}`);
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
				`http://localhost:4000/comment/update/${comment._id}`,
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
			window.scrollTo({ top: document.scro });
			const token = localStorage.getItem("token");
			if (!token) return;

			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await axios.delete(
				`http://localhost:4000/comment/delete/${comment._id}`,
				config
			);
			setComments(comments.filter((c) => c._id !== comment._id));
		} catch (error) {
			console.log(error);
		}
	};
	if (loading) return <Spinner />;
	return (
		<div className="border-b flex flex-col justify-between first-of-type:border-y">
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
			<div className="flex items-center">
				<img src={comment.emitter.avatar} className="w-9 rounded-full" />
				{updateMode ? (
					<form onSubmit={updateComment}>
						<textarea
							defaultValue={comment.comment}
							className="px-2 w-full"
							autoFocus
							name="comment"
							onChange={handleChange}
						></textarea>
						<button
							type="submit"
							className="px-4 py-1 bg-blue-700 text-white mt-2 border rounded"
						>
							Save
						</button>
					</form>
				) : (
					<p className="px-2">{comment.comment}</p>
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
			"http://localhost:4000/comment/new",
			{ comment, post: _id },
			config
		);
		setComments([...comments, data]);
		setComment("");
	};

	return (
		<div className="mt-10">
			<form onSubmit={submitForm}>
				<Input
					tag="textarea"
					name="comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
				<ButtonLoading disabled={false} loading={false} text="Answer" />
			</form>
		</div>
	);
};

export default Post;
