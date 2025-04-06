import { createContext, useContext, useState, ReactNode } from 'react';

type Contact = {
  id: string;
  name: string;
  phone: string;
  relation: string;
};

type ContactsContextType = {
  contacts: Contact[];
  emergencyMessage: string;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (contact: Contact) => void;
  removeContact: (id: string) => void;
  updateEmergencyMessage: (message: string) => void;
};

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export function ContactsProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [emergencyMessage, setEmergencyMessage] = useState(
    "I'm in an emergency situation and need immediate help. This is an automated SOS message with my current location."
  );

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
    };
    setContacts(prev => [...prev, newContact]);
  };

  const updateContact = (updatedContact: Contact) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const updateEmergencyMessage = (message: string) => {
    setEmergencyMessage(message);
  };

  return (
    <ContactsContext.Provider 
      value={{ 
        contacts, 
        emergencyMessage,
        addContact, 
        updateContact, 
        removeContact,
        updateEmergencyMessage
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
}