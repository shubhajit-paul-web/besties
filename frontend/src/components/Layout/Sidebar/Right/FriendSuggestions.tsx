import { UserRoundPlus } from "lucide-react";
import Avatar from "../../../ui/Avatar";
import Button from "../../../ui/Button";
import Card from "../../../ui/Card";
import useSWR from "swr";
import fetcher from "../../../../utils/fetcher";
import { Skeleton } from "antd";
import ErrorMessage from "../../../ui/ErrorMessage";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { HttpInterceptor } from "../../../../lib/axios";
import type { UserType } from "../../../../types/user.types";

type Loading = {
	state: boolean;
	index: number | null;
};

const SkeletonLoader = () => {
	return (
		<div className="px-5 space-y-3">
			{Array(4)
				.fill(0)
				.map(() => (
					<div className="flex items-center gap-2.5">
						<Skeleton.Node active style={{ width: "60px", height: 60 }} />
						<div className="space-y-2 pb-0.5">
							<Skeleton.Node active style={{ width: "170px", height: 20 }} />
							<Skeleton.Node active style={{ width: "100px", height: 20 }} />
						</div>
					</div>
				))}
		</div>
	);
};

const FriendSuggestions = () => {
	const [loading, setLoading] = useState<Loading>({ state: false, index: null });

	// Fetch friend suggestions
	const { data, isLoading, error, mutate } = useSWR("/friends/suggestions", fetcher, {
		revalidateOnFocus: false,
		errorRetryCount: 2,
	});

	const friendSuggestions = data?.data?.suggestions;

	if (!isLoading && (error || !friendSuggestions)) {
		return <ErrorMessage />;
	}

	// Send friend request
	const sendFriendRequest = async (id: string, index: number) => {
		setLoading({ state: true, index: index });

		try {
			await HttpInterceptor.post("/friends/requests", {
				receiverId: id,
			});

			mutate(); // refresh the suggestions

			toast.success("Friend request sent successfully.", {
				position: "top-center",
			});
		} catch (err) {
			if (axios.isAxiosError(err)) {
				return toast.error(err.response?.data?.message ?? "Friend request send failed.", {
					position: "top-center",
				});
			}

			toast.error("Friend request send failed.", {
				position: "top-center",
			});

			console.error(err);
		} finally {
			setLoading({ state: false, index: null });
		}
	};

	return (
		<Card title="Suggested" height="43%">
			<div
				className="w-full mt-3 space-y-1 overflow-y-auto"
				style={{
					height: `calc(100% - 52px)`,
				}}>
				{isLoading ? (
					<SkeletonLoader />
				) : (
					<>
						{friendSuggestions.map((user: Pick<UserType, "_id" | "name" | "avatar">, index: number) => {
							if (!user) {
								return;
							}

							const { name } = user;
							const fullName = `${name?.first} ${name?.last ?? ""}`;

							return (
								<div key={user._id} className="py-3 px-5 hover:bg-slate-50">
									<Avatar
										image="/profile-img.jpeg"
										imageShape="md"
										imageSize={56}
										title={fullName}
										subtitle={
											<div className="flex items-center gap-1 mt-3">
												<Button
													onClick={() => sendFriendRequest(user._id, index)}
													variant="primary"
													icon={UserRoundPlus}
													iconSize={13}
													loader={loading.index === index && loading.state}
													loaderText="Sending…"
													disabled={loading.index !== index && loading.state}
													style={{ padding: "5px 10px", borderRadius: "6px" }}>
													Add Friend
												</Button>
											</div>
										}
									/>
								</div>
							);
						})}
					</>
				)}
			</div>
		</Card>
	);
};

export default FriendSuggestions;
