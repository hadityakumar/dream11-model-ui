
// "use client";
// import React, { useState } from "react";
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
// import { Line } from "react-chartjs-2";

// ChartJS.register(CategoryScale, LineElement, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

// const MyLineChart = ({ dataset = [] }) => {
//   // Check if dataset is valid
//   if (!Array.isArray(dataset)) {
//     console.error("Invalid dataset provided to MyLineChart");
//     dataset = []; // Fallback to an empty array
//   }

//   const [currentPage, setCurrentPage] = useState(1); // Track current page
//   const itemsPerPage = 25;

//   // Pagination logic
//   const totalPages = Math.ceil(dataset.length / itemsPerPage);
//   const paginatedData = dataset.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   // Extract data for the current page
//   const labels = paginatedData.map((item) => item.date || "Unknown Date"); // X-axis labels (dates)
//   const MAEs = paginatedData.map((item) => item.mae || 0); // Line 1
//   // const totalDreamPoints = paginatedData.map((item) => item.totalDreamPoints || 0); // Line 2

//   // Chart Data
//   const data = {
//     labels: labels,
//     datasets: [
//       {
//         label: "MAE",
//         data: MAEs,
//         fill: false,
//         borderColor: "rgb(75, 192, 192)",
//         tension: 0.1,
//       },
//       // {
//       //   label: "Total Dream Points",
//       //   data: totalDreamPoints,
//       //   fill: false,
//       //   borderColor: "#FF8888",
//       //   tension: 0.1,
//       // },
//     ],
//   };

//   // Chart Options
//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         title: {
//           display: true,
//           text: "Points",
//         },
//       },
//       x: {
//         title: {
//           display: true,
//           text: "Date",
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           usePointStyle: true,
//           color: "#FFFFFF",
//         },
//       },
//     },
//   };

//   // Pagination Handler
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   return (
//     <div>
//       <div style={{ width: "100%", minHeight: "350px", margin: "0 auto" }}>
//         <Line data={data} options={options} className="text-[#FFFFFF]" />
//         {/* Pagination Controls */}
//       </div>
//       <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           style={{ margin: "0 5px", padding: "5px 10px" }}
//         >
//           Previous
//         </button>
//         <span style={{ margin: "0 10px" }}>
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           style={{ margin: "0 5px", padding: "5px 10px" }}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MyLineChart;

"use client";
import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LineElement, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

const MyLineChart = ({ dataset }) => {
  // Check if dataset is valid
  if (!Array.isArray(dataset)) {
    console.error("Invalid dataset provided to MyLineChart");
    dataset = []; // Fallback to an empty array
  }

  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage, setItemsPerPage] = useState(25); // Default items per page

  // Pagination logic
  const totalPages = Math.ceil(dataset.length / itemsPerPage);
  const paginatedData = dataset.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Extract data for the current page
  const labels = paginatedData.map((item) => item.date || "Unknown Date"); // X-axis labels (dates)
  const MAEs = paginatedData.map((item) => item.mae || 0); // Line 1

  // Chart Data
  const data = {
    labels: labels,
    datasets: [
      {
        label: "MAE",
        data: MAEs,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: "Points",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          color: "#FFFFFF",
        },
      },
    },
  };

  // Pagination Handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Items per Page Handler
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="pb-4">
      <div style={{ width: "100%", minHeight: "350px", margin: "0 auto" }}>
        <Line data={data} options={options} className="text-[#FFFFFF]" />
      </div>

      {/* Pagination Controls */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ margin: "0 5px", padding: "5px 10px" }}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ margin: "0 5px", padding: "5px 10px" }}
        >
          Next
        </button>
      </div>

      {/* Slider for Items Per Page */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
        <label htmlFor="itemsPerPage" style={{ marginBottom: "5px" }}>
          Number of Data Points per Page: {itemsPerPage}
        </label>
        <input
          id="itemsPerPage"
          type="range"
          min="5"
          max="100"
          step="5"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          style={{ width: "50%" }}
        />
      </div>
    </div>
  );
};

export default MyLineChart;
