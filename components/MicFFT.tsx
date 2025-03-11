import { cn } from "@/utils";
import { useMemo } from "react";
import { isEmpty } from "remeda";

export type FFT = number[] | undefined;

interface MicFFTProps {
  fft?: FFT;
  className?: string;
  maxHeight?: number;
}

const MAX_HEIGHT = 100;

export default function MicFFT({
  fft,
  className,
  maxHeight = MAX_HEIGHT,
}: MicFFTProps) {
  const path = useMemo(() => {
    if (!fft || isEmpty(fft)) {
      return `M 0,${maxHeight} L 100,${maxHeight}`;
    }

    const values = Array.from(fft.slice(0, 64));

    // Let's create waves by picking 16 values out of the 64 values.
    // This is a bit arbitrary, but it looks better.
    const indices = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60];

    const wave = indices
      .map((i) => values[i] * 100)
      .map((y, i) => {
        const x = (i / (indices.length - 1)) * 100;
        return [x, maxHeight - y * maxHeight];
      });

    return `M 0,${maxHeight} L ${wave
      .map(([x, y]) => `${x},${y}`)
      .join(" L ")} L 100,${maxHeight}`;
  }, [fft, maxHeight]);

  if (!fft) {
    return <></>
  }
  
  return (
    <>
      <svg
        viewBox={`0 0 100 ${maxHeight}`}
        className={cn("absolute size-full opacity-60", className)}
      >
        <g className="values">
          <path d={path} strokeWidth="1" stroke="currentColor" fill="currentColor" opacity="0.5" />
        </g>
      </svg>
    </>
  );
}
