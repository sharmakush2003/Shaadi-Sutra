"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Vendor } from "@/types";
import { Phone, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWedding } from "../context/WeddingContext";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VendorsPage() {
    const { vendors, addVendor, updateVendor } = useWedding();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Vendor>>({
        name: "",
        category: "",
        contact: "",
        amount: 0,
        paid: 0,
        status: "Pending",
    });

    const handleOpenModal = (vendor?: Vendor) => {
        if (vendor) {
            setEditingVendor(vendor);
            setFormData(vendor);
        } else {
            setEditingVendor(null);
            setFormData({
                name: "",
                category: "",
                contact: "",
                amount: 0,
                paid: 0,
                status: "Pending",
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.category) return;

        if (editingVendor) {
            updateVendor(editingVendor.id, formData);
        } else {
            addVendor({
                id: Date.now().toString(),
                name: formData.name!,
                category: formData.category!,
                contact: formData.contact || "",
                amount: Number(formData.amount) || 0,
                paid: Number(formData.paid) || 0,
                status: (formData.status as "Booked" | "Pending" | "Cancelled") || "Pending",
            });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif text-maroon-900 font-bold">Vendor Management</h1>
                    <p className="text-maroon-600">Manage contracts and payments.</p>
                </div>
                <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> Add Vendor</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => {
                    const paidPercentage = vendor.amount > 0 ? Math.round((vendor.paid / vendor.amount) * 100) : 0;
                    return (
                        <Card key={vendor.id} className="border-t-4 border-t-maroon-800">
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div>
                                    <CardTitle className="text-xl">{vendor.name}</CardTitle>
                                    <span className="text-sm text-gray-500">{vendor.category}</span>
                                </div>
                                <Badge variant={vendor.status === "Booked" ? "success" : vendor.status === "Cancelled" ? "destructive" : "warning"}>
                                    {vendor.status}
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="w-4 h-4 mr-2 text-maroon-600" />
                                    {vendor.contact}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Payment Status</span>
                                        <span className={cn(paidPercentage === 100 ? "text-green-600" : "text-maroon-600")}>
                                            {paidPercentage}% Paid
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-maroon-800 h-2 rounded-full transition-all"
                                            style={{ width: `${paidPercentage}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Paid: ₹{vendor.paid.toLocaleString()}</span>
                                        <span>Total: ₹{vendor.amount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenModal(vendor)}>Edit / Pay</Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingVendor ? "Edit Vendor Details" : "Add New Vendor"}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Vendor Name</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Vendor Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Input
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g. Catering, Photography"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contact</label>
                        <Input
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            placeholder="Phone Number"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Total Amount (₹)</label>
                            <Input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Paid Amount (₹)</label>
                            <Input
                                type="number"
                                value={formData.paid}
                                onChange={(e) => setFormData({ ...formData, paid: Number(e.target.value) })}
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select value={formData.status || "Pending"} onValueChange={(val) => setFormData({ ...formData, status: val as any })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Booked">Booked</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Vendor</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
