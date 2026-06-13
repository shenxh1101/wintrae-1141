export interface Item {
  id: string;
  title: string;
  category: string;
  description: string;
  condition: '全新' | '九成新' | '八成新' | '七成新' | '七成新以下';
  images: string[];
  status: '待审核' | '已上架' | '已被预约' | '已完成' | '已下架';
  pickPoint: string;
  pickPointAddress: string;
  availableTime: string;
  createTime: string;
  userId: string;
  userName: string;
  userAvatar: string;
}

export interface Demand {
  id: string;
  title: string;
  category: string;
  description: string;
  quantity: number;
  received: number;
  urgency: '紧急' | '急需' | '一般';
  orgId: string;
  orgName: string;
  orgAvatar: string;
  pickPoint: string;
  pickPointAddress: string;
  deadline: string;
  createTime: string;
}

export interface Organization {
  id: string;
  name: string;
  avatar: string;
  description: string;
  address: string;
  contact: string;
  pickPoints: PickPoint[];
  verified: boolean;
  followCount: number;
}

export interface PickPoint {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  workTime: string;
}

export interface Message {
  id: string;
  type: '审核' | '预约' | '交接' | '评价';
  title: string;
  content: string;
  status: '未读' | '已读';
  createTime: string;
  relatedId?: string;
}

export interface Appointment {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  status: '待交接' | '交接中' | '已完成' | '已取消';
  handoverCode: string;
  appointmentTime: string;
  pickPoint: string;
  pickPointAddress: string;
  donorName: string;
  receiverName: string;
  createTime: string;
  completeTime?: string;
  rating?: number;
  ratingContent?: string;
}

export const mockItems: Item[] = [
  {
    id: '1',
    title: '九成新儿童绘本套装',
    category: '图书',
    description: '孩子长大后闲置的绘本，共15本，适合3-6岁儿童阅读',
    condition: '九成新',
    images: [
      'https://picsum.photos/id/292/300/300',
      'https://picsum.photos/id/326/300/300'
    ],
    status: '已上架',
    pickPoint: '社区爱心驿站',
    pickPointAddress: '朝阳区望京街道123号',
    availableTime: '周一至周六 9:00-18:00',
    createTime: '2024-01-15 10:30',
    userId: 'user1',
    userName: '张女士',
    userAvatar: 'https://picsum.photos/id/64/200/200'
  },
  {
    id: '2',
    title: '九五新婴儿推车',
    category: '母婴用品',
    description: '轻便型婴儿推车，可躺可坐，适合0-3岁宝宝',
    condition: '九成新',
    images: [
      'https://picsum.photos/id/237/300/300'
    ],
    status: '已被预约',
    pickPoint: '海淀区中关村服务站',
    pickPointAddress: '海淀区中关村大街456号',
    availableTime: '周日 10:00-17:00',
    createTime: '2024-01-14 15:20',
    userId: 'user2',
    userName: '李先生',
    userAvatar: 'https://picsum.photos/id/91/200/200'
  },
  {
    id: '3',
    title: '八成新冬季棉衣',
    category: '服装',
    description: '成人男士棉服，尺码L，适合身高170-175cm',
    condition: '八成新',
    images: [
      'https://picsum.photos/id/103/300/300'
    ],
    status: '已上架',
    pickPoint: '东城区东直门站点',
    pickPointAddress: '东城区东直门南大街789号',
    availableTime: '工作日18:00后',
    createTime: '2024-01-13 09:15',
    userId: 'user3',
    userName: '王先生',
    userAvatar: 'https://picsum.photos/id/177/200/200'
  },
  {
    id: '4',
    title: '全新未拆封书包',
    category: '学习用品',
    description: '品牌书包，适合小学生，多色可选',
    condition: '全新',
    images: [
      'https://picsum.photos/id/119/300/300'
    ],
    status: '已上架',
    pickPoint: '社区爱心驿站',
    pickPointAddress: '朝阳区望京街道123号',
    availableTime: '随时可约',
    createTime: '2024-01-12 14:40',
    userId: 'user4',
    userName: '刘女士',
    userAvatar: 'https://picsum.photos/id/338/200/200'
  },
  {
    id: '5',
    title: '九成新小家电-电饭煲',
    category: '家用电器',
    description: '智能电饭煲，3L容量，适合2-4人家庭使用',
    condition: '九成新',
    images: [
      'https://picsum.photos/id/9/300/300'
    ],
    status: '待审核',
    pickPoint: '丰台区公益中心',
    pickPointAddress: '丰台区西罗园街道234号',
    availableTime: '周末全天',
    createTime: '2024-01-11 11:20',
    userId: 'user5',
    userName: '陈女士',
    userAvatar: 'https://picsum.photos/id/1027/200/200'
  }
];

