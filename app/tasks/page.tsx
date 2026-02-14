"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Task, EventCategory } from "@/types"; // Removed TaskPriority if unused or use it
import { Plus, Trash2, CheckCircle2, Circle, ChevronDown, ChevronRight, Mic, MicOff, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWedding } from "../context/WeddingContext";

export default function TasksPage() {
    const { tasks, addTask: addTaskContext, updateTask, removeTask } = useWedding();
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<EventCategory>("Wedding");

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;

        addTaskContext({
            id: Date.now().toString(),
            title: newTaskTitle,
            category: selectedCategory,
            priority: "Medium",
            status: "Pending",
        });
        setNewTaskTitle("");
    };

    // Expanded Task State
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

    // Toggle Task Expansion
    const toggleExpand = (taskId: string) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    };

    const toggleStatus = (task: Task) => {
        updateTask(task.id, {
            status: task.status === "Completed" ? "Pending" : "Completed"
        });
    };

    // Voice Assist State
    const [isListening, setIsListening] = useState<string | null>(null); // Stores ID of task currently being dictated to

    // Voice Assist Logic
    const startListening = (taskId: string) => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert("Voice assistance is not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(taskId);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                const currentDesc = task.description || "";
                // Append with a space if there's existing text
                const newDesc = currentDesc ? `${currentDesc} ${transcript}` : transcript;
                updateDescription(taskId, newDesc);
            }
        };

        recognition.onend = () => {
            setIsListening(null);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(null);
        };

        recognition.start();
    };


    // Auto-Refine Logic (Client-Side)
    const refineDescription = (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task || !task.description) return;

        let text = task.description;

        // 1. Remove extra whitespace
        text = text.replace(/\s+/g, ' ').trim();

        // 2. Capitalize first letter of sentences
        text = text.replace(/(^\w|\.\s+\w)/gm, letter => letter.toUpperCase());

        // 3. Ensure simple punctuation (add period if missing at end)
        if (text.length > 0 && !/[.!?]$/.test(text)) {
            text += '.';
        }

        updateDescription(taskId, text);
        alert("Text refined!");
    };

    // Description Logic
    const updateDescription = (taskId: string, desc: string) => {
        updateTask(taskId, { description: desc });
    };

    const categories: EventCategory[] = ["Haldi", "Mehendi", "Wedding", "Reception", "General"];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-maroon-900 font-bold">Wedding Tasks</h1>
                    <p className="text-maroon-600">Manage all your to-dos for every event.</p>
                </div>

                <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
                    <Input
                        placeholder="New task..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="w-full md:w-64"
                    />

                    <div className="w-full md:w-40">
                        <Select value={selectedCategory} onValueChange={(val: string) => setSelectedCategory(val as EventCategory)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleAddTask}><Plus className="w-4 h-4 mr-2" /> Add</Button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {categories.map((category) => {
                    const categoryTasks = tasks.filter(t => t.category === category);
                    // Don't show empty categories if you want a cleaner look, or show them to encourage adding tasks
                    if (categoryTasks.length === 0 && category === "General") return null;

                    return (
                        <Card key={category} className="border-t-4 border-t-maroon-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xl">{category}</CardTitle>
                                <Badge variant="secondary">{categoryTasks.length} Tasks</Badge>
                            </CardHeader>
                            <CardContent>
                                {categoryTasks.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">No tasks yet.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {categoryTasks.map(task => (
                                            <li key={task.id} className="border border-maroon-100 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleExpand(task.id)}>
                                                        <button onClick={(e) => { e.stopPropagation(); toggleStatus(task); }} className="text-maroon-600 hover:text-maroon-800 transition-colors">
                                                            {task.status === "Completed" ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                                        </button>
                                                        <div className="flex-1">
                                                            <span className={cn("text-sm font-medium block", task.status === "Completed" && "line-through text-gray-400")}>
                                                                {task.title}
                                                            </span>
                                                            <div className="text-xs text-gray-400 mt-1 flex items-center">
                                                                {expandedTaskId === task.id ? "Click to collapse" : "Click to view details"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Button variant="ghost" size="sm" onClick={() => toggleExpand(task.id)}>
                                                            {expandedTaskId === task.id ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-1">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Expanded Details */}
                                                {expandedTaskId === task.id && (
                                                    <div className="mt-4 pt-4 border-t border-gray-100 pl-8 space-y-4">

                                                        {/* Description */}
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between items-center">
                                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes & Details</label>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 px-2 text-xs text-blue-500 hover:text-blue-700 hover:bg-blue-50 ml-1"
                                                                    onClick={() => refineDescription(task.id)}
                                                                    title="Auto-Refine Text"
                                                                >
                                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                                    Refine
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className={cn("h-6 px-2 text-xs", isListening === task.id ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-maroon-600")}
                                                                    onClick={() => startListening(task.id)}
                                                                    title="Dictate Notes"
                                                                    disabled={isListening !== null && isListening !== task.id}
                                                                >
                                                                    {isListening === task.id ? <MicOff className="w-3 h-3 mr-1" /> : <Mic className="w-3 h-3 mr-1" />}
                                                                    {isListening === task.id ? "Listening..." : "Dictate"}
                                                                </Button>
                                                            </div>
                                                            <textarea
                                                                rows={5}
                                                                className="w-full text-sm p-3 border border-gray-200 rounded-md focus:ring-1 focus:ring-maroon-500 focus:border-maroon-500 min-h-[120px]"
                                                                placeholder="Add details, contacts, links..."
                                                                value={task.description || ""}
                                                                onChange={(e) => updateDescription(task.id, e.target.value)}
                                                            />
                                                        </div>

                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
