import type { ReactNode } from "react"

interface CardInterface {
	children: ReactNode
	image: string
	name: string
}

const ProfileCard = ({ children, name, image }: CardInterface) => {
	return (
		<div className="bg-white border border-slate-300/75 overflow-hidden rounded-xl">
			<img className="w-full aspect-square" src={image} alt="Profile image" />
			<div className="p-2.5">
				<div className="font-medium text-slate-700 mb-4">{name}</div>
				{children}
			</div>
		</div>
	)
}

export default ProfileCard