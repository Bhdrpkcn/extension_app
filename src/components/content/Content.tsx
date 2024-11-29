import React, { useEffect } from "react";
import "./style.scss";
import { useContentResponse } from "@/hooks/useContentResponse";
import { loadContentData } from "@/utils/dataUtils";
import { Button } from "../ui/button";

const Content: React.FC = () => {
  const {
    generatedContent,
    setGeneratedContent, // We will use this to set the loaded content
    interestData,
    loading,
    showSyncButton,
    fetchGenerateContent,
  } = useContentResponse();

  // Load content data on component mount and set it to `generatedContent`
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
    <div className="content-container">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <div className="interest-data">
        <h3>Interest Data</h3>
        <p>
          {interestData
            ? "Interest data exists"
            : "No interest data available."}
        </p>
      </div>

      {showSyncButton ? (
        <Button
          onClick={fetchGenerateContent}
          disabled={loading}
          className="sync-button"
        >
          {loading ? "Syncing..." : "Sync Interest Data"}
        </Button>
      ) : (
        <Button
          onClick={fetchGenerateContent}
          disabled={loading}
          className="generate-content-button"
        >
          {loading ? "Generating..." : "refresh Content Tags"}
        </Button>
      )}

      <div className="generated-content">
        <h3>Generated Content</h3>
        {generatedContent.length > 0 ? (
          generatedContent.map((content, index) => (
            <p
              style={{
                display: "flex",
                border: "1px solid gray",
                padding: "8px",
              }}
              key={index}
            >
              {content}
            </p>
          ))
        ) : (
          <p>No content generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default Content;
