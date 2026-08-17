import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, Layout } from "lucide-react";
import RedirectGuard from "./guards/PublicRoute";
import AuthGuard from "./guards/ProtectedRoute";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import Saved from "../pages/Saved";
import Dashboard from "../pages/Dashboard";
import MyPosts from "../pages/MyPosts";
import Friends from "../features/friends/pages/Friends";
import VideoCallManager from "../pages/VideoCallManager";
import AudioCallManager from "../features/audioCall/pages/AudioCall";
import ChatManager from "../features/chat/pages/Chat";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import { ToastContainer } from "react-toastify";

const router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<RedirectGuard />}>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
				</Route>
				<Route element={<AuthGuard />}>
					<Route path="/app" element={<Layout />}>
						<Route index element={<Home />} />
						<Route path="my-posts" element={<MyPosts />} />
						<Route path="friends" element={<Friends />} />
						<Route path="saved" element={<Saved />} />
						<Route path="dashboard" element={<Dashboard />} />
						<Route path="video-call" element={<VideoCallManager />} />
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
