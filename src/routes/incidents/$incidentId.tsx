import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { toast } from "sonner";
import { IncidentForm } from "@/components/incident-form";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useIncident, useUpdateIncident } from "@/hooks/use-incidents";
import { SEVERITY_COLORS, STATUS_COLORS } from "@/lib/constants";
import type { CreateIncidentFormValues } from "@/schemas/incident";

export const Route = createFileRoute("/incidents/$incidentId")({
	component: IncidentDetailPage,
});

function IncidentDetailPage() {
	const { incidentId } = Route.useParams();
	const navigate = useNavigate();
	const { data, isLoading, isError } = useIncident(incidentId);
	const updateIncident = useUpdateIncident();

	if (isLoading) {
		return (
			<div className="max-w-2xl mx-auto space-y-6">
				<Skeleton className="h-8 w-64" />
				<div className="space-y-4">
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-6 w-56" />
				</div>
				<Skeleton className="h-32 w-full" />
			</div>
		);
	}

	if (isError || !data?.incident) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<p className="text-lg text-destructive mb-4">Incident not found</p>
				<button
					type="button"
					className="text-sm text-primary underline cursor-pointer"
					onClick={() => navigate({ to: "/incidents" })}
				>
					Back to incidents
				</button>
			</div>
		);
	}

	const incident = data.incident;

	const handleSubmit = (formData: CreateIncidentFormValues) => {
		const payload: Record<string, unknown> = {};

		if (formData.title !== undefined) payload.title = formData.title;
		if (formData.service !== undefined) payload.service = formData.service;
		if (formData.severity !== undefined) payload.severity = formData.severity;
		if (formData.status !== undefined) payload.status = formData.status;
		payload.owner = formData.owner || null;
		payload.summary = formData.summary || null;

		updateIncident.mutate(
			{ id: incidentId, data: payload },
			{
				onSuccess: () => {
					toast.success("Incident updated successfully");
					navigate({ to: "/incidents" });
				},
				onError: (error) => {
					toast.error(`Failed to update incident: ${error.message}`);
				},
			},
		);
	};

	return (
		<div className="max-w-2xl mx-auto">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-3">{incident.title}</h1>
				<div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
					<div>
						<span className="font-medium text-foreground">Service:</span> {incident.service}
					</div>
					<div className="flex items-center gap-1">
						<span className="font-medium text-foreground">Severity:</span>
						<Badge variant="outline" className={SEVERITY_COLORS[incident.severity]}>
							{incident.severity}
						</Badge>
					</div>
					<div className="flex items-center gap-1">
						<span className="font-medium text-foreground">Status:</span>
						<Badge variant="outline" className={STATUS_COLORS[incident.status]}>
							{incident.status}
						</Badge>
					</div>
					{incident.owner && (
						<div>
							<span className="font-medium text-foreground">Assigned To:</span> {incident.owner}
						</div>
					)}
					<div>
						<span className="font-medium text-foreground">Occurred At:</span>{" "}
						{format(new Date(incident.createdAt), "MMMM d, yyyy")}
					</div>
				</div>
			</div>

			<div className="border-t pt-6">
				<h2 className="text-lg font-semibold mb-4">Edit Incident</h2>
				<IncidentForm
					mode="edit"
					defaultValues={incident}
					onSubmit={handleSubmit}
					onCancel={() => navigate({ to: "/incidents" })}
					isLoading={updateIncident.isPending}
				/>
			</div>
		</div>
	);
}
