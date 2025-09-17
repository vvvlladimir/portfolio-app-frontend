"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type TabItem = {
    value: string
    label: string
    content?: React.ReactNode
}

type AnimatedTabsProps = {
    tabs: TabItem[]
    defaultValue?: string
    className?: string
}

export function AnimatedTabs({ tabs, defaultValue, className }: AnimatedTabsProps) {
    const [value, setValue] = React.useState(defaultValue ?? tabs[0]?.value)
    const listRef = React.useRef<HTMLDivElement>(null)

    const itemRefs = React.useRef(new Map<string, HTMLButtonElement>())
    const setItemRef = (key: string) => (el: HTMLButtonElement | null) => {
        if (!el) itemRefs.current.delete(key)
        else itemRefs.current.set(key, el)
    }

    const [indicator, setIndicator] = React.useState({ left: 0, width: 0 })

    const updateIndicator = React.useCallback(() => {
        const trigger = itemRefs.current.get(value)
        const list = listRef.current
        if (!trigger || !list) return
        const tRect = trigger.getBoundingClientRect()
        const lRect = list.getBoundingClientRect()
        setIndicator({ left: tRect.left - lRect.left, width: tRect.width })
    }, [value])

    React.useEffect(() => {
        updateIndicator()
        const ro = new ResizeObserver(updateIndicator)
        const list = listRef.current
        const trigger = itemRefs.current.get(value)
        if (list) ro.observe(list)
        if (trigger) ro.observe(trigger)
        return () => ro.disconnect()
    }, [value, updateIndicator])

    return (
        <Tabs value={value} onValueChange={setValue} className={className}>
            <div className="relative w-full">
                <TabsList
                    ref={listRef as React.RefObject<HTMLDivElement>}
                    className="relative w-full rounded-full p-1 flex"
                >
                    {tabs.map((t) => (
                        <TabsTrigger
                            key={t.value}
                            ref={setItemRef(t.value)}
                            value={t.value}
                            className="relative z-10 rounded-full px-3 py-1 flex-1"
                        >
                            {t.label}
                        </TabsTrigger>
                    ))}

                    <motion.div
                        className="absolute top-1 bottom-1 rounded-full bg-background"
                        animate={{ left: indicator.left, width: indicator.width }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </TabsList>
            </div>

            {tabs.map((t) => (
                <TabsContent key={t.value} value={t.value} className="mt-4">
                    {t.content}
                </TabsContent>
            ))}
        </Tabs>
    )
}