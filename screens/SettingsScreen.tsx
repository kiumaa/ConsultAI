
import React from 'react';
import { BackIcon, ChevronRightIcon, EditIcon, UserIcon, LockIcon, SubscriptionIcon, BellIcon, MoonIcon, MicIcon, ExportIcon, HelpIcon, PrivacyIcon, TermsIcon } from '../components/Icons';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xs font-bold text-gray-400 uppercase px-4 pt-6 pb-2">{children}</h2>
  );
  
  interface ToggleProps {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    enabled: boolean;
    description?: string;
  }
  const ToggleItem: React.FC<ToggleProps> = ({ label, icon: Icon, enabled, description }) => (
    <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Icon className="w-5 h-5 text-gray-400" />
        <div className="ml-4">
            <p className="text-white">{label}</p>
            {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
      </div>
      <div className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${enabled ? 'bg-cyan-500' : 'bg-slate-600'}`}>
        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${enabled ? 'translate-x-6' : ''}`}></div>
      </div>
    </div>
  );

  interface NavItemProps {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    value?: string;
  }
  const NavItem: React.FC<NavItemProps> = ({ label, icon: Icon, value }) => (
    <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700/50 last:border-b-0">
      <div className="flex items-center">
        <Icon className="w-5 h-5 text-gray-400" />
        <p className="ml-4 text-white">{label}</p>
      </div>
      <div className="flex items-center">
        {value && <p className="text-gray-400 mr-2">{value}</p>}
        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  );


  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="flex items-center p-4 bg-slate-800/50 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-300">
          <BackIcon />
        </button>
        <h1 className="text-xl font-bold text-white mx-auto pr-8">Settings</h1>
      </header>

      <main className="flex-grow overflow-y-auto pb-8">
        <div className="p-4 flex items-center">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mr-4">
                <UserIcon className="w-8 h-8 text-gray-400"/>
            </div>
            <div>
                <p className="text-lg font-semibold text-white">Alex Rivera</p>
                <p className="text-gray-400">alex.rivera@consultai.com</p>
            </div>
            <button className="ml-auto p-2 text-gray-400"><EditIcon className="w-5 h-5" /></button>
        </div>

        <SectionTitle>Account</SectionTitle>
        <div className="mx-4 rounded-lg overflow-hidden">
            <NavItem label="Change Password" icon={LockIcon} />
            <NavItem label="Manage Subscription" icon={SubscriptionIcon} value="Pro Plan" />
        </div>

        <SectionTitle>Preferences</SectionTitle>
        <div className="mx-4 rounded-lg overflow-hidden">
            <ToggleItem label="Push Notifications" icon={BellIcon} enabled={true} />
            <div className="border-b border-slate-700/50">
              <NavItem label="App Theme" icon={MoonIcon} value="Dark" />
            </div>
            <NavItem label="Voice & Language" icon={MicIcon} />
        </div>
        
        <SectionTitle>Privacy & Data Control</SectionTitle>
        <div className="mx-4 rounded-lg overflow-hidden">
            <ToggleItem label="Save Conversation History" icon={LockIcon} enabled={false} />
            <div className="border-b border-slate-700/50">
                <ToggleItem label="Anonymize My Usage Data" icon={PrivacyIcon} enabled={true} description="This helps improve our AI models while protecting your privacy." />
            </div>
            <NavItem label="Export My Data" icon={ExportIcon} />
        </div>

        <SectionTitle>Support & Legal</SectionTitle>
        <div className="mx-4 rounded-lg overflow-hidden">
            <NavItem label="Help Center" icon={HelpIcon} />
            <div className="border-b border-slate-700/50">
                <NavItem label="Privacy Policy" icon={PrivacyIcon} />
            </div>
            <NavItem label="Terms of Service" icon={TermsIcon} />
        </div>
        
        <div className="px-4 mt-8">
            <button className="w-full text-center text-red-400 py-3 bg-red-500/10 rounded-lg">
                Delete My Account & Data
            </button>
        </div>
        
        <p className="text-center text-xs text-gray-500 mt-8">
            ConsultAI Version 1.0.0
        </p>
      </main>
    </div>
  );
};

export default SettingsScreen;
