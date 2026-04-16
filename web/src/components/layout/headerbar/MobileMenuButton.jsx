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
import { Button } from '@douyinfe/semi-ui';
import { IconClose, IconMenu } from '@douyinfe/semi-icons';

const MobileMenuButton = ({
  isConsoleRoute,
  isMobile,
  drawerOpen,
  collapsed,
  useLightText,
  onToggle,
  t,
}) => {
  if (!isConsoleRoute || !isMobile) {
    return null;
  }

  const triggerClasses = useLightText
    ? '!w-10 !h-10 !min-w-0 !p-0 !text-white focus:!bg-white/10 !rounded-full !bg-white/7 hover:!bg-white/14 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
    : '!p-2 !text-current focus:!bg-semi-color-fill-1 dark:focus:!bg-gray-700';

  return (
    <Button
      icon={
        (isMobile ? drawerOpen : collapsed) ? (
          <IconClose className='text-lg' />
        ) : (
          <IconMenu className='text-lg' />
        )
      }
      aria-label={
        (isMobile ? drawerOpen : collapsed) ? t('关闭侧边栏') : t('打开侧边栏')
      }
      onClick={onToggle}
      theme='borderless'
      type='tertiary'
      className={triggerClasses}
    />
  );
};

export default MobileMenuButton;
