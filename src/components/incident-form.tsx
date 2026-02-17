import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SERVICES, SEVERITIES, STATUSES } from "@/lib/constants";
import { type CreateIncidentFormValues, createIncidentSchema } from "@/schemas/incident";
import type { Incident } from "@/types/incident";

interface IncidentFormProps {
	mode: "create" | "edit";
	defaultValues?: Partial<Incident>;
	onSubmit: (data: CreateIncidentFormValues) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export function IncidentForm({
	mode,
	defaultValues,
	onSubmit,
	onCancel,
	isLoading,
}: IncidentFormProps) {
	const schema = createIncidentSchema;

	const form = useForm<CreateIncidentFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: defaultValues?.title || "",
			service: defaultValues?.service || "",
			severity: defaultValues?.severity || "SEV1",
			status: defaultValues?.status || "OPEN",
			owner: defaultValues?.owner || "",
			summary: defaultValues?.summary || "",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = form;

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="title">Title</Label>
				<Input id="title" placeholder="Issue Title..." {...register("title")} />
				{errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="service">Service</Label>
				<Select id="service" {...register("service")}>
					<option value="">Select Service</option>
					{SERVICES.map((s) => (
						<option key={s} value={s}>
							{s}
						</option>
					))}
				</Select>
				{errors.service && <p className="text-sm text-destructive">{errors.service.message}</p>}
			</div>

			<div className="space-y-2">
				<Label>Severity</Label>
				<div className="flex gap-4">
					{SEVERITIES.map((sev) => (
						<label key={sev} className="flex items-center gap-2 cursor-pointer">
							<input
								type="radio"
								value={sev}
								{...register("severity")}
								className="accent-primary"
							/>
							<span className="text-sm">{sev}</span>
						</label>
					))}
				</div>
				{errors.severity && <p className="text-sm text-destructive">{errors.severity.message}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="status">Status</Label>
				<Select id="status" {...register("status")}>
					<option value="">Select Status</option>
					{STATUSES.map((s) => (
						<option key={s} value={s}>
							{s}
						</option>
					))}
				</Select>
				{errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="owner">Assigned To</Label>
				<Input id="owner" placeholder="Optional" {...register("owner")} />
			</div>

			<div className="space-y-2">
				<Label htmlFor="summary">Summary</Label>
				<Textarea
					id="summary"
					placeholder="Describe the incident..."
					rows={4}
					{...register("summary")}
				/>
			</div>

			<div className="flex gap-3">
				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Saving..." : mode === "create" ? "Create Incident" : "Save Changes"}
				</Button>
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</form>
	);
}
