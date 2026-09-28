'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import GooeySvgFilter from '@/components/ui/GooeySvgFilter';
import useDetectBrowser from '@/hooks/use-detect-browser';
import useScreenSize from '@/hooks/use-screen-size';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface GooeyFolderTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
  className?: string;
  cardBgColor?: string;
  activeTabColor?: string;
}

export default function GooeyFolderTabs({
  tabs,
  activeTab,
  onTabChange,
  children,
  className = '',
  cardBgColor = '#121915',
  activeTabColor = '#16221b',
}: GooeyFolderTabsProps) {
  const [isGooeyEnabled] = useState(true);
  const screenSize = useScreenSize();
  const browserName = useDetectBrowser();
  const isSafari = browserName === 'Safari';

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <div className={`relative w-full ${className}`}>
      {/* SVG Gooey filter definition */}
      <GooeySvgFilter
        id="gooey-folder-filter"
        strength={screenSize.lessThan('md') ? 8 : 14}
      />

      {/* ── Gooey Filter Layer (Active Tab + Content Panel Container) ── */}
      <div className="relative w-full">
        {/* Background Canvas with SVG Filter */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ filter: isGooeyEnabled ? 'url(#gooey-folder-filter)' : 'none' }}
        >
          {/* Tab Background Row */}
          <div className="flex w-full gap-1 px-1">
            {tabs.map((tab, idx) => (
              <div key={tab.id} className="relative flex-1 h-11 md:h-12">
                {safeActiveIndex === idx && (
                  <motion.div
                    layoutId="gooey-active-tab"
                    className="absolute inset-0 rounded-t-2xl shadow-xl"
                    style={{ backgroundColor: cardBgColor }}
                    transition={{
                      type: 'spring',
                      bounce: 0.08,
                      duration: isSafari ? 0 : 0.35,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Main Card Body that melts with active tab */}
          <div
            className="w-full rounded-b-3xl rounded-tr-3xl shadow-2xl min-h-[300px]"
            style={{ backgroundColor: cardBgColor }}
          />
        </div>

        {/* ── Foreground Interactive Elements (No Filter = 100% Crisp Text) ── */}
        <div className="relative z-10">
          {/* Clickable Tab Buttons */}
          <div className="flex w-full gap-1 px-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = safeActiveIndex === idx;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex-1 min-w-[120px] md:min-w-0 h-11 md:h-12 px-3 py-2 flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer select-none rounded-t-2xl ${
                    isActive
                      ? 'text-[#2dd4bf] font-black'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#2dd4bf]' : 'text-[#6b7280]'}`} />}
                  <span className="truncate">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#2dd4bf]/20 text-[#2dd4bf]'
                          : 'bg-[#1b2720] text-[#9ca3af]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Animated Content Panel */}
          <div className="w-full p-4 sm:p-6 md:p-8 rounded-b-3xl min-h-[300px] border-t border-transparent">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  y: 18,
                  filter: 'blur(6px)',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                }}
                exit={{
                  opacity: 0,
                  y: -18,
                  filter: 'blur(6px)',
                }}
                transition={{
                  duration: 0.22,
                  ease: 'easeOut',
                }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
