import { Suspense, lazy, useState, useEffect, useRef, Component } from'react';
import type { ReactNode } from'react';
import type { UserProfileData, SubscriptionTier } from'../registry/default/blocks/user-profile-card/types';
import { useProfileSync } from'./hooks/useProfileSync';
const UserProfileModal = lazy(() => import('../registry/default/blocks/user-profile-card/user-profile-modal').then(m => ({ default: m.UserProfileModal })));
const UserProfileFeatureManager = lazy(() => import('../registry/default/blocks/user-profile-card/user-profile-settings').then(m => ({ default: m.UserProfileFeatureManager })));
const UserProfilePopout = lazy(() => import('../registry/default/blocks/user-profile-card/user-profile-popout').then(m => ({ default: m.UserProfilePopout })));
const ServerProfileCard = lazy(() => import('../registry/default/blocks/user-profile-card/server-profile-card').then(m => ({ default: m.ServerProfileCard })));
const VoiceCallMemberCard = lazy(() => import('../registry/default/blocks/user-profile-card/voice-call-member-card').then(m => ({ default: m.VoiceCallMemberCard })));
const NitroSubscriptionPricing = lazy(() => import('../registry/default/blocks/nitro-subscription-pricing/nitro-subscription-pricing'));
const SocialPostCard = lazy(() => import('../registry/default/blocks/social-post-card/social-post-card').then(m => ({ default: m.SocialPostCard })));
const HeartLinkApp = lazy(() => import('../registry/default/blocks/heartlink/heartlink-app').then(m => ({ default: m.HeartLinkApp })));
const PricingTable = lazy(() => import('../registry/default/blocks/pricing-table/pricing-table').then(m => ({ default: m.PricingTable })));
const DiscordSidebarNav = lazy(() => import('../registry/default/blocks/discord-sidebar-nav/discord-sidebar-nav').then(m => ({ default: m.DiscordSidebarNav })));
const SpatialCarousel = lazy(() => import('../registry/default/blocks/spatial-carousel/spatial-carousel').then(m => ({ default: m.SpatialCarousel })));
import { Code2, Sparkles, Layers, CheckCircle2, Eye, Server, Sun, Moon, Zap, Check, Search, Copy, Terminal, ExternalLink, Grid, Menu } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

// Error Boundary to prevent white-screen-of-death on runtime crashes
class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean; error: Error | null }> {
 constructor(props: { children: ReactNode; fallback?: ReactNode }) {
 super(props);
 this.state = { hasError: false, error: null };
 }
 static getDerivedStateFromError(error: Error) {
 return { hasError: true, error };
 }
 render() {
 if (this.state.hasError) {
 return this.props.fallback || (
 <div className="p-8 text-center">
 <div className="text-red-400 font-bold text-sm mb-2">⚠️ Component crashed</div>
 <div className="text-[var(--color-text-secondary)] text-xs mb-4">{this.state.error?.message || 'Unknown error'}</div>
 <button
 onClick={() => this.setState({ hasError: false, error: null })}
 className="px-4 py-2 bg-[var(--color-accent-sage)] text-slate-800 rounded-lg text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
 >
 Try Again
 </button>
 </div>
 );
 }
 return this.props.children;
 }
}

interface ComponentItem {
 id: string;
 name: string;
 title: string;
 description: string;
 category: string;
 badge?: string;
 dependencies: string[];
 installCommand: string;
}

