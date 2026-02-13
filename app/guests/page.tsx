"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Guest, GuestStatus } from "@/types";
import { Plus, Search } from "lucide-react";
import { useWedding } from "../context/WeddingContext";
import { Modal } from "@/components/ui/modal";

export default function GuestsPage() {
    const { guests, addGuest, updateGuest } = useWedding();
    const [filter, setFilter] = useState<"All" | GuestStatus>("All");
    const [search, setSearch] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
    const [formData, setFormData] = useState<Partial<Guest>>({
        name: "",
        phone: "",
        city: "",
        status: "Not Sent",
        rsvp: false,
    });

    const filteredGuests = guests.filter(guest => {
        const matchesFilter = filter === "All" || guest.status === filter;
        const matchesSearch = guest.name.toLowerCase().includes(search.toLowerCase()) || guest.city.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: GuestStatus) => {
        switch (status) {
            case "Confirmed": return "success"; // Will need to ensure Badge supports this or map to valid variant
            case "Sent": return "secondary";
            case "Not Sent": return "outline";
            case "Declined": return "destructive";
            default: return "default";
        }
    };

    const handleOpenModal = (guest?: Guest) => {
        if (guest) {
            setEditingGuest(guest);
            setFormData(guest);
        } else {
            setEditingGuest(null);
            setFormData({
                name: "",
                phone: "",
                city: "",
                status: "Not Sent",
                rsvp: false,
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.phone) return; // Basic validation

        if (editingGuest) {
            updateGuest(editingGuest.id, formData);
        } else {
            addGuest({
                id: Date.now().toString(), // Simple ID generation
                name: formData.name!,
                phone: formData.phone!,
                city: formData.city || "",
                status: (formData.status as GuestStatus) || "Not Sent",
                rsvp: formData.rsvp || false,
            });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-maroon-900 font-bold">Guest List</h1>
                    <p className="text-maroon-600">Track invitations and RSVPs.</p>
                </div>
                <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> Add Guest</Button>
            </div>

            <Card className="border-t-4 border-t-gold-500">
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search guests..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <Select value={filter} onValueChange={(val: string) => setFilter(val as "All" | GuestStatus)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Statuses</SelectItem>
                                    <SelectItem value="Not Sent">Not Sent</SelectItem>
                                    <SelectItem value="Sent">Sent</SelectItem>
                                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                                    <SelectItem value="Declined">Declined</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-maroon-100">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredGuests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                            No guests found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredGuests.map((guest) => (
                                        <TableRow key={guest.id}>
                                            <TableCell className="font-medium">{guest.name}</TableCell>
                                            <TableCell>{guest.phone}</TableCell>
                                            <TableCell>{guest.city}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusColor(guest.status) as any}>
                                                    {guest.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="text-maroon-600" onClick={() => handleOpenModal(guest)}>Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingGuest ? "Edit Guest" : "Add New Guest"}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Guest Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phone</label>
                        <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Phone Number"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">City</label>
                        <Input
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="City"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Status</label>
                        <Select value={formData.status || "Not Sent"} onValueChange={(val) => setFormData({ ...formData, status: val as GuestStatus })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Not Sent">Not Sent</SelectItem>
                                <SelectItem value="Sent">Sent</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="Declined">Declined</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Guest</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
