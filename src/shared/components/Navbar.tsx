const MapPinIcon = () => (
	<svg
		aria-hidden="true"
		viewBox="0 0 24 24"
		width="28"
		height="28"
		className="h-7 w-7 shrink-0 text-gray-700"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<path d="M3 6.5 8.8 4l6.4 2.5L21 4v13.5L15.2 20 8.8 17.5 3 20V6.5Z" />
		<path d="M8.8 4v13.5M15.2 6.5V20" />
	</svg>
);

type NavbarProps = {
	title?: string;
};

export default function Navbar({ title = "Map Pinboard" }: NavbarProps) {
	return (
		<header className="z-20 flex h-16 shrink-0 items-center justify-center border-b border-gray-200 bg-primary px-4">
			<div className="flex items-center gap-2 text-[22px] font-semibold text-gray-900">
				<MapPinIcon />
				<span>{title}</span>
			</div>
		</header>
	);
}
