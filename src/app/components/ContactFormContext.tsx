/*
 * "Open contact" used to open a modal form. Now it takes you to the postcard
 * on /contact, which is the one way to write to me on this site.
 */
import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router";
import { addScore } from "./play/Score";

interface ContactFormContextType {
  isContactOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
}

const ContactFormContext = createContext<ContactFormContextType>({ isContactOpen: false, openContact: () => {}, closeContact: () => {} });

export function ContactFormProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <ContactFormContext.Provider
      value={{
        isContactOpen: false,
        openContact: () => {
          addScore(25, "headed to the postcard", "contact:open", true);
          navigate("/contact");
          setTimeout(() => document.getElementById("postcard")?.scrollIntoView({ behavior: "smooth", block: "center" }), 450);
        },
        closeContact: () => {},
      }}
    >
      {children}
    </ContactFormContext.Provider>
  );
}

export function useContactForm() {
  return useContext(ContactFormContext);
}
