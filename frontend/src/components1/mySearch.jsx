import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import bg from "../assets/Searchbg.png";

const mySearch = ({ ph, onSearch }) => {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div
      className="flex flex-col justify-center items-center border w-[90%] border-red-500 rounded-4xl h-40 bg-white shadow-2xl shadow-red-100 bg-no-repeat bg-cover bg-right"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex flex-row w-[90%] gap-4">
        <div className="relative w-full">
          <Input
            placeholder={ph}
            onChange={handleChange}
            className="h-11 border-1 border-red-500 bg-red-50 hover:bg-white pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default mySearch;
