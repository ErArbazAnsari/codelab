const axios = require('axios');


const getLanguageById = (lang)=>{

    const language = {
        "c++":54,
        "java":62,
        "javascript":63
    }


    return language[lang.toLowerCase()];
}


const submitBatch = async (submissions) => {
  // Encode source_code and stdin/input as base64 for each submission
  const encodedSubmissions = submissions.map((sub) => ({
    ...sub,
    source_code: Buffer.from(sub.source_code || "", "utf8").toString("base64"),
    stdin: sub.stdin ? Buffer.from(sub.stdin, "utf8").toString("base64") : undefined,
    input: sub.input ? Buffer.from(sub.input, "utf8").toString("base64") : undefined,
  }));

  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'true'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_KEY,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      submissions: encodedSubmissions
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


const waiting = async(timer)=>{
  setTimeout(()=>{
    return 1;
  },timer);
}

// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const submitToken = async (resultToken) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: resultToken.join(","),
      base64_encoded: "true",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  while (true) {
    const result = await fetchData();
    if (!result || !result.submissions) {
      await waiting(1000);
      continue;
    }
    const IsResultObtained = result.submissions.every((r) => r.status_id > 2);
    if (IsResultObtained) return result.submissions;
    await waiting(1000);
  }
};


module.exports = {getLanguageById,submitBatch,submitToken};








//
