
import React, { useState, useCallback } from 'react';
import { Screen, Consultant } from './types';
import WelcomeScreen from './screens/WelcomeScreen';
import SelectConsultantScreen from './screens/SelectConsultantScreen';
import ChatScreen from './screens/ChatScreen';
import SettingsScreen from './screens/SettingsScreen';
import JournalScreen from './screens/JournalScreen';
import ActionItemsScreen from './screens/ActionItemsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Welcome);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);

  const navigate = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  const handleSelectConsultant = useCallback((consultant: Consultant) => {
    setSelectedConsultant(consultant);
    navigate(Screen.Chat);
  }, [navigate]);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Welcome:
        return <WelcomeScreen onNavigate={() => navigate(Screen.SelectConsultant)} />;
      case Screen.SelectConsultant:
        return <SelectConsultantScreen onSelectConsultant={handleSelectConsultant} onBack={() => navigate(Screen.Welcome)} />;
      case Screen.Chat:
        return selectedConsultant ? (
          <ChatScreen consultant={selectedConsultant} onNavigate={navigate} />
        ) : (
            <SelectConsultantScreen onSelectConsultant={handleSelectConsultant} onBack={() => navigate(Screen.Welcome)} />
        );
      case Screen.Settings:
        return <SettingsScreen onBack={() => navigate(Screen.Chat)} />;
      case Screen.Journal:
        return <JournalScreen onBack={() => navigate(Screen.Chat)} />;
      case Screen.ActionItems:
        return <ActionItemsScreen onBack={() => navigate(Screen.Chat)} />;
      default:
        return <WelcomeScreen onNavigate={() => navigate(Screen.SelectConsultant)} />;
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-950 text-gray-200 antialiased overflow-hidden">
      <div className="max-w-md mx-auto h-full bg-slate-900 flex flex-col relative">
        {renderScreen()}
      </div>
    </div>
  );
}
