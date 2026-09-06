import moment from "moment";

const formatCallDuration = (seconds: number) => {
	return moment.utc(seconds * 1000).format("HH:mm:ss");
};

export default formatCallDuration;
