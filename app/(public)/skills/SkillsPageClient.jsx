"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "@/app/(public)/about.css";

export default function SkillsPageClient() {
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('skills')
          .select('*')
          .eq('is_hidden', false)
          .order('id', { ascending: true });
        setSkillsData(data || []);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
        setSkillsData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  if (loading) {
    return (
      <main className="section container page-enter">
        <section className="skills">
          <h2 className="section__title">
            My <span>Skills</span>
          </h2>
          <div className="skills__container grid skeleton-skills">
            <div className="skills__category">
              <h3 className="skills__category-title skeleton-title"></h3>
              <div className="skills__category-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skills__item skeleton-item">
                    <div className="skills__item-header">
                      <div className="skills__icon skeleton-icon"></div>
                      <div className="skills__title skeleton-text"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="skills__category">
              <h3 className="skills__category-title skeleton-title"></h3>
              <div className="skills__category-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skills__item skeleton-item">
                    <div className="skills__item-header">
                      <div className="skills__icon skeleton-icon"></div>
                      <div className="skills__title skeleton-text"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="skills__category">
              <h3 className="skills__category-title skeleton-title"></h3>
              <div className="skills__category-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skills__item skeleton-item">
                    <div className="skills__item-header">
                      <div className="skills__icon skeleton-icon"></div>
                      <div className="skills__title skeleton-text"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="skills__category">
              <h3 className="skills__category-title skeleton-title"></h3>
              <div className="skills__category-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skills__item skeleton-item">
                    <div className="skills__item-header">
                      <div className="skills__icon skeleton-icon"></div>
                      <div className="skills__title skeleton-text"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="skills__category">
              <h3 className="skills__category-title skeleton-title"></h3>
              <div className="skills__category-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skills__item skeleton-item">
                    <div className="skills__item-header">
                      <div className="skills__icon skeleton-icon"></div>
                      <div className="skills__title skeleton-text"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!skillsData || skillsData.length === 0) {
    return (
      <main className="section container page-enter">
        <section className="skills">
          <h2 className="section__title">
            My <span>Skills</span>
          </h2>
          <div className="skills__container grid">
            <div className="col-span-full text-center text-gray-400 py-10">
              No skills found.
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="section container page-enter">
      <section className="skills">
        <h2 className="section__title">
          My <span>Skills</span>
        </h2>
        <div className="skills__container grid">
          <Skills data={skillsData} />
        </div>
      </section>
    </main>
  );
}

import Skills from "@/components/Skills";