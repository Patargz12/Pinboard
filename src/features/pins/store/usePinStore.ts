import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CreatePinInput, Pin, PinUpdatesInput } from "@/features/pins/types/pin";
import {
	createPinSchema,
	pinSchema,
	pinUpdatesSchema,
} from "@/features/pins/types/pin";

type PinStore = {
	pins: Pin[];
	pinCounter: number;
	hoveredPinId: string | null;
	addPin: (pin: CreatePinInput) => void;
	removePin: (id: string) => void;
	updatePin: (id: string, updates: PinUpdatesInput) => void;
	setHoveredPinId: (id: string | null) => void;
};

const sanitizePins = (pins: unknown): Pin[] => {
	const parsedPins = pinSchema.array().safeParse(pins);

	if (!parsedPins.success) {
		return [];
	}

	return parsedPins.data;
};

const sanitizePinCounter = (counter: unknown, pinCount: number): number => {
	if (typeof counter !== "number" || !Number.isInteger(counter) || counter < 0) {
		return pinCount;
	}

	return Math.max(counter, pinCount);
};

export const usePinStore = create<PinStore>()(
	persist(
		(set) => ({
			pins: [],
			pinCounter: 0,
			hoveredPinId: null,
			addPin: (pin) =>
				set((state) => {
					const parsedPinInput = createPinSchema.safeParse(pin);

					if (!parsedPinInput.success) {
						return state;
					}

					const nextCounter = state.pinCounter + 1;
					const labeledPinResult = pinSchema.safeParse({
						...parsedPinInput.data,
						label: `Pin #${nextCounter}`,
						address: parsedPinInput.data.address ?? "",
					});

					if (!labeledPinResult.success) {
						return state;
					}

					return {
						pins: [labeledPinResult.data, ...state.pins],
						pinCounter: nextCounter,
					};
				}),
			removePin: (id) =>
				set((state) => ({
					pins: state.pins.filter((pin) => pin.id !== id),
					hoveredPinId: state.hoveredPinId === id ? null : state.hoveredPinId,
				})),
			updatePin: (id, updates) =>
				set((state) => {
					const parsedUpdates = pinUpdatesSchema.safeParse(updates);

					if (!parsedUpdates.success) {
						return state;
					}

					return {
						pins: state.pins.map((pin) => {
							if (pin.id !== id) {
								return pin;
							}

							const mergedPin = pinSchema.safeParse({ ...pin, ...parsedUpdates.data });

							return mergedPin.success ? mergedPin.data : pin;
						}),
					};
				}),
			setHoveredPinId: (id) => set({ hoveredPinId: id }),
		}),
		{
			name: "pin-store",
			storage: createJSONStorage(() => localStorage),
			merge: (persistedState, currentState) => {
				const persisted = (persistedState ?? {}) as Partial<
					Pick<PinStore, "pins" | "pinCounter">
				>;
				const sanitizedPins = sanitizePins(persisted.pins);
				const sanitizedPinCounter = sanitizePinCounter(
					persisted.pinCounter,
					sanitizedPins.length,
				);

				return {
					...currentState,
					pins: sanitizedPins,
					pinCounter: sanitizedPinCounter,
				};
			},
			partialize: (state) => ({
				pins: state.pins,
				pinCounter: state.pinCounter,
			}),
		},
	),
);
