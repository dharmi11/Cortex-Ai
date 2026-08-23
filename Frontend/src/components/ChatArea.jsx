import React, { useEffect } from 'react'
import Nav from './Nav'

import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import { setArtifact, setMessages } from '../redux/message.slice'
import { getMessage } from '../features/getMessage'
import MessageList from './MessageList'


const ChatArea = () => {

  const dispatch = useDispatch();
  const { selectiveConversation } = useSelector(
    (state) => state.conversation
  );

  useEffect(() => {
    const getmes = async () => {
      if (!selectiveConversation?._id) {
        dispatch(setMessages([]));
        return;
      }

      if (selectiveConversation.title === "New Chat") {
        dispatch(setMessages([]));   // <-- clear old messages
        return;
      }

      const data = await getMessage(selectiveConversation._id);
      dispatch(setMessages(data));

      const latestArtifact = [...data]
        .reverse()
        .find(
          (msg) =>
            msg.artifacts &&
            msg.artifacts.length > 0
        );

      dispatch(setArtifact(latestArtifact?.artifacts?.[0] || null));
      console.log("🔥 FULL DATA:", data);
      console.log("🔥 IS ARRAY:", Array.isArray(data));
      console.log("🔥 FIRST ITEM:", data?.[0]);
      console.log("🔥 FIRST ARTIFACT:", data?.[0]?.artifacts);
    };

    getmes();

  }, [selectiveConversation?._id]);

  return (
    <div className="flex-1 flex flex-col min-h-0">   {/* ← flex-1 + min-h-0 */}
      <Nav />
      <MessageList />   {/* ← now fills remaining space */}
      <ChatInput />
    </div>
  )
}

export default ChatArea
