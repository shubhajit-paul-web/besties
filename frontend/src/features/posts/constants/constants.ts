import type { FeelingOption } from "../types/post.types";

// Supported MIME types
export const SUPPORTED_CONTENT_TYPES = [
	// Images
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"image/avif",

	// Videos
	"video/mp4",
	"video/webm",
	"video/quicktime",

	// Documents
	"application/pdf",
] as const;

export const FEELING_OPTIONS: FeelingOption[] = [
	{ id: "happy", label: "Happy", icon: "😊" },
	{ id: "loved", label: "Loved", icon: "🥰" },
	{ id: "excited", label: "Excited", icon: "✨" },
	{ id: "grateful", label: "Grateful", icon: "🙏" },
	{ id: "blessed", label: "Blessed", icon: "😇" },
	{ id: "relaxed", label: "Relaxed", icon: "😌" },
	{ id: "proud", label: "Proud", icon: "🌟" },
	{ id: "motivated", label: "Motivated", icon: "💪" },
	{ id: "sad", label: "Sad", icon: "😔" },
	{ id: "tired", label: "Tired", icon: "😴" },
	{ id: "lonely", label: "Lonely", icon: "🌙" },
	{ id: "angry", label: "Angry", icon: "😤" },
	{ id: "cool", label: "Cool", icon: "😎" },
	{ id: "hopeful", label: "Hopeful", icon: "🌈" },
	{ id: "bored", label: "Bored", icon: "🥱" },
	{ id: "silly", label: "Silly", icon: "😜" },
] as const;
