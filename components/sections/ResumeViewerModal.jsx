"use client";

import { Modal } from "@/components/ui/Modal";
import { useEffect, useRef, useState } from "react";

function PdfPage({ pdf, pageNumber, width, onRendered }) {
  const canvasRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!pdf || !width || !canvasRef.current) return;

    let renderTask;
    let cancelled = false;
    setIsRendered(false);

    async function renderPage() {
      const page = await pdf.getPage(pageNumber);
      if (cancelled) return;

      const baseViewport = page.getViewport({ scale: 1 });
      const cssScale = width / baseViewport.width;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({ scale: cssScale * pixelRatio });
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width / pixelRatio)}px`;
      canvas.style.height = `${Math.floor(viewport.height / pixelRatio)}px`;

      renderTask = page.render({ canvasContext: context, viewport });
      await renderTask.promise;
      if (!cancelled) {
        setIsRendered(true);
        onRendered?.(pageNumber);
      }
    }

    renderPage().catch((error) => {
      if (error?.name !== "RenderingCancelledException") {
        console.error(`Failed to render resume page ${pageNumber}:`, error);
      }
    });

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [onRendered, pdf, pageNumber, width]);

  return (
    <div
      className="relative max-w-full overflow-hidden rounded-lg bg-neutral-700 shadow-lg"
      style={{ width, aspectRatio: "8.5 / 11" }}
    >
      {!isRendered && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-neutral-700 text-sm text-white/75">
          Rendering page {pageNumber}…
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`block max-w-full bg-white transition-opacity duration-200 ${isRendered ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

function ResumePdfViewer({ url }) {
  const containerRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [width, setWidth] = useState(0);
  const [error, setError] = useState("");
  const [firstPageReady, setFirstPageReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => setWidth(Math.max(280, container.clientWidth - 4));
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let loadingTask;
    let disposed = false;

    async function loadPdf() {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();
        loadingTask = pdfjs.getDocument({ url });
        const document = await loadingTask.promise;
        if (!disposed) setPdf(document);
      } catch (loadError) {
        if (!disposed) {
          console.error("Failed to load resume PDF:", loadError);
          setError("The resume preview could not be rendered.");
        }
      }
    }

    loadPdf();
    return () => {
      disposed = true;
      loadingTask?.destroy();
    };
  }, [url]);

  return (
    <div ref={containerRef} className="relative h-[70vh] min-h-[500px] overflow-auto rounded-xl bg-neutral-800 p-3 sm:p-5">
      {!pdf && !error && (
        <div className="grid min-h-full place-items-center text-sm text-white/70">Loading resume…</div>
      )}
      {pdf && !firstPageReady && !error && (
        <div
          className="absolute inset-0 z-20 grid place-items-center text-sm"
          style={{ background: "#262626", color: "rgba(255,255,255,.78)" }}
          role="status"
        >
          Rendering resume…
        </div>
      )}
      {error && (
        <div className="grid min-h-full place-items-center gap-4 text-center text-white/80">
          <p>{error}</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="button">Open resume</a>
        </div>
      )}
      {pdf && width > 0 && (
        <div className="flex flex-col items-center gap-4">
          {Array.from({ length: pdf.numPages }, (_, index) => (
            <PdfPage
              key={index + 1}
              pdf={pdf}
              pageNumber={index + 1}
              width={width}
              onRendered={(page) => {
                if (page === 1) setFirstPageReady(true);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ResumeViewerModal({ isOpen, onClose, resumeUrl, title = "View Resume", triggerRef }) {
  // Use our proxy endpoint that sets proper headers for iframe embedding
  const viewUrl = resumeUrl ? "/api/resume/view" : null;
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title} 
      className="max-w-5xl"
      triggerRef={triggerRef}
    >
      {viewUrl ? (
        <ResumePdfViewer url={viewUrl} />
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">Resume not available</p>
        </div>
      )}
    </Modal>
  );
}
