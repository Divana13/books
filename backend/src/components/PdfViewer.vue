<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';

// Dynamically import the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  }
});

const pdfViewerRef = ref(null);
let currentRenderingTasks = []; // Keep track of rendering tasks
let currentPdfDocument = null; // Store the current PDF document reference

const renderPDF = async (pdfData) => {
  if (!pdfData) return;
  // Cancel previous rendering tasks
  currentRenderingTasks.forEach((task) => task.cancel && task.cancel());
  currentRenderingTasks = [];

  const container = pdfViewerRef.value;
  if (container) {
    container.innerHTML = ''; // Clear the container
  }

  try {
    const pdf = await pdfjsLib.getDocument(pdfData).promise;
    currentPdfDocument = pdf; // Store the current PDF document reference

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // Calculate dynamic scale based on container width, with some max width limitation
      const containerWidth = pdfViewerRef.value.clientWidth;
      const windowWidth = window.innerWidth;

      // Adjust scale based on window width, but don't go below 1 (minimum zoom)
      const scale = Math.min(containerWidth / page.view[2], windowWidth / page.view[2] * 0.98);

      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      canvas.style.margin = '0 auto'; // Center each canvas horizontally
      canvas.style.display = 'block'; // Ensure no extra spacing around the canvas

      container.appendChild(canvas);

      const renderTask = page.render({ canvasContext: context, viewport });
      currentRenderingTasks.push(renderTask); // Track the render task

      await renderTask.promise; // Wait for rendering to complete
    }
  } catch (error) {
    console.error('Error rendering PDF:', error);
  }
};

// Function to re-render the PDF on window resize
const onResize = () => {
  if (currentPdfDocument) {
    renderPDF(props.pdfUrl); // Re-render the PDF with the current URL
  }
};

watch(
  () => props.pdfUrl,
  (newUrl) => {
    if (newUrl) {
      renderPDF(newUrl);
    }
  }
);

onMounted(() => {
  if (props.pdfUrl) {
    renderPDF(props.pdfUrl);
  }
  window.addEventListener('resize', onResize); // Listen for viewport changes
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize); // Clean up event listener
});
</script>

<template>
  <div class="flex justify-center items-center">
    <div
      ref="pdfViewerRef"
      style="overflow-y: auto; height: 80vh; width: 100%; max-width: 100%; max-height: 90vh;">
    </div>
  </div>
</template>
