var params = new URLSearchParams(document.location.search);

const recipeName = params.get("name");

fetch('https://dummyjson.com/recipes?limit=50')
.then(res => res.json())
.then(json => {
    const recipe = json.recipes.filter(recipe => recipe.name === recipeName)[0];
    
    console.log(recipe.difficulty);
    const recipeHtml = `
    <div class="card mb-3 ${getDifficultyClass(recipe.difficulty)}">
        <img src="${recipe.image}" class="card-img-top" alt="Recipe Image">
        <div class="card-body">
        <h1 class="card-title display-4">${recipe.name}</h1>
        <p class="card-text font-weight-bold lead"><strong>Preparation Time:</strong> ${recipe.prepTimeMinutes} minutes</p>
        <p class="card-text font-weight-bold lead"><strong>Cooking Time:</strong> ${recipe.cookTimeMinutes} minutes</p>
        <p class="card-text font-weight-bold lead"><strong>Servings:</strong> ${recipe.servings}</p>
        <p class="card-text font-weight-bold lead"><strong>Difficulty:</strong> ${recipe.difficulty}</p>
        <p class="card-text font-weight-bold lead"><strong>Calories per Serving:</strong> ${recipe.caloriesPerServing}</p>
        <p class="card-text font-weight-bold lead"><strong>Rating:</strong> ${generateStars(recipe.rating)} ${recipe.rating}</p>
        <h5 class="card-title font-weight-bold">Ingredients:</h5>
        <ul class="list-group list-group-flush">
            ${recipe.ingredients.map(ingredient => `<li class="list-group-item font-weight-bold lead">${ingredient}</li>`).join('')}
        </ul>
        <h5 class="card-title font-weight-bold">Instructions:</h5>
        <ol class="list-group list-group-numbered">
            ${recipe.instructions.map(instruction => `<li class="list-group-item font-weight-bold lead">${instruction}</li>`).join('')}
        </ol>
        </div>
    </div>
    `;

    function getDifficultyClass(difficulty) {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'bg-lightgreen';
            case 'medium':
                return 'bg-lightyellow';
            case 'hard':
                return 'bg-lightred';
            default:
                return '';
        }
    }

    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let starsHTML = '';

        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="bi bi-star-fill text-warning"></i>';
        }

        if (halfStar) {
            starsHTML += '<i class="bi bi-star-half text-warning"></i>';
        }

        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="bi bi-star text-warning"></i>';
        }

        return starsHTML;
    }

    const recipeDiv = document.getElementById('recipe');

    recipeDiv.innerHTML = recipeHtml;
})
