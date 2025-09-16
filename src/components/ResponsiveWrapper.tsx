'use client';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente wrapper para asegurar responsive design consistente
 */
export default function ResponsiveWrapper({ children, className = '' }: ResponsiveWrapperProps) {
  return (
    <div className={`
      w-full 
      px-4 sm:px-6 lg:px-8 
      mx-auto 
      max-w-7xl
      ${className}
    `}>
      {children}
    </div>
  );
}
