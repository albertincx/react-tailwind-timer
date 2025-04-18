// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Pause, Play, RotateCcw, Plus, Minus, Repeat } from 'lucide-react';

export default function Timer() {
    const [time, setTime] = useState(300); // 5 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const [isRepeatable, setIsRepeatable] = useState(false);
    const [customTime, setCustomTime] = useState('');
    const [presets, setPresets] = useState([60, 300, 600, 900, 1800]); // 1min, 5min, 10min, 15min, 30min
    const audioRef = useRef(null);
    const intervalRef = useRef(null);

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    }, []);

    // Timer logic
    useEffect(() => {
        if (isActive && time > 0) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            playSound();
            if (isRepeatable) {
                resetTimer();
            } else {
                setIsActive(false);
            }
        }

        return () => clearInterval(intervalRef.current);
    }, [isActive, time, isRepeatable]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        // @ts-ignore
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        setIsActive(false);
        setTime(300); // Reset to default 5 minutes
    };

    const addTime = (seconds) => {
        setTime((prevTime) => prevTime + seconds);
    };

    const handleCustomTimeChange = (e) => {
        setCustomTime(e.target.value);
    };

    const setCustomTimeHandler = () => {
        const customSeconds = parseInt(customTime) * 60;
        if (!isNaN(customSeconds) && customSeconds > 0) {
            setTime(customSeconds);
            setCustomTime('');
        }
    };

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    };

    const selectPreset = (presetTime) => {
        setTime(presetTime);
        setIsActive(false);
    };

    const toggleRepeat = () => {
        setIsRepeatable(!isRepeatable);
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">React Timer</h1>

                <div className="mb-8 text-center">
                    <div className="text-6xl font-mono font-bold mb-4 text-gray-800">
                        {formatTime(time)}
                    </div>

                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            onClick={toggleTimer}
                            className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                        >
                            {isActive ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="p-3 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition"
                        >
                            <RotateCcw size={24} />
                        </button>
                    </div>

                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            onClick={() => addTime(-600)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                            <Minus size={18} /> 10m
                        </button>
                        <button
                            onClick={() => addTime(600)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            <Plus size={18} /> 10m
                        </button>
                    </div>

                    <div className="flex items-center mb-6">
                        <input
                            type="number"
                            placeholder="Enter minutes"
                            value={customTime}
                            onChange={handleCustomTimeChange}
                            className="p-2 border border-gray-300 rounded mr-2 flex-grow"
                            min="1"
                        />
                        <button
                            onClick={setCustomTimeHandler}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            Set
                        </button>
                    </div>

                    <div className="flex items-center justify-center mb-6">
                        <button
                            onClick={toggleRepeat}
                            className={`flex items-center px-4 py-2 rounded transition ${isRepeatable ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            <Repeat size={18} className="mr-2" />
                            {isRepeatable ? 'Repeat: ON' : 'Repeat: OFF'}
                        </button>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h2 className="text-lg font-semibold mb-3 text-center">Presets</h2>
                    <div className="grid grid-cols-3 gap-2">
                        {presets.map((preset, index) => (
                            <button
                                key={index}
                                onClick={() => selectPreset(preset)}
                                className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
                            >
                                {Math.floor(preset / 60)} min
                            </button>
                        ))}
                        <button
                            onClick={() => playSound()}
                            className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-sm flex items-center justify-center"
                        >
                            <Bell size={16} className="mr-1" /> Test
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
