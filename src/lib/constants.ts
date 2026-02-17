export const SEVERITIES = ["SEV1", "SEV2", "SEV3", "SEV4"] as const;
export const STATUSES = ["OPEN", "MITIGATED", "RESOLVED"] as const;

export const SERVICES = [
	"Auth",
	"Payments",
	"Backend",
	"Frontend",
	"Database",
	"CDN",
	"Search",
	"Messaging",
	"Analytics",
	"Infrastructure",
] as const;

export const SEVERITY_COLORS: Record<string, string> = {
	SEV1: "bg-red-100 text-red-800 border-red-200",
	SEV2: "bg-orange-100 text-orange-800 border-orange-200",
	SEV3: "bg-yellow-100 text-yellow-800 border-yellow-200",
	SEV4: "bg-gray-100 text-gray-800 border-gray-200",
};

export const STATUS_COLORS: Record<string, string> = {
	OPEN: "bg-red-50 text-red-700 border-red-200",
	MITIGATED: "bg-yellow-50 text-yellow-700 border-yellow-200",
	RESOLVED: "bg-green-50 text-green-700 border-green-200",
};

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
