import SkillsPageClient from "./SkillsPageClient";

export const metadata = {
  title: "Skills",
  description: "Explore Aman Kumar's technical skills across frontend, backend, database, cloud, and programming languages.",
  alternates: { canonical: "/skills" },
};

export default async function SkillsPage() {
  return <SkillsPageClient />;
}
