import React, { createContext, useState } from "react";
import LinkContext from "./LinkContext";

const LinkProvider = ({ children }) => {
  const [link, setLink] = useState(null);

  const updateLink = (newLink) => {
    setLink(newLink);
  };

  // join an existing link
  const joinLinkById = async (linkId) => {
    const url = `http://localhost:8000/${linkId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const json = await response.json();

    if (json) {
      console.log(json);
      updateLink(json.data);
      return json;
    } else {
      console.log("Unable to fetch link with _id : ", linkId);
    }
  };

  // create a new link
  const createLink = async () => {
    const url = `http://localhost:8000/createlink`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({}),
    });

    const json = await response.json();
    console.log(json);
    if (!json) {
      console.log("Link not created");
      return {};
    }
    return json._id;
  };

  // create a new board
  const createNewBoard = async (linkId, title, description) => {
    const url = `http://localhost:8000/${linkId}/createboard`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, users: ["h"] }),
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
    <LinkContext.Provider
      value={{ link, updateLink, createLink, joinLinkById, createNewBoard }}
    >
      {children}
    </LinkContext.Provider>
  );
};

export default LinkProvider;