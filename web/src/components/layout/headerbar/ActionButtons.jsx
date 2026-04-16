/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React from 'react';
import NewYearButton from './NewYearButton';
import NotificationButton from './NotificationButton';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import UserArea from './UserArea';

const ActionButtons = ({
  isNewYear,
  unreadCount,
  onNoticeOpen,
  useLightText,
  theme,
  onThemeToggle,
  currentLang,
  onLanguageChange,
  userState,
  isLoading,
  isMobile,
  isSelfUseMode,
  logout,
  navigate,
  t,
}) => {
  return (
    <div
      className={`flex items-center ${useLightText ? 'gap-1.5 md:gap-2' : 'gap-2 md:gap-3'}`}
    >
      <NewYearButton isNewYear={isNewYear} useLightText={useLightText} />

      <NotificationButton
        unreadCount={unreadCount}
        onNoticeOpen={onNoticeOpen}
        useLightText={useLightText}
        t={t}
      />

      <ThemeToggle
        theme={theme}
        onThemeToggle={onThemeToggle}
        useLightText={useLightText}
        t={t}
      />

      <LanguageSelector
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        useLightText={useLightText}
        t={t}
      />

      <UserArea
        userState={userState}
        isLoading={isLoading}
        isMobile={isMobile}
        isSelfUseMode={isSelfUseMode}
        logout={logout}
        useLightText={useLightText}
        navigate={navigate}
        t={t}
      />
    </div>
  );
};

export default ActionButtons;
