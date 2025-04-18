import "../styles/PathfindingVS.css";
import React, { useEffect, useState } from "react";
import Astar from "../Algoritmi/put/A_star_algo";
import basicMaze from "../Algoritmi/labirint/basic-maze";
import BFS from "../Algoritmi/put/bfs";
import Dijkstra from "../Algoritmi/put/Dijkstra";
import recursiveDivision from "../Algoritmi/labirint/rekurzivna_divizija";
import Navbar from "../komponente/Navbar";
import Button from "../komponente/Btn";
import CostomCheckBox from "../komponente/CustomCheckBox";

var rows = 13;
var cols = 31;

const CELL_SIZE = 30;
const PADDING = 200;
const MAX_ROW = Math.floor((window.innerHeight - PADDING) / CELL_SIZE);
if (MAX_ROW > rows) rows = MAX_ROW >= 19 ? 19 : MAX_ROW; // Rows = [13, 19]

var START_NODE_ROW = 4,
  START_NODE_COL = 6;
var END_NODE_ROW = rows - 6,
  END_NODE_COL = cols - 6;
var INIT_START_ROW = START_NODE_ROW,
  INIT_START_COL = START_NODE_COL;
var INT_END_ROW = END_NODE_ROW,
  INIT_END_COL = END_NODE_COL;

const FAST = 5;
const AVERAGE = 15;
const SLOW = 50;
var animateTime = AVERAGE; 


