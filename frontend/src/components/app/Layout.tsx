const Layout = () => {
	const LEFT_SIDEBAR_WIDTH = 350;
	const RIGHT_SIDEBAR_WIDTH = 400;
	const POSTS_SECTION_DIMENSION = {
		width: `calc(100% - ${LEFT_SIDEBAR_WIDTH + RIGHT_SIDEBAR_WIDTH}px)`,
		marginLeft: `${LEFT_SIDEBAR_WIDTH}px`
	}

	return (
		<div>
			{/* Left sidebar */}
			<aside className={`w-[${LEFT_SIDEBAR_WIDTH}px] h-screen p-8 fixed top-0 left-0`}>
				<div className="h-full bg-slate-100 border-r border-slate-200 rounded-xl p-8">
					<div className="flex items-center gap-2.5">
						<div className="w-14 h-14 border-3 border-purple-500 rounded-full overflow-hidden">
							<img className="w-full h-full object-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjPFJ5ubMR28SpGx4N6PlGwsfy8nPBa7nq0XRtnm42neZ6LKFHYVn2zpcA&s=10" alt="" />
						</div>
						<div>
							<p className="font-medium text-lg leading-tight">Shubhajit Paul</p>
							<label className="leading-tight opacity-70">Software Engineer</label>
						</div>
					</div>
				</div>
			</aside>

			<section className="min-h-screen p-8" style={POSTS_SECTION_DIMENSION}>
				<div className="bg-slate-100 w-full min-h-screen rounded-xl"></div>
			</section>

			{/* Right sidebar */}
			<aside className={`w-[${RIGHT_SIDEBAR_WIDTH}px] h-screen p-8 fixed top-0 right-0`} style={{ width: RIGHT_SIDEBAR_WIDTH + "px" }}>
				<div className="h-full bg-slate-100 border-l border-slate-200 rounded-xl"></div>
			</aside>
		</div>
	)
}

export default Layout