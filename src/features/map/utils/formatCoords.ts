const toDmsParts = (value: number) => {
	const absolute = Math.abs(value);
	let degrees = Math.floor(absolute);
	let minutes = Math.floor((absolute - degrees) * 60);
	let seconds = Number((((absolute - degrees) * 60 - minutes) * 60).toFixed(1));

	// Normalize edge cases where rounding produces 60.0 seconds or 60 minutes.
	if (seconds >= 60) {
		seconds = 0;
		minutes += 1;
	}

	if (minutes >= 60) {
		minutes = 0;
		degrees += 1;
	}

	return { degrees, minutes, seconds };
};

export const formatToDMS = (lat: number, lng: number): string => {
	const latDir = lat < 0 ? "S" : "N";
	const lngDir = lng < 0 ? "W" : "E";

	const latDms = toDmsParts(lat);
	const lngDms = toDmsParts(lng);

	return `${latDms.degrees}°${latDms.minutes}'${latDms.seconds.toFixed(1)}"${latDir} ${lngDms.degrees}°${lngDms.minutes}'${lngDms.seconds.toFixed(1)}"${lngDir}`;
};
