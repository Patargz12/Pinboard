import { usePinStore } from "@/features/pins/store/usePinStore";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

import PinListItem from "@/features/pins/components/PinListItem";
import { EmptySearchIcon } from "@/shared/components";
import { useIsMobile } from "@/shared/lib";

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
	const shouldReduceMotion = Boolean(prefersReducedMotion);
	const isMobile = useIsMobile();
	const pinRowRefs = useRef<Record<string, HTMLLIElement | null>>({});

	const handleMobilePinToggle = (pinId: string) => {
		const nextActivePinId = activePinId === pinId ? null : pinId;
		setActivePinId(nextActivePinId);
		onMobilePinSelect?.(nextActivePinId);
	};

	useEffect(() => {
		const focusedPinId = hoveredPinId ?? (isMobile ? activePinId : null);

		if (!focusedPinId) {
			return;
		}

		pinRowRefs.current[focusedPinId]?.scrollIntoView({
			block: "nearest",
			behavior: shouldReduceMotion ? "auto" : "smooth",
		});
	}, [hoveredPinId, activePinId, isMobile, shouldReduceMotion]);

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
								const isActive = hoveredPinId === pin.id || (isMobile && activePinId === pin.id);
								const isMobileActive = isMobile && activePinId === pin.id;

							return (
								<PinListItem
									key={pin.id}
									pin={pin}
									isActive={isActive}
									isMobile={isMobile}
									isMobileActive={isMobileActive}
									prefersReducedMotion={shouldReduceMotion}
									ref={(element) => {
										pinRowRefs.current[pin.id] = element;
									}}
									onHoverStart={setHoveredPinId}
									onHoverEnd={() => {
										setHoveredPinId(null);
									}}
									onMobileToggle={handleMobilePinToggle}
									onDelete={removePin}
								/>
							);
							})}
						</AnimatePresence>
					</motion.ul>
				)}
			</div>
		</aside>
	);
}
