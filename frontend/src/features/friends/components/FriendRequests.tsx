import { toast } from "react-toastify";
import { HttpInterceptor } from "../../../lib/axios";
import fetcher from "../../../utils/fetcher";
import Button from "../../../components/ui/Button/Button";
import ProfileCard from "./ProfileCard";
import ProfileCardsWrapper from "./ProfileCardsWrapper";
import useSWR from "swr";
import CandidateSkeleton from "./CandidateSkeleton";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import type { FriendRequest } from "../types/friend.types";
import formatUserName from "../../../utils/formatUserName";

const FriendRequests = () => {
	const { data, error, isLoading, mutate } = useSWR("/friends/requests/received", fetcher);

	if (isLoading) {
		return (
			<>
				<ProfileCardsWrapper title="Friend requests" totalProfilesCount={0}></ProfileCardsWrapper>
				<CandidateSkeleton />
				<div className="w-full border-b-2 border-b-slate-300/70 my-12"></div>
			</>
		);
	}

	if (error) {
		return <ErrorMessage className="mb-12" />;
	}

	const friendRequests: FriendRequest[] = data?.data?.requests;

	if (!friendRequests || friendRequests?.length === 0 || !Array.isArray(friendRequests)) {
		return;
	}

	const acceptFriendRequest = async (friendshipId: string) => {
		console.log(friendshipId);
		try {
			await HttpInterceptor.patch(`/friends/requests/${friendshipId}/accept`);

			toast.success("Friend request accepted successfully", {
				position: "top-center",
			});

			mutate();
		} catch (err) {
			toast.error("Friend request accepted faild", {
				position: "top-center",
			});

			console.error(err);
		}
	};

	return (
		<>
			<ProfileCardsWrapper title="Friend requests" totalProfilesCount={friendRequests.length}>
				{friendRequests.map((request) => {
					const sender = request?.sender;

					if (!sender || typeof sender !== "object") {
						return;
					}

					return (
						<ProfileCard name={formatUserName(sender.name)} image={sender.avatar || "/profile-img.jpeg"}>
							<div className="space-y-2">
								<Button onClick={() => acceptFriendRequest(request._id)} width="100%" centerContent>
									Accept
								</Button>
								<Button width="100%" centerContent variant="lightPlus">
									Reject
								</Button>
							</div>
						</ProfileCard>
					);
				})}
			</ProfileCardsWrapper>

			<div className="w-full border-b-2 border-b-slate-300/70 my-12"></div>
		</>
	);
};

export default FriendRequests;
