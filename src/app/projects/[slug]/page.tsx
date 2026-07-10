import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { PROFILE } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";
import { CaseStudy } from "@/components/case-study/CaseStudy";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: `${project.tagline} ${project.description}`.slice(0, 160),
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.tagline,
      url: `${SITE_URL}/projects/${project.id}`,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((p) => p.id === slug);
  if (index === -1) notFound();

  const project = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${SITE_URL}/projects/${project.id}#work`,
        name: project.title,
        description: project.description,
        url: `${SITE_URL}/projects/${project.id}`,
        dateCreated: project.year,
        keywords: project.stack.join(", "),
        author: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: PROFILE.name, item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: `${SITE_URL}/#projects`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: `${SITE_URL}/projects/${project.id}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudy project={project} next={next} />
    </>
  );
}
