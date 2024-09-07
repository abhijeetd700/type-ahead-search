const BASE_URL = 'https://type-ahead-search-deploy.onrender.com';

const searchInput = document.getElementById('textInput');
const suggestionList = document.getElementById('suggestionList');

// Mock function to simulate API call for fetching suggestions
async function fetchSuggestions(query) {
    // Simulating an API call with some mock data
    // const mockData = ['apple','ape','apply', 'banana', 'grape', 'orange', 'pineapple', 'mango', 'peach', 'pear', 'plum'];
    // Filter data based on the query
    
    // return mockData.filter(item => item.toLowerCase().startsWith(query.toLowerCase()));
    try{
        const response = await axios.get(BASE_URL+`/api/search?query=${query}`);
        const suggestions = await response.data;
        console.log(suggestions);
        return suggestions;
    }
    catch(e){
        console.log(e)
    }
}


searchInput.addEventListener("input", async() => {
    rmvElements();

    const query = searchInput.value;
    
    if (query.length !== 0) {
        const suggestions = await fetchSuggestions(query);
        for (let i of suggestions) {
            if (i.toLowerCase()
                .startsWith(searchInput.value.toLowerCase()) 
                                && searchInput.value != "") {
                let lstItem = document.createElement("li");
                lstItem.classList.add("lst-items");
                lstItem.style.cursor = "pointer";
                lstItem.setAttribute("onclick", 
                                    "dspNames('" + i + "')");
                let word = "<b>" 
                    + i.substr(0, searchInput.value.length) + "</b>";
                word += i.substr(searchInput.value.length);
                lstItem.innerHTML = word;
                suggestionList.appendChild(lstItem);
            }
        }
    }
});

function dspNames(value) {
    searchInput.value = value;
    rmvElements();
}

function rmvElements() {
    let items = document.querySelectorAll(".lst-items");
    items.forEach((item) => {
        item.remove();
    });
}

async function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const query = document.getElementById('textInput').value;
    console.log(query)
    const data ={word:query}

    await axios.post(BASE_URL+"/api/add",data)
                                .then(response => {
                                    // Handle successful response
                                    console.log('Success:', response.data);
                                    alert('Success: '+response.data);
                                    // Redirect to the same page or reload the page
                                    window.location.reload(); // Reloads the current page
                                })
                                .catch(error => {
                                    // Handle errors
                                    console.error('Error:', error);
                                    alert('Error submitting form.');
                                });

}

