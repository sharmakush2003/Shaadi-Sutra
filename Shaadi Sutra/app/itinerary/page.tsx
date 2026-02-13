"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWedding } from "../context/WeddingContext";
import { Modal } from "@/components/ui/modal";
import { Plus, Trash2, Clock } from "lucide-react";
import { TimelineItem, EventCategory } from "@/types";
import { Label } from "@/components/ui/label";

const categories: EventCategory[] = ["Haldi", "Mehendi", "Wedding", "Reception", "General"];

export default function ItineraryPage() {
    const { timeline, addTimelineItem, removeTimelineItem } = useWedding();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<EventCategory | "All">("All");

    const [newItem, setNewItem] = useState<Partial<TimelineItem>>({
        time: "",
        title: "",
        description: "",
        category: "Wedding"
    });

    const handleAddItem = () => {
        if (!newItem.time || !newItem.title) return;
        addTimelineItem({
            id: Date.now().toString(),
            time: newItem.time,
            title: newItem.title,
            description: newItem.description || "",
            category: (newItem.category as EventCategory) || "Wedding"
        });
        setIsModalOpen(false);
        setNewItem({ time: "", title: "", description: "", category: "Wedding" });
    };

    const filteredTimeline = timeline
        .filter(item => selectedCategory === "All" || item.category === selectedCategory)
        .sort((a, b) => a.time.localeCompare(b.time)); // Simple string sort for time (e.g. 10:00 AM) - simplified

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-maroon-900 font-bold">Itinerary Builder</h1>
                    <p className="text-maroon-600">Plan the schedule for your big days.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={selectedCategory} onValueChange={(val: any) => setSelectedCategory(val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Event" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Events</SelectItem>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4 mr-2" /> Add Event</Button>
                </div>
            </div>

            <div className="relative border-l-4 border-maroon-200 ml-4 md:ml-6 space-y-8 pl-6 md:pl-8 py-2">
                {filteredTimeline.length === 0 ? (
                    <div className="text-gray-400 italic">No events scheduled.</div>
                ) : (
                    filteredTimeline.map((item) => (
                        <div key={item.id} className="relative group">
                            {/* Dot on timeline */}
                            <div className="absolute -left-[45px] md:-left-[52px] top-1 h-6 w-6 rounded-full bg-maroon-600 border-4 border-white shadow-sm z-10"></div>

                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-maroon-700 border-maroon-200 bg-maroon-50">
                                                {item.category}
                                            </Badge>
                                            <div className="flex items-center text-sm font-semibold text-gray-500">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {item.time}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                                        {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeTimelineItem(item.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Itinerary Item"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input
                                type="time"
                                value={newItem.time}
                                onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={newItem.category || "Wedding"} onValueChange={(val: any) => setNewItem({ ...newItem, category: val })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            value={newItem.title}
                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            placeholder="e.g. Welcome Ritual, Lunch"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Optional details..."
                        />
                    </div>
                    <div className="flex justify-end pt-4 gap-2">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddItem}>Add to Schedule</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
