import React, { useEffect, useState } from 'react';
import {
    Menu,
    PanelRightClose,
    Plus,
    MessageSquare,
    Trash2,
    Settings,
    LogOut,
    User,
    Clock,
    Search,
    Star,
    MoreHorizontal,
    Code2Icon,
    CoinsIcon,
} from 'lucide-react';
import { FaRobot } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { addConversation, setConversations, setSelectiveConversation } from '../redux/conversation.slice';
import { createConversation } from '../features/createConversation';
import { getConversation } from '../features/getConversation';
import BillingDrewer from './BillingDrewer';
import api from '../../utils/axios';
import { clearUser } from '../redux/user.slice';

// Helper: group conversations by date
const groupConversationsByDate = (conversations) => {
    const groups = { today: [], yesterday: [], previous7Days: [], older: [] };
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    conversations.forEach((conv) => {
        const createdAt = new Date(conv.createdAt);
        if (createdAt >= todayStart) groups.today.push(conv);
        else if (createdAt >= yesterdayStart) groups.yesterday.push(conv);
        else if (createdAt >= weekStart) groups.previous7Days.push(conv);
        else groups.older.push(conv);
    });
    return groups;
};

// Helper: format date to relative time
const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
};

const Sidebar = () => {
    const dispatch = useDispatch();
    const { conversation, selectiveConversation } = useSelector((state) => state.conversation); // array of conversations
    const { userData } = useSelector((state) => state.user);
    const [isOpen, setIsOpen] = useState(true);
    const [activeChat, setActiveChat] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showbilling , setShowBilling]  = useState(false)

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getConversation();
                dispatch(setConversations(data));

                console.log("side data", data);
            } catch (error) {
                console.error('Failed to fetch conversations:', error);
            }
        };
        fetchConversations();
    }, [dispatch]);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleNewChat = async () => {
        try {
            const newConv = await createConversation();

            dispatch(addConversation(newConv));
            dispatch(setSelectiveConversation(newConv)); // <-- Missing

            setActiveChat(newConv._id);
            if (window.innerWidth < 1024) setIsOpen(false);
        } catch (error) {
            console.error('Failed to create conversation:', error);
        }
    };

    const handleChatClick = (chat) => {
        setActiveChat(chat._id);
        dispatch(setSelectiveConversation(chat))
        console.log("Clicked Chat:", chat);
        if (window.innerWidth < 1024) setIsOpen(false);

    };

    const handleDeleteChat = async (e, id) => {
        e.stopPropagation();
        try {
            await deleteConversation(id);
            dispatch(deleteConversation(id));
            if (activeChat === id) setActiveChat(null);
        } catch (error) {
            console.error('Failed to delete conversation:', error);
        }
    };
