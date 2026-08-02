import { createAdminClient } from '@/lib/supabase/server';
import AdminSettingsClient from './AdminSettingsClient';

const UI_FEATURE_KEYS = ['enable_scroll_reveal', 'enable_typewriter', 'enable_open_to_work'];

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Admin Settings',
    description: 'Manage operator account and dashboard settings.',
  };
}

export default async function AdminSettingsPage() {
  const supabase = await createAdminClient();
  const [{ data: socialLinksData }, { data: infoData }, { data: settingsData }, { data: heroImages }, { count: resumesCount }] = await Promise.all([
    supabase.from('social_links').select('*').order('display_order', { ascending: true }),
    supabase.from('personal_info').select('*'),
    supabase.from('user_settings').select('key, description').in('key', UI_FEATURE_KEYS),
    supabase.from('hero_images').select('*').order('display_order', { ascending: true }),
    supabase.from('resumes').select('*', { count: 'exact', head: true }),
  ]);

  const socialLinks = {};
  socialLinksData?.forEach(item => {
    socialLinks[item.platform] = item.url || '';
  });

  const resumeItem = infoData?.find(d => d.key === 'resume_url');
  const resumeUrl = resumeItem?.description || '';

  const layoutItem = infoData?.find(d => d.key === 'portfolio_layout');
  const portfolioLayout = layoutItem?.description || 'masonry';

  const siteModeItem = infoData?.find(d => d.key === 'site_mode');
  const siteMode = siteModeItem?.description || 'multi';

  const uiFeatures = {};
  settingsData?.forEach(s => {
    uiFeatures[s.key] = s.description;
  });

  return (
    <AdminSettingsClient
      initialSocialLinks={socialLinks}
      initialSocialLinksData={socialLinksData || []}
      initialResumeUrl={resumeUrl}
      initialResumesCount={resumesCount || 0}
      initialPortfolioLayout={portfolioLayout}
      initialSiteMode={siteMode}
      initialUIFeatures={uiFeatures}
      initialHeroImages={heroImages || []}
    />
  );
}