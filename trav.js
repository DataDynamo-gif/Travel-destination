const apiKey = 'YOUR_API_KEY';
const lat = 28.6139; // दिल्ली
const lon = 77.2090;
const radius = 10000; // मीटर

fetch(`https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&apikey=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    console.log(data.features); // जगहों की लिस्ट
  });
