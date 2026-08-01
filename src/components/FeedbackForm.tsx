import React, { useState } from 'react';
import { trackEvent } from '../services/analytics';

export const FeedbackForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedbackData = { name, email, wallet, rating, comment };
    trackEvent("submit_feedback", feedbackData);
    
    // Webhook / CSV Export preparation
    console.log("Exportable Feedback Record:", JSON.stringify(feedbackData));
    
    setSubmitted(true);
    setTimeout(() => { 
      setIsOpen(false); 
      setSubmitted(false);
      setName('');
      setEmail('');
      setWallet('');
      setComment('');
      setRating(5);
    }, 3000);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-[#0D9488] hover:bg-[#0D9488]/80 text-white px-4 py-2 min-h-[44px] rounded-full shadow-lg text-xs font-bold flex items-center gap-2 z-50 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <span>💬</span> Feedback
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-[#081B1D] border border-slate-700 rounded-xl p-5 shadow-2xl z-50 w-80">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-bold text-white text-sm">Help us improve</h4>
            <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white min-h-[44px] px-2">&times;</button>
          </div>
          
          <input 
            type="text"
            placeholder="Name (optional)"
            className="bg-[#030D0E] border border-slate-700 rounded p-2 text-xs text-white"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input 
            type="email"
            placeholder="Email (optional)"
            className="bg-[#030D0E] border border-slate-700 rounded p-2 text-xs text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="text"
            placeholder="Wallet Address (optional)"
            className="bg-[#030D0E] border border-slate-700 rounded p-2 text-xs text-white"
            value={wallet}
            onChange={e => setWallet(e.target.value)}
          />

          <div className="flex gap-2 my-1">
            {[1,2,3,4,5].map(star => (
              <button 
                key={star} 
                type="button" 
                onClick={() => setRating(star)}
                className={`text-xl min-h-[36px] min-w-[36px] flex items-center justify-center ${rating >= star ? 'text-[#2DD4BF]' : 'text-slate-600'}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea 
            className="bg-[#030D0E] border border-slate-700 rounded p-2 text-xs text-white resize-none"
            rows={3}
            placeholder="Tell us what you think..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button type="submit" className="bg-[#2DD4BF] hover:bg-[#2DD4BF]/80 text-[#030D0E] font-bold text-xs py-2 min-h-[44px] rounded mt-1 transition">
            Submit
          </button>
        </form>
      ) : (
        <div className="text-center py-4 text-[#34D399] font-bold text-sm">
          Thank you for your feedback! 🚀
        </div>
      )}
    </div>
  );
};
