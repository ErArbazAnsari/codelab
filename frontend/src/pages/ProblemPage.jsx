import { useState, useEffect, useRef } from "react";
import { useTheme } from "../utils/ThemeContext.jsx";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from "../components/ChatAi";
import Editorial from "../components/Editorial";
import {
    Play,
    Maximize2,
    Minimize2,
    Settings,
    Clock,
    XCircle,
    FileText,
    BookOpen,
    Brain,
    Copy,
    RotateCcw,
    CheckCircle,
} from "lucide-react";

const langMap = {
    cpp: "C++",
    java: "Java",
    javascript: "JavaScript",
};

const ProblemPage = () => {
    const [problem, setProblem] = useState(null);
    const { theme } = useTheme();
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [runResult, setRunResult] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const [activeLeftTab, setActiveLeftTab] = useState("description");
    const [activeRightTab, setActiveRightTab] = useState("code");
    const [customInput, setCustomInput] = useState("");
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [panelSplit, setPanelSplit] = useState(50); // Left panel percentage
    const [isResizing, setIsResizing] = useState(false);
    const editorRef = useRef(null);
    const resizeRef = useRef(null);
    const { problemId } = useParams();

    useEffect(() => {
        const fetchProblem = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get(
                    `/problem/problemById/${problemId}`
                );
                setProblem(response.data);
            } catch (error) {
                console.error("Error fetching problem:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [problemId]);

    // Update code when language changes
    useEffect(() => {
        if (problem && problem.startCode) {
            const initialCode =
                problem.startCode.find(
                    (sc) => sc.language === langMap[selectedLanguage]
                )?.initialCode || "";
            setCode(initialCode);
        }
    }, [selectedLanguage, problem]);

    // Panel resizing functionality
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isResizing) {
                const newSplit = (e.clientX / window.innerWidth) * 100;
                setPanelSplit(Math.min(Math.max(newSplit, 20), 80));
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    const handleEditorChange = (value) => {
        setCode(value || "");
    };

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
    };

    const handleRun = async () => {
        setLoading(true);
        setRunResult(null);

        try {
            const response = await axiosClient.post(
                `/submit/run/${problemId}`,
                {
                    code,
                    language: selectedLanguage,
                    customInput: customInput || undefined,
                }
            );

            setRunResult(response.data);
            setActiveRightTab("testcase");
        } catch (error) {
            console.error("Error running code:", error);
            setRunResult({
                success: false,
                error: "Internal server error",
            });
            setActiveRightTab("testcase");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitCode = async () => {
        setLoading(true);
        setSubmitResult(null);

        try {
            const response = await axiosClient.post(
                `/submit/submit/${problemId}`,
                {
                    code: code,
                    language: selectedLanguage,
                }
            );

            setSubmitResult(response.data);
            setActiveRightTab("result");
        } catch (error) {
            console.error("Error submitting code:", error);
            setSubmitResult({
                accepted: false,
                error: "Submission failed",
            });
            setActiveRightTab("result");
        } finally {
            setLoading(false);
        }
    };

    const getLanguageForMonaco = (lang) => {
        switch (lang) {
            case "javascript":
                return "javascript";
            case "java":
                return "java";
            case "cpp":
                return "cpp";
            default:
                return "javascript";
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case "easy":
                return theme === "dark"
                    ? "text-green-400 bg-green-900/20 border-green-700"
                    : "text-green-600 bg-green-50 border-green-200";
            case "medium":
                return theme === "dark"
                    ? "text-yellow-400 bg-yellow-900/20 border-yellow-700"
                    : "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "hard":
                return theme === "dark"
                    ? "text-red-400 bg-red-900/20 border-red-700"
                    : "text-red-600 bg-red-50 border-red-200";
            default:
                return theme === "dark"
                    ? "text-gray-400 bg-gray-800 border-gray-700"
                    : "text-gray-600 bg-gray-100 border-gray-300";
        }
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    const resetCode = () => {
        if (problem && problem.startCode) {
            const initialCode =
                problem.startCode.find(
                    (sc) => sc.language === langMap[selectedLanguage]
                )?.initialCode || "";
            setCode(initialCode);
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(code);
    };

    if (loading && !problem) {
        return (
            <div
                className={`flex justify-center items-center min-h-screen ${
                    theme === "dark" ? "bg-gray-900" : "bg-gray-50"
                }`}
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <p
                        className={
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }
                    >
                        Loading problem...
                    </p>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div
                className={`flex justify-center items-center min-h-screen ${
                    theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50"
                }`}
            >
                <div className="text-center">
                    <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h2 className="text-2xl font-bold text-red-500 mb-2">
                        Problem not found
                    </h2>
                    <p
                        className={
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }
                    >
                        The requested problem could not be loaded.
                    </p>
                </div>
            </div>
        );
    }

    const leftTabs = [
        {
            key: "description",
            label: "Description",
            icon: <FileText className="w-4 h-4" />,
        },
        {
            key: "editorial",
            label: "Editorial",
            icon: <BookOpen className="w-4 h-4" />,
        },
        {
            key: "solutions",
            label: "Solutions",
            icon: <CheckCircle className="w-4 h-4" />,
        },
        {
            key: "submissions",
            label: "Submissions",
            icon: <Clock className="w-4 h-4" />,
        },
        {
            key: "chatAI",
            label: "AI Help",
            icon: <Brain className="w-4 h-4" />,
        },
    ];

    const rightTabs = [
        { key: "code", label: "Code", icon: <FileText className="w-4 h-4" /> },
        {
            key: "testcase",
            label: "Testcase",
            icon: <Play className="w-4 h-4" />,
        },
        {
            key: "result",
            label: "Result",
            icon: <CheckCircle className="w-4 h-4" />,
        },
    ];

    return (
        <div
            className={`h-screen flex flex-col ${
                theme === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-900"
            } ${isFullScreen ? "fixed inset-0 z-50" : ""}`}
        >
            {/* Header with Problem Info */}
            <div
                className={`flex items-center justify-between px-6 py-4 border-b ${
                    theme === "dark"
                        ? "border-gray-700 bg-gray-800"
                        : "border-gray-200 bg-gray-50"
                }`}
            >
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold">{problem.title}</h1>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                            problem.difficulty
                        )}`}
                    >
                        {problem.difficulty?.charAt(0).toUpperCase() +
                            problem.difficulty?.slice(1)}
                    </span>
                    {problem.tags && (
                        <span
                            className={`px-3 py-1 rounded-full text-sm ${
                                theme === "dark"
                                    ? "bg-blue-900/30 text-blue-300"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                        >
                            {problem.tags}
                        </span>
                    )}
                </div>
                <button
                    onClick={toggleFullScreen}
                    className={`p-2 rounded-lg transition-colors ${
                        theme === "dark"
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-200"
                    }`}
                    title={
                        isFullScreen ? "Exit fullscreen" : "Enter fullscreen"
                    }
                >
                    {isFullScreen ? (
                        <Minimize2 className="w-5 h-5" />
                    ) : (
                        <Maximize2 className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Left Panel */}
                <div
                    className={`flex flex-col border-r ${
                        theme === "dark"
                            ? "border-gray-700 bg-gray-850"
                            : "border-gray-200 bg-white"
                    }`}
                    style={{ width: `${panelSplit}%` }}
                >
                    {/* Left Tabs */}
                    <div
                        className={`flex border-b ${
                            theme === "dark"
                                ? "border-gray-700 bg-gray-800"
                                : "border-gray-200 bg-gray-50"
                        }`}
                    >
                        {leftTabs.map((tab) => (
                            <button
                                key={tab.key}
                                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeLeftTab === tab.key
                                        ? theme === "dark"
                                            ? "border-blue-400 text-blue-400 bg-gray-700"
                                            : "border-blue-500 text-blue-600 bg-white"
                                        : theme === "dark"
                                        ? "border-transparent text-gray-400 hover:text-blue-400 hover:bg-gray-700"
                                        : "border-transparent text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                }`}
                                onClick={() => setActiveLeftTab(tab.key)}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Left Content */}
                    <div className="flex-1 overflow-y-auto">
                        {activeLeftTab === "description" && (
                            <div className="p-6">
                                <div
                                    className={`prose max-w-none ${
                                        theme === "dark" ? "prose-invert" : ""
                                    }`}
                                >
                                    <div className="leading-relaxed whitespace-pre-wrap mb-8">
                                        {problem.description}
                                    </div>
                                </div>

                                {problem.visibleTestCases &&
                                    problem.visibleTestCases.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-lg font-semibold mb-4">
                                                Examples
                                            </h3>
                                            <div className="space-y-4">
                                                {problem.visibleTestCases.map(
                                                    (example, index) => (
                                                        <div
                                                            key={index}
                                                            className={`rounded-lg p-4 border ${
                                                                theme === "dark"
                                                                    ? "bg-gray-800 border-gray-700"
                                                                    : "bg-gray-50 border-gray-200"
                                                            }`}
                                                        >
                                                            <h4 className="font-semibold mb-3">
                                                                Example{" "}
                                                                {index + 1}
                                                            </h4>
                                                            <div className="space-y-3 text-sm">
                                                                <div
                                                                    className={`p-3 rounded border font-mono ${
                                                                        theme ===
                                                                        "dark"
                                                                            ? "bg-gray-900 border-gray-600"
                                                                            : "bg-white border-gray-300"
                                                                    }`}
                                                                >
                                                                    <span className="font-semibold text-blue-500">
                                                                        Input:
                                                                    </span>
                                                                    <pre className="mt-1">
                                                                        {
                                                                            example.input
                                                                        }
                                                                    </pre>
                                                                </div>
                                                                <div
                                                                    className={`p-3 rounded border font-mono ${
                                                                        theme ===
                                                                        "dark"
                                                                            ? "bg-gray-900 border-gray-600"
                                                                            : "bg-white border-gray-300"
                                                                    }`}
                                                                >
                                                                    <span className="font-semibold text-green-500">
                                                                        Output:
                                                                    </span>
                                                                    <pre className="mt-1">
                                                                        {
                                                                            example.output
                                                                        }
                                                                    </pre>
                                                                </div>
                                                                {example.explanation && (
                                                                    <div
                                                                        className={`p-3 rounded border ${
                                                                            theme ===
                                                                            "dark"
                                                                                ? "bg-gray-900 border-gray-600"
                                                                                : "bg-white border-gray-300"
                                                                        }`}
                                                                    >
                                                                        <span className="font-semibold text-yellow-500">
                                                                            Explanation:
                                                                        </span>
                                                                        <p className="mt-1">
                                                                            {
                                                                                example.explanation
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}

                        {activeLeftTab === "editorial" && (
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4">
                                    Editorial
                                </h2>
                                <Editorial
                                    secureUrl={problem.secureUrl}
                                    thumbnailUrl={problem.thumbnailUrl}
                                    duration={problem.duration}
                                />
                            </div>
                        )}

                        {activeLeftTab === "solutions" && (
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4">
                                    Solutions
                                </h2>
                                {problem.referenceSolution &&
                                problem.referenceSolution.length > 0 ? (
                                    <div className="space-y-6">
                                        {problem.referenceSolution.map(
                                            (solution, index) => (
                                                <div
                                                    key={index}
                                                    className={`border rounded-lg overflow-hidden ${
                                                        theme === "dark"
                                                            ? "border-gray-700"
                                                            : "border-gray-200"
                                                    }`}
                                                >
                                                    <div
                                                        className={`px-4 py-3 border-b ${
                                                            theme === "dark"
                                                                ? "bg-gray-800 border-gray-700"
                                                                : "bg-gray-50 border-gray-200"
                                                        }`}
                                                    >
                                                        <h3 className="font-semibold">
                                                            {problem.title} -{" "}
                                                            {solution.language}
                                                        </h3>
                                                    </div>
                                                    <div className="p-4">
                                                        <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
                                                            <code>
                                                                {
                                                                    solution.completeCode
                                                                }
                                                            </code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-4xl mb-4">🔒</div>
                                        <p
                                            className={
                                                theme === "dark"
                                                    ? "text-gray-400"
                                                    : "text-gray-500"
                                            }
                                        >
                                            Solutions will be available after
                                            you solve the problem.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeLeftTab === "submissions" && (
                            <div className="p-6">
                                <SubmissionHistory problemId={problemId} />
                            </div>
                        )}

                        {activeLeftTab === "chatAI" && (
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4">
                                    AI Assistant
                                </h2>
                                <ChatAi problem={problem} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Resize Handle */}
                <div
                    ref={resizeRef}
                    className={`w-1 cursor-col-resize transition-colors ${
                        theme === "dark"
                            ? "bg-gray-700 hover:bg-blue-500"
                            : "bg-gray-300 hover:bg-blue-500"
                    } ${isResizing ? "bg-blue-500" : ""}`}
                    onMouseDown={() => setIsResizing(true)}
                />

                {/* Right Panel */}
                <div
                    className={`flex flex-col ${
                        theme === "dark" ? "bg-gray-850" : "bg-white"
                    }`}
                    style={{ width: `${100 - panelSplit}%` }}
                >
                    {/* Right Tabs */}
                    <div
                        className={`flex border-b ${
                            theme === "dark"
                                ? "border-gray-700 bg-gray-800"
                                : "border-gray-200 bg-gray-50"
                        }`}
                    >
                        {rightTabs.map((tab) => (
                            <button
                                key={tab.key}
                                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeRightTab === tab.key
                                        ? theme === "dark"
                                            ? "border-blue-400 text-blue-400 bg-gray-700"
                                            : "border-blue-500 text-blue-600 bg-white"
                                        : theme === "dark"
                                        ? "border-transparent text-gray-400 hover:text-blue-400 hover:bg-gray-700"
                                        : "border-transparent text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                }`}
                                onClick={() => setActiveRightTab(tab.key)}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 flex flex-col">
                        {activeRightTab === "code" && (
                            <div className="flex-1 flex flex-col">
                                {/* Code Editor Controls */}
                                <div
                                    className={`flex items-center justify-between px-4 py-3 border-b ${
                                        theme === "dark"
                                            ? "border-gray-700 bg-gray-800"
                                            : "border-gray-200 bg-gray-50"
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        {["javascript", "java", "cpp"].map(
                                            (lang) => (
                                                <button
                                                    key={lang}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                        selectedLanguage ===
                                                        lang
                                                            ? theme === "dark"
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-blue-600 text-white"
                                                            : theme === "dark"
                                                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    }`}
                                                    onClick={() =>
                                                        handleLanguageChange(
                                                            lang
                                                        )
                                                    }
                                                >
                                                    {lang === "cpp"
                                                        ? "C++"
                                                        : lang === "javascript"
                                                        ? "JavaScript"
                                                        : "Java"}
                                                </button>
                                            )
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() =>
                                                setFontSize(
                                                    Math.max(10, fontSize - 1)
                                                )
                                            }
                                            className={`p-1.5 rounded transition-colors ${
                                                theme === "dark"
                                                    ? "hover:bg-gray-700"
                                                    : "hover:bg-gray-200"
                                            }`}
                                            title="Decrease font size"
                                        >
                                            <span className="text-sm">A-</span>
                                        </button>
                                        <span className="text-xs px-2">
                                            {fontSize}px
                                        </span>
                                        <button
                                            onClick={() =>
                                                setFontSize(
                                                    Math.min(24, fontSize + 1)
                                                )
                                            }
                                            className={`p-1.5 rounded transition-colors ${
                                                theme === "dark"
                                                    ? "hover:bg-gray-700"
                                                    : "hover:bg-gray-200"
                                            }`}
                                            title="Increase font size"
                                        >
                                            <span className="text-sm">A+</span>
                                        </button>
                                        <button
                                            onClick={resetCode}
                                            className={`p-1.5 rounded transition-colors ${
                                                theme === "dark"
                                                    ? "hover:bg-gray-700"
                                                    : "hover:bg-gray-200"
                                            }`}
                                            title="Reset code"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={copyCode}
                                            className={`p-1.5 rounded transition-colors ${
                                                theme === "dark"
                                                    ? "hover:bg-gray-700"
                                                    : "hover:bg-gray-200"
                                            }`}
                                            title="Copy code"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button
                                            className={`p-1.5 rounded transition-colors ${
                                                theme === "dark"
                                                    ? "hover:bg-gray-700"
                                                    : "hover:bg-gray-200"
                                            }`}
                                            title="Settings"
                                        >
                                            <Settings className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Monaco Editor */}
                                <div className="flex-1">
                                    <Editor
                                        height="100%"
                                        language={getLanguageForMonaco(
                                            selectedLanguage
                                        )}
                                        value={code}
                                        onChange={handleEditorChange}
                                        onMount={handleEditorDidMount}
                                        theme={
                                            theme === "dark"
                                                ? "vs-dark"
                                                : "vs-light"
                                        }
                                        options={{
                                            fontSize: fontSize,
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            tabSize: 2,
                                            insertSpaces: true,
                                            wordWrap: "on",
                                            lineNumbers: "on",
                                            glyphMargin: false,
                                            folding: true,
                                            lineDecorationsWidth: 10,
                                            lineNumbersMinChars: 3,
                                            renderLineHighlight: "line",
                                            selectOnLineNumbers: true,
                                            roundedSelection: false,
                                            readOnly: false,
                                            cursorStyle: "line",
                                            mouseWheelZoom: true,
                                            bracketPairColorization: {
                                                enabled: true,
                                            },
                                            suggest: {
                                                showKeywords: true,
                                                showSnippets: true,
                                            },
                                        }}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div
                                    className={`flex justify-between items-center px-4 py-3 border-t ${
                                        theme === "dark"
                                            ? "border-gray-700 bg-gray-800"
                                            : "border-gray-200 bg-gray-50"
                                    }`}
                                >
                                    <button
                                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                            theme === "dark"
                                                ? "text-gray-300 hover:text-white hover:bg-gray-700"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                                        }`}
                                        onClick={() =>
                                            setActiveRightTab("testcase")
                                        }
                                    >
                                        Console
                                    </button>
                                    <div className="flex space-x-3">
                                        <button
                                            className={`flex items-center space-x-2 px-6 py-2 border rounded-lg text-sm font-medium transition-colors ${
                                                loading &&
                                                activeRightTab !== "result"
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : theme === "dark"
                                                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                            onClick={handleRun}
                                            disabled={loading}
                                        >
                                            {loading &&
                                            activeRightTab !== "result" ? (
                                                <>
                                                    <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full" />
                                                    <span>Running...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4" />
                                                    <span>Run</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                loading &&
                                                activeRightTab === "result"
                                                    ? "opacity-50 cursor-not-allowed bg-green-600"
                                                    : "bg-green-600 hover:bg-green-700"
                                            } text-white`}
                                            onClick={handleSubmitCode}
                                            disabled={loading}
                                        >
                                            {loading &&
                                            activeRightTab === "result" ? (
                                                <>
                                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                                    <span>Submitting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>Submit</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeRightTab === "testcase" && (
                            <div className="flex-1 flex flex-col">
                                <div
                                    className={`p-4 border-b ${
                                        theme === "dark"
                                            ? "border-gray-700"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <h3 className="font-semibold mb-3">
                                        Custom Input
                                    </h3>
                                    <textarea
                                        className={`w-full p-3 border rounded-lg text-sm font-mono resize-none focus:ring-2 focus:ring-blue-500 ${
                                            theme === "dark"
                                                ? "bg-gray-800 border-gray-600 text-white"
                                                : "bg-white border-gray-300 text-gray-900"
                                        }`}
                                        rows="3"
                                        placeholder="Enter custom input here..."
                                        value={customInput}
                                        onChange={(e) =>
                                            setCustomInput(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex-1 p-4 overflow-y-auto">
                                    <h3 className="font-semibold mb-4">
                                        Test Results
                                    </h3>
                                    {runResult ? (
                                        <div
                                            className={`border rounded-lg p-4 ${
                                                runResult.success
                                                    ? theme === "dark"
                                                        ? "border-green-600 bg-green-900/20"
                                                        : "border-green-300 bg-green-50"
                                                    : theme === "dark"
                                                    ? "border-red-600 bg-red-900/20"
                                                    : "border-red-300 bg-red-50"
                                            }`}
                                        >
                                            {runResult.success ? (
                                                <div>
                                                    <div className="flex items-center mb-3">
                                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                                        <h4 className="font-bold text-green-600">
                                                            All test cases
                                                            passed!
                                                        </h4>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                        <div
                                                            className={`p-3 rounded border ${
                                                                theme === "dark"
                                                                    ? "bg-gray-800 border-gray-600"
                                                                    : "bg-white border-gray-200"
                                                            }`}
                                                        >
                                                            <span className="text-gray-500">
                                                                Runtime:
                                                            </span>
                                                            <span className="font-mono ml-2 text-green-600">
                                                                {
                                                                    runResult.runtime
                                                                }{" "}
                                                                sec
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={`p-3 rounded border ${
                                                                theme === "dark"
                                                                    ? "bg-gray-800 border-gray-600"
                                                                    : "bg-white border-gray-200"
                                                            }`}
                                                        >
                                                            <span className="text-gray-500">
                                                                Memory:
                                                            </span>
                                                            <span className="font-mono ml-2 text-green-600">
                                                                {
                                                                    runResult.memory
                                                                }{" "}
                                                                KB
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {runResult.testCases?.map(
                                                            (tc, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`p-3 rounded border ${
                                                                        theme ===
                                                                        "dark"
                                                                            ? "bg-gray-800 border-gray-600"
                                                                            : "bg-white border-gray-200"
                                                                    }`}
                                                                >
                                                                    <div className="text-sm font-mono space-y-2">
                                                                        <div>
                                                                            <span className="font-semibold">
                                                                                Input:
                                                                            </span>{" "}
                                                                            <span className="ml-2">
                                                                                {
                                                                                    tc.stdin
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-semibold">
                                                                                Expected:
                                                                            </span>{" "}
                                                                            <span className="ml-2">
                                                                                {
                                                                                    tc.expected_output
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-semibold">
                                                                                Output:
                                                                            </span>{" "}
                                                                            <span className="ml-2">
                                                                                {
                                                                                    tc.stdout
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                                                            <span className="text-green-600">
                                                                                Passed
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex items-center mb-3">
                                                        <XCircle className="w-5 h-5 text-red-500 mr-2" />
                                                        <h4 className="font-bold text-red-600">
                                                            Test Failed
                                                        </h4>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {runResult.testCases?.map(
                                                            (tc, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`p-3 rounded border ${
                                                                        theme ===
                                                                        "dark"
                                                                            ? "bg-gray-800 border-gray-600"
                                                                            : "bg-white border-gray-200"
                                                                    }`}
                                                                >
                                                                    <div className="text-sm font-mono space-y-2">
                                                                        <div>
                                                                            <span className="font-semibold">
                                                                                Input:
                                                                            </span>{" "}
                                                                            <span className="ml-2">
                                                                                {
                                                                                    tc.stdin
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-semibold">
                                                                                Expected:
                                                                            </span>{" "}
                                                                            <span className="ml-2">
                                                                                {
                                                                                    tc.expected_output
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-semibold">
                                                                                Output:
                                                                            </span>{" "}
                                                                            <span className="ml-2">
                                                                                {
                                                                                    tc.stdout
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            {tc.status_id ===
                                                                            3 ? (
                                                                                <>
                                                                                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                                                                    <span className="text-green-600">
                                                                                        Passed
                                                                                    </span>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <XCircle className="w-4 h-4 text-red-500 mr-1" />
                                                                                    <span className="text-red-600">
                                                                                        Failed
                                                                                    </span>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Play className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                            <p
                                                className={
                                                    theme === "dark"
                                                        ? "text-gray-400"
                                                        : "text-gray-500"
                                                }
                                            >
                                                Click "Run" to test your code
                                                with example test cases
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeRightTab === "result" && (
                            <div className="flex-1 p-4 overflow-y-auto">
                                <h3 className="font-semibold mb-4">
                                    Submission Result
                                </h3>
                                {submitResult ? (
                                    <div
                                        className={`border rounded-lg p-6 ${
                                            submitResult.accepted
                                                ? theme === "dark"
                                                    ? "border-green-600 bg-green-900/20"
                                                    : "border-green-300 bg-green-50"
                                                : theme === "dark"
                                                ? "border-red-600 bg-red-900/20"
                                                : "border-red-300 bg-red-50"
                                        }`}
                                    >
                                        {submitResult.accepted ? (
                                            <div className="text-center">
                                                <div className="text-6xl mb-4">
                                                    🎉
                                                </div>
                                                <h4 className="font-bold text-2xl text-green-600 mb-4">
                                                    Accepted!
                                                </h4>
                                                <div className="grid grid-cols-1 gap-4 text-sm">
                                                    <div
                                                        className={`p-4 rounded border ${
                                                            theme === "dark"
                                                                ? "bg-gray-800 border-gray-600"
                                                                : "bg-white border-gray-200"
                                                        }`}
                                                    >
                                                        <div className="font-semibold mb-2">
                                                            Test Cases
                                                        </div>
                                                        <div className="text-lg font-mono text-green-600">
                                                            {
                                                                submitResult.passedTestCases
                                                            }
                                                            /
                                                            {
                                                                submitResult.totalTestCases
                                                            }{" "}
                                                            passed
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div
                                                            className={`p-4 rounded border ${
                                                                theme === "dark"
                                                                    ? "bg-gray-800 border-gray-600"
                                                                    : "bg-white border-gray-200"
                                                            }`}
                                                        >
                                                            <div className="font-semibold mb-2">
                                                                Runtime
                                                            </div>
                                                            <div className="font-mono text-green-600">
                                                                {
                                                                    submitResult.runtime
                                                                }{" "}
                                                                sec
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`p-4 rounded border ${
                                                                theme === "dark"
                                                                    ? "bg-gray-800 border-gray-600"
                                                                    : "bg-white border-gray-200"
                                                            }`}
                                                        >
                                                            <div className="font-semibold mb-2">
                                                                Memory
                                                            </div>
                                                            <div className="font-mono text-green-600">
                                                                {
                                                                    submitResult.memory
                                                                }{" "}
                                                                KB
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="text-6xl mb-4">
                                                    ❌
                                                </div>
                                                <h4 className="font-bold text-2xl text-red-600 mb-4">
                                                    {submitResult.error ||
                                                        "Wrong Answer"}
                                                </h4>
                                                <div
                                                    className={`p-4 rounded border ${
                                                        theme === "dark"
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-200"
                                                    }`}
                                                >
                                                    <div className="font-semibold mb-2">
                                                        Test Cases
                                                    </div>
                                                    <div className="text-lg font-mono text-red-600">
                                                        {
                                                            submitResult.passedTestCases
                                                        }
                                                        /
                                                        {
                                                            submitResult.totalTestCases
                                                        }{" "}
                                                        passed
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <p
                                            className={
                                                theme === "dark"
                                                    ? "text-gray-400"
                                                    : "text-gray-500"
                                            }
                                        >
                                            Click "Submit" to submit your
                                            solution for evaluation
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;
