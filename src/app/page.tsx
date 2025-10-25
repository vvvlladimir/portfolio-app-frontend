"use client"

import React from "react";
import {SiteHeader} from "@/shared/components/widgets/site-header";
import {API_CONFIG} from "@/config/api";
import {fetcher} from "@/shared/lib/swrFetcher";
import useSWR from "swr";
import {Portfolio} from "@/shared/types/portfolio";
import {formatData} from "@/shared/lib/formatData";
import { ReturnBadge } from "@/shared/components/ui/ReturnBadge";
import {usePortfolioChange} from "@/shared/hooks/usePortfolioChange";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/shared/components/ui/shadcn/hover-card";
import {useValueHighlight} from "@/shared/hooks/useValueHighlight";
import {CustomChartArea} from "@/shared/components/widgets/charts/custom-chart-area";
import {StatCard} from "@/shared/components/ui/StatCard";
import {Position} from "@/shared/types/position";

export default function DashboardPage() {
    const { data: portfolio } = useSWR<Portfolio>(
        API_CONFIG.endpoints.portfolio.history(),
        fetcher
    )
    const currency = portfolio?.currency ?? "USD";

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
    }, [lastValue?.total_pnl_pct, portfolio?.history, todayChangePercent])

    return (
        <main>
            <SiteHeader headerTitle="Dashboard"/>

            <div className="p-4 space-y-4">
                <div
                    className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-stretch"
                >
                    <StatCard
                        label="Today Return"
                        tooltip={
                            <HoverCard>
                                <HoverCardTrigger>
                                    <ReturnBadge value={todayChangePercent} />
                                </HoverCardTrigger>
                                <HoverCardContent className="text-sm w-48">
                                    Covered Weight: {(coveredWeight * 100).toFixed(2)}%
                                </HoverCardContent>
                            </HoverCard>
                        }
                        value={formatData(todayChange, currency)}
                        titleClassName={highlight}
                    />

                    <StatCard
                        label="Total Return"
                        tooltip={<ReturnBadge value={(lastValue?.total_pnl_pct || 0) + todayChangePercent} />}
                        value={formatData(totalReturn, currency)}
                    />

                    <StatCard
                        label="Total Portfolio Value"
                        value={formatData((lastValue?.total_value || 0) + todayChange, currency)}
                    />

                    <StatCard
                        label="Cash Available"
                        value={formatData(3000, currency)}
                    />

                    <StatCard
                        label="Diversification"
                        value="Well Balanced"
                    />
                </div>

                {
                    portfolio?.history && (
                        <CustomChartArea
                            chartData={chartData}
                            chartConfig={chartConfig}
                            title="Portfolio Performance"
                            description="Total Return"
                            gradient={true}
                            timeSelector={true}
                        />
                    )
                }

            </div>

        </main>
    )
}
