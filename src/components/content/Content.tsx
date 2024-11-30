import React, { useEffect } from "react";
import "./style.scss";
import { useContentResponse } from "@/hooks/useContentResponse";
import { loadContentData } from "@/utils/dataUtils";
import { Button } from "../ui/button";
import { useFetchedHistory } from "@/hooks/useFetchedHistory";

const Content: React.FC = () => {
  const {
    generatedContent,
    setGeneratedContent,
    interestData,
    loading,
    showSyncButton,
    fetchGenerateContent,
  } = useContentResponse();

  const { loadingSummarization, handleSummarizeHistory, clearInterestData } =
    useFetchedHistory();

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
      <div className="temporary-div">
        <div className="temporary-text">
          {interestData
            ? "Interest data exists"
            : "No interest data available."}
        </div>
        <div className="temporary-buttons">
          <div>
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
          </div>

          <div>
            <button
              className="sync-button"
              onClick={handleSummarizeHistory}
              disabled={loadingSummarization}
            >
              {loadingSummarization ? "Summarizing..." : "Summarize History"}
            </button>
            <button className="sync-button" onClick={clearInterestData}>
              Clear Interest Data
            </button>
          </div>
        </div>
      </div>

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

/**
 import React from "react";

import "./style.scss";
import { Button } from "../ui/button";
import { useContentResponse } from "@/hooks/useContentResponse";
import { useFetchedHistory } from "@/hooks/useFetchedHistory";
import { CardsContainer } from "../ui/CardsContainer";

const Content: React.FC = () => {
  const { interestData, loading, showSyncButton, fetchGenerateContent } =
    useContentResponse();

  const { loadingSummarization, handleSummarizeHistory, clearInterestData } =
    useFetchedHistory();

  return (
    <div className="content-container">
      <div className="temporary-div">
        <div className="temporary-text">
          {interestData
            ? "Interest data exists"
            : "No interest data available."}
        </div>
        <div className="temporary-buttons">
          <div>
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
                {loading ? "Generating..." : "Refresh Content Tags"}
              </Button>
            )}
          </div>

          <div className="temporary-dev-buttons">
            <button
              className="sync-button"
              onClick={handleSummarizeHistory}
              disabled={loadingSummarization}
            >
              {loadingSummarization ? "Summarizing..." : "Summarize History"}
            </button>
            <button className="sync-button" onClick={clearInterestData}>
              Clear Interest Data
            </button>
          </div>
        </div>
      </div>

      <CardsContainer />
    </div>
  );
};

export default Content;
 */
