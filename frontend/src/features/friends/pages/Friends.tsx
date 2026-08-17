import { MessageSquareMore, UserRoundX } from "lucide-react";
import Button from "../../../components/ui/Button/Button";
import ProfileCard from "../components/ProfileCard";
import ProfileCardsWrapper from "../components/ProfileCardsWrapper";
import FriendRequests from "../components/FriendRequests";

const Friends = () => {
	return (
		<div>
			<div className="bg-slate-50 p-8 pt-6 rounded-2xl">
				<FriendRequests />

				<ProfileCardsWrapper title="Suggested">
					{Array(4)
						.fill(0)
						.map(() => (
							<ProfileCard name="Shubhajit Paul" image="/public/profile-img.jpeg">
								<div className="space-y-2">
									<Button width="100%" centerContent variant="blueSoft">
										Add friend
									</Button>
									<Button width="100%" centerContent variant="lightPlus">
										Remove
									</Button>
								</div>
							</ProfileCard>
						))}
				</ProfileCardsWrapper>

				<div className="w-full border-b-2 border-b-slate-300/70 my-12"></div>

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
			</div>
		</div>
	);
};

export default Friends;
