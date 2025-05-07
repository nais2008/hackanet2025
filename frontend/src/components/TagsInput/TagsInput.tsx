import React, { useState, KeyboardEvent } from "react";
import "./TagsInput.scss";

interface TagsInputProps {
  selector: string;
  max?: number;
  duplicate?: boolean;
  initialTags?: string[];
}

const TagsInput: React.FC<TagsInputProps> = ({
  selector,
  max = null,
  duplicate = false,
  initialTags = [],
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);

  // Проверка на ошибки
  const anyErrors = (string: string): boolean => {
    if (max !== null && tags.length >= max) {
      console.log("max tags limit reached");
      return true;
    }
    if (!duplicate && tags.includes(string)) {
      console.log(`duplicate found "${string}"`);
      return true;
    }
    return false;
  };

  // Добавить тег
  const addTag = (string: string): void => {
    if (anyErrors(string)) return;

    setTags((prevTags) => [...prevTags, string]);
  };

  // Удалить тег
  const deleteTag = (index: number): void => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  // Обработчик клавиш
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    const str = e.currentTarget.value.trim();

    if ([9, 13, 188].includes(e.keyCode)) {
      e.preventDefault();
      e.currentTarget.value = "";
      if (str !== "") addTag(str);
    }
  };

  return (
    <div className="tags-input-wrapper">
      <div className="tags-list">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <a
              href="#"
              className="delete-tag"
              onClick={(e) => {
                e.preventDefault();
                deleteTag(index);
              }}
            >
              &times;
            </a>
          </span>
        ))}
      </div>
      <input
        id={selector}
        type="text"
        className="tags-input"
        onKeyDown={handleKeyDown}
        placeholder="Add a tag"
      />
    </div>
  );
};

export default TagsInput;
