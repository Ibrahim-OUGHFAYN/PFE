import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {useState,useEffect} from "react"
import UseUserStore from "../Store/UseUserStore"
const Contact = () => {
  const [loggedIn,setLoggedIn]=useState(false)
  const { user } = UseUserStore();
  useEffect(() => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [user]);
  return (
    <div id="contact">
      <div className="md:px-36 px-8 md:py-20 py-0 flex flex-col gap-4">
        <div className="mb-5">
          <h2 className="text-2xl text-center font-bold text-red-900">
            Contactez nous
          </h2>
        </div>
        {!loggedIn && (
          <>
            <div className="flex lg:flex-row flex-row grid-cols-2 gap-4">
              <Input placeholder="Nom" className=" hover:border-red-500"/>
              <Input placeholder="Prénom" className=" hover:border-red-500 focus:border-1"/>
            </div>
            <div>
              <Input placeholder="E-mail" className=" hover:border-red-500"/>
            </div>
          </>
        )}

        <div>
          <Textarea placeholder="Entrer votre message" className=" hover:border-red-500 "/>
        </div>
        <div>
          <Button className="bg-red-500 hover:bg-white border-1 border-red-500 hover:text-gray-500 transition duration-300 cursor-pointer">
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
