import { ComponentType } from "../types/componentType";
import { promptConfig } from "../utils/config/promptConfig";
import { handleError } from "../utils/error/errorHandler";

export const fetchContentResponse = async (
  userMessage: string,
  component: ComponentType
): Promise<string> => {
  const { promptTemplate } = promptConfig[component];
  const prompt = promptTemplate.replace("{userMessage}", userMessage);

  try {
    const session = await createSummarizerSession(
      {
        type: "key-points",
        format: "plain-text",
        length: "short",
      },
      (message, progress) => {
        console.log(
          `[Progress] ${message}: ${progress.loaded}/${progress.total}`
        );
      }
    );

    const summary = await session.summarize(prompt);

    session.destroy();

    return summary;
  } catch (error) {
    return handleError(error, {
      logToConsole: true,
      fallbackValue: "An error occurred while summarizing the content.",
    });
  }
};

async function createSummarizerSession(
  config: { type: string; format: string; length: string },
  downloadProgressCallback: (
    message: string,
    progress: { loaded: number; total: number }
  ) => void
) {
  if (!window.ai || !window.ai.summarizer) {
    throw new Error("AI Summarization is not supported in this browser.");
  }

  const canSummarize = await window.ai.summarizer.capabilities();
  if (canSummarize.available === "no") {
    throw new Error("AI Summarization is not supported");
  }

  const contentSession = await self.ai.summarizer.create(
    config,
    downloadProgressCallback
  );

  if (canSummarize.available === "after-download") {
    contentSession.addEventListener(
      "downloadprogress",
      downloadProgressCallback
    );
    await contentSession.ready;
  }

  return contentSession;
}

// export const fetchContentResponse = async (
//   userMessage: string,
//   component: ComponentType
// ): Promise<string> => {
//   const { promptTemplate } = promptConfig[component];
//   const prompt = promptTemplate.replace("{userMessage}", userMessage);

//   if (typeof window === "undefined" || !window.ai || !window.ai.summarizer) {
//     console.warn(
//       "[fetchContentResponse] - AI Summarization not available. Using fallback."
//     );
//     return "AI Summarization is not supported in this browser";
//   }

//   try {
//     const session = await window.ai.summarizer.create({
//       type: "key-points",
//       format: "plain-text",
//       length: "short",
//     });

//     const summary = await session.summarize(prompt);
//     session.destroy();

//     return summary;
//   } catch (error) {
//     return handleError(error, {
//       logToConsole: true,
//       fallbackValue: "An error occurred while summarizing the content.",
//     });
//   }
// };

/**
  const {available, defaultTemperature, defaultTopK, maxTopK } =
  await chrome.aiOriginTrial.languageModel.capabilities();
if (available !== 'no') {
  const session = await chrome.aiOriginTrial.languageModel.create();
  // Prompt the model and wait for the whole result to come back.
  const result = await session.prompt('Write me a poem!');
  console.log(result);
}
*******promptStreaming() returns a ReadableStream whose chunks successively build on each other. For example, "Hello,", "Hello world,", "Hello world I am,", "Hello world I am an AI.". This isn't the intended behavior. We intend to align with other streaming APIs on the platform, where the chunks are successive pieces of a single long stream. This means the output would be a sequence like "Hello", " world", " I am", " an AI".
For now, to achieve the intended behavior, you can implement the following. This works with both the standard and the non-standard behavior.
let result = '';
let previousChunk = '';
for await (const chunk of stream) {
  const newChunk = chunk.startsWith(previousChunk)
      ? chunk.slice(previousChunk.length) : chunk;
  console.log(newChunk);
  result += newChunk;
  previousChunk = chunk;
}
console.log(result);
********Stop running a prompt
Both prompt() and promptStreaming() accept an optional second parameter with a signal field, which lets you stop running prompts.
const controller = new AbortController();
stopButton.onclick = () => controller.abort();
const result = await session.prompt(
  'Write me a poem!',
  { signal: controller.signal }
);
*******Terminate a session
Call destroy() to free resources if you no longer need a session. When a session is destroyed, it can no longer be used, and any ongoing execution is aborted. You may want to keep the session around if you intend to prompt the model often since creating a session can take some time.
await session.prompt(
  'You are a friendly, helpful assistant specialized in clothing choices.'
);
session.destroy();
// The promise is rejected with an error explaining that
// the session is destroyed.
await session.prompt(
  'What should I wear today? It is sunny and I am unsure
  between a t-shirt and a polo.'
);
*/
