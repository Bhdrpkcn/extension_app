import { useState, useEffect } from "react";
import { loadInterestData, saveContentData } from "../utils/dataUtils";
import { fetchContentResponse } from "../utils/fetchContentResponse";
import { handleError } from "../utils/error/errorHandler";

export const useContentResponse = () => {
  const [interestData, setInterestData] = useState<string[] | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInterestData(setInterestData);
  }, []);

  const fetchGenerateContent = async () => {
    if (!interestData) {
      console.warn("No interest data available.");
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
      });

      saveContentData(contentArray);
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
    fetchGenerateContent,
  };
};
