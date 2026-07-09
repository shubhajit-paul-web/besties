import moment from "moment";

const getPostTime = (createdAt: string) => {
	const now = moment();
	const postTime = moment(createdAt);
	const diffMinutes = now.diff(postTime, "minutes");
	const diffHours = now.diff(postTime, "hours");
	const diffDays = now.diff(postTime, "days");

	if (diffMinutes < 1) return "Just now";
	if (diffMinutes < 60) return `${diffMinutes}m`;
	if (diffHours < 24) return `${diffHours}h`;
	if (diffDays < 7) return `${diffDays}d`;
	if (postTime.isSame(now, "year")) return postTime.format("MMM D");

	return postTime.format("MMM D, YYYY");
};

export default getPostTime;
