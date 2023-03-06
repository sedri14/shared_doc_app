import { useGlobalContext } from "../context";
import { BsHandThumbsUp } from "react-icons/bs";

const Meals = () => {
  const { loading, meals, selectMeal, addToFavorites, removeFromFavorites } =
    useGlobalContext();

  if (loading) {
    console.log("Loading value:" + loading);
    return (
      <section className="section">
        <h1>Loading...</h1>
      </section>
    );
  }

  if (meals.length < 1) {
    console.log("No meals found");
    return (
      <section className="section">
        <h4>No Meals Matched Your Search Terms.</h4>
      </section>
    );
  }

  return (
    <section className="section-center">
      {meals.map((singleMeal) => {
        const { idMeal, strMeal: title, strMealThumb: image } = singleMeal;
        return (
          <article key={idMeal} className="single-meal">
            <img
              src={image}
              style={{ width: "200px" }}
              className="img"
              onClick={() => selectMeal(idMeal)}
            />
            <footer>
              <h5>{title}</h5>
              <button
                className="like-btn"
                onClick={() => {
                  addToFavorites(idMeal);
                }}
              >
                <BsHandThumbsUp />
              </button>
            </footer>
          </article>
        );
      })}
    </section>
  );
};
export default Meals;
