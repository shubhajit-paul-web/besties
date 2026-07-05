import type { ReactNode } from "react"

interface AvatarInterface {
	image: string
	title?: string
	subtitle?: ReactNode
	imageSize?: number
	className?: string
}

const Avatar = ({ image, title, subtitle, imageSize = 9, className = "" }: AvatarInterface) => {
	return (
		<div className={`flex items-center gap-2.5 ${className}`}>
			<img className={`w-${imageSize} w-9 aspect-square rounded-full object-cover`} src={image} alt="avatar image" />

			{
				(title || subtitle) &&
				<div>
					{
						title && <div className="font-medium leading-tight">{title}</div>
					}
					{
						subtitle &&
						<div className="leading-tight text-xs">{subtitle}</div>
					}
				</div>
			}
		</div>
	)
}

export default Avatar