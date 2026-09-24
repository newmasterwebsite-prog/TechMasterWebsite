async function testContactApi() {
  try {
    const res = await fetch('http://localhost:5000/api/v1/contact');
    console.log("Response Status:", res.status);
    const data = await res.json();
    console.log("Response Data:", data);
  } catch (err) {
    console.error("Fetch Error:", err.message);
  }
}

testContactApi();
