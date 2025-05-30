import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ContactGuidePage = () => {
  const { guideId } = useParams();
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Suppose que l'utilisateur courant est le voyageur
  const currentUserId = 'me'; // À remplacer dynamiquement si nécessaire

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts', {
        withCredentials: true,
      });
      const guideContacts = response.data.data.filter(
        (contact) => contact.guide._id === guideId
      );
      setContacts(guideContacts);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 20000); // rafraîchit toutes les 20s
    return () => clearInterval(interval);
  }, [guideId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/cguide/${guideId}`,
        { text: message },
        { withCredentials: true }
      );

      setContacts((prev) => [response.data.data, ...prev]);
      setMessage('');
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Chargement...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 mt-20">
      <h1 className="text-2xl font-bold mb-6">Contacter le Guide</h1>

      <div className="flex flex-col gap-4 h-[500px] overflow-y-auto bg-gray-100 p-4 rounded-lg mb-6">
        {[...contacts].reverse().map((contact) => {
          const isMe = contact.voyageur._id === currentUserId;
          return (
            <div
              key={contact._id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow ${
                  isMe
                    ? 'bg-red-600 text-white rounded-br-none'
                    : 'bg-white text-black border border-gray-200 rounded-bl-none'
                }`}
              >
                <div className="text-sm">{contact.text}</div>
                <div className="text-[10px] text-right mt-1 opacity-70">
                  {new Date(contact.dateEnvoi).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="1"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none resize-none"
          placeholder="Écrivez votre message..."
        />
        <button
          type="submit"
          disabled={!message.trim() || sending}
          className={`px-4 py-2 text-white rounded-lg ${
            sending || !message.trim()
              ? 'bg-red-300 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {sending ? 'Envoi...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
};

export default ContactGuidePage;
