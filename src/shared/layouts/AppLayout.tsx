import type { ReactNode } from "react";

import { Navbar } from "@/shared/components";

type AppLayoutProps = {
	children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
	return (
		<div className="flex h-dvh flex-col overflow-hidden bg-primary">
			<Navbar />

			<main className="relative min-h-0 flex-1 overflow-hidden">
				{children}
			</main>
		</div>
	);
}
