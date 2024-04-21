import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faImage,
  faLink,
  faChessBoard,
  faDiagramProject,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/ideaTemplete.css";
import ChartContext from "../context/charts/ChartContext.js";
import { useParams, useNavigate } from "react-router-dom";
import { Graph } from "react-d3-graph";
import dagre from "dagre";

export const IdeaTemplate = () => {
  const { linkId, boardId, chartId, ideaId } = useParams();
  const navigate = useNavigate();
  const { chart, fetchChartById, createNewIdea, updateIdea } = useContext(ChartContext);

  const [ideas, setIdeas] = useState([]);
  const [ideaLoaded, setIdeaLoaded] = useState(false);

  const [idea, setIdea] = useState({
    topic: "",
    description: "",
    idea_space: [{ text: "", images: [], board: [], graphs: [], links: [] }],
    inspiration: [{ text: "", images: [], board: [], graphs: [], links: [] }],
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
    board: [],
    graphs: [],
  });

  const [tempInspiration, setTempInspiration] = useState({
    text: "",
    images: [],
    board: [],
    graphs: [],
    links: [],
  });

  const [graphData, setGraphData] = useState({
    nodes: [],
    links: [],
  });

  const [color, setColor] = useState("#E97451");

  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChartById(linkId, boardId, chartId);
        const chartIdeas = await response.data.ideas;
        setChartData(response.data);
        setIdeas(chartIdeas);
        console.log(chartIdeas)
        if(ideaId !== undefined){
          const childIdea = chartIdeas.find((idea) => idea._id === ideaId);
          if(childIdea!==undefined)
            setIdea(childIdea);
        }
        setIdeaLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      // console.log(ideas)
      setGraphData({ nodes: [], links: [] });
      try {
        const adjacencyList = {};

        // Populate the adjacency list
        ideas.length && ideas.forEach((ideaVal) => {
          adjacencyList[ideaVal.topic] = [];
          if (ideaVal.prevNodes.length == 0) {
            const maxLikes = 20;
            const darknessFactor = Math.min(ideaVal.likes / maxLikes, 1);
            const darkenedColor = darkenColor(color, darknessFactor);
            setGraphData((prevState) => ({
              ...prevState,
              nodes: [
                ...prevState.nodes,
                { id: ideaVal.topic, color: darkenedColor, x: 100, y: 250 },
              ],
            }));
          }
          ideaVal.prevNodes.length > 0 &&
            ideaVal.prevNodes.forEach((child) => {
              adjacencyList[child].push(ideaVal.topic);
            });
        });

        // Traverse the keys of the adjacency list and add child nodes and create links
        Object.keys(adjacencyList).forEach((parent) => {
          addChildNodesAndCreateLinks(parent, adjacencyList[parent]);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const rgbToHex = (r, g, b) => {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const hexToRgb = (color) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const hexColor = color.replace(shorthandRegex, (m, r, g, b) => {
        return r + r + g + g + b + b;
      });
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    // Function to darken a color based on a darkness factor
    const darkenColor = (color, darknessFactor) => {
      // Convert the color to RGB format
      const rgbColor = hexToRgb(color);

      // Darken each RGB component based on the darkness factor
      const darkenedR = Math.round(rgbColor.r * (1 - darknessFactor));
      const darkenedG = Math.round(rgbColor.g * (1 - darknessFactor));
      const darkenedB = Math.round(rgbColor.b * (1 - darknessFactor));

      // Convert the darkened RGB components back to hex format
      const darkenedHexColor = rgbToHex(darkenedR, darkenedG, darkenedB);

      return darkenedHexColor;
    };

    const addChildNodesAndCreateLinks = (parent, children) => {
      const childNodesToAdd = [];
      const linksToAdd = [];

      children.forEach((childId) => {
        // Find the child idea in the ideas array
        const childIdea = ideas.find((idea) => idea.topic === childId);

        if (!graphData.nodes.some((node) => node.id === childId) && childIdea) {
          // Calculate the color based on the number of likes
          const maxLikes = 20;
          const darknessFactor = Math.min(childIdea.likes / maxLikes, 1);
          const darkenedColor = darkenColor(color, darknessFactor);

          const childNode = { id: childId, color: darkenedColor, x: 0, y: 250 }; // Adjust y position as needed
          childNodesToAdd.push(childNode);
        }

        const linkExists = graphData.links.some(
          (link) => link.source === parent && link.target === childId
        );
        if (!linkExists) {
          linksToAdd.push({ source: parent, target: childId });
        }
      });

      if (childNodesToAdd.length > 0 || linksToAdd.length > 0) {
        setGraphData((prevState) => ({
          ...prevState,
          nodes: [...prevState.nodes, ...childNodesToAdd],
          links: [...prevState.links, ...linksToAdd],
        }));
        console.log(graphData);
      }
    };

    fetchData();
  }, [boardId, linkId, chartId, ideaLoaded]);

  const [clickedNode, setClickedNode] = useState(null);

  const onClickNode = (ideaId2) => {
    // Find the child idea corresponding to the clicked node
    const childIdea = ideas.find((idea) => idea.topic === ideaId2);
  
    if (childIdea) {
      // Create a copy of the child idea to avoid mutating the original state
      const updatedIdea = { ...idea };
  
      // Update the parents array of the child idea to include the ID of the clicked node
      updatedIdea.prevNodes = [...updatedIdea.prevNodes, childIdea.topic];
  
      // Update the state with the modified child idea
      setIdea(updatedIdea);
      console.log(updatedIdea);
    }
  };
  

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
    // console.log("Loaded Idea.js");
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
      if (tempIdeaSpace.board.length > 0) {
        files = tempIdeaSpace.board;
        tempIdeaSpace.board = await submitMultipleImages(files);
      }
      if (tempIdeaSpace.graphs.length > 0) {
        files = tempIdeaSpace.graphs;
        tempIdeaSpace.graphs = await submitMultipleImages(files);
      }
      setIdea((prevIdea) => ({
        ...prevIdea,
        idea_space: [...prevIdea.idea_space, tempIdeaSpace],
      }));
      setTempIdeaSpace({
        text: "",
        links: [],
        images: [],
        board: [],
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
      const updatedBoards = [...prevTemp.board];
      updatedBoards[index] = file;
      return {
        ...prevTemp,
        board: updatedBoards,
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
      const updatedBoards = [...prevTemp.board];
      updatedBoards.splice(index, 1);
      return {
        ...prevTemp,
        board: updatedBoards,
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
      if (tempInspiration.board.length > 0) {
        tempInspiration.board = await submitMultipleImages(
          tempInspiration.board
        );
      }
      if (tempInspiration.graphs.length > 0) {
        tempInspiration.graphs = await submitMultipleImages(
          tempInspiration.graphs
        );
      }
      // console.log(tempInspiration.board);
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
        board: [],
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
      return {
        ...prevTemp,
        images: updatedImages,
      };
    });
  };

  const handleBoardInputChangeInspiration = (e, index) => {
    const file = e.target.files[0];
    setTempInspiration((prevTemp) => {
      const updatedBoards = [...prevTemp.board];
      updatedBoards[index] = file;
      return {
        ...prevTemp,
        board: updatedBoards,
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
      const updatedBoards = [...prevTemp.board];
      updatedBoards.splice(index, 1);
      return {
        ...prevTemp,
        board: updatedBoards,
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

  const handleSubmit = async (e) => {
    console.log(idea)
    e.preventDefault();

    if(ideaId===undefined){
      const response = await createNewIdea(linkId, boardId, chartId, idea);
      navigate(`/${linkId}/board/${boardId}/charts/${chartId}`);
    }
    else{
      const response2 = await updateIdea(linkId,boardId,chartId,ideaId,idea)
      navigate(`/${linkId}/board/${boardId}/charts/${chartId}`); 
    }

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
    <>
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
                  <div key={index} className="">
                    <div className="thisisNamanSinghHere">
                      {point.text && point.text.length > 0 && (
                        <div className="preStoredIdeaIdeaTemplete  mt-4 mx-2">
                          <p className="textforStoredText savedPoint">
                            {point.text}
                          </p>
                        </div>
                      )}
                    </div>

                    {/*  ******************/}

                    {point.images && point.images.length > 0 && (
                      <div className="titleGraphIdeaTemplete mt-3">
                        <h4 className="titleLeftIdeaTemplete">Images</h4>
                      </div>
                    )}
                    {point.images && point.images.length > 0 && (
                      <div className="PreStoredGraphIdeaTemplete">
                        {point.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Image ${index + 1}`}
                            style={{
                              marginRight: "10px",
                              width: "7vw",
                              height: "4vh",
                            }}
                            className="imgOfBoard"
                          />
                        ))}
                      </div>
                    )}

                    {point.board && point.board.length > 0 && (
                      <div className="titleGraphIdeaTemplete mt-3">
                        <h4 className="titleLeftIdeaTemplete">Boards</h4>
                      </div>
                    )}
                    {point.board && point.board.length > 0 && (
                      <div className="PreStoredGraphIdeaTemplete">
                        {point.board.map((link, index) => (
                          <img
                            key={index}
                            src={link}
                            alt={`Board ${index + 1}`}
                            style={{
                              marginRight: "10px",
                              width: "7vw",
                              height: "4vh",
                              transform: "translateY(-17%) !important",
                            }}
                            className="imgOfBoard"
                          />
                        ))}
                      </div>
                    )}
                    {point.graphs && point.graphs.length > 0 && (
                      <div className="titleGraphIdeaTemplete mt-3">
                        <h4 className="titleLeftIdeaTemplete">Graphs</h4>
                      </div>
                    )}
                    {point.graphs && point.graphs.length > 0 && (
                      <div className="PreStoredGraphIdeaTemplete">
                        {point.graphs.map((graph, index) => (
                          <img
                            key={index}
                            src={graph}
                            alt={`Graph ${index + 1}`}
                            style={{
                              marginRight: "10px",
                              width: "7vw",
                              height: "4vh",
                            }}
                            className="imgOfBoard"
                          />
                        ))}
                      </div>
                    )}
                    {point.links && point.links.length > 0 && (
                      <div className="titleGraphIdeaTemplete mt-3">
                        <h4 className="titleLeftIdeaTemplete">links</h4>
                      </div>
                    )}
                    {point.links && point.links.length > 0 && (
                      <div className="">
                        {point.links.map((link, index) => (
                          <div className="linksleft imgOfBoard">
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ marginRight: "10px", cursor: "pointer" }}
                            >
                              Link {index + 1}
                            </a>
                          </div>
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
                    <div key={index} className="mt-2">
                      <input
                        type="file"
                        onChange={(e) => handleImageInputChange(e, index)}
                        className="fileInputIdeaTemplete"
                      />
                      <span className="removeButton">
                        <button onClick={() => handleRemoveImage(index)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setTempIdeaSpace((prevTemp) => ({
                        ...prevTemp,
                        images: [...prevTemp.images, ""],
                      }))
                    }
                    className="mt-1"
                  >
                    <FontAwesomeIcon icon={faImage} />
                  </button>
                </div>
                <div className="linkContainerofIdeaSpace mt-2">
                  {tempIdeaSpace.links.map((link, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={link}
                        onChange={(e) => handleLinkInputChange(e, index)}
                        className="fileInputIdeaTemplete"
                      />
                      <span className="removeButton mt-2">
                        <button onClick={() => handleRemoveLink(index)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </span>
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
                    <FontAwesomeIcon icon={faLink} />
                  </button>
                </div>

                <div className="boardContainerofIdeaSpace mt-2">
                  {tempIdeaSpace.board.map((board, index) => (
                    <div key={index}>
                      <input
                        type="file"
                        onChange={(e) => handleBoardInputChange(e, index)}
                        className="fileInputIdeaTemplete"
                      />
                      <span className="removeButton">
                        <button onClick={() => handleRemoveBoard(index)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setTempIdeaSpace((prevTemp) => ({
                        ...prevTemp,
                        board: [...prevTemp.board, ""],
                      }))
                    }
                  >
                    <FontAwesomeIcon icon={faChessBoard} />
                  </button>
                </div>
                <div className="GraphContainerofIdeaSpace mt-2">
                  {tempIdeaSpace.graphs.map((graph, index) => (
                    <div key={index}>
                      <input
                        type="file"
                        onChange={(e) => handleGraphInputChange(e, index)}
                        className="fileInputIdeaTemplete"
                      />
                      <span className="removeButton mt-2">
                        <button onClick={() => handleRemoveGraph(index)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </span>
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
                    <FontAwesomeIcon icon={faDiagramProject} />
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
                    {point.images && point.images.length > 0 && (
                      <div className="titleGraphIdeaTemplete mt-3">
                        <h4 className="titleLeftIdeaTemplete">Images</h4>
                      </div>
                    )}
                    {point.images && point.images.length > 0 && (
                      <div className="PreStoredGraphIdeaTemplete">
                        {point.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Image ${index + 1}`}
                            style={{
                              marginRight: "10px",
                              width: "7vw",
                              height: "4vh",
                            }}
                            className="imgOfBoard"
                          />
                        ))}
                      </div>
                    )}

                    {point.board && point.board.length > 0 && (
                      <div className="titleGraphIdeaTemplete mt-3">
                        <h4 className="titleLeftIdeaTemplete">Boards</h4>
                      </div>
                    )}
                    {point.board && point.board.length > 0 && (
                      <div className="PreStoredGraphIdeaTemplete">
                        {point.board.map((board, index) => (
                          <img
                            key={index}
                            src={board}
                            alt={`Board ${index + 1}`}
                            style={{
                              marginRight: "10px",
                              width: "7vw",
                              height: "4vh",
                              transform: "translateY(-17%) !important",
                            }}
                            className="imgOfBoard"
                          />
                        ))}
                      </div>
                    )}
                    {point.graphs && point.graphs.length > 0 && (
                      <div className="titleGraphIdeaTemplete mt-3">
                        <h4 className="titleLeftIdeaTemplete">Graphs</h4>
                      </div>
                    )}
                    {point.graphs && point.graphs.length > 0 && (
                      <div className="PreStoredGraphIdeaTemplete">
                        <h4>Graphs:</h4>
                        {point.graphs.map((graph, index) => (
                          <img
                            key={index}
                            src={graph}
                            alt={`Graph ${index + 1}`}
                            style={{
                              marginRight: "10px",
                              width: "7vw",
                              height: "4vh",
                            }}
                            className="imgOfBoard"
                          />
                        ))}
                      </div>
                    )}
                    {point.links && point.links.length > 0 && (
                      <div className="titleGraphIdeaTemplete mt-3">
                        <h4 className="titleLeftIdeaTemplete">links</h4>
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
                            style={{ marginRight: "10px", cursor: "pointer" }}
                          >
                            Link {index + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="ideaSpaceOfTemplete mx-1 mt-1">
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
                        className="fileInputIdeaTemplete"
                      />
                      <button
                        className="mt-2"
                        onClick={() => handleRemoveLinkInspiration(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
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
                    <FontAwesomeIcon icon={faLink} />
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
                        className="fileInputIdeaTemplete"
                      />
                      <button
                        className="mt-2"
                        onClick={() => handleRemoveImageInspiration(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
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
                    <FontAwesomeIcon icon={faImage} />
                  </button>
                </div>
                <div>
                  {tempInspiration.board.map((board, index) => (
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
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="mt-2"
                    onClick={() =>
                      setTempInspiration((prevTemp) => ({
                        ...prevTemp,
                        board: [...prevTemp.board, ""],
                      }))
                    }
                  >
                    <FontAwesomeIcon icon={faChessBoard} />
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
                        <FontAwesomeIcon icon={faTrash} />
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
                    <FontAwesomeIcon icon={faDiagramProject} />
                  </button>
                </div>
              </div>
            </div>

            <div className="row mt-4 part2OfTemplete">
              <h3>Previous Nodes</h3>
              {idea.prevNodes.map((point, index) => (
                  <div
                    key={index}
                    className="tagsContainerForGuidingPoint mt-2"
                  >
                    <p className="savedPoints">{point}</p>
                    <button onClick={() => handleRemovePrevNodesPoint(index)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              <div>
                <input
                  className="inputForPreviousNodes mt-3"
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
                    placeholder="hours"
                    onChange={handleConsChange}
                  />
                </label>
                <br />
                <label className="labelForConstraints mt-3">
                  <strong>Budget</strong>
                  <input
                    type="text"
                    name="budget"
                    placeholder=" INR"
                    value={idea.cons.budget}
                    onChange={handleConsChange}
                  />
                </label>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-5"></div>
              <div className="col-7">
                <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      <div className="graph-container">
        <Graph
          id="graph-id"
          data={graphData}
          onClickNode={(nodeId) => onClickNode(nodeId)}
          config={{
            directed: true,
            node: {
              symbolType: "circle",
              size: 2000,
              labelOffset: 2,
              fontSize: 16,
            },
            link: {
              highlightColor: "lightblue",
              color: "#333", // Darker color for the links
              strokeWidth: 2, 
            },
            d3: {
              gravity: -400, // Increase this value to increase the distance between nodes
            },
          }}
          onEngine={(graph) => {
            const layout = dagre.graphlib.layout();
            layout(graph);
          }}
        />

        {/* Render the preview component if a node is clicked */}
      </div>
    </>
  );
};
