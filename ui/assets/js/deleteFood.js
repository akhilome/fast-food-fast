function deleteFoodItem(e) {
  if (!e.target.matches('.food-details__action > button')) return;
  flashMessage('deleting selected item ...');

  const foodCard = e.target.parentNode.parentNode.parentNode;
  const foodId = Number(e.target.parentNode.previousElementSibling.dataset.foodid);

  fetch(`https://kiakiafood.herokuapp.com/api/v1/menu/${foodId}`, {
    method: 'DELETE',
    headers: { 'x-auth': token },
  }).then(data => data.json())
    .then((response) => {
      if (response.status !== 'success') {
        flashMessage(response.message, 'error');
        return;
      }
      foodCard.remove();
      flashMessage('food item removed', 'success');
    })
    .catch((error) => {
      console.error(error);
      flashMessage('an error occured while removing that food item', 'error');
    });
}

document.querySelector('.admin-menu').addEventListener('click', deleteFoodItem);
