import { MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

const Nav = () => {
  const { selectiveConversation } = useSelector(
    (state) => state.conversation
  );
  const { messages } = useSelector(
    (state) => state.message
  );

  console.log("Selected Chat:", selectiveConversation);
  return (
    <div className="h-14 flex items-center gap-2.5 text-center justify-center px-4 border-b border-white/[0.06]">
      {
        selectiveConversation && (
          <>
            <div>
              <MessageSquare size={18} className='text-teal-200' />
            </div>
            <h2>
              {selectiveConversation?.title}
            </h2>
            <span className="ml-1.5 text-[9px] font-medium text-teal-300 bg-teal-500/20 px-1.5 py-0.5 rounded-full border border-teal-500/30">
              {messages?.length} Messages
            </span>

          </>
        )
      }

    </div>
  );
};

export default Nav;