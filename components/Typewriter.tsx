"use client";
import { useEffect, useState } from "react";

const sentences = [
    "My Ecommerce.",
    "Your favorite brands.",
    "Browse our collection.",
];

export function Typewriter() {
    const [sentenceIdx, setSentenceIdx] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [typing, setTyping] = useState(true);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (typing) {
            if (displayed.length < sentences[sentenceIdx].length) {
                timeout = setTimeout(() => {
                    setDisplayed(
                        sentences[sentenceIdx].slice(0, displayed.length + 1)
                    );
                }, 60);
            } else {
                timeout = setTimeout(() => setTyping(false), 1200);
            }
        } else {
            if (displayed.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayed(
                        sentences[sentenceIdx].slice(0, displayed.length - 1)
                    );
                }, 30);
            } else {
                setTyping(true);
                setSentenceIdx((prev) => (prev + 1) % sentences.length);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayed, typing, sentenceIdx]);

    return (
        <span>
            {displayed}
            <span className="animate-pulse">|</span>
        </span>
    );
}
