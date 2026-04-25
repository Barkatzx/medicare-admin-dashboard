// src/components/ui/Card.tsx
import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
}

export default function Card({ children, className, title, icon }: CardProps) {
  return (
    <div className={clsx("dashboard-card", className)}>
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="text-primary-600">{icon}</div>}
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
