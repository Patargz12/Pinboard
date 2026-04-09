import type { ComponentType, ErrorInfo, ReactNode } from "react";
import { Component, useEffect, useState } from "react";

type ClientMapComponent = ComponentType;

type MapRenderErrorBoundaryProps = {
	children: ReactNode;
	onRetry: () => void;
};

type MapRenderErrorBoundaryState = {
	hasError: boolean;
};

class MapRenderErrorBoundary extends Component<MapRenderErrorBoundaryProps, MapRenderErrorBoundaryState> {
	state: MapRenderErrorBoundaryState = {
		hasError: false,
	};

	static getDerivedStateFromError(): MapRenderErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// TODO: Replace with error reporting service (e.g. Sentry) in production
		console.error("Map render failed", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return <MapViewErrorFallback onRetry={this.props.onRetry} />;
		}

		return this.props.children;
	}
}

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

type MapViewErrorFallbackProps = {
	onRetry: () => void;
};

function MapViewErrorFallback({ onRetry }: MapViewErrorFallbackProps) {
	return (
		<div className="flex h-full w-full items-center justify-center bg-gray-100 px-4" role="alert" aria-live="assertive">
			<div className="w-full max-w-md rounded-2xl border border-gray-200 bg-primary p-5 text-center shadow-[0_10px_24px_rgba(17,17,17,0.12)]">
				<p className="text-sm font-semibold text-gray-800">Map failed to load</p>
				<p className="mt-2 text-sm text-gray-600">Something went wrong while loading the map. Try again.</p>
				<button
					type="button"
					onClick={onRetry}
					className="mt-4 inline-flex h-10 items-center justify-center rounded-normal border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
				>
					Retry map
				</button>
			</div>
		</div>
	);
}

export default function MapView() {
	const [mapViewClient, setMapViewClient] = useState<ClientMapComponent | null>(null);
	const [mapLoadError, setMapLoadError] = useState<Error | null>(null);
	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		let active = true;
		setMapLoadError(null);

		void import("./MapViewClient.tsx")
			.then((mod) => {
				if (active) {
					setMapViewClient(() => mod.default);
				}
			})
			.catch((error: unknown) => {
				if (!active) {
					return;
				}

				setMapLoadError(error instanceof Error ? error : new Error("Failed to load map"));
			});

		return () => {
			active = false;
		};
	}, [reloadKey]);

	const retryMapLoad = () => {
		setMapViewClient(null);
		setMapLoadError(null);
		setReloadKey((current) => current + 1);
	};

	if (mapLoadError) {
		return <MapViewErrorFallback onRetry={retryMapLoad} />;
	}

	if (!mapViewClient) {
		return <MapViewFallback />;
	}

	const MapViewClient = mapViewClient;

	return (
		<MapRenderErrorBoundary key={reloadKey} onRetry={retryMapLoad}>
			<MapViewClient />
		</MapRenderErrorBoundary>
	);
}