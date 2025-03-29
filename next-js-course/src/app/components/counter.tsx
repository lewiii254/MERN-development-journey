"use client";
import { useState } from "react";

export const Counter = () => {
    console.log("Rendering Counter component");
    const [count, setCount] = useState(0);
    
    return (
        <div>
        <h1>{count}</h1>
        <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
        <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
    }