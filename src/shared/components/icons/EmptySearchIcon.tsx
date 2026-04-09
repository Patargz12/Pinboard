type EmptySearchIconProps = {
	className?: string;
};

export default function EmptySearchIcon({ className = "h-9 w-9 shrink-0 text-gray-400" }: EmptySearchIconProps) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			width="36"
			height="36"
			className={className}
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
		>
			<circle cx="11" cy="11" r="6" />
			<path d="m16 16 5 5" strokeLinecap="round" />
		</svg>
	);
}