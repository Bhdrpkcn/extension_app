import React, { useEffect, useState } from "react";

import "./style.scss";
import { formatHistoryItem } from "../../utils/history";

export type HistoryItem = {
  id: string;
  url: string;
  title?: string;
  lastVisitTime?: number;
  visitCount?: number;
};

const urlBlacklist = [ "https://www.youtube.com/", "https://www.google.com/", "https://www.facebook.com/",
 "https://mail.google.com/mail/u/0/#inbox", "https://www.linkedin.com/feed/", "https://web.whatsapp.com/"
];

const History: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const urlToHistoryItem: { [url: string]: HistoryItem } = {};
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    // const oneWeekAgo = Date.now() - millisecondsPerWeek;
    const oneYear = Date.now() - millisecondsPerWeek * 52;

    // Fetch history items from the last week
    chrome.history.search(
      { text: "", startTime: oneYear, maxResults: 1000 },
      (historyItems) => {
        historyItems.forEach((item) => {
          // Store each item with its details
          if(urlBlacklist.includes(item.url!)) {
            return;
          }
          urlToHistoryItem[item.url!] = {
            id: item.id,
            url: item.url!,
            title: item.title,
            lastVisitTime: item.lastVisitTime,
            visitCount: item.visitCount,
          };
        });

        // Sort by visitCount and limit to top 10
        const sortedHistoryItems = Object.values(urlToHistoryItem)
          .sort((a, b) => (b.visitCount ?? 0) - (a.visitCount ?? 0))
          .slice(0, 10);

        setHistoryItems(sortedHistoryItems);
        console.log("sortedHistoryItems", sortedHistoryItems);
        getInterestFromNano(sortedHistoryItems);
      }
    );
  }, []);

  const  getInterestFromNano = async (historyItems:HistoryItem[] ) => {

    if (!window.ai || !window.ai.languageModel) {
      console.log(`Your browser doesn't support the Prompt API. If you're on Chrome, join the <a href="https://developer.chrome.com/docs/ai/built-in#get_an_early_preview">Early Preview Program</a> to enable it.`)
      return;
    }

    const session = await window.ai.languageModel.create({
      temperature: Number(1),
      topK: Number(3),
    });
    console.log("session", session); 


    const formattedHistoryItem = historyItems.map(formatHistoryItem).join("\n");
    const prompt = `I am interested in the following URLs: \n${formattedHistoryItem} \n
     Please provide me with a topics of interest based on the URLs above in a comma separated list.`;

    console.log("prompt", prompt);
    const stream = await session.promptStreaming(prompt);

    for await (const chunk of stream) {
      const fullResponse = chunk.trim();
      console.log("fullResponse", fullResponse);
    }

  }

  return (
    <div className="history-box">
      <div className="history-box-title">
        Most Frequently Visited URLs (Last 7 Days)
      </div>
      {historyItems.map((item) => (
        <div key={item.id} className="history-item-container">
          <div className="history-item-cred">
            <a
              className="item-title"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.title || "No Title"}
            </a>
            <a className="item-url">{item.url}</a>
          </div>

          <div className="details">
            <div className="detail-item">
              <strong>Visit Count:</strong>
              <span>{item.visitCount}</span>
            </div>
            <div className="detail-item">
              <strong>Last Visit:</strong>
              <span>
                {item.lastVisitTime
                  ? new Date(item.lastVisitTime).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
