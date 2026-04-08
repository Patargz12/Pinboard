const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/reverse";
const MIN_REQUEST_GAP_MS = 1000;

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
	try {
		const url = `${NOMINATIM_BASE_URL}?format=json&lat=${lat}&lon=${lng}`;
		const response = await fetch(url, {
			headers: {
				"User-Agent": "MapPinboard/1.0",
			},
		});

		if (!response.ok) {
			throw new Error(`Reverse geocoding failed with status ${response.status}`);
		}

		const data: unknown = await response.json();
		if (
			typeof data === "object" &&
			data !== null &&
			"display_name" in data &&
			typeof data.display_name === "string"
		) {
			return data.display_name;
		}

		return "Unknown location";
	} catch {
		return "Unknown location";
	}
};

let requestQueue: Promise<unknown> = Promise.resolve();
let lastRequestTimestamp = 0;

export const throttledReverseGeocode = (lat: number, lng: number): Promise<string> => {
	const queuedTask = requestQueue.then(async () => {
		const elapsed = Date.now() - lastRequestTimestamp;
		const waitTime = Math.max(0, MIN_REQUEST_GAP_MS - elapsed);

		if (waitTime > 0) {
			await new Promise((resolve) => setTimeout(resolve, waitTime));
		}

		lastRequestTimestamp = Date.now();
		return reverseGeocode(lat, lng);
	});

	// Keep the queue alive even if one request rejects.
	requestQueue = queuedTask.then(
		() => undefined,
		() => undefined,
	);

	return queuedTask;
};
