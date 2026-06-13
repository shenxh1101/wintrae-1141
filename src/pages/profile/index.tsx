import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { Item, Organization } from '@/data/mockData';
import { mockItems, mockOrganizations } from '@/data/mockData';

const ProfilePage: React.FC = () => {
  const [userStats] = useState({
    donationCount: 12,
    helpedPeople: 28,
    charityHours: 45.5,
    myPublished: mockItems.filter(i => i.status !== '待审核').slice(0, 2),
    favoriteOrgs: mockOrganizations.slice(0, 3)
  });

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
        <View className={styles.recordList}>
          {userStats.myPublished.map((item: Item) => (
            <View key={item.id} className={styles.recordCard}>
              <Image className={styles.recordImage} src={item.images[0]} mode="aspectFill" />
              <View className={styles.recordInfo}>
                <Text className={styles.recordTitle}>{item.title}</Text>
                <Text className={styles.recordStatus}>{getStatusText(item.status)}</Text>
              </View>
              <Text className={styles.recordTime}>{item.createTime}</Text>
            </View>
          ))}
        </View>
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
          {userStats.favoriteOrgs.map((org: Organization) => (
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
