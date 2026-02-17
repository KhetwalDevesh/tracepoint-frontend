import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";

export const Route = createRootRoute({
	component: RootLayout,
});

function RootLayout() {
	return (
		<div className="min-h-screen bg-background">
			<Header />
			<main className="container mx-auto px-4 py-6">
				<Outlet />
			</main>
			<Toaster position="top-right" richColors />
		</div>
	);
}
