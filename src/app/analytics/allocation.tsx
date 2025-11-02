import {TimeRange} from "@/shared/components/widgets/charts/TimeRangeSelect";
import {StatsPosition} from "@/shared/types/position";

export type AllocationProps = {
    timeRange: TimeRange,
    stats: StatsPosition[]
}

export default function Allocation({timeRange, stats} : AllocationProps) {
    console.log(stats)
    return (
        <div>Allocation Component - Time Range: {timeRange.label}, Number of Stats: {stats.length}</div>
    )
}