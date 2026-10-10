'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  FiEye, FiEyeOff, FiX, FiChevronDown, FiRefreshCw, FiCloudLightning, FiGithub, FiExternalLink, FiGrid, FiCode
} from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from '../Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import CoreIdentitySection from './CoreIdentitySection';
import NetworkAccessSection from './NetworkAccessSection';
import VisualAssetsSection from './VisualAssetsSection';
import MissionDossierSection from './MissionDossierSection';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';

export default function EditProjectFormModal({
  editingProject,
  setEditingProject,
  categories,
  setIsAddingCategory,
  isAddingCategory,
  onUpdateProject,
  onRequestClose,
  modalRef
}) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const isOpen = !!editingProject;
  useEffect(() => {
    if (isOpen && modalRef?.current) {
      modalRef.current.focus();
    }
  }, [isOpen, modalRef]);

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setEditingProject(prev => ({ ...prev, image: url, img: url }));
        successToast('Image uploaded successfully');
      } else {
        errorToast('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      errorToast('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [successToast, errorToast, setEditingProject]);

  const isNew = !editingProject?.id;

  const handleSubmit = useCallback(async () => {
    if (!editingProject) return;
    if (!editingProject.title?.trim()) {
      errorToast('Project title is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...editingProject,
        details: editingProject.details || []
      };
      const res = await fetch('/api/admin/projects', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingProject(null);
        setIsAddingCategory(false);
        await onUpdateProject();
        successToast(isNew
          ? `Project "${editingProject.title}" created successfully`
          : `Project "${editingProject.title}" updated successfully`);
      } else {
        errorToast(isNew ? 'Failed to create project' : 'Failed to update project');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      errorToast('Failed to synchronize project changes');
    } finally {
      setSaving(false);
    }
  }, [editingProject, isNew, onUpdateProject, successToast, errorToast, setEditingProject, setIsAddingCategory]);

  if (!editingProject) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
      <div className="modal-backdrop fixed inset-0 backdrop-blur-md animate-fade-in" onClick={onRequestClose} />
      <div
        ref={modalRef}
        tabIndex="-1"
        className="w-full max-w-3xl relative z-10 flex flex-col animate-slide-up matrix-modal rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]"
        style={{ maxHeight: 'calc(100vh - 48px)' }}
      >
        <ModalHeader
          isNew={isNew}
          onClose={onRequestClose}
          modalRef={modalRef}
          isAddingCategory={isAddingCategory}
          setIsAddingCategory={setIsAddingCategory}
        />

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
          <CoreIdentitySection
            editingProject={editingProject}
            setEditingProject={setEditingProject}
            categories={categories}
            isAddingCategory={isAddingCategory}
            setIsAddingCategory={setIsAddingCategory}
          />

          <NetworkAccessSection
            editingProject={editingProject}
            setEditingProject={setEditingProject}
          />

          <VisualAssetsSection
            editingProject={editingProject}
            setEditingProject={setEditingProject}
          />

          <MissionDossierSection
            editingProject={editingProject}
            setEditingProject={setEditingProject}
          />
        </div>

        <ModalFooter
          isNew={!editingProject?.id}
          saving={saving}
          uploading={uploading}
          onSubmit={handleSubmit}
          onClose={onRequestClose}
        />
      </div>
    </div>
  );
}
