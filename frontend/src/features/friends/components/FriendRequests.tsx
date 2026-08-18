import fetcher from "@/utils/fetcher";
import Button from "@/components/ui/Button/Button";
import ProfileCard from "./ProfileCard";
import ProfileCardsWrapper from "./ProfileCardsWrapper";
import useSWR from "swr";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { FriendRequest } from "../types/friend.types";
import ProfileCardSkeleton from "./ProfileCardSkeleton";
import useAcceptFriendRequest from "../hooks/useAcceptFriendRequest";
import useRejectFriendRequest from "../hooks/useRejectFriendRequest";
import formatUserName from "@/utils/formatUserName";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/scrollbar";
import "../styles/swiper.css";

const FriendRequests = () => {
	const { data, error, isLoading } = useSWR("/friends/requests/received", fetcher);
	const { handleAcceptFriendRequest } = useAcceptFriendRequest();
	const { handleRejectFriendRequest } = useRejectFriendRequest();

	if (isLoading) {
		return (
			<>
				<ProfileCardsWrapper title="Friend requests" totalProfilesCount={0}></ProfileCardsWrapper>
				<ProfileCardSkeleton />
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

	return (
		<>
			<ProfileCardsWrapper title="Friend requests" totalProfilesCount={friendRequests.length}></ProfileCardsWrapper>
			<Swiper
				modules={[Scrollbar]}
				spaceBetween={12}
				// slidesPerView={4}
				scrollbar={{ draggable: true, hide: true }}
				grabCursor={true}
				className="friend-swiper"
				breakpoints={{
					320: {
						slidesPerView: 1.2,
					},
					640: {
						slidesPerView: 2.2,
					},
					900: {
						slidesPerView: 3.2,
					},
					1200: {
						slidesPerView: 4.2,
					},
				}}>
				{friendRequests.map((request) => {
					const sender = request?.sender;

					if (!sender || typeof sender !== "object") {
						return;
					}

					return (
						<SwiperSlide>
							<ProfileCard name={formatUserName(sender.name)} image={sender.avatar || "/profile-img.jpeg"}>
								<div className="space-y-2">
									<Button onClick={() => handleAcceptFriendRequest(request._id)} width="100%" centerContent>
										Accept
									</Button>
									<Button onClick={() => handleRejectFriendRequest(request._id)} width="100%" centerContent variant="lightPlus">
										Reject
									</Button>
								</div>
							</ProfileCard>
						</SwiperSlide>
					);
				})}
			</Swiper>

			<div className="w-full border-b-2 border-b-slate-300/70 my-12"></div>
		</>
	);
};

export default FriendRequests;
