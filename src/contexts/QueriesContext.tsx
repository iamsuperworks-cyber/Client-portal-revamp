import React, { createContext, useContext, useState, ReactNode } from "react";

export type QueryStatus = "awaiting_client" | "awaiting_bank" | "overdue" | "resolved";

export interface Attachment {
  id: string;
  name: string;
  size?: string;
}

export interface Message {
  id: string;
  sender: "bank" | "client";
  senderName: string;
  timestamp: string;
  text: string;
  attachments?: Attachment[];
}

export interface Query {
  id: string;
  bankName: string;
  status: QueryStatus;
  stage: string;
  relatedTo?: string;
  slaDeadline: Date;
  title: string;
  messages: Message[];
}

interface QueriesContextType {
  queries: Query[];
  respondToQuery: (queryId: string, text: string, attachments: Attachment[]) => void;
  getQuery: (queryId: string) => Query | undefined;
}

const QueriesContext = createContext<QueriesContextType | undefined>(undefined);

const SEED_QUERIES: Query[] = [
  {
    id: "q1",
    bankName: "Nordea",
    status: "awaiting_client",
    stage: "Draft",
    relatedTo: "Bank Statements",
    slaDeadline: new Date(Date.now() + (2 * 24 + 4) * 60 * 60 * 1000), // 2 days 4 hours from now
    title: "Bank statement requirement",
    messages: [
      {
        id: "m1",
        sender: "bank",
        senderName: "Nordea",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        text: "Hello Rajesh, we have updated our requirements. We now require 6 months of bank statements instead of 3 months to finalize your review.",
      },
    ],
  },
  {
    id: "q2",
    bankName: "Nordea",
    status: "resolved",
    stage: "Credit queries",
    title: "Income verification",
    slaDeadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Already past
    messages: [
      {
        id: "m2",
        sender: "bank",
        senderName: "Nordea",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        text: "Hi Rajesh, could you share your last 3 months' salary slips along with an employer-stamped certificate?",
      },
      {
        id: "m3",
        sender: "client",
        senderName: "You",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        text: "Please find the slips and certificate attached.",
        attachments: [
          { id: "a1", name: "salary-jan-2025.pdf", size: "1.2 MB" },
          { id: "a2", name: "salary-feb-2025.pdf", size: "1.1 MB" },
          { id: "a3", name: "employer-cert.pdf", size: "850 KB" },
        ],
      },
      {
        id: "m4",
        sender: "bank",
        senderName: "Nordea",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        text: "Thanks, all received and verified. Query resolved.",
      },
    ],
  },
  {
    id: "q3",
    bankName: "Nordea",
    status: "resolved",
    stage: "Credit queries",
    title: "Property tenure clarification",
    slaDeadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: "m5",
        sender: "bank",
        senderName: "Nordea",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        text: "Could you clarify the remaining tenure on the current master lease agreement for this property?",
      },
      {
        id: "m6",
        sender: "client",
        senderName: "You",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        text: "The remaining tenure is 92 years. I've confirmed this with the developer's legal team.",
      },
      {
        id: "m7",
        sender: "bank",
        senderName: "Nordea",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        text: "Resolution received. We will proceed with this information.",
      },
    ],
  },
];

export const QueriesProvider = ({ children }: { children: ReactNode }) => {
  const [queries, setQueries] = useState<Query[]>(SEED_QUERIES);

  const respondToQuery = (queryId: string, text: string, attachments: Attachment[]) => {
    setQueries((prev) =>
      prev.map((q) => {
        if (q.id === queryId) {
          const newMessage: Message = {
            id: Math.random().toString(36).substr(2, 9),
            sender: "client",
            senderName: "You",
            timestamp: new Date().toISOString(),
            text,
            attachments: attachments.length > 0 ? attachments : undefined,
          };
          return {
            ...q,
            status: "awaiting_bank",
            messages: [...q.messages, newMessage],
          };
        }
        return q;
      })
    );
  };

  const getQuery = (queryId: string) => queries.find((q) => q.id === queryId);

  return (
    <QueriesContext.Provider value={{ queries, respondToQuery, getQuery }}>
      {children}
    </QueriesContext.Provider>
  );
};

export const useQueries = () => {
  const context = useContext(QueriesContext);
  if (context === undefined) {
    throw new Error("useQueries must be used within a QueriesProvider");
  }
  return context;
};
