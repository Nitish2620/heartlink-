export interface RegistryItem {
  name: string;
  type: 'registry:ui' | 'registry:block' | 'registry:component';
  title: string;
  description: string;
  dependencies?: string[];
  files: string[];
}

export const registryComponents: RegistryItem[] = [
  {
    name: 'social-post-card',
    type: 'registry:block',
    title: 'Social Post Card',
    description: 'MNC-grade social media post card with reaction popover, right-side comments panel, audio voice notes player, and lightbox.',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
    files: [
      'registry/default/blocks/social-post-card/social-post-card.tsx',
      'registry/default/blocks/social-post-card/types.ts'
    ]
  },
  {
    name: 'chat-list-card',
    type: 'registry:block',
    title: 'Chat List Card',
    description: 'MNC-grade chat inbox card with online indicators, search filter, unread count badges, new chat modal, and live messenger stream panel.',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
    files: [
      'registry/default/blocks/chat-list-card/chat-list-card.tsx',
      'registry/default/blocks/chat-list-card/types.ts'
    ]
  },
  {
    name: 'pricing-table',
    type: 'registry:block',
    title: 'Pricing Table',
    description: 'MNC-grade pricing table with monthly/yearly billing toggle, feature matrix, popular tier badges, and commercial monetization flow.',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
    files: [
      'registry/default/blocks/pricing-table/pricing-table.tsx',
      'registry/default/blocks/pricing-table/types.ts'
    ]
  },
  {
    name: 'button',
    type: 'registry:ui',
    title: 'Button',
    description: 'Base button primitive component.',
    dependencies: ['clsx', 'tailwind-merge'],
    files: ['registry/default/ui/button.tsx']
  },
  {
    name: 'card',
    type: 'registry:ui',
    title: 'Card',
    description: 'Base card primitive container component.',
    dependencies: ['clsx', 'tailwind-merge'],
    files: ['registry/default/ui/card.tsx']
  }
];
