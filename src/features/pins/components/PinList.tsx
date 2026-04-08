import { usePinStore } from "@/features/pins/store/usePinStore";
import { formatToDMS } from "@/features/map/utils/formatCoords";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

import { Button, LocationIcon } from "@/shared/components";
import { useIsMobile } from "@/shared/lib";

const extractPinNumber = (label: string): string => {
	const match = label.match(/\d+/);
	return match ? match[0] : "?";
};

const EmptySearchIcon = () => (
	<svg
		aria-hidden="true"
		viewBox="0 0 24 24"
		width="36"
		height="36"
		className="h-9 w-9 shrink-0 text-gray-400"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.8"
	>
		<circle cx="11" cy="11" r="6" />
		<path d="m16 16 5 5" strokeLinecap="round" />
	</svg>
);

const TrashIcon = () => (
	<svg aria-hidden="true" viewBox="0 0 24 24" className="size-2" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M3 6h18" />
		<path d="M8 6V4h8v2" />
		<path d="M19 6l-1 14H6L5 6" />
		<path d="M10 11v6M14 11v6" />
	</svg>
);

type PinListProps = {
	onMobilePinSelect?: (pinId: string | null) => void;
};

export default function PinList({ onMobilePinSelect }: PinListProps) {
	const pins = usePinStore((state) => state.pins);
	const removePin = usePinStore((state) => state.removePin);
	const hoveredPinId = usePinStore((state) => state.hoveredPinId);
	const activePinId = usePinStore((state) => state.activePinId);
	const setHoveredPinId = usePinStore((state) => state.setHoveredPinId);
	const setActivePinId = usePinStore((state) => state.setActivePinId);
	const prefersReducedMotion = useReducedMotion();
	const isMobile = useIsMobile();
	const pinRowRefs = useRef<Record<string, HTMLLIElement | null>>({});

	useEffect(() => {
		const focusedPinId = hoveredPinId ?? (isMobile ? activePinId : null);

		if (!focusedPinId) {
			return;
		}

		pinRowRefs.current[focusedPinId]?.scrollIntoView({
			block: "nearest",
			behavior: prefersReducedMotion ? "auto" : "smooth",
		});
	}, [hoveredPinId, activePinId, isMobile, prefersReducedMotion]);

	return (
		<aside className="h-full overflow-hidden rounded-normal border-gray-200 bg-primary shadow-soft">
			<header className="border-b border-gray-200 px-4 py-4">
				<h2 className="text-2xl font-semibold text-gray-900">Pin Lists</h2>
			</header>

			<div className="h-[calc(100%-88px)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
				{pins.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-start px-6 pt-14 text-center">
						<EmptySearchIcon />
						<p className="mt-4 text-lg font-semibold text-gray-600">No results found</p>
						<p className="mt-0.5 text-sm text-gray-500">Your map pin list will show here.</p>
					</div>
				) : (
					<motion.ul layout initial={false}>
						<AnimatePresence initial={false} mode="popLayout">
							{pins.map((pin) => {
							const pinNumber = extractPinNumber(pin.label);
							const isActive = hoveredPinId === pin.id || (isMobile && activePinId === pin.id);

							return (
								<motion.li
									key={pin.id}
									ref={(element) => {
										pinRowRefs.current[pin.id] = element;
									}}
									layout
									initial={prefersReducedMotion ? false : { opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={
										prefersReducedMotion
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
											  }
									}
									className={`group border-b border-gray-100 px-4 py-3 transition-colors duration-200 hover:bg-gray-100/70 ${isActive ? "bg-gray-100/70" : ""}`}
									onMouseEnter={() => {
										if (isMobile && activePinId === pin.id) {
											return;
										}

										setHoveredPinId(pin.id);
									}}
									onMouseLeave={() => {
										if (isMobile && activePinId === pin.id) {
											return;
										}

										setHoveredPinId(null);
									}}
									onClick={() => {
										if (isMobile) {
											const nextActivePinId = activePinId === pin.id ? null : pin.id;
											setActivePinId(nextActivePinId);
											onMobilePinSelect?.(nextActivePinId);
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
												removePin(pin.id);
											}}
											aria-label={`Delete ${pin.label}`}
										>
											<TrashIcon />
										</Button>
									</div>
								</motion.li>
							);
							})}
						</AnimatePresence>
					</motion.ul>
				)}
			</div>
		</aside>
	);
}
