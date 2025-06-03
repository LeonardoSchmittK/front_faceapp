// hooks/useFaceModels.js
import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export function useFaceModels() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [labeledDescriptors, setLabeledDescriptors] = useState(null);
  const [loadingError, setLoadingError] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Preload model weights by setting up the base URI
        const MODEL_URI = '/models'; // Ensure this is a CDN or optimized local path

        // Load models in parallel with aggressive caching
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URI),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URI),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URI),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URI),
        ]);

        // Load reference images after models are ready
        const descriptors = await loadLabeledImages();
        setLabeledDescriptors(descriptors);
        setModelsLoaded(true);
      } catch (err) {
        console.error('Error loading models or descriptors:', err);
        setLoadingError(err);
      }
    };

    loadModels();
  }, []);

  const loadLabeledImages = async () => {
    const labels = ['Leo'];
    try {
      const descriptorPromises = labels.map(async (label) => {
        // Preload image to reduce fetch latency
        const img = await faceapi.fetchImage(`/known/${label.toLowerCase()}.jpg`, {
          cache: 'force-cache', // Use browser cache if available
        });

        const detections = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detections) {
          throw new Error(`No face detected in image for ${label}`);
        }

        return new faceapi.LabeledFaceDescriptors(label, [detections.descriptor]);
      });

      return await Promise.all(descriptorPromises);
    } catch (err) {
      console.error('Error loading labeled images:', err);
      throw err; // Propagate error to be caught in loadModels
    }
  };

  return { modelsLoaded, labeledDescriptors, loadingError };
}