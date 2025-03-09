"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
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
import { loadData, postData } from "@morph-data/components";

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
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState([]);
  let getTasks = async () => {
    const res = await axios.post(
      "http://localhost:8080/cli/run/tasks_data/json",
      {}
    );
    setTasks(JSON.parse(res.data.data.items[0].value));
    setCounts(JSON.parse(res.data.data.items[0].counts));
  };
  useEffect(() => {
    getTasks();
  }, []);
  console.log(tasks);
  console.log(counts);
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
        {counts.map((count: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle classname="text-sm font-sm">
                {count?.status == 1
                  ? "Completed"
                  : count?.status == 2
                  ? "Drafting emails & analyzing"
                  : "Pending"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count?.count}</div>
              <p className="text-xs text-muted-foreground">
                {count?.status == 1
                  ? "+12 from yesterday"
                  : count?.status == 2
                  ? "AI Processing"
                  : "8 require human action"}
              </p>
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
              {tasks.map((task: any, i) => (
                <tr
                  key={i}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        JD
                        {/* {task.candidate.avatar && (
                          <AvatarImage src={task.candidate.avatar} />
                        )}

                        {!task.candidate.avatar &&
                          task.candidate.name.charAt(0)} */}
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {task?.first_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {task?.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{task?.salary}</td>
                  <td className="py-4 px-6">{task?.position}</td>
                  <td className="py-4 px-6">
                    {task?.task == 1 ? "Initial Call" : "AI Decision"}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm">{task?.lastUpdated}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge
                      classname={
                        task?.owner === 3
                          ? "bg-red-100 text-red-800"
                          : task?.owner === 1
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {task?.owner === 1 && (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {task?.owner === 3
                        ? "Human Action Required"
                        : "AI Processing"}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {
                      <button
                        className={
                          task.task == 1 || task.task == 2
                            ? "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                            : "px-2 py-2 rounded-lg disabled"
                        }
                        onClick={() => handleReviewClick(task.task_id)}
                      >
                        {task?.task == 1
                          ? "Review & Send Email"
                          : task?.task === 2
                          ? "Review & Send Pitch"
                          : task?.task === 3
                          ? "Draft Email"
                          : "Ananlyzing"}
                      </button>
                    }
                  </td>
                  <td>
                    {task?.task == 1
                      ? "pitch a company position"
                      : task?.task == 2
                      ? "will need to be done over email or in a follow up meeting"
                      : " keep in touch with a recruiter"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
