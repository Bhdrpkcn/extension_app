import { useState, useEffect } from "react";
import {
  loadContentData,
  loadInterestData,
  saveContentData,
} from "../utils/dataUtils";
import { fetchContentResponse } from "../utils/fetchContentResponse";
import { handleError } from "../utils/error/errorHandler";

export const useContentResponse = () => {
  const [interestData, setInterestData] = useState<string[] | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [showSyncButton, setShowSyncButton] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInterestData(setInterestData);
  }, []);

  useEffect(() => {
    loadContentData((content: string[] | string) => {
      if (content.length === 0) {
        setShowSyncButton(true);
      } else {
        setShowSyncButton(false);
      }
    });
  }, []);

  const fetchGenerateContent = async () => {
    if (!interestData) {
      console.log("No interest data available.");
      return;
    }

    setLoading(true);
    try {
      const responses = await Promise.all(
        interestData.map((tag) => fetchContentResponse(tag, "content"))
      );
      setGeneratedContent(responses);

      const contentArray: string[] = [];
      responses.forEach((content) => {
        contentArray.push(content);
        console.log("content ITEM FROM ARRAY", content);
      });

      saveContentData(contentArray);
      console.log("content ARRAY :", contentArray);
    } catch (error) {
      handleError(error, { logToConsole: true });
    } finally {
      setLoading(false);
    }
  };

  return {
    interestData,
    generatedContent,
    loading,
    showSyncButton,
    fetchGenerateContent,
    setGeneratedContent,
  };
};
