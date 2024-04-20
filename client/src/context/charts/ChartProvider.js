import React, { createContext, useState } from "react";
import ChartContext from "./ChartContext";

const ChartProvider = ({ children }) => {
  const [chart, setChart] = useState({});

  // fetch a chart
  const fetchChartById = async (linkId, boardId, chartId) => {
    const url = `http://localhost:8000/${linkId}/board/${boardId}/charts/${chartId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const json = await response.json();

    if (json) {
      return json;
    } else {
      console.log("Unable to fetch link with id : ", linkId);
    }
  };

  // create a new idea
  const createNewIdea = async (linkId, boardId, chartId, idea) => {
    const url = `http://localhost:8000/${linkId}/board/${boardId}/charts/${chartId}/createidea`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(idea),
    });

    const json = await response.json();
    console.log(json);
    if (!json.data) {
      console.log("Link not created");
      return {};
    }
    return json.data._id;
  };

  return (
    <ChartContext.Provider value={{ chart, fetchChartById, createNewIdea }}>
      {children}
    </ChartContext.Provider>
  );
};

export default ChartProvider;
