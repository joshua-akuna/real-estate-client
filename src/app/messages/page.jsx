'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './messages.module.css';
import { formatDate } from '@/utils/helpers';
import { messageAPI } from '@/services/apiService';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export default function MessagePage() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadMessages();
    loadUnreadCount();
  }, [activeTab]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const response =
        activeTab === 'inbox'
          ? await messageAPI.getInbox()
          : await messageAPI.getSentMessages();
      setMessages(response.data?.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      if (error.response?.status === 401) {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await messageAPI.getUnreadCount();
      setUnreadCount(response.data?.unreadCount);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await messageAPI.markAsRead(messageId);
      setMessages(
        messages.map((msg) =>
          msg.id === messageId ? { ...msg, is_read: true } : msg,
        ),
      );
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const getOtherUserId = (message) => {
    return activeTab === 'inbox' ? message.sender_id : message.receiver_id;
  };

  const getOtherUserAvater = (message) => {
    return activeTab === 'inbox'
      ? message.sender_avatar
      : message.receiver_avatar;
  };

  const getOtherUserName = (message) => {
    return activeTab === 'inbox' ? message.sender_name : message.receiver_name;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.page}>
      <div className='container'>
        <div className={styles.header}>
          <h1>Messages</h1>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount} unread</span>
          )}
        </div>

        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`${styles.tab} ${activeTab === 'inbox' ? styles.active : ''}`}
          >
            Inbox
            {unreadCount > 0 && activeTab === 'inbox' && (
              <span className={styles.tabBadge}>{unreadCount}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`${styles.tab} ${activeTab === 'sent' ? styles.active : ''}`}
          >
            Sent
          </button>
        </div>

        {messages.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>✉️</div>
            <h2>No messages yet</h2>
            <p>
              {activeTab === 'inbox'
                ? 'Your inbox is empty'
                : "You haven't sent any messages yet"}
            </p>
          </div>
        ) : (
          <div className={styles.messageList}>
            {messages.map((message) => (
              <Link
                key={message.id}
                href={`/messages/${getOtherUserId(message)}`}
                className={`${styles.messageItem} ${!message.is_read && activeTab === 'inbox' ? styles.unread : ''}`}
                onClick={() =>
                  activeTab === 'inbox' &&
                  !message.is_read &&
                  handleMarkAsRead(message.id)
                }
              >
                <div className={styles.messageAvatar}>
                  {getOtherUserAvater(message) ? (
                    <Image
                      src={getOtherUserAvater(message)}
                      alt={getOtherUserName(message)}
                      width={50}
                      height={50}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {getOtherUserName(message)?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {!message.is_read && activeTab === 'inbox' && (
                    <span className={styles.unreadDot}></span>
                  )}
                </div>

                <div className={styles.messageContent}>
                  <div className={styles.messageHeader}>
                    <strong>{getOtherUserName(message)}</strong>
                    <span className={styles.messageDate}>
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                  <div className={styles.messageSubject}>{message.subject}</div>
                  {message.property_title && (
                    <div className={styles.propertyTag}>
                      🏠 {message.property_title}
                    </div>
                  )}
                  <div className={styles.messagePreview}>
                    {message.message.substring(0, 100)}
                    {message.message.length > 100 && '...'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
