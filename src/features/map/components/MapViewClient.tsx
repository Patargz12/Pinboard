import { useEffect, useRef } from "react";
import { divIcon, point } from "leaflet";
import type { LeafletEvent, Marker as LeafletMarker } from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { reverseGeocode, throttledReverseGeocode } from "@/features/map/services/geocoding";
import { usePinStore } from "@/features/pins/store/usePinStore";
import { formatToDMS } from "@/features/map/utils/formatCoords";
import { pinIcon } from "@/features/map/components/MapMarkerIcon";
import { LocationIcon, useIsMobile } from "@/shared";

const MELBOURNE_CENTER: [number, number] = [-37.8136, 144.9631];
const INITIAL_ZOOM = 16;
const CLUSTER_BADGE_CLASS =
	"flex size-10.5 items-center justify-center rounded-full bg-neutral-900 text-sm leading-none font-bold text-white shadow-[0_8px_16px_rgba(17,17,17,0.28)]";

const createClusterCustomIcon = (cluster: { getChildCount: () => number }) =>
	divIcon({
		html: `<span class="${CLUSTER_BADGE_CLASS}">${cluster.getChildCount()}</span>`,
		className: "pin-cluster-icon",
		iconSize: point(42, 42, true),
	});

function MapClickHandler() {
	const addPin = usePinStore((state) => state.addPin);
	const updatePin = usePinStore((state) => state.updatePin);
	const setActivePinId = usePinStore((state) => state.setActivePinId);
	const isMobile = useIsMobile();

	useMapEvents({
		click: (event) => {
			const { lat, lng } = event.latlng;

			const pinId = crypto.randomUUID();
			const pin = {
				id: pinId,
				lat,
				lng,
				address: "",
				createdAt: new Date().toISOString(),
			};

			addPin(pin);

			if (isMobile) {
				setActivePinId(pinId);
			} else {
				setActivePinId(null);
			}

			void throttledReverseGeocode(lat, lng).then((address) => {
				updatePin(pin.id, { address });
			});
		},
	});

	return null;
}

export default function MapViewClient() {
	const pins = usePinStore((state) => state.pins);
	const updatePin = usePinStore((state) => state.updatePin);
	const hoveredPinId = usePinStore((state) => state.hoveredPinId);
	const activePinId = usePinStore((state) => state.activePinId);
	const setHoveredPinId = usePinStore((state) => state.setHoveredPinId);
	const setActivePinId = usePinStore((state) => state.setActivePinId);
	const isMobile = useIsMobile();
	const markerRefs = useRef<Record<string, LeafletMarker | null>>({});
	const previousFocusedPinId = useRef<string | null>(null);

	useEffect(() => {
		if (!isMobile && activePinId) {
			setActivePinId(null);
		}
	}, [isMobile, activePinId, setActivePinId]);

	useEffect(() => {
		const focusedPinId = isMobile ? hoveredPinId ?? activePinId : hoveredPinId;
		const prevId = previousFocusedPinId.current;

		if (prevId && prevId !== focusedPinId) {
			markerRefs.current[prevId]?.closeTooltip();
		}

		if (focusedPinId) {
			const focusedMarker = markerRefs.current[focusedPinId];
			if (prevId !== focusedPinId || !focusedMarker?.isTooltipOpen()) {
				focusedMarker?.openTooltip();
			}
		}

		previousFocusedPinId.current = focusedPinId;
	}, [hoveredPinId, activePinId, isMobile]);

	const handlePinDragEnd = (id: string) => async (e: LeafletEvent) => {
		const marker = e.target as { getLatLng: () => { lat: number; lng: number } };
		const { lat, lng } = marker.getLatLng();

		updatePin(id, { lat, lng, address: "" });

		const address = await reverseGeocode(lat, lng);
		updatePin(id, { address });
	};

	return (
		<MapContainer center={MELBOURNE_CENTER} zoom={INITIAL_ZOOM} zoomControl={false} className="h-full w-full">
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			<MapClickHandler />
			<MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
				{pins.map((pin) => {
					const formattedCoords = formatToDMS(pin.lat, pin.lng);
					const addressText = pin.address || "Loading address...";

					return (
						<Marker
							key={pin.id}
							position={[pin.lat, pin.lng]}
							icon={pinIcon}
							ref={(marker) => {
								markerRefs.current[pin.id] = marker;
							}}
							draggable
							eventHandlers={{
									mouseover: () => setHoveredPinId(pin.id),
									mouseout: () => setHoveredPinId(null),
									click: () => {
										if (isMobile) {
											setActivePinId(pin.id);
										}
									},
								dragend: handlePinDragEnd(pin.id),
							}}
						>
							<Tooltip direction="right" offset={[20,-20]} opacity={1} className="custom-tooltip">
								<div className="w-50 shrink-0 overflow-hidden rounded-normal bg-primary px-3 py-2.5 text-gray-900">
									<p className="text-base mb-2 truncate font-bold leading-none">{pin.label}</p>
									<div className="tooltip-coords flex min-w-0 items-center gap-1 text-ccordinates text-gray-500" title={formattedCoords}>
										<LocationIcon className="h-3.5 w-3.5 shrink-0 text-gray-400" />
										<span>{formattedCoords}</span>
									</div>
									<p className="tooltip-address text-address text-gray-600" title={addressText}>
										{addressText}
									</p>
								</div>
							</Tooltip>
						</Marker>
					);
				})}
			</MarkerClusterGroup>
		</MapContainer>
	);
}
