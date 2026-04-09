type TrashIconProps = {
	className?: string;
};

export default function TrashIcon({ className = "size-2" }: TrashIconProps) {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M3 6h18" />
			<path d="M8 6V4h8v2" />
			<path d="M19 6l-1 14H6L5 6" />
			<path d="M10 11v6M14 11v6" />
		</svg>
	);
}