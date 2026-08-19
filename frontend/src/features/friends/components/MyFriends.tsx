import ProfileCardsWrapper from "./ProfileCardsWrapper";
import ProfileCard from "./ProfileCard";
import Button from "@/components/ui/Button/Button";
import { MessageSquareMore, UserRoundX } from "lucide-react";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import formatUserName from "@/utils/formatUserName";
import ProfileCardSkeleton from "./ProfileCardSkeleton";
import useRemoveFriend from "../hooks/useRemoveFriend";
import type { FriendListItem } from "../types/friend.types";

const MyFriends = () => {
	const { data, isLoading } = useSWR("/friends", fetcher);
	const { handleRemoveFriend } = useRemoveFriend();

	if (isLoading) {
		return (
			<>
				<ProfileCardsWrapper title="My Friends" totalProfilesCount={0}></ProfileCardsWrapper>
				<ProfileCardSkeleton profilesCount={8} />
			</>
		);
	}

	const friends = data?.data?.friends;

	if (!Array.isArray(friends) || friends.length === 0) {
		return <ProfileCardsWrapper title="My Friends" totalProfilesCount={0}></ProfileCardsWrapper>;
	}

	return (
		<ProfileCardsWrapper title="My Friends" totalProfilesCount={friends?.length}>
			{friends.map(({ friendshipId, user }: FriendListItem) => (
				<ProfileCard key={friendshipId} name={formatUserName(user.name)} image={user.avatar || "/profile-img.jpeg"}>
					<div className="space-y-2">
						<Button onClick={() => handleRemoveFriend(friendshipId)} width="100%" centerContent variant="lightPlus" icon={UserRoundX} iconSize={18}>
							Unfriend
						</Button>
						<Button width="100%" centerContent variant="primary" icon={MessageSquareMore} iconSize={18}>
							Message
						</Button>
					</div>
				</ProfileCard>
			))}
		</ProfileCardsWrapper>
	);
};

export default MyFriends;
