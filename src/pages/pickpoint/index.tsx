import React, { useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { PickPoint, Organization } from '@/data/mockData';
import { mockOrganizations } from '@/data/mockData';

const PickpointPage: React.FC = () => {
  const [searchKey, setSearchKey] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<PickPoint | null>(null);
  const [allPoints, setAllPoints] = useState<PickPoint[]>(() => {
    const points: PickPoint[] = [];
    mockOrganizations.forEach((org: Organization) => {
      org.pickPoints.forEach((point) => {
        points.push(point);
      });
    });
    return points;
  });

  const filteredPoints = searchKey
    ? allPoints.filter(p => 
        p.name.includes(searchKey) || 
        p.address.includes(searchKey)
      )
    : allPoints;

  const handleRefreshLocation = () => {
    Taro.showToast({
      title: '正在获取位置...',
      icon: 'loading',
      duration: 1000
    });
  };

  const handleSelectPoint = (point: PickPoint) => {
    setSelectedPoint(point);
    
    try {
      Taro.setStorageSync('selectedPickPoint', point);
    } catch (e) {
      console.error('[Pickpoint] Failed to save pick point:', e);
    }
    
    Taro.showToast({
      title: `已选择: ${point.name}`,
      icon: 'success'
    });
    
    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  };

  return (
    <View className={styles.page}>
      <View className={styles.searchBar}>
        <Text className={styles.searchIcon}>🔍</Text>
        <Input
          placeholder="搜索领取点名称或地址"
          value={searchKey}
          onInput={(e) => setSearchKey(e.detail.value)}
        />
      </View>

      <View className={styles.currentLocation}>
        <View className={styles.locationHeader}>
          <Text className={styles.locationTitle}>当前位置</Text>
          <View className={styles.refreshBtn} onClick={handleRefreshLocation}>
            重新定位
          </View>
        </View>
        <View className={styles.locationInfo}>
          <Text className={styles.locationIcon}>📍</Text>
          <Text className={styles.locationText}>北京市朝阳区望京街道</Text>
        </View>
      </View>

      <Text className={styles.sectionTitle}>附近领取点</Text>

      <ScrollView scrollY>
        <View className={styles.pointList}>
          {filteredPoints.map((point) => (
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
              <View 
                className={`${styles.selectBtn} ${selectedPoint?.id === point.id ? styles.selected : ''}`}
                onClick={() => handleSelectPoint(point)}
              >
                {selectedPoint?.id === point.id ? '已选择' : '选择此领取点'}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default PickpointPage;
