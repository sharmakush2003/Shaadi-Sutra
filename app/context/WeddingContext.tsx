"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Guest, Vendor, BudgetItem, Task, Table, TimelineItem, GalleryItem, Room } from "@/types";

interface WeddingContextType {
    guests: Guest[];
    vendors: Vendor[];
    budgetItems: BudgetItem[];
    tasks: Task[];
    rooms: Room[];

    // Actions
    addGuest: (guest: Guest) => void;
    updateGuest: (id: string, updates: Partial<Guest>) => void;
    removeGuest: (id: string) => void;

    addVendor: (vendor: Vendor) => void;
    updateVendor: (id: string, updates: Partial<Vendor>) => void;
    removeVendor: (id: string) => void;

    addBudgetItem: (item: BudgetItem) => void;
    updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
    removeBudgetItem: (id: string) => void;

    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    removeTask: (id: string) => void;

    tables: Table[];
    addTable: (table: Table) => void;
    updateTable: (id: string, updates: Partial<Table>) => void;
    removeTable: (id: string) => void;

    timeline: TimelineItem[];
    addTimelineItem: (item: TimelineItem) => void;
    updateTimelineItem: (id: string, updates: Partial<TimelineItem>) => void;
    removeTimelineItem: (id: string) => void;

    gallery: GalleryItem[];
    addGalleryItem: (item: GalleryItem) => void;
    removeGalleryItem: (id: string) => void;

    addRoom: (room: Room) => void;
    updateRoom: (id: string, updates: Partial<Room>) => void;
    removeRoom: (id: string) => void;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const useWedding = () => {
    const context = useContext(WeddingContext);
    if (!context) {
        throw new Error("useWedding must be used within a WeddingProvider");
    }
    return context;
};

// Initial Mock Data (to populate if empty)
const INITIAL_GUESTS: Guest[] = [
    { id: "1", name: "Ramesh Gupta", phone: "9876543210", city: "Mumbai", status: "Confirmed", rsvp: true },
    { id: "2", name: "Suresh Patel", phone: "9123456780", city: "Ahmedabad", status: "Sent", rsvp: false },
    { id: "3", name: "Anita Roy", phone: "9988776655", city: "Delhi", status: "Not Sent", rsvp: false },
];

const INITIAL_VENDORS: Vendor[] = [
    { id: "1", name: "Royal Caterers", category: "Catering", contact: "9876543210", amount: 500000, paid: 200000, status: "Booked" },
    { id: "2", name: "Shutterbugs Photography", category: "Photography", contact: "9123456789", amount: 150000, paid: 50000, status: "Booked" },
];

const INITIAL_BUDGET: BudgetItem[] = [
    { id: "1", name: "Venue & Catering", value: 1500000, cost: 0, color: "#800000" },
    { id: "2", name: "Decoration", value: 500000, cost: 0, color: "#BF2B34" },
    { id: "3", name: "Attire & Makeup", value: 300000, cost: 0, color: "#DAA520" },
    { id: "4", name: "Photography", value: 200000, cost: 50000, color: "#FFD700" },
    { id: "5", name: "Miscellaneous", value: 100000, cost: 0, color: "#333333" },
];

export const WeddingProvider = ({ children }: { children: React.ReactNode }) => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Room Data
    const INITIAL_ROOMS: Room[] = [
        { id: "101", roomNumber: "101", type: "Double", capacity: 2, guestIds: ["1", "2"], status: "Occupied" },
        { id: "102", roomNumber: "102", type: "Double", capacity: 2, guestIds: [], status: "Available" },
        { id: "103", roomNumber: "103", type: "Suite", capacity: 4, guestIds: ["3"], status: "Reserved" },
        { id: "104", roomNumber: "104", type: "Single", capacity: 1, guestIds: [], status: "Available" },
    ];

    const [rooms, setRooms] = useState<Room[]>([]);

    // ... existing state hooks ...

