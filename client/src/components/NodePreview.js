import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/nodePreview.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import gitHubSvg from "../images/github_svg.svg";
const NodePreview = ({ idea, nodeId, onClose }) => {

  return (
    <div className="node-preview container">
      <div className="row">
        <div className="col-11"></div>
        <div className="col-1">
          <button className="closePreviewButton mt-1" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div>
      <div className="row previewHeader mt-2">
        <h2 className="titleNodePreview">{idea.topic}</h2>
      </div>
      {/* <div className="row">
        <div className="col-9"></div>
        <div className="col-3">
          <p className="nodeId1">Node ID: {nodeId}</p>
        </div>
      </div> */}

      <div className="row">
        <div className="col nodeDescriptio">
          <p>{idea.description}</p>
        </div>
      </div>

      <div className="row">
        <div className="col ideaSpace_ideaSpaceHeading">
          <h3>Idea Space</h3>
        </div>
      </div>

      <div className="container">
        {idea.idea_space.map((node, nodeIndex) => (
          <div key={nodeIndex} className="secondPartOfNodePreview">
            {/* <h3>Idea Space - Node {nodeIndex + 1}</h3> */}
            <div className="row ideaTopic_nodePreview">
              <p className="tagNodePreview">{node.text}</p>
            </div>

            <div className="mt-3">
              <p className="classNameForImages">Images</p>
            </div>

            <div
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
              className="imag mt-1"
            >
              {node.images &&
                node.images.length > 0 &&
                node.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    style={{ display: "inline-block", marginRight: "3vw" }}
                    alt={`Image ${index + 1}`}
                  />
                ))}
            </div>
            <div className="mt-3">
              <p className="classNameForImages">Boards</p>
            </div>
            {node.freeboard && node.freeboard.length > 0 && (
              <div className="image-container imag mt-1">
                {node.freeboard.map((link, index) => (
                  <img
                    key={index}
                    src={link}
                    alt={`Link ${index + 1}`}
                    className="image-item"
                  />
                ))}
              </div>
            )}
            <div className="mt-3">
              <p className="classNameForImages">Graphs</p>
            </div>
            {node.graphs && node.graphs.length > 0 && (
              <div className="image-container imag mt-1">
                {node.graphs.map((graph, index) => (
                  <img
                    key={index}
                    src={graph}
                    alt={`Graph ${index + 1}`}
                    className="image-item"
                  />
                ))}
              </div>
            )}

            <div className="mt-3">
              <p className="classNameForImages">Links</p>
            </div>
            <div
              style={{
                maxHeight: "28vh",
                overflowY: "auto",
                width: "60vw",
                overflowX: "auto",
                maxWidth: "40vw",
              }}
              className="LinksNodePreview"
            >
              {node.links &&
                node.links.length > 0 &&
                node.links.map((link, index) => (
                  <div className="row">
                    <div className="col-7">
                      <a
                        className="anchorTagNodePreview"
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          marginBottom: "2vh",
                          // textDecoration: "none",
                          color: "#002D62",
                          height: "4vh",
                          overflow: "hidden",
                        }}
                      >
                        {link}
                      </a>
                    </div>
                    <div className="col-5 fiveDotsNodePreview">
                      <p className="fiveDotsNodePreview">....</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col ideaSpace_ideaSpaceHeading mt-3">
          <h3>Inspiration</h3>
        </div>
      </div>
      {idea.inspiration.map((node, nodeIndex) => (
        <div key={nodeIndex}>
          {/* <h3>Inspiration - Node {nodeIndex + 1}</h3> */}
          <div className="row ideaTopic_nodePreview">
            <p className="tagNodePreview">{node.text}</p>
          </div>

          <div className="mt-3">
            <p className="classNameForImages">Images</p>
          </div>

          {node.images && node.images.length > 0 && (
            <div
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
              className="imag mt-1"
            >
              {node.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  style={{ display: "inline-block", marginRight: "3vw" }}
                  alt={`Image ${index + 1}`}
                />
              ))}
            </div>
          )}

          <div className="mt-3">
            <p className="classNameForImages">Boards</p>
          </div>
          {node.freeboard && node.freeboard.length > 0 && (
            <div className="image-container imag mt-1">
              {node.freeboard.map((link, index) => (
                <img
                  key={index}
                  src={link}
                  alt={`Link ${index + 1}`}
                  className="image-item"
                />
              ))}
            </div>
          )}
          <div className="mt-3">
            <p className="classNameForImages">Graphs</p>
          </div>
          {node.graphs && node.graphs.length > 0 && (
            <div className="image-container imag mt-1">
              {node.graphs.map((graph, index) => (
                <img
                  key={index}
                  src={graph}
                  alt={`Graph ${index + 1}`}
                  className="image-item"
                />
              ))}
            </div>
          )}
          <div className="mt-3">
            <p className="classNameForImages">Links</p>
          </div>
          <div
            style={{
              maxHeight: "28vh",
              overflowY: "auto",
              width: "60vw",
              overflowX: "auto",
              maxWidth: "40vw",
            }}
            className="LinksNodePreview"
          >
            {node.links && node.links.length > 0 && (
              <div>
                {node.links.map((link, index) => (
                  <div className="row">
                    <div className="col-7">
                      <a
                        className="anchorTagNodePreview"
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          marginBottom: "2vh",
                          // textDecoration: "none",
                          color: "#002D62",
                          height: "4vh",
                          overflow: "hidden",
                        }}
                      >
                        {link}
                      </a>
                    </div>
                    <div className="col-5 fiveDotsNodePreview">
                      <p className="fiveDotsNodePreview">....</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="row constraintsNodePreview mt-2">
        <div className="col-6 progress_nodePreview ">
          <p>
            Progress:
            <span className="percentage_nodePreview">{idea.progress}</span>
          </p>
        </div>
        <div className="col-6 progress_nodePreview mx-5 githubnodePreview">
          {/* <span>
            <img src={gitHubSvg} alt="githubicon" />
          </span> */}
          <p>
            Github{" "}
            <a
              href={idea.github_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* {idea.github_link} */}
            </a>
          </p>
        </div>
      </div>

      {idea.additional_points.length > 0 && (
        <div className="additionInformationNodePreview mt-3">
          <div className="row">
            <div className="col ideaSpace_ideaSpaceHeading mt-3">
              <h3>Additional Points</h3>
            </div>
          </div>
          <ul>
            {idea.additional_points.map((point, index) => (
              <div className="row ideaTopic_nodePreview mt-2">
                <ul key={index}>{point}</ul>
              </div>
            ))}
          </ul>
        </div>
      )}
      {idea.guiding.length > 0 && (
        <div className="additionInformationNodePreview mt-3">
          <div className="row">
            <div className="col ideaSpace_ideaSpaceHeading mt-3">
              <h3>Guiding Questions</h3>
            </div>
          </div>
          <ul>
            {idea.guiding.map((question, index) => (
              <div className="row ideaTopic_nodePreview mt-2">
                <ul key={index}>{question}</ul>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NodePreview;