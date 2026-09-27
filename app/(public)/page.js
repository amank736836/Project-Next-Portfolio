import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { createAdminClient } from "@/lib/supabase/server";
import HeroPortrait3D from "@/components/ui/HeroPortrait3D";
import "./Home.css";

export default async function Home() {
  const supabase = await createAdminClient();
  const { data: infoData } = await supabase
    .from('personal_info')
    .select('description')
    .eq('key', 'site_mode')
    .single();

  const siteMode = infoData?.description || 'multi';

  // In single-page mode, the Home section is rendered by SinglePageLayout
  if (siteMode === 'single') {
    return null;
  }

  return (
    <section className="home section grid">
      <div className="home__img-wrapper cursor-pointer">
        <HeroPortrait3D src="/assets/profile_v4.png" alt="Profile" priority />
      </div>
      <div className="home__content">
        <div className="home__data">
          <h1 className="home__title">
            <div>I&apos;m Aman Kumar. </div>
            <span>Full Stack Developer</span>
          </h1>
          <div className="home__description">
            <p>Passionate Full Stack Developer with Expertise in MERN Stack</p>
          </div>
          <Link href="/about" className="button">
            More About Me
            <span className="button__icon">
              <FaArrowRight />
            </span>
          </Link>
        </div>
      </div>

      <div className="color__block"></div>
    </section>
  );
}
