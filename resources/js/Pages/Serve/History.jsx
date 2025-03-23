import { Head } from "@inertiajs/react";
import React from "react";
import Dashboard from "../Dashboard";
export default function Index() {
    return (
        <Dashboard>
            <Head title="Serve" />
            <div>
                <h1>Serve</h1>
            </div>
        </Dashboard>
    );
}