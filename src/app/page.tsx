"use client";
// import Image from "next/image";
import React, { useState } from "react";
import axios from "axios";
import { Layout, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { BsThreeDots } from "react-icons/bs";
const { Header, Content } = Layout;

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "./components/toast";

import LineChart from "@/app/components/line_chart";
import LineChart2 from "@/app/components/line_chart2";
import Metrics from "@/app/components/metrics.jsx";

import Table, { TableDataType } from "@/app/components/table";

const backendURL = process.env.NEXT_PUBLIC_API_URL;
// const backendURL = "http://127.0.0.1:8000/";
// const backendURL = "https://nhtb6hpt-8000.inc1.devtunnels.ms/";

const convertJsonToCsv = (data: TableDataType[]) => {
  // Define headers explicitly
  const headers = [
    "Key",
    "Date",
    "Team 1",
    "Team 2",
    ...Array.from({ length: 11 }).flatMap((_, i) => [
      `Predicted Player ${i + 1} Name`,
      `Predicted Player ${i + 1} Points`,
    ]),
    ...Array.from({ length: 11 }).flatMap((_, i) => [
      `Dream Player ${i + 1} Name`,
      `Dream Player ${i + 1} Points`,
    ]),
    "Total Predicted Points",
    "Total Dream Points",
    "MAE",
    "MAPE",
    "RMSE",
    "RSQUARED",
  ];

  const csvRows = [];
  csvRows.push(headers.join(",")); // Add headers as the first row

  // Flatten each row of data
  for (const row of data) {
    const rowData = [
      row.key,
      row.date,
      row.team_1,
      row.team_2,
      ...Array.from({ length: 11 }).flatMap((_, i) => [
        row.predicted_players[i]?.player_name || "", // Use empty string if data is missing
        row.predicted_players[i]?.predicted_points || "0",
      ]),
      ...Array.from({ length: 11 }).flatMap((_, i) => [
        row.dream_team_players[i]?.player_name || "", // Use empty string if data is missing
        row.dream_team_players[i]?.fantasy_points || "0",
      ]),
      row.totalPredictedPoints,
      row.totalDreamPoints,
      row.mae,
      row.mape,
      row.rmse,
      row.rsquared,
    ];

    csvRows.push(rowData.join(",")); // Add row data as a CSV string
  }

  return csvRows.join("\n"); // Combine all rows with newline separator
};

interface Errors {
  mae?: number;
  mape?: number;
  rmse?: number;
  rsquared?: number;
}
const currentStats = {
  mae: 10.6,
  rmse: 14.5,
  rsquared: 0.79,
};

const ModelUi = () => {
  const [trainDate, setTrainDate] = useState<{
    start: null | string | Date;
    end: null | string | Date;
  }>({ start: null, end: null });
  const [testDate, setTestDate] = useState<{
    start: null | string | Date;
    end: null | string | Date;
  }>({ start: null, end: null });
  const [tableContent, setTableContent] = useState<TableDataType[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDisplayTable, setIsDisplayTable] = useState(false);
  const [averageErrors, setAverageErrors] = useState<Errors>(currentStats);
  // Data Submit Handler
  const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(trainDate, testDate);

    if (
      !trainDate.start ||
      !trainDate.end ||
      !testDate.start ||
      !testDate.end
    ) {
      return notify("Please Enter All the fields");
    }

    const trainDateStartParsed = new Date(trainDate?.start);
    const trainDateEndParsed = new Date(trainDate?.end);
    const testDateStartParsed = new Date(testDate?.start);
    const testDateEndParsed = new Date(testDate?.end);
    if (
      trainDateEndParsed < trainDateStartParsed ||
      testDateEndParsed < testDateStartParsed
    ) {
      return notify(
        "Start Date must be earlier than End Date. Please check your inputs."
      );
    }

    const time30062024 = new Date("2024-06-30T23:59:59.999Z").getTime(); // Correct date: June 30, 2024
    if (trainDateEndParsed.getTime() > time30062024) {
      return notify("Training period must end on or before 30/06/2024");
    }

    const time01012001 = new Date("2001-01-01T00:00:00.000Z").getTime(); // Start date: January 1, 2001
    if (trainDateStartParsed.getTime() < time01012001) {
      return notify("Training period must start on or after 01/01/2001");
    }

    // Calculate the difference in milliseconds
    const timeDifference =
      trainDateEndParsed.getTime() - trainDateStartParsed.getTime();

    // 1 year in milliseconds (365.25 days to account for leap years)
    const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
    // console.log(timeDifference,oneYearInMilliseconds);
    // Check if the difference is at least 1 year
    if (timeDifference < oneYearInMilliseconds) {
      notify(
        "It is recommended to have more than 1 year of data for better performance."
      );
    }

    setIsDisplayTable(true);
    setIsDataLoading(true);
    // fetch data

    const payload = {
      train_start_date: trainDate.start,
      train_end_date: trainDate.end,
      test_start_date: testDate.start,
      test_end_date: testDate.end,
    };

    try {
      const resp = await axios.post(`${backendURL}train_and_test`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(resp.data.matches);
      const parsedData = resp.data.matches;

      const updatedData = parsedData.map((block: TableDataType) => {
        // Deep copy the block
        const updatedBlock = {
          ...block,
          dream_team_players: block.dream_team_players
            ? [...block.dream_team_players]
            : [],
          predicted_players: block.predicted_players
            ? [...block.predicted_players]
            : [],
        };

        if (updatedBlock.dream_team_players.length >= 1) {
          const firstDreamPlayer = updatedBlock.dream_team_players[0];
          if (firstDreamPlayer?.fantasy_points !== undefined) {
            updatedBlock.dream_team_players[0] = {
              ...firstDreamPlayer, // Create a copy of the player object
              fantasy_points: firstDreamPlayer.fantasy_points * 2,
            };
          }

          if (updatedBlock.predicted_players.length >= 1) {
            const firstPredictedPlayer = updatedBlock.predicted_players[0];
            if (firstPredictedPlayer?.predicted_points !== undefined) {
              updatedBlock.predicted_players[0] = {
                ...firstPredictedPlayer, // Create a copy of the predicted player object
                predicted_points: firstPredictedPlayer.predicted_points * 2,
              };
            }
          }
        }

        // Update the second player's fantasy points
        if (updatedBlock.dream_team_players.length >= 2) {
          const secondDreamPlayer = updatedBlock.dream_team_players[1];
          if (secondDreamPlayer?.fantasy_points !== undefined) {
            updatedBlock.dream_team_players[1] = {
              ...secondDreamPlayer, // Create a copy of the second player object
              fantasy_points: secondDreamPlayer.fantasy_points * 1.5,
            };
          }

          if (updatedBlock.predicted_players.length >= 2) {
            const secondPredictedPlayer = updatedBlock.predicted_players[1];
            if (secondPredictedPlayer?.predicted_points !== undefined) {
              updatedBlock.predicted_players[1] = {
                ...secondPredictedPlayer, // Create a copy of the second predicted player object
                predicted_points: secondPredictedPlayer.predicted_points * 1.5,
              };
            }
          }
        }

        return updatedBlock;
      });

      console.log("updateddata", updatedData);

      let totmae: number = 0;
      let totmape: number = 0;
      let totrmse: number = 0;
      let totrSquared: number = 0;

      const rowData = updatedData.map((row: TableDataType, index: number) => {
        const actualPoints = row.dream_team_players.map(
          ({ fantasy_points = 0 }) => fantasy_points
        );
        const predictedPoints = row.predicted_players.map(
          ({ predicted_points = 0 }) => predicted_points
        );

        const meanActualPoints =
          actualPoints.reduce((sum, value) => sum + value, 0) /
          actualPoints.length;

        const ssRes = actualPoints.reduce((sum, actual, i) => {
          const predicted = predictedPoints[i] || 0;
          return sum + Math.pow(actual - predicted, 2);
        }, 0);

        const ssTot = actualPoints.reduce((sum, actual) => {
          return sum + Math.pow(actual - meanActualPoints, 2);
        }, 0);

        const rSquared = ssTot !== 0 ? 1 - ssRes / ssTot : 1;

        const squaredError = row.dream_team_players.reduce(
          (sum: number, { fantasy_points = 0 }, i) => {
            const predicted_points =
              row.predicted_players[i]?.predicted_points || 0;
            return sum + Math.pow(fantasy_points - predicted_points, 2);
          },
          0
        );

        const absoluteError = row.dream_team_players.reduce(
          (sum: number, { fantasy_points = 0 }, i) => {
            const predicted_points =
              row.predicted_players[i]?.predicted_points || 0;
            return sum + Math.abs(fantasy_points - predicted_points);
          },
          0
        );

        const mae = absoluteError / 11;
        const mape =
          (row.dream_team_players.reduce(
            (sum: number, { fantasy_points = 0 }, i) => {
              const predicted_points =
                row.predicted_players[i]?.predicted_points || 0;
              return fantasy_points !== 0 // Avoid division by zero
                ? sum +
                    Math.abs(
                      (fantasy_points - predicted_points) / fantasy_points
                    )
                : sum;
            },
            0
          ) /
            11) *
          100;
        const rmse = Math.sqrt(squaredError / 11);

        // Accumulate errors for average calculation
        totmae += mae;
        totmape += mape;
        totrmse += rmse;
        totrSquared += rSquared;

        return {
          ...row,
          key: index,
          totalPredictedPoints: row.predicted_players
            .reduce(
              (sum: number, { predicted_points = 0 }) => sum + predicted_points,
              0
            )
            .toFixed(2),
          totalDreamPoints: row.dream_team_players
            .reduce(
              (sum: number, { fantasy_points = 0 }) => sum + fantasy_points,
              0
            )
            .toFixed(2),
          mae: mae.toFixed(2),
          mape: mape.toFixed(2),
          rmse: rmse.toFixed(2),
          rsquared: rSquared.toFixed(2),
        };
      });

      const averageErrors: Errors = {
        mae: parseFloat((totmae / rowData.length).toFixed(2)),
        mape: parseFloat((totmape / rowData.length).toFixed(2)),
        rmse: parseFloat((totrmse / rowData.length).toFixed(2)),
        rsquared: parseFloat((totrSquared / rowData.length).toFixed(2)),
      };

      setAverageErrors(averageErrors);
      console.log("Average Errors:", averageErrors);

      setTableContent(rowData);
    } catch (err) {
      console.log(err);
      notify("Some Error Occured");
      setIsDisplayTable(false);
    } finally {
      setIsDataLoading(false);
    }
  };

  const downloadCsv = (data: TableDataType[], filename: string) => {
    const csvData = convertJsonToCsv(data);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute("download", filename);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout
      style={{ minHeight: "100vh", backgroundColor: "#1e1e1e", color: "white" }}
      className="p-3 sm:p-6"
    >
      {/* Main Content */}
      <Layout>
        <Header className="bg-[#1e1e1e] p-0 pb-6 sm:p-6 h-auto  flex md:justify-center md:items-center">
          <div
            className="text-3xl sm:text-4xl md:text-6xl text-zinc-300 break-words "
            style={{ margin: 0 }}
          >
            EDGE 11 Model Performance Dashboard
          </div>
        </Header>

        <Content className="text-zinc-300 sm:p-6 lg:pl-16 bg-[#1e1e1e]">
          <div className="flex flex-col md:flex-row justify-center md:gap-4 lg:gap-12">
            <div className="w-full md:w-1/3 min-w-[250px]">
              <div
                className="pb-6 text-3xl text-zinc-300"
                style={{ margin: 0 }}
              >
                Model Evaluation
              </div>
              <div className="flex flex-col gap-8 mb-8 p-8 rounded-lg border-2 border-[#333333]">
                <div className="flex flex-col gap-2">
                  <span className="text-2xl pb-2">Training Period</span>
                  <div className="flex flex-col flex-stretch pb-2">
                    <span className="text-base py-1">Start Date:</span>
                    <input
                      type="date"
                      // value={trainDate.start || 0}
                      value={
                        trainDate.start
                          ? new Date(trainDate.start)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setTrainDate((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                      className="bg-[#1e1e1e] text-white border border-[#4F4F4F] p-1 py-2 rounded"
                      placeholder="Start Date"
                    />
                  </div>

                  <div className="flex flex-col flex-stretch">
                    <span className="text-base py-1">End Date:</span>
                    <input
                      type="date"
                      // value={trainDate.end || 0}
                      value={
                        trainDate.end
                          ? new Date(trainDate.end).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setTrainDate((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                      className="bg-[#1e1e1e] text-white border border-[#4F4F4F] p-1 py-2 rounded"
                      placeholder="Start Date"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-2xl pb-2">Testing Period</span>

                  <div className="flex flex-col flex-stretch pb-2">
                    <span className="text-base py-1">Start Date:</span>
                    <input
                      type="date"
                      // value={testDate.start || 0}
                      value={
                        testDate.start
                          ? new Date(testDate.start).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setTestDate((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                      className="bg-[#1e1e1e] text-white border border-[#4F4F4F] p-1  py-2 rounded"
                      placeholder="Start Date"
                    />
                  </div>
                  <div className="flex flex-col flex-stretch">
                    <span className="text-base py-1">End Date:</span>
                    <input
                      type="date"
                      // value={testDate?.end || 0}
                      value={
                        testDate.end
                          ? new Date(testDate.end).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setTestDate((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                      className="bg-[#1e1e1e] text-white border border-[#4F4F4F] p-1 py-2 rounded"
                      placeholder="Start Date"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    className="py-2 px-4 rounded-md text-sm  text-white w-24 mt-4 bg-[#3F3F3F] hover:bg-[#4086FF]"
                    onClick={(e) => submitHandler(e)}
                    disabled={isDataLoading}
                  >
                    {isDataLoading ? <LoadingOutlined spin /> : "Submit"}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <Metrics updatedMetrics={averageErrors} />
            </div>
          </div>

          {isDisplayTable && (
            <div id="table" className="relative">
              <div className="pb-6 text-3xl text-zinc-300">Tabular Data</div>
              {tableContent.length > 0 && (
                <div className="absolute right-0 top-[-18px]">
                  <button
                    className="py-2 px-4 rounded-md text-sm text-white mt-4 bg-[#3F3F3F] hover:bg-[#4086FF]"
                    onClick={() => {
                      downloadCsv(tableContent, "12/11/11");
                    }}
                  >
                    Download .CSV File
                  </button>
                </div>
              )}
              <Table dataSource={tableContent} loading={isDataLoading} />
            </div>
          )}

          {tableContent.length > 0 && (
            <div id="graphs" className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 pt-4">
                <span className="text-lg text-zinc-400">
                  Performance Visualisation
                </span>
                <div className="flex flex-col md:flex-row gap-4 flex-wrap justify-between">
                  <div className="w-full md:w-calc-half-minus-20 border border-[#4F4F4F] rounded-md">
                    {/* <div className="text-lg text-zinc-400 pt-4 pl-4">Predicted vs Actual</div> */}
                    <div className="w-full flex flex-row justify-between items-center">
                      <div className="p-4 text-lg text-zinc-400">
                        Predicted vs Actual
                      </div>
                      <Tooltip
                        placement="top"
                        title="Predicted Data vs Actual Data Plot"
                      >
                        <div className="pr-4">
                          <BsThreeDots color="white" size={30} className="" />
                        </div>
                      </Tooltip>
                    </div>
                    <LineChart dataset={tableContent} />
                  </div>

                  <div className="w-full md:w-calc-half-minus-20 border border-[#4F4F4F] rounded-md">
                    <div className="w-full flex flex-row justify-between items-center">
                      <div className="p-4 text-lg text-zinc-400">
                        MAE Trends
                      </div>
                      <Tooltip
                        placement="top"
                        title="Mean Absolute Error (MAE) is the average absolute difference between predictions and actual values."
                      >
                        <div className="pr-4">
                          <BsThreeDots color="white" size={30} className="" />
                        </div>
                      </Tooltip>
                    </div>
                    <LineChart2 dataset={tableContent} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <ToastContainer draggable />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ModelUi;
