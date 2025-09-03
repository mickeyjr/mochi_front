import React, { useRef } from "react";
import Webcam from "react-webcam";

type CameraCaptureProps = {
  onCapture: (file: File) => void
  onClose: () => void
  width?: number
  height?: number
}


export default function CameraCapture({ onCapture, onClose, width = 1280, height = 720 }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    // Convertir base64 a File
    const byteString = atob(imageSrc.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

    const blob = new Blob([ab], { type: "image/png" });
    const file = new File([blob], "foto.png", { type: "image/png" });
    onCapture(file);
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded shadow-md bg-white">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={width}
        videoConstraints={{
          width: width,   
          height: height,
          facingMode: "environment",
        }}
      />

      <div className="flex gap-2 mt-2">
        <button
          onClick={capture}
          className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
        >
          Tomar foto
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
