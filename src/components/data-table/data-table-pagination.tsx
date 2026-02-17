import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { PaginationMeta } from "@/types/incident";

interface DataTablePaginationProps {
	pagination: PaginationMeta;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
}

export function DataTablePagination({
	pagination,
	onPageChange,
	onPageSizeChange,
}: DataTablePaginationProps) {
	const { page, pageSize, total, totalPages } = pagination;

	return (
		<div className="flex items-center justify-between px-2 py-4">
			<div className="flex-1 text-sm text-muted-foreground">
				{total} total incident{total !== 1 ? "s" : ""}
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={String(pageSize)}
						onChange={(e) => onPageSizeChange(Number(e.target.value))}
						className="h-8 w-[70px]"
					>
						{[10, 20, 50].map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</Select>
				</div>
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {page} of {totalPages || 1}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={() => onPageChange(1)}
						disabled={page <= 1}
					>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={() => onPageChange(page - 1)}
						disabled={page <= 1}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={() => onPageChange(page + 1)}
						disabled={page >= totalPages}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={() => onPageChange(totalPages)}
						disabled={page >= totalPages}
					>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
