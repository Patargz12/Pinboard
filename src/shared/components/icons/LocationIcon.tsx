type LocationIconProps = {
	className?: string;
};

export default function LocationIcon({ className = "h-3.5 w-3.5 text-gray-400" }: LocationIconProps) {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
			<path d="M12 2a7 7 0 0 0-7 7c0 4.7 5.1 10.9 6.3 12.2a1 1 0 0 0 1.4 0C13.9 19.9 19 13.7 19 9a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
		</svg>
	);
}