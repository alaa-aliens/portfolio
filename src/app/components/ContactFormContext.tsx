import { addScore } from "./play/Score";
import React, { createContext, useContext, useState } from "react";

interface ContactFormContextType {
  isContactOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
}

const ContactFormContext = createContext<ContactFormContextType>({
  isContactOpen: false,
  openContact: () => {},
  closeContact: () => {},
});

export function ContactFormProvider({ children }: { children: React.ReactNode }) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  return (
    <ContactFormContext.Provider
      value={{
        isContactOpen,
        openContact: () => {
          setIsContactOpen(true);
          addScore(25, "opened the contact form", "contact:open", true);
        },
        closeContact: () => setIsContactOpen(false),
      }}
    >
      {children}
    </ContactFormContext.Provider>
  );
}

export function useContactForm() {
  return useContext(ContactFormContext);
}
