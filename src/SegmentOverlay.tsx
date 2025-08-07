import React, { useEffect } from "react";

interface Segment {
    type: "silent" | "highlight";
    start: number;
    end: number;
}

interface SegmentsOverlayProps {
    duration: number;
    widthPx: number;
    segments: Segment[];
    currentTime: number;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    videoTitle: string;
    onClick?: (seg: Segment) => void;
}

const SegmentsOverlay: React.FC<SegmentsOverlayProps> = ({
    duration,
    widthPx,
    segments,
    currentTime,
    videoRef,
    videoTitle,
    onClick,
}) => {
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const activeSegment = segments.find(
            (seg) => currentTime >= seg.start && currentTime < seg.end
        );

        if (videoTitle === "Bugs Bunny") {
            if (activeSegment?.type === "silent") {
                if (!video.muted || video.volume !== 0) {
                    video.muted = true;
                    video.volume = 0;
                    console.log("[Bugs Bunny] Muted for silent segment");
                }
            } else {
                if (video.muted || video.volume === 0) {
                    video.muted = false;
                    video.volume = 1;
                    console.log("[Bugs Bunny] Unmuted outside silent segment");
                }
            }
        } else {
            const shouldMute = Math.random() > 0.5;
            video.muted = shouldMute;
            video.volume = shouldMute ? 0 : 1;
        }
    }, [currentTime, videoRef, videoTitle, segments]);


    return (
        <div style={{ position: "absolute", top: 0, left: 0, width: widthPx, height: "100%" }}>
            {segments.map((seg, idx) => {
                const left = (seg.start / duration) * widthPx;
                const width = ((seg.end - seg.start) / duration) * widthPx;
                const backgroundColor = seg.type === "silent" ? "#fcd34d" : "#10b981";

                return (
                    <div
                        key={idx}
                        onClick={() => onClick?.(seg)}
                        title={`${seg.type} ${seg.start.toFixed(1)}–${seg.end.toFixed(1)}`}
                        style={{
                            position: "absolute",
                            left,
                            width,
                            height: "100%",
                            backgroundColor,
                            cursor: onClick ? "pointer" : "default",
                            opacity: 0.6,
                        }}
                    />
                );
            })}
        </div>
    );
};

export default SegmentsOverlay;