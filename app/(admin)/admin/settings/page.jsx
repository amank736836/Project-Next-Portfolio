import { createAdminClient } from '@/lib/supabase/server';
import AdminSettingsClient from './AdminSettingsClient';

const SOCIAL_KEYS = ['linkedin', 'github', 'twitter', 'email', 'website'];

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Admin Settings',
    description: 'Manage operator account and dashboard settings.',
  };
}

export default async function AdminSettingsPage() {
  const supabase = await createAdminClient();
  const { data: infoData } = await supabase.from('personal_info').select('*');

  const socialLinks = {};
  SOCIAL_KEYS.forEach(key => {
    const item = infoData?.find(d => d.key === key);
    socialLinks[key] = item?.description || '';
  });

  const resumeItem = infoData?.find(d => d.key === 'resume_url');
  const resumeUrl = resumeItem?.description || '';

  const layoutItem = infoData?.find(d => d.key === 'portfolio_layout');
  const portfolioLayout = layoutItem?.description || 'masonry';

  const siteModeItem = infoData?.find(d => d.key === 'site_mode');
  const siteMode = siteModeItem?.description || 'multi';

  return <AdminSettingsClient initialSocialLinks={socialLinks} initialResumeUrl={resumeUrl} initialPortfolioLayout={portfolioLayout} initialSiteMode={siteMode} />;
}