export const mockDemands: Demand[] = [
  {
    id: '1',
    title: '急需儿童绘本',
    category: '图书',
    description: '社区儿童活动中心需要儿童绘本，用于建立社区图书角',
    quantity: 50,
    received: 23,
    urgency: '急需',
    orgId: 'org1',
    orgName: '朝阳区社区服务中心',
    orgAvatar: 'https://picsum.photos/id/64/200/200',
    pickPoint: '朝阳社区图书角',
    pickPointAddress: '朝阳区望京街道123号',
    deadline: '2024-02-01',
    createTime: '2024-01-10 08:00'
  },
  {
    id: '2',
    title: '需要冬季棉衣',
    category: '服装',
    description: '为偏远山区儿童募集冬季保暖衣物',
    quantity: 100,
    received: 67,
    urgency: '紧急',
    orgId: 'org2',
    orgName: '爱心传递基金会',
    orgAvatar: 'https://picsum.photos/id/91/200/200',
    pickPoint: '海淀区捐赠站',
    pickPointAddress: '海淀区中关村大街456号',
    deadline: '2024-01-31',
    createTime: '2024-01-08 10:30'
  },
  {
    id: '3',
    title: '募集学习用品',
    category: '学习用品',
    description: '新学期即将开始，为乡村学校募集文具和书包',
    quantity: 80,
    received: 45,
    urgency: '急需',
    orgId: 'org3',
    orgName: '希望工程办公室',
    orgAvatar: 'https://picsum.photos/id/177/200/200',
    pickPoint: '东城区教育捐赠点',
    pickPointAddress: '东城区东直门南大街789号',
    deadline: '2024-02-15',
    createTime: '2024-01-05 14:20'
  },
  {
    id: '4',
    title: '母婴用品需求',
    category: '母婴用品',
    description: '为新生儿家庭募集婴儿用品，包括奶瓶、衣物等',
    quantity: 30,
    received: 12,
    urgency: '一般',
    orgId: 'org4',
    orgName: '母婴关爱协会',
    orgAvatar: 'https://picsum.photos/id/338/200/200',
    pickPoint: '西城区母婴中心',
    pickPointAddress: '西城区金融街街道567号',
    deadline: '2024-03-01',
    createTime: '2024-01-03 09:45'
  },
  {
    id: '5',
    title: '家用电器募集',
    category: '家用电器',
    description: '为困难家庭募集基本家用电器',
    quantity: 20,
    received: 8,
    urgency: '一般',
    orgId: 'org5',
    orgName: '社区帮扶中心',
    orgAvatar: 'https://picsum.photos/id/1027/200/200',
    pickPoint: '丰台区公益中心',
    pickPointAddress: '丰台区西罗园街道234号',
    deadline: '2024-04-01',
    createTime: '2024-01-01 11:00'
  }
];