    useEffect(() => {
        const loadData = () => {
            const storedGuests = localStorage.getItem("wedding_guests");
            const storedVendors = localStorage.getItem("wedding_vendors");
            const storedBudget = localStorage.getItem("wedding_budget");
            const storedTasks = localStorage.getItem("wedding_tasks");
            const storedTables = localStorage.getItem("wedding_tables");
            const storedTimeline = localStorage.getItem("wedding_timeline");
            const storedGallery = localStorage.getItem("wedding_gallery");
            const storedRooms = localStorage.getItem("wedding_rooms");

            if (storedGuests) setGuests(JSON.parse(storedGuests)); else setGuests(INITIAL_GUESTS);
            if (storedVendors) setVendors(JSON.parse(storedVendors)); else setVendors(INITIAL_VENDORS);
            if (storedBudget) setBudgetItems(JSON.parse(storedBudget)); else setBudgetItems(INITIAL_BUDGET);
            if (storedRooms) setRooms(JSON.parse(storedRooms)); else setRooms(INITIAL_ROOMS);

            if (storedTasks) setTasks(JSON.parse(storedTasks));
            if (storedTables) setTables(JSON.parse(storedTables));
            if (storedTimeline) setTimeline(JSON.parse(storedTimeline));
            if (storedGallery) setGallery(JSON.parse(storedGallery));

            setIsLoaded(true);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("wedding_guests", JSON.stringify(guests));
            localStorage.setItem("wedding_vendors", JSON.stringify(vendors));
            localStorage.setItem("wedding_budget", JSON.stringify(budgetItems));
            localStorage.setItem("wedding_tasks", JSON.stringify(tasks));
            localStorage.setItem("wedding_tables", JSON.stringify(tables));
            localStorage.setItem("wedding_timeline", JSON.stringify(timeline));
            localStorage.setItem("wedding_gallery", JSON.stringify(gallery));
            localStorage.setItem("wedding_rooms", JSON.stringify(rooms));
        }
    }, [guests, vendors, budgetItems, tasks, tables, timeline, gallery, rooms, isLoaded]);

    // Actions
    const addGuest = (guest: Guest) => setGuests([...guests, guest]);
    const updateGuest = (id: string, updates: Partial<Guest>) => {
        setGuests(guests.map(g => g.id === id ? { ...g, ...updates } : g));
    };
    const removeGuest = (id: string) => setGuests(guests.filter(g => g.id !== id));

    const addVendor = (vendor: Vendor) => setVendors([...vendors, vendor]);
    const updateVendor = (id: string, updates: Partial<Vendor>) => {
        setVendors(vendors.map(v => v.id === id ? { ...v, ...updates } : v));
    };
    const removeVendor = (id: string) => setVendors(vendors.filter(v => v.id !== id));

    const addBudgetItem = (item: BudgetItem) => setBudgetItems([...budgetItems, item]);
    const updateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
        setBudgetItems(budgetItems.map(b => b.id === id ? { ...b, ...updates } : b));
    };
    const removeBudgetItem = (id: string) => setBudgetItems(budgetItems.filter(b => b.id !== id));

    const addTask = (task: Task) => setTasks([...tasks, task]);
    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    };
    const removeTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));

    const addTable = (table: Table) => setTables([...tables, table]);
    const updateTable = (id: string, updates: Partial<Table>) => {
        setTables(tables.map(t => t.id === id ? { ...t, ...updates } : t));
    };
    const removeTable = (id: string) => setTables(tables.filter(t => t.id !== id));

    const addTimelineItem = (item: TimelineItem) => setTimeline([...timeline, item]);
    const updateTimelineItem = (id: string, updates: Partial<TimelineItem>) => {
        setTimeline(timeline.map(t => t.id === id ? { ...t, ...updates } : t));
    };
    const removeTimelineItem = (id: string) => setTimeline(timeline.filter(t => t.id !== id));

    const addGalleryItem = (item: GalleryItem) => setGallery([...gallery, item]);
    const removeGalleryItem = (id: string) => setGallery(gallery.filter(g => g.id !== id));

    // Room Actions
    const addRoom = (room: Room) => setRooms([...rooms, room]);
    const updateRoom = (id: string, updates: Partial<Room>) => {
        setRooms(rooms.map(r => r.id === id ? { ...r, ...updates } : r));
    };
    const removeRoom = (id: string) => setRooms(rooms.filter(r => r.id !== id));

    if (!isLoaded) {
        return <div className="flex h-screen items-center justify-center text-maroon-800">Loading Wedding Planner...</div>;
    }

    return (
        <WeddingContext.Provider value={{
            guests, vendors, budgetItems, tasks, tables, timeline, gallery, rooms,
            addGuest, updateGuest, removeGuest,
            addVendor, updateVendor, removeVendor,
            addBudgetItem, updateBudgetItem, removeBudgetItem,
            addTask, updateTask, removeTask,
            addTable, updateTable, removeTable,
            addTimelineItem, updateTimelineItem, removeTimelineItem,
            addGalleryItem, removeGalleryItem,
            addRoom, updateRoom, removeRoom
        }}>
            {children}
        </WeddingContext.Provider>
    );
};
