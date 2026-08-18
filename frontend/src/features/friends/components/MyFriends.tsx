import ProfileCardsWrapper from "./ProfileCardsWrapper";
import ProfileCard from "./ProfileCard";
import Button from "@/components/ui/Button/Button";
import { MessageSquareMore, UserRoundX } from "lucide-react";

const MyFriends = () => {
	return (
		<ProfileCardsWrapper title="My Friends" totalProfilesCount={27}>
			{Array(27)
				.fill(0)
				.map(() => (
					<ProfileCard name="Shubhajit Paul" image="/public/profile-img.jpeg">
						<div className="space-y-2">
							<Button width="100%" centerContent variant="lightPlus" icon={UserRoundX} iconSize={18}>
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
