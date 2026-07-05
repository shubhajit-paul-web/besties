const Avatar = () => {
	return (
		<div className="flex items-center gap-2.5">
			<img className="w-9 aspect-square rounded-full object-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjPFJ5ubMR28SpGx4N6PlGwsfy8nPBa7nq0XRtnm42neZ6LKFHYVn2zpcA&s=10" alt="" />
			<div>
				<p className="font-medium leading-none">Shubhajit Paul</p>
				<label className="leading-none text-xs opacity-70">Software Engineer</label>
			</div>
		</div>
	)
}

export default Avatar