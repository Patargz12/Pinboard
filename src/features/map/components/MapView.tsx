import type { ComponentType } from "react";
import { useEffect, useState } from "react";

type ClientMapComponent = ComponentType;

function MapViewFallback() {
	return (
		<div className="flex h-full w-full items-center justify-center bg-gray-100" role="status" aria-live="polite" aria-label="Loading map">
			<div className="flex items-center gap-3 rounded-normal bg-primary/90 px-4 py-3 shadow-[0_10px_24px_rgba(17,17,17,0.12)]">
				<span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" aria-hidden="true" />
				<span className="text-sm font-semibold text-gray-700">Loading map...</span>
			</div>
		</div>
	);
}

export default function MapView() {
	const [mapViewClient, setMapViewClient] = useState<ClientMapComponent | null>(null);

	useEffect(() => {
		let active = true;

		void import("./MapViewClient.tsx").then((mod) => {
			if (active) {
				setMapViewClient(() => mod.default);
			}
		});

		return () => {
			active = false;
		};
	}, []);

	if (!mapViewClient) {
		return <MapViewFallback />;
	}

	const MapViewClient = mapViewClient;

	return <MapViewClient />;
}
