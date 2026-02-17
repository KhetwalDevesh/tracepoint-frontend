import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
	columnCount?: number;
	rowCount?: number;
}

export function DataTableSkeleton({ columnCount = 6, rowCount = 10 }: DataTableSkeletonProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<Skeleton className="h-9 w-[250px]" />
				<Skeleton className="h-9 w-[150px]" />
				<Skeleton className="h-9 w-[150px]" />
			</div>
			<div className="flex items-center gap-2">
				<Skeleton className="h-6 w-16" />
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={`sev-skel-${i}`} className="h-6 w-12" />
				))}
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							{Array.from({ length: columnCount }).map((_, i) => (
								<TableHead key={`head-skel-${i}`}>
									<Skeleton className="h-4 w-20" />
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: rowCount }).map((_, i) => (
							<TableRow key={`row-skel-${i}`}>
								{Array.from({ length: columnCount }).map((_, j) => (
									<TableCell key={`cell-skel-${i}-${j}`}>
										<Skeleton className="h-4 w-full" />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between">
				<Skeleton className="h-5 w-[100px]" />
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-[70px]" />
					<Skeleton className="h-8 w-[100px]" />
					<Skeleton className="h-8 w-8" />
					<Skeleton className="h-8 w-8" />
				</div>
			</div>
		</div>
	);
}
