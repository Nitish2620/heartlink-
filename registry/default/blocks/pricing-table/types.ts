export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
  ctaHref?: string;
}

export interface PricingTableProps {
  title?: string;
  subtitle?: string;
  plans?: PricingPlan[];
  onSelectPlan?: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
}
