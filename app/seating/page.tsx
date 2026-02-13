"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWedding } from "../context/WeddingContext";
import { Modal } from "@/components/ui/modal";
import { Plus, Users, X } from "lucide-react";
import { Table as TableType } from "@/types";
import { Label } from "@/components/ui/label";

export default function SeatingPage() {
    const { guests, tables, addTable, updateTable, removeTable, updateGuest } = useWedding();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTable, setNewTable] = useState<Partial<TableType>>({
        name: "",
        shape: "Round",
        capacity: 10,
        guestIds: [],
    });

    const unassignedGuests = guests.filter(g => !g.assignedTableId && g.rsvp);

    const handleAddTable = () => {
        if (!newTable.name) return;
        addTable({
            id: Date.now().toString(),
            name: newTable.name,
            shape: (newTable.shape as "Round" | "Rectangular") || "Round",
            capacity: Number(newTable.capacity) || 10,
            guestIds: [],
        });
        setIsModalOpen(false);
        setNewTable({ name: "", shape: "Round", capacity: 10, guestIds: [] });
    };

    const handleAssignGuest = (table: TableType, guestId: string) => {
        if (!guestId) return;
        if (table.guestIds.length >= table.capacity) {
            alert("Table is full!");
            return;
        }

        // Update Table
        updateTable(table.id, { guestIds: [...table.guestIds, guestId] });

        // Update Guest
        updateGuest(guestId, { assignedTableId: table.id });
    };

    const handleUnassignGuest = (table: TableType, guestId: string) => {
        // Update Table
        updateTable(table.id, { guestIds: table.guestIds.filter(id => id !== guestId) });

        // Update Guest
        updateGuest(guestId, { assignedTableId: undefined });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif text-maroon-900 font-bold">Seating Chart</h1>
                    <p className="text-maroon-600">Arrange guests into tables.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4 mr-2" /> Add Table</Button>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {/* Unassigned Guests Sidebar */}
                <div className="md:col-span-1 space-y-4">
                    <Card className="h-full border-t-4 border-t-gray-400">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Unassigned</span>
                                <Badge variant="secondary">{unassignedGuests.length}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {unassignedGuests.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">All RSVP guests assigned!</p>
                                ) : (
                                    unassignedGuests.map(guest => (
                                        <div key={guest.id} className="p-2 bg-gray-50 rounded text-sm text-gray-700">
                                            {guest.name}
                                        </div>
                                    ))
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-4">* Only Confirmed/RSVP guests shown</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tables Grid */}
                <div className="md:col-span-3 grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-start">
                    {tables.map(table => (
                        <Card key={table.id} className="border-t-4 border-t-maroon-800 h-fit">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{table.name}</CardTitle>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {table.guestIds.length} / {table.capacity}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-500" onClick={() => removeTable(table.id)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Assigned Guests List */}
                                <ul className="space-y-1">
                                    {table.guestIds.map(guestId => {
                                        const guest = guests.find(g => g.id === guestId);
                                        if (!guest) return null;
                                        return (
                                            <li key={guestId} className="flex justify-between items-center text-sm p-1 hover:bg-maroon-50 rounded group">
                                                <span>{guest.name}</span>
                                                <button
                                                    onClick={() => handleUnassignGuest(table, guestId)}
                                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* Assign New Guest Dropdown */}
                                {table.guestIds.length < table.capacity && (
                                    <div className="pt-2">
                                        <Select value="" onValueChange={(val) => handleAssignGuest(table, val)}>
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue placeholder="+ Add Guest" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {unassignedGuests.length > 0 ? (
                                                    unassignedGuests.map(g => (
                                                        <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="p-2 text-xs text-gray-400">No unassigned guests</div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Table"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Table Name</Label>
                        <Input
                            value={newTable.name}
                            onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
                            placeholder="e.g. Table 1, Family Table"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Shape</Label>
                            <Select value={newTable.shape || "Round"} onValueChange={(val: string) => setNewTable({ ...newTable, shape: val as "Round" | "Rectangular" })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Round">Round</SelectItem>
                                    <SelectItem value="Rectangular">Rectangular</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Capacity</Label>
                            <Input
                                type="number"
                                value={newTable.capacity}
                                onChange={(e) => setNewTable({ ...newTable, capacity: Number(e.target.value) })}
                                placeholder="10"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 gap-2">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddTable}>Create Table</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
