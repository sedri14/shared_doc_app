import { useGlobalContext } from "../context";

const Favorites = () => {
  const { favorites, selectMeal, removeFromFavorites } = useGlobalContext();
  return (
    <section className="favorites">
      <div className="favorites-content">
        <h4>Favorites</h4>
        <div className="favorites-container">
          {favorites.map((favorite) => {
            const { idMeal, strMealThumb: image } = favorite;
            return (
              <div key={idMeal} className="favorite-item">
                <img
                  src={image}
                  className="img favorite-img"
                  onClick={() => selectMeal(idMeal, true)}
                />
                <button
                  className="remove-btn"
                  onClick={() => removeFromFavorites(idMeal)}
                >
                  remove
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Favorites;
