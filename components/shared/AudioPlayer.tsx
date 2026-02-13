"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Auto-play might be blocked by browsers, so we start muted or wait for interaction
        // For now, we'll just set it up and let user toggle.
        if (audioRef.current) {
            audioRef.current.volume = 0.3; // Low volume for background
        }
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Playback failed", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <audio
                ref={audioRef}
                loop
                src="https://upload.wikimedia.org/wikipedia/commons/e/e6/Santoor_-_Raag_Charukeshi_-_Alaap_Jod_Jhala_-_Pt._Tarun_Bhattacharya.ogg"
            />
            <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 bg-white/80 backdrop-blur-sm border-maroon-200 shadow-lg hover:bg-maroon-50 text-maroon-800"
                onClick={togglePlay}
                title={isPlaying ? "Mute Ambiance" : "Play Ambiance"}
            >
                {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
        </div>
    );
}
