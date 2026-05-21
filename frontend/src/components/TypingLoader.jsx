const TypingLoader = () => {

  return (

    <div className="flex justify-start">

      <div
        className="
          bg-[#444654]
          px-5
          py-4
          rounded-2xl
          rounded-bl-md
          flex
          items-center
          gap-2
          shadow-lg
        "
      >

        <span
          className="
            w-2
            h-2
            bg-white
            rounded-full
            animate-bounce
          "
        ></span>

        <span
          className="
            w-2
            h-2
            bg-white
            rounded-full
            animate-bounce
            [animation-delay:0.2s]
          "
        ></span>

        <span
          className="
            w-2
            h-2
            bg-white
            rounded-full
            animate-bounce
            [animation-delay:0.4s]
          "
        ></span>

      </div>

    </div>

  );
};

export default TypingLoader;