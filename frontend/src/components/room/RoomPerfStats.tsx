import { WebSocketContext } from "@/context/WsContext";
import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { useConsumerStore } from "@/engine/rtc/store/ConsumerStore";
import { useMediaStore } from "@/engine/rtc/store/MediaStore";
import { useProducerStore } from "@/engine/rtc/store/ProducerStore";
import React, { useContext, useEffect, useRef, useState } from "react";
type RoomPerfStatsProps = {};

export const RoomPerfStats: React.FC<RoomPerfStatsProps> = () => {
  const { game } = useRendererStore();
  const { audioProducer, videoProducer } = useProducerStore();
  const { conn } = useContext(WebSocketContext);
  const startTime = useRef(0);

  const [stats, setStats] = useState({
    fps: 0,
    latency: "N/A ms",
    uptime: "0s/0s",
    cpu: "N/A%",
    gpu: "N/A%",
    mem: "N/A/N/A",
    highFps: false,
    space: "🎁: 87(1)",
    renderBusyTime: "0.5%",
    timeoutDelay: "-3.73ms",
    longTasks: 0,
    hwTier: 0,
    gpuTier: "3 (Intel Xe Graphics)",
    gpuPowerLevel: "3 (Intel Xe Graphics)",
    device: "Linux x86_64, Chrome 124",
    browserSize: "1920 x 967 (DPR: 1, Render Scale: 1.00)",
    audioBandwidth: "N/A",
    videoBandwidth: "N/A",
  });
  const [currentAudioStats, setAudioTransportStats] = useState(null);
  const [currentVideoStats, setVideoTransportStats] = useState(null);

  useEffect(() => {
    const ping = () => {
      startTime.current = Date.now();
      conn?.emit("ping");
    };

    const pong = () => {
      const latency = Date.now() - startTime.current;
      setStats((prevStats) => ({ ...prevStats, latency: `${latency}ms` }));
      console.log(`Latency is ${latency} ms`);
    };

    conn?.on("pong", pong);

    // Ping immediately on mount, and then every second
    ping();
    const interval = setInterval(ping, 1000);

    return () => {
      clearInterval(interval);
      conn?.off("pong", pong);
    };
  }, [conn]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const audioStats = await audioProducer!.getStats();
        const videoStats = await videoProducer!.getStats();

        const calculateBandwidth = (currentStats: any) => {
          const bytesSent = currentStats.bytesSent;
          const bytesReceived = currentStats.bytesReceived;

          const sendBandwidth = bytesSent * 8; // Calculate send bandwidth in bits per second
          const recvBandwidth = bytesReceived * 8; // Calculate receive bandwidth in bits per second

          return { sendBandwidth, recvBandwidth };
        };

        if (audioStats) {
          const currentAudioStats = audioStats.get("T01");
          const { sendBandwidth, recvBandwidth } =
            calculateBandwidth(currentAudioStats);
          setStats((prevStats) => ({
            ...prevStats,
            audioBandwidth: `${sendBandwidth} bps`,
          }));
          setAudioTransportStats(currentAudioStats);
        }

        if (videoStats) {
          const currentVideoStats = videoStats.get("T01");
          const { sendBandwidth, recvBandwidth } =
            calculateBandwidth(currentVideoStats);
          setStats((prevStats) => ({
            ...prevStats,
            videoBandwidth: `${sendBandwidth} bps`,
          }));
          setVideoTransportStats(currentVideoStats);
        }
      } catch (error) {
        console.error("Error fetching transport stats:", error);
      }
    };

    const interval = setInterval(fetchStats, 1000); // Fetch stats every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [audioProducer, videoProducer]);

  useEffect(() => {
    if (!game) return;
    const updateStats = () => {
      const uptime = performance.now();
      const mem = performance.memory
        ? `${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB/${(
            performance.memory.jsHeapSizeLimit /
            1024 /
            1024
          ).toFixed(2)}MB`
        : "N/A";
      const highFps = game.loop.actualFps > 24;
      const browserSize = `${window.innerWidth} x ${window.innerHeight} (DPR: ${window.devicePixelRatio}, Render Scale: 1.00)`;
      const device = `${navigator.platform}`;

      setStats((prevStats) => ({
        ...prevStats,
        fps: Math.round(game.loop.actualFps),
        uptime: `${uptime.toFixed(2)}ms`,
        mem,
        highFps,
        browserSize,
        device,
      }));
    };

    game.events.on("step", updateStats);

    return () => {
      game.events.off("step", updateStats);
    };
  }, [game]);

  useEffect(() => {
    const gl = document.createElement("canvas").getContext("webgl");

    if (!gl) return;
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const vendor = gl.getParameter(debugInfo!.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo!.UNMASKED_RENDERER_WEBGL);

    setStats((prevStats) => ({
      ...prevStats,
      gpu: `${vendor}, ${renderer}`,
    }));
  }, []);

  useEffect(() => {
    const updateCpuUsage = () => {
      const cpuMetrics = window.performance.getEntriesByType("resource");
      const lastMetric = cpuMetrics[cpuMetrics.length - 1];

      if (lastMetric) {
        setStats((prevStats) => ({
          ...prevStats,
          cpu: `${lastMetric.duration.toFixed(2)} ms`,
        }));
      }
    };

    const interval = setInterval(updateCpuUsage, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div
      style={{
        color: "white",
        borderRadius: "5px",
        width: "300px",
      }}
      className="absolute bg-black/50 p-3  top-2 left-2 font-sans text-xs z-50 "
    >
      <p>FPS: {stats.fps}</p>
      <p>Latency: {stats.latency}</p>
      <p>Uptime: {stats.uptime}</p>
      <p>CPU: {stats.cpu}</p>
      <p>GPU: {stats.gpu}</p>
      <p>MEM (GB): {stats.mem}</p>
      <p>High FPS: {stats.highFps ? "🟢" : "🔴"}</p>
      <p>Device: {stats.device}</p>
      <p>Browser Size: {stats.browserSize}</p>
      <p>Audio Bandwidth: {stats.audioBandwidth}</p>
      <p>Video Bandwidth: {stats.videoBandwidth}</p>
    </div>
  );
};
