function Dijkstra(Grid, startNode, endNode, N, M) {
    const visitedNodes = [];
    const path = [];
    const grid = Array.from({ length: N }, () =>
      Array.from({ length: M }, () => ({ distance: Infinity, x: -1, y: -1 }))
    );
    const priorityQueue = [{ cost: 0, x: startNode.x, y: startNode.y }];
    grid[startNode.x][startNode.y].distance = 0;
    visitedNodes.push({ x: startNode.x, y: startNode.y });
    const dx = [0, 0, 1, -1];
    const dy = [1, -1, 0, 0];
  
    while (priorityQueue.length > 0) {
      priorityQueue.sort((a, b) => a.cost - b.cost);
      const top = priorityQueue.shift();
  
      if (top.cost !== grid[top.x][top.y].distance) continue;
  
      for (let i = 0; i < 4; i++) {
        const x = dx[i] + top.x;
        const y = dy[i] + top.y;
  
        if (x < 0 || x >= N || y < 0 || y >= M || Grid[x][y].isWall) continue;
  
        if (x === endNode.x && y === endNode.y) {
          visitedNodes.push({ x, y });
          grid[x][y].x = top.x;
          grid[x][y].y = top.y;
          let current = { x, y };
          path.push(current);
  
          while (grid[current.x][current.y].x !== -1 || grid[current.x][current.y].y !== -1) {
            const prevX = grid[current.x][current.y].x;
            const prevY = grid[current.x][current.y].y;
            current = { x: prevX, y: prevY };
            path.push(current);
          }
  
          return { path: path.reverse(), visitedNodes, error: "" };
        } else if (grid[x][y].distance > grid[top.x][top.y].distance + 1) {
          grid[x][y].distance = grid[top.x][top.y].distance + 1;
          grid[x][y].x = top.x;
          grid[x][y].y = top.y;
          visitedNodes.push({ x, y });
          priorityQueue.push({ cost: grid[x][y].distance, x, y });
        }
      }
    }
  
    return { path: [], visitedNodes, error: "Path not found" };
  }
  
  export default Dijkstra;