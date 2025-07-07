import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { useMessages } from '@/hooks/useMessages';
import { useNotifications } from '@/hooks/useNotifications';
import { useUsers } from '@/hooks/useUsers';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

export function CommunicationCenter() {
  const { messages, loading: messagesLoading, markAsRead, sendMessage } = useMessages();
  const { notifications, markAsRead: markNotificationAsRead } = useNotifications();
  const { users } = useUsers();
  
  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    recipient_id: '',
    message_type: 'general'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSendMessage = async () => {
    try {
      await sendMessage(newMessage);
      setNewMessage({
        subject: '',
        content: '',
        recipient_id: '',
        message_type: 'general'
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
    <div className="space-y-4 md:space-y-6">
      {/* Header con pulsante nuovo messaggio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-800">Centro Comunicazioni</h2>
          <p className="text-sm text-neutral-600">Gestisci messaggi e notifiche di sistema</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600">
              <Plus size={16} />
              Nuovo Messaggio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invia Nuovo Messaggio</DialogTitle>
              <DialogDescription>
                Invia un messaggio a un utente specifico o a tutti gli utenti.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Destinatario</label>
                <Select value={newMessage.recipient_id} onValueChange={(value) => 
                  setNewMessage(prev => ({ ...prev, recipient_id: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona destinatario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tutti gli utenti</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.nome} {user.cognome} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select value={newMessage.message_type} onValueChange={(value) => 
                  setNewMessage(prev => ({ ...prev, message_type: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Generale</SelectItem>
                    <SelectItem value="info">Informazione</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Oggetto</label>
                <Input
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Inserisci l'oggetto del messaggio"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Messaggio</label>
                <Textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Scrivi il tuo messaggio qui..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annulla
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.subject || !newMessage.content}
                className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600"
              >
                <Send size={16} className="mr-2" />
                Invia
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Messaggi ricevuti */}
        <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <MessageSquare size={20} />
              Messaggi Ricevuti
            </CardTitle>
          </CardHeader>
          <CardContent>
            {messagesLoading ? (
              <div className="text-center py-8 text-neutral-500">Caricamento messaggi...</div>
            ) : messages.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {messages.slice(0, 10).map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors ${
                      !message.is_read ? 'border-amber-300 bg-amber-50' : 'border-neutral-200'
                    }`}
                    onClick={() => markAsRead(message.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-neutral-800 truncate">
                          {message.subject}
                        </h4>
                        <Badge className={getMessageTypeColor(message.message_type)}>
                          {message.message_type}
                        </Badge>
                      </div>
                      {!message.is_read && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    
                    <p className="text-xs text-neutral-600 mb-1">
                      Da: Utente #{message.sender_id.slice(0, 8)}
                    </p>
                    
                    <p className="text-xs text-neutral-700 mb-2 line-clamp-2">
                      {message.content}
                    </p>
                    
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <Clock size={12} />
                      {formatDistanceToNow(new Date(message.created_at), { 
                        addSuffix: true, 
                        locale: it 
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12 text-neutral-500">
                <Mail size={40} className="md:w-12 md:h-12 mx-auto mb-4 text-neutral-300" />
                <p className="text-base md:text-lg font-medium mb-2">Nessun messaggio</p>
                <p className="text-xs md:text-sm">I messaggi degli utenti appariranno qui</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifiche di sistema */}
        <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Bell size={20} />
              Notifiche di Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors ${
                    !notification.isRead ? 'border-blue-300 bg-blue-50' : 'border-neutral-200'
                  }`}
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
          <CardContent className="p-4">
            <div className="text-center">
              <MessageSquare size={24} className="mx-auto mb-2 text-blue-600" />
              <div className="text-lg font-bold text-neutral-800">
                {messages.length}
              </div>
              <p className="text-xs text-neutral-600">Messaggi totali</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
          <CardContent className="p-4">
            <div className="text-center">
              <Mail size={24} className="mx-auto mb-2 text-amber-600" />
              <div className="text-lg font-bold text-neutral-800">
                {messages.filter(m => !m.is_read).length}
              </div>
              <p className="text-xs text-neutral-600">Non letti</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
          <CardContent className="p-4">
            <div className="text-center">
              <Bell size={24} className="mx-auto mb-2 text-purple-600" />
              <div className="text-lg font-bold text-neutral-800">
                {notifications.length}
              </div>
              <p className="text-xs text-neutral-600">Notifiche</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50">
          <CardContent className="p-4">
            <div className="text-center">
              <Users size={24} className="mx-auto mb-2 text-green-600" />
              <div className="text-lg font-bold text-neutral-800">
                {users.length}
              </div>
              <p className="text-xs text-neutral-600">Utenti attivi</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}