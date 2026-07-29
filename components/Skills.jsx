"use client";

import { useState } from "react";
import "@/app/(public)/about.css";

const skillConfig = {
  // Frontend
  React: { category: "Frontend", icon: "⚛", color: "#61DAFB", description: "Built 12+ production apps" },
  "React.js": { category: "Frontend", icon: "⚛", color: "#61DAFB", description: "Built 12+ production apps" },
  JavaScript: { category: "Frontend", icon: "📜", color: "#F7DF1E", description: "ES6+, TypeScript, modern patterns" },
  Javascript: { category: "Frontend", icon: "📜", color: "#F7DF1E", description: "ES6+, TypeScript, modern patterns" },
  TypeScript: { category: "Frontend", icon: "🔷", color: "#3178C6", description: "Strict typing, generics, utility types" },
  HTML: { category: "Frontend", icon: "🌐", color: "#E34F26", description: "Semantic, accessible, SEO-friendly" },
  Html: { category: "Frontend", icon: "🌐", color: "#E34F26", description: "Semantic, accessible, SEO-friendly" },
  CSS: { category: "Frontend", icon: "🎨", color: "#1572B6", description: "Grid, Flexbox, Animations, Tailwind" },
  Css: { category: "Frontend", icon: "🎨", color: "#1572B6", description: "Grid, Flexbox, Animations, Tailwind" },
  Tailwind: { category: "Frontend", icon: "💨", color: "#06B6D4", description: "Utility-first, responsive design" },
  "Tailwind CSS": { category: "Frontend", icon: "💨", color: "#06B6D4", description: "Utility-first, responsive design" },
  NextJS: { category: "Frontend", icon: "▲", color: "#000000", description: "App Router, SSR, Server Actions" },
  "Next.js": { category: "Frontend", icon: "▲", color: "#000000", description: "App Router, SSR, Server Actions" },
  Redux: { category: "Frontend", icon: "🔄", color: "#764ABC", description: "State management, RTK, Toolkit" },
  "React Query": { category: "Frontend", icon: "📡", color: "#FF4154", description: "Server state, caching, mutations" },
  
  // Backend
  NodeJS: { category: "Backend", icon: "🟢", color: "#339933", description: "Express, Fastify, REST APIs, GraphQL" },
  NodeJs: { category: "Backend", icon: "🟢", color: "#339933", description: "Express, Fastify, REST APIs, GraphQL" },
  ExpressJS: { category: "Backend", icon: "🚂", color: "#000000", description: "Middleware, routing, validation" },
  ExpressJs: { category: "Backend", icon: "🚂", color: "#000000", description: "Middleware, routing, validation" },
  Java: { category: "Backend", icon: "☕", color: "#ED8B00", description: "Spring Boot, Maven, JPA, Multithreading" },
  Spring: { category: "Backend", icon: "🌱", color: "#6DB33F", description: "Boot, Security, Data JPA, Cloud" },
  "Spring Boot": { category: "Backend", icon: "🌱", color: "#6DB33F", description: "Boot, Security, Data JPA, Cloud" },
  Python: { category: "Backend", icon: "🐍", color: "#3776AB", description: "FastAPI, Django, Flask, Async" },
  Go: { category: "Backend", icon: "🐹", color: "#00ADD8", description: "Concurrency, Microservices, gRPC" },
  
  // Database
  MongoDB: { category: "Database", icon: "🍃", color: "#47A248", description: "Aggregation, Indexing, Sharding" },
  MongoDb: { category: "Database", icon: "🍃", color: "#47A248", description: "Aggregation, Indexing, Sharding" },
  PostgreSQL: { category: "Database", icon: "🐘", color: "#336791", description: "Advanced queries, JSONB, Partitioning" },
  MySQL: { category: "Database", icon: "🐬", color: "#4479A1", description: "Optimization, Replication, ACID" },
  Redis: { category: "Database", icon: "⚡", color: "#DC382D", description: "Caching, Pub/Sub, Streams" },
  Prisma: { category: "Database", icon: "🔮", color: "#2D3748", description: "Type-safe ORM, Migrations" },
  
  // Cloud & DevOps
  AWS: { category: "Cloud", icon: "☁", color: "#FF9900", description: "EC2, S3, Lambda, RDS, CloudFront" },
  Docker: { category: "Cloud", icon: "🐳", color: "#2496ED", description: "Multi-stage builds, Compose, Swarm" },
  Kubernetes: { category: "Cloud", icon: "☸", color: "#326CE5", description: "Deployments, Services, Helm" },
  Git: { category: "Cloud", icon: "📦", color: "#F05032", description: "Workflows, CI/CD, GitHub Actions" },
  CI: { category: "Cloud", icon: "⚙", color: "#2088FF", description: "GitHub Actions, Jenkins, Pipelines" },
  "CI/CD": { category: "Cloud", icon: "⚙", color: "#2088FF", description: "GitHub Actions, Jenkins, Pipelines" },
  Vercel: { category: "Cloud", icon: "▲", color: "#000000", description: "Edge functions, Analytics, Deploy" },
  
  // Languages & Tools
  C: { category: "Languages", icon: "🔧", color: "#A8B9CC", description: "Systems, Pointers, Memory management" },
  "C++": { category: "Languages", icon: "⚡", color: "#00599C", description: "OOP, STL, Templates, Performance" },
  CPP: { category: "Languages", icon: "⚡", color: "#00599C", description: "OOP, STL, Templates, Performance" },
  Rust: { category: "Languages", icon: "🦀", color: "#DEA584", description: "Ownership, Borrowing, Safety" },
};

