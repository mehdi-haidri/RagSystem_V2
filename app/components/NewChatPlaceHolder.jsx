
import GradientText from "./Aurora/GradientText";

function NewChatPlaceHolder({ theme  , append ,createMessage , currentChat}){

  
  const suggestions = ["Hi !", "What can you do ?", "Explain this repport" ,"I would like to ask you a question about"];
  return (
    <>
      <div>
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={7}
          showBorder={false}
          className="text-2xl sm:text-4xl"
        >
        Hi, What can I help you with ?
        </GradientText>

        <div className="flex inline gap-4 flex-wrap justify-center mt-[10%]">
          {suggestions.map((suggestion, index) => (
            <div
              onClick={() => {
                createMessage("user",suggestion, currentChat);
                append({
                  role: "user",
                  content: suggestion,
                  id : crypto.randomUUID(),
              });
              }}
              key={index}
              className={`w-fit ${theme.suggestionText} text-nowrap inline p-2 alert ${theme.suggestionBackground} select-none border-none cursor-pointer  `}
            >
              <span>{suggestion}</span>
            </div>
          ))}
       
          
        </div>
      </div>
    </>
  );
}

export default NewChatPlaceHolder;
