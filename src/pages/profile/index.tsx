import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { Item, Organization } from '@/data/mockData';
import { mockOrganizations } from '@/data/mockData';
import DataManager from '@/data/dataManager';

type TabType = 'pending' | 'available' | 'completed';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [myPublished, setMyPublished] = useState<Item[]>([]);
  const [favoriteOrgs] = useState<Organization[]>(mockOrganizations.slice(0, 3));

  useDidShow(() => {
    loadMyPublished();
  });

  useEffect(() => {
    loadMyPublished();
  }, []);

  const loadMyPublished = () => {
    const items = DataManager.getMyPublishedItems();
    setMyPublished([...items]);
  };

  const filteredItems = myPublished.filter((item) => {
    switch (activeTab) {
      case 'pending':
        return item.status === '待审核';
      case 'available':
        return item.status === '已上架' || item.status === '已被预约';
      case 'completed':
        return item.status === '已完成' || item.status === '已下架';
      default:
        return true;
    }
  });

  const tabCounts = {
    pending: myPublished.filter(i => i.status === '待审核').length,
    available: myPublished.filter(i => i.status === '已上架' || i.status === '已被预约').length,
    completed: myPublished.filter(i => i.status === '已完成' || i.status === '已下架').length
  };

  const userStats = {
    donationCount: myPublished.filter(i => i.status === '已完成').length,
    helpedPeople: myPublished.filter(i => i.status !== '待审核' && i.status !== '已下架').length,
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

  const handleRevoke = (itemId: string, e: any) => {
    e.stopPropagation();
    
    Taro.showModal({
      title: '撤回确认',
      content: '确定要撤回这个发布吗？撤回后将无法恢复',
      success: (res) => {
        if (res.confirm) {
          DataManager.updatePublishedItem(itemId, { status: '已下架' });
          setMyPublished([...DataManager.getMyPublishedItems()]);
          
          DataManager.addMessage({
            id: `msg_${Date.now()}`,
            type: '审核',
            title: '您的物品已下架',
            content: '您的物品已成功下架，如需重新发布请前往发布页',
            status: '未读',
            createTime: new Date().toLocaleString('zh-CN'),
            relatedId: itemId
          });
          
          Taro.showToast({
            title: '已撤回',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleOffline = (itemId: string, e: any) => {
    e.stopPropagation();
    
    Taro.showModal({
      title: '下架确认',
      content: '确定要下架这个物品吗？下架后将不再对外展示',
      success: (res) => {
        if (res.confirm) {
          DataManager.updatePublishedItem(itemId, { status: '已下架' });
          setMyPublished([...DataManager.getMyPublishedItems()]);
          
          DataManager.addMessage({
            id: `msg_${Date.now()}`,
            type: '审核',
            title: '您的物品已下架',
            content: '您的物品已成功下架，如需重新发布请前往发布页',
            status: '未读',
            createTime: new Date().toLocaleString('zh-CN'),
            relatedId: itemId
          });
          
          Taro.showToast({
            title: '已下架',
            icon: 'success'
          });
        }
      }
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
      case '已下架':
        return { color: '#999999', backgroundColor: 'rgba(153, 153, 153, 0.1)' };
      default:
        return { color: '#07c160', backgroundColor: 'rgba(7, 193, 96, 0.1)' };
    }
  };

  const getStepText = (status: string) => {
    switch (status) {
      case '待审核':
        return '等待平台审核';
      case '已上架':
        return '审核通过，等待领取';
      case '已被预约':
        return '已有人预约，等待交接';
      case '已完成':
        return '已完成捐赠';
      case '已下架':
        return '已下架';
      default:
        return '';
    }
  };

  const getProgressStep = (status: string) => {
    switch (status) {
      case '待审核':
        return 1;
      case '已上架':
        return 2;
      case '已被预约':
        return 3;
      case '已完成':
        return 4;
      default:
        return 0;
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
        </View>

        <View className={styles.tabBar}>
          <View 
            className={`${styles.tabItem} ${activeTab === 'pending' ? styles.active : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            待审核
            {tabCounts.pending > 0 && (
              <View className={styles.tabBadge}>{tabCounts.pending}</View>
            )}
          </View>
          <View 
            className={`${styles.tabItem} ${activeTab === 'available' ? styles.active : ''}`}
            onClick={() => setActiveTab('available')}
          >
            待领取
            {tabCounts.available > 0 && (
              <View className={styles.tabBadge}>{tabCounts.available}</View>
            )}
          </View>
          <View 
            className={`${styles.tabItem} ${activeTab === 'completed' ? styles.active : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            已完成
          </View>
        </View>

        {filteredItems.length > 0 ? (
          <View className={styles.recordList}>
            {filteredItems.map((item: Item) => (
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
                  <View className={styles.recordProgress}>
                    <View className={styles.progressSteps}>
                      <View className={`${styles.step} ${getProgressStep(item.status) >= 1 ? styles.stepActive : ''}`}>
                        <View className={styles.stepDot}></View>
                        <Text className={styles.stepText}>发布</Text>
                      </View>
                      <View className={`${styles.stepLine} ${getProgressStep(item.status) >= 2 ? styles.stepLineActive : ''}`}></View>
                      <View className={`${styles.step} ${getProgressStep(item.status) >= 2 ? styles.stepActive : ''}`}>
                        <View className={styles.stepDot}></View>
                        <Text className={styles.stepText}>审核</Text>
                      </View>
                      <View className={`${styles.stepLine} ${getProgressStep(item.status) >= 3 ? styles.stepLineActive : ''}`}></View>
                      <View className={`${styles.step} ${getProgressStep(item.status) >= 3 ? styles.stepActive : ''}`}>
                        <View className={styles.stepDot}></View>
                        <Text className={styles.stepText}>预约</Text>
                      </View>
                      <View className={`${styles.stepLine} ${getProgressStep(item.status) >= 4 ? styles.stepLineActive : ''}`}></View>
                      <View className={`${styles.step} ${getProgressStep(item.status) >= 4 ? styles.stepActive : ''}`}>
                        <View className={styles.stepDot}></View>
                        <Text className={styles.stepText}>完成</Text>
                      </View>
                    </View>
                    <Text className={styles.stepHint}>{getStepText(item.status)}</Text>
                  </View>
                </View>
                <View className={styles.recordMeta}>
                  <Text className={styles.recordTime}>{item.createTime}</Text>
                  <Text className={styles.recordPoint}>{item.pickPoint}</Text>
                  {item.status === '待审核' && (
                    <View 
                      className={styles.actionBtn}
                      onClick={(e) => handleRevoke(item.id, e)}
                    >
                      撤回
                    </View>
                  )}
                  {(item.status === '已上架' || item.status === '已被预约') && (
                    <View 
                      className={styles.actionBtn}
                      onClick={(e) => handleOffline(item.id, e)}
                    >
                      下架
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyRecord}>
            <Text className={styles.emptyIcon}>📦</Text>
            <Text className={styles.emptyText}>
              {activeTab === 'pending' && '暂无待审核的发布'}
              {activeTab === 'available' && '暂无待领取的物品'}
              {activeTab === 'completed' && '暂无已完成或已下架的记录'}
            </Text>
            {activeTab !== 'completed' && (
              <Text className={styles.emptyHint}>去发布页发布您的爱心物资</Text>
            )}
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
