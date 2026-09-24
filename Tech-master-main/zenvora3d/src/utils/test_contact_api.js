const axios = require('axios');

async function testContactApi() {
  try {
    const res = await axios.get('http://localhost:5000/api/v1/contact');
    console.log("Response Success:", res.status, res.data);
  } catch (err) {
    console.error("Response Error:", err.response ? err.response.status : err.message, err.response ? err.response.data : '');
  }
}

testContactApi();
