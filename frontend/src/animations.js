// Reusable tactile button animation (premium feel)
export const tactileButton = {
  whileHover: {
    y: -1,
    boxShadow: "0px 6px 16px rgba(0,0,0,0.15)",
  },
  whileTap: {
    y: 1,
    scale: 0.97,
    boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
  },
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 22,
  },
};
