import React from'react';
import { motion } from'framer-motion';
import type { AvatarDecoration } from'./types';

export const AvatarDecorationFrame = React.memo(({ decoration, isUnlocked }: { decoration: AvatarDecoration; isUnlocked: boolean }) => {
 if (decoration ==='none'|| !isUnlocked) return null;

 if (decoration ==='sakura') {
 return (
 <div className="absolute -inset-2 rounded-full border border-pink-400/30 z-10 pointer-events-none"aria-hidden="true">
 {Array.from({ length: 4 }).map((_, i) => (
 <motion.div
 key={i}
 animate={{ rotate: 360, y: [0, 5, 0] }}
 transition={{ repeat: Infinity, duration: 4 + i, ease:'linear'}}
 className="absolute text-[10px] text-pink-300 drop-shadow-sm"
 style={{ 
 top:`${(i * 25)}%`, 
 left:`${i % 2 === 0 ? -10 : 100}%`,
 transformOrigin:`${150 - i * 20}% 50%`
 }}
 >
 🌸
 </motion.div>
 ))}
 </div>
 );
 }

 if (decoration ==='autumn_leaves') {
 return (
 <div className="absolute -inset-2 rounded-full border border-orange-400/30 z-10 pointer-events-none"aria-hidden="true">
 {Array.from({ length: 4 }).map((_, i) => (
 <motion.div
 key={i}
 animate={{ rotate: -360, x: [0, -5, 0] }}
 transition={{ repeat: Infinity, duration: 3.5 + i, ease:'linear'}}
 className="absolute text-[10px] text-orange-300 drop-shadow-sm"
 style={{ 
 bottom:`${(i * 25)}%`, 
 right:`${i % 2 === 0 ? -10 : 100}%`,
 transformOrigin:`${-50 + i * 20}% 50%`
 }}
 >
 🍂
 </motion.div>
 ))}
 </div>
 );
 }

 if (decoration ==='snowfall') {
 return (
 <div className="absolute -inset-2 rounded-full border border-cyan-400/30 z-10 pointer-events-none"aria-hidden="true">
 {Array.from({ length: 5 }).map((_, i) => (
 <motion.div
 key={i}
 animate={{ y: [-10, 80], opacity: [0, 1, 0], rotate: 180 }}
 transition={{ repeat: Infinity, duration: 2.5 + i * 0.5, ease:'linear', delay: i * 0.4 }}
 className="absolute text-[8px] text-cyan-100 drop-shadow-sm"
 style={{ left:`${10 + i * 20}%`, top:'-10px'}}
 >
 ❄️
 </motion.div>
 ))}
 </div>
 );
 }

 if (decoration ==='stardust') {
 return (
 <div className="absolute -inset-2 rounded-full border border-amber-400/30 z-10 pointer-events-none"aria-hidden="true">
 {Array.from({ length: 5 }).map((_, i) => (
 <motion.div
 key={i}
 animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: [0, 90] }}
 transition={{ repeat: Infinity, duration: 1.5 + i * 0.3, ease:'easeInOut', delay: i * 0.2 }}
 className="absolute text-[8px] text-amber-200 drop-shadow-sm"
 style={{ 
 top:`${((i * 35) % 90) + 5}%`, 
 left:`${((i * 47) % 90) + 5}%`
 }}
 >
 ✨
 </motion.div>
 ))}
 </div>
 );
 }

 return null;
});
AvatarDecorationFrame.displayName ='AvatarDecorationFrame';
export default AvatarDecorationFrame;
