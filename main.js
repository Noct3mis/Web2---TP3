fetch('https://dummyjson.com/recipes?limit=50')
.then(res => res.json())
.then(json => {
    recipes = json.recipes;
    
    const uniqueTags = getUniqueTags(recipes);

    const tagContainer = document.getElementById("tag-container");
    uniqueTags.forEach(tag => {
        const tagCard = createTagCard(recipes, tag);
        tagContainer.appendChild(tagCard);
    });

    displayRecipesInTable(recipes);

    document.addEventListener("click", (event) => {
        const tagElement = event.target.closest(".tag-badge");
        const imgElement = event.target.closest(".card-img-wrapper");
        if (tagElement || imgElement) {
            const tagText = tagElement ? tagElement.textContent.trim() : imgElement.querySelector(".tag-badge").textContent.trim();
            const tag = encodeURIComponent(tagText.replace(/\([0-9]+\)/g, '').trim());
            const filteredRecipes = recipes.filter(recipe => recipe.tags.includes(tag));
            displayRecipesInPopup(filteredRecipes);
        }
    });
});

function generateRecipeTableRow(recipe) {
    const row = document.createElement("tr");
  
    row.innerHTML = `
      <td>${recipe.name}</td>
      <td>${generateStars(recipe.rating)} (${recipe.rating})</td>
      <td>${recipe.prepTimeMinutes} minutes ${getPreparationIcon(recipe.prepTimeMinutes)}</td>
      <td><span class="badge text-dark ${getDifficultyClass(recipe.difficulty)}">${recipe.difficulty}</span></td>
      <td><a href="detail.html?name=${encodeURIComponent(recipe.name)}">More details</a></td>
    `;
  
    return row;
}

function getPreparationIcon(prepTime) {
    if (prepTime < 30) {
      return '<i class="bi bi-clock"></i>';
    } else {
      return '<i class="bi bi-alarm"></i>';
    }
}

function displayRecipesInTable(recipes) {
    const tableBody = document.getElementById("recipes-table-body");
  
    recipes.forEach(recipe => {
      const row = generateRecipeTableRow(recipe);
      tableBody.appendChild(row);
    });
}

function getUniqueTags(recipes) {
    const tags = new Set();
    recipes.forEach(recipe => {
        recipe.tags.forEach(tag => {
            tags.add(tag);
        });
    });
    return Array.from(tags);
}

function createTagCard(recipes, tag) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("border-0");
    card.classList.add("bg-body-secondary")

    const recipesWithTag = recipes.filter(recipe => recipe.tags.includes(tag));
    const numRecipes = recipesWithTag.length;

    if (numRecipes > 0) {
        let imgRecipe;
        if (numRecipes === 1) {
            imgRecipe = recipesWithTag[0].image;
        } else {
            const randomIndex = Math.floor(Math.random() * numRecipes);
            imgRecipe = recipesWithTag[randomIndex].image;
        }

        card.innerHTML = `
            <div class="card-body rounded card-img-wrapper position-relative p-0">
                <img src="${imgRecipe}" class="card-img-top img-zoom-shadow" alt="...">
                <span class="badge fs-2 bg-transparent tag-badge">${tag} (${numRecipes})</span>
            </div>
        `;

    } else {
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${tag} (0)</h5>
                <p>Aucune recette trouvée</p>
            </div>
        `;
    }

    return card;
}

function displayRecipesInPopup(recipes) {
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");

    const popup = document.createElement("div");
    popup.classList.add("popup");

    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.classList.add("close-button");
    closeButton.addEventListener("click", () => {
        popupContainer.remove();
    });

    const recipesContainer = document.createElement("div");
    recipesContainer.classList.add("recipes-container");
    recipesContainer.classList.add("row");
    recipesContainer.classList.add("row-cols-1");
    recipesContainer.classList.add("row-cols-md-3");

    recipes.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("p-0");
        card.classList.add("my-4");
        card.setAttribute("data-name", recipe.name);

        let starsHTML = generateStars(recipe.rating);

        card.innerHTML = `
            <img src="${recipe.image}" class="card-img-top" alt="...">
            <div class="card-body ${getDifficultyClass(recipe.difficulty)}">
                <h5 class="card-title">${recipe.name}</h5>
                <p class="card-text">Tags: ${recipe.tags.join(', ')}</p>
                <p class="card-text">Rating: ${starsHTML} ${recipe.rating}</p>
                <p class="card-text">Difficulty: ${recipe.difficulty}</p>
                <p class="card-text">Preparation Time: ${recipe.prepTimeMinutes} minutes</p>
                <button class="btn btn-primary btn-recipe">More</button>
            </div>
        `;

        card.setAttribute("data-name", recipe.name);
        const btnRecipe = card.querySelector(".btn-recipe");
        btnRecipe.addEventListener("click", (event) => {
            const name = event.target.closest(".card").getAttribute("data-name");
            window.location.href = "detail.html?name=" + name;
        });

        recipesContainer.appendChild(card);
    });

    popup.appendChild(closeButton);

    popup.appendChild(recipesContainer);

    popupContainer.appendChild(popup);

    document.body.appendChild(popupContainer);
}

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