const handleLogout = async () => {
    try {
        const { data } = await api.get("/api/auth/logout");

        console.log("Logout:", data);

        // Clear frontend user state
        dispatch(clearUser());
          window.location.href = "/";
        // Go to login
        // navigate("/login");

    } catch (error) {
        console.log(
            "Error in handleLogout",
            error.response?.data || error.message
        );
    }
};

    const filterChats = (chats) =>
        chats.filter((chat) =>
            chat.title?.toLowerCase().includes(searchTerm.toLowerCase()) // use title
        );

    const groupedConversations = conversation ? groupConversationsByDate(conversation) : { today: [], yesterday: [], previous7Days: [], older: [] };

    return (
        <>
            {/* ===== MINI HEADER BAR – Visible only when sidebar is CLOSED ===== */}
            {!isOpen && (
                <div className="fixed left-0 top-0 z-50 h-screen w-14 bg-[#0d0f14]/90 backdrop-blur-md border-r border-white/[0.06] flex flex-col items-center pt-4 gap-4">

                    <button
                        onClick={toggleSidebar}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <Menu size={22} />
                    </button>


                    <button
                        onClick={toggleSidebar}
                        className="text-slate-400 hover:text-white transition-colors"
                        aria-label="Search"
                    >
                        <Search size={20} />
                    </button>

                    <button
                        onClick={handleNewChat}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <Plus size={20} />
                    </button>

                    {/* <div className="ml-auto flex items-center gap-2">
                        <span className="text-[15px] font-bold text-white tracking-tight">
                            Cortex<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">AI</span>
                        </span>
                        <span className="text-[9px] font-medium text-teal-300 bg-teal-500/20 px-1.5 py-0.5 rounded-full border border-teal-500/30">
                            v2.0
                        </span>
                    </div> */}
                </div>
            )}

            {/* ===== SIDEBAR ===== */}

            <div
                className={`
    h-screen
    flex flex-col
    transition-all duration-300
    overflow-hidden
    ${isOpen ? "w-[280px]" : "w-0"}
  `}
            >

                {/* Sidebar Header */}
                <div className="flex items-center gap-2.5 px-4 h-[60px] shrink-0 border-b border-white/[0.06]">
                    {/* Close button – only when open */}
                    <button
                        onClick={toggleSidebar}
                        className="text-slate-400 hover:text-white transition-colors mr-1"
                        aria-label="Close sidebar"
                    >
                        <PanelRightClose size={20} />
                    </button>

                    <div className="relative">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-400 via-cyan-400 to-emerald-400 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.2)] animate-pulse-slow">
                            <FaRobot size={16} className="text-white drop-shadow-md" />
                        </div>
                    </div>

                    <div className="flex items-baseline">
                        <span className="text-[16px] font-bold text-white tracking-tight">
                            Cortex<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">AI</span>
                        </span>
                        <span className="ml-1.5 text-[9px] font-medium text-teal-300 bg-teal-500/20 px-1.5 py-0.5 rounded-full border border-teal-500/30">
                            v2.0
                        </span>
                    </div>

                    <div className="ml-auto flex items-center gap-1.5">
                        <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 rounded-full tracking-wide">
                            free
                        </span>
                        <button className="text-slate-400 hover:text-white transition-colors p-1">
                            <Star size={16} />
                        </button>
                    </div>
                </div>

                {/* New Chat Button */}
                <div className="px-3 pt-3 pb-2 shrink-0">
                    <button
                        onClick={handleNewChat}
                        om
                        className="group relative flex items-center justify-center gap-2.5 w-full py-2.5 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg shadow-black/20 border border-white/5 hover:border-white/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d24] via-[#2c303a] to-[#1a1d24] animate-shimmer" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2c303a]/0 via-white/5 to-[#2c303a]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative flex items-center gap-2.5">
                            <div className="p-1.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                                <Plus size={18} className="text-slate-300 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-[14px] font-semibold text-slate-200 group-hover:text-white transition-colors">
                                New Conversation
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 border border-white/10 px-2 py-0.5 rounded-full bg-white/5">
                                ⌘K
                            </span>
                        </div>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-3 pb-2 shrink-0">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 text-sm text-slate-200 placeholder-slate-500 transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 sidebar-scrollbar" style={{ height: '0px' }}>
                    {Object.entries(groupedConversations).map(([section, chats]) => {
                        const filtered = filterChats(chats);
                        if (filtered.length === 0) return null;
                        return (
                            <div key={section}>
                                <div className="flex items-center gap-2 px-2 pb-1">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        {section === 'today' ? 'Today' :
                                            section === 'yesterday' ? 'Yesterday' :
                                                section === 'previous7Days' ? 'This Week' : 'Older'}
                                    </span>
                                    <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                                    <span className="text-[10px] text-slate-600">{filtered.length}</span>
                                </div>
                                <div className="space-y-0.5">
                                    {filtered.map((chat) => (
                                        <ChatItem
                                            key={chat._id}
                                            chat={chat}
                                            isActive={activeChat === chat._id}
                                            onClick={() => handleChatClick(chat)}
                                            onDelete={(e) => handleDeleteChat(e, chat._id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    {(!conversation || conversation.length === 0) && (
                        <div className="flex flex-col items-center justify-center h-48 text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <MessageSquare size={28} className="text-slate-600" />
                            </div>
                            <p className="text-sm font-medium text-slate-400">No conversations</p>
                            <p className="text-xs text-slate-500 mt-1">Start a new chat to begin</p>
                        </div>
                    )}
                </div>

                {/* User & Actions */}
                <div className="shrink-0 border-t border-white/[0.06] px-4 py-3 space-y-2">
                    <div className="relative flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-200 group cursor-pointer">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500/30 to-emerald-500/30 flex items-center justify-center ring-2 ring-teal-500/20 group-hover:ring-teal-500/40 transition-all">
                                {userData?.avatar ? (
                                    <img
                                        src={userData.avatar}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                        onLoad={() => console.log("Image loaded")}
                                        onError={(e) => {
                                            console.log("Image failed", e);
                                            console.log(userData.avatar)
                                        }}
                                    />
                                ) : (
                                    <User size={18} className="text-slate-300" />
                                )}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0d0f14]"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-100 truncate">
                                {userData?.name || 'Guest User'}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                                {userData?.email || 'guest@cortex.ai'}
                            </p>
                        </div>
                        <MoreHorizontal size={18} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex cursor-pointer items-center gap-1.5">
                        
                        <button
                            onClick={()=>setShowBilling(true)}
                            className="flex items-center justify-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-all flex-1 cursor-pointer">
                            <CoinsIcon size={16} />
                            <span>Coins</span>
                        </button>
                        <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-sm text-rose-400 hover:text-rose-300 transition-all flex-1 cursor-grab">
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                <BillingDrewer 
                open ={showbilling}
                onclose = {()=>setShowBilling(false)}
                />
            </div>
        </>
    );
};

// ===== Chat Item Component =====
const ChatItem = ({ chat, isActive, onClick, onDelete }) => {
    const [showDelete, setShowDelete] = useState(false);
    const timeDisplay = chat.createdAt ? formatTime(chat.createdAt) : '';

    return (
        <div
            className={`
                group relative flex items-center gap-2.5 px-2 py-1.5 rounded-lg
                transition-all duration-200 cursor-pointer
                ${isActive
                    ? 'bg-gradient-to-r from-teal-600/30 to-emerald-600/30 border border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.1)]'
                    : 'hover:bg-white/5 border border-transparent'
                }
            `}
            onClick={onClick}
            onMouseEnter={() => setShowDelete(true)}
            onMouseLeave={() => setShowDelete(false)}
        >
            {isActive && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            )}
            <div className={`shrink-0 p-1 rounded-md ${isActive ? 'bg-teal-500/30' : 'bg-white/5'} transition-colors z-10`}>
                <MessageSquare size={13} className={isActive ? 'text-teal-200' : 'text-slate-500'} />
            </div>
            <div className="flex-1 min-w-0 z-10">
                <p className={`text-[13px] font-medium truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {chat.title || 'Untitled'}
                </p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock size={10} />
                    <span>{timeDisplay}</span>
                </p>
            </div>
            <button
                onClick={onDelete}
                className={`
                    shrink-0 p-1 rounded-md z-10
                    transition-all duration-200
                    ${showDelete || isActive
                        ? 'opacity-100 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400'
                        : 'opacity-0 pointer-events-none'
                    }
                `}
                aria-label="Delete chat"
            >
                <Trash2 size={12} />
            </button>
        </div>
    );
};

export default Sidebar;