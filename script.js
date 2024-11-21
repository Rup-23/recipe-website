document.addEventListener("DOMContentLoaded", function () {
    const fetchButton = document.getElementById("fetchButton");

    // Initially hide the recipe details container
    const recipeDetailsContainer = document.querySelector(".recipe-details");
    recipeDetailsContainer.style.display = "none"; // Hide the container initially

    fetchButton.addEventListener("click", function () {
        const recipeName = document.getElementById("recipeInput").value.trim();

        if (recipeName) {
            const apiURL = `https://foodrecipe-backend-3.onrender.com/recipes?name=${encodeURIComponent(recipeName)}`;

            // Clear previous content and show loading state
            document.getElementById("recipeName").textContent = "Loading...";
            document.getElementById("recipeRegion").textContent = ""; // Clear previous region
            document.getElementById("dietaryRestrictions").textContent = ""; // Clear previous dietary restrictions
            document.getElementById("ingredientList").innerHTML = "";
            document.getElementById("instructions").textContent = "";
            document.getElementById("recipeImageContainer").innerHTML = "";

            // Make the API call
            fetch(apiURL)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("API Response:", data);

                    // Hide the container if no valid search result is found
                    recipeDetailsContainer.style.display = "none"; // Hide it initially

                    // Find the recipe with the specified name
                    const recipe = data.find(item => item.name.toLowerCase() === recipeName.toLowerCase());

                    if (recipe) {
                        // Display recipe details
                        document.getElementById("recipeName").textContent = recipe.name;
                        document.getElementById("recipeRegion").textContent = `Region: ${recipe.region || 'Unknown'}`;
                        document.getElementById("dietaryRestrictions").textContent = `Dietary Restrictions: ${recipe.dietaryrestrictions || 'None'}`;
                        document.getElementById("instructions").textContent = recipe.instructions;

                        // Populate ingredient list
                        const ingredientList = document.getElementById("ingredientList");
                        ingredientList.innerHTML = "";
                        recipe.ingredients.forEach(ingredient => {
                            const li = document.createElement("li");
                            li.textContent = ingredient;
                            ingredientList.appendChild(li);
                        });

                        // Display recipe image
                        const imageContainer = document.getElementById("recipeImageContainer");
                        imageContainer.innerHTML = "";
                        if (recipe.image) {
                            const imgElement = document.createElement("img");
                            imgElement.src = recipe.image;
                            imgElement.alt = `${recipe.name} image`;
                            imgElement.style.maxWidth = "100%";
                            imageContainer.appendChild(imgElement);
                        } else {
                            imageContainer.innerHTML = "No image available";
                        }

                        // Show the recipe details container
                        recipeDetailsContainer.style.display = "block";
                    } else {
                        // Recipe not found, show error
                        displayError("Recipe not found!");
                    }
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    displayError("Failed to load recipe. Please try again later.");
                });
        } else {
            alert("Please enter a recipe name.");
        }
    });

    function displayError(message) {
        // Show the container with the error message
        recipeDetailsContainer.style.display = "block";

        document.getElementById("recipeName").textContent = message;
        document.getElementById("recipeRegion").textContent = ""; // Clear region if not found
        document.getElementById("dietaryRestrictions").textContent = ""; // Clear dietary restrictions if not found
        document.getElementById("ingredientList").innerHTML = ""; // Clear ingredients list
        document.getElementById("instructions").textContent = ""; // Clear instructions
        document.getElementById("recipeImageContainer").innerHTML = "No image available"; // Show no image message
    }
});
