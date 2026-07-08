import { ArrowRightIcon } from "lucide-react"
import Button from "../Button"
import type { ReactNode } from "react"

interface CardInterface {
	children: ReactNode
	title: string
	height: string
}

const Card = ({ children, title, height }: CardInterface) => {
	return (
		<div className="pb-5 bg-white rounded-xl border border-slate-200/75 shadow-[0_4px_20px_rgba(0,0,0,.04)]" style={{ height: height }}>
			<div className="flex justify-between items-center py-3 px-5">
				<div className="font-medium text-lg">{title}</div>
				<Button variant="light" direction="reverse" size="small" icon={ArrowRightIcon} iconSize={13}>
					See all
				</Button>
			</div>
			<div className="w-[90%] border-b border-b-slate-100 m-auto"></div>

			{children}
		</div>
	)
}

export default Card