import {SidebarTrigger} from "@/shared/components/ui/shadcn/sidebar";
import {Button} from "@/shared/components/ui/shadcn/button";
import {Separator} from "@/shared/components/ui/shadcn/separator";

interface SiteHeaderProps {
    headerTitle?: string
    children?: React.ReactNode
}

export function SiteHeader({ headerTitle, children }: SiteHeaderProps) {
    return (
        <header className="flex items-center gap-2 border-b pt-2 pb-2 px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
            </div>

            <div className="flex items-center w-full justify-between">
                <h1 className="text-base font-medium">{headerTitle}</h1>
                {children}
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
        </header>
    )
}
