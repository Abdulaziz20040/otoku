"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Quote,
  Palette,
  Table,
  Type,
  Heading,
} from "lucide-react";
import "../../../app/globals.css";

const CustomEditor = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTitle(localStorage.getItem("postTitle") || "");
      setContent(
        localStorage.getItem("editorContent") || "Ma'lumot kiriting..."
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("postTitle", title);
  }, [title]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  const [content, setContent] = useState(
    () => localStorage.getItem("editorContent") || "Ma'lumot kiriting..."
  );

  useEffect(() => {
    localStorage.setItem("editorContent", content);
  }, [content]);

  const clearEditor = () => {
    setContent("Ma'lumot kiriting...");
    localStorage.removeItem("editorContent");
  };

  const handleMenuClick = (e) => {
    e.stopPropagation(); // Menyu ichidagi bosishlarni bloklash
    setShowMenu((prev) => !prev);

    // Agar menyu ochilsa va hali hech nima yozilmagan bo'lsa, placeholderni olib tashlaymiz
    if (!content || content === "Ma'lumot kiriting...") {
      editorRef.current.innerText = "";
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenu(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const formatText = (command, value = null) => {
    if (editorRef.current) {
      document.execCommand(command, false, value);
      editorRef.current.focus();
      setContent(editorRef.current.innerHTML);

      // Qo‘shilgan elementlarga 10px pastki bo‘sh joy berish
      setTimeout(() => {
        if (editorRef.current) {
          const elements = editorRef.current.querySelectorAll(
            "p, blockquote, h1, h2, h3, h4, h5, h6, img, table"
          );
          elements.forEach((el) => {
            el.style.marginBottom = "10px";
          });
        }
      }, 100);
    }
    setShowMenu(false);
    setShowHeadingMenu(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgElement = document.createElement("img");
        imgElement.src = event.target.result;
        imgElement.className = "h-auto max-w-full mt-2";
        imgElement.alt = "Uploaded";
        imgElement.style.paddingBottom = "10px"; // Qo‘shildi

        if (editorRef.current) {
          editorRef.current.appendChild(imgElement);

          // **10px bo'sh joy qo'shish**
          const spaceElement = document.createElement("p");
          spaceElement.innerHTML = "<br />";
          spaceElement.style.marginBottom = "10px";
          editorRef.current.appendChild(spaceElement);

          setContent(editorRef.current.innerHTML);

          // **Kursorni bo‘sh joyga o‘tkazish**
          const range = document.createRange();
          const selection = window.getSelection();
          range.setStartAfter(spaceElement);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      };

      reader.readAsDataURL(file);

      // **Menyularni yopish**
      setShowMenu(false);
      setShowHeadingMenu(false);
    }
  };

  const handleFocus = () => {
    if (!editorRef.current) return;

    if (editorRef.current.innerText === "Ma'lumot kiriting...") {
      editorRef.current.innerText = "";
    }
    editorRef.current.style.borderRadius = "8px";
  };

  const handleBlur = () => {
    if (!editorRef.current.innerText.trim()) {
      editorRef.current.innerText = "Ma'lumot kiriting...";
    }
    editorRef.current.style.backgroundColor = "transparent"; // Fokus yo‘qolganda fonni qayta shaffof qilish
  };

  const handleInput = (e) => {
    setContent(e.currentTarget.innerHTML); // Faqat matnni olish
  };
  useEffect(() => {
    localStorage.setItem("postTitle", title);
  }, [title]);

  return (
    <div className="relative w-full">
      <div className="relative inline-block w-full">
        <textarea
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sarlavha kiriting"
          className="w-full p-2 mt-4 text-2xl font-semibold rounded outline-none"
        />

        <div className="relative flex items-center w-full gap-2">
          <button
            className="absolute p-2 text-white bg-blue-600 rounded-full shadow-md -left-13 bottom-[12px]"
            onClick={handleMenuClick}
          >
            <Plus size={20} />
          </button>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning={true}
            className="w-full min-h-[50px] border-none p-3  -ms-[10px]  focus:outline-none text-lg font-sans overflow-y-auto"
            onInput={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            Ma'lumot kiriting...
          </div>
        </div>

        {showMenu && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 w-48 bg-white rounded-md shadow-lg top-40"
          >
            <div className="grid grid-cols-1 gap-2 p-2 overflow-y-auto max-h-60">
              <button onClick={() => formatText("bold")} className="menu-btn">
                <Bold size={16} /> Qalin
              </button>
              <button onClick={() => formatText("italic")} className="menu-btn">
                <Italic size={16} /> Egik
              </button>
              <button
                onClick={() => formatText("underline")}
                className="menu-btn"
              >
                <Underline size={16} /> Tag chiz
              </button>
              <button
                onClick={() => formatText("strikeThrough")}
                className="menu-btn"
              >
                <Strikethrough size={16} /> O‘chirilgan
              </button>
              <button
                onClick={() => formatText("justifyLeft")}
                className="menu-btn"
              >
                <AlignLeft size={16} /> Chapga
              </button>
              <button
                onClick={() => formatText("justifyCenter")}
                className="menu-btn"
              >
                <AlignCenter size={16} /> Markazga
              </button>
              <button
                onClick={() => formatText("justifyRight")}
                className="menu-btn"
              >
                <AlignRight size={16} /> O‘ngga
              </button>
              <button
                onClick={() => formatText("formatBlock", "blockquote")}
                className="menu-btn"
              >
                <Quote size={16} /> Iqtibos
              </button>
              <button
                onClick={() => setShowHeadingMenu(!showHeadingMenu)}
                className="menu-btn"
              >
                <Heading size={16} /> Sarlavha
              </button>
              {showHeadingMenu && (
                <div className="absolute z-10 flex flex-col w-auto gap-2 p-2 bg-white rounded-md shadow-lg top-1 left-full">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => formatText("formatBlock", `h${i + 1}`)}
                      className="menu-btn"
                    >
                      H{i + 1}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => {
                  const url = prompt("URL kiriting");
                  if (url) formatText("createLink", url);
                }}
                className="menu-btn"
              >
                <Link size={16} /> Link
              </button>
              <label className="relative cursor-pointer menu-btn">
                <Palette size={16} /> Rang
                <input
                  type="color"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => formatText("foreColor", e.target.value)}
                />
              </label>
              <label className="cursor-pointer menu-btn">
                <Image size={16} /> Rasm
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              <button
                onClick={() =>
                  formatText(
                    "insertHTML",
                    "<table border='1' style='width:100%; text-align:center;'><tr><th>#</th><th>Header 1</th><th>Header 2</th></tr><tr><td>1.</td><td>Cell 1</td><td>Cell 2</td></tr><tr><td>2.</td><td>Cell 3</td><td>Cell 4</td></tr></table>"
                  )
                }
                className="menu-btn"
              >
                <Table size={16} /> Jadval
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 ">
        <button
          className=" w-[100px] py-2 font-semibold cursor-pointer text-white transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Ko'rish
        </button>
        <button
          className=" w-[100px] py-2 font-semibold cursor-pointer text-white transition bg-red-500 rounded-lg shadow-md  hover:bg-red-600"
          onClick={clearEditor}
        >
          🗑 Tozalash
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-w-full">
            <div className="flex items-center gap-3 pb-2">
              <img
                src="https://i.pinimg.com/736x/94/d3/6c/94d36cae8d555228de937e309d66f254.jpg"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">John Doe</h3>
                <p className="text-sm text-gray-500">3 soat oldin</p>
              </div>
            </div>
            <h2 className="text-xl font-bold">{title}</h2>
            <div
              className="mt-2 text-gray-700"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <button
              className="px-4 py-2 mt-4 text-white bg-red-500 rounded"
              onClick={() => setShowModal(false)}
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomEditor;
