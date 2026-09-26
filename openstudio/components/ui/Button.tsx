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
    const baseStyles = "inline-flex items-center justify-center gap-2 font-extrabold uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-full backdrop-blur-xs";

    const variants = {
        primary: "bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-lg shadow-black/10 dark:shadow-white/10 hover:shadow-xl hover:scale-[1.02]",
        default: "bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-lg shadow-black/10 dark:shadow-white/10 hover:shadow-xl hover:scale-[1.02]",
        secondary: "bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:scale-[1.02]",
        outline: "bg-transparent text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-600 hover:scale-[1.02]",
        ghost: "bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-full",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20 hover:scale-[1.02]",
        link: "bg-transparent text-blue-600 dark:text-blue-400 underline hover:text-blue-700"
    };

    const sizes = {
        sm: "h-8 px-4 text-[10px]",
        md: "h-11 px-6 text-[11px]",
        default: "h-11 px-6 text-[11px]",
        lg: "h-12 px-8 text-[12px]",
        xl: "h-14 px-10 text-[13px]",
        icon: "size-9 p-0 shrink-0"
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
