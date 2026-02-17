import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { SortingState } from "@tanstack/react-table";
import {
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
	useQueryStates,
} from "nuqs";
import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDebounce } from "@/hooks/use-debounce";
import { useIncidents } from "@/hooks/use-incidents";
import type { Incident, IncidentFilters } from "@/types/incident";

const filterParsers = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	search: parseAsString.withDefault(""),
	service: parseAsString.withDefault(""),
	severity: parseAsArrayOf(parseAsString).withDefault([]),
	status: parseAsArrayOf(parseAsString).withDefault([]),
	sortBy: parseAsString.withDefault("createdAt"),
	sortOrder: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),
};

export const Route = createFileRoute("/incidents/")({
	component: IncidentListPage,
});

function IncidentListPage() {
	const navigate = useNavigate();
	const [filters, setFilters] = useQueryStates(filterParsers, {
		history: "replace",
	});

	const { page, pageSize, search, service, severity, status, sortBy, sortOrder } = filters;

	const debouncedSearch = useDebounce(search, 300);

	const apiFilters: IncidentFilters = {
		page,
		pageSize,
		search: debouncedSearch || undefined,
		service: service || undefined,
		severity: severity.length > 0 ? severity.join(",") : undefined,
		status: status.length > 0 ? status.join(",") : undefined,
		sortBy,
		sortOrder,
	};

	const { data, isLoading, isError, error } = useIncidents(apiFilters);

	const sorting: SortingState = sortBy ? [{ id: sortBy, desc: sortOrder === "desc" }] : [];

	const handleSortingChange = (newSorting: SortingState) => {
		if (newSorting.length > 0) {
			setFilters({
				sortBy: newSorting[0].id,
				sortOrder: newSorting[0].desc ? "desc" : "asc",
				page: 1,
			});
		} else {
			setFilters({ sortBy: null, sortOrder: null, page: 1 });
		}
	};

	const handleRowClick = (incident: Incident) => {
		navigate({
			to: "/incidents/$incidentId",
			params: { incidentId: incident.id },
		});
	};

	const handleResetFilters = () => {
		setFilters(null);
	};

	if (isLoading && !data) {
		return <DataTableSkeleton />;
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<p className="text-lg text-destructive mb-4">Failed to load incidents</p>
				<p className="text-sm text-muted-foreground">{(error as Error).message}</p>
			</div>
		);
	}

	const incidents = data?.incidents ?? [];
	const pagination = data?.pagination ?? {
		page: 1,
		pageSize: 10,
		total: 0,
		totalPages: 0,
	};

	return (
		<div className="space-y-4">
			<DataTableToolbar
				search={search}
				service={service}
				severity={severity}
				status={status}
				onSearchChange={(v) => setFilters({ search: v || null, page: 1 })}
				onServiceChange={(v) => setFilters({ service: v || null, page: 1 })}
				onSeverityChange={(v) => setFilters({ severity: v.length > 0 ? v : null, page: 1 })}
				onStatusChange={(v) => setFilters({ status: v.length > 0 ? v : null, page: 1 })}
				onReset={handleResetFilters}
			/>

			<DataTable
				columns={columns}
				data={incidents}
				pagination={pagination}
				sorting={sorting}
				onSortingChange={handleSortingChange}
				onPageChange={(p) => setFilters({ page: p === 1 ? null : p })}
				onPageSizeChange={(s) => setFilters({ pageSize: s === 10 ? null : s, page: 1 })}
				onRowClick={handleRowClick}
				isLoading={isLoading}
			/>
		</div>
	);
}
