import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Video, Calendar, BarChart2, X, Plus } from "lucide-react";

export function SocialPostComposer({ profile }: { profile: any }) {
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [postText, setPostText] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  const handleAddOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleSubmit = () => {
    // mock submit
    setPostText("");
    setIsCreatingPoll(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
  };

  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-4 shadow-sm mb-6">
      <div className="flex gap-4">
        <Avatar className="w-12 h-12 border border-slate-100 shadow-sm shrink-0">
          <AvatarImage src={profile?.avatarUrl} />
          <AvatarFallback>{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Start a post..."
            className="w-full bg-transparent border-none resize-none outline-none text-[var(--color-text-primary)] text-lg placeholder:text-slate-400 min-h-[60px]"
          />
          
          {isCreatingPoll && (
            <div className="bg-[var(--color-bg-alt)]/50 rounded-xl p-4 border border-[var(--color-border)] relative">
              <button 
                onClick={() => setIsCreatingPoll(false)}
                className="absolute top-3 right-3 p-1 hover:bg-slate-200 rounded-full text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-semibold mb-3">Create a poll</h3>
              <input 
                type="text" 
                placeholder="Your question..." 
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <div className="space-y-2 mb-3">
                {pollOptions.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                ))}
              </div>
              {pollOptions.length < 4 && (
                <button 
                  onClick={handleAddOption}
                  className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                >
                  <Plus className="w-4 h-4" /> Add option
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/50">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)] hover:text-blue-600 hover:bg-blue-50 rounded-full">
                <ImageIcon className="w-4 h-4 mr-2 text-blue-500" />
                <span className="hidden sm:inline">Media</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsCreatingPoll(!isCreatingPoll)}
                className={`rounded-full ${isCreatingPoll ? 'bg-amber-50 text-amber-700' : 'text-[var(--color-text-secondary)] hover:text-amber-600 hover:bg-amber-50'}`}
              >
                <BarChart2 className="w-4 h-4 mr-2 text-amber-500" />
                <span className="hidden sm:inline">Poll</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)] hover:text-purple-600 hover:bg-purple-50 rounded-full">
                <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                <span className="hidden sm:inline">Event</span>
              </Button>
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={!postText.trim() && !pollQuestion.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 font-semibold shadow-sm disabled:opacity-50"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
