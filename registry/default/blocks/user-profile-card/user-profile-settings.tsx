import React, { useState, useCallback, Suspense, useEffect } from'react';
import * as Dialog from'@radix-ui/react-dialog';
import { 
 X, Palette, ShieldAlert, Crown, Music, Globe, Layers, Settings
} from'lucide-react';
import type { 
 UserProfileData, SubscriptionTier, AvatarDecoration, BannerEffect, ProfileEffect, ProfileTheme 
} from'./types';

// Lazy loaded tabs
const UserProfileTab = React.lazy(() => import('./feature-manager-tabs/user-profile-tab'));
const ServerProfileTab = React.lazy(() => import('./feature-manager-tabs/server-profile-tab'));
const NitroSubscriptionTab = React.lazy(() => import('./feature-manager-tabs/nitro-subscription-tab'));
const SoundHapticsTab = React.lazy(() => import('./feature-manager-tabs/sound-haptics-tab'));
const ConnectionsTab = React.lazy(() => import('./feature-manager-tabs/connections-tab'));
const AppearanceTab = React.lazy(() => import('./feature-manager-tabs/appearance-tab'));

export interface UserProfileSettingsDashboardProps {
 profile: UserProfileData;
 onSaveProfile: (updatedProfile: UserProfileData) => void;
 subscriptionTier?: SubscriptionTier;
 onSelectSubscription?: (tier: SubscriptionTier) => void;
 onAvatarUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
 onBannerUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
 showToast?: (msg: string) => void;
 playHapticSound?: (freq?: number) => void;
 isModal?: boolean;
 isOpen?: boolean;
 onClose?: () => void;
 className?: string;
}

const TABS_CONFIG = [
 { id:'user_profile', label:'User Profile', icon: Palette, color:'text-purple-400'},
 { id:'server_profile', label:'Server Profiles', icon: ShieldAlert, color:'text-purple-400'},
 { id:'nitro_subscription', label:'Nitro Subscription', icon: Crown, color:'text-amber-400'},
 { id:'sound_haptics', label:'Sound & Haptics', icon: Music, color:'text-pink-400'},
 { id:'connections', label:'Connections & Badges', icon: Globe, color:'text-cyan-400'},
 { id:'appearance', label:'Appearance & Motion', icon: Layers, color:'text-amber-400'}
];

