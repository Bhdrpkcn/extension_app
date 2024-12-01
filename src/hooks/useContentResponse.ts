import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  loadContentData,
  saveContentData,
} from "../utils/dataUtils";
import { fetchContentResponse } from "../utils/fetchContentResponse";
import { handleError } from "../utils/error/errorHandler";
import { setIsContentChanged } from "@/redux/slices/uiSlice";

export const useContentResponse = () => {
  const dispatch = useDispatch();
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    loadContentData((content: string[]) => {
      if (content.length > 0) {
        setGeneratedContent(content);
      } else {
        console.warn("Content data is empty.");
      }
    });
  }, []);

  const fetchGenerateContent = async (interestData: string[]) => {
    if (!interestData) {
      console.log("No interest data available.");
      return;
    }

    setLoading(true);
    const contentArray: string[] = [];

    try {
      for (const tag of interestData) {
        const response = await fetchContentResponse(tag, "content");
        contentArray.push(response);
      }

      saveContentData(contentArray);
      console.log(">>>>>>>>>>FINAL Contents_ARRAY :", contentArray);

      setGeneratedContent(contentArray);

      dispatch(setIsContentChanged(true));
    } catch (error) {
      handleError(error, { logToConsole: true });
    } finally {
      setLoading(false);
    }
  };

  return {
    generatedContent,
    loading,
    fetchGenerateContent,
    setGeneratedContent,
  };
};
