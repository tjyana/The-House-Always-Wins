"use client";
import React from "react";
import { useState, useEffect } from "react";
import Button from "./Button";
import Card from "./Card";
import CardHeader from "./CardHeader";
import CardDescription from "./CardDescription";
import CardContent from "./CardContent";
import CardTitle from "./CardTitle";
import Avatar from "./Avatar";
import AvatarImage from "./AvatarImage";
import Label from "./Label";
import Badge from "./Badge";
import Check from "./Check";

interface Experience {
  company: string;
  years: number;
  position?: string;
}

interface CandidateData {
  name: string;
  experience: Experience[];
  notes: string;
}

export default function ReviewChanges() {
  const [searchParams, setSearchParam] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  useEffect(() => {
    const search_params = window.location.search;
    const params = new URLSearchParams(window.location.search);
    // Get the 'candidates_id' query parameter
    const id = params.get("candidate_id") ?? "";
    setSearchParam(id);
  }, [searchParams]);
  const [changes, setChanges] = useState({
    id: 1,
    name: {
      before: "John Smith",
      after: "John A. Smith",
    },
    experience: {
      before: parseExperience(
        "5 years at Tech Corp\n3 years at Innovation Labs"
      ),
      after: parseExperience(
        "5 years at Tech Corp\n3 years at Innovation Labs\n2 years at StartUp Inc"
      ),
    },
    notes: {
      before: "Strong backend development background",
      after:
        "Strong backend development background. Recently completed cloud certification.",
    },
    keywords: {
      before: ["backend", "development"],
      after: ["backend", "development", "cloud", "certification"],
    },
    lastUpdated: "2024-02-22",
  });

  function parseExperience(text: string): Experience[] {
    return text.split("\n").map((entry) => {
      const match = entry.match(/(\d+)\s+years?\s+at\s+(.+)/);
      if (match) {
        return {
          years: Number.parseInt(match[1]),
          company: match[2].trim(),
        };
      }
      return { years: 0, company: entry };
    });
  }

  function formatExperience(exp: Experience[]): string {
    return exp.map((e) => `${e.years} years at ${e.company}`).join("\n");
  }

  const hasChanged = (before: any, after: any) =>
    JSON.stringify(before) !== JSON.stringify(after);

  const validateChanges = (): boolean => {
    const newErrors: string[] = [];

    if (!changes.name.after.trim()) {
      newErrors.push("Name cannot be empty");
    }

    if (!changes.experience.after.some((exp) => exp.years > 0)) {
      newErrors.push("At least one valid experience entry is required");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleConfirm = () => {
    if (!validateChanges()) return;

    // Structure data for DB
    const formattedData: CandidateData = {
      name: changes.name.after,
      experience: changes.experience.after,
      notes: changes.notes.after,
    };

    console.log("Formatted data for DB:", formattedData);
    window.location.href = `/confirm?candidate_id=${searchParams}`;
    // Handle submission...
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
          </Avatar>
          <div>
            <CardTitle classname="text-2xl font-semibold leading-none tracking-tight">
              Review Profile Changes
            </CardTitle>
            <CardDescription>
              Review and confirm updates to the candidate profile
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground mb-4">
              Current Profile
            </div>
            <div className="space-y-6">
              <div>
                <Label>Name</Label>
                <div className="p-2 mt-1 rounded-md bg-muted/50">
                  {changes.name.before}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Label>Job Experience</Label>
                </div>
                <div className="p-2 mt-1 rounded-md bg-muted/50 whitespace-pre-line">
                  {formatExperience(changes.experience.before)}
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <div className="p-2 mt-1 rounded-md bg-muted/50">
                  {changes.notes.before}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground mb-4">
              Updated Profile
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="name">Name</label>
                  {hasChanged(changes.name.before, changes.name.after) && (
                    <Badge>
                      <Check />
                      Changed
                    </Badge>
                  )}
                </div>
                <input
                  id="name"
                  className={
                    hasChanged(changes.name.before, changes.name.after)
                      ? "mt-1 border-green-200 bg-green-50"
                      : "mt-1"
                  }
                  value={changes.name.after}
                  onChange={(e) =>
                    setChanges((prev) => ({
                      ...prev,
                      name: { ...prev.name, after: e.target.value },
                    }))
                  }
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label htmlFor="experience">Job Experience</label>
                  </div>
                  {hasChanged(
                    changes.experience.before,
                    changes.experience.after
                  ) && (
                    <Badge>
                      <Check />
                      Changed
                    </Badge>
                  )}
                </div>
                <textarea
                  id="experience"
                  className={
                    "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 border-green-200 bg-green-50 "
                  }
                  value={formatExperience(changes.experience.after)}
                  onChange={(e) =>
                    setChanges((prev) => ({
                      ...prev,
                      experience: {
                        ...prev.experience,
                        after: parseExperience(e.target.value),
                      },
                    }))
                  }
                  rows={4}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="notes">Notes</label>
                  {hasChanged(changes.notes.before, changes.notes.after) && (
                    <Badge>
                      <Check />
                      Changed
                    </Badge>
                  )}
                </div>
                <textarea
                  id="notes"
                  className={
                    "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 border-green-200 bg-green-50 "
                  }
                  value={changes.notes.after}
                  onChange={(e) =>
                    setChanges((prev) => ({
                      ...prev,
                      notes: { ...prev.notes, after: e.target.value },
                    }))
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground pt-4">
          Last updated: {changes.lastUpdated}
        </div>
      </CardContent>
      <div className="items-center p-6 pt-0 flex justify-between">
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
          Cancel
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-black text-white"
          onClick={() => handleConfirm()}
        >
          Confirm Changes
        </button>
      </div>
    </Card>
  );
}
