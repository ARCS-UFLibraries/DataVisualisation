import { courseModules, coursePages } from "./progressConfig";

console.log("Progress utilities loaded");


export function isPageComplete(moduleId, pageId, progress) {
  const module = courseModules.find(
    (item) => item.id === moduleId
  );

  if (!module) {
    return false;
  }

  const pageProgress = progress[pageId];

  if (!pageProgress) {
    return false;
  }

  const quizComplete = pageProgress.quizScore === 100;

  if (!quizComplete) {
    return false;
  }

  if (!module.colabRequired) {
    return true;
  }

  return pageProgress.colabCompleted === true;
}

export function getModuleProgress(moduleId, progress) {
  const pages = coursePages[moduleId] || [];

  if (pages.length === 0) {
    return 0;
  }

  const completedPages = pages.filter((pageId) =>
    isPageComplete(moduleId, pageId, progress)
  );

  return Math.round(
    (completedPages.length / pages.length) * 100
  );
}

export function getOverallProgress(progress) {
  const requiredModules = courseModules.filter(
    (module) => module.required
  );

  let totalPages = 0;
  let completedPages = 0;

  requiredModules.forEach((module) => {
    const pages = coursePages[module.id] || [];

    totalPages += pages.length;

    pages.forEach((pageId) => {
      if (isPageComplete(module.id, pageId, progress)) {
        completedPages += 1;
      }
    });
  });

  if (totalPages === 0) {
    return 0;
  }

  return Math.round(
    (completedPages / totalPages) * 100
  );
}

const testProgress = {
  "why-python": {
    quizScore: 100,
  },

  variables: {
    quizScore: 100,
    colabCompleted: true,
  },

  "data-types": {
    quizScore: 80,
    colabCompleted: true,
  },
};

console.log(
  "Why Python complete:",
  isPageComplete(
    "getting-started",
    "why-python",
    testProgress
  )
);

console.log(
  "Variables complete:",
  isPageComplete(
    "python-essentials",
    "variables",
    testProgress
  )
);

console.log(
  "Data Types complete:",
  isPageComplete(
    "python-essentials",
    "data-types",
    testProgress
  )
);