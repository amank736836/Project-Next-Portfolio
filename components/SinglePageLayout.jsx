import { createAdminClient } from '@/lib/supabase/server';
import HomeSection from './sections/HomeSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import EducationSection from './sections/EducationSection';
import ExperienceSection from './sections/ExperienceSection';
import ProjectsSection from './sections/ProjectsSection';
import ContactSection from './sections/ContactSection';

export default async function SinglePageLayout({ featuredSkills = [], enableTypewriter = true, enableOpenToWork = true, heroImage = null, socialLinks = {} }) {
  const supabase = await createAdminClient();

  const [infoRes, skillsRes, educationRes, experienceRes, projectsRes] = await Promise.all([
    supabase.from('personal_info').select('*'),
    supabase.from('skills').select('*').order('id', { ascending: true }),
    supabase.from('education').select('*').eq('is_hidden', false).order('id', { ascending: true }),
    supabase.from('experience').select('*').eq('is_hidden', false).order('id', { ascending: true }),
    supabase.from('projects').select('*').eq('is_hidden', false).order('id', { ascending: true }),
  ]);

  const infoData = infoRes.data || [];
  const aboutDescription = infoData.find(i => i.key === 'about_description')?.description;
  const personalInfo = infoData.filter(i => i.key !== 'about_description' && i.key !== 'site_mode' && !i.key.startsWith('default_theme_'));
  
  // Contact info (shown in Contact section) - exclude from About
  const contactKeys = ['linkedin', 'github', 'twitter', 'facebook', 'instagram', 'threads', 'snapchat', 'telegram', 'codolio', 'email', 'website', 'phone'];
  const socialLinksData = personalInfo.filter(i => contactKeys.includes(i.key));
  const aboutInfo = personalInfo.filter(i => !contactKeys.includes(i.key));

  if (aboutInfo.length) {
    const desiredOrder = [
      'first name', 'last name', 'address', 'nationality', 'languages', 'age', 'freelance'
    ];
    aboutInfo.sort((a, b) => {
      const aTitle = (a.title || '').toLowerCase().trim();
      const bTitle = (b.title || '').toLowerCase().trim();
      let aIndex = desiredOrder.findIndex(key => aTitle.includes(key));
      let bIndex = desiredOrder.findIndex(key => bTitle.includes(key));
      if (aIndex === -1) aIndex = aTitle.includes('custom') ? 9999 : 999;
      if (bIndex === -1) bIndex = bTitle.includes('custom') ? 9999 : 999;
      if (aIndex === bIndex && aIndex >= 999) return aTitle.localeCompare(bTitle);
      return aIndex - bIndex;
    });
  }

  return (
    <>
      <section id="home"><HomeSection enableTypewriter={enableTypewriter} enableOpenToWork={enableOpenToWork} featuredSkills={featuredSkills} heroImage={heroImage} /></section>
      <section id="about"><AboutSection aboutDescription={aboutDescription} personalInfo={aboutInfo} /></section>
      <section id="skills"><SkillsSection skillsData={skillsRes.data} /></section>
      <section id="education"><EducationSection educationData={educationRes.data} /></section>
      <section id="experience"><ExperienceSection experienceData={experienceRes.data} /></section>
      <section id="projects"><ProjectsSection projectsData={projectsRes.data} /></section>
      <section id="contact"><ContactSection socialLinks={socialLinks} /></section>
    </>
  );
}