const categoryOrder = ["Frontend", "Backend", "Database", "Cloud", "Languages"];

function getSkillConfig(title) {
  return skillConfig[title] || { 
    category: "Other", 
    icon: "⭐", 
    color: "#6B7280", 
    description: "Proficient" 
  };
}

export default function Skills({ data }) {
  if (!data || data.length === 0) return null;

  // Group skills by category
  const categorized = data.reduce((acc, skill) => {
    const config = getSkillConfig(skill.title);
    const category = config.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push({ ...skill, ...config });
    return acc;
  }, {});

  const [hoveredSkill, setHoveredSkill] = useState(null);

  return (
    <div className="skills-wrapper">
      {categoryOrder.map((category) => {
        const skills = categorized[category];
        if (!skills || skills.length === 0) return null;
        return (
          <div key={category} className="skills__category reveal delay-1">
            <h3 className="skills__category-title">{category}</h3>
            <div className="skills__category-grid">
              {skills.map((skill, index) => {
                const delayClass = `delay-${(index % 6) + 1}`;
                const isHovered = hoveredSkill === skill.title;
                return (
                  <div
                    key={skill.id || skill.title}
                    className={`skills__item reveal-scale ${delayClass} ${isHovered ? "hovered" : ""}`}
                    onMouseEnter={() => setHoveredSkill(skill.title)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className="skills__item-header">
                      <span className="skills__icon" style={{ color: skill.color }} aria-hidden="true">
                        {skill.icon}
                      </span>
                      <h4 className="skills__title">{skill.title}</h4>
                    </div>
                    {isHovered && (
                      <div className="skills__item-details">
                        <p className="skills__description">{skill.description}</p>
                        <div className="skills__proficiency">
                          <span className="skills__proficiency-label">Proficiency</span>
                          <div className="skills__proficiency-bar">
                            <div 
                              className="skills__proficiency-fill" 
                              style={{ width: `${skill.percentage || 85}%`, backgroundColor: skill.color }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {/* Other category */}
      {Object.keys(categorized).filter(c => !categoryOrder.includes(c)).map((category) => {
        const skills = categorized[category];
        return (
          <div key={category} className="skills__category reveal delay-1">
            <h3 className="skills__category-title">{category}</h3>
            <div className="skills__category-grid">
              {skills.map((skill, index) => {
                const delayClass = `delay-${(index % 6) + 1}`;
                const isHovered = hoveredSkill === skill.title;
                return (
                  <div
                    key={skill.id || skill.title}
                    className={`skills__item reveal-scale ${delayClass} ${isHovered ? "hovered" : ""}`}
                    onMouseEnter={() => setHoveredSkill(skill.title)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className="skills__item-header">
                      <span className="skills__icon" style={{ color: skill.color }} aria-hidden="true">
                        {skill.icon}
                      </span>
                      <h4 className="skills__title">{skill.title}</h4>
                    </div>
                    {isHovered && (
                      <div className="skills__item-details">
                        <p className="skills__description">{skill.description}</p>
                        <div className="skills__proficiency">
                          <span className="skills__proficiency-label">Proficiency</span>
                          <div className="skills__proficiency-bar">
                            <div 
                              className="skills__proficiency-fill" 
                              style={{ width: `${skill.percentage || 85}%`, backgroundColor: skill.color }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}