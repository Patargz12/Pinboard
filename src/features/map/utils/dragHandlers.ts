import type { MutableRefObject } from "react";
import type { LeafletEvent } from "leaflet";

const MAP_CLICK_GUARD_DURATION_MS = 250;

type UpdatePinInput = {
	lat?: number;
	lng?: number;
	address?: string;
};

type UpdatePin = (id: string, updates: UpdatePinInput) => void;
type SetHoveredPinId = (id: string | null) => void;
type ReverseGeocode = (lat: number, lng: number) => Promise<string>;

type CreatePinDragStartHandlerOptions = {
	draggingPinIdRef: MutableRefObject<string | null>;
	ignoreMapClicksUntilRef: MutableRefObject<number>;
	setHoveredPinId: SetHoveredPinId;
};

type CreatePinDragEndHandlerOptions = {
	draggingPinIdRef: MutableRefObject<string | null>;
	ignoreMapClicksUntilRef: MutableRefObject<number>;
	geocodeRequestSeqRef: MutableRefObject<Record<string, number>>;
	updatePin: UpdatePin;
	reverseGeocode: ReverseGeocode;
};

type MarkerWithLatLng = {
	getLatLng: () => { lat: number; lng: number };
};

export const createShouldIgnoreMapClick = (ignoreMapClicksUntilRef: MutableRefObject<number>) => () =>
	Date.now() < ignoreMapClicksUntilRef.current;

export const isDraggingAnyPin = (draggingPinIdRef: MutableRefObject<string | null>) =>
	Boolean(draggingPinIdRef.current);

export const createHandlePinDragStart = ({
	draggingPinIdRef,
	ignoreMapClicksUntilRef,
	setHoveredPinId,
}: CreatePinDragStartHandlerOptions) =>
	(id: string) => () => {
		draggingPinIdRef.current = id;
		ignoreMapClicksUntilRef.current = Date.now() + MAP_CLICK_GUARD_DURATION_MS;
		setHoveredPinId(id);
	};

export const createHandlePinDragEnd = ({
	draggingPinIdRef,
	ignoreMapClicksUntilRef,
	geocodeRequestSeqRef,
	updatePin,
	reverseGeocode,
}: CreatePinDragEndHandlerOptions) =>
	(id: string) => async (event: LeafletEvent) => {
		draggingPinIdRef.current = null;
		ignoreMapClicksUntilRef.current = Date.now() + MAP_CLICK_GUARD_DURATION_MS;

		const marker = event.target as MarkerWithLatLng;
		const { lat, lng } = marker.getLatLng();
		const requestSequence = (geocodeRequestSeqRef.current[id] ?? 0) + 1;
		geocodeRequestSeqRef.current[id] = requestSequence;

		updatePin(id, { lat, lng, address: "" });

		const address = await reverseGeocode(lat, lng);
		if (geocodeRequestSeqRef.current[id] !== requestSequence) {
			return;
		}

		updatePin(id, { address });
	};
