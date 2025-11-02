let events = [];

document.getElementById("addEventBtn").addEventListener("click", addEvent);
document.getElementById("runBtn").addEventListener("click", runAlgorithms);

function addEvent() {
  const name = document.getElementById("name").value.trim();
  const cost = parseFloat(document.getElementById("cost").value);
  const profit = parseFloat(document.getElementById("profit").value);
  const start = parseFloat(document.getElementById("start").value);
  const end = parseFloat(document.getElementById("end").value);
  const x = parseFloat(document.getElementById("x").value);
  const y = parseFloat(document.getElementById("y").value);

  if (!name || isNaN(cost) || isNaN(profit) || isNaN(start) || isNaN(end) || isNaN(x) || isNaN(y)) {
    alert("Please fill in all event details including coordinates!");
    return;
  }

  if (start >= end) {
    alert("Start time must be before end time!");
    return;
  }

  events.push({ name, cost, profit, start, end, x, y });
  document.querySelectorAll("input").forEach(i => (i.value = ""));
  displayEvents();
}

function displayEvents() {
  const container = document.getElementById("eventsContainer");
  container.innerHTML = "";
  if (events.length === 0) {
    container.innerHTML = `<div class="empty-state">No events added yet</div>`;
    return;
  }

  events.forEach((e, i) => {
    container.innerHTML += `
      <div class="event-card">
        <h3>${e.name}</h3>
        <p>Cost: ₹${e.cost}</p>
        <p>Profit: ₹${e.profit}</p>
        <p>Time: ${e.start} - ${e.end}</p>
        <p>Coordinates: (${e.x}, ${e.y})</p>
        <button onclick="deleteEvent(${i})">❌ Remove</button>
      </div>
    `;
  });
}

function deleteEvent(index) {
  events.splice(index, 1);
  displayEvents();
}

function runAlgorithms() {
  const budget = parseFloat(document.getElementById("budget").value);
  const startX = parseFloat(document.getElementById("startX").value);
  const startY = parseFloat(document.getElementById("startY").value);

  if (isNaN(budget) || isNaN(startX) || isNaN(startY)) {
    alert("Please enter a valid budget and starting coordinates!");
    return;
  }

  if (events.length === 0) {
    alert("Add some events first!");
    return;
  }

  const n = events.length;
  const W = Math.floor(budget);
  const dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (events[i - 1].cost <= w) {
        dp[i][w] = Math.max(
          events[i - 1].profit + dp[i - 1][w - events[i - 1].cost],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  let w = W;
  let selected = [];
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(events[i - 1]);
      w -= events[i - 1].cost;
    }
  }
  selected.reverse();

  let knapsackHTML = "<h3>💰 0/1 Knapsack Result</h3>";
  selected.forEach(e => {
    knapsackHTML += `<p>✅ ${e.name} (Cost ₹${e.cost}, Profit ₹${e.profit})</p>`;
  });
  knapsackHTML += `<p><strong>Total Profit: ₹${dp[n][W]} | Budget Used: ₹${budget - w}</strong></p>`;
  document.getElementById("knapsack").innerHTML = knapsackHTML;

  let chosen = [...selected].sort((a, b) => a.end - b.end);
  let scheduled = [];
  let lastEnd = 0;
  for (let e of chosen) {
    if (e.start >= lastEnd) {
      scheduled.push(e);
      lastEnd = e.end;
    }
  }

  let scheduleHTML = "<h3>🕒 Optimal Schedule</h3>";
  scheduled.forEach(e => (scheduleHTML += `<p>✅ ${e.name} (${e.start} - ${e.end})</p>`));
  if (scheduled.length === 0) scheduleHTML += "<p>No non-overlapping events found.</p>";
  document.getElementById("schedule").innerHTML = scheduleHTML;

  let vertices = ["start", ...scheduled.map(e => e.name)];
  let edges = [];

  for (let i = 0; i < scheduled.length; i++) {
    for (let j = 0; j < scheduled.length; j++) {
      if (i !== j) {
        const w = Math.sqrt(
          (scheduled[i].x - scheduled[j].x) ** 2 + (scheduled[i].y - scheduled[j].y) ** 2
        );
        edges.push({ src: scheduled[i].name, dest: scheduled[j].name, weight: w });
      }
    }
  }

  scheduled.forEach(e => {
    const w = Math.sqrt((e.x - startX) ** 2 + (e.y - startY) ** 2);
    edges.push({ src: "start", dest: e.name, weight: w });
  });

  let dist = {};
  vertices.forEach(v => (dist[v] = Infinity));
  dist["start"] = 0;

  for (let i = 0; i < vertices.length - 1; i++) {
    for (let { src, dest, weight } of edges) {
      if (dist[src] + weight < dist[dest]) {
        dist[dest] = dist[src] + weight;
      }
    }
  }

  let bellmanHTML = "<h3>📍 Shortest Distances using Bellman-Ford</h3>";
  scheduled.forEach(e => {
    bellmanHTML += `<p>To ${e.name} → Distance: ${dist[e.name].toFixed(2)} units</p>`;
  });
  document.getElementById("bellmanford").innerHTML = bellmanHTML;

  document.getElementById("results").classList.remove("hidden");
}
