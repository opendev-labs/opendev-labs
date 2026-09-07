import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'default' | 'destructive' | 'link';
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'default';
    isLoading?: boolean;
    icon?: React.ReactNode;
    asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    asChild,
    children,
    className = '',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variants = {
        primary: "bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-md",
        default: "bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-md",
        secondary: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700",
        outline: "bg-transparent text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
        ghost: "bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md",
        link: "bg-transparent text-blue-600 dark:text-blue-400 underline hover:text-blue-700"
    };

    const sizes = {
        sm: "h-8 px-4 text-[9px] rounded-none",
        md: "h-11 px-6 text-[10px] rounded-none",
        default: "h-11 px-6 text-[10px] rounded-none",
        lg: "h-12 px-8 text-[11px] rounded-none",
        xl: "h-14 px-10 text-[12px] rounded-none",
        icon: "size-9 p-0 rounded-none shrink-0"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    {children}
                </>
            )}
        </motion.button>
    );
};