const CATALOG_COMPONENTS: ComponentItem[] = [
 {
 id: 'user-profile-card',
 name: 'user-profile-card',
 title: 'User Profile Card (Nitro Edition)',
 description: 'MNC-grade user & creator profile card with Discord Nitro features, Radix UI primitives, animated avatar decorations, and responsive metrics dashboard.',
 category: 'User & Profile',
 badge: 'Nitro Exclusive',
 dependencies: ['@radix-ui/react-tabs', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
 installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/user-profile-card.json"'
 },
 {
 id: 'feature-management-card',
 name: 'feature-management-card',
 title: 'Feature Management Card (Standalone Settings)',
 description: 'MNC-grade standalone user settings control panel & feature manager card with live HSL color dropper, croppers, and settings categories.',
 category: 'Settings & Control',
 badge: 'MNC Grade',
 dependencies: ['@radix-ui/react-dialog', 'framer-motion', 'lucide-react'],
 installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/user-profile-card.json"'
 },
 {
 id: 'chat-list-card',
 name: 'chat-list-card',
 title: 'Chat List Card',
 description: 'MNC-grade chat inbox card with online indicators, search filter, unread count badges, new chat modal, and live messenger stream panel.',
 category: 'Messaging & Chat',
 badge: 'New Featured',
 dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
 installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/chat-list-card.json"'
 },
 {
 id: 'heartlink',
 name: 'heartlink',
 title: 'HeartLink Dating Hub',
 description: 'MNC-grade hybrid dating experience combining the best of Tinder, Bumble, and Hinge with anti-ghosting AI and 72-hour pulse features.',
 category: 'Social & Feed',
 badge: 'Premium',
 dependencies: ['lucide-react', 'clsx', 'tailwind-merge', 'framer-motion'],
 installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/heartlink.json"'
 },
 {
 id: 'social-post-card',
 name: 'social-post-card',
 title: 'Social Post Card',
 description: 'MNC-grade feed card with multi-reactions, right-side comments panel, audio voice note player, and fullscreen lightbox.',
 category: 'Social & Feed',
 badge: 'Pro Featured',
 dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
 installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/social-post-card.json"'
 },
 {
 id: 'pricing-table',
 name: 'pricing-table',
 title: 'Pricing Table',
 description: 'MNC-grade pricing table with monthly/yearly billing toggle, feature matrix, popular tier badges, and commercial monetization flow.',
 category: 'Monetization & Sales',
 badge: 'New',
 dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
 installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/pricing-table.json"'
 },
 {
 id: 'discord-sidebar-nav',
 name: 'discord-sidebar-nav',
 title: 'Discord Side Navigation Bar',
 description: 'MNC-grade double-column Discord navigation bar with Server Rail, pill indicators, collapsible channel categories, active voice participants, and user quick controller.',
 category: 'Navigation & Sidebar',
 badge: 'MNC Grade',
 dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
 installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/discord-sidebar-nav.json"'
 },
 {
 id: 'spatial-carousel',
 name: 'spatial-carousel',
 title: 'Apple-Style 3D Spatial Carousel',
 description: 'Cinematic 3D CoverFlow carousel with mouse-tracking parallax tilt, spring physics, glassmorphic glare, drag/swipe, keyboard nav, auto-play, fullscreen expand, and floating particles.',
 category: 'Animation & Motion',
 badge: 'Premium',
 dependencies: ['framer-motion', 'lucide-react'],
 installCommand: 'npx shadcn@latest add "https://raw.githubusercontent.com/Nitish2620/shadcn-mcp-app/main/public/r/spatial-carousel.json"'
 }
];

export default function App() {
 const [activeModule, setActiveModule] = useState<string>('messages');
 const [darkMode, setDarkMode] = useState(false);
 const [copiedCmd, setCopiedCmd] = useState<Record<string, boolean>>({});
 const activeTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

 useEffect(() => {
 return () => {
 activeTimeouts.current.forEach(clearTimeout);
 activeTimeouts.current.clear();
 };
 }, []);

 const [searchQuery, setSearchQuery] = useState('');

 const [isModalOpen, setIsModalOpen] = useState(false);
 
 // Shared full profile data sync — reacts to changes from ANY component
 const [appProfileData, setAppProfileData] = useProfileSync({
 name: 'Ram Verma',
 handle: '@ram',
 userStatus: 'online' as const,
 avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
 banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
 bio: 'Full-stack AI systems architect & Discord Nitro Booster ✨ Building MNC-grade web apps with Next.js, Tailwind CSS & Radix UI primitives.',
 pronouns: 'he/him',
 joinedDiscordDate: 'Feb 14, 2021',
 joinedServerDate: 'Nov 02, 2022',
 themeColor: 'from-purple-600 to-indigo-600',
 profileTheme: 'blurple' as const,
 avatarDecoration: 'sakura' as const,
 bannerEffect: 'sakura_moonlight' as const,
 profileEffect: 'sakura_breeze' as const,
 nitroLevel: 'level3' as const,
 subscriptionTier: 'nitro_pro' as const,
 badges: [],
 stats: { followers: 1280, likes: 4320, mediaCount: 42, postsCount: 18, boostCount: 14, nextLevelBoosts: 20 },
 serverRoles: [
 { id: 'r1', name: 'Admin', colorGradient: '#818cf8', animated: false },
 { id: 'r2', name: 'Nitro Booster', colorGradient: '#e879f9', animated: true },
 { id: 'r3', name: 'Core Contributor', colorGradient: '#34d399', animated: false }
 ],
 spotifyPresence: {
 song: 'Starboy (feat. Daft Punk)',
 artist: 'The Weeknd, Daft Punk',
 albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80',
 durationSeconds: 230,
 currentSeconds: 102,
 isPlaying: true
 },
 gamePresence: {
 name: 'Cyberpunk 2077',
 details: 'Exploring Night City',
 state: 'In Competitive Lobby (3/4)',
 icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80',
 elapsedTime: '01:45 elapsed'
 },
 connectedAccounts: [
 { id: '1', platform: 'github', name: 'Nitish2620', url: 'https://github.com/Nitish2620' },
 { id: '2', platform: 'twitter', name: '@Nitish_Dev', url: 'https://twitter.com/' },
 { id: '3', platform: 'spotify', name: 'Nitish Mix', url: 'https://spotify.com/' }
 ]
 });

 const toggleDarkMode = () => {
 setDarkMode(!darkMode);
 if (!darkMode) {
 document.documentElement.classList.add('dark');
 } else {
 document.documentElement.classList.remove('dark');
 }
 };

 const copyToClipboard = (text: string, id: string) => {
 navigator.clipboard.writeText(text);
 setCopiedCmd(prev => ({ ...prev, [id]: true }));
 const t = setTimeout(() => {
 setCopiedCmd(prev => ({ ...prev, [id]: false }));
 activeTimeouts.current.delete(t);
 }, 2000);
 activeTimeouts.current.add(t);
 };

 const componentUsageCode = `import { UserProfileCard } from '@/components/blocks/user-profile-card/user-profile-card';

export default function ProfilePage() {
 return (
 <UserProfileCard />
 );
}`;

 const registryJson = `{
"$schema": "https://ui.shadcn.com/schema/registry-item.json",
"name": "user-profile-card",
"type": "registry:block",
"title": "User Profile Card (Nitro Edition)",
"description": "An MNC-grade creator & user profile card with Discord Nitro features, Radix UI primitives, animated avatar decorations, and responsive metrics dashboard.",
"dependencies": ["@radix-ui/react-tabs", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-tooltip", "framer-motion", "lucide-react", "clsx", "tailwind-merge"],
"files": [
 {
"path": "registry/default/blocks/user-profile-card/user-profile-card.tsx",
"type": "registry:component"
 },
 {
"path": "registry/default/blocks/user-profile-card/types.ts",
"type": "registry:lib"
 }
 ]
}`;

 const filteredCatalog = CATALOG_COMPONENTS.filter(item => 
 item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
 item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
 item.description.toLowerCase().includes(searchQuery.toLowerCase())
 );

 return (
    <SidebarProvider>
      <AppSidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex flex-col flex-1 min-w-0 h-[100dvh] overflow-hidden bg-slate-50 dark:bg-slate-950">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 w-full">
          <SidebarTrigger className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 cursor-pointer" />
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 cursor-pointer"
              title="Toggle theme"
            >
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </header>

 <main className="flex-1 overflow-hidden relative w-full h-full flex flex-col">
  <ErrorBoundary>
  <Suspense fallback={<div className="p-12 text-sm font-semibold text-purple-400 animate-pulse flex items-center gap-2"><Sparkles className="w-4 h-4"/> Loading MNC-grade component...</div>}>
 {activeModule === 'messages' && (
 <HeartLinkApp 
 subscriptionTier={appProfileData.subscriptionTier} 
 profile={appProfileData} 
 onSelectSubscription={(tier: any) => setAppProfileData({...appProfileData, subscriptionTier: tier as SubscriptionTier})} 
 />
 )}
 
 {activeModule === 'profile' && (
 <div className="flex flex-col items-center gap-4 py-8 max-w-7xl mx-auto px-4 h-full overflow-y-auto">
 <UserProfileFeatureManager 
 profile={appProfileData}
 subscriptionTier={appProfileData.subscriptionTier}
 onSaveProfile={(updated: UserProfileData) => {
 setAppProfileData(updated);
 }}
 onSelectSubscription={(tier: SubscriptionTier) => setAppProfileData({...appProfileData, subscriptionTier: tier})}
 isModal={false}
 />
 </div>
 )}
 
 {activeModule === 'settings' && (
 <div className="w-full h-full overflow-y-auto">
 <PricingTable />
 </div>
 )}

 {activeModule === 'feed' && (
 <SocialPostCard profile={appProfileData} />
 )}
 
 {activeModule === 'notifications' && (
 <div className="p-8 max-w-7xl mx-auto">
 <h2 className="text-2xl font-bold mb-6">Notifications</h2>
 <div className="text-[var(--color-text-secondary)]">You have no new notifications.</div>
 </div>
 )}
  </Suspense>
  </ErrorBoundary>
  </main>
  </div>
  </SidebarProvider>
 );
}