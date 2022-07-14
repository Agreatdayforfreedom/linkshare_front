import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const isAuth = async () => {
			try {
				const token = localStorage.getItem("token");
				console.log(token);
				if (!token) return setLoading(false);
				const config = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};

				const { data } = await axios(
					"http://localhost:4000/auth/profile",
					config
				);
				//if there is an error in database
				if (data === null) {
					localStorage.removeItem("token");
					document.location.reload();
					return;
				}
				setAuth(data);
			} catch (error) {
				console.log(error);
				setAuth({});
			}
			setLoading(false);
		};
		isAuth();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				auth,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
