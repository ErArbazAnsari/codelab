const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const { getLanguageById, submitBatch, submitToken } = require("../../utils/problemUtility");
const { updateUserStats } = require("./userStatsController");

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    // Input validation
    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: code, language, or problem ID"
      });
    }

    // Normalize language name
    if (language === "cpp") language = "c++";
    
    // Fetch the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found"
      });
    }

    // Create submission record
    const submissionRecord = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length,
    });

    // Get language ID for Judge0
    const languageId = getLanguageById(language);

    // Prepare submissions for Judge0
    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    // Submit to Judge0
    const submitResults = await submitBatch(submissions);
    if (!submitResults) {
      throw new Error("Failed to submit code to judge");
    }

    const resultTokens = submitResults.map((value) => value.token);
    const testResults = await submitToken(resultTokens);

    // Process results
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "pending";

    testResults.forEach((result) => {
      if (result.status.id === 3) { // Accepted
        testCasesPassed++;
        runtime = Math.max(runtime, parseFloat(result.time) || 0);
        memory = Math.max(memory, parseFloat(result.memory) || 0);
      }
    });

    // Update submission status
    status = testCasesPassed === problem.hiddenTestCases.length ? "accepted" : "wrong_answer";
    
    await Submission.findByIdAndUpdate(submissionRecord._id, {
      status,
      testCasesPassed,
      runtime,
      memory
    });

    // Update user stats if all test cases passed
    if (status === "accepted") {
      await updateUserStats(userId, problemId);
      // Add to user's solved problems if not already there
      const user = await User.findById(userId);
      if (!user.problemSolved.includes(problemId)) {
        user.problemSolved.push(problemId);
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      accepted: status === "accepted",
      totalTestCases: problem.hiddenTestCases.length,
      testCasesPassed,
      runtime: runtime.toFixed(2),
      memory: Math.round(memory),
      submissionId: submissionRecord._id
    });

  } catch (err) {
    console.error("Error in submitCode:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error while submitting code"
    });
  }
};

const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language, customInput } = req.body;

    // Input validation
    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: code, language, or problem ID"
      });
    }

    // Fetch the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found"
      });
    }

    // Normalize language name
    if (language === "cpp") language = "c++";

    // Get language ID
    const languageId = getLanguageById(language);
    if (!languageId) {
      return res.status(400).json({
        success: false,
        error: "Unsupported programming language"
      });
    }

    // Prepare test cases
    let submissions;
    if (customInput) {
      // If custom input is provided, use that
      submissions = [{
        source_code: code,
        language_id: languageId,
        stdin: customInput
      }];
    } else {
      // Use visible test cases
      if (!problem.visibleTestCases || problem.visibleTestCases.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No test cases available for this problem"
        });
      }
      submissions = problem.visibleTestCases.map((testcase) => ({
        source_code: code,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));
    }

    // Submit code to Judge0
    const submitResults = await submitBatch(submissions);
    if (!submitResults) {
      throw new Error("Failed to submit code to judge");
    }

    const resultTokens = submitResults.map((value) => value.token);
    const testResults = await submitToken(resultTokens);

    if (!testResults) {
      throw new Error("Failed to get test results");
    }

    // Process results
    const results = testResults.map((result, index) => {
      const testCase = customInput ? 
        { input: customInput, output: "Custom input - no expected output" } : 
        problem.visibleTestCases[index];

      return {
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: result.stdout || "",
        status: result.status.description,
        error: result.stderr || result.compile_output || "",
        passed: result.status.id === 3,
        time: result.time,
        memory: result.memory
      };
    });

    const testCasesPassed = results.filter(r => r.passed).length;
    const runtime = Math.max(...results.map(r => parseFloat(r.time) || 0));
    const memory = Math.max(...results.map(r => parseFloat(r.memory) || 0));

    res.json({
      success: true,
      results: results,
      summary: {
        totalTestCases: testResults.length,
        testCasesPassed,
        runtime: runtime.toFixed(2),
        memory: Math.round(memory),
        status: testCasesPassed === testResults.length ? "Accepted" : "Failed"
      }
    });

  } catch (err) {
    console.error("Error in runCode:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error while running code"
    });
  }
};

module.exports = { submitCode, runCode };
