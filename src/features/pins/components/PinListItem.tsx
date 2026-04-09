import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

import { formatToDMS } from "@/features/map/utils/formatCoords";
import type { Pin } from "@/features/pins/types/pin";
import { Button, LocationIcon, TrashIcon } from "@/shared/components";

const extractPinNumber = (label: string): string => {
	const match = label.match(/\d+/);
	return match ? match[0] : "?";
};

type PinListItemProps = {
	pin: Pin;
	isActive: boolean;
	isMobile: boolean;
	isMobileActive: boolean;
	prefersReducedMotion: boolean;
	onHoverStart: (pinId: string) => void;
	onHoverEnd: () => void;
	onMobileToggle: (pinId: string) => void;
	onDelete: (pinId: string) => void;
};

const animationProps = (prefersReducedMotion: boolean): Pick<HTMLMotionProps<"li">, "initial" | "animate" | "exit" | "transition"> => ({
	initial: prefersReducedMotion ? false : { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: prefersReducedMotion
		? { duration: 0 }
		: {
				opacity: { duration: 0.2, ease: "easeOut" },
				layout: {
					type: "spring",
					stiffness: 360,
					damping: 32,
					mass: 0.85,
					delay: 0.08,
				},
		  },
});

const PinListItem = forwardRef<HTMLLIElement, PinListItemProps>(function PinListItemComponent(
	{
		pin,
		isActive,
		isMobile,
		isMobileActive,
		prefersReducedMotion,
		onHoverStart,
		onHoverEnd,
		onMobileToggle,
		onDelete,
	},
	ref,
) {
	const pinNumber = extractPinNumber(pin.label);

	return (
		<motion.li
			ref={ref}
			layout
			{...animationProps(prefersReducedMotion)}
			className={`group border-b border-gray-100 px-4 py-3 transition-colors duration-200 hover:bg-gray-100/70 ${isActive ? "bg-gray-100/70" : ""}`}
			onMouseEnter={() => {
				if (isMobile && isMobileActive) {
					return;
				}

				onHoverStart(pin.id);
			}}
			onMouseLeave={() => {
				if (isMobile && isMobileActive) {
					return;
				}

				onHoverEnd();
			}}
			onClick={() => {
				if (isMobile) {
					onMobileToggle(pin.id);
				}
			}}
		>
			<div className="flex items-center gap-3">
				<div
					className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-regular text-blue-600 transition-all duration-200 ${isActive ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200" : ""}`}
				>
					#{pinNumber}
				</div>

				<div className="min-w-0 flex-1">
					<p
						className={`truncate text-xl font-semibold text-gray-900 transition-colors duration-200 group-hover:text-gray-950 ${isActive ? "text-gray-950" : ""}`}
					>
						{pin.label}
					</p>
					<div
						className={`mt-1 flex items-center gap-1.5 text-ccordinates text-gray-500 transition-colors duration-200 group-hover:text-gray-600 ${isActive ? "text-gray-600" : ""}`}
					>
						<LocationIcon />
						<span className="truncate">{formatToDMS(pin.lat, pin.lng)}</span>
					</div>
					<p
						className={`mt-1 truncate text-address text-gray-400 transition-colors duration-200 group-hover:text-gray-500 ${isActive ? "text-gray-500" : ""}`}
						title={pin.address || "Loading address..."}
					>
						{pin.address || "Loading address..."}
					</p>
				</div>

				<Button
					variant="delete"
					onClick={(event) => {
						event.stopPropagation();
						onDelete(pin.id);
					}}
					aria-label={`Delete ${pin.label}`}
				>
					<TrashIcon />
				</Button>
			</div>
		</motion.li>
	);
});

export default PinListItem;