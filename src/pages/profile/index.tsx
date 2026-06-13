import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { Item, Organization } from '@/data/mockData';
import { mockItems, mockOrganizations } from '@/data/mockData';

const ProfilePage: React.FC = () => {
  const [myPublished, setMyPublished] = useState<Item[]>([]);
  const [favoriteOrgs] = useState<Organization[]>(mockOrganizations.slice(0, 3));

  useDidShow(() => {
    loadMyPublished();
  });

  useEffect(() => {
    loadMyPublished();
  }, []);

  const loadMyPublished = () => {
    const app = Taro.getApp();
    const globalPublished = app.globalData?.myPublishedItems || [];
    const allPublished = [...globalPublished, ...mockItems.filter(i => i.status !== '待审核')];
    setMyPublished(allPublished);
  };

  const userStats = {
    donationCount: myPublished.filter(i => i.status === '已完成').length,
    helpedPeople: myPublished.filter(i => i.status !== '待审核').length,
    charityHours: (myPublished.filter(i => i.status === '已完成').length * 3.5).toFixed(1)
  };

  const handleSettings = () => {
    Taro.showToast({
      title: '设置功能开发中',
      icon: 'none'
    });
  };

  const handleViewRecord = (type: string) => {
    Taro.showToast({
      title: `${type}功能开发中`,
      icon: 'none'
    });
  };

  const handleViewOrg = (orgId: string) => {
    Taro.navigateTo({
      url: `/pages/org/index?id=${orgId}`
    });
  };

  const handleViewItem = (itemId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${itemId}`
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      '待审核': '等待审核',
      '已上架': '正在等待领取',
      '已被预约': '已被预约',
      '已完成': '已完成捐赠',
      '已下架': '已下架'
    };
    return statusMap[status] || status;
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
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
    <View className={styles.page}>
      <View className={styles.profileHeader}>
        <View className={styles.userInfo}>
          <Image 
            className={styles.avatar} 
            src="https://picsum.photos/id/64/200/200" 
          />
          <View className={styles.info}>
            <Text className={styles.nickname}>爱心用户</Text>
            <Text className={styles.userId}>ID: 100001</Text>
          </View>
          <View className={styles.settingsBtn} onClick={handleSettings}>
            ⚙️
          </View>
        </View>
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{userStats.donationCount}</Text>
            <Text className={styles.statLabel}>捐赠次数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{userStats.helpedPeople}</Text>
            <Text className={styles.statLabel}>帮助人数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{userStats.charityHours}h</Text>
            <Text className={styles.statLabel}>公益时长</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>我的发布</Text>
          <Text 
            className={styles.moreLink}
            onClick={() => handleViewRecord('我的发布')}
          >
            查看全部 ›
          </Text>
        </View>
        {myPublished.length > 0 ? (
          <View className={styles.recordList}>
            {myPublished.map((item: Item) => (
              <View 
                key={item.id} 
                className={styles.recordCard}
                onClick={() => handleViewItem(item.id)}
              >
                <Image className={styles.recordImage} src={item.images[0]} mode="aspectFill" />
                <View className={styles.recordInfo}>
                  <Text className={styles.recordTitle}>{item.title}</Text>
                  <View 
                    className={styles.recordStatus}
                    style={getStatusStyle(item.status)}
                  >
                    {getStatusText(item.status)}
                  </View>
                </View>
                <View className={styles.recordMeta}>
                  <Text className={styles.recordTime}>{item.createTime}</Text>
                  <Text className={styles.recordPoint}>{item.pickPoint}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyRecord}>
            <Text className={styles.emptyIcon}>📦</Text>
            <Text className={styles.emptyText}>暂无发布记录</Text>
            <Text className={styles.emptyHint}>点击底部"发布"开始您的第一次捐赠</Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>收藏的组织</Text>
          <Text 
            className={styles.moreLink}
            onClick={() => handleViewRecord('收藏组织')}
          >
            查看全部 ›
          </Text>
        </View>
        <View className={styles.orgList}>
          {favoriteOrgs.map((org: Organization) => (
            <View 
              key={org.id} 
              className={styles.orgCard}
              onClick={() => handleViewOrg(org.id)}
            >
              <Image className={styles.orgAvatar} src={org.avatar} mode="aspectFill" />
              <View className={styles.orgInfo}>
                <Text className={styles.orgName}>{org.name}</Text>
                <Text className={styles.orgDesc}>{org.description}</Text>
              </View>
              {org.verified && (
                <View className={styles.verifiedTag}>已认证</View>
              )}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.menuCard}>
          <View className={styles.menuItem} onClick={() => handleViewRecord('我的预约')}>
            <View className={styles.menuIcon}>📅</View>
            <Text className={styles.menuLabel}>我的预约</Text>
            <Text className={styles.arrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleViewRecord('捐赠历史')}>
            <View className={styles.menuIcon}>📋</View>
            <Text className={styles.menuLabel}>捐赠历史</Text>
            <Text className={styles.arrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleViewRecord('公益证书')}>
            <View className={styles.menuIcon}>🏆</View>
            <Text className={styles.menuLabel}>公益证书</Text>
            <Text className={styles.arrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleViewRecord('帮助中心')}>
            <View className={styles.menuIcon}>❓</View>
            <Text className={styles.menuLabel}>帮助中心</Text>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfilePage;
