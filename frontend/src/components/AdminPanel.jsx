import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../utils/ThemeContext.jsx";

// Zod schema matching the problem schema
const problemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    tags: z.enum([
        "array",
        "linkedList",
        "graph",
        "dp",
        "string",
        "tree",
        "hashing",
        "stack",
        "queue",
    ]),
    visibleTestCases: z
        .array(
            z.object({
                input: z.string().min(1, "Input is required"),
                output: z.string().min(1, "Output is required"),
                explanation: z.string().min(1, "Explanation is required"),
            })
        )
        .min(1, "At least one visible test case required"),
    hiddenTestCases: z
        .array(
            z.object({
                input: z.string().min(1, "Input is required"),
                output: z.string().min(1, "Output is required"),
            })
        )
        .min(1, "At least one hidden test case required"),
    startCode: z
        .array(
            z.object({
                language: z.enum(["C++", "Java", "JavaScript"]),
                initialCode: z.string().min(1, "Initial code is required"),
            })
        )
        .length(3, "All three languages required"),
    referenceSolution: z
        .array(
            z.object({
                language: z.enum(["C++", "Java", "JavaScript"]),
                completeCode: z.string().min(1, "Complete code is required"),
            })
        )
        .length(3, "All three languages required"),
});

function AdminPanel() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            startCode: [
                { language: "C++", initialCode: "" },
                { language: "Java", initialCode: "" },
                { language: "JavaScript", initialCode: "" },
            ],
            referenceSolution: [
                { language: "C++", completeCode: "" },
                { language: "Java", completeCode: "" },
                { language: "JavaScript", completeCode: "" },
            ],
        },
    });

    const {
        fields: visibleFields,
        append: appendVisible,
        remove: removeVisible,
    } = useFieldArray({
        control,
        name: "visibleTestCases",
    });

    const {
        fields: hiddenFields,
        append: appendHidden,
        remove: removeHidden,
    } = useFieldArray({
        control,
        name: "hiddenTestCases",
    });

    const onSubmit = async (data) => {
        try {
            console.log("Data to be sent:", data);
            await axiosClient.post("/problem/create", data);
            console.log("Problem created successfully");
            navigate("/");
        } catch (error) {
            console.error("Error creating problem:", error);
        }
    };

    return (
        <div className={`min-h-screen py-10 px-2 flex justify-center items-start ${theme === "dark" ? "bg-gradient-to-br from-[#18181c] via-[#23232a] to-[#18181c] text-white" : "bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 text-gray-900"}`}>
            <div className="w-full max-w-3xl">
                <div className="mb-8 text-center">
                    <h1 className={`text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2`}>Create New Problem</h1>
                    <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Add a new coding challenge to the platform</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Information */}
                    <section className={`${theme === "dark" ? "bg-[#23232a] text-white" : "bg-white text-gray-900"} rounded-2xl shadow-lg p-6 mb-6`}>
                        <h2 className={`text-2xl font-semibold mb-4 ${theme === "dark" ? "text-blue-400" : "text-blue-700"}`}>Basic Information</h2>
                        <div className="space-y-4">
                            <div className="form-control">
                                <label className={`label font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Title</label>
                                <input
                                    {...register("title")}
                                    className={`input input-bordered w-full ${errors.title ? "border-red-500" : theme === "dark" ? "border-gray-700 bg-[#18181c] text-white" : "border-gray-300"}`}
                                    placeholder="Enter problem title..."
                                />
                                {errors.title && (
                                    <span className="text-red-500 text-sm">{errors.title.message}</span>
                                )}
                            </div>
                            <div className="form-control">
                                <label className={`label font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Description</label>
                                <textarea
                                    {...register("description")}
                                    className={`textarea textarea-bordered w-full h-32 ${errors.description ? "border-red-500" : theme === "dark" ? "border-gray-700 bg-[#18181c] text-white" : "border-gray-300"}`}
                                    placeholder="Enter detailed problem description..."
                                />
                                {errors.description && (
                                    <span className="text-red-500 text-sm">{errors.description.message}</span>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <div className="form-control w-1/2">
                                <label className={`label font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Difficulty</label>
                                    <select
                                        {...register("difficulty")}
                                    className={`select select-bordered w-full ${errors.difficulty ? "border-red-500" : theme === "dark" ? "border-gray-700 bg-[#18181c] text-white" : "border-gray-300"}`}
                                    >
                                        <option value="easy">🟢 Easy</option>
                                        <option value="medium">🟡 Medium</option>
                                        <option value="hard">🔴 Hard</option>
                                    </select>
                                </div>
                                <div className="form-control w-1/2">
                                <label className={`label font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Tag</label>
                                    <select
                                        {...register("tags")}
                                    className={`select select-bordered w-full ${errors.tags ? "border-red-500" : theme === "dark" ? "border-gray-700 bg-[#18181c] text-white" : "border-gray-300"}`}
                                    >
                                        <option value="array">📊 Array</option>
                                        <option value="linkedList">🔗 Linked List</option>
                                        <option value="graph">🕸️ Graph</option>
                                        <option value="dp">⚡ DP</option>
                                        <option value="string">📝 String</option>
                                        <option value="tree">🌳 Tree</option>
                                        <option value="hashing">🔑 Hashing</option>
                                        <option value="stack">📚 Stack</option>
                                        <option value="queue">📋 Queue</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Test Cases */}
                    <section className={`${theme === "dark" ? "bg-[#23232a] text-white" : "bg-white text-gray-900"} rounded-2xl shadow-lg p-6 mb-6`}>
                        <h2 className={`text-2xl font-semibold mb-4 ${theme === "dark" ? "text-purple-400" : "text-purple-700"}`}>Test Cases</h2>
                        {/* Visible Test Cases */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-blue-600">Visible Test Cases</h3>
                                <button
                                    type="button"
                                    onClick={() => appendVisible({ input: "", output: "", explanation: "" })}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                                >
                                    + Add Visible Case
                                </button>
                            </div>
                            <div className="grid gap-4">
                                {visibleFields.map((field, index) => (
                                    <div key={field.id} className={`${theme === "dark" ? "bg-[#18181c] border-blue-900" : "bg-blue-50 border-blue-200"} border rounded-xl p-4 relative`}>
                                        <button
                                            type="button"
                                            onClick={() => removeVisible(index)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            title="Remove"
                                        >✕</button>
                                        <input
                                            {...register(`visibleTestCases.${index}.input`)}
                                            placeholder="Input"
                                            className="input input-bordered w-full mb-2"
                                        />
                                        <input
                                            {...register(`visibleTestCases.${index}.output`)}
                                            placeholder="Output"
                                            className="input input-bordered w-full mb-2"
                                        />
                                        <textarea
                                            {...register(`visibleTestCases.${index}.explanation`)}
                                            placeholder="Explanation"
                                            className="textarea textarea-bordered w-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Hidden Test Cases */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-purple-600">Hidden Test Cases</h3>
                                <button
                                    type="button"
                                    onClick={() => appendHidden({ input: "", output: "" })}
                                    className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                                >
                                    + Add Hidden Case
                                </button>
                            </div>
                            <div className="grid gap-4">
                                {hiddenFields.map((field, index) => (
                                    <div key={field.id} className={`${theme === "dark" ? "bg-[#18181c] border-purple-900" : "bg-purple-50 border-purple-200"} border rounded-xl p-4 relative`}>
                                        <button
                                            type="button"
                                            onClick={() => removeHidden(index)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            title="Remove"
                                        >✕</button>
                                        <input
                                            {...register(`hiddenTestCases.${index}.input`)}
                                            placeholder="Input"
                                            className="input input-bordered w-full mb-2"
                                        />
                                        <input
                                            {...register(`hiddenTestCases.${index}.output`)}
                                            placeholder="Output"
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    {/* Code Templates */}
                    <section className={`${theme === "dark" ? "bg-[#23232a] text-white" : "bg-white text-gray-900"} rounded-2xl shadow-lg p-6 mb-6`}>
                        <h2 className={`text-2xl font-semibold mb-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-700"}`}>Code Templates</h2>
                        <div className="grid gap-6">
                            {[0, 1, 2].map((index) => (
                                <div key={index} className={`${theme === "dark" ? "bg-[#18181c] border-indigo-900" : "bg-indigo-50 border-indigo-200"} border rounded-xl p-4`}>
                                    <h3 className="font-medium mb-2 text-indigo-600">
                                        {index === 0 ? "C++" : index === 1 ? "Java" : "JavaScript"}
                                    </h3>
                                    <div className="form-control mb-2">
                                        <label className={`label font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Initial Code</label>
                                        <textarea
                                            {...register(`startCode.${index}.initialCode`)}
                                            className={`textarea textarea-bordered w-full font-mono ${theme === "dark" ? "border-gray-700 bg-[#18181c] text-white" : "border-gray-300"}`}
                                            rows={4}
                                            placeholder={`Enter ${index === 0 ? "C++" : index === 1 ? "Java" : "JavaScript"} starter code...`}
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className={`label font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Reference Solution</label>
                                        <textarea
                                            {...register(`referenceSolution.${index}.completeCode`)}
                                            className={`textarea textarea-bordered w-full font-mono ${theme === "dark" ? "border-gray-700 bg-[#18181c] text-white" : "border-gray-300"}`}
                                            rows={4}
                                            placeholder={`Enter ${index === 0 ? "C++" : index === 1 ? "Java" : "JavaScript"} complete solution...`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <div className="flex justify-end">
                        <button type="submit" className={`px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${theme === "dark" ? "" : ""}`}>
                            Create Problem
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminPanel;
