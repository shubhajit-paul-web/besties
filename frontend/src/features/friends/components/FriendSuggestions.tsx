import Button from "@/components/ui/Button/Button";
import ProfileCard from "./ProfileCard";
import ProfileCardsWrapper from "./ProfileCardsWrapper";

const FriendSuggestions = () => {
	return (
		<ProfileCardsWrapper title="Suggested">
			{Array(4)
				.fill(0)
				.map((_, index) => (
					<ProfileCard key={index} name="Shubhajit Paul" image="/profile-img.jpeg">
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
	);
};

export default FriendSuggestions;
