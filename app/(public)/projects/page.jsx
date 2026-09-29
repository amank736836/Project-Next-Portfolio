import ProjectsPageClient from "./ProjectsPageClient";

export const metadata = {
  title: "Projects",
  description: "Browse Aman Kumar's web development projects and full-stack applications.",
  alternates: { canonical: "/projects" },
};

export default async function PortfolioPage() {
  return <ProjectsPageClient />;
}
