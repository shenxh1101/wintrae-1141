import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { Appointment } from '@/data/mockData';
import { mockAppointments } from '@/data/mockData';

const HandoverPage: React.FC = () => {
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const { id } = router.params;
    const found = mockAppointments.find(apt => apt.id === id);
    setAppointment(found || null);
  }, [router.params]);

  const handleConfirm = () => {
    if (!appointment) return;

    Taro.showModal({
      title: '确认交接',
      content: '请确认物品已成功交付',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '交接完成',
            icon: 'success'
          });
          setTimeout(() => {
            Taro.switchTab({
              url: '/pages/appointment/index'
            });
          }, 1500);
        }
      }
    });
  };

  const handleContact = (type: string) => {
    Taro.showToast({
      title: `正在联系${type}`,
      icon: 'none'
    });
  };

  if (!appointment) {
    return (
      <View style={{ padding: '100rpx', textAlign: 'center' }}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case '待交接': return styles.pending;
      case '交接中': return styles.processing;
      case '已完成': return styles.completed;
      default: return '';
    }
  };

  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        <View className={styles.handoverCodeCard}>
          <Text className={styles.codeLabel}>交接码</Text>
          <Text className={styles.codeValue}>{appointment.handoverCode}</Text>
          <Text className={styles.codeHint}>请在交接点向工作人员出示此码</Text>
        </View>

        <View className={styles.statusCard}>
          <View className={styles.cardHeader}>
            <Image className={styles.itemImage} src={appointment.itemImage} mode="aspectFill" />
            <View className={styles.itemInfo}>
              <Text className={styles.itemTitle}>{appointment.itemTitle}</Text>
              <View className={`${styles.statusTag} ${getStatusClass(appointment.status)}`}>
                {appointment.status}
              </View>
            </View>
          </View>

          <View className={styles.infoSection}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>交接地点</Text>
              <Text className={styles.infoValue}>{appointment.pickPoint}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>详细地址</Text>
              <Text className={styles.infoValue}>{appointment.pickPointAddress}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>预约时间</Text>
              <Text className={styles.infoValue}>{appointment.appointmentTime}</Text>
            </View>
          </View>
        </View>

        <View className={styles.partiesCard}>
          <Text className={styles.sectionTitle}>交接双方</Text>
          <View className={styles.partyItem}>
            <Image 
              className={styles.partyAvatar} 
              src="https://picsum.photos/id/64/200/200" 
            />
            <View className={styles.partyInfo}>
              <Text className={styles.partyName}>{appointment.donorName}</Text>
              <Text className={styles.partyRole}>捐赠人</Text>
            </View>
            <View className={styles.contactBtn} onClick={() => handleContact('捐赠人')}>
              联系
            </View>
          </View>
          <View className={styles.partyItem}>
            <Image 
              className={styles.partyAvatar} 
              src="https://picsum.photos/id/91/200/200" 
            />
            <View className={styles.partyInfo}>
              <Text className={styles.partyName}>{appointment.receiverName}</Text>
              <Text className={styles.partyRole}>领取人</Text>
            </View>
            <View className={styles.contactBtn} onClick={() => handleContact('领取人')}>
              联系
            </View>
          </View>
        </View>

        {appointment.status !== '已完成' && (
          <View className={styles.actionCard}>
            <View className={styles.actionBtn} onClick={handleConfirm}>
              确认完成交接
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HandoverPage;
