import { createAdminClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar/Navbar';
import Themes from '@/components/Themes/Themes';
import ScrollHandler from '@/components/ScrollHandler';
import TransitionLoader from '@/components/TransitionLoader';
import RootShell from '@/components/RootShell';
import SinglePageLayout from '@/components/SinglePageLayout';
import './Home.css';

export default async function PublicLayout({ children }) {
  const supabase = await createAdminClient();
  const { data: infoData } = await supabase
    .from('personal_info')
    .select('description')
    .eq('key', 'site_mode')
    .single();

  const siteMode = infoData?.description || 'multi';

  return (
    <RootShell>
      <Navbar siteMode={siteMode} />
      <Themes />
      <ScrollHandler siteMode={siteMode} />
      <TransitionLoader />
      {siteMode === 'single' ? <SinglePageLayout /> : children}
    </RootShell>
  );
}