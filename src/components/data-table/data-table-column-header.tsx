import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue> {
	column: Column<TData, TValue>;
	title: string;
	className?: string;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	const sorted = column.getIsSorted();

	return (
		<Button
			variant="ghost"
			size="sm"
			className={cn("-ml-3 h-8 data-[state=open]:bg-accent", className)}
			onClick={() => {
				if (sorted === "asc") {
					column.toggleSorting(true);
				} else if (sorted === "desc") {
					column.clearSorting();
				} else {
					column.toggleSorting(false);
				}
			}}
		>
			<span>{title}</span>
			{sorted === "desc" ? (
				<ArrowDown className="ml-1 h-4 w-4" />
			) : sorted === "asc" ? (
				<ArrowUp className="ml-1 h-4 w-4" />
			) : (
				<ChevronsUpDown className="ml-1 h-4 w-4" />
			)}
		</Button>
	);
}
