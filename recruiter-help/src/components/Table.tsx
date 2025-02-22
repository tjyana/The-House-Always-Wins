"use client";
import React from "react";
import { useState } from "react";

import { ArrowUpDown, Filter, AlertCircle, Clock } from "lucide-react";
import Button from "../components/Button";
import Avatar from "./Avatar";
import AvatarImage from "./AvatarImage";
import Badge from "./Badge";
import Card from "./Card";
import CardContent from "./CardContent";
import CardHeader from "./CardHeader";
import CardTitle from "./CardTitle";

interface ChangeRequest {
  id: string;
  candidate: {
    name: string;
    avatar: string;
    role: string;
    company: string;
  };
  changeType: string;
  priority: "high" | "medium" | "low";
  accountValue: number;
  lastUpdated: string;
  status: "pending" | "in_progress";
}

export default function Dashboard() {
  const [requests] = useState<ChangeRequest[]>([
    {
      id: "1",
      candidate: {
        name: "John A. Smith",
        avatar: "/placeholder.svg",
        role: "Senior Frontend Developer",
        company: "Tech Corp",
      },
      changeType: "Profile Update",
      priority: "high",
      accountValue: 120000,
      lastUpdated: "2 hours ago",
      status: "pending",
    },
    {
      id: "2",
      candidate: {
        name: "Sarah Wilson",
        avatar: "/placeholder.svg",
        role: "Product Manager",
        company: "Innovation Labs",
      },
      changeType: "Experience Added",
      priority: "medium",
      accountValue: 145000,
      lastUpdated: "4 hours ago",
      status: "pending",
    },
    {
      id: "3",
      candidate: {
        name: "Michael Chen",
        avatar: "/placeholder.svg",
        role: "Senior Backend Engineer",
        company: "StartUp Inc",
      },
      changeType: "Skills Updated",
      priority: "high",
      accountValue: 135000,
      lastUpdated: "1 day ago",
      status: "in_progress",
    },
  ]);

  const handleReviewClick = (requestId: string) => {
    window.location.href = `/changes?candidate_id=${requestId}`;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Change Requests</h1>
          <p className="text-muted-foreground">
            Review and approve candidate profile updates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <input placeholder="Search candidates..." className="w-[300px]" />
          </div>
          <Button>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle classname="">Pending Reviews</CardTitle>
            <Badge classname={"bg-gray-100 text-gray-800"}>
              {requests.length} pending
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
                  Change Type
                </th>
                <th scope="col" className="py-3 px-6">
                  Priority
                </th>
                <th scope="col" className="py-3 px-6">
                  <button className="flex items-center gap-1 p-0 font-semibold">
                    Account Value
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-6">
                  Last Updated
                </th>
                <th scope="col" className="py-3 px-6 text-right">
                  Action
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
                  <td className="py-4 px-6">{request.changeType}</td>
                  <td className="py-4 px-6">
                    <Badge
                      classname={
                        request.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : request.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {request.priority === "high" && (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {request.priority}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 font-mono">
                    ${request.accountValue.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm">{request.lastUpdated}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      className={
                        request.status === "in_progress"
                          ? "px-2 py-2 rounded text-small bg-gray-200 text-gray-900"
                          : "px-2 py-2 rounded text-small bg-black text-white"
                      }
                      onClick={() => handleReviewClick(request.id)}
                    >
                      {request.status === "in_progress"
                        ? "Continue Review"
                        : "Review"}
                    </button>
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
