import React from "react";
import useAuth from "../context/hooks/useAuth";
import { Outlet, Navigate, Link } from "react-router-dom";

const PrivateLayout = () => {
	const { auth, loading } = useAuth();

	if (loading) return <div>Loading...</div>;
	if (auth._id) {
		return (
			<div>
				<div className="border flex p-2 justify-center">
					<Link className="px-1" to="/">
						Home
					</Link>
				</div>
				<Outlet />
			</div>
		);
	}
	return <Navigate to="/" />;
};

export default PrivateLayout;
