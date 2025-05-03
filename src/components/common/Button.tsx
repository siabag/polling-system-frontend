import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  showLoadingText?: boolean; // Nueva prop para controlar texto de carga
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  showLoadingText = false, // Por defecto no muestra texto
}) => {
  // Mapeo de variantes a clases
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-sm',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm',
  };

  // Mapeo de tamaños a clases (más compactos)
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-2.5',
    md: 'text-sm py-2 px-3.5',
    lg: 'text-base py-2.5 px-4',
  };

  // Clases base mejoradas
  const baseClasses = [
    'font-medium rounded-md transition-all', // transition-all para suavizar todos los cambios
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    'inline-flex items-center justify-center', // Para alinear icono y texto
  ].join(' ');

  return (
    <button
      type={type}
      className={[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <svg 
            className={`animate-spin ${showLoadingText ? 'mr-2' : ''} h-4 w-4`} 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {showLoadingText && 'Cargando...'}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;