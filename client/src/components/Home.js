import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LinkContext from "../context/links/LinkContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import "../css/home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import gitHubSvg from "../images/github_svg.svg"

export const Home = (props) => {
  const { link, updateLink, createLink, joinLinkById, createNewBoard } = useContext(LinkContext);

  const history = useNavigate();

  // handle when link is created and then join link
  const handleCreateLink = async (e) => {
    // creating a new link
    e.preventDefault();
    const linkId = await createLink();
    const link = await joinLinkById(linkId);
    history(`/${linkId}`);
  };

  // handle joining link
  const handleJoinLink = async (e, linkId) => {
    e.preventDefault();
    linkId = e.target.elements.linkId.value;
    const link = await joinLinkById(linkId);
    history(`/${linkId}`);
  };

  return (
    <div>
      <div className="container">
        <div className="row mt-5">
          <div className="col-5 titleHome">
            <h1>Brain Canvas</h1>
          </div>
          <div className="col-7"></div>
        </div>
        <div className="row">
          <div className="col-7">
            <div className="headingHome mt-5">
              <h1 className="bodyTextHome">
                Unlocking Creativity, Clarifying Visions: Seamlessly Transform
                Ideas into Dynamic Concept Maps
              </h1>
            </div>
            <div className="headng2Home mt-4">
              <h3 className="bottomBodyHome">Painting Ideas into Reality.</h3>
            </div>
            <div className="row">
              <div className="col-3">
                <div className="mt-5">
                  <button onClick={handleCreateLink}>Create New Link</button>
                </div>
              </div>
              <div className="col-9 leftRightInputHome">
                <div>
                  <form
                    onSubmit={handleJoinLink}
                    className="ihavedevelopedthisclassonlytodisplayflex"
                  >
                    <div className="iconHome">
                      <FontAwesomeIcon icon={faKeyboard} className="mt-3" />
                    </div>
                    <input
                      className="inputIdHome mt-1"
                      type="text"
                      id="linkId"
                      name="linkId"
                    />
                    <div className="mx-2">
                      <button className="ButtonToSubmitHome mt-2" type="submit">
                        Join Link
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-5">
            <img src={gitHubSvg} className="rightImageOfHomeImg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};