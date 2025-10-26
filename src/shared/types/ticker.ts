import {PositionType} from "@/shared/types/position";

export interface Ticker {
    ticker: string,
    currency: string,
    long_name: string,
    exchange: string,
    asset_type: PositionType
}