export const UserProfileSettingsDashboard = React.memo(({
 profile,
 onSaveProfile,
 subscriptionTier = profile.subscriptionTier ||'nitro_pro',
 onSelectSubscription,
 onAvatarUpload,
 onBannerUpload,
 showToast = (msg: string) => console.log(msg),
 playHapticSound = () => {},
 isModal = false,
 isOpen = true,
 onClose = () => {},
 className =''
}: UserProfileSettingsDashboardProps) => {
 const [settingsTab, setSettingsTab] = useState<'user_profile'|'server_profile'|'nitro_subscription'|'appearance'|'sound_haptics'|'connections'>('user_profile');
 
 // Local form state
 const [editName, setEditName] = useState(profile.name);
 const [editHandle, setEditHandle] = useState(profile.handle);
 const [editBio, setEditBio] = useState(profile.bio);
 const [editStatus, setEditStatus] = useState(profile.customStatus ||'');
 const [editTheme, setEditTheme] = useState<ProfileTheme>(profile.profileTheme ||'blurple');
 const [editCustomThemeColor, setEditCustomThemeColor] = useState(profile.customThemeColor ||'#a855f7');
 const [editDecoration, setEditDecoration] = useState<AvatarDecoration>(profile.avatarDecoration ||'none');
 const [editBannerEffect, setEditBannerEffect] = useState<BannerEffect>(profile.bannerEffect ||'none');
 const [editProfileEffect, setEditProfileEffect] = useState<ProfileEffect>(profile.profileEffect ||'none');
 const [editServerNickname, setEditServerNickname] = useState(profile.serverNickname || profile.name);
 const [soundEnabled, setSoundEnabled] = useState(true);

 const isNitroPro = subscriptionTier ==='nitro_pro';

 const isDirty = (
 editName !== profile.name ||
 editHandle !== profile.handle ||
 editBio !== profile.bio ||
 editStatus !== (profile.customStatus ||'') ||
 editTheme !== (profile.profileTheme ||'blurple') ||
 editCustomThemeColor !== (profile.customThemeColor ||'#a855f7') ||
 editDecoration !== (profile.avatarDecoration ||'none') ||
 editBannerEffect !== (profile.bannerEffect ||'none') ||
 editProfileEffect !== (profile.profileEffect ||'none') ||
 editServerNickname !== (profile.serverNickname || profile.name)
 );

 const handleReset = useCallback(() => {
 setEditName(profile.name);
 setEditHandle(profile.handle);
 setEditBio(profile.bio);
 setEditStatus(profile.customStatus ||'');
 setEditTheme(profile.profileTheme ||'blurple');
 setEditCustomThemeColor(profile.customThemeColor ||'#a855f7');
 setEditDecoration(profile.avatarDecoration ||'none');
 setEditBannerEffect(profile.bannerEffect ||'none');
 setEditProfileEffect(profile.profileEffect ||'none');
 setEditServerNickname(profile.serverNickname || profile.name);
 showToast('Reset changes to original profile');
 }, [profile, showToast]);


 const handleSaveSettings = useCallback(() => {
 playHapticSound(800);
 onSaveProfile({
 ...profile,
 name: editName,
 handle: editHandle,
 bio: editBio,
 customStatus: editStatus,
 profileTheme: editTheme,
 customThemeColor: editCustomThemeColor,
 avatarDecoration: isNitroPro ? editDecoration :'none',
 bannerEffect: isNitroPro ? editBannerEffect :'none',
 profileEffect: isNitroPro ? editProfileEffect :'none',
 serverNickname: editServerNickname
 });
 showToast('✨ Settings saved successfully to IndexedDB!');
 if (isModal && onClose) {
 onClose();
 }
 }, [
 profile, editName, editHandle, editBio, editStatus, editTheme, editCustomThemeColor,
 editDecoration, editBannerEffect, editProfileEffect, editServerNickname, isNitroPro,
 onSaveProfile, showToast, playHapticSound, isModal, onClose
 ]);

 const handleEyeDropperPick = useCallback(async () => {
 playHapticSound(700);
 if (typeof window !=='undefined'&&'EyeDropper'in window) {
 try {
 const eyeDropper = new (window as any).EyeDropper();
 const result = await eyeDropper.open();
 if (result?.sRGBHex) {
 setEditCustomThemeColor(result.sRGBHex);
 setEditTheme('custom_hex');
 showToast(`🎨 Sampled Color: ${result.sRGBHex}`);
 }
 } catch {
 showToast('Color dropper cancelled');
 }
 } else {
 showToast('Native EyeDropper API is available on modern Chromium browsers!');
 }
 }, [playHapticSound, showToast]);

 // MNC-Grade: Global Keyboard Shortcuts (Ctrl+S to save)
 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if ((e.ctrlKey || e.metaKey) && e.key ==='s') {
 if (isDirty) {
 e.preventDefault();
 handleSaveSettings();
 }
 }
 };
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, [isDirty, handleSaveSettings]);

 // MNC-Grade: Keyboard Navigation for Custom Tablist
 const handleTabKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
 let nextIndex = currentIndex;
 if (e.key ==='ArrowDown'|| e.key ==='ArrowRight') {
 e.preventDefault();
 nextIndex = (currentIndex + 1) % TABS_CONFIG.length;
 } else if (e.key ==='ArrowUp'|| e.key ==='ArrowLeft') {
 e.preventDefault();
 nextIndex = (currentIndex - 1 + TABS_CONFIG.length) % TABS_CONFIG.length;
 } else if (e.key ==='Home') {
 e.preventDefault();
 nextIndex = 0;
 } else if (e.key ==='End') {
 e.preventDefault();
 nextIndex = TABS_CONFIG.length - 1;
 }

 if (nextIndex !== currentIndex) {
 const nextTab = TABS_CONFIG[nextIndex];
 setSettingsTab(nextTab.id as any);
 playHapticSound(500);
 // Automatically focus the new tab for screen readers
 const tabElement = document.getElementById(`tab-${nextTab.id}`);
 tabElement?.focus();
 }
 }, [playHapticSound]);

 const renderActiveTab = useCallback(() => {
 switch (settingsTab) {
 case'user_profile':
 return (
 <UserProfileTab
 editName={editName} setEditName={setEditName}
 editHandle={editHandle} setEditHandle={setEditHandle}
 editStatus={editStatus} setEditStatus={setEditStatus}
 editBio={editBio} setEditBio={setEditBio}
 editCustomThemeColor={editCustomThemeColor} setEditCustomThemeColor={setEditCustomThemeColor} setEditTheme={setEditTheme}
 onAvatarUpload={onAvatarUpload} onBannerUpload={onBannerUpload}
 isNitroPro={isNitroPro}
 editDecoration={editDecoration} setEditDecoration={setEditDecoration}
 editProfileEffect={editProfileEffect} setEditProfileEffect={setEditProfileEffect}
 editBannerEffect={editBannerEffect} setEditBannerEffect={setEditBannerEffect}
 showToast={showToast} handleEyeDropperPick={handleEyeDropperPick} handleSaveSettings={handleSaveSettings}
 />
 );
 case'server_profile':
 return (
 <ServerProfileTab
 editServerNickname={editServerNickname} setEditServerNickname={setEditServerNickname}
 onAvatarUpload={onAvatarUpload} onBannerUpload={onBannerUpload}
 profile={profile}
 />
 );
 case'nitro_subscription':
 return (
 <NitroSubscriptionTab
 onSelectSubscription={onSelectSubscription}
 showToast={showToast}
 />
 );
 case'sound_haptics':
 return <SoundHapticsTab soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />;
 case'connections':
 return <ConnectionsTab />;
 case'appearance':
 return <AppearanceTab />;
 default:
 return null;
 }
 }, [
 settingsTab, editName, editHandle, editStatus, editBio, editCustomThemeColor, onAvatarUpload, onBannerUpload,
 isNitroPro, editDecoration, editProfileEffect, editBannerEffect, showToast, handleEyeDropperPick, handleSaveSettings,
 editServerNickname, profile, onSelectSubscription, soundEnabled
 ]);

 const renderContent = (
 <div className={`bg-[#F9F9F7] text-slate-800 flex flex-col md:flex-row min-h-[640px] w-full rounded-3xl border border-[var(--color-border)]/80 overflow-hidden shadow-2xl ${className}`}>
 
 {/* LEFT SIDEBAR NAVIGATION */}
 <div className="w-full md:w-64 bg-[#F9F9F7]/90 border-b md:border-b-0 md:border-r border-[var(--color-border)]/80 p-5 space-y-6 shrink-0 flex flex-col justify-between select-none">
 <div className="space-y-6">
 <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 font-bold text-xs">
 <Settings className="w-4 h-4"/>
 <span>Feature Management</span>
 </div>

 <div>
 <div className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 px-3"id="settings-tablist-label">
 User Settings
 </div>
 <div className="space-y-1"role="tablist"aria-labelledby="settings-tablist-label"aria-orientation="vertical">
 {TABS_CONFIG.map((tab, idx) => {
 const IconComponent = tab.icon;
 const active = settingsTab === tab.id;
 return (
 <button
 key={tab.id}
 type="button"
 role="tab"
 aria-selected={active}
 aria-controls={`panel-${tab.id}`}
 id={`tab-${tab.id}`}
 tabIndex={active ? 0 : -1}
 onKeyDown={(e) => handleTabKeyDown(e, idx)}
 onClick={() => {
 playHapticSound(500);
 setSettingsTab(tab.id as any);
 }}
 className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
 active
 ?'bg-purple-600 text-slate-800 shadow-md shadow-purple-600/30'
 :'text-[var(--color-text-secondary)] hover:text-slate-800 hover:bg-[var(--color-surface)]/60'
 }`}
 >
 <IconComponent className={`w-4 h-4 ${active ?'text-slate-800': tab.color}`} />
 <span>{tab.label}</span>
 </button>
 );
 })}
 </div>
 </div>
 </div>

 {/* Action button in sidebar */}
 <div className="pt-4 border-t border-[var(--color-border)]/80 space-y-2">
 {isModal && (
 <button
 type="button"
 onClick={onClose}
 className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
 >
 <X className="w-3.5 h-3.5"/>
 <span>Close Manager (ESC)</span>
 </button>
 )}
 </div>
 </div>

 {/* MAIN SETTINGS FORM PANEL */}
 <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 relative">
 <Suspense fallback={
 <div className="flex items-center justify-center h-full w-full">
 <div className="flex flex-col items-center gap-3">
 <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
 <span className="text-xs text-[var(--color-text-secondary)] font-bold tracking-widest uppercase">Loading Core Module...</span>
 </div>
 </div>
 }>
 <div id={`panel-${settingsTab}`} role="tabpanel"aria-labelledby={`tab-${settingsTab}`} className="h-full">
 {renderActiveTab()}
 </div>
 </Suspense>

 {/* Discord Floating Unsaved Changes Bar */}
 {isDirty && (
 <div role="alert"aria-live="assertive"className="sticky bottom-0 z-30 mt-6 bg-[#F9F9F7]/95 border border-[var(--color-border)] backdrop-blur-md rounded-2xl p-4 flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom-5">
 <span className="text-xs font-bold text-slate-200">Careful — you have unsaved changes!</span>
 <div className="flex items-center gap-3">
 <button 
 type="button"
 onClick={handleReset} 
 className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--color-text-secondary)] hover:text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
 >
 Reset
 </button>
 <button 
 type="button"
 onClick={handleSaveSettings} 
 className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-800 text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
 >
 Save Changes
 </button>
 </div>
 </div>
 )}
 </div>

 </div>
 );

 if (isModal) {
 return (
 <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
 <Dialog.Portal>
 <Dialog.Overlay className="fixed inset-0 bg-[#F9F9F7]/95 backdrop-blur-2xl z-50 animate-in fade-in"/>
 <Dialog.Content className="fixed inset-0 z-50 bg-[#F9F9F7] text-slate-800 flex items-center justify-center p-4 md:p-8 animate-in zoom-in-95">
 {renderContent}
 </Dialog.Content>
 </Dialog.Portal>
 </Dialog.Root>
 );
 }

 return renderContent;
});

UserProfileSettingsDashboard.displayName ='UserProfileSettingsDashboard';
export const UserProfileFeatureManager = UserProfileSettingsDashboard;
