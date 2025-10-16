import React from 'react';

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const variantClasses = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost: 'btn btn-ghost',
};

export const Button = React.forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    as: Comp = 'button',
    className = '',
    loading = false,
    disabled,
    children,
    ...props
  },
  ref
) {
    const isDisabled = disabled || loading;
    const base = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

    return (
      <Comp
        ref={ref}
        className={base}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        disabled={Comp === 'button' ? isDisabled : undefined}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="sr-only">Loading</span>
            {children}
          </span>
        ) : (
          children
        )}
      </Comp>
    );
});

export default Button;
