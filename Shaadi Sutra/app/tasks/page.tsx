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
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
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

    const toggleStatus = (task: Task) => {
        updateTask(task.id, {
            status: task.status === "Completed" ? "Pending" : "Completed"
        });
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
                                            <li key={task.id} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => toggleStatus(task)} className="text-maroon-600 hover:text-maroon-800 transition-colors">
                                                        {task.status === "Completed" ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                                    </button>
                                                    <span className={cn("text-sm font-medium", task.status === "Completed" && "line-through text-gray-400")}>
                                                        {task.title}
                                                    </span>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
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
