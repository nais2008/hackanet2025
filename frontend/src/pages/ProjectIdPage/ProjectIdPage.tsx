import { useState, useRef } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ContextMenu2 from "../../components/ContextMenu2";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import "./ProjectIdPage.scss";

interface Task {
  id: string;
  title: string;
  description?: string;
  image?: string;
}

interface Stage {
  id: string;
  title: string;
  tasks: Task[];
}

const initialStages: Stage[] = [
  {
    id: "in-progress",
    title: "В процессе",
    tasks: [
      { id: "task-1", title: "Таска", description: "Описание" },
      { id: "task-2", title: "Таска" },
      { id: "task-3", title: "Таска", description: "Описание" },
      { id: "task-4", title: "Таска" },
    ],
  },
  {
    id: "done",
    title: "Сделано",
    tasks: [],
  },
];

const TaskCard = ({ task, listeners, attributes, setNodeRef, transform, transition }: any) => {
  const [menuItems] = useState([
    { icon: FaEdit, text: "Редактировать", href: "#" },
    { icon: FaTrash, text: "Удалить", href: "#" },
  ]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="task-card" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div className="task-title">{task.title}</div>
      {task.description && <div className="task-desc">{task.description}</div>}
      {task.image && <img src={task.image} alt="Task" className="task-image" />}
      <div className="task-actions">
        <ContextMenu2 items={menuItems} />
      </div>
    </div>
  );
};

const StageColumn = ({ stage, tasks, setStages }: any) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskTags, setNewTaskTags] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ file?: string }>({});
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setNodeRef } = useSortable({ id: stage.id });

  const handleAddTask = () => {
    setShowTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskTags("");
    setNewTaskDeadline("");
    setNewTaskStatus("");
    setNewTaskPriority("");
    setPreview(null);
    setFile(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: newTaskTitle,
        description: newTaskDescription || undefined,
        image: preview || undefined,
      };
      setStages((prevStages: Stage[]) =>
        prevStages.map((s) => (s.id === stage.id ? { ...s, tasks: [...s.tasks, newTask] } : s))
      );
      handleCloseTaskModal();
    }
  };

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
    e.stopPropagation();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="stage-column" ref={setNodeRef}>
      <div className="stage-header">
        <b>{stage.title}</b>
        <button className="stage-add" onClick={handleAddTask}>+</button>
      </div>
      <SortableContext items={tasks.map((t: Task) => t.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task: Task) => (
          <SortableTaskCard key={task.id} task={task} />
        ))}
      </SortableContext>
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Новая задача</h2>
            <button className="modal-close" onClick={handleCloseTaskModal}>
              ×
            </button>
            <div className="form-group">
              <label>Название</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Введите название"
              />
            </div>
            <div className="form-group">
              <label>Описание</label>
              <input
                type="text"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Введите описание"
              />
            </div>
            <div className="form-group">
              <label>Теги</label>
              <input
                type="text"
                value={newTaskTags}
                onChange={(e) => setNewTaskTags(e.target.value)}
                placeholder="Введите теги"
              />
            </div>
            <div className="form-group">
              <label>Дедлайн</label>
              <input
                type="text"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                placeholder="Введите дедлайн"
              />
            </div>
            <div className="form-group">
              <label>Статус</label>
              <input
                type="text"
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value)}
                placeholder="Введите статус"
              />
            </div>
            <div className="form-group">
              <label>Приоритет</label>
              <input
                type="text"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                placeholder="Введите приоритет"
              />
            </div>
            <div className="form-group">
              <label>Изображение</label>
              <div
                className="drop-zone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
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
                      ×
                    </button>
                  </div>
                ) : (
                  <p>Перетащите изображение сюда или кликните для выбора</p>
                )}
                {errors.file && <span className="error">{errors.file}</span>}
              </div>
            </div>
            <div className="form-group modal-actions">
              <button className="btn" onClick={handleCloseTaskModal}>Отмена</button>
              <button className="btn" onClick={handleSaveTask}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SortableTaskCard = ({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  return (
    <TaskCard
      task={task}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      transform={transform}
      transition={transition}
    />
  );
};

const ProjectIdPage = () => {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [showStageModal, setShowStageModal] = useState(false);
  const [newStageTitle, setNewStageTitle] = useState("");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id.toString();
    const overId = over.id.toString();

    const sourceStage = stages.find((stage) =>
      stage.tasks.some((task) => task.id === activeTaskId)
    );
    if (!sourceStage) return;

    const targetStage = stages.find((stage) => stage.id === overId || stage.tasks.some((task) => task.id === overId));
    if (!targetStage) return;

    const movedTask = sourceStage.tasks.find((task) => task.id === activeTaskId);
    if (!movedTask) return;

    const newSourceTasks = sourceStage.tasks.filter((task) => task.id !== activeTaskId);

    if (sourceStage.id === targetStage.id) {
      const overTaskId = overId;
      const oldIndex = sourceStage.tasks.findIndex((task) => task.id === activeTaskId);
      const newIndex = targetStage.tasks.findIndex((task) => task.id === overTaskId);
      const updatedTasks = arrayMove(sourceStage.tasks, oldIndex, newIndex);
      setStages((prevStages) =>
        prevStages.map((stage) =>
          stage.id === sourceStage.id ? { ...stage, tasks: updatedTasks } : stage
        )
      );
    } else {
      let newTargetTasks = [...targetStage.tasks];
      const overTaskIndex = targetStage.tasks.findIndex((task) => task.id === overId);
      if (overTaskIndex >= 0) {
        newTargetTasks.splice(overTaskIndex, 0, movedTask);
      } else {
        newTargetTasks.push(movedTask);
      }

      setStages((prevStages) =>
        prevStages.map((stage) => {
          if (stage.id === sourceStage.id) return { ...stage, tasks: newSourceTasks };
          if (stage.id === targetStage.id) return { ...stage, tasks: newTargetTasks };
          return stage;
        })
      );
    }
  };

  const handleAddStage = () => {
    setShowStageModal(true);
  };

  const handleCloseStageModal = () => {
    setShowStageModal(false);
    setNewStageTitle("");
  };

  const handleSaveStage = () => {
    if (newStageTitle.trim()) {
      const newStage = { id: `stage-${Date.now()}`, title: newStageTitle, tasks: [] };
      setStages((prevStages) => [...prevStages, newStage]);
      handleCloseStageModal();
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="project-board">
        {stages.map((stage) => (
          <StageColumn key={stage.id} stage={stage} tasks={stage.tasks} setStages={setStages} />
        ))}
        <button className="new-stage-button" onClick={handleAddStage}>Новая группа +</button>
      </div>
      {showStageModal && (
        <div className="modal-overlay">
          <form className="modal-content">
            <h2>Новый этап</h2>
            <button className="modal-close" onClick={handleCloseStageModal}>
              ×
            </button>
            <div className="form-group">
              <label>Название этапа</label>
              <input
                type="text"
                value={newStageTitle}
                onChange={(e) => setNewStageTitle(e.target.value)}
                placeholder="Введите название этапа"
              />
            </div>
            <div className="form-group modal-actions">
              <button className="btn" onClick={handleCloseStageModal}>Отмена</button>
              <button className="btn" onClick={handleSaveStage}>Сохранить</button>
            </div>
          </form>
        </div>
      )}
    </DndContext>
  );
};

export default ProjectIdPage;
