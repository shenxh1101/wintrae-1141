import React, { useState, useEffect } from 'react';
import { View, Text, Image, Input, Textarea, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { mockOrganizations } from '@/data/mockData';
import { PickPoint } from '@/data/mockData';
import DataManager from '@/data/dataManager';

const categories = ['图书', '服装', '母婴用品', '学习用品', '家用电器', '其他'];
const conditions = ['全新', '九成新', '八成新', '七成新'];
const timeOptions = ['随时可约', '工作日18:00后', '周末全天', '指定时间'];

const PublishPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [condition, setCondition] = useState('');
  const [pickPoint, setPickPoint] = useState<PickPoint>(mockOrganizations[0].pickPoints[0]);
  const [timeOption, setTimeOption] = useState('');

  useEffect(() => {
    loadSavedPickPoint();
  }, []);

  useDidShow(() => {
    loadSavedPickPoint();
  });

  const loadSavedPickPoint = () => {
    try {
      const savedPoint = Taro.getStorageSync('selectedPickPoint');
      if (savedPoint) {
        setPickPoint(savedPoint);
      }
    } catch (e) {
      console.error('[Publish] Failed to load saved pick point:', e);
    }
  };

  const handleAddPhoto = () => {
    Taro.chooseImage({
      count: 9 - photos.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setPhotos([...photos, ...res.tempFilePaths]);
      }
    });
  };

  const handleDeletePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleSelectPickPoint = () => {
    Taro.navigateTo({
      url: '/pages/pickpoint/index'
    });
  };

  const handleSubmit = () => {
    if (!title) {
      Taro.showToast({ title: '请输入物品名称', icon: 'none' });
      return;
    }
    if (!category) {
      Taro.showToast({ title: '请选择物品分类', icon: 'none' });
      return;
    }
    if (!description) {
      Taro.showToast({ title: '请填写物品描述', icon: 'none' });
      return;
    }
    if (photos.length === 0) {
      Taro.showToast({ title: '请上传物品照片', icon: 'none' });
      return;
    }
    if (!condition) {
      Taro.showToast({ title: '请选择新旧程度', icon: 'none' });
      return;
    }
    if (!timeOption) {
      Taro.showToast({ title: '请选择可交接时间', icon: 'none' });
      return;
    }

    Taro.showLoading({ title: '提交中...' });

    const newItem = {
      id: `item_${Date.now()}`,
      title,
      category,
      description,
      condition: condition as any,
      images: photos,
      status: '待审核',
      pickPoint: pickPoint.name,
      pickPointAddress: pickPoint.address,
      availableTime: timeOption,
      createTime: new Date().toLocaleString('zh-CN'),
      userId: 'current_user',
      userName: '爱心用户',
      userAvatar: 'https://picsum.photos/id/64/200/200'
    };

    DataManager.addPublishedItem(newItem);

    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({
        title: '提交成功，等待审核',
        icon: 'success'
      });

      setTimeout(() => {
        Taro.switchTab({
          url: '/pages/profile/index'
        });
      }, 1500);
    }, 1000);
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>发布捐赠物品</Text>
        <Text className={styles.subtitle}>感谢您的爱心，每一份捐赠都将温暖他人</Text>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formTitle}>物品信息</Text>
        
        <View className={styles.formItem}>
          <Text className={styles.label}>物品名称</Text>
          <Input
            className={styles.input}
            placeholder="请输入物品名称"
            value={title}
            onInput={(e) => setTitle(e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>物品分类</Text>
          <View className={styles.categorySelect}>
            {categories.map((cat) => (
              <View
                key={cat}
                className={`${styles.categoryItem} ${category === cat ? styles.active : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>物品描述</Text>
          <Textarea
            className={styles.textarea}
            placeholder="请详细描述物品的品牌、规格、用途等信息"
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formTitle}>物品照片</Text>
        <View className={styles.photoUpload}>
          {photos.map((photo, index) => (
            <View key={index} className={styles.photoItem}>
              <Image src={photo} mode="aspectFill" />
              <View className={styles.deleteBtn} onClick={() => handleDeletePhoto(index)}>
                ×
              </View>
            </View>
          ))}
          {photos.length < 9 && (
            <View className={styles.addPhoto} onClick={handleAddPhoto}>
              <Text className={styles.icon}>+</Text>
              <Text className={styles.text}>添加照片</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formTitle}>新旧程度</Text>
        <View className={styles.conditionSelect}>
          {conditions.map((cond) => (
            <View
              key={cond}
              className={`${styles.conditionItem} ${condition === cond ? styles.active : ''}`}
              onClick={() => setCondition(cond)}
            >
              {cond}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formTitle}>领取点选择</Text>
        <View className={styles.pickPointCard} onClick={handleSelectPickPoint}>
          <View className={styles.pointInfo}>
            <Text className={styles.pointName}>{pickPoint.name}</Text>
            <Text className={styles.pointAddress}>{pickPoint.address}</Text>
          </View>
          <Text className={styles.arrow}>›</Text>
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formTitle}>可交接时间</Text>
        <View className={styles.timeSelect}>
          <View className={styles.timeOptions}>
            {timeOptions.map((time) => (
              <View
                key={time}
                className={`${styles.timeItem} ${timeOption === time ? styles.active : ''}`}
                onClick={() => setTimeOption(time)}
              >
                {time}
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.submitBtn}>
        <View className={styles.btn} onClick={handleSubmit}>
          提交发布
        </View>
      </View>
    </ScrollView>
  );
};

export default PublishPage;
