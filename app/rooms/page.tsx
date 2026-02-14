"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Room } from "@/types";
import { useWedding } from "../context/WeddingContext";
import { Guest } from "@/types";
import { Plus, User, Bed, Mail, MapPin, Building, Pencil, X, CheckCircle, ExternalLink } from "lucide-react";

interface SavedHotel {
    id: string;
    name: string;
    location: string;
}

export default function RoomsPage() {
    const { rooms, addRoom, updateRoom, guests, addGuest, updateGuest } = useWedding();
    const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);

    // Email State
    const [isSendEmailOpen, setIsSendEmailOpen] = useState(false);
    const [selectedRoomForEmail, setSelectedRoomForEmail] = useState<Room | null>(null);
    const [email, setEmail] = useState("");
    const [hotelName, setHotelName] = useState("");
    const [hotelLocation, setHotelLocation] = useState("");
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    // Hotel Selection State
    const [savedHotels, setSavedHotels] = useState<SavedHotel[]>([]);

    const [selectedHotelId, setSelectedHotelId] = useState<string>("new");

    // Edit Room State
    const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [editForm, setEditForm] = useState<Partial<Room>>({});
    const [manualGuestName, setManualGuestName] = useState("");

    // State for notification
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    // Load saved hotels on mount
    useEffect(() => {
        const stored = localStorage.getItem("wedding_saved_hotels");
        if (stored) {
            setSavedHotels(JSON.parse(stored));
        }
    }, []);

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
            case "Reserved": return "warning"; // Yellow/Filled
            case "Available": return "success"; // Green/Filled
            case "Maintenance": return "secondary"; // Grey
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

    const openEmailModal = (room: Room) => {
        setSelectedRoomForEmail(room);
        setEmail("");
        // Don't clear hotel details if they want to reuse, but let's reset to "new" or keep last used?
        // Let's keep last used if exists, or reset. 
        // For now, let's reset selection to prompt choice, but maybe keep fields if custom?
        // Better: Reset to empty to force conscious choice or "Select Saved"
        setSelectedHotelId("new");
        setHotelName("");
        setHotelLocation("");
        setIsSendEmailOpen(true);
    };

    const openEditModal = (room: Room) => {
        setEditingRoom(room);
        setEditForm({
            ...room
        });
        setIsEditRoomOpen(true);
    };

    const handleSaveEdit = () => {
        if (!editingRoom || !editForm.roomNumber) return;

        updateRoom(editingRoom.id, editForm);

        // Also update guests to point to this room? 
        // Ideally yes, but context doesn't strictly enforce bidirectional sync yet.
        // Let's ensure if we added guests, we might want to update them too?
        // For now, let's just stick to updating the room's guestIds.

        setIsEditRoomOpen(false);
        setEditingRoom(null);
    };

    const handleAddManualGuest = () => {
        if (!manualGuestName.trim()) return;

        const newGuest: Guest = {
            id: Math.random().toString(36).substr(2, 9),
            name: manualGuestName,
            phone: "",
            city: "",
            status: "Not Sent",
            rsvp: false
        };

        addGuest(newGuest);

        // Add to current edit form
        const currentGuests = editForm.guestIds || [];
        setEditForm({
            ...editForm,
            guestIds: [...currentGuests, newGuest.id]
        });
        setManualGuestName("");
    };

    const toggleGuestAssignment = (guestId: string) => {
        const currentGuests = editForm.guestIds || [];
        if (currentGuests.includes(guestId)) {
            setEditForm({
                ...editForm,
                guestIds: currentGuests.filter(id => id !== guestId)
            });
        } else {
            // Check capacity
            if (currentGuests.length >= (editForm.capacity || 0)) {
                alert("Room is at full capacity!");
                return;
            }
            setEditForm({
                ...editForm,
                guestIds: [...currentGuests, guestId]
            });
        }
    };

    // Helper to get guest name
    const getGuestName = (id: string) => {
        const g = guests.find(guest => guest.id === id);
        return g ? g.name : `Guest ${id}`;
    };

    const handleHotelSelect = (val: string) => {
        setSelectedHotelId(val);
        if (val === "new") {
            setHotelName("");
            setHotelLocation("");
        } else {
            const hotel = savedHotels.find(h => h.id === val);
            if (hotel) {
                setHotelName(hotel.name);
                setHotelLocation(hotel.location);
            }
        }
    };

    const handleSendEmail = async () => {
        if (!selectedRoomForEmail || !email || !hotelName || !hotelLocation) {
            alert("Please fill in all fields");
            return;
        }

        setIsSendingEmail(true);

        try {
            // Save hotel if new
            if (selectedHotelId === "new") {
                const newHotel: SavedHotel = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: hotelName,
                    location: hotelLocation
                };
                const updatedHotels = [...savedHotels, newHotel];
                setSavedHotels(updatedHotels);
                localStorage.setItem("wedding_saved_hotels", JSON.stringify(updatedHotels));
            }

            // Ensure map link has protocol
            let formattedLocation = hotelLocation;
            if (!formattedLocation.startsWith("http://") && !formattedLocation.startsWith("https://")) {
                formattedLocation = "https://" + formattedLocation;
            }

            // Resolve guest names
            const guestNames = selectedRoomForEmail.guestIds.map(id => {
                const g = guests.find(guest => guest.id === id);
                return g ? g.name : `Guest ${id}`;
            });

            const response = await fetch('/api/send-room-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    hotelName,
                    hotelLocation: formattedLocation, // Use formatted link
                    roomNumber: selectedRoomForEmail.roomNumber,
                    roomType: selectedRoomForEmail.type,
                    guests: guestNames // Send names instead of IDs
                }),
            });

            const data = await response.json();

            if (data.success) {
                setNotification({ message: "Email sent successfully!", type: "success" });
                setTimeout(() => setNotification(null), 3000);
                setIsSendEmailOpen(false);

                // Mark room as notified
                if (selectedRoomForEmail) {
                    updateRoom(selectedRoomForEmail.id, {
                        emailSentAt: new Date().toISOString()
                    });
                }
            } else {
                setNotification({ message: "Failed to send email: " + data.message, type: "error" });
                setTimeout(() => setNotification(null), 3000);
            }
        } catch (error) {
            console.error(error);
            setNotification({ message: "An error occurred while sending email.", type: "error" });
            setTimeout(() => setNotification(null), 3000);
            alert("An error occurred while sending the email.");
        } finally {
            setIsSendingEmail(false);
        }
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
                            room.status === "Occupied" ? "bg-red-500" :
                                room.status === "Reserved" ? "bg-yellow-500" : "bg-gray-500"
                            }`} />
                        <CardHeader className="pb-2 pl-6 pr-2">
                            {/* Notification Popup */}
                            {notification && (
                                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                                    }`}>
                                    <div className="flex items-center space-x-2">
                                        {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                        <span className="font-medium">{notification.message}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-8">
                                <CardTitle className="text-2xl text-gray-700">#{room.roomNumber}</CardTitle>
                                <div className="flex gap-2 items-center">
                                    {room.emailSentAt && (
                                        <div className="flex items-center bg-green-50 px-1.5 h-6 rounded-full border border-green-200" title={`Sent: ${new Date(room.emailSentAt).toLocaleDateString()}`}>
                                            <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                                            <span className="text-[10px] font-medium text-green-700">Notified</span>
                                        </div>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-gray-400 hover:text-maroon-600"
                                        onClick={() => openEmailModal(room)}
                                        title="Send Room Details"
                                    >
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-gray-400 hover:text-maroon-600"
                                        onClick={() => openEditModal(room)}
                                        title="Edit Room"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Badge variant={getStatusColor(room.status)} className="text-[10px] px-1.5 py-0 h-5">
                                        {room.status}
                                    </Badge>
                                </div>
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
                                            {getGuestName(gid)}
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

            {/* Add Room Modal */}
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
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
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

            {/* Send Email Modal */}
            <Modal
                isOpen={isSendEmailOpen}
                onClose={() => setIsSendEmailOpen(false)}
                title={`Send Details for Room #${selectedRoomForEmail?.roomNumber}`}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Hotel</Label>
                        <Select
                            value={selectedHotelId}
                            onValueChange={handleHotelSelect}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a hotel" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                <SelectItem value="new">
                                    <span className="flex items-center text-maroon-600 font-medium">
                                        <Plus className="w-4 h-4 mr-2" /> Add New Hotel
                                    </span>
                                </SelectItem>
                                {savedHotels.map(h => (
                                    <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hotelName">Hotel Name</Label>
                        <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="hotelName"
                                value={hotelName}
                                onChange={(e) => setHotelName(e.target.value)}
                                placeholder="e.g. The Grand Palace"
                                className="pl-9"
                                disabled={selectedHotelId !== "new"}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hotelLocation">Location (Google Maps Link)</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="hotelLocation"
                                value={hotelLocation}
                                onChange={(e) => setHotelLocation(e.target.value)}
                                placeholder="https://maps.google.com/..."
                                className="pl-9"
                                disabled={selectedHotelId !== "new"}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Recipient Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="guest@example.com"
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Auto-generate Map Link Logic */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="autoMap"
                            className="rounded border-gray-300 text-maroon-600 focus:ring-maroon-500"
                            onChange={(e) => {
                                if (e.target.checked && hotelName) {
                                    const query = encodeURIComponent(hotelName);
                                    setHotelLocation(`https://www.google.com/maps/search/?api=1&query=${query}`);
                                }
                            }}
                        />
                        <Label htmlFor="autoMap" className="text-sm text-gray-600 cursor-pointer">
                            Auto-generate Map Link based on Hotel Name
                        </Label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button variant="outline" className="mr-2" onClick={() => setIsSendEmailOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendEmail} disabled={isSendingEmail}>
                            {isSendingEmail ? "Sending..." : "Send Details"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Room Modal */}
            <Modal
                isOpen={isEditRoomOpen}
                onClose={() => setIsEditRoomOpen(false)}
                title={`Edit Room #${editingRoom?.roomNumber}`}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Room Type</Label>
                            <Select
                                value={editForm.type || "Double"}
                                onValueChange={(val) => setEditForm({ ...editForm, type: val as Room["type"] })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Single">Single</SelectItem>
                                    <SelectItem value="Double">Double</SelectItem>
                                    <SelectItem value="Suite">Suite</SelectItem>
                                    <SelectItem value="Family">Family</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={editForm.status || "Available"}
                                onValueChange={(val) => setEditForm({ ...editForm, status: val as Room["status"] })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Available">Available</SelectItem>
                                    <SelectItem value="Occupied">Occupied</SelectItem>
                                    <SelectItem value="Reserved">Reserved</SelectItem>
                                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Assign Guests ({editForm.guestIds?.length || 0} / {editForm.capacity})</Label>

                        {/* Manual Assignment */}
                        <div className="flex gap-2 mb-2">
                            <Input
                                placeholder="Add Guest Name Manually..."
                                value={manualGuestName}
                                onChange={(e) => setManualGuestName(e.target.value)}
                            />
                            <Button onClick={handleAddManualGuest} disabled={!manualGuestName.trim()} size="sm">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* List of existing guests */}
                        <div className="border rounded-md p-2 h-40 overflow-y-auto space-y-1">
                            {guests.map(guest => {
                                const isAssignedToThis = editForm.guestIds?.includes(guest.id);
                                // Show if unassigned OR assigned to THIS room
                                // (In a real app, maybe show warning if pulling from another room)
                                return (
                                    <div key={guest.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                                        <input
                                            type="checkbox"
                                            id={`guest-${guest.id}`}
                                            checked={isAssignedToThis || false}
                                            onChange={() => toggleGuestAssignment(guest.id)}
                                            className="rounded border-gray-300"
                                        />
                                        <label htmlFor={`guest-${guest.id}`} className="text-sm flex-1 cursor-pointer">
                                            {guest.name} <span className="text-xs text-gray-400">({guest.city})</span>
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button variant="outline" className="mr-2" onClick={() => setIsEditRoomOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
