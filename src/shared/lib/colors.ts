import chroma from "chroma-js"


export function getChartColors(length: number) {
    if (length <= 0) return []
    return chroma.scale(chroma.brewer.Paired).mode("lab").colors(length)
}