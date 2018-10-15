function foodCardBlueprint(id, foodName, foodImage, foodPrice) {
  return `
  <div class="food-card">
    <img class="food-image" src="${foodImage}" alt="${foodName}">
    <div class="food-details">
      <div data-foodid="${id}" class="food-details__legend">
        <h4>${foodName}</h4>
        <p>₦${foodPrice.toLocaleString()}</p>
      </div>
      <div class="food-details__action">
        <button>buy</button>
      </div>
    </div>
  </div>
  `;
}

const source = 'https://kiakiafood.herokuapp.com/api/v1/menu';

fetch(source)
  .then(data => data.json())
  .then(response => {
    const foodItems = response.menu
      .map(food => foodCardBlueprint(food.id, food.food_name, food.food_image, food.price))
      .join('');

    document.querySelector('section.food-menu').innerHTML = foodItems;
  })
  .catch((error) => {
    document.querySelector('section.food-menu').innerHTML = '';
    flashMessage('An error occured while fetching menu', 'error');
    console.error(error);
  });
