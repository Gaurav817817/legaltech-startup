'use client';
import dynamic from 'next/dynamic';

const HeroChatWidget = dynamic(() => import('./HeroChatWidget'), {
  ssr: false,
  loading: () => (
    <div
      className="bg-white rounded-[28px] shadow-2xl w-full lg:w-[400px]"
      style={{ height: '500px' }}
    />
  ),
});

export default HeroChatWidget;
