import React from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";
import useAuth from "../context/hooks/useAuth";

const AuthLayout = () => {
	const { auth, logout, loading } = useAuth();

	if (loading) return <Spinner />;
	return (
		<>
			<header className="flex items-center border-b p-3 border-b-blue-500 justify-between bg-gray-900">
				<Link to="/" className="font-bold text-xl">
					Linkshare
				</Link>

				{auth._id ? (
					<>
						<div className="flex items-center">
							<img
								src={auth.avatar}
								alt="avatar"
								className="w-10 h-10 rounded-full"
							/>

							<button
								className="mx-1 text-red-800 cursor-pointer font-bold hover:text-red-900 transition-all"
								onClick={() => logout()}
							>
								Log out
							</button>
						</div>
					</>
				) : (
					<ul className="flex">
						<li className="mx-2">
							<Link
								to="login"
								className="text-slate-300 hover:text-white transition-all"
							>
								Login
							</Link>
						</li>
						<li className="mx-2">
							<Link
								to="signup"
								className="text-slate-300 border px-3 py-2 border-slate-500 hover:text-white transition-all"
							>
								Sign up
							</Link>
						</li>
					</ul>
				)}
			</header>
			<nav className="bg-neutral-900 py-2 border-b border-b-neutral-800">
				<ul className="flex w-fit mx-auto">
					<li className="mx-2 font-semibold  ">
						<Link to="/" className="hover:text-slate-300">
							Home
						</Link>
					</li>
					<li className="mx-2">
						<Link
							to="/new-post"
							className="text-slate-200 border p-1 rounded-xl bg-lime-900 font-semibold hover:bg-lime-800"
						>
							Create Post
						</Link>
					</li>
				</ul>
			</nav>

			<Outlet />
		</>
	);
};

export default AuthLayout;
