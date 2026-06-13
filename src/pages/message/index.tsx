import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { Message } from '@/data/mockData';
import { mockMessages } from '@/data/mockData';

type TabType = 'all' | 'unread';

const MessagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const filteredMessages = activeTab === 'all' 
    ? messages 
    : messages.filter(m => m.status === '未读');

  const unreadCount = messages.filter(m => m.status === '未读').length;

  const getTypeTagClass = (type: string) => {
    switch (type) {
      case '审核': return styles.audit;
      case '预约': return styles.appointment;
      case '交接': return styles.handover;
      case '评价': return styles.rating;
      default: return '';
    }
  };

  const handleMessageClick = (msg: Message) => {
    if (msg.status === '未读') {
      const updated = messages.map((m) => {
        if (m.id === msg.id) {
          return { ...m, status: '已读' as const };
        }
        return m;
      });
      setMessages(updated);
    }

    if (msg.relatedId) {
      if (msg.type === '审核' || msg.type === '预约') {
        Taro.navigateTo({
          url: `/pages/detail/index?id=${msg.relatedId}`
        });
      } else if (msg.type === '交接') {
        Taro.navigateTo({
          url: `/pages/handover/index?id=${msg.relatedId}`
        });
      }
    }
  };

  const handleMarkAllRead = () => {
    const updated = messages.map((m) => ({ ...m, status: '已读' as const }));
    setMessages(updated);
    Taro.showToast({
      title: '已全部标记为已读',
      icon: 'success'
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabBar}>
        <View 
          className={`${styles.tabItem} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => setActiveTab('all')}
        >
          全部消息
        </View>
        <View 
          className={`${styles.tabItem} ${activeTab === 'unread' ? styles.active : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          未读消息
          {unreadCount > 0 && (
            <View className={styles.tabBadge}>{unreadCount}</View>
          )}
        </View>
      </View>

      {unreadCount > 0 && activeTab === 'all' && (
        <View 
          style={{
            padding: '24rpx 32rpx',
            textAlign: 'right'
          }}
          onClick={handleMarkAllRead}
        >
          <Text style={{
            fontSize: '24rpx',
            color: '#07c160'
          }}>
            全部标为已读
          </Text>
        </View>
      )}

      <ScrollView className={styles.messageList} scrollY>
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <View 
              key={msg.id}
              className={`${styles.messageCard} ${msg.status === '未读' ? styles.unread : ''}`}
              onClick={() => handleMessageClick(msg)}
            >
              <View className={styles.messageHeader}>
                <View className={`${styles.typeTag} ${getTypeTagClass(msg.type)}`}>
                  {msg.type}
                </View>
                <Text className={styles.title}>{msg.title}</Text>
                <Text className={styles.time}>{msg.createTime}</Text>
              </View>
              <Text className={styles.content}>{msg.content}</Text>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🔔</Text>
            <Text className={styles.emptyText}>
              {activeTab === 'all' ? '暂无消息' : '暂无未读消息'}
            </Text>
            <Text className={styles.emptyHint}>
              {activeTab === 'all' ? '消息通知将在这里显示' : '您已阅读所有消息'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MessagePage;
