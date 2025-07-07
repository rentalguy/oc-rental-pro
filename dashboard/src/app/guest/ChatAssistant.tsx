"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  sender: "guest" | "assistant";
  content: string;
  timestamp: string;
}

const initialSuggestions = [
  "What are some free or low-cost things to do nearby?",
  "Help me plan a daily budget for my trip.",
  "Recommend restaurants by price range.",
  "What are the house rules?",
  "How do I check out?",
  "Show me local attractions.",
  "How do I get to the beach?",
];

function getAssistantResponse(input: string): { content: string; suggestions?: string[] } {
  // Simple keyword-based responses; replace with real AI in production
  const lower = input.toLowerCase();
  if (lower.includes("free") || lower.includes("low-cost")) {
    return {
      content: `Here are some free & low-cost activities in Ocean City, MD:\n\n- Walk the Ocean City Boardwalk\n- Visit Northside Park\n- Watch the sunset at the bay\n- Explore local art galleries\n- Attend free summer concerts\n\nWould you like more suggestions or info on a specific activity?`,
      suggestions: [
        "Tell me about the Boardwalk.",
        "What free events are happening this week?",
        "Show me parks nearby."
      ]
    };
  }
  if (lower.includes("budget")) {
    return {
      content: `Here's a sample daily budget for Ocean City, MD:\n\n- Breakfast: $8\n- Lunch: $12\n- Dinner: $20\n- Activities: $20\n- Snacks: $5\n- Souvenirs: $10\n- Parking/Transport: $5\n**Total: $80/day**\n\nI can help you plan for different spending levels!`,
      suggestions: [
        "Plan a $50/day budget.",
        "Show me premium options.",
        "What are the best value restaurants?"
      ]
    };
  }
  if (lower.includes("restaurant")) {
    return {
      content: `Restaurant recommendations by price:\n\n**Budget:**\n- Anthony's Carryout\n- Dumser's Dairyland\n\n**Mid-range:**\n- Fish Tales\n- Malia's Cafe\n\n**Premium:**\n- The Shark on the Harbor\n- Sunset Grille\n\nLet me know your preferences or dietary needs!`,
      suggestions: [
        "Show seafood restaurants.",
        "Find family-friendly places.",
        "Any vegan options?"
      ]
    };
  }
  if (lower.includes("house rules")) {
    return {
      content: `House Rules for Morgan's Bayside Retreat:\n\n- No smoking\n- No pets\n- Quiet hours: 10pm–8am\n- Please respect neighbors\n- Check-out by 11am\n\nLet me know if you have questions about any rule!`,
      suggestions: [
        "How do I check out?",
        "Can I have visitors?",
        "What if I'm running late?"
      ]
    };
  }
  if (lower.includes("check out")) {
    return {
      content: `Check-out instructions:\n\n- Please tidy up and take out trash\n- Leave used towels in the bathroom\n- Lock all doors and windows\n- Return keys to the lockbox\n- Text your host when you leave\n\nSafe travels!`,
      suggestions: [
        "Where is the lockbox?",
        "Can I check out late?",
        "Remind me of the WiFi info."
      ]
    };
  }
  if (lower.includes("attraction") || lower.includes("thing to do")) {
    return {
      content: `Popular attractions in Ocean City:\n\n- Ocean City Boardwalk\n- Jolly Roger Amusement Park\n- Assateague Island National Seashore\n- Trimper's Rides\n- Northside Park\n\nWant details on tickets, hours, or directions?`,
      suggestions: [
        "How do I get to Assateague Island?",
        "Show me family activities.",
        "Find rainy day options."
      ]
    };
  }
  if (lower.includes("beach")) {
    return {
      content: `The nearest beach access is just a short walk from Morgan's Bayside Retreat!\n\nHead east on Coastal Highway and follow signs for public beach access.\n\nLet me know if you need directions or info on beach amenities.`,
      suggestions: [
        "Where can I rent beach chairs?",
        "What are the lifeguard hours?",
        "Show me a map."
      ]
    };
  }
  // Default response
  return {
    content: `I'm here to help with anything during your stay!\n\nTry asking about activities, dining, local tips, or property info.`,
    suggestions: initialSuggestions
  };
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    sender: "assistant",
    content: "Hi! I'm your Bayside Guest Assistant. How can I help you today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (msg: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      { sender: "guest", content: msg, timestamp: now }
    ]);
    const resp = getAssistantResponse(msg);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "assistant", content: resp.content, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setSuggestions(resp.suggestions || initialSuggestions);
    }, 600);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[400px] md:h-[500px]">
      <div className="flex-1 overflow-y-auto bg-blue-50 dark:bg-zinc-900 rounded-t-lg p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 flex ${msg.sender === "guest" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-lg shadow text-sm ${msg.sender === "guest" ? "bg-blue-600 text-white" : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100"}`}>
              <div>{msg.content.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}</div>
              <div className="text-xs text-zinc-400 mt-1 text-right">{msg.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-b-lg p-3 border-t flex flex-col gap-2">
        <div className="flex gap-2 mb-2 flex-wrap">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="px-3 py-1 rounded bg-blue-100 dark:bg-zinc-700 text-blue-700 dark:text-blue-200 text-xs hover:bg-blue-200 hover:dark:bg-zinc-600 transition"
              onClick={() => sendMessage(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <form className="flex gap-2" onSubmit={e => { e.preventDefault(); if (input.trim()) { sendMessage(input); setInput(""); } }}>
          <input
            className="flex-1 px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 focus:outline-none"
            placeholder="Type your question..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
