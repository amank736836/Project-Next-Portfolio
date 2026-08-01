"use client";

import { Modal } from "@/components/ui/Modal";

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
        <div className="relative w-full h-[70vh] min-h-[500px]">
          <iframe
            src={viewUrl}
            className="w-full h-full border-0 rounded-lg"
            title="Resume Preview"
          />
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">Resume not available</p>
        </div>
      )}
    </Modal>
  );
}