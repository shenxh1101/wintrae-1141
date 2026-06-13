import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { Appointment } from '@/data/mockData';
import { mockAppointments } from '@/data/mockData';
import DataManager from '@/data/dataManager';

type TabType = 'pending' | 'processing' | 'completed';

const AppointmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useDidShow(() => {
    loadAppointments();
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const storageAppointments = DataManager.getAppointments();
    if (storageAppointments.length > 0) {
      setAppointments([...storageAppointments]);
    } else {
      DataManager.setAppointments(mockAppointments);
      setAppointments([...mockAppointments]);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    switch (activeTab) {
      case 'pending':
        return apt.status === '待交接';
      case 'processing':
        return apt.status === '交接中';
      case 'completed':
        return apt.status === '已完成';
      default:
        return true;
    }
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case '待交接':
        return styles.pending;
      case '交接中':
        return styles.processing;
      case '已完成':
        return styles.completed;
      case '已取消':
        return styles.cancelled;
      default:
        return '';
    }
  };

  const handleConfirmHandover = (aptId: string) => {
    Taro.showModal({
      title: '确认交接',
      content: '请确认您已收到物品并完成交接',
      success: (res) => {
        if (res.confirm) {
          const updated = DataManager.updateAppointment(aptId, {
            status: '已完成',
            completeTime: new Date().toLocaleString('zh-CN')
          });
          
          setAppointments([...DataManager.getAppointments()]);

          DataManager.addMessage({
            id: `msg_${Date.now()}`,
            type: '交接',
            title: '物品交接已完成',
            content: '恭喜！您的爱心物资已成功交付，感谢您的捐赠',
            status: '未读',
            createTime: new Date().toLocaleString('zh-CN'),
            relatedId: aptId
          });
          
          Taro.showToast({
            title: '交接完成',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleViewHandover = (aptId: string) => {
    Taro.navigateTo({
      url: `/pages/handover/index?id=${aptId}`
    });
  };

  const handleRate = (aptId: string) => {
    Taro.navigateTo({
      url: `/pages/handover/index?id=${aptId}&action=rate`
    });
  };

  const renderStars = (rating?: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text 
          key={i} 
          className={`${styles.star} ${rating && i <= rating ? styles.active : ''}`}
        >
          ★
        </Text>
      );
    }
    return stars;
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabBar}>
        <View 
          className={`${styles.tabItem} ${activeTab === 'pending' ? styles.active : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          待交接
        </View>
        <View 
          className={`${styles.tabItem} ${activeTab === 'processing' ? styles.active : ''}`}
          onClick={() => setActiveTab('processing')}
        >
          交接中
        </View>
        <View 
          className={`${styles.tabItem} ${activeTab === 'completed' ? styles.active : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          已完成
        </View>
      </View>

      <ScrollView scrollY>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => (
            <View key={apt.id} className={styles.appointmentCard}>
              <View className={styles.cardHeader}>
                <Image className={styles.itemImage} src={apt.itemImage} mode="aspectFill" />
                <View className={styles.itemInfo}>
                  <Text className={styles.itemTitle}>{apt.itemTitle}</Text>
                  <View className={`${styles.statusTag} ${getStatusClass(apt.status)}`}>
                    {apt.status}
                  </View>
                </View>
              </View>

              <View className={styles.infoSection}>
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>交接地点</Text>
                  <Text className={styles.infoValue}>{apt.pickPoint}</Text>
                </View>
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>详细地址</Text>
                  <Text className={styles.infoValue}>{apt.pickPointAddress}</Text>
                </View>
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>预约时间</Text>
                  <Text className={styles.infoValue}>{apt.appointmentTime}</Text>
                </View>
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>捐赠人</Text>
                  <Text className={styles.infoValue}>{apt.donorName}</Text>
                </View>
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>领取人</Text>
                  <Text className={styles.infoValue}>{apt.receiverName}</Text>
                </View>
              </View>

              {apt.status === '待交接' && (
                <View className={styles.handoverCode}>
                  <Text className={styles.codeLabel}>交接码</Text>
                  <Text className={styles.codeValue}>{apt.handoverCode}</Text>
                </View>
              )}

              <View className={styles.actionButtons}>
                {apt.status === '待交接' && (
                  <>
                    <View 
                      className={`${styles.btn} ${styles.primary}`}
                      onClick={() => handleConfirmHandover(apt.id)}
                    >
                      确认收取
                    </View>
                    <View 
                      className={`${styles.btn} ${styles.secondary}`}
                      onClick={() => handleViewHandover(apt.id)}
                    >
                      查看详情
                    </View>
                  </>
                )}
                {apt.status === '交接中' && (
                  <>
                    <View 
                      className={`${styles.btn} ${styles.primary}`}
                      onClick={() => handleConfirmHandover(apt.id)}
                    >
                      完成交接
                    </View>
                    <View 
                      className={`${styles.btn} ${styles.secondary}`}
                      onClick={() => handleViewHandover(apt.id)}
                    >
                      查看详情
                    </View>
                  </>
                )}
                {apt.status === '已完成' && (
                  <>
                    <View 
                      className={`${styles.btn} ${styles.secondary}`}
                      onClick={() => handleRate(apt.id)}
                    >
                      {apt.rating ? '查看评价' : '评价'}
                    </View>
                    <View 
                      className={`${styles.btn} ${styles.secondary}`}
                      onClick={() => handleViewHandover(apt.id)}
                    >
                      查看详情
                    </View>
                  </>
                )}
              </View>

              {apt.status === '已完成' && apt.rating && (
                <View className={styles.ratingSection}>
                  <View className={styles.ratingHeader}>
                    <Text className={styles.ratingLabel}>我的评价</Text>
                    <View className={styles.ratingStars}>
                      {renderStars(apt.rating)}
                    </View>
                  </View>
                  {apt.ratingContent && (
                    <Text className={styles.ratingContent}>"{apt.ratingContent}"</Text>
                  )}
                </View>
              )}
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无交接记录</Text>
            <Text className={styles.emptyHint}>
              {activeTab === 'pending' && '您没有待交接的物品'}
              {activeTab === 'processing' && '您没有正在交接的物品'}
              {activeTab === 'completed' && '您还没有完成任何交接'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AppointmentPage;
