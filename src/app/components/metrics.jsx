"use client"
import React, { useState, useEffect } from "react";

import { Tooltip } from "antd";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineInfo } from "react-icons/md";

const currentStats = {
  mae: 10.6,
  rmse: 14.5,
  rsquared: 0.79,
  maeDeviation: 0,
  rmseDeviation: 0,
  rsquaredDeviation: 0,
};
const Metrics = ({ updatedMetrics }) => {
  const [currentMetrics, setCurrentMetrics] = useState(currentStats);

  useEffect(() => {
    if (!updatedMetrics) return;
    const calculateDeviation = (newVal, oldVal) => {
      return oldVal === 0 ? 0 : (((newVal - oldVal) / oldVal) * 100);
    };
    const newMetrics = {
      ...currentMetrics,
      mae: updatedMetrics?.mae || currentMetrics.mae,
      rmse: updatedMetrics?.rmse || currentMetrics.rmse,
      rsquared: updatedMetrics?.rsquared || currentMetrics.rsquared,
      maeDeviation:
        updatedMetrics?.mae !== currentStats?.mae
          ? calculateDeviation(updatedMetrics?.mae, currentStats?.mae)
          : 0,
      rmseDeviation:
        updatedMetrics?.rmse !== currentStats?.rmse
          ? calculateDeviation(updatedMetrics?.rmse, currentStats?.rmse)
          : 0,
      rsquaredDeviation:
        updatedMetrics?.rsquared !== currentStats?.rsquared
          ? calculateDeviation(updatedMetrics?.rsquared, currentStats?.rsquared)
          : 0,
    };
    setCurrentMetrics(newMetrics);
  }, [updatedMetrics]);

  return (
    <div>
      {/* Desktop Metrics */}
      <div className="w-full md:w-auto pb-8 md:ml-2 lg:ml-8 hidden sm:block">
        <div className="flex flex-col">
          <div className="flex flex-row gap-1 h-[56px] items-start">
            <div className="pb-6 text-3xl text-zinc-300">Metrics </div>
            <Tooltip
              placement="right"
              title="Metrics are quantitative measures used to evaluate, compare, and track performance or outcomes."
            // Model trained on 12/11/2000 - 12/11/2024, tested on 12/11/2022 - 12/11/2024"
            >
              <div>
                <MdOutlineInfo size={18} />
              </div>
            </Tooltip>
          </div>
          <div className="flex flex-col flex-stretch gap-[50px] flex-wrap justify-between">
            <div className="p-3 md:p-0 lg:p-3  border border-[#333333] rounded-md ">
              <div className="flex flex-row justify-between">
                <div className="p-4 text-2xl sm:text-4xl md:text-4xl/[55px] w-auto  lg:w-[300px] text-zinc-300">
                  Mean Absolute Error (MAE)
                </div>

                <div className="pt-4 flex flex-row gap-4">
                  <div className="flex flex-col">
                    <div className="px-4 pb-2 text-4xl md:text-6xl text-zinc-300">
                      {currentMetrics.mae}
                    </div>
                    {currentMetrics.maeDeviation != 0 && <div className="px-4 pb-4 text-base text-zinc-300">{currentMetrics.maeDeviation.toFixed(2)}%</div>}
                  </div>
                  <div>
                    <Tooltip
                      placement="top"
                      title={currentMetrics.maeDeviation === 0
                        ? `This is the best-performing model with an error (MAE) of ${currentMetrics.mae}.`
                        : `The model has a deviation of ${currentMetrics.maeDeviation?.toFixed(2)}% from the best-performing model.`}
                    >
                      <div className="pr-4">
                        <BsThreeDots color="white" size={30} className="" />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-0 lg:p-3  border border-[#333333] rounded-md ">
              <div className="flex flex-row justify-between">
                <div className="p-4 text-4xl md:text-4xl/[55px] w-auto lg:w-[300px] text-zinc-300">
                  Root Mean Squared Error
                </div>

                <div className="pt-4 flex flex-row gap-4">
                  <div className="flex flex-col">
                    <div className="px-4 pb-2 text-4xl md:text-6xl text-zinc-300">
                      {currentMetrics.rmse}
                    </div>
                    {currentMetrics.rmseDeviation != 0 && <div className="px-4 pb-4 text-base text-zinc-300">{currentMetrics?.rmseDeviation.toFixed(2)}%</div>}
                  </div>
                  <div>
                    <Tooltip
                      placement="top"
                      title={currentMetrics.rmseDeviation === 0
                        ? `This is the best-performing model with an error (RMSE) of ${currentMetrics.rmse}.`
                        : `The model has a deviation of ${currentMetrics.rmseDeviation?.toFixed(2)}% from the best-performing model.`}

                    >
                      <div className="pr-4">
                        <BsThreeDots color="white" size={30} className="" />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-0 lg:p-3 border border-[#333333] rounded-md ">
              <div className="flex flex-row justify-between">
                <div className="p-4 text-4xl md:text-4xl/[55px] w-auto lg:w-[300px] text-zinc-300">
                  R<sup>2</sup> Score
                </div>

                <div className="pt-4 flex flex-row gap-4">
                  <div className="flex flex-col">
                    <div className="px-4 pb-2 text-4xl md:text-6xl text-zinc-300">
                      {currentMetrics.rsquared}
                    </div>
                    {currentMetrics.rsquaredDeviation != 0 && <div className="px-4 pb-4 ml-4 text-base text-zinc-300">
                      {currentMetrics?.rsquaredDeviation.toFixed(2)}%
                    </div>}
                  </div>
                  <div>
                    <Tooltip placement="top"
                      title={currentMetrics.rsquaredDeviation === 0
                        ? `This is the best-performing model with an error (R-Squared) of ${currentMetrics.rsquared}.`
                        : `The model has a deviation of ${currentMetrics.rsquaredDeviation.toFixed(2)}% from the best-performing model.`}

                    >
                      <div className="pr-4">
                        <BsThreeDots color="white" size={30} className="" />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Metrics */}
      <div className="flex flex-col gap-2 block sm:hidden pb-8">
        <div className="flex flex-row gap-1 items-center">
          <span className="text-lg text-zinc-400">Metrics </span>
          <Tooltip
            placement="left"
            title="Metrics are quantitative measures used to evaluate, compare, and track performance or outcomes."
          >
            <div>
              <MdOutlineInfo size={18} />
            </div>
          </Tooltip>
        </div>
        <div className="flex flex-row gap-4 flex-wrap justify-between">

          <div className="w-96 h-auto border border-[#4F4F4F] rounded-md ">
            <div className="w-full flex flex-row justify-between items-center">
              <div className="p-4 text-lg text-zinc-300">
                Mean Absolute Error (MAE)
              </div>
              <Tooltip
                placement="top"
                title={currentMetrics.maeDeviation === 0
                  ? `This is the best-performing model with an error (MAE) of ${currentMetrics.mae}.`
                  : `The model has a deviation of ${currentMetrics.maeDeviation?.toFixed(2)}% from the best-performing model.`}
              >
                <div className="pr-4">
                  <BsThreeDots color="white" size={30} className="" />
                </div>
              </Tooltip>
            </div>
            <div className="px-4 pb-2 text-4xl text-zinc-300">{currentMetrics.mae}</div>
            {currentMetrics.maeDeviation != 0 && <div className="px-4 pb-4 text-base text-zinc-300">{currentMetrics.maeDeviation.toFixed(2)}%</div>}
          </div>

          <div className="w-96 h-auto border border-[#4F4F4F] rounded-md ">
            <div className="w-full flex flex-row justify-between items-center">
              <div className="p-4 text-lg text-zinc-300">
                Root Mean Squared Error
              </div>
              <Tooltip
                placement="top"
                title={currentMetrics.rmseDeviation === 0
                  ? `This is the best-performing model with an error (RMSE) of ${currentMetrics.rmse}.`
                  : `The model has a deviation of ${currentMetrics.rmseDeviation?.toFixed(2)}% from the best-performing model.`}
              >
                <div className="pr-4">
                  <BsThreeDots color="white" size={30} className="" />
                </div>
              </Tooltip>
            </div>
            <div className="px-4 pb-2 text-4xl text-zinc-300">  {currentMetrics.rmse}</div>
            {currentMetrics.rmseDeviation != 0 && <div className="px-4 pb-4 text-base text-zinc-300">{currentMetrics.rmseDeviation.toFixed(2)}%</div>}
          </div>

          <div className="w-96 h-auto border border-[#4F4F4F] rounded-md ">
            <div className="w-full flex flex-row justify-between items-center">
              <div className="p-4 text-lg text-zinc-300">  R<sup>2</sup> Score</div>
              <Tooltip placement="top"
                title={currentMetrics.rsquaredDeviation === 0
                  ? `This is the best-performing model with an error (R-Squared) of ${currentMetrics.rsquared}.`
                  : `The model has a deviation of ${currentMetrics.rsquaredDeviation.toFixed(2)}% from the best-performing model.`}
              >
                <div className="pr-4">
                  <BsThreeDots color="white" size={30} className="" />
                </div>
              </Tooltip>
            </div>
            <div className="px-4 pb-2 text-4xl text-zinc-300"> {currentMetrics.rsquared}</div>
            {currentMetrics.rsquaredDeviation != 0 && <div className="px-4 pb-4 text-base text-zinc-300">{currentMetrics.rsquaredDeviation.toFixed(2)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
