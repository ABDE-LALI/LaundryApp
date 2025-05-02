import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import axios from 'axios'; // Add axios for JSON fetching
import Dashboard from "../Dashboard";

const Statistics = () => {
    const { props } = usePage();
    const [stats, setStats] = useState(props.stats || {
        totalTickets: 0,
        totalOrders: 0,
        paidTickets: 0,
        unpaidTickets: 0,
        ticketStatusData: [],
        paymentStatusData: [],
    });

    // Optional: Fetch updated stats dynamically
    useEffect(() => {
        // Uncomment to fetch updates on mount
        // fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const { data } = await axios.get('/serve/statistics-data');
            setStats(data);
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    };

    const COLORS = ["#0088FE", "#FFBB28", "#00C49F"];

    return (
        <Dashboard>
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-6 py-4">Statistics Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="border rounded-lg p-4">
                        <h2 className="text-lg font-semibold">Total Tickets</h2>
                        <p className="text-2xl font-semibold">{stats.totalTickets}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <h2 className="text-lg font-semibold">Total Orders</h2>
                        <p className="text-2xl font-semibold">{stats.totalOrders}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <h2 className="text-lg font-semibold">Paid Tickets</h2>
                        <p className="text-2xl font-semibold">{stats.paidTickets}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <h2 className="text-lg font-semibold">Unpaid Tickets</h2>
                        <p className="text-2xl font-semibold">{stats.unpaidTickets}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-2">Ticket Status Distribution</h2>
                        <BarChart width={450} height={300} data={stats.ticketStatusData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </div>
                    <div className="border rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-2">Payment Status</h2>
                        <PieChart width={400} height={300}>
                            <Pie
                                data={stats.paymentStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                                {stats.paymentStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </div>
            </div>
        </Dashboard>
    );

};

export default Statistics;