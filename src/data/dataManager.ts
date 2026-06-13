import Taro from '@tarojs/taro';
import { Item, Appointment, Message } from './mockData';

class DataManager {
  private static instance: DataManager;

  private constructor() {}

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private saveToStorage(key: string, data: any) {
    try {
      Taro.setStorageSync(key, data);
      const app = Taro.getApp();
      if (app.globalData) {
        app.globalData[key] = data;
      }
    } catch (e) {
      console.error(`[DataManager] Failed to save ${key}:`, e);
    }
  }

  private loadFromStorage(key: string, defaultValue: any = null) {
    try {
      const data = Taro.getStorageSync(key);
      return data || defaultValue;
    } catch (e) {
      console.error(`[DataManager] Failed to load ${key}:`, e);
      return defaultValue;
    }
  }

  // 我的发布管理
  getMyPublishedItems(): Item[] {
    return this.loadFromStorage('myPublishedItems', []);
  }

  setMyPublishedItems(items: Item[]) {
    this.saveToStorage('myPublishedItems', items);
  }

  addPublishedItem(item: Item) {
    const items = this.getMyPublishedItems();
    items.unshift(item);
    this.setMyPublishedItems(items);
  }

  updatePublishedItem(itemId: string, updates: Partial<Item>) {
    const items = this.getMyPublishedItems();
    const updated = items.map(item => {
      if (item.id === itemId) {
        return { ...item, ...updates };
      }
      return item;
    });
    this.setMyPublishedItems(updated);
    return updated;
  }

  getPublishedItem(itemId: string): Item | null {
    const items = this.getMyPublishedItems();
    return items.find(item => item.id === itemId) || null;
  }

  // 交接记录管理
  getAppointments(): Appointment[] {
    return this.loadFromStorage('myAppointments', []);
  }

  setAppointments(appointments: Appointment[]) {
    this.saveToStorage('myAppointments', appointments);
  }

  addAppointment(appointment: Appointment) {
    const appointments = this.getAppointments();
    appointments.unshift(appointment);
    this.setAppointments(appointments);
  }

  updateAppointment(appointmentId: string, updates: Partial<Appointment>) {
    const appointments = this.getAppointments();
    const updated = appointments.map(apt => {
      if (apt.id === appointmentId) {
        return { ...apt, ...updates };
      }
      return apt;
    });
    this.setAppointments(updated);
    return updated;
  }

  getAppointment(appointmentId: string): Appointment | null {
    const appointments = this.getAppointments();
    return appointments.find(apt => apt.id === appointmentId) || null;
  }

  // 消息管理
  getMessages(): Message[] {
    return this.loadFromStorage('myMessages', []);
  }

  setMessages(messages: Message[]) {
    this.saveToStorage('myMessages', messages);
  }

  addMessage(message: Message) {
    const messages = this.getMessages();
    messages.unshift(message);
    this.setMessages(messages);
  }

  markMessageAsRead(messageId: string) {
    const messages = this.getMessages();
    const updated = messages.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, status: '已读' as const };
      }
      return msg;
    });
    this.setMessages(updated);
    return updated;
  }

  markAllMessagesAsRead() {
    const messages = this.getMessages();
    const updated = messages.map(msg => ({ ...msg, status: '已读' as const }));
    this.setMessages(updated);
    return updated;
  }

  // 状态同步方法
  onItemStatusChanged(itemId: string, newStatus: string) {
    this.updatePublishedItem(itemId, { status: newStatus });

    let messageType = '';
    let messageTitle = '';
    let messageContent = '';

    switch (newStatus) {
      case '已上架':
        messageType = '审核';
        messageTitle = '您的捐赠物品已通过审核';
        messageContent = '您提交的物品已审核通过，正在等待爱心人士预约';
        break;
      case '已被预约':
        messageType = '预约';
        messageTitle = '有新用户预约您的物品';
        messageContent = '用户预约了您的物品，请及时确认交接时间';
        break;
      case '已完成':
        messageType = '交接';
        messageTitle = '物品交接已完成';
        messageContent = '恭喜！您的爱心物资已成功交付，感谢您的捐赠';
        break;
      case '已下架':
        messageType = '审核';
        messageTitle = '您的物品已下架';
        messageContent = '您的物品已成功下架，如需重新发布请前往发布页';
        break;
    }

    if (messageType) {
      this.addMessage({
        id: `msg_${Date.now()}`,
        type: messageType as any,
        title: messageTitle,
        content: messageContent,
        status: '未读',
        createTime: new Date().toLocaleString('zh-CN'),
        relatedId: itemId
      });
    }
  }

  onAppointmentStatusChanged(appointmentId: string, updates: Partial<Appointment>) {
    this.updateAppointment(appointmentId, updates);
  }
}

export default DataManager.getInstance();
