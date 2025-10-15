

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MentorshipChat = () => {
  const [showChat, setShowChat] = useState(false);
  const [mentor, setMentor] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMentorsAndResources = async () => {
      setLoading(true);
      setError('');
      try {
        const [mentorsRes, resourcesRes] = await Promise.all([
          axios.get('/api/mentors'),
          axios.get('/api/resources'),
        ]);
        setMentors(mentorsRes.data);
        setResources(resourcesRes.data);
      } catch (err) {
        setError('Failed to fetch mentors or resources');
      } finally {
        setLoading(false);
      }
    };
    fetchMentorsAndResources();
  }, []);

  const handleMatchMentor = e => {
    e.preventDefault();
    if (mentors.length > 0) {
      setMentor(mentors[0].name + ' (' + mentors[0].expertise + ')');
      setShowChat(true);
    } else {
      setError('No mentors available');
    }
  };

  const handleSendMessage = e => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { sender: 'You', text: message }]);
      setMessage('');
      // TODO: Integrate with Socket.io backend
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pt-28">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Mentorship & Career Guidance</h2>
      <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow mb-6">
        <p className="text-gray-700 mb-4">Connect with industry professionals and get personalized career advice to accelerate your professional growth.</p>
        {loading ? (
          <div className="text-purple-600 text-center">Loading mentors and resources...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : !showChat ? (
          <form className="space-y-4" onSubmit={handleMatchMentor}>
            <button 
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Find a Mentor
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-2 font-semibold text-purple-700">Mentor matched: {mentor}</div>
            <div className="h-48 overflow-y-auto bg-gray-50 p-3 rounded border mb-2">
              {messages.length === 0 ? (
                <div className="text-gray-400 italic">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className="mb-1"><span className="font-bold">{msg.sender}:</span> {msg.text}</div>
                ))
              )}
            </div>
            <form className="flex gap-2" onSubmit={handleSendMessage}>
              <input
                className="flex-1 p-2 border rounded"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <button className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700" type="submit">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-2 text-purple-700">Career Resources</h3>
        <ul className="list-disc pl-5 text-gray-700">
          {resources.map(r => (
            <li key={r.id}><a href={r.url} className="text-blue-600 hover:underline">{r.title}</a></li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default MentorshipChat;
