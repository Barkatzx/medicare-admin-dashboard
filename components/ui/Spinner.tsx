// src/components/ui/Spinner.tsx
import clsx from "clsx";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

export default function Spinner({ size = "md" }: SpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={clsx(
          "border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin",
          sizes[size],
        )}
      />
    </div>
  );
}
