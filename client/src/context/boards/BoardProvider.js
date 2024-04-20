import React, { createContext, useState } from "react";
import BoardContext from "./BoardContext";

const BoardProvider = ({ children }) => {
  const [board, setBoard] = useState(null);

  // fetch a board....
  const fetchBoardById = async (linkId, boardId) => {
    const url = `http://localhost:8000/${linkId}/board/${boardId}`;
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

  // create a new chart
  const createNewChart = async (linkId, boardId, title, description) => {
    const url = `http://localhost:8000/${linkId}/board/${boardId}/createchart`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description }),
    });

    const json = await response.json();
    if (!json.data) {
      console.log("Link not created");
      return {};
    }
    return json.data._id;
  };

  return (
    <BoardContext.Provider value={{ board, fetchBoardById, createNewChart }}>
      {children}
    </BoardContext.Provider>
  );
};

export default BoardProvider;
