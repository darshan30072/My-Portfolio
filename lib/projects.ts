export type ProjectLike = {
  id: string;
  featured?: boolean;
};

export function splitProjects<T extends ProjectLike>(projects: readonly T[]) {
  return {
    featuredProjects: projects.filter((project) => project.featured),
    otherProjects: projects.filter((project) => !project.featured),
  };
}
