import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { Appointment } from '@/data/mockData';
import { mockAppointments } from '@/data/mockData';

const HandoverPage: React.FC = () => {
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [ratingContent, setRatingContent] = useState('');
  const [itemCondition, setItemCondition] = useState('');

  useEffect(() => {
    loadAppointment();
    
    if (router.params.action === 'rate') {
      setShowRatingModal(true);
    }
  }, [router.params]);

  const loadAppointment = () => {
    const { id } = router.params;
    const app = Taro.getApp();
    const globalAppointments = app.globalData?.appointments || mockAppointments;
    const found = globalAppointments.find(apt => apt.id === id);
    setAppointment(found || null);
  };

  const handleConfirm = () => {
    if (!appointment) return;

    Taro.showModal({
      title: '确认交接',
      content: '请确认物品已成功交付',
      success: (res) => {
        if (res.confirm) {
          const app = Taro.getApp();
          const globalAppointments = app.globalData?.appointments || mockAppointments;
          const updated = globalAppointments.map((apt) => {
            if (apt.id === appointment.id) {
              return { 
                ...apt, 
                status: '已完成' as const,
                completeTime: new Date().toLocaleString('zh-CN')
              };
            }
            return apt;
          });
          
          app.globalData = app.globalData || {};
          app.globalData.appointments = updated;
          
          setAppointment({
            ...appointment,
            status: '已完成',
            completeTime: new Date().toLocaleString('zh-CN')
          });
          
          Taro.showToast({
            title: '交接完成',
            icon: 'success'
          });
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

  const handleSubmitRating = () => {
    if (!appointment || !ratingContent.trim()) {
      Taro.showToast({
        title: '请填写评价内容',
        icon: 'none'
      });
      return;
    }

    const app = Taro.getApp();
    const globalAppointments = app.globalData?.appointments || mockAppointments;
    const updated = globalAppointments.map((apt) => {
      if (apt.id === appointment.id) {
        return { 
          ...apt, 
          rating,
          ratingContent,
          itemCondition
        };
      }
      return apt;
    });
    
    app.globalData = app.globalData || {};
    app.globalData.appointments = updated;
    
    setAppointment({
      ...appointment,
      rating,
      ratingContent,
      itemCondition
    });
    
    setShowRatingModal(false);
    
    Taro.showToast({
      title: '评价提交成功',
      icon: 'success'
    });
  };

  if (!appointment) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>❌</Text>
          <Text className={styles.emptyText}>未找到该交接记录</Text>
          <View className={styles.backBtn} onClick={() => Taro.navigateBack()}>
            <Text className={styles.backBtnText}>返回上一页</Text>
          </View>
        </View>
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

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text 
          key={i} 
          className={`${styles.star} ${i <= rating ? styles.active : ''}`}
          onClick={() => setRating(i)}
        >
          ★
        </Text>
      );
    }
    return stars;
  };

  return (
    <>
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
              {appointment.completeTime && (
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>完成时间</Text>
                  <Text className={styles.infoValue}>{appointment.completeTime}</Text>
                </View>
              )}
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

          {appointment.status === '已完成' && appointment.rating && (
            <View className={styles.ratingDisplayCard}>
              <Text className={styles.sectionTitle}>评价信息</Text>
              <View className={styles.ratingHeader}>
                <Text className={styles.ratingLabel}>物资状态</Text>
                <Text className={styles.ratingValue}>{appointment.itemCondition || '未填写'}</Text>
              </View>
              <View className={styles.ratingHeader}>
                <Text className={styles.ratingLabel}>评分</Text>
                <View className={styles.ratingStars}>
                  {[1,2,3,4,5].map(i => (
                    <Text 
                      key={i}
                      className={`${styles.starDisplay} ${i <= (appointment?.rating || 0) ? styles.active : ''}`}
                    >
                      ★
                    </Text>
                  ))}
                </View>
              </View>
              <View className={styles.ratingContentBox}>
                <Text className={styles.ratingContentLabel}>评价内容</Text>
                <Text className={styles.ratingContentText}>{appointment.ratingContent}</Text>
              </View>
            </View>
          )}

          {appointment.status !== '已完成' && (
            <View className={styles.actionCard}>
              <View className={styles.actionBtn} onClick={handleConfirm}>
                确认完成交接
              </View>
            </View>
          )}

          {appointment.status === '已完成' && !appointment.rating && (
            <View className={styles.actionCard}>
              <View 
                className={`${styles.actionBtn} ${styles.ratingBtn}`} 
                onClick={() => setShowRatingModal(true)}
              >
                立即评价
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {showRatingModal && (
        <View className={styles.ratingModal}>
          <View className={styles.ratingModalContent}>
            <Text className={styles.ratingModalTitle}>评价交接</Text>
            
            <View className={styles.ratingFormItem}>
              <Text className={styles.ratingFormLabel}>物资状态</Text>
              <View className={styles.conditionSelect}>
                {['完好', '轻微瑕疵', '损坏'].map(cond => (
                  <View 
                    key={cond}
                    className={`${styles.conditionOption} ${itemCondition === cond ? styles.active : ''}`}
                    onClick={() => setItemCondition(cond)}
                  >
                    {cond}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.ratingFormItem}>
              <Text className={styles.ratingFormLabel}>服务评分</Text>
              <View className={styles.starsContainer}>
                {renderStars()}
              </View>
            </View>

            <View className={styles.ratingFormItem}>
              <Text className={styles.ratingFormLabel}>评价内容</Text>
              <Textarea
                className={styles.ratingTextarea}
                placeholder="请描述您的捐赠体验..."
                value={ratingContent}
                onInput={(e) => setRatingContent(e.detail.value)}
              />
            </View>

            <View className={styles.ratingModalActions}>
              <View 
                className={`${styles.ratingModalBtn} ${styles.cancel}`}
                onClick={() => setShowRatingModal(false)}
              >
                取消
              </View>
              <View 
                className={`${styles.ratingModalBtn} ${styles.confirm}`}
                onClick={handleSubmitRating}
              >
                提交评价
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default HandoverPage;
