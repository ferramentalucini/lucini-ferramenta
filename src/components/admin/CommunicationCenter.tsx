import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Send, 
  Bell, 
  Users, 
  Mail,
  Plus,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import AdminChat from './AdminChat';
import { supabase } from '@/integrations/supabase/client';
// Wrapper per ottenere l'adminId corrente e passarlo ad AdminChat
function AdminChatWrapper() {
  const [adminId, setAdminId] = useState<string | null>(null);
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAdminId(data?.user?.id || null);
    });
  }, []);
  if (!adminId) return <div className="p-8 text-center text-neutral-500">Effettua il login come amministratore per accedere alla chat.</div>;
  return <AdminChat adminId={adminId} />;
}
import { useMessages } from '@/hooks/useMessages';
import { useNotifications } from '@/hooks/useNotifications';
import { useUsers } from '@/hooks/useUsers';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';


export function CommunicationCenter() {
  const { messages, loading: messagesLoading, sendMessage } = useMessages();
  const { notifications, markAsRead: markNotificationAsRead } = useNotifications();
  const { users } = useUsers();

  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    recipient_ids: [] as string[],
    message_type: 'user_group' as 'user_group' | 'admin_private',
    toAll: false
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<'system' | 'chat'>('system');

  const handleSendMessage = async () => {
    try {
      if (newMessage.toAll) {
        // Invia a tutti gli utenti
        for (const user of users) {
          await sendMessage({
            recipient_id: user.id,
            content: newMessage.content,
            message_type: newMessage.message_type
          });
        }
      } else if (newMessage.recipient_ids.length > 0) {
        // Invia a selezione multipla
        for (const id of newMessage.recipient_ids) {
          await sendMessage({
            recipient_id: id,
            content: newMessage.content,
            message_type: newMessage.message_type
          });
        }
      } else {
        // Nessun destinatario selezionato
        return;
      }
      setNewMessage({
        subject: '',
        content: '',
        recipient_ids: [],
        message_type: 'user_group',
        toAll: false
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Errore invio messaggio:', error);
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      case 'success':
        return <Check size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  return (
    <div className="w-full max-w-[200vw] mx-auto py-10 flex flex-col items-center">
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight mb-2">Centro Comunicazioni</h2>
        <p className="text-base text-neutral-600 mb-4">Gestisci messaggi, notifiche e comunicazioni agli utenti</p>
        <Button
          className="flex items-center gap-2 px-6 py-3 text-base rounded-lg bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-md"
          onClick={() => setChatOpen(true)}
        >
          <MessageSquare size={20} />
          Apri Chat
        </Button>
      </div>
      <div className="flex flex-row flex-nowrap justify-center items-start gap-16 w-full min-h-[400px] px-8">
        {/* Colonna sinistra: invio notifiche */}
        <div className="flex-1 max-w-xl">
          <Card className="h-full shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus size={18} />
                Invia nuova comunicazione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium">Destinatari</label>
                <div className="flex flex-col gap-1 max-h-28 overflow-y-auto border rounded p-1 bg-neutral-50">
                  <label className="flex items-center gap-2 font-medium">
                    <Checkbox
                      checked={newMessage.toAll}
                      onCheckedChange={(checked) => setNewMessage(prev => ({ ...prev, toAll: !!checked, recipient_ids: checked ? users.map(u => u.id) : [] }))}
                    />
                    Tutti
                  </label>
                  {!newMessage.toAll && users.map(user => (
                    <label key={user.id} className="flex items-center gap-2 text-xs">
                      <Checkbox
                        checked={newMessage.recipient_ids.includes(user.id)}
                        onCheckedChange={(checked) => {
                          setNewMessage(prev => {
                            const ids = checked
                              ? [...prev.recipient_ids, user.id]
                              : prev.recipient_ids.filter(id => id !== user.id);
                            return { ...prev, recipient_ids: ids };
                          });
                        }}
                      />
                      {user.nome} {user.cognome}
                    </label>
                  ))}
                </div>
                <label className="text-xs font-medium mt-2">Tipo</label>
        <Select value={newMessage.message_type} onValueChange={(value) => setNewMessage(prev => ({ ...prev, message_type: value as 'user_group' | 'admin_private' }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user_group">Gruppo utenti</SelectItem>
            <SelectItem value="admin_private">Privata admin</SelectItem>
          </SelectContent>
        </Select>
                <label className="text-xs font-medium mt-2">Oggetto</label>
                <Input
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Oggetto"
                />
                <label className="text-xs font-medium mt-2">Messaggio</label>
                <Textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Scrivi qui..."
                  rows={3}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.subject || !newMessage.content || (!newMessage.toAll && newMessage.recipient_ids.length === 0)}
                  className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 mt-2"
                >
                  <Send size={16} className="mr-2" />
                  Invia
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Colonna destra: notifiche */}
        <div className="flex-1 max-w-xl">
          <Card className="h-full shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell size={18} />
                Notifiche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-2">
                <button
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${notifTab === 'system' ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-600 hover:bg-blue-50'}`}
                  onClick={() => setNotifTab('system')}
                >
                  Notifiche di sistema
                </button>
                <button
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${notifTab === 'chat' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600 hover:bg-green-50'}`}
                  onClick={() => setNotifTab('chat')}
                >
                  Notifiche chat
                </button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {notifTab === 'system' ? (
                  notifications.length > 0 ? notifications.filter(n => (n.type as string) !== 'chat').map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors ${!notification.isRead ? 'border-blue-300 bg-blue-50' : 'border-neutral-200'}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getNotificationTypeColor(notification.type)}>
                            {getNotificationIcon(notification.type)}
                            {notification.type}
                          </Badge>
                          <h4 className="font-medium text-sm text-neutral-800">
                            {notification.title}
                          </h4>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-xs text-neutral-700 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-neutral-500">
                        <Clock size={12} />
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: it
                        })}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-neutral-500">
                      <Bell size={40} className="md:w-12 md:h-12 mx-auto mb-4 text-neutral-300" />
                      <p className="text-base md:text-lg font-medium mb-2">Nessuna notifica</p>
                      <p className="text-xs md:text-sm">Le notifiche di sistema appariranno qui</p>
                    </div>
                  )
                ) : (
                  notifications.filter(n => (n.type as string) === 'chat').length > 0 ? notifications.filter(n => (n.type as string) === 'chat').map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors ${!notification.isRead ? 'border-green-300 bg-green-50' : 'border-neutral-200'}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <MessageSquare size={14} className="inline mr-1" /> Chat
                          </Badge>
                          <h4 className="font-medium text-sm text-neutral-800">
                            {notification.title}
                          </h4>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-xs text-neutral-700 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-neutral-500">
                        <Clock size={12} />
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: it
                        })}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-neutral-500">
                      <MessageSquare size={40} className="md:w-12 md:h-12 mx-auto mb-4 text-neutral-300" />
                      <p className="text-base md:text-lg font-medium mb-2">Nessuna notifica chat</p>
                      <p className="text-xs md:text-sm">Le notifiche delle chat appariranno qui</p>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Statistiche rapide in basso, compatte */}
      <div className="flex flex-wrap gap-2 mt-10 justify-center">
        <div className="flex items-center gap-1 px-3 py-2 rounded bg-white/80 border border-neutral-200/50 text-xs">
          <MessageSquare size={16} className="text-blue-600" />
          <span className="font-bold">{messages.length}</span> messaggi
        </div>
        {/* Rimosso conteggio messaggi non letti: la proprietà is_read non esiste più */}
        <div className="flex items-center gap-1 px-3 py-2 rounded bg-white/80 border border-neutral-200/50 text-xs">
          <Bell size={16} className="text-purple-600" />
          <span className="font-bold">{notifications.length}</span> notifiche
        </div>
        <div className="flex items-center gap-1 px-3 py-2 rounded bg-white/80 border border-neutral-200/50 text-xs">
          <Users size={16} className="text-green-600" />
          <span className="font-bold">{users.length}</span> utenti attivi
        </div>
      </div>
      {/* Modal chat */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="full-screen-modal flex flex-col bg-white z-50 max-w-5xl w-[90vw] h-[90vh] min-h-[600px] min-w-[350px] p-0">
          <DialogTitle asChild>
            <div className="flex items-center gap-3 px-8 py-6 border-b bg-gradient-to-r from-green-400/80 to-green-600/80 w-full relative">
              <MessageSquare size={28} className="text-white drop-shadow" />
              <span className="text-2xl font-bold text-white drop-shadow">Chat privata tra amministratori</span>
              {/* Pulsante X in alto a destra */}
              <button
                onClick={() => setChatOpen(false)}
                className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white font-bold bg-green-700/70 hover:bg-green-800/90 transition-all text-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Chiudi chat"
              >
                ✕
              </button>
            </div>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="sr-only">Chat privata tra amministratori. Seleziona una conversazione o avviane una nuova.</div>
          </DialogDescription>
          <div className="flex-1 flex flex-col bg-neutral-50 overflow-y-auto min-h-0 min-w-0 w-full h-full">
            <div className="flex-1 min-h-0 min-w-0 flex flex-col w-full h-full">
              {/* Chat solo tra amministratori */}
              <AdminChatWrapper />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}