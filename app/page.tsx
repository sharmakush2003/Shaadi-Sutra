"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Users, Hotel, PieChart } from "lucide-react";
import { useWedding } from "./context/WeddingContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { guests, budgetItems, vendors, tasks, rooms } = useWedding();
  const router = useRouter();

  const weddingDate = new Date("2026-12-12"); // Placeholder date, can be moved to settings later
  const today = new Date();
  const daysLeft = differenceInDays(weddingDate, today);

  // Derived Stats
  const confirmedGuests = guests.filter(g => g.status === "Confirmed").length;
  // const totalGuests = guests.length;

  const pendingTasks = tasks.filter(t => t.status === "Pending").length;

  const roomsOccupied = rooms.filter(r => r.status === "Occupied").length;
  const totalRooms = rooms.length;

  const stats = [
    { title: "Days to Go", value: daysLeft, icon: Clock, color: "text-maroon-600" },
    { title: "Confirmed Guests", value: confirmedGuests, icon: Users, color: "text-gold-600" },
    { title: "Rooms Booked", value: `${roomsOccupied}/${totalRooms}`, icon: Hotel, color: "text-maroon-800" },
    { title: "Vendors Booked", value: vendors.filter(v => v.status === "Booked").length, icon: Hotel, color: "text-gold-700" },
  ];

  return (
    <div className="space-y-10 pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-maroon-900 to-maroon-800 text-white p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gold-100 mb-2">
              Welcome, <span className="text-gold-400">Bride & Groom</span>
            </h1>
            <p className="text-maroon-100/80 text-lg max-w-lg font-light tracking-wide">
              "Marriages are settled in heaven but celebrated on earth." <br />
              <span className="text-sm mt-2 block opacity-70">— Your wedding planning journey continues.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button
              size="lg"
              className="bg-gold-500 text-maroon-950 hover:bg-gold-400 hover:text-black border-none shadow-glow font-serif text-lg px-8 py-6"
              onClick={() => router.push('/tasks')}
            >
              Manage Tasks
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid - "Levitating" Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (index * 0.1), type: "spring", stiffness: 100 }}
          >
            <Card className="h-full border-t-4 border-t-gold-500 bg-white/80 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="p-3 rounded-full bg-maroon-50/50 mb-1">
                  <stat.icon className={`w-8 h-8 ${stat.color} stroke-[1.5]`} />
                </div>
                <h3 className="text-4xl font-serif font-bold text-maroon-900 tracking-tight">{stat.value}</h3>
                <p className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-semibold">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress & Budget */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full bg-white/90">
            <CardHeader className="border-b border-gray-100/50 pb-4">
              <CardTitle className="text-2xl font-serif text-maroon-800">Event Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-7 pt-6">
              {["Haldi", "Mehendi", "Wedding", "Reception"].map((event, i) => (
                <div key={event} className="group">
                  <div className="flex justify-between text-sm mb-2 text-maroon-900 font-medium">
                    <span className="font-serif text-lg">{event}</span>
                    <span className="text-gold-600">{30 + i * 15}%</span>
                  </div>
                  <div className="w-full bg-maroon-50 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-maroon-800 to-gold-500 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${30 + i * 15}%` }}
                      transition={{ duration: 1.5, delay: 0.8 + (i * 0.2) }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full bg-white/90">
            <CardHeader className="border-b border-gray-100/50 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-serif text-maroon-800">Quick Budget</CardTitle>
              <PieChart className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {budgetItems.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-lg hover:bg-gold-50/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="font-medium text-maroon-900 font-serif">{item.name}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-bold text-maroon-800">₹{item.cost.toLocaleString()}</span>
                      <span className="text-gray-400 mx-2 text-[10px]">OF</span>
                      <span className="text-gray-500">₹{item.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 border-dashed border-maroon-200 text-maroon-700 hover:bg-maroon-50 hover:border-maroon-300" onClick={() => router.push('/budget')}>
                  View Full Budget Breakdown
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
