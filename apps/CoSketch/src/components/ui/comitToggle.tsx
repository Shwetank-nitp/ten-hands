import { motion } from "framer-motion";

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  state: boolean;
}

const CommitToggle = ({ onClick, state, ...props }: ToggleProps) => {
  return (
    <button
      onClick={onClick}
      {...props}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        state ? "bg-gradient-to-tr from-green-500 to-violet-600" : "bg-gray-300"
      }`}
    >
      <motion.div
        animate={{
          translateX: state ? 24 : 0,
        }}
        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow flex justify-center items-center"
      ></motion.div>
    </button>
  );
};

export default CommitToggle;
