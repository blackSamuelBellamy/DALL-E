import React from "react";
import { useState, useEffect } from "react";
import { Card, FormField, Loader } from "../components";
import { motion } from "framer-motion";
import axios from "axios";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("community") === null) {
      setLoading(true);
      axios
        .get(import.meta.env.VITE_API + "/api/v1/post")
        .then((res) => {
          localStorage.setItem("community", JSON.stringify(res));
          const result = JSON.parse(
            localStorage.getItem("community")
          ).data.reverse();
          setAllPosts(result);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else {
      const result = JSON.parse(
        localStorage.getItem("community")
      ).data.reverse();
      setAllPosts(result);
    }
  }, []);

  const RenderCars = ({ data, title }) => {
    if (data?.length > 0) return data.map((x) => (   
      <Card key={x.id} {...x} />    
    ));
    return (
      <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">
        {title}
      </h2>
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter(
          (x) =>
            x.name.toLowerCase().includes(searchText.toLowerCase()) ||
            x.prompt.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchResults);
      }, 500)
    );
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222] text-[32px]">
          Las imagenes de la comunidad
        </h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
          Navega a través de una colección de imagenes imaginativas con la API
          de DALL-E IA
        </p>
      </div>
      <div className="mt-16">
        <FormField
          labelName="Buscar Post"
          type="text"
          name="text"
          placeholder="Buscar Post"
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>
      <div>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Mostrando resultados de:
                <span className="text-[#222328]"> {searchText}</span>
              </h2>
            )}
            <div className="grid lg:gird-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3 mt-9">
              {searchText ? (
                <RenderCars
                  data={searchedResults}
                  title="No se encontraron Posts"
                />
              ) : (
                <RenderCars data={allPosts} title="No se encontraron Posts" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
