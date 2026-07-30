import { createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar/Navbar';
import Themes from '@/components/Themes/Themes';
import ScrollHandler from '@/components/ScrollHandler';
import TransitionLoader from '@/components/TransitionLoader';
import RootShell from '@/components/RootShell';
import SinglePageLayout from '@/components/SinglePageLayout';
import ScrollReveal from '@/components/ScrollReveal';
import './Home.css';

export default async function PublicLayout({ children }) {
  const supabase = await createAdminClient();
  
  const [{ data: siteModeData }, { data: settingsData }, initialUser, { data: featuredSkills }, { data: heroImages }, { data: personalInfo }] = await Promise.all([
    supabase.from('personal_info').select('description').eq('key', 'site_mode').single(),
    supabase.from('user_settings').select('key, description').in('key', ['enable_scroll_reveal', 'enable_typewriter', 'enable_open_to_work']),
    getCurrentUser(),
    supabase.from('skills').select('title, icon, color, category').eq('is_featured', true).order('id', { ascending: true }).limit(5),
    supabase.from('hero_images').select('*').eq('is_hero', true).single(),
    supabase.from('personal_info').select('key, description').in('key', ['linkedin', 'github', 'twitter', 'facebook', 'instagram', 'threads', 'snapchat', 'telegram', 'codolio', 'email', 'website', 'phone', 'address'])
  ]);

  const siteMode = siteModeData?.description || 'multi';
  const settings = Object.fromEntries((settingsData || []).map(d => [d.key, d.description]));
  const enableScrollReveal = settings.enable_scroll_reveal !== 'false';
  const enableTypewriter = settings.enable_typewriter !== 'false';
  const enableOpenToWork = settings.enable_open_to_work !== 'false';
  
  const socialLinks = Object.fromEntries((personalInfo || []).map(d => [d.key, d.description]));

  return (
    <RootShell>
      <Navbar siteMode={siteMode} initialUser={initialUser} />
      <Themes />
      <ScrollHandler siteMode={siteMode} />
      <TransitionLoader />
      <ScrollReveal enabled={enableScrollReveal} />
      {siteMode === 'single' ? <SinglePageLayout enableTypewriter={enableTypewriter} enableOpenToWork={enableOpenToWork} featuredSkills={featuredSkills || []} heroImage={heroImages} socialLinks={socialLinks} /> : children}
    </RootShell>
  );
}