export const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: '朝阳区社区服务中心',
    avatar: 'https://picsum.photos/id/64/200/200',
    description: '致力于为社区居民提供便民服务，组织各类公益活动',
    address: '朝阳区望京街道123号',
    contact: '010-12345678',
    pickPoints: [
      {
        id: 'pp1',
        name: '朝阳社区图书角',
        address: '朝阳区望京街道123号',
        distance: '500m',
        phone: '010-12345678',
        workTime: '周一至周日 9:00-18:00'
      }
    ],
    verified: true,
    followCount: 1234
  },
  {
    id: 'org2',
    name: '爱心传递基金会',
    avatar: 'https://picsum.photos/id/91/200/200',
    description: '专注扶贫济困，帮助弱势群体改善生活',
    address: '海淀区中关村大街456号',
    contact: '010-23456789',
    pickPoints: [
      {
        id: 'pp2',
        name: '海淀区捐赠站',
        address: '海淀区中关村大街456号',
        distance: '1.2km',
        phone: '010-23456789',
        workTime: '周二至周日 10:00-17:00'
      }
    ],
    verified: true,
    followCount: 5678
  },
  {
    id: 'org3',
    name: '希望工程办公室',
    avatar: 'https://picsum.photos/id/177/200/200',
    description: '支持教育事业发展，帮助贫困学生完成学业',
    address: '东城区东直门南大街789号',
    contact: '010-34567890',
    pickPoints: [
      {
        id: 'pp3',
        name: '东城区教育捐赠点',
        address: '东城区东直门南大街789号',
        distance: '800m',
        phone: '010-34567890',
        workTime: '周一至周五 9:00-17:00'
      }
    ],
    verified: true,
    followCount: 3456
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    type: '审核',
    title: '您的捐赠物品已通过审核',
    content: '您提交的"九成新儿童绘本套装"已审核通过，正在等待爱心人士预约',
    status: '未读',
    createTime: '2024-01-15 14:30',
    relatedId: '1'
  },
  {
    id: '2',
    type: '预约',
    title: '有新用户预约您的物品',
    content: '用户王小明预约了您的"九成新儿童绘本套装"，请及时确认交接时间',
    status: '未读',
    createTime: '2024-01-15 10:15',
    relatedId: '1'
  },
  {
    id: '3',
    type: '交接',
    title: '交接即将开始',
    content: '您与王小明的物品交接将于今天下午3点在社区爱心驿站进行',
    status: '已读',
    createTime: '2024-01-15 08:00',
    relatedId: 'ap1'
  },
  {
    id: '4',
    type: '评价',
    title: '收到爱心评价',
    content: '王小明对您的捐赠给出了5星好评，感谢您的爱心！',
    status: '已读',
    createTime: '2024-01-14 18:20',
    relatedId: 'ap1'
  },
  {
    id: '5',
    type: '审核',
    title: '您的物品审核未通过',
    content: '很抱歉，您提交的"旧手机"因不符合捐赠要求未通过审核',
    status: '已读',
    createTime: '2024-01-13 16:45',
    relatedId: '6'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'ap1',
    itemId: '1',
    itemTitle: '九成新儿童绘本套装',
    itemImage: 'https://picsum.photos/id/292/300/300',
    status: '已完成',
    handoverCode: 'HD2024011501',
    appointmentTime: '2024-01-15 15:00',
    pickPoint: '社区爱心驿站',
    pickPointAddress: '朝阳区望京街道123号',
    donorName: '张女士',
    receiverName: '王小明',
    createTime: '2024-01-14 20:00',
    completeTime: '2024-01-15 15:30',
    rating: 5,
    ratingContent: '绘本质地很好，孩子很喜欢，感谢！'
  },
  {
    id: 'ap2',
    itemId: '4',
    itemTitle: '全新未拆封书包',
    itemImage: 'https://picsum.photos/id/119/300/300',
    status: '待交接',
    handoverCode: 'HD2024011601',
    appointmentTime: '2024-01-16 10:00',
    pickPoint: '社区爱心驿站',
    pickPointAddress: '朝阳区望京街道123号',
    donorName: '刘女士',
    receiverName: '李小红',
    createTime: '2024-01-15 09:30'
  },
  {
    id: 'ap3',
    itemId: '3',
    itemTitle: '八成新冬季棉衣',
    itemImage: 'https://picsum.photos/id/103/300/300',
    status: '交接中',
    handoverCode: 'HD2024011502',
    appointmentTime: '2024-01-15 18:00',
    pickPoint: '东城区东直门站点',
    pickPointAddress: '东城区东直门南大街789号',
    donorName: '王先生',
    receiverName: '赵小明',
    createTime: '2024-01-14 15:20'
  }
];
