import { useEffect } from "react";
import { useLocation } from "@docusaurus/router";

export default function AutoScrollSidebar() {
  const location = useLocation();

  useEffect(() => {
    const scrollSidebar = () => {
      const active = document.querySelector(".menu__link--active");
      const viewport = document.querySelector('[class*="sidebarViewport"]');

      if (active && viewport) {
        const top =
          active.offsetTop - viewport.clientHeight / 2 + active.clientHeight / 2;

        viewport.scrollTo({
          top,
          behavior: "smooth",
        });
      }

      document
        .querySelector(".table-of-contents__link--active")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
    };

    requestAnimationFrame(scrollSidebar);
    setTimeout(scrollSidebar, 100);

  }, [location.pathname]);

  return null;
}