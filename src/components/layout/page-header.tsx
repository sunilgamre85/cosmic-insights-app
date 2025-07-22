import { type FC, type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  );
};
