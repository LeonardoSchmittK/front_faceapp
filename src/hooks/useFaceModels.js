import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export function useFaceModels(activeClass, initRoll, triggerLoad) {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [labeledDescriptors, setLabeledDescriptors] = useState(null);
  const [loadingError, setLoadingError] = useState(null);

  useEffect(() => {
    if (!triggerLoad) return;

    if (!activeClass || !initRoll) {
      console.log('No active class or students found');
      setModelsLoaded(false);
      setLabeledDescriptors(null);
      return;
    }

    const loadModels = async () => {
      try {
        const MODEL_URI = '/models';
        console.log('Loading face-api.js models from:', MODEL_URI);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URI),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URI),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URI),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URI),
        ]);
        console.log('Models loaded successfully');

        const descriptors = await loadLabeledImages(activeClass);
        console.log('Descriptors loaded:', descriptors);
        setLabeledDescriptors(descriptors);
        setModelsLoaded(true);
      } catch (err) {
        console.error('Error loading models or descriptors:', err);
        setLoadingError(err);
      }
    };

    loadModels();

    return () => {};
  }, [triggerLoad, activeClass, initRoll]);

  const loadLabeledImages = async (students) => {
    try {
      const descriptorPromises = students.map(async (student) => {
        console.log(`Fetching image for ${student.name}: ${student.image}`);
        const img = await faceapi.fetchImage(student.image, {
          cache: 'force-cache',
        });

        const detections = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detections) {
          console.warn(`No face detected in image for ${student.name}`);
          return null;
        }

        return new faceapi.LabeledFaceDescriptors(student.name, [detections.descriptor]);
      });

      const results = await Promise.all(descriptorPromises);
      return results.filter((descriptor) => descriptor !== null);
    } catch (err) {
      console.error('Error loading labeled images:', err);
      throw err;
    }
  };

  return { modelsLoaded, labeledDescriptors, loadingError };
}