import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, subtitle, children, className = "" }: CardProps) {
  return (
    <div className={`cc-card ${className}`}>
      {(title || subtitle) && (
        <div className="cc-card-header">
          {title && <h3>{title}</h3>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      <div className="cc-card-body">{children}</div>
    </div>
  );
}
