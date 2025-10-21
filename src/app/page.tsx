"use client"

import React from "react";
import {SiteHeader} from "@/shared/components/widgets/site-header";
import {
    Card, CardAction,
    CardDescription, CardFooter,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/shadcn/card";
import {API_CONFIG} from "@/config/api";
import {fetcher} from "@/shared/lib/swrFetcher";
import useSWR from "swr";
import {Portfolio} from "@/shared/types/portfolio";
import {formatData} from "@/shared/lib/formatData";
import { ReturnBadge } from "@/shared/components/ui/ReturnBadge";
import {usePortfolioChange} from "@/shared/hooks/usePortfolioChange";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/shared/components/ui/shadcn/hover-card";
import {cn} from "@/shared/lib/utils";
import {useValueHighlight} from "@/shared/hooks/useValueHighlight";
import {CustomChartArea} from "@/shared/components/widgets/charts/custom-chart-area";

export default function DashboardPage() {
    const { data: portfolio } = useSWR<Portfolio>(
        API_CONFIG.endpoints.portfolio.history(),
        fetcher
    )
    const {todayChangePercent, coveredWeight} = usePortfolioChange()

    const lastValue =
        portfolio?.history && Array.isArray(portfolio.history) && portfolio.history.length > 0
            ? portfolio.history[portfolio.history.length - 1]
            : null

    const todayChange = (lastValue?.total_value ?? 0) * todayChangePercent / 100
    const totalReturn = (lastValue?.total_pnl ?? 0) + todayChange
    const highlight = useValueHighlight(todayChange)

    const chartConfig = {
        total_pnl_pct:
            {
                label: "Total Return % ",
                color: "var(--chart-2)"
            },
    }
    const chartData = React.useMemo(() => {
        if (!portfolio?.history?.length) return []
        const livePoint = {
            date: new Date().toISOString(),
            total_pnl_pct: (lastValue?.total_pnl_pct ?? 0) + todayChangePercent,
        }
        return [...portfolio.history, livePoint]
    }, [portfolio?.history, todayChangePercent])

    return (
        <main>
            <SiteHeader headerTitle="Dashboard"/>

            <div className="p-4 space-y-4">
                <div className="grid gap-4
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-5
            items-stretch
            ">
                    <Card className="@container/card p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Today Return</span>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <ReturnBadge value={todayChangePercent}/>
                                </HoverCardTrigger>
                                <HoverCardContent className="text-sm w-48">
                                    Covered Weight: {(coveredWeight * 100).toFixed(2)}%
                                </HoverCardContent>
                            </HoverCard>
                        </div>

                        <div className="flex">
                            <CardTitle
                                className={cn(
                                    "font-bold font-mono tabular-nums leading-tight text-2xl",
                                    "truncate max-w-full", highlight
                                )}
                            >
                                {formatData(todayChange, portfolio?.currency ?? "USD")}
                            </CardTitle>
                        </div>
                    </Card>
                    <Card className="@container/card p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Return</span>
                            <ReturnBadge value={(lastValue?.total_pnl_pct || 0) + todayChangePercent}/>
                        </div>

                        <div className="flex">
                            <CardTitle
                                className={cn(
                                    "font-bold font-mono tabular-nums leading-tight text-2xl",
                                    "truncate max-w-full"
                                )}
                            >
                                {formatData(totalReturn, portfolio?.currency ?? "USD")}
                            </CardTitle>
                        </div>
                    </Card>
                    <Card className="@container/card p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Portfolio Value</span>
                        </div>
                        <div className="flex">
                            <CardTitle
                                className={cn(
                                    "font-bold font-mono tabular-nums leading-tight text-2xl",
                                    "truncate max-w-full"
                                )}
                            >
                                {formatData(
                                    (lastValue?.total_value || 0) + todayChange, portfolio?.currency || "USD"
                                )}
                            </CardTitle>
                        </div>
                    </Card>
                    <Card className="@container/card p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Cash Available</span>
                        </div>
                        <div className="flex">
                            <CardTitle
                                className={cn(
                                    "font-bold font-mono tabular-nums leading-tight text-2xl",
                                    "truncate max-w-full"
                                )}
                            >
                                {formatData(
                                    3000, portfolio?.currency || "USD"
                                )}
                            </CardTitle>
                        </div>
                    </Card>
                    <Card className="@container/card p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Diversification</span>
                        </div>
                        <div className="flex">
                            <CardTitle
                                className={cn(
                                    "font-bold font-mono tabular-nums leading-tight text-2xl",
                                    "truncate max-w-full"
                                )}
                            >
                                Well Balanced
                            </CardTitle>
                        </div>
                    </Card>
                </div>

                {
                    portfolio?.history && (
                        <CustomChartArea
                            chartData={chartData}
                            chartConfig={chartConfig}
                            title="Portfolio Performance"
                            description="Total Return"
                            gradient={true}
                            timeRangeOptions={[
                                {label: "1 Week", days: 7},
                                {label: "1 Month", days: 30},
                                {label: "3 Months", days: 90},
                                {label: "6 Months", days: 180},
                                {label: "1 Year", days: 365},
                                {label: "All", days: "all"},
                            ]}
                        />
                    )
                }

            </div>

        </main>
    )
}
