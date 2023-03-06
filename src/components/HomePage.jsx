import React, { useState } from "react";
import { useGlobalContext } from "../context";

const HomePage = () => {
  const { isLoggedin } = useGlobalContext();

  if (isLoggedin) {
    console.log("User is not logged in");
    return (
      <section className="section">
        <h1>User connected</h1>
      </section>
    );
  } else {
    return (
      <main className="container">
        <div className="row justify-content-center mt-3 mb-4">
          <div className="col-8">
            <h1 className="text-danger">HomePage</h1>
            <h2>Welcome to shared doc app!</h2>
          </div>
        </div>
      </main>
    );
  }
};

export default HomePage;
