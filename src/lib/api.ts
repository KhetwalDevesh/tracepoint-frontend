import type {
	CreateIncidentInput,
	Incident,
	IncidentFilters,
	PaginatedResponse,
	UpdateIncidentInput,
} from "@/types/incident";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

class ApiError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE}${url}`, {
		headers: {
			"Content-Type": "application/json",
		},
		...options,
	});

	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Request failed" }));
		throw new ApiError(res.status, body.message || `HTTP ${res.status}`);
	}

	return res.json();
}

export async function fetchIncidents(filters: IncidentFilters): Promise<PaginatedResponse> {
	const params = new URLSearchParams();
	params.set("page", String(filters.page));
	params.set("pageSize", String(filters.pageSize));

	if (filters.search) params.set("search", filters.search);
	if (filters.service) params.set("service", filters.service);
	if (filters.severity) params.set("severity", filters.severity);
	if (filters.status) params.set("status", filters.status);
	if (filters.sortBy) params.set("sortBy", filters.sortBy);
	if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

	return request<PaginatedResponse>(`/incidents?${params.toString()}`);
}

export async function fetchIncident(id: string): Promise<{ incident: Incident }> {
	return request<{ incident: Incident }>(`/incidents/${id}`);
}

export async function createIncident(data: CreateIncidentInput): Promise<{ incident: Incident }> {
	return request<{ incident: Incident }>("/incidents", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateIncident(
	id: string,
	data: UpdateIncidentInput,
): Promise<{ incident: Incident }> {
	return request<{ incident: Incident }>(`/incidents/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}
