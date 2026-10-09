import { createAdminClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar/Navbar';
import Themes from '@/components/Themes/Themes';
import ScrollHandler from '@/components/ScrollHandler';
import TransitionLoader from '@/components/TransitionLoader';
import RootShell from '@/components/RootShell';
import SinglePageLayout from '@/components/SinglePageLayout';
import ScrollReveal from '@/components/ScrollReveal';
import AuroraBackground from '@/components/ui/AuroraBackground';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CursorGlow from '@/components/ui/CursorGlow';
import PageTransition from '@/components/ui/PageTransition';
import './Home.css';

export default async function PublicLayout({ children }) {
  const supabase = await createAdminClient();
  
  const [{ data: siteModeData }, { data: settingsData }, initialUser, { data: featuredSkills }, { data: heroImages }, { data: socialLinksData }, { data: personalInfo }] = await Promise.all([
    supabase.from('personal_info').select('description').eq('key', 'site_mode').single(),
    supabase.from('user_settings').select('key, description').in('key', ['enable_scroll_reveal', 'enable_typewriter', 'enable_open_to_work']),
    getCurrentUser(),
    supabase.from('skills').select('title, icon, color, category').eq('is_featured', true).eq('is_hidden', false).order('id', { ascending: true }).limit(5),
    supabase.from('hero_images').select('*').eq('is_hero', true).single(),
    supabase.from('social_links').select('platform, url').eq('is_hidden', false).order('display_order', { ascending: true }),
    // Contact info shown publicly: respect the admin's is_hidden flag.
    supabase.from('personal_info').select('key, description').in('key', ['phone', 'address']).eq('is_hidden', false)
  ]);

  const siteMode = siteModeData?.description || 'multi';
  const settings = Object.fromEntries((settingsData || []).map(d => [d.key, d.description]));
  const enableScrollReveal = settings.enable_scroll_reveal !== 'false';
  const enableTypewriter = settings.enable_typewriter !== 'false';
  const enableOpenToWork = settings.enable_open_to_work !== 'false';
  
  const socialLinks = Object.fromEntries((socialLinksData || []).map(d => [d.platform, d.url]));
  const contactInfo = Object.fromEntries((personalInfo || []).map(d => [d.key, d.description]));
  const allLinks = { ...socialLinks, ...contactInfo };

  return (
    <RootShell>
      {enableScrollReveal ? (
        // Runs before paint so reveal elements never flash in un-animated.
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('motion-ready');" }}
        />
      ) : null}
      <AuroraBackground />
      <ScrollProgress />
      <CursorGlow />
      <Navbar siteMode={siteMode} initialUser={initialUser} />
      <Themes />
      <ScrollHandler siteMode={siteMode} />
      <TransitionLoader />
      <ScrollReveal enabled={enableScrollReveal} />
      <PageTransition>
        {siteMode === 'single' ? <SinglePageLayout enableTypewriter={enableTypewriter} enableOpenToWork={enableOpenToWork} featuredSkills={featuredSkills || []} heroImage={heroImages} socialLinks={allLinks} /> : children}
      </PageTransition>
    </RootShell>
  );
}
