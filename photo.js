const query = 'India travel';
const accessKey = 'YOUR_ACCESS_KEY';

fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`)
  .then(response => response.json())
  .then(data => {
    console.log(data.results); // फोटो की लिस्ट
  });
