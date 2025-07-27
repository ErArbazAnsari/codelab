import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

function AdminUpdate() {
    const navigate = useNavigate();
    const [problemId, setProblemId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [initialData, setInitialData] = useState(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: initialData || {
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

    useEffect(() => {
        if (problemId) {
            setLoading(true);
            axiosClient.get(`/problem/problemById/${problemId}`)
                .then((res) => {
                    setInitialData(res.data);
                    reset(res.data);
                })
                .catch((err) => {
                    setError("Problem not found or error fetching data.");
                })
                .finally(() => setLoading(false));
        }
    }, [problemId, reset]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await axiosClient.put(`/problem/update/${problemId}`, data);
            navigate("/admin");
        } catch (error) {
            setError("Error updating problem.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Update Problem</h1>
            <input
                type="text"
                placeholder="Enter Problem ID"
                value={problemId}
                onChange={(e) => setProblemId(e.target.value)}
                className="input input-bordered mb-4 w-full"
            />
            {loading && <div>Loading...</div>}
            {error && <div className="text-error mb-4">{error}</div>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information, Test Cases, Code Templates (same as AdminPanel) */}
                {/* ...existing code for form fields, similar to AdminPanel... */}
                <button type="submit" className="btn btn-primary w-full">
                    Update Problem
                </button>
            </form>
        </div>
    );
}

export default AdminUpdate;
