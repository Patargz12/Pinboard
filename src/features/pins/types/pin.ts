import { z } from "zod";

export const pinSchema = z.object({
	id: z.string().uuid(),
	label: z.string().min(1),
	lat: z.number(),
	lng: z.number(),
	address: z.string().optional().default(""),
	createdAt: z.string().datetime(),
});

export const createPinSchema = pinSchema
	.omit({ label: true, address: true })
	.extend({
		label: z.string().min(1).optional(),
		address: z.string().optional(),
	});

export const pinUpdatesSchema = pinSchema
	.partial()
	.omit({ id: true, createdAt: true });

export type Pin = z.infer<typeof pinSchema>;
export type PinInput = z.input<typeof pinSchema>;
export type CreatePinInput = z.input<typeof createPinSchema>;
export type PinUpdatesInput = z.input<typeof pinUpdatesSchema>;
