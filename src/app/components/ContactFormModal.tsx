import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMode } from "./ModeContext";
import { X } from "lucide-react";

const CONTACT_EMAIL = "alaa@alaa-ali.com";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const { isProfessional } = useMode();
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const subject = encodeURIComponent(`Portfolio Contact from ${formData.from_name}`);
      const body = encodeURIComponent(
        `Hi Ala'a,\n\nName: ${formData.from_name}\nEmail: ${formData.from_email}\n\n${formData.message}`
      );
      const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

      // Small delay so user sees "Sending..." feedback
      await new Promise((resolve) => setTimeout(resolve, 400));

      window.open(mailtoLink, "_blank");
      setStatus("sent");
      setFormData({ from_name: "", from_email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const resetAndClose = () => {
    setStatus("idle");
    setFormData({ from_name: "", from_email: "", message: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={resetAndClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-[#fdecd0] w-full max-w-[480px] max-h-[90vh] overflow-y-auto border border-black shadow-[4px_4px_0px_0px_black] p-6 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* Title */}
            <h2 className="font-['Playfair_Display'] font-bold text-[24px] md:text-[28px] text-black mb-1">
              {isProfessional ? "Let's Talk" : "Yooo, Say Hi!"}
            </h2>
            <p className="font-['Work_Sans'] font-light text-[14px] md:text-[15px] text-black/60 mb-6">
              {isProfessional
                ? "Fill out the form and I'll get back to you soon."
                : "Drop me a message, I promise I don't bite (usually)."}
            </p>

            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="w-16 h-16 rounded-full bg-[#53B858]/20 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#53B858" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-['Playfair_Display'] font-bold text-[20px] text-black">
                  {isProfessional ? "Message Sent!" : "Woohoo, Got It!"}
                </h3>
                <p className="font-['Work_Sans'] font-light text-[14px] text-black/60 text-center">
                  {isProfessional
                    ? "Thanks for reaching out. I'll get back to you shortly."
                    : "I'll read it with my morning coffee. Talk soon!"}
                </p>
                <button
                  onClick={resetAndClose}
                  className="mt-2 bg-white px-6 py-3 font-['DM_Serif_Display'] text-[17px] text-black border border-black shadow-[4px_4px_0px_0px_black] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_black] transition-all"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-['DM_Serif_Display'] text-[15px] text-black">
                    {isProfessional ? "Your Name" : "What Should I Call You?"}
                  </label>
                  <input
                    type="text"
                    name="from_name"
                    value={formData.from_name}
                    onChange={handleChange}
                    required
                    placeholder={isProfessional ? "Jane Doe" : "Batman, maybe?"}
                    className="bg-white border border-black px-4 py-3 font-['Work_Sans'] text-[15px] text-black placeholder:text-black/30 outline-none focus:shadow-[3px_3px_0px_0px_#ff614c] transition-shadow"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-['DM_Serif_Display'] text-[15px] text-black">
                    {isProfessional ? "Your Email" : "Email (I Won't Spam, Promise)"}
                  </label>
                  <input
                    type="email"
                    name="from_email"
                    value={formData.from_email}
                    onChange={handleChange}
                    required
                    placeholder={isProfessional ? "jane@example.com" : "notspam@please.com"}
                    className="bg-white border border-black px-4 py-3 font-['Work_Sans'] text-[15px] text-black placeholder:text-black/30 outline-none focus:shadow-[3px_3px_0px_0px_#ff614c] transition-shadow"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-['DM_Serif_Display'] text-[15px] text-black">
                    {isProfessional ? "Message" : "Speak Your Mind"}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder={isProfessional ? "Tell me about your project..." : "Tell me something cool..."}
                    className="bg-white border border-black px-4 py-3 font-['Work_Sans'] text-[15px] text-black placeholder:text-black/30 outline-none focus:shadow-[3px_3px_0px_0px_#ff614c] transition-shadow resize-none"
                  />
                </div>

                {/* Error message */}
                {status === "error" && (
                  <p className="font-['Work_Sans'] text-[13px] text-[#ff614c]">
                    {isProfessional
                      ? "Something went wrong. Please try again or email me directly at alaa@alaa-ali.com"
                      : "Oops, the internet gremlins got in the way. Try again or just email me at alaa@alaa-ali.com"}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="self-start bg-[#ff614c] text-white px-8 py-3 font-['DM_Serif_Display'] text-[17px] border border-black shadow-[4px_4px_0px_0px_black] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_black] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending"
                    ? "Sending..."
                    : isProfessional
                      ? "Send Message"
                      : "Yalla, Send It!"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}