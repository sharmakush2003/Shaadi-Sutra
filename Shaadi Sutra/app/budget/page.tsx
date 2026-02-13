"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useWedding } from "../context/WeddingContext";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { BudgetItem } from "@/types";

export default function BudgetPage() {
    const { budgetItems, addBudgetItem } = useWedding();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newItem, setNewItem] = useState<Partial<BudgetItem>>({
        name: "",
        value: 0,
        cost: 0,
        color: "#800000",
    });

    const TOTAL_BUDGET = budgetItems.reduce((acc, curr) => acc + curr.value, 0);
    const TOTAL_SPENT = budgetItems.reduce((acc, curr) => acc + curr.cost, 0);
    const REMAINING = TOTAL_BUDGET - TOTAL_SPENT;

    // Data for Pie Chart (Spending Breakdown)
    const chartData = budgetItems
        .filter(item => item.cost > 0)
        .map(item => ({ name: item.name, value: item.cost, color: item.color }));

    const handleSave = () => {
        if (!newItem.name || !newItem.value) return;

        addBudgetItem({
            id: Date.now().toString(),
            name: newItem.name,
            value: Number(newItem.value),
            cost: Number(newItem.cost) || 0,
            color: newItem.color || "#800000",
        });
        setIsModalOpen(false);
        setNewItem({ name: "", value: 0, cost: 0, color: "#800000" });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif text-maroon-900 font-bold">Budget Tracker</h1>
                    <p className="text-maroon-600">Keep your wedding expenses in check.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4 mr-2" /> Add Expense</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-t-4 border-t-maroon-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Total Budget</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-maroon-900">₹{TOTAL_BUDGET.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="border-t-4 border-t-red-600">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">₹{TOTAL_SPENT.toLocaleString()}</div>
                        <div className="flex items-center text-xs text-red-500 mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {TOTAL_BUDGET > 0 ? Math.round((TOTAL_SPENT / TOTAL_BUDGET) * 100) : 0}% utilized
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-t-4 border-t-green-600">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Remaining</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">₹{REMAINING.toLocaleString()}</div>
                        <div className="flex items-center text-xs text-green-500 mt-1">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            {REMAINING >= 0 ? "Safe Zone" : "Over Budget"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="h-[400px]">
                    <CardHeader>
                        <CardTitle>Spending Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="h-[400px] overflow-auto">
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {budgetItems.map((item) => (
                                <li key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <div>
                                            <p className="font-medium text-maroon-900">{item.name}</p>
                                            <p className="text-xs text-gray-500">Allocated: ₹{item.value.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-maroon-800">₹{item.cost.toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Budget Item"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name</label>
                        <Input
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            placeholder="e.g. Venue, Catering"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Allocated Budget (₹)</label>
                            <Input
                                type="number"
                                value={newItem.value}
                                onChange={(e) => setNewItem({ ...newItem, value: Number(e.target.value) })}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Already Spent (₹)</label>
                            <Input
                                type="number"
                                value={newItem.cost}
                                onChange={(e) => setNewItem({ ...newItem, cost: Number(e.target.value) })}
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Color Code</label>
                        <div className="flex gap-2">
                            {["#800000", "#DAA520", "#333", "#D97706", "#BE123C", "#15803d"].map(color => (
                                <button
                                    key={color}
                                    className={`w-6 h-6 rounded-full border-2 ${newItem.color === color ? 'border-maroon-900' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setNewItem({ ...newItem, color })}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Add Item</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
