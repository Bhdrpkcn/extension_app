import { HistoryItem } from "../components/history/History";

export const formatHistoryItem = (historyItem: HistoryItem) => {
    return `${historyItem.url} - count: ${historyItem.visitCount}`;
  }