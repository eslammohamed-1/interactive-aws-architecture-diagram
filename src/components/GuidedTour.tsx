import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";

type GuidedTourProps = {
  runId: number;
};

export function GuidedTour({ runId }: GuidedTourProps) {
  useEffect(() => {
    if (runId === 0) return;

    const tour = driver({
      showProgress: true,
      allowClose: true,
      overlayOpacity: 0.72,
      popoverClass: "architecture-tour",
      steps: [
        {
          element: "[data-tour='toolbar']",
          popover: {
            title: "Toolbar",
            description: "Switch views, search components, export diagrams, change learning mode, and open study panels from here.",
          },
        },
        {
          element: "[data-tour='view-tabs']",
          popover: {
            title: "Architecture Views",
            description: "Each tab focuses on a different mental model: traffic, infrastructure, delivery, or security.",
          },
        },
        {
          element: "[data-tour='canvas']",
          popover: {
            title: "Interactive Canvas",
            description: "Drag nodes, zoom, pan, and read edge labels to understand how services connect.",
          },
        },
        {
          element: "[data-tour='search']",
          popover: {
            title: "Search",
            description: "Search dims unrelated nodes so you can focus on one service or concept at a time.",
          },
        },
        {
          element: "[data-tour='learning-mode']",
          popover: {
            title: "Learning Mode",
            description: "Beginner mode explains concepts simply. Senior mode adds production design concerns.",
          },
        },
        {
          element: "[data-tour='export']",
          popover: {
            title: "Export",
            description: "Export the current diagram as PNG or SVG for notes, docs, and presentations.",
          },
        },
      ],
    });

    tour.drive();
    return () => tour.destroy();
  }, [runId]);

  return null;
}
