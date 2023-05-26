const Tabbar = () => import('@/components/Tabbar/');

export default [
  {
    path: '/share',
    name: 'share',
    components: {
      default: () => import('@/views/share/share'),
    },
    meta: {
      showHeader:true,
      title:"分享"
    }
  },
  
];
