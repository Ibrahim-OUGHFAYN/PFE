import React from "react";
import Hero from "./components1/Hero";
import About from "./components1/About";
import Services from "./components1/Services";
import Contact from "./components1/Contact"

const Home = () => {
  return (
    <>
      <Hero></Hero>
      <div id="services">
        <Services />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="Contact">
        <Contact />
      </div>
    </>
  );
};

export default Home;
