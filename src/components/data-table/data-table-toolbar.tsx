import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SERVICES, SEVERITIES, STATUSES } from "@/lib/constants";

interface DataTableToolbarProps {
	search: string;
	service: string;
	severity: string[];
	status: string[];
	onSearchChange: (value: string) => void;
	onServiceChange: (value: string) => void;
	onSeverityChange: (value: string[]) => void;
	onStatusChange: (value: string[]) => void;
	onReset: () => void;
}

export function DataTableToolbar({
	search,
	service,
	severity,
	status,
	onSearchChange,
	onServiceChange,
	onSeverityChange,
	onStatusChange,
	onReset,
}: DataTableToolbarProps) {
	const hasFilters = search || service || severity.length > 0 || status.length > 0;

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search incidents..."
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-8"
					/>
				</div>

				<Select
					value={service}
					onChange={(e) => onServiceChange(e.target.value)}
					className="w-[160px]"
				>
					<option value="">All Services</option>
					{SERVICES.map((s) => (
						<option key={s} value={s}>
							{s}
						</option>
					))}
				</Select>

				<Select
					value={status.length === 1 ? status[0] : ""}
					onChange={(e) => onStatusChange(e.target.value ? [e.target.value] : [])}
					className="w-[160px]"
				>
					<option value="">All Statuses</option>
					{STATUSES.map((s) => (
						<option key={s} value={s}>
							{s}
						</option>
					))}
				</Select>

				{hasFilters && (
					<Button variant="ghost" size="sm" onClick={onReset} className="h-9 px-2 lg:px-3">
						Reset
						<X className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>

			<div className="flex items-center gap-2">
				<span className="text-sm text-muted-foreground">Severity:</span>
				{SEVERITIES.map((sev) => {
					const isActive = severity.includes(sev);
					return (
						<Badge
							key={sev}
							variant={isActive ? "default" : "outline"}
							className="cursor-pointer select-none"
							onClick={() => {
								if (isActive) {
									onSeverityChange(severity.filter((s) => s !== sev));
								} else {
									onSeverityChange([...severity, sev]);
								}
							}}
						>
							{sev}
						</Badge>
					);
				})}
			</div>
		</div>
	);
}
