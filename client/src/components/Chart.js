import React, { useEffect, useState, useRef, useContext } from "react";
import { Graph } from "react-d3-graph";
import dagre from "dagre";
import NodePreview from "./NodePreview";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faMinus,faPlus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/chart.css"
import ChartContext from "../context/charts/ChartContext.js";

export const Chart = () => {
  const { linkId, boardId, chartId } = useParams();
  const { chart, fetchChartById, createNewIdea } = useContext(ChartContext);

  const [parent, setParent] = useState("");
  const [child, setChild] = useState("");
  const [nodeSize, setNodeSize] = useState(5000);

  const [color, setColor] = useState("#E97451");

  const [chartData, setChartData] = useState({})

  const navigate = useNavigate();

  const [graphData, setGraphData] = useState({
    nodes: [],
    links: [],
  });

  const [idea, setIdea] = useState({
    topic: "Mobile App for Task Management",
    description:
      "Developing a mobile application for efficient task management and productivity enhancement.",
    idea_space: [
      {
        text: "Brainstorming ideas for user interface design task management and productivity enhancement",
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
        ],
        freeboard: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
        ],
        graphs: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
        ],
        links: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
        ],
      },
    ],
    inspiration: [
      {
        text: "Innovative task visualization techniques",
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
        ],
        freeboard: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
        ],
        graphs: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
        ],
        links: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHhJnHjdWtiEMKgVtZ17zUTnrGzHUCSDIS38KLSVt0A&s",
        ],
      },
    ],
    cons: {
      time: "Requires dedicated development time",
      budget: "Initial investment for development and maintenance",
    },
    progress: "84.6%",
    github_link: "https://github.com/username/task-management-app",
    guiding: ["https://example.com/guiding1", "https://example.com/guiding2"],
    comments: {
      user1: "https://example.com/comment1",
      user2: "https://example.com/comment2",
    },
    likes: 25,
    additional_points: [
      "https://example.com/additional_point1",
      "https://example.com/additional_point2",
    ],
    prevNodes: [
      "https://example.com/user_feedback",
      "https://example.com/market_research",
    ],
  });

  const [ideas, setIdeas] = useState([])

