/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWedding } from "../context/WeddingContext";
import { Modal } from "@/components/ui/modal";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { GalleryItem } from "@/types";
import { Label } from "@/components/ui/label";

type GalleryCategory = "Inspiration" | "Venue" | "Attire" | "Decor";
const categories: GalleryCategory[] = ["Inspiration", "Venue", "Attire", "Decor"];

export default function GalleryPage() {
    const { gallery, addGalleryItem, removeGalleryItem } = useWedding();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | "All">("All");

    const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
        url: "",
        caption: "",
        category: "Inspiration"
    });

    const handleAddItem = () => {
        if (!newItem.url) return;
        addGalleryItem({
            id: Date.now().toString(),
            url: newItem.url,
            caption: newItem.caption || "",
            category: (newItem.category as GalleryCategory) || "Inspiration"
        });
        setIsModalOpen(false);
        setNewItem({ url: "", caption: "", category: "Inspiration" });
    };

    const filteredGallery = gallery.filter(item => selectedCategory === "All" || item.category === selectedCategory);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-maroon-900 font-bold">Gallery & Mood Board</h1>
                    <p className="text-maroon-600">Collect and organize your wedding inspiration.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={selectedCategory} onValueChange={(val: string) => setSelectedCategory(val as GalleryCategory | "All")}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Photos</SelectItem>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4 mr-2" /> Add Photo</Button>
                </div>
            </div>

            <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {filteredGallery.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-gray-400 italic bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        No photos yet. Add some inspiration!
                    </div>
                ) : (
                    filteredGallery.map((item) => (
                        <div key={item.id} className="break-inside-avoid relative group mb-4 rounded-lg overflow-hidden shadow-md bg-white">
                            <img
                                src={item.url}
                                alt={item.caption || "Gallery Image"}
                                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                                }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                <Badge className="self-start mb-2 bg-white/90 text-maroon-900 hover:bg-white">{item.category}</Badge>
                                {item.caption && <p className="text-white text-sm font-medium">{item.caption}</p>}
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8"
                                    onClick={() => removeGalleryItem(item.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add to Mood Board"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                            value={newItem.url}
                            onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-gray-500">Paste a direct link to an image.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={newItem.category || "Inspiration"} onValueChange={(val: string) => setNewItem({ ...newItem, category: val as GalleryCategory })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Caption</Label>
                            <Input
                                value={newItem.caption}
                                onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })}
                                placeholder="e.g. Dream dress"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 gap-2">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddItem}>Add Photo</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
