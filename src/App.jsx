import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import AuthLayout from "./layouts/AuthLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewPost from "./pages/NewPost";
import Post from "./pages/Post";
import Signup from "./pages/Signup";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" exact element={<AuthLayout />}>
						<Route index element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
					</Route>
					<Route path="/" exact element={<PrivateLayout />}>
						<Route path="/new-post" element={<NewPost />} />
						<Route path="/post/:id" element={<Post />} />
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
