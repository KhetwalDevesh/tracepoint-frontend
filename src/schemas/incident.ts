import { z } from "zod/v4";

export const createIncidentSchema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
	service: z.string().min(1, "Service is required"),
	severity: z.enum(["SEV1", "SEV2", "SEV3", "SEV4"]),
	status: z.enum(["OPEN", "MITIGATED", "RESOLVED"]),
	owner: z.string().optional().or(z.literal("")),
	summary: z.string().optional().or(z.literal("")),
});

export const updateIncidentSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(200, "Title must be under 200 characters")
		.optional(),
	service: z.string().min(1, "Service is required").optional(),
	severity: z.enum(["SEV1", "SEV2", "SEV3", "SEV4"]).optional(),
	status: z.enum(["OPEN", "MITIGATED", "RESOLVED"]).optional(),
	owner: z.string().optional().or(z.literal("")),
	summary: z.string().optional().or(z.literal("")),
});

export type CreateIncidentFormValues = z.infer<typeof createIncidentSchema>;
export type UpdateIncidentFormValues = z.infer<typeof updateIncidentSchema>;
