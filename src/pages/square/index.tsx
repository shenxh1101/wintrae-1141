import React, { useState, useEffect } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { Demand } from '@/data/mockData';
import { mockDemands } from '@/data/mockData';

const categories = ['全部', '图书', '服装', '母婴用品', '学习用品', '家用电器', '其他'];

const SquarePage: React.FC = () => {
  const [searchKey, setSearchKey] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [demands, setDemands] = useState<Demand[]>([]);

  useEffect(() => {
    loadDemands();
  }, [activeCategory]);

  const loadDemands = () => {
    let filtered = [...mockDemands];
    
    if (activeCategory !== '全部') {
      filtered = filtered.filter(d => d.category === activeCategory);
    }
    
    if (searchKey) {
      filtered = filtered.filter(d => 
        d.title.includes(searchKey) || 
        d.description.includes(searchKey)
      );
    }
    
    setDemands(filtered);
  };

  const handleSearch = () => {
    loadDemands();
  };

  const handleViewDetail = (demandId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${demandId}&type=demand`
    });
  };

  const getUrgencyClass = (urgency: string) => {
    switch (urgency) {
      case '紧急': return styles.urgent;
      case '急需': return styles.needed;
      default: return styles.normal;
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.searchBar}>
        <View className={styles.searchBox}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            placeholder="搜索需求关键词"
            value={searchKey}
            onInput={(e) => setSearchKey(e.detail.value)}
            onConfirm={handleSearch}
          />
        </View>
      </View>

      <ScrollView className={styles.categoryTabs} scrollX enableFlex>
        <View className={styles.tabsContainer}>
          {categories.map((cat) => (
            <View
              key={cat}
              className={`${styles.tabItem} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </View>
          ))}
        </View>
      </ScrollView>

      <ScrollView className={styles.demandList} scrollY>
        {demands.length > 0 ? (
          demands.map((demand) => (
            <View 
              key={demand.id} 
              className={styles.demandCard}
              onClick={() => handleViewDetail(demand.id)}
            >
              <View className={styles.cardHeader}>
                <View className={`${styles.urgencyTag} ${getUrgencyClass(demand.urgency)}`}>
                  {demand.urgency}
                </View>
                <Text className={styles.deadline}>截止: {demand.deadline}</Text>
              </View>

              <Text className={styles.title}>{demand.title}</Text>
              <Text className={styles.description}>{demand.description}</Text>

              <View className={styles.progressSection}>
                <View className={styles.progressInfo}>
                  <Text className={styles.progressText}>
                    已募集: <Text className={styles.count}>{demand.received}</Text> / {demand.quantity}
                  </Text>
                  <Text className={styles.progressPercent}>
                    {Math.round((demand.received / demand.quantity) * 100)}%
                  </Text>
                </View>
                <View className={styles.progressBar}>
                  <View 
                    className={styles.progressFill}
                    style={{ width: `${(demand.received / demand.quantity) * 100}%` }}
                  />
                </View>
              </View>

              <View className={styles.orgInfo}>
                <Image className={styles.avatar} src={demand.orgAvatar} />
                <Text className={styles.orgName}>{demand.orgName}</Text>
                <Text className={styles.pickPoint}>{demand.pickPoint}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📦</Text>
            <Text className={styles.emptyText}>暂无相关需求</Text>
            <Text className={styles.emptyHint}>试试其他分类或关键词</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SquarePage;
