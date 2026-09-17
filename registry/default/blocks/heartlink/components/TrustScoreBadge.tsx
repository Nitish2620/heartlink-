import React from "react"
import { motion } from "framer-motion"
import { ShieldCheck, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrustScoreBadgeProps {
  score: number // 0 to 100
  className?: string
  size?: "sm" | "md" | "lg"
}

export function TrustScoreBadge({ score, className, size = "md" }: TrustScoreBadgeProps) {
  // Determine trust level colors
  let colorClass = "text-emerald-500"
  let glowClass = "shadow-[0_0_15px_rgba(16,185,129,0.5)]"
  let strokeColor = "#10b981"
  let label = "High Trust"
  
  if (score < 50) {
    colorClass = "text-rose-500"
    glowClass = "shadow-[0_0_15px_rgba(244,63,94,0.5)]"
    strokeColor = "#f43f5e"
    label = "Low Trust"
  } else if (score < 80) {
    colorClass = "text-amber-500"
    glowClass = "shadow-[0_0_15px_rgba(245,158,11,0.5)]"
    strokeColor = "#f59e0b"
    label = "Verified"
  }

  const dimensions = {
    sm: { circle: 40, stroke: 3, icon: 14, text: "text-[10px]" },
    md: { circle: 64, stroke: 4, icon: 20, text: "text-xs" },
    lg: { circle: 96, stroke: 6, icon: 28, text: "text-sm" }
  }[size]

  const radius = (dimensions.circle - dimensions.stroke) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className={cn("relative inline-flex flex-col items-center gap-1", className)} title={`Trust Score: ${score}%`}>
      <div 
        className={cn("relative flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md", glowClass)}
        style={{ width: dimensions.circle, height: dimensions.circle }}
      >
        <svg className="absolute inset-0 -rotate-90 transform" width={dimensions.circle} height={dimensions.circle}>
          <circle
            cx={dimensions.circle / 2}
            cy={dimensions.circle / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={dimensions.stroke}
            fill="transparent"
            className="text-white/10"
          />
          <motion.circle
            cx={dimensions.circle / 2}
            cy={dimensions.circle / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={dimensions.stroke}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            strokeLinecap="round"
          />
        </svg>
        
        <div className={cn("absolute flex flex-col items-center justify-center", colorClass)}>
          {score >= 50 ? (
            <ShieldCheck size={dimensions.icon} strokeWidth={2.5} />
          ) : (
            <AlertTriangle size={dimensions.icon} strokeWidth={2.5} />
          )}
          {size !== "sm" && (
            <span className="mt-0.5 text-[10px] font-bold leading-none">{score}</span>
          )}
        </div>
      </div>
      
      {size === "lg" && (
        <div className="flex flex-col items-center mt-2">
          <span className={cn("font-semibold tracking-wide", colorClass)}>{label}</span>
          <span className="text-[10px] text-white/50 uppercase tracking-wider">Karma Score</span>
        </div>
      )}
    </div>
  )
}
