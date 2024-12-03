import {
  saveChatData,
  saveContentChatData,
  saveContentData,
  saveInterestData,
} from "../dataUtils";
import { ComponentType } from "../../types/componentType";
import { Message } from "../../types/messageType";
import { Content } from "@/hooks/useContentResponse";

type SaveDataFunction = {
  chatbox: (data: Message) => void;
  contentChat: (data: Message) => void;
  interest: (data: string[]) => void;
  content: (data: Content[]) => void;
  summarizeChat: (data: string) => void;
};

export const promptConfig: Record<
  ComponentType,
  {
    promptTemplate: string;
    contentPromptTemplate?: string;
    saveData: SaveDataFunction[ComponentType];
  }
> = {
  chatbox: {
    promptTemplate: `Answer this message text that user wrote to you with helpful attitude. "{userMessage}". Generate short but concise messages Limit response to 100 words.`,
    contentPromptTemplate: `Based on this data "{summary}" respond "{userMessage}". Limit response to 100 words.`,
    saveData: saveChatData,
  },
  interest: {
    promptTemplate: `Generate content title for provided text : "{userMessage}". Generate your response with title and one sentenced simple definiton about that title exactly as in this format: "[title, definition]".`,
    saveData: saveInterestData,
  },
  content: {
    promptTemplate: `Generate a content about the user entered this web page a lot "{userMessage}" look at the title and definition for to create interesting and short content. Limit your response to 50 words.`,
    saveData: saveContentData,
  },
  contentChat: {
    // Introduced new component type for chatbox-like prompts needing a summary
    promptTemplate: `Answer this message text that user wrote to you with helpful attitude. "{userMessage}". Generate short but concise messages Limit response to 100 words.`,
    contentPromptTemplate: `Based on this data "{summary}" respond "{userMessage}". Limit response to 100 words.`,
    saveData: saveContentChatData, // Associated with chatbox-like chat saving logic
  },
};
