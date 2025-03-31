// Get the chart context
var ctx_line = document.getElementById("lineChart").getContext("2d");

// Create the chart
var lineChart = new Chart(ctx_line, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Sales",
        data: [120, 190, 300, 250, 220, 280, 350, 150,800], // Sample data
        borderColor: "blue",
        borderWidth: 2,
        fill: false, // Do not fill under the line
        tension: 0.4, // Smooth curve
      },
      {
        label: "User",
        data: [50, 90, 150, 250, 422, 144, 500, 100, 500], // Sample data
        borderColor: "red",
        borderWidth: 2,
        fill: false, // Do not fill under the line
        tension: 0.4, // Smooth curve
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

let ctx_donut = document.getElementById("donutChart").getContext("2d");

let donutChart = new Chart(ctx_donut, {
  type: "doughnut",
  data: {
    labels: ["Product", "Category", "Order"],
    datasets: [
      {
        label: "Data",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    responsive: false, // Disable auto resizing
    maintainAspectRatio: false, // Allow custom size
  },
});
