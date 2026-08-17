import logo from "../../assets/besties-logo.png"

const Logo = () => {
	return (
		<div className="flex items-center gap-1">
			<div className="w-10 h-10 p-1 rounded-full overflow-hidden">
				<img className="w-full h-full object-cover" src={logo} alt="Besties Logo" />
			</div>
			<h1 className="text-xl font-medium">Besties</h1>
		</div>
	)
}

export default Logo