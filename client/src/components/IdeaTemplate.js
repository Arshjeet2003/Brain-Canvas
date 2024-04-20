import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/ideaTemplete.css";
import ChartContext from "../context/charts/ChartContext.js";
import { useParams, useNavigate } from "react-router-dom";

export const IdeaTemplate = () => {
  const { createNewIdea } = useContext(ChartContext);
  const { linkId, boardId, chartId } = useParams();
  const navigate = useNavigate();

  const [idea, setIdea] = useState({
    topic: "",
    description: "",
    idea_space: [
      { text: "", images: [], freeboard: [], graphs: [], links: [] },
    ],
    inspiration: [
      { text: "", images: [], freeboard: [], graphs: [], links: [] },
    ],
    cons: { time: "", budget: "" },
    progress: "",
    github_link: "",
    guiding: [],
    comments: {},
    likes: "",
    additional_points: [],
    prevNodes: [],
  });

  const [tempGuiding, setTempGuiding] = useState("");
  const [tempAdditional, setTempAdditional] = useState("");
  const [tempPrevNodes, setTempPrevNodes] = useState("");

  const [tempIdeaSpace, setTempIdeaSpace] = useState({
    text: "",
    links: [],
    images: [],
    boards: [],
    graphs: [],
  });

  const [tempInspiration, setTempInspiration] = useState({
    text: "",
    images: [],
    boards: [],
    graphs: [],
    links: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIdea((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleConsChange = (e) => {
    const { name, value } = e.target;
    setIdea((prevState) => ({
      ...prevState,
      cons: {
        ...prevState.cons,
        [name]: value,
      },
    }));
  };

  const handleGuidingChange = (e) => {
    setTempGuiding(e.target.value);
  };

  const handleAddGuidingPoint = () => {
    if (tempGuiding.trim() !== "") {
      setIdea((prevIdea) => ({
        ...prevIdea,
        guiding: [...prevIdea.guiding, tempGuiding.trim()],
      }));
      setTempGuiding("");
    }
  };

  const handleRemoveGuidingPoint = (index) => {
    const updatedGuiding = [...idea.guiding];
    updatedGuiding.splice(index, 1);
    setIdea((prevIdea) => ({
      ...prevIdea,
      guiding: updatedGuiding,
    }));
  };

  const handleAdditionalChange = (e) => {
    setTempAdditional(e.target.value);
  };

  const handleAddAdditionalPoint = () => {
    if (tempAdditional.trim() !== "") {
      setIdea((prevIdea) => ({
        ...prevIdea,
        additional_points: [
          ...prevIdea.additional_points,
          tempAdditional.trim(),
        ],
      }));
      setTempAdditional("");
    }
  };

  const handleRemoveAdditionalPoint = (index) => {
    const updatedAdditional = [...idea.additional_points];
    updatedAdditional.splice(index, 1);
    setIdea((prevIdea) => ({
      ...prevIdea,
      additional_points: updatedAdditional,
    }));
  };

  const handlePrevNodesChange = (e) => {
    setTempPrevNodes(e.target.value);
  };

  const handleAddPrevNodesPoint = () => {
    if (tempPrevNodes.trim() !== "") {
      setIdea((prevIdea) => ({
        ...prevIdea,
        prevNodes: [...prevIdea.prevNodes, tempPrevNodes.trim()],
      }));
      setTempPrevNodes("");
    }
  };

  const handleRemovePrevNodesPoint = (index) => {
    const updatedPrevNodes = [...idea.prevNodes];
    updatedPrevNodes.splice(index, 1);
    setIdea((prevIdea) => ({
      ...prevIdea,
      prevNodes: updatedPrevNodes,
    }));
  };

  const handleIdeaSpaceTextChange = (e) => {
    setTempIdeaSpace((prevTemp) => ({
      ...prevTemp,
      text: e.target.value,
    }));
  };

  const [functionCompletionCount, setFunctionCompletionCount] = useState(0);

  let files = [];

  useEffect(() => {
    console.log("Loaded Idea.js");
    submitMultipleImages();
  }, [functionCompletionCount]);

  const submitMultipleImages = async () => {
    const urls = [];
    const uploadPromises = files.map(async (file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "yke8m9yw");
      data.append("cloud_name", "dwxjmhke8");
      const url = "https://api.cloudinary.com/v1_1/dwxjmhke8/image/upload";
      return fetch(url, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          urls.push(data.url);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          return null;
        });
    });
    return urls;
  };

  const handleAddIdeaSpacePoint = async () => {
    if (tempIdeaSpace.text.trim() !== "") {
      const boardUrls = [],
        imageUrls = [],
        graphUrls = [];
      if (tempIdeaSpace.images.length > 0) {
        files = tempIdeaSpace.images;
        tempIdeaSpace.images = await submitMultipleImages(files);
      }
      if (tempIdeaSpace.boards.length > 0) {
        files = tempIdeaSpace.boards;
        tempIdeaSpace.boards = await submitMultipleImages(files);
      }
      if (tempIdeaSpace.graphs.length > 0) {
        files = tempIdeaSpace.graphs;
        tempIdeaSpace.graphs = await submitMultipleImages(files);
      }
      // console.log(tempIdeaSpace.boards);
      // console.log(tempIdeaSpace.graphs);
      // console.log(tempIdeaSpace.images);
      setIdea((prevIdea) => ({
        ...prevIdea,
        idea_space: [...prevIdea.idea_space, tempIdeaSpace],
      }));
      setTempIdeaSpace({
        text: "",
        links: [],
        images: [],
        boards: [],
        graphs: [],
      });
      setFunctionCompletionCount((prevCount) => prevCount + 1);
    }
  };

  const handleRemoveIdeaSpacePoint = (index) => {
    const updatedIdeaSpace = [...idea.idea_space];
    updatedIdeaSpace.splice(index, 1);
    setIdea((prevIdea) => ({
      ...prevIdea,
      idea_space: updatedIdeaSpace,
    }));
  };

  const handleLinkInputChange = (e, index) => {
    const { value } = e.target;
    setTempIdeaSpace((prevTemp) => {
      const updatedLinks = [...prevTemp.links];
      updatedLinks[index] = value;
      return {
        ...prevTemp,
        links: updatedLinks,
      };
    });
  };

  const handleImageInputChange = (e, index) => {
    const file = e.target.files[0];
    setTempIdeaSpace((prevTemp) => {
      const updatedImages = [...prevTemp.images];
      updatedImages[index] = file;
      return {
        ...prevTemp,
        images: updatedImages,
      };
    });
  };

  const handleBoardInputChange = (e, index) => {
    const file = e.target.files[0];
    setTempIdeaSpace((prevTemp) => {
      const updatedBoards = [...prevTemp.boards];
      updatedBoards[index] = file;
      return {
        ...prevTemp,
        boards: updatedBoards,
      };
    });
  };

  const handleGraphInputChange = (e, index) => {
    const file = e.target.files[0];
    setTempIdeaSpace((prevTemp) => {
      const updatedGraphs = [...prevTemp.graphs];
      updatedGraphs[index] = file;
      return {
        ...prevTemp,
        graphs: updatedGraphs,
      };
    });
  };

  const handleRemoveLink = (index) => {
    setTempIdeaSpace((prevTemp) => {
      const updatedLinks = [...prevTemp.links];
      updatedLinks.splice(index, 1);
      return {
        ...prevTemp,
        links: updatedLinks,
      };
    });
  };

  const handleRemoveImage = (index) => {
    setTempIdeaSpace((prevTemp) => {
      const updatedImages = [...prevTemp.images];
      updatedImages.splice(index, 1);
      return {
        ...prevTemp,
        images: updatedImages,
      };
    });
  };

  const handleRemoveBoard = (index) => {
    setTempIdeaSpace((prevTemp) => {
      const updatedBoards = [...prevTemp.boards];
      updatedBoards.splice(index, 1);
      return {
        ...prevTemp,
        boards: updatedBoards,
      };
    });
  };

  const handleRemoveGraph = (index) => {
    setTempIdeaSpace((prevTemp) => {
      const updatedGraphs = [...prevTemp.graphs];
      updatedGraphs.splice(index, 1);
      return {
        ...prevTemp,
        graphs: updatedGraphs,
      };
    });
  };

  const handleInspirationTextChange = (e) => {
    setTempInspiration((prevTemp) => ({
      ...prevTemp,
      text: e.target.value,
    }));
  };

  const handleAddInspirationPoint = async () => {
    if (tempInspiration.text.trim() !== "") {
      const boardUrls = [],
        imageUrls = [],
        graphUrls = [];
      // console.log(tempInspiration.graphs);
      if (tempInspiration.images.length > 0) {
        tempInspiration.images = await submitMultipleImages(
          tempInspiration.images
        );
      }
      if (tempInspiration.boards.length > 0) {
        tempInspiration.boards = await submitMultipleImages(
          tempInspiration.boards
        );
      }
      if (tempInspiration.graphs.length > 0) {
        tempInspiration.graphs = await submitMultipleImages(
          tempInspiration.graphs
        );
      }
      // console.log(tempInspiration.boards);
      // console.log(tempInspiration.graphs);
      // console.log(tempInspiration.images);

      setIdea((prevIdea) => ({
        ...prevIdea,
        inspiration: [...prevIdea.inspiration, tempInspiration],
      }));
      setTempInspiration({
        text: "",
        links: [],
        images: [],
        boards: [],
        graphs: [],
      });
      setFunctionCompletionCount((prevCount) => prevCount + 1);
    }
  };

  const handleRemoveInspirationPoint = (index) => {
    const updatedInspiration = [...idea.inspiration];
    updatedInspiration.splice(index, 1);
    setIdea((prevIdea) => ({
      ...prevIdea,
      inspiration: updatedInspiration,
    }));
  };

  const handleLinkInputChangeInspiration = (e, index) => {
    const { value } = e.target;
    setTempInspiration((prevTemp) => {
      const updatedLinks = [...prevTemp.links];
      updatedLinks[index] = value;
      return {
        ...prevTemp,
        links: updatedLinks,
      };
    });
  };

  const handleImageInputChangeInspiration = (e, index) => {
    const file = e.target.files[0];
    setTempInspiration((prevTemp) => {
      const updatedImages = [...prevTemp.images];
      updatedImages[index] = file;
      // console.log(file);
      return {
        ...prevTemp,
        images: updatedImages,
      };
    });
  };

  const handleBoardInputChangeInspiration = (e, index) => {
    const file = e.target.files[0];
    setTempInspiration((prevTemp) => {
      const updatedBoards = [...prevTemp.boards];
      updatedBoards[index] = file;
      return {
        ...prevTemp,
        boards: updatedBoards,
      };
    });
  };

  const handleGraphInputChangeInspiration = (e, index) => {
    const file = e.target.files[0];
    setTempInspiration((prevTemp) => {
      const updatedGraphs = [...prevTemp.graphs];
      updatedGraphs[index] = file;
      // console.log(file);
      return {
        ...prevTemp,
        graphs: updatedGraphs,
      };
    });
  };

  const handleRemoveLinkInspiration = (index) => {
    setTempInspiration((prevTemp) => {
      const updatedLinks = [...prevTemp.links];
      updatedLinks.splice(index, 1);
      return {
        ...prevTemp,
        links: updatedLinks,
      };
    });
  };

  const handleRemoveImageInspiration = (index) => {
    setTempInspiration((prevTemp) => {
      const updatedImages = [...prevTemp.images];
      updatedImages.splice(index, 1);
      return {
        ...prevTemp,
        images: updatedImages,
      };
    });
  };

  const handleRemoveBoardInspiration = (index) => {
    setTempInspiration((prevTemp) => {
      const updatedBoards = [...prevTemp.boards];
      updatedBoards.splice(index, 1);
      return {
        ...prevTemp,
        boards: updatedBoards,
      };
    });
  };

  const handleRemoveGraphInspiration = (index) => {
    setTempInspiration((prevTemp) => {
      const updatedGraphs = [...prevTemp.graphs];
      updatedGraphs.splice(index, 1);
      return {
        ...prevTemp,
        graphs: updatedGraphs,
      };
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    console.log(idea);
    const response = await createNewIdea(linkId, boardId, chartId, idea);
    console.log(response);

    setIdea({
      topic: "",
      description: "",
      idea_space: [
        {
          text: "",
          images: [],
          board: [],
          graphs: [],
          links: [],
        },
      ],
      inspiration: [
        {
          text: "",
          images: [],
          board: [],
          graphs: [],
          links: [],
        },
      ],
      cons: { time: "", budget: "" },
      progress: "",
      github_link: "",
      guiding: [],
      comments: {},
      likes: "",
      additional_points: [],
      prevNodes: [],
    });
  };

  return (
    <div>
      {/* */}
      <div className="container-fluid mainBodyOfTemplete">
        <div className="row">
          <div className="col-6 leftTemplete">
            <div className="row mt-3 ideaTempleteHeading">
              <strong>
                <h1>Idea Template</h1>
              </strong>
            </div>
            <div className="row mt-3">
              <div className="col-2 ideaTempleteSection2">
                <label>Topic</label>
              </div>
              <div className="col-10">
                <input
                  type="text"
                  name="topic"
                  value={idea.topic}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-2 ideaTempleteSection3">
                <label>Description</label>
              </div>
              <div className="col-10">
                <textarea
                  name="description"
                  value={idea.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="row mt-2 part2OfTemplete">
              <h3>Idea Space</h3>
              <div className="">
                {idea.idea_space.map((point, index) => (
                  <div key={index}>
                    <p>Text: {point.text}</p>
                    {/*  ******************/}
                    {point.images && point.images.length > 0 && (
                      <div>
                        <h4>Images:</h4>
                        {point.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Image ${index + 1}`}
                            style={{
                              marginRight: "10px",
                              width: "100px",
                              height: "100px",
                            }} // Set width and height as needed
                          />
                        ))}
                      </div>
                    )}
                    {point.freeboard && point.freeboard.length > 0 && (
                      <div>
                        <h4>Freeboard:</h4>
                        {point.freeboard.map((link, index) => (
                          <img
                            key={index}
                            src={link}
                            alt={`Board ${index + 1}`}
                            style={{
                              marginRight: "10px",
                              width: "100px",
                              height: "100px",
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {point.graphs && point.graphs.length > 0 && (
                      <div>
                        <h4>Graphs:</h4>
                        {point.graphs.map((graph, index) => (
                          <img
                            key={index}
                            src={graph}
                            alt={`Graph ${index + 1}`}
                            style={{
                              marginRight: "10px",
                              width: "100px",
                              height: "100px",
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {point.links && point.links.length > 0 && (
                      <div>
                        <h4>Links:</h4>
                        {point.links.map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginRight: "10px" }}
                          >
                            Link {index + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="ideaSpaceOfTemplete mx-1 mt-3">
                <textarea
                  type="text"
                  value={tempIdeaSpace.text}
                  onChange={handleIdeaSpaceTextChange}
                  placeholder="Enter Idea Point Text"
                />
                <button
                  onClick={handleAddIdeaSpacePoint}
                  className="addButtonLeft"
                >
                  <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff" }} />
                </button>
              </div>
              <div>
                <div className="imageContainerofIdeaSpace">
                  {tempIdeaSpace.images.map((image, index) => (
                    <div key={index}>
                      <input
                        type="file"
                        onChange={(e) => handleImageInputChange(e, index)}
                      />
                      <div className="removeButton">
                        <button onClick={() => handleRemoveImage(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setTempIdeaSpace((prevTemp) => ({
                        ...prevTemp,
                        images: [...prevTemp.images, ""],
                      }))
                    }
                  >
                    Add Image
                  </button>
                </div>
                <div className="linkContainerofIdeaSpace mt-2">
                  {tempIdeaSpace.links.map((link, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={link}
                        onChange={(e) => handleLinkInputChange(e, index)}
                      />
                      <div className="removeButton mt-2">
                        <button onClick={() => handleRemoveLink(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setTempIdeaSpace((prevTemp) => ({
                        ...prevTemp,
                        links: [...prevTemp.links, ""],
                      }))
                    }
                  >
                    Add Link
                  </button>
                </div>

                <div className="boardsContainerofIdeaSpace mt-2">
                  {tempIdeaSpace.boards.map((board, index) => (
                    <div key={index}>
                      <input
                        type="file"
                        onChange={(e) => handleBoardInputChange(e, index)}
                      />
                      <div className="removeButton">
                        <button onClick={() => handleRemoveBoard(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setTempIdeaSpace((prevTemp) => ({
                        ...prevTemp,
                        boards: [...prevTemp.boards, ""],
                      }))
                    }
                  >
                    Add Board
                  </button>
                </div>
                <div className="GraphContainerofIdeaSpace mt-2">
                  {tempIdeaSpace.graphs.map((graph, index) => (
                    <div key={index}>
                      <input
                        type="file"
                        onChange={(e) => handleGraphInputChange(e, index)}
                      />
                      <div className="removeButton mt-2">
                        <button onClick={() => handleRemoveGraph(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setTempIdeaSpace((prevTemp) => ({
                        ...prevTemp,
                        graphs: [...prevTemp.graphs, ""],
                      }))
                    }
                  >
                    Add Graph
                  </button>
                </div>
                <div className="buttonToAddIdeaPoint mt-2">
                  {/* <button onClick={handleAddIdeaSpacePoint}>
 Add Idea Point
 </button> */}
                </div>
              </div>
            </div>

            <div className="row mt-4 part2OfTemplete">
              <h3>Inspiration Space</h3>
              <div className="">
                {idea.inspiration.map((point, index) => (
                  <div key={index}>
                    <h3>Inspiration - point {index + 1}</h3>
                    <p>Text: {point.text}</p>
                    {point.images && point.images.length > 0 && (
                      <div>
                        <h4>Images:</h4>
                        {point.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Image ${index + 1}`}
                            style={{
                              marginRight: "10px",
                              width: "100px",
                              height: "100px",
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {point.freeboard && point.freeboard.length > 0 && (
                      <div>
                        <h4>Freeboard:</h4>
                        {point.freeboard.map((board, index) => (
                          <img
                            key={index}
                            src={board}
                            alt={`Board ${index + 1}`}
                            style={{
                              marginRight: "10px",
                              width: "100px",
                              height: "100px",
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {point.graphs && point.graphs.length > 0 && (
                      <div>
                        <h4>Graphs:</h4>
                        {point.graphs.map((graph, index) => (
                          <img
                            key={index}
                            src={graph}
                            alt={`Graph ${index + 1}`}
                            style={{
                              marginRight: "10px",
                              width: "100px",
                              height: "100px",
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {point.links && point.links.length > 0 && (
                      <div>
                        <h4>Links:</h4>
                        {point.links.map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginRight: "10px" }}
                          >
                            Link {index + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="ideaSpaceOfTemplete mx-1 mt-3">
                <textarea
                  type="text"
                  value={tempInspiration.text}
                  onChange={handleInspirationTextChange}
                  placeholder="Enter Inspiration Point Text"
                />
                <button
                  onClick={handleAddInspirationPoint}
                  className="addButtonLeft"
                >
                  <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff" }} />
                </button>
              </div>
              <div>
                <div>
                  {tempInspiration.links.map((link, index) => (
                    <div key={index} className="mt-2">
                      <input
                        type="text"
                        value={link}
                        onChange={(e) =>
                          handleLinkInputChangeInspiration(e, index)
                        }
                      />
                      <button
                        className="mt-2"
                        onClick={() => handleRemoveLinkInspiration(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    className="mt-2"
                    onClick={() =>
                      setTempInspiration((prevTemp) => ({
                        ...prevTemp,
                        links: [...prevTemp.links, ""],
                      }))
                    }
                  >
                    Add Link
                  </button>
                </div>
                <div>
                  {tempInspiration.images.map((image, index) => (
                    <div key={index}>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleImageInputChangeInspiration(e, index)
                        }
                      />
                      <button
                        className="mt-2"
                        onClick={() => handleRemoveImageInspiration(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    className="mt-2"
                    onClick={() =>
                      setTempInspiration((prevTemp) => ({
                        ...prevTemp,
                        images: [...prevTemp.images, ""],
                      }))
                    }
                  >
                    Add Image
                  </button>
                </div>
                <div>
                  {tempInspiration.boards.map((board, index) => (
                    <div key={index}>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleBoardInputChangeInspiration(e, index)
                        }
                      />
                      <button
                        className="mt-2"
                        onClick={() => handleRemoveBoardInspiration(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    className="mt-2"
                    onClick={() =>
                      setTempInspiration((prevTemp) => ({
                        ...prevTemp,
                        boards: [...prevTemp.boards, ""],
                      }))
                    }
                  >
                    Add Board
                  </button>
                </div>
                <div>
                  {tempInspiration.graphs.map((graph, index) => (
                    <div key={index}>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleGraphInputChangeInspiration(e, index)
                        }
                      />
                      <button
                        className="mt-2"
                        onClick={() => handleRemoveGraphInspiration(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    className="mt-2"
                    onClick={() =>
                      setTempInspiration((prevTemp) => ({
                        ...prevTemp,
                        graphs: [...prevTemp.graphs, ""],
                      }))
                    }
                  >
                    Add Graph
                  </button>
                </div>
              </div>
            </div>

            <div className="row mt-4 part2OfTemplete">
              <h3>Previous Nodes</h3>
              {idea.prevNodes.map((point, index) => (
                <div key={index}>
                  <p>{point}</p>
                  <button onClick={() => handleRemovePrevNodesPoint(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <div>
                <input
                  className="inputForPreviousNodes"
                  type="text"
                  value={tempPrevNodes}
                  onChange={handlePrevNodesChange}
                  placeholder="Enter Previous Nodes"
                />

                <button onClick={handleAddPrevNodesPoint}>
                  Add Previous Nodes
                </button>
              </div>
            </div>
          </div>
          <div className="col-5 rightTemplete">
            <div className="row mt-5"></div>
            <div className="row mt-5">
              <div className="progressRight">
                <label>
                  <strong className="rightElement">Progress</strong>
                </label>
                <input
                  className="inputForProgress"
                  type="text"
                  name="progress"
                  value={idea.progress}
                  onChange={handleChange}
                />
              </div>
              <div className="githubRight mt-3">
                <label>
                  <strong className="rightElement">Github Link</strong>
                  <input
                    type="text"
                    name="github_link"
                    value={idea.github_link}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="row mt-3 guidingPointsDiv">
                <h3 className="guidingPointsh3">
                  <strong>Guiding Points</strong>
                </h3>
                {idea.guiding.map((point, index) => (
                  <div
                    key={index}
                    className="tagsContainerForGuidingPoint mt-2"
                  >
                    <p className="savedPoints">{point}</p>
                    <button
                      className=""
                      onClick={() => handleRemoveGuidingPoint(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
                <div className="textAreaforGuidingPoints mt-3">
                  <textarea
                    type="text"
                    value={tempGuiding}
                    onChange={handleGuidingChange}
                    placeholder="Enter Guiding Point"
                  />
                  <button
                    onClick={handleAddGuidingPoint}
                    className="submitButtonForGuidingPoint"
                  >
                    Add Guiding Point
                  </button>
                </div>
              </div>
              <div className="row mt-3 guidingPointsDiv">
                <h3 className="guidingPointsh3">
                  {" "}
                  <strong>Additional Points</strong>
                </h3>
                {idea.additional_points.map((point, index) => (
                  <div
                    key={index}
                    className="tagsContainerForGuidingPoint mt-2"
                  >
                    <p className="savedPoints">{point}</p>
                    <button onClick={() => handleRemoveAdditionalPoint(index)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
                <div>
                  <div className="textAreaforGuidingPoints mt-3">
                    <textarea
                      type="text"
                      value={tempAdditional}
                      onChange={handleAdditionalChange}
                      placeholder="Enter Additional Point"
                    />

                    <button
                      onClick={handleAddAdditionalPoint}
                      className="submitButtonForAdditionalPoint"
                    >
                      Add Additional Point
                    </button>
                  </div>
                </div>
              </div>
              <div className="row mt-3 guidingPointsDiv">
                <h3 className="guidingPointsh3">
                  <strong>Constraints</strong>
                </h3>
                <label className="labelForConstraints">
                  <strong>Time</strong>
                  <input
                    className="mx-4"
                    type="text"
                    name="time"
                    value={idea.cons.time}
                    onChange={handleConsChange}
                  />
                </label>
                <br />
                <label className="labelForConstraints mt-3">
                  <strong>Budget</strong>
                  <input
                    type="text"
                    name="budget"
                    value={idea.cons.budget}
                    onChange={handleConsChange}
                  />
                </label>
              </div>
            </div>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};