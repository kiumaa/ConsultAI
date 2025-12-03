
import React, { useState } from 'react';
import { BackIcon, MicIcon } from '../components/Icons';

interface ActionItemsScreenProps {
  onBack: () => void;
}

const actionItems = [
    { id: 1, text: 'Draft the Q3 marketing proposal', source: 'Project Phoenix Sync', type: 'Task', due: 'Oct 26', complete: false },
    { id: 2, text: 'Finalize budget for new hires', source: 'Leadership Weekly', type: 'Decision', due: 'Yesterday', complete: false, overdue: true },
    { id: 3, text: 'Send follow-up to the design team', source: 'Sprint Planning', type: 'Commitment', reminder: 'Tomorrow, 9 AM', complete: false },
    { id: 4, text: 'Review the new branding guidelines', source: 'Marketing Stand-up', type: 'Task', complete: true },
];

const ActionItem: React.FC<{ item: typeof actionItems[0] }> = ({ item }) => {
    const typeColors: { [key: string]: string } = {
        Task: 'bg-blue-500/20 text-blue-300',
        Decision: 'bg-purple-500/20 text-purple-300',
        Commitment: 'bg-amber-500/20 text-amber-300',
    };
    return (
        <div className="flex items-start space-x-4 p-4">
            <div
                className={`w-6 h-6 rounded-full border-2 mt-1 flex-shrink-0 flex items-center justify-center ${
                    item.complete ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600'
                }`}
            >
                {item.complete && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <div className="flex-grow">
                <p className={`text-white ${item.complete ? 'line-through text-gray-500' : ''}`}>{item.text}</p>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                    <span>From '{item.source}'</span>
                </div>
                {item.due && (
                    <div className={`flex items-center text-sm mt-1 ${item.overdue ? 'text-red-400' : 'text-gray-400'}`}>
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>Due: {item.due}</span>
                    </div>
                )}
                 {item.reminder && (
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        <span>Reminder: {item.reminder}</span>
                    </div>
                )}
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-md ${typeColors[item.type]}`}>{item.type}</span>
        </div>
    );
};

const ActionItemsScreen: React.FC<ActionItemsScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Tasks', 'Decisions', 'Commitments'];

  return (
    <div className="flex flex-col h-full bg-slate-900 relative">
      <header className="flex items-center p-4 bg-slate-800/50 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-300">
          <BackIcon />
        </button>
        <h1 className="text-xl font-bold text-white mx-auto pr-8">Action Items</h1>
        <MicIcon className="w-6 h-6 text-gray-300" />
      </header>

      <div className="border-b border-slate-700 px-2">
        <nav className="flex space-x-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === tab ? 'bg-slate-700 text-white' : 'text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <main className="flex-grow overflow-y-auto">
        <div className="divide-y divide-slate-800">
            {actionItems.map(item => <ActionItem key={item.id} item={item} />)}
        </div>
      </main>
      <div className="absolute bottom-8 right-6">
          <button className="w-16 h-16 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 transform transition-transform active:scale-90">
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </button>
       </div>
    </div>
  );
};

export default ActionItemsScreen;
