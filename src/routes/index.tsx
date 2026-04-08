import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'

import { AppLayout } from '@/shared'
import { MapView } from '@/features/map'
import { PinList } from '@/features/pins'

const MOBILE_SHEET_HEIGHTS = {
	collapsed: 45,
	expanded: 90,
	default: 45,
	min: 35,
	max: 95,
}

const clamp = (value: number, min: number, max: number): number =>
	Math.min(Math.max(value, min), max)

function HomePage() {
	const mainRef = useRef<HTMLDivElement | null>(null)
	const [mobileSheetHeight, setMobileSheetHeight] = useState(MOBILE_SHEET_HEIGHTS.default)
	const [dragStart, setDragStart] = useState<{ startY: number; startHeight: number; pointerId: number } | null>(null)

	const handleSheetPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.currentTarget.setPointerCapture(event.pointerId)
		setDragStart({
			startY: event.clientY,
			startHeight: mobileSheetHeight,
			pointerId: event.pointerId,
		})
	}

	const handleSheetPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!dragStart || event.pointerId !== dragStart.pointerId) {
			return
		}

		event.preventDefault()

		const containerHeight = mainRef.current?.clientHeight ?? window.innerHeight
		const deltaPx = dragStart.startY - event.clientY
		const deltaPercent = (deltaPx / containerHeight) * 100
		const nextHeight = clamp(
			dragStart.startHeight + deltaPercent,
			MOBILE_SHEET_HEIGHTS.min,
			MOBILE_SHEET_HEIGHTS.max,
		)

		setMobileSheetHeight(nextHeight)
	}

	const handleSheetPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!dragStart || event.pointerId !== dragStart.pointerId) {
			return
		}

		event.currentTarget.releasePointerCapture(event.pointerId)

		const distanceToExpanded = Math.abs(mobileSheetHeight - MOBILE_SHEET_HEIGHTS.expanded)
		const distanceToCollapsed = Math.abs(mobileSheetHeight - MOBILE_SHEET_HEIGHTS.collapsed)
		const snappedHeight = distanceToExpanded < distanceToCollapsed
			? MOBILE_SHEET_HEIGHTS.expanded
			: MOBILE_SHEET_HEIGHTS.collapsed

		setDragStart(null)
		setMobileSheetHeight(snappedHeight)
	}

	return (
		<AppLayout>
			<div ref={mainRef} className="relative h-full w-full overflow-hidden">
				<div className="h-full w-full">
					<MapView />
				</div>

				{/* Mobile portrait: draggable bottom sheet for PinList */}
				<section
					className={`absolute right-0 bottom-0 left-0 z-1000 rounded-t-3xl border-t border-gray-200 bg-primary shadow-xl md:hidden [@media(max-width:767px)_and_(orientation:landscape)]:hidden ${dragStart ? '' : 'transition-[height] duration-200 ease-out'}`}
					style={{ height: `${mobileSheetHeight}%` }}
				>
					<div className="flex h-full min-h-0 flex-col">
						<div
							className="flex cursor-grab touch-none select-none justify-center pt-2 pb-1 active:cursor-grabbing"
							onPointerDown={handleSheetPointerDown}
							onPointerMove={handleSheetPointerMove}
							onPointerUp={handleSheetPointerEnd}
							onPointerCancel={handleSheetPointerEnd}
							style={{ touchAction: 'none' }}
						>
							<div className="h-1.5 w-14 rounded-full bg-gray-300" aria-hidden="true" />
						</div>
						<div className="min-h-0 flex-1 px-2 pb-0">
							<PinList />
						</div>
					</div>
				</section>

				{/* Mobile landscape: fixed left-side panel for PinList */}
				<div className="pointer-events-none absolute inset-0 z-400 hidden [@media(max-width:767px)_and_(orientation:landscape)]:block md:hidden">
					<div className="pointer-events-auto absolute top-8 bottom-0 left-4 w-[44%] max-w-80 min-w-64 overflow-hidden rounded-t-xl border border-gray-200 bg-primary shadow-xl">
						<PinList />
					</div>
				</div>

				<div className="pointer-events-none absolute inset-0 z-400 hidden md:block">
					<div className="pointer-events-auto absolute top-4 bottom-4 left-4 w-90 max-w-[calc(100vw-4rem)] overflow-hidden rounded-xl bg-primary shadow-xl">
						<PinList />
					</div>
				</div>
			</div>
		</AppLayout>
	)
}

export const Route = createFileRoute('/')({ component: HomePage })
