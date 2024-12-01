import { useState, useEffect } from "react";
import { fetchHistoryItems } from "../utils/fetchHistoryItems";
import { createInterestData } from "../utils/fetchGeminiSummarize";
import { removeLocalStorageData, saveInterestData } from "../utils/dataUtils";
import { HistoryItem } from "../types/historyItemType";
import { handleError } from "../utils/error/errorHandler";

export const useFetchedHistory = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingSummarization, setLoadingSummarization] = useState(false);

  const fetchAndSaveHistory = async () => {
    setLoadingHistory(true);
    try {
      await fetchHistoryItems();
      chrome.storage.local.get("historyData", (result) => {
        setHistoryItems(result.historyData || []);
      });
    } catch (error) {
      handleError(error, {
        logToConsole: true,
        fallbackValue: [],
      });
    } finally {
      setLoadingHistory(false);
    }
  };


  const createAndSaveInterestData = async () => {
    setLoadingSummarization(true);
    try {
       await createInterestData();
    } catch (error) {
      handleError(error, {
        logToConsole: true,
      });
    } finally {
      setLoadingSummarization(false);
    }
  };

  const clearInterestData = () => {
    removeLocalStorageData("interestData",() => {})
  };

  useEffect(() => {
    fetchAndSaveHistory();
  }, []);

  useEffect(()=> {
    if(historyItems.length){
      createAndSaveInterestData()
    }
  },[historyItems])

  return {
    loadingHistory,
    loadingSummarization,
    createAndSaveInterestData,
    clearInterestData,
  };

};



// const interestDataMapped = (interestData as string[]).reduce((acc, item, index) => {
//   acc[`Item ${index + 1}`] = item;
//   return acc;
// }, {} as { [key: string]: string });
// setMappedInterestData(interestDataMapped);