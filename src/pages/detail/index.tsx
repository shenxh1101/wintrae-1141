import React, { useState, useEffect } from 'react';
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { Item, Demand } from '@/data/mockData';
import { mockItems, mockDemands } from '@/data/mockData';

const DetailPage: React.FC = () => {
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [demand, setDemand] = useState<Demand | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentSwiper, setCurrentSwiper] = useState(0);

  useEffect(() => {
    const { id, type } = router.params;
    if (type === 'demand') {
      const found = mockDemands.find(d => d.id === id);
      setDemand(found || null);
    } else {
      const found = mockItems.find(i => i.id === id);
      setItem(found || null);
    }
  }, [router.params]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Taro.showToast({
      title: isFavorite ? '已取消收藏' : '已收藏',
      icon: 'success'
    });
  };

  const handleReserve = () => {
    Taro.showModal({
      title: '预约确认',
      content: '确定要预约这个物品吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '预约成功',
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

  const handleNavigate = () => {
    Taro.showToast({
      title: '正在打开地图导航',
      icon: 'none'
    });
  };

  if (!item && !demand) {
    return (
      <View style={{ padding: '100rpx', textAlign: 'center' }}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const displayItem = item || {
    id: demand?.id,
    title: demand?.title,
    category: demand?.category,
    description: demand?.description,
    images: demand?.orgAvatar ? [demand.orgAvatar] : ['https://picsum.photos/id/292/300/300'],
    pickPoint: demand?.pickPoint,
    pickPointAddress: demand?.pickPointAddress,
    availableTime: demand?.deadline,
    userName: demand?.orgName,
    userAvatar: demand?.orgAvatar,
    createTime: demand?.createTime
  };

  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        <Swiper
          className={styles.imageSwiper}
          indicatorDots
          autoplay={false}
          current={currentSwiper}
          onChange={(e) => setCurrentSwiper(e.detail.current)}
        >
          {displayItem.images.map((img, index) => (
            <SwiperItem key={index} className={styles.swiperItem}>
              <Image src={img} mode="aspectFill" />
            </SwiperItem>
          ))}
        </Swiper>

        <View className={styles.infoSection}>
          <Text className={styles.title}>{displayItem.title}</Text>
          <View className={styles.tags}>
            <View className={styles.tag}>{displayItem.category}</View>
            {item && (
              <View className={`${styles.tag} ${styles.conditionTag}`}>
                {item.condition}
              </View>
            )}
          </View>
          <Text className={styles.description}>{displayItem.description}</Text>
        </View>

        <View className={styles.pickPointSection}>
          <Text className={styles.sectionTitle}>领取地点</Text>
          <View className={styles.pickPointCard}>
            <Text className={styles.pointName}>{displayItem.pickPoint}</Text>
            <Text className={styles.pointAddress}>{displayItem.pickPointAddress}</Text>
            <Text className={styles.pointTime}>
              {item ? `可交接时间: ${item.availableTime}` : `截止时间: ${demand?.deadline}`}
            </Text>
          </View>
          <View className={styles.navigateBtn} onClick={handleNavigate}>
            🗺️ 导航到这里
          </View>
        </View>

        <View className={styles.userSection}>
          <Text className={styles.sectionTitle}>发布者</Text>
          <View className={styles.userCard}>
            <Image className={styles.avatar} src={displayItem.userAvatar} />
            <View className={styles.userInfo}>
              <Text className={styles.userName}>{displayItem.userName}</Text>
              <Text className={styles.publishTime}>发布于 {displayItem.createTime}</Text>
            </View>
          </View>
        </View>

        <View className={styles.actionBar}>
          <View className={`${styles.actionBtn} ${styles.favorite}`} onClick={handleFavorite}>
            {isFavorite ? '❤️' : '🤍'}
          </View>
          <View className={`${styles.actionBtn} ${styles.reserve}`} onClick={handleReserve}>
            立即预约
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailPage;
