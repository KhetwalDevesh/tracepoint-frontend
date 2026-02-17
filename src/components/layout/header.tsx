import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
	return (
		<header className="border-b bg-background">
			<div className="container mx-auto flex h-14 items-center justify-between px-4">
				<Link to="/incidents" className="text-lg font-bold">
					Tracepoint
				</Link>
				<Link to="/incidents/create">
					<Button size="sm">
						<Plus className="mr-1 h-4 w-4" />
						New Incident
					</Button>
				</Link>
			</div>
		</header>
	);
}
