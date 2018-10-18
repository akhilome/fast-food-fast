const foodForm = document.querySelector('form');

function addNewFood(e) {
  e.preventDefault();
  flashMessage('Adding food to menu ...');
  const formData = {
    foodName: foodForm['food-item'].value,
    foodImage: foodForm['food-image'].value,
    price: foodForm['food-price'].value,
  };

  fetch('https://kiakiafood.herokuapp.com/api/v1/menu', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token,
    },
    body: JSON.stringify(formData),
  }).then(data => data.json())
    .then((response) => {
      if (response.status !== 'success') return flashMessage(response.message, 'error');

      window.location = 'admin-menu.html';
      return flashMessage('Food added!', 'success');
    })
    .catch((error) => {
      console.error(error);
      flashMessage('Something went wrong while new food item', 'error');
    });
}

foodForm.addEventListener('submit', addNewFood);
