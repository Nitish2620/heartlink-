import React from'react';
import { Palette, Sparkles, Upload, Lock } from'lucide-react';
import type { AvatarDecoration, BannerEffect, ProfileEffect, ProfileTheme } from'../types';

interface UserProfileTabProps {
 editName: string;
 setEditName: (val: string) => void;
 editHandle: string;
 setEditHandle: (val: string) => void;
 editStatus: string;
 setEditStatus: (val: string) => void;
 editBio: string;
 setEditBio: (val: string) => void;
 editCustomThemeColor: string;
 setEditCustomThemeColor: (val: string) => void;
 setEditTheme: (val: ProfileTheme) => void;
 onAvatarUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
 onBannerUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
 isNitroPro: boolean;
 editDecoration: AvatarDecoration;
 setEditDecoration: (val: AvatarDecoration) => void;
 editProfileEffect: ProfileEffect;
 setEditProfileEffect: (val: ProfileEffect) => void;
 editBannerEffect: BannerEffect;
 setEditBannerEffect: (val: BannerEffect) => void;
 showToast: (msg: string) => void;
 handleEyeDropperPick: () => void;
 handleSaveSettings: () => void;
}

export const UserProfileTab = React.memo(({
 editName, setEditName,
 editHandle, setEditHandle,
 editStatus, setEditStatus,
 editBio, setEditBio,
 editCustomThemeColor, setEditCustomThemeColor, setEditTheme,
 onAvatarUpload, onBannerUpload,
 isNitroPro,
 editDecoration, setEditDecoration,
 editProfileEffect, setEditProfileEffect,
 editBannerEffect, setEditBannerEffect,
 showToast, handleEyeDropperPick, handleSaveSettings
}: UserProfileTabProps) => {

 const DECORATIONS = [
 { id:'none', label:'None', emoji:'🚫'},
 { id:'sakura', label:'Sakura Petals', emoji:'🌸'},
 { id:'autumn_leaves', label:'Autumn Leaves', emoji:'🍂'},
 { id:'snowfall', label:'Snowfall', emoji:'❄️'},
 { id:'stardust', label:'Stardust', emoji:'✨'}
 ];

 const PROFILE_EFFECTS = [
 { id:'none', label:'None', emoji:'🚫'},
 { id:'sakura_breeze', label:'Sakura Breeze', emoji:'🌸'},
 { id:'autumn_breeze', label:'Autumn Breeze', emoji:'🍂'},
 { id:'winter_blizzard', label:'Winter Blizzard', emoji:'❄️'},
 { id:'cosmic_stardust', label:'Cosmic Stardust', emoji:'✨'}
 ];

 const BANNER_EFFECTS = [
 { id:'none', label:'None', emoji:'🚫'},
 { id:'sakura_moonlight', label:'Sakura Moonlight', emoji:'🌸'},
 { id:'autumn_sunset', label:'Autumn Sunset', emoji:'🍂'},
 { id:'winter_night', label:'Winter Night', emoji:'❄️'},
 { id:'starry_galaxy', label:'Starry Galaxy', emoji:'✨'}
 ];

 return (
 <div className="space-y-6 max-w-2xl">
 <div className="border-b border-[var(--color-border)]/80 pb-4">
 <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
 <Palette className="w-5 h-5 text-purple-400"/>
 User Profile Customization
 </h2>
 <p className="text-xs text-[var(--color-text-secondary)] mt-1">Configure custom status, Nitro themes, avatars, and animated shop effects.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label htmlFor="display-name-input"className="block text-xs font-bold text-slate-300 mb-1">Display Name</label>
 <input 
 id="display-name-input"
 type="text"
 value={editName}
 onChange={(e) => setEditName(e.target.value)}
 className="w-full bg-[#F9F9F7] border border-[var(--color-border)]/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/50"
 />
 </div>

 <div>
 <label htmlFor="username-handle-input"className="block text-xs font-bold text-slate-300 mb-1">Username Handle</label>
 <input 
 id="username-handle-input"
 type="text"
 value={editHandle}
 onChange={(e) => setEditHandle(e.target.value)}
 className="w-full bg-[#F9F9F7] border border-[var(--color-border)]/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/50"
 />
 </div>
 </div>

 <div>
 <label htmlFor="custom-status-input"className="block text-xs font-bold text-slate-300 mb-1">Custom Status Message</label>
 <input 
 id="custom-status-input"
 type="text"
 value={editStatus}
 placeholder="e.g. 💻 Building MNC-grade web apps..."
 onChange={(e) => setEditStatus(e.target.value)}
 className="w-full bg-[#F9F9F7] border border-[var(--color-border)]/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/50"
 />
 </div>

 <div>
 <div className="flex items-center justify-between mb-1">
 <label htmlFor="about-me-bio-input"className="block text-xs font-bold text-slate-300">About Me Bio</label>
 <span className={`text-[10px] font-mono ${editBio.length > 190 ?'text-red-400 font-bold':'text-[var(--color-text-secondary)]'}`}>
 {editBio.length}/190
 </span>
 </div>
 <textarea 
 id="about-me-bio-input"
 rows={3}
 value={editBio}
 maxLength={190}
 onChange={(e) => setEditBio(e.target.value)}
 className="w-full bg-[#F9F9F7] border border-[var(--color-border)]/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/50 resize-none"
 />
 </div>

 {/* Nitro Custom HSL/HEX Dropper Theme */}
 <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
 <Sparkles className="w-4 h-4 text-amber-300"/> Nitro Custom HSL/HEX Dropper Theme
 </span>
 <div className="flex items-center gap-2">
 {!isNitroPro && <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1"><Lock className="w-3 h-3"/> Requires Nitro</span>}
 <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
 Million Colors Unlocked
 </span>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <input 
 type="color"
 value={editCustomThemeColor}
 onChange={(e) => {
 if (!isNitroPro) {
 showToast('🔒 Requires Nitro Pro Subscription for Custom Themes');
 return;
 }
 setEditCustomThemeColor(e.target.value);
 setEditTheme('custom_hex');
 }}
 className={`w-10 h-10 rounded-xl bg-transparent border-0 shrink-0 ${!isNitroPro ?'opacity-50 cursor-not-allowed':'cursor-pointer'}`}
 disabled={!isNitroPro}
 />
 <input 
 type="text"
 value={editCustomThemeColor}
 onChange={(e) => {
 if (!isNitroPro) {
 showToast('🔒 Requires Nitro Pro Subscription for Custom Themes');
 return;
 }
 setEditCustomThemeColor(e.target.value);
 setEditTheme('custom_hex');
 }}
 className={`bg-[#F9F9F7] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs font-mono font-bold text-purple-300 w-32 focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/50 ${!isNitroPro ?'opacity-50 cursor-not-allowed':''}`}
 disabled={!isNitroPro}
 />
 <button
 type="button"
 onClick={() => {
 if (!isNitroPro) {
 showToast('🔒 Requires Nitro Pro Subscription for Eye Dropper');
 return;
 }
 handleEyeDropperPick();
 }}
 className={`px-3 py-2 rounded-xl text-slate-800 font-bold text-xs flex items-center gap-1.5 transition ${!isNitroPro ?'bg-purple-900/50 cursor-not-allowed opacity-50':'bg-purple-600 hover:bg-purple-700 cursor-pointer'}`}
 >
 <Palette className="w-3.5 h-3.5"/>
 <span>Pick Screen Color</span>
 </button>
 </div>
 </div>

 {/* Avatar & Banner Uploaders */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="space-y-2">
 <span className="block text-xs font-bold text-slate-300">Avatar Image / GIF</span>
 <label htmlFor="avatar-upload-input"className="border-2 border-dashed border-[var(--color-border)] hover:border-purple-500 rounded-2xl p-4 text-center cursor-pointer transition bg-[#F9F9F7]/60 block focus-within:ring-2 focus-within:ring-purple-500">
 <Upload className="w-5 h-5 text-purple-400 mx-auto mb-1"/>
 <span className="text-xs font-bold text-slate-800 block">Upload Avatar</span>
 <span className="text-[10px] text-[var(--color-text-secondary)]">Triggers 1:1 Circle Cropper</span>
 <input id="avatar-upload-input"type="file"accept="image/*"onChange={onAvatarUpload} className="sr-only"/>
 </label>
 </div>

 <div className="space-y-2">
 <span className="block text-xs font-bold text-slate-300">Cover Banner Image / GIF</span>
 <label htmlFor="banner-upload-input"className="border-2 border-dashed border-[var(--color-border)] hover:border-pink-500 rounded-2xl p-4 text-center cursor-pointer transition bg-[#F9F9F7]/60 block focus-within:ring-2 focus-within:ring-pink-500">
 <Upload className="w-5 h-5 text-pink-400 mx-auto mb-1"/>
 <span className="text-xs font-bold text-slate-800 block">Upload Banner</span>
 <span className="text-[10px] text-[var(--color-text-secondary)]">Triggers 3:1 Widescreen Cropper</span>
 <input id="banner-upload-input"type="file"accept="image/*"onChange={onBannerUpload} className="sr-only"/>
 </label>
 </div>
 </div>

 {/* Shop Avatar Decoration Frames */}
 <div>
 <div className="flex items-center justify-between mb-2">
 <label className="block text-xs font-bold text-slate-300">Shop Avatar Decoration Frame</label>
 {!isNitroPro && <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1"><Lock className="w-3 h-3"/> Requires Nitro</span>}
 </div>
 <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2"role="radiogroup"aria-label="Shop Avatar Decoration Frame Options">
 {DECORATIONS.map((item) => (
 <li key={`dec-${item.id}`}>
 <button
 type="button"
 role="radio"
 aria-checked={editDecoration === item.id}
 aria-label={`Select ${item.label} decoration`}
 onClick={() => {
 if (!isNitroPro && item.id !=='none') {
 showToast('🔒 Requires Nitro Pro Subscription');
 return;
 }
 setEditDecoration(item.id as AvatarDecoration);
 }}
 className={`w-full p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 justify-center cursor-pointer transition focus-visible:ring-2 focus-visible:ring-purple-500 outline-none ${
 editDecoration === item.id 
 ?'border-purple-500 bg-purple-950/60 text-purple-400 font-bold'
 :'border-[var(--color-border)] bg-[#F9F9F7] text-slate-300 hover:border-[var(--color-border)]'
 }`}
 >
 <span aria-hidden="true">{item.emoji}</span>
 <span>{item.label}</span>
 </button>
 </li>
 ))}
 </ul>
 </div>

 {/* Animated Profile Effects Picker */}
 <div>
 <div className="flex items-center justify-between mb-2">
 <label className="block text-xs font-bold text-slate-300">Animated Profile Effect</label>
 {!isNitroPro && <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1"><Lock className="w-3 h-3"/> Requires Nitro</span>}
 </div>
 <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2"role="radiogroup"aria-label="Animated Profile Effect Options">
 {PROFILE_EFFECTS.map((item) => (
 <li key={`peffect-${item.id}`}>
 <button
 type="button"
 role="radio"
 aria-checked={editProfileEffect === item.id}
 aria-label={`Select ${item.label} profile effect`}
 onClick={() => {
 if (!isNitroPro && item.id !=='none') {
 showToast('🔒 Requires Nitro Pro Subscription');
 return;
 }
 setEditProfileEffect(item.id as ProfileEffect);
 }}
 className={`w-full p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 justify-center cursor-pointer transition focus-visible:ring-2 focus-visible:ring-purple-500 outline-none ${
 editProfileEffect === item.id 
 ?'border-purple-500 bg-purple-950/60 text-purple-400 font-bold'
 :'border-[var(--color-border)] bg-[#F9F9F7] text-slate-300 hover:border-[var(--color-border)]'
 }`}
 >
 <span aria-hidden="true">{item.emoji}</span>
 <span>{item.label}</span>
 </button>
 </li>
 ))}
 </ul>
 </div>

 {/* Animated Banner Effects Picker */}
 <div>
 <div className="flex items-center justify-between mb-2">
 <label className="block text-xs font-bold text-slate-300">Animated Banner Theme Effect</label>
 {!isNitroPro && <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1"><Lock className="w-3 h-3"/> Requires Nitro</span>}
 </div>
 <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2"role="radiogroup"aria-label="Animated Banner Theme Effect Options">
 {BANNER_EFFECTS.map((item) => (
 <li key={`beffect-${item.id}`}>
 <button
 type="button"
 role="radio"
 aria-checked={editBannerEffect === item.id}
 aria-label={`Select ${item.label} banner effect`}
 onClick={() => {
 if (!isNitroPro && item.id !=='none') {
 showToast('🔒 Requires Nitro Pro Subscription');
 return;
 }
 setEditBannerEffect(item.id as BannerEffect);
 }}
 className={`w-full p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 justify-center cursor-pointer transition focus-visible:ring-2 focus-visible:ring-purple-500 outline-none ${
 editBannerEffect === item.id 
 ?'border-purple-500 bg-purple-950/60 text-purple-400 font-bold'
 :'border-[var(--color-border)] bg-[#F9F9F7] text-slate-300 hover:border-[var(--color-border)]'
 }`}
 >
 <span aria-hidden="true">{item.emoji}</span>
 <span>{item.label}</span>
 </button>
 </li>
 ))}
 </ul>
 </div>

 {/* Floating Save Action Bar */}
 <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3 sticky bottom-0 bg-[#F9F9F7]/90 py-3 backdrop-blur-md z-20">
 <button
 type="button"
 onClick={handleSaveSettings}
 className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-slate-800 font-bold text-xs transition shadow-lg shadow-purple-600/30 cursor-pointer flex items-center gap-2"
 >
 <Sparkles className="w-4 h-4 text-amber-300"/>
 <span>Save Changes (IndexedDB)</span>
 </button>
 </div>
 </div>
 );
});

UserProfileTab.displayName ='UserProfileTab';
export default UserProfileTab;
