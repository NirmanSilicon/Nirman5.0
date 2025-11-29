import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
}

export function GameButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  onClick,
  fullWidth = false,
  className = "",
  ...props
}: GameButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-300 overflow-hidden group cursor-pointer select-none";
  
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#F5C142] via-[#FFD700] to-[#FFA500] 
      text-black 
      button-3d
      hover:from-[#FFD700] hover:via-[#F5C142] hover:to-[#FFD700]
      active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
      border-2 border-[#FFD700]/50
    `,
    secondary: `
      bg-zinc-800 
      text-[#FFD700] 
      border-2 border-[#FFD700]/30
      hover:bg-zinc-700 hover:border-[#FFD700]/60
      active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    `,
    ghost: `
      bg-transparent 
      text-gray-400 
      border-2 border-transparent
      hover:text-[#FFD700] hover:bg-zinc-800/50
      active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed
    `
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${widthClass}
        ${className}
      `}
      style={{ fontWeight: 800 }}
      {...props}
    >
      {/* Shimmer effect on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          />
        ) : (
          <>
            {Icon && iconPosition === "left" && <Icon className="w-5 h-5" />}
            {children}
            {Icon && iconPosition === "right" && <Icon className="w-5 h-5" />}
          </>
        )}
      </span>
    </motion.button>
  );
}
