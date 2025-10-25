'use client';

import { useEffect, useRef } from 'react';
import {cn} from "@/shared/lib/utils";

interface FitTextSvgProps {
    text: string;
    className?: string;
    textClassName?: string;
    color?: string;
}

export function FitTextSvg({ text, className, textClassName, color = 'currentColor'}: FitTextSvgProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const textRef = useRef<SVGTextElement | null>(null);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const svg = svgRef.current;
        const t = textRef.current;
        if (!svg || !t) return;

        if (frameRef.current) cancelAnimationFrame(frameRef.current);

        frameRef.current = requestAnimationFrame(() => {
            const bbox = t.getBBox();
            svg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
        });

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [text]);

    return (
        <svg
            ref={svgRef}
            className={className}
            width="100%"
            height="1em"
            preserveAspectRatio="xMinYMid meet"
        >
            <text
                ref={textRef}
                textAnchor="start"
                style={{
                    fill: color,
                    transition: 'transform 0.1s ease-out',
                }}
                className={cn(textClassName)}
            >
                {text}
            </text>
        </svg>
    );
}