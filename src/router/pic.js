const Tabbar = () => import('@/components/Tabbar/');

export default [
  {
    path: '/pic',
    name: 'pic',
    meta: {
      login: true,
      showHeader:true,
      title:"AI绘图"
    },
    components: { 
      default: () => import('@/views/items/pic'),
      tabbar: Tabbar 
    }
  }
];
