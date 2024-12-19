"use client";
import React from "react";
import { Table, ConfigProvider, Skeleton } from "antd";
import type { TableColumnsType } from "antd";
import "./Table.css"; // Importing custom CSS for separators

const formatDate = (date: string): string => {
  const parsedDate = new Date(date);
  return parsedDate?.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export interface PredictedPlayer {
  player_name?: string;
  predicted_points?: number;
}
export interface DreamPlayer {
  player_name?: string;
  fantasy_points?: number;
}

export interface TableDataType {
  key: number;
  date?: string;
  venue?: string;
  team_1: string;
  team_2: string;
  predicted_players: PredictedPlayer[];
  dream_team_players: DreamPlayer[];
  totalPredictedPoints: number;
  totalDreamPoints: number;
  mae: number;
  mape?: number;
  rmse?: number;
  rsquared?: number;
}
export interface SkeletonRow {
  key: number;
  date?: JSX.Element;
  venue?: JSX.Element;
  team_1: JSX.Element;
  team_2: JSX.Element;
  predicted_players: {
    player_name: JSX.Element;
    predicted_points: JSX.Element;
  }[];
  dream_team_players: {
    player_name: JSX.Element;
    fantasy_points: JSX.Element;
  }[];
  totalPredictedPoints: JSX.Element;
  totalDreamPoints: JSX.Element;
  mae: JSX.Element;
  mape: JSX.Element;
  rmse: JSX.Element;
  rsquared?: JSX.Element;
}

const columns: TableColumnsType<TableDataType | SkeletonRow> = [
  {
    title: "Match Date",
    width: 100,
    dataIndex: "date",
    key: "date",
    fixed: "left",
    className: "column-separator border-left", // Custom class for vertical separators
    // render: (date) => formatDate(date),
    render: (date) => {
      return typeof date === "string" ? formatDate(date) : date;
    },
  },
  {
    title: "Team 1",
    width: 100,
    dataIndex: "team_1",
    key: "team_1",
    className: "column-separator",
  },
  {
    title: "Team 2",
    dataIndex: "team_2",
    key: "team_2",
    width: 100,
    className: "column-separator",
  },
  ...Array.from({ length: 11 }).flatMap((_, i) => [
    {
      title: `Predicted Player ${i + 1}`,
      dataIndex: ["predicted_players", i, "player_name"],
      key: `player${i + 1}`,
      width: 150,
      className: "column-separator",
    },
    {
      title: `Predicted Player ${i + 1} Points`,
      dataIndex: ["predicted_players", i, "predicted_points"],
      key: `player${i + 1}Points`,
      width: 150,
      className: "column-separator",
      render: (predicted_points: number | JSX.Element) => {
        return typeof predicted_points === "number"
          ? predicted_points.toFixed(2)
          : predicted_points;
      },
    },
  ]),
  ...Array.from({ length: 11 }).flatMap((_, i) => [
    {
      title: `Dream Team Player ${i + 1}`,
      dataIndex: ["dream_team_players", i, "player_name"],
      key: `dreamPlayer${i + 1}`,
      width: 150,
      className: "column-separator",
    },
    {
      title: `Dream Team Player ${i + 1} Points`,
      dataIndex: ["dream_team_players", i, "fantasy_points"],
      key: `dreamPlayer${i + 1}Points`,
      width: 150,
      className: "column-separator",
    },
  ]),
  {
    title: "Total Points Predicted",
    dataIndex: "totalPredictedPoints",
    key: "totalPredictedPoints",
    width: 150,
    className: "column-separator",
  },
  {
    title: "Total Dream Points Predicted",
    dataIndex: "totalDreamPoints",
    key: "totalDreamPoints",
    width: 150,
    className: "column-separator",
  },
  {
    title: "Total MAE",
    dataIndex: "mae",
    key: "MAE",
    width: 150,
    className: "column-separator",
  },
  {
    title: "MAPE",
    dataIndex: "mape",
    key: "MAPE",
    width: 150,
    className: "column-separator",
  },
  {
    title: "RMSE",
    dataIndex: "rmse",
    key: "RMSE",
    width: 150,
    className: "column-separator",
  },
  {
    title: (
      <span>
        R<sup>2</sup> Score
      </span>
    ),
    dataIndex: "rsquared",
    key: "RSQUARED",
    width: 150,
    className: "column-separator",
  },
];

interface TablexProps {
  dataSource?: TableDataType[] | SkeletonRow[];
  loading?: boolean;
}

const generateSkeletonRows = (rowCount: number): SkeletonRow[] => {
  return Array.from({ length: rowCount }, (_, index) => ({
    key: index,
    date: <Skeleton.Input active size="small" style={{ width: 80 }} />,
    team_1: <Skeleton.Input active size="small" style={{ width: 80 }} />,
    team_2: <Skeleton.Input active size="small" style={{ width: 80 }} />,
    predicted_players: Array.from({ length: 11 }).map(() => ({
      player_name: (
        <Skeleton.Input active size="small" style={{ width: 100 }} />
      ),
      predicted_points: (
        <Skeleton.Input active size="small" style={{ width: 50 }} />
      ),
    })),
    dream_team_players: Array.from({ length: 11 }).map(() => ({
      player_name: (
        <Skeleton.Input active size="small" style={{ width: 100 }} />
      ),
      fantasy_points: (
        <Skeleton.Input active size="small" style={{ width: 50 }} />
      ),
    })),
    totalPredictedPoints: (
      <Skeleton.Input active size="small" style={{ width: 50 }} />
    ),
    totalDreamPoints: (
      <Skeleton.Input active size="small" style={{ width: 50 }} />
    ),
    mae: <Skeleton.Input active size="small" style={{ width: 50 }} />,
    mape: <Skeleton.Input active size="small" style={{ width: 50 }} />,
    rmse: <Skeleton.Input active size="small" style={{ width: 50 }} />,
    rsquared: <Skeleton.Input active size="small" style={{ width: 50 }} />,
  }));
};

const Tablex: React.FC<TablexProps> = ({ dataSource, loading }) => {
  const skeletonRows = generateSkeletonRows(10);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "#1E1E1E",
          colorLink: "#4086FF",
          colorLinkActive: "#3060CC",
          colorLinkHover: "#4086FF",
          colorPrimary: "#EEEEEE",
          colorPrimaryBorder: "#606060",
          colorSplit: "#333333",
          colorText: "#FFFFFF",
          colorTextDescription: "#B0B0B0",
          colorTextDisabled: "#606060",
          colorTextHeading: "#FFFFFF",
          controlItemBgActive: "#333333",
          controlItemBgHover: "#292929",
          opacityLoading: 0.7,
        },
        components: {
          Table: {
            bodySortBg: "#1E1E1E",
            borderColor: "#333333",
            filterDropdownMenuBg: "#292929",
            headerBg: "#333333",
            headerColor: "#FFFFFF",
            rowHoverBg: "#2A2A2A",
            rowSelectedBg: "#404040",
            rowSelectedHoverBg: "#505050",
            stickyScrollBarBg: "#444444",
          },
        },
      }}
    >
      <div
        style={{
          border: "0px solid #333333",
          borderRadius: "0px",
          overflow: "hidden",
        }}
      >
        <Table<TableDataType | SkeletonRow>
          className="custom-table"
          style={{
            minHeight: "200px",
            color: "#FFFFFF",
            backgroundColor: "#1E1E1E",
          }}
          columns={columns}
          dataSource={loading ? skeletonRows : dataSource}
          scroll={{ x: "max-content", y: 80 * 7 }}
          pagination={{
            showSizeChanger: false,
            pageSize: 20,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default Tablex;
