import * as React from "react"
import {
  MessageSquare,
  Settings,
  User,
  Bell,
  Shield,
  Search,
  Plus,
  HelpCircle,
  Newspaper,
  Heart,
  Crown,
  ChevronRight,
  Users,
  Sparkles
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

export function AppSidebar({
  activeModule,
  onModuleChange
}: {
  activeModule: string
  onModuleChange: (module: string) => void
}) {
  return (
    <Sidebar variant="sidebar" className="border-r border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900">
      <SidebarHeader className="h-20 flex items-center px-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="font-extrabold text-base text-slate-900 dark:text-slate-100 tracking-tight leading-none">
              HeartLink
            </div>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">Real people. Brighter stories.</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4 space-y-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeModule === 'messages'}
                  onClick={() => onModuleChange('messages')}
                  tooltip="Messages"
                  className={`font-semibold py-2.5 px-3 rounded-2xl transition-all ${
                    activeModule === 'messages' 
                      ? 'bg-purple-100/70 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Messages</span>
                  <span className="ml-auto bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">3</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeModule === 'profile'}
                  onClick={() => onModuleChange('profile')}
                  tooltip="Profile"
                  className={`font-semibold py-2.5 px-3 rounded-2xl transition-all ${
                    activeModule === 'profile' 
                      ? 'bg-purple-100/70 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeModule === 'feed'}
                  onClick={() => onModuleChange('feed')}
                  tooltip="Feed"
                  className={`font-semibold py-2.5 px-3 rounded-2xl transition-all ${
                    activeModule === 'feed' 
                      ? 'bg-purple-100/70 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Newspaper className="w-4 h-4 shrink-0" />
                  <span>Feed</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeModule === 'notifications'}
                  onClick={() => onModuleChange('notifications')}
                  tooltip="Notifications"
                  className={`font-semibold py-2.5 px-3 rounded-2xl transition-all ${
                    activeModule === 'notifications' 
                      ? 'bg-purple-100/70 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Bell className="w-4 h-4 shrink-0" />
                  <span>Notifications</span>
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mb-2 px-3 mt-4">
            Discover
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton className="font-semibold py-2 px-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Search className="w-4 h-4 shrink-0" />
                  <span>Find People</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="font-semibold py-2 px-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Heart className="w-4 h-4 shrink-0" />
                  <span>Likes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="font-semibold py-2 px-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Who's Online</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mb-2 px-3 mt-4">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeModule === 'settings'}
                  onClick={() => onModuleChange('settings')}
                  className="font-semibold py-2 px-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="font-semibold py-2 px-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Security</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Upgrade Card Banner */}
        <div className="mx-1 mt-6 p-4 rounded-3xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-indigo-500/10 border border-purple-200/60 dark:border-purple-800/40 relative overflow-hidden group cursor-pointer hover:border-purple-300 transition-all">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Crown className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1">
                Upgrade to Premium
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-1">
                Unlock more matches and exclusive features.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-600 self-center shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 dark:border-slate-800 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help & Support" className="text-slate-500 hover:text-slate-900 font-semibold text-xs">
              <HelpCircle className="w-4 h-4" />
              <span>Help & Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
