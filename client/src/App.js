import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import BoardList from "./components/BoardList";
import Board from "./components/Board";
import { Chart } from "./components/Chart";
import { IdeaTemplate } from "./components/IdeaTemplate";
import Login from "./components/Login";
import Signup from "./components/Signup";
import LinkProvider from "./context/links/LinkProvider.js";
import BoardProvider from "./context/boards/BoardProvider.js";
import ChartProvider from "./context/charts/ChartProvider.js";

function App() {
  const boards = [
    {
      id: 1,
      title: "Board 1",
      description: "Description for Board 1",
      teamCode: "77567",
      userName: "Naman singh",
    },
  ];
  const charts = [
    {
      id: 1,
      title: "Chart 1",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      creationTime: "2024-04-17T08:30:00",
    },
  ];

  const ideas = [
    {
      id: 1,
      title: "Idea 1",
      description: "This is the description for Idea 1.",
      createdBy: "User1",
    },
  ];

  return (
    <>
      <LinkProvider>
        <BoardProvider>
          <ChartProvider>
            <Router>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/:linkId" element={<BoardList />} />
                <Route path="/:linkId/board/:boardId" element={<Board />} />
                <Route
                  path="/:linkId/board/:boardId/charts/:chartId"
                  element={<Chart charts={charts} ideas={ideas} />}
                />
                {/* <Route
                  path="/:linkId/board/:boardId/charts/:ChartId/addidea"
                  element={<IdeaTemplate ideas={ideas} />}
                /> */}
                <Route
                  path="/:linkId/board/:boardId/charts/:chartId/addidea"
                  element={<IdeaTemplate ideas={ideas} />}
                />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/signup" element={<Signup />} />
              </Routes>
            </Router>
          </ChartProvider>
        </BoardProvider>
      </LinkProvider>
    </>
  );
}

export default App;