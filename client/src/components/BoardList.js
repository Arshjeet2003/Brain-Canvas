import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import "../css/boardlist.css";
import LinkContext from "../context/links/LinkContext.js";
import BoardContext from "../context/boards/BoardContext.js";
import firstImg from "../images/1.svg";
import secondImg from "../images/2.svg";
import fourthImg from "../images/4.svg";
import eight from "../images/8.svg";
import nine from "../images/9.svg";
import ten from "../images/10.svg";

const img = [firstImg, secondImg, fourthImg, eight, nine, ten];

const BoardList = (props) => {

  const { link, updateLink, createLink, joinLinkById, createNewBoard } =
    useContext(LinkContext);

  const { linkId } = useParams();
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [teamCode, setTeamCode] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await joinLinkById(linkId);
        setBoards(response.data.boards);
        setTeamCode(response.data._id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [linkId, newBoardTitle, newBoardDescription]);

  const handleNewBoardCreation = async (e) => {
    e.preventDefault();
    const title = e.target.elements.title.value;
    const description = e.target.elements.description.value;
    // await createNewBoard(linkId, title, description);
    const response = await createNewBoard(linkId, title, description);
    // console.log(response.data);
    setNewBoardTitle(title);
    setNewBoardDescription(description); 
    // navigate(`/${linkId}/board/${boardId}`);
    
  };

  return (
    <>
      {/*  */}
      <div className="bodyOfBoardList">
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
            <div className="row mt-5 titleInputBoardList">
              <div className="biggestTitle mx-5">Create new idea board </div>

              <form onSubmit={handleNewBoardCreation} className="mx-5">
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="inputBoardList"
                  placeholder="title"
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
                      <button type="submit" className="mt-2">
                        Add Board
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="row  mx-4 heading">
          <div className="col-1">
            {/* <strong>
              <h3>Team Name : </h3>
            </strong>
            <span className="heading2">{boards.title}</span> */}
          </div>
          <div className="col-11" style={{display:"flex"}}>
            <strong>
              <h3>Team Code : </h3>
            </strong>
            <span className="heading2 mx-3 mt-1">{teamCode}</span>
          </div>
        </div>
        <div className="container main">
          {boards.map((board, index) => (
            <div className="item">
              <Link
                to={`/${linkId}/board/${board._id}`}
                key={board.id}
                className="card my-2"
                style={{
                  textDecoration: "none",
                  border: "none",
                  marginBottom:
                    index < boards.length - 1
                      ? "10px !important"
                      : "0 !important",
                }}
              >
                <div className="section_our_solution">
                  <div className="row">
                    <div className="col">
                      <div className="our_solution_category">
                        <div className="solution_cards_box">
                          <div className="solution_card">
                            <div className="hover_color_bubble" />
                            <div className="row">
                              <div className="col-7">
                                <div className="solu_title">
                                  <h3>{board.title}</h3>
                                </div>
                                <div className="solu_description">
                                  <p>{board.description}</p>
                                </div>
                                <div className="row">
                                  <div className="col solu_description ">
                                    <button
                                      type="button"
                                      className="read_more_btn"
                                    >
                                      Read More
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="col-5">
                                <div className="so_top_icon">
                                  {
                                    <img
                                      src={img[index % img.length]}
                                      alt="SVG Image"
                                      style={{ height: "40vh", width: "40vh" }}
                                    />
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BoardList;
