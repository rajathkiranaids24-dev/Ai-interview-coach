import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff, Mic, MicOff, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { PostureMetricsSummary } from '../types/index.ts';

interface PostureTrackerProps {
  onMetricsUpdate?: (metrics: PostureMetricsSummary) => void;
  isInterviewActive?: boolean;
}

export const PostureTracker: React.FC<PostureTrackerProps> = ({
  onMetricsUpdate,
  isInterviewActive = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [postureStatus, setPostureStatus] = useState<{
    text: string;
    isGood: boolean;
    shoulderDelta: number;
    headTilt: number;
    stability: number;
    isFacingCamera: boolean;
  }>({
    text: 'Calibrating posture...',
    isGood: true,
    shoulderDelta: 0,
    headTilt: 0,
    stability: 95,
    isFacingCamera: true,
  });

  // Track session metrics
  const sessionStats = useRef({
    totalFrames: 0,
    goodFrames: 0,
    facingCameraFrames: 0,
    tiltSum: 0,
    shoulderDeltas: [] as number[],
    movements: [] as number[],
    lastFrameData: null as Uint8ClampedArray | null,
  });

  // Start webcam
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Video play interrupted:', e));
      }
      setHasPermission(true);
      setIsCameraOn(true);
      setIsMicOn(true);
    } catch (err: any) {
      console.warn('Webcam or microphone access not granted:', err?.message);
      setHasPermission(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  // Toggle Camera
  const toggleCamera = () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  // Toggle Mic
  const toggleMic = () => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  // Real-time canvas frame analysis for posture, head position, shoulder alignment, and stability
  useEffect(() => {
    if (!hasPermission || !isCameraOn) return;

    let animId: number;
    const analyzeInterval = 400; // analyze every 400ms to preserve CPU
    let lastTime = Date.now();

    const processFrame = () => {
      const now = Date.now();
      if (now - lastTime >= analyzeInterval && videoRef.current && canvasRef.current) {
        lastTime = now;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx && video.readyState >= 2 && video.videoWidth > 0) {
          canvas.width = 160;
          canvas.height = 120;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          try {
            const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = frame.data;

            // Compute frame motion difference to detect excessive movement
            let frameDiff = 0;
            if (sessionStats.current.lastFrameData) {
              const prev = sessionStats.current.lastFrameData;
              let sampleDiffSum = 0;
              const step = 16;
              let sampleCount = 0;
              for (let i = 0; i < data.length; i += step * 4) {
                sampleDiffSum += Math.abs(data[i] - prev[i]);
                sampleCount++;
              }
              frameDiff = sampleDiffSum / sampleCount;
            }
            sessionStats.current.lastFrameData = new Uint8ClampedArray(data);

            // Compute center of mass of the upper torso / head area
            let totalWeight = 0;
            let weightedX = 0;
            let weightedY = 0;

            // Sample top half of the frame (head & shoulders)
            for (let y = 10; y < 80; y += 4) {
              for (let x = 20; x < 140; x += 4) {
                const idx = (y * canvas.width + x) * 4;
                // Luminance / skin / contrast heuristic
                const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
                if (lum > 30 && lum < 230) {
                  totalWeight += 1;
                  weightedX += x;
                  weightedY += y;
                }
              }
            }

            const centerX = totalWeight > 0 ? weightedX / totalWeight : 80;
            const headOffsetFromCenter = Math.abs(centerX - 80);

            // Estimate tilt angle
            const estimatedTilt = Math.min(25, Math.round((headOffsetFromCenter / 40) * 12));

            // Stability score
            const isFidgeting = frameDiff > 28;
            const stabilityScore = Math.max(60, Math.round(100 - frameDiff * 1.5));

            // Shoulder delta simulation based on left-right upper quadrant mass
            let leftQuadrantMass = 0;
            let rightQuadrantMass = 0;
            for (let y = 50; y < 100; y += 4) {
              for (let x = 20; x < 70; x += 4) {
                const idx = (y * canvas.width + x) * 4;
                leftQuadrantMass += data[idx];
              }
              for (let x = 90; x < 140; x += 4) {
                const idx = (y * canvas.width + x) * 4;
                rightQuadrantMass += data[idx];
              }
            }
            const shoulderDisparity = Math.abs(leftQuadrantMass - rightQuadrantMass) / (leftQuadrantMass + rightQuadrantMass + 1);
            const shoulderDegrees = Math.min(15, Math.round(shoulderDisparity * 20));

            // Facing camera heuristic
            const isFacingCamera = headOffsetFromCenter < 28;

            // Formulate posture verdict
            let advice = 'Good Posture – Shoulders Aligned';
            let isGood = true;

            if (isFidgeting) {
              advice = 'Avoid excessive movement – maintain stable posture';
              isGood = false;
            } else if (!isFacingCamera) {
              advice = 'Try to face the camera directly';
              isGood = false;
            } else if (shoulderDegrees > 7) {
              advice = 'Keep your shoulders level and relaxed';
              isGood = false;
            } else if (estimatedTilt > 12) {
              advice = 'Hold your head straight with confidence';
              isGood = false;
            }

            setPostureStatus({
              text: advice,
              isGood,
              shoulderDelta: shoulderDegrees,
              headTilt: estimatedTilt,
              stability: stabilityScore,
              isFacingCamera,
            });

            // Accumulate statistics
            const s = sessionStats.current;
            s.totalFrames++;
            if (isGood) s.goodFrames++;
            if (isFacingCamera) s.facingCameraFrames++;
            s.tiltSum += estimatedTilt;
            s.shoulderDeltas.push(shoulderDegrees);
            s.movements.push(stabilityScore);

            // Emit updated summary every 5 frames if interview is active
            if (s.totalFrames % 5 === 0 && onMetricsUpdate) {
              const goodPercent = Math.round((s.goodFrames / s.totalFrames) * 100);
              const facePercent = Math.round((s.facingCameraFrames / s.totalFrames) * 100);
              const avgTilt = Math.round(s.tiltSum / s.totalFrames);
              const avgStability = Math.round(
                s.movements.reduce((a, b) => a + b, 0) / s.movements.length
              );
              const shoulderScore = Math.max(70, Math.round(100 - (s.shoulderDeltas.reduce((a, b) => a + b, 0) / s.shoulderDeltas.length) * 3));
              const overallScore = Math.round(
                goodPercent * 0.4 + facePercent * 0.2 + avgStability * 0.2 + shoulderScore * 0.2
              );

              onMetricsUpdate({
                overallPostureScore: Math.min(98, Math.max(65, overallScore)),
                goodPosturePercentage: goodPercent,
                averageHeadTilt: avgTilt,
                shoulderAlignmentScore: shoulderScore,
                cameraFacingPercentage: facePercent,
                movementStabilityScore: avgStability,
                observations: [
                  goodPercent >= 80 ? 'Maintained consistent upright posture' : 'Frequent posture shifts detected',
                  facePercent >= 85 ? 'Strong and attentive eye contact with camera' : 'Looked away from camera intermittently',
                  avgStability >= 80 ? 'Calm physical presentation with minimal fidgeting' : 'Observed nervous fidgeting',
                ],
                tips: [
                  'Keep camera at eye level so you do not hunch downward',
                  'Rest both feet flat on the floor to maintain steady core alignment',
                  'Take steady breaths between answers to keep shoulders relaxed',
                ],
              });
            }
          } catch (e) {
            // Ignore cross-origin frame capture warnings
          }
        }
      }
      animId = requestAnimationFrame(processFrame);
    };

    animId = requestAnimationFrame(processFrame);
    return () => cancelAnimationFrame(animId);
  }, [hasPermission, isCameraOn, isInterviewActive, onMetricsUpdate]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl backdrop-blur-xl group">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video preview container */}
      <div className="relative aspect-[4/3] sm:aspect-video w-full bg-slate-900/90 flex items-center justify-center overflow-hidden">
        {hasPermission === false && (
          <div className="text-center p-6 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
              <CameraOff className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Camera Access Required</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Camera access enables local presentation and posture analysis. Video is processed locally in your browser and never saved.
            </p>
            <button
              onClick={startCamera}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Allow Camera & Mic
            </button>
          </div>
        )}

        {hasPermission && (
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-300 ${
              isCameraOn ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {hasPermission && !isCameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400">
            <CameraOff className="w-10 h-10 mb-2 opacity-50 text-slate-500" />
            <p className="text-xs">Camera is turned off</p>
          </div>
        )}

        {/* Live Posture Tracking Guidance Pill */}
        {hasPermission && isCameraOn && (
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md shadow-lg transition-all duration-300 ${
                postureStatus.isGood
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-950/85 text-amber-300 border border-amber-500/40 animate-pulse'
              }`}
            >
              {postureStatus.isGood ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className="truncate max-w-[220px]">{postureStatus.text}</span>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-mono text-cyan-400">
              Live Feed
            </div>
          </div>
        )}

        {/* Posture HUD overlay reticle (subtle presentation aid) */}
        {hasPermission && isCameraOn && (
          <div className="absolute inset-0 pointer-events-none border border-cyan-500/10 m-4 rounded-xl flex items-center justify-center">
            <div className="w-32 h-44 rounded-full border border-dashed border-cyan-500/20 opacity-40" />
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleCamera}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              isCameraOn
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
            title={isCameraOn ? 'Turn camera off' : 'Turn camera on'}
          >
            {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{isCameraOn ? 'Camera On' : 'Camera Off'}</span>
          </button>

          <button
            onClick={toggleMic}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              isMicOn
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
            title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
          >
            {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMicOn ? 'Mic Active' : 'Muted'}</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          <span>Local Analysis Active</span>
        </div>
      </div>
    </div>
  );
};
