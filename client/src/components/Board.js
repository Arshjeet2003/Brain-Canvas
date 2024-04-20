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
  }, [boardId, linkId])

const handleNewChartCreation = async (e) => {
  e.preventDefault();
  const title = await e.target.elements.title.value;
  const description = await e.target.elements.description.value;
  const chartId = await createNewChart(linkId, boardId, title, description);
  // const link = await joinLinkById(linkId);
  console.log(chartId);
  navigate(`/${linkId}/board/${boardId}/charts/${chartId}`);
};

  return (
    <>
    <div>
        Create new idea Chart :
        <form onSubmit={handleNewChartCreation}>
          <label htmlFor="title">title</label>
          <input type="text" id="title" name="title" />
          <label htmlFor="description">description</label>
          <input type="text" id="description" name="description" />
          <button type="submit">Add Chart</button>
        </form>
      </div>
    <div className="bodyOfBoard">
      {/* {board.title}
      {board.teamCode}
      {board.userName} */}

      <div className="row">
        <div className="col-6 mt-3 mx-4">
          <h1 className="heading">Helping the world</h1>
          <h5 className="heading2">
            More than 180,000 organizations, including Nike, Ikea, Deloitte,
            WPP, and Cisco, have adopted Miro to help innovate the way they
            innovate, with the goal of improving the speed and quality of their
            work.
          </h5>
        </div>
      </div>

      <div className="chart-list container ">
        {charts.map((chart ,index) => (
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
                                <div className="so_top_icon">
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