function PathfindingVS() {
  const [Grid, setGrid] = useState([]); 
  const [isMousePress, setIsMousePress] = useState(false);
  const [animateType, setAnimateTimeType] = useState(2);
  const [mazeID, setMazeID] = useState(0);
  const [pathID, setPathID] = useState(0);

  useEffect(() => {
    gridInitialize();
  }, []);

  const gridInitialize = () => {
    var grid = new Array(rows);
    for (let i = 0; i < rows; i++) grid[i] = new Array(cols);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = new Spot(i, j);
      }
    }
   
    setGrid(grid);
  };
 
  async function animateVisitedNodes(visitedNodes) {
    for (let i = 0; i < visitedNodes.length; i++) {
      const node = visitedNodes[i];
      await waitForAnimatoin(animateTime);
      if (node.x === START_NODE_ROW && node.y === START_NODE_COL)
        document.getElementById(`row${node.x}_col${node.y}`).className =
          "node-visited START_NODE cursor-grab";
      else if (node.x === END_NODE_ROW && node.y === END_NODE_COL)
        document.getElementById(`row${node.x}_col${node.y}`).className =
          "node-visited END_NODE cursor-grab";
      else
        document.getElementById(`row${node.x}_col${node.y}`).className =
          "node-visited";
    }
  }
  async function animateShortestPath(pathNode) {
    pathNode.reverse();
    for (let i = 0; i < pathNode.length; i++) {
      const node = pathNode[i];
      await waitForAnimatoin(animateTime);
      if (i === 0)
        document.getElementById(`row${node.x}_col${node.y}`).className =
          "shortestPath START_NODE cursor-grab";
      else if (i + 1 === pathNode.length)
        document.getElementById(`row${node.x}_col${node.y}`).className =
          "shortestPath END_NODE cursor-grab";
      else
        document.getElementById(`row${node.x}_col${node.y}`).className =
          "shortestPath";
    }
  }

  const pathFinding = async () => {
    var btns = document.getElementsByClassName("btn-selector");
    document.getElementsByTagName("select")[0].disabled = true;
    document.getElementsByTagName("select")[1].disabled = true;
    for (let i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
    }

    var startNode = Grid[START_NODE_ROW][START_NODE_COL];
    var endNode = Grid[END_NODE_ROW][END_NODE_COL];

    switch (pathID) {
      case 1:
        var obj = BFS(Grid, startNode, endNode, rows, cols);
        await animateVisitedNodes(obj.visitedNodes);
        await animateShortestPath(obj.path);
        break;
      case 2:
        obj = Dijkstra(Grid, startNode, endNode, rows, cols);
        await animateVisitedNodes(obj.visitedNodes);
        await animateShortestPath(obj.path);
        break;
      default:
        obj = Astar(Grid, startNode, endNode, rows, cols);
        await animateVisitedNodes(obj.close_list);
        await animateShortestPath(obj.path);
        break;
    }
    document.getElementsByTagName("select")[0].disabled = false;
    document.getElementsByTagName("select")[1].disabled = false;
    for (let i = 0; i < btns.length; i++) {
      btns[i].disabled = false;
    }
  };

  const mazeGenerator = async (ar) => {
    for (var i = 0; i < ar.length; i++) {
      if (
        (ar[i].r === START_NODE_ROW && ar[i].c === START_NODE_COL) ||
        (ar[i].r === END_NODE_ROW && ar[i].c === END_NODE_COL)
      )
        continue;
      await waitForAnimatoin(animateTime);
      createWall(ar[i].r, ar[i].c);
    }
  };
  /*const makeAllCellAsAWall = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (
          !(
            (i === START_NODE_ROW && j === START_NODE_COL) ||
            (i === END_NODE_ROW && j === END_NODE_COL)
          )
        ) {
          createWall(i, j);
        }
      }
    }
  };*/
  const mazeHandle = async () => {
    

    var btns = document.getElementsByClassName("btn-selector");
    document.getElementsByTagName("select")[0].disabled = true;
    document.getElementsByTagName("select")[1].disabled = true;
    for (let i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
    }

    var arr = [];
    switch (mazeID) {
      case 1:
        arr = basicMaze(rows, cols);
        await mazeGenerator(arr);
        break;
      case 2: 
        arr = recursiveDivision(rows, cols);
        await mazeGenerator(arr);
        break;
      default:
    }

    
    document.getElementsByTagName("select")[0].disabled = false;
    document.getElementsByTagName("select")[1].disabled = false;
    for (let i = 0; i < btns.length; i++) {
      btns[i].disabled = false;
    }
  };
  const clearPathHandle = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (i === START_NODE_ROW && j === START_NODE_COL) {
          document.getElementById(`row${i}_col${j}`).className =
            "square START_NODE cursor-grab";
        } else if (i === END_NODE_ROW && j === END_NODE_COL) {
          document.getElementById(`row${i}_col${j}`).className =
            "square END_NODE cursor-grab";
        } else if (!Grid[i][j].isWall)
          document.getElementById(`row${i}_col${j}`).className = "square";
      }
    }
  };

  const createWall = (row, col) => {
  
    var newGrid = [...Grid]; 
    var node = newGrid[row][col];
    node.isWall = !node.isWall;
    newGrid[row][col] = node;
    setGrid(newGrid);
  };

  const onMouseDown = (row, col) => {
    if (isValid(row, col)) {
      setIsMousePress(true);
      createWall(row, col);
    }
  };
  const onMouseEnter = (row, col) => {
    if (isMousePress === true && isValid(row, col)) {
      createWall(row, col);
    }
  };
  const onMouseUp = () => {
    setIsMousePress(() => false);
  };
  const animationTimeHandle = (type) => {
    if (type === 1) animateTime = FAST;
    else if (type === 2) animateTime = AVERAGE;
    else animateTime = SLOW;
    setAnimateTimeType(type);
  };

  const setStartEndNode = (id, r, c) => {
    if (id === 1) {
      let newGrid = [...Grid]; 
      let preStartNode = newGrid[START_NODE_ROW][START_NODE_COL];
      let curStartNode = newGrid[r][c];
      preStartNode.isStart = !preStartNode.isStart;
      curStartNode.isStart = !curStartNode.isStart;
      setGrid(newGrid);

      START_NODE_ROW = r;
      START_NODE_COL = c;
    } else {
      let newGrid = [...Grid]; 
      let preEndNode = newGrid[END_NODE_ROW][END_NODE_COL];
      let curEndNode = newGrid[r][c];
      preEndNode.isEnd = !preEndNode.isEnd;
      curEndNode.isEnd = !curEndNode.isEnd;
      setGrid(newGrid);

      END_NODE_ROW = r;
      END_NODE_COL = c;
    }
  };

  // console.log(window.innerHeight, MAX_ROW, rows);

  return (
    <>
      

      <div id="Container-blur" className="active">
        <Navbar msg="Vizualizacija najkraćeg puta"></Navbar>
        <div className="path-container">
          <div className="path-header mb-4 min-w-[775px]">
            <div>
              <div className="flex justify-end my-[12px] gap-3">
                <Button
                  className="btn-selector"
                  onClick={pathFinding}
                  label="Vizualizuj put"
                  // isBgColor
                />
                <select
                  className="form-select"
                  value={pathID}
                  onChange={(e) => {
                    setPathID(parseInt(e.target.value));
                  }}
                >
                  <option value="0">A-Star </option>
                  <option value="1">BFS</option>
                  <option value="2">Dijkstra</option>
                </select>
              </div>
              <div className="path-speed-btns">
                <div className="-m-1 flex flex-row flex-wrap">
                  <CostomCheckBox
                    checked={animateType === 1}
                    onClick={() => animationTimeHandle(1)}
                    label="Brzo"
                  />
                  <CostomCheckBox
                    checked={animateType === 2}
                    onClick={() => animationTimeHandle(2)}
                    label="Srednje"
                  />
                  <CostomCheckBox
                    checked={animateType === 3}
                    onClick={() => animationTimeHandle(3)}
                    label="Sporo"
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-end my-[12px] gap-3">
                <select
                  className="form-select"
                  value={mazeID}
                  onChange={(e) => {
                    setMazeID(parseInt(e.target.value));
                  }}
                >
                  <option className="my-drop-down-option" disabled value="0">
                    Select Maze
                  </option>
                  <option value="1">Random</option>
                  <option value="2">Rekurzivna divizija</option>
                </select>
                <Button
                  className="btn-selector END-maze-btn"
                  onClick={mazeHandle}
                  label="Generiraj labirint"
                  isBgColor
                />
              </div>
              <div className="flex gap-3">
                <Button
                  className="btn-selector"
                  onClick={gridInitialize}
                  label="Očisti zidove"
                />
                <Button
                  className="btn-selector"
                  onClick={clearPathHandle}
                  label="Očisti put"
                />
                <Button
                  className="btn-selector !border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-white"
                  onClick={() => {
                    START_NODE_ROW = INIT_START_ROW;
                    START_NODE_COL = INIT_START_COL;
                    END_NODE_ROW = INT_END_ROW;
                    END_NODE_COL = INIT_END_COL;
                    clearPathHandle();
                    gridInitialize();
                  }}
                  label="Resetiraj grid"
                />
              </div>
            </div>
          </div>
          <div className="grid">
            <div
              onMouseLeave={() => {
                setIsMousePress(false);
              }}
            >
              {/* JSX Node Of Grid (2D Array) */}
              {Grid.map((R, idx_r) => {
                return (
                  <div key={idx_r} className="ROW">
                    {R.map((Value, idx_c) => {
                      const { x, y, isStart, isEnd, isWall } = Value;
                      return (
                        <Node
                          key={idx_c}
                          pv={{
                            x,
                            y,
                            isStart,
                            isEnd,
                            isWall,
                            onMouseDown,
                            onMouseEnter,
                            onMouseUp,
                            setStartEndNode,
                          }}
                        ></Node>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

class Spot {
  constructor(i, j) {
    this.x = i;
    this.y = j;
    this.isWall = false;
    this.isStart = i === START_NODE_ROW && j === START_NODE_COL;
    this.isEnd = i === END_NODE_ROW && j === END_NODE_COL;


  }
}

function Node({ pv }) {
  const {
    x,
    y,
    isStart,
    isEnd,
    isWall,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    setStartEndNode,
  } = pv;
  const allowDrop = (e) => {
    e.preventDefault();
  };
  const drag = (e) => {
    e.dataTransfer.setData("myID", e.target.id);
  };
  const drop = (e) => {
    e.preventDefault();
    var data = e.dataTransfer.getData("myID");
    var dom = document.getElementById(data);
    var id = parseInt(dom.attributes.data_type.value);
    if (
      e.target.attributes.data_type.value !== "3" ||
      e.target.attributes.wall.value === "true"
    )
      return;

    
    var r = parseInt(e.target.attributes.data_x.value);
    var c = parseInt(e.target.attributes.data_y.value);
    setStartEndNode(id, r, c);
  };

  var classNode = isStart
    ? "START_NODE cursor-grab"
    : isEnd
    ? "END_NODE cursor-grab"
    : isWall
    ? "obtacle"
    : "";
  var typeId = isStart ? "1" : isEnd ? "2" : "3";

  if (isStart || isEnd) {
    return (
      <div
        className={"square " + classNode}
        id={"row" + x + "_col" + y}
        data_x={x}
        data_y={y}
        data_type={typeId}
        wall="false"
        draggable="true"
        onDragStart={drag}
        onDrop={drop}
        onDragOver={allowDrop}
      ></div>
    );
  } else {
    return (
      <div
        onMouseDown={(e) => {
          e.preventDefault(); 
          onMouseDown(x, y);
        }}
        onMouseEnter={(e) => {
          e.preventDefault();
          onMouseEnter(x, y);
        }}
        onMouseUp={(e) => {
          e.preventDefault();
          onMouseUp();
        }}
        className={"square " + classNode}
        id={"row" + x + "_col" + y}
        data_x={x}
        data_y={y}
        data_type={typeId}
        wall={isWall.toString()}
        onDrop={drop}
        onDragOver={allowDrop}
      ></div>
    );
  }
}

async function waitForAnimatoin(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, time);
  });
}
const isValid = (r, c) => {
  if (
    (r === START_NODE_ROW && c === START_NODE_COL) ||
    (r === END_NODE_ROW && c === END_NODE_COL)
  )
    return 0;
  else return 1;
};
export default PathfindingVS;