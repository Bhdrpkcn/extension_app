import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";

export const usePlaceholderAnimation = (
  placeholders: string[],
  interval = 3000
) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startAnimation = () => {
      intervalRef.current = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, interval);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible" && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else if (document.visibilityState === "visible") {
        startAnimation();
      }
    };

    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders, interval]);

  return placeholders[currentPlaceholder];
};

const Footer: React.FC = () => {
  const placeholders = [
    "Stay connected with us...",
    "We love feedback!",
    "Follow us on social media!",
    "Your ideas inspire us!",
  ];

  const currentPlaceholder = usePlaceholderAnimation(placeholders);

  return (
    <div className="footer-container">
      <div className="footer-animation">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPlaceholder}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -5, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="footer-placeholder-text"
          >
            {currentPlaceholder}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="footer-buttons">
        <Button shape="circle" icon={<SettingOutlined />} />
      </div>
    </div>
  );
};

export default Footer;
