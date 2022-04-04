import { useEffect, useRef, useState } from 'react';

export interface ScreenRecordingState {
  isRecording: boolean;
  recordingObjectUrl: string;
}

export function useScreenRecording(): [ScreenRecordingState, () => void, () => void] {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingObjectUrl, setRecordingObjectUrl] = useState<string>(null);
  const mediaStreamRef = useRef<MediaStream>(null);

  useEffect(() => {
    const stopRecording = () => {
      if (!mediaStreamRef.current) {
        return;
      }

      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    };

    const startRecording = async () => {
      let videoStream: MediaStream;
      let audioStream: MediaStream;

      try {
        videoStream = await navigator.mediaDevices.getDisplayMedia({
          audio: false,
          video: true,
        });
      } catch (e) {
        console.log('Error while requesting screen recording.', e);
        setIsRecording(false);
        return;
      }

      try {
        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        mediaStreamRef.current = new MediaStream([
          ...videoStream.getTracks(),
          ...audioStream.getAudioTracks(),
        ]);
      } catch (e) {
        console.log('Error while requesting audio recording.', e);
        mediaStreamRef.current = new MediaStream([
          ...videoStream.getTracks(),
        ]);
      }

      const recorder = new MediaRecorder(mediaStreamRef.current);

      recorder.ondataavailable = (event: BlobEvent) => {
        const blob = new Blob([event.data], { type: 'video/webm' });
        setRecordingObjectUrl(window.URL.createObjectURL(blob));
        setIsRecording(false);
        mediaStreamRef.current = null;
      };

      recorder.onerror = (e) => {
        console.error(e);
      };

      recorder.start();

      videoStream.addEventListener('inactive', () => {
        stopRecording();
      })
    };

    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const toggleIsRecording = () => {
    setIsRecording(!isRecording);
  };

  const deleteRecording = () => {
    setRecordingObjectUrl(null);
  }

  return [{ isRecording, recordingObjectUrl }, toggleIsRecording, deleteRecording];
}
