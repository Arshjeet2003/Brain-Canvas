import React, { useEffect, useContext, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../css/board.css";
import BoardContext from "../context/boards/BoardContext.js";
import one from "../images/5.svg";
import second from "../images/6.svg";
import third from "../images/7.svg";
import fourth from "../images/11.svg";
import fifth from "../images/12.svg";
import sixth from "../images/13.svg";
const img = [one, second, third, fourth, fifth, sixth];

const Board = () => {
  const navigate = useNavigate();
  // context
  const { board, fetchBoardById, createNewChart } = useContext(BoardContext);
  // params
  const { linkId, boardId } = useParams();

  const [charts, setCharts] = useState([]);
  const [newChartTitle, setNewChartTitle] = useState("");
  const [newChartDescription, setNewChartDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBoardById(linkId, boardId);
        setCharts(response.data.ideaCharts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [boardId, linkId, newChartTitle, newChartDescription])

const handleNewChartCreation = async (e) => {
  e.preventDefault();
  const title = await e.target.elements.title.value;
  const description = await e.target.elements.description.value;
  const chartId = await createNewChart(linkId, boardId, title, description);
  setNewChartTitle(title)
  setNewChartDescription(description)
  // navigate(`/${linkId}/board/${boardId}/charts/${chartId}`);
};

  return (
    <>
      <div className="bodyOfBoard container-fluid">
        {/* {board.title}
      {board.teamCode}
      {board.userName} */}
        
        <div className="row">
          <div className="col-6 mt-3 mx-4">
            <h1 className="heading">Helping the world</h1>
            <h5 className="heading2 mt-5">
              More than 180,000 organizations, including Nike, Ikea, Deloitte,
              WPP, and Cisco, have adopted Miro to help innovate the way they
              innovate, with the goal of improving the speed and quality of
              their work.
            </h5>
          </div>
          <div className="col-4">
            <div className="row  titleInputBoardList mt-1">
              <div className="biggestTitle ">Create new idea Chart </div>
              <form onSubmit={handleNewChartCreation}>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="title"
                  className="mt-3 inputBoardList"
                />

                <textarea
                  type="text"
                  id="description"
                  name="description"
                  placeholder="description"
                  className="mt-3 inputBoardList textareaBl"
                />

                <div className="row">
                  <div className="col-4"></div>
                  <div className="col-8">
                    <div className="biggestButton">
                      <button type="submit">Add Chart</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="chart-list container ">
          {charts.map((chart, index) => (
            <div className="item" key={chart.id}>
              <Link
                to={`/${linkId}/board/${boardId}/charts/${chart._id}`}
                key={chart.id}
                // className="card my-3 mx-3"
                style={{ textDecoration: "none" }}
              >
                <div className="first">
                  <div className="row">
                    <div className="col">
                      <div className="second">
                        <div className="third">
                          <div className="forth">
                            <div className="fifth" />
                            <div className="row">
                              <div className="col">
                                <div className="sixth">
                                  <h3>{chart.title}</h3>
                                </div>
                              </div>

                              {/* <div className="seventh">
                                <p>{chart.description}</p>
                              </div> */}
                              <div className="row">
                                <div className="col extra">
                                  <div className="so_top_icon borderborder">
                                    <img
                                      src={img[index % img.length]}
                                      alt="SVG Image"
                                      style={{ height: "40vh", width: "40vh" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Board;
