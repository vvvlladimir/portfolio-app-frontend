"use client"

import React from "react";
import {SiteHeader} from "@/shared/components/widgets/site-header";
import {
  Card, CardAction,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle
} from "@/shared/components/ui/card";
import {Badge} from "@/shared/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react"
import {API_CONFIG} from "@/config/api";
import {fetcher} from "@/shared/lib/swrFetcher";
import useSWR from "swr";
import {Portfolio} from "@/shared/types/portfolio";
import {formatData} from "@/shared/lib/formatData";
import { cn } from "@/shared/lib/utils";
import { ReturnBadge } from "@/shared/components/ui/ReturnBadge";

export default function DashboardPage() {
  const { data: portfolio } = useSWR<Portfolio>(
      API_CONFIG.endpoints.portfolio.history(),
      fetcher
  )

  const lastValue =
      portfolio?.history && Array.isArray(portfolio.history) && portfolio.history.length > 0
          ? portfolio.history[portfolio.history.length - 1]
          : null

  return (
      <main>
        <SiteHeader headerTitle="Dashboard"/>

        <div className="grid grid-cols-5 grid-rows-4 gap-4 p-4 items-stretch">
          <div className="col-start-1">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Portfolio Value</CardDescription>
                <CardTitle className="font-bold font-mono tabular-nums text-2xl">
                  {formatData(
                      lastValue?.total_value || 0, portfolio?.currency || "USD"
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
          <div className="col-start-2">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Return</CardDescription>

                <CardTitle className="font-bold font-mono tabular-nums text-2xl">
                  {formatData(lastValue?.total_pnl ?? 0, portfolio?.currency ?? "USD")}
                </CardTitle>

                {lastValue && (
                    <CardAction>
                      <ReturnBadge value={lastValue.total_pnl_pct} />
                    </CardAction>
                )}
              </CardHeader>
            </Card>
          </div>
          <div className="col-start-3 bg-yellow-200">
            <div className="bg-muted/50 aspect-video rounded-xl"/>
          </div>
          <div className="col-start-4 bg-green-200">
            <div className="bg-muted/50 aspect-video rounded-xl"/>
          </div>
          <div className="col-start-5 bg-blue-200">
            <div className="bg-muted/50 aspect-video rounded-xl"/>
          </div>
          <div className="col-span-5 row-span-3 col-start-1 row-start-2 bg-purple-200">
            <div className="bg-muted/50 aspect-video rounded-xl"/>
          </div>
        </div>
      </main>
  )
}
