import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { Organization } from '@/data/mockData';
import { mockOrganizations } from '@/data/mockData';

const OrgPage: React.FC = () => {
  const router = useRouter();
  const [org, setOrg] = useState<Organization | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const { id } = router.params;
    const found = mockOrganizations.find(o => o.id === id);
    setOrg(found || null);
  }, [router.params]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Taro.showToast({
      title: isFavorite ? '已取消收藏' : '已收藏',
      icon: 'success'
    });
  };

  const handleFollow = () => {
    Taro.showToast({
      title: '关注成功',
      icon: 'success'
    });
  };

  const handleNavigate = () => {
    Taro.showToast({
      title: '正在打开地图导航',
      icon: 'none'
    });
  };

  if (!org) {
    return (
      <View style={{ padding: '100rpx', textAlign: 'center' }}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView scrollY>
        <View className={styles.page}>
          <View className={styles.header}>
            <Image className={styles.avatar} src={org.avatar} mode="aspectFill" />
            <Text className={styles.name}>{org.name}</Text>
            {org.verified && (
              <View className={styles.verifiedTag}>已认证组织</View>
            )}
            <View className={styles.stats}>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>{org.followCount}</Text>
                <Text className={styles.statLabel}>关注者</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>{org.pickPoints.length}</Text>
                <Text className={styles.statLabel}>领取点</Text>
              </View>
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>组织简介</Text>
            <Text className={styles.description}>{org.description}</Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>联系方式</Text>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>联系电话</Text>
              <Text className={styles.infoValue}>{org.contact}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>组织地址</Text>
              <Text className={styles.infoValue}>{org.address}</Text>
            </View>
          </View>

          <View className={styles.pickPointsSection}>
            <Text className={styles.sectionTitle}>领取点信息</Text>
            {org.pickPoints.map((point) => (
              <View key={point.id} className={styles.pointCard}>
                <View className={styles.pointHeader}>
                  <Text className={styles.pointName}>{point.name}</Text>
                  <Text className={styles.distance}>{point.distance}</Text>
                </View>
                <View className={styles.pointInfo}>
                  <Text className={styles.infoItem}>📍 {point.address}</Text>
                  <Text className={styles.infoItem}>🕐 {point.workTime}</Text>
                  <Text className={styles.infoItem}>📞 {point.phone}</Text>
                </View>
                <View className={styles.navigateBtn} onClick={handleNavigate}>
                  导航到这里
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className={styles.actionBar}>
        <View className={`${styles.actionBtn} ${styles.favorite}`} onClick={handleFavorite}>
          {isFavorite ? '❤️' : '🤍'}
        </View>
        <View className={`${styles.actionBtn} ${styles.follow}`} onClick={handleFollow}>
          关注组织
        </View>
      </View>
    </>
  );
};

export default OrgPage;
