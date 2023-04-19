import React, { useContext, useEffect, useState } from "react";
import { SERVER_ADDRESS } from "./constants";

const AppContext = React.createContext();

const allMealsUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const randomMealUrl = "https://www.themealdb.com/api/json/v1/1/random.php";
const getChildrenURL = "fs/level/";

const AppProvider = ({ children }) => {
  //Meals app
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  //SharedDoc app
  const [currentDocId, setCurrentDocId] = useState(null);
  const [document, setDocument] = useState(null);
  const [inodes, setINodes] = useState([]);
  const [selectedINode, setSelectedINode] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(
    localStorage.getItem("token") !== null
  );

  const getChildren = (inodeId) => {
    console.log("Get children nodes...");
    console.log(
      "Seding a post request to:" + SERVER_ADDRESS + getChildrenURL + inodeId
    );
    fetch(SERVER_ADDRESS + getChildrenURL + inodeId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((response) => {
        console.log("status" + response.status);
        return Promise.all([response.status, response.json()]);
      })
      .then(([status, body]) => {
        if (status == 200) {
          if (body) {
            setINodes(body);
          } else {
            setINodes([]);
          }
        } else {
          alert(body.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR: ${error}`);
      });
  };


  const fetchMeals = (allMealsUrl) => {
    setLoading(true);
    fetch(allMealsUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(meals);
        if (data.meals) {
          setMeals(data.meals);
        } else {
          setMeals([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const fetchRandomMeal = () => {
    fetchMeals(randomMealUrl);
  };

  const selectMeal = (idMeal, isFromFavorites) => {
    let meal;
    if (isFromFavorites) {
      meal = favorites.find((meal) => meal.idMeal === idMeal);
    } else {
      meal = meals.find((meal) => meal.idMeal === idMeal);
    }

    setSelectedMeal(meal);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const addToFavorites = (idMeal) => {
    const alreadyFavorite = favorites.find((meal) => meal.idMeal === idMeal);
    if (alreadyFavorite) return;
    const meal = meals.find((meal) => meal.idMeal === idMeal);
    const updatedFavorites = [...favorites, meal];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (idMeal) => {
    const updatedFavorites = favorites.filter((meal) => meal.idMeal !== idMeal);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    fetchMeals(allMealsUrl);
  }, []);

  useEffect(() => {
    if (!searchTerm) return;
    fetchMeals(`${allMealsUrl}${searchTerm}`);
  }, [searchTerm]);

  return (
    <AppContext.Provider
      value={{
        loading,
        meals,
        setSearchTerm,
        fetchRandomMeal,
        showModal,
        selectedMeal,
        selectMeal,
        closeModal,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isLoggedin,
        getChildren,
        inodes,
        selectedINode,
        setSelectedINode,
        currentDocId,
        setCurrentDocId,
        document,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
