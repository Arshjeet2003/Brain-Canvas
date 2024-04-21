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

  // Fetch an Idea using Id
  const fetchIdeaUsingId = async (linkId, boardId, chartId, ideaId) => {
    const url = `http://localhost:8000/${linkId}/board/${boardId}/charts/${chartId}/idea/${ideaId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    if (!json) {
      console.log("Link not created");
      return {};
    }
    return json;
  };

  // Update Idea using Id
  const updateIdea = async (linkId, boardId, chartId, ideaId, updatedIdea) => {
    const url = `http://localhost:8000/${linkId}/board/${boardId}/charts/${chartId}/idea/${ideaId}/updateidea`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body : JSON.stringify(updatedIdea),
    });

    const json = await response.json();
    console.log(json);
    if (!json) {
      console.log("Link not created");
      return {};
    }
    return json;
  };

  return (
    <ChartContext.Provider
      value={{
        chart,
        fetchChartById,
        createNewIdea,
        fetchIdeaUsingId,
        updateIdea,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export default ChartProvider;