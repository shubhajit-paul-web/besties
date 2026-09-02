import { Empty, type EmptyProps } from "antd";

const EmptyState = ({ ...props }: EmptyProps) => {
	return (
		<div className="m-auto">
			<Empty {...props} />
		</div>
	);
};

export default EmptyState;
