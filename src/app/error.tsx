'use client'
interface ErrorProp {
  error: Error;
  reset: () => void;
}

const Error: React.FC<ErrorProp> = ({ reset, error }) => {
  console.log(error);
  return (
    <>
      <h1 className="bg-slate-400 text-black">{JSON.stringify(error)}</h1>
    </>
  );
};

export default Error;
