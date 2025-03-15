import GradientText from "./Aurora/GradientText";

function NewChatPlaceHolder({ theme }) {
  return (
    <>
      <div>
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={7}
          showBorder={false}
          className="custom-class text-4xl "
        >
        Hi, What can I help you with ?
        </GradientText>

        <div className="flex inline gap-4 flex-wrap justify-center mt-[10%]">
          <div
            className={`w-fit ${theme.suggestionText} text-nowrap inline p-2 alert ${theme.suggestionBackground} select-none border-none cursor-pointer  `}
          >
            <span>Hi !</span>
          </div>
          <div
            className={`w-fit ${theme.suggestionText} text-nowrap inline p-2 alert ${theme.suggestionBackground} select-none border-none cursor-pointer `}
          >
            <span>What can you do </span>
          </div>
          <div
            className={`w-fit ${theme.suggestionText} text-nowrap inline p-2 alert ${theme.suggestionBackground} select-none border-none cursor-pointer  `}
          >
            <span>Explain this repport </span>
          </div>
          <div
            className={`w-fit ${theme.suggestionText} text-nowrap inline p-2 alert ${theme.suggestionBackground} select-none border-none cursor-pointer `}
          >
            <span>
              I would like to ask you a question about 
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewChatPlaceHolder;
