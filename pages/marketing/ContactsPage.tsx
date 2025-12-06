
import React, { useEffect, useState, useContext } from 'react';
import { getContacts, addContact } from '../../services/api';
import { Contact } from '../../types';
import ResourceTablePage, { Column } from '../../components/common/ResourceTablePage';
import { ToastContext } from '../../context/AuthContext';

const AddContactModalContent: React.FC<{ onClose: () => void, onContactAdded: (contact: Contact) => void }> = ({ onClose, onContactAdded }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Press');
    const [list, setList] = useState('General');
    const { addToast } = useContext(ToastContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && email.trim()) {
            try {
                const newContact = await addContact({ name, email, role, list });
                onContactAdded(newContact);
                addToast('Contact created successfully!', 'success');
                onClose();
            } catch (e: any) {
                addToast(`Nie udało się dodać kontaktu: ${e.message || e}`, 'error');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full bg-dark-bg border-dark-border rounded-md p-3" required />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-dark-bg border-dark-border rounded-md p-3" required />
            <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Role (e.g., Press, Booking)" className="w-full bg-dark-bg border-dark-border rounded-md p-3" />
            <select value={list} onChange={e => setList(e.target.value)} className="w-full bg-dark-bg border-dark-border rounded-md p-3">
                <option>General</option>
                <option>Press & Media</option>
                <option>Booking Agents</option>
                <option>Super Fans</option>
            </select>
            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-primary-purple py-2 px-6 rounded-lg">Add Contact</button>
            </div>
        </form>
    );
};

const ContactsPage: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getContacts();
                if (mounted) setContacts(data);
            } catch (e: any) {
                addToast(`Nie udało się pobrać kontaktów: ${e.message || e}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    const handleContactAdded = (newContact: Contact) => {
        setContacts(prev => [newContact, ...prev]);
    };

    const columns: Column<Contact>[] = [
        { header: 'Name', render: (c) => <span className="font-medium text-white">{c.name}</span> },
        { header: 'Email', render: (c) => <span className="text-primary-purple">{c.email}</span> },
        { header: 'Role', render: (c) => <span className="text-gray-300">{c.role}</span> },
        { header: 'List', render: (c) => <span className="text-gray-300">{c.list}</span> },
        { header: 'Date Added', render: (c) => <span className="text-gray-400">{c.dateAdded}</span> },
    ];

    if (loading) {
        return <div className="h-48 w-full flex items-center justify-center text-gray-300">Ładowanie kontaktów...</div>;
    }
    return (
        <ResourceTablePage<Contact>
            title="Contacts CRM"
            subtitle="Manage your industry and fan contacts."
            items={contacts}
            columns={columns}
            searchKeys={['name', 'email', 'role']}
            searchPlaceholder="Search contacts..."
            addNewButtonText="New Contact"
            addModalTitle="Add New Contact"
            addModalContent={(onClose) => <AddContactModalContent onClose={onClose} onContactAdded={handleContactAdded} />}
            emptyState={{
                icon: <span className="text-4xl">📇</span>,
                title: "Grow Your Network",
                description: "Your contact list is empty. Add industry professionals, media contacts, and super fans to build your reach.",
                ctaText: "+ Add New Contact"
            }}
        />
    );
};

export default ContactsPage;
