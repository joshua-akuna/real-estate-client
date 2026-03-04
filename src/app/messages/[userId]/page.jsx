'use client';

import MessageForm from '@/components/forms/MessageForm';
import Loading from '@/components/ui/Loading';
import { messageAPI } from '@/services/apiService';
import { formatDate } from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './thread.module.css';

export default function MessageThreadPage() {
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const userId = params.userId;
  const router = useRouter();

  useEffect(() => {
    loadThread();
  }, [userId]);

  // console.log('User ID:', userId);

  const loadThread = async () => {
    setLoading(true);
    try {
      const response = await messageAPI.getMessageThread(userId);
      setMessages(response.data?.messages);

      // Get current user ID from the first message
      if (response.data.messages.length > 0) {
        const firstMessage = response.data.messages[0];
        // Determine current user by checking which ID is not the userId param
        setCurrentUserId(
          firstMessage.sender_id === userId
            ? firstMessage.receiver_id
            : firstMessage.sender_id,
        );
      }
    } catch (error) {
      console.error('Error loading thread:', error);
      if (error.response?.status === 401) {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSent = () => {
    loadThread();
  };

  if (loading) {
    return <Loading />;
  }

  const otherUser =
    messages.length > 0
      ? messages[0].sender_id === userId
        ? {
            id: messages[0].sender_id,
            name: messages[0].sender_name,
            avatar: messages[0].sender_avater,
          }
        : {
            id: messages[0].receiver_id,
            name: messages[0].receiver_name,
            avatar: messages[0].receiver_avatar,
          }
      : null;

  return (
    <div className={styles.page}>
      <div className='container'>
        <Link className={styles.backLink} href='/messages'>
          ← Back to Messages
        </Link>

        {otherUser && (
          <div className={styles.header}>
            <div className={styles.userInfo}>
              {otherUser.avatar ? (
                <Image
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  width={60}
                  height={60}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {otherUser?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1>{otherUser.name}</h1>
                <p>Conversation</p>
              </div>
            </div>
          </div>
        )}

        <div className={styles.thread}>
          {messages.length === 0 ? (
            <div className={styles.empty}>
              <p>No messages in this conversation yet</p>
            </div>
          ) : (
            <div className={styles.messages}>
              {messages.map((message) => {
                const isSent = message.sender_id === currentUserId;
                return (
                  <div
                    className={`${styles.message} ${isSent ? styles.sent : styles.received}`}
                    key={message.id}
                  >
                    {!isSent && (
                      <div className={styles.messageAvatar}>
                        {message.sender_avatar ? (
                          <Image
                            src={message.sender_avatar}
                            alt={message.sender_name}
                            width={40}
                            height={40}
                            className={styles.smallAvatar}
                          />
                        ) : (
                          <div className={styles.smallAvatarPlaceholder}>
                            {message.sender_name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    )}

                    <div className={styles.messageContent}>
                      <div className={styles.messageBubble}>
                        {message.subject && (
                          <div className={styles.messageSubject}>
                            {message.subject}
                          </div>
                        )}
                        {message.property_title && (
                          <div className={styles.propertyTag}>
                            🏠 {message.property_title}
                          </div>
                        )}
                        <p>{message.message}</p>
                      </div>
                      <div className={styles.messageTime}>
                        {formatDate(message.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className={styles.replyForm}>
            <h3>Send a Reply</h3>
            <MessageForm
              receiverId={userId}
              propertyId={messages[0]?.property_id}
              onSuccess={handleMessageSent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
