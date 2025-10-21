import {SidebarTrigger} from "@/shared/components/ui/shadcn/sidebar";
import {Button} from "@/shared/components/ui/shadcn/button";
import {Separator} from "@/shared/components/ui/shadcn/separator";

interface SiteHeaderProps {
    headerTitle?: string
    children?: React.ReactNode
}

export function SiteHeader({ headerTitle, children }: SiteHeaderProps) {
    return (
        <header className="flex items-center gap-2 border-b pt-2 pb-2">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">{headerTitle}</h1>

                {children}

                <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" asChild size="sm" className="flex px-0">
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
