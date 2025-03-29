"use client"
import { useRouter } from "next/navigation";

export default function AboutPage() {
    const router = useRouter();
    return (
        <div className="text-center text-lg">
            <h1>About Us</h1>
            <p>This is the about page.</p>
            <p>We are a small company specializing in providing high-quality products.</p>
            <p>Our mission is to create innovative solutions that make a difference.</p>
            <p>Contact us at <a href="mailto:company@example.com">company@example.com</a></p>
            <p>Follow us on <a href="https://twitter.com/companyname">Twitter</a> or <a href="https://www.facebook.com/companyname">Facebook</a></p>
            <button 
            onClick={() => router.push("/")}
            className="bg-blue-500 hover:bg-black-700 text-white font-bold py-2 px-4 rounded">Go home</button>
        </div>
    );
}