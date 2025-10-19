import {SidebarTrigger} from "@/shared/components/ui/sidebar";
import {Button} from "@/shared/components/ui/button";
import {Separator} from "@/shared/components/ui/separator";

interface SiteHeaderProps {
    headerTitle?: string;
}

export function SiteHeader({ headerTitle }: SiteHeaderProps) {
    return (
        <header className="flex items-center gap-2 border-b pt-2 pb-2">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">{headerTitle}</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" asChild size="sm" className="hidden sm:flex px-0">
                        <a
                            href="https://github.com/vvvlladimir/portfolio-app-frontend"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="dark:text-foreground"
                        >
                            GitHub
                        </a>
                    </Button>
                </div>
            </div>
        </header>
    )
}
