import { Message } from "../types/messageType";
import { HistoryItem } from "../types/historyItemType";

type StorageKey =
  | "chatHistory"
  | "historyData"
  | "interestData"
  | "contentData";

type StorageMap = {
  chatHistory: Message[];
  historyData: HistoryItem[];
  interestData: string;
  contentData: string[];
}

export const saveChatData = (newMessage: Message) => {
  chrome.storage.local.get("chatHistory", (result) => {
    const chatHistory = result.chatHistory || [];
    chatHistory.push(newMessage);
    chrome.storage.local.set({ chatHistory });
  });
};

export const loadChatData = (callback: (chatHistory: Message[]) => void) => {
  chrome.storage.local.get("chatHistory", (result) => {
    const chatHistory = result.chatHistory || [];
    callback(chatHistory);
  });
};

export const removeLocalStorageData = (
  name: StorageKey,
  callback: () => void
) => {
  chrome.storage.local.remove(name, callback);
};

export const saveHistoryData = (historyItems: HistoryItem[]): void => {
  chrome.storage.local.set({ historyData: historyItems });
};

export const loadHistoryData = (
  callback: (historyItems: HistoryItem[]) => void
): void => {
  chrome.storage.local.get("historyData", (result) => {
    const historyItems = result.historyData || [];
    callback(historyItems);
  });
};

// Interest Data Management
export const saveInterestData = (interestInput: string[]) => {
  chrome.storage.local.set({ interestData: interestInput });
};

export const loadInterestData = (callback: (interestInput: string[]) => void) => {
  chrome.storage.local.get("interestData", (result) => {
    callback(result.interestData || "");
  });
};

export const saveContentData = (content: string[]) => {
  chrome.storage.local.set<StorageMap>({ contentData: content });
};

export const loadContentData = (callback: (content: string) => void) => {
  chrome.storage.local.get("contentData", (result) => {
    callback(result.contentData || "");
  });
};
