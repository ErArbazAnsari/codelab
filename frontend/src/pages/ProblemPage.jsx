import { useState, useEffect, useRef } from "react";
import { useTheme } from "../utils/ThemeContext.jsx";
import { useParams } from "react-router-dom";
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

// Frontend to Backend language mapping
const langMap = {
    cpp: "C++",
    java: "Java",
    javascript: "JavaScript",
    python: "Python",
};

// Backend to Frontend language mapping
const reverseLangMap = {
    "C++": "cpp",
    Java: "java",
    JavaScript: "javascript",
    Python: "python",
};

const getLanguageForMonaco = (lang) => {
    return reverseLangMap[lang] || lang;
};

const ProblemPage = () => {
    const [problem, setProblem] = useState(null);
    const { theme } = useTheme();
    const [selectedLanguage, setSelectedLanguage] = useState("cpp");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [runLoading, setRunLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [runResult, setRunResult] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const [activeLeftTab, setActiveLeftTab] = useState("description");
    const [activeRightTab, setActiveRightTab] = useState("code");
    const [customInput, setCustomInput] = useState("");
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [panelSplit, setPanelSplit] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const editorRef = useRef(null);
    const resizeRef = useRef(null);
    const { problemId } = useParams();

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

    useEffect(() => {
        const fetchProblem = async () => {
            if (!problemId) {
                console.error("No problem ID provided");
                return;
            }
            try {
                setLoading(true);
                const response = await axiosClient.get(`/problem/problemById/${problemId}`);
                if (response.data) {
                    // Process the data to match our component's expectations
                    const problemData = {
                        ...response.data,
                        tags: response.data.tags
                            ? response.data.tags.split(",").map((tag) => tag.trim())
                            : [],
                        examples: response.data.visibleTestCases || [],
                        description: response.data.description || "",
                        difficulty: response.data.difficulty || "Medium",
                        startCode: response.data.startCode || [],
                        referenceSolution: response.data.referenceSolution || [],
                        constraints: response.data.constraints || [],
                    };
                    setProblem(problemData);
                } else {
                    console.error("No data received from the server");
                }
            } catch (error) {
                console.error("Error fetching problem:", error);
                if (error.response) {
                    if (error.response.status === 401) {
                        window.location.href = "/login";
                        return;
                    }
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [problemId]);

    useEffect(() => {
        if (problem && problem.startCode) {
            const languageCode = langMap[selectedLanguage]; // Convert cpp to C++, etc.
            const initialCode =
                problem.startCode.find((sc) => sc.language === languageCode)
                    ?.initialCode || "";
            setCode(initialCode);
        }
    }, [selectedLanguage, problem]);

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

    const handleEditorDidMount = (editor, monacoInstance) => {
        editorRef.current = editor;

        // Add keyboard shortcuts for zooming
        editor.addCommand(
            monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Equal,
            () => {
                setFontSize((prev) => Math.min(prev + 1, 30));
            }
        );
        editor.addCommand(
            monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Minus,
            () => {
                setFontSize((prev) => Math.max(prev - 1, 8));
            }
        );

        // Enable mouse wheel zooming
        editor.onMouseWheel((e) => {
            if (e.browserEvent.ctrlKey) {
                const delta = e.browserEvent.deltaY > 0 ? -1 : 1;
                setFontSize((prev) => Math.min(Math.max(prev + delta, 8), 30));
                e.browserEvent.preventDefault();
            }
        });
    };

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
    };

    const handleRun = async () => {
        setRunLoading(true);
        setRunResult(null);

        try {
            const response = await axiosClient.post(
                `/submission/run/${problemId}`,
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
                error: error.response?.data?.message || "Internal server error",
            });
            setActiveRightTab("testcase");
        } finally {
            setRunLoading(false);
        }
    };

    const handleSubmitCode = async () => {
        if (!code.trim()) {
            setSubmitResult({
                accepted: false,
                error: "Please write some code before submitting",
            });
            setActiveRightTab("result");
            return;
        }

        setSubmitLoading(true);
        setSubmitResult(null);

        try {
            const response = await axiosClient.post(
                `/submission/submit/${problemId}`,
                {
                    code: code,
                    language: selectedLanguage,
                }
            );

            if (response.data.success === false) {
                setSubmitResult({
                    accepted: false,
                    error: response.data.message || "Submission failed",
                });
            } else {
                setSubmitResult(response.data);
            }
            setActiveRightTab("result");
        } catch (error) {
            console.error("Error submitting code:", error);
            setSubmitResult({
                accepted: false,
                error: error.response?.data?.message || "Internal server error",
            });
            setActiveRightTab("result");
        } finally {
            setSubmitLoading(false);
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
            {/* Problem Header */}
            <div
                className={`px-6 py-4 border-b ${
                    theme === "dark"
                        ? "border-gray-700 bg-gray-800"
                        : "border-gray-200 bg-gray-50"
                }`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">{problem.title}</h1>
                        <div className="flex items-center mt-2 space-x-4">
                            <span
                                className={`px-3 py-1 text-sm rounded-full border ${getDifficultyColor(
                                    problem.difficulty
                                )}`}
                            >
                                {problem.difficulty}
                            </span>
                            {Array.isArray(problem.tags) &&
                                problem.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-1 text-sm rounded-full ${
                                            theme === "dark"
                                                ? "bg-gray-700 text-gray-300"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={`flex flex-1 overflow-hidden`}>
                {/* Left Panel - Problem Details */}
                <div className="w-[40%] border-r flex flex-col overflow-hidden h-full">
                    {/* Tab Bar */}
                    <div
                        className={`flex border-b ${
                            theme === "dark"
                                ? "border-gray-700"
                                : "border-gray-200"
                        }`}
                    >
                        {leftTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveLeftTab(tab.key)}
                                className={`flex items-center px-4 py-3 space-x-2 text-sm font-medium transition-all relative ${
                                    activeLeftTab === tab.key
                                        ? theme === "dark"
                                            ? "border-b-2 border-blue-500 text-blue-500 bg-blue-500/10"
                                            : "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                                        : theme === "dark"
                                        ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                                {tab.key === "chatAI" && (
                                    <span
                                        className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold rounded-full 
                                        ${
                                            theme === "dark"
                                                ? "bg-blue-500 text-white"
                                                : "bg-blue-100 text-blue-600"
                                        }`}
                                    >
                                        AI
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeLeftTab === "description" && (
                            <div className="prose max-w-none">
                                <div
                                    className={
                                        theme === "dark"
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                    }
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: problem.description,
                                        }}
                                    />

                                    {problem.examples &&
                                        problem.examples.length > 0 && (
                                            <div className="mt-6">
                                                <h3 className="text-lg font-semibold mb-4">
                                                    Examples
                                                </h3>
                                                {problem.examples.map(
                                                    (testCase, index) => (
                                                        <div
                                                            key={index}
                                                            className={`mb-4 p-4 rounded-lg ${
                                                                theme === "dark"
                                                                    ? "bg-gray-800"
                                                                    : "bg-gray-50"
                                                            }`}
                                                        >
                                                            <div className="mb-2">
                                                                <span className="font-semibold">
                                                                    Input:{" "}
                                                                </span>
                                                                <code className="ml-2 font-mono">
                                                                    {
                                                                        testCase.input
                                                                    }
                                                                </code>
                                                            </div>
                                                            <div className="mb-2">
                                                                <span className="font-semibold">
                                                                    Expected
                                                                    Output:{" "}
                                                                </span>
                                                                <code className="ml-2 font-mono">
                                                                    {
                                                                        testCase.expectedOutput
                                                                    }
                                                                </code>
                                                            </div>
                                                            {testCase.explanation && (
                                                                <div>
                                                                    <span className="font-semibold">
                                                                        Explanation:{" "}
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            testCase.explanation
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                    {Array.isArray(problem.constraints) &&
                                        problem.constraints.length > 0 && (
                                            <div className="mt-6">
                                                <h3 className="text-lg font-semibold mb-4">
                                                    Constraints
                                                </h3>
                                                <ul className="list-disc pl-6 space-y-2">
                                                    {problem.constraints.map(
                                                        (constraint, index) => (
                                                            <li key={index}>
                                                                {constraint}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}
                        {activeLeftTab === "solutions" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Reference Solutions
                                </h3>
                                {problem.referenceSolution &&
                                    problem.referenceSolution.map(
                                        (solution, index) => (
                                            <div
                                                key={index}
                                                className={`p-4 rounded-lg ${
                                                    theme === "dark"
                                                        ? "bg-gray-800"
                                                        : "bg-gray-50"
                                                }`}
                                            >
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4
                                                        className={`font-medium ${
                                                            theme === "dark"
                                                                ? "text-gray-200"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        {solution.language}{" "}
                                                        Solution
                                                    </h4>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedLanguage(
                                                                reverseLangMap[
                                                                    solution
                                                                        .language
                                                                ] || "cpp"
                                                            );
                                                            setCode(
                                                                solution.completeCode
                                                            );
                                                            setActiveLeftTab(
                                                                "description"
                                                            );
                                                        }}
                                                        className={`px-3 py-1 rounded-md text-sm ${
                                                            theme === "dark"
                                                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                                : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                                                        }`}
                                                    >
                                                        Use This Solution
                                                    </button>
                                                </div>
                                                <pre
                                                    className={`p-4 rounded-md overflow-x-auto ${
                                                        theme === "dark"
                                                            ? "bg-gray-900"
                                                            : "bg-white"
                                                    }`}
                                                >
                                                    <code
                                                        className={
                                                            theme === "dark"
                                                                ? "text-gray-300"
                                                                : "text-gray-800"
                                                        }
                                                    >
                                                        {solution.completeCode}
                                                    </code>
                                                </pre>
                                            </div>
                                        )
                                    )}
                            </div>
                        )}
                        {activeLeftTab === "editorial" && (
                            <div className="h-full">
                                {problem.editorial ? (
                                    <Editorial problemId={problemId} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full p-8">
                                        <div
                                            className={`p-8 rounded-lg text-center max-w-md ${
                                                theme === "dark"
                                                    ? "bg-gray-800"
                                                    : "bg-gray-50"
                                            }`}
                                        >
                                            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                            <h3
                                                className={`text-lg font-medium mb-2 ${
                                                    theme === "dark"
                                                        ? "text-gray-200"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                Solution Guide Coming Soon
                                            </h3>
                                            <p
                                                className={`text-sm ${
                                                    theme === "dark"
                                                        ? "text-gray-400"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                We're working on a detailed
                                                solution guide for this problem.
                                                In the meantime, you can check
                                                the "Solutions" tab for
                                                reference implementations or use
                                                the AI Help feature for
                                                guidance.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeLeftTab === "submissions" && (
                            <SubmissionHistory problemId={problemId} />
                        )}
                        {activeLeftTab === "chatAI" && (
                            <div className="h-full flex flex-col">
                                <div className="flex-1 overflow-y-auto">
                                    <div className={`h-full flex flex-col`}>
                                        <div
                                            className={`flex-grow p-4 ${
                                                theme === "dark"
                                                    ? "bg-gray-800"
                                                    : "bg-white"
                                            }`}
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                                                </div>
                                            ) : !problem ? (
                                                <div className="flex flex-col items-center justify-center h-full">
                                                    <XCircle className="w-12 h-12 text-red-500 mb-4" />
                                                    <p className="text-gray-500">Failed to load problem data</p>
                                                </div>
                                            ) : (
                                                <ChatAi
                                                    key={problemId}
                                                    problemId={problemId}
                                                    code={code}
                                                    language={selectedLanguage}
                                                    problemTitle={problem.title || ''}
                                                    problemDescription={problem.description || ''}
                                                    examples={problem.examples || []}
                                                    onError={(error) => {
                                                        console.error("ChatAI Error:", error);
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div
                                            className={`p-4 ${
                                                theme === "dark"
                                                    ? "bg-gray-900 border-t border-gray-700"
                                                    : "bg-gray-50 border-t border-gray-200"
                                            }`}
                                        >
                                            <div className="max-w-3xl mx-auto">
                                                <p
                                                    className={`text-sm ${
                                                        theme === "dark"
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    Ask the AI for help with
                                                    this problem. You can:
                                                    <ul className="list-disc ml-5 mt-2 space-y-1">
                                                        <li>
                                                            Get hints without
                                                            complete solutions
                                                        </li>
                                                        <li>
                                                            Ask for explanations
                                                            of specific concepts
                                                        </li>
                                                        <li>Debug your code</li>
                                                        <li>
                                                            Learn about
                                                            different approaches
                                                        </li>
                                                    </ul>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Code Editor */}
                <div
                    style={{ width: `${panelSplit}%` }}
                    className="flex-1 h-full flex flex-col"
                >
                    <div className="flex-1 overflow-y-auto">
                        <div className={`h-full flex flex-col`}>
                            {/* Main Content Area */}
                            <div className="flex-1 overflow-y-auto">
                                {/* Editor Area */}
                                <div className="h-full flex flex-col">
                                    {/* Editor Controls */}
                                    <div
                                        className={`flex items-center justify-between px-4 py-2 border-b ${
                                            theme === "dark"
                                                ? "border-gray-700"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <select
                                                value={selectedLanguage}
                                                onChange={(e) =>
                                                    handleLanguageChange(
                                                        e.target.value
                                                    )
                                                }
                                                className={`px-3 py-1.5 rounded border ${
                                                    theme === "dark"
                                                        ? "bg-gray-800 border-gray-600 text-gray-300"
                                                        : "bg-white border-gray-300 text-gray-700"
                                                }`}
                                            >
                                                {Object.entries(langMap).map(
                                                    ([value, label]) => (
                                                        <option
                                                            key={value}
                                                            value={value}
                                                        >
                                                            {label}
                                                        </option>
                                                    )
                                                )}
                                            </select>
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
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={toggleFullScreen}
                                                className={`p-1.5 rounded transition-colors ${
                                                    theme === "dark"
                                                        ? "hover:bg-gray-700"
                                                        : "hover:bg-gray-200"
                                                }`}
                                                title={
                                                    isFullScreen
                                                        ? "Exit fullscreen"
                                                        : "Fullscreen"
                                                }
                                            >
                                                {isFullScreen ? (
                                                    <Minimize2 className="w-4 h-4" />
                                                ) : (
                                                    <Maximize2 className="w-4 h-4" />
                                                )}
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
                                    <div className="flex-1 min-h-[500px]">
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
                                                minimap: {
                                                    enabled: true,
                                                    scale: 0.8,
                                                },
                                                scrollBeyondLastLine: false,
                                                automaticLayout: true,
                                                tabSize: 4,
                                                insertSpaces: true,
                                                wordWrap: "on",
                                                lineNumbers: "on",
                                                glyphMargin: true,
                                                folding: true,
                                                foldingStrategy: "indentation",
                                                lineDecorationsWidth: 10,
                                                lineNumbersMinChars: 3,
                                                renderLineHighlight: "all",
                                                selectOnLineNumbers: true,
                                                roundedSelection: true,
                                                readOnly: false,
                                                cursorStyle: "line",
                                                mouseWheelZoom: true,
                                                scrollbar: {
                                                    vertical: "visible",
                                                    horizontal: "visible",
                                                    useShadows: true,
                                                    verticalScrollbarSize: 12,
                                                    horizontalScrollbarSize: 12,
                                                    verticalHasArrows: true,
                                                    horizontalHasArrows: true,
                                                    arrowSize: 14,
                                                },
                                                bracketPairColorization: {
                                                    enabled: true,
                                                    independentColorPoolPerBracketType: true,
                                                },
                                                guides: {
                                                    bracketPairs: true,
                                                    indentation: true,
                                                    highlightActiveIndentation: true,
                                                    highlightActiveBracketPair: true,
                                                },
                                                suggest: {
                                                    showKeywords: true,
                                                    showSnippets: true,
                                                    preview: true,
                                                    showIcons: true,
                                                    maxVisibleSuggestions: 12,
                                                },
                                                hover: {
                                                    enabled: true,
                                                    delay: 200,
                                                    sticky: true,
                                                },
                                            }}
                                        />
                                    </div>

                                    {/* Test Cases and Results Panel */}
                                    {activeRightTab !== "code" && (
                                        <div
                                            className={`border-t ${
                                                theme === "dark"
                                                    ? "border-gray-700 bg-gray-800"
                                                    : "border-gray-200 bg-gray-50"
                                            } p-4`}
                                        >
                                            {activeRightTab === "testcase" && (
                                                <div className="space-y-4">
                                                    <div className="sticky top-0 bg-inherit z-10 pb-4">
                                                        <label
                                                            className={`block text-sm font-medium ${
                                                                theme === "dark"
                                                                    ? "text-gray-300"
                                                                    : "text-gray-700"
                                                            } mb-2`}
                                                        >
                                                            Custom Input
                                                        </label>
                                                        <textarea
                                                            value={customInput}
                                                            onChange={(e) =>
                                                                setCustomInput(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`w-full h-32 p-3 rounded-lg border font-mono text-sm ${
                                                                theme === "dark"
                                                                    ? "bg-gray-700 border-gray-600 text-gray-100"
                                                                    : "bg-white border-gray-300 text-gray-900"
                                                            }`}
                                                            placeholder="Enter your test case input here..."
                                                        />
                                                    </div>
                                                    {runResult && (
                                                        <div
                                                            className={`mt-4 p-4 rounded-lg ${
                                                                runResult.success
                                                                    ? theme ===
                                                                      "dark"
                                                                        ? "bg-green-900/20"
                                                                        : "bg-green-50"
                                                                    : theme ===
                                                                      "dark"
                                                                    ? "bg-red-900/20"
                                                                    : "bg-red-50"
                                                            }`}
                                                        >
                                                            <h3
                                                                className={`text-sm font-medium ${
                                                                    runResult.success
                                                                        ? "text-green-500"
                                                                        : "text-red-500"
                                                                }`}
                                                            >
                                                                {runResult.success
                                                                    ? "Test Case Passed"
                                                                    : "Test Case Failed"}
                                                            </h3>
                                                            {runResult.output && (
                                                                <div className="mt-2">
                                                                    <p
                                                                        className={`text-sm ${
                                                                            theme ===
                                                                            "dark"
                                                                                ? "text-gray-300"
                                                                                : "text-gray-700"
                                                                        }`}
                                                                    >
                                                                        Output:
                                                                    </p>
                                                                    <pre
                                                                        className={`mt-1 p-2 rounded ${
                                                                            theme ===
                                                                            "dark"
                                                                                ? "bg-gray-800"
                                                                                : "bg-gray-100"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            runResult.output
                                                                        }
                                                                    </pre>
                                                                </div>
                                                            )}
                                                            {runResult.error && (
                                                                <div className="mt-2">
                                                                    <p className="text-sm text-red-500">
                                                                        Error:
                                                                    </p>
                                                                    <pre
                                                                        className={`mt-1 p-2 rounded ${
                                                                            theme ===
                                                                            "dark"
                                                                                ? "bg-gray-800"
                                                                                : "bg-gray-100"
                                                                        } text-red-500`}
                                                                    >
                                                                        {
                                                                            runResult.error
                                                                        }
                                                                    </pre>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {activeRightTab === "result" &&
                                                submitResult && (
                                                    <div
                                                        className={`p-4 rounded-lg ${
                                                            submitResult.accepted
                                                                ? theme ===
                                                                  "dark"
                                                                    ? "bg-green-900/20"
                                                                    : "bg-green-50"
                                                                : theme ===
                                                                  "dark"
                                                                ? "bg-red-900/20"
                                                                : "bg-red-50"
                                                        }`}
                                                    >
                                                        <h3
                                                            className={`text-lg font-medium ${
                                                                submitResult.accepted
                                                                    ? "text-green-500"
                                                                    : "text-red-500"
                                                            }`}
                                                        >
                                                            {submitResult.accepted
                                                                ? "Solution Accepted!"
                                                                : "Solution Failed"}
                                                        </h3>
                                                        {submitResult.stats && (
                                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p
                                                                        className={`text-sm ${
                                                                            theme ===
                                                                            "dark"
                                                                                ? "text-gray-400"
                                                                                : "text-gray-600"
                                                                        }`}
                                                                    >
                                                                        Runtime
                                                                    </p>
                                                                    <p
                                                                        className={`text-lg font-medium ${
                                                                            theme ===
                                                                            "dark"
                                                                                ? "text-gray-300"
                                                                                : "text-gray-900"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            submitResult
                                                                                .stats
                                                                                .runtime
                                                                        }
                                                                        ms
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p
                                                                        className={`text-sm ${
                                                                            theme ===
                                                                            "dark"
                                                                                ? "text-gray-400"
                                                                                : "text-gray-600"
                                                                        }`}
                                                                    >
                                                                        Memory
                                                                    </p>
                                                                    <p
                                                                        className={`text-lg font-medium ${
                                                                            theme ===
                                                                            "dark"
                                                                                ? "text-gray-300"
                                                                                : "text-gray-900"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            submitResult
                                                                                .stats
                                                                                .memory
                                                                        }
                                                                        MB
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {submitResult.error && (
                                                            <div className="mt-4">
                                                                <p className="text-sm text-red-500">
                                                                    Error:
                                                                </p>
                                                                <pre
                                                                    className={`mt-1 p-2 rounded ${
                                                                        theme ===
                                                                        "dark"
                                                                            ? "bg-gray-800"
                                                                            : "bg-gray-100"
                                                                    } text-red-500`}
                                                                >
                                                                    {
                                                                        submitResult.error
                                                                    }
                                                                </pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    )}

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
                                                    runLoading
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : theme === "dark"
                                                        ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                                                        : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                                }`}
                                                onClick={handleRun}
                                                disabled={runLoading}
                                            >
                                                {runLoading ? (
                                                    <>
                                                        <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full" />
                                                        <span>Running...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="w-4 h-4" />
                                                        <span>Run Code</span>
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    submitLoading
                                                        ? "opacity-75 cursor-not-allowed bg-green-600"
                                                        : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
                                                } text-white transform hover:-translate-y-0.5`}
                                                onClick={handleSubmitCode}
                                                disabled={submitLoading}
                                            >
                                                {submitLoading ? (
                                                    <>
                                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                                        <span>
                                                            Submitting...
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>
                                                            Submit Solution
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;
