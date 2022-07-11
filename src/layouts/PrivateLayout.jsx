import React from "react";
import useAuth from "../context/hooks/useAuth";
import { Outlet, Navigate } from "react-router-dom";

const PrivateLayout = () => {
	const { auth, loading } = useAuth();

	if (loading) return <div>Loading...</div>;
	if (auth._id) {
		return (
			<div>
				<Outlet />
			</div>
		);
	}
	return <Navigate to="/" />;
};

export default PrivateLayout;
