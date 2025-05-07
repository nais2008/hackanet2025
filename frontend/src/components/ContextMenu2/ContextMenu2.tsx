import React, { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import "./ContextMenu2.scss";

interface MenuItem {
  icon: IconType;
  text: string;
  href: string;
}

interface ContextMenu2Props {
  items: MenuItem[];
}

const ContextMenu2: React.FC<ContextMenu2Props> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight || 150;
      const menuWidth = menuRef.current?.offsetWidth || 200;

      let top = rect.bottom + 6 + window.scrollY;
      let left = rect.left + window.scrollX;

      // Корректировка по вертикали (если не влезает вниз)
      if (top + menuHeight > window.innerHeight + window.scrollY) {
        top = rect.top - menuHeight - 6 + window.scrollY;
      }

      // Корректировка по горизонтали (если не влезает вправо)
      if (left + menuWidth > window.innerWidth + window.scrollX) {
        left = window.innerWidth - menuWidth - 8 + window.scrollX;
      }

      setPosition({ top, left });
    }

    setIsOpen(!isOpen);
  };

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <button ref={buttonRef} onClick={handleToggle} className="context-btn">
        &#x22EE;
      </button>
      {isOpen && (
        <div
          ref={menuRef}
          className="context-menu2-dropdown"
          style={{ top: position.top, left: position.left, position: "absolute" }}
        >
          {items.map(({ icon: Icon, text, href }, i) => (
            <a key={i} href={href} className="context-menu2-item">
              <Icon className="icon" />
              {text}
            </a>
          ))}
        </div>
      )}
    </>
  );
};

export default ContextMenu2;
