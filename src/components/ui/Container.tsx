import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Responsive container with max-width and horizontal padding.
 */
export const Container = React.memo<ContainerProps>(({ children, className = '', as: Tag = 'div' }) => {
  return (
    <Tag className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
});

Container.displayName = 'Container';
