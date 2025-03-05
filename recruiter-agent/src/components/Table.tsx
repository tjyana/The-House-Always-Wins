"use client";
import React from "react";
import { useState } from "react";

import { ArrowUpDown, Filter, AlertCircle, Clock, Search } from "lucide-react";
import Button from "../components/Button";
import Avatar from "./Avatar";
import AvatarImage from "./AvatarImage";
import Badge from "./Badge";
import Card from "./Card";
import CardContent from "./CardContent";
import CardHeader from "./CardHeader";
import CardTitle from "./CardTitle";
import { AIChat } from "./AiChat";
import { AddTranscript } from "./AddTranscript";
import { loadData } from "@morph-data/components";

interface ChangeRequest {
  id: string;
  candidate: {
    name: string;
    avatar: string;
    role: string;
    company: string;
  };
  salary: string;
  position: string;
  last_completed: number;
  owner: number;
  lastUpdated: string;
  action_status: number;
  next_action: string;
}
interface CardData {
  title: string;
  count: number;
  subtitle: string;
}

export default function Dashboard() {
  const metrics = loadData("example_metrics", "json");
  const [requests] = useState<ChangeRequest[]>([
    {
      id: "1",
      candidate: {
        name: "John Doe",
        avatar: "https://example.com/avatars/john-doe.png",
        role: "Software Engineer",
        company: "TechCorp Inc.",
      },
      salary: "$100,000",
      position: "Frontend Developer",
      last_completed: 75,
      owner: 101,
      lastUpdated: "2023-02-23T10:30:00Z",
      action_status: 3,
      next_action: "Draft Missing Info Email",
    },
    {
      id: "2",
      candidate: {
        name: "Jane Smith",
        avatar: "https://example.com/avatars/jane-smith.png",
        role: "Data Scientist",
        company: "DataCorp LLC",
      },
      salary: "$120,000",
      position: "Data Analyst",
      last_completed: 90,
      owner: 102,
      lastUpdated: "2023-02-22T15:45:00Z",
      action_status: 3,
      next_action: "Draft Missing Info Email",
    },
    {
      id: "3",
      candidate: {
        name: "Alice Johnson",
        avatar: "https://example.com/avatars/alice-johnson.png",
        role: "Product Manager",
        company: "InnovateX",
      },
      salary: "$110,000",
      position: "Product Lead",
      last_completed: 60,
      owner: 103,
      lastUpdated: "2023-02-23T08:20:00Z",
      action_status: 1,
      next_action: "Send Company Pitch",
    },
  ]);

  const cardsData: CardData[] = [
    {
      title: "Pending Tasks",
      count: 24,
      subtitle: "8 require human action",
    },
    {
      title: "AI Processing",
      count: 12,
      subtitle: "Drafting emails & analyzing",
    },
    {
      title: "Completed Today",
      count: 45,
      subtitle: "+12 from yesterday",
    },
  ];

  const handleReviewClick = (requestId: string) => {
    window.location.href = `/changes?candidate_id=${requestId}`;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Task Queue</h1>
          <p className="text-muted-foreground">
            Process and manage candidate interactions
          </p>
        </div>
        <div className="flex gap-4">
          <AIChat />
          <AddTranscript />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search tasks..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-8 mb-3"
          />
        </div>
      </div>
      <div className="flex gap-2 ">
        {cardsData.map((card, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle classname="text-sm font-sm">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.count}</div>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col  items-start">
            <CardTitle classname="">Active tasks</CardTitle>
            <Badge classname={"bg-gray-100 text-gray-800"}>
              {requests.length} Tasks requiring attention or in progress
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6 w-[300px]">
                  Candidate
                </th>
                <th scope="col" className="py-3 px-6">
                  Salary
                </th>
                <th scope="col" className="py-3 px-6">
                  Position
                </th>
                <th scope="col" className="py-3 px-6">
                  Last completed
                </th>
                <th scope="col" className="py-3 px-6">
                  Date
                </th>
                <th scope="col" className="py-3 px-6">
                  Owner
                </th>

                <th scope="col" className="py-3 px-6 text-right">
                  Action required
                </th>
                <th scope="col" className="py-3 px-6 text-right">
                  Next action
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {request.candidate.avatar && (
                          <AvatarImage src={request.candidate.avatar} />
                        )}

                        {!request.candidate.avatar &&
                          request.candidate.name.charAt(0)}
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {request.candidate.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.candidate.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{request.salary}</td>
                  <td className="py-4 px-6">{request.position}</td>
                  <td className="py-4 px-6">
                    {request.last_completed == 1
                      ? "Initial Call"
                      : "AI Decision"}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm">{request.lastUpdated}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge
                      classname={
                        request.owner === 3
                          ? "bg-red-100 text-red-800"
                          : request.owner === 1
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {request.owner === 1 && (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {request.owner === 3
                        ? "Human Action Required"
                        : "AI Processing"}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {
                      <button
                        className={
                          request.action_status === 1 ||
                          request.action_status === 2
                            ? "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                            : "px-2 py-2 rounded-lg disabled"
                        }
                        onClick={() => handleReviewClick(request.id)}
                      >
                        {request.action_status === 1
                          ? "Review & Send Email"
                          : request.action_status === 2
                          ? "Review & Send Pitch"
                          : request.action_status === 3
                          ? "Draft Email"
                          : "Ananlyzing"}
                      </button>
                    }
                  </td>
                  <td>{request.next_action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
