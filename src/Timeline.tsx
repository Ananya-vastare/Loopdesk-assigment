import React, { useRef, useEffect, useState } from "react";
import SegmentsOverlay from "./SegmentOverlay";
import "./Timeline.css";

interface Segment {
    type: "silent" | "highlight";
    start: number;
    end: number;
}

interface KeyMoment {
    label: string;
    time: number;
}

interface TimelineProps {
    duration: number;
    currentTime: number;
    onSeek: (time: number) => void;
    segments: Segment[];
    keyMoments: KeyMoment[];
    videoRef: React.RefObject<HTMLVideoElement | null>;
    videoTitle: string;
}

const Timeline: React.FC<TimelineProps> = ({
    duration,
    currentTime,
    onSeek,
    segments,
    keyMoments,
    videoRef,
    videoTitle,
}) => {
    const barRef = useRef<HTMLDivElement>(null);
    const [widthPx, setWidthPx] = useState(0);

    useEffect(() => {
        const updateWidth = () => {
            if (barRef.current) {
                setWidthPx(barRef.current.clientWidth);
            }
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

    return (
        <div className="timeline-container">
            <div
                className="timeline-bar"
                ref={barRef}
                onClick={(e) => {
                    const rect = barRef.current!.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    onSeek(pct * duration);
                }}
            >
                <SegmentsOverlay
                    duration={duration}
                    widthPx={widthPx}
                    segments={segments}
                    currentTime={currentTime}
                    videoRef={videoRef}
                    videoTitle={videoTitle}
                    onClick={(seg) => onSeek(seg.start)}
                />

                <div className="playhead" style={{ left: `${(currentTime / duration) * 100}%` }} />

                {keyMoments.map((km, i) => (
                    <div
                        key={i}
                        className="key-moment"
                        style={{ left: `${(km.time / duration) * 100}%` }}
                        title={km.label}
                    />
                ))}
            </div>

            <div className="timeline-ticks">
                {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i}>{formatTime((i * duration) / 10)}</div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;