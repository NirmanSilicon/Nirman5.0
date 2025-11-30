import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | null = null;
let modelMetadata: any = null;

export async function loadModelFromFiles(
  modelFile: File,
  weightsFile: File,
  metadataFile: File
): Promise<void> {
  try {
    // Read model.json
    const modelJson = JSON.parse(await modelFile.text());
    
    // Read weights.bin
    const weightsBuffer = await weightsFile.arrayBuffer();
    
    // Read metadata.json
    modelMetadata = JSON.parse(await metadataFile.text());
    
    // Create ModelArtifacts object (single argument format for tf.io.fromMemory)
    const modelArtifacts = {
      modelTopology: modelJson.modelTopology,
      weightSpecs: modelJson.weightsManifest[0].weights,
      weightData: weightsBuffer,
      format: modelJson.format || 'layers-model',
      generatedBy: modelJson.generatedBy || 'TensorFlow.js',
      convertedBy: modelJson.convertedBy
    };
    
    // Load model using the new single-argument API
    model = await tf.loadLayersModel(tf.io.fromMemory(modelArtifacts));
    
    console.log('Model loaded successfully');
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load model files. Please check the files and try again.');
  }
}

export async function predict(imageElement: HTMLImageElement): Promise<{
  className: string;
  probability: number;
}> {
  if (!model || !modelMetadata) {
    throw new Error('Model not loaded. Please upload model files first.');
  }

  try {
    // Get image size from metadata or use default
    const imageSize = modelMetadata.imageSize || 224;
    
    // Preprocess image
    let tensor = tf.browser.fromPixels(imageElement)
      .resizeNearestNeighbor([imageSize, imageSize])
      .toFloat();
    
    // Normalize based on metadata
    if (modelMetadata.normalizationMode === 'standard') {
      tensor = tensor.div(127.5).sub(1);
    } else {
      tensor = tensor.div(255.0);
    }
    
    // Add batch dimension
    tensor = tensor.expandDims(0);
    
    // Make prediction
    const predictions = await model.predict(tensor) as tf.Tensor;
    const probabilities = await predictions.data();
    
    // Clean up tensors
    tensor.dispose();
    predictions.dispose();
    
    // Find class with highest probability
    let maxProb = 0;
    let maxIndex = 0;
    for (let i = 0; i < probabilities.length; i++) {
      if (probabilities[i] > maxProb) {
        maxProb = probabilities[i];
        maxIndex = i;
      }
    }
    
    const className = modelMetadata.labels[maxIndex];
    
    return {
      className,
      probability: maxProb * 100
    };
  } catch (error) {
    console.error('Prediction error:', error);
    throw new Error('Failed to make prediction. Please try again.');
  }
}

export async function loadDefaultModel(): Promise<void> {
  try {
    // Fetch the bundled model files
    const [modelResponse, weightsResponse, metadataResponse] = await Promise.all([
      fetch('/model/model.json'),
      fetch('/model/weights.bin'),
      fetch('/model/metadata.json')
    ]);

    if (!modelResponse.ok || !weightsResponse.ok || !metadataResponse.ok) {
      throw new Error('Failed to fetch model files');
    }

    const modelJson = await modelResponse.json();
    const weightsBuffer = await weightsResponse.arrayBuffer();
    modelMetadata = await metadataResponse.json();

    // Create ModelArtifacts object
    const modelArtifacts = {
      modelTopology: modelJson.modelTopology,
      weightSpecs: modelJson.weightsManifest[0].weights,
      weightData: weightsBuffer,
      format: modelJson.format || 'layers-model',
      generatedBy: modelJson.generatedBy || 'TensorFlow.js',
      convertedBy: modelJson.convertedBy
    };

    // Load model
    model = await tf.loadLayersModel(tf.io.fromMemory(modelArtifacts));
    console.log('Default model loaded successfully');
  } catch (error) {
    console.error('Error loading default model:', error);
    throw new Error('Failed to load default model');
  }
}

export function isModelLoaded(): boolean {
  return model !== null && modelMetadata !== null;
}
