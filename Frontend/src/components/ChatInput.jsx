import { Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, Paperclip, Presentation, Send, Zap } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../features/sendmessage';
import { addMessage, setArtifact, setIsLoading, setMessages } from '../redux/message.slice';
import { createConversation } from '../features/createConversation';
import { addConversation, setConvTitle, setSelectiveConversation } from '../redux/conversation.slice'
import { updateConversation } from '../features/updateConversation';

const ChatInput = () => {

  const [value, setValue] = useState("")
  const [selectiveAgent, setSelectiveAgent] = useState("Auto")
  const [isListening, setIsListening] = useState(false)
  const { selectiveConversation } = useSelector(
    (state) => state.conversation
  );
  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch()
  const recognitionRef = useRef(null)

  const handleSendMessage = async () => {
    dispatch(setIsLoading(true))

    let conversation = selectiveConversation
    if (!conversation) {
      const newConv = await createConversation()
      dispatch(setSelectiveConversation(newConv))
      dispatch(addConversation(newConv))
      conversation = newConv
    }


    const payload = {
      prompt: value.trim(),
      conversationId: conversation?._id,
      agent: selectiveAgent.toLowerCase()
    }
    const text = value.trim();

    if (!text) return;

    if (conversation.title === "New Chat") {
      console.log("✅ Inside update block");

      const updated = await updateConversation({
        id: conversation._id,
        title: value,
      });

      console.log("Updated Conversation:", updated);

      dispatch(
        setConvTitle({
          conversationId: conversation._id,
          title: value,
        })
      );
    }

    dispatch(
      addMessage({
        role: "user",
        content: value,
      })
    );

    setValue("");

    const data = await sendMessage({
      prompt: value,
      conversationId: conversation._id,
      agent: selectiveAgent.toLowerCase(),
    });
    dispatch(setIsLoading(false))
    if (!data) return;
    dispatch(setArtifact(data.artifacts || []))
    dispatch(
      addMessage({
        role: "assistant",
        content: data.answer,
        images: data.Image,
      })
    );
  }
  // console.log("chat input ", selectiveConversation);

  const agent = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto"
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat"
    }, {
      id: "coding",
      icon: Code2,
      label: "Coding"
    }, {
      id: "PDF",
      icon: FileText,
      label: "PDF"
    }, {
      id: "ppt",
      icon: Presentation,
      label: "PPT"
    },
    {
      id: "vision",
      icon: ImageIcon,
      label: "Vision"
    },
    {
      id: "search",
      icon: Globe,
      label: "Search"
    },
  ]


  const Icon = agent.icon;

  const handleMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      // Only process NEW results
      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }

      if (transcript.trim()) {
        setValue((prev) =>
          prev.trim()
            ? `${prev.trim()} ${transcript.trim()}`
            : transcript.trim()
        );
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  return (
    <div className='w-full overflow-hidden px-3 md:px-5 py-4 border-t  border-white/[0.06] bg-[#0d0f14] '>

      <div className='flex flex-col gap-2 bg-white/[0.04] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3'>

        <div className='flex w-[80%] gap-2 pr-2 flex-wrap'>
          {agent.map((item) => {
            const isActive = selectiveAgent === item.label;
            const Icon = item.icon;

            return (
              <div
                onClick={() => setSelectiveAgent(item.label)}
                key={item.id}
                className={`flex-shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all
      ${isActive
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent"
                    : "bg-white/[0.03] text-slate-400 border-white/[0.06]"
                  }`}
              >
                <Icon
                  size={14}
                  className={isActive ? "text-white" : "text-slate-500"}
                />

                {item.label}
              </div>
            );
          })}

        </div>
        <textarea
          placeholder='Ask Anything....'
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className='w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50 
      ' rows={2}
        />
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 
          hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover-border-white/[0.05]
          transition-all duration-150 bg-transparent cursor-pointer    ' >
              <Paperclip size={18} />

            </button>
            <button
              onClick={handleMic}
              className={`flex items-center justify-center w-8 h-8 rounded-lg 
    border transition-all duration-150 cursor-pointer
    ${isListening
                  ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
                  : "text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border-transparent"
                }
  `}
            >
              <Mic size={18} />
            </button>
          </div>

          <button
            disabled={value.length === 0}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer duration-150 ${value.trim().length > 0
              ? "bg-gradient-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white"
              : "bg-white/[0.05] text-slate-600 cursor-not-allowed"
              }`} >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div >
  )
}

export default ChatInput
