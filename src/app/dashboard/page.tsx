"use client"

import React from "react";
import {SiteHeader} from "@/shared/components/widgets/site-header";
import {
  Card, CardAction,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle
} from "@/shared/components/ui/card";
import {API_CONFIG} from "@/config/api";
import {fetcher} from "@/shared/lib/swrFetcher";
import useSWR from "swr";
import {Portfolio} from "@/shared/types/portfolio";
import {formatData} from "@/shared/lib/formatData";
import { ReturnBadge } from "@/shared/components/ui/ReturnBadge";
import { Position } from "@/shared/types/position";
import {usePortfolioChange} from "@/shared/hooks/usePortfolioChange";
import {ProfitBadge} from "@/shared/components/ui/ProfitBadge";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/shared/components/ui/hover-card";

export default function DashboardPage() {
  const { data: portfolio } = useSWR<Portfolio>(
      API_CONFIG.endpoints.portfolio.history(),
      fetcher
  )
  const {totalChangePercent, coveredWeight} = usePortfolioChange()

  const lastValue =
      portfolio?.history && Array.isArray(portfolio.history) && portfolio.history.length > 0
          ? portfolio.history[portfolio.history.length - 1]
          : null

  const todayChange = (lastValue?.total_value ?? 0) * totalChangePercent / 100
  const totalReturn = (lastValue?.total_pnl ?? 0) + todayChange

  return (
      <main>
        <SiteHeader headerTitle="Dashboard"/>

        <div className="grid grid-cols-5 grid-rows-4 gap-4 p-4 items-stretch">
          <div className="col-start-1">
            <Card className="@container/card justify-between">
              <CardHeader className="px-2">
                <CardDescription>Total Portfolio Value</CardDescription>
                <CardTitle className="font-bold font-mono tabular-nums text-2xl">
                  {formatData(
                      lastValue?.total_value + todayChange || 0, portfolio?.currency || "USD"
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
          <div className="col-start-2">
            <Card className="@container/card justify-between">
              <CardHeader className="px-2">
                <CardDescription>Total Return</CardDescription>

                <CardTitle className="font-bold font-mono tabular-nums text-2xl">
                  {formatData(totalReturn, portfolio?.currency ?? "USD")}
                </CardTitle>

                {lastValue && (
                    <CardAction>
                        <ReturnBadge value={lastValue.total_pnl_pct + totalChangePercent} animate={true}/>
                    </CardAction>
                )}
              </CardHeader>
            </Card>
          </div>
          <div className="col-start-3">
            <Card className="@container/card justify-between">
              <CardHeader className="px-2">
                <CardDescription>Today Return</CardDescription>

                <CardTitle className="font-bold font-mono tabular-nums text-2xl">
                  {formatData(todayChange, portfolio?.currency ?? "USD")}
                </CardTitle>

                {lastValue && (
                    <CardAction>
                      <HoverCard>
                        <HoverCardTrigger>
                          <ReturnBadge value={totalChangePercent} animate={true} />
                        </HoverCardTrigger>
                        <HoverCardContent className="text-sm w-48">
                          Covered Weight: {(coveredWeight*100).toFixed(2)}%
                        </HoverCardContent>
                      </HoverCard>

                    </CardAction>
                )}
              </CardHeader>
            </Card>
          </div>
          <div className="col-start-4 ">
            <div className="bg-muted/50 aspect-video rounded-xl"/>
          </div>
          <div className="col-start-5 ">
            <div className="bg-muted/50 aspect-video rounded-xl"/>
          </div>
          <div className="col-span-5 row-span-3 col-start-1 row-start-2 bg-purple-200">
            <div className="bg-muted/50 aspect-video rounded-xl"/>
          </div>
        </div>
      </main>
  )
}
