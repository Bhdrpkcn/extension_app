import React, { useEffect, useState } from "react";

import { loadContentData } from "@/utils/dataUtils";
import { useContentResponse } from "@/hooks/useContentResponse";
import { cn } from "@/lib/utils";
import { CardContainerHoverFx } from "./fx/cardContainerHoverFx";

export function CardsContainer() {
  const { generatedContent, setGeneratedContent } = useContentResponse();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    loadContentData((content: string[] | string) => {
      if (typeof content === "string") {
        try {
          const parsedContent = JSON.parse(content) as string[];
          if (parsedContent.length > 0) {
            setGeneratedContent(parsedContent);
            console.log("Content data loaded:", parsedContent);
          }
        } catch (error) {
          console.error("Error parsing content data:", error);
        }
      } else if (Array.isArray(content) && content.length > 0) {
        setGeneratedContent(content);
        console.log("Content data loaded:", content);
      }
    });
  }, [setGeneratedContent]);

  return (
    <div className="max-w-5xl mx-auto px-8">
      <div
        className={cn("grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-2")}
      >
        {generatedContent.map((content, idx) => (
          <div
            key={idx}
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <CardContainerHoverFx
              title={`Generated Content ${idx + 1}`}
              description={content}
              hovered={hoveredIndex === idx}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
