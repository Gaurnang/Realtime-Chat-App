import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import axiosinstance from '../lib/axios'
import { Send, Image, Users, MessageSquare, Loader2 } from 'lucide-react'

const HomePage = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [authUser, navigate]);

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const res = await axiosinstance.get('/messages/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      setIsLoadingMessages(true);
      const res = await axiosinstance.get(`/messages/${userId}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser) return;
    
    setIsSending(true);
    try {
      const res = await axiosinstance.post(`/messages/send/${selectedUser._id}`, { text });
      setMessages((prev) => [...prev, res.data]);
      setText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!authUser) return null;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-72 bg-base-200 border-r border-base-300 flex flex-col">
        <div className="p-4 border-b border-base-300">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" /> Contacts
          </h3>
        </div>
        <div className="overflow-y-auto flex-1">
          {isLoadingUsers ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : users.length === 0 ? (
            <p className="p-4 text-sm text-base-content/50">No other users found</p>
          ) : (
            users.map((user) => (
              <button
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                  selectedUser?._id === user._id ? 'bg-base-300' : ''
                }`}
              >
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-10">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.fullName} />
                    ) : (
                      <span className="text-sm">{user.fullName?.charAt(0)?.toUpperCase()}</span>
                    )}
                  </div>
                </div>
                <span className="font-medium text-sm truncate">{user.fullName}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-base-300 bg-base-100 flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-10">
                  {selectedUser.profilePicture ? (
                    <img src={selectedUser.profilePicture} alt={selectedUser.fullName} />
                  ) : (
                    <span className="text-sm">{selectedUser.fullName?.charAt(0)?.toUpperCase()}</span>
                  )}
                </div>
              </div>
              <h3 className="font-semibold">{selectedUser.fullName}</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoadingMessages ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="animate-spin" size={24} />
                </div>
              ) : messages.length === 0 ? (
                <p className="text-center text-base-content/50 mt-8">No messages yet. Say hello!</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`chat ${msg.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
                  >
                    <div className={`chat-bubble ${msg.senderId === authUser._id ? 'chat-bubble-primary' : ''}`}>
                      {msg.image && (
                        <img src={msg.image} alt="attachment" className="max-w-xs rounded-lg mb-1" />
                      )}
                      {msg.content && <p>{msg.content}</p>}
                    </div>
                    <div className="chat-footer text-xs opacity-50">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-base-300 flex gap-2">
              <input
                type="text"
                className="input input-bordered flex-1"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={isSending || !text.trim()}>
                {isSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-base-content/50">
            <MessageSquare size={64} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">Welcome to Chat</h3>
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;