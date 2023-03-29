import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Preview from "../assets/preview.png";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";
import Swal from "sweetalert2";
import axios from "axios";

const CreatePost = () => {
  const Navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);
      axios
        .post(import.meta.env.VITE_API + "/api/v1/post", JSON.stringify(form), {
          headers: { "Content-type": "application/json" },
          timeout: 10000,
        })
        .then(() => {
          Navigate("/");
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Hubo un error inesperado",
            text: "Intenta otra vez",
            timer: 1800,
            showConfirmButton: false,
          });
        })
        .finally(() => setLoading(false));
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = () => {
    if (form.prompt) {
      setGeneratingImg(true);
      axios
        .post(
           import.meta.env.VITE_API + "/api/v1/dalle",
          JSON.stringify({ prompt: form.prompt }),
          { headers: { "Content-Type": "application/json" }, timeout: 10000 }
        )
        .then((res) => {
          setForm({
            ...form,
            photo: `data:image/jpeg;base64,${res.data.photo}`,
          });
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Hubo un error inesperado",
            text: "Intenta otra vez",
            timer: 1800,
            showConfirmButton: false,
          });
        })
        .finally(() => setGeneratingImg(false));
    } else {
      Swal.fire({
        icon: "info",
        title: "Debes Llenar el prompt",
        showConfirmButton: false,
        timer: 1800,
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
          Create imaginative and visually stunning images Through DALL-E AI and
          share them with the community
        </p>
      </div>
      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A centered explosion of colorful powder on a black background"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div
            className="relative bg-gray-50 border border-gray-300 -text-gray-900 text-sm rounded-lg
           focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center"
          >
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                className="h-9/12 w-9/12 object-contain opacity-40"
                src={Preview}
                alt="NotFound"
              />
            )}
            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-blue-600 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>
        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            You have created the image you want, you can share it with others in
            the community
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#068441] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Sharing..." : "Share with the community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
