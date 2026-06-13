import React, { useState, useEffect } from 'react';
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { Item, Demand } from '@/data/mockData';
import { mockItems, mockDemands } from '@/data/mockData';

const DetailPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<Item | null>(null);
  const [demand, setDemand] = useState<Demand | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentSwiper, setCurrentSwiper] = useState(0);

  useEffect(() => {
    loadData();
  }, [router.params]);

  const loadData = () => {
    setLoading(true);
    setNotFound(false);
    
    const { id, type } = router.params;
    
    setTimeout(() => {
      if (type === 'demand') {
        const found = mockDemands.find(d => d.id === id);
        if (found) {
          setDemand(found);
          setItem(null);
        } else {
          setNotFound(true);
        }
      } else {
        const storageItems = Taro.getStorageSync('myPublishedItems') || [];
        const foundItem = [...storageItems, ...mockItems].find(i => i.id === id);
        
        if (foundItem) {
          setItem(foundItem);
          setDemand(null);
        } else {
          setNotFound(true);
        }
      }
      setLoading(false);
    }, 500);
  };

  const handleRevoke = () => {
    if (!item) return;
    
    Taro.showModal({
      title: '撤回确认',
      content: '确定要撤回这个发布吗？撤回后将无法恢复',
      success: (res) => {
        if (res.confirm) {
          updateItemStatus('已下架');
          Taro.showToast({
            title: '已撤回',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleOffline = () => {
    if (!item) return;
    
    Taro.showModal({
      title: '下架确认',
      content: '确定要下架这个物品吗？下架后将不再对外展示',
      success: (res) => {
        if (res.confirm) {
          updateItemStatus('已下架');
          Taro.showToast({
            title: '已下架',
            icon: 'success'
          });
        }
      }
    });
  };

  const updateItemStatus = (newStatus: string) => {
    if (!item) return;
    
    try {
      const storageItems = Taro.getStorageSync('myPublishedItems') || [];
      const updatedItems = storageItems.map((i: Item) => {
        if (i.id === item.id) {
          return { ...i, status: newStatus };
        }
        return i;
      });
      
      Taro.setStorageSync('myPublishedItems', updatedItems);
      
      const app = Taro.getApp();
      app.globalData = app.globalData || {};
      app.globalData.myPublishedItems = updatedItems;
      
      setItem({ ...item, status: newStatus });
    } catch (e) {
      console.error('[Detail] Failed to update item status:', e);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Taro.showToast({
      title: isFavorite ? '已取消收藏' : '已收藏',
      icon: 'success'
    });
  };

  const handleReserve = () => {
    if (!item) return;
    
    if (item.status === '待审核') {
      Taro.showToast({
        title: '物品正在审核中',
        icon: 'none'
      });
      return;
    }
    
    if (item.status !== '已上架') {
      Taro.showToast({
        title: '该物品暂不可预约',
        icon: 'none'
      });
      return;
    }

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

  const handleGoBack = () => {
    Taro.navigateBack().catch(() => {
      Taro.switchTab({
        url: '/pages/profile/index'
      });
    });
  };

  const handleGoToProfile = () => {
    Taro.switchTab({
      url: '/pages/profile/index'
    });
  };

  if (loading) {
    return (
      <View className={styles.page}>
        <View className={styles.loadingState}>
          <Text className={styles.loadingIcon}>⏳</Text>
          <Text className={styles.loadingText}>加载中...</Text>
        </View>
      </View>
    );
  }

  if (notFound) {
    return (
      <View className={styles.page}>
        <View className={styles.notFoundState}>
          <Text className={styles.notFoundIcon}>❌</Text>
          <Text className={styles.notFoundTitle}>内容不存在</Text>
          <Text className={styles.notFoundHint}>
            该物品可能已被删除、下架或不存在
          </Text>
          <View className={styles.notFoundActions}>
            <View className={styles.backBtn} onClick={handleGoBack}>
              <Text className={styles.backBtnText}>返回上一页</Text>
            </View>
            <View 
              className={styles.homeBtn}
              onClick={handleGoToProfile}
            >
              <Text className={styles.homeBtnText}>去我的发布</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (!item && !demand) {
    return (
      <View className={styles.page}>
        <View className={styles.notFoundState}>
          <Text className={styles.notFoundIcon}>❌</Text>
          <Text className={styles.notFoundTitle}>数据加载失败</Text>
          <Text className={styles.notFoundHint}>请稍后重试</Text>
          <View className={styles.notFoundActions}>
            <View className={styles.backBtn} onClick={loadData}>
              <Text className={styles.backBtnText}>重新加载</Text>
            </View>
          </View>
        </View>
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

  const getStatusText = () => {
    if (!item) return '';
    const statusMap: Record<string, string> = {
      '待审核': '等待审核',
      '已上架': '正在等待领取',
      '已被预约': '已被预约',
      '已完成': '已完成捐赠',
      '已下架': '已下架'
    };
    return statusMap[item.status] || item.status;
  };

  const getStatusStyle = () => {
    if (!item) return {};
    switch (item.status) {
      case '待审核':
        return { color: '#ff9500', backgroundColor: 'rgba(255, 149, 0, 0.1)' };
      case '已被预约':
        return { color: '#576b95', backgroundColor: 'rgba(87, 107, 149, 0.1)' };
      case '已完成':
        return { color: '#07c160', backgroundColor: 'rgba(7, 193, 96, 0.1)' };
      default:
        return { color: '#999999', backgroundColor: 'rgba(153, 153, 153, 0.1)' };
    }
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
          <View className={styles.titleRow}>
            <Text className={styles.title}>{displayItem.title}</Text>
            {item && (
              <View className={styles.statusBadge} style={getStatusStyle()}>
                {getStatusText()}
              </View>
            )}
          </View>
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

        {item && (
          <View className={styles.actionBar}>
            {item.status === '待审核' && (
              <>
                <View className={`${styles.actionBtn} ${styles.favorite}`} onClick={handleFavorite}>
                  {isFavorite ? '❤️' : '🤍'}
                </View>
                <View className={`${styles.actionBtn} ${styles.revoke}`} onClick={handleRevoke}>
                  撤回发布
                </View>
              </>
            )}
            
            {(item.status === '已上架' || item.status === '已被预约') && (
              <>
                <View className={`${styles.actionBtn} ${styles.favorite}`} onClick={handleFavorite}>
                  {isFavorite ? '❤️' : '🤍'}
                </View>
                <View className={`${styles.actionBtn} ${styles.offline}`} onClick={handleOffline}>
                  下架物品
                </View>
                <View className={`${styles.actionBtn} ${styles.reserve}`} onClick={handleReserve}>
                  立即预约
                </View>
              </>
            )}
            
            {item.status === '待审核' && (
              <View className={`${styles.actionBtn} ${styles.pending}`}>
                ⏳ 等待审核中
              </View>
            )}
            
            {(item.status === '已完成' || item.status === '已下架') && (
              <View className={`${styles.actionBtn} ${styles.completed}`} onClick={handleGoToProfile}>
                返回我的发布
              </View>
            )}
          </View>
        )}
        
        {!item && (
          <View className={styles.actionBar}>
            <View className={`${styles.actionBtn} ${styles.favorite}`} onClick={handleFavorite}>
              {isFavorite ? '❤️' : '🤍'}
            </View>
            <View className={`${styles.actionBtn} ${styles.reserve}`} onClick={handleReserve}>
              我想捐赠
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DetailPage;