//   const [ideas, setIdeas] = useState([{
//     topic: "Mobile App for Task Management",
//     description:
//       "Developing a mobile application for efficient task management and productivity enhancement.",
//     idea_space: [
//       {
//         text: "Brainstorming ideas for user interface design",
//         images: [
//           "https://example.com/ui_design.png",
//           "https://www.google.com",
//         ],
//         freeboard: ["https://example.com/user_friendly_ui"],
//         graphs: ["https://example.com/graph1"],
//         links: ["https://example.com/link1"],
//       },
//       {
//         text: "Researching competitor apps",
//         images: ["https://example.com/competitor_analysis.png"],
//         freeboard: ["https://example.com/key_features"],
//         graphs: ["https://example.com/graph2"],
//         links: ["https://example.com/link2"],
//       },
//     ],
//     inspiration: [
//       {
//         text: "Inspiration from successful task management apps like Todoist and Trello",
//         images: [],
//         freeboard: ["https://example.com/user_feedback"],
//         graphs: [],
//         links: ["https://example.com/inspiration_link1"],
//       },
//       {
//         text: "Innovative task visualization techniques",
//         images: ["https://example.com/innovative_visualization.png"],
//         freeboard: [],
//         graphs: ["https://example.com/graph3"],
//         links: ["https://example.com/inspiration_link2"],
//       },
//     ],
//     cons: {
//       time: "Requires dedicated development time",
//       budget: "Initial investment for development and maintenance",
//     },
//     progress:
//       "Currently in the design phase, preparing for development sprint",
//     github_link: "https://github.com/username/task-management-app",
//     guiding: ["https://example.com/guiding1", "https://example.com/guiding2"],
//     comments: {
//       user1: "https://example.com/comment1",
//       user2: "https://example.com/comment2",
//     },
//     likes: 4,
//     additional_points: [
//       "https://example.com/additional_point1",
//       "https://example.com/additional_point2",
//     ],
//     prevNodes: [],
//   },
//   {
//     topic: "Mobile App for Task Management2",
//     description:
//       "Developing a mobile application for efficient task management and productivity enhancement.",
//     idea_space: [
//       {
//         text: "Brainstorming ideas for user interface design",
//         images: [
//           "https://example.com/ui_design.png",
//           "https://www.google.com",
//         ],
//         freeboard: ["https://example.com/user_friendly_ui"],
//         graphs: ["https://example.com/graph1"],
//         links: ["https://example.com/link1"],
//       },
//       {
//         text: "Researching competitor apps",
//         images: ["https://example.com/competitor_analysis.png"],
//         freeboard: ["https://example.com/key_features"],
//         graphs: ["https://example.com/graph2"],
//         links: ["https://example.com/link2"],
//       },
//     ],
//     inspiration: [
//       {
//         text: "Inspiration from successful task management apps like Todoist and Trello",
//         images: [],
//         freeboard: ["https://example.com/user_feedback"],
//         graphs: [],
//         links: ["https://example.com/inspiration_link1"],
//       },
//       {
//         text: "Innovative task visualization techniques",
//         images: ["https://example.com/innovative_visualization.png"],
//         freeboard: [],
//         graphs: ["https://example.com/graph3"],
//         links: ["https://example.com/inspiration_link2"],
//       },
//     ],
//     cons: {
//       time: "Requires dedicated development time",
//       budget: "Initial investment for development and maintenance",
//     },
//     progress:
//       "Currently in the design phase, preparing for development sprint",
//     github_link: "https://github.com/username/task-management-app",
//     guiding: ["https://example.com/guiding1", "https://example.com/guiding2"],
//     comments: {
//       user1: "https://example.com/comment1",
//       user2: "https://example.com/comment2",
//     },
//     likes: 8,
//     additional_points: [
//       "https://example.com/additional_point1",
//       "https://example.com/additional_point2",
//     ],
//     prevNodes: ["Mobile App for Task Management"],
//   },
//   {
//     topic: "Mobile App for Task Management3",
//     description:
//       "Developing a mobile application for efficient task management and productivity enhancement.",
//     idea_space: [
//       {
//         text: "Brainstorming ideas for user interface design",
//         images: [
//           "https://example.com/ui_design.png",
//           "https://www.google.com",
//         ],
//         freeboard: ["https://example.com/user_friendly_ui"],
//         graphs: ["https://example.com/graph1"],
//         links: ["https://example.com/link1"],
//       },
//       {
//         text: "Researching competitor apps",
//         images: ["https://example.com/competitor_analysis.png"],
//         freeboard: ["https://example.com/key_features"],
//         graphs: ["https://example.com/graph2"],
//         links: ["https://example.com/link2"],
//       },
//     ],
//     inspiration: [
//       {
//         text: "Inspiration from successful task management apps like Todoist and Trello",
//         images: [],
//         freeboard: ["https://example.com/user_feedback"],
//         graphs: [],
//         links: ["https://example.com/inspiration_link1"],
//       },
//       {
//         text: "Innovative task visualization techniques",
//         images: ["https://example.com/innovative_visualization.png"],
//         freeboard: [],
//         graphs: ["https://example.com/graph3"],
//         links: ["https://example.com/inspiration_link2"],
//       },
//     ],
//     cons: {
//       time: "Requires dedicated development time",
//       budget: "Initial investment for development and maintenance",
//     },
//     progress:
//       "Currently in the design phase, preparing for development sprint",
//     github_link: "https://github.com/username/task-management-app",
//     guiding: ["https://example.com/guiding1", "https://example.com/guiding2"],
//     comments: {
//       user1: "https://example.com/comment1",
//       user2: "https://example.com/comment2",
//     },
//     likes: 12,
//     additional_points: [
//       "https://example.com/additional_point1",
//       "https://example.com/additional_point2",
//     ],
//     prevNodes: [
//       "Mobile App for Task Management",
//       "Mobile App for Task Management2",
//     ],
//   },
// ])
  // const [ideas, setIdeas] = useState([])

  // const [idea, setIdea] = useState({});
  const [likedIdeas, setLikedIdeas] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChartById(linkId, boardId, chartId);
        const chartIdeas = await response.data.ideas;
        setChartData(response.data)
        setIdeas(chartIdeas);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [boardId, linkId, chartId]);


  useEffect(() => {
    const fetchData = async () => {
      console.log(ideas)
      setGraphData({ nodes: [], links: [] });
      try {
        const adjacencyList = {};

        // Populate the adjacency list
        ideas.forEach((ideaVal) => {
          adjacencyList[ideaVal.topic] = [];
          if (ideaVal.prevNodes && ideaVal.prevNodes.length == 0) {
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
      }
    };

    fetchData();
  }, [ideas, setIdeas]);

  // // State variable to track the clicked node's ID
  const [clickedNode, setClickedNode] = useState(null);

  // Function to handle node click
  const onHoverNode = (nodeId) => {
    // Find the idea with the matching nodeId
    const foundIdea = ideas.find((idea) => idea.topic === nodeId);

    // If an idea with the matching nodeId is found, set it in state
    if (foundIdea) {
      setIdea(foundIdea);
    }
    setClickedNode(nodeId); // Set the clicked node's ID in state to show preview
  };

  const onDoubleClickNode = (ideaId) => {
    // Check if the idea has been liked before
    const isLiked = likedIdeas[ideaId];
  
    // Find the idea with the given ID and update the likes
    const updatedIdeas = ideas.map((idea) => {
      if (idea.topic === ideaId) {
        // Create a copy of the current idea state
        const updatedIdea = { ...idea };
        // Increment or decrement the likes based on whether it has been liked before
        updatedIdea.likes = isLiked ? updatedIdea.likes - 1 : updatedIdea.likes + 1;
        return updatedIdea; // Return the updated idea
      }
      return idea; // Return unchanged idea if ID doesn't match
    });


  
    // Update the liked state for the idea
    setLikedIdeas((prevLikedIdeas) => ({
      ...prevLikedIdeas,
      [ideaId]: !isLiked, // Toggle the liked state for the clicked idea ID
    }));
  
    // Update the state with the modified ideas array
    setIdeas(updatedIdeas);
    // Save updated ideas in the database
  };

  const rgbToHex = (r, g, b) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const hexToRgb = (color) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const hexColor = color.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
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

  const handleAddIdea = () => {
    navigate(`/${linkId}/board/${boardId}/charts/${chartId}/addidea`);
  };

  const onClickNode = (ideaId) => {
    navigate(`/${linkId}/board/${boardId}/charts/${chartId}/idea/${ideaId}`);
  };

  // Function to close the preview
  const closePreview = () => {
    setClickedNode(null); // Reset the clicked node's ID in state
  };

  const increaseNodeSize = () => {
    setNodeSize(nodeSize + 1000); // Increase node size by 100
  };

  const decreaseNodeSize = () => {
    if (nodeSize > 100) {
      setNodeSize(nodeSize - 1000); // Decrease node size by 100, but keep it above 100
    }
  };

  return (
    <>
    <button onClick={handleAddIdea}> Add a new Idea </button>
      <div className="container-fluid completeChart">
        <div className="row headerOfChart mt-2">
          <h1>
            <strong>{chartData.title}</strong>
          </h1>
        </div>
        <div className="row descriptionOfChart">
          <p>{chartData.description}</p>
        </div>
        <div className="row">
          <div className="col-7">
            <div className="row">
              <div className="col-8 ">
                <input
                  type="text"
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  placeholder="Enter parent node"
                  className="form-control"
                />
                <input
                  type="text"
                  value={child}
                  onChange={(e) => setChild(e.target.value)}
                  placeholder="Enter child node"
                  className="form-control"
                />
              </div>
              <div className="col-4 chartLeftButton">
                {" "}
                <button
                  onClick={increaseNodeSize}
                  className="btn btn-secondary "
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                <button
                  onClick={decreaseNodeSize}
                  className="btn btn-secondary mx-3"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="graph-container">
                  <Graph
            id="graph-id"
            data={graphData}
            onMouseOverNode={onHoverNode}
            onClickNode={(nodeId) => onDoubleClickNode(nodeId)}
            onDoubleClickNode={(nodeId) => onClickNode(nodeId)}
            config={{
              directed: true,
              node: {
                symbolType: "circle",
                size: nodeSize,
              },
              link: {
                highlightColor: "lightblue",
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
              </div>
            </div>
          </div>
          <div className="col-5 rightChart">
            <div className="row">
              {clickedNode && (
                <div className="previewDisapper">
                  <NodePreview
                    idea={idea}
                    nodeId={clickedNode}
                    onClose={closePreview}
                    style={{
                      position: "relative",
                      top: 0,
                      left: 0,
                      zIndex: 100,
                    }}
                  />
                </div>
              )}{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
