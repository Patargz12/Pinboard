import L from "leaflet";

const PIN_ICON_SIZE: [number, number] = [46, 62];
const PIN_ICON_ANCHOR: [number, number] = [17, 45];
const PIN_POPUP_ANCHOR: [number, number] = [0, -45];
const MAP_PIN_ICON_URL = "/assets/MapPin.svg";

const createPinIcon = (): L.Icon =>
	L.icon({
		iconUrl: MAP_PIN_ICON_URL,
		iconSize: PIN_ICON_SIZE,
		iconAnchor: PIN_ICON_ANCHOR,
		popupAnchor: PIN_POPUP_ANCHOR,
	});

export const pinIcon = createPinIcon();
export const pinIconActive = createPinIcon();