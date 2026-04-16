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

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Dropdown, Typography } from '@douyinfe/semi-ui';
import { ChevronDown } from 'lucide-react';
import { IconExit } from '@douyinfe/semi-icons';
import { stringToColor } from '../../../helpers';
import SkeletonWrapper from '../components/SkeletonWrapper';

const UserArea = ({
  userState,
  isLoading,
  isMobile,
  isSelfUseMode,
  logout,
  useLightText,
  t,
}) => {
  const dropdownRef = useRef(null);
  if (isLoading) {
    return (
      <SkeletonWrapper
        loading={true}
        type='userArea'
        width={50}
        isMobile={isMobile}
      />
    );
  }

  if (userState.user) {
    const triggerClasses = useLightText
      ? 'flex items-center gap-1.5 !h-10 !px-2.5 !rounded-full !bg-white/7 hover:!bg-white/14 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
      : 'flex items-center gap-1.5 !p-1 !rounded-full hover:!bg-semi-color-fill-1 dark:hover:!bg-gray-700 !bg-semi-color-fill-0 dark:!bg-semi-color-fill-1 dark:hover:!bg-semi-color-fill-2';

    return (
      <div className='relative' ref={dropdownRef}>
        <Dropdown
          position='bottomRight'
          getPopupContainer={() => dropdownRef.current}
          render={
            <Dropdown.Menu className='!bg-semi-color-bg-overlay !border-semi-color-border !shadow-lg !rounded-lg dark:!bg-gray-700 dark:!border-gray-600'>
              <Dropdown.Item
                onClick={logout}
                className='!px-3 !py-1.5 !text-sm !text-semi-color-text-0 hover:!bg-semi-color-fill-1 dark:!text-gray-200 dark:hover:!bg-red-500 dark:hover:!text-white'
              >
                <div className='flex items-center gap-2'>
                  <IconExit
                    size='small'
                    className='text-gray-500 dark:text-gray-400'
                  />
                  <span>{t('退出')}</span>
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Button
            theme='borderless'
            type='tertiary'
            className={triggerClasses}
          >
            <Avatar
              size='extra-small'
              color={stringToColor(userState.user.username)}
              className='mr-1'
            >
              {userState.user.username[0].toUpperCase()}
            </Avatar>
            <span className='hidden md:inline'>
              <Typography.Text
                className={`!text-xs !font-medium mr-1 ${useLightText ? '!text-white' : '!text-semi-color-text-1 dark:!text-gray-300'}`}
                style={useLightText ? { color: '#ffffff' } : undefined}
              >
                {userState.user.username}
              </Typography.Text>
            </span>
            <ChevronDown
              size={14}
              className={`text-xs ${useLightText ? 'text-white/80' : 'text-semi-color-text-2 dark:text-gray-400'}`}
            />
          </Button>
        </Dropdown>
      </div>
    );
  } else {
    const showRegisterButton = !isSelfUseMode;

    const commonSizingAndLayoutClass =
      'flex items-center justify-center !py-[10px] !px-1.5';

    const loginButtonSpecificStyling = useLightText
      ? '!h-10 !bg-white/7 hover:!bg-white/14 !border !border-white/10 !text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors'
      : '!bg-semi-color-fill-0 dark:!bg-semi-color-fill-1 hover:!bg-semi-color-fill-1 dark:hover:!bg-gray-700 transition-colors';
    let loginButtonClasses = `${commonSizingAndLayoutClass} ${loginButtonSpecificStyling}`;

    let registerButtonClasses = useLightText
      ? `${commonSizingAndLayoutClass} !h-10 !bg-white/10 hover:!bg-white/18 !border !border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]`
      : `${commonSizingAndLayoutClass}`;

    const loginButtonTextSpanClass = useLightText
      ? '!text-xs !p-1.5'
      : '!text-xs !text-semi-color-text-1 dark:!text-gray-300 !p-1.5';
    const registerButtonTextSpanClass = '!text-xs !p-1.5';

    if (showRegisterButton) {
      if (isMobile) {
        loginButtonClasses += ' !rounded-full';
      } else {
        loginButtonClasses += ' !rounded-l-full !rounded-r-none';
      }
      registerButtonClasses += ' !rounded-r-full !rounded-l-none';
    } else {
      loginButtonClasses += ' !rounded-full';
    }

    return (
      <div className='flex items-center'>
        <Link to='/login' className='flex'>
          <Button
            theme='borderless'
            type='tertiary'
            className={loginButtonClasses}
          >
            <span
              className={loginButtonTextSpanClass}
              style={useLightText ? { color: '#ffffff' } : undefined}
            >
              {t('登录')}
            </span>
          </Button>
        </Link>
        {showRegisterButton && (
          <div className='hidden md:block'>
            <Link to='/register' className='flex -ml-px'>
              <Button
                theme={useLightText ? 'borderless' : 'solid'}
                type={useLightText ? 'tertiary' : 'primary'}
                className={registerButtonClasses}
              >
                <span
                  className={registerButtonTextSpanClass}
                  style={{ color: '#ffffff' }}
                >
                  {t('注册')}
                </span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }
};

export default UserArea;
