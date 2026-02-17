import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createIncident, fetchIncident, fetchIncidents, updateIncident } from "@/lib/api";
import type { CreateIncidentInput, IncidentFilters, UpdateIncidentInput } from "@/types/incident";

export function useIncidents(filters: IncidentFilters) {
	return useQuery({
		queryKey: ["incidents", filters],
		queryFn: () => fetchIncidents(filters),
		placeholderData: (prev) => prev,
	});
}

export function useIncident(id: string) {
	return useQuery({
		queryKey: ["incident", id],
		queryFn: () => fetchIncident(id),
		enabled: !!id,
	});
}

export function useCreateIncident() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateIncidentInput) => createIncident(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["incidents"] });
		},
	});
}

export function useUpdateIncident() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateIncidentInput }) =>
			updateIncident(id, data),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["incidents"] });
			queryClient.invalidateQueries({ queryKey: ["incident", variables.id] });
		},
	});
}
