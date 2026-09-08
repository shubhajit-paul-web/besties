import { Mic, MicOff, Video, VideoOff, MonitorUp, MonitorOff, Phone, PhoneOff, Clock } from "lucide-react";
import IconControlButton from "@/components/ui/Button/IconControlButton";
import formatCallDuration from "@/utils/formatCallDuration";
import type { CallStatus } from "@/types/global.types";

interface CallControlsProps {
	callStatus: CallStatus;
	callDuration: number;
	isAudioOn: boolean;
	isVideoOn: boolean;
	isScreenSharing: boolean;
	onToggleMic: () => void;
	onToggleCamera: () => void;
	onToggleScreen: () => void;
	onStartCall: () => void;
	onEndCall: () => void;
}

const CallControls = ({ callStatus, callDuration, isAudioOn, isVideoOn, isScreenSharing, onToggleMic, onToggleCamera, onToggleScreen, onStartCall, onEndCall }: CallControlsProps) => (
	<div className="relative z-30 mx-auto mt-6 flex w-fit max-w-full flex-wrap items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-slate-100/70 p-4 sm:gap-5 sm:p-5">
		<IconControlButton activeIcon={Mic} inActiveIcon={MicOff} isActive={isAudioOn} tooltipTitle="Microphone" onClick={onToggleMic} />
		<IconControlButton activeIcon={Video} inActiveIcon={VideoOff} isActive={isVideoOn} tooltipTitle="Camera" onClick={onToggleCamera} />
		<IconControlButton activeIcon={MonitorUp} inActiveIcon={MonitorOff} isActive={isScreenSharing} tooltipTitle="Screen" onClick={onToggleScreen} />

		{callStatus === "connected" && (
			<div className="bg-white border border-zinc-200 text-zinc-600 flex items-center gap-1.5 px-3 py-1 rounded-full">
				<Clock size={16} />
				<span>{formatCallDuration(callDuration)}</span>
			</div>
		)}

		{callStatus !== "connected" ? (
			<button
				onClick={onStartCall}
				disabled={callStatus === "calling"}
				className="flex px-6 py-3 items-center gap-2.5 font-medium rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
				<Phone size={20} />
				{callStatus === "calling" ? "Calling..." : "Call"}
			</button>
		) : (
			<button onClick={onEndCall} className="flex px-6 py-3 items-center gap-2.5 font-medium rounded-full bg-red-500 text-white hover:bg-red-600">
				<PhoneOff size={20} />
				End
			</button>
		)}
	</div>
);

export default CallControls;
