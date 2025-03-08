import React from "react";
import { Link } from "@inertiajs/react";
export default function Welcome() {
    return (
        <div>
            <h1>Welcome</h1>
            <Link href="/about">About</Link>
        </div>
    );
}
 
