export type Severity = "SEV1" | "SEV2" | "SEV3" | "SEV4";
export type Status = "OPEN" | "MITIGATED" | "RESOLVED";

export interface Incident {
	id: string;
	title: string;
	service: string;
	severity: Severity;
	status: Status;
	owner: string | null;
	summary: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface PaginationMeta {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
}

export interface PaginatedResponse {
	incidents: Incident[];
	pagination: PaginationMeta;
}

export interface IncidentFilters {
	page: number;
	pageSize: number;
	search?: string;
	service?: string;
	severity?: string;
	status?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface CreateIncidentInput {
	title: string;
	service: string;
	severity: Severity;
	status: Status;
	owner?: string;
	summary?: string;
}

export interface UpdateIncidentInput {
	title?: string;
	service?: string;
	severity?: Severity;
	status?: Status;
	owner?: string | null;
	summary?: string | null;
}
