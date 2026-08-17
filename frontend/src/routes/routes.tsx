import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, Layout } from "lucide-react";
import PublicRoute from "./guards/PublicRoute";
import ProtectedRoute from "./guards/ProtectedRoute";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import Saved from "../features/saved/pages/Saved";
import Dashboard from "../features/dashboard/pages/Dashboard";
import MyPosts from "../features/posts/pages/MyPosts";
import Friends from "../features/friends/pages/Friends";
import VideoCall from "../features/videoCall/pages/VideoCall";
import AudioCallManager from "../features/audioCall/pages/AudioCall";
import ChatManager from "../features/chat/pages/Chat";
import Profile from "../features/profile/pages/Profile";
import NotFound from "../pages/NotFound";
import { ToastContainer } from "react-toastify";

const router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<PublicRoute />}>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
				</Route>
				<Route element={<ProtectedRoute />}>
					<Route path="/app" element={<Layout />}>
						<Route index element={<Home />} />
						<Route path="my-posts" element={<MyPosts />} />
						<Route path="friends" element={<Friends />} />
						<Route path="saved" element={<Saved />} />
						<Route path="dashboard" element={<Dashboard />} />
						<Route path="video-call" element={<VideoCall />} />
						<Route path="audio-call" element={<AudioCallManager />} />
						<Route path="chat" element={<ChatManager />} />
						<Route path="profile" element={<Profile />} />
					</Route>
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
			<ToastContainer />
		</BrowserRouter>
	);
};

export default router;
