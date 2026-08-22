/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicRoute from "./guards/PublicRoute";
import ProtectedRoute from "./guards/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import SuspenseLoader from "@/components/ui/SuspenseLoader";

const Login = lazy(() => import("../features/auth/pages/Login"));
const Signup = lazy(() => import("../features/auth/pages/Signup"));
const AppLayout = lazy(() => import("@/components/Layout/AppLayout"));
const Home = lazy(() => import("@/features/home/pages/Home"));
const Saved = lazy(() => import("../features/saved/pages/Saved"));
const Dashboard = lazy(() => import("../features/dashboard/pages/Dashboard"));
const MyPosts = lazy(() => import("../features/posts/pages/MyPosts"));
const Friends = lazy(() => import("../features/friends/pages/Friends"));
const VideoCall = lazy(() => import("../features/videoCall/pages/VideoCall"));
const AudioCall = lazy(() => import("../features/audioCall/pages/AudioCall"));
const Chat = lazy(() => import("../features/chat/pages/Chat"));
const Profile = lazy(() => import("../features/profile/pages/Profile"));
const NotFound = lazy(() => import("../pages/NotFound"));

const router = () => {
	return (
		<BrowserRouter>
			<Suspense fallback={<SuspenseLoader />}>
				<Routes>
					<Route element={<PublicRoute />}>
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route path="/app" element={<AppLayout />}>
							<Route path="home" element={<Home />} />
							<Route path="my-posts" element={<MyPosts />} />
							<Route path="friends" element={<Friends />} />
							<Route path="saved" element={<Saved />} />
							<Route path="dashboard" element={<Dashboard />} />
							<Route path="video-call" element={<VideoCall />} />
							<Route path="audio-call" element={<AudioCall />} />
							<Route path="chat/:id" element={<Chat />} />
							<Route path="profile" element={<Profile />} />
						</Route>
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Suspense>
			<ToastContainer />
		</BrowserRouter>
	);
};

export default router;
