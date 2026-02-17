import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { SEVERITY_COLORS, STATUS_COLORS } from "@/lib/constants";
import type { Incident } from "@/types/incident";

export const columns: ColumnDef<Incident>[] = [
	{
		accessorKey: "title",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
		cell: ({ row }) => (
			<div className="max-w-[300px] truncate font-medium">{row.getValue("title")}</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "service",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Service" />,
		cell: ({ row }) => <div>{row.getValue("service")}</div>,
		enableSorting: true,
	},
	{
		accessorKey: "severity",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Severity" />,
		cell: ({ row }) => {
			const severity = row.getValue("severity") as string;
			return (
				<Badge variant="outline" className={SEVERITY_COLORS[severity]}>
					{severity}
				</Badge>
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return (
				<Badge variant="outline" className={STATUS_COLORS[status]}>
					{status}
				</Badge>
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
		cell: ({ row }) => {
			const date = new Date(row.getValue("createdAt") as string);
			return <div className="whitespace-nowrap">{format(date, "MM/dd/yyyy")}</div>;
		},
		enableSorting: true,
	},
	{
		accessorKey: "owner",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Owner" />,
		cell: ({ row }) => {
			const owner = row.getValue("owner") as string | null;
			return <div className="max-w-[150px] truncate">{owner || "—"}</div>;
		},
		enableSorting: false,
	},
];
