export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type EventCategory = "Haldi" | "Mehendi" | "Wedding" | "Reception" | "General";

export interface Task {
    id: string;
    title: string;
    category: EventCategory;
    assignedTo?: string;
    deadline?: Date;
    priority: TaskPriority;
    status: TaskStatus;
}

export type GuestStatus = "Not Sent" | "Sent" | "Confirmed" | "Declined";

export interface Guest {
    id: string;
    name: string;
    phone: string;
    city: string;
    status: GuestStatus;
    rsvp?: boolean;
    assignedRoomId?: string;
    assignedTableId?: string;
}

export interface Room {
    id: string;
    roomNumber: string;
    type: "Single" | "Double" | "Suite";
    capacity: number;
    guestIds: string[];
    status: "Available" | "Occupied" | "Reserved";
}

export interface Vendor {
    id: string;
    name: string;
    category: string;
    contact: string;
    amount: number;
    paid: number;
    status: "Booked" | "Pending" | "Cancelled";
}

export interface BudgetItem {
    id: string;
    name: string;
    value: number; // Allocated Amount
    cost: number; // Actual Spent
    color: string;
    category?: string;
}

export interface Table {
    id: string;
    name: string;
    shape: "Round" | "Rectangular";
    capacity: number;
    guestIds: string[]; // IDs of guests assigned to this table
}

export interface TimelineItem {
    id: string;
    time: string; // e.g. "10:00 AM"
    title: string;
    description?: string;
    category: EventCategory;
}

export interface GalleryItem {
    id: string;
    url: string;
    caption?: string;
    category: "Inspiration" | "Venue" | "Attire" | "Decor";
}
