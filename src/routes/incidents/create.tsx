import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { IncidentForm } from "@/components/incident-form";
import { useCreateIncident } from "@/hooks/use-incidents";
import type { CreateIncidentFormValues } from "@/schemas/incident";

export const Route = createFileRoute("/incidents/create")({
	component: CreateIncidentPage,
});

function CreateIncidentPage() {
	const navigate = useNavigate();
	const createIncident = useCreateIncident();

	const handleSubmit = (data: CreateIncidentFormValues) => {
		const payload = {
			...data,
			owner: data.owner || undefined,
			summary: data.summary || undefined,
		};

		createIncident.mutate(payload, {
			onSuccess: () => {
				toast.success("Incident created successfully");
				navigate({ to: "/incidents" });
			},
			onError: (error) => {
				toast.error(`Failed to create incident: ${error.message}`);
			},
		});
	};

	return (
		<div className="max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Create New Incident</h1>
			<IncidentForm
				mode="create"
				onSubmit={handleSubmit}
				onCancel={() => navigate({ to: "/incidents" })}
				isLoading={createIncident.isPending}
			/>
		</div>
	);
}
