const axios = require('axios');

// Enhanced error handling for Judge0 API
const handleJudge0Error = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const message = error.response.data.error || 'Judge0 API error';
    throw new Error(`Judge0 API error: ${message}`);
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response from Judge0 API');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error('Error setting up Judge0 request');
  }
};

const getLanguageById = (lang) => {
  const languages = {
    "c++": 54,    // C++ (GCC 9.2.0)
    "java": 62,   // Java (OpenJDK 13.0.1)
    "javascript": 63,  // JavaScript (Node.js 12.14.0)
    "python": 71,  // Python (3.8.1)
  };

  const languageId = languages[lang.toLowerCase()];
  if (!languageId) {
    throw new Error(`Unsupported language: ${lang}`);
  }
  return languageId;
};

const submitBatch = async (submissions) => {
  try {
    // Encode source_code and stdin as base64
    const encodedSubmissions = submissions.map((sub) => ({
      ...sub,
      source_code: Buffer.from(sub.source_code || "", "utf8").toString("base64"),
      stdin: sub.stdin ? Buffer.from(sub.stdin, "utf8").toString("base64") : undefined,
      expected_output: sub.expected_output ? Buffer.from(sub.expected_output, "utf8").toString("base64") : undefined
    }));

    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
      params: { base64_encoded: 'true' },
      headers: {
        'x-rapidapi-key': process.env.JUDGE0_KEY,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: { submissions: encodedSubmissions }
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    handleJudge0Error(error);
  }
};


const waiting = async(timer)=>{
  setTimeout(()=>{
    return 1;
  },timer);
}

// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const submitToken = async (tokens) => {
  try {
    // Wait for all submissions to complete
    const results = await Promise.all(
      tokens.map(async (token) => {
        let result;
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
          const options = {
            method: 'GET',
            url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            params: {
              base64_encoded: 'true',
              fields: '*'
            },
            headers: {
              'x-rapidapi-key': process.env.JUDGE0_KEY,
              'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
            }
          };

          const response = await axios.request(options);
          result = response.data;
          
          if (result.status.id <= 2) { // In Queue or Processing
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            attempts++;
            continue;
          }
          break;
        }

        // Decode the results
        if (result.stdout) {
          result.stdout = Buffer.from(result.stdout, 'base64').toString();
        }
        if (result.stderr) {
          result.stderr = Buffer.from(result.stderr, 'base64').toString();
        }
        if (result.compile_output) {
          result.compile_output = Buffer.from(result.compile_output, 'base64').toString();
        }

        return result;
      })
    );

    return results;
  } catch (error) {
    handleJudge0Error(error);
  }
};

module.exports = { 
  getLanguageById, 
  submitBatch, 
  submitToken 
};


module.exports = {getLanguageById,submitBatch,submitToken};








//
