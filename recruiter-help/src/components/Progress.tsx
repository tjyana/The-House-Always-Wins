import React from "react";

interface ProgressBarProps {
  max?: number;
  min?: number;
  isIndeterminate?: boolean;
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  max = 100,
  min = 0,
  isIndeterminate = true,
  value,
}) => {
  return (
    <div
      aria-valuemax={max}
      aria-valuemin={min}
      role="progressbar"
      data-state={isIndeterminate ? "indeterminate" : "determinate"}
      data-max={max}
      className="relative w-full overflow-hidden rounded-full bg-secondary h-2"
    >
      <div
        data-state={isIndeterminate ? "indeterminate" : "determinate"}
        data-max={max}
        className="h-full w-full flex-1 bg-black transition-all"
        style={{ transform: `translateX(-${value}%)` }}
      />
    </div>
  );
};

export default ProgressBar;
