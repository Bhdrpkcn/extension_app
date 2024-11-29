/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from "../types/componentType";
import { promptConfig } from "../utils/config/promptConfig";
import { handleError } from "../utils/error/errorHandler";

let session: any = null;

export const fetchContentResponse = async (
  userMessage: string,
  component: ComponentType
): Promise<string> => {
  const { promptTemplate } = promptConfig[component];
  const prompt = promptTemplate.replace("{userMessage}", userMessage);

  try {
    if (!window.ai || !window.ai.languageModel) {
      return handleError("Gemini Nano is not available in this browser.", {
        fallbackValue: "Error: AI service unavailable.",
      });
    }

    if (!session) {
      session = await window.ai.languageModel.create({
        temperature: 0.7,
        topK: 3,
      });
    }

    const stream = await session.promptStreaming(prompt);

    let responseText = "";

    for await (const chunk of stream) {
      responseText = chunk.trim();
    }

    console.log("[fetchContentResponse] Prompt:", prompt);
    console.log("Response from CONTENTRESPONSE:", responseText);

    return responseText;
  } catch (error) {
    return handleError(error, {
      logToConsole: true,
      fallbackValue: "Error: Could not reach the AI service.",
    });
  }
};

// async function createSummarizerSession(
//   config: { type: string; format: string; length: string },
//   downloadProgressCallback: (
//     message: string,
//     progress: { loaded: number; total: number }
//   ) => void
// ) {
//   if (!window.ai || !window.ai.summarizer) {
//     throw new Error("AI Summarization is not supported in this browser.");
//   }

//   const canSummarize = await window.ai.summarizer.capabilities();
//   if (canSummarize.available === "no") {
//     throw new Error("AI Summarization is not supported");
//   }

//   const contentSession = await self.ai.summarizer.create(
//     config,
//     downloadProgressCallback
//   );

//   if (canSummarize.available === "after-download") {
//     contentSession.addEventListener(
//       "downloadprogress",
//       downloadProgressCallback
//     );
//     await contentSession.ready;
//   }

//   return contentSession;
// }
