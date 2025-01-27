interface LabelProps {
  children: React.ReactNode;
}

export const Label = ({ children, ...props }: LabelProps) => {
  return (
    <div {...props} className="bg-gray-100 rounded-full py-2 px-4 w-fit m-auto">
      <span className="font-medium text-sm text-gray-800 flex gap-x-1 justify-center items-center">
        {children}
      </span>
    </div>
  );
};
