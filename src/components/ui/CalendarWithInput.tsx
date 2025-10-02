import React from "react";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {format, isValid, parse} from "date-fns";


function parseUserDate(input: string): Date | undefined {
    const s = input.trim();
    if (!s) return undefined;

    const patterns = [
        "dd.MM.yyyy",
        "d.M.yyyy",
        "dd/MM/yyyy",
        "d/M/yyyy",
        "MM/dd/yyyy",
        "M/d/yyyy",
        "yyyy-MM-dd",
    ];

    for (const p of patterns) {
        const d = parse(s, p, new Date());
        if (isValid(d)) return d;
    }

    const digits = s.replace(/\D/g, "");
    if (digits.length === 8) {
        let d = parse(digits, "ddMMyyyy", new Date());
        if (isValid(d)) return d;
        d = parse(digits, "yyyyMMdd", new Date());
        if (isValid(d)) return d;
    }

    const maybe = new Date(s);
    if (isValid(maybe)) return maybe;

    return undefined;
}

function formatDateForInput(date?: Date): string {
    return date ? format(date, "dd.MM.yyyy") : "";
}

type CalendarWithInputProps = {
    value?: Date;
    onChange: (date?: Date) => void;
    placeholder?: string;
    id?: string;
    disabled?: boolean;
    className?: string;
};

export function CalendarWithInput({
                             value,
                             onChange,
                             placeholder = "dd.mm.yyyy",
                             id,
                             disabled,
                             className,
                         }: CalendarWithInputProps) {
    const [text, setText] = React.useState<string>(formatDateForInput(value));
    const [open, setOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        setText(formatDateForInput(value));
    }, [value]);

    const commitParse = React.useCallback(() => {
        const parsed = parseUserDate(text);
        if (parsed) {
            onChange(parsed);
            setText(formatDateForInput(parsed));
        } else {
            onChange(undefined);
        }
    }, [text, onChange]);

    return (
        <div className={cn("relative", className)}>
            <Input
                id={id}
                ref={inputRef}
                value={text}
                disabled={disabled}
                placeholder={placeholder}
                onChange={(e) => setText(e.target.value)}
                onBlur={commitParse}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        commitParse();
                    }
                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setOpen(true);
                    }
                }}
                className=""
            />

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2"
                        aria-label="Toggle Calendar"
                        disabled={disabled}
                    >
                        <CalendarIcon/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={(d) => {
                            onChange(d);
                            setText(formatDateForInput(d));
                            setOpen(false);
                            setTimeout(() => inputRef.current?.focus(), 0);
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

