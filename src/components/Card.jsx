import React from "react";
import { download } from "../assets";
import { downloadImage } from "../utils";
import { motion } from "framer-motion";
import "./card.css";

const Card = ({ id, name, prompt, photo }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, translateX: -100 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="realtive boxCard rounded-xl group relative shadow-card hover:shadow-cardhover card"
    >
      <img
        className="w-full h-auto object-cover rounded-xl"
        src={photo}
        alt={prompt}
      />
      <div
        className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f]
      m-2 p-4 rounded-md z-30"
      >
        <p className="text-[#fff] text-md overflow-y-auto text-center">
          {prompt}
        </p>
        <div className="mt-5 flex justify-between items-center gap-2">
          <di className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full bg-green-700 flex justify-center items-center object-cover text-white
            text-xs font-bold"
            >
              {name[0]}
            </div>
            <p className="text-white text-sm">{name}</p>
          </di>
          <button
            type="button"
            onClick={() => downloadImage(id, photo)}
            className="outline-none bg-transparent border-none"
          >
            <img
              src={download}
              alt="download"
              className="w-6 h-6 object-contain invert"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
