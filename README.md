Smart Event Scheduler & Budget Optimizer

A web-based tool that plans events efficiently within given **budget and time limits**.  
It combines three core algorithms to deliver intelligent scheduling and cost optimization.


Overview

The Smart Event Scheduler & Budget Optimizer helps users plan events while maximizing profit, avoiding time conflicts, and minimizing travel distance.

 Key Features
- Smart Scheduling: Avoid overlapping events automatically.
- Budget Optimization: Choose the most profitable combination of events.
- Shortest Route Calculation: Compute optimal travel paths using coordinates.
- Algorithm Demonstration: Combines Dynamic Programming, Greedy, and Graph concepts.
- Interactive UI: Simple, intuitive web interface using HTML, CSS, and JavaScript.

---

Algorithms Used

 0/1 Knapsack (Dynamic Programming)
Maximizes total profit while keeping the total cost ≤ budget
For each event:
  if (cost <= remaining_budget)
     choose max(profit + include, exclude)

     

Activity Selection (Greedy)
Selects maximum non-overlapping events by sorting by end time.
Sort events by end time.
Pick event if its start ≥ last selected event's end.
Used For: Creating an optimal event schedule.



Bellman-Ford Algorithm (Graph / Shortest Path)
Finds shortest travel paths from the user's start location to all selected events.
Initialize dist[v] = ∞, dist[start] = 0
Repeat |V|-1 times:
  for each edge (u,v,w):
     if dist[u] + w < dist[v]:
         dist[v] = dist[u] + w
Used For: Computing least travel distance between coordinates.


Tech Stack
  Frontend: HTML5, CSS3, JavaScript (Vanilla)
  Algorithms: 0/1 Knapsack, Activity Selection, Bellman–Ford
  Visualization: Dynamic result rendering with responsive design
