import React from 'react';
import { useSelector } from 'react-redux';
import {
  Sparkles,
  Code2,
  Lightbulb,
  LayoutGrid,
  Rocket,
} from 'lucide-react';
import MessageBubble from './MessageBubble';
import AILoadingAnimation from './AILoadingAnimation';

const MessageList = () => {
  const { selectiveConversation } = useSelector((state) => state.conversation);
  const { messages , isLoading } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);

  const showWelcome = !selectiveConversation;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0d0d0f] text-gray-200 relative overflow-hidden p-6">

      {/* Background decorations (unchanged) */}
      <div className="absolute top-[-120px] right-[-80px] w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-60px] w-80 h-80 rounded-full bg-cyan-500/8 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      {showWelcome ? (
        // ----- WELCOME UI (100% unchanged) -----
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="max-w-3xl w-full text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-2xl shadow-emerald-500/20 mb-6">
              <Sparkles className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
              Hello - {' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {userData?.name || 'Guest'}
              </span>{' '}
              👋
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-light mt-1">
              Welcome back to <span className="text-white font-medium">CortexAI</span>
            </p>

            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mt-4 opacity-60" />

            <p className="text-gray-400/80 text-sm md:text-base max-w-lg mx-auto mt-5 leading-relaxed">
              Ask me anything — code, ideas, explanations, or just a quick question.
              <br className="hidden sm:inline" />
              <span className="text-gray-500">I'm here to help you think, create, and build.</span>
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
              <div className="rounded-2xl px-4 py-4 text-center bg-white/5 backdrop-blur-sm border border-white/5 hover:border-emerald-500/30 hover:-translate-y-1.5 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2.5">
                  <Code2 className="w-5 h-5" />
                </div>
                <h4 className="text-white text-sm font-medium">Learn & Build</h4>
                <p className="text-gray-500 text-xs mt-0.5">Master new skills</p>
              </div>
              <div className="rounded-2xl px-4 py-4 text-center bg-white/5 backdrop-blur-sm border border-white/5 hover:border-cyan-500/30 hover:-translate-y-1.5 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2.5">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <h4 className="text-white text-sm font-medium">Code & Debug</h4>
                <p className="text-gray-500 text-xs mt-0.5">Write cleaner code</p>
              </div>
              <div className="rounded-2xl px-4 py-4 text-center bg-white/5 backdrop-blur-sm border border-white/5 hover:border-violet-500/30 hover:-translate-y-1.5 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto mb-2.5">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h4 className="text-white text-sm font-medium">Generate Ideas</h4>
                <p className="text-gray-500 text-xs mt-0.5">Spark creativity</p>
              </div>
              <div className="rounded-2xl px-4 py-4 text-center bg-white/5 backdrop-blur-sm border border-white/5 hover:border-amber-500/30 hover:-translate-y-1.5 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2.5">
                  <Rocket className="w-5 h-5" />
                </div>
                <h4 className="text-white text-sm font-medium">Build Apps</h4>
                <p className="text-gray-500 text-xs mt-0.5">Like Netflix & more</p>
              </div>
            </div>

            {/* Suggestion Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-7">
              <span className="text-xs text-gray-500 font-medium mr-1">Try:</span>
              <button className="rounded-full px-4 py-1.5 text-xs text-gray-300 bg-white/5 border border-white/5 hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all">
                Explain React hooks
              </button>
              <button className="rounded-full px-4 py-1.5 text-xs text-gray-300 bg-white/5 border border-white/5 hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all">
                Write a Python script
              </button>
              <button className="rounded-full px-4 py-1.5 text-xs text-gray-300 bg-white/5 border border-white/5 hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all">
                Design a login page
              </button>
              <button className="rounded-full px-4 py-1.5 text-xs text-gray-300 bg-white/5 border border-white/5 hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all">
                Debug this error
              </button>
              <button className="rounded-full px-4 py-1.5 text-xs text-gray-300 bg-white/5 border border-white/5 hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all">
                Build a Netflix clone
              </button>
            </div>

            {/* Bottom status */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
                Online
              </span>
              <span>·</span>
              <span>⚡ 2.5k requests today</span>
              <span>·</span>
              <span>🧠 v3.2.0</span>
            </div>
          </div>
        </div>
      ) : (
        // ----- MESSAGE LIST (scrollable, with visible scrollbar) -----
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 sidebar-scrollbar">
          {/* pr-2/-mr-2 prevents scrollbar from covering content */}
          <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-3">
            {Array.isArray(messages) &&
              messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  images = {msg.images || []}
                />
              ))}
              {isLoading && <AILoadingAnimation /> }
              
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;