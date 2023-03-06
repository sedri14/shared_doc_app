import React from "react";

const Footer = () => {
  var today = new Date();

  return (
    <footer className="container">
      <div className=" section row justify-content-center mt-3 mb-4">
        <div className="col-8">
          <p>Footer - {today.getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
