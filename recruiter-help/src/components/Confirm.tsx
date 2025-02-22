"use client";
import React from "react";
import { useState, useEffect } from "react";

import { ArrowLeft, Check, CircleDot, Clock } from "lucide-react";

import Button from "./Button";
import Card from "./Card";
import CardContent from "./CardContent";
import CardHeader from "./CardHeader";
import CardTitle from "./CardTitle";
import ProgressBar from "./Progress";
import Avatar from "./Avatar";
import AvatarImage from "./AvatarImage";
import Badge from "./Badge";

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  estimatedTime?: string;
}

export default function Confirmation() {
  const [searchParams, setSearchParam] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  useEffect(() => {
    const search_params = window.location.search;
    const params = new URLSearchParams(window.location.search);
    // Get the 'candidates_id' query parameter
    const id = params.get("candidate_id") ?? "";
    setSearchParam(id);
  }, [searchParams]);
  const candidate = {
    name: "John A. Smith",
    avatar: "/placeholder.svg",
    role: "Senior Frontend Developer",
    company: "Tech Corp",
    expectedSalary: 120000,
    confidence: 78,
    progress: 50,
    match: 85,
  };

  const steps: TimelineStep[] = [
    {
      id: 1,
      title: "Profile Changes Reviewed",
      description: "Changes to experience and skills have been confirmed",
      status: "completed",
    },
    {
      id: 2,
      title: "Updating Candidate Match Scores",
      description: "AI is recalculating match scores against open positions",
      status: "current",
      estimatedTime: "2 minutes",
    },
    {
      id: 3,
      title: "Scheduling Follow-up",
      description:
        "AI will schedule a skills assessment based on new qualifications",
      status: "upcoming",
      estimatedTime: "~24 hours",
    },
    {
      id: 4,
      title: "Portfolio Review",
      description: "AI will analyze updated portfolio materials",
      status: "upcoming",
      estimatedTime: "~48 hours",
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Simplified Candidate Snapshot */}
        <div className="md:col-span-1">
          <Card>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar>
                  <AvatarImage src={candidate.avatar} />
                </Avatar>
                <div>
                  <h2 className="font-semibold !p-0 !m-0">{candidate.name}</h2>
                  <p className="text-sm text-gray-500 !p-0 !m-0">
                    {candidate.role}
                  </p>
                  <p className="text-sm text-gray-500 !p-0 !m-0">
                    {candidate.company}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">
                      {candidate.match}%
                    </div>
                    <div className="text-xs text-gray-500">Job Match</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      ${(candidate.expectedSalary / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs text-gray-500">Expected</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hiring Progress</span>
                    <Badge classname="">
                      {candidate.confidence}% Confidence
                    </Badge>
                  </div>
                  <ProgressBar value={candidate.progress} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Column */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle classname="font-semibold tracking-tight text-xl text-gray-600">
                  Changes Confirmed
                </CardTitle>
                <Button>
                  <a href="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Return to Dashboard
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/10 rounded-md text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">
                  Next action in progress: 2 minutes remaining
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {steps.map((step, index) => (
                  <div key={step.id} className="relative pb-8">
                    {index !== steps.length - 1 && (
                      <div
                        className={`absolute left-4 top-4 -ml-px h-full w-0.5 ${
                          step.status === "completed"
                            ? "bg-gray-300"
                            : step.status === "current"
                            ? "bg-primary/30"
                            : "bg-gray-300/30"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div>
                        {step.status === "completed" ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300">
                            <Check className="h-3 w-3 text-gray-500" />
                          </div>
                        ) : step.status === "current" ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                            <CircleDot className="h-5 w-5 text-primary" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-muted/30 bg-background">
                            <div className="h-2 w-2 rounded-full bg-gray-300/30" />
                          </div>
                        )}
                      </div>
                      <div
                        className={`min-w-0 flex-1 pt-1.5 ${
                          step.status === "completed"
                            ? "opacity-60"
                            : step.status === "current"
                            ? "scale-105 origin-left"
                            : "opacity-40"
                        }`}
                      >
                        <div className="space-y-1">
                          <h3
                            className={`font-medium leading-none ${
                              step.status === "current"
                                ? "text-lg text-primary"
                                : ""
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p
                            className={`text-sm ${
                              step.status === "current"
                                ? "text-gray-500"
                                : "text-gray-500/70"
                            }`}
                          >
                            {step.description}
                          </p>
                          {step.estimatedTime && (
                            <p className="text-sm text-gray-500/70 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Estimated time: {step.estimatedTime}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
