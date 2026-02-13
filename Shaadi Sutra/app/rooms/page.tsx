"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Room } from "@/types";
import { Plus, User, Bed } from "lucide-react";

import { useWedding } from "../context/WeddingContext";

export default function RoomsPage() {
    const { rooms, addRoom } = useWedding();
    const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
    const [newRoom, setNewRoom] = useState<Partial<Room>>({
        roomNumber: "",
        type: "Double",
        capacity: 2,
        status: "Available",
        guestIds: []
    });

    const getStatusColor = (status: Room["status"]) => {
        switch (status) {
            case "Occupied": return "destructive"; // Red/Filled
            case "Reserved": return "warning";
            case "Available": return "success";
            default: return "default";
        }
    };

    const stats = {
        total: rooms.length,
        occupied: rooms.filter(r => r.status === "Occupied").length,
        available: rooms.filter(r => r.status === "Available").length,
    };

    const handleAddRoom = () => {
        if (!newRoom.roomNumber) return; // Simple validation

        const room: Room = {
            id: Math.random().toString(36).substr(2, 9),
            roomNumber: newRoom.roomNumber,
            type: newRoom.type as Room["type"],
            capacity: newRoom.capacity || 2,
            status: newRoom.status as Room["status"],
            guestIds: []
        };

        addRoom(room);
        setIsAddRoomOpen(false);
        setNewRoom({
            roomNumber: "",
            type: "Double",
            capacity: 2,
            status: "Available",
            guestIds: []
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-maroon-900 font-bold">Room Allocation</h1>
                    <p className="text-maroon-600">Track hotel bookings and guest check-ins.</p>
                </div>
                <Button onClick={() => setIsAddRoomOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Room
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-700">{stats.available}</div>
                        <div className="text-xs text-green-600 uppercase">Available</div>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-700">{stats.occupied}</div>
                        <div className="text-xs text-red-600 uppercase">Occupied</div>
                    </CardContent>
                </Card>
                <Card className="bg-maroon-50 border-maroon-200">
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-maroon-700">{stats.total}</div>
                        <div className="text-xs text-maroon-600 uppercase">Total Rooms</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {rooms.map((room) => (
                    <Card key={room.id} className="relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className={`absolute top-0 left-0 w-1 h-full ${room.status === "Available" ? "bg-green-500" :
                            room.status === "Occupied" ? "bg-red-500" : "bg-yellow-500"
                            }`} />
                        <CardHeader className="pb-2 pl-6">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-2xl text-gray-700">#{room.roomNumber}</CardTitle>
                                <Badge variant={getStatusColor(room.status)} className="text-[10px] px-1.5 py-0">
                                    {room.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pl-6 pt-0 space-y-3">
                            <div className="flex items-center text-sm text-gray-500">
                                <Bed className="w-4 h-4 mr-2" />
                                {room.type} ({room.capacity} Pax)
                            </div>
                            {room.guestIds.length > 0 ? (
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-gray-400 uppercase">Guests</p>
                                    {room.guestIds.map((gid) => (
                                        <div key={gid} className="flex items-center text-sm text-maroon-800">
                                            <User className="w-3 h-3 mr-2 text-maroon-400" />
                                            Guest {gid} {/* Placeholder name lookup */}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-green-600 italic">Ready for assignment</div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isAddRoomOpen}
                onClose={() => setIsAddRoomOpen(false)}
                title="Add New Room"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="roomNumber">Room Number</Label>
                        <Input
                            id="roomNumber"
                            value={newRoom.roomNumber}
                            onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                            placeholder="e.g. 205"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Room Type</Label>
                            <Select
                                value={newRoom.type || "Double"}
                                onValueChange={(val) => setNewRoom({ ...newRoom, type: val as Room["type"] })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem value="Single">Single</SelectItem>
                                    <SelectItem value="Double">Double</SelectItem>
                                    <SelectItem value="Suite">Suite</SelectItem>
                                    <SelectItem value="Family">Family</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                                id="capacity"
                                type="number"
                                value={newRoom.capacity}
                                onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 0 })}
                                min={1}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                            value={newRoom.status || "Available"}
                            onValueChange={(val) => setNewRoom({ ...newRoom, status: val as Room["status"] })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                <SelectItem value="Available">Available</SelectItem>
                                <SelectItem value="Occupied">Occupied</SelectItem>
                                <SelectItem value="Reserved">Reserved</SelectItem>
                                <SelectItem value="Maintenence">Maintenence</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button variant="outline" className="mr-2" onClick={() => setIsAddRoomOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddRoom}>Save Room</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
