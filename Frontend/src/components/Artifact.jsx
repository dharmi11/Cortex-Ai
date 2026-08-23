import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Code2,
  Copy,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  Check,
} from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Artifact = () => {
  // ==========================================================
  // STATE
  // ==========================================================
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  const [panelWidth, setPanelWidth] = useState(350);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(350);
  // ==========================================================
  // REDUX
  // ==========================================================
  const { artifacts } = useSelector((state) => state.message);

  // ==========================================================
  // ACTIVE FILE
  // ==========================================================
  const activeFileData = artifacts?.files?.[activeFile];
  const fileName = activeFileData?.name || "";
  const fileContent = activeFileData?.content || "";

  // ==========================================================
  // LANGUAGE DETECTION
  // ==========================================================
  const getLanguage = (name = "") => {
    const file = name.toLowerCase();

    // Web
    if (file.endsWith(".html")) return "markup";
    if (file.endsWith(".css")) return "css";
    if (file.endsWith(".js")) return "javascript";
    if (file.endsWith(".jsx")) return "jsx";
    if (file.endsWith(".ts")) return "typescript";
    if (file.endsWith(".tsx")) return "tsx";

    // C / C++
    if (file.endsWith(".cpp") || file.endsWith(".cc") || file.endsWith(".cxx")) return "cpp";
    if (file.endsWith(".c")) return "c";

    // Python
    if (file.endsWith(".py")) return "python";

    // Java
    if (file.endsWith(".java")) return "java";

    // JSON
    if (file.endsWith(".json")) return "json";

    // SQL
    if (file.endsWith(".sql")) return "sql";

    // Bash
    if (file.endsWith(".sh") || file.endsWith(".bash")) return "bash";

    return "text";
  };

  // ==========================================================
  // COPY
  // ==========================================================
  const handleCopy = async () => {
    if (!fileContent) return;

    try {
      await navigator.clipboard.writeText(fileContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };


  // ==========================================================
  // LIVE PREVIEW
  // ==========================================================
  const preview = useMemo(() => {
    if (!artifacts?.files) return "";

    const htmlFile = artifacts.files.find((file) => file.name?.toLowerCase() === "index.html");
    const cssFile = artifacts.files.find((file) => file.name?.toLowerCase() === "style.css");
    const jsFile = artifacts.files.find((file) => file.name?.toLowerCase() === "script.js");

    const html = htmlFile?.content || "";
    const css = cssFile?.content || "";
    const js = jsFile?.content || "";

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
${css}
</style>
</head>
<body>
${html}
<script>
${js}
<\/script>
</body>
</html>
`;
  }, [artifacts]);




  // ==========================================================
  // RESIZE ARTIFACT PANEL
  // ==========================================================
  const handleResizeStart = (e) => {
    if (collapsed) return;

    e.preventDefault();

    setIsResizing(true);

    resizeStartX.current = e.clientX;
    resizeStartWidth.current = panelWidth;
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      // Mouse left wal move karega -> panel width vadhegi
      const diff = resizeStartX.current - e.clientX;

      const newWidth = Math.min(
        800,
        Math.max(350, resizeStartWidth.current + diff)
      );

      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  if (!artifacts) {
    return null;
  }
  // ==========================================================
  // RENDER
  // ==========================================================
  return (
    <motion.div
      animate={{ width: collapsed ? 60 : panelWidth }}
      transition={{
        duration: isResizing ? 0 : 0.3,
        ease: "easeInOut",
      }}
      className="hidden lg:flex h-full border-l border-white/[0.06] flex-col overflow-hidden shrink-0 bg-[#0d0f14] relative"
    >
      {!collapsed && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize z-50 hover:bg-indigo-500/50 transition-colors"
        />
      )}
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="h-14 px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0">
        {/* COLLAPSE BUTTON */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="relative z-30 flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors cursor-pointer shrink-0"
        >
          {collapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
        </button>

        {/* HEADER CONTENT */}
        {!collapsed && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Code2 className="text-indigo-500 shrink-0" size={16} />

            {/* TITLE */}
            <span className="text-sm text-slate-300 font-bold truncate tracking-wider whitespace-nowrap flex-1">
              {artifacts?.title}
            </span>

            {/* COPY */}
            <button
              onClick={handleCopy}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors shrink-0 cursor-pointer"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>

            {/* CODE / PREVIEW */}
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg shrink-0">
              {/* CODE */}
              <button
                onClick={() => setTab("code")}
                className={`flex items-center gap-1 px-2 py-2 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${tab === "code" ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-slate-300"
                  }`}
              >
                <Code2 size={13} />
                Code
              </button>

              {/* PREVIEW */}
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1 px-2 py-2 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${tab === "preview" ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-slate-300"
                  }`}
              >
                <Eye size={13} />
                Preview
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          COLLAPSED TITLE
      ===================================================== */}
      {collapsed && (
        <div className="absolute inset-y-0 right-0 w-[60px] flex items-center justify-center pointer-events-none">
          <span
            className="text-sm text-slate-400 font-bold tracking-wider whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {artifacts?.title}
          </span>
        </div>
      )}

      {/* =====================================================
          OPEN PANEL
      ===================================================== */}

      {!collapsed && (
        <>
          {/* FILE TABS - ONLY IN CODE MODE */}
          {tab === "code" && (
            <div className="flex border-b border-white/[0.06] overflow-x-auto shrink-0 scrollbar-thin scrollbar-thumb-white/10">
              {artifacts?.files?.map((file, index) => (
                <button
                  key={file.name || index}
                  onClick={() => setActiveFile(index)}
                  className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors border-r border-white/[0.05] relative cursor-pointer shrink-0 ${activeFile === index
                    ? "bg-teal-600/20 text-indigo-400"
                    : "bg-transparent text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"
                    }`}
                >
                  {file?.name}

                  {activeFile === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* MAIN AREA */}
          <div className="flex-1 min-h-0 overflow-hidden relative">

            {/* CODE */}
            {tab === "code" && (
              <div className="h-full w-full overflow-auto bg-[#0d0f14]">
             
               <SyntaxHighlighter
                  language={getLanguage(fileName)}
                  style={oneDark}
                  showLineNumbers
                  wrapLongLines={false}
                  customStyle={{
                    margin: 0,
                    minHeight: "100%",
                    width: "100%",
                    background: "#0d0f14",
                    fontSize: "12px",
                    lineHeight: "1.6",
                    padding: "16px 12px",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    },
                  }}
                >
                  {fileContent || "// No code available"}
                </SyntaxHighlighter>
              </div>
            )}

            {/* PREVIEW */}
            {tab === "preview" && (
              <iframe
                title="Live Preview"
                srcDoc={preview}
                className="w-full h-full border-0 bg-white block"
                sandbox="allow-scripts allow-forms allow-modals"
              />
            )}

          </div>
        </>
      )}
    </motion.div>
  );
};

export default Artifact;