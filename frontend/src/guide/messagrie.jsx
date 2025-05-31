import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useUserStore from "../Store/UseUserStore";

const ContactVoyageurPage = () => {
  const { voyageurId } = useParams();
  const user = useUserStore((state) => state.user);

  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/contacts", {
        withCredentials: true,
      });

      // Filter contacts between current user (guide) and the voyageur
      const relevant = response.data.data.filter(
        (contact) =>
          (contact.sender._id === voyageurId && contact.receiver._id === user?._id) ||
          (contact.sender._id === user?._id && contact.receiver._id === voyageurId)
      );

      setContacts(relevant);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchContacts();
    const interval = setInterval(fetchContacts, 10000); // 10 seconds refresh
    return () => clearInterval(interval);
  }, [voyageurId, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/cvoyageur/${voyageurId}`,
        { text: message },
        { withCredentials: true }
      );
      setContacts((prev) => [...prev, res.data.data]);
      setMessage("");
    } catch (err) {
      console.error("Erreur envoi message");
    } finally {
      setSending(false);
    }
  };

  if (loading || !user)
    return <div className="text-center mt-10">Chargement...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Discussion avec le voyageur</h1>

      <div className="flex flex-col gap-4 h-[500px] overflow-y-auto bg-gray-100 p-4 rounded-lg mb-6">
        {contacts
          .sort((a, b) => new Date(a.dateEnvoi) - new Date(b.dateEnvoi))
          .map((contact) => {
            // Check if current user is the sender of this message
            const isMe = contact.sender._id === user._id;

            return (
              <div
                key={contact._id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                {/* Sender label */}
                <div
                  className={`text-xs font-semibold mb-1 ${
                    isMe ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  {isMe ? "Moi" : "Voyageur"}
                </div>

                <div
                  className={`max-w-xs p-3 rounded-lg shadow ${
                    isMe
                      ? "bg-red-600 text-white rounded-br-none"
                      : "bg-white text-black border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <div className="text-sm">{contact.text}</div>
                  <div className="text-[10px] text-right mt-1 opacity-70">
                    {new Date(contact.dateEnvoi).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
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
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {sending ? "Envoi..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
};

export default ContactVoyageurPage;