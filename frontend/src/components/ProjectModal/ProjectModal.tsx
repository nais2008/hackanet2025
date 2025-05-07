import React, { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import "./ProjectModal.scss";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  image?: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project, file?: File) => void;
  project?: Project | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  project,
}) => {
  const [name, setName] = useState(project?.name || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(project?.image || null);
  const [errors, setErrors] = useState<{ name?: string; file?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setPreview(project.image || null);
    } else {
      setName("");
      setFile(null);
      setPreview(null);
    }
    setErrors({});
  }, [project]);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      setErrors({ file: "Файл должен быть изображением (например, PNG, JPEG)" });
      return;
    }
    const previewUrl = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreview(previewUrl);
    setErrors({});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    const newErrors: { name?: string; file?: string } = {};
    if (!name) {
      newErrors.name = "Название проекта обязательно";
    } else if (name.length < 3 || name.length > 50) {
      newErrors.name = "Название должно быть от 3 до 50 символов";
    } else if (!/^[a-zA-Zа-яА-Я0-9\s\-_.]+$/.test(name)) {
      newErrors.name = "Разрешены только буквы, цифры, пробелы и символы -_.";
    }

    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (!file.type.startsWith("image/")) {
        newErrors.file = "Файл должен быть изображением";
      } else if (file.size > maxSize) {
        newErrors.file = "Размер файла не должен превышать 5 МБ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newProject: Project = {
      id: project?.id || Date.now().toString(),
      name,
      createdAt: project?.createdAt || new Date().toISOString(),
      image: preview || undefined,
    };
    onSave(newProject, file || undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className="modal-close" onClick={onClose}>
              <FaTimes />
            </button>
            <h2>{project ? "Редактировать проект" : "Создать проект"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Название проекта</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div
                className="form-group drop-zone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <label htmlFor="image">Изображение проекта</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                {preview ? (
                  <div className="image-container">
                    <img src={preview} alt="Preview" className="image-preview" />
                    <button
                      type="button"
                      className="remove-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <p>Перетащите изображение сюда или кликните для выбора</p>
                )}
                {errors.file && <span className="error">{errors.file}</span>}
              </div>

              <button type="submit" className="btn">
                {project ? "Сохранить изменения" : "Создать"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
