import { useRef, useState, useEffect } from "react";
import Timeline from "./Timeline";
import "./Video.css";

interface Segment {
    type: "silent" | "highlight";
    start: number;
    end: number;
}

interface KeyMoment {
    label: string;
    time: number;
}

const Video = () => {

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [segments, setSegments] = useState<Segment[]>([]);
    const [keyMoments, setKeyMoments] = useState<KeyMoment[]>([]);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(1);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoSrc(URL.createObjectURL(file));
            setPlaying(false);
            setCurrentTime(0);
        }
    };

    const handleSeek = (time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (playing) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setPlaying(!playing);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = vol;
        }
        setVolume(vol);
    };

    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;

        const onLoaded = () => {
            setDuration(vid.duration);
            setKeyMoments([
                { label: "Intro", time: vid.duration * 0.1 },
                { label: "Highlight", time: vid.duration * 0.5 },
                { label: "Ending", time: vid.duration * 0.9 },
            ]);
            setSegments([
                { type: "silent", start: 5, end: 15 },
                { type: "highlight", start: 30, end: 45 },
            ]);
        };

        const onTime = () => setCurrentTime(vid.currentTime);
        const onEnd = () => setPlaying(false);

        vid.addEventListener("loadedmetadata", onLoaded);
        vid.addEventListener("timeupdate", onTime);
        vid.addEventListener("ended", onEnd);
        vid.volume = volume;

        return () => {
            vid.removeEventListener("loadedmetadata", onLoaded);
            vid.removeEventListener("timeupdate", onTime);
            vid.removeEventListener("ended", onEnd);
        };
    }, [videoSrc, volume]);

    return (
        <div className="video-wrapper">
            <h1 className="my-heading">Loopdesk Assignment</h1>

            <div className="upload-container">
                <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleUpload}
                />
                <label htmlFor="video-upload" className="custom-upload-button">
                    Upload your video
                </label>
            </div>

            {videoSrc && (
                <>
                    <div className="video-player">
                        <video ref={videoRef} className="video-element" src={videoSrc} controls={false} />
                    </div>

                    <div className="video-controls">
                        <button onClick={togglePlay} className="control-button">
                            {playing ? "Pause" : "Play"}
                        </button>
                        <label htmlFor="volume-slider">🔊 Volume</label>
                        <input
                            id="volume-slider"
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={handleVolumeChange}
                            className="volume-slider"
                        />
                    </div>

                    <Timeline
                        duration={duration}
                        currentTime={currentTime}
                        onSeek={handleSeek}
                        segments={segments}
                        keyMoments={keyMoments}
                        videoRef={videoRef}
                        videoTitle="Uploaded Video"
                    />

                    <div className="key-moments">
                        {keyMoments.map((km, i) => (
                            <button key={i} onClick={() => handleSeek(km.time)} className="moment-button">
                                {km.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Video;
