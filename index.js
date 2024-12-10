const response = await fetch('http://localhost:3000/api/vendor-types');
 // or your API call method
const data = await response.json();
console.log(data); // Check if it's an array
