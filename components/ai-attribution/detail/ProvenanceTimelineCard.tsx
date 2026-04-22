import React from "react";
import { ProvenanceEvent } from "../../../types/aiAttribution";

const eventColors = {
  creation: "border-blue-400",
  "ai-generation": "border-purple-400",
  edit: "border-yellow-400",
  registration: "border-green-400",
};

export const ProvenanceTimelineCard = ({ events }: { events: ProvenanceEvent[] }) => (
  <div className="rounded-2xl shadow p-5 bg-white">
    <h3 className="font-semibold text-lg mb-3">Provenance Timeline</h3>
    <div className="border-l-2 border-gray-200 pl-4">
      {events.map((event, i) => (
        <div key={i} className={`mb-6 relative`}>
          <div className={`absolute -left-5 top-1 w-3 h-3 rounded-full border-4 ${eventColors[event.type]} bg-white`}></div>
          <div className="text-xs text-gray-400 mb-1">{event.timestamp}</div>
          <div className="font-medium text-gray-700">{event.description}</div>
        </div>
      ))}
    </div>
  </div